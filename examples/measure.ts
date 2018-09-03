import { MapMaker } from "./mapmaker";
import { Draw, Modify, Measurement } from "../index";

export function run() {

    let map = MapMaker.create({
        target: document.getElementsByClassName("map")[0],
        projection: "EPSG:3857",
        center: <[number, number]>[-9167000, 4148000],
        zoom: 21,
        basemap: "osm"
    });

    Draw.create({ map: map, geometryType: "MultiPolygon", position: "top-2 right" });

    Measurement.create({
        map: map,
        draw: Draw.create({ map: map, geometryType: "MultiLineString" }),
        edit: Modify.create({ map: map, position: "top right-2" }),
        uom: "mi"
    });
}
