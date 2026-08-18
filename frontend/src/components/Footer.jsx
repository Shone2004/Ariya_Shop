import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTwitter,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeart,
  FaArrowRight,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaLock,
  FaChevronUp,
  FaCreditCard,
  FaGooglePay,
} from "react-icons/fa";
import {
  SiVisa,
  SiMastercard,
  SiPaytm,
} from "react-icons/si";
import AriyaLogo from "../assets/Ariya.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const categories = [
    { name: "Necklaces", href: "/shop" },
    { name: "Earrings", href: "/shop" },
    { name: "Rings", href: "/shop" },
    { name: "Bracelets", href: "/shop" },
    { name: "Anklets", href: "/shop" },
  ];

  

  const socialLinks = [
    { icon: FaInstagram, href: "https://www.instagram.com/ariya.jeweller", label: "Instagram" },
    { icon: FaPinterestP, href: "https://www.pinterest.com/nandeshwargunjan3/", label: "Pinterest" },
    { icon: FaYoutube, href: "https://www.youtube.com/@ariyajewellers", label: "YouTube" },
  ];

  const trustBadges = [
    { icon: FaTruck, title: "₹99 Shipping", desc: "Orders above ₹999" },
    { icon: FaUndo, title: "Easy Returns", desc: "7-day return policy" },
    { icon: FaShieldAlt, title: "Certified Jewelry", desc: "Quality assured" },
    { icon: FaLock, title: "Secure Payment", desc: "100% encrypted" },
  ];

  return (
    <footer className="bg-[#1a1a1a] text-white relative overflow-hidden">

      {/* Decorative Top Gold Line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#be8b2d] to-transparent" />

      {/* Trust Badges Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#be8b2d]/10 border border-[#be8b2d]/20 flex items-center justify-center group-hover:bg-[#be8b2d]/20 transition-colors duration-300 shrink-0">
                  <badge.icon className="text-[#be8b2d] text-lg" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{badge.title}</p>
                  <p className="text-xs text-gray-400">{badge.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Column 1: Logo + About + Social */}
          <div className="lg:col-span-4 flex flex-col items-center text-center lg:items-start lg:text-left gap-4">
            {/* Logo Wrapper */}
            <a href="/" className="group relative block transition-all duration-500">
              {/* Refined Permanent Background Ambient Glow */}
              <div className="absolute inset-0 bg-[#be8b2d]/15 blur-xl rounded-full scale-120 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              <img
                src={AriyaLogo}
                alt="Ariya - Handcrafted Jewelry"
                className="relative z-10 h-24 md:h-28 w-auto object-contain opacity-100 brightness-[1.8] contrast-125 saturate-150 drop-shadow-[0_0_15px_rgba(201,165,75,0.6)] group-hover:brightness-[2.2] group-hover:drop-shadow-[0_0_30px_rgba(201,165,75,0.95)] transition-all duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML =
                    '<span class="text-3xl font-serif text-[#be8b2d] tracking-wider drop-shadow-[0_0_10px_rgba(190,139,45,0.5)]">Ariya</span>';
                }}
              />
            </a>

            {/* Description - Perfectly Spaced and Aligned */}
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
              Handcrafted jewelry designed for the modern Indian woman.
              Every piece tells a story of elegance, tradition, and
              contemporary style.
            </p>

            {/* Social Icons */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#be8b2d] hover:border-[#be8b2d] transition-all duration-300 group"
                >
                  <social.icon className="text-gray-400 text-sm group-hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#be8b2d] mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-[#be8b2d] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-[#be8b2d] transition-all duration-300" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#be8b2d] mb-6">
              Categories
            </h4>
            <ul className="space-y-3">
              {categories.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-[#be8b2d] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-[#be8b2d] transition-all duration-300" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact + Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#be8b2d] mb-6">
              Contact Us
            </h4>

            {/* Address */}
            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-[#be8b2d]/10 border border-[#be8b2d]/20 flex items-center justify-center shrink-0 mt-0.5">
                <FaMapMarkerAlt className="text-[#be8b2d] text-sm" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">Ariya Proprietor</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  401, Saraswatikunj Apartment,<br />
                  Oppo. to Prerana Bhavan,<br />
                  Pune, Maharashtra — 411033
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#be8b2d]/10 border border-[#be8b2d]/20 flex items-center justify-center shrink-0">
                <FaPhoneAlt className="text-[#be8b2d] text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Phone</p>
                <a
                  href="tel:+918329175870"
                  className="text-sm text-gray-300 hover:text-[#be8b2d] transition-colors duration-200 font-medium"
                >
                  +91 83291 75870
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-[#be8b2d]/10 border border-[#be8b2d]/20 flex items-center justify-center shrink-0">
                <FaEnvelope className="text-[#be8b2d] text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Email</p>
                <a
                  href="mailto:nandeshwargunjan3@gmail.com"
                  className="text-sm text-gray-300 hover:text-[#be8b2d] transition-colors duration-200 font-medium"
                >
                  nandeshwargunjan3@gmail.com
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-sm font-semibold text-white mb-1">Join the Ariya Family</p>
              <p className="text-xs text-gray-400 mb-4">
                Get exclusive offers, new arrivals & styling tips.
              </p>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white/10 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#be8b2d] focus:ring-1 focus:ring-[#be8b2d]/50 transition-all duration-300 pr-12"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#be8b2d] flex items-center justify-center hover:bg-[#d4a43a] transition-colors duration-300 shadow-md"
                >
                  <FaArrowRight className="text-white text-xs" />
                </button>
              </form>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-400 mt-2 flex items-center gap-1.5"
                >
                  <FaHeart className="text-red-400" /> Welcome to the Ariya family!
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Care Links Row */}
     

      {/* Payment Methods + Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} Ariya Jewelry. All rights reserved.
              Handcrafted with{" "}
              <FaHeart className="inline text-red-500 text-[10px] mx-0.5" />{" "}
              in India.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider mr-2">
                We Accept
              </span>
              <div className="flex items-center gap-2">
                {[
                  { Icon: SiVisa, label: "Visa" },
                  { Icon: SiMastercard, label: "Mastercard" },
                  { Icon: SiPaytm, label: "Paytm" },
                  { Icon: FaGooglePay, label: "GPay" },
                  { Icon: FaCreditCard, label: "UPI" },
                ].map(({ Icon, label }, i) => (
                  <div
                    key={i}
                    title={label}
                    className="w-10 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#be8b2d]/40 transition-colors duration-200"
                  >
                    <Icon className="text-gray-400 text-sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#be8b2d] text-white shadow-lg shadow-[#be8b2d]/30 flex items-center justify-center hover:bg-[#d4a43a] transition-colors duration-300"
        aria-label="Scroll to top"
      >
        <FaChevronUp className="text-sm" />
      </motion.button>

      {/* Subtle Background Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </footer>
  );
};

export default Footer;