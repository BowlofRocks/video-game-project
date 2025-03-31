import { Router } from "express";
import {
  getAllReviews,
  addReview,
  getGames,
  deleteReview,
} from "../../models/review/index.js";

const router = Router();

// View all reviews
router.get("/", async (req, res, next) => {
  try {
    const reviews = await getAllReviews();
    const title = "All Reviews";

    // If no reviews exist, throw a 404 error
    if (reviews.length === 0) {
      const errorTitle = "No Reviews Found";
      const error = new Error(errorTitle);
      error.title = errorTitle;
      error.status = 404;
      next(error);
      return;
    }

    res.render("review/index", {
      title,
      reviews,
    });
  } catch (error) {
    next(error); // Forward errors to the error handler
  }
});

// Add a new review
router.get("/add", async (req, res) => {
  try {
    const games = await getGames(); // Get all games to populate the select options
    res.render("review/add", { title: "Add Review", games }); // Pass games to the add-review template
  } catch (err) {
    console.error("Error fetching games:", err);
    res.status(500).send("Error fetching games.");
  }
});

// POST route to submit a new review
router.post("/", async (req, res) => {
  const { game_id, rating, content } = req.body;
  const userId = 1; // Replace with an actual user ID from your database
  console.log("Review Submission Data:", { game_id, rating, content });
  try {
    await addReview(game_id, userId, rating, content); // Add review
    res.redirect("/review"); // Redirect to reviews page after submission
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).send("Error adding review.");
  }
});

// POST route to delete a review
router.post("/delete/:id", async (req, res) => {
  const reviewId = req.params.id; // Get the review ID from the URL params
  try {
    await deleteReview(reviewId); // Call the deleteReview function to delete the review by ID
    console.log("Review deleted:", reviewId);
    res.redirect("/review"); // Redirect back to the reviews page after deletion
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).send("Error deleting review.");
  }
});

export default router;
