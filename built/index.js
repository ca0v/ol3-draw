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
    function cssin(name, css) {
        var id = "style-" + name;
        var styleTag = document.getElementById(id);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = id;
            styleTag.type = "text/css";
            styleTag.appendChild(document.createTextNode(css));
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
    function debounce(func, wait, immediate) {
        var _this = this;
        if (wait === void 0) { wait = 50; }
        if (immediate === void 0) { immediate = false; }
        var timeout;
        return (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var later = function () {
                timeout = null;
                if (!immediate)
                    func.apply(_this, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
                func.call(_this, args);
        });
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
    function pair(a1, a2) {
        var result = [];
        a1.forEach(function (v1) { return a2.forEach(function (v2) { return result.push([v1, v2]); }); });
        return result;
    }
    exports.pair = pair;
    function range(n) {
        var result = new Array(n);
        for (var i = 0; i < n; i++)
            result[i] = i;
        return result;
    }
    exports.range = range;
    // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffle(array) {
        var currentIndex = array.length;
        var temporaryValue;
        var randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    exports.shuffle = shuffle;
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
define("ol3-draw/ol3-button", ["require", "exports", "openlayers", "bower_components/ol3-fun/ol3-fun/common", "bower_components/ol3-symbolizer/index"], function (require, exports, ol, common_1, ol3_symbolizer_1) {
    "use strict";
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(options) {
            var _this = _super.call(this, options) || this;
            _this.options = options;
            _this.handlers = [];
            _this.symbolizer = new ol3_symbolizer_1.StyleConverter();
            _this.cssin();
            options.element.className = options.className + " " + options.position;
            var button = common_1.html("<input type=\"button\" value=\"" + options.label + "\" />");
            _this.handlers.push(function () { return options.element.remove(); });
            button.title = options.title;
            options.element.appendChild(button);
            _this.set("active", false);
            button.addEventListener("click", function () {
                _this.dispatchEvent("click");
                _this.set("active", !_this.get("active"));
            });
            _this.on("change:active", function () {
                _this.options.element.classList.toggle("active", _this.get("active"));
                options.map.dispatchEvent({
                    type: options.eventName,
                    control: _this
                });
            });
            return _this;
        }
        Button.create = function (options) {
            options = common_1.mixin(common_1.mixin({}, Button.DEFAULT_OPTIONS), options);
            options.element = options.element || document.createElement("DIV");
            var button = new (options.buttonType)(options);
            if (options.map) {
                options.map.addControl(button);
            }
            return button;
        };
        Button.prototype.setPosition = function (position) {
            var _this = this;
            this.options.position.split(' ')
                .forEach(function (k) { return _this.options.element.classList.remove(k); });
            position.split(' ')
                .forEach(function (k) { return _this.options.element.classList.add(k); });
            this.options.position = position;
        };
        Button.prototype.destroy = function () {
            this.handlers.forEach(function (h) { return h(); });
            this.setTarget(null);
        };
        Button.prototype.cssin = function () {
            var className = this.options.className;
            var positions = common_1.pair("top left right bottom".split(" "), common_1.range(24))
                .map(function (pos) { return "." + className + "." + (pos[0] + (-pos[1] || '')) + " { " + pos[0] + ":" + (0.5 + pos[1]) + "em; }"; });
            this.handlers.push(common_1.cssin(className, "\n            ." + className + " {\n                position: absolute;\n                background-color: rgba(255,255,255,.4);\n            }\n            ." + className + ".active {\n                background-color: white;\n            }\n            ." + className + ":hover {\n                background-color: white;\n            }\n            ." + className + " input[type=\"button\"] {\n                color: rgba(0,60,136,1);\n                background: transparent;\n                border: none;\n                width: 2em;\n                height: 2em;\n            }\n            " + positions.join('\n') + "\n        "));
        };
        Button.prototype.setMap = function (map) {
            var options = this.options;
            _super.prototype.setMap.call(this, map);
            options.map = map;
            if (!map) {
                this.destroy();
                return;
            }
        };
        return Button;
    }(ol.control.Control));
    Button.DEFAULT_OPTIONS = {
        className: "ol-button",
        position: "top right",
        label: "Button",
        title: "Button",
        eventName: "click:button",
        buttonType: Button
    };
    exports.Button = Button;
});
define("ol3-draw/ol3-draw", ["require", "exports", "openlayers", "ol3-draw/ol3-button", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, ol, ol3_button_1, common_2) {
    "use strict";
    var Draw = (function (_super) {
        __extends(Draw, _super);
        function Draw(options) {
            var _this = _super.call(this, options) || this;
            _this.interactions = {};
            _this.handlers.push(function () { return Object.keys(_this.interactions).forEach(function (k) {
                var interaction = _this.interactions[k];
                interaction.setActive(false);
                options.map.removeInteraction(interaction);
            }); });
            _this.on("change:active", function () {
                var active = _this.get("active");
                var interaction = _this.interactions[options.geometryType];
                if (active) {
                    if (!interaction) {
                        interaction = _this.interactions[options.geometryType] = _this.createInteraction();
                    }
                    interaction.setActive(true);
                }
                else {
                    interaction && interaction.setActive(false);
                }
            });
            var style = _this.options.style.map(function (s) { return _this.symbolizer.fromJson(s); });
            if (!options.layers) {
                var layer = new ol.layer.Vector({
                    style: style,
                    source: new ol.source.Vector()
                });
                options.map.addLayer(layer);
                options.layers = [layer];
            }
            return _this;
        }
        Draw.create = function (options) {
            options = common_2.mixin(common_2.mixin({}, Draw.DEFAULT_OPTIONS), options);
            return ol3_button_1.Button.create(options);
        };
        Draw.prototype.createInteraction = function () {
            var _this = this;
            var options = this.options;
            var source = options.layers[0].getSource();
            var style = options.style.map(function (s) { return _this.symbolizer.fromJson(s); });
            var draw = new ol.interaction.Draw({
                type: options.geometryType,
                geometryName: options.geometryName,
                source: source,
                style: style
            });
            draw.setActive(false);
            ["drawstart", "drawend"].forEach(function (eventName) {
                draw.on(eventName, function (args) { return _this.dispatchEvent(args); });
            });
            draw.on("change:active", function () {
                return _this.options.element.classList.toggle("active", draw.getActive());
            });
            options.map.addInteraction(draw);
            return draw;
        };
        return Draw;
    }(ol3_button_1.Button));
    Draw.DEFAULT_OPTIONS = {
        className: "ol-draw",
        geometryType: "Point",
        geometryName: "geom",
        label: "Draw",
        title: "Draw",
        buttonType: Draw,
        eventName: "draw-feature",
        style: [
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
                    width: 5
                }
            },
            {
                stroke: {
                    color: "rgba(0,0,0,1)",
                    width: 1
                }
            }
        ]
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
        var labs = "\n    index\n    measure\n    ol3-draw&GROUP_NAME=ol3-draw-examples\n    ol3-history\n    ";
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
define("ol3-draw/examples/mapmaker", ["require", "exports", "openlayers", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, ol, common_3) {
    "use strict";
    var MapMaker = (function () {
        function MapMaker() {
        }
        MapMaker.create = function (options) {
            options = common_3.mixin(common_3.mixin({}, MapMaker.DEFAULT_OPTIONS), options);
            options.target.classList.add("ol-map");
            common_3.cssin("mapmaker", "\n        .ol-map {\n            top: 0;\n            left: 0;\n            right: 0;\n            bottom:0;\n            position: absolute;\n        }\n        ");
            var osm = new ol.layer.Tile({
                opacity: 0.8,
                source: new ol.source.OSM()
            });
            var view = new ol.View({
                projection: options.projection,
                center: options.center,
                zoom: options.zoom
            });
            var map = new ol.Map({
                target: options.target,
                keyboardEventTarget: document,
                loadTilesWhileAnimating: true,
                loadTilesWhileInteracting: true,
                controls: ol.control.defaults({ attribution: false }).extend([new ol.control.ScaleLine(), new ol.control.OverviewMap({
                        layers: [osm], view: new ol.View({
                            projection: options.projection
                        })
                    })]),
                view: view,
                layers: [osm]
            });
            return map;
        };
        return MapMaker;
    }());
    MapMaker.DEFAULT_OPTIONS = {};
    exports.MapMaker = MapMaker;
});
define("bower_components/ol3-fun/ol3-fun/navigation", ["require", "exports", "openlayers", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, ol, common_4) {
    "use strict";
    /**
     * A less disorienting way of changing the maps extent (maybe!)
     * Zoom out until new feature is visible
     * Zoom to that feature
     */
    function zoomToFeature(map, feature, options) {
        options = common_4.defaults(options || {}, {
            duration: 1000,
            padding: 256,
            minResolution: 2 * map.getView().getMinResolution()
        });
        var view = map.getView();
        var currentExtent = view.calculateExtent(map.getSize());
        var targetExtent = feature.getGeometry().getExtent();
        var doit = function (duration) {
            view.fit(targetExtent, {
                size: map.getSize(),
                padding: [options.padding, options.padding, options.padding, options.padding],
                minResolution: options.minResolution,
                duration: duration
            });
        };
        if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            // new extent is contained within current extent, pan and zoom in
            doit(options.duration);
        }
        else if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            // new extent is contained within current extent, pan and zoom out
            doit(options.duration);
        }
        else {
            // zoom out until target extent is in view
            var fullExtent = ol.extent.createEmpty();
            ol.extent.extend(fullExtent, currentExtent);
            ol.extent.extend(fullExtent, targetExtent);
            var dscale = ol.extent.getWidth(fullExtent) / ol.extent.getWidth(currentExtent);
            var duration = 0.5 * options.duration;
            view.fit(fullExtent, {
                size: map.getSize(),
                padding: [options.padding, options.padding, options.padding, options.padding],
                minResolution: options.minResolution,
                duration: duration
            });
            setTimeout(function () { return doit(0.5 * options.duration); }, duration);
        }
    }
    exports.zoomToFeature = zoomToFeature;
});
// ported from https://github.com/gmaclennan/parse-dms/blob/master/index.js
define("bower_components/ol3-fun/ol3-fun/parse-dms", ["require", "exports"], function (require, exports) {
    "use strict";
    function decDegFromMatch(m) {
        var signIndex = {
            "-": -1,
            "N": 1,
            "S": -1,
            "E": 1,
            "W": -1
        };
        var latLonIndex = {
            "-": "",
            "N": "lat",
            "S": "lat",
            "E": "lon",
            "W": "lon"
        };
        var degrees, minutes, seconds, sign, latLon;
        sign = signIndex[m[2]] || signIndex[m[1]] || signIndex[m[6]] || 1;
        degrees = Number(m[3]);
        minutes = m[4] ? Number(m[4]) : 0;
        seconds = m[5] ? Number(m[5]) : 0;
        latLon = latLonIndex[m[1]] || latLonIndex[m[6]];
        if (!inRange(degrees, 0, 180))
            throw 'Degrees out of range';
        if (!inRange(minutes, 0, 60))
            throw 'Minutes out of range';
        if (!inRange(seconds, 0, 60))
            throw 'Seconds out of range';
        return {
            decDeg: sign * (degrees + minutes / 60 + seconds / 3600),
            latLon: latLon
        };
    }
    function inRange(value, a, b) {
        return value >= a && value <= b;
    }
    function parse(dmsString) {
        dmsString = dmsString.trim();
        // Inspired by https://gist.github.com/JeffJacobson/2955437
        // See https://regex101.com/r/kS2zR1/3
        var dmsRe = /([NSEW])?(-)?(\d+(?:\.\d+)?)[°º:d\s]?\s?(?:(\d+(?:\.\d+)?)['’‘′:]\s?(?:(\d{1,2}(?:\.\d+)?)(?:"|″|’’|'')?)?)?\s?([NSEW])?/i;
        var dmsString2;
        var m1 = dmsString.match(dmsRe);
        if (!m1)
            throw 'Could not parse string';
        // If dmsString starts with a hemisphere letter, then the regex can also capture the 
        // hemisphere letter for the second coordinate pair if also in the string
        if (m1[1]) {
            m1[6] = undefined;
            dmsString2 = dmsString.substr(m1[0].length - 1).trim();
        }
        else {
            dmsString2 = dmsString.substr(m1[0].length).trim();
        }
        var decDeg1 = decDegFromMatch(m1);
        var m2 = dmsString2.match(dmsRe);
        var decDeg2 = m2 && decDegFromMatch(m2);
        if (typeof decDeg1.latLon === 'undefined') {
            if (!isNaN(decDeg1.decDeg) && decDeg2 && isNaN(decDeg2.decDeg)) {
                // If we only have one coordinate but we have no hemisphere value,
                // just return the decDeg number
                return decDeg1.decDeg;
            }
            else if (!isNaN(decDeg1.decDeg) && decDeg2 && !isNaN(decDeg2.decDeg)) {
                // If no hemisphere letter but we have two coordinates,
                // infer that the first is lat, the second lon
                decDeg1.latLon = 'lat';
                decDeg2.latLon = 'lon';
            }
            else {
                throw 'Could not parse string';
            }
        }
        // If we parsed the first coordinate as lat or lon, then assume the second is the other
        if (typeof decDeg2.latLon === 'undefined') {
            decDeg2.latLon = decDeg1.latLon === 'lat' ? 'lon' : 'lat';
        }
        return _a = {},
            _a[decDeg1.latLon] = decDeg1.decDeg,
            _a[decDeg2.latLon] = decDeg2.decDeg,
            _a;
        var _a;
    }
    exports.parse = parse;
});
define("bower_components/ol3-fun/index", ["require", "exports", "bower_components/ol3-fun/ol3-fun/common", "bower_components/ol3-fun/ol3-fun/navigation", "bower_components/ol3-fun/ol3-fun/parse-dms"], function (require, exports, common, navigation, dms) {
    "use strict";
    var index = common.defaults(common, {
        dms: dms,
        navigation: navigation
    });
    return index;
});
define("ol3-draw/measure-extension", ["require", "exports", "openlayers", "bower_components/ol3-fun/index"], function (require, exports, ol, ol3_fun_1) {
    "use strict";
    var wgs84Sphere = new ol.Sphere(6378137);
    var MeterConvert = {
        "m": 1,
        "km": 1 / 1000,
        "ft": 3.28084,
        "mi": 0.000621371
    };
    var Measurement = (function () {
        function Measurement(options) {
            this.options = options;
            ol3_fun_1.cssin("measure", "\n\n.tooltip {\n    position: relative;\n    background: rgba(0, 0, 0, 0.5);\n    border-radius: 4px;\n    color: white;\n    padding: 4px 8px;\n    opacity: 0.7;\n    white-space: nowrap;\n}\n.tooltip-measure {\n    opacity: 1;\n    font-weight: bold;\n}\n.tooltip-static {\n    background-color: #ffcc33;\n    color: black;\n    border: 1px solid white;\n}\n.tooltip-measure:before,\n.tooltip-static:before {\n    border-top: 6px solid rgba(0, 0, 0, 0.5);\n    border-right: 6px solid transparent;\n    border-left: 6px solid transparent;\n    content: \"\";\n    position: absolute;\n    bottom: -6px;\n    margin-left: -7px;\n    left: 50%;\n}\n.tooltip-static:before {\n    border-top-color: #ffcc33;\n}\n\n    ");
            this.createMeasureTooltip();
        }
        Measurement.create = function (options) {
            options = ol3_fun_1.defaults({}, options || {}, Measurement.DEFAULT_OPTIONS);
            return new Measurement(options);
        };
        Measurement.prototype.createMeasureTooltip = function () {
            var _this = this;
            var options = this.options;
            if (this.measureTooltipElement) {
                this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
            }
            this.measureTooltipElement = document.createElement('div');
            this.measureTooltipElement.className = 'tooltip tooltip-measure';
            this.measureTooltip = new ol.Overlay({
                element: this.measureTooltipElement,
                offset: [0, -15],
                positioning: 'bottom-center'
            });
            options.map.addOverlay(this.measureTooltip);
            options.draw.on('drawstart', function (evt) {
                var listener = evt.feature.getGeometry().on('change', function (evt) {
                    var geom = evt.target;
                    var output = _this.formatLength({ map: options.map, line: geom });
                    _this.measureTooltipElement.innerHTML = output;
                    _this.measureTooltip.setPosition(geom.getLastCoordinate());
                });
                options.draw.once('drawend', function () { return ol.Observable.unByKey(listener); });
            });
        };
        /**
         * Format length output.
         * @param {ol.geom.LineString} line The line.
         * @return {string} The formatted length.
         */
        Measurement.prototype.formatLength = function (args) {
            var options = this.options;
            var sourceProj = args.map.getView().getProjection();
            var coordinates = args.line.getCoordinates()
                .map(function (c) { return ol.proj.transform(c, sourceProj, 'EPSG:4326'); });
            var distances = coordinates.map(function (c, i) { return wgs84Sphere.haversineDistance(i ? coordinates[i - 1] : c, c); });
            var length = distances.reduce(function (a, b) { return a + b; }, 0);
            var lengths = [length];
            if (options.measureCurrentSegment && distances.length > 2) {
                lengths.push(distances.pop());
            }
            return lengths.map(function (l) {
                var uom = l < 100 ? "m" : options.uom;
                return (MeterConvert[uom] * l).toPrecision(5) + " " + uom;
            }).join("<br/>");
        };
        return Measurement;
    }());
    Measurement.DEFAULT_OPTIONS = {
        uom: "ft",
        measureCurrentSegment: true
    };
    exports.Measurement = Measurement;
});
define("ol3-draw/examples/measure", ["require", "exports", "ol3-draw/examples/mapmaker", "ol3-draw/ol3-draw", "ol3-draw/measure-extension"], function (require, exports, mapmaker_1, ol3_draw_1, measure_extension_1) {
    "use strict";
    function run() {
        var map = mapmaker_1.MapMaker.create({
            target: document.getElementsByClassName("map")[0],
            projection: "EPSG:3857",
            center: [-9167000, 4148000],
            zoom: 21,
            basemap: "osm"
        });
        var draw = ol3_draw_1.Draw.create({ map: map, geometryType: "LineString" });
        measure_extension_1.Measurement.create({
            map: map,
            draw: draw,
            uom: "mi"
        });
    }
    exports.run = run;
});
define("ol3-draw/ol3-delete", ["require", "exports", "openlayers", "ol3-draw/ol3-button", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, ol, ol3_button_2, common_5) {
    "use strict";
    var Delete = (function (_super) {
        __extends(Delete, _super);
        function Delete(options) {
            var _this = _super.call(this, options) || this;
            var map = options.map;
            var featureLayers = [];
            var selection = new ol.interaction.Select({
                condition: ol.events.condition.click,
                multi: false,
                style: function (feature, res) {
                    var index = selection.getFeatures().getArray().indexOf(feature);
                    var fillColor = "rgba(0,0,0,0.2)";
                    var strokeColor = "red";
                    var textTemplate = {
                        text: "X" + (index + 1),
                        fill: {
                            color: strokeColor
                        },
                        stroke: {
                            color: fillColor,
                            width: 2
                        },
                        scale: 3
                    };
                    var style = options.style[feature.getGeometry().getType()]
                        .map(function (s) { return _this.symbolizer.fromJson(common_5.defaults({ text: textTemplate }, s)); });
                    return style;
                }
            });
            var boxSelect = new ol.interaction.DragBox({
                condition: options.boxSelectCondition
            });
            boxSelect.on("boxend", function (args) {
                var extent = boxSelect.getGeometry().getExtent();
                var features = selection.getFeatures().getArray();
                options.map.getLayers()
                    .getArray()
                    .filter(function (l) { return l instanceof ol.layer.Vector; })
                    .map(function (l) { return l; })
                    .forEach(function (l) { return l.getSource().forEachFeatureIntersectingExtent(extent, function (feature) {
                    if (-1 === features.indexOf(feature)) {
                        selection.getFeatures().push(feature);
                        _this.addFeatureLayerAssociation(feature, l);
                    }
                    else {
                        selection.getFeatures().remove(feature);
                        _this.addFeatureLayerAssociation(feature, null);
                    }
                }); });
            });
            var doit = function () {
                selection.getFeatures().forEach(function (f) {
                    var l = selection.getLayer(f) || _this.featureLayerAssociation_[f.getId()];
                    l && l.getSource().removeFeature(f);
                });
                selection.getFeatures().clear();
                _this.featureLayerAssociation_ = [];
            };
            _this.once("change:active", function () {
                [selection, boxSelect].forEach(function (i) {
                    i.setActive(false);
                    map.addInteraction(i);
                });
                _this.handlers.push(function () {
                    [selection, boxSelect].forEach(function (i) {
                        i.setActive(false);
                        map.removeInteraction(i);
                    });
                });
            });
            _this.on("change:active", function () {
                var active = _this.get("active");
                if (!active) {
                    doit();
                    selection.getFeatures().clear();
                }
                [boxSelect, selection].forEach(function (i) { return i.setActive(active); });
            });
            return _this;
        }
        Delete.create = function (options) {
            options = common_5.defaults({}, options, Delete.DEFAULT_OPTIONS);
            return ol3_button_2.Button.create(options);
        };
        Delete.prototype.addFeatureLayerAssociation = function (feature, layer) {
            if (!this.featureLayerAssociation_)
                this.featureLayerAssociation_ = [];
            var key = feature.getId();
            this.featureLayerAssociation_[key] = layer;
        };
        return Delete;
    }(ol3_button_2.Button));
    Delete.DEFAULT_OPTIONS = {
        className: "ol-delete",
        label: "␡",
        title: "Delete",
        buttonType: Delete,
        eventName: "delete-feature",
        boxSelectCondition: ol.events.condition.shiftKeyOnly,
        style: {
            "Point": [{
                    circle: {
                        radius: 20,
                        fill: {
                            color: "blue"
                        },
                        stroke: {
                            color: "red",
                            width: 2
                        },
                        opacity: 1
                    }
                }],
            "MultiLineString": [{
                    stroke: {
                        color: "red",
                        width: 2
                    }
                }],
            "Circle": [{
                    fill: {
                        color: "blue"
                    },
                    stroke: {
                        color: "red",
                        width: 2
                    }
                }],
            "Polygon": [{
                    fill: {
                        color: "blue"
                    },
                    stroke: {
                        color: "red",
                        width: 2
                    }
                }],
            "MultiPolygon": [{
                    fill: {
                        color: "blue"
                    },
                    stroke: {
                        color: "red",
                        width: 2
                    }
                }]
        }
    };
    exports.Delete = Delete;
});
define("ol3-draw/ol3-edit", ["require", "exports", "openlayers", "bower_components/ol3-fun/ol3-fun/common", "ol3-draw/ol3-button"], function (require, exports, ol, common_6, ol3_button_3) {
    "use strict";
    var Modify = (function (_super) {
        __extends(Modify, _super);
        function Modify(options) {
            var _this = _super.call(this, options) || this;
            var styles = common_6.defaults(options.style, Modify.DEFAULT_OPTIONS.style);
            var select = new ol.interaction.Select({
                style: function (feature, res) {
                    var featureType = feature.getGeometry().getType();
                    var style = styles[featureType].map(function (s) { return _this.symbolizer.fromJson(s); });
                    switch (featureType) {
                        case "MultiLineString":
                        case "MultiPolygon":
                        case "Polygon":
                        case "MultiPoint":
                        case "Point":
                            styles["EditPoints"].map(function (s) { return _this.symbolizer.fromJson(s); }).forEach(function (otherStyle) {
                                otherStyle.setGeometry(function () {
                                    var geom = feature.getGeometry();
                                    var points;
                                    if (geom instanceof ol.geom.MultiPolygon) {
                                        points = geom.getCoordinates()[0][0];
                                    }
                                    else if (geom instanceof ol.geom.Polygon) {
                                        points = geom.getCoordinates()[0];
                                    }
                                    else if (geom instanceof ol.geom.MultiLineString) {
                                        points = geom.getCoordinates()[0];
                                    }
                                    else if (geom instanceof ol.geom.MultiPoint) {
                                        points = geom.getCoordinates();
                                    }
                                    else if (geom instanceof ol.geom.Point) {
                                        points = [geom.getCoordinates()];
                                    }
                                    return new ol.geom.MultiPoint(points);
                                });
                                style.push(otherStyle);
                            });
                    }
                    return style;
                }
            });
            var modify = new ol.interaction.Modify({
                features: select.getFeatures(),
                style: function (feature, res) {
                    var featureType = feature.getGeometry().getType();
                    var style = (options.style[featureType] || Modify.DEFAULT_OPTIONS.style[featureType])
                        .map(function (s) { return _this.symbolizer.fromJson(s); });
                    return style;
                }
            });
            select.on("select", function (args) {
                modify.setActive(true);
            });
            _this.once("change:active", function () {
                [select, modify].forEach(function (i) {
                    i.setActive(false);
                    options.map.addInteraction(i);
                });
                _this.handlers.push(function () {
                    [select, modify].forEach(function (i) {
                        i.setActive(false);
                        options.map.removeInteraction(i);
                    });
                });
            });
            _this.on("change:active", function () {
                var active = _this.get("active");
                select.setActive(active);
                if (!active)
                    select.getFeatures().clear();
            });
            return _this;
        }
        Modify.create = function (options) {
            options = common_6.defaults({}, options, Modify.DEFAULT_OPTIONS);
            return ol3_button_3.Button.create(options);
        };
        return Modify;
    }(ol3_button_3.Button));
    Modify.DEFAULT_OPTIONS = {
        className: "ol-edit",
        label: "Edit",
        title: "Edit",
        eventName: "modify-feature",
        style: {
            "Point": [{
                    circle: {
                        radius: 2,
                        fill: {
                            color: "rgba(255, 0, 0, 1)"
                        },
                        stroke: {
                            color: "rgba(255, 0, 0, 1)",
                            width: 1
                        },
                        opacity: 1
                    }
                }],
            "EditPoints": [{
                    circle: {
                        radius: 5,
                        fill: {
                            color: "rgb(255, 165, 0)"
                        },
                        opacity: 0.2
                    }
                }],
            "MultiLineString": [{
                    stroke: {
                        color: "rgba(0, 0, 0, 0.5)",
                        width: 3
                    }
                }],
            "Circle": [{
                    fill: {
                        color: "blue"
                    },
                    stroke: {
                        color: "red",
                        width: 2
                    }
                }],
            "Polygon": [{
                    fill: {
                        color: "rgba(0, 0, 0, 0.1)"
                    },
                    stroke: {
                        color: "rgba(0, 0, 0, 1)",
                        width: 1
                    }
                }],
            "MultiPolygon": [{
                    fill: {
                        color: "rgba(0, 0, 0, 0.1)"
                    },
                    stroke: {
                        color: "rgba(0, 0, 0, 1)",
                        width: 1
                    }
                }]
        },
        buttonType: Modify
    };
    exports.Modify = Modify;
});
define("ol3-draw/ol3-translate", ["require", "exports", "openlayers", "ol3-draw/ol3-button", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, ol, ol3_button_4, common_7) {
    "use strict";
    var Translate = (function (_super) {
        __extends(Translate, _super);
        function Translate(options) {
            var _this = _super.call(this, options) || this;
            var map = options.map;
            var select = new ol.interaction.Select({
                style: function (feature, res) {
                    var style = options.style[feature.getGeometry().getType()]
                        .map(function (s) { return _this.symbolizer.fromJson(s); });
                    return style;
                }
            });
            var translate = new ol.interaction.Translate({
                features: select.getFeatures()
            });
            select.on("select", function (args) {
                translate.setActive(true);
            });
            _this.once("change:active", function () {
                [select, translate].forEach(function (i) {
                    i.setActive(false);
                    options.map.addInteraction(i);
                });
                _this.handlers.push(function () {
                    [select, translate].forEach(function (i) {
                        i.setActive(false);
                        options.map.removeInteraction(i);
                    });
                });
            });
            _this.on("change:active", function () {
                var active = _this.get("active");
                _this.options.element.classList.toggle("active", active);
                select.setActive(active);
                if (!active)
                    select.getFeatures().clear();
            });
            return _this;
        }
        Translate.create = function (options) {
            options = common_7.defaults({}, options, Translate.DEFAULT_OPTIONS);
            return ol3_button_4.Button.create(options);
        };
        return Translate;
    }(ol3_button_4.Button));
    Translate.DEFAULT_OPTIONS = {
        className: "ol-translate",
        position: "top right",
        label: "XY",
        title: "Translate",
        eventName: "translate-feature",
        style: {
            "Point": [{
                    circle: {
                        radius: 2,
                        fill: {
                            color: "rgba(255, 0, 0, 1)"
                        },
                        stroke: {
                            color: "rgba(255, 0, 0, 1)",
                            width: 1
                        },
                        opacity: 1
                    }
                }],
            "MultiLineString": [{
                    stroke: {
                        color: "rgba(0, 0, 0, 0.5)",
                        width: 3
                    }
                }],
            "Circle": [{
                    fill: {
                        color: "blue"
                    },
                    stroke: {
                        color: "red",
                        width: 2
                    }
                }],
            "Polygon": [{
                    fill: {
                        color: "rgba(0, 0, 0, 0.1)"
                    },
                    stroke: {
                        color: "rgba(0, 0, 0, 1)",
                        width: 1
                    }
                }],
            "MultiPolygon": [{
                    fill: {
                        color: "rgba(0, 0, 0, 0.1)"
                    },
                    stroke: {
                        color: "rgba(0, 0, 0, 1)",
                        width: 1
                    }
                }]
        },
        buttonType: Translate
    };
    exports.Translate = Translate;
});
define("ol3-draw/ol3-select", ["require", "exports", "openlayers", "ol3-draw/ol3-button", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, ol, ol3_button_5, common_8) {
    "use strict";
    var Select = (function (_super) {
        __extends(Select, _super);
        function Select(options) {
            var _this = _super.call(this, options) || this;
            var selection = new ol.interaction.Select({
                condition: ol.events.condition.click,
                multi: options.multi,
                style: function (feature, res) {
                    var style = options.style[feature.getGeometry().getType()].map(function (s) { return _this.symbolizer.fromJson(s); });
                    style.filter(function (s) { return s.getText(); }).forEach(function (s) {
                        style[0].getText().setText(selection.getFeatures().getArray().indexOf(feature) + 1 + "");
                    });
                    return style;
                }
            });
            var boxSelect = new ol.interaction.DragBox({
                condition: options.boxSelectCondition
            });
            boxSelect.on("boxend", function (args) {
                var extent = boxSelect.getGeometry().getExtent();
                var features = selection.getFeatures().getArray();
                options.map.getLayers()
                    .getArray()
                    .filter(function (l) { return l instanceof ol.layer.Vector; })
                    .map(function (l) { return l; })
                    .forEach(function (l) { return l.getSource().forEachFeatureIntersectingExtent(extent, function (feature) {
                    if (-1 === features.indexOf(feature)) {
                        selection.getFeatures().push(feature);
                    }
                    else {
                        selection.getFeatures().remove(feature);
                    }
                }); });
            });
            _this.once("change:active", function () {
                [boxSelect, selection].forEach(function (i) {
                    i.setActive(false);
                    options.map.addInteraction(i);
                });
                _this.handlers.push(function () {
                    [boxSelect, selection].forEach(function (i) {
                        i.setActive(false);
                        options.map.removeInteraction(i);
                    });
                });
            });
            _this.on("change:active", function () {
                var active = _this.get("active");
                [boxSelect, selection].forEach(function (i) { return i.setActive(active); });
                if (!active)
                    selection.getFeatures().clear();
            });
            return _this;
        }
        Select.create = function (options) {
            options = common_8.defaults({}, options, Select.DEFAULT_OPTIONS);
            return ol3_button_5.Button.create(options);
        };
        return Select;
    }(ol3_button_5.Button));
    Select.DEFAULT_OPTIONS = {
        className: "ol-select",
        position: "top right",
        label: "§",
        title: "Select",
        eventName: "select-feature",
        multi: false,
        buttonType: Select,
        boxSelectCondition: ol.events.condition.shiftKeyOnly,
        style: {
            "Point": [{
                    circle: {
                        radius: 20,
                        fill: {
                            color: "blue"
                        },
                        stroke: {
                            color: "red",
                            width: 2
                        },
                        opacity: 1
                    },
                    text: {
                        fill: {
                            color: "white"
                        },
                        stroke: {
                            color: "red",
                            width: 2
                        },
                        scale: 3
                    }
                }],
            "MultiLineString": [{
                    stroke: {
                        color: "red",
                        width: 2
                    },
                    text: {
                        fill: {
                            color: "white"
                        },
                        stroke: {
                            color: "red",
                            width: 2
                        },
                        scale: 3
                    }
                }],
            "Circle": [{
                    fill: {
                        color: "blue"
                    },
                    stroke: {
                        color: "red",
                        width: 2
                    },
                    text: {
                        fill: {
                            color: "white"
                        },
                        stroke: {
                            color: "red",
                            width: 2
                        },
                        scale: 3
                    }
                }],
            "MultiPolygon": [{
                    fill: {
                        color: "blue"
                    },
                    stroke: {
                        color: "red",
                        width: 2
                    },
                    text: {
                        fill: {
                            color: "white"
                        },
                        stroke: {
                            color: "red",
                            width: 2
                        },
                        scale: 3
                    }
                }],
            "Polygon": [{
                    fill: {
                        color: "blue"
                    },
                    stroke: {
                        color: "red",
                        width: 2
                    },
                    text: {
                        fill: {
                            color: "white"
                        },
                        stroke: {
                            color: "red",
                            width: 2
                        },
                        scale: 3
                    }
                }]
        }
    };
    exports.Select = Select;
});
define("ol3-draw/ol3-note", ["require", "exports", "openlayers", "ol3-draw/ol3-button", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, ol, ol3_button_6, common_9) {
    "use strict";
    var Note = (function (_super) {
        __extends(Note, _super);
        function Note(options) {
            var _this = _super.call(this, options) || this;
            _this.overlayMap = [];
            var map = options.map;
            map.getView().on("change:resolution", function () {
                console.log(map.getView().getResolution());
            });
            var style = _this.options.style.map(function (s) { return _this.symbolizer.fromJson(s); });
            if (!options.layer) {
                var layer = new ol.layer.Vector({
                    style: style,
                    source: new ol.source.Vector(),
                    maxResolution: 600
                });
                options.map.addLayer(layer);
                options.layer = layer;
            }
            else {
                // when first active, re-style all features with a note
                _this.once("change:active", function () {
                    options.layer
                        .getSource()
                        .getFeatures()
                        .filter(function (f) { return !!f.get(options.noteFieldName); })
                        .forEach(function (f) { return f.setStyle(style); });
                });
            }
            // every time active changes toggle the overlay and marker styles
            _this.on("change:active", function () {
                var active = _this.get("active");
                _this.overlayMap.forEach(function (v) {
                    v.feature.setStyle(active ? style : null);
                    v.overlay.getElement().classList.toggle("hidden", !active);
                });
            });
            {
                var h_1 = map.on("click", function (args) {
                    var found = map.forEachFeatureAtPixel(args.pixel, function (feature, layer) {
                        if (layer === options.layer) {
                            var note = feature.get(options.noteFieldName);
                            if (!note)
                                return;
                            if (!feature.getStyle())
                                feature.setStyle(style);
                            var overlay = _this.forceOverlay(feature);
                            var wasVisible = !overlay.getElement().classList.contains("hidden");
                            overlay.getElement().classList.toggle("hidden");
                            overlay.setPosition(wasVisible ? null : ol.extent.getCenter(feature.getGeometry().getExtent()));
                            return true;
                        }
                    });
                    if (!_this.get("active"))
                        return;
                    if (found) {
                        //this.set("active", false);
                        return;
                    }
                    {
                        var feature = new ol.Feature();
                        feature.setStyle(style);
                        feature.setGeometryName(options.geometryName);
                        feature.setGeometry(new ol.geom.Point(args.coordinate));
                        var overlay = _this.forceOverlay(feature);
                        // show the popup
                        overlay.getElement().classList.toggle("hidden");
                        options.layer.getSource().addFeature(feature);
                    }
                });
                _this.handlers.push(function () { return ol.Observable.unByKey(h_1); });
            }
            return _this;
        }
        Note.create = function (options) {
            options = common_9.defaults({}, options, Note.DEFAULT_OPTIONS);
            return ol3_button_6.Button.create(options);
        };
        Note.prototype.forceOverlay = function (feature) {
            var overlayInfo = this.overlayMap.filter(function (i) { return i.feature === feature; })[0];
            if (!overlayInfo) {
                var overlay = this.createOverlay(feature);
                overlayInfo = { feature: feature, overlay: overlay };
                this.overlayMap.push(overlayInfo);
            }
            return overlayInfo.overlay;
        };
        Note.prototype.createOverlay = function (feature) {
            var options = this.options;
            var map = options.map;
            //let textarea = document.createElement("textarea");
            var note = feature.get(options.noteFieldName) || "";
            var textarea = common_9.html("<div class=\"contentEditableDiv hidden\"><p class=\"editableP\" contentEditable=\"true\" placeholder=\"[TYPE YOUR MESSAGE HERE]\">" + note + "</p></div>");
            var input = textarea.getElementsByClassName("editableP")[0];
            input.addEventListener("input", function () { return feature.set(options.noteFieldName, input.textContent); });
            var overlay = new ol.Overlay({
                insertFirst: true,
                positioning: "bottom-center",
                offset: [0, -5],
                element: textarea,
                position: ol.extent.getCenter(feature.getGeometry().getExtent())
            });
            map.addOverlay(overlay);
            return overlay;
        };
        Note.prototype.cssin = function () {
            _super.prototype.cssin.call(this);
            this.handlers.push(common_9.cssin(this.options.className + "-input", "\n[contenteditable=true]:empty:before{\n  content: attr(placeholder);\n  display: block;\n  opacity: 0.5;\n}\n\n.contentEditableDiv {\n    width:200px;\n    height:60px;\n    position:relative;\n    overflow:auto;\n    margin-bottom: 8px;\n}\n\n.contentEditableDiv.hidden {\n    display: none;\n}\n\n.editableP{\n    min-height:10px;\n    position:absolute;   \n    bottom:0;\n    left:0;\n    right:0;\n    margin: 0;\n    text-align: center;\n    font-family: cursive;\n    rgba(240,240,240,0.6);\n}"));
        };
        return Note;
    }(ol3_button_6.Button));
    Note.DEFAULT_OPTIONS = {
        className: "ol-note",
        label: "✎",
        title: "Note",
        buttonType: Note,
        eventName: "note",
        geometryName: "geom",
        noteFieldName: "note",
        style: [
            {
                "star": {
                    "fill": {
                        "color": "red"
                    },
                    "opacity": 1,
                    "stroke": {
                        "color": "black",
                        "width": 2
                    },
                    "radius": 10,
                    "radius2": 4,
                    "points": 5,
                    "scale": 1
                }
            }
        ]
    };
    exports.Note = Note;
});
define("ol3-draw/services/wfs-sync", ["require", "exports", "openlayers", "jquery", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, ol, $, common_10) {
    "use strict";
    var serializer = new XMLSerializer();
    var WfsSync = (function () {
        function WfsSync(options) {
            this.options = options;
            this.lastSavedTime = Date.now();
            this.deletes = [];
            this.watch();
        }
        WfsSync.create = function (options) {
            options = common_10.defaults(options || {}, WfsSync.DEFAULT_OPTIONS);
            if (!options.formatter) {
                options.formatter = new ol.format.WFS();
            }
            if (!options.srsName) {
                // isn't generally set...better to get map from layer?
                options.srsName = options.source.getProjection().getCode();
            }
            var result = new WfsSync(options);
            return result;
        };
        WfsSync.prototype.watch = function () {
            var _this = this;
            var save = common_10.debounce(function () { return _this.saveDrawings({
                features: _this.options.source.getFeatures().filter(function (f) { return !!f.get(_this.options.lastUpdateFieldName); })
            }); }, 1000);
            var touch = function (f) {
                f.set(_this.options.lastUpdateFieldName, Date.now());
                save();
            };
            var watch = function (f) {
                f.getGeometry().on("change", function () { return touch(f); });
                f.on("propertychange", function (args) {
                    if (args.key === _this.options.lastUpdateFieldName)
                        return;
                    touch(f);
                });
            };
            var source = this.options.source;
            source.forEachFeature(function (f) { return watch(f); });
            source.on("addfeature", function (args) {
                watch(args.feature);
                touch(args.feature);
            });
            source.on("removefeature", function (args) {
                _this.deletes.push(args.feature);
                touch(args.feature);
            });
        };
        WfsSync.prototype.saveDrawings = function (args) {
            var _this = this;
            var features = args.features.filter(function (f) { return _this.lastSavedTime <= f.get(_this.options.lastUpdateFieldName); });
            var saveTo = function (featureType, geomType) {
                var toSave = features.filter(function (f) { return f.getGeometry().getType() === geomType; });
                var toDelete = _this.deletes.filter(function (f) { return !!f.get(_this.options.featureIdFieldName); });
                if (0 === (toSave.length + toDelete.length)) {
                    console.info("nothing to save:", featureType, geomType);
                    return;
                }
                // clone and transform as needed
                if (_this.options.sourceSrs && _this.options.sourceSrs !== _this.options.srsName) {
                    var srsIn_1 = new ol.proj.Projection({ code: _this.options.sourceSrs });
                    var srsOut_1 = new ol.proj.Projection({ code: _this.options.srsName });
                    toSave = toSave.map(function (f) { return f.clone(); });
                    toSave.forEach(function (f) { return f.getGeometry().transform(srsIn_1, srsOut_1); });
                    throw "should not be necessary, perform on server, cloning will prevent insert key from updating";
                }
                var format = _this.options.formatter;
                var toInsert = toSave.filter(function (f) { return !f.get(_this.options.featureIdFieldName); });
                var toUpdate = toSave.filter(function (f) { return !!f.get(_this.options.featureIdFieldName); });
                if (_this.options.converter && toInsert.length) {
                    //toInsert = toInsert.map(f => f.clone());
                    toInsert.forEach(function (f) { return f.setGeometry(_this.options.converter(f.getGeometry())); });
                }
                toInsert.forEach(function (f) { return f.set(_this.options.lastUpdateFieldName, undefined); });
                toUpdate.forEach(function (f) { return f.set(_this.options.lastUpdateFieldName, undefined); });
                toDelete.forEach(function (f) { return f.set(_this.options.lastUpdateFieldName, undefined); });
                var requestBody = format.writeTransaction(toInsert, toUpdate, toDelete, {
                    featureNS: _this.options.featureNS,
                    featurePrefix: _this.options.featurePrefix,
                    featureType: featureType,
                    srsName: _this.options.srsName,
                    nativeElements: []
                });
                $.ajax({
                    type: "POST",
                    url: _this.options.wfsUrl,
                    data: serializer.serializeToString(requestBody),
                    contentType: "application/xml",
                    dataType: "xml",
                    success: function (response) {
                        var responseInfo = format.readTransactionResponse(response);
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
                        if (_this.options.converter) {
                        }
                        toInsert.forEach(function (f, i) {
                            var id = responseInfo.insertIds[i];
                            // how to know to use "gid"?
                            f.set("gid", id.split(".").pop());
                            f.setId(id);
                        });
                    }
                });
            };
            this.lastSavedTime = Date.now();
            Object.keys(this.options.targets).forEach(function (k) {
                saveTo(_this.options.targets[k], k);
            });
        };
        return WfsSync;
    }());
    WfsSync.DEFAULT_OPTIONS = {
        featureIdFieldName: "gid",
        lastUpdateFieldName: "touched",
    };
    exports.WfsSync = WfsSync;
});
define("ol3-draw/examples/ol3-draw", ["require", "exports", "openlayers", "jquery", "bower_components/ol3-fun/ol3-fun/common", "ol3-draw/ol3-button", "ol3-draw/ol3-delete", "ol3-draw/ol3-draw", "ol3-draw/ol3-edit", "ol3-draw/ol3-translate", "ol3-draw/ol3-select", "ol3-draw/ol3-note", "ol3-draw/examples/mapmaker", "ol3-draw/services/wfs-sync"], function (require, exports, ol, $, common_11, ol3_button_7, ol3_delete_1, ol3_draw_2, ol3_edit_1, ol3_translate_1, ol3_select_1, ol3_note_1, mapmaker_2, wfs_sync_1) {
    "use strict";
    var GROUP_NAME = common_11.getParameterByName("GROUP_NAME") || "ol3-draw-examples";
    var WFS_INFO = {
        srsName: "EPSG:3857",
        wfsUrl: location.protocol + "//" + location.hostname + ":8080/geoserver/cite/wfs",
        featureNS: "http://www.opengeospatial.net/cite",
        featurePrefix: "cite",
    };
    function stopInteraction(map, type) {
        map.getInteractions()
            .getArray()
            .filter(function (i) { return i instanceof type; })
            .forEach(function (t) { return t.setActive(false); });
    }
    function stopControl(map, type) {
        map.getControls()
            .getArray()
            .filter(function (i) { return i.get("active"); })
            .filter(function (i) { return i instanceof type; })
            .forEach(function (t) { return t.set("active", false); });
    }
    function stopOtherControls(map, control) {
        map.getControls()
            .getArray()
            .filter(function (i) { return i.get("active"); })
            .filter(function (i) { return typeof i === typeof control; })
            .forEach(function (t) { return t !== control && t.set("active", false); });
    }
    function loadAndWatch(args) {
        var serializer = new XMLSerializer();
        var format = new ol.format.WFS();
        var requestBody = format.writeGetFeature({
            featureNS: WFS_INFO.featureNS,
            featurePrefix: WFS_INFO.featurePrefix,
            featureTypes: [args.featureType],
            srsName: WFS_INFO.srsName,
            filter: ol.format.filter.equalTo("strname", GROUP_NAME),
        });
        var data = serializer.serializeToString(requestBody);
        $.ajax({
            type: "POST",
            url: WFS_INFO.wfsUrl,
            data: data,
            contentType: "application/xml",
            dataType: "xml",
            success: function (response) {
                var features = format.readFeatures(response);
                features = features.filter(function (f) { return !!f.getGeometry(); });
                args.source.addFeatures(features);
                if (args.map) {
                    var extent_1 = args.map.getView().calculateExtent(args.map.getSize());
                    features.forEach(function (f) { return ol.extent.extend(extent_1, f.getGeometry().getExtent()); });
                    args.map.getView().fit(extent_1, args.map.getSize());
                }
                wfs_sync_1.WfsSync.create({
                    wfsUrl: WFS_INFO.wfsUrl,
                    featureNS: WFS_INFO.featureNS,
                    featurePrefix: WFS_INFO.featurePrefix,
                    srsName: WFS_INFO.srsName,
                    sourceSrs: WFS_INFO.srsName,
                    source: args.source,
                    targets: (_a = {},
                        _a[args.geometryType] = args.featureType,
                        _a),
                    converter: args.converter
                });
                var _a;
            }
        });
    }
    function run() {
        var map = mapmaker_2.MapMaker.create({
            target: document.getElementsByClassName("map")[0],
            projection: WFS_INFO.srsName,
            center: [-9167000, 4148000],
            zoom: 21,
            basemap: "osm"
        });
        //▲ ▬ ◇ ● ◯ ▧ ★
        var pointLayer = new ol.layer.Vector({ source: new ol.source.Vector() });
        var lineLayer = new ol.layer.Vector({ source: new ol.source.Vector() });
        var polygonLayer = new ol.layer.Vector({ source: new ol.source.Vector() });
        [polygonLayer, lineLayer, pointLayer].forEach(function (l) {
            map.addLayer(l);
            l.getSource().on("addfeature", function (args) {
                args.feature.set("strname", GROUP_NAME);
            });
        });
        var toolbar = [
            ol3_select_1.Select.create({ map: map, label: "?", eventName: "info", boxSelectCondition: ol.events.condition.primaryAction }),
            ol3_draw_2.Draw.create({
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
            ol3_draw_2.Draw.create({
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
            ol3_draw_2.Draw.create({
                map: map, geometryType: "MultiLineString", label: "▬", title: "Line",
                layers: [lineLayer]
            }),
            ol3_draw_2.Draw.create({
                map: map, geometryType: "Point", label: "●", title: "Point",
                layers: [pointLayer]
            }),
            ol3_draw_2.Draw.create({
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
            ol3_translate_1.Translate.create({ map: map, label: "↔" }),
            ol3_edit_1.Modify.create({ map: map, label: "Δ" }),
            ol3_delete_1.Delete.create({ map: map, label: "␡", boxSelectCondition: ol.events.condition.primaryAction }),
            ol3_button_7.Button.create({ map: map, label: "⎚", title: "Clear", eventName: "clear-drawings" }),
            ol3_button_7.Button.create({ map: map, label: "💾", eventName: "save", title: "Save" }),
            ol3_button_7.Button.create({ map: map, label: "X", eventName: "exit", title: "Exit" }),
        ];
        toolbar.forEach(function (t, i) { return t.setPosition("left top" + (-i * 2 || '')); });
        ol3_note_1.Note.create({
            map: map, position: "left-2 top", layer: pointLayer, noteFieldName: "url"
        });
        {
            var h_2 = common_11.cssin("ol3-draw", "\n        .ol-zoom { top: 0.5em; right: 0.5em; left: auto;}\n        .ol-zoom button {color: rgba(0,60,136,1); background-color: transparent; }\n        .ol-overviewmap { right: .5em; top: 4.5em; left: auto; bottom: auto;}\n        ");
            map.on("exit", function () {
                toolbar.forEach(function (t) { return t.destroy(); });
                h_2();
            });
            map.on("info", function (args) {
                if (args.control.get("active")) {
                    stopOtherControls(map, args.control);
                    stopControl(map, ol3_draw_2.Draw);
                    stopControl(map, ol3_delete_1.Delete);
                    stopControl(map, ol3_translate_1.Translate);
                    stopControl(map, ol3_edit_1.Modify);
                }
            });
            map.on("delete-feature", function (args) {
                if (args.control.get("active")) {
                    stopOtherControls(map, args.control);
                    stopControl(map, ol3_draw_2.Draw);
                    stopControl(map, ol3_edit_1.Modify);
                    stopControl(map, ol3_translate_1.Translate);
                    stopControl(map, ol3_select_1.Select);
                }
            });
            map.on("draw-feature", function (args) {
                if (args.control.get("active")) {
                    stopOtherControls(map, args.control);
                    stopControl(map, ol3_delete_1.Delete);
                    stopControl(map, ol3_edit_1.Modify);
                    stopControl(map, ol3_translate_1.Translate);
                    stopControl(map, ol3_select_1.Select);
                }
            });
            map.on("translate-feature", function (args) {
                if (args.control.get("active")) {
                    stopOtherControls(map, args.control);
                    stopControl(map, ol3_delete_1.Delete);
                    stopControl(map, ol3_draw_2.Draw);
                    stopControl(map, ol3_edit_1.Modify);
                    stopControl(map, ol3_select_1.Select);
                }
            });
            map.on("modify-feature", function (args) {
                if (args.control.get("active")) {
                    stopOtherControls(map, args.control);
                    stopControl(map, ol3_delete_1.Delete);
                    stopControl(map, ol3_draw_2.Draw);
                    stopControl(map, ol3_translate_1.Translate);
                    stopControl(map, ol3_select_1.Select);
                }
            });
            map.on("clear-drawings", function (args) {
                if (args.control.get("active")) {
                    stopControl(map, ol3_delete_1.Delete);
                    stopControl(map, ol3_draw_2.Draw);
                    stopControl(map, ol3_translate_1.Translate);
                    stopControl(map, ol3_select_1.Select);
                    if (prompt("Are you sure you want to delete ALL the features?", "No!")) {
                        console.log("Too dangerous, sorry");
                        return false;
                        map.getControls()
                            .getArray()
                            .filter(function (i) { return i instanceof ol3_draw_2.Draw; })
                            .forEach(function (t) { return t.options.layers.forEach(function (l) { return l.getSource().clear(); }); });
                    }
                    ;
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
            converter: function (geom) {
                var poly = ol.geom.Polygon.fromCircle(geom, 8);
                return new ol.geom.MultiPolygon([poly.getCoordinates()]);
            }
        });
    }
    exports.run = run;
});
define("ol3-draw/ol3-history", ["require", "exports", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, common_12) {
    "use strict";
    var NavHistory = (function () {
        function NavHistory(options) {
            var _this = this;
            this.options = options;
            var map = options.map;
            var history = [];
            var history_index = 0;
            var push = function () {
                history_index = history.push({
                    zoom: map.getView().getZoom(),
                    center: map.getView().getCenter()
                });
                console.log("push", history_index);
            };
            // capture current extent
            push();
            var stopped = false;
            var resume = common_12.debounce(function () {
                stopped = false;
                console.log("allow capture");
            }, this.options.delay);
            var goto = function () {
                stopped = true;
                console.log("suspend capture");
                console.log("goto", history_index);
                var extent = history[history_index - 1];
                map.getView().animate({
                    zoom: extent.zoom,
                    center: extent.center,
                    duration: _this.options.delay / 10
                }, resume);
            };
            var capture = common_12.debounce(function () {
                if (stopped) {
                    console.log("capture suspended");
                    return;
                }
                // wipe out everything forward (if anything)
                while (history.length > history_index)
                    history.pop();
                push();
            }, this.options.delay);
            map.getView().on(["change:center", "change:resolution"], function () { return capture(); });
            map.on("nav:back", function () {
                if (history_index <= 1) {
                    console.warn("nothing to navigate back to");
                    return;
                }
                history_index--;
                goto();
            });
            map.on("nav:forward", function () {
                if (history_index >= history.length) {
                    console.warn("nothing to navigate forward to");
                    return;
                }
                history_index++;
                goto();
            });
        }
        NavHistory.create = function (options) {
            options = common_12.defaults({}, options || {}, NavHistory.DEFAULT_OPTIONS);
            return new NavHistory(options);
        };
        return NavHistory;
    }());
    NavHistory.DEFAULT_OPTIONS = {
        delay: 2000
    };
    exports.NavHistory = NavHistory;
});
define("ol3-draw/examples/ol3-history", ["require", "exports", "ol3-draw/ol3-button", "ol3-draw/examples/mapmaker", "ol3-draw/ol3-history"], function (require, exports, ol3_button_8, mapmaker_3, ol3_history_1) {
    "use strict";
    function run() {
        var map = mapmaker_3.MapMaker.create({
            target: document.getElementsByClassName("map")[0],
            projection: "EPSG:3857",
            center: [-9167000, 4148000],
            zoom: 21,
            basemap: "osm"
        });
        ol3_history_1.NavHistory.create({
            map: map,
            delay: 500
        });
        ol3_button_8.Button.create({ map: map, label: "<<", eventName: "nav:back", title: "Back", position: "left-2 top" });
        ol3_button_8.Button.create({ map: map, label: ">>", eventName: "nav:forward", title: "Forward", position: "left-4 top" });
    }
    exports.run = run;
});
//# sourceMappingURL=index.js.map