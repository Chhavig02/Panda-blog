"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Eye, TrendingUp, Clock, Flame } from "lucide-react";
import { postApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  tags: string[];
  views: number;
  likes: number;
  shares: number;
  rankingScore: number;
  featuredImage: string;
  createdAt: string;
  commentsCount?: number;
}

export default function TrendingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadTrendingPosts();
  }, []);

  const loadTrendingPosts = async () => {
    try {
      const response = await postApi.getAll({ sort: 'rankingScore', limit: 50 });
      if (response.data.success) {
        setPosts(response.data.data.posts || response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to load trending posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#0D0D0F] bg-[#F5F3FF] transition-colors duration-300">
      <Navbar />
      
      <main className="relative z-10 pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <Flame className="h-10 w-10 text-orange-500" />
              <h1 className="text-4xl md:text-5xl font-bold text-white dark:text-white text-gray-900 font-accent tracking-wide transition-colors duration-300">
                Trending Posts
              </h1>
            </motion.div>
            <p className="text-neutral-400 dark:text-neutral-400 text-gray-600 text-lg transition-colors duration-300">
              Most popular and engaging content right now
            </p>
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl h-96 animate-pulse"
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <Flame className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <p className="text-white text-xl">No trending posts yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/posts/${post._id}`)}
                >
                  <div className="bg-gradient-to-b from-gray-800/70 to-gray-900/90 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                    {/* Post Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={post.featuredImage || "https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=800&h=400&fit=crop"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 flex items-center space-x-1 bg-orange-500/80 backdrop-blur-sm px-3 py-1 rounded-full">
                        <TrendingUp className="h-4 w-4 text-white" />
                        <span className="text-white text-xs font-semibold">Trending</span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {post.authorName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white font-semibold text-sm">
                            {post.authorName}
                          </span>
                        </div>
                        <span className="text-white/60 text-xs flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(post.createdAt)}
                        </span>
                      </div>

                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-white/70 text-sm mb-4 line-clamp-2">
                        {post.content}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-white/80">
                            <Heart className="h-5 w-5" />
                            <span className="text-sm">{post.likes}</span>
                          </div>
                          <Link
                            href={`/posts/${post._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center space-x-1 text-white/80 hover:text-purple-400 transition-colors"
                          >
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-sm">{post.commentsCount || 0}</span>
                          </Link>
                          <div className="flex items-center space-x-1 text-white/80">
                            <Eye className="h-5 w-5" />
                            <span className="text-sm">{post.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

