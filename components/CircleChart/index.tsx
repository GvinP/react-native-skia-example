import React, { useEffect } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import { Canvas, Paint, Path, Shadow } from "@shopify/react-native-skia";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  COLOR_17,
  COLOR_2,
  COLOR_33,
  COLOR_34,
  COLOR_35,
  COLOR_4,
  COLOR_5,
  COLOR_9,
  COLOR_BLACK,
  COLOR_WHITE,
} from "./styles/colors";

const subjectAreas = [
  { title: "1", average: 5.0 },
  { title: "2", average: 4.5 },
  { title: "3", average: 4.2 },
  { title: "4", average: 4.0 },
  { title: "5", average: 3.6 },
  { title: "6", average: 3.5 },
  { title: "7", average: 3.3 },
];

const RAD_DEG = Math.PI / 180.0;
const PI2 = 2 * Math.PI;

const pointOnArc = (center: number[], R: number, angle: number) => {
  let radians = (angle - 90) * RAD_DEG;
  return [center[0] + R * Math.cos(radians), center[1] + R * Math.sin(radians)];
};

const arc = (
    center: number[],
    radius: number,
    start: number,
    end: number,
    w: number,
    corner: number
  ) => {
    let points;
  
    let innerR = radius - w;
    let circumference = Math.abs(end - start);
    corner = Math.min(w / 2, corner);
  
    if (360 * (corner / (Math.PI * (radius - w))) > Math.abs(start - end)) {
      corner = (circumference / 360) * innerR * Math.PI;
    }
  
    // inner and outer radiuses
    let innerR2 = innerR + corner;
    let outerRadius = radius - corner;
  
    // butts corner points
    let oStart = pointOnArc(center, outerRadius, start);
    let oEnd = pointOnArc(center, outerRadius, end);
  
    let iStart = pointOnArc(center, innerR2, start);
    let iEnd = pointOnArc(center, innerR2, end);
  
    let iSection = 360 * (corner / (PI2 * innerR));
    let oSection = 360 * (corner / (PI2 * radius));
  
    // arcs endpoints
    let iArcStart = pointOnArc(center, innerR, start + iSection);
    let iArcEnd = pointOnArc(center, innerR, end - iSection);
  
    let oArcStart = pointOnArc(center, radius, start + oSection);
    let oArcEnd = pointOnArc(center, radius, end - oSection);
  
    let arcSweep1 = circumference > 180 + 2 * oSection ? 1 : 0;
    let arcSweep2 = circumference > 180 + 2 * iSection ? 1 : 0;
  
    points = [
      // begin path
      "M", oStart[0], oStart[1],
      // outer start corner
      "A", corner, corner, 0, 0, 1, oArcStart[0], oArcStart[1],
      // outer main arc
      "A", radius, radius, 0, arcSweep1, 1, oArcEnd[0], oArcEnd[1],
      // outer end corner
      "A", corner, corner, 0, 0, 1, oEnd[0], oEnd[1],
      // end line
      "L", iEnd[0], iEnd[1],
      // inner end corner
      "A", corner, corner, 0, 0, 1, iArcEnd[0], iArcEnd[1],
      // inner arc
      "A", innerR, innerR, 0, arcSweep2, 0, iArcStart[0], iArcStart[1],
      // inner start corner
      "A", corner, corner, 0, 0, 1, iStart[0], iStart[1],
      "Z", // end path
    ];
    return points.join(" ");
  };


export const areas: {
  [key: string]: { color: string };
} = {
  "1": { color: COLOR_33 },
  "2": { color: COLOR_4 },
  "3": { color: COLOR_5 },
  "4": { color: COLOR_2 },
  "5": { color: COLOR_34 },
  "6": { color: COLOR_9 },
  "7": { color: COLOR_35 },
  "8": { color: COLOR_17 },
};
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height / 2.5;
const step = 5;
const radius = width / 4;
const itemWidth = width / 7;

const CircleChart = () => {
  const progress = useSharedValue(0);
  const total = subjectAreas.reduce((sum, el) => (sum += el.average), 0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1500 });
  }, []);

  return (
    <View style={{ width, height }}>
      {subjectAreas?.reverse().map((area, index) => {
        const rotateAngle = subjectAreas
          .slice(0, index)
          .reduce((sum, el) => (sum += (360 / total) * el.average), 0);
        const start = 360 - (360 / total) * area.average;
        const end = 360;
        const style = useAnimatedStyle(() => ({
          transform: [{ rotate: `-${progress.value * rotateAngle}deg` }],
        }));
        return (
          <React.Fragment key={index}>
            <Animated.View style={[StyleSheet.absoluteFill, style]}>
              <Canvas style={{ flex: 1 }}>
                <Path
                  path={arc(
                    [width / 2, height / 2],
                    radius + step * (index - 1),
                    start,
                    end + (index === 0 ? -1 : step),
                    itemWidth + step * index,
                    4
                  )}
                  color={areas[area.title].color}
                  strokeWidth={4}
                  style={index > subjectAreas.length - 5 ? "fill" : "stroke"}
                >
                  {index < subjectAreas.length - 4 && <Paint color={COLOR_WHITE} />}
                  <Shadow dx={0} dy={0} blur={0.5} color={COLOR_BLACK} />
                </Path>
              </Canvas>
            </Animated.View>
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default CircleChart;
