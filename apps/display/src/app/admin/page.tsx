"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../../shared/utils/supabase/client";
import { Event, Team } from "../../../../../shared/types";

export default function Admin() {
  const supabase = createClient();

  const [event, setEvent] = useState<Event | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("admin-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams" },
        () => fetchData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

    setEvent(eventData);
    setTeams(teamsData || []);
  };

  const startEvent = async () => {
    const selectingDuration = 41000; // 41초
    const activeDuration = 21000; // 21초
    const totalDuration = selectingDuration + activeDuration; // 62초

    const now = new Date();
    const finishedAt = new Date(now.getTime() + totalDuration);
    const { error } = await supabase
      .from("events")
      .update({
        status: "selecting",
        started_at: now.toISOString(), // UTC 기준
        finished_at: finishedAt.toISOString(), // UTC 기준
      })
      .eq("id", 1);

    if (error) {
      console.error("이벤트 업데이트 오류:", error);
      return;
    }

    // 41초 후 active 상태로 변경
    setTimeout(async () => {
      const { error } = await supabase
        .from("events")
        .update({ status: "active" })
        .eq("id", 1);

      if (error) {
        console.error("선택시간 종료 오류:", error);
      }
    }, selectingDuration);

    // 62초 후 (selecting + active) finished 상태로 변경
    setTimeout(async () => {
      const { error } = await supabase
        .from("events")
        .update({ status: "finished" })
        .eq("id", 1);

      if (error) {
        console.error("이벤트 종료 오류:", error);
      }
    }, totalDuration);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">관리자 페이지</h1>

      <div className="mb-6">
        <p>
          현재 상태: <span className="font-bold">{event?.status}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {teams.map((team) => (
          <div key={team.id} className="border p-4 rounded">
            <h3 style={{ color: team.color }}>{team.name}</h3>
            <p className="text-2xl font-bold">{team.cheer_count}</p>
          </div>
        ))}
      </div>

      <div className="space-x-4">
        <button
          onClick={startEvent}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={event?.status === "active"}
        >
          이벤트 시작
        </button>

        {/*<button 
          onClick={resetEvent}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          초기화
        </button>*/}
      </div>
    </div>
  );
}
