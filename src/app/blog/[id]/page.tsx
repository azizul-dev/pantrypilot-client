"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";

interface BlogAuthor {
  _id: string;
  name: string;
  avatar?: string;
}

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  readTime: string;
  createdAt: string;
  authorId: BlogAuthor | string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const response = await axios.get(`${apiUrl}/blogs/${params.id}`);
        setPost(response.data?.data?.post || null);
      } catch (err: any) {
        console.error("Failed to fetch blog post:", err);
        setErrorMsg(
          err?.response?.data?.message || "This post couldn't be found."
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchPost();
  }, [apiUrl, params.id]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const authorName = (a: BlogAuthor | string) =>
    typeof a === "string" ? "PantryPilot" : a?.name || "PantryPilot";

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 animate-pulse flex flex-col gap-6">
        <div className="h-4 bg-neutral-200 rounded w-1/4" />
        <div className="h-10 bg-neutral-200 rounded w-3/4" />
        <div className="w-full aspect-[16/9] bg-neutral-200 rounded-2xl" />
        <div className="h-4 bg-neutral-200 rounded w-full" />
        <div className="h-4 bg-neutral-200 rounded w-full" />
        <div className="h-4 bg-neutral-200 rounded w-2/3" />
      </div>
    );
  }

  if (errorMsg || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center flex flex-col items-center gap-4">
        <span className="text-5xl" role="img" aria-label="not found">🔍</span>
        <h1 className="font-poppins font-bold text-2xl text-secondary">Post Not Found</h1>
        <p className="text-sm text-text-brown/65">{errorMsg || "This post may have been removed."}</p>
        <Link href="/blog" className="text-primary font-semibold text-sm hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col gap-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      <div className="flex flex-col gap-4">
        <span className="bg-primary/10 text-primary w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {post.category}
        </span>
        <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl lg:text-5xl text-secondary leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-text-brown/60">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{authorName(post.authorId)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      <div className="prose prose-neutral max-w-none text-text-brown/85 leading-relaxed whitespace-pre-line text-base sm:text-lg">
        {post.content}
      </div>
    </div>
  );
}
