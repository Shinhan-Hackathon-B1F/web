"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../../../shared/utils/supabase/client";
import { getUserId } from "@/utils/userIdentifier";
import { Event } from "../../../../../shared/types";
import Image from "next/image";
import Dimmed from "./components/dimmed";

export default function TeamSelect() {
  const router = useRouter();
  const supabase = createClient();
  const [selectedTeam, setSelectedTeam] = useState("");

  const [event, setEvent] = useState<Event | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(-1);

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

    if ((event?.status === "selecting" || event?.status === "active") && event?.finished_at) {
      const updateTimer = () => {
        const finishTime = new Date(event.finished_at!).getTime();
        const now = new Date().getTime();
        console.log(finishTime, now);
        const remaining = Math.max(
          0,
          Math.ceil((finishTime - now) / 1000 - 12)
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
      {event?.status === "selecting" && timeRemaining % 60 <= 3 && timeRemaining % 60 >= 0 && (
        <Dimmed text={formatTime(timeRemaining)}></Dimmed>
      )}

      {/* Header */}
      <div className="text-center pt-16 pb-24">
        <h1 className="absolute right-[20px] top-[16px] font-kbo text-[16px] font-bold">
          응원지수를 높여라
        </h1>
      </div>

      {/* Instruction */}
      <div className="text-center mb-30 w-70 self-center">
        <div className="bg-black/40 rounded-2xl px-6 py-4">
          <p className="font-kbo text-xl font-medium">
            응원하는 팀을 선택해주세요
          </p>
        </div>
      </div>

      {/* Team Selection Cards */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-white to-white/0 rounded-t-3xl shadow-inner border-2">
        <div className="bg-white/80 p-5 rounded-t-3xl">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => handleTeamSelect("1")}
              className={`relative rounded-2xl bg-gradient-to-b from-white to-[#ECF7FF] flex items-center justify-center aspect-square shadow-[inset_0_0_4px_#012DB229] drop-shadow-[0_0_8px_#425AA666] ${
                selectedTeam === "1"
                  ? "drop-shadow-[0_0_8px_rgb(30_64_175)]"
                  : ""
              }`}
            >
              <Image
                src={`/assets/buttons/team=SSG, state=${
                  selectedTeam === "1" ? "focus" : "non"
                }.png`}
                alt="프레임"
                width={120}
                height={120}
                priority={true}
                className="object-contain"
              />
            </button>

            <button
              onClick={() => handleTeamSelect("2")}
              className={`relative rounded-2xl bg-gradient-to-b from-white to-[#ECF7FF] flex items-center justify-center aspect-square shadow-[inset_0_0_4px_#012DB229] drop-shadow-[0_0_8px_#425AA666] ${
                selectedTeam === "2"
                  ? "drop-shadow-[0_0_8px_rgb(30_64_175)]"
                  : ""
              }`}
            >
              <Image
                src={`/assets/buttons/team=두산, state=${
                  selectedTeam === "2" ? "focus" : "non"
                }.png`}
                alt="프레임"
                width={120}
                height={120}
                priority={true}
                className="object-contain"
              />
            </button>
          </div>

          {/* Play Button */}
          <div className="pb-8">
            <button
              disabled={event?.status !== "active"}
              onClick={event?.status === "active" ? handlePlayClick : undefined}
              className={`w-full py-4 rounded-2xl font-pretendard font-black text-2xl transition-colors
              ${
                event?.status === "active"
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-[#D1D1D1] text-gray-400 cursor-not-allowed font-semibold text-lg"
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
    </div>
  );
}
