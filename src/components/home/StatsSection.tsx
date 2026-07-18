"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen, Users, Globe2 } from "lucide-react";

export default function StatsSection() {
  const [stats, setStats] = useState({ recipes: 0, users: 0, cuisines: 0 });
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const [statsAnimated, setStatsAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
          setStatsAnimated(true);
          let startRecipes = 0;
          let startUsers = 0;
          let startCuisines = 0;
          const duration = 2000;
          const intervalTime = 30;
          const stepRecipes = Math.ceil(12400 / (duration / intervalTime));
          const stepUsers = Math.ceil(48000 / (duration / intervalTime));
          const stepCuisines = Math.ceil(35 / (duration / intervalTime));

          const counter = setInterval(() => {
            startRecipes = Math.min(startRecipes + stepRecipes, 12400);
            startUsers = Math.min(startUsers + stepUsers, 48000);
            startCuisines = Math.min(startCuisines + stepCuisines, 35);

            setStats({ recipes: startRecipes, users: startUsers, cuisines: startCuisines });

            if (startRecipes === 12400 && startUsers === 48000 && startCuisines === 35) {
              clearInterval(counter);
            }
          }, intervalTime);
        }
      },
      { threshold: 0.1 }
    );

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }
    return () => observer.disconnect();
  }, [statsAnimated]);

  return (
    <section ref={statsSectionRef} className="py-16 bg-secondary text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,115,74,0.15),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center">
            <span className="p-3 bg-white/10 rounded-2xl mb-4 text-primary">
              <BookOpen className="h-6 w-6" />
            </span>
            <h3 className="font-poppins font-extrabold text-3xl sm:text-4xl text-white">
              {stats.recipes.toLocaleString()}+
            </h3>
            <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1">Smart Recipes</p>
          </div>

          <div className="flex flex-col items-center">
            <span className="p-3 bg-white/10 rounded-2xl mb-4 text-primary">
              <Users className="h-6 w-6" />
            </span>
            <h3 className="font-poppins font-extrabold text-3xl sm:text-4xl text-white">
              {stats.users.toLocaleString()}+
            </h3>
            <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1">Active Chefs</p>
          </div>

          <div className="flex flex-col items-center">
            <span className="p-3 bg-white/10 rounded-2xl mb-4 text-primary">
              <Globe2 className="h-6 w-6" />
            </span>
            <h3 className="font-poppins font-extrabold text-3xl sm:text-4xl text-white">
              {stats.cuisines}+
            </h3>
            <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1">Global Cuisines</p>
          </div>
        </div>
      </div>
    </section>
  );
}