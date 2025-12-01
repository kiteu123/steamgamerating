import fetch from "node-fetch";

export default async function handler(req, res) {
  const qs = new URLSearchParams(req.query).toString();
  const url = `https://steamspy.com/api.php?${qs}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "SteamSpy proxy error" });
  }
}
