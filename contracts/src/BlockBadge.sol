// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24; // Compatible with 0.8.24+, compiled with 0.8.30

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title BlockBadge — Soulbound Badge NFTs
/// @notice Non-transferable ERC-721 badges minted after ZK-verified onchain achievements.
///         Level 1: server wallet is the authorized minter.
///         Level 2: swap minter to ZKpay QueryRouter executor for trustless minting.
contract BlockBadge is ERC721, ERC721URIStorage, Ownable {
    // ─── State ───────────────────────────────────────────────
    uint256 private _nextTokenId;
    address public minter;
    uint256 public constant MAX_BADGE_TYPE = 17;

    /// @dev wallet => badgeTypeId => already minted
    mapping(address => mapping(uint256 => bool)) public hasBadge;

    /// @dev badgeTypeId => metadata URI template
    mapping(uint256 => string) public badgeMetadata;

    // ─── Events ──────────────────────────────────────────────
    event BadgeMinted(
        address indexed to,
        uint256 indexed tokenId,
        uint256 indexed badgeTypeId
    );
    event MinterUpdated(address indexed oldMinter, address indexed newMinter);
    event BadgeMetadataUpdated(uint256 indexed badgeTypeId, string uri);

    // ─── Errors ──────────────────────────────────────────────
    error OnlyMinter();
    error InvalidBadgeType();
    error BadgeAlreadyMinted();
    error SoulboundTransfer();

    // ─── Modifiers ───────────────────────────────────────────
    modifier onlyMinter() {
        if (msg.sender != minter) revert OnlyMinter();
        _;
    }

    // ─── Constructor ─────────────────────────────────────────
    constructor(
        address initialOwner,
        address initialMinter
    ) ERC721("Block Badge", "BADGE") Ownable(initialOwner) {
        minter = initialMinter;
    }

    // ─── Minting ─────────────────────────────────────────────

    /// @notice Mint a soulbound badge to `to` for the given badge type.
    /// @param to       Recipient wallet
    /// @param badgeTypeId  Badge type (1–17)
    function mint(address to, uint256 badgeTypeId) external onlyMinter {
        if (badgeTypeId == 0 || badgeTypeId > MAX_BADGE_TYPE)
            revert InvalidBadgeType();
        if (hasBadge[to][badgeTypeId]) revert BadgeAlreadyMinted();

        uint256 tokenId = _nextTokenId++;
        hasBadge[to][badgeTypeId] = true;

        _safeMint(to, tokenId);

        // Set token URI from badge metadata if available
        string memory uri = badgeMetadata[badgeTypeId];
        if (bytes(uri).length > 0) {
            _setTokenURI(tokenId, uri);
        }

        emit BadgeMinted(to, tokenId, badgeTypeId);
    }

    // ─── Admin ───────────────────────────────────────────────

    /// @notice Swap the authorized minter. Use this to migrate from
    ///         server wallet (Level 1) to ZKpay executor (Level 2).
    function setMinter(address newMinter) external onlyOwner {
        address old = minter;
        minter = newMinter;
        emit MinterUpdated(old, newMinter);
    }

    /// @notice Set the metadata URI for a single badge type.
    function setBadgeMetadata(
        uint256 badgeTypeId,
        string calldata uri
    ) external onlyOwner {
        if (badgeTypeId == 0 || badgeTypeId > MAX_BADGE_TYPE)
            revert InvalidBadgeType();
        badgeMetadata[badgeTypeId] = uri;
        emit BadgeMetadataUpdated(badgeTypeId, uri);
    }

    /// @notice Set metadata URIs for multiple badge types in one tx.
    function setBadgeMetadataBatch(
        uint256[] calldata badgeTypeIds,
        string[] calldata uris
    ) external onlyOwner {
        require(badgeTypeIds.length == uris.length, "Length mismatch");
        for (uint256 i = 0; i < badgeTypeIds.length; i++) {
            if (badgeTypeIds[i] == 0 || badgeTypeIds[i] > MAX_BADGE_TYPE)
                revert InvalidBadgeType();
            badgeMetadata[badgeTypeIds[i]] = uris[i];
            emit BadgeMetadataUpdated(badgeTypeIds[i], uris[i]);
        }
    }

    /// @notice Total number of badges minted.
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    // ─── Soulbound: block all transfers ──────────────────────

    /// @dev Override _update to make tokens soulbound (only minting allowed).
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721) returns (address) {
        address from = _ownerOf(tokenId);
        // Allow minting (from == address(0)), block all transfers
        if (from != address(0)) revert SoulboundTransfer();
        return super._update(to, tokenId, auth);
    }

    // ─── Required overrides ──────────────────────────────────

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
