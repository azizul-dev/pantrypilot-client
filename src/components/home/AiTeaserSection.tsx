"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Trash2 } from "lucide-react";

export default function AiTeaserSection() {
  const [teaserIngredients, setTeaserIngredients] = useState<string[]>(["Chicken", "Garlic", "Spinach"]);
  const [newIngredient, setNewIngredient] = useState("");
  const [teaserResult, setTeaserResult] = useState<any>(null);
  const [isTeaserLoading, setIsTeaserLoading] = useState(false);

  const addIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIngredient.trim() && !teaserIngredients.includes(newIngredient.trim())) {
      setTeaserIngredients([...teaserIngredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (ing: string) => {
    setTeaserIngredients(teaserIngredients.filter((i) => i !== ing));
  };

  const handleGenerateTeaser = () => {
    if (teaserIngredients.length === 0) return;
    setIsTeaserLoading(true);
    setTimeout(() => {
      setTeaserResult({
        title: "Tuscan Garlic Spinach Stir-Fry",
        matchPercentage: 94,
        extraRequired: ["Olive Oil", "Cream"],
        time: "20 mins",
        difficulty: "Easy",
      });
      setIsTeaserLoading(false);
    }, 1500);
  };

  return (
    <section id="ai-teaser" className="py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center flex flex-col gap-3 mb-10"
        >
          <span className="inline-flex max-w-max mx-auto items-center gap-1.5 rounded-full bg-accent/15 px-4 py-1 text-xs font-semibold text-accent">
            <Sparkles className="h-3.5 w-3.5 fill-accent" /> AI Sandbox
          </span>
          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary">
            Interactive AI Suggestion Teaser
          </h2>
          <p className="text-text-brown/75 text-sm sm:text-base max-w-xl mx-auto">
            Add some ingredients you currently have in your kitchen, then test the generator to see what culinary ideas the pilot designs!
          </p>
        </motion.div>

        <div className="bg-bg-cream rounded-2xl p-6 sm:p-8 shadow-sm border border-neutral-200/50">
          <form onSubmit={addIngredient} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Tomato, Cheese, Basil..."
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              className="flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="submit"
              className="bg-secondary hover:bg-secondary/95 text-white font-semibold px-5 rounded-xl flex items-center justify-center gap-1 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </form>

          <div className="flex flex-wrap gap-2 mt-4 min-h-[40px] items-center">
            {teaserIngredients.length === 0 && (
              <span className="text-xs text-text-brown/40 italic">No ingredients added yet. Add some above!</span>
            )}
            {teaserIngredients.map((ing) => (
              <span
                key={ing}
                className="bg-white border border-neutral-200/80 rounded-full px-3 py-1 text-xs font-medium text-text-brown flex items-center gap-1.5"
              >
                {ing}
                <button
                  type="button"
                  onClick={() => removeIngredient(ing)}
                  className="text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          <button
            onClick={handleGenerateTeaser}
            disabled={teaserIngredients.length === 0 || isTeaserLoading}
            className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-3.5 rounded-xl mt-6 flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTeaserLoading ? (
              <>
                <span className="animate-spin text-lg">⏳</span>
                <span>Consulting PantryPilot AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Recipe Idea</span>
              </>
            )}
          </button>

          <AnimatePresence>
            {teaserResult && !isTeaserLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 border-t border-neutral-200/60 pt-6 flex flex-col gap-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-poppins font-bold text-lg text-secondary">{teaserResult.title}</h4>
                  <span className="bg-accent/20 text-text-brown text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    🔥 {teaserResult.matchPercentage}% Ingredient Match
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-neutral-100">
                    <span className="text-text-brown/50 block mb-1">Time</span>
                    <strong className="text-secondary">{teaserResult.time}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-neutral-100">
                    <span className="text-text-brown/50 block mb-1">Difficulty</span>
                    <strong className="text-secondary">{teaserResult.difficulty}</strong>
                  </div>
                  <div className="col-span-2 sm:col-span-1 bg-white p-3 rounded-xl border border-neutral-100">
                    <span className="text-text-brown/50 block mb-1">Missing Pantry items</span>
                    <strong className="text-primary">{teaserResult.extraRequired.join(", ")}</strong>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}