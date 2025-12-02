// Steam Store API
export async function fetchGameDetail(appid) {
  const res = await fetch(`/api/steamstore?appid=${appid}`);
  const data = await res.json();
  return data[appid]?.data || null;
}

// SteamSpy API
export async function fetchSpy(appid) {
  const res = await fetch(`/api/steamspy?request=appdetails&appid=${appid}`);
  const data = await res.json();
  return data || null;
}

// 특정 장르 top 게임 ID
export async function fetchTopGamesByGenre(genre, limit = 50) {
  if (genre === "all") return [570, 730, 440, 550, 578080]; // All 장르용 인기 게임 ID
  const res = await fetch(`/api/steamspy?request=genre&genre=${genre}`);
  const data = await res.json();
  if (!data || Object.keys(data).length === 0) return [];
  return Object.keys(data)
    .slice(0, limit)
    .map((id) => parseInt(id));
}
