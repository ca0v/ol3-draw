declare module "bower_components/ol3-fun/ol3-fun/common" {
    export function parse<T>(v: string, type: T): T;
    export function getQueryParameters(options: any, url?: string): void;
    export function getParameterByName(name: string, url?: string): string;
    export function doif<T>(v: T, cb: (v: T) => void): void;
    export function mixin<A extends any, B extends any>(a: A, b: B): A & B;
    export function defaults<A extends any, B extends any>(a: A, ...b: B[]): A & B;
    export function cssin(name: string, css: string): () => void;
    export function debounce(func: () => void, wait?: number): () => void;
    /**
     * poor $(html) substitute due to being
     * unable to create <td>, <tr> elements
     */
    export function html(html: string): HTMLElement;
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
    export interface IOptions extends olx.control.ControlOptions {
        map?: ol.Map;
        className?: string;
        position?: string;
        label?: string;
        title?: string;
        eventName?: string;
        buttonType?: typeof Button;
    }
    export class Button extends ol.control.Control {
        static DEFAULT_OPTIONS: IOptions;
        static create(options?: IOptions): Button;
        options: IOptions;
        constructor(options: IOptions);
        cssin(): void;
        setMap(map: ol.Map): void;
    }
}
declare module "ol3-draw/ol3-draw" {
    import ol = require("openlayers");
    import { Button, IOptions as IButtonOptions } from "ol3-draw/ol3-button";
    export interface DrawControlOptions extends IButtonOptions {
        map?: ol.Map;
        layers?: Array<ol.layer.Vector>;
        geometryType?: "Point" | "LineString" | "LinearRing" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon" | "GeometryCollection" | "Circle";
    }
    export class Draw extends Button {
        static DEFAULT_OPTIONS: DrawControlOptions;
        options: DrawControlOptions;
        static create(options?: DrawControlOptions): Button;
        private interactions;
        private createInteraction();
        setMap(map: ol.Map): void;
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
declare module "ol3-draw/ol3-delete" {
    import ol = require("openlayers");
    import { Button, IOptions as IButtonOptions } from "ol3-draw/ol3-button";
    export interface DeleteControlOptions extends IButtonOptions {
    }
    export class Delete extends Button {
        static DEFAULT_OPTIONS: DeleteControlOptions;
        options: DeleteControlOptions;
        static create(options?: DeleteControlOptions): Button;
        setMap(map: ol.Map): void;
    }
}
declare module "ol3-draw/ol3-edit" {
    import ol = require("openlayers");
    import { Button, IOptions as IButtonOptions } from "ol3-draw/ol3-button";
    export interface EditControlOptions extends IButtonOptions {
    }
    export class Modify extends Button {
        static DEFAULT_OPTIONS: EditControlOptions;
        static create(options?: EditControlOptions): Button;
        options: EditControlOptions;
        setMap(map: ol.Map): void;
    }
}
declare module "ol3-draw/ol3-translate" {
    import ol = require("openlayers");
    import { Button, IOptions as IButtonOptions } from "ol3-draw/ol3-button";
    export interface IOptions extends IButtonOptions {
    }
    export class Translate extends Button {
        static DEFAULT_OPTIONS: IOptions;
        static create(options?: IOptions): Button;
        setMap(map: ol.Map): void;
    }
}
declare module "ol3-draw/mapmaker" {
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
declare module "ol3-draw/examples/ol3-draw" {
    export function run(): void;
}
