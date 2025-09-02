"use client";
import { useEffect, useState } from "react";
import { getUserId } from "@/utils/userIdentifier";
import { createClient } from "../../../../../../shared/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Event } from "../../../../../../shared/types";
import Dimmed from "@/app/team-select/components/dimmed";
import Image from "next/image";

export default function Game({
  params,
}: {
  params: Promise<{ teamid: number }>;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [gameData, setGameData] = useState({
    teamid: null as number | null,
    userId: null as string | null,
    loading: true,
  });

  const [event, setEvent] = useState<Event | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(-1);

  useEffect(() => {
    fetchEventData();
  }, []);

  useEffect(() => {
    const initGame = async () => {
      const { teamid } = await params;
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

  // 이벤트 데이터 가져오기
  const fetchEventData = async () => {
    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .eq("id", 1)
      .single();

    setEvent(eventData);
  };

  // 실시간 이벤트 구독
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

          // 이벤트 데이터 업데이트
          if (payload.new) {
            setEvent(payload.new as Event);
          }

          // 이벤트 종료시 결과 페이지로 이동
          if (
            payload.new &&
            "status" in payload.new &&
            payload.new.status === "finished"
          ) {
            checkWinnerAndRedirect();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router, params]);

  const checkWinnerAndRedirect = async () => {
    const { teamid } = await params;

    const { data } = await supabase
      .from("team_stats_view")
      .select("cheer_average")
      .eq("id", teamid)
      .single();

    const { data: maxAverage } = await supabase
      .from("team_stats_view")
      .select("cheer_average")
      .order("cheer_average", { ascending: false })
      .limit(1)
      .single();

    const isWin = data?.cheer_average >= maxAverage?.cheer_average;

    sessionStorage.setItem(
      "gameResult",
      JSON.stringify({
        outcome: isWin ? "win" : "lose",
        timestamp: Date.now(),
      })
    );
    router.push("/result");
  };

  // 남은 시간 계산 타이머
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (
      (event?.status === "active" || event?.status === "finished") &&
      event?.finished_at
    ) {
      const updateTimer = () => {
        const finishTime = new Date(event.finished_at!).getTime();
        const now = new Date().getTime();
        const remaining = Math.max(0, Math.ceil((finishTime - now) / 1000 - 1));

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

  const cheerForTeam = async (teamId: number | null) => {
    const sessionId = getUserId();

    if (teamId != null) {
      const { error } = await supabase.from("user_cheers").insert({
        session_id: sessionId,
        team_id: teamId,
        event_id: 1,
      });

      if (error) {
        console.error("응원 에러:", error);
      }
    }
  };

  if (gameData.loading) return <div>Loading...</div>;

  const isGameActive = event?.status === "active";

  return (
    <div className="max-w-screen min-h-screen flex flex-col text-white">
      {event?.status === "active" && timeRemaining % 60 === 0 && (
        <Dimmed text="stop"></Dimmed>
      )}

      {/* Header */}
      <div className="text-center pt-16 pb-7">
        <h1 className="absolute right-[20px] top-[16px] font-kbo text-[16px] font-bold">
          응원지수를 높여라
        </h1>
      </div>
      <p className="text-center font-kbo font-medium text-xl mb-7">
        화면을 빠르게 터치해주세요
      </p>

      <div className="grid grid-cols-2 mx-5 gap-3">
        <div>
          <div className="bg-[#121212] p-6 rounded-2xl text-center">
            <div className="relative inline-block">
              <h1 className="font-digit text-5xl tracking-[-4.5%] text-gray-800">
                00
              </h1>
              <span className="absolute top-0 right-0 font-digit text-5xl tracking-[-4.5%]">
                {timeRemaining}
              </span>
            </div>
          </div>
          <p className="text-center mt-2 font-pretendard text-[16px]">
            남은 시간
          </p>
        </div>

        <div>
          <div className="bg-[#121212] p-6 rounded-2xl text-center ">
            <div className="relative inline-block">
              <h1 className="font-digit text-5xl tracking-[-4.5%] text-gray-800">
                000
              </h1>
              <span className="absolute top-0 right-0 font-digit text-5xl tracking-[-4.5%]">
                {timeRemaining}
              </span>
            </div>
          </div>
          <p className="text-center mt-2 font-pretendard text-[16px]">
            나의 응원 지수
          </p>
        </div>
      </div>

      <button
        onClick={() => cheerForTeam(gameData.teamid)}
        className="fixed bottom-7 left-1/2 transform -translate-x-1/2 flex items-center justify-center aspect-square w-[260px] h-[408px] z-50"
      >
        <Image
          src={`/assets/teambutton/${
            gameData.teamid == 1 ? "ssg normal" : "doosan normal"
          }.svg`}
          alt="프레임"
          fill
          priority={true}
          className="object-contain transform transition-all duration-200 ease-out active:scale-110 active:duration-75"
        />
      </button>
    </div>
  );
}
