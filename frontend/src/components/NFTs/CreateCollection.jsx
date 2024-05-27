import React, { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
import './CreateCollection.css';
import Web3 from 'web3';
import NFTToken from './NFTToken.json';

function CreateCollection({ walletAddress }) {
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [bannerImage, setBannerImage] = useState('');
    const [web3, setWeb3] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initWeb3 = async () => {
            const web3 = new Web3(window.ethereum);
            setWeb3(web3);
        };
        initWeb3();
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({ name, symbol, bannerImage });
        uploadCollectionImageToIPFS();
    };

    const handleBannerImageChange = (event) => {
        setBannerImage(event.target.files[0]);
    };


    const uploadCollectionImageToIPFS = async () => {
        if (bannerImage) {
            setLoading(true);
            try {
                console.log("Uploading file to IPFS...");
                const formData = new FormData();
                formData.append("file", bannerImage);
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
                deployNewCollection(CollectionImgUrl);
            } catch (error) {
                setLoading(false);
                console.log("Error sending File to IPFS: ")
                console.log(error)
            }
        }
    };

    const uploadCollectionMetadataToIPFS = async (token_address, CollectionImgIPFSUrl) => {
        try {
            console.log("Uploading metadata to IPFS...");
            const metadata = {
                token_address: token_address,
                name: name,
                symbol: symbol,
                collection_banner_image: CollectionImgIPFSUrl
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
            const metadataUri = `https://gateway.pinata.cloud/ipfs/${resMetadata.data.IpfsHash}`;
            console.log(metadataHash);
            console.log(metadataUri);
            collectionUriSet(metadataUri, token_address)
        } catch (error) {
            setLoading(false);
            console.log("Error sending Metadata to IPFS: ")
            console.log(error)
        }
    }

    const collectionUriSet = async (collectionUri, token_address) => {
        try {
            const CollectionContract = new web3.eth.Contract(NFTToken.abi, token_address);
            const response = await CollectionContract.methods.setContractURI(collectionUri).send({ from: walletAddress });
            console.log('Collection URI set: ', response);
            setLoading(false);
            alert("Contract deployed!");
        }
        catch (error) {
            setLoading(false);
            console.log("Error setting collection URI: ")
            console.log(error)
        }
    }

    const deployNewCollection = async (CollectionImgIPFSUrl) => {
        if (!name || !symbol || !bannerImage) {
            setLoading(false);
            console.log(name);
            console.log(symbol);
            console.log(CollectionImgIPFSUrl);
            alert('Please enter name, symbol and image for the collection');
            return;
        }
        // Create contract instance
        const contract = new web3.eth.Contract(NFTToken.abi);
        // Deploy the contract
        let collectionInstance;
        await contract
            .deploy({
                arguments: [name, symbol],
                data: NFTToken.bytecode
            })
            .send({ from: walletAddress, gas: '3000000', gasPrice: '25000000000' }).then((instance) => {
                console.log("Contract mined at " + instance.options.address);
                collectionInstance = instance;
            })
        console.log(collectionInstance);
        const token_address = collectionInstance.options.address;
        const response = await axios.post('http://localhost:8080/collection', {
            Name: name,
            Symbol: symbol,
            TokenAddress: token_address,
            CollectionBannerImage: CollectionImgIPFSUrl,
            OwnerOf: walletAddress
        });
        console.log('Collection added database: ', response);
        uploadCollectionMetadataToIPFS(token_address, CollectionImgIPFSUrl);
    };



    return (
        <div className="collection-container">
            <h1>Create New Collection</h1>
            <form onSubmit={handleSubmit} className="collection-form">
                <div className="form-group">
                    <label htmlFor="name">Collection Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="symbol">Symbol:</label>
                    <input
                        type="text"
                        id="symbol"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="bannerImage"
                        onChange={handleBannerImageChange}
                        required
                    />
                </div>
                <div className="submit-btn-div">
                    <button type="submit" className="submit-btn">Create Collection</button>
                    <ClipLoader className='submit-btn-loader' color={"#000"} loading={loading} size={20} />
                </div>
            </form>
        </div>
    );
}

export default CreateCollection;
