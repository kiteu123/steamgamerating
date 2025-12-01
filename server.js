import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/steamstore", async (req, res) => {
  const appid = req.query.appid;
  const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&l=en`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0", // Cloudflare/Steam Store 우회
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Steam Store proxy error" });
  }
});

// SteamSpy proxy
app.get("/api/steamspy", async (req, res) => {
  const base = "https://steamspy.com/api.php";
  const qs = new URLSearchParams(req.query).toString();
  const url = `${base}?${qs}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0", // Cloudflare 우회
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy error" });
  }
});

app.listen(3001, () =>
  console.log("Backend proxy running on http://localhost:3001")
);
