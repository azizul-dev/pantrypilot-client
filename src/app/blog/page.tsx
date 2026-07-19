"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, PenSquare, Loader2, Search } from "lucide-react";

interface BlogAuthor {
  _id: string;
  name: string;
  avatar?: string;
}

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
  createdAt: string;
  authorId: BlogAuthor | string;
}

const LIMIT = 9;

export default function BlogPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchPosts = useCallback(
    async (pageToFetch: number, append: boolean, search: string) => {
      if (append) setIsLoadingMore(true);
      else setIsLoading(true);
      setErrorMsg("");
      try {
        const params: Record<string, string | number> = {
          page: pageToFetch,
          limit: LIMIT,
        };
        if (search) params.search = search;

        const response = await axios.get(`${apiUrl}/blogs`, { params });
        const data = response.data?.data;
        if (!data) throw new Error("Unexpected response shape");
        setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
        setPage(pageToFetch);
      } catch (err) {
        console.error("Failed to fetch blog posts:", err);
        setErrorMsg("Couldn't load blog posts right now. Please try again shortly.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [apiUrl]
  );

  // Refetch from page 1 whenever the debounced search term changes
  useEffect(() => {
    fetchPosts(1, false, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleLoadMore = () => {
    if (page < totalPages) fetchPosts(page + 1, true, debouncedSearch);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const authorName = (a: BlogAuthor | string) =>
    typeof a === "string" ? "PantryPilot" : a?.name || "PantryPilot";

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Only show the big "Featured" hero when not actively searching
  const isSearching = debouncedSearch.trim().length > 0;
  const showFeaturedHero = !isSearching && posts.length > 1;
  const [featured, ...rest] = posts;
  const gridPosts = showFeaturedHero ? rest : posts;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col gap-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="text-center sm:text-left max-w-2xl flex flex-col gap-4">
          <h1 className="font-poppins font-extrabold text-4xl sm:text-5xl text-secondary">
            Cooking Tips & Stories
          </h1>
          <p className="text-text-brown/70 text-lg">
            Enhance your culinary skills with expert guides, organizing tips, and stories from our kitchen.
          </p>
        </div>
        <Link
          href="/blog/add"
          className="shrink-0 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-sm"
        >
          <PenSquare className="h-4 w-4" />
          Write a Post
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search posts by title, topic, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search blog posts"
          className="w-full rounded-2xl border border-neutral-300 bg-white pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-xs"
        />
      </div>

      {!isLoading && !errorMsg && isSearching && (
        <p className="text-xs text-text-brown/55 font-medium -mt-6">
          {total === 0
            ? `No posts found for "${debouncedSearch}".`
            : `Found ${total} post${total !== 1 ? "s" : ""} for "${debouncedSearch}"`}
        </p>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="pantry-card animate-pulse flex flex-col gap-3">
              <div className="w-full aspect-[4/3] bg-neutral-200 rounded-xl" />
              <div className="h-3 bg-neutral-200 rounded w-1/3" />
              <div className="h-4 bg-neutral-200 rounded w-2/3" />
              <div className="h-3 bg-neutral-200 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && errorMsg && (
        <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200/50 flex flex-col items-center gap-3">
          <p className="text-sm text-text-brown/70">{errorMsg}</p>
          <button
            onClick={() => fetchPosts(1, false, debouncedSearch)}
            className="text-primary font-semibold text-sm hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !errorMsg && posts.length === 0 && !isSearching && (
        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200/50 flex flex-col items-center gap-4">
          <span className="text-5xl" role="img" aria-label="empty">📝</span>
          <h3 className="font-poppins font-bold text-lg text-secondary">No Posts Yet</h3>
          <p className="text-sm text-text-brown/65 max-w-sm">
            Be the first to share a cooking tip or story with the community.
          </p>
          <Link
            href="/blog/add"
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
          >
            Write a Post
          </Link>
        </div>
      )}

      {!isLoading && !errorMsg && posts.length === 0 && isSearching && (
        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200/50 flex flex-col items-center gap-4">
          <span className="text-5xl" role="img" aria-label="searching">🔍</span>
          <h3 className="font-poppins font-bold text-lg text-secondary">No Matching Posts</h3>
          <p className="text-sm text-text-brown/65 max-w-sm">
            Try a different search term.
          </p>
        </div>
      )}

      {!isLoading && showFeaturedHero && featured && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href={`/blog/${featured._id}`}>
            <div
              className="relative rounded-3xl overflow-hidden bg-secondary text-white group cursor-pointer shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
              tabIndex={0}
            >
              <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/50 to-transparent"></div>
              </div>
              <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col justify-end min-h-[400px] lg:min-h-[500px]">
                <div className="flex gap-2 mb-4">
                  <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {featured.category}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                    Featured
                  </span>
                </div>
                <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-4 max-w-3xl">
                  {featured.title}
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mb-6 line-clamp-2">
                  {featured.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{authorName(featured.authorId)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(featured.createdAt)}</span>
                  </div>
                  <div className="hidden sm:block h-1 w-1 rounded-full bg-white/30"></div>
                  <span>{featured.readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {!isLoading && gridPosts.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {gridPosts.map((post) => (
            <motion.article
              key={post._id}
              variants={item}
              className="pantry-card group cursor-pointer flex flex-col h-full focus-within:ring-4 focus-within:ring-primary/50"
            >
              <Link href={`/blog/${post._id}`} className="flex flex-col h-full focus:outline-none">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 shrink-0 bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-secondary px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-text-brown/50 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(post.createdAt)}
                    </span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-poppins font-bold text-xl text-secondary mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-text-brown/70 text-sm line-clamp-3 mb-6 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-2 border-t border-neutral-100 pt-4 mt-auto mb-3">
                    <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs">
                      {authorName(post.authorId).charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-text-brown/80">
                      {authorName(post.authorId)}
                    </span>
                  </div>
                  <span className="inline-flex items-center justify-center w-full gap-1.5 bg-primary/10 group-hover:bg-primary group-hover:text-white text-primary font-semibold text-xs py-2 rounded-xl transition-colors">
                    View Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      )}

      {!isLoading && page < totalPages && (
        <div className="flex justify-center pt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="rounded-xl border border-neutral-300 bg-white px-8 py-3 text-sm font-semibold text-text-brown hover:bg-neutral-50 hover:border-primary hover:text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoadingMore ? "Loading..." : "Load More Articles"}
          </button>
        </div>
      )}
    </div>
  );
}
