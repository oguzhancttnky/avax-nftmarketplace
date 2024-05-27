import React from 'react'
import { useParams } from 'react-router';
import PublicProfile from '../components/Profile/PublicProfile';

const PublicProfilePage = () => {
    const {walletAddress} = useParams();
  return (
    <div>
        <PublicProfile walletAddress={walletAddress}/>
    </div>
  )
}

export default PublicProfilePage