import {
  createContext,
  createElement,
  type ReactNode,
  useContext,
} from "react";
import { Easing, useCurrentFrame } from "remotion";

export type ContainerId =
  | "reminder"
  | "dashboard"
  | "gantt"
  | "doc"
  | "input"
  | "workflow"
  | "flow"
  | "im"
  | "task";

export type StageId = "stage1" | "stage2" | "stage3" | "stage4" | "stage5" | "stage6";

export type ContainerStageConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  opacity: number;
  zIndex: number;
  transformOrigin: string;
  borderRadius: number;
};

export type ContainerLayout = ContainerStageConfig & {
  id: ContainerId;
};

type StageLayouts = Record<StageId, Record<ContainerId, ContainerStageConfig>>;
type StageLayoutOverrides = Partial<Record<ContainerId, Partial<ContainerStageConfig>>>;

export type LayoutVariant = "default" | "wide";

type CanvasMetrics = {
  width: number;
  height: number;
  exitMargin: number;
};

const LayoutVariantContext = createContext<LayoutVariant>("default");

export const LayoutVariantProvider: React.FC<{
  variant?: LayoutVariant;
  children: ReactNode;
}> = ({ variant = "default", children }) => {
  return createElement(LayoutVariantContext.Provider, { value: variant }, children);
};

export const useLayoutVariant = () => useContext(LayoutVariantContext);

const stageIds: StageId[] = ["stage1", "stage2", "stage3", "stage4", "stage5", "stage6"];

const defaultStageTransitionDuration = 40;

export const stageTransitionDurations: Partial<Record<StageId, number>> = {
  stage1: 30,
  stage2: 30,
  stage3: 30,
  stage4: 70,
  stage5: 30,
};

export const getStageTransitionDuration = (fromStage: StageId) => {
  return stageTransitionDurations[fromStage] ?? defaultStageTransitionDuration;
};

export const stage5BeforeDropPauseFrames = 30;

export type StagePauseConfig = {
  // Pauses before this stage starts entering. For stage1, this is the initial still time.
  before: number;
  // Pauses after this stage has fully entered. For stage6, this is the final still time.
  after: number;
};

export const stagePauseFrames: Record<StageId, StagePauseConfig> = {
  stage1: { before: 10, after: 0 },
  stage2: { before: 60, after: 30 },
  stage3: { before: 40, after: 20 },
  stage4: { before: 0, after: 60 },
  stage5: { before: 40, after: 10 },
  stage6: { before: stage5BeforeDropPauseFrames, after: 20 },
};


const buildStageFrames = () => {
  const frames = {} as Record<StageId, number>;

  frames.stage1 = stagePauseFrames.stage1.before + stagePauseFrames.stage1.after + stagePauseFrames.stage2.before;

  for (let index = 1; index < stageIds.length - 1; index++) {
    const previousStage = stageIds[index - 1];
    const currentStage = stageIds[index];
    const nextStage = stageIds[index + 1];

    frames[currentStage] =
      frames[previousStage] +
      getStageTransitionDuration(previousStage) +
      stagePauseFrames[currentStage].after +
      stagePauseFrames[nextStage].before;
  }

  frames.stage6 = frames.stage5 + getStageTransitionDuration("stage5");

  return frames;
};

export const stageFrames: Record<StageId, number> = buildStageFrames();
export const totalDurationInFrames = stageFrames.stage6 + stagePauseFrames.stage6.after;

export const stage4To5ContentDelayFrames = 16;
export const stage4To5InputDelayFrames = 28;
export const stage2To3InputPressDelayFrames = 0;
const wideStage5To6DashboardDelayFrames = 8;
const wideStage5To6DashboardSlideX = 80;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

export const getStage4VisualStart = () => stageFrames.stage3 + getStageTransitionDuration("stage3");
export const getStage4SweepStart = () => getStage4VisualStart() + 8;
export const stage4SweepDurationFrames = stageFrames.stage5 - getStage4SweepStart();
export const getStage4StateChangeProgress = (frame: number) => {
  return Easing.bezier(0.16, 1, 0.3, 1)(
    clamp01((frame - (getStage4SweepStart() + 20)) / 34),
  );
};

const keyframe25Layout: Record<ContainerId, ContainerStageConfig> = {
  reminder: { x: 17, y: 189, width: 220, height: 150, scale: 1, opacity: 1, zIndex: 1, transformOrigin: "center", borderRadius: 8 },
  dashboard: { x: 17, y: 17, width: 220, height: 171, scale: 1, opacity: 1, zIndex: 1, transformOrigin: "center", borderRadius: 8 },
  gantt: { x: 17, y: 378, width: 220, height: 228, scale: 1, opacity: 1, zIndex: 1, transformOrigin: "center", borderRadius: 8 },
  doc: { x: 257, y: 17, width: 329, height: 235, scale: 1, opacity: 1, zIndex: 1, transformOrigin: "center", borderRadius: 8 },
  input: { x: 257, y: 270, width: 329, height: 90, scale: 1, opacity: 1, zIndex: 100, transformOrigin: "center", borderRadius: 8 },
  workflow: { x: 257, y: 378, width: 329, height: 228, scale: 1, opacity: 1, zIndex: 1, transformOrigin: "center", borderRadius: 8 },
  flow: { x: 700, y: 640, width: 276, height: 201, scale: 1, opacity: 1, zIndex: 1, transformOrigin: "center", borderRadius: 8 },
  im: { x: 606, y: 17, width: 214, height: 233, scale: 1, opacity: 1, zIndex: 1, transformOrigin: "center", borderRadius: 8 },
  task: { x: 606, y: 276, width: 214, height: 330, scale: 1, opacity: 1, zIndex: 1, transformOrigin: "center", borderRadius: 8 },
};

const createStageLayout = (
  overrides: StageLayoutOverrides = {},
): Record<ContainerId, ContainerStageConfig> => {
  return Object.fromEntries(
    (Object.keys(keyframe25Layout) as ContainerId[]).map((id) => [
      id,
      {
        ...keyframe25Layout[id],
        ...overrides[id],
      },
    ]),
  ) as Record<ContainerId, ContainerStageConfig>;
};

const stage1Layout = createStageLayout({
  reminder: { x: 17, y: 205, width: 254, height: 150, scale: 0.72, opacity: 0 },
  dashboard: { x: 17, y: 17, width: 254, height: 171, scale: 0.72, opacity: 0 },
  gantt: { x: 17, y: 378, width: 254, height: 228, scale: 0.72, opacity: 0 },
  doc: { x: 569, y: 17, width: 254, height: 282, scale: 0.72, opacity: 0 },
  input: { x: 398, y: 310, width: 44, height: 12, scale: 0.72, opacity: 0, zIndex: 100},
  workflow: { x: 293, y: 320, width: 254, height: 286, scale: 0.72, opacity: 0, transformOrigin: "bottom center" },
  flow: { x: 700, y: 640, width: 276, height: 201, scale: 0.72, opacity: 0 },
  im: { x: 90, y: 150, width: 210, height: 400, scale: 1, opacity: 1, zIndex: 2, borderRadius: 20 },
  task: { x: 245, y: 60, width: 600, height: 480, scale: 1, opacity: 1, zIndex: 1, borderRadius: 16 },
});

const stage2Layout = createStageLayout({
  reminder: { x: 17, y: 205, width: 254, height: 120, scale: 1, opacity: 1, transformOrigin: "left center" },
  dashboard: { x: 17, y: 17, width: 254, height: 171, scale: 1, opacity: 1, transformOrigin: "left center" },
  gantt: { x: 17, y: 348, width: 254, height: 258, scale: 1, opacity: 1, transformOrigin: "left center" },
  doc: { x: 569, y: 17, width: 254, height: 220, scale: 1, opacity: 1, transformOrigin: "top right" },
  input: { x: 398, y: 310, width: 44, height: 12, scale: 0.92, opacity: 0, zIndex: 100 },
  workflow: { x: 293, y: 320, width: 254, height: 286, scale: 1, opacity: 1, transformOrigin: "bottom center" },
  flow: { x: 700, y: 640, width: 276, height: 201, scale: 1, opacity: 1 },
  im: { x: 293, y: 17, width: 254, height: 282, scale: 1, opacity: 1, transformOrigin: "top center" },
  task: { x: 569, y: 256, width: 254, height: 346, scale: 1, opacity: 1, transformOrigin: "bottom right" },
});

const stage3Layout = createStageLayout({
  reminder: { x: 17, y: 205, width: 220, height: 120, scale: 1, opacity: 1, transformOrigin: "left center" },
  dashboard: { x: 17, y: 17, width: 220, height: 171, scale: 1, opacity: 1, transformOrigin: "left center" },
  gantt: { x: 17, y: 348, width: 220, height: 258, scale: 1, opacity: 1, transformOrigin: "left center" },
  doc: { x: 609, y: 17, width: 214, height: 200, scale: 1, opacity: 1, transformOrigin: "top right" },
  input: { x: 255.5, y: 271, width: 329, height: 90, scale: 1, opacity: 1, zIndex: 100 },
  workflow: { x: 255.5, y: 386, width: 329, height: 220, scale: 1, opacity: 1, transformOrigin: "bottom center" },
  flow: { x: 700, y: 640, width: 276, height: 201, scale: 1, opacity: 1 },
  im: { x: 255.5, y: 17, width: 329, height: 235, scale: 1, opacity: 1, transformOrigin: "top center" },
  task: { x: 609, y: 242, width: 214, height: 364, scale: 1, opacity: 1, transformOrigin: "bottom right" },
});

const stage4Layout = createStageLayout({
  reminder: { x: -48, y: 264, width: 134, height: 86, scale: 1, opacity: 1 },
  dashboard: { x: -44, y: -34, width: 181, height: 156, scale: 1, opacity: 1 },
  gantt: { x: 44, y: 517, width: 166, height: 172, scale: 1, opacity: 1 },
  doc: { x: 490, y: 43, width: 204, height: 124, scale: 1, opacity: 1 },
  input: { x: 257, y: 203, width: 329, height: 90, scale: 1, opacity: 1, zIndex: 100, borderRadius: 12 },
  workflow: { x: 304, y: 397, width: 208, height: 153, scale: 1, opacity: 1 },
  flow: { x: 612, y: 516, width: 207, height: 151, scale: 1, opacity: 1 },
  im: { x: 213, y: -28, width: 204, height: 165, scale: 1, opacity: 1, zIndex: 2, borderRadius: 12 },
  task: { x: 731, y: 267, width: 181, height: 155, scale: 1, opacity: 1 },
});

const stage5Layout = createStageLayout({
  reminder: { opacity: 0 },
  dashboard: { opacity: 0 },
  gantt: { opacity: 0 },
  doc: { opacity: 0 },
  input: { x: 319.5, y: 100, width: 214, height: 420, scale: 1.15, opacity: 1, zIndex: 100, borderRadius: 20, transformOrigin: "center" },
  workflow: { opacity: 0 },
  flow: { opacity: 0 },
  im: { opacity: 0 },
  task: { x: 277, y: 74, width: 600, height: 456, scale: 1, opacity: 0, zIndex: 1 },
});

const stage6Layout = createStageLayout({
  reminder: { opacity: 0 },
  dashboard: { opacity: 0 },
  gantt: { opacity: 0 },
  doc: { opacity: 0 },
  input: { x: 90, y: 150, width: 210, height: 400, scale: 1, opacity: 1, zIndex: 100, borderRadius: 20, transformOrigin: "center" },
  workflow: { opacity: 0 },
  flow: { x: 700, y: 640, width: 276, height: 201, scale: 1, opacity: 1 },
  im: { opacity: 0 },
  task: { x: 245, y: 60, width: 600, height: 480, scale: 1, opacity: 1, zIndex: 1, borderRadius: 16 },
});

// Edit each stage independently to choreograph the 6-step container morph.
// Keep stage6 identical to stage1 if you want the animation to loop seamlessly.
export const stageLayouts: StageLayouts = {
  stage1: stage1Layout,
  stage2: stage2Layout,
  stage3: stage3Layout,
  stage4: stage4Layout,
  stage5: stage5Layout,
  stage6: stage6Layout,
};

const wideLegacyOffset = { x: 84, y: -51.5 };

const offsetStageLayout = (
  layout: Record<ContainerId, ContainerStageConfig>,
): Record<ContainerId, ContainerStageConfig> => {
  return Object.fromEntries(
    (Object.keys(layout) as ContainerId[]).map((id) => [
      id,
      {
        ...layout[id],
        x: layout[id].x + wideLegacyOffset.x,
        y: layout[id].y + wideLegacyOffset.y,
      },
    ]),
  ) as Record<ContainerId, ContainerStageConfig>;
};

const wideStage2Layout = createStageLayout({
  reminder: { x: 716.5, y: 24, width: 267.5, height: 136, scale: 1, opacity: 1, transformOrigin: "top right" },
  dashboard: { x: 24, y: 24, width: 267.5, height: 196, scale: 1, opacity: 1, transformOrigin: "top left" },
  gantt: { x: 24, y: 236, width: 267.5, height: 261, scale: 1, opacity: 1, transformOrigin: "bottom left" },
  doc: { x: 527.5, y: 273, width: 173, height: 224, scale: 1, opacity: 1, transformOrigin: "bottom right" },
  input: { x: 482, y: 252.382, width: 44, height: 12, scale: 0.92, opacity: 0, zIndex: 100 },
  workflow: { x: 307.5, y: 273, width: 204, height: 224, scale: 1, opacity: 1, transformOrigin: "bottom left" },
  flow: { x: 24, y: 540, width: 276, height: 201, scale: 1, opacity: 1 },
  im: { x: 307.5, y: 24, width: 393, height: 233, scale: 1, opacity: 1, transformOrigin: "top center" },
  task: { x: 716.5, y: 176, width: 267.5, height: 321, scale: 1, opacity: 1, transformOrigin: "bottom right" },
});

const wideStage3Layout = createStageLayout({
  reminder: { x: 744, y: 24, width: 240, height: 136, scale: 1, opacity: 1, transformOrigin: "top right" },
  dashboard: { x: 24, y: 24, width: 240, height: 196, scale: 1, opacity: 1, transformOrigin: "top left" },
  gantt: { x: 24, y: 236, width: 240, height: 261, scale: 1, opacity: 1, transformOrigin: "bottom left" },
  doc: { x: 512, y: 306.7652893066406, width: 216, height: 190.23471069335938, scale: 1, opacity: 1, transformOrigin: "bottom right" },
  input: { x: 280, y: 194, width: 448, height: 96.765, scale: 1, opacity: 1, zIndex: 100 },
  workflow: { x: 280, y: 306.7652893066406, width: 216, height: 190.23471069335938, scale: 1, opacity: 1, transformOrigin: "bottom left" },
  flow: { x: 24, y: 540, width: 276, height: 201, scale: 1, opacity: 1 },
  im: { x: 280, y: 24, width: 448, height: 154, scale: 1, opacity: 1, transformOrigin: "top center" },
  task: { x: 744, y: 176, width: 240, height: 321, scale: 1, opacity: 1, transformOrigin: "bottom right" },
});

const wideStage4Layout = createStageLayout({
  reminder: { x: 614, y: 20, width: 165, height: 105, scale: 1, opacity: 1, borderRadius: 8 },
  dashboard: { x: 56, y: 32, width: 165, height: 132, scale: 1, opacity: 1, borderRadius: 8 },
  gantt: { x: -14, y: 231, width: 171.691, height: 145.755, scale: 1, opacity: 1, borderRadius: 8 },
  doc: { x: 743, y: 453, width: 179.25, height: 105.67, scale: 1, opacity: 1, borderRadius: 8 },
  input: { x: 338.98, y: 169, width: 329, height: 90.137, scale: 1, opacity: 1, zIndex: 100, borderRadius: 12 },
  workflow: { x: 397, y: 342, width: 208.805, height: 154.25, scale: 1, opacity: 1, borderRadius: 8 },
  flow: { x: 101, y: 467, width: 207, height: 151, scale: 1, opacity: 1, borderRadius: 8 },
  im: { x: 278, y: -24, width: 204, height: 124, scale: 1, opacity: 1, zIndex: 2, borderRadius: 12 },
  task: { x: 813, y: 221, width: 181.394, height: 155.347, scale: 1, opacity: 1, borderRadius: 8 },
});

const wideStage5Base = offsetStageLayout(stage5Layout);
const wideStage5Layout: Record<ContainerId, ContainerStageConfig> = {
  ...wideStage5Base,
  input: {
    ...wideStage5Base.input,
    y: 50.5,
    scale: 1.06,
  },
  task: {
    ...wideStage5Base.task,
    x: 154.5 + wideStage5To6DashboardSlideX,
    y: 57.1,
    width: 790.483,
    height: 395.477,
    borderRadius: 12.562,
  },
};

const wideStage1Base = offsetStageLayout(stage1Layout);
const wideStage1Layout: Record<ContainerId, ContainerStageConfig> = {
  ...wideStage1Base,
  im: {
    ...wideStage1Base.im,
    x: 63.98,
    y: 121.33,
    width: 180.298,
    height: 342.567,
    borderRadius: 21.329,
  },
  task: {
    ...wideStage1Base.task,
    x: 154.5,
    y: 57.1,
    width: 790.483,
    height: 395.477,
    borderRadius: 12.562,
  },
};

const wideStage6Base = offsetStageLayout(stage6Layout);
const wideStage6Layout: Record<ContainerId, ContainerStageConfig> = {
  ...wideStage6Base,
  input: {
    ...wideStage6Base.input,
    x: 63.98,
    y: 121.33,
    width: 180.298,
    height: 342.567,
    borderRadius: 21.329,
  },
  task: {
    ...wideStage6Base.task,
    x: 154.5,
    y: 57.1,
    width: 790.483,
    height: 395.477,
    borderRadius: 12.562,
  },
};

const wideStageLayouts: StageLayouts = {
  stage1: wideStage1Layout,
  stage2: wideStage2Layout,
  stage3: wideStage3Layout,
  stage4: wideStage4Layout,
  stage5: wideStage5Layout,
  stage6: wideStage6Layout,
};

const canvasMetricsByVariant: Record<LayoutVariant, CanvasMetrics> = {
  default: { width: 840, height: 623, exitMargin: 16 },
  wide: { width: 1008, height: 521, exitMargin: 16 },
};

const getStageLayouts = (variant: LayoutVariant) => {
  return variant === "wide" ? wideStageLayouts : stageLayouts;
};

export const getLegacyCanvasOffset = (variant: LayoutVariant) => {
  return variant === "wide" ? wideLegacyOffset : { x: 0, y: 0 };
};

const timelineFrames = stageIds.map((stageId) => stageFrames[stageId]);

const moveEase = Easing.bezier(0.4, 0, 0.2, 1);
const sizeEase = Easing.bezier(0.4, 0, 0.2, 1);
const opacityEase = Easing.bezier(0.33, 1, 0.68, 1);
const scaleEase = Easing.bezier(0.4, 0, 0.2, 1);
const stage1To2Ease = Easing.bezier(0.42, 0, 0.58, 1);
const stage3To4Ease = Easing.bezier(0.4, 0, 0.2, 1);
const stage4FloatAmplitude = 6.2;
const stage4FloatPeriodFrames = 96;

const clamp = (value: number, min = 0, max = 1) => {
  return Math.min(Math.max(value, min), max);
};

const lerp = (from: number, to: number, progress: number) => {
  return from + (to - from) * progress;
};

const remapProgress = (progress: number, start: number, end: number) => {
  return clamp((progress - start) / (end - start));
};

export const getStage1To2MorphProgress = (frame: number) => {
  const rawProgress = clamp(
    (frame - stageFrames.stage1) / getStageTransitionDuration("stage1"),
  );

  return stage1To2Ease(rawProgress);
};

export const getStage2To3MorphProgress = (frame: number) => {
  const rawProgress = clamp(
    (frame - stageFrames.stage2) / getStageTransitionDuration("stage2"),
  );
  const pressDelayRatio = clamp(
    stage2To3InputPressDelayFrames / getStageTransitionDuration("stage2"),
  );

  return sizeEase(remapProgress(rawProgress, pressDelayRatio + 0.06, 1));
};

export const getStage3To4MorphProgress = (frame: number) => {
  const rawProgress = clamp(
    (frame - stageFrames.stage3) / getStageTransitionDuration("stage3"),
  );

  return stage3To4Ease(rawProgress);
};

const getStage4FloatOffset = (id: ContainerId, frame: number, presence: number) => {
  const seed = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const phase = seed * 0.37;
  const wave = (frame / stage4FloatPeriodFrames) * Math.PI * 2 + phase;
  const pulse = Math.sin(wave * 2.1 + phase * 0.35) * 0.22;
  const strength = stage4FloatAmplitude * presence;

  return {
    x: (Math.sin(wave) * 0.62 + pulse) * strength,
    y: (Math.cos(wave * 0.86) + pulse * 0.45) * strength,
  };
};

const getStageSegment = (frame: number) => {
  if (frame <= timelineFrames[0]) {
    return { fromStage: stageIds[0], toStage: stageIds[1], progress: 0 };
  }

  for (let index = stageIds.length - 1; index >= 0; index--) {
    const startFrame = timelineFrames[index];

    if (frame >= startFrame) {
      const fromStage = stageIds[index];
      const toStage = stageIds[index + 1] ?? fromStage;
      const transitionDuration = getStageTransitionDuration(fromStage);

      return {
        fromStage,
        toStage,
        progress: fromStage === toStage ? 1 : clamp((frame - startFrame) / transitionDuration),
      };
    }
  }

  return { fromStage: stageIds[0], toStage: stageIds[1], progress: 0 };
};

export const getStageDebugLabel = (frame: number) => {
  const { fromStage, toStage, progress } = getStageSegment(frame);

  if (fromStage === toStage || progress === 1) {
    return toStage;
  }

  if (progress === 0) {
    return fromStage;
  }

  return `${fromStage} -> ${toStage} ${Math.round(progress * 100)}%`;
};

const interpolateValue = (
  from: number,
  to: number,
  progress: number,
  easing: (value: number) => number,
) => {
  return lerp(from, to, easing(progress));
};

const getMotionIntensity = (
  fromLayout: ContainerStageConfig,
  toLayout: ContainerStageConfig,
) => {
  const positionDelta = Math.hypot(toLayout.x - fromLayout.x, toLayout.y - fromLayout.y);
  const sizeDelta =
    Math.abs(toLayout.width - fromLayout.width) + Math.abs(toLayout.height - fromLayout.height);

  return clamp((positionDelta + sizeDelta) / 900);
};

const getOriginRatio = (transformOrigin: string) => {
  const normalized = transformOrigin.toLowerCase();
  const x = normalized.includes("left") ? 0 : normalized.includes("right") ? 1 : 0.5;
  const y = normalized.includes("top") ? 0 : normalized.includes("bottom") ? 1 : 0.5;

  return { x, y };
};

const getAnchoredPosition = (
  fromLayout: ContainerStageConfig,
  width: number,
  height: number,
) => {
  const origin = getOriginRatio(fromLayout.transformOrigin);
  const anchorX = fromLayout.x + fromLayout.width * origin.x;
  const anchorY = fromLayout.y + fromLayout.height * origin.y;

  return {
    x: anchorX - width * origin.x,
    y: anchorY - height * origin.y,
  };
};

const getCenterInterpolatedPosition = (
  fromLayout: ContainerStageConfig,
  toLayout: ContainerStageConfig,
  width: number,
  height: number,
  progress: number,
) => {
  const fromCenterX = fromLayout.x + fromLayout.width / 2;
  const fromCenterY = fromLayout.y + fromLayout.height / 2;
  const toCenterX = toLayout.x + toLayout.width / 2;
  const toCenterY = toLayout.y + toLayout.height / 2;
  const centerX = lerp(fromCenterX, toCenterX, progress);
  const centerY = lerp(fromCenterY, toCenterY, progress);

  return {
    x: centerX - width / 2,
    y: centerY - height / 2,
  };
};

const getFlyOutLayout = (
  layout: ContainerStageConfig,
  canvasBounds: CanvasMetrics,
): ContainerStageConfig => {
  const canvasCenter = {
    x: canvasBounds.width / 2,
    y: canvasBounds.height / 2,
  };
  const centerX = layout.x + layout.width / 2;
  const centerY = layout.y + layout.height / 2;
  const directionX = centerX - canvasCenter.x;
  const directionY = centerY - canvasCenter.y;
  const length = Math.hypot(directionX, directionY) || 1;
  const normalizedX = directionX / length;
  const normalizedY = directionY / length;
  const horizontalDistance =
    normalizedX > 0
      ? (canvasBounds.width + canvasBounds.exitMargin - layout.x) / normalizedX
      : (-canvasBounds.exitMargin - (layout.x + layout.width)) / normalizedX;
  const verticalDistance =
    normalizedY > 0
      ? (canvasBounds.height + canvasBounds.exitMargin - layout.y) / normalizedY
      : (-canvasBounds.exitMargin - (layout.y + layout.height)) / normalizedY;
  const travelDistance = Math.min(
    ...[horizontalDistance, verticalDistance].filter((distance) => Number.isFinite(distance) && distance > 0),
  );

  return {
    ...layout,
    x: layout.x + normalizedX * travelDistance,
    y: layout.y + normalizedY * travelDistance,
    opacity: 0,
  };
};

export const getLayoutAtFrame = (
  id: ContainerId,
  frame: number,
  variant: LayoutVariant = "default",
): ContainerLayout => {
  const layouts = getStageLayouts(variant);
  const canvasBounds = canvasMetricsByVariant[variant];
  const { fromStage, toStage, progress } = getStageSegment(frame);
  const fromLayout = layouts[fromStage][id];
  const isStage1To2 = fromStage === "stage1" && toStage === "stage2";
  const isStage4To5 = fromStage === "stage4" && toStage === "stage5";
  const isStage5To6 = fromStage === "stage5" && toStage === "stage6";
  const isStage2To3 = fromStage === "stage2" && toStage === "stage3";
  const isStage3To4 = fromStage === "stage3" && toStage === "stage4";
  const isWideStage5To6Dashboard = variant === "wide" && isStage5To6 && id === "task";
  const shouldFlyOut = isStage4To5 && id !== "input";
  const shouldCenterResize = (isStage4To5 || isStage5To6) && id === "input";
  const shouldAnchorResize =
    variant === "default" && fromStage === "stage2" && toStage === "stage3";
  const toLayout = shouldFlyOut
    ? getFlyOutLayout(fromLayout, canvasBounds)
    : layouts[toStage][id];
  const stage4To5DelayFrames = id === "input" ? stage4To5InputDelayFrames : stage4To5ContentDelayFrames;
  const stage4To5ContentDelayRatio = clamp(stage4To5DelayFrames / getStageTransitionDuration("stage4"));
  const stage2To3InputPressDelayRatio = clamp(
    stage2To3InputPressDelayFrames / getStageTransitionDuration("stage2"),
  );
  const stage5To6DashboardDelayRatio = clamp(
    wideStage5To6DashboardDelayFrames / getStageTransitionDuration("stage5"),
  );
  const animationProgress = isStage4To5
    ? remapProgress(progress, stage4To5ContentDelayRatio, 1)
    : isStage1To2
      ? stage1To2Ease(progress)
      : isStage2To3
        ? remapProgress(progress, stage2To3InputPressDelayRatio, 1)
        : isWideStage5To6Dashboard
          ? remapProgress(progress, stage5To6DashboardDelayRatio, 1)
          : progress;
  const stage3To4Progress = stage3To4Ease(animationProgress);
  const moveProgress = isStage3To4 ? stage3To4Progress : moveEase(animationProgress);
  const sizeProgress = isStage3To4 ? stage3To4Progress : sizeEase(remapProgress(animationProgress, 0.06, 1));
  const opacityProgress = isWideStage5To6Dashboard
    ? opacityEase(animationProgress)
    : shouldFlyOut
      ? opacityEase(remapProgress(animationProgress, 0.1, 0.75))
      : isStage3To4
        ? stage3To4Progress
        : opacityEase(remapProgress(animationProgress, 0, 0.55));
  const scaleProgress = isStage3To4 ? stage3To4Progress : remapProgress(animationProgress, 0.02, 0.92);
  const baseScale = isStage3To4
    ? lerp(fromLayout.scale, toLayout.scale, scaleProgress)
    : interpolateValue(
      fromLayout.scale,
      toLayout.scale,
      scaleProgress,
      scaleEase,
    );
  const overshoot = isStage3To4 || isWideStage5To6Dashboard
    ? 0
    : Math.sin(Math.PI * animationProgress) * 0.018 * getMotionIntensity(fromLayout, toLayout);
  const width = lerp(fromLayout.width, toLayout.width, sizeProgress);
  const height = lerp(fromLayout.height, toLayout.height, sizeProgress);
  const anchoredPosition = shouldAnchorResize
    ? getAnchoredPosition(fromLayout, width, height)
    : shouldCenterResize
      ? getCenterInterpolatedPosition(fromLayout, toLayout, width, height, moveProgress)
    : null;
  const stage4FloatPresence =
    id === "input"
      ? 0
      : isStage3To4
        ? stage3To4Ease(remapProgress(animationProgress, 0.72, 1))
        : toStage === "stage4"
          ? moveEase(progress)
        : isStage4To5
          ? 1 - animationProgress
          : 0;
  const floatOffset = getStage4FloatOffset(id, frame, stage4FloatPresence);
  const x = anchoredPosition?.x ?? lerp(fromLayout.x, toLayout.x, moveProgress);
  const y = anchoredPosition?.y ?? lerp(fromLayout.y, toLayout.y, moveProgress);

  return {
    id,
    x: x + floatOffset.x,
    y: y + floatOffset.y,
    width,
    height,
    scale: shouldAnchorResize ? 1 : baseScale + overshoot,
    opacity: lerp(fromLayout.opacity, toLayout.opacity, opacityProgress),
    zIndex: id === "input" ? 100 : animationProgress < 0.5 ? fromLayout.zIndex : toLayout.zIndex,
    transformOrigin: shouldCenterResize
      ? "center"
      : isStage1To2
        ? toLayout.transformOrigin
        : animationProgress < 0.5
          ? fromLayout.transformOrigin
          : toLayout.transformOrigin,
    borderRadius: lerp(fromLayout.borderRadius, toLayout.borderRadius, sizeProgress),
  };
};

export const useContainerLayout = (id: ContainerId): ContainerLayout => {
  const frame = useCurrentFrame();
  const variant = useLayoutVariant();

  return getLayoutAtFrame(id, frame, variant);
};
