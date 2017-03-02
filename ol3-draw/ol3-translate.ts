import ol = require("openlayers");
import { Button, IOptions as IButtonOptions } from "./ol3-button";
import { html, defaults } from "ol3-fun/ol3-fun/common";

export interface IOptions extends IButtonOptions {

}

export class Translate extends Button {
    static DEFAULT_OPTIONS: IOptions = {
        className: "ol-translate",
        position: "top right",
        label: "XY",
        title: "Translate",
        eventName: "translate-feature",
        buttonType: Translate
    }

    static create(options?: IOptions) {
        options = defaults({}, options, Translate.DEFAULT_OPTIONS);
        return Button.create(options);
    }

    setMap(map: ol.Map) {
        super.setMap(map);
        let translate: ol.interaction.Translate;
        let select: ol.interaction.Select;

        this.on("change:active", () => {
            let active = this.get("active");
            this.options.element.classList.toggle("active", active);

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
                map.addInteraction(select);
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