"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Clock, ArrowRight, Tag } from "lucide-react";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/data/blog-posts";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  "Visa Guide": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Scholarships": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Destinations": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Test Prep": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "Application Tips": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  "Student Life": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = BLOG_POSTS.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      search === "" ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Study Abroad <span className="text-gray-900 dark:text-white">Blog</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Expert guides, visa tips, scholarship alerts, and everything you need to know about studying abroad from Bangladesh.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search articles (e.g., IELTS, Canada visa, scholarship)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-[#E0FE9C] focus:border-transparent outline-none"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {BLOG_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              activeCategory === cat
                ? "bg-[#E0FE9C] text-black"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      {(search || activeCategory !== "All") && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {filtered.length} {filtered.length === 1 ? "article" : "articles"} found
        </p>
      )}

      {/* Blog Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-none border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-[#E0FE9C] dark:hover:border-[#E0FE9C] hover:shadow-lg transition-all duration-300"
            >
              {/* Card Header - Category Color Bar */}
              <div className={cn("h-2", CATEGORY_COLORS[post.category]?.split(" ")[0] || "bg-blue-100")} />

              <div className="flex flex-col flex-1 p-6">
                {/* Category + Read Time */}
                <div className="flex items-center justify-between mb-3">
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", CATEGORY_COLORS[post.category] || "bg-gray-100 text-gray-600")}>
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-black dark:group-hover:text-[#E0FE9C] transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded">
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-400">
                    {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-black dark:text-[#E0FE9C] group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No articles found matching your search.</p>
          <button
            onClick={() => { setSearch(""); setActiveCategory("All"); }}
            className="mt-4 text-black dark:text-[#E0FE9C] hover:underline font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 text-center p-8 rounded-none bg-[#0a0a0a] text-white">
        <h2 className="text-2xl font-bold mb-3">Need Personalized Guidance?</h2>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          Our AI matches your profile with the best-fit programs. Get instant recommendations — for free.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/register" className="px-6 py-3 bg-[#E0FE9C] text-black font-semibold uppercase tracking-wide rounded-none hover:bg-[#CDEE78] transition-colors">
            Get AI Recommendations
          </Link>
          <Link href="/contact" className="px-6 py-3 border border-white/30 text-white font-semibold uppercase tracking-wide rounded-none hover:bg-white/10 transition-colors">
            Book Free Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
