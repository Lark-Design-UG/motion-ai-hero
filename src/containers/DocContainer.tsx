import type { ReactNode } from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import {
  getStage4VisualStart,
  getStage4StateChangeProgress,
  getStage4SweepStart,
  getStageTransitionDuration,
  stageFrames,
} from "./layout";
import { useContainerLayout } from "./layout";
import { getStage2GrowStyle, getStage2WidthGrowStyle } from "./stage2Grow";
import { UIContainer } from "./UIContainer";

const fontFamily =
  '"Lark Circular", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif';

export const docStage2GrowStartFrame = stageFrames.stage1 + 6;
export const docStage2GrowDurationFrames = 50;
export const docStage2GrowStaggerFrames = 4;

const docStage2GrowTiming = {
  startFrame: docStage2GrowStartFrame,
  duration: docStage2GrowDurationFrames,
  staggerFrames: docStage2GrowStaggerFrames,
};

const DOC_COVER_DESIGN_WIDTH = 188;
const DOC_COVER_DESIGN_HEIGHT = 75;

const getDocCoverHeight = (bodyWidth: number) =>
  bodyWidth * (DOC_COVER_DESIGN_HEIGHT / DOC_COVER_DESIGN_WIDTH);

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const smoothProgress = (frame: number, start: number, duration: number) => {
  const progress = clamp((frame - start) / duration);

  return progress * progress * (3 - 2 * progress);
};

const Line: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <div
    style={{
      width,
      height,
      borderRadius: height,
      background: "rgba(201,205,212,0.3)",
      flexShrink: 0,
    }}
  />
);

const SpaceIcon: React.FC<{ unit: number }> = ({ unit }) => (
  <Img src={staticFile("ui-icons/doc-file-blue.svg")} style={{ width: 18 * unit, height: 18 * unit, flexShrink: 0 }} />
);

const DocHeader: React.FC<{ unit: number }> = ({ unit }) => (
  <div style={{ display: "inline-flex", alignItems: "center", columnGap: 6 * unit, height: 18 * unit, flexShrink: 0 }}>
    <SpaceIcon unit={unit} />
    <p
      style={{
        margin: 0,
        color: "#1f2329",
        fontSize: 11 * unit,
        fontWeight: 700,
        lineHeight: `${16 * unit}px`,
        fontFamily,
      }}
    >
      Docs
    </p>
  </div>
);

const DocCoverState: React.FC<{ unit: number; width: number; height: number; opacity: number }> = ({ unit, width, height, opacity }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width,
      height,
      opacity,
      borderRadius: 4 * unit,
      overflow: "hidden",
    }}
  >
    <Img
      src={staticFile("figma/mqhqfw2h-0xhdv38.png")}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }}
    />
    <p
      style={{
        position: "absolute",
        top: 7 * unit,
        left: 7 * unit,
        width: 63 * unit,
        margin: 0,
        color: "#fff",
        fontSize: 9 * unit,
        fontWeight: 700,
        lineHeight: `${11 * unit}px`,
        textTransform: "uppercase",
        fontFamily,
      }}
    >
      weekly report
    </p>
    <p
      style={{
        position: "absolute",
        top: 36 * unit,
        left: 70 * unit,
        width: 86 * unit,
        margin: 0,
        color: "rgba(255,255,255,0.4)",
        fontSize: 19 * unit,
        fontWeight: 700,
        lineHeight: `${14 * unit}px`,
        textTransform: "uppercase",
        fontFamily,
      }}
    >
      2026 Q3
    </p>
  </div>
);

const DefaultCoverState: React.FC<{
  unit: number;
  width: number;
  height: number;
  opacity: number;
  compact?: boolean;
}> = ({
  unit,
  width,
  height,
  opacity,
  compact = false,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width,
      height,
      opacity,
      borderRadius: 6 * unit,
      overflow: "hidden",
    }}
  >
    <Img
      src={staticFile("figma/mqgd6f3w-jpfnynu.png")}
      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }}
    />
    <p
      style={{
        position: "absolute",
        top: (compact ? 7 : 11) * unit,
        left: (compact ? 7 : 13) * unit,
        width: (compact ? 63 : 92) * unit,
        margin: 0,
        color: "#fff",
        fontSize: (compact ? 9 : 11) * unit,
        fontWeight: 800,
        lineHeight: `${(compact ? 11 : 14) * unit}px`,
        textTransform: "uppercase",
        fontFamily,
      }}
    >
      weekly report
    </p>
    <p
      style={{
        position: "absolute",
        right: compact ? undefined : 18 * unit,
        bottom: compact ? undefined : 10 * unit,
        top: compact ? 36 * unit : undefined,
        left: compact ? 70 * unit : undefined,
        width: compact ? 86 * unit : undefined,
        margin: 0,
        color: compact ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.82)",
        fontSize: (compact ? 19 : 24) * unit,
        fontWeight: 800,
        lineHeight: `${(compact ? 14 : 24) * unit}px`,
      }}
    >
      2026 Q3
    </p>
  </div>
);

const GeneratedDocText: React.FC<{ unit: number; progress: number }> = ({ unit, progress }) => (
  <div style={{ display: "flex", flexDirection: "column", rowGap: 6 * unit, width: "100%", opacity: progress }}>
    <div style={{ display: "flex", alignItems: "flex-start", columnGap: 5 * unit, paddingLeft: 3 * unit }}>
      <div style={{ width: 3 * unit, height: 3 * unit, marginTop: 5 * unit, borderRadius: 999, background: "#5b65f5", flexShrink: 0 }} />
      <p
        style={{
          flex: 1,
          margin: 0,
          color: "#646a73",
          fontSize: 7 * unit,
          lineHeight: `${11 * unit}px`,
          fontFamily,
        }}
      >
        Site setup, staffing, and launch prep are progressing as scheduled. No major issues flagged this week.
      </p>
    </div>
    <div style={{ display: "flex", alignItems: "flex-start", columnGap: 5 * unit, paddingLeft: 3 * unit }}>
      <div style={{ width: 3 * unit, height: 3 * unit, marginTop: 5 * unit, borderRadius: 999, background: "#5b65f5", flexShrink: 0 }} />
      <Img
        src={staticFile("ui-icons/doc-generated-lines.svg")}
        style={{
          width: Math.min(127 * unit, 0.86 * 163 * unit),
          height: 15 * unit,
          opacity: smoothProgress(progress, 0.18, 0.62),
          transform: `scaleX(${0.7 + 0.3 * smoothProgress(progress, 0.18, 0.62)})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  </div>
);

const Stage4DocBody: React.FC<{ width: number; height: number; unit: number; frame: number }> = ({ width, height, unit, frame }) => {
  const generatedProgress = getStage4StateChangeProgress(frame);
  const coverSwitchProgress = smoothProgress(frame, getStage4SweepStart() + 20, 18);
  const coverHeight = getDocCoverHeight(width);

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <DefaultCoverState
        unit={unit}
        width={width}
        height={coverHeight}
        opacity={(1 - coverSwitchProgress) * (1 - generatedProgress)}
        compact
      />
      <DocCoverState unit={unit} width={width} height={coverHeight} opacity={coverSwitchProgress * (1 - generatedProgress)} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: generatedProgress,
          transform: `translateY(${(1 - generatedProgress) * 5 * unit}px)`,
        }}
      >
        <GeneratedDocText unit={unit} progress={generatedProgress} />
      </div>
    </div>
  );
};

const DefaultDocBody: React.FC<{ width: number; height: number; unit: number; detailsOpacity?: number }> = ({
  width,
  height,
  unit,
  detailsOpacity = 1,
}) => {
  const frame = useCurrentFrame();
  const detailProgress = clamp(detailsOpacity);
  const gap = detailProgress > 0 ? 10 * unit * detailProgress : 0;
  const coverHeight = getDocCoverHeight(width);
  const detailsHeight =
    detailProgress > 0 ? Math.min(56 * unit, Math.max(0, height - coverHeight - gap)) * detailProgress : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: gap, width, height, minHeight: 0 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: coverHeight,
          borderRadius: 6 * unit,
          overflow: "hidden",
          flexShrink: 0,
          ...getStage2GrowStyle(frame, 1, { origin: "top center", ...docStage2GrowTiming }),
        }}
      >
        <DefaultCoverState unit={unit} width={width} height={coverHeight} opacity={1} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: 8 * unit,
          height: detailsHeight,
          minHeight: 0,
          opacity: detailProgress,
          overflow: "hidden",
          transform: `translateY(${(1 - detailProgress) * -4 * unit}px)`,
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#1f2329",
            fontSize: 12 * unit,
            fontWeight: 600,
            lineHeight: `${16 * unit}px`,
            ...getStage2GrowStyle(frame, 2, { origin: "left center", translateY: 3 * unit, ...docStage2GrowTiming }),
          }}
        >
          Overall Status: On track
        </p>
        <div style={getStage2WidthGrowStyle(frame, 3, docStage2GrowTiming)}>
          <Line width={Math.min(194 * unit, width)} height={8 * unit} />
        </div>
        <div style={getStage2WidthGrowStyle(frame, 4, docStage2GrowTiming)}>
          <Line width={width} height={8 * unit} />
        </div>
        <div style={getStage2WidthGrowStyle(frame, 5, docStage2GrowTiming)}>
          <Line width={Math.min(124 * unit, width)} height={8 * unit} />
        </div>
      </div>
    </div>
  );
};

const DocContentShell: React.FC<{ width: number; height: number; children: (metrics: { unit: number; bodyWidth: number; bodyHeight: number }) => ReactNode }> = ({
  width,
  height,
  children,
}) => {
  const frame = useCurrentFrame();
  const unit = Math.min(width / 214, height / 124);
  const paddingX = 8 * unit;
  const paddingY = 8 * unit;
  const headerHeight = 18 * unit;
  const gap = 9 * unit;
  const bodyWidth = Math.max(width - paddingX * 2, 1);
  const bodyHeight = Math.max(height - paddingY * 2 - headerHeight - gap, 1);

  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        width,
        height,
        padding: `${paddingY}px ${paddingX}px`,
        rowGap: gap,
        overflow: "hidden",
        borderRadius: 12 * unit,
        background: "rgba(255,255,255,0.8)",
        fontFamily,
      }}
    >
      <div style={getStage2GrowStyle(frame, 0, { origin: "left center", ...docStage2GrowTiming })}>
        <DocHeader unit={unit} />
      </div>
      {children({ unit, bodyWidth, bodyHeight })}
    </div>
  );
};

export const DocContainer = () => {
  const frame = useCurrentFrame();
  const layout = useContainerLayout("doc");
  const contentWidth = Math.max(layout.width, 1);
  const contentHeight = Math.max(layout.height, 1);
  const stage4VisualStart = getStage4VisualStart();
  const stage4ContentStart = getStage4SweepStart() + 20;
  const stage4ContentBlend = smoothProgress(frame, stage4ContentStart, 18);
  const isStage4Doc = frame >= stage4ContentStart;
  const stage3To4DetailsOpacity = 1 - smoothProgress(frame, stageFrames.stage3, getStageTransitionDuration("stage3"));
  const defaultDetailsOpacity = frame >= stage4VisualStart ? 0 : stage3To4DetailsOpacity;

  return (
    <UIContainer layout={layout} background="rgba(255,255,255,0.8)" backdropFilter="blur(22px)" stage2GradientBorder>
      <DocContentShell width={contentWidth} height={contentHeight}>
        {({ unit, bodyWidth, bodyHeight }) => {
          const defaultBody = (
            <DefaultDocBody
              width={bodyWidth}
              height={bodyHeight}
              unit={unit}
              detailsOpacity={defaultDetailsOpacity}
            />
          );

          if (!isStage4Doc) {
            return defaultBody;
          }

          if (stage4ContentBlend >= 1) {
            return <Stage4DocBody width={bodyWidth} height={bodyHeight} unit={unit} frame={frame} />;
          }

          return (
            <div style={{ position: "relative", width: bodyWidth, height: bodyHeight }}>
              <div style={{ position: "absolute", inset: 0, opacity: 1 - stage4ContentBlend }}>
                {defaultBody}
              </div>
              <div style={{ position: "absolute", inset: 0, opacity: stage4ContentBlend }}>
                <Stage4DocBody width={bodyWidth} height={bodyHeight} unit={unit} frame={frame} />
              </div>
            </div>
          );
        }}
      </DocContentShell>
    </UIContainer>
  );
};
