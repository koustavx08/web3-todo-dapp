import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';

export const ContractWarning: React.FC = () => {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-red-400 mt-1" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-red-300">Smart Contract Not Deployed</h3>
          <p className="text-red-200 mt-1 mb-4">
            The smart contract needs to be deployed to Ethereum Sepolia testnet before you can use this application.
          </p>
          <div className="space-y-2 text-sm text-red-200">
            <p><strong>To deploy the contract:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Use Remix IDE or Hardhat to deploy the contract</li>
              <li>Deploy to Ethereum Sepolia testnet</li>
              <li>Update the CONTRACT_ADDRESS in src/config/constants.ts</li>
              <li>Refresh the application</li>
            </ol>
          </div>
          <a
            href="https://remix.ethereum.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <ExternalLink size={16} />
            Open Remix IDE
          </a>
        </div>
      </div>
    </div>
  );
};