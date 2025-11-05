"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Crown, TrendingUp, Award, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";

interface LeaderboardUser {
  id: string;
  username: string;
  avatar: string;
  tokens: number;
  posts: number;
  likes: number;
  comments: number;
  score: number;
  rank: number;
  isPremium: boolean;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe]);

  const loadLeaderboard = async () => {
    try {
      const { userApi } = await import('@/lib/api');
      const response = await userApi.getLeaderboard({ limit: 50 });
      if (response.data.success) {
        const users = response.data.data || [];
        setLeaderboard(users);
      }
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
      // Fallback to empty array on error
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-400" />;
    if (rank === 2) return <Award className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="text-white/60 font-bold text-lg">#{rank}</span>;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
    if (rank === 2) return 'from-gray-400/20 to-gray-500/10 border-gray-400/30';
    if (rank === 3) return 'from-amber-600/20 to-amber-700/10 border-amber-600/30';
    return 'from-gray-800/70 to-gray-900/90 border-white/10';
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#0D0D0F] bg-[#F5F3FF] transition-colors duration-300">
      <Navbar />
      
      <main className="relative z-10 pt-8 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <Trophy className="h-10 w-10 text-yellow-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white dark:text-white text-gray-900 font-accent tracking-wide transition-colors duration-300">
                Leaderboard
              </h1>
            </motion.div>
            <p className="text-neutral-400 dark:text-neutral-400 text-gray-600 text-lg transition-colors duration-300">
              Top creators and contributors in the community
            </p>
          </div>

          {/* Timeframe Filter */}
          <div className="flex justify-center gap-4 mb-8">
            {(['all', 'week', 'month'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  timeframe === tf
                    ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white'
                    : 'bg-black/40 dark:bg-black/40 bg-white/80 border border-white/10 dark:border-white/10 border-gray-300/50 text-white/70 dark:text-white/70 text-gray-700 hover:border-white/20 dark:hover:border-white/20 hover:border-purple-300/50 transition-colors duration-300'
                }`}
              >
                {tf === 'all' ? 'All Time' : tf === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>

          {/* Leaderboard List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl h-24 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/profile/${user.id}`}>
                    <div
                      className={`bg-gradient-to-r ${getRankColor(user.rank)} backdrop-blur-md border rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                    >
                      <div className="flex items-center justify-between">
                        {/* Left: Rank & User */}
                        <div className="flex items-center gap-6">
                          <div className="flex items-center justify-center w-16">
                            {getRankIcon(user.rank)}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Image
                                src={user.avatar}
                                alt={user.username}
                                width={56}
                                height={56}
                                className="rounded-full border-2 border-white/20"
                              />
                              {user.isPremium && (
                                <Crown className="absolute -top-1 -right-1 h-5 w-5 text-yellow-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-white dark:text-white text-gray-900 font-bold text-lg flex items-center gap-2 transition-colors duration-300">
                                {user.username}
                                {user.isPremium && (
                                  <span className="text-xs bg-yellow-400/20 dark:bg-yellow-400/20 bg-yellow-100 text-yellow-400 dark:text-yellow-400 text-yellow-700 px-2 py-1 rounded-full transition-colors duration-300">
                                    Premium
                                  </span>
                                )}
                              </h3>
                              <p className="text-white/60 dark:text-white/60 text-gray-600 text-sm transition-colors duration-300">
                                {user.posts} posts • {user.likes} likes
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right: Stats */}
                        <div className="flex items-center gap-8">
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-yellow-400 mb-1">
                              <Zap className="h-4 w-4" />
                              <span className="font-bold text-xl">{user.tokens}</span>
                            </div>
                            <p className="text-white/60 dark:text-white/60 text-gray-600 text-xs transition-colors duration-300">Tokens</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-purple-400 mb-1">
                              <TrendingUp className="h-4 w-4" />
                              <span className="font-bold text-xl">{user.score}</span>
                            </div>
                            <p className="text-white/60 dark:text-white/60 text-gray-600 text-xs transition-colors duration-300">Score</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && leaderboard.length === 0 && (
            <div className="text-center py-20">
              <Trophy className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-xl">No leaderboard data yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

