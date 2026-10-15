# BBG TEXTILE — Dynamic E-commerce & Wholesale Platform

A complete, production-ready, database-driven textile e-commerce website and admin management console for **BBG Textile**, based in Kupwad MIDC, Sangli, Maharashtra.

---

## 🌟 Key Highlights

- **100% Dynamic Storefront**: Driven by PostgreSQL and Prisma ORM — products, categories, stock, hero banners, site settings, and contact information are fully editable through the admin panel without editing source code.
- **Genuine Sangli Textile Branding**: Incorporates the client's official registered works address:
  > `GROUND FLOOR, KHARE MALA, S.NO-204 PLOT NO 28, Kupwad MIDC Area, Madhavnagar, Sangli, Maharashtra - 416436, OLD KUPWAD ROAD, SANGLI - 416416`
- **Wholesale & Retail Ready**: Dual shopping mode that can be switched with one toggle in the admin settings:
  1. *E-commerce Mode*: Online cart, dynamic subtotal, order placement, and stock reservation.
  2. *Wholesale Enquiry Mode*: One-tap WhatsApp quoting with pre-filled fabric specifications, SKU, color shade, cut length, and shareable product URLs.
- **Secure Admin Panel (`/admin`)**:
  - Real-time PostgreSQL database statistics (Total Products, Low Stock Alerts, Orders, Inquiries, Revenue).
  - Complete Product CRUD with multi-image uploader (primary image selection, ordering, and deletion).
  - Category Management with safe deletion checks (prevents breaking product relationships).
  - Order Management with status updates (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), dispatch history timeline, and printable invoices.
  - Customer Enquiry Desk with status workflow (`New`, `Contacted`, `In Progress`, `Resolved`), staff notes, and one-click WhatsApp reply.
  - Comprehensive Website Content Management (Business info, Sangli address, Hero banners, SEO metadata, About story).
  - Activity Audit Logging for all administrative operations.
- **Persistent Image Storage**: Integrated with Cloudinary and automatic local fallback storage in `public/uploads/` so client photos work immediately out of the box.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Lucide React Icons |
| **Backend** | Next.js Server Route Handlers |
| **Database** | PostgreSQL |
| **ORM** | Prisma 6 |
| **Authentication** | Secure HTTP-Only JWT Cookie (`jose`) + `bcryptjs` password hashing |
| **Image Storage** | Cloudinary SDK with disk fallback |
| **Validation** | Zod Schema Validation |

---

## 🚀 Quick Setup & Local Development

### 1. Prerequisites
- Node.js v18+ (tested on v22.23.1)
- PostgreSQL (Local or Managed like Neon / Supabase / Railway)

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure `DATABASE_URL` points to your PostgreSQL database:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/bbgtextile"
AUTH_SECRET="your-super-secret-32-byte-hex-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Cloudinary (Optional — automatically falls back to local uploads if omitted)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Default Initial Admin Credentials
ADMIN_EMAIL="admin@bbgtextile.com"
ADMIN_PASSWORD="Admin@BBGTextile#2026"
```

### 3. Initialize Database & Seed Content
Run the migrations and seed authentic categories, initial fabric listings, and the Owner account:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## 🔐 Admin Console Access

- **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@bbgtextile.com`
- **Password**: `Admin@BBGTextile#2026`

*(You can change your password and business details directly inside the Admin Settings screen).*

---

## 📸 Adding Client Product Photographs

To add the client's original product photos:
1. Log into the Admin Console at `/admin`.
2. Navigate to **Products** &rarr; **Add New Fabric** (or click **Edit** on an existing product).
3. In section **4. Product Photographs**, click **Upload Photos** and select the client's camera/mill photos.
4. Set the **Primary Photo** by clicking the star icon.
5. Save the product — the image is immediately persisted to PostgreSQL and appears dynamically on the storefront.

---

## 🚢 Deployment Guide (Vercel + Managed PostgreSQL)

1. **Database**: Create a PostgreSQL database on [Neon.tech](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/storage/postgres).
2. **Push Schema**: Run `npx prisma db push` with your production `DATABASE_URL`.
3. **Deploy to Vercel**:
   - Push this repository to GitHub / GitLab.
   - Import project in Vercel.
   - Add environment variables (`DATABASE_URL`, `AUTH_SECRET`, `CLOUDINARY_*`).
   - Deploy!
