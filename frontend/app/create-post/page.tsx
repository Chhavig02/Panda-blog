"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { postApi } from "@/lib/api";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function CreatePostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    featuredImage: "",
    isPremium: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        router.push("/register");
        return;
      }
      setUser(JSON.parse(userStr));
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await postApi.create({
        title: formData.title,
        content: formData.content,
        tags: tagsArray,
        featuredImage: formData.featuredImage || undefined,
        isPremium: formData.isPremium && user?.isPremium,
      });

      if (response.data.success) {
        // Refresh user data to get updated tokens (5 tokens for creating post)
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
        router.push(`/posts/${response.data.data._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#0D0D0F] bg-[#F5F3FF] transition-colors duration-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <div className="mb-6">
                  <Link
                    href="/"
                    className="text-purple-400 dark:text-purple-400 text-purple-600 hover:text-purple-300 dark:hover:text-purple-300 hover:text-purple-700 hover:underline text-sm flex items-center gap-2 transition-colors duration-300"
                  >
                    ← Back to Home
                  </Link>
        </div>

        <div className="bg-gradient-to-b from-gray-800/70 to-gray-900/90 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-white dark:text-white text-gray-900 font-accent tracking-wide transition-colors duration-300">
            🐼 Create New Post
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white dark:text-white text-gray-900 transition-colors duration-300">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-white/10 dark:border-white/10 border-gray-300/50 rounded-lg bg-black/40 dark:bg-black/40 bg-white/80 backdrop-blur-sm text-white dark:text-white text-gray-900 placeholder:text-neutral-400 dark:placeholder:text-neutral-400 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors duration-300"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white dark:text-white text-gray-900 transition-colors duration-300">
                Content
              </label>
              <textarea
                required
                rows={15}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border border-white/10 dark:border-white/10 border-gray-300/50 rounded-lg bg-black/40 dark:bg-black/40 bg-white/80 backdrop-blur-sm text-white dark:text-white text-gray-900 placeholder:text-neutral-400 dark:placeholder:text-neutral-400 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors duration-300"
                placeholder="Write your post content here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white dark:text-white text-gray-900 transition-colors duration-300">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 border border-white/10 dark:border-white/10 border-gray-300/50 rounded-lg bg-black/40 dark:bg-black/40 bg-white/80 backdrop-blur-sm text-white dark:text-white text-gray-900 placeholder:text-neutral-400 dark:placeholder:text-neutral-400 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors duration-300"
                placeholder="tech, programming, web-dev"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white dark:text-white text-gray-900 transition-colors duration-300">
                Featured Image URL (optional)
              </label>
              <input
                type="url"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                className="w-full px-4 py-3 border border-white/10 dark:border-white/10 border-gray-300/50 rounded-lg bg-black/40 dark:bg-black/40 bg-white/80 backdrop-blur-sm text-white dark:text-white text-gray-900 placeholder:text-neutral-400 dark:placeholder:text-neutral-400 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors duration-300"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            {user.isPremium && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={formData.isPremium}
                  onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                  className="mr-2 w-4 h-4 text-purple-500 bg-black/40 border-white/10 rounded focus:ring-purple-500"
                />
                        <label htmlFor="isPremium" className="text-sm text-white dark:text-white text-gray-900 transition-colors duration-300">
                          Mark as Premium Post
                        </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

