import { Router } from "express";
import { getAllReviews } from "../../models/review/index.js";

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
export default router;
