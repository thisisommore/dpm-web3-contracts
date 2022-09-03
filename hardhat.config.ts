import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const MNEMONIC = process.env.MNEMONIC || "mnemonic"
const MATICMUM_RPC_URL = process.env.MATICMUM_RPC_URL || "https://rpc-mumbai.maticvigil.com"
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "PolygonScan API key"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Etherscan API key"
const config: HardhatUserConfig = {
  solidity: "0.8.13",
  networks: {
    maticmum: {
      chainId: 80001,
      url: MATICMUM_RPC_URL,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY || ETHERSCAN_API_KEY,
  },
}

export default config;
