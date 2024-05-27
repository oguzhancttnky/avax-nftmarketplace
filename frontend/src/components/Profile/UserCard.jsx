import React from 'react';
import { Link } from 'react-router-dom';
import './userCard.css';

function UserCard({ user }) {
    const { WalletAddress, Username, ProfileURL } = user;

    return (
        <Link to={`/profile/${WalletAddress}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className='user-card__container'>
                <img src={ProfileURL || require('../../assets/images/defaultprofile.jpg') } alt={"Profile"} className='user-card__image' />
                <h3 className='user-card__name'>Username: {Username}</h3>
            </div>
        </Link>
    );
}

export default UserCard;
