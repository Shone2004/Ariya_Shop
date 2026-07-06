import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";

// Local premium product renders with solid white backgrounds and natural shadows
import catShopAll from "../assets/cat_shop_all.png";
import catEarrings from "../assets/cat_earrings.png";
import catNecklaces from "../assets/cat_necklaces.png";
import catRings from "../assets/cat_rings.png";
import catBracelets from "../assets/cat_bracelets.png";
import catBangles from "../assets/cat_bangles.png";
import catBrooch from "../assets/cat_brooch.png";
import catOrganizer from "../assets/cat_organizer.png";

const CATEGORIES = [
  { id: "all", name: "Shop All", image: catShopAll },
  { id: "earrings", name: "Earrings", image: catEarrings },
  { id: "necklaces", name: "Necklaces", image: catNecklaces },
  { id: "rings", name: "Rings", image: catRings },
  { id: "bracelets", name: "Bracelets", image: catBracelets },
  { id: "bangles", name: "Bangles", image: catBangles },
  { id: "brooch", name: "Brooch", image: catBrooch },
  { id: "organizer", name: "Organizer", image: catOrganizer },
];

const CategoryCarousel = ({ activeCategory, onSelectCategory }) => {
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
    align: "start",
  });

  return (
   <div
  className="
  relative
  border-y
  border-[#E9E2D7]
  bg-gradient-to-b
  from-[#FFFDFC]
  via-[#FBF8F4]
  to-[#FFFDFC]
  py-8
  md:py-10
  overflow-hidden
"
>
  {/* Premium Top Divider */}
<div
  className="
    absolute
    top-0
    left-0
    right-0
    h-px
    bg-gradient-to-r
    from-transparent
    via-[#D7B05A]
    to-transparent
  "
/>

{/* Soft Background Glow */}
<div
  className="
    absolute
    left-1/2
    top-1/2
    -translate-x-1/2
    -translate-y-1/2

    w-[900px]
    h-[220px]

    rounded-full

    bg-[#F6E8BF]/20

    blur-[120px]

    pointer-events-none
  "
/>

{/* Premium Bottom Divider */}
<div
  className="
    absolute
    bottom-0
    left-0
    right-0
    h-px
    bg-gradient-to-r
    from-transparent
    via-[#E8E1D4]
    to-transparent
  "
/>
      <div className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
        {/* Mobile Swipe Container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex space-x-4 md:space-x-0 md:grid md:grid-cols-8 md:gap-5">
            {CATEGORIES.map((cat) => {
              const isSelected =
                activeCategory.toLowerCase() === cat.name.toLowerCase() ||
                (cat.id === "all" && activeCategory === "Shop All");

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.name)}
                  className="flex-shrink-0 w-[105px] md:w-auto focus:outline-none group relative cursor-pointer"
                  aria-pressed={isSelected}
                >
                 <div
className={`
relative
overflow-hidden

flex
flex-col
items-center
justify-between

p-5

rounded-[24px]

border

bg-gradient-to-b
from-white
to-[#FCFAF7]

transition-all
duration-500

h-34
md:h-[156px]

${
isSelected
?
`
border-[#C79A2E]
shadow-[0_12px_40px_rgba(188,154,76,0.12)]
scale-[1.02]
`
:
`
border-[#ECE5D8]
hover:border-[#D8C08D]
hover:-translate-y-1
hover:shadow-[0_16px_40px_rgba(188,154,76,0.10)]
`
}
`}
>
                    {/* Floating Product Render with Natural Under-Product Shadow */}
                    <div className="flex-grow flex items-center justify-center w-full h-[60%] transform transition-transform duration-500 group-hover:scale-106">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className={`h-20 md:h-[90px] w-auto object-contain select-none pointer-events-none mix-blend-multiply ${
                          ["rings", "bracelets", "brooch", "organizer"].includes(cat.id)
                            ? "brightness-[1.08] contrast-[1.05]"
                            : ""
                        }`}
                        loading="lazy"
                      />
                    </div>

                    {/* Label (Semi-bold, tracking-wide, increased margin-top) */}
                    <span
                      className={`mt-4 text-[11px] tracking-[0.08em] transition-colors duration-200 text-center font-semibold uppercase ${
                        isSelected
                          ? "text-luxury-gold"
                          : "text-luxury-brown/80 group-hover:text-luxury-brown"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>

                  {/* Underline indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeCategoryUnderline"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-7 h-[2px] bg-luxury-gold rounded-full hidden md:block"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCarousel;
