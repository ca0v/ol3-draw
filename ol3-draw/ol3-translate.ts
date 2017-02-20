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

        let select = new ol.interaction.Select({ wrapX: false });
        select.setActive(false);

        addInteraction(map, select);
        select.on("change:active", () => {
            this.options.element.classList.toggle("active", select.getActive());
        });

        select.on("select", (args: ol.interaction.SelectEvent) => {
            let translate = new ol.interaction.Translate({
                features: select.getFeatures()
            });
            translate.setActive(false);

            addInteraction(map, translate);
            translate.setActive(true);

            select.on("change:active", () => {
                if (!select.getActive() && translate) {
                    translate.setActive(false);
                    map.removeInteraction(translate);
                    translate = null;
                }
            });
            
        });


        this.on("change:active", () => {
            stopInteraction(map, ol.interaction.Modify);
            stopInteraction(map, ol.interaction.Draw);
            select.setActive(!select.getActive());
        });

    }
}