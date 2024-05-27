import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import NFTToken from './NFTToken.json';
import axios from 'axios';

function App() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    
    const [contractList, setContractList] = useState([]);
    const [selectedContract, setSelectedContract] = useState('');

    const [collectionName, setCollectionName] = useState('');
    const [collectionSymbol, setCollectionSymbol] = useState('');
    const [collectionFile, setCollectionFile] = useState(null);
    const [collectionImageIpfsURL, setCollectionImageIpfsURL] = useState('');
    const [collectionURI, setCollectionURI] = useState('');

    const [nftName, setNftName] = useState('');
    const [nftDescription, setNftDescription] = useState('');
    const [nftFile, setNftFile] = useState(null);
    const [nftImageIpfsURL, setNftImageIpfsURL] = useState('');
    const [tokenURI, setTokenURI] = useState('');

    // Initialize web3
    useEffect(() => {
        const initWeb3 = async () => {
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            setWeb3(web3);
            setAccounts(accounts);
        };

        initWeb3();
    }, []);


    const onNftFileChange = (event) => {
        setNftFile(event.target.files[0]);
    };

    const onCollectionFileChange = (event) => {
        setCollectionFile(event.target.files[0]);
    };

    const uploadNftImageToIPFS = async () => {
        if(nftFile){
            try {
                console.log("Uploading file to IPFS...");
                const formData = new FormData();
                formData.append("file", nftFile);
                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
                        'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,
                        "Content-Type": "multipart/form-data"
                    },
                });
                console.log(resFile);
                const NftImgHash = `ipfs://${resFile.data.IpfsHash}`;
                const NftImgUrl = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
                console.log(NftImgHash);
                console.log(NftImgUrl);
                setNftImageIpfsURL(NftImgUrl);
                uploadNftMetadataToIPFS();
            } catch (error) {
                console.log("Error sending File to IPFS: ")
                console.log(error)
            }
        }
    };

    const uploadNftMetadataToIPFS = async () => {
        if (!nftName || !nftDescription || !nftImageIpfsURL) {
            alert('Please make sure to fill out all fields');
            return;
        }
        try {
            console.log("Uploading metadata to IPFS...");
            const metadata = {
                name: nftName,
                description: nftDescription,
                image: nftImageIpfsURL
            };
            const resMetadata = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data: metadata,
                headers: {
                    'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
                    'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,
                    "Content-Type": "application/json"
                },
            });
            console.log(resMetadata);
            const metadataHash = `ipfs://${resMetadata.data.IpfsHash}`;
            const metadataUrl = `https://gateway.pinata.cloud/ipfs/${resMetadata.data.IpfsHash}`;
            console.log(metadataHash);
            console.log(metadataUrl);
            setTokenURI(metadataUrl);
        } catch (error) {
            console.log("Error sending Metadata to IPFS: ")
            console.log(error)
        }
    }


    const uploadCollectionImageToIPFS = async () => {
        if(collectionFile){
            try {
                console.log("Uploading file to IPFS...");
                const formData = new FormData();
                formData.append("file", collectionFile);
                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
                        'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,
                        "Content-Type": "multipart/form-data"
                    },
                });
                console.log(resFile);
                const CollectionImgHash = `ipfs://${resFile.data.IpfsHash}`;
                const CollectionImgUrl = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
                console.log(CollectionImgHash);
                console.log(CollectionImgUrl);
                setCollectionImageIpfsURL(CollectionImgUrl);
            } catch (error) {
                console.log("Error sending File to IPFS: ")
                console.log(error)
            }
        }
    };

    const uploadCollectionMetadataToIPFS = async (token_address) => {
        try {
            console.log("Uploading metadata to IPFS...");
            const metadata = {
                token_address: token_address,
                name: collectionName,
                symbol: collectionSymbol,
                image: collectionImageIpfsURL
            };
            setContractList([...contractList, metadata]);
            const resMetadata = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data: metadata,
                headers: {
                    'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
                    'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,
                    "Content-Type": "application/json"
                },
            });
            console.log(resMetadata);
            const metadataHash = `ipfs://${resMetadata.data.IpfsHash}`;
            const metadataUrl = `https://gateway.pinata.cloud/ipfs/${resMetadata.data.IpfsHash}`;
            console.log(metadataHash);
            console.log(metadataUrl);
            setCollectionURI(metadataUrl);
        } catch (error) {
            console.log("Error sending Metadata to IPFS: ")
            console.log(error)
        }
    }

    const deployNewCollection = async () => {
        if (!collectionName || !collectionSymbol || !collectionImageIpfsURL) {
            console.log(collectionName);
            console.log(collectionSymbol);
            console.log(collectionImageIpfsURL);
            alert('Please enter name, symbol and image for the collection');
            return;
        }
        // Create contract instance
        const contract = new web3.eth.Contract(NFTToken.abi);
        // Deploy the contract
        let collectionInstance;
        await contract
            .deploy({
                arguments: [collectionName, collectionSymbol],
                data: NFTToken.bytecode
            })
            .send({ from: accounts[0], gas: '3000000', gasPrice: '25000000000' }).then((instance) => {
                console.log("Contract mined at " + instance.options.address);
                collectionInstance = instance;
            })
            uploadCollectionMetadataToIPFS(collectionInstance.options.address);
            const CollectionContract = new web3.eth.Contract(NFTToken.abi, collectionInstance.options.address);
            const response = await CollectionContract.methods.setContractURI(collectionURI).send({ from: accounts[0] });
            console.log('Collection URI set: ', response);
            console.log(collectionInstance);
            alert("Contract deployed!");
    };

    const mintNFT = async () => {
        if (!nftImageIpfsURL || !selectedContract) {
            console.log(nftImageIpfsURL);
            console.log(selectedContract);
            alert('Please make sure the file is uploaded, a collection is selected, and the contract is deployed');
            return;
        }
        const NFTContract = new web3.eth.Contract(NFTToken.abi, selectedContract);
        const response = await NFTContract.methods.mintNFT(accounts[0], tokenURI).send({ from: accounts[0] });
        console.log('NFT minted: ', response);
        setNftImageIpfsURL('');
    };

    return (
        <div>
            <h1>NFT Marketplace</h1>
            <input type="text" placeholder="Collection Name" onChange={e => setCollectionName(e.target.value)} />
            <input type="text" placeholder="Collection Symbol" onChange={e => setCollectionSymbol(e.target.value)} />
            <input type="file" onChange={onCollectionFileChange} />
            <button onClick={uploadCollectionImageToIPFS}>Upload to IPFS</button>
            {collectionImageIpfsURL && <p>Collection Image Uploaded: {collectionImageIpfsURL}</p>}
            <button onClick={deployNewCollection}>Deploy New Collection</button>
            {collectionURI && <p>Collection Token URI: {collectionURI}</p>}
            <h2>Choose Collection</h2>
            {contractList.length > 0 && (
                <select onChange={e => setSelectedContract(e.target.value)}>
                    <option value="">Select a Collection</option>
                    {contractList.map((contract, index) => (
                        <option key={index} value={contract.address}>{contract.name} - {contract.symbol}</option>
                    ))}
                </select>
            )}
            <h2>Mint NFT</h2>
            <input type="file" onChange={onNftFileChange} />
            <button onClick={uploadNftImageToIPFS}>Upload to IPFS</button>
            {nftImageIpfsURL && <p>Nft Image Uploaded: {nftImageIpfsURL}</p>}
            {tokenURI && <p>Token URI: {tokenURI}</p>}
            <input type="text" placeholder="NFT Name" onChange={e => setNftName(e.target.value)} />
            <input type="text" placeholder="NFT Description" onChange={e => setNftDescription(e.target.value)} />
            <button onClick={mintNFT}>Mint NFT</button>
        </div>
    );
}

export default App;
