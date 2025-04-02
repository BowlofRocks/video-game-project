import { Router } from "express";
import { getAllMessages, addMessage } from "../../models/contacts/index.js";
const router = Router();

router.get("/", async (req, res) => {
  res.render("contacts/index", { title: "Contacts Page" });
});

// Handle form submission
router.post("/submit-contact", async (req, res) => {
  const { email, message } = req.body;
  console.log("Contact Form Data:", { email, message });

  try {
    await addMessage(email, message);
    res.status(200).json({ success: "Message submitted successfully!" });
  } catch (err) {
    console.error("Database error:", err);
    res
      .status(500)
      .json({ error: "An error occurred while saving your message" });
  }
});

// Retrieve all messages
router.get("/messages", async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.json(messages);
  } catch (err) {
    console.error("Database error:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages" });
  }
});

export default router;
