import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import BackgroundGradient from "./BackgroundGradient";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");
const HEIGHT = 256;
const WIDTH = width * 0.9;
const CARD_HEIGHT = HEIGHT - 5;
const CARD_WIDTH = WIDTH - 5;

const AnimatedCard: React.FC = () => {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const gesture = Gesture.Pan()
    .onBegin((event) => {
      rotateX.value = withTiming(
        interpolate(event.y, [0, CARD_HEIGHT], [10, -10], Extrapolate.CLAMP)
      );
      rotateY.value = withTiming(
        interpolate(event.x, [0, CARD_WIDTH], [-10, 10], Extrapolate.CLAMP)
      );
    })
    .onUpdate((event) => {
      rotateX.value = interpolate(
        event.y,
        [0, CARD_HEIGHT],
        [10, -10],
        Extrapolate.CLAMP
      );
      rotateY.value = interpolate(
        event.x,
        [0, CARD_WIDTH],
        [-10, 10],
        Extrapolate.CLAMP
      );
    })
    .onFinalize(() => {
      rotateX.value = withTiming(0);
      rotateY.value = withTiming(0);
    });

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 300 },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <BackgroundGradient width={WIDTH} height={HEIGHT} />
      <GestureDetector {...{ gesture }}>
        <Animated.View style={[styles.card, style]}>
          <View style={styles.placeholderContainer}>
            <View style={styles.circle} />
            <View style={styles.rightContainer}>
              <View style={styles.row} />
              <View style={styles.row} />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default AnimatedCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "black",
    position: "absolute",
    borderRadius: 20,
    zIndex: 300,
  },
  placeholderContainer: {
    position: "absolute",
    left: "10%",
    bottom: "10%",
    flexDirection: "row",
  },
  circle: {
    backgroundColor: "#272f46",
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
  },
  rightContainer: {
    marginLeft: 10,
    justifyContent: "space-between",
  },
  row: {
    backgroundColor: "#272f46",
    width: 80,
    height: 20,
    borderRadius: 10,
  },
});
