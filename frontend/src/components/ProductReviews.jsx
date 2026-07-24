import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../hooks/useCart'
import SizeSelector from './Product/SizeSelector'

/* ─── Icons ─── */
const StarIcon = ({ size = 16, filled = true, stroke = '#C9A54B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 2.5l2.95 6.32 6.8.78-5.05 4.78 1.34 6.86L12 17.9l-6.04 3.34 1.34-6.86L2.25 9.6l6.8-.78L12 2.5z"
      fill={filled ? stroke : 'none'}
      stroke={stroke}
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
)

const ShieldCheckIcon = ({ size = 13, stroke = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" aria-hidden="true">
    <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

const ThumbsUpIcon = ({ size = 15, stroke = '#7a6a5a' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 22V11l5-9 1.5 1L12 9h7a2 2 0 0 1 1.96 2.4l-1.4 7A2 2 0 0 1 17.6 20H10a3 3 0 0 1-3-3" />
    <path d="M7 11H3v9h4" />
  </svg>
)

const CameraIcon = ({ size = 18, stroke = '#C9A54B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
    <circle cx="12" cy="13.5" r="3.5" />
  </svg>
)

const ChevronDownIcon = ({ size = 14, stroke = '#7a6a5a' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

const ChevronLeftIcon = ({ size = 16, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const SendIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4 20-7z" />
  </svg>
)

const CloseIcon = ({ size = 14, stroke = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const Sparkle = ({ className = '', fill = '#C9A54B' }) => (
  <svg viewBox="0 0 24 24" className={className} fill={fill} aria-hidden="true">
    <path d="M12 0c.6 5.6 1.4 9.2 5 12-3.6 2.8-4.4 6.4-5 12-.6-5.6-1.4-9.2-5-12 3.6-2.8 4.4-6.4 5-12z" />
  </svg>
)

const QuoteMark = ({ className = '' }) => (
  <svg viewBox="0 0 32 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M0 24V14.4Q0 7.2 4 3.6 8 0 14.4 0v6Q10 6 8 8.4 6 10.8 6 14.4h8V24H0Zm18 0V14.4q0-7.2 4-10.8Q26 0 32.4 0v6Q28 6 26 8.4q-2 2.4-2 6h8V24H18Z" />
  </svg>
)

/* ─── Rating Ring — signature jewellery-inspired meter ─── */
const RatingRing = ({ value, max = 5, size = 156 }) => {
  const stroke = 10
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  return (
    <div className="relative flex-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2b211b" strokeWidth={stroke} opacity="0.5" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="url(#ringGold)"
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - c * pct }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DEB96E" />
            <stop offset="100%" stopColor="#C9A54B" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-4xl leading-none text-[#f8f0e3]">{value}</span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#C9A54B]">out of {max}</span>
      </div>
    </div>
  )
}

/* ─── Mock data ─── */


const INITIAL_REVIEWS = [
  {
    id: 'r1',
    name: 'Priya Nair',
    rating: 5,
    date: '2026-06-12',
    verified: true,
    title: 'Wore it for my reception, got so many compliments',
    body: "The stone setting is so much finer in hand than the photos show — the gold polish hasn't dulled even after a full day of wear and humidity. The earrings sit perfectly without tugging at the ears, which is rare for a set this elaborate. Packaging arrived in a velvet box, felt like a proper heirloom piece.",
    helpful: 18,
    photos: [],
  },
  {
    id: 'r2',
    name: 'Arjun Mehta',
    rating: 4,
    date: '2026-05-28',
    verified: true,
    title: 'Stunning set, clasp could be sturdier',
    body: "Bought this for my wife and the kundan work is genuinely gallery-quality. My only note is the choker's hook clasp feels a touch delicate — I'd love a slightly more secure closure for a piece at this price point. Still, easily the best jewellery purchase we've made online.",
    helpful: 7,
    photos: ['/Images/ariyashopcontact.png'],
  },
  {
    id: 'r3',
    name: 'Lakshmi Iyer',
    rating: 5,
    date: '2026-05-10',
    verified: false,
    title: 'Bought for my daughter\u2019s sangeet — she loves it',
    body: 'The maang tikka and choker matched her lehenga colour almost exactly, and the weight is comfortable enough that she wore it the whole evening without complaints. Arrived two days earlier than estimated, beautifully wrapped.',
    helpful: 11,
    photos: [],
  },
  {
    id: 'r4',
    name: 'Rohan Deshpande',
    rating: 3,
    date: '2026-04-22',
    verified: true,
    title: 'Gorgeous, but sized a little smaller than expected',
    body: "Stonework and finish are excellent, but I assumed the choker would sit a touch lower based on the model photos — it's a snug, high-neck fit. Worth checking the size guide before ordering for your neckline preference. Customer support was responsive when I asked about exchanges.",
    helpful: 4,
    photos: [],
  },
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'highest', label: 'Highest Rated' },
  { value: 'lowest', label: 'Lowest Rated' },
  { value: 'helpful', label: 'Most Helpful' },
]

/* Deterministic gradient per reviewer name */
const AVATAR_GRADIENTS = [
  ['#C9A54B', '#DEB96E'],
  ['#7a6453', '#c9a24b'],
  ['#9b7a3c', '#f0d9b5'],
  ['#5f7d54', '#b8a034'],
]
const gradientFor = (name) => {
  const idx = name.charCodeAt(0) % AVATAR_GRADIENTS.length
  return AVATAR_GRADIENTS[idx]
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const StarRow = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <StarIcon key={n} size={size} filled={n <= rating} />
    ))}
  </div>
)

/* Interactive star picker */
const StarPicker = ({ value, onChange }) => {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className="p-0.5 transition-transform duration-150 hover:scale-125"
        >
          <StarIcon size={28} filled={n <= (hover || value)} />
        </button>
      ))}
    </div>
  )
}

const RatingBar = ({ stars, count, total, onClick, active }) => {
  const pct = total ? Math.round((count / total) * 100) : 0
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors ${
        active ? 'bg-[#C9A54B]/15' : 'hover:bg-[#C9A54B]/10'
      }`}
    >
      <span className="w-12 flex-none text-xs font-medium text-[#d9c2a8]">{stars} star</span>
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <span
          className="block h-full rounded-full bg-gradient-to-r from-[#DEB96E] to-[#C9A54B] transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="w-8 flex-none text-right text-xs text-[#9a8470]">{count}</span>
    </button>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
}

const formatPrice = (amount) => {
  if (!amount) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/* ─── Main Component ─── */
const ProductReviews = ({ product }) => {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS)
  const [sort, setSort] = useState('recent')
  const [sortOpen, setSortOpen] = useState(false)
  const [starFilter, setStarFilter] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(3)
  const [form, setForm] = useState({ name: '', email: '', title: '', body: '', rating: 0, photo: null })
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [selectedSize, setSelectedSize] = useState(null)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    const hasSizes = product?.sizes && product?.sizes.length > 0;
    if (hasSizes && !selectedSize) {
      toast.error("Please select a size", {
        style: {
          background: "#2E241C",
          color: "#FCF9F5",
          fontFamily: "Outfit, sans-serif",
          borderRadius: "8px",
        },
      });
      const el = document.getElementById("product-size-selector");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    addToCart(product, 1, selectedSize);
  };

  const RATING_SUMMARY = useMemo(() => {
    const total = product?.reviewsCount || 156;
    return {
      average: product?.rating || 4.7,
      total: total,
      distribution: [
        { stars: 5, count: Math.round(total * 0.72) },
        { stars: 4, count: Math.round(total * 0.19) },
        { stars: 3, count: Math.round(total * 0.06) },
        { stars: 2, count: Math.round(total * 0.02) },
        { stars: 1, count: Math.round(total * 0.01) },
      ],
    };
  }, [product]);

  const filteredSorted = useMemo(() => {
    let list = starFilter ? reviews.filter((r) => r.rating === starFilter) : [...reviews]
    switch (sort) {
      case 'highest': list.sort((a, b) => b.rating - a.rating); break
      case 'lowest': list.sort((a, b) => a.rating - b.rating); break
      case 'helpful': list.sort((a, b) => b.helpful - a.helpful); break
      default: list.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
    return list
  }, [reviews, sort, starFilter])

  const handleHelpful = (id) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, helpful: r.helpful + 1 } : r)))
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setForm((prev) => ({ ...prev, photo: file.name }))
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (form.rating === 0) return
    setSubmitStatus('submitting')
    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      const newReview = {
        id: `r${Date.now()}`,
        name: form.name || 'Anonymous',
        rating: form.rating,
        date: new Date().toISOString(),
        verified: false,
        title: form.title || 'Review',
        body: form.body,
        helpful: 0,
        photos: form.photo ? ['/Images/ariyashopcontact.png'] : [],
      }
      setReviews((prev) => [newReview, ...prev])
      setSubmitStatus('success')
      setForm({ name: '', email: '', title: '', body: '', rating: 0, photo: null })
      setTimeout(() => { setFormOpen(false); setSubmitStatus('idle') }, 1400)
    } catch {
      setSubmitStatus('error')
    }
  }

  const inputClass =
    'w-full rounded-xl border border-[#DDD4C7] bg-transparent px-4 py-3 text-[15px] text-[#2A211A] outline-none transition-colors placeholder:text-[#9a8a7a] focus:border-[#C9A54B]'

  return (
    <div className="w-full overflow-hidden bg-[#FCF9F5]">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1a1610] py-16 sm:py-24">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#C9A54B]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[#C9A54B]/10 blur-3xl" />

        {/* Sparkles */}
        <Sparkle className="pointer-events-none absolute right-[12%] top-10 h-4 w-4 opacity-50" />
        <Sparkle className="pointer-events-none absolute left-[8%] bottom-10 h-3 w-3 opacity-40" />

        {/* Gold top line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A54B] to-transparent" />

        {/* Back to Shop Link */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-10 md:left-14 z-10">
          <Link
            to="/shop"
            className="group flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#d9c2a8] backdrop-blur-md transition-all hover:bg-white/10 hover:text-[#C9A54B] hover:border-[#C9A54B]/30"
          >
            <ChevronLeftIcon />
            Back to Shop
          </Link>
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 mt-8 sm:px-10 md:flex-row md:items-center md:justify-between md:px-14">
          {/* Product identity */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col items-center gap-5 text-center md:flex-row md:items-center md:text-left"
          >
            <div className="relative h-28 w-28 flex-none overflow-hidden rounded-2xl border border-[#C9A54B]/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] sm:h-32 sm:w-32">
              <img src={product?.image || "/Images/ariyashopcontact.png"} alt={product?.name || "Product"} loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#C9A54B]/20" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A54B]">Product Details</p>
              <h1 className="mt-3 max-w-md font-serif text-3xl leading-tight text-[#f8f0e3] sm:text-4xl">
                {product?.name || "Product"}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-[#C9A54B]">{formatPrice(product?.price || 12450)}</span>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="bg-[#C9A54B] hover:bg-[#B08F3E] text-white px-5 py-2 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
              <SizeSelector
                sizes={product?.sizes}
                selectedSize={selectedSize}
                onSelect={setSelectedSize}
              />
            </div>
          </motion.div>

          {/* Rating ring panel */}
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex items-center gap-6 rounded-3xl border border-[#C9A54B]/20 bg-white/[0.04] px-8 py-7 backdrop-blur-sm"
          >
            <RatingRing value={RATING_SUMMARY.average} />
            <div className="border-l border-white/10 pl-6">
              <StarRow rating={Math.round(RATING_SUMMARY.average)} size={16} />
              <p className="mt-2 text-sm text-[#d9c2a8]">{RATING_SUMMARY.total} verified reviews</p>
              <p className="mt-0.5 text-xs text-[#9a8470]">96% would recommend</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Review Body ─────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-6 py-14 sm:px-10 md:px-14">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#C9A54B]/5 blur-3xl" />

        <div className="grid grid-cols-1 gap-12 md:grid-cols-[0.85fr_1.15fr]">

          {/* ── Sidebar ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="md:sticky md:top-28 md:self-start"
          >
            {/* Breakdown card */}
            <div className="overflow-hidden rounded-3xl bg-[#1a1610] p-7 shadow-[0_25px_60px_-20px_rgba(26,22,16,0.5)] sm:p-8">
              {/* Gold top accent */}
              <div className="mb-5 h-[2px] w-full bg-gradient-to-r from-[#C9A54B] via-[#DEB96E] to-transparent rounded-full" />

              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A54B]">Rating Breakdown</p>
              <div className="mt-5 space-y-1">
                {RATING_SUMMARY.distribution.map(({ stars, count }) => (
                  <RatingBar
                    key={stars}
                    stars={stars}
                    count={count}
                    total={RATING_SUMMARY.total}
                    active={starFilter === stars}
                    onClick={() => setStarFilter((prev) => (prev === stars ? null : stars))}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setFormOpen((v) => !v)}
                className="group relative mt-7 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#C9A54B] to-[#B8912F] px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_14px_30px_-10px_rgba(201,165,75,0.55)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                {formOpen ? 'Cancel' : 'Write a Review'}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </div>

            {/* Trust note */}
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#E8DDD0] bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm">
              <QuoteMark className="h-5 w-7 flex-none text-[#C9A54B]" />
              <p className="text-xs leading-relaxed text-[#9a8a7a]">
                Reviews are from customers who purchased this piece. Photos and ratings are kept as submitted.
              </p>
            </div>
          </motion.div>

          {/* ── Reviews Column ── */}
          <div>
            {/* Write-a-review form */}
            <AnimatePresence>
              {formOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="relative mb-10 rounded-3xl border border-[#E8DDD0] bg-white/90 p-7 shadow-[0_25px_60px_-20px_rgba(42,33,26,0.15)] sm:p-9">
                    {/* Gold top line */}
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#C9A54B] to-transparent rounded-full" />

                    <button
                      type="button"
                      onClick={() => setFormOpen(false)}
                      aria-label="Close form"
                      className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1610] hover:bg-[#2a2218] transition-colors"
                    >
                      <CloseIcon />
                    </button>

                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A54B]">Share Your Experience</p>
                    <h2 className="mb-6 mt-2 font-serif text-2xl text-[#2A211A]">Write a Review</h2>

                    <form onSubmit={handleSubmitReview} className="space-y-5">
                      <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#7a6a5a]">
                          Your Rating
                        </label>
                        <StarPicker value={form.rating} onChange={(n) => setForm((p) => ({ ...p, rating: n }))} />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <input type="text" name="name" placeholder="Your name"
                          value={form.name} onChange={handleFormChange} required className={inputClass} />
                        <input type="email" name="email" placeholder="Your email"
                          value={form.email} onChange={handleFormChange} required className={inputClass} />
                      </div>

                      <input type="text" name="title" placeholder="Review title"
                        value={form.title} onChange={handleFormChange} className={inputClass} />

                      <textarea name="body"
                        placeholder="How does it look and feel? Fit, finish, occasion you wore it for — be as detailed as you'd like"
                        value={form.body} onChange={handleFormChange} rows={4} required
                        className={`${inputClass} resize-none`}
                      />

                      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-dashed border-[#DDD4C7] px-4 py-2.5 text-xs font-medium text-[#7a6a5a] transition-colors hover:border-[#C9A54B] hover:text-[#C9A54B]">
                        <CameraIcon size={16} />
                        {form.photo ? form.photo : 'Add a photo (optional)'}
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                      </label>

                      <button
                        type="submit"
                        disabled={submitStatus === 'submitting' || form.rating === 0}
                        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#C9A54B] to-[#B8912F] px-9 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_14px_30px_-10px_rgba(201,165,75,0.55)] transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        <span className="relative z-10">
                          {submitStatus === 'submitting' ? 'Submitting…' : 'Submit Review'}
                        </span>
                        <SendIcon />
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      </button>

                      {form.rating === 0 && (
                        <p className="text-xs text-[#9a8a7a]">Select a star rating to enable submit.</p>
                      )}
                      {submitStatus === 'success' && (
                        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                          ✓ Thank you — your review has been posted.
                        </p>
                      )}
                      {submitStatus === 'error' && (
                        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                          Something went wrong. Please try again.
                        </p>
                      )}
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sort / filter bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <p className="font-serif text-2xl text-[#2A211A]">
                  {filteredSorted.length} {filteredSorted.length === 1 ? 'Review' : 'Reviews'}
                </p>
                {starFilter && (
                  <span className="flex items-center gap-1.5 rounded-full bg-[#C9A54B]/15 px-3 py-1 text-xs font-medium text-[#C9A54B]">
                    {starFilter} star
                    <button type="button" onClick={() => setStarFilter(null)} aria-label="Clear filter">
                      <CloseIcon size={10} stroke="#C9A54B" />
                    </button>
                  </span>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-[#DDD4C7] px-4 py-2 text-xs font-medium uppercase tracking-wide text-[#7a6a5a] transition-colors hover:border-[#C9A54B] hover:text-[#C9A54B]"
                >
                  Sort: {SORT_OPTIONS.find((o) => o.value === sort)?.label}
                  <ChevronDownIcon />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white py-1.5 shadow-[0_18px_40px_-15px_rgba(42,33,26,0.25)]"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <li key={opt.value}>
                          <button
                            type="button"
                            onClick={() => { setSort(opt.value); setSortOpen(false) }}
                            className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#C9A54B]/10 ${
                              sort === opt.value ? 'text-[#C9A54B] font-medium' : 'text-[#2A211A]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Review cards */}
            <div className="mt-6 space-y-5">
              {filteredSorted.length === 0 && (
                <p className="py-10 text-center text-sm text-[#9a8a7a]">No reviews match this filter yet.</p>
              )}

              {filteredSorted.slice(0, visibleCount).map((r, i) => {
                const [from, to] = gradientFor(r.name)
                return (
                  <motion.article
                    key={r.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="group rounded-3xl border border-[#E8DDD0] bg-white/90 p-6 shadow-[0_10px_30px_-18px_rgba(42,33,26,0.2)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A54B]/40 hover:shadow-[0_20px_50px_-15px_rgba(42,33,26,0.25)] sm:p-7"
                  >
                    <div className="flex items-start gap-3.5">
                      <span
                        className="flex h-11 w-11 flex-none items-center justify-center rounded-full font-serif text-base text-white shadow-sm"
                        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                      >
                        {r.name.charAt(0)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-[#2A211A]">{r.name}</h3>
                          {r.verified && (
                            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#5f7d54] to-[#7a9b6e] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                              <ShieldCheckIcon size={11} />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <StarRow rating={r.rating} size={13} />
                          <span className="text-xs text-[#9a8a7a]">{formatDate(r.date)}</span>
                        </div>
                      </div>
                    </div>

                    <h4 className="mt-4 font-serif text-lg text-[#2A211A]">{r.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-[#7a6a5a]">{r.body}</p>

                    {r.photos.length > 0 && (
                      <div className="mt-4 flex gap-2.5">
                        {r.photos.map((src, idx) => (
                          <div
                            key={idx}
                            className="h-16 w-16 overflow-hidden rounded-xl border border-[#E8DDD0] transition-transform duration-300 hover:scale-105"
                          >
                            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-5 flex items-center justify-between border-t border-[#F0E9DF] pt-4">
                      <button
                        type="button"
                        onClick={() => handleHelpful(r.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#7a6a5a] transition-colors hover:text-[#C9A54B]"
                      >
                        <ThumbsUpIcon size={14} stroke="currentColor" />
                        Helpful ({r.helpful})
                      </button>
                      <span className="text-[10px] uppercase tracking-wide text-[#C9A54B] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        AriyaShop Customer
                      </span>
                    </div>
                  </motion.article>
                )
              })}
            </div>

            {/* Load more */}
            {visibleCount < filteredSorted.length && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((v) => v + 3)}
                  className="group relative overflow-hidden rounded-full border border-[#DDD4C7] px-8 py-3 text-xs font-semibold uppercase tracking-wider text-[#7a6a5a] transition-all duration-300 hover:border-[#C9A54B] hover:text-[#C9A54B]"
                >
                  Load More Reviews
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#C9A54B]/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}


export default ProductReviews
