import ol = require("openlayers");
import { Button, ButtonOptions as IButtonOptions } from "./ol3-button";
import { defaults } from "ol3-fun/ol3-fun/common";
import { Format } from "ol3-symbolizer";

export interface SelectOptions extends IButtonOptions {
    multi?: boolean;
    style?: { [name: string]: Format.Style[] };
    boxSelectCondition?: (mapBrowserEvent: ol.MapBrowserEvent) => boolean;
}

export class Select extends Button {
    static DEFAULT_OPTIONS: SelectOptions = {
        className: "ol-select",
        position: "top right",
        label: "§",
        title: "Select",
        eventName: "select-feature",
        multi: false,
        buttonType: Select,
        boxSelectCondition: ol.events.condition.shiftKeyOnly,
        style: {
            "Point": [{
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
                    fill: {
                        color: "white"
                    },
                    stroke: {
                        color: "red",
                        width: 2
                    },
                    scale: 3
                }
            }],
            "MultiLineString": [{
                stroke: {
                    color: "red",
                    width: 2
                },
                text: {
                    fill: {
                        color: "white"
                    },
                    stroke: {
                        color: "red",
                        width: 2
                    },
                    scale: 3
                }
            }],
            "Polygon": [{
                fill: {
                    color: "blue"
                },
                stroke: {
                    color: "red",
                    width: 2
                },
                text: {
                    fill: {
                        color: "white"
                    },
                    stroke: {
                        color: "red",
                        width: 2
                    },
                    scale: 3
                }
            }]
        }
    }

    static create(options?: SelectOptions) {
        options = defaults({}, options, Select.DEFAULT_OPTIONS);
        return Button.create(options);
    }

    constructor(options: SelectOptions) {
        super(options);

        let map = options.map;

        let selection = new ol.interaction.Select({
            condition: ol.events.condition.click,
            multi: options.multi,
            style: (feature: ol.Feature, res: number) => {
                let style = options.style[feature.getGeometry().getType()].map(s => this.symbolizer.fromJson(s));
                style.filter(s => s.getText()).forEach(s => {
                    style[0].getText().setText(selection.getFeatures().getArray().indexOf(feature) + 1 + "");
                });
                return style;
            }
        });

        let boxSelect = new ol.interaction.DragBox({
            condition: options.boxSelectCondition
        });
        boxSelect.setActive(false);
        map.addInteraction(boxSelect);

        {
            let boxStartCoordinate: ol.Coordinate;

            boxSelect.on("boxend", args => {
                let extent = boxSelect.getGeometry().getExtent();
                let features = selection.getFeatures().getArray();
                map.getLayers()
                    .getArray()
                    .filter(l => l instanceof ol.layer.Vector)
                    .map(l => <ol.layer.Vector>l)
                    .forEach(l => l.getSource().forEachFeatureIntersectingExtent(extent, feature => {
                        if (-1 === features.indexOf(feature)) {
                            selection.getFeatures().push(feature);
                        } else {
                            selection.getFeatures().remove(feature);                            
                        }
                    }));
            });
        }

        selection.setActive(false);
        map.addInteraction(selection);

        this.on("change:active", () => {
            let active = this.get("active");
            selection.setActive(active);
            boxSelect.setActive(active);
            if (!active) selection.getFeatures().clear();
        });

    }
}