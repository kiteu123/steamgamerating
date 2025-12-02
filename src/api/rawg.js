const API_KEY = "116d4dbb0177491cb07efccecbce3a7b"; // .env.local에 저장

async function fetchRawgApi(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }
    const data = await res.json();

    // 무한 스크롤 제어를 위해 hasNext를 반환한다고 가정
    const hasNext = !!data.next;

    const results = data.results.map((game) => ({
      id: game.id,
      name: game.name,
      image: game.background_image,
      rating: game.rating,
    }));

    return { results, hasNext };
  } catch (err) {
    console.error("RAWG API error:", err);
    return { results: [], hasNext: false };
  }
}

export async function fetchGamesByGenre(genre = "", page = 1, pageSize = 20) {
  // 1. 기본 URL 설정: 장르 필터 없이 시작합니다.
  let url = `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=${pageSize}`;

  // 2. 장르(genre)가 빈 문자열이 아닐 때만 &genres= 파라미터를 추가합니다.
  if (genre) {
    url += `&genres=${genre}`;
  }

  return fetchRawgApi(url);
}

export async function searchGames(query = "", page = 1, pageSize = 20) {
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(
    query
  )}&page=${page}&page_size=${pageSize}`;
  return fetchRawgApi(url);
}
