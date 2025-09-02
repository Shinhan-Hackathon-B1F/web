"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../../../shared/utils/supabase/client";
import { getUserId } from "@/utils/userIdentifier";
import { Event } from "../../../../../shared/types";

export default function TeamSelect() {
  const router = useRouter();
  const supabase = createClient();
  const [selectedTeam, setSelectedTeam] = useState("");

  const [event, setEvent] = useState<Event | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // 컴포넌트 마운트 시 이벤트 데이터 가져오기
  useEffect(() => {
    fetchEventData();
  }, []);

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
          if (
            payload.new &&
            "status" in payload.new &&
            payload.new.status === "active"
          ) {
            if (selectedTeam) {
              goToGame(selectedTeam);
            }
          }
          // 이벤트 데이터가 업데이트되면 상태도 업데이트
          if (payload.new) {
            setEvent(payload.new as Event);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, selectedTeam, supabase]);

  // 남은 시간 계산 타이머
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (event?.status === "selecting" && event?.finished_at) {
      const updateTimer = () => {
        const finishTime = new Date(event.finished_at!).getTime();
        const now = new Date().getTime();
        console.log(finishTime, now);
        const remaining = Math.max(
          0,
          Math.ceil((finishTime - now) / 1000 - 10)
        );

        console.log(remaining);

        setTimeRemaining(remaining);

        // 시간이 끝나면 타이머 정리
        if (remaining <= 0 && timer) {
          clearInterval(timer);
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
  }, [event?.status, event?.finished_at]);

  // 시간을 포맷팅하는 함수
  const formatTime = (seconds: number) => {
    const remainingSeconds = seconds % 60;
    return `${remainingSeconds.toString()}`;
  };

  const joinTeam = async (teamId: string, sessionId: string) => {
    const { data: existingParticipant } = await supabase
      .from("participants")
      .select("id")
      .eq("session_id", sessionId)
      .eq("event_id", 1)
      .single();

    if (existingParticipant) {
      console.log("이미 참가한 사용자입니다.");
      return;
    }

    // 새 참가자 등록
    const { error } = await supabase.from("participants").insert({
      event_id: 1,
      team_id: teamId,
      session_id: sessionId,
    });

    if (error) {
      console.error("참가 등록 에러:", error);
    } else {
      console.log(`팀 ${teamId}에 참가 완료!`);
    }
  };

  const fetchEventData = async () => {
    try {
      const { data: eventData, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("이벤트 데이터 가져오기 에러:", error);
        return;
      }

      console.log("가져온 이벤트 데이터:", eventData);
      setEvent(eventData);
    } catch (error) {
      console.error("fetchEventData 에러:", error);
    }
  };

  const goToGame = (teamid: string) => {
    joinTeam(selectedTeam, getUserId());
    router.push(`/game/${teamid}`);
  };

  const handleTeamSelect = (team: string) => {
    setSelectedTeam(team);
  };

  const handlePlayClick = () => {
    if (selectedTeam) {
      goToGame(selectedTeam);
    } else {
      alert("팀을 선택해주세요");
    }
  };

  return (
    <div className="max-w-screen mx-auto min-h-screen flex flex-col text-white">
      {/* Header */}
      <div className="text-center pt-16 pb-32">
        {/* 타이머 표시 */}
        {event?.status === "selecting" && timeRemaining > 0 && (
          <div className="mt-4">
            <div className="bg-red-600 bg-opacity-90 rounded-xl px-4 py-2 inline-block">
              <p className="text-sm font-medium">남은 시간</p>
              <p className="text-2xl font-bold">{formatTime(timeRemaining)}</p>
            </div>
          </div>
        )}

        <h1 className="absolute right-[20px] top-[16px] font-kbo text-[16px] font-bold">
          응원지수를 높여라
        </h1>
      </div>

      {/* Instruction */}
      <div className="text-center mb-32">
        <div className="bg-blue-900 bg-opacity-80 rounded-2xl px-8 py-4 mx-6">
          <p className="text-lg font-medium">응원하는 팀을 선택해주세요</p>
        </div>
      </div>

      {/* Team Selection Cards */}
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-20 rounded-t-3xl p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => handleTeamSelect("1")}
            className={`bg-white rounded-2xl p-8 transition-all ${
              selectedTeam === "1" ? "ring-4 ring-yellow-400" : ""
            }`}
          >
            <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
              <span className="text-sm text-gray-600">Bears Logo</span>
            </div>
          </button>

          <button
            onClick={() => handleTeamSelect("2")}
            className={`bg-white rounded-2xl p-8 transition-all ${
              selectedTeam === "2" ? "ring-4 ring-yellow-400" : ""
            }`}
          >
            <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
              <span className="text-sm text-gray-600">Giants Logo</span>
            </div>
          </button>
        </div>

        {/* Play Button */}
        <div className="p-6 pb-8">
          <button
            disabled={event?.status !== "active"}
            onClick={event?.status === "active" ? handlePlayClick : undefined}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors
              ${
                event?.status === "active"
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }
  `}
          >
            {event?.status === "selecting" && timeRemaining >= 0
              ? `${formatTime(timeRemaining)}초 후에 시작됩니다`
              : event?.status === "active"
              ? "참여하기"
              : "게임 시간이 아닙니다"}
          </button>
        </div>
      </div>
    </div>
  );
}
