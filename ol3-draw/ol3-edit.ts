import ol = require("openlayers");
import { cssin, html, mixin } from "ol3-fun/ol3-fun/common";

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

export interface EditControlOptions extends olx.control.ControlOptions {
    className?: string;
    label?: string;
    title?: string;
}

export class Modify extends ol.control.Control {
    static DEFAULT_OPTIONS: EditControlOptions = {
        className: "ol-edit top right",
        label: "Edit",
        title: "Edit"
    }

    static create(options?: EditControlOptions) {
        options = mixin(mixin({}, Modify.DEFAULT_OPTIONS), options);

        cssin("ol-edit", `
            .ol-edit {
                position: absolute;
                background-color: #ccc;
            }
            .ol-edit.active {
                background-color: white;
            }
            .ol-edit.top {
                top: 0.5em;
            }
            .ol-edit.top-1 {
                top: 1.5em;
            }
            .ol-edit.top-2 {
                top: 2.5em;
            }
            .ol-edit.top-3 {
                top: 3.5em;
            }
            .ol-edit.top-4 {
                top: 4.5em;
            }
            .ol-edit.right {
                right: 0.5em;
            }
            .ol-edit.right-1 {
                right: 1.5em;
            }
            .ol-edit.right-2 {
                right: 2.5em;
            }
            .ol-edit.right-3 {
                right: 3.5em;
            }
            .ol-edit.right-4 {
                right: 4.5em;
            }
            .ol-edit input[type="button"] {
                background: transparent;
                border: none;
                width: 2em;
                height: 2em;
            }
        `);

        if (!options.element) {
            options.element = document.createElement("div");
            document.body.appendChild(options.element);
            options.element.className = options.className;
        }

        return new Modify(options);
    }

    public options: EditControlOptions;

    constructor(options: EditControlOptions) {
        super(options);
        this.options = options;

        let button = html(`<input type="button" value="${options.label}" />`);
        button.title = options.title;
        options.element.appendChild(button);

        button.addEventListener("click", () => this.dispatchEvent("button-click"));
    }

    setMap(map: ol.Map) {
        super.setMap(map);

        let select = new ol.interaction.Select({
            wrapX: false
        });
        select.setActive(false);

        addInteraction(map, select);
        select.on("change:active", () => this.options.element.classList.toggle("active", select.getActive()));

        select.on("select", (args: {
            deselected: ol.Feature[],
            selected: ol.Feature[]
        }) => {
            let modify = new ol.interaction.Modify({
                features: select.getFeatures()
            });
            addInteraction(map, modify);
            modify.setActive(true);
        })

        this.on("button-click", () => {
            stopInteraction(map, ol.interaction.Modify);
            stopInteraction(map, ol.interaction.Draw);
            select.setActive(!select.getActive());
        });
    }
}
