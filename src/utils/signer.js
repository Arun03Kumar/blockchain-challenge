const bip39 = require("bip39");
const { ethers } = require("ethers");

const getSignerFunc = () => {
  const mnemonic = bip39.generateMnemonic();
  const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);

  const addressess = [];

  for (let i = 0; i <= 1; i++) {
    const derNode = hdNode.derivePath(`m/44'/1'/0'/${i}`);
    const obj = {
      address: derNode.address,
      privateKey: derNode.privateKey,
    };
    addressess.push(obj);
  }
  console.log(addressess)
};
getSignerFunc()

