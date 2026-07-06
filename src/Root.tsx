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
        durationInFrames={totalDurationInFrames}
        fps={30}
        width={840}
        height={624}
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
        durationInFrames={totalDurationInFrames}
        fps={30}
        width={1600}
        height={1204}
      />
    </>
  );
};
