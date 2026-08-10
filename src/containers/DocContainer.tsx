import type { ReactNode } from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { useCopy } from "../localization";
import { localizedFontWeight } from "../typography";
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

const fontFamily = "var(--localized-ui-font)";

export const docStage2GrowStartFrame = stageFrames.stage1 + 6;
export const docStage2GrowDurationFrames = 50;
export const docStage2GrowStaggerFrames = 4;

const docStage2GrowTiming = {
  startFrame: docStage2GrowStartFrame,
  duration: docStage2GrowDurationFrames,
  staggerFrames: docStage2GrowStaggerFrames,
};

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;
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

const SpaceIcon: React.FC<{ size: number }> = ({ size }) => (
  <Img src={staticFile("ui-icons/doc-file-blue.svg")} style={{ width: size, height: size, flexShrink: 0 }} />
);

const DocHeader: React.FC<{
  iconSize: number;
  gap: number;
  height: number;
  fontSize: number;
  lineHeight: number;
}> = ({ iconSize, gap, height, fontSize, lineHeight }) => {
  const text = useCopy();

  return (
    <div style={{ display: "inline-flex", alignItems: "center", columnGap: gap, height, flexShrink: 0 }}>
      <SpaceIcon size={iconSize} />
      <p
        style={{
          margin: 0,
          color: "#1f2329",
          fontSize,
          fontWeight: localizedFontWeight("heading", 700),
          lineHeight: `${lineHeight}px`,
          fontFamily,
        }}
      >
        {text.docs}
      </p>
    </div>
  );
};

const DocCoverState: React.FC<{ unit: number; width: number; height: number; opacity: number }> = ({ unit, width, height, opacity }) => {
  const text = useCopy();

  return (
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
      {text.weeklyReport}
    </p>
    <p
      style={{
        position: "absolute",
        top: 36 * unit,
        left: 70 * unit,
        width: 86 * unit,
        margin: 0,
        color: "rgba(255,255,255,0.4)",
        fontSize: (text.reportPeriod.length > 8 ? 12 : 19) * unit,
        fontWeight: 700,
        lineHeight: `${14 * unit}px`,
        textTransform: "uppercase",
        fontFamily,
      }}
    >
      {text.reportPeriod}
    </p>
    </div>
  );
};

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
}) => {
  const text = useCopy();

  return (
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
        fontWeight: localizedFontWeight("emphasis", 800),
        lineHeight: `${(compact ? 11 : 14) * unit}px`,
        textTransform: "uppercase",
        fontFamily,
      }}
    >
      {text.weeklyReport}
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
        fontSize: (text.reportPeriod.length > 8 ? (compact ? 12 : 16) : (compact ? 19 : 24)) * unit,
        fontWeight: localizedFontWeight("emphasis", 800),
        lineHeight: `${(compact ? 14 : 24) * unit}px`,
      }}
    >
      {text.reportPeriod}
    </p>
    </div>
  );
};

const GeneratedDocText: React.FC<{ unit: number; progress: number }> = ({ unit, progress }) => {
  const text = useCopy();

  return (
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
        {text.generatedSummary}
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
};

const Stage4DocBody: React.FC<{ width: number; height: number; unit: number; frame: number; coverHeight: number }> = ({ width, height, unit, frame, coverHeight }) => {
  const generatedProgress = getStage4StateChangeProgress(frame);
  const coverSwitchProgress = smoothProgress(frame, getStage4SweepStart() + 20, 18);

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

const DefaultDocBody: React.FC<{
  width: number;
  height: number;
  unit: number;
  coverHeight: number;
  detailsGap: number;
  detailsOpacity?: number;
}> = ({
  width,
  height,
  unit,
  coverHeight,
  detailsGap,
  detailsOpacity = 1,
}) => {
  const frame = useCurrentFrame();
  const text = useCopy();
  const detailProgress = clamp(detailsOpacity);
  const gap = detailProgress > 0 ? detailsGap * detailProgress : 0;
  const detailsHeight = detailProgress > 0 ? Math.max(0, height - coverHeight - gap) * detailProgress : 0;
  const thirdLineFitProgress = clamp((detailsHeight - 64 * unit) / (8 * unit));
  const thirdLineGrowStyle = getStage2WidthGrowStyle(frame, 5, docStage2GrowTiming);
  const thirdLineGrowOpacity = typeof thirdLineGrowStyle.opacity === "number" ? thirdLineGrowStyle.opacity : 1;

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
            fontSize: 8 * unit,
            fontWeight: 600,
            lineHeight: `${16 * unit}px`,
            ...getStage2GrowStyle(frame, 2, { origin: "left center", translateY: 3 * unit, ...docStage2GrowTiming }),
          }}
        >
          {text.overallStatus}
        </p>
        <div style={getStage2WidthGrowStyle(frame, 3, docStage2GrowTiming)}>
          <Line width={Math.min(194 * unit, width)} height={8 * unit} />
        </div>
        <div style={getStage2WidthGrowStyle(frame, 4, docStage2GrowTiming)}>
          <Line width={width} height={8 * unit} />
        </div>
        <div
          style={{
            ...thirdLineGrowStyle,
            opacity: thirdLineGrowOpacity * thirdLineFitProgress,
          }}
        >
          <Line width={Math.min(124 * unit, width)} height={8 * unit} />
        </div>
      </div>
    </div>
  );
};

const DocContentShell: React.FC<{
  width: number;
  height: number;
  children: (metrics: {
    unit: number;
    bodyWidth: number;
    bodyHeight: number;
    coverHeight: number;
    detailsGap: number;
  }) => ReactNode;
}> = ({
  width,
  height,
  children,
}) => {
  const frame = useCurrentFrame();
  const compactProgress = clamp((190 - height) / (190 - 105.67));
  const unit = lerp(1, 0.75, compactProgress);
  const paddingX = lerp(10, 9, compactProgress);
  const paddingY = lerp(10, 9, compactProgress);
  const headerHeight = lerp(24, 18, compactProgress);
  const headerIconSize = lerp(24, 18, compactProgress);
  const headerGap = lerp(8, 6, compactProgress);
  const headerFontSize = lerp(12, 10.5, compactProgress);
  const headerLineHeight = lerp(20, 16, compactProgress);
  const gap = lerp(10, 9, compactProgress);
  const bodyWidth = Math.max(width - paddingX * 2, 1);
  const bodyHeight = Math.max(height - paddingY - headerHeight - gap, 1);
  const coverHeight = Math.min(lerp(80.893, 60.67, compactProgress), bodyHeight);
  const detailsGap = lerp(10, 9, compactProgress);

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
        borderRadius: lerp(12, 9, compactProgress),
        background: "rgba(255,255,255,0.8)",
        fontFamily,
      }}
    >
      <div
        style={{
          display: "flex",
          height: headerHeight,
          flexShrink: 0,
          ...getStage2GrowStyle(frame, 0, { origin: "left center", ...docStage2GrowTiming }),
        }}
      >
        <DocHeader
          iconSize={headerIconSize}
          gap={headerGap}
          height={headerHeight}
          fontSize={headerFontSize}
          lineHeight={headerLineHeight}
        />
      </div>
      {children({ unit, bodyWidth, bodyHeight, coverHeight, detailsGap })}
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
        {({ unit, bodyWidth, bodyHeight, coverHeight, detailsGap }) => {
          const defaultBody = (
            <DefaultDocBody
              width={bodyWidth}
              height={bodyHeight}
              unit={unit}
              coverHeight={coverHeight}
              detailsGap={detailsGap}
              detailsOpacity={defaultDetailsOpacity}
            />
          );

          if (!isStage4Doc) {
            return defaultBody;
          }

          if (stage4ContentBlend >= 1) {
            return <Stage4DocBody width={bodyWidth} height={bodyHeight} unit={unit} frame={frame} coverHeight={coverHeight} />;
          }

          return (
            <div style={{ position: "relative", width: bodyWidth, height: bodyHeight }}>
              <div style={{ position: "absolute", inset: 0, opacity: 1 - stage4ContentBlend }}>
                {defaultBody}
              </div>
              <div style={{ position: "absolute", inset: 0, opacity: stage4ContentBlend }}>
                <Stage4DocBody width={bodyWidth} height={bodyHeight} unit={unit} frame={frame} coverHeight={coverHeight} />
              </div>
            </div>
          );
        }}
      </DocContentShell>
    </UIContainer>
  );
};
