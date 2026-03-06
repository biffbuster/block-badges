// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/BlockBadge.sol";

contract DeployBlockBadge is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address minterWallet = vm.envAddress("MINTER_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        BlockBadge badge = new BlockBadge(msg.sender, minterWallet);

        // Set placeholder metadata URIs for all 17 badge types.
        // These point to our Next.js metadata API; swap to IPFS later.
        string memory baseURI = vm.envOr("METADATA_BASE_URL", string("https://localhost:3000/api/metadata/"));

        uint256[] memory ids = new uint256[](17);
        string[] memory uris = new string[](17);

        string[17] memory badgeNames = [
            "etherean",
            "gas-guzzler",
            "nft-flipper",
            "multichain",
            "opensea",
            "art-blocks",
            "card-01",
            "card-02",
            "emn-rug",
            "eth-steak",
            "memecoin",
            "nft-20k",
            "contract-deployer",
            "base-bull",
            "avax-bull",
            "diamond-hands",
            "whale-activity"
        ];

        for (uint256 i = 0; i < 17; i++) {
            ids[i] = i + 1;
            uris[i] = string.concat(baseURI, badgeNames[i]);
        }

        badge.setBadgeMetadataBatch(ids, uris);

        vm.stopBroadcast();

        console.log("BlockBadge deployed at:", address(badge));
        console.log("Owner:", msg.sender);
        console.log("Minter:", minterWallet);
    }
}
