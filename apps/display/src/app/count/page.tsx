"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../../shared/utils/supabase/client";
import { Event, Team } from "../../../../../shared/types";

export default function Display() {
  const supabase = createClient();

  const [event, setEvent] = useState<Event | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const fetchData = async () => {
    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .eq("id", 1)
      .single();

    const { data: teamsData } = await supabase
      .from("teams")
      .select("*")
      .eq("event_id", 1);

    console.log("Fetched event data:", eventData); // 디버깅용
    setEvent(eventData);
    setTeams(teamsData || []);
  };

  // 실시간 구독
  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("event-channel")
      .on(
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
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
        },
        (payload) => {
          console.log("팀 변경:", payload);
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    console.log("Timer useEffect triggered:", {
      status: event?.status,
      finished_at: event?.finished_at,
      event: event
    });
  
    if (event?.status === "active" && event?.finished_at) {
      const updateTimer = () => {
        // UTC 시간으로 통일
        const finishTime = new Date(event.finished_at! + 'Z').getTime(); // Z 추가로 UTC 명시
        const now = Date.now(); // 현재 시간
        const remaining = Math.max(0, Math.ceil((finishTime - now) / 1000)); // ceil로 변경
  
        console.log("Timer update:", { 
          finishTime, 
          now, 
          remaining,
          finishDate: new Date(finishTime).toISOString(),
          nowDate: new Date(now).toISOString()
        });
        
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
      <p>
        현재 상태: <span className="font-bold">{event?.status || 'loading...'}</span>
      </p>
      {event?.status === "active" && timeRemaining > 0 && (
        <p>
          남은 시간:{" "}
          <span className="font-bold text-red-500">{timeRemaining}초</span>
        </p>
      )}
      {event?.status === "finished" && (
        <p className="text-red-500 font-bold">이벤트가 종료되었습니다!</p>
      )}
    </div>
  );
}