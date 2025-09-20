const express = require("express");
const router = express.Router();
const Marker = require("../models/Marker");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Helper to get address from lat/lng using Nominatim
async function getAddress(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "ShoreCleanApp/1.0" },
    });
    if (!response.ok) return "";
    const data = await response.json();
    return data.display_name || "";
  } catch {
    return "";
  }
}

router.post("/", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const address = await getAddress(latitude, longitude);
    const marker = new Marker({
      latitude,
      longitude,
      address,
      status: "pending",
    });
    await marker.save();
    res.status(201).json(marker);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update marker status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "ongoing", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    let marker = await Marker.findById(req.params.id);
    if (!marker) return res.status(404).json({ error: "Marker not found" });
    // If address missing, fetch it
    if (!marker.address) {
      marker.address = await getAddress(marker.latitude, marker.longitude);
    }
    marker.status = status;
    await marker.save();
    res.json(marker);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update marker remark
router.patch("/:id/remark", async (req, res) => {
  try {
    const { remark } = req.body;
    let marker = await Marker.findById(req.params.id);
    if (!marker) return res.status(404).json({ error: "Marker not found" });
    marker.remark = remark || "";
    await marker.save();
    res.json(marker);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "ongoing", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    let marker = await Marker.findById(req.params.id);
    if (!marker) return res.status(404).json({ error: "Marker not found" });
    // If address missing, fetch it
    if (!marker.address) {
      marker.address = await getAddress(marker.latitude, marker.longitude);
    }
    marker.status = status;
    await marker.save();
    res.json(marker);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Complete task with image upload
router.post("/:id/complete", async (req, res) => {
  try {
    let marker = await Marker.findById(req.params.id);
    if (!marker) return res.status(404).json({ error: "Marker not found" });

    // Update status to completed
    marker.status = "completed";

    // If there's an image file, you can handle it here
    // For now, just mark as completed
    marker.imageUrl = "uploaded"; // Placeholder for image

    await marker.save();
    res.json(marker);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Fetch all markers
router.get("/", async (req, res) => {
  try {
    const markers = await Marker.find();
    res.json(markers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete marker by ID
router.delete("/:id", async (req, res) => {
  try {
    const result = await Marker.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Marker not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
