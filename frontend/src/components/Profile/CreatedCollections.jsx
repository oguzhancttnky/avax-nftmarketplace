import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink as RRNavLink } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap'; // Reactstrap components
import './profile.css'
import CollectionCard from '../NFTs/CollectionCard';


function CreatedCollections({ walletAddress }) {
    const [createdCollections, setCreatedCollections] = useState([]);

    useEffect(() => {
        const fetchCreatedCollections = async () => {
            try {
                const response = await axios.get(`http://localhost:8080//collection/wallet/${walletAddress}`);
                setCreatedCollections(response.data); // API yanıtına göre ayarlayın
            } catch (error) {
                console.error('Error fetching created Collections:', error);
            }
        };

        fetchCreatedCollections();
    }, [walletAddress]);

    if (createdCollections.length === 0) {
        return <div>No Created NFTs Found.</div>;
    }

    return (
        <div className='created__container'>
            <Nav tabs className="created__nav">
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
            <div className='collections__grid'>
                {createdCollections.map(collection => {
                    return (
                        <div key={collection.ID} >
                            <CollectionCard collection={collection} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CreatedCollections;
