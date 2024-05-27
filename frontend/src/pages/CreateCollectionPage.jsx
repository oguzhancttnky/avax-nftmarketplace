import React from 'react'
import CreateCollection from '../components/NFTs/CreateCollection'

const CreateCollectionPage = ({walletAddress}) => {
  return (
    <div>
        <CreateCollection walletAddress={walletAddress} />
    </div>
  )
}

export default CreateCollectionPage