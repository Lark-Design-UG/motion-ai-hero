import { Easing, Img, staticFile, useCurrentFrame } from "remotion";
import type { ReactNode } from "react";
import { englishSeanMessage, ImResultView, ScaledDesign, thaiSeanMessage } from "./InputContainer";
import {
  type ContainerLayout,
  getStage1To2MorphProgress,
  getStage4StateChangeProgress,
  getStage4VisualStart,
  getStage2To3MorphProgress,
  getStage3To4MorphProgress,
  stageFrames,
  useContainerLayout,
} from "./layout";
import { PhoneFrameBackdrop } from "./PhoneFrame";
import { UIContainer } from "./UIContainer";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
};

type ImVariant = "stage2" | "stage3" | "stage4";

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;
const imFont =
  '"Lark Circular", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif';

const smoothProgress = (frame: number, start: number, duration: number) => {
  return Easing.bezier(0.16, 1, 0.3, 1)(clamp((frame - start) / duration));
};

const smoothRatio = (progress: number, start: number, end: number) => {
  const value = clamp((progress - start) / (end - start));

  return value * value * (3 - 2 * value);
};

const getStage4ReportProgress = (frame: number) => getStage4StateChangeProgress(frame);

const getStage4AdaptiveImLayout = (layout: ContainerLayout, frame: number): ContainerLayout => {
  const stage4Presence = smoothProgress(frame, getStage4VisualStart(), 12) * (1 - smoothProgress(frame, stageFrames.stage4, 18));

  if (stage4Presence <= 0) {
    return layout;
  }

  const stage4Layout = { width: 204, height: 165, borderRadius: 12 };

  return {
    ...layout,
    width: lerp(layout.width, stage4Layout.width, stage4Presence),
    height: lerp(layout.height, stage4Layout.height, stage4Presence),
    borderRadius: lerp(layout.borderRadius, stage4Layout.borderRadius, stage4Presence),
  };
};

const mixRect = (from: Rect, to: Rect, progress: number): Rect => ({
  x: lerp(from.x, to.x, progress),
  y: lerp(from.y, to.y, progress),
  width: lerp(from.width, to.width, progress),
  height: lerp(from.height, to.height, progress),
  opacity: lerp(from.opacity, to.opacity, progress),
});

const contentPadding = 0;

const designs: Record<ImVariant, { width: number; height: number }> = {
  stage2: { width: 266, height: 273 },
  stage3: { width: 328, height: 240 },
  stage4: { width: 204, height: 165 },
};

const rects: Record<ImVariant, Record<"sidebar" | "main" | "projectHeader" | "messengerHeader" | "messages" | "input", Rect>> = {
  stage2: {
    sidebar: { x: -160, y: 0, width: 126, height: 273, opacity: 0 },
    main: { x: 0, y: 0, width: 266, height: 273, opacity: 1 },
    projectHeader: { x: 12, y: 16, width: 242, height: 24, opacity: 1 },
    messengerHeader: { x: 12, y: 16, width: 180, height: 24, opacity: 0 },
    messages: { x: 12, y: 60, width: 242, height: 135, opacity: 1 },
    input: { x: 12, y: 231, width: 242, height: 30, opacity: 1 },
  },
  stage3: {
    sidebar: { x: 0, y: 0, width: 128, height: 240, opacity: 1 },
    main: { x: 129, y: 0, width: 199, height: 240, opacity: 1 },
    projectHeader: { x: 141, y: 16, width: 175, height: 24, opacity: 1 },
    messengerHeader: { x: 12, y: 12, width: 104, height: 24, opacity: 0 },
    messages: { x: 141, y: 58, width: 175, height: 118, opacity: 1 },
    input: { x: 141, y: 198, width: 175, height: 30, opacity: 1 },
  },
  stage4: {
    sidebar: { x: -160, y: 0, width: 126, height: 165, opacity: 0 },
    main: { x: 0, y: 0, width: 204, height: 165, opacity: 1 },
    projectHeader: { x: 9, y: 9, width: 186, height: 18, opacity: 0 },
    messengerHeader: { x: 9, y: 9, width: 186, height: 18, opacity: 1 },
    messages: { x: 9, y: 36, width: 186, height: 122, opacity: 1 },
    input: { x: 9, y: 166, width: 186, height: 0, opacity: 0 },
  },
};

const mapRectToContent = (
  rect: Rect,
  designWidth: number,
  designHeight: number,
  availableWidth: number,
  availableHeight: number,
): Rect => ({
  x: contentPadding + (rect.x / designWidth) * availableWidth,
  y: contentPadding + (rect.y / designHeight) * availableHeight,
  width: (rect.width / designWidth) * availableWidth,
  height: (rect.height / designHeight) * availableHeight,
  opacity: rect.opacity,
});

const getImState = (frame: number) => {
  const stage1To2 = getStage1To2MorphProgress(frame);
  const stage2To3 = getStage2To3MorphProgress(frame);
  const stage3To4 = getStage3To4MorphProgress(frame);

  if (stage3To4 > 0) {
    return { from: "stage3" as const, to: "stage4" as const, progress: stage3To4, stage1Opacity: 0 };
  }

  if (stage2To3 > 0) {
    return { from: "stage2" as const, to: "stage3" as const, progress: stage2To3, stage1Opacity: 0 };
  }

  return { from: "stage2" as const, to: "stage2" as const, progress: 1, stage1Opacity: 1 - stage1To2 };
};

const Avatar: React.FC<{ src: string; size: number }> = ({ src, size }) => (
  <Img
    src={staticFile(`figma/${src}`)}
    style={{
      width: size,
      height: size,
      borderRadius: 999,
      objectFit: "cover",
      flexShrink: 0,
    }}
  />
);

const ProjectIcon: React.FC<{ size: number }> = ({ size }) => (
  <Avatar src="mqhj7b8u-25ecx5z.png" size={size} />
);

const MessengerIcon: React.FC<{ size: number }> = ({ size }) => (
  <Img src={staticFile("ui-icons/im_todo_colorful.svg")} style={{ width: size, height: size, flexShrink: 0 }} />
);

const SendIcon: React.FC<{ size: number }> = ({ size }) => (
  <Img src={staticFile("ui-icons/im-send-filled.svg")} style={{ display: "block", width: size, height: size }} />
);

const HeaderRow: React.FC<{ width: number; height: number; type: "project" | "messenger" }> = ({ width, height, type }) => {
  const unit = Math.min(width / 180, height / 24);
  const iconSize = height;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        columnGap: 8 * unit,
        width,
        height,
        fontFamily: imFont,
        overflow: "hidden",
      }}
    >
      {type === "project" ? <ProjectIcon size={iconSize} /> : <MessengerIcon size={iconSize} />}
      <p
        style={{
          margin: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: "#1f2329",
          fontSize: (type === "project" ? 9 : 12) * unit,
          fontWeight: type === "project" ? 400 : 600,
          lineHeight: `${18 * unit}px`,
        }}
      >
        {type === "project" ? "Website Revamp Project" : "Messenger"}
      </p>
    </div>
  );
};

const Bubble: React.FC<{ children: ReactNode; tone: "gray" | "blue"; unit: number }> = ({ children, tone, unit }) => (
  <div
    style={{
      borderRadius: 6 * unit,
      background: tone === "gray" ? "#ebeced" : "#ddeaff",
      padding: `${6 * unit}px ${8 * unit}px`,
      color: "#1f2329",
      fontSize: 8 * unit,
      lineHeight: `${12 * unit}px`,
      fontFamily: imFont,
      maxWidth: "100%",
    }}
  >
    {children}
  </div>
);

const Conversation: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const unit = Math.min(width / 186, height / 90);
  const avatarSize = 22 * unit;
  const gap = 8 * unit;

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: gap, width, height, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "flex-start", columnGap: 6 * unit }}>
        <Avatar src="mqhj7b8u-6u2anoj.png" size={avatarSize} />
        <div style={{ display: "flex", flexDirection: "column", rowGap: 4 * unit, flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, color: "#8f959e", fontSize: 7 * unit, lineHeight: `${10 * unit}px`, fontFamily: imFont }}>
            Sean Davis
          </p>
          <div style={{ display: "flex", flexDirection: "column", rowGap: 4 * unit }}>
            <Bubble tone="gray" unit={unit}>
              <p style={{ margin: 0 }}>{thaiSeanMessage}</p>
              <div style={{ height: 1, margin: `${5 * unit}px 0`, background: "#c9cdd4", opacity: 0.9 }} />
              <p style={{ margin: 0 }}>{englishSeanMessage}</p>
            </Bubble>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportMessage: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const unit = Math.min(width / 186, height / 122);
  const avatarSize = 18 * unit;
  const cardWidth = Math.min(144 * unit, Math.max(width - avatarSize - 7 * unit, 1));
  const reportHeight = Math.max(36 * unit, Math.min(42 * unit, height * 0.34));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        columnGap: 5 * unit,
        width,
        height,
        overflow: "hidden",
        fontFamily: imFont,
      }}
    >
      <Avatar src="mqgfpq1y-j7ie2uf.png" size={avatarSize} />
      <div style={{ display: "flex", flexDirection: "column", rowGap: 2.5 * unit, minWidth: 0 }}>
        <div style={{ display: "inline-flex", alignItems: "center", columnGap: 2 * unit }}>
          <p style={{ margin: 0, color: "#8f959e", fontSize: 5.5 * unit, lineHeight: `${8 * unit}px` }}>
            AI Agent
          </p>
        </div>
        <div
          style={{
            alignSelf: "flex-start",
            borderRadius: 5 * unit,
            background: "#ebeced",
            padding: `${4.5 * unit}px ${6 * unit}px`,
            color: "#1f2329",
            fontSize: 6.5 * unit,
            lineHeight: `${9 * unit}px`,
          }}
        >
          Your project report is ready to review.
        </div>
        <div
          style={{
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            rowGap: 4 * unit,
            width: cardWidth,
            border: `${Math.max(0.75, unit)}px solid #dee0e3`,
            borderRadius: 5 * unit,
            background: "#fff",
            padding: 5.5 * unit,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", columnGap: 3 * unit, height: 10 * unit }}>
            <Img src={staticFile("ui-icons/doc-file-blue.svg")} style={{ width: 10 * unit, height: 10 * unit }} />
            <p style={{ margin: 0, color: "#1f2329", fontSize: 6 * unit, fontWeight: 600, lineHeight: `${9 * unit}px` }}>
              2026 Q3 Project weekly report
            </p>
          </div>
          <div style={{ position: "relative", width: "100%", height: reportHeight, borderRadius: 3 * unit, overflow: "hidden" }}>
            <Img
              src={staticFile("figma/mqgfpq1y-xchj4m9.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.82 }}
            />
            <p style={{ position: "absolute", top: 5 * unit, left: 5 * unit, width: 44 * unit, margin: 0, color: "#fff", fontSize: 6 * unit, fontWeight: 800, lineHeight: `${8 * unit}px`, textTransform: "uppercase" }}>
              weekly report
            </p>
            <p style={{ position: "absolute", right: 5 * unit, bottom: 5 * unit, margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 14 * unit, fontWeight: 800, lineHeight: `${14 * unit}px` }}>
              2026 Q3
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `${Math.max(0.75, unit)}px solid rgba(31,35,41,0.12)`, paddingTop: 3 * unit }}>
            <span style={{ color: "#1f2329", fontSize: 6 * unit, lineHeight: `${8 * unit}px` }}>You can view</span>
            <span style={{ display: "inline-flex", alignItems: "center", columnGap: 4 * unit }}>
              <Img src={staticFile("ui-icons/external-link.svg")} style={{ width: 8 * unit, height: 8 * unit }} />
              <Img src={staticFile("ui-icons/open-square.svg")} style={{ width: 8 * unit, height: 8 * unit }} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputBar: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const unit = Math.min(width / 242, height / 30);
  const sendSize = 14 * unit;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width,
        height,
        border: `${Math.max(0.75 * unit, 0.75)}px solid #d0d3d6`,
        borderRadius: 6 * unit,
        paddingLeft: 8 * unit,
        boxSizing: "border-box",
        color: "#8f959e",
        fontSize: 8 * unit,
        fontFamily: imFont,
      }}
    >
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Send to Website Revamp Project</span>
      <span
        style={{
          display: "grid",
          placeItems: "center",
          width: 26 * unit,
          height: 26 * unit,
          flexShrink: 0,
        }}
      >
        <SendIcon size={sendSize} />
      </span>
    </div>
  );
};

const Sidebar: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const unit = Math.min(width / 128, height / 240);
  const people = [
    ["mqhj7b8u-s59y9yw.png", "Buckner"],
    ["mqhj7b8u-zg0whlu.png", "Gera"],
    ["mqhj7b8u-6vu49qd.png", "Alexander"],
  ];
  const feeds = [
    ["mqhj7b8u-25ecx5z.png", "Website Revamp...", "The project you are res..."],
    ["mqhj7b8u-5xcu2v9.png", "Approval", "The project you are res..."],
    ["mqhj7b8u-4wmry9p.png", "Taylor", "We may need to identif..."],
    ["mqhj7b8u-wta1c2h.png", "Powell", "We may need to identif..."],
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: 10 * unit,
        width,
        height,
        padding: `${12 * unit}px ${8 * unit}px ${12 * unit}px ${12 * unit}px`,
        background: "rgba(255,255,255,0.98)",
        borderRight: `${Math.max(0.75 * unit, 0.75)}px solid #dee0e3`,
        borderRadius: `${12 * unit}px 0 0 ${12 * unit}px`,
        boxSizing: "border-box",
        fontFamily: imFont,
      }}
    >
      <HeaderRow width={width - 20 * unit} height={24 * unit} type="messenger" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {people.map(([src, label]) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", rowGap: 2 * unit }}>
            <Avatar src={src} size={22 * unit} />
            <span style={{ color: "#646a73", fontSize: 6 * unit, lineHeight: `${8 * unit}px` }}>{label}</span>
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", rowGap: 2 * unit }}>
          <Img src={staticFile("figma/mqhj7b8u-lcjb03f.png")} style={{ width: 22 * unit, height: 22 * unit, borderRadius: 999 }} />
          <span style={{ color: "#646a73", fontSize: 6 * unit, lineHeight: `${8 * unit}px` }}>Show</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", rowGap: 1 * unit, overflow: "hidden" }}>
        {feeds.map(([src, name, preview]) => (
          <div key={name} style={{ display: "flex", alignItems: "center", columnGap: 6 * unit, padding: `${6 * unit}px ${2 * unit}px`, minHeight: 36 * unit }}>
            <Avatar src={src} size={24 * unit} />
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, color: "#1f2329", fontSize: 9 * unit, lineHeight: `${13 * unit}px`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</p>
              <p style={{ margin: 0, color: "#8f959e", fontSize: 7 * unit, lineHeight: `${12 * unit}px`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{preview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Panel: React.FC<{ rect: Rect; children: ReactNode }> = ({ rect, children }) => (
  <div style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.width, height: rect.height, opacity: rect.opacity, overflow: "hidden" }}>
    {children}
  </div>
);

const MessengerContent: React.FC<{ frame: number; width: number; height: number }> = ({ frame, width, height }) => {
  const { from, to, progress, stage1Opacity } = getImState(frame);
  const designWidth = lerp(designs[from].width, designs[to].width, progress);
  const designHeight = lerp(designs[from].height, designs[to].height, progress);
  const availableWidth = Math.max(width - contentPadding * 2, 1);
  const availableHeight = Math.max(height - contentPadding * 2, 1);
  const map = (rect: Rect) => mapRectToContent(rect, designWidth, designHeight, availableWidth, availableHeight);
  const sidebarRect = map(mixRect(rects[from].sidebar, rects[to].sidebar, progress));
  const mainRect = map(mixRect(rects[from].main, rects[to].main, progress));
  const projectHeaderRect = map(mixRect(rects[from].projectHeader, rects[to].projectHeader, progress));
  const messengerHeaderRect = map(mixRect(rects[from].messengerHeader, rects[to].messengerHeader, progress));
  const messagesRect = map(mixRect(rects[from].messages, rects[to].messages, progress));
  const inputRect = map(mixRect(rects[from].input, rects[to].input, progress));
  const messengerOpacity = 1 - stage1Opacity;
  const stage1To2Progress = getStage1To2MorphProgress(frame);
  const stage1ConversationHandoffProgress = smoothRatio(stage1To2Progress, 0.56, 1);
  const stage1ConversationBridgeOpacity = 1 - stage1ConversationHandoffProgress;
  const stage2ConversationOpacity = stage1To2Progress > 0 ? stage1ConversationHandoffProgress : 1;
  const reportProgress = getStage4ReportProgress(frame);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: stage1Opacity }}>
        <ScaledDesign designWidth={252} designHeight={498} layoutWidth={width} layoutHeight={height}>
          <ImResultView
            progress={1}
            frame={frame}
            conversationState="animated"
            conversationMode="withoutConversation"
          />
        </ScaledDesign>
      </div>
      {stage1ConversationBridgeOpacity > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: stage1ConversationBridgeOpacity }}>
          <ScaledDesign designWidth={252} designHeight={498} layoutWidth={width} layoutHeight={height}>
            <ImResultView
              progress={1}
              frame={frame}
              conversationState="animated"
              conversationMode="conversationOnly"
            />
          </ScaledDesign>
        </div>
      ) : null}
      <div style={{ position: "absolute", inset: 0, opacity: messengerOpacity }}>
        <Panel rect={sidebarRect}>
          <Sidebar width={sidebarRect.width} height={sidebarRect.height} />
        </Panel>
        <Panel rect={mainRect}>
          <div
            style={{
              width: mainRect.width,
              height: mainRect.height,
              borderRadius: sidebarRect.opacity > 0.05 ? `0 ${12 * Math.min(mainRect.width / 199, mainRect.height / 240)}px ${12 * Math.min(mainRect.width / 199, mainRect.height / 240)}px 0` : 12,
              background: "#fff",
            }}
          />
        </Panel>
        <Panel rect={projectHeaderRect}>
          <HeaderRow width={projectHeaderRect.width} height={projectHeaderRect.height} type="project" />
        </Panel>
        <Panel rect={messengerHeaderRect}>
          <HeaderRow width={messengerHeaderRect.width} height={messengerHeaderRect.height} type="messenger" />
        </Panel>
        <Panel rect={messagesRect}>
          <div style={{ position: "relative", width: messagesRect.width, height: messagesRect.height }}>
            <div style={{ position: "absolute", inset: 0, opacity: (1 - reportProgress) * stage2ConversationOpacity }}>
              <Conversation width={messagesRect.width} height={messagesRect.height} />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: reportProgress,
                transform: `translateY(${(1 - reportProgress) * 4}px)`,
              }}
            >
              <ReportMessage width={messagesRect.width} height={messagesRect.height} />
            </div>
          </div>
        </Panel>
        <Panel rect={inputRect}>
          <InputBar width={inputRect.width} height={inputRect.height} />
        </Panel>
      </div>
    </div>
  );
};

export const ImContainer = () => {
  const frame = useCurrentFrame();
  const layout = useContainerLayout("im");
  const adaptiveLayout = getStage4AdaptiveImLayout(layout, frame);
  const contentWidth = Math.max(adaptiveLayout.width, 1);
  const contentHeight = Math.max(adaptiveLayout.height, 1);
  const stage1PhoneOpacity = 1 - getStage1To2MorphProgress(frame);
  const borderRadius = adaptiveLayout.borderRadius;

  return (
    <>
      <PhoneFrameBackdrop layout={adaptiveLayout} opacity={stage1PhoneOpacity} borderRadius={borderRadius} />
      <UIContainer layout={adaptiveLayout} borderRadius={borderRadius}>
        <MessengerContent frame={frame} width={contentWidth} height={contentHeight} />
      </UIContainer>
    </>
  );
};
