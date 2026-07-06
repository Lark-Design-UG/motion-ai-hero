import { Img, staticFile, useCurrentFrame } from "remotion";
import { getStage4SweepStart, stageFrames } from "./layout";
import { useContainerLayout } from "./layout";
import { getStage2GrowStyle, getStage2WidthGrowStyle } from "./stage2Grow";
import { UIContainer } from "./UIContainer";

const fontFamily =
  '"Lark Circular", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif';

export const ganttStage2GrowStartFrame = stageFrames.stage1 + 12;
export const ganttStage2GrowDurationFrames = 60;
export const ganttStage2GrowStaggerFrames = 4;

const ganttStage2GrowTiming = {
  startFrame: ganttStage2GrowStartFrame,
  duration: ganttStage2GrowDurationFrames,
  staggerFrames: ganttStage2GrowStaggerFrames,
};

const SkeletonLine: React.FC<{ width: number; height: number; left?: number }> = ({ width, height, left = 0 }) => (
  <div
    style={{
      width,
      height,
      marginLeft: left,
      borderRadius: height,
      background: "rgba(201,205,212,0.3)",
    }}
  />
);

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const smoothProgress = (frame: number, start: number, duration: number) => {
  const progress = clamp((frame - start) / duration);

  return progress * progress * (3 - 2 * progress);
};

const CheckboxMark: React.FC<{ checkedProgress: number; size: number; unit: number }> = ({ checkedProgress, size, unit }) => (
  <div
    style={{
      display: "grid",
      placeItems: "center",
      width: size,
      height: size,
      borderRadius: 3 * unit,
      position: "relative",
      boxSizing: "border-box",
      transform: `scale(${0.94 + checkedProgress * 0.06})`,
      flexShrink: 0,
    }}
  >
    <Img src={staticFile("ui-icons/status-empty-checkbox.svg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 1 - checkedProgress }} />
    <Img src={staticFile("ui-icons/status-complete-check.svg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: checkedProgress }} />
  </div>
);

const GanttContent: React.FC<{ width: number; height: number; frame: number }> = ({ width, height, frame }) => {
  const unit = Math.min(width / 259, height / 237);
  const padding = 11 * unit;
  const rowGap = Math.max(9 * unit, 4);
  const checkboxSize = 14 * unit;
  const stateStart = getStage4SweepStart() + 20;
  const completionProgresses = [
    1,
    smoothProgress(frame, stateStart, 18),
    smoothProgress(frame, stateStart + 8, 18),
    smoothProgress(frame, stateStart + 16, 18),
  ];

  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        width,
        height,
        padding,
        rowGap: 10 * unit,
        overflow: "hidden",
        borderRadius: 12 * unit,
        background: "rgba(255,255,255,0.8)",
        fontFamily,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          columnGap: 8 * unit,
          height: 24 * unit,
          ...getStage2GrowStyle(frame, 0, { origin: "left center", ...ganttStage2GrowTiming }),
        }}
      >
        <Img src={staticFile("ui-icons/gantt-tasks-check.svg")} style={{ width: 24 * unit, height: 24 * unit }} />
        <p style={{ margin: 0, color: "#1f2329", fontSize: 12 * unit, fontWeight: 700, lineHeight: `${20 * unit}px` }}>Tasks</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, rowGap, minHeight: 0 }}>
        <div
          style={{
            boxSizing: "border-box",
            display: "flex",
            alignItems: "flex-start",
            columnGap: 9 * unit,
            width: "100%",
            borderRadius: 7 * unit,
            background: "#f8f9fa",
            padding: 7 * unit,
            ...getStage2GrowStyle(frame, 1, { origin: "top center", ...ganttStage2GrowTiming }),
          }}
        >
          <CheckboxMark checkedProgress={completionProgresses[0]} size={checkboxSize} unit={unit} />
          <div style={{ display: "flex", flexDirection: "column", rowGap: 6 * unit, flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                color: "#1f2329",
                fontSize: 12 * unit,
                lineHeight: `${18 * unit}px`,
              }}
            >
              Provide copywriting for the new product page
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "inline-flex", alignItems: "center", columnGap: 5 * unit, borderRadius: 12 * unit, background: "#f0f4ff", padding: `${3 * unit}px ${7 * unit}px ${3 * unit}px ${3 * unit}px` }}>
                <Img src={staticFile("figma/mqgd5z1w-ghg8vq1.png")} style={{ width: 15 * unit, height: 15 * unit, borderRadius: 999, objectFit: "cover" }} />
                <span style={{ color: "#1f2329", fontSize: 9 * unit, lineHeight: `${11 * unit}px` }}>Mei Li</span>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", columnGap: 4 * unit }}>
                <Img src={staticFile("ui-icons/external-link.svg")} style={{ width: 12 * unit, height: 12 * unit }} />
                <Img src={staticFile("ui-icons/open-square.svg")} style={{ width: 12 * unit, height: 12 * unit }} />
              </span>
            </div>
          </div>
        </div>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: 9 * unit,
              padding: `0 ${7 * unit}px`,
              height: 20 * unit,
              ...getStage2GrowStyle(frame, 2 + index, { origin: "left center", translateY: 4 * unit, ...ganttStage2GrowTiming }),
            }}
          >
            <CheckboxMark checkedProgress={completionProgresses[index + 1]} size={checkboxSize} unit={unit} />
            <div style={{ display: "flex", alignItems: "center", columnGap: 8 * unit, flex: 1, minWidth: 0 }}>
              <div style={getStage2WidthGrowStyle(frame, 5 + index * 2, ganttStage2GrowTiming)}>
                <SkeletonLine width={[67, 56, 184][index] * unit} height={(index === 1 ? 11 : 10) * unit} />
              </div>
              {index < 2 ? (
                <div style={getStage2WidthGrowStyle(frame, 6 + index * 2, ganttStage2GrowTiming)}>
                  <SkeletonLine width={[122, 91][index] * unit} height={10 * unit} />
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GanttContainer = () => {
  const frame = useCurrentFrame();
  const layout = useContainerLayout("gantt");
  const contentWidth = Math.max(layout.width, 1);
  const contentHeight = Math.max(layout.height, 1);

  return (
    <UIContainer layout={layout} background="rgba(255,255,255,0.8)" backdropFilter="blur(22px)" stage2GradientBorder>
      <GanttContent width={contentWidth} height={contentHeight} frame={frame} />
    </UIContainer>
  );
};
