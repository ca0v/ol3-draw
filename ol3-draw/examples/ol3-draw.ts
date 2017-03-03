import ol = require("openlayers");

import { cssin, mixin } from "ol3-fun/ol3-fun/common";
import { Button } from "../ol3-button";
import { Delete } from "../ol3-delete";
import { Draw } from "../ol3-draw";
import { Modify } from "../ol3-edit";
import { Translate } from "../ol3-translate";
import { Select } from "../ol3-select";
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
    let toolbar = [
        Select.create({ map: map, label: "?", eventName: "info" }),

        Draw.create({ map: map, geometryType: "Polygon", label: "▧", title: "Polygon" }),
        Draw.create({ map: map, geometryType: "MultiLineString", label: "▬", title: "Line" }),
        Draw.create({
            map: map, geometryType: "Circle", label: "◯", title: "Circle", style: [
                {
                    fill: {
                        color: "rgba(255,0,0,0.5)"
                    },
                    stroke: {
                        color: "rgba(255,255,255,1)",
                        width: 3
                    }
                }
            ]
        }),
        Draw.create({ map: map, geometryType: "Point", label: "●", title: "Point" }),

        Translate.create({ map: map, label: "↔" }),
        Modify.create({ map: map, label: "Δ" }),

        Delete.create({ map: map, label: "␡" }),
        Button.create({ map: map, label: "⎚", title: "Clear", eventName: "clear-drawings" }),

        Button.create({ map: map, label: "💾", eventName: "save", title: "Save" }),
        Button.create({ map: map, label: "X", eventName: "exit", title: "Exit" }),
    ];
    toolbar.forEach((t, i) => t.setPosition(`left top${-i * 2 || ''}`));

    {

        let h = cssin("ol3-draw", `.ol-zoom { top: 0.5em; right: 0.5em; left: auto;}`);
        map.on("exit", () => {
            toolbar.forEach(t => t.destroy());
            h();
        });

        map.on("info", (args: {
            control: Button
        }) => {
            if (args.control.get("active")) {
                stopOtherControls(map, args.control);
                stopControl(map, Draw);
                stopControl(map, Delete);
                stopControl(map, Translate);
                stopControl(map, Modify);
            }
        });

        map.on("delete-feature", (args: { control: Draw }) => {
            if (args.control.get("active")) {
                stopOtherControls(map, args.control);
                stopControl(map, Draw);
                stopControl(map, Modify);
                stopControl(map, Translate);
                stopControl(map, Select);
            }
        });

        map.on("draw-feature", (args: { control: Draw }) => {
            if (args.control.get("active")) {
                stopOtherControls(map, args.control);
                stopControl(map, Delete);
                stopControl(map, Modify);
                stopControl(map, Translate);
                stopControl(map, Select);
            }
        });

        map.on("translate-feature", (args: { control: Draw }) => {
            if (args.control.get("active")) {
                stopOtherControls(map, args.control);
                stopControl(map, Delete);
                stopControl(map, Draw);
                stopControl(map, Modify);
                stopControl(map, Select);
            }
        });

        map.on("modify-feature", (args: { control: Draw }) => {
            if (args.control.get("active")) {
                stopOtherControls(map, args.control);
                stopControl(map, Delete);
                stopControl(map, Draw);
                stopControl(map, Translate);
                stopControl(map, Select);
            }
        });

        map.on("clear-drawings", (args: { control: Button }) => {
            if (args.control.get("active")) {
                stopControl(map, Delete);
                stopControl(map, Draw);
                stopControl(map, Translate);
                stopControl(map, Select);

                map.getControls()
                    .getArray()
                    .filter(i => i instanceof Draw)
                    .forEach(t => (<Draw>t).options.layers.forEach(l => l.getSource().clear()));

            }
        });

    }
}