import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { DashboardContainer } from "./containers/DashboardContainer";
import { DocContainer } from "./containers/DocContainer";
import { FlowContainer } from "./containers/FlowContainer";
import { GanttContainer } from "./containers/GanttContainer";
import { ImContainer } from "./containers/ImContainer";
import { InputContainer } from "./containers/InputContainer";
import { getStageDebugLabel } from "./containers/layout";
import { ReminderContainer } from "./containers/ReminderContainer";
import { TaskContainer } from "./containers/TaskContainer";
import { WorkflowContainer } from "./containers/WorkflowContainer";
import { SHOW_DEBUG_OVERLAY } from "./debug";
import { Stage4NetworkBackground } from "./Stage4NetworkBackground";

const verticalMyCompX = 380;
const verticalMyCompY = 540;
const verticalMyCompScale = 1;
const verticalMyCompBorderRadius = 16;
const verticalMyCompBorderColor = "#d8dde7";

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const stageLabel = getStageDebugLabel(frame);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f6f7f8",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {SHOW_DEBUG_OVERLAY ? (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1000,
            borderRadius: 6,
            background: "rgba(15, 23, 42, 0.82)",
            padding: "5px 8px",
            color: "#fff",
            fontSize: 12,
            fontWeight: 800,
            lineHeight: "16px",
            pointerEvents: "none",
          }}
        >
          {`stage: ${stageLabel}`}
        </div>
      ) : null}
      <Stage4NetworkBackground />
      <ReminderContainer />
      <DashboardContainer />
      <GanttContainer />
      <DocContainer />
      <InputContainer />
      <WorkflowContainer />
      <FlowContainer />
      <ImContainer />
      <TaskContainer />
    </AbsoluteFill>
  );
};

export const UIPreviewComposition = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 840,
          height: 624,
          overflow: "hidden",
        }}
      >
        <MyComposition />
      </div>
      <Img
        src={staticFile("UI-mask.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
          translate: "0px 0.3px",
        }}
      />
    </AbsoluteFill>
  );
};

export const VerticalPreviewComposition = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#fff", overflow: "hidden" }}>
      <Img
        src={staticFile("BGvertical.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: verticalMyCompX,
          top: verticalMyCompY,
          width: 840,
          height: 624,
          overflow: "hidden",
          border: `1px solid ${verticalMyCompBorderColor}`,
          borderRadius: verticalMyCompBorderRadius,
          boxSizing: "border-box",
          transform: `scale(${verticalMyCompScale})`,
          transformOrigin: "top left",
        }}
      >
        <MyComposition />
      </div>
    </AbsoluteFill>
  );
};
