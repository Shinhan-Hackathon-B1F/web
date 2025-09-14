"use client";
import { Suspense, useEffect, useState } from "react";
import { createClient } from "../../../../../shared/utils/supabase/client";
import { GameResult } from "../../../../../shared/types";
import WinComponent from "./components/WinComponent";
import LoseComponent from "./components/LoseComponent";

function ResultContent({
  outcome,
  teamid,
  myScore,
  teamScore,
  isLoading,
}: {
  outcome: string | null;
  teamid: number | null;
  myScore: number | null;
  teamScore: number | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">결과 계산 중...</h2>
          <p className="text-gray-300">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  if (outcome === "win") {
    return (
      <WinComponent teamid={teamid} myScore={myScore} teamScore={teamScore} />
    );
  } else if (outcome === "lose") {
    return (
      <LoseComponent teamid={teamid} myScore={myScore} teamScore={teamScore} />
    );
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

export default function GameResultPage() {
  const [outcome, setOutcome] = useState<string | null>(null);
  const [teamid, setTeamId] = useState<number | null>(null);
  const [myScore, setMyScore] = useState<number | null>(null);
  const [teamScore, setTeamScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadGameResult = async () => {
      try {
        const result = sessionStorage.getItem("gameResult");

        if (!result) {
          setIsLoading(false);
          return;
        }

        const {
          teamid: sessionTeamId,
          myScore,
          timestamp,
        } = JSON.parse(result);
        const numericTeamId = parseInt(sessionTeamId);
        const elapsed = Date.now() - timestamp;

        // 5분 체크
        if (elapsed >= 5 * 60 * 1000) {
          sessionStorage.removeItem("gameResult");
          setIsLoading(false);
          return;
        }

        // 기본 데이터 설정
        setTeamId(numericTeamId);
        setMyScore(myScore);

        // 이미 결과가 있는지 확인
        const { data: existingResult, error } = await supabase
          .from("game_results")
          .select("*")
          .eq("event_id", 1)
          .single();

        if (!error && existingResult) {
          const myTeamScore =
            numericTeamId === 1
              ? existingResult.team_1_average
              : existingResult.team_2_average;
          const isWin = numericTeamId === existingResult.winning_team_id;

          setOutcome(isWin ? "win" : "lose");
          setTeamScore(Math.round(myTeamScore || 0));
          setIsLoading(false);
          return;
        }

        // 결과가 없으면 구독 시작
        console.log("결과 대기 시작...");
        const gameResultsSubscription = supabase
          .channel("result-page-subscription")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "game_results",
              filter: "event_id=eq.1",
            },
            (payload) => {
              console.log("결과 계산 완료!", payload);
              const result = payload.new as GameResult;

              const myTeamScore =
                numericTeamId === 1
                  ? result.team_1_average
                  : result.team_2_average;
              const isWin = numericTeamId === result.winning_team_id;

              setOutcome(isWin ? "win" : "lose");
              setTeamScore(Math.round(myTeamScore || 0));
              setIsLoading(false);

              supabase.removeChannel(gameResultsSubscription);
            }
          )
          .subscribe();
      } catch (error) {
        console.error("결과 로딩 실패:", error);
        setIsLoading(false);
      }
    };

    loadGameResult();
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent
        outcome={outcome}
        teamid={teamid}
        myScore={myScore}
        teamScore={teamScore}
        isLoading={isLoading}
      />
    </Suspense>
  );
}
