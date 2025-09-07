const express = require("express");
const ShortUrl = require("../models/ShortUrl");
const router = express.Router();

function generateShortcode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) code += chars[Math.floor(Math.random()*chars.length)];
  return code;
}

// Create short URL
router.post("/", async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;
  if (!url || typeof url !== "string") return res.status(400).json({ error: "Invalid URL" });
  let code = shortcode;
  if (code) {
    const exists = await ShortUrl.findOne({ shortcode: code });
    if (exists) return res.status(409).json({ error: "Shortcode already taken" });
    if (!/^[a-zA-Z0-9]{1,12}$/.test(code)) return res.status(400).json({ error: "Shortcode must be alphanumeric, max 12 chars" });
  } else {
    do { code = generateShortcode(); } while (await ShortUrl.findOne({ shortcode: code }));
  }
  const expiryDate = new Date(Date.now() + validity * 60 * 1000);
  const shortUrl = await ShortUrl.create({ url, shortcode: code, expiresAt: expiryDate });
  res.status(201).json({
    shortLink: `${req.protocol}://${req.hostname}:${req.app.get('port')}/${code}`,
    expiry: expiryDate.toISOString()
  });
});

// View statistics
router.get("/:shortcode", async (req, res) => {
  const url = await ShortUrl.findOne({ shortcode: req.params.shortcode });
  if (!url) return res.status(404).json({ error: "Not found" });
  res.json({
    originalUrl: url.url,
    createdAt: url.createdAt,
    expiresAt: url.expiresAt,
    totalClicks: url.clicks.length,
    clicks: url.clicks
  });
});

module.exports = router;
