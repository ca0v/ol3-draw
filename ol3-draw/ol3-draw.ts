import ol = require("openlayers");
import { cssin, html, mixin } from "ol3-fun/ol3-fun/common";
import { StyleConverter } from "ol3-symbolizer";

const converter = new StyleConverter();

function stopInteraction(map: ol.Map, type: any) {
    map.getInteractions()
        .getArray()
        .filter(i => i instanceof type)
        .forEach(t => t.setActive(false));
}

function addInteraction(map: ol.Map, action: ol.interaction.Interaction) {
    map.addInteraction(action);
    action.on("change:active", () => {
        map.dispatchEvent({
            type: "interaction-active",
            interaction: action
        });
    });
}

export interface DrawControlOptions extends olx.control.ControlOptions {
    className?: string;
    label?: string;
    title?: string;
    layers?: Array<ol.layer.Vector>;
    geometryType?: "Point" | "LineString" | "LinearRing" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon" | "GeometryCollection" | "Circle";
}

export class Draw extends ol.control.Control {
    static DEFAULT_OPTIONS: DrawControlOptions = {
        className: "ol-draw top right",
        geometryType: "Point",
        label: "Draw",
        title: "Draw"
    }

    static create(options?: DrawControlOptions) {
        cssin("ol-draw", `
            .ol-draw {
                position: absolute;
                background: #ccc;
            }
            .ol-draw.active {
                background-color: white;
            }
            .ol-draw.top {
                top: 0.5em;
            }
            .ol-draw.top-1 {
                top: 1.5em;
            }
            .ol-draw.top-2 {
                top: 2.5em;
            }
            .ol-draw.top-3 {
                top: 3.5em;
            }
            .ol-draw.top-4 {
                top: 4.5em;
            }
            .ol-draw.right {
                right: 0.5em;
            }
            .ol-draw.right-1 {
                right: 1.5em;
            }
            .ol-draw.right-2 {
                right: 2.5em;
            }
            .ol-draw.right-3 {
                right: 3.5em;
            }
            .ol-draw.right-4 {
                right: 4.5em;
            }
            .ol-draw.right-5 {
                right: 5.5em;
            }
            .ol-draw.right-6 {
                right: 6.5em;
            }
            .ol-draw input[type="button"] {
                background: transparent;
                border: none;
                width: 2em;
                height: 2em;
            }
        `);
        options = mixin(mixin({}, Draw.DEFAULT_OPTIONS), options);

        if (!options.className) {
            options.className = 'ol-draw top right';
        }

        if (!options.element) {
            options.element = document.createElement("div");
            document.body.appendChild(options.element);
            options.element.className = options.className;
        }

        if (!options.target) {
            options.target = document.createElement("div");
            document.body.appendChild(options.target);
        }

        if (options.render) {
            throw "create a sub-class to override render";
        }

        if (!options.geometryType) {
            options.geometryType = "Point";
        }

        options.element.className = options.className;
        return new Draw(options);
    }

    public options: DrawControlOptions;

    public interactions: { [name: string]: ol.interaction.Draw };

    constructor(options: DrawControlOptions) {
        super(options);
        this.options = options;

        this.interactions = {};

        let button = html(`<input type="button" value="${options.label}" />`);
        button.title = options.title;
        options.element.appendChild(button);
        button.addEventListener("click", () => {
            let interaction = this.interactions[options.geometryType];
            let wasDrawing = interaction && interaction.getActive();

            if (this.isDrawing()) {
                this.stopDrawing();
            }
            if (!wasDrawing) {
                if (!interaction) {
                    interaction = this.interactions[options.geometryType] = this.createInteraction();
                }
                this.stopEditing();
                interaction.setActive(true);
            }
        });
    }

    private stopEditing() {
        let map = this.getMap();
        stopInteraction(map, ol.interaction.Modify);
        stopInteraction(map, ol.interaction.Select);
    }

    isDrawing() {
        let map = this.getMap();
        let drawTools = map.getInteractions().getArray()
            .filter(i => i instanceof ol.interaction.Draw);
        return 0 < drawTools.length;
    }

    private createInteraction() {
        let options = this.options;
        let source = options.layers[0].getSource();

        let draw = new ol.interaction.Draw({
            type: options.geometryType,
            source: source
        });
        draw.setActive(false);

        draw.on("change:active", () =>
            this.options.element.classList.toggle("active", draw.getActive()));

        addInteraction(this.getMap(), draw);
        return draw;
    }

    stopDrawing() {
        let map = this.getMap();
        let drawTools = map.getInteractions().getArray()
            .filter(i => i instanceof ol.interaction.Draw);
        drawTools.forEach(t => t.setActive(false));
    }

    setMap(map: ol.Map) {
        let options = this.options;

        super.setMap(map);

        let style = [
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
                    width: 3
                }
            },
            {
                stroke: {
                    color: "rgba(0,0,0,1)",
                    width: 1
                }
            }
        ].map(s => converter.fromJson(s));

        if (!options.layers) {
            let layer = new ol.layer.Vector({
                style: style,
                source: new ol.source.Vector()
            });
            map.addLayer(layer);
            options.layers = [layer];
        }
    }

}

