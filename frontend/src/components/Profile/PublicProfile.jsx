import React from 'react'
import { NavLink as RRNavLink } from 'react-router-dom';
import { Container, Nav, NavItem, NavLink } from 'reactstrap';
import ProfileInfo from './ProfileInfo'
import Statistics from './Statistics'
import './profile.css'
function Profile({walletAddress}){
    return( 
    <section className="profile__section">
        <Container>
            <Nav tabs className="profile__nav">
                <NavItem>
                    <NavLink tag={RRNavLink} to={`/created/${walletAddress}`} activeClassName="active">Created</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={RRNavLink} to={`/listings/${walletAddress}`} activeClassName="active">Listings</NavLink>
                </NavItem>
            </Nav>
            <div className='profile__page'>
                <div className='profile__info'>
                    <ProfileInfo walletAddress={walletAddress}/>
                </div>
                <div className='statistics'>
                    <Statistics walletAddress={walletAddress}/>
                </div>
            </div>
        </Container>
    </section>)
}

export default Profile