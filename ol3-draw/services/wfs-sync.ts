/**
 * Automatically post changes to a WFS-T service
 */
import ol = require("openlayers");
import $ = require("jquery");
import { debounce, defaults } from "ol3-fun/index";

export interface WfsSyncOptions {
  // wfs endpoint
  wfsUrl: string;
  // source to watch
  source: ol.source.Vector;
  // wfs namespace
  featureNS: string;
  // wfs namespace prefix
  featurePrefix: string;
  // formatter for turning feature into a service request
  formatter?: ol.format.WFS;
  // feature geometry to layer mapping (Point -> "point-layer")
  targets: { [name: string]: string }; // name is ol.geom.GeometryType
  // the attribute name to use to manage versioning
  lastUpdateFieldName?: string;
  // target SRS, what spatial reference should be used when saving?
  srsName?: string;
  // the SRS of the feature geometry
  sourceSrs?: string;
  // the name of the attribute holding the unique feature identifier (gid)
  featureIdFieldName?: string;
  // convertion option for reducing or transforming a cloned geometry just before saving
  converter?: (geom: ol.geom.Geometry) => ol.geom.Geometry;
}

const serializer = new XMLSerializer();

export class WfsSync {

  private options: WfsSyncOptions;

  // remember when we saved in the past
  private lastSavedTime: number;

  // track deletes until its time to save changes
  private deletes: ol.Feature[];

  static DEFAULT_OPTIONS = <WfsSyncOptions>{
    featureIdFieldName: "gid",
    lastUpdateFieldName: "touched",
  }

  static create(options?: WfsSyncOptions) {
    options = defaults(options || {}, WfsSync.DEFAULT_OPTIONS);
    if (!options.formatter) {
      options.formatter = new ol.format.WFS();
    }
    if (!options.srsName) {
      // isn't generally set...better to get map from layer?
      options.srsName = options.source.getProjection().getCode();
    }
    let result = new WfsSync(options);
    return result;
  }

  private constructor(options: WfsSyncOptions) {
    this.options = options;
    this.lastSavedTime = Date.now();
    this.deletes = [];
    this.watch();
  }

  /**
   * start watching the feature collection, saving when there's a lull in the action
   */
  private watch() {

    let save = debounce(() => this.saveDrawings({
      features: this.options.source.getFeatures().filter(f => !!f.get(this.options.lastUpdateFieldName))
    }), 1000);

    let touch = (f: ol.Feature) => {
      f.set(this.options.lastUpdateFieldName, Date.now());
      save();
    };

    let watch = (f: ol.Feature) => {
      f.getGeometry().on("change", () => touch(f));
      f.on("propertychange", (args: any) => {
        if (args.key === this.options.lastUpdateFieldName) return;
        touch(f);
      });
    };

    let source = this.options.source;
    source.forEachFeature(f => watch(f));

    source.on("addfeature", (args: ol.source.VectorEvent) => {
      watch(args.feature);
      touch(args.feature);
    });

    source.on("removefeature", (args: ol.source.VectorEvent) => {
      this.deletes.push(args.feature);
      touch(args.feature);
    });

  }

/**
 * Performs the actual save of a list of feature (immutable)
 */
  private saveDrawings(args: {
    features: ol.Feature[];
  }) {
    let features = args.features.filter(f => this.lastSavedTime <= f.get(this.options.lastUpdateFieldName));

    let saveTo = (featureType: string, geomType: ol.geom.GeometryType) => {
      let toSave = features.filter(f => f.getGeometry().getType() === geomType);
      let toDelete = this.deletes.filter(f => !!f.get(this.options.featureIdFieldName));

      if (0 === (toSave.length + toDelete.length)) {
        console.info("nothing to save:", featureType, geomType);
        return;
      }

      // clone and transform as needed
      if (this.options.sourceSrs && this.options.sourceSrs !== this.options.srsName) {
        let srsIn = new ol.proj.Projection({ code: this.options.sourceSrs });
        let srsOut = new ol.proj.Projection({ code: this.options.srsName });
        toSave = toSave.map(f => f.clone());
        toSave.forEach(f => f.getGeometry().transform(srsIn, srsOut));
        throw "should not be necessary, perform on server, cloning will prevent insert key from updating";
      }

      let format = this.options.formatter;
      let toInsert = toSave.filter(f => !f.get(this.options.featureIdFieldName));
      let toUpdate = toSave.filter(f => !!f.get(this.options.featureIdFieldName));

      if (this.options.converter && toInsert.length) {
        //toInsert = toInsert.map(f => f.clone());
        toInsert.forEach(f => f.setGeometry(this.options.converter(f.getGeometry())));
      }

      toInsert.forEach(f => f.set(this.options.lastUpdateFieldName, undefined));
      toUpdate.forEach(f => f.set(this.options.lastUpdateFieldName, undefined));
      toDelete.forEach(f => f.set(this.options.lastUpdateFieldName, undefined));

      let requestBody = format.writeTransaction(
        toInsert,
        toUpdate,
        toDelete,
        {
          featureNS: this.options.featureNS,
          featurePrefix: this.options.featurePrefix,
          featureType: featureType,
          srsName: this.options.srsName,
          nativeElements: []
        });

      type ResponseType = {
        "transactionSummary": {
          "totalInserted": number;
          "totalUpdated": number;
          "totalDeleted": number;
        },
        "insertIds": string[]
      };

      $.ajax({
        type: "POST",
        url: this.options.wfsUrl,
        data: serializer.serializeToString(requestBody),
        contentType: "application/xml",
        dataType: "xml",
        success: (response: XMLDocument) => {
          let responseInfo = <ResponseType><any>format.readTransactionResponse(response);
          if (responseInfo.transactionSummary.totalDeleted) {
            console.log("totalDeleted: ", responseInfo.transactionSummary.totalDeleted);
          }
          if (responseInfo.transactionSummary.totalInserted) {
            console.log("totalInserted: ", responseInfo.transactionSummary.totalInserted);
          }
          if (responseInfo.transactionSummary.totalUpdated) {
            console.log("totalUpdated: ", responseInfo.transactionSummary.totalUpdated);
          }

          console.assert(toInsert.length === responseInfo.transactionSummary.totalInserted, "number inserted should equal number of new keys");

          if (this.options.converter) {
            //let originalToInsert = toSave.filter(f => !f.get(this.options.featureIdFieldName));
            //originalToInsert.forEach((f, i) => f.setGeometry(toInsert[i].getGeometry()));
          }

          toInsert.forEach((f, i) => {
            let id = responseInfo.insertIds[i];
            f.set(this.options.featureIdFieldName, id.split(".").pop());
            f.setId(id);
          });

        }
      });
    };

    this.lastSavedTime = Date.now();
    Object.keys(this.options.targets).forEach(k => {
      saveTo(this.options.targets[k], <ol.geom.GeometryType>k);
    });

  }


}
