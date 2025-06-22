export const FUJI_CHAIN_ID = 43113;
export const FUJI_RPC = "https://api.avax-test.network/ext/bc/C/rpc";

export const CONTRACT_ADDRESS = "0xFa296AEC34aE2838b2587963cC43deB60E25c80c"; // Deploy contract and update this

export const FUJI_CONFIG = {
  chainId: '0xA869',
  chainName: 'Avalanche Fuji Testnet',
  nativeCurrency: {
    name: 'Avalanche Fuji',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: [FUJI_RPC],
  blockExplorerUrls: ['https://cchain.explorer.avax.network/'],
};

export const WEB3_STORAGE_TOKEN = ""; // Add your web3.storage token here

export const CONTRACT_ABI = [
  "function createTask(string memory _title, string memory _description, string memory _ipfsHash) external",
  "function completeTask(uint256 _taskId) external",
  "function delegateTask(uint256 _taskId, address _to) external",
  "function deleteTask(uint256 _taskId) external",
  "function mintTaskAsNFT(uint256 _taskId, string memory _tokenURI) external",
  "function getUserTasks(address _user) external view returns (uint256[])",
  "function getTask(uint256 _taskId) external view returns (tuple(uint256 id, string title, string description, string ipfsHash, bool completed, uint256 createdAt, uint256 completedAt, address owner, address delegatedTo, bool isNFT, uint256 nftTokenId))",
  "function getUserStats(address _user) external view returns (tuple(uint256 totalTasks, uint256 completedTasks, uint256 currentStreak, uint256 lastCompletionDate, uint256 maxStreak))",
  "event TaskCreated(uint256 indexed taskId, address indexed owner, string title)",
  "event TaskCompleted(uint256 indexed taskId, address indexed completer)",
  "event TaskDeleted(uint256 indexed taskId, address indexed owner)",
  "event TaskDelegated(uint256 indexed taskId, address indexed from, address indexed to)",
  "event TaskMintedAsNFT(uint256 indexed taskId, uint256 indexed tokenId, address indexed owner)",
  "event StreakUpdated(address indexed user, uint256 currentStreak, uint256 maxStreak)"
];