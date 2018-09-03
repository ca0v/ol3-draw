import ol = require("openlayers");
import $ = require("jquery");

import { cssin, getParameterByName } from "ol3-fun/ol3-fun/common";
import { Button, Delete, Draw, Modify, Translate, Select, Note, WfsSync } from "../index";
import { MapMaker } from "./mapmaker";


const GROUP_NAME = getParameterByName("GROUP_NAME") || "ol3-draw-examples";

const WFS_INFO = {
  srsName: "EPSG:3857",
  wfsUrl: `${location.protocol}//${location.hostname}:8080/geoserver/cite/wfs`,
  featureNS: "http://www.opengeospatial.net/cite",
  featurePrefix: "cite",
};

function stopInteraction(map: ol.Map, type: any) {
  map.getInteractions()
    .getArray()
    .filter(i => i instanceof type)
    .forEach(t => t.setActive(false));
}

function stopControl(map: ol.Map, type: any) {
  map.getControls()
    .getArray()
    .filter(i => i.get("active"))
    .filter(i => i instanceof type)
    .forEach(t => t.set("active", false));
}

function stopOtherControls(map: ol.Map, control: ol.control.Control) {
  map.getControls()
    .getArray()
    .filter(i => i.get("active"))
    .filter(i => typeof i === typeof control)
    .forEach(t => t !== control && t.set("active", false));
}

function loadAndWatch(args: {
  map?: ol.Map;
  featureType: string;
  geometryType: ol.geom.GeometryType;
  source: ol.source.Vector;
  converter?: (geom: ol.geom.Geometry) => ol.geom.Geometry;
}) {
  let serializer = new XMLSerializer();

  let format = new ol.format.WFS();

  let requestBody = format.writeGetFeature({
    featureNS: WFS_INFO.featureNS,
    featurePrefix: WFS_INFO.featurePrefix,
    featureTypes: [args.featureType],
    srsName: WFS_INFO.srsName,
    filter: ol.format.filter.equalTo("strname", GROUP_NAME),
    // geometryName: "geom",
    // bbox: [-9190000, 4020000, -9180000, 4030000],
  });

  let data = serializer.serializeToString(requestBody);

  $.ajax({
    type: "POST",
    url: WFS_INFO.wfsUrl,
    data: data,
    contentType: "application/xml",
    dataType: "xml",
    success: (response: XMLDocument) => {
      let features = format.readFeatures(response);
      features = features.filter(f => !!f.getGeometry());
      args.source.addFeatures(features);

      if (args.map) {
        let extent = args.map.getView().calculateExtent(args.map.getSize());
        features.forEach(f => ol.extent.extend(extent, f.getGeometry().getExtent()));
        args.map.getView().fit(extent, { size: args.map.getSize() });
      }

      WfsSync.create({
        wfsUrl: WFS_INFO.wfsUrl,
        featureNS: WFS_INFO.featureNS,
        featurePrefix: WFS_INFO.featurePrefix,
        srsName: WFS_INFO.srsName,
        sourceSrs: WFS_INFO.srsName,
        source: args.source,
        targets: {
          [args.geometryType]: args.featureType
        },
        converter: args.converter
      });

    }
  });
}

export function run() {

  let map = MapMaker.create({
    target: document.getElementsByClassName("map")[0],
    projection: WFS_INFO.srsName,
    center: <[number, number]>[-9167000, 4148000],
    zoom: 21,
    basemap: "osm"
  });

  //▲ ▬ ◇ ● ◯ ▧ ★

  let pointLayer = new ol.layer.Vector({ source: new ol.source.Vector() });
  let lineLayer = new ol.layer.Vector({ source: new ol.source.Vector() });
  let polygonLayer = new ol.layer.Vector({ source: new ol.source.Vector() });

  [polygonLayer, lineLayer, pointLayer].forEach(l => {
    map.addLayer(l);
    l.getSource().on("addfeature", (args: ol.source.VectorEvent) => {
      args.feature.set("strname", GROUP_NAME);
    });
  });

  let toolbar = [
    Select.create({ map: map, label: "?", eventName: "info", boxSelectCondition: ol.events.condition.primaryAction }),

    Draw.create({
      map: map, geometryType: "MultiPolygon", label: "▧", title: "Polygon",
      layers: [polygonLayer],
      style: [
        {
          fill: {
            color: "rgba(255,0,0,0.5)"
          },
          stroke: {
            color: "rgba(0,0,0,1)",
            width: 5
          }
        },
        {
          stroke: {
            color: "rgba(255,255,255,1)",
            width: 1
          }
        }

      ]
    }),
    Draw.create({
      map: map, geometryType: "Circle", label: "◯", title: "Circle",
      layers: [polygonLayer],
      style: [
        {
          fill: {
            color: "rgba(255,0,0,0.5)"
          },
          stroke: {
            color: "rgba(255,255,255,1)",
            width: 3
          }
        }
      ]
    }),

    Draw.create({
      map: map, geometryType: "MultiLineString", label: "▬", title: "Line",
      layers: [lineLayer]
    }),

    Draw.create({
      map: map, geometryType: "Point", label: "●", title: "Point",
      layers: [pointLayer]
    }),

    Draw.create({
      map: map, geometryType: "Point", label: "★", title: "Gradient", style: [
        {
          "star": {
            "fill": {
              "gradient": {
                "type": "linear(1,0,3,46)",
                "stops": "rgba(30,186,19,0.22) 0%;rgba(4,75,1,0.48) 70%;rgba(12,95,37,0.56) 77%;rgba(45,53,99,0.72) 100%"
              }
            },
            "opacity": 1,
            "stroke": {
              "color": "rgba(26,39,181,0.82)",
              "width": 8
            },
            "radius": 23,
            "radius2": 15,
            "points": 20,
            "scale": 1
          }
        }
      ]
    }),

    Translate.create({ map: map, label: "↔" }),
    Modify.create({ map: map, label: "Δ" }),

    Delete.create({ map: map, label: "␡", boxSelectCondition: ol.events.condition.primaryAction }),
    Button.create({ map: map, label: "⎚", title: "Clear", eventName: "clear-drawings" }),

    Button.create({ map: map, label: "💾", eventName: "save", title: "Save" }),
    Button.create({ map: map, label: "X", eventName: "exit", title: "Exit" }),

  ];

  toolbar.forEach((t, i) => t.setPosition(`left top${-i * 2 || ''}`));

  Note.create({
    map: map, position: "left-2 top", layer: pointLayer, noteFieldName: "url"
  });

  {

    let h = cssin("ol3-draw", `
        .ol-zoom { top: 0.5em; right: 0.5em; left: auto;}
        .ol-zoom button {color: rgba(0,60,136,1); background-color: transparent; }
        .ol-overviewmap { right: .5em; top: 4.5em; left: auto; bottom: auto;}
        `);
    map.on("exit", () => {
      toolbar.forEach(t => t.destroy());
      h();
    });

    map.on("info", (args: any) => {
      if (args.control.get("active")) {
        stopOtherControls(map, args.control);
        stopControl(map, Draw);
        stopControl(map, Delete);
        stopControl(map, Translate);
        stopControl(map, Modify);
      }
    });

    map.on("delete-feature", (args: { control: Draw }) => {
      if (args.control.get("active")) {
        stopOtherControls(map, args.control);
        stopControl(map, Draw);
        stopControl(map, Modify);
        stopControl(map, Translate);
        stopControl(map, Select);
      }
      return true;
    });

    map.on("draw-feature", (args: { control: Draw }) => {
      if (args.control.get("active")) {
        stopOtherControls(map, args.control);
        stopControl(map, Delete);
        stopControl(map, Modify);
        stopControl(map, Translate);
        stopControl(map, Select);
      }
      return true;
    });

    map.on("translate-feature", (args: { control: Draw }) => {
      if (args.control.get("active")) {
        stopOtherControls(map, args.control);
        stopControl(map, Delete);
        stopControl(map, Draw);
        stopControl(map, Modify);
        stopControl(map, Select);
      }
    });

    map.on("modify-feature", (args: { control: Draw }) => {
      if (args.control.get("active")) {
        stopOtherControls(map, args.control);
        stopControl(map, Delete);
        stopControl(map, Draw);
        stopControl(map, Translate);
        stopControl(map, Select);
      }
    });

    map.on("clear-drawings", (args: { control: Button }) => {
      if (args.control.get("active")) {
        stopControl(map, Delete);
        stopControl(map, Draw);
        stopControl(map, Translate);
        stopControl(map, Select);

        if (prompt("Are you sure you want to delete ALL the features?", "No!")) {
          console.log("Too dangerous, sorry");
          return false;
          map.getControls()
            .getArray()
            .filter(i => i instanceof Draw)
            .forEach(t => (<Draw>t).options.layers.forEach(l => l.getSource().clear()));
        };

      }
    });

  }

  loadAndWatch({
    map: map,
    geometryType: "Point",
    featureType: "addresses",
    source: pointLayer.getSource()
  });

  loadAndWatch({
    map: map,
    geometryType: "MultiLineString",
    featureType: "streets",
    source: lineLayer.getSource()
  });

  loadAndWatch({
    map: map,
    geometryType: "MultiPolygon",
    featureType: "parcels",
    source: polygonLayer.getSource()
  });

  loadAndWatch({
    map: map,
    geometryType: "Circle",
    featureType: "parcels",
    source: polygonLayer.getSource(),
    converter: (geom: ol.geom.Circle) => {
      let poly = ol.geom.Polygon.fromCircle(geom, 8);
      return new ol.geom.MultiPolygon([poly.getCoordinates()]);
    }
  });

}
