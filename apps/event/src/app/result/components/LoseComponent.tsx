"use client";

import Image from "next/image";
import Link from "next/link";

interface LoseComponentProps {
  teamid: number | null;
  myScore: number | null;
  teamScore: number | null;
}

export default function LoseComponent({
  teamid,
  myScore,
  teamScore,
}: LoseComponentProps) {
  return (
    <div className="max-w-screen min-h-screen flex flex-col text-white bg-gradient-to-b from-[#919EAA] to-[#3A4151]">
      <div className="text-center pt-16 pb-7">
        <h1 className="absolute right-[20px] top-[16px] font-kbo text-[16px] font-bold">
          응원지수를 높여라
        </h1>
      </div>

      <div className="mix-blend-hard-light">
        <Image
          src={
            teamid === 1
              ? "/assets/result/result ssg.png"
              : "/assets/result/result doosan.png"
          }
          alt="프레임"
          width={251}
          height={139}
          priority={true}
          style={{ mixBlendMode: "hard-light" }}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      <div className="-mt-20 ml-12 z-50">
        <Image
          src={
            teamid === 1
              ? "/assets/result/ssg lose.png"
              : "/assets/result/doosan lose.png"
          }
          alt="프레임"
          width={296}
          height={58}
          priority={true}
          style={{ objectFit: "contain", objectPosition: "left top" }}
        />
      </div>

      <div className="bg-black h-[248px] p-3 mx-5 rounded-2xl">
        <Image
          src="/assets/result/응원지수_패배.png"
          alt="프레임"
          width={311}
          height={223}
          priority={true}
          className="w-full h-full object-cover z-0 rounded-2xl"
        />
      </div>

      <div className="grid grid-cols-2 mx-5 my-4 gap-3">
        <div>
          <div className="bg-[#121212] p-6 rounded-2xl text-center">
            <div className="relative inline-block">
              <h1 className="font-digit text-5xl tracking-[-4.5%] text-gray-800">
                000
              </h1>
              <span className="absolute top-0 right-0 font-digit text-5xl tracking-[-4.5%]">
                {myScore}
              </span>
            </div>
          </div>
          <p className="text-center mt-2 font-pretendard text-[16px]">
            나의 응원 지수
          </p>
        </div>

        <div>
          <div className="bg-[#121212] p-6 rounded-2xl text-center ">
            <div className="relative inline-block">
              <h1 className="font-digit text-5xl tracking-[-4.5%] text-gray-800">
                000
              </h1>
              <span className="absolute top-0 right-0 font-digit text-5xl tracking-[-4.5%]">
                {teamScore}
              </span>
            </div>
          </div>
          <p className="text-center mt-2 font-pretendard text-[16px]">
            우리팀 평균 지수
          </p>
        </div>
      </div>

      <div className="fixed bottom-4 left-0 right-0 m-5 mb-8 h-[58px] overflow-visible">
        <Link href="https://merciful-savory-f21.notion.site/B1F-260cc670f01d80f4a290fa43e95942cb?source=copy_link">
          <div className="relative w-full h-full overflow-visible">
            {/* 버튼 배경 */}
            <button className="w-full h-full text-center bg-white text-gray-900 rounded-2xl font-pretendard font-semibold overflow-visible">
              <div className="absolute right-4 top-0 bottom-0 h-[58px] flex justify-center items-center font-pretendard font-semibold text-[18px]">이벤트 더보기
                <div className="ml-1">
                <Image
              src="/assets/result/chevron-right.svg"
              alt="프레임"
              width={24}
              height={24}
              priority={true}
              className="object-contain"
            />
                </div>
              </div>
            </button>

            {/* 이미지를 버튼보다 크게 겹치기 */}
            <Image
              src="/assets/result/이벤트 더보기.png"
              alt="프레임"
              width={189}
              height={127}
              priority={true}
              className="absolute bottom-0 w-auto object-contain z-10"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
