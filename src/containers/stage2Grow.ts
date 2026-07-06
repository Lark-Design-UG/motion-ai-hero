import type { CSSProperties } from "react";
import { Easing } from "remotion";
import { stageFrames } from "./layout";

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const smooth = Easing.bezier(0.42, 0, 0.58, 1);

export const stage2ContentGrowDefaultStartFrame = stageFrames.stage1;
export const stage2ContentGrowDefaultDurationFrames = 34;
export const stage2ContentGrowItemStaggerFrames = 4;
export const stage2ContentGrowInitialScale = 0.86;
export const stage2ContentGrowInitialTranslateY = 10;

type Stage2GrowTiming = {
  startFrame?: number;
  duration?: number;
  staggerFrames?: number;
};

export const getStage2GrowProgress = (
  frame: number,
  order = 0,
  {
    startFrame = stage2ContentGrowDefaultStartFrame,
    duration = stage2ContentGrowDefaultDurationFrames,
    staggerFrames = stage2ContentGrowItemStaggerFrames,
  }: Stage2GrowTiming = {},
) => {
  const start = startFrame + order * staggerFrames;
  const itemDuration = Math.max(duration - order * staggerFrames, 1);

  return smooth(clamp((frame - start) / itemDuration));
};

export const getStage2GrowStyle = (
  frame: number,
  order = 0,
  options: {
    origin?: string;
    translateY?: number;
    initialScale?: number;
  } & Stage2GrowTiming = {},
): CSSProperties => {
  const progress = getStage2GrowProgress(frame, order, options);
  const initialScale = options.initialScale ?? stage2ContentGrowInitialScale;
  const translateY = options.translateY ?? stage2ContentGrowInitialTranslateY;

  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * translateY}px) scale(${initialScale + (1 - initialScale) * progress})`,
    transformOrigin: options.origin ?? "center",
  };
};

export const getStage2WidthGrowStyle = (
  frame: number,
  order = 0,
  options: {
    origin?: string;
  } & Stage2GrowTiming = {},
): CSSProperties => {
  const progress = getStage2GrowProgress(frame, order, options);

  return {
    opacity: progress,
    transform: `scaleX(${progress})`,
    transformOrigin: options.origin ?? "left center",
  };
};
