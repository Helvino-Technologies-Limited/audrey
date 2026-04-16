-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Site Settings (logo, video, general settings)
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Media Library
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  public_id VARCHAR(255),
  type VARCHAR(50) NOT NULL DEFAULT 'image', -- image, video
  category VARCHAR(100),
  alt_text VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Services (Accommodation, Restaurant, Pool, Golf, Conference, Bar, Events)
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  short_description TEXT,
  full_description TEXT,
  features TEXT[], -- array of feature bullet points
  price_from DECIMAL(10,2),
  price_info VARCHAR(255),
  image_url TEXT,
  gallery_images TEXT[],
  icon VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Menu Categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES menu_categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookings (for services like accommodation, pool, golf, conference)
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  reference VARCHAR(50) UNIQUE NOT NULL,
  service_id INTEGER REFERENCES services(id),
  service_name VARCHAR(255),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  booking_date DATE NOT NULL,
  booking_time TIME,
  end_date DATE,
  guests INTEGER DEFAULT 1,
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  total_amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Food Orders
CREATE TABLE IF NOT EXISTS food_orders (
  id SERIAL PRIMARY KEY,
  reference VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  arrival_date DATE NOT NULL,
  arrival_time TIME NOT NULL,
  guests INTEGER DEFAULT 1,
  items JSONB NOT NULL, -- [{id, name, price, quantity}]
  total_amount DECIMAL(10,2),
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, preparing, ready, completed, cancelled
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews / Ratings
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  body TEXT NOT NULL,
  service VARCHAR(100), -- which service they're reviewing
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Gallery Items
CREATE TABLE IF NOT EXISTS gallery_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  image_url TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE,
  event_time TIME,
  image_url TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern VARCHAR(100), -- weekly, monthly, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Page Content (editable text blocks)
CREATE TABLE IF NOT EXISTS page_content (
  id SERIAL PRIMARY KEY,
  page VARCHAR(100) NOT NULL,
  section VARCHAR(100) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value TEXT,
  type VARCHAR(50) DEFAULT 'text', -- text, html, image_url
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(page, section, key)
);

-- Insert default admin user (password: Audrey@2026)
INSERT INTO admin_users (email, password_hash, name)
VALUES ('audrey@admin.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBP.ZKBGv0nXve', 'Audrey Admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'The Audrey Golf Resort'),
  ('site_tagline', 'An exclusive golf resort restaurant in the Kenyan countryside'),
  ('contact_phone', '(+254) 780 306086'),
  ('contact_email', 'info@theaudreyresort.com'),
  ('contact_address', 'Segere, Osoro Road, PISOKO Centre, Siaya County, Kenya'),
  ('mpesa_till', '845 419'),
  ('operating_hours', 'Daily: 6:30 AM – 11 PM'),
  ('hero_video_url', NULL),
  ('logo_url', NULL),
  ('facebook_url', NULL),
  ('instagram_url', NULL),
  ('twitter_url', NULL)
ON CONFLICT (key) DO NOTHING;

-- Insert default services
INSERT INTO services (slug, title, short_description, full_description, features, price_from, price_info, icon, display_order) VALUES
  ('accommodation', 'Accommodation', 'Luxurious furnished rooms with scenic countryside views', 'Experience unparalleled comfort in our beautifully furnished rooms, each designed to offer you the ultimate relaxation experience surrounded by the stunning Kenyan countryside.', ARRAY['Fully furnished en-suite rooms', 'Scenic golf course and countryside views', 'Free Wi-Fi', 'Daily housekeeping', 'Room service available', 'Air conditioning'], 5000, 'From KES 5,000/night', 'bed', 1),
  ('restaurant', 'Fine Dining', 'Authentic flavours with timeless elegance using farm-fresh ingredients', 'Our award-winning restaurant serves a curated menu of authentic Kenyan and international dishes prepared with the freshest farm-to-table ingredients. Dine indoors, on the terrace, poolside, or in our private dining room.', ARRAY['Farm-fresh ingredients', 'Indoor & outdoor seating', 'Private dining room', 'Full bar service', 'Vegetarian options', 'Live music Fri & Sat'], 500, 'From KES 500/dish', 'utensils', 2),
  ('golf', 'Golf Course', 'Championship golf on our scenic greens in the Kenyan countryside', 'Play a round on our meticulously maintained golf course, set against the breathtaking Kenyan countryside landscape. Suitable for beginners and seasoned golfers alike.', ARRAY['18-hole championship course', 'Equipment rental available', 'Golf lessons for beginners', 'Scenic countryside views', 'Clubhouse facilities', 'Tournament hosting'], 2000, 'From KES 2,000/round', 'trophy', 3),
  ('swimming-pool', 'Swimming Pool', 'Olympic-size pool with lessons, aerobics and relaxation', 'Take a refreshing dip in our stunning pool overlooking the golf course. We offer swimming lessons for all ages and aqua aerobics classes.', ARRAY['Olympic-size pool', 'Swimming lessons available', 'Aqua aerobics classes', 'Poolside bar service', 'Towel service included', 'Children pool area'], 500, 'From KES 500/session', 'waves', 4),
  ('conference', 'Conference Hall', '200-delegate capacity with full AV support for corporate events', 'Our state-of-the-art conference hall accommodates up to 200 delegates and is equipped with the latest audio-visual technology for seamless corporate events.', ARRAY['Capacity for 200 delegates', 'Full AV equipment', 'High-speed Wi-Fi', 'Catering services', 'Breakout rooms', 'Team building packages'], 50000, 'From KES 50,000/day', 'presentation', 5),
  ('bar-entertainment', 'Bar & Entertainment', 'Live music, craft cocktails and a vibrant atmosphere', 'Unwind at our lively bar featuring live music performances every Friday and Saturday. Enjoy a wide selection of local and international beverages including our signature cocktails.', ARRAY['Live music Fri & Sat', 'Craft cocktails', 'Local & international beers', 'Fresh juices & mocktails', 'Open until midnight weekends', 'Sports screening'], 200, 'From KES 200/drink', 'music', 6),
  ('events', 'Events & Weddings', 'Unforgettable weddings, corporate functions and private celebrations', 'Create lasting memories at The Audrey Golf Resort. From intimate weddings to large corporate galas, our dedicated events team ensures every detail is perfectly executed.', ARRAY['Weddings & receptions', 'Corporate functions', 'Private celebrations', 'Birthday parties', 'Team building', 'Full catering service'], NULL, 'Contact us for pricing', 'star', 7)
ON CONFLICT (slug) DO NOTHING;

-- Insert default menu categories
INSERT INTO menu_categories (name, description, display_order) VALUES
  ('Starters', 'Begin your culinary journey', 1),
  ('Main Course', 'Our signature dishes', 2),
  ('Grills & BBQ', 'From our open grill', 3),
  ('Seafood', 'Fresh catches from Lake Victoria', 4),
  ('Sides & Extras', 'Perfect accompaniments', 5),
  ('Desserts', 'Sweet endings', 6),
  ('Beverages', 'Drinks & cocktails', 7)
ON CONFLICT DO NOTHING;

-- Insert default page content
INSERT INTO page_content (page, section, key, value, type) VALUES
  ('home', 'hero', 'title', 'Welcome to The Audrey Golf Resort', 'text'),
  ('home', 'hero', 'subtitle', 'An exclusive golf resort restaurant in the Kenyan countryside, serving authentic flavours with timeless elegance', 'text'),
  ('home', 'about', 'title', 'Experience Luxury in the Heart of Kenya', 'text'),
  ('home', 'about', 'body', 'Nestled in the serene Siaya County countryside, The Audrey Golf Resort offers an unparalleled escape from the ordinary. Our resort combines world-class hospitality with the natural beauty of Kenya, creating an experience that will leave you breathless.', 'text'),
  ('home', 'cta', 'title', 'Ready for an Unforgettable Experience?', 'text'),
  ('home', 'cta', 'subtitle', 'Book your stay or table today and let us create memories that will last a lifetime.', 'text'),
  ('about', 'main', 'title', 'Our Story', 'text'),
  ('about', 'main', 'body', 'The Audrey Golf Resort was born from a vision to create an exclusive sanctuary where luxury meets nature. Located in Segere, Siaya County, we pride ourselves on delivering exceptional experiences to every guest.', 'text'),
  ('contact', 'main', 'title', 'Get In Touch', 'text'),
  ('contact', 'main', 'subtitle', 'We would love to hear from you. Reach out to us for reservations, enquiries or just to say hello.', 'text')
ON CONFLICT (page, section, key) DO NOTHING;
