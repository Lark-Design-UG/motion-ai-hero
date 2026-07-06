import type { ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { SHOW_DEBUG_OVERLAY } from "../debug";
import {
  getStage4SweepStart,
  getStageTransitionDuration,
  stage4SweepDurationFrames,
  stageFrames,
  type ContainerLayout,
} from "./layout";

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const stage4SweepPasses = 4;

const getStage4BorderOpacity = (frame: number) => {
  const enterProgress = clamp((frame - stageFrames.stage3) / getStageTransitionDuration("stage3"));
  const exitProgress = clamp((frame - stageFrames.stage4) / getStageTransitionDuration("stage4"));

  return enterProgress * (1 - exitProgress);
};

const getPreStage4ShadowOpacity = (frame: number) => {
  return 1 - clamp((frame - stageFrames.stage3) / getStageTransitionDuration("stage3"));
};

const getStage4SweepProgress = (frame: number) => {
  return clamp((frame - getStage4SweepStart()) / stage4SweepDurationFrames);
};

export const getGradientBorderBackground = (angle: number) =>
  `conic-gradient(from ${angle}deg, #4b79ff 0deg, #6785ff 95deg, #ff8cf4 205deg, #ff9a45 300deg, #4b79ff 360deg)`;

export const getStage4Border = (opacity: number, width = 0.75) =>
  `${width}px solid rgba(148, 180, 255, ${opacity})`;

const getStage2BorderOpacity = (frame: number) => {
  const stage1End = stageFrames.stage1;
  const stage2Start = stage1End;
  const stage2End = stageFrames.stage2;
  const enterProgress = clamp((frame - stage2Start) / (stage2End - stage2Start) * 2);
  const exitProgress = clamp((frame - stage2Start - (stage2End - stage2Start) * 0.65) / ((stage2End - stage2Start) * 0.35));

  return enterProgress * (1 - exitProgress);
};

export const UIContainer: React.FC<{
  layout: ContainerLayout;
  children?: ReactNode;
  gradientBorder?: boolean;
  stage2GradientBorder?: boolean;
  borderRadius?: number;
  background?: string;
  backdropFilter?: string;
  borderOpacityOverride?: number;
  pressProgress?: number;
}> = ({
  layout,
  children,
  gradientBorder = false,
  stage2GradientBorder = false,
  borderRadius = layout.borderRadius,
  background = "#ffffff",
  backdropFilter,
  borderOpacityOverride,
  pressProgress = 0,
}) => {
  const frame = useCurrentFrame();
  const stage4BorderOpacity = getStage4BorderOpacity(frame);
  const stage2BorderOpacity = stage2GradientBorder ? getStage2BorderOpacity(frame) : 0;
  const borderOpacity = borderOpacityOverride ?? (layout.id === "input" ? 1 : stage4BorderOpacity);
  const borderWidth = layout.id === "input" ? 1 : 0.75;
  const shadowOpacity = layout.id === "input" ? 0 : 0.06 * getPreStage4ShadowOpacity(frame);
  const gradientGlowOpacity = layout.id === "input" ? borderOpacity * 0.22 : stage2BorderOpacity * 0.18;
  const sweepProgress = getStage4SweepProgress(frame);
  const sweepPassProgress = (sweepProgress * stage4SweepPasses) % 1;
  const sweepEnvelope = Math.sin(Math.PI * sweepProgress);
  const sweepOpacity = layout.id === "input" ? 0 : Math.sin(Math.PI * sweepPassProgress) * sweepEnvelope * 0.78 * borderOpacity;
  const gradientColorAngle = frame * 1.25;
  const gradientBackground = getGradientBorderBackground(gradientColorAngle);
  const pressScale = 1 - 0.018 * Math.sin(Math.PI * pressProgress);
  const pressY = 1.8 * Math.sin(Math.PI * pressProgress);
  const sweepLayer =
    sweepOpacity > 0 ? (
      <div
        style={{
          position: "absolute",
          top: "-65%",
          bottom: "-65%",
          left: "-70%",
          width: "72%",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.42) 24%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.42) 76%, transparent 100%)",
          filter: "blur(1.5px)",
          opacity: sweepOpacity,
          transform: `translateX(${sweepPassProgress * 330}%) skewX(-18deg)`,
          pointerEvents: "none",
          zIndex: 8,
        }}
      />
    ) : null;
  const debugLabel = SHOW_DEBUG_OVERLAY ? (
    <div
      style={{
        position: "absolute",
        top: 6,
        left: 6,
        zIndex: 10,
        borderRadius: 4,
        background: "rgba(15, 23, 42, 0.72)",
        padding: "2px 6px",
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        lineHeight: "14px",
        letterSpacing: 0.2,
        pointerEvents: "none",
      }}
    >
      {layout.id}
    </div>
  ) : null;
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    boxSizing: "border-box",
    zIndex: layout.zIndex,
    left: layout.x,
    top: layout.y,
    width: layout.width,
    height: layout.height,
    opacity: layout.opacity,
    transform: `translateY(${pressY}px) scale(${layout.scale * pressScale})`,
    transformOrigin: layout.transformOrigin,
    borderRadius,
    background,
    backdropFilter,
    boxShadow: `0 8px 24px rgba(62, 79, 107, ${shadowOpacity})`,
    overflow: "hidden",
  };

  if (gradientBorder) {
    return (
      <div
        style={{
          ...baseStyle,
          padding: borderWidth,
          background: "transparent",
          overflow: "visible",
        }}
      >
        {gradientGlowOpacity > 0 ? (
          <div
            style={{
              position: "absolute",
              inset: -5,
              borderRadius: borderRadius + 3,
              transform: "translateY(5px)",
              background: gradientBackground,
              filter: "blur(7px)",
              opacity: gradientGlowOpacity,
              pointerEvents: "none",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius,
            overflow: "hidden",
            opacity: borderOpacity,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: gradientBackground,
            }}
          />
        </div>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: Math.max(borderRadius - borderWidth, 0),
            background: "#fff",
            overflow: "hidden",
          }}
        >
          {debugLabel}
          {children}
          {sweepLayer}
        </div>
      </div>
    );
  }

  if (stage2GradientBorder) {
    return (
      <div
        style={{
          ...baseStyle,
          background: "transparent",
          overflow: "visible",
        }}
      >
        {stage2BorderOpacity > 0 ? (
          <div
            style={{
              position: "absolute",
              inset: -5,
              borderRadius: borderRadius + 3,
              transform: "translateY(5px)",
              background: gradientBackground,
              filter: "blur(7px)",
              opacity: stage2BorderOpacity * 0.18,
              pointerEvents: "none",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius,
            background,
            backdropFilter,
            overflow: "hidden",
            border:
              stage4BorderOpacity > 0
                ? getStage4Border(stage4BorderOpacity, borderWidth)
                : undefined,
            boxSizing: "border-box",
          }}
        >
          {debugLabel}
          {children}
          {sweepLayer}
        </div>
        <div
          style={{
            boxSizing: "border-box",
            position: "absolute",
            inset: 0,
            padding: borderWidth,
            borderRadius,
            background: gradientBackground,
            opacity: stage2BorderOpacity,
            pointerEvents: "none",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        ...baseStyle,
        border: getStage4Border(borderOpacity, borderWidth),
      }}
    >
      {debugLabel}
      {children}
      {sweepLayer}
    </div>
  );
};
