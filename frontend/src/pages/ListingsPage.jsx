import React from 'react';
import { useParams } from 'react-router';
import Listings from '../components/Profile/Listings';

const ListingsPage = () =>{
    const { walletAddress } = useParams();
  return (
    <div>
      <Listings walletAddress={walletAddress}/>
    </div>
  )
}

export default ListingsPage;