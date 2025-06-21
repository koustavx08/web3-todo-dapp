export interface Task {
  id: number;
  title: string;
  description: string;
  ipfsHash: string;
  completed: boolean;
  createdAt: number;
  completedAt: number;
  owner: string;
  delegatedTo: string;
  isNFT: boolean;
  nftTokenId: number;
}

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  currentStreak: number;
  lastCompletionDate: number;
  maxStreak: number;
}

export interface WalletState {
  account: string | null;
  isConnected: boolean;
  chainId: number | null;
  isCorrectNetwork: boolean;
}