import type { CSSProperties } from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { useCopy } from "../localization";
import { localizedFontWeight } from "../typography";
import { stageFrames, useContainerLayout } from "./layout";
import { getStage2GrowStyle, getStage2WidthGrowStyle } from "./stage2Grow";
import { UIContainer } from "./UIContainer";

const fontFamily = "var(--localized-ui-font)";

export const dashboardStage2GrowStartFrame = stageFrames.stage1 + 0;
export const dashboardStage2GrowDurationFrames = 50;
export const dashboardStage2GrowStaggerFrames = 4;

const dashboardStage2GrowTiming = {
  startFrame: dashboardStage2GrowStartFrame,
  duration: dashboardStage2GrowDurationFrames,
  staggerFrames: dashboardStage2GrowStaggerFrames,
};

const avatarFiles = [
  "mqgd5epd-7i5o591.png",
  "mqgd5epd-59df585.png",
  "mqgd5epd-r9626k3.png",
  "mqgd5epd-xdnxjzi.png",
  "mqgd5epd-p28vomt.png",
];

const bars = [
  { largeX: 83.7, compactX: 53.58, largeY: 4.45, compactY: 19.99, largeWidth: 31.7, compactWidth: 20.3, color: "#b8ccfb" },
  { largeX: 115.39, compactX: 73.88, largeY: 31.39, compactY: 37.24, largeWidth: 299.55, compactWidth: 191.87, color: "#b8ccfb" },
  { largeX: 115.39, compactX: 73.88, largeY: 58.34, compactY: 54.5, largeWidth: 38.04, compactWidth: 24.36, color: "#f1b6df" },
  { largeX: 153.43, compactX: 98.24, largeY: 85.28, compactY: 71.76, largeWidth: 45.96, compactWidth: 29.44, color: "#91dbf5" },
  { largeX: 151.85, compactX: 97.23, largeY: 112.22, compactY: 89.02, largeWidth: 202.87, compactWidth: 129.94, color: "#d8c0f5" },
];

const rows = ["Stella", "Alex", "Kimi", "Roger", "Tyre"];
const largeRowTops = [5.79, 32.23, 59.31, 86.03, 113.11];
const compactRowTops = [20.84, 37.3, 54.6, 71.75, 88.0];

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;

const cardStyle = (width: number, height: number, borderRadius: number): CSSProperties => ({
  boxSizing: "border-box",
  position: "relative",
  width,
  height,
  overflow: "hidden",
  borderRadius,
  background: "rgba(255,255,255,0.8)",
  fontFamily,
});

const ProjectTimeline: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const text = useCopy();
  const compactProgress = clamp((196 - height) / (196 - 132));
  const outerPadding = lerp(10, 9, compactProgress);
  const headerIconSize = lerp(24, 18, compactProgress);
  const headerGap = lerp(8, 6, compactProgress);
  const headerHeight = lerp(24, 18, compactProgress);
  const titleFontSize = lerp(12, 10.5, compactProgress);
  const titleLineHeight = lerp(20, 17, compactProgress);
  const chartTop = lerp(44, 37, compactProgress);
  const chartWidth = Math.max(width - outerPadding * 2, 1);
  const chartHeight = Math.max(height - chartTop - outerPadding, 1);
  const avatarSize = lerp(16, 10.3, compactProgress);
  const rowLeft = lerp(10, 6.34, compactProgress);
  const rowGap = lerp(4.68, 1.7, compactProgress);
  const rowHeight = lerp(16.7, 11.1, compactProgress);
  const rowFontSize = lerp(10, 6.44, compactProgress);
  const rowLineHeight = lerp(15.8, 10.12, compactProgress);
  const barHeight = lerp(17.434, 11.167, compactProgress);
  const barRadius = lerp(4.352, 2.788, compactProgress);
  const gridStart = lerp(83.7, 53.58, compactProgress);
  const gridStep = lerp(80.83, 51.773, compactProgress);
  const gridLineWidth = lerp(0.73, 0.46, compactProgress);

  return (
    <div style={cardStyle(width, height, lerp(12, 9, compactProgress))}>
      <div
        style={{
          position: "absolute",
          left: outerPadding,
          top: outerPadding,
          display: "flex",
          alignItems: "center",
          columnGap: headerGap,
          height: headerHeight,
          ...getStage2GrowStyle(frame, 0, { origin: "left center", ...dashboardStage2GrowTiming }),
        }}
      >
        <Img src={staticFile("ui-icons/dashboard-timeline.svg")} style={{ width: headerIconSize, height: headerIconSize }} />
        <p style={{ margin: 0, color: "#1f2329", fontSize: titleFontSize, fontWeight: localizedFontWeight("heading", 700), lineHeight: `${titleLineHeight}px` }}>
          {text.projectTimeline}
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          left: outerPadding,
          top: chartTop,
          width: chartWidth,
          height: chartHeight,
          borderRadius: lerp(5, 3.72, compactProgress),
          background: "#f8f9fa",
          overflow: "hidden",
          ...getStage2GrowStyle(frame, 1, { origin: "top center", ...dashboardStage2GrowTiming }),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: lerp(0, 7.8, compactProgress),
            top: lerp(0, 2.8, compactProgress),
            height: lerp(0, 10.3, compactProgress),
            color: "#1f2329",
            fontSize: lerp(0, 6.04, compactProgress),
            lineHeight: `${lerp(0, 10.32, compactProgress)}px`,
            whiteSpace: "nowrap",
            opacity: compactProgress,
          }}
        >
          {text.timelineFeature}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: lerp(0, 14.57, compactProgress),
            width: "100%",
            height: gridLineWidth,
            background: "rgba(31,35,41,0.06)",
            opacity: compactProgress,
          }}
        />
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: gridStart + index * gridStep,
              top: 0,
              width: gridLineWidth,
              height: "100%",
              background: "rgba(31,35,41,0.06)",
            }}
          />
        ))}
        {rows.map((name, index) => {
          const rowTop = lerp(largeRowTops[index], compactRowTops[index], compactProgress);

          return (
          <div
            key={name}
              style={{
                position: "absolute",
                left: rowLeft,
                top: rowTop,
                display: "flex",
                alignItems: "center",
                columnGap: rowGap,
                height: rowHeight,
                ...getStage2GrowStyle(frame, 2 + index, { origin: "left center", translateY: 3, ...dashboardStage2GrowTiming }),
              }}
            >
              <Img src={staticFile(`figma/${avatarFiles[index]}`)} style={{ width: avatarSize, height: avatarSize, borderRadius: 999, objectFit: "cover" }} />
              <span style={{ color: "#2b2f36", fontSize: rowFontSize, lineHeight: `${rowLineHeight}px`, whiteSpace: "nowrap" }}>{name}</span>
            </div>
          );
        })}
        {bars.map((bar, index) => (
          <div
            key={`${bar.largeY}-${bar.largeX}`}
            style={{
              position: "absolute",
              left: lerp(bar.largeX, bar.compactX, compactProgress),
              top: lerp(bar.largeY, bar.compactY, compactProgress),
              width: lerp(bar.largeWidth, bar.compactWidth, compactProgress),
              height: barHeight,
              borderRadius: barRadius,
              background: bar.color,
              ...getStage2WidthGrowStyle(frame, 7 + index, dashboardStage2GrowTiming),
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const DashboardContainer = () => {
  const layout = useContainerLayout("dashboard");
  const contentWidth = Math.max(layout.width, 1);
  const contentHeight = Math.max(layout.height, 1);

  return (
    <UIContainer layout={layout} background="rgba(255,255,255,0.8)" backdropFilter="blur(22px)" stage2GradientBorder>
      <ProjectTimeline width={contentWidth} height={contentHeight} />
    </UIContainer>
  );
};
