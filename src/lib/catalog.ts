// Standalone fallback catalog for robust offline, Vercel serverless, and static generation
export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  wholesalePrice?: number | null;
  isEnquiryOnly: boolean;
  isPurchasableOnline: boolean;
  stockQuantity: number;
  stockStatus: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  images: {
    id?: string;
    url: string;
    altText?: string | null;
    isPrimary: boolean;
    displayOrder: number;
  }[];
  variants: {
    id?: string;
    color?: string | null;
    size?: string | null;
    sku?: string | null;
    additionalPrice: number;
    stockQuantity: number;
  }[];
}

export const STATIC_PRODUCTS_CATALOG: CatalogProduct[] = [
  {
    "id": "prod-black-orig",
    "name": "Women's Premium Cotton Lycra 4-Way Stretch Churidar Leggings (Jet Black)",
    "slug": "womens-cotton-lycra-churidar-leggings-black",
    "description": "Crafted from 95% super-combed cotton and 5% DuPont Lycra/Spandex, these ultra-soft 4-way stretch churidar leggings provide unmatched breathability, shape retention, and all-day comfort. Features gentle non-roll elastic waistband, authentic ankle gathers, and bio-washed colorfast finish.",
    "sku": "BBG-LEG-BLK-01",
    "price": 349,
    "wholesalePrice": 180,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 500,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": true,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "url": "/images/products/womens-cotton-lycra-churidar-leggings-black-main.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings - Clean Front View",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "url": "/images/products/womens-cotton-lycra-churidar-leggings-black-front.jpg",
        "altText": "Full Length Front Shot - Jet Black Churidar Leggings",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "url": "/images/products/womens-cotton-lycra-churidar-leggings-black-side.jpg",
        "altText": "Side Angle Stretch & Fit View",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "/images/products/womens-cotton-lycra-churidar-leggings-black-waistband-detail.jpg",
        "altText": "Premium Elastic Waistband and Fabric Weave Close-up",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "url": "/images/products/womens-cotton-lycra-churidar-leggings-black-fit.jpg",
        "altText": "Front Fit and Ankle Gathers Detail View",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "url": "/images/products/womens-cotton-lycra-churidar-leggings-black-back.jpg",
        "altText": "Rear Back View Showing Snug Fit",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "url": "/images/products/womens-cotton-lycra-churidar-leggings-black-styling.jpg",
        "altText": "Lifestyle Model Outfit Styling",
        "isPrimary": false,
        "displayOrder": 6
      }
    ],
    "variants": [
      {
        "id": "var-blk-1",
        "color": "Jet Black",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 250,
        "additionalPrice": 0
      },
      {
        "id": "var-blk-2",
        "color": "Jet Black",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 200,
        "additionalPrice": 40
      },
      {
        "id": "var-blk-3",
        "color": "Jet Black",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 50,
        "additionalPrice": 1450
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-cycling-shorts-white",
    "name": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Pure White)",
    "slug": "womens-cotton-lycra-cycling-shorts-white",
    "description": "Super combed 95% cotton and 5% Lycra 4-way stretch cycling shorts in vibrant Pure White. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
    "sku": "BBG-CS-WHT-01",
    "price": 279,
    "wholesalePrice": 140,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-white-0",
        "url": "/images/products/cycling-shorts-white-1.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Pure White) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-white-1",
        "url": "/images/products/cycling-shorts-white-2.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Pure White) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-white-2",
        "url": "/images/products/cycling-shorts-white-3.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Pure White) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-white-3",
        "url": "/images/products/cycling-shorts-white-4.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Pure White) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-white-4",
        "url": "/images/products/cycling-shorts-white-5.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Pure White) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-white-5",
        "url": "/images/products/cycling-shorts-white-6.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Pure White) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-white-6",
        "url": "/images/products/cycling-shorts-white-7.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Pure White) - View 7",
        "isPrimary": false,
        "displayOrder": 6
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-white-7",
        "url": "/images/products/cycling-shorts-white-key-features.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Pure White) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 7
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-white-1",
        "color": "Pure White",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 200,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-white-2",
        "color": "Pure White",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 150,
        "additionalPrice": 30
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-white-3",
        "color": "Pure White",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 40,
        "additionalPrice": 1120
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-cycling-shorts-grey",
    "name": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Heather Grey)",
    "slug": "womens-cotton-lycra-cycling-shorts-grey",
    "description": "Super combed 95% cotton and 5% Lycra 4-way stretch cycling shorts in vibrant Heather Grey. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
    "sku": "BBG-CS-GRY-02",
    "price": 279,
    "wholesalePrice": 140,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": true,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-grey-0",
        "url": "/images/products/cycling-shorts-grey-1.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Heather Grey) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-grey-1",
        "url": "/images/products/cycling-shorts-grey-2.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Heather Grey) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-grey-2",
        "url": "/images/products/cycling-shorts-grey-3.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Heather Grey) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-grey-3",
        "url": "/images/products/cycling-shorts-grey-4.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Heather Grey) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-grey-4",
        "url": "/images/products/cycling-shorts-grey-5.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Heather Grey) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-grey-5",
        "url": "/images/products/cycling-shorts-grey-6.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Heather Grey) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-grey-6",
        "url": "/images/products/cycling-shorts-grey-7.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Heather Grey) - View 7",
        "isPrimary": false,
        "displayOrder": 6
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-grey-7",
        "url": "/images/products/cycling-shorts-grey-key-features.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Heather Grey) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 7
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-grey-1",
        "color": "Heather Grey",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 200,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-grey-2",
        "color": "Heather Grey",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 150,
        "additionalPrice": 30
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-grey-3",
        "color": "Heather Grey",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 40,
        "additionalPrice": 1120
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-cycling-shorts-beige",
    "name": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Beige Skin)",
    "slug": "womens-cotton-lycra-cycling-shorts-beige",
    "description": "Super combed 95% cotton and 5% Lycra 4-way stretch cycling shorts in vibrant Beige / Nude. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
    "sku": "BBG-CS-BGE-03",
    "price": 279,
    "wholesalePrice": 140,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-beige-0",
        "url": "/images/products/cycling-shorts-beige-1.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Beige Skin) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-beige-1",
        "url": "/images/products/cycling-shorts-beige-2.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Beige Skin) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-beige-2",
        "url": "/images/products/cycling-shorts-beige-3.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Beige Skin) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-beige-3",
        "url": "/images/products/cycling-shorts-beige-4.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Beige Skin) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-beige-4",
        "url": "/images/products/cycling-shorts-beige-5.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Beige Skin) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-beige-5",
        "url": "/images/products/cycling-shorts-beige-6.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Beige Skin) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-beige-6",
        "url": "/images/products/cycling-shorts-beige-7.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Beige Skin) - View 7",
        "isPrimary": false,
        "displayOrder": 6
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-beige-7",
        "url": "/images/products/cycling-shorts-beige-key-features.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Beige Skin) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 7
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-beige-1",
        "color": "Beige / Nude",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 200,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-beige-2",
        "color": "Beige / Nude",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 150,
        "additionalPrice": 30
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-beige-3",
        "color": "Beige / Nude",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 40,
        "additionalPrice": 1120
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-cycling-shorts-teal",
    "name": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Peacock Teal)",
    "slug": "womens-cotton-lycra-cycling-shorts-teal",
    "description": "Super combed 95% cotton and 5% Lycra 4-way stretch cycling shorts in vibrant Peacock Teal Blue. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
    "sku": "BBG-CS-TEL-04",
    "price": 279,
    "wholesalePrice": 140,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-teal-0",
        "url": "/images/products/cycling-shorts-teal-1.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Peacock Teal) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-teal-1",
        "url": "/images/products/cycling-shorts-teal-2.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Peacock Teal) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-teal-2",
        "url": "/images/products/cycling-shorts-teal-3.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Peacock Teal) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-teal-3",
        "url": "/images/products/cycling-shorts-teal-4.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Peacock Teal) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-teal-4",
        "url": "/images/products/cycling-shorts-teal-5.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Peacock Teal) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-teal-5",
        "url": "/images/products/cycling-shorts-teal-6.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Peacock Teal) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-teal-6",
        "url": "/images/products/cycling-shorts-teal-7.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Peacock Teal) - View 7",
        "isPrimary": false,
        "displayOrder": 6
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-teal-7",
        "url": "/images/products/cycling-shorts-teal-key-features.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Peacock Teal) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 7
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-teal-1",
        "color": "Peacock Teal Blue",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 200,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-teal-2",
        "color": "Peacock Teal Blue",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 150,
        "additionalPrice": 30
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-teal-3",
        "color": "Peacock Teal Blue",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 40,
        "additionalPrice": 1120
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-cycling-shorts-red",
    "name": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Bright Red)",
    "slug": "womens-cotton-lycra-cycling-shorts-red",
    "description": "Super combed 95% cotton and 5% Lycra 4-way stretch cycling shorts in vibrant Bright Red. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
    "sku": "BBG-CS-RED-05",
    "price": 279,
    "wholesalePrice": 140,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-red-0",
        "url": "/images/products/cycling-shorts-red-1.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Bright Red) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-red-1",
        "url": "/images/products/cycling-shorts-red-2.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Bright Red) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-red-2",
        "url": "/images/products/cycling-shorts-red-3.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Bright Red) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-red-3",
        "url": "/images/products/cycling-shorts-red-4.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Bright Red) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-red-4",
        "url": "/images/products/cycling-shorts-red-5.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Bright Red) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-red-5",
        "url": "/images/products/cycling-shorts-red-6.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Bright Red) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-red-6",
        "url": "/images/products/cycling-shorts-red-7.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Bright Red) - View 7",
        "isPrimary": false,
        "displayOrder": 6
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-red-7",
        "url": "/images/products/cycling-shorts-red-key-features.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Bright Red) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 7
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-red-1",
        "color": "Bright Red",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 200,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-red-2",
        "color": "Bright Red",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 150,
        "additionalPrice": 30
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-red-3",
        "color": "Bright Red",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 40,
        "additionalPrice": 1120
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-cycling-shorts-royal-blue",
    "name": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Royal Blue)",
    "slug": "womens-cotton-lycra-cycling-shorts-royal-blue",
    "description": "Super combed 95% cotton and 5% Lycra 4-way stretch cycling shorts in vibrant Royal Blue. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
    "sku": "BBG-CS-RBL-06",
    "price": 279,
    "wholesalePrice": 140,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-royal-blue-0",
        "url": "/images/products/cycling-shorts-royal-blue-1.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Royal Blue) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-royal-blue-1",
        "url": "/images/products/cycling-shorts-royal-blue-2.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Royal Blue) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-royal-blue-2",
        "url": "/images/products/cycling-shorts-royal-blue-3.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Royal Blue) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-royal-blue-3",
        "url": "/images/products/cycling-shorts-royal-blue-4.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Royal Blue) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-royal-blue-4",
        "url": "/images/products/cycling-shorts-royal-blue-5.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Royal Blue) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-royal-blue-5",
        "url": "/images/products/cycling-shorts-royal-blue-6.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Royal Blue) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-royal-blue-6",
        "url": "/images/products/cycling-shorts-royal-blue-7.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Royal Blue) - View 7",
        "isPrimary": false,
        "displayOrder": 6
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-royal-blue-7",
        "url": "/images/products/cycling-shorts-royal-blue-key-features.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Royal Blue) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 7
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-royal-blue-1",
        "color": "Royal Blue",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 200,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-royal-blue-2",
        "color": "Royal Blue",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 150,
        "additionalPrice": 30
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-royal-blue-3",
        "color": "Royal Blue",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 40,
        "additionalPrice": 1120
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-cycling-shorts-maroon",
    "name": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Deep Maroon)",
    "slug": "womens-cotton-lycra-cycling-shorts-maroon",
    "description": "Super combed 95% cotton and 5% Lycra 4-way stretch cycling shorts in vibrant Deep Maroon. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
    "sku": "BBG-CS-MRN-07",
    "price": 279,
    "wholesalePrice": 140,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-maroon-0",
        "url": "/images/products/cycling-shorts-maroon-1.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Deep Maroon) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-maroon-1",
        "url": "/images/products/cycling-shorts-maroon-2.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Deep Maroon) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-maroon-2",
        "url": "/images/products/cycling-shorts-maroon-3.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Deep Maroon) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-maroon-3",
        "url": "/images/products/cycling-shorts-maroon-4.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Deep Maroon) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-maroon-4",
        "url": "/images/products/cycling-shorts-maroon-5.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Deep Maroon) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-maroon-5",
        "url": "/images/products/cycling-shorts-maroon-6.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Deep Maroon) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-maroon-6",
        "url": "/images/products/cycling-shorts-maroon-7.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Deep Maroon) - View 7",
        "isPrimary": false,
        "displayOrder": 6
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-maroon-7",
        "url": "/images/products/cycling-shorts-maroon-key-features.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Deep Maroon) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 7
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-maroon-1",
        "color": "Deep Maroon",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 200,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-maroon-2",
        "color": "Deep Maroon",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 150,
        "additionalPrice": 30
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-maroon-3",
        "color": "Deep Maroon",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 40,
        "additionalPrice": 1120
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-cycling-shorts-black",
    "name": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Jet Black)",
    "slug": "womens-cotton-lycra-cycling-shorts-black",
    "description": "Super combed 95% cotton and 5% Lycra 4-way stretch cycling shorts in vibrant Jet Black. Designed with an ultra-soft non-roll elastic waistband, mid-thigh slim fit cut, zero transparency, and moisture-wicking breathability for sports, active gym sessions, loungewear, and daily kurti innerwear.",
    "sku": "BBG-CS-BLK-08",
    "price": 279,
    "wholesalePrice": 140,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": true,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-black-0",
        "url": "/images/products/cycling-shorts-black-1.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Jet Black) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-black-1",
        "url": "/images/products/cycling-shorts-black-2.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Jet Black) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-black-2",
        "url": "/images/products/cycling-shorts-black-3.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Jet Black) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-black-3",
        "url": "/images/products/cycling-shorts-black-4.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Jet Black) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-black-4",
        "url": "/images/products/cycling-shorts-black-5.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Jet Black) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-black-5",
        "url": "/images/products/cycling-shorts-black-6.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Jet Black) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-black-6",
        "url": "/images/products/cycling-shorts-black-7.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Jet Black) - View 7",
        "isPrimary": false,
        "displayOrder": 6
      },
      {
        "id": "img-womens-cotton-lycra-cycling-shorts-black-7",
        "url": "/images/products/cycling-shorts-black-key-features.jpg",
        "altText": "Women's 4-Way Stretch Cotton Lycra Cycling Shorts (Jet Black) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 7
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-black-1",
        "color": "Jet Black",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 200,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-black-2",
        "color": "Jet Black",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 150,
        "additionalPrice": 30
      },
      {
        "id": "var-womens-cotton-lycra-cycling-shorts-black-3",
        "color": "Jet Black",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 40,
        "additionalPrice": 1120
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-churidar-leggings-teal",
    "name": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal)",
    "slug": "womens-cotton-lycra-churidar-leggings-teal",
    "description": "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Peacock Teal Blue. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
    "sku": "BBG-LEG-TEL-09",
    "price": 349,
    "wholesalePrice": 180,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-teal-0",
        "url": "/images/products/churidar-leggings-teal-1.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-teal-1",
        "url": "/images/products/churidar-leggings-teal-2.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-teal-2",
        "url": "/images/products/churidar-leggings-teal-3.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-teal-3",
        "url": "/images/products/churidar-leggings-teal-4.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-teal-4",
        "url": "/images/products/churidar-leggings-teal-5.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-teal-5",
        "url": "/images/products/churidar-leggings-teal-6.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-teal-6",
        "url": "/images/products/churidar-leggings-teal-7.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - View 7",
        "isPrimary": false,
        "displayOrder": 6
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-teal-7",
        "url": "/images/products/churidar-leggings-teal-key-features.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Peacock Teal) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 7
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-teal-1",
        "color": "Peacock Teal Blue",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 250,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-teal-2",
        "color": "Peacock Teal Blue",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 180,
        "additionalPrice": 40
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-teal-3",
        "color": "Peacock Teal Blue",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 50,
        "additionalPrice": 1450
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-churidar-leggings-grey",
    "name": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey)",
    "slug": "womens-cotton-lycra-churidar-leggings-grey",
    "description": "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Heather Grey. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
    "sku": "BBG-LEG-GRY-10",
    "price": 349,
    "wholesalePrice": 180,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-grey-0",
        "url": "/images/products/churidar-leggings-grey-1.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-grey-1",
        "url": "/images/products/churidar-leggings-grey-2.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-grey-2",
        "url": "/images/products/churidar-leggings-grey-3.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-grey-3",
        "url": "/images/products/churidar-leggings-grey-4.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-grey-4",
        "url": "/images/products/churidar-leggings-grey-5.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-grey-5",
        "url": "/images/products/churidar-leggings-grey-6.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-grey-6",
        "url": "/images/products/churidar-leggings-grey-7.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - View 7",
        "isPrimary": false,
        "displayOrder": 6
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-grey-7",
        "url": "/images/products/churidar-leggings-grey-key-features.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Heather Grey) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 7
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-grey-1",
        "color": "Heather Grey",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 250,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-grey-2",
        "color": "Heather Grey",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 180,
        "additionalPrice": 40
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-grey-3",
        "color": "Heather Grey",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 50,
        "additionalPrice": 1450
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-churidar-leggings-white",
    "name": "Women's Premium Cotton Lycra Churidar Leggings (Pure White)",
    "slug": "womens-cotton-lycra-churidar-leggings-white",
    "description": "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Pure White. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
    "sku": "BBG-LEG-WHT-11",
    "price": 349,
    "wholesalePrice": 180,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": true,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-white-0",
        "url": "/images/products/churidar-leggings-white-1.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-white-1",
        "url": "/images/products/churidar-leggings-white-2.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-white-2",
        "url": "/images/products/churidar-leggings-white-3.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-white-3",
        "url": "/images/products/churidar-leggings-white-4.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-white-4",
        "url": "/images/products/churidar-leggings-white-5.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-white-5",
        "url": "/images/products/churidar-leggings-white-6.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-white-6",
        "url": "/images/products/churidar-leggings-white-7.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - View 7",
        "isPrimary": false,
        "displayOrder": 6
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-white-7",
        "url": "/images/products/churidar-leggings-white-key-features.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Pure White) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 7
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-white-1",
        "color": "Pure White",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 250,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-white-2",
        "color": "Pure White",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 180,
        "additionalPrice": 40
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-white-3",
        "color": "Pure White",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 50,
        "additionalPrice": 1450
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-churidar-leggings-beige",
    "name": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream)",
    "slug": "womens-cotton-lycra-churidar-leggings-beige",
    "description": "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Beige / Cream. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
    "sku": "BBG-LEG-BGE-12",
    "price": 349,
    "wholesalePrice": 180,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-beige-0",
        "url": "/images/products/churidar-leggings-beige-1.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-beige-1",
        "url": "/images/products/churidar-leggings-beige-2.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-beige-2",
        "url": "/images/products/churidar-leggings-beige-3.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-beige-3",
        "url": "/images/products/churidar-leggings-beige-4.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-beige-4",
        "url": "/images/products/churidar-leggings-beige-5.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-beige-5",
        "url": "/images/products/churidar-leggings-beige-6.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-beige-6",
        "url": "/images/products/churidar-leggings-beige-7.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - View 7",
        "isPrimary": false,
        "displayOrder": 6
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-beige-7",
        "url": "/images/products/churidar-leggings-beige-key-features.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Beige Cream) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 7
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-beige-1",
        "color": "Beige / Cream",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 250,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-beige-2",
        "color": "Beige / Cream",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 180,
        "additionalPrice": 40
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-beige-3",
        "color": "Beige / Cream",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 50,
        "additionalPrice": 1450
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-churidar-leggings-black-classic",
    "name": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black)",
    "slug": "womens-cotton-lycra-churidar-leggings-black-classic",
    "description": "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Jet Black. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
    "sku": "BBG-LEG-BLK-13",
    "price": 349,
    "wholesalePrice": 180,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-black-classic-0",
        "url": "/images/products/churidar-leggings-black-v2-1.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-black-classic-1",
        "url": "/images/products/churidar-leggings-black-v2-2.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-black-classic-2",
        "url": "/images/products/churidar-leggings-black-v2-3.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-black-classic-3",
        "url": "/images/products/churidar-leggings-black-v2-4.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-black-classic-4",
        "url": "/images/products/churidar-leggings-black-v2-5.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-black-classic-5",
        "url": "/images/products/churidar-leggings-black-v2-6.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-black-classic-6",
        "url": "/images/products/churidar-leggings-black-v2-7.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - View 7",
        "isPrimary": false,
        "displayOrder": 6
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-black-classic-7",
        "url": "/images/products/churidar-leggings-black-v2-key-features.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Classic Jet Black) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 7
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-black-classic-1",
        "color": "Jet Black",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 250,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-black-classic-2",
        "color": "Jet Black",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 180,
        "additionalPrice": 40
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-black-classic-3",
        "color": "Jet Black",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 50,
        "additionalPrice": 1450
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-churidar-leggings-royal-blue",
    "name": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue)",
    "slug": "womens-cotton-lycra-churidar-leggings-royal-blue",
    "description": "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Royal Blue. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
    "sku": "BBG-LEG-RBL-14",
    "price": 349,
    "wholesalePrice": 180,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-royal-blue-0",
        "url": "/images/products/churidar-leggings-royal-blue-1.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-royal-blue-1",
        "url": "/images/products/churidar-leggings-royal-blue-2.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-royal-blue-2",
        "url": "/images/products/churidar-leggings-royal-blue-3.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-royal-blue-3",
        "url": "/images/products/churidar-leggings-royal-blue-4.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-royal-blue-4",
        "url": "/images/products/churidar-leggings-royal-blue-5.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-royal-blue-5",
        "url": "/images/products/churidar-leggings-royal-blue-6.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-royal-blue-6",
        "url": "/images/products/churidar-leggings-royal-blue-7.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - View 7",
        "isPrimary": false,
        "displayOrder": 6
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-royal-blue-7",
        "url": "/images/products/churidar-leggings-royal-blue-key-features.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Royal Blue) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 7
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-royal-blue-1",
        "color": "Royal Blue",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 250,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-royal-blue-2",
        "color": "Royal Blue",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 180,
        "additionalPrice": 40
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-royal-blue-3",
        "color": "Royal Blue",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 50,
        "additionalPrice": 1450
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-churidar-leggings-maroon",
    "name": "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon)",
    "slug": "womens-cotton-lycra-churidar-leggings-maroon",
    "description": "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Deep Maroon. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
    "sku": "BBG-LEG-MRN-15",
    "price": 349,
    "wholesalePrice": 180,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-maroon-0",
        "url": "/images/products/churidar-leggings-maroon-1.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-maroon-1",
        "url": "/images/products/churidar-leggings-maroon-2.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-maroon-2",
        "url": "/images/products/churidar-leggings-maroon-3.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-maroon-3",
        "url": "/images/products/churidar-leggings-maroon-4.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-maroon-4",
        "url": "/images/products/churidar-leggings-maroon-5.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-maroon-5",
        "url": "/images/products/churidar-leggings-maroon-6.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-maroon-6",
        "url": "/images/products/churidar-leggings-maroon-key-features.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Deep Maroon) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 6
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-maroon-1",
        "color": "Deep Maroon",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 250,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-maroon-2",
        "color": "Deep Maroon",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 180,
        "additionalPrice": 40
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-maroon-3",
        "color": "Deep Maroon",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 50,
        "additionalPrice": 1450
      }
    ]
  },
  {
    "id": "prod-womens-cotton-lycra-churidar-leggings-red",
    "name": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red)",
    "slug": "womens-cotton-lycra-churidar-leggings-red",
    "description": "Premium 4-way stretch super-combed cotton lycra churidar leggings in rich Crimson Red. Tailored with authentic ankle gathers (churis), bio-washed skin-friendly fabric, high colorfastness, non-transparent knit weave, and a wide comfortable elastic waistband. Perfect for daily ethnic wear, kurtas, and anarkalis.",
    "sku": "BBG-LEG-RED-16",
    "price": 349,
    "wholesalePrice": 180,
    "isEnquiryOnly": false,
    "isPurchasableOnline": true,
    "stockQuantity": 400,
    "stockStatus": "IN_STOCK",
    "isFeatured": true,
    "isNewArrival": true,
    "isBestSeller": true,
    "categoryId": "cat-bottom-wear",
    "category": {
      "id": "cat-bottom-wear",
      "name": "Women's Ethnic Leggings & Bottom Wear",
      "slug": "womens-bottom-wear"
    },
    "images": [
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-red-0",
        "url": "/images/products/churidar-leggings-red-1.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - Clean Studio Front Shot",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-red-1",
        "url": "/images/products/churidar-leggings-red-2.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - View 2",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-red-2",
        "url": "/images/products/churidar-leggings-red-3.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - View 3",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-red-3",
        "url": "/images/products/churidar-leggings-red-4.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - View 4",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-red-4",
        "url": "/images/products/churidar-leggings-red-5.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - View 5",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-red-5",
        "url": "/images/products/churidar-leggings-red-6.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - View 6",
        "isPrimary": false,
        "displayOrder": 5
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-red-6",
        "url": "/images/products/churidar-leggings-red-7.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - View 7",
        "isPrimary": false,
        "displayOrder": 6
      },
      {
        "id": "img-womens-cotton-lycra-churidar-leggings-red-7",
        "url": "/images/products/churidar-leggings-red-key-features.jpg",
        "altText": "Women's Premium Cotton Lycra Churidar Leggings (Crimson Red) - Key Features Infographic",
        "isPrimary": false,
        "displayOrder": 7
      }
    ],
    "variants": [
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-red-1",
        "color": "Crimson Red",
        "size": "Free Size (Fits 28 - 34 Inch Waist)",
        "stockQuantity": 250,
        "additionalPrice": 0
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-red-2",
        "color": "Crimson Red",
        "size": "Plus Size / XL-2XL (Fits 34 - 42 Inch Waist)",
        "stockQuantity": 180,
        "additionalPrice": 40
      },
      {
        "id": "var-womens-cotton-lycra-churidar-leggings-red-3",
        "color": "Crimson Red",
        "size": "Wholesale Pack (10 Pieces Bundle)",
        "stockQuantity": 50,
        "additionalPrice": 1450
      }
    ]
  }
];

export function getAllCatalogProducts(): CatalogProduct[] {
  return STATIC_PRODUCTS_CATALOG;
}

export function getCatalogProductBySlug(slugOrId: string): CatalogProduct | null {
  const lower = (slugOrId || "").toLowerCase();
  return (
    STATIC_PRODUCTS_CATALOG.find(
      (p) => p.slug.toLowerCase() === lower || p.id.toLowerCase() === lower
    ) || null
  );
}

export function getCatalogFeaturedProducts(): CatalogProduct[] {
  return STATIC_PRODUCTS_CATALOG.filter((p) => p.isFeatured);
}

export function getCatalogNewArrivals(): CatalogProduct[] {
  return STATIC_PRODUCTS_CATALOG.filter((p) => p.isNewArrival);
}

export function getCatalogRelatedProducts(currentId: string, limit = 4): CatalogProduct[] {
  return STATIC_PRODUCTS_CATALOG.filter((p) => p.id !== currentId).slice(0, limit);
}
