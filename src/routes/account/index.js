import { Router } from "express";

const router = Router();

// The home page route
router.get("/", async (req, res) => {
  res.render("account/index", { title: "Account Page" });
});

// The login page route
router.get("/login", async (req, res) => {
  res.render("account/login", { title: "Account Page" });
});

// The register page route
router.get("/register", async (req, res) => {
  res.render("account/register", { title: "Account Page" });
});

export default router;
