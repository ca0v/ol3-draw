import ol = require("openlayers");

import { StyleConverter } from "ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer";
import { cssin, mixin } from "ol3-fun/ol3-fun/common";
import { Button } from "../ol3-button";
import { Delete } from "../ol3-delete";
import { Draw } from "../ol3-draw";
import { Modify } from "../ol3-edit";
import { Translate } from "../ol3-translate";
import { MapMaker } from "../mapmaker";

function stopInteraction(map: ol.Map, type: any) {
    map.getInteractions()
        .getArray()
        .filter(i => i instanceof type)
        .forEach(t => t.setActive(false));
}

function stopControl(map: ol.Map, type: any) {
    map.getControls()
        .getArray()
        .filter(i => i instanceof type)
        .forEach(t => t.set("active", false));
}

export function run() {

    let map = MapMaker.create({
        target: document.getElementsByClassName("map")[0],
        projection: 'EPSG:4326',
        center: <[number, number]>[-82.4, 34.85],
        zoom: 15,
        basemap: "osm"
    });

    //▲ ▬ ◇ ● ◯ ▧ ★
    map.addControl(Draw.create({ geometryType: "Polygon", label: "▧", className: "ol-draw right-6 top" }));
    map.addControl(Draw.create({ geometryType: "MultiLineString", label: "▬", className: "ol-draw right-4 top" }));
    map.addControl(Draw.create({ geometryType: "Point", label: "●", className: "ol-edit right-2 top" }));
    map.addControl(Draw.create({ geometryType: "Circle", label: "◯", className: "ol-edit right top" }));

    map.addControl(Delete.create({ label: "␡", position: "right-2 top-2"}));
    map.addControl(Button.create({ label: "⎚", title: "Clear", position: "right top-2", eventName: "clear-drawings" }));

    map.addControl(Translate.create({ label: "↔", position: "right-4 top-4" }));
    map.addControl(Modify.create({ label: "Δ", position: "right-2 top-4" }));
    map.addControl(Button.create({ label: "💾", position: "right top-4" }));

    map.on("clear-drawings", () => {
        map.getControls()
            .getArray()
            .filter(i => i instanceof Draw)
            .forEach(t => (<Draw>t).options.layers.forEach(l => l.getSource().clear()));
        stopControl(map, Button);
        stopInteraction(map, ol.interaction.Draw);
        stopInteraction(map, ol.interaction.Modify);
        stopInteraction(map, ol.interaction.Select);
    });

}