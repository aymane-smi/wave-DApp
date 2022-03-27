import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {
  const { ethereum } = window;
  const [CurrentUser, setCurrentUser] = useState(null);
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = '0x5484B907cdcDCc1C82125887f18D33d62c7964D5';
  const contractABI = abi.abi;
  
  const checkWalletIsConnected = async()=>{
    if(ethereum)
      console.log("ethereum object exist:", ethereum);
    else{
      console.lgo("ethereum object doesn't exist!!!");
    }
    const accounts = await     ethereum.request({method:"eth_accounts"});
    if(accounts.length !== 0){
      const account = accounts[0];
      console.log("account authorized:", account);
      setCurrentUser(account);
    }else{
      console.log("not account logged yet!");
    }
  };


  //connecting to metamask

  const connectWallet = async()=>{
    try{
      if(!ethereum){
        alert("please Connect using MetaMask!!!");
        return;
      }

      const request_account = await ethereum.request({method : "eth_requestAccounts"});

      console.log("connected!", request_account);
      setCurrentUser(request_account[0]);
    }catch(err){
      console.log(err.message);
    }
  };
  
  //making a wave
  const wave = async() => {
    const message = prompt("enter you message!");
    try{
      const provider = await new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      let TotalWaves = await wavePortalContract.getTotalWaves();
      console.log("Total waves that been created:", TotalWaves.toNumber(), TotalWaves);

      const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
      console.log("Mining... ", waveTxn.hash);
      await waveTxn.wait();
      console.log("Mined... ", waveTxn.hash);
      getAllWaves();
      
      console.log("Total waves that been created:", TotalWaves.toNumber(), TotalWaves);
    }catch(err){
      console.log(err.message);
    }
  }

  //get all waves stored in blockchain

  const getAllWaves = async () => {
    try{
      const provider = await new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      
      const allWaves = await wavePortalContract.getAllWaves();

      const wavesCleaned = [];

      //you can use forEach but i prefer using for...of
      for(let wave of allWaves){
        wavesCleaned.push({
          message: wave.message,
          address: wave.waver,
          timestamp : new Date(wave.timestamp * 1000)
        });
      }

      setAllWaves(wavesCleaned);
      console.log("get waves called!");
    }catch(err){
      console.log(err.message);
    }
  };
  //componentdidMount
  useEffect(async()=>{
    checkWalletIsConnected();
    // const onNewWave = (from, timestamp, message) => {
    //   setAllWaves(prev => [...prev, {
    //     address : from,
    //     message,
    //     timestamp
    //   }]);
    // };
    // if(ethereum){
    //   const provider = await new ethers.providers.Web3Provider(ethereum);
    //   const signer = provider.getSigner();
    //   const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    //   wavePortalContract.on("onNewWave",onNewWave);

    //   return () => {
    //     if(wavePortalContract)
    //         wavePortalContract.off("onNewWave",onNewWave);
    //   }
    // }
  }, []);

  //rerender every time we add a message
  useEffect(()=>{}, [allWaves]);

  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am Aymane , want to try my DApp ? Connect your Ethereum wallet and wave at me!
        </div>

        {CurrentUser && <>
            
            <button className="waveButton" onClick={wave}>
              Wave at Me
            </button>
        </>}
        {!CurrentUser && (
          <button className="waveButton" onClick={connectWallet}>
            connect to Wave
          </button>
        )}
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}
