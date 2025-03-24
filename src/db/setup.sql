-- Drop tables if they already exist to avoid conflicts
DROP TABLE IF EXISTS comments, tasks, messages, reviews, games, users, categories;

-- 1️⃣ Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2️⃣ Games Table
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    genre VARCHAR(100),
    release_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3️⃣ Reviews Table (Each review is linked to a user & game)
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 0 AND rating <= 10),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4️⃣ Comments Table (Users comment on reviews)
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    review_id INT REFERENCES reviews(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5️⃣ Messages Table (Stores contact form submissions)
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6️⃣ Tasks Table (For admin workflow - e.g., review approvals)
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'completed')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7 Create Categories Table (if it doesn't already exist)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- 8    Insert Static Category: "Reviews"
INSERT INTO categories (name) VALUES ('Reviews')
ON CONFLICT (name) DO NOTHING;

