import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiAward,
  FiShield,
  FiHeart,
  FiStar,
  FiArrowRight,
  FiChevronRight,
  FiPackage,
  FiGift,
  FiFeather
} from "react-icons/fi";

// Custom SEO Hook
import { useSEO } from "../hooks/useSEO";

// Local assets
import founderImg from "../assets/founder.jpg";

// Lightweight GPU-Accelerated Animated Counter Component
const AnimatedCounter = ({ target, duration = 1500, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    const targetNumber = parseInt(target.replace(/[^\d.]/g, ""), 10);
    if (isNaN(targetNumber)) {
      setCount(target);
      return;
    }
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = progress * (2 - progress); // Ease out quad
      const currentCount = Math.floor(easeProgress * targetNumber);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(targetNumber);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, target, duration]);

  return (
    <span ref={elementRef} className="font-serif">
      {hasStarted ? `${count}${suffix}` : `0${suffix}`}
    </span>
  );
};

const About = () => {
  // SEO Optimization
  useSEO({
    title: "About Our Brand & Founder | AriyaShop",
    description: "Learn about the inspiration behind AriyaShop. Read a personal message from our founder Ariya Sharma on our commitment to demi-fine, tarnish-resistant everyday luxury.",
    keywords: "AriyaShop story, jewellery founder, demi-fine jewelry, everyday luxury",
  });

  return (
    <div className="min-h-screen bg-[#FCF9F5] text-[#2E241C]">
      
      {/* 1. Premium About Hero */}
      <section className="relative w-full h-[380px] md:h-[460px] overflow-hidden bg-[#F4EFEA] flex items-center justify-center border-b border-luxury-beige/35 pt-16">
        {/* Left Side: Gold Leaf Illustration */}
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

        {/* Right Side: Flatlay Image */}
        <div className="absolute right-0 top-0 bottom-0 w-[32%] sm:w-[38%] md:w-[42%] h-full z-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
            alt="Jewellery Flatlay Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4EFEA] via-[#F4EFEA]/30 to-transparent" />
        </div>

        {/* Centered Content */}
        <div className="relative max-w-2xl mx-auto px-6 text-center z-20 space-y-4 md:space-y-5">
          {/* Breadcrumbs */}
          <nav className="flex justify-center" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-light tracking-widest uppercase">
              <li>
                <Link to="/" className="text-luxury-gray hover:text-luxury-gold transition-colors">
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <FiChevronRight className="w-3.5 h-3.5 mx-1 text-luxury-beige-dark" />
                <span className="text-luxury-gold font-medium">About</span>
              </li>
            </ol>
          </nav>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-wide text-luxury-brown">
            About AriyaShop
          </h1>

          {/* Gold Star Divider */}
          <div className="flex justify-center items-center gap-3">
            <div className="h-[1px] w-10 bg-luxury-gold/40" />
            <span className="text-luxury-gold text-[10px]">✦</span>
            <div className="h-[1px] w-10 bg-luxury-gold/40" />
          </div>

          {/* Intro Paragraph */}
          <p className="text-xs sm:text-sm text-luxury-brown/85 font-light leading-relaxed max-w-xl mx-auto">
            We bring a modern era of minimal yet luxurious jewellery designed for the modern woman. 
            Our focus is to create demi-fine everyday pieces that are stylish, durable, and pocket-friendly—luxury without the traditional retail markups.
          </p>
        </div>
      </section>

      {/* 2. Founder Section (Meet the Founder) */}
      <section className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left: Founder Portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative max-w-md w-full">
              <img
                src={founderImg}
                alt="Ariya Sharma, Founder of AriyaShop"
                className="rounded-xl shadow-xs border border-luxury-beige/30 object-cover w-full aspect-[4/5] select-none"
                loading="eager"
              />
            </div>
          </div>

          {/* Right: Personal Message & Materials list */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <div className="flex flex-col items-start">
                <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-luxury-gold uppercase block">
                  ABOUT FOUNDER
                </span>
                <div className="w-8 h-[1.5px] bg-luxury-gold mt-2" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-[36px] font-normal tracking-wide text-luxury-brown pt-2">
                Meet the Founder
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-[14px] text-luxury-brown/80 font-light leading-relaxed max-w-xl">
              <p>
                At <span className="font-semibold text-luxury-brown">ARIYA</span>, we create demi-fine everyday jewellery that is stylish, durable, and pocket-friendly. Our pieces are crafted with quality materials and timeless designs, perfect for daily wear without the luxury price tag.
              </p>
              <p>
                In a world where everyday style matters just as much as special occasions, <span className="font-semibold text-luxury-brown">ARIYA</span> brings a modern era of minimal yet luxurious jewellery designed for the modern woman.
              </p>
            </div>

            {/* Mockup Specific Material Bullets */}
            <div className="space-y-3.5 pt-4 border-t border-luxury-beige/30 max-w-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F4EFEA] flex items-center justify-center text-luxury-gold flex-shrink-0">
                  <FiShield className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-[13px] text-luxury-brown/80 font-light">
                  <span className="font-semibold text-luxury-brown">Stainless Steel</span> — Durable, tarnish-resistant, and ideal for everyday wear
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F4EFEA] flex items-center justify-center text-luxury-gold flex-shrink-0">
                  <FiFeather className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-[13px] text-luxury-brown/80 font-light">
                  <span className="font-semibold text-luxury-brown">Brass</span> — Lightweight with a premium luxurious finish
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F4EFEA] flex items-center justify-center text-luxury-gold flex-shrink-0">
                  <FiStar className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-[13px] text-luxury-brown/80 font-light">
                  <span className="font-semibold text-luxury-brown">High-Quality Stones</span> — Sparkle, clarity, and elegance you can truly see
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Promise Section */}
      <section className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12 py-12 sm:py-16 md:py-20 border-t border-luxury-beige/30 text-center">
        <div className="space-y-2 mb-10 sm:mb-12">
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-luxury-gold uppercase block">
              OUR PROMISE
            </span>
            <div className="w-8 h-[1.5px] bg-luxury-gold mt-2" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-[36px] font-normal tracking-wide text-luxury-brown pt-2">
            Timeless Beauty. Honest Values.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="flex flex-col items-center p-2">
            <div className="w-10 h-10 rounded-full bg-[#F4EFEA] flex items-center justify-center text-luxury-gold mb-3.5">
              <FiStar className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-serif text-base font-medium text-luxury-brown mb-1.5">Premium Quality</h3>
            <p className="text-xs text-luxury-gray font-light leading-relaxed max-w-[220px]">
              Finest materials and expert craftsmanship in every piece.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center p-2">
            <div className="w-10 h-10 rounded-full bg-[#F4EFEA] flex items-center justify-center text-luxury-gold mb-3.5">
              <FiShield className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-serif text-base font-medium text-luxury-brown mb-1.5">Trusted & Secure</h3>
            <p className="text-xs text-luxury-gray font-light leading-relaxed max-w-[220px]">
              100% secure shopping and authentic products you can trust.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center p-2">
            <div className="w-10 h-10 rounded-full bg-[#F4EFEA] flex items-center justify-center text-luxury-gold mb-3.5">
              <FiHeart className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-serif text-base font-medium text-luxury-brown mb-1.5">Made with Love</h3>
            <p className="text-xs text-luxury-gray font-light leading-relaxed max-w-[220px]">
              Designed to celebrate every emotion and special moment.
            </p>
          </div>

          {/* Card 4 */}
          <div className="flex flex-col items-center p-2">
            <div className="w-10 h-10 rounded-full bg-[#F4EFEA] flex items-center justify-center text-luxury-gold mb-3.5">
              <FiPackage className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-serif text-base font-medium text-luxury-brown mb-1.5">Hassle-free Returns</h3>
            <p className="text-xs text-luxury-gray font-light leading-relaxed max-w-[220px]">
              Easy 7-day returns and customer-first support.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Our Story */}
      <section className="bg-[#F4EFEA] py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left: Story text */}
            <div className="lg:col-span-6 space-y-5 order-2 lg:order-1">
              <div className="space-y-1.5">
                <div className="flex flex-col items-start">
                  <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-luxury-gold uppercase block">
                    OUR STORY
                  </span>
                  <div className="w-8 h-[1.5px] bg-luxury-gold mt-2" />
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-[36px] font-normal tracking-wide text-luxury-brown pt-2">
                  A Story of Elegance and Emotion
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-[14px] text-luxury-brown/80 font-light leading-relaxed max-w-xl">
                <p>
                  AriyaShop was born from a simple belief — every woman deserves jewellery that makes her feel confident, beautiful, and cherished.
                </p>
                <p>
                  We handpick every piece with care, blending timeless designs with modern elegance to bring you collections that are as unique as you are.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-6 py-3 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white text-[10px] tracking-widest uppercase font-semibold rounded-md transition-all duration-300"
                >
                  Explore Our Collection
                </Link>
              </div>
            </div>

            {/* Right: Lifestyle Image */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-xl border border-luxury-beige/30 aspect-[16/10]">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
                  alt="AriyaShop Jewelry Collection"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose AriyaShop (5 Highlights) */}
      <section className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12 py-12 sm:py-16 md:py-20 text-center">
        <div className="space-y-2 mb-10">
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-luxury-gold uppercase block">
              WHY CHOOSE ARIYASHOP
            </span>
            <div className="w-8 h-[1.5px] bg-luxury-gold mt-2" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-[36px] font-normal tracking-wide text-luxury-brown pt-2">
            Jewellery That Completes You
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="flex flex-col items-center p-4">
            <div className="w-9 h-9 rounded-full bg-[#F4EFEA] flex items-center justify-center text-luxury-gold mb-3">
              <FiShield className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-serif text-sm font-medium text-luxury-brown mb-1">Tarnish Resistant</h3>
            <p className="text-[11px] sm:text-xs text-luxury-gray font-light leading-relaxed max-w-[150px]">
              Made to shine, every single day.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center p-4">
            <div className="w-9 h-9 rounded-full bg-[#F4EFEA] flex items-center justify-center text-luxury-gold mb-3">
              <FiHeart className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-serif text-sm font-medium text-luxury-brown mb-1">Hypoallergenic</h3>
            <p className="text-[11px] sm:text-xs text-luxury-gray font-light leading-relaxed max-w-[150px]">
              Gentle on skin, perfect for you.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center p-4">
            <div className="w-9 h-9 rounded-full bg-[#F4EFEA] flex items-center justify-center text-luxury-gold mb-3">
              <FiStar className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-serif text-sm font-medium text-luxury-brown mb-1">Everyday Luxury</h3>
            <p className="text-[11px] sm:text-xs text-luxury-gray font-light leading-relaxed max-w-[150px]">
              Minimal designs, maximum impact.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center p-4">
            <div className="w-9 h-9 rounded-full bg-[#F4EFEA] flex items-center justify-center text-luxury-gold mb-3">
              <FiGift className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-serif text-sm font-medium text-luxury-brown mb-1">Perfect for Gifting</h3>
            <p className="text-[11px] sm:text-xs text-luxury-gray font-light leading-relaxed max-w-[150px]">
              Beautifully packaged for your loved ones.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="flex flex-col items-center p-4 col-span-2 md:col-span-1 mx-auto">
            <div className="w-9 h-9 rounded-full bg-[#F4EFEA] flex items-center justify-center text-luxury-gold mb-3">
              <FiAward className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-serif text-sm font-medium text-luxury-brown mb-1">Quality Assured</h3>
            <p className="text-[11px] sm:text-xs text-luxury-gray font-light leading-relaxed max-w-[150px]">
              Checked for quality, trusted by thousands.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Brand Numbers */}
      <section className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12 py-10 border-t border-b border-luxury-beige/35 text-center">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          <div className="space-y-0.5">
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-luxury-gold">
              <AnimatedCounter target="15" suffix="K+" />
            </h3>
            <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-luxury-gray">
              Happy Customers
            </p>
          </div>

          <div className="space-y-0.5">
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-luxury-gold">
              <AnimatedCounter target="500" suffix="+" />
            </h3>
            <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-luxury-gray">
              Unique Designs
            </p>
          </div>

          <div className="space-y-0.5">
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-luxury-gold">
              <AnimatedCounter target="100" suffix="%" />
            </h3>
            <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-luxury-gray">
              Quality Assured
            </p>
          </div>

          <div className="space-y-0.5">
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-luxury-gold">
              <AnimatedCounter target="4.9" suffix="/5" />
            </h3>
            <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-luxury-gray">
              Customer Rating
            </p>
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="bg-[#F4EFEA] py-12 sm:py-16 text-center">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#2E241C] tracking-wide">
              Discover Your Perfect Piece
            </h2>
            <p className="text-xs text-luxury-brown/75 font-light leading-relaxed">
              Find the ornament that speaks to your style, crafted for everyday elegance.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2E241C] text-white hover:bg-[#423429] text-[10px] tracking-widest uppercase font-semibold rounded-md transition-all duration-300 hover:-translate-y-0.5"
              >
                Explore Collection
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;