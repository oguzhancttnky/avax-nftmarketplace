import React from 'react';
import Profile from '../components/Profile/Profile'


const ProfilePage = ({walletAddress}) =>{
  return (
    <>
      <Profile walletAddress={walletAddress}/>
    </>
  )
}

export default ProfilePage;