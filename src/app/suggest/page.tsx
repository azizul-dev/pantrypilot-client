"use client";

import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Plus,
  Clock,
  Lightbulb,
  ChevronRight,
  Star,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface SuggestedRecipe {
  recipeId: string;
  title: string;
  reasoning: string;
  matchScore: number;
  missingIngredients: string[];
  cookTime: number;
  difficulty: string;
  cuisineType: string;
}

export default function SuggestPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const { token, isAuthenticated } = useAuth();

  const [ingredients, setIngredients] = useState<string[]>([
    "Chicken",
    "Garlic",
    "Spinach",
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedRecipe[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  const handleAddIngredient = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    } else if (e.key === "," || e.key === "Tab") {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (ing: string) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  const handleGetSuggestions = async () => {
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient to get suggestions.");
      return;
    }
    if (!isAuthenticated || !token) {
      setError("Please log in to get AI recipe suggestions.");
      return;
    }
    setIsLoading(true);
    setError("");
    setSuggestions([]);

    try {
      const response = await axios.post(
        `${apiUrl}/ai/suggest-recipes`,
        { ingredients },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data?.data?.suggestions;
      if (Array.isArray(data) && data.length > 0) {
        setSuggestions(data);
        setHasSearched(true);
      } else {
        throw new Error("Empty or invalid suggestion response");
      }
    } catch (err) {
      console.error("AI suggestion request failed:", err);
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Couldn't get AI suggestions right now. Please try again in a moment.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const matchScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 65) return "text-accent bg-accent/10 border-accent/20";
    return "text-red-500 bg-red-50 border-red-200";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      {/* Hero Header */}
      <div className="text-center flex flex-col gap-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mx-auto">
          <Sparkles className="h-3.5 w-3.5 fill-primary" /> Powered by Gemini AI
        </div>
        <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary leading-tight">
          AI Recipe Suggestions
        </h1>
        <p className="text-sm sm:text-base text-text-brown/70 max-w-lg mx-auto leading-relaxed">
          Tell us what ingredients you have, and our AI will instantly suggest
          personalized recipes you can cook today.
        </p>
      </div>

      {/* Ingredient Input Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/60 p-6 sm:p-8 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-text-brown/70">
            Your Pantry Ingredients
          </label>
          <p className="text-xs text-text-brown/50">
            Type an ingredient and press{" "}
            <kbd className="bg-neutral-100 border border-neutral-200 rounded px-1.5 py-0.5 font-mono text-[10px]">
              Enter
            </kbd>{" "}
            or{" "}
            <kbd className="bg-neutral-100 border border-neutral-200 rounded px-1.5 py-0.5 font-mono text-[10px]">
              ,
            </kbd>{" "}
            to add it.
          </p>
        </div>

        {/* Chip Input Box */}
        <div className="min-h-[56px] flex flex-wrap gap-2 items-center border border-neutral-300 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-primary/50">
          <AnimatePresence>
            {ingredients.map((ing) => (
              <motion.span
                key={ing}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold"
              >
                {ing}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(ing)}
                  className="text-primary/60 hover:text-primary transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              ingredients.length === 0
                ? "e.g. Chicken, Garlic, Tomatoes..."
                : "Add more..."
            }
            className="flex-1 min-w-[120px] text-sm border-none outline-none bg-transparent placeholder:text-neutral-400"
          />
        </div>

        {/* Quick suggestion pills */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-text-brown/50 mt-0.5">Quick add:</span>
          {[
            "Onion",
            "Tomato",
            "Olive Oil",
            "Garlic",
            "Eggs",
            "Cheese",
            "Rice",
            "Lemon",
          ].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                if (!ingredients.includes(item)) {
                  setIngredients([...ingredients, item]);
                }
              }}
              disabled={ingredients.includes(item)}
              className="text-xs border border-neutral-200 text-text-brown/70 hover:border-primary hover:text-primary hover:bg-primary/5 px-2.5 py-1 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + {item}
            </button>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 border border-red-100 p-3 rounded-xl">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleGetSuggestions}
          disabled={isLoading || ingredients.length === 0}
          className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-4 rounded-xl text-base flex items-center justify-center gap-2.5 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
        >
          {isLoading ? (
            <span className="animate-pulse">✦</span>
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
          <span>
            {isLoading
              ? "Consulting AI Chef..."
              : `Get Suggestions (${ingredients.length} ingredients)`}
          </span>
        </button>
      </div>

      {/* AI Thinking Loader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="thinking"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-4 py-12"
          >
            {/* Pulsing orb animation */}
            <div className="relative flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-primary/20 animate-ping absolute" />
              <div className="h-16 w-16 rounded-full bg-primary/30 animate-pulse absolute" />
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center z-10">
                <Sparkles className="h-6 w-6 text-white animate-pulse" />
              </div>
            </div>
            <div className="text-center flex flex-col gap-1.5">
              <p className="font-poppins font-bold text-secondary">
                AI is thinking...
              </p>
              <p className="text-xs text-text-brown/60">
                Analyzing your {ingredients.length} ingredients to find perfect
                matches
              </p>
            </div>
            {/* Animated dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="h-2.5 w-2.5 rounded-full bg-primary"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions results */}
      <AnimatePresence>
        {hasSearched && !isLoading && suggestions.length > 0 && (
          <motion.div
            key="results"
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              <h2 className="font-poppins font-extrabold text-xl text-secondary">
                AI Recommendations
              </h2>
              <span className="text-xs text-text-brown/50 bg-neutral-100 px-2.5 py-0.5 rounded-full font-medium">
                {suggestions.length} results
              </span>
            </div>

            {suggestions.map((recipe, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col gap-4"
              >
                {/* Recipe header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h3 className="font-poppins font-extrabold text-lg text-secondary">
                        {recipe.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-brown/60 pl-8">
                      <span className="bg-secondary/5 text-secondary px-2 py-0.5 rounded-md font-medium">
                        {recipe.cuisineType}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recipe.cookTime} min
                      </span>
                      <span className="capitalize font-medium">
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div
                    className={`flex items-center gap-1.5 border text-sm font-bold px-3 py-1.5 rounded-full shrink-0 ${matchScoreColor(recipe.matchScore)}`}
                  >
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{recipe.matchScore}% match</span>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-bg-cream rounded-xl p-4 border border-neutral-100/80">
                  <p className="text-xs font-bold text-text-brown/60 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-primary" />
                    AI Reasoning
                  </p>
                  <p className="text-sm text-text-brown/85 leading-relaxed italic">
                    "{recipe.reasoning}"
                  </p>
                </div>

                {/* Missing Ingredients */}
                {recipe.missingIngredients.length > 0 && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-semibold text-text-brown/60 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                      Missing:
                    </span>
                    {recipe.missingIngredients.map((missing) => (
                      <span
                        key={missing}
                        className="text-xs border border-amber-200 bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full"
                      >
                        {missing}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <div className="flex justify-end">
                  <Link
                    href={`/recipes/${recipe.recipeId}`}
                    className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>View Full Recipe</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
