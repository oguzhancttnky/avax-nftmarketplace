import React, {useState, useEffect} from "react";
import axios from "axios";
import './profile.css'

function ProfileInfo({walletAddress}){
    const[profile, setProfile] = useState(null);
    useEffect(() => {
        const fetchProfile = async () => {
            try{
                const response = await axios.get(`http://localhost:8080/users/${walletAddress}`);
                setProfile(response.data);
            }catch (error){
                console.error('Error fetching profile data:', error);
            }
        };

        if (walletAddress){
            fetchProfile();
        }
    }, [walletAddress]);

    if(!profile){
        return <div>Loading Profile...</div>
    }

    return(
        <div>
            <div className="profile-img-container">
                <img src={profile.ProfileURL || require('../../assets/images/defaultprofile.jpg')} alt="Profile"/>    
            </div>
            <p><strong>Wallet Address: </strong>{profile.WalletAddress}</p>
            <p><strong>Nickname: </strong>{profile.Username}</p>
            <p><strong>Email: </strong> {profile.Email}</p>
        </div>
    );
}

export default ProfileInfo;