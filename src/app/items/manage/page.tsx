"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  Plus,
  Trash2,
  Eye,
  ChefHat,
  Clock,
  Star,
  AlertTriangle,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
  TrendingUp,
  Sparkles,
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

interface PaginatedResponse {
  recipes: Recipe[];
  total: number;
  page: number;
  totalPages: number;
}

const LIMIT = 8;

function buildPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  if (current <= 4) pages.push(1, 2, 3, 4, 5, "...", total);
  else if (current >= total - 3)
    pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  else pages.push(1, "...", current - 1, current, current + 1, "...", total);
  return pages;
}

const dietColors: Record<string, string> = {
  veg: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15",
  "non-veg": "bg-rose-50 text-rose-700 ring-1 ring-rose-600/15",
  vegan: "bg-teal-50 text-teal-700 ring-1 ring-teal-600/15",
};

const difficultyColors: Record<string, string> = {
  easy: "text-emerald-600 bg-emerald-50",
  medium: "text-amber-600 bg-amber-50",
  hard: "text-rose-600 bg-rose-50",
};

export default function ManageRecipesPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, isFetching, refetch } = useQuery<PaginatedResponse>({
    queryKey: ["my-recipes", token, currentPage],
    queryFn: async () => {
      if (!token) return { recipes: [], total: 0, page: 1, totalPages: 1 };
      const response = await axios.get(`${apiUrl}/recipes/user/mine`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: currentPage, limit: LIMIT },
      });
      const raw = response.data?.data;
      return {
        recipes: raw?.recipes || [],
        total: raw?.total || 0,
        page: raw?.page || currentPage,
        totalPages: raw?.totalPages || 1,
      };
    },
    enabled: !!token,
    placeholderData: keepPreviousData,
  });

  const allRecipes: Recipe[] = data?.recipes ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalRecipes = data?.total ?? 0;
  const isBusy = isLoading || isFetching;
  const pageRange = buildPageRange(currentPage, totalPages);

  const avgRating =
    allRecipes.length > 0
      ? (allRecipes.reduce((sum, r) => sum + (r.avgRating || 0), 0) / allRecipes.length).toFixed(1)
      : "—";

  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await axios.delete(`${apiUrl}/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await refetch();
    } catch (err) {
      console.error("Deletion failed:", err);
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  const deleteTarget = allRecipes.find((r) => r._id === deleteTargetId);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col gap-8">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Your Kitchen
          </span>
          <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary tracking-tight">
            My Recipes
          </h1>
          <p className="text-sm text-text-brown/65 max-w-md leading-relaxed">
            View, manage, and curate every recipe you've contributed to PantryPilot.
          </p>
        </div>
        <Link
          href="/items/add"
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-semibold px-6 py-3.5 rounded-2xl text-sm shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Recipe</span>
        </Link>
      </div>

      {/* ── Stats Strip ── */}
      {!isBusy && totalRecipes > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white border border-neutral-200/60 rounded-2xl p-4 sm:p-5 flex items-center gap-3 shadow-xs">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-text-brown/55 font-medium uppercase tracking-wide">Recipes</p>
              <p className="font-poppins font-extrabold text-lg sm:text-2xl text-secondary tabular-nums">{totalRecipes}</p>
            </div>
          </div>
          <div className="bg-white border border-neutral-200/60 rounded-2xl p-4 sm:p-5 flex items-center gap-3 shadow-xs">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
              <Star className="h-5 w-5 fill-accent text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-text-brown/55 font-medium uppercase tracking-wide">Avg Rating</p>
              <p className="font-poppins font-extrabold text-lg sm:text-2xl text-secondary tabular-nums">{avgRating}</p>
            </div>
          </div>
          <div className="bg-white border border-neutral-200/60 rounded-2xl p-4 sm:p-5 flex items-center gap-3 shadow-xs">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-secondary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-text-brown/55 font-medium uppercase tracking-wide">Page</p>
              <p className="font-poppins font-extrabold text-lg sm:text-2xl text-secondary tabular-nums">{currentPage}/{totalPages}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Loading Skeleton ── */}
      {isBusy ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-100 p-5 animate-pulse flex gap-4">
              <div className="w-20 h-16 sm:w-24 sm:h-20 bg-neutral-200 rounded-xl shrink-0" />
              <div className="flex-1 flex flex-col gap-2 justify-center">
                <div className="h-4 bg-neutral-200 rounded w-1/2" />
                <div className="h-3 bg-neutral-200 rounded w-3/4" />
                <div className="h-3 bg-neutral-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : allRecipes.length === 0 ? (
        /* ── Empty State ── */
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center gap-6 py-20 sm:py-28 bg-white border border-neutral-200/60 rounded-3xl shadow-xs"
        >
          <div className="relative">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <BookOpen className="h-12 w-12 sm:h-14 sm:w-14 text-primary/50" />
            </div>
            <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
              <ChefHat className="h-4 w-4 text-accent" />
            </div>
          </div>
          <div className="text-center flex flex-col gap-2 max-w-xs px-4">
            <h3 className="font-poppins font-extrabold text-xl text-secondary">No Recipes Yet</h3>
            <p className="text-sm text-text-brown/60 leading-relaxed">
              You have not contributed any recipes. Start by adding your first culinary creation!
            </p>
          </div>
          <Link
            href="/items/add"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            <span>Add My First Recipe</span>
          </Link>
        </motion.div>
      ) : (
        <>
          {/* ── Desktop Table ── */}
          <div className="hidden md:block bg-white border border-neutral-200/60 rounded-3xl shadow-sm shadow-neutral-200/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-bg-cream/60 text-left">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-brown/50">Recipe</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-brown/50">Cuisine</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-brown/50">Diet</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-brown/50">Cook Time</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-brown/50">Rating</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-brown/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                <AnimatePresence mode="popLayout">
                  {allRecipes.map((recipe) => (
                    <motion.tr
                      key={recipe._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-bg-cream/40 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-16 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm ring-1 ring-neutral-100">
                            <img
                              src={recipe.images?.[0] || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=200"}
                              alt={recipe.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-poppins font-bold text-secondary text-sm line-clamp-1">{recipe.title}</p>
                            <p className="text-text-brown/55 text-xs line-clamp-1 mt-0.5 max-w-xs">{recipe.shortDescription}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-secondary bg-secondary/5 px-3 py-1 rounded-full">
                          {recipe.cuisineType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold capitalize px-3 py-1 rounded-full ${dietColors[recipe.dietType] || "bg-neutral-100 text-neutral-700"}`}>
                          {recipe.dietType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-text-brown/70 text-xs font-medium">
                          <Clock className="h-3.5 w-3.5 text-neutral-400" />
                          <span>{recipe.cookTime} min</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                          <span className="font-bold text-text-brown">{recipe.avgRating || 0}</span>
                          <span className="text-text-brown/45">({recipe.totalReviews || 0})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 justify-end">
                          <Link
                            href={`/recipes/${recipe._id}`}
                            className="p-2.5 text-secondary hover:bg-secondary/10 rounded-xl transition-colors"
                            title="View recipe"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteTargetId(recipe._id)}
                            className="p-2.5 text-red-500/70 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                            title="Delete recipe"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* ── Mobile Card List ── */}
          <div className="md:hidden flex flex-col gap-3.5">
            <AnimatePresence mode="popLayout">
              {allRecipes.map((recipe) => (
                <motion.div
                  key={recipe._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-neutral-200/60 rounded-2xl p-4 shadow-xs flex gap-3.5 items-start"
                >
                  <div className="relative w-20 h-18 rounded-xl overflow-hidden shrink-0 shadow-sm">
                    <img
                      src={recipe.images?.[0] || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=200"}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <h3 className="font-poppins font-bold text-sm text-secondary line-clamp-1">{recipe.title}</h3>
                    <p className="text-text-brown/60 text-xs line-clamp-2 leading-relaxed">{recipe.shortDescription}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-text-brown/55 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${dietColors[recipe.dietType] || ""}`}>
                        {recipe.dietType}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" />
                        {recipe.cookTime}m
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        {recipe.avgRating || 0}
                      </span>
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
            </AnimatePresence>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <nav aria-label="My recipes page navigation" className="flex flex-col items-center gap-4 pt-2">
              <div className="flex sm:hidden items-center gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm font-semibold text-text-brown disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <span className="text-sm font-semibold text-text-brown/70 tabular-nums whitespace-nowrap">
                  Page <strong className="text-secondary">{currentPage}</strong> of <strong className="text-secondary">{totalPages}</strong>
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm font-semibold text-text-brown disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-neutral-200 text-text-brown disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors shadow-xs"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>

                {pageRange.map((item, idx) =>
                  item === "..." ? (
                    <span key={`ellipsis-${idx}`} className="flex h-10 w-10 items-center justify-center text-sm text-text-brown/40">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => handlePageChange(item as number)}
                      aria-current={currentPage === item ? "page" : undefined}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                        currentPage === item
                          ? "bg-primary text-white shadow-md shadow-primary/25 scale-105"
                          : "bg-white border border-neutral-200 text-text-brown hover:border-primary hover:text-primary shadow-xs"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-neutral-200 text-text-brown disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors shadow-xs"
                >
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </nav>
          )}
        </>
      )}

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteTargetId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTargetId(null)}
              className="fixed inset-0 z-40 bg-black backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-md pointer-events-auto flex flex-col gap-5">
                <div className="flex justify-between items-start">
                  <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                  <button
                    onClick={() => setDeleteTargetId(null)}
                    className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="font-poppins font-extrabold text-lg text-secondary">Delete Recipe?</h3>
                  <p className="text-sm text-text-brown/65 leading-relaxed">
                    Are you sure you want to delete{" "}
                    <strong className="text-secondary">{deleteTarget?.title}</strong>? This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-3 justify-end pt-1">
                  <button
                    onClick={() => setDeleteTargetId(null)}
                    className="rounded-xl border border-neutral-300 px-5 py-2.5 font-semibold text-text-brown hover:bg-neutral-50 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteTargetId!)}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all shadow-md shadow-red-500/20 disabled:opacity-60"
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