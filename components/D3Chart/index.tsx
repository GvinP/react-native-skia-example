import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import {
  Canvas,
  Circle,
  Easing,
  Group,
  Line,
  LinearGradient,
  Path,
  runTiming,
  Skia,
  SkPath,
  useComputedValue,
  useValue,
  vec,
  useTouchHandler,
} from "@shopify/react-native-skia";
import { animatedData, DataPoint, originalData } from "./Data";
import { curveBasis, line, scaleLinear } from "d3";
import { getYForX, parse } from "react-native-redash";

interface GraphData {
  min: number;
  max: number;
  curve: SkPath;
}

const GRAPH_HEIGHT = 400;
const GRAPH_WIDTH = 400;

const D3Chart = () => {
  const isTransitionComplete = useValue(1);
  const transitionState = useValue({
    currentChart: 0,
    nextChart: 1,
  });
  const x = useValue(0);
  const onTouch = useTouchHandler({
    onStart: () => {},
    onActive: (pt) => {
      x.current = pt.x;
    },
    onEnd: () => {},
  });

  const makeGraph = (data: DataPoint[]): GraphData => {
    const min = Math.min(...data.map((val) => val.value));
    const max = Math.max(...data.map((val) => val.value));
    const getYAxis = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 35]);
    const getXAxis = scaleLinear()
      .domain([new Date(2000, 1, 1), new Date(2000, 1, 15)])
      .range([10, GRAPH_WIDTH - 10]);
    const curveLine = line<DataPoint>()
      .x((d) => getXAxis(new Date(d.date)))
      .y((d) => getYAxis(d.value))
      .curve(curveBasis)(data);
    const skPath = Skia.Path.MakeFromSVGString(curveLine!);
    return { min, max, curve: skPath! };
  };
  const graphData = [makeGraph(originalData), makeGraph(animatedData)];
  const transitionCharts = (target: number) => {
    transitionState.current = {
      currentChart: target,
      nextChart: transitionState.current.currentChart,
    };
    isTransitionComplete.current = 0;
    runTiming(isTransitionComplete, 1, {
      duration: 500,
      easing: Easing.inOut(Easing.cubic),
    });
  };
  const currentPath = useComputedValue(() => {
    const start = graphData[transitionState.current.currentChart].curve;
    const end = graphData[transitionState.current.nextChart].curve;
    const result = start.interpolate(end, isTransitionComplete.current);
    return result?.toSVGString() ?? "";
  }, [transitionState, isTransitionComplete]);

  const y = useComputedValue(() => {
    return getYForX(parse(currentPath.current), x.current) || 0;
  }, [x, currentPath]);
  const transform = useComputedValue(
    () => [{ translateX: x.current }, { translateY: y.current }],
    [x, y]
  );

  return (
    <View style={styles.container}>
      <Canvas
        style={{
          height: GRAPH_HEIGHT,
          width: GRAPH_WIDTH,
        }}
        onTouch={onTouch}
      >
        <Group>
          <Line
            p1={vec(10, 130)}
            p2={vec(400, 130)}
            color="lightgrey"
            strokeWidth={1}
          />
          <Line
            p1={vec(10, 250)}
            p2={vec(400, 250)}
            color="lightgrey"
            strokeWidth={1}
          />
          <Line
            p1={vec(10, 370)}
            p2={vec(400, 370)}
            color="lightgrey"
            strokeWidth={1}
          />
          <Path path={currentPath} strokeWidth={4} style="stroke">
            <LinearGradient
              start={vec(0, 0)}
              end={vec(GRAPH_WIDTH, 0)}
              colors={["#ff00ff", "#00ff00"]}
            />
          </Path>
          <Circle cx={0} cy={0} r={9} color="#ffa200" transform={transform} />
        </Group>
      </Canvas>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => transitionCharts(0)}
          style={styles.buttonStyle}
        >
          <Text style={styles.textStyle}>Graph 1</Text>
        </Pressable>
        <Pressable
          onPress={() => transitionCharts(1)}
          style={styles.buttonStyle}
        >
          <Text style={styles.textStyle}>Graph 2</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default D3Chart;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 70,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  buttonStyle: {
    marginRight: 20,
    backgroundColor: "#6231ff",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  textStyle: {
    color: "white",
    fontSize: 20,
  },
});
