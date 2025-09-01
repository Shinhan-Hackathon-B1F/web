"use client";
import Link from "next/link";

export default function WinComponent() {
  const handleFormAccess = () => {
    sessionStorage.setItem("winner_verified", "true");
  };

  return (
    <div>
      🎉 승리!
      <Link href="/winner-form" onClick={handleFormAccess}>
        <button>당첨자 정보 입력하기</button>
      </Link>
    </div>
  );
}
