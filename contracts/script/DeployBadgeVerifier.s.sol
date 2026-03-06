// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Script.sol";
import "../src/BlockBadge.sol";
import "../src/BadgeVerifier.sol";

contract DeployBadgeVerifier is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy BlockBadge (owner = deployer, minter = deployer temporarily)
        BlockBadge badge = new BlockBadge(deployer, deployer);
        console.log("BlockBadge deployed at:", address(badge));

        // 2. Deploy BadgeVerifier (blockBadge, owner)
        BadgeVerifier verifier = new BadgeVerifier(address(badge), deployer);
        console.log("BadgeVerifier deployed at:", address(verifier));

        // 3. Set BadgeVerifier as the minter on BlockBadge
        badge.setMinter(address(verifier));
        console.log("BlockBadge minter set to BadgeVerifier");

        // 4. Set placeholder metadata URIs for all 17 badge types
        string memory baseURI = vm.envOr(
            "METADATA_BASE_URL",
            string("https://localhost:3000/api/metadata/")
        );

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

        uint256[] memory ids = new uint256[](17);
        string[] memory uris = new string[](17);

        for (uint256 i = 0; i < 17; i++) {
            ids[i] = i + 1;
            uris[i] = string.concat(baseURI, badgeNames[i]);
        }

        badge.setBadgeMetadataBatch(ids, uris);
        console.log("Badge metadata URIs set");

        vm.stopBroadcast();

        console.log("--- Deployment Summary ---");
        console.log("Owner:", deployer);
        console.log("BlockBadge:", address(badge));
        console.log("BadgeVerifier:", address(verifier));
    }
}
