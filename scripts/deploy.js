const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  
  const ChallengeToken = await hre.ethers.getContractFactory("ChallengeToken");
  const challengeToken = await ChallengeToken.deploy();

  // await challengeToken.deployed();

  console.log(` deployed to ${challengeToken.address}`);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// [
//   {
//     address: '0x2a526856432D197A96D66c0B07C641a299F0ccb2',
//     privateKey: '0x596abb2136510f2df75bd621316d096e8ad6eda517bef8c171f2e20cfe52c895'
//   },
//   {
//     address: '0x2484a99D9e4237b70BF666d9B7D23704A9dBcD3f',
//     privateKey: '0xd3c7bb2b8aebf462c3ca44b168517bf0ac425462b0837f21db9b2a18eed52a5e'
//   }
// ]