/**
 * Imports
 */
import accountRoute from "./src/routes/account/index.js";
import configNodeEnv from "./src/middleware/node-env.js";
import contactsRoute from "./src/routes/contacts/index.js";
import express from "express";
import fileUploads from "./src/middleware/file-uploads.js";
// import flashMessages from "./src/middleware/flash-messages.js";
import homeRoute from "./src/routes/index.js";
import layouts from "./src/middleware/layouts.js";
import path from "path";
// import { Pool } from "pg";
import reviewRoute from "./src/routes/review/index.js";
import { configureStaticPaths } from "./src/utils/index.js";
import { fileURLToPath } from "url";
import { setupDatabase } from "./src/db/index.js";
import { testDatabase } from "./src/models/index.js";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./src/middleware/error-handler.js";

/**
 * Global Variables
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mode = process.env.NODE_ENV;
// const pgStore = pgSession(session);
// const pool = new Pool({
//   connectionString: process.env.DB_URL, // Your PostgreSQL connection string
//   ssl:
//     process.env.NODE_ENV === "production"
//       ? { rejectUnauthorized: false }
//       : false,
// });
const port = process.env.PORT;

// app.use(
//   session({
//     store: new pgStore({
//       pool, // Use the PostgreSQL connection pool
//       tableName: "session", // You may need to create this table
//     }),
//     secret: process.env.SESSION_SECRET || "default-secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production", // Use secure cookies in production
//       httpOnly: true,
//       maxAge: 1000 * 60 * 60 * 24, // 1 day
//     },
//   })
// );

/**
 * Create and configure the Express server
 */
const app = express();

// Configure the application based on environment settings
app.use(configNodeEnv);

// Configure static paths (public dirs) for the Express application
configureStaticPaths(app);

// Middleware to handle flash messages
// app.use(flashMessages);

// Set EJS as the view engine and record the location of the views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Set Layouts middleware to automatically wrap views in a layout and configure default layout
app.set("layout default", "default");
app.set("layouts", path.join(__dirname, "src/views/layouts"));
app.use(layouts);

// Middleware to process multipart form data with file uploads
app.use(fileUploads);

// Middleware to parse JSON data in request body
app.use(express.json());

// Middleware to parse URL-encoded form data (like from a standard HTML form)
app.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */

app.use("/", homeRoute);
app.use("/account", accountRoute);
app.use("/review", reviewRoute);
app.use("/contacts", contactsRoute);

// Apply error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

/**
 * Start the server
 */

// When in development mode, start a WebSocket server for live reloading
if (mode.includes("dev")) {
  const ws = await import("ws");

  try {
    const wsPort = parseInt(port) + 1;
    const wsServer = new ws.WebSocketServer({ port: wsPort });

    wsServer.on("listening", () => {
      console.log(`WebSocket server is running on port ${wsPort}`);
    });

    wsServer.on("error", (error) => {
      console.error("WebSocket server error:", error);
    });
  } catch (error) {
    console.error("Failed to start WebSocket server:", error);
  }
}

// Start the Express server only after setting up the database
setupDatabase(true) // Pass 'true' to enable SQL logging
  .then(() => {
    app.listen(port, async () => {
      await testDatabase();
      console.log(`🚀 Server running on http://127.0.0.1:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database setup failed:", err);
    process.exit(1); // Stop server if the database setup fails
  });
