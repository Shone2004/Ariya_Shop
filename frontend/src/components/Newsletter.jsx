import React, { useState } from "react";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    toast.success("Thank you for subscribing to AriyaShop!", {
      icon: "✉️",
      style: {
        background: "#2E241C",
        color: "#FCF9F5",
        fontFamily: "Outfit, sans-serif",
        borderRadius: "8px",
      },
    });
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden bg-[#FCF9F5] py-20 sm:py-24 border-t border-luxury-beige/30">
      {/* Background silk overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80"
          alt="Silk Texture"
          className="h-full w-full object-cover opacity-10"
          loading="lazy"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(46,36,28,0.04)] border border-luxury-beige/50">
          {/* Subscription Info */}
          <div className="p-8 sm:p-12 lg:p-16 lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-luxury-brown mb-4 font-light leading-tight">
              Stay <span className="italic text-luxury-gold font-normal">Updated</span>
            </h2>
            <p className="text-sm text-luxury-gray font-light mb-8 max-w-md leading-relaxed tracking-wide">
              Subscribe to receive exclusive access to new collections, special offers, free giveaways, and once-in-a-lifetime deals.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3.5 w-full max-w-lg">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-grow px-5 py-4 bg-luxury-ivory border border-luxury-beige-dark/50 text-luxury-brown text-sm rounded-md focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/30 placeholder-luxury-gray/50 font-light transition-all duration-300"
                aria-label="Email Address"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs tracking-widest uppercase font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none active:scale-98 cursor-pointer whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Luxury Jewellery Image Panel (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-5 h-[380px] relative">
            <img
              src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80"
              alt="Luxury Jewellery Set"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Elegant overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
