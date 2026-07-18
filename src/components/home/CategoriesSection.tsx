"use client";

import { motion } from "framer-motion";

const CATEGORIES = [
  { name: "Italian", icon: "🍝", count: 24 },
  { name: "Indian", icon: "🍛", count: 18 },
  { name: "Mexican", icon: "🌮", count: 15 },
  { name: "Mediterranean", icon: "🥗", count: 21 },
  { name: "Asian", icon: "🥢", count: 32 },
  { name: "French", icon: "🥐", count: 12 },
  { name: "Baking", icon: "🍰", count: 16 },
  { name: "BBQ", icon: "🍖", count: 9 },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-bg-cream overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left flex flex-col gap-2">
          <span className="font-poppins font-bold text-xs uppercase tracking-widest text-primary">Browse Cuisines</span>
          <h2 className="font-poppins font-extrabold text-3xl text-secondary">Explore Culinary Categories</h2>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x scroll-smooth">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="flex-shrink-0 w-44 bg-white rounded-2xl p-5 shadow-sm border border-neutral-200/50 flex flex-col items-center gap-3 snap-start text-center cursor-pointer transition-all hover:shadow-md"
            >
              <span className="text-4xl">{cat.icon}</span>
              <h3 className="font-poppins font-bold text-sm text-secondary">{cat.name}</h3>
              <span className="text-xs text-text-brown/60 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                {cat.count} recipes
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}