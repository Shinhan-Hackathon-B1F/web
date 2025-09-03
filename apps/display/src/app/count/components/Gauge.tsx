import React, { useEffect, useRef } from "react";
import Image from "next/image";

interface GaugeProps {
  score: number;
  maxScore: number;
  width?: number;
  height?: number;
  flip?: boolean;
}

const Gauge: React.FC<GaugeProps> = ({
  score,
  maxScore,
  width = 260,
  height = 310,
  flip = false,
}) => {
  const segmentCount = 23;
  const filledSegments = Math.floor((score / maxScore) * segmentCount);
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevFilledSegmentsRef = useRef<number>(0);

  // filledSegments가 증가할 때마다 소리 재생
  useEffect(() => {
    if (filledSegments > prevFilledSegmentsRef.current && audioRef.current) {
      // 이전 재생 중인 오디오가 있다면 처음부터 다시 재생
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.log("Audio play failed:", error);
      });
    }
    prevFilledSegmentsRef.current = filledSegments;
  }, [filledSegments]);

  const colors = [
    "#CCEF86",
    "#DEEF86",
    "#DEEF86",
    "#EEDE6E",
    "#EEDE6E",

    "#F1BD66",
    "#F1BD66",
    "#F1BD66",
    "#F1BD66",
    "#F9943B",

    "#F9943B",
    "#F9943B",
    "#F9943B",
    "#FB6B18",
    "#FB6B18",

    "#FB6B18",
    "#FF5500",
    "#FF5500",
    "#FF5500",
    "#FF3131",

    "#FF3131",
    "#FF3131",
    "#FF3131",
  ];

  const getSegmentColor = (index: number) => {
    return colors[index % colors.length] || colors[colors.length - 1];
  };

  return (
    <div className="flex items-center justify-center">
      <audio ref={audioRef} preload="auto">
        <source src={"/assets/점수 쌓이는 소리.mp4"} type="audio/mp4" />
        Your browser does not support the audio element.
      </audio>

      <div className="relative rounded-lg w-[300px] h-[725px]">
        <Image
          src={
            flip
              ? "/assets/응원지수 게이지_프레임_flipped.svg"
              : "/assets/응원지수 게이지_프레임.svg"
          }
          alt="Gauge Background"
          fill
          className="object-cover"
          style={{ zIndex: 0 }}
        />
        {Array.from({ length: segmentCount }, (_, i) => {
          const segmentIndex = segmentCount - 1 - i;
          const isFilledSegment = segmentIndex < filledSegments;

          const segmentHeight = ((height - 16) / segmentCount) * 1.5;

          const topPosition =
            32 +
            i * (segmentHeight + 10) +
            (i >= 14 ? 10 : 0) +
            (i >= 18 ? 10 : 0) +
            (i >= 20 ? 10 : 0);

          let curveWidth;
          if (i < 14) {
            curveWidth = 100;
          } else if (i < 18) {
            curveWidth = 140;
          } else if (i < 20) {
            curveWidth = 180;
          } else {
            curveWidth = 220;
          }

          const leftMargin = flip ? 20 : width - curveWidth + 20;
          const adjustedHeight = segmentHeight;

          const isTopSegment = i === 0;
          const isBottomSegment = i === segmentCount - 1;

          if (isTopSegment) {
            return (
              <div
                key={i}
                className="absolute transition-all duration-300 ease-out"
                style={{
                  top: `${topPosition - 10}px`,
                  left: `${leftMargin}px`,
                  width: `${curveWidth}px`,
                  height: `${adjustedHeight * 1.5}px`,
                  backgroundColor: isFilledSegment
                    ? getSegmentColor(segmentIndex)
                    : "#6b6b6b",
                  borderRadius: "4px",
                  clipPath: flip
                    ? `polygon(0% 0%, 100% 0%, 100% 100%, 0% 10%)`
                    : `polygon(0% 0%, 100% 0%, 100% 10%, 0% 100%)`,
                  marginBottom: "0px",
                }}
              />
            );
          }

          if (isBottomSegment) {
            return (
              <div
                key={i}
                className="absolute transition-all duration-300 ease-out"
                style={{
                  top: `${topPosition - 58}px`,
                  left: `${leftMargin}px`,
                  width: `${curveWidth}px`,
                  height: `${adjustedHeight * 3.2}px`,
                  backgroundColor: isFilledSegment
                    ? getSegmentColor(segmentIndex)
                    : "#6b6b6b",
                  borderRadius: "4px",
                  clipPath: flip
                    ? `polygon(0% 0%, 100% 90%, 100% 100%, 0% 100%)`
                    : `polygon(0% 90%, 100% 0%, 100% 100%, 0% 100%)`,
                  marginBottom: "0px",
                }}
              />
            );
          }

          return (
            <div
              key={i}
              className="absolute transition-all duration-300 ease-out"
              style={{
                top: `${topPosition}px`,
                left: `${leftMargin}px`,
                width: `${curveWidth}px`,
                height: `${adjustedHeight}px`,
                backgroundColor: isFilledSegment
                  ? getSegmentColor(segmentIndex)
                  : "#6b6b6b",
                borderRadius: "4px",
                marginBottom: "0px",
                transform: flip ? `skewY(15deg)` : `skewY(-15deg)`,
                transformOrigin: flip ? "right center" : "left center",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Gauge;