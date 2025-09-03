"use client";

interface LoseComponentProps {
  teamId: number | null;
  myScore: number | null;
  teamScore: number | null;
}

export default function LoseComponent({ teamId, myScore, teamScore }: LoseComponentProps) {
  return <div>패배..</div>;
}
