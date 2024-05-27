import React from 'react';
import CollectionDetails from '../components/NFTs/CollectionDetails'
import { useParams } from 'react-router';


const CollectionDetailsPage = () => {
    const { tokenAddress } = useParams();
    return (
        <>
            <CollectionDetails tokenAddress={tokenAddress} />
        </>
    )
}

export default CollectionDetailsPage;