"use client";

import { createClient } from "../../../../shared/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Event } from "../../../../shared/types";

export default function Display() {
  const supabase = createClient();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

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
          if (payload.new) {
            setEvent(payload.new as Event);
          }

          if (
            payload.new &&
            "status" in payload.new &&
            payload.new.status === "active"
          ) {
            router.push("/count");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

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
          Math.ceil((finishTime - now) / 1000 - 11)
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

  return (
    <div className="h-screen bg-gradient-to-r from-[#00226B] to-[#001AC3] text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full opacity-10"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-white rounded-full opacity-10"></div>
      </div>

      {/* Timer */}

      <div className="absolute top-8 right-8 xl:top-24 xl:right-24 flex gap-2 z-50">
        <div className="bg-[#121212] p-6 rounded-2xl">
          <div className="relative inline-block">
            <h1 className="font-digit text-6xl tracking-[-4.5%] text-gray-800">00</h1>
            <span className="absolute top-0 right-0 font-digit text-6xl tracking-[-4.5%]">
            {formatTime(timeRemaining)}
            </span>
          </div>
          
          <span className="font-pretendard font-semibold text-4xl ml-1 relative top-1">초</span>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 min-h-screen flex flex-col justify-center items-center">
        <div className="relative w-[429px] h-[48px] xl:w-[715px] xl:h-[80px] mx-auto mb-4">
          <Image
            src="/assets/Frame 5408.png"
            alt="프레임"
            fill
            priority={true}
            className="object-contain"
          />
        </div>

        {/* Main title */}
        <div className="text-center my-5">
          <h1 className="text-6xl xl:text-9xl font-kbo font-bold mb-4 leading-tight">
            응원 지수를 높여라
          </h1>
          <p className="font-kbo text-2xl xl:text-5xl text-white/80 mb-2">
            뜨거운 응원으로{" "}
            <strong className="font-bold text-white">카스 프레시</strong>{" "}
            터뜨리고
          </p>
          <p className="font-kbo text-2xl xl:text-5xl text-white/80">
            푸짐한 경품받아가자!
          </p>
        </div>

        {/* Prize section - center */}
        <div className="text-center my-4">
          <div className="bg-white/10 bg-opacity-50 px-[100px] py-[60px] rounded-lg inline-block">
            <div className="flex gap-4 justify-center mb-4">
              <div className="relative w-[192px] h-[98px] xl:w-[320px] xl:h-[162px] mx-auto mb-4">
                <Image
                  src="/assets/Frame 5403.svg"
                  alt="유니폼"
                  fill
                  priority={true}
                  className="object-contain"
                />
              </div>
            </div>
            <p className="font-pretendard font-semibold text-xl">
              SSG/두산 유니폼{" "}
              <strong className="font-medium text-white/60">(각 3명)</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-[-50px] flex">
        <div className="relative w-[400px] h-[350px] xl:w-[768px] xl:h-[624px]">
          <Image
            src="/assets/Group 163.svg"
            alt="qr"
            fill
            priority={true}
            className="object-contain"
          />
        </div>
      </div>

      <div className="absolute bottom-0 right-[-20px] flex">
        <div className="relative w-[500px] h-[400px] xl:w-[1058px] xl:h-[809px]">
          <Image
            src="/assets/Group 164.svg"
            alt="cass"
            fill
            priority={true}
            className="object-contain"
          />
        </div>
      </div>

      <div className="absolute top-0 left-[-40px] flex">
        <div className="relative w-[200px] h-[200px] xl:w-[325px] xl:h-[450px]">
          <Image
            src="/assets/왼쪽 상단.svg"
            alt="cass"
            fill
            priority={true}
            className="object-contain"
          />
        </div>
      </div>

      <div className="absolute top-[-42px] right-[-5px] flex z-0">
        <div className="relative w-[400px] h-[200px] xl:w-[832px] xl:h-[350px] ">
          <Image
            src="/assets/오른쪽 상단.svg"
            alt="cass"
            fill
            priority={true}
            style={{ objectFit: "contain", objectPosition: "left top" }}
          />
        </div>
      </div>
    </div>
  );
}
