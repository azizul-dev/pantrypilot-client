"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Heart,
} from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";

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
}

interface PaginatedResponse {
  data: Recipe[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const LIMIT = 12;

const FALLBACK_RECIPES: Recipe[] = [
  {
    _id: "1",
    title: "Creamy Tuscan Garlic Chicken",
    shortDescription: "Tender chicken breasts simmered in a rich garlic, spinach, and sun-dried tomato cream sauce.",
    cuisineType: "Italian",
    dietType: "non-veg",
    cookTime: 30,
    difficulty: "easy",
    avgRating: 4.8,
    totalReviews: 124,
    images: ["https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600"],
  },
  {
    _id: "2",
    title: "Spiced Chickpea & Spinach Curry",
    shortDescription: "A flavorful, aromatic vegan curry packed with protein-rich chickpeas and fresh spinach.",
    cuisineType: "Indian",
    dietType: "vegan",
    cookTime: 25,
    difficulty: "easy",
    avgRating: 4.9,
    totalReviews: 89,
    images: ["https://images.unsplash.com/photo-1547825407-2d060104b7c8?auto=format&fit=crop&q=80&w=600"],
  },
  {
    _id: "3",
    title: "Classic Mexican Street Tacos",
    shortDescription: "Street-style corn tortillas topped with seasoned grilled steak, fresh onions, and cilantro.",
    cuisineType: "Mexican",
    dietType: "non-veg",
    cookTime: 20,
    difficulty: "medium",
    avgRating: 4.7,
    totalReviews: 156,
    images: ["https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=600"],
  },
  {
    _id: "4",
    title: "Mediterranean Quinoa Bowl",
    shortDescription: "A vibrant, healthy bowl loaded with cucumbers, olives, cherry tomatoes, and grilled feta cheese.",
    cuisineType: "Mediterranean",
    dietType: "veg",
    cookTime: 15,
    difficulty: "easy",
    avgRating: 4.6,
    totalReviews: 72,
    images: ["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600"],
  },
  {
    _id: "5",
    title: "Crispy Sesame Tofu Stir-Fry",
    shortDescription: "Golden tofu chunks tossed with fresh bell peppers and broccoli in a savory sweet sesame glaze.",
    cuisineType: "Asian",
    dietType: "vegan",
    cookTime: 20,
    difficulty: "medium",
    avgRating: 4.8,
    totalReviews: 64,
    images: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"],
  },
  {
    _id: "6",
    title: "French Onion Soup Gratinee",
    shortDescription: "Rich beef broth packed with caramelized onions and topped with toasted baguette and melted Gruyere.",
    cuisineType: "French",
    dietType: "non-veg",
    cookTime: 50,
    difficulty: "hard",
    avgRating: 4.9,
    totalReviews: 95,
    images: ["https://images.unsplash.com/photo-1547592165-e1d17f97a15a?auto=format&fit=crop&q=80&w=600"],
  },
  {
    _id: "7",
    title: "Hearty Lentil Shepherd's Pie",
    shortDescription: "Comforting classic featuring savory green lentils and veggies topped with fluffy mashed potatoes.",
    cuisineType: "British",
    dietType: "veg",
    cookTime: 45,
    difficulty: "medium",
    avgRating: 4.7,
    totalReviews: 83,
    images: ["https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600"],
  },
  {
    _id: "8",
    title: "Fresh Berry Summer Galette",
    shortDescription: "A rustic, buttery pastry folded over sweet and juicy strawberries, blueberries, and raspberries.",
    cuisineType: "Baking",
    dietType: "veg",
    cookTime: 40,
    difficulty: "medium",
    avgRating: 4.8,
    totalReviews: 110,
    images: ["https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&q=80&w=600"],
  },
  {
    _id: "9",
    title: "Korean Bulgogi BBQ Bowl",
    shortDescription: "Thinly sliced marinated beef grilled to perfection and served over steamed jasmine rice.",
    cuisineType: "Korean",
    dietType: "non-veg",
    cookTime: 35,
    difficulty: "medium",
    avgRating: 4.9,
    totalReviews: 132,
    images: ["https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600"],
  },
  {
    _id: "10",
    title: "Avocado & Black Bean Burritos",
    shortDescription: "Hearty burritos packed with creamy avocado, seasoned black beans, salsa, and fresh cilantro.",
    cuisineType: "Mexican",
    dietType: "vegan",
    cookTime: 18,
    difficulty: "easy",
    avgRating: 4.6,
    totalReviews: 77,
    images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600"],
  },
  {
    _id: "11",
    title: "Thai Green Papaya Salad",
    shortDescription: "A refreshing, crunchy salad with shredded green papaya, lime dressing, peanuts, and chili.",
    cuisineType: "Thai",
    dietType: "vegan",
    cookTime: 12,
    difficulty: "easy",
    avgRating: 4.5,
    totalReviews: 51,
    images: ["https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600"],
  },
  {
    _id: "12",
    title: "Classic Eggs Benedict",
    shortDescription: "Perfectly poached eggs on toasted English muffins with Canadian bacon and hollandaise sauce.",
    cuisineType: "American",
    dietType: "non-veg",
    cookTime: 22,
    difficulty: "hard",
    avgRating: 4.7,
    totalReviews: 98,
    images: ["https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&q=80&w=600"],
  },
];

/** Build a page range array with ellipsis */
function buildPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "...")[] = [];
  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", total);
  } else if (current >= total - 3) {
    pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }
  return pages;
}

export default function ExploreRecipesPage() {
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  // Ref for smooth scroll target
  const gridRef = useRef<HTMLDivElement>(null);
  const { isInWishlist, toggleWishlist } = useWishlist();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedDiet, setSelectedDiet] = useState("All");
  const [maxCookTime, setMaxCookTime] = useState(120);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch from backend with page + limit
  const { data, isLoading, isFetching } = useQuery<PaginatedResponse>({
    queryKey: ["explore-recipes", debouncedSearch, selectedCuisine, selectedDiet, maxCookTime, sortBy, currentPage],
    queryFn: async () => {
      try {
        const params: Record<string, string | number> = {
          page: currentPage,
          limit: LIMIT,
          sort: sortBy,
        };
        if (debouncedSearch) params.search = debouncedSearch;
        if (selectedCuisine !== "All") params.cuisineType = selectedCuisine;
        if (selectedDiet !== "All") params.dietType = selectedDiet.toLowerCase().replace("-", "-");
        if (maxCookTime < 120) params.maxCookTime = maxCookTime;

        const response = await axios.get(`${apiUrl}/recipes`, { params });
        const raw = response.data;

        // Normalize various API response shapes
        if (raw?.data?.recipes) {
          // Backend structure: { success: true, data: { recipes: [], total: 28, totalPages: 3 } }
          return {
            data: raw.data.recipes,
            total: raw.data.total,
            page: raw.data.page,
            limit: LIMIT,
            totalPages: raw.data.totalPages,
          };
        }
        if (raw?.data && raw?.totalPages !== undefined) return raw as PaginatedResponse;
        if (Array.isArray(raw?.data)) {
          return {
            data: raw.data,
            total: raw.total || raw.data.length,
            page: currentPage,
            limit: LIMIT,
            totalPages: Math.ceil((raw.total || raw.data.length) / LIMIT),
          };
        }
        throw new Error("Unexpected response shape");
      } catch {
        // Client-side fallback: filter & paginate the fallback data set
        let filtered = FALLBACK_RECIPES.filter((r) => {
          const matchSearch =
            !debouncedSearch ||
            r.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            r.shortDescription.toLowerCase().includes(debouncedSearch.toLowerCase());
          const matchCuisine = selectedCuisine === "All" || r.cuisineType.toLowerCase() === selectedCuisine.toLowerCase();
          const matchDiet = selectedDiet === "All" || r.dietType.toLowerCase() === selectedDiet.toLowerCase();
          const matchTime = r.cookTime <= maxCookTime;
          return matchSearch && matchCuisine && matchDiet && matchTime;
        });

        filtered = [...filtered].sort((a, b) => {
          if (sortBy === "rating") return b.avgRating - a.avgRating;
          if (sortBy === "cookTime") return a.cookTime - b.cookTime;
          return b._id.localeCompare(a._id);
        });

        const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT));
        const safePage = Math.min(currentPage, totalPages);
        const start = (safePage - 1) * LIMIT;
        return {
          data: filtered.slice(start, start + LIMIT),
          total: filtered.length,
          page: safePage,
          limit: LIMIT,
          totalPages,
        };
      }
    },
    placeholderData: keepPreviousData,
  });

  const recipes = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const isGridBusy = isLoading || isFetching;

  const pageRange = buildPageRange(currentPage, totalPages);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page === currentPage) return;
      setCurrentPage(page);
      // Smooth-scroll to grid top
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [currentPage]
  );

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCuisine("All");
    setSelectedDiet("All");
    setMaxCookTime(120);
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Framer-motion variants
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  // Pagination button variants
  const pageBtnVariants = {
    rest: { scale: 1, opacity: 1 },
    hover: { scale: 1.08, opacity: 1 },
    tap: { scale: 0.93 },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary">Explore Recipes</h1>
        <p className="text-sm text-text-brown/70 max-w-xl">
          Search culinary databases, filter by dietary constraints or cuisine, and find the perfect meal.
        </p>
      </div>

      {/* Search + Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search recipes, cuisines, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search recipes"
            className="w-full rounded-2xl border border-neutral-300 bg-white pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-xs"
          />
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-label="Toggle filters"
            className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none ${
              showFilters
                ? "bg-secondary text-white border-secondary"
                : "bg-white text-text-brown border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <div className="relative min-w-[140px]">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              aria-label="Sort recipes"
              className="w-full appearance-none rounded-2xl border border-neutral-300 bg-white px-4 py-3.5 pr-10 text-sm font-semibold text-text-brown focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-xs cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="rating">Top Rated</option>
              <option value="cookTime">Cook Time</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Collapsible Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-bg-cream rounded-2xl p-5 sm:p-6 border border-neutral-200/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 shadow-xs">
              {/* Cuisine filter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-brown/70">Cuisine</label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Italian", "Indian", "Mexican", "Mediterranean", "Asian", "French", "Korean", "Thai"].map((c) => (
                    <button
                      key={c}
                      onClick={() => { setSelectedCuisine(c); setCurrentPage(1); }}
                      aria-pressed={selectedCuisine === c}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none ${
                        selectedCuisine === c
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-text-brown border-neutral-300 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet filter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-brown/70">Diet</label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Veg", "Non-Veg", "Vegan"].map((d) => (
                    <button
                      key={d}
                      onClick={() => { setSelectedDiet(d); setCurrentPage(1); }}
                      aria-pressed={selectedDiet === d}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none ${
                        selectedDiet === d
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-text-brown border-neutral-300 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cook time range */}
              <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-brown/70">Max Cook Time</label>
                  <span className="text-xs font-bold text-primary tabular-nums">
                    {maxCookTime >= 120 ? "Any" : `${maxCookTime} min`}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={maxCookTime}
                  aria-label="Maximum cook time filter"
                  onChange={(e) => { setMaxCookTime(Number(e.target.value)); setCurrentPage(1); }}
                  className="w-full accent-primary h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-text-brown/45">
                  <span>10 min</span>
                  <span>120+ min</span>
                </div>
              </div>

              {/* Reset */}
              <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/75 transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none rounded px-1"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      {!isGridBusy && data && (
        <p className="text-xs text-text-brown/55 font-medium -mt-2">
          {data.total === 0
            ? "No recipes found."
            : `Showing ${(currentPage - 1) * LIMIT + 1}–${Math.min(currentPage * LIMIT, data.total)} of ${data.total} recipe${data.total !== 1 ? "s" : ""}`}
        </p>
      )}

      {/* Recipe Grid — scroll target */}
      <div ref={gridRef} className="scroll-mt-24">
        {/* Skeleton Loader */}
        {isGridBusy ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 animate-pulse flex flex-col gap-3">
                <div className="w-full aspect-[4/3] bg-neutral-200 rounded-xl" />
                <div className="h-3 bg-neutral-200 rounded w-1/3" />
                <div className="h-4 bg-neutral-200 rounded w-2/3" />
                <div className="h-3 bg-neutral-200 rounded w-full" />
                <div className="h-3 bg-neutral-200 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200/50 flex flex-col items-center gap-4">
            <span className="text-5xl" role="img" aria-label="searching">🔍</span>
            <h3 className="font-poppins font-bold text-lg text-secondary">No Recipes Found</h3>
            <p className="text-sm text-text-brown/65 max-w-sm">
              We couldn&apos;t find any recipes matching your criteria. Try resetting your filters or search query.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-primary hover:bg-primary/90 active:bg-primary text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div
            key={`page-${currentPage}-${debouncedSearch}-${selectedCuisine}-${selectedDiet}`}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {recipes.map((recipe) => (
              <motion.div key={recipe._id} variants={cardVariants}>
                <Link href={`/recipes/${recipe._id}`} className="block group h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl">
                  <article className="pantry-card h-full flex flex-col">
                    {/* Image */}
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 mb-4 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={recipe.images?.[0] || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600"}
                        alt={`Photo of ${recipe.title}`}
                        width={600}
                        height={450}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                      />
                      {recipe.images?.[1] && (
                        <img
                          src={recipe.images[1]}
                          alt={`${recipe.title} alternate view`}
                          width={600}
                          height={450}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />
                      )}
                      {/* Badges — fixed during hover */}
                      <div className="absolute top-2 left-2 flex gap-1.5 pointer-events-none">
                        <span className="bg-secondary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md leading-tight">
                          {recipe.cuisineType}
                        </span>
                        <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md leading-tight">
                          {recipe.dietType}
                        </span>
                      </div>
                      {/* Wishlist heart */}
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
                            isInWishlist(recipe._id)
                              ? "fill-red-500 text-red-500"
                              : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-grow flex flex-col gap-1.5">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent shrink-0" aria-hidden="true" />
                        <span className="text-xs font-semibold text-text-brown" aria-label={`Rating: ${recipe.avgRating} from ${recipe.totalReviews} reviews`}>
                          {recipe.avgRating} <span className="text-text-brown/50 font-normal">({recipe.totalReviews})</span>
                        </span>
                      </div>
                      <h2 className="font-poppins font-bold text-sm sm:text-base text-secondary group-hover:text-primary transition-colors line-clamp-1">
                        {recipe.title}
                      </h2>
                      <p className="text-text-brown/70 text-xs line-clamp-2 leading-relaxed">
                        {recipe.shortDescription}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-neutral-100 mt-4 pt-3 flex items-center justify-between text-xs text-text-brown/60 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
                        <span>{recipe.cookTime} min</span>
                      </div>
                      <span className="capitalize font-semibold text-primary bg-primary/8 px-2.5 py-0.5 rounded-full text-[11px]">
                        {recipe.difficulty}
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ───── Pagination ───── */}
      {!isGridBusy && totalPages > 1 && (
        <nav aria-label="Recipe page navigation" className="flex flex-col items-center gap-4 pt-4">

          {/* Mobile: Prev / Page X of Y / Next */}
          <div className="flex sm:hidden items-center gap-3">
            <motion.button
              variants={pageBtnVariants}
              initial="rest"
              whileHover={currentPage === 1 ? "rest" : "hover"}
              whileTap={currentPage === 1 ? "rest" : "tap"}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm font-semibold text-text-brown disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </motion.button>

            <span className="text-sm font-semibold text-text-brown/70 tabular-nums whitespace-nowrap">
              Page <strong className="text-secondary">{currentPage}</strong> of <strong className="text-secondary">{totalPages}</strong>
            </span>

            <motion.button
              variants={pageBtnVariants}
              initial="rest"
              whileHover={currentPage === totalPages ? "rest" : "hover"}
              whileTap={currentPage === totalPages ? "rest" : "tap"}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm font-semibold text-text-brown disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Desktop: full numbered pagination */}
          <div className="hidden sm:flex items-center gap-2 flex-wrap justify-center">
            {/* Previous */}
            <motion.button
              variants={pageBtnVariants}
              initial="rest"
              whileHover={currentPage === 1 ? "rest" : "hover"}
              whileTap={currentPage === 1 ? "rest" : "tap"}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-neutral-200 text-text-brown disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </motion.button>

            {/* Numbered pages */}
            {pageRange.map((item, idx) =>
              item === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-10 w-10 items-center justify-center text-sm text-text-brown/40 select-none"
                  aria-hidden="true"
                >
                  …
                </span>
              ) : (
                <motion.button
                  key={item}
                  variants={pageBtnVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handlePageChange(item as number)}
                  aria-label={`Page ${item}`}
                  aria-current={currentPage === item ? "page" : undefined}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none ${
                    currentPage === item
                      ? "bg-primary text-white shadow-sm shadow-primary/20"
                      : "bg-white border border-neutral-200 text-text-brown hover:border-primary hover:text-primary"
                  }`}
                >
                  {item}
                </motion.button>
              )
            )}

            {/* Next */}
            <motion.button
              variants={pageBtnVariants}
              initial="rest"
              whileHover={currentPage === totalPages ? "rest" : "hover"}
              whileTap={currentPage === totalPages ? "rest" : "tap"}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-neutral-200 text-text-brown disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </motion.button>
          </div>
        </nav>
      )}
    </div>
  );
}
