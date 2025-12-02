export default function GameCard({ game }) {
  // game.stores가 null/undefined일 경우 오류 방지
  const steamStore = game.stores?.find(
    (store) => store.store.slug.toLowerCase() === "steam"
  );

  // ⭐️ steamStore.url이 유효하고 빈 문자열이 아닌 경우에만 사용합니다.
  const steamLink =
    steamStore?.url && steamStore.url.trim() !== ""
      ? steamStore.url // 유효한 URL
      : "https://store.steampowered.com"; // 유효하지 않으면 기본 URL

  // ✨ 콘솔 출력 추가: 어떤 링크가 최종적으로 사용되는지 확인
  console.log(`[${game.name}] Final Steam Link:`, steamLink);

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition p-3">
      <img
        src={game.image}
        alt={game.name}
        className="rounded-md w-full h-40 object-cover"
      />
      <h2 className="mt-3 text-lg font-bold">{game.name}</h2>
      <p className="text-sm text-gray-400">
        Rating: {(game.rating * 100).toFixed(1)}%
      </p>
      <button
        onClick={() => window.open(steamLink, "_blank", "noopener,noreferrer")}
        className="mt-3 w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-sm font-semibold"
      >
        View on Steam
      </button>
    </div>
  );
}
