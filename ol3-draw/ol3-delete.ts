import ol = require("openlayers");
import { Button, IOptions as IButtonOptions } from "./ol3-button";
import { mixin } from "ol3-fun/ol3-fun/common";


export interface DeleteControlOptions extends IButtonOptions {
}

export class Delete extends Button {

    static DEFAULT_OPTIONS: DeleteControlOptions = {
        className: "ol-delete",
        label: "␡",
        title: "Delete",
        buttonType: Delete,
        eventName: "delete-feature"
    }

    public options: DeleteControlOptions;

    static create(options?: DeleteControlOptions) {
        options = mixin(mixin({}, Delete.DEFAULT_OPTIONS), options);
        return Button.create(options);
    }

    setMap(map: ol.Map) {
        super.setMap(map);
        let select = new ol.interaction.Select({
            wrapX: false
        });
        select.setActive(false);
        map.addInteraction(select);

        select.on("select", (args: ol.interaction.SelectEvent) => {
            args.selected.forEach(f => {
                let l = select.getLayer(f);
                l.getSource().removeFeature(f);
            });
            select.getFeatures().clear();
        });


        select.on("change:active", () => {
            this.set("active", select.getActive());
        });

        this.on("change:active", () => {
            let active = this.get("active");
            this.options.element.classList.toggle("active", active);
            select.setActive(active);
        });

    }

}
