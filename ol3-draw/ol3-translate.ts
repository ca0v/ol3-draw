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

        let select = new ol.interaction.Select({
            wrapX: false
        });

        let translate = new ol.interaction.Translate({
            features: select.getFeatures()
        });

        select.on("select", (args: ol.interaction.SelectEvent) => {
            translate.setActive(true);
        });

        select.setActive(false);
        translate.setActive(false);

        map.addInteraction(select);
        map.addInteraction(translate);

        this.on("change:active", () => {
            let active = this.get("active");
            this.options.element.classList.toggle("active", active);

            select.setActive(active);
            if (!active) select.getFeatures().clear();
        });

    }
}