import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const NetworkWarning: React.FC = () => {
  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-3">
        <AlertTriangle className="text-amber-400" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-amber-300">Network Configuration Required</h3>
          <p className="text-amber-200 mt-1">
            Please switch to Ethereum Sepolia testnet to use this application. 
            Click the "Switch Network" button in the wallet connection area.
          </p>
        </div>
      </div>
    </div>
  );
};