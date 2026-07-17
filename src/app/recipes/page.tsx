"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Clock,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw
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
}

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
  }
];

export default function ExploreRecipesPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Search, Filter, Sort and Paginate State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("All");
  const [selectedDiet, setSelectedDiet] = useState<string>("All");
  const [maxCookTime, setMaxCookTime] = useState<number>(60);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;

  // Debouncing Search Input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset page on search
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetching data
  const { data: recipes = FALLBACK_RECIPES, isLoading } = useQuery<Recipe[]>({
    queryKey: ["explore-recipes", debouncedSearch, selectedCuisine, selectedDiet, maxCookTime, sortBy],
    queryFn: async () => {
      try {
        const params: any = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (selectedCuisine !== "All") params.cuisineType = selectedCuisine;
        if (selectedDiet !== "All") params.dietType = selectedDiet;
        params.maxCookTime = maxCookTime;
        params.sort = sortBy;

        const response = await axios.get(`${apiUrl}/recipes`, { params });
        return response.data?.data || response.data || FALLBACK_RECIPES;
      } catch (err) {
        console.warn("Backend unavailable, filtering fallback recipes locally.", err);
        return FALLBACK_RECIPES;
      }
    },
  });

  // Client-side fallback filter logic (ensures excellent demo even if API lacks search/filter/sort)
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      recipe.shortDescription.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCuisine = selectedCuisine === "All" || recipe.cuisineType.toLowerCase() === selectedCuisine.toLowerCase();
    const matchesDiet = selectedDiet === "All" || recipe.dietType.toLowerCase() === selectedDiet.toLowerCase();
    const matchesCookTime = recipe.cookTime <= maxCookTime;

    return matchesSearch && matchesCuisine && matchesDiet && matchesCookTime;
  });

  // Sort logic
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === "rating") {
      return b.avgRating - a.avgRating;
    }
    if (sortBy === "cookTime") {
      return a.cookTime - b.cookTime;
    }
    // "newest" or default
    return b._id.localeCompare(a._id);
  });

  // Paginated recipes
  const paginatedRecipes = sortedRecipes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedRecipes.length / itemsPerPage);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCuisine("All");
    setSelectedDiet("All");
    setMaxCookTime(60);
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Card staggered animation settings
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary">Explore Recipes</h1>
        <p className="text-sm text-text-brown/70 max-w-xl">
          Search culinary databases, filter by dietary constraints or cuisine, and find the perfect meals for you.
        </p>
      </div>

      {/* Control Bar: Search & Toggle Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search recipes, tags, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-neutral-300 bg-white pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-xs"
          />
        </div>

        {/* Action controls */}
        <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-end">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all ${
              showFilters
                ? "bg-secondary text-white border-secondary"
                : "bg-white text-text-brown border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <SlidersHorizontal className="h-4.5 w-4.5" />
            <span>Filters</span>
          </button>

          <div className="relative w-44">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
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

      {/* Filters drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-bg-cream rounded-2xl p-6 border border-neutral-200/60 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xs">
              {/* Cuisine */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-brown/70">Cuisine Type</label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Italian", "Indian", "Mexican", "Mediterranean", "Asian", "French"].map((cuisine) => (
                    <button
                      key={cuisine}
                      onClick={() => {
                        setSelectedCuisine(cuisine);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedCuisine === cuisine
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-text-brown border-neutral-300 hover:bg-neutral-50"
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-brown/70">Dietary Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Veg", "Non-Veg", "Vegan"].map((diet) => (
                    <button
                      key={diet}
                      onClick={() => {
                        setSelectedDiet(diet);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedDiet === diet
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-text-brown border-neutral-300 hover:bg-neutral-50"
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cook time */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-text-brown/70">
                  <span>Max Cook Time</span>
                  <span className="text-primary font-bold">{maxCookTime} mins</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={maxCookTime}
                  onChange={(e) => {
                    setMaxCookTime(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-primary h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer mt-2"
                />
                <div className="flex justify-between text-[10px] text-text-brown/50 mt-1">
                  <span>10 mins</span>
                  <span>120 mins</span>
                </div>
              </div>

              {/* Clear button */}
              <div className="md:col-span-3 flex justify-end">
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid view with loaders */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 animate-pulse flex flex-col gap-4">
              <div className="w-full h-48 bg-neutral-200 rounded-xl" />
              <div className="h-4 bg-neutral-200 rounded w-2/3" />
              <div className="h-3 bg-neutral-200 rounded w-full" />
              <div className="flex gap-2 mt-2">
                <div className="h-5 bg-neutral-200 rounded w-16" />
                <div className="h-5 bg-neutral-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : paginatedRecipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200/50 p-8 flex flex-col items-center gap-4">
          <span className="text-4xl">🔍</span>
          <h3 className="font-poppins font-bold text-lg text-secondary">No Recipes Found</h3>
          <p className="text-sm text-text-brown/65 max-w-sm">
            We couldn't find any recipes matching your search. Try resetting filters or testing different queries.
          </p>
          <button
            onClick={handleResetFilters}
            className="bg-primary hover:bg-primary/95 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {paginatedRecipes.map((recipe) => (
            <motion.div key={recipe._id} variants={itemVariants}>
              <Link href={`/recipes/${recipe._id}`}>
                <article className="pantry-card group cursor-pointer h-full flex flex-col justify-between">
                  <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                    <img
                      src={recipe.images?.[0] || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600"}
                      alt={recipe.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Fixed badges during hover */}
                    <div className="absolute top-2 left-2 flex gap-1.5 pointer-events-none">
                      <span className="bg-secondary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.75 rounded-md">
                        {recipe.cuisineType}
                      </span>
                      <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.75 rounded-md">
                        {recipe.dietType}
                      </span>
                    </div>
                  </div>

                  <div className="flex-grow flex flex-col gap-2">
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

                  <div className="border-t border-neutral-100 mt-4 pt-3 flex items-center justify-between text-xs text-text-brown/65 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-neutral-400" />
                      <span>{recipe.cookTime} min</span>
                    </div>
                    <span className="capitalize font-medium text-primary bg-primary/5 px-2.5 py-0.5 rounded-full">
                      {recipe.difficulty}
                    </span>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`h-10 w-10 rounded-xl text-sm font-semibold transition-all ${
                currentPage === i + 1
                  ? "bg-primary text-white"
                  : "bg-white text-text-brown border border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
