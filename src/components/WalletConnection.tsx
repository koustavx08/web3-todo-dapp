import React from 'react';
import { Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

export const WalletConnection: React.FC = () => {
  const { 
    account, 
    isConnected, 
    isCorrectNetwork, 
    connectWallet, 
    disconnectWallet, 
    switchToSepolia 
  } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Wallet size={20} />
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {!isCorrectNetwork && (
        <button
          onClick={switchToSepolia}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
        >
          <AlertCircle size={16} />
          Switch Network
        </button>
      )}
      
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg">
        {isCorrectNetwork ? (
          <CheckCircle size={16} className="text-emerald-400" />
        ) : (
          <AlertCircle size={16} className="text-amber-400" />
        )}
        <span className="text-sm font-medium text-white">
          {formatAddress(account!)}
        </span>
      </div>
      
      <button
        onClick={disconnectWallet}
        className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
};