"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CheerEvent() {
  const router = useRouter();

  const handlePlayClick = () => {
    router.push("/team-select");
  };

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col text-white">
      {/* Header */}
      <div className="text-center px-6 mt-16">
        <div className="text-lg font-bold mb-2">프로 야구 응원 이벤트</div>
        <h1 className="font-kbo text-4xl font-bold mb-4">응원지수를 높여라</h1>
        <p className="font-pretendard text-[16px] leading-relaxed text-white/80">
          뜨거운 응원으로{" "}
          <span className="font-bold text-white">카스 프레시</span> 터뜨리고
          <br />
          푸짐한 경품받아가자!
        </p>
      </div>

      {/* Rewards Section */}
      <div className="bg-white/10 flex flex-col items-center justify-center w-fit p-10 my-5 mx-auto space-y-10 rounded-md">
        <div className="relative justify-center mb-4">
          <div className="relative justify-center mx-auto mb-4">
            <Image
              src="/assets/Frame 5403.png"
              alt="프레임"
              width={160}
              height={90}
              priority={true}
              className="object-contain"
            />
          </div>
        </div>
        <div className="text-center">
          <div className="font-pretendard font-semibold text-sm">
            SSG/두산 유니폼{" "}
            <span className="font-medium text-white/60">(각 3명)</span>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <div className="relative justify-center w-[160px] h-[90px] mx-auto mb-4">
            <Image
              src="/assets/image 155.png"
              alt="프레임"
              fill
              unoptimized={true}
              priority={true}
              className="object-contain"
              style={{ 
                imageRendering: "crisp-edges",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
        </div>
        <div className="text-center">
          <div className="font-pretendard font-semibold text-sm">
            카스 프레시 500ml{" "}
            <span className="font-medium text-white/60">(20명)</span>
          </div>
        </div>
      </div>

      {/* Play Button */}
      <div className="fixed bottom-4 left-0 right-0 m-5 mb-8">
        <button
          onClick={handlePlayClick}
          className="w-full bg-white text-black font-pretendard font-black text-2xl py-4 rounded-2xl"
        >
          PLAY
        </button>
      </div>
    </div>
  );
}
