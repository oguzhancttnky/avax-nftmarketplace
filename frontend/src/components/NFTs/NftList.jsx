import React from 'react';
import NFTCard from './NftCard';

function NFTList({ nfts }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {nfts.map(nft => (
                <NFTCard key={nft.ID} nft={nft} />
            ))}
        </div>
    );
}
export default NFTList;
