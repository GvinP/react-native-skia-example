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
  interpolateColors,
  Text as SkText,
  useFont,
  interpolate,
} from "@shopify/react-native-skia";
import { animatedData, DataPoint, originalData } from "./Data";
import { curveBasis, line, scaleLinear, area } from "d3";
import { getYForX, parse } from "react-native-redash";

interface GraphData {
  min: number;
  max: number;
  curve: SkPath;
}
const GRAPH_HEIGHT = 400;
const GRAPH_WIDTH = 400;

const format = (value: number) => Math.round(value).toString();

const LinearChart = () => {
  const font = useFont(require("../../assets/Roboto-Medium.ttf"), 40);
  const isTransitionComplete = useValue(1);
  const transitionState = useValue({
    currentChart: 0,
    nextChart: 1,
  });
  const x = useValue(0);
  const onTouch = useTouchHandler({
    onActive: (pt) => {
      x.current = pt.x;
    },
    onEnd: () => {
      x.current = 0;
    },
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
  const makeArea = (data: DataPoint[]): GraphData => {
    const min = Math.min(...data.map((val) => val.value));
    const max = Math.max(...data.map((val) => val.value));
    const getYAxis = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 35]);
    const getXAxis = scaleLinear()
      .domain([new Date(2000, 1, 1), new Date(2000, 1, 15)])
      .range([10, GRAPH_WIDTH - 10]);
    const curveArea = area<DataPoint>()
      .x((d) => getXAxis(new Date(d.date)))
      .y0(GRAPH_HEIGHT)
      .y1((d) => getYAxis(d.value))
      .curve(curveBasis)(data);
    const skPath = Skia.Path.MakeFromSVGString(curveArea!);
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
  const color = useComputedValue(
    () =>
      interpolateColors(x.current, [0, GRAPH_WIDTH], ["#ff00ff", "#00ff00"]),
    [x]
  );
  const text = useComputedValue(
    () =>
      format(
        interpolate(
          y.current,
          [0, GRAPH_HEIGHT],
          [
            graphData[transitionState.current.currentChart].max,
            graphData[transitionState.current.currentChart].min,
          ]
        )
      ),
    [y, transitionState]
  );
  if (!font) return null;
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
          <SkText font={font} text={text} x={GRAPH_WIDTH / 2 - 50} y={50} />
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
          <Path path={makeArea(originalData).curve}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(GRAPH_WIDTH, 0)}
              colors={["#ff00ff40", "#00ff0040"]}
            />
          </Path>
          <Circle cx={0} cy={0} r={9} color={color} transform={transform} />
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

export default LinearChart;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 70,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 30,
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
