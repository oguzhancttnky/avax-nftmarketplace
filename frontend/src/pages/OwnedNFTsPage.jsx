import React from 'react';
import OwnedNFTs from '../components/Profile/OwnedNFTs'

const OwnedNFTsPage = ({walletAddress}) =>{
  return (
    <div>
      <OwnedNFTs walletAddress={walletAddress}/>
    </div>
  )
}

export default OwnedNFTsPage;