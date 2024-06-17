# AVAX NFT Marketplace

Marketplace allows users to buy, sell, create collections and mint NFTs on the Avalanche.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Architecture](#architecture)

## Features

- **Buy and Sell NFTs**: List NFTs for sale and buy listed NFTs.

![Screenshot 2024-05-31 134334](https://github.com/oguzhancttnky/avax-nftmarketplace/assets/59288589/0cd21231-b890-4117-becd-cb9a6b5922ad)


![Screenshot 2024-05-31 134436](https://github.com/oguzhancttnky/avax-nftmarketplace/assets/59288589/5347e67e-6b21-4404-9ec0-b1cbfe5c651c)


![Screenshot 2024-05-31 135725](https://github.com/oguzhancttnky/avax-nftmarketplace/assets/59288589/6e47e7c0-ace4-4cad-9cad-8ecb530dcb88)

 
- **Create Collections**: Create your own collection.

![Screenshot 2024-05-31 135427](https://github.com/oguzhancttnky/avax-nftmarketplace/assets/59288589/6ba6d314-05d1-472a-b689-542eb5a6e7d3)


- **Mint NFTs**: Mint your NFTs in your collections.

![Screenshot 2024-05-31 134815](https://github.com/oguzhancttnky/avax-nftmarketplace/assets/59288589/bb80c39f-fa3b-47b4-8dc3-40d9d4793bce)

- **Leaderboard**: Leaderboard of users to see who spend more.

![Screenshot 2024-05-31 135448](https://github.com/oguzhancttnky/avax-nftmarketplace/assets/59288589/b3d7f35b-a02f-4ea1-8706-cb39ca1ec292)

- **Public Profiles**: See other users their listings and created collections.

![Screenshot 2024-05-31 134537](https://github.com/oguzhancttnky/avax-nftmarketplace/assets/59288589/179ba33e-b813-474a-9749-6ddc056d0fb5)

![Screenshot 2024-05-31 140421](https://github.com/oguzhancttnky/avax-nftmarketplace/assets/59288589/eddb8c32-7429-43f2-a2c2-28c0e95c8b20)

![Screenshot 2024-05-31 134553](https://github.com/oguzhancttnky/avax-nftmarketplace/assets/59288589/039ff597-ef96-4d19-b527-b3c8d1aca1df)

- **Creators**: See all creators.

![Screenshot 2024-05-31 134758](https://github.com/oguzhancttnky/avax-nftmarketplace/assets/59288589/1d91339f-348a-4748-abb6-33bb3f96d178)

- **Edit Profile**: Edit your username, profile page and email address.


## Technologies Used

- **Frontend**: React.js
- **Backend**: Golang(gorm, gin)
- **Blockchain**: Avalanche(AVAX)
- **Smart Contracts**: Solidity
- **Database**: PostgreSQL
- **Others**: Web3.js, Pinata IPFS, Moralis, Hardhat

## Installation

### Prerequisites

- Node.js and npm
- Metamask

### Clone the Repository

```
git clone https://github.com/your-username/avax-nftmarketplace.git
cd avax-nftmarketplace
````

### Fill in the necessary fields

- You need to get API key from Moralis.
- Copy API key and paste to apiKey variables in FetchCollectionsHandler and FetchNFTHandler functions.(avax-nftmarketplace/backend/pkg/api/handler/collection.go and avax-nftmarketplace/backend/pkg/api/handler/nft.go)
- You need to deploy your markets smart contract Avalanche mainnet with using hardhat. (npx hardhat run scripts/marketplace_deploy.js --network mainnet)
- Copy your markets contract address and paste it to REACT_APP_MARKET_CONTRACT_ADDRESS in frontend/.env file.
- Create Pinata account and fill REACT_APP_PINATA_API_KEY and REACT_APP_PINATA_SECRET_API_KEY.
- Create your Amazon RDS for PostgreSQL and fill DB_HOST,DB_PORT,DB_USER,DB_PASSWORD and DB_NAME in backend/.env
- You are ready to start your Avax NFT Marketplace.

### Run the backend

```
cd backend
go mod tidy
cd cmd
go run .\main.go
```
### Run the frontend

``` 
cd frontend
npm install
npm run start
```

## Architecture

![Marketplace Architecture](https://github.com/oguzhancttnky/avax-nftmarketplace/assets/59288589/322b2bd3-e52a-4e76-9985-fe66abe54cff)
