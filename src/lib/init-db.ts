import sql from './db';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export async function initDatabase() {
  try {
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL DEFAULT 'Admin',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        public_id VARCHAR(255),
        type VARCHAR(50) NOT NULL DEFAULT 'image',
        category VARCHAR(100),
        alt_text VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        short_description TEXT,
        full_description TEXT,
        features TEXT[],
        price_from DECIMAL(10,2),
        price_info VARCHAR(255),
        image_url TEXT,
        gallery_images TEXT[],
        icon VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS menu_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true
      )
    `;

    await sql`
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
      )
    `;

    await sql`
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
        status VARCHAR(50) DEFAULT 'pending',
        total_amount DECIMAL(10,2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS food_orders (
        id SERIAL PRIMARY KEY,
        reference VARCHAR(50) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255),
        customer_phone VARCHAR(50),
        arrival_date DATE NOT NULL,
        arrival_time TIME NOT NULL,
        guests INTEGER DEFAULT 1,
        items JSONB NOT NULL,
        total_amount DECIMAL(10,2),
        special_requests TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(255),
        body TEXT NOT NULL,
        service VARCHAR(100),
        is_approved BOOLEAN DEFAULT false,
        is_featured BOOLEAN DEFAULT false,
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS gallery_items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        image_url TEXT NOT NULL,
        category VARCHAR(100),
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date DATE,
        event_time TIME,
        image_url TEXT,
        is_recurring BOOLEAN DEFAULT false,
        recurrence_pattern VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS page_content (
        id SERIAL PRIMARY KEY,
        page VARCHAR(100) NOT NULL,
        section VARCHAR(100) NOT NULL,
        key VARCHAR(100) NOT NULL,
        value TEXT,
        type VARCHAR(50) DEFAULT 'text',
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(page, section, key)
      )
    `;

    // Seed admin user
    const passwordHash = await bcrypt.hash('Audrey@2026', 12);
    await sql`
      INSERT INTO admin_users (email, password_hash, name)
      VALUES ('audrey@admin.com', ${passwordHash}, 'Audrey Admin')
      ON CONFLICT (email) DO NOTHING
    `;

    // Seed site settings
    const settings = [
      { key: 'site_name', value: 'The Audrey Golf Resort' },
      { key: 'site_tagline', value: 'An exclusive golf resort restaurant in the Kenyan countryside, serving authentic flavours with timeless elegance' },
      { key: 'contact_phone', value: '(+254) 780 306086 / 0708 306086' },
      { key: 'contact_email', value: 'info@theaudreyresort.com' },
      { key: 'contact_address', value: 'Segere, Osoro Road, PISOKO Centre, Siaya County, Kenya' },
      { key: 'mpesa_till', value: '845 419' },
      { key: 'operating_hours', value: 'Daily: 6:30 AM – 11 PM' },
      { key: 'hero_video_url', value: null },
      { key: 'logo_url', value: null },
      { key: 'facebook_url', value: null },
      { key: 'instagram_url', value: null },
      { key: 'twitter_url', value: null },
    ];

    for (const s of settings) {
      await sql`
        INSERT INTO site_settings (key, value)
        VALUES (${s.key}, ${s.value})
        ON CONFLICT (key) DO NOTHING
      `;
    }

    // Seed services
    const services = [
      {
        slug: 'accommodation',
        title: 'Accommodation',
        short_description: 'Luxurious furnished rooms with scenic countryside views',
        full_description: 'Experience unparalleled comfort in our beautifully furnished rooms, each designed to offer you the ultimate relaxation experience surrounded by the stunning Kenyan countryside.',
        features: ['Fully furnished en-suite rooms', 'Scenic golf course views', 'Free Wi-Fi', 'Daily housekeeping', 'Room service available', 'Air conditioning'],
        price_from: 5000,
        price_info: 'From KES 5,000/night',
        icon: 'bed',
        display_order: 1,
      },
      {
        slug: 'restaurant',
        title: 'Fine Dining',
        short_description: 'Authentic flavours with timeless elegance using farm-fresh ingredients',
        full_description: 'Our award-winning restaurant serves a curated menu of authentic Kenyan and international dishes prepared with the freshest farm-to-table ingredients.',
        features: ['Farm-fresh ingredients', 'Indoor & outdoor seating', 'Private dining room', 'Full bar service', 'Vegetarian options', 'Live music Fri & Sat'],
        price_from: 500,
        price_info: 'From KES 500/dish',
        icon: 'utensils',
        display_order: 2,
      },
      {
        slug: 'golf',
        title: 'Golf Course',
        short_description: 'Championship golf on our scenic greens',
        full_description: 'Play a round on our meticulously maintained golf course, set against the breathtaking Kenyan countryside landscape.',
        features: ['18-hole championship course', 'Equipment rental available', 'Golf lessons for beginners', 'Scenic countryside views', 'Clubhouse facilities', 'Tournament hosting'],
        price_from: 2000,
        price_info: 'From KES 2,000/round',
        icon: 'trophy',
        display_order: 3,
      },
      {
        slug: 'swimming-pool',
        title: 'Swimming Pool',
        short_description: 'Olympic-size pool with lessons, aerobics and relaxation',
        full_description: 'Take a refreshing dip in our stunning pool overlooking the golf course. We offer swimming lessons for all ages and aqua aerobics classes.',
        features: ['Olympic-size pool', 'Swimming lessons available', 'Aqua aerobics classes', 'Poolside bar service', 'Towel service included', 'Children pool area'],
        price_from: 500,
        price_info: 'From KES 500/session',
        icon: 'waves',
        display_order: 4,
      },
      {
        slug: 'conference',
        title: 'Conference Hall',
        short_description: '200-delegate capacity with full AV support',
        full_description: 'Our state-of-the-art conference hall accommodates up to 200 delegates and is equipped with the latest audio-visual technology.',
        features: ['Capacity for 200 delegates', 'Full AV equipment', 'High-speed Wi-Fi', 'Catering services', 'Breakout rooms', 'Team building packages'],
        price_from: 50000,
        price_info: 'From KES 50,000/day',
        icon: 'presentation',
        display_order: 5,
      },
      {
        slug: 'bar-entertainment',
        title: 'Bar & Entertainment',
        short_description: 'Live music, craft cocktails and a vibrant atmosphere',
        full_description: 'Unwind at our lively bar featuring live music performances every Friday and Saturday.',
        features: ['Live music Fri & Sat', 'Craft cocktails', 'Local & international beers', 'Fresh juices & mocktails', 'Open until midnight weekends', 'Sports screening'],
        price_from: 200,
        price_info: 'From KES 200/drink',
        icon: 'music',
        display_order: 6,
      },
      {
        slug: 'events',
        title: 'Events & Weddings',
        short_description: 'Unforgettable weddings, corporate functions and private celebrations',
        full_description: 'Create lasting memories at The Audrey Golf Resort. From intimate weddings to large corporate galas, our dedicated events team ensures every detail is perfectly executed.',
        features: ['Weddings & receptions', 'Corporate functions', 'Private celebrations', 'Birthday parties', 'Team building', 'Full catering service'],
        price_from: null,
        price_info: 'Contact us for pricing',
        icon: 'star',
        display_order: 7,
      },
    ];

    for (const s of services) {
      await sql`
        INSERT INTO services (slug, title, short_description, full_description, features, price_from, price_info, icon, display_order)
        VALUES (${s.slug}, ${s.title}, ${s.short_description}, ${s.full_description}, ${s.features}, ${s.price_from}, ${s.price_info}, ${s.icon}, ${s.display_order})
        ON CONFLICT (slug) DO NOTHING
      `;
    }

    // Seed page content
    const pageContents = [
      { page: 'home', section: 'hero', key: 'title', value: 'Welcome to The Audrey Golf Resort', type: 'text' },
      { page: 'home', section: 'hero', key: 'subtitle', value: 'An exclusive golf resort in the Kenyan countryside, serving authentic flavours with timeless elegance', type: 'text' },
      { page: 'home', section: 'about', key: 'title', value: 'Experience Luxury in the Heart of Kenya', type: 'text' },
      { page: 'home', section: 'about', key: 'body', value: 'Nestled in the serene Siaya County countryside, The Audrey Golf Resort offers an unparalleled escape from the ordinary. Our resort combines world-class hospitality with the natural beauty of Kenya, creating experiences that will leave you breathless.', type: 'text' },
      { page: 'home', section: 'cta', key: 'title', value: 'Ready for an Unforgettable Experience?', type: 'text' },
      { page: 'home', section: 'cta', key: 'subtitle', value: 'Book your stay or table today and let us create memories that will last a lifetime.', type: 'text' },
      { page: 'contact', section: 'main', key: 'title', value: 'Get In Touch', type: 'text' },
      { page: 'contact', section: 'main', key: 'subtitle', value: 'We would love to hear from you. Reach out to us for reservations, enquiries or just to say hello.', type: 'text' },
    ];

    for (const c of pageContents) {
      await sql`
        INSERT INTO page_content (page, section, key, value, type)
        VALUES (${c.page}, ${c.section}, ${c.key}, ${c.value}, ${c.type})
        ON CONFLICT (page, section, key) DO NOTHING
      `;
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
