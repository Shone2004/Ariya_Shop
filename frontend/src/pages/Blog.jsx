import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiChevronRight,
  FiArrowRight,
  FiClock,
  FiUser,
  FiTag,
  FiSearch,
} from "react-icons/fi";

// ─── Mock Blog Data ─────────────────────────────────────────────────────────
// Shape mirrors what a real CMS / API would return — swap later with live data.
const CATEGORIES = ["All", "Style Tips", "Care Guide", "Trends", "Behind the Brand", "Gifting"];

const POSTS = [
  {
    id: 1,
    slug: "how-to-layer-necklaces",
    category: "Style Tips",
    title: "How to Layer Necklaces Like a Pro",
    excerpt:
      "Layering necklaces is an art form. Learn the golden rules of mixing lengths, textures, and metals to build a stack that feels effortlessly intentional.",
    image: "/Crystal-ribbon-brooch-Model_1.png",
    author: "Gunjan Ariya",
    date: "June 18, 2026",
    readTime: "4 min read",
    featured: true,
  },
  {
    id: 2,
    slug: "caring-for-gold-plated-jewellery",
    category: "Care Guide",
    title: "Caring for Your Gold-Plated Jewellery",
    excerpt:
      "Gold-plated pieces can last years with the right care. We share the simple daily habits that keep your AriyaShop jewellery looking brand new.",
    image: "/Pearl-Heart-Bracelet-Model.png",
    author: "Gunjan Ariya",
    date: "June 10, 2026",
    readTime: "5 min read",
    featured: false,
  },
  {
    id: 3,
    slug: "wedding-season-jewellery-trends-2026",
    category: "Trends",
    title: "Wedding Season Jewellery Trends 2026",
    excerpt:
      "From statement maang tikkas to delicate stackable bangles, we break down the jewellery looks dominating Indian weddings this season.",
    image: "/Regelia-royale-bangles-Model_2.png",
    author: "Priya Nair",
    date: "May 28, 2026",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 4,
    slug: "the-story-behind-ariyashop",
    category: "Behind the Brand",
    title: "The Story Behind AriyaShop",
    excerpt:
      "What starts as a passion for beautiful things becomes a brand. Our founder shares the honest, unfiltered story of how AriyaShop came to life.",
    image: "/Love-Charm-Bracelet-Model.png",
    author: "Gunjan Ariya",
    date: "May 15, 2026",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 5,
    slug: "jewellery-gifting-guide",
    category: "Gifting",
    title: "The Ultimate Jewellery Gifting Guide",
    excerpt:
      "Never second-guess a jewellery gift again. Whether it's for a birthday, anniversary, or festive occasion — this guide has you covered.",
    image: "/jewellery-gift-box.png",
    author: "Priya Nair",
    date: "May 2, 2026",
    readTime: "5 min read",
    featured: false,
  },
  {
    id: 6,
    slug: "minimalist-jewellery-everyday",
    category: "Style Tips",
    title: "Minimalist Jewellery for Every Day",
    excerpt:
      "Less is more — especially when it comes to demi-fine jewellery. Here are our top everyday picks that go from desk to dinner without missing a beat.",
    image: "/Crystal-ribbon-brooch-Model_1.png",
    author: "Gunjan Ariya",
    date: "April 22, 2026",
    readTime: "3 min read",
    featured: false,
  },
  {
    id: 7,
    slug: "silver-vs-gold-which-suits-you",
    category: "Style Tips",
    title: "Silver vs Gold: Which Metal Suits You?",
    excerpt:
      "The age-old debate, finally answered. We look at skin tone, personal style, and occasion to help you find your signature metal.",
    image: "/jewellery-flatlay.png",
    author: "Priya Nair",
    date: "April 10, 2026",
    readTime: "4 min read",
    featured: false,
  },
  {
    id: 8,
    slug: "storage-tips-for-jewellery",
    category: "Care Guide",
    title: "10 Smart Ways to Store Your Jewellery",
    excerpt:
      "Tangled chains and tarnished earrings are a thing of the past. These clever storage ideas will keep your collection organised and pristine.",
    image: "/Pearl-Heart-Bracelet-Model.png",
    author: "Gunjan Ariya",
    date: "March 28, 2026",
    readTime: "4 min read",
    featured: false,
  },
];

// ─── Animation Variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Sub-components ──────────────────────────────────────────────────────────
const CategoryPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-semibold border transition-all duration-300 whitespace-nowrap ${
      active
        ? "bg-[#C79A2E] border-[#C79A2E] text-white"
        : "border-luxury-beige text-luxury-brown/70 hover:border-[#C79A2E] hover:text-[#C79A2E]"
    }`}
  >
    {label}
  </button>
);

const PostCard = ({ post, index }) => (
  <motion.article
    custom={index}
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.15 }}
    className="group flex flex-col bg-white border border-luxury-beige/40 rounded-xl overflow-hidden hover:shadow-[0_18px_40px_-12px_rgba(44,28,16,0.18)] transition-shadow duration-400"
  >
    {/* Image */}
    <Link to={`/blog/${post.slug}`} className="block overflow-hidden aspect-[16/10]">
      <img
        src={post.image}
        alt={post.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </Link>

    {/* Body */}
    <div className="flex flex-col flex-1 p-5 sm:p-6">
      {/* Category */}
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#C79A2E] mb-3">
        <FiTag className="w-3 h-3" />
        {post.category}
      </span>

      {/* Title */}
      <Link to={`/blog/${post.slug}`}>
        <h3 className="font-serif text-lg sm:text-xl text-luxury-brown font-normal leading-snug mb-2 group-hover:text-[#C79A2E] transition-colors duration-300">
          {post.title}
        </h3>
      </Link>

      {/* Excerpt */}
      <p className="text-xs sm:text-[13px] text-luxury-brown/70 font-light leading-relaxed flex-1 mb-4">
        {post.excerpt}
      </p>

      {/* Meta + CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-luxury-beige/40">
        <div className="flex items-center gap-3 text-[10px] text-luxury-gray">
          <span className="flex items-center gap-1">
            <FiUser className="w-3 h-3" />
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <FiClock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        <Link
          to={`/blog/${post.slug}`}
          className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold text-[#C79A2E] hover:gap-2 transition-all duration-300"
        >
          Read <FiArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  </motion.article>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const featured = POSTS.find((p) => p.featured);
  const filtered = POSTS.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch && !p.featured;
  });

  return (
    <div className="min-h-screen bg-[#FCF9F5] text-[#2E241C]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[320px] md:h-[400px] overflow-hidden bg-[#F4EFEA] flex items-center justify-center border-b border-luxury-beige/35">

        {/* Left gold-leaf decoration — same SVG as About.jsx */}
        <div className="absolute left-4 sm:left-10 md:left-16 bottom-0 w-28 sm:w-36 md:w-48 h-auto opacity-25 sm:opacity-45 md:opacity-75 z-10 pointer-events-none select-none">
          <svg viewBox="0 0 120 220" className="w-full h-full text-luxury-gold/65 fill-none stroke-current stroke-[1.2]">
            <path d="M15,210 Q35,140 55,25" />
            <path d="M38,155 C23,145 18,130 28,125 C38,120 43,135 38,155 Z" fill="currentColor" fillOpacity="0.06" />
            <path d="M46,115 C34,105 32,90 42,85 C52,80 56,95 46,115 Z" fill="currentColor" fillOpacity="0.06" />
            <path d="M52,75 C44,65 46,50 56,48 C66,46 66,60 52,75 Z" fill="currentColor" fillOpacity="0.06" />
            <path d="M26,175 C39,180 44,195 34,200 C24,205 19,190 26,175 Z" fill="currentColor" fillOpacity="0.06" />
            <path d="M32,135 C44,140 49,155 39,160 C29,165 24,150 32,135 Z" fill="currentColor" fillOpacity="0.06" />
            <path d="M42,95 C54,100 59,115 49,120 C39,125 34,110 42,95 Z" fill="currentColor" fillOpacity="0.06" />
          </svg>
        </div>

        {/* Right lifestyle image — mirroring About.jsx layout */}
        <div className="absolute right-0 top-0 bottom-0 w-[32%] sm:w-[38%] md:w-[42%] h-full z-0 select-none pointer-events-none">
          <img
            src="/Timeless-spark-studs-Model.png"
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4EFEA] via-[#F4EFEA]/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative max-w-2xl mx-auto px-6 text-center z-20 space-y-4 md:space-y-5">
          {/* Breadcrumb */}
          <nav className="flex justify-center" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-light tracking-widest uppercase">
              <li>
                <Link to="/" className="text-luxury-gray hover:text-luxury-gold transition-colors">
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <FiChevronRight className="w-3.5 h-3.5 mx-1 text-luxury-beige-dark" />
                <span className="text-luxury-gold font-medium">Journal</span>
              </li>
            </ol>
          </nav>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-wide text-luxury-brown">
            The Ariya Journal
          </h1>

          {/* Gold divider */}
          <div className="flex justify-center items-center gap-3">
            <div className="h-[1px] w-10 bg-luxury-gold/40" />
            <span className="text-luxury-gold text-[10px]">✦</span>
            <div className="h-[1px] w-10 bg-luxury-gold/40" />
          </div>

          <p className="text-xs sm:text-sm text-luxury-brown/85 font-light leading-relaxed max-w-xl mx-auto">
            Style stories, care guides, and jewellery wisdom — curated for the
            modern Indian woman who wears her elegance every day.
          </p>
        </div>
      </section>

      {/* ── Featured Post ────────────────────────────────────────────────── */}
      {featured && (
        <section className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
          <div className="flex flex-col items-start mb-6">
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-luxury-gold uppercase">
              Featured Story
            </span>
            <div className="w-8 h-[1.5px] bg-luxury-gold mt-2" />
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-luxury-beige/40 rounded-2xl overflow-hidden hover:shadow-[0_25px_60px_-20px_rgba(44,28,16,0.2)] transition-shadow duration-500"
          >
            {/* Image */}
            <Link to={`/blog/${featured.slug}`} className="block overflow-hidden aspect-[4/3] lg:aspect-auto">
              <img
                src={featured.image}
                alt={featured.title}
                loading="eager"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>

            {/* Content */}
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#C79A2E] mb-4">
                <FiTag className="w-3 h-3" />
                {featured.category}
              </span>

              <Link to={`/blog/${featured.slug}`}>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-tight text-luxury-brown mb-4 group-hover:text-[#C79A2E] transition-colors duration-300">
                  {featured.title}
                </h2>
              </Link>

              <p className="text-sm text-luxury-brown/70 font-light leading-relaxed mb-6">
                {featured.excerpt}
              </p>

              <div className="flex items-center gap-4 text-[11px] text-luxury-gray mb-8">
                <span className="flex items-center gap-1.5">
                  <FiUser className="w-3.5 h-3.5" />
                  {featured.author}
                </span>
                <span className="text-luxury-beige-dark">·</span>
                <span>{featured.date}</span>
                <span className="text-luxury-beige-dark">·</span>
                <span className="flex items-center gap-1.5">
                  <FiClock className="w-3.5 h-3.5" />
                  {featured.readTime}
                </span>
              </div>

              <Link
                to={`/blog/${featured.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white text-[10px] tracking-widest uppercase font-semibold rounded-md transition-all duration-300 w-fit"
              >
                Read Article <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </section>
      )}

      {/* ── Filter Bar ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-luxury-beige/40 pt-8">
          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-56 flex-none">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-luxury-gray pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-luxury-beige/60 rounded-full pl-9 pr-4 py-2 text-xs text-luxury-brown placeholder:text-luxury-gray focus:outline-none focus:border-luxury-gold transition-colors duration-200"
            />
          </div>
        </div>
      </section>

      {/* ── Post Grid ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12 pb-16 sm:pb-20">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-xl text-luxury-brown/50">
              No articles found.
            </p>
            <button
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="mt-4 text-xs text-[#C79A2E] underline underline-offset-4"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── Newsletter CTA ───────────────────────────────────────────────── */}
      <section className="bg-[#F4EFEA] py-12 sm:py-16 border-t border-luxury-beige/35">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="flex justify-center items-center gap-3 mb-2">
              <div className="h-[1px] w-10 bg-luxury-gold/40" />
              <span className="text-luxury-gold text-[10px]">✦</span>
              <div className="h-[1px] w-10 bg-luxury-gold/40" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#2E241C] tracking-wide">
              Stories in Your Inbox
            </h2>
            <p className="text-xs text-luxury-brown/75 font-light leading-relaxed">
              Subscribe to The Ariya Journal and get new stories, styling tips,
              and exclusive offers delivered straight to you.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2 max-w-sm mx-auto pt-2"
            >
              <input
                type="email"
                placeholder="Your email address"
                required
                className="flex-1 border border-luxury-beige rounded-md px-4 py-2.5 text-xs text-luxury-brown placeholder:text-luxury-gray focus:outline-none focus:border-luxury-gold transition-colors bg-white"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2E241C] hover:bg-[#423429] text-white text-[10px] tracking-widest uppercase font-semibold rounded-md transition-all duration-300 flex-none"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;