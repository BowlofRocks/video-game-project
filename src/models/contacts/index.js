import { dbPromise } from "../../db/index.js"; // Import dbPromise to get the database connection
// Function to get all contact messages
const getAllMessages = async () => {
  const db = await dbPromise; // Wait for the connection to be established
  const query = `
      SELECT email, message, created_at
      FROM messages
      ORDER BY created_at DESC;
    `;
  const result = await db.query(query); // Execute the query
  return result.rows; // Return the rows from the result set
};

// Function to add a new message
const addMessage = async (email, message) => {
  const db = await dbPromise; // Wait for the connection to be established
  const query = `
      INSERT INTO messages (email, message)
      VALUES ($1, $2);
    `;
  await db.query(query, [email, message]);
  console.log("Message successfully inserted into DB"); // Execute the query with parameters
};

export { getAllMessages, addMessage };
