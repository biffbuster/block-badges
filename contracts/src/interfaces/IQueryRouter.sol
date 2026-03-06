// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

/// @title IQueryRouter
/// @notice Interface for querying external data sources with cryptographic proofs
interface IQueryRouter {
    struct Query {
        bytes32 version;
        bytes innerQuery;
        bytes parameters;
        bytes metadata;
    }

    struct Callback {
        uint256 maxGasPrice;
        uint64 gasLimit;
        address callbackContract;
        bytes4 selector;
        bytes callbackData;
    }

    struct Payment {
        uint256 paymentAmount;
        address refundTo;
        uint64 timeout;
    }

    function requestQuery(
        Query calldata query,
        Callback calldata callback,
        Payment calldata payment
    ) external returns (bytes32 queryId);
}
