var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("bower_components/ol3-fun/ol3-fun/common", ["require", "exports"], function (require, exports) {
    "use strict";
    function parse(v, type) {
        if (typeof type === "string")
            return v;
        if (typeof type === "number")
            return parseFloat(v);
        if (typeof type === "boolean")
            return (v === "1" || v === "true");
        if (Array.isArray(type)) {
            return (v.split(",").map(function (v) { return parse(v, type[0]); }));
        }
        throw "unknown type: " + type;
    }
    exports.parse = parse;
    function getQueryParameters(options, url) {
        if (url === void 0) { url = window.location.href; }
        var opts = options;
        Object.keys(opts).forEach(function (k) {
            doif(getParameterByName(k, url), function (v) {
                var value = parse(v, opts[k]);
                if (value !== undefined)
                    opts[k] = value;
            });
        });
    }
    exports.getQueryParameters = getQueryParameters;
    function getParameterByName(name, url) {
        if (url === void 0) { url = window.location.href; }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    exports.getParameterByName = getParameterByName;
    function doif(v, cb) {
        if (v !== undefined && v !== null)
            cb(v);
    }
    exports.doif = doif;
    function mixin(a, b) {
        Object.keys(b).forEach(function (k) { return a[k] = b[k]; });
        return a;
    }
    exports.mixin = mixin;
    function defaults(a) {
        var b = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            b[_i - 1] = arguments[_i];
        }
        b.forEach(function (b) {
            Object.keys(b).filter(function (k) { return a[k] === undefined; }).forEach(function (k) { return a[k] = b[k]; });
        });
        return a;
    }
    exports.defaults = defaults;
    function cssin(name, css) {
        var id = "style-" + name;
        var styleTag = document.getElementById(id);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = id;
            styleTag.innerText = css;
            document.head.appendChild(styleTag);
        }
        var dataset = styleTag.dataset;
        dataset["count"] = parseInt(dataset["count"] || "0") + 1 + "";
        return function () {
            dataset["count"] = parseInt(dataset["count"] || "0") - 1 + "";
            if (dataset["count"] === "0") {
                styleTag.remove();
            }
        };
    }
    exports.cssin = cssin;
    function debounce(func, wait) {
        if (wait === void 0) { wait = 50; }
        var h;
        return function () {
            clearTimeout(h);
            h = setTimeout(function () { return func(); }, wait);
        };
    }
    exports.debounce = debounce;
    /**
     * poor $(html) substitute due to being
     * unable to create <td>, <tr> elements
     */
    function html(html) {
        var d = document;
        var a = d.createElement("div");
        var b = d.createDocumentFragment();
        a.innerHTML = html;
        while (a.firstChild)
            b.appendChild(a.firstChild);
        return b.firstElementChild;
    }
    exports.html = html;
});
define("bower_components/ol3-symbolizer/ol3-symbolizer/format/base", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("bower_components/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer", ["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    function doif(v, cb) {
        if (v !== undefined && v !== null)
            cb(v);
    }
    function mixin(a, b) {
        Object.keys(b).forEach(function (k) { return a[k] = b[k]; });
        return a;
    }
    var StyleConverter = (function () {
        function StyleConverter() {
        }
        StyleConverter.prototype.fromJson = function (json) {
            return this.deserializeStyle(json);
        };
        StyleConverter.prototype.toJson = function (style) {
            return this.serializeStyle(style);
        };
        /**
         * uses the interior point of a polygon when rendering a 'point' style
         */
        StyleConverter.prototype.setGeometry = function (feature) {
            var geom = feature.getGeometry();
            if (geom instanceof ol.geom.Polygon) {
                geom = geom.getInteriorPoint();
            }
            return geom;
        };
        StyleConverter.prototype.assign = function (obj, prop, value) {
            //let getter = prop[0].toUpperCase() + prop.substring(1);
            if (value === null)
                return;
            if (value === undefined)
                return;
            if (typeof value === "object") {
                if (Object.keys(value).length === 0)
                    return;
            }
            if (prop === "image") {
                if (value.hasOwnProperty("radius")) {
                    prop = "circle";
                }
                if (value.hasOwnProperty("points")) {
                    prop = "star";
                }
            }
            obj[prop] = value;
        };
        StyleConverter.prototype.serializeStyle = function (style) {
            var _this = this;
            var s = {};
            if (!style)
                return null;
            if (typeof style === "string")
                return style;
            if (typeof style === "number")
                return style;
            if (style.getColor)
                mixin(s, this.serializeColor(style.getColor()));
            if (style.getImage)
                this.assign(s, "image", this.serializeStyle(style.getImage()));
            if (style.getFill)
                this.assign(s, "fill", this.serializeFill(style.getFill()));
            if (style.getOpacity)
                this.assign(s, "opacity", style.getOpacity());
            if (style.getStroke)
                this.assign(s, "stroke", this.serializeStyle(style.getStroke()));
            if (style.getText)
                this.assign(s, "text", this.serializeStyle(style.getText()));
            if (style.getWidth)
                this.assign(s, "width", style.getWidth());
            if (style.getOffsetX)
                this.assign(s, "offset-x", style.getOffsetX());
            if (style.getOffsetY)
                this.assign(s, "offset-y", style.getOffsetY());
            if (style.getWidth)
                this.assign(s, "width", style.getWidth());
            if (style.getFont)
                this.assign(s, "font", style.getFont());
            if (style.getRadius)
                this.assign(s, "radius", style.getRadius());
            if (style.getRadius2)
                this.assign(s, "radius2", style.getRadius2());
            if (style.getPoints)
                this.assign(s, "points", style.getPoints());
            if (style.getAngle)
                this.assign(s, "angle", style.getAngle());
            if (style.getRotation)
                this.assign(s, "rotation", style.getRotation());
            if (style.getOrigin)
                this.assign(s, "origin", style.getOrigin());
            if (style.getScale)
                this.assign(s, "scale", style.getScale());
            if (style.getSize)
                this.assign(s, "size", style.getSize());
            if (style.getAnchor) {
                this.assign(s, "anchor", style.getAnchor());
                "anchorXUnits,anchorYUnits,anchorOrigin".split(",").forEach(function (k) {
                    _this.assign(s, k, style[k + "_"]);
                });
            }
            // "svg"
            if (style.path) {
                if (style.path)
                    this.assign(s, "path", style.path);
                if (style.getImageSize)
                    this.assign(s, "imgSize", style.getImageSize());
                if (style.stroke)
                    this.assign(s, "stroke", style.stroke);
                if (style.fill)
                    this.assign(s, "fill", style.fill);
                if (style.scale)
                    this.assign(s, "scale", style.scale); // getScale and getImgSize are modified in deserializer               
                if (style.imgSize)
                    this.assign(s, "imgSize", style.imgSize);
            }
            // "icon"
            if (style.getSrc)
                this.assign(s, "src", style.getSrc());
            if (s.points && s.radius !== s.radius2)
                s.points /= 2; // ol3 defect doubles point count when r1 <> r2  
            return s;
        };
        StyleConverter.prototype.serializeColor = function (color) {
            if (color instanceof Array) {
                return {
                    color: ol.color.asString(color)
                };
            }
            else if (color instanceof CanvasGradient) {
                return {
                    gradient: color
                };
            }
            else if (color instanceof CanvasPattern) {
                return {
                    pattern: color
                };
            }
            else if (typeof color === "string") {
                return {
                    color: color
                };
            }
            throw "unknown color type";
        };
        StyleConverter.prototype.serializeFill = function (fill) {
            return this.serializeStyle(fill);
        };
        StyleConverter.prototype.deserializeStyle = function (json) {
            var _this = this;
            var image;
            var text;
            var fill;
            var stroke;
            if (json.circle)
                image = this.deserializeCircle(json.circle);
            else if (json.star)
                image = this.deserializeStar(json.star);
            else if (json.icon)
                image = this.deserializeIcon(json.icon);
            else if (json.svg)
                image = this.deserializeSvg(json.svg);
            else if (json.image && (json.image.img || json.image.path))
                image = this.deserializeSvg(json.image);
            else if (json.image && json.image.src)
                image = this.deserializeIcon(json.image);
            else if (json.image)
                throw "unknown image type";
            if (json.text)
                text = this.deserializeText(json.text);
            if (json.fill)
                fill = this.deserializeFill(json.fill);
            if (json.stroke)
                stroke = this.deserializeStroke(json.stroke);
            var s = new ol.style.Style({
                image: image,
                text: text,
                fill: fill,
                stroke: stroke
            });
            image && s.setGeometry(function (feature) { return _this.setGeometry(feature); });
            return s;
        };
        StyleConverter.prototype.deserializeText = function (json) {
            json.rotation = json.rotation || 0;
            json.scale = json.scale || 1;
            var _a = [json["offset-x"] || 0, json["offset-y"] || 0], x = _a[0], y = _a[1];
            {
                var p = new ol.geom.Point([x, y]);
                p.rotate(json.rotation, [0, 0]);
                p.scale(json.scale, json.scale);
                _b = p.getCoordinates(), x = _b[0], y = _b[1];
            }
            return new ol.style.Text({
                fill: json.fill && this.deserializeFill(json.fill),
                stroke: json.stroke && this.deserializeStroke(json.stroke),
                text: json.text,
                font: json.font,
                offsetX: x,
                offsetY: y,
                rotation: json.rotation,
                scale: json.scale
            });
            var _b;
        };
        StyleConverter.prototype.deserializeCircle = function (json) {
            var image = new ol.style.Circle({
                radius: json.radius,
                fill: json.fill && this.deserializeFill(json.fill),
                stroke: json.stroke && this.deserializeStroke(json.stroke)
            });
            image.setOpacity(json.opacity);
            return image;
        };
        StyleConverter.prototype.deserializeStar = function (json) {
            var image = new ol.style.RegularShape({
                radius: json.radius,
                radius2: json.radius2,
                points: json.points,
                angle: json.angle,
                fill: json.fill && this.deserializeFill(json.fill),
                stroke: json.stroke && this.deserializeStroke(json.stroke)
            });
            doif(json.rotation, function (v) { return image.setRotation(v); });
            doif(json.opacity, function (v) { return image.setOpacity(v); });
            return image;
        };
        StyleConverter.prototype.deserializeIcon = function (json) {
            if (!json.anchor) {
                json.anchor = [json["anchor-x"] || 0.5, json["anchor-y"] || 0.5];
            }
            var image = new ol.style.Icon({
                anchor: json.anchor || [0.5, 0.5],
                anchorOrigin: json.anchorOrigin || "top-left",
                anchorXUnits: json.anchorXUnits || "fraction",
                anchorYUnits: json.anchorYUnits || "fraction",
                //crossOrigin?: string;
                img: undefined,
                imgSize: undefined,
                offset: json.offset,
                offsetOrigin: json.offsetOrigin,
                opacity: json.opacity,
                scale: json.scale,
                snapToPixel: json.snapToPixel,
                rotateWithView: json.rotateWithView,
                rotation: json.rotation,
                size: json.size,
                src: json.src,
                color: json.color
            });
            image.load();
            return image;
        };
        StyleConverter.prototype.deserializeSvg = function (json) {
            json.rotation = json.rotation || 0;
            json.scale = json.scale || 1;
            if (json.img) {
                var symbol = document.getElementById(json.img);
                if (!symbol) {
                    throw "unable to find svg element: " + json.img;
                }
                if (symbol) {
                    // but just grab the path is probably good enough
                    var path = (symbol.getElementsByTagName("path")[0]);
                    if (path) {
                        if (symbol.viewBox) {
                            if (!json.imgSize) {
                                json.imgSize = [symbol.viewBox.baseVal.width, symbol.viewBox.baseVal.height];
                            }
                        }
                        json.path = (json.path || "") + path.getAttribute('d');
                    }
                }
            }
            var canvas = document.createElement("canvas");
            if (json.path) {
                {
                    // rotate a rectangle and get the resulting extent
                    _a = json.imgSize.map(function (v) { return v * json.scale; }), canvas.width = _a[0], canvas.height = _a[1];
                    if (json.stroke && json.stroke.width) {
                        var dx = 2 * json.stroke.width * json.scale;
                        canvas.width += dx;
                        canvas.height += dx;
                    }
                }
                var ctx = canvas.getContext('2d');
                var path2d = new Path2D(json.path);
                // rotate  before it is in the canvas (avoids pixelation)
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.scale(json.scale, json.scale);
                ctx.translate(-json.imgSize[0] / 2, -json.imgSize[1] / 2);
                if (json.fill) {
                    ctx.fillStyle = json.fill.color;
                    ctx.fill(path2d);
                }
                if (json.stroke) {
                    ctx.strokeStyle = json.stroke.color;
                    ctx.lineWidth = json.stroke.width;
                    ctx.stroke(path2d);
                }
            }
            var icon = new ol.style.Icon({
                img: canvas,
                imgSize: [canvas.width, canvas.height],
                rotation: json.rotation,
                scale: 1,
                anchor: json.anchor || [canvas.width / 2, canvas.height],
                anchorOrigin: json.anchorOrigin,
                anchorXUnits: json.anchorXUnits || "pixels",
                anchorYUnits: json.anchorYUnits || "pixels",
                //crossOrigin?: string;
                offset: json.offset,
                offsetOrigin: json.offsetOrigin,
                opacity: json.opacity,
                snapToPixel: json.snapToPixel,
                rotateWithView: json.rotateWithView,
                size: [canvas.width, canvas.height],
                src: undefined
            });
            return mixin(icon, {
                path: json.path,
                stroke: json.stroke,
                fill: json.fill,
                scale: json.scale,
                imgSize: json.imgSize
            });
            var _a;
        };
        StyleConverter.prototype.deserializeFill = function (json) {
            var fill = new ol.style.Fill({
                color: json && this.deserializeColor(json)
            });
            return fill;
        };
        StyleConverter.prototype.deserializeStroke = function (json) {
            var stroke = new ol.style.Stroke();
            doif(json.color, function (v) { return stroke.setColor(v); });
            doif(json.lineCap, function (v) { return stroke.setLineCap(v); });
            doif(json.lineDash, function (v) { return stroke.setLineDash(v); });
            doif(json.lineJoin, function (v) { return stroke.setLineJoin(v); });
            doif(json.miterLimit, function (v) { return stroke.setMiterLimit(v); });
            doif(json.width, function (v) { return stroke.setWidth(v); });
            return stroke;
        };
        StyleConverter.prototype.deserializeColor = function (fill) {
            if (fill.color) {
                return fill.color;
            }
            if (fill.gradient) {
                var type = fill.gradient.type;
                var gradient_1;
                if (0 === type.indexOf("linear(")) {
                    gradient_1 = this.deserializeLinearGradient(fill.gradient);
                }
                else if (0 === type.indexOf("radial(")) {
                    gradient_1 = this.deserializeRadialGradient(fill.gradient);
                }
                if (fill.gradient.stops) {
                    // preserve
                    mixin(gradient_1, {
                        stops: fill.gradient.stops
                    });
                    var stops = fill.gradient.stops.split(";");
                    stops = stops.map(function (v) { return v.trim(); });
                    stops.forEach(function (colorstop) {
                        var stop = colorstop.match(/ \d+%/m)[0];
                        var color = colorstop.substr(0, colorstop.length - stop.length);
                        gradient_1.addColorStop(parseInt(stop) / 100, color);
                    });
                }
                return gradient_1;
            }
            if (fill.pattern) {
                var repitition = fill.pattern.repitition;
                var canvas = document.createElement('canvas');
                var spacing = canvas.width = canvas.height = fill.pattern.spacing | 6;
                var context = canvas.getContext('2d');
                context.fillStyle = fill.pattern.color;
                switch (fill.pattern.orientation) {
                    case "horizontal":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(i, 0, 1, 1);
                        }
                        break;
                    case "vertical":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(0, i, 1, 1);
                        }
                        break;
                    case "cross":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(i, 0, 1, 1);
                            context.fillRect(0, i, 1, 1);
                        }
                        break;
                    case "forward":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(i, i, 1, 1);
                        }
                        break;
                    case "backward":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(spacing - 1 - i, i, 1, 1);
                        }
                        break;
                    case "diagonal":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(i, i, 1, 1);
                            context.fillRect(spacing - 1 - i, i, 1, 1);
                        }
                        break;
                }
                return mixin(context.createPattern(canvas, repitition), fill.pattern);
            }
            throw "invalid color configuration";
        };
        StyleConverter.prototype.deserializeLinearGradient = function (json) {
            var rx = /\w+\((.*)\)/m;
            var _a = JSON.parse(json.type.replace(rx, "[$1]")), x0 = _a[0], y0 = _a[1], x1 = _a[2], y1 = _a[3];
            var canvas = document.createElement('canvas');
            // not correct, assumes points reside on edge
            canvas.width = Math.max(x0, x1);
            canvas.height = Math.max(y0, y1);
            var context = canvas.getContext('2d');
            var gradient = context.createLinearGradient(x0, y0, x1, y1);
            mixin(gradient, {
                type: "linear(" + [x0, y0, x1, y1].join(",") + ")"
            });
            return gradient;
        };
        StyleConverter.prototype.deserializeRadialGradient = function (json) {
            var rx = /radial\((.*)\)/m;
            var _a = JSON.parse(json.type.replace(rx, "[$1]")), x0 = _a[0], y0 = _a[1], r0 = _a[2], x1 = _a[3], y1 = _a[4], r1 = _a[5];
            var canvas = document.createElement('canvas');
            // not correct, assumes radial centered
            canvas.width = 2 * Math.max(x0, x1);
            canvas.height = 2 * Math.max(y0, y1);
            var context = canvas.getContext('2d');
            var gradient = context.createRadialGradient(x0, y0, r0, x1, y1, r1);
            mixin(gradient, {
                type: "radial(" + [x0, y0, r0, x1, y1, r1].join(",") + ")"
            });
            return gradient;
        };
        return StyleConverter;
    }());
    exports.StyleConverter = StyleConverter;
});
define("bower_components/ol3-symbolizer/index", ["require", "exports", "bower_components/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer"], function (require, exports, Symbolizer) {
    "use strict";
    return Symbolizer;
});
define("ol3-draw/ol3-draw", ["require", "exports", "openlayers", "bower_components/ol3-fun/ol3-fun/common", "bower_components/ol3-symbolizer/index"], function (require, exports, ol, common_1, ol3_symbolizer_1) {
    "use strict";
    var converter = new ol3_symbolizer_1.StyleConverter();
    function stopInteraction(map, type) {
        map.getInteractions()
            .getArray()
            .filter(function (i) { return i instanceof type; })
            .forEach(function (t) { return t.setActive(false); });
    }
    function addInteraction(map, action) {
        map.addInteraction(action);
        action.on("change:active", function () {
            map.dispatchEvent({
                type: "interaction-active",
                interaction: action
            });
        });
    }
    var Draw = (function (_super) {
        __extends(Draw, _super);
        function Draw(options) {
            var _this = _super.call(this, options) || this;
            _this.options = options;
            _this.interactions = {};
            var button = common_1.html("<input type=\"button\" value=\"" + options.label + "\" />");
            button.title = options.title;
            options.element.appendChild(button);
            button.addEventListener("click", function () {
                var interaction = _this.interactions[options.geometryType];
                var wasDrawing = interaction && interaction.getActive();
                if (_this.isDrawing()) {
                    _this.stopDrawing();
                }
                if (!wasDrawing) {
                    if (!interaction) {
                        interaction = _this.interactions[options.geometryType] = _this.createInteraction();
                    }
                    _this.stopEditing();
                    interaction.setActive(true);
                }
            });
            return _this;
        }
        Draw.create = function (options) {
            common_1.cssin("ol-draw", "\n            .ol-draw {\n                position: absolute;\n                background: #ccc;\n            }\n            .ol-draw.active {\n                background-color: white;\n            }\n            .ol-draw.top {\n                top: 0.5em;\n            }\n            .ol-draw.top-1 {\n                top: 1.5em;\n            }\n            .ol-draw.top-2 {\n                top: 2.5em;\n            }\n            .ol-draw.top-3 {\n                top: 3.5em;\n            }\n            .ol-draw.top-4 {\n                top: 4.5em;\n            }\n            .ol-draw.right {\n                right: 0.5em;\n            }\n            .ol-draw.right-1 {\n                right: 1.5em;\n            }\n            .ol-draw.right-2 {\n                right: 2.5em;\n            }\n            .ol-draw.right-3 {\n                right: 3.5em;\n            }\n            .ol-draw.right-4 {\n                right: 4.5em;\n            }\n            .ol-draw.right-5 {\n                right: 5.5em;\n            }\n            .ol-draw.right-6 {\n                right: 6.5em;\n            }\n            .ol-draw input[type=\"button\"] {\n                background: transparent;\n                border: none;\n                width: 2em;\n                height: 2em;\n            }\n        ");
            options = common_1.mixin(common_1.mixin({}, Draw.DEFAULT_OPTIONS), options);
            if (!options.className) {
                options.className = 'ol-draw top right';
            }
            if (!options.element) {
                options.element = document.createElement("div");
                document.body.appendChild(options.element);
                options.element.className = options.className;
            }
            if (!options.target) {
                options.target = document.createElement("div");
                document.body.appendChild(options.target);
            }
            if (options.render) {
                throw "create a sub-class to override render";
            }
            if (!options.geometryType) {
                options.geometryType = "Point";
            }
            options.element.className = options.className;
            return new Draw(options);
        };
        Draw.prototype.stopEditing = function () {
            var map = this.getMap();
            stopInteraction(map, ol.interaction.Modify);
            stopInteraction(map, ol.interaction.Select);
        };
        Draw.prototype.isDrawing = function () {
            var map = this.getMap();
            var drawTools = map.getInteractions().getArray()
                .filter(function (i) { return i instanceof ol.interaction.Draw; });
            return 0 < drawTools.length;
        };
        Draw.prototype.createInteraction = function () {
            var _this = this;
            var options = this.options;
            var source = options.layers[0].getSource();
            var draw = new ol.interaction.Draw({
                type: options.geometryType,
                source: source
            });
            draw.setActive(false);
            draw.on("change:active", function () {
                return _this.options.element.classList.toggle("active", draw.getActive());
            });
            addInteraction(this.getMap(), draw);
            return draw;
        };
        Draw.prototype.stopDrawing = function () {
            var map = this.getMap();
            var drawTools = map.getInteractions().getArray()
                .filter(function (i) { return i instanceof ol.interaction.Draw; });
            drawTools.forEach(function (t) { return t.setActive(false); });
        };
        Draw.prototype.setMap = function (map) {
            var options = this.options;
            _super.prototype.setMap.call(this, map);
            var style = [
                {
                    circle: {
                        radius: 12,
                        opacity: 1,
                        fill: {
                            color: "rgba(0,0,0,0.5)"
                        },
                        stroke: {
                            color: "rgba(255,255,255,1)",
                            width: 3
                        }
                    }
                },
                {
                    fill: {
                        color: "rgba(0,0,0,0.5)"
                    },
                    stroke: {
                        color: "rgba(255,255,255,1)",
                        width: 3
                    }
                },
                {
                    stroke: {
                        color: "rgba(0,0,0,1)",
                        width: 1
                    }
                }
            ].map(function (s) { return converter.fromJson(s); });
            if (!options.layers) {
                var layer = new ol.layer.Vector({
                    style: style,
                    source: new ol.source.Vector()
                });
                map.addLayer(layer);
                options.layers = [layer];
            }
        };
        return Draw;
    }(ol.control.Control));
    Draw.DEFAULT_OPTIONS = {
        className: "ol-draw top right",
        geometryType: "Point",
        label: "Draw",
        title: "Draw"
    };
    exports.Draw = Draw;
});
define("index", ["require", "exports", "ol3-draw/ol3-draw"], function (require, exports, Draw) {
    "use strict";
    return Draw;
});
define("ol3-draw/examples/index", ["require", "exports"], function (require, exports) {
    "use strict";
    function run() {
        var l = window.location;
        var path = "" + l.origin + l.pathname + "?run=ol3-draw/examples/";
        var labs = "\n    index\n    ol3-draw\n    ";
        var styles = document.createElement("style");
        document.head.appendChild(styles);
        styles.innerText += "\n    #map {\n        display: none;\n    }\n    .test {\n        margin: 20px;\n    }\n    ";
        var html = labs
            .split(/ /)
            .map(function (v) { return v.trim(); })
            .filter(function (v) { return !!v; })
            .map(function (lab) { return "<div class='test'><a href='" + path + lab + "&debug=0'>" + lab + "</a></div>"; })
            .join("\n");
        html += "<a href='" + l.origin + l.pathname + "?run=ol3-draw/tests/index'>tests</a>";
        document.write(html);
    }
    exports.run = run;
    ;
});
define("ol3-draw/examples/mapmaker", ["require", "exports", "openlayers", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, ol, common_2) {
    "use strict";
    var MapMaker = (function () {
        function MapMaker() {
        }
        MapMaker.create = function (options) {
            options = common_2.mixin(common_2.mixin({}, MapMaker.DEFAULT_OPTIONS), options);
            options.target.classList.add("ol-map");
            common_2.cssin("mapmaker", "\n        .ol-map {\n            top: 0;\n            left: 0;\n            right: 0;\n            bottom:0;\n            position: absolute;\n        }\n        ");
            var map = new ol.Map({
                target: options.target,
                keyboardEventTarget: document,
                loadTilesWhileAnimating: true,
                loadTilesWhileInteracting: true,
                controls: ol.control.defaults({ attribution: false }),
                view: new ol.View({
                    projection: options.projection,
                    center: options.center,
                    zoom: options.zoom
                }),
                layers: [
                    new ol.layer.Tile({
                        opacity: 0.8,
                        source: new ol.source.OSM()
                    })
                ]
            });
            return map;
        };
        return MapMaker;
    }());
    MapMaker.DEFAULT_OPTIONS = {};
    exports.MapMaker = MapMaker;
});
define("ol3-draw/ol3-button", ["require", "exports", "openlayers", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, ol, common_3) {
    "use strict";
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(options) {
            var _this = _super.call(this, options) || this;
            _this.options = options;
            var button = common_3.html("<input type=\"button\" value=\"" + options.label + "\" />");
            button.title = options.title;
            options.element.appendChild(button);
            _this.set("active", false);
            button.addEventListener("click", function () { return _this.set("active", !_this.get("active")); });
            _this.on("change:active", function () { return _this.options.element.classList.toggle("active", _this.get("active")); });
            return _this;
        }
        Button.create = function (options) {
            common_3.cssin("ol-button", "\n            .ol-button {\n                position: absolute;\n                background: #ccc;\n            }\n            .ol-button.active {\n                background-color: white;\n            }\n            .ol-button.top {\n                top: 0.5em;\n            }\n            .ol-button.top-1 {\n                top: 1.5em;\n            }\n            .ol-button.top-2 {\n                top: 2.5em;\n            }\n            .ol-button.top-3 {\n                top: 3.5em;\n            }\n            .ol-button.top-4 {\n                top: 4.5em;\n            }\n            .ol-button.right {\n                right: 0.5em;\n            }\n            .ol-button.right-1 {\n                right: 1.5em;\n            }\n            .ol-button.right-2 {\n                right: 2.5em;\n            }\n            .ol-button.right-3 {\n                right: 3.5em;\n            }\n            .ol-button.right-4 {\n                right: 4.5em;\n            }\n            .ol-button.right-5 {\n                right: 5.5em;\n            }\n            .ol-button.right-6 {\n                right: 6.5em;\n            }\n            .ol-button input[type=\"button\"] {\n                background: transparent;\n                border: none;\n                width: 2em;\n                height: 2em;\n            }\n        ");
            options = common_3.mixin(common_3.mixin({}, Button.DEFAULT_OPTIONS), options);
            if (!options.element) {
                options.element = document.createElement("div");
                document.body.appendChild(options.element);
                options.element.className = options.className;
            }
            if (!options.target) {
                options.target = document.createElement("div");
                document.body.appendChild(options.target);
            }
            if (options.render) {
                throw "create a sub-class to override render";
            }
            options.element.className = options.className;
            return new Button(options);
        };
        Button.prototype.setMap = function (map) {
            var _this = this;
            var options = this.options;
            _super.prototype.setMap.call(this, map);
            this.on("change:active", function () {
                map.dispatchEvent({
                    type: options.eventName,
                    control: _this
                });
            });
        };
        return Button;
    }(ol.control.Control));
    Button.DEFAULT_OPTIONS = {
        className: "ol-button top right",
        label: "Button",
        title: "Button",
        eventName: "click:button"
    };
    exports.Button = Button;
});
define("ol3-draw/ol3-edit", ["require", "exports", "openlayers", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, ol, common_4) {
    "use strict";
    function stopInteraction(map, type) {
        map.getInteractions()
            .getArray()
            .filter(function (i) { return i instanceof type; })
            .forEach(function (t) { return t.setActive(false); });
    }
    function addInteraction(map, action) {
        map.addInteraction(action);
        action.on("change:active", function () {
            map.dispatchEvent({
                type: "interaction-active",
                interaction: action
            });
        });
    }
    var Modify = (function (_super) {
        __extends(Modify, _super);
        function Modify(options) {
            var _this = _super.call(this, options) || this;
            _this.options = options;
            var button = common_4.html("<input type=\"button\" value=\"" + options.label + "\" />");
            button.title = options.title;
            options.element.appendChild(button);
            button.addEventListener("click", function () { return _this.dispatchEvent("button-click"); });
            return _this;
        }
        Modify.create = function (options) {
            options = common_4.mixin(common_4.mixin({}, Modify.DEFAULT_OPTIONS), options);
            common_4.cssin("ol-edit", "\n            .ol-edit {\n                position: absolute;\n                background-color: #ccc;\n            }\n            .ol-edit.active {\n                background-color: white;\n            }\n            .ol-edit.top {\n                top: 0.5em;\n            }\n            .ol-edit.top-1 {\n                top: 1.5em;\n            }\n            .ol-edit.top-2 {\n                top: 2.5em;\n            }\n            .ol-edit.top-3 {\n                top: 3.5em;\n            }\n            .ol-edit.top-4 {\n                top: 4.5em;\n            }\n            .ol-edit.right {\n                right: 0.5em;\n            }\n            .ol-edit.right-1 {\n                right: 1.5em;\n            }\n            .ol-edit.right-2 {\n                right: 2.5em;\n            }\n            .ol-edit.right-3 {\n                right: 3.5em;\n            }\n            .ol-edit.right-4 {\n                right: 4.5em;\n            }\n            .ol-edit input[type=\"button\"] {\n                background: transparent;\n                border: none;\n                width: 2em;\n                height: 2em;\n            }\n        ");
            if (!options.element) {
                options.element = document.createElement("div");
                document.body.appendChild(options.element);
                options.element.className = options.className;
            }
            return new Modify(options);
        };
        Modify.prototype.setMap = function (map) {
            var _this = this;
            _super.prototype.setMap.call(this, map);
            var select = new ol.interaction.Select({
                wrapX: false
            });
            select.setActive(false);
            addInteraction(map, select);
            select.on("change:active", function () { return _this.options.element.classList.toggle("active", select.getActive()); });
            select.on("select", function (args) {
                var modify = new ol.interaction.Modify({
                    features: select.getFeatures()
                });
                addInteraction(map, modify);
                modify.setActive(true);
            });
            this.on("button-click", function () {
                stopInteraction(map, ol.interaction.Modify);
                stopInteraction(map, ol.interaction.Draw);
                select.setActive(!select.getActive());
            });
        };
        return Modify;
    }(ol.control.Control));
    Modify.DEFAULT_OPTIONS = {
        className: "ol-edit top right",
        label: "Edit",
        title: "Edit"
    };
    exports.Modify = Modify;
});
define("ol3-draw/examples/ol3-draw", ["require", "exports", "openlayers", "ol3-draw/ol3-button", "ol3-draw/ol3-draw", "ol3-draw/ol3-edit", "ol3-draw/examples/mapmaker"], function (require, exports, ol, ol3_button_1, ol3_draw_1, ol3_edit_1, mapmaker_1) {
    "use strict";
    function stopInteraction(map, type) {
        map.getInteractions()
            .getArray()
            .filter(function (i) { return i instanceof type; })
            .forEach(function (t) { return t.setActive(false); });
    }
    function stopControl(map, type) {
        map.getControls()
            .getArray()
            .filter(function (i) { return i instanceof type; })
            .forEach(function (t) { return t.set("active", false); });
    }
    function run() {
        var map = mapmaker_1.MapMaker.create({
            target: document.getElementsByClassName("map")[0],
            projection: 'EPSG:4326',
            center: [-82.4, 34.85],
            zoom: 15,
            basemap: "osm"
        });
        //▲ ▬ ◇ ● ◯ ▧ ★
        map.addControl(ol3_draw_1.Draw.create({ geometryType: "Polygon", label: "▧", className: "ol-draw right-6 top" }));
        map.addControl(ol3_draw_1.Draw.create({ geometryType: "MultiLineString", label: "▬", className: "ol-draw right-4 top" }));
        map.addControl(ol3_draw_1.Draw.create({ geometryType: "Point", label: "●", className: "ol-edit right-2 top" }));
        map.addControl(ol3_edit_1.Modify.create({ label: "Δ", className: "ol-edit right top" }));
        map.addControl(ol3_button_1.Button.create({ label: "X", title: "Delete", className: "ol-button top-2 right-2", eventName: "delete-drawing" }));
        map.addControl(ol3_button_1.Button.create({ label: "0", title: "Clear", className: "ol-button top-2 right", eventName: "clear-drawings" }));
        {
            var select_1 = new ol.interaction.Select();
            select_1.setActive(false);
            select_1.on("select", function (args) {
                var features = args.selected;
                map.getControls()
                    .getArray()
                    .filter(function (i) { return i instanceof ol3_draw_1.Draw; })
                    .forEach(function (t) { return t.options.layers.forEach(function (l) {
                    features.forEach(function (f) {
                        try {
                            l.getSource().removeFeature(f);
                        }
                        catch (ex) {
                        }
                    });
                }); });
                select_1.setActive(false);
                select_1.setActive(true);
            });
            map.addInteraction(select_1);
            map.on("delete-drawing", function (args) {
                if (args.control.get("active")) {
                    stopInteraction(map, ol.interaction.Draw);
                    stopInteraction(map, ol.interaction.Modify);
                    stopInteraction(map, ol.interaction.Select);
                    select_1.setActive(true);
                }
                else {
                    select_1.setActive(false);
                }
            });
        }
        map.on("clear-drawings", function () {
            map.getControls()
                .getArray()
                .filter(function (i) { return i instanceof ol3_draw_1.Draw; })
                .forEach(function (t) { return t.options.layers.forEach(function (l) { return l.getSource().clear(); }); });
            stopControl(map, ol3_button_1.Button);
            stopInteraction(map, ol.interaction.Draw);
            stopInteraction(map, ol.interaction.Modify);
            stopInteraction(map, ol.interaction.Select);
        });
        map.on("interaction-active", function (args) {
            stopControl(map, ol3_button_1.Button);
            if (args.interaction instanceof ol3_draw_1.Draw) {
                if (args.interaction.getActive()) {
                    stopInteraction(map, ol.interaction.Modify);
                    stopInteraction(map, ol.interaction.Select);
                }
            }
            if (args.interaction instanceof ol.interaction.Select) {
                if (args.interaction.getActive()) {
                    stopInteraction(map, ol.interaction.Draw);
                    stopInteraction(map, ol.interaction.Modify);
                }
            }
        });
    }
    exports.run = run;
});
//# sourceMappingURL=index.js.map