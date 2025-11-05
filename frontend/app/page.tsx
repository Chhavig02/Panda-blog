"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Share2, Eye, TrendingUp, Clock } from "lucide-react";
import { postApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/HeroSection";
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
  likedBy?: string[];
  sharedBy?: string[];
}

interface User {
  id: string;
  username: string;
  avatar: string;
  tokens: number;
  isPremium: boolean;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadPosts();
    loadUser();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await postApi.getAll({ sort: 'rankingScore', limit: 30 });
      if (response.data.success) {
        setPosts(response.data.data.posts || response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUser = () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (userStr && token) {
        setUser(JSON.parse(userStr));
      }
    }
  };

  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      router.push("/register");
      return;
    }

    try {
      await postApi.like(postId);
      loadPosts(); // Reload posts to get updated likes
      // Refresh user data to get updated tokens (1 token for post author when someone likes)
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userData = JSON.parse(userStr);
          try {
            const { userApi } = await import('@/lib/api');
            const response = await userApi.getProfile(userData.id);
            if (response.data.success) {
              localStorage.setItem("user", JSON.stringify(response.data.data));
              window.dispatchEvent(new Event('userUpdated'));
            }
          } catch (error) {
            console.error("Failed to refresh user data:", error);
          }
        }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/register");
      }
    }
  };

  const handleShare = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      router.push("/register");
      return;
    }

    try {
      await postApi.share(postId);
      loadPosts(); // Reload posts to get updated shares
      
      // Copy post URL to clipboard
      const postUrl = `${window.location.origin}/posts/${postId}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(postUrl);
        // Show success message (you could add a toast notification here)
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/register");
      }
      console.error("Failed to share post:", error);
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
    <div className="min-h-screen relative bg-background dark:bg-[#0D0D0F] bg-[#F5F3FF] transition-colors duration-300">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Spline Background */}
      <HeroSection />

      {/* Main Content */}
      <main className="relative z-10 pt-8 pb-20 bg-background dark:bg-[#0D0D0F] bg-[#F5F3FF] transition-colors duration-300">

        {/* Posts Grid - Instagram Style */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl h-96 animate-pulse"
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white text-xl">No posts yet. Be the first to share!</p>
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
                  <motion.div
                    whileHover={{ scale: 1.02, y: -8 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="bg-gradient-to-b from-gray-800/70 dark:from-gray-800/70 from-purple-50/90 to-gray-900/90 dark:to-gray-900/90 to-purple-100/90 backdrop-blur-md border border-white/10 dark:border-white/10 border-purple-200/60 rounded-3xl overflow-hidden hover:border-white/20 dark:hover:border-white/20 hover:border-purple-300/70 transition-all duration-300 lift-3d relative group"
                  >
                    {/* Post Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={post.featuredImage || "https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=800&h=400&fit=crop"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Ranking Badge */}
                      <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        <TrendingUp className="h-4 w-4 text-yellow-400" />
                        <span className="text-white text-xs font-semibold">
                          #{Math.round(post.rankingScore)}
                        </span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="p-5">
                      {/* Author & Date */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {post.authorName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white dark:text-white text-purple-900 font-semibold text-sm transition-colors duration-300">
                            {post.authorName}
                          </span>
                        </div>
                        <span className="text-white/60 dark:text-white/60 text-purple-700 text-xs flex items-center transition-colors duration-300">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(post.createdAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-white dark:text-white text-purple-900 font-bold text-lg mb-2 line-clamp-2 group-hover:text-pink-300 dark:group-hover:text-pink-300 group-hover:text-purple-700 transition-colors duration-300">
                        {post.title}
                      </h3>

                      {/* Content Preview */}
                      <p className="text-white/70 dark:text-white/70 text-purple-800 text-sm mb-4 line-clamp-2 transition-colors duration-300">
                        {post.content}
                      </p>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-white/10 dark:bg-white/10 bg-purple-200/80 rounded-full text-white/80 dark:text-white/80 text-purple-800 text-xs transition-colors duration-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-white/10 border-gray-300/50 transition-colors duration-300">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={(e) => handleLike(post._id, e)}
                            className="flex items-center space-x-1 text-white/80 dark:text-white/80 text-purple-700 hover:text-pink-400 dark:hover:text-pink-400 hover:text-pink-600 transition-colors group/btn"
                          >
                            <Heart className={cn(
                              "h-5 w-5 transition-transform group-hover/btn:scale-110",
                              user && post.likes > 0 && "fill-pink-400 text-pink-400 dark:fill-pink-400 dark:text-pink-400"
                            )} />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <Link
                            href={`/posts/${post._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center space-x-1 text-white/80 dark:text-white/80 text-purple-700 hover:text-purple-400 dark:hover:text-purple-400 hover:text-purple-600 transition-colors"
                          >
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-sm">{post.commentsCount || 0}</span>
                          </Link>
                          <div className="flex items-center space-x-1 text-white/80 dark:text-white/80 text-purple-700 transition-colors duration-300">
                            <Eye className="h-5 w-5" />
                            <span className="text-sm">{post.views}</span>
                          </div>
                        </div>
                        <button className="text-white/80 dark:text-white/80 text-purple-700 hover:text-purple-400 dark:hover:text-purple-400 hover:text-purple-600 transition-colors hover:scale-110 transition-transform">
                          <Share2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 -z-10 animate-shimmer pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {!loading && posts.length > 0 && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-3 rounded-full font-semibold text-white transition-all overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 animate-gradient-x opacity-50 group-hover:opacity-100"></span>
              <span className="relative bg-black/60 dark:bg-black/60 bg-purple-100/90 backdrop-blur-md border border-white/10 dark:border-white/10 border-purple-300/60 rounded-full px-8 py-3 block group-hover:border-white/20 dark:group-hover:border-white/20 group-hover:border-purple-400/70 text-white dark:text-white text-purple-900 transition-colors duration-300">
                Load More Posts
              </span>
            </motion.button>
          </div>
        )}
      </main>
    </div>
  );
}
