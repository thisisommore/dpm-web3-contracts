import { ethers } from "hardhat";
import yaml from "js-yaml"
import fs from "fs"
import hre from "hardhat"
async function main() {

  const PackageManager = await ethers.getContractFactory("PackageManager");
  const packageManager = await PackageManager.deploy("DPM", "DPM");
  if (hre.network.name == "localhost") {
    await packageManager.deployed();
    await packageManager.createPackage("GenisPackage", "metadatahash")
    await packageManager.releaseNewVersion("GenisPackage", "v0.0.1", "testDataHash", true)
  }

  console.log(`Package manager deployed to: %s`, packageManager.address);
  updateGraphAddress(packageManager.address, packageManager.deployTransaction.blockNumber, hre.network.name == "localhost")

}


function updateGraphAddress(contractAddr: string, startBlock: number | undefined, local: boolean) {
  fs.copyFileSync("subgraph/subgraph.yaml", "subgraph/subgraph.local.yaml")
  const urlSubgraphLocal = local ? `subgraph/subgraph.local.yaml` : `subgraph/subgraph.yaml`
  const umlSubgraphLocal = yaml.load(fs.readFileSync(urlSubgraphLocal, 'utf8')) as any
  umlSubgraphLocal.dataSources[0].source.address = contractAddr
  if (local) {
    umlSubgraphLocal.dataSources[0].network = "mainnet"
  }

  if (startBlock) {
    umlSubgraphLocal.dataSources[0].source.startBlock = startBlock
  }
  fs.writeFileSync(urlSubgraphLocal, yaml.dump(umlSubgraphLocal));
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
