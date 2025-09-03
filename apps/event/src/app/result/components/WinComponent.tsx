"use client";
import Image from "next/image";
import Link from "next/link";

interface WinComponentProps {
  teamId: number | null;
  myScore: number | null;
  teamScore: number | null;
}

export default function WinComponent({
  teamId,
  myScore,
  teamScore,
}: WinComponentProps) {
  const handleFormAccess = () => {
    sessionStorage.setItem("winner_verified", "true");
  };

  return (
    <div className="max-w-screen min-h-screen flex flex-col text-white bg-gradient-to-b from-[#0061C3] to-[#0036A2]">
      <div className="text-center pt-16 pb-7">
        <h1 className="absolute right-[20px] top-[16px] font-kbo text-[16px] font-bold">
          응원지수를 높여라
        </h1>
      </div>

      <div className="mix-blend-hard-light">
        <Image
          src={
            teamId === 1
              ? "/assets/result/result ssg.svg"
              : "/assets/result/result doosan.svg"
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
            teamId === 1
              ? "/assets/result/ssg win.svg"
              : "/assets/result/doosan win.svg"
          }
          alt="프레임"
          width={296}
          height={58}
          priority={true}
          style={{ objectFit: "contain", objectPosition: "left top" }}
        />
      </div>

      <div className="bg-black h-[248px] p-3 mx-5 rounded-2xl">
        <video
          className="w-full h-full object-cover z-0 rounded-2xl"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/assets/result/응원지수_승리.mp4" type="video/mp4" />
        </video>
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

      <div className="fixed bottom-4 left-0 right-0 m-5 mb-8 h-[58px]">
        <Link href="/winner-form" onClick={handleFormAccess}>
          <button className="w-full h-full text-center bg-white text-gray-900 rounded-2xl font-pretendard font-semibold">
            경품 응모하기
          </button>
        </Link>
      </div>
    </div>
  );
}
