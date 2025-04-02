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
    image_path TEXT NOT NULL,
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

-- Insert initial video games
INSERT INTO games (id, title, genre, release_date, image_path) VALUES
(1, 'Baldurs Gate 3', 'Action-Adventure', '2023-09-03', '/images/games/baldurs_gate_final.jpg'),
(2, 'Star Wars: Knights of the Old Republic', 'RPG', '2003-07-15', '/images/games/KotOR_Cover.webp'),
(3, 'Skyrim', 'RPG', '2011-11-11', '/images/games/The_Elder_Scrolls_V_Skyrim_cover.png');

-- Insert sample users (since reviews need valid user_id references)
INSERT INTO users (username, email, password, role) VALUES
('gamer123', 'gamer123@example.com', 'hashedpassword1', 'user'),
('rpgfan', 'rpgfan@example.com', 'hashedpassword2', 'user'),
('zeldaMaster', 'zelda@example.com', 'hashedpassword3', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample reviews (referencing valid users & games)
INSERT INTO reviews (user_id, game_id, rating, content) VALUES
-- User "gamer123" reviewing "Baldur's Gate 3"
(1, 1, 10, 'An absolutely amazing RPG with deep storytelling and engaging gameplay!'),

-- User "rpgfan" reviewing "Star Wars: KOTOR"
(2, 2, 9, 'One of the best Star Wars games ever made. The story twists are legendary!'),

-- User "zeldaMaster" reviewing "Skyrim"
(3, 3, 8, 'A massive open-world experience with endless possibilities. Dragons everywhere!');


-- Inset session data
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL PRIMARY KEY,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL
);

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
