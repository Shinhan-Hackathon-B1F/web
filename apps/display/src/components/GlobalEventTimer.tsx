// components/GlobalEventTimer.tsx
"use client";

import { useEffect } from "react";
import { createClient } from "../../../../shared/utils/supabase/client";
import { Event } from "../../../../shared/types";

export function GlobalEventTimer() {
  const supabase = createClient();

  useEffect(() => {
    let selectingTimer: NodeJS.Timeout | null = null;
    let finishedTimer: NodeJS.Timeout | null = null;

    console.log("🔄 GlobalEventTimer: 초기화됨");

    const channel = supabase
      .channel("global-event-timer")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "events",
          filter: "id=eq.1" // 이벤트 ID가 1인 것만 감지
        },
        (payload) => {
          const eventData = payload.new as Event;
          
          console.log("🎯 GlobalEventTimer: 이벤트 상태 변화 감지", {
            status: eventData.status,
            started_at: eventData.started_at
          });
          
          // 이벤트가 selecting으로 변경되었을 때만 타이머 설정
          if (eventData.status === "selecting" && eventData.started_at) {
            console.log("⏰ GlobalEventTimer: selecting 상태 감지, 타이머 설정 시작");
            
            // 기존 타이머들 정리 (중복 방지)
            if (selectingTimer) {
              clearTimeout(selectingTimer);
              console.log("🧹 기존 selecting 타이머 정리");
            }
            if (finishedTimer) {
              clearTimeout(finishedTimer);
              console.log("🧹 기존 finished 타이머 정리");
            }
            
            const startTime = new Date(eventData.started_at).getTime();
            const now = new Date().getTime();
            const elapsed = now - startTime; // 이미 경과된 시간
            
            const selectingDuration = 41000; // 41초
            const totalDuration = 62000; // 62초
            
            console.log("📊 시간 계산:", {
              elapsed: elapsed + "ms",
              selectingDuration: selectingDuration + "ms",
              totalDuration: totalDuration + "ms"
            });
            
            // 41초 후 active 상태로 변경 (이미 경과된 시간 고려)
            const remainingToActive = Math.max(0, selectingDuration - elapsed);
            if (remainingToActive > 0) {
              console.log(`⏳ ${remainingToActive}ms 후 active로 변경 예약`);
              
              selectingTimer = setTimeout(async () => {
                try {
                  const { error } = await supabase
                    .from("events")
                    .update({ status: "active" })
                    .eq("id", 1);
                    
                  if (error) {
                    console.error("❌ Active 상태 변경 오류:", error);
                  } else {
                    console.log("✅ GlobalEventTimer: active 상태로 변경 완료");
                  }
                } catch (err) {
                  console.error("❌ Active 상태 변경 예외:", err);
                }
              }, remainingToActive);
            } else {
              console.log("⚡ 이미 시간이 지나서 즉시 active로 변경");
              // 이미 21초가 지났다면 즉시 active로 변경
              supabase.from("events").update({ status: "active" }).eq("id", 1);
            }
            
            // 32초 후 finished 상태로 변경 (이미 경과된 시간 고려)
            const remainingToFinished = Math.max(0, totalDuration - elapsed);
            if (remainingToFinished > 0) {
              console.log(`⏳ ${remainingToFinished}ms 후 finished로 변경 예약`);
              
              finishedTimer = setTimeout(async () => {
                try {
                  const { error } = await supabase
                    .from("events")
                    .update({ status: "finished" })
                    .eq("id", 1);
                    
                  if (error) {
                    console.error("❌ Finished 상태 변경 오류:", error);
                  } else {
                    console.log("✅ GlobalEventTimer: finished 상태로 변경 완료");
                  }
                } catch (err) {
                  console.error("❌ Finished 상태 변경 예외:", err);
                }
              }, remainingToFinished);
            } else {
              console.log("⚡ 이미 시간이 지나서 즉시 finished로 변경");
              // 이미 62초가 지났다면 즉시 finished로 변경
              supabase.from("events").update({ status: "finished" }).eq("id", 1);
            }
          }
          
          // 다른 상태 변경도 로깅
          if (eventData.status === "active") {
            console.log("🎉 GlobalEventTimer: active 상태 확인됨");
          } else if (eventData.status === "finished") {
            console.log("🏁 GlobalEventTimer: finished 상태 확인됨, 타이머 정리");
            if (selectingTimer) clearTimeout(selectingTimer);
            if (finishedTimer) clearTimeout(finishedTimer);
          }
        }
      )
      .subscribe();

    console.log("👂 GlobalEventTimer: 이벤트 구독 시작됨");

    // 컴포넌트 언마운트 시 정리
    return () => {
      console.log("🧹 GlobalEventTimer: 정리 시작");
      if (selectingTimer) {
        clearTimeout(selectingTimer);
        console.log("🧹 selecting 타이머 정리됨");
      }
      if (finishedTimer) {
        clearTimeout(finishedTimer);
        console.log("🧹 finished 타이머 정리됨");
      }
      supabase.removeChannel(channel);
      console.log("🧹 GlobalEventTimer: 채널 구독 해제됨");
    };
  }, []);

  // UI 없음, 백그라운드 타이머만
  return null;
}