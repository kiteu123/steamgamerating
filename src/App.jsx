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

  useEffect(() => {
    async function loadGames() {
      setLoading(true);

      try {
        // Top50 게임 ID 가져오기
        const appids = await fetchTopGamesByGenre(selectedGenre, 50);

        // 병렬 처리로 게임 정보와 평점 가져오기
        const results = await Promise.all(
          appids.map(async (appid) => {
            const info = await fetchGameDetail(appid);
            if (!info) return null; // info 없으면 건너뛰기

            const spy = await fetchSpy(appid);
            const rating = spy.positive / (spy.positive + spy.negative);

            return {
              appid,
              name: info.name,
              image: info.header_image,
              rating,
            };
          })
        );

        // null 제거 후 평점 내림차순 정렬
        setGames(results.filter(Boolean).sort((a, b) => b.rating - a.rating));
      } catch (err) {
        console.error("Error loading games:", err);
      } finally {
        setLoading(false);
      }
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
