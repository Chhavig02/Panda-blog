"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { userApi } from "@/lib/api";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await userApi.register(formData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.data.token);
        const userData = response.data.data.user;
        // Ensure avatar has a default if not provided
        if (!userData.avatar || userData.avatar.trim() === "") {
          userData.avatar = "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=400&fit=crop";
        }
        // Store complete user object in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        // Dispatch event to update all components immediately
        window.dispatchEvent(new Event('userUpdated'));
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#0D0D0F] bg-[#F5F3FF] transition-colors duration-300 p-4">
      <Navbar />
      <div className="w-full max-w-md bg-gradient-to-b from-gray-800/70 to-gray-900/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 mt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white dark:text-white text-gray-900 font-accent tracking-wide transition-colors duration-300">
            🐼 Join Panda Blog
          </h1>
          <p className="text-neutral-300 dark:text-neutral-300 text-gray-700 transition-colors duration-300">
            Create your account and start blogging
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-white dark:text-white text-gray-900 transition-colors duration-300">
              Username
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border border-white/10 dark:border-white/10 border-gray-300/50 rounded-lg bg-black/40 dark:bg-black/40 bg-white/80 backdrop-blur-sm text-white dark:text-white text-gray-900 placeholder:text-neutral-400 dark:placeholder:text-neutral-400 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors duration-300"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-white/10 dark:border-white/10 border-gray-300/50 rounded-lg bg-black/40 dark:bg-black/40 bg-white/80 backdrop-blur-sm text-white dark:text-white text-gray-900 placeholder:text-neutral-400 dark:placeholder:text-neutral-400 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors duration-300"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-white/10 dark:border-white/10 border-gray-300/50 rounded-lg bg-black/40 dark:bg-black/40 bg-white/80 backdrop-blur-sm text-white dark:text-white text-gray-900 placeholder:text-neutral-400 dark:placeholder:text-neutral-400 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors duration-300"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-400 dark:text-neutral-400 text-gray-600 transition-colors duration-300">
          Already have an account?{" "}
          <Link href="/" className="text-purple-400 dark:text-purple-400 text-purple-600 hover:text-purple-300 dark:hover:text-purple-300 hover:text-purple-700 hover:underline transition-colors duration-300">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

