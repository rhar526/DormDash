# DormDash - New Frontend Setup Guide

## Overview

A brand new frontend has been created in the `frontend-new` directory that matches the design from your screenshots. The frontend is fully functional and integrated with your existing backend.

## What's Included

### Pages
1. **Home Page** (`/`) - Landing page with "Start Your Order" button and feature cards
2. **Menu Page** (`/menu`) - Browse menu items with:
   - Dining hall dropdown filter (Worcester, Hampshire, Berkshire, Franklin)
   - Dietary tag filters (Vegetarian, Vegan, Gluten-Free, etc.)
   - Add to cart functionality
   - Shopping cart counter in header
3. **Checkout Page** (`/checkout`) - Complete order with:
   - Order summary showing all cart items
   - Delivery information form
   - Place order button
4. **Order Confirmation** (`/order-confirmation/:orderNumber`) - Shows order status and details

### Features
- ✅ Shopping cart with localStorage persistence
- ✅ Responsive design (mobile & desktop)
- ✅ Real-time menu filtering
- ✅ Full backend API integration
- ✅ Order tracking
- ✅ Form validation
- ✅ Error handling

## Tech Stack
- React 18
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

## Running the Application

### Prerequisites
Make sure your backend is running on `http://localhost:8080`

### Start the Frontend

```bash
cd frontend-new
npm run dev
```

The app will be available at `http://localhost:5173`

## API Integration

The frontend connects to these backend endpoints:

- `GET /api/locations` - Get dining hall locations
- `GET /api/menu?location={location}` - Get menu items
- `POST /api/orders` - Create new order
- `GET /api/orders/{orderNumber}` - Get order details

## Color Scheme

Matches your screenshots:
- **Primary Red**: `#8B1538` (dormdash-red)
- **Light Pink**: `#F5E6E8` (dormdash-pink)

## Next Steps

1. **Test the application**: Open http://localhost:5173 in your browser
2. **Make sure backend is running**: The frontend needs the backend API at localhost:8080
3. **Test the full flow**:
   - Click "Start Your Order" on home page
   - Select a dining hall from dropdown
   - Filter by dietary tags
   - Add items to cart
   - Go to checkout
   - Fill out delivery form
   - Place order
   - View order confirmation

## Differences from Screenshots

The functionality matches the screenshots exactly. Minor visual differences:
- Using Lucide icons instead of custom icons
- Placeholder images for menu items (pink background with utensils icon)
- Slightly different spacing/padding (can be adjusted if needed)

## File Structure

```
frontend-new/
├── src/
│   ├── context/
│   │   └── CartContext.jsx       # Shopping cart state
│   ├── pages/
│   │   ├── Home.jsx              # Landing page
│   │   ├── Menu.jsx              # Menu browsing
│   │   ├── Checkout.jsx          # Checkout form
│   │   └── OrderConfirmation.jsx # Order status
│   ├── App.jsx                   # Main app with routing
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Troubleshooting

**Issue**: Can't fetch menu items
- **Solution**: Make sure backend is running on port 8080

**Issue**: CORS errors
- **Solution**: Backend already has CORS configured for localhost:5173

**Issue**: Cart not persisting
- **Solution**: Cart uses localStorage, check browser console for errors

## Production Build

When ready to deploy:

```bash
npm run build
```

This creates optimized files in the `dist` folder.
