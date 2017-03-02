import ol = require("openlayers");

import { StyleConverter } from "ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer";
import { cssin, mixin } from "ol3-fun/ol3-fun/common";
import { Button } from "../ol3-button";
import { Delete } from "../ol3-delete";
import { Draw } from "../ol3-draw";
import { Modify } from "../ol3-edit";
import { Translate } from "../ol3-translate";
import { MapMaker } from "../mapmaker";

let symbolizer = new StyleConverter();

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
    Draw.create({ map: map, geometryType: "Circle", label: "◯", position: "right-4 top" });
    Draw.create({ map: map, geometryType: "Point", label: "●", position: "right-6 top" });
    Translate.create({ map: map, label: "↔", position: "right-2 top" });
    Modify.create({ map: map, label: "Δ", position: "right top" });

    Button.create({ map: map, label: "?", position: "right-6 top-2", eventName: "info" });
    Delete.create({ map: map, label: "␡", position: "right-4 top-2" });
    Button.create({ map: map, label: "⎚", title: "Clear", position: "right-2 top-2", eventName: "clear-drawings" });
    Button.create({ map: map, label: "💾", position: "right top-2", eventName: "save" });

    {

        let selection = new ol.interaction.Select({
            multi: false,
            style: (feature: ol.Feature, res: number) => {

                let index = selection.getFeatures().getArray().indexOf(feature);

                switch (feature.getGeometry().getType()) {
                    case "Point":
                        return symbolizer.fromJson({
                            circle: {
                                radius: 20,
                                fill: {
                                    color: "blue"
                                },
                                stroke: {
                                    color: "red",
                                    width: 2
                                },
                                opacity: 1
                            },
                            text: {
                                text: index + 1 + "",
                                fill: {
                                    color: "white"
                                },
                                stroke: {
                                    color: "red",
                                    width: 2
                                },
                                scale: 3
                            }
                        });
                    case "MultiLineString":
                        return symbolizer.fromJson({
                            stroke: {
                                color: "red",
                                width: 2
                            },
                            text: {
                                text: index + 1 + "",
                                fill: {
                                    color: "white"
                                },
                                stroke: {
                                    color: "red",
                                    width: 2
                                },
                                scale: 3
                            }

                        });
                    case "Circle":
                    case "Polygon":
                    case "MultiPolygon":
                        return symbolizer.fromJson({
                            fill: {
                                color: "blue"
                            },
                            stroke: {
                                color: "red",
                                width: 2
                            },
                            text: {
                                text: index + 1 + "",
                                fill: {
                                    color: "white"
                                },
                                stroke: {
                                    color: "red",
                                    width: 2
                                },
                                scale: 3
                            }

                        });
                    default:
                        debugger;
                }
            }
        });

        selection.setActive(false);
        selection.on("change:active", () => selection.getFeatures().clear());
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

        map.on("delete-feature", (args: { control: Draw }) => {
            if (args.control.get("active")) {
                stopOtherControls(map, args.control);
                stopControl(map, Draw);
                stopControl(map, Modify);
                stopControl(map, Translate);
                selection.setActive(false);
            }
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

        map.on("clear-drawings", (args: { control: Button }) => {
            if (args.control.get("active")) {
                stopControl(map, Delete);
                stopControl(map, Draw);
                stopControl(map, Translate);
                selection.setActive(false);

                map.getControls()
                    .getArray()
                    .filter(i => i instanceof Draw)
                    .forEach(t => (<Draw>t).options.layers.forEach(l => l.getSource().clear()));

            }
        });

    }
}