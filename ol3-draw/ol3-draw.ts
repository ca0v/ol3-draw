import ol = require("openlayers");
import { Button, ButtonOptions } from "./ol3-button";
import { html, mixin } from "ol3-fun/index";
import { Format } from "ol3-symbolizer/index";

export type GeometryTypes =
  | "Point"
  | "LineString"
  | "LinearRing"
  | "Polygon"
  | "MultiPoint"
  | "MultiLineString"
  | "MultiPolygon"
  | "GeometryCollection"
  | "Circle";

export interface DrawControlOptions extends ButtonOptions {
  map?: ol.Map;
  layers?: Array<ol.layer.Vector>;
  style: Format.Style[];
  geometryType?: GeometryTypes;
  geometryName?: string;
}

export class Draw extends Button {
  static DEFAULT_OPTIONS: Partial<DrawControlOptions> = {
    className: "ol-draw",
    geometryType: "Point",
    geometryName: "geom",
    label: "Draw",
    title: "Draw",
    position: "top left",
    buttonType: Draw,
    eventName: "draw-feature",
    style: [
      {
        circle: {
          radius: 12,
          opacity: 1,
          fill: {
            color: "rgba(0,0,0,0.5)"
          },
          stroke: {
            color: "rgba(255,255,255,1)",
            width: 3
          }
        }
      },
      {
        fill: {
          color: "rgba(0,0,0,0.5)"
        },
        stroke: {
          color: "rgba(255,255,255,1)",
          width: 5
        }
      },
      {
        stroke: {
          color: "rgba(0,0,0,1)",
          width: 1
        }
      }
    ]
  };

  public options: DrawControlOptions;

  static create(opt?: Partial<DrawControlOptions>) {
    let options = mixin(mixin({}, Draw.DEFAULT_OPTIONS), opt || {});
    return Button.create(options);
  }

  private interactions: { [name: string]: ol.interaction.Draw };

  private createInteraction() {
    let options = this.options;
    if (!options.geometryType) throw "geometryType is a required option";
    if (!options.layers || !options.layers.length) throw "layers is a required option";
    let source = options.layers[0].getSource();
    let style = options.style.map(s => this.symbolizer.fromJson(s));

    let draw = new ol.interaction.Draw({
      type: options.geometryType,
      geometryName: options.geometryName,
      source: source,
      style: style
    });

    draw.setActive(false);

    ["drawstart", "drawend"].forEach(eventName => {
      draw.on(eventName, args => this.dispatchEvent(args));
    });

    draw.on("change:active", () => this.options.element.classList.toggle("active", draw.getActive()));

    options.map && options.map.addInteraction(draw);
    return draw;
  }

  constructor(options: DrawControlOptions) {
    super(options);
    this.options = options;

    this.interactions = {};
    this.handlers.push(() =>
      Object.keys(this.interactions).forEach(k => {
        let interaction = this.interactions[k];
        interaction.setActive(false);
        options.map && options.map.removeInteraction(interaction);
      })
    );

    this.on("change:active", () => {
      let active = this.get("active");
      if (!options.geometryType) throw "geometryType is a required option";
      let interaction = this.interactions[options.geometryType];

      if (active) {
        if (!interaction) {
          interaction = this.interactions[options.geometryType] = this.createInteraction();
        }
        interaction.setActive(true);
      } else {
        interaction && interaction.setActive(false);
      }
    });

    let style = this.options.style.map(s => this.symbolizer.fromJson(s));

    if (options.map && !options.layers) {
      let layer = new ol.layer.Vector({
        style: style,
        source: new ol.source.Vector()
      });
      options.map.addLayer(layer);
      options.layers = [layer];
    }
  }
}
