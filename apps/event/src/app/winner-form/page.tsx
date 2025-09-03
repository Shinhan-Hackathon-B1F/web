"use client";

import Image from "next/image";

export default function WinnerForm() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0061C3] to-[#0036A2]">
      {/* Header Section */}
      <div className="text-white px-6 pt-12 pb-8">
        <h1 className="text-[22px] font-pretendard font-semibold">
          경품 응모를 위해
        </h1>
        <h2 className="text-[22px] font-pretendard font-semibold">
          성함과 연락처를 적어주세요
        </h2>
        <p className="text-white font-pretendard text-[15px] opacity-90 mt-2">
          연락처를 통해 당첨 결과와 기프티콘을 보내드립니다
        </p>
      </div>

      {/* Prize Section */}
      <div className="text-white mx-6 mb-8">
        <div className="bg-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center">
            {/* Prize 1 */}
            <div className="text-center">
              <div className="mb-4 flex items-center justify-center">
                <Image
                  src="/assets/form/Frame 5403.svg"
                  alt="프레임"
                  width={134}
                  height={87}
                  priority={true}
                  className="object-contain"
                />
              </div>
              <h3 className="font-pretendard text-[15px]">
                SSGor두산 유니폼
                <p className="text-white/60 mt-0.5">(3명)</p>
              </h3>
            </div>

            {/* Prize 2 */}
            <div className="text-center">
              <div className="mb-4 flex items-center justify-center">
                <Image
                  src="/assets/form/Group 165.svg"
                  alt="프레임"
                  width={87}
                  height={90}
                  priority={true}
                  className="object-contain"
                />
              </div>
              <h3 className="font-pretendard text-[15px]">
                카스 프레시 500ml
                <p className="text-white/60 mt-0.5">(20명)</p>
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white px-6 py-8 min-h-96">
        <div className="space-y-6">
          {/* Name Input */}
          <div>
            <div className="block font-pretendard font-semibold text-black text-[16px] mb-3">
              이름 *
            </div>
            <input
              type="text"
              placeholder="김치즈"
              className="w-full px-4 py-4 bg-gray-50 rounded-2xl text-lg border-none outline-none focus:text-black"
            />
          </div>

          {/* Phone Input */}
          <div>
            <div className="block font-pretendard font-semibold text-black text-[16px] mb-3">
              연락처 *
            </div>
            <input
              type="tel"
              placeholder="+82) 010-1234-5678"
              className="w-full px-4 py-4 bg-gray-50 rounded-2xl text-lg border-none outline-none focus:text-black"
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="privacy"
              className="w-5 h-5 rounded border-gray-300"
            />
            <div className="text-black font-medium text-[16px] text-base">
              개인정보 수집/이용 동의
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="fixed bottom-4 left-0 right-0 m-5 mb-8 bg-black text-white py-4 rounded-2xl text-[18px] font-pretendard font-semibold"
            onClick={() => alert("응모 완료!")}
          >
            경품 응모하기
          </button>
        </div>
      </div>
    </div>
  );
}
