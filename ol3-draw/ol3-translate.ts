import ol = require("openlayers");
import { Button, ButtonOptions as IButtonOptions } from "./ol3-button";
import { html, defaults } from "ol3-fun/ol3-fun/common";

export interface TranslateControlOptions extends IButtonOptions {

}

export class Translate extends Button {
    static DEFAULT_OPTIONS: TranslateControlOptions = {
        className: "ol-translate",
        position: "top right",
        label: "XY",
        title: "Translate",
        eventName: "translate-feature",
        buttonType: Translate
    }

    static create(options?: TranslateControlOptions) {
        options = defaults({}, options, Translate.DEFAULT_OPTIONS);
        return Button.create(options);
    }

    constructor (options: TranslateControlOptions) {
        super(options);

        let map = options.map;

        let select = new ol.interaction.Select({
            wrapX: false
        });

        let translate = new ol.interaction.Translate({
            features: select.getFeatures()
        });

        select.on("select", (args: ol.interaction.SelectEvent) => {
            translate.setActive(true);
        });

        [select, translate].forEach(i => {
            i.setActive(false);
            options.map.addInteraction(i);
        });

        this.handlers.push(() => {
            [select, translate].forEach(i => {
                i.setActive(false);
                options.map.removeInteraction(i);
            });
        });

        this.on("change:active", () => {
            let active = this.get("active");
            this.options.element.classList.toggle("active", active);

            select.setActive(active);
            if (!active) select.getFeatures().clear();
        });

    }
}