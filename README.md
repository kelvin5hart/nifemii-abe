# Nifemii Abe - Fashion Designer Website

A complete e-commerce platform for a fashion designer, built with Next.js, Firebase, and Paystack.

## Features

- **Customer Portal**: Phone/OTP authentication, order tracking, measurements, appointments
- **Admin Dashboard**: Order management, product catalog, customer management, finance tracking
- **E-commerce**: Shopping cart, checkout with Paystack payments, deposit/balance payment system
- **Mobile Responsive**: Fully optimized for mobile devices

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project
- Paystack account
- Termii account (for SMS OTP)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Environment Variables

See `.env.example` for all required environment variables.

---

## Pre-Production Checklist

Before going live, complete the following:

### 1. Security - API Keys

- [ ] Regenerate Firebase API key in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- [ ] Add API key restrictions (limit to your production domain)
- [ ] Get live Paystack keys from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developers)
  - Replace `pk_test_` with `pk_live_`
  - Replace `sk_test_` with `sk_live_`
- [ ] Set up Termii API key for SMS OTP delivery

### 2. OTP Service

- [ ] In `src/lib/otp-service.ts` - set `OTP_TESTING_MODE = false` (line 105)

### 3. Environment Variables on Vercel

Add these in Vercel Dashboard > Settings > Environment Variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase measurement ID |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack public key (live) |
| `PAYSTACK_SECRET_KEY` | Paystack secret key (live) |
| `TERMII_API_KEY` | Termii API key for SMS |
| `TERMII_SENDER_ID` | Termii sender ID |

### 4. Firebase Security Rules

- [ ] Review and tighten Firestore rules in `firestore.rules`
- [ ] Set up proper Firebase Storage rules for product images

### 5. Paystack Webhook

- [ ] Configure webhook URL in Paystack Dashboard:
  ```
  https://yourdomain.com/api/paystack/webhook
  ```

### 6. Domain Setup

- [ ] Add your production domain to Firebase authorized domains
- [ ] Configure custom domain in Vercel

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Anonymous) + Custom OTP
- **Payments**: Paystack
- **SMS**: Termii
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/
│   ├── account/       # Customer portal pages
│   ├── admin/         # Admin dashboard pages
│   ├── api/           # API routes (Paystack, contact)
│   ├── checkout/      # Checkout flow
│   └── shop/          # Product pages
├── components/
│   ├── account/       # Customer portal components
│   └── admin/         # Admin dashboard components
├── contexts/          # React contexts (Auth, Cart)
└── lib/               # Firebase, OTP service, types
```

## License

Private - All rights reserved.
