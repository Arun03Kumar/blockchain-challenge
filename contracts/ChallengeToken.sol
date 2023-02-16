// SPDX-License-Identifier: SEE LICENSE IN LICENSE

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ChallengeToken is ERC721URIStorage {
    uint256 sellingPrice = 0.001 ether;
    uint256 public totalSupply;
    mapping(uint256 => MarketItem) idToMarketItem;

    struct MarketItem {
        uint256 tokenId;
        address seller;
        address owner;
        uint256 price;
        bool sold;
    }

    event TokenListed(
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    event TokenSold(
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    event Cancel(uint256 tokeId);

    constructor() ERC721("ChallengeToken", "CTK") {}

    function mintToken(uint256 tokenId, string memory tokenURI) public {
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        totalSupply += 1;
    }

    function listOnMarketplace(uint256 tokenId) public returns (uint256) {
        address owner = ownerOf(tokenId);
        require(
            msg.sender == owner,
            "Only owner can list the NFT on Marketplace."
        );

        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            sellingPrice,
            false
        );
        _transfer(msg.sender, address(this), tokenId);
        emit TokenListed(
            tokenId,
            msg.sender,
            address(this),
            sellingPrice,
            false
        );
        return tokenId;
    }

    function cancel(uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(owner == idToMarketItem[tokenId].owner, "Token Not Listed");
        require(
            msg.sender == idToMarketItem[tokenId].seller ||
                msg.sender == idToMarketItem[tokenId].owner,
            "Only owner can cancel the NFT from Marketplace."
        );

        delete idToMarketItem[tokenId];
        emit Cancel(tokenId);
    }

    function buyNFT(uint256 tokenId) public payable {
        MarketItem memory item = idToMarketItem[tokenId];
        require(item.tokenId == tokenId, "Not listed yet");
        require(
            msg.value == sellingPrice,
            "Invalid Amount for purchasig this NFT."
        );

        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));

        _transfer(address(this), msg.sender, tokenId);
        payable(idToMarketItem[tokenId].seller).transfer(msg.value);
        cancel(tokenId);

        emit TokenSold(tokenId, address(0), msg.sender, sellingPrice, true);
    }
}
