import { Web3Storage } from 'web3.storage';
import { WEB3_STORAGE_TOKEN } from '../config/constants';

export const useIPFS = () => {
  const client = WEB3_STORAGE_TOKEN ? new Web3Storage({ token: WEB3_STORAGE_TOKEN }) : null;

  const uploadToIPFS = async (data: any): Promise<string> => {
    if (!client) {
      throw new Error('Web3.Storage client not initialized. Please add your API token.');
    }

    try {
      const file = new File([JSON.stringify(data)], 'task-data.json', {
        type: 'application/json',
      });

      const cid = await client.put([file]);
      return cid;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  };

  const getFromIPFS = async (cid: string): Promise<any> => {
    if (!client) {
      throw new Error('Web3.Storage client not initialized. Please add your API token.');
    }

    try {
      const res = await client.get(cid);
      if (!res?.ok) {
        throw new Error('Failed to get data from IPFS');
      }

      const files = await res.files();
      const file = files[0];
      const content = await file.text();
      return JSON.parse(content);
    } catch (error) {
      console.error('Error getting data from IPFS:', error);
      throw error;
    }
  };

  return {
    uploadToIPFS,
    getFromIPFS,
    isAvailable: !!client,
  };
};