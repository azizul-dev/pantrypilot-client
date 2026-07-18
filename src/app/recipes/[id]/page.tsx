"use client";

import { useState, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Star,
  ChevronRight,
  ChevronDown,
  Check,
  ChefHat,
  ArrowLeft,
  Flame,
  UtensilsCrossed,
  User,
  Heart,
  Calendar,
  Sparkles,
} from "lucide-react";

// Detailed Recipe Type matching Schema
interface DetailedRecipe {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  ingredients: { name: string; quantity: string }[];
  steps: string[];
  cuisineType: string;
  dietType: "veg" | "non-veg" | "vegan";
  cookTime: number;
  difficulty: "easy" | "medium" | "hard";
  images: string[];
  avgRating: number;
  totalReviews: number;
  createdAt: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

const FALLBACK_DETAILED_RECIPES: Record<string, DetailedRecipe> = {
  "1": {
    _id: "1",
    title: "Creamy Tuscan Garlic Chicken",
    shortDescription:
      "Tender chicken breasts simmered in a rich garlic, spinach, and sun-dried tomato cream sauce.",
    fullDescription:
      "Creamy Tuscan Garlic Chicken is the ultimate restaurant-quality dinner you can make at home in under 30 minutes. Juicy pan-seared chicken breasts are bathed in a luxurious sauce of garlic, chicken broth, heavy cream, sun-dried tomatoes, and fresh baby spinach. Serve it over pasta, rice, or alongside roasted vegetables for a meal your family will beg for.",
    ingredients: [
      { name: "Chicken Breasts", quantity: "2 large pieces" },
      { name: "Olive Oil", quantity: "2 tbsp" },
      { name: "Garlic", quantity: "4 cloves, minced" },
      { name: "Sun-dried Tomatoes", quantity: "1/2 cup, drained & chopped" },
      { name: "Fresh Spinach", quantity: "2 cups, packed" },
      { name: "Heavy Cream", quantity: "1 cup" },
      { name: "Chicken Broth", quantity: "1/2 cup" },
      { name: "Parmesan Cheese", quantity: "1/2 cup, grated" },
      { name: "Italian Seasoning", quantity: "1 tsp" },
    ],
    steps: [
      "Season chicken breasts with Italian seasoning, salt, and pepper on both sides.",
      "Heat olive oil in a large skillet over medium-high heat. Add chicken and cook for 5-6 minutes per side, until golden brown and cooked through. Remove chicken from skillet and set aside.",
      "In the same skillet, add minced garlic and saute for 1 minute until fragrant. Add sun-dried tomatoes and spinach, cooking until spinach is fully wilted.",
      "Pour in chicken broth and heavy cream. Bring to a simmer and let it cook for 3 minutes to thicken slightly.",
      "Stir in the grated Parmesan cheese until completely melted and smooth.",
      "Return the chicken and any resting juices back to the skillet. Spoon the creamy sauce over the chicken and simmer for 2 more minutes. Serve hot.",
    ],
    cuisineType: "Italian",
    dietType: "non-veg",
    cookTime: 30,
    difficulty: "easy",
    avgRating: 4.8,
    totalReviews: 124,
    images: [
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    ],
    createdAt: "2026-06-15T12:00:00Z",
  },
};

// const RELATED_RECIPES = [
//   {
//     _id: "2",
//     title: "Spiced Chickpea & Spinach Curry",
//     shortDescription:
//       "A flavorful, aromatic vegan curry packed with protein-rich chickpeas and fresh spinach.",
//     cuisineType: "Indian",
//     avgRating: 4.9,
//     images: [
//       "https://images.unsplash.com/photo-1547825407-2d060104b7c8?auto=format&fit=crop&q=80&w=600",
//     ],
//   },
//   {
//     _id: "4",
//     title: "Mediterranean Quinoa Bowl",
//     shortDescription:
//       "A vibrant, healthy bowl loaded with cucumbers, olives, cherry tomatoes, and grilled feta cheese.",
//     cuisineType: "Mediterranean",
//     avgRating: 4.6,
//     images: [
//       "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600",
//     ],
//   },
// ];

export default function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  // Fetch Recipe details
  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery<DetailedRecipe>({
    queryKey: ["recipe-details", id],
    queryFn: async () => {
      const response = await axios.get(`${apiUrl}/recipes/${id}`);
      return response.data?.data?.recipe || response.data?.data || response.data;
    },
  });

  // Fetch related recipes (same cuisine, excluding current recipe)
  const { data: relatedRecipes = [] } = useQuery<DetailedRecipe[]>({
    queryKey: ["related-recipes", recipe?.cuisineType, id],
    enabled: !!recipe,
    queryFn: async () => {
      const response = await axios.get(`${apiUrl}/recipes`);
      const payload = response.data?.data ?? response.data;
      const all: DetailedRecipe[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.recipes)
          ? payload.recipes
          : [];

      const sameCuisine = all.filter(
        (r) => r._id !== id && r.cuisineType === recipe?.cuisineType,
      );

      if (sameCuisine.length > 0) return sameCuisine.slice(0, 2);

      // Fallback: no other recipe shares the cuisine, just show any 2 others
      return all.filter((r) => r._id !== id).slice(0, 2);
    },
  });

  // Auth for submitting reviews
  const { token, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Fetch real reviews for this recipe
  const { data: reviewsData } = useQuery<{ reviews: Review[]; total: number }>({
    queryKey: ["recipe-reviews", id],
    queryFn: async () => {
      const response = await axios.get(`${apiUrl}/reviews/recipe/${id}`);
      return response.data?.data || { reviews: [], total: 0 };
    },
  });

  const reviews = reviewsData?.reviews || [];

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percent =
      reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { stars, percent };
  });

  // Review submission form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${apiUrl}/reviews`,
        { recipeId: id, rating: reviewRating, comment: reviewComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      setReviewComment("");
      setReviewRating(5);
      setReviewError("");
      queryClient.invalidateQueries({ queryKey: ["recipe-reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["recipe-details", id] });
    },
    onError: (err: unknown) => {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Couldn't submit your review. Please try again.";
      setReviewError(message);
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      setReviewError("Please log in to leave a review.");
      return;
    }
    if (reviewComment.trim().length < 5) {
      setReviewError("Comment must be at least 5 characters.");
      return;
    }
    submitReviewMutation.mutate();
  };

  // Carousel Image State
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Ingredients Checkbox List State
  const [checkedIngredients, setCheckedIngredients] = useState<
    Record<number, boolean>
  >({});

  // Expandable steps state
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({
    0: true,
  });

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (idx: number) => {
    setExpandedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 animate-pulse flex flex-col gap-10">
        <div className="h-6 bg-neutral-200 rounded w-24" />
        <div className="h-96 bg-neutral-200 rounded-2xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-80 bg-neutral-200 rounded-2xl" />
          <div className="lg:col-span-4 h-80 bg-neutral-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center flex flex-col items-center gap-4">
        <span className="text-4xl">⚠️</span>
        <h2 className="font-poppins font-extrabold text-2xl text-secondary">
          Recipe Not Found
        </h2>
        <p className="text-sm text-text-brown/70 max-w-md">
          The recipe you are trying to view does not exist or has been removed.
        </p>
        <Link
          href="/recipes"
          className="bg-primary hover:bg-primary/95 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      {/* Back link */}
      <div>
        <Link
          href="/recipes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Recipes</span>
        </Link>
      </div>

      {/* Hero Visual Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Carousel / Image view */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative w-full h-[400px] sm:h-[450px] rounded-2xl overflow-hidden shadow-sm border border-neutral-100/50 bg-neutral-100">
            <img
              src={
                recipe.images[activeImageIdx] ||
                "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800"
              }
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            {/* Quick action: save */}
            <button className="absolute top-4 right-4 h-10 w-10 bg-white/95 backdrop-blur-md rounded-full shadow-md flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors">
              <Heart className="h-5 w-5 fill-current" />
            </button>
          </div>
          {/* Thumbnails */}
          {recipe.images.length > 1 && (
            <div className="flex gap-3">
              {recipe.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    idx === activeImageIdx
                      ? "border-primary scale-95"
                      : "border-transparent hover:opacity-90"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recipe Overview Stats */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            <span className="bg-secondary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
              {recipe.cuisineType}
            </span>
            <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
              {recipe.dietType}
            </span>
          </div>

          <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary leading-tight">
            {recipe.title}
          </h1>

          <div className="flex items-center gap-4 text-sm font-semibold text-text-brown">
            <div className="flex items-center gap-1 text-accent">
              <Star className="h-4.5 w-4.5 fill-accent" />
              <span>
                {recipe.avgRating} ({recipe.totalReviews} reviews)
              </span>
            </div>
            <div className="h-4 w-px bg-neutral-300" />
            <div className="flex items-center gap-1.5 text-neutral-500">
              <Calendar className="h-4 w-4" />
              <span>
                Added {new Date(recipe.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <p className="text-text-brown/80 text-sm leading-relaxed font-light">
            {recipe.fullDescription}
          </p>

          <div className="grid grid-cols-3 gap-4 bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col items-center text-center gap-1">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-[10px] text-text-brown/55 uppercase font-medium mt-1">
                Cook Time
              </span>
              <strong className="text-secondary text-sm">
                {recipe.cookTime} mins
              </strong>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Flame className="h-5 w-5 text-primary" />
              <span className="text-[10px] text-text-brown/55 uppercase font-medium mt-1">
                Difficulty
              </span>
              <strong className="text-secondary text-sm capitalize">
                {recipe.difficulty}
              </strong>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
              <span className="text-[10px] text-text-brown/55 uppercase font-medium mt-1">
                Ingredients
              </span>
              <strong className="text-secondary text-sm">
                {recipe.ingredients.length} items
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Ingredients Sticky Sidebar (desktop only) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 bg-white border border-neutral-200/50 p-6 rounded-2xl shadow-xs">
          <h3 className="font-poppins font-bold text-lg text-secondary mb-4 flex items-center gap-2">
            <span>Ingredients Checklist</span>
            <span className="text-xs font-semibold text-primary bg-primary/5 px-2.5 py-0.5 rounded-full">
              {Object.values(checkedIngredients).filter(Boolean).length}/
              {recipe.ingredients.length}
            </span>
          </h3>
          <p className="text-xs text-text-brown/60 mb-4 leading-relaxed">
            Check off ingredients as you prepare them in your kitchen.
          </p>
          <div className="flex flex-col gap-3">
            {recipe.ingredients.map((ing, idx) => (
              <label
                key={idx}
                onClick={() => toggleIngredient(idx)}
                className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer select-none transition-all ${
                  checkedIngredients[idx]
                    ? "bg-primary/5 text-text-brown/60"
                    : "hover:bg-neutral-50"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    checkedIngredients[idx]
                      ? "bg-primary border-primary text-white"
                      : "border-neutral-300 bg-white"
                  }`}
                >
                  {checkedIngredients[idx] && (
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  )}
                </div>
                <div className="text-sm">
                  <span
                    className={`font-semibold ${checkedIngredients[idx] ? "line-through text-neutral-400" : ""}`}
                  >
                    {ing.quantity}
                  </span>{" "}
                  <span
                    className={
                      checkedIngredients[idx]
                        ? "line-through text-neutral-400"
                        : ""
                    }
                  >
                    {ing.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Step-by-Step Instructions & Reviews */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          {/* Instructions */}
          <div className="bg-white border border-neutral-200/50 p-6 sm:p-8 rounded-2xl shadow-xs">
            <h3 className="font-poppins font-bold text-xl text-secondary mb-6 flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              <span>Cooking Directions</span>
            </h3>

            <div className="flex flex-col gap-4">
              {recipe.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="border border-neutral-100 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleStep(idx)}
                    className="w-full flex items-start justify-between p-4 text-left font-medium"
                  >
                    <div className="flex items-start gap-3.5 pr-4">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-sm sm:text-base text-secondary line-clamp-1 font-semibold">
                        {step.split(".")[0]}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4.5 w-4.5 text-neutral-400 transition-transform ${
                        expandedSteps[idx] ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSteps[idx] && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-5 pl-14 text-sm text-text-brown/75 leading-relaxed">
                          {step}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white border border-neutral-200/50 p-6 sm:p-8 rounded-2xl shadow-xs flex flex-col gap-6">
            <h3 className="font-poppins font-bold text-xl text-secondary">
              Community Reviews
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 border-b border-neutral-100 pb-6">
              <div className="flex flex-col items-center text-center">
                <span className="text-5xl font-extrabold text-secondary">
                  {recipe.avgRating}
                </span>
                <div className="flex gap-1 text-accent mt-2">
                  <Star className="h-4.5 w-4.5 fill-accent" />
                  <Star className="h-4.5 w-4.5 fill-accent" />
                  <Star className="h-4.5 w-4.5 fill-accent" />
                  <Star className="h-4.5 w-4.5 fill-accent" />
                  <Star className="h-4.5 w-4.5 fill-accent" />
                </div>
                <span className="text-xs text-text-brown/65 mt-1">
                  {recipe.totalReviews} reviews
                </span>
              </div>
              <div className="flex-1 w-full flex flex-col gap-2">
                {ratingBreakdown.map(({ stars, percent }) => (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-3 text-right">{stars}</span>
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-neutral-400">{percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Review item */}
            {/* Write a Review */}
            <form
              onSubmit={handleSubmitReview}
              className="flex flex-col gap-3 p-4 bg-bg-cream rounded-xl border border-neutral-100"
            >
              <h4 className="font-bold text-xs text-secondary uppercase tracking-wider">
                Write a Review
              </h4>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-0.5"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= reviewRating
                          ? "fill-accent text-accent"
                          : "text-neutral-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience cooking this recipe..."
                rows={3}
                className="w-full text-sm border border-neutral-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/50 bg-white"
              />
              {reviewError && (
                <p className="text-xs text-red-500">{reviewError}</p>
              )}
              <button
                type="submit"
                disabled={submitReviewMutation.isPending}
                className="self-start bg-primary hover:bg-primary/95 text-white font-semibold px-5 py-2 rounded-lg text-xs transition-all disabled:opacity-50"
              >
                {submitReviewMutation.isPending
                  ? "Submitting..."
                  : "Submit Review"}
              </button>
            </form>

            {/* Review List */}
            <div className="flex flex-col gap-4">
              {reviews.length === 0 ? (
                <p className="text-sm text-text-brown/60">
                  No reviews yet. Be the first to share your experience!
                </p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="flex flex-col gap-1.5 p-4 bg-bg-cream rounded-xl border border-neutral-100"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                          {review.userId?.name?.charAt(0) || "?"}
                        </span>
                        <div>
                          <h4 className="font-bold text-xs text-secondary">
                            {review.userId?.name || "Anonymous"}
                          </h4>
                          <div className="flex gap-0.5 text-accent">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? "fill-accent text-accent"
                                    : "text-neutral-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-text-brown/50">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-text-brown/80 leading-relaxed mt-2 pl-10">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

     {/* Related Recipes Carousel */}
      <section className="border-t border-neutral-200/50 pt-10">
        <h3 className="font-poppins font-bold text-2xl text-secondary mb-6">
          Related Recipes
        </h3>
        {relatedRecipes.length === 0 ? (
          <p className="text-sm text-text-brown/60">
            No related recipes found yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {relatedRecipes.map((rel) => (
              <Link key={rel._id} href={`/recipes/${rel._id}`}>
                <article className="pantry-card group cursor-pointer flex flex-col sm:flex-row gap-5 items-center justify-between">
                  <img
                    src={
                      rel.images?.[0] ||
                      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600"
                    }
                    alt={rel.title}
                    className="w-full sm:w-32 h-28 object-cover rounded-xl"
                  />
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-accent">
                      <Star className="h-3.5 w-3.5 fill-accent" />
                      <span className="text-[10px] font-semibold text-text-brown">
                        {rel.avgRating}
                      </span>
                    </div>
                    <h4 className="font-poppins font-bold text-base text-secondary group-hover:text-primary transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-text-brown/70 text-xs line-clamp-2 leading-relaxed">
                      {rel.shortDescription}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
