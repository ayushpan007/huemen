# Nalanda Library Management System – Backend

This repository contains the backend implementation of a Library Management System.
It supports user authentication, book inventory management, borrowing workflows, and GraphQL APIs.

## Tech Stack

- Node.js
- Express.js (v4)
- MongoDB + Mongoose
- JWT Authentication
- Apollo Server (GraphQL)
- REST APIs

## Setup Instructions

git clone (https://github.com/ayushpan007/huemen)
cd huemen
npm install

# Create a .env file in the root directory:

PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/nalanda_library
JWT_SECRET=your_secret_key

# Start the server

npm run dev
