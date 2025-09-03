"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../../shared/utils/supabase/client";
import { Event, Team } from "../../../../../shared/types";
import Gauge from "./components/Gauge";
import Image from "next/image";

export default function Display() {
  const supabase = createClient();

  const [event, setEvent] = useState<Event | null>(null);

  const [team1, setTeam1] = useState(0);
  const [team2, setTeam2] = useState(0);

  // 디바운싱을 위한 타이머
  const [updateTimer, setUpdateTimer] = useState<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .eq("id", 1)
      .single();

    setEvent(eventData);
  };

  // 팀 통계 데이터 가져오기
  const fetchTeamStats = async () => {
    const { data: team1Data } = await supabase
      .from("team_stats_view")
      .select("cheer_average")
      .eq("id", 1)
      .single();

    const { data: team2Data } = await supabase
      .from("team_stats_view")
      .select("cheer_average")
      .eq("id", 2)
      .single();

    setTeam1(team1Data?.cheer_average | 0);
    setTeam2(team2Data?.cheer_average | 0);
  };

  const debouncedUpdate = () => {
    if (updateTimer) {
      clearTimeout(updateTimer);
    }

    const newTimer = setTimeout(() => {
      fetchTeamStats();
    }, 250);

    setUpdateTimer(newTimer);
  };

  // 실시간 구독
  useEffect(() => {
    fetchData();

    const channel = supabase.channel("event-channel").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "events",
      },
      (payload) => {
        console.log("이벤트 변경:", payload);
        fetchData();
      }
    );

    const teamChannel = supabase
      .channel("team-stats-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
        },
        (payload) => {
          debouncedUpdate(); // 디바운스된 업데이트
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participants",
        },
        (payload) => {
          debouncedUpdate(); // 디바운스된 업데이트
        }
      )
      .subscribe();

    return () => {
      if (updateTimer) {
        clearTimeout(updateTimer);
      }

      supabase.removeChannel(channel);
      supabase.removeChannel(teamChannel);
    };
  }, []);

  return (
    <div className="min-h-screen mb-6 py-[40px] px-[50px] xl:py-[80px] xl:px-[100px]">
      <div className="flex flex-row justify-between">
        <div className="relative w-[357px] h-[40px] xl:w-[715px] xl:h-[80px] ">
          <Image
            src="/assets/Frame 5408_count.svg"
            alt="프레임"
            fill
            priority={true}
            style={{ objectFit: 'contain', objectPosition: 'left top' }}
          />
        </div>

        <h1 className="text-4xl xl:text-[64px] font-kbo font-bold mb-4 leading-tight text-white">
            응원 지수를 높여라
          </h1>
      </div>

      {/* 팀별 점수 */}
      <div className="flex flex-row justify-between gap-12 ">
        <div>
          <Gauge score={team1} maxScore={100} flip={true} />
        </div>

        <div>
          <Gauge score={team2} maxScore={100} />
        </div>
      </div>
    </div>
  );
}
