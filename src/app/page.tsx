"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat,
  ArrowRight,
  Sparkles,
  Plus,
  Trash2,
  Clock,
  Star,
  BookOpen,
  Users,
  Globe2,
  CheckCircle,
  ChevronDown,
  Mail,
  Flame,
  Award,
  ArrowRightLeft
} from "lucide-react";

// Types matching the backend model
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

// Fallback dummy recipes
const DUMMY_RECIPES: Recipe[] = [
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

const CATEGORIES = [
  { name: "Italian", icon: "🍝", count: 24 },
  { name: "Indian", icon: "🍛", count: 18 },
  { name: "Mexican", icon: "🌮", count: 15 },
  { name: "Mediterranean", icon: "🥗", count: 21 },
  { name: "Asian", icon: "🥢", count: 32 },
  { name: "French", icon: "🥐", count: 12 },
  { name: "Baking", icon: "🍰", count: 16 },
  { name: "BBQ", icon: "🍖", count: 9 },
];

const TESTIMONIALS = [
  {
    quote: "PantryPilot completely changed how I cook. I just type in whatever is getting old in my fridge and suddenly I have a gourmet dinner plan!",
    author: "Sarah Jenkins",
    role: "Busy Mother of Two",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  },
  {
    quote: "As a college student on a budget, this tool is a lifesaver. I waste zero food and eat better than I ever did before.",
    author: "Marcus Chen",
    role: "Computer Science Student",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  },
  {
    quote: "The recipe recommendations are spot on. I love the ease of tracking what I have and the gorgeous cooking guides.",
    author: "Elena Rostova",
    role: "Culinary Enthusiast",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
  }
];

const FAQS = [
  {
    question: "How does the AI recipe generator work?",
    answer: "Our advanced algorithm takes the list of ingredients you currently have in your pantry and matches them with our recipe library, or generates entirely unique recipes based on classic flavor pairings and culinary rules."
  },
  {
    question: "Can I customize recipes based on my diet?",
    answer: "Absolutely! You can filter recipes and AI generation by Vegan, Vegetarian, Gluten-Free, Low-Carb, and many other dietary preferences or allergies."
  },
  {
    question: "Is PantryPilot free to use?",
    answer: "Yes, our core platform, recipe browser, and daily AI recipe generation are completely free. We also offer a premium tier for advanced meal planning calendars."
  },
  {
    question: "Can I save my own custom recipes?",
    answer: "Yes, once you sign up for a free account, you can add, edit, and organize your own custom recipes in your personal digital recipe book."
  }
];

export default function HomePage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // 1. Fetch Recipes from Backend using React Query
  const { data: recipes = DUMMY_RECIPES, isLoading } = useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${apiUrl}/recipes`);
        // If it successfully returns data, use it; otherwise fallback
        return response.data?.data || response.data || DUMMY_RECIPES;
      } catch (err) {
        console.warn("Backend not running or error fetching, using fallback recipes.", err);
        return DUMMY_RECIPES;
      }
    },
  });

  // 2. AI Teaser Section State
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
        difficulty: "Easy"
      });
      setIsTeaserLoading(false);
    }, 1500);
  };

  // 3. Testimonials Carousel State
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // 4. Stats Counter Animation Simulation
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

            setStats({
              recipes: startRecipes,
              users: startUsers,
              cuisines: startCuisines,
            });

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

  // 5. FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // 6. Newsletter Signup State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("loading");
    setTimeout(() => {
      setNewsletterStatus("success");
      setNewsletterEmail("");
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden bg-gradient-to-br from-bg-cream to-white py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
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
              <a
                href="#ai-teaser"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-semibold text-white shadow-md hover:bg-primary/95 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Try AI Suggestion</span>
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#explore"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-8 py-4 font-semibold text-text-brown hover:bg-neutral-50 transition-all duration-200 hover:-translate-y-0.5"
              >
                Explore Recipes
              </a>
            </div>
          </motion.div>

          {/* Hero Right Visuals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center items-center"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              {/* Rotating Plate Decoration */}
              <div className="absolute inset-0 rounded-full border border-dashed border-primary/20 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-primary/10 animate-[spin_40s_linear_infinite_reverse]" />
              {/* Center Plate Illustration */}
              <div className="absolute inset-10 rounded-full bg-white shadow-xl flex items-center justify-center p-8 border border-neutral-100/50">
                <div className="relative w-full h-full rounded-full bg-bg-cream flex items-center justify-center text-center p-4">
                  <div className="flex flex-col items-center">
                    <ChefHat className="h-16 w-16 text-primary mb-2 animate-bounce" />
                    <span className="font-poppins font-bold text-sm text-secondary">PANTRY PILOT</span>
                    <span className="text-[10px] text-text-brown/65 uppercase tracking-widest mt-1">Smart Kitchen</span>
                  </div>
                </div>
              </div>
              {/* Floating ingredient nodes */}
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

      {/* 2. How It Works Section */}
      <section id="about" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto mb-16 flex flex-col gap-3"
          >
            <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary">
              Three Simple Steps to Mealtime Bliss
            </h2>
            <p className="text-text-brown/70 text-sm sm:text-base leading-relaxed">
              No complex meal prep required. Our flow connects you directly from food scraps to delicious gourmet recipes in seconds.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-center p-6"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold font-poppins mb-6">
                1
              </div>
              <h3 className="font-poppins font-bold text-lg text-secondary mb-2">Add Ingredients</h3>
              <p className="text-text-brown/70 text-sm text-center leading-relaxed">
                Input the ingredients you want to use. Add everything from fresh veggies to pantry spices.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center p-6"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold font-poppins mb-6">
                2
              </div>
              <h3 className="font-poppins font-bold text-lg text-secondary mb-2">Get AI Suggestions</h3>
              <p className="text-text-brown/70 text-sm text-center leading-relaxed">
                Our Gemini-powered AI engine instantly compiles customized suggestions with precise matching ratios.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center p-6"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold font-poppins mb-6">
                3
              </div>
              <h3 className="font-poppins font-bold text-lg text-secondary mb-2">Cook & Enjoy</h3>
              <p className="text-text-brown/70 text-sm text-center leading-relaxed">
                Follow the clear, step-by-step guides with cook times, and prepare healthy meals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Featured Recipes Section */}
      <section id="explore" className="py-20 bg-bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="font-poppins font-bold text-xs uppercase tracking-widest text-primary">Handpicked Favorites</span>
              <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary mt-1">Featured Recipes</h2>
            </div>
            <p className="text-text-brown/70 text-sm md:max-w-md">
              Check out these trending kitchen creations. Fresh, healthy, and easy-to-follow directions approved by top chefs.
            </p>
          </div>

          {/* Recipes Card Grid with Skeletons */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 animate-pulse flex flex-col gap-4">
                  <div className="w-full h-48 bg-neutral-200 rounded-xl" />
                  <div className="h-4 bg-neutral-200 rounded w-2/3" />
                  <div className="h-3 bg-neutral-200 rounded w-full" />
                  <div className="h-3 bg-neutral-200 rounded w-5/6" />
                  <div className="flex gap-2 mt-2">
                    <div className="h-5 bg-neutral-200 rounded w-16" />
                    <div className="h-5 bg-neutral-200 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {recipes.slice(0, 8).map((recipe) => (
                <article
                  key={recipe._id}
                  className="pantry-card group cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                    <img
                      src={recipe.images?.[0] || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600"}
                      alt={recipe.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Fixed Badges during hover */}
                    <div className="absolute top-2 left-2 flex gap-1.5 pointer-events-none">
                      <span className="bg-secondary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.75 rounded-md">
                        {recipe.cuisineType}
                      </span>
                      <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.75 rounded-md">
                        {recipe.dietType}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
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

                  <div className="border-t border-neutral-100 mt-4 pt-3 flex items-center justify-between text-xs text-text-brown/65">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-neutral-400" />
                      <span>{recipe.cookTime} min</span>
                    </div>
                    <span className="capitalize font-medium text-primary bg-primary/5 px-2.5 py-0.5 rounded-full">
                      {recipe.difficulty}
                    </span>
                  </div>
                </article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* 4. AI Suggestion Teaser Section */}
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
            {/* Input Form */}
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

            {/* Ingredients list */}
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

            {/* CTA action button */}
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

            {/* Result animation */}
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

      {/* 5. Categories Showcase Section */}
      <section className="py-20 bg-bg-cream overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center md:text-left flex flex-col gap-2">
            <span className="font-poppins font-bold text-xs uppercase tracking-widest text-primary">Browse Cuisines</span>
            <h2 className="font-poppins font-extrabold text-3xl text-secondary">Explore Culinary Categories</h2>
          </div>

          {/* Horizontal scroll container */}
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x scroll-smooth">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="flex-shrink-0 w-44 bg-white rounded-2xl p-5 shadow-sm border border-neutral-200/50 flex flex-col items-center gap-3 snap-start text-center cursor-pointer transition-all hover:shadow-md"
              >
                <span className="text-4xl">{cat.icon}</span>
                <h3 className="font-poppins font-bold text-sm text-secondary">{cat.name}</h3>
                <span className="text-xs text-text-brown/60 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                  {cat.count} recipes
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials Carousel Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary text-center mb-14">
            Loved by Cooks Everywhere
          </h2>

          <div className="relative bg-bg-cream rounded-2xl p-8 sm:p-12 shadow-sm border border-neutral-100">
            <div className="flex flex-col items-center text-center gap-6">
              <span className="text-5xl text-primary font-serif">“</span>
              <p className="font-poppins font-medium text-base sm:text-lg text-text-brown/95 max-w-2xl italic leading-relaxed">
                {TESTIMONIALS[activeTestimonial].quote}
              </p>
              <div className="flex items-center gap-3.5 mt-4">
                <img
                  src={TESTIMONIALS[activeTestimonial].image}
                  alt={TESTIMONIALS[activeTestimonial].author}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-200"
                />
                <div className="text-left">
                  <h4 className="font-poppins font-bold text-sm text-secondary">
                    {TESTIMONIALS[activeTestimonial].author}
                  </h4>
                  <span className="text-xs text-text-brown/60">
                    {TESTIMONIALS[activeTestimonial].role}
                  </span>
                </div>
              </div>

              {/* Dots navigation */}
              <div className="flex items-center gap-2 mt-6">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === activeTestimonial ? "w-6 bg-primary" : "w-2 bg-neutral-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Stats Section */}
      <section ref={statsSectionRef} className="py-16 bg-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,115,74,0.15),transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {/* Stat 1 */}
            <div className="flex flex-col items-center">
              <span className="p-3 bg-white/10 rounded-2xl mb-4 text-primary">
                <BookOpen className="h-6 w-6" />
              </span>
              <h3 className="font-poppins font-extrabold text-3xl sm:text-4xl text-white">
                {stats.recipes.toLocaleString()}+
              </h3>
              <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1">Smart Recipes</p>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center">
              <span className="p-3 bg-white/10 rounded-2xl mb-4 text-primary">
                <Users className="h-6 w-6" />
              </span>
              <h3 className="font-poppins font-extrabold text-3xl sm:text-4xl text-white">
                {stats.users.toLocaleString()}+
              </h3>
              <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1">Active Chefs</p>
            </div>

            {/* Stat 3 */}
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

      {/* 8. Newsletter Signup Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl bg-secondary/5 border border-secondary/10 p-8 sm:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-44 w-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 text-center flex flex-col gap-4 max-w-xl mx-auto">
              <span className="p-2.5 bg-primary/10 rounded-2xl text-primary w-fit mx-auto">
                <Mail className="h-5 w-5" />
              </span>
              <h2 className="font-poppins font-extrabold text-2xl sm:text-3xl text-secondary">
                Get Weekly AI Meal Plans
              </h2>
              <p className="text-text-brown/70 text-sm leading-relaxed">
                Join our newsletter list to receive seasonal recipe ideas, grocery optimization tips, and platform updates.
              </p>

              {newsletterStatus === "success" ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-secondary/10 text-secondary border border-secondary/20 p-4 rounded-xl font-medium text-sm mt-4 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Success! You've joined the PantryPilot kitchen squad.</span>
                </motion.div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-grow rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === "loading"}
                    className="bg-primary hover:bg-primary/95 text-white font-semibold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    {newsletterStatus === "loading" ? "Subscribing..." : "Subscribe Now"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Accordion Section */}
      <section id="contact" className="py-20 bg-bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-poppins font-extrabold text-3xl text-secondary text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="flex flex-col gap-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200/50 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-poppins font-bold text-sm sm:text-base text-secondary">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-neutral-400 transition-transform duration-250 ${
                      openFaqIdx === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaqIdx === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 pt-1 text-sm text-text-brown/75 leading-relaxed border-t border-neutral-50/50">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CTA Banner Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl bg-primary overflow-hidden shadow-lg p-8 sm:p-12 text-center text-white flex flex-col gap-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_60%)]" />
            <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl relative z-10 leading-tight">
              Ready to Meet Your AI Pantry Co-Pilot?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base font-light relative z-10">
              Create a free account to store ingredients, cook matching recipes, and save generated food collections.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center mt-2">
              <a
                href="#ai-teaser"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-xl bg-white px-8 py-3.5 font-bold text-primary hover:bg-neutral-50 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get Started Now</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
