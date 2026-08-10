import { Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { CSSProperties, ReactNode } from "react";
import { useCopy, useLocale } from "../localization";
import { localizedFontWeight } from "../typography";
import {
  getStage1To2MorphProgress,
  getStage2To3MorphProgress,
  getStage3To4MorphProgress,
  getStage4StateChangeProgress,
  getStageTransitionDuration,
  stageFrames,
  useContainerLayout,
  useLayoutVariant,
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
type TaskRectKey = "metrics" | "status" | "progress" | "trend" | "assignment" | "priority";

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

const mapRectToContent = (
  rect: Rect,
  designWidth: number,
  designHeight: number,
  availableWidth: number,
  availableHeight: number,
  padding = contentPadding,
): Rect => ({
  x: padding + (rect.x / designWidth) * availableWidth,
  y: padding + (rect.y / designHeight) * availableHeight,
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
const TASK_METRIC_GOAL_START = 208;
const TASK_METRIC_COMPLETED_START = 146;
const TASK_METRIC_GOAL_STAGE4 = 236;
const TASK_METRIC_COMPLETED_STAGE4 = 224;
const taskResetFrame = stageFrames.stage5;

const getTaskMetricValues = (progress: number) => ({
  goalValue: Math.round(lerp(TASK_METRIC_GOAL_START, TASK_METRIC_GOAL_STAGE4, progress)),
  completedValue: Math.round(lerp(TASK_METRIC_COMPLETED_START, TASK_METRIC_COMPLETED_STAGE4, progress)),
});

const defaultDesigns: Record<TaskVariant, { width: number; height: number }> = {
  large: { width: 643, height: 450 },
  medium: { width: 316, height: 483 },
  compact: { width: 316, height: 254 },
};

const defaultRects: Record<TaskVariant, Record<TaskRectKey, Rect>> = {
  large: {
    metrics: { x: 0, y: 36, width: 316, height: 218, opacity: 1 },
    status: { x: 327, y: 36, width: 316, height: 218, opacity: 1 },
    progress: { x: 0, y: 267, width: 316, height: 183, opacity: 1 },
    trend: { x: 327, y: 267, width: 316, height: 183, opacity: 1 },
    assignment: { x: 654, y: 36, width: 316, height: 218, opacity: 0 },
    priority: { x: 654, y: 267, width: 316, height: 183, opacity: 0 },
  },
  medium: {
    metrics: { x: 0, y: 36, width: 316, height: 218, opacity: 1 },
    status: { x: 0, y: 266, width: 316, height: 218, opacity: 1 },
    progress: { x: 0, y: 495, width: 316, height: 183, opacity: 0 },
    trend: { x: 0, y: 690, width: 316, height: 183, opacity: 0 },
    assignment: { x: 0, y: 885, width: 316, height: 218, opacity: 0 },
    priority: { x: 0, y: 1115, width: 316, height: 183, opacity: 0 },
  },
  compact: {
    metrics: { x: 0, y: 36, width: 316, height: 218, opacity: 1 },
    status: { x: 0, y: 266, width: 316, height: 218, opacity: 0 },
    progress: { x: 0, y: 495, width: 316, height: 183, opacity: 0 },
    trend: { x: 0, y: 690, width: 316, height: 183, opacity: 0 },
    assignment: { x: 0, y: 885, width: 316, height: 218, opacity: 0 },
    priority: { x: 0, y: 1115, width: 316, height: 183, opacity: 0 },
  },
};

const wideDesigns: Record<TaskVariant, { width: number; height: number }> = {
  large: { width: 790.483, height: 395.477 },
  medium: defaultDesigns.medium,
  compact: defaultDesigns.compact,
};

const wideRects: Record<TaskVariant, Record<TaskRectKey, Rect>> = {
  large: {
    metrics: { x: 11.735, y: 30.205, width: 250.734, height: 173.204, opacity: 1 },
    status: { x: 270.717, y: 30.205, width: 250.734, height: 173.204, opacity: 1 },
    assignment: { x: 529.699, y: 30.205, width: 250.734, height: 173.204, opacity: 1 },
    progress: { x: 11.735, y: 211.657, width: 250.734, height: 173.204, opacity: 1 },
    trend: { x: 270.717, y: 211.657, width: 250.734, height: 173.204, opacity: 1 },
    priority: { x: 529.699, y: 211.657, width: 250.734, height: 173.204, opacity: 1 },
  },
  medium: defaultRects.medium,
  compact: defaultRects.compact,
};

const wideTitleRects: Record<TaskVariant, Rect> = {
  large: { x: 11.735, y: 5.766, width: 220, height: 24, opacity: 1 },
  medium: { x: 0, y: 0, width: 220, height: 24, opacity: 1 },
  compact: { x: 0, y: 0, width: 220, height: 24, opacity: 1 },
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
  const text = useCopy();
  const compactProgress = clamp((24 - height) / 6);
  const iconSize = height;
  const gap = lerp(8, 6, compactProgress);
  const textWidth = Math.max(width - iconSize - gap, 1);
  const fontSize = Math.min(lerp(12, 10.5, compactProgress), textWidth / 8.8);
  const lineHeight = lerp(20, 16, compactProgress);

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
      fontWeight: localizedFontWeight("heading", 700),
      lineHeight: `${lineHeight}px`,
      overflow: "hidden",
    }}
  >
    <span
      style={{
        display: "grid",
        placeItems: "center",
        width: iconSize,
        height: iconSize,
        borderRadius: lerp(7, 5, compactProgress),
        background: "#f2f3fd",
        flexShrink: 0,
      }}
    >
      <Img src={staticFile("ui-icons/task-dashboard-timer.svg")} style={{ width: lerp(14, 10, compactProgress), height: lerp(14, 10, compactProgress) }} />
    </span>
    <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
      {text.projectDashboard}
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
      overflow: "hidden",
    }}
  >
    <p style={{ margin: 0, color: "#1f2329", fontSize: 15 * unit, fontWeight: localizedFontWeight("label", 400), lineHeight: `${27 * unit}px` }}>{label}</p>
    <p style={{ margin: 0, color: "#1f2329", fontSize: 35 * unit, fontWeight: localizedFontWeight("emphasis", 800), lineHeight: `${35 * unit}px` }}>
      {value}
    </p>
  </div>
  );
};

const getCountdownValues = (frame: number, fps: number) => {
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
    pad(days),
    pad(hours),
    pad(minutes),
    pad(seconds),
  ];
};

const Countdown: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const text = useCopy();
  const values = getCountdownValues(frame, fps);
  const labels = [text.days, text.hours, text.minutes, text.seconds];
  const unit = Math.min(width / 316, height / 104);
  const boxSize = 42 * unit;
  const itemWidth = 45 * unit;

  return (
    <div
      style={{
        ...cardStyle,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        columnGap: 11 * unit,
        width,
        height,
        padding: `0 ${16 * unit}px`,
        boxSizing: "border-box",
        borderRadius: 10 * unit,
      }}
    >
      {values.map((value, index) => {
        const label = labels[index];

        return (
        <div key={label} style={{ display: "flex", alignItems: "flex-start", columnGap: 11 * unit }}>
          {index > 0 ? (
            <span style={{ color: "#336df4", fontSize: 18 * unit, fontWeight: localizedFontWeight("heading", 800), lineHeight: `${45 * unit}px` }}>
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
                fontWeight: localizedFontWeight("emphasis", 700),
                lineHeight: 1,
              }}
            >
              {value}
            </div>
            <span style={{ color: "rgba(77,82,114,0.9)", fontSize: 9 * unit, fontWeight: localizedFontWeight("label", 600), letterSpacing: 0.36 * unit, lineHeight: `${12 * unit}px` }}>
              {label}
            </span>
          </div>
        </div>
        );
      })}
    </div>
  );
};

const MetricAndCountdown: React.FC<{ width: number; height: number; progress: number }> = ({ width, height, progress }) => {
  const text = useCopy();
  const gap = Math.max(Math.min(width, height) * 0.032, 4);
  const metricHeight = Math.max((height - gap) * (104 / 218), 1);
  const metricWidth = Math.max((width - gap) / 2, 1);
  const countdownHeight = Math.max(height - metricHeight - gap, 1);
  const { goalValue, completedValue } = getTaskMetricValues(progress);

  return (
  <div style={{ display: "flex", flexDirection: "column", rowGap: gap, width, height }}>
    <div style={{ display: "flex", columnGap: gap, height: metricHeight }}>
      <MetricCard label={text.goal} value={goalValue} width={metricWidth} height={metricHeight} />
      <MetricCard label={text.completed} value={completedValue} width={metricWidth} height={metricHeight} />
    </div>
    <Countdown width={width} height={countdownHeight} />
  </div>
  );
};

const DonutChart: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const text = useCopy();
  const legend = [
    ["#3b73f6", text.ongoing],
    ["#00339e", text.completed],
    ["#31c9ba", text.stalled],
    ["#82a6ff", text.notYetStarted],
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
      <p style={{ position: "absolute", top: padding, left: padding, margin: 0, color: "#1f2329", fontSize: titleSize, fontWeight: localizedFontWeight("heading", 400), lineHeight: `${27 * unit}px` }}>
        {text.taskByStatus}
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

const ProgressCard: React.FC<{ width: number; height: number; goalValue: number; completedValue: number }> = ({
  width,
  height,
  goalValue,
  completedValue,
}) => {
  const text = useCopy();
  const unit = Math.min(width / 316, height / 183);
  const innerWidth = Math.max(width - 32 * unit, 1);
  const progressRatio = goalValue > 0 ? completedValue / goalValue : 0;
  const progressPercent = Math.round(progressRatio * 100);

  return (
  <div
    style={{
      ...cardStyle,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width,
      height,
      padding: 16 * unit,
      boxSizing: "border-box",
      borderRadius: 10 * unit,
    }}
  >
    <p style={{ alignSelf: "stretch", margin: 0, color: "#1f2329", fontSize: 15 * unit, fontWeight: localizedFontWeight("heading", 400), lineHeight: `${27 * unit}px` }}>{text.overallProgress}</p>
    <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", width: innerWidth }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", rowGap: 10 * unit, width: innerWidth }}>
        <p style={{ margin: 0, color: "#1f2329", fontSize: 32 * unit, fontWeight: localizedFontWeight("emphasis", 800), lineHeight: `${32 * unit}px` }}>{progressPercent}%</p>
        <div style={{ width: innerWidth, height: 14 * unit, borderRadius: 4 * unit, background: "#f4f6f9", overflow: "hidden" }}>
          <div style={{ width: innerWidth * progressRatio, height: "100%", borderRadius: 4 * unit, background: "#4294ff" }} />
        </div>
        <p style={{ margin: 0, opacity: 0.4, color: "#1f2329", fontSize: 15 * unit, lineHeight: `${25 * unit}px` }}>
          {`${text.current} ${completedValue} | ${text.goal} ${goalValue}`}
        </p>
      </div>
    </div>
  </div>
  );
};

const TrendCard: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const text = useCopy();
  const locale = useLocale();
  const unit = Math.min(width / 316, height / 183);
  const innerWidth = Math.max(width - 32 * unit, 1);
  const titleHeight = 28 * unit;
  const chartHeight = Math.max(height - 16 * unit * 2 - titleHeight - 20 * unit - 27 * unit, 1);
  const monthGap = 25 * unit;
  const monthWidths = (locale === "zh" ? [32, 32, 32, 32, 32] : [29, 25, 21, 28, 27]).map(
    (monthWidth) => monthWidth * unit,
  );

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
    <p style={{ margin: 0, color: "#1f2329", fontSize: 15 * unit, fontWeight: localizedFontWeight("heading", 400), lineHeight: `${27 * unit}px` }}>{text.taskCompletionTrend}</p>
    <div style={{ display: "flex", flexDirection: "column", rowGap: 10 * unit, width: innerWidth }}>
      <Img
        src={staticFile("ui-icons/task-completion-trend-line.svg")}
        style={{ width: innerWidth, height: chartHeight, objectFit: "fill" }}
      />
      <div style={{ display: "flex", alignItems: "flex-start", columnGap: monthGap, width: innerWidth, overflow: "hidden" }}>
        {text.months.map((month, index) => (
          <span
            key={month}
            style={{
              flexShrink: 0,
              width: monthWidths[index],
              color: "rgba(31,35,41,0.4)",
              fontSize: 15 * unit,
              lineHeight: `${25 * unit}px`,
              textAlign: "center",
              whiteSpace: "nowrap",
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

const ProjectAssignmentCard: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const text = useCopy();
  const unit = Math.min(width / 250.734, height / 173.204);
  const names = ["Stella", "Alex", "Kimi", "Roger"];
  const barHeights = [74, 36, 45, 89];
  const chartBottom = 139 * unit;

  return (
    <div
      style={{
        ...cardStyle,
        position: "relative",
        width,
        height,
        borderRadius: 8 * unit,
        overflow: "hidden",
      }}
    >
      <p style={{ position: "absolute", left: 17 * unit, top: 8 * unit, margin: 0, color: "#1f2329", fontSize: 11.5 * unit, lineHeight: `${21.5 * unit}px` }}>
        {text.projectAssignment}
      </p>
      <div style={{ position: "absolute", left: 18 * unit, right: 18 * unit, top: chartBottom, height: 1, background: "rgba(31,35,41,0.1)" }} />
      {names.map((name, index) => {
        const x = (30 + index * 51) * unit;
        const barHeight = barHeights[index] * unit;

        return (
          <div key={name}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: chartBottom - barHeight,
                width: 20 * unit,
                height: barHeight,
                borderRadius: `${2 * unit}px ${2 * unit}px 0 0`,
                background: "#3975ee",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: x - 8 * unit,
                top: 143 * unit,
                width: 36 * unit,
                color: "rgba(31,35,41,0.4)",
                fontSize: 11.5 * unit,
                lineHeight: `${19 * unit}px`,
                textAlign: "center",
              }}
            >
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const PriorityCard: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const text = useCopy();
  const unit = Math.min(width / 250.734, height / 173.204);
  const legend = [
    ["#5682f7", text.normal],
    ["#1559e8", text.important],
    ["#38bcea", text.urgent],
  ] as const;

  return (
    <div
      style={{
        ...cardStyle,
        position: "relative",
        width,
        height,
        borderRadius: 8 * unit,
        overflow: "hidden",
      }}
    >
      <p style={{ position: "absolute", left: 17 * unit, top: 8 * unit, margin: 0, color: "#1f2329", fontSize: 11.5 * unit, lineHeight: `${21.5 * unit}px` }}>
        {text.taskByPriority}
      </p>
      <div
        style={{
          position: "absolute",
          left: 34 * unit,
          top: 52 * unit,
          width: 94 * unit,
          height: 94 * unit,
          borderRadius: 999,
          background: "conic-gradient(#5682f7 0deg 180deg, #1559e8 180deg 270deg, #38bcea 270deg 360deg)",
          transform: "rotate(0deg)",
        }}
      />
      <div style={{ position: "absolute", left: 146 * unit, top: 62 * unit, display: "flex", flexDirection: "column", rowGap: 6 * unit }}>
        {legend.map(([color, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", columnGap: 6 * unit }}>
            <span style={{ width: 7 * unit, height: 7 * unit, borderRadius: 999, background: color, flexShrink: 0 }} />
            <span style={{ color: "#646a73", fontSize: 10.7 * unit, lineHeight: `${18 * unit}px`, whiteSpace: "nowrap" }}>{label}</span>
          </div>
        ))}
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

const DashboardContent: React.FC<{ frame: number; width: number; height: number; wide: boolean }> = ({ frame, width, height, wide }) => {
  const { from, to, progress } = getTaskState(frame);
  const designs = wide ? wideDesigns : defaultDesigns;
  const rects = wide ? wideRects : defaultRects;
  const stage4Progress = getStage4StateChangeProgress(frame);
  const metricProgress = frame >= taskResetFrame ? 0 : stage4Progress;
  const { goalValue, completedValue } = getTaskMetricValues(metricProgress);
  const designWidth = lerp(designs[from].width, designs[to].width, progress);
  const designHeight = lerp(designs[from].height, designs[to].height, progress);
  const largePresence = from === "large"
    ? to === "large" ? 1 : 1 - progress
    : 0;
  const padding = wide ? lerp(contentPadding, 0, largePresence) : contentPadding;
  const availableWidth = Math.max(width - padding * 2, 1);
  const availableHeight = Math.max(height - padding * 2, 1);
  const mapTaskRect = (key: TaskRectKey) => mapRectToContent(
    mixRect(rects[from][key], rects[to][key], progress),
    designWidth,
    designHeight,
    availableWidth,
    availableHeight,
    padding,
  );
  const metricsRect = mapTaskRect("metrics");
  const statusRect = mapTaskRect("status");
  const progressRect = mapTaskRect("progress");
  const trendRect = mapTaskRect("trend");
  const assignmentRect = mapTaskRect("assignment");
  const priorityRect = mapTaskRect("priority");
  const mappedTitleRect = wide
    ? mapRectToContent(
      mixRect(wideTitleRects[from], wideTitleRects[to], progress),
      designWidth,
      designHeight,
      availableWidth,
      availableHeight,
      padding,
    )
    : {
      x: contentPadding,
      y: contentPadding,
      width: (220 / designWidth) * availableWidth,
      height: (24 / designHeight) * availableHeight,
      opacity: 1,
    };
  const compactHeaderProgress = to === "compact" ? progress : 0;
  const sharedHeaderInset = lerp(10, 9, compactHeaderProgress);
  const sharedHeaderRect: Rect = {
    x: sharedHeaderInset,
    y: sharedHeaderInset,
    width: Math.max(width - sharedHeaderInset * 2, 1),
    height: lerp(24, 18, compactHeaderProgress),
    opacity: 1,
  };
  const titleRect = wide
    ? mixRect(mappedTitleRect, sharedHeaderRect, 1 - largePresence)
    : mappedTitleRect;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <div style={getRectStyle(titleRect)}>
          <TitleRow width={titleRect.width} height={titleRect.height} />
        </div>
        <LayoutItem rect={metricsRect}>
          <MetricAndCountdown width={metricsRect.width} height={metricsRect.height} progress={metricProgress} />
        </LayoutItem>
        <LayoutItem rect={statusRect}>
          <DonutChart width={statusRect.width} height={statusRect.height} />
        </LayoutItem>
        <LayoutItem rect={progressRect}>
          <ProgressCard
            width={progressRect.width}
            height={progressRect.height}
            goalValue={goalValue}
            completedValue={completedValue}
          />
        </LayoutItem>
        <LayoutItem rect={trendRect}>
          <TrendCard width={trendRect.width} height={trendRect.height} />
        </LayoutItem>
        <LayoutItem rect={assignmentRect}>
          <ProjectAssignmentCard width={assignmentRect.width} height={assignmentRect.height} />
        </LayoutItem>
        <LayoutItem rect={priorityRect}>
          <PriorityCard width={priorityRect.width} height={priorityRect.height} />
        </LayoutItem>
      </div>
    </div>
  );
};

export const TaskContainer = () => {
  const frame = useCurrentFrame();
  const layout = useContainerLayout("task");
  const layoutVariant = useLayoutVariant();
  const contentWidth = Math.max(layout.width, 1);
  const contentHeight = Math.max(layout.height, 1);

  return (
    <UIContainer layout={layout} background="rgba(255, 255, 255, 0.78)" backdropFilter="blur(22px)">
      <DashboardContent frame={frame} width={contentWidth} height={contentHeight} wide={layoutVariant === "wide"} />
    </UIContainer>
  );
};
