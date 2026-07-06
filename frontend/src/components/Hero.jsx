import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import hero1 from "../assets/hero1.jpeg";
import hero2 from "../assets/hero2.jpeg";
import hero3 from "../assets/hero3.jpeg";

// Campaign Slide Configurations
const SLIDES = [
  {
    id: 1,
    image: hero1,
    campaign: "01 / TIMELESS GOLD",
    label: "01 — 03",
    title: {
      line1: "Jewellery That",
      line2: "Tells Your",
      highlight: "Story"
    },
    description: "Timeless designs. Everyday elegance. Made to be cherished, always.",
    cta: "Discover the Collection",
    theme: "midnight",
    textColor: "text-luxury-ivory",
    accentColor: "text-luxury-gold",
    buttonClass: "bg-[#C9A54B] text-white hover:bg-[#B08F3E] shadow-[0_4px_20px_rgba(201,165,75,0.15)]",
    desktopPosition: "center center",
    mobilePosition: "center 25%"
  },
  {
    id: 2,
    image: hero2,
    campaign: "02 / MIDNIGHT COLLECTION",
    label: "02 — 03",
    title: {
      line1: "Crafted for",
      line2: "Moments That",
      highlight: "Matter"
    },
    description: "From subtle minimalism to statement pieces — find what speaks to you.",
    cta: "Explore Fine Jewellery",
    theme: "midnight",
    textColor: "text-luxury-ivory",
    accentColor: "text-luxury-gold-light",
    buttonClass: "bg-[#DFCA85] text-[#2E241C] hover:bg-[#C9A54B] hover:text-white shadow-[0_4px_20px_rgba(223,202,133,0.1)]",
    desktopPosition: "center center",
    mobilePosition: "center 30%"
  },
  {
    id: 3,
    image: hero3,
    campaign: "03 / WEDDING COLLECTION",
    label: "03 — 03",
    title: {
      line1: "Designed to",
      line2: "Shine, Made",
      highlight: "Last"
    },
    description: "Waterproof. Hypoallergenic. Handcrafted heirloom pieces made for real life, every day.",
    cta: "Find Your Signature",
    theme: "wedding",
    textColor: "text-luxury-brown",
    accentColor: "text-luxury-gold-dark",
    buttonClass: "bg-[#2E241C] text-white hover:bg-[#C9A54B] shadow-[0_4px_20px_rgba(46,36,28,0.12)]",
    desktopPosition: "right top",
    mobilePosition: "center 20%"
  }
];

const DESKTOP_OVERLAYS = [
  `linear-gradient(
    90deg,
    rgba(10,10,10,.92) 0%,
    rgba(10,10,10,.78) 40%,
    rgba(10,10,10,.35) 75%,
    transparent 95%
  )`,

  `linear-gradient(
    90deg,
    rgba(10,10,10,.92) 0%,
    rgba(10,10,10,.78) 40%,
    rgba(10,10,10,.35) 75%,
    transparent 95%
  )`,

  `linear-gradient(
    90deg,
    rgba(225,214,198,.78) 0%,
    rgba(231,221,206,.58) 28%,
    rgba(241,235,226,.22) 60%,
    transparent 82%
  )`,
];

const MOBILE_OVERLAYS = [
  `linear-gradient(
    180deg,
    rgba(0,0,0,.18) 0%,
    rgba(0,0,0,.28) 35%,
    rgba(0,0,0,.72) 100%
  )`,

  `linear-gradient(
    180deg,
    rgba(0,0,0,.18) 0%,
    rgba(0,0,0,.28) 35%,
    rgba(0,0,0,.72) 100%
  )`,

  `radial-gradient(
circle at 22% 42%,
rgba(0,0,0,.45) 0%,
rgba(0,0,0,.20) 35%,
transparent 65%
),
linear-gradient(
180deg,
rgba(0,0,0,.38) 0%,
rgba(0,0,0,.52) 30%,
rgba(0,0,0,.72) 60%,
rgba(0,0,0,.92) 100%
)`,
];

const AUTOPLAY_TIME = 7000; // 7 seconds

// Noise overlay component mimicking premium paper texture
const NoiseOverlay = ({ opacity = 0.018 }) => (
  <div
    className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20 z-10"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${opacity}'/%3E%3C/svg%3E")`
    }}
  />
);

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mobile swipe gesture tracking
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const current = SLIDES[currentSlide];

  // Carousel autoplay timer logic (runs continuously without pausing on hover)
  useEffect(() => {
    const startTime = Date.now() - (progress / 100) * AUTOPLAY_TIME;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / AUTOPLAY_TIME) * 100, 100);

      if (newProgress >= 100) {
        setProgress(0);
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      } else {
        setProgress(newProgress);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [currentSlide, progress]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNext = () => {
    setProgress(0);
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  // Mouse move handler for premium parallax effect
  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left - width / 2) / (width / 2); // -1 to 1
    const y = (clientY - top - height / 2) / (height / 2); // -1 to 1
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Mobile touch swipe gesture handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  // Framer Motion Animation Variants (with Luxury Blur Transition)
  const textVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
    exit: {
      opacity: 0,
      y: -10,
      filter: "blur(2px)",
      transition: { duration: 0.4, ease: "easeIn" }
    }
  };

  const dividerVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 0.8, ease: "easeInOut" }
    },
    exit: {
      scaleX: 0,
      transition: { duration: 0.4, ease: "easeIn" }
    }
  };

  return (
    <>
      {/* DESKTOP HERO SECTION (Full-Bleed Editorial Layout) */}
      <section
        className="hidden lg:block relative w-full h-[calc(100dvh-190px)] min-h-[520px] max-h-[760px] overflow-hidden select-none bg-luxury-ivory"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Image Carousel (GPU Crossfade & Ken Burns) */}
        <div className="absolute inset-0 w-full h-full z-0">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Parallax Wrapper */}
              <motion.div
                className="w-full h-full relative"
                animate={{
                  x: mousePosition.x * 15,
                  y: mousePosition.y * 15
                }}
                transition={{ type: "spring", stiffness: 60, damping: 20 }}
              >
                <motion.img
                  src={current.image}
                  alt="Luxury Editorial Campaign"
                  className={`absolute object-cover select-none pointer-events-none ${current.imageClassDesktop || "inset-0 w-[105%] h-[105%] -m-[2.5%]"}`}
                  style={{
                    objectPosition: current.desktopPosition,
                 
filter:
"contrast(1.08) saturate(1.06) brightness(0.98)"
                  }}
                  initial={{ scale: 1.00, rotateY: current.flip ? 180 : 0 }}
                  animate={{ scale: 1.03, rotateY: current.flip ? 180 : 0 }}
                  transition={{ duration: 7, ease: "linear" }}
                />
              </motion.div>

              {/* Natural Sunlight & Subtle Vignette Layer */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-40"
                style={{
                  background: "radial-gradient(circle at 70% 20%, rgba(255,247,233,0.08), transparent 65%)",
                  mixBlendMode: "soft-light"
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Editorial Text Overlay & Vignette (Left to Right Gradient) */}
        <div
          className={`absolute inset-y-0 left-0 z-10 pointer-events-none transition-all duration-700 ease-in-out ${current.theme === 'midnight' ? 'w-[55%]' : 'w-[40%]'}`}
          style={{
            background: DESKTOP_OVERLAYS[currentSlide]
          }}
        />

        {/* Noise overlay */}
        <NoiseOverlay opacity={current.theme === "wedding" ? 0.012 : 0.018} />

        {/* Editorial Content Container */}
        <div className="absolute inset-0 z-20 max-w-[1600px] mx-auto px-16 xl:px-24 flex items-center">
          <div className="w-[42%] h-full flex flex-col justify-between pt-12 pb-10 text-left pointer-events-auto">
            
            {/* Top Campaign Label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className={`text-[11px] xl:text-xs tracking-[0.3em] font-medium uppercase ${
                  current.theme === "midnight" ? "text-luxury-gold-light/95" : "text-luxury-gray"
                }`}
              >
                {current.campaign}
              </motion.div>
            </AnimatePresence>

            {/* Middle Block (Heading + Divider + Description + CTA) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
                  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                }}
                className={`flex flex-col text-left ${
                  current.theme === "midnight" ? "text-white" : "text-luxury-brown"
                }`}
              >
                {/* Heading with Negative tracking & refined line height */}
                <motion.h1
                  variants={textVariants}
                  className={`text-[48px] lg:text-[56px] xl:text-[66px] 2xl:text-[74px] font-serif leading-[1.05] font-light tracking-[-0.03em] ${current.theme === 'midnight' ? 'drop-shadow-lg' : ''}`}
                >
                  {current.title.line1}
                  <br />
                  {current.title.line2}
                  <br />
                  <span className="text-[#C9A54B] italic font-serif font-normal block mt-1">
                    {current.title.highlight}
                  </span>
                </motion.h1>

                {/* Luxury Divider */}
                <motion.div
                  variants={dividerVariants}
                  className="flex items-center gap-3 origin-left mt-5 mb-5 py-0.5"
                >
                  <div className="w-12 h-[1px] bg-[#C9A54B]/40" />
                  <span className="text-[#C9A54B] text-[10px] tracking-widest">✦</span>
                  <div className="w-12 h-[1px] bg-[#C9A54B]/40" />
                </motion.div>

                {/* Description - narrower max width & generous line spacing */}
                <motion.p
                  variants={textVariants}
                  className={`text-sm xl:text-[15px] font-light leading-[1.7] max-w-[340px] xl:max-w-[360px] ${
                    current.theme === "midnight" ? "text-luxury-ivory/85 drop-shadow-md" : "text-luxury-brown/80"
                  }`}
                >
                  {current.description}
                </motion.p>

                {/* CTA Button with soft shadows & gentle hover lift */}
                <motion.div variants={textVariants} className="mt-6 xl:mt-8">
                  <button
                    onClick={() => navigate('/shop')}
                    className={`group relative overflow-hidden inline-flex items-center gap-5 py-4 px-10 rounded-full uppercase tracking-[0.18em] text-[11px] font-medium transition-all duration-300 focus:outline-none cursor-pointer hover:-translate-y-[2px] ${current.buttonClass}`}
                  >
                    {current.cta}
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
                      →
                    </span>
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Carousel Controls & Hairline Progress Line */}
            <div className="flex items-center justify-between border-t border-luxury-beige/20 pt-6">
              <button
                onClick={handlePrev}
                className={`text-[10px] tracking-[0.2em] uppercase font-light transition-opacity focus:outline-none cursor-pointer ${
                  current.theme === "midnight" ? "text-white/60 hover:text-white" : "text-luxury-brown/60 hover:text-luxury-brown"
                }`}
              >
                ← Previous
              </button>

              <div className="flex items-center gap-4 px-4 flex-1">
                <span className={`text-[11px] font-light tracking-widest opacity-85 ${
                  current.theme === "midnight" ? "text-white" : "text-luxury-brown"
                }`}>
                  {String(currentSlide + 1).padStart(2, "0")}
                </span>

                {/* Hairline Progress Bar */}
                <div
                  className={`relative h-[1px] flex-1 overflow-hidden ${
                    current.theme === "midnight" ? "bg-white/10" : "bg-luxury-brown/10"
                  }`}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-[#C9A54B] transition-transform duration-100 ease-linear origin-left"
                    style={{ transform: `scaleX(${progress / 100})`, width: "100%" }}
                  />
                </div>

                <span className={`text-[11px] font-light tracking-widest opacity-40 ${
                  current.theme === "midnight" ? "text-white" : "text-luxury-brown"
                }`}>
                  03
                </span>
              </div>

              <button
                onClick={handleNext}
                className={`text-[10px] tracking-[0.2em] uppercase font-light transition-opacity focus:outline-none cursor-pointer ${
                  current.theme === "midnight" ? "text-white/60 hover:text-white" : "text-luxury-brown/60 hover:text-luxury-brown"
                }`}
              >
                Next →
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* MOBILE HERO SECTION (Full-Bleed Editorial Layout) */}
      <section
        className="block lg:hidden relative w-full h-[calc(100vh-72px)] xl:h-[calc(100dvh-72px)] overflow-hidden select-none bg-luxury-brown"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Ken Burns Image */}
            <motion.img
              src={current.image}
              alt="Mobile Campaign Editorial"
              className={`absolute object-cover select-none pointer-events-none ${current.imageClassMobile || "inset-0 w-full h-full"}`}
              style={{
                objectPosition: current.mobilePosition,
                filter: "contrast(1.03) saturate(0.96) brightness(0.99)"
              }}
              initial={{ scale: 1.00, rotateY: current.flip ? 180 : 0 }}
              animate={{ scale: 1.03, rotateY: current.flip ? 180 : 0 }}
              transition={{ duration: 7, ease: "linear" }}
            />

            {/* Dark gradient overlay for text contrast (WCAG AA) */}
           <div
className="absolute inset-0 z-10"
style={{
background: MOBILE_OVERLAYS[currentSlide]
}}
/>

            {/* Noise Overlay */}
            <NoiseOverlay opacity={0.015} />

            {/* Full-screen Distributed Content Container */}
            <div className="absolute inset-0 px-8 pt-10 pb-8 z-20 text-white flex flex-col justify-between text-left">
              
              {/* 1. TOP ZONE: Campaign Label & Counter */}
              <div className="flex justify-between items-center w-full">
                <span className="text-[10px] tracking-[0.25em] font-medium text-luxury-gold uppercase">
                  {current.campaign}
                </span>
                <span className="text-[11px] font-light tracking-widest opacity-60">
                  {current.label}
                </span>
              </div>

              {/* 2. MIDDLE ZONE: Editorial Copy & CTA (Centered vertically in remaining space) */}
              <div className="flex flex-col justify-center flex-1 py-8 my-auto">
                <h1 className="text-[36px] sm:text-[40px] xl:text-[44px] font-serif leading-[1.1] font-light tracking-[-0.02em] text-[#FCF9F5]">
                  {current.title.line1} {current.title.line2}
                  <span className="text-[#C9A54B] italic font-serif font-normal block mt-1">
                    {current.title.highlight}
                  </span>
                </h1>

                <p className="text-[14px] font-light leading-relaxed mt-4 text-[#FCF9F5]/75 max-w-xs">
                  {current.description}
                </p>

                <div className="mt-8">
                  <button
                    onClick={() => navigate('/shop')}
                    className="w-full h-[52px] bg-[#C9A54B] text-white hover:bg-[#B08F3E] rounded-full uppercase tracking-[0.18em] text-[11px] font-semibold transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer"
                    style={{ minHeight: "44px" }}
                  >
                    {current.cta}
                  </button>
                </div>
              </div>

              {/* 3. BOTTOM ZONE: Progress & Trust Badges */}
              <div className="w-full">
                {/* Progress Line */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-light tracking-widest opacity-70">
                    {String(currentSlide + 1).padStart(2, "0")}
                  </span>
                  
                  <div className="relative h-[1px] bg-white/20 flex-1 overflow-hidden">
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-[#C9A54B] transition-transform duration-100 ease-linear origin-left"
                      style={{ transform: `scaleX(${progress / 100})`, width: "100%" }}
                    />
                  </div>
                  
                  <span className="text-[10px] font-light tracking-widest opacity-40">
                    03
                  </span>
                </div>

                <div className="w-full h-[1px] bg-white/10 my-4" />

                {/* 2x2 Trust Badges */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[10px] tracking-[0.15em] uppercase font-light text-white/90">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-[#C9A54B] stroke-[1.2] flex-shrink-0">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="m9 11 2 2 4-4" />
                    </svg>
                    <span className="truncate">18K Gold Vermeil</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-[#C9A54B] stroke-[1.2] flex-shrink-0">
                      <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" />
                    </svg>
                    <span className="truncate">Anti Tarnish</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-[#C9A54B] stroke-[1.2] flex-shrink-0">
                      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                      <line x1="16" y1="8" x2="2" y2="22" />
                    </svg>
                    <span className="truncate">Hypoallergenic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-[#C9A54B] stroke-[1.2] flex-shrink-0">
                      <rect x="2" y="5" width="13" height="12" rx="1" />
                      <path d="M15 8h4.5l2.5 3v6h-7" />
                      <circle cx="6" cy="18" r="2" />
                      <circle cx="17" cy="18" r="2" />
                    </svg>
                    <span className="truncate">Free Shipping</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ULTRA-MINIMAL TRUST BAR (Below Hero - Desktop Only) */}
      <section className="hidden lg:block bg-luxury-ivory border-t border-b border-luxury-beige/30 py-10 sm:py-12 relative z-10 select-none">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            
            {/* Column 1: Gold vermeil */}
            <div className="flex items-center gap-3.5 w-full md:w-auto justify-center md:justify-start">
              <div className="text-[#C9A54B] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.1]">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 11 2 2 4-4" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="text-sm tracking-widest font-bold uppercase text-[#2E241C]">
                  18K Gold Vermeil
                </h4>
                <p className="text-xs font-medium text-[#4A433E] tracking-wider mt-1">
                  Premium thick gold plating.
                </p>
              </div>
            </div>

            {/* Thin vertical separator */}
            <div className="hidden md:block h-7 w-px bg-luxury-beige-dark/50" />

            {/* Column 2: Anti tarnish */}
            <div className="flex items-center gap-3.5 w-full md:w-auto justify-center md:justify-start">
              <div className="text-[#C9A54B] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.1]">
                  <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="text-sm tracking-widest font-bold uppercase text-[#2E241C]">
                  Anti Tarnish
                </h4>
                <p className="text-xs font-medium text-[#4A433E] tracking-wider mt-1">
                  Water-resistant & daily wear.
                </p>
              </div>
            </div>

            {/* Thin vertical separator */}
            <div className="hidden md:block h-7 w-px bg-luxury-beige-dark/50" />

            {/* Column 3: Hypoallergenic */}
            <div className="flex items-center gap-3.5 w-full md:w-auto justify-center md:justify-start">
              <div className="text-[#C9A54B] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.1]">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                  <line x1="16" y1="8" x2="2" y2="22" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="text-sm tracking-widest font-bold uppercase text-[#2E241C]">
                  Hypoallergenic
                </h4>
                <p className="text-xs font-medium text-[#4A433E] tracking-wider mt-1">
                  Safe for sensitive skin.
                </p>
              </div>
            </div>

            {/* Thin vertical separator */}
            <div className="hidden md:block h-7 w-px bg-luxury-beige-dark/50" />

            {/* Column 4: Free delivery */}
            <div className="flex items-center gap-3.5 w-full md:w-auto justify-center md:justify-start">
              <div className="text-[#C9A54B] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.1]">
                  <rect x="2" y="5" width="13" height="12" rx="1" />
                  <path d="M15 8h4.5l2.5 3v6h-7" />
                  <circle cx="6" cy="18" r="2" />
                  <circle cx="17" cy="18" r="2" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="text-sm tracking-widest font-bold uppercase text-[#2E241C]">
                  Free Delivery In India
                </h4>
                <p className="text-xs font-medium text-[#4A433E] tracking-wider mt-1">
                  Complimentary tracked shipping.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;