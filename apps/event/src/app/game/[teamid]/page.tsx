"use client";
import { useEffect, useState } from "react";
import { getUserId } from "@/utils/userIdentifier";
import { createClient } from "../../../../../../shared/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Event } from "../../../../../../shared/types"

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
  const [timeRemaining, setTimeRemaining] = useState(0);

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
      
      // 초기 이벤트 데이터 로딩
      await fetchEventData();
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

    console.log(eventData)

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
            checkWinnerAndRedirect()
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
      .from('team_stats_view')
      .select('cheer_average')
      .eq('id', teamid)
      .single();
  
    const { data: maxAverage } = await supabase
      .from('team_stats_view')
      .select('cheer_average')
      .order('cheer_average', { ascending: false })
      .limit(1)
      .single();
  
    if (data?.cheer_average >= maxAverage?.cheer_average) {
      router.push('/result-win');
    } else {
      router.push('/result-lose');
    }
  };

  // 남은 시간 계산 타이머
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (event?.status === "active" && event?.finished_at) {
      const updateTimer = () => {
        const finishTime = new Date(event.finished_at!).getTime();
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((finishTime - now) / 1000));
        
        console.log(remaining)

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
    <div>
      <h1>Game Page</h1>
      <p>Team ID: {gameData.teamid}</p>
      <p>User ID: {gameData.userId}</p>
      <p>남은 시간: {timeRemaining}초</p>
      <p>게임 상태: {event?.status || 'loading...'}</p>
      
      <button
        className={`
          bg-blue-600 rounded-2xl p-8 transition-all text-white font-bold text-xl
          ${!isGameActive ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:scale-95'}
          ${timeRemaining <= 0 ? 'bg-gray-400' : ''}
        `}
        onClick={() => cheerForTeam(gameData.teamid)}
        disabled={!isGameActive || timeRemaining <= 0}
      >
        {!isGameActive ? '게임 대기 중...' : 
         timeRemaining <= 0 ? '게임 종료!' : 
         '응원하기! 🎉'}
      </button>
      
      {/* 디버깅 정보 */}
      <div className="mt-4 text-sm text-gray-500">
        <p>Event: {JSON.stringify(event)}</p>
      </div>
    </div>
  );
}