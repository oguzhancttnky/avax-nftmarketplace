const hre = require("hardhat");

async function main() {
  try {
    // Get the ContractFactory of your SimpleContract
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");

    // Deploy the contract
    const contract = await NFTMarketplace.deploy();

    // Wait for the deployment transaction to be mined
    await contract.deployed();

    console.log(`NFTMarketplace deployed to: ${contract.address}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();