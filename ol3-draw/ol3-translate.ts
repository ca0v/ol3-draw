import ol = require("openlayers");
import { Button, ButtonOptions as IButtonOptions } from "./ol3-button";
import { defaults } from "ol3-fun/index";
import { Format } from "ol3-symbolizer/index";

export interface TranslateControlOptions extends IButtonOptions {
  style: { [name: string]: Format.Style[] };
  map: ol.Map; // required
}

export class Translate extends Button {
  static DEFAULT_OPTIONS: Partial<TranslateControlOptions> = {
    className: "ol-translate",
    position: "top right",
    label: "XY",
    title: "Translate",
    eventName: "translate-feature",
    style: {
      Point: [
        {
          circle: {
            radius: 2,
            fill: {
              color: "rgba(255, 0, 0, 1)"
            },
            stroke: {
              color: "rgba(255, 0, 0, 1)",
              width: 1
            },
            opacity: 1
          }
        }
      ],
      MultiLineString: [
        {
          stroke: {
            color: "rgba(0, 0, 0, 0.5)",
            width: 3
          }
        }
      ],
      Circle: [
        {
          fill: {
            color: "blue"
          },
          stroke: {
            color: "red",
            width: 2
          }
        }
      ],
      Polygon: [
        {
          fill: {
            color: "rgba(0, 0, 0, 0.1)"
          },
          stroke: {
            color: "rgba(0, 0, 0, 1)",
            width: 1
          }
        }
      ],
      MultiPolygon: [
        {
          fill: {
            color: "rgba(0, 0, 0, 0.1)"
          },
          stroke: {
            color: "rgba(0, 0, 0, 1)",
            width: 1
          }
        }
      ]
    },
    buttonType: Translate
  };

  static create(opt?: Partial<TranslateControlOptions>) {
    let options = defaults({}, opt || {}, Translate.DEFAULT_OPTIONS) as TranslateControlOptions;
    return Button.create(options);
  }

  constructor(options: TranslateControlOptions) {
    super(options);

    let select = new ol.interaction.Select({
      style: (feature: ol.Feature | ol.render.Feature, res: number) => {
        let style = options.style[feature.getGeometry().getType()].map(s => this.symbolizer.fromJson(s));
        return style;
      }
    });

    let translate = new ol.interaction.Translate({
      features: select.getFeatures()
    });

    select.on("select", () => {
      translate.setActive(true);
    });

    this.once("change:active", () => {
      [select, translate].forEach(i => {
        i.setActive(false);
        options.map.addInteraction(i);
      });

      this.handlers.push(() => {
        [select, translate].forEach(i => {
          i.setActive(false);
          options.map.removeInteraction(i);
        });
      });
    });

    this.on("change:active", () => {
      let active = this.get("active");
      this.options.element.classList.toggle("active", active);

      select.setActive(active);
      if (!active) select.getFeatures().clear();
    });
  }
}
