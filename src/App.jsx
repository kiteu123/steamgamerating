// App.jsx (App.js 또는 pages/index.jsx)

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
  // ✨ 무한 스크롤 제어를 위한 상태 추가
  const [hasMore, setHasMore] = useState(true);

  const containerRef = useRef(null);

  const loadGames = async (reset = false) => {
    // 다음 페이지가 없으면 로드 중지
    if (!reset && !hasMore) return;

    setLoading(true);
    let data = { results: [], hasNext: false }; // API 응답 객체 초기화

    // 🎯 RPG 장르 슬러그 변환 로직 추가 (수정된 부분)
    let genreSlug = selectedGenre;
    if (selectedGenre === "RPG") {
      genreSlug = "role-playing-games";
    } else if (selectedGenre !== "All") {
      genreSlug = selectedGenre.toLowerCase();
    } else {
      // "All"일 때는 빈 문자열 그대로 사용
      genreSlug = "";
    }
    // ---------------------------------------------

    try {
      if (search) {
        data = await searchGames(search, page, PAGE_SIZE);
      } else {
        // ✨ 변환된 genreSlug를 API 함수에 전달
        data = await fetchGamesByGenre(genreSlug, page, PAGE_SIZE);
      }

      // ✨ data.results (배열)만 사용하여 게임 상태 업데이트
      setGames((prev) => (reset ? data.results : [...prev, ...data.results]));
      // ✨ 다음 페이지 존재 여부 업데이트
      setHasMore(data.hasNext);
    } catch (error) {
      console.error("데이터 로드 중 오류 발생:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // 장르/검색 변경 시 초기화
  useEffect(() => {
    setPage(1);
    setHasMore(true); // 새 검색/장르 시 무조건 true로 초기화
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

      // ✨ hasMore 조건 추가: 다음 페이지가 있고, 스크롤이 끝에 도달했고, 로딩 중이 아닐 때만 페이지 증가
      if (
        scrollTop + clientHeight >= scrollHeight - 50 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]); // ✨ 의존성 배열에 hasMore 추가

  return (
    // ⭐️ 1. 최상위 컨테이너는 이제 스크롤을 담당하지 않고 전체 너비만 설정
    <div className="p-6 max-w-5xl mx-auto h-[100vh] overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-6 text-center">🎮 RAWG Top Games</h1>

      {/* ⭐️ 2. 검색/로딩바 영역 (스크롤 되지 않는 고정 영역) */}
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

      {/* ⭐️ 3. 게임 목록 영역 (스크롤 컨테이너) */}
      <div
        ref={containerRef}
        // ✨ 남은 높이를 채우도록 h-[calc(100vh-A)] 사용
        // (A는 상단 헤더와 필터의 높이를 대략 계산한 값, h-[80vh]는 안전한 임시값)
        className="h-[80vh] overflow-y-auto custom-scrollbar"
      >
        {games.length === 0 && !loading && (
          <p className="text-center text-gray-400">No games found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {/* 데이터 끝을 알리는 메시지 */}
        {!loading && games.length > 0 && !hasMore && (
          <p className="text-center text-gray-500 mt-4">End of results.</p>
        )}
      </div>
    </div>
  );
}
