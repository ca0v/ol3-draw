import ol = require("openlayers");
import { Button, IOptions as IButtonOptions } from "./ol3-button";
import { mixin } from "ol3-fun/ol3-fun/common";
import { StyleConverter } from "ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer";

let symbolizer = new StyleConverter();

export interface DeleteControlOptions extends IButtonOptions {
}

export class Delete extends Button {

    static DEFAULT_OPTIONS: DeleteControlOptions = {
        className: "ol-delete",
        label: "␡",
        title: "Delete",
        buttonType: Delete,
        eventName: "delete-feature"
    }

    public options: DeleteControlOptions;

    static create(options?: DeleteControlOptions) {
        options = mixin(mixin({}, Delete.DEFAULT_OPTIONS), options);
        return Button.create(options);
    }

    setMap(map: ol.Map) {
        super.setMap(map);

        let select = new ol.interaction.Select({
            wrapX: false,
            style: (feature: ol.Feature, res: number) => {

                let index = select.getFeatures().getArray().indexOf(feature);

                let fillColor = "rgba(0,0,0,0.2)";
                let strokeColor = "red";

                let textTemplate = {
                    text: "X" + (index + 1),
                    fill: {
                        color: strokeColor
                    },
                    stroke: {
                        color: fillColor,
                        width: 2
                    },
                    scale: 3
                };

                switch (feature.getGeometry().getType()) {
                    case "Point":
                        return symbolizer.fromJson({
                            circle: {
                                radius: 20,
                                fill: {
                                    color: fillColor
                                },
                                stroke: {
                                    color: strokeColor,
                                    width: 2
                                },
                                opacity: 1
                            },
                            text: textTemplate
                        });
                    case "MultiLineString":
                        return symbolizer.fromJson({
                            stroke: {
                                color: strokeColor,
                                width: 2
                            },
                            text: textTemplate

                        });
                    case "Circle":
                    case "Polygon":
                    case "MultiPolygon":
                        return symbolizer.fromJson({
                            fill: {
                                color: fillColor
                            },
                            stroke: {
                                color: strokeColor,
                                width: 2
                            },
                            text: textTemplate
                        });
                    default:
                        debugger;
                }
            }
        });

        select.setActive(false);
        map.addInteraction(select);

        let doit = () => {
            select.getFeatures().forEach(f => {
                let l = select.getLayer(f);
                l.getSource().removeFeature(f);
            });
            select.getFeatures().clear();
        }

        this.on("change:active", () => {
            let active = this.get("active");
            if (!active) {
                doit();
                select.getFeatures().clear();
            }
            select.setActive(active);
        });

    }

}
