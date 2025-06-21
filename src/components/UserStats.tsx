import React from 'react';
import { Trophy, Target, Flame, Calendar } from 'lucide-react';
import { UserStats as UserStatsType } from '../types';

interface UserStatsProps {
  stats: UserStatsType | null;
}

export const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
  if (!stats) return null;

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Target className="text-blue-400" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.totalTasks}</p>
            <p className="text-sm text-gray-400">Total Tasks</p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-lg">
            <Trophy className="text-emerald-400" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.completedTasks}</p>
            <p className="text-sm text-gray-400">Completed</p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500/20 p-2 rounded-lg">
            <Flame className="text-orange-400" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.currentStreak}</p>
            <p className="text-sm text-gray-400">Current Streak</p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/20 p-2 rounded-lg">
            <Calendar className="text-purple-400" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{completionRate}%</p>
            <p className="text-sm text-gray-400">Completion Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};