import React from "react";

interface GaugeProps {
  score: number;
  maxScore: number;
  width?: number;
  height?: number;
}

const Gauge: React.FC<GaugeProps> = ({
  score,
  maxScore,
  width = 100,
  height = 200,
}) => {
  const segmentCount = 15; // 세그먼트 개수
  const filledSegments = Math.floor((score / maxScore) * segmentCount);

  // 각 세그먼트별 색상 (아래에서 위로)
  const getSegmentColor = (index: number) => {
    const colors = [
      "#EEDE6E",
      "#EFDA6D",
      "#EFD76C",
      "#EFD26B",
      "#F0CE6A",
      "#F0CA69",
      "#F0C668",
      "#F0C167",
      "#F1BD66",
      "#F1B965",
      "#F0B464",
      "#F1B063",
      "#F2AD62",
      "#F2A962",
      "#F1A460",
    ];
    return colors[index] || colors[colors.length - 1];
  };

  return (
    <div className="p-10 bg-blue-500 rounded-lg">
      <div
        className="relative rounded-lg overflow-hidden border-4 border-gray-700"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {/* 각 세그먼트별로 렌더링 */}
        {Array.from({ length: segmentCount }, (_, i) => {
          const segmentIndex = segmentCount - 1 - i; // 아래부터 채우기 위해 뒤집음
          const isFilledSegment = segmentIndex < filledSegments;
        
          return (
            <div
              key={i}
              className={`absolute left-0 right-0 transition-all duration-300 ease-out`}
              style={{
                top: `${i * (100 / segmentCount)}%`,
                height: `${100 / segmentCount}%`,
                backgroundColor: isFilledSegment
                  ? getSegmentColor(segmentIndex)
                  : "#d1d5db",
                borderBottom:
                  i < segmentCount - 1 ? "2px solid #374151" : "none",
                borderTop: i === 0 ? "none" : "2px solid #374151",
              }}
            />
          );
        })}

        {/* 상하단 둥근 모서리 */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gray-700 rounded-t" />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-700 rounded-b" />
      </div>

    </div>
  );
};

export default Gauge;