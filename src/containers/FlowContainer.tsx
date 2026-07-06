import { Img, staticFile, useCurrentFrame } from "remotion";
import { getStage4StateChangeProgress, stageFrames, useContainerLayout } from "./layout";
import { getStage2GrowStyle } from "./stage2Grow";
import { UIContainer } from "./UIContainer";

const flowKanbanImageScale = 1.5;
const flowKanbanImageOffsetX = 0;
const flowKanbanImageOffsetY = 4;
const flowKanbanSlideX = 94;

export const flowStage2GrowStartFrame = stageFrames.stage1 + 22;
export const flowStage2GrowDurationFrames = 28;
export const flowStage2GrowStaggerFrames = 4;

const flowStage2GrowTiming = {
  startFrame: flowStage2GrowStartFrame,
  duration: flowStage2GrowDurationFrames,
  staggerFrames: flowStage2GrowStaggerFrames,
};

const FlowContent: React.FC<{ width: number; height: number; progress: number }> = ({ width, height, progress }) => {
  const frame = useCurrentFrame();
  const unit = Math.min(width / 207, height / 151);
  const padding = 7 * unit;
  const headerHeight = 18 * unit;
  const headerGap = 6 * unit;
  const boardWidth = Math.max(width - padding * 2, 1);
  const boardHeight = Math.max(height - padding * 2 - headerHeight - headerGap, 1);
  const translateX = flowKanbanImageOffsetX - flowKanbanSlideX * progress;
  const translateY = flowKanbanImageOffsetY;

  return (
    <div
      style={{
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width,
        height,
        padding,
        overflow: "hidden",
        borderRadius: 10 * unit,
        background: "rgba(255,255,255,0.8)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          columnGap: 6 * unit,
          height: headerHeight,
          flexShrink: 0,
          ...getStage2GrowStyle(frame, 0, { origin: "left center", ...flowStage2GrowTiming }),
        }}
      >
        <Img src={staticFile("ui-icons/flow-kanban.svg")} style={{ width: 18 * unit, height: 18 * unit, borderRadius: 5 * unit }} />
        <p style={{ margin: 0, color: "#1f2329", fontSize: 9 * unit, fontWeight: 800, lineHeight: `${16 * unit}px` }}>
          Task Kanban
        </p>
      </div>
      <div
        style={{
          position: "relative",
          width: boardWidth,
          height: boardHeight,
          marginTop: headerGap,
          overflow: "hidden",
          ...getStage2GrowStyle(frame, 1, { origin: "top center", ...flowStage2GrowTiming }),
        }}
      >
        <Img
          src={staticFile("ui-icons/Kanban.svg")}
          style={{
            display: "block",
            width: boardWidth,
            height: "auto",
            transform: `translate(${translateX}px, ${translateY}px) scale(${flowKanbanImageScale})`,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>
  );
};

export const FlowContainer = () => {
  const frame = useCurrentFrame();
  const layout = useContainerLayout("flow");
  const contentWidth = Math.max(layout.width, 1);
  const contentHeight = Math.max(layout.height, 1);
  const progress = getStage4StateChangeProgress(frame);

  return (
    <UIContainer
      layout={layout}
      background="rgba(255, 255, 255, 0.8)"
      backdropFilter="blur(30px)"
      stage2GradientBorder
    >
      <FlowContent width={contentWidth} height={contentHeight} progress={progress} />
    </UIContainer>
  );
};
