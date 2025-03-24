import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import fs from "fs";

dotenv.config(); // Load environment variables

// Create a single instance of the database connection
const pool = new Pool({
  connectionString: process.env.DB_URL,
});

// Logging SQL queries in development mode
const enableDevModeLogging = () => {
  pool.on("connect", () => console.log("✅ Connected to PostgreSQL"));
  pool.on("error", (err) => console.error("❌ Database error:", err));

  const originalQuery = pool.query.bind(pool);
  pool.query = async (...args) => {
    console.log("🔍 Executing SQL:", args);
    return originalQuery(...args);
  };
};

// Function to set up the database schema
export const setupDatabase = async (enableLogging = false) => {
  if (enableLogging) enableDevModeLogging();

  const sql = fs.readFileSync("./src/db/setup.sql", "utf-8");
  try {
    await pool.query(sql);
    console.log("✅ Database schema applied");
  } catch (err) {
    console.error("❌ Error applying schema:", err);
  }
};

// Exporting dbPromise, which resolves once the connection is successfully established
export const dbPromise = new Promise((resolve, reject) => {
  pool
    .connect()
    .then((client) => {
      client.release(); // Release client immediately after successful connection
      console.log("✅ Promise connection established");
      resolve(pool); // Resolve the promise with the pool object
    })
    .catch((err) => {
      console.error("❌ Promise connection failed:", err);
      reject(err); // Reject the promise if the connection fails
    });
});

export default pool;
