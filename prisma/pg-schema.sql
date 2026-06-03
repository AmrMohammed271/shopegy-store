-- PostgreSQL schema for ShopEgy
-- Run this on Neon to create the tables

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  price REAL NOT NULL,
  images TEXT DEFAULT '["/placeholder.svg"]',
  stock INTEGER DEFAULT 0,
  "categoryId" TEXT,
  featured INTEGER DEFAULT 0,
  rating REAL DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("categoryId") REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  items TEXT NOT NULL,
  total REAL NOT NULL,
  subtotal REAL DEFAULT 0,
  "shippingCost" REAL DEFAULT 0,
  governorate TEXT DEFAULT '',
  "shippingMethod" TEXT DEFAULT 'standard',
  "paymentMethod" TEXT DEFAULT 'cod',
  status TEXT DEFAULT 'pending',
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT DEFAULT '',
  "customerPhone" TEXT NOT NULL,
  "customerAddress" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Seed admin (password: admin123)
INSERT INTO admin_users (id, username, password)
VALUES (gen_random_uuid()::text, 'admin', '$2a$10$W5qF5qF5qF5qF5qF5qF5qO5qF5qF5qF5qF5qF5qF5qF5qF5qF5q')
ON CONFLICT (username) DO NOTHING;
