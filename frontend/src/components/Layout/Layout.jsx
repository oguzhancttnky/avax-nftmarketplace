

import React from 'react'
import Routers from '../../routes/Routers'
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout = ({walletAddress}) => {
  return (
    <>
      <Header walletAddress={walletAddress}/>
      <div>
          <Routers walletAddress={walletAddress}/>
      </div>
      <Footer/>
    </>
  )
}

export default Layout