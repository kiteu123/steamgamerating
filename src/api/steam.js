// Steam Store API (이미지/설명)
export async function fetchGameDetail(appid) {
  const res = await fetch(`/api/steamstore?appid=${appid}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data[appid]?.data || null;
}

// SteamSpy Top100 또는 장르별 AppID 가져오기
export async function fetchTopGamesByGenre(genre) {
  const res = await fetch(`/api/steamspy?request=genre&genre=${genre}`);
  if (!res.ok) return [];
  const data = await res.json();
  // SteamSpy API는 { appid: {...} } 구조 반환
  return Object.keys(data).map((appid) => parseInt(appid));
}
