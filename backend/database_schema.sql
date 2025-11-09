-- Create the database
CREATE DATABASE umass_dining;

-- Connect to the database (this command is for psql, not needed in application)
-- \c umass_dining;

-- 1. menu_options table
CREATE TABLE menu_options (
    id SERIAL PRIMARY KEY,
    hall_id VARCHAR(50) NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    nutrition JSONB,
    allergens TEXT[],
    tags TEXT[],
    available_today BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. user_order_choices table
CREATE TABLE user_order_choices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    menu_option_id INTEGER NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_option_id) REFERENCES menu_options(id)
);

-- 4. dashers table
CREATE TABLE dashers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. dasher_customers table
CREATE TABLE dasher_customers (
    id SERIAL PRIMARY KEY,
    dasher_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    user_name VARCHAR(255),
    order_details JSONB,
    accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dasher_id) REFERENCES dashers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    dasher_id INTEGER,
    location VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    order_items JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    acceptance_token VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    delivered_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (dasher_id) REFERENCES dashers(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_menu_options_hall_id ON menu_options(hall_id);
CREATE INDEX idx_menu_options_meal_type ON menu_options(meal_type);
CREATE INDEX idx_menu_options_available_today ON menu_options(available_today);
CREATE INDEX idx_user_order_choices_user_id ON user_order_choices(user_id);
CREATE INDEX idx_user_order_choices_menu_option_id ON user_order_choices(menu_option_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_dasher_id ON orders(dasher_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_acceptance_token ON orders(acceptance_token);
CREATE INDEX idx_dasher_customers_dasher_id ON dasher_customers(dasher_id);
CREATE INDEX idx_dasher_customers_user_id ON dasher_customers(user_id);

