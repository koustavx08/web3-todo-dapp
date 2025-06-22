import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Plus, CheckSquare } from 'lucide-react';
import { WalletConnection } from './components/WalletConnection';
import { TaskCard } from './components/TaskCard';
import { CreateTaskModal } from './components/CreateTaskModal';
import { UserStats } from './components/UserStats';
import { NetworkWarning } from './components/NetworkWarning';
import { ContractWarning } from './components/ContractWarning';
import { useWallet } from './hooks/useWallet';
import { useTasks } from './hooks/useTasks';
import { CONTRACT_ADDRESS } from './config/constants';

function App() {
  const { account, isConnected, isCorrectNetwork } = useWallet();
  const { 
    tasks, 
    userStats, 
    loading, 
    createTask, 
    completeTask, 
    delegateTask, 
    deleteTask, 
    mintTaskAsNFT 
  } = useTasks();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fix contract deployed check for production
  const isContractDeployed = CONTRACT_ADDRESS !== undefined && CONTRACT_ADDRESS !== null && typeof CONTRACT_ADDRESS === 'string' && CONTRACT_ADDRESS.toLowerCase() !== "0x0000000000000000000000000000000000000000";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />
      
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                <CheckSquare className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-white">Web3 Todo DApp</h1>
            </div>
            <WalletConnection />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-md mx-auto">
              <CheckSquare className="mx-auto text-purple-400 mb-6" size={64} />
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to Web3 Todo</h2>
              <p className="text-gray-300 mb-8">
                A decentralized task management app with NFT rewards, task delegation, 
                and streak tracking powered by Avalanche Fuji Testnet.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>🏆 Complete tasks and mint them as NFTs</p>
                <p>🔥 Track your daily completion streaks</p>
                <p>👥 Delegate tasks to other users</p>
                <p>📱 Fully decentralized and blockchain-based</p>
              </div>
            </div>
          </div>
        ) : !isCorrectNetwork ? (
          <NetworkWarning />
        ) : !isContractDeployed ? (
          <ContractWarning />
        ) : (
          <>
            {/* User Stats */}
            <UserStats stats={userStats} />

            {/* Tasks Section */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Tasks</h2>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                Create Task
              </button>
            </div>

            {/* Tasks Grid */}
            {loading && tasks.length === 0 ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading your tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12">
                  <CheckSquare className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-white mb-2">No tasks yet</h3>
                  <p className="text-gray-300 mb-6">Create your first task to get started!</p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Create Your First Task
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    currentUser={account!}
                    onComplete={completeTask}
                    onDelete={deleteTask}
                    onDelegate={delegateTask}
                    onMintNFT={mintTaskAsNFT}
                    loading={loading}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={createTask}
        loading={loading}
      />
    </div>
  );
}

export default App;