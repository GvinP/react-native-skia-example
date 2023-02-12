import {
  Skia,
  SkiaMutableValue,
  SkMatrix,
  SkRect,
  useSharedValueEffect,
} from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { identity4, Matrix4, multiply4, toMatrix3 } from "react-native-redash";
import { concat, vec3 } from "./MatrixHelpers";

interface GestureHandlerProps {
  matrix: SkiaMutableValue<SkMatrix>;
  dimensions: SkRect;
  debug?: boolean;
}

export const GestureHandler = ({
  matrix: skMatrix,
  dimensions,
  debug,
}: GestureHandlerProps) => {
  const { x, y, width, height } = dimensions;
  const origin = useSharedValue(vec3(0, 0, 0));
  const offset = useSharedValue(identity4);
  const matrix = useSharedValue(identity4);
  useSharedValueEffect(() => {
    skMatrix.current = Skia.Matrix(toMatrix3(matrix.value));
  }, matrix);
  const pan = Gesture.Pan().onChange((e) => {
    matrix.value = multiply4(
      matrix.value,
      Matrix4.translate(e.changeX, e.changeY, 0)
    );
  });
  const pinch = Gesture.Pinch()
    .onBegin((e) => {
      offset.value = matrix.value;
      origin.value = [e.focalX, e.focalY, 0];
    })
    .onChange((e) => {
      matrix.value = concat(offset.value, origin.value, [{ scale: e.scale }]);
    });
  const rotation = Gesture.Rotation()
    .onBegin((e) => {
      offset.value = matrix.value;
      origin.value = [e.anchorX, e.anchorY, 0];
    })
    .onChange((e) => {
      matrix.value = concat(offset.value, origin.value, [
        { rotateZ: e.rotation },
      ]);
    });
  const style = useAnimatedStyle(() => ({
    position: "absolute",
    left: x,
    top: y,
    width,
    height,
    transform: [
      { translateX: -width / 2 },
      { translateY: -height / 2 },
      { matrix: matrix.value as unknown as number[] },
      { translateX: width / 2 },
      { translateY: height / 2 },
    ],
  }));
  return (
    <GestureDetector gesture={Gesture.Race(pan, pinch, rotation)}>
      <Animated.View style={style} />
    </GestureDetector>
  );
};
