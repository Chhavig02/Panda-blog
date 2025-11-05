"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, TrendingUp, BookOpen, User, Crown, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface User {
  id: string;
  username: string;
  avatar: string;
  tokens: number;
  isPremium: boolean;
}

export default function FloatingSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    }
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
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:block fixed left-6 top-24 z-40"
    >
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-2xl">
        <nav className="space-y-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all group relative overflow-hidden"
              >
                <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}

          {user && (
            <>
              <div className="border-t border-white/10 my-2" />
              <Link
                href={`/profile/${user.id}`}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all group relative overflow-hidden"
              >
                <div className="relative">
                  <Image
                    src={user.avatar || "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=400&fit=crop"}
                    alt={user.username}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  {user.isPremium && (
                    <Crown className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400" />
                  )}
                </div>
                <span className="font-medium">{user.username}</span>
              </Link>
              <div className="border-t border-white/10 my-2" />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white hover:bg-red-500/20 transition-all group w-full"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </>
          )}
        </nav>

        {user && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between px-4 py-2 bg-black/40 rounded-lg border border-white/10">
              <span className="text-white/60 text-xs">Tokens</span>
              <span className="text-white font-bold">{user.tokens}</span>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}

