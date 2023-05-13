import { StyleSheet } from "react-native";
import React from "react";
import { Canvas, rect } from "@shopify/react-native-skia";
import { Sky } from "./Sky";
import { Limmat } from "./Limmat";
import { Silo } from "./Silo";
import { Tree } from "./Tree";

const Painting = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Sky />
      <Silo />
      <Limmat />
      <Tree rct={rect(125, 430, 120, 150)} />
      <Tree rct={rect(50, 420, 120, 150)} />
      <Tree rct={rect(-50, 410, 120, 170)} />
    </Canvas>
  );
};

export default Painting;

const styles = StyleSheet.create({});
