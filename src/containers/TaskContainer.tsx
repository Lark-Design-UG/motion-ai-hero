import { Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { CSSProperties, ReactNode } from "react";
import {
  getStage1To2MorphProgress,
  getStage2To3MorphProgress,
  getStage3To4MorphProgress,
  getStage4StateChangeProgress,
  getStageTransitionDuration,
  stageFrames,
  useContainerLayout,
} from "./layout";
import { UIContainer } from "./UIContainer";

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
};

type TaskVariant = "large" | "medium" | "compact";

const smoothProgress = (frame: number, start: number, duration: number) => {
  return Easing.bezier(0.16, 1, 0.3, 1)(clamp((frame - start) / duration));
};

const mixRect = (from: Rect, to: Rect, progress: number): Rect => ({
  x: lerp(from.x, to.x, progress),
  y: lerp(from.y, to.y, progress),
  width: lerp(from.width, to.width, progress),
  height: lerp(from.height, to.height, progress),
  opacity: lerp(from.opacity, to.opacity, progress),
});

const getRectStyle = (rect: Rect): CSSProperties => ({
  position: "absolute",
  left: rect.x,
  top: rect.y,
  width: rect.width,
  height: rect.height,
  opacity: rect.opacity,
});

const mapRectToContent = (rect: Rect, designWidth: number, designHeight: number, availableWidth: number, availableHeight: number): Rect => ({
  x: contentPadding + (rect.x / designWidth) * availableWidth,
  y: contentPadding + (rect.y / designHeight) * availableHeight,
  width: (rect.width / designWidth) * availableWidth,
  height: (rect.height / designHeight) * availableHeight,
  opacity: rect.opacity,
});

const cardStyle: CSSProperties = {
  background: "#fff",
  borderRadius: 10,
  boxShadow: "0 -4px 8px rgba(255,255,255,0.34), 0 21px 83px rgba(0,72,255,0.04)",
};

const contentPadding = 12;
const stage4TaskGoalValue = 42;
const stage4TaskCompletedValue = 31;
const taskResetFrame = stageFrames.stage5;

const designs: Record<TaskVariant, { width: number; height: number }> = {
  large: { width: 643, height: 450 },
  medium: { width: 316, height: 483 },
  compact: { width: 316, height: 254 },
};

const rects: Record<TaskVariant, Record<"metrics" | "status" | "progress" | "trend", Rect>> = {
  large: {
    metrics: { x: 0, y: 36, width: 316, height: 218, opacity: 1 },
    status: { x: 327, y: 36, width: 316, height: 218, opacity: 1 },
    progress: { x: 0, y: 267, width: 316, height: 183, opacity: 1 },
    trend: { x: 327, y: 267, width: 316, height: 183, opacity: 1 },
  },
  medium: {
    metrics: { x: 0, y: 36, width: 316, height: 218, opacity: 1 },
    status: { x: 0, y: 266, width: 316, height: 218, opacity: 1 },
    progress: { x: 0, y: 495, width: 316, height: 183, opacity: 0 },
    trend: { x: 0, y: 690, width: 316, height: 183, opacity: 0 },
  },
  compact: {
    metrics: { x: 0, y: 36, width: 316, height: 218, opacity: 1 },
    status: { x: 0, y: 266, width: 316, height: 218, opacity: 0 },
    progress: { x: 0, y: 495, width: 316, height: 183, opacity: 0 },
    trend: { x: 0, y: 690, width: 316, height: 183, opacity: 0 },
  },
};

const getTaskState = (frame: number) => {
  const stage1To2 = getStage1To2MorphProgress(frame);
  const stage2To3 = getStage2To3MorphProgress(frame);
  const stage3To4 = getStage3To4MorphProgress(frame);
  const stage5To6 = smoothProgress(frame, stageFrames.stage5, getStageTransitionDuration("stage5"));

  if (stage5To6 > 0) {
    return { from: "large" as const, to: "large" as const, progress: 1 };
  }

  if (stage3To4 > 0) {
    return { from: "medium" as const, to: "compact" as const, progress: stage3To4 };
  }

  if (stage2To3 > 0) {
    return { from: "medium" as const, to: "medium" as const, progress: 1 };
  }

  return { from: "large" as const, to: "medium" as const, progress: stage1To2 };
};

const TitleRow: React.FC<{ width?: number; height?: number }> = ({ width = 220, height = 24 }) => {
  const unit = Math.min(width / 160, height / 24);
  const iconSize = 24 * unit;
  const gap = 8 * unit;
  const textWidth = Math.max(width - iconSize - gap, 1);
  const fontSize = Math.min(14 * unit, textWidth / 8.8);

  return (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      display: "flex",
      alignItems: "center",
      columnGap: gap,
      width,
      height,
      color: "#373c43",
      fontSize,
      fontWeight: 700,
      lineHeight: `${Math.max(18 * unit, fontSize * 1.35)}px`,
      overflow: "hidden",
    }}
  >
    <span
      style={{
        display: "grid",
        placeItems: "center",
        width: iconSize,
        height: iconSize,
        borderRadius: 7 * unit,
        background: "#f2f3fd",
        flexShrink: 0,
      }}
    >
      <Img src={staticFile("ui-icons/task-dashboard-timer.svg")} style={{ width: 14 * unit, height: 14 * unit }} />
    </span>
    <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
      Project Dashboard
    </span>
  </div>
  );
};

const MetricCard: React.FC<{ label: string; value: number; width: number; height: number }> = ({ label, value, width, height }) => {
  const unit = Math.min(width / 152, height / 104);

  return (
  <div
    style={{
      ...cardStyle,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width,
      height,
      padding: 16 * unit,
      boxSizing: "border-box",
      borderRadius: 10 * unit,
    }}
  >
    <p style={{ margin: 0, color: "#1f2329", fontSize: 15 * unit, lineHeight: `${27 * unit}px` }}>{label}</p>
    <p style={{ margin: 0, color: "#1f2329", fontSize: 35 * unit, fontWeight: 800, lineHeight: `${35 * unit}px` }}>
      {value}
    </p>
  </div>
  );
};

const getCountdownItems = (frame: number, fps: number) => {
  const startTotalSeconds = (((12 * 24 + 3) * 60 + 59) * 60) + 24;
  const effectiveElapsedSeconds =
    frame >= taskResetFrame
      ? 0
      : Math.floor(frame / fps);
  const remainingSeconds = Math.max(startTotalSeconds - effectiveElapsedSeconds, 0);
  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");

  return [
    [pad(days), "DAYS"],
    [pad(hours), "HOURS"],
    [pad(minutes), "MINUTES"],
    [pad(seconds), "SECONDS"],
  ];
};

const Countdown: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = [
    ...getCountdownItems(frame, fps),
  ];
  const unit = Math.min(width / 316, height / 104);
  const boxSize = 42 * unit;
  const itemWidth = 45 * unit;

  return (
    <div
      style={{
        ...cardStyle,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        columnGap: 11 * unit,
        width,
        height,
        padding: `${22 * unit}px ${16 * unit}px`,
        boxSizing: "border-box",
        borderRadius: 10 * unit,
      }}
    >
      {items.map(([value, label], index) => (
        <div key={label} style={{ display: "flex", alignItems: "flex-start", columnGap: 11 * unit }}>
          {index > 0 ? (
            <span style={{ color: "#336df4", fontSize: 18 * unit, fontWeight: 800, lineHeight: `${45 * unit}px` }}>
              :
            </span>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: itemWidth, rowGap: 6 * unit }}>
            <div
              style={{
                display: "grid",
                placeItems: "center",
                width: boxSize,
                height: boxSize,
                borderRadius: 7 * unit,
                background: "#336df4",
                color: "#fff",
                fontSize: 23 * unit,
                fontWeight: 700,
                lineHeight: `${44 * unit}px`,
              }}
            >
              {value}
            </div>
            <span style={{ color: "rgba(77,82,114,0.9)", fontSize: 9 * unit, fontWeight: 600, letterSpacing: 0.36 * unit }}>
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const MetricAndCountdown: React.FC<{ width: number; height: number; progress: number }> = ({ width, height, progress }) => {
  const gap = Math.max(Math.min(width, height) * 0.032, 4);
  const metricHeight = Math.max((height - gap) * (104 / 218), 1);
  const metricWidth = Math.max((width - gap) / 2, 1);
  const countdownHeight = Math.max(height - metricHeight - gap, 1);
  const goalValue = Math.round(lerp(36, stage4TaskGoalValue, progress));
  const completedValue = Math.round(lerp(24, stage4TaskCompletedValue, progress));

  return (
  <div style={{ display: "flex", flexDirection: "column", rowGap: gap, width, height }}>
    <div style={{ display: "flex", columnGap: gap, height: metricHeight }}>
      <MetricCard label="Goal" value={goalValue} width={metricWidth} height={metricHeight} />
      <MetricCard label="Completed" value={completedValue} width={metricWidth} height={metricHeight} />
    </div>
    <Countdown width={width} height={countdownHeight} />
  </div>
  );
};

const DonutChart: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const legend = [
    ["#3b73f6", "On going"],
    ["#00339e", "Completed"],
    ["#31c9ba", "Stalled"],
    ["#82a6ff", "Not yet started"],
  ];
  const unit = Math.min(width / 316, height / 218);
  const padding = 16 * unit;
  const chartSize = Math.min(width * 0.38, height * 0.55, 119 * unit);
  const titleSize = 15 * unit;

  return (
    <div
      style={{
        ...cardStyle,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        columnGap: 23 * unit,
        width,
        height,
        padding: `${padding}px ${padding}px ${32 * unit}px`,
        boxSizing: "border-box",
        borderRadius: 10 * unit,
      }}
    >
      <p style={{ position: "absolute", top: padding, left: padding, margin: 0, color: "#1f2329", fontSize: titleSize, lineHeight: `${27 * unit}px` }}>
        Task by status
      </p>
      <svg width={chartSize} height={chartSize} viewBox="0 0 120 120" style={{ marginTop: 26 * unit }}>
        <circle cx="60" cy="60" r="42" fill="none" stroke="#3b73f6" strokeWidth="26" strokeDasharray="92 264" transform="rotate(-90 60 60)" />
        <circle cx="60" cy="60" r="42" fill="none" stroke="#00339e" strokeWidth="26" strokeDasharray="104 264" strokeDashoffset="-92" transform="rotate(-90 60 60)" />
        <circle cx="60" cy="60" r="42" fill="none" stroke="#31c9ba" strokeWidth="26" strokeDasharray="38 264" strokeDashoffset="-196" transform="rotate(-90 60 60)" />
        <circle cx="60" cy="60" r="42" fill="none" stroke="#82a6ff" strokeWidth="26" strokeDasharray="30 264" strokeDashoffset="-234" transform="rotate(-90 60 60)" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", rowGap: 6 * unit, marginTop: 26 * unit }}>
        {legend.map(([color, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", columnGap: 7 * unit }}>
            <span style={{ width: 9 * unit, height: 9 * unit, borderRadius: 999, background: color }} />
            <span style={{ color: "#646a73", fontSize: 12 * unit, lineHeight: `${23 * unit}px`, whiteSpace: "nowrap" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProgressCard: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const unit = Math.min(width / 316, height / 183);
  const innerWidth = Math.max(width - 32 * unit, 1);

  return (
  <div
    style={{
      ...cardStyle,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      width,
      height,
      padding: 16 * unit,
      boxSizing: "border-box",
      borderRadius: 10 * unit,
    }}
  >
    <p style={{ alignSelf: "stretch", margin: 0, color: "#1f2329", fontSize: 15 * unit, lineHeight: `${27 * unit}px` }}>Overall progress</p>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", rowGap: 10 * unit, width: innerWidth }}>
      <p style={{ margin: 0, color: "#1f2329", fontSize: 32 * unit, fontWeight: 800, lineHeight: `${32 * unit}px` }}>67%</p>
      <div style={{ width: innerWidth, height: 14 * unit, borderRadius: 4 * unit, background: "#f4f6f9", overflow: "hidden" }}>
        <div style={{ width: innerWidth * 0.61, height: "100%", borderRadius: 4 * unit, background: "#4294ff" }} />
      </div>
      <p style={{ margin: 0, opacity: 0.4, color: "#1f2329", fontSize: 15 * unit, lineHeight: `${25 * unit}px` }}>Current 24 | Goal 36</p>
    </div>
  </div>
  );
};

const TrendCard: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const unit = Math.min(width / 316, height / 183);
  const innerWidth = Math.max(width - 32 * unit, 1);
  const titleHeight = 28 * unit;
  const chartHeight = Math.max(height - 16 * unit * 2 - titleHeight - 20 * unit - 27 * unit, 1);
  const monthGap = 25 * unit;
  const monthWidths = [29, 25, 21, 28, 27].map((monthWidth) => monthWidth * unit);

  return (
  <div
    style={{
      ...cardStyle,
      display: "flex",
      flexDirection: "column",
      width,
      height,
      padding: 16 * unit,
      rowGap: 10 * unit,
      boxSizing: "border-box",
      borderRadius: 10 * unit,
    }}
  >
    <p style={{ margin: 0, color: "#1f2329", fontSize: 15 * unit, lineHeight: `${27 * unit}px` }}>Task completion trend</p>
    <div style={{ display: "flex", flexDirection: "column", rowGap: 10 * unit, width: innerWidth }}>
      <Img
        src={staticFile("ui-icons/task-completion-trend-line.svg")}
        style={{ width: innerWidth, height: chartHeight, objectFit: "fill" }}
      />
      <div style={{ display: "flex", alignItems: "flex-start", columnGap: monthGap, width: innerWidth, overflow: "hidden" }}>
        {["May", "Jun", "Jul", "Aug", "Sep"].map((month, index) => (
          <span
            key={month}
            style={{
              flexShrink: 0,
              width: monthWidths[index],
              color: "rgba(31,35,41,0.4)",
              fontSize: 15 * unit,
              lineHeight: `${25 * unit}px`,
              textAlign: "center",
            }}
          >
            {month}
          </span>
        ))}
      </div>
    </div>
  </div>
  );
};

const LayoutItem: React.FC<{
  rect: Rect;
  children: ReactNode;
}> = ({ rect, children }) => (
  <div style={getRectStyle(rect)}>{children}</div>
);

const DashboardContent: React.FC<{ frame: number; width: number; height: number }> = ({ frame, width, height }) => {
  const { from, to, progress } = getTaskState(frame);
  const stage4Progress = getStage4StateChangeProgress(frame);
  const metricProgress = frame >= taskResetFrame ? 0 : stage4Progress;
  const designWidth = lerp(designs[from].width, designs[to].width, progress);
  const designHeight = lerp(designs[from].height, designs[to].height, progress);
  const availableWidth = Math.max(width - contentPadding * 2, 1);
  const availableHeight = Math.max(height - contentPadding * 2, 1);
  const titleWidth = (220 / designWidth) * availableWidth;
  const titleHeight = (24 / designHeight) * availableHeight;
  const metricsRect = mapRectToContent(mixRect(rects[from].metrics, rects[to].metrics, progress), designWidth, designHeight, availableWidth, availableHeight);
  const statusRect = mapRectToContent(mixRect(rects[from].status, rects[to].status, progress), designWidth, designHeight, availableWidth, availableHeight);
  const progressRect = mapRectToContent(mixRect(rects[from].progress, rects[to].progress, progress), designWidth, designHeight, availableWidth, availableHeight);
  const trendRect = mapRectToContent(mixRect(rects[from].trend, rects[to].trend, progress), designWidth, designHeight, availableWidth, availableHeight);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <div style={{ position: "absolute", left: contentPadding, top: contentPadding, width: titleWidth, height: titleHeight }}>
          <TitleRow width={titleWidth} height={titleHeight} />
        </div>
        <LayoutItem rect={metricsRect}>
          <MetricAndCountdown width={metricsRect.width} height={metricsRect.height} progress={metricProgress} />
        </LayoutItem>
        <LayoutItem rect={statusRect}>
          <DonutChart width={statusRect.width} height={statusRect.height} />
        </LayoutItem>
        <LayoutItem rect={progressRect}>
          <ProgressCard width={progressRect.width} height={progressRect.height} />
        </LayoutItem>
        <LayoutItem rect={trendRect}>
          <TrendCard width={trendRect.width} height={trendRect.height} />
        </LayoutItem>
      </div>
    </div>
  );
};

export const TaskContainer = () => {
  const frame = useCurrentFrame();
  const layout = useContainerLayout("task");
  const contentWidth = Math.max(layout.width, 1);
  const contentHeight = Math.max(layout.height, 1);

  return (
    <UIContainer layout={layout} background="rgba(255, 255, 255, 0.78)" backdropFilter="blur(22px)">
      <DashboardContent frame={frame} width={contentWidth} height={contentHeight} />
    </UIContainer>
  );
};
