import { animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function WorkTimeDisplay({ minutes, targetHours, hasRecord = true }) {
  const displayHours = Math.floor(minutes / 60);
  const displayMinutes = minutes % 60;
  const progress = targetHours > 0 ? Math.min(1, minutes / (targetHours * 60)) : 0;
  const [displayProgress, setDisplayProgress] = useState(progress);
  const displayProgressRef = useRef(progress);
  const radius = 124;
  const strokeWidth = 8;
  const safeDisplayProgress = Math.min(displayProgress, 1);
  const isComplete = safeDisplayProgress >= 0.999;
  const endAngle = isComplete ? 269.999 : -90 + Math.max(0.001, safeDisplayProgress) * 360;
  const progressPath = displayProgress > 0 ? describeArc(150, 150, radius, -90, endAngle) : '';
  const completionShadowPath = describeArc(150, 150, radius, 269, 269.999);

  useEffect(() => {
    const controls = animate(displayProgressRef.current, progress, {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        displayProgressRef.current = latest;
        setDisplayProgress(latest);
      },
    });

    return () => controls.stop();
  }, [progress]);

  return (
    <div className="relative flex h-[318px] w-[318px] items-center justify-center">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 300" aria-hidden="true">
        <defs>
          <filter id="completion-cap-shadow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur" />
            <feOffset in="blur" dx="0" dy="2" result="offsetBlur" />
            <feFlood floodColor="#000000" floodOpacity="0.32" result="shadowColor" />
            <feComposite in="shadowColor" in2="offsetBlur" operator="in" />
          </filter>
        </defs>
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke="var(--color-progress-track)"
          strokeWidth={strokeWidth}
        />
        {displayProgress > 0 ? (
          <path
            d={progressPath}
            fill="none"
            stroke="var(--color-progress-ring)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        ) : null}
        {isComplete ? (
          <path
            d={completionShadowPath}
            fill="none"
            stroke="var(--color-progress-ring)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter="url(#completion-cap-shadow)"
          />
        ) : null}
      </svg>

      {hasRecord ? (
        <div className="relative flex items-baseline justify-center text-center font-sans text-ink [font-variant-numeric:tabular-nums]">
          <span className="text-[56px] font-medium leading-none">{displayHours}</span>
          <span className="ml-1 text-[28px] font-normal leading-none">h</span>
          <span className="ml-[14px] text-[56px] font-medium leading-none">{displayMinutes}</span>
          <span className="ml-1 text-[28px] font-normal leading-none">m</span>
        </div>
      ) : (
        <div className="relative -top-0.5 flex flex-col items-center justify-center text-center">
          <div className="mb-[10px] text-[28px] leading-none" aria-hidden="true">
            🥱
          </div>
          <p className="text-body font-normal text-subtle">今天还没打卡哦~</p>
        </div>
      )}
    </div>
  );
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(centerX, centerY, radius, startAngle, endAngle) {
  const start = polarToCartesian(centerX, centerY, radius, startAngle);
  const end = polarToCartesian(centerX, centerY, radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    1,
    end.x,
    end.y,
  ].join(' ');
}
