import type { SkMatrix, SkiaValue, SkImage } from "@shopify/react-native-skia";
import { Group, Image, rect } from "@shopify/react-native-skia";
import React from "react";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
export const PictureDimensions = rect(0, 0, width, height);

interface PictureProps {
  image: SkImage;
  matrix: SkiaValue<SkMatrix>;
}

export const Picture = ({ image, matrix }: PictureProps) => {
  return (
    <Group matrix={matrix}>
      <Image
        x={0}
        y={0}
        width={width}
        height={height}
        image={image}
        fit="cover"
      />
    </Group>
  );
};
