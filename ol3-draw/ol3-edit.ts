import ol = require("openlayers");
import { html, mixin } from "ol3-fun/ol3-fun/common";
import { Button, IOptions as IButtonOptions } from "./ol3-button";

export interface EditControlOptions extends IButtonOptions {
}

export class Modify extends Button {
    static DEFAULT_OPTIONS: EditControlOptions = {
        className: "ol-edit",
        label: "Edit",
        title: "Edit",
        eventName: "modify-feature",
        buttonType: Modify
    }

    static create(options?: EditControlOptions) {
        options = mixin(mixin({}, Modify.DEFAULT_OPTIONS), options);
        return Button.create(options);
    }

    public options: EditControlOptions;

    setMap(map: ol.Map) {
        super.setMap(map);
        let select: ol.interaction.Select;
        let modify: ol.interaction.Modify;

        this.on("change:active", () => {
            let active = this.get("active");
            this.options.element.classList.toggle("active", active);

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
                map.addInteraction(select);
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
