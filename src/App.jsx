import { useState, useEffect } from "react";
import GameCard from "./components/GameCard";
import { fetchGameDetail, fetchSpy } from "./api/steam";

const GENRES = [
  "Action",
  "RPG",
  "Adventure",
  "Strategy",
  "Indie",
  "Simulation",
];
const POPULAR_APPIDS = [
  570, 730, 440, 252490, 271590, 304930, 359550, 1172470, 381210, 1091500,
];

export default function App() {
  const [selectedGenre, setSelectedGenre] = useState("RPG");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadGames() {
      setLoading(true);
      const results = [];

      for (const appid of POPULAR_APPIDS) {
        const info = await fetchGameDetail(appid);
        if (!info) continue;
        if (!info.genres?.some((g) => g.description === selectedGenre))
          continue;

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
