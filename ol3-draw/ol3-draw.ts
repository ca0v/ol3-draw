import ol = require("openlayers");
import { Button, ButtonOptions as ButtonOptions } from "./ol3-button";
import { html, mixin } from "ol3-fun/ol3-fun/common";
import { Format } from "ol3-symbolizer";

export interface DrawControlOptions extends ButtonOptions {
  map?: ol.Map;
  layers?: Array<ol.layer.Vector>;
  style?: Format.Style[];
  geometryType?: "Point" | "LineString" | "LinearRing" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon" | "GeometryCollection" | "Circle";
  geometryName?: string;
}

export class Draw extends Button {

  static DEFAULT_OPTIONS: DrawControlOptions = {
    className: "ol-draw",
    geometryType: "Point",
    geometryName: "geom",
    label: "Draw",
    title: "Draw",
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
  }

  public options: DrawControlOptions;

  static create(options?: DrawControlOptions) {
    options = mixin(mixin({}, Draw.DEFAULT_OPTIONS), options);
    return Button.create(options);
  }

  private interactions: { [name: string]: ol.interaction.Draw };

  private createInteraction() {
    let options = this.options;
    let source = options.layers[0].getSource();
    let style = options.style.map(s => this.symbolizer.fromJson(s));

    let draw = new ol.interaction.Draw({
      type: options.geometryType,
      geometryName: options.geometryName,
      source: source,
      style: style
    });

    draw.setActive(false);

    ["drawstart"].forEach(eventName => {
      draw.on(eventName, args => this.dispatchEvent(args));
    });

    draw.on("change:active", () =>
      this.options.element.classList.toggle("active", draw.getActive()));

    options.map.addInteraction(draw);
    return draw;
  }

  constructor(options: DrawControlOptions) {
    super(options);

    this.interactions = {};
    this.handlers.push(() => Object.keys(this.interactions).forEach(k => {
      let interaction = this.interactions[k];
      interaction.setActive(false);
      options.map.removeInteraction(interaction);
    }))

    this.on("change:active", () => {
      let active = this.get("active");
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

    if (!options.layers) {
      let layer = new ol.layer.Vector({
        style: style,
        source: new ol.source.Vector()
      });
      options.map.addLayer(layer);
      options.layers = [layer];
    }
  }

}
