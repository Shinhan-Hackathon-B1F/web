"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../../shared/utils/supabase/client";
import { Event, Team } from "../../../../../shared/types";
import Gauge from "./components/Gauge";

export default function Display() {
  const supabase = createClient();

  const [event, setEvent] = useState<Event | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

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

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    console.log("Timer useEffect triggered:", {
      status: event?.status,
      finished_at: event?.finished_at,
      event: event,
    });

    if (event?.status === "active" && event?.finished_at) {
      const updateTimer = () => {
        const finishTime = new Date(event.finished_at!).getTime();
        const now = new Date().getTime();
        const remaining = Math.max(0, Math.ceil((finishTime - now) / 1000));

        setTimeRemaining(remaining);

        // 시간이 끝나면 타이머 정리
        if (remaining <= 0) {
          if (timer) clearInterval(timer);
        }
      };

      updateTimer(); // 즉시 실행
      timer = setInterval(updateTimer, 1000);
    } else {
      setTimeRemaining(0);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [event]);

  return (
    <div className="mb-6 p-4 border">
      {event?.status === "active" && timeRemaining > 0 && (
        <p>
          남은 시간:{" "}
          <span className="font-bold text-red-500">{timeRemaining}초</span>
        </p>
      )}
      {event?.status === "finished" && (
        <p className="text-red-500 font-bold">이벤트가 종료되었습니다!</p>
      )}

      {/* 팀별 점수 */}
      <div className="flex flex-row gap-12">
        <div>
          SSG
          <div>{team1}</div>
          <Gauge score={team1} maxScore={100} />
        </div>

        <div>
          두산
          <div>{team2}</div>
          <Gauge score={team2} maxScore={100} />
        </div>
      </div>
    </div>
  );
}
