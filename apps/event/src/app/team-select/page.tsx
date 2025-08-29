"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../../../shared/utils/supabase/client";

export default function TeamSelect() {
  const router = useRouter();
  const supabase = createClient();
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    const channel = supabase
      .channel("display-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        (payload) => {
          console.log(payload);
          if (
            payload.new &&
            "status" in payload.new &&
            payload.new.status === "active"
          ) {
            router.push("/count");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleTeamSelect = (team: string) => {
    setSelectedTeam(team);
  };

  const handlePlayClick = () => {
    if (selectedTeam) {
      router.push("/game");
    }
  };

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col text-white">
      {/* Header */}
      <div className="text-center pt-16 pb-32">
        <h1 className="text-2xl font-bold">응원지수를 높여라</h1>
      </div>

      {/* Instruction */}
      <div className="text-center mb-32">
        <div className="bg-blue-900 bg-opacity-80 rounded-2xl px-8 py-4 mx-6">
          <p className="text-lg font-medium">응원하는 팀을 선택해주세요</p>
        </div>
      </div>

      {/* Team Selection Cards */}
      <div className="bg-white bg-opacity-20 mx-6 rounded-3xl p-6 mb-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => handleTeamSelect("bears")}
            className={`bg-white rounded-2xl p-8 transition-all ${
              selectedTeam === "bears" ? "ring-4 ring-yellow-400" : ""
            }`}
          >
            <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
              <span className="text-sm text-gray-600">Bears Logo</span>
            </div>
          </button>

          <button
            onClick={() => handleTeamSelect("giants")}
            className={`bg-white rounded-2xl p-8 transition-all ${
              selectedTeam === "giants" ? "ring-4 ring-yellow-400" : ""
            }`}
          >
            <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
              <span className="text-sm text-gray-600">Giants Logo</span>
            </div>
          </button>
        </div>

        {/* Play Button */}
        <button
          onClick={handlePlayClick}
          disabled={!selectedTeam}
          className={`w-full py-4 rounded-2xl font-black text-xl transition-all ${
            selectedTeam
              ? "bg-black text-white"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          PLAY
        </button>
      </div>
    </div>
  );
}
