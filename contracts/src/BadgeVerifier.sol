// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "./libraries/ProofOfSQL.sol";
import {SafeERC20, IERC20} from "@openzeppelin-contracts-5.2.0/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin-contracts-5.2.0/access/Ownable.sol";

interface IBlockBadge {
    function mint(address to, uint256 badgeTypeId) external;
    function hasBadge(address wallet, uint256 badgeTypeId) external view returns (bool);
}

/// @title BadgeVerifier — On-chain ZK-proven badge verification via SXT Query Router
/// @notice Submits SQL queries to the SXT Query Router, receives ZK-proven callbacks,
///         and mints SBT badges via BlockBadge when the result meets the threshold.
contract BadgeVerifier is Ownable {
    using SafeERC20 for IERC20;

    // ─── State ───────────────────────────────────────────────
    IBlockBadge public blockBadge;

    /// @dev badgeTypeId => hex-encoded proof plan (EVM query plan from SXT RPC)
    mapping(uint256 => bytes) public badgeQueryPlans;

    /// @dev badgeTypeId => minimum numeric value to qualify
    mapping(uint256 => uint256) public badgeThresholds;

    /// @dev badgeTypeId => column index in result table to read
    mapping(uint256 => uint256) public badgeResultColumns;

    struct PendingQuery {
        address wallet;
        uint256 badgeTypeId;
    }

    /// @dev queryId => pending query info
    mapping(bytes32 => PendingQuery) public pendingQueries;

    // ─── Constants ───────────────────────────────────────────
    uint256 public constant QUERY_PAYMENT = 100 ether; // 100 SXT deposit per query

    // ─── Events ──────────────────────────────────────────────
    event BadgeVerified(
        address indexed wallet,
        uint256 indexed badgeTypeId,
        bool qualified,
        bytes32 queryId
    );
    event QuerySubmitted(
        address indexed wallet,
        uint256 indexed badgeTypeId,
        bytes32 queryId
    );

    // ─── Errors ──────────────────────────────────────────────
    error NoBadgeQueryPlan();
    error InsufficientAllowance();
    error UnauthorizedCaller();
    error QueryNotPending();
    error BadgeAlreadyMinted();
    error BlockBadgeNotSet();

    // ─── Constructor ─────────────────────────────────────────
    constructor(address _blockBadge, address initialOwner) Ownable(initialOwner) {
        blockBadge = IBlockBadge(_blockBadge);
    }

    // ─── Main: Submit verification query ─────────────────────
    /// @notice Submit an on-chain query to verify a badge. Requires SXT token approval.
    /// @dev User must first approve this contract to spend 100 SXT.
    ///      Flow: approve SXT → call verifyBadge → wait for callback → badge minted if qualified.
    /// @param badgeTypeId The badge type to verify (1-17)
    function verifyBadge(uint256 badgeTypeId) external {
        if (address(blockBadge) == address(0)) revert BlockBadgeNotSet();
        if (blockBadge.hasBadge(msg.sender, badgeTypeId)) revert BadgeAlreadyMinted();

        bytes memory queryPlan = badgeQueryPlans[badgeTypeId];
        if (queryPlan.length == 0) revert NoBadgeQueryPlan();

        // Check SXT allowance
        uint256 allowance = IERC20(SXT).allowance(msg.sender, address(this));
        if (allowance < QUERY_PAYMENT) revert InsufficientAllowance();

        // Build wallet address parameter ($1)
        bytes[] memory params = new bytes[](1);
        params[0] = ParamsBuilder.serializeAddress(msg.sender);

        // Build Query struct
        IQueryRouter.Query memory query = IQueryRouter.Query({
            innerQuery: queryPlan,
            parameters: ParamsBuilder.serializeParamArray(params),
            version: VERSION,
            metadata: ""
        });

        // Build Callback struct
        IQueryRouter.Callback memory callback = IQueryRouter.Callback({
            callbackContract: address(this),
            selector: BadgeVerifier.queryCallback.selector,
            gasLimit: 200_000,
            maxGasPrice: 10 gwei,
            callbackData: abi.encode(msg.sender, badgeTypeId)
        });

        // Build Payment struct
        IQueryRouter.Payment memory payment = IQueryRouter.Payment({
            paymentAmount: QUERY_PAYMENT,
            refundTo: msg.sender,
            timeout: uint64(block.timestamp + 1 hours)
        });

        // Transfer SXT from user, approve to Query Router
        IERC20(SXT).safeTransferFrom(msg.sender, address(this), QUERY_PAYMENT);
        IERC20(SXT).safeIncreaseAllowance(QUERY_ROUTER, QUERY_PAYMENT);

        // Submit query
        bytes32 queryId = IQueryRouter(QUERY_ROUTER).requestQuery(query, callback, payment);

        // Store pending query
        pendingQueries[queryId] = PendingQuery({
            wallet: msg.sender,
            badgeTypeId: badgeTypeId
        });

        emit QuerySubmitted(msg.sender, badgeTypeId, queryId);
    }

    // ─── Callback: Receive ZK-proven result ──────────────────
    /// @notice Called by the SXT Query Router Executor with the verified query result.
    /// @dev Only callable by the QUERY_ROUTER_EXECUTOR address.
    function queryCallback(
        bytes32 queryId,
        bytes calldata queryResult,
        bytes calldata /* callbackData */
    ) external {
        if (msg.sender != QUERY_ROUTER_EXECUTOR) revert UnauthorizedCaller();

        PendingQuery memory pending = pendingQueries[queryId];
        if (pending.wallet == address(0)) revert QueryNotPending();
        delete pendingQueries[queryId];

        // Deserialize the ZK-proven result table
        (, ProofOfSqlTable.Table memory tableResult) =
            ProofOfSqlTable.__deserializeFromBytes(queryResult);

        // Read the result value from the configured column
        uint256 colIndex = badgeResultColumns[pending.badgeTypeId];
        bool qualified = false;

        // Try reading as Int128 column first (most numeric SXT results)
        try this._readInt128Column(tableResult, colIndex) returns (int128 value) {
            qualified = value >= 0 && uint256(uint128(value)) >= badgeThresholds[pending.badgeTypeId];
        } catch {
            // Try BigInt column
            try this._readBigIntColumn(tableResult, colIndex) returns (int256 value) {
                qualified = value >= 0 && uint256(value) >= badgeThresholds[pending.badgeTypeId];
            } catch {
                // Default: not qualified if can't read result
                qualified = false;
            }
        }

        // Mint badge if qualified
        if (qualified) {
            blockBadge.mint(pending.wallet, pending.badgeTypeId);
        }

        emit BadgeVerified(pending.wallet, pending.badgeTypeId, qualified, queryId);
    }

    // ─── Result reading helpers (external for try/catch) ─────
    function _readInt128Column(
        ProofOfSqlTable.Table memory table,
        uint256 colIndex
    ) external pure returns (int128) {
        int128[] memory values = ProofOfSqlTable.readInt128Column(table, colIndex);
        if (values.length == 0) return 0;
        return values[0];
    }

    function _readBigIntColumn(
        ProofOfSqlTable.Table memory table,
        uint256 colIndex
    ) external pure returns (int256) {
        int256[] memory values = ProofOfSqlTable.readBigIntColumn(table, colIndex);
        if (values.length == 0) return 0;
        return values[0];
    }

    // ─── Admin ───────────────────────────────────────────────

    /// @notice Set the query plan for a badge type.
    /// @param badgeTypeId Badge type (1-17)
    /// @param plan Hex-encoded EVM proof plan from SXT RPC
    function setBadgeQueryPlan(uint256 badgeTypeId, bytes calldata plan) external onlyOwner {
        badgeQueryPlans[badgeTypeId] = plan;
    }

    /// @notice Set the minimum threshold for a badge type.
    /// @param badgeTypeId Badge type (1-17)
    /// @param threshold Minimum numeric value to qualify
    function setBadgeThreshold(uint256 badgeTypeId, uint256 threshold) external onlyOwner {
        badgeThresholds[badgeTypeId] = threshold;
    }

    /// @notice Set which result column to read for a badge type.
    /// @param badgeTypeId Badge type (1-17)
    /// @param colIndex Column index in the result table
    function setBadgeResultColumn(uint256 badgeTypeId, uint256 colIndex) external onlyOwner {
        badgeResultColumns[badgeTypeId] = colIndex;
    }

    /// @notice Batch-configure badge query plans, thresholds, and result columns.
    function configureBadge(
        uint256 badgeTypeId,
        bytes calldata plan,
        uint256 threshold,
        uint256 colIndex
    ) external onlyOwner {
        badgeQueryPlans[badgeTypeId] = plan;
        badgeThresholds[badgeTypeId] = threshold;
        badgeResultColumns[badgeTypeId] = colIndex;
    }

    /// @notice Set the BlockBadge SBT contract address.
    function setBlockBadge(address _blockBadge) external onlyOwner {
        blockBadge = IBlockBadge(_blockBadge);
    }

    /// @notice Rescue stuck ERC-20 tokens (e.g., SXT refunds that fail).
    function rescueTokens(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(to, amount);
    }
}
