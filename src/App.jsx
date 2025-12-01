import { useState, useEffect } from "react";
import GameCard from "./components/GameCard";
import { fetchGameDetail, fetchSpy, fetchTopGamesByGenre } from "./api/steam";

const GENRES = [
  "Action",
  "RPG",
  "Adventure",
  "Strategy",
  "Indie",
  "Simulation",
];

export default function App() {
  const [selectedGenre, setSelectedGenre] = useState("RPG");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadGames() {
      setLoading(true);
      const results = [];

      // 선택한 장르 Top30 게임 ID 가져오기 (Top50 → Top30으로 축소)
      const appids = await fetchTopGamesByGenre(selectedGenre, 30);

      for (const appid of appids) {
        const info = await fetchGameDetail(appid);
        if (!info) continue;

        const spy = await fetchSpy(appid);
        const rating = spy.positive / (spy.positive + spy.negative);

        results.push({
          appid,
          name: info.name,
          image: info.header_image,
          rating,
        });
      }

      results.sort((a, b) => b.rating - a.rating);
      setGames(results);
      setLoading(false);
    }

    loadGames();
  }, [selectedGenre]);

  // 검색어 기반 필터링
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎮 Steam Top Rated Games
      </h1>

      <div className="flex justify-center mb-4 gap-4">
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {GENRES.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 w-64"
        />
      </div>

      {loading ? (
        <p className="text-center text-lg">Loading games...</p>
      ) : filteredGames.length === 0 ? (
        <p className="text-center text-gray-400">No games found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.appid} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
