require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Food = require('./models/Food');

const connectDB = require('./config/db');

const vendors = [
  {
    name: "The Burger Lab",
    description: "Gourmet burgers crafted with premium ingredients. Home of the famous Double Smash Burger.",
    location: { address: "12, MG Road", city: "Mumbai" },
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800",
    coverImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200",
    rating: 4.7,
    totalRatings: 1245,
    isOpen: true,
    deliveryTime: "25-35 min",
    minOrder: 150,
    cuisineTypes: ["Burgers", "Fast Food", "American"],
  },
  {
    name: "Pizza Paradise",
    description: "Wood-fired artisan pizzas with authentic Italian recipes. 30+ varieties.",
    location: { address: "56, Linking Road", city: "Mumbai" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200",
    rating: 4.5,
    totalRatings: 987,
    isOpen: true,
    deliveryTime: "30-40 min",
    minOrder: 200,
    cuisineTypes: ["Pizza", "Italian", "Pasta"],
  },
  {
    name: "Biryani House",
    description: "Authentic Hyderabadi dum biryani cooked in traditional clay pots.",
    location: { address: "88, Bandra West", city: "Mumbai" },
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800",
    coverImage: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1200",
    rating: 4.8,
    totalRatings: 2341,
    isOpen: true,
    deliveryTime: "35-50 min",
    minOrder: 250,
    cuisineTypes: ["Biryani", "North Indian", "Mughlai"],
  },
  {
    name: "Dragon Palace",
    description: "Authentic Chinese cuisine with Indo-Chinese fusion specialties.",
    location: { address: "23, Andheri East", city: "Mumbai" },
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800",
    coverImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200",
    rating: 4.3,
    totalRatings: 678,
    isOpen: false,
    deliveryTime: "30-45 min",
    minOrder: 180,
    cuisineTypes: ["Chinese", "Indo-Chinese", "Momos"],
  },
  {
    name: "South Spice",
    description: "Traditional South Indian flavors — dosas, idli, vada, and filter coffee.",
    location: { address: "7, Matunga", city: "Mumbai" },
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800",
    coverImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200",
    rating: 4.6,
    totalRatings: 1567,
    isOpen: true,
    deliveryTime: "20-30 min",
    minOrder: 120,
    cuisineTypes: ["South Indian", "Breakfast", "Healthy"],
  },
  {
    name: "Sweet Cravings",
    description: "Desserts, cakes, and boba teas that satisfy every sweet craving.",
    location: { address: "34, Colaba", city: "Mumbai" },
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800",
    coverImage: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200",
    rating: 4.4,
    totalRatings: 892,
    isOpen: true,
    deliveryTime: "15-25 min",
    minOrder: 100,
    cuisineTypes: ["Desserts", "Bakery", "Drinks"],
  },
];

const foodsByVendor = (vendorId, idx) => {
  const allFoods = [
    // Vendor 0: Burger Lab
    [
      { name: "Classic Smash Burger", description: "Juicy double-patty smash burger with special sauce, lettuce, cheese & pickles.", price: 249, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800", category: "Burgers", rating: 4.8, isVeg: false, preparationTime: "20-25 min", tags: ["bestseller", "spicy"] },
      { name: "BBQ Chicken Burger", description: "Crispy fried chicken with smoky BBQ sauce and coleslaw.", price: 299, image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800", category: "Burgers", rating: 4.6, isVeg: false, preparationTime: "20-25 min", tags: ["popular"] },
      { name: "Mushroom Swiss Burger", description: "Sautéed mushrooms and melted Swiss cheese on a premium beef patty.", price: 279, image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800", category: "Burgers", rating: 4.5, isVeg: false, preparationTime: "20-25 min", tags: [] },
      { name: "Crispy Fries", description: "Golden crispy fries seasoned with paprika and herbs.", price: 99, image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800", category: "Fast Food", rating: 4.4, isVeg: true, preparationTime: "10 min", tags: ["veg"] },
      { name: "Chocolate Milkshake", description: "Thick and creamy chocolate milkshake topped with whipped cream.", price: 149, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800", category: "Drinks", rating: 4.7, isVeg: true, preparationTime: "10 min", tags: [] },
    ],
    // Vendor 1: Pizza Paradise
    [
      { name: "Margherita Pizza", description: "Classic wood-fired pizza with San Marzano tomatoes, fresh mozzarella, and basil.", price: 349, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800", category: "Pizza", rating: 4.6, isVeg: true, preparationTime: "25-30 min", tags: ["veg", "classic"] },
      { name: "Pepperoni Pizza", description: "Loaded with generous pepperoni slices and mozzarella on a crispy base.", price: 449, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800", category: "Pizza", rating: 4.8, isVeg: false, preparationTime: "25-30 min", tags: ["bestseller"] },
      { name: "BBQ Chicken Pizza", description: "Tender chicken, BBQ sauce, caramelized onions and smoky cheese.", price: 499, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800", category: "Pizza", rating: 4.7, isVeg: false, preparationTime: "30 min", tags: ["popular"] },
      { name: "Pesto Pasta", description: "Al dente penne with homemade basil pesto, cherry tomatoes and pine nuts.", price: 299, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800", category: "North Indian", rating: 4.4, isVeg: true, preparationTime: "20 min", tags: ["veg"] },
    ],
    // Vendor 2: Biryani House
    [
      { name: "Hyderabadi Chicken Biryani", description: "Slow-cooked dum biryani with tender chicken, saffron, and aromatic spices.", price: 349, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", category: "Biryani", rating: 4.9, isVeg: false, preparationTime: "40-50 min", tags: ["bestseller", "spicy"] },
      { name: "Mutton Biryani", description: "Premium goat meat slow-cooked with basmati rice, fried onions, and mint.", price: 449, image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800", category: "Biryani", rating: 4.8, isVeg: false, preparationTime: "45-55 min", tags: ["premium"] },
      { name: "Veg Dum Biryani", description: "Garden fresh vegetables layered with basmati rice in traditional dum style.", price: 249, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800", category: "Biryani", rating: 4.5, isVeg: true, preparationTime: "35-45 min", tags: ["veg"] },
      { name: "Chicken Kebab Platter", description: "Assorted seekh kebab, tikka, and reshmi kebab with mint chutney.", price: 399, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800", category: "North Indian", rating: 4.7, isVeg: false, preparationTime: "25-30 min", tags: ["popular"] },
      { name: "Raita", description: "Cooling cucumber and mint yogurt raita.", price: 79, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800", category: "North Indian", rating: 4.3, isVeg: true, preparationTime: "5 min", tags: ["veg"] },
    ],
    // Vendor 3: Dragon Palace
    [
      { name: "Steamed Momos", description: "Delicate chicken dumplings steamed to perfection, served with spicy chili sauce.", price: 149, image: "https://images.unsplash.com/photo-1534422298391-e4f8e172789a?w=800", category: "Momos", rating: 4.6, isVeg: false, preparationTime: "20 min", tags: ["popular"] },
      { name: "Veg Fried Momos", description: "Pan-fried vegetable dumplings with a crispy bottom.", price: 129, image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800", category: "Momos", rating: 4.4, isVeg: true, preparationTime: "20 min", tags: ["veg"] },
      { name: "Hakka Noodles", description: "Wok-tossed noodles with vegetables and secret Indo-Chinese sauce.", price: 179, image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800", category: "Chinese", rating: 4.5, isVeg: true, preparationTime: "15-20 min", tags: ["veg", "popular"] },
      { name: "Chilli Chicken", description: "Crispy fried chicken tossed in fiery chilli sauce with bell peppers.", price: 249, image: "https://images.unsplash.com/photo-1604908177522-7f0f6e6a8fbb?w=800", category: "Chinese", rating: 4.7, isVeg: false, preparationTime: "20-25 min", tags: ["spicy", "bestseller"] },
    ],
    // Vendor 4: South Spice
    [
      { name: "Masala Dosa", description: "Crispy golden dosa filled with spiced potato masala, served with sambar and 3 chutneys.", price: 129, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800", category: "South Indian", rating: 4.7, isVeg: true, preparationTime: "15-20 min", tags: ["veg", "bestseller"] },
      { name: "Idli Sambar Set", description: "4 soft steamed idlis served with piping hot sambar and coconut chutney.", price: 99, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800", category: "South Indian", rating: 4.6, isVeg: true, preparationTime: "10-15 min", tags: ["veg", "healthy"] },
      { name: "Uttapam", description: "Thick rice pancake topped with onions, tomatoes, and green chillies.", price: 119, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800", category: "South Indian", rating: 4.4, isVeg: true, preparationTime: "15 min", tags: ["veg"] },
      { name: "Filter Coffee", description: "Authentic South Indian decoction coffee served in a traditional tumbler.", price: 59, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800", category: "Drinks", rating: 4.8, isVeg: true, preparationTime: "5 min", tags: ["veg", "popular"] },
    ],
    // Vendor 5: Sweet Cravings
    [
      { name: "Chocolate Lava Cake", description: "Warm chocolate cake with a gooey molten center, served with vanilla ice cream.", price: 199, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800", category: "Desserts", rating: 4.9, isVeg: true, preparationTime: "15-20 min", tags: ["veg", "bestseller"] },
      { name: "Strawberry Cheesecake", description: "Creamy New York-style cheesecake with fresh strawberry compote.", price: 229, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800", category: "Desserts", rating: 4.7, isVeg: true, preparationTime: "5 min", tags: ["veg"] },
      { name: "Mango Boba Tea", description: "Refreshing mango milk tea with chewy tapioca pearls.", price: 149, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", category: "Drinks", rating: 4.6, isVeg: true, preparationTime: "5-10 min", tags: ["veg", "popular"] },
      { name: "Brownie Sundae", description: "Warm fudgy brownie topped with two scoops of vanilla ice cream and chocolate drizzle.", price: 179, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800", category: "Desserts", rating: 4.8, isVeg: true, preparationTime: "10 min", tags: ["veg"] },
    ],
  ];
  return allFoods[idx].map(f => ({ ...f, vendorId }));
};

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding database...');

  await User.deleteMany();
  await Vendor.deleteMany();
  await Food.deleteMany();

  // Create test user
  const user = await User.create({
    name: 'Test User',
    email: 'user@foodeasey.com',
    phone: '9876543210',
    password: 'password123',
    role: 'user',
    address: { street: '12, MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  });

  // Create vendor user
  const vendorUser = await User.create({
    name: 'Vendor Admin',
    email: 'vendor@foodeasey.com',
    phone: '9123456789',
    password: 'password123',
    role: 'vendor',
  });

  // Create admin
  await User.create({
    name: 'Admin',
    email: 'admin@foodeasey.com',
    phone: '9000000000',
    password: 'admin123',
    role: 'admin',
  });

  console.log('✅ Users created');

  // Create vendors
  const createdVendors = await Vendor.insertMany(
    vendors.map((v, i) => ({ ...v, ownerId: i === 0 ? vendorUser._id : undefined }))
  );
  console.log('✅ Vendors created');

  // Create foods
  const allFoods = createdVendors.flatMap((vendor, idx) => foodsByVendor(vendor._id, idx));
  await Food.insertMany(allFoods);
  console.log('✅ Foods created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('📧 Test credentials:');
  console.log('   User:   user@foodeasey.com / password123');
  console.log('   Vendor: vendor@foodeasey.com / password123');
  console.log('   Admin:  admin@foodeasey.com / admin123');

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
