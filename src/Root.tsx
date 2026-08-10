import "./index.css";
import { Composition } from "remotion";
import { MyComposition, UIPreviewComposition, VerticalPreviewComposition } from "./Composition";
import { totalDurationInFrames } from "./containers/layout";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        defaultProps={{ locale: "en" }}
        durationInFrames={totalDurationInFrames}
        fps={30}
        width={840}
        height={624}
      />
      <Composition
        id="MyComp-CN"
        component={MyComposition}
        defaultProps={{ locale: "zh" }}
        durationInFrames={totalDurationInFrames}
        fps={30}
        width={840}
        height={624}
      />
      <Composition
        id="MyComp-Wide"
        component={MyComposition}
        defaultProps={{ locale: "en", layoutVariant: "wide" }}
        durationInFrames={totalDurationInFrames}
        fps={30}
        width={1008}
        // The Figma frame is 521px tall. H264 exports should use a 520px delivery preset.
        // eslint-disable-next-line @remotion/even-dimensions
        height={521}
      />
      <Composition
        id="UI-preview"
        component={UIPreviewComposition}
        durationInFrames={totalDurationInFrames}
        fps={30}
        width={1600}
        height={686}
      />
      <Composition
        id="Vertical-preview"
        component={VerticalPreviewComposition}
        defaultProps={{
          backgroundFile: "BGvertical-0804.png",
          myCompTop: 520,
        }}
        durationInFrames={totalDurationInFrames}
        fps={30}
        // BGvertical-0804.png is 2880x2202, exactly twice this composition size.
        width={1440}
        // eslint-disable-next-line @remotion/even-dimensions
        height={1101}
      />
      <Composition
        id="Vertical-preview-v2"
        component={VerticalPreviewComposition}
        defaultProps={{
          backgroundFile: "BGvertical_new_v2.png",
          myCompTop: 414,
        }}
        durationInFrames={totalDurationInFrames}
        fps={30}
        // BGvertical_new_v2.png is 2880x2146, exactly twice this composition size.
        width={1440}
        // eslint-disable-next-line @remotion/even-dimensions
        height={1073}
      />
    </>
  );
};
