"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { userApi, postApi } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Crown, Coins, Edit } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  tokens: number;
  isPremium: boolean;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  views: number;
  likes: number;
  createdAt: string;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ bio: "", avatar: "" });

  useEffect(() => {
    // Load current user from localStorage first
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const parsedUser = JSON.parse(userStr);
          setCurrentUser(parsedUser);
        } catch (error) {
          console.error("Error parsing current user:", error);
        }
      }
    }
    // Then load profile data
    loadUser();
    loadPosts();
  }, [userId]);

  const loadUser = async () => {
    try {
      const response = await userApi.getProfile(userId);
      if (response.data.success) {
        const userData = response.data.data;
        
        // Ensure avatar is valid
        if (!userData.avatar || userData.avatar.trim() === "") {
          userData.avatar = "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=400&fit=crop";
        }
        
        setUser(userData);
        setEditData({
          bio: userData.bio || "",
          avatar: userData.avatar || "",
        });
        
        // If this is the current user's profile, update localStorage with latest data
        // Check both currentUser state and localStorage
        const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        const storedUserData = storedUser ? JSON.parse(storedUser) : null;
        
        if ((currentUser || storedUserData) && (currentUser?.id === userId || storedUserData?.id === userId)) {
          const updatedUser = {
            ...(currentUser || storedUserData),
            ...userData,
            avatar: userData.avatar, // Use the exact avatar from API
            bio: userData.bio || (currentUser?.bio || storedUserData?.bio || ""),
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
          // Dispatch event to update all components
          window.dispatchEvent(new Event('userUpdated'));
        }
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await postApi.getAll({ limit: 50 });
      if (response.data.success) {
        const allPosts = response.data.data.posts || response.data.data || [];
        const userPosts = allPosts.filter((post: any) => post.authorId === userId);
        setPosts(userPosts);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!currentUser || currentUser.id !== userId) return;

    try {
      const response = await userApi.updateProfile(userId, editData);
      setIsEditing(false);
      
      // Reload user from API to get the latest data
      await loadUser();
      
      // Update localStorage if it's current user - use API response or reloaded data
      if (currentUser.id === userId) {
        // Get the updated user data (either from response or reload)
        const updatedUserData = user || response.data?.data || { ...currentUser, ...editData };
        
        // Ensure avatar is valid
        if (!updatedUserData.avatar || updatedUserData.avatar.trim() === "") {
          updatedUserData.avatar = "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=400&fit=crop";
        }
        
        // Update localStorage with complete user object
        const fullUserData = {
          ...currentUser,
          ...updatedUserData,
          avatar: updatedUserData.avatar,
          bio: updatedUserData.bio || editData.bio,
        };
        
        localStorage.setItem("user", JSON.stringify(fullUserData));
        
        // Dispatch event to update all components
        window.dispatchEvent(new Event('userUpdated'));
        
        // Also update currentUser state
        setCurrentUser(fullUserData);
      }
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  const handleAddTokens = async () => {
    try {
      await userApi.addTokens(10);
      await loadUser(); // Reload to get updated tokens
      
      // Update localStorage with latest user data
      if (currentUser && currentUser.id === userId) {
        const updatedUser = {
          ...currentUser,
          tokens: (currentUser.tokens || 0) + 10,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        window.dispatchEvent(new Event('userUpdated'));
      }
    } catch (error) {
      alert("Failed to add tokens");
    }
  };

  const handleUpgradePremium = async () => {
    try {
      await userApi.upgradeToPremium();
      await loadUser(); // Reload to get updated premium status
      
      // Update localStorage with latest user data
      if (currentUser && currentUser.id === userId) {
        const updatedUser = {
          ...currentUser,
          isPremium: true,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        window.dispatchEvent(new Event('userUpdated'));
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to upgrade");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#0D0D0F] bg-[#F5F3FF] transition-colors duration-300">
        <div className="text-xl text-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#0D0D0F] bg-[#F5F3FF] transition-colors duration-300">
        <div className="text-xl text-foreground">User not found</div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.id === userId;

  return (
    <div className="min-h-screen bg-background dark:bg-[#0D0D0F] bg-[#F5F3FF] transition-colors duration-300 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline text-sm mb-4 inline-block">
          ← Back to Home
        </Link>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="relative">
              <Image
                src={user.avatar && user.avatar.trim() !== "" ? user.avatar : "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=400&fit=crop"}
                alt={user.username}
                width={120}
                height={120}
                className="rounded-full object-cover"
                unoptimized
                onError={(e) => {
                  // Fallback to default if image fails
                  e.currentTarget.src = "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=400&fit=crop";
                }}
              />
              {user.isPremium && (
                <Crown className="absolute -top-2 -right-2 h-8 w-8 text-yellow-500" />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">
                {user.username}
              </h1>
              {user.bio && (
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  {user.bio}
                </p>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="text-black dark:text-white">{user.tokens} Tokens</span>
                </div>
                {user.isPremium && (
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
                    Premium
                  </span>
                )}
              </div>

              {isOwnProfile && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" /> Edit Profile
                  </button>
                  <button
                    onClick={handleAddTokens}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Add 10 Tokens
                  </button>
                  {!user.isPremium && (
                    <button
                      onClick={handleUpgradePremium}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-2"
                    >
                      <Crown className="h-4 w-4" /> Upgrade Premium (50 tokens)
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {isEditing && isOwnProfile && (
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
                Edit Profile
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Bio
                  </label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-black dark:text-white"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={editData.avatar}
                    onChange={(e) => setEditData({ ...editData, avatar: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-black dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateProfile}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-neutral-200 dark:bg-neutral-600 text-black dark:text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
              Posts ({posts.length})
            </h2>
            <div className="space-y-4">
              {posts.length === 0 ? (
                <p className="text-neutral-600 dark:text-neutral-400">
                  No posts yet
                </p>
              ) : (
                posts.map((post) => (
                  <Link
                    key={post._id}
                    href={`/posts/${post._id}`}
                    className="block p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
                  >
                    <h3 className="font-semibold text-black dark:text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-2">
                      {post.content}
                    </p>
                    <div className="flex gap-4 text-xs text-neutral-500">
                      <span>👁️ {post.views}</span>
                      <span>❤️ {post.likes}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

