

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

- Initially uses lowdb with a JSON-based storage for quick prototyping.
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


//Product Schema: 

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
  currency: 'ILS' | 'USD' | 'EUR';
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
  leadTime?: number; // Days required to fulfill the order if not in stock
}

//Inventory Schema:

interface Inventory {
  variantId: string;
  quantity: number;
  location: string;
  restockThreshold: number;
  restockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  lastUpdated: Date;
}

//User Schema:

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

//Cart Schema: 

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

//Order Schema: 

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

//Delivery Schema:

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

# E-commerce API Endpoints

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
| POST   |`/api/orders/:id/cancel`| Cancel order                   |                   -                     | `reason` (optional)                                       | Updated order               |
| POST   |`/api/orders/:id/return`| Request return/refund          |                   -                     | `items` array with return details                         | Updated order               |

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

| Method | Endpoint                     | Description                        | Query Parameters | Request Body    | Response        |
|--------|------------------------------|------------------------------------|------------------|-----------------|-----------------|
| GET    | `/api/addresses`             | Get all addresses for current user |        -         |        -        | Addresses list  |
| POST   | `/api/addresses`             | Add new address                    |        -         | Address details | New address     |
| PUT    | `/api/addresses/:id`         | Update address                     |        -         | Address details | Updated address |
| DELETE | `/api/addresses/:id`         | Delete address                     |        -         |        -        | Success message |
| PUT    | `/api/addresses/:id/default` | Set default address                |        -         |        -        | Updated address |


DALLE prompt for fllowers img: 
A luxurious floral arrangement in a modern, minimalistic style, featuring a bouquet of [flower type] in soft neutral tones. The bouquet is placed in a clear or ceramic vase on a marble or light-toned surface, with natural light casting soft shadows. The aesthetic is refined and elegant, with a delicate balance of texture and color. The background is clean and airy, often white or subtly marbled. The image should have a high-end boutique feel, with an emphasis on sophistication and timeless beauty."