import { Button, NavHistory } from "../index";
import { MapMaker } from "./extras/mapmaker";

export function run() {
  let map = MapMaker.create({
    projection: "EPSG:3857",
    center: <[number, number]>[-9167000, 4148000],
    zoom: 21,
    basemap: "osm"
  });

  NavHistory.create({
    map: map,
    delay: 500
  });

  Button.create({ map: map, label: "<<", eventName: "nav:back", title: "Back", position: "right-2 top" });
  Button.create({ map: map, label: ">>", eventName: "nav:forward", title: "Forward", position: "right top" });
}
