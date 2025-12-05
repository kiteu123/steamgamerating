// components/GameListPage.jsx

import { useState, useEffect, useRef } from "react";
import GameCard from "./GameCard";
import { fetchGamesByGenre, searchGames } from "../api/rawg";

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

export default function GameListPage() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const containerRef = useRef(null);

  const loadGames = async (reset = false) => {
    if (!reset && !hasMore) return;

    setLoading(true);
    let data = { results: [], hasNext: false };

    // 장르 slug 변환
    let genreSlug = selectedGenre;
    if (selectedGenre === "RPG") genreSlug = "role-playing-games";
    else if (selectedGenre !== "All") genreSlug = selectedGenre.toLowerCase();
    else genreSlug = "";

    try {
      if (search) {
        data = await searchGames(search, page, PAGE_SIZE);
      } else {
        data = await fetchGamesByGenre(genreSlug, page, PAGE_SIZE);
      }

      setGames((prev) => (reset ? data.results : [...prev, ...data.results]));
      setHasMore(data.hasNext);
    } catch (err) {
      console.error(err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // 장르 또는 검색어 변경 시 초기화
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadGames(true);
  }, [selectedGenre, search]);

  // 페이지 변경 시 추가 로딩
  useEffect(() => {
    if (page !== 1) loadGames();
  }, [page]);

  // 무한 스크롤
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (
        scrollTop + clientHeight >= scrollHeight - 50 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    const el = containerRef.current;
    el?.addEventListener("scroll", handleScroll);

    return () => el?.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="p-6 max-w-5xl mx-auto h-[100vh] overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-6 text-center">🎮 Game List</h1>

      {/* 검색 / 장르 선택 */}
      <div className="flex justify-center items-center mb-6 gap-4">
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

        {loading && <p className="text-blue-400 font-medium">Loading...</p>}
      </div>

      {/* 스크롤 컨테이너 */}
      <div
        ref={containerRef}
        className="h-[80vh] overflow-y-auto overflow-x-hidden custom-scrollbar"
      >
        {games.length === 0 && !loading && (
          <p className="text-center text-gray-400">No games found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {!loading && games.length > 0 && !hasMore && (
          <p className="text-center text-gray-500 mt-4">End of results.</p>
        )}
      </div>
    </div>
  );
}
