"use client";

import { createClient } from "../../../../shared/utils/supabase/client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Display() {
  const supabase = createClient();
  const router = useRouter();

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

  return (
    <div className="h-screen bg-gradient-to-r from-[#00226B] to-[#001AC3] text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full opacity-10"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-white rounded-full opacity-10"></div>
      </div>

      {/* Timer */}
      <div className="absolute top-8 right-8 xl:top-24 xl:right-24 flex gap-2">
        <div className="bg-black bg-opacity-70 px-4 py-2 rounded-lg">
          <span className="text-2xl font-bold">120</span>
          <span className="text-sm ml-1">초</span>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 min-h-screen flex flex-col justify-center items-center">
        <div className="relative w-[429px] h-[48px] xl:w-[715px] xl:h-[80px] mx-auto mb-4">
          <Image
            src="/assets/Frame 5408.svg"
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
        {/* QR Code - left bottom */}
        <div className="relative w-[768px] h-[624px]">
          <Image
            src="/assets/Group 163.svg"
            alt="qr"
            fill
            priority={true}
            className="object-contain"
          />
        </div>
      </div>

      {/* Cans decoration - fixed to bottom right */}
      <div className="absolute bottom-0 right-[-20px] flex">
        {/* QR Code - left bottom */}
        <div className="relative w-[1058px] h-[809px]">
          <Image
            src="/assets/Group 164.svg"
            alt="cass"
            fill
            priority={true}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
