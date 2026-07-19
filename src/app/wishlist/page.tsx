"use client";

import Link from "next/link";
import { Star, Clock, Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";

export default function WishlistPage() {
  const { wishlist, isLoading, toggleWishlist, isAuthenticated } = useWishlist();
  const { login } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center flex flex-col items-center gap-4">
        <Heart className="h-10 w-10 text-neutral-300" />
        <h2 className="font-poppins font-extrabold text-2xl text-secondary">
          Please Log In
        </h2>
        <p className="text-sm text-text-brown/70 max-w-md">
          Log in to view and manage your saved recipes.
        </p>
        <button
          onClick={login}
          className="bg-primary hover:bg-primary/95 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary">
          My Wishlist
        </h1>
        <p className="text-sm text-text-brown/70">
          Recipes you have saved for later.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 animate-pulse flex flex-col gap-3"
            >
              <div className="w-full aspect-[4/3] bg-neutral-200 rounded-xl" />
              <div className="h-4 bg-neutral-200 rounded w-2/3" />
              <div className="h-3 bg-neutral-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200/50 flex flex-col items-center gap-4">
          <Heart className="h-10 w-10 text-neutral-300" />
          <h3 className="font-poppins font-bold text-lg text-secondary">
            Your Wishlist is Empty
          </h3>
          <p className="text-sm text-text-brown/65 max-w-sm">
            Browse recipes and tap the heart icon to save your favorites here.
          </p>
          <Link
            href="/recipes"
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
          >
            Explore Recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((recipe) => (
            <Link
              key={recipe._id}
              href={`/recipes/${recipe._id}`}
              className="block group h-full"
            >
              <article className="pantry-card h-full flex flex-col">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 mb-4 shrink-0">
                  <img
                    src={
                      recipe.images?.[0] ||
                      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600"
                    }
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(recipe._id);
                    }}
                    aria-label="Remove from wishlist"
                    className="absolute top-2 right-2 h-8 w-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center text-red-500"
                  >
                    <Heart className="h-4 w-4 fill-red-500" />
                  </button>
                </div>
                <div className="flex-grow flex flex-col gap-1.5">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="text-xs font-semibold text-text-brown">
                      {recipe.avgRating} ({recipe.totalReviews})
                    </span>
                  </div>
                  <h2 className="font-poppins font-bold text-sm sm:text-base text-secondary group-hover:text-primary transition-colors line-clamp-1">
                    {recipe.title}
                  </h2>
                  <p className="text-text-brown/70 text-xs line-clamp-2 leading-relaxed">
                    {recipe.shortDescription}
                  </p>
                </div>
                <div className="border-t border-neutral-100 mt-4 pt-3 flex items-center justify-between text-xs text-text-brown/60 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                    <span>{recipe.cookTime} min</span>
                  </div>
                  <span className="capitalize font-semibold text-primary bg-primary/8 px-2.5 py-0.5 rounded-full text-[11px]">
                    {recipe.difficulty}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
