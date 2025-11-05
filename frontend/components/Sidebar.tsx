"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, TrendingUp, BookOpen, LogOut, Crown, X, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  username: string;
  avatar: string;
  tokens: number;
  isPremium: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            // Ensure avatar has a valid URL - use exact value from storage
            // Only set default if truly empty/null
            if (!userData.avatar || userData.avatar.trim() === "") {
              userData.avatar = "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=400&fit=crop";
            }
            setUser(userData);
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        } else {
          setUser(null);
        }
      }
    };

    loadUser();
    
    // Refresh user data when storage changes (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        loadUser();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom events (same-tab updates)
    window.addEventListener('userUpdated', loadUser);
    
    // Also listen for focus events to refresh on tab focus
    const handleFocus = () => loadUser();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', loadUser);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
    window.location.reload();
  };

  const sidebarLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Trending", href: "/trending", icon: TrendingUp },
    { label: "My Posts", href: "/my-posts", icon: BookOpen },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-black/95 dark:bg-black/95 bg-purple-50/95 backdrop-blur-xl border-r border-white/20 dark:border-white/20 border-purple-200/60 shadow-2xl z-50 overflow-y-auto transition-colors duration-300"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 relative flex items-center justify-center">
                    <Image
                      src="/logo.png"
                      alt="CalmVerse Logo"
                      width={40}
                      height={40}
                      className="object-contain rounded-lg"
                      priority
                      unoptimized
                      onError={(e) => {
                        // Hide image and show fallback
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="logo-fallback h-10 w-10 bg-white rounded-lg flex items-center justify-center hidden">
                      <span className="text-black font-bold text-xl">🐼</span>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-white dark:text-white text-gray-900 font-accent tracking-wide transition-colors duration-300">
                    Menu
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white dark:text-white text-gray-900 hover:bg-white/10 dark:hover:bg-white/10 hover:bg-gray-100 transition-all group transition-colors duration-300"
                    >
                      <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  );
                })}

                {user && (
                  <>
                    <div className="border-t border-white/10 my-4" />
                    <Link
                      href={`/profile/${user.id}`}
                      onClick={onClose}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white dark:text-white text-gray-900 hover:bg-white/10 dark:hover:bg-white/10 hover:bg-gray-100 transition-all group transition-colors duration-300"
                    >
                      <div className="relative">
                        {user.avatar && user.avatar.trim() !== "" ? (
                          <Image
                            src={user.avatar}
                            alt={user.username}
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                            unoptimized
                            onError={(e) => {
                              // If image fails to load, show initial fallback
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        {/* Fallback avatar with initial */}
                        <div 
                          className={`w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs ${user.avatar && user.avatar.trim() !== "" ? 'hidden' : ''}`}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        {user.isPremium && (
                          <Crown className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400" />
                        )}
                      </div>
                      <span className="font-medium">{user.username}</span>
                    </Link>
                    <div className="border-t border-white/10 dark:border-white/10 border-gray-300/50 my-4 transition-colors duration-300" />
                    <button
                      onClick={() => {
                        handleLogout();
                        onClose();
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white dark:text-white text-gray-900 hover:bg-red-500/20 dark:hover:bg-red-500/20 hover:bg-red-100 transition-all group w-full transition-colors duration-300"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                )}
              </nav>

              {/* Tokens */}
              {user && (
                <div className="mt-6 pt-6 border-t border-white/10 dark:border-white/10 border-gray-300/50 transition-colors duration-300">
                  <div className="flex items-center justify-between px-4 py-3 bg-black/40 dark:bg-black/40 bg-purple-100/90 rounded-lg border border-white/10 dark:border-white/10 border-purple-200/60 transition-colors duration-300">
                    <span className="text-white/60 dark:text-white/60 text-purple-700 text-sm transition-colors duration-300">Tokens</span>
                    <span className="text-white dark:text-white text-purple-900 font-bold text-lg transition-colors duration-300">{user.tokens}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

