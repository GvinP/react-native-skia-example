import {
  StyleSheet,
  Text as RNText,
  View,
  Pressable,
  Dimensions,
} from "react-native";
import React from "react";
import {
  Canvas,
  Easing,
  Path,
  runTiming,
  Skia,
  Text,
  useFont,
  useValue,
} from "@shopify/react-native-skia";

const { width, height } = Dimensions.get("window");
const radius = 100;
const strokeWidth = 11;
const targetPercentage = 0.85;

const DonutChart = () => {
  const innerRadius = radius - strokeWidth / 2;
  const targetText = `${targetPercentage * 100}%`;
  const progress = useValue(0);
  const font = useFont(require("../../assets/Roboto-Medium.ttf"), 60);
  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const animateChart = () => {
    progress.current = 0;
    runTiming(progress, targetPercentage, {
      duration: 1500,
      easing: Easing.inOut(Easing.cubic),
    });
  };

  if (font === null) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <Canvas style={{ flex: 1 }}>
          <Path
            path={path}
            color="orange"
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="round"
            start={0}
            end={progress}
          />
          <Text
            x={innerRadius - 50}
            y={innerRadius + 30}
            text={targetText}
            font={font}
            opacity={progress}
            color="orange"
          />
        </Canvas>
      </View>
      <Pressable style={styles.button} onPress={animateChart}>
        <RNText style={styles.buttonText}>Start</RNText>
      </Pressable>
    </View>
  );
};

export default DonutChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chart: {
    width: radius * 2,
    height: radius * 2,
  },
  button: {
    width: width / 2,
    paddingVertical: 20,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
});
