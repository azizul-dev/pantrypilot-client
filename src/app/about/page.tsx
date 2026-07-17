"use client";

import { motion } from "framer-motion";
import { Users, Target, Heart, ChefHat, Leaf, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-secondary">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&q=80&w=2000"
            alt="Kitchen Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-2xl mb-6"
          >
            <ChefHat className="h-10 w-10 text-primary" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-poppins font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-6"
          >
            Our Mission is <span className="text-primary">Cooking</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed"
          >
            PantryPilot was founded on a simple belief: everyone deserves to eat well, regardless of what's in their fridge.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeUp} className="flex flex-col gap-6">
              <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary">
                The Story Behind PantryPilot
              </h2>
              <div className="flex flex-col gap-4 text-text-brown/70 leading-relaxed">
                <p>
                  It started in a small apartment kitchen. We were hungry, tired, and looking at a fridge that seemed empty. But it wasn't empty—it just lacked inspiration.
                </p>
                <p>
                  We realized that the barrier to cooking a great meal wasn't a lack of ingredients, but a lack of ideas. That's when PantryPilot was born. We combined our passion for food with cutting-edge AI to create a platform that turns your random pantry items into culinary masterpieces.
                </p>
                <p>
                  Today, we're proud to help thousands of home cooks reduce food waste, save money, and discover the joy of cooking every single day.
                </p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=1000"
                alt="Chefs cooking together"
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary mb-4">Our Core Values</h2>
            <p className="text-text-brown/70 max-w-2xl mx-auto">
              Everything we do is guided by these three principles.
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Target,
                title: "Empowerment",
                desc: "We believe anyone can be a great cook with the right guidance and inspiration.",
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                icon: Leaf,
                title: "Sustainability",
                desc: "By helping you use what you have, we actively reduce household food waste.",
                color: "text-accent",
                bg: "bg-accent/10",
              },
              {
                icon: Heart,
                title: "Community",
                desc: "Food brings people together. We're building a supportive platform for sharing and learning.",
                color: "text-secondary",
                bg: "bg-secondary/10",
              },
            ].map((value, idx) => (
              <motion.div key={idx} variants={fadeUp} className="pantry-card flex flex-col items-center text-center">
                <div className={`h-16 w-16 rounded-2xl ${value.bg} flex items-center justify-center mb-6`}>
                  <value.icon className={`h-8 w-8 ${value.color}`} />
                </div>
                <h3 className="font-poppins font-bold text-xl text-secondary mb-3">{value.title}</h3>
                <p className="text-text-brown/70 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="mx-auto max-w-3xl px-4 flex flex-col items-center gap-6">
          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl">Ready to start cooking?</h2>
          <p className="text-white/80 text-lg mb-4">
            Join thousands of home cooks discovering new recipes every day.
          </p>
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-neutral-50 transition-all hover:-translate-y-1 shadow-lg"
          >
            Explore Recipes
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
