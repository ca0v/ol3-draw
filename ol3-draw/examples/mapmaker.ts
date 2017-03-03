import ol = require("openlayers");
import { cssin, mixin } from "ol3-fun/ol3-fun/common";

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
        return map;
    }
}
