import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteRight, FaCheckCircle } from "react-icons/fa";

// Import your local product collection assets
import celesteStarfallBracelet from "../assets/collections/Celeste-Starfall-Bracelet-349.png";
import classicHeartBracelet from "../assets/collections/classic-heart-bracelet-1-399.png";
import emeraldButterflyBrooch from "../assets/collections/Emerald-butterfly-brooch(green)-799.png";
import goldenBloomEarrings from "../assets/collections/Golden-Bloom-Drop-Earrings-1-349.png";
import lunaCloverNecklace from "../assets/collections/Luna-clover-necklace-499.png";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    city: "Mumbai",
    productImage: celesteStarfallBracelet,
    customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    productName: "Celeste Starfall Bracelet",
    review:
      "The Celeste Starfall Bracelet exceeded my expectations. Premium quality, elegant packaging, and the stones catch the light beautifully. I receive compliments every time I wear it.",
    rating: 5,
  },
  {
    id: 2,
    name: "Ananya Reddy",
    city: "Hyderabad",
    productImage: classicHeartBracelet,
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    productName: "Classic Heart Bracelet",
    review:
      "Fast delivery and amazing craftsmanship. The Classic Heart Bracelet looks exactly like the pictures and feels incredibly luxurious around the wrist. Highly recommended.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sneha Patel",
    city: "Ahmedabad",
    productImage: emeraldButterflyBrooch,
    customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
    productName: "Emerald Butterfly Brooch",
    review:
      "Beautiful custom detailing! The green tones in the Emerald Butterfly Brooch are vibrant and deeply saturated. I've ordered multiple times and every purchase has been perfect.",
    rating: 5,
  },
  {
    id: 4,
    name: "Kavya Nair",
    city: "Bangalore",
    productImage: goldenBloomEarrings,
    customerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
    productName: "Golden Bloom Drop Earrings",
    review:
      "Elegant, lightweight, and sports a premium finish. These Golden Bloom Drop Earrings made my wedding outfit complete. Definitely shopping here again.",
    rating: 5,
  },
  {
    id: 5,
    name: "Neha Gupta",
    city: "Delhi",
    productImage: lunaCloverNecklace,
    customerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop",
    productName: "Luna Clover Necklace",
    review:
      "Excellent customer support and the jewelry quality is truly premium. The Luna Clover Necklace looks much more expensive than its retail price.",
    rating: 5,
  },
];

const CustomerFavorites = () => {
  return (
    <section className="py-32 bg-[#FAF9F6] text-neutral-900 relative overflow-hidden select-none">
      {/* Soft Ambient Luxury Glow System */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#be8b2d]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neutral-200/50 rounded-full blur-[120px] pointer-events-none" />

      {/* Luxury Geometric Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `linear-gradient(to right, #be8b2d 1px, transparent 1px), linear-gradient(to bottom, #be8b2d 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Editorial Layout Header */}
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-10">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.45em] text-[#be8b2d] font-semibold mb-3 block">
              The Atelier Journal
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-light tracking-tight text-neutral-900 leading-tight">
              Voices of <span className="italic font-normal text-[#be8b2d]">Delight</span>
            </h2>
          </div>
          <p className="text-neutral-500 font-light max-w-sm text-sm md:text-base leading-relaxed tracking-wide">
            Real experiences from collectors who value exquisite artistry, unmatched brilliance, and timeless jewelry designs.
          </p>
        </div>

        {/* Gallery-Style Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-[1.5px] overflow-hidden rounded-none shadow-[0_4px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_30px_60px_rgba(190,139,45,0.06)] transition-shadow duration-500"
            >
              
              {/* AUTOMATIC GLOWING BEAM EFFECT */}
              <div 
                className="absolute inset-0 w-[200%] h-[200%] top-[-50%] left-[-50%] pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 60%, #be8b2d 85%, #ffd700 95%, transparent 100%)',
                  animation: `spin ${5 + (index % 4)}s linear infinite`,
                  animationDelay: `${index * 0.4}s`
                }}
              />

              {/* CARD CONTAINER MASK */}
              <div className="relative w-full h-full bg-white p-0 z-10 flex flex-col justify-between overflow-hidden">
                <div>
                  {/* SEAMLESS FULL-WIDTH CONTAINER BOX */}
                  <div className="w-full h-64 relative border-b border-neutral-100 overflow-hidden group bg-white flex items-center justify-center p-4">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-contain transition-transform duration-750 ease-out group-hover:scale-105"
                    />
                    
                    {/* Subtle micro shadow overlay along the bottom for typography safety */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/5 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-4 left-6 z-20">
                      <span className="text-[10px] text-neutral-800 font-medium tracking-[0.18em] uppercase bg-white/80 backdrop-blur-md px-3 py-1.5 rounded border border-neutral-200/40 shadow-sm">
                        {item.productName}
                      </span>
                    </div>
                  </div>

                  {/* Review Text Container */}
                  <div className="p-8 pb-0">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex gap-0.5 text-[10px] text-[#be8b2d]">
                        {[...Array(item.rating)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                      <FaQuoteRight className="text-base text-neutral-200" />
                    </div>
                    
                    <p className="text-neutral-600 leading-relaxed font-light text-[14px] tracking-wide mb-8 italic">
                      "{item.review}"
                    </p>
                  </div>
                </div>

                {/* PREMIUM LOWER BAR WITH CUSTOMER AVATARS */}
                <div className="mx-8 mb-8 flex items-center gap-3.5 border-t border-neutral-100 pt-5 mt-auto">
                  {/* Customer Avatar Element */}
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200 p-[1.5px] bg-neutral-50 shrink-0 shadow-sm">
                    <img
                      src={item.customerAvatar}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  
                  {/* Identity metadata details */}
                  <div className="overflow-hidden">
                    <h3 className="text-sm font-medium text-neutral-800 flex items-center gap-1.5 tracking-wider truncate">
                      {item.name}
                      <FaCheckCircle className="text-[#be8b2d] text-[10px] shrink-0 opacity-90" />
                    </h3>
                    <p className="text-[10px] text-[#be8b2d] uppercase tracking-[0.18em] font-semibold mt-0.5 opacity-90 truncate">
                      {item.city} &bull; Verified Buyer
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Global Injection for Keyframe animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default CustomerFavorites;