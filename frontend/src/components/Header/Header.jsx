import React from 'react'
import './header.css'
import { Container } from "reactstrap"
import oboLogo from '../../assets/images/obologo.png'

import { NavLink, useNavigate } from "react-router-dom"
import axios from 'axios'

const NAV__LINKS = [
    {
        display: 'Home',
        url: '/home'
    },
    {
        display: 'Market',
        url: '/market'
    },
    {
        display: 'CreateNFT',
        url: '/create-nft'
    },
    {
        display: 'Creators',
        url: '/creators'
    },
    {
        display: 'Leaderboard',
        url: '/leaderboard'
    },
]

const Header = ({walletAddress}) => {
    const navigate = useNavigate();
    const connectWallet = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("MetaMask is not installed")
            return;
        }
        if (!walletAddress) {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            if (!account) {
                console.log("Please connect to MetaMask")
                return;
            }
            console.log("Connected Account", account);
            try {
                const isThisWalletConnected = await axios.get(`http://localhost:8080/users/${account}`);
                console.log(isThisWalletConnected)
                if (isThisWalletConnected.data) {
                    console.log("Wallet already connected");
                }
            } catch (error) {
                const response = await axios.post('http://localhost:8080/users', {
                    WalletAddress: account,
                });
                console.log(response);
                const nfts = await axios.get(`http://localhost:8080/moralisNft/${account}`)
                console.log(nfts);
                try {
                    const collections = await axios.get(`http://localhost:8080/moralisCollection/${account}`)
                    console.log(collections);
                }
                catch (error) {
                    console.log("Error fetching collections")
                    console.log(error)
                }
            }
            window.location.reload();
        } else {
            return;
        }
    };

    return (
        <header className='header'>
            <Container>
                <div className="navigation">
                    <div className="header-logo" onClick={() => navigate('/home')}>
                        <h2 className='d-flex gap-2 align-items-center'>
                            <span>
                                {/*TODO: ADD LOGO*/}
                                <img src={oboLogo} alt="oboLogo" width={100} height={62.35} />
                            </span>
                        </h2>
                    </div>

                    <div className='nav__menu'>
                        <ul className='nav__list'>
                            {
                                NAV__LINKS.map((item, index) =>
                                    <li className='nav__item' key={index}>
                                        <NavLink to={item.url}
                                            className={navClass => navClass.isActive ? 'active' : ''}>
                                            {item.display}
                                        </NavLink>
                                    </li>)
                            }
                        </ul>
                    </div>

                    <div className="nav__right d-flex align-items-center gap-3">
                        <button className='btn' onClick={() => navigate('/profile')}>
                            <i className='ri-user-3-line'></i>
                        </button>
                        <button className='btn' onClick={connectWallet}>
                            <span className='d-flex gap-2 align-items-center'>
                                <i className='ri-wallet-line'></i>
                                {walletAddress !== '' ? 'Connected' : 'Connect Wallet'}
                            </span>
                        </button>
                        <span className="mobile__menu"><i class="ri-menu-line"></i></span>
                    </div>
                </div>
            </Container>
        </header>)
}

export default Header