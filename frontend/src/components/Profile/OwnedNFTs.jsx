import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css'
import NFTList from '../NFTs/NftList';
import { NavLink as RRNavLink } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap'; // Reactstrap components


function OwnedNFTs({walletAddress}) {

    const [nfts, setNfts] = useState([]);

    useEffect(() => {
        if (!walletAddress) return; // Eğer cüzdan adresi yoksa, API çağrısını yapma.

        const fetchNFTs = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/dbNft/${walletAddress}`);
                console.log(response)
                setNfts(response.data); // API'nin döndüğü yapıya göre ayarlayın.
            } catch (error) {
                console.error('Error fetching owned NFTs:', error);
            }
        };

        fetchNFTs();
    }, [walletAddress]);

    if (nfts.length === 0) {
        return <div>No NFTs Found.</div>;
    }

    return (
        <div className='owned-nft__container'>
            <div className='owned'>
                <Nav tabs className="edit-profile__nav">
                <NavItem>
                    <NavLink tag={RRNavLink} to="/profile" activeClassName="active">Profile</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={RRNavLink} to="/owned" activeClassName="active">Owned NFTs</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={RRNavLink} to={`/created/${walletAddress}`} activeClassName="active">Created</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={RRNavLink} to="/edit-profile" activeClassName="active">Edit Profile</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={RRNavLink} to="/home" activeClassName="active">Dashboard</NavLink>
                </NavItem>
                </Nav>
            </div>
            <NFTList nfts={nfts} />
        </div>
    );
}

export default OwnedNFTs;