import {
  Canvas,
  Skia,
  useFont,
  useImage,
  useValue,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, View } from "react-native";
import { GestureHandler } from "./GestureHandler";

import { HelloSticker, HelloStickerDimensions } from "./HelloSticker";
import { LocationSticker, LocationStickerDimensions } from "./LocationSticker";
import { Picture, PictureDimensions } from "./Picture";

const { width, height } = Dimensions.get("window");

const zurich = require("./assets/zurich.jpg");
const aveny = require("./assets/aveny.ttf");

export const Stickers = () => {
  const image = useImage(zurich);
  const font = useFont(aveny, 56);
  const picture = useValue(Skia.Matrix());
  const hello = useValue(Skia.Matrix());
  const location = useValue(Skia.Matrix());
  if (!image || !font) {
    return null;
  }
  return (
    <View>
      <Canvas style={{ width, height }}>
        <Picture image={image} matrix={picture} />
        <HelloSticker matrix={hello} />
        <LocationSticker matrix={location} font={font} />
      </Canvas>
      <GestureHandler matrix={picture} dimensions={PictureDimensions} />
      <GestureHandler matrix={hello} dimensions={HelloStickerDimensions} />
      <GestureHandler
        matrix={location}
        dimensions={LocationStickerDimensions}
      />
    </View>
  );
};
