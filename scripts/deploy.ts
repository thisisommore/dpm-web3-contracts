import { ethers } from "hardhat";
import yaml from "js-yaml"
import fs from "fs"
import hre from "hardhat"
async function main() {

  const PackageManager = await ethers.getContractFactory("PackageManager");
  const packageManager = await PackageManager.deploy();

  await packageManager.deployed();

  console.log(`Package manager deployed to: %s`, packageManager.address);
  updateGraphAddress(packageManager.address, packageManager.deployTransaction.blockNumber, hre.network.name == "localhost")

}


function updateGraphAddress(contractAddr: string, startBlock: number | undefined, local: boolean) {
  fs.rmSync("subgraph/subgraph.local.yaml")
  fs.copyFileSync("subgraph/subgraph.yaml", "subgraph/subgraph.local.yaml")
  const urlSubgraphLocal = local ? `subgraph/subgraph.local.yaml` : `subgraph/subgraph.yaml`
  const umlSubgraphLocal = yaml.load(fs.readFileSync(urlSubgraphLocal, 'utf8')) as any
  umlSubgraphLocal.dataSources[0].network = "mainnet"
  umlSubgraphLocal.dataSources[0].source.address = contractAddr

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
