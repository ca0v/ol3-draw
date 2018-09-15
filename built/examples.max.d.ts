/// <reference types="jquery" />
declare module "node_modules/ol3-fun/ol3-fun/common" {
    /**
     * Generate a UUID
     * @returns UUID
     *
     * Adapted from http://stackoverflow.com/a/2117523/526860
     */
    export function uuid(): string;
    /**
     * Converts a GetElementsBy* to a classic array
     * @param list HTML collection to be converted to standard array
     * @returns The @param list represented as a native array of elements
     */
    export function asArray<T extends HTMLInputElement>(list: NodeList | HTMLCollectionOf<Element>): T[];
    /***
     * ie11 compatible version of e.classList.toggle
     * if class exists then remove it and return false, if not, then add it and return true.
     * @param force true to add specified class value, false to remove it.
     * @returns true if className exists.
     */
    export function toggle(e: HTMLElement, className: string, force?: boolean): boolean;
    /**
     * Converts a string representation of a value to it's desired type (e.g. parse("1", 0) returns 1)
     * @param v string representation of desired return value
     * @param type desired type
     * @returns @param v converted to a @param type
     */
    export function parse<T>(v: string, type: T): T;
    /**
     * Replaces the options elements with the actual query string parameter values (e.g. {a: 0, "?a=10"} becomes {a: 10})
     * @param options Attributes on this object with be assigned the value of the matching parameter in the query string
     * @param url The url to scan
     */
    export function getQueryParameters(options: any, url?: string): void;
    /**
     * Returns individual query string value from a url
     * @param name Extract parameter of this name from the query string
     * @param url Search this url
     * @returns parameter value
     */
    export function getParameterByName(name: string, url?: string): string;
    /**
     * Only execute callback when @param v is truthy
     * @param v passing a non-trivial value will invoke the callback with this as the sole argument
     * @param cb callback to execute when the value is non-trivial (not null, not undefined)
     */
    export function doif<T>(v: T, cb: (v: T) => void): void;
    /**
     * shallow copies b into a, replacing any existing values in a
     * @param a target
     * @param b values to shallow copy into target
     */
    export function mixin<A extends any, B extends any>(a: A, ...b: B[]): A & B;
    /**
     * shallow copies b into a, preserving any existing values in a
     * @param a target
     * @param b values to copy into target if they are not already present
     */
    export function defaults<A extends any, B extends any>(a: A, ...b: B[]): A & B;
    /**
     * delay execution of a method
     * @param func invoked after @param wait milliseconds
     * @param immediate true to invoke @param func before waiting
     */
    export function debounce<T extends Function>(func: T, wait?: number, immediate?: boolean): T;
    /**
     * poor $(html) substitute due to being
     * unable to create <td>, <tr> elements
     */
    export function html(html: string): HTMLElement;
    /**
     * returns all combinations of a1 with a2 (a1 X a2 pairs)
     * @param a1 1xN matrix of first elements
     * @param a2 1xN matrix of second elements
     * @returns 2xN^2 matrix of a1 x a2 combinations
     */
    export function pair<A, B>(a1: A[], a2: B[]): [A, B][];
    /**
     * Returns an array [0..n)
     * @param n number of elements
     */
    export function range(n: number): number[];
    /**
     * in-place shuffling of an array
     * @see http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * @param array array to randomize
     */
    export function shuffle<T>(array: T[]): T[];
}
declare module "node_modules/ol3-fun/ol3-fun/css" {
    /**
     * Adds exactly one instance of the CSS to the app with a mechanism
     * for disposing by invoking the destructor returned by this method.
     * Note the css will not be removed until the dependency count reaches
     * 0 meaning the number of calls to cssin('id') must match the number
     * of times the destructor is invoked.
     * let d1 = cssin('foo', '.foo { background: white }');
     * let d2 = cssin('foo', '.foo { background: white }');
     * d1(); // reduce dependency count
     * d2(); // really remove the css
     * @param name unique id for this style tag
     * @param css css content
     * @returns destructor
     */
    export function cssin(name: string, css: string): () => void;
    export function loadCss(options: {
        name: string;
        url?: string;
        css?: string;
    }): () => void;
}
declare module "node_modules/ol3-fun/ol3-fun/navigation" {
    import * as ol from "openlayers";
    /**
     * A less disorienting way of changing the maps extent (maybe!)
     * Zoom out until new feature is visible
     * Zoom to that feature
     * @param map The openlayers map
     * @param feature The feature to zoom to
     * @param options Animation constraints
     */
    export function zoomToFeature(map: ol.Map, feature: ol.Feature, options?: {
        duration?: number;
        padding?: number;
        minResolution?: number;
    }): JQuery.Deferred<any, any, any>;
}
declare module "node_modules/ol3-fun/ol3-fun/parse-dms" {
    /**
     * Converts DMS<->LonLat
     * @param value A DMS string or lonlat coordinate to be converted
     */
    export function parse(value: {
        lon: number;
        lat: number;
    }): string;
    export function parse(value: string): {
        lon: number;
        lat: number;
    } | number;
}
declare module "node_modules/ol3-fun/ol3-fun/slowloop" {
    /**
     * Executes a series of functions in a delayed manner
     * @param functions one function executes per interval
     * @param interval length of the interval in milliseconds
     * @param cycles number of types to run each function
     * @returns promise indicating the process is complete
     */
    export function slowloop(functions: Array<Function>, interval?: number, cycles?: number): JQuery.Deferred<any, any, any>;
}
declare module "node_modules/ol3-fun/ol3-fun/is-primitive" {
    export function isPrimitive(a: any): boolean;
}
declare module "node_modules/ol3-fun/ol3-fun/is-cyclic" {
    /**
     * Determine if an object refers back to itself
     */
    export function isCyclic(a: any): boolean;
}
declare module "node_modules/ol3-fun/ol3-fun/deep-extend" {
    /**
     * Each merge action is recorded in a trace item
     */
    export interface TraceItem {
        path?: Path;
        target: Object;
        key: string | number;
        value: any;
        was: any;
    }
    /**
     * Internally tracks visited objects for cycle detection
     */
    type History = Array<object>;
    type Path = Array<any>;
    /**
     * deep mixin, replacing items in a with items in b
     * array items with an "id" are used to identify pairs, otherwise b overwrites a
     * @param a object to extend
     * @param b data to inject into the object
     * @param trace optional change tracking
     * @param history object added here are not visited
     */
    export function extend<A extends object>(a: A, b?: Partial<A>, trace?: Array<TraceItem>, history?: History): A;
}
declare module "node_modules/ol3-fun/index" {
    /**
     * decouples API from implementation
     */
    import { asArray, debounce, defaults, doif, getParameterByName, getQueryParameters, html, mixin, pair, parse, range, shuffle, toggle, uuid } from "node_modules/ol3-fun/ol3-fun/common";
    import { cssin, loadCss } from "node_modules/ol3-fun/ol3-fun/css";
    import { zoomToFeature } from "node_modules/ol3-fun/ol3-fun/navigation";
    import { parse as dmsParse } from "node_modules/ol3-fun/ol3-fun/parse-dms";
    import { slowloop } from "node_modules/ol3-fun/ol3-fun/slowloop";
    import { extend as deepExtend } from "node_modules/ol3-fun/ol3-fun/deep-extend";
    let index: {
        asArray: typeof asArray;
        cssin: typeof cssin;
        loadCss: typeof loadCss;
        debounce: typeof debounce;
        defaults: typeof defaults;
        doif: typeof doif;
        deepExtend: typeof deepExtend;
        getParameterByName: typeof getParameterByName;
        getQueryParameters: typeof getQueryParameters;
        html: typeof html;
        mixin: typeof mixin;
        pair: typeof pair;
        parse: typeof parse;
        range: typeof range;
        shuffle: typeof shuffle;
        toggle: typeof toggle;
        uuid: typeof uuid;
        slowloop: typeof slowloop;
        dms: {
            parse: typeof dmsParse;
            fromDms: (dms: string) => {
                lon: number;
                lat: number;
            };
            fromLonLat: (o: {
                lon: number;
                lat: number;
            }) => string;
        };
        navigation: {
            zoomToFeature: typeof zoomToFeature;
        };
    };
    export = index;
}
declare module "node_modules/ol3-symbolizer/ol3-symbolizer/common/assign" {
    /**
     *
     * @param obj The target object
     * @param prop The property name
     * @param value The property value
     */
    export function assign(obj: any, prop: string, value: any): void;
}
declare module "node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-cross" {
    import { Format } from "../@types/formats";
    export class Shapeshifter {
        /**
         * @param style does this style represent a cross?
         */
        static is(style: Format.Style): boolean;
        /**
         *
         * @param style return this style as a cross json encoding
         */
        static as(style: Format.Style): Format.Style;
        static inverse(style: Format.Style): Format.Style;
    }
}
declare module "node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-square" {
    import { Format } from "../@types/formats";
    export class Shapeshifter {
        /**
         * @param style does this style represent a square?
         */
        static is(style: Format.Style): boolean;
        /**
         *
         * @param style return this style as a cross json encoding
         */
        static as(style: Format.Style): Format.Style;
        static inverse(style: Format.Style): Format.Style;
    }
}
declare module "node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-diamond" {
    import { Format } from "../@types/formats";
    export class Shapeshifter {
        /**
         * @param style does this style represent a diamond?
         */
        static is(style: Format.Style): boolean;
        /**
         *
         * @param style return this style as a cross json encoding
         */
        static as(style: Format.Style): Format.Style;
        static inverse(style: Format.Style): Format.Style;
    }
}
declare module "node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-triangle" {
    import { Format } from "../@types/formats";
    export class Shapeshifter {
        /**
         * @param style does this style represent a triangle?
         */
        static is(style: Format.Style): boolean;
        /**
         *
         * @param style return this style as a cross json encoding
         */
        static as(style: Format.Style): Format.Style;
        static inverse(style: Format.Style): Format.Style;
    }
}
declare module "node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-x" {
    import { Format } from "../@types/formats";
    export class Shapeshifter {
        /**
         * @param style does this style represent a X?
         */
        static is(style: Format.Style): boolean;
        /**
         *
         * @param style return this style as a cross json encoding
         */
        static as(style: Format.Style): Format.Style;
        static inverse(style: Format.Style): Format.Style;
    }
}
declare module "node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer" {
    import ol = require("openlayers");
    import Serializer = require("./@types/base");
    import { Format } from "./@types/formats";
    export class StyleConverter implements Serializer.IConverter<Format.Style> {
        private converters;
        /**
         * Register shape shifters
         */
        constructor();
        fromJson(json: Format.Style): ol.style.Style;
        toJson(style: ol.style.Style): Format.Style;
        /**
         * uses the interior point of a polygon when rendering a 'point' style
         */
        getGeometry(feature: ol.Feature | ol.render.Feature): ol.geom.Geometry | ol.render.Feature;
        private serializeStyle;
        private serializeImage;
        private serializeStroke;
        private serializeText;
        private serializeColor;
        private serializeFill;
        private deserializeStyle;
        private deserializeText;
        private deserializeCircle;
        private deserializeStar;
        private deserializeIcon;
        private deserializeSvg;
        private deserializeFill;
        private deserializeStroke;
        private deserializeColor;
        private deserializeLinearGradient;
        private deserializeRadialGradient;
    }
}
declare module "ol3-draw/ol3-button" {
    import ol = require("openlayers");
    import { olx } from "openlayers";
    import { StyleConverter } from "node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer";
    export interface ButtonOptions extends olx.control.ControlOptions {
        map?: ol.Map;
        className?: string;
        position?: string;
        label?: string;
        title?: string;
        eventName?: string;
        buttonType?: typeof Button;
    }
    export class Button extends ol.control.Control {
        static DEFAULT_OPTIONS: ButtonOptions;
        static create(options?: ButtonOptions): Button;
        options: ButtonOptions;
        handlers: Array<() => void>;
        symbolizer: StyleConverter;
        constructor(options: ButtonOptions);
        setPosition(position: string): void;
        destroy(): void;
        cssin(): void;
        setMap(map: ol.Map): void;
    }
}
declare module "node_modules/ol3-symbolizer/ol3-symbolizer/format/ags-symbolizer" {
    import { ArcGisFeatureServerLayer } from "./@types/ArcGisFeatureServerLayer";
    export class StyleConverter {
        private asWidth;
        private asColor;
        private fromSFSSolid;
        private fromSFSForwardDiagonal;
        private fromSFSBackwardDiagonal;
        private fromSFS;
        private fromSMSCircle;
        private fromSMSCross;
        private fromSMSDiamond;
        private fromSMSPath;
        private fromSMSSquare;
        private fromSMSX;
        private fromSMS;
        private fromPMS;
        private fromSLSSolid;
        private fromSLS;
        private fromPFS;
        private fromTS;
        /**
         * Converts the ags symbol to an openlayers style, then the openlayers style to a JSON representation
         */
        fromJson(symbol: ArcGisFeatureServerLayer.Symbol): import("@types/openlayers/index").style.Style;
        private fromSymbol;
        /**
         * convert drawing info into a symbology rule
         */
        fromRenderer(renderer: ArcGisFeatureServerLayer.Renderer, args: {
            url: string;
        }): import("@types/openlayers/index").style.Style | ((feature: import("@types/openlayers/index").Feature) => import("@types/openlayers/index").style.Style);
    }
}
declare module "node_modules/ol3-symbolizer/index" {
    import Symbolizer = require("node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer");
    import { StyleConverter as AgsStyleConverter } from "node_modules/ol3-symbolizer/ol3-symbolizer/format/ags-symbolizer";
    import { StyleConverter } from "node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer";
    import { Format } from "./ol3-symbolizer/format/@types/formats";
    export { Symbolizer, AgsStyleConverter, StyleConverter, Format };
}
declare module "ol3-draw/ol3-draw" {
    import ol = require("openlayers");
    import { Button, ButtonOptions } from "ol3-draw/ol3-button";
    import { Format } from "node_modules/ol3-symbolizer/index";
    export interface DrawControlOptions extends ButtonOptions {
        map?: ol.Map;
        layers?: Array<ol.layer.Vector>;
        style?: Format.Style[];
        geometryType?: "Point" | "LineString" | "LinearRing" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon" | "GeometryCollection" | "Circle";
        geometryName?: string;
    }
    export class Draw extends Button {
        static DEFAULT_OPTIONS: DrawControlOptions;
        options: DrawControlOptions;
        static create(options?: DrawControlOptions): Button;
        private interactions;
        private createInteraction;
        constructor(options: DrawControlOptions);
    }
}
declare module "ol3-draw/ol3-delete" {
    import ol = require("openlayers");
    import { Button, ButtonOptions as IButtonOptions } from "ol3-draw/ol3-button";
    import { Format } from "node_modules/ol3-symbolizer/index";
    export interface DeleteControlOptions extends IButtonOptions {
        multi?: boolean;
        style?: {
            [name: string]: Format.Style[];
        };
        selection?: ol.interaction.Select;
        boxSelectCondition?: (mapBrowserEvent: ol.MapBrowserEvent) => boolean;
    }
    export class Delete extends Button {
        static DEFAULT_OPTIONS: DeleteControlOptions;
        options: DeleteControlOptions;
        static create(options?: DeleteControlOptions): Button;
        private featureLayerAssociation_;
        private addFeatureLayerAssociation;
        constructor(options: DeleteControlOptions);
        clear(): void;
        delete(): void;
    }
}
declare module "ol3-draw/ol3-edit" {
    import { Button, ButtonOptions as IButtonOptions } from "ol3-draw/ol3-button";
    import { Format } from "node_modules/ol3-symbolizer/index";
    export interface ModifyControlOptions extends IButtonOptions {
        style?: {
            [name: string]: Format.Style[];
        };
    }
    export class Modify extends Button {
        static DEFAULT_OPTIONS: ModifyControlOptions;
        static create(options?: ModifyControlOptions): Button;
        options: ModifyControlOptions;
        constructor(options: ModifyControlOptions);
    }
}
declare module "ol3-draw/ol3-translate" {
    import { Button, ButtonOptions as IButtonOptions } from "ol3-draw/ol3-button";
    import { Format } from "node_modules/ol3-symbolizer/index";
    export interface TranslateControlOptions extends IButtonOptions {
        style?: {
            [name: string]: Format.Style[];
        };
    }
    export class Translate extends Button {
        static DEFAULT_OPTIONS: TranslateControlOptions;
        static create(options?: TranslateControlOptions): Button;
        constructor(options: TranslateControlOptions);
    }
}
declare module "ol3-draw/ol3-select" {
    import ol = require("openlayers");
    import { Button, ButtonOptions as IButtonOptions } from "ol3-draw/ol3-button";
    import { Format } from "node_modules/ol3-symbolizer/index";
    export interface SelectOptions extends IButtonOptions {
        multi?: boolean;
        style?: {
            [name: string]: Format.Style[];
        };
        boxSelectCondition?: (mapBrowserEvent: ol.MapBrowserEvent) => boolean;
    }
    export class Select extends Button {
        static DEFAULT_OPTIONS: SelectOptions;
        static create(options?: SelectOptions): Button;
        constructor(options: SelectOptions);
    }
}
declare module "ol3-draw/ol3-note" {
    import ol = require("openlayers");
    import { Button, ButtonOptions } from "ol3-draw/ol3-button";
    import { Format } from "node_modules/ol3-symbolizer/index";
    /**
     * Draws a point that renders as a ol.overlay at a certain zoom level
     * with a textarea allow user to enter notes
     * Click "Add Note" then click the map.  Done.
     */
    export interface NoteControlOptions extends ButtonOptions {
        geometryName?: string;
        layer?: ol.layer.Vector;
        noteFieldName?: string;
        style?: Format.Style[];
    }
    export class Note extends Button {
        static DEFAULT_OPTIONS: NoteControlOptions;
        static create(options?: NoteControlOptions): Button;
        options: NoteControlOptions;
        private overlayMap;
        constructor(options: NoteControlOptions);
        private forceOverlay;
        private createOverlay;
        cssin(): void;
    }
}
declare module "ol3-draw/ol3-history" {
    import ol = require("openlayers");
    export interface NavHistoryOptions {
        map?: ol.Map;
        delay?: number;
    }
    export class NavHistory {
        options: NavHistoryOptions;
        static DEFAULT_OPTIONS: NavHistoryOptions;
        static create(options: NavHistoryOptions): NavHistory;
        private constructor();
    }
}
declare module "ol3-draw/services/wfs-sync" {
    /**
     * Automatically post changes to a WFS-T service
     */
    import ol = require("openlayers");
    export interface WfsSyncOptions {
        wfsUrl: string;
        source: ol.source.Vector;
        featureNS: string;
        featurePrefix: string;
        formatter?: ol.format.WFS;
        targets: {
            [name: string]: string;
        };
        lastUpdateFieldName?: string;
        srsName?: string;
        sourceSrs?: string;
        featureIdFieldName?: string;
        converter?: (geom: ol.geom.Geometry) => ol.geom.Geometry;
    }
    export class WfsSync {
        private options;
        private lastSavedTime;
        private deletes;
        static DEFAULT_OPTIONS: WfsSyncOptions;
        static create(options?: WfsSyncOptions): WfsSync;
        private constructor();
        private _onhash;
        on(name: string, cb: (args: any) => void | boolean): void;
        private trigger;
        /**
         * start watching the feature collection, saving when there's a lull in the action
         */
        private watch;
        /**
         * Performs the actual save of a list of feature (immutable)
         */
        private saveDrawings;
    }
}
declare module "ol3-draw/measure-extension" {
    import ol = require("openlayers");
    export interface MeasurementOptions {
        map?: ol.Map;
        draw?: ol.Object;
        edit?: ol.Object;
        uom?: string;
        measureCurrentSegment?: boolean;
    }
    export class Measurement {
        options: MeasurementOptions;
        static DEFAULT_OPTIONS: MeasurementOptions;
        private measureTooltipElement;
        private measureTooltip;
        static create(options?: MeasurementOptions): Measurement;
        private constructor();
        private createMeasureTooltip;
        private flatten;
        private computeDistances;
        /**
         * Format length output.
         * @param {ol.geom.LineString} line The line.
         * @return {string} The formatted length.
         */
        private formatLength;
        private formatLengths;
    }
}
declare module "index" {
    /**
     * Consider ways of breaking from this pattern of just proxying
     * and provides some useful out-of-the-box configurations
     * e.g. create() puts all available control in a top-right toolbar
     */
    import { Draw } from "ol3-draw/ol3-draw";
    import { Button } from "ol3-draw/ol3-button";
    import { Delete } from "ol3-draw/ol3-delete";
    import { Modify } from "ol3-draw/ol3-edit";
    import { Translate } from "ol3-draw/ol3-translate";
    import { Select } from "ol3-draw/ol3-select";
    import { Note } from "ol3-draw/ol3-note";
    import { NavHistory } from "ol3-draw/ol3-history";
    import { WfsSync } from "ol3-draw/services/wfs-sync";
    import { Measurement } from "ol3-draw/measure-extension";
    export { Draw, Button, Delete, Modify, Translate, Select, Note, Measurement, NavHistory, WfsSync, };
}
declare module "examples/extras/mapmaker" {
    import ol = require("openlayers");
    import { olx } from "openlayers";
    import { Button, Draw } from "index";
    export class MapMaker {
        static DEFAULT_OPTIONS: olx.MapOptions;
        static create(options: {
            target?: Element;
            center: [number, number];
            projection: string;
            zoom: number;
            basemap: string;
        }): ol.Map & MapEventExtensions;
    }
    interface MapEventExtensions {
        on(type: "delete-feature", listener: (args: {
            control: Draw;
        }) => any): any;
        on(type: "draw-feature", listener: (args: {
            control: Draw;
        }) => any): any;
        on(type: "translate-feature", listener: (args: {
            control: Draw;
        }) => any): any;
        on(type: "modify-feature", listener: (args: {
            control: Draw;
        }) => any): any;
        on(type: "clear-drawings", listener: (args: {
            control: Button;
        }) => any): any;
    }
}
declare module "examples/measure" {
    export function run(): void;
}
declare module "examples/ol3-draw" {
    export function run(): void;
}
declare module "examples/ol3-history" {
    export function run(): void;
}
declare module "examples/index" {
    import "examples/measure";
    import "examples/ol3-draw";
    import "examples/ol3-history";
    export function run(): void;
}
