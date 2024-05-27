import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NFTCard from './NftCard';
import { NavLink as RRNavLink } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap'; // Reactstrap components
import './collectionDetails.css'


function CollectionDetails({ tokenAddress }) {
    const [nfts, setNfts] = useState([]);

    useEffect(() => {
        const fetchNfts = async () => {
            const response = await axios.get(`http://localhost:8080/dbNft/collection/${tokenAddress}`);
            const nfts = response.data;
            setNfts(nfts);
        };
        fetchNfts();
    }, [tokenAddress]);

    return (
        <div className='collection__container'>
            <Nav tabs className="created__nav">
                <NavItem>
                    <NavLink tag={RRNavLink} to="/profile" activeClassName="active">Profile</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={RRNavLink} to="/owned" activeClassName="active">Owned NFTs</NavLink>
                </NavItem>
                <NavItem>
                <NavLink tag={RRNavLink} to={`/created`} activeClassName="active">Created</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={RRNavLink} to="/edit-profile" activeClassName="active">Edit Profile</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={RRNavLink} to="/home" activeClassName="active">Dashboard</NavLink>
                </NavItem>
            </Nav>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {nfts.map(nft => (
                <NFTCard key={nft.ID} nft={nft} />
            ))}
        </div>
        </div>
    );
}

export default CollectionDetails;
