"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

export default function HeroSection() {
  return (
    <div className="relative w-full h-screen bg-[#0D0D0F] dark:bg-[#0D0D0F] bg-[#FAFAFA] overflow-hidden transition-colors duration-300">
      {/* Full screen Spline background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <SplineScene 
          scene="https://prod.spline.design/42S6xWJISh-gv0pt/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10"></div>

      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      {/* Content overlay */}
      <div className="relative z-20 h-full flex items-center">
        <div className="w-full">
          <div className="max-w-2xl pl-4 sm:pl-6 md:pl-10 lg:pl-16 xl:pl-24">
            {/* Main heading with enhanced styling */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-6xl font-bold mb-6 font-accent tracking-wider leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-300 block mb-3">
                 CalmVerse 
              </span>
              <span className="text-white/90 text-3xl md:text-4xl lg:text-5xl font-sans font-normal tracking-normal block mt-3">
                Where Stories Come to Life
              </span>
            </motion.h1>

            {/* Description with better spacing */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-neutral-300 max-w-xl mb-10 leading-relaxed font-sans"
            >
              Share your stories, connect with creators, and discover amazing content in a beautiful 3D world. 
              Join the community and let your voice be heard.
            </motion.p>

            {/* CTA Buttons with enhanced styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/register"
                className="relative px-8 py-4 rounded-full font-semibold text-white transition-all overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 animate-gradient-x opacity-80 group-hover:opacity-100"></span>
                <span className="relative bg-black/60 backdrop-blur-sm rounded-full px-8 py-4 block border border-white/20 group-hover:border-white/40 transition-all">
                  Get Started
                </span>
              </Link>
              
              <button className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-semibold hover:border-white hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm">
                Learn More
              </button>
            </motion.div>

            {/* Stats or features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 flex flex-wrap gap-6 text-white/70"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">3D Interactive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Premium Features</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Token Rewards</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
