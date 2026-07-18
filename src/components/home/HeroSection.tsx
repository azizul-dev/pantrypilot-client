"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChefHat, ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[65vh] flex items-center overflow-hidden bg-gradient-to-br from-bg-cream to-white py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 text-center lg:text-left flex flex-col gap-6"
        >
          <span className="inline-flex max-w-max mx-auto lg:mx-0 items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Powered by Gemini AI
          </span>
          <h1 className="font-poppins font-extrabold text-4xl sm:text-5xl lg:text-6xl text-secondary leading-tight tracking-tight">
            Cook with What You Have, <br />
            <span className="text-primary">Waste Absolutely Nothing.</span>
          </h1>
          <p className="text-text-brown/80 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
            PantryPilot generates custom, delicious recipes instantly using the ingredients sitting in your kitchen right now. Get smart suggestions, nutritional counts, and structured guides.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
            <Link
              href="#ai-teaser"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-semibold text-white shadow-md hover:bg-primary/95 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Try AI Suggestion</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#explore"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-8 py-4 font-semibold text-text-brown hover:bg-neutral-50 transition-all duration-200 hover:-translate-y-0.5"
            >
              Explore Recipes
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="lg:col-span-5 flex justify-center items-center"
        >
          <div className="relative w-72 h-72 sm:w-96 sm:h-96">
            <div className="absolute inset-0 rounded-full border border-dashed border-primary/20 animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-primary/10 animate-[spin_40s_linear_infinite_reverse]" />
            <div className="absolute inset-10 rounded-full bg-white shadow-xl flex items-center justify-center p-8 border border-neutral-100/50">
              <div className="relative w-full h-full rounded-full bg-bg-cream flex items-center justify-center text-center p-4">
                <div className="flex flex-col items-center">
                  <ChefHat className="h-16 w-16 text-primary mb-2 animate-bounce" />
                  <span className="font-poppins font-bold text-sm text-secondary">PANTRY PILOT</span>
                  <span className="text-[10px] text-text-brown/65 uppercase tracking-widest mt-1">Smart Kitchen</span>
                </div>
              </div>
            </div>
            <div className="absolute top-2 left-6 bg-white px-3 py-1.5 rounded-full shadow-md text-xs font-semibold flex items-center gap-1.5 border border-neutral-100 animate-pulse">
              🍗 Chicken
            </div>
            <div className="absolute top-1/2 -left-12 bg-white px-3 py-1.5 rounded-full shadow-md text-xs font-semibold flex items-center gap-1.5 border border-neutral-100">
              🧄 Garlic
            </div>
            <div className="absolute bottom-6 left-12 bg-white px-3 py-1.5 rounded-full shadow-md text-xs font-semibold flex items-center gap-1.5 border border-neutral-100">
              🥬 Spinach
            </div>
            <div className="absolute top-1/4 -right-8 bg-white px-3 py-1.5 rounded-full shadow-md text-xs font-semibold flex items-center gap-1.5 border border-neutral-100">
              🥑 Avocado
            </div>
            <div className="absolute bottom-1/4 -right-12 bg-white px-3 py-1.5 rounded-full shadow-md text-xs font-semibold flex items-center gap-1.5 border border-neutral-100 animate-pulse">
              🍅 Tomato
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}