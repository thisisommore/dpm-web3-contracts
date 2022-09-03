import { ethers } from "hardhat";

async function main() {

  const PackageManager = await ethers.getContractFactory("PackageManager");
  const packageManager = await PackageManager.deploy();

  await packageManager.deployed();

  console.log(`Package manager deployed to: %s`, packageManager.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
