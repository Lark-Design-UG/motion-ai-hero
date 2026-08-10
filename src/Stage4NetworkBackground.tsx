import {
  AbsoluteFill,
  Easing,
  Img,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  getStageTransitionDuration,
  stage4To5ContentDelayFrames,
  stageFrames,
  useLayoutVariant,
} from "./containers/layout";
import { getStage4Border } from "./containers/UIContainer";
import { SHOW_GRADIENT_ENDPOINT_MARKERS } from "./debug";
import { useCopy } from "./localization";

const lineColor = "#b8ccfb";

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

const revealEase = Easing.bezier(0.45, 0, 0.15, 1);
const lineRevealDelayFrames = 20;
const lineGradientRotateDurationFrames = 50;
const lineGradientSweepDegrees = 180;
const lineGradientOpaqueRatio = 0.1;
const lineGradientOpaqueStop = `${clamp(lineGradientOpaqueRatio) * 100}%`;
const stage4FloatAmplitude = 4;
const stage4FloatPeriodFrames = 140;
const ellipseMovingDotSpacing = 180;
const ellipseMovingDotRadius = 2.6;
const ellipseMovingDotSpeed = 2.4;
const ellipseMovingDotArcSamples = 120;

const getStage4EnterProgress = (frame: number) => {
  const transitionDuration = getStageTransitionDuration("stage3");

  return revealEase(clamp((frame - stageFrames.stage3) / transitionDuration));
};

const getStage4ExitProgress = (frame: number) => {
  const transitionDuration = getStageTransitionDuration("stage4");
  const exitDuration = transitionDuration - stage4To5ContentDelayFrames;

  return (
    1 -
    revealEase(
      clamp(
        (frame - stageFrames.stage4 - stage4To5ContentDelayFrames) /
          exitDuration,
      ),
    )
  );
};

const getStage4LineEnterProgress = (frame: number) => {
  return revealEase(
    clamp(
      (frame - stageFrames.stage3 - lineRevealDelayFrames) /
        lineGradientRotateDurationFrames,
    ),
  );
};

const getStage4LineExitProgress = (frame: number) => {
  return (
    1 -
    revealEase(
      clamp((frame - stageFrames.stage4) / lineGradientRotateDurationFrames),
    )
  );
};

const getEllipseRadiusAtAngle = (rx: number, ry: number, angle: number) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return (rx * ry) / Math.sqrt((ry * cos) ** 2 + (rx * sin) ** 2);
};

const getEllipsePointAtArcRatio = (cx: number, cy: number, rx: number, ry: number, ratio: number) => {
  const targetRatio = ((ratio % 1) + 1) % 1;
  const fullAngle = Math.PI * 2;
  let previousX = rx;
  let previousY = 0;
  let totalLength = 0;
  const segmentLengths: number[] = [];

  for (let index = 1; index <= ellipseMovingDotArcSamples; index++) {
    const angle = (index / ellipseMovingDotArcSamples) * fullAngle;
    const x = Math.cos(angle) * rx;
    const y = Math.sin(angle) * ry;
    const segmentLength = Math.hypot(x - previousX, y - previousY);

    segmentLengths.push(segmentLength);
    totalLength += segmentLength;
    previousX = x;
    previousY = y;
  }

  const targetLength = targetRatio * totalLength;
  let accumulatedLength = 0;

  for (let index = 0; index < segmentLengths.length; index++) {
    const segmentLength = segmentLengths[index];

    if (accumulatedLength + segmentLength >= targetLength) {
      const segmentProgress = segmentLength === 0 ? 0 : (targetLength - accumulatedLength) / segmentLength;
      const fromAngle = (index / ellipseMovingDotArcSamples) * fullAngle;
      const toAngle = ((index + 1) / ellipseMovingDotArcSamples) * fullAngle;
      const angle = fromAngle + (toAngle - fromAngle) * segmentProgress;

      return {
        x: cx + Math.cos(angle) * rx,
        y: cy + Math.sin(angle) * ry,
      };
    }

    accumulatedLength += segmentLength;
  }

  return {
    x: cx + rx,
    y: cy,
  };
};

const getEllipseApproximateCircumference = (rx: number, ry: number) => {
  const fullAngle = Math.PI * 2;
  let previousX = rx;
  let previousY = 0;
  let totalLength = 0;

  for (let index = 1; index <= ellipseMovingDotArcSamples; index++) {
    const angle = (index / ellipseMovingDotArcSamples) * fullAngle;
    const x = Math.cos(angle) * rx;
    const y = Math.sin(angle) * ry;

    totalLength += Math.hypot(x - previousX, y - previousY);
    previousX = x;
    previousY = y;
  }

  return totalLength;
};

const getFloatOffset = (seed: string, frame: number, presence: number) => {
  const hash = seed
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const phase = hash * 0.31;
  const wave = (frame / stage4FloatPeriodFrames) * Math.PI * 2 + phase;
  const strength = stage4FloatAmplitude * presence;

  return {
    floatX: Math.sin(wave) * strength * 0.5,
    floatY: Math.cos(wave * 0.82) * strength,
  };
};

const getLinkedNodeFloatOffset = (
  lineIds: readonly string[],
  frame: number,
  presence: number,
) => {
  const offsets = lineIds.map((lineId) => getFloatOffset(lineId, frame, presence));

  return {
    floatX: offsets.reduce((sum, offset) => sum + offset.floatX, 0) / offsets.length,
    floatY: offsets.reduce((sum, offset) => sum + offset.floatY, 0) / offsets.length,
  };
};

const networkEllipses = [
  {
    id: "network-line-1",
    cx: 1401.5,
    cy: 124.5,
    rx: 794.5,
    ry: 794.5,
    rotation: 106,
    startAngle: 240,
  }, //右侧竖线
  {
    id: "network-line-2",
    cx: 453,
    cy: -195,
    rx: 469,
    ry: 469,
    rotation: 106,
    startAngle: 180,
  }, //上方横线
  {
    id: "network-line-3",
    cx: 328,
    cy: 1023,
    rx: 599,
    ry: 599,
    rotation: 106,
    startAngle: 0,
  }, //下方横线
  {
    id: "network-line-4",
    cx: -847.5,
    cy: 55.5,
    rx: 1077.5,
    ry: 1077.5,
    rotation: 126,
    startAngle: 60,
  }, //左侧竖线
  {
    id: "network-line-5",
    cx: 249,
    cy: 1457.5,
    rx: 1119,
    ry: 1963.5,
    rotation: 90,
    startAngle: 40,
  }, // 中间的长线
] as const;

const wideNetworkScale = 1.057;
const wideNetworkOffset = { x: 84, y: -51.5 };
const wideNetworkEllipses = networkEllipses.map((ellipse) => {
  const radiusGrowthX = ellipse.rx * (wideNetworkScale - 1);
  const radiusGrowthY = ellipse.ry * (wideNetworkScale - 1);
  const anchorCompensation = ellipse.id === "network-line-1"
    ? { x: radiusGrowthX, y: 0 }
    : ellipse.id === "network-line-2"
      ? { x: 0, y: -radiusGrowthY }
      : ellipse.id === "network-line-3"
        ? { x: 0, y: radiusGrowthY }
        : ellipse.id === "network-line-4"
          ? { x: -radiusGrowthX, y: 0 }
          : { x: 0, y: 59.5 };

  return {
    ...ellipse,
    cx: ellipse.cx + wideNetworkOffset.x + anchorCompensation.x,
    cy: ellipse.cy + wideNetworkOffset.y + anchorCompensation.y,
    rx: ellipse.rx * wideNetworkScale,
    ry: ellipse.ry * wideNetworkScale,
  };
});

const networkNodePositions = {
  default: {
    assistant: { x: 760, y: 98 },
    teammate: { x: 188, y: 181 },
    cli: { x: 610, y: 332 },
    agent: { x: 128, y: 423 },
    star: { x: 602, y: 229 },
    organization: { x: 176, y: 324 },
  },
  wide: {
    assistant: { x: 865, y: 40 },
    teammate: { x: 273, y: 134 },
    cli: { x: 693, y: 274 },
    agent: { x: 215, y: 365 },
    star: { x: 684, y: 179 },
    organization: { x: 263, y: 267 },
  },
} as const;

const networkNodeLineLinks = {
  assistant: ["network-line-2"],
  teammate: ["network-line-2", "network-line-4"],
  cli: ["network-line-1", "network-line-5"],
  agent: ["network-line-3", "network-line-4"],
  star: ["network-line-1", "network-line-2"],
  organization: ["network-line-4", "network-line-5"],
} as const;

const stage4NodeBorder = getStage4Border(1, 0.75);

const nodeBaseStyle: React.CSSProperties = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: 60,
  height: 60,
  border: stage4NodeBorder,
  borderRadius: 12,
  boxSizing: "border-box",
  background:
    "linear-gradient(316.61deg, #ffffff 10.27%, rgba(255, 255, 255, 0) 93.93%)",
  backdropFilter: "blur(27px)",
  rowGap: 4,
};

const labelStyle: React.CSSProperties = {
  margin: 0,
  color: "#646a73",
  fontSize: 8,
  fontWeight: 600,
  lineHeight: "8px",
  letterSpacing: -0.08,
  textAlign: "center",
};

const avatarStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 999,
  objectFit: "cover",
};

/** Stage 4 network graph center-left junction icon — replace the SVG file directly. */
const NETWORK_CENTER_HUB_ICON = "ui-icons/network-center-hub.svg";

const squareIconStyle: React.CSSProperties = {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  border: stage4NodeBorder,
  borderRadius: 8,
  boxSizing: "border-box",
  background:
    "linear-gradient(151.53deg, rgba(255, 255, 255, 0.76) 11.93%, rgba(255, 255, 255, 0.45) 89.29%)",
  backdropFilter: "blur(9px)",
};

const ProfileNode: React.FC<{
  label: string;
  image: string;
  x: number;
  y: number;
  progress: number;
  floatX: number;
  floatY: number;
}> = ({ label, image, x, y, progress, floatX, floatY }) => {
  const nodeScale = 0.62 + progress * 0.38;

  return (
    <div
      style={{
        ...nodeBaseStyle,
        left: x + floatX,
        top: y + floatY,
        opacity: progress,
        transform: `scale(${nodeScale})`,
        transformOrigin: "center",
      }}
    >
      <Img src={staticFile(`figma/${image}`)} style={avatarStyle} from={-150} />
      <p style={labelStyle}>{label}</p>
    </div>
  );
};

const SmallIconNode: React.FC<{
  x: number;
  y: number;
  progress: number;
  floatX: number;
  floatY: number;
  image?: string;
  iconSrc?: string;
  children?: React.ReactNode;
}> = ({ x, y, progress, floatX, floatY, image, iconSrc, children }) => {
  const nodeScale = 0.62 + progress * 0.38;

  return (
    <div
      style={{
        ...squareIconStyle,
        left: x + floatX,
        top: y + floatY,
        opacity: progress,
        transform: `scale(${nodeScale})`,
        transformOrigin: "center",
      }}
    >
      {iconSrc ? (
        <Img src={staticFile(iconSrc)} style={{ width: 18, height: 18 }} />
      ) : image ? (
        <Img
          src={staticFile(`figma/${image}`)}
          style={{ width: 18, height: 18 }}
        />
      ) : (
        children
      )}
    </div>
  );
};

const NetworkEllipse: React.FC<{
  id: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotation: number;
  progress: number;
  frame: number;
  floatX: number;
  floatY: number;
  startAngle?: number;
}> = ({
  id,
  cx,
  cy,
  rx,
  ry,
  rotation,
  progress,
  frame,
  floatX,
  floatY,
  startAngle = -90,
}) => {
  const floatCx = cx + floatX;
  const floatCy = cy + floatY;
  const angle =
    ((startAngle + progress * lineGradientSweepDegrees) * Math.PI) / 180;
  const gradientRadius = getEllipseRadiusAtAngle(rx, ry, angle);
  const gradientStart = {
    x: floatCx + Math.cos(angle) * gradientRadius,
    y: floatCy + Math.sin(angle) * gradientRadius,
  };
  const gradientEnd = {
    x: floatCx - Math.cos(angle) * gradientRadius,
    y: floatCy - Math.sin(angle) * gradientRadius,
  };
  const lineOpacity = 0.78 * clamp(progress / 0.08);
  const transform = `rotate(${rotation} ${floatCx} ${floatCy})`;
  const circumference = getEllipseApproximateCircumference(rx, ry);
  const movingDotCount = Math.max(1, Math.floor(circumference / ellipseMovingDotSpacing));
  const movingDotOffset = frame * ellipseMovingDotSpeed;
  const dotOpacity = 0.9 * clamp(progress / 0.18);

  return (
    <>
      <defs>
        <linearGradient
          id={`${id}-gradient`}
          gradientUnits="userSpaceOnUse"
          x1={gradientStart.x}
          y1={gradientStart.y}
          x2={gradientEnd.x}
          y2={gradientEnd.y}
        >
          <stop offset="0%" stopColor={lineColor} stopOpacity="1" />
          <stop
            offset={lineGradientOpaqueStop}
            stopColor={lineColor}
            stopOpacity="1"
          />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse
        cx={floatCx}
        cy={floatCy}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={`url(#${id}-gradient)`}
        strokeLinecap="round"
        strokeOpacity={lineOpacity}
        strokeWidth="1"
        strokeDasharray="1.5 3"
        transform={transform}
      />
      <g transform={transform} opacity={dotOpacity}>
        {Array.from({ length: movingDotCount }, (_, index) => {
          const dot = getEllipsePointAtArcRatio(
            floatCx,
            floatCy,
            rx,
            ry,
            (index * ellipseMovingDotSpacing + movingDotOffset) / circumference,
          );

          return (
            <circle
              key={`${id}-moving-dot-${index}`}
              cx={dot.x}
              cy={dot.y}
              r={ellipseMovingDotRadius}
              fill={lineColor}
              stroke="rgba(255,255,255,0.86)"
              strokeWidth="0.8"
            />
          );
        })}
      </g>
      {SHOW_GRADIENT_ENDPOINT_MARKERS ? (
        <g opacity={lineOpacity}>
          <line
            x1={gradientStart.x}
            y1={gradientStart.y}
            x2={gradientEnd.x}
            y2={gradientEnd.y}
            stroke="rgba(15, 23, 42, 0.36)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <circle
            cx={gradientStart.x}
            cy={gradientStart.y}
            r="4.5"
            fill="#22c55e"
            stroke="#fff"
            strokeWidth="1.5"
          />
          <circle
            cx={gradientEnd.x}
            cy={gradientEnd.y}
            r="4.5"
            fill="#ef4444"
            stroke="#fff"
            strokeWidth="1.5"
          />
          <text
            x={gradientStart.x + 7}
            y={gradientStart.y - 7}
            fill="#15803d"
            fontSize="9"
            fontWeight="800"
            paintOrder="stroke"
            stroke="#fff"
            strokeWidth="3"
          >
            {`${id} 100%`}
          </text>
          <text
            x={gradientEnd.x + 7}
            y={gradientEnd.y - 7}
            fill="#b91c1c"
            fontSize="9"
            fontWeight="800"
            paintOrder="stroke"
            stroke="#fff"
            strokeWidth="3"
          >
            {`${id} 0%`}
          </text>
        </g>
      ) : null}
    </>
  );
};

export const Stage4NetworkBackground = () => {
  const frame = useCurrentFrame();
  const text = useCopy();
  const layoutVariant = useLayoutVariant();
  const wide = layoutVariant === "wide";
  const ellipses = wide ? wideNetworkEllipses : networkEllipses;
  const nodePositions = networkNodePositions[layoutVariant];
  const canvasWidth = wide ? 1008 : 840;
  const canvasHeight = wide ? 521 : 623;
  const nodeProgress = Math.min(
    getStage4EnterProgress(frame),
    getStage4ExitProgress(frame),
  );
  const lineProgress = Math.min(
    getStage4LineEnterProgress(frame),
    getStage4LineExitProgress(frame),
  );
  const lineFloatPresence = Math.min(
    getStage4EnterProgress(frame),
    getStage4LineExitProgress(frame),
  );

  return (
    <AbsoluteFill
      style={{
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <svg
        width={canvasWidth}
        height={canvasHeight}
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        {ellipses.map((ellipse) => (
          <NetworkEllipse
            key={ellipse.id}
            {...ellipse}
            progress={lineProgress}
            frame={frame}
            {...getFloatOffset(ellipse.id, frame, lineFloatPresence)}
          />
        ))}
      </svg>

      <ProfileNode
        label={text.aiAssistant}
        image="mqf7oyhy-kwtl8yr.png"
        x={nodePositions.assistant.x}
        y={nodePositions.assistant.y}
        progress={nodeProgress}
        {...getLinkedNodeFloatOffset(networkNodeLineLinks.assistant, frame, nodeProgress)}
      />
      <ProfileNode
        label={text.aiTeammate}
        image="mqf7oyhy-uetrmy7.png"
        x={nodePositions.teammate.x}
        y={nodePositions.teammate.y}
        progress={nodeProgress}
        {...getLinkedNodeFloatOffset(networkNodeLineLinks.teammate, frame, nodeProgress)}
      />
      <ProfileNode
        label="Lark CLI"
        image="mqf7oyhw-pw7e9i7.svg"
        x={nodePositions.cli.x}
        y={nodePositions.cli.y}
        progress={nodeProgress}
        {...getLinkedNodeFloatOffset(networkNodeLineLinks.cli, frame, nodeProgress)}
      />
      <ProfileNode
        label={text.aiAgent}
        image="mqf7oyhy-m66inwq.png"
        x={nodePositions.agent.x}
        y={nodePositions.agent.y}
        progress={nodeProgress}
        {...getLinkedNodeFloatOffset(networkNodeLineLinks.agent, frame, nodeProgress)}
      />

      <SmallIconNode
        x={nodePositions.star.x}
        y={nodePositions.star.y}
        image="mqf7oyhw-wgyco03.svg"
        progress={nodeProgress}
        {...getLinkedNodeFloatOffset(networkNodeLineLinks.star, frame, nodeProgress)}
      />
      <SmallIconNode
        x={nodePositions.organization.x}
        y={nodePositions.organization.y}
        iconSrc={NETWORK_CENTER_HUB_ICON}
        progress={nodeProgress}
        {...getLinkedNodeFloatOffset(networkNodeLineLinks.organization, frame, nodeProgress)}
      />
    </AbsoluteFill>
  );
};
