"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen, Users, Globe2 } from "lucide-react";

export default function StatsSection() {
  const [targets, setTargets] = useState({ recipes: 0, users: 0, cuisines: 0 });
  const [stats, setStats] = useState({ recipes: 0, users: 0, cuisines: 0 });
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // ─── Fetch real stats from backend ────────────────────────────────────────
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const res = await fetch(`${apiUrl}/stats`);
        const json = await res.json();
        if (res.ok && json?.data) {
          setTargets({
            recipes: json.data.recipes,
            users: json.data.users,
            cuisines: json.data.cuisines,
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchStats();
  }, []);

  // ─── Animate counters once visible AND data has loaded ───────────────────
  useEffect(() => {
    if (!loaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
          setStatsAnimated(true);
          const { recipes, users, cuisines } = targets;
          let startRecipes = 0;
          let startUsers = 0;
          let startCuisines = 0;
          const duration = 2000;
          const intervalTime = 30;
          const steps = Math.max(1, Math.round(duration / intervalTime));
          const stepRecipes = Math.max(1, Math.ceil(recipes / steps));
          const stepUsers = Math.max(1, Math.ceil(users / steps));
          const stepCuisines = Math.max(1, Math.ceil(cuisines / steps));

          const counter = setInterval(() => {
            startRecipes = Math.min(startRecipes + stepRecipes, recipes);
            startUsers = Math.min(startUsers + stepUsers, users);
            startCuisines = Math.min(startCuisines + stepCuisines, cuisines);

            setStats({ recipes: startRecipes, users: startUsers, cuisines: startCuisines });

            if (startRecipes === recipes && startUsers === users && startCuisines === cuisines) {
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
  }, [statsAnimated, loaded, targets]);

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
