import React from 'react';
import { Link } from 'react-router-dom';
import './nftCard.css';

function NFTCard({ nft }) {
    const metadata = JSON.parse(nft?.Metadata);
    let srcLink = metadata?.image;
    if (metadata?.image?.startsWith('ipfs://')){
        srcLink = "https://ipfs.io/ipfs/" + metadata?.image.replace("ipfs://",'');
    }

    return (
        <Link to={`/nft/${nft.ID}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className='nft-card__container'>
                <img src={srcLink} alt={metadata.name} className='nft-card__image' />
                <h3 className='nft-card__name'>{metadata.name}</h3>
            </div>
        </Link>
    );
}

export default NFTCard;
