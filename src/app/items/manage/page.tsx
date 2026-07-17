"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Eye,
  ChefHat,
  Clock,
  Star,
  AlertTriangle,
  X,
  BookOpen
} from "lucide-react";

interface Recipe {
  _id: string;
  title: string;
  shortDescription: string;
  cuisineType: string;
  dietType: "veg" | "non-veg" | "vegan";
  cookTime: number;
  difficulty: "easy" | "medium" | "hard";
  avgRating: number;
  totalReviews: number;
  images: string[];
  createdAt: string;
}

export default function ManageRecipesPage() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const [localRecipes, setLocalRecipes] = useState<Recipe[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load local sandbox recipes saved to localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("custom_recipes") || "[]");
      setLocalRecipes(stored);
    } catch {
      setLocalRecipes([]);
    }
  }, []);

  // Fetch user's recipes from backend
  const { data: apiRecipes = [], isLoading, refetch } = useQuery<Recipe[]>({
    queryKey: ["my-recipes"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${apiUrl}/recipes/user/mine`);
        return response.data?.data || response.data || [];
      } catch (err) {
        console.warn("Backend recipes unavailable, using localStorage fallback.", err);
        return [];
      }
    },
  });

  // Combine API recipes with local (localStorage) ones
  const allRecipes: Recipe[] = [...apiRecipes, ...localRecipes];

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      if (id.startsWith("custom-")) {
        // Delete from localStorage
        const updated = localRecipes.filter((r) => r._id !== id);
        localStorage.setItem("custom_recipes", JSON.stringify(updated));
        setLocalRecipes(updated);
      } else {
        await axios.delete(`${apiUrl}/recipes/${id}`);
        await refetch();
      }
    } catch (err) {
      console.error("Deletion failed:", err);
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  const deleteTarget = allRecipes.find((r) => r._id === deleteTargetId);

  const dietColors: Record<string, string> = {
    veg: "bg-green-100 text-green-700",
    "non-veg": "bg-red-100 text-red-700",
    vegan: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary">My Recipes</h1>
          <p className="text-sm text-text-brown/70">View, edit, or manage your contributed recipe creations.</p>
        </div>
        <Link
          href="/items/add"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-all hover:-translate-y-0.5 w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Recipe</span>
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-100 p-5 animate-pulse flex gap-4">
              <div className="w-24 h-20 bg-neutral-200 rounded-xl shrink-0" />
              <div className="flex-1 flex flex-col gap-2 justify-center">
                <div className="h-4 bg-neutral-200 rounded w-1/2" />
                <div className="h-3 bg-neutral-200 rounded w-3/4" />
                <div className="h-3 bg-neutral-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : allRecipes.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center gap-6 py-24 bg-white border border-neutral-200/50 rounded-2xl"
        >
          <div className="relative">
            <div className="h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-14 w-14 text-primary/60" />
            </div>
            <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
              <ChefHat className="h-4 w-4 text-accent" />
            </div>
          </div>
          <div className="text-center flex flex-col gap-2 max-w-xs">
            <h3 className="font-poppins font-extrabold text-xl text-secondary">No Recipes Yet</h3>
            <p className="text-sm text-text-brown/65 leading-relaxed">
              You haven't contributed any recipes. Start by adding your first culinary creation!
            </p>
          </div>
          <Link
            href="/items/add"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add My First Recipe</span>
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white border border-neutral-200/50 rounded-2xl shadow-xs overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60 text-left">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-brown/60">Recipe</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-brown/60">Cuisine</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-brown/60">Diet</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-brown/60">Cook Time</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-brown/60">Rating</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-brown/60">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {allRecipes.map((recipe) => (
                  <motion.tr
                    key={recipe._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={recipe.images?.[0] || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=200"}
                          alt={recipe.title}
                          className="w-14 h-12 object-cover rounded-xl shrink-0"
                        />
                        <div>
                          <p className="font-poppins font-bold text-secondary text-sm line-clamp-1">{recipe.title}</p>
                          <p className="text-text-brown/60 text-xs line-clamp-1 mt-0.5">{recipe.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-secondary bg-secondary/5 px-2.5 py-1 rounded-full">
                        {recipe.cuisineType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold capitalize px-2.5 py-1 rounded-full ${dietColors[recipe.dietType] || "bg-neutral-100 text-neutral-700"}`}>
                        {recipe.dietType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-text-brown/70 text-xs">
                        <Clock className="h-3.5 w-3.5 text-neutral-400" />
                        <span>{recipe.cookTime} min</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                        <span className="font-semibold text-text-brown">{recipe.avgRating}</span>
                        <span className="text-text-brown/50">({recipe.totalReviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/recipes/${recipe._id}`}
                          className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                          title="View recipe"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTargetId(recipe._id)}
                          className="p-2 text-red-500/70 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete recipe"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden flex flex-col gap-4">
            {allRecipes.map((recipe) => (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pantry-card flex gap-4 items-start"
              >
                <img
                  src={recipe.images?.[0] || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=200"}
                  alt={recipe.title}
                  className="w-20 h-18 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <h3 className="font-poppins font-bold text-sm text-secondary line-clamp-1">{recipe.title}</h3>
                  <p className="text-text-brown/60 text-xs line-clamp-2">{recipe.shortDescription}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-text-brown/60 flex-wrap">
                    <span>{recipe.cuisineType}</span>
                    <span>•</span>
                    <div className="flex items-center gap-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{recipe.cookTime}m</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      <span>{recipe.avgRating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Link
                      href={`/recipes/${recipe._id}`}
                      className="flex items-center gap-1 text-xs font-semibold text-secondary bg-secondary/5 px-3 py-1.5 rounded-lg"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Link>
                    <button
                      onClick={() => setDeleteTargetId(recipe._id)}
                      className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTargetId && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTargetId(null)}
              className="fixed inset-0 z-40 bg-black"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl w-full max-w-md pointer-events-auto flex flex-col gap-5">
                {/* Icon */}
                <div className="flex justify-between items-start">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                  <button
                    onClick={() => setDeleteTargetId(null)}
                    className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="font-poppins font-extrabold text-lg text-secondary">Delete Recipe?</h3>
                  <p className="text-sm text-text-brown/70 leading-relaxed">
                    Are you sure you want to delete{" "}
                    <strong className="text-secondary">"{deleteTarget?.title}"</strong>? This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setDeleteTargetId(null)}
                    className="rounded-xl border border-neutral-300 px-5 py-2.5 font-semibold text-text-brown hover:bg-neutral-50 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteTargetId!)}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all"
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
