import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import React from "react";
import {
  Canvas,
  Group,
  Image,
  RoundedRect,
  rect,
  rrect,
  useClockValue,
  useComputedValue,
  useImage,
  useValue,
} from "@shopify/react-native-skia";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

const dummayArray = new Array(30).fill(0).map((_, index) => index + 1);
const IMAGE_SIZE = 128;
const DYNAMIC_ISLAND_WIDTH = 110;
const DYNAMIC_ISLAND_HEIGHT = 30;
const imgUrl =
  "https://plus.unsplash.com/premium_photo-1684746338578-4a8f89c62a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2680&q=80";

const ImageTransition = () => {
  const img = useImage(imgUrl);
  const { width } = useWindowDimensions();
  const x = useSharedValue((width - IMAGE_SIZE) / 2);
  const d = useSharedValue(IMAGE_SIZE);
  const xDynamicIsland = useSharedValue((width - DYNAMIC_ISLAND_WIDTH) / 2);
  const maxY = 70;
  const y = useSharedValue(maxY);
  const scroolY = useSharedValue(0);
  const clock = useClockValue();

  const roundedRect = useComputedValue(
    () =>
      rrect(
        rect(x.value, y.value, d.value, d.value),
        IMAGE_SIZE / 2,
        IMAGE_SIZE / 2
      ),
    [clock]
  );

  useDerivedValue(() => {
    d.value = interpolate(scroolY.value, [0, maxY], [IMAGE_SIZE, 0]);
    x.value = (width - d.value) / 2;
    y.value = interpolate(scroolY.value, [0, maxY], [maxY, 0]);
  });

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: "red",
    height: interpolate(scroolY.value, [0, maxY], [230, 0]),
    transform: [
      { translateY: interpolate(scroolY.value, [0, maxY], [0, maxY]) },
    ],
  }));

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scroolY.value = event.nativeEvent.contentOffset.y;
  };

  return (
    <View style={styles.container}>
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} bounces={false}>
        <Animated.View style={animatedStyle}>
          <Canvas style={styles.canvasContainer}>
            <Group clip={roundedRect}>
              {img && (
                <Image
                  image={img}
                  width={d.value}
                  height={d.value}
                  x={x.value}
                  y={y.value}
                  fit={"cover"}
                />
              )}
            </Group>
            <RoundedRect
              r={30}
              width={DYNAMIC_ISLAND_WIDTH}
              height={DYNAMIC_ISLAND_HEIGHT}
              x={xDynamicIsland.value}
              y={15}
            />
          </Canvas>
        </Animated.View>
        {dummayArray.map((item) =>
          item % 2 === 0 ? (
            <View style={styles.bigCard} key={item} />
          ) : (
            <View style={styles.smallCard} key={item} />
          )
        )}
      </ScrollView>
    </View>
  );
};

export default ImageTransition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DBDFEA",
  },
  headerContainer: {
    height: 230,
  },
  canvasContainer: {
    flex: 1,
  },
  imgContainer: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  bigCard: {
    backgroundColor: "#ACB1D6",
    height: 100,
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  smallCard: {
    backgroundColor: "#8294C4",
    height: 50,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 80,
  },
});
