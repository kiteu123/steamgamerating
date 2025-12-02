import { useState, useEffect, useRef } from "react";
import GameCard from "./components/GameCard";
import { fetchGamesByGenre, searchGames } from "./api/rawg";

const GENRES = [
  "All",
  "Action",
  "RPG",
  "Adventure",
  "Strategy",
  "Indie",
  "Simulation",
];
const PAGE_SIZE = 20;

export default function App() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const containerRef = useRef(null);

  const loadGames = async (reset = false) => {
    setLoading(true);
    let results = [];
    if (search) {
      results = await searchGames(search, page, PAGE_SIZE);
    } else if (selectedGenre === "All") {
      results = await fetchGamesByGenre("", page, PAGE_SIZE);
    } else {
      results = await fetchGamesByGenre(
        selectedGenre.toLowerCase(),
        page,
        PAGE_SIZE
      );
    }
    setGames((prev) => (reset ? results : [...prev, ...results]));
    setLoading(false);
  };

  // 장르/검색 변경 시 초기화
  useEffect(() => {
    setPage(1);
    loadGames(true);
  }, [selectedGenre, search]);

  // 페이지 변경 시 추가 로드
  useEffect(() => {
    if (page === 1) return;
    loadGames();
  }, [page]);

  // 무한 스크롤
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50 && !loading) {
        setPage((prev) => prev + 1);
      }
    };
    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div
      ref={containerRef}
      className="p-6 max-w-5xl mx-auto h-[90vh] overflow-y-auto"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">🎮 RAWG Top Games</h1>

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

      {games.length === 0 && !loading && (
        <p className="text-center text-gray-400">No games found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {loading && <p className="text-center mt-4">Loading more games...</p>}
    </div>
  );
}
