import type { CSSProperties } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { DashboardContainer } from "./containers/DashboardContainer";
import { DocContainer } from "./containers/DocContainer";
import { FlowContainer } from "./containers/FlowContainer";
import { GanttContainer } from "./containers/GanttContainer";
import { ImContainer } from "./containers/ImContainer";
import { InputContainer } from "./containers/InputContainer";
import {
  getStageDebugLabel,
  LayoutVariantProvider,
  type LayoutVariant,
} from "./containers/layout";
import { ReminderContainer } from "./containers/ReminderContainer";
import { TaskContainer } from "./containers/TaskContainer";
import { WorkflowContainer } from "./containers/WorkflowContainer";
import { SHOW_DEBUG_OVERLAY } from "./debug";
import { LocaleProvider, type Locale } from "./localization";
import { Stage4NetworkBackground } from "./Stage4NetworkBackground";
import { getRootFontFamily, getUiFontFamily } from "./typography";

const verticalMyCompX = 216;
const verticalMyCompY = 416 + 64;
const verticalMyCompScale = 1;
const verticalMyCompBorderRadius = 16;
const verticalMyCompBorderColor = "#d8dde7";

const WideBackground = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        left: 83.98,
        top: 0,
        width: 992,
        height: 623,
        boxSizing: "border-box",
        borderBottom: "1px solid #e1e7ec",
        borderLeft: "1px solid #e1e7ec",
        background: "#f6f7f8",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: -105.02,
        top: 0,
        width: 1181,
        height: 623,
        boxSizing: "border-box",
        borderBottom: "1px solid #e1e7ec",
        borderLeft: "1px solid #e1e7ec",
        backgroundImage: "linear-gradient(125.31612097560921deg, rgb(229, 240, 249) 11.592%, rgb(247, 233, 226) 86.531%)",
      }}
    />
  </div>
);

export type MyCompositionProps = {
  locale?: Locale;
  layoutVariant?: LayoutVariant;
};

export const MyComposition: React.FC<MyCompositionProps> = ({
  locale = "en",
  layoutVariant = "default",
}) => {
  const frame = useCurrentFrame();
  const stageLabel = getStageDebugLabel(frame);
  const localizedFontStyle = {
    "--localized-ui-font": getUiFontFamily(locale),
    "--localized-emphasis-weight": locale === "zh" ? 700 : undefined,
    "--localized-heading-weight": locale === "zh" ? 600 : undefined,
    "--localized-label-weight": locale === "zh" ? 500 : undefined,
  } as CSSProperties;

  return (
    <LocaleProvider locale={locale}>
      <LayoutVariantProvider variant={layoutVariant}>
        <AbsoluteFill
          style={{
            ...localizedFontStyle,
            backgroundColor: "#f6f7f8",
            fontFamily: getRootFontFamily(locale),
          }}
        >
          {layoutVariant === "wide" ? <WideBackground /> : null}
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
          {layoutVariant !== "wide" ? (
            <Img
              src={staticFile("mask.png")}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "fill",
                pointerEvents: "none",
                zIndex: 999,
                translate: "-0.2px 0.2px",
              }}
            />
          ) : null}
        </AbsoluteFill>
      </LayoutVariantProvider>
    </LocaleProvider>
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

export type VerticalPreviewCompositionProps = {
  backgroundFile?: string;
  myCompTop?: number;
};

export const VerticalPreviewComposition: React.FC<VerticalPreviewCompositionProps> = ({
  backgroundFile = "BGvertical_new.png",
  myCompTop = verticalMyCompY,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#fff", overflow: "hidden" }}>
      <Img
        src={staticFile(backgroundFile)}
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
          top: myCompTop,
          width: 1008,
          height: 521,
          overflow: "hidden",
          border: `1px solid ${verticalMyCompBorderColor}`,
          borderRadius: verticalMyCompBorderRadius,
          boxSizing: "border-box",
          transform: `scale(${verticalMyCompScale})`,
          transformOrigin: "top left",
        }}
      >
        <MyComposition layoutVariant="wide" />
      </div>
    </AbsoluteFill>
  );
};
