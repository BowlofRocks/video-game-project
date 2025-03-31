import { dbPromise } from "../../db/index.js"; // Import dbPromise to get the database connection

// Function to get all reviews (including game images)
const getAllReviews = async () => {
  const db = await dbPromise; // Wait for the connection to be established
  const query = `
        SELECT reviews.id, users.username AS reviewer, games.title AS game_title, 
               games.image_path, reviews.rating, reviews.content, reviews.created_at
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        JOIN games ON reviews.game_id = games.id
        ORDER BY reviews.created_at DESC;
    `;
  const result = await db.query(query); // Execute the query
  return result.rows; // Return the rows from the result set
};

// Function to get reviews by game (including game images)
const getReviewsByGame = async (gameId) => {
  const db = await dbPromise; // Wait for the connection to be established
  const query = `
        SELECT reviews.id, users.username AS reviewer, games.title AS game_title, 
               games.image_path, reviews.rating, reviews.content, reviews.created_at
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        JOIN games ON reviews.game_id = games.id
        WHERE reviews.game_id = $1
        ORDER BY reviews.created_at DESC;
    `;
  const result = await db.query(query, [gameId]); // Execute the query with a parameter
  return result.rows; // Return the rows from the result set
};

// Function to add a review to the database
const addReview = async (gameId, userId, rating, content) => {
  const db = await dbPromise;
  const query = `
    INSERT INTO reviews (game_id, user_id, rating, content)
    VALUES ($1, $2, $3, $4)
  `;
  await db.query(query, [gameId, userId, rating, content]); // Execute the query with parameters
};

const getGames = async () => {
  const db = await dbPromise;
  const query = `
    SELECT id, title, genre, release_date, image_path, created_at
    FROM games
    ORDER BY title ASC;
  `;
  const result = await db.query(query);
  return result.rows;
};

// Function to delete a review
const deleteReview = async (reviewId) => {
  const db = await dbPromise; // Wait for the connection to be established
  const query = `
    DELETE FROM reviews
    WHERE id = $1;
  `;
  await db.query(query, [reviewId]); // Execute the query to delete the review
};

export { getAllReviews, getReviewsByGame, addReview, getGames, deleteReview };
