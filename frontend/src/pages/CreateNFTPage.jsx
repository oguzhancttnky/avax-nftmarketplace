import React from 'react'
import CreateNft from '../components/NFTs/CreateNft'

const CreateNFTPage = ({walletAddress}) => {
  return (
    <div>
        <CreateNft walletAddress={walletAddress} />
    </div>
  )
}

export default CreateNFTPage