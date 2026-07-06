import type { CSSProperties } from "react";
import { useCurrentFrame } from "remotion";
import { getStage4StateChangeProgress, getStage4SweepStart, stageFrames } from "./layout";
import { useContainerLayout } from "./layout";
import { getStage2GrowStyle } from "./stage2Grow";
import { UIContainer } from "./UIContainer";

const fontFamily =
  '"Lark Circular", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif';

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

const ReminderContent: React.FC<{ width: number; height: number; frame: number }> = ({ width, height, frame }) => {
  const unit = Math.min(width / 259, height / 139);
  const headerHeight = 39 * unit;
  const bodyPadding = 12 * unit;
  const buttonHeight = Math.max(24 * unit, Math.min(31 * unit, height * 0.23));
  const completedProgress = getStage4StateChangeProgress(frame);
  const clickProgress = smoothProgress(frame, getStage4SweepStart() + 14, 12);
  const pressScale = 1 - Math.sin(Math.PI * clickProgress) * 0.035;
  const buttonColor = mixRgb([80, 131, 251], [36, 198, 90], completedProgress);
  const headerOpacity = smoothProgress(frame, reminderStage2GrowStartFrame, reminderStage2HeaderFadeDurationFrames);
  const textStyle: CSSProperties = {
    margin: 0,
    color: "#1f2329",
    fontSize: 11 * unit,
    lineHeight: `${17 * unit}px`,
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
        borderRadius: 9 * unit,
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
          padding: `0 ${12 * unit}px`,
          background: "#efe6fe",
          color: "#7a35f0",
          fontSize: 12 * unit,
          fontWeight: 600,
          lineHeight: `${20 * unit}px`,
          letterSpacing: -0.1 * unit,
          whiteSpace: "nowrap",
          overflow: "hidden",
          opacity: headerOpacity,
        }}
      >
        <span
          style={{
            display: "inline-grid",
            placeItems: "center",
            width: 18 * unit,
            height: 18 * unit,
            marginRight: 8 * unit,
            fontSize: 14 * unit,
            lineHeight: 1,
          }}
        >
          ⏰
        </span>
        <span>Risk reminder</span>
      </div>
      <div
        style={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width,
          height: Math.max(height - headerHeight, 1),
          padding: `${12 * unit}px ${bodyPadding}px ${bodyPadding}px`,
        }}
      >
        <p style={{ ...textStyle, ...getStage2GrowStyle(frame, 1, { origin: "left center", translateY: 4 * unit, ...reminderStage2GrowTiming }) }}>
          Hi, there is a task due today.
          <br />
          Please complete it as soon as possible.
        </p>
        <div
          style={{
            display: "grid",
            placeItems: "center",
            width: "100%",
            height: buttonHeight,
            position: "relative",
            overflow: "hidden",
            border: `${Math.max(unit, 0.75)}px solid ${buttonColor}`,
            borderRadius: 6 * unit,
            background: "transparent",
            color: buttonColor,
            fontSize: 12 * unit,
            fontWeight: 600,
            lineHeight: `${14 * unit}px`,
            columnGap: 10 * unit,
            transform: `${getStage2GrowStyle(frame, 2, { origin: "center", translateY: 5 * unit, ...reminderStage2GrowTiming }).transform} scale(${pressScale})`,
            transformOrigin: "center",
            opacity: getStage2GrowStyle(frame, 2, reminderStage2GrowTiming).opacity,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 42 * unit,
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
              transform: `translateY(${-completedProgress * 8 * unit}px)`,
            }}
          >
            Follow up now
          </span>
          <span
            style={{
              opacity: completedProgress,
              position: "absolute",
              transform: `translateY(${(1 - completedProgress) * 8 * unit}px)`,
            }}
          >
            Completed
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

  return (
    <UIContainer layout={layout} background="rgba(255,255,255,0.8)" backdropFilter="blur(22px)" stage2GradientBorder>
      <ReminderContent width={contentWidth} height={contentHeight} frame={frame} />
    </UIContainer>
  );
};
