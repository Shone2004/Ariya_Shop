import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import everyday from "../assets/collections/ee.jpeg";
import minimal from "../assets/collections/mg.jpeg";
import wedding from "../assets/collections/wedding.jpeg";
import gift from "../assets/collections/gc.jpeg";
import office from "../assets/collections/ow.jpeg";

const collections = [
  {
    title: "Everyday Essentials",
    image: everyday,
    size: "small",
    link: "/shop?occasion=Daily Wear"
  },
  {
    title: "Minimal Gold",
    image: minimal,
    size: "small",
    link: "/shop?collection=Modern Minimalist"
  },
  {
    title: "Wedding Collection",
    image: wedding,
    size: "large",
    link: "/shop?occasion=Wedding"
  },
  {
    title: "Gift Collection",
    image: gift,
    size: "small",
    link: "/shop?occasion=Festive"
  },
  {
    title: "Office Wear",
    image: office,
    size: "small",
    link: "/shop?occasion=Office Wear"
  },
];

const EditorsChoice = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-16">

          <p className="uppercase tracking-[6px] text-[#be8b2d] font-semibold">
            Editor's Choice
          </p>

          <h2 className="text-5xl font-serif mt-4">
            Handpicked Collections You'll Love
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Discover timeless jewellery collections curated for every mood,
            every occasion, and every story.
          </p>

        </div>

        {/* Grid */}

        <div className="grid md:grid-cols-2 gap-6">

          {collections.map((item, index) => (

            <div
              key={index}
              onClick={() => navigate(item.link)}
              className={`relative overflow-hidden rounded-3xl group cursor-pointer

              ${
                item.size === "large"
                  ? "md:col-span-2 h-[450px]"
                  : "h-[340px]"
              }

              `}
            >

              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover duration-700 group-hover:scale-110"
              />

              {/* Overlay */}

              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 duration-500" />

              {/* Content */}

              <div className="absolute bottom-8 left-8 text-white">

                <h3 className="text-3xl font-serif">
                  {item.title}
                </h3>

                <button className="flex items-center gap-3 mt-5 text-sm uppercase tracking-widest">

                  Explore

                  <FaArrowRight />

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default EditorsChoice;