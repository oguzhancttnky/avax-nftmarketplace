const hre = require("hardhat");

async function main() {
  try {
    // Get the ContractFactory of your SimpleContract
    const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");

    // Deploy the contract
    const contract = await NFTCollection.deploy("OBO", "OBO");

    // Wait for the deployment transaction to be mined
    await contract.deployed();
    
    console.log(`NFTCollection deployed to: ${contract.address}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();