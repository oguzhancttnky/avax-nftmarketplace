import React from 'react';
import { Link } from 'react-router-dom';
import './collectionCard.css'

function CollectionCard({ collection }) {
    let collectionBannerImage = collection?.CollectionBannerImage;
    if (collectionBannerImage?.startsWith('ipfs://')){
        collectionBannerImage = "https://ipfs.io/ipfs/" +collectionBannerImage.replace("ipfs://",'');
    }
    return (
        <Link to={`/collection/${collection.TokenAddress}`} className='collection__card-wrapper'>
            <div>
                <img src={collectionBannerImage} alt={collection.Name} className='collection__card-image' />
                <h3 className='collection__card-title'>{collection.Name}</h3>
                <p className='collection__card-symbol'>{collection.Symbol}</p>
            </div>
        </Link>
    );
}

export default CollectionCard;
