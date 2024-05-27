// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarketplace is ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
        address owner;
        bool active;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;

    event Listed(address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 price);
    event Sale(address indexed buyer, address indexed nftAddress, uint256 indexed tokenId, uint256 price);
    event Cancelled(address indexed seller, address indexed nftAddress, uint256 indexed tokenId);

    function listNFT(address nftAddress, uint256 tokenId, uint256 price) public {
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(nft.getApproved(tokenId) == address(this), "Marketplace not approved");

        listings[nftAddress][tokenId] = Listing(price, msg.sender, address(this), true);
        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);
        emit Listed(msg.sender, nftAddress, tokenId, price);
    }

    function buyNFT(address nftAddress, uint256 tokenId) public payable nonReentrant {
        Listing storage listing = listings[nftAddress][tokenId];
        require(listing.seller != msg.sender, "You are owner");
        require(listing.active, "NFT not listed");
        require(msg.value >= listing.price, "Insufficient funds");

        listing.active = false;
        IERC721(nftAddress).transferFrom(listing.owner, msg.sender, tokenId);
        payable(listing.seller).transfer(msg.value);
        emit Sale(msg.sender, nftAddress, tokenId, listing.price);
    }

    function cancelListing(address nftAddress, uint256 tokenId) public {
        Listing storage listing = listings[nftAddress][tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.active, "Listing not active");

        listing.active = false;
        IERC721(nftAddress).transferFrom(address(this), msg.sender, tokenId);
        emit Cancelled(msg.sender, nftAddress, tokenId);
    }
}