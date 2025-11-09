# DormDash Frontend

A modern React-based frontend for the DormDash dining hall delivery service at UMass Amherst.

## Features

- **Home Page**: Landing page with service overview and call-to-action
- **Menu Page**: Browse menu items from all dining halls with filtering by location and dietary tags
- **Shopping Cart**: Add items to cart with persistent storage
- **Checkout**: Complete order with delivery information
- **Order Confirmation**: View order status and details

## Tech Stack

- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Vite**: Fast build tool and dev server

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend server running on `http://localhost:8080`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## API Integration

The frontend connects to the backend API at `http://localhost:8080/api` with the following endpoints:

- `GET /api/locations` - Get all dining hall locations
- `GET /api/menu` - Get menu items (optionally filtered by location)
- `POST /api/orders` - Create a new order
- `GET /api/orders/:orderNumber` - Get order details

## Project Structure

```
src/
├── context/
│   └── CartContext.jsx      # Shopping cart state management
├── pages/
│   ├── Home.jsx             # Landing page
│   ├── Menu.jsx             # Menu browsing page
│   ├── Checkout.jsx         # Checkout and order form
│   └── OrderConfirmation.jsx # Order confirmation page
├── App.jsx                  # Main app component with routing
├── main.jsx                 # React entry point
└── index.css                # Global styles with Tailwind
```

## Color Scheme

- Primary Red: `#8B1538` (dormdash-red)
- Light Pink: `#F5E6E8` (dormdash-pink)

## Features Implemented

✅ Responsive design for mobile and desktop
✅ Shopping cart with localStorage persistence
✅ Dining hall filtering
✅ Dietary tag filtering (Vegetarian, Vegan, Gluten-Free, etc.)
✅ Real-time order status tracking
✅ Form validation
✅ Error handling
✅ Loading states

## Notes

- Cart data persists in localStorage
- The backend must be running for full functionality
- Proxy configuration in `vite.config.js` handles API requests
