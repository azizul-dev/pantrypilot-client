"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface CuisineStat {
  name: string;
  count: number;
}

const ICONS: Record<string, string> = {
  Italian: "🍝",
  Indian: "🍛",
  Mexican: "🌮",
  Mediterranean: "🥗",
  Asian: "🥢",
  French: "🥐",
  Baking: "🍰",
  BBQ: "🍖",
  British: "🥧",
  Korean: "🍜",
  Thai: "🌶️",
  American: "🍔",
};

export default function CategoriesSection() {
  const [cuisines, setCuisines] = useState<CuisineStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const res = await fetch(`${apiUrl}/stats`);
        const json = await res.json();
        if (res.ok && json?.data?.cuisineBreakdown) {
          setCuisines(json.data.cuisineBreakdown);
        }
      } catch (err) {
        console.error("Failed to fetch cuisine stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCuisines();
  }, []);

  if (!loading && cuisines.length === 0) return null;

  return (
    <section className="py-20 bg-bg-cream overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left flex flex-col gap-2">
          <span className="font-poppins font-bold text-xs uppercase tracking-widest text-primary">Browse Cuisines</span>
          <h2 className="font-poppins font-extrabold text-3xl text-secondary">Explore Culinary Categories</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x scroll-smooth">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-44 h-40 bg-white rounded-2xl border border-neutral-200/50 animate-pulse"
                />
              ))
            : cuisines.map((cat, idx) => (
                <Link key={idx} href={`/recipes?cuisine=${encodeURIComponent(cat.name)}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="flex-shrink-0 w-44 bg-white rounded-2xl p-5 shadow-sm border border-neutral-200/50 flex flex-col items-center gap-3 snap-start text-center cursor-pointer transition-all hover:shadow-md"
                  >
                    <span className="text-4xl">{ICONS[cat.name] || "🍽️"}</span>
                    <h3 className="font-poppins font-bold text-sm text-secondary">{cat.name}</h3>
                    <span className="text-xs text-text-brown/60 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                      {cat.count} recipe{cat.count !== 1 ? "s" : ""}
                    </span>
                  </motion.div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
