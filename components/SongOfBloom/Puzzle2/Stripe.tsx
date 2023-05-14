import type { SkRect, SkiaValue, Vector } from "@shopify/react-native-skia";
import {
  rect,
  runTiming,
  useComputedValue,
  Easing,
  runSpring,
  mix,
  Vertices,
  useValue,
  vec,
} from "@shopify/react-native-skia";
import { createNoise2D, createNoise3D } from "simplex-noise";

import { Skeleton } from "./Skeleton";

const pad = 6;

const generateTrianglePointsAndIndices = (
  rct: SkRect,
  triangleNumberHeight: number
) => {
  const vertices: Vector[] = [];
  const textures: Vector[] = [];
  const indices: number[] = [];

  // Calculate the size of the triangles based on the given number
  const triangleWidth = rct.width;
  const triangleHeight = rct.height / triangleNumberHeight;

  // Generate the list of points
  for (let i = 0; i <= triangleNumberHeight; i++) {
    for (let j = 0; j <= 1; j++) {
      const point: Vector = vec(
        rct.x + j * triangleWidth,
        rct.y + i * triangleHeight
      );
      textures.push(point);
      vertices.push(point);
    }
  }

  // Generate the list of triangle indices
  for (let i = 0; i < triangleNumberHeight; i++) {
    const topLeftIndex = i * 2;
    const topRightIndex = topLeftIndex + 1;
    const bottomLeftIndex = topLeftIndex + 2;
    const bottomRightIndex = bottomLeftIndex + 1;

    // Create two triangles for each square and add their indices to the list
    indices.push(topLeftIndex, topRightIndex, bottomLeftIndex);
    indices.push(bottomLeftIndex, topRightIndex, bottomRightIndex);
  }

  return { vertices, indices, textures };
};

interface StripeProps {
  index: number;
  clock: SkiaValue<number>;
  stripeWidth: number;
  numberOfStripes: number;
  height: number;
}

export const Stripe = ({
  index,
  clock,
  stripeWidth,
  numberOfStripes,
  height,
}: StripeProps) => {
  const x = index * stripeWidth;
  const rct = rect(x, 0, stripeWidth, height);
  const { vertices, indices, textures } = generateTrianglePointsAndIndices(
    rct,
    20
  );
  const animatedVertices = useComputedValue(() => {
    return vertices;
  }, [clock]);
  return (
    <>
      <Vertices
        vertices={animatedVertices}
        textures={textures}
        indices={indices}
      />
      <Skeleton vertices={vertices} indices={indices} />
    </>
  );
};
