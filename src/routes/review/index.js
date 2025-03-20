import { Router } from "express";

const router = Router();

// The home page route
router.get("/", async (req, res) => {
  res.render("index", { title: "Review Page" });
});

export default router;
