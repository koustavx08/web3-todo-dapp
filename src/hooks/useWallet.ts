import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { WalletState } from '../types';
import { FUJI_CHAIN_ID, FUJI_CONFIG } from '../config/constants';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    isConnected: false,
    chainId: null,
    isCorrectNetwork: false,
  });

  const checkConnection = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const chainIdNumber = parseInt(chainId, 16);

      if (accounts.length > 0) {
        setWalletState({
          account: accounts[0],
          isConnected: true,
          chainId: chainIdNumber,
          isCorrectNetwork: chainIdNumber === FUJI_CHAIN_ID,
        });
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const chainIdNumber = parseInt(chainId, 16);

      setWalletState({
        account: accounts[0],
        isConnected: true,
        chainId: chainIdNumber,
        isCorrectNetwork: chainIdNumber === FUJI_CHAIN_ID,
      });

      if (chainIdNumber !== FUJI_CHAIN_ID) {
        await switchToSepolia();
      } else {
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const switchToSepolia = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: FUJI_CONFIG.chainId }],
      });
      toast.success('Switched to Ethereum Sepolia network');
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [FUJI_CONFIG],
          });
          toast.success('Added and switched to Ethereum Sepolia network');
        } catch (addError) {
          console.error('Error adding network:', addError);
          toast.error('Failed to add Ethereum Sepolia network');
        }
      } else {
        console.error('Error switching network:', switchError);
        toast.error('Failed to switch network');
      }
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      account: null,
      isConnected: false,
      chainId: null,
      isCorrectNetwork: false,
    });
    toast.success('Wallet disconnected');
  };

  const getProvider = () => {
    if (!window.ethereum) return null;
    return new ethers.BrowserProvider(window.ethereum);
  };

  const getSigner = async () => {
    const provider = getProvider();
    if (!provider) return null;
    return await provider.getSigner();
  };

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          checkConnection();
        }
      });

      window.ethereum.on('chainChanged', () => {
        checkConnection();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    getProvider,
    getSigner,
  };
};