import ol = require("openlayers");
import { cssin, defaults } from "ol3-fun/index";

/**
 * #### Replacement of `ol/Sphere` constructor with `ol/sphere` functions
 * The `ol/Sphere` constructor has been removed.
 * If you were using the `getGeodesicArea` method, use the `getArea` function instead.
 * If you were using the `haversineDistance` method, use the `getDistance` function instead.
 */
let wgs84Sphere = (<any>ol).sphere as { getArea: Function; getDistance: Function };

const MeterConvert = {
  m: 1,
  km: 1 / 1000,
  ft: 3.28084,
  mi: 0.000621371
};

export interface MeasurementOptions {
  map?: ol.Map;
  draw?: ol.Object;
  edit?: ol.Object;
  uom: string;
  measureCurrentSegment: boolean;
}

export class Measurement {
  static DEFAULT_OPTIONS: Partial<MeasurementOptions> = {
    uom: "ft",
    measureCurrentSegment: true
  };

  private measureTooltipElement: HTMLElement;
  private measureTooltip: ol.Overlay;

  static create(opt?: Partial<MeasurementOptions>) {
    let options = defaults({}, opt || {}, Measurement.DEFAULT_OPTIONS) as MeasurementOptions;
    return new Measurement(options);
  }

  private constructor(public options: MeasurementOptions) {
    cssin(
      "measure",
      `

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

    `
    );

    this.measureTooltipElement = document.createElement("div");
    this.measureTooltipElement.className = "tooltip tooltip-measure";
    this.measureTooltip = new ol.Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: "bottom-center"
    });

    this.createMeasureTooltip();
  }

  private createMeasureTooltip() {
    let options = this.options;

    if (this.measureTooltipElement) {
      this.measureTooltipElement.remove();
    }

    if (!options.map) throw "map option required for measurement tooltip";
    if (!options.draw) throw "draw option required for measurement tooltip";
    if (!options.edit) throw "edit option required for measurement tooltip";

    let draw = options.draw;
    let map = options.map;
    let edit = options.edit;

    map.addOverlay(this.measureTooltip);

    draw.on("drawstart", (evt: any) => {
      let listener = evt.feature.getGeometry().on("change", (evt: { target: ol.geom.Geometry }) => {
        var geom = evt.target;
        let coordinates = this.flatten({ geom: geom });
        let output = this.formatLength({ map: map, coordinates: coordinates });
        this.measureTooltipElement.innerHTML = output;
        this.measureTooltip.setPosition(coordinates[coordinates.length - 1]);
      });
      draw.once("drawend", () => ol.Observable.unByKey(listener));
    });

    edit.on("modifystart", (evt: any) => {
      let feature = evt.features.getArray()[0];
      let geom = feature.getGeometry();
      let coordinates = this.flatten({ geom: geom });
      let originalDistances = this.computeDistances({ map: map, coordinates: coordinates });

      let listener = geom.on("change", () => {
        let coordinates = this.flatten({ geom: geom });
        let distances = this.computeDistances({ map: map, coordinates: coordinates });
        distances.some((d, i) => {
          if (d === originalDistances[i]) return false;
          this.measureTooltipElement.innerHTML = this.formatLengths([d, distances.reduce((a, b) => a + b, 0)]);
          this.measureTooltip.setPosition(coordinates[i]);
          return true;
        });
      });
      edit.once("modifyend", () => ol.Observable.unByKey(listener));
    });
  }

  // move to ol3-fun
  private flatten(args: { geom: ol.geom.Geometry }) {
    let coordinates: ol.Coordinate[];

    if (args.geom instanceof ol.geom.LineString) {
      coordinates = args.geom.getCoordinates();
    } else if (args.geom instanceof ol.geom.MultiLineString) {
      coordinates = args.geom.getLineString(0).getCoordinates();
    } else if (args.geom instanceof ol.geom.Polygon) {
      coordinates = args.geom.getLinearRing(0).getCoordinates();
    } else if (args.geom instanceof ol.geom.MultiPolygon) {
      coordinates = args.geom
        .getPolygon(0)
        .getLinearRing(0)
        .getCoordinates();
    } else throw "unable to get coordinates from the geometry";
    return coordinates;
  }

  private computeDistances(args: { coordinates: ol.Coordinate[]; map: ol.Map }) {
    let sourceProj = args.map.getView().getProjection();
    let coordinates = args.coordinates.map(c => ol.proj.transform(c, sourceProj, "EPSG:4326"));
    return coordinates.map((c, i) => wgs84Sphere.getDistance(i ? coordinates[i - 1] : c, c));
  }

  /**
   * Format length output.
   * @param {ol.geom.LineString} line The line.
   * @return {string} The formatted length.
   */
  private formatLength(args: { coordinates: ol.Coordinate[]; map: ol.Map }) {
    let options = this.options;
    let distances = this.computeDistances(args);

    let length = distances.reduce((a, b) => a + b, 0);

    let lengths = [length];

    if (options.measureCurrentSegment && distances.length > 2) {
      lengths.push(distances.pop());
    }

    return this.formatLengths(lengths);
  }

  private formatLengths(lengths: number[]) {
    let options = this.options;
    return lengths
      .map(l => {
        let uom = (l < 100 ? "m" : options.uom) as keyof typeof MeterConvert;
        return (MeterConvert[uom] * l).toPrecision(5) + " " + uom;
      })
      .join("<br/>");
  }
}
