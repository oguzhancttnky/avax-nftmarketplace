import React, {useState, useEffect} from "react";
import axios from "axios";

function Statistics({walletAddress}){
    const [nftCount, setNftCount] = useState(0);
    const [tradedValue, setTradedValue] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/dbNft/nft/count/${walletAddress}`);
                setNftCount(response.data);
                const response2 = await axios.get(`http://localhost:8080/users/${walletAddress}`);
                setTradedValue(response2.data.TradedValue);
            } catch (error){
                console.error('Error fetching stats:', error);
            }
        };

        if (walletAddress){
            fetchStats();
        }
    }, [walletAddress]);

    return (
        <div className="statistics">
            <div className="stat">
                <p><strong>Numbers of NFT's:</strong> {nftCount}</p>
            </div>
            <div className="stat">
                <p><strong>Amount Traded:</strong> {tradedValue} AVAX</p>
            </div>
        </div>
    );
}

export default Statistics;
