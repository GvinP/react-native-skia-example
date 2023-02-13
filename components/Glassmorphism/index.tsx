import { useWindowDimensions } from "react-native";
import React, { useMemo } from "react";
import {
  add,
  BackdropBlur,
  BackdropFilter,
  Blur,
  Canvas,
  Circle,
  Fill,
  Group,
  LinearGradient,
  mix,
  Paint,
  Shadow,
  sub,
  Turbulence,
  useComputedValue,
  useLoop,
  vec,
} from "@shopify/react-native-skia";

const Glassmorphism = () => {
  const { width, height } = useWindowDimensions();
  const c = vec(width / 2, height / 2);
  const r = c.x - 32;
  const rect = useMemo(
    () => ({ x: 0, y: c.y, width, height: c.y }),
    [c.y, width]
  );

  const progress = useLoop({ duration: 2000 });
  const start = useComputedValue(
    () => sub(c, vec(0, mix(progress.current, r, r / 2))),
    [progress]
  );
  const end = useComputedValue(
    () => add(c, vec(0, mix(progress.current, r, r / 2))),
    []
  );
  const radius = useComputedValue(
    () => mix(progress.current, r, r / 2),
    [progress]
  );

  return (
    <Canvas style={{ flex: 1 }}>
      <Fill color="black" />
      <LinearGradient start={start} end={end} colors={["#FFF723", "#E70696"]} />
      <Circle c={c} r={radius} />
      <BackdropFilter filter={<Blur blur={20} />} clip={rect}>
        <Fill color="rgba(0, 0, 0, 0.3)" />
      </BackdropFilter>
    </Canvas>
  );
};

export default Glassmorphism;
