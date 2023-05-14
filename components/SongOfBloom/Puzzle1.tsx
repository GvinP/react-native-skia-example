import {
  Shadow,
  rect,
  useImage,
  PathOp,
  Canvas,
  Path,
  Skia,
  useTouchHandler,
  useValue,
  Image,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions } from "react-native";

import { drawCircle } from "./Tools";

const { width, height } = Dimensions.get("window");
const rct = rect(0, 0, width, height);

export const Puzzle1 = () => {
  const bg = useImage(require("./assets/bg.png"));
  const mask = useImage(require("./assets/mask.png"));
  if (!bg || !mask) {
    return null;
  }
  return (
    <Canvas style={{ width, height }}>
      <Image image={bg} rect={rct} />
    </Canvas>
  );
};
