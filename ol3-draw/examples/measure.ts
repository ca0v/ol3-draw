import ol = require("openlayers");
import { Button } from "../ol3-button";
import { MapMaker } from "./mapmaker";
import { Draw } from "../ol3-draw";
import { cssin } from "ol3-fun";

let wgs84Sphere = new ol.Sphere(6378137);

let measureTooltipElement: HTMLElement;
let measureTooltip: ol.Overlay;

function createMeasureTooltip(options: { map: ol.Map }) {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    options.map.addOverlay(measureTooltip);
}

/**
 * Format length output.
 * @param {ol.geom.LineString} line The line.
 * @return {string} The formatted length.
 */
function formatLength(args: { line: ol.geom.LineString; map: ol.Map }) {
    var length;
    {
        var coordinates = args.line.getCoordinates();
        length = 0;
        var sourceProj = args.map.getView().getProjection();
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
            length += wgs84Sphere.haversineDistance(c1, c2);
        }
    }
    var output;
    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';
    } else {
        output = (Math.round(length * 100) / 100) +
            ' ' + 'm';
    }
    return output;
};

export function run() {

    cssin("measure", `

.tooltip {
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    color: white;
    padding: 4px 8px;
    opacity: 0.7;
    white-space: nowrap;
}
.tooltip-measure {
    opacity: 1;
    font-weight: bold;
}
.tooltip-static {
    background-color: #ffcc33;
    color: black;
    border: 1px solid white;
}
.tooltip-measure:before,
.tooltip-static:before {
    border-top: 6px solid rgba(0, 0, 0, 0.5);
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    content: "";
    position: absolute;
    bottom: -6px;
    margin-left: -7px;
    left: 50%;
}
.tooltip-static:before {
    border-top-color: #ffcc33;
}

    `);

    let map = MapMaker.create({
        target: document.getElementsByClassName("map")[0],
        projection: "EPSG:3857",
        center: <[number, number]>[-9167000, 4148000],
        zoom: 21,
        basemap: "osm"
    });

    Draw.create({ map: map, geometryType: "LineString" })
        .on('drawstart',
        function (evt) {
            // set sketch
            var sketch = evt.feature;

            /** @type {ol.Coordinate|undefined} */
            var tooltipCoord = evt.coordinate;

            let listener = sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output;
                output = formatLength({ map: map, line: geom });
                tooltipCoord = geom.getLastCoordinate();
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        }, this);

    createMeasureTooltip({ map: map });
}
