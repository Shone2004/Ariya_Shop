import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

// Local Image Imports
import miniImg from "../assets/collections/minii.jpeg";
import eleganceImg from "../assets/collections/elegance.jpeg";
import partyImg from "../assets/collections/party.jpeg";
import offImg from "../assets/collections/off.jpeg";
import everyImg from "../assets/collections/every.jpeg";

const moods = [
  {
    id: 1,
    title: "Minimal",
    subtitle: "Less is more",
    description: "Clean lines, subtle elegance",
    itemCount: "24 Pieces",
    image: miniImg,
    color: "from-amber-950/90 via-amber-900/50 to-amber-950/20",
    bgColor: "bg-amber-950",
  },
  {
    id: 2,
    title: "Elegant",
    subtitle: "Timeless grace",
    description: "Refined pieces for special moments",
    itemCount: "32 Pieces",
    image: eleganceImg,
    color: "from-rose-955/90 via-rose-900/50 to-rose-955/20",
    bgColor: "bg-rose-950",
  },
  {
    id: 3,
    title: "Party",
    subtitle: "Shine bright",
    description: "Statement pieces that dazzle",
    itemCount: "18 Pieces",
    image: partyImg,
    color: "from-purple-950/95 via-purple-900/60 to-[#1f1625]/20",
    bgColor: "bg-[#1f1625]", 
  },
  {
    id: 4,
    title: "Office",
    subtitle: "Power dressing",
    description: "Sophisticated & professional",
    itemCount: "28 Pieces",
    image: offImg,
    color: "from-slate-950/90 via-slate-900/50 to-slate-955/20",
    bgColor: "bg-slate-950",
  },
  {
    id: 5,
    title: "Everyday",
    subtitle: "Daily essentials",
    description: "Effortless beauty for every day",
    itemCount: "42 Pieces",
    image: everyImg,
    color: "from-emerald-955/90 via-emerald-900/50 to-emerald-955/20",
    bgColor: "bg-emerald-950",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 16 },
  },
};

const MoodCard = ({ mood, isMiddleRow }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Layout for Cinematic Middle Card
  if (isMiddleRow) {
    return (
      <a href="/shop" className="block w-full h-full">
        <motion.div
          variants={cardVariants}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative overflow-hidden rounded-[2rem] cursor-pointer w-full h-full min-h-[550px] lg:min-h-[600px] shadow-lg "
        >
          {/* Background Image - Centered and Contained Perfectly */}
          <motion.img
            src={mood.image}
            alt={mood.title}
            loading="lazy"
            animate={{ scale: isHovered ? 1.06 : 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Dark Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${mood.color} opacity-85 z-10`} />

          {/* Pieces Badge */}
          <div className="absolute top-8 right-8 z-30">
            <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/20">
              {mood.itemCount}
            </span>
          </div>

          {/* Text Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 select-none">
            <div>
              <span className="text-[#e8b54a] text-xs font-semibold uppercase tracking-[0.3em] block mb-1">
                {mood.subtitle}
              </span>

              <h3 className="text-4xl lg:text-5xl font-serif text-white tracking-wide">
                {mood.title}
              </h3>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                isHovered ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0 pointer-events-none"
              }`}
            >
              <p className="text-white/80 text-sm font-light max-w-xs leading-relaxed mb-4">
                {mood.description}
              </p>

              <div className="inline-flex items-center gap-2 bg-[#be8b2d] hover:bg-[#d19a32] text-white px-5 py-2.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all shadow-md">
                Explore Collection
                <FaArrowRight className="text-[8px]" />
              </div>
            </div>

            <div className="w-10 h-[1.5px] bg-[#be8b2d] mt-5 group-hover:w-20 transition-all duration-300" />
          </div>
        </motion.div>
      </a>
    );
  }

  // Layout for Standard Split Rows (Cards 1, 2, 4, 5) stretched dynamically
  return (
    <a href="/shop" className="block w-full h-full">
      <motion.div
        variants={cardVariants}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative overflow-hidden rounded-[2rem] cursor-pointer w-full h-full min-h-[265px] lg:min-h-[285px] shadow-md  ${mood.bgColor}`}
      >
        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
          <motion.img
            src={mood.image}
            alt={mood.title}
            loading="lazy"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className={`absolute inset-0 bg-gradient-to-t ${mood.color} to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500 z-10`} />

        <div className="absolute top-6 right-6 z-20">
          <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded-full border border-white/15">
            {mood.itemCount}
          </span>
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-8 z-20 select-none">
          <div>
            <span className="text-[#e8b54a] text-[10px] font-semibold uppercase tracking-[0.25em] block mb-1">
              {mood.subtitle}
            </span>
            <h3 className="text-2xl font-serif text-white font-light tracking-wide leading-tight">
              {mood.title}
            </h3>
          </div>

          <div className={`transition-all duration-300 ease-out flex flex-col overflow-hidden ${
            isHovered ? "opacity-100 max-h-28 mt-3 transform translate-y-0" : "opacity-0 max-h-0 mt-0 transform translate-y-2 pointer-events-none"
          }`}>
            <p className="text-white/70 text-xs font-light max-w-xs leading-relaxed">
              {mood.description}
            </p>
            <div className="mt-3">
              <div className="group/btn inline-flex items-center gap-2 bg-white/10 hover:bg-[#be8b2d] backdrop-blur-md text-white text-[9px] font-semibold uppercase tracking-widest px-4 py-2 rounded-full border border-white/20 hover:border-[#be8b2d] transition-all duration-300 shadow-md">
                <span>Explore Collection</span>
                <FaArrowRight className="text-[7px]" />
              </div>
            </div>
          </div>

          <div className="w-8 h-[1.5px] bg-gradient-to-r from-[#be8b2d] to-[#e8b54a] mt-4 rounded-full group-hover:w-14 transition-all duration-300" />
        </div>
      </motion.div>
    </a>
  );
};

// Main Component
const ShopByMood = () => {
  return (
    <section className="py-24 bg-[#fffaf6] text-[#222222] overflow-hidden relative w-full">
      {/* Gold Shimmer Grainy Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />
      {/* Gold Tint for the Texture */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#be8b2d]/15 via-[#e8b54a]/20 to-[#be8b2d]/15 mix-blend-overlay" />

      {/* Main Structural Centering Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="text-md uppercase tracking-[0.3em] font-bold text-[#be8b2d] block mb-3">
            Find Your Vibe
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#222222]">
            Shop By Mood
          </h2>
          <div className="flex items-center justify-center gap-2 my-5">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#be8b2d]/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#be8b2d]" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#be8b2d]/60" />
          </div>

          <p className="text-[#333333] text-base font-bold leading-relaxed relative py-2" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 60' preserveAspectRatio='none'%3E%3Cfilter id='brush'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.5' numOctaves='3' result='noise'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='noise' scale='12' xChannelSelector='R' yChannelSelector='G'/%3E%3C/filter%3E%3Cpath d='M15 15 Q 200 5 385 15 L380 45 Q 200 55 15 45 Z' fill='%23f4d160' opacity='0.45' filter='url(%23brush)'/%3E%3C/svg%3E")`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}>
            Whether you're dressing for a boardroom or a ballroom, find jewelry
            that matches your energy and elevates your style.
          </p>
        </motion.div>

        {/* Desktop Layout Track - Balanced & Centered Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="hidden lg:grid lg:grid-cols-[1.2fr_1fr_1.2fr] gap-8 items-stretch w-full"
        >
          {/* Left Column */}
          <div className="flex flex-col gap-8 overflow-hidden border-0 outline-none justify-between w-full h-full">
            <div className="flex-1 w-full">
              <MoodCard mood={moods[0]} />
            </div>
            <div className="flex-1 w-full">
              <MoodCard mood={moods[3]} />
            </div>
          </div>

          {/* Center Column */}
          <div className="w-full h-full flex">
            <MoodCard mood={moods[2]} isMiddleRow />
          </div>

          {/* Right Column */}
          <div className="flex flex-col overflow-hidden gap-8 border-0 outline-none justify-between w-full h-full">
            <div className="flex-1 w-full">
              <MoodCard mood={moods[1]} />
            </div>
            <div className="flex-1 w-full">
              <MoodCard mood={moods[4]} />
            </div>
          </div>
        </motion.div>

        {/* Mobile & Tablet Responsive Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:hidden grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {moods.map((mood, idx) => (
            <div key={mood.id} className="w-full">
              <MoodCard mood={mood} isMiddleRow={idx === 2} />
            </div>
          ))}
        </motion.div>

        {/* Bottom CTA Element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <a
            href="/shop"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-[#be8b2d] bg-[#be8b2d] text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-transparent hover:text-[#be8b2d] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span>View All Collections</span>
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </a>
          <p className="text-sm text-[#222222] font-bold mt-4 tracking-wide">
            Over 180+ handcrafted designs across all moods
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopByMood;