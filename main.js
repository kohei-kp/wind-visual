import * as d3 from "d3";
import { run } from "./app.js";
import "./style.css";

const w = window.innerWidth;
const h = window.innerHeight;

const canvas = d3
  .select("#app")
  .append("canvas")
  .attr("width", w)
  .attr("height", h);

const projection = d3
  .geoOrthographic()
  .scale(w)
  .translate([w / 2, h / 2])
  .rotate([225, -38]);
const path = d3.geoPath().projection(projection);

d3.json("map_geo.json").then((json) => {
  const svg = d3
    .select("#app")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg
    .append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "midnightblue");

  const graticule = d3.geoGraticule().step([5, 5]);
  svg
    .append("path")
    .datum(graticule)
    .attr("stroke", "gray")
    .attr("fill", "none")
    .attr("stroke-width", 0.5)
    .attr("d", path);

  svg
    .selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke", "lightgray")
    .style("stroke-width", 0.25)
    .style("fill", "cadetblue");
});

// 風
const buffer = await fetch("./wind.ieee").then((res) => res.arrayBuffer());
const wind = new Float32Array(buffer);
const dataview = new DataView(buffer);
for (let i = 0; i < wind.length; i++) {
  wind[i] = dataview.getFloat32(i * 4);
}

run(canvas, wind, projection);
