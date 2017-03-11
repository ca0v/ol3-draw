import ol = require("openlayers");
import { debounce } from "ol3-fun/ol3-fun/common";

export interface NavHistoryOptions {
    map?: ol.Map;
}

export class NavHistory {

    static create(options: NavHistoryOptions) {

        return new NavHistory(options);

    }

    private constructor(options: NavHistoryOptions) {
        let map = options.map;

        let history = <Array<{
            zoom: number;
            center: ol.Coordinate;
        }>>[];

        let push = () => {
            let count = history.push({
                zoom: map.getView().getZoom(),
                center: map.getView().getCenter()
            });
            console.log(count);
            return count;
        }

        let pop = () => {
            if (history.length) {
                return history.pop();
            }
        };

        let goto = () => {
            if (!history_index) return;
            stopListening();
            let extent = history[history_index - 1];
            map.getView().animate({ zoom: extent.zoom, center: extent.center }, debounce(() => stopListening = startListening()));
        }

        // capture current extent
        let history_index = push();

        // every time extent changes, capture new extent
        let startListening = () => {
            let h = map.getView().on(["change:center", "change:resolution"], debounce((args: ol.MapEvent) => {
                // wipe out everything forward (if anything)
                while (history.length > history_index) history.pop();
                // before capturing new extent
                history_index = push();
            }, 2000));
            return () => ol.Observable.unByKey(h);
        }

        map.on("nav:back", () => {
            if (!history_index) {
                console.warn("nothing to navigate back to");
                return;
            }
            history_index--;
            goto();
        });

        map.on("nav:forward", () => {
            if (history_index >= history.length) {
                console.warn("nothing to navigate foward to");
                return;
            }
            history_index++;
            goto();
        });

        let stopListening = startListening();

    }

}
