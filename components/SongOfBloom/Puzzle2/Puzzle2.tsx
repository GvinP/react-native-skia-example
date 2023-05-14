import type { SkRect } from "@shopify/react-native-skia";
import {
  runTiming,
  Fill,
  Image,
  useComputedValue,
  useClockValue,
  useValue,
  Canvas,
  Group,
  ImageShader,
  rect,
  useImage,
  useTouchHandler,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions } from "react-native";

import { deflate } from "../Tools";

import { Stripe } from "./Stripe";

const screen = Dimensions.get("screen");
const frameAspectRatio = 1621 / 1244;
const frameWidth = 350;
const frameRect = rect(
  (screen.width - frameWidth) / 2,
  64,
  frameWidth,
  frameWidth * frameAspectRatio
);

const width = 225;
const aspectRatio = 1317 / 783;
const height = width * aspectRatio;
const pictureRect = rect((screen.width - width) / 2, 100, width, height);
const numberOfStripes = 10;
const stripeWidth = width / numberOfStripes;
const stripes = new Array(numberOfStripes).fill(0).map((_, i) => i);

export const Puzzle2 = () => {
  const y = useValue(0);
  const offset = useValue(0);

  const background = useImage(require("../assets/bg.jpg"));
  const frame = useImage(require("../assets/frame.png"));
  const picture = useImage(require("../assets/art1.jpg"));
  const clock = useClockValue();
  const onTouch = useTouchHandler({
    onStart: (e) => {
      offset.current = y.current - e.y;
    },
    onActive: (e) => {
      const newY = offset.current + e.y;
      y.current = newY;
    },
    onEnd: () => {},
  });
  const transform = useComputedValue(() => [{ translateY: y.current }], [y]);
  if (!picture || !frame || !background) {
    return null;
  }
  return (
    <Canvas style={{ flex: 1 }} onTouch={onTouch}>
      <Fill color="#FDF8F7" />
      <Group transform={transform}>
        <Group
          transform={[
            { translateX: pictureRect.x },
            { translateY: pictureRect.y },
          ]}
        >
          <ImageShader
            image={picture}
            rect={rect(0, 0, width, height)}
            fit="fill"
          />
          {stripes.map((index) => (
            <Stripe
              key={index}
              index={index}
              clock={clock}
              stripeWidth={stripeWidth}
              height={height}
              numberOfStripes={numberOfStripes}
            />
          ))}
        </Group>
      </Group>
    </Canvas>
  );
};
