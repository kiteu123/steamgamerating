export default async function handler(req, res) {
  const { appid } = req.query;
  if (!appid) return res.status(400).json({ error: "Missing appid" });

  try {
    const response = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appid}&l=en`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Steam Store proxy error" });
  }
}
