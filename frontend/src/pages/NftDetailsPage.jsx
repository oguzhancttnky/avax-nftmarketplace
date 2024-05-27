import React from 'react';
import NftDetails from '../components/NFTs/NftDetails'
import { useParams } from 'react-router';


const NftDetailsPage = ({walletAddress}) => {
    const { nftId } = useParams();
    return (
        <>
            <NftDetails walletAddress={walletAddress} databaseId={nftId} />
        </>
    )
}

export default NftDetailsPage;