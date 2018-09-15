var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("node_modules/ol3-fun/ol3-fun/slowloop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function slowloop(functions, interval, cycles) {
        if (interval === void 0) { interval = 1000; }
        if (cycles === void 0) { cycles = 1; }
        var d = $.Deferred();
        var index = 0;
        var cycle = 0;
        if (!functions || 0 >= cycles) {
            d.resolve();
            return d;
        }
        var h = setInterval(function () {
            if (index === functions.length) {
                index = 0;
                if (++cycle === cycles) {
                    d.resolve();
                    clearInterval(h);
                    return;
                }
            }
            try {
                d.notify({ index: index, cycle: cycle });
                functions[index++]();
            }
            catch (ex) {
                clearInterval(h);
                d.reject(ex);
            }
        }, interval);
        return d;
    }
    exports.slowloop = slowloop;
});
define("node_modules/ol3-fun/tests/base", ["require", "exports", "node_modules/ol3-fun/ol3-fun/slowloop"], function (require, exports, slowloop_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.slowloop = slowloop_1.slowloop;
    function describe(title, fn) {
        console.log(title || "undocumented test group");
        return window.describe(title, fn);
    }
    exports.describe = describe;
    function it(title, fn) {
        console.log(title || "undocumented test");
        return window.it(title, fn);
    }
    exports.it = it;
    function should(result, message) {
        console.log(message || "undocumented assertion");
        if (!result)
            throw message;
    }
    exports.should = should;
    function shouldEqual(a, b, message) {
        if (a != b) {
            var msg = "\"" + a + "\" <> \"" + b + "\"";
            message = (message ? message + ": " : "") + msg;
            console.warn(msg);
        }
        should(a == b, message);
    }
    exports.shouldEqual = shouldEqual;
    function shouldThrow(fn, message) {
        try {
            fn();
        }
        catch (ex) {
            should(!!ex, ex);
            return ex;
        }
        should(false, "expected an exception" + (message ? ": " + message : ""));
    }
    exports.shouldThrow = shouldThrow;
    function stringify(o) {
        return JSON.stringify(o, null, "\t");
    }
    exports.stringify = stringify;
});
define("node_modules/ol3-fun/ol3-fun/common", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function uuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    exports.uuid = uuid;
    function asArray(list) {
        var result = new Array(list.length);
        for (var i = 0; i < list.length; i++) {
            result[i] = list[i];
        }
        return result;
    }
    exports.asArray = asArray;
    function toggle(e, className, force) {
        var exists = e.classList.contains(className);
        if (exists && force !== true) {
            e.classList.remove(className);
            return false;
        }
        if (!exists && force !== false) {
            e.classList.add(className);
            return true;
        }
        return exists;
    }
    exports.toggle = toggle;
    function parse(v, type) {
        if (typeof type === "string")
            return v;
        if (typeof type === "number")
            return parseFloat(v);
        if (typeof type === "boolean")
            return (v === "1" || v === "true");
        if (Array.isArray(type)) {
            return v.split(",").map(function (v) { return parse(v, type[0]); });
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
            return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    exports.getParameterByName = getParameterByName;
    function doif(v, cb) {
        if (v !== undefined && v !== null)
            cb(v);
    }
    exports.doif = doif;
    function mixin(a) {
        var b = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            b[_i - 1] = arguments[_i];
        }
        b.forEach(function (b) {
            Object.keys(b).forEach(function (k) { return (a[k] = b[k]); });
        });
        return a;
    }
    exports.mixin = mixin;
    function defaults(a) {
        var b = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            b[_i - 1] = arguments[_i];
        }
        b.forEach(function (b) {
            Object.keys(b)
                .filter(function (k) { return a[k] === undefined; })
                .forEach(function (k) { return (a[k] = b[k]); });
        });
        return a;
    }
    exports.defaults = defaults;
    function debounce(func, wait, immediate) {
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
                    func.apply({}, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = window.setTimeout(later, wait);
            if (callNow)
                func.apply({}, args);
        });
    }
    exports.debounce = debounce;
    function html(html) {
        var a = document.createElement("div");
        a.innerHTML = html;
        return (a.firstElementChild || a.firstChild);
    }
    exports.html = html;
    function pair(a1, a2) {
        var result = new Array(a1.length * a2.length);
        var i = 0;
        a1.forEach(function (v1) { return a2.forEach(function (v2) { return (result[i++] = [v1, v2]); }); });
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
    function shuffle(array) {
        var currentIndex = array.length;
        var temporaryValue;
        var randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    exports.shuffle = shuffle;
});
define("node_modules/ol3-fun/ol3-fun/css", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function cssin(name, css) {
        var id = "style-" + name;
        var styleTag = document.getElementById(id);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = id;
            styleTag.type = "text/css";
            document.head.appendChild(styleTag);
            styleTag.appendChild(document.createTextNode(css));
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
    function loadCss(options) {
        if (!options.url && !options.css)
            throw "must provide either a url or css option";
        if (options.url && options.css)
            throw "cannot provide both a url and a css";
        if (options.name && options.css)
            return cssin(options.name, options.css);
        var id = "style-" + options.name;
        var head = document.getElementsByTagName("head")[0];
        var link = document.getElementById(id);
        if (!link) {
            link = document.createElement("link");
            link.id = id;
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = options.url;
            head.appendChild(link);
        }
        var dataset = link.dataset;
        dataset["count"] = parseInt(dataset["count"] || "0") + 1 + "";
        return function () {
            dataset["count"] = parseInt(dataset["count"] || "0") - 1 + "";
            if (dataset["count"] === "0") {
                link.remove();
            }
        };
    }
    exports.loadCss = loadCss;
});
define("node_modules/ol3-fun/ol3-fun/navigation", ["require", "exports", "openlayers", "jquery", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, ol, $, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function zoomToFeature(map, feature, options) {
        var promise = $.Deferred();
        options = common_1.defaults(options || {}, {
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
                duration: duration,
                callback: function () { return promise.resolve(); }
            });
        };
        if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            doit(options.duration);
        }
        else if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            doit(options.duration);
        }
        else {
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
        return promise;
    }
    exports.zoomToFeature = zoomToFeature;
});
define("node_modules/ol3-fun/ol3-fun/parse-dms", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function decDegFromMatch(m) {
        var signIndex = {
            "-": -1,
            N: 1,
            S: -1,
            E: 1,
            W: -1
        };
        var latLonIndex = {
            "-": "",
            N: "lat",
            S: "lat",
            E: "lon",
            W: "lon"
        };
        var degrees, minutes, seconds, sign, latLon;
        sign = signIndex[m[2]] || signIndex[m[1]] || signIndex[m[6]] || 1;
        degrees = Number(m[3]);
        minutes = m[4] ? Number(m[4]) : 0;
        seconds = m[5] ? Number(m[5]) : 0;
        latLon = latLonIndex[m[1]] || latLonIndex[m[6]];
        if (!inRange(degrees, 0, 180))
            throw "Degrees out of range";
        if (!inRange(minutes, 0, 60))
            throw "Minutes out of range";
        if (!inRange(seconds, 0, 60))
            throw "Seconds out of range";
        return {
            decDeg: sign * (degrees + minutes / 60 + seconds / 3600),
            latLon: latLon
        };
    }
    function inRange(value, a, b) {
        return value >= a && value <= b;
    }
    function toDegreesMinutesAndSeconds(coordinate) {
        var absolute = Math.abs(coordinate);
        var degrees = Math.floor(absolute);
        var minutesNotTruncated = (absolute - degrees) * 60;
        var minutes = Math.floor(minutesNotTruncated);
        var seconds = Math.floor((minutesNotTruncated - minutes) * 60);
        return degrees + " " + minutes + " " + seconds;
    }
    function fromLonLatToDms(lon, lat) {
        var latitude = toDegreesMinutesAndSeconds(lat);
        var latitudeCardinal = lat >= 0 ? "N" : "S";
        var longitude = toDegreesMinutesAndSeconds(lon);
        var longitudeCardinal = lon >= 0 ? "E" : "W";
        return latitude + " " + latitudeCardinal + " " + longitude + " " + longitudeCardinal;
    }
    function fromDmsToLonLat(dmsString) {
        var _a;
        dmsString = dmsString.trim();
        var dmsRe = /([NSEW])?(-)?(\d+(?:\.\d+)?)[°º:d\s]?\s?(?:(\d+(?:\.\d+)?)['’‘′:]\s?(?:(\d{1,2}(?:\.\d+)?)(?:"|″|’’|'')?)?)?\s?([NSEW])?/i;
        var dmsString2;
        var m1 = dmsString.match(dmsRe);
        if (!m1)
            throw "Could not parse string";
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
        if (typeof decDeg1.latLon === "undefined") {
            if (!isNaN(decDeg1.decDeg) && decDeg2 && isNaN(decDeg2.decDeg)) {
                return decDeg1.decDeg;
            }
            else if (!isNaN(decDeg1.decDeg) && decDeg2 && !isNaN(decDeg2.decDeg)) {
                decDeg1.latLon = "lat";
                decDeg2.latLon = "lon";
            }
            else {
                throw "Could not parse string";
            }
        }
        if (typeof decDeg2.latLon === "undefined") {
            decDeg2.latLon = decDeg1.latLon === "lat" ? "lon" : "lat";
        }
        return _a = {},
            _a[decDeg1.latLon] = decDeg1.decDeg,
            _a[decDeg2.latLon] = decDeg2.decDeg,
            _a;
    }
    function parse(value) {
        if (typeof value === "string")
            return fromDmsToLonLat(value);
        return fromLonLatToDms(value.lon, value.lat);
    }
    exports.parse = parse;
});
define("node_modules/ol3-fun/ol3-fun/is-primitive", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isPrimitive(a) {
        switch (typeof a) {
            case "boolean":
                return true;
            case "number":
                return true;
            case "object":
                return null === a;
            case "string":
                return true;
            case "symbol":
                return true;
            case "undefined":
                return true;
            default:
                throw "unknown type: " + typeof a;
        }
    }
    exports.isPrimitive = isPrimitive;
});
define("node_modules/ol3-fun/ol3-fun/is-cyclic", ["require", "exports", "node_modules/ol3-fun/ol3-fun/is-primitive"], function (require, exports, is_primitive_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isCyclic(a) {
        if (is_primitive_1.isPrimitive(a))
            return false;
        var test = function (o, history) {
            if (is_primitive_1.isPrimitive(o))
                return false;
            if (0 <= history.indexOf(o)) {
                return true;
            }
            return Object.keys(o).some(function (k) { return test(o[k], [o].concat(history)); });
        };
        return Object.keys(a).some(function (k) { return test(a[k], [a]); });
    }
    exports.isCyclic = isCyclic;
});
define("node_modules/ol3-fun/ol3-fun/deep-extend", ["require", "exports", "node_modules/ol3-fun/ol3-fun/is-cyclic", "node_modules/ol3-fun/ol3-fun/is-primitive"], function (require, exports, is_cyclic_1, is_primitive_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function extend(a, b, trace, history) {
        if (history === void 0) { history = []; }
        if (!b) {
            b = a;
            a = {};
        }
        var merger = new Merger(trace, history);
        return merger.deepExtend(a, b, []);
    }
    exports.extend = extend;
    function isUndefined(a) {
        return typeof a === "undefined";
    }
    function isArray(val) {
        return Array.isArray(val);
    }
    function isHash(val) {
        return !is_primitive_2.isPrimitive(val) && !canClone(val) && !isArray(val);
    }
    function canClone(val) {
        if (val instanceof Date)
            return true;
        if (val instanceof RegExp)
            return true;
        return false;
    }
    function clone(val) {
        if (val instanceof Date)
            return new Date(val.getTime());
        if (val instanceof RegExp)
            return new RegExp(val.source);
        throw "unclonable type encounted: " + typeof val;
    }
    var Merger = (function () {
        function Merger(traceItems, history) {
            this.traceItems = traceItems;
            this.history = history;
        }
        Merger.prototype.trace = function (item) {
            if (this.traceItems) {
                this.traceItems.push(item);
            }
            return item.path;
        };
        Merger.prototype.deepExtend = function (target, source, path) {
            var _this = this;
            if (target === source)
                return target;
            if (!target || (!isHash(target) && !isArray(target))) {
                throw "first argument must be an object";
            }
            if (!source || (!isHash(source) && !isArray(source))) {
                throw "second argument must be an object";
            }
            if (typeof source === "function") {
                return target;
            }
            this.push(source);
            if (isArray(source)) {
                if (!isArray(target)) {
                    throw "attempting to merge an array into a non-array";
                }
                this.mergeArray("id", target, source, path);
                return target;
            }
            else if (isArray(target)) {
                throw "attempting to merge a non-array into an array";
            }
            Object.keys(source).forEach(function (k) { return _this.mergeChild(k, target, source[k], [k].concat(path)); });
            return target;
        };
        Merger.prototype.cloneArray = function (val, path) {
            var _this = this;
            this.push(val);
            return val.map(function (v) {
                if (is_primitive_2.isPrimitive(v))
                    return v;
                if (isHash(v))
                    return _this.deepExtend({}, v, path);
                if (isArray(v))
                    return _this.cloneArray(v, path);
                if (canClone(v))
                    return clone(v);
                throw "unknown type encountered: " + typeof v;
            });
        };
        Merger.prototype.push = function (a) {
            if (is_primitive_2.isPrimitive(a))
                return;
            if (-1 < this.history.indexOf(a)) {
                if (is_cyclic_1.isCyclic(a)) {
                    throw "circular reference detected";
                }
            }
            else
                this.history.push(a);
        };
        Merger.prototype.mergeChild = function (key, target, sourceValue, path) {
            var targetValue = target[key];
            if (sourceValue === targetValue)
                return;
            if (is_primitive_2.isPrimitive(sourceValue)) {
                path = this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            if (canClone(sourceValue)) {
                sourceValue = clone(sourceValue);
                path = this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            if (isArray(sourceValue)) {
                if (isArray(targetValue)) {
                    this.deepExtend(targetValue, sourceValue, path);
                    return;
                }
                sourceValue = this.cloneArray(sourceValue, path);
                path = this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            if (!isHash(sourceValue)) {
                throw "unexpected source type: " + typeof sourceValue;
            }
            if (!isHash(targetValue)) {
                var merger = new Merger(null, this.history);
                sourceValue = merger.deepExtend({}, sourceValue, path);
                path = this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            this.deepExtend(targetValue, sourceValue, path);
            return;
        };
        Merger.prototype.mergeArray = function (key, target, source, path) {
            var _this = this;
            if (!isArray(target))
                throw "target must be an array";
            if (!isArray(source))
                throw "input must be an array";
            if (!source.length)
                return target;
            var hash = {};
            target.forEach(function (item, i) {
                if (!item[key])
                    return;
                hash[item[key]] = i;
            });
            source.forEach(function (sourceItem, i) {
                var sourceKey = sourceItem[key];
                var targetIndex = hash[sourceKey];
                if (isUndefined(sourceKey)) {
                    if (isHash(target[i]) && !!target[i][key]) {
                        throw "cannot replace an identified array item with a non-identified array item";
                    }
                    _this.mergeChild(i, target, sourceItem, path);
                    return;
                }
                if (isUndefined(targetIndex)) {
                    _this.mergeChild(target.length, target, sourceItem, path);
                    return;
                }
                _this.mergeChild(targetIndex, target, sourceItem, path);
                return;
            });
            return target;
        };
        return Merger;
    }());
});
define("node_modules/ol3-fun/index", ["require", "exports", "node_modules/ol3-fun/ol3-fun/common", "node_modules/ol3-fun/ol3-fun/css", "node_modules/ol3-fun/ol3-fun/navigation", "node_modules/ol3-fun/ol3-fun/parse-dms", "node_modules/ol3-fun/ol3-fun/slowloop", "node_modules/ol3-fun/ol3-fun/deep-extend"], function (require, exports, common_2, css_1, navigation_1, parse_dms_1, slowloop_2, deep_extend_1) {
    "use strict";
    var index = {
        asArray: common_2.asArray,
        cssin: css_1.cssin,
        loadCss: css_1.loadCss,
        debounce: common_2.debounce,
        defaults: common_2.defaults,
        doif: common_2.doif,
        deepExtend: deep_extend_1.extend,
        getParameterByName: common_2.getParameterByName,
        getQueryParameters: common_2.getQueryParameters,
        html: common_2.html,
        mixin: common_2.mixin,
        pair: common_2.pair,
        parse: common_2.parse,
        range: common_2.range,
        shuffle: common_2.shuffle,
        toggle: common_2.toggle,
        uuid: common_2.uuid,
        slowloop: slowloop_2.slowloop,
        dms: {
            parse: parse_dms_1.parse,
            fromDms: function (dms) { return parse_dms_1.parse(dms); },
            fromLonLat: function (o) { return parse_dms_1.parse(o); }
        },
        navigation: {
            zoomToFeature: navigation_1.zoomToFeature
        }
    };
    return index;
});
define("node_modules/ol3-symbolizer/ol3-symbolizer/common/assign", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function assign(obj, prop, value) {
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
                var points = value["points"];
                if (points < Infinity) {
                    prop = "star";
                }
            }
        }
        obj[prop] = value;
    }
    exports.assign = assign;
});
define("node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-cross", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Shapeshifter = (function () {
        function Shapeshifter() {
        }
        Shapeshifter.is = function (style) {
            if (!style)
                return false;
            if (!!style.cross)
                return true;
            if (!style.star)
                return false;
            if (!style.star.radius)
                return false;
            if (4 !== style.star.points)
                return false;
            if (0 != style.star.radius2)
                return false;
            if (0 != style.star.angle)
                return false;
            return true;
        };
        Shapeshifter.as = function (style) {
            var star = style.star;
            if (!star)
                throw "star expected";
            var result = {
                cross: {
                    size: star.radius * 2,
                    opacity: star.opacity,
                    rotateWithView: star.rotateWithView,
                    rotation: star.rotation,
                    scale: star.scale,
                    snapToPixel: star.snapToPixel,
                    stroke: star.stroke,
                }
            };
            return result;
        };
        Shapeshifter.inverse = function (style) {
            var cross = style.cross;
            if (!cross)
                return style;
            return {
                star: {
                    radius: cross.size / 2,
                    radius2: 0,
                    points: 4,
                    angle: 0,
                    opacity: cross.opacity,
                    rotateWithView: cross.rotateWithView,
                    rotation: cross.rotation,
                    scale: cross.scale,
                    snapToPixel: cross.snapToPixel,
                    stroke: cross.stroke,
                }
            };
        };
        return Shapeshifter;
    }());
    exports.Shapeshifter = Shapeshifter;
});
define("node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-square", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Shapeshifter = (function () {
        function Shapeshifter() {
        }
        Shapeshifter.is = function (style) {
            if (!style)
                return false;
            if (!!style.square)
                return true;
            if (!style.star)
                return false;
            if (!style.star.radius)
                return false;
            if (4 !== style.star.points)
                return false;
            if (undefined !== style.star.radius2)
                return false;
            if (0.7853981633974483 != style.star.angle)
                return false;
            return true;
        };
        Shapeshifter.as = function (style) {
            var star = style.star;
            if (!star)
                throw "star expected";
            var result = {
                square: {
                    size: star.radius * 2,
                    fill: star.fill,
                    opacity: star.opacity,
                    rotateWithView: star.rotateWithView,
                    rotation: star.rotation,
                    scale: star.scale,
                    snapToPixel: star.snapToPixel,
                    stroke: star.stroke,
                }
            };
            return result;
        };
        Shapeshifter.inverse = function (style) {
            var square = style.square;
            if (!square)
                return style;
            return {
                star: {
                    radius: square.size / 2,
                    radius2: undefined,
                    points: 4,
                    angle: 0.7853981633974483,
                    fill: square.fill,
                    opacity: square.opacity,
                    rotateWithView: square.rotateWithView,
                    rotation: square.rotation,
                    scale: square.scale,
                    snapToPixel: square.snapToPixel,
                    stroke: square.stroke,
                }
            };
        };
        return Shapeshifter;
    }());
    exports.Shapeshifter = Shapeshifter;
});
define("node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-diamond", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Shapeshifter = (function () {
        function Shapeshifter() {
        }
        Shapeshifter.is = function (style) {
            if (!style)
                return false;
            if (!!style.diamond)
                return true;
            if (!style.star)
                return false;
            if (!style.star.radius)
                return false;
            if (4 !== style.star.points)
                return false;
            if (undefined !== style.star.radius2)
                return false;
            if (0 != style.star.angle)
                return false;
            return true;
        };
        Shapeshifter.as = function (style) {
            var star = style.star;
            if (!star)
                throw "star expected";
            var result = {
                diamond: {
                    size: style.star.radius * 2,
                    fill: star.fill,
                    opacity: star.opacity,
                    rotateWithView: star.rotateWithView,
                    rotation: star.rotation,
                    scale: star.scale,
                    snapToPixel: star.snapToPixel,
                    stroke: star.stroke,
                }
            };
            return result;
        };
        Shapeshifter.inverse = function (style) {
            var diamond = style.diamond;
            if (!diamond)
                return style;
            return {
                star: {
                    radius: diamond.size / 2,
                    radius2: undefined,
                    points: 4,
                    angle: 0,
                    fill: diamond.fill,
                    opacity: diamond.opacity,
                    rotateWithView: diamond.rotateWithView,
                    rotation: diamond.rotation,
                    scale: diamond.scale,
                    snapToPixel: diamond.snapToPixel,
                    stroke: diamond.stroke,
                }
            };
        };
        return Shapeshifter;
    }());
    exports.Shapeshifter = Shapeshifter;
});
define("node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-triangle", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Shapeshifter = (function () {
        function Shapeshifter() {
        }
        Shapeshifter.is = function (style) {
            if (!style)
                return false;
            if (!!style.triangle)
                return true;
            if (!style.star)
                return false;
            if (!style.star.radius)
                return false;
            if (3 !== style.star.points)
                return false;
            if (undefined != style.star.radius2)
                return false;
            if (0 != style.star.angle)
                return false;
            return true;
        };
        Shapeshifter.as = function (style) {
            var star = style.star;
            if (!star)
                throw "star expected";
            var result = {
                triangle: {
                    size: star.radius * 2,
                    fill: star.fill,
                    opacity: star.opacity,
                    rotateWithView: star.rotateWithView,
                    rotation: star.rotation,
                    scale: star.scale,
                    snapToPixel: star.snapToPixel,
                    stroke: star.stroke,
                }
            };
            return result;
        };
        Shapeshifter.inverse = function (style) {
            var triangle = style.triangle;
            if (!triangle)
                return style;
            return {
                star: {
                    radius: triangle.size / 2,
                    radius2: undefined,
                    points: 3,
                    angle: 0,
                    fill: triangle.fill,
                    opacity: triangle.opacity,
                    rotateWithView: triangle.rotateWithView,
                    rotation: triangle.rotation,
                    scale: triangle.scale,
                    snapToPixel: triangle.snapToPixel,
                    stroke: triangle.stroke,
                }
            };
        };
        return Shapeshifter;
    }());
    exports.Shapeshifter = Shapeshifter;
});
define("node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-x", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Shapeshifter = (function () {
        function Shapeshifter() {
        }
        Shapeshifter.is = function (style) {
            if (!style)
                return false;
            if (!!style.x)
                return true;
            if (!style.star)
                return false;
            if (!style.star.radius)
                return false;
            if (4 !== style.star.points)
                return false;
            if (0 != style.star.radius2)
                return false;
            if (0.7853981633974483 != style.star.angle)
                return false;
            return true;
        };
        Shapeshifter.as = function (style) {
            var star = style.star;
            if (!star)
                throw "star expected";
            var result = {
                x: {
                    size: star.radius * 2,
                    opacity: star.opacity,
                    rotateWithView: star.rotateWithView,
                    rotation: star.rotation,
                    scale: star.scale,
                    snapToPixel: star.snapToPixel,
                    stroke: star.stroke,
                }
            };
            return result;
        };
        Shapeshifter.inverse = function (style) {
            var x = style.x;
            if (!x)
                return style;
            return {
                star: {
                    radius: x.size / 2,
                    radius2: 0,
                    points: 4,
                    angle: 0.7853981633974483,
                    opacity: x.opacity,
                    rotateWithView: x.rotateWithView,
                    rotation: x.rotation,
                    scale: x.scale,
                    snapToPixel: x.snapToPixel,
                    stroke: x.stroke,
                }
            };
        };
        return Shapeshifter;
    }());
    exports.Shapeshifter = Shapeshifter;
});
define("node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer", ["require", "exports", "openlayers", "node_modules/ol3-symbolizer/ol3-symbolizer/common/assign", "node_modules/ol3-fun/index", "node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-cross", "node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-square", "node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-diamond", "node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-triangle", "node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-x"], function (require, exports, ol, assign_1, index_1, as_cross_1, as_square_1, as_diamond_1, as_triangle_1, as_x_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StyleConverter = (function () {
        function StyleConverter() {
            this.converters = [];
            this.converters.push(as_cross_1.Shapeshifter);
            this.converters.push(as_square_1.Shapeshifter);
            this.converters.push(as_diamond_1.Shapeshifter);
            this.converters.push(as_triangle_1.Shapeshifter);
            this.converters.push(as_x_1.Shapeshifter);
        }
        StyleConverter.prototype.fromJson = function (json) {
            this.converters.some(function (c) { return c.is(json) && c.inverse && !!(json = c.inverse(json)); });
            return this.deserializeStyle(json);
        };
        StyleConverter.prototype.toJson = function (style) {
            var result = this.serializeStyle(style);
            this.converters.some(function (c) { return c.is(result) && c.as && !!(result = c.as(result)); });
            return result;
        };
        StyleConverter.prototype.getGeometry = function (feature) {
            var geom = feature.getGeometry();
            if (geom instanceof ol.geom.Polygon) {
                geom = geom.getInteriorPoint();
            }
            return geom;
        };
        StyleConverter.prototype.serializeStyle = function (style) {
            var s = {};
            if (!style)
                return null;
            if (typeof style === "string")
                throw style;
            if (typeof style === "number")
                throw style;
            if (style.getColor)
                index_1.mixin(s, this.serializeColor(style.getColor()));
            if (style.getImage)
                assign_1.assign(s, "image", this.serializeImage(style.getImage()));
            if (style.getFill)
                assign_1.assign(s, "fill", this.serializeFill(style.getFill()));
            if (style.getOpacity)
                assign_1.assign(s, "opacity", style.getOpacity());
            if (style.getStroke)
                assign_1.assign(s, "stroke", this.serializeStroke(style.getStroke()));
            if (style.getText)
                assign_1.assign(s, "text", this.serializeText(style.getText()));
            if (style.getWidth)
                assign_1.assign(s, "width", style.getWidth());
            if (style.getOffsetX)
                assign_1.assign(s, "offset-x", style.getOffsetX());
            if (style.getOffsetY)
                assign_1.assign(s, "offset-y", style.getOffsetY());
            if (style.getWidth)
                assign_1.assign(s, "width", style.getWidth());
            if (style.getFont)
                assign_1.assign(s, "font", style.getFont());
            if (style.getRadius)
                assign_1.assign(s, "radius", style.getRadius());
            if (style.getRadius2)
                assign_1.assign(s, "radius2", style.getRadius2());
            if (style.getPoints)
                assign_1.assign(s, "points", style.getPoints());
            if (style.getAngle)
                assign_1.assign(s, "angle", style.getAngle());
            if (style.getRotation)
                assign_1.assign(s, "rotation", style.getRotation());
            if (style.getOrigin)
                assign_1.assign(s, "origin", style.getOrigin());
            if (style.getScale)
                assign_1.assign(s, "scale", style.getScale());
            if (style.getSize)
                assign_1.assign(s, "size", style.getSize());
            if (style.getAnchor) {
                assign_1.assign(s, "anchor", style.getAnchor());
                "anchorXUnits,anchorYUnits,anchorOrigin".split(",").forEach(function (k) {
                    assign_1.assign(s, k, style[k + "_"]);
                });
            }
            if (style.path) {
                if (style.path)
                    assign_1.assign(s, "path", style.path);
                if (style.getImageSize)
                    assign_1.assign(s, "imgSize", style.getImageSize());
                if (style.stroke)
                    assign_1.assign(s, "stroke", style.stroke);
                if (style.fill)
                    assign_1.assign(s, "fill", style.fill);
                if (style.scale)
                    assign_1.assign(s, "scale", style.scale);
                if (style.imgSize)
                    assign_1.assign(s, "imgSize", style.imgSize);
            }
            if (style.getSrc)
                assign_1.assign(s, "src", style.getSrc());
            return s;
        };
        StyleConverter.prototype.serializeImage = function (style) {
            if (typeof style === "string")
                throw style;
            if (typeof style === "number")
                throw style;
            return this.serializeStyle(style);
        };
        StyleConverter.prototype.serializeStroke = function (style) {
            if (typeof style === "string")
                throw style;
            if (typeof style === "number")
                throw style;
            return this.serializeStyle(style);
        };
        StyleConverter.prototype.serializeText = function (style) {
            return style;
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
            image && s.setGeometry(function (feature) { return _this.getGeometry(feature); });
            return s;
        };
        StyleConverter.prototype.deserializeText = function (json) {
            var _a;
            json.rotation = json.rotation || 0;
            json.scale = json.scale || 1;
            var _b = [json["offset-x"] || 0, json["offset-y"] || 0], x = _b[0], y = _b[1];
            {
                var p = new ol.geom.Point([x, y]);
                p.rotate(json.rotation, [0, 0]);
                p.scale(json.scale, json.scale);
                _a = p.getCoordinates(), x = _a[0], y = _a[1];
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
            index_1.doif(json.rotation, function (v) { return image.setRotation(v); });
            index_1.doif(json.opacity, function (v) { return image.setOpacity(v); });
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
            var _a;
            json.rotation = json.rotation || 0;
            json.scale = json.scale || 1;
            if (json.img) {
                var symbol = document.getElementById(json.img);
                if (!symbol) {
                    throw "unable to find svg element: " + json.img;
                }
                if (symbol) {
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
                    _a = json.imgSize.map(function (v) { return v * json.scale; }), canvas.width = _a[0], canvas.height = _a[1];
                    if (json.stroke && json.stroke.width) {
                        var dx = 2 * json.stroke.width * json.scale;
                        canvas.width += dx;
                        canvas.height += dx;
                    }
                }
                var ctx = canvas.getContext('2d');
                var path2d = new Path2D(json.path);
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
                offset: json.offset,
                offsetOrigin: json.offsetOrigin,
                opacity: json.opacity,
                snapToPixel: json.snapToPixel,
                rotateWithView: json.rotateWithView,
                size: [canvas.width, canvas.height],
                src: undefined
            });
            return index_1.mixin(icon, {
                path: json.path,
                stroke: json.stroke,
                fill: json.fill,
                scale: json.scale,
                imgSize: json.imgSize
            });
        };
        StyleConverter.prototype.deserializeFill = function (json) {
            var fill = new ol.style.Fill({
                color: json && this.deserializeColor(json)
            });
            return fill;
        };
        StyleConverter.prototype.deserializeStroke = function (json) {
            var stroke = new ol.style.Stroke();
            index_1.doif(json.color, function (v) { return stroke.setColor(v); });
            index_1.doif(json.lineCap, function (v) { return stroke.setLineCap(v); });
            index_1.doif(json.lineDash, function (v) { return stroke.setLineDash(v); });
            index_1.doif(json.lineJoin, function (v) { return stroke.setLineJoin(v); });
            index_1.doif(json.miterLimit, function (v) { return stroke.setMiterLimit(v); });
            index_1.doif(json.width, function (v) { return stroke.setWidth(v); });
            return stroke;
        };
        StyleConverter.prototype.deserializeColor = function (fill) {
            var _a;
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
                    index_1.mixin(gradient_1, {
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
                var context_1 = canvas.getContext('2d');
                context_1.fillStyle = fill.pattern.color;
                switch (fill.pattern.orientation) {
                    case "horizontal":
                        for (var i = 0; i < spacing; i++) {
                            context_1.fillRect(i, 0, 1, 1);
                        }
                        break;
                    case "vertical":
                        for (var i = 0; i < spacing; i++) {
                            context_1.fillRect(0, i, 1, 1);
                        }
                        break;
                    case "cross":
                        for (var i = 0; i < spacing; i++) {
                            context_1.fillRect(i, 0, 1, 1);
                            context_1.fillRect(0, i, 1, 1);
                        }
                        break;
                    case "forward":
                        for (var i = 0; i < spacing; i++) {
                            context_1.fillRect(i, i, 1, 1);
                        }
                        break;
                    case "backward":
                        for (var i = 0; i < spacing; i++) {
                            context_1.fillRect(spacing - 1 - i, i, 1, 1);
                        }
                        break;
                    case "diagonal":
                        for (var i = 0; i < spacing; i++) {
                            context_1.fillRect(i, i, 1, 1);
                            context_1.fillRect(spacing - 1 - i, i, 1, 1);
                        }
                        break;
                }
                return index_1.mixin(context_1.createPattern(canvas, repitition), fill.pattern);
            }
            if (fill.image) {
                var canvas = document.createElement('canvas');
                var _b = (_a = fill.image.imgSize, canvas.width = _a[0], canvas.height = _a[1], _a), w_1 = _b[0], h_1 = _b[1];
                var context_2 = canvas.getContext('2d');
                var _c = [0, 0], dx = _c[0], dy = _c[1];
                var image_1 = document.createElement("img");
                image_1.src = fill.image.imageData;
                image_1.onload = function () { return context_2.drawImage(image_1, 0, 0, w_1, h_1); };
                return "rgba(255,255,255,0.1)";
            }
            throw "invalid color configuration";
        };
        StyleConverter.prototype.deserializeLinearGradient = function (json) {
            var rx = /\w+\((.*)\)/m;
            var _a = JSON.parse(json.type.replace(rx, "[$1]")), x0 = _a[0], y0 = _a[1], x1 = _a[2], y1 = _a[3];
            var canvas = document.createElement('canvas');
            canvas.width = Math.max(x0, x1);
            canvas.height = Math.max(y0, y1);
            var context = canvas.getContext('2d');
            var gradient = context.createLinearGradient(x0, y0, x1, y1);
            index_1.mixin(gradient, {
                type: "linear(" + [x0, y0, x1, y1].join(",") + ")"
            });
            return gradient;
        };
        StyleConverter.prototype.deserializeRadialGradient = function (json) {
            var rx = /radial\((.*)\)/m;
            var _a = JSON.parse(json.type.replace(rx, "[$1]")), x0 = _a[0], y0 = _a[1], r0 = _a[2], x1 = _a[3], y1 = _a[4], r1 = _a[5];
            var canvas = document.createElement('canvas');
            canvas.width = 2 * Math.max(x0, x1);
            canvas.height = 2 * Math.max(y0, y1);
            var context = canvas.getContext('2d');
            var gradient = context.createRadialGradient(x0, y0, r0, x1, y1, r1);
            index_1.mixin(gradient, {
                type: "radial(" + [x0, y0, r0, x1, y1, r1].join(",") + ")"
            });
            return gradient;
        };
        return StyleConverter;
    }());
    exports.StyleConverter = StyleConverter;
});
define("ol3-draw/ol3-button", ["require", "exports", "openlayers", "node_modules/ol3-fun/index", "node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer"], function (require, exports, ol, index_2, ol3_symbolizer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(options) {
            var _this = _super.call(this, options) || this;
            _this.options = options;
            _this.handlers = [];
            _this.symbolizer = new ol3_symbolizer_1.StyleConverter();
            _this.cssin();
            options.element.className = options.className + " " + options.position;
            var button = index_2.html("<input type=\"button\" value=\"" + options.label + "\" />");
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
            options = index_2.mixin(index_2.mixin({}, Button.DEFAULT_OPTIONS), options || {});
            options.element = options.element || document.createElement("DIV");
            var button = new options.buttonType(options);
            if (options.map) {
                options.map.addControl(button);
            }
            return button;
        };
        Button.prototype.setPosition = function (position) {
            var _this = this;
            this.options.position.split(" ").forEach(function (k) { return _this.options.element.classList.remove(k); });
            position.split(" ").forEach(function (k) { return _this.options.element.classList.add(k); });
            this.options.position = position;
        };
        Button.prototype.destroy = function () {
            this.handlers.forEach(function (h) { return h(); });
            this.setTarget(null);
        };
        Button.prototype.cssin = function () {
            var className = this.options.className;
            var positions = index_2.pair("top left right bottom".split(" "), index_2.range(24)).map(function (pos) { return "." + className + "." + (pos[0] + (-pos[1] || "")) + " { " + pos[0] + ":" + (0.5 + pos[1]) + "em; }"; });
            this.handlers.push(index_2.cssin(className, "\n            ." + className + " {\n                position: absolute;\n                background-color: rgba(255,255,255,.4);\n            }\n            ." + className + ".active {\n                background-color: white;\n            }\n            ." + className + ":hover {\n                background-color: white;\n            }\n            ." + className + " input[type=\"button\"] {\n                color: rgba(0,60,136,1);\n                background: transparent;\n                border: none;\n                width: 2em;\n                height: 2em;\n            }\n            " + positions.join("\n") + "\n        "));
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
        Button.DEFAULT_OPTIONS = {
            className: "ol-button",
            position: "top right",
            label: "Button",
            title: "Button",
            eventName: "click:button",
            buttonType: Button
        };
        return Button;
    }(ol.control.Control));
    exports.Button = Button;
});
define("node_modules/ol3-symbolizer/ol3-symbolizer/format/ags-symbolizer", ["require", "exports", "node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer"], function (require, exports, Symbolizer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var symbolizer = new Symbolizer.StyleConverter();
    var styleMap = {
        esriSMSCircle: "circle",
        esriSMSDiamond: "diamond",
        esriSMSX: "x",
        esriSMSCross: "cross",
        esriSLSSolid: "solid",
        esriSFSSolid: "solid",
        esriSLSDot: "dot",
        esriSLSDash: "dash",
        esriSLSDashDot: "dashdot",
        esriSLSDashDotDot: "dashdotdot",
        esriSFSBackwardDiagonal: "backward-diagonal",
        esriSFSForwardDiagonal: "forward-diagonal"
    };
    var typeMap = {
        esriSMS: "sms",
        esriSLS: "sls",
        esriSFS: "sfs",
        esriPMS: "pms",
        esriPFS: "pfs",
        esriTS: "txt"
    };
    function range(a, b) {
        var result = new Array(b - a + 1);
        while (a <= b)
            result.push(a++);
        return result;
    }
    function clone(o) {
        return JSON.parse(JSON.stringify(o));
    }
    var StyleConverter = (function () {
        function StyleConverter() {
        }
        StyleConverter.prototype.asWidth = function (v) {
            return (v * 4) / 3;
        };
        StyleConverter.prototype.asColor = function (color) {
            if (color.length === 4)
                return "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] / 255 + ")";
            if (color.length === 3)
                return "rgb(" + color[0] + "," + color[1] + "," + color[2] + "})";
            return "#" + color.map(function (v) { return ("0" + v.toString(16)).substr(0, 2); }).join("");
        };
        StyleConverter.prototype.fromSFSSolid = function (symbol, style) {
            style.fill = {
                color: this.asColor(symbol.color)
            };
            this.fromSLS(symbol.outline, style);
        };
        StyleConverter.prototype.fromSFSForwardDiagonal = function (symbol, style) {
            style.fill = {
                pattern: {
                    color: this.asColor(symbol.color),
                    orientation: "forward",
                    spacing: 3,
                    repitition: "repeat"
                }
            };
            this.fromSLS(symbol.outline, style);
        };
        StyleConverter.prototype.fromSFSBackwardDiagonal = function (symbol, style) {
            style.fill = {
                pattern: {
                    color: this.asColor(symbol.color),
                    orientation: "backward",
                    spacing: 3,
                    repitition: "repeat"
                }
            };
            this.fromSLS(symbol.outline, style);
        };
        StyleConverter.prototype.fromSFS = function (symbol, style) {
            switch (symbol.style) {
                case "esriSFSSolid":
                    this.fromSFSSolid(symbol, style);
                    break;
                case "esriSFSForwardDiagonal":
                    this.fromSFSForwardDiagonal(symbol, style);
                    break;
                case "esriSFSBackwardDiagonal":
                    this.fromSFSBackwardDiagonal(symbol, style);
                    break;
                default:
                    throw "invalid-style: " + symbol.style;
            }
        };
        StyleConverter.prototype.fromSMSCircle = function (symbol, style) {
            style.circle = {
                opacity: 1,
                radius: this.asWidth(symbol.size / 2),
                stroke: {
                    color: this.asColor(symbol.outline.color)
                },
                snapToPixel: true
            };
            this.fromSFSSolid(symbol, style.circle);
            this.fromSLS(symbol.outline, style.circle);
        };
        StyleConverter.prototype.fromSMSCross = function (symbol, style) {
            style.star = {
                points: 4,
                angle: 0,
                radius: this.asWidth(symbol.size / Math.sqrt(2)),
                radius2: 0
            };
            this.fromSFSSolid(symbol, style.star);
            this.fromSLS(symbol.outline, style.star);
        };
        StyleConverter.prototype.fromSMSDiamond = function (symbol, style) {
            style.star = {
                points: 4,
                angle: 0,
                radius: this.asWidth(symbol.size / Math.sqrt(2)),
                radius2: this.asWidth(symbol.size / Math.sqrt(2))
            };
            this.fromSFSSolid(symbol, style.star);
            this.fromSLS(symbol.outline, style.star);
        };
        StyleConverter.prototype.fromSMSPath = function (symbol, style) {
            var size = 2 * this.asWidth(symbol.size);
            style.svg = {
                imgSize: [size, size],
                path: symbol.path,
                rotation: symbol.angle
            };
            this.fromSLSSolid(symbol, style.svg);
            this.fromSLS(symbol.outline, style.svg);
        };
        StyleConverter.prototype.fromSMSSquare = function (symbol, style) {
            style.star = {
                points: 4,
                angle: Math.PI / 4,
                radius: this.asWidth(symbol.size / Math.sqrt(2)),
                radius2: this.asWidth(symbol.size / Math.sqrt(2))
            };
            this.fromSFSSolid(symbol, style.star);
            this.fromSLS(symbol.outline, style.star);
        };
        StyleConverter.prototype.fromSMSX = function (symbol, style) {
            style.star = {
                points: 4,
                angle: Math.PI / 4,
                radius: this.asWidth(symbol.size / Math.sqrt(2)),
                radius2: 0
            };
            this.fromSFSSolid(symbol, style.star);
            this.fromSLS(symbol.outline, style.star);
        };
        StyleConverter.prototype.fromSMS = function (symbol, style) {
            switch (symbol.style) {
                case "esriSMSCircle":
                    this.fromSMSCircle(symbol, style);
                    break;
                case "esriSMSCross":
                    this.fromSMSCross(symbol, style);
                    break;
                case "esriSMSDiamond":
                    this.fromSMSDiamond(symbol, style);
                    break;
                case "esriSMSPath":
                    this.fromSMSPath(symbol, style);
                    break;
                case "esriSMSSquare":
                    this.fromSMSSquare(symbol, style);
                    break;
                case "esriSMSX":
                    this.fromSMSX(symbol, style);
                    break;
                default:
                    throw "invalid-style: " + symbol.style;
            }
        };
        StyleConverter.prototype.fromPMS = function (symbol, style) {
            style.image = {};
            style.image.src = symbol.url;
            if (symbol.imageData) {
                style.image.src = "data:image/png;base64," + symbol.imageData;
            }
            style.image["anchor-x"] = this.asWidth(symbol.xoffset);
            style.image["anchor-y"] = this.asWidth(symbol.yoffset);
            style.image.imgSize = [this.asWidth(symbol.width), this.asWidth(symbol.height)];
        };
        StyleConverter.prototype.fromSLSSolid = function (symbol, style) {
            style.stroke = {
                color: this.asColor(symbol.color),
                width: this.asWidth(symbol.width),
                lineDash: [],
                lineJoin: "",
                miterLimit: 4
            };
        };
        StyleConverter.prototype.fromSLS = function (symbol, style) {
            switch (symbol.style) {
                case "esriSLSSolid":
                    this.fromSLSSolid(symbol, style);
                    break;
                case "esriSLSDot":
                    this.fromSLSSolid(symbol, style);
                    break;
                case "esriSLSDash":
                    this.fromSLSSolid(symbol, style);
                    break;
                case "esriSLSDashDot":
                    this.fromSLSSolid(symbol, style);
                    break;
                case "esriSLSDashDotDot":
                    this.fromSLSSolid(symbol, style);
                    break;
                default:
                    this.fromSLSSolid(symbol, style);
                    console.warn("invalid-style: " + symbol.style);
                    break;
            }
        };
        StyleConverter.prototype.fromPFS = function (symbol, style) {
            style.fill = {
                image: {
                    src: symbol.url,
                    imageData: symbol.imageData && "data:image/png;base64," + symbol.imageData,
                    "anchor-x": this.asWidth(symbol.xoffset),
                    "anchor-y": this.asWidth(symbol.yoffset),
                    imgSize: [this.asWidth(symbol.width), this.asWidth(symbol.height)]
                }
            };
            this.fromSLS(symbol.outline, style);
        };
        StyleConverter.prototype.fromTS = function (symbol, style) {
            throw "not-implemented";
        };
        StyleConverter.prototype.fromJson = function (symbol) {
            var style = {};
            this.fromSymbol(symbol, style);
            return symbolizer.fromJson(style);
        };
        StyleConverter.prototype.fromSymbol = function (symbol, style) {
            switch (symbol.type) {
                case "esriSFS":
                    this.fromSFS(symbol, style);
                    break;
                case "esriSLS":
                    this.fromSLS(symbol, style);
                    break;
                case "esriPMS":
                    this.fromPMS(symbol, style);
                    break;
                case "esriPFS":
                    this.fromPFS(symbol, style);
                    break;
                case "esriSMS":
                    this.fromSMS(symbol, style);
                    break;
                case "esriTS":
                    this.fromTS(symbol, style);
                    break;
                default:
                    throw "invalid-symbol-type: " + symbol.type;
            }
        };
        StyleConverter.prototype.fromRenderer = function (renderer, args) {
            var _this = this;
            switch (renderer.type) {
                case "simple": {
                    return this.fromJson(renderer.symbol);
                }
                case "uniqueValue": {
                    var styles_1 = {};
                    var defaultStyle_1 = renderer.defaultSymbol && this.fromJson(renderer.defaultSymbol);
                    if (renderer.uniqueValueInfos) {
                        renderer.uniqueValueInfos.forEach(function (info) {
                            styles_1[info.value] = _this.fromJson(info.symbol);
                        });
                    }
                    return function (feature) { return styles_1[feature.get(renderer.field1)] || defaultStyle_1; };
                }
                case "classBreaks": {
                    var styles_2 = {};
                    var classBreakRenderer_1 = renderer;
                    if (classBreakRenderer_1.classBreakInfos) {
                        console.log("processing classBreakInfos");
                        if (classBreakRenderer_1.visualVariables) {
                            classBreakRenderer_1.visualVariables.forEach(function (vars) {
                                switch (vars.type) {
                                    case "sizeInfo": {
                                        var steps_1 = range(classBreakRenderer_1.authoringInfo.visualVariables[0].minSliderValue, classBreakRenderer_1.authoringInfo.visualVariables[0].maxSliderValue);
                                        var dx_1 = (vars.maxSize - vars.minSize) / steps_1.length;
                                        var dataValue_1 = (vars.maxDataValue - vars.minDataValue) / steps_1.length;
                                        classBreakRenderer_1.classBreakInfos.forEach(function (classBreakInfo) {
                                            var icons = steps_1.map(function (step) {
                                                var json = (JSON.parse(JSON.stringify(classBreakInfo.symbol)));
                                                json.size = vars.minSize + dx_1 * (dataValue_1 - vars.minDataValue);
                                                var style = _this.fromJson(json);
                                                styles_2[dataValue_1] = style;
                                            });
                                        });
                                        debugger;
                                        break;
                                    }
                                    default:
                                        debugger;
                                        break;
                                }
                            });
                        }
                    }
                    return function (feature) {
                        debugger;
                        var value = feature.get(renderer.field1);
                        for (var key in styles_2) {
                            return styles_2[key];
                        }
                        return null;
                    };
                }
                default:
                    throw "unsupported renderer type: " + renderer.type;
            }
        };
        return StyleConverter;
    }());
    exports.StyleConverter = StyleConverter;
});
define("node_modules/ol3-symbolizer/index", ["require", "exports", "node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer", "node_modules/ol3-symbolizer/ol3-symbolizer/format/ags-symbolizer", "node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer"], function (require, exports, Symbolizer, ags_symbolizer_1, ol3_symbolizer_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Symbolizer = Symbolizer;
    exports.AgsStyleConverter = ags_symbolizer_1.StyleConverter;
    exports.StyleConverter = ol3_symbolizer_2.StyleConverter;
});
define("ol3-draw/ol3-draw", ["require", "exports", "openlayers", "ol3-draw/ol3-button", "node_modules/ol3-fun/index"], function (require, exports, ol, ol3_button_1, index_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Draw = (function (_super) {
        __extends(Draw, _super);
        function Draw(options) {
            var _this = _super.call(this, options) || this;
            _this.interactions = {};
            _this.handlers.push(function () {
                return Object.keys(_this.interactions).forEach(function (k) {
                    var interaction = _this.interactions[k];
                    interaction.setActive(false);
                    options.map.removeInteraction(interaction);
                });
            });
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
            if (options.map && !options.layers) {
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
            options = index_3.mixin(index_3.mixin({}, Draw.DEFAULT_OPTIONS), options || {});
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
            draw.on("change:active", function () { return _this.options.element.classList.toggle("active", draw.getActive()); });
            options.map.addInteraction(draw);
            return draw;
        };
        Draw.DEFAULT_OPTIONS = {
            className: "ol-draw",
            geometryType: "Point",
            geometryName: "geom",
            label: "Draw",
            title: "Draw",
            position: "top left",
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
        return Draw;
    }(ol3_button_1.Button));
    exports.Draw = Draw;
});
define("tests/spec/draw", ["require", "exports", "node_modules/ol3-fun/tests/base", "ol3-draw/ol3-draw"], function (require, exports, base_1, ol3_draw_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_1.describe("Draw Tests", function () {
        base_1.it("Draw", function () {
            base_1.should(!!ol3_draw_1.Draw, "Draw");
        });
        base_1.it("DEFAULT_OPTIONS", function () {
            var options = ol3_draw_1.Draw.DEFAULT_OPTIONS;
            checkDefaultInputOptions(options);
        });
        base_1.it("options of an Input instance", function () {
            var input = ol3_draw_1.Draw.create();
            checkDefaultInputOptions(input.options);
        });
    });
    function checkDefaultInputOptions(options) {
        base_1.should(!!options, "options");
        base_1.shouldEqual(options.className, "ol-draw", "className");
        base_1.shouldEqual(options.map, undefined, "map");
        base_1.shouldEqual(options.position, "top left", "position");
    }
});
define("ol3-draw/services/wfs-sync", ["require", "exports", "openlayers", "jquery", "node_modules/ol3-fun/index"], function (require, exports, ol, $, index_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var serializer = new XMLSerializer();
    var WfsSync = (function () {
        function WfsSync(options) {
            this.options = options;
            this.lastSavedTime = Date.now();
            this.deletes = [];
            this.watch();
        }
        WfsSync.create = function (options) {
            options = index_4.defaults(options || {}, WfsSync.DEFAULT_OPTIONS);
            if (!options.formatter) {
                options.formatter = new ol.format.WFS();
            }
            if (!options.srsName) {
                options.srsName = options.source.getProjection().getCode();
            }
            var result = new WfsSync(options);
            return result;
        };
        WfsSync.prototype.on = function (name, cb) {
            if (!this._onhash)
                this._onhash = [];
            if (!this._onhash[name])
                this._onhash[name] = [];
            this._onhash[name].push(cb);
        };
        WfsSync.prototype.trigger = function (name, args) {
            if (!this._onhash)
                return;
            if (!this._onhash[name])
                return;
            this._onhash[name].some(function (f) { return f(args); });
        };
        WfsSync.prototype.watch = function () {
            var _this = this;
            var save = index_4.debounce(function () {
                try {
                    _this.trigger("before-save");
                    _this.saveDrawings({
                        features: _this.options.source.getFeatures().filter(function (f) { return !!f.get(_this.options.lastUpdateFieldName); })
                    }).then(function () { return _this.trigger("after-save"); });
                }
                catch (ex) {
                    _this.trigger("error", { exception: ex });
                    throw ex;
                }
            }, 1000);
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
                return $.ajax({
                    type: "POST",
                    url: _this.options.wfsUrl,
                    data: serializer.serializeToString(requestBody),
                    contentType: "application/xml",
                    dataType: "xml",
                    error: function (a, status, message) {
                        console.error(status);
                        _this.trigger("error", { status: status, message: message });
                    },
                    success: function (response) {
                        if (response.documentElement.tagName === "ows:ExceptionReport") {
                            var exception = response.documentElement.getElementsByTagName("ows:ExceptionText")[0];
                            _this.trigger("error", exception.textContent);
                        }
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
                            f.set(_this.options.featureIdFieldName, id.split(".").pop());
                            f.setId(id);
                        });
                    }
                });
            };
            this.lastSavedTime = Date.now();
            var promises = Object.keys(this.options.targets).map(function (k) { return saveTo(_this.options.targets[k], k); });
            return $.when.apply(this, promises);
        };
        WfsSync.DEFAULT_OPTIONS = {
            featureIdFieldName: "gid",
            lastUpdateFieldName: "touched",
        };
        return WfsSync;
    }());
    exports.WfsSync = WfsSync;
});
define("tests/spec/wfs-sync", ["require", "exports", "openlayers", "node_modules/ol3-fun/tests/base", "ol3-draw/services/wfs-sync"], function (require, exports, ol, base_2, wfs_sync_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WFS_INFO = {
        srsName: "EPSG:3857",
        wfsUrl: location.protocol + "//" + location.hostname + ":8080/geoserver/cite/wfs",
        featureNS: "http://www.opengeospatial.net/cite",
        featurePrefix: "cite"
    };
    base_2.describe("wfs-sync", function () {
        base_2.it("WfsSync", function () {
            base_2.should(!!wfs_sync_1.WfsSync, "WfsSync");
        });
        base_2.it("DEFAULT_OPTIONS", function () {
            var options = wfs_sync_1.WfsSync.DEFAULT_OPTIONS;
            checkDefaultInputOptions(options);
        });
        location.hostname === "127.0.0.1" &&
            base_2.it("should invoke a POST request", function (done) {
                var source = new ol.source.Vector();
                var service = wfs_sync_1.WfsSync.create({
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
                service.on("after-save", function (args) {
                    console.warn(args);
                    done();
                });
                service.on("error", function (args) {
                    base_2.shouldEqual(args, "Feature type 'point_layer' is not available: ", "point_layer not available error message");
                    done();
                });
                source.addFeature(new ol.Feature(new ol.geom.Point([0, 0])));
            });
    });
    function checkDefaultInputOptions(options) {
        base_2.should(!!options, "options");
        base_2.shouldEqual(options.featureIdFieldName, "gid", "featureIdFieldName");
        base_2.shouldEqual(options.lastUpdateFieldName, "touched", "lastUpdateFieldName");
    }
});
define("tests/index", ["require", "exports", "tests/spec/draw", "tests/spec/wfs-sync"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=tests.max.js.map