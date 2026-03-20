const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("EcoCloset Backend API Running!");
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    service: "EcoCloset",
    status: "running",
    database: "Supabase"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
