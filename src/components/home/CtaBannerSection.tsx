import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaBannerSection() {
  return (
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
            <Link
              href="#ai-teaser"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-xl bg-white px-8 py-3.5 font-bold text-primary hover:bg-neutral-50 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Get Started Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}