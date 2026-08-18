import React from "react";

const BADGES = [
  {
    id: "shipping",
    title: "₹99 SHIPPING",
    subtitle: "Across India",
    icon: (
      <svg viewBox="0 0 64 64" className="w-8 h-8 text-luxury-gold fill-none stroke-current stroke-[1.1]">
        <path d="M12,24 L42,24 L42,46 L12,46 Z" />
        <path d="M42,28 L54,34 L54,46 L42,46" />
        <circle cx="20" cy="48" r="4" />
        <circle cx="48" cy="48" r="4" />
        <line x1="28" y1="36" x2="36" y2="36" />
      </svg>
    ),
  },
  {
    id: "quality",
    title: "PREMIUM QUALITY",
    subtitle: "Best materials used",
    icon: (
      <svg viewBox="0 0 64 64" className="w-8 h-8 text-luxury-gold fill-none stroke-current stroke-[1.1]">
        <polygon points="32,8 52,24 42,56 22,56 12,24" />
        <circle cx="32" cy="32" r="5" />
        <line x1="32" y1="8" x2="32" y2="56" />
      </svg>
    ),
  },
  {
    id: "returns",
    title: "EASY RETURNS",
    subtitle: "Hassle free returns",
    icon: (
      <svg viewBox="0 0 64 64" className="w-8 h-8 text-luxury-gold fill-none stroke-current stroke-[1.1]">
        <path d="M14,32 C14,19.8 23.8,10 36,10 C48.2,10 58,19.8 58,32 C58,44.2 48.2,54 36,54" />
        <polyline points="20,24 14,32 22,38" />
      </svg>
    ),
  },
  {
    id: "secure",
    title: "SECURE PAYMENT",
    subtitle: "100% protected",
    icon: (
      <svg viewBox="0 0 64 64" className="w-8 h-8 text-luxury-gold fill-none stroke-current stroke-[1.1]">
        <rect x="17" y="24" width="30" height="24" rx="3" />
        <path d="M24,24 L24,17 C24,12.6 27.6,9 32,9 C36.4,9 40,12.6 40,17 L40,24" />
        <circle cx="32" cy="35" r="2.5" className="fill-luxury-gold" />
      </svg>
    ),
  },
];

const TrustBadges = () => {
  return (
    <section className="bg-[#F4EFEA] py-14 sm:py-16 md:py-20 border-t border-b border-luxury-beige/40">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4.5 group"
            >
              {/* Icon Container */}
              <div className="p-3.5 rounded-full bg-white shadow-3xs border border-luxury-beige/30 transition-transform duration-300 group-hover:scale-105">
                {badge.icon}
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center">
                <h4 className="font-serif text-xs sm:text-[13px] tracking-wider font-semibold text-luxury-brown mb-1">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-luxury-gray font-light tracking-wide">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
