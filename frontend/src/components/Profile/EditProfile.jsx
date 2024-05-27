import React, { useState } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap'; // Reactstrap components
import ClipLoader from "react-spinners/ClipLoader";
import './profile.css';

const EditProfile = ({ walletAddress }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  let [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { username, email, profileUrl };

    try {
      const response = await fetch(`http://localhost:8080/users/${walletAddress}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setLoading(false);
        // İstek başarılı olduğunda yapılacak işlemler
        console.log('Profile updated successfully');
      } else {
        // Hata durumunda yapılacak işlemler
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='edit-profile__main_container'>
        <Nav tabs className="edit-profile__nav">
            <NavItem>
                <NavLink tag={RRNavLink} to="/profile" activeClassName="active">Profile</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag={RRNavLink} to="/owned" activeClassName="active">Owned NFTs</NavLink>
            </NavItem>
            <NavItem>
            < NavLink tag={RRNavLink} to={`/created/${walletAddress}`} activeClassName="active">Created</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag={RRNavLink} to="/edit-profile" activeClassName="active">Edit Profile</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag={RRNavLink} to="/home" activeClassName="active">Dashboard</NavLink>
            </NavItem>
        </Nav>
        <div className='edit-profile__container'>
        <h2 className="edit-profile__title">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="edit-profile__form">
        <label className="edit-profile__label">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="edit-profile__input"
        />
        <label className="edit-profile__label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="edit-profile__input"
        />
        <label className="edit-profile__label">Profile Image</label>
        {profileUrl && <img src={profileUrl} alt="Profile" className="edit-profile__image" />}
        <input type="file" accept="image/*" onChange={handleImageUpload} className="edit-profile__input" />
        <div className="edit-profile__button__div">
            <button type="submit" className="edit-profile__button">Save Changes</button>
            <ClipLoader className="edit-profile__button__loader" color={"#000"} loading={loading} size={20} />
        </div>
      </form>
    </div>
    </div>

  );
};

export default EditProfile;
