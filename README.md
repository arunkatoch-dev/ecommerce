# E-commerce Platform

## Overview

This project is an e-commerce platform that allows users to browse products, add them to their cart, and make purchases. Sellers can manage their products, view orders, and update order statuses. The platform includes features such as user authentication, password reset, product ratings, product whishlists, online payment, and a responsive design.

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)

## Project Structure

The project is organized into the following directories and files:

ecommerce/ ├── app/ │ ├── (api)/ │ │ ├── auth/ │ │ │ ├── user/ │ │ │ │ ├── password-reset/ │ │ │ │ │ ├── request.js │ │ │ │ │ ├── reset.js │ │ │ │ ├── orders/ │ │ │ │ │ ├── route.js │ │ │ │ ├── products/ │ │ │ │ │ ├── rating/ │ │ │ │ │ │ ├── route.js │ │ ├── category/ │ │ │ ├── route.js │ │ ├── whishlist/ │ │ │ ├── route.js │ ├── (auth)/ │ │ ├── (user)/ │ │ │ ├── reset-password/ │ │ │ │ ├── page.js │ ├── components/ │ │ ├── Seller/ │ │ │ ├── SellerNav.jsx │ │ │ ├── AsideBar.jsx │ │ │ ├── SellerDataProvider.jsx │ │ ├── ProductDetails/ │ │ │ ├── ProductDetails.jsx ├── lib/ │ ├── db/ │ │ ├── dbConnect.js ├── Modals/ │ ├── User.js │ ├── Orders.js │ ├── Product.js │ ├── Category.js │ ├── Rating.js │ ├── Wishlist.js ├── .env ├── package.json ├── README.md

## Features

### User Features

- **User Authentication**: Users can register, log in, and log out.
- **Password Reset**: Users can request a password reset and reset their password using a token sent to their email.
- **Product Browsing**: Users can browse products, view product details, and see product ratings.
- **Cart Management**: Users can add products to their cart and proceed to checkout.
- **Wishlist Management**: Users can add products to their wishlist.
- **Order Management**: Users can view their orders and order details.

### Seller Features

- **Product Management**: Sellers can add, update, and delete products.
- **Order Management**: Sellers can view orders and update the status of each item in an order.
- **Dashboard**: Sellers can view their dashboard with relevant information.
- **Category Management**: Sellers can add, update, and delete product categories.

## Setup and Installation

### Prerequisites

- Node.js
- MongoDB
- Environment variables configured in a `.env` file

### Installation

1. Clone the repository:

```bash
git clone https://github.com/arunkatoch-dev/ecommerce.git
cd ecommerce

2. Install dependencies:

npm install
```

3. Set up environment variables in a .env file:
   MONGODB_URI=your_mongodb_uri
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   FRONTEND_URL=http://localhost:3000
   Note: cloudinary and razorpay environments are also needed.

4. Start the development server:
   npm run dev

   Usage
   User Authentication
   Register a new user.
   Log in with the registered user credentials.
   Request a password reset if the user forgets their password.
   Reset the password using the token sent to the user's email.
   Product Browsing
   Browse products on the homepage.
   Click on a product to view its details, including ratings and reviews.
   Cart Management
   Add products to the cart.
   View the cart and proceed to checkout.
   Wishlist Management
   Add products to the wishlist.
   View the wishlist.
   Order Management
   View orders and order details.
   Seller Dashboard
   Log in as a seller.
   View the seller dashboard.
   Manage products and orders.
   Admin Dashboard
   Log in as an admin.
   Manage product categories.
   API Endpoints
   User Authentication
   POST /(api)/auth/user/register: Register a new user.
   POST /(api)/auth/user/login: Log in a user.
   POST /(api)/auth/user/password-reset/request: Request a password reset.
   POST /(api)/auth/user/password-reset/reset: Reset the password.
   Product Management
   POST /(api)/auth/seller/products: Add a new product.
   GET /(api)/auth/seller/products: Get products for a seller.
   DELETE /(api)/auth/seller/products: Delete a product.
   Order Management
   GET /(api)/auth/seller/orders: Get orders for a seller.
   PATCH /(api)/auth/seller/orders: Update the status of an order item.
   Category Management
   POST /(api)/category: Add a new category.
   GET /(api)/category: Get all categories.
   PATCH /(api)/category: Update a category.
   Wishlist Management
   POST /(api)/whishlist: Add a product to the wishlist.
   GET /(api)/whishlist: Get the wishlist for a user.
   DELETE /(api)/whishlist: Remove a product from the wishlist.

   Technologies Used
   Next.js: React framework for server-side rendering and static site generation.
   MongoDB: NoSQL database for storing user, product, order, and category data.
   Mongoose: ODM for MongoDB.
   React Query: Data fetching and state management.
   Tailwind CSS: Utility-first CSS framework for styling.
   Nodemailer: Node.js module for sending emails.
   bcryptjs: Library for hashing passwords.
   jsonwebtoken: Library for generating and verifying JSON Web Tokens (JWT).
   cloudinary: Cloudinary's AI-powered Image API
   shedcnUI: Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.
   chatGPT
   github Copilot

   Contributing
   Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

   NOTE:

   1. This project design is copied from figma freebie community all the credits goes to the respective authors or designers
      Design Link: https://www.figma.com/design/qvCocK482hWumIolgvAkED/E-commerce-Website-Template-(Freebie)-(Community)?node-id=0-1&p=f&t=DTjcY8UgN5os0uev-0

   2. Some Images are also copied from pixabay, unsplash and many other sources all the image credits goes to the respective real owners of the images and logos.

TO Do's: There are many sections of this project which can be improved and may be I will work on these sections in future:

1. Nodemailer is used in many places and I configure nodemailer in every place. (REFACT - In Future)
2. Add Suggestions based on cart items
3. There are some issues with cloudinary when seller uploads multiple images on a single go.
4. Work on discount coupons.
5. Improve performance.

Checkout my portfolio for more:
https://arunkatoch-dev.vercel.app/
