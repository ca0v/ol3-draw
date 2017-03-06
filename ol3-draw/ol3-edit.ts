import ol = require("openlayers");
import { html, mixin } from "ol3-fun/ol3-fun/common";
import { Button, ButtonOptions as IButtonOptions } from "./ol3-button";
import { Format } from "ol3-symbolizer";

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
            "Point": [{
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
            }],
            "MultiLineString": [{
                stroke: {
                    color: "rgba(0, 0, 0, 0.5)",
                    width: 3
                }
            }],
            "Circle": [{
                fill: {
                    color: "blue"
                },
                stroke: {
                    color: "red",
                    width: 2
                }
            }],
            "Polygon": [{
                fill: {
                    color: "rgba(0, 0, 0, 0.1)"
                },
                stroke: {
                    color: "rgba(0, 0, 0, 1)",
                    width: 1
                }
            }],
            "MultiPolygon": [{
                fill: {
                    color: "rgba(0, 0, 0, 0.1)"
                },
                stroke: {
                    color: "rgba(0, 0, 0, 1)",
                    width: 1
                }
            }]
        },
        buttonType: Modify
    }

    static create(options?: ModifyControlOptions) {
        options = mixin(mixin({}, Modify.DEFAULT_OPTIONS), options);
        return Button.create(options);
    }

    public options: ModifyControlOptions;

    constructor(options: ModifyControlOptions) {
        super(options);

        let select = new ol.interaction.Select({
            style: (feature: ol.Feature, res: number) => {
                let featureType = feature.getGeometry().getType();
                let style = (options.style[featureType] || Modify.DEFAULT_OPTIONS.style[featureType])
                    .map(s => this.symbolizer.fromJson(s));
                    
                return style;
            }
        });

        let modify = new ol.interaction.Modify({
            features: select.getFeatures(),
            style: (feature: ol.Feature, res: number) => {
                let featureType = feature.getGeometry().getType();
                let style = (options.style[featureType] || Modify.DEFAULT_OPTIONS.style[featureType])
                    .map(s => this.symbolizer.fromJson(s));
                    
                return style;
            }
        });

        select.on("select", (args: ol.interaction.SelectEvent) => {
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
