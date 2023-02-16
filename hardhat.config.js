require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [
        "0x6e00ba4ea001d61a85a41db309322b4808aa5d3acbf968bad1c5a7a698c737b0",
      ],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API
  }
};


// [
//   {
//     address: '0x9B9D49D1F7b678CcFEdC9122199F0BE581533970',
//     privateKey: '0x6e00ba4ea001d61a85a41db309322b4808aa5d3acbf968bad1c5a7a698c737b0'
//   },
//   {
//     address: '0xa3b0DAC7F8Cbbd8EfE1EBE3681B652ba2343DADc',
//     privateKey: '0xb9d65fc1ce01acbaa0a16dadbad2ea0e927f74b6a0286b5b2f469e582495b29e'
//   }
// ]
