"use client";

import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "10 Essential Knife Skills Every Home Cook Needs",
    excerpt: "Mastering your chef's knife is the single most important step to becoming a faster, safer, and better cook.",
    category: "Techniques",
    author: "Chef Marcus",
    date: "Oct 12, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "2",
    title: "The Ultimate Guide to Pantry Organization",
    excerpt: "Stop buying duplicates and start cooking what you have. Here's how to organize your pantry for maximum efficiency.",
    category: "Organization",
    author: "Sarah Jenkins",
    date: "Nov 04, 2023",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "3",
    title: "Understanding Flavor Profiles: Salt, Fat, Acid, Heat",
    excerpt: "Why does a squeeze of lemon make your soup taste better? Let's dive into the four elements of good cooking.",
    category: "Fundamentals",
    author: "Elena Rossi",
    date: "Nov 18, 2023",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1596624021236-4c40b95eb730?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "4",
    title: "Meal Prepping for Beginners",
    excerpt: "Save time and money by preparing your meals for the week. We cover containers, recipes, and storage times.",
    category: "Guides",
    author: "David Chen",
    date: "Dec 02, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "5",
    title: "How to Rescue an Over-Salted Dish",
    excerpt: "Don't throw it away! We have 5 proven tricks to save your dinner when you've been a bit heavy-handed with the salt.",
    category: "Tips & Tricks",
    author: "Chef Marcus",
    date: "Jan 15, 2024",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "6",
    title: "The Secret to Perfect Crispy Tofu",
    excerpt: "Achieve restaurant-quality crispy tofu at home without deep frying. It's all about the press and the cornstarch.",
    category: "Techniques",
    author: "Elena Rossi",
    date: "Feb 03, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
  }
];

export default function BlogPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col gap-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <h1 className="font-poppins font-extrabold text-4xl sm:text-5xl text-secondary">
          Cooking Tips & Stories
        </h1>
        <p className="text-text-brown/70 text-lg">
          Enhance your culinary skills with expert guides, organizing tips, and stories from our kitchen.
        </p>
      </div>

      {/* Featured Post (First item) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden bg-secondary text-white group cursor-pointer shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
        tabIndex={0}
      >
        <div className="absolute inset-0 z-0">
          <Image 
            src={BLOG_POSTS[0].image} 
            alt={BLOG_POSTS[0].title}
            fill
            className="object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/50 to-transparent"></div>
        </div>
        <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col justify-end min-h-[400px] lg:min-h-[500px]">
          <div className="flex gap-2 mb-4">
            <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {BLOG_POSTS[0].category}
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          </div>
          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-4 max-w-3xl">
            {BLOG_POSTS[0].title}
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mb-6 line-clamp-2">
            {BLOG_POSTS[0].excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{BLOG_POSTS[0].author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{BLOG_POSTS[0].date}</span>
            </div>
            <div className="hidden sm:block h-1 w-1 rounded-full bg-white/30"></div>
            <span>{BLOG_POSTS[0].readTime}</span>
          </div>
        </div>
      </motion.div>

      {/* Grid Posts */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {BLOG_POSTS.slice(1).map((post) => (
          <motion.article 
            key={post.id} 
            variants={item}
            className="pantry-card group cursor-pointer flex flex-col h-full focus-within:ring-4 focus-within:ring-primary/50"
          >
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 shrink-0 bg-neutral-100">
              <Image 
                src={post.image} 
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 backdrop-blur-sm text-secondary px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
                  {post.category}
                </span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 text-xs text-text-brown/50 mb-3">
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="font-poppins font-bold text-xl text-secondary mb-2 group-hover:text-primary transition-colors line-clamp-2">
                <Link href="#" className="focus:outline-none">{post.title}</Link>
              </h3>
              <p className="text-text-brown/70 text-sm line-clamp-3 mb-6 flex-1">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between border-t border-neutral-100 pt-4 mt-auto">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs">
                    {post.author.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-text-brown/80">{post.author}</span>
                </div>
                <button className="text-primary hover:text-primary/80 transition-colors p-2 -mr-2" aria-label={`Read ${post.title}`}>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* Load More (Fake) */}
      <div className="flex justify-center pt-8">
        <button className="rounded-xl border border-neutral-300 bg-white px-8 py-3 text-sm font-semibold text-text-brown hover:bg-neutral-50 hover:border-primary hover:text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/50">
          Load More Articles
        </button>
      </div>
    </div>
  );
}
