import ol = require("openlayers");
import { html, defaults } from "ol3-fun/index";
import { Button, ButtonOptions as IButtonOptions } from "./ol3-button";
import { Format } from "ol3-symbolizer/index";

export interface ModifyControlOptions extends IButtonOptions {
  style?: { [name: string]: Format.Style[] };
}

export class Modify extends Button {
  static DEFAULT_OPTIONS: ModifyControlOptions = {
    className: "ol-edit",
    label: "Edit",
    title: "Edit",
    eventName: "modify-feature",
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
      EditPoints: [
        {
          circle: {
            radius: 5,
            fill: {
              color: "rgb(255, 165, 0)"
            },
            opacity: 0.2
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
    buttonType: Modify
  };

  static create(options?: ModifyControlOptions) {
    options = defaults({}, options, Modify.DEFAULT_OPTIONS);
    return Button.create(options);
  }

  public options: ModifyControlOptions;

  constructor(options: ModifyControlOptions) {
    super(options);

    let styles = defaults(options.style, Modify.DEFAULT_OPTIONS.style);
    let select = new ol.interaction.Select({
      style: (feature: ol.Feature, res: number) => {
        let featureType = feature.getGeometry().getType();
        let style = styles[featureType].map(s => this.symbolizer.fromJson(s));

        switch (featureType) {
          case "MultiLineString":
          case "MultiPolygon":
          case "Polygon":
          case "MultiPoint":
          case "Point":
            styles["EditPoints"].map(s => this.symbolizer.fromJson(s)).forEach(otherStyle => {
              otherStyle.setGeometry(() => {
                let geom = feature.getGeometry();
                let points: ol.Coordinate[];
                if (geom instanceof ol.geom.MultiPolygon) {
                  points = geom.getCoordinates()[0][0];
                } else if (geom instanceof ol.geom.Polygon) {
                  points = geom.getCoordinates()[0];
                } else if (geom instanceof ol.geom.MultiLineString) {
                  points = geom.getCoordinates()[0];
                } else if (geom instanceof ol.geom.MultiPoint) {
                  points = geom.getCoordinates();
                } else if (geom instanceof ol.geom.Point) {
                  points = [geom.getCoordinates()];
                }
                return new ol.geom.MultiPoint(points);
              });
              style.push(otherStyle);
            });
        }

        return style;
      }
    });

    let modify = new ol.interaction.Modify({
      features: select.getFeatures(),
      style: (feature: ol.Feature, res: number) => {
        let featureType = feature.getGeometry().getType();
        let style = (options.style[featureType] || Modify.DEFAULT_OPTIONS.style[featureType]).map(s =>
          this.symbolizer.fromJson(s)
        );

        return style;
      }
    });

    ["modifystart", "modifyend"].forEach(eventName => {
      modify.on(eventName, args => this.dispatchEvent(args));
    });

    select.on("select", () => {
      modify.setActive(true);
    });

    this.once("change:active", () => {
      [select, modify].forEach(i => {
        i.setActive(false);
        options.map.addInteraction(i);
      });

      this.handlers.push(() => {
        [select, modify].forEach(i => {
          i.setActive(false);
          options.map.removeInteraction(i);
        });
      });
    });

    this.on("change:active", () => {
      let active = this.get("active");
      select.setActive(active);
      if (!active) select.getFeatures().clear();
    });
  }
}
