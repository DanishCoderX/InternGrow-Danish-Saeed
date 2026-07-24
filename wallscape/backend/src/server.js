require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first"); // Fixes Node hanging/timing out on outbound HTTPS on some Windows networks where IPv6 is broken but IPv4 works fine.
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "quote-wallpaper-backend" });
});

app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Quote & Wallpaper backend running on port ${PORT}`);
});