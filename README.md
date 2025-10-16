Full-Stack Developer Take-Home Assignment
A full-stack application that integrates with WooCommerce REST API, stores product data locally, and provides product filtering through a text-based rule editor.

## Live Demos
Frontend: https://woo-commerce-a2gi.vercel.app

Backend API: https://woocommerce-jcxx.onrender.com

## Prerequisites
Node.js (v18 or higher)

MongoDB

Docker & Docker Compose 

## Setup Instructions
Local Development
Clone the repository

bash
git clone https://github.com/Shalini-jangid/WooCommerce.git
Backend Setup

bash
cd backend
cp .env.example .env
npm install
npm run dev
Frontend Setup

bash
cd frontend
cp .env.example .env
npm install
npm run dev
Docker Setup
bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Build and start containers
docker-compose up -d
🔧 Environment Variables
Backend (.env)
env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/products_db

# WooCommerce API
WOOCOMMERCE_BASE_URL=https://wp-multisite.convertcart.com
WOOCOMMERCE_CONSUMER_KEY=ck_af82ae325fbee1c13f31eb26148f4dea473b8f77
WOOCOMMERCE_CONSUMER_SECRET=cs_2d8cc467c5b91a8bf5ed18dd3c282ee8299c9445

# Application
PORT=5000
NODE_ENV=development


Scheduled Ingestion
Cron Job: Runs every hour (configurable via INGESTION_INTERVAL)

API Integration: Fetches products from WooCommerce REST API

Endpoint: GET /wp-json/wc/v3/products

Authentication: Basic auth via query parameters

Data Transformation
Products are transformed and stored with the following mapping:


on_sale	on_sale	Boolean mapping
created_at	date_created	ISO string preservation
Error Handling
Retry mechanism for failed API calls

Duplicate product prevention

Partial updates for existing products

## Sample Segmentation Input
Supported Operators
= : Equality

!= : Not equal

> : Greater than

< : Less than

>= : Greater than or equal

<= : Less than or equal

Example Rules
text
price > 1000
category = Electronics
stock_status = instock
on_sale = true
tags includes premium
price <= 5000
category != Accessories
stock_quantity > 10
Complex Examples
text
# High-priced electronics in stock
price > 5000
category = Electronics
stock_status = instock

# Affordable products on sale
price < 1000
on_sale = true
stock_quantity >= 5

# Exclude specific categories
category != Books
category != Clothing
price >= 100
 Architecture
Microservices
Products Service: Handles product storage and retrieval

Segments Service: Processes rule-based product filtering

Frontend Service: React application for UI

API Endpoints
GET /api/products - Retrieve all products

POST /api/segments/evaluate - Filter products based on rules

##  Testing
bash
# Backend tests
cd backend
npm test

# Frontend tests  
cd frontend
npm test
## Deployment
The application is configured for deployment on:

Vercel (Frontend)

Render (Backend)

Docker (Full stack)

## AI Usage Notes
Tools Used
ChatGPT-4: Assisted with boilerplate code generation and API integration patterns

GitHub Copilot: Helped with code completion and documentation

AI-Generated Components
Dockerfile templates for containerization

API client setup for WooCommerce integration

Database schema design assistance

React component boilerplate

Modifications & Improvements
Enhanced error handling beyond generated code

Added input validation and sanitization

Implemented custom business logic for rule evaluation

Optimized database queries for better performance

Added comprehensive testing suite
