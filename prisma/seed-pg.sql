-- PostgreSQL schema + seed data for ShopEgy
-- Run: psql $DATABASE_URL -f prisma/seed-pg.sql

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
INSERT INTO admin_users (id, username, password) VALUES
  (gen_random_uuid()::text, 'admin', '$2a$10$W5qF5qF5qF5qF5qF5qF5qO5qF5qF5qF5qF5qF5qF5qF5qF5qF5q')
ON CONFLICT (username) DO NOTHING;

-- Seed categories
INSERT INTO categories (id, name, slug, image) VALUES
  ('cat-1', 'إلكترونيات', 'electronics', NULL),
  ('cat-2', 'سيارات ودراجات', 'automotive', NULL),
  ('cat-3', 'المنزل والمطبخ', 'home-kitchen', NULL),
  ('cat-4', 'الجمال والعناية', 'beauty-care', NULL),
  ('cat-5', 'أزياء', 'fashion', NULL),
  ('cat-6', 'الصحة', 'health', NULL),
  ('cat-7', 'أطفال', 'kids', NULL),
  ('cat-8', 'رياضة', 'sports', NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed 40 products
INSERT INTO products (id, name, slug, description, price, images, stock, "categoryId", featured, rating) VALUES
  ('p-1', 'ساعة ذكية ابل واتش سيريس 9', 'apple-watch-series-9', 'ساعة ذكية من ابل - أحدث إصدار', 24999.00, '["https://picsum.photos/seed/watch1/400/400"]', 50, 'cat-1', 1, 4.8),
  ('p-2', 'سماعات لاسلكية ابل ايربودز برو 2', 'airpods-pro-2', 'سماعات لاسلكية مع خاصية إلغاء الضوضاء', 12499.00, '["https://picsum.photos/seed/airpods/400/400"]', 100, 'cat-1', 1, 4.7),
  ('p-3', 'موبايل سامسونج جالاكسي S24 الترا', 'samsung-s24-ultra', 'هاتف ذكي بشاشة 6.8 بوصة', 51999.00, '["https://picsum.photos/seed/s24/400/400"]', 30, 'cat-1', 1, 4.9),
  ('p-4', 'لابتوب لينوفو ثينك باد X1 كاربون', 'lenovo-x1-carbon', 'لابتوب خفيف الوزن للأعمال', 69999.00, '["https://picsum.photos/seed/laptop/400/400"]', 20, 'cat-1', 0, 4.6),
  ('p-5', 'تابلت سامسونج جالاكسي Tab S9', 'samsung-tab-s9', 'جهاز لوحي بشاشة 11 بوصة', 32999.00, '["https://picsum.photos/seed/tablet/400/400"]', 25, 'cat-1', 0, 4.5),
  ('p-6', 'كاميرا كانون EOS R50', 'canon-eos-r50', 'كاميرا بدون مرآة بدقة 24.2 ميجابكسل', 45999.00, '["https://picsum.photos/seed/camera/400/400"]', 15, 'cat-1', 1, 4.7),
  ('p-7', 'شاحن متنقل انكر 20000mAh', 'anker-powerbank-20000', 'بطارية خارجية سريعة الشحن', 1499.00, '["https://picsum.photos/seed/powerbank/400/400"]', 200, 'cat-1', 0, 4.4),
  ('p-8', 'سماعة رأس لاسلكية سوني WH-1000XM5', 'sony-wh-1000xm5', 'سماعة عازلة للضوضاء', 12999.00, '["https://picsum.photos/seed/headphones/400/400"]', 40, 'cat-1', 0, 4.8),
  ('p-9', 'مسجل فيديو للسيارة', 'car-dashcam', 'كاميرا سيارة دقيقة 4K', 2499.00, '["https://picsum.photos/seed/dashcam/400/400"]', 150, 'cat-2', 0, 4.3),
  ('p-10', 'زيت محرك شل هيليكس 5W-30', 'shell-helix-5w30', 'زيت محرك تخليقي بالكامل', 899.00, '["https://picsum.photos/seed/oil/400/400"]', 300, 'cat-2', 0, 4.5),
  ('p-11', 'بطارية سيارة كلورايد', 'car-battery-chloride', 'بطارية سيارة 12 فولت', 2499.00, '["https://picsum.photos/seed/battery/400/400"]', 100, 'cat-2', 0, 4.4),
  ('p-12', 'إطارات سيارة بريدجستون', 'bridgestone-tires', 'إطارات سيارة عالية الجودة', 5999.00, '["https://picsum.photos/seed/tires/400/400"]', 60, 'cat-2', 0, 4.6),
  ('p-13', 'دراجة هوائية جينيس', 'genesis-bicycle', 'دراجة هوائية رياضية', 8999.00, '["https://picsum.photos/seed/bike/400/400"]', 30, 'cat-2', 1, 4.2),
  ('p-14', 'مكنسة روبوت رومبا', 'roomba-robot', 'مكنسة كهربائية روبوت ذكية', 15999.00, '["https://picsum.photos/seed/roomba/400/400"]', 20, 'cat-3', 1, 4.6),
  ('p-15', 'خلاط كهربائي مولينكس', 'moulinex-blender', 'خلاط بقوة 500 وات', 2499.00, '["https://picsum.photos/seed/blender/400/400"]', 80, 'cat-3', 0, 4.3),
  ('p-16', 'ميكروويف سامسونج', 'samsung-microwave', 'فرن ميكروويف 25 لتر', 4999.00, '["https://picsum.photos/seed/microwave/400/400"]', 40, 'cat-3', 0, 4.4),
  ('p-17', 'طقم قدور جرانيت', 'granite-pots-set', 'طقم قدور جرانيت 12 قطعة', 3599.00, '["https://picsum.photos/seed/pots/400/400"]', 60, 'cat-3', 1, 4.7),
  ('p-18', 'مكواة بخار فيليبس', 'philips-steam-iron', 'مكواة بخار قوية', 1899.00, '["https://picsum.photos/seed/iron/400/400"]', 70, 'cat-3', 0, 4.2),
  ('p-19', 'كريم ترطيب الوجه نيفيا', 'nivea-face-cream', 'كريم ترطيب عميق للوجه', 299.00, '["https://picsum.photos/seed/cream/400/400"]', 500, 'cat-4', 0, 4.5),
  ('p-20', 'عطر ديور سوفاج', 'dior-sauvage', 'عطر رجالي عالمي', 2999.00, '["https://picsum.photos/seed/perfume/400/400"]', 100, 'cat-4', 1, 4.8),
  ('p-21', 'مكياج مايبيلين فيت مي', 'maybelline-fit-me', 'فاونديشن سائل طبيعي', 399.00, '["https://picsum.photos/seed/foundation/400/400"]', 200, 'cat-4', 0, 4.3),
  ('p-22', 'شامبو هيد اند شولدرز', 'head-shoulders-shampoo', 'شامبو مضاد للقشرة', 249.00, '["https://picsum.photos/seed/shampoo/400/400"]', 400, 'cat-4', 0, 4.4),
  ('p-23', 'تيشيرت قطني رجالي', 'cotton-tshirt', 'تيشيرت قطن أبيض', 299.00, '["https://picsum.photos/seed/tshirt/400/400"]', 300, 'cat-5', 0, 4.2),
  ('p-24', 'حذاء رياضي نايك', 'nike-sneakers', 'حذاء رياضي كلاسيك أبيض', 4999.00, '["https://picsum.photos/seed/sneakers/400/400"]', 80, 'cat-5', 1, 4.6),
  ('p-25', 'جينز رجالي لي', 'levi-501-jeans', 'جينز كلاسيك بقصة مستقيمة', 2499.00, '["https://picsum.photos/seed/jeans/400/400"]', 60, 'cat-5', 0, 4.4),
  ('p-26', 'فستان نسائي طويل', 'maxi-dress', 'فستان زهور أنيق', 1199.00, '["https://picsum.photos/seed/dress/400/400"]', 40, 'cat-5', 0, 4.5),
  ('p-27', 'مكمل غذائي بروتين واي', 'whey-protein', 'بروتين مصل اللبن 2.27 كجم', 2299.00, '["https://picsum.photos/seed/protein/400/400"]', 100, 'cat-6', 1, 4.7),
  ('p-28', 'فيتامين دال 5000 وحدة', 'vitamin-d-5000', 'مكمل فيتامين دال', 499.00, '["https://picsum.photos/seed/vitamin-d/400/400"]', 400, 'cat-6', 0, 4.5),
  ('p-29', 'جهاز قياس الضغط', 'blood-pressure-monitor', 'جهاز رقمي لقياس الضغط', 1499.00, '["https://picsum.photos/seed/bp-monitor/400/400"]', 60, 'cat-6', 0, 4.3),
  ('p-30', 'زيت جوز الهند طبيعي', 'coconut-oil', 'زيت جوز الهند العضوي', 199.00, '["https://picsum.photos/seed/coconut/400/400"]', 500, 'cat-6', 0, 4.4),
  ('p-31', 'ألعاب تركيب ليغو', 'lego-building-set', 'لعبة تركيب أطفال 500 قطعة', 1499.00, '["https://picsum.photos/seed/lego/400/400"]', 100, 'cat-7', 1, 4.8),
  ('p-32', 'حفاضات بامبرز', 'pampers-diapers', 'حفاضات أطفال مقاس كبير', 599.00, '["https://picsum.photos/seed/diapers/400/400"]', 400, 'cat-7', 0, 4.6),
  ('p-33', 'عربة أطفال جو كابا', 'joie-stroller', 'عربية أطفال قابلة للطي', 5999.00, '["https://picsum.photos/seed/stroller/400/400"]', 20, 'cat-7', 0, 4.5),
  ('p-34', 'ملابس أطفال بيبي سويت', 'baby-sweater', 'سويت شيرت أطفال قطني', 399.00, '["https://picsum.photos/seed/baby-clothes/400/400"]', 200, 'cat-7', 0, 4.3),
  ('p-35', 'مشاية أطفال كهربائية', 'baby-walker', 'مشاية تعليمية تفاعلية', 1899.00, '["https://picsum.photos/seed/walker/400/400"]', 30, 'cat-7', 0, 4.1),
  ('p-36', 'ترمس أطفال ستانلس ستيل', 'kids-thermos', 'ترمس أطفال يحافظ على الحرارة', 349.00, '["https://picsum.photos/seed/thermos/400/400"]', 300, 'cat-7', 0, 4.4),
  ('p-37', 'ترابيزة بلياردو', 'pool-table', 'طاولة بلياردو منزلية', 12999.00, '["https://picsum.photos/seed/pool/400/400"]', 10, 'cat-8', 1, 4.7),
  ('p-38', 'دراجة تمرين رياضية', 'exercise-bike', 'دراجة تمرين منزلية', 15999.00, '["https://picsum.photos/seed/exercise-bike/400/400"]', 15, 'cat-8', 0, 4.5),
  ('p-39', 'مضرب تنس ويلسون', 'wilson-tennis-racket', 'مضرب تنس احترافي', 3999.00, '["https://picsum.photos/seed/tennis/400/400"]', 25, 'cat-8', 0, 4.4),
  ('p-40', 'ساعة رقمية رياضية', 'smart-sports-watch', 'ساعة ذكية مقاومة للماء', 3999.00, '["https://picsum.photos/seed/sport-watch/400/400"]', 50, 'cat-8', 0, 4.2)
ON CONFLICT (id) DO NOTHING;
