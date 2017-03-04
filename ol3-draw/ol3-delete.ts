import ol = require("openlayers");
import { Button, ButtonOptions as IButtonOptions } from "./ol3-button";
import { defaults } from "ol3-fun/ol3-fun/common";
import { Format } from "ol3-symbolizer";

export interface DeleteControlOptions extends IButtonOptions {
    multi?: boolean;
    style?: { [name: string]: Format.Style[] };
    boxSelectCondition?: (mapBrowserEvent: ol.MapBrowserEvent) => boolean;
}

export class Delete extends Button {

    static DEFAULT_OPTIONS: DeleteControlOptions = {
        className: "ol-delete",
        label: "␡",
        title: "Delete",
        buttonType: Delete,
        eventName: "delete-feature",
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
                }
            }],
            "MultiLineString": [{
                stroke: {
                    color: "red",
                    width: 2
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
                    color: "blue"
                },
                stroke: {
                    color: "red",
                    width: 2
                }
            }],
            "MultiPolygon": [{
                fill: {
                    color: "blue"
                },
                stroke: {
                    color: "red",
                    width: 2
                }
            }]
        }
    }

    public options: DeleteControlOptions;

    static create(options?: DeleteControlOptions) {
        options = defaults({}, options, Delete.DEFAULT_OPTIONS);
        return Button.create(options);
    }

    private featureLayerAssociation_: any;

    private addFeatureLayerAssociation(feature: ol.Feature, layer: ol.layer.Vector) {
        if (!this.featureLayerAssociation_) this.featureLayerAssociation_ = [];
        var key = feature.getId();
        this.featureLayerAssociation_[key] = layer;
    }

    constructor(options: DeleteControlOptions) {
        super(options);

        let map = options.map;
        let featureLayers = <Array<{ feature: ol.Feature; source: ol.source.Vector }>>[];

        let selection = new ol.interaction.Select({
            condition: ol.events.condition.click,
            multi: false,
            style: (feature: ol.Feature, res: number) => {

                let index = selection.getFeatures().getArray().indexOf(feature);

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

                let style = options.style[feature.getGeometry().getType()]
                    .map(s => this.symbolizer.fromJson(defaults({ text: textTemplate }, s)));

                return style;
            }
        });

        let boxSelect = new ol.interaction.DragBox({
            condition: options.boxSelectCondition
        });

        boxSelect.on("boxend", args => {
            let extent = boxSelect.getGeometry().getExtent();
            let features = selection.getFeatures().getArray();
            options.map.getLayers()
                .getArray()
                .filter(l => l instanceof ol.layer.Vector)
                .map(l => <ol.layer.Vector>l)
                .forEach(l => l.getSource().forEachFeatureIntersectingExtent(extent, feature => {
                    if (-1 === features.indexOf(feature)) {
                        selection.getFeatures().push(feature);
                        this.addFeatureLayerAssociation(feature, l);
                    } else {
                        selection.getFeatures().remove(feature);
                        this.addFeatureLayerAssociation(feature, null);
                    }
                }));
        });

        let doit = () => {
            selection.getFeatures().forEach(f => {
                let l = selection.getLayer(f) || this.featureLayerAssociation_[f.getId()];
                l && l.getSource().removeFeature(f);
            });
            selection.getFeatures().clear();
            this.featureLayerAssociation_ = [];
        }

        this.once("change:active", () => {
            [selection, boxSelect].forEach(i => {
                i.setActive(false);
                map.addInteraction(i);
            });

            this.handlers.push(() => {
                [selection, boxSelect].forEach(i => {
                    i.setActive(false);
                    map.removeInteraction(i);
                });
            });
        });

        this.on("change:active", () => {
            let active = this.get("active");
            if (!active) {
                doit();
                selection.getFeatures().clear();
            }
            [boxSelect, selection].forEach(i => i.setActive(active));
        });

    }
}
