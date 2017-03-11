import ol = require("openlayers");
import { Button } from "../ol3-button";
import { MapMaker } from "./mapmaker";
import { Draw } from "../ol3-draw";
import { Measurement } from "../measure-extension";
import { cssin, defaults } from "ol3-fun";


export function run() {

    let map = MapMaker.create({
        target: document.getElementsByClassName("map")[0],
        projection: "EPSG:3857",
        center: <[number, number]>[-9167000, 4148000],
        zoom: 21,
        basemap: "osm"
    });

    let draw = Draw.create({ map: map, geometryType: "LineString" });

    Measurement.create({
        map: map,
        draw: draw,
        uom: "mi"
    });
}
