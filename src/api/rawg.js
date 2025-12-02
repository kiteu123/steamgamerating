// src/api/rawg.js

const API_KEY = "116d4dbb0177491cb07efccecbce3a7b";

// 공통 API 호출 로직
async function fetchRawgApi(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }
    const data = await res.json();

    // 무한 스크롤 제어를 위해 hasNext를 반환
    const hasNext = !!data.next;

    // 클라이언트에게 필요한 데이터 가공
    const results = data.results.map((game) => ({
      id: game.id,
      name: game.name,
      image: game.background_image,
      rating: game.rating,
    }));

    // { results: Array, hasNext: Boolean } 형태로 통일하여 반환
    return { results, hasNext };
  } catch (err) {
    console.error("RAWG API error:", err);
    // 오류 시에도 일관된 형태로 반환
    return { results: [], hasNext: false };
  }
}

// 장르별 게임 목록 호출 (All 장르 처리 포함)
export async function fetchGamesByGenre(genre = "", page = 1, pageSize = 20) {
  // 장르가 ""일 경우 (All) 장르 쿼리 파라미터를 추가하지 않습니다.
  let url = `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=${pageSize}`;

  if (genre) {
    url += `&genres=${genre}`;
  }

  return fetchRawgApi(url);
}

// 검색 결과 호출
export async function searchGames(query = "", page = 1, pageSize = 20) {
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(
    query
  )}&page=${page}&page_size=${pageSize}`;
  return fetchRawgApi(url);
}
