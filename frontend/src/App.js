import "./App.css";
import Layout from "./components/Layout/Layout";
import React, {useState, useEffect} from 'react';
import axios from "axios";

function App(){
    const [currentAccount, setCurrentAccount] = useState("");

    

    useEffect(() => {
        const onAccountChange = async () => {
            const { ethereum } = window;
            if (ethereum) {
                const accounts = await ethereum.request({ method: 'eth_accounts' });
                if (accounts.length !== 0) {
                    console.log("Found an authorized account:", accounts[0]);
                    setCurrentAccount(accounts[0]);
                }
                ethereum.on('accountsChanged', async function (accounts) {
                    if (accounts.length !== 0) {
                        const account = accounts[0];
                        setCurrentAccount(account);
                        console.log("Found an account:", account);
                        try {
                            const isThisWalletConnected = await axios.get(`http://localhost:8080/users/${account}`);
                            console.log(isThisWalletConnected)
                            if (isThisWalletConnected.data) {
                                console.log("Wallet already connected");
                                return;
                            }
                        } catch (error) {
                            const response = await axios.post('http://localhost:8080/users', {
                                WalletAddress: account,
                            });
                            console.log(response);
                            const nfts = await axios.get(`http://localhost:8080/moralisNft/${account}`)
                            console.log(nfts);
                            try {
                                const collections = await axios.get(`http://localhost:8080/moralisCollection/${account}`)
                                console.log(collections);
                            }
                            catch (error) {
                                console.log("Error fetching collections")
                                console.log(error)
                            }
                        }
                    } else {
                        window.location.reload();
                        console.log("No authorized account found");
                    }
                });
            }
        }
        onAccountChange();
    }, []);

    return (<Layout walletAddress={currentAccount}/>)
}

export default App;
