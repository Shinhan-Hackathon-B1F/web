"use client";
import { useEffect, useState } from "react";
import { getUserId } from "@/utils/userIdentifier";
import { createClient } from "../../../../../../shared/utils/supabase/client";

export default function Game({
  params,
}: {
  params: Promise<{ teamid: number }>;
}) {
  const supabase = createClient();

  const [gameData, setGameData] = useState({
    teamid: null as number | null,
    userId: null as string | null,
    loading: true,
  });

  useEffect(() => {
    const initGame = async () => {
      const { teamid } = await params;
      const userId = getUserId();

      setGameData({
        teamid,
        userId,
        loading: false,
      });

      console.log(`User ${userId} joined team ${teamid}`);
    };

    initGame();
  }, [params]);

  const cheerForTeam = async (teamId: number | null) => {
    const sessionId = getUserId();

    if (teamId != null) {
      const { error } = await supabase.from("user_cheers").insert({
        session_id: sessionId,
        team_id: teamId,
        event_id: 1,
      });

      if (error) {
        console.error("응원 에러:", error);
      }
    }
  };

  if (gameData.loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Game Page</h1>
      <p>Team ID: {gameData.teamid}</p>
      <p>User ID: {gameData.userId}</p>
      <button
        className="bg-blue-600 rounded-2xl p-8 transition-all"
        onClick={() => cheerForTeam(gameData.teamid)}
      ></button>
    </div>
  );
}
