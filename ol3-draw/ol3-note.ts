import ol = require("openlayers");
import { Button, ButtonOptions } from "./ol3-button";
import { cssin, defaults, html } from "ol3-fun/ol3-fun/common";
import { Format } from "ol3-symbolizer/index";

/**
 * Draws a point that renders as a ol.overlay at a certain zoom level
 * with a textarea allow user to enter notes
 * Click "Add Note" then click the map.  Done.
 */
export interface NoteControlOptions extends ButtonOptions {
    geometryName?: string;
    layer?: ol.layer.Vector;
    noteFieldName?: string;
    style?: Format.Style[];
}

export class Note extends Button {

    static DEFAULT_OPTIONS: NoteControlOptions = {
        className: "ol-note",
        label: "✎",
        title: "Note",
        buttonType: Note,
        eventName: "note",
        geometryName: "geom",
        noteFieldName: "note",
        style: [
            {
                "star": {
                    "fill": {
                        "color": "red"
                    },
                    "opacity": 1,
                    "stroke": {
                        "color": "black",
                        "width": 2
                    },
                    "radius": 10,
                    "radius2": 4,
                    "points": 5,
                    "scale": 1
                }
            }
        ]
    }

    static create(options?: NoteControlOptions) {
        options = defaults({}, options, Note.DEFAULT_OPTIONS);
        return Button.create(options);
    }

    public options: NoteControlOptions;

    private overlayMap: Array<{ feature: ol.Feature; overlay: ol.Overlay }> = [];

    constructor(options: NoteControlOptions) {
        super(options);

        let map = options.map;

        map.getView().on("change:resolution", () => {
            console.log(map.getView().getResolution());
        });

        let style = this.options.style.map(s => this.symbolizer.fromJson(s));

        if (!options.layer) {
            let layer = new ol.layer.Vector({
                style: style,
                source: new ol.source.Vector(),
                maxResolution: 600
            });
            options.map.addLayer(layer);
            options.layer = layer;
        } else {

            // when first active, re-style all features with a note
            this.once("change:active", () => {
                options.layer
                    .getSource()
                    .getFeatures()
                    .filter(f => !!f.get(options.noteFieldName))
                    .forEach(f => f.setStyle(style));
            });

        }

        // every time active changes toggle the overlay and marker styles
        this.on("change:active", () => {
            let active = this.get("active");
            this.overlayMap.forEach(v => {
                v.feature.setStyle(active ? style : null);
                v.overlay.getElement().classList.toggle("hidden", !active);
            });

        });

        {

            let h = map.on("click", (args: ol.MapBrowserPointerEvent) => {

                let found = map.forEachFeatureAtPixel(args.pixel, (feature: ol.Feature, layer: ol.layer.Vector) => {
                    if (layer === options.layer) {
                        let note = feature.get(options.noteFieldName);
                        if (!note) return;

                        if (!feature.getStyle()) feature.setStyle(style);
                        let overlay = this.forceOverlay(feature);
                        let wasVisible = !overlay.getElement().classList.contains("hidden");
                        overlay.getElement().classList.toggle("hidden");
                        overlay.setPosition(wasVisible ? null : ol.extent.getCenter(feature.getGeometry().getExtent()));
                        return true;
                    }
                });

                if (!this.get("active")) return;

                if (found) {
                    //this.set("active", false);
                    return;
                }

                {
                    let feature = new ol.Feature();
                    feature.setStyle(style);
                    feature.setGeometryName(options.geometryName);
                    feature.setGeometry(new ol.geom.Point(args.coordinate));

                    let overlay = this.forceOverlay(feature);
                    // show the popup
                    overlay.getElement().classList.toggle("hidden");

                    options.layer.getSource().addFeature(feature);
                    //this.set("active", false);
                }
            });

            this.handlers.push(() => ol.Observable.unByKey(h));

        }

    }

    private forceOverlay(feature: ol.Feature) {
        let overlayInfo = this.overlayMap.filter(i => i.feature === feature)[0];
        if (!overlayInfo) {
            let overlay = this.createOverlay(feature);
            overlayInfo = { feature: feature, overlay: overlay };
            this.overlayMap.push(overlayInfo);
        }
        return overlayInfo.overlay;
    }

    private createOverlay(feature: ol.Feature) {
        let options = this.options;
        let map = options.map;
        //let textarea = document.createElement("textarea");
        let note = feature.get(options.noteFieldName) || "";
        let textarea = html(`<div class="contentEditableDiv hidden"><p class="editableP" contentEditable="true" placeholder="[TYPE YOUR MESSAGE HERE]">${note}</p></div>`);
        let input = textarea.getElementsByClassName("editableP")[0];
        input.addEventListener("input", () => feature.set(options.noteFieldName, input.textContent));

        let overlay = new ol.Overlay({
            insertFirst: true,
            positioning: "bottom-center",
            offset: [0, -5],
            element: textarea,
            position: ol.extent.getCenter(feature.getGeometry().getExtent())
        });
        map.addOverlay(overlay);

        return overlay;
    }

    cssin() {
        super.cssin();
        this.handlers.push(cssin(`${this.options.className}-input`, `
[contenteditable=true]:empty:before{
  content: attr(placeholder);
  display: block;
  opacity: 0.5;
}

.contentEditableDiv {
    width:200px;
    height:60px;
    position:relative;
    overflow:auto;
    margin-bottom: 8px;
}

.contentEditableDiv.hidden {
    display: none;
}

.editableP{
    min-height:10px;
    position:absolute;   
    bottom:0;
    left:0;
    right:0;
    margin: 0;
    text-align: center;
    font-family: cursive;
    rgba(240,240,240,0.6);
}`));
    }

}
