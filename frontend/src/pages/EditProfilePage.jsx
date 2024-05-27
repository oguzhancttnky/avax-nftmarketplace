

import React from 'react'
import EditProfile from '../components/Profile/EditProfile'

const EditProfilePage = ({walletAddress}) => {
  return (
    <div>
      <EditProfile walletAddress={walletAddress}/>
    </div>
  )
}

export default EditProfilePage