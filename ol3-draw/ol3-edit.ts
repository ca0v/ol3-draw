import ol = require("openlayers");
import { html, mixin } from "ol3-fun/ol3-fun/common";
import { Button, ButtonOptions as IButtonOptions } from "./ol3-button";

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

    constructor(options: EditControlOptions) {
        super(options);

        let select = new ol.interaction.Select({
            wrapX: false
        });

        let modify = new ol.interaction.Modify({
            features: select.getFeatures()
        });

        select.on("select", (args: ol.interaction.SelectEvent) => {
            modify.setActive(true);
        });

        [select, modify].forEach(i => {
            i.setActive(false);
            options.map.addInteraction(i);
        });

        this.handlers.push(() => {
            [select, modify].forEach(i => {
                i.setActive(false);
                options.map.removeInteraction(i);
            });
        });

        this.on("change:active", () => {
            let active = this.get("active");
            select.setActive(active);
            if (!active) select.getFeatures().clear();
        });
    }
}
