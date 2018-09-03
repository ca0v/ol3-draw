import ol = require("openlayers");
import { Button, NavHistory } from "../index";
import { MapMaker } from "./mapmaker";

export function run() {

    let map = MapMaker.create({
        target: document.getElementsByClassName("map")[0],
        projection: "EPSG:3857",
        center: <[number, number]>[-9167000, 4148000],
        zoom: 21,
        basemap: "osm"
    });

    NavHistory.create({
        map: map,
        delay: 500
    });

    Button.create({ map: map, label: "<<", eventName: "nav:back", title: "Back", position: "left-2 top" });
    Button.create({ map: map, label: ">>", eventName: "nav:forward", title: "Forward", position: "left-4 top" });

}
