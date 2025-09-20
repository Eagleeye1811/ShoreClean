const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
    label: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Point", pointSchema);
