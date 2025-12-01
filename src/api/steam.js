// Steam Store API (이미지/설명)
export async function fetchGameDetail(appid) {
  const res = await fetch(
    `http://localhost:3001/api/steamstore?appid=${appid}`
  );
  const data = await res.json();
  return data[appid].data;
}

// SteamSpy proxy (CORS 문제 해결)
export async function fetchSpy(appid) {
  const res = await fetch(
    `http://localhost:3001/api/steamspy?request=appdetails&appid=${appid}`
  );
  const data = await res.json();
  return data;
}

// 특정 장르 Top 게임 ID 가져오기
export async function fetchTopGamesByGenre(genre, limit = 50) {
  const res = await fetch(`/api/steamspy?request=genre&genre=${genre}`);
  const data = await res.json();

  // appid만 배열로 추출 후 limit까지 자르기
  const appids = Object.keys(data)
    .slice(0, limit)
    .map((id) => parseInt(id));
  return appids;
}
