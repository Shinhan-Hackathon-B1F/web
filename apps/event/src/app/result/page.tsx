"use client";
import { Suspense, useEffect, useState } from "react";
import WinComponent from "./components/WinComponent";
import LoseComponent from "./components/LoseComponent";

function ResultContent({
  outcome,
  isLoading,
}: {
  outcome: string | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>결과를 불러오는 중...</div>
      </div>
    );
  }

  if (outcome === "win") {
    return <WinComponent />;
  } else if (outcome === "lose") {
    return <LoseComponent />;
  }

  // 이미 종료된 게임 화면
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gray-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">이미 종료된 게임입니다</h1>
        <p className="text-gray-400 mb-8">게임 결과를 찾을 수 없습니다.</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
}

export default function GameResult() {
  const [outcome, setOutcome] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const result = sessionStorage.getItem("gameResult");
    console.log(result);

    if (result) {
      const { outcome, timestamp } = JSON.parse(result);
      const elapsed = Date.now() - timestamp;

      // 5분(300초) 체크
      if (elapsed < 5 * 60 * 1000) {
        setOutcome(outcome);
      } else {
        sessionStorage.removeItem("gameResult");
        setOutcome(null);
      }
    } else {
      setOutcome(null);
    }

    setIsLoading(false);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent outcome={outcome} isLoading={isLoading} />
    </Suspense>
  );
}
