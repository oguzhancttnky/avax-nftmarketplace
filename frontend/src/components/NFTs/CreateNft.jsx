import React, { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
import './CreateNft.css';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import NFTToken from './NFTToken.json';

function CreateNft({ walletAddress }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [attributes, setAttributes] = useState([{ trait_type: '', value: '' }]); // Array of attribute objects
    const [image, setImage] = useState(null);
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('');
    const [web3, setWeb3] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initWeb3 = async () => {
            const web3 = new Web3(window.ethereum);
            setWeb3(web3);
            const response = await axios.get(`http://localhost:8080/collection/wallet/${walletAddress}`);
            setCollections(response.data);
            console.log(response.data);
        };
        initWeb3();
    }, [walletAddress]);


    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({ name, description, attributes, image, selectedCollection });
        try {
            uploadNftImageToIPFS();
        } catch (error) {
            console.log('Error creating NFT: ', error);
        }
    };

    const handleAttributeChange = (index, field, value) => {
        const newAttributes = [...attributes];
        newAttributes[index][field] = value;
        setAttributes(newAttributes);
    };

    const addAttribute = () => {
        setAttributes([...attributes, { trait_type: '', value: '' }]);
    };

    const removeAttribute = (index) => {
        const newAttributes = [...attributes];
        newAttributes.splice(index, 1);
        setAttributes(newAttributes);
    };

    const uploadNftImageToIPFS = async () => {
        setLoading(true);
        if (!name || !description || !image || !selectedCollection) {
            setLoading(false);
            console.log(selectedCollection);
            alert('Please make sure a collection is selected, and all fields are filled out.');
            return;
        }
        try {
            console.log("Uploading file to IPFS...");
            const formData = new FormData();
            formData.append("file", image);
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
            uploadNftMetadataToIPFS(NftImgUrl);
        } catch (error) {
            setLoading(false);
            console.log("Error sending File to IPFS: ")
            console.log(error)
        }
    };

    const uploadNftMetadataToIPFS = async (nftImageIpfsURL) => {
        try {
            console.log("Uploading metadata to IPFS...");
            if (nftImageIpfsURL) {
                const metadata = {
                    name: name,
                    description: description,
                    image: nftImageIpfsURL,
                    attributes: attributes,
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
                mintNFT(metadataUri, metadata);
            }
            else {
                setLoading(false);
                console.log("No NFT image URL found");
                console.log(nftImageIpfsURL)
            }
        } catch (error) {
            setLoading(false);
            console.log("Error sending Metadata to IPFS: ")
            console.log(error)
        }
    }

    const mintNFT = async (tokenURI, metadata) => {
        if (!name || !description || !image || !selectedCollection || !tokenURI) {
            setLoading(false);
            console.log(selectedCollection);
            alert('Please make sure the file is uploaded, a collection is selected');
            return;
        }
        console.log(tokenURI);
        console.log(selectedCollection)
        try {
            console.log('Minting NFT...');
            console.log(selectedCollection);
            console.log(walletAddress);
            console.log(tokenURI);
            const NFTContract = new web3.eth.Contract(NFTToken.abi, selectedCollection);
            const response = await NFTContract.methods.mintNFT(walletAddress, tokenURI).send({ from: walletAddress });
            console.log('NFT minted: ', response);
            const tokenId = response.events.Transfer.returnValues.tokenId.toString();
            const response2 = await axios.post('http://localhost:8080/dbNft', {
                TokenID: tokenId,
                TokenAddress: selectedCollection,
                OwnerOf: walletAddress,
                Metadata: JSON.stringify(metadata),
            });
            setLoading(false);
            console.log('NFT saved to database: ', response2);
        }
        catch (error) {
            setLoading(false);
            console.log('Error minting NFT: ', error);
        }
    };


    return (
        <div className='nft-container'>
            <h1>Create Your NFT</h1>
            <form onSubmit={handleSubmit} className="nft-form">
                <div className="form-group">
                    <label htmlFor="name">NFT Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="attributes">Attributes:</label>
                    <div className='attributes-group'>
                    {attributes.map((attr, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder="Trait Type"
                                value={attr.trait_type}
                                onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Value"
                                value={attr.value}
                                onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                            />
                            <button type="button" onClick={() => removeAttribute(index)} className="remove-btn">Remove</button>
                        </div>
                    ))}
                    </div>
                    <button type="button" onClick={addAttribute} className="add-btn">Add Attribute</button>
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="collection">Collection:</label>
                    <select
                        id="selectedCollection"
                        value={selectedCollection}
                        onChange={(e) => setSelectedCollection(e.target.value)}
                        required
                    >
                        <option value="">Select a Collection</option>
                        {collections.map((col, index) => (
                            <option key={index} value={col.TokenAddress}>{col.Name} ({col.Symbol})</option>
                        ))}
                    </select>
                    <div className='collection-link'>
                        <span>Don't have a collection? <Link to={`/create-collection`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <span className='collection-link-one'>Create one</span></Link></span>
                    </div>
                </div>
                <div className='submit-btn-div'>
                    <button type="submit" className="submit-btn">Create NFT</button>
                    <ClipLoader className='submit-btn-loader' color={"#000"} loading={loading} size={20} />
                </div>
            </form>
        </div>
    );
}

export default CreateNft;
