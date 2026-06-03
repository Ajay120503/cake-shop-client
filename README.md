# 🎂 Cake Shop Frontend

Modern React + Vite + Tailwind CSS frontend for the Cake Shop E-Commerce Platform.

## Tech Stack

- **React 18** with hooks
- **Vite** for blazing fast dev server
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations
- **React Router DOM** for routing
- **React Query (TanStack Query)** for data fetching
- **Zustand** for state management
- **Axios** for API calls
- **React Hook Form** for forms
- **Lucide React** for icons
- **React Hot Toast** for notifications

## Quick Start

```bash
# Install
npm install

# Configure
cp .env.example .env
# Edit .env with your API URL

# Dev server
npm run dev

# Build
npm run build

# Preview production
npm run preview

# Test
npm test
```

## Environment Variables

```
VITE_API_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY_ID=rzp_test_xxx
VITE_SITE_NAME=Cake Shop
```

## Project Structure

```
src/
├── api/           - API client and endpoints
├── components/    - Reusable UI components
│   ├── ui/        - Base UI (Button, Input, Modal, etc.)
│   ├── layout/    - Layout (Header, Footer, Hero)
│   └── product/   - Product components
├── context/       - React context (theme)
├── hooks/         - Custom hooks
├── layouts/       - Page layouts
├── pages/         - Route pages
│   ├── Home/
│   ├── Shop/
│   ├── Product/
│   ├── Cart/
│   ├── Checkout/
│   ├── Auth/
│   ├── Account/
│   ├── Static/
│   └── Admin/
├── routes/        - Route components
├── store/         - Zustand stores
├── styles/        - Global styles
└── utils/         - Helpers
```

## Default Credentials (after seeding backend)

- **Admin:** admin@cakeshop.com / admin123
- **Customer:** customer@cakeshop.com / customer123
