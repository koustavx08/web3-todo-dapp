# Web3 Todo DApp

A comprehensive decentralized task management application built with ReactJS and Solidity, featuring NFT rewards, task delegation, and streak tracking on Ethereum Sepolia testnet.

## Features

### Core Functionality
- **Blockchain-based Task Management**: Create, complete, and delete tasks stored on Ethereum Sepolia
- **MetaMask Integration**: Seamless wallet connection with automatic network switching
- **Task Ownership**: Each task is owned by the creator's wallet address
- **Real-time Updates**: Blockchain event tracking for instant UI updates

### Advanced Features
- **Task Delegation**: Assign tasks to other wallet addresses
- **Daily Streak Tracking**: Monitor consecutive task completion streaks
- **NFT Minting**: Convert completed tasks into collectible NFTs with metadata
- **IPFS Integration**: Store long task descriptions and NFT metadata via web3.storage
- **Responsive Design**: Mobile-first design with glassmorphism aesthetics

## Tech Stack

### Frontend
- **ReactJS** with TypeScript
- **TailwindCSS** for styling
- **Ethers.js** for blockchain interactions
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Blockchain
- **Solidity** smart contracts
- **Ethereum Sepolia** testnet
- **OpenZeppelin** contracts for NFT functionality
- **IPFS** via web3.storage for decentralized storage

## Getting Started

### Prerequisites
- Node.js 18+
- MetaMask browser extension
- Ethereum Sepolia testnet ETH tokens

### Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

### Smart Contract Deployment

1. **Option 1: Using Remix IDE**
   - Open [Remix IDE](https://remix.ethereum.org)
   - Create a new file and paste the contract from `contracts/TodoList.sol`
   - Install OpenZeppelin contracts: `@openzeppelin/contracts`
   - Compile with Solidity 0.8.19+
   - Deploy to Ethereum Sepolia testnet using MetaMask

2. **Option 2: Using Hardhat**
   ```bash
   # In a separate project directory
   npm install --save-dev hardhat
   npx hardhat init
   # Copy contract to contracts/ folder
   # Configure hardhat.config.js for Ethereum Sepolia
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. **Update Contract Address**
   - Copy the deployed contract address
   - Update `CONTRACT_ADDRESS` in `src/config/constants.ts`
   - Refresh the application

### Configuration

1. **Web3.Storage (Optional)**
   - Get API token from [web3.storage](https://web3.storage)
   - Update `WEB3_STORAGE_TOKEN` in `src/config/constants.ts`
   - Required for IPFS functionality and NFT metadata storage

2. **RPC Configuration**
   - Default uses Infura's public RPC
   - For production, get your own RPC URL from [Infura](https://infura.io)
   - Update `SEPOLIA_RPC` in `src/config/constants.ts`

## Smart Contract Features

### Core Functions
- `createTask(title, description, ipfsHash)`: Create a new task
- `completeTask(taskId)`: Mark task as completed
- `delegateTask(taskId, address)`: Assign task to another user
- `deleteTask(taskId)`: Remove task (owner only, non-NFT tasks)
- `mintTaskAsNFT(taskId, tokenURI)`: Convert completed task to NFT

### Advanced Features
- **Streak Tracking**: Automatic calculation of daily streaks
- **User Statistics**: Total tasks, completion rates, max streaks
- **Access Control**: Owner-based permissions with delegation support
- **Event Emissions**: Real-time blockchain event notifications

## Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Switch Network**: Automatically switch to Ethereum Sepolia if needed
3. **Create Tasks**: Click "Create Task" and fill in details
4. **Manage Tasks**: Complete, delegate, or delete tasks as needed
5. **Mint NFTs**: Convert completed tasks to collectible NFTs
6. **Track Progress**: Monitor streaks and completion statistics

## Deployment

### Frontend Deployment (Vercel)
1. Build the project: `npm run build`
2. Deploy to Vercel or your preferred hosting platform
3. Set environment variables if using custom RPC/IPFS settings

### Smart Contract Verification
1. Verify contract on [Sepolia Etherscan](https://sepolia.etherscan.io)
2. Use the contract source code and constructor parameters
3. Enable public interaction through block explorer

## Development

### Project Structure
```
src/
├── components/         # React components
├── hooks/             # Custom React hooks
├── types/             # TypeScript interfaces
├── config/            # Configuration constants
└── App.tsx           # Main application component

contracts/
└── TodoList.sol      # Smart contract source
```

### Key Hooks
- `useWallet`: MetaMask connection and network management
- `useContract`: Smart contract initialization and interaction
- `useTasks`: Task management operations
- `useIPFS`: IPFS upload/download functionality

### Testing
- Test on Ethereum Sepolia testnet before mainnet deployment
- Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
- Verify all contract interactions work correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on Sepolia testnet
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the contract deployment steps
- Ensure you're on Ethereum Sepolia testnet
- Verify you have testnet ETH tokens
- Check browser console for detailed error messages