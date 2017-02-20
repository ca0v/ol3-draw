import ol = require("openlayers");
import { cssin, html, mixin } from "ol3-fun/ol3-fun/common";
import { Button, IOptions as IButtonOptions } from "./ol3-button";

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

export interface EditControlOptions extends IButtonOptions {
}

export class Modify extends Button {
    static DEFAULT_OPTIONS: EditControlOptions = {
        className: "ol-edit",
        label: "Edit",
        title: "Edit"
    }

    static create(options?: EditControlOptions) {
        options = mixin(mixin({}, Modify.DEFAULT_OPTIONS), options);

        if (!options.element) {
            options.element = document.createElement("div");
            document.body.appendChild(options.element);
            options.element.className = options.className;
        }

        return new Modify(options);
    }

    public options: EditControlOptions;

    setMap(map: ol.Map) {
        super.setMap(map);
        let select: ol.interaction.Select;
        let modify: ol.interaction.Modify;

        this.on("change:active", () => {
            let active = this.get("active");
            this.options.element.classList.toggle("active", active);
            stopInteraction(map, ol.interaction.Select);
            stopInteraction(map, ol.interaction.Modify);
            stopInteraction(map, ol.interaction.Draw);

            if (select) {
                select.setActive(false);
                map.removeInteraction(select);
                select = null;
            }
            if (modify) {
                modify.setActive(false);
                map.removeInteraction(modify);
                modify = null;
            }

            if (active) {
                select = new ol.interaction.Select({
                    wrapX: false
                });
                addInteraction(map, select);
                select.setActive(true);

                select.on("select", (args: ol.interaction.SelectEvent) => {
                    modify = new ol.interaction.Modify({
                        features: select.getFeatures()
                    });
                    map.addInteraction(modify);
                    modify.setActive(true);
                });

                select.on("change:active", () => {
                    this.set("active", false);
                });

            }
        });
    }
}
