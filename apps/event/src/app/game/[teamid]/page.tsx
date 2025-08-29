"use client";
import { useEffect, useState } from "react";
import { getUserId } from "@/utils/userIdentifier";

export default function Game({
  params,
}: {
  params: Promise<{ teamid: string }>;
}) {
  const [gameData, setGameData] = useState({
    teamid: null as string | null,
    userId: null as string | null,
    loading: true,
  });

  useEffect(() => {
    const initGame = async () => {
      const { teamid } = await params; // useEffect 내에서 await
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

  if (gameData.loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Game Page</h1>
      <p>Team ID: {gameData.teamid}</p>
      <p>User ID: {gameData.userId}</p>
    </div>
  );
}
