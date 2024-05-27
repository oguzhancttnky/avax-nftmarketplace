import React, {useState, useEffect} from "react";
import axios from "axios";
import UserCard from "./UserCard";
import './profile.css'

function Creators(){
    const [creators, setCreators] = useState([]);

    useEffect(() => {
        const fetchCreators = async() =>{
            try{
                const response = await axios.get(`http://localhost:8080/collection/creators`);
                var walletAddresses = [];
                for (let i = 0; i < response.data.length; i++){
                    walletAddresses = [...walletAddresses, response.data[i].OwnerOf];
                }
                var set = new Set(walletAddresses);
                var creatorSet = [...set];
                var creator = [];
                for (let i = 0; i < creatorSet.length; i++){
                    const response = await axios.get(`http://localhost:8080/users/${creatorSet[i]}`);
                    creator = [...creator, response.data];
                }
                setCreators(creator);
            } catch (error){
            console.error('Error fetching listings:', error);
            }
        };

        fetchCreators();
    }, []);
    
    if (creators.length === 0){
        return <div>No Listings Found.</div>;
    }

    return(
        <div className="creators__container">
            <h1 className="creators__title">Top Creators</h1>
            <div className="creators__grid">
                {creators.map(creator => (
                    <UserCard key={creator.walletAddresses} user={creator}/>
                ))}
            </div>
        </div>
    )
} 

export default Creators;