import ol = require("openlayers");
import { Button } from "./ol3-button";
import { Draw } from "./ol3-draw";
import { cssin, defaults } from "ol3-fun";

let wgs84Sphere = new ol.Sphere(6378137);

const MeterConvert = {
    "m": 1,
    "km": 1 / 1000,
    "ft": 3.28084,
    "mi": 0.000621371
}

export interface MeasurementOptions {
    map?: ol.Map;
    draw?: ol.Object;
    uom?: string;
    measureCurrentSegment?: boolean;
}

export class Measurement {
    static DEFAULT_OPTIONS: MeasurementOptions = {
        uom: "ft",
        measureCurrentSegment: true
    }

    private measureTooltipElement: HTMLElement;
    private measureTooltip: ol.Overlay;

    static create(options?: MeasurementOptions) {
        options = defaults({}, options || {}, Measurement.DEFAULT_OPTIONS);
        return new Measurement(options);
    }

    private constructor(public options: MeasurementOptions) {

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

        this.createMeasureTooltip();
    }

    private createMeasureTooltip() {
        let options = this.options;

        if (this.measureTooltipElement) {
            this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'tooltip tooltip-measure';
        this.measureTooltip = new ol.Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        options.map.addOverlay(this.measureTooltip);

        options.draw.on('drawstart', (evt: ol.interaction.DrawEvent) => {
            let listener = evt.feature.getGeometry().on('change', evt => {
                var geom = evt.target;
                let output = this.formatLength({ map: options.map, line: geom });
                this.measureTooltipElement.innerHTML = output;
                this.measureTooltip.setPosition(geom.getLastCoordinate());
            });
            options.draw.once('drawend', () => ol.Observable.unByKey(listener));
        });

    }

    /**
     * Format length output.
     * @param {ol.geom.LineString} line The line.
     * @return {string} The formatted length.
     */
    private formatLength(args: { line: ol.geom.LineString; map: ol.Map }) {
        let options = this.options;

        let sourceProj = args.map.getView().getProjection();
        let coordinates = args.line.getCoordinates()
            .map(c => ol.proj.transform(c, sourceProj, 'EPSG:4326'));

        let distances = coordinates.map((c, i) => wgs84Sphere.haversineDistance(i ? coordinates[i - 1] : c, c));
        let length = distances.reduce((a, b) => a + b, 0);

        let lengths = [length];
        
        if (options.measureCurrentSegment && distances.length > 2) {
            lengths.push(distances.pop());
        }

        return lengths.map(l => {
            let uom = l < 100 ? "m" : options.uom;
            return (MeterConvert[uom] * l).toPrecision(5) + " " + uom;
        }).join("<br/>");

    }

}