import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { nftMarketplaceContract } from './Web3Client';
import Web3 from 'web3';
import NFTToken from './NFTToken.json';
import './nftDetails.css';
import { ReactComponent as AvaxIcon } from './avax-icon.svg'; // Avax icon as SVG

function NFTDetails({ walletAddress, databaseId }) {
    const [nft, setNft] = useState({});
    const [srcLink, setSrcLink] = useState('');
    const [metadata, setMetadata] = useState({});

    const [nftAddress, setNftAddress] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [price, setPrice] = useState('');

    const handleListing = async (e) => {
        e.preventDefault();

        const nftTokenAbi = NFTToken.abi;
        const provider = window.ethereum;
        const web3 = new Web3(provider);
        const nftTokenContract = new web3.eth.Contract(nftTokenAbi, nftAddress);
        console.log(price);
        console.log(tokenId);
        console.log(nftAddress);
        console.log(process.env.REACT_APP_MARKET_CONTRACT_ADDRESS);
        const approve = await nftTokenContract.methods.approve(process.env.REACT_APP_MARKET_CONTRACT_ADDRESS, tokenId).send({ from: walletAddress });
        console.log(approve);
        const result = await nftMarketplaceContract.methods.listNFT(nftAddress, tokenId, Web3.utils.toWei(price, 'ether')).send({ from: walletAddress });
        console.log(result);
        if (result.transactionHash) {
            await axios.put(`http://localhost:8080/dbNft/${databaseId}`, {
                TokenAddress: nftAddress,
                TokenID: tokenId,
                Metadata: JSON.stringify(metadata),
                OwnerOf: process.env.REACT_APP_MARKET_CONTRACT_ADDRESS,
                IsListing: true,
                Seller: walletAddress,
                Price: parseFloat(price)
            });
        }
    };

    const handleCancel = async (e) => {
        e.preventDefault();
        try {
            const result = await nftMarketplaceContract.methods.cancelListing(nftAddress, tokenId).send({ from: walletAddress });
            console.log(result);
            if (result.transactionHash) {
                await axios.put(`http://localhost:8080/dbNft/${databaseId}`, {
                    TokenAddress: nftAddress,
                    TokenID: tokenId,
                    Metadata: JSON.stringify(metadata),
                    OwnerOf: walletAddress,
                    IsListing: false,
                    Seller: '',
                    Price: 0
                });
            }
        } catch (error) {
            console.error('Cancel failed:', error);
            alert('Cancel failed, check console for details.');
        }
    };

    const handleBuy = async (e) => {
        e.preventDefault();
        try {
            const result = await nftMarketplaceContract.methods.buyNFT(nftAddress, tokenId).send({ from: walletAddress, value: Web3.utils.toWei(price, 'ether') });
            console.log(result);
            if (result.transactionHash) {
                await axios.put(`http://localhost:8080/dbNft/${databaseId}`, {
                    TokenAddress: nftAddress,
                    TokenID: tokenId,
                    Metadata: JSON.stringify(metadata),
                    OwnerOf: walletAddress,
                    IsListing: false,
                    Seller: '',
                    Price: 0
                });
                const response = await axios.get(`http://localhost:8080/users/${walletAddress}`);
                const user = response.data;
                try{
                    await axios.put(`http://localhost:8080/users/${walletAddress}`, {
                        Username: user.Username,
                        Email: user.Email,
                        ProfileURL: user.ProfileURL,
                        TradedValue: user.TradedValue + parseFloat(price)
                    });
                }
                catch (error){
                    console.error('Error updating user:', error);
                }
                    

            }
        } catch (error) {
            console.error('Purchase failed:', error);
            alert('Purchase failed, check console for details.');
        }

    };

    useEffect(() => {
        const fetchNft = async () => {
            const response = await axios.get(`http://localhost:8080/dbNft/nft/${databaseId}`);
            const nft = response.data[0];
            const metadata = JSON.parse(response.data[0].Metadata);

            setNft(nft);
            setMetadata(metadata);
            setNftAddress(nft.TokenAddress)
            setTokenId(nft.TokenID)
            setSrcLink(metadata.image)
            setPrice(nft.Price);
            if (metadata.image.startsWith('ipfs://')) {
                setSrcLink("https://ipfs.io/ipfs/" + metadata.image.replace("ipfs://", ''));
            }
        };
        fetchNft();
    }, [databaseId]);

    return (
        <div className='nft-details__container'>
            <div className='nft-details__content'>
                <div className='nft-details__image-container'>
                    <img src={srcLink} alt={metadata.name} className='nft-details__image' />
                </div>
                <div className='nft-details__info'>
                    <h3 className='nft-details__name'>{metadata.name}</h3>
                    <p className='nft-details__description'>{metadata.description}</p>
                    <p className='nft-details__id'>ID: {nft.TokenID}</p>
                    <p className='nft-details__token__address'>Contract: {nft.TokenAddress}</p>
                    {nft.Seller && <p className='nft-details__seller'>Seller: {nft.Seller}</p>}
                    <div className='nft-details__attributes'>
                            {metadata.attributes && metadata.attributes.map((attr, index) => (
                            <div key={index} className="nft-details__attribute">
                                <div className='nft-details__type'>{attr.trait_type}: </div>
                                <div className='nft-details__value'>{attr.value}</div>
                            </div>
                        ))}
                    </div>
                    <div className="nft-details__actions">
                        {(() => {
                            if (nft.OwnerOf === walletAddress && nft.IsListing === false) {
                                return (
                                    <div className="nft-details__input-button-wrapper">
                                        <input 
                                            type="text" 
                                            placeholder="Price in Avax" 
                                            value={price} 
                                            onChange={(e) => setPrice(e.target.value)} 
                                            className='nft-details__input'
                                        />
                                        <button onClick={handleListing} className='nft-details__button'>
                                            <AvaxIcon width="24" height="24" />
                                            List NFT
                                        </button>
                                    </div>
                                );
                            } else if (nft.IsListing === true) {
                                if (walletAddress !== '' && nft.Seller === walletAddress) {
                                    return (
                                        <div>
                                            <span className='nft-details__price'>Price: {nft.Price} AVAX
                                            <AvaxIcon width="30" height="30"></AvaxIcon>

                                            </span>
                                            <button onClick={handleCancel} className='nft-details__button'>
                                                Cancel Listing
                                            </button>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div>
                                            <span className='nft-details__price'>Price: {price} AVAX  
                                            <AvaxIcon width="30" height="30"></AvaxIcon>
                                            </span>
                                            <button onClick={handleBuy} className='nft-details__button'>Buy NFT</button>
                                        </div>
                                    );
                                }
                            } else {
                                return <></>;
                            }
                        })()}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default NFTDetails;
