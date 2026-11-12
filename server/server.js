const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/feedback";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Feedback Schema & Model
const feedbackSchema = new mongoose.Schema(
  {
    q1: { type: String, required: true, trim: true }, // Name
    q2: { type: String, required: true, trim: true }, // Department
    q3: { type: String, required: true, trim: true }, // Session Title
    q4: { type: String, required: true, trim: true }, // Feedback
    q5: { type: String, default: "", trim: true },    // Suggestions
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

// Default route
app.get("/", (req, res) => {
  res.send("Feedback Server Running ✅");
});

// GET route to view submitted feedback
app.get("/api/feedback", async (req, res) => {
  try {
    const entries = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Failed to fetch feedback." });
  }
});

// POST route to handle feedback
app.post("/api/feedback", async (req, res) => {
  try {
    const { q1, q2, q3, q4, q5 } = req.body;
    const savedFeedback = await Feedback.create({ q1, q2, q3, q4, q5 });
    console.log("Saved Feedback:", savedFeedback);
    res.status(201).json({
      message: "Feedback received and saved successfully!",
      data: savedFeedback,
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ message: "Failed to save feedback." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
