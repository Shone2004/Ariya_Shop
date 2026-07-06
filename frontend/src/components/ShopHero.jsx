import React from "react";
import { Link } from "react-router-dom";
import heroDesktop from "../assets/hero-desktop.png";
import heroMobile from "../assets/hero-mobile.png";

const ShopHero = () => {
  return (
    <section className="relative w-full h-[430px]
sm:h-[500px]
md:h-[260px]
lg:h-[320px]
xl:h-[340px] overflow-hidden bg-[#F6F1EB]">

      {/* Hero Image */}
      {/* Desktop Hero */}
<img
  src={heroDesktop}
  alt="Luxury Jewellery"
  loading="eager"
  className="
    hidden
    md:block
    absolute
    inset-0
    w-full
    h-full
    object-cover
    object-[65%_center]
    brightness-[1.02]
    contrast-[1.02]
    select-none
    pointer-events-none
  "
/>

{/* Mobile Hero */}
<img
  src={heroMobile}
  alt="Luxury Jewellery"
  loading="eager"
  className="
    block
    md:hidden
    absolute
    inset-0
    w-full
    h-full
    object-cover
   object-[72%_center]
    brightness-[1.02]
    contrast-[1.02]
    select-none
    pointer-events-none
  "
/>

      {/* Soft Left Fade */}
      {/* Desktop Overlay */}
<div
  className="
  hidden md:block
  absolute
  inset-0
  z-[1]
  bg-gradient-to-r
  from-[#F6F1EB]/70
  via-[#F6F1EB]/28
  via-[24%]
  to-transparent
  "
/>

{/* Mobile Overlay */}
<div
  className="
  md:hidden
  absolute
  inset-0
  z-[1]
  bg-gradient-to-r
  from-[#F6F1EB]/20
  via-transparent
  to-transparent
  "
/>

      {/* Content */}
      <div className="relative z-10 h-full w-full flex items-start
pt-12
md:items-center
md:pt-0 px-8 sm:px-10 lg:px-16 xl:px-20">

        <div className="max-w-[240px] sm:max-w-[320px] md:max-w-[470px]">

          {/* Breadcrumb */}
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 uppercase tracking-[0.18em] text-[11px] text-[#72685F]">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#C79A2E] transition-colors duration-300"
                >
                  Home
                </Link>
              </li>

              <li className="text-[#BCA98C]">/</li>

              <li className="text-[#C79A2E] font-medium">
                Shop All
              </li>
            </ol>
          </nav>

          {/* Heading */}
          <h1 className="font-serif text-[#2A211A] font-normal leading-[1.05] tracking-[-0.02em] text-[32px]
sm:text-[34px]
md:text-[42px]
lg:text-[58px]">
            Shop Our{" "}
            <span className="italic text-[#C79A2E]">
              Exquisite
            </span>
            <br />
            Collection
          </h1>

          {/* Divider */}
        <div className="flex items-center gap-4 mt-8 mb-6">
            <div className="h-px w-12 bg-[#C79A2E]/40" />
            <span className="text-[#C79A2E] text-[10px]">
              ✦
            </span>
            <div className="h-px w-12 bg-[#C79A2E]/40" />
          </div>

          {/* Subtitle */}
         <p
  className="
    max-w-[170px]
    sm:max-w-[260px]
    md:max-w-[420px]
    text-[12px]
    leading-6
    sm:text-[13px]
    md:text-[14px]
    md:leading-7
    text-[#564B43]
    font-light
  "
>
            Timeless jewellery crafted for every moment of your life.
            Discover pieces that celebrate your inner brilliance.
          </p>

        </div>

      </div>

    </section>
  );
};

export default ShopHero;