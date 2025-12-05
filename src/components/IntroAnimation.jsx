import React, { useEffect, useState } from "react";
import "./IntroAnimation.css";

export default function IntroAnimation({ onFinish }) {
  const [stage, setStage] = useState(0);
  const [shake, setShake] = useState(false);
  const [shakePower, setShakePower] = useState(0);
  const text = "Loading Games...";

  const triggerShake = (power = 1) => {
    setShakePower(power);
    setShake(true);
    setTimeout(() => {
      setShake(true);
    }, 1); // 1ms 지연
    setTimeout(() => {
      setShake(false);
      setShakePower(0); // 흔들림이 끝나면 강도 초기화
    }, 100);
  };

  useEffect(() => {
    const timers = [
      // stage 1 (300ms)
      setTimeout(() => setStage(1), 300),
      setTimeout(() => setStage(2), 1500),
      setTimeout(() => setStage(3), 2000),
      setTimeout(() => setStage(4), 2500),
      setTimeout(() => onFinish(), 3500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onFinish]);

  useEffect(() => {
    const shakeTimers = [
      setTimeout(() => triggerShake(1.1), 1500),
      setTimeout(() => triggerShake(1.3), 2000),
      setTimeout(() => triggerShake(1.5), 2500),
    ];

    return () => shakeTimers.forEach(clearTimeout);
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  return (
    <div
      className={`intro-container ${shake ? "shake" : ""}`}
      style={shake ? { "--shake-power": shakePower } : {}}
    >
      {/* bullets */}
      {stage >= 2 && <div className="bullet bullet1"></div>}
      {stage >= 3 && <div className="bullet bullet2"></div>}
      {stage >= 4 && <div className="bullet bullet3"></div>}

      {/* cracks */}
      {stage >= 2 && <div className="crack crack1"></div>}
      {stage >= 3 && <div className="crack crack2"></div>}
      {stage >= 4 && <div className="crack crack3"></div>}

      {/* animated characters */}
      {stage >= 1 && (
        <div className="loading-letters">
          {text.split("").map((char, i) => {
            const offsetX = Math.random() * 300 - 150; // -150 ~ +150 px
            const offsetY = Math.random() * 300 - 150;

            return (
              <span
                key={i}
                className="letter"
                style={{
                  "--start-x": `${offsetX}px`,
                  "--start-y": `${offsetY}px`,
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
