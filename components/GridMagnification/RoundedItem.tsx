import React from "react";
import {
  Extrapolate,
  Group,
  interpolate,
  RoundedRect,
  SkiaMutableValue,
  useComputedValue,
  useValue,
} from "@shopify/react-native-skia";
import { CANVAS_HEIGHT, CANVAS_WIDTH, MAX_DISTANCE } from "./constants";

interface RoundedItemProps {
  x: number;
  y: number;
  width: number;
  height: number;
  point: SkiaMutableValue<{ x: number; y: number } | null>;
  progress: SkiaMutableValue<number>;
}

const RoundedItem: React.FC<RoundedItemProps> = ({
  x,
  y,
  width,
  height,
  point,
  progress,
}) => {
  const previousDistance = useValue(0);
  const previousTouchedPoint = useValue({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
  });
  const distance = useComputedValue(() => {
    if (point.current === null) return previousDistance.current;
    previousDistance.current = Math.sqrt(
      (point.current.x - x) ** 2 + (point.current.y - y) ** 2
    );
    return previousDistance.current;
  }, [point]);
  const scale = useComputedValue(() => {
    return interpolate(
      distance.current * progress.current,
      [0, MAX_DISTANCE / 2],
      [1, 0],
      {
        extrapolateLeft: Extrapolate.CLAMP,
        extrapolateRight: Extrapolate.CLAMP,
      }
    );
  }, [distance, progress]);
  const transform = useComputedValue(() => {
    return [{ scale: scale.current }];
  }, [scale]);
  const origin = useComputedValue(() => {
    if (point.current === null) {
      return previousTouchedPoint.current;
    }
    previousTouchedPoint.current = point.current;
    return previousTouchedPoint.current;
  }, [point]);
  return (
    <Group origin={origin} transform={transform}>
      <RoundedRect {...{ x, y, width, height }} r={4} />
    </Group>
  );
};

export default RoundedItem;
