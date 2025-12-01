import { useState, useEffect, useRef } from "react";
import GameCard from "./components/GameCard";
import { fetchGameDetail, fetchSpy, fetchTopGamesByGenre } from "./api/steam";

const GENRES = [
  "All",
  "Action",
  "RPG",
  "Adventure",
  "Strategy",
  "Indie",
  "Simulation",
];
const BATCH_SIZE = 20; // 한 번에 불러오는 게임 수

export default function App() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [games, setGames] = useState([]);
  const [allAppIds, setAllAppIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const containerRef = useRef(null);

  // 장르 선택 시 전체 appid 목록 가져오기
  useEffect(() => {
    async function loadAppIds() {
      let appids = [];
      if (selectedGenre === "All") {
        // 모든 장르 게임 가져오기
        appids = await fetchTopGamesByGenre("", 100); // 빈 문자열이나 API가 모든 게임을 반환하도록 처리
      } else {
        appids = await fetchTopGamesByGenre(selectedGenre, 100);
      }
      setAllAppIds(appids);
      setGames([]);
      setPage(0);
      setLoading(false);
    }

    loadAppIds();
  }, [selectedGenre]);

  // 페이지 변경 시 게임 정보 로드
  useEffect(() => {
    async function loadGames() {
      if (page * BATCH_SIZE >= allAppIds.length) return;
      setLoading(true);

      const results = [];
      const batch = allAppIds.slice(page * BATCH_SIZE, (page + 1) * BATCH_SIZE);

      for (const appid of batch) {
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

      setGames((prev) => [...prev, ...results]);
      setLoading(false);
    }

    loadGames();
  }, [page, allAppIds]);

  // 무한 스크롤 이벤트
  useEffect(() => {
    function handleScroll() {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 50 && !loading) {
        setPage((prev) => prev + 1);
      }
    }

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(search.toLowerCase())
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
