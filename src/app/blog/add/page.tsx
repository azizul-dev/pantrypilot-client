"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { PenSquare, Loader2 } from "lucide-react";

export default function AddBlogPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content || !category || !image) {
      setErrorMsg("Please fill out all required fields marked with *.");
      return;
    }
    if (!isAuthenticated || !token) {
      setErrorMsg("Please log in before writing a post.");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const response = await axios.post(
        `${apiUrl}/blogs`,
        { title, excerpt, content, category, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newId = response.data?.data?.post?._id;
      router.push(newId ? `/blog/${newId}` : "/blog");
      router.refresh();
    } catch (err: any) {
      console.error("Failed to create blog post:", err);
      setErrorMsg(
        err?.response?.data?.message || "Failed to publish post. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary flex items-center gap-2">
          <PenSquare className="h-8 w-8 text-primary" />
          <span>Write a Blog Post</span>
        </h1>
        <p className="text-sm text-text-brown/70">
          Share a cooking tip, story, or guide with the PantryPilot community.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white rounded-2xl p-6 sm:p-8 border border-neutral-100 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-text-brown/70">
            Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 10 Essential Knife Skills Every Home Cook Needs"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-text-brown/70">
            Excerpt *
          </label>
          <textarea
            required
            rows={2}
            maxLength={250}
            placeholder="A short one or two sentence summary shown on the blog list..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <span className="text-[11px] text-text-brown/40 self-end">{excerpt.length}/250</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-text-brown/70">
            Content *
          </label>
          <textarea
            required
            rows={12}
            placeholder="Write the full article here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-brown/70">
              Category *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Techniques, Organization, Guides"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-brown/70">
              Cover Image URL *
            </label>
            <input
              type="url"
              required
              placeholder="e.g. https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="mt-2 flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-neutral-300 px-6 py-3 font-semibold text-text-brown hover:bg-neutral-50 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/95 text-white font-semibold px-8 py-3 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
