import ol = require("openlayers");
import { olx } from "openlayers";

import { cssin, mixin } from "ol3-fun/ol3-fun/common";
import { Button, Draw } from "../index";

export class MapMaker {
    static DEFAULT_OPTIONS: olx.MapOptions = {
    }
    static create(options: {
        target: Element;
        center: [number, number];
        projection: string;
        zoom: number;
        basemap: string;
    }) {
        options = mixin(mixin({}, MapMaker.DEFAULT_OPTIONS), options);

        options.target.classList.add("ol-map");
        cssin("mapmaker", `
        .ol-map {
            top: 0;
            left: 0;
            right: 0;
            bottom:0;
            position: absolute;
        }
        `);

        let osm = new ol.layer.Tile({
            opacity: 0.8,
            source: new ol.source.OSM()
        });

        let view = new ol.View({
            projection: options.projection,
            center: options.center,
            zoom: options.zoom
        });

        let map = new ol.Map({
            target: options.target,
            keyboardEventTarget: document,
            loadTilesWhileAnimating: true,
            loadTilesWhileInteracting: true,
            controls: ol.control.defaults({ attribution: false }).extend([new ol.control.ScaleLine(), new ol.control.OverviewMap({
                layers: [osm], view: new ol.View({
                    projection: options.projection
                })
            })]),
            view: view,
            layers: [osm]
        });
        return map as ol.Map & MapEventExtensions;
    }
}

interface MapEventExtensions {
    on(type: "delete-feature", listener: (args: { control: Draw }) => any);
    on(type: "draw-feature", listener: (args: { control: Draw }) => any);
    on(type: "translate-feature", listener: (args: { control: Draw }) => any);
    on(type: "modify-feature", listener: (args: { control: Draw }) => any);
    on(type: "clear-drawings", listener: (args: { control: Button }) => any);
}