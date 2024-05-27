import React, {useState, useEffect} from "react";
import axios from "axios";
import UserCard from "./UserCard";
import './profile.css'

function Leaderboard(){
    const [users, setUsers] = useState([]);

    function sortByKey(array, key) {
        return array.sort(function(a,b) { return b[key] - a[key];});
    }

    useEffect(() => {
        const fetchUsers = async() =>{
            try{
                const response = await axios.get(`http://localhost:8080/users`);
                var users = response.data;
                console.log(users)
                var sortedUsers = sortByKey(users, 'TradedValue');
                setUsers(sortedUsers);
                console.log(sortedUsers)
            } catch (error){
            console.error('Error fetching listings:', error);
            }
        };

        fetchUsers();
    }, []);

    return(
        <div className="creators__container">
            <h1 className="creators__title">Leaderboard</h1>
            <div className="creators__grid">
                {users.map(user => (
                    <div>
                        <UserCard key={user.WalletAddresses} user={user}/>
                        <p><strong>Amount Traded:</strong> {user.TradedValue} AVAX</p>
                    </div>
                    
                ))}
            </div>
        </div>
    )
} 

export default Leaderboard;