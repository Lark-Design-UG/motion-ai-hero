import type { CSSProperties, ReactNode } from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { useCopy, useLocale } from "../localization";
import { localizedFontWeight } from "../typography";
import {
  getStage4VisualStart,
  getStageTransitionDuration,
  stage5BeforeDropPauseFrames,
  stage4To5InputDelayFrames,
  stageFrames,
  useContainerLayout,
} from "./layout";
import { PhoneFrameBackdrop } from "./PhoneFrame";
import { getGradientBorderBackground, UIContainer } from "./UIContainer";

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

const smoothProgress = (frame: number, start: number, end: number) => {
  const progress = clamp((frame - start) / (end - start));

  return progress * progress * (3 - 2 * progress);
};

const layerStyle = (opacity: number): CSSProperties => ({
  position: "absolute",
  inset: 0,
  opacity,
});

const getLayerTransform = (opacity: number): CSSProperties => ({
  transform: `translateY(${(1 - opacity) * 6}px)`,
});

const revealProgress = (progress: number, start: number, end: number) => {
  return smoothProgress(progress, start, end);
};

const revealStyle = (progress: number, start: number, end: number): CSSProperties => {
  const reveal = revealProgress(progress, start, end);

  return {
    opacity: reveal,
    transform: `translateY(${(1 - reveal) * 8}px) scale(${0.98 + reveal * 0.02})`,
    transformOrigin: "center",
  };
};

const inputFont = "var(--localized-ui-font)";
const stage4AiTextDelayFrames = -12;
const readyContentExitDelayFrames = 8;

const stage5PhoneUiRevealDurationFrames = 30;
const stage5AiTeammateRevealDurationFrames = stage5BeforeDropPauseFrames;
const stage1ImSeanRevealStartFrame = 8;
const stage1ImSeanRevealEndFrame = 40;
const stage1ImSeanTranslateStartFrame = 8;
const stage1ImSeanTranslateEndFrame = 50;
const stage1ImSeanEnglishFadeStartRatio = 0.28;
const stage1ImSeanEnglishFadeEndRatio = 0.92;
const stage1ImSeanDividerFadeStartRatio = 0.36;
const stage1ImSeanDividerFadeEndRatio = 0.82;
const stage1ImSeanBorderFadeInStartRatio = 0.03;
const stage1ImSeanBorderFadeInEndRatio = 0.24;
const stage1ImSeanBorderFadeOutStartRatio = 0.72;
const stage1ImSeanBorderFadeOutEndRatio = 1;

const messageAvatarStyle: CSSProperties = {
  width: 27,
  height: 27,
  borderRadius: 999,
  objectFit: "cover",
};

const ResponsiveLayer: React.FC<{
  opacity: number;
  layoutWidth: number;
  layoutHeight: number;
  borderRadius: number;
  children: (metrics: InputMetrics) => ReactNode;
}> = ({ opacity, layoutWidth, layoutHeight, borderRadius, children }) => {
  return (
    <div style={{ ...layerStyle(opacity), ...getLayerTransform(opacity) }}>
      {children(getInputMetrics(layoutWidth, layoutHeight, borderRadius))}
    </div>
  );
};

type InputMetrics = {
  width: number;
  height: number;
  density: number;
  borderRadius: number;
  padding: number;
  gap: number;
  iconSize: number;
  buttonSize: number;
  titleFontSize: number;
  titleLineHeight: number;
  statusFontSize: number;
  statusLineHeight: number;
};

const getInputMetrics = (width: number, height: number, borderRadius: number): InputMetrics => {
  const density = clamp(Math.min(width / 329, height / 90));
  const readableDensity = Math.max(density, 0.42);
  const padding = Math.max(4, Math.min(12, Math.min(width, height) * 0.13));

  return {
    width,
    height,
    density,
    borderRadius,
    padding,
    gap: Math.max(2, 4 * readableDensity),
    iconSize: Math.max(9, 16 * readableDensity),
    buttonSize: Math.max(14, 28 * readableDensity),
    titleFontSize: Math.max(9, 16 * readableDensity),
    titleLineHeight: Math.max(14, 28 * readableDensity),
    statusFontSize: Math.max(8, 12 * readableDensity),
    statusLineHeight: Math.max(11, 20 * readableDensity),
  };
};

const InputReadyView: React.FC<{
  metrics: InputMetrics;
  pressProgress: number;
  titleProgress: number;
}> = ({ metrics, pressProgress, titleProgress }) => {
  const text = useCopy();
  const inputPromptText = text.inputPrompt;
  const titleHeight = Math.max(14, metrics.height - metrics.padding * 2 - metrics.buttonSize - metrics.gap);
  const sendScale = 1 - 0.18 * Math.sin(Math.PI * pressProgress);
  const sendGlow = Math.sin(Math.PI * pressProgress);
  const actionProgress = smoothProgress(titleProgress, 0.74, 1);
  const typedLength = Math.min(inputPromptText.length, Math.ceil(inputPromptText.length * titleProgress));
  const typedText = inputPromptText.slice(0, typedLength);
  const cursorOpacity = titleProgress < 1 ? 0.35 + 0.65 * Math.sin(Math.PI * titleProgress * inputPromptText.length) ** 2 : 0;

  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        width: metrics.width,
        height: metrics.height,
        padding: metrics.padding,
        rowGap: metrics.gap,
        borderRadius: metrics.borderRadius,
        background: "#fff",
        fontFamily: inputFont,
      }}
    >
      <p
        style={{
          display: "-webkit-box",
          flexShrink: 0,
          alignSelf: "stretch",
          height: titleHeight,
          margin: 0,
          overflow: "hidden",
          color: "#1f2329",
          fontSize: metrics.titleFontSize,
          fontWeight: localizedFontWeight("heading", 700),
          letterSpacing: -0.13,
          lineHeight: `${metrics.titleLineHeight}px`,
        }}
      >
        <span
          style={{
            opacity: titleProgress > 0 ? 1 : 0,
            display: "inline-block",
            whiteSpace: "nowrap",
          }}
        >
          {typedText}
          <span style={{ opacity: cursorOpacity, fontWeight: 600 }}>|</span>
        </span>
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          alignSelf: "stretch",
          height: metrics.buttonSize,
          opacity: actionProgress,
          transform: `translateY(${(1 - actionProgress) * 4}px)`,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          <div style={getInputActionButtonStyle(metrics)}>
            <Img src={staticFile("ui-icons/input-attachment.svg")} style={getIconStyle(metrics.iconSize)} />
          </div>
          <div style={getInputActionButtonStyle(metrics)}>
            <Img src={staticFile("ui-icons/input-tool.svg")} style={getIconStyle(metrics.iconSize)} />
          </div>
          <div style={getInputActionButtonStyle(metrics)}>
            <Img src={staticFile("ui-icons/input-template.svg")} style={getIconStyle(metrics.iconSize)} />
          </div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", columnGap: Math.max(3, 7 * metrics.density) }}>
          <div style={getInputActionButtonStyle(metrics)}>
            <Img src={staticFile("ui-icons/input-microphone.svg")} style={getIconStyle(metrics.iconSize)} />
          </div>
          <div
            style={{
              width: metrics.buttonSize,
              height: metrics.buttonSize,
              borderRadius: 999,
              boxShadow: `0 0 ${14 * sendGlow}px rgba(75, 121, 255, ${0.32 * sendGlow})`,
              transform: `scale(${sendScale})`,
              transformOrigin: "center",
            }}
          >
            <Img
              src={staticFile("ui-icons/input-send-circle.svg")}
              style={{ width: metrics.buttonSize, height: metrics.buttonSize }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const getIconStyle = (size: number): CSSProperties => ({
  width: size,
  height: size,
  objectFit: "contain",
});

const getInputActionButtonStyle = (metrics: InputMetrics): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: metrics.buttonSize,
  height: metrics.buttonSize,
});

const DeepThinkingLabel: React.FC<{
  metrics: InputMetrics;
  frame: number;
}> = ({ metrics, frame }) => {
  const text = useCopy();
  const sweep = ((frame * 4) % 180) - 45;

  return (
    <p
      style={{
        position: "relative",
        flexGrow: 1,
        margin: 0,
        overflow: "hidden",
        color: "#646a73",
        fontSize: metrics.statusFontSize,
        fontWeight: 500,
        lineHeight: `${metrics.statusLineHeight}px`,
        whiteSpace: "nowrap",
      }}
    >
      <span>{text.deepThinking}</span>
      <span
        style={{
          position: "absolute",
          inset: 0,
        background: `linear-gradient(90deg, transparent ${sweep}%, #ffffff ${
            sweep + 12
          }%, transparent ${sweep + 24}%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          pointerEvents: "none",
        }}
      >
        {text.deepThinking}
      </span>
    </p>
  );
};

const AiGeneratingView: React.FC<{
  icon: string;
  metrics: InputMetrics;
  frame: number;
}> = ({ icon, metrics, frame }) => {
  const text = useCopy();
  const textHeight = Math.max(16, metrics.height - metrics.padding * 2 - metrics.statusLineHeight - metrics.gap);
  const lineSlotHeight = Math.min(textHeight, metrics.titleLineHeight * 1.08);

  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: metrics.width,
        height: metrics.height,
        padding: metrics.padding,
        rowGap: metrics.gap,
        borderRadius: metrics.borderRadius,
        background: "#fff",
        fontFamily: inputFont,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          columnGap: Math.max(4, 8 * metrics.density),
          width: "100%",
          height: metrics.statusLineHeight,
        }}
      >
        <Img src={staticFile(icon)} style={getIconStyle(metrics.iconSize)} />
        <DeepThinkingLabel metrics={metrics} frame={frame} />
      </div>
      <div
        style={{
          position: "relative",
          alignSelf: "stretch",
          height: textHeight,
        }}
      >
        <p
          style={{
            ...messageTextStyle(metrics),
            position: "relative",
            height: lineSlotHeight,
          }}
        >
          {text.reviewingUpdates}
        </p>
      </div>
    </div>
  );
};

const messageTextStyle = (metrics: InputMetrics): CSSProperties => ({
  position: "absolute",
  inset: 0,
  display: "-webkit-box",
  margin: 0,
  overflow: "hidden",
  color: "#1f2329",
  fontSize: metrics.titleFontSize,
  fontWeight: localizedFontWeight("heading", 700),
  letterSpacing: -0.13,
  lineHeight: `${metrics.titleLineHeight}px`,
});

export const ScaledDesign: React.FC<{
  designWidth: number;
  designHeight: number;
  layoutWidth: number;
  layoutHeight: number;
  children: ReactNode;
}> = ({ designWidth, designHeight, layoutWidth, layoutHeight, children }) => {
  const scale = Math.min((layoutWidth - 2) / designWidth, (layoutHeight - 2) / designHeight);
  const x = (layoutWidth - 2 - designWidth * scale) / 2;
  const y = (layoutHeight - 2 - designHeight * scale) / 2;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: designWidth,
        height: designHeight,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      {children}
    </div>
  );
};

const ChatBubble: React.FC<{
  children: ReactNode;
  blue?: boolean;
  width?: number;
}> = ({ children, blue = false, width }) => {
  return (
    <div
      style={{
        boxSizing: "border-box",
        width: width ?? "fit-content",
        maxWidth: "100%",
        borderRadius: 7,
        background: blue ? "#ddeaff" : "#ebeced",
        padding: "7px 10px",
        color: "#1f2329",
        fontSize: 10,
        lineHeight: "14px",
      }}
    >
      {children}
    </div>
  );
};

type MobileImConversationState = "initial" | "animated" | "final";

export const thaiSeanMessage = "อีกสักครู่เรามาคุยกัน เพื่อไล่ดูและปรับให้ตรงกันนะ";
export const englishSeanMessage = "Let's meet in a bit to go through them and align!";
export const seanDisplayName = "Sean Suwannarat";

const getStateReveal = (state: MobileImConversationState, frame: number, start: number, end: number) => {
  if (state === "initial") {
    return 0;
  }

  if (state === "final") {
    return 1;
  }

  return smoothProgress(frame, start, end);
};

const getStateTranslationProgress = (state: MobileImConversationState, frame: number) => {
  if (state === "initial") {
    return 0;
  }

  if (state === "final") {
    return 1;
  }

  return smoothProgress(frame, stage1ImSeanTranslateStartFrame, stage1ImSeanTranslateEndFrame);
};

const translatedBubbleStyle = (): CSSProperties => {
  return {
    position: "relative",
    width: 182,
    borderRadius: 9,
    padding: 1,
    background: "transparent",
  };
};

const SeanTranslatedBubble: React.FC<{
  translationProgress: number;
  frame: number;
}> = ({ translationProgress, frame }) => {
  const text = useCopy();
  const locale = useLocale();
  const englishProgress = smoothProgress(
    translationProgress,
    stage1ImSeanEnglishFadeStartRatio,
    stage1ImSeanEnglishFadeEndRatio,
  );
  const dividerProgress = smoothProgress(
    translationProgress,
    stage1ImSeanDividerFadeStartRatio,
    stage1ImSeanDividerFadeEndRatio,
  );
  const borderOpacity =
    smoothProgress(translationProgress, stage1ImSeanBorderFadeInStartRatio, stage1ImSeanBorderFadeInEndRatio) *
    (1 - smoothProgress(translationProgress, stage1ImSeanBorderFadeOutStartRatio, stage1ImSeanBorderFadeOutEndRatio));
  const englishHeight = 28;
  const dividerMargin = 6;

  return (
    <div style={translatedBubbleStyle()}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 9,
          background: getGradientBorderBackground(frame * 1.25),
          boxShadow: `0 0 14px rgba(91, 126, 255, ${0.22 * borderOpacity})`,
          opacity: borderOpacity,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          borderRadius: 8,
          background: "#ebeced",
          padding: "7px 10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#1f2329",
            fontSize: 10,
            lineHeight: "14px",
          }}
        >
          <p style={{ margin: 0 }}>
            <span style={{ color: "#3370ff", whiteSpace: "nowrap" }}>@All&nbsp;</span>
            {thaiSeanMessage}
          </p>
          <div
            style={{
              height: `${dividerMargin * 2 * dividerProgress + 1 * dividerProgress}px`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 1,
                marginTop: dividerMargin * dividerProgress,
                background: "#c9cdd4",
                opacity: dividerProgress * 0.9,
                transform: `scaleX(${0.65 + dividerProgress * 0.35})`,
                transformOrigin: "left center",
              }}
            />
          </div>
          <div
            style={{
              height: `${englishHeight * englishProgress}px`,
              overflow: "hidden",
            }}
          >
            <p
              style={{
                margin: 0,
                opacity: englishProgress,
                transform: `translateY(${(1 - englishProgress) * 6}px)`,
              }}
            >
              <span style={{ color: "#3370ff", whiteSpace: "nowrap" }}>
                {locale === "zh" ? "@所有人" : "@All"}&nbsp;
              </span>
              {text.seanTranslation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ImResultView: React.FC<{
  progress: number;
  messageProgress?: number;
  frame?: number;
  conversationState?: MobileImConversationState;
  conversationOpacity?: number;
  conversationMode?: "all" | "withoutConversation" | "conversationOnly";
}> = ({
  progress,
  messageProgress = progress,
  frame = 0,
  conversationState = "final",
  conversationOpacity = 1,
  conversationMode = "all",
}) => {
  const text = useCopy();
  const seanReveal = getStateReveal(conversationState, frame, stage1ImSeanRevealStartFrame, stage1ImSeanRevealEndFrame);
  const seanTranslationProgress = getStateTranslationProgress(conversationState, frame);
  const showConversation = conversationMode !== "withoutConversation";
  const nonConversationOpacity = conversationMode === "conversationOnly" ? 0 : 1;
  const messageOpacity = conversationMode === "conversationOnly" ? 0 : 1;

  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: 252,
        height: 498,
        padding: "12px 10px",
        borderRadius: 22,
        background: conversationMode === "conversationOnly" ? "transparent" : "#fff",
        color: "#1f2329",
        fontFamily: inputFont,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", rowGap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "7px 13px",
            ...revealStyle(progress, 0, 0.18),
            opacity: nonConversationOpacity * revealProgress(progress, 0, 0.18),
          }}
        >
          <p style={{ width: 27, margin: 0, color: "#646a73", fontSize: 10, fontWeight: 500, lineHeight: "14px" }}>
            9:41
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", columnGap: 1 }}>
            <Img src={staticFile("ui-icons/mobile-status-signal.svg")} style={{ width: 14, height: 10 }} />
            <Img src={staticFile("ui-icons/mobile-status-wifi.svg")} style={{ width: 10, height: 10 }} />
            <Img src={staticFile("ui-icons/mobile-status-battery.svg")} style={{ width: 22, height: 10 }} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 2,
            ...revealStyle(progress, 0.08, 0.26),
            opacity: nonConversationOpacity * revealProgress(progress, 0.08, 0.26),
          }}
        >
          <Img src={staticFile("ui-icons/mobile-nav-back.svg")} style={{ width: 12, height: 12 }} />
          <div style={{ display: "inline-flex", alignItems: "center", columnGap: 3 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 500, lineHeight: "21px" }}>
              {text.websiteRevampProject}
            </p>
            <Img src={staticFile("ui-icons/mobile-nav-chevron.svg")} style={{ width: 10, height: 10 }} />
          </div>
          <Img src={staticFile("ui-icons/mobile-nav-more.svg")} style={{ width: 12, height: 12 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", rowGap: 10, paddingRight: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              columnGap: 7,
              ...revealStyle(messageProgress, 0, 0.24),
              opacity: messageOpacity * revealProgress(messageProgress, 0, 0.24),
            }}
          >
            <Img src={staticFile("figma/mqg2gufp-7q4h372.png")} style={messageAvatarStyle} />
            <div style={{ display: "flex", flexDirection: "column", rowGap: 5 }}>
              <div style={{ display: "inline-flex", alignItems: "center", columnGap: 4 }}>
                <p style={{ margin: 0, color: "#8f959e", fontSize: 8, lineHeight: "13px" }}>
                  {text.reportSender}
                </p>
              </div>
              <div style={revealStyle(messageProgress, 0.16, 0.42)}>
                <ChatBubble>{text.reportReady}</ChatBubble>
              </div>
              <div
                style={{
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  width: 201,
                  border: "1px solid #dee0e3",
                  borderRadius: 7,
                  padding: 9,
                  rowGap: 10,
                  ...revealStyle(messageProgress, 0.34, 1),
                }}
              >
                <p style={{ margin: 0, fontSize: 10, fontWeight: 500, lineHeight: "14px" }}>
                  {text.reportTitle}
                </p>
                <div style={{ position: "relative", width: 181, height: 68 }}>
                  <Img
                    src={staticFile("figma/mqg2gufp-udmelvl.png")}
                    style={{ width: 181, height: 68, borderRadius: 5, objectFit: "cover", opacity: 0.8 }}
                  />
                  <p
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      width: 71,
                      margin: 0,
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      lineHeight: "12px",
                    }}
                  >
                    {text.reportCoverTitle}
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      right: 7,
                      bottom: 7,
                      margin: 0,
                      color: "rgba(255,255,255,0.62)",
                      fontSize: text.reportPeriod.length > 8 ? 14 : 22,
                      fontWeight: 700,
                      lineHeight: "22px",
                    }}
                  >
                    {text.reportPeriod}
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #1f23291f", paddingTop: 5 }}>
                  <p style={{ margin: 0, fontSize: 10, lineHeight: "13px" }}>{text.youCanView}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", columnGap: 4 }}>
                    <Img src={staticFile("ui-icons/external-link.svg")} style={{ width: 12, height: 12 }} />
                    <Img src={staticFile("ui-icons/open-square.svg")} style={{ width: 12, height: 12 }} />
                  </span>
                </div>
              </div>
            </div>
          </div>
          {showConversation ? (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                columnGap: 7,
                opacity: seanReveal * conversationOpacity,
                transform: `translateY(${(1 - seanReveal) * 8}px) scale(${0.98 + seanReveal * 0.02})`,
                transformOrigin: "center",
              }}
            >
              <Img src={staticFile("ui-icons/Sean-avatar.png")} style={messageAvatarStyle} />
              <div style={{ display: "flex", flexDirection: "column", rowGap: 5 }}>
                <p style={{ margin: 0, color: "#8f959e", fontSize: 8, lineHeight: "13px" }}>
                  {seanDisplayName}
                </p>
                <SeanTranslatedBubble translationProgress={seanTranslationProgress} frame={frame} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div
        style={{
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          width: 230,
          border: "1px solid #d0d3d6",
          borderRadius: 11,
          color: "#8f959e",
          ...revealStyle(progress, 0.82, 1),
          opacity: nonConversationOpacity * revealProgress(progress, 0.82, 1),
        }}
      >
        <p style={{ flexGrow: 1, margin: 0, padding: "10px 0 10px 10px", fontSize: 11, lineHeight: "19px" }}>
          {text.sendToProject}
        </p>
        <div
          style={{
            display: "grid",
            placeItems: "center",
            width: 38,
            height: 38,
            color: "#a8adb5",
          }}
        >
          <Img
            src={staticFile("ui-icons/im-send-filled.svg")}
            style={{ width: 22, height: 22, objectFit: "contain", transform: "translateX(-2px)" }}
          />
        </div>
      </div>
    </div>
  );
};

export const InputContainer = () => {
  const frame = useCurrentFrame();
  const layout = useContainerLayout("input");
  const contentWidth = Math.max(layout.width, 1);
  const contentHeight = Math.max(layout.height, 1);
  const typingStartFrame = stageFrames.stage2 + 6;
  const typingEndFrame = stageFrames.stage3 - 8;
  const pressStartFrame = stageFrames.stage3;
  const titleProgress = smoothProgress(frame, typingStartFrame, typingEndFrame);
  const pressProgress = smoothProgress(frame, pressStartFrame, pressStartFrame + 6);
  const readyContentExitProgress = smoothProgress(
    frame,
    pressStartFrame + 1 + readyContentExitDelayFrames,
    pressStartFrame + 12 + readyContentExitDelayFrames,
  );
  const aiTextStartFrame = getStage4VisualStart() + stage4AiTextDelayFrames;
  const checkingProgress = smoothProgress(frame, aiTextStartFrame, aiTextStartFrame + 8);
  const stage4To5VisualEndFrame = stageFrames.stage4 + getStageTransitionDuration("stage4");
  const inputMorphStartFrame = stageFrames.stage4 + stage4To5InputDelayFrames;
  const inputMorphEndFrame = stage4To5VisualEndFrame;
  const aiExitProgress = smoothProgress(frame, inputMorphStartFrame - 16, inputMorphStartFrame - 4);
  const imProgress = smoothProgress(frame, inputMorphStartFrame, inputMorphStartFrame + stage5PhoneUiRevealDurationFrames);
  const imShellProgress = smoothProgress(frame, inputMorphStartFrame, inputMorphStartFrame + stage5PhoneUiRevealDurationFrames);
  const imMessageProgress = smoothProgress(
    frame,
    inputMorphEndFrame,
    inputMorphEndFrame + stage5AiTeammateRevealDurationFrames,
  );
  const inputOpacity = 1 - readyContentExitProgress;
  const aiOpacity = checkingProgress * (1 - aiExitProgress);
  const imOpacity = imProgress;
  const borderOpacity = 1 - clamp((frame - stageFrames.stage6) / 8);
  const stage6PhoneOpacity = smoothProgress(frame, stageFrames.stage5, stageFrames.stage5 + getStageTransitionDuration("stage5"));
  const borderRadius = layout.borderRadius;
  const innerBorderRadius = Math.max(borderRadius - 1, 0);

  return (
    <>
      <PhoneFrameBackdrop layout={layout} opacity={stage6PhoneOpacity} borderRadius={borderRadius} />
      <UIContainer
        layout={layout}
        gradientBorder
        borderRadius={borderRadius}
        borderOpacityOverride={borderOpacity}
        pressProgress={pressProgress}
      >
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <ResponsiveLayer
            opacity={inputOpacity}
            layoutWidth={contentWidth}
            layoutHeight={contentHeight}
            borderRadius={innerBorderRadius}
          >
            {(metrics) => <InputReadyView metrics={metrics} pressProgress={pressProgress} titleProgress={titleProgress} />}
          </ResponsiveLayer>
          <ResponsiveLayer
            opacity={aiOpacity}
            layoutWidth={contentWidth}
            layoutHeight={contentHeight}
            borderRadius={innerBorderRadius}
          >
            {(metrics) => (
              <AiGeneratingView
                icon="ui-icons/input-ai-spark.svg"
                metrics={metrics}
                frame={frame}
              />
            )}
          </ResponsiveLayer>
          <div style={{ ...layerStyle(imOpacity), ...getLayerTransform(imOpacity) }}>
            <ScaledDesign designWidth={252} designHeight={498} layoutWidth={contentWidth} layoutHeight={contentHeight}>
              <ImResultView
                  progress={imShellProgress}
                  messageProgress={imMessageProgress}
                frame={frame}
                conversationMode="withoutConversation"
              />
            </ScaledDesign>
          </div>
        </div>
      </UIContainer>
    </>
  );
};
