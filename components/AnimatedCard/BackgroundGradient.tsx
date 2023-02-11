import React, { useEffect } from "react";
import {
  BlurMask,
  Canvas,
  RoundedRect,
  SweepGradient,
  useSharedValueEffect,
  useValue,
  vec,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface BackgroundGradientProps {
  width: number;
  height: number;
}
const padding = 40;

const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  width,
  height,
}) => {
  const rValue = useSharedValue(0);
  const skValue = useValue(0);

  useEffect(() => {
    rValue.value = withRepeat(withTiming(15, { duration: 2000 }), -1, true);
  }, [rValue]);

  useSharedValueEffect(() => {
    skValue.current = rValue.value;
  }, rValue);

  return (
    <Canvas style={{ width: width + padding, height: height + padding }}>
      <RoundedRect
        x={padding / 2}
        y={padding / 2}
        width={width}
        height={height}
        color={"white"}
        r={20}
      >
        <SweepGradient
          c={vec((width + padding) / 2, (height + padding) / 2)}
          colors={["cyan", "magenta", "yellow", "cyan"]}
        />
        <BlurMask blur={skValue} style="solid" />
      </RoundedRect>
    </Canvas>
  );
};

export default BackgroundGradient;
