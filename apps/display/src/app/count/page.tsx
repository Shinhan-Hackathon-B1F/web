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

  useEffect(() => {
    fetchData();
    fetchTeamStats();
  }, []);

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

  // 승리 팀 결정
  const getWinningTeam = () => {
    if (team1 > team2) return 1;
    if (team2 > team1) return 2;
    return null;
  };

  // 실시간 구독
  useEffect(() => {
    const channel = supabase.channel("display-count")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "events",
      },
      (payload) => {
        console.log("이벤트 변경:", payload);
        if (payload.new) {
          setEvent(payload.new as Event);
        }
      }
    )
    .subscribe();

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
  }, [supabase]);

  console.log("Current state:", {
    event,
    team1,
    team2,
  });

  return (
    <div className="relative min-h-screen mb-6 py-[40px] px-[50px] 2xl:py-[80px] 2xl:px-[100px]">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        autoPlay
        playsInline
      >
        <source src="/assets/카스 광고 영상.mp4" type="video/mp4" />
      </video>
      <div className="flex flex-row justify-between pb-[114px]">
        <div className="relative w-[357px] h-[40px] 2xl:w-[715px] 2xl:h-[80px]">
          <Image
            src="/assets/Frame 5408.png"
            alt="프레임"
            fill
            priority={true}
            style={{ objectFit: "contain", objectPosition: "left top" }}
          />
        </div>

        <h1 className="text-4xl 2xl:text-[64px] font-kbo font-bold mb-4 leading-tight text-white">
          응원 지수를 높여라
        </h1>
      </div>

      {/* 팀별 점수 */}
      <div className="flex flex-row justify-between gap-12 ">
        <div className="flex flex-row justify-between">
          <Gauge score={team1} maxScore={100} flip={true} />
          <div className="flex w-[260px] h-[180px] rounded-2xl bg-white/40 -ml-[60px] items-center justify-center">
            <Image
              src="/assets/SSG mark.svg"
              alt="프레임"
              width={200}
              height={118}
              priority={true}
              style={{ objectFit: "contain", objectPosition: "left top" }}
            />
          </div>
          {event?.status == "finished" && getWinningTeam() === 1 && (
            <div className="absolute top-[487px] left-[190px]">
              <Image
                src="/assets/WIN!!.svg"
                alt="프레임"
                width={401}
                height={178}
                priority={true}
                style={{ objectFit: "contain", objectPosition: "left top" }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-row">
          <div className="flex w-[260px] h-[180px] rounded-2xl bg-white/40 -mr-[60px] items-center justify-center">
            <Image
              src="/assets/doosan mark.svg"
              alt="프레임"
              width={200}
              height={111}
              priority={true}
              style={{ objectFit: "contain", objectPosition: "left top" }}
            />
          </div>
          <Gauge score={team2} maxScore={100} />
          {event?.status == "finished" && getWinningTeam() === 2 && (
            <div className="absolute top-[487px] right-[190px]">
              <Image
                src="/assets/WIN!!.svg"
                alt="프레임"
                width={401}
                height={178}
                priority={true}
                style={{ objectFit: "contain", objectPosition: "left top" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
