import type { Metadata } from "next";
import "../styles/globals.css";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "B1F",
};

const kbo = localFont({
  src: [
    {
      path: "../../../../public/fonts/KBO-Dia-Gothic_medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/KBO-Dia-Gothic_bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-kbo",
});

const pretendard = localFont({
  src: [
    {
      path: "../../../../public/fonts/Pretendard-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/Pretendard-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/Pretendard-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/Pretendard-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/Pretendard-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
});

const digit = localFont({
  src: [
    {
      path: "../../../../public/fonts/DigitalNumbers-Regular.ttf",
      weight: "400",
      style: "normal",
    }
  ],
  variable: "--font-digit",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${kbo.variable} ${pretendard.variable} ${digit.variable}`}>
      <body>{children}</body>
    </html>
  )
}
