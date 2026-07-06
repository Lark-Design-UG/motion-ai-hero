import { Img, staticFile, useCurrentFrame } from "remotion";
import { getStage4StateChangeProgress, stageFrames, useContainerLayout } from "./layout";
import { getStage2GrowStyle } from "./stage2Grow";
import { UIContainer } from "./UIContainer";

const fontFamily =
  '"Lark Circular", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif';

const stage4WorkflowExtendHeight = 80;

export const workflowStage2GrowStartFrame = stageFrames.stage1 + 20;
export const workflowStage2GrowDurationFrames = 40;
export const workflowStage2GrowStaggerFrames = 4;

const workflowStage2GrowTiming = {
  startFrame: workflowStage2GrowStartFrame,
  duration: workflowStage2GrowDurationFrames,
  staggerFrames: workflowStage2GrowStaggerFrames,
};

const WorkflowContent: React.FC<{ width: number; height: number; progress: number }> = ({ width, height, progress }) => {
  const frame = useCurrentFrame();
  const unit = Math.min(width / 329, height / 224);
  const workflowWidth = width - 24 * unit;
  const workflowHeight = workflowWidth + stage4WorkflowExtendHeight * unit * progress;
  const workflowLeft = (width - workflowWidth) / 2;

  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        width,
        height,
        padding: `${11 * unit}px ${13 * unit}px ${12 * unit}px`,
        rowGap: 10 * unit,
        overflow: "hidden",
        borderRadius: 11 * unit,
        background: "rgba(255,255,255,0.8)",
        fontFamily,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          columnGap: 8 * unit,
          height: 28 * unit,
          ...getStage2GrowStyle(frame, 0, { origin: "left center", ...workflowStage2GrowTiming }),
        }}
      >
        <div
          style={{
            display: "grid",
            placeItems: "center",
            width: 28 * unit,
            height: 28 * unit,
            borderRadius: 7 * unit,
            background: "transparent",
          }}
        >
          <Img src={staticFile("ui-icons/workflow-condition-diamond.svg")} style={{ width: 18 * unit, height: 18 * unit }} />
        </div>
        <p style={{ margin: 0, color: "#1f2329", fontSize: 15 * unit, fontWeight: 800, lineHeight: `${22 * unit}px` }}>
          Task Management Flow
        </p>
      </div>
      <div
        style={{
          position: "relative",
          width: workflowWidth,
          height: workflowHeight,
          marginLeft: workflowLeft - 13 * unit,
          marginTop: -1 * unit,
          borderRadius: 8 * unit,
          background: "#f8f9fa",
          overflow: "hidden",
          ...getStage2GrowStyle(frame, 1, { origin: "top center", ...workflowStage2GrowTiming }),
        }}
      >
        <Img
          src={staticFile("ui-icons/workflow-frame-2147229845.svg")}
          style={{
            display: "block",
            width: workflowWidth,
            height: workflowWidth,
            objectFit: "fill",
          }}
        />
      </div>
    </div>
  );
};

export const WorkflowContainer = () => {
  const frame = useCurrentFrame();
  const layout = useContainerLayout("workflow");
  const progress = getStage4StateChangeProgress(frame);
  const extendedLayout = {
    ...layout,
    height: layout.height + stage4WorkflowExtendHeight * progress,
  };
  const contentWidth = Math.max(extendedLayout.width, 1);
  const contentHeight = Math.max(extendedLayout.height, 1);

  return (
    <UIContainer layout={extendedLayout} background="rgba(255,255,255,0.8)" backdropFilter="blur(22px)" stage2GradientBorder>
      <WorkflowContent width={contentWidth} height={contentHeight} progress={progress} />
    </UIContainer>
  );
};
