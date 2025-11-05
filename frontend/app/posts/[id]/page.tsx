"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { postApi, commentApi, userApi } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageSquare, Edit, Trash2, Crown, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";

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
  isPremium: boolean;
  likedBy?: string[];
  sharedBy?: string[];
}

interface Comment {
  _id: string;
  postId: string;
  commenterId: string;
  commenterName: string;
  content: string;
  createdAt: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    loadPost();
    loadComments();
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    }
  }, [postId]);

  const loadPost = async () => {
    try {
      const response = await postApi.getById(postId);
      if (response.data.success) {
        setPost(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load post:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await commentApi.getByPost(postId);
      if (response.data.success) {
        setComments(response.data.data.comments || response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please register first");
      return;
    }

    try {
      await postApi.like(postId);
      loadPost();
      // Refresh user data to get updated tokens (1 token for post author when someone likes)
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userData = JSON.parse(userStr);
          try {
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
        alert("Please register first");
      }
    }
  };

  const handleShare = async () => {
    if (!user) {
      alert("Please register first");
      return;
    }

    try {
      await postApi.share(postId);
      loadPost();
      
      // Copy post URL to clipboard
      const postUrl = `${window.location.origin}/posts/${postId}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(postUrl);
        alert("Post link copied to clipboard!");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("Please register first");
      }
      console.error("Failed to share post:", error);
    }
  };

  const handleComment = async () => {
    if (!user) {
      alert("Please register first");
      return;
    }

    if (!commentText.trim()) return;

    try {
      await commentApi.create(postId, commentText);
      setCommentText("");
      loadComments();
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("Please register first");
      }
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await postApi.delete(postId);
      router.push("/");
    } catch (error) {
      alert("Failed to delete post");
    }
  };

  const handleEditComment = async (commentId: string) => {
    try {
      await commentApi.update(commentId, editContent);
      setEditingComment(null);
      setEditContent("");
      loadComments();
    } catch (error) {
      alert("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await commentApi.delete(commentId);
      loadComments();
    } catch (error) {
      alert("Failed to delete comment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#0D0D0F] bg-[#F5F3FF] transition-colors duration-300">
        <div className="text-xl text-foreground">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#0D0D0F] bg-[#F5F3FF] transition-colors duration-300">
        <div className="text-xl text-foreground">Post not found</div>
      </div>
    );
  }

  const isAuthor = user && user.id === post.authorId;

  return (
    <div className="min-h-screen bg-background dark:bg-[#0D0D0F] bg-[#F5F3FF] transition-colors duration-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <Link href="/" className="text-purple-400 dark:text-purple-400 text-purple-600 hover:text-purple-300 dark:hover:text-purple-300 hover:text-purple-700 text-sm mb-6 inline-block flex items-center gap-2 transition-colors duration-300">
          ← Back to Home
        </Link>

        <article className="bg-gradient-to-b from-gray-800/70 to-gray-900/90 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="relative h-64 md:h-96">
            <Image
              src={post.featuredImage || "https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=800&h=400&fit=crop"}
              alt={post.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white dark:text-white text-gray-900 flex items-center gap-2 transition-colors duration-300">
                  {post.title}
                  {post.isPremium && <Crown className="h-6 w-6 text-yellow-400" />}
                </h1>
                <p className="text-neutral-300 dark:text-neutral-300 text-gray-700 transition-colors duration-300">
                  By {post.authorName} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>

              {isAuthor && (
                <div className="flex gap-2">
                  <Link
                    href={`/edit-post/${postId}`}
                    className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg border border-purple-500/30 transition-colors"
                  >
                    <Edit className="h-5 w-5 text-purple-300" />
                  </Link>
                  <button
                    onClick={handleDeletePost}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-500/30 transition-colors"
                  >
                    <Trash2 className="h-5 w-5 text-red-300" />
                  </button>
                </div>
              )}
            </div>

                    <div className="flex gap-4 mb-6 text-sm text-neutral-300 dark:text-neutral-300 text-gray-700 transition-colors duration-300">
              <span className="flex items-center gap-1">👁️ {post.views} views</span>
              <button
                onClick={handleLike}
                className="flex items-center gap-1 hover:text-pink-400 dark:hover:text-pink-400 hover:text-pink-600 transition-colors"
              >
                <Heart className="h-4 w-4" /> {post.likes}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 hover:text-purple-400 dark:hover:text-purple-400 hover:text-purple-600 transition-colors"
              >
                <Share2 className="h-4 w-4" /> {post.shares || 0}
              </button>
              <span className="flex items-center gap-1">⭐ Ranking: {post.rankingScore.toFixed(1)}</span>
            </div>

            <div className="flex gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/10 dark:bg-white/10 bg-gray-200/80 text-white/80 dark:text-white/80 text-gray-700 text-sm rounded-full border border-white/20 dark:border-white/20 border-gray-300/50 transition-colors duration-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

                    <div className="prose prose-invert dark:prose-invert prose-slate max-w-none text-white dark:text-white text-gray-900 whitespace-pre-wrap mb-8 leading-relaxed transition-colors duration-300">
                      {post.content}
                    </div>

            <div className="border-t border-white/10 pt-6">
                      <h2 className="text-2xl font-bold mb-4 text-white dark:text-white text-gray-900 transition-colors duration-300">
                        Comments ({comments.length})
                      </h2>

              {user ? (
                <div className="mb-6">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-4 py-3 border border-white/10 dark:border-white/10 border-gray-300/50 rounded-lg bg-black/40 dark:bg-black/40 bg-white/80 backdrop-blur-sm text-white dark:text-white text-gray-900 placeholder:text-neutral-400 dark:placeholder:text-neutral-400 placeholder:text-gray-500 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors duration-300"
                    rows={3}
                  />
                  <button
                    onClick={handleComment}
                    className="px-6 py-2 bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Post Comment
                  </button>
                </div>
              ) : (
                        <p className="mb-6 text-neutral-400 dark:text-neutral-400 text-gray-600 transition-colors duration-300">
                          <Link href="/register" className="text-purple-400 dark:text-purple-400 text-purple-600 hover:text-purple-300 dark:hover:text-purple-300 hover:text-purple-700 hover:underline transition-colors duration-300">
                            Register
                          </Link>{" "}
                          to leave a comment
                        </p>
              )}

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-neutral-400 dark:text-neutral-400 text-gray-600 text-center py-8 transition-colors duration-300">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment) => {
                    const isCommentAuthor = user && user.id === comment.commenterId;
                    const isEditing = editingComment === comment._id;

                    return (
                      <div
                        key={comment._id}
                        className="p-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg"
                      >
                        {isEditing ? (
                          <div>
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full px-4 py-3 border border-white/10 dark:border-white/10 border-gray-300/50 rounded-lg bg-black/40 dark:bg-black/40 bg-white/80 backdrop-blur-sm text-white dark:text-white text-gray-900 placeholder:text-neutral-400 dark:placeholder:text-neutral-400 placeholder:text-gray-500 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors duration-300"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditComment(comment._id)}
                                className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingComment(null);
                                  setEditContent("");
                                }}
                                className="px-4 py-2 bg-white/10 dark:bg-white/10 bg-gray-200/80 text-white dark:text-white text-gray-900 rounded-lg hover:bg-white/20 dark:hover:bg-white/20 hover:bg-gray-300/80 transition-colors border border-white/20 dark:border-white/20 border-gray-300/50 duration-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                        <p className="font-semibold text-white dark:text-white text-gray-900 transition-colors duration-300">
                                          {comment.commenterName}
                                        </p>
                                        <p className="text-sm text-neutral-400 dark:text-neutral-400 text-gray-600 transition-colors duration-300">
                                          {new Date(comment.createdAt).toLocaleString()}
                                        </p>
                              </div>
                              {isCommentAuthor && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingComment(comment._id);
                                      setEditContent(comment.content);
                                    }}
                                    className="text-purple-400 hover:text-purple-300 p-1 rounded hover:bg-white/10 transition-colors"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/20 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                                    <p className="text-white/90 dark:text-white/90 text-gray-800 transition-colors duration-300">{comment.content}</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

