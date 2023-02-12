import { StyleSheet, View } from "react-native";
import React from "react";
import {
  Canvas,
  Group,
  runTiming,
  SweepGradient,
  useTouchHandler,
  useValue,
  vec,
} from "@shopify/react-native-skia";
import RoundedItem from "./RoundedItem";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDING,
  SQUARES_AMOUNT_HORIZONTAL,
  SQUARES_AMOUNT_VERTICAL,
  SQUARE_CONTAINER_SIZE,
  SQUARE_SIZE,
} from "./constants";

const GridMagnification: React.FC = () => {
  const touchedPoint = useValue<{ x: number; y: number } | null>(null);
  const progress = useValue(0);
  const onTouch = useTouchHandler({
    onStart: (event) => {
      runTiming(progress, 1, { duration: 300 });
      touchedPoint.current = { x: event.x, y: event.y };
    },
    onActive: (event) => {
      touchedPoint.current = { x: event.x, y: event.y };
    },
    onEnd: () => {
      touchedPoint.current = null;
      runTiming(progress, 0, { duration: 300 });
    },
  });
  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas} onTouch={onTouch}>
        <Group>
          {new Array(SQUARES_AMOUNT_HORIZONTAL).fill(0).map((_, i) => {
            return new Array(SQUARES_AMOUNT_VERTICAL).fill(0).map((_, j) => {
              return (
                <RoundedItem
                  key={`${i}.${j}`}
                  x={i * SQUARE_CONTAINER_SIZE + PADDING / 2}
                  y={j * SQUARE_CONTAINER_SIZE + PADDING / 2}
                  width={SQUARE_SIZE}
                  height={SQUARE_SIZE}
                  point={touchedPoint}
                  progress={progress}
                />
              );
            });
          })}
          <SweepGradient
            c={vec(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)}
            colors={["cyan", "magenta", "yellow", "cyan"]}
          />
        </Group>
      </Canvas>
    </View>
  );
};

export default GridMagnification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: "black",
  },
});
