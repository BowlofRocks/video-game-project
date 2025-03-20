import { Router } from "express";

const router = Router();

// The home page route
router.get("/", async (req, res) => {
  res.render("index", { title: "Account Page" });
});

export default router;
