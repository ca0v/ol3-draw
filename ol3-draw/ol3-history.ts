import ol = require("openlayers");
import { debounce, defaults } from "ol3-fun/index";

export interface NavHistoryOptions {
  map?: ol.Map;
  delay?: number;
}

export class NavHistory {
  static DEFAULT_OPTIONS: NavHistoryOptions = {
    delay: 2000
  };

  static create(options: NavHistoryOptions) {
    options = defaults({}, options || {}, NavHistory.DEFAULT_OPTIONS);
    return new NavHistory(options);
  }

  private constructor(public options: NavHistoryOptions) {
    if (!options.map) throw "map is a required option";
    let map = options.map;

    let history = <
      Array<{
        zoom: number;
        center: ol.Coordinate;
      }>
    >[];

    let history_index = 0;

    let push = () => {
      history_index = history.push({
        zoom: map.getView().getZoom(),
        center: map.getView().getCenter()
      });
      console.log("push", history_index);
    };

    // capture current extent
    push();

    let stopped = false;

    let resume = debounce(() => {
      stopped = false;
      console.log("allow capture");
    }, this.options.delay);

    let goto = () => {
      stopped = true;
      console.log("suspend capture");
      console.log("goto", history_index);
      let extent = history[history_index - 1];
      map.getView().animate(
        {
          zoom: extent.zoom,
          center: extent.center,
          duration: (this.options.delay || 0) / 10
        },
        resume
      );
    };

    let capture = debounce(() => {
      if (stopped) {
        console.log("capture suspended");
        return;
      }
      // wipe out everything forward (if anything)
      while (history.length > history_index) history.pop();
      push();
    }, this.options.delay);

    map.getView().on(["change:center", "change:resolution"], () => capture());

    map.on("nav:back", () => {
      if (history_index <= 1) {
        console.warn("nothing to navigate back to");
        return;
      }
      history_index--;
      goto();
    });

    map.on("nav:forward", () => {
      if (history_index >= history.length) {
        console.warn("nothing to navigate forward to");
        return;
      }
      history_index++;
      goto();
    });
  }
}
