// hooks/useEventStart.ts (간소화된 버전)
"use client";

import { useState } from "react";
import { createClient } from "../../../../shared/utils/supabase/client";

export const useEventStart = () => {
  const supabase = createClient();
  const [isStarting, setIsStarting] = useState(false);

  const startEvent = async () => {
    if (isStarting) return;
    
    setIsStarting(true);
    
    try {
      const selectingDuration = 41000; // 41초
      const activeDuration = 21000; // 21초
      const totalDuration = selectingDuration + activeDuration; // 62초

      const now = new Date();
      const finishedAt = new Date(now.getTime() + totalDuration);
      
      // 이벤트 시작 - selecting 상태로 변경만 함
      // 나머지는 GlobalEventTimer에서 자동 처리
      const { error } = await supabase
        .from("events")
        .update({
          status: "selecting",
          started_at: now.toISOString(),
          finished_at: finishedAt.toISOString(),
        })
        .eq("id", 1);

      if (error) throw error;

      console.log("🚀 useEventStart: 이벤트 시작 - selecting 상태로 변경");
      console.log("⏰ GlobalEventTimer가 자동으로 타이머를 관리합니다");

      // 62초 후 UI 상태만 해제 (실제 이벤트는 GlobalEventTimer에서 관리)
      setTimeout(() => {
        setIsStarting(false);
      }, totalDuration);

    } catch (error) {
      console.error("❌ useEventStart: 이벤트 시작 오류:", error);
      setIsStarting(false);
      throw error;
    }
  };

  return { startEvent, isStarting };
};