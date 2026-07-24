require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const generateSlug = require('./utils/generateSlug');
const calculateDiscount = require('./utils/calculateDiscount');
const { getRandomRating, getRandomReviewCount } = require('./utils/generateRating');

const staticProducts = [
  {
    id: "test1",
    name: "Diamond Ring",
    category: "Rings",
    price: 1,
    originalPrice: 1,
    rating: 5.0,
    reviewsCount: 1,
    isBestSeller: true,
    isNewArrival: true,
    isSale: false,
    occasion: "Casual",
    finish: "Glossy",
    collection: "Test",
    stockCount: 100,
    description: "This is a dummy product for testing live Razorpay checkout flows at Rs 1.",
    image: "/diamond_ring.png",
    hoverImage: "/diamond_ring.png"
  },
  {
    id: "p1",
    name: "Traditional Gold Bangles",
    category: "Bangles",
    price: 1299,
    originalPrice: 1799,
    rating: 4.8,
    reviewsCount: 120,
    isBestSeller: true,
    isNewArrival: false,
    isSale: true,
    occasion: "Festive",
    finish: "Glossy",
    collection: "Heritage",
    stockCount: 5,
    description: "Exquisitely crafted traditional gold bangles with intricate textures, designed to add a royal touch to your festive and wedding attire.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p2",
    name: "Minimal Charm Bracelet",
    category: "Bracelets",
    price: 899,
    originalPrice: 1159,
    rating: 4.6,
    reviewsCount: 34,
    isBestSeller: false,
    isNewArrival: true,
    isSale: true,
    occasion: "Daily Wear",
    finish: "Polished",
    collection: "Modern Minimalist",
    stockCount: 12,
    description: "A delicate 925 sterling silver chain bracelet adorned with a single sparkling cubic zirconia charm, perfect for daily elegance.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p3",
    name: "Floral Brooch Pin",
    category: "Brooch",
    price: 699,
    originalPrice: 999,
    rating: 4.7,
    reviewsCount: 64,
    isBestSeller: false,
    isNewArrival: false,
    isSale: true,
    occasion: "Office Wear",
    finish: "Matte",
    collection: "Nature's Grace",
    stockCount: 8,
    description: "Add sophistication to your blazers and dresses with this beautiful gold-plated floral brooch featuring a central freshwater pearl.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p4",
    name: "Pearl Drop Earrings",
    category: "Earrings",
    price: 999,
    originalPrice: 1299,
    rating: 4.9,
    reviewsCount: 92,
    isBestSeller: true,
    isNewArrival: true,
    isSale: true,
    occasion: "Festive",
    finish: "Glossy",
    collection: "Classic Pearl",
    stockCount: 3,
    description: "Elegant drop earrings featuring luminous, handpicked freshwater pearls suspended from sterling silver hooks. Timeless and sophisticated.",
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p5",
    name: "Twist Knot Ring",
    category: "Rings",
    price: 699,
    originalPrice: 999,
    rating: 4.5,
    reviewsCount: 59,
    isBestSeller: false,
    isNewArrival: false,
    isSale: true,
    occasion: "Daily Wear",
    finish: "Polished",
    collection: "Modern Minimalist",
    stockCount: 15,
    description: "A beautifully twisted gold-plated band representing eternal bonds. Its minimalist design makes it perfect for stacking or wearing alone.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p6",
    name: "Butterfly Stud Earrings",
    category: "Earrings",
    price: 749,
    originalPrice: 999,
    rating: 4.8,
    reviewsCount: 112,
    isBestSeller: true,
    isNewArrival: false,
    isSale: true,
    occasion: "Daily Wear",
    finish: "Glossy",
    collection: "Nature's Grace",
    stockCount: 20,
    description: "Charming butterfly-shaped stud earrings encrusted with micro-pave cubic zirconia stones, bringing a touch of whimsy to your style.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p7",
    name: "Beaded Gold Bracelet",
    category: "Bracelets",
    price: 599,
    originalPrice: 759,
    rating: 4.4,
    reviewsCount: 78,
    isBestSeller: false,
    isNewArrival: false,
    isSale: true,
    occasion: "Daily Wear",
    finish: "Glossy",
    collection: "Modern Minimalist",
    stockCount: 9,
    description: "Elastic beaded bracelet featuring highly polished 14k gold-plated beads. An everyday accessory that stacks beautifully.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p8",
    name: "Kundan Brooch",
    category: "Brooch",
    price: 1199,
    originalPrice: 1599,
    rating: 4.7,
    reviewsCount: 58,
    isBestSeller: true,
    isNewArrival: true,
    isSale: true,
    occasion: "Wedding",
    finish: "Glossy",
    collection: "Heritage",
    stockCount: 4,
    description: "A magnificent ethnic brooch handcrafted with premium Kundan stones and delicate hanging pearls. Ideal for weddings and festive occasions.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p9",
    name: "Classic Hoop Earrings",
    category: "Earrings",
    price: 899,
    originalPrice: 1159,
    rating: 4.7,
    reviewsCount: 87,
    isBestSeller: false,
    isNewArrival: false,
    isSale: true,
    occasion: "Office Wear",
    finish: "Polished",
    collection: "Modern Minimalist",
    stockCount: 14,
    description: "Medium-sized classic hoop earrings plated in 18k gold. Extremely lightweight and comfortable for all-day wear.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p10",
    name: "Layered Pearl Necklace",
    category: "Necklaces",
    price: 1499,
    originalPrice: 1999,
    rating: 4.9,
    reviewsCount: 104,
    isBestSeller: true,
    isNewArrival: false,
    isSale: true,
    occasion: "Wedding",
    finish: "Glossy",
    collection: "Classic Pearl",
    stockCount: 6,
    description: "A breathtaking double-stranded necklace featuring graded freshwater pearls and a sterling silver clasp. The epitome of luxury.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p11",
    name: "Stone Stud Earrings",
    category: "Earrings",
    price: 799,
    originalPrice: 1099,
    rating: 4.6,
    reviewsCount: 48,
    isBestSeller: false,
    isNewArrival: true,
    isSale: true,
    occasion: "Daily Wear",
    finish: "Polished",
    collection: "Modern Minimalist",
    stockCount: 11,
    description: "Sparkling heart-shaped cubic zirconia studs mounted on sterling silver claws. Simple, shiny, and beautiful.",
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p12",
    name: "Organizer Box",
    category: "Organizer",
    price: 1099,
    originalPrice: 1499,
    rating: 4.8,
    reviewsCount: 43,
    isBestSeller: true,
    isNewArrival: false,
    isSale: true,
    occasion: "Daily Wear",
    finish: "Matte",
    collection: "Home & Care",
    stockCount: 7,
    description: "A luxurious velvet jewellery organizer box with multiple compartments for rings, earrings, necklaces, and bracelets. Travel-friendly and soft.",
    image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p13",
    name: "Emerald Solitaire Ring",
    category: "Rings",
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviewsCount: 38,
    isBestSeller: true,
    isNewArrival: true,
    isSale: true,
    occasion: "Festive",
    finish: "Glossy",
    collection: "Heritage",
    stockCount: 2,
    description: "An exquisite emerald cut faux-emerald stone claw-set in an 18k gold-plated band, surrounded by tiny cubic zirconia highlights.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p14",
    name: "Sleek Silver Bangle",
    category: "Bangles",
    price: 799,
    originalPrice: 999,
    rating: 4.5,
    reviewsCount: 29,
    isBestSeller: false,
    isNewArrival: false,
    isSale: false,
    occasion: "Office Wear",
    finish: "Polished",
    collection: "Modern Minimalist",
    stockCount: 18,
    description: "A simple, sleek 925 sterling silver bangle with a polished finish. Can be worn singly or stacked for a contemporary look.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p15",
    name: "Diamond Pendant Necklace",
    category: "Necklaces",
    price: 2499,
    originalPrice: 2999,
    rating: 4.9,
    reviewsCount: 74,
    isBestSeller: true,
    isNewArrival: true,
    isSale: true,
    occasion: "Wedding",
    finish: "Polished",
    collection: "Heritage",
    stockCount: 3,
    description: "A premium gold-plated chain holding a brilliant solitaire-style cubic zirconia pendant that sparkles with diamond-like fire.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p16",
    name: "Velvet Ring Organizer",
    category: "Organizer",
    price: 699,
    originalPrice: 899,
    rating: 4.7,
    reviewsCount: 22,
    isBestSeller: false,
    isNewArrival: true,
    isSale: true,
    occasion: "Daily Wear",
    finish: "Matte",
    collection: "Home & Care",
    stockCount: 15,
    description: "A compact velvet ring tray with 7 slots to keep your rings organized and dust-free. Perfect for vanity tables.",
    image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&q=80"
  }
];

const seedProducts = async () => {
  try {
    await connectDB();

    // 1. Clean existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    // 2. Map and insert products
    const processedProducts = staticProducts.map(p => {
      const slug = generateSlug(p.name);
      const discountPercentage = calculateDiscount(p.price, p.originalPrice);
      
      return {
        name: p.name,
        slug: slug,
        sku: `ARIYA-${p.category.toUpperCase()}-${p.id.toUpperCase()}`,
        category: p.category,
        collection: p.collection,
        image: p.image,
        hoverImage: p.hoverImage,
        galleryImages: [p.image, p.hoverImage].filter(Boolean),
        price: p.price,
        originalPrice: p.originalPrice || p.price,
        discountPercentage: discountPercentage,
        stockCount: p.stockCount || 10,
        lowStockAlert: 5,
        rating: p.rating || getRandomRating(),
        reviewsCount: p.reviewsCount || getRandomReviewCount(),
        description: p.description,
        occasion: p.occasion ? [p.occasion] : ['Daily Wear'],
        finish: p.finish || 'Polished',
        isBestSeller: p.isBestSeller || false,
        isNewArrival: p.isNewArrival || false,
        isSale: p.isSale || false,
        estimatedDelivery: '3–5 Days',
        published: true,
        featured: p.isBestSeller || false,
        metaTitle: `${p.name} | Ariya Shop`,
        metaDescription: p.description.slice(0, 150),
        sizes: p.category === 'Bangles' ? [
          { value: '2.2', available: true },
          { value: '2.4', available: true },
          { value: '2.6', available: true },
          { value: '2.8', available: true }
        ] : []
      };
    });

    await Product.insertMany(processedProducts);
    console.log(`Successfully seeded ${processedProducts.length} products to database.`);

    // Seed default Admin user
    const User = require('./models/User');
    await User.deleteMany({ email: 'admin@ariyashop.com' });
    await User.create({
      name: 'Ariya Admin',
      email: 'admin@ariyashop.com',
      password: 'admin321',
      role: 'admin'
    });
    console.log('Successfully seeded Admin user.');

    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedProducts();
