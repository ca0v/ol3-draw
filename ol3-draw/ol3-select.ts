import ol = require("openlayers");
import { Button, ButtonOptions as IButtonOptions } from "./ol3-button";
import { defaults } from "ol3-fun/ol3-fun/common";

export interface IOptions extends IButtonOptions {
}

export class Select extends Button {
    static DEFAULT_OPTIONS: IOptions = {
        className: "ol-select",
        position: "top right",
        label: "§",
        title: "Select",
        eventName: "select-feature",
        buttonType: Select
    }

    static create(options?: IOptions) {
        options = defaults({}, options, Select.DEFAULT_OPTIONS);
        return Button.create(options);
    }

    constructor(options: IOptions) {
        super(options);

        let map = options.map;

        let selection = new ol.interaction.Select({
            multi: false,
            style: (feature: ol.Feature, res: number) => {

                let index = selection.getFeatures().getArray().indexOf(feature);

                switch (feature.getGeometry().getType()) {
                    case "Point":
                        return this.symbolizer.fromJson({
                            circle: {
                                radius: 20,
                                fill: {
                                    color: "blue"
                                },
                                stroke: {
                                    color: "red",
                                    width: 2
                                },
                                opacity: 1
                            },
                            text: {
                                text: index + 1 + "",
                                fill: {
                                    color: "white"
                                },
                                stroke: {
                                    color: "red",
                                    width: 2
                                },
                                scale: 3
                            }
                        });
                    case "MultiLineString":
                        return this.symbolizer.fromJson({
                            stroke: {
                                color: "red",
                                width: 2
                            },
                            text: {
                                text: index + 1 + "",
                                fill: {
                                    color: "white"
                                },
                                stroke: {
                                    color: "red",
                                    width: 2
                                },
                                scale: 3
                            }

                        });
                    case "Circle":
                    case "Polygon":
                    case "MultiPolygon":
                        return this.symbolizer.fromJson({
                            fill: {
                                color: "blue"
                            },
                            stroke: {
                                color: "red",
                                width: 2
                            },
                            text: {
                                text: index + 1 + "",
                                fill: {
                                    color: "white"
                                },
                                stroke: {
                                    color: "red",
                                    width: 2
                                },
                                scale: 3
                            }

                        });
                    default:
                        debugger;
                }
            }
        });

        selection.setActive(false);
        map.addInteraction(selection);

        this.on("change:active", () => {
            let active = this.get("active");
            selection.setActive(active);
            if (!active) selection.getFeatures().clear();
        });

    }
}