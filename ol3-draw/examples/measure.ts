import ol = require("openlayers");
import { Button } from "../ol3-button";
import { MapMaker } from "./mapmaker";
import { Draw } from "../ol3-draw";
import { Modify } from "../ol3-edit";
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

    Measurement.create({
        map: map,
        draw: Draw.create({ map: map, geometryType: "MultiLineString" }),
        edit: Modify.create({ map: map, position: "top right-2" }),
        uom: "mi"
    });
}
