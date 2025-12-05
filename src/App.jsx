// App.jsx
import { useState } from "react";
import IntroAnimation from "./components/IntroAnimation";
import GameListPage from "./components/GameListPage";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro ? (
        <IntroAnimation onFinish={() => setShowIntro(false)} />
      ) : (
        <GameListPage />
      )}
    </>
  );
}
