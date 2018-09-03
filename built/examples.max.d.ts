/// <reference types="jquery" />
declare module "node_modules/ol3-fun/ol3-fun/common" {
    /**
     * Generate a UUID
     * @returns UUID
     *
     * Adapted from http://stackoverflow.com/a/2117523/526860
     */
    export function uuid(): string;
    export function asArray<T extends HTMLInputElement>(list: NodeList): T[];
    /***
     * ie11 compatible version of e.classList.toggle
     * if class exists then remove it and return false, if not, then add it and return true.
     * @param force true to add specified class value, false to remove it.
     * @returns true if className exists.
     */
    export function toggle(e: HTMLElement, className: string, force?: boolean): boolean;
    export function parse<T>(v: string, type: T): T;
    /**
     * @param options Attributes on this object with be assigned the value of the matching parameter in the query string
     * @param url The url to scan
     */
    export function getQueryParameters(options: any, url?: string): void;
    /**
     * @param name Extract parameter of this name from the query string
     * @param url Search this url
     */
    export function getParameterByName(name: string, url?: string): string;
    /**
     * @param v passing a non-trivial value will invoke the callback with this as the sole argument
     * @param cb callback to execute when the value is non-trivial (not null, not undefined)
     */
    export function doif<T>(v: T, cb: (v: T) => void): void;
    /**
     * @param a target
     * @param b values to shallow copy into target
     */
    export function mixin<A extends any, B extends any>(a: A, b: B): A & B;
    /**
     * @param a target
     * @param b values to copy into target if they are not already present
     */
    export function defaults<A extends any, B extends any>(a: A, ...b: B[]): A & B;
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
    export function debounce<T extends Function>(func: T, wait?: number, immediate?: boolean): T;
    /**
     * poor $(html) substitute due to being
     * unable to create <td>, <tr> elements
     */
    export function html(html: string): HTMLElement;
    export function pair<A, B>(a1: A[], a2: B[]): [A, B][];
    export function range(n: number): number[];
    export function shuffle<T>(array: T[]): T[];
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
declare module "node_modules/ol3-symbolizer/ol3-symbolizer/common/mixin" {
    /**
     * Shallow copies source into target, already available in numerous libraries including ol3-fun so does not belong here
     * This implementation always overwrites the target with the source values (_.default does not replace values)
     * @param a target
     * @param b source
     */
    export function mixin<A extends any, B extends any>(a: A, b: B): A & B;
}
declare module "node_modules/ol3-symbolizer/ol3-symbolizer/common/doif" {
    export function doif<T>(v: T, cb: (v: T) => void): void;
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
declare module "node_modules/ol3-symbolizer/index" {
    import Symbolizer = require("node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer");
    import { Format } from "./ol3-symbolizer/format/@types/formats";
    export { Symbolizer, Format };
}
declare module "ol3-draw/ol3-draw" {
    import ol = require("openlayers");
    import { Button, ButtonOptions as ButtonOptions } from "ol3-draw/ol3-button";
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
declare module "node_modules/ol3-fun/ol3-fun/navigation" {
    import * as ol from "openlayers";
    /**
     * A less disorienting way of changing the maps extent (maybe!)
     * Zoom out until new feature is visible
     * Zoom to that feature
     */
    export function zoomToFeature(map: ol.Map, feature: ol.Feature, options?: {
        duration?: number;
        padding?: number;
        minResolution?: number;
    }): JQuery.Deferred<any, any, any>;
}
declare module "node_modules/ol3-fun/ol3-fun/parse-dms" {
    export function parse(dmsString: string): {
        lon: number;
        lat: number;
    } | number;
}
declare module "node_modules/ol3-fun/index" {
    import common = require("node_modules/ol3-fun/ol3-fun/common");
    import navigation = require("node_modules/ol3-fun/ol3-fun/navigation");
    import dms = require("node_modules/ol3-fun/ol3-fun/parse-dms");
    let index: typeof common & {
        dms: typeof dms;
        navigation: typeof navigation;
    };
    export = index;
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
declare module "examples/mapmaker" {
    import ol = require("openlayers");
    import { olx } from "openlayers";
    import { Button, Draw } from "index";
    export class MapMaker {
        static DEFAULT_OPTIONS: olx.MapOptions;
        static create(options: {
            target: Element;
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
