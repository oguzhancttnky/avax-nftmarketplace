import React from 'react';
import { useParams } from 'react-router';
import CreatedCollections from '../components/Profile/CreatedCollections';

const CreatedCollectionsPage = () =>{
    const { walletAddress } = useParams();
  return (
    <>
      <CreatedCollections walletAddress={walletAddress}/>
    </>
  )
}

export default CreatedCollectionsPage;