import { useState, useEffect } from "react";
import GameCard from "./components/GameCard";
import { fetchGameDetail, fetchTopGamesByGenre } from "./api/steam";

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

  useEffect(() => {
    async function loadGames() {
      setLoading(true);
      const appids = await fetchTopGamesByGenre(selectedGenre);
      const results = [];

      for (const appid of appids) {
        const info = await fetchGameDetail(appid);
        if (!info) continue;
        // 장르 필터: SteamStore API에서 해당 장르 포함 여부 확인
        if (!info.genres?.some((g) => g.description === selectedGenre))
          continue;

        const rating = info.metacritic?.score
          ? info.metacritic.score / 100
          : 0.5; // 메타크리틱 점수가 없으면 기본 50%

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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎮 Steam Top Rated Games
      </h1>

      <div className="flex justify-center mb-8">
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {GENRES.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-lg">Loading games...</p>
      ) : games.length === 0 ? (
        <p className="text-center text-gray-400">
          No games found for this genre.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.appid} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
