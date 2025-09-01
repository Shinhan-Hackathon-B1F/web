"use client";

export default function WinnerForm() {
  return (
    <div className="min-h-screen bg-blue-600">
      {/* Header Section */}
      <div className="px-6 pt-12 pb-8">
        <h1 className="text-white text-xl font-semibold">경품 응모를 위해</h1>
        <h2 className="text-white text-xl font-semibold">
          성함과 연락처를 적어주세요
        </h2>
        <p className="text-white text-md opacity-90">
          연락처를 통해 당첨 결과와 기프티콘을 보내드립니다
        </p>
      </div>

      {/* Prize Section */}
      <div className="mx-6 mb-8">
        <div className="bg-blue-500/10 rounded-2xl p-6">
          <div className="flex justify-around items-center">
            {/* Prize 1 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-white rounded-lg mb-4 flex items-center justify-center">
                <div className="text-xs text-gray-500">유니폼 이미지</div>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">
                SSGor두산 유니폼
              </h3>
              <p className="text-white opacity-80">(3명)</p>
            </div>

            {/* Prize 2 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-white rounded-lg mb-4 flex items-center justify-center">
                <div className="text-xs text-gray-500">음료 이미지</div>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">
                카스 프레시 500ml
              </h3>
              <p className="text-white opacity-80">(20명)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white px-6 py-8 min-h-96">
        <div className="space-y-6">
          {/* Name Input */}
          <div>
            <div className="block text-black text-lg font-medium mb-3">
              이름 *
            </div>
            <input
              type="text"
              placeholder="김치즈"
              className="w-full px-4 py-4 bg-gray-50 rounded-2xl text-lg border-none outline-none focus:bg-gray-100"
            />
          </div>

          {/* Phone Input */}
          <div>
            <div className="block text-black text-lg font-medium mb-3">
              연락처 *
            </div>
            <input
              type="tel"
              placeholder="+82) 010-1234-5678"
              className="w-full px-4 py-4 bg-gray-50 rounded-2xl text-lg border-none outline-none focus:bg-gray-100"
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center space-x-3 py-4">
            <input
              type="checkbox"
              id="privacy"
              className="w-5 h-5 rounded border-gray-300"
            />
            <div className="text-gray-700 text-base">
              개인정보 수집/이용 동의
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-medium hover:bg-gray-800 transition-colors"
            onClick={() => alert("응모 완료!")}
          >
            경품 응모하기
          </button>
        </div>
      </div>
    </div>
  );
}
