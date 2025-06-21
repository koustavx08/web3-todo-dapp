import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/constants';

export const useContract = () => {
  const { getSigner, isConnected, isCorrectNetwork } = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const initContract = async () => {
      if (!isConnected || !isCorrectNetwork) {
        setContract(null);
        return;
      }

      try {
        const signer = await getSigner();
        if (signer && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
          const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(contractInstance);
        }
      } catch (error) {
        console.error('Error initializing contract:', error);
        setContract(null);
      }
    };

    initContract();
  }, [isConnected, isCorrectNetwork, getSigner]);

  return contract;
};