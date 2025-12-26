# 🛒 Yilzi Digitalz - Toko Produk Digital

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase)
![Tripay](https://img.shields.io/badge/Tripay-Payment_Gateway-orange?style=for-the-badge)

> Toko produk digital modern dengan Next.js 15, Firebase Firestore, dan Tripay payment gateway. Migrasi dari Nuxt.js 3 ke React Next.js 15 dengan App Router.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Development](#-development)
- [Production](#-production)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Payment Gateway](#-payment-gateway)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### For Users
- 🔍 **Product Discovery** - Browse, search, and filter products
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- 🛒 **Easy Purchase** - Simple checkout flow with Tripay payment
- 📄 **Invoice Tracking** - Real-time payment status tracking
- 📥 **Instant Download** - Download purchased products immediately
- ⭐ **Product Reviews** - Rate and review purchased products
- 💬 **WhatsApp Support** - Quick support via WhatsApp

### For Admins
- 📊 **Dashboard** - Overview of sales, products, and users
- 📦 **Product Management** - Full CRUD operations for products
- 👥 **User Management** - View and manage registered users
- 💰 **Invoice Management** - Track all transactions and payments
- 📈 **Analytics** - View sales statistics and popular products
- 🔒 **Admin Only Access** - Protected admin dashboard
- 🚀 **Bulk Operations** - Efficient product and user management

### Security & Performance
- 🔐 **Firebase Auth** - Secure Google OAuth authentication
- 🛡️ **Route Protection** - Middleware-based access control
- ⚡ **Rate Limiting** - API rate limiting to prevent abuse
- 🍪 **HttpOnly Cookies** - Secure token storage
- 🔑 **HMAC-SHA512 Signature** - Secure Tripay payment verification
- 🚀 **Infinite Scroll** - Smooth product loading
- 📱 **Mobile Optimized** - Progressive enhancement for mobile

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **State Management:** React Context API
- **Icons:** Lucide React

### Backend
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Google OAuth)
- **Payment Gateway:** Tripay
- **API:** Next.js API Routes

### Tools & Services
- **Package Manager:** npm
- **Code Quality:** ESLint
- **Deployment:** Vercel (recommended)

## 📸 Screenshots

### Home Page
- Modern gradient hero section
- Featured products display
- Product stats cards
- FAQ section

### Products Listing
- Infinite scroll product grid
- Search and filter functionality
- Product categories
- Mobile-responsive layout

### Product Detail
- High-quality product images
- Detailed product information
- Purchase form with dynamic fields
- Real-time stock status
- Payment method integration

### Admin Dashboard
- Product management (CRUD)
- Sales statistics
- User management
- Invoice tracking

### Invoice Page
- Real-time payment status
- QR code payment
- Countdown timer
- Download links for paid invoices
- Automatic payment verification

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later)
- **npm** or **yarn** or **pnpm**
- **Firebase Account** - [Create one here](https://console.firebase.google.com/)
- **Tripay Account** - [Create one here](https://tripay.co.id/register)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/yilzi-digitalz.git
   cd yilzi-digitalz
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase and Tripay credentials
   - See [Environment Variables](#-environment-variables) section

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-side)
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n\nyour_private_key\n\n-----END PRIVATE KEY-----\n
FIREBASE_PROJECT_ID=your_project_id

# Admin Email
ADMIN_EMAIL=admin@sadiwa-store-web.com
NEXT_PUBLIC_ADMIN_EMAIL=admin@sadiwa-store-web.com

# Next.js Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development

# Tripay Configuration
TRIPAY_API_KEY=your_tripay_api_key
TRIPAY_PRIVATE_KEY=your_tripay_private_key
TRIPAY_MERCHANT_CODE=your_merchant_code
TRIPAY_MODE=sandbox
```

### Where to Get Values

**Firebase:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create/select a project
3. Go to Project Settings → General
4. Scroll to "Your apps" → Web app
5. Copy the configuration values
6. For Admin SDK, go to Project Settings → Service accounts → Generate new private key

**Tripay:**
1. Go to [Tripay Dashboard](https://tripay.co.id/dashboard)
2. Log in to your account
3. Go to "Integrasi API" or "Pengaturan API"
4. Copy your API Key, Private Key, and Merchant Code

> **⚠️ Important:** Never commit `.env.local` to version control! Add it to `.gitignore`.

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Development Workflow

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Make changes to the code**
   - Edit pages, components, or API routes
   - Hot reload will automatically reflect changes

3. **Test your changes:**
   - Open http://localhost:3000
   - Test the new features

4. **Check for linting errors:**
   ```bash
   npm run lint
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

### Database (Firebase Firestore)

The application uses Firebase Firestore for data storage. The database structure includes:

**Collections:**
- `users` - User data and authentication
- `products` - Product information
- `invoices` - Payment invoices and transactions

**Schema:**

**Users Collection:**
```typescript
{
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Products Collection:**
```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  label?: string; // 'Baru', 'Populer', 'Diskon', 'Hot Item'
  category?: string;
  imageUrl?: string;
  image?: string;
  file?: string; // Download link
  stock_available: boolean;
  sold_count: number;
  rating?: number;
  show: boolean;
  additional_information?: Array<{
    key: string;
    value: string;
  }>;
  created_at: string;
  updated_at: string;
}
```

**Invoices Collection:**
```typescript
{
  id: string;
  email: string;
  user_id: string;
  amount: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    productId: string;
    file?: {
      type: 'local' | 'cloud';
      data: string;
    };
  }>;
  qr: string;
  payment_url?: string;
  redirect_url?: string;
  status: 'Pending' | 'Paid' | 'Expired' | 'Failed';
  payment_method: string;
  additional_information?: Array<{
    name: string;
    value: string;
  }>;
  product_id: string;
  tripay_reference?: string;
  tripay_trx_id?: string;
  tripay_status?: string;
  created_at: string;
  expires_at?: string;
  paid_at?: string;
  payment_at?: string;
}
```

## 🚢 Production

### Vercel Deployment (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [Vercel](https://vercel.com/)
   - Click "Add New Project"
   - Import from GitHub
   - Select this repository
   - Configure project settings

3. **Set Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all environment variables from `.env.local`
   - Update `NEXT_PUBLIC_BASE_URL` to your production URL
   - Update `TRIPAY_MODE` to `production`

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - Wait for the deployment to complete

5. **Access Your App:**
   - Vercel will provide a URL like `https://your-app.vercel.app`

### Manual Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **The `.next` folder** will be created with the production build

3. **Deploy to your hosting provider** using the `.next` folder

4. **Set up environment variables** on your hosting provider

## 📁 Project Structure

```
yilzi-digitalz/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   ├── invoices/         # Invoice CRUD endpoints
│   │   │   ├── payment/          # Payment endpoints (Tripay)
│   │   │   ├── products/         # Product CRUD endpoints
│   │   │   └── users/             # User management endpoints
│   │   ├── dashboard/            # Admin dashboard pages
│   │   │   ├── products/        # Products list
│   │   │   ├── add-product/      # Add new product
│   │   │   └── product/[id]/     # Edit product
│   │   ├── invoice/[id]/         # Invoice detail page
│   │   ├── login/                # Login page
│   │   ├── page.tsx              # Home page
│   │   ├── product/[id]/         # Product detail page
│   │   ├── products/             # Products listing page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css            # Global styles
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── Alert.tsx             # Alert component
│   │   ├── AppFooter.tsx         # Footer component
│   │   ├── BuyCard.tsx           # Purchase card
│   │   ├── FaqSection.tsx        # FAQ section
│   │   ├── HeroSection.tsx       # Hero section
│   │   ├── Preloader.tsx         # Preloader
│   │   ├── ProductCard.tsx       # Product card
│   │   ├── ProductList.tsx       # Product list
│   │   └── Theme.tsx             # Theme toggle
│   ├── contexts/                 # React contexts
│   │   └── AuthContext.tsx        # Authentication context
│   ├── lib/                      # Utility libraries
│   │   ├── firebase/
│   │   │   ├── admin.ts          # Firebase Admin SDK
│   │   │   ├── client.ts         # Firebase Client SDK
│   │   │   ├── config.ts         # Firebase configuration
│   │   │   ├── db.ts             # Firestore helper functions
│   │   │   └── types.ts          # TypeScript types
│   │   ├── middleware/
│   │   │   └── auth.ts            # Auth helpers for API routes
│   │   └── payment/
│   │       └── tripay.ts           # Tripay payment gateway
│   └── middleware.ts             # Next.js middleware
├── public/                      # Static files
│   ├── favicon.ico
│   ├── images/
│   ├── js/
│   └── videos/
├── .env.local                   # Environment variables (gitignored)
├── .env.example                 # Example environment variables
├── .gitignore
├── components.json              # Shadcn UI components config
├── next.config.ts               # Next.js configuration
├── package.json                 # Project dependencies
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 📡 API Documentation

### Authentication

#### Login (Google OAuth)
```http
POST /api/auth/login
Content-Type: application/json

{
  "idToken": "firebase_id_token"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Login berhasil",
  "data": {
    "uid": "user_uid",
    "email": "user@example.com",
    "name": "User Name",
    "type": "admin" | "user"
  }
}
```

#### Logout
```http
POST /api/auth/logout
```

### Products

#### Get All Products
```http
GET /api/products?page=1&limit=10&search=keyword&category=category&show=true
```

**Response:**
```json
{
  "status": true,
  "data": {
    "products": [...],
    "totalCount": 100
  }
}
```

#### Get Product by ID
```http
GET /api/products/:id
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer firebase_token

{
  "name": "Product Name",
  "description": "Product Description",
  "price": 150000,
  "original_price": 200000,
  "label": "Baru",
  "category": "Script",
  "imageUrl": "https://example.com/image.jpg",
  "file": "https://example.com/file.zip",
  "stock_available": true,
  "show": true,
  "additional_information": [...]
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer firebase_token

{
  "name": "Updated Product Name",
  ...
}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer firebase_token
```

#### Increment Product Sales
```http
POST /api/products/:id/increment-sales

{
  "amount": 1
}
```

### Invoices

#### Get User Invoices
```http
GET /api/invoices?email=user@example.com&status=Paid
Authorization: Bearer firebase_token
```

#### Create Invoice
```http
POST /api/invoices
Authorization: Bearer firebase_token

{
  "productId": "product_id",
  "additional_information": [...]
}
```

**Response:**
```json
{
  "status": true,
  "message": "Invoice berhasil dibuat",
  "data": {
    "invoiceId": "invoice_id",
    "amount": 150000,
    "redirect": "/invoice/invoice_id"
  }
}
```

#### Get Invoice by ID
```http
GET /api/invoices/:id
Authorization: Bearer firebase_token
```

#### Update Invoice (Admin Only)
```http
PUT /api/invoices/:id
Authorization: Bearer firebase_token
```

#### Delete Invoice (Admin Only)
```http
DELETE /api/invoices/:id
Authorization: Bearer firebase_token
```

### Payment (Tripay)

#### Create Payment
```http
POST /api/payment/create
Authorization: Bearer firebase_token

{
  "productId": "product_id",
  "additional_information": [...]
}
```

**Response:**
```json
{
  "status": true,
  "message": "Invoice berhasil dibuat",
  "data": {
    "invoiceId": "invoice_id",
    "amount": 150000,
    "fee": 15000,
    "price": 135000,
    "payment_url": "https://tripay.co.id/payment",
    "qr_string": "qr_code_string",
    "redirect": "/invoice/invoice_id"
  }
}
```

#### Check Payment Status
```http
POST /api/payment/:id/status
```

**Response:**
```json
{
  "status": true,
  "data": {
    "status": "Paid",
    "tripay_status": "PAID",
    "message": "Pembayaran berhasil"
  }
}
```

### Users

#### Get All Users (Admin Only)
```http
GET /api/users
Authorization: Bearer firebase_token
```

#### Update User (Admin Only)
```http
PUT /api/users
Authorization: Bearer firebase_token

{
  "email": "user@example.com",
  "displayName": "New Name",
  "isAdmin": false
}
```

#### Delete User (Admin Only)
```http
DELETE /api/users
Authorization: Bearer firebase_token
```

## 🔐 Authentication

The application uses Firebase Authentication with Google OAuth.

### How it Works

1. **User clicks "Login"**
2. **Redirects to Google OAuth page**
3. **User authenticates with Google**
4. **Firebase generates ID token**
5. **Token sent to server** (`/api/auth/login`)
6. **Server verifies token** using Firebase Admin SDK
7. **User document created/updated** in Firestore
8. **HttpOnly cookie set** with token
9. **User redirected to dashboard**

### Protected Routes

**Client-side (Middleware):**
- `/dashboard/*` - Requires login
- `/invoice/*` - Requires login
- `/dashboard/products` - Admin only
- `/dashboard/add-product` - Admin only
- `/dashboard/product/*` - Admin only

**Server-side (API Routes):**
- Protected with `requireAuth` and `requireAdmin` helpers
- Token verification with Firebase Admin SDK

## 💳 Payment Gateway

The application uses [Tripay](https://tripay.co.id/) as the payment gateway.

### Supported Payment Methods

- QRIS (QR Code)
- GoPay
- OVO
- Dana
- LinkAja
- ShopeePay
- BCA VA
- BNI VA
- BRI VA
- Mandiri VA
- Permata VA
- And more...

### Payment Flow

1. **User selects product and clicks "Beli Sekarang"**
2. **Application creates Tripay transaction**
3. **User redirected to Tripay payment page**
4. **User completes payment**
5. **Tripay sends callback** to `/api/payment/callback`
6. **Application verifies callback signature**
7. **Invoice status updated to "Paid"**
8. **User redirected to invoice page**
9. **Download links become available**

### Tripay Integration

- **Signature:** HMAC-SHA512
- **Mode:** Sandbox (testing) / Production (live)
- **Expiration:** 24 hours
- **Fee Calculation:** 10% platform fee
- **Auto-Verification:** Callback handling

See `/src/lib/payment/tripay.ts` for implementation details.

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts to deploy your application.

### Docker

```bash
# Build the application
docker build -t yilzi-digitalz .

# Run the container
docker run -p 3000:3000 yilzi-digitalz
```

### Traditional Hosting

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Upload `.next` folder** to your hosting provider

3. **Set environment variables**

4. **Configure server** (Node.js required)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/AmazingFeature`
3. **Commit your changes:** `git commit -m 'Add some AmazingFeature'`
4. **Push to the branch:** `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Use TypeScript for type safety
- Add comments for complex logic
- Update documentation for new features
- Test your changes thoroughly
- Ensure all tests pass

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Mark Explorer** - Original Nuxt.js Application
- **Migration Team** - Next.js 15 Migration

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Firebase](https://firebase.google.com/) - Backend-as-a-Service
- [Tripay](https://tripay.co.id/) - Payment Gateway
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Lucide](https://lucide.dev/) - Icons

## 📞 Support

If you have any questions or need support:

- **Email:** support@sadiwa-store-web.com
- **WhatsApp:** +62 813 5912 3789
- **Issues:** [GitHub Issues](https://github.com/your-username/yilzi-digitalz/issues)

---

<div align="center">

**Made with ❤️ by Yilzi Digitalz Team**

</div>
