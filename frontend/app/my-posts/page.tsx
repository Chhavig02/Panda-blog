"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Eye, Edit, Trash2, Plus, BookOpen } from "lucide-react";
import { postApi } from "@/lib/api";
import Navbar from "@/components/Navbar";

interface Post {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  views: number;
  likes: number;
  shares: number;
  featuredImage: string;
  createdAt: string;
  commentsCount?: number;
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/register');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
  }, [router]);

  useEffect(() => {
    if (user?.id) {
      loadMyPosts();
    }
  }, [user]);

  const loadMyPosts = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await postApi.getAll({ authorId: user.id, limit: 100 });
      if (response.data.success) {
        const postsData = response.data.data?.posts || response.data.data || [];
        setPosts(postsData);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await postApi.delete(postId);
      loadMyPosts();
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background dark:bg-[#0D0D0F] bg-[#F5F3FF] transition-colors duration-300">
      <Navbar />
      
      <main className="relative z-10 pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <BookOpen className="h-10 w-10 text-purple-400" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white dark:text-white text-gray-900 font-accent tracking-wide transition-colors duration-300">
                  My Posts
                </h1>
                <p className="text-neutral-400 dark:text-neutral-400 text-gray-600 text-lg mt-1 transition-colors duration-300">
                  Manage and track your content
                </p>
              </div>
            </motion.div>
            <Link
              href="/create-post"
              className="relative px-6 py-3 rounded-full font-semibold text-white transition-all overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 animate-gradient-x opacity-75 group-hover:opacity-100"></span>
              <span className="relative bg-black/60 backdrop-blur-sm rounded-full px-6 py-3 block border border-white/20 group-hover:border-white/40 transition-all flex items-center gap-2">
                <Plus className="h-5 w-5" />
                New Post
              </span>
            </Link>
          </div>

          {/* Posts Grid */}
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
              <BookOpen className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <p className="text-white text-xl mb-4">You haven't created any posts yet</p>
              <Link
                href="/create-post"
                className="inline-block px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-gradient-to-b from-gray-800/70 to-gray-900/90 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:scale-[1.02]">
                    {/* Post Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={post.featuredImage || "https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=800&h=400&fit=crop"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Link
                          href={`/edit-post/${post._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors"
                        >
                          <Edit className="h-4 w-4 text-white" />
                        </Link>
                        <button
                          onClick={(e) => handleDelete(post._id, e)}
                          className="p-2 bg-red-500/50 backdrop-blur-sm rounded-lg hover:bg-red-500/70 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="p-5">
                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
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
                        <Link
                          href={`/posts/${post._id}`}
                          className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                        >
                          View →
                        </Link>
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

