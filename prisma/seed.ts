import { PrismaClient, AdminRole, StockStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting BBG Textile database seed with 16 Leggings & Shorts products...");

  // 1. Seed Site Settings
  const defaultAddress =
    "GROUND FLOOR, KHARE MALA, S.NO-204 PLOT NO 28, Kupwad MIDC Area, Madhavnagar, Sangli, Maharashtra - 416436, OLD KUPWAD ROAD, SANGLI - 416416";

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      address: defaultAddress,
      businessName: "BBG TEXTILE",
    },
    create: {
      id: "default",
      businessName: "BBG TEXTILE",
      tagline: "Excellence in Quality Fabrics & Garments",
      phone: "+91 87673 22501",
      whatsappNumber: "918767322501",
      email: "bbgtextilebharat1@gmail.com",
      address: defaultAddress,
      city: "Sangli",
      state: "Maharashtra",
      pincode: "416416",
      googleMapsUrl: "https://maps.google.com/?q=Kupwad+MIDC+Sangli+Maharashtra",
      onlineShoppingEnabled: true,
      currencySymbol: "₹",
      announcementText:
        "Premium Fabrics & Garments — Direct Mill Wholesale Supply",
      heroTitle: "Crafting Timeless Quality in Every Thread",
      heroSubtitle:
        "Renowned manufacturer & supplier of fine shirting, premium suiting, uniform textiles, and authentic ethnic weaves based in Sangli, Maharashtra.",
      aboutTitle: "The BBG Textile Legacy",
      aboutStory:
        "BBG Textile has been a dedicated cornerstone of quality fabric production and wholesale distribution in Maharashtra. Situated in the heart of Sangli's Kupwad MIDC industrial hub, we bridge traditional craftsmanship with modern textile innovation.\n\nFrom high-count combed cottons to durable industrial and school uniforms, our fabrics are woven with precision, tested for colorfastness, and engineered for supreme durability and drape.",
      aboutMission:
        "To deliver unmatched fabric reliability, transparent pricing, and swift dispatch for wholesale partners, garment manufacturers, and discerning retail clients.",
      aboutSpecialties:
        "• Pure Cotton & Giza Shirting\n• Wrinkle-Resistant Poly-Viscose Suiting\n• Custom Dyeing & Mill-Finish Linens\n• High-Tenacity Uniform & Workwear Fabrics\n• Traditional Ethnic & Festive Kurta Materials",
      seoTitle: "BBG Textile | Premium Fabrics & Textiles in Sangli, Maharashtra",
      seoDescription:
        "BBG Textile in Kupwad MIDC, Sangli. Manufacturer and wholesale supplier of premium shirting, suiting, and ethnic fabrics. Order online or enquire via WhatsApp.",
      instagramUrl: "https://instagram.com/bbgtextile",
      facebookUrl: "https://facebook.com/bbgtextile",
    },
  });

  console.log("✓ Site Settings configured");

  // 2. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin@123";
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: AdminRole.OWNER,
    },
    create: {
      email: adminEmail,
      name: "BBG Textile Administrator",
      passwordHash,
      role: AdminRole.OWNER,
      isActive: true,
    },
  });

  console.log(`✓ Admin User created: ${admin.email}`);

  // 3. Seed Categories
  const categoriesData = [
    {
      name: "Women's Churidar Leggings",
      slug: "churidar-leggings",
      description:
        "Premium 4-way stretch super-combed cotton lycra churidar leggings with elegant ankle gathers (churis), bio-washed softness, and non-sheer all-day comfort.",
      imageUrl: "/images/products/bbg-studio-hd-crimson-red.jpg",
      displayOrder: 1,
    },
    {
      name: "Women's Cotton Tight Shorts",
      slug: "cycling-shorts",
      description:
        "Ultra-comfortable 4-way stretch combed cotton lycra mid-thigh tight shorts with non-roll elastic waistband, perfect for activewear, gym, loungewear, and kurti innerwear.",
      imageUrl: "/images/products/bbg-studio-hd-cs-white.jpg",
      displayOrder: 2,
    },
  ];

  const createdCategories: Record<string, string> = {};

  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    createdCategories[cat.slug] = record.id;
  }
  console.log(`✓ ${categoriesData.length} Categories configured`);
  await prisma.category.updateMany({
    where: { slug: "womens-bottom-wear" },
    data: { isActive: false },
  });


  // 4. Seed All 16 Real Products with Full 127 Gallery Images
  const productsData = [
    {
      name: "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Pure White)",
      slug: "womens-cotton-lycra-cycling-shorts-white",
      description: "Super combed 95% cotton and 5% Lycra 4-way stretch tight shorts in vibrant Pure White. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
      sku: "BBG-CS-WHT-01",
      price: 279,
      wholesalePrice: 140,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      categorySlug: "cycling-shorts",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-cs-white.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Pure White) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/cycling-shorts-white-2.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Pure White) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/cycling-shorts-white-3.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Pure White) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/cycling-shorts-white-4.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Pure White) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/cycling-shorts-white-5.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Pure White) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/cycling-shorts-white-6.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Pure White) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/cycling-shorts-white-7.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Pure White) - View 7",
                    "isPrimary": false,
                    "displayOrder": 6
          },
          {
                    "url": "/images/products/cycling-shorts-white-key-features.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Pure White) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 7
          }
],
      variants: [
          {
                    "color": "Pure White",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 200,
                    "additionalPrice": 0
          },
          {
                    "color": "Pure White",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 150,
                    "additionalPrice": 30
          },
          {
                    "color": "Pure White",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 40,
                    "additionalPrice": 1120
          }
],
    },
    {
      name: "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Heather Grey)",
      slug: "womens-cotton-lycra-cycling-shorts-grey",
      description: "Super combed 95% cotton and 5% Lycra 4-way stretch tight shorts in vibrant Heather Grey. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
      sku: "BBG-CS-GRY-02",
      price: 279,
      wholesalePrice: 140,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      categorySlug: "cycling-shorts",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-cycling-grey.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Heather Grey) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/cycling-shorts-grey-2.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Heather Grey) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/cycling-shorts-grey-3.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Heather Grey) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/cycling-shorts-grey-4.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Heather Grey) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/cycling-shorts-grey-5.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Heather Grey) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/cycling-shorts-grey-6.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Heather Grey) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/cycling-shorts-grey-7.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Heather Grey) - View 7",
                    "isPrimary": false,
                    "displayOrder": 6
          },
          {
                    "url": "/images/products/cycling-shorts-grey-key-features.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Heather Grey) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 7
          }
],
      variants: [
          {
                    "color": "Heather Grey",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 200,
                    "additionalPrice": 0
          },
          {
                    "color": "Heather Grey",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 150,
                    "additionalPrice": 30
          },
          {
                    "color": "Heather Grey",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 40,
                    "additionalPrice": 1120
          }
],
    },
    {
      name: "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Beige Skin)",
      slug: "womens-cotton-lycra-cycling-shorts-beige",
      description: "Super combed 95% cotton and 5% Lycra 4-way stretch tight shorts in vibrant Beige / Nude. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
      sku: "BBG-CS-BGE-03",
      price: 279,
      wholesalePrice: 140,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      categorySlug: "cycling-shorts",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-cs-beige.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Beige Skin) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/cycling-shorts-beige-2.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Beige Skin) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/cycling-shorts-beige-3.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Beige Skin) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/cycling-shorts-beige-4.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Beige Skin) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/cycling-shorts-beige-5.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Beige Skin) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/cycling-shorts-beige-6.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Beige Skin) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/cycling-shorts-beige-7.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Beige Skin) - View 7",
                    "isPrimary": false,
                    "displayOrder": 6
          },
          {
                    "url": "/images/products/cycling-shorts-beige-key-features.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Beige Skin) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 7
          }
],
      variants: [
          {
                    "color": "Beige / Nude",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 200,
                    "additionalPrice": 0
          },
          {
                    "color": "Beige / Nude",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 150,
                    "additionalPrice": 30
          },
          {
                    "color": "Beige / Nude",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 40,
                    "additionalPrice": 1120
          }
],
    },
    {
      name: "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Peacock Teal)",
      slug: "womens-cotton-lycra-cycling-shorts-teal",
      description: "Super combed 95% cotton and 5% Lycra 4-way stretch tight shorts in vibrant Peacock Teal Blue. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
      sku: "BBG-CS-TEL-04",
      price: 279,
      wholesalePrice: 140,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      categorySlug: "cycling-shorts",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-cs-teal.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Peacock Teal) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/cycling-shorts-teal-2.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Peacock Teal) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/cycling-shorts-teal-3.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Peacock Teal) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/cycling-shorts-teal-4.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Peacock Teal) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/cycling-shorts-teal-5.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Peacock Teal) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/cycling-shorts-teal-6.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Peacock Teal) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/cycling-shorts-teal-7.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Peacock Teal) - View 7",
                    "isPrimary": false,
                    "displayOrder": 6
          },
          {
                    "url": "/images/products/cycling-shorts-teal-key-features.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Peacock Teal) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 7
          }
],
      variants: [
          {
                    "color": "Peacock Teal Blue",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 200,
                    "additionalPrice": 0
          },
          {
                    "color": "Peacock Teal Blue",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 150,
                    "additionalPrice": 30
          },
          {
                    "color": "Peacock Teal Blue",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 40,
                    "additionalPrice": 1120
          }
],
    },
    {
      name: "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Bright Red)",
      slug: "womens-cotton-lycra-cycling-shorts-red",
      description: "Super combed 95% cotton and 5% Lycra 4-way stretch tight shorts in vibrant Bright Red. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
      sku: "BBG-CS-RED-05",
      price: 279,
      wholesalePrice: 140,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      categorySlug: "cycling-shorts",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-cs-red.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Bright Red) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/cycling-shorts-red-2.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Bright Red) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/cycling-shorts-red-3.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Bright Red) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/cycling-shorts-red-4.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Bright Red) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/cycling-shorts-red-5.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Bright Red) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/cycling-shorts-red-6.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Bright Red) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/cycling-shorts-red-7.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Bright Red) - View 7",
                    "isPrimary": false,
                    "displayOrder": 6
          },
          {
                    "url": "/images/products/cycling-shorts-red-key-features.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Bright Red) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 7
          }
],
      variants: [
          {
                    "color": "Bright Red",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 200,
                    "additionalPrice": 0
          },
          {
                    "color": "Bright Red",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 150,
                    "additionalPrice": 30
          },
          {
                    "color": "Bright Red",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 40,
                    "additionalPrice": 1120
          }
],
    },
    {
      name: "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Royal Blue)",
      slug: "womens-cotton-lycra-cycling-shorts-royal-blue",
      description: "Super combed 95% cotton and 5% Lycra 4-way stretch tight shorts in vibrant Royal Blue. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
      sku: "BBG-CS-RBL-06",
      price: 279,
      wholesalePrice: 140,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      categorySlug: "cycling-shorts",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-cs-royal-blue.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Royal Blue) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/cycling-shorts-royal-blue-2.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Royal Blue) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/cycling-shorts-royal-blue-3.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Royal Blue) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/cycling-shorts-royal-blue-4.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Royal Blue) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/cycling-shorts-royal-blue-5.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Royal Blue) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/cycling-shorts-royal-blue-6.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Royal Blue) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/cycling-shorts-royal-blue-7.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Royal Blue) - View 7",
                    "isPrimary": false,
                    "displayOrder": 6
          },
          {
                    "url": "/images/products/cycling-shorts-royal-blue-key-features.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Royal Blue) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 7
          }
],
      variants: [
          {
                    "color": "Royal Blue",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 200,
                    "additionalPrice": 0
          },
          {
                    "color": "Royal Blue",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 150,
                    "additionalPrice": 30
          },
          {
                    "color": "Royal Blue",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 40,
                    "additionalPrice": 1120
          }
],
    },
    {
      name: "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Deep Maroon)",
      slug: "womens-cotton-lycra-cycling-shorts-maroon",
      description: "Super combed 95% cotton and 5% Lycra 4-way stretch tight shorts in vibrant Deep Maroon. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
      sku: "BBG-CS-MRN-07",
      price: 279,
      wholesalePrice: 140,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      categorySlug: "cycling-shorts",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-cs-maroon.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Deep Maroon) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/cycling-shorts-maroon-2.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Deep Maroon) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/cycling-shorts-maroon-3.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Deep Maroon) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/cycling-shorts-maroon-4.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Deep Maroon) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/cycling-shorts-maroon-5.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Deep Maroon) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/cycling-shorts-maroon-6.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Deep Maroon) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/cycling-shorts-maroon-7.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Deep Maroon) - View 7",
                    "isPrimary": false,
                    "displayOrder": 6
          },
          {
                    "url": "/images/products/cycling-shorts-maroon-key-features.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Deep Maroon) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 7
          }
],
      variants: [
          {
                    "color": "Deep Maroon",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 200,
                    "additionalPrice": 0
          },
          {
                    "color": "Deep Maroon",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 150,
                    "additionalPrice": 30
          },
          {
                    "color": "Deep Maroon",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 40,
                    "additionalPrice": 1120
          }
],
    },
    {
      name: "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Jet Black)",
      slug: "womens-cotton-lycra-cycling-shorts-black",
      description: "Super combed 95% cotton and 5% Lycra 4-way stretch tight shorts in vibrant Jet Black. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
      sku: "BBG-CS-BLK-08",
      price: 279,
      wholesalePrice: 140,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      categorySlug: "cycling-shorts",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-cs-black.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Jet Black) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/cycling-shorts-black-2.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Jet Black) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/cycling-shorts-black-3.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Jet Black) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/cycling-shorts-black-4.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Jet Black) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/cycling-shorts-black-5.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Jet Black) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/cycling-shorts-black-6.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Jet Black) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/cycling-shorts-black-7.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Jet Black) - View 7",
                    "isPrimary": false,
                    "displayOrder": 6
          },
          {
                    "url": "/images/products/cycling-shorts-black-key-features.jpg",
                    "altText": "Women's 4-Way Stretch Cotton Lycra Tight Shorts (Jet Black) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 7
          }
],
      variants: [
          {
                    "color": "Jet Black",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 200,
                    "additionalPrice": 0
          },
          {
                    "color": "Jet Black",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 150,
                    "additionalPrice": 30
          },
          {
                    "color": "Jet Black",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 40,
                    "additionalPrice": 1120
          }
],
    },
    {
      name: "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal)",
      slug: "womens-cotton-lycra-churidar-leggings-teal",
      description: "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Peacock Teal Blue. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
      sku: "BBG-LEG-TEL-09",
      price: 349,
      wholesalePrice: 180,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      categorySlug: "churidar-leggings",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-peacock-teal.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/churidar-leggings-teal-2.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/churidar-leggings-teal-3.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/churidar-leggings-teal-4.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/churidar-leggings-teal-5.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/churidar-leggings-teal-6.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/churidar-leggings-teal-7.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - View 7",
                    "isPrimary": false,
                    "displayOrder": 6
          },
          {
                    "url": "/images/products/churidar-leggings-teal-key-features.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 7
          }
],
      variants: [
          {
                    "color": "Peacock Teal Blue",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 250,
                    "additionalPrice": 0
          },
          {
                    "color": "Peacock Teal Blue",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 180,
                    "additionalPrice": 40
          },
          {
                    "color": "Peacock Teal Blue",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 50,
                    "additionalPrice": 1450
          }
],
    },
    {
      name: "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey)",
      slug: "womens-cotton-lycra-churidar-leggings-grey",
      description: "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Heather Grey. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
      sku: "BBG-LEG-GRY-10",
      price: 349,
      wholesalePrice: 180,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      categorySlug: "churidar-leggings",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-heather-grey.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/churidar-leggings-grey-2.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/churidar-leggings-grey-3.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/churidar-leggings-grey-4.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/churidar-leggings-grey-5.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/churidar-leggings-grey-6.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/churidar-leggings-grey-7.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - View 7",
                    "isPrimary": false,
                    "displayOrder": 6
          },
          {
                    "url": "/images/products/churidar-leggings-grey-key-features.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 7
          }
],
      variants: [
          {
                    "color": "Heather Grey",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 250,
                    "additionalPrice": 0
          },
          {
                    "color": "Heather Grey",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 180,
                    "additionalPrice": 40
          },
          {
                    "color": "Heather Grey",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 50,
                    "additionalPrice": 1450
          }
],
    },
    {
      name: "Women's Premium Cotton Lycra Churidar Leggings (Pure White)",
      slug: "womens-cotton-lycra-churidar-leggings-white",
      description: "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Pure White. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
      sku: "BBG-LEG-WHT-11",
      price: 349,
      wholesalePrice: 180,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      categorySlug: "churidar-leggings",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-pure-white.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/churidar-leggings-white-2.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/churidar-leggings-white-3.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/churidar-leggings-white-4.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/churidar-leggings-white-5.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/churidar-leggings-white-6.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/churidar-leggings-white-7.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - View 7",
                    "isPrimary": false,
                    "displayOrder": 6
          },
          {
                    "url": "/images/products/churidar-leggings-white-key-features.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 7
          }
],
      variants: [
          {
                    "color": "Pure White",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 250,
                    "additionalPrice": 0
          },
          {
                    "color": "Pure White",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 180,
                    "additionalPrice": 40
          },
          {
                    "color": "Pure White",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 50,
                    "additionalPrice": 1450
          }
],
    },
    {
      name: "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream)",
      slug: "womens-cotton-lycra-churidar-leggings-beige",
      description: "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Beige / Cream. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
      sku: "BBG-LEG-BGE-12",
      price: 349,
      wholesalePrice: 180,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      categorySlug: "churidar-leggings",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-beige-cream.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/churidar-leggings-beige-2.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/churidar-leggings-beige-3.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/churidar-leggings-beige-4.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/churidar-leggings-beige-5.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/churidar-leggings-beige-6.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/churidar-leggings-beige-7.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - View 7",
                    "isPrimary": false,
                    "displayOrder": 6
          },
          {
                    "url": "/images/products/churidar-leggings-beige-key-features.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 7
          }
],
      variants: [
          {
                    "color": "Beige / Cream",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 250,
                    "additionalPrice": 0
          },
          {
                    "color": "Beige / Cream",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 180,
                    "additionalPrice": 40
          },
          {
                    "color": "Beige / Cream",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 50,
                    "additionalPrice": 1450
          }
],
    },
    {
      name: "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black)",
      slug: "womens-cotton-lycra-churidar-leggings-black-classic",
      description: "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Jet Black. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
      sku: "BBG-LEG-BLK-13",
      price: 349,
      wholesalePrice: 180,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      categorySlug: "churidar-leggings",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-jet-black.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/churidar-leggings-black-v2-2.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/churidar-leggings-black-v2-3.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/churidar-leggings-black-v2-4.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/churidar-leggings-black-v2-5.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/churidar-leggings-black-v2-6.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/churidar-leggings-black-v2-7.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - View 7",
                    "isPrimary": false,
                    "displayOrder": 6
          },
          {
                    "url": "/images/products/churidar-leggings-black-v2-key-features.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 7
          }
],
      variants: [
          {
                    "color": "Jet Black",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 250,
                    "additionalPrice": 0
          },
          {
                    "color": "Jet Black",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 180,
                    "additionalPrice": 40
          },
          {
                    "color": "Jet Black",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 50,
                    "additionalPrice": 1450
          }
],
    },
    {
      name: "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue)",
      slug: "womens-cotton-lycra-churidar-leggings-royal-blue",
      description: "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Royal Blue. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
      sku: "BBG-LEG-RBL-14",
      price: 349,
      wholesalePrice: 180,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      categorySlug: "churidar-leggings",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-royal-blue.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/churidar-leggings-royal-blue-2.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/churidar-leggings-royal-blue-3.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/churidar-leggings-royal-blue-4.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/churidar-leggings-royal-blue-5.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/churidar-leggings-royal-blue-6.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/churidar-leggings-royal-blue-7.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - View 7",
                    "isPrimary": false,
                    "displayOrder": 6
          },
          {
                    "url": "/images/products/churidar-leggings-royal-blue-key-features.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 7
          }
],
      variants: [
          {
                    "color": "Royal Blue",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 250,
                    "additionalPrice": 0
          },
          {
                    "color": "Royal Blue",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 180,
                    "additionalPrice": 40
          },
          {
                    "color": "Royal Blue",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 50,
                    "additionalPrice": 1450
          }
],
    },
    {
      name: "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon)",
      slug: "womens-cotton-lycra-churidar-leggings-maroon",
      description: "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Deep Maroon. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
      sku: "BBG-LEG-MRN-15",
      price: 349,
      wholesalePrice: 180,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      categorySlug: "churidar-leggings",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-deep-maroon.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/churidar-leggings-maroon-2.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/churidar-leggings-maroon-3.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/churidar-leggings-maroon-4.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/churidar-leggings-maroon-5.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/churidar-leggings-maroon-6.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/churidar-leggings-maroon-key-features.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 6
          }
],
      variants: [
          {
                    "color": "Deep Maroon",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 250,
                    "additionalPrice": 0
          },
          {
                    "color": "Deep Maroon",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 180,
                    "additionalPrice": 40
          },
          {
                    "color": "Deep Maroon",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 50,
                    "additionalPrice": 1450
          }
],
    },
    {
      name: "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red)",
      slug: "womens-cotton-lycra-churidar-leggings-red",
      description: "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Crimson Red. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
      sku: "BBG-LEG-RED-16",
      price: 349,
      wholesalePrice: 180,
      isEnquiryOnly: false,
      isPurchasableOnline: true,
      stockQuantity: 400,
      stockStatus: StockStatus.IN_STOCK,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      categorySlug: "churidar-leggings",
      images: [
          {
                    "url": "/images/products/bbg-studio-hd-crimson-red.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - Clean Studio Front Shot",
                    "isPrimary": true,
                    "displayOrder": 0
          },
          {
                    "url": "/images/products/churidar-leggings-red-2.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - View 2",
                    "isPrimary": false,
                    "displayOrder": 1
          },
          {
                    "url": "/images/products/churidar-leggings-red-3.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - View 3",
                    "isPrimary": false,
                    "displayOrder": 2
          },
          {
                    "url": "/images/products/churidar-leggings-red-4.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - View 4",
                    "isPrimary": false,
                    "displayOrder": 3
          },
          {
                    "url": "/images/products/churidar-leggings-red-5.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - View 5",
                    "isPrimary": false,
                    "displayOrder": 4
          },
          {
                    "url": "/images/products/churidar-leggings-red-6.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - View 6",
                    "isPrimary": false,
                    "displayOrder": 5
          },
          {
                    "url": "/images/products/churidar-leggings-red-7.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - View 7",
                    "isPrimary": false,
                    "displayOrder": 6
          },
          {
                    "url": "/images/products/churidar-leggings-red-key-features.jpg",
                    "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - Key Features Infographic",
                    "isPrimary": false,
                    "displayOrder": 7
          }
],
      variants: [
          {
                    "color": "Crimson Red",
                    "size": "Free Size (Fits 28 - 34 Inch Waist)",
                    "stockQuantity": 250,
                    "additionalPrice": 0
          },
          {
                    "color": "Crimson Red",
                    "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
                    "stockQuantity": 180,
                    "additionalPrice": 40
          },
          {
                    "color": "Crimson Red",
                    "size": "Wholesale Pack (10 Pieces Bundle)",
                    "stockQuantity": 50,
                    "additionalPrice": 1450
          }
],
    },
  ];

  console.log(`⏳ Seeding ${productsData.length} products with images & variants...`);

  for (const prod of productsData) {
    const categoryId = createdCategories[prod.categorySlug];
    if (!categoryId) continue;

    const existing = await prisma.product.findUnique({
      where: { slug: prod.slug },
    });

    if (existing) {
      // Clean up previous images and variants to ensure pristine sync
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.productVariant.deleteMany({ where: { productId: existing.id } });

      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: prod.name,
          description: prod.description,
          price: prod.price,
          wholesalePrice: prod.wholesalePrice,
          sku: prod.sku,
          categoryId,
          isEnquiryOnly: prod.isEnquiryOnly,
          isPurchasableOnline: prod.isPurchasableOnline,
          isFeatured: prod.isFeatured,
          isNewArrival: prod.isNewArrival,
          isBestSeller: prod.isBestSeller,
          images: {
            create: prod.images,
          },
          variants: {
            create: prod.variants,
          },
        },
      });
      console.log(`✓ Updated product: ${prod.name} with ${prod.images.length} images`);
    } else {
      const created = await prisma.product.create({
        data: {
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          sku: prod.sku,
          price: prod.price,
          wholesalePrice: prod.wholesalePrice,
          isEnquiryOnly: prod.isEnquiryOnly,
          isPurchasableOnline: prod.isPurchasableOnline,
          stockQuantity: prod.stockQuantity,
          stockStatus: prod.stockStatus,
          isFeatured: prod.isFeatured,
          isNewArrival: prod.isNewArrival,
          isBestSeller: prod.isBestSeller,
          categoryId,
          images: {
            create: prod.images,
          },
          variants: {
            create: prod.variants,
          },
        },
      });
      console.log(`✓ Created product: ${created.name} with ${prod.images.length} images`);
    }
  }

  // 5. Seed Home Banners
  const banners = [
    {
      title: "New Arrival: Premium 4-Way Stretch Leggings & Tight Shorts",
      subtitle:
        "Super combed cotton lycra churidar leggings and tight shorts engineered for ultimate stretch, breathability, and daily elegance in Sangli.",
      linkUrl: "/products",
      buttonText: "Explore Full Collection",
      imageUrl: "/images/products/churidar-leggings-red-1.jpg",
      displayOrder: 1,
    },
    {
      title: "Direct Mill Wholesale Supply in Sangli",
      subtitle:
        "Supplying premium shirtings, suitings, churidars, and bottom wear across Maharashtra and Karnataka.",
      linkUrl: "/contact",
      buttonText: "Request Wholesale Quotation",
      imageUrl: "/images/products/cycling-shorts-royal-blue-1.jpg",
      displayOrder: 2,
    },
  ];

  for (const banner of banners) {
    const existing = await prisma.homeBanner.findFirst({
      where: { title: banner.title },
    });
    if (existing) {
      await prisma.homeBanner.update({
        where: { id: existing.id },
        data: banner,
      });
    } else {
      await prisma.homeBanner.create({ data: banner });
    }
  }
  console.log("✓ Home banners configured");

  console.log("🎉 Database seeding completed successfully with all 16 products and 127 images!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
