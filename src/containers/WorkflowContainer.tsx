import { Img, staticFile, useCurrentFrame } from "remotion";
import { useCopy, useLocale } from "../localization";
import { localizedFontWeight } from "../typography";
import { getStage3To4MorphProgress, getStage4StateChangeProgress, stageFrames, useContainerLayout } from "./layout";
import { getStage2GrowStyle } from "./stage2Grow";
import { UIContainer } from "./UIContainer";

const fontFamily = "var(--localized-ui-font)";

const stage4WorkflowExtendHeight = 80;

export const workflowStage2GrowStartFrame = stageFrames.stage1 + 20;
export const workflowStage2GrowDurationFrames = 25;
export const workflowStage2GrowStaggerFrames = 4;

const workflowStage2GrowTiming = {
  startFrame: workflowStage2GrowStartFrame,
  duration: workflowStage2GrowDurationFrames,
  staggerFrames: workflowStage2GrowStaggerFrames,
};

const WorkflowContent: React.FC<{ width: number; height: number; progress: number }> = ({ width, height, progress }) => {
  const frame = useCurrentFrame();
  const locale = useLocale();
  const text = useCopy();
  const unit = Math.min(width / 329, height / 224);
  const compactProgress = getStage3To4MorphProgress(frame);
  const paddingX = 10 - compactProgress;
  const paddingY = 10 - compactProgress;
  const paddingBottom = 10 - compactProgress;
  const headerIconSize = 24 - 6 * compactProgress;
  const headerGap = 8 - 2 * compactProgress;
  const headerHeight = 24 - 6 * compactProgress;
  const headerFontSize = 12 - 1.5 * compactProgress;
  const headerLineHeight = 20 - 3 * compactProgress;
  const contentGap = 10 - compactProgress;
  const workflowWidth = Math.max(width - paddingX * 2, 1);
  const workflowHeight = workflowWidth + stage4WorkflowExtendHeight * unit * progress;

  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        width,
        height,
        padding: `${paddingY}px ${paddingX}px ${paddingBottom}px`,
        rowGap: contentGap,
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
          columnGap: headerGap,
          height: headerHeight,
          flexShrink: 0,
          ...getStage2GrowStyle(frame, 0, { origin: "left center", ...workflowStage2GrowTiming }),
        }}
      >
        <div
          style={{
            display: "grid",
            placeItems: "center",
            width: headerIconSize,
            height: headerIconSize,
            borderRadius: 7 - 2 * compactProgress,
            background: "transparent",
          }}
        >
          <Img src={staticFile("ui-icons/workflow-condition-diamond.svg")} style={{ width: headerIconSize, height: headerIconSize }} />
        </div>
        <p style={{ margin: 0, color: "#1f2329", fontSize: headerFontSize, fontWeight: localizedFontWeight("heading", 800), lineHeight: `${headerLineHeight}px` }}>
          {text.taskManagementFlow}
        </p>
      </div>
      <div
        style={{
          position: "relative",
          width: workflowWidth,
          height: workflowHeight,
          marginTop: -1,
          borderRadius: 8 * unit,
          background: "#f8f9fa",
          overflow: "hidden",
          ...getStage2GrowStyle(frame, 1, { origin: "top center", ...workflowStage2GrowTiming }),
        }}
      >
        <Img
          src={staticFile(
            locale === "zh"
              ? "ui-icons/workflow-frame-2147229845-CN.svg"
              : "ui-icons/workflow-frame-2147229845.svg",
          )}
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
