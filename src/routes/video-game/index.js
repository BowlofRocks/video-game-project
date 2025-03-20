import { Router } from "express";

const router = Router();

// The home page route
router.get("/", async (req, res) => {
  res.render("index", { title: "Video Game Page" });
});

export default router;
