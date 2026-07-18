"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Star, Clock, Heart } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { useWishlist } from "@/hooks/useWishlist";

export default function FeaturedRecipesSection() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const { isInWishlist, toggleWishlist } = useWishlist();

  const { data: recipes = [], isLoading } = useQuery<Recipe[]>({
    queryKey: ["recipes", "featured"],
    queryFn: async () => {
      const response = await axios.get(`${apiUrl}/recipes`);
      const payload = response.data?.data ?? response.data;
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.recipes)) return payload.recipes;
      return [];
    },
  });

  return (
    <section id="explore" className="py-20 bg-bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-poppins font-bold text-xs uppercase tracking-widest text-primary">Handpicked Favorites</span>
            <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary mt-1">Featured Recipes</h2>
          </div>
          <p className="text-text-brown/70 text-sm md:max-w-md">
            Check out these trending kitchen creations. Fresh, healthy, and easy-to-follow directions approved by top chefs.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 animate-pulse flex flex-col gap-4">
                <div className="w-full h-48 bg-neutral-200 rounded-xl" />
                <div className="h-4 bg-neutral-200 rounded w-2/3" />
                <div className="h-3 bg-neutral-200 rounded w-full" />
                <div className="h-3 bg-neutral-200 rounded w-5/6" />
                <div className="flex gap-2 mt-2">
                  <div className="h-5 bg-neutral-200 rounded w-16" />
                  <div className="h-5 bg-neutral-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <p className="text-center text-text-brown/60 text-sm py-12">
            No recipes found yet. Be the first to add one!
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {recipes.slice(0, 8).map((recipe) => (
              <article
                key={recipe._id}
                className="pantry-card group cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                  <img
                    src={recipe.images?.[0] || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600"}
                    alt={recipe.title}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                  />
                  {recipe.images?.[1] && (
                    <img
                      src={recipe.images[1]}
                      alt={`${recipe.title} alternate view`}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  )}
                  <div className="absolute top-2 left-2 flex gap-1.5 pointer-events-none">
                    <span className="bg-secondary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.75 rounded-md">
                      {recipe.cuisineType}
                    </span>
                    <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.75 rounded-md">
                      {recipe.dietType}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(recipe._id);
                    }}
                    aria-label="Toggle wishlist"
                    className="absolute top-2 right-2 h-8 w-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isInWishlist(recipe._id) ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="h-4 w-4 fill-accent shrink-0" />
                    <span className="text-xs font-semibold text-text-brown">{recipe.avgRating} ({recipe.totalReviews})</span>
                  </div>
                  <h3 className="font-poppins font-bold text-base text-secondary group-hover:text-primary transition-colors line-clamp-1">
                    {recipe.title}
                  </h3>
                  <p className="text-text-brown/70 text-xs line-clamp-2 leading-relaxed">
                    {recipe.shortDescription}
                  </p>
                </div>

                <div className="border-t border-neutral-100 mt-4 pt-3 flex items-center justify-between text-xs text-text-brown/65">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                    <span>{recipe.cookTime} min</span>
                  </div>
                  <span className="capitalize font-medium text-primary bg-primary/5 px-2.5 py-0.5 rounded-full">
                    {recipe.difficulty}
                  </span>
                </div>
              </article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}