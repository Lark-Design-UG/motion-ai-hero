import type { CSSProperties } from "react";
import type { ContainerLayout } from "./layout";

const phoneDesignContentWidth = 226;
const phoneDesignContentHeight = 432;
const phonePaddingX = 8;
const phonePaddingY = 8;

const getPhoneFrameMetrics = (width: number, height: number) => {
  const unit = Math.min(width / phoneDesignContentWidth, height / phoneDesignContentHeight);
  const paddingX = phonePaddingX * unit;
  const paddingY = phonePaddingY * unit;

  return {
    paddingX,
    paddingY,
    width: width + paddingX * 2,
    height: height + paddingY * 2,
  };
};

export const PhoneFrameBackdrop: React.FC<{
  layout: ContainerLayout;
  opacity: number;
  borderRadius: number;
}> = ({ layout, opacity, borderRadius }) => {
  const metrics = getPhoneFrameMetrics(layout.width, layout.height);
  const frameBorderRadius = borderRadius + Math.max(metrics.paddingX, metrics.paddingY);
  const style: CSSProperties = {
    position: "absolute",
    left: layout.x - metrics.paddingX,
    top: layout.y - metrics.paddingY,
    width: metrics.width,
    height: metrics.height,
    zIndex: layout.zIndex,
    transform: `scale(${layout.scale})`,
    transformOrigin: layout.transformOrigin,
    borderRadius: frameBorderRadius,
    background: "rgba(255, 255, 255, 0.54)",
    backdropFilter: "blur(23px)",
    boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.78), 0 8px 28px rgba(62, 79, 107, 0.08)",
    opacity: layout.opacity * opacity,
    pointerEvents: "none",
  };

  return <div style={style} />;
};
