const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect, use } = require("chai");
const { ethers } = require("hardhat");
const tokenId = 1;
const uri = "abcd";
const contractAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const price = "0.001";
describe("Challenge Token", async () => {
  const contract = async () => {
    const [user1, user2] = await ethers.getSigners();
    const ChallengeToken = await hre.ethers.getContractFactory(
      "ChallengeToken"
    );
    const challengeToken = await ChallengeToken.deploy();
    return { challengeToken, user1, user2 };
  };

  describe("deployment", async () => {
    it("Should give token name", async () => {
      const { challengeToken, user1 } = await loadFixture(contract);
      const name = await challengeToken.name();
      expect(await challengeToken.name()).eq("ChallengeToken");
    });
  });

  describe("Minting", async () => {
    it("Should mint token with given tokenId and URI", async () => {
      const { challengeToken, user1 } = await loadFixture(contract);
      await challengeToken.mintToken(tokenId, uri);
    });
    it("Should not mint token for already existing tokenId.", async () => {
      const { challengeToken, user1 } = await loadFixture(contract);
      await challengeToken.mintToken(tokenId, uri);
      await expect(challengeToken.mintToken(tokenId, uri)).revertedWith(
        "ERC721: token already minted"
      );
    });
  });

  describe("listing", () => {
    it("Should list minted token on marketplace only by owner.", async () => {
      const { challengeToken, user1 } = await loadFixture(contract);
      await challengeToken.mintToken(tokenId, uri);
      await challengeToken.listOnMarketplace(tokenId);
    });
    it("Should not list minted token on marketplace by anyone.", async () => {
      const { challengeToken, user1, user2 } = await loadFixture(contract);
      await challengeToken.mintToken(tokenId, uri);

      await expect(
        challengeToken.connect(user2).listOnMarketplace(tokenId)
      ).revertedWith("Only owner can list the NFT on Marketplace.");
    });
    it("Should not list non-minted token", async () => {
      const { challengeToken, user1 } = await loadFixture(contract);
      await expect(challengeToken.listOnMarketplace(tokenId)).revertedWith(
        "ERC721: invalid token ID"
      );
    });
    it("Should emit the event for listing.", async () => {
      const { challengeToken, user1 } = await loadFixture(contract);
      await challengeToken.mintToken(tokenId, uri);
      await expect(challengeToken.listOnMarketplace(tokenId))
        .to.emit(challengeToken, "TokenListed")
        .withArgs(
          tokenId,
          user1.address,
          contractAddr,
          1000000000000000,
          false
        );
    });
  });

  describe("cancel", () => {
    it("Should cancel listed token on marketplace only by owner.", async () => {
      const { challengeToken, user1 } = await loadFixture(contract);
      await challengeToken.mintToken(tokenId, uri);
      await challengeToken.listOnMarketplace(tokenId);
      await expect(challengeToken.cancel(tokenId)).not.to.be.reverted;
    });
    it("Should not cancel listed token on marketplace by anyone.", async () => {
      const { challengeToken, user1, user2 } = await loadFixture(contract);
      await challengeToken.mintToken(tokenId, uri);
      await challengeToken.listOnMarketplace(tokenId);
      await expect(challengeToken.connect(user2).cancel(tokenId)).revertedWith(
        "Only owner can cancel the NFT from Marketplace."
      );
    });
    it("Should not cancel non-listed token", async () => {
      const { challengeToken, user1 } = await loadFixture(contract);
      await challengeToken.mintToken(tokenId, uri);
      await expect(challengeToken.cancel(tokenId)).revertedWith(
        "Token Not Listed"
      );
    });
    it("Should emit the event for cancelling.", async () => {
      const { challengeToken, user1 } = await loadFixture(contract);
      await challengeToken.mintToken(tokenId, uri);
      await challengeToken.listOnMarketplace(tokenId);
      await expect(challengeToken.cancel(tokenId))
        .to.emit(challengeToken, "Cancel")
        .withArgs(tokenId);
    });
  });

  describe("Buy NFT:", () => {
    it("Should Buy listed NFT", async () => {
      const { challengeToken, user1 } = await loadFixture(contract);
      await challengeToken.mintToken(tokenId, uri);
      await challengeToken.listOnMarketplace(tokenId);
      await expect(
        challengeToken.buyNFT(tokenId, {
          value: ethers.utils.parseEther("0.001"),
        })
      ).not.to.be.reverted;
    });
    it("Should not Buy non-listed NFT", async () => {
      const { challengeToken, user1 } = await loadFixture(contract);
      await challengeToken.mintToken(tokenId, uri);
      await expect(
        challengeToken.buyNFT(tokenId, {
          value: ethers.utils.parseEther("0.001"),
        })
      ).to.be.revertedWith("Not listed yet");
    });
    it("Should not Buy non-minted NFT", async () => {
      const { challengeToken, user1 } = await loadFixture(contract);
      await expect(
        challengeToken.buyNFT(tokenId, {
          value: ethers.utils.parseEther("0.001"),
        })
      ).to.be.revertedWith("Not listed yet");
    });
    it("Should revert if amount is price amount is not provided", async () => {
      const { challengeToken, user1 } = await loadFixture(contract);
      await challengeToken.mintToken(tokenId, uri);
      await challengeToken.listOnMarketplace(tokenId);
      await expect(
        challengeToken.buyNFT(tokenId, {
          value: ethers.utils.parseEther("0.0001"),
        })
      ).to.be.revertedWith("Invalid Amount for purchasig this NFT.");
    });
    it("Should emit event after successful buy.", async () => {
      const { challengeToken, user1 } = await loadFixture(contract);
      await challengeToken.mintToken(tokenId, uri);
      await challengeToken.listOnMarketplace(tokenId);
      await expect(
        challengeToken.buyNFT(tokenId, {
          value: ethers.utils.parseEther("0.001"),
        })
      )
        .to.emit(challengeToken, "TokenSold")
        .withArgs(
          tokenId,
          ethers.constants.AddressZero,
          user1.address,
          1000000000000000,
          true
        );
    });
  });
});
