declare module "bower_components/ol3-fun/ol3-fun/common" {
    export function parse<T>(v: string, type: T): T;
    export function getQueryParameters(options: any, url?: string): void;
    export function getParameterByName(name: string, url?: string): string;
    export function doif<T>(v: T, cb: (v: T) => void): void;
    export function mixin<A extends any, B extends any>(a: A, b: B): A & B;
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
    export function range(n: number): any[];
    export function shuffle<T>(array: T[]): T[];
}
declare module "bower_components/ol3-symbolizer/ol3-symbolizer/format/base" {
    /**
     * implemented by all style serializers
     */
    export interface IConverter<T> {
        fromJson: (json: T) => ol.style.Style;
        toJson(style: ol.style.Style): T;
    }
}
declare module "bower_components/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer" {
    import ol = require("openlayers");
    import Serializer = require("bower_components/ol3-symbolizer/ol3-symbolizer/format/base");
    export namespace Format {
        type Color = number[] | string;
        type Size = number[];
        type Offset = number[];
        type LineDash = number[];
        interface Fill {
            color?: string;
            gradient?: {
                type?: string;
                stops?: string;
            };
        }
        interface Stroke {
            color?: string;
            width?: number;
            lineCap?: string;
            lineJoin?: string;
            lineDash?: LineDash;
            miterLimit?: number;
        }
        interface Style {
            fill?: Fill;
            image?: Image;
            stroke?: Stroke;
            text?: Text;
            zIndex?: number;
        }
        interface Image {
            opacity?: number;
            rotateWithView?: boolean;
            rotation?: number;
            scale?: number;
            snapToPixel?: boolean;
        }
        interface Circle {
            radius: number;
            stroke?: Stroke;
            fill?: Fill;
            snapToPixel?: boolean;
        }
        interface Star extends Image {
            angle?: number;
            fill?: Fill;
            points?: number;
            stroke?: Stroke;
            radius?: number;
            radius2?: number;
        }
        interface Icon extends Image {
            anchor?: Offset;
            anchorOrigin?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
            anchorXUnits?: "fraction" | "pixels";
            anchorYUnits?: "fraction" | "pixels";
            color?: Color;
            crossOrigin?: string;
            src?: string;
            offset?: Offset;
            offsetOrigin?: 'top_left' | 'top_right' | 'bottom-left' | 'bottom-right';
            size?: Size;
        }
        interface Text {
            fill?: Fill;
            font?: string;
            offsetX?: number;
            offsetY?: number;
            rotation?: number;
            scale?: number;
            stroke?: Stroke;
            text?: string;
            textAlign?: string;
            textBaseline?: string;
        }
    }
    export namespace Format {
        interface Style {
            image?: Icon & Svg;
            icon?: Icon;
            svg?: Svg;
            star?: Star;
            circle?: Circle;
            text?: Text;
            fill?: Fill;
            stroke?: Stroke;
        }
        interface Icon {
            "anchor-x"?: number;
            "anchor-y"?: number;
        }
        interface Text {
            "offset-x"?: number;
            "offset-y"?: number;
        }
        interface Circle {
            opacity?: number;
        }
        interface Svg {
            anchor?: Offset;
            anchorOrigin?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
            anchorXUnits?: string;
            anchorYUnits?: string;
            color?: Color;
            crossOrigin?: string;
            img?: string;
            imgSize?: Size;
            offset?: Offset;
            offsetOrigin?: 'top_left' | 'top_right' | 'bottom-left' | 'bottom-right';
            path?: string;
            stroke?: Stroke;
            fill?: Fill;
        }
    }
    export class StyleConverter implements Serializer.IConverter<Format.Style> {
        fromJson(json: Format.Style): ol.style.Style;
        toJson(style: ol.style.Style): Format.Style;
        /**
         * uses the interior point of a polygon when rendering a 'point' style
         */
        setGeometry(feature: ol.Feature): ol.geom.Geometry;
        private assign(obj, prop, value);
        private serializeStyle(style);
        private serializeColor(color);
        private serializeFill(fill);
        private deserializeStyle(json);
        private deserializeText(json);
        private deserializeCircle(json);
        private deserializeStar(json);
        private deserializeIcon(json);
        private deserializeSvg(json);
        private deserializeFill(json);
        private deserializeStroke(json);
        private deserializeColor(fill);
        private deserializeLinearGradient(json);
        private deserializeRadialGradient(json);
    }
}
declare module "bower_components/ol3-symbolizer/index" {
    import Symbolizer = require("bower_components/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer");
    export = Symbolizer;
}
declare module "ol3-draw/ol3-button" {
    import ol = require("openlayers");
    import { StyleConverter } from "bower_components/ol3-symbolizer/index";
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
declare module "ol3-draw/ol3-draw" {
    import ol = require("openlayers");
    import { Button, ButtonOptions as ButtonOptions } from "ol3-draw/ol3-button";
    import { Format } from "bower_components/ol3-symbolizer/index";
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
        private createInteraction();
        constructor(options: DrawControlOptions);
    }
}
declare module "index" {
    /**
     * Consider ways of breaking from this pattern of just proxying
     * and provides some useful out-of-the-box configurations
     * e.g. create() puts all available control in a top-right toolbar
     */
    import Draw = require("ol3-draw/ol3-draw");
    export = Draw;
}
declare module "ol3-draw/examples/index" {
    export function run(): void;
}
declare module "ol3-draw/examples/mapmaker" {
    import ol = require("openlayers");
    export class MapMaker {
        static DEFAULT_OPTIONS: olx.MapOptions;
        static create(options: {
            target: Element;
            center: [number, number];
            projection: string;
            zoom: number;
            basemap: string;
        }): ol.Map;
    }
}
declare module "bower_components/ol3-fun/ol3-fun/navigation" {
    import ol = require("openlayers");
    /**
     * A less disorienting way of changing the maps extent (maybe!)
     * Zoom out until new feature is visible
     * Zoom to that feature
     */
    export function zoomToFeature(map: ol.Map, feature: ol.Feature, options?: {
        duration?: number;
        padding?: number;
        minResolution?: number;
    }): void;
}
declare module "bower_components/ol3-fun/ol3-fun/parse-dms" {
    export function parse(dmsString: string): number | {
        [x: number]: number;
    };
}
declare module "bower_components/ol3-fun/index" {
    import common = require("bower_components/ol3-fun/ol3-fun/common");
    import navigation = require("bower_components/ol3-fun/ol3-fun/navigation");
    import dms = require("bower_components/ol3-fun/ol3-fun/parse-dms");
    let index: typeof common & {
        dms: typeof dms;
        navigation: typeof navigation;
    };
    export = index;
}
declare module "ol3-draw/measure-extension" {
    import ol = require("openlayers");
    export interface MeasurementOptions {
        map?: ol.Map;
        draw?: ol.Object;
        uom?: string;
        measureCurrentSegment?: boolean;
    }
    export class Measurement {
        options: MeasurementOptions;
        static DEFAULT_OPTIONS: MeasurementOptions;
        private measureTooltipElement;
        private measureTooltip;
        static create(options?: MeasurementOptions): Measurement;
        private constructor(options);
        private createMeasureTooltip();
        /**
         * Format length output.
         * @param {ol.geom.LineString} line The line.
         * @return {string} The formatted length.
         */
        private formatLength(args);
    }
}
declare module "ol3-draw/examples/measure" {
    export function run(): void;
}
declare module "ol3-draw/ol3-delete" {
    import ol = require("openlayers");
    import { Button, ButtonOptions as IButtonOptions } from "ol3-draw/ol3-button";
    import { Format } from "bower_components/ol3-symbolizer/index";
    export interface DeleteControlOptions extends IButtonOptions {
        multi?: boolean;
        style?: {
            [name: string]: Format.Style[];
        };
        boxSelectCondition?: (mapBrowserEvent: ol.MapBrowserEvent) => boolean;
    }
    export class Delete extends Button {
        static DEFAULT_OPTIONS: DeleteControlOptions;
        options: DeleteControlOptions;
        static create(options?: DeleteControlOptions): Button;
        private featureLayerAssociation_;
        private addFeatureLayerAssociation(feature, layer);
        constructor(options: DeleteControlOptions);
    }
}
declare module "ol3-draw/ol3-edit" {
    import { Button, ButtonOptions as IButtonOptions } from "ol3-draw/ol3-button";
    import { Format } from "bower_components/ol3-symbolizer/index";
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
    import { Format } from "bower_components/ol3-symbolizer/index";
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
    import { Format } from "bower_components/ol3-symbolizer/index";
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
    import { Format } from "bower_components/ol3-symbolizer/index";
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
        private forceOverlay(feature);
        private createOverlay(feature);
        cssin(): void;
    }
}
declare module "ol3-draw/services/wfs-sync" {
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
        constructor(options: WfsSyncOptions);
        private watch();
        private saveDrawings(args);
    }
}
declare module "ol3-draw/examples/ol3-draw" {
    export function run(): void;
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
        private constructor(options);
    }
}
declare module "ol3-draw/examples/ol3-history" {
    export function run(): void;
}
