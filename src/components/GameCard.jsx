export default function GameCard({ game }) {
  const steamStore = game.stores.find(
    (store) => store.store.slug.toLowerCase() === "steam"
  );

  const steamLink = steamStore
    ? steamStore.url
    : "https://store.steampowered.com";

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
      <a
        href={steamLink}
        target="_blank" // 새 탭에서 열기
        rel="noopener noreferrer" // 보안 강화를 위해 추가
        className="mt-3 w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-sm font-semibold block text-center"
      >
        View on Steam
      </a>
    </div>
  );
}
