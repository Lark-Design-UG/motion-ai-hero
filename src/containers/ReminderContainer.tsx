import type { CSSProperties } from "react";
import { useCurrentFrame } from "remotion";
import { useCopy } from "../localization";
import { getStage4StateChangeProgress, getStage4SweepStart, stageFrames } from "./layout";
import { useContainerLayout } from "./layout";
import { getStage2GrowStyle } from "./stage2Grow";
import { UIContainer } from "./UIContainer";

const fontFamily = "var(--localized-ui-font)";

export const reminderStage2GrowStartFrame = stageFrames.stage1 + 10;
export const reminderStage2GrowDurationFrames = 30;
export const reminderStage2GrowStaggerFrames = 4;
export const reminderStage2HeaderFadeDurationFrames = 14;

const reminderStage2GrowTiming = {
  startFrame: reminderStage2GrowStartFrame,
  duration: reminderStage2GrowDurationFrames,
  staggerFrames: reminderStage2GrowStaggerFrames,
};

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;
const mixRgb = (
  from: [number, number, number],
  to: [number, number, number],
  progress: number,
) => `rgb(${Math.round(lerp(from[0], to[0], progress))}, ${Math.round(lerp(from[1], to[1], progress))}, ${Math.round(lerp(from[2], to[2], progress))})`;

const smoothProgress = (frame: number, start: number, duration: number) => {
  const progress = clamp((frame - start) / duration);

  return progress * progress * (3 - 2 * progress);
};

const ReminderContent: React.FC<{ width: number; height: number; frame: number; borderRadius: number }> = ({ width, height, frame, borderRadius }) => {
  const text = useCopy();
  const compactProgress = clamp((136 - height) / (136 - 105));
  const animationUnit = lerp(1, 0.68, compactProgress);
  const headerHeight = lerp(45, 31.806, compactProgress);
  const contentInset = lerp(12, 11.875, compactProgress);
  const bodyPaddingTop = lerp(12, 8, compactProgress);
  const bodyPaddingBottom = lerp(12, 10, compactProgress);
  const headerIconSize = lerp(24, 18, compactProgress);
  const headerIconFontSize = lerp(18, 14, compactProgress);
  const headerGap = lerp(8, 6, compactProgress);
  const buttonHeight = lerp(31, 22.5, compactProgress);
  const buttonRadius = lerp(6, 2.849, compactProgress);
  const bodyFontSize = lerp(11, 7.5, compactProgress);
  const bodyLineHeight = lerp(17, 12.5, compactProgress);
  const buttonFontSize = lerp(12, 8.21, compactProgress);
  const buttonLineHeight = lerp(14, 12.316, compactProgress);
  const completedProgress = getStage4StateChangeProgress(frame);
  const clickProgress = smoothProgress(frame, getStage4SweepStart() + 14, 12);
  const pressScale = 1 - Math.sin(Math.PI * clickProgress) * 0.035;
  const buttonColor = mixRgb([80, 131, 251], [36, 198, 90], completedProgress);
  const headerOpacity = smoothProgress(frame, reminderStage2GrowStartFrame, reminderStage2HeaderFadeDurationFrames);
  const textStyle: CSSProperties = {
    margin: 0,
    color: "#1f2329",
    fontSize: bodyFontSize,
    lineHeight: `${bodyLineHeight}px`,
    fontFamily,
  };

  return (
    <div
      style={{
        boxSizing: "border-box",
        position: "relative",
        width,
        height,
        overflow: "hidden",
        borderRadius,
        background: "#fff",
        fontFamily,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width,
          height: headerHeight,
          padding: `0 ${contentInset}px`,
          background: "#efe6fe",
          color: "#7a35f0",
          fontSize: lerp(12, 10.5, compactProgress),
          fontWeight: 600,
          lineHeight: `${lerp(20, 16, compactProgress)}px`,
          letterSpacing: lerp(-0.1, -0.09, compactProgress),
          whiteSpace: "nowrap",
          overflow: "hidden",
          opacity: headerOpacity,
        }}
      >
        <span
          style={{
            display: "inline-grid",
            placeItems: "center",
            width: headerIconSize,
            height: headerIconSize,
            marginRight: headerGap,
            fontSize: headerIconFontSize,
            lineHeight: 1,
          }}
        >
          ⏰
        </span>
        <span>{text.riskReminder}</span>
      </div>
      <div
        style={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width,
          height: Math.max(height - headerHeight, 1),
          padding: `${bodyPaddingTop}px ${contentInset}px ${bodyPaddingBottom}px`,
        }}
      >
        <p style={{ ...textStyle, ...getStage2GrowStyle(frame, 1, { origin: "left center", translateY: 4 * animationUnit, ...reminderStage2GrowTiming }) }}>
          {text.taskDueToday}
          <br />
          {text.completeSoon}
        </p>
        <div
          style={{
            display: "grid",
            placeItems: "center",
            width: "100%",
            height: buttonHeight,
            position: "relative",
            overflow: "hidden",
            border: `${lerp(1, 0.75, compactProgress)}px solid ${buttonColor}`,
            borderRadius: buttonRadius,
            background: "transparent",
            color: buttonColor,
            fontSize: buttonFontSize,
            fontWeight: 600,
            lineHeight: `${buttonLineHeight}px`,
            columnGap: 10 * animationUnit,
            transform: `${getStage2GrowStyle(frame, 2, { origin: "center", translateY: 5 * animationUnit, ...reminderStage2GrowTiming }).transform} scale(${pressScale})`,
            transformOrigin: "center",
            opacity: getStage2GrowStyle(frame, 2, reminderStage2GrowTiming).opacity,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 42 * animationUnit,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
              opacity: Math.sin(Math.PI * completedProgress) * 0.75,
              transform: `translateX(${lerp(-width * 0.55, width * 0.55, completedProgress)}px) skewX(-18deg)`,
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              opacity: 1 - completedProgress,
              position: "absolute",
              transform: `translateY(${-completedProgress * 8 * animationUnit}px)`,
            }}
          >
            {text.followUpNow}
          </span>
          <span
            style={{
              opacity: completedProgress,
              position: "absolute",
              transform: `translateY(${(1 - completedProgress) * 8 * animationUnit}px)`,
            }}
          >
            {text.completed}
          </span>
        </div>
      </div>
    </div>
  );
};

export const ReminderContainer = () => {
  const frame = useCurrentFrame();
  const layout = useContainerLayout("reminder");
  const contentWidth = Math.max(layout.width, 1);
  const contentHeight = Math.max(layout.height, 1);
  const compactProgress = clamp((136 - contentHeight) / (136 - 105));
  const borderRadius = lerp(12, 8.21, compactProgress);

  return (
    <UIContainer layout={layout} borderRadius={borderRadius} background="rgba(255,255,255,0.8)" backdropFilter="blur(22px)" stage2GradientBorder>
      <ReminderContent width={contentWidth} height={contentHeight} frame={frame} borderRadius={borderRadius} />
    </UIContainer>
  );
};
