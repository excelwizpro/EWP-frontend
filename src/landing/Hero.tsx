"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

const rotatingWords = ["Tables", "Pivots", "Charts", "KPIs", "Formulas"];

export function Hero() {
  const [index, setIndex] = useState(0);

  // --- Rotate headline words every 2.5s ---
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // --- Mouse pointer parallax values ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const layer1 = {
    x: useTransform(mouseX, [0, 1], ["-12px", "12px"]),
    y: useTransform(mouseY, [0, 1], ["-12px", "12px"]),
  };
  const layer2 = {
    x: useTransform(mouseX, [0, 1], ["-25px", "25px"]),
    y: useTransform(mouseY, [0, 1], ["-25px", "25px"]),
  };

  const handleMouseMove = (e: any) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-white pb-32 pt-40 text-center"
    >
      {/* ************* PARALLAX BACKGROUND LAYERS ************* */}

      {/* Soft radiant glow */}
      <motion.div
        style={layer1}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px]
        -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-soft blur-3xl opacity-40"
      />

      {/* Excel hologram grid */}
      <motion.div
        style={layer2}
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#0000_95%,#0002_100%),linear-gradient(90deg,#0000_95%,#0002_100%)] bg-[length:24px_24px]" />
      </motion.div>

      {/* Floating semantic tokens */}
      {["intent", "measure", "filter", "groupBy", "time", "limit"].map(
        (word, i) => (
          <motion.div
            key={word}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 0.65, y: [-10, 10, -10], scale: 1 }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute text-[11px] font-semibold text-slate-600"
            style={{
              top: `${20 + i * 10}%`,
              left: `${10 + (i % 3) * 30}%`,
            }}
          >
            <div className="rounded-full bg-white/70 px-2 py-1 shadow-sm backdrop-blur">
              {word}
            </div>
          </motion.div>
        )
      )}

      {/* ************* MAIN HERO CONTENT ************* */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative mx-auto max-w-4xl px-6"
      >
        {/* Dynamic headline */}
        <motion.h1
          key={index}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mx-auto max-w-4xl bg-gradient-to-r from-slate-900 via-brand-dark to-slate-900 bg-clip-text text-transparent text-6xl font-extrabold md:text-7xl leading-[1.1]"
        >
          MTM-8 builds  
          <span className="block text-brand-dark">{rotatingWords[index]}</span>
          from language alone.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-600"
        >
          The first semantic reporting engine that understands your intent,
          detects workbook structure, resolves regions, and compiles into
          a complete IR — automatically.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="mt-10 flex justify-center gap-4"
        >
          <motion.a
            href="/app"
            whileHover={{ scale: 1.08, boxShadow: "0 0 25px rgba(37,99,235,0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl bg-brand px-8 py-3.5 text-lg font-semibold text-white shadow-md hover:bg-brand-dark transition"
          >
            Launch MTM-8 →
          </motion.a>

          <motion.a
            href="#features"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl border border-slate-300 px-8 py-3.5 text-lg font-semibold text-slate-700 hover:bg-slate-50"
          >
            Explore features
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
