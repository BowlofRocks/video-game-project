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

export { getAllReviews, getReviewsByGame };
