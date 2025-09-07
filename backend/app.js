const express = require("express");
const mongoose = require("mongoose");
const logger = require("./logger");
const shortUrlRoutes = require("./routes/shorturls");
const ShortUrl = require("./models/ShortUrl");
const geoip = require("geoip-lite");
const cors = require("cors");   // ✅ add this

const app = express();
const PORT = 5000;
app.set("port", PORT);

// ✅ Allow frontend (localhost:3000) to call backend (localhost:5000)
app.use(cors({
  origin: "http://localhost:3000", // your React app
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());
app.use(logger);

mongoose.connect("mongodb://localhost:27017/urlshortener", { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

app.use("/shorturls", shortUrlRoutes);

// Redirection endpoint
app.get("/:shortcode", async (req, res) => {
  const entry = await ShortUrl.findOne({ shortcode: req.params.shortcode });
  if (!entry) return res.status(404).json({ error: "Shortcode not found" });
  if (Date.now() > entry.expiresAt.getTime()) return res.status(410).json({ error: "Expired" });

  entry.clicks.push({
    timestamp: new Date(),
    referrer: req.get("referer") || "",
    geo: geoip.lookup(req.ip)?.country || "Unknown"
  });
  await entry.save();
  res.redirect(entry.url);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
