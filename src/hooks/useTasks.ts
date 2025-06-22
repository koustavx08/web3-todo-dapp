import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useIPFS } from './useIPFS';
import { Task, UserStats } from '../types';

export const useTasks = () => {
  const contract = useContract();
  const { account, isConnected } = useWallet();
  const { uploadToIPFS } = useIPFS();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    if (!contract || !account) return;

    try {
      setLoading(true);
      const taskIds = await contract.getUserTasks(account);
      const fetchedTasks: Task[] = [];

      for (const taskId of taskIds) {
        try {
          const task = await contract.getTask(taskId);
          fetchedTasks.push({
            id: Number(task.id),
            title: task.title,
            description: task.description,
            ipfsHash: task.ipfsHash,
            completed: task.completed,
            createdAt: Number(task.createdAt),
            completedAt: Number(task.completedAt),
            owner: task.owner,
            delegatedTo: task.delegatedTo,
            isNFT: task.isNFT,
            nftTokenId: Number(task.nftTokenId),
          });
        } catch (error) {
          console.error(`Error fetching task ${taskId}:`, error);
        }
      }

      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!contract || !account) return;

    try {
      const stats = await contract.getUserStats(account);
      setUserStats({
        totalTasks: Number(stats.totalTasks),
        completedTasks: Number(stats.completedTasks),
        currentStreak: Number(stats.currentStreak),
        lastCompletionDate: Number(stats.lastCompletionDate),
        maxStreak: Number(stats.maxStreak),
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const createTask = async (title: string, description: string) => {
    if (!contract) {
      toast.error('Contract not available');
      return;
    }

    try {
      setLoading(true);
      
      // Upload description to IPFS if it's long
      let ipfsHash = '';
      if (description.length > 100) {
        try {
          ipfsHash = await uploadToIPFS({ description, createdAt: Date.now() });
        } catch (error) {
          console.warn('Failed to upload to IPFS, using empty hash:', error);
        }
      }

      const tx = await contract.createTask(title, description, ipfsHash);
      toast.loading('Creating task...', { id: 'create-task' });
      
      await tx.wait();
      toast.success('Task created successfully!', { id: 'create-task' });
      
      await fetchTasks();
      await fetchUserStats();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task', { id: 'create-task' });
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: number) => {
    let contractInstance = contract;
    try {
      setLoading(true);
      // Ensure MetaMask is available and connected
      if (!window.ethereum) {
        toast.error('MetaMask not found');
        setLoading(false);
        return;
      }
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Fallback: if contract is not available, instantiate it
      if (!contractInstance) {
        const { ethers } = await import('ethers');
        const { CONTRACT_ADDRESS, CONTRACT_ABI } = await import('../config/constants');
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      }

      const tx = await contractInstance.completeTask(taskId);
      toast.loading('Completing task...', { id: 'complete-task' });
      await tx.wait();
      toast.success('Task completed successfully!', { id: 'complete-task' });
      await fetchTasks();
      await fetchUserStats();
    } catch (error: any) {
      let message = 'Failed to complete task';
      if (error?.data?.message) message = error.data.message;
      else if (error?.message) message = error.message;
      toast.error(message, { id: 'complete-task' });
      console.error('Error completing task:', error);
    } finally {
      setLoading(false);
    }
  };

  const delegateTask = async (taskId: number, delegateAddress: string) => {
    if (!contract) {
      toast.error('Contract not available');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.delegateTask(taskId, delegateAddress);
      toast.loading('Delegating task...', { id: 'delegate-task' });
      
      await tx.wait();
      toast.success('Task delegated successfully!', { id: 'delegate-task' });
      
      await fetchTasks();
    } catch (error) {
      console.error('Error delegating task:', error);
      toast.error('Failed to delegate task', { id: 'delegate-task' });
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!contract) {
      toast.error('Contract not available');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.deleteTask(taskId);
      toast.loading('Deleting task...', { id: 'delete-task' });
      
      await tx.wait();
      toast.success('Task deleted successfully!', { id: 'delete-task' });
      
      await fetchTasks();
      await fetchUserStats();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task', { id: 'delete-task' });
    } finally {
      setLoading(false);
    }
  };

  const mintTaskAsNFT = async (taskId: number) => {
    if (!contract) {
      toast.error('Contract not available');
      return;
    }

    try {
      setLoading(true);
      
      // Create metadata for the NFT
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        toast.error('Task not found');
        return;
      }

      const metadata = {
        name: `Completed Task: ${task.title}`,
        description: task.description,
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=${task.title}`,
        attributes: [
          { trait_type: 'Completion Date', value: new Date(task.completedAt * 1000).toISOString() },
          { trait_type: 'Task Type', value: 'Todo Completion' },
        ],
      };

      let tokenURI = '';
      try {
        tokenURI = await uploadToIPFS(metadata);
      } catch (error) {
        console.warn('Failed to upload NFT metadata to IPFS:', error);
        tokenURI = JSON.stringify(metadata);
      }

      const tx = await contract.mintTaskAsNFT(taskId, tokenURI);
      toast.loading('Minting NFT...', { id: 'mint-nft' });
      
      await tx.wait();
      toast.success('Task minted as NFT successfully!', { id: 'mint-nft' });
      
      await fetchTasks();
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast.error('Failed to mint NFT', { id: 'mint-nft' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && contract) {
      fetchTasks();
      fetchUserStats();
    }
  }, [isConnected, contract, account]);

  return {
    tasks,
    userStats,
    loading,
    createTask,
    completeTask,
    delegateTask,
    deleteTask,
    mintTaskAsNFT,
    refreshTasks: fetchTasks,
  };
};