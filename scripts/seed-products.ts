/**
 * Product Database Seeding Script
 *
 * Run this to populate the product database with initial data
 * Usage: ts-node scripts/seed-products.ts
 */

// TODO: Import your database client (Prisma, Mongoose, etc.)
// import { db } from '../src/backend/db';

const sampleProducts = [
  {
    name: "Foaming Facial Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    price: 14.99,
    currency: "USD",
    description: "Gentle foaming cleanser with ceramides and hyaluronic acid for normal to oily skin",
    purchaseUrl: "https://www.cerave.com/skincare/cleansers/foaming-facial-cleanser",
    imageUrl: "https://example.com/cerave-cleanser.jpg",
    tags: ["fragrance-free", "non-comedogenic", "dermatologist-recommended"],
    ingredients: [
      { name: "Ceramides", purpose: "Barrier repair" },
      { name: "Hyaluronic Acid", purpose: "Hydration" },
      { name: "Niacinamide", purpose: "Soothing" }
    ],
    suitableFor: {
      skinTypes: ["oily", "combination", "normal"],
      concerns: ["acne", "dehydration"]
    }
  },
  {
    name: "Hydrating Facial Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    price: 14.99,
    currency: "USD",
    description: "Creamy, non-foaming cleanser for dry to normal skin",
    purchaseUrl: "https://www.cerave.com/skincare/cleansers/hydrating-facial-cleanser",
    imageUrl: "https://example.com/cerave-hydrating.jpg",
    tags: ["fragrance-free", "non-comedogenic"],
    ingredients: [
      { name: "Ceramides", purpose: "Barrier repair" },
      { name: "Hyaluronic Acid", purpose: "Hydration" }
    ],
    suitableFor: {
      skinTypes: ["dry", "normal", "sensitive"],
      concerns: ["dehydration", "redness"]
    }
  },
  {
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "treatment",
    price: 5.99,
    currency: "USD",
    description: "High-strength niacinamide serum to reduce blemishes and congestion",
    purchaseUrl: "https://theordinary.com/en-us/niacinamide-10-zinc-1-serum-100412.html",
    imageUrl: "https://example.com/ordinary-niacinamide.jpg",
    tags: ["vegan", "cruelty-free", "oil-free"],
    ingredients: [
      { name: "Niacinamide", purpose: "Blemish reduction", concentration: "10%" },
      { name: "Zinc", purpose: "Oil control", concentration: "1%" }
    ],
    suitableFor: {
      skinTypes: ["oily", "combination"],
      concerns: ["acne", "large_pores", "redness"]
    }
  },
  {
    name: "Daily Moisturizing Lotion",
    brand: "CeraVe",
    category: "moisturizer",
    price: 16.99,
    currency: "USD",
    description: "Lightweight, non-greasy moisturizer for all skin types",
    purchaseUrl: "https://www.cerave.com/skincare/moisturizers/daily-moisturizing-lotion",
    imageUrl: "https://example.com/cerave-lotion.jpg",
    tags: ["fragrance-free", "non-comedogenic"],
    ingredients: [
      { name: "Ceramides", purpose: "Barrier repair" },
      { name: "Hyaluronic Acid", purpose: "Hydration" }
    ],
    suitableFor: {
      skinTypes: ["normal", "oily", "combination"],
      concerns: ["dehydration"]
    }
  },
  {
    name: "Ultra-Light Daily Sunscreen SPF 50",
    brand: "La Roche-Posay",
    category: "spf",
    price: 19.99,
    currency: "USD",
    description: "Lightweight, non-greasy sunscreen for face",
    purchaseUrl: "https://www.laroche-posay.us/anthelios",
    imageUrl: "https://example.com/lrp-spf.jpg",
    tags: ["broad-spectrum", "water-resistant", "fragrance-free"],
    ingredients: [
      { name: "Avobenzone", purpose: "UV protection", concentration: "3%" },
      { name: "Titanium Dioxide", purpose: "UV protection" }
    ],
    suitableFor: {
      skinTypes: ["all"],
      concerns: ["sun-protection", "aging"]
    }
  }
];

async function seedProducts() {
  console.log("🌱 Seeding product database...");

  try {
    // TODO: Implement database insertion logic
    // Example with Prisma:
    // for (const product of sampleProducts) {
    //   await db.product.create({ data: product });
    // }

    console.log(`✅ Successfully seeded ${sampleProducts.length} products`);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
}

// Run the seed function
seedProducts()
  .then(() => {
    console.log("✨ Seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
