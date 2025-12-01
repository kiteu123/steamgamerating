// Steam Store API (이미지/설명)
export async function fetchGameDetail(appid) {
  const res = await fetch(`/api/steamstore?appid=${appid}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data[appid]?.data || null;
}

// SteamSpy proxy (CORS 문제 해결)
export async function fetchSpy(appid) {
  const res = await fetch(`/api/steamspy?request=appdetails&appid=${appid}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}
