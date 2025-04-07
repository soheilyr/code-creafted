"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CodePatternBackground from "./CodePatternBackground";

export default function HeroSection() {
  return (
    <section className="bg-[#212a3e] relative text-[#f1f6f9] py-24 px-6">
      <CodePatternBackground />
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Creating Solutions
          <br className="hidden md:block" />
          <span className="text-[#ff7e29]">One Time at a Time</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-[#cbd5e1]">
          A programming blog built by developers, for developers. Read, learn,
          and grow with practical coding insights.
        </p>
        <Link href="/blogs">
          <Button
            size="lg"
            className="bg-[#394867] cursor-pointer group hover:bg-[#2f3c58] text-[#f1f6f9] transform transition-all duration-300  hover:shadow-lg"
          >
            Explore Blogs{" "}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
      {/* SVG Shape at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-[80px]"
          preserveAspectRatio="none"
        >
          <path
            fill="#f1f6f9"
            d="M0,224L48,202.7C96,181,192,139,288,149.3C384,160,480,224,576,224C672,224,768,160,864,160C960,160,1056,224,1152,234.7C1248,245,1344,203,1392,181.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}
