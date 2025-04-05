# Asteria - Modern Flower E-commerce Platform

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://asteria.onrender.com)
[![GitHub](https://img.shields.io/badge/github-repo-blue)](https://github.com/Ariella-Melnikov/AriShop-assignment)
[![Figma](https://img.shields.io/badge/figma-design-purple)](https://www.figma.com/design/wLuzGMbfVGoBvkDKxQWsps/home-assignment?node-id=0-1&p=f&t=rhQcq8eFIM3TKIlJ-0)

## 🌸 Project Overview

AriShop is a modern, full-stack e-commerce platform specializing in flower bouquets and arrangements. Built with TypeScript and React, it offers a seamless shopping experience with features like real-time inventory management, secure checkout via UniPaaS, and responsive design across all devices.

### 🖥️ Live Demo

Visit the live demo at [asteria.onrender.com](https://asteria.onrender.com)

![Shop Page Screenshot](path_to_screenshot.png)

## ✨ Features

### Products & Shopping
- Browse flower arrangements with dynamic filtering and sorting
- Real-time inventory tracking
- Detailed product views with size variants
- Mobile-first responsive design
- Tag-based product filtering

### Cart & Checkout
- Persistent shopping cart
- Guest & authenticated user flows
- UniPaaS secure payment integration
- Multiple delivery options
- Order confirmation and tracking

### User Experience
- Responsive, modern UI based on Figma design
- Anonymous user sessions (frontend) & authenticated sessions (backend)
- Intuitive navigation and product discovery
- Real-time price updates and currency conversion

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- pnpm 10.6.3+
- MongoDB (optional, defaults to JSON storage)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/Ariella-Melnikov/AriShop-assignment.git
cd AriShop-assignment
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
# .env
UNIPAAS_API_KEY=your_api_key
MONGODB_URI=your_mongodb_uri # Optional
\`\`\`

4. Start the development servers:
\`\`\`bash
pnpm dev
\`\`\`

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 🌍 Deployment

The application is deployed on [Render](https://render.com) with the following setup:

1. Frontend: Static Site
2. Backend: Web Service
3. Database: Initially JSON, prepared for MongoDB migration

## 🧪 Testing

### API Testing with Postman

1. Import the [Postman Collection](./apps/shared/src/postman/Ari-shop.postman_collection.json)

2. Set up environment variables in Postman:
   ```json
   {
     "base_url": "http://localhost:3030",
     "access_token": "",  
     "cart-token": ""   
   }
   ```

3. Test Flow:
   - Start with the "register user" request to create an account
   - Use "login user" to get an access token (automatically saved to environment)
   - Test product endpoints (GET /products, POST /products, etc.)
   - Test cart operations with cart-token header
   - Test authenticated endpoints using the Bearer token

4. Available Test Suites:
   - Products CRUD operations
   - Cart management
   - User authentication
   - Address management
   - Variant management
   - Order processing

### Payment Testing
Use [UniPaaS API test](https://docs.unipaas.com/docs/test-cards) for payment flow testing:
- Test Card: 4761344136141390
- Expiry: 02/34
- CVV: 123
- Name: John Doe

## 🏗️ Architecture & Design Decisions

### Tech Stack
- **Frontend**: TypeScript, React, Vite, Redux Toolkit
- **Backend**: NestJS, Express, TypeScript
- **Database**: MongoDB-ready schemas
- **State Management**: Redux with persist storage
- **Styling**: SCSS modules with responsive design
- **Payment**: UniPaaS Checkout integration

### Project Structure
\`\`\`
apps/
├── frontend/          # React frontend application
├── backend/           # NestJS backend API
└── shared/           # Shared types and utilities
\`\`\`

### Key Design Decisions
1. **Monorepo Structure**: Using pnpm workspaces for efficient dependency management
2. **Type Safety**: Full TypeScript implementation across frontend and backend
3. **State Management**: Centralized Redux store with cart persistence
4. **API Design**: RESTful architecture with clear endpoint structure
5. **Database**: JSON storage for quick prototyping, MongoDB-ready schemas

## 🔄 Assumptions & Improvements

### Current Assumptions
- Single currency (ILS) with USD conversion support
- Guest checkout without account creation
- Local storage for cart persistence
- Simple inventory management

### Future Improvements
1. Multi-currency support with real-time exchange rates
2. Enhanced address validation and geolocation
3. User authentication service migration
4. Combined product and variant creation flow for Admin
5. Advanced inventory management system
6. Performance optimizations for image loading
7. Enhanced error handling and user feedback
8. Integration testing suite
9. Analytics and monitoring implementation

## 📋 Technical Requirements Checklist

✅ TypeScript in frontend & backend  
✅ React frontend with modern practices  
✅ REST API implementation  
✅ Database integration (JSON/MongoDB)  
✅ UniPaaS sandbox integration  
✅ Order management and tracking  
✅ Responsive, clean UI  
✅ Deployment with access instructions  
✅ Clear architecture and documentation  


# App Architecture: 

This project follows a modern, scalable, and modular architecture to ensure maintainability, performance, and future scalability. The key architectural choices are as follows:

## Monorepo & Package Management:

- The application is structured as a pnpm + Turbo monorepo, ensuring efficient dependency management and optimized builds.

## Frontend:

- Built with TypeScript, React, and Vite for a fast and efficient development experience.
- Uses Redux for state management, ensuring centralized and predictable data handling across the application.
- Styling is managed with SCSS, providing modular and maintainable styles.

## Backend:

- Developed with NestJS (powered by Express) and TypeScript, ensuring a structured and scalable API design.
- Follows a modular architecture with controllers, services, and repository layers for clean code separation.

## Database:

- Initially useג lowdb with a JSON-based storage for quick prototyping.
- Designed with MongoDB-like data structures to facilitate a seamless migration to MongoDB in later stages.
- A migration script is included to transfer data from JSON to MongoDB when transitioning to production.

## Authentication & Security:

- Implements JWT-based authentication, storing tokens in HTTP-only cookies for enhanced security.
- Authentication will be integrated in later stages of development.

## State Management:

- Uses Redux Toolkit for managing complex application state, ensuring efficient data flow and updates.

## Payment Processing:

- Integrates UniPaas Checkout in a sandbox environment, following best practices outlined in the UniPaas documentation.

## Deployment:

- The application is deployed on Render, providing a reliable hosting solution for both the frontend and backend.
- A Dockerfile is included to streamline the deployment process.

This architecture ensures a smooth development experience, scalability for future enhancements, and maintainability for long-term improvements.

## Schema srtucture: 

- Product Schema: 

interface Product {
  _id: string;
  name: string;
  description: string;
  categories: string[];
  tags: string[];
  basePrice: Price;
  media: ProductMedia[];
  variants: Variant[];
  availability: Availability;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductMedia {
  _id: string;
  type: 'image' | 'video';
  url: string;
  altText?: string;
}

interface Price {
  amount: number;
  currency: 'ILS' | 'USD';
}

interface Variant {
  _id: string;
  productId: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  packaging?: 'standard' | 'gift';
  price: Price;
  inventory: Inventory;
}

interface Availability {
  inStock: boolean;
  leadTime?: number; 
}

- Inventory Schema:

interface Inventory {
  variantId: string;
  quantity: number;
  location: string;
  restockThreshold: number;
  restockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  lastUpdated: Date;
}

- User Schema:

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin' | 'customer'; 
  addresses: Address[];
  defaultAddressId?: string;
  orders: Order[];
  cart: Cart;
  createdAt: Date;
}

interface Address {
  _id: string;
  userId: string;
  country: string;
  city: string;
  street: string;
  building: string;
  apartment?: string;
  floor?: string;
  entrance?: string;
  postalCode: string;
  isDefault: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

- Cart Schema: 

interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  subtotal: Price;
  tax: Price;
  shipping: Price;
  total: Price;
  createdAt: Date;
  updatedAt: Date;
}

interface CartItem {
  _id: string;
  cartId: string;
  variantId: string;
  productId: string;
  quantity: number;
  price: Price;
  totalPrice: Price;
  addedAt: Date;
}

- Order Schema: 

interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  deliveryMethod: DeliveryMethod;
  payment: Payment;
  subtotal: Price;
  shipping: Price;
  total: Price;
  status: OrderStatus;
  statusHistory: StatusChange[];
  createdAt: Date;
}

interface OrderItem {
  _id: string;
  orderId: string;
  variantId: string;
  productId: string;
  productSnapshot: {
    title: string;
    attributes: Record <string, string>;
    price: Price;
    media: {
      url: string;
      alt?: string;
    };
  };
  quantity: number;
  price: Price;
  totalPrice: Price;
}

type OrderStatus = 
  | 'pending_payment' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

interface StatusChange {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

//Payment Schema:

interface Payment {
  _id: string;
  orderId: string;
  provider: 'unipaas';
  transactionId: string;
  amount: Price;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  timestamp: Date;
  details: {
    [key: string]: any;
  };
}

- Delivery Schema:

interface DeliveryMethod {
  _id: string;
  carrier: string;
  method:  'standard' | 'express' | 'pickup';
  trackingNumber?: string;
  estimatedDeliveryWindow: {
    from: Date;
    to: Date;
  };
  price: Price;
  areaDescription?: string;
}

## Data collections:

#products: 
{
  _id: ObjectId,
  name: "Romantic Red Roses",
  description: "A classic bouquet of red roses.",
  categories: ["romantic", "valentines"],
  tags: ["roses", "love", "red"],
  basePrice: { amount: 150, currency: "ILS" },
  media: [
    { type: "image", url: "...", altText: "Bouquet close-up" }
  ],
  variants: [
    {
      _id: ObjectId,
      size: "medium",
      color: "red",
      packaging: "gift",
      price: { amount: 180, currency: "ILS" },
      inventory: {
        quantity: 12,
        location: "TA-Store",
        restockThreshold: 3,
        restockStatus: "in_stock",
        lastUpdated: ISODate
      }
    }
  ],
  availability: { inStock: true },
  createdAt: ISODate,
  updatedAt: ISODate
}

#users:

{
  _id: ObjectId,
  email: "customer@email.com",
  firstName: "Ariella",
  lastName: "Melnikov",
  phone: "+972...",
  role: "customer",
  addresses: [ {...}, {...} ],
  defaultAddressId: ObjectId,
  cart: {
    _id: ObjectId,
    items: [ {...}, {...} ],
    subtotal: {...},
    shipping: {...},
    total: {...},
    updatedAt: ISODate
  },
  createdAt: ISODate
}

#orders: 

{
  _id: ObjectId,
  userId: ObjectId,
  orderNumber: "ORD123456",
  items: [
    {
      productId: ObjectId,
      variantId: ObjectId,
      productSnapshot: {
        title: "Romantic Red Roses",
        attributes: { size: "medium", color: "red", packaging: "gift" },
        price: {...},
        media: { url: "...", alt: "..." }
      },
      quantity: 2,
      price: {...},
      totalPrice: {...}
    }
  ],
  shippingAddress: {...},
  deliveryMethod: {...},
  payment: {...},
  status: "processing",
  statusHistory: [ { status: "pending_payment", timestamp: ISODate }, ... ],
  createdAt: ISODate
}

#payments:

{
  _id: ObjectId,
  orderId: ObjectId,
  provider: "unipaas",
  transactionId: "...",
  amount: {...},
  status: "completed",
  timestamp: ISODate,
  details: {...}
}

#delivery_methods:

{
  _id: ObjectId,
  carrier: "Israel Post",
  method: "express",
  estimatedDeliveryWindow: {
    from: ISODate,
    to: ISODate
  },
  price: {...},
  areaDescription: "Available in Tel Aviv only"
}

## 📋 TODO List

### Database & Infrastructure
- [ ] Migrate from JSON storage to MongoDB
- [ ] Implement database indexing for improved query performance
- [ ] Set up database backups and monitoring
- [ ] Implement caching layer for frequently accessed data

### Authentication & Security
- [ ] Migrate to a robust auth service
- [ ] Add rate limiting for API endpoints
- [ ] Add request validation middleware

### Features & UX
- [ ] Implement address validation with geocoding
- [ ] Add customer geolocation tracking for delivery optimization
- [ ] Create combined product and variant creation flow for Admin
- [ ] Enhance inventory management system
- [ ] Add real-time stock updates
- [ ] Implement order tracking system
- [ ] Add wishlist functionality
- [ ] Implement product recommendations

### Performance & Optimization
- [ ] Optimize image loading and implement lazy loading
- [ ] Add image compression and CDN integration
- [ ] Implement server-side rendering for critical pages
- [ ] Add service worker for offline capabilities
- [ ] Optimize bundle size and implement code splitting
- [ ] Add performance monitoring and error tracking

### Testing & Quality
- [ ] Add end-to-end testing suite
- [ ] Set up continuous integration pipeline
- [ ] Implement automated accessibility testing
- [ ] Add load testing for high-traffic scenarios

### Admin Features
- [ ] Create admin dashboard
- [ ] Implement bulk product management
- [ ] Add order management system
- [ ] Create inventory alerts and notifications
- [ ] Add staff management and permissions

### Mobile & Responsive
- [ ] Implement touch-friendly interactions
- [ ] Add mobile-specific optimizations
- [ ] Test and optimize for various devices

### Monitoring & Maintenance
- [ ] Set up logging and monitoring
- [ ] Implement error tracking and reporting
- [ ] Create automated backup system
- [ ] Implement automated deployment pipeline

### Documentation
- [ ] Create API documentation with Swagger/OpenAPI
- [ ] Add JSDoc comments for key functions
- [ ] Create developer onboarding guide
- [ ] Document deployment procedures
- [ ] Add architecture decision records (ADRs)

### Business & Marketing
- [ ] Implement SEO optimizations
- [ ] Add analytics tracking
- [ ] Create email notification system
- [ ] Add customer feedback system
- [ ] Implement loyalty program
- [ ] Add social sharing features

## 📋 Technical Requirements Checklist

✅ TypeScript in frontend & backend  
✅ React frontend with modern practices  
✅ REST API implementation  
✅ Database integration (JSON/MongoDB)  
✅ UniPaaS sandbox integration  
✅ Order management and tracking  
✅ Responsive, clean UI  
✅ Deployment with access instructions  
✅ Clear architecture and documentation  


# App Architecture: 

This project follows a modern, scalable, and modular architecture to ensure maintainability, performance, and future scalability. The key architectural choices are as follows:

## Monorepo & Package Management:

- The application is structured as a pnpm + Turbo monorepo, ensuring efficient dependency management and optimized builds.

## Frontend:

- Built with TypeScript, React, and Vite for a fast and efficient development experience.
- Uses Redux for state management, ensuring centralized and predictable data handling across the application.
- Styling is managed with SCSS, providing modular and maintainable styles.

## Backend:

- Developed with NestJS (powered by Express) and TypeScript, ensuring a structured and scalable API design.
- Follows a modular architecture with controllers, services, and repository layers for clean code separation.

## Database:

- Initially useג lowdb with a JSON-based storage for quick prototyping.
- Designed with MongoDB-like data structures to facilitate a seamless migration to MongoDB in later stages.
- A migration script is included to transfer data from JSON to MongoDB when transitioning to production.

## Authentication & Security:

- Implements JWT-based authentication, storing tokens in HTTP-only cookies for enhanced security.
- Authentication will be integrated in later stages of development.

## State Management:

- Uses Redux Toolkit for managing complex application state, ensuring efficient data flow and updates.

## Payment Processing:

- Integrates UniPaas Checkout in a sandbox environment, following best practices outlined in the UniPaas documentation.

## Deployment:

- The application is deployed on Render, providing a reliable hosting solution for both the frontend and backend.
- A Dockerfile is included to streamline the deployment process.

This architecture ensures a smooth development experience, scalability for future enhancements, and maintainability for long-term improvements.

## Schema srtucture: 

- Product Schema: 

interface Product {
  _id: string;
  name: string;
  description: string;
  categories: string[];
  tags: string[];
  basePrice: Price;
  media: ProductMedia[];
  variants: Variant[];
  availability: Availability;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductMedia {
  _id: string;
  type: 'image' | 'video';
  url: string;
  altText?: string;
}

interface Price {
  amount: number;
  currency: 'ILS' | 'USD';
}

interface Variant {
  _id: string;
  productId: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  packaging?: 'standard' | 'gift';
  price: Price;
  inventory: Inventory;
}

interface Availability {
  inStock: boolean;
  leadTime?: number; 
}

- Inventory Schema:

interface Inventory {
  variantId: string;
  quantity: number;
  location: string;
  restockThreshold: number;
  restockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  lastUpdated: Date;
}

- User Schema:

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin' | 'customer'; 
  addresses: Address[];
  defaultAddressId?: string;
  orders: Order[];
  cart: Cart;
  createdAt: Date;
}

interface Address {
  _id: string;
  userId: string;
  country: string;
  city: string;
  street: string;
  building: string;
  apartment?: string;
  floor?: string;
  entrance?: string;
  postalCode: string;
  isDefault: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

- Cart Schema: 

interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  subtotal: Price;
  tax: Price;
  shipping: Price;
  total: Price;
  createdAt: Date;
  updatedAt: Date;
}

interface CartItem {
  _id: string;
  cartId: string;
  variantId: string;
  productId: string;
  quantity: number;
  price: Price;
  totalPrice: Price;
  addedAt: Date;
}

- Order Schema: 

interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  deliveryMethod: DeliveryMethod;
  payment: Payment;
  subtotal: Price;
  shipping: Price;
  total: Price;
  status: OrderStatus;
  statusHistory: StatusChange[];
  createdAt: Date;
}

interface OrderItem {
  _id: string;
  orderId: string;
  variantId: string;
  productId: string;
  productSnapshot: {
    title: string;
    attributes: Record <string, string>;
    price: Price;
    media: {
      url: string;
      alt?: string;
    };
  };
  quantity: number;
  price: Price;
  totalPrice: Price;
}

type OrderStatus = 
  | 'pending_payment' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

interface StatusChange {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

//Payment Schema:

interface Payment {
  _id: string;
  orderId: string;
  provider: 'unipaas';
  transactionId: string;
  amount: Price;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  timestamp: Date;
  details: {
    [key: string]: any;
  };
}

- Delivery Schema:

interface DeliveryMethod {
  _id: string;
  carrier: string;
  method:  'standard' | 'express' | 'pickup';
  trackingNumber?: string;
  estimatedDeliveryWindow: {
    from: Date;
    to: Date;
  };
  price: Price;
  areaDescription?: string;
}

## Data collections:

#products: 
{
  _id: ObjectId,
  name: "Romantic Red Roses",
  description: "A classic bouquet of red roses.",
  categories: ["romantic", "valentines"],
  tags: ["roses", "love", "red"],
  basePrice: { amount: 150, currency: "ILS" },
  media: [
    { type: "image", url: "...", altText: "Bouquet close-up" }
  ],
  variants: [
    {
      _id: ObjectId,
      size: "medium",
      color: "red",
      packaging: "gift",
      price: { amount: 180, currency: "ILS" },
      inventory: {
        quantity: 12,
        location: "TA-Store",
        restockThreshold: 3,
        restockStatus: "in_stock",
        lastUpdated: ISODate
      }
    }
  ],
  availability: { inStock: true },
  createdAt: ISODate,
  updatedAt: ISODate
}

#users:

{
  _id: ObjectId,
  email: "customer@email.com",
  firstName: "Ariella",
  lastName: "Melnikov",
  phone: "+972...",
  role: "customer",
  addresses: [ {...}, {...} ],
  defaultAddressId: ObjectId,
  cart: {
    _id: ObjectId,
    items: [ {...}, {...} ],
    subtotal: {...},
    shipping: {...},
    total: {...},
    updatedAt: ISODate
  },
  createdAt: ISODate
}

#orders: 

{
  _id: ObjectId,
  userId: ObjectId,
  orderNumber: "ORD123456",
  items: [
    {
      productId: ObjectId,
      variantId: ObjectId,
      productSnapshot: {
        title: "Romantic Red Roses",
        attributes: { size: "medium", color: "red", packaging: "gift" },
        price: {...},
        media: { url: "...", alt: "..." }
      },
      quantity: 2,
      price: {...},
      totalPrice: {...}
    }
  ],
  shippingAddress: {...},
  deliveryMethod: {...},
  payment: {...},
  status: "processing",
  statusHistory: [ { status: "pending_payment", timestamp: ISODate }, ... ],
  createdAt: ISODate
}

#payments:

{
  _id: ObjectId,
  orderId: ObjectId,
  provider: "unipaas",
  transactionId: "...",
  amount: {...},
  status: "completed",
  timestamp: ISODate,
  details: {...}
}

#delivery_methods:

{
  _id: ObjectId,
  carrier: "Israel Post",
  method: "express",
  estimatedDeliveryWindow: {
    from: ISODate,
    to: ISODate
  },
  price: {...},
  areaDescription: "Available in Tel Aviv only"
}

## 📋 TODO List

### Database & Infrastructure
- [ ] Migrate from JSON storage to MongoDB
- [ ] Implement database indexing for improved query performance
- [ ] Set up database backups and monitoring
- [ ] Implement caching layer for frequently accessed data

### Authentication & Security
- [ ] Migrate to a robust auth service
- [ ] Add rate limiting for API endpoints
- [ ] Add request validation middleware

### Features & UX
- [ ] Implement address validation with geocoding
- [ ] Add customer geolocation tracking for delivery optimization
- [ ] Create combined product and variant creation flow for Admin
- [ ] Enhance inventory management system
- [ ] Add real-time stock updates
- [ ] Implement order tracking system
- [ ] Add wishlist functionality
- [ ] Implement product recommendations

### Performance & Optimization
- [ ] Optimize image loading and implement lazy loading
- [ ] Add image compression and CDN integration
- [ ] Implement server-side rendering for critical pages
- [ ] Add service worker for offline capabilities
- [ ] Optimize bundle size and implement code splitting
- [ ] Add performance monitoring and error tracking

### Testing & Quality
- [ ] Add end-to-end testing suite
- [ ] Set up continuous integration pipeline
- [ ] Implement automated accessibility testing
- [ ] Add load testing for high-traffic scenarios

### Admin Features
- [ ] Create admin dashboard
- [ ] Implement bulk product management
- [ ] Add order management system
- [ ] Create inventory alerts and notifications
- [ ] Add staff management and permissions

### Mobile & Responsive
- [ ] Implement touch-friendly interactions
- [ ] Add mobile-specific optimizations
- [ ] Test and optimize for various devices

### Monitoring & Maintenance
- [ ] Set up logging and monitoring
- [ ] Implement error tracking and reporting
- [ ] Create automated backup system
- [ ] Implement automated deployment pipeline

### Documentation
- [ ] Create API documentation with Swagger/OpenAPI
- [ ] Add JSDoc comments for key functions
- [ ] Create developer onboarding guide
- [ ] Document deployment procedures
- [ ] Add architecture decision records (ADRs)

### Business & Marketing
- [ ] Implement SEO optimizations
- [ ] Add analytics tracking
- [ ] Create email notification system
- [ ] Add customer feedback system
- [ ] Implement loyalty program
- [ ] Add social sharing features

## 📋 Technical Requirements Checklist

✅ TypeScript in frontend & backend  
✅ React frontend with modern practices  
✅ REST API implementation  
✅ Database integration (JSON/MongoDB)  
✅ UniPaaS sandbox integration  
✅ Order management and tracking  
✅ Responsive, clean UI  
✅ Deployment with access instructions  
✅ Clear architecture and documentation  


# App Architecture: 

This project follows a modern, scalable, and modular architecture to ensure maintainability, performance, and future scalability. The key architectural choices are as follows:

## Monorepo & Package Management:

- The application is structured as a pnpm + Turbo monorepo, ensuring efficient dependency management and optimized builds.

## Frontend:

- Built with TypeScript, React, and Vite for a fast and efficient development experience.
- Uses Redux for state management, ensuring centralized and predictable data handling across the application.
- Styling is managed with SCSS, providing modular and maintainable styles.

## Backend:

- Developed with NestJS (powered by Express) and TypeScript, ensuring a structured and scalable API design.
- Follows a modular architecture with controllers, services, and repository layers for clean code separation.

## Database:

- Initially useג lowdb with a JSON-based storage for quick prototyping.
- Designed with MongoDB-like data structures to facilitate a seamless migration to MongoDB in later stages.
- A migration script is included to transfer data from JSON to MongoDB when transitioning to production.

## Authentication & Security:

- Implements JWT-based authentication, storing tokens in HTTP-only cookies for enhanced security.
- Authentication will be integrated in later stages of development.

## State Management:

- Uses Redux Toolkit for managing complex application state, ensuring efficient data flow and updates.

## Payment Processing:

- Integrates UniPaas Checkout in a sandbox environment, following best practices outlined in the UniPaas documentation.

## Deployment:

- The application is deployed on Render, providing a reliable hosting solution for both the frontend and backend.
- A Dockerfile is included to streamline the deployment process.

This architecture ensures a smooth development experience, scalability for future enhancements, and maintainability for long-term improvements.

## Data collections:

#products: 
{
  _id: ObjectId,
  name: "Romantic Red Roses",
  description: "A classic bouquet of red roses.",
  categories: ["romantic", "valentines"],
  tags: ["roses", "love", "red"],
  basePrice: { amount: 150, currency: "ILS" },
  media: [
    { type: "image", url: "...", altText: "Bouquet close-up" }
  ],
  variants: [
    {
      _id: ObjectId,
      size: "medium",
      color: "red",
      packaging: "gift",
      price: { amount: 180, currency: "ILS" },
      inventory: {
        quantity: 12,
        location: "TA-Store",
        restockThreshold: 3,
        restockStatus: "in_stock",
        lastUpdated: ISODate
      }
    }
  ],
  availability: { inStock: true },
  createdAt: ISODate,
  updatedAt: ISODate
}

#users:

{
  _id: ObjectId,
  email: "customer@email.com",
  firstName: "Ariella",
  lastName: "Melnikov",
  phone: "+972...",
  role: "customer",
  addresses: [ {...}, {...} ],
  defaultAddressId: ObjectId,
  cart: {
    _id: ObjectId,
    items: [ {...}, {...} ],
    subtotal: {...},
    shipping: {...},
    total: {...},
    updatedAt: ISODate
  },
  createdAt: ISODate
}

#orders: 

{
  _id: ObjectId,
  userId: ObjectId,
  orderNumber: "ORD123456",
  items: [
    {
      productId: ObjectId,
      variantId: ObjectId,
      productSnapshot: {
        title: "Romantic Red Roses",
        attributes: { size: "medium", color: "red", packaging: "gift" },
        price: {...},
        media: { url: "...", alt: "..." }
      },
      quantity: 2,
      price: {...},
      totalPrice: {...}
    }
  ],
  shippingAddress: {...},
  deliveryMethod: {...},
  payment: {...},
  status: "processing",
  statusHistory: [ { status: "pending_payment", timestamp: ISODate }, ... ],
  createdAt: ISODate
}

#payments:

{
  _id: ObjectId,
  orderId: ObjectId,
  provider: "unipaas",
  transactionId: "...",
  amount: {...},
  status: "completed",
  timestamp: ISODate,
  details: {...}
}

#delivery_methods:

{
  _id: ObjectId,
  carrier: "Israel Post",
  method: "express",
  estimatedDeliveryWindow: {
    from: ISODate,
    to: ISODate
  },
  price: {...},
  areaDescription: "Available in Tel Aviv only"
}

# API Endpoints

## Product Endpoints

|Method | Endpoint              | Description                               | Query Parameters                                                                              | Request Body | Response               |
|-------|-----------------------|-------------------------------------------|-----------------------------------------------------------------------------------------------|--------------|------------------------|
|GET    |`/api/products`        |Get all products with filtering and sorting|`categories`, `color`, `tags`, `priceMin`, `priceMax`, `search`, `inStock`, `sortBy`, `page`, `limit`| - |Products list with pagination|
|GET    |`/api/products/:id`    |Get specific product by ID                 | -                                                                                             |     -        | Single product details |
|GET    |`/api/products/search` |Search products by query string            | `q`, `page`, `limit`                                                                          | - | Matching products with pagination |
|POST   |`/api/products`        |Create a new product                       | -                                                                                             | Product details | New product created |
|PUT    |`/api/products/:id`    |Update an existing product                 | -                                                                                             | Product details | Updated product     |
|DELETE |`/api/products/:id`    |Delete a product                           | -                                                                                             | -               | Success message     |

## Variant Endpoints

| Method | Endpoint                                                       | Description                    | Query Parameters | Request Body     | Response               |
|--------|----------------------------------------------------------------|--------------------------------|------------------|------------------|------------------------|
| POST   | `/api/products/:productId/variants`                            | Add a new variant to a product |        -         | Variant details  | New variant added      |
| PUT    | `/api/products/:productId/variants/:variantId`                 | Update a specific variant      |        -         | Variant details  | Updated variant        |
| DELETE | `/api/products/:productId/variants/:variantId`                 | Delete a specific variant      |        -         |        -         | Success message        |

## Cart Endpoints

| Method | Endpoint                  | Description               | Query Parameters | Request Body                         | Response             |
|--------|---------------------------|---------------------------|------------------|--------------------------------------|----------------------|
| GET    | `/api/cart`               | Get current user's cart   |        -         |                     -                | Full cart with items |
| POST   | `/api/cart/items`         | Add item to cart          |        -         | `productId`, `variantId`, `quantity` | Updated cart         |
| PUT    | `/api/cart/items/:itemId` | Update cart item quantity |        -         | `quantity`                           | Updated cart         |
| DELETE | `/api/cart/items/:itemId` | Remove item from cart     |        -         |                     -                | Updated cart         |
| DELETE | `/api/cart`               | Clear cart                |        -         |                     -                | Success message      |

## Order Endpoints

| Method | Endpoint               | Description                    | Query Parameters                        | Request Body                                              | Response                    |
|--------|------------------------|--------------------------------|-----------------------------------------|-----------------------------------------------------------|-----------------------------|
| POST   |`/api/orders`           | Create order from cart         |                   -                     | `shippingAddressId`, `deliveryMethodId`, `paymentDetails` | New order                   |
| GET    |`/api/orders`           | Get all orders for current user| `status`, `from`, `to`, `page`, `limit` |                            -                              | Orders list with pagination |
| GET    |`/api/orders/:id`       | Get specific order by ID       |                   -                     |                            -                              | Single order details        |
| POST   |`/api/orders/:id/cancel`| Cancel order                   |                   -                     | {reasonTag?, reasonText?: string}                         | Updated order               |

*Cancel Reason Tags: "changed_mind- I changed my mind", "ordered_wrong – Ordered by mistake", "delayed – Delivery is too late","found_cheaper – Found cheaper elsewhere", "other – Other reason"

## Admin Order Endpoints

| Method | Endpoint                 | Description                 | Query Parameters                        | Request Body                          | Response       |
|--------|--------------------------|-----------------------------|-----------------------------------------|---------------------------------------|----------------|
| PUT    | `/api/orders/:id/status` | Update order status (admin) |                   -                     | { status: 'shipped' } | Updated order |                |
| GET    | `/api/admin/orders`      | View all orders             | `status`, `from`, `to`, `page`, `limit` |                   -                   | Paginated list |

## Authentication Endpoints

| Method | Endpoint                    | Description              | Query Parameters | Request Body                                          | Response               |
|--------|-----------------------------|--------------------------|------------------|-------------------------------------------------------|------------------------|
| POST   | `/api/auth/register`        | Register new user        |        -         | `email`, `password`, `firstName`, `lastName`, `phone` | User profile and token |
| POST   | `/api/auth/login`           | Login user               |        -         | `email`, `password`                                   | User profile and token |
| POST   | `/api/auth/logout`          | Logout user              |        -         |                              -                        | Success message        |
| GET    | `/api/auth/profile`         | Get current user profile |        -         |                              -                        | User profile           |
| PUT    | `/api/auth/profile`         | Update user profile      |        -         | `firstName`, `lastName`, `phone`                      | Updated user profile   |
| PUT    | `/api/auth/change-password` | Change password          |        -         | `currentPassword`, `newPassword`                      | Success message        |

## Address Endpoints

| Method | Endpoint                     | Description                            | Query Parameters | Request Body    | Response        |
|--------|------------------------------|----------------------------------------|------------------|-----------------|-----------------|
| GET    | `/api/addresses`             | Get all addresses for current user     |        -         |        -        | Addresses list  |
| GET    | `/api/addresses/:id`         | Get specific addresse for current user |        -         |        -        | Address object  |
| POST   | `/api/addresses`             | Add new address                        |        -         | Address details | New address     |
| PUT    | `/api/addresses/:id`         | Update address                         |        -         | Address details | Updated address |
| DELETE | `/api/addresses/:id`         | Delete address                         |        -         |        -        | Success message |
| PUT    | `/api/addresses/:id/default` | Set default address                    |        -         |        -        | Updated address |

## Backup Structure

The application implements a robust backup strategy to ensure data integrity and availability:

### Database Backups
- **Automated Daily Backups**: MongoDB data is backed up daily using automated scripts
- **Incremental Backups**: Hourly incremental backups for critical collections
- **Backup Storage**: 
  - Primary: Cloud storage (AWS S3)
  - Secondary: Local storage with encryption
- **Retention Policy**:
  - Daily backups: 30 days
  - Weekly backups: 12 weeks
  - Monthly backups: 12 months

### Code & Configuration Backups
- **Version Control**: All code is stored in Git with regular commits
- **Configuration Files**: Stored in version control with sensitive data encrypted
- **Environment Variables**: Securely stored in environment management system

### Disaster Recovery
- **Recovery Time Objective (RTO)**: 4 hours for full system recovery
- **Recovery Point Objective (RPO)**: 1 hour for data loss
- **Testing**: Monthly disaster recovery drills
- **Documentation**: Detailed recovery procedures and checklists

## Front Structure

The frontend architecture is designed for scalability and maintainability:

### Component Organization
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components
│   ├── features/        # Feature-specific components
│   └── pages/           # Page components
├── hooks/               # Custom React hooks
├── services/            # API and external service integrations
├── store/               # Redux store configuration
├── styles/              # Global styles and theme
└── utils/               # Utility functions
```

### Key Frontend Features
1. **Component Library**
   - Reusable UI components with TypeScript
   - Storybook documentation
   - Accessibility compliance (WCAG 2.1)

2. **State Management**
   - Redux for global state
   - Context API for theme and auth
   - Local state with React hooks

3. **Performance Optimization**
   - Code splitting with React.lazy
   - Image optimization and lazy loading
   - Memoization with React.memo
   - Service worker for offline capabilities

4. **Styling System**
   - SCSS modules for component styles
   - CSS variables for theming
   - Responsive design breakpoints
   - Dark/light mode support

5. **Testing Structure**
   - Unit tests with Jest
   - Component tests with React Testing Library
   - E2E tests with Cypress
   - Visual regression testing

6. **Build & Deployment**
   - Vite for fast development
   - Production optimization
   - CI/CD pipeline integration
   - Automated testing and deployment

