const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  geo: String,
});

const shortUrlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  shortcode: { type: String, unique: true },
  expiresAt: { type: Date, required: true },
  clicks: [clickSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
