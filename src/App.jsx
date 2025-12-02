import { useState, useEffect, useRef } from "react";
import GameCard from "./components/GameCard";
import { fetchGameDetail, fetchSpy, fetchTopGamesByGenre } from "./api/steam";

const GENRE_MAP = {
  All: "all",
  Action: "action",
  RPG: "role-playing",
  Adventure: "adventure",
  Strategy: "strategy",
  Indie: "indie",
  Simulation: "simulation",
};

const BATCH_SIZE = 20;

export default function App() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [games, setGames] = useState([]);
  const [allAppIds, setAllAppIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const containerRef = useRef(null);

  // 장르 선택 시 전체 appid 가져오기
  useEffect(() => {
    async function loadAppIds() {
      setLoading(true);
      const genreParam = GENRE_MAP[selectedGenre] || "all";
      const appids = await fetchTopGamesByGenre(genreParam, 100);
      setAllAppIds(appids);
      setGames([]);
      setPage(0);
      setLoading(false);
    }
    loadAppIds();
  }, [selectedGenre]);

  // 페이지별 게임 상세정보 로드 (최소 BATCH_SIZE 확보)
  useEffect(() => {
    async function loadGames() {
      if (page * BATCH_SIZE >= allAppIds.length) return;
      setLoading(true);

      const results = [];
      let index = page * BATCH_SIZE;

      while (results.length < BATCH_SIZE && index < allAppIds.length) {
        const batch = allAppIds.slice(
          index,
          index + (BATCH_SIZE - results.length)
        );

        const batchResults = await Promise.all(
          batch.map(async (appid) => {
            try {
              const info = (await fetchGameDetail(appid)) || {
                name: "Unknown",
                header_image: "",
                appid,
              };
              const spy = (await fetchSpy(appid)) || {
                positive: 0,
                negative: 0,
              };
              const rating =
                spy.positive + spy.negative > 0
                  ? spy.positive / (spy.positive + spy.negative)
                  : 0;

              return {
                appid,
                name: info.name,
                image: info.header_image,
                rating,
              };
            } catch {
              return null;
            }
          })
        );

        results.push(...batchResults.filter(Boolean));
        index += batch.length;
      }

      setGames((prev) => [...prev, ...results]);
      setLoading(false);
    }

    loadGames();
  }, [page, allAppIds]);

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
    if (container) container.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const filteredGames = games.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      ref={containerRef}
      className="p-6 max-w-5xl mx-auto h-[90vh] overflow-y-auto"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎮 Steam Top Rated Games
      </h1>

      <div className="flex justify-center mb-4 gap-4">
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {Object.keys(GENRE_MAP).map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
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

      {filteredGames.length === 0 && !loading && (
        <p className="text-center text-gray-400">No games found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <GameCard key={game.appid} game={game} />
        ))}
      </div>

      {loading && <p className="text-center mt-4">Loading more games...</p>}
    </div>
  );
}
