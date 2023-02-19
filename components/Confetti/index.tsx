import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import {
  Canvas,
  Group,
  RoundedRect,
  runTiming,
  Skia,
  useComputedValue,
  useValue,
  vec,
} from "@shopify/react-native-skia";
import { processTransform3d, toMatrix3 } from "react-native-redash";

const NUM_OF_CONFETTI = 50;

const { height, width } = Dimensions.get("window");

interface Offset {
  offsetId: number;
  startingXOffset: number;
  startingYOffset: number;
}

const relativeRotation = (yPosition: number, offset: number) => {
  const rand1 = Math.sin((yPosition - 500) * (Math.PI / 540));
  const rand2 = Math.cos((yPosition - 500) * (Math.PI / 540));
  return offset % 2 === 0 ? rand1 : rand2;
};

const ConfettiPiece = ({
  startingXOffset,
  startingYOffset,
  offsetId,
}: Offset) => {
  const WIDTH = 10;
  const HEIGHT = 30;
  const yPosition = useValue(startingYOffset);
  const centerY = useValue(0);
  const randomConstant = Math.random() * 4;

  runTiming(yPosition, height * 3, { duration: 4000 });

  const origin = useComputedValue(() => {
    centerY.current = yPosition.current + HEIGHT / 2;
    const centerX = startingXOffset + WIDTH / 2;
    return vec(centerX, centerY.current);
  }, [yPosition]);

  const matrix = useComputedValue(() => {
    const rotateZ =
      relativeRotation(yPosition.current, Math.round(offsetId)) *
      2.5 *
      randomConstant;
    const rotateX =
      relativeRotation(yPosition.current, Math.round(offsetId)) *
      1.5 *
      randomConstant;
    const rotateY =
      relativeRotation(yPosition.current, Math.round(offsetId)) *
      1.5 *
      randomConstant;
    const mat3 = toMatrix3(
      processTransform3d([{ rotateZ }, { rotateX }, { rotateY }])
    );
    return Skia.Matrix(mat3);
  }, [yPosition]);

  return (
    <Group {...{ origin, matrix }}>
      <RoundedRect
        r={8}
        x={startingXOffset}
        y={yPosition}
        height={HEIGHT}
        width={WIDTH}
        color="teal"
      />
    </Group>
  );
};

const Confetti = () => {
  const [confettiPieses, setConfettiPieses] = useState<Offset[]>([]);
  const startAnimation = () => {
    const pieces: Offset[] = [];
    for (let i = 0; i < NUM_OF_CONFETTI; i++) {
      const startingXOffset = Math.random() * width;
      const startingYOffset = Math.random() * (height * 3);
      const offsetId = i * Math.random();
      pieces.push({
        startingXOffset,
        startingYOffset,
        offsetId,
      });
    }
    setConfettiPieses(pieces);
  };
  return (
    <View style={styles.container}>
      <Canvas style={styles.container}>
        {confettiPieses.map((piece, index) => (
          <ConfettiPiece key={index} {...piece} />
        ))}
      </Canvas>
      <Pressable onPress={startAnimation} style={styles.button}>
        <Text style={styles.buttonText}>ANIMATE!</Text>
      </Pressable>
    </View>
  );
};

export default Confetti;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    height: 100,
    backgroundColor: "purple",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});
