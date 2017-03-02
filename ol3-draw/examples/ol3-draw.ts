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
        .filter(i => i.get("active"))
        .filter(i => i instanceof type)
        .forEach(t => t.set("active", false));
}

function stopOtherControls(map: ol.Map, control: ol.control.Control) {
    map.getControls()
        .getArray()
        .filter(i => i.get("active"))
        .filter(i => typeof i === typeof control)
        .forEach(t => t !== control && t.set("active", false));
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
    Draw.create({ map: map, geometryType: "Polygon", label: "▧", position: "right-10 top" });
    Draw.create({ map: map, geometryType: "MultiLineString", label: "▬", position: "right-8 top" });
    Draw.create({ map: map, geometryType: "Point", label: "●", position: "right-6 top" });
    Draw.create({ map: map, geometryType: "Circle", label: "◯", position: "right-4 top" });
    Translate.create({ map: map, label: "↔", position: "right-2 top" });
    Modify.create({ map: map, label: "Δ", position: "right top" });

    Button.create({ map: map, label: "?", position: "right-6 top-2", eventName: "info" });
    Delete.create({ map: map, label: "␡", position: "right-4 top-2" });
    Button.create({ map: map, label: "⎚", title: "Clear", position: "right-2 top-2", eventName: "clear-drawings" });
    Button.create({ map: map, label: "💾", position: "right top-2", eventName: "save" });

    {
        let selection = new ol.interaction.Select({
            multi: false
        });

        selection.setActive(false);
        map.addInteraction(selection);

        map.on("info", (args: {
            control: Button
        }) => {
            if (args.control.get("active")) {
                stopControl(map, Draw);
                stopControl(map, Delete);
                stopControl(map, Translate);
                stopControl(map, Modify);
            }
            selection.setActive(args.control.get("active"));
        });

        map.on("draw-feature", (args: { control: Draw }) => {
            if (args.control.get("active")) {
                stopOtherControls(map, args.control);
                stopControl(map, Delete);
                stopControl(map, Modify);
                stopControl(map, Translate);
                selection.setActive(false);
            }
        });

        map.on("translate-feature", (args: { control: Draw }) => {
            if (args.control.get("active")) {
                stopOtherControls(map, args.control);
                stopControl(map, Delete);
                stopControl(map, Draw);
                stopControl(map, Modify);
                selection.setActive(false);
            }
        });

        map.on("modify-feature", (args: { control: Draw }) => {
            if (args.control.get("active")) {
                stopOtherControls(map, args.control);
                stopControl(map, Delete);
                stopControl(map, Draw);
                stopControl(map, Translate);
                selection.setActive(false);
            }
        });
        
    }

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