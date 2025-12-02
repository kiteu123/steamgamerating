// SteamSpy API 프록시
export default async function handler(req, res) {
  const { request, genre, appid } = req.query;

  // 장르별 top 게임
  if (request === "genre" && genre) {
    try {
      const url = `https://steamspy.com/api.php?request=genre&genre=${genre}`;
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      const data = await response.json();
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "SteamSpy genre proxy error" });
    }
    return;
  }

  // 개별 게임 정보
  if (request === "appdetails" && appid) {
    try {
      const url = `https://steamspy.com/api.php?request=appdetails&appid=${appid}`;
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      const data = await response.json();
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "SteamSpy app proxy error" });
    }
    return;
  }

  res.status(400).json({ error: "Invalid request" });
}
