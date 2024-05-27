import Web3 from 'web3';

// Assuming MetaMask is installed, this will use MetaMask as the provider.
// If not, it will try to connect to the provided HTTP endpoint.
const provider = window.ethereum;

const web3 = new Web3(provider);

const contractAddress = process.env.REACT_APP_MARKET_CONTRACT_ADDRESS;
const NFTMarketplace = require('./NFTMarketplace.json'); // Make sure the path is correct and JSON is properly formatted
const abi = NFTMarketplace.abi;

const nftMarketplaceContract = new web3.eth.Contract(abi, contractAddress);

export { nftMarketplaceContract };
