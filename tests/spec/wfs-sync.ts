import ol = require("openlayers");
import { describe, it, should, shouldEqual } from "ol3-fun/tests/base";
import { WfsSyncOptions, WfsSync } from "../../ol3-draw/services/wfs-sync";

const WFS_INFO = {
  srsName: "EPSG:3857",
  wfsUrl: `${location.protocol}//${location.hostname}:8080/geoserver/cite/wfs`,
  featureNS: "http://www.opengeospatial.net/cite",
  featurePrefix: "cite"
};

describe("wfs-sync", () => {
  it("WfsSync", () => {
    should(!!WfsSync, "WfsSync");
  });

  it("DEFAULT_OPTIONS", () => {
    let options = WfsSync.DEFAULT_OPTIONS;
    checkDefaultInputOptions(options);
  });

  location.hostname === "127.0.0.1" &&
    it("should invoke a POST request", done => {
      let source = new ol.source.Vector();
      let service = WfsSync.create({
        wfsUrl: WFS_INFO.wfsUrl,
        featureNS: WFS_INFO.featureNS,
        featurePrefix: WFS_INFO.featurePrefix,
        srsName: WFS_INFO.srsName,
        sourceSrs: WFS_INFO.srsName,
        source: source,
        targets: {
          Point: "point_layer"
        }
      });

      service.on("after-save", args => {
        console.warn(args);
        done();
      });
      service.on("error", args => {
        shouldEqual(args, "Feature type 'point_layer' is not available: ", "point_layer not available error message");
        done();
      });

      // seems we'd want an option to load all the points into the source?
      // should cause a POST to create the feature
      source.addFeature(new ol.Feature(new ol.geom.Point([0, 0])));
    });
});

function checkDefaultInputOptions(options: WfsSyncOptions) {
  should(!!options, "options");
  shouldEqual(options.featureIdFieldName, "gid", "featureIdFieldName");
  shouldEqual(options.lastUpdateFieldName, "touched", "lastUpdateFieldName");
}
