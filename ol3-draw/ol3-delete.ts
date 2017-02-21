import ol = require("openlayers");
import { Button, IOptions as IButtonOptions } from "./ol3-button";
import { mixin } from "ol3-fun/ol3-fun/common";


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

export interface DeleteControlOptions extends IButtonOptions {
}

export class Delete extends Button {

    static DEFAULT_OPTIONS: DeleteControlOptions = {
        className: "ol-delete",
        label: "␡",
        title: "Delete"
    }

    public options: DeleteControlOptions;

    static create(options?: DeleteControlOptions) {
        options = mixin(mixin({}, Delete.DEFAULT_OPTIONS), options);

        if (!options.element) {
            options.element = document.createElement("div");
            document.body.appendChild(options.element);
            options.element.className = options.className;
        }

        return new Delete(options);
    }

    setMap(map: ol.Map) {
        super.setMap(map);
        let select = new ol.interaction.Select({
            wrapX: false
        });
        select.setActive(false);
        addInteraction(map, select);

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
            stopInteraction(map, ol.interaction.Select);
            stopInteraction(map, ol.interaction.Modify);
            stopInteraction(map, ol.interaction.Draw);
            select.setActive(active);
        });

    }

}
