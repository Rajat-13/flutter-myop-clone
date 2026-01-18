-- =====================================================
-- RIMAE Database Schema - PostgreSQL
-- Complete SQL for Admin Panel & Frontend
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS & AUTHENTICATION
-- =====================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(150) UNIQUE,
    full_name VARCHAR(255),
    avatar VARCHAR(500),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
    password VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE otps (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_otps_phone ON otps(phone);

-- =====================================================
-- 2. CATEGORIES & PRODUCTS (Accessories/Bottles)
-- =====================================================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(500),
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    sku VARCHAR(50) UNIQUE NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    weight DECIMAL(8, 2),
    dimensions VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    image VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_cover BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active ON products(is_active);

-- =====================================================
-- 3. INGREDIENTS (For Custom Perfumes)
-- =====================================================

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    category VARCHAR(50) CHECK (category IN ('floral', 'woody', 'oriental', 'fresh', 'citrus', 'spicy', 'musk', 'amber', 'aquatic', 'green', 'fruity', 'gourmand')),
    description TEXT,
    origin VARCHAR(100),
    image VARCHAR(500),
    cost_per_ml DECIMAL(10, 4) NOT NULL,
    stock_ml DECIMAL(10, 2) DEFAULT 0,
    low_stock_threshold DECIMAL(10, 2) DEFAULT 100,
    unit VARCHAR(20) DEFAULT 'ml',
    is_active BOOLEAN DEFAULT TRUE,
    is_premium BOOLEAN DEFAULT FALSE,
    intensity INTEGER DEFAULT 5 CHECK (intensity BETWEEN 1 AND 10),
    longevity_hours INTEGER DEFAULT 4,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_ingredients_active ON ingredients(is_active);

-- =====================================================
-- 4. FRAGRANCES (Perfumes & Attars)
-- =====================================================

CREATE TABLE fragrances (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    sku VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) DEFAULT 'perfume' CHECK (type IN ('perfume', 'attar')),
    concentration VARCHAR(30) CHECK (concentration IN ('parfum', 'eau_de_parfum', 'eau_de_toilette', 'eau_de_cologne', 'pure_attar')),
    gender VARCHAR(20) DEFAULT 'unisex' CHECK (gender IN ('men', 'women', 'unisex')),
    description TEXT,
    short_description VARCHAR(500),
    story TEXT,
    size_ml INTEGER,
    price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    longevity_hours INTEGER DEFAULT 6,
    sillage VARCHAR(20) CHECK (sillage IN ('intimate', 'moderate', 'strong', 'enormous')),
    season VARCHAR(100),
    occasion VARCHAR(200),
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fragrance_images (
    id SERIAL PRIMARY KEY,
    fragrance_id INTEGER REFERENCES fragrances(id) ON DELETE CASCADE,
    image VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_cover BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fragrance_notes (
    id SERIAL PRIMARY KEY,
    fragrance_id INTEGER REFERENCES fragrances(id) ON DELETE CASCADE,
    ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
    note_type VARCHAR(10) NOT NULL CHECK (note_type IN ('top', 'middle', 'base')),
    percentage DECIMAL(5, 2),
    intensity INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(fragrance_id, ingredient_id, note_type)
);

CREATE TABLE fragrance_sizes (
    id SERIAL PRIMARY KEY,
    fragrance_id INTEGER REFERENCES fragrances(id) ON DELETE CASCADE,
    size_ml INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2),
    stock INTEGER DEFAULT 0,
    sku_suffix VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fragrances_type ON fragrances(type);
CREATE INDEX idx_fragrances_gender ON fragrances(gender);
CREATE INDEX idx_fragrances_active ON fragrances(is_active);
CREATE INDEX idx_fragrances_bestseller ON fragrances(is_bestseller);
CREATE INDEX idx_fragrance_notes_type ON fragrance_notes(note_type);

-- =====================================================
-- 5. ADDRESSES
-- =====================================================

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(100),
    type VARCHAR(20) DEFAULT 'home' CHECK (type IN ('home', 'office', 'other')),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    landmark VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_default ON addresses(is_default);

-- =====================================================
-- 6. CART
-- =====================================================

CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    coupon_code VARCHAR(50),
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
    fragrance_id INTEGER REFERENCES fragrances(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    size_ml INTEGER,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (fragrance_id IS NOT NULL OR product_id IS NOT NULL)
);

CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

-- =====================================================
-- 7. WISHLIST
-- =====================================================

CREATE TABLE wishlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    fragrance_id INTEGER REFERENCES fragrances(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (fragrance_id IS NOT NULL OR product_id IS NOT NULL),
    UNIQUE(user_id, fragrance_id),
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlists_user ON wishlists(user_id);

-- =====================================================
-- 8. ORDERS
-- =====================================================

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    -- Shipping Details (snapshot at order time)
    shipping_name VARCHAR(255) NOT NULL,
    shipping_phone VARCHAR(15) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_pincode VARCHAR(10) NOT NULL,
    shipping_country VARCHAR(100) DEFAULT 'India',
    
    -- Pricing
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    coupon_code VARCHAR(50),
    shipping_amount DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
    payment_method VARCHAR(50),
    
    -- Tracking
    tracking_number VARCHAR(100),
    tracking_url VARCHAR(500),
    carrier VARCHAR(100),
    
    -- Notes
    notes TEXT,
    admin_notes TEXT,
    cancellation_reason TEXT,
    
    -- Timestamps
    confirmed_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    fragrance_id INTEGER REFERENCES fragrances(id) ON DELETE SET NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    
    -- Product Snapshot
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(50) NOT NULL,
    product_image VARCHAR(500),
    product_type VARCHAR(20) DEFAULT 'fragrance',
    size_ml INTEGER,
    
    -- Pricing
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- =====================================================
-- 9. PAYMENTS
-- =====================================================

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    transaction_id VARCHAR(100) UNIQUE,
    gateway_order_id VARCHAR(100),
    
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    method VARCHAR(50) NOT NULL,
    gateway VARCHAR(50),
    
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
    
    gateway_response JSONB,
    error_message TEXT,
    
    refund_id VARCHAR(100),
    refund_amount DECIMAL(10, 2),
    refunded_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);
CREATE INDEX idx_payments_status ON payments(status);

-- =====================================================
-- 10. REVIEWS
-- =====================================================

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    fragrance_id INTEGER REFERENCES fragrances(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(200),
    comment TEXT NOT NULL,
    
    pros TEXT,
    cons TEXT,
    
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    
    admin_reply TEXT,
    admin_replied_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CHECK (fragrance_id IS NOT NULL OR product_id IS NOT NULL),
    UNIQUE(user_id, fragrance_id),
    UNIQUE(user_id, product_id)
);

CREATE TABLE review_images (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    image VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_fragrance ON reviews(fragrance_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- =====================================================
-- 11. CUSTOM ORDERS (Perfume Builder)
-- =====================================================

CREATE TABLE custom_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    name VARCHAR(255),
    bottle_product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    size_ml INTEGER NOT NULL,
    
    concentration VARCHAR(30) CHECK (concentration IN ('parfum', 'eau_de_parfum', 'eau_de_toilette')),
    
    -- Custom message for engraving
    custom_message VARCHAR(100),
    gift_wrap BOOLEAN DEFAULT FALSE,
    gift_message TEXT,
    
    -- Pricing
    base_price DECIMAL(10, 2) NOT NULL,
    ingredients_cost DECIMAL(10, 2) NOT NULL,
    bottle_cost DECIMAL(10, 2) DEFAULT 0,
    customization_cost DECIMAL(10, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'in_production', 'completed', 'cancelled')),
    
    admin_notes TEXT,
    
    linked_order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE custom_order_notes (
    id SERIAL PRIMARY KEY,
    custom_order_id INTEGER REFERENCES custom_orders(id) ON DELETE CASCADE,
    ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
    note_type VARCHAR(10) NOT NULL CHECK (note_type IN ('top', 'middle', 'base')),
    percentage DECIMAL(5, 2) NOT NULL,
    quantity_ml DECIMAL(8, 4),
    cost DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_custom_orders_user ON custom_orders(user_id);
CREATE INDEX idx_custom_orders_status ON custom_orders(status);

-- =====================================================
-- 12. NOTIFICATIONS
-- =====================================================

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    type VARCHAR(30) DEFAULT 'system' CHECK (type IN ('order', 'promo', 'system', 'feedback', 'stock_alert', 'review')),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    action_url VARCHAR(500),
    image VARCHAR(500),
    
    is_read BOOLEAN DEFAULT FALSE,
    is_broadcast BOOLEAN DEFAULT FALSE,
    
    metadata JSONB DEFAULT '{}',
    
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- =====================================================
-- 13. ANALYTICS
-- =====================================================

CREATE TABLE analytics_daily (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    
    -- Orders
    total_orders INTEGER DEFAULT 0,
    completed_orders INTEGER DEFAULT 0,
    cancelled_orders INTEGER DEFAULT 0,
    
    -- Revenue
    gross_revenue DECIMAL(12, 2) DEFAULT 0,
    net_revenue DECIMAL(12, 2) DEFAULT 0,
    refunded_amount DECIMAL(12, 2) DEFAULT 0,
    
    -- Users
    new_users INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    
    -- Products
    custom_perfumes INTEGER DEFAULT 0,
    
    -- Traffic
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    
    -- Conversion
    cart_additions INTEGER DEFAULT 0,
    checkouts_started INTEGER DEFAULT 0,
    checkouts_completed INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5, 2) DEFAULT 0,
    
    -- Average
    avg_order_value DECIMAL(10, 2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics_products (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    fragrance_id INTEGER REFERENCES fragrances(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    
    views INTEGER DEFAULT 0,
    cart_adds INTEGER DEFAULT 0,
    purchases INTEGER DEFAULT 0,
    revenue DECIMAL(10, 2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CHECK (fragrance_id IS NOT NULL OR product_id IS NOT NULL)
);

CREATE INDEX idx_analytics_daily_date ON analytics_daily(date);
CREATE INDEX idx_analytics_products_date ON analytics_products(date);

-- =====================================================
-- 14. HOMEPAGE CONTENT MANAGEMENT
-- =====================================================

CREATE TABLE hero_slides (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    description TEXT,
    image VARCHAR(500) NOT NULL,
    mobile_image VARCHAR(500),
    button_text VARCHAR(100),
    button_url VARCHAR(500),
    background_color VARCHAR(20),
    text_color VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    starts_at TIMESTAMP,
    ends_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shoppable_videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    thumbnail VARCHAR(500),
    fragrance_id INTEGER REFERENCES fragrances(id) ON DELETE SET NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(50) NOT NULL,
    image VARCHAR(500) NOT NULL,
    mobile_image VARCHAR(500),
    link_url VARCHAR(500),
    alt_text VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    starts_at TIMESTAMP,
    ends_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 15. BRAND SETTINGS
-- =====================================================

CREATE TABLE brand_settings (
    id SERIAL PRIMARY KEY,
    
    -- Brand Info
    brand_name VARCHAR(100) DEFAULT 'RIMAE',
    tagline VARCHAR(255),
    logo VARCHAR(500),
    favicon VARCHAR(500),
    
    -- Contact
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    whatsapp_number VARCHAR(20),
    address TEXT,
    
    -- Social Links
    social_instagram VARCHAR(255),
    social_facebook VARCHAR(255),
    social_twitter VARCHAR(255),
    social_youtube VARCHAR(255),
    social_pinterest VARCHAR(255),
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    
    -- Business
    currency VARCHAR(3) DEFAULT 'INR',
    currency_symbol VARCHAR(5) DEFAULT '₹',
    tax_rate DECIMAL(5, 2) DEFAULT 18.00,
    free_shipping_threshold DECIMAL(10, 2) DEFAULT 999.00,
    default_shipping_cost DECIMAL(10, 2) DEFAULT 49.00,
    
    -- Feature Flags
    is_maintenance_mode BOOLEAN DEFAULT FALSE,
    maintenance_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 16. COUPONS
-- =====================================================

CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2),
    
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    per_user_limit INTEGER DEFAULT 1,
    
    applicable_to VARCHAR(20) DEFAULT 'all' CHECK (applicable_to IN ('all', 'fragrances', 'products', 'custom')),
    
    is_active BOOLEAN DEFAULT TRUE,
    starts_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);

-- =====================================================
-- 17. RECENTLY VIEWED
-- =====================================================

CREATE TABLE recently_viewed (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    fragrance_id INTEGER REFERENCES fragrances(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CHECK (fragrance_id IS NOT NULL OR product_id IS NOT NULL)
);

CREATE INDEX idx_recently_viewed_user ON recently_viewed(user_id);
CREATE INDEX idx_recently_viewed_session ON recently_viewed(session_id);

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Default Brand Settings
INSERT INTO brand_settings (brand_name, tagline, contact_email, contact_phone)
VALUES ('RIMAE', 'Craft Your Signature Scent', 'hello@rimae.com', '+91 98765 43210');

-- Default Categories
INSERT INTO categories (name, slug, description) VALUES
('Bottles', 'bottles', 'Premium perfume bottles'),
('Gift Sets', 'gift-sets', 'Curated gift collections'),
('Accessories', 'accessories', 'Fragrance accessories'),
('Samples', 'samples', 'Discovery sets and samples');

-- Default Ingredients
INSERT INTO ingredients (name, category, description, cost_per_ml, stock_ml, intensity) VALUES
('Sandalwood', 'woody', 'Creamy, warm, and rich woody scent from India', 15.00, 5000, 7),
('Rose', 'floral', 'Classic romantic floral with honey undertones', 25.00, 3000, 6),
('Oud', 'oriental', 'Deep, complex, smoky wood resin', 50.00, 2000, 9),
('Musk', 'musk', 'Clean, sensual, skin-like warmth', 12.00, 8000, 5),
('Vanilla', 'gourmand', 'Sweet, warm, comforting base note', 8.00, 6000, 6),
('Bergamot', 'citrus', 'Fresh, zesty, slightly floral citrus', 10.00, 4000, 4),
('Jasmine', 'floral', 'Intoxicating white floral with green facets', 30.00, 2500, 8),
('Amber', 'amber', 'Warm, resinous, slightly sweet', 14.00, 4500, 7),
('Lavender', 'fresh', 'Aromatic, herbal, calming purple flower', 6.00, 7000, 5),
('Cedar', 'woody', 'Dry, pencil-like woody note', 8.00, 5500, 6);

COMMIT;
