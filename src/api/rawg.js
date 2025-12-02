const API_KEY = "116d4dbb0177491cb07efccecbce3a7b"; // .env.local에 저장

export async function fetchGamesByGenre(genre, page = 1, pageSize = 20) {
  try {
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&genres=${genre}&page=${page}&page_size=${pageSize}`
    );
    const data = await res.json();
    return data.results.map((game) => ({
      id: game.id,
      name: game.name,
      image: game.background_image,
      rating: game.rating,
    }));
  } catch (err) {
    console.error("RAWG API error:", err);
    return [];
  }
}

export async function searchGames(query, page = 1, pageSize = 20) {
  try {
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(
        query
      )}&page=${page}&page_size=${pageSize}`
    );
    const data = await res.json();
    return data.results.map((game) => ({
      id: game.id,
      name: game.name,
      image: game.background_image,
      rating: game.rating,
    }));
  } catch (err) {
    console.error("RAWG API search error:", err);
    return [];
  }
}
