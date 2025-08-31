"use client";
import { Suspense, useEffect, useState } from "react";
import WinComponent from "./components/WinComponent";
import LoseComponent from "./components/LoseComponent";

function ResultContent({ outcome }: { outcome: string | null }) {
    if (outcome === "win") {
      return <WinComponent />;
    } else if (outcome === "lose") {
      return <LoseComponent />;
    }
  
    return <div>결과를 불러오는 중...</div>;
  }

export default function GameResult() {
  const [outcome, setOutcome] = useState<string | null>(null);

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
        console.log("결과가 만료됨");
      }
      sessionStorage.removeItem("gameResult");
    }
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent outcome={outcome} />
    </Suspense>
  );
}
