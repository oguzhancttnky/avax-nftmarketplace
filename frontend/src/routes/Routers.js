

import React from 'react'

import {Routes, Route, Navigate} from 'react-router-dom'

import Home from '../pages/Home'
import Market from '../pages/MarketplacePage'
import CreateNFTPage from '../pages/CreateNFTPage'
import Contact from '../pages/Contact'
import ProfilePage from '../pages/ProfilePage'
import Listings from '../pages/ListingsPage'
import EditProfilePage from '../pages/EditProfilePage'
import OwnedNFTsPage from '../pages/OwnedNFTsPage'
import NftDetailsPage from '../pages/NftDetailsPage'
import CreateCollectionPage from '../pages/CreateCollectionPage'
import CollectionDetailsPage from '../pages/CollectionDetailsPage'
import CreatedCollectionsPage from '../pages/CreatedCollectionsPage'
import PublicProfilePage from '../pages/PublicProfilePage'
import CreatorsPage from '../pages/CreatorsPage'
import LeaderboardPage from '../pages/LeaderboardPage'

const Routers = ({walletAddress}) => {
  return <Routes>
    <Route path='/' element={<Navigate to ='home'/>}/>
    <Route path='home' element={<Home/>}/>
    <Route path='market' element={<Market/>}/>
    <Route path='owned' element={walletAddress && <OwnedNFTsPage walletAddress={walletAddress}/>}/>
    <Route path='/created/:walletAddress' element={<CreatedCollectionsPage/>}/>
    <Route path='/collection/:tokenAddress' element={<CollectionDetailsPage/>}/>
    <Route path='/nft/:nftId' element={<NftDetailsPage walletAddress={walletAddress}/>} />
    <Route path='create-nft' element={walletAddress ? <CreateNFTPage walletAddress={walletAddress}/> : <Navigate to ='/home'/>}/>
    <Route path='create-collection' element={walletAddress ? <CreateCollectionPage walletAddress={walletAddress} /> : <Navigate to ='/home'/>}/>
    <Route path='contact' element={<Contact/>}/>
    <Route path='profile' element={walletAddress && <ProfilePage walletAddress={walletAddress}/>}/>
    <Route path='edit-profile' element={walletAddress && <EditProfilePage walletAddress={walletAddress}/>}/>
    <Route path='creators' element={<CreatorsPage/>}/>
    <Route path='/profile/:walletAddress' element={<PublicProfilePage/>}/>
    <Route path='/listings/:walletAddress' element={<Listings/>}/>
    <Route path='leaderboard' element={<LeaderboardPage/>}/>
  </Routes>
}

export default Routers