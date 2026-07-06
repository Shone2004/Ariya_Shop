import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import apiClient from '../utils/apiClient'

const INITIAL_FORM = { name: '', email: '', phone: '', subject: '', message: '' }

/* ─── Icon set ─── */
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94z" />
  </svg>
)
const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#1DA1F2" aria-hidden="true">
    <path d="M22 5.92c-.74.33-1.53.55-2.36.65a4.12 4.12 0 0 0 1.8-2.27 8.2 8.2 0 0 1-2.6 1c-.75-.8-1.82-1.3-3-1.3-2.27 0-4.1 1.84-4.1 4.11 0 .32.04.64.1.94A11.65 11.65 0 0 1 3.4 4.7a4.1 4.1 0 0 0 1.27 5.48c-.67-.02-1.3-.2-1.85-.51v.05c0 1.99 1.42 3.66 3.3 4.03-.34.1-.71.14-1.08.14-.26 0-.52-.02-.77-.07.52 1.64 2.05 2.83 3.85 2.86A8.27 8.27 0 0 1 2 18.57a11.66 11.66 0 0 0 6.32 1.85c7.58 0 11.72-6.29 11.72-11.74l-.01-.53A8.3 8.3 0 0 0 22 5.92z" />
  </svg>
)
const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF0000" aria-hidden="true">
    <path d="M21.58 7.2a2.78 2.78 0 0 0-1.95-1.97C17.9 4.75 12 4.75 12 4.75s-5.9 0-7.63.48A2.78 2.78 0 0 0 2.42 7.2 29 29 0 0 0 2 12a29 29 0 0 0 .42 4.8 2.78 2.78 0 0 0 1.95 1.97c1.73.48 7.63.48 7.63.48s5.9 0 7.63-.48a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 22 12a29 29 0 0 0-.42-4.8zM10 15.02V8.98L15.27 12 10 15.02z" />
  </svg>
)
const InstagramIcon = ({ size = 18 }) => {
  const gradId = 'ig-grad-contact'
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="25%" stopColor="#FCAF45" />
          <stop offset="50%" stopColor="#E1306C" />
          <stop offset="75%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill={`url(#${gradId})`} />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="#fff" />
    </svg>
  )
}
const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <rect width="24" height="24" rx="4" fill="#0A66C2" />
    <path
      fill="#fff"
      d="M7.12 9.6H3.98v9.85h3.14V9.6zM5.55 4.95a1.82 1.82 0 1 0 0 3.64 1.82 1.82 0 0 0 0-3.64zM20.45 19.45h-3.14v-5.17c0-1.23-.44-2.07-1.55-2.07-.84 0-1.34.57-1.56 1.12-.08.2-.1.47-.1.75v5.37H10.96s.04-8.72 0-9.85h3.14v1.4c.42-.64 1.16-1.55 2.83-1.55 2.07 0 3.62 1.35 3.62 4.25v5.75z"
    />
  </svg>
)

const PinIcon = ({ size = 22, stroke = '#C9A54B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden="true">
    <path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)
const MailIcon = ({ size = 22, stroke = '#C9A54B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
)
const PhoneIcon = ({ size = 22, stroke = '#C9A54B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z" />
  </svg>
)
const ClockIcon = ({ size = 22, stroke = '#C9A54B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
)
const ShieldIcon = ({ size = 18, stroke = '#C9A54B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden="true">
    <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)
const HeadsetIcon = ({ size = 18, stroke = '#C9A54B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden="true">
    <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
    <rect x="2.5" y="13" width="4" height="6" rx="1.4" />
    <rect x="17.5" y="13" width="4" height="6" rx="1.4" />
    <path d="M19.5 19v.5a3 3 0 0 1-3 3H13" />
  </svg>
)
const BoltIcon = ({ size = 18, stroke = '#C9A54B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
  </svg>
)
const HeartIcon = ({ size = 18, stroke = '#C9A54B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden="true">
    <path d="M12 20.5s-7.5-4.6-9.8-9.3C.6 7.9 2 4.5 5.4 3.6c2-.5 3.9.3 5 1.9l1.6 2.3 1.6-2.3c1.1-1.6 3-2.4 5-1.9 3.4.9 4.8 4.3 3.2 7.6-2.3 4.7-9.8 9.3-9.8 9.3z" />
  </svg>
)
const ArrowRightIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
const SendIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4 20-7z" />
  </svg>
)
const ExternalLinkIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <path d="M15 3h6v6M10 14 21 3" />
  </svg>
)

const Sparkle = ({ className = '', fill = '#C9A54B' }) => (
  <svg viewBox="0 0 24 24" className={className} fill={fill} aria-hidden="true">
    <path d="M12 0c.6 5.6 1.4 9.2 5 12-3.6 2.8-4.4 6.4-5 12-.6-5.6-1.4-9.2-5-12 3.6-2.8 4.4-6.4 5-12z" />
  </svg>
)

/* ─── Data ─── */
const CONTACT_INFO = [
  {
    Icon: PhoneIcon,
    title: 'Phone',
    body: '+91 8329175870\nMon – Sat: 9:00AM – 6:00PM',
    href: 'tel:+918329175870',
  },
  {
    Icon: MailIcon,
    title: 'Email',
    body: 'gunjan@ariyashop.in\nWe reply within 24 hours',
    href: 'mailto:gunjan@ariyashop.in',
  },
  {
    Icon: PinIcon,
    title: 'Address',
    body: 'Ariya Proprietor, 401, Saraswatikunj Apartment,\nOppo. to Prerana Bhavan, Pune, Maharashtra, 411033',
  },
  {
    Icon: ClockIcon,
    title: 'Working Hours',
    body: 'Open: 8:00AM – 6:00PM\nSaturday – Sunday: Closed',
  },
]

const SOCIALS = [
  {
    Icon: InstagramIcon,
    label: 'Instagram',
    href: 'https://www.instagram.com/ariya.jeweller',
  },
  {
    Icon: PinIcon, // or create a PinterestIcon if you want custom branding
    label: 'Pinterest',
    href: 'https://www.pinterest.com/nandeshwargunjan3/',
  },
  {
    Icon: YoutubeIcon,
    label: 'YouTube',
    href: 'https://www.youtube.com/@ariyajewellers',
  },
]

const FEATURES = [
  { Icon: BoltIcon, title: 'Fast Response', desc: 'We reply within 24 hours' },
  { Icon: HeadsetIcon, title: 'Customer Support', desc: 'Friendly support for all your queries' },
  { Icon: ShieldIcon, title: 'Secure & Safe', desc: 'Your information is always protected' },
  { Icon: HeartIcon, title: 'Satisfaction', desc: 'We\'re here to make you happy' },
]

/* ─── Lazy Map ─── */
const LazyMap = () => {
  const containerRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { setShouldLoad(true); observer.disconnect() }
        })
      },
      { rootMargin: '200px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="relative h-[420px] w-full overflow-hidden sm:h-[480px]">
      {shouldLoad ? (
        <iframe
          title="AriyaShop location"
          src="https://www.google.com/maps?q=Saraswatikunj+Apartment,+Pune,+Maharashtra,+411033&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'sepia(0.18) saturate(0.9) contrast(1.05)' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#F6F1EB] text-sm text-[#8a7a6a]">
          Loading map…
        </div>
      )}
    </div>
  )
}

/* ─── Main Component ─── */
const Contact = () => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle')
  const [focusedField, setFocusedField] = useState(null)
  const [subscribeEmail, setSubscribeEmail] = useState('')
  const [subscribeStatus, setSubscribeStatus] = useState('idle')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await apiClient("/contact", {
        method: "POST",
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setStatus('success')
        setForm(INITIAL_FORM)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setSubscribeStatus('submitting')
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      setSubscribeStatus('success')
      setSubscribeEmail('')
    } catch {
      setSubscribeStatus('error')
    }
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
    }),
  }

  const inputClass = (field) =>
    `peer w-full border-b bg-transparent px-1 pb-3 pt-2 text-[15px] text-[#2A211A] outline-none transition-colors placeholder:text-transparent ${
      focusedField === field ? 'border-[#C9A54B]' : 'border-[#DDD4C7]'
    }`

  const floatingLabel =
    'pointer-events-none absolute left-1 top-2 text-[15px] text-[#9a8a7a] transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-[#C9A54B] peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-xs'

  return (
    <div className="w-full overflow-hidden bg-[#FCF9F5]">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-[#1a1610] sm:min-h-[600px] md:min-h-[680px]">
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#C9A54B]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#C9A54B]/10 blur-3xl" />

        <motion.img
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          src="/hero.jpg"
          alt="AriyaShop jewellery"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[68%_15%]"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1610] via-[#1a1610]/80 to-[#1a1610]/10 sm:to-[#1a1610]/0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1610]/70 via-transparent to-transparent" />

        {/* Gold top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A54B] to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 md:px-14">
          <div className="relative max-w-xl">
            {/* Sparkles */}
            <Sparkle className="pointer-events-none absolute -top-6 right-8 h-4 w-4 opacity-60" />
            <Sparkle className="pointer-events-none absolute top-16 -left-6 h-3 w-3 opacity-40" />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A54B]"
            >
              Get In Touch
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative mt-4 font-serif text-4xl leading-[1.15] text-[#f8f0e3] sm:text-5xl md:text-[3.3rem]"
            >
              We&apos;d Love To Hear From <span className="italic text-[#C9A54B]">You</span>
            </motion.h1>

            <motion.span
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              style={{ transformOrigin: 'left' }}
              className="relative mt-5 block h-[2px] w-16 bg-gradient-to-r from-[#C9A54B] to-[#DEB96E]"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative mt-6 max-w-sm text-[15px] leading-relaxed text-[#cdbba8]"
            >
              Have a question or need assistance? Our team is here to help.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42 }}
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative mt-9 inline-flex w-fit items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#C9A54B] to-[#B8912F] px-9 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_14px_40px_-10px_rgba(201,165,75,0.55)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-10px_rgba(201,165,75,0.65)]"
            >
              <span className="relative z-10">Let&apos;s Talk</span>
              <ArrowRightIcon />
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ── Features Strip ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1a1610] py-14">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C9A54B]/5 via-transparent to-[#C9A54B]/5" />
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-6 sm:grid-cols-4 sm:px-10 md:px-14">
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="flex items-start gap-3.5"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-[#C9A54B]/30 bg-[#C9A54B]/10">
                <Icon size={18} />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-[#f6edd8]">{title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-neutral-400">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Info + Form ─────────────────────────────────────────── */}
      <section id="contact-form" className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 md:px-14">
        {/* subtle decorative blobs */}
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#C9A54B]/6 blur-3xl" />
        <div className="pointer-events-none absolute left-0 bottom-0 h-64 w-64 rounded-full bg-[#C9A54B]/4 blur-3xl" />

        <div className="grid grid-cols-1 gap-16 md:grid-cols-[0.95fr_1.15fr]">

          {/* Left: info */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A54B]">Contact Information</p>
            <h2 className="mt-3 font-serif text-3xl text-[#2A211A] sm:text-4xl">Let&apos;s Connect</h2>
            <div className="mt-2 h-[2px] w-10 bg-gradient-to-r from-[#C9A54B] to-[#DEB96E]" />

            <div className="mt-10 space-y-7">
              {CONTACT_INFO.map(({ Icon, title, body, href }, i) => (
                <motion.div
                  key={title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.4 }}
                  className="group flex items-start gap-4"
                >
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-[#F6F1EB] border border-[#E8DDD0] shadow-sm transition-all duration-300 group-hover:border-[#C9A54B]/50 group-hover:bg-[#fdf6e8]">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="font-serif text-[17px] text-[#2A211A]">{title}</h3>
                    {href ? (
                      <a href={href} className="mt-1 block whitespace-pre-line text-sm leading-relaxed text-[#7a6a5a] transition-colors hover:text-[#C9A54B]">
                        {body}
                      </a>
                    ) : (
                      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[#7a6a5a]">{body}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Socials */}
            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A54B]">Follow Us</p>
              <div className="mt-4 flex gap-3">
                {SOCIALS.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6F1EB] border border-[#E8DDD0] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A54B]/60 hover:shadow-[0_10px_22px_-8px_rgba(201,165,75,0.45)]"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="relative rounded-3xl border border-[#E8DDD0] bg-white/80 p-8 shadow-[0_25px_70px_-20px_rgba(42,33,26,0.15)] backdrop-blur-sm sm:p-10"
          >
            {/* Gold corner accent */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#C9A54B] to-transparent rounded-full" />

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A54B]">Send Us A Message</p>
            <h2 className="mb-8 mt-3 font-serif text-3xl text-[#2A211A] sm:text-4xl">We&apos;re Here to Help</h2>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                <div className="relative">
                  <input
                    type="text" name="name" id="contact-name" placeholder="Your name"
                    value={form.name} onChange={handleChange}
                    onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                    required className={inputClass('name')}
                  />
                  <label htmlFor="contact-name" className={floatingLabel}>Your name</label>
                </div>
                <div className="relative">
                  <input
                    type="email" name="email" id="contact-email" placeholder="Your email"
                    value={form.email} onChange={handleChange}
                    onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                    required className={inputClass('email')}
                  />
                  <label htmlFor="contact-email" className={floatingLabel}>Your email</label>
                </div>
              </div>

              <div className="relative">
                <input
                  type="tel" name="phone" id="contact-phone" placeholder="Phone number"
                  value={form.phone} onChange={handleChange}
                  onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)}
                  className={inputClass('phone')}
                />
                <label htmlFor="contact-phone" className={floatingLabel}>Phone number</label>
              </div>

              <div className="relative">
                <input
                  type="text" name="subject" id="contact-subject" placeholder="Subject"
                  value={form.subject} onChange={handleChange}
                  onFocus={() => setFocusedField('subject')} onBlur={() => setFocusedField(null)}
                  className={inputClass('subject')}
                />
                <label htmlFor="contact-subject" className={floatingLabel}>Subject</label>
              </div>

              <div className="relative">
                <textarea
                  name="message" id="contact-message" placeholder="Your message"
                  value={form.message} onChange={handleChange}
                  onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)}
                  rows={5} required className={`${inputClass('message')} resize-none`}
                />
                <label htmlFor="contact-message" className={floatingLabel}>Your message</label>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#C9A54B] to-[#B8912F] px-9 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_14px_40px_-10px_rgba(201,165,75,0.55)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-10px_rgba(201,165,75,0.65)] active:translate-y-0 disabled:opacity-60"
              >
                <span className="relative z-10">{status === 'submitting' ? 'Sending…' : 'Send Message'}</span>
                <SendIcon />
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>

              {status === 'success' && (
                <p className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  ✓ Thanks — your message has been sent. We&apos;ll get back to you soon.
                </p>
              )}
              {status === 'error' && (
                <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── Map ─────────────────────────────────────────────────── */}
      <section className="relative">
        <LazyMap />
        <a
          href="https://www.google.com/maps?q=Saraswatikunj+Apartment,+Pune,+Maharashtra,+411033"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#2A211A] shadow-lg backdrop-blur transition-all duration-200 hover:bg-white hover:shadow-xl"
        >
          Open in Maps <ExternalLinkIcon />
        </a>
      </section>

      {/* ── Newsletter ──────────────────────────────────────────── */}
      <section className="px-6 py-16 sm:px-10 md:px-14">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto flex max-w-5xl flex-col items-center gap-8 overflow-hidden rounded-3xl border border-[#E8DDD0] bg-white/80 px-8 py-10 shadow-[0_20px_60px_-20px_rgba(42,33,26,0.12)] backdrop-blur-sm sm:flex-row sm:justify-between sm:px-12"
        >
          {/* Gold top bar */}
          <div className="absolute left-12 right-12 top-0 h-[2px] hidden bg-gradient-to-r from-transparent via-[#C9A54B] to-transparent sm:block" />

          <div className="flex items-center gap-4 text-left">
            <span className="flex h-13 w-13 flex-none items-center justify-center rounded-2xl bg-[#1a1610] shadow-md">
              <MailIcon size={20} stroke="#C9A54B" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A54B]">Stay Connected</p>
              <h3 className="mt-1 font-serif text-2xl text-[#2A211A]">Subscribe for Updates</h3>
              <p className="mt-1 text-sm text-[#9a8a7a]">Get the latest offers, arrivals and more.</p>
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
            <input
              type="email" required placeholder="Your email address"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              className="w-full rounded-full border border-[#DDD4C7] bg-transparent px-5 py-3 text-sm text-[#2A211A] outline-none placeholder:text-[#9a8a7a] focus:border-[#C9A54B] transition-colors"
            />
            <button
              type="submit"
              disabled={subscribeStatus === 'submitting'}
              className="flex-none rounded-full bg-gradient-to-r from-[#C9A54B] to-[#B8912F] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_8px_20px_-8px_rgba(201,165,75,0.5)] transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
            >
              {subscribeStatus === 'submitting' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        </motion.div>

        {subscribeStatus === 'success' && (
          <p className="mx-auto mt-4 max-w-5xl text-center text-sm text-green-700">
            You&apos;re subscribed — welcome to the AriyaShop family!
          </p>
        )}
      </section>

    </div>
  )
}

export default Contact
