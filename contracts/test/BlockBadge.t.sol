// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/BlockBadge.sol";

contract BlockBadgeTest is Test {
    BlockBadge public badge;

    address owner = makeAddr("owner");
    address minterAddr = makeAddr("minter");
    address user1 = makeAddr("user1");
    address user2 = makeAddr("user2");
    address newMinter = makeAddr("newMinter");

    event BadgeMinted(
        address indexed to,
        uint256 indexed tokenId,
        uint256 indexed badgeTypeId
    );
    event MinterUpdated(address indexed oldMinter, address indexed newMinter);
    event BadgeMetadataUpdated(uint256 indexed badgeTypeId, string uri);

    function setUp() public {
        badge = new BlockBadge(owner, minterAddr);
    }

    // ─── Constructor ─────────────────────────────────────────

    function test_constructor() public view {
        assertEq(badge.name(), "Block Badge");
        assertEq(badge.symbol(), "BADGE");
        assertEq(badge.owner(), owner);
        assertEq(badge.minter(), minterAddr);
        assertEq(badge.totalSupply(), 0);
    }

    // ─── Minting ─────────────────────────────────────────────

    function test_mint_success() public {
        vm.prank(minterAddr);
        badge.mint(user1, 1);

        assertEq(badge.ownerOf(0), user1);
        assertEq(badge.balanceOf(user1), 1);
        assertTrue(badge.hasBadge(user1, 1));
        assertEq(badge.totalSupply(), 1);
    }

    function test_mint_incrementsTokenId() public {
        vm.startPrank(minterAddr);
        badge.mint(user1, 1);
        badge.mint(user2, 1);
        vm.stopPrank();

        assertEq(badge.ownerOf(0), user1);
        assertEq(badge.ownerOf(1), user2);
        assertEq(badge.totalSupply(), 2);
    }

    function test_mint_emitsBadgeMinted() public {
        vm.expectEmit(true, true, true, false);
        emit BadgeMinted(user1, 0, 1);

        vm.prank(minterAddr);
        badge.mint(user1, 1);
    }

    function test_mint_setsTokenURI() public {
        vm.prank(owner);
        badge.setBadgeMetadata(1, "https://example.com/metadata/1");

        vm.prank(minterAddr);
        badge.mint(user1, 1);

        assertEq(badge.tokenURI(0), "https://example.com/metadata/1");
    }

    function test_mint_revertsForNonMinter() public {
        vm.prank(user1);
        vm.expectRevert(BlockBadge.OnlyMinter.selector);
        badge.mint(user1, 1);
    }

    function test_mint_revertsDuplicateBadge() public {
        vm.startPrank(minterAddr);
        badge.mint(user1, 1);

        vm.expectRevert(BlockBadge.BadgeAlreadyMinted.selector);
        badge.mint(user1, 1);
        vm.stopPrank();
    }

    function test_mint_allowsDifferentBadgeTypes() public {
        vm.startPrank(minterAddr);
        badge.mint(user1, 1);
        badge.mint(user1, 2);
        badge.mint(user1, 3);
        vm.stopPrank();

        assertTrue(badge.hasBadge(user1, 1));
        assertTrue(badge.hasBadge(user1, 2));
        assertTrue(badge.hasBadge(user1, 3));
        assertEq(badge.balanceOf(user1), 3);
        assertEq(badge.totalSupply(), 3);
    }

    function test_mint_revertsInvalidBadgeType_zero() public {
        vm.prank(minterAddr);
        vm.expectRevert(BlockBadge.InvalidBadgeType.selector);
        badge.mint(user1, 0);
    }

    function test_mint_revertsInvalidBadgeType_tooHigh() public {
        vm.prank(minterAddr);
        vm.expectRevert(BlockBadge.InvalidBadgeType.selector);
        badge.mint(user1, 18);
    }

    function test_mint_maxBadgeType() public {
        vm.prank(minterAddr);
        badge.mint(user1, 17);
        assertTrue(badge.hasBadge(user1, 17));
    }

    // ─── Soulbound ───────────────────────────────────────────

    function test_soulbound_transferReverts() public {
        vm.prank(minterAddr);
        badge.mint(user1, 1);

        vm.prank(user1);
        vm.expectRevert(BlockBadge.SoulboundTransfer.selector);
        badge.transferFrom(user1, user2, 0);
    }

    function test_soulbound_safeTransferReverts() public {
        vm.prank(minterAddr);
        badge.mint(user1, 1);

        vm.prank(user1);
        vm.expectRevert(BlockBadge.SoulboundTransfer.selector);
        badge.safeTransferFrom(user1, user2, 0);
    }

    // ─── Admin: setMinter ────────────────────────────────────

    function test_setMinter() public {
        vm.prank(owner);
        badge.setMinter(newMinter);
        assertEq(badge.minter(), newMinter);
    }

    function test_setMinter_emitsEvent() public {
        vm.expectEmit(true, true, false, false);
        emit MinterUpdated(minterAddr, newMinter);

        vm.prank(owner);
        badge.setMinter(newMinter);
    }

    function test_setMinter_revertsForNonOwner() public {
        vm.prank(user1);
        vm.expectRevert(
            abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user1)
        );
        badge.setMinter(newMinter);
    }

    // ─── Admin: setBadgeMetadata ─────────────────────────────

    function test_setBadgeMetadata() public {
        vm.prank(owner);
        badge.setBadgeMetadata(1, "ipfs://Qm.../1");
        assertEq(badge.badgeMetadata(1), "ipfs://Qm.../1");
    }

    function test_setBadgeMetadata_emitsEvent() public {
        vm.expectEmit(true, false, false, true);
        emit BadgeMetadataUpdated(1, "ipfs://test");

        vm.prank(owner);
        badge.setBadgeMetadata(1, "ipfs://test");
    }

    function test_setBadgeMetadata_revertsInvalidType() public {
        vm.prank(owner);
        vm.expectRevert(BlockBadge.InvalidBadgeType.selector);
        badge.setBadgeMetadata(0, "ipfs://test");
    }

    function test_setBadgeMetadata_revertsForNonOwner() public {
        vm.prank(user1);
        vm.expectRevert(
            abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user1)
        );
        badge.setBadgeMetadata(1, "ipfs://test");
    }

    // ─── Admin: setBadgeMetadataBatch ────────────────────────

    function test_setBadgeMetadataBatch() public {
        uint256[] memory ids = new uint256[](3);
        string[] memory uris = new string[](3);
        ids[0] = 1; uris[0] = "uri1";
        ids[1] = 2; uris[1] = "uri2";
        ids[2] = 3; uris[2] = "uri3";

        vm.prank(owner);
        badge.setBadgeMetadataBatch(ids, uris);

        assertEq(badge.badgeMetadata(1), "uri1");
        assertEq(badge.badgeMetadata(2), "uri2");
        assertEq(badge.badgeMetadata(3), "uri3");
    }

    // ─── Minter Migration Flow (Level 1 → Level 2) ──────────

    function test_minterMigration() public {
        // Level 1: server minter mints a badge
        vm.prank(minterAddr);
        badge.mint(user1, 1);
        assertEq(badge.totalSupply(), 1);

        // Owner swaps minter to "ZKpay executor" (newMinter)
        vm.prank(owner);
        badge.setMinter(newMinter);

        // Old minter can no longer mint
        vm.prank(minterAddr);
        vm.expectRevert(BlockBadge.OnlyMinter.selector);
        badge.mint(user2, 1);

        // Level 2: new minter (ZKpay) can mint
        vm.prank(newMinter);
        badge.mint(user2, 1);

        assertEq(badge.totalSupply(), 2);
        assertTrue(badge.hasBadge(user2, 1));
    }

    // ─── supportsInterface ───────────────────────────────────

    function test_supportsInterface_ERC721() public view {
        assertTrue(badge.supportsInterface(0x80ac58cd)); // ERC721
    }

    function test_supportsInterface_ERC721Metadata() public view {
        assertTrue(badge.supportsInterface(0x5b5e139f)); // ERC721Metadata
    }
}
