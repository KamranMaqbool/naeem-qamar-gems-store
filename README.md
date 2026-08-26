# Naeem Qamar Gems Store

A luxury gemstone e-commerce store built with React, Vite, and Tailwind CSS.

## Features

- Modern component-based React architecture
- Tailwind CSS with custom design system (Deep Emerald, Champagne Gold, Pearl)
- Responsive layouts (mobile, tablet, desktop)
- Product catalog with filtering and sorting
- Product detail pages with image galleries
- Shopping cart with drawer
- Dynamic branding configuration

## Tech Stack

- React 18 + Vite
- React Router v6
- Tailwind CSS v4
- Material Symbols icons
- Google Fonts (Playfair Display + Inter)

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/      # Navbar, Footer
│   │   ├── sections/    # Hero, CategoryCard, TrustBanner
│   │   ├── product/     # ProductCard, ProductGrid, FilterSidebar
│   │   └── cart/        # CartDrawer
│   ├── pages/           # Home, Shop, ProductDetail, Cart
│   ├── context/         # CartContext
│   ├── config/          # Brand configuration
│   ├── data/            # Product data
│   └── utils/
└── public/
```