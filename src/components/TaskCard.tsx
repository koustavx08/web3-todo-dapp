import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Trash2, 
  UserPlus, 
  Star, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  currentUser: string;
  onComplete: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  onDelegate: (taskId: number, address: string) => void;
  onMintNFT: (taskId: number) => void;
  loading: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  currentUser,
  onComplete,
  onDelete,
  onDelegate,
  onMintNFT,
  loading,
}) => {
  const [showDelegateInput, setShowDelegateInput] = useState(false);
  const [delegateAddress, setDelegateAddress] = useState('');

  const canComplete = task.owner === currentUser || task.delegatedTo === currentUser;
  const isOwner = task.owner === currentUser;
  const isDelegated = task.delegatedTo !== '0x0000000000000000000000000000000000000000';
  const canMintNFT = task.completed && isOwner && !task.isNFT;

  const handleDelegate = () => {
    if (delegateAddress.trim()) {
      onDelegate(task.id, delegateAddress.trim());
      setDelegateAddress('');
      setShowDelegateInput(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 transition-all duration-300 hover:bg-white/15 ${
      task.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => !task.completed && canComplete && onComplete(task.id)}
            disabled={task.completed || !canComplete || loading}
            className={`transition-colors ${
              task.completed
                ? 'text-emerald-400'
                : canComplete
                ? 'text-gray-300 hover:text-emerald-400'
                : 'text-gray-500 cursor-not-allowed'
            }`}
          >
            {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
          </button>
          
          <div>
            <h3 className={`font-semibold text-lg ${
              task.completed ? 'line-through text-gray-400' : 'text-white'
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-gray-300 text-sm mt-1">{task.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {task.isNFT && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 rounded-full text-xs font-medium text-white">
              <Star size={12} />
              NFT
            </div>
          )}
          
          {isDelegated && (
            <div className="flex items-center gap-1 bg-blue-500/20 border border-blue-500/30 px-2 py-1 rounded-full text-xs font-medium text-blue-300">
              <UserPlus size={12} />
              Delegated
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <Calendar size={12} />
        <span>Created: {formatDate(task.createdAt)}</span>
        {task.completed && (
          <>
            <span>•</span>
            <span>Completed: {formatDate(task.completedAt)}</span>
          </>
        )}
      </div>

      {isDelegated && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
          <p className="text-blue-300 text-sm">
            Delegated to: <span className="font-mono">{task.delegatedTo.slice(0, 10)}...</span>
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {canMintNFT && (
          <button
            onClick={() => onMintNFT(task.id)}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
          >
            <Star size={14} />
            Mint as NFT
          </button>
        )}

        {isOwner && !task.completed && !showDelegateInput && (
          <button
            onClick={() => setShowDelegateInput(true)}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <UserPlus size={14} />
            Delegate
          </button>
        )}

        {isOwner && !task.isNFT && (
          <button
            onClick={() => onDelete(task.id)}
            disabled={loading}
            className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <Trash2 size={14} />
            Delete
          </button>
        )}

        {task.isNFT && (
          <a
            href={`https://snowtrace.io/token/${task.nftContractAddress ?? '0xFa296AEC34aE2838b2587963cC43deB60E25c80c'}?a=${task.nftTokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <ExternalLink size={14} />
            View NFT
          </a>
        )}
      </div>

      {showDelegateInput && (
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <input
            type="text"
            placeholder="Enter wallet address to delegate to..."
            value={delegateAddress}
            onChange={(e) => setDelegateAddress(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleDelegate}
              disabled={!delegateAddress.trim() || loading}
              className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setShowDelegateInput(false);
                setDelegateAddress('');
              }}
              className="bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};