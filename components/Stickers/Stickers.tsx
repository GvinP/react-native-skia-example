import {
  Canvas,
  Skia,
  useFont,
  useImage,
  useValue,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, View } from "react-native";

import { HelloSticker, HelloStickerDimensions } from "./HelloSticker";
import { LocationSticker, LocationStickerDimensions } from "./LocationSticker";
import { GestureHandler } from "./GestureHandler";
import { Picture, PictureDimensions } from "./Picture";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { identity4, Matrix4, multiply4 } from "react-native-redash";

const { width, height } = Dimensions.get("window");

const zurich = require("./assets/zurich.jpg");
const aveny = require("./assets/aveny.ttf");

export const Stickers = () => {
  const image = useImage(zurich);
  const font = useFont(aveny, 56);
  const matrix = useSharedValue(identity4);
  const pan = Gesture.Pan().onChange((e) => {
    matrix.value = multiply4(
      matrix.value,
      Matrix4.translate(e.changeX, e.changeY, 0)
    );
  });
  const pinch = Gesture.Pinch().onChange((e) => {
    matrix.value = multiply4(
      matrix.value,
      Matrix4.scale(e.scaleChange, e.scaleChange, 1)
    );
  });
  const rotation = Gesture.Rotation().onChange((e) => {
    matrix.value = multiply4(matrix.value, Matrix4.rotateZ(e.rotationChange));
  });
  const style = useAnimatedStyle(() => ({
    transform: [{ matrix: matrix.value as unknown as number[] }],
  }));
  if (!image || !font) {
    return null;
  }
  return (
    <View>
      <GestureDetector gesture={Gesture.Race(pan, pinch, rotation)}>
        <Animated.View style={style}>
          <Canvas style={{ width, height }}>
            <Picture image={image} />
          </Canvas>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
