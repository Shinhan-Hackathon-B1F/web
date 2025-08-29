"use client";
import { useRouter } from 'next/navigation';

export default function CheerEvent() {
  const router = useRouter();

  const handlePlayClick = () => {
    router.push('/team-select');
  };

  return (
    <div className="max-w-sm mx-auto flex flex-col text-white">
      {/* Header */}
      <div className="text-center px-6 mt-16">
        <div className="text-lg font-bold mb-2">프로 야구 응원 이벤트</div>
        <h1 className="text-3xl font-black mb-4">응원지수를 높여라</h1>
        <p className="text-sm opacity-90 leading-relaxed">
          뜨거운 응원으로 팀 포텐셜 터뜨리고
          <br />
          푸짐한 경품받아가자!
        </p>
      </div>

      {/* Rewards Section */}
      <div className="bg-white/10 flex flex-col items-center justify-center w-fit p-10 my-12 mx-auto space-y-10 rounded-md">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-white rounded-lg"></div>
        </div>
        <div className="text-center">
          <div className="font-semibold">
            두산베어스 유니폼 <span className="opacity-75">(각 3명)</span>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-white rounded-lg"></div>
        </div>
        <div className="text-center">
          <div className="font-semibold">
            카스 프레시 500ml <span className="opacity-75">(20명)</span>
          </div>
        </div>
      </div>

      {/* Play Button */}
      <div className="p-6 pb-16">
        <button
          onClick={handlePlayClick}
          className="w-full bg-white text-black font-black text-xl py-4 rounded-2xl"
        >
          PLAY
        </button>
      </div>
    </div>
  );
}
