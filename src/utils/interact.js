const { ethers } = require("ethers");
require('dotenv').config()
const abi = require("../config/abi");

const contractAddr = "0x7Be5EB8A6B49B285E01A30BEe43409c28418EA3c";
const provider = new ethers.providers.JsonRpcProvider(
  `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
);
const signer = new ethers.Wallet(
  "0x6e00ba4ea001d61a85a41db309322b4808aa5d3acbf968bad1c5a7a698c737b0",
  provider
);

const signer2 = new ethers.Wallet(
  "0xb9d65fc1ce01acbaa0a16dadbad2ea0e927f74b6a0286b5b2f469e582495b29e",
  provider
);

const contractObj = new ethers.Contract(contractAddr, abi.abi, signer);
const contractObj2 = new ethers.Contract(contractAddr, abi.abi, signer2);


const name = async () => {
  const n = await contractObj.name();
  // console.log(n);
  return n;
};
// name()

const mint = async (tokenId, uri) => {
  const gas = await contractObj.estimateGas.mintToken(tokenId, uri);
  const approve = await contractObj.populateTransaction.mintToken(tokenId, uri);
  approve.chainId = 5;
  approve.gasLimit = gas;
  approve.gasPrice = await provider.getGasPrice();
  approve.nonce = await provider.getTransactionCount(
    "0x9B9D49D1F7b678CcFEdC9122199F0BE581533970"
  );

  const app = await signer.signTransaction(approve);
  const subtx = await provider.sendTransaction(app);
  const recipt = await subtx.wait();
  if (recipt.status === 0) throw new Error("Approve transaction failed");
  return recipt.transactionHash.toString();
};
// mint(10, "abc");

const balance = async (address) => {
  const n = await contractObj.balanceOf(address);
  // console.log(n.toString())
  return n.toString();
};
// balance("0x9b9d49d1f7b678ccfedc9122199f0be581533970")

const totalSupp = async () => {
  const n = await contractObj.totalSupply();
  // console.log(n.toString())
  return n.toString();
};

const listToMarket = async (tokenId) => {
  const gas = await contractObj.estimateGas.listOnMarketplace(tokenId);
  const approve = await contractObj.populateTransaction.listOnMarketplace(
    tokenId
  );
  approve.chainId = 5;
  approve.gasLimit = gas;
  approve.gasPrice = await provider.getGasPrice();
  approve.nonce = await provider.getTransactionCount(
    "0x9B9D49D1F7b678CcFEdC9122199F0BE581533970"
  );

  const app = await signer.signTransaction(approve);
  const subtx = await provider.sendTransaction(app);
  const recipt = await subtx.wait();
  if (recipt.status === 0) throw new Error("Approve transaction failed");
  // console.log(recipt)
  // console.log(recipt.transactionHash)
  // JSON.stringify(recipt)
  return recipt.transactionHash.toString();
};
// listToMarket(10)

const removeFromMarket = async (tokenId) => {
  const gas = await contractObj.estimateGas.cancel(tokenId);
  const approve = await contractObj.populateTransaction.cancel(tokenId);
  approve.chainId = 5;
  approve.gasLimit = gas;
  approve.gasPrice = await provider.getGasPrice();
  approve.nonce = await provider.getTransactionCount(
    "0x9B9D49D1F7b678CcFEdC9122199F0BE581533970"
  );

  const app = await signer.signTransaction(approve);
  const subtx = await provider.sendTransaction(app);
  const recipt = await subtx.wait();
  if (recipt.status === 0) throw new Error("Approve transaction failed");
  return recipt.transactionHash.toString();
};
// removeFromMarket(10)

const buy = async (tokenId) => {
  const gas = await contractObj2.estimateGas.buyNFT(tokenId, {
    value: ethers.utils.parseEther("0.001"),
  });
  const approve = await contractObj2.populateTransaction.buyNFT(tokenId, {
    value: ethers.utils.parseEther("0.001"),
  });
  approve.chainId = 5;
  approve.gasLimit = gas;
  approve.gasPrice = await provider.getGasPrice();
  approve.nonce = await provider.getTransactionCount(
    "0xa3b0DAC7F8Cbbd8EfE1EBE3681B652ba2343DADc"
  );

  const app = await signer2.signTransaction(approve);
  const subtx = await provider.sendTransaction(app);
  const recipt = await subtx.wait();
  if (recipt.status === 0) throw new Error("Approve transaction failed");
  return recipt.transactionHash.toString();
};
// buy(1)

module.exports = {
  name,
  mint,
  balance,
  listToMarket,
  removeFromMarket,
  buy,
  totalSupp,
};
