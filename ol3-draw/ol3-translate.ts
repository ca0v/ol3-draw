import ol = require("openlayers");
import { Button, IOptions as IButtonOptions } from "./ol3-button";
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

export interface IOptions extends IButtonOptions {

}

export class Translate extends Button {
    static DEFAULT_OPTIONS: IOptions = {
        className: "ol-translate",
        position: "top right",
        label: "XY",
        title: "Translate",
        eventName: "translate-feature"
    }

    static create(options?: IOptions) {
        options = mixin(mixin({}, Translate.DEFAULT_OPTIONS), options);

        if (!options.element) {
            options.element = document.createElement("div");
            document.body.appendChild(options.element);
        }

        if (!options.target) {
            options.target = document.createElement("div");
            document.body.appendChild(options.target);
        }

        return new Translate(options);
    }

    setMap(map: ol.Map) {
        super.setMap(map);
        let translate: ol.interaction.Translate;
        let select: ol.interaction.Select;

        this.on("change:active", () => {
            let active = this.get("active");
            this.options.element.classList.toggle("active", active);
            stopInteraction(map, ol.interaction.Select);
            stopInteraction(map, ol.interaction.Modify);
            stopInteraction(map, ol.interaction.Draw);

            if (select) {
                map.removeInteraction(select);
                select = null;
            }
            if (translate) {
                map.removeInteraction(translate);
                translate = null;
            }

            if (active) {
                select = new ol.interaction.Select({ wrapX: false });
                addInteraction(map, select);
                select.setActive(true);

                select.on("select", (args: ol.interaction.SelectEvent) => {
                    translate = new ol.interaction.Translate({
                        features: select.getFeatures()
                    });

                    map.addInteraction(translate);
                    translate.setActive(true);
                });

                select.on("change:active", () => {
                    this.set("active", false);
                });

            } else {
            }
        });

    }
}