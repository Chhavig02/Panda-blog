"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Search, PlusCircle, Heart, MessageCircle, User, Crown, Bot, Menu, X } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

interface User {
  id: string;
  username: string;
  avatar: string;
  tokens: number;
  isPremium: boolean;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const navTabs = [
    { title: "Home", icon: Home },
    { title: "Create", icon: PlusCircle },
    { title: "AI Bot", icon: Bot },
  ];

  return (
    <nav className="sticky top-4 z-50 mx-4 max-w-7xl mx-auto">
      <div className="bg-white/10 dark:bg-white/10 bg-purple-100/80 backdrop-blur-lg border border-white/20 dark:border-white/20 border-purple-200/60 shadow-2xl rounded-2xl px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="flex items-center justify-between h-16">
          {/* Hamburger Menu & Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Menu className="h-5 w-5 text-white" />
              )}
            </button>
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 relative flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="CalmVerse Logo"
                  width={32}
                  height={32}
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
                <div className="logo-fallback h-8 w-8 bg-white rounded-lg flex items-center justify-center hidden">
                  <span className="text-black font-bold text-lg">😊</span>
                </div>
              </div>
              <span className="hidden sm:block text-xl font-bold text-white dark:text-white text-gray-900 font-accent tracking-wide transition-colors duration-300">
                CalmVerse
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 bg-black/40 dark:bg-black/40 bg-purple-50/90 border border-white/10 dark:border-white/10 border-purple-200/60 rounded-full text-sm text-white dark:text-white text-purple-900 placeholder:text-neutral-400 dark:placeholder:text-neutral-400 placeholder:text-purple-600/70 focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-white/50 focus:ring-purple-500/50 transition-colors duration-300"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Expandable Tabs */}
            <div className="hidden lg:block">
              <ExpandableTabs
                tabs={navTabs}
                onChange={(index) => {
                  if (index === 1) {
                    if (!user) {
                      router.push("/register");
                    } else {
                      router.push("/create-post");
                    }
                  }
                  if (index === 2) {
                    // AI Bot toggle - can be handled by parent
                  }
                }}
              />
            </div>

            {/* Theme Switcher */}
            <CinematicThemeSwitcher />

            {/* User Menu */}
            {user ? (
              <Link href={`/profile/${user.id}`}>
                <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                  {user.avatar && user.avatar.trim() !== "" ? (
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-pink-500 object-cover"
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
                    className={`w-8 h-8 rounded-full border-2 border-pink-500 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm ${user.avatar && user.avatar.trim() !== "" ? 'hidden' : ''}`}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  {user.isPremium && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </Link>
            ) : (
              <Link
                href="/register"
                className="relative px-4 py-2 rounded-full text-sm font-semibold transition-all overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 animate-gradient-x opacity-75 group-hover:opacity-100"></span>
                <span className="relative bg-black rounded-full px-4 py-2 block text-white">
                  Sign Up
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 bg-black/40 dark:bg-black/40 bg-purple-50/90 border border-white/10 dark:border-white/10 border-purple-200/60 rounded-full text-sm text-white dark:text-white text-purple-900 placeholder:text-neutral-400 dark:placeholder:text-neutral-400 placeholder:text-purple-600/70 focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-white/50 focus:ring-purple-500/50 transition-colors duration-300"
            />
          </div>
        </div>
      </div>
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </nav>
  );
}

