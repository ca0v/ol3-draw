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
define("node_modules/@ca0v/ceylon/ceylon/interfaces/expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/interfaces/boolean-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/interfaces/number-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/interfaces/string-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/interfaces/array-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/interfaces/function-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/interfaces/object-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/interfaces/expect", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/fast-deep-equal", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function equal(a, b) {
        if (a === b)
            return true;
        if ([Object, Array, Date, RegExp].some(function (t) { return a instanceof t !== b instanceof t; }))
            return false;
        if (typeof a == "object" && typeof b == "object") {
            if (Array.isArray(a) && Array.isArray(b)) {
                if (a.length !== b.length)
                    return false;
                return a.every(function (v, i) { return equal(v, b[i]); });
            }
            if (a instanceof Date && b instanceof Date)
                return a.getTime() === b.getTime();
            if (a instanceof RegExp && b instanceof RegExp)
                return a.toString() === b.toString();
            var keys = Object.keys(a);
            if (keys.length !== Object.keys(b).length)
                return false;
            return keys.every(function (key) { return b.hasOwnProperty(key) && equal(a[key], b[key]); });
        }
        // isInfinite, isNaN
        return a !== a && b !== b;
    }
    exports.equal = equal;
});
define("node_modules/@ca0v/ceylon/ceylon/assertion-error", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(_a) {
        var message = _a.message, expected = _a.expected, actual = _a.actual, showDiff = _a.showDiff;
        var error = new Error(message);
        // Properties used by Mocha and other frameworks to show errors
        error["expected"] = expected;
        error["actual"] = actual;
        error["showDiff"] = showDiff;
        // Set the error name to an AssertionError
        error.name = "AssertionError";
        return error;
    }
    exports.default = default_1;
});
define("node_modules/@ca0v/ceylon/ceylon/assert", ["require", "exports", "node_modules/@ca0v/ceylon/ceylon/assertion-error"], function (require, exports, assertion_error_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Creates an Assertion, which throws an AssertionError when the condition specified in the assertion parameter equates to false
     *
     * @param {IAssertOptions} { assertion, message, actual, expected }
     */
    var assert = function (_a) {
        var assertion = _a.assertion, message = _a.message, actual = _a.actual, expected = _a.expected;
        if (!assertion) {
            var error = assertion_error_1.default({
                actual: actual,
                expected: expected,
                message: message,
                showDiff: typeof actual !== "undefined" && typeof expected !== "undefined"
            });
            throw error;
        }
    };
    exports.default = assert;
});
define("node_modules/@ca0v/ceylon/ceylon/expectation", ["require", "exports", "node_modules/@ca0v/ceylon/ceylon/fast-deep-equal", "node_modules/@ca0v/ceylon/ceylon/assert"], function (require, exports, fast_deep_equal_1, assert_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Expectation = /** @class */ (function () {
        function Expectation(actual) {
            this.actual = actual;
        }
        /**
         * Asserts that the tested item exists (is not null, undefined, or empty)
         *
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toExist = function (message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (Array.isArray(this.actual)) {
                assert_1.default({
                    assertion: this.actual.length !== 0,
                    message: message || "Expected array to exist"
                });
            }
            else if (typeof this.actual === "object" && this.actual !== null) {
                assert_1.default({
                    assertion: Object.getOwnPropertyNames(this.actual).length !== 0,
                    message: message || "Expected object to exist"
                });
            }
            else {
                assert_1.default({
                    assertion: typeof this.actual !== "undefined" && this.actual !== null && this.actual !== "",
                    message: message || "Expected item to exist"
                });
            }
            return this;
        };
        /**
         * Asserts that the tested item does not exist (is null, undefined, or empty)
         *
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toNotExist = function (message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (Array.isArray(this.actual)) {
                assert_1.default({
                    assertion: this.actual.length === 0,
                    message: message || "Expected array to not exist"
                });
            }
            else if (typeof this.actual === "object" && this.actual !== null) {
                assert_1.default({
                    assertion: Object.getOwnPropertyNames(this.actual).length === 0,
                    message: message || "Expected object to not exist"
                });
            }
            else {
                assert_1.default({
                    assertion: typeof this.actual === "undefined" || this.actual === null || this.actual === "",
                    message: message || "Expected item to not exist"
                });
            }
            return this;
        };
        /**
         * Asserts that the tested item is strictly equal to value
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toBe = function (value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                actual: this.actual,
                assertion: this.actual === value,
                expected: value,
                message: message || "Expected " + JSON.stringify(this.actual) + " to be " + JSON.stringify(value)
            });
            return this;
        };
        /**
         * Asserts that the tested item is not strictly equal to value
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toNotBe = function (value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                actual: this.actual,
                assertion: this.actual !== value,
                expected: value,
                message: message || "Expected " + JSON.stringify(this.actual) + " to not be " + JSON.stringify(value)
            });
            return this;
        };
        /**
         * Asserts that the tested item is deep equal to value
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toEqual = function (value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                actual: this.actual,
                assertion: fast_deep_equal_1.equal(this.actual, value),
                expected: value,
                message: message || "Expected " + JSON.stringify(this.actual) + " to equal " + JSON.stringify(value)
            });
            return this;
        };
        /**
         * Asserts that the tested item is not deep equal to value
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toNotEqual = function (value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                actual: this.actual,
                assertion: !fast_deep_equal_1.equal(this.actual, value),
                expected: value,
                message: message || "Expected " + JSON.stringify(this.actual) + " to not equal " + JSON.stringify(value)
            });
            return this;
        };
        /**
         * Asserts that the tested item is true
         *
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toBeTrue = function (message) {
            return this.toBe(true, message);
        };
        /**
         * Asserts that the tested item is false
         *
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toBeFalse = function (message) {
            return this.toBe(false, message);
        };
        /**
         * Asserts that the tested item is less than value
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toBeLessThan = function (value, message) {
            assert_1.default({
                assertion: typeof value === "number",
                message: "[value] argument should be a number"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "number") {
                assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a number"
                });
            }
            else {
                assert_1.default({
                    assertion: this.actual < value,
                    message: message || "Expected " + this.actual + " to be less than " + value
                });
            }
            return this;
        };
        /**
         * Asserts that the tested item is less than value
         * Alias for toBeLessThan
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toBeFewerThan = function (value, message) {
            return this.toBeLessThan(value, message);
        };
        /**
         * Asserts that the tested item is less than or equal to value
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toBeLessThanOrEqualTo = function (value, message) {
            assert_1.default({
                assertion: typeof value === "number",
                message: "[value] argument should be a number"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "number") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a number"
                });
            }
            assert_1.default({
                assertion: this.actual <= value,
                message: message || "Expected " + this.actual + " to be less than or equal to " + value
            });
            return this;
        };
        /**
         * Asserts that the tested item is less than or equal to value
         * Alias for toBeLessThanOrEqualTo
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toBeFewerThanOrEqualTo = function (value, message) {
            return this.toBeLessThanOrEqualTo(value, message);
        };
        /**
         * Asserts that the tested item is greater than value
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toBeGreaterThan = function (value, message) {
            assert_1.default({
                assertion: typeof value === "number",
                message: "[value] argument should be a number"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "number") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a number"
                });
            }
            assert_1.default({
                assertion: this.actual > value,
                message: message || "Expected " + this.actual + " to be greater than " + value
            });
            return this;
        };
        /**
         * Asserts that the tested item is greater than value
         * Alias for toBeGreaterThan
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toBeMoreThan = function (value, message) {
            return this.toBeGreaterThan(value, message);
        };
        /**
         * Asserts that the tested item is greater than or equal to value
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toBeGreaterThanOrEqualTo = function (value, message) {
            assert_1.default({
                assertion: typeof value === "number",
                message: "[value] argument should be a number"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "number") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a number"
                });
            }
            assert_1.default({
                assertion: this.actual >= value,
                message: message || "Expected " + this.actual + " to be greater than or equal to " + value
            });
            return this;
        };
        /**
         * Asserts that the tested item is greater than or equal to value
         * Alias for toBeGreaterThanOrEqualTo
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toBeMoreThanOrEqualTo = function (value, message) {
            return this.toBeGreaterThanOrEqualTo(value, message);
        };
        /**
         * Asserts that the tested item matches the regular expression
         *
         * @param {RegExp} pattern
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toMatch = function (pattern, message) {
            assert_1.default({
                assertion: pattern instanceof RegExp,
                message: "[pattern] argument should be a regular expression"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "string") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a string"
                });
            }
            assert_1.default({
                assertion: pattern.test(this.actual),
                message: message || "Expected " + this.actual + " to match " + pattern
            });
            return this;
        };
        /**
         * Asserts that the tested item does not match the regular expression
         *
         * @param {RegExp} pattern
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toNotMatch = function (pattern, message) {
            assert_1.default({
                assertion: pattern instanceof RegExp,
                message: "[pattern] argument should be a regular expression"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "string") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a string"
                });
            }
            assert_1.default({
                assertion: !pattern.test(this.actual),
                message: message || "Expected " + this.actual + " to match " + pattern
            });
            return this;
        };
        /**
         * Asserts that the tested item includes value
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toInclude = function (value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "string" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Item being tested should be a string, array, or object"
            });
            if (typeof this.actual === "string") {
                assert_1.default({
                    assertion: this.actual.indexOf(value) >= 0,
                    message: message || "Expected " + this.actual + " to contain " + value
                });
            }
            else if (Array.isArray(this.actual)) {
                // Assume the value is not included
                var included = false;
                for (var i = 0; i < this.actual.length; i++) {
                    if (fast_deep_equal_1.equal(this.actual[i], value)) {
                        included = true;
                        break; // We've found a match, so exit the loop
                    }
                }
                assert_1.default({
                    assertion: included,
                    message: message || "Expected " + JSON.stringify(this.actual) + " to contain " + JSON.stringify(value)
                });
            }
            else if (typeof this.actual === "object") {
                /*
                 * For this test, it's easier to assume that the value is present,
                 * then set "included" to "false" as soon as one part of the value
                 * is found to be missing
                 */
                var included = true;
                var valueProperties = Object.getOwnPropertyNames(value);
                // Loop through the properties in the value
                for (var i = 0; i < valueProperties.length; i++) {
                    // Check if this.actual has this property
                    if (!this.actual.hasOwnProperty(valueProperties[i])) {
                        included = false;
                        break; // Break the loop early as we've found a property that doesn't exist
                    }
                    // Now check that the value of the property is the same
                    if (!fast_deep_equal_1.equal(this.actual[valueProperties[i]], value[valueProperties[i]])) {
                        included = false;
                    }
                }
                assert_1.default({
                    assertion: included,
                    message: message || "Expected " + JSON.stringify(this.actual) + " to contain " + JSON.stringify(value)
                });
            }
            return this;
        };
        /**
         * Asserts that the tested item includes value
         * Alias for toInclude
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toContain = function (value, message) {
            return this.toInclude(value, message);
        };
        /**
         * Asserts that the tested item does not include value
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toExclude = function (value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "string" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Item being tested should be a string, array, or object"
            });
            if (typeof this.actual === "string") {
                assert_1.default({
                    assertion: this.actual.indexOf(value) === -1,
                    message: message || "Expected " + this.actual + " to not contain " + value
                });
            }
            else if (Array.isArray(this.actual)) {
                // Assume the value is not included
                var included = false;
                for (var i = 0; i < this.actual.length; i++) {
                    if (fast_deep_equal_1.equal(this.actual[i], value)) {
                        included = true;
                        break; // We've found a match, so exit the loop
                    }
                }
                assert_1.default({
                    assertion: !included,
                    message: message || "Expected " + JSON.stringify(this.actual) + " to not contain " + JSON.stringify(value)
                });
            }
            else if (typeof this.actual === "object") {
                // Assume the value is not included
                var included = false;
                var valueProperties = Object.getOwnPropertyNames(value);
                // Loop through the properties in the value
                for (var i = 0; i < valueProperties.length; i++) {
                    // Check if this.actual has this property
                    if (this.actual.hasOwnProperty(valueProperties[i])) {
                        // Now check if the property is the same in value
                        if (fast_deep_equal_1.equal(this.actual[valueProperties[i]], value[valueProperties[i]])) {
                            included = true;
                            break; // Break the loop early as we've found a property that doesn't exist
                        }
                    }
                }
                assert_1.default({
                    assertion: !included,
                    message: message || "Expected " + JSON.stringify(this.actual) + " to not contain " + JSON.stringify(value)
                });
            }
            return this;
        };
        /**
         * Asserts that the tested item does not include value
         * Alias for toExclude
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toNotInclude = function (value, message) {
            return this.toExclude(value, message);
        };
        /**
         * Asserts that the tested item does not include value
         * Alias for toExclude
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toNotContain = function (value, message) {
            return this.toExclude(value, message);
        };
        /**
         * Asserts that the tested item throws an error
         *
         * @param {*} [error]
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toThrow = function (error, message) {
            assert_1.default({
                assertion: typeof error === "undefined" ||
                    typeof error === "string" ||
                    error instanceof RegExp ||
                    typeof error === "function",
                message: "[error] argument should be a string, regular expression, or function"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "function") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a function"
                });
            }
            if (typeof error === "undefined") {
                var threw = false;
                try {
                    this.actual();
                }
                catch (e) {
                    threw = true;
                }
                assert_1.default({
                    assertion: threw,
                    message: message || "Expected function to throw"
                });
            }
            else if (typeof error === "string") {
                try {
                    this.actual();
                }
                catch (e) {
                    assert_1.default({
                        assertion: e.message === error,
                        message: message || "Expected error message to be \"" + error + "\"\""
                    });
                }
            }
            else if (error instanceof RegExp) {
                try {
                    this.actual();
                }
                catch (e) {
                    assert_1.default({
                        assertion: error.test(e.message),
                        message: message || "Expected error message to match " + error
                    });
                }
            }
            else if (typeof error === "function") {
                try {
                    this.actual();
                }
                catch (e) {
                    assert_1.default({
                        assertion: e instanceof error,
                        message: message || "Expected error to be " + error
                    });
                }
            }
            return this;
        };
        /**
         * Asserts that the tested item does not throw an error
         *
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toNotThrow = function (message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "function") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a function"
                });
            }
            var threw = false;
            try {
                this.actual();
            }
            catch (e) {
                threw = true;
            }
            assert_1.default({
                assertion: !threw,
                message: message || "Expected function to not throw"
            });
            return this;
        };
        /**
         * Asserts that the tested item is of the type specified by constructor
         *
         * @param {*} constructor
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toBeA = function (constructor, message) {
            assert_1.default({
                assertion: typeof constructor === "function" || typeof constructor === "string",
                message: "[constructor] argument should be a function or string"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof constructor === "string") {
                assert_1.default({
                    actual: typeof this.actual,
                    assertion: typeof this.actual === constructor,
                    expected: constructor,
                    message: message || "Expected item to be a " + constructor
                });
            }
            else if (typeof constructor === "function") {
                assert_1.default({
                    actual: typeof this.actual,
                    assertion: this.actual instanceof constructor,
                    expected: constructor,
                    message: message || "Expected item to be a " + constructor
                });
            }
            return this;
        };
        /**
         * Asserts that the tested item is of the type specified by constructor
         * Alias for toBeA
         *
         * @param {*} constructor
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toBeAn = function (constructor, message) {
            return this.toBeA(constructor, message);
        };
        /**
         * Asserts that the tested item is not of the type specified by constructor
         *
         * @param {*} constructor
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toNotBeA = function (constructor, message) {
            assert_1.default({
                assertion: typeof constructor === "function" || typeof constructor === "string",
                message: "[constructor] argument should be a function or string"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof constructor === "string") {
                assert_1.default({
                    assertion: !(typeof this.actual === constructor),
                    message: message || "Expected item to not be a " + constructor
                });
            }
            else if (typeof constructor === "function") {
                assert_1.default({
                    assertion: !(this.actual instanceof constructor),
                    message: message || "Expected item to not be a " + constructor
                });
            }
            return this;
        };
        /**
         * Asserts that the tested item is not of the type specifed by constructor
         *
         * @param {*} constructor
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toNotBeAn = function (constructor, message) {
            return this.toNotBeA(constructor, message);
        };
        /**
         * Asserts that the tested item includes key
         *
         * @param {*} key
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toIncludeKey = function (key, message) {
            assert_1.default({
                assertion: typeof key === "number" || typeof key === "string",
                message: "[key] argument should be a number or string"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "function" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Tested item should be a function, array, or object"
            });
            if (typeof this.actual === "function") {
                assert_1.default({
                    assertion: this.actual.hasOwnProperty(key),
                    message: message || "Expected function to have key " + key
                });
            }
            else if (Array.isArray(this.actual)) {
                assert_1.default({
                    assertion: this.actual.hasOwnProperty(key),
                    message: message || "Expected array to have key " + key
                });
            }
            else if (typeof this.actual === "object") {
                assert_1.default({
                    assertion: this.actual.hasOwnProperty(key),
                    message: message || "Expected object to have key " + key
                });
            }
            return this;
        };
        /**
         * Asserts that the tested item includes key
         * Alias for toIncludeKey
         *
         * @param {*} key
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toContainKey = function (key, message) {
            return this.toIncludeKey(key, message);
        };
        /**
         * Asserts that the tested item includes keys
         *
         * @param {any[]} keys
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toIncludeKeys = function (keys, message) {
            assert_1.default({
                assertion: Array.isArray(keys) && keys.length > 0 && (typeof keys[0] === "number" || typeof keys[0] === "string"),
                message: "[keys] argument should be an array of numbers or strings"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "function" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Tested item should be a function, array, or object"
            });
            for (var i = 0; i < keys.length; i++) {
                this.toIncludeKey(keys[i], message);
            }
            return this;
        };
        /**
         * Asserts that the tested item includes keys
         * Alias for toIncludeKeys
         *
         * @param {any[]} keys
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toContainKeys = function (keys, message) {
            return this.toIncludeKeys(keys, message);
        };
        /**
         * Asserts that the tested item does not include key
         *
         * @param {*} key
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toExcludeKey = function (key, message) {
            assert_1.default({
                assertion: typeof key === "number" || typeof key === "string",
                message: "[key] argument should be a number or string"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "function" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Tested item should be a function, array, or object"
            });
            if (typeof this.actual === "function") {
                assert_1.default({
                    assertion: !this.actual.hasOwnProperty(key),
                    message: message || "Expected function to not have key " + key
                });
            }
            else if (Array.isArray(this.actual)) {
                assert_1.default({
                    assertion: !this.actual.hasOwnProperty(key),
                    message: message || "Expected array to not have key " + key
                });
            }
            else if (typeof this.actual === "object") {
                assert_1.default({
                    assertion: !this.actual.hasOwnProperty(key),
                    message: message || "Expected object to not have key " + key
                });
            }
            return this;
        };
        /**
         * Asserts that the tested item does not include key
         * Alias for toExcludeKey
         *
         * @param {*} key
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toNotIncludeKey = function (key, message) {
            return this.toExcludeKey(key, message);
        };
        /**
         * Asserts that the tested item does not include key
         * Alias for toExcludeKey
         *
         * @param {*} key
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toNotContainKey = function (key, message) {
            return this.toExcludeKey(key, message);
        };
        /**
         * Asserts that the tested item does not include keys
         *
         * @param {any[]} keys
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toExcludeKeys = function (keys, message) {
            assert_1.default({
                assertion: Array.isArray(keys) && keys.length > 0 && (typeof keys[0] === "number" || typeof keys[0] === "string"),
                message: "[key] argument should be an array of numbers or strings"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "function" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Tested item should be a function, array, or object"
            });
            for (var i = 0; i < keys.length; i++) {
                this.toExcludeKey(keys[i], message);
            }
            return this;
        };
        /**
         * Asserts that the tested item does not include keys
         * Alias for toExcludeKeys
         *
         * @param {any[]} keys
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toNotIncludeKeys = function (keys, message) {
            return this.toExcludeKeys(keys, message);
        };
        /**
         * Asserts that the tested item does not include keys
         * Alias for toExcludeKeys
         *
         * @param {any[]} keys
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toNotContainKeys = function (keys, message) {
            return this.toExcludeKeys(keys, message);
        };
        /**
         * Asserts that the tested item has length of value
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        Expectation.prototype.toHaveLength = function (value, message) {
            assert_1.default({
                assertion: typeof value === "number",
                message: "[value] argument should be a number"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "string" || Array.isArray(this.actual),
                message: "Item being tested should be a string or an array"
            });
            if (typeof this.actual === "string") {
                assert_1.default({
                    assertion: this.actual.length === value,
                    message: message || "Expected string to have length " + value
                });
            }
            if (Array.isArray(this.actual)) {
                assert_1.default({
                    assertion: this.actual.length === value,
                    message: message || "Expected array to have length " + value
                });
            }
            return this;
        };
        return Expectation;
    }());
    exports.default = Expectation;
});
define("node_modules/@ca0v/ceylon/ceylon/index", ["require", "exports", "node_modules/@ca0v/ceylon/ceylon/expectation", "node_modules/@ca0v/ceylon/ceylon/assert"], function (require, exports, expectation_1, assert_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assert = assert_2.default;
    /**
     * Creates a new expectation, which allows assertions to be made on the item passed into it
     *
     * @template T
     * @param {T} actual
     * @returns {Expectation<T>}
     */
    var expect = function (actual) {
        return new expectation_1.default(actual);
    };
    exports.default = expect;
});
define("node_modules/@ca0v/ceylon/index", ["require", "exports", "node_modules/@ca0v/ceylon/ceylon/index", "node_modules/@ca0v/ceylon/ceylon/assert", "node_modules/@ca0v/ceylon/ceylon/fast-deep-equal", "node_modules/@ca0v/ceylon/ceylon/assertion-error", "node_modules/@ca0v/ceylon/ceylon/expectation"], function (require, exports, index_1, assert_3, fast_deep_equal_2, assertion_error_2, expectation_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.expect = index_1.default;
    exports.assert = assert_3.default;
    exports.deepEqual = fast_deep_equal_2.equal;
    exports.AssertionError = assertion_error_2.default;
    exports.Expectation = expectation_2.default;
    exports.default = index_1.default;
});
define("node_modules/@ca0v/ceylon/tests/index.spec", ["require", "exports", "node_modules/@ca0v/ceylon/index"], function (require, exports, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("expect", function () {
        it("creates a new Expectation object", function () {
            var sut = index_2.expect(true);
            index_2.expect(sut).toExist();
            index_2.expect(sut).toBeAn(index_2.Expectation);
        });
    });
});
define("node_modules/@ca0v/ceylon/tests/assert.spec", ["require", "exports", "node_modules/@ca0v/ceylon/index"], function (require, exports, index_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("Assert", function () {
        it("does not throw when assertion passes", function () {
            index_3.assert({
                assertion: true,
                message: "This should not throw"
            });
        });
        it("throws when the assertion fails", function () {
            index_3.expect(function () {
                return index_3.assert({
                    assertion: false,
                    message: "This should throw"
                });
            }).toThrow();
        });
        it("throws error with correct message property", function () {
            index_3.expect(function () {
                return index_3.assert({
                    assertion: false,
                    message: "This should throw"
                });
            }).toThrow("This should throw");
        });
        it("throws error with showDiff set to false", function () {
            try {
                index_3.assert({
                    assertion: false,
                    message: "This should throw"
                });
            }
            catch (e) {
                index_3.expect(e["showDiff"]).toBeFalse();
            }
        });
        it("throws error with correct actual/expected/showDiff properties", function () {
            try {
                index_3.assert({
                    actual: 1,
                    assertion: false,
                    expected: 2,
                    message: "This should throw"
                });
            }
            catch (e) {
                index_3.expect(e["actual"]).toBe(1);
                index_3.expect(e["expected"]).toBe(2);
                index_3.expect(e["showDiff"]).toBeTrue();
            }
        });
    });
});
define("node_modules/@ca0v/ceylon/tests/deep-equal.spec", ["require", "exports", "node_modules/@ca0v/ceylon/index"], function (require, exports, index_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function func1() { }
    function func2() { }
    var tests = [
        {
            description: "scalars",
            tests: [
                {
                    description: "equal numbers",
                    value1: 1,
                    value2: 1,
                    equal: true
                },
                {
                    description: "not equal numbers",
                    value1: 1,
                    value2: 2,
                    equal: false
                },
                {
                    description: "number and array are not equal",
                    value1: 1,
                    value2: [],
                    equal: false
                },
                {
                    description: "0 and null are not equal",
                    value1: 0,
                    value2: null,
                    equal: false
                },
                {
                    description: "equal strings",
                    value1: "a",
                    value2: "a",
                    equal: true
                },
                {
                    description: "not equal strings",
                    value1: "a",
                    value2: "b",
                    equal: false
                },
                {
                    description: "empty string and null are not equal",
                    value1: "",
                    value2: null,
                    equal: false
                },
                {
                    description: "null is equal to null",
                    value1: null,
                    value2: null,
                    equal: true
                },
                {
                    description: "equal booleans (true)",
                    value1: true,
                    value2: true,
                    equal: true
                },
                {
                    description: "equal booleans (false)",
                    value1: false,
                    value2: false,
                    equal: true
                },
                {
                    description: "not equal booleans",
                    value1: true,
                    value2: false,
                    equal: false
                },
                {
                    description: "1 and true are not equal",
                    value1: 1,
                    value2: true,
                    equal: false
                },
                {
                    description: "0 and false are not equal",
                    value1: 0,
                    value2: false,
                    equal: false
                },
                {
                    description: "NaN and NaN are equal",
                    value1: NaN,
                    value2: NaN,
                    equal: true
                },
                {
                    description: "0 and -0 are equal",
                    value1: 0,
                    value2: -0,
                    equal: true
                },
                {
                    description: "Infinity and Infinity are equal",
                    value1: Infinity,
                    value2: Infinity,
                    equal: true
                },
                {
                    description: "Infinity and -Infinity are not equal",
                    value1: Infinity,
                    value2: -Infinity,
                    equal: false
                }
            ]
        },
        {
            description: "objects",
            tests: [
                {
                    description: "empty objects are equal",
                    value1: {},
                    value2: {},
                    equal: true
                },
                {
                    description: 'equal objects (same properties "order")',
                    value1: { a: 1, b: "2" },
                    value2: { a: 1, b: "2" },
                    equal: true
                },
                {
                    description: 'equal objects (different properties "order")',
                    value1: { a: 1, b: "2" },
                    value2: { b: "2", a: 1 },
                    equal: true
                },
                {
                    description: "not equal objects (extra property)",
                    value1: { a: 1, b: "2" },
                    value2: { a: 1, b: "2", c: [] },
                    equal: false
                },
                {
                    description: "not equal objects (different properties)",
                    value1: { a: 1, b: "2", c: 3 },
                    value2: { a: 1, b: "2", d: 3 },
                    equal: false
                },
                {
                    description: "not equal objects (different properties)",
                    value1: { a: 1, b: "2", c: 3 },
                    value2: { a: 1, b: "2", d: 3 },
                    equal: false
                },
                {
                    description: "equal objects (same sub-properties)",
                    value1: { a: [{ b: "c" }] },
                    value2: { a: [{ b: "c" }] },
                    equal: true
                },
                {
                    description: "not equal objects (different sub-property value)",
                    value1: { a: [{ b: "c" }] },
                    value2: { a: [{ b: "d" }] },
                    equal: false
                },
                {
                    description: "not equal objects (different sub-property)",
                    value1: { a: [{ b: "c" }] },
                    value2: { a: [{ c: "c" }] },
                    equal: false
                },
                {
                    description: "empty array and empty object are not equal",
                    value1: {},
                    value2: [],
                    equal: false
                },
                {
                    description: "object with extra undefined properties are not equal #1",
                    value1: {},
                    value2: { foo: undefined },
                    equal: false
                },
                {
                    description: "object with extra undefined properties are not equal #2",
                    value1: { foo: undefined },
                    value2: {},
                    equal: false
                },
                {
                    description: "object with extra undefined properties are not equal #3",
                    value1: { foo: undefined },
                    value2: { bar: undefined },
                    equal: false
                },
                {
                    description: "nulls are equal",
                    value1: null,
                    value2: null,
                    equal: true
                },
                {
                    description: "null and undefined are not equal",
                    value1: null,
                    value2: undefined,
                    equal: false
                },
                {
                    description: "null and empty object are not equal",
                    value1: null,
                    value2: {},
                    equal: false
                },
                {
                    description: "undefined and empty object are not equal",
                    value1: undefined,
                    value2: {},
                    equal: false
                }
            ]
        },
        {
            description: "arrays",
            tests: [
                {
                    description: "two empty arrays are equal",
                    value1: [],
                    value2: [],
                    equal: true
                },
                {
                    description: "equal arrays",
                    value1: [1, 2, 3],
                    value2: [1, 2, 3],
                    equal: true
                },
                {
                    description: "not equal arrays (different item)",
                    value1: [1, 2, 3],
                    value2: [1, 2, 4],
                    equal: false
                },
                {
                    description: "not equal arrays (different length)",
                    value1: [1, 2, 3],
                    value2: [1, 2],
                    equal: false
                },
                {
                    description: "equal arrays of objects",
                    value1: [{ a: "a" }, { b: "b" }],
                    value2: [{ a: "a" }, { b: "b" }],
                    equal: true
                },
                {
                    description: "not equal arrays of objects",
                    value1: [{ a: "a" }, { b: "b" }],
                    value2: [{ a: "a" }, { b: "c" }],
                    equal: false
                },
                {
                    description: "pseudo array and equivalent array are not equal",
                    value1: { "0": 0, "1": 1, length: 2 },
                    value2: [0, 1],
                    equal: false
                }
            ]
        },
        {
            description: "Date objects",
            tests: [
                {
                    description: "equal date objects",
                    value1: new Date("2017-06-16T21:36:48.362Z"),
                    value2: new Date("2017-06-16T21:36:48.362Z"),
                    equal: true
                },
                {
                    description: "not equal date objects",
                    value1: new Date("2017-06-16T21:36:48.362Z"),
                    value2: new Date("2017-01-01T00:00:00.000Z"),
                    equal: false
                },
                {
                    description: "date and string are not equal",
                    value1: new Date("2017-06-16T21:36:48.362Z"),
                    value2: "2017-06-16T21:36:48.362Z",
                    equal: false
                },
                {
                    description: "date and object are not equal",
                    value1: new Date("2017-06-16T21:36:48.362Z"),
                    value2: {},
                    equal: false
                }
            ]
        },
        {
            description: "RegExp objects",
            tests: [
                {
                    description: "equal RegExp objects",
                    value1: /foo/,
                    value2: /foo/,
                    equal: true
                },
                {
                    description: "not equal RegExp objects (different pattern)",
                    value1: /foo/,
                    value2: /bar/,
                    equal: false
                },
                {
                    description: "not equal RegExp objects (different flags)",
                    value1: /foo/,
                    value2: /foo/i,
                    equal: false
                },
                {
                    description: "RegExp and string are not equal",
                    value1: /foo/,
                    value2: "foo",
                    equal: false
                },
                {
                    description: "RegExp and object are not equal",
                    value1: /foo/,
                    value2: {},
                    equal: false
                }
            ]
        },
        {
            description: "functions",
            tests: [
                {
                    description: "same function is equal",
                    value1: func1,
                    value2: func1,
                    equal: true
                },
                {
                    description: "different functions are not equal",
                    value1: func1,
                    value2: func2,
                    equal: false
                }
            ]
        },
        {
            description: "sample objects",
            tests: [
                {
                    description: "big object",
                    value1: {
                        prop1: "value1",
                        prop2: "value2",
                        prop3: "value3",
                        prop4: {
                            subProp1: "sub value1",
                            subProp2: {
                                subSubProp1: "sub sub value1",
                                subSubProp2: [1, 2, { prop2: 1, prop: 2 }, 4, 5]
                            }
                        },
                        prop5: 1000,
                        prop6: new Date(2016, 2, 10)
                    },
                    value2: {
                        prop5: 1000,
                        prop3: "value3",
                        prop1: "value1",
                        prop2: "value2",
                        prop6: new Date("2016/03/10"),
                        prop4: {
                            subProp2: {
                                subSubProp1: "sub sub value1",
                                subSubProp2: [1, 2, { prop2: 1, prop: 2 }, 4, 5]
                            },
                            subProp1: "sub value1"
                        }
                    },
                    equal: true
                }
            ]
        }
    ];
    describe("equal", function () {
        tests.forEach(function (suite) {
            describe(suite.description, function () {
                suite.tests.forEach(function (test) {
                    it(test.description, function () {
                        index_4.expect(test.equal).toEqual(index_4.deepEqual(test.value1, test.value2));
                    });
                });
            });
        });
    });
});
define("node_modules/@ca0v/ceylon/tests/assertion-error.spec", ["require", "exports", "node_modules/@ca0v/ceylon/index"], function (require, exports, index_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("AssertionError", function () {
        it("returns an Error object", function () {
            var error = index_5.AssertionError({
                message: "Error message"
            });
            index_5.expect(error).toBeAn(Error);
        });
        it("sets the error.message property", function () {
            var error = index_5.AssertionError({
                message: "Error message"
            });
            index_5.expect(error.message).toBe("Error message");
        });
        it("sets does not set the actual, expected, or showDiff properties when unspecified", function () {
            var error = index_5.AssertionError({
                message: "Error message"
            });
            index_5.expect(error["actual"]).toNotExist();
            index_5.expect(error["expected"]).toNotExist();
            index_5.expect(error["showDiff"]).toNotExist();
        });
        it("sets the actual, expected, and showDiff properties when specified", function () {
            var error = index_5.AssertionError({
                actual: "I ate an apple",
                expected: "I ate an orange",
                message: "Error message",
                showDiff: true
            });
            index_5.expect(error["actual"]).toBe("I ate an apple");
            index_5.expect(error["expected"]).toBe("I ate an orange");
            index_5.expect(error["showDiff"]).toBeTrue();
        });
    });
});
define("node_modules/ol3-fun/tests/spec/packages", ["require", "exports", "node_modules/@ca0v/ceylon/tests/index.spec", "node_modules/@ca0v/ceylon/tests/assert.spec", "node_modules/@ca0v/ceylon/tests/deep-equal.spec", "node_modules/@ca0v/ceylon/tests/assertion-error.spec"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/ol3-fun/ol3-fun/slowloop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Executes a series of functions in a delayed manner
     * @param functions one function executes per interval
     * @param interval length of the interval in milliseconds
     * @param cycles number of types to run each function
     * @returns promise indicating the process is complete
     */
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
define("node_modules/ol3-fun/tests/base", ["require", "exports", "node_modules/ol3-fun/ol3-fun/slowloop", "node_modules/@ca0v/ceylon/index"], function (require, exports, slowloop_1, index_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.slowloop = slowloop_1.slowloop;
    exports.expect = index_6.expect;
    exports.assert = index_6.assert;
    exports.deepEqual = index_6.deepEqual;
    // (title: string, fn: (this: Suite) => void): Suite
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
    // can't figure out how to load "should" library (index.js seems amd compliant..should work)
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
    /**
     * Generate a UUID
     * @returns UUID
     *
     * Adapted from http://stackoverflow.com/a/2117523/526860
     */
    function uuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    exports.uuid = uuid;
    /**
     * Converts a GetElementsBy* to a classic array
     * @param list HTML collection to be converted to standard array
     * @returns The @param list represented as a native array of elements
     */
    function asArray(list) {
        var result = new Array(list.length);
        for (var i = 0; i < list.length; i++) {
            result[i] = list[i];
        }
        return result;
    }
    exports.asArray = asArray;
    /***
     * ie11 compatible version of e.classList.toggle
     * if class exists then remove it and return false, if not, then add it and return true.
     * @param force true to add specified class value, false to remove it.
     * @returns true if className exists.
     */
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
    /**
     * Converts a string representation of a value to it's desired type (e.g. parse("1", 0) returns 1)
     * @param v string representation of desired return value
     * @param type desired type
     * @returns @param v converted to a @param type
     */
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
    /**
     * Replaces the options elements with the actual query string parameter values (e.g. {a: 0, "?a=10"} becomes {a: 10})
     * @param options Attributes on this object with be assigned the value of the matching parameter in the query string
     * @param url The url to scan
     */
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
    /**
     * Returns individual query string value from a url
     * @param name Extract parameter of this name from the query string
     * @param url Search this url
     * @returns parameter value
     */
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
    /**
     * Only execute callback when @param v is truthy
     * @param v passing a non-trivial value will invoke the callback with this as the sole argument
     * @param cb callback to execute when the value is non-trivial (not null, not undefined)
     */
    function doif(v, cb) {
        if (v !== undefined && v !== null)
            cb(v);
    }
    exports.doif = doif;
    /**
     * shallow copies b into a, replacing any existing values in a
     * @param a target
     * @param b values to shallow copy into target
     */
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
    /**
     * shallow copies b into a, preserving any existing values in a
     * @param a target
     * @param b values to copy into target if they are not already present
     */
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
    /**
     * delay execution of a method
     * @param func invoked after @param wait milliseconds
     * @param immediate true to invoke @param func before waiting
     */
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
    /**
     * poor $(html) substitute due to being
     * unable to create <td>, <tr> elements
     */
    function html(html) {
        var a = document.createElement("div");
        a.innerHTML = html;
        return (a.firstElementChild || a.firstChild);
    }
    exports.html = html;
    /**
     * returns all combinations of a1 with a2 (a1 X a2 pairs)
     * @param a1 1xN matrix of first elements
     * @param a2 1xN matrix of second elements
     * @returns 2xN^2 matrix of a1 x a2 combinations
     */
    function pair(a1, a2) {
        var result = new Array(a1.length * a2.length);
        var i = 0;
        a1.forEach(function (v1) { return a2.forEach(function (v2) { return (result[i++] = [v1, v2]); }); });
        return result;
    }
    exports.pair = pair;
    /**
     * Returns an array [0..n)
     * @param n number of elements
     */
    function range(n) {
        var result = new Array(n);
        for (var i = 0; i < n; i++)
            result[i] = i;
        return result;
    }
    exports.range = range;
    /**
     * in-place shuffling of an array
     * @see http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * @param array array to randomize
     */
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
define("node_modules/ol3-fun/ol3-fun/css", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    /**
     * A less disorienting way of changing the maps extent (maybe!)
     * Zoom out until new feature is visible
     * Zoom to that feature
     * @param map The openlayers map
     * @param feature The feature to zoom to
     * @param options Animation constraints
     */
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
        return promise;
    }
    exports.zoomToFeature = zoomToFeature;
});
/**
 * Converts DMS to lonlat
 * ported from https://github.com/gmaclennan/parse-dms/blob/master/index.js
 * and https://stackoverflow.com/questions/37893131/how-to-convert-lat-long-from-decimal-degrees-to-dms-format
 */
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
        // Inspired by https://gist.github.com/JeffJacobson/2955437
        // See https://regex101.com/r/kS2zR1/3
        var dmsRe = /([NSEW])?(-)?(\d+(?:\.\d+)?)[°º:d\s]?\s?(?:(\d+(?:\.\d+)?)['’‘′:]\s?(?:(\d{1,2}(?:\.\d+)?)(?:"|″|’’|'')?)?)?\s?([NSEW])?/i;
        var dmsString2;
        var m1 = dmsString.match(dmsRe);
        if (!m1)
            throw "Could not parse string";
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
        if (typeof decDeg1.latLon === "undefined") {
            if (!isNaN(decDeg1.decDeg) && decDeg2 && isNaN(decDeg2.decDeg)) {
                // If we only have one coordinate but we have no hemisphere value,
                // just return the decDeg number
                return decDeg1.decDeg;
            }
            else if (!isNaN(decDeg1.decDeg) && decDeg2 && !isNaN(decDeg2.decDeg)) {
                // If no hemisphere letter but we have two coordinates,
                // infer that the first is lat, the second lon
                decDeg1.latLon = "lat";
                decDeg2.latLon = "lon";
            }
            else {
                throw "Could not parse string";
            }
        }
        // If we parsed the first coordinate as lat or lon, then assume the second is the other
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
    /**
     * Determine if an object refers back to itself
     */
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
// from https://github.com/unclechu/node-deep-extend/blob/master/lib/deep-extend.js
define("node_modules/ol3-fun/ol3-fun/deep-extend", ["require", "exports", "node_modules/ol3-fun/ol3-fun/is-cyclic", "node_modules/ol3-fun/ol3-fun/is-primitive"], function (require, exports, is_cyclic_1, is_primitive_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isArrayLike(o) {
        var keys = Object.keys(o);
        return keys.every(function (k) { return k === parseInt(k, 10).toString(); });
    }
    /**
     * deep mixin, replacing items in a with items in b
     * array items with an "id" are used to identify pairs, otherwise b overwrites a
     * @param a object to extend
     * @param b data to inject into the object
     * @param trace optional change tracking
     * @param history object added here are not visited
     */
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
    /**
     * Hepler class for managing the trace
     */
    var Merger = /** @class */ (function () {
        function Merger(traceItems, history) {
            this.traceItems = traceItems;
            this.history = history;
        }
        Merger.prototype.trace = function (item) {
            if (this.traceItems) {
                this.traceItems.push(item);
            }
        };
        /**
         * @param target Object to be extended
         * @param source Object with values to be copied into target
         * @returns extended object
         */
        Merger.prototype.deepExtend = function (target, source, path) {
            var _this = this;
            if (target === source)
                return target; // nothing left to merge
            if (!target || (!isHash(target) && !isArray(target))) {
                throw "first argument must be an object";
            }
            if (!source || (!isHash(source) && !isArray(source))) {
                throw "second argument must be an object";
            }
            /**
             * ignore functions
             */
            if (typeof source === "function") {
                return target;
            }
            /**
             * only track objects that trigger a recursion
             */
            this.push(source);
            /**
             * copy arrays into array
             */
            if (isArray(source)) {
                if (!isArray(target)) {
                    throw "attempting to merge an array into a non-array";
                }
                this.mergeArray("id", target, source, path);
                return target;
            }
            else if (isArray(target)) {
                if (!isArrayLike(source)) {
                    throw "attempting to merge a non-array into an array";
                }
            }
            /**
             * copy the values from source into the target
             */
            Object.keys(source).forEach(function (k) { return _this.mergeChild(k, target, source[k], path.slice()); });
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
            /**
             * nothing to do for this key
             */
            if (sourceValue === targetValue)
                return;
            /**
             * if new value is primitive create/update the target value
             */
            if (is_primitive_2.isPrimitive(sourceValue)) {
                // record change
                path.push(key);
                this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            /**
             * Maybe it's a pseudo-primitive that we can clone (Date or RegEx)
             */
            if (canClone(sourceValue)) {
                sourceValue = clone(sourceValue);
                // record change
                path.push(key);
                this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            /**
             * if new value is an array, merge with existing array or create a new property
             */
            if (isArray(sourceValue)) {
                /**
                 * we're dealing with objects (two arrays) that deepExtend understands
                 */
                if (isArray(targetValue)) {
                    this.deepExtendWithKey(targetValue, sourceValue, path, key);
                    return;
                }
                /**
                 * create/update the target with the source array
                 */
                sourceValue = this.cloneArray(sourceValue, path);
                path.push(key);
                this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            /**
             * source is not primitive, not a clonable primitive and not an array
             * so it must be an object with keys
             */
            if (!isHash(sourceValue)) {
                throw "unexpected source type: " + typeof sourceValue;
            }
            /**
             * if the target is not a hash object then create/update it
             */
            if (!isHash(targetValue)) {
                // clone the source
                var merger = new Merger(null, this.history);
                sourceValue = merger.deepExtend({}, sourceValue, path);
                path.push(key);
                this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            /**
             * Both source and target are known by deepExtend...
             */
            this.deepExtendWithKey(targetValue, sourceValue, path, key);
            return;
        };
        Merger.prototype.deepExtendWithKey = function (targetValue, sourceValue, path, key) {
            var index = path.push(key);
            this.deepExtend(targetValue, sourceValue, path);
            // no changes, remove key from path
            if (index === path.length)
                path.pop();
        };
        Merger.prototype.mergeArray = function (key, target, source, path) {
            var _this = this;
            // skip trivial arrays
            if (!isArray(target))
                throw "target must be an array";
            if (!isArray(source))
                throw "input must be an array";
            if (!source.length)
                return target;
            // quickly find keyed targets
            var hash = {};
            target.forEach(function (item, i) {
                if (!item[key])
                    return;
                hash[item[key]] = i;
            });
            source.forEach(function (sourceItem, i) {
                var sourceKey = sourceItem[key];
                var targetIndex = hash[sourceKey];
                /**
                 * No "id" so perform a naive update/create on the target
                 */
                if (isUndefined(sourceKey)) {
                    if (isHash(target[i]) && !!target[i][key]) {
                        throw "cannot replace an identified array item with a non-identified array item";
                    }
                    _this.mergeChild(i, target, sourceItem, path.slice());
                    return;
                }
                /**
                 * not target so add it to the end of the array
                 */
                if (isUndefined(targetIndex)) {
                    _this.mergeChild(target.length, target, sourceItem, path.slice());
                    return;
                }
                /**
                 * The target item exists so need to merge the source item
                 */
                _this.mergeChild(targetIndex, target, sourceItem, path.slice());
                return;
            });
            return target;
        };
        return Merger;
    }());
});
define("node_modules/ol3-fun/ol3-fun/extensions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Stores associated data in an in-memory repository using a WeakMap
     */
    var Extensions = /** @class */ (function () {
        function Extensions() {
            this.hash = new WeakMap(null);
        }
        Extensions.prototype.isExtended = function (o) {
            return this.hash.has(o);
        };
        /**
        Forces the existence of an extension container for an object
        @param o the object of interest
        @param [ext] sets these value on the extension object
        @returns the extension object
        */
        Extensions.prototype.extend = function (o, ext) {
            var hashData = this.hash.get(o);
            if (!hashData) {
                hashData = {};
                this.hash.set(o, hashData);
            }
            // update the extension values
            ext && Object.keys(ext).forEach(function (k) { return (hashData[k] = ext[k]); });
            return hashData;
        };
        /**
        Ensures extensions are shared across objects
        */
        Extensions.prototype.bind = function (o1, o2) {
            if (this.isExtended(o1)) {
                if (this.isExtended(o2)) {
                    if (this.hash.get(o1) === this.hash.get(o2))
                        return;
                    throw "both objects already bound";
                }
                else {
                    this.hash.set(o2, this.extend(o1));
                }
            }
            else {
                this.hash.set(o1, this.extend(o2));
            }
        };
        return Extensions;
    }());
    exports.Extensions = Extensions;
});
define("node_modules/ol3-fun/index", ["require", "exports", "node_modules/ol3-fun/ol3-fun/common", "node_modules/ol3-fun/ol3-fun/css", "node_modules/ol3-fun/ol3-fun/navigation", "node_modules/ol3-fun/ol3-fun/parse-dms", "node_modules/ol3-fun/ol3-fun/slowloop", "node_modules/ol3-fun/ol3-fun/deep-extend", "node_modules/ol3-fun/ol3-fun/extensions"], function (require, exports, common_2, css_1, navigation_1, parse_dms_1, slowloop_2, deep_extend_1, extensions_1) {
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
        },
        Extensions: extensions_1.Extensions
    };
    return index;
});
define("node_modules/ol3-fun/tests/spec/api", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/index"], function (require, exports, base_1, API) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_1.describe("Test Harness API", function () {
        base_1.it("full api exists", function () {
            base_1.shouldEqual([base_1.describe, base_1.it, base_1.should, base_1.shouldEqual, base_1.shouldThrow, base_1.assert, base_1.expect, base_1.slowloop, base_1.stringify].every(function (f) { return typeof f === "function"; }), true, "API functions exist");
        });
    });
    base_1.describe("API", function () {
        base_1.it("full api exists", function () {
            base_1.shouldEqual([
                API.asArray,
                API.cssin,
                API.debounce,
                API.defaults,
                API.dms.parse,
                API.doif,
                API.getParameterByName,
                API.getQueryParameters,
                API.html,
                API.mixin,
                API.navigation.zoomToFeature,
                API.pair,
                API.parse,
                API.range,
                API.shuffle,
                API.slowloop,
                API.toggle,
                API.uuid
            ].every(function (f) { return typeof f === "function"; }), true, "API functions exist");
        });
    });
});
define("node_modules/ol3-fun/tests/spec/common", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, base_2, common_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function sum(list) {
        return list.reduce(function (a, b) { return a + b; }, 0);
    }
    describe("asArray tests", function () {
        it("asArray", function (done) {
            if (!document)
                return;
            document.body.appendChild(document.createElement("div"));
            var list = document.getElementsByTagName("div");
            var result = common_3.asArray(list);
            base_2.should(result.length === list.length, "array size matches list size");
            done();
        });
    });
    describe("uuid tests", function () {
        it("uuid", function () {
            base_2.should(common_3.uuid().length === 36, "uuid has 36 characters");
        });
    });
    describe("pair tests", function () {
        it("empty test", function () {
            base_2.should(0 === common_3.pair([], []).length, "empty result");
            base_2.should(0 === common_3.pair([1], []).length, "empty result");
            base_2.should(0 === common_3.pair([], [1]).length, "empty result");
        });
        it("ensures all combinations", function () {
            var A = [1, 3, 5], B = [7, 11, 13], result = common_3.pair(A, B);
            base_2.should(A.length * sum(B) + B.length * sum(A) === sum(result.map(function (v) { return v[0] + v[1]; })), "create product from two vectors");
        });
    });
    describe("range tests", function () {
        it("empty test", function () {
            base_2.should(0 === common_3.range(0).length, "empty result");
        });
        it("size tests", function () {
            base_2.should(1 === common_3.range(1).length, "single item");
            base_2.should(10 === common_3.range(10).length, "ten items");
        });
        it("content tests", function () {
            base_2.should(45 === sum(common_3.range(10)), "range '10' contains 0..9");
        });
    });
    describe("shuffle tests", function () {
        it("empty test", function () {
            base_2.should(0 === common_3.shuffle([]).length, "empty result");
        });
        it("size tests", function () {
            base_2.should(1 === common_3.shuffle(common_3.range(1)).length, "single item");
            base_2.should(10 === common_3.shuffle(common_3.range(10)).length, "ten items");
        });
        it("content tests", function () {
            base_2.should(45 === sum(common_3.shuffle(common_3.range(10))), "range '10' contains 0..9");
        });
    });
    describe("toggle tests", function () {
        it("toggle", function () {
            var div = document.createElement("div");
            base_2.should(div.className === "", "div contains no className");
            common_3.toggle(div, "foo");
            base_2.should(div.className === "foo", "toggle adds");
            common_3.toggle(div, "foo");
            base_2.should(div.className === "", "second toggles removes");
            common_3.toggle(div, "foo", true);
            base_2.should(div.className === "foo", "forces foo to exist when it does not exist");
            common_3.toggle(div, "foo", true);
            base_2.should(div.className === "foo", "forces foo to exist when it already exists");
            common_3.toggle(div, "foo", false);
            base_2.should(div.className === "", "forces foo to not exist");
            common_3.toggle(div, "foo", false);
            base_2.should(div.className === "", "forces foo to not exist");
        });
    });
    describe("parse tests", function () {
        it("parse", function () {
            var num = 0;
            var bool = false;
            base_2.should(common_3.parse("", "").toString() === "", "empty string");
            base_2.should(common_3.parse("1", "").toString() === "1", "numeric string");
            base_2.should(common_3.parse("1", num) === 1, "numeric string as number returns number");
            base_2.should(common_3.parse("0", bool) === false, "0 as boolean is false");
            base_2.should(common_3.parse("1", bool) === true, "1 as boolean is true");
            base_2.should(common_3.parse("false", bool) === false, "'false' as boolean is false");
            base_2.should(common_3.parse("true", bool) === true, "'true' as boolean is true");
            base_2.should(common_3.parse("1", num) === 1, "numeric string as number returns number");
            base_2.should(common_3.parse("1", num) === 1, "numeric string as number returns number");
            base_2.should(common_3.parse("1,2,3", [num])[1] === 2, "parse into numeric array");
        });
    });
    describe("getQueryParameters tests", function () {
        it("getQueryParameters", function () {
            var options = { a: "" };
            common_3.getQueryParameters(options, "foo?a=1&b=2");
            base_2.shouldEqual(options.a, "1", "a=1 extracted");
            base_2.shouldEqual(options.b, undefined, "b not assigned");
            options = { b: "" };
            common_3.getQueryParameters(options, "foo?a=1&b=2");
            base_2.shouldEqual(options.b, "2", "b=2 extracted");
            base_2.shouldEqual(options.a, undefined, "a not assigned");
            options.a = options.b = options.c = "<null>";
            common_3.getQueryParameters(options, "foo?a=1&b=2");
            base_2.shouldEqual(options.a, "1", "a=1 extracted");
            base_2.shouldEqual(options.b, "2", "b=2 extracted");
            base_2.shouldEqual(options.c, "<null>", "c not assigned, original value untouched");
        });
    });
    describe("getParameterByName tests", function () {
        it("getParameterByName", function () {
            base_2.shouldEqual(common_3.getParameterByName("a", "foo?a=1"), "1", "a=1");
            base_2.shouldEqual(common_3.getParameterByName("b", "foo?a=1"), null, "b does not exist");
        });
    });
    describe("doif tests", function () {
        var die = function (n) {
            throw "doif callback not expected to execute: " + n;
        };
        var spawn = function () {
            var v = true;
            return function () { return (v = !v); };
        };
        it("doif false tests", function () {
            common_3.doif(undefined, die);
            common_3.doif(null, die);
        });
        it("doif empty tests", function () {
            var c = spawn();
            common_3.doif(0, c);
            base_2.shouldEqual(c(), true, "0 invokes doif");
            common_3.doif(false, c);
            base_2.shouldEqual(c(), true, "false invokes doif");
            common_3.doif({}, c);
            base_2.shouldEqual(c(), true, "{} invokes doif");
        });
        it("doif value tests", function () {
            common_3.doif(0, function (v) { return base_2.shouldEqual(v, 0, "0"); });
            common_3.doif({ a: 100 }, function (v) { return base_2.shouldEqual(v.a, 100, "a = 100"); });
        });
    });
    describe("mixin tests", function () {
        it("simple mixins", function () {
            base_2.shouldEqual(common_3.mixin({ a: 1 }, { b: 2 }).a, 1, "a=1");
            base_2.shouldEqual(common_3.mixin({ a: 1 }, { b: 2 }).b, 2, "b=2");
            base_2.shouldEqual(common_3.mixin({ a: 1 }, { b: 2 }).c, undefined, "c undefined");
            base_2.shouldEqual(common_3.mixin({ a: 1 }, {}).a, 1, "a=1");
            base_2.shouldEqual(common_3.mixin({}, { b: 2 }).b, 2, "b=2");
        });
        it("nested mixins", function () {
            var _a;
            base_2.shouldEqual(common_3.mixin({ vermont: { burlington: true } }, (_a = {}, _a["south carolina"] = { greenville: true }, _a))["south carolina"]
                .greenville, true, "greenville is in south carolina");
            base_2.shouldEqual(common_3.mixin({ vermont: { burlington: true } }, { vermont: { greenville: false } }).vermont.greenville, false, "greenville is not in vermont");
            base_2.shouldEqual(common_3.mixin({ vermont: { burlington: true } }, { vermont: { greenville: false } }).vermont.burlington, undefined, "second vermont completely wipes out 1st");
        });
    });
    describe("defaults tests", function () {
        it("defaults", function () {
            base_2.shouldEqual(common_3.defaults({ a: 1 }, { a: 2, b: 3 }).a, 1, "a = 1");
            base_2.shouldEqual(common_3.defaults({ a: 1 }, { a: 2, b: 3 }).b, 3, "b = 3");
            base_2.shouldEqual(common_3.defaults({}, { a: 2, b: 3 }).a, 2, "a = 2");
        });
    });
    describe("html tests", function () {
        it("tableless tr test", function () {
            var markup = "<tr>A<td>B</td></tr>";
            var tr = common_3.html(markup);
            base_2.should(tr.nodeValue === "AB", "setting innerHTML on a 'div' will not assign tr elements");
        });
        it("table tr test", function () {
            var markup = "<table><tbody><tr><td>Test</td></tr></tbody></table>";
            var table = common_3.html(markup);
            base_2.should(table.outerHTML === markup, "preserves tr when within a table");
        });
        it("canvas test", function () {
            var markup = "<canvas width=\"100\" height=\"100\"></canvas>";
            var canvas = common_3.html(markup);
            base_2.should(canvas.outerHTML === markup, "canvas markup preserved");
            base_2.should(!!canvas.getContext("2d"), "cnvas has 2d context");
        });
    });
});
define("node_modules/ol3-fun/tests/spec/slowloop", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, base_3, common_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_3.describe("slowloop", function () {
        base_3.it("slowloop empty", function (done) {
            try {
                base_3.slowloop(null);
                base_3.should(false, "slowloop requires an array");
            }
            catch (_a) {
                done();
            }
        });
        base_3.it("slowloop with progress", function () {
            var progressCount = 0;
            return base_3.slowloop(common_4.range(7).map(function (n) { return function () { }; }), 0, 5)
                .progress(function (args) {
                console.log(args);
                progressCount++;
            })
                .then(function () {
                base_3.shouldEqual(progressCount, 7 * 5, "progress callbacks");
            });
        });
        base_3.it("slowloop with exceptions", function () {
            return base_3.slowloop([
                function () {
                    throw "exception occured in slowloop";
                }
            ])
                .then(function () { return base_3.should(false, "failure expected"); })
                .catch(function (ex) { return base_3.should(!!ex, ex); });
        });
        base_3.it("slowloop with abort", function () {
            return base_3.slowloop([
                function () {
                    base_3.should(false, "aborted from inside");
                }
            ], 10)
                .reject("aborted from outside")
                .catch(function (ex) { return base_3.shouldEqual(ex, "aborted from outside", "aborted from outside"); });
        });
        base_3.it("slowloop fast", function (done) {
            var count = 0;
            var inc = function () { return count++; };
            base_3.slowloop([inc, inc, inc], 0, 100).then(function () {
                base_3.shouldEqual(count, 300, "0 ms * 100 iterations * 3 functions => 300 invocations");
                done();
            });
        }).timeout(2000);
        base_3.it("slowloop iterations", function (done) {
            var count = 0;
            var inc = function () { return count++; };
            base_3.slowloop([inc]).then(function () {
                base_3.shouldEqual(count, 1, "defaults to a single iteration");
                base_3.slowloop([inc], 0, 2).then(function () {
                    base_3.shouldEqual(count, 3, "performs two iterations");
                    base_3.slowloop([inc], 0, 0).then(function () {
                        base_3.shouldEqual(count, 3, "performs 0 iterations");
                        done();
                    });
                });
            });
        });
    });
});
define("node_modules/ol3-fun/tests/spec/deep-extend", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/deep-extend", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, base_4, deep_extend_2, common_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("utils/deep-extend", function () {
        it("trivial merges", function () {
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend({}, {})), base_4.stringify({}), "empty objects");
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([], [])), base_4.stringify([]), "empty arrays");
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([], {})), base_4.stringify([]), "empty arrays with empty object");
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([,], [, ,])), base_4.stringify([,]), "arrays with empty items");
            var o = { a: 1 };
            base_4.shouldEqual(o, deep_extend_2.extend(o, o), "merges same object");
            base_4.should(o !== deep_extend_2.extend(o), "clones when second argument not provided");
        });
        it("invalid merges", function () {
            base_4.shouldThrow(function () { return deep_extend_2.extend({}, []); }, "array->object considered an error");
            base_4.shouldThrow(function () { return deep_extend_2.extend({ a: 1 }, []); }, "{a:1} and []");
            base_4.shouldThrow(function () { return deep_extend_2.extend([], { a: 1 }); }, "[] and {a:1}");
            base_4.shouldThrow(function () { return deep_extend_2.extend(1, 2); }, "primitives");
            base_4.shouldThrow(function () { return deep_extend_2.extend(new Date(2000, 1, 1), new Date(2000, 1, 2)); }, "clonable primitives");
            var a = { a: 1 };
            var b = { b: a };
            a.b = b;
            base_4.shouldEqual(base_4.shouldThrow(function () { return deep_extend_2.extend(b); }, "b->a->b"), "circular reference detected");
        });
        it("merges with duplicate objects that might be detected as recursive", function () {
            var o = { a: { date: new Date(Date.now() - 1000), address: { street: "main" } } };
            var p = { o1: o, o2: o };
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend(p)), base_4.stringify(p), "two children pointing to the same object");
            var q = { p1: p, p2: [p], p3: [{ id: "P", value: p }] };
            var actual = base_4.stringify(deep_extend_2.extend(q, deep_extend_2.extend(p, o)));
            base_4.should(!!actual, "complex linked");
        });
        it("simple data merges", function () {
            var o = deep_extend_2.extend({ v1: 1 });
            base_4.shouldEqual(o.v1, 1, "adds v1");
            deep_extend_2.extend(o, { v1: 2 });
            base_4.shouldEqual(o.v1, 2, "updates v1");
        });
        it("simple array merges", function () {
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([1], [])), base_4.stringify([1]), "[1] + []");
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([1], [2])), base_4.stringify([2]), "[1<-2]");
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([1, 2, 3], [2])), base_4.stringify([2, 2, 3]), "[1<-2,2,3]]");
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([2], [1, 2, 3])), base_4.stringify([1, 2, 3]), "[2<-1, 2, 3]");
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([, , , 4], [1, 2, 3])), base_4.stringify([1, 2, 3, 4]), "array can have empty items");
            base_4.should(base_4.deepEqual(deep_extend_2.extend([1, 2, 3], { 1: 100 }), [1, 100, 3]), "array<-object");
            base_4.should(base_4.deepEqual(deep_extend_2.extend([{ id: 1 }], [{ id: 2 }]), [{ id: 1 }, { id: 2 }]), "[1] + [2] with ids");
        });
        it("preserves array ordering", function () {
            base_4.shouldEqual(deep_extend_2.extend([{ id: 1 }], [{ id: 1 }, { id: 2 }])[0].id, 1, "first item id");
            base_4.shouldEqual(deep_extend_2.extend([{ id: 2 }], [{ id: 1 }, { id: 2 }])[0].id, 2, "first item id");
            base_4.shouldEqual(deep_extend_2.extend([{ id: 1 }, { id: 3 }], [{ id: 2 }, { id: 1, v: 1 }])[0].v, 1, "first item id");
        });
        it("clones objects with primitives", function () {
            var source = { v1: { v2: { v3: 1 } } };
            var o = deep_extend_2.extend(source);
            base_4.shouldEqual(o.v1.v2.v3, 1, "properly extends {}");
            base_4.should(source.v1 !== o.v1, "properly clones objects");
        });
        it("clones dates", function () {
            var source = { date: new Date() };
            var o = deep_extend_2.extend(source);
            base_4.should(source.date !== o.date, "dates are clones");
            base_4.shouldEqual(source.date.getUTCDate(), o.date.getUTCDate(), "date values are preserved");
        });
        it("clones nested objects", function () {
            var source = { v1: { v2: { v3: 1 } } };
            var o = deep_extend_2.extend(source);
            base_4.should(source !== o, "clones source");
            base_4.shouldEqual(source.v1.v2.v3, o.v1.v2.v3, "properly extends v3");
            base_4.should(source.v1 !== o.v1, "properly clones v1");
            base_4.should(source.v1.v2 !== o.v1.v2, "properly clones v1.v2");
        });
        it("clones arrays", function () {
            var source = { v1: common_5.range(1).map(function (i) { return ({ id: i + 1, value: i }); }) };
            var o = deep_extend_2.extend(source);
            base_4.should(source !== o, "clones source");
            base_4.should(source.v1 !== o.v1, "clones v1");
            base_4.should(source.v1[0].value === o.v1[0].value, "extends v1[1].value");
            base_4.should(source.v1[0] !== o.v1[0], "clones v1[1]");
        });
        it("confirms references are preserved", function () {
            var x = { foo: { bar: "foo" }, array: [{ id: "a", value: "ax" }] };
            var y = { foo: { bar: "bar" }, array: [{ id: "a", value: "ay" }] };
            var xfoo = x.foo;
            var xarray = x.array[0];
            var z = deep_extend_2.extend(x, y);
            base_4.shouldEqual(x, z, "returns x");
            base_4.shouldEqual(xfoo, z.foo, "reference foo preserved");
            base_4.shouldEqual(xarray.value, "ay", "existing array references are preserved");
        });
        it("confirms array merge is 'id' aware", function () {
            var o1 = {
                values: [
                    {
                        id: "v1",
                        value: { v1: 1 }
                    },
                    {
                        id: "v2",
                        value: { v2: 1 }
                    },
                    {
                        id: "v9",
                        value: { v9: 1 }
                    }
                ]
            };
            var o2 = {
                values: [
                    {
                        id: "v1",
                        value: { v1: 2 }
                    },
                    {
                        id: "v9",
                        value: { v9: 2 }
                    }
                ]
            };
            var o = deep_extend_2.extend(o1);
            base_4.shouldEqual(o.values[0].value.v1, 1, "object is clone of o1, v1");
            base_4.shouldEqual(o.values[1].value.v2, 1, "object is clone of o1, v2");
            base_4.shouldEqual(o.values[2].value.v9, 1, "object is clone of o1, v9");
            deep_extend_2.extend(o, o2);
            base_4.shouldEqual(o.values[0].value.v1, 2, "merge replaces v1");
            base_4.shouldEqual(o.values[1].value.v2, 1, "merge preserves v2");
            base_4.shouldEqual(o.values[2].value.v9, 2, "merge replaces v9");
        });
        it("confirms array references are preserved", function () {
            var x = { foo: { bar: "foo" } };
            var y = { foo: { bar: "bar" } };
            var xfoo = x.foo;
            var z = deep_extend_2.extend(x, y);
            base_4.shouldEqual(x, z, "returns x");
            base_4.shouldEqual(xfoo, z.foo, "reference foo preserved");
        });
        it("confirms trace on simple array merging", function () {
            var trace = [];
            var result = deep_extend_2.extend([1, 2, 5], [, 3], trace);
            base_4.shouldEqual(base_4.stringify(result), base_4.stringify([1, 3, 5]), "confirm array extended");
            base_4.shouldEqual(trace.length, 1, "length: 2<-3");
            base_4.shouldEqual(base_4.stringify(trace[0].path), base_4.stringify([1]), "path: target[1]");
            base_4.shouldEqual(trace[0].key, 1, "key: target[*1*] was 2 and is now 3");
            base_4.shouldEqual(trace[0].was, 2, "was: target[1] was *2* and is now 3");
            base_4.shouldEqual(trace[0].value, 3, "value: target[1] was 2 and is now *3*");
        });
        it("confirms trace diff on simple array", function () {
            var trace = [];
            deep_extend_2.extend([1, 2, 5], [, 3], trace);
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ 1: 3 }), "simple array trace diff");
        });
        it("confirms trace diff on simple array against array-like object", function () {
            var trace = [];
            deep_extend_2.extend([1, 2, 5], { 1: 3 }, trace);
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ 1: 3 }), "simple array trace diff");
        });
        it("confirms trace is empty when merging duplicate objects", function () {
            var trace = [];
            deep_extend_2.extend({}, {}, trace);
            base_4.shouldEqual(trace.length, 0, "no activity 0");
            deep_extend_2.extend({ a: 1 }, { a: 1 }, trace);
            base_4.shouldEqual(trace.length, 0, "no activity 1");
            deep_extend_2.extend({ a: 1, b: [1] }, { a: 1, b: [1] }, trace);
            base_4.shouldEqual(trace.length, 0, "no activity 2");
            deep_extend_2.extend({ a: 1, b: [1], c: {} }, { a: 1, b: [1], c: {} }, trace);
            base_4.shouldEqual(trace.length, 0, "no activity 3");
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 1, b: [1], c: { d: 1 } }, trace);
            base_4.shouldEqual(trace.length, 0, "no activity 4");
            deep_extend_2.extend({ a: [1, 2, 3] }, { a: [1, 2, 3] }, (trace = []));
            base_4.shouldEqual(trace.length, 0, "no activity 5");
            deep_extend_2.extend({ a: [1, 2, [3]] }, { a: [1, 2, [3]] }, (trace = []));
            base_4.shouldEqual(trace.length, 0, "no activity 6");
        });
        it("confirms trace count is 1 when exactly one change is merged", function () {
            var trace = [];
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 2, b: [1], c: { d: 1 } }, (trace = []));
            base_4.shouldEqual(trace.length, 1, "a:1->2");
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 1, b: [2], c: { d: 1 } }, (trace = []));
            base_4.shouldEqual(trace.length, 1, "b:1->2");
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 1, b: [1], c: { d: 2 } }, (trace = []));
            base_4.shouldEqual(trace.length, 1, "d:1->2");
            deep_extend_2.extend({ a: [1, 2, 3] }, { a: [1, 2, 30] }, (trace = []));
            base_4.shouldEqual(trace.length, 1, "3->30");
            deep_extend_2.extend({ a: [1, 2, [3]] }, { a: [1, 2, [3, 4]] }, (trace = []));
            base_4.shouldEqual(trace.length, 1, "[3]->[3,4]");
        });
        it("confirms trace count is 2 when exactly two changes is merged", function () {
            var trace = [];
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 2, b: [1, 2], c: { d: 1 } }, (trace = []));
            base_4.shouldEqual(trace.length, 2, "a:1->2, b:adds 2");
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 1, b: [2, 1], c: { d: 1 } }, (trace = []));
            base_4.shouldEqual(trace.length, 2, "b:1->2,adds 1");
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 1, b: [1], c: { d: 2, e: 3 } }, (trace = []));
            base_4.shouldEqual(trace.length, 2, "c.d:1->2, c.e:added");
            deep_extend_2.extend({ a: [1, 2, 3] }, { a: [10, 2, 30] }, (trace = []));
            base_4.shouldEqual(trace.length, 2, "1->10, 3->30");
            deep_extend_2.extend({ a: [1, 2, [3]] }, { a: [1, 2, [3, 4], 5] }, (trace = []));
            base_4.shouldEqual(trace.length, 2, "[3]->[3,4], 4 added");
        });
        it("confirms trace diff when exactly one change is made", function () {
            var trace = [];
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 2, b: [1], c: { d: 1 } }, (trace = []));
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ a: 2 }), "a:1->2");
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 1, b: [2], c: { d: 1 } }, (trace = []));
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ b: { 0: 2 } }), "b:1->2");
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 1, b: [1], c: { d: 2 } }, (trace = []));
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ c: { d: 2 } }), "d:1->2");
            deep_extend_2.extend({ a: [1, 2, 3] }, { a: [1, 2, 30] }, (trace = []));
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ a: { 2: 30 } }), "a[2]:3->30");
            deep_extend_2.extend({ a: [1, 2, [3]] }, { a: [1, 2, [3, 4]] }, (trace = []));
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ a: { 2: { 1: 4 } } }), "[3]->[3,4]");
        });
        it("confirms trace diff when exactly two changes are made", function () {
            var trace = [];
            deep_extend_2.extend({ a: [1, 2, ["3"]] }, { a: [1, 2, ["A", "B"]] }, (trace = []));
            // this should not pass..a[2][0]<-A, A[2][1]<-B is {a: {2: {0: "A", 1: "B"}}}
            //shouldEqual(stringify(diff(trace)), stringify({ a: { 2: { 0: { 0: "A", 1: "B" } } } }), "a[2]:[3]<-[A,B]");
            // this should not fail...
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ a: { 2: { 0: "A", 1: "B" } } }), "a[2]:[3]<-[A,B]");
        });
        it("confirms trace content", function () {
            var trace = [];
            var target = deep_extend_2.extend({
                foo: 1,
                bar: 2
            }, {
                foo: 1,
                property: "should fire 'add' event with this object and string path to it",
                object: {
                    p1: "p1",
                    p2: 2,
                    a1: [1, 2, 3],
                    a2: [{ id: "v1", value: 1 }]
                }
            }, trace);
            base_4.shouldEqual(trace.length, 2, "property added, object added");
            base_4.shouldEqual(trace.length, trace.filter(function (t) { return t.value !== t.was; }).length, "no trivial trace elements");
            base_4.shouldEqual(trace.map(function (t) { return t.key; }).join(" "), "property object", "changes are depth first");
            // property
            var t = trace.shift();
            base_4.shouldEqual(t.key, "property", "property");
            base_4.shouldEqual(t.value, target.property, "target.property");
            // object
            t = trace.shift();
            base_4.shouldEqual(t.key, "object", "object");
            base_4.shouldEqual(t.value, target.object, "target.object");
        });
        it("generates empty diff from the trace", function () {
            var trace = [];
            var a = {
                personalInfo: {
                    email: "aliceames@email.org",
                    lastName: "Ames",
                    firstName: "Alice"
                },
                name: "name"
            };
            var b = {
                name: "name",
                personalInfo: {
                    firstName: "Alice",
                    lastName: "Ames",
                    email: "aliceames@email.org"
                }
            };
            var expected = {};
            deep_extend_2.extend(a, b, (trace = []));
            console.log("trace", base_4.stringify(trace));
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify(expected));
        });
        it("generates a diff from the trace", function () {
            var trace = [];
            var a = {
                name: "name",
                personalInfo: {
                    firstName: "Alice",
                    lastName: "Ames"
                }
            };
            var b = {
                name: "name",
                personalInfo: {
                    firstName: "Alice",
                    lastName: "Ames",
                    email: "aliceames@email.org"
                }
            };
            var expected = {
                personalInfo: {
                    email: "aliceames@email.org"
                }
            };
            deep_extend_2.extend(a, b, (trace = []));
            console.log("trace", base_4.stringify(trace));
            /**
             * I want a minimal version of b, in this case it should drop the name
             */
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify(expected));
        });
    });
    function forcePath(o, path) {
        var node = o;
        path.forEach(function (n) { return (node = node[n] = node[n] || {}); });
        return node;
    }
    function diff(trace) {
        var result = {};
        trace.forEach(function (t) {
            var path = t.path.slice();
            var key = t.key;
            console.assert(key === path.pop());
            forcePath(result, path)[key] = t.value;
        });
        return result;
    }
});
define("node_modules/ol3-fun/tests/spec/extensions", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/index", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, base_5, index_7, common_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_5.describe("data/extensions", function () {
        base_5.it("ensures the api", function () {
            var x = new index_7.Extensions();
            base_5.shouldEqual(typeof x.extend, "function", "extend method");
            base_5.shouldEqual(typeof x.bind, "function", "bind method");
            base_5.shouldEqual(typeof x.isExtended, "function", "isExtended method");
        });
        base_5.it("ensures no side-effects on the object", function () {
            var x = new index_7.Extensions();
            var o = {};
            var expected = JSON.stringify(o);
            x.extend(o, { custom: "data" });
            var actual = JSON.stringify(o);
            base_5.shouldEqual(expected, actual, "no side-effects");
        });
        base_5.it("ensures two objects can be bound to same extension data", function () {
            var x = new index_7.Extensions();
            var math = x.extend(Math, { sqrt2: Math.sqrt(2) });
            base_5.should(!!x.extend(Math).sqrt2, "Math.sqrt2");
            x.bind(Number, Math);
            base_5.shouldEqual(Math.round(math.sqrt2 * x.extend(Number).sqrt2), 2, "sqrt2*sqrt2 = 2");
        });
        base_5.it("ensures two extensions can bind data to the same object", function () {
            var ext1 = new index_7.Extensions();
            var ext2 = new index_7.Extensions();
            var o = {};
            ext1.extend(o, { ext: 1 });
            ext2.extend(o, { ext: 2 });
            base_5.shouldEqual(ext1.extend(o).ext, 1, "ext1");
            base_5.shouldEqual(ext2.extend(o).ext, 2, "ext2");
        });
        base_5.it("ensures two extended objects cannot be bound", function () {
            var x = new index_7.Extensions();
            var o = {};
            var p = {};
            x.extend(o);
            x.extend(p);
            base_5.shouldThrow(function () { return x.bind(o, p); }, "cannot bind extended objects");
        });
        base_5.it("ensures isExtended returns true iff it is extended", function () {
            var x1 = new index_7.Extensions();
            var x2 = new index_7.Extensions();
            var o = {};
            base_5.should(!x1.isExtended(o), "not extended in x1");
            x1.extend(o);
            base_5.should(x1.isExtended(o), "extended in x1");
            base_5.should(!x2.isExtended(o), "not extended in x2");
            x2.extend(o);
            base_5.should(x2.isExtended(o), "extended in x2");
        });
        base_5.it("extension references are preserved", function () {
            var x = new index_7.Extensions();
            var o = {};
            var p = x.extend(o);
            x.extend(o, { name: "P" });
            base_5.shouldEqual(p.name, "P", "extension references are preserved");
        });
        base_5.it("binds two objects to the same extension", function () {
            var x = new index_7.Extensions();
            var o1 = { id: 1 };
            var o2 = Object.create({ id: 2 });
            x.bind(o1, o2);
            x.extend(o1, { foo: "foo1" });
            base_5.shouldEqual(x.extend(o1).foo, "foo1");
            x.extend(o2, { foo: "foo2" });
            base_5.shouldEqual(x.extend(o1).foo, "foo2");
        });
        base_5.it("extension integrity testing (100 objects X 10 extensions)", function () {
            var x = common_6.range(10).map(function (n) { return new index_7.Extensions(); });
            var data = common_6.range(1000).map(function (n) { return Object.create({ id: n }); });
            data.map(function (d, i) { return x[i % 10].extend(d, { data: common_6.shuffle(common_6.range(1000)) }); });
            data.forEach(function (d, i) {
                var data = x[i % 10].extend(d).data;
                data = data.filter(function (v) { return v <= d.id; });
                x[i % 10].extend(d, { data: data });
            });
            var sums = data.map(function (d, i) {
                var ext = x[i % 10].extend(d);
                base_5.shouldEqual(ext.data.length, i + 1, "extension data has " + (i + 1) + " items");
                return ext.data.reduce(function (a, b) { return a + b; }, 0);
            });
            console.log(sums);
            // CODEFIGHTS: what is the closed expression for this?
            base_5.shouldEqual(sums.reduce(function (a, b) { return a + b; }, 0), 166666500);
        });
        base_5.it("extensions performance testing (1 million accesses)", function () {
            // how to capture memory?
            var x = new index_7.Extensions();
            var data = common_6.range(500000).map(function (n) { return ({ id: n }); });
            var counter = { count: 0 };
            data.forEach(function (d) { return x.extend(d, { counter: counter }); });
            data.forEach(function (d) { return x.extend(d).counter.count++; });
            base_5.shouldEqual(counter.count, data.length, "accessed " + data.length + " items");
        }).timeout(1000);
    });
});
define("node_modules/ol3-fun/tests/spec/is-primitive", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/is-primitive"], function (require, exports, base_6, is_primitive_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_6.describe("is-primitive", function () {
        base_6.it("true tests", function () {
            ["A", 1, true, null, undefined, Symbol(0)].forEach(function (v) {
                return base_6.should(is_primitive_3.isPrimitive(v), (v && v.toString ? v.toString() : v) + " is primitive");
            });
        });
        base_6.it("false tests", function () {
            [new Date(), new RegExp(""), {}, []].forEach(function (v) {
                return base_6.should(!is_primitive_3.isPrimitive(v), (v && v.toString ? v.toString() : v) + " is primitive");
            });
        });
    });
});
define("node_modules/ol3-fun/tests/spec/is-cycle", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/is-cyclic"], function (require, exports, base_7, is_cyclic_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_7.describe("is-cycle", function () {
        base_7.it("false tests", function () {
            var a = {};
            var b = { a: a };
            base_7.should(!is_cyclic_2.isCyclic({
                a: a,
                b: b
            }), "nothing in this graph refers back to an ancestor of itself");
        });
        base_7.it("true tests", function () {
            var a = { b: "" };
            var b = { a: a };
            a.b = b;
            base_7.should(is_cyclic_2.isCyclic(b), "b->a->b");
            base_7.should(is_cyclic_2.isCyclic({ b: b }), "{}->b->a->b");
            base_7.shouldThrow(function () { return base_7.stringify(b); }, "cycles cannot be serialized");
        });
    });
});
define("node_modules/ol3-fun/tests/spec/openlayers-test", ["require", "exports", "node_modules/ol3-fun/tests/base", "openlayers"], function (require, exports, base_8, ol) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("ol/Map", function () {
        it("ol/Map", function () {
            base_8.should(!!ol.Map, "Map");
        });
    });
});
define("node_modules/ol3-fun/tests/spec/parse-dms", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/parse-dms"], function (require, exports, base_9, parse_dms_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_9.describe("parse-dms", function () {
        base_9.it("parse", function () {
            var dms = parse_dms_2.parse("10 5'2\" 10");
            if (typeof dms === "number")
                throw "lat-lon expected";
            base_9.should(dms.lat === 10.08388888888889, "10 degrees 5 minutes 2 seconds");
            base_9.should(dms.lon === 10, "10 degrees 0 minutes 0 seconds");
        });
    });
});
define("node_modules/ol3-fun/ol3-fun/google-polyline", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * https://developers.google.com/maps/documentation/utilities/polylinealgorithm?csw=1
     * https://github.com/DeMoehn/Cloudant-nyctaxi/blob/2e48cb6c53bd4ac4f58d50d9302f00fc72f6681e/app/js/polyline.js
     */
    var PolylineEncoder = /** @class */ (function () {
        function PolylineEncoder() {
        }
        PolylineEncoder.prototype.encodeCoordinate = function (coordinate, factor) {
            coordinate = Math.round(coordinate * factor);
            coordinate <<= 1;
            if (coordinate < 0) {
                coordinate = ~coordinate;
            }
            var output = '';
            while (coordinate >= 0x20) {
                output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 0x3f);
                coordinate >>= 5;
            }
            output += String.fromCharCode(coordinate + 0x3f);
            return output;
        };
        PolylineEncoder.prototype.decode = function (str, precision) {
            if (precision === void 0) { precision = 5; }
            var index = 0, lat = 0, lng = 0, coordinates = [], latitude_change, longitude_change, factor = Math.pow(10, precision);
            while (index < str.length) {
                var byte = 0;
                var shift = 0;
                var result = 0;
                do {
                    byte = str.charCodeAt(index++) - 0x3f;
                    result |= (byte & 0x1f) << shift;
                    shift += 5;
                } while (byte >= 0x20);
                var latitude_change_1 = ((result & 1) ? ~(result >> 1) : (result >> 1));
                shift = result = 0;
                do {
                    byte = str.charCodeAt(index++) - 0x3f;
                    result |= (byte & 0x1f) << shift;
                    shift += 5;
                } while (byte >= 0x20);
                longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
                lat += latitude_change_1;
                lng += longitude_change;
                coordinates.push([lat / factor, lng / factor]);
            }
            return coordinates;
        };
        PolylineEncoder.prototype.encode = function (coordinates, precision) {
            if (precision === void 0) { precision = 5; }
            if (!coordinates.length)
                return '';
            var factor = Math.pow(10, precision), output = this.encodeCoordinate(coordinates[0][0], factor) + this.encodeCoordinate(coordinates[0][1], factor);
            for (var i = 1; i < coordinates.length; i++) {
                var a = coordinates[i], b = coordinates[i - 1];
                output += this.encodeCoordinate(a[0] - b[0], factor);
                output += this.encodeCoordinate(a[1] - b[1], factor);
            }
            return output;
        };
        return PolylineEncoder;
    }());
    return PolylineEncoder;
});
/**
 * Use [ol.format.Polyline](http://openlayers.org/en/master/apidoc/ol.format.Polyline.html)
 */
define("node_modules/ol3-fun/ol3-fun/ol3-polyline", ["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    var Polyline = ol.format.Polyline;
    var PolylineEncoder = /** @class */ (function () {
        function PolylineEncoder(precision, stride) {
            if (precision === void 0) { precision = 5; }
            if (stride === void 0) { stride = 2; }
            this.precision = precision;
            this.stride = stride;
        }
        PolylineEncoder.prototype.flatten = function (points) {
            var nums = new Array(points.length * this.stride);
            var i = 0;
            points.forEach(function (p) { return p.map(function (p) { return nums[i++] = p; }); });
            return nums;
        };
        PolylineEncoder.prototype.unflatten = function (nums) {
            var points = new Array(nums.length / this.stride);
            for (var i = 0; i < nums.length / this.stride; i++) {
                points[i] = nums.slice(i * this.stride, (i + 1) * this.stride);
            }
            return points;
        };
        PolylineEncoder.prototype.round = function (nums) {
            var factor = Math.pow(10, this.precision);
            return nums.map(function (n) { return Math.round(n * factor) / factor; });
        };
        PolylineEncoder.prototype.decode = function (str) {
            var nums = Polyline.decodeDeltas(str, this.stride, Math.pow(10, this.precision));
            return this.unflatten(this.round(nums));
        };
        PolylineEncoder.prototype.encode = function (points) {
            return Polyline.encodeDeltas(this.flatten(points), this.stride, Math.pow(10, this.precision));
        };
        return PolylineEncoder;
    }());
    return PolylineEncoder;
});
define("node_modules/ol3-fun/tests/spec/polyline", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/google-polyline", "node_modules/ol3-fun/ol3-fun/ol3-polyline", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, base_10, GooglePolylineEncoder, PolylineEncoder, common_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("GooglePolylineEncoder", function () {
        it("GooglePolylineEncoder", function () {
            base_10.should(!!GooglePolylineEncoder, "GooglePolylineEncoder");
        });
        var points = common_7.pair(common_7.range(10), common_7.range(10));
        var poly = new GooglePolylineEncoder();
        var encoded = poly.encode(points);
        var decoded = poly.decode(encoded);
        base_10.shouldEqual(encoded.length, 533, "encoding is 533 characters");
        base_10.shouldEqual(base_10.stringify(decoded), base_10.stringify(points), "encode->decode");
    });
    describe("PolylineEncoder", function () {
        it("PolylineEncoder", function () {
            base_10.should(!!PolylineEncoder, "PolylineEncoder");
        });
        var points = common_7.pair(common_7.range(10), common_7.range(10));
        var poly = new PolylineEncoder(); // default precision is 5
        var encoded = poly.encode(points);
        var decoded = poly.decode(encoded);
        base_10.shouldEqual(encoded.length, 533, "encoding is 533 characters");
        base_10.shouldEqual(base_10.stringify(decoded), base_10.stringify(points), "encode->decode");
        poly = new PolylineEncoder(6);
        encoded = poly.encode(points);
        decoded = poly.decode(encoded);
        base_10.shouldEqual(encoded.length, 632, "encoding is 632 characters");
        base_10.shouldEqual(base_10.stringify(decoded), base_10.stringify(points), "encode->decode");
    });
});
define("node_modules/ol3-fun/ol3-fun/snapshot", ["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    function getStyle(feature) {
        var style = feature.getStyle();
        if (!style) {
            var styleFn = feature.getStyleFunction();
            if (styleFn) {
                style = styleFn(0);
            }
        }
        if (!style) {
            style = new ol.style.Style({
                text: new ol.style.Text({
                    text: "?"
                })
            });
        }
        if (!Array.isArray(style))
            style = [style];
        return style;
    }
    /**
     * Converts a feature to an image
     */
    var Snapshot = /** @class */ (function () {
        function Snapshot() {
        }
        /**
         * @param canvas Canvas which will contain the feature
         * @param feature Feature to render on the canvas, the style must be assigned to the style
         */
        Snapshot.render = function (canvas, feature) {
            // clone the feature to the geometry can be modified
            feature = feature.clone();
            var geom = feature.getGeometry();
            var extent = geom.getExtent();
            var _a = ol.extent.getCenter(extent), cx = _a[0], cy = _a[1];
            var _b = [ol.extent.getWidth(extent), ol.extent.getHeight(extent)], w = _b[0], h = _b[1];
            var isPoint = w === 0 || h === 0;
            var ff = 1 / (window.devicePixelRatio || 1);
            var scale = isPoint ? 1 : Math.min((ff * canvas.width) / w, (ff * canvas.height) / h);
            geom.translate(-cx, -cy); // center at 0,0
            geom.scale(scale, -scale); // fill the canvas, flipping the y axis
            geom.translate(Math.ceil((ff * canvas.width) / 2), Math.ceil((ff * canvas.height) / 2)); // move center to center of canvas
            console.log(scale, cx, cy, w, h, geom.getCoordinates());
            var vtx = ol.render.toContext(canvas.getContext("2d"));
            var styles = getStyle(feature);
            if (!Array.isArray(styles))
                styles = [styles];
            styles.forEach(function (style) { return vtx.drawFeature(feature, style); });
        };
        /**
         * @param feature Feature to render as image data
         * @return convert features into data:image/png;base64;
         */
        Snapshot.snapshot = function (feature, size) {
            if (size === void 0) { size = 128; }
            var canvas = document.createElement("canvas");
            canvas.width = canvas.height = size;
            this.render(canvas, feature);
            return canvas.toDataURL();
        };
        return Snapshot;
    }());
    return Snapshot;
});
define("node_modules/ol3-fun/tests/spec/snapshot", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/snapshot", "openlayers", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, base_11, Snapshot, ol, common_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var pointData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFdUlEQVR4Xu1aXUybVRh+3hiWxiX+ZNSMECvjJxiqyaROyq5M2MWUZGyDLEZg0WzhJ2QELharjmbWGgqOOTRxTMDIGHpBpIwE40Un3ujA0EmUYkhcRpoJRObfJkJG9Ji3+1gWoP2+rudrSvq9l/2e857nPOc5/yUkeVCStx+GAIYDklwBYwgkuQGMSdAYAsYQSHIFjCGQ5AYwVgFjCBhDIMkViPsQEEKkANgFIB2AGcCjAP4AsADgOoBxIlqJV7/ETQAhRCWAlwA8D+DBCA38G8DXAD4jok/1FkJ3AYQQVgDdAAruozHfAqgloh/uo6ymIroKIIQ4DOBjAA9oYrMx6F8AVUTEeaSHLgIIITjvOwBel8jYTURNEvOFUuklQDMAh2yyAJqJ6A2ZeaULIIR4GUCfTJJrch0ion5Z+aUKIIRIA/CzyiwfK/d/AGQQES+bMYdsAc4D4OVO7/iEiF6VUYk0AYQQvMyNyiClMUc+EX2vERsWJlOAqHp/enoaY2NjmJubQ1paGgoKCpCbmxtNe3qI6JVoCmyElSKAsuz9CiBVC6GzZ8+ioaEBt2/fvgvfsmUL2tvbUVNToyUFYxaI6DGt4HA4WQLw3v47LWQ6OjpQW1sbFnru3DlUVVVpScWYZ4hoQitYTwfwjq9HjQjbPTMzE8vLy2GhJpMJS0tLaqlWvzuIqEUrWE8BGgC8p0ZkYGAApaWlajAIIVQxCuArIirSCtZTgDcBuNWInDp1CsePH1eDRSPA70S0TTVhBICsOYAH9YdqRLxeLw4ePKgGi0aAL4noBdWEcRCAW/W5GpHZ2VlkZWXJnAP4qNyhVm+k77IckKVsgVW58Cwfaanr7OzE0aNHVfMogGwiuqoVrNscwImFEDMAntBCpr+/H/X19Zifn78LT09Px5kzZ1BWVqYlBWOuE9HjWsHhcFIcoAjQCUBz162srGB0dBRXrlxBfn4+7HY7UlL4ulBzfERE1ZrRYYAyBXgOwFishKIov4uIxqPAbwiVJoDigosA9sVKSkP5QSI6oAGnCpEtwJMAflKtNTbAfwDyiGg6tjR3SksVQHEBX4XxlZhe8RoRtcpKLl0AJjY+Pt5jMpn4fICtW7ciIyMjIt+ZmZkQzmzmd5KI0U5EvO2WFnoIwHvddT3Ep8Dq6vWT9tDQEEpKSkINunbt2jqxFhYW4Ha7MTg4OB8MBrMBLEprvR5DAMD7gUDgWF5e3l2efO5vaWnB7t27UVRUhMnJSRARrFYr+vr6sH37drALcnJyYLFYQuUWFxdDYjQ3Nwuz2Uw3b96E0+l8GsBkwgvg9/uPDQ8PM+He1NTUhzweT0lhYSFaW1tx48YN8DcOm82GiooKNDY2btgmi8XyZzAYfMTv94fKOJ1OP4BnN5MAfE2Grq6uwyyA3W7/y+v1Pswu4JiamkJxcTF/DzmAY//+/di27c4B79KlS6Hfjxw5glu3bqGurg69vb1Sh63UZErPrBsCq+TZ4nwbdPr06W+6u7t/GxkZ2Xf58uWQ1VcF2Lt3L5qamrw7duw4UF5ezlvmoMvlsigO4MliaDM5YJXrFwBGXC7Xu9zjNputgj/4fL4Lq4BVAViMPXv2VFRWVl5wOBxwOBxXT548maUIsOnmgHsJP+VyuX5kB3g8nom2trZfAoFA8VoHqAjwNgDnZnLA2h477/P5Ku+dA6xW64TP59sZzgEnTpyYcLvdO7Ozs0MridPp5JtgKa9CLKQecwCfBfhMwLY/tGbd5p0Ov/AeU3rxA+Uxhd8SAwB4m8ui2QHUKa9Mbyn/KHkxTM6YDKGHADERindhQ4B4K55o9RkOSLQeiTcfwwHxVjzR6jMckGg9Em8+hgPirXii1Zf0DvgfGiXvUAsr6xQAAAAASUVORK5CYII=";
    var circleData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAHzUlEQVR4XuWbaWxVRRTHf+OGS1BRUQuCuICRRoMWFTRugEgCVo2IQqEgUAmpiCIgJuoHiAmgKEowBlsXwCLuEv2g0kaNti7RaBTFjaBScYtRq1FRueZ/79z75r32tfe9PmrpPclL+96dOzPnP+fMnG0MBSVvP2AUcIn9HFig7n8GNgBPAS+C+aNA/WIK05F3EFAJ3AAckr3Pb4Hv7ec74C9gJyDcDgeOsH+PbG1aPwLLgXvANLV3/u0EwDsMuA6YBbSw2l8EC8ZLwEYg7nyF5zBgJHABcFxLfP4CrACWgZGE5EV5AuB1A24HptvlcwbXyq4NFoiv8ppU85f6AtcCE62UpLX4HXgAmAdGIpUT5QGA1x94EjgpfaQvgaVAtRXtnOYRs7FwnwbcBByV+c4HwGVgPovZmd8sRwC8CcAq4ID0QaYCa4B/chm7HW33ttKghW8mDVPAPBG385gAeHsCd9uNzvYtZm8GlsQdaxe00/TnA7cBmmJEK4HZYP5ta9AYAHh7AOuBsanOGoFxQH1b/XfQ8zPtCalTJKJHgHIwOmayUhsA+MyvBspSPWg3vwL4qYOYiztMT6AGGJETCK0A0BLzDwHSdy/urDq4ndjRvjAlNghZAMjG/FUdzFC+wz0YG4RsAGhncXY3nXrS+VbVKd/Z7oL3pLmPBadiiuaDke2SRi0A4Mns+gjYJ2hZB1zYgUdcofDYy1qh54cd7gCKwXzujpABgC/6bwCnBY22AqcAeVuaheImz34OBt4FjgnffwsYAibaxDIBuBFYHLSWuA8B3s5z8M7y2ul2TSNW54JZFs7OAcA7EXgvJfoya4VHV6A7rKPq85KmCi4A8rcvCtiVFzfQtu0KAGg72wQcHzKzAczF+mIB8I4FtDnY7+cBr3QFzh0e5F7Xht+1B/QFsy0E4C7r19tGadZUFwJCJ1p0KiiOMNeAtz+wPRXQkGRIG7oiKVL3dMjYr0CRALjGRlaAbYFkdFpTt72LolNecYsoljBTAHwYGAiiOYC0oSvTPBu48Xl8XwA4no1icZKMrkwKXSqc6JPnAPAacHZX5tzh7XVAMQT/2AslQAagYm1JIBl5UoU0AGQDPZcE7gGddM9kAiDdiBu3391xOhRQfiWSAAU4FWlNEgV7v90DXrApvSQBIJ5HhgAo4uMEfROBg/Ksl4YAPJwZQ0sABErkTAwBUB5BFnGS6D5gRgiA4p8LksR9kFRmTgiAxKE8YQAocTQhBGCd/yVZ9Kif4bLH4Js2AJokCBTsHRwC8IMtTUkSAMpt9nCdIdXp/JkQBFIuseMNyhWWS5wEUlxQ8cE0b/B6W3yVBAAU+QpyI44EvAqcmwTuraSfFQGgMpI9gkCoqt46W+FDoddENYjfhCmQnZIAJ1g+w9ZAFXrQztTfTODecEJ1AkBcyzAGkuAWq8RneAhAhQDoAcgQsGVWJwCftmvJNm3axMCByi1CU1MTlZWVNDY2smLFChYvXsyaNTK9s1NVVRX9+vVjxIhCZ6gGAJ+EA0v1e4apscAw9kl+clplRU5giPnt27dHkxczo0aNory8nLq64Ohpi3YdAIoD+jlR0Vowk9zkqJbdSkGJLSxoa6rpzydNmsSCBQuYNWtWM2aHDRsWScDkyZMZNGgQ3bt3Z/369ehZ79692bFjB0uWLKFXr16RBGzcuJHhwwORra2tbYdUKAyucLhPWv0BYLa46fEqW4cKNERx81wgWLhwIaNHj6akRACmUyYAeioRF4NFRUUUFxejlR86dCgNDQ0+APX19ZSVlVFRUeEDKunSs+nTVaKcK70DnBq+tAqM9j63VNZTwmxLKjqqUjNFiuJTNgkQYzU1NWkSsHXrVp8RARD+H44UqoB+nzZNtcEpyk8K1IfW16e/gT5gVNWdWSvsqfzcCQ31tmdmfBBa2gPGjRvHypUrKS0t9TdBqYALQCgNkiCt+ObNm+nWrVszCYg/C7elkr1KiEa0HIzMXp8ya4RkJWgv6B48VoGRdCe3KvS2TgEXAKnG6tWrY+0BmlF1dXUOKqDqcrm9UWG7Ep/9wejWRksA6DdvdHqKaHcOlqh0dry7+mPAPO/+kK1QcpEtBbdtpRUKnO5ONDvTuVsE5tZMDrIBoN9118WxRK4G7t9NEKjINOll/o106wNbUYHwkX8RSmeHc2HnTmBuJ64gUQWIqmHl7kakkrcSMFFRQAwViEDQ0ajbF2ekXlIG+fJOGD3aF3gcGOPyp2DnWFWDZRPdOBcmVGSn3JnTs0qJh3aiahIJqy5vBP6HJdn048GoMDIrxQDAPxnUTlUFkn9LXwPSNXmQ/yepkFt7Ux93EkvBxCpzjQlApBLiWK6zlM3Ss/baoADpSDraXs0rdQeVjT8VjG65xKIcAfClQVdjdXPMgVzRZJ25qsn9ONbA+TdSSbNKebQPSe8zRdLkJJJ5AOCDoOLKW6xKqDDfIVmP8iF0ebJQ4TXdB5JBM9l1aMIxpeOKcC4Ek3NcP08AIpVQ9ETScE7zFZXPITBkQOlOozbOVvcjpwuZsFppmbC6mXsykIFz0FqRXIm8jrq8qJ0AREAo0K57rVcCko4WSGU4cjMEhi5/pzkoQD8r0mJauKbdA3T701VZXeNbA+blvLh2XioQABEQcqIkq9osB7d3chnvy6vRdr8OzG+F6vs/cM4xojBcMyUAAAAASUVORK5CYII=";
    function show(data) {
        document.body.appendChild(common_8.html("<img src=\"" + data + "\" />"));
    }
    function circle(radius, points) {
        if (radius === void 0) { radius = 1; }
        if (points === void 0) { points = 36; }
        if (points < 3)
            throw "a circle must contain at least three points";
        if (radius <= 0)
            throw "a circle must have a positive radius";
        var a = 0;
        var dr = (2 * Math.PI) / (points - 1);
        var result = new Array(points);
        for (var i = 0; i < points - 1; i++) {
            result[i] = [radius * Math.sin(a), radius * Math.cos(a)];
            a += dr;
        }
        result[result.length - 1] = result[0]; // properly close
        return result;
    }
    base_11.describe("Snapshot", function () {
        base_11.it("Snapshot", function () {
            base_11.should(!!Snapshot, "Snapshot");
            base_11.should(!!Snapshot.render, "Snapshot.render");
            base_11.should(!!Snapshot.snapshot, "Snapshot.snapshot");
        });
        base_11.it("Converts a point to image data", function () {
            var feature = new ol.Feature(new ol.geom.Point([0, 0]));
            feature.setStyle(new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                    fill: new ol.style.Fill({ color: "black" }),
                    stroke: new ol.style.Stroke({
                        color: "white",
                        width: 10
                    })
                }),
                text: new ol.style.Text({
                    text: "Point",
                    fill: new ol.style.Fill({
                        color: "white"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "black",
                        width: 2
                    }),
                    offsetY: 16
                })
            }));
            var data = Snapshot.snapshot(feature, 64);
            show(data);
            if (1 === window.devicePixelRatio) {
                if (data !== pointData)
                    show(pointData);
                base_11.shouldEqual(data, pointData, "point data as expected");
            }
        });
        base_11.it("Converts a triangle to image data", function () {
            var points = circle(50, 4);
            var feature = new ol.Feature(new ol.geom.Polygon([points]));
            feature.setStyle(createStyle("Triangle"));
            var data = Snapshot.snapshot(feature, 64);
            show(data);
        });
        base_11.it("Converts a diamond to image data", function () {
            var points = circle(50, 5);
            var feature = new ol.Feature(new ol.geom.Polygon([points]));
            feature.setStyle(createStyle("Diamond"));
            var data = Snapshot.snapshot(feature, 64);
            show(data);
        });
        base_11.it("Converts a polygon to image data", function () {
            var geom = new ol.geom.Polygon([circle(3 + 100 * Math.random())]);
            var feature = new ol.Feature(geom);
            base_11.shouldEqual(feature.getGeometry(), geom, "geom still assigned");
            feature.setStyle(createStyle("Circle"));
            var originalCoordinates = base_11.stringify(geom.getCoordinates());
            var data = Snapshot.snapshot(feature, 64);
            console.log(data);
            base_11.should(!!data, "snapshot returns data");
            show(data);
            var finalCoordinates = base_11.stringify(geom.getCoordinates());
            base_11.shouldEqual(originalCoordinates, finalCoordinates, "coordinates unchanged");
            base_11.shouldEqual(feature.getGeometry(), geom, "geom still assigned");
            if (1 === window.devicePixelRatio) {
                if (data !== pointData)
                    show(circleData);
                base_11.shouldEqual(data, circleData, "circle data as expected");
            }
        });
    });
    function createStyle(text) {
        if (text === void 0) { text = ""; }
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: "black"
            }),
            stroke: new ol.style.Stroke({
                color: "blue",
                width: 3
            }),
            text: new ol.style.Text({
                text: text,
                fill: new ol.style.Fill({
                    color: "white"
                }),
                stroke: new ol.style.Stroke({
                    color: "black",
                    width: 2
                }),
                offsetY: 16
            })
        });
    }
});
define("node_modules/ol3-fun/tests/spec/zoom-to-feature", ["require", "exports", "openlayers", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/navigation"], function (require, exports, ol, base_12, navigation_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("zoomToFeature", function () {
        it("zoomToFeature", function (done) {
            base_12.should(!!navigation_2.zoomToFeature, "zoomToFeature");
            var map = new ol.Map({
                view: new ol.View({
                    zoom: 0,
                    center: [0, 0]
                })
            });
            var feature = new ol.Feature();
            var geom = new ol.geom.Point([100, 100]);
            feature.setGeometry(geom);
            map.once("postrender", function () {
                var res = map.getView().getResolution();
                var zoom = map.getView().getZoom();
                navigation_2.zoomToFeature(map, feature, {
                    duration: 200,
                    minResolution: res / 4,
                }).then(function () {
                    var _a = map.getView().getCenter(), cx = _a[0], cy = _a[1];
                    base_12.should(map.getView().getZoom() === zoom + 2, "zoom in two because minRes is 1/4 of initial res");
                    base_12.should(cx === 100, "center-x");
                    base_12.should(cy === 100, "center-y");
                    done();
                });
            });
        });
    });
});
define("node_modules/ol3-fun/tests/index", ["require", "exports", "node_modules/ol3-fun/tests/spec/packages", "node_modules/ol3-fun/tests/spec/api", "node_modules/ol3-fun/tests/spec/common", "node_modules/ol3-fun/tests/spec/slowloop", "node_modules/ol3-fun/tests/spec/deep-extend", "node_modules/ol3-fun/tests/spec/extensions", "node_modules/ol3-fun/tests/spec/is-primitive", "node_modules/ol3-fun/tests/spec/is-cycle", "node_modules/ol3-fun/tests/spec/openlayers-test", "node_modules/ol3-fun/tests/spec/parse-dms", "node_modules/ol3-fun/tests/spec/polyline", "node_modules/ol3-fun/tests/spec/snapshot", "node_modules/ol3-fun/tests/spec/zoom-to-feature"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/ol3-symbolizer/ol3-symbolizer/common/assign", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     *
     * @param obj The target object
     * @param prop The property name
     * @param value The property value
     */
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
define("node_modules/ol3-symbolizer/tests/common", ["require", "exports", "node_modules/ol3-symbolizer/ol3-symbolizer/common/assign", "node_modules/ol3-fun/index", "node_modules/ol3-fun/tests/base"], function (require, exports, assign_1, index_8, base_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_13.describe("assign tests", function () {
        base_13.it("assign empty", function () {
            // todo: how to use should to expect an exception?
        });
        base_13.it("assign number", function () {
            var target = {};
            assign_1.assign(target, "a", 100);
            base_13.should(target.a === 100, ""); // how to show message on failure?
        });
        base_13.it("assign object", function () {
            var target = {};
            assign_1.assign(target, "a", { a: 100 });
            base_13.should(target.a.a === 100, ""); // how to show message on failure?
        });
    });
    base_13.describe("defaults tests", function () {
        base_13.it("defaults number", function () {
            base_13.should(index_8.defaults({}, { a: 100 }).a === 100, "");
            base_13.should(index_8.defaults(index_8.defaults({}, { a: 100 }), { a: 200 }).a === 100, "");
            var a = index_8.defaults({}, { a: 1 });
            base_13.should(a === index_8.defaults(a, { a: 2 }), "");
        });
    });
    base_13.describe("mixin tests", function () {
        base_13.it("mixin number", function () {
            base_13.should(index_8.mixin({}, { a: 100 }).a === 100, "");
            base_13.should(index_8.mixin(index_8.mixin({}, { a: 100 }), { a: 200 }).a === 200, "");
            var a = index_8.mixin({}, { a: 1 });
            base_13.should(a === index_8.mixin(a, { a: 2 }), "");
        });
    });
    base_13.describe("test accessing openlayers using amd", function () {
        base_13.it("log ol.style.Style", function () {
            require(["openlayers"], function (ol) {
                var style = ol.style.Style;
                base_13.should(!!style, "");
                console.log(style.toString());
            });
        });
    });
});
define("node_modules/ol3-symbolizer/ol3-symbolizer/styles/stroke/linedash", ["require", "exports"], function (require, exports) {
    "use strict";
    //from dojox gfx.canvas:
    var dasharray = {
        solid: "none",
        shortdash: [4, 1],
        shortdot: [1, 1],
        shortdashdot: [4, 1, 1, 1],
        shortdashdotdot: [4, 1, 1, 1, 1, 1],
        dot: [1, 3],
        dash: [4, 3],
        longdash: [8, 3],
        dashdot: [4, 3, 1, 3],
        longdashdot: [8, 3, 1, 3],
        longdashdotdot: [8, 3, 1, 3, 1, 3]
    };
    return dasharray;
});
define("node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-cross", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Shapeshifter = /** @class */ (function () {
        function Shapeshifter() {
        }
        /**
         * @param style does this style represent a cross?
         */
        Shapeshifter.is = function (style) {
            //  "points": 4,"radius": >0,"radius2": 0,"angle": 0
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
        /**
         *
         * @param style return this style as a cross json encoding
         */
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
    var Shapeshifter = /** @class */ (function () {
        function Shapeshifter() {
        }
        /**
         * @param style does this style represent a square?
         */
        Shapeshifter.is = function (style) {
            //  "points": 4,"radius": >0,"radius2": 0,"angle": 0
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
        /**
         *
         * @param style return this style as a cross json encoding
         */
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
    var Shapeshifter = /** @class */ (function () {
        function Shapeshifter() {
        }
        /**
         * @param style does this style represent a diamond?
         */
        Shapeshifter.is = function (style) {
            //  "points": 4,"radius": >0,"radius2": 0,"angle": 0
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
        /**
         *
         * @param style return this style as a cross json encoding
         */
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
    var Shapeshifter = /** @class */ (function () {
        function Shapeshifter() {
        }
        /**
         * @param style does this style represent a triangle?
         */
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
        /**
         *
         * @param style return this style as a cross json encoding
         */
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
    var Shapeshifter = /** @class */ (function () {
        function Shapeshifter() {
        }
        /**
         * @param style does this style represent a X?
         */
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
        /**
         *
         * @param style return this style as a cross json encoding
         */
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
define("node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer", ["require", "exports", "openlayers", "node_modules/ol3-symbolizer/ol3-symbolizer/common/assign", "node_modules/ol3-fun/index", "node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-cross", "node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-square", "node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-diamond", "node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-triangle", "node_modules/ol3-symbolizer/ol3-symbolizer/format/plugins/as-x"], function (require, exports, ol, assign_2, index_9, as_cross_1, as_square_1, as_diamond_1, as_triangle_1, as_x_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StyleConverter = /** @class */ (function () {
        /**
         * Register shape shifters
         */
        function StyleConverter() {
            this.converters = [];
            this.converters.push(as_cross_1.Shapeshifter);
            this.converters.push(as_square_1.Shapeshifter);
            this.converters.push(as_diamond_1.Shapeshifter);
            this.converters.push(as_triangle_1.Shapeshifter);
            this.converters.push(as_x_1.Shapeshifter);
            //this.converters.push(StarShapeshifter);
        }
        StyleConverter.prototype.fromJson = function (json) {
            this.converters.some(function (c) { return c.is(json) && c.inverse && !!(json = c.inverse(json)); });
            return this.deserializeStyle(json);
        };
        StyleConverter.prototype.toJson = function (style) {
            // to be encoded as a collection of encoders, each in it's own module
            var result = this.serializeStyle(style);
            this.converters.some(function (c) { return c.is(result) && c.as && !!(result = c.as(result)); });
            return result;
        };
        /**
         * uses the interior point of a polygon when rendering a 'point' style
         */
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
                index_9.mixin(s, this.serializeColor(style.getColor()));
            if (style.getImage)
                assign_2.assign(s, "image", this.serializeImage(style.getImage()));
            if (style.getFill)
                assign_2.assign(s, "fill", this.serializeFill(style.getFill()));
            if (style.getOpacity)
                assign_2.assign(s, "opacity", style.getOpacity());
            if (style.getStroke)
                assign_2.assign(s, "stroke", this.serializeStroke(style.getStroke()));
            if (style.getText)
                assign_2.assign(s, "text", this.serializeText(style.getText()));
            if (style.getWidth)
                assign_2.assign(s, "width", style.getWidth());
            if (style.getOffsetX)
                assign_2.assign(s, "offset-x", style.getOffsetX());
            if (style.getOffsetY)
                assign_2.assign(s, "offset-y", style.getOffsetY());
            if (style.getWidth)
                assign_2.assign(s, "width", style.getWidth());
            if (style.getFont)
                assign_2.assign(s, "font", style.getFont());
            if (style.getRadius)
                assign_2.assign(s, "radius", style.getRadius());
            if (style.getRadius2)
                assign_2.assign(s, "radius2", style.getRadius2());
            if (style.getPoints)
                assign_2.assign(s, "points", style.getPoints());
            if (style.getAngle)
                assign_2.assign(s, "angle", style.getAngle());
            if (style.getRotation)
                assign_2.assign(s, "rotation", style.getRotation());
            if (style.getOrigin)
                assign_2.assign(s, "origin", style.getOrigin());
            if (style.getScale)
                assign_2.assign(s, "scale", style.getScale());
            if (style.getSize)
                assign_2.assign(s, "size", style.getSize());
            if (style.getAnchor) {
                assign_2.assign(s, "anchor", style.getAnchor());
                "anchorXUnits,anchorYUnits,anchorOrigin".split(",").forEach(function (k) {
                    assign_2.assign(s, k, style[k + "_"]);
                });
            }
            // "svg"
            if (style.path) {
                if (style.path)
                    assign_2.assign(s, "path", style.path);
                if (style.getImageSize)
                    assign_2.assign(s, "imgSize", style.getImageSize());
                if (style.stroke)
                    assign_2.assign(s, "stroke", style.stroke);
                if (style.fill)
                    assign_2.assign(s, "fill", style.fill);
                if (style.scale)
                    assign_2.assign(s, "scale", style.scale); // getScale and getImgSize are modified in deserializer               
                if (style.imgSize)
                    assign_2.assign(s, "imgSize", style.imgSize);
            }
            // "icon"
            if (style.getSrc)
                assign_2.assign(s, "src", style.getSrc());
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
            index_9.doif(json.rotation, function (v) { return image.setRotation(v); });
            index_9.doif(json.opacity, function (v) { return image.setOpacity(v); });
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
            var _a;
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
            return index_9.mixin(icon, {
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
            index_9.doif(json.color, function (v) { return stroke.setColor(v); });
            index_9.doif(json.lineCap, function (v) { return stroke.setLineCap(v); });
            index_9.doif(json.lineDash, function (v) { return stroke.setLineDash(v); });
            index_9.doif(json.lineJoin, function (v) { return stroke.setLineJoin(v); });
            index_9.doif(json.miterLimit, function (v) { return stroke.setMiterLimit(v); });
            index_9.doif(json.width, function (v) { return stroke.setWidth(v); });
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
                    // preserve
                    index_9.mixin(gradient_1, {
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
                return index_9.mixin(context_1.createPattern(canvas, repitition), fill.pattern);
            }
            if (fill.image) {
                var canvas = document.createElement('canvas');
                var _b = (_a = fill.image.imgSize, canvas.width = _a[0], canvas.height = _a[1], _a), w_1 = _b[0], h_1 = _b[1];
                var context_2 = canvas.getContext('2d');
                var _c = [0, 0], dx = _c[0], dy = _c[1];
                var image_1 = document.createElement("img");
                image_1.src = fill.image.imageData;
                image_1.onload = function () { return context_2.drawImage(image_1, 0, 0, w_1, h_1); };
                return "rgba(255,255,255,0.1)"; // TODO
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
            index_9.mixin(gradient, {
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
            index_9.mixin(gradient, {
                type: "radial(" + [x0, y0, r0, x1, y1, r1].join(",") + ")"
            });
            return gradient;
        };
        return StyleConverter;
    }());
    exports.StyleConverter = StyleConverter;
});
define("node_modules/ol3-symbolizer/tests/ol3-symbolizer", ["require", "exports", "node_modules/ol3-symbolizer/ol3-symbolizer/styles/stroke/linedash", "node_modules/ol3-fun/tests/base", "node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer"], function (require, exports, Dashes, base_14, ol3_symbolizer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var converter = new ol3_symbolizer_1.StyleConverter();
    base_14.describe("OL Format Tests", function () {
        base_14.it("Ensures interface does not break", function () {
            var circle = {};
            circle.fill;
            circle.opacity;
            circle.radius;
            circle.snapToPixel;
            circle.stroke;
            var color = {};
            color === [1] || color == "";
            var fill = {};
            fill.color;
            fill.gradient;
            fill.image;
            fill.pattern;
            var icon = {};
            icon["anchor-x"];
            icon["anchor-y"];
            icon.anchor;
            icon.anchorOrigin;
            icon.anchorXUnits;
            icon.anchorYUnits;
            icon.color;
            icon.crossOrigin;
            icon.offset;
            icon.offsetOrigin;
            icon.opacity;
            icon.rotateWithView;
            icon.rotation;
            icon.scale;
            icon.size;
            icon.snapToPixel;
            icon.src;
            var image = {};
            image.opacity;
            image.rotateWithView;
            image.rotation;
            image.scale;
            image.snapToPixel;
            // etc.
        });
    });
    base_14.describe("OL StyleConverter API Tests", function () {
        base_14.it("StyleConverter API", function () {
            var converter = new ol3_symbolizer_1.StyleConverter();
            base_14.should(typeof converter.fromJson === "function", "fromJson exists");
            base_14.should(typeof converter.toJson === "function", "toJson exists");
        });
    });
    base_14.describe("OL StyleConverter Json Tests", function () {
        base_14.it("Circle Tests", function () {
            var baseline = {
                circle: {
                    fill: {
                        color: "rgba(197,37,84,0.90)"
                    },
                    opacity: 1,
                    stroke: {
                        color: "rgba(227,83,105,1)",
                        width: 4.4
                    },
                    radius: 7.3
                },
                text: {
                    fill: {
                        color: "rgba(205,86,109,0.9)"
                    },
                    stroke: {
                        color: "rgba(252,175,131,0.5)",
                        width: 2
                    },
                    text: "Test",
                    "offset-x": 0,
                    "offset-y": 20,
                    font: "18px fantasy"
                }
            };
            var style = converter.fromJson(baseline);
            var circleStyle = style.getImage();
            base_14.should(circleStyle !== null, "getImage returns a style");
            base_14.shouldEqual(circleStyle.getRadius(), baseline.circle.radius, "getImage is a circle and radius");
            var circleJson = converter.toJson(style);
            base_14.should(circleJson.circle !== null, "json contains a circle");
            base_14.shouldEqual(circleJson.circle.radius, baseline.circle.radius, "circle radius");
        });
        base_14.it("Star Tests", function () {
            var baseline = {
                star: {
                    fill: {
                        color: "rgba(54,47,234,1)"
                    },
                    stroke: {
                        color: "rgba(75,92,105,0.85)",
                        width: 4
                    },
                    radius: 9,
                    radius2: 0,
                    points: 6
                }
            };
            var style = converter.fromJson(baseline);
            var starStyle = style.getImage();
            base_14.should(starStyle !== null, "getImage returns a style");
            base_14.shouldEqual(starStyle.getRadius(), baseline.star.radius, "starStyle radius");
            base_14.shouldEqual(starStyle.getRadius2(), baseline.star.radius2, "starStyle radius2");
            base_14.shouldEqual(starStyle.getPoints(), baseline.star.points, "starStyle points");
            var starJson = converter.toJson(style);
            base_14.should(starJson.star !== null, "json contains a star");
            base_14.shouldEqual(starJson.star.radius, baseline.star.radius, "starJson radius");
            base_14.shouldEqual(starJson.star.radius2, baseline.star.radius2, "starJson radius2");
            base_14.shouldEqual(starJson.star.points, baseline.star.points, "starJson point count"); // <-- failing, 3 != 6
        });
        base_14.it("Fill Test", function () {
            var baseline = {
                fill: {
                    gradient: {
                        type: "linear(200,0,201,0)",
                        stops: "rgba(255,0,0,.1) 0%;rgba(255,0,0,0.8) 100%"
                    }
                }
            };
            var style = converter.fromJson(baseline);
            var fillStyle = style.getFill();
            base_14.should(fillStyle !== null, "fillStyle exists");
            var gradient = fillStyle.getColor(); // stops & type might be writeonly?
            base_14.shouldEqual(gradient.stops, baseline.fill.gradient.stops, "fillStyle color");
            base_14.shouldEqual(gradient.type, baseline.fill.gradient.type, "fillStyle color");
        });
        base_14.it("Stroke Test", function () {
            var baseline = {
                stroke: {
                    color: "orange",
                    width: 2,
                    lineDash: Dashes.longdashdotdot
                }
            };
            var style = converter.fromJson(baseline);
            var strokeStyle = style.getStroke();
            base_14.should(strokeStyle !== null, "strokeStyle exists");
            base_14.shouldEqual(strokeStyle.getColor(), baseline.stroke.color, "strokeStyle color");
            base_14.shouldEqual(strokeStyle.getWidth(), baseline.stroke.width, "strokeStyle width");
            base_14.shouldEqual(strokeStyle.getLineDash().join(), baseline.stroke.lineDash.join(), "strokeStyle lineDash");
        });
        base_14.it("Text Test", function () {
            var baseline = {
                text: {
                    fill: {
                        color: "rgba(75,92,85,0.85)"
                    },
                    stroke: {
                        color: "rgba(255,255,255,1)",
                        width: 5
                    },
                    "offset-x": 5,
                    "offset-y": 10,
                    offsetX: 15,
                    offsetY: 20,
                    text: "fantasy light",
                    font: "18px serif"
                }
            };
            var style = converter.fromJson(baseline);
            var textStyle = style.getText();
            base_14.should(textStyle !== null, "textStyle exists");
            base_14.shouldEqual(textStyle.getFill().getColor(), baseline.text.fill.color, "textStyle text color");
            base_14.shouldEqual(textStyle.getText(), baseline.text.text, "textStyle text");
            base_14.shouldEqual(textStyle.getOffsetX(), baseline.text["offset-x"], "textStyle color");
            base_14.shouldEqual(textStyle.getOffsetY(), baseline.text["offset-y"], "textStyle color");
            base_14.shouldEqual(textStyle.getFont(), baseline.text.font, "textStyle font");
        });
    });
    base_14.describe("OL Basic shapes", function () {
        base_14.it("cross, square, diamond, star, triangle, x", function () {
            var cross = {
                star: {
                    opacity: 0.5,
                    fill: {
                        color: "red"
                    },
                    stroke: {
                        color: "black",
                        width: 2
                    },
                    points: 4,
                    radius: 10,
                    radius2: 0,
                    angle: 0
                }
            };
            var square = {
                star: {
                    fill: {
                        color: "red"
                    },
                    stroke: {
                        color: "black",
                        width: 2
                    },
                    points: 4,
                    radius: 10,
                    angle: 0.7853981633974483
                }
            };
            var diamond = {
                star: {
                    fill: {
                        color: "red"
                    },
                    stroke: {
                        color: "black",
                        width: 2
                    },
                    points: 4,
                    radius: 10,
                    angle: 0
                }
            };
            var star = {
                star: {
                    fill: {
                        color: "red"
                    },
                    stroke: {
                        color: "black",
                        width: 2
                    },
                    points: 5,
                    radius: 10,
                    radius2: 4,
                    angle: 0
                }
            };
            var triangle = {
                star: {
                    fill: {
                        color: "red"
                    },
                    stroke: {
                        color: "black",
                        width: 2
                    },
                    points: 3,
                    radius: 10,
                    angle: 0
                }
            };
            var x = {
                star: {
                    fill: {
                        color: "red"
                    },
                    stroke: {
                        color: "black",
                        width: 2
                    },
                    points: 4,
                    radius: 10,
                    radius2: 0,
                    angle: 0.7853981633974483
                }
            };
            var crossJson = converter.toJson(converter.fromJson(cross));
            var squareJson = converter.toJson(converter.fromJson(square));
            var diamondJson = converter.toJson(converter.fromJson(diamond));
            var starJson = converter.toJson(converter.fromJson(star));
            var triangleJson = converter.toJson(converter.fromJson(triangle));
            var xJson = converter.toJson(converter.fromJson(x));
            // the above re-translations should be now be in a friendlier encoding
            // likewise fromJson should work on the following:
            // {cross: {size: 10}}
            // {square: {size: 10}}
            // {diamond: {size: 10}}
            // {star: {size: 10}}
            // {triangle: {size: 10}}
            // {x: {size: 10}}
            // the usecase being a simplification of styling
            /**
             * Before going too far down this road, remind yourself of the ogc styling used by geoserver...I recall it was
             * terse and powerful and css-like and ol probably has support for it already
             */
            base_14.should(!!crossJson.cross, "cross exists");
            base_14.shouldEqual(crossJson.cross.size, cross.star.radius * 2, "cross size");
            base_14.should(!!squareJson.square, "square exists");
            base_14.shouldEqual(squareJson.square.size, square.star.radius * 2, "square size");
            base_14.should(!!diamondJson.diamond, "diamond exists");
            base_14.shouldEqual(diamondJson.diamond.size, diamond.star.radius * 2, "diamond size");
            base_14.should(!!triangleJson.triangle, "triangle exists");
            base_14.shouldEqual(triangleJson.triangle.size, triangle.star.radius * 2, "triangle size");
            base_14.should(!!xJson.x, "x exists");
            base_14.shouldEqual(xJson.x.size, x.star.radius * 2, "x size");
            var items = { crossJson: crossJson, squareJson: squareJson, diamondJson: diamondJson, triangleJson: triangleJson, xJson: xJson };
            Object.keys(items).forEach(function (k) {
                base_14.shouldEqual(base_14.stringify(converter.toJson(converter.fromJson(items[k]))), base_14.stringify(items[k]), k + " json->style->json");
            });
        });
    });
    base_14.describe("OL NEXT", function () {
        base_14.it("NEXT", function () { });
    });
});
define("node_modules/ol3-symbolizer/ol3-symbolizer/format/ags-symbolizer", ["require", "exports", "node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer"], function (require, exports, Symbolizer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var symbolizer = new Symbolizer.StyleConverter();
    // esri -> ol mappings (add keyof to get proper definitions, not sure how)
    // function agsStyleMapper(index : keyof(StyleTypes)) {
    // }
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
    // esri -> ol mappings
    var typeMap = {
        esriSMS: "sms",
        esriSLS: "sls",
        esriSFS: "sfs",
        esriPMS: "pms",
        esriPFS: "pfs",
        esriTS: "txt" // text symbol
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
    // convert from ags style to an internal format
    var StyleConverter = /** @class */ (function () {
        function StyleConverter() {
        }
        StyleConverter.prototype.asWidth = function (v) {
            return (v * 4) / 3; // not sure why
        };
        // see ol.color.asString
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
        // picture fill symbol (does not render the picture due to drawPolygon limitation)
        StyleConverter.prototype.fromPFS = function (symbol, style) {
            // TODO drawPolygon does not call setImageStyle so this is being ignored
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
        /**
         * Converts the ags symbol to an openlayers style, then the openlayers style to a JSON representation
         */
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
        /**
         * convert drawing info into a symbology rule
         */
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
                                    /**
                                     * This renderer adjusts the size of the symbol to between [minSize..maxSize]
                                     * based on the range of values [minDataValue, maxDataValue]
                                     */
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
                            // TODO: scan until key > value, return prior style
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
define("node_modules/ol3-symbolizer/tests/ags-symbolizer", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-symbolizer/ol3-symbolizer/format/ags-symbolizer", "node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer"], function (require, exports, base_15, ags_symbolizer_1, ol3_symbolizer_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var fromJson = (function () {
        var fromJsonConverter = new ags_symbolizer_1.StyleConverter();
        return function (style) { return fromJsonConverter.fromJson(style); };
    })();
    var toJson = (function () {
        var toJsonConverter = new ol3_symbolizer_2.StyleConverter();
        return function (style) { return toJsonConverter.toJson(style); };
    })();
    function rgba(_a) {
        var r = _a[0], g = _a[1], b = _a[2], a = _a[3];
        return "rgba(" + r + "," + g + "," + b + "," + a / 255 + ")";
    }
    base_15.describe("esriSMS Tests", function () {
        base_15.it("esriSMSCircle", function () {
            var baseline = {
                color: [255, 255, 255, 64],
                size: 12,
                angle: 0,
                xoffset: 0,
                yoffset: 0,
                type: "esriSMS",
                style: "esriSMSCircle",
                outline: {
                    color: [0, 0, 0, 255],
                    width: 1,
                    type: "esriSLS",
                    style: "esriSLSSolid"
                }
            };
            var style = fromJson(baseline);
            var circleJson = toJson(style);
            var expectedRadius = (baseline.size * 4) / 3 / 2;
            base_15.shouldEqual(circleJson.circle.radius, expectedRadius, "circleJson radius is 33% larger than specified in the ags style (see StyleConverter.asWidth)");
            base_15.shouldEqual(circleJson.circle.fill.color, rgba(baseline.color), "circleJson fill color");
            base_15.shouldEqual(circleJson.circle.fill.pattern, null, "circleJson fill pattern is solid");
            base_15.shouldEqual(circleJson.circle.stroke.color, rgba(baseline.outline.color), "circleJson stroke color");
            base_15.shouldEqual(circleJson.circle.stroke.width, (baseline.outline.width * 4) / 3, "circleJson stroke width");
            base_15.shouldEqual(circleJson.circle.stroke.lineCap, undefined, "circleJson stroke lineCap");
            base_15.shouldEqual(circleJson.circle.stroke.lineDash, undefined, "circleJson stroke lineDash");
            base_15.shouldEqual(circleJson.circle.stroke.lineJoin, undefined, "circleJson stroke lineJoin");
        });
        base_15.it("esriSMSCross", function () {
            var baseline = {
                color: [255, 255, 255, 64],
                size: 12,
                angle: 0,
                xoffset: 0,
                yoffset: 0,
                type: "esriSMS",
                style: "esriSMSCross",
                outline: {
                    color: [0, 0, 0, 255],
                    width: 1,
                    type: "esriSLS",
                    style: "esriSLSSolid"
                }
            };
            var json = toJson(fromJson(baseline));
            base_15.should(!!json.cross, "cross");
            base_15.shouldEqual(json.cross.opacity, 1, "opacity");
            base_15.shouldEqual(json.cross.size, 22.62741699796952, "size"); // no idea why, but let me know if it changes :)
        });
    });
    base_15.describe("esriSLS Tests", function () {
        base_15.it("esriSLSShortDash esriLCSSquare esriLJSRound", function () {
            var baseline = {
                type: "esriSLS",
                style: "esriSLSShortDash",
                color: [152, 230, 0, 255],
                width: 1,
                cap: "esriLCSSquare",
                join: "esriLJSRound",
                miterLimit: 9.75
            };
            var style = fromJson(baseline);
            var json = toJson(style);
            base_15.shouldEqual(json.stroke.color, rgba(baseline.color), "stroke color");
        });
        base_15.it("esriSLSDash esriLCSButt esriLJSBevel", function () {
            var baseline = {
                type: "esriSLS",
                style: "esriSLSDash",
                color: [152, 230, 0, 255],
                width: 1,
                cap: "esriLCSButt",
                join: "esriLJSBevel",
                miterLimit: 9.75
            };
            var style = fromJson(baseline);
            var json = toJson(style);
            base_15.shouldEqual(json.stroke.color, rgba(baseline.color), "stroke color");
        });
        base_15.it("esriSLSSolid esriLCSRound esriLJSMiter", function () {
            var baseline = {
                type: "esriSLS",
                style: "esriSLSSolid",
                color: [152, 230, 0, 255],
                width: 1,
                cap: "esriLCSRound",
                join: "esriLJSMiter",
                miterLimit: 9.75
            };
            var style = fromJson(baseline);
            var json = toJson(style);
            base_15.shouldEqual(json.stroke.color, rgba(baseline.color), "stroke color");
        });
    });
});
define("node_modules/ol3-symbolizer/tests/index", ["require", "exports", "node_modules/ol3-symbolizer/tests/common", "node_modules/ol3-symbolizer/tests/ol3-symbolizer", "node_modules/ol3-symbolizer/tests/ags-symbolizer"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("tests/spec/packages", ["require", "exports", "node_modules/ol3-fun/tests/index", "node_modules/ol3-symbolizer/tests/index"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("ol3-draw/ol3-button", ["require", "exports", "openlayers", "node_modules/ol3-fun/index", "node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer"], function (require, exports, ol, index_10, ol3_symbolizer_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button(options) {
            var _this = _super.call(this, options) || this;
            _this.options = options;
            _this.handlers = [];
            _this.symbolizer = new ol3_symbolizer_3.StyleConverter();
            _this.cssin();
            options.element.className = options.className + " " + options.position;
            var button = index_10.html("<input type=\"button\" value=\"" + options.label + "\" />");
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
            options = index_10.mixin(index_10.mixin({}, Button.DEFAULT_OPTIONS), options || {});
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
            var positions = index_10.pair("top left right bottom".split(" "), index_10.range(24)).map(function (pos) { return "." + className + "." + (pos[0] + (-pos[1] || "")) + " { " + pos[0] + ":" + (0.5 + pos[1]) + "em; }"; });
            this.handlers.push(index_10.cssin(className, "\n            ." + className + " {\n                position: absolute;\n                background-color: rgba(255,255,255,.4);\n            }\n            ." + className + ".active {\n                background-color: white;\n            }\n            ." + className + ":hover {\n                background-color: white;\n            }\n            ." + className + " input[type=\"button\"] {\n                color: rgba(0,60,136,1);\n                background: transparent;\n                border: none;\n                width: 2em;\n                height: 2em;\n            }\n            " + positions.join("\n") + "\n        "));
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
define("node_modules/ol3-symbolizer/index", ["require", "exports", "node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer", "node_modules/ol3-symbolizer/ol3-symbolizer/format/ags-symbolizer", "node_modules/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer"], function (require, exports, Symbolizer, ags_symbolizer_2, ol3_symbolizer_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Symbolizer = Symbolizer;
    exports.AgsStyleConverter = ags_symbolizer_2.StyleConverter;
    exports.StyleConverter = ol3_symbolizer_4.StyleConverter;
});
define("ol3-draw/ol3-draw", ["require", "exports", "openlayers", "ol3-draw/ol3-button", "node_modules/ol3-fun/index"], function (require, exports, ol, ol3_button_1, index_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Draw = /** @class */ (function (_super) {
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
            options = index_11.mixin(index_11.mixin({}, Draw.DEFAULT_OPTIONS), options || {});
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
define("tests/spec/draw", ["require", "exports", "node_modules/ol3-fun/tests/base", "ol3-draw/ol3-draw"], function (require, exports, base_16, ol3_draw_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_16.describe("Draw Tests", function () {
        base_16.it("Draw", function () {
            base_16.should(!!ol3_draw_1.Draw, "Draw");
        });
        base_16.it("DEFAULT_OPTIONS", function () {
            var options = ol3_draw_1.Draw.DEFAULT_OPTIONS;
            checkDefaultInputOptions(options);
        });
        base_16.it("options of an Input instance", function () {
            var input = ol3_draw_1.Draw.create();
            checkDefaultInputOptions(input.options);
        });
    });
    function checkDefaultInputOptions(options) {
        base_16.should(!!options, "options");
        base_16.shouldEqual(options.className, "ol-draw", "className");
        base_16.shouldEqual(options.map, undefined, "map");
        base_16.shouldEqual(options.position, "top left", "position");
    }
});
define("ol3-draw/services/wfs-sync", ["require", "exports", "openlayers", "jquery", "node_modules/ol3-fun/index"], function (require, exports, ol, $, index_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var serializer = new XMLSerializer();
    var WfsSync = /** @class */ (function () {
        function WfsSync(options) {
            this.options = options;
            this.lastSavedTime = Date.now();
            this.deletes = [];
            this.watch();
        }
        WfsSync.create = function (options) {
            options = index_12.defaults(options || {}, WfsSync.DEFAULT_OPTIONS);
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
        /**
         * start watching the feature collection, saving when there's a lull in the action
         */
        WfsSync.prototype.watch = function () {
            var _this = this;
            var save = index_12.debounce(function () {
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
        /**
         * Performs the actual save of a list of feature (immutable)
         */
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
                        // ExceptionReport?
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
                            //let originalToInsert = toSave.filter(f => !f.get(this.options.featureIdFieldName));
                            //originalToInsert.forEach((f, i) => f.setGeometry(toInsert[i].getGeometry()));
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
define("tests/spec/wfs-sync", ["require", "exports", "openlayers", "node_modules/ol3-fun/tests/base", "ol3-draw/services/wfs-sync"], function (require, exports, ol, base_17, wfs_sync_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WFS_INFO = {
        srsName: "EPSG:3857",
        wfsUrl: location.protocol + "//" + location.hostname + ":8080/geoserver/cite/wfs",
        featureNS: "http://www.opengeospatial.net/cite",
        featurePrefix: "cite"
    };
    base_17.describe("wfs-sync", function () {
        base_17.it("WfsSync", function () {
            base_17.should(!!wfs_sync_1.WfsSync, "WfsSync");
        });
        base_17.it("DEFAULT_OPTIONS", function () {
            var options = wfs_sync_1.WfsSync.DEFAULT_OPTIONS;
            checkDefaultInputOptions(options);
        });
        location.hostname === "127.0.0.1" &&
            base_17.it("should invoke a POST request", function (done) {
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
                    base_17.shouldEqual(args, "Feature type 'point_layer' is not available: ", "point_layer not available error message");
                    done();
                });
                // seems we'd want an option to load all the points into the source?
                // should cause a POST to create the feature
                source.addFeature(new ol.Feature(new ol.geom.Point([0, 0])));
            });
    });
    function checkDefaultInputOptions(options) {
        base_17.should(!!options, "options");
        base_17.shouldEqual(options.featureIdFieldName, "gid", "featureIdFieldName");
        base_17.shouldEqual(options.lastUpdateFieldName, "touched", "lastUpdateFieldName");
    }
});
define("tests/index", ["require", "exports", "tests/spec/packages", "tests/spec/draw", "tests/spec/wfs-sync"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=tests.max.js.map