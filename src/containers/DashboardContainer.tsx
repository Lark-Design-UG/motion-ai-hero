import type { CSSProperties } from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { getStage4StateChangeProgress, stageFrames, useContainerLayout } from "./layout";
import { getStage2GrowStyle, getStage2WidthGrowStyle } from "./stage2Grow";
import { UIContainer } from "./UIContainer";

const fontFamily =
  '"Lark Circular", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif';

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
  { y: 28, x: 72, width: 31, color: "#b8ccfb" },
  { y: 52, x: 103, width: 136, color: "#b8ccfb" },
  { y: 77, x: 103, width: 31, color: "#f1b6df" },
  { y: 101, x: 135, width: 39, color: "#91dbf5" },
  { y: 126, x: 135, width: 95, color: "#d8c0f5" },
];

const rows = ["Stella", "Alex", "Kimi", "Roger", "Tyre"];
const stage4TimelineBarShiftX = -28;
const stage4TimelineBarWidthMultiplier = 2;

const cardStyle = (width: number, height: number): CSSProperties => {
  const unit = Math.min(width / 259, height / 175);

  return {
    boxSizing: "border-box",
    position: "relative",
    width,
    height,
    padding: 12 * unit,
    overflow: "hidden",
    borderRadius: 12 * unit,
    background: "rgba(255,255,255,0.8)",
    fontFamily,
  };
};

const ProjectTimeline: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const stage4Progress = getStage4StateChangeProgress(frame);
  const unit = Math.min(width / 259, height / 175);
  const contentTop = 42 * unit;
  const chartLeft = 76 * unit;
  const chartTop = 12 * unit;
  const chartWidth = Math.max(width - chartLeft - 12 * unit, 1);
  const chartHeight = Math.max(height - contentTop - chartTop - 10 * unit, 1);

  return (
    <div style={cardStyle(width, height)}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          columnGap: 8 * unit,
          height: 24 * unit,
          ...getStage2GrowStyle(frame, 0, { origin: "left center", ...dashboardStage2GrowTiming }),
        }}
      >
        <Img src={staticFile("ui-icons/dashboard-timeline.svg")} style={{ width: 24 * unit, height: 24 * unit }} />
        <p style={{ margin: 0, color: "#1f2329", fontSize: 12 * unit, fontWeight: 700, lineHeight: `${20 * unit}px` }}>
          Project Timeline
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          left: 12 * unit,
          top: contentTop,
          width: width - 24 * unit,
          height: height - contentTop - 12 * unit,
          borderRadius: 5 * unit,
          background: "#f8f9fa",
          overflow: "hidden",
          ...getStage2GrowStyle(frame, 1, { origin: "top center", ...dashboardStage2GrowTiming }),
        }}
      >
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: (72 + index * 37) * unit,
              top: 0,
              width: 1,
              height: "100%",
              background: "rgba(31,35,41,0.06)",
            }}
          />
        ))}
        {rows.map((name, index) => {
          const rowTop = chartTop + (bars[index].y - 28) * unit;

          return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: 16 * unit,
              top: rowTop,
              display: "flex",
              alignItems: "center",
              columnGap: 4 * unit,
              height: 14 * unit,
              ...getStage2GrowStyle(frame, 2 + index, { origin: "left center", translateY: 3 * unit, ...dashboardStage2GrowTiming }),
            }}
          >
            <Img src={staticFile(`figma/${avatarFiles[index]}`)} style={{ width: 14 * unit, height: 14 * unit, borderRadius: 999, objectFit: "cover" }} />
            <span style={{ color: "#2b2f36", fontSize: 8.5 * unit, lineHeight: `${13 * unit}px` }}>{name}</span>
          </div>
          );
        })}
        <div style={{ position: "absolute", left: chartLeft, top: chartTop, width: chartWidth, height: chartHeight }}>
          {bars.map((bar, index) => (
            <div
              key={`${bar.y}-${bar.x}`}
              style={{
                position: "absolute",
                left: (bar.x - 72 + stage4TimelineBarShiftX * stage4Progress) * unit,
                top: (bar.y - 28) * unit,
                width:
                  bar.width *
                  (1 + (stage4TimelineBarWidthMultiplier - 1) * stage4Progress) *
                  unit,
                height: 14 * unit,
                borderRadius: 3 * unit,
                background: bar.color,
                ...getStage2WidthGrowStyle(frame, 7 + index, dashboardStage2GrowTiming),
              }}
            />
          ))}
        </div>
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
