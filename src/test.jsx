import React, {useContext, useEffect, useState} from 'react';
import {ethers} from 'ethers';
import { WalletContext } from './components/User/Dashboard/WalletContext';
import { useContractWrite, useContract, Web3Button } from "@thirdweb-dev/react";
// const BusinessSharesTokenABI = require("./BusinessSharesToken.json").abi
const contractAddress = "0x57d3c19Fbf8A8F8498D5F89FeEA514aB02Af622B";


const TestComponent = () => {
    const { walletInfo } = useContext(WalletContext);
    const [provider, setProvider] = useState(null);

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        console.log(provider)
      }
    };

    initializeProvider();
  }, []);
    const handleTestFunction = async (amount) => {
        try {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, signer);

            // Call the test function
            await contract.test(amount);

            console.log(`Test function called with amount: ${amount}`);
        } catch (error) {
            console.error('Error calling test function:', error);
        }
    };


  return (
    <div>
    <button onClick={() => handleTestFunction(100)}>Test Function</button>
</div>
  );
};

export default TestComponent;
