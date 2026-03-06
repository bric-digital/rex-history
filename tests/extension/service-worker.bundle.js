var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/jquery/dist/jquery.js
var require_jquery = __commonJS({
  "node_modules/jquery/dist/jquery.js"(exports, module) {
    (function(global, factory) {
      "use strict";
      if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ? factory(global, true) : function(w) {
          if (!w.document) {
            throw new Error("jQuery requires a window with a document");
          }
          return factory(w);
        };
      } else {
        factory(global);
      }
    })(typeof window !== "undefined" ? window : exports, function(window2, noGlobal) {
      "use strict";
      var arr = [];
      var getProto = Object.getPrototypeOf;
      var slice = arr.slice;
      var flat = arr.flat ? function(array) {
        return arr.flat.call(array);
      } : function(array) {
        return arr.concat.apply([], array);
      };
      var push = arr.push;
      var indexOf = arr.indexOf;
      var class2type = {};
      var toString = class2type.toString;
      var hasOwn = class2type.hasOwnProperty;
      var fnToString = hasOwn.toString;
      var ObjectFunctionString = fnToString.call(Object);
      var support = {};
      var isFunction = function isFunction2(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
      };
      var isWindow = function isWindow2(obj) {
        return obj != null && obj === obj.window;
      };
      var document2 = window2.document;
      var preservedScriptAttributes = {
        type: true,
        src: true,
        nonce: true,
        noModule: true
      };
      function DOMEval(code, node, doc) {
        doc = doc || document2;
        var i, val, script = doc.createElement("script");
        script.text = code;
        if (node) {
          for (i in preservedScriptAttributes) {
            val = node[i] || node.getAttribute && node.getAttribute(i);
            if (val) {
              script.setAttribute(i, val);
            }
          }
        }
        doc.head.appendChild(script).parentNode.removeChild(script);
      }
      function toType(obj) {
        if (obj == null) {
          return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
      }
      var version = "3.7.1", rhtmlSuffix = /HTML$/i, jQuery = function(selector, context) {
        return new jQuery.fn.init(selector, context);
      };
      jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: version,
        constructor: jQuery,
        // The default length of a jQuery object is 0
        length: 0,
        toArray: function() {
          return slice.call(this);
        },
        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function(num) {
          if (num == null) {
            return slice.call(this);
          }
          return num < 0 ? this[num + this.length] : this[num];
        },
        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function(elems) {
          var ret = jQuery.merge(this.constructor(), elems);
          ret.prevObject = this;
          return ret;
        },
        // Execute a callback for every element in the matched set.
        each: function(callback) {
          return jQuery.each(this, callback);
        },
        map: function(callback) {
          return this.pushStack(jQuery.map(this, function(elem, i) {
            return callback.call(elem, i, elem);
          }));
        },
        slice: function() {
          return this.pushStack(slice.apply(this, arguments));
        },
        first: function() {
          return this.eq(0);
        },
        last: function() {
          return this.eq(-1);
        },
        even: function() {
          return this.pushStack(jQuery.grep(this, function(_elem, i) {
            return (i + 1) % 2;
          }));
        },
        odd: function() {
          return this.pushStack(jQuery.grep(this, function(_elem, i) {
            return i % 2;
          }));
        },
        eq: function(i) {
          var len = this.length, j = +i + (i < 0 ? len : 0);
          return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        end: function() {
          return this.prevObject || this.constructor();
        },
        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push,
        sort: arr.sort,
        splice: arr.splice
      };
      jQuery.extend = jQuery.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
        if (typeof target === "boolean") {
          deep = target;
          target = arguments[i] || {};
          i++;
        }
        if (typeof target !== "object" && !isFunction(target)) {
          target = {};
        }
        if (i === length) {
          target = this;
          i--;
        }
        for (; i < length; i++) {
          if ((options = arguments[i]) != null) {
            for (name in options) {
              copy = options[name];
              if (name === "__proto__" || target === copy) {
                continue;
              }
              if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                src = target[name];
                if (copyIsArray && !Array.isArray(src)) {
                  clone = [];
                } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
                  clone = {};
                } else {
                  clone = src;
                }
                copyIsArray = false;
                target[name] = jQuery.extend(deep, clone, copy);
              } else if (copy !== void 0) {
                target[name] = copy;
              }
            }
          }
        }
        return target;
      };
      jQuery.extend({
        // Unique for each copy of jQuery on the page
        expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
        // Assume jQuery is ready without the ready module
        isReady: true,
        error: function(msg) {
          throw new Error(msg);
        },
        noop: function() {
        },
        isPlainObject: function(obj) {
          var proto, Ctor;
          if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
          }
          proto = getProto(obj);
          if (!proto) {
            return true;
          }
          Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
          return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
        },
        isEmptyObject: function(obj) {
          var name;
          for (name in obj) {
            return false;
          }
          return true;
        },
        // Evaluates a script in a provided context; falls back to the global one
        // if not specified.
        globalEval: function(code, options, doc) {
          DOMEval(code, { nonce: options && options.nonce }, doc);
        },
        each: function(obj, callback) {
          var length, i = 0;
          if (isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
              if (callback.call(obj[i], i, obj[i]) === false) {
                break;
              }
            }
          } else {
            for (i in obj) {
              if (callback.call(obj[i], i, obj[i]) === false) {
                break;
              }
            }
          }
          return obj;
        },
        // Retrieve the text value of an array of DOM nodes
        text: function(elem) {
          var node, ret = "", i = 0, nodeType = elem.nodeType;
          if (!nodeType) {
            while (node = elem[i++]) {
              ret += jQuery.text(node);
            }
          }
          if (nodeType === 1 || nodeType === 11) {
            return elem.textContent;
          }
          if (nodeType === 9) {
            return elem.documentElement.textContent;
          }
          if (nodeType === 3 || nodeType === 4) {
            return elem.nodeValue;
          }
          return ret;
        },
        // results is for internal usage only
        makeArray: function(arr2, results) {
          var ret = results || [];
          if (arr2 != null) {
            if (isArrayLike(Object(arr2))) {
              jQuery.merge(
                ret,
                typeof arr2 === "string" ? [arr2] : arr2
              );
            } else {
              push.call(ret, arr2);
            }
          }
          return ret;
        },
        inArray: function(elem, arr2, i) {
          return arr2 == null ? -1 : indexOf.call(arr2, elem, i);
        },
        isXMLDoc: function(elem) {
          var namespace = elem && elem.namespaceURI, docElem = elem && (elem.ownerDocument || elem).documentElement;
          return !rhtmlSuffix.test(namespace || docElem && docElem.nodeName || "HTML");
        },
        // Support: Android <=4.0 only, PhantomJS 1 only
        // push.apply(_, arraylike) throws on ancient WebKit
        merge: function(first, second) {
          var len = +second.length, j = 0, i = first.length;
          for (; j < len; j++) {
            first[i++] = second[j];
          }
          first.length = i;
          return first;
        },
        grep: function(elems, callback, invert) {
          var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert;
          for (; i < length; i++) {
            callbackInverse = !callback(elems[i], i);
            if (callbackInverse !== callbackExpect) {
              matches.push(elems[i]);
            }
          }
          return matches;
        },
        // arg is for internal usage only
        map: function(elems, callback, arg) {
          var length, value, i = 0, ret = [];
          if (isArrayLike(elems)) {
            length = elems.length;
            for (; i < length; i++) {
              value = callback(elems[i], i, arg);
              if (value != null) {
                ret.push(value);
              }
            }
          } else {
            for (i in elems) {
              value = callback(elems[i], i, arg);
              if (value != null) {
                ret.push(value);
              }
            }
          }
          return flat(ret);
        },
        // A global GUID counter for objects
        guid: 1,
        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support
      });
      if (typeof Symbol === "function") {
        jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
      }
      jQuery.each(
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
        function(_i, name) {
          class2type["[object " + name + "]"] = name.toLowerCase();
        }
      );
      function isArrayLike(obj) {
        var length = !!obj && "length" in obj && obj.length, type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) {
          return false;
        }
        return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
      }
      function nodeName(elem, name) {
        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
      }
      var pop = arr.pop;
      var sort = arr.sort;
      var splice = arr.splice;
      var whitespace = "[\\x20\\t\\r\\n\\f]";
      var rtrimCSS = new RegExp(
        "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
        "g"
      );
      jQuery.contains = function(a, b) {
        var bup = b && b.parentNode;
        return a === bup || !!(bup && bup.nodeType === 1 && // Support: IE 9 - 11+
        // IE doesn't have `contains` on SVG.
        (a.contains ? a.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
      };
      var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
      function fcssescape(ch, asCodePoint) {
        if (asCodePoint) {
          if (ch === "\0") {
            return "\uFFFD";
          }
          return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
        }
        return "\\" + ch;
      }
      jQuery.escapeSelector = function(sel) {
        return (sel + "").replace(rcssescape, fcssescape);
      };
      var preferredDoc = document2, pushNative = push;
      (function() {
        var i, Expr, outermostContext, sortInput, hasDuplicate, push2 = pushNative, document3, documentElement2, documentIsHTML, rbuggyQSA, matches, expando = jQuery.expando, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), sortOrder = function(a, b) {
          if (a === b) {
            hasDuplicate = true;
          }
          return 0;
        }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + // Operator (capture 2)
        "*([*^$|!~]?=)" + whitespace + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + identifier + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + attributes + ")*)|.*)\\)|)", rwhitespace = new RegExp(whitespace + "+", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rleadingCombinator = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rdescend = new RegExp(whitespace + "|>"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
          ID: new RegExp("^#(" + identifier + ")"),
          CLASS: new RegExp("^\\.(" + identifier + ")"),
          TAG: new RegExp("^(" + identifier + "|[*])"),
          ATTR: new RegExp("^" + attributes),
          PSEUDO: new RegExp("^" + pseudos),
          CHILD: new RegExp(
            "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)",
            "i"
          ),
          bool: new RegExp("^(?:" + booleans + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rquickExpr2 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape, nonHex) {
          var high = "0x" + escape.slice(1) - 65536;
          if (nonHex) {
            return nonHex;
          }
          return high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
        }, unloadHandler = function() {
          setDocument();
        }, inDisabledFieldset = addCombinator(
          function(elem) {
            return elem.disabled === true && nodeName(elem, "fieldset");
          },
          { dir: "parentNode", next: "legend" }
        );
        function safeActiveElement() {
          try {
            return document3.activeElement;
          } catch (err) {
          }
        }
        try {
          push2.apply(
            arr = slice.call(preferredDoc.childNodes),
            preferredDoc.childNodes
          );
          arr[preferredDoc.childNodes.length].nodeType;
        } catch (e) {
          push2 = {
            apply: function(target, els) {
              pushNative.apply(target, slice.call(els));
            },
            call: function(target) {
              pushNative.apply(target, slice.call(arguments, 1));
            }
          };
        }
        function find(selector, context, results, seed) {
          var m, i2, elem, nid, match, groups, newSelector, newContext = context && context.ownerDocument, nodeType = context ? context.nodeType : 9;
          results = results || [];
          if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
            return results;
          }
          if (!seed) {
            setDocument(context);
            context = context || document3;
            if (documentIsHTML) {
              if (nodeType !== 11 && (match = rquickExpr2.exec(selector))) {
                if (m = match[1]) {
                  if (nodeType === 9) {
                    if (elem = context.getElementById(m)) {
                      if (elem.id === m) {
                        push2.call(results, elem);
                        return results;
                      }
                    } else {
                      return results;
                    }
                  } else {
                    if (newContext && (elem = newContext.getElementById(m)) && find.contains(context, elem) && elem.id === m) {
                      push2.call(results, elem);
                      return results;
                    }
                  }
                } else if (match[2]) {
                  push2.apply(results, context.getElementsByTagName(selector));
                  return results;
                } else if ((m = match[3]) && context.getElementsByClassName) {
                  push2.apply(results, context.getElementsByClassName(m));
                  return results;
                }
              }
              if (!nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                newSelector = selector;
                newContext = context;
                if (nodeType === 1 && (rdescend.test(selector) || rleadingCombinator.test(selector))) {
                  newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                  if (newContext != context || !support.scope) {
                    if (nid = context.getAttribute("id")) {
                      nid = jQuery.escapeSelector(nid);
                    } else {
                      context.setAttribute("id", nid = expando);
                    }
                  }
                  groups = tokenize(selector);
                  i2 = groups.length;
                  while (i2--) {
                    groups[i2] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i2]);
                  }
                  newSelector = groups.join(",");
                }
                try {
                  push2.apply(
                    results,
                    newContext.querySelectorAll(newSelector)
                  );
                  return results;
                } catch (qsaError) {
                  nonnativeSelectorCache(selector, true);
                } finally {
                  if (nid === expando) {
                    context.removeAttribute("id");
                  }
                }
              }
            }
          }
          return select(selector.replace(rtrimCSS, "$1"), context, results, seed);
        }
        function createCache() {
          var keys = [];
          function cache(key, value) {
            if (keys.push(key + " ") > Expr.cacheLength) {
              delete cache[keys.shift()];
            }
            return cache[key + " "] = value;
          }
          return cache;
        }
        function markFunction(fn) {
          fn[expando] = true;
          return fn;
        }
        function assert(fn) {
          var el = document3.createElement("fieldset");
          try {
            return !!fn(el);
          } catch (e) {
            return false;
          } finally {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
            el = null;
          }
        }
        function createInputPseudo(type) {
          return function(elem) {
            return nodeName(elem, "input") && elem.type === type;
          };
        }
        function createButtonPseudo(type) {
          return function(elem) {
            return (nodeName(elem, "input") || nodeName(elem, "button")) && elem.type === type;
          };
        }
        function createDisabledPseudo(disabled) {
          return function(elem) {
            if ("form" in elem) {
              if (elem.parentNode && elem.disabled === false) {
                if ("label" in elem) {
                  if ("label" in elem.parentNode) {
                    return elem.parentNode.disabled === disabled;
                  } else {
                    return elem.disabled === disabled;
                  }
                }
                return elem.isDisabled === disabled || // Where there is no isDisabled, check manually
                elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
              }
              return elem.disabled === disabled;
            } else if ("label" in elem) {
              return elem.disabled === disabled;
            }
            return false;
          };
        }
        function createPositionalPseudo(fn) {
          return markFunction(function(argument) {
            argument = +argument;
            return markFunction(function(seed, matches2) {
              var j, matchIndexes = fn([], seed.length, argument), i2 = matchIndexes.length;
              while (i2--) {
                if (seed[j = matchIndexes[i2]]) {
                  seed[j] = !(matches2[j] = seed[j]);
                }
              }
            });
          });
        }
        function testContext(context) {
          return context && typeof context.getElementsByTagName !== "undefined" && context;
        }
        function setDocument(node) {
          var subWindow, doc = node ? node.ownerDocument || node : preferredDoc;
          if (doc == document3 || doc.nodeType !== 9 || !doc.documentElement) {
            return document3;
          }
          document3 = doc;
          documentElement2 = document3.documentElement;
          documentIsHTML = !jQuery.isXMLDoc(document3);
          matches = documentElement2.matches || documentElement2.webkitMatchesSelector || documentElement2.msMatchesSelector;
          if (documentElement2.msMatchesSelector && // Support: IE 11+, Edge 17 - 18+
          // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
          // two documents; shallow comparisons work.
          // eslint-disable-next-line eqeqeq
          preferredDoc != document3 && (subWindow = document3.defaultView) && subWindow.top !== subWindow) {
            subWindow.addEventListener("unload", unloadHandler);
          }
          support.getById = assert(function(el) {
            documentElement2.appendChild(el).id = jQuery.expando;
            return !document3.getElementsByName || !document3.getElementsByName(jQuery.expando).length;
          });
          support.disconnectedMatch = assert(function(el) {
            return matches.call(el, "*");
          });
          support.scope = assert(function() {
            return document3.querySelectorAll(":scope");
          });
          support.cssHas = assert(function() {
            try {
              document3.querySelector(":has(*,:jqfake)");
              return false;
            } catch (e) {
              return true;
            }
          });
          if (support.getById) {
            Expr.filter.ID = function(id) {
              var attrId = id.replace(runescape, funescape);
              return function(elem) {
                return elem.getAttribute("id") === attrId;
              };
            };
            Expr.find.ID = function(id, context) {
              if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                var elem = context.getElementById(id);
                return elem ? [elem] : [];
              }
            };
          } else {
            Expr.filter.ID = function(id) {
              var attrId = id.replace(runescape, funescape);
              return function(elem) {
                var node2 = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                return node2 && node2.value === attrId;
              };
            };
            Expr.find.ID = function(id, context) {
              if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                var node2, i2, elems, elem = context.getElementById(id);
                if (elem) {
                  node2 = elem.getAttributeNode("id");
                  if (node2 && node2.value === id) {
                    return [elem];
                  }
                  elems = context.getElementsByName(id);
                  i2 = 0;
                  while (elem = elems[i2++]) {
                    node2 = elem.getAttributeNode("id");
                    if (node2 && node2.value === id) {
                      return [elem];
                    }
                  }
                }
                return [];
              }
            };
          }
          Expr.find.TAG = function(tag, context) {
            if (typeof context.getElementsByTagName !== "undefined") {
              return context.getElementsByTagName(tag);
            } else {
              return context.querySelectorAll(tag);
            }
          };
          Expr.find.CLASS = function(className, context) {
            if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
              return context.getElementsByClassName(className);
            }
          };
          rbuggyQSA = [];
          assert(function(el) {
            var input;
            documentElement2.appendChild(el).innerHTML = "<a id='" + expando + "' href='' disabled='disabled'></a><select id='" + expando + "-\r\\' disabled='disabled'><option selected=''></option></select>";
            if (!el.querySelectorAll("[selected]").length) {
              rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
            }
            if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
              rbuggyQSA.push("~=");
            }
            if (!el.querySelectorAll("a#" + expando + "+*").length) {
              rbuggyQSA.push(".#.+[+~]");
            }
            if (!el.querySelectorAll(":checked").length) {
              rbuggyQSA.push(":checked");
            }
            input = document3.createElement("input");
            input.setAttribute("type", "hidden");
            el.appendChild(input).setAttribute("name", "D");
            documentElement2.appendChild(el).disabled = true;
            if (el.querySelectorAll(":disabled").length !== 2) {
              rbuggyQSA.push(":enabled", ":disabled");
            }
            input = document3.createElement("input");
            input.setAttribute("name", "");
            el.appendChild(input);
            if (!el.querySelectorAll("[name='']").length) {
              rbuggyQSA.push("\\[" + whitespace + "*name" + whitespace + "*=" + whitespace + `*(?:''|"")`);
            }
          });
          if (!support.cssHas) {
            rbuggyQSA.push(":has");
          }
          rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
          sortOrder = function(a, b) {
            if (a === b) {
              hasDuplicate = true;
              return 0;
            }
            var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
            if (compare) {
              return compare;
            }
            compare = (a.ownerDocument || a) == (b.ownerDocument || b) ? a.compareDocumentPosition(b) : (
              // Otherwise we know they are disconnected
              1
            );
            if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
              if (a === document3 || a.ownerDocument == preferredDoc && find.contains(preferredDoc, a)) {
                return -1;
              }
              if (b === document3 || b.ownerDocument == preferredDoc && find.contains(preferredDoc, b)) {
                return 1;
              }
              return sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
            }
            return compare & 4 ? -1 : 1;
          };
          return document3;
        }
        find.matches = function(expr, elements) {
          return find(expr, null, null, elements);
        };
        find.matchesSelector = function(elem, expr) {
          setDocument(elem);
          if (documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
            try {
              var ret = matches.call(elem, expr);
              if (ret || support.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              elem.document && elem.document.nodeType !== 11) {
                return ret;
              }
            } catch (e) {
              nonnativeSelectorCache(expr, true);
            }
          }
          return find(expr, document3, null, [elem]).length > 0;
        };
        find.contains = function(context, elem) {
          if ((context.ownerDocument || context) != document3) {
            setDocument(context);
          }
          return jQuery.contains(context, elem);
        };
        find.attr = function(elem, name) {
          if ((elem.ownerDocument || elem) != document3) {
            setDocument(elem);
          }
          var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
          if (val !== void 0) {
            return val;
          }
          return elem.getAttribute(name);
        };
        find.error = function(msg) {
          throw new Error("Syntax error, unrecognized expression: " + msg);
        };
        jQuery.uniqueSort = function(results) {
          var elem, duplicates = [], j = 0, i2 = 0;
          hasDuplicate = !support.sortStable;
          sortInput = !support.sortStable && slice.call(results, 0);
          sort.call(results, sortOrder);
          if (hasDuplicate) {
            while (elem = results[i2++]) {
              if (elem === results[i2]) {
                j = duplicates.push(i2);
              }
            }
            while (j--) {
              splice.call(results, duplicates[j], 1);
            }
          }
          sortInput = null;
          return results;
        };
        jQuery.fn.uniqueSort = function() {
          return this.pushStack(jQuery.uniqueSort(slice.apply(this)));
        };
        Expr = jQuery.expr = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: markFunction,
          match: matchExpr,
          attrHandle: {},
          find: {},
          relative: {
            ">": { dir: "parentNode", first: true },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: true },
            "~": { dir: "previousSibling" }
          },
          preFilter: {
            ATTR: function(match) {
              match[1] = match[1].replace(runescape, funescape);
              match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
              if (match[2] === "~=") {
                match[3] = " " + match[3] + " ";
              }
              return match.slice(0, 4);
            },
            CHILD: function(match) {
              match[1] = match[1].toLowerCase();
              if (match[1].slice(0, 3) === "nth") {
                if (!match[3]) {
                  find.error(match[0]);
                }
                match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                match[5] = +(match[7] + match[8] || match[3] === "odd");
              } else if (match[3]) {
                find.error(match[0]);
              }
              return match;
            },
            PSEUDO: function(match) {
              var excess, unquoted = !match[6] && match[2];
              if (matchExpr.CHILD.test(match[0])) {
                return null;
              }
              if (match[3]) {
                match[2] = match[4] || match[5] || "";
              } else if (unquoted && rpseudo.test(unquoted) && // Get excess from tokenize (recursively)
              (excess = tokenize(unquoted, true)) && // advance to the next closing parenthesis
              (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                match[0] = match[0].slice(0, excess);
                match[2] = unquoted.slice(0, excess);
              }
              return match.slice(0, 3);
            }
          },
          filter: {
            TAG: function(nodeNameSelector) {
              var expectedNodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
              return nodeNameSelector === "*" ? function() {
                return true;
              } : function(elem) {
                return nodeName(elem, expectedNodeName);
              };
            },
            CLASS: function(className) {
              var pattern = classCache[className + " "];
              return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                return pattern.test(
                  typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || ""
                );
              });
            },
            ATTR: function(name, operator, check) {
              return function(elem) {
                var result = find.attr(elem, name);
                if (result == null) {
                  return operator === "!=";
                }
                if (!operator) {
                  return true;
                }
                result += "";
                if (operator === "=") {
                  return result === check;
                }
                if (operator === "!=") {
                  return result !== check;
                }
                if (operator === "^=") {
                  return check && result.indexOf(check) === 0;
                }
                if (operator === "*=") {
                  return check && result.indexOf(check) > -1;
                }
                if (operator === "$=") {
                  return check && result.slice(-check.length) === check;
                }
                if (operator === "~=") {
                  return (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1;
                }
                if (operator === "|=") {
                  return result === check || result.slice(0, check.length + 1) === check + "-";
                }
                return false;
              };
            },
            CHILD: function(type, what, _argument, first, last) {
              var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
              return first === 1 && last === 0 ? (
                // Shortcut for :nth-*(n)
                function(elem) {
                  return !!elem.parentNode;
                }
              ) : function(elem, _context, xml) {
                var cache, outerCache, node, nodeIndex, start, dir2 = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = false;
                if (parent) {
                  if (simple) {
                    while (dir2) {
                      node = elem;
                      while (node = node[dir2]) {
                        if (ofType ? nodeName(node, name) : node.nodeType === 1) {
                          return false;
                        }
                      }
                      start = dir2 = type === "only" && !start && "nextSibling";
                    }
                    return true;
                  }
                  start = [forward ? parent.firstChild : parent.lastChild];
                  if (forward && useCache) {
                    outerCache = parent[expando] || (parent[expando] = {});
                    cache = outerCache[type] || [];
                    nodeIndex = cache[0] === dirruns && cache[1];
                    diff = nodeIndex && cache[2];
                    node = nodeIndex && parent.childNodes[nodeIndex];
                    while (node = ++nodeIndex && node && node[dir2] || // Fallback to seeking `elem` from the start
                    (diff = nodeIndex = 0) || start.pop()) {
                      if (node.nodeType === 1 && ++diff && node === elem) {
                        outerCache[type] = [dirruns, nodeIndex, diff];
                        break;
                      }
                    }
                  } else {
                    if (useCache) {
                      outerCache = elem[expando] || (elem[expando] = {});
                      cache = outerCache[type] || [];
                      nodeIndex = cache[0] === dirruns && cache[1];
                      diff = nodeIndex;
                    }
                    if (diff === false) {
                      while (node = ++nodeIndex && node && node[dir2] || (diff = nodeIndex = 0) || start.pop()) {
                        if ((ofType ? nodeName(node, name) : node.nodeType === 1) && ++diff) {
                          if (useCache) {
                            outerCache = node[expando] || (node[expando] = {});
                            outerCache[type] = [dirruns, diff];
                          }
                          if (node === elem) {
                            break;
                          }
                        }
                      }
                    }
                  }
                  diff -= last;
                  return diff === first || diff % first === 0 && diff / first >= 0;
                }
              };
            },
            PSEUDO: function(pseudo, argument) {
              var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || find.error("unsupported pseudo: " + pseudo);
              if (fn[expando]) {
                return fn(argument);
              }
              if (fn.length > 1) {
                args = [pseudo, pseudo, "", argument];
                return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches2) {
                  var idx, matched = fn(seed, argument), i2 = matched.length;
                  while (i2--) {
                    idx = indexOf.call(seed, matched[i2]);
                    seed[idx] = !(matches2[idx] = matched[i2]);
                  }
                }) : function(elem) {
                  return fn(elem, 0, args);
                };
              }
              return fn;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: markFunction(function(selector) {
              var input = [], results = [], matcher = compile(selector.replace(rtrimCSS, "$1"));
              return matcher[expando] ? markFunction(function(seed, matches2, _context, xml) {
                var elem, unmatched = matcher(seed, null, xml, []), i2 = seed.length;
                while (i2--) {
                  if (elem = unmatched[i2]) {
                    seed[i2] = !(matches2[i2] = elem);
                  }
                }
              }) : function(elem, _context, xml) {
                input[0] = elem;
                matcher(input, null, xml, results);
                input[0] = null;
                return !results.pop();
              };
            }),
            has: markFunction(function(selector) {
              return function(elem) {
                return find(selector, elem).length > 0;
              };
            }),
            contains: markFunction(function(text) {
              text = text.replace(runescape, funescape);
              return function(elem) {
                return (elem.textContent || jQuery.text(elem)).indexOf(text) > -1;
              };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // https://www.w3.org/TR/selectors/#lang-pseudo
            lang: markFunction(function(lang) {
              if (!ridentifier.test(lang || "")) {
                find.error("unsupported lang: " + lang);
              }
              lang = lang.replace(runescape, funescape).toLowerCase();
              return function(elem) {
                var elemLang;
                do {
                  if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                    elemLang = elemLang.toLowerCase();
                    return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                  }
                } while ((elem = elem.parentNode) && elem.nodeType === 1);
                return false;
              };
            }),
            // Miscellaneous
            target: function(elem) {
              var hash = window2.location && window2.location.hash;
              return hash && hash.slice(1) === elem.id;
            },
            root: function(elem) {
              return elem === documentElement2;
            },
            focus: function(elem) {
              return elem === safeActiveElement() && document3.hasFocus() && !!(elem.type || elem.href || ~elem.tabIndex);
            },
            // Boolean properties
            enabled: createDisabledPseudo(false),
            disabled: createDisabledPseudo(true),
            checked: function(elem) {
              return nodeName(elem, "input") && !!elem.checked || nodeName(elem, "option") && !!elem.selected;
            },
            selected: function(elem) {
              if (elem.parentNode) {
                elem.parentNode.selectedIndex;
              }
              return elem.selected === true;
            },
            // Contents
            empty: function(elem) {
              for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                if (elem.nodeType < 6) {
                  return false;
                }
              }
              return true;
            },
            parent: function(elem) {
              return !Expr.pseudos.empty(elem);
            },
            // Element/input types
            header: function(elem) {
              return rheader.test(elem.nodeName);
            },
            input: function(elem) {
              return rinputs.test(elem.nodeName);
            },
            button: function(elem) {
              return nodeName(elem, "input") && elem.type === "button" || nodeName(elem, "button");
            },
            text: function(elem) {
              var attr;
              return nodeName(elem, "input") && elem.type === "text" && // Support: IE <10 only
              // New HTML5 attribute values (e.g., "search") appear
              // with elem.type === "text"
              ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
            },
            // Position-in-collection
            first: createPositionalPseudo(function() {
              return [0];
            }),
            last: createPositionalPseudo(function(_matchIndexes, length) {
              return [length - 1];
            }),
            eq: createPositionalPseudo(function(_matchIndexes, length, argument) {
              return [argument < 0 ? argument + length : argument];
            }),
            even: createPositionalPseudo(function(matchIndexes, length) {
              var i2 = 0;
              for (; i2 < length; i2 += 2) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            }),
            odd: createPositionalPseudo(function(matchIndexes, length) {
              var i2 = 1;
              for (; i2 < length; i2 += 2) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            }),
            lt: createPositionalPseudo(function(matchIndexes, length, argument) {
              var i2;
              if (argument < 0) {
                i2 = argument + length;
              } else if (argument > length) {
                i2 = length;
              } else {
                i2 = argument;
              }
              for (; --i2 >= 0; ) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            }),
            gt: createPositionalPseudo(function(matchIndexes, length, argument) {
              var i2 = argument < 0 ? argument + length : argument;
              for (; ++i2 < length; ) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            })
          }
        };
        Expr.pseudos.nth = Expr.pseudos.eq;
        for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
          Expr.pseudos[i] = createInputPseudo(i);
        }
        for (i in { submit: true, reset: true }) {
          Expr.pseudos[i] = createButtonPseudo(i);
        }
        function setFilters() {
        }
        setFilters.prototype = Expr.filters = Expr.pseudos;
        Expr.setFilters = new setFilters();
        function tokenize(selector, parseOnly) {
          var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
          if (cached) {
            return parseOnly ? 0 : cached.slice(0);
          }
          soFar = selector;
          groups = [];
          preFilters = Expr.preFilter;
          while (soFar) {
            if (!matched || (match = rcomma.exec(soFar))) {
              if (match) {
                soFar = soFar.slice(match[0].length) || soFar;
              }
              groups.push(tokens = []);
            }
            matched = false;
            if (match = rleadingCombinator.exec(soFar)) {
              matched = match.shift();
              tokens.push({
                value: matched,
                // Cast descendant combinators to space
                type: match[0].replace(rtrimCSS, " ")
              });
              soFar = soFar.slice(matched.length);
            }
            for (type in Expr.filter) {
              if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                matched = match.shift();
                tokens.push({
                  value: matched,
                  type,
                  matches: match
                });
                soFar = soFar.slice(matched.length);
              }
            }
            if (!matched) {
              break;
            }
          }
          if (parseOnly) {
            return soFar.length;
          }
          return soFar ? find.error(selector) : (
            // Cache the tokens
            tokenCache(selector, groups).slice(0)
          );
        }
        function toSelector(tokens) {
          var i2 = 0, len = tokens.length, selector = "";
          for (; i2 < len; i2++) {
            selector += tokens[i2].value;
          }
          return selector;
        }
        function addCombinator(matcher, combinator, base) {
          var dir2 = combinator.dir, skip = combinator.next, key = skip || dir2, checkNonElements = base && key === "parentNode", doneName = done++;
          return combinator.first ? (
            // Check against closest ancestor/preceding element
            function(elem, context, xml) {
              while (elem = elem[dir2]) {
                if (elem.nodeType === 1 || checkNonElements) {
                  return matcher(elem, context, xml);
                }
              }
              return false;
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(elem, context, xml) {
              var oldCache, outerCache, newCache = [dirruns, doneName];
              if (xml) {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    if (matcher(elem, context, xml)) {
                      return true;
                    }
                  }
                }
              } else {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    outerCache = elem[expando] || (elem[expando] = {});
                    if (skip && nodeName(elem, skip)) {
                      elem = elem[dir2] || elem;
                    } else if ((oldCache = outerCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                      return newCache[2] = oldCache[2];
                    } else {
                      outerCache[key] = newCache;
                      if (newCache[2] = matcher(elem, context, xml)) {
                        return true;
                      }
                    }
                  }
                }
              }
              return false;
            }
          );
        }
        function elementMatcher(matchers) {
          return matchers.length > 1 ? function(elem, context, xml) {
            var i2 = matchers.length;
            while (i2--) {
              if (!matchers[i2](elem, context, xml)) {
                return false;
              }
            }
            return true;
          } : matchers[0];
        }
        function multipleContexts(selector, contexts, results) {
          var i2 = 0, len = contexts.length;
          for (; i2 < len; i2++) {
            find(selector, contexts[i2], results);
          }
          return results;
        }
        function condense(unmatched, map, filter, context, xml) {
          var elem, newUnmatched = [], i2 = 0, len = unmatched.length, mapped = map != null;
          for (; i2 < len; i2++) {
            if (elem = unmatched[i2]) {
              if (!filter || filter(elem, context, xml)) {
                newUnmatched.push(elem);
                if (mapped) {
                  map.push(i2);
                }
              }
            }
          }
          return newUnmatched;
        }
        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
          if (postFilter && !postFilter[expando]) {
            postFilter = setMatcher(postFilter);
          }
          if (postFinder && !postFinder[expando]) {
            postFinder = setMatcher(postFinder, postSelector);
          }
          return markFunction(function(seed, results, context, xml) {
            var temp, i2, elem, matcherOut, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(
              selector || "*",
              context.nodeType ? [context] : context,
              []
            ), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems;
            if (matcher) {
              matcherOut = postFinder || (seed ? preFilter : preexisting || postFilter) ? (
                // ...intermediate processing is necessary
                []
              ) : (
                // ...otherwise use results directly
                results
              );
              matcher(matcherIn, matcherOut, context, xml);
            } else {
              matcherOut = matcherIn;
            }
            if (postFilter) {
              temp = condense(matcherOut, postMap);
              postFilter(temp, [], context, xml);
              i2 = temp.length;
              while (i2--) {
                if (elem = temp[i2]) {
                  matcherOut[postMap[i2]] = !(matcherIn[postMap[i2]] = elem);
                }
              }
            }
            if (seed) {
              if (postFinder || preFilter) {
                if (postFinder) {
                  temp = [];
                  i2 = matcherOut.length;
                  while (i2--) {
                    if (elem = matcherOut[i2]) {
                      temp.push(matcherIn[i2] = elem);
                    }
                  }
                  postFinder(null, matcherOut = [], temp, xml);
                }
                i2 = matcherOut.length;
                while (i2--) {
                  if ((elem = matcherOut[i2]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i2]) > -1) {
                    seed[temp] = !(results[temp] = elem);
                  }
                }
              }
            } else {
              matcherOut = condense(
                matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut
              );
              if (postFinder) {
                postFinder(null, results, matcherOut, xml);
              } else {
                push2.apply(results, matcherOut);
              }
            }
          });
        }
        function matcherFromTokens(tokens) {
          var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i2 = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
            return elem === checkContext;
          }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
            return indexOf.call(checkContext, elem) > -1;
          }, implicitRelative, true), matchers = [function(elem, context, xml) {
            var ret = !leadingRelative && (xml || context != outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
            checkContext = null;
            return ret;
          }];
          for (; i2 < len; i2++) {
            if (matcher = Expr.relative[tokens[i2].type]) {
              matchers = [addCombinator(elementMatcher(matchers), matcher)];
            } else {
              matcher = Expr.filter[tokens[i2].type].apply(null, tokens[i2].matches);
              if (matcher[expando]) {
                j = ++i2;
                for (; j < len; j++) {
                  if (Expr.relative[tokens[j].type]) {
                    break;
                  }
                }
                return setMatcher(
                  i2 > 1 && elementMatcher(matchers),
                  i2 > 1 && toSelector(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    tokens.slice(0, i2 - 1).concat({ value: tokens[i2 - 2].type === " " ? "*" : "" })
                  ).replace(rtrimCSS, "$1"),
                  matcher,
                  i2 < j && matcherFromTokens(tokens.slice(i2, j)),
                  j < len && matcherFromTokens(tokens = tokens.slice(j)),
                  j < len && toSelector(tokens)
                );
              }
              matchers.push(matcher);
            }
          }
          return elementMatcher(matchers);
        }
        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
          var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
            var elem, j, matcher, matchedCount = 0, i2 = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
            if (outermost) {
              outermostContext = context == document3 || context || outermost;
            }
            for (; i2 !== len && (elem = elems[i2]) != null; i2++) {
              if (byElement && elem) {
                j = 0;
                if (!context && elem.ownerDocument != document3) {
                  setDocument(elem);
                  xml = !documentIsHTML;
                }
                while (matcher = elementMatchers[j++]) {
                  if (matcher(elem, context || document3, xml)) {
                    push2.call(results, elem);
                    break;
                  }
                }
                if (outermost) {
                  dirruns = dirrunsUnique;
                }
              }
              if (bySet) {
                if (elem = !matcher && elem) {
                  matchedCount--;
                }
                if (seed) {
                  unmatched.push(elem);
                }
              }
            }
            matchedCount += i2;
            if (bySet && i2 !== matchedCount) {
              j = 0;
              while (matcher = setMatchers[j++]) {
                matcher(unmatched, setMatched, context, xml);
              }
              if (seed) {
                if (matchedCount > 0) {
                  while (i2--) {
                    if (!(unmatched[i2] || setMatched[i2])) {
                      setMatched[i2] = pop.call(results);
                    }
                  }
                }
                setMatched = condense(setMatched);
              }
              push2.apply(results, setMatched);
              if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                jQuery.uniqueSort(results);
              }
            }
            if (outermost) {
              dirruns = dirrunsUnique;
              outermostContext = contextBackup;
            }
            return unmatched;
          };
          return bySet ? markFunction(superMatcher) : superMatcher;
        }
        function compile(selector, match) {
          var i2, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
          if (!cached) {
            if (!match) {
              match = tokenize(selector);
            }
            i2 = match.length;
            while (i2--) {
              cached = matcherFromTokens(match[i2]);
              if (cached[expando]) {
                setMatchers.push(cached);
              } else {
                elementMatchers.push(cached);
              }
            }
            cached = compilerCache(
              selector,
              matcherFromGroupMatchers(elementMatchers, setMatchers)
            );
            cached.selector = selector;
          }
          return cached;
        }
        function select(selector, context, results, seed) {
          var i2, tokens, token, type, find2, compiled = typeof selector === "function" && selector, match = !seed && tokenize(selector = compiled.selector || selector);
          results = results || [];
          if (match.length === 1) {
            tokens = match[0] = match[0].slice(0);
            if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
              context = (Expr.find.ID(
                token.matches[0].replace(runescape, funescape),
                context
              ) || [])[0];
              if (!context) {
                return results;
              } else if (compiled) {
                context = context.parentNode;
              }
              selector = selector.slice(tokens.shift().value.length);
            }
            i2 = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
            while (i2--) {
              token = tokens[i2];
              if (Expr.relative[type = token.type]) {
                break;
              }
              if (find2 = Expr.find[type]) {
                if (seed = find2(
                  token.matches[0].replace(runescape, funescape),
                  rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
                )) {
                  tokens.splice(i2, 1);
                  selector = seed.length && toSelector(tokens);
                  if (!selector) {
                    push2.apply(results, seed);
                    return results;
                  }
                  break;
                }
              }
            }
          }
          (compiled || compile(selector, match))(
            seed,
            context,
            !documentIsHTML,
            results,
            !context || rsibling.test(selector) && testContext(context.parentNode) || context
          );
          return results;
        }
        support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
        setDocument();
        support.sortDetached = assert(function(el) {
          return el.compareDocumentPosition(document3.createElement("fieldset")) & 1;
        });
        jQuery.find = find;
        jQuery.expr[":"] = jQuery.expr.pseudos;
        jQuery.unique = jQuery.uniqueSort;
        find.compile = compile;
        find.select = select;
        find.setDocument = setDocument;
        find.tokenize = tokenize;
        find.escape = jQuery.escapeSelector;
        find.getText = jQuery.text;
        find.isXML = jQuery.isXMLDoc;
        find.selectors = jQuery.expr;
        find.support = jQuery.support;
        find.uniqueSort = jQuery.uniqueSort;
      })();
      var dir = function(elem, dir2, until) {
        var matched = [], truncate = until !== void 0;
        while ((elem = elem[dir2]) && elem.nodeType !== 9) {
          if (elem.nodeType === 1) {
            if (truncate && jQuery(elem).is(until)) {
              break;
            }
            matched.push(elem);
          }
        }
        return matched;
      };
      var siblings = function(n, elem) {
        var matched = [];
        for (; n; n = n.nextSibling) {
          if (n.nodeType === 1 && n !== elem) {
            matched.push(n);
          }
        }
        return matched;
      };
      var rneedsContext = jQuery.expr.match.needsContext;
      var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
      function winnow(elements, qualifier, not) {
        if (isFunction(qualifier)) {
          return jQuery.grep(elements, function(elem, i) {
            return !!qualifier.call(elem, i, elem) !== not;
          });
        }
        if (qualifier.nodeType) {
          return jQuery.grep(elements, function(elem) {
            return elem === qualifier !== not;
          });
        }
        if (typeof qualifier !== "string") {
          return jQuery.grep(elements, function(elem) {
            return indexOf.call(qualifier, elem) > -1 !== not;
          });
        }
        return jQuery.filter(qualifier, elements, not);
      }
      jQuery.filter = function(expr, elems, not) {
        var elem = elems[0];
        if (not) {
          expr = ":not(" + expr + ")";
        }
        if (elems.length === 1 && elem.nodeType === 1) {
          return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
        }
        return jQuery.find.matches(expr, jQuery.grep(elems, function(elem2) {
          return elem2.nodeType === 1;
        }));
      };
      jQuery.fn.extend({
        find: function(selector) {
          var i, ret, len = this.length, self = this;
          if (typeof selector !== "string") {
            return this.pushStack(jQuery(selector).filter(function() {
              for (i = 0; i < len; i++) {
                if (jQuery.contains(self[i], this)) {
                  return true;
                }
              }
            }));
          }
          ret = this.pushStack([]);
          for (i = 0; i < len; i++) {
            jQuery.find(selector, self[i], ret);
          }
          return len > 1 ? jQuery.uniqueSort(ret) : ret;
        },
        filter: function(selector) {
          return this.pushStack(winnow(this, selector || [], false));
        },
        not: function(selector) {
          return this.pushStack(winnow(this, selector || [], true));
        },
        is: function(selector) {
          return !!winnow(
            this,
            // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [],
            false
          ).length;
        }
      });
      var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, init = jQuery.fn.init = function(selector, context, root) {
        var match, elem;
        if (!selector) {
          return this;
        }
        root = root || rootjQuery;
        if (typeof selector === "string") {
          if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
            match = [null, selector, null];
          } else {
            match = rquickExpr.exec(selector);
          }
          if (match && (match[1] || !context)) {
            if (match[1]) {
              context = context instanceof jQuery ? context[0] : context;
              jQuery.merge(this, jQuery.parseHTML(
                match[1],
                context && context.nodeType ? context.ownerDocument || context : document2,
                true
              ));
              if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                for (match in context) {
                  if (isFunction(this[match])) {
                    this[match](context[match]);
                  } else {
                    this.attr(match, context[match]);
                  }
                }
              }
              return this;
            } else {
              elem = document2.getElementById(match[2]);
              if (elem) {
                this[0] = elem;
                this.length = 1;
              }
              return this;
            }
          } else if (!context || context.jquery) {
            return (context || root).find(selector);
          } else {
            return this.constructor(context).find(selector);
          }
        } else if (selector.nodeType) {
          this[0] = selector;
          this.length = 1;
          return this;
        } else if (isFunction(selector)) {
          return root.ready !== void 0 ? root.ready(selector) : (
            // Execute immediately if ready is not present
            selector(jQuery)
          );
        }
        return jQuery.makeArray(selector, this);
      };
      init.prototype = jQuery.fn;
      rootjQuery = jQuery(document2);
      var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
      };
      jQuery.fn.extend({
        has: function(target) {
          var targets = jQuery(target, this), l = targets.length;
          return this.filter(function() {
            var i = 0;
            for (; i < l; i++) {
              if (jQuery.contains(this, targets[i])) {
                return true;
              }
            }
          });
        },
        closest: function(selectors, context) {
          var cur, i = 0, l = this.length, matched = [], targets = typeof selectors !== "string" && jQuery(selectors);
          if (!rneedsContext.test(selectors)) {
            for (; i < l; i++) {
              for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
                if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : (
                  // Don't pass non-elements to jQuery#find
                  cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors)
                ))) {
                  matched.push(cur);
                  break;
                }
              }
            }
          }
          return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
        },
        // Determine the position of an element within the set
        index: function(elem) {
          if (!elem) {
            return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
          }
          if (typeof elem === "string") {
            return indexOf.call(jQuery(elem), this[0]);
          }
          return indexOf.call(
            this,
            // If it receives a jQuery object, the first element is used
            elem.jquery ? elem[0] : elem
          );
        },
        add: function(selector, context) {
          return this.pushStack(
            jQuery.uniqueSort(
              jQuery.merge(this.get(), jQuery(selector, context))
            )
          );
        },
        addBack: function(selector) {
          return this.add(
            selector == null ? this.prevObject : this.prevObject.filter(selector)
          );
        }
      });
      function sibling(cur, dir2) {
        while ((cur = cur[dir2]) && cur.nodeType !== 1) {
        }
        return cur;
      }
      jQuery.each({
        parent: function(elem) {
          var parent = elem.parentNode;
          return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function(elem) {
          return dir(elem, "parentNode");
        },
        parentsUntil: function(elem, _i, until) {
          return dir(elem, "parentNode", until);
        },
        next: function(elem) {
          return sibling(elem, "nextSibling");
        },
        prev: function(elem) {
          return sibling(elem, "previousSibling");
        },
        nextAll: function(elem) {
          return dir(elem, "nextSibling");
        },
        prevAll: function(elem) {
          return dir(elem, "previousSibling");
        },
        nextUntil: function(elem, _i, until) {
          return dir(elem, "nextSibling", until);
        },
        prevUntil: function(elem, _i, until) {
          return dir(elem, "previousSibling", until);
        },
        siblings: function(elem) {
          return siblings((elem.parentNode || {}).firstChild, elem);
        },
        children: function(elem) {
          return siblings(elem.firstChild);
        },
        contents: function(elem) {
          if (elem.contentDocument != null && // Support: IE 11+
          // <object> elements with no `data` attribute has an object
          // `contentDocument` with a `null` prototype.
          getProto(elem.contentDocument)) {
            return elem.contentDocument;
          }
          if (nodeName(elem, "template")) {
            elem = elem.content || elem;
          }
          return jQuery.merge([], elem.childNodes);
        }
      }, function(name, fn) {
        jQuery.fn[name] = function(until, selector) {
          var matched = jQuery.map(this, fn, until);
          if (name.slice(-5) !== "Until") {
            selector = until;
          }
          if (selector && typeof selector === "string") {
            matched = jQuery.filter(selector, matched);
          }
          if (this.length > 1) {
            if (!guaranteedUnique[name]) {
              jQuery.uniqueSort(matched);
            }
            if (rparentsprev.test(name)) {
              matched.reverse();
            }
          }
          return this.pushStack(matched);
        };
      });
      var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
      function createOptions(options) {
        var object = {};
        jQuery.each(options.match(rnothtmlwhite) || [], function(_, flag) {
          object[flag] = true;
        });
        return object;
      }
      jQuery.Callbacks = function(options) {
        options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);
        var firing, memory, fired, locked, list = [], queue = [], firingIndex = -1, fire = function() {
          locked = locked || options.once;
          fired = firing = true;
          for (; queue.length; firingIndex = -1) {
            memory = queue.shift();
            while (++firingIndex < list.length) {
              if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
                firingIndex = list.length;
                memory = false;
              }
            }
          }
          if (!options.memory) {
            memory = false;
          }
          firing = false;
          if (locked) {
            if (memory) {
              list = [];
            } else {
              list = "";
            }
          }
        }, self = {
          // Add a callback or a collection of callbacks to the list
          add: function() {
            if (list) {
              if (memory && !firing) {
                firingIndex = list.length - 1;
                queue.push(memory);
              }
              (function add(args) {
                jQuery.each(args, function(_, arg) {
                  if (isFunction(arg)) {
                    if (!options.unique || !self.has(arg)) {
                      list.push(arg);
                    }
                  } else if (arg && arg.length && toType(arg) !== "string") {
                    add(arg);
                  }
                });
              })(arguments);
              if (memory && !firing) {
                fire();
              }
            }
            return this;
          },
          // Remove a callback from the list
          remove: function() {
            jQuery.each(arguments, function(_, arg) {
              var index;
              while ((index = jQuery.inArray(arg, list, index)) > -1) {
                list.splice(index, 1);
                if (index <= firingIndex) {
                  firingIndex--;
                }
              }
            });
            return this;
          },
          // Check if a given callback is in the list.
          // If no argument is given, return whether or not list has callbacks attached.
          has: function(fn) {
            return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
          },
          // Remove all callbacks from the list
          empty: function() {
            if (list) {
              list = [];
            }
            return this;
          },
          // Disable .fire and .add
          // Abort any current/pending executions
          // Clear all callbacks and values
          disable: function() {
            locked = queue = [];
            list = memory = "";
            return this;
          },
          disabled: function() {
            return !list;
          },
          // Disable .fire
          // Also disable .add unless we have memory (since it would have no effect)
          // Abort any pending executions
          lock: function() {
            locked = queue = [];
            if (!memory && !firing) {
              list = memory = "";
            }
            return this;
          },
          locked: function() {
            return !!locked;
          },
          // Call all callbacks with the given context and arguments
          fireWith: function(context, args) {
            if (!locked) {
              args = args || [];
              args = [context, args.slice ? args.slice() : args];
              queue.push(args);
              if (!firing) {
                fire();
              }
            }
            return this;
          },
          // Call all the callbacks with the given arguments
          fire: function() {
            self.fireWith(this, arguments);
            return this;
          },
          // To know if the callbacks have already been called at least once
          fired: function() {
            return !!fired;
          }
        };
        return self;
      };
      function Identity(v) {
        return v;
      }
      function Thrower(ex) {
        throw ex;
      }
      function adoptValue(value, resolve, reject, noValue) {
        var method;
        try {
          if (value && isFunction(method = value.promise)) {
            method.call(value).done(resolve).fail(reject);
          } else if (value && isFunction(method = value.then)) {
            method.call(value, resolve, reject);
          } else {
            resolve.apply(void 0, [value].slice(noValue));
          }
        } catch (value2) {
          reject.apply(void 0, [value2]);
        }
      }
      jQuery.extend({
        Deferred: function(func) {
          var tuples = [
            // action, add listener, callbacks,
            // ... .then handlers, argument index, [final state]
            [
              "notify",
              "progress",
              jQuery.Callbacks("memory"),
              jQuery.Callbacks("memory"),
              2
            ],
            [
              "resolve",
              "done",
              jQuery.Callbacks("once memory"),
              jQuery.Callbacks("once memory"),
              0,
              "resolved"
            ],
            [
              "reject",
              "fail",
              jQuery.Callbacks("once memory"),
              jQuery.Callbacks("once memory"),
              1,
              "rejected"
            ]
          ], state = "pending", promise = {
            state: function() {
              return state;
            },
            always: function() {
              deferred.done(arguments).fail(arguments);
              return this;
            },
            "catch": function(fn) {
              return promise.then(null, fn);
            },
            // Keep pipe for back-compat
            pipe: function() {
              var fns = arguments;
              return jQuery.Deferred(function(newDefer) {
                jQuery.each(tuples, function(_i, tuple) {
                  var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];
                  deferred[tuple[1]](function() {
                    var returned = fn && fn.apply(this, arguments);
                    if (returned && isFunction(returned.promise)) {
                      returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                    } else {
                      newDefer[tuple[0] + "With"](
                        this,
                        fn ? [returned] : arguments
                      );
                    }
                  });
                });
                fns = null;
              }).promise();
            },
            then: function(onFulfilled, onRejected, onProgress) {
              var maxDepth = 0;
              function resolve(depth, deferred2, handler, special) {
                return function() {
                  var that = this, args = arguments, mightThrow = function() {
                    var returned, then;
                    if (depth < maxDepth) {
                      return;
                    }
                    returned = handler.apply(that, args);
                    if (returned === deferred2.promise()) {
                      throw new TypeError("Thenable self-resolution");
                    }
                    then = returned && // Support: Promises/A+ section 2.3.4
                    // https://promisesaplus.com/#point-64
                    // Only check objects and functions for thenability
                    (typeof returned === "object" || typeof returned === "function") && returned.then;
                    if (isFunction(then)) {
                      if (special) {
                        then.call(
                          returned,
                          resolve(maxDepth, deferred2, Identity, special),
                          resolve(maxDepth, deferred2, Thrower, special)
                        );
                      } else {
                        maxDepth++;
                        then.call(
                          returned,
                          resolve(maxDepth, deferred2, Identity, special),
                          resolve(maxDepth, deferred2, Thrower, special),
                          resolve(
                            maxDepth,
                            deferred2,
                            Identity,
                            deferred2.notifyWith
                          )
                        );
                      }
                    } else {
                      if (handler !== Identity) {
                        that = void 0;
                        args = [returned];
                      }
                      (special || deferred2.resolveWith)(that, args);
                    }
                  }, process = special ? mightThrow : function() {
                    try {
                      mightThrow();
                    } catch (e) {
                      if (jQuery.Deferred.exceptionHook) {
                        jQuery.Deferred.exceptionHook(
                          e,
                          process.error
                        );
                      }
                      if (depth + 1 >= maxDepth) {
                        if (handler !== Thrower) {
                          that = void 0;
                          args = [e];
                        }
                        deferred2.rejectWith(that, args);
                      }
                    }
                  };
                  if (depth) {
                    process();
                  } else {
                    if (jQuery.Deferred.getErrorHook) {
                      process.error = jQuery.Deferred.getErrorHook();
                    } else if (jQuery.Deferred.getStackHook) {
                      process.error = jQuery.Deferred.getStackHook();
                    }
                    window2.setTimeout(process);
                  }
                };
              }
              return jQuery.Deferred(function(newDefer) {
                tuples[0][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onProgress) ? onProgress : Identity,
                    newDefer.notifyWith
                  )
                );
                tuples[1][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onFulfilled) ? onFulfilled : Identity
                  )
                );
                tuples[2][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onRejected) ? onRejected : Thrower
                  )
                );
              }).promise();
            },
            // Get a promise for this deferred
            // If obj is provided, the promise aspect is added to the object
            promise: function(obj) {
              return obj != null ? jQuery.extend(obj, promise) : promise;
            }
          }, deferred = {};
          jQuery.each(tuples, function(i, tuple) {
            var list = tuple[2], stateString = tuple[5];
            promise[tuple[1]] = list.add;
            if (stateString) {
              list.add(
                function() {
                  state = stateString;
                },
                // rejected_callbacks.disable
                // fulfilled_callbacks.disable
                tuples[3 - i][2].disable,
                // rejected_handlers.disable
                // fulfilled_handlers.disable
                tuples[3 - i][3].disable,
                // progress_callbacks.lock
                tuples[0][2].lock,
                // progress_handlers.lock
                tuples[0][3].lock
              );
            }
            list.add(tuple[3].fire);
            deferred[tuple[0]] = function() {
              deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments);
              return this;
            };
            deferred[tuple[0] + "With"] = list.fireWith;
          });
          promise.promise(deferred);
          if (func) {
            func.call(deferred, deferred);
          }
          return deferred;
        },
        // Deferred helper
        when: function(singleValue) {
          var remaining = arguments.length, i = remaining, resolveContexts = Array(i), resolveValues = slice.call(arguments), primary = jQuery.Deferred(), updateFunc = function(i2) {
            return function(value) {
              resolveContexts[i2] = this;
              resolveValues[i2] = arguments.length > 1 ? slice.call(arguments) : value;
              if (!--remaining) {
                primary.resolveWith(resolveContexts, resolveValues);
              }
            };
          };
          if (remaining <= 1) {
            adoptValue(
              singleValue,
              primary.done(updateFunc(i)).resolve,
              primary.reject,
              !remaining
            );
            if (primary.state() === "pending" || isFunction(resolveValues[i] && resolveValues[i].then)) {
              return primary.then();
            }
          }
          while (i--) {
            adoptValue(resolveValues[i], updateFunc(i), primary.reject);
          }
          return primary.promise();
        }
      });
      var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
      jQuery.Deferred.exceptionHook = function(error, asyncError) {
        if (window2.console && window2.console.warn && error && rerrorNames.test(error.name)) {
          window2.console.warn(
            "jQuery.Deferred exception: " + error.message,
            error.stack,
            asyncError
          );
        }
      };
      jQuery.readyException = function(error) {
        window2.setTimeout(function() {
          throw error;
        });
      };
      var readyList = jQuery.Deferred();
      jQuery.fn.ready = function(fn) {
        readyList.then(fn).catch(function(error) {
          jQuery.readyException(error);
        });
        return this;
      };
      jQuery.extend({
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,
        // A counter to track how many items to wait for before
        // the ready event fires. See trac-6781
        readyWait: 1,
        // Handle when the DOM is ready
        ready: function(wait) {
          if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
            return;
          }
          jQuery.isReady = true;
          if (wait !== true && --jQuery.readyWait > 0) {
            return;
          }
          readyList.resolveWith(document2, [jQuery]);
        }
      });
      jQuery.ready.then = readyList.then;
      function completed() {
        document2.removeEventListener("DOMContentLoaded", completed);
        window2.removeEventListener("load", completed);
        jQuery.ready();
      }
      if (document2.readyState === "complete" || document2.readyState !== "loading" && !document2.documentElement.doScroll) {
        window2.setTimeout(jQuery.ready);
      } else {
        document2.addEventListener("DOMContentLoaded", completed);
        window2.addEventListener("load", completed);
      }
      var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
        var i = 0, len = elems.length, bulk = key == null;
        if (toType(key) === "object") {
          chainable = true;
          for (i in key) {
            access(elems, fn, i, key[i], true, emptyGet, raw);
          }
        } else if (value !== void 0) {
          chainable = true;
          if (!isFunction(value)) {
            raw = true;
          }
          if (bulk) {
            if (raw) {
              fn.call(elems, value);
              fn = null;
            } else {
              bulk = fn;
              fn = function(elem, _key, value2) {
                return bulk.call(jQuery(elem), value2);
              };
            }
          }
          if (fn) {
            for (; i < len; i++) {
              fn(
                elems[i],
                key,
                raw ? value : value.call(elems[i], i, fn(elems[i], key))
              );
            }
          }
        }
        if (chainable) {
          return elems;
        }
        if (bulk) {
          return fn.call(elems);
        }
        return len ? fn(elems[0], key) : emptyGet;
      };
      var rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
      function fcamelCase(_all, letter) {
        return letter.toUpperCase();
      }
      function camelCase(string) {
        return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
      }
      var acceptData = function(owner) {
        return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
      };
      function Data() {
        this.expando = jQuery.expando + Data.uid++;
      }
      Data.uid = 1;
      Data.prototype = {
        cache: function(owner) {
          var value = owner[this.expando];
          if (!value) {
            value = {};
            if (acceptData(owner)) {
              if (owner.nodeType) {
                owner[this.expando] = value;
              } else {
                Object.defineProperty(owner, this.expando, {
                  value,
                  configurable: true
                });
              }
            }
          }
          return value;
        },
        set: function(owner, data, value) {
          var prop, cache = this.cache(owner);
          if (typeof data === "string") {
            cache[camelCase(data)] = value;
          } else {
            for (prop in data) {
              cache[camelCase(prop)] = data[prop];
            }
          }
          return cache;
        },
        get: function(owner, key) {
          return key === void 0 ? this.cache(owner) : (
            // Always use camelCase key (gh-2257)
            owner[this.expando] && owner[this.expando][camelCase(key)]
          );
        },
        access: function(owner, key, value) {
          if (key === void 0 || key && typeof key === "string" && value === void 0) {
            return this.get(owner, key);
          }
          this.set(owner, key, value);
          return value !== void 0 ? value : key;
        },
        remove: function(owner, key) {
          var i, cache = owner[this.expando];
          if (cache === void 0) {
            return;
          }
          if (key !== void 0) {
            if (Array.isArray(key)) {
              key = key.map(camelCase);
            } else {
              key = camelCase(key);
              key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
            }
            i = key.length;
            while (i--) {
              delete cache[key[i]];
            }
          }
          if (key === void 0 || jQuery.isEmptyObject(cache)) {
            if (owner.nodeType) {
              owner[this.expando] = void 0;
            } else {
              delete owner[this.expando];
            }
          }
        },
        hasData: function(owner) {
          var cache = owner[this.expando];
          return cache !== void 0 && !jQuery.isEmptyObject(cache);
        }
      };
      var dataPriv = new Data();
      var dataUser = new Data();
      var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
      function getData(data) {
        if (data === "true") {
          return true;
        }
        if (data === "false") {
          return false;
        }
        if (data === "null") {
          return null;
        }
        if (data === +data + "") {
          return +data;
        }
        if (rbrace.test(data)) {
          return JSON.parse(data);
        }
        return data;
      }
      function dataAttr(elem, key, data) {
        var name;
        if (data === void 0 && elem.nodeType === 1) {
          name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
          data = elem.getAttribute(name);
          if (typeof data === "string") {
            try {
              data = getData(data);
            } catch (e) {
            }
            dataUser.set(elem, key, data);
          } else {
            data = void 0;
          }
        }
        return data;
      }
      jQuery.extend({
        hasData: function(elem) {
          return dataUser.hasData(elem) || dataPriv.hasData(elem);
        },
        data: function(elem, name, data) {
          return dataUser.access(elem, name, data);
        },
        removeData: function(elem, name) {
          dataUser.remove(elem, name);
        },
        // TODO: Now that all calls to _data and _removeData have been replaced
        // with direct calls to dataPriv methods, these can be deprecated.
        _data: function(elem, name, data) {
          return dataPriv.access(elem, name, data);
        },
        _removeData: function(elem, name) {
          dataPriv.remove(elem, name);
        }
      });
      jQuery.fn.extend({
        data: function(key, value) {
          var i, name, data, elem = this[0], attrs = elem && elem.attributes;
          if (key === void 0) {
            if (this.length) {
              data = dataUser.get(elem);
              if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
                i = attrs.length;
                while (i--) {
                  if (attrs[i]) {
                    name = attrs[i].name;
                    if (name.indexOf("data-") === 0) {
                      name = camelCase(name.slice(5));
                      dataAttr(elem, name, data[name]);
                    }
                  }
                }
                dataPriv.set(elem, "hasDataAttrs", true);
              }
            }
            return data;
          }
          if (typeof key === "object") {
            return this.each(function() {
              dataUser.set(this, key);
            });
          }
          return access(this, function(value2) {
            var data2;
            if (elem && value2 === void 0) {
              data2 = dataUser.get(elem, key);
              if (data2 !== void 0) {
                return data2;
              }
              data2 = dataAttr(elem, key);
              if (data2 !== void 0) {
                return data2;
              }
              return;
            }
            this.each(function() {
              dataUser.set(this, key, value2);
            });
          }, null, value, arguments.length > 1, null, true);
        },
        removeData: function(key) {
          return this.each(function() {
            dataUser.remove(this, key);
          });
        }
      });
      jQuery.extend({
        queue: function(elem, type, data) {
          var queue;
          if (elem) {
            type = (type || "fx") + "queue";
            queue = dataPriv.get(elem, type);
            if (data) {
              if (!queue || Array.isArray(data)) {
                queue = dataPriv.access(elem, type, jQuery.makeArray(data));
              } else {
                queue.push(data);
              }
            }
            return queue || [];
          }
        },
        dequeue: function(elem, type) {
          type = type || "fx";
          var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function() {
            jQuery.dequeue(elem, type);
          };
          if (fn === "inprogress") {
            fn = queue.shift();
            startLength--;
          }
          if (fn) {
            if (type === "fx") {
              queue.unshift("inprogress");
            }
            delete hooks.stop;
            fn.call(elem, next, hooks);
          }
          if (!startLength && hooks) {
            hooks.empty.fire();
          }
        },
        // Not public - generate a queueHooks object, or return the current one
        _queueHooks: function(elem, type) {
          var key = type + "queueHooks";
          return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
            empty: jQuery.Callbacks("once memory").add(function() {
              dataPriv.remove(elem, [type + "queue", key]);
            })
          });
        }
      });
      jQuery.fn.extend({
        queue: function(type, data) {
          var setter = 2;
          if (typeof type !== "string") {
            data = type;
            type = "fx";
            setter--;
          }
          if (arguments.length < setter) {
            return jQuery.queue(this[0], type);
          }
          return data === void 0 ? this : this.each(function() {
            var queue = jQuery.queue(this, type, data);
            jQuery._queueHooks(this, type);
            if (type === "fx" && queue[0] !== "inprogress") {
              jQuery.dequeue(this, type);
            }
          });
        },
        dequeue: function(type) {
          return this.each(function() {
            jQuery.dequeue(this, type);
          });
        },
        clearQueue: function(type) {
          return this.queue(type || "fx", []);
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function(type, obj) {
          var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function() {
            if (!--count) {
              defer.resolveWith(elements, [elements]);
            }
          };
          if (typeof type !== "string") {
            obj = type;
            type = void 0;
          }
          type = type || "fx";
          while (i--) {
            tmp = dataPriv.get(elements[i], type + "queueHooks");
            if (tmp && tmp.empty) {
              count++;
              tmp.empty.add(resolve);
            }
          }
          resolve();
          return defer.promise(obj);
        }
      });
      var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
      var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
      var cssExpand = ["Top", "Right", "Bottom", "Left"];
      var documentElement = document2.documentElement;
      var isAttached = function(elem) {
        return jQuery.contains(elem.ownerDocument, elem);
      }, composed = { composed: true };
      if (documentElement.getRootNode) {
        isAttached = function(elem) {
          return jQuery.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
        };
      }
      var isHiddenWithinTree = function(elem, el) {
        elem = el || elem;
        return elem.style.display === "none" || elem.style.display === "" && // Otherwise, check computed style
        // Support: Firefox <=43 - 45
        // Disconnected elements can have computed display: none, so first confirm that elem is
        // in the document.
        isAttached(elem) && jQuery.css(elem, "display") === "none";
      };
      function adjustCSS(elem, prop, valueParts, tween) {
        var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
          return tween.cur();
        } : function() {
          return jQuery.css(elem, prop, "");
        }, initial = currentValue(), unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"), initialInUnit = elem.nodeType && (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));
        if (initialInUnit && initialInUnit[3] !== unit) {
          initial = initial / 2;
          unit = unit || initialInUnit[3];
          initialInUnit = +initial || 1;
          while (maxIterations--) {
            jQuery.style(elem, prop, initialInUnit + unit);
            if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
              maxIterations = 0;
            }
            initialInUnit = initialInUnit / scale;
          }
          initialInUnit = initialInUnit * 2;
          jQuery.style(elem, prop, initialInUnit + unit);
          valueParts = valueParts || [];
        }
        if (valueParts) {
          initialInUnit = +initialInUnit || +initial || 0;
          adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
          if (tween) {
            tween.unit = unit;
            tween.start = initialInUnit;
            tween.end = adjusted;
          }
        }
        return adjusted;
      }
      var defaultDisplayMap = {};
      function getDefaultDisplay(elem) {
        var temp, doc = elem.ownerDocument, nodeName2 = elem.nodeName, display = defaultDisplayMap[nodeName2];
        if (display) {
          return display;
        }
        temp = doc.body.appendChild(doc.createElement(nodeName2));
        display = jQuery.css(temp, "display");
        temp.parentNode.removeChild(temp);
        if (display === "none") {
          display = "block";
        }
        defaultDisplayMap[nodeName2] = display;
        return display;
      }
      function showHide(elements, show) {
        var display, elem, values = [], index = 0, length = elements.length;
        for (; index < length; index++) {
          elem = elements[index];
          if (!elem.style) {
            continue;
          }
          display = elem.style.display;
          if (show) {
            if (display === "none") {
              values[index] = dataPriv.get(elem, "display") || null;
              if (!values[index]) {
                elem.style.display = "";
              }
            }
            if (elem.style.display === "" && isHiddenWithinTree(elem)) {
              values[index] = getDefaultDisplay(elem);
            }
          } else {
            if (display !== "none") {
              values[index] = "none";
              dataPriv.set(elem, "display", display);
            }
          }
        }
        for (index = 0; index < length; index++) {
          if (values[index] != null) {
            elements[index].style.display = values[index];
          }
        }
        return elements;
      }
      jQuery.fn.extend({
        show: function() {
          return showHide(this, true);
        },
        hide: function() {
          return showHide(this);
        },
        toggle: function(state) {
          if (typeof state === "boolean") {
            return state ? this.show() : this.hide();
          }
          return this.each(function() {
            if (isHiddenWithinTree(this)) {
              jQuery(this).show();
            } else {
              jQuery(this).hide();
            }
          });
        }
      });
      var rcheckableType = /^(?:checkbox|radio)$/i;
      var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
      var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
      (function() {
        var fragment = document2.createDocumentFragment(), div = fragment.appendChild(document2.createElement("div")), input = document2.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("checked", "checked");
        input.setAttribute("name", "t");
        div.appendChild(input);
        support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
        div.innerHTML = "<textarea>x</textarea>";
        support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
        div.innerHTML = "<option></option>";
        support.option = !!div.lastChild;
      })();
      var wrapMap = {
        // XHTML parsers do not magically insert elements in the
        // same way that tag soup parsers do. So we cannot shorten
        // this by omitting <tbody> or other required elements.
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
      };
      wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
      wrapMap.th = wrapMap.td;
      if (!support.option) {
        wrapMap.optgroup = wrapMap.option = [1, "<select multiple='multiple'>", "</select>"];
      }
      function getAll(context, tag) {
        var ret;
        if (typeof context.getElementsByTagName !== "undefined") {
          ret = context.getElementsByTagName(tag || "*");
        } else if (typeof context.querySelectorAll !== "undefined") {
          ret = context.querySelectorAll(tag || "*");
        } else {
          ret = [];
        }
        if (tag === void 0 || tag && nodeName(context, tag)) {
          return jQuery.merge([context], ret);
        }
        return ret;
      }
      function setGlobalEval(elems, refElements) {
        var i = 0, l = elems.length;
        for (; i < l; i++) {
          dataPriv.set(
            elems[i],
            "globalEval",
            !refElements || dataPriv.get(refElements[i], "globalEval")
          );
        }
      }
      var rhtml = /<|&#?\w+;/;
      function buildFragment(elems, context, scripts, selection, ignored) {
        var elem, tmp, tag, wrap, attached, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length;
        for (; i < l; i++) {
          elem = elems[i];
          if (elem || elem === 0) {
            if (toType(elem) === "object") {
              jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
            } else if (!rhtml.test(elem)) {
              nodes.push(context.createTextNode(elem));
            } else {
              tmp = tmp || fragment.appendChild(context.createElement("div"));
              tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
              wrap = wrapMap[tag] || wrapMap._default;
              tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
              j = wrap[0];
              while (j--) {
                tmp = tmp.lastChild;
              }
              jQuery.merge(nodes, tmp.childNodes);
              tmp = fragment.firstChild;
              tmp.textContent = "";
            }
          }
        }
        fragment.textContent = "";
        i = 0;
        while (elem = nodes[i++]) {
          if (selection && jQuery.inArray(elem, selection) > -1) {
            if (ignored) {
              ignored.push(elem);
            }
            continue;
          }
          attached = isAttached(elem);
          tmp = getAll(fragment.appendChild(elem), "script");
          if (attached) {
            setGlobalEval(tmp);
          }
          if (scripts) {
            j = 0;
            while (elem = tmp[j++]) {
              if (rscriptType.test(elem.type || "")) {
                scripts.push(elem);
              }
            }
          }
        }
        return fragment;
      }
      var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
      function returnTrue() {
        return true;
      }
      function returnFalse() {
        return false;
      }
      function on(elem, types, selector, data, fn, one) {
        var origFn, type;
        if (typeof types === "object") {
          if (typeof selector !== "string") {
            data = data || selector;
            selector = void 0;
          }
          for (type in types) {
            on(elem, type, selector, data, types[type], one);
          }
          return elem;
        }
        if (data == null && fn == null) {
          fn = selector;
          data = selector = void 0;
        } else if (fn == null) {
          if (typeof selector === "string") {
            fn = data;
            data = void 0;
          } else {
            fn = data;
            data = selector;
            selector = void 0;
          }
        }
        if (fn === false) {
          fn = returnFalse;
        } else if (!fn) {
          return elem;
        }
        if (one === 1) {
          origFn = fn;
          fn = function(event) {
            jQuery().off(event);
            return origFn.apply(this, arguments);
          };
          fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
        }
        return elem.each(function() {
          jQuery.event.add(this, types, fn, data, selector);
        });
      }
      jQuery.event = {
        global: {},
        add: function(elem, types, handler, data, selector) {
          var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
          if (!acceptData(elem)) {
            return;
          }
          if (handler.handler) {
            handleObjIn = handler;
            handler = handleObjIn.handler;
            selector = handleObjIn.selector;
          }
          if (selector) {
            jQuery.find.matchesSelector(documentElement, selector);
          }
          if (!handler.guid) {
            handler.guid = jQuery.guid++;
          }
          if (!(events = elemData.events)) {
            events = elemData.events = /* @__PURE__ */ Object.create(null);
          }
          if (!(eventHandle = elemData.handle)) {
            eventHandle = elemData.handle = function(e) {
              return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
            };
          }
          types = (types || "").match(rnothtmlwhite) || [""];
          t = types.length;
          while (t--) {
            tmp = rtypenamespace.exec(types[t]) || [];
            type = origType = tmp[1];
            namespaces = (tmp[2] || "").split(".").sort();
            if (!type) {
              continue;
            }
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            special = jQuery.event.special[type] || {};
            handleObj = jQuery.extend({
              type,
              origType,
              data,
              handler,
              guid: handler.guid,
              selector,
              needsContext: selector && jQuery.expr.match.needsContext.test(selector),
              namespace: namespaces.join(".")
            }, handleObjIn);
            if (!(handlers = events[type])) {
              handlers = events[type] = [];
              handlers.delegateCount = 0;
              if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                if (elem.addEventListener) {
                  elem.addEventListener(type, eventHandle);
                }
              }
            }
            if (special.add) {
              special.add.call(elem, handleObj);
              if (!handleObj.handler.guid) {
                handleObj.handler.guid = handler.guid;
              }
            }
            if (selector) {
              handlers.splice(handlers.delegateCount++, 0, handleObj);
            } else {
              handlers.push(handleObj);
            }
            jQuery.event.global[type] = true;
          }
        },
        // Detach an event or set of events from an element
        remove: function(elem, types, handler, selector, mappedTypes) {
          var j, origCount, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
          if (!elemData || !(events = elemData.events)) {
            return;
          }
          types = (types || "").match(rnothtmlwhite) || [""];
          t = types.length;
          while (t--) {
            tmp = rtypenamespace.exec(types[t]) || [];
            type = origType = tmp[1];
            namespaces = (tmp[2] || "").split(".").sort();
            if (!type) {
              for (type in events) {
                jQuery.event.remove(elem, type + types[t], handler, selector, true);
              }
              continue;
            }
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            handlers = events[type] || [];
            tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
            origCount = j = handlers.length;
            while (j--) {
              handleObj = handlers[j];
              if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                handlers.splice(j, 1);
                if (handleObj.selector) {
                  handlers.delegateCount--;
                }
                if (special.remove) {
                  special.remove.call(elem, handleObj);
                }
              }
            }
            if (origCount && !handlers.length) {
              if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                jQuery.removeEvent(elem, type, elemData.handle);
              }
              delete events[type];
            }
          }
          if (jQuery.isEmptyObject(events)) {
            dataPriv.remove(elem, "handle events");
          }
        },
        dispatch: function(nativeEvent) {
          var i, j, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || /* @__PURE__ */ Object.create(null))[event.type] || [], special = jQuery.event.special[event.type] || {};
          args[0] = event;
          for (i = 1; i < arguments.length; i++) {
            args[i] = arguments[i];
          }
          event.delegateTarget = this;
          if (special.preDispatch && special.preDispatch.call(this, event) === false) {
            return;
          }
          handlerQueue = jQuery.event.handlers.call(this, event, handlers);
          i = 0;
          while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
            event.currentTarget = matched.elem;
            j = 0;
            while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
              if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
                event.handleObj = handleObj;
                event.data = handleObj.data;
                ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                if (ret !== void 0) {
                  if ((event.result = ret) === false) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }
              }
            }
          }
          if (special.postDispatch) {
            special.postDispatch.call(this, event);
          }
          return event.result;
        },
        handlers: function(event, handlers) {
          var i, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
          if (delegateCount && // Support: IE <=9
          // Black-hole SVG <use> instance trees (trac-13180)
          cur.nodeType && // Support: Firefox <=42
          // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
          // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
          // Support: IE 11 only
          // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
          !(event.type === "click" && event.button >= 1)) {
            for (; cur !== this; cur = cur.parentNode || this) {
              if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
                matchedHandlers = [];
                matchedSelectors = {};
                for (i = 0; i < delegateCount; i++) {
                  handleObj = handlers[i];
                  sel = handleObj.selector + " ";
                  if (matchedSelectors[sel] === void 0) {
                    matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
                  }
                  if (matchedSelectors[sel]) {
                    matchedHandlers.push(handleObj);
                  }
                }
                if (matchedHandlers.length) {
                  handlerQueue.push({ elem: cur, handlers: matchedHandlers });
                }
              }
            }
          }
          cur = this;
          if (delegateCount < handlers.length) {
            handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
          }
          return handlerQueue;
        },
        addProp: function(name, hook) {
          Object.defineProperty(jQuery.Event.prototype, name, {
            enumerable: true,
            configurable: true,
            get: isFunction(hook) ? function() {
              if (this.originalEvent) {
                return hook(this.originalEvent);
              }
            } : function() {
              if (this.originalEvent) {
                return this.originalEvent[name];
              }
            },
            set: function(value) {
              Object.defineProperty(this, name, {
                enumerable: true,
                configurable: true,
                writable: true,
                value
              });
            }
          });
        },
        fix: function(originalEvent) {
          return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
        },
        special: {
          load: {
            // Prevent triggered image.load events from bubbling to window.load
            noBubble: true
          },
          click: {
            // Utilize native event to ensure correct state for checkable inputs
            setup: function(data) {
              var el = this || data;
              if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                leverageNative(el, "click", true);
              }
              return false;
            },
            trigger: function(data) {
              var el = this || data;
              if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                leverageNative(el, "click");
              }
              return true;
            },
            // For cross-browser consistency, suppress native .click() on links
            // Also prevent it if we're currently inside a leveraged native-event stack
            _default: function(event) {
              var target = event.target;
              return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
            }
          },
          beforeunload: {
            postDispatch: function(event) {
              if (event.result !== void 0 && event.originalEvent) {
                event.originalEvent.returnValue = event.result;
              }
            }
          }
        }
      };
      function leverageNative(el, type, isSetup) {
        if (!isSetup) {
          if (dataPriv.get(el, type) === void 0) {
            jQuery.event.add(el, type, returnTrue);
          }
          return;
        }
        dataPriv.set(el, type, false);
        jQuery.event.add(el, type, {
          namespace: false,
          handler: function(event) {
            var result, saved = dataPriv.get(this, type);
            if (event.isTrigger & 1 && this[type]) {
              if (!saved) {
                saved = slice.call(arguments);
                dataPriv.set(this, type, saved);
                this[type]();
                result = dataPriv.get(this, type);
                dataPriv.set(this, type, false);
                if (saved !== result) {
                  event.stopImmediatePropagation();
                  event.preventDefault();
                  return result;
                }
              } else if ((jQuery.event.special[type] || {}).delegateType) {
                event.stopPropagation();
              }
            } else if (saved) {
              dataPriv.set(this, type, jQuery.event.trigger(
                saved[0],
                saved.slice(1),
                this
              ));
              event.stopPropagation();
              event.isImmediatePropagationStopped = returnTrue;
            }
          }
        });
      }
      jQuery.removeEvent = function(elem, type, handle) {
        if (elem.removeEventListener) {
          elem.removeEventListener(type, handle);
        }
      };
      jQuery.Event = function(src, props) {
        if (!(this instanceof jQuery.Event)) {
          return new jQuery.Event(src, props);
        }
        if (src && src.type) {
          this.originalEvent = src;
          this.type = src.type;
          this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === void 0 && // Support: Android <=2.3 only
          src.returnValue === false ? returnTrue : returnFalse;
          this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
          this.currentTarget = src.currentTarget;
          this.relatedTarget = src.relatedTarget;
        } else {
          this.type = src;
        }
        if (props) {
          jQuery.extend(this, props);
        }
        this.timeStamp = src && src.timeStamp || Date.now();
        this[jQuery.expando] = true;
      };
      jQuery.Event.prototype = {
        constructor: jQuery.Event,
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        isSimulated: false,
        preventDefault: function() {
          var e = this.originalEvent;
          this.isDefaultPrevented = returnTrue;
          if (e && !this.isSimulated) {
            e.preventDefault();
          }
        },
        stopPropagation: function() {
          var e = this.originalEvent;
          this.isPropagationStopped = returnTrue;
          if (e && !this.isSimulated) {
            e.stopPropagation();
          }
        },
        stopImmediatePropagation: function() {
          var e = this.originalEvent;
          this.isImmediatePropagationStopped = returnTrue;
          if (e && !this.isSimulated) {
            e.stopImmediatePropagation();
          }
          this.stopPropagation();
        }
      };
      jQuery.each({
        altKey: true,
        bubbles: true,
        cancelable: true,
        changedTouches: true,
        ctrlKey: true,
        detail: true,
        eventPhase: true,
        metaKey: true,
        pageX: true,
        pageY: true,
        shiftKey: true,
        view: true,
        "char": true,
        code: true,
        charCode: true,
        key: true,
        keyCode: true,
        button: true,
        buttons: true,
        clientX: true,
        clientY: true,
        offsetX: true,
        offsetY: true,
        pointerId: true,
        pointerType: true,
        screenX: true,
        screenY: true,
        targetTouches: true,
        toElement: true,
        touches: true,
        which: true
      }, jQuery.event.addProp);
      jQuery.each({ focus: "focusin", blur: "focusout" }, function(type, delegateType) {
        function focusMappedHandler(nativeEvent) {
          if (document2.documentMode) {
            var handle = dataPriv.get(this, "handle"), event = jQuery.event.fix(nativeEvent);
            event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
            event.isSimulated = true;
            handle(nativeEvent);
            if (event.target === event.currentTarget) {
              handle(event);
            }
          } else {
            jQuery.event.simulate(
              delegateType,
              nativeEvent.target,
              jQuery.event.fix(nativeEvent)
            );
          }
        }
        jQuery.event.special[type] = {
          // Utilize native event if possible so blur/focus sequence is correct
          setup: function() {
            var attaches;
            leverageNative(this, type, true);
            if (document2.documentMode) {
              attaches = dataPriv.get(this, delegateType);
              if (!attaches) {
                this.addEventListener(delegateType, focusMappedHandler);
              }
              dataPriv.set(this, delegateType, (attaches || 0) + 1);
            } else {
              return false;
            }
          },
          trigger: function() {
            leverageNative(this, type);
            return true;
          },
          teardown: function() {
            var attaches;
            if (document2.documentMode) {
              attaches = dataPriv.get(this, delegateType) - 1;
              if (!attaches) {
                this.removeEventListener(delegateType, focusMappedHandler);
                dataPriv.remove(this, delegateType);
              } else {
                dataPriv.set(this, delegateType, attaches);
              }
            } else {
              return false;
            }
          },
          // Suppress native focus or blur if we're currently inside
          // a leveraged native-event stack
          _default: function(event) {
            return dataPriv.get(event.target, type);
          },
          delegateType
        };
        jQuery.event.special[delegateType] = {
          setup: function() {
            var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType);
            if (!attaches) {
              if (document2.documentMode) {
                this.addEventListener(delegateType, focusMappedHandler);
              } else {
                doc.addEventListener(type, focusMappedHandler, true);
              }
            }
            dataPriv.set(dataHolder, delegateType, (attaches || 0) + 1);
          },
          teardown: function() {
            var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType) - 1;
            if (!attaches) {
              if (document2.documentMode) {
                this.removeEventListener(delegateType, focusMappedHandler);
              } else {
                doc.removeEventListener(type, focusMappedHandler, true);
              }
              dataPriv.remove(dataHolder, delegateType);
            } else {
              dataPriv.set(dataHolder, delegateType, attaches);
            }
          }
        };
      });
      jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
      }, function(orig, fix) {
        jQuery.event.special[orig] = {
          delegateType: fix,
          bindType: fix,
          handle: function(event) {
            var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
            if (!related || related !== target && !jQuery.contains(target, related)) {
              event.type = handleObj.origType;
              ret = handleObj.handler.apply(this, arguments);
              event.type = fix;
            }
            return ret;
          }
        };
      });
      jQuery.fn.extend({
        on: function(types, selector, data, fn) {
          return on(this, types, selector, data, fn);
        },
        one: function(types, selector, data, fn) {
          return on(this, types, selector, data, fn, 1);
        },
        off: function(types, selector, fn) {
          var handleObj, type;
          if (types && types.preventDefault && types.handleObj) {
            handleObj = types.handleObj;
            jQuery(types.delegateTarget).off(
              handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
              handleObj.selector,
              handleObj.handler
            );
            return this;
          }
          if (typeof types === "object") {
            for (type in types) {
              this.off(type, selector, types[type]);
            }
            return this;
          }
          if (selector === false || typeof selector === "function") {
            fn = selector;
            selector = void 0;
          }
          if (fn === false) {
            fn = returnFalse;
          }
          return this.each(function() {
            jQuery.event.remove(this, types, fn, selector);
          });
        }
      });
      var rnoInnerhtml = /<script|<style|<link/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
      function manipulationTarget(elem, content) {
        if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
          return jQuery(elem).children("tbody")[0] || elem;
        }
        return elem;
      }
      function disableScript(elem) {
        elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
        return elem;
      }
      function restoreScript(elem) {
        if ((elem.type || "").slice(0, 5) === "true/") {
          elem.type = elem.type.slice(5);
        } else {
          elem.removeAttribute("type");
        }
        return elem;
      }
      function cloneCopyEvent(src, dest) {
        var i, l, type, pdataOld, udataOld, udataCur, events;
        if (dest.nodeType !== 1) {
          return;
        }
        if (dataPriv.hasData(src)) {
          pdataOld = dataPriv.get(src);
          events = pdataOld.events;
          if (events) {
            dataPriv.remove(dest, "handle events");
            for (type in events) {
              for (i = 0, l = events[type].length; i < l; i++) {
                jQuery.event.add(dest, type, events[type][i]);
              }
            }
          }
        }
        if (dataUser.hasData(src)) {
          udataOld = dataUser.access(src);
          udataCur = jQuery.extend({}, udataOld);
          dataUser.set(dest, udataCur);
        }
      }
      function fixInput(src, dest) {
        var nodeName2 = dest.nodeName.toLowerCase();
        if (nodeName2 === "input" && rcheckableType.test(src.type)) {
          dest.checked = src.checked;
        } else if (nodeName2 === "input" || nodeName2 === "textarea") {
          dest.defaultValue = src.defaultValue;
        }
      }
      function domManip(collection, args, callback, ignored) {
        args = flat(args);
        var fragment, first, scripts, hasScripts, node, doc, i = 0, l = collection.length, iNoClone = l - 1, value = args[0], valueIsFunction = isFunction(value);
        if (valueIsFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
          return collection.each(function(index) {
            var self = collection.eq(index);
            if (valueIsFunction) {
              args[0] = value.call(this, index, self.html());
            }
            domManip(self, args, callback, ignored);
          });
        }
        if (l) {
          fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
          first = fragment.firstChild;
          if (fragment.childNodes.length === 1) {
            fragment = first;
          }
          if (first || ignored) {
            scripts = jQuery.map(getAll(fragment, "script"), disableScript);
            hasScripts = scripts.length;
            for (; i < l; i++) {
              node = fragment;
              if (i !== iNoClone) {
                node = jQuery.clone(node, true, true);
                if (hasScripts) {
                  jQuery.merge(scripts, getAll(node, "script"));
                }
              }
              callback.call(collection[i], node, i);
            }
            if (hasScripts) {
              doc = scripts[scripts.length - 1].ownerDocument;
              jQuery.map(scripts, restoreScript);
              for (i = 0; i < hasScripts; i++) {
                node = scripts[i];
                if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {
                  if (node.src && (node.type || "").toLowerCase() !== "module") {
                    if (jQuery._evalUrl && !node.noModule) {
                      jQuery._evalUrl(node.src, {
                        nonce: node.nonce || node.getAttribute("nonce")
                      }, doc);
                    }
                  } else {
                    DOMEval(node.textContent.replace(rcleanScript, ""), node, doc);
                  }
                }
              }
            }
          }
        }
        return collection;
      }
      function remove(elem, selector, keepData) {
        var node, nodes = selector ? jQuery.filter(selector, elem) : elem, i = 0;
        for (; (node = nodes[i]) != null; i++) {
          if (!keepData && node.nodeType === 1) {
            jQuery.cleanData(getAll(node));
          }
          if (node.parentNode) {
            if (keepData && isAttached(node)) {
              setGlobalEval(getAll(node, "script"));
            }
            node.parentNode.removeChild(node);
          }
        }
        return elem;
      }
      jQuery.extend({
        htmlPrefilter: function(html) {
          return html;
        },
        clone: function(elem, dataAndEvents, deepDataAndEvents) {
          var i, l, srcElements, destElements, clone = elem.cloneNode(true), inPage = isAttached(elem);
          if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
            destElements = getAll(clone);
            srcElements = getAll(elem);
            for (i = 0, l = srcElements.length; i < l; i++) {
              fixInput(srcElements[i], destElements[i]);
            }
          }
          if (dataAndEvents) {
            if (deepDataAndEvents) {
              srcElements = srcElements || getAll(elem);
              destElements = destElements || getAll(clone);
              for (i = 0, l = srcElements.length; i < l; i++) {
                cloneCopyEvent(srcElements[i], destElements[i]);
              }
            } else {
              cloneCopyEvent(elem, clone);
            }
          }
          destElements = getAll(clone, "script");
          if (destElements.length > 0) {
            setGlobalEval(destElements, !inPage && getAll(elem, "script"));
          }
          return clone;
        },
        cleanData: function(elems) {
          var data, elem, type, special = jQuery.event.special, i = 0;
          for (; (elem = elems[i]) !== void 0; i++) {
            if (acceptData(elem)) {
              if (data = elem[dataPriv.expando]) {
                if (data.events) {
                  for (type in data.events) {
                    if (special[type]) {
                      jQuery.event.remove(elem, type);
                    } else {
                      jQuery.removeEvent(elem, type, data.handle);
                    }
                  }
                }
                elem[dataPriv.expando] = void 0;
              }
              if (elem[dataUser.expando]) {
                elem[dataUser.expando] = void 0;
              }
            }
          }
        }
      });
      jQuery.fn.extend({
        detach: function(selector) {
          return remove(this, selector, true);
        },
        remove: function(selector) {
          return remove(this, selector);
        },
        text: function(value) {
          return access(this, function(value2) {
            return value2 === void 0 ? jQuery.text(this) : this.empty().each(function() {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                this.textContent = value2;
              }
            });
          }, null, value, arguments.length);
        },
        append: function() {
          return domManip(this, arguments, function(elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var target = manipulationTarget(this, elem);
              target.appendChild(elem);
            }
          });
        },
        prepend: function() {
          return domManip(this, arguments, function(elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var target = manipulationTarget(this, elem);
              target.insertBefore(elem, target.firstChild);
            }
          });
        },
        before: function() {
          return domManip(this, arguments, function(elem) {
            if (this.parentNode) {
              this.parentNode.insertBefore(elem, this);
            }
          });
        },
        after: function() {
          return domManip(this, arguments, function(elem) {
            if (this.parentNode) {
              this.parentNode.insertBefore(elem, this.nextSibling);
            }
          });
        },
        empty: function() {
          var elem, i = 0;
          for (; (elem = this[i]) != null; i++) {
            if (elem.nodeType === 1) {
              jQuery.cleanData(getAll(elem, false));
              elem.textContent = "";
            }
          }
          return this;
        },
        clone: function(dataAndEvents, deepDataAndEvents) {
          dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
          deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
          return this.map(function() {
            return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
          });
        },
        html: function(value) {
          return access(this, function(value2) {
            var elem = this[0] || {}, i = 0, l = this.length;
            if (value2 === void 0 && elem.nodeType === 1) {
              return elem.innerHTML;
            }
            if (typeof value2 === "string" && !rnoInnerhtml.test(value2) && !wrapMap[(rtagName.exec(value2) || ["", ""])[1].toLowerCase()]) {
              value2 = jQuery.htmlPrefilter(value2);
              try {
                for (; i < l; i++) {
                  elem = this[i] || {};
                  if (elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem, false));
                    elem.innerHTML = value2;
                  }
                }
                elem = 0;
              } catch (e) {
              }
            }
            if (elem) {
              this.empty().append(value2);
            }
          }, null, value, arguments.length);
        },
        replaceWith: function() {
          var ignored = [];
          return domManip(this, arguments, function(elem) {
            var parent = this.parentNode;
            if (jQuery.inArray(this, ignored) < 0) {
              jQuery.cleanData(getAll(this));
              if (parent) {
                parent.replaceChild(elem, this);
              }
            }
          }, ignored);
        }
      });
      jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
      }, function(name, original) {
        jQuery.fn[name] = function(selector) {
          var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0;
          for (; i <= last; i++) {
            elems = i === last ? this : this.clone(true);
            jQuery(insert[i])[original](elems);
            push.apply(ret, elems.get());
          }
          return this.pushStack(ret);
        };
      });
      var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
      var rcustomProp = /^--/;
      var getStyles = function(elem) {
        var view = elem.ownerDocument.defaultView;
        if (!view || !view.opener) {
          view = window2;
        }
        return view.getComputedStyle(elem);
      };
      var swap = function(elem, options, callback) {
        var ret, name, old = {};
        for (name in options) {
          old[name] = elem.style[name];
          elem.style[name] = options[name];
        }
        ret = callback.call(elem);
        for (name in options) {
          elem.style[name] = old[name];
        }
        return ret;
      };
      var rboxStyle = new RegExp(cssExpand.join("|"), "i");
      (function() {
        function computeStyleTests() {
          if (!div) {
            return;
          }
          container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
          div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
          documentElement.appendChild(container).appendChild(div);
          var divStyle = window2.getComputedStyle(div);
          pixelPositionVal = divStyle.top !== "1%";
          reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;
          div.style.right = "60%";
          pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;
          boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;
          div.style.position = "absolute";
          scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;
          documentElement.removeChild(container);
          div = null;
        }
        function roundPixelMeasures(measure) {
          return Math.round(parseFloat(measure));
        }
        var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document2.createElement("div"), div = document2.createElement("div");
        if (!div.style) {
          return;
        }
        div.style.backgroundClip = "content-box";
        div.cloneNode(true).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";
        jQuery.extend(support, {
          boxSizingReliable: function() {
            computeStyleTests();
            return boxSizingReliableVal;
          },
          pixelBoxStyles: function() {
            computeStyleTests();
            return pixelBoxStylesVal;
          },
          pixelPosition: function() {
            computeStyleTests();
            return pixelPositionVal;
          },
          reliableMarginLeft: function() {
            computeStyleTests();
            return reliableMarginLeftVal;
          },
          scrollboxSize: function() {
            computeStyleTests();
            return scrollboxSizeVal;
          },
          // Support: IE 9 - 11+, Edge 15 - 18+
          // IE/Edge misreport `getComputedStyle` of table rows with width/height
          // set in CSS while `offset*` properties report correct values.
          // Behavior in IE 9 is more subtle than in newer versions & it passes
          // some versions of this test; make sure not to make it pass there!
          //
          // Support: Firefox 70+
          // Only Firefox includes border widths
          // in computed dimensions. (gh-4529)
          reliableTrDimensions: function() {
            var table, tr, trChild, trStyle;
            if (reliableTrDimensionsVal == null) {
              table = document2.createElement("table");
              tr = document2.createElement("tr");
              trChild = document2.createElement("div");
              table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
              tr.style.cssText = "box-sizing:content-box;border:1px solid";
              tr.style.height = "1px";
              trChild.style.height = "9px";
              trChild.style.display = "block";
              documentElement.appendChild(table).appendChild(tr).appendChild(trChild);
              trStyle = window2.getComputedStyle(tr);
              reliableTrDimensionsVal = parseInt(trStyle.height, 10) + parseInt(trStyle.borderTopWidth, 10) + parseInt(trStyle.borderBottomWidth, 10) === tr.offsetHeight;
              documentElement.removeChild(table);
            }
            return reliableTrDimensionsVal;
          }
        });
      })();
      function curCSS(elem, name, computed) {
        var width, minWidth, maxWidth, ret, isCustomProp = rcustomProp.test(name), style = elem.style;
        computed = computed || getStyles(elem);
        if (computed) {
          ret = computed.getPropertyValue(name) || computed[name];
          if (isCustomProp && ret) {
            ret = ret.replace(rtrimCSS, "$1") || void 0;
          }
          if (ret === "" && !isAttached(elem)) {
            ret = jQuery.style(elem, name);
          }
          if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
            width = style.width;
            minWidth = style.minWidth;
            maxWidth = style.maxWidth;
            style.minWidth = style.maxWidth = style.width = ret;
            ret = computed.width;
            style.width = width;
            style.minWidth = minWidth;
            style.maxWidth = maxWidth;
          }
        }
        return ret !== void 0 ? (
          // Support: IE <=9 - 11 only
          // IE returns zIndex value as an integer.
          ret + ""
        ) : ret;
      }
      function addGetHookIf(conditionFn, hookFn) {
        return {
          get: function() {
            if (conditionFn()) {
              delete this.get;
              return;
            }
            return (this.get = hookFn).apply(this, arguments);
          }
        };
      }
      var cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyle = document2.createElement("div").style, vendorProps = {};
      function vendorPropName(name) {
        var capName = name[0].toUpperCase() + name.slice(1), i = cssPrefixes.length;
        while (i--) {
          name = cssPrefixes[i] + capName;
          if (name in emptyStyle) {
            return name;
          }
        }
      }
      function finalPropName(name) {
        var final = jQuery.cssProps[name] || vendorProps[name];
        if (final) {
          return final;
        }
        if (name in emptyStyle) {
          return name;
        }
        return vendorProps[name] = vendorPropName(name) || name;
      }
      var rdisplayswap = /^(none|table(?!-c[ea]).+)/, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssNormalTransform = {
        letterSpacing: "0",
        fontWeight: "400"
      };
      function setPositiveNumber(_elem, value, subtract) {
        var matches = rcssNum.exec(value);
        return matches ? (
          // Guard against undefined "subtract", e.g., when used as in cssHooks
          Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px")
        ) : value;
      }
      function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
        var i = dimension === "width" ? 1 : 0, extra = 0, delta = 0, marginDelta = 0;
        if (box === (isBorderBox ? "border" : "content")) {
          return 0;
        }
        for (; i < 4; i += 2) {
          if (box === "margin") {
            marginDelta += jQuery.css(elem, box + cssExpand[i], true, styles);
          }
          if (!isBorderBox) {
            delta += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
            if (box !== "padding") {
              delta += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
            } else {
              extra += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
            }
          } else {
            if (box === "content") {
              delta -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
            }
            if (box !== "margin") {
              delta -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
            }
          }
        }
        if (!isBorderBox && computedVal >= 0) {
          delta += Math.max(0, Math.ceil(
            elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5
            // If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
            // Use an explicit zero to avoid NaN (gh-3964)
          )) || 0;
        }
        return delta + marginDelta;
      }
      function getWidthOrHeight(elem, dimension, extra) {
        var styles = getStyles(elem), boxSizingNeeded = !support.boxSizingReliable() || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
        if (rnumnonpx.test(val)) {
          if (!extra) {
            return val;
          }
          val = "auto";
        }
        if ((!support.boxSizingReliable() && isBorderBox || // Support: IE 10 - 11+, Edge 15 - 18+
        // IE/Edge misreport `getComputedStyle` of table rows with width/height
        // set in CSS while `offset*` properties report correct values.
        // Interestingly, in some cases IE 9 doesn't suffer from this issue.
        !support.reliableTrDimensions() && nodeName(elem, "tr") || // Fall back to offsetWidth/offsetHeight when value is "auto"
        // This happens for inline elements with no explicit setting (gh-3571)
        val === "auto" || // Support: Android <=4.1 - 4.3 only
        // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
        !parseFloat(val) && jQuery.css(elem, "display", false, styles) === "inline") && // Make sure the element is visible & connected
        elem.getClientRects().length) {
          isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";
          valueIsBorderBox = offsetProp in elem;
          if (valueIsBorderBox) {
            val = elem[offsetProp];
          }
        }
        val = parseFloat(val) || 0;
        return val + boxModelAdjustment(
          elem,
          dimension,
          extra || (isBorderBox ? "border" : "content"),
          valueIsBorderBox,
          styles,
          // Provide the current computed size to request scroll gutter calculation (gh-3589)
          val
        ) + "px";
      }
      jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
          opacity: {
            get: function(elem, computed) {
              if (computed) {
                var ret = curCSS(elem, "opacity");
                return ret === "" ? "1" : ret;
              }
            }
          }
        },
        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
          animationIterationCount: true,
          aspectRatio: true,
          borderImageSlice: true,
          columnCount: true,
          flexGrow: true,
          flexShrink: true,
          fontWeight: true,
          gridArea: true,
          gridColumn: true,
          gridColumnEnd: true,
          gridColumnStart: true,
          gridRow: true,
          gridRowEnd: true,
          gridRowStart: true,
          lineHeight: true,
          opacity: true,
          order: true,
          orphans: true,
          scale: true,
          widows: true,
          zIndex: true,
          zoom: true,
          // SVG-related
          fillOpacity: true,
          floodOpacity: true,
          stopOpacity: true,
          strokeMiterlimit: true,
          strokeOpacity: true
        },
        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {},
        // Get and set the style property on a DOM Node
        style: function(elem, name, value, extra) {
          if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
            return;
          }
          var ret, type, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style = elem.style;
          if (!isCustomProp) {
            name = finalPropName(origName);
          }
          hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
          if (value !== void 0) {
            type = typeof value;
            if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
              value = adjustCSS(elem, name, ret);
              type = "number";
            }
            if (value == null || value !== value) {
              return;
            }
            if (type === "number" && !isCustomProp) {
              value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
            }
            if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
              style[name] = "inherit";
            }
            if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== void 0) {
              if (isCustomProp) {
                style.setProperty(name, value);
              } else {
                style[name] = value;
              }
            }
          } else {
            if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== void 0) {
              return ret;
            }
            return style[name];
          }
        },
        css: function(elem, name, extra, styles) {
          var val, num, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name);
          if (!isCustomProp) {
            name = finalPropName(origName);
          }
          hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
          if (hooks && "get" in hooks) {
            val = hooks.get(elem, true, extra);
          }
          if (val === void 0) {
            val = curCSS(elem, name, styles);
          }
          if (val === "normal" && name in cssNormalTransform) {
            val = cssNormalTransform[name];
          }
          if (extra === "" || extra) {
            num = parseFloat(val);
            return extra === true || isFinite(num) ? num || 0 : val;
          }
          return val;
        }
      });
      jQuery.each(["height", "width"], function(_i, dimension) {
        jQuery.cssHooks[dimension] = {
          get: function(elem, computed, extra) {
            if (computed) {
              return rdisplayswap.test(jQuery.css(elem, "display")) && // Support: Safari 8+
              // Table columns in Safari have non-zero offsetWidth & zero
              // getBoundingClientRect().width unless display is changed.
              // Support: IE <=11 only
              // Running getBoundingClientRect on a disconnected node
              // in IE throws an error.
              (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function() {
                return getWidthOrHeight(elem, dimension, extra);
              }) : getWidthOrHeight(elem, dimension, extra);
            }
          },
          set: function(elem, value, extra) {
            var matches, styles = getStyles(elem), scrollboxSizeBuggy = !support.scrollboxSize() && styles.position === "absolute", boxSizingNeeded = scrollboxSizeBuggy || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", subtract = extra ? boxModelAdjustment(
              elem,
              dimension,
              extra,
              isBorderBox,
              styles
            ) : 0;
            if (isBorderBox && scrollboxSizeBuggy) {
              subtract -= Math.ceil(
                elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles) - 0.5
              );
            }
            if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
              elem.style[dimension] = value;
              value = jQuery.css(elem, dimension);
            }
            return setPositiveNumber(elem, value, subtract);
          }
        };
      });
      jQuery.cssHooks.marginLeft = addGetHookIf(
        support.reliableMarginLeft,
        function(elem, computed) {
          if (computed) {
            return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function() {
              return elem.getBoundingClientRect().left;
            })) + "px";
          }
        }
      );
      jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
      }, function(prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
          expand: function(value) {
            var i = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
            for (; i < 4; i++) {
              expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
            }
            return expanded;
          }
        };
        if (prefix !== "margin") {
          jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
      });
      jQuery.fn.extend({
        css: function(name, value) {
          return access(this, function(elem, name2, value2) {
            var styles, len, map = {}, i = 0;
            if (Array.isArray(name2)) {
              styles = getStyles(elem);
              len = name2.length;
              for (; i < len; i++) {
                map[name2[i]] = jQuery.css(elem, name2[i], false, styles);
              }
              return map;
            }
            return value2 !== void 0 ? jQuery.style(elem, name2, value2) : jQuery.css(elem, name2);
          }, name, value, arguments.length > 1);
        }
      });
      function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
      }
      jQuery.Tween = Tween;
      Tween.prototype = {
        constructor: Tween,
        init: function(elem, options, prop, end, easing, unit) {
          this.elem = elem;
          this.prop = prop;
          this.easing = easing || jQuery.easing._default;
          this.options = options;
          this.start = this.now = this.cur();
          this.end = end;
          this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function() {
          var hooks = Tween.propHooks[this.prop];
          return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
        },
        run: function(percent) {
          var eased, hooks = Tween.propHooks[this.prop];
          if (this.options.duration) {
            this.pos = eased = jQuery.easing[this.easing](
              percent,
              this.options.duration * percent,
              0,
              1,
              this.options.duration
            );
          } else {
            this.pos = eased = percent;
          }
          this.now = (this.end - this.start) * eased + this.start;
          if (this.options.step) {
            this.options.step.call(this.elem, this.now, this);
          }
          if (hooks && hooks.set) {
            hooks.set(this);
          } else {
            Tween.propHooks._default.set(this);
          }
          return this;
        }
      };
      Tween.prototype.init.prototype = Tween.prototype;
      Tween.propHooks = {
        _default: {
          get: function(tween) {
            var result;
            if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
              return tween.elem[tween.prop];
            }
            result = jQuery.css(tween.elem, tween.prop, "");
            return !result || result === "auto" ? 0 : result;
          },
          set: function(tween) {
            if (jQuery.fx.step[tween.prop]) {
              jQuery.fx.step[tween.prop](tween);
            } else if (tween.elem.nodeType === 1 && (jQuery.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
              jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
            } else {
              tween.elem[tween.prop] = tween.now;
            }
          }
        }
      };
      Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function(tween) {
          if (tween.elem.nodeType && tween.elem.parentNode) {
            tween.elem[tween.prop] = tween.now;
          }
        }
      };
      jQuery.easing = {
        linear: function(p) {
          return p;
        },
        swing: function(p) {
          return 0.5 - Math.cos(p * Math.PI) / 2;
        },
        _default: "swing"
      };
      jQuery.fx = Tween.prototype.init;
      jQuery.fx.step = {};
      var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
      function schedule() {
        if (inProgress) {
          if (document2.hidden === false && window2.requestAnimationFrame) {
            window2.requestAnimationFrame(schedule);
          } else {
            window2.setTimeout(schedule, jQuery.fx.interval);
          }
          jQuery.fx.tick();
        }
      }
      function createFxNow() {
        window2.setTimeout(function() {
          fxNow = void 0;
        });
        return fxNow = Date.now();
      }
      function genFx(type, includeWidth) {
        var which, i = 0, attrs = { height: type };
        includeWidth = includeWidth ? 1 : 0;
        for (; i < 4; i += 2 - includeWidth) {
          which = cssExpand[i];
          attrs["margin" + which] = attrs["padding" + which] = type;
        }
        if (includeWidth) {
          attrs.opacity = attrs.width = type;
        }
        return attrs;
      }
      function createTween(value, prop, animation) {
        var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length;
        for (; index < length; index++) {
          if (tween = collection[index].call(animation, prop, value)) {
            return tween;
          }
        }
      }
      function defaultPrefilter(elem, props, opts) {
        var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
        if (!opts.queue) {
          hooks = jQuery._queueHooks(elem, "fx");
          if (hooks.unqueued == null) {
            hooks.unqueued = 0;
            oldfire = hooks.empty.fire;
            hooks.empty.fire = function() {
              if (!hooks.unqueued) {
                oldfire();
              }
            };
          }
          hooks.unqueued++;
          anim.always(function() {
            anim.always(function() {
              hooks.unqueued--;
              if (!jQuery.queue(elem, "fx").length) {
                hooks.empty.fire();
              }
            });
          });
        }
        for (prop in props) {
          value = props[prop];
          if (rfxtypes.test(value)) {
            delete props[prop];
            toggle = toggle || value === "toggle";
            if (value === (hidden ? "hide" : "show")) {
              if (value === "show" && dataShow && dataShow[prop] !== void 0) {
                hidden = true;
              } else {
                continue;
              }
            }
            orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
          }
        }
        propTween = !jQuery.isEmptyObject(props);
        if (!propTween && jQuery.isEmptyObject(orig)) {
          return;
        }
        if (isBox && elem.nodeType === 1) {
          opts.overflow = [style.overflow, style.overflowX, style.overflowY];
          restoreDisplay = dataShow && dataShow.display;
          if (restoreDisplay == null) {
            restoreDisplay = dataPriv.get(elem, "display");
          }
          display = jQuery.css(elem, "display");
          if (display === "none") {
            if (restoreDisplay) {
              display = restoreDisplay;
            } else {
              showHide([elem], true);
              restoreDisplay = elem.style.display || restoreDisplay;
              display = jQuery.css(elem, "display");
              showHide([elem]);
            }
          }
          if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
            if (jQuery.css(elem, "float") === "none") {
              if (!propTween) {
                anim.done(function() {
                  style.display = restoreDisplay;
                });
                if (restoreDisplay == null) {
                  display = style.display;
                  restoreDisplay = display === "none" ? "" : display;
                }
              }
              style.display = "inline-block";
            }
          }
        }
        if (opts.overflow) {
          style.overflow = "hidden";
          anim.always(function() {
            style.overflow = opts.overflow[0];
            style.overflowX = opts.overflow[1];
            style.overflowY = opts.overflow[2];
          });
        }
        propTween = false;
        for (prop in orig) {
          if (!propTween) {
            if (dataShow) {
              if ("hidden" in dataShow) {
                hidden = dataShow.hidden;
              }
            } else {
              dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
            }
            if (toggle) {
              dataShow.hidden = !hidden;
            }
            if (hidden) {
              showHide([elem], true);
            }
            anim.done(function() {
              if (!hidden) {
                showHide([elem]);
              }
              dataPriv.remove(elem, "fxshow");
              for (prop in orig) {
                jQuery.style(elem, prop, orig[prop]);
              }
            });
          }
          propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
          if (!(prop in dataShow)) {
            dataShow[prop] = propTween.start;
            if (hidden) {
              propTween.end = propTween.start;
              propTween.start = 0;
            }
          }
        }
      }
      function propFilter(props, specialEasing) {
        var index, name, easing, value, hooks;
        for (index in props) {
          name = camelCase(index);
          easing = specialEasing[name];
          value = props[index];
          if (Array.isArray(value)) {
            easing = value[1];
            value = props[index] = value[0];
          }
          if (index !== name) {
            props[name] = value;
            delete props[index];
          }
          hooks = jQuery.cssHooks[name];
          if (hooks && "expand" in hooks) {
            value = hooks.expand(value);
            delete props[name];
            for (index in value) {
              if (!(index in props)) {
                props[index] = value[index];
                specialEasing[index] = easing;
              }
            }
          } else {
            specialEasing[name] = easing;
          }
        }
      }
      function Animation(elem, properties, options) {
        var result, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery.Deferred().always(function() {
          delete tick.elem;
        }), tick = function() {
          if (stopped) {
            return false;
          }
          var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index2 = 0, length2 = animation.tweens.length;
          for (; index2 < length2; index2++) {
            animation.tweens[index2].run(percent);
          }
          deferred.notifyWith(elem, [animation, percent, remaining]);
          if (percent < 1 && length2) {
            return remaining;
          }
          if (!length2) {
            deferred.notifyWith(elem, [animation, 1, 0]);
          }
          deferred.resolveWith(elem, [animation]);
          return false;
        }, animation = deferred.promise({
          elem,
          props: jQuery.extend({}, properties),
          opts: jQuery.extend(true, {
            specialEasing: {},
            easing: jQuery.easing._default
          }, options),
          originalProperties: properties,
          originalOptions: options,
          startTime: fxNow || createFxNow(),
          duration: options.duration,
          tweens: [],
          createTween: function(prop, end) {
            var tween = jQuery.Tween(
              elem,
              animation.opts,
              prop,
              end,
              animation.opts.specialEasing[prop] || animation.opts.easing
            );
            animation.tweens.push(tween);
            return tween;
          },
          stop: function(gotoEnd) {
            var index2 = 0, length2 = gotoEnd ? animation.tweens.length : 0;
            if (stopped) {
              return this;
            }
            stopped = true;
            for (; index2 < length2; index2++) {
              animation.tweens[index2].run(1);
            }
            if (gotoEnd) {
              deferred.notifyWith(elem, [animation, 1, 0]);
              deferred.resolveWith(elem, [animation, gotoEnd]);
            } else {
              deferred.rejectWith(elem, [animation, gotoEnd]);
            }
            return this;
          }
        }), props = animation.props;
        propFilter(props, animation.opts.specialEasing);
        for (; index < length; index++) {
          result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
          if (result) {
            if (isFunction(result.stop)) {
              jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
            }
            return result;
          }
        }
        jQuery.map(props, createTween, animation);
        if (isFunction(animation.opts.start)) {
          animation.opts.start.call(elem, animation);
        }
        animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
        jQuery.fx.timer(
          jQuery.extend(tick, {
            elem,
            anim: animation,
            queue: animation.opts.queue
          })
        );
        return animation;
      }
      jQuery.Animation = jQuery.extend(Animation, {
        tweeners: {
          "*": [function(prop, value) {
            var tween = this.createTween(prop, value);
            adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
            return tween;
          }]
        },
        tweener: function(props, callback) {
          if (isFunction(props)) {
            callback = props;
            props = ["*"];
          } else {
            props = props.match(rnothtmlwhite);
          }
          var prop, index = 0, length = props.length;
          for (; index < length; index++) {
            prop = props[index];
            Animation.tweeners[prop] = Animation.tweeners[prop] || [];
            Animation.tweeners[prop].unshift(callback);
          }
        },
        prefilters: [defaultPrefilter],
        prefilter: function(callback, prepend) {
          if (prepend) {
            Animation.prefilters.unshift(callback);
          } else {
            Animation.prefilters.push(callback);
          }
        }
      });
      jQuery.speed = function(speed, easing, fn) {
        var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
          complete: fn || !fn && easing || isFunction(speed) && speed,
          duration: speed,
          easing: fn && easing || easing && !isFunction(easing) && easing
        };
        if (jQuery.fx.off) {
          opt.duration = 0;
        } else {
          if (typeof opt.duration !== "number") {
            if (opt.duration in jQuery.fx.speeds) {
              opt.duration = jQuery.fx.speeds[opt.duration];
            } else {
              opt.duration = jQuery.fx.speeds._default;
            }
          }
        }
        if (opt.queue == null || opt.queue === true) {
          opt.queue = "fx";
        }
        opt.old = opt.complete;
        opt.complete = function() {
          if (isFunction(opt.old)) {
            opt.old.call(this);
          }
          if (opt.queue) {
            jQuery.dequeue(this, opt.queue);
          }
        };
        return opt;
      };
      jQuery.fn.extend({
        fadeTo: function(speed, to, easing, callback) {
          return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing, callback);
        },
        animate: function(prop, speed, easing, callback) {
          var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
            var anim = Animation(this, jQuery.extend({}, prop), optall);
            if (empty || dataPriv.get(this, "finish")) {
              anim.stop(true);
            }
          };
          doAnimation.finish = doAnimation;
          return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
        },
        stop: function(type, clearQueue, gotoEnd) {
          var stopQueue = function(hooks) {
            var stop = hooks.stop;
            delete hooks.stop;
            stop(gotoEnd);
          };
          if (typeof type !== "string") {
            gotoEnd = clearQueue;
            clearQueue = type;
            type = void 0;
          }
          if (clearQueue) {
            this.queue(type || "fx", []);
          }
          return this.each(function() {
            var dequeue = true, index = type != null && type + "queueHooks", timers = jQuery.timers, data = dataPriv.get(this);
            if (index) {
              if (data[index] && data[index].stop) {
                stopQueue(data[index]);
              }
            } else {
              for (index in data) {
                if (data[index] && data[index].stop && rrun.test(index)) {
                  stopQueue(data[index]);
                }
              }
            }
            for (index = timers.length; index--; ) {
              if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                timers[index].anim.stop(gotoEnd);
                dequeue = false;
                timers.splice(index, 1);
              }
            }
            if (dequeue || !gotoEnd) {
              jQuery.dequeue(this, type);
            }
          });
        },
        finish: function(type) {
          if (type !== false) {
            type = type || "fx";
          }
          return this.each(function() {
            var index, data = dataPriv.get(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
            data.finish = true;
            jQuery.queue(this, type, []);
            if (hooks && hooks.stop) {
              hooks.stop.call(this, true);
            }
            for (index = timers.length; index--; ) {
              if (timers[index].elem === this && timers[index].queue === type) {
                timers[index].anim.stop(true);
                timers.splice(index, 1);
              }
            }
            for (index = 0; index < length; index++) {
              if (queue[index] && queue[index].finish) {
                queue[index].finish.call(this);
              }
            }
            delete data.finish;
          });
        }
      });
      jQuery.each(["toggle", "show", "hide"], function(_i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function(speed, easing, callback) {
          return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
        };
      });
      jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
      }, function(name, props) {
        jQuery.fn[name] = function(speed, easing, callback) {
          return this.animate(props, speed, easing, callback);
        };
      });
      jQuery.timers = [];
      jQuery.fx.tick = function() {
        var timer, i = 0, timers = jQuery.timers;
        fxNow = Date.now();
        for (; i < timers.length; i++) {
          timer = timers[i];
          if (!timer() && timers[i] === timer) {
            timers.splice(i--, 1);
          }
        }
        if (!timers.length) {
          jQuery.fx.stop();
        }
        fxNow = void 0;
      };
      jQuery.fx.timer = function(timer) {
        jQuery.timers.push(timer);
        jQuery.fx.start();
      };
      jQuery.fx.interval = 13;
      jQuery.fx.start = function() {
        if (inProgress) {
          return;
        }
        inProgress = true;
        schedule();
      };
      jQuery.fx.stop = function() {
        inProgress = null;
      };
      jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
      };
      jQuery.fn.delay = function(time, type) {
        time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
        type = type || "fx";
        return this.queue(type, function(next, hooks) {
          var timeout = window2.setTimeout(next, time);
          hooks.stop = function() {
            window2.clearTimeout(timeout);
          };
        });
      };
      (function() {
        var input = document2.createElement("input"), select = document2.createElement("select"), opt = select.appendChild(document2.createElement("option"));
        input.type = "checkbox";
        support.checkOn = input.value !== "";
        support.optSelected = opt.selected;
        input = document2.createElement("input");
        input.value = "t";
        input.type = "radio";
        support.radioValue = input.value === "t";
      })();
      var boolHook, attrHandle = jQuery.expr.attrHandle;
      jQuery.fn.extend({
        attr: function(name, value) {
          return access(this, jQuery.attr, name, value, arguments.length > 1);
        },
        removeAttr: function(name) {
          return this.each(function() {
            jQuery.removeAttr(this, name);
          });
        }
      });
      jQuery.extend({
        attr: function(elem, name, value) {
          var ret, hooks, nType = elem.nodeType;
          if (nType === 3 || nType === 8 || nType === 2) {
            return;
          }
          if (typeof elem.getAttribute === "undefined") {
            return jQuery.prop(elem, name, value);
          }
          if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
            hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : void 0);
          }
          if (value !== void 0) {
            if (value === null) {
              jQuery.removeAttr(elem, name);
              return;
            }
            if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
              return ret;
            }
            elem.setAttribute(name, value + "");
            return value;
          }
          if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
            return ret;
          }
          ret = jQuery.find.attr(elem, name);
          return ret == null ? void 0 : ret;
        },
        attrHooks: {
          type: {
            set: function(elem, value) {
              if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
                var val = elem.value;
                elem.setAttribute("type", value);
                if (val) {
                  elem.value = val;
                }
                return value;
              }
            }
          }
        },
        removeAttr: function(elem, value) {
          var name, i = 0, attrNames = value && value.match(rnothtmlwhite);
          if (attrNames && elem.nodeType === 1) {
            while (name = attrNames[i++]) {
              elem.removeAttribute(name);
            }
          }
        }
      });
      boolHook = {
        set: function(elem, value, name) {
          if (value === false) {
            jQuery.removeAttr(elem, name);
          } else {
            elem.setAttribute(name, name);
          }
          return name;
        }
      };
      jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(_i, name) {
        var getter = attrHandle[name] || jQuery.find.attr;
        attrHandle[name] = function(elem, name2, isXML) {
          var ret, handle, lowercaseName = name2.toLowerCase();
          if (!isXML) {
            handle = attrHandle[lowercaseName];
            attrHandle[lowercaseName] = ret;
            ret = getter(elem, name2, isXML) != null ? lowercaseName : null;
            attrHandle[lowercaseName] = handle;
          }
          return ret;
        };
      });
      var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
      jQuery.fn.extend({
        prop: function(name, value) {
          return access(this, jQuery.prop, name, value, arguments.length > 1);
        },
        removeProp: function(name) {
          return this.each(function() {
            delete this[jQuery.propFix[name] || name];
          });
        }
      });
      jQuery.extend({
        prop: function(elem, name, value) {
          var ret, hooks, nType = elem.nodeType;
          if (nType === 3 || nType === 8 || nType === 2) {
            return;
          }
          if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
            name = jQuery.propFix[name] || name;
            hooks = jQuery.propHooks[name];
          }
          if (value !== void 0) {
            if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
              return ret;
            }
            return elem[name] = value;
          }
          if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
            return ret;
          }
          return elem[name];
        },
        propHooks: {
          tabIndex: {
            get: function(elem) {
              var tabindex = jQuery.find.attr(elem, "tabindex");
              if (tabindex) {
                return parseInt(tabindex, 10);
              }
              if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
                return 0;
              }
              return -1;
            }
          }
        },
        propFix: {
          "for": "htmlFor",
          "class": "className"
        }
      });
      if (!support.optSelected) {
        jQuery.propHooks.selected = {
          get: function(elem) {
            var parent = elem.parentNode;
            if (parent && parent.parentNode) {
              parent.parentNode.selectedIndex;
            }
            return null;
          },
          set: function(elem) {
            var parent = elem.parentNode;
            if (parent) {
              parent.selectedIndex;
              if (parent.parentNode) {
                parent.parentNode.selectedIndex;
              }
            }
          }
        };
      }
      jQuery.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
      ], function() {
        jQuery.propFix[this.toLowerCase()] = this;
      });
      function stripAndCollapse(value) {
        var tokens = value.match(rnothtmlwhite) || [];
        return tokens.join(" ");
      }
      function getClass(elem) {
        return elem.getAttribute && elem.getAttribute("class") || "";
      }
      function classesToArray(value) {
        if (Array.isArray(value)) {
          return value;
        }
        if (typeof value === "string") {
          return value.match(rnothtmlwhite) || [];
        }
        return [];
      }
      jQuery.fn.extend({
        addClass: function(value) {
          var classNames, cur, curValue, className, i, finalValue;
          if (isFunction(value)) {
            return this.each(function(j) {
              jQuery(this).addClass(value.call(this, j, getClass(this)));
            });
          }
          classNames = classesToArray(value);
          if (classNames.length) {
            return this.each(function() {
              curValue = getClass(this);
              cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
              if (cur) {
                for (i = 0; i < classNames.length; i++) {
                  className = classNames[i];
                  if (cur.indexOf(" " + className + " ") < 0) {
                    cur += className + " ";
                  }
                }
                finalValue = stripAndCollapse(cur);
                if (curValue !== finalValue) {
                  this.setAttribute("class", finalValue);
                }
              }
            });
          }
          return this;
        },
        removeClass: function(value) {
          var classNames, cur, curValue, className, i, finalValue;
          if (isFunction(value)) {
            return this.each(function(j) {
              jQuery(this).removeClass(value.call(this, j, getClass(this)));
            });
          }
          if (!arguments.length) {
            return this.attr("class", "");
          }
          classNames = classesToArray(value);
          if (classNames.length) {
            return this.each(function() {
              curValue = getClass(this);
              cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
              if (cur) {
                for (i = 0; i < classNames.length; i++) {
                  className = classNames[i];
                  while (cur.indexOf(" " + className + " ") > -1) {
                    cur = cur.replace(" " + className + " ", " ");
                  }
                }
                finalValue = stripAndCollapse(cur);
                if (curValue !== finalValue) {
                  this.setAttribute("class", finalValue);
                }
              }
            });
          }
          return this;
        },
        toggleClass: function(value, stateVal) {
          var classNames, className, i, self, type = typeof value, isValidValue = type === "string" || Array.isArray(value);
          if (isFunction(value)) {
            return this.each(function(i2) {
              jQuery(this).toggleClass(
                value.call(this, i2, getClass(this), stateVal),
                stateVal
              );
            });
          }
          if (typeof stateVal === "boolean" && isValidValue) {
            return stateVal ? this.addClass(value) : this.removeClass(value);
          }
          classNames = classesToArray(value);
          return this.each(function() {
            if (isValidValue) {
              self = jQuery(this);
              for (i = 0; i < classNames.length; i++) {
                className = classNames[i];
                if (self.hasClass(className)) {
                  self.removeClass(className);
                } else {
                  self.addClass(className);
                }
              }
            } else if (value === void 0 || type === "boolean") {
              className = getClass(this);
              if (className) {
                dataPriv.set(this, "__className__", className);
              }
              if (this.setAttribute) {
                this.setAttribute(
                  "class",
                  className || value === false ? "" : dataPriv.get(this, "__className__") || ""
                );
              }
            }
          });
        },
        hasClass: function(selector) {
          var className, elem, i = 0;
          className = " " + selector + " ";
          while (elem = this[i++]) {
            if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
              return true;
            }
          }
          return false;
        }
      });
      var rreturn = /\r/g;
      jQuery.fn.extend({
        val: function(value) {
          var hooks, ret, valueIsFunction, elem = this[0];
          if (!arguments.length) {
            if (elem) {
              hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
              if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== void 0) {
                return ret;
              }
              ret = elem.value;
              if (typeof ret === "string") {
                return ret.replace(rreturn, "");
              }
              return ret == null ? "" : ret;
            }
            return;
          }
          valueIsFunction = isFunction(value);
          return this.each(function(i) {
            var val;
            if (this.nodeType !== 1) {
              return;
            }
            if (valueIsFunction) {
              val = value.call(this, i, jQuery(this).val());
            } else {
              val = value;
            }
            if (val == null) {
              val = "";
            } else if (typeof val === "number") {
              val += "";
            } else if (Array.isArray(val)) {
              val = jQuery.map(val, function(value2) {
                return value2 == null ? "" : value2 + "";
              });
            }
            hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
            if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === void 0) {
              this.value = val;
            }
          });
        }
      });
      jQuery.extend({
        valHooks: {
          option: {
            get: function(elem) {
              var val = jQuery.find.attr(elem, "value");
              return val != null ? val : (
                // Support: IE <=10 - 11 only
                // option.text throws exceptions (trac-14686, trac-14858)
                // Strip and collapse whitespace
                // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                stripAndCollapse(jQuery.text(elem))
              );
            }
          },
          select: {
            get: function(elem) {
              var value, option, i, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one", values = one ? null : [], max = one ? index + 1 : options.length;
              if (index < 0) {
                i = max;
              } else {
                i = one ? index : 0;
              }
              for (; i < max; i++) {
                option = options[i];
                if ((option.selected || i === index) && // Don't return options that are disabled or in a disabled optgroup
                !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
                  value = jQuery(option).val();
                  if (one) {
                    return value;
                  }
                  values.push(value);
                }
              }
              return values;
            },
            set: function(elem, value) {
              var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length;
              while (i--) {
                option = options[i];
                if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
                  optionSet = true;
                }
              }
              if (!optionSet) {
                elem.selectedIndex = -1;
              }
              return values;
            }
          }
        }
      });
      jQuery.each(["radio", "checkbox"], function() {
        jQuery.valHooks[this] = {
          set: function(elem, value) {
            if (Array.isArray(value)) {
              return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
            }
          }
        };
        if (!support.checkOn) {
          jQuery.valHooks[this].get = function(elem) {
            return elem.getAttribute("value") === null ? "on" : elem.value;
          };
        }
      });
      var location = window2.location;
      var nonce = { guid: Date.now() };
      var rquery = /\?/;
      jQuery.parseXML = function(data) {
        var xml, parserErrorElem;
        if (!data || typeof data !== "string") {
          return null;
        }
        try {
          xml = new window2.DOMParser().parseFromString(data, "text/xml");
        } catch (e) {
        }
        parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0];
        if (!xml || parserErrorElem) {
          jQuery.error("Invalid XML: " + (parserErrorElem ? jQuery.map(parserErrorElem.childNodes, function(el) {
            return el.textContent;
          }).join("\n") : data));
        }
        return xml;
      };
      var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e) {
        e.stopPropagation();
      };
      jQuery.extend(jQuery.event, {
        trigger: function(event, data, elem, onlyHandlers) {
          var i, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [elem || document2], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
          cur = lastElement = tmp = elem = elem || document2;
          if (elem.nodeType === 3 || elem.nodeType === 8) {
            return;
          }
          if (rfocusMorph.test(type + jQuery.event.triggered)) {
            return;
          }
          if (type.indexOf(".") > -1) {
            namespaces = type.split(".");
            type = namespaces.shift();
            namespaces.sort();
          }
          ontype = type.indexOf(":") < 0 && "on" + type;
          event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
          event.isTrigger = onlyHandlers ? 2 : 3;
          event.namespace = namespaces.join(".");
          event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
          event.result = void 0;
          if (!event.target) {
            event.target = elem;
          }
          data = data == null ? [event] : jQuery.makeArray(data, [event]);
          special = jQuery.event.special[type] || {};
          if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
            return;
          }
          if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
            bubbleType = special.delegateType || type;
            if (!rfocusMorph.test(bubbleType + type)) {
              cur = cur.parentNode;
            }
            for (; cur; cur = cur.parentNode) {
              eventPath.push(cur);
              tmp = cur;
            }
            if (tmp === (elem.ownerDocument || document2)) {
              eventPath.push(tmp.defaultView || tmp.parentWindow || window2);
            }
          }
          i = 0;
          while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
            lastElement = cur;
            event.type = i > 1 ? bubbleType : special.bindType || type;
            handle = (dataPriv.get(cur, "events") || /* @__PURE__ */ Object.create(null))[event.type] && dataPriv.get(cur, "handle");
            if (handle) {
              handle.apply(cur, data);
            }
            handle = ontype && cur[ontype];
            if (handle && handle.apply && acceptData(cur)) {
              event.result = handle.apply(cur, data);
              if (event.result === false) {
                event.preventDefault();
              }
            }
          }
          event.type = type;
          if (!onlyHandlers && !event.isDefaultPrevented()) {
            if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
              if (ontype && isFunction(elem[type]) && !isWindow(elem)) {
                tmp = elem[ontype];
                if (tmp) {
                  elem[ontype] = null;
                }
                jQuery.event.triggered = type;
                if (event.isPropagationStopped()) {
                  lastElement.addEventListener(type, stopPropagationCallback);
                }
                elem[type]();
                if (event.isPropagationStopped()) {
                  lastElement.removeEventListener(type, stopPropagationCallback);
                }
                jQuery.event.triggered = void 0;
                if (tmp) {
                  elem[ontype] = tmp;
                }
              }
            }
          }
          return event.result;
        },
        // Piggyback on a donor event to simulate a different one
        // Used only for `focus(in | out)` events
        simulate: function(type, elem, event) {
          var e = jQuery.extend(
            new jQuery.Event(),
            event,
            {
              type,
              isSimulated: true
            }
          );
          jQuery.event.trigger(e, null, elem);
        }
      });
      jQuery.fn.extend({
        trigger: function(type, data) {
          return this.each(function() {
            jQuery.event.trigger(type, data, this);
          });
        },
        triggerHandler: function(type, data) {
          var elem = this[0];
          if (elem) {
            return jQuery.event.trigger(type, data, elem, true);
          }
        }
      });
      var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
      function buildParams(prefix, obj, traditional, add) {
        var name;
        if (Array.isArray(obj)) {
          jQuery.each(obj, function(i, v) {
            if (traditional || rbracket.test(prefix)) {
              add(prefix, v);
            } else {
              buildParams(
                prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]",
                v,
                traditional,
                add
              );
            }
          });
        } else if (!traditional && toType(obj) === "object") {
          for (name in obj) {
            buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
          }
        } else {
          add(prefix, obj);
        }
      }
      jQuery.param = function(a, traditional) {
        var prefix, s = [], add = function(key, valueOrFunction) {
          var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
          s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
        };
        if (a == null) {
          return "";
        }
        if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
          jQuery.each(a, function() {
            add(this.name, this.value);
          });
        } else {
          for (prefix in a) {
            buildParams(prefix, a[prefix], traditional, add);
          }
        }
        return s.join("&");
      };
      jQuery.fn.extend({
        serialize: function() {
          return jQuery.param(this.serializeArray());
        },
        serializeArray: function() {
          return this.map(function() {
            var elements = jQuery.prop(this, "elements");
            return elements ? jQuery.makeArray(elements) : this;
          }).filter(function() {
            var type = this.type;
            return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
          }).map(function(_i, elem) {
            var val = jQuery(this).val();
            if (val == null) {
              return null;
            }
            if (Array.isArray(val)) {
              return jQuery.map(val, function(val2) {
                return { name: elem.name, value: val2.replace(rCRLF, "\r\n") };
              });
            }
            return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
          }).get();
        }
      });
      var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document2.createElement("a");
      originAnchor.href = location.href;
      function addToPrefiltersOrTransports(structure) {
        return function(dataTypeExpression, func) {
          if (typeof dataTypeExpression !== "string") {
            func = dataTypeExpression;
            dataTypeExpression = "*";
          }
          var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
          if (isFunction(func)) {
            while (dataType = dataTypes[i++]) {
              if (dataType[0] === "+") {
                dataType = dataType.slice(1) || "*";
                (structure[dataType] = structure[dataType] || []).unshift(func);
              } else {
                (structure[dataType] = structure[dataType] || []).push(func);
              }
            }
          }
        };
      }
      function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
        var inspected = {}, seekingTransport = structure === transports;
        function inspect(dataType) {
          var selected;
          inspected[dataType] = true;
          jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
            var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
            if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
              options.dataTypes.unshift(dataTypeOrTransport);
              inspect(dataTypeOrTransport);
              return false;
            } else if (seekingTransport) {
              return !(selected = dataTypeOrTransport);
            }
          });
          return selected;
        }
        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
      }
      function ajaxExtend(target, src) {
        var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src) {
          if (src[key] !== void 0) {
            (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
          }
        }
        if (deep) {
          jQuery.extend(true, target, deep);
        }
        return target;
      }
      function ajaxHandleResponses(s, jqXHR, responses) {
        var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes;
        while (dataTypes[0] === "*") {
          dataTypes.shift();
          if (ct === void 0) {
            ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
          }
        }
        if (ct) {
          for (type in contents) {
            if (contents[type] && contents[type].test(ct)) {
              dataTypes.unshift(type);
              break;
            }
          }
        }
        if (dataTypes[0] in responses) {
          finalDataType = dataTypes[0];
        } else {
          for (type in responses) {
            if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
              finalDataType = type;
              break;
            }
            if (!firstDataType) {
              firstDataType = type;
            }
          }
          finalDataType = finalDataType || firstDataType;
        }
        if (finalDataType) {
          if (finalDataType !== dataTypes[0]) {
            dataTypes.unshift(finalDataType);
          }
          return responses[finalDataType];
        }
      }
      function ajaxConvert(s, response, jqXHR, isSuccess) {
        var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
        if (dataTypes[1]) {
          for (conv in s.converters) {
            converters[conv.toLowerCase()] = s.converters[conv];
          }
        }
        current = dataTypes.shift();
        while (current) {
          if (s.responseFields[current]) {
            jqXHR[s.responseFields[current]] = response;
          }
          if (!prev && isSuccess && s.dataFilter) {
            response = s.dataFilter(response, s.dataType);
          }
          prev = current;
          current = dataTypes.shift();
          if (current) {
            if (current === "*") {
              current = prev;
            } else if (prev !== "*" && prev !== current) {
              conv = converters[prev + " " + current] || converters["* " + current];
              if (!conv) {
                for (conv2 in converters) {
                  tmp = conv2.split(" ");
                  if (tmp[1] === current) {
                    conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                    if (conv) {
                      if (conv === true) {
                        conv = converters[conv2];
                      } else if (converters[conv2] !== true) {
                        current = tmp[0];
                        dataTypes.unshift(tmp[1]);
                      }
                      break;
                    }
                  }
                }
              }
              if (conv !== true) {
                if (conv && s.throws) {
                  response = conv(response);
                } else {
                  try {
                    response = conv(response);
                  } catch (e) {
                    return {
                      state: "parsererror",
                      error: conv ? e : "No conversion from " + prev + " to " + current
                    };
                  }
                }
              }
            }
          }
        }
        return { state: "success", data: response };
      }
      jQuery.extend({
        // Counter for holding the number of active queries
        active: 0,
        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},
        ajaxSettings: {
          url: location.href,
          type: "GET",
          isLocal: rlocalProtocol.test(location.protocol),
          global: true,
          processData: true,
          async: true,
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          /*
          timeout: 0,
          data: null,
          dataType: null,
          username: null,
          password: null,
          cache: null,
          throws: false,
          traditional: false,
          headers: {},
          */
          accepts: {
            "*": allTypes,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
          },
          contents: {
            xml: /\bxml\b/,
            html: /\bhtml/,
            json: /\bjson\b/
          },
          responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON"
          },
          // Data converters
          // Keys separate source (or catchall "*") and destination types with a single space
          converters: {
            // Convert anything to text
            "* text": String,
            // Text to html (true = no transformation)
            "text html": true,
            // Evaluate text as a json expression
            "text json": JSON.parse,
            // Parse text as xml
            "text xml": jQuery.parseXML
          },
          // For options that shouldn't be deep extended:
          // you can add your own custom options here if
          // and when you create one that shouldn't be
          // deep extended (see ajaxExtend)
          flatOptions: {
            url: true,
            context: true
          }
        },
        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function(target, settings) {
          return settings ? (
            // Building a settings object
            ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings)
          ) : (
            // Extending ajaxSettings
            ajaxExtend(jQuery.ajaxSettings, target)
          );
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        // Main method
        ajax: function(url, options) {
          if (typeof url === "object") {
            options = url;
            url = void 0;
          }
          options = options || {};
          var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed2, fireGlobals, i, uncached, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
            readyState: 0,
            // Builds headers hashtable if needed
            getResponseHeader: function(key) {
              var match;
              if (completed2) {
                if (!responseHeaders) {
                  responseHeaders = {};
                  while (match = rheaders.exec(responseHeadersString)) {
                    responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
                  }
                }
                match = responseHeaders[key.toLowerCase() + " "];
              }
              return match == null ? null : match.join(", ");
            },
            // Raw string
            getAllResponseHeaders: function() {
              return completed2 ? responseHeadersString : null;
            },
            // Caches the header
            setRequestHeader: function(name, value) {
              if (completed2 == null) {
                name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
                requestHeaders[name] = value;
              }
              return this;
            },
            // Overrides response content-type header
            overrideMimeType: function(type) {
              if (completed2 == null) {
                s.mimeType = type;
              }
              return this;
            },
            // Status-dependent callbacks
            statusCode: function(map) {
              var code;
              if (map) {
                if (completed2) {
                  jqXHR.always(map[jqXHR.status]);
                } else {
                  for (code in map) {
                    statusCode[code] = [statusCode[code], map[code]];
                  }
                }
              }
              return this;
            },
            // Cancel the request
            abort: function(statusText) {
              var finalText = statusText || strAbort;
              if (transport) {
                transport.abort(finalText);
              }
              done(0, finalText);
              return this;
            }
          };
          deferred.promise(jqXHR);
          s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//");
          s.type = options.method || options.type || s.method || s.type;
          s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
          if (s.crossDomain == null) {
            urlAnchor = document2.createElement("a");
            try {
              urlAnchor.href = s.url;
              urlAnchor.href = urlAnchor.href;
              s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
            } catch (e) {
              s.crossDomain = true;
            }
          }
          if (s.data && s.processData && typeof s.data !== "string") {
            s.data = jQuery.param(s.data, s.traditional);
          }
          inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
          if (completed2) {
            return jqXHR;
          }
          fireGlobals = jQuery.event && s.global;
          if (fireGlobals && jQuery.active++ === 0) {
            jQuery.event.trigger("ajaxStart");
          }
          s.type = s.type.toUpperCase();
          s.hasContent = !rnoContent.test(s.type);
          cacheURL = s.url.replace(rhash, "");
          if (!s.hasContent) {
            uncached = s.url.slice(cacheURL.length);
            if (s.data && (s.processData || typeof s.data === "string")) {
              cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
              delete s.data;
            }
            if (s.cache === false) {
              cacheURL = cacheURL.replace(rantiCache, "$1");
              uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached;
            }
            s.url = cacheURL + uncached;
          } else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
            s.data = s.data.replace(r20, "+");
          }
          if (s.ifModified) {
            if (jQuery.lastModified[cacheURL]) {
              jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
            }
            if (jQuery.etag[cacheURL]) {
              jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
            }
          }
          if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
            jqXHR.setRequestHeader("Content-Type", s.contentType);
          }
          jqXHR.setRequestHeader(
            "Accept",
            s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]
          );
          for (i in s.headers) {
            jqXHR.setRequestHeader(i, s.headers[i]);
          }
          if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed2)) {
            return jqXHR.abort();
          }
          strAbort = "abort";
          completeDeferred.add(s.complete);
          jqXHR.done(s.success);
          jqXHR.fail(s.error);
          transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
          if (!transport) {
            done(-1, "No Transport");
          } else {
            jqXHR.readyState = 1;
            if (fireGlobals) {
              globalEventContext.trigger("ajaxSend", [jqXHR, s]);
            }
            if (completed2) {
              return jqXHR;
            }
            if (s.async && s.timeout > 0) {
              timeoutTimer = window2.setTimeout(function() {
                jqXHR.abort("timeout");
              }, s.timeout);
            }
            try {
              completed2 = false;
              transport.send(requestHeaders, done);
            } catch (e) {
              if (completed2) {
                throw e;
              }
              done(-1, e);
            }
          }
          function done(status, nativeStatusText, responses, headers) {
            var isSuccess, success, error, response, modified, statusText = nativeStatusText;
            if (completed2) {
              return;
            }
            completed2 = true;
            if (timeoutTimer) {
              window2.clearTimeout(timeoutTimer);
            }
            transport = void 0;
            responseHeadersString = headers || "";
            jqXHR.readyState = status > 0 ? 4 : 0;
            isSuccess = status >= 200 && status < 300 || status === 304;
            if (responses) {
              response = ajaxHandleResponses(s, jqXHR, responses);
            }
            if (!isSuccess && jQuery.inArray("script", s.dataTypes) > -1 && jQuery.inArray("json", s.dataTypes) < 0) {
              s.converters["text script"] = function() {
              };
            }
            response = ajaxConvert(s, response, jqXHR, isSuccess);
            if (isSuccess) {
              if (s.ifModified) {
                modified = jqXHR.getResponseHeader("Last-Modified");
                if (modified) {
                  jQuery.lastModified[cacheURL] = modified;
                }
                modified = jqXHR.getResponseHeader("etag");
                if (modified) {
                  jQuery.etag[cacheURL] = modified;
                }
              }
              if (status === 204 || s.type === "HEAD") {
                statusText = "nocontent";
              } else if (status === 304) {
                statusText = "notmodified";
              } else {
                statusText = response.state;
                success = response.data;
                error = response.error;
                isSuccess = !error;
              }
            } else {
              error = statusText;
              if (status || !statusText) {
                statusText = "error";
                if (status < 0) {
                  status = 0;
                }
              }
            }
            jqXHR.status = status;
            jqXHR.statusText = (nativeStatusText || statusText) + "";
            if (isSuccess) {
              deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
            } else {
              deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
            }
            jqXHR.statusCode(statusCode);
            statusCode = void 0;
            if (fireGlobals) {
              globalEventContext.trigger(
                isSuccess ? "ajaxSuccess" : "ajaxError",
                [jqXHR, s, isSuccess ? success : error]
              );
            }
            completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
            if (fireGlobals) {
              globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
              if (!--jQuery.active) {
                jQuery.event.trigger("ajaxStop");
              }
            }
          }
          return jqXHR;
        },
        getJSON: function(url, data, callback) {
          return jQuery.get(url, data, callback, "json");
        },
        getScript: function(url, callback) {
          return jQuery.get(url, void 0, callback, "script");
        }
      });
      jQuery.each(["get", "post"], function(_i, method) {
        jQuery[method] = function(url, data, callback, type) {
          if (isFunction(data)) {
            type = type || callback;
            callback = data;
            data = void 0;
          }
          return jQuery.ajax(jQuery.extend({
            url,
            type: method,
            dataType: type,
            data,
            success: callback
          }, jQuery.isPlainObject(url) && url));
        };
      });
      jQuery.ajaxPrefilter(function(s) {
        var i;
        for (i in s.headers) {
          if (i.toLowerCase() === "content-type") {
            s.contentType = s.headers[i] || "";
          }
        }
      });
      jQuery._evalUrl = function(url, options, doc) {
        return jQuery.ajax({
          url,
          // Make this explicit, since user can override this through ajaxSetup (trac-11264)
          type: "GET",
          dataType: "script",
          cache: true,
          async: false,
          global: false,
          // Only evaluate the response if it is successful (gh-4126)
          // dataFilter is not invoked for failure responses, so using it instead
          // of the default converter is kludgy but it works.
          converters: {
            "text script": function() {
            }
          },
          dataFilter: function(response) {
            jQuery.globalEval(response, options, doc);
          }
        });
      };
      jQuery.fn.extend({
        wrapAll: function(html) {
          var wrap;
          if (this[0]) {
            if (isFunction(html)) {
              html = html.call(this[0]);
            }
            wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
            if (this[0].parentNode) {
              wrap.insertBefore(this[0]);
            }
            wrap.map(function() {
              var elem = this;
              while (elem.firstElementChild) {
                elem = elem.firstElementChild;
              }
              return elem;
            }).append(this);
          }
          return this;
        },
        wrapInner: function(html) {
          if (isFunction(html)) {
            return this.each(function(i) {
              jQuery(this).wrapInner(html.call(this, i));
            });
          }
          return this.each(function() {
            var self = jQuery(this), contents = self.contents();
            if (contents.length) {
              contents.wrapAll(html);
            } else {
              self.append(html);
            }
          });
        },
        wrap: function(html) {
          var htmlIsFunction = isFunction(html);
          return this.each(function(i) {
            jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
          });
        },
        unwrap: function(selector) {
          this.parent(selector).not("body").each(function() {
            jQuery(this).replaceWith(this.childNodes);
          });
          return this;
        }
      });
      jQuery.expr.pseudos.hidden = function(elem) {
        return !jQuery.expr.pseudos.visible(elem);
      };
      jQuery.expr.pseudos.visible = function(elem) {
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
      };
      jQuery.ajaxSettings.xhr = function() {
        try {
          return new window2.XMLHttpRequest();
        } catch (e) {
        }
      };
      var xhrSuccessStatus = {
        // File protocol always yields status code 0, assume 200
        0: 200,
        // Support: IE <=9 only
        // trac-1450: sometimes IE returns 1223 when it should be 204
        1223: 204
      }, xhrSupported = jQuery.ajaxSettings.xhr();
      support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
      support.ajax = xhrSupported = !!xhrSupported;
      jQuery.ajaxTransport(function(options) {
        var callback, errorCallback;
        if (support.cors || xhrSupported && !options.crossDomain) {
          return {
            send: function(headers, complete) {
              var i, xhr = options.xhr();
              xhr.open(
                options.type,
                options.url,
                options.async,
                options.username,
                options.password
              );
              if (options.xhrFields) {
                for (i in options.xhrFields) {
                  xhr[i] = options.xhrFields[i];
                }
              }
              if (options.mimeType && xhr.overrideMimeType) {
                xhr.overrideMimeType(options.mimeType);
              }
              if (!options.crossDomain && !headers["X-Requested-With"]) {
                headers["X-Requested-With"] = "XMLHttpRequest";
              }
              for (i in headers) {
                xhr.setRequestHeader(i, headers[i]);
              }
              callback = function(type) {
                return function() {
                  if (callback) {
                    callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;
                    if (type === "abort") {
                      xhr.abort();
                    } else if (type === "error") {
                      if (typeof xhr.status !== "number") {
                        complete(0, "error");
                      } else {
                        complete(
                          // File: protocol always yields status 0; see trac-8605, trac-14207
                          xhr.status,
                          xhr.statusText
                        );
                      }
                    } else {
                      complete(
                        xhrSuccessStatus[xhr.status] || xhr.status,
                        xhr.statusText,
                        // Support: IE <=9 only
                        // IE9 has no XHR2 but throws on binary (trac-11426)
                        // For XHR2 non-text, let the caller handle it (gh-2498)
                        (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText },
                        xhr.getAllResponseHeaders()
                      );
                    }
                  }
                };
              };
              xhr.onload = callback();
              errorCallback = xhr.onerror = xhr.ontimeout = callback("error");
              if (xhr.onabort !== void 0) {
                xhr.onabort = errorCallback;
              } else {
                xhr.onreadystatechange = function() {
                  if (xhr.readyState === 4) {
                    window2.setTimeout(function() {
                      if (callback) {
                        errorCallback();
                      }
                    });
                  }
                };
              }
              callback = callback("abort");
              try {
                xhr.send(options.hasContent && options.data || null);
              } catch (e) {
                if (callback) {
                  throw e;
                }
              }
            },
            abort: function() {
              if (callback) {
                callback();
              }
            }
          };
        }
      });
      jQuery.ajaxPrefilter(function(s) {
        if (s.crossDomain) {
          s.contents.script = false;
        }
      });
      jQuery.ajaxSetup({
        accepts: {
          script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
          script: /\b(?:java|ecma)script\b/
        },
        converters: {
          "text script": function(text) {
            jQuery.globalEval(text);
            return text;
          }
        }
      });
      jQuery.ajaxPrefilter("script", function(s) {
        if (s.cache === void 0) {
          s.cache = false;
        }
        if (s.crossDomain) {
          s.type = "GET";
        }
      });
      jQuery.ajaxTransport("script", function(s) {
        if (s.crossDomain || s.scriptAttrs) {
          var script, callback;
          return {
            send: function(_, complete) {
              script = jQuery("<script>").attr(s.scriptAttrs || {}).prop({ charset: s.scriptCharset, src: s.url }).on("load error", callback = function(evt) {
                script.remove();
                callback = null;
                if (evt) {
                  complete(evt.type === "error" ? 404 : 200, evt.type);
                }
              });
              document2.head.appendChild(script[0]);
            },
            abort: function() {
              if (callback) {
                callback();
              }
            }
          };
        }
      });
      var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
      jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
          var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce.guid++;
          this[callback] = true;
          return callback;
        }
      });
      jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");
        if (jsonProp || s.dataTypes[0] === "jsonp") {
          callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
          if (jsonProp) {
            s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
          } else if (s.jsonp !== false) {
            s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
          }
          s.converters["script json"] = function() {
            if (!responseContainer) {
              jQuery.error(callbackName + " was not called");
            }
            return responseContainer[0];
          };
          s.dataTypes[0] = "json";
          overwritten = window2[callbackName];
          window2[callbackName] = function() {
            responseContainer = arguments;
          };
          jqXHR.always(function() {
            if (overwritten === void 0) {
              jQuery(window2).removeProp(callbackName);
            } else {
              window2[callbackName] = overwritten;
            }
            if (s[callbackName]) {
              s.jsonpCallback = originalSettings.jsonpCallback;
              oldCallbacks.push(callbackName);
            }
            if (responseContainer && isFunction(overwritten)) {
              overwritten(responseContainer[0]);
            }
            responseContainer = overwritten = void 0;
          });
          return "script";
        }
      });
      support.createHTMLDocument = (function() {
        var body = document2.implementation.createHTMLDocument("").body;
        body.innerHTML = "<form></form><form></form>";
        return body.childNodes.length === 2;
      })();
      jQuery.parseHTML = function(data, context, keepScripts) {
        if (typeof data !== "string") {
          return [];
        }
        if (typeof context === "boolean") {
          keepScripts = context;
          context = false;
        }
        var base, parsed, scripts;
        if (!context) {
          if (support.createHTMLDocument) {
            context = document2.implementation.createHTMLDocument("");
            base = context.createElement("base");
            base.href = document2.location.href;
            context.head.appendChild(base);
          } else {
            context = document2;
          }
        }
        parsed = rsingleTag.exec(data);
        scripts = !keepScripts && [];
        if (parsed) {
          return [context.createElement(parsed[1])];
        }
        parsed = buildFragment([data], context, scripts);
        if (scripts && scripts.length) {
          jQuery(scripts).remove();
        }
        return jQuery.merge([], parsed.childNodes);
      };
      jQuery.fn.load = function(url, params, callback) {
        var selector, type, response, self = this, off = url.indexOf(" ");
        if (off > -1) {
          selector = stripAndCollapse(url.slice(off));
          url = url.slice(0, off);
        }
        if (isFunction(params)) {
          callback = params;
          params = void 0;
        } else if (params && typeof params === "object") {
          type = "POST";
        }
        if (self.length > 0) {
          jQuery.ajax({
            url,
            // If "type" variable is undefined, then "GET" method will be used.
            // Make value of this field explicit since
            // user can override it through ajaxSetup method
            type: type || "GET",
            dataType: "html",
            data: params
          }).done(function(responseText) {
            response = arguments;
            self.html(selector ? (
              // If a selector was specified, locate the right elements in a dummy div
              // Exclude scripts to avoid IE 'Permission Denied' errors
              jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector)
            ) : (
              // Otherwise use the full result
              responseText
            ));
          }).always(callback && function(jqXHR, status) {
            self.each(function() {
              callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
            });
          });
        }
        return this;
      };
      jQuery.expr.pseudos.animated = function(elem) {
        return jQuery.grep(jQuery.timers, function(fn) {
          return elem === fn.elem;
        }).length;
      };
      jQuery.offset = {
        setOffset: function(elem, options, i) {
          var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
          if (position === "static") {
            elem.style.position = "relative";
          }
          curOffset = curElem.offset();
          curCSSTop = jQuery.css(elem, "top");
          curCSSLeft = jQuery.css(elem, "left");
          calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
          if (calculatePosition) {
            curPosition = curElem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;
          } else {
            curTop = parseFloat(curCSSTop) || 0;
            curLeft = parseFloat(curCSSLeft) || 0;
          }
          if (isFunction(options)) {
            options = options.call(elem, i, jQuery.extend({}, curOffset));
          }
          if (options.top != null) {
            props.top = options.top - curOffset.top + curTop;
          }
          if (options.left != null) {
            props.left = options.left - curOffset.left + curLeft;
          }
          if ("using" in options) {
            options.using.call(elem, props);
          } else {
            curElem.css(props);
          }
        }
      };
      jQuery.fn.extend({
        // offset() relates an element's border box to the document origin
        offset: function(options) {
          if (arguments.length) {
            return options === void 0 ? this : this.each(function(i) {
              jQuery.offset.setOffset(this, options, i);
            });
          }
          var rect, win, elem = this[0];
          if (!elem) {
            return;
          }
          if (!elem.getClientRects().length) {
            return { top: 0, left: 0 };
          }
          rect = elem.getBoundingClientRect();
          win = elem.ownerDocument.defaultView;
          return {
            top: rect.top + win.pageYOffset,
            left: rect.left + win.pageXOffset
          };
        },
        // position() relates an element's margin box to its offset parent's padding box
        // This corresponds to the behavior of CSS absolute positioning
        position: function() {
          if (!this[0]) {
            return;
          }
          var offsetParent, offset, doc, elem = this[0], parentOffset = { top: 0, left: 0 };
          if (jQuery.css(elem, "position") === "fixed") {
            offset = elem.getBoundingClientRect();
          } else {
            offset = this.offset();
            doc = elem.ownerDocument;
            offsetParent = elem.offsetParent || doc.documentElement;
            while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery.css(offsetParent, "position") === "static") {
              offsetParent = offsetParent.parentNode;
            }
            if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
              parentOffset = jQuery(offsetParent).offset();
              parentOffset.top += jQuery.css(offsetParent, "borderTopWidth", true);
              parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", true);
            }
          }
          return {
            top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
            left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
          };
        },
        // This method will return documentElement in the following cases:
        // 1) For the element inside the iframe without offsetParent, this method will return
        //    documentElement of the parent window
        // 2) For the hidden or detached element
        // 3) For body or html element, i.e. in case of the html node - it will return itself
        //
        // but those exceptions were never presented as a real life use-cases
        // and might be considered as more preferable results.
        //
        // This logic, however, is not guaranteed and can change at any point in the future
        offsetParent: function() {
          return this.map(function() {
            var offsetParent = this.offsetParent;
            while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
              offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || documentElement;
          });
        }
      });
      jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(method, prop) {
        var top = "pageYOffset" === prop;
        jQuery.fn[method] = function(val) {
          return access(this, function(elem, method2, val2) {
            var win;
            if (isWindow(elem)) {
              win = elem;
            } else if (elem.nodeType === 9) {
              win = elem.defaultView;
            }
            if (val2 === void 0) {
              return win ? win[prop] : elem[method2];
            }
            if (win) {
              win.scrollTo(
                !top ? val2 : win.pageXOffset,
                top ? val2 : win.pageYOffset
              );
            } else {
              elem[method2] = val2;
            }
          }, method, val, arguments.length);
        };
      });
      jQuery.each(["top", "left"], function(_i, prop) {
        jQuery.cssHooks[prop] = addGetHookIf(
          support.pixelPosition,
          function(elem, computed) {
            if (computed) {
              computed = curCSS(elem, prop);
              return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
            }
          }
        );
      });
      jQuery.each({ Height: "height", Width: "width" }, function(name, type) {
        jQuery.each({
          padding: "inner" + name,
          content: type,
          "": "outer" + name
        }, function(defaultExtra, funcName) {
          jQuery.fn[funcName] = function(margin, value) {
            var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
            return access(this, function(elem, type2, value2) {
              var doc;
              if (isWindow(elem)) {
                return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
              }
              if (elem.nodeType === 9) {
                doc = elem.documentElement;
                return Math.max(
                  elem.body["scroll" + name],
                  doc["scroll" + name],
                  elem.body["offset" + name],
                  doc["offset" + name],
                  doc["client" + name]
                );
              }
              return value2 === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                jQuery.css(elem, type2, extra)
              ) : (
                // Set width or height on the element
                jQuery.style(elem, type2, value2, extra)
              );
            }, type, chainable ? margin : void 0, chainable);
          };
        });
      });
      jQuery.each([
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend"
      ], function(_i, type) {
        jQuery.fn[type] = function(fn) {
          return this.on(type, fn);
        };
      });
      jQuery.fn.extend({
        bind: function(types, data, fn) {
          return this.on(types, null, data, fn);
        },
        unbind: function(types, fn) {
          return this.off(types, null, fn);
        },
        delegate: function(selector, types, data, fn) {
          return this.on(types, selector, data, fn);
        },
        undelegate: function(selector, types, fn) {
          return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        },
        hover: function(fnOver, fnOut) {
          return this.on("mouseenter", fnOver).on("mouseleave", fnOut || fnOver);
        }
      });
      jQuery.each(
        "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
        function(_i, name) {
          jQuery.fn[name] = function(data, fn) {
            return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
          };
        }
      );
      var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
      jQuery.proxy = function(fn, context) {
        var tmp, args, proxy;
        if (typeof context === "string") {
          tmp = fn[context];
          context = fn;
          fn = tmp;
        }
        if (!isFunction(fn)) {
          return void 0;
        }
        args = slice.call(arguments, 2);
        proxy = function() {
          return fn.apply(context || this, args.concat(slice.call(arguments)));
        };
        proxy.guid = fn.guid = fn.guid || jQuery.guid++;
        return proxy;
      };
      jQuery.holdReady = function(hold) {
        if (hold) {
          jQuery.readyWait++;
        } else {
          jQuery.ready(true);
        }
      };
      jQuery.isArray = Array.isArray;
      jQuery.parseJSON = JSON.parse;
      jQuery.nodeName = nodeName;
      jQuery.isFunction = isFunction;
      jQuery.isWindow = isWindow;
      jQuery.camelCase = camelCase;
      jQuery.type = toType;
      jQuery.now = Date.now;
      jQuery.isNumeric = function(obj) {
        var type = jQuery.type(obj);
        return (type === "number" || type === "string") && // parseFloat NaNs numeric-cast false positives ("")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        !isNaN(obj - parseFloat(obj));
      };
      jQuery.trim = function(text) {
        return text == null ? "" : (text + "").replace(rtrim, "$1");
      };
      if (typeof define === "function" && define.amd) {
        define("jquery", [], function() {
          return jQuery;
        });
      }
      var _jQuery = window2.jQuery, _$ = window2.$;
      jQuery.noConflict = function(deep) {
        if (window2.$ === jQuery) {
          window2.$ = _$;
        }
        if (deep && window2.jQuery === jQuery) {
          window2.jQuery = _jQuery;
        }
        return jQuery;
      };
      if (typeof noGlobal === "undefined") {
        window2.jQuery = window2.$ = jQuery;
      }
      return jQuery;
    });
  }
});

// node_modules/@bric/rex-core/src/service-worker.mts
var REXServiceWorkerModule = class _REXServiceWorkerModule {
  constructor() {
    __publicField(this, "instantiationTarget");
    if (new.target === _REXServiceWorkerModule) {
      throw new Error("Cannot be instantiated");
    }
    this.instantiationTarget = new.target.toString();
  }
  setup() {
    console.log(`TODO: Implement in ${this.instantiationTarget}...`);
  }
  logEvent(event) {
    if (event !== void 0) {
      console.log('REXServiceWorkerModule: implement "logEvent" in subclass...');
    }
  }
  moduleName() {
    return "REXServiceWorkerModule";
  }
  handleMessage(message, sender, sendResponse) {
    return false;
  }
  toString() {
    return this.moduleName();
  }
  refreshConfiguration() {
  }
  configurationDetails() {
    return {
      module_name: {
        enabled: "Boolean, true if module is active, false otherwise.",
        other_params: "Add JSON-serializable parameters to extend configuration."
      }
    };
  }
};
var REX_DATABASE_VERSION = 1;
var registeredExtensionModules = [];
function registerREXModule(rexModule) {
  if (!registeredExtensionModules.includes(rexModule)) {
    registeredExtensionModules.push(rexModule);
    rexModule.setup();
  }
}
function dispatchEvent(event) {
  for (const extensionModule of registeredExtensionModules) {
    if (extensionModule.logEvent !== void 0) {
      extensionModule.logEvent(event);
    }
  }
}
var rexDatabase = null;
var rexCorePlugin = {
  // TODO rename to "engine" or something...
  openExtensionWindow: () => {
    console.log("openExtensionWindow");
    const optionsUrl = globalThis.chrome.runtime.getURL("index.html");
    globalThis.chrome.tabs.query({}, function(extensionTabs) {
      if (extensionTabs !== void 0) {
        for (const extensionTab of extensionTabs) {
          if (optionsUrl === extensionTab.url) {
            globalThis.chrome.windows.remove(extensionTab.windowId);
          }
        }
      }
    });
    console.log("chrome.windows.create");
    globalThis.chrome.windows.create({
      height: 480,
      width: 640,
      type: "panel",
      url: optionsUrl
    });
  },
  setup: () => {
    console.log(`[rex-core] Running setup...`);
    globalThis.chrome.runtime.onInstalled.addListener(function(details) {
      console.log(`[rex-core] chrome.runtime.onInstalled.addListener`);
      rexCorePlugin.openExtensionWindow();
    });
    globalThis.chrome.action.onClicked.addListener(function(tab) {
      console.log(`[rex-core] chrome.action.onClicked.addListener`);
      rexCorePlugin.openExtensionWindow();
    });
    const loadedScripts = /* @__PURE__ */ new Set();
    globalThis.chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
      if (changeInfo.status === "complete") {
        loadedScripts.delete(`${tabId}-${tab.url}`);
      } else if (changeInfo.status === "loading" && loadedScripts.has(`${tabId}-${tab.url}`) === false) {
        loadedScripts.add(`${tabId}-${tab.url}`);
        if (tab.url !== void 0 && (tab.url.startsWith("https://") || tab.url.startsWith("http://"))) {
          globalThis.chrome.scripting.executeScript({
            target: {
              tabId,
              allFrames: true
            },
            files: ["/js/browser/bundle.js"]
          }, function(result) {
            console.log("[rex-core] Content script loaded.");
          });
        }
      }
    });
    console.log(`[rex-core] Registered message listener...`);
    globalThis.chrome.runtime.onMessage.addListener(rexCorePlugin.handleMessage);
    const request = indexedDB.open("rex_db", REX_DATABASE_VERSION);
    request.onerror = (event) => {
      console.error(`[rex-core] Unable to open REX database: ${event}`);
    };
    request.onsuccess = (event) => {
      rexDatabase = request.result;
      console.log(`[rex-core] Successfully opened REX database.`);
    };
    request.onupgradeneeded = (event) => {
      console.log(`[rex-core] Upgrade needed...`);
      console.log(event);
      rexDatabase = request.result;
      switch (event.oldVersion) {
        case 0: {
          const values = rexDatabase.createObjectStore("values");
          values.createIndex("key", "key", { unique: true });
          values.createIndex("value", "value", { unique: false });
          console.log(`[rex-core] Successfully upgraded the REX database.`);
        }
      }
    };
  },
  handleMessage: (message, sender, sendResponse) => {
    if (message.messageType == "loadInitialConfiguration") {
      rexCorePlugin.initializeConfiguration(message.configuration).then((response) => {
        sendResponse(response);
      });
      return true;
    }
    if (message.messageType == "updateConfiguration") {
      rexCorePlugin.updateConfiguration(message.configuration).then((response) => {
        sendResponse(response);
      });
      return true;
    }
    if (message.messageType === "fetchConfiguration") {
      rexCorePlugin.fetchConfiguration().then((configuration) => {
        sendResponse(configuration);
      });
      return true;
    }
    if (message.messageType === "refreshConfiguration") {
      rexCorePlugin.fetchConfiguration().then((configuration) => {
        console.log("[rex-core] Fetched configuration:");
        console.log(configuration);
        globalThis.chrome.storage.local.get("rexIdentifier").then((response) => {
          const idResponse = response;
          const identifier = idResponse.rexIdentifier;
          const configUrlStr = configuration["configuration_url"];
          const configUrl = new URL(configUrlStr.replaceAll("<IDENTIFIER>", identifier));
          fetch(configUrl).then((response2) => {
            if (response2.ok) {
              response2.json().then((jsonData) => {
                console.log(`${configUrl}:`);
                console.log(jsonData);
                rexCorePlugin.updateConfiguration(jsonData).then((response3) => {
                  for (const extensionModule of registeredExtensionModules) {
                    extensionModule.refreshConfiguration();
                  }
                  sendResponse(jsonData);
                });
              });
            } else {
              sendResponse(null);
            }
          });
        });
      });
      return true;
    }
    if (message.messageType === "setIdentifier") {
      globalThis.chrome.storage.local.set({
        rexIdentifier: message.identifier
      }).then(() => {
        sendResponse(message.identifier);
      });
      return true;
    }
    if (message.messageType == "getIdentifier") {
      globalThis.chrome.storage.local.get("rexIdentifier").then((response) => {
        const idResponse = response;
        sendResponse(idResponse.rexIdentifier);
      });
      return true;
    }
    if (message.messageType == "openWindow") {
      rexCorePlugin.openExtensionWindow();
      return true;
    }
    if (message.messageType == "logEvent") {
      for (const extensionModule of registeredExtensionModules) {
        if (extensionModule.logEvent !== void 0) {
          extensionModule.logEvent(message.event);
        }
      }
      return true;
    }
    if (message.messageType == "fetchValue") {
      if (rexDatabase !== null) {
        const index = rexDatabase.transaction(["values"], "readonly").objectStore("values").index("key");
        const cursorRequest = index.openCursor(IDBKeyRange.only(message.key));
        cursorRequest.onsuccess = (event) => {
          if (event.target !== null) {
            const cursor = event.target["result"];
            if (cursor) {
              sendResponse(cursor.value.value);
            } else {
              sendResponse(null);
            }
          }
        };
        cursorRequest.onerror = (event) => {
          console.log(`fetch error for ${message.key}...`);
          console.log(event);
          sendResponse(null);
        };
        return true;
      }
    }
    if (message.messageType == "storeValue") {
      if (rexDatabase !== null) {
        const doInsert = () => {
          const newValue2 = {
            key: message.key,
            value: message.value
          };
          if (rexDatabase !== null) {
            const objectStore = rexDatabase.transaction(["values"], "readwrite").objectStore("values");
            const putRequest = objectStore.put(newValue2, newValue2.key);
            putRequest.onsuccess = function(putEvent) {
              console.log(`[rex-core] Value saved successfully. ${newValue2.key} = ${newValue2.value}.`);
              sendResponse(true);
            };
            putRequest.onerror = function(putEvent) {
              console.error(`[rex-core] Value NOT saved successfully. ${newValue2.key} = ${newValue2.value}.`);
              console.error(putEvent);
              sendResponse(false);
            };
          }
        };
        const newValue = {
          value: message.value
        };
        const index = rexDatabase.transaction(["values"], "readwrite").objectStore("values").index("key");
        const cursorRequest = index.openCursor(IDBKeyRange.only(message.key));
        cursorRequest.onsuccess = (event) => {
          console.log(`fetched for ${message.key}...`);
          console.log(event);
          if (event.target !== null) {
            const cursor = event.target["result"];
            if (cursor === null) {
              doInsert();
            } else {
              const updateRequest = cursor.update(newValue);
              updateRequest.onsuccess = function(updateEvent) {
                console.log(`[rex-core] Value saved successfully. ${message.key} = ${newValue.value}.`);
                sendResponse(true);
              };
              updateRequest.onerror = function(updateEvent) {
                console.error(`[rex-core] Value NOT saved successfully. ${message.key} = ${newValue.value}.`);
                console.error(updateEvent);
                sendResponse(false);
              };
            }
          }
        };
        cursorRequest.onerror = (event) => {
          doInsert();
        };
      }
      return true;
    }
    let handled = false;
    for (const extensionModule of registeredExtensionModules) {
      if (extensionModule.handleMessage !== void 0) {
        if (extensionModule.handleMessage(message, sender, sendResponse)) {
          handled = true;
          console.log(`[rex-core] ${extensionModule} handles message:`);
          console.log(message);
        }
      }
    }
    if (handled === false) {
      console.log(`[rex-core] Received unknown message:`);
      console.log(message);
    }
    return handled;
  },
  initializeConfiguration: (configuration) => {
    return new Promise((resolve) => {
      globalThis.chrome.storage.local.get("REXConfiguration").then((response) => {
        const configResponse = response;
        if (configResponse.REXConfiguration !== void 0) {
          resolve("Error: Configuration already initialized.");
        } else {
          globalThis.chrome.storage.local.set({
            REXConfiguration: configuration
          }).then(() => {
            resolve("Success: Configuration initialized.");
          });
        }
      });
    });
  },
  updateConfiguration: (configuration) => {
    return new Promise((resolve) => {
      globalThis.chrome.storage.local.set({
        REXConfiguration: configuration
      }).then(() => {
        resolve("Success: Configuration updated.");
      });
    });
  },
  fetchConfiguration() {
    return new Promise((resolve, reject) => {
      globalThis.chrome.storage.local.get("REXConfiguration").then((response) => {
        const idResponse = response;
        resolve(idResponse.REXConfiguration);
      });
    });
  }
};
var service_worker_default = rexCorePlugin;

// node_modules/psl/dist/psl.mjs
function U(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var C;
var F;
function $() {
  if (F) return C;
  F = 1;
  const e = 2147483647, s = 36, c = 1, o = 26, t = 38, d = 700, z = 72, y = 128, g2 = "-", H = /^xn--/, N = /[^\0-\x7F]/, R = /[\x2E\u3002\uFF0E\uFF61]/g, P = {
    overflow: "Overflow: input needs wider integers to process",
    "not-basic": "Illegal input >= 0x80 (not a basic code point)",
    "invalid-input": "Invalid input"
  }, _ = s - c, h = Math.floor, I = String.fromCharCode;
  function v(a) {
    throw new RangeError(P[a]);
  }
  function V(a, i) {
    const m = [];
    let n = a.length;
    for (; n--; )
      m[n] = i(a[n]);
    return m;
  }
  function L(a, i) {
    const m = a.split("@");
    let n = "";
    m.length > 1 && (n = m[0] + "@", a = m[1]), a = a.replace(R, ".");
    const r = a.split("."), p = V(r, i).join(".");
    return n + p;
  }
  function S(a) {
    const i = [];
    let m = 0;
    const n = a.length;
    for (; m < n; ) {
      const r = a.charCodeAt(m++);
      if (r >= 55296 && r <= 56319 && m < n) {
        const p = a.charCodeAt(m++);
        (p & 64512) == 56320 ? i.push(((r & 1023) << 10) + (p & 1023) + 65536) : (i.push(r), m--);
      } else
        i.push(r);
    }
    return i;
  }
  const G = (a) => String.fromCodePoint(...a), W = function(a) {
    return a >= 48 && a < 58 ? 26 + (a - 48) : a >= 65 && a < 91 ? a - 65 : a >= 97 && a < 123 ? a - 97 : s;
  }, D = function(a, i) {
    return a + 22 + 75 * (a < 26) - ((i != 0) << 5);
  }, T = function(a, i, m) {
    let n = 0;
    for (a = m ? h(a / d) : a >> 1, a += h(a / i); a > _ * o >> 1; n += s)
      a = h(a / _);
    return h(n + (_ + 1) * a / (a + t));
  }, E = function(a) {
    const i = [], m = a.length;
    let n = 0, r = y, p = z, j = a.lastIndexOf(g2);
    j < 0 && (j = 0);
    for (let u = 0; u < j; ++u)
      a.charCodeAt(u) >= 128 && v("not-basic"), i.push(a.charCodeAt(u));
    for (let u = j > 0 ? j + 1 : 0; u < m; ) {
      const k = n;
      for (let l = 1, b = s; ; b += s) {
        u >= m && v("invalid-input");
        const w = W(a.charCodeAt(u++));
        w >= s && v("invalid-input"), w > h((e - n) / l) && v("overflow"), n += w * l;
        const x = b <= p ? c : b >= p + o ? o : b - p;
        if (w < x)
          break;
        const q = s - x;
        l > h(e / q) && v("overflow"), l *= q;
      }
      const f = i.length + 1;
      p = T(n - k, f, k == 0), h(n / f) > e - r && v("overflow"), r += h(n / f), n %= f, i.splice(n++, 0, r);
    }
    return String.fromCodePoint(...i);
  }, B = function(a) {
    const i = [];
    a = S(a);
    const m = a.length;
    let n = y, r = 0, p = z;
    for (const k of a)
      k < 128 && i.push(I(k));
    const j = i.length;
    let u = j;
    for (j && i.push(g2); u < m; ) {
      let k = e;
      for (const l of a)
        l >= n && l < k && (k = l);
      const f = u + 1;
      k - n > h((e - r) / f) && v("overflow"), r += (k - n) * f, n = k;
      for (const l of a)
        if (l < n && ++r > e && v("overflow"), l === n) {
          let b = r;
          for (let w = s; ; w += s) {
            const x = w <= p ? c : w >= p + o ? o : w - p;
            if (b < x)
              break;
            const q = b - x, M = s - x;
            i.push(
              I(D(x + q % M, 0))
            ), b = h(q / M);
          }
          i.push(I(D(b, 0))), p = T(r, f, u === j), r = 0, ++u;
        }
      ++r, ++n;
    }
    return i.join("");
  };
  return C = {
    /**
     * A string representing the current Punycode.js version number.
     * @memberOf punycode
     * @type String
     */
    version: "2.3.1",
    /**
     * An object of methods to convert from JavaScript's internal character
     * representation (UCS-2) to Unicode code points, and back.
     * @see <https://mathiasbynens.be/notes/javascript-encoding>
     * @memberOf punycode
     * @type Object
     */
    ucs2: {
      decode: S,
      encode: G
    },
    decode: E,
    encode: B,
    toASCII: function(a) {
      return L(a, function(i) {
        return N.test(i) ? "xn--" + B(i) : i;
      });
    },
    toUnicode: function(a) {
      return L(a, function(i) {
        return H.test(i) ? E(i.slice(4).toLowerCase()) : i;
      });
    }
  }, C;
}
var J = $();
var A = /* @__PURE__ */ U(J);
var K = [
  "ac",
  "com.ac",
  "edu.ac",
  "gov.ac",
  "mil.ac",
  "net.ac",
  "org.ac",
  "ad",
  "ae",
  "ac.ae",
  "co.ae",
  "gov.ae",
  "mil.ae",
  "net.ae",
  "org.ae",
  "sch.ae",
  "aero",
  "airline.aero",
  "airport.aero",
  "accident-investigation.aero",
  "accident-prevention.aero",
  "aerobatic.aero",
  "aeroclub.aero",
  "aerodrome.aero",
  "agents.aero",
  "air-surveillance.aero",
  "air-traffic-control.aero",
  "aircraft.aero",
  "airtraffic.aero",
  "ambulance.aero",
  "association.aero",
  "author.aero",
  "ballooning.aero",
  "broker.aero",
  "caa.aero",
  "cargo.aero",
  "catering.aero",
  "certification.aero",
  "championship.aero",
  "charter.aero",
  "civilaviation.aero",
  "club.aero",
  "conference.aero",
  "consultant.aero",
  "consulting.aero",
  "control.aero",
  "council.aero",
  "crew.aero",
  "design.aero",
  "dgca.aero",
  "educator.aero",
  "emergency.aero",
  "engine.aero",
  "engineer.aero",
  "entertainment.aero",
  "equipment.aero",
  "exchange.aero",
  "express.aero",
  "federation.aero",
  "flight.aero",
  "freight.aero",
  "fuel.aero",
  "gliding.aero",
  "government.aero",
  "groundhandling.aero",
  "group.aero",
  "hanggliding.aero",
  "homebuilt.aero",
  "insurance.aero",
  "journal.aero",
  "journalist.aero",
  "leasing.aero",
  "logistics.aero",
  "magazine.aero",
  "maintenance.aero",
  "marketplace.aero",
  "media.aero",
  "microlight.aero",
  "modelling.aero",
  "navigation.aero",
  "parachuting.aero",
  "paragliding.aero",
  "passenger-association.aero",
  "pilot.aero",
  "press.aero",
  "production.aero",
  "recreation.aero",
  "repbody.aero",
  "res.aero",
  "research.aero",
  "rotorcraft.aero",
  "safety.aero",
  "scientist.aero",
  "services.aero",
  "show.aero",
  "skydiving.aero",
  "software.aero",
  "student.aero",
  "taxi.aero",
  "trader.aero",
  "trading.aero",
  "trainer.aero",
  "union.aero",
  "workinggroup.aero",
  "works.aero",
  "af",
  "com.af",
  "edu.af",
  "gov.af",
  "net.af",
  "org.af",
  "ag",
  "co.ag",
  "com.ag",
  "net.ag",
  "nom.ag",
  "org.ag",
  "ai",
  "com.ai",
  "net.ai",
  "off.ai",
  "org.ai",
  "al",
  "com.al",
  "edu.al",
  "gov.al",
  "mil.al",
  "net.al",
  "org.al",
  "am",
  "co.am",
  "com.am",
  "commune.am",
  "net.am",
  "org.am",
  "ao",
  "co.ao",
  "ed.ao",
  "edu.ao",
  "gov.ao",
  "gv.ao",
  "it.ao",
  "og.ao",
  "org.ao",
  "pb.ao",
  "aq",
  "ar",
  "bet.ar",
  "com.ar",
  "coop.ar",
  "edu.ar",
  "gob.ar",
  "gov.ar",
  "int.ar",
  "mil.ar",
  "musica.ar",
  "mutual.ar",
  "net.ar",
  "org.ar",
  "senasa.ar",
  "tur.ar",
  "arpa",
  "e164.arpa",
  "home.arpa",
  "in-addr.arpa",
  "ip6.arpa",
  "iris.arpa",
  "uri.arpa",
  "urn.arpa",
  "as",
  "gov.as",
  "asia",
  "at",
  "ac.at",
  "sth.ac.at",
  "co.at",
  "gv.at",
  "or.at",
  "au",
  "asn.au",
  "com.au",
  "edu.au",
  "gov.au",
  "id.au",
  "net.au",
  "org.au",
  "conf.au",
  "oz.au",
  "act.au",
  "nsw.au",
  "nt.au",
  "qld.au",
  "sa.au",
  "tas.au",
  "vic.au",
  "wa.au",
  "act.edu.au",
  "catholic.edu.au",
  "nsw.edu.au",
  "nt.edu.au",
  "qld.edu.au",
  "sa.edu.au",
  "tas.edu.au",
  "vic.edu.au",
  "wa.edu.au",
  "qld.gov.au",
  "sa.gov.au",
  "tas.gov.au",
  "vic.gov.au",
  "wa.gov.au",
  "schools.nsw.edu.au",
  "aw",
  "com.aw",
  "ax",
  "az",
  "biz.az",
  "com.az",
  "edu.az",
  "gov.az",
  "info.az",
  "int.az",
  "mil.az",
  "name.az",
  "net.az",
  "org.az",
  "pp.az",
  "pro.az",
  "ba",
  "com.ba",
  "edu.ba",
  "gov.ba",
  "mil.ba",
  "net.ba",
  "org.ba",
  "bb",
  "biz.bb",
  "co.bb",
  "com.bb",
  "edu.bb",
  "gov.bb",
  "info.bb",
  "net.bb",
  "org.bb",
  "store.bb",
  "tv.bb",
  "*.bd",
  "be",
  "ac.be",
  "bf",
  "gov.bf",
  "bg",
  "0.bg",
  "1.bg",
  "2.bg",
  "3.bg",
  "4.bg",
  "5.bg",
  "6.bg",
  "7.bg",
  "8.bg",
  "9.bg",
  "a.bg",
  "b.bg",
  "c.bg",
  "d.bg",
  "e.bg",
  "f.bg",
  "g.bg",
  "h.bg",
  "i.bg",
  "j.bg",
  "k.bg",
  "l.bg",
  "m.bg",
  "n.bg",
  "o.bg",
  "p.bg",
  "q.bg",
  "r.bg",
  "s.bg",
  "t.bg",
  "u.bg",
  "v.bg",
  "w.bg",
  "x.bg",
  "y.bg",
  "z.bg",
  "bh",
  "com.bh",
  "edu.bh",
  "gov.bh",
  "net.bh",
  "org.bh",
  "bi",
  "co.bi",
  "com.bi",
  "edu.bi",
  "or.bi",
  "org.bi",
  "biz",
  "bj",
  "africa.bj",
  "agro.bj",
  "architectes.bj",
  "assur.bj",
  "avocats.bj",
  "co.bj",
  "com.bj",
  "eco.bj",
  "econo.bj",
  "edu.bj",
  "info.bj",
  "loisirs.bj",
  "money.bj",
  "net.bj",
  "org.bj",
  "ote.bj",
  "restaurant.bj",
  "resto.bj",
  "tourism.bj",
  "univ.bj",
  "bm",
  "com.bm",
  "edu.bm",
  "gov.bm",
  "net.bm",
  "org.bm",
  "bn",
  "com.bn",
  "edu.bn",
  "gov.bn",
  "net.bn",
  "org.bn",
  "bo",
  "com.bo",
  "edu.bo",
  "gob.bo",
  "int.bo",
  "mil.bo",
  "net.bo",
  "org.bo",
  "tv.bo",
  "web.bo",
  "academia.bo",
  "agro.bo",
  "arte.bo",
  "blog.bo",
  "bolivia.bo",
  "ciencia.bo",
  "cooperativa.bo",
  "democracia.bo",
  "deporte.bo",
  "ecologia.bo",
  "economia.bo",
  "empresa.bo",
  "indigena.bo",
  "industria.bo",
  "info.bo",
  "medicina.bo",
  "movimiento.bo",
  "musica.bo",
  "natural.bo",
  "nombre.bo",
  "noticias.bo",
  "patria.bo",
  "plurinacional.bo",
  "politica.bo",
  "profesional.bo",
  "pueblo.bo",
  "revista.bo",
  "salud.bo",
  "tecnologia.bo",
  "tksat.bo",
  "transporte.bo",
  "wiki.bo",
  "br",
  "9guacu.br",
  "abc.br",
  "adm.br",
  "adv.br",
  "agr.br",
  "aju.br",
  "am.br",
  "anani.br",
  "aparecida.br",
  "app.br",
  "arq.br",
  "art.br",
  "ato.br",
  "b.br",
  "barueri.br",
  "belem.br",
  "bet.br",
  "bhz.br",
  "bib.br",
  "bio.br",
  "blog.br",
  "bmd.br",
  "boavista.br",
  "bsb.br",
  "campinagrande.br",
  "campinas.br",
  "caxias.br",
  "cim.br",
  "cng.br",
  "cnt.br",
  "com.br",
  "contagem.br",
  "coop.br",
  "coz.br",
  "cri.br",
  "cuiaba.br",
  "curitiba.br",
  "def.br",
  "des.br",
  "det.br",
  "dev.br",
  "ecn.br",
  "eco.br",
  "edu.br",
  "emp.br",
  "enf.br",
  "eng.br",
  "esp.br",
  "etc.br",
  "eti.br",
  "far.br",
  "feira.br",
  "flog.br",
  "floripa.br",
  "fm.br",
  "fnd.br",
  "fortal.br",
  "fot.br",
  "foz.br",
  "fst.br",
  "g12.br",
  "geo.br",
  "ggf.br",
  "goiania.br",
  "gov.br",
  "ac.gov.br",
  "al.gov.br",
  "am.gov.br",
  "ap.gov.br",
  "ba.gov.br",
  "ce.gov.br",
  "df.gov.br",
  "es.gov.br",
  "go.gov.br",
  "ma.gov.br",
  "mg.gov.br",
  "ms.gov.br",
  "mt.gov.br",
  "pa.gov.br",
  "pb.gov.br",
  "pe.gov.br",
  "pi.gov.br",
  "pr.gov.br",
  "rj.gov.br",
  "rn.gov.br",
  "ro.gov.br",
  "rr.gov.br",
  "rs.gov.br",
  "sc.gov.br",
  "se.gov.br",
  "sp.gov.br",
  "to.gov.br",
  "gru.br",
  "imb.br",
  "ind.br",
  "inf.br",
  "jab.br",
  "jampa.br",
  "jdf.br",
  "joinville.br",
  "jor.br",
  "jus.br",
  "leg.br",
  "leilao.br",
  "lel.br",
  "log.br",
  "londrina.br",
  "macapa.br",
  "maceio.br",
  "manaus.br",
  "maringa.br",
  "mat.br",
  "med.br",
  "mil.br",
  "morena.br",
  "mp.br",
  "mus.br",
  "natal.br",
  "net.br",
  "niteroi.br",
  "*.nom.br",
  "not.br",
  "ntr.br",
  "odo.br",
  "ong.br",
  "org.br",
  "osasco.br",
  "palmas.br",
  "poa.br",
  "ppg.br",
  "pro.br",
  "psc.br",
  "psi.br",
  "pvh.br",
  "qsl.br",
  "radio.br",
  "rec.br",
  "recife.br",
  "rep.br",
  "ribeirao.br",
  "rio.br",
  "riobranco.br",
  "riopreto.br",
  "salvador.br",
  "sampa.br",
  "santamaria.br",
  "santoandre.br",
  "saobernardo.br",
  "saogonca.br",
  "seg.br",
  "sjc.br",
  "slg.br",
  "slz.br",
  "sorocaba.br",
  "srv.br",
  "taxi.br",
  "tc.br",
  "tec.br",
  "teo.br",
  "the.br",
  "tmp.br",
  "trd.br",
  "tur.br",
  "tv.br",
  "udi.br",
  "vet.br",
  "vix.br",
  "vlog.br",
  "wiki.br",
  "zlg.br",
  "bs",
  "com.bs",
  "edu.bs",
  "gov.bs",
  "net.bs",
  "org.bs",
  "bt",
  "com.bt",
  "edu.bt",
  "gov.bt",
  "net.bt",
  "org.bt",
  "bv",
  "bw",
  "co.bw",
  "org.bw",
  "by",
  "gov.by",
  "mil.by",
  "com.by",
  "of.by",
  "bz",
  "co.bz",
  "com.bz",
  "edu.bz",
  "gov.bz",
  "net.bz",
  "org.bz",
  "ca",
  "ab.ca",
  "bc.ca",
  "mb.ca",
  "nb.ca",
  "nf.ca",
  "nl.ca",
  "ns.ca",
  "nt.ca",
  "nu.ca",
  "on.ca",
  "pe.ca",
  "qc.ca",
  "sk.ca",
  "yk.ca",
  "gc.ca",
  "cat",
  "cc",
  "cd",
  "gov.cd",
  "cf",
  "cg",
  "ch",
  "ci",
  "ac.ci",
  "a\xE9roport.ci",
  "asso.ci",
  "co.ci",
  "com.ci",
  "ed.ci",
  "edu.ci",
  "go.ci",
  "gouv.ci",
  "int.ci",
  "net.ci",
  "or.ci",
  "org.ci",
  "*.ck",
  "!www.ck",
  "cl",
  "co.cl",
  "gob.cl",
  "gov.cl",
  "mil.cl",
  "cm",
  "co.cm",
  "com.cm",
  "gov.cm",
  "net.cm",
  "cn",
  "ac.cn",
  "com.cn",
  "edu.cn",
  "gov.cn",
  "mil.cn",
  "net.cn",
  "org.cn",
  "\u516C\u53F8.cn",
  "\u7DB2\u7D61.cn",
  "\u7F51\u7EDC.cn",
  "ah.cn",
  "bj.cn",
  "cq.cn",
  "fj.cn",
  "gd.cn",
  "gs.cn",
  "gx.cn",
  "gz.cn",
  "ha.cn",
  "hb.cn",
  "he.cn",
  "hi.cn",
  "hk.cn",
  "hl.cn",
  "hn.cn",
  "jl.cn",
  "js.cn",
  "jx.cn",
  "ln.cn",
  "mo.cn",
  "nm.cn",
  "nx.cn",
  "qh.cn",
  "sc.cn",
  "sd.cn",
  "sh.cn",
  "sn.cn",
  "sx.cn",
  "tj.cn",
  "tw.cn",
  "xj.cn",
  "xz.cn",
  "yn.cn",
  "zj.cn",
  "co",
  "com.co",
  "edu.co",
  "gov.co",
  "mil.co",
  "net.co",
  "nom.co",
  "org.co",
  "com",
  "coop",
  "cr",
  "ac.cr",
  "co.cr",
  "ed.cr",
  "fi.cr",
  "go.cr",
  "or.cr",
  "sa.cr",
  "cu",
  "com.cu",
  "edu.cu",
  "gob.cu",
  "inf.cu",
  "nat.cu",
  "net.cu",
  "org.cu",
  "cv",
  "com.cv",
  "edu.cv",
  "id.cv",
  "int.cv",
  "net.cv",
  "nome.cv",
  "org.cv",
  "publ.cv",
  "cw",
  "com.cw",
  "edu.cw",
  "net.cw",
  "org.cw",
  "cx",
  "gov.cx",
  "cy",
  "ac.cy",
  "biz.cy",
  "com.cy",
  "ekloges.cy",
  "gov.cy",
  "ltd.cy",
  "mil.cy",
  "net.cy",
  "org.cy",
  "press.cy",
  "pro.cy",
  "tm.cy",
  "cz",
  "de",
  "dj",
  "dk",
  "dm",
  "co.dm",
  "com.dm",
  "edu.dm",
  "gov.dm",
  "net.dm",
  "org.dm",
  "do",
  "art.do",
  "com.do",
  "edu.do",
  "gob.do",
  "gov.do",
  "mil.do",
  "net.do",
  "org.do",
  "sld.do",
  "web.do",
  "dz",
  "art.dz",
  "asso.dz",
  "com.dz",
  "edu.dz",
  "gov.dz",
  "net.dz",
  "org.dz",
  "pol.dz",
  "soc.dz",
  "tm.dz",
  "ec",
  "com.ec",
  "edu.ec",
  "fin.ec",
  "gob.ec",
  "gov.ec",
  "info.ec",
  "k12.ec",
  "med.ec",
  "mil.ec",
  "net.ec",
  "org.ec",
  "pro.ec",
  "edu",
  "ee",
  "aip.ee",
  "com.ee",
  "edu.ee",
  "fie.ee",
  "gov.ee",
  "lib.ee",
  "med.ee",
  "org.ee",
  "pri.ee",
  "riik.ee",
  "eg",
  "ac.eg",
  "com.eg",
  "edu.eg",
  "eun.eg",
  "gov.eg",
  "info.eg",
  "me.eg",
  "mil.eg",
  "name.eg",
  "net.eg",
  "org.eg",
  "sci.eg",
  "sport.eg",
  "tv.eg",
  "*.er",
  "es",
  "com.es",
  "edu.es",
  "gob.es",
  "nom.es",
  "org.es",
  "et",
  "biz.et",
  "com.et",
  "edu.et",
  "gov.et",
  "info.et",
  "name.et",
  "net.et",
  "org.et",
  "eu",
  "fi",
  "aland.fi",
  "fj",
  "ac.fj",
  "biz.fj",
  "com.fj",
  "gov.fj",
  "info.fj",
  "mil.fj",
  "name.fj",
  "net.fj",
  "org.fj",
  "pro.fj",
  "*.fk",
  "fm",
  "com.fm",
  "edu.fm",
  "net.fm",
  "org.fm",
  "fo",
  "fr",
  "asso.fr",
  "com.fr",
  "gouv.fr",
  "nom.fr",
  "prd.fr",
  "tm.fr",
  "avoues.fr",
  "cci.fr",
  "greta.fr",
  "huissier-justice.fr",
  "ga",
  "gb",
  "gd",
  "edu.gd",
  "gov.gd",
  "ge",
  "com.ge",
  "edu.ge",
  "gov.ge",
  "net.ge",
  "org.ge",
  "pvt.ge",
  "school.ge",
  "gf",
  "gg",
  "co.gg",
  "net.gg",
  "org.gg",
  "gh",
  "com.gh",
  "edu.gh",
  "gov.gh",
  "mil.gh",
  "org.gh",
  "gi",
  "com.gi",
  "edu.gi",
  "gov.gi",
  "ltd.gi",
  "mod.gi",
  "org.gi",
  "gl",
  "co.gl",
  "com.gl",
  "edu.gl",
  "net.gl",
  "org.gl",
  "gm",
  "gn",
  "ac.gn",
  "com.gn",
  "edu.gn",
  "gov.gn",
  "net.gn",
  "org.gn",
  "gov",
  "gp",
  "asso.gp",
  "com.gp",
  "edu.gp",
  "mobi.gp",
  "net.gp",
  "org.gp",
  "gq",
  "gr",
  "com.gr",
  "edu.gr",
  "gov.gr",
  "net.gr",
  "org.gr",
  "gs",
  "gt",
  "com.gt",
  "edu.gt",
  "gob.gt",
  "ind.gt",
  "mil.gt",
  "net.gt",
  "org.gt",
  "gu",
  "com.gu",
  "edu.gu",
  "gov.gu",
  "guam.gu",
  "info.gu",
  "net.gu",
  "org.gu",
  "web.gu",
  "gw",
  "gy",
  "co.gy",
  "com.gy",
  "edu.gy",
  "gov.gy",
  "net.gy",
  "org.gy",
  "hk",
  "com.hk",
  "edu.hk",
  "gov.hk",
  "idv.hk",
  "net.hk",
  "org.hk",
  "\u4E2A\u4EBA.hk",
  "\u500B\u4EBA.hk",
  "\u516C\u53F8.hk",
  "\u653F\u5E9C.hk",
  "\u654E\u80B2.hk",
  "\u6559\u80B2.hk",
  "\u7B87\u4EBA.hk",
  "\u7D44\u7E54.hk",
  "\u7D44\u7EC7.hk",
  "\u7DB2\u7D61.hk",
  "\u7DB2\u7EDC.hk",
  "\u7EC4\u7E54.hk",
  "\u7EC4\u7EC7.hk",
  "\u7F51\u7D61.hk",
  "\u7F51\u7EDC.hk",
  "hm",
  "hn",
  "com.hn",
  "edu.hn",
  "gob.hn",
  "mil.hn",
  "net.hn",
  "org.hn",
  "hr",
  "com.hr",
  "from.hr",
  "iz.hr",
  "name.hr",
  "ht",
  "adult.ht",
  "art.ht",
  "asso.ht",
  "com.ht",
  "coop.ht",
  "edu.ht",
  "firm.ht",
  "gouv.ht",
  "info.ht",
  "med.ht",
  "net.ht",
  "org.ht",
  "perso.ht",
  "pol.ht",
  "pro.ht",
  "rel.ht",
  "shop.ht",
  "hu",
  "2000.hu",
  "agrar.hu",
  "bolt.hu",
  "casino.hu",
  "city.hu",
  "co.hu",
  "erotica.hu",
  "erotika.hu",
  "film.hu",
  "forum.hu",
  "games.hu",
  "hotel.hu",
  "info.hu",
  "ingatlan.hu",
  "jogasz.hu",
  "konyvelo.hu",
  "lakas.hu",
  "media.hu",
  "news.hu",
  "org.hu",
  "priv.hu",
  "reklam.hu",
  "sex.hu",
  "shop.hu",
  "sport.hu",
  "suli.hu",
  "szex.hu",
  "tm.hu",
  "tozsde.hu",
  "utazas.hu",
  "video.hu",
  "id",
  "ac.id",
  "biz.id",
  "co.id",
  "desa.id",
  "go.id",
  "mil.id",
  "my.id",
  "net.id",
  "or.id",
  "ponpes.id",
  "sch.id",
  "web.id",
  "ie",
  "gov.ie",
  "il",
  "ac.il",
  "co.il",
  "gov.il",
  "idf.il",
  "k12.il",
  "muni.il",
  "net.il",
  "org.il",
  "\u05D9\u05E9\u05E8\u05D0\u05DC",
  "\u05D0\u05E7\u05D3\u05DE\u05D9\u05D4.\u05D9\u05E9\u05E8\u05D0\u05DC",
  "\u05D9\u05E9\u05D5\u05D1.\u05D9\u05E9\u05E8\u05D0\u05DC",
  "\u05E6\u05D4\u05DC.\u05D9\u05E9\u05E8\u05D0\u05DC",
  "\u05DE\u05DE\u05E9\u05DC.\u05D9\u05E9\u05E8\u05D0\u05DC",
  "im",
  "ac.im",
  "co.im",
  "ltd.co.im",
  "plc.co.im",
  "com.im",
  "net.im",
  "org.im",
  "tt.im",
  "tv.im",
  "in",
  "5g.in",
  "6g.in",
  "ac.in",
  "ai.in",
  "am.in",
  "bihar.in",
  "biz.in",
  "business.in",
  "ca.in",
  "cn.in",
  "co.in",
  "com.in",
  "coop.in",
  "cs.in",
  "delhi.in",
  "dr.in",
  "edu.in",
  "er.in",
  "firm.in",
  "gen.in",
  "gov.in",
  "gujarat.in",
  "ind.in",
  "info.in",
  "int.in",
  "internet.in",
  "io.in",
  "me.in",
  "mil.in",
  "net.in",
  "nic.in",
  "org.in",
  "pg.in",
  "post.in",
  "pro.in",
  "res.in",
  "travel.in",
  "tv.in",
  "uk.in",
  "up.in",
  "us.in",
  "info",
  "int",
  "eu.int",
  "io",
  "co.io",
  "com.io",
  "edu.io",
  "gov.io",
  "mil.io",
  "net.io",
  "nom.io",
  "org.io",
  "iq",
  "com.iq",
  "edu.iq",
  "gov.iq",
  "mil.iq",
  "net.iq",
  "org.iq",
  "ir",
  "ac.ir",
  "co.ir",
  "gov.ir",
  "id.ir",
  "net.ir",
  "org.ir",
  "sch.ir",
  "\u0627\u06CC\u0631\u0627\u0646.ir",
  "\u0627\u064A\u0631\u0627\u0646.ir",
  "is",
  "it",
  "edu.it",
  "gov.it",
  "abr.it",
  "abruzzo.it",
  "aosta-valley.it",
  "aostavalley.it",
  "bas.it",
  "basilicata.it",
  "cal.it",
  "calabria.it",
  "cam.it",
  "campania.it",
  "emilia-romagna.it",
  "emiliaromagna.it",
  "emr.it",
  "friuli-v-giulia.it",
  "friuli-ve-giulia.it",
  "friuli-vegiulia.it",
  "friuli-venezia-giulia.it",
  "friuli-veneziagiulia.it",
  "friuli-vgiulia.it",
  "friuliv-giulia.it",
  "friulive-giulia.it",
  "friulivegiulia.it",
  "friulivenezia-giulia.it",
  "friuliveneziagiulia.it",
  "friulivgiulia.it",
  "fvg.it",
  "laz.it",
  "lazio.it",
  "lig.it",
  "liguria.it",
  "lom.it",
  "lombardia.it",
  "lombardy.it",
  "lucania.it",
  "mar.it",
  "marche.it",
  "mol.it",
  "molise.it",
  "piedmont.it",
  "piemonte.it",
  "pmn.it",
  "pug.it",
  "puglia.it",
  "sar.it",
  "sardegna.it",
  "sardinia.it",
  "sic.it",
  "sicilia.it",
  "sicily.it",
  "taa.it",
  "tos.it",
  "toscana.it",
  "trentin-sud-tirol.it",
  "trentin-s\xFCd-tirol.it",
  "trentin-sudtirol.it",
  "trentin-s\xFCdtirol.it",
  "trentin-sued-tirol.it",
  "trentin-suedtirol.it",
  "trentino.it",
  "trentino-a-adige.it",
  "trentino-aadige.it",
  "trentino-alto-adige.it",
  "trentino-altoadige.it",
  "trentino-s-tirol.it",
  "trentino-stirol.it",
  "trentino-sud-tirol.it",
  "trentino-s\xFCd-tirol.it",
  "trentino-sudtirol.it",
  "trentino-s\xFCdtirol.it",
  "trentino-sued-tirol.it",
  "trentino-suedtirol.it",
  "trentinoa-adige.it",
  "trentinoaadige.it",
  "trentinoalto-adige.it",
  "trentinoaltoadige.it",
  "trentinos-tirol.it",
  "trentinostirol.it",
  "trentinosud-tirol.it",
  "trentinos\xFCd-tirol.it",
  "trentinosudtirol.it",
  "trentinos\xFCdtirol.it",
  "trentinosued-tirol.it",
  "trentinosuedtirol.it",
  "trentinsud-tirol.it",
  "trentins\xFCd-tirol.it",
  "trentinsudtirol.it",
  "trentins\xFCdtirol.it",
  "trentinsued-tirol.it",
  "trentinsuedtirol.it",
  "tuscany.it",
  "umb.it",
  "umbria.it",
  "val-d-aosta.it",
  "val-daosta.it",
  "vald-aosta.it",
  "valdaosta.it",
  "valle-aosta.it",
  "valle-d-aosta.it",
  "valle-daosta.it",
  "valleaosta.it",
  "valled-aosta.it",
  "valledaosta.it",
  "vallee-aoste.it",
  "vall\xE9e-aoste.it",
  "vallee-d-aoste.it",
  "vall\xE9e-d-aoste.it",
  "valleeaoste.it",
  "vall\xE9eaoste.it",
  "valleedaoste.it",
  "vall\xE9edaoste.it",
  "vao.it",
  "vda.it",
  "ven.it",
  "veneto.it",
  "ag.it",
  "agrigento.it",
  "al.it",
  "alessandria.it",
  "alto-adige.it",
  "altoadige.it",
  "an.it",
  "ancona.it",
  "andria-barletta-trani.it",
  "andria-trani-barletta.it",
  "andriabarlettatrani.it",
  "andriatranibarletta.it",
  "ao.it",
  "aosta.it",
  "aoste.it",
  "ap.it",
  "aq.it",
  "aquila.it",
  "ar.it",
  "arezzo.it",
  "ascoli-piceno.it",
  "ascolipiceno.it",
  "asti.it",
  "at.it",
  "av.it",
  "avellino.it",
  "ba.it",
  "balsan.it",
  "balsan-sudtirol.it",
  "balsan-s\xFCdtirol.it",
  "balsan-suedtirol.it",
  "bari.it",
  "barletta-trani-andria.it",
  "barlettatraniandria.it",
  "belluno.it",
  "benevento.it",
  "bergamo.it",
  "bg.it",
  "bi.it",
  "biella.it",
  "bl.it",
  "bn.it",
  "bo.it",
  "bologna.it",
  "bolzano.it",
  "bolzano-altoadige.it",
  "bozen.it",
  "bozen-sudtirol.it",
  "bozen-s\xFCdtirol.it",
  "bozen-suedtirol.it",
  "br.it",
  "brescia.it",
  "brindisi.it",
  "bs.it",
  "bt.it",
  "bulsan.it",
  "bulsan-sudtirol.it",
  "bulsan-s\xFCdtirol.it",
  "bulsan-suedtirol.it",
  "bz.it",
  "ca.it",
  "cagliari.it",
  "caltanissetta.it",
  "campidano-medio.it",
  "campidanomedio.it",
  "campobasso.it",
  "carbonia-iglesias.it",
  "carboniaiglesias.it",
  "carrara-massa.it",
  "carraramassa.it",
  "caserta.it",
  "catania.it",
  "catanzaro.it",
  "cb.it",
  "ce.it",
  "cesena-forli.it",
  "cesena-forl\xEC.it",
  "cesenaforli.it",
  "cesenaforl\xEC.it",
  "ch.it",
  "chieti.it",
  "ci.it",
  "cl.it",
  "cn.it",
  "co.it",
  "como.it",
  "cosenza.it",
  "cr.it",
  "cremona.it",
  "crotone.it",
  "cs.it",
  "ct.it",
  "cuneo.it",
  "cz.it",
  "dell-ogliastra.it",
  "dellogliastra.it",
  "en.it",
  "enna.it",
  "fc.it",
  "fe.it",
  "fermo.it",
  "ferrara.it",
  "fg.it",
  "fi.it",
  "firenze.it",
  "florence.it",
  "fm.it",
  "foggia.it",
  "forli-cesena.it",
  "forl\xEC-cesena.it",
  "forlicesena.it",
  "forl\xECcesena.it",
  "fr.it",
  "frosinone.it",
  "ge.it",
  "genoa.it",
  "genova.it",
  "go.it",
  "gorizia.it",
  "gr.it",
  "grosseto.it",
  "iglesias-carbonia.it",
  "iglesiascarbonia.it",
  "im.it",
  "imperia.it",
  "is.it",
  "isernia.it",
  "kr.it",
  "la-spezia.it",
  "laquila.it",
  "laspezia.it",
  "latina.it",
  "lc.it",
  "le.it",
  "lecce.it",
  "lecco.it",
  "li.it",
  "livorno.it",
  "lo.it",
  "lodi.it",
  "lt.it",
  "lu.it",
  "lucca.it",
  "macerata.it",
  "mantova.it",
  "massa-carrara.it",
  "massacarrara.it",
  "matera.it",
  "mb.it",
  "mc.it",
  "me.it",
  "medio-campidano.it",
  "mediocampidano.it",
  "messina.it",
  "mi.it",
  "milan.it",
  "milano.it",
  "mn.it",
  "mo.it",
  "modena.it",
  "monza.it",
  "monza-brianza.it",
  "monza-e-della-brianza.it",
  "monzabrianza.it",
  "monzaebrianza.it",
  "monzaedellabrianza.it",
  "ms.it",
  "mt.it",
  "na.it",
  "naples.it",
  "napoli.it",
  "no.it",
  "novara.it",
  "nu.it",
  "nuoro.it",
  "og.it",
  "ogliastra.it",
  "olbia-tempio.it",
  "olbiatempio.it",
  "or.it",
  "oristano.it",
  "ot.it",
  "pa.it",
  "padova.it",
  "padua.it",
  "palermo.it",
  "parma.it",
  "pavia.it",
  "pc.it",
  "pd.it",
  "pe.it",
  "perugia.it",
  "pesaro-urbino.it",
  "pesarourbino.it",
  "pescara.it",
  "pg.it",
  "pi.it",
  "piacenza.it",
  "pisa.it",
  "pistoia.it",
  "pn.it",
  "po.it",
  "pordenone.it",
  "potenza.it",
  "pr.it",
  "prato.it",
  "pt.it",
  "pu.it",
  "pv.it",
  "pz.it",
  "ra.it",
  "ragusa.it",
  "ravenna.it",
  "rc.it",
  "re.it",
  "reggio-calabria.it",
  "reggio-emilia.it",
  "reggiocalabria.it",
  "reggioemilia.it",
  "rg.it",
  "ri.it",
  "rieti.it",
  "rimini.it",
  "rm.it",
  "rn.it",
  "ro.it",
  "roma.it",
  "rome.it",
  "rovigo.it",
  "sa.it",
  "salerno.it",
  "sassari.it",
  "savona.it",
  "si.it",
  "siena.it",
  "siracusa.it",
  "so.it",
  "sondrio.it",
  "sp.it",
  "sr.it",
  "ss.it",
  "s\xFCdtirol.it",
  "suedtirol.it",
  "sv.it",
  "ta.it",
  "taranto.it",
  "te.it",
  "tempio-olbia.it",
  "tempioolbia.it",
  "teramo.it",
  "terni.it",
  "tn.it",
  "to.it",
  "torino.it",
  "tp.it",
  "tr.it",
  "trani-andria-barletta.it",
  "trani-barletta-andria.it",
  "traniandriabarletta.it",
  "tranibarlettaandria.it",
  "trapani.it",
  "trento.it",
  "treviso.it",
  "trieste.it",
  "ts.it",
  "turin.it",
  "tv.it",
  "ud.it",
  "udine.it",
  "urbino-pesaro.it",
  "urbinopesaro.it",
  "va.it",
  "varese.it",
  "vb.it",
  "vc.it",
  "ve.it",
  "venezia.it",
  "venice.it",
  "verbania.it",
  "vercelli.it",
  "verona.it",
  "vi.it",
  "vibo-valentia.it",
  "vibovalentia.it",
  "vicenza.it",
  "viterbo.it",
  "vr.it",
  "vs.it",
  "vt.it",
  "vv.it",
  "je",
  "co.je",
  "net.je",
  "org.je",
  "*.jm",
  "jo",
  "agri.jo",
  "ai.jo",
  "com.jo",
  "edu.jo",
  "eng.jo",
  "fm.jo",
  "gov.jo",
  "mil.jo",
  "net.jo",
  "org.jo",
  "per.jo",
  "phd.jo",
  "sch.jo",
  "tv.jo",
  "jobs",
  "jp",
  "ac.jp",
  "ad.jp",
  "co.jp",
  "ed.jp",
  "go.jp",
  "gr.jp",
  "lg.jp",
  "ne.jp",
  "or.jp",
  "aichi.jp",
  "akita.jp",
  "aomori.jp",
  "chiba.jp",
  "ehime.jp",
  "fukui.jp",
  "fukuoka.jp",
  "fukushima.jp",
  "gifu.jp",
  "gunma.jp",
  "hiroshima.jp",
  "hokkaido.jp",
  "hyogo.jp",
  "ibaraki.jp",
  "ishikawa.jp",
  "iwate.jp",
  "kagawa.jp",
  "kagoshima.jp",
  "kanagawa.jp",
  "kochi.jp",
  "kumamoto.jp",
  "kyoto.jp",
  "mie.jp",
  "miyagi.jp",
  "miyazaki.jp",
  "nagano.jp",
  "nagasaki.jp",
  "nara.jp",
  "niigata.jp",
  "oita.jp",
  "okayama.jp",
  "okinawa.jp",
  "osaka.jp",
  "saga.jp",
  "saitama.jp",
  "shiga.jp",
  "shimane.jp",
  "shizuoka.jp",
  "tochigi.jp",
  "tokushima.jp",
  "tokyo.jp",
  "tottori.jp",
  "toyama.jp",
  "wakayama.jp",
  "yamagata.jp",
  "yamaguchi.jp",
  "yamanashi.jp",
  "\u4E09\u91CD.jp",
  "\u4EAC\u90FD.jp",
  "\u4F50\u8CC0.jp",
  "\u5175\u5EAB.jp",
  "\u5317\u6D77\u9053.jp",
  "\u5343\u8449.jp",
  "\u548C\u6B4C\u5C71.jp",
  "\u57FC\u7389.jp",
  "\u5927\u5206.jp",
  "\u5927\u962A.jp",
  "\u5948\u826F.jp",
  "\u5BAE\u57CE.jp",
  "\u5BAE\u5D0E.jp",
  "\u5BCC\u5C71.jp",
  "\u5C71\u53E3.jp",
  "\u5C71\u5F62.jp",
  "\u5C71\u68A8.jp",
  "\u5C90\u961C.jp",
  "\u5CA1\u5C71.jp",
  "\u5CA9\u624B.jp",
  "\u5CF6\u6839.jp",
  "\u5E83\u5CF6.jp",
  "\u5FB3\u5CF6.jp",
  "\u611B\u5A9B.jp",
  "\u611B\u77E5.jp",
  "\u65B0\u6F5F.jp",
  "\u6771\u4EAC.jp",
  "\u6803\u6728.jp",
  "\u6C96\u7E04.jp",
  "\u6ECB\u8CC0.jp",
  "\u718A\u672C.jp",
  "\u77F3\u5DDD.jp",
  "\u795E\u5948\u5DDD.jp",
  "\u798F\u4E95.jp",
  "\u798F\u5CA1.jp",
  "\u798F\u5CF6.jp",
  "\u79CB\u7530.jp",
  "\u7FA4\u99AC.jp",
  "\u8328\u57CE.jp",
  "\u9577\u5D0E.jp",
  "\u9577\u91CE.jp",
  "\u9752\u68EE.jp",
  "\u9759\u5CA1.jp",
  "\u9999\u5DDD.jp",
  "\u9AD8\u77E5.jp",
  "\u9CE5\u53D6.jp",
  "\u9E7F\u5150\u5CF6.jp",
  "*.kawasaki.jp",
  "!city.kawasaki.jp",
  "*.kitakyushu.jp",
  "!city.kitakyushu.jp",
  "*.kobe.jp",
  "!city.kobe.jp",
  "*.nagoya.jp",
  "!city.nagoya.jp",
  "*.sapporo.jp",
  "!city.sapporo.jp",
  "*.sendai.jp",
  "!city.sendai.jp",
  "*.yokohama.jp",
  "!city.yokohama.jp",
  "aisai.aichi.jp",
  "ama.aichi.jp",
  "anjo.aichi.jp",
  "asuke.aichi.jp",
  "chiryu.aichi.jp",
  "chita.aichi.jp",
  "fuso.aichi.jp",
  "gamagori.aichi.jp",
  "handa.aichi.jp",
  "hazu.aichi.jp",
  "hekinan.aichi.jp",
  "higashiura.aichi.jp",
  "ichinomiya.aichi.jp",
  "inazawa.aichi.jp",
  "inuyama.aichi.jp",
  "isshiki.aichi.jp",
  "iwakura.aichi.jp",
  "kanie.aichi.jp",
  "kariya.aichi.jp",
  "kasugai.aichi.jp",
  "kira.aichi.jp",
  "kiyosu.aichi.jp",
  "komaki.aichi.jp",
  "konan.aichi.jp",
  "kota.aichi.jp",
  "mihama.aichi.jp",
  "miyoshi.aichi.jp",
  "nishio.aichi.jp",
  "nisshin.aichi.jp",
  "obu.aichi.jp",
  "oguchi.aichi.jp",
  "oharu.aichi.jp",
  "okazaki.aichi.jp",
  "owariasahi.aichi.jp",
  "seto.aichi.jp",
  "shikatsu.aichi.jp",
  "shinshiro.aichi.jp",
  "shitara.aichi.jp",
  "tahara.aichi.jp",
  "takahama.aichi.jp",
  "tobishima.aichi.jp",
  "toei.aichi.jp",
  "togo.aichi.jp",
  "tokai.aichi.jp",
  "tokoname.aichi.jp",
  "toyoake.aichi.jp",
  "toyohashi.aichi.jp",
  "toyokawa.aichi.jp",
  "toyone.aichi.jp",
  "toyota.aichi.jp",
  "tsushima.aichi.jp",
  "yatomi.aichi.jp",
  "akita.akita.jp",
  "daisen.akita.jp",
  "fujisato.akita.jp",
  "gojome.akita.jp",
  "hachirogata.akita.jp",
  "happou.akita.jp",
  "higashinaruse.akita.jp",
  "honjo.akita.jp",
  "honjyo.akita.jp",
  "ikawa.akita.jp",
  "kamikoani.akita.jp",
  "kamioka.akita.jp",
  "katagami.akita.jp",
  "kazuno.akita.jp",
  "kitaakita.akita.jp",
  "kosaka.akita.jp",
  "kyowa.akita.jp",
  "misato.akita.jp",
  "mitane.akita.jp",
  "moriyoshi.akita.jp",
  "nikaho.akita.jp",
  "noshiro.akita.jp",
  "odate.akita.jp",
  "oga.akita.jp",
  "ogata.akita.jp",
  "semboku.akita.jp",
  "yokote.akita.jp",
  "yurihonjo.akita.jp",
  "aomori.aomori.jp",
  "gonohe.aomori.jp",
  "hachinohe.aomori.jp",
  "hashikami.aomori.jp",
  "hiranai.aomori.jp",
  "hirosaki.aomori.jp",
  "itayanagi.aomori.jp",
  "kuroishi.aomori.jp",
  "misawa.aomori.jp",
  "mutsu.aomori.jp",
  "nakadomari.aomori.jp",
  "noheji.aomori.jp",
  "oirase.aomori.jp",
  "owani.aomori.jp",
  "rokunohe.aomori.jp",
  "sannohe.aomori.jp",
  "shichinohe.aomori.jp",
  "shingo.aomori.jp",
  "takko.aomori.jp",
  "towada.aomori.jp",
  "tsugaru.aomori.jp",
  "tsuruta.aomori.jp",
  "abiko.chiba.jp",
  "asahi.chiba.jp",
  "chonan.chiba.jp",
  "chosei.chiba.jp",
  "choshi.chiba.jp",
  "chuo.chiba.jp",
  "funabashi.chiba.jp",
  "futtsu.chiba.jp",
  "hanamigawa.chiba.jp",
  "ichihara.chiba.jp",
  "ichikawa.chiba.jp",
  "ichinomiya.chiba.jp",
  "inzai.chiba.jp",
  "isumi.chiba.jp",
  "kamagaya.chiba.jp",
  "kamogawa.chiba.jp",
  "kashiwa.chiba.jp",
  "katori.chiba.jp",
  "katsuura.chiba.jp",
  "kimitsu.chiba.jp",
  "kisarazu.chiba.jp",
  "kozaki.chiba.jp",
  "kujukuri.chiba.jp",
  "kyonan.chiba.jp",
  "matsudo.chiba.jp",
  "midori.chiba.jp",
  "mihama.chiba.jp",
  "minamiboso.chiba.jp",
  "mobara.chiba.jp",
  "mutsuzawa.chiba.jp",
  "nagara.chiba.jp",
  "nagareyama.chiba.jp",
  "narashino.chiba.jp",
  "narita.chiba.jp",
  "noda.chiba.jp",
  "oamishirasato.chiba.jp",
  "omigawa.chiba.jp",
  "onjuku.chiba.jp",
  "otaki.chiba.jp",
  "sakae.chiba.jp",
  "sakura.chiba.jp",
  "shimofusa.chiba.jp",
  "shirako.chiba.jp",
  "shiroi.chiba.jp",
  "shisui.chiba.jp",
  "sodegaura.chiba.jp",
  "sosa.chiba.jp",
  "tako.chiba.jp",
  "tateyama.chiba.jp",
  "togane.chiba.jp",
  "tohnosho.chiba.jp",
  "tomisato.chiba.jp",
  "urayasu.chiba.jp",
  "yachimata.chiba.jp",
  "yachiyo.chiba.jp",
  "yokaichiba.chiba.jp",
  "yokoshibahikari.chiba.jp",
  "yotsukaido.chiba.jp",
  "ainan.ehime.jp",
  "honai.ehime.jp",
  "ikata.ehime.jp",
  "imabari.ehime.jp",
  "iyo.ehime.jp",
  "kamijima.ehime.jp",
  "kihoku.ehime.jp",
  "kumakogen.ehime.jp",
  "masaki.ehime.jp",
  "matsuno.ehime.jp",
  "matsuyama.ehime.jp",
  "namikata.ehime.jp",
  "niihama.ehime.jp",
  "ozu.ehime.jp",
  "saijo.ehime.jp",
  "seiyo.ehime.jp",
  "shikokuchuo.ehime.jp",
  "tobe.ehime.jp",
  "toon.ehime.jp",
  "uchiko.ehime.jp",
  "uwajima.ehime.jp",
  "yawatahama.ehime.jp",
  "echizen.fukui.jp",
  "eiheiji.fukui.jp",
  "fukui.fukui.jp",
  "ikeda.fukui.jp",
  "katsuyama.fukui.jp",
  "mihama.fukui.jp",
  "minamiechizen.fukui.jp",
  "obama.fukui.jp",
  "ohi.fukui.jp",
  "ono.fukui.jp",
  "sabae.fukui.jp",
  "sakai.fukui.jp",
  "takahama.fukui.jp",
  "tsuruga.fukui.jp",
  "wakasa.fukui.jp",
  "ashiya.fukuoka.jp",
  "buzen.fukuoka.jp",
  "chikugo.fukuoka.jp",
  "chikuho.fukuoka.jp",
  "chikujo.fukuoka.jp",
  "chikushino.fukuoka.jp",
  "chikuzen.fukuoka.jp",
  "chuo.fukuoka.jp",
  "dazaifu.fukuoka.jp",
  "fukuchi.fukuoka.jp",
  "hakata.fukuoka.jp",
  "higashi.fukuoka.jp",
  "hirokawa.fukuoka.jp",
  "hisayama.fukuoka.jp",
  "iizuka.fukuoka.jp",
  "inatsuki.fukuoka.jp",
  "kaho.fukuoka.jp",
  "kasuga.fukuoka.jp",
  "kasuya.fukuoka.jp",
  "kawara.fukuoka.jp",
  "keisen.fukuoka.jp",
  "koga.fukuoka.jp",
  "kurate.fukuoka.jp",
  "kurogi.fukuoka.jp",
  "kurume.fukuoka.jp",
  "minami.fukuoka.jp",
  "miyako.fukuoka.jp",
  "miyama.fukuoka.jp",
  "miyawaka.fukuoka.jp",
  "mizumaki.fukuoka.jp",
  "munakata.fukuoka.jp",
  "nakagawa.fukuoka.jp",
  "nakama.fukuoka.jp",
  "nishi.fukuoka.jp",
  "nogata.fukuoka.jp",
  "ogori.fukuoka.jp",
  "okagaki.fukuoka.jp",
  "okawa.fukuoka.jp",
  "oki.fukuoka.jp",
  "omuta.fukuoka.jp",
  "onga.fukuoka.jp",
  "onojo.fukuoka.jp",
  "oto.fukuoka.jp",
  "saigawa.fukuoka.jp",
  "sasaguri.fukuoka.jp",
  "shingu.fukuoka.jp",
  "shinyoshitomi.fukuoka.jp",
  "shonai.fukuoka.jp",
  "soeda.fukuoka.jp",
  "sue.fukuoka.jp",
  "tachiarai.fukuoka.jp",
  "tagawa.fukuoka.jp",
  "takata.fukuoka.jp",
  "toho.fukuoka.jp",
  "toyotsu.fukuoka.jp",
  "tsuiki.fukuoka.jp",
  "ukiha.fukuoka.jp",
  "umi.fukuoka.jp",
  "usui.fukuoka.jp",
  "yamada.fukuoka.jp",
  "yame.fukuoka.jp",
  "yanagawa.fukuoka.jp",
  "yukuhashi.fukuoka.jp",
  "aizubange.fukushima.jp",
  "aizumisato.fukushima.jp",
  "aizuwakamatsu.fukushima.jp",
  "asakawa.fukushima.jp",
  "bandai.fukushima.jp",
  "date.fukushima.jp",
  "fukushima.fukushima.jp",
  "furudono.fukushima.jp",
  "futaba.fukushima.jp",
  "hanawa.fukushima.jp",
  "higashi.fukushima.jp",
  "hirata.fukushima.jp",
  "hirono.fukushima.jp",
  "iitate.fukushima.jp",
  "inawashiro.fukushima.jp",
  "ishikawa.fukushima.jp",
  "iwaki.fukushima.jp",
  "izumizaki.fukushima.jp",
  "kagamiishi.fukushima.jp",
  "kaneyama.fukushima.jp",
  "kawamata.fukushima.jp",
  "kitakata.fukushima.jp",
  "kitashiobara.fukushima.jp",
  "koori.fukushima.jp",
  "koriyama.fukushima.jp",
  "kunimi.fukushima.jp",
  "miharu.fukushima.jp",
  "mishima.fukushima.jp",
  "namie.fukushima.jp",
  "nango.fukushima.jp",
  "nishiaizu.fukushima.jp",
  "nishigo.fukushima.jp",
  "okuma.fukushima.jp",
  "omotego.fukushima.jp",
  "ono.fukushima.jp",
  "otama.fukushima.jp",
  "samegawa.fukushima.jp",
  "shimogo.fukushima.jp",
  "shirakawa.fukushima.jp",
  "showa.fukushima.jp",
  "soma.fukushima.jp",
  "sukagawa.fukushima.jp",
  "taishin.fukushima.jp",
  "tamakawa.fukushima.jp",
  "tanagura.fukushima.jp",
  "tenei.fukushima.jp",
  "yabuki.fukushima.jp",
  "yamato.fukushima.jp",
  "yamatsuri.fukushima.jp",
  "yanaizu.fukushima.jp",
  "yugawa.fukushima.jp",
  "anpachi.gifu.jp",
  "ena.gifu.jp",
  "gifu.gifu.jp",
  "ginan.gifu.jp",
  "godo.gifu.jp",
  "gujo.gifu.jp",
  "hashima.gifu.jp",
  "hichiso.gifu.jp",
  "hida.gifu.jp",
  "higashishirakawa.gifu.jp",
  "ibigawa.gifu.jp",
  "ikeda.gifu.jp",
  "kakamigahara.gifu.jp",
  "kani.gifu.jp",
  "kasahara.gifu.jp",
  "kasamatsu.gifu.jp",
  "kawaue.gifu.jp",
  "kitagata.gifu.jp",
  "mino.gifu.jp",
  "minokamo.gifu.jp",
  "mitake.gifu.jp",
  "mizunami.gifu.jp",
  "motosu.gifu.jp",
  "nakatsugawa.gifu.jp",
  "ogaki.gifu.jp",
  "sakahogi.gifu.jp",
  "seki.gifu.jp",
  "sekigahara.gifu.jp",
  "shirakawa.gifu.jp",
  "tajimi.gifu.jp",
  "takayama.gifu.jp",
  "tarui.gifu.jp",
  "toki.gifu.jp",
  "tomika.gifu.jp",
  "wanouchi.gifu.jp",
  "yamagata.gifu.jp",
  "yaotsu.gifu.jp",
  "yoro.gifu.jp",
  "annaka.gunma.jp",
  "chiyoda.gunma.jp",
  "fujioka.gunma.jp",
  "higashiagatsuma.gunma.jp",
  "isesaki.gunma.jp",
  "itakura.gunma.jp",
  "kanna.gunma.jp",
  "kanra.gunma.jp",
  "katashina.gunma.jp",
  "kawaba.gunma.jp",
  "kiryu.gunma.jp",
  "kusatsu.gunma.jp",
  "maebashi.gunma.jp",
  "meiwa.gunma.jp",
  "midori.gunma.jp",
  "minakami.gunma.jp",
  "naganohara.gunma.jp",
  "nakanojo.gunma.jp",
  "nanmoku.gunma.jp",
  "numata.gunma.jp",
  "oizumi.gunma.jp",
  "ora.gunma.jp",
  "ota.gunma.jp",
  "shibukawa.gunma.jp",
  "shimonita.gunma.jp",
  "shinto.gunma.jp",
  "showa.gunma.jp",
  "takasaki.gunma.jp",
  "takayama.gunma.jp",
  "tamamura.gunma.jp",
  "tatebayashi.gunma.jp",
  "tomioka.gunma.jp",
  "tsukiyono.gunma.jp",
  "tsumagoi.gunma.jp",
  "ueno.gunma.jp",
  "yoshioka.gunma.jp",
  "asaminami.hiroshima.jp",
  "daiwa.hiroshima.jp",
  "etajima.hiroshima.jp",
  "fuchu.hiroshima.jp",
  "fukuyama.hiroshima.jp",
  "hatsukaichi.hiroshima.jp",
  "higashihiroshima.hiroshima.jp",
  "hongo.hiroshima.jp",
  "jinsekikogen.hiroshima.jp",
  "kaita.hiroshima.jp",
  "kui.hiroshima.jp",
  "kumano.hiroshima.jp",
  "kure.hiroshima.jp",
  "mihara.hiroshima.jp",
  "miyoshi.hiroshima.jp",
  "naka.hiroshima.jp",
  "onomichi.hiroshima.jp",
  "osakikamijima.hiroshima.jp",
  "otake.hiroshima.jp",
  "saka.hiroshima.jp",
  "sera.hiroshima.jp",
  "seranishi.hiroshima.jp",
  "shinichi.hiroshima.jp",
  "shobara.hiroshima.jp",
  "takehara.hiroshima.jp",
  "abashiri.hokkaido.jp",
  "abira.hokkaido.jp",
  "aibetsu.hokkaido.jp",
  "akabira.hokkaido.jp",
  "akkeshi.hokkaido.jp",
  "asahikawa.hokkaido.jp",
  "ashibetsu.hokkaido.jp",
  "ashoro.hokkaido.jp",
  "assabu.hokkaido.jp",
  "atsuma.hokkaido.jp",
  "bibai.hokkaido.jp",
  "biei.hokkaido.jp",
  "bifuka.hokkaido.jp",
  "bihoro.hokkaido.jp",
  "biratori.hokkaido.jp",
  "chippubetsu.hokkaido.jp",
  "chitose.hokkaido.jp",
  "date.hokkaido.jp",
  "ebetsu.hokkaido.jp",
  "embetsu.hokkaido.jp",
  "eniwa.hokkaido.jp",
  "erimo.hokkaido.jp",
  "esan.hokkaido.jp",
  "esashi.hokkaido.jp",
  "fukagawa.hokkaido.jp",
  "fukushima.hokkaido.jp",
  "furano.hokkaido.jp",
  "furubira.hokkaido.jp",
  "haboro.hokkaido.jp",
  "hakodate.hokkaido.jp",
  "hamatonbetsu.hokkaido.jp",
  "hidaka.hokkaido.jp",
  "higashikagura.hokkaido.jp",
  "higashikawa.hokkaido.jp",
  "hiroo.hokkaido.jp",
  "hokuryu.hokkaido.jp",
  "hokuto.hokkaido.jp",
  "honbetsu.hokkaido.jp",
  "horokanai.hokkaido.jp",
  "horonobe.hokkaido.jp",
  "ikeda.hokkaido.jp",
  "imakane.hokkaido.jp",
  "ishikari.hokkaido.jp",
  "iwamizawa.hokkaido.jp",
  "iwanai.hokkaido.jp",
  "kamifurano.hokkaido.jp",
  "kamikawa.hokkaido.jp",
  "kamishihoro.hokkaido.jp",
  "kamisunagawa.hokkaido.jp",
  "kamoenai.hokkaido.jp",
  "kayabe.hokkaido.jp",
  "kembuchi.hokkaido.jp",
  "kikonai.hokkaido.jp",
  "kimobetsu.hokkaido.jp",
  "kitahiroshima.hokkaido.jp",
  "kitami.hokkaido.jp",
  "kiyosato.hokkaido.jp",
  "koshimizu.hokkaido.jp",
  "kunneppu.hokkaido.jp",
  "kuriyama.hokkaido.jp",
  "kuromatsunai.hokkaido.jp",
  "kushiro.hokkaido.jp",
  "kutchan.hokkaido.jp",
  "kyowa.hokkaido.jp",
  "mashike.hokkaido.jp",
  "matsumae.hokkaido.jp",
  "mikasa.hokkaido.jp",
  "minamifurano.hokkaido.jp",
  "mombetsu.hokkaido.jp",
  "moseushi.hokkaido.jp",
  "mukawa.hokkaido.jp",
  "muroran.hokkaido.jp",
  "naie.hokkaido.jp",
  "nakagawa.hokkaido.jp",
  "nakasatsunai.hokkaido.jp",
  "nakatombetsu.hokkaido.jp",
  "nanae.hokkaido.jp",
  "nanporo.hokkaido.jp",
  "nayoro.hokkaido.jp",
  "nemuro.hokkaido.jp",
  "niikappu.hokkaido.jp",
  "niki.hokkaido.jp",
  "nishiokoppe.hokkaido.jp",
  "noboribetsu.hokkaido.jp",
  "numata.hokkaido.jp",
  "obihiro.hokkaido.jp",
  "obira.hokkaido.jp",
  "oketo.hokkaido.jp",
  "okoppe.hokkaido.jp",
  "otaru.hokkaido.jp",
  "otobe.hokkaido.jp",
  "otofuke.hokkaido.jp",
  "otoineppu.hokkaido.jp",
  "oumu.hokkaido.jp",
  "ozora.hokkaido.jp",
  "pippu.hokkaido.jp",
  "rankoshi.hokkaido.jp",
  "rebun.hokkaido.jp",
  "rikubetsu.hokkaido.jp",
  "rishiri.hokkaido.jp",
  "rishirifuji.hokkaido.jp",
  "saroma.hokkaido.jp",
  "sarufutsu.hokkaido.jp",
  "shakotan.hokkaido.jp",
  "shari.hokkaido.jp",
  "shibecha.hokkaido.jp",
  "shibetsu.hokkaido.jp",
  "shikabe.hokkaido.jp",
  "shikaoi.hokkaido.jp",
  "shimamaki.hokkaido.jp",
  "shimizu.hokkaido.jp",
  "shimokawa.hokkaido.jp",
  "shinshinotsu.hokkaido.jp",
  "shintoku.hokkaido.jp",
  "shiranuka.hokkaido.jp",
  "shiraoi.hokkaido.jp",
  "shiriuchi.hokkaido.jp",
  "sobetsu.hokkaido.jp",
  "sunagawa.hokkaido.jp",
  "taiki.hokkaido.jp",
  "takasu.hokkaido.jp",
  "takikawa.hokkaido.jp",
  "takinoue.hokkaido.jp",
  "teshikaga.hokkaido.jp",
  "tobetsu.hokkaido.jp",
  "tohma.hokkaido.jp",
  "tomakomai.hokkaido.jp",
  "tomari.hokkaido.jp",
  "toya.hokkaido.jp",
  "toyako.hokkaido.jp",
  "toyotomi.hokkaido.jp",
  "toyoura.hokkaido.jp",
  "tsubetsu.hokkaido.jp",
  "tsukigata.hokkaido.jp",
  "urakawa.hokkaido.jp",
  "urausu.hokkaido.jp",
  "uryu.hokkaido.jp",
  "utashinai.hokkaido.jp",
  "wakkanai.hokkaido.jp",
  "wassamu.hokkaido.jp",
  "yakumo.hokkaido.jp",
  "yoichi.hokkaido.jp",
  "aioi.hyogo.jp",
  "akashi.hyogo.jp",
  "ako.hyogo.jp",
  "amagasaki.hyogo.jp",
  "aogaki.hyogo.jp",
  "asago.hyogo.jp",
  "ashiya.hyogo.jp",
  "awaji.hyogo.jp",
  "fukusaki.hyogo.jp",
  "goshiki.hyogo.jp",
  "harima.hyogo.jp",
  "himeji.hyogo.jp",
  "ichikawa.hyogo.jp",
  "inagawa.hyogo.jp",
  "itami.hyogo.jp",
  "kakogawa.hyogo.jp",
  "kamigori.hyogo.jp",
  "kamikawa.hyogo.jp",
  "kasai.hyogo.jp",
  "kasuga.hyogo.jp",
  "kawanishi.hyogo.jp",
  "miki.hyogo.jp",
  "minamiawaji.hyogo.jp",
  "nishinomiya.hyogo.jp",
  "nishiwaki.hyogo.jp",
  "ono.hyogo.jp",
  "sanda.hyogo.jp",
  "sannan.hyogo.jp",
  "sasayama.hyogo.jp",
  "sayo.hyogo.jp",
  "shingu.hyogo.jp",
  "shinonsen.hyogo.jp",
  "shiso.hyogo.jp",
  "sumoto.hyogo.jp",
  "taishi.hyogo.jp",
  "taka.hyogo.jp",
  "takarazuka.hyogo.jp",
  "takasago.hyogo.jp",
  "takino.hyogo.jp",
  "tamba.hyogo.jp",
  "tatsuno.hyogo.jp",
  "toyooka.hyogo.jp",
  "yabu.hyogo.jp",
  "yashiro.hyogo.jp",
  "yoka.hyogo.jp",
  "yokawa.hyogo.jp",
  "ami.ibaraki.jp",
  "asahi.ibaraki.jp",
  "bando.ibaraki.jp",
  "chikusei.ibaraki.jp",
  "daigo.ibaraki.jp",
  "fujishiro.ibaraki.jp",
  "hitachi.ibaraki.jp",
  "hitachinaka.ibaraki.jp",
  "hitachiomiya.ibaraki.jp",
  "hitachiota.ibaraki.jp",
  "ibaraki.ibaraki.jp",
  "ina.ibaraki.jp",
  "inashiki.ibaraki.jp",
  "itako.ibaraki.jp",
  "iwama.ibaraki.jp",
  "joso.ibaraki.jp",
  "kamisu.ibaraki.jp",
  "kasama.ibaraki.jp",
  "kashima.ibaraki.jp",
  "kasumigaura.ibaraki.jp",
  "koga.ibaraki.jp",
  "miho.ibaraki.jp",
  "mito.ibaraki.jp",
  "moriya.ibaraki.jp",
  "naka.ibaraki.jp",
  "namegata.ibaraki.jp",
  "oarai.ibaraki.jp",
  "ogawa.ibaraki.jp",
  "omitama.ibaraki.jp",
  "ryugasaki.ibaraki.jp",
  "sakai.ibaraki.jp",
  "sakuragawa.ibaraki.jp",
  "shimodate.ibaraki.jp",
  "shimotsuma.ibaraki.jp",
  "shirosato.ibaraki.jp",
  "sowa.ibaraki.jp",
  "suifu.ibaraki.jp",
  "takahagi.ibaraki.jp",
  "tamatsukuri.ibaraki.jp",
  "tokai.ibaraki.jp",
  "tomobe.ibaraki.jp",
  "tone.ibaraki.jp",
  "toride.ibaraki.jp",
  "tsuchiura.ibaraki.jp",
  "tsukuba.ibaraki.jp",
  "uchihara.ibaraki.jp",
  "ushiku.ibaraki.jp",
  "yachiyo.ibaraki.jp",
  "yamagata.ibaraki.jp",
  "yawara.ibaraki.jp",
  "yuki.ibaraki.jp",
  "anamizu.ishikawa.jp",
  "hakui.ishikawa.jp",
  "hakusan.ishikawa.jp",
  "kaga.ishikawa.jp",
  "kahoku.ishikawa.jp",
  "kanazawa.ishikawa.jp",
  "kawakita.ishikawa.jp",
  "komatsu.ishikawa.jp",
  "nakanoto.ishikawa.jp",
  "nanao.ishikawa.jp",
  "nomi.ishikawa.jp",
  "nonoichi.ishikawa.jp",
  "noto.ishikawa.jp",
  "shika.ishikawa.jp",
  "suzu.ishikawa.jp",
  "tsubata.ishikawa.jp",
  "tsurugi.ishikawa.jp",
  "uchinada.ishikawa.jp",
  "wajima.ishikawa.jp",
  "fudai.iwate.jp",
  "fujisawa.iwate.jp",
  "hanamaki.iwate.jp",
  "hiraizumi.iwate.jp",
  "hirono.iwate.jp",
  "ichinohe.iwate.jp",
  "ichinoseki.iwate.jp",
  "iwaizumi.iwate.jp",
  "iwate.iwate.jp",
  "joboji.iwate.jp",
  "kamaishi.iwate.jp",
  "kanegasaki.iwate.jp",
  "karumai.iwate.jp",
  "kawai.iwate.jp",
  "kitakami.iwate.jp",
  "kuji.iwate.jp",
  "kunohe.iwate.jp",
  "kuzumaki.iwate.jp",
  "miyako.iwate.jp",
  "mizusawa.iwate.jp",
  "morioka.iwate.jp",
  "ninohe.iwate.jp",
  "noda.iwate.jp",
  "ofunato.iwate.jp",
  "oshu.iwate.jp",
  "otsuchi.iwate.jp",
  "rikuzentakata.iwate.jp",
  "shiwa.iwate.jp",
  "shizukuishi.iwate.jp",
  "sumita.iwate.jp",
  "tanohata.iwate.jp",
  "tono.iwate.jp",
  "yahaba.iwate.jp",
  "yamada.iwate.jp",
  "ayagawa.kagawa.jp",
  "higashikagawa.kagawa.jp",
  "kanonji.kagawa.jp",
  "kotohira.kagawa.jp",
  "manno.kagawa.jp",
  "marugame.kagawa.jp",
  "mitoyo.kagawa.jp",
  "naoshima.kagawa.jp",
  "sanuki.kagawa.jp",
  "tadotsu.kagawa.jp",
  "takamatsu.kagawa.jp",
  "tonosho.kagawa.jp",
  "uchinomi.kagawa.jp",
  "utazu.kagawa.jp",
  "zentsuji.kagawa.jp",
  "akune.kagoshima.jp",
  "amami.kagoshima.jp",
  "hioki.kagoshima.jp",
  "isa.kagoshima.jp",
  "isen.kagoshima.jp",
  "izumi.kagoshima.jp",
  "kagoshima.kagoshima.jp",
  "kanoya.kagoshima.jp",
  "kawanabe.kagoshima.jp",
  "kinko.kagoshima.jp",
  "kouyama.kagoshima.jp",
  "makurazaki.kagoshima.jp",
  "matsumoto.kagoshima.jp",
  "minamitane.kagoshima.jp",
  "nakatane.kagoshima.jp",
  "nishinoomote.kagoshima.jp",
  "satsumasendai.kagoshima.jp",
  "soo.kagoshima.jp",
  "tarumizu.kagoshima.jp",
  "yusui.kagoshima.jp",
  "aikawa.kanagawa.jp",
  "atsugi.kanagawa.jp",
  "ayase.kanagawa.jp",
  "chigasaki.kanagawa.jp",
  "ebina.kanagawa.jp",
  "fujisawa.kanagawa.jp",
  "hadano.kanagawa.jp",
  "hakone.kanagawa.jp",
  "hiratsuka.kanagawa.jp",
  "isehara.kanagawa.jp",
  "kaisei.kanagawa.jp",
  "kamakura.kanagawa.jp",
  "kiyokawa.kanagawa.jp",
  "matsuda.kanagawa.jp",
  "minamiashigara.kanagawa.jp",
  "miura.kanagawa.jp",
  "nakai.kanagawa.jp",
  "ninomiya.kanagawa.jp",
  "odawara.kanagawa.jp",
  "oi.kanagawa.jp",
  "oiso.kanagawa.jp",
  "sagamihara.kanagawa.jp",
  "samukawa.kanagawa.jp",
  "tsukui.kanagawa.jp",
  "yamakita.kanagawa.jp",
  "yamato.kanagawa.jp",
  "yokosuka.kanagawa.jp",
  "yugawara.kanagawa.jp",
  "zama.kanagawa.jp",
  "zushi.kanagawa.jp",
  "aki.kochi.jp",
  "geisei.kochi.jp",
  "hidaka.kochi.jp",
  "higashitsuno.kochi.jp",
  "ino.kochi.jp",
  "kagami.kochi.jp",
  "kami.kochi.jp",
  "kitagawa.kochi.jp",
  "kochi.kochi.jp",
  "mihara.kochi.jp",
  "motoyama.kochi.jp",
  "muroto.kochi.jp",
  "nahari.kochi.jp",
  "nakamura.kochi.jp",
  "nankoku.kochi.jp",
  "nishitosa.kochi.jp",
  "niyodogawa.kochi.jp",
  "ochi.kochi.jp",
  "okawa.kochi.jp",
  "otoyo.kochi.jp",
  "otsuki.kochi.jp",
  "sakawa.kochi.jp",
  "sukumo.kochi.jp",
  "susaki.kochi.jp",
  "tosa.kochi.jp",
  "tosashimizu.kochi.jp",
  "toyo.kochi.jp",
  "tsuno.kochi.jp",
  "umaji.kochi.jp",
  "yasuda.kochi.jp",
  "yusuhara.kochi.jp",
  "amakusa.kumamoto.jp",
  "arao.kumamoto.jp",
  "aso.kumamoto.jp",
  "choyo.kumamoto.jp",
  "gyokuto.kumamoto.jp",
  "kamiamakusa.kumamoto.jp",
  "kikuchi.kumamoto.jp",
  "kumamoto.kumamoto.jp",
  "mashiki.kumamoto.jp",
  "mifune.kumamoto.jp",
  "minamata.kumamoto.jp",
  "minamioguni.kumamoto.jp",
  "nagasu.kumamoto.jp",
  "nishihara.kumamoto.jp",
  "oguni.kumamoto.jp",
  "ozu.kumamoto.jp",
  "sumoto.kumamoto.jp",
  "takamori.kumamoto.jp",
  "uki.kumamoto.jp",
  "uto.kumamoto.jp",
  "yamaga.kumamoto.jp",
  "yamato.kumamoto.jp",
  "yatsushiro.kumamoto.jp",
  "ayabe.kyoto.jp",
  "fukuchiyama.kyoto.jp",
  "higashiyama.kyoto.jp",
  "ide.kyoto.jp",
  "ine.kyoto.jp",
  "joyo.kyoto.jp",
  "kameoka.kyoto.jp",
  "kamo.kyoto.jp",
  "kita.kyoto.jp",
  "kizu.kyoto.jp",
  "kumiyama.kyoto.jp",
  "kyotamba.kyoto.jp",
  "kyotanabe.kyoto.jp",
  "kyotango.kyoto.jp",
  "maizuru.kyoto.jp",
  "minami.kyoto.jp",
  "minamiyamashiro.kyoto.jp",
  "miyazu.kyoto.jp",
  "muko.kyoto.jp",
  "nagaokakyo.kyoto.jp",
  "nakagyo.kyoto.jp",
  "nantan.kyoto.jp",
  "oyamazaki.kyoto.jp",
  "sakyo.kyoto.jp",
  "seika.kyoto.jp",
  "tanabe.kyoto.jp",
  "uji.kyoto.jp",
  "ujitawara.kyoto.jp",
  "wazuka.kyoto.jp",
  "yamashina.kyoto.jp",
  "yawata.kyoto.jp",
  "asahi.mie.jp",
  "inabe.mie.jp",
  "ise.mie.jp",
  "kameyama.mie.jp",
  "kawagoe.mie.jp",
  "kiho.mie.jp",
  "kisosaki.mie.jp",
  "kiwa.mie.jp",
  "komono.mie.jp",
  "kumano.mie.jp",
  "kuwana.mie.jp",
  "matsusaka.mie.jp",
  "meiwa.mie.jp",
  "mihama.mie.jp",
  "minamiise.mie.jp",
  "misugi.mie.jp",
  "miyama.mie.jp",
  "nabari.mie.jp",
  "shima.mie.jp",
  "suzuka.mie.jp",
  "tado.mie.jp",
  "taiki.mie.jp",
  "taki.mie.jp",
  "tamaki.mie.jp",
  "toba.mie.jp",
  "tsu.mie.jp",
  "udono.mie.jp",
  "ureshino.mie.jp",
  "watarai.mie.jp",
  "yokkaichi.mie.jp",
  "furukawa.miyagi.jp",
  "higashimatsushima.miyagi.jp",
  "ishinomaki.miyagi.jp",
  "iwanuma.miyagi.jp",
  "kakuda.miyagi.jp",
  "kami.miyagi.jp",
  "kawasaki.miyagi.jp",
  "marumori.miyagi.jp",
  "matsushima.miyagi.jp",
  "minamisanriku.miyagi.jp",
  "misato.miyagi.jp",
  "murata.miyagi.jp",
  "natori.miyagi.jp",
  "ogawara.miyagi.jp",
  "ohira.miyagi.jp",
  "onagawa.miyagi.jp",
  "osaki.miyagi.jp",
  "rifu.miyagi.jp",
  "semine.miyagi.jp",
  "shibata.miyagi.jp",
  "shichikashuku.miyagi.jp",
  "shikama.miyagi.jp",
  "shiogama.miyagi.jp",
  "shiroishi.miyagi.jp",
  "tagajo.miyagi.jp",
  "taiwa.miyagi.jp",
  "tome.miyagi.jp",
  "tomiya.miyagi.jp",
  "wakuya.miyagi.jp",
  "watari.miyagi.jp",
  "yamamoto.miyagi.jp",
  "zao.miyagi.jp",
  "aya.miyazaki.jp",
  "ebino.miyazaki.jp",
  "gokase.miyazaki.jp",
  "hyuga.miyazaki.jp",
  "kadogawa.miyazaki.jp",
  "kawaminami.miyazaki.jp",
  "kijo.miyazaki.jp",
  "kitagawa.miyazaki.jp",
  "kitakata.miyazaki.jp",
  "kitaura.miyazaki.jp",
  "kobayashi.miyazaki.jp",
  "kunitomi.miyazaki.jp",
  "kushima.miyazaki.jp",
  "mimata.miyazaki.jp",
  "miyakonojo.miyazaki.jp",
  "miyazaki.miyazaki.jp",
  "morotsuka.miyazaki.jp",
  "nichinan.miyazaki.jp",
  "nishimera.miyazaki.jp",
  "nobeoka.miyazaki.jp",
  "saito.miyazaki.jp",
  "shiiba.miyazaki.jp",
  "shintomi.miyazaki.jp",
  "takaharu.miyazaki.jp",
  "takanabe.miyazaki.jp",
  "takazaki.miyazaki.jp",
  "tsuno.miyazaki.jp",
  "achi.nagano.jp",
  "agematsu.nagano.jp",
  "anan.nagano.jp",
  "aoki.nagano.jp",
  "asahi.nagano.jp",
  "azumino.nagano.jp",
  "chikuhoku.nagano.jp",
  "chikuma.nagano.jp",
  "chino.nagano.jp",
  "fujimi.nagano.jp",
  "hakuba.nagano.jp",
  "hara.nagano.jp",
  "hiraya.nagano.jp",
  "iida.nagano.jp",
  "iijima.nagano.jp",
  "iiyama.nagano.jp",
  "iizuna.nagano.jp",
  "ikeda.nagano.jp",
  "ikusaka.nagano.jp",
  "ina.nagano.jp",
  "karuizawa.nagano.jp",
  "kawakami.nagano.jp",
  "kiso.nagano.jp",
  "kisofukushima.nagano.jp",
  "kitaaiki.nagano.jp",
  "komagane.nagano.jp",
  "komoro.nagano.jp",
  "matsukawa.nagano.jp",
  "matsumoto.nagano.jp",
  "miasa.nagano.jp",
  "minamiaiki.nagano.jp",
  "minamimaki.nagano.jp",
  "minamiminowa.nagano.jp",
  "minowa.nagano.jp",
  "miyada.nagano.jp",
  "miyota.nagano.jp",
  "mochizuki.nagano.jp",
  "nagano.nagano.jp",
  "nagawa.nagano.jp",
  "nagiso.nagano.jp",
  "nakagawa.nagano.jp",
  "nakano.nagano.jp",
  "nozawaonsen.nagano.jp",
  "obuse.nagano.jp",
  "ogawa.nagano.jp",
  "okaya.nagano.jp",
  "omachi.nagano.jp",
  "omi.nagano.jp",
  "ookuwa.nagano.jp",
  "ooshika.nagano.jp",
  "otaki.nagano.jp",
  "otari.nagano.jp",
  "sakae.nagano.jp",
  "sakaki.nagano.jp",
  "saku.nagano.jp",
  "sakuho.nagano.jp",
  "shimosuwa.nagano.jp",
  "shinanomachi.nagano.jp",
  "shiojiri.nagano.jp",
  "suwa.nagano.jp",
  "suzaka.nagano.jp",
  "takagi.nagano.jp",
  "takamori.nagano.jp",
  "takayama.nagano.jp",
  "tateshina.nagano.jp",
  "tatsuno.nagano.jp",
  "togakushi.nagano.jp",
  "togura.nagano.jp",
  "tomi.nagano.jp",
  "ueda.nagano.jp",
  "wada.nagano.jp",
  "yamagata.nagano.jp",
  "yamanouchi.nagano.jp",
  "yasaka.nagano.jp",
  "yasuoka.nagano.jp",
  "chijiwa.nagasaki.jp",
  "futsu.nagasaki.jp",
  "goto.nagasaki.jp",
  "hasami.nagasaki.jp",
  "hirado.nagasaki.jp",
  "iki.nagasaki.jp",
  "isahaya.nagasaki.jp",
  "kawatana.nagasaki.jp",
  "kuchinotsu.nagasaki.jp",
  "matsuura.nagasaki.jp",
  "nagasaki.nagasaki.jp",
  "obama.nagasaki.jp",
  "omura.nagasaki.jp",
  "oseto.nagasaki.jp",
  "saikai.nagasaki.jp",
  "sasebo.nagasaki.jp",
  "seihi.nagasaki.jp",
  "shimabara.nagasaki.jp",
  "shinkamigoto.nagasaki.jp",
  "togitsu.nagasaki.jp",
  "tsushima.nagasaki.jp",
  "unzen.nagasaki.jp",
  "ando.nara.jp",
  "gose.nara.jp",
  "heguri.nara.jp",
  "higashiyoshino.nara.jp",
  "ikaruga.nara.jp",
  "ikoma.nara.jp",
  "kamikitayama.nara.jp",
  "kanmaki.nara.jp",
  "kashiba.nara.jp",
  "kashihara.nara.jp",
  "katsuragi.nara.jp",
  "kawai.nara.jp",
  "kawakami.nara.jp",
  "kawanishi.nara.jp",
  "koryo.nara.jp",
  "kurotaki.nara.jp",
  "mitsue.nara.jp",
  "miyake.nara.jp",
  "nara.nara.jp",
  "nosegawa.nara.jp",
  "oji.nara.jp",
  "ouda.nara.jp",
  "oyodo.nara.jp",
  "sakurai.nara.jp",
  "sango.nara.jp",
  "shimoichi.nara.jp",
  "shimokitayama.nara.jp",
  "shinjo.nara.jp",
  "soni.nara.jp",
  "takatori.nara.jp",
  "tawaramoto.nara.jp",
  "tenkawa.nara.jp",
  "tenri.nara.jp",
  "uda.nara.jp",
  "yamatokoriyama.nara.jp",
  "yamatotakada.nara.jp",
  "yamazoe.nara.jp",
  "yoshino.nara.jp",
  "aga.niigata.jp",
  "agano.niigata.jp",
  "gosen.niigata.jp",
  "itoigawa.niigata.jp",
  "izumozaki.niigata.jp",
  "joetsu.niigata.jp",
  "kamo.niigata.jp",
  "kariwa.niigata.jp",
  "kashiwazaki.niigata.jp",
  "minamiuonuma.niigata.jp",
  "mitsuke.niigata.jp",
  "muika.niigata.jp",
  "murakami.niigata.jp",
  "myoko.niigata.jp",
  "nagaoka.niigata.jp",
  "niigata.niigata.jp",
  "ojiya.niigata.jp",
  "omi.niigata.jp",
  "sado.niigata.jp",
  "sanjo.niigata.jp",
  "seiro.niigata.jp",
  "seirou.niigata.jp",
  "sekikawa.niigata.jp",
  "shibata.niigata.jp",
  "tagami.niigata.jp",
  "tainai.niigata.jp",
  "tochio.niigata.jp",
  "tokamachi.niigata.jp",
  "tsubame.niigata.jp",
  "tsunan.niigata.jp",
  "uonuma.niigata.jp",
  "yahiko.niigata.jp",
  "yoita.niigata.jp",
  "yuzawa.niigata.jp",
  "beppu.oita.jp",
  "bungoono.oita.jp",
  "bungotakada.oita.jp",
  "hasama.oita.jp",
  "hiji.oita.jp",
  "himeshima.oita.jp",
  "hita.oita.jp",
  "kamitsue.oita.jp",
  "kokonoe.oita.jp",
  "kuju.oita.jp",
  "kunisaki.oita.jp",
  "kusu.oita.jp",
  "oita.oita.jp",
  "saiki.oita.jp",
  "taketa.oita.jp",
  "tsukumi.oita.jp",
  "usa.oita.jp",
  "usuki.oita.jp",
  "yufu.oita.jp",
  "akaiwa.okayama.jp",
  "asakuchi.okayama.jp",
  "bizen.okayama.jp",
  "hayashima.okayama.jp",
  "ibara.okayama.jp",
  "kagamino.okayama.jp",
  "kasaoka.okayama.jp",
  "kibichuo.okayama.jp",
  "kumenan.okayama.jp",
  "kurashiki.okayama.jp",
  "maniwa.okayama.jp",
  "misaki.okayama.jp",
  "nagi.okayama.jp",
  "niimi.okayama.jp",
  "nishiawakura.okayama.jp",
  "okayama.okayama.jp",
  "satosho.okayama.jp",
  "setouchi.okayama.jp",
  "shinjo.okayama.jp",
  "shoo.okayama.jp",
  "soja.okayama.jp",
  "takahashi.okayama.jp",
  "tamano.okayama.jp",
  "tsuyama.okayama.jp",
  "wake.okayama.jp",
  "yakage.okayama.jp",
  "aguni.okinawa.jp",
  "ginowan.okinawa.jp",
  "ginoza.okinawa.jp",
  "gushikami.okinawa.jp",
  "haebaru.okinawa.jp",
  "higashi.okinawa.jp",
  "hirara.okinawa.jp",
  "iheya.okinawa.jp",
  "ishigaki.okinawa.jp",
  "ishikawa.okinawa.jp",
  "itoman.okinawa.jp",
  "izena.okinawa.jp",
  "kadena.okinawa.jp",
  "kin.okinawa.jp",
  "kitadaito.okinawa.jp",
  "kitanakagusuku.okinawa.jp",
  "kumejima.okinawa.jp",
  "kunigami.okinawa.jp",
  "minamidaito.okinawa.jp",
  "motobu.okinawa.jp",
  "nago.okinawa.jp",
  "naha.okinawa.jp",
  "nakagusuku.okinawa.jp",
  "nakijin.okinawa.jp",
  "nanjo.okinawa.jp",
  "nishihara.okinawa.jp",
  "ogimi.okinawa.jp",
  "okinawa.okinawa.jp",
  "onna.okinawa.jp",
  "shimoji.okinawa.jp",
  "taketomi.okinawa.jp",
  "tarama.okinawa.jp",
  "tokashiki.okinawa.jp",
  "tomigusuku.okinawa.jp",
  "tonaki.okinawa.jp",
  "urasoe.okinawa.jp",
  "uruma.okinawa.jp",
  "yaese.okinawa.jp",
  "yomitan.okinawa.jp",
  "yonabaru.okinawa.jp",
  "yonaguni.okinawa.jp",
  "zamami.okinawa.jp",
  "abeno.osaka.jp",
  "chihayaakasaka.osaka.jp",
  "chuo.osaka.jp",
  "daito.osaka.jp",
  "fujiidera.osaka.jp",
  "habikino.osaka.jp",
  "hannan.osaka.jp",
  "higashiosaka.osaka.jp",
  "higashisumiyoshi.osaka.jp",
  "higashiyodogawa.osaka.jp",
  "hirakata.osaka.jp",
  "ibaraki.osaka.jp",
  "ikeda.osaka.jp",
  "izumi.osaka.jp",
  "izumiotsu.osaka.jp",
  "izumisano.osaka.jp",
  "kadoma.osaka.jp",
  "kaizuka.osaka.jp",
  "kanan.osaka.jp",
  "kashiwara.osaka.jp",
  "katano.osaka.jp",
  "kawachinagano.osaka.jp",
  "kishiwada.osaka.jp",
  "kita.osaka.jp",
  "kumatori.osaka.jp",
  "matsubara.osaka.jp",
  "minato.osaka.jp",
  "minoh.osaka.jp",
  "misaki.osaka.jp",
  "moriguchi.osaka.jp",
  "neyagawa.osaka.jp",
  "nishi.osaka.jp",
  "nose.osaka.jp",
  "osakasayama.osaka.jp",
  "sakai.osaka.jp",
  "sayama.osaka.jp",
  "sennan.osaka.jp",
  "settsu.osaka.jp",
  "shijonawate.osaka.jp",
  "shimamoto.osaka.jp",
  "suita.osaka.jp",
  "tadaoka.osaka.jp",
  "taishi.osaka.jp",
  "tajiri.osaka.jp",
  "takaishi.osaka.jp",
  "takatsuki.osaka.jp",
  "tondabayashi.osaka.jp",
  "toyonaka.osaka.jp",
  "toyono.osaka.jp",
  "yao.osaka.jp",
  "ariake.saga.jp",
  "arita.saga.jp",
  "fukudomi.saga.jp",
  "genkai.saga.jp",
  "hamatama.saga.jp",
  "hizen.saga.jp",
  "imari.saga.jp",
  "kamimine.saga.jp",
  "kanzaki.saga.jp",
  "karatsu.saga.jp",
  "kashima.saga.jp",
  "kitagata.saga.jp",
  "kitahata.saga.jp",
  "kiyama.saga.jp",
  "kouhoku.saga.jp",
  "kyuragi.saga.jp",
  "nishiarita.saga.jp",
  "ogi.saga.jp",
  "omachi.saga.jp",
  "ouchi.saga.jp",
  "saga.saga.jp",
  "shiroishi.saga.jp",
  "taku.saga.jp",
  "tara.saga.jp",
  "tosu.saga.jp",
  "yoshinogari.saga.jp",
  "arakawa.saitama.jp",
  "asaka.saitama.jp",
  "chichibu.saitama.jp",
  "fujimi.saitama.jp",
  "fujimino.saitama.jp",
  "fukaya.saitama.jp",
  "hanno.saitama.jp",
  "hanyu.saitama.jp",
  "hasuda.saitama.jp",
  "hatogaya.saitama.jp",
  "hatoyama.saitama.jp",
  "hidaka.saitama.jp",
  "higashichichibu.saitama.jp",
  "higashimatsuyama.saitama.jp",
  "honjo.saitama.jp",
  "ina.saitama.jp",
  "iruma.saitama.jp",
  "iwatsuki.saitama.jp",
  "kamiizumi.saitama.jp",
  "kamikawa.saitama.jp",
  "kamisato.saitama.jp",
  "kasukabe.saitama.jp",
  "kawagoe.saitama.jp",
  "kawaguchi.saitama.jp",
  "kawajima.saitama.jp",
  "kazo.saitama.jp",
  "kitamoto.saitama.jp",
  "koshigaya.saitama.jp",
  "kounosu.saitama.jp",
  "kuki.saitama.jp",
  "kumagaya.saitama.jp",
  "matsubushi.saitama.jp",
  "minano.saitama.jp",
  "misato.saitama.jp",
  "miyashiro.saitama.jp",
  "miyoshi.saitama.jp",
  "moroyama.saitama.jp",
  "nagatoro.saitama.jp",
  "namegawa.saitama.jp",
  "niiza.saitama.jp",
  "ogano.saitama.jp",
  "ogawa.saitama.jp",
  "ogose.saitama.jp",
  "okegawa.saitama.jp",
  "omiya.saitama.jp",
  "otaki.saitama.jp",
  "ranzan.saitama.jp",
  "ryokami.saitama.jp",
  "saitama.saitama.jp",
  "sakado.saitama.jp",
  "satte.saitama.jp",
  "sayama.saitama.jp",
  "shiki.saitama.jp",
  "shiraoka.saitama.jp",
  "soka.saitama.jp",
  "sugito.saitama.jp",
  "toda.saitama.jp",
  "tokigawa.saitama.jp",
  "tokorozawa.saitama.jp",
  "tsurugashima.saitama.jp",
  "urawa.saitama.jp",
  "warabi.saitama.jp",
  "yashio.saitama.jp",
  "yokoze.saitama.jp",
  "yono.saitama.jp",
  "yorii.saitama.jp",
  "yoshida.saitama.jp",
  "yoshikawa.saitama.jp",
  "yoshimi.saitama.jp",
  "aisho.shiga.jp",
  "gamo.shiga.jp",
  "higashiomi.shiga.jp",
  "hikone.shiga.jp",
  "koka.shiga.jp",
  "konan.shiga.jp",
  "kosei.shiga.jp",
  "koto.shiga.jp",
  "kusatsu.shiga.jp",
  "maibara.shiga.jp",
  "moriyama.shiga.jp",
  "nagahama.shiga.jp",
  "nishiazai.shiga.jp",
  "notogawa.shiga.jp",
  "omihachiman.shiga.jp",
  "otsu.shiga.jp",
  "ritto.shiga.jp",
  "ryuoh.shiga.jp",
  "takashima.shiga.jp",
  "takatsuki.shiga.jp",
  "torahime.shiga.jp",
  "toyosato.shiga.jp",
  "yasu.shiga.jp",
  "akagi.shimane.jp",
  "ama.shimane.jp",
  "gotsu.shimane.jp",
  "hamada.shimane.jp",
  "higashiizumo.shimane.jp",
  "hikawa.shimane.jp",
  "hikimi.shimane.jp",
  "izumo.shimane.jp",
  "kakinoki.shimane.jp",
  "masuda.shimane.jp",
  "matsue.shimane.jp",
  "misato.shimane.jp",
  "nishinoshima.shimane.jp",
  "ohda.shimane.jp",
  "okinoshima.shimane.jp",
  "okuizumo.shimane.jp",
  "shimane.shimane.jp",
  "tamayu.shimane.jp",
  "tsuwano.shimane.jp",
  "unnan.shimane.jp",
  "yakumo.shimane.jp",
  "yasugi.shimane.jp",
  "yatsuka.shimane.jp",
  "arai.shizuoka.jp",
  "atami.shizuoka.jp",
  "fuji.shizuoka.jp",
  "fujieda.shizuoka.jp",
  "fujikawa.shizuoka.jp",
  "fujinomiya.shizuoka.jp",
  "fukuroi.shizuoka.jp",
  "gotemba.shizuoka.jp",
  "haibara.shizuoka.jp",
  "hamamatsu.shizuoka.jp",
  "higashiizu.shizuoka.jp",
  "ito.shizuoka.jp",
  "iwata.shizuoka.jp",
  "izu.shizuoka.jp",
  "izunokuni.shizuoka.jp",
  "kakegawa.shizuoka.jp",
  "kannami.shizuoka.jp",
  "kawanehon.shizuoka.jp",
  "kawazu.shizuoka.jp",
  "kikugawa.shizuoka.jp",
  "kosai.shizuoka.jp",
  "makinohara.shizuoka.jp",
  "matsuzaki.shizuoka.jp",
  "minamiizu.shizuoka.jp",
  "mishima.shizuoka.jp",
  "morimachi.shizuoka.jp",
  "nishiizu.shizuoka.jp",
  "numazu.shizuoka.jp",
  "omaezaki.shizuoka.jp",
  "shimada.shizuoka.jp",
  "shimizu.shizuoka.jp",
  "shimoda.shizuoka.jp",
  "shizuoka.shizuoka.jp",
  "susono.shizuoka.jp",
  "yaizu.shizuoka.jp",
  "yoshida.shizuoka.jp",
  "ashikaga.tochigi.jp",
  "bato.tochigi.jp",
  "haga.tochigi.jp",
  "ichikai.tochigi.jp",
  "iwafune.tochigi.jp",
  "kaminokawa.tochigi.jp",
  "kanuma.tochigi.jp",
  "karasuyama.tochigi.jp",
  "kuroiso.tochigi.jp",
  "mashiko.tochigi.jp",
  "mibu.tochigi.jp",
  "moka.tochigi.jp",
  "motegi.tochigi.jp",
  "nasu.tochigi.jp",
  "nasushiobara.tochigi.jp",
  "nikko.tochigi.jp",
  "nishikata.tochigi.jp",
  "nogi.tochigi.jp",
  "ohira.tochigi.jp",
  "ohtawara.tochigi.jp",
  "oyama.tochigi.jp",
  "sakura.tochigi.jp",
  "sano.tochigi.jp",
  "shimotsuke.tochigi.jp",
  "shioya.tochigi.jp",
  "takanezawa.tochigi.jp",
  "tochigi.tochigi.jp",
  "tsuga.tochigi.jp",
  "ujiie.tochigi.jp",
  "utsunomiya.tochigi.jp",
  "yaita.tochigi.jp",
  "aizumi.tokushima.jp",
  "anan.tokushima.jp",
  "ichiba.tokushima.jp",
  "itano.tokushima.jp",
  "kainan.tokushima.jp",
  "komatsushima.tokushima.jp",
  "matsushige.tokushima.jp",
  "mima.tokushima.jp",
  "minami.tokushima.jp",
  "miyoshi.tokushima.jp",
  "mugi.tokushima.jp",
  "nakagawa.tokushima.jp",
  "naruto.tokushima.jp",
  "sanagochi.tokushima.jp",
  "shishikui.tokushima.jp",
  "tokushima.tokushima.jp",
  "wajiki.tokushima.jp",
  "adachi.tokyo.jp",
  "akiruno.tokyo.jp",
  "akishima.tokyo.jp",
  "aogashima.tokyo.jp",
  "arakawa.tokyo.jp",
  "bunkyo.tokyo.jp",
  "chiyoda.tokyo.jp",
  "chofu.tokyo.jp",
  "chuo.tokyo.jp",
  "edogawa.tokyo.jp",
  "fuchu.tokyo.jp",
  "fussa.tokyo.jp",
  "hachijo.tokyo.jp",
  "hachioji.tokyo.jp",
  "hamura.tokyo.jp",
  "higashikurume.tokyo.jp",
  "higashimurayama.tokyo.jp",
  "higashiyamato.tokyo.jp",
  "hino.tokyo.jp",
  "hinode.tokyo.jp",
  "hinohara.tokyo.jp",
  "inagi.tokyo.jp",
  "itabashi.tokyo.jp",
  "katsushika.tokyo.jp",
  "kita.tokyo.jp",
  "kiyose.tokyo.jp",
  "kodaira.tokyo.jp",
  "koganei.tokyo.jp",
  "kokubunji.tokyo.jp",
  "komae.tokyo.jp",
  "koto.tokyo.jp",
  "kouzushima.tokyo.jp",
  "kunitachi.tokyo.jp",
  "machida.tokyo.jp",
  "meguro.tokyo.jp",
  "minato.tokyo.jp",
  "mitaka.tokyo.jp",
  "mizuho.tokyo.jp",
  "musashimurayama.tokyo.jp",
  "musashino.tokyo.jp",
  "nakano.tokyo.jp",
  "nerima.tokyo.jp",
  "ogasawara.tokyo.jp",
  "okutama.tokyo.jp",
  "ome.tokyo.jp",
  "oshima.tokyo.jp",
  "ota.tokyo.jp",
  "setagaya.tokyo.jp",
  "shibuya.tokyo.jp",
  "shinagawa.tokyo.jp",
  "shinjuku.tokyo.jp",
  "suginami.tokyo.jp",
  "sumida.tokyo.jp",
  "tachikawa.tokyo.jp",
  "taito.tokyo.jp",
  "tama.tokyo.jp",
  "toshima.tokyo.jp",
  "chizu.tottori.jp",
  "hino.tottori.jp",
  "kawahara.tottori.jp",
  "koge.tottori.jp",
  "kotoura.tottori.jp",
  "misasa.tottori.jp",
  "nanbu.tottori.jp",
  "nichinan.tottori.jp",
  "sakaiminato.tottori.jp",
  "tottori.tottori.jp",
  "wakasa.tottori.jp",
  "yazu.tottori.jp",
  "yonago.tottori.jp",
  "asahi.toyama.jp",
  "fuchu.toyama.jp",
  "fukumitsu.toyama.jp",
  "funahashi.toyama.jp",
  "himi.toyama.jp",
  "imizu.toyama.jp",
  "inami.toyama.jp",
  "johana.toyama.jp",
  "kamiichi.toyama.jp",
  "kurobe.toyama.jp",
  "nakaniikawa.toyama.jp",
  "namerikawa.toyama.jp",
  "nanto.toyama.jp",
  "nyuzen.toyama.jp",
  "oyabe.toyama.jp",
  "taira.toyama.jp",
  "takaoka.toyama.jp",
  "tateyama.toyama.jp",
  "toga.toyama.jp",
  "tonami.toyama.jp",
  "toyama.toyama.jp",
  "unazuki.toyama.jp",
  "uozu.toyama.jp",
  "yamada.toyama.jp",
  "arida.wakayama.jp",
  "aridagawa.wakayama.jp",
  "gobo.wakayama.jp",
  "hashimoto.wakayama.jp",
  "hidaka.wakayama.jp",
  "hirogawa.wakayama.jp",
  "inami.wakayama.jp",
  "iwade.wakayama.jp",
  "kainan.wakayama.jp",
  "kamitonda.wakayama.jp",
  "katsuragi.wakayama.jp",
  "kimino.wakayama.jp",
  "kinokawa.wakayama.jp",
  "kitayama.wakayama.jp",
  "koya.wakayama.jp",
  "koza.wakayama.jp",
  "kozagawa.wakayama.jp",
  "kudoyama.wakayama.jp",
  "kushimoto.wakayama.jp",
  "mihama.wakayama.jp",
  "misato.wakayama.jp",
  "nachikatsuura.wakayama.jp",
  "shingu.wakayama.jp",
  "shirahama.wakayama.jp",
  "taiji.wakayama.jp",
  "tanabe.wakayama.jp",
  "wakayama.wakayama.jp",
  "yuasa.wakayama.jp",
  "yura.wakayama.jp",
  "asahi.yamagata.jp",
  "funagata.yamagata.jp",
  "higashine.yamagata.jp",
  "iide.yamagata.jp",
  "kahoku.yamagata.jp",
  "kaminoyama.yamagata.jp",
  "kaneyama.yamagata.jp",
  "kawanishi.yamagata.jp",
  "mamurogawa.yamagata.jp",
  "mikawa.yamagata.jp",
  "murayama.yamagata.jp",
  "nagai.yamagata.jp",
  "nakayama.yamagata.jp",
  "nanyo.yamagata.jp",
  "nishikawa.yamagata.jp",
  "obanazawa.yamagata.jp",
  "oe.yamagata.jp",
  "oguni.yamagata.jp",
  "ohkura.yamagata.jp",
  "oishida.yamagata.jp",
  "sagae.yamagata.jp",
  "sakata.yamagata.jp",
  "sakegawa.yamagata.jp",
  "shinjo.yamagata.jp",
  "shirataka.yamagata.jp",
  "shonai.yamagata.jp",
  "takahata.yamagata.jp",
  "tendo.yamagata.jp",
  "tozawa.yamagata.jp",
  "tsuruoka.yamagata.jp",
  "yamagata.yamagata.jp",
  "yamanobe.yamagata.jp",
  "yonezawa.yamagata.jp",
  "yuza.yamagata.jp",
  "abu.yamaguchi.jp",
  "hagi.yamaguchi.jp",
  "hikari.yamaguchi.jp",
  "hofu.yamaguchi.jp",
  "iwakuni.yamaguchi.jp",
  "kudamatsu.yamaguchi.jp",
  "mitou.yamaguchi.jp",
  "nagato.yamaguchi.jp",
  "oshima.yamaguchi.jp",
  "shimonoseki.yamaguchi.jp",
  "shunan.yamaguchi.jp",
  "tabuse.yamaguchi.jp",
  "tokuyama.yamaguchi.jp",
  "toyota.yamaguchi.jp",
  "ube.yamaguchi.jp",
  "yuu.yamaguchi.jp",
  "chuo.yamanashi.jp",
  "doshi.yamanashi.jp",
  "fuefuki.yamanashi.jp",
  "fujikawa.yamanashi.jp",
  "fujikawaguchiko.yamanashi.jp",
  "fujiyoshida.yamanashi.jp",
  "hayakawa.yamanashi.jp",
  "hokuto.yamanashi.jp",
  "ichikawamisato.yamanashi.jp",
  "kai.yamanashi.jp",
  "kofu.yamanashi.jp",
  "koshu.yamanashi.jp",
  "kosuge.yamanashi.jp",
  "minami-alps.yamanashi.jp",
  "minobu.yamanashi.jp",
  "nakamichi.yamanashi.jp",
  "nanbu.yamanashi.jp",
  "narusawa.yamanashi.jp",
  "nirasaki.yamanashi.jp",
  "nishikatsura.yamanashi.jp",
  "oshino.yamanashi.jp",
  "otsuki.yamanashi.jp",
  "showa.yamanashi.jp",
  "tabayama.yamanashi.jp",
  "tsuru.yamanashi.jp",
  "uenohara.yamanashi.jp",
  "yamanakako.yamanashi.jp",
  "yamanashi.yamanashi.jp",
  "ke",
  "ac.ke",
  "co.ke",
  "go.ke",
  "info.ke",
  "me.ke",
  "mobi.ke",
  "ne.ke",
  "or.ke",
  "sc.ke",
  "kg",
  "com.kg",
  "edu.kg",
  "gov.kg",
  "mil.kg",
  "net.kg",
  "org.kg",
  "*.kh",
  "ki",
  "biz.ki",
  "com.ki",
  "edu.ki",
  "gov.ki",
  "info.ki",
  "net.ki",
  "org.ki",
  "km",
  "ass.km",
  "com.km",
  "edu.km",
  "gov.km",
  "mil.km",
  "nom.km",
  "org.km",
  "prd.km",
  "tm.km",
  "asso.km",
  "coop.km",
  "gouv.km",
  "medecin.km",
  "notaires.km",
  "pharmaciens.km",
  "presse.km",
  "veterinaire.km",
  "kn",
  "edu.kn",
  "gov.kn",
  "net.kn",
  "org.kn",
  "kp",
  "com.kp",
  "edu.kp",
  "gov.kp",
  "org.kp",
  "rep.kp",
  "tra.kp",
  "kr",
  "ac.kr",
  "co.kr",
  "es.kr",
  "go.kr",
  "hs.kr",
  "kg.kr",
  "mil.kr",
  "ms.kr",
  "ne.kr",
  "or.kr",
  "pe.kr",
  "re.kr",
  "sc.kr",
  "busan.kr",
  "chungbuk.kr",
  "chungnam.kr",
  "daegu.kr",
  "daejeon.kr",
  "gangwon.kr",
  "gwangju.kr",
  "gyeongbuk.kr",
  "gyeonggi.kr",
  "gyeongnam.kr",
  "incheon.kr",
  "jeju.kr",
  "jeonbuk.kr",
  "jeonnam.kr",
  "seoul.kr",
  "ulsan.kr",
  "kw",
  "com.kw",
  "edu.kw",
  "emb.kw",
  "gov.kw",
  "ind.kw",
  "net.kw",
  "org.kw",
  "ky",
  "com.ky",
  "edu.ky",
  "net.ky",
  "org.ky",
  "kz",
  "com.kz",
  "edu.kz",
  "gov.kz",
  "mil.kz",
  "net.kz",
  "org.kz",
  "la",
  "com.la",
  "edu.la",
  "gov.la",
  "info.la",
  "int.la",
  "net.la",
  "org.la",
  "per.la",
  "lb",
  "com.lb",
  "edu.lb",
  "gov.lb",
  "net.lb",
  "org.lb",
  "lc",
  "co.lc",
  "com.lc",
  "edu.lc",
  "gov.lc",
  "net.lc",
  "org.lc",
  "li",
  "lk",
  "ac.lk",
  "assn.lk",
  "com.lk",
  "edu.lk",
  "gov.lk",
  "grp.lk",
  "hotel.lk",
  "int.lk",
  "ltd.lk",
  "net.lk",
  "ngo.lk",
  "org.lk",
  "sch.lk",
  "soc.lk",
  "web.lk",
  "lr",
  "com.lr",
  "edu.lr",
  "gov.lr",
  "net.lr",
  "org.lr",
  "ls",
  "ac.ls",
  "biz.ls",
  "co.ls",
  "edu.ls",
  "gov.ls",
  "info.ls",
  "net.ls",
  "org.ls",
  "sc.ls",
  "lt",
  "gov.lt",
  "lu",
  "lv",
  "asn.lv",
  "com.lv",
  "conf.lv",
  "edu.lv",
  "gov.lv",
  "id.lv",
  "mil.lv",
  "net.lv",
  "org.lv",
  "ly",
  "com.ly",
  "edu.ly",
  "gov.ly",
  "id.ly",
  "med.ly",
  "net.ly",
  "org.ly",
  "plc.ly",
  "sch.ly",
  "ma",
  "ac.ma",
  "co.ma",
  "gov.ma",
  "net.ma",
  "org.ma",
  "press.ma",
  "mc",
  "asso.mc",
  "tm.mc",
  "md",
  "me",
  "ac.me",
  "co.me",
  "edu.me",
  "gov.me",
  "its.me",
  "net.me",
  "org.me",
  "priv.me",
  "mg",
  "co.mg",
  "com.mg",
  "edu.mg",
  "gov.mg",
  "mil.mg",
  "nom.mg",
  "org.mg",
  "prd.mg",
  "mh",
  "mil",
  "mk",
  "com.mk",
  "edu.mk",
  "gov.mk",
  "inf.mk",
  "name.mk",
  "net.mk",
  "org.mk",
  "ml",
  "com.ml",
  "edu.ml",
  "gouv.ml",
  "gov.ml",
  "net.ml",
  "org.ml",
  "presse.ml",
  "*.mm",
  "mn",
  "edu.mn",
  "gov.mn",
  "org.mn",
  "mo",
  "com.mo",
  "edu.mo",
  "gov.mo",
  "net.mo",
  "org.mo",
  "mobi",
  "mp",
  "mq",
  "mr",
  "gov.mr",
  "ms",
  "com.ms",
  "edu.ms",
  "gov.ms",
  "net.ms",
  "org.ms",
  "mt",
  "com.mt",
  "edu.mt",
  "net.mt",
  "org.mt",
  "mu",
  "ac.mu",
  "co.mu",
  "com.mu",
  "gov.mu",
  "net.mu",
  "or.mu",
  "org.mu",
  "museum",
  "mv",
  "aero.mv",
  "biz.mv",
  "com.mv",
  "coop.mv",
  "edu.mv",
  "gov.mv",
  "info.mv",
  "int.mv",
  "mil.mv",
  "museum.mv",
  "name.mv",
  "net.mv",
  "org.mv",
  "pro.mv",
  "mw",
  "ac.mw",
  "biz.mw",
  "co.mw",
  "com.mw",
  "coop.mw",
  "edu.mw",
  "gov.mw",
  "int.mw",
  "net.mw",
  "org.mw",
  "mx",
  "com.mx",
  "edu.mx",
  "gob.mx",
  "net.mx",
  "org.mx",
  "my",
  "biz.my",
  "com.my",
  "edu.my",
  "gov.my",
  "mil.my",
  "name.my",
  "net.my",
  "org.my",
  "mz",
  "ac.mz",
  "adv.mz",
  "co.mz",
  "edu.mz",
  "gov.mz",
  "mil.mz",
  "net.mz",
  "org.mz",
  "na",
  "alt.na",
  "co.na",
  "com.na",
  "gov.na",
  "net.na",
  "org.na",
  "name",
  "nc",
  "asso.nc",
  "nom.nc",
  "ne",
  "net",
  "nf",
  "arts.nf",
  "com.nf",
  "firm.nf",
  "info.nf",
  "net.nf",
  "other.nf",
  "per.nf",
  "rec.nf",
  "store.nf",
  "web.nf",
  "ng",
  "com.ng",
  "edu.ng",
  "gov.ng",
  "i.ng",
  "mil.ng",
  "mobi.ng",
  "name.ng",
  "net.ng",
  "org.ng",
  "sch.ng",
  "ni",
  "ac.ni",
  "biz.ni",
  "co.ni",
  "com.ni",
  "edu.ni",
  "gob.ni",
  "in.ni",
  "info.ni",
  "int.ni",
  "mil.ni",
  "net.ni",
  "nom.ni",
  "org.ni",
  "web.ni",
  "nl",
  "no",
  "fhs.no",
  "folkebibl.no",
  "fylkesbibl.no",
  "idrett.no",
  "museum.no",
  "priv.no",
  "vgs.no",
  "dep.no",
  "herad.no",
  "kommune.no",
  "mil.no",
  "stat.no",
  "aa.no",
  "ah.no",
  "bu.no",
  "fm.no",
  "hl.no",
  "hm.no",
  "jan-mayen.no",
  "mr.no",
  "nl.no",
  "nt.no",
  "of.no",
  "ol.no",
  "oslo.no",
  "rl.no",
  "sf.no",
  "st.no",
  "svalbard.no",
  "tm.no",
  "tr.no",
  "va.no",
  "vf.no",
  "gs.aa.no",
  "gs.ah.no",
  "gs.bu.no",
  "gs.fm.no",
  "gs.hl.no",
  "gs.hm.no",
  "gs.jan-mayen.no",
  "gs.mr.no",
  "gs.nl.no",
  "gs.nt.no",
  "gs.of.no",
  "gs.ol.no",
  "gs.oslo.no",
  "gs.rl.no",
  "gs.sf.no",
  "gs.st.no",
  "gs.svalbard.no",
  "gs.tm.no",
  "gs.tr.no",
  "gs.va.no",
  "gs.vf.no",
  "akrehamn.no",
  "\xE5krehamn.no",
  "algard.no",
  "\xE5lg\xE5rd.no",
  "arna.no",
  "bronnoysund.no",
  "br\xF8nn\xF8ysund.no",
  "brumunddal.no",
  "bryne.no",
  "drobak.no",
  "dr\xF8bak.no",
  "egersund.no",
  "fetsund.no",
  "floro.no",
  "flor\xF8.no",
  "fredrikstad.no",
  "hokksund.no",
  "honefoss.no",
  "h\xF8nefoss.no",
  "jessheim.no",
  "jorpeland.no",
  "j\xF8rpeland.no",
  "kirkenes.no",
  "kopervik.no",
  "krokstadelva.no",
  "langevag.no",
  "langev\xE5g.no",
  "leirvik.no",
  "mjondalen.no",
  "mj\xF8ndalen.no",
  "mo-i-rana.no",
  "mosjoen.no",
  "mosj\xF8en.no",
  "nesoddtangen.no",
  "orkanger.no",
  "osoyro.no",
  "os\xF8yro.no",
  "raholt.no",
  "r\xE5holt.no",
  "sandnessjoen.no",
  "sandnessj\xF8en.no",
  "skedsmokorset.no",
  "slattum.no",
  "spjelkavik.no",
  "stathelle.no",
  "stavern.no",
  "stjordalshalsen.no",
  "stj\xF8rdalshalsen.no",
  "tananger.no",
  "tranby.no",
  "vossevangen.no",
  "aarborte.no",
  "aejrie.no",
  "afjord.no",
  "\xE5fjord.no",
  "agdenes.no",
  "nes.akershus.no",
  "aknoluokta.no",
  "\xE1k\u014Boluokta.no",
  "al.no",
  "\xE5l.no",
  "alaheadju.no",
  "\xE1laheadju.no",
  "alesund.no",
  "\xE5lesund.no",
  "alstahaug.no",
  "alta.no",
  "\xE1lt\xE1.no",
  "alvdal.no",
  "amli.no",
  "\xE5mli.no",
  "amot.no",
  "\xE5mot.no",
  "andasuolo.no",
  "andebu.no",
  "andoy.no",
  "and\xF8y.no",
  "ardal.no",
  "\xE5rdal.no",
  "aremark.no",
  "arendal.no",
  "\xE5s.no",
  "aseral.no",
  "\xE5seral.no",
  "asker.no",
  "askim.no",
  "askoy.no",
  "ask\xF8y.no",
  "askvoll.no",
  "asnes.no",
  "\xE5snes.no",
  "audnedaln.no",
  "aukra.no",
  "aure.no",
  "aurland.no",
  "aurskog-holand.no",
  "aurskog-h\xF8land.no",
  "austevoll.no",
  "austrheim.no",
  "averoy.no",
  "aver\xF8y.no",
  "badaddja.no",
  "b\xE5d\xE5ddj\xE5.no",
  "b\xE6rum.no",
  "bahcavuotna.no",
  "b\xE1hcavuotna.no",
  "bahccavuotna.no",
  "b\xE1hccavuotna.no",
  "baidar.no",
  "b\xE1id\xE1r.no",
  "bajddar.no",
  "b\xE1jddar.no",
  "balat.no",
  "b\xE1l\xE1t.no",
  "balestrand.no",
  "ballangen.no",
  "balsfjord.no",
  "bamble.no",
  "bardu.no",
  "barum.no",
  "batsfjord.no",
  "b\xE5tsfjord.no",
  "bearalvahki.no",
  "bearalv\xE1hki.no",
  "beardu.no",
  "beiarn.no",
  "berg.no",
  "bergen.no",
  "berlevag.no",
  "berlev\xE5g.no",
  "bievat.no",
  "biev\xE1t.no",
  "bindal.no",
  "birkenes.no",
  "bjarkoy.no",
  "bjark\xF8y.no",
  "bjerkreim.no",
  "bjugn.no",
  "bodo.no",
  "bod\xF8.no",
  "bokn.no",
  "bomlo.no",
  "b\xF8mlo.no",
  "bremanger.no",
  "bronnoy.no",
  "br\xF8nn\xF8y.no",
  "budejju.no",
  "nes.buskerud.no",
  "bygland.no",
  "bykle.no",
  "cahcesuolo.no",
  "\u010D\xE1hcesuolo.no",
  "davvenjarga.no",
  "davvenj\xE1rga.no",
  "davvesiida.no",
  "deatnu.no",
  "dielddanuorri.no",
  "divtasvuodna.no",
  "divttasvuotna.no",
  "donna.no",
  "d\xF8nna.no",
  "dovre.no",
  "drammen.no",
  "drangedal.no",
  "dyroy.no",
  "dyr\xF8y.no",
  "eid.no",
  "eidfjord.no",
  "eidsberg.no",
  "eidskog.no",
  "eidsvoll.no",
  "eigersund.no",
  "elverum.no",
  "enebakk.no",
  "engerdal.no",
  "etne.no",
  "etnedal.no",
  "evenassi.no",
  "even\xE1\u0161\u0161i.no",
  "evenes.no",
  "evje-og-hornnes.no",
  "farsund.no",
  "fauske.no",
  "fedje.no",
  "fet.no",
  "finnoy.no",
  "finn\xF8y.no",
  "fitjar.no",
  "fjaler.no",
  "fjell.no",
  "fla.no",
  "fl\xE5.no",
  "flakstad.no",
  "flatanger.no",
  "flekkefjord.no",
  "flesberg.no",
  "flora.no",
  "folldal.no",
  "forde.no",
  "f\xF8rde.no",
  "forsand.no",
  "fosnes.no",
  "fr\xE6na.no",
  "frana.no",
  "frei.no",
  "frogn.no",
  "froland.no",
  "frosta.no",
  "froya.no",
  "fr\xF8ya.no",
  "fuoisku.no",
  "fuossko.no",
  "fusa.no",
  "fyresdal.no",
  "gaivuotna.no",
  "g\xE1ivuotna.no",
  "galsa.no",
  "g\xE1ls\xE1.no",
  "gamvik.no",
  "gangaviika.no",
  "g\xE1\u014Bgaviika.no",
  "gaular.no",
  "gausdal.no",
  "giehtavuoatna.no",
  "gildeskal.no",
  "gildesk\xE5l.no",
  "giske.no",
  "gjemnes.no",
  "gjerdrum.no",
  "gjerstad.no",
  "gjesdal.no",
  "gjovik.no",
  "gj\xF8vik.no",
  "gloppen.no",
  "gol.no",
  "gran.no",
  "grane.no",
  "granvin.no",
  "gratangen.no",
  "grimstad.no",
  "grong.no",
  "grue.no",
  "gulen.no",
  "guovdageaidnu.no",
  "ha.no",
  "h\xE5.no",
  "habmer.no",
  "h\xE1bmer.no",
  "hadsel.no",
  "h\xE6gebostad.no",
  "hagebostad.no",
  "halden.no",
  "halsa.no",
  "hamar.no",
  "hamaroy.no",
  "hammarfeasta.no",
  "h\xE1mm\xE1rfeasta.no",
  "hammerfest.no",
  "hapmir.no",
  "h\xE1pmir.no",
  "haram.no",
  "hareid.no",
  "harstad.no",
  "hasvik.no",
  "hattfjelldal.no",
  "haugesund.no",
  "os.hedmark.no",
  "valer.hedmark.no",
  "v\xE5ler.hedmark.no",
  "hemne.no",
  "hemnes.no",
  "hemsedal.no",
  "hitra.no",
  "hjartdal.no",
  "hjelmeland.no",
  "hobol.no",
  "hob\xF8l.no",
  "hof.no",
  "hol.no",
  "hole.no",
  "holmestrand.no",
  "holtalen.no",
  "holt\xE5len.no",
  "os.hordaland.no",
  "hornindal.no",
  "horten.no",
  "hoyanger.no",
  "h\xF8yanger.no",
  "hoylandet.no",
  "h\xF8ylandet.no",
  "hurdal.no",
  "hurum.no",
  "hvaler.no",
  "hyllestad.no",
  "ibestad.no",
  "inderoy.no",
  "inder\xF8y.no",
  "iveland.no",
  "ivgu.no",
  "jevnaker.no",
  "jolster.no",
  "j\xF8lster.no",
  "jondal.no",
  "kafjord.no",
  "k\xE5fjord.no",
  "karasjohka.no",
  "k\xE1r\xE1\u0161johka.no",
  "karasjok.no",
  "karlsoy.no",
  "karmoy.no",
  "karm\xF8y.no",
  "kautokeino.no",
  "klabu.no",
  "kl\xE6bu.no",
  "klepp.no",
  "kongsberg.no",
  "kongsvinger.no",
  "kraanghke.no",
  "kr\xE5anghke.no",
  "kragero.no",
  "krager\xF8.no",
  "kristiansand.no",
  "kristiansund.no",
  "krodsherad.no",
  "kr\xF8dsherad.no",
  "kv\xE6fjord.no",
  "kv\xE6nangen.no",
  "kvafjord.no",
  "kvalsund.no",
  "kvam.no",
  "kvanangen.no",
  "kvinesdal.no",
  "kvinnherad.no",
  "kviteseid.no",
  "kvitsoy.no",
  "kvits\xF8y.no",
  "laakesvuemie.no",
  "l\xE6rdal.no",
  "lahppi.no",
  "l\xE1hppi.no",
  "lardal.no",
  "larvik.no",
  "lavagis.no",
  "lavangen.no",
  "leangaviika.no",
  "lea\u014Bgaviika.no",
  "lebesby.no",
  "leikanger.no",
  "leirfjord.no",
  "leka.no",
  "leksvik.no",
  "lenvik.no",
  "lerdal.no",
  "lesja.no",
  "levanger.no",
  "lier.no",
  "lierne.no",
  "lillehammer.no",
  "lillesand.no",
  "lindas.no",
  "lind\xE5s.no",
  "lindesnes.no",
  "loabat.no",
  "loab\xE1t.no",
  "lodingen.no",
  "l\xF8dingen.no",
  "lom.no",
  "loppa.no",
  "lorenskog.no",
  "l\xF8renskog.no",
  "loten.no",
  "l\xF8ten.no",
  "lund.no",
  "lunner.no",
  "luroy.no",
  "lur\xF8y.no",
  "luster.no",
  "lyngdal.no",
  "lyngen.no",
  "malatvuopmi.no",
  "m\xE1latvuopmi.no",
  "malselv.no",
  "m\xE5lselv.no",
  "malvik.no",
  "mandal.no",
  "marker.no",
  "marnardal.no",
  "masfjorden.no",
  "masoy.no",
  "m\xE5s\xF8y.no",
  "matta-varjjat.no",
  "m\xE1tta-v\xE1rjjat.no",
  "meland.no",
  "meldal.no",
  "melhus.no",
  "meloy.no",
  "mel\xF8y.no",
  "meraker.no",
  "mer\xE5ker.no",
  "midsund.no",
  "midtre-gauldal.no",
  "moareke.no",
  "mo\xE5reke.no",
  "modalen.no",
  "modum.no",
  "molde.no",
  "heroy.more-og-romsdal.no",
  "sande.more-og-romsdal.no",
  "her\xF8y.m\xF8re-og-romsdal.no",
  "sande.m\xF8re-og-romsdal.no",
  "moskenes.no",
  "moss.no",
  "mosvik.no",
  "muosat.no",
  "muos\xE1t.no",
  "naamesjevuemie.no",
  "n\xE5\xE5mesjevuemie.no",
  "n\xE6r\xF8y.no",
  "namdalseid.no",
  "namsos.no",
  "namsskogan.no",
  "nannestad.no",
  "naroy.no",
  "narviika.no",
  "narvik.no",
  "naustdal.no",
  "navuotna.no",
  "n\xE1vuotna.no",
  "nedre-eiker.no",
  "nesna.no",
  "nesodden.no",
  "nesseby.no",
  "nesset.no",
  "nissedal.no",
  "nittedal.no",
  "nord-aurdal.no",
  "nord-fron.no",
  "nord-odal.no",
  "norddal.no",
  "nordkapp.no",
  "bo.nordland.no",
  "b\xF8.nordland.no",
  "heroy.nordland.no",
  "her\xF8y.nordland.no",
  "nordre-land.no",
  "nordreisa.no",
  "nore-og-uvdal.no",
  "notodden.no",
  "notteroy.no",
  "n\xF8tter\xF8y.no",
  "odda.no",
  "oksnes.no",
  "\xF8ksnes.no",
  "omasvuotna.no",
  "oppdal.no",
  "oppegard.no",
  "oppeg\xE5rd.no",
  "orkdal.no",
  "orland.no",
  "\xF8rland.no",
  "orskog.no",
  "\xF8rskog.no",
  "orsta.no",
  "\xF8rsta.no",
  "osen.no",
  "osteroy.no",
  "oster\xF8y.no",
  "valer.ostfold.no",
  "v\xE5ler.\xF8stfold.no",
  "ostre-toten.no",
  "\xF8stre-toten.no",
  "overhalla.no",
  "ovre-eiker.no",
  "\xF8vre-eiker.no",
  "oyer.no",
  "\xF8yer.no",
  "oygarden.no",
  "\xF8ygarden.no",
  "oystre-slidre.no",
  "\xF8ystre-slidre.no",
  "porsanger.no",
  "porsangu.no",
  "pors\xE1\u014Bgu.no",
  "porsgrunn.no",
  "rade.no",
  "r\xE5de.no",
  "radoy.no",
  "rad\xF8y.no",
  "r\xE6lingen.no",
  "rahkkeravju.no",
  "r\xE1hkker\xE1vju.no",
  "raisa.no",
  "r\xE1isa.no",
  "rakkestad.no",
  "ralingen.no",
  "rana.no",
  "randaberg.no",
  "rauma.no",
  "rendalen.no",
  "rennebu.no",
  "rennesoy.no",
  "rennes\xF8y.no",
  "rindal.no",
  "ringebu.no",
  "ringerike.no",
  "ringsaker.no",
  "risor.no",
  "ris\xF8r.no",
  "rissa.no",
  "roan.no",
  "rodoy.no",
  "r\xF8d\xF8y.no",
  "rollag.no",
  "romsa.no",
  "romskog.no",
  "r\xF8mskog.no",
  "roros.no",
  "r\xF8ros.no",
  "rost.no",
  "r\xF8st.no",
  "royken.no",
  "r\xF8yken.no",
  "royrvik.no",
  "r\xF8yrvik.no",
  "ruovat.no",
  "rygge.no",
  "salangen.no",
  "salat.no",
  "s\xE1lat.no",
  "s\xE1l\xE1t.no",
  "saltdal.no",
  "samnanger.no",
  "sandefjord.no",
  "sandnes.no",
  "sandoy.no",
  "sand\xF8y.no",
  "sarpsborg.no",
  "sauda.no",
  "sauherad.no",
  "sel.no",
  "selbu.no",
  "selje.no",
  "seljord.no",
  "siellak.no",
  "sigdal.no",
  "siljan.no",
  "sirdal.no",
  "skanit.no",
  "sk\xE1nit.no",
  "skanland.no",
  "sk\xE5nland.no",
  "skaun.no",
  "skedsmo.no",
  "ski.no",
  "skien.no",
  "skierva.no",
  "skierv\xE1.no",
  "skiptvet.no",
  "skjak.no",
  "skj\xE5k.no",
  "skjervoy.no",
  "skjerv\xF8y.no",
  "skodje.no",
  "smola.no",
  "sm\xF8la.no",
  "snaase.no",
  "sn\xE5ase.no",
  "snasa.no",
  "sn\xE5sa.no",
  "snillfjord.no",
  "snoasa.no",
  "sogndal.no",
  "sogne.no",
  "s\xF8gne.no",
  "sokndal.no",
  "sola.no",
  "solund.no",
  "somna.no",
  "s\xF8mna.no",
  "sondre-land.no",
  "s\xF8ndre-land.no",
  "songdalen.no",
  "sor-aurdal.no",
  "s\xF8r-aurdal.no",
  "sor-fron.no",
  "s\xF8r-fron.no",
  "sor-odal.no",
  "s\xF8r-odal.no",
  "sor-varanger.no",
  "s\xF8r-varanger.no",
  "sorfold.no",
  "s\xF8rfold.no",
  "sorreisa.no",
  "s\xF8rreisa.no",
  "sortland.no",
  "sorum.no",
  "s\xF8rum.no",
  "spydeberg.no",
  "stange.no",
  "stavanger.no",
  "steigen.no",
  "steinkjer.no",
  "stjordal.no",
  "stj\xF8rdal.no",
  "stokke.no",
  "stor-elvdal.no",
  "stord.no",
  "stordal.no",
  "storfjord.no",
  "strand.no",
  "stranda.no",
  "stryn.no",
  "sula.no",
  "suldal.no",
  "sund.no",
  "sunndal.no",
  "surnadal.no",
  "sveio.no",
  "svelvik.no",
  "sykkylven.no",
  "tana.no",
  "bo.telemark.no",
  "b\xF8.telemark.no",
  "time.no",
  "tingvoll.no",
  "tinn.no",
  "tjeldsund.no",
  "tjome.no",
  "tj\xF8me.no",
  "tokke.no",
  "tolga.no",
  "tonsberg.no",
  "t\xF8nsberg.no",
  "torsken.no",
  "tr\xE6na.no",
  "trana.no",
  "tranoy.no",
  "tran\xF8y.no",
  "troandin.no",
  "trogstad.no",
  "tr\xF8gstad.no",
  "tromsa.no",
  "tromso.no",
  "troms\xF8.no",
  "trondheim.no",
  "trysil.no",
  "tvedestrand.no",
  "tydal.no",
  "tynset.no",
  "tysfjord.no",
  "tysnes.no",
  "tysv\xE6r.no",
  "tysvar.no",
  "ullensaker.no",
  "ullensvang.no",
  "ulvik.no",
  "unjarga.no",
  "unj\xE1rga.no",
  "utsira.no",
  "vaapste.no",
  "vadso.no",
  "vads\xF8.no",
  "v\xE6r\xF8y.no",
  "vaga.no",
  "v\xE5g\xE5.no",
  "vagan.no",
  "v\xE5gan.no",
  "vagsoy.no",
  "v\xE5gs\xF8y.no",
  "vaksdal.no",
  "valle.no",
  "vang.no",
  "vanylven.no",
  "vardo.no",
  "vard\xF8.no",
  "varggat.no",
  "v\xE1rgg\xE1t.no",
  "varoy.no",
  "vefsn.no",
  "vega.no",
  "vegarshei.no",
  "veg\xE5rshei.no",
  "vennesla.no",
  "verdal.no",
  "verran.no",
  "vestby.no",
  "sande.vestfold.no",
  "vestnes.no",
  "vestre-slidre.no",
  "vestre-toten.no",
  "vestvagoy.no",
  "vestv\xE5g\xF8y.no",
  "vevelstad.no",
  "vik.no",
  "vikna.no",
  "vindafjord.no",
  "voagat.no",
  "volda.no",
  "voss.no",
  "*.np",
  "nr",
  "biz.nr",
  "com.nr",
  "edu.nr",
  "gov.nr",
  "info.nr",
  "net.nr",
  "org.nr",
  "nu",
  "nz",
  "ac.nz",
  "co.nz",
  "cri.nz",
  "geek.nz",
  "gen.nz",
  "govt.nz",
  "health.nz",
  "iwi.nz",
  "kiwi.nz",
  "maori.nz",
  "m\u0101ori.nz",
  "mil.nz",
  "net.nz",
  "org.nz",
  "parliament.nz",
  "school.nz",
  "om",
  "co.om",
  "com.om",
  "edu.om",
  "gov.om",
  "med.om",
  "museum.om",
  "net.om",
  "org.om",
  "pro.om",
  "onion",
  "org",
  "pa",
  "abo.pa",
  "ac.pa",
  "com.pa",
  "edu.pa",
  "gob.pa",
  "ing.pa",
  "med.pa",
  "net.pa",
  "nom.pa",
  "org.pa",
  "sld.pa",
  "pe",
  "com.pe",
  "edu.pe",
  "gob.pe",
  "mil.pe",
  "net.pe",
  "nom.pe",
  "org.pe",
  "pf",
  "com.pf",
  "edu.pf",
  "org.pf",
  "*.pg",
  "ph",
  "com.ph",
  "edu.ph",
  "gov.ph",
  "i.ph",
  "mil.ph",
  "net.ph",
  "ngo.ph",
  "org.ph",
  "pk",
  "ac.pk",
  "biz.pk",
  "com.pk",
  "edu.pk",
  "fam.pk",
  "gkp.pk",
  "gob.pk",
  "gog.pk",
  "gok.pk",
  "gon.pk",
  "gop.pk",
  "gos.pk",
  "gov.pk",
  "net.pk",
  "org.pk",
  "web.pk",
  "pl",
  "com.pl",
  "net.pl",
  "org.pl",
  "agro.pl",
  "aid.pl",
  "atm.pl",
  "auto.pl",
  "biz.pl",
  "edu.pl",
  "gmina.pl",
  "gsm.pl",
  "info.pl",
  "mail.pl",
  "media.pl",
  "miasta.pl",
  "mil.pl",
  "nieruchomosci.pl",
  "nom.pl",
  "pc.pl",
  "powiat.pl",
  "priv.pl",
  "realestate.pl",
  "rel.pl",
  "sex.pl",
  "shop.pl",
  "sklep.pl",
  "sos.pl",
  "szkola.pl",
  "targi.pl",
  "tm.pl",
  "tourism.pl",
  "travel.pl",
  "turystyka.pl",
  "gov.pl",
  "ap.gov.pl",
  "griw.gov.pl",
  "ic.gov.pl",
  "is.gov.pl",
  "kmpsp.gov.pl",
  "konsulat.gov.pl",
  "kppsp.gov.pl",
  "kwp.gov.pl",
  "kwpsp.gov.pl",
  "mup.gov.pl",
  "mw.gov.pl",
  "oia.gov.pl",
  "oirm.gov.pl",
  "oke.gov.pl",
  "oow.gov.pl",
  "oschr.gov.pl",
  "oum.gov.pl",
  "pa.gov.pl",
  "pinb.gov.pl",
  "piw.gov.pl",
  "po.gov.pl",
  "pr.gov.pl",
  "psp.gov.pl",
  "psse.gov.pl",
  "pup.gov.pl",
  "rzgw.gov.pl",
  "sa.gov.pl",
  "sdn.gov.pl",
  "sko.gov.pl",
  "so.gov.pl",
  "sr.gov.pl",
  "starostwo.gov.pl",
  "ug.gov.pl",
  "ugim.gov.pl",
  "um.gov.pl",
  "umig.gov.pl",
  "upow.gov.pl",
  "uppo.gov.pl",
  "us.gov.pl",
  "uw.gov.pl",
  "uzs.gov.pl",
  "wif.gov.pl",
  "wiih.gov.pl",
  "winb.gov.pl",
  "wios.gov.pl",
  "witd.gov.pl",
  "wiw.gov.pl",
  "wkz.gov.pl",
  "wsa.gov.pl",
  "wskr.gov.pl",
  "wsse.gov.pl",
  "wuoz.gov.pl",
  "wzmiuw.gov.pl",
  "zp.gov.pl",
  "zpisdn.gov.pl",
  "augustow.pl",
  "babia-gora.pl",
  "bedzin.pl",
  "beskidy.pl",
  "bialowieza.pl",
  "bialystok.pl",
  "bielawa.pl",
  "bieszczady.pl",
  "boleslawiec.pl",
  "bydgoszcz.pl",
  "bytom.pl",
  "cieszyn.pl",
  "czeladz.pl",
  "czest.pl",
  "dlugoleka.pl",
  "elblag.pl",
  "elk.pl",
  "glogow.pl",
  "gniezno.pl",
  "gorlice.pl",
  "grajewo.pl",
  "ilawa.pl",
  "jaworzno.pl",
  "jelenia-gora.pl",
  "jgora.pl",
  "kalisz.pl",
  "karpacz.pl",
  "kartuzy.pl",
  "kaszuby.pl",
  "katowice.pl",
  "kazimierz-dolny.pl",
  "kepno.pl",
  "ketrzyn.pl",
  "klodzko.pl",
  "kobierzyce.pl",
  "kolobrzeg.pl",
  "konin.pl",
  "konskowola.pl",
  "kutno.pl",
  "lapy.pl",
  "lebork.pl",
  "legnica.pl",
  "lezajsk.pl",
  "limanowa.pl",
  "lomza.pl",
  "lowicz.pl",
  "lubin.pl",
  "lukow.pl",
  "malbork.pl",
  "malopolska.pl",
  "mazowsze.pl",
  "mazury.pl",
  "mielec.pl",
  "mielno.pl",
  "mragowo.pl",
  "naklo.pl",
  "nowaruda.pl",
  "nysa.pl",
  "olawa.pl",
  "olecko.pl",
  "olkusz.pl",
  "olsztyn.pl",
  "opoczno.pl",
  "opole.pl",
  "ostroda.pl",
  "ostroleka.pl",
  "ostrowiec.pl",
  "ostrowwlkp.pl",
  "pila.pl",
  "pisz.pl",
  "podhale.pl",
  "podlasie.pl",
  "polkowice.pl",
  "pomorskie.pl",
  "pomorze.pl",
  "prochowice.pl",
  "pruszkow.pl",
  "przeworsk.pl",
  "pulawy.pl",
  "radom.pl",
  "rawa-maz.pl",
  "rybnik.pl",
  "rzeszow.pl",
  "sanok.pl",
  "sejny.pl",
  "skoczow.pl",
  "slask.pl",
  "slupsk.pl",
  "sosnowiec.pl",
  "stalowa-wola.pl",
  "starachowice.pl",
  "stargard.pl",
  "suwalki.pl",
  "swidnica.pl",
  "swiebodzin.pl",
  "swinoujscie.pl",
  "szczecin.pl",
  "szczytno.pl",
  "tarnobrzeg.pl",
  "tgory.pl",
  "turek.pl",
  "tychy.pl",
  "ustka.pl",
  "walbrzych.pl",
  "warmia.pl",
  "warszawa.pl",
  "waw.pl",
  "wegrow.pl",
  "wielun.pl",
  "wlocl.pl",
  "wloclawek.pl",
  "wodzislaw.pl",
  "wolomin.pl",
  "wroclaw.pl",
  "zachpomor.pl",
  "zagan.pl",
  "zarow.pl",
  "zgora.pl",
  "zgorzelec.pl",
  "pm",
  "pn",
  "co.pn",
  "edu.pn",
  "gov.pn",
  "net.pn",
  "org.pn",
  "post",
  "pr",
  "biz.pr",
  "com.pr",
  "edu.pr",
  "gov.pr",
  "info.pr",
  "isla.pr",
  "name.pr",
  "net.pr",
  "org.pr",
  "pro.pr",
  "ac.pr",
  "est.pr",
  "prof.pr",
  "pro",
  "aaa.pro",
  "aca.pro",
  "acct.pro",
  "avocat.pro",
  "bar.pro",
  "cpa.pro",
  "eng.pro",
  "jur.pro",
  "law.pro",
  "med.pro",
  "recht.pro",
  "ps",
  "com.ps",
  "edu.ps",
  "gov.ps",
  "net.ps",
  "org.ps",
  "plo.ps",
  "sec.ps",
  "pt",
  "com.pt",
  "edu.pt",
  "gov.pt",
  "int.pt",
  "net.pt",
  "nome.pt",
  "org.pt",
  "publ.pt",
  "pw",
  "belau.pw",
  "co.pw",
  "ed.pw",
  "go.pw",
  "or.pw",
  "py",
  "com.py",
  "coop.py",
  "edu.py",
  "gov.py",
  "mil.py",
  "net.py",
  "org.py",
  "qa",
  "com.qa",
  "edu.qa",
  "gov.qa",
  "mil.qa",
  "name.qa",
  "net.qa",
  "org.qa",
  "sch.qa",
  "re",
  "asso.re",
  "com.re",
  "ro",
  "arts.ro",
  "com.ro",
  "firm.ro",
  "info.ro",
  "nom.ro",
  "nt.ro",
  "org.ro",
  "rec.ro",
  "store.ro",
  "tm.ro",
  "www.ro",
  "rs",
  "ac.rs",
  "co.rs",
  "edu.rs",
  "gov.rs",
  "in.rs",
  "org.rs",
  "ru",
  "rw",
  "ac.rw",
  "co.rw",
  "coop.rw",
  "gov.rw",
  "mil.rw",
  "net.rw",
  "org.rw",
  "sa",
  "com.sa",
  "edu.sa",
  "gov.sa",
  "med.sa",
  "net.sa",
  "org.sa",
  "pub.sa",
  "sch.sa",
  "sb",
  "com.sb",
  "edu.sb",
  "gov.sb",
  "net.sb",
  "org.sb",
  "sc",
  "com.sc",
  "edu.sc",
  "gov.sc",
  "net.sc",
  "org.sc",
  "sd",
  "com.sd",
  "edu.sd",
  "gov.sd",
  "info.sd",
  "med.sd",
  "net.sd",
  "org.sd",
  "tv.sd",
  "se",
  "a.se",
  "ac.se",
  "b.se",
  "bd.se",
  "brand.se",
  "c.se",
  "d.se",
  "e.se",
  "f.se",
  "fh.se",
  "fhsk.se",
  "fhv.se",
  "g.se",
  "h.se",
  "i.se",
  "k.se",
  "komforb.se",
  "kommunalforbund.se",
  "komvux.se",
  "l.se",
  "lanbib.se",
  "m.se",
  "n.se",
  "naturbruksgymn.se",
  "o.se",
  "org.se",
  "p.se",
  "parti.se",
  "pp.se",
  "press.se",
  "r.se",
  "s.se",
  "t.se",
  "tm.se",
  "u.se",
  "w.se",
  "x.se",
  "y.se",
  "z.se",
  "sg",
  "com.sg",
  "edu.sg",
  "gov.sg",
  "net.sg",
  "org.sg",
  "sh",
  "com.sh",
  "gov.sh",
  "mil.sh",
  "net.sh",
  "org.sh",
  "si",
  "sj",
  "sk",
  "sl",
  "com.sl",
  "edu.sl",
  "gov.sl",
  "net.sl",
  "org.sl",
  "sm",
  "sn",
  "art.sn",
  "com.sn",
  "edu.sn",
  "gouv.sn",
  "org.sn",
  "perso.sn",
  "univ.sn",
  "so",
  "com.so",
  "edu.so",
  "gov.so",
  "me.so",
  "net.so",
  "org.so",
  "sr",
  "ss",
  "biz.ss",
  "co.ss",
  "com.ss",
  "edu.ss",
  "gov.ss",
  "me.ss",
  "net.ss",
  "org.ss",
  "sch.ss",
  "st",
  "co.st",
  "com.st",
  "consulado.st",
  "edu.st",
  "embaixada.st",
  "mil.st",
  "net.st",
  "org.st",
  "principe.st",
  "saotome.st",
  "store.st",
  "su",
  "sv",
  "com.sv",
  "edu.sv",
  "gob.sv",
  "org.sv",
  "red.sv",
  "sx",
  "gov.sx",
  "sy",
  "com.sy",
  "edu.sy",
  "gov.sy",
  "mil.sy",
  "net.sy",
  "org.sy",
  "sz",
  "ac.sz",
  "co.sz",
  "org.sz",
  "tc",
  "td",
  "tel",
  "tf",
  "tg",
  "th",
  "ac.th",
  "co.th",
  "go.th",
  "in.th",
  "mi.th",
  "net.th",
  "or.th",
  "tj",
  "ac.tj",
  "biz.tj",
  "co.tj",
  "com.tj",
  "edu.tj",
  "go.tj",
  "gov.tj",
  "int.tj",
  "mil.tj",
  "name.tj",
  "net.tj",
  "nic.tj",
  "org.tj",
  "test.tj",
  "web.tj",
  "tk",
  "tl",
  "gov.tl",
  "tm",
  "co.tm",
  "com.tm",
  "edu.tm",
  "gov.tm",
  "mil.tm",
  "net.tm",
  "nom.tm",
  "org.tm",
  "tn",
  "com.tn",
  "ens.tn",
  "fin.tn",
  "gov.tn",
  "ind.tn",
  "info.tn",
  "intl.tn",
  "mincom.tn",
  "nat.tn",
  "net.tn",
  "org.tn",
  "perso.tn",
  "tourism.tn",
  "to",
  "com.to",
  "edu.to",
  "gov.to",
  "mil.to",
  "net.to",
  "org.to",
  "tr",
  "av.tr",
  "bbs.tr",
  "bel.tr",
  "biz.tr",
  "com.tr",
  "dr.tr",
  "edu.tr",
  "gen.tr",
  "gov.tr",
  "info.tr",
  "k12.tr",
  "kep.tr",
  "mil.tr",
  "name.tr",
  "net.tr",
  "org.tr",
  "pol.tr",
  "tel.tr",
  "tsk.tr",
  "tv.tr",
  "web.tr",
  "nc.tr",
  "gov.nc.tr",
  "tt",
  "biz.tt",
  "co.tt",
  "com.tt",
  "edu.tt",
  "gov.tt",
  "info.tt",
  "mil.tt",
  "name.tt",
  "net.tt",
  "org.tt",
  "pro.tt",
  "tv",
  "tw",
  "club.tw",
  "com.tw",
  "ebiz.tw",
  "edu.tw",
  "game.tw",
  "gov.tw",
  "idv.tw",
  "mil.tw",
  "net.tw",
  "org.tw",
  "tz",
  "ac.tz",
  "co.tz",
  "go.tz",
  "hotel.tz",
  "info.tz",
  "me.tz",
  "mil.tz",
  "mobi.tz",
  "ne.tz",
  "or.tz",
  "sc.tz",
  "tv.tz",
  "ua",
  "com.ua",
  "edu.ua",
  "gov.ua",
  "in.ua",
  "net.ua",
  "org.ua",
  "cherkassy.ua",
  "cherkasy.ua",
  "chernigov.ua",
  "chernihiv.ua",
  "chernivtsi.ua",
  "chernovtsy.ua",
  "ck.ua",
  "cn.ua",
  "cr.ua",
  "crimea.ua",
  "cv.ua",
  "dn.ua",
  "dnepropetrovsk.ua",
  "dnipropetrovsk.ua",
  "donetsk.ua",
  "dp.ua",
  "if.ua",
  "ivano-frankivsk.ua",
  "kh.ua",
  "kharkiv.ua",
  "kharkov.ua",
  "kherson.ua",
  "khmelnitskiy.ua",
  "khmelnytskyi.ua",
  "kiev.ua",
  "kirovograd.ua",
  "km.ua",
  "kr.ua",
  "kropyvnytskyi.ua",
  "krym.ua",
  "ks.ua",
  "kv.ua",
  "kyiv.ua",
  "lg.ua",
  "lt.ua",
  "lugansk.ua",
  "luhansk.ua",
  "lutsk.ua",
  "lv.ua",
  "lviv.ua",
  "mk.ua",
  "mykolaiv.ua",
  "nikolaev.ua",
  "od.ua",
  "odesa.ua",
  "odessa.ua",
  "pl.ua",
  "poltava.ua",
  "rivne.ua",
  "rovno.ua",
  "rv.ua",
  "sb.ua",
  "sebastopol.ua",
  "sevastopol.ua",
  "sm.ua",
  "sumy.ua",
  "te.ua",
  "ternopil.ua",
  "uz.ua",
  "uzhgorod.ua",
  "uzhhorod.ua",
  "vinnica.ua",
  "vinnytsia.ua",
  "vn.ua",
  "volyn.ua",
  "yalta.ua",
  "zakarpattia.ua",
  "zaporizhzhe.ua",
  "zaporizhzhia.ua",
  "zhitomir.ua",
  "zhytomyr.ua",
  "zp.ua",
  "zt.ua",
  "ug",
  "ac.ug",
  "co.ug",
  "com.ug",
  "go.ug",
  "ne.ug",
  "or.ug",
  "org.ug",
  "sc.ug",
  "uk",
  "ac.uk",
  "co.uk",
  "gov.uk",
  "ltd.uk",
  "me.uk",
  "net.uk",
  "nhs.uk",
  "org.uk",
  "plc.uk",
  "police.uk",
  "*.sch.uk",
  "us",
  "dni.us",
  "fed.us",
  "isa.us",
  "kids.us",
  "nsn.us",
  "ak.us",
  "al.us",
  "ar.us",
  "as.us",
  "az.us",
  "ca.us",
  "co.us",
  "ct.us",
  "dc.us",
  "de.us",
  "fl.us",
  "ga.us",
  "gu.us",
  "hi.us",
  "ia.us",
  "id.us",
  "il.us",
  "in.us",
  "ks.us",
  "ky.us",
  "la.us",
  "ma.us",
  "md.us",
  "me.us",
  "mi.us",
  "mn.us",
  "mo.us",
  "ms.us",
  "mt.us",
  "nc.us",
  "nd.us",
  "ne.us",
  "nh.us",
  "nj.us",
  "nm.us",
  "nv.us",
  "ny.us",
  "oh.us",
  "ok.us",
  "or.us",
  "pa.us",
  "pr.us",
  "ri.us",
  "sc.us",
  "sd.us",
  "tn.us",
  "tx.us",
  "ut.us",
  "va.us",
  "vi.us",
  "vt.us",
  "wa.us",
  "wi.us",
  "wv.us",
  "wy.us",
  "k12.ak.us",
  "k12.al.us",
  "k12.ar.us",
  "k12.as.us",
  "k12.az.us",
  "k12.ca.us",
  "k12.co.us",
  "k12.ct.us",
  "k12.dc.us",
  "k12.fl.us",
  "k12.ga.us",
  "k12.gu.us",
  "k12.ia.us",
  "k12.id.us",
  "k12.il.us",
  "k12.in.us",
  "k12.ks.us",
  "k12.ky.us",
  "k12.la.us",
  "k12.ma.us",
  "k12.md.us",
  "k12.me.us",
  "k12.mi.us",
  "k12.mn.us",
  "k12.mo.us",
  "k12.ms.us",
  "k12.mt.us",
  "k12.nc.us",
  "k12.ne.us",
  "k12.nh.us",
  "k12.nj.us",
  "k12.nm.us",
  "k12.nv.us",
  "k12.ny.us",
  "k12.oh.us",
  "k12.ok.us",
  "k12.or.us",
  "k12.pa.us",
  "k12.pr.us",
  "k12.sc.us",
  "k12.tn.us",
  "k12.tx.us",
  "k12.ut.us",
  "k12.va.us",
  "k12.vi.us",
  "k12.vt.us",
  "k12.wa.us",
  "k12.wi.us",
  "cc.ak.us",
  "lib.ak.us",
  "cc.al.us",
  "lib.al.us",
  "cc.ar.us",
  "lib.ar.us",
  "cc.as.us",
  "lib.as.us",
  "cc.az.us",
  "lib.az.us",
  "cc.ca.us",
  "lib.ca.us",
  "cc.co.us",
  "lib.co.us",
  "cc.ct.us",
  "lib.ct.us",
  "cc.dc.us",
  "lib.dc.us",
  "cc.de.us",
  "cc.fl.us",
  "cc.ga.us",
  "cc.gu.us",
  "cc.hi.us",
  "cc.ia.us",
  "cc.id.us",
  "cc.il.us",
  "cc.in.us",
  "cc.ks.us",
  "cc.ky.us",
  "cc.la.us",
  "cc.ma.us",
  "cc.md.us",
  "cc.me.us",
  "cc.mi.us",
  "cc.mn.us",
  "cc.mo.us",
  "cc.ms.us",
  "cc.mt.us",
  "cc.nc.us",
  "cc.nd.us",
  "cc.ne.us",
  "cc.nh.us",
  "cc.nj.us",
  "cc.nm.us",
  "cc.nv.us",
  "cc.ny.us",
  "cc.oh.us",
  "cc.ok.us",
  "cc.or.us",
  "cc.pa.us",
  "cc.pr.us",
  "cc.ri.us",
  "cc.sc.us",
  "cc.sd.us",
  "cc.tn.us",
  "cc.tx.us",
  "cc.ut.us",
  "cc.va.us",
  "cc.vi.us",
  "cc.vt.us",
  "cc.wa.us",
  "cc.wi.us",
  "cc.wv.us",
  "cc.wy.us",
  "k12.wy.us",
  "lib.fl.us",
  "lib.ga.us",
  "lib.gu.us",
  "lib.hi.us",
  "lib.ia.us",
  "lib.id.us",
  "lib.il.us",
  "lib.in.us",
  "lib.ks.us",
  "lib.ky.us",
  "lib.la.us",
  "lib.ma.us",
  "lib.md.us",
  "lib.me.us",
  "lib.mi.us",
  "lib.mn.us",
  "lib.mo.us",
  "lib.ms.us",
  "lib.mt.us",
  "lib.nc.us",
  "lib.nd.us",
  "lib.ne.us",
  "lib.nh.us",
  "lib.nj.us",
  "lib.nm.us",
  "lib.nv.us",
  "lib.ny.us",
  "lib.oh.us",
  "lib.ok.us",
  "lib.or.us",
  "lib.pa.us",
  "lib.pr.us",
  "lib.ri.us",
  "lib.sc.us",
  "lib.sd.us",
  "lib.tn.us",
  "lib.tx.us",
  "lib.ut.us",
  "lib.va.us",
  "lib.vi.us",
  "lib.vt.us",
  "lib.wa.us",
  "lib.wi.us",
  "lib.wy.us",
  "chtr.k12.ma.us",
  "paroch.k12.ma.us",
  "pvt.k12.ma.us",
  "ann-arbor.mi.us",
  "cog.mi.us",
  "dst.mi.us",
  "eaton.mi.us",
  "gen.mi.us",
  "mus.mi.us",
  "tec.mi.us",
  "washtenaw.mi.us",
  "uy",
  "com.uy",
  "edu.uy",
  "gub.uy",
  "mil.uy",
  "net.uy",
  "org.uy",
  "uz",
  "co.uz",
  "com.uz",
  "net.uz",
  "org.uz",
  "va",
  "vc",
  "com.vc",
  "edu.vc",
  "gov.vc",
  "mil.vc",
  "net.vc",
  "org.vc",
  "ve",
  "arts.ve",
  "bib.ve",
  "co.ve",
  "com.ve",
  "e12.ve",
  "edu.ve",
  "firm.ve",
  "gob.ve",
  "gov.ve",
  "info.ve",
  "int.ve",
  "mil.ve",
  "net.ve",
  "nom.ve",
  "org.ve",
  "rar.ve",
  "rec.ve",
  "store.ve",
  "tec.ve",
  "web.ve",
  "vg",
  "vi",
  "co.vi",
  "com.vi",
  "k12.vi",
  "net.vi",
  "org.vi",
  "vn",
  "ac.vn",
  "ai.vn",
  "biz.vn",
  "com.vn",
  "edu.vn",
  "gov.vn",
  "health.vn",
  "id.vn",
  "info.vn",
  "int.vn",
  "io.vn",
  "name.vn",
  "net.vn",
  "org.vn",
  "pro.vn",
  "angiang.vn",
  "bacgiang.vn",
  "backan.vn",
  "baclieu.vn",
  "bacninh.vn",
  "baria-vungtau.vn",
  "bentre.vn",
  "binhdinh.vn",
  "binhduong.vn",
  "binhphuoc.vn",
  "binhthuan.vn",
  "camau.vn",
  "cantho.vn",
  "caobang.vn",
  "daklak.vn",
  "daknong.vn",
  "danang.vn",
  "dienbien.vn",
  "dongnai.vn",
  "dongthap.vn",
  "gialai.vn",
  "hagiang.vn",
  "haiduong.vn",
  "haiphong.vn",
  "hanam.vn",
  "hanoi.vn",
  "hatinh.vn",
  "haugiang.vn",
  "hoabinh.vn",
  "hungyen.vn",
  "khanhhoa.vn",
  "kiengiang.vn",
  "kontum.vn",
  "laichau.vn",
  "lamdong.vn",
  "langson.vn",
  "laocai.vn",
  "longan.vn",
  "namdinh.vn",
  "nghean.vn",
  "ninhbinh.vn",
  "ninhthuan.vn",
  "phutho.vn",
  "phuyen.vn",
  "quangbinh.vn",
  "quangnam.vn",
  "quangngai.vn",
  "quangninh.vn",
  "quangtri.vn",
  "soctrang.vn",
  "sonla.vn",
  "tayninh.vn",
  "thaibinh.vn",
  "thainguyen.vn",
  "thanhhoa.vn",
  "thanhphohochiminh.vn",
  "thuathienhue.vn",
  "tiengiang.vn",
  "travinh.vn",
  "tuyenquang.vn",
  "vinhlong.vn",
  "vinhphuc.vn",
  "yenbai.vn",
  "vu",
  "com.vu",
  "edu.vu",
  "net.vu",
  "org.vu",
  "wf",
  "ws",
  "com.ws",
  "edu.ws",
  "gov.ws",
  "net.ws",
  "org.ws",
  "yt",
  "\u0627\u0645\u0627\u0631\u0627\u062A",
  "\u0570\u0561\u0575",
  "\u09AC\u09BE\u0982\u09B2\u09BE",
  "\u0431\u0433",
  "\u0627\u0644\u0628\u062D\u0631\u064A\u0646",
  "\u0431\u0435\u043B",
  "\u4E2D\u56FD",
  "\u4E2D\u570B",
  "\u0627\u0644\u062C\u0632\u0627\u0626\u0631",
  "\u0645\u0635\u0631",
  "\u0435\u044E",
  "\u03B5\u03C5",
  "\u0645\u0648\u0631\u064A\u062A\u0627\u0646\u064A\u0627",
  "\u10D2\u10D4",
  "\u03B5\u03BB",
  "\u9999\u6E2F",
  "\u500B\u4EBA.\u9999\u6E2F",
  "\u516C\u53F8.\u9999\u6E2F",
  "\u653F\u5E9C.\u9999\u6E2F",
  "\u6559\u80B2.\u9999\u6E2F",
  "\u7D44\u7E54.\u9999\u6E2F",
  "\u7DB2\u7D61.\u9999\u6E2F",
  "\u0CAD\u0CBE\u0CB0\u0CA4",
  "\u0B2D\u0B3E\u0B30\u0B24",
  "\u09AD\u09BE\u09F0\u09A4",
  "\u092D\u093E\u0930\u0924\u092E\u094D",
  "\u092D\u093E\u0930\u094B\u0924",
  "\u0680\u0627\u0631\u062A",
  "\u0D2D\u0D3E\u0D30\u0D24\u0D02",
  "\u092D\u093E\u0930\u0924",
  "\u0628\u0627\u0631\u062A",
  "\u0628\u06BE\u0627\u0631\u062A",
  "\u0C2D\u0C3E\u0C30\u0C24\u0C4D",
  "\u0AAD\u0ABE\u0AB0\u0AA4",
  "\u0A2D\u0A3E\u0A30\u0A24",
  "\u09AD\u09BE\u09B0\u09A4",
  "\u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF\u0BBE",
  "\u0627\u06CC\u0631\u0627\u0646",
  "\u0627\u064A\u0631\u0627\u0646",
  "\u0639\u0631\u0627\u0642",
  "\u0627\u0644\u0627\u0631\u062F\u0646",
  "\uD55C\uAD6D",
  "\u049B\u0430\u0437",
  "\u0EA5\u0EB2\u0EA7",
  "\u0DBD\u0D82\u0D9A\u0DCF",
  "\u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8",
  "\u0627\u0644\u0645\u063A\u0631\u0628",
  "\u043C\u043A\u0434",
  "\u043C\u043E\u043D",
  "\u6FB3\u9580",
  "\u6FB3\u95E8",
  "\u0645\u0644\u064A\u0633\u064A\u0627",
  "\u0639\u0645\u0627\u0646",
  "\u067E\u0627\u06A9\u0633\u062A\u0627\u0646",
  "\u067E\u0627\u0643\u0633\u062A\u0627\u0646",
  "\u0641\u0644\u0633\u0637\u064A\u0646",
  "\u0441\u0440\u0431",
  "\u0430\u043A.\u0441\u0440\u0431",
  "\u043E\u0431\u0440.\u0441\u0440\u0431",
  "\u043E\u0434.\u0441\u0440\u0431",
  "\u043E\u0440\u0433.\u0441\u0440\u0431",
  "\u043F\u0440.\u0441\u0440\u0431",
  "\u0443\u043F\u0440.\u0441\u0440\u0431",
  "\u0440\u0444",
  "\u0642\u0637\u0631",
  "\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
  "\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u0629",
  "\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u06C3",
  "\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0647",
  "\u0633\u0648\u062F\u0627\u0646",
  "\u65B0\u52A0\u5761",
  "\u0B9A\u0BBF\u0B99\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0BC2\u0BB0\u0BCD",
  "\u0633\u0648\u0631\u064A\u0629",
  "\u0633\u0648\u0631\u064A\u0627",
  "\u0E44\u0E17\u0E22",
  "\u0E17\u0E2B\u0E32\u0E23.\u0E44\u0E17\u0E22",
  "\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08.\u0E44\u0E17\u0E22",
  "\u0E40\u0E19\u0E47\u0E15.\u0E44\u0E17\u0E22",
  "\u0E23\u0E31\u0E10\u0E1A\u0E32\u0E25.\u0E44\u0E17\u0E22",
  "\u0E28\u0E36\u0E01\u0E29\u0E32.\u0E44\u0E17\u0E22",
  "\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23.\u0E44\u0E17\u0E22",
  "\u062A\u0648\u0646\u0633",
  "\u53F0\u7063",
  "\u53F0\u6E7E",
  "\u81FA\u7063",
  "\u0443\u043A\u0440",
  "\u0627\u0644\u064A\u0645\u0646",
  "xxx",
  "ye",
  "com.ye",
  "edu.ye",
  "gov.ye",
  "mil.ye",
  "net.ye",
  "org.ye",
  "ac.za",
  "agric.za",
  "alt.za",
  "co.za",
  "edu.za",
  "gov.za",
  "grondar.za",
  "law.za",
  "mil.za",
  "net.za",
  "ngo.za",
  "nic.za",
  "nis.za",
  "nom.za",
  "org.za",
  "school.za",
  "tm.za",
  "web.za",
  "zm",
  "ac.zm",
  "biz.zm",
  "co.zm",
  "com.zm",
  "edu.zm",
  "gov.zm",
  "info.zm",
  "mil.zm",
  "net.zm",
  "org.zm",
  "sch.zm",
  "zw",
  "ac.zw",
  "co.zw",
  "gov.zw",
  "mil.zw",
  "org.zw",
  "aaa",
  "aarp",
  "abb",
  "abbott",
  "abbvie",
  "abc",
  "able",
  "abogado",
  "abudhabi",
  "academy",
  "accenture",
  "accountant",
  "accountants",
  "aco",
  "actor",
  "ads",
  "adult",
  "aeg",
  "aetna",
  "afl",
  "africa",
  "agakhan",
  "agency",
  "aig",
  "airbus",
  "airforce",
  "airtel",
  "akdn",
  "alibaba",
  "alipay",
  "allfinanz",
  "allstate",
  "ally",
  "alsace",
  "alstom",
  "amazon",
  "americanexpress",
  "americanfamily",
  "amex",
  "amfam",
  "amica",
  "amsterdam",
  "analytics",
  "android",
  "anquan",
  "anz",
  "aol",
  "apartments",
  "app",
  "apple",
  "aquarelle",
  "arab",
  "aramco",
  "archi",
  "army",
  "art",
  "arte",
  "asda",
  "associates",
  "athleta",
  "attorney",
  "auction",
  "audi",
  "audible",
  "audio",
  "auspost",
  "author",
  "auto",
  "autos",
  "aws",
  "axa",
  "azure",
  "baby",
  "baidu",
  "banamex",
  "band",
  "bank",
  "bar",
  "barcelona",
  "barclaycard",
  "barclays",
  "barefoot",
  "bargains",
  "baseball",
  "basketball",
  "bauhaus",
  "bayern",
  "bbc",
  "bbt",
  "bbva",
  "bcg",
  "bcn",
  "beats",
  "beauty",
  "beer",
  "bentley",
  "berlin",
  "best",
  "bestbuy",
  "bet",
  "bharti",
  "bible",
  "bid",
  "bike",
  "bing",
  "bingo",
  "bio",
  "black",
  "blackfriday",
  "blockbuster",
  "blog",
  "bloomberg",
  "blue",
  "bms",
  "bmw",
  "bnpparibas",
  "boats",
  "boehringer",
  "bofa",
  "bom",
  "bond",
  "boo",
  "book",
  "booking",
  "bosch",
  "bostik",
  "boston",
  "bot",
  "boutique",
  "box",
  "bradesco",
  "bridgestone",
  "broadway",
  "broker",
  "brother",
  "brussels",
  "build",
  "builders",
  "business",
  "buy",
  "buzz",
  "bzh",
  "cab",
  "cafe",
  "cal",
  "call",
  "calvinklein",
  "cam",
  "camera",
  "camp",
  "canon",
  "capetown",
  "capital",
  "capitalone",
  "car",
  "caravan",
  "cards",
  "care",
  "career",
  "careers",
  "cars",
  "casa",
  "case",
  "cash",
  "casino",
  "catering",
  "catholic",
  "cba",
  "cbn",
  "cbre",
  "center",
  "ceo",
  "cern",
  "cfa",
  "cfd",
  "chanel",
  "channel",
  "charity",
  "chase",
  "chat",
  "cheap",
  "chintai",
  "christmas",
  "chrome",
  "church",
  "cipriani",
  "circle",
  "cisco",
  "citadel",
  "citi",
  "citic",
  "city",
  "claims",
  "cleaning",
  "click",
  "clinic",
  "clinique",
  "clothing",
  "cloud",
  "club",
  "clubmed",
  "coach",
  "codes",
  "coffee",
  "college",
  "cologne",
  "commbank",
  "community",
  "company",
  "compare",
  "computer",
  "comsec",
  "condos",
  "construction",
  "consulting",
  "contact",
  "contractors",
  "cooking",
  "cool",
  "corsica",
  "country",
  "coupon",
  "coupons",
  "courses",
  "cpa",
  "credit",
  "creditcard",
  "creditunion",
  "cricket",
  "crown",
  "crs",
  "cruise",
  "cruises",
  "cuisinella",
  "cymru",
  "cyou",
  "dad",
  "dance",
  "data",
  "date",
  "dating",
  "datsun",
  "day",
  "dclk",
  "dds",
  "deal",
  "dealer",
  "deals",
  "degree",
  "delivery",
  "dell",
  "deloitte",
  "delta",
  "democrat",
  "dental",
  "dentist",
  "desi",
  "design",
  "dev",
  "dhl",
  "diamonds",
  "diet",
  "digital",
  "direct",
  "directory",
  "discount",
  "discover",
  "dish",
  "diy",
  "dnp",
  "docs",
  "doctor",
  "dog",
  "domains",
  "dot",
  "download",
  "drive",
  "dtv",
  "dubai",
  "dunlop",
  "dupont",
  "durban",
  "dvag",
  "dvr",
  "earth",
  "eat",
  "eco",
  "edeka",
  "education",
  "email",
  "emerck",
  "energy",
  "engineer",
  "engineering",
  "enterprises",
  "epson",
  "equipment",
  "ericsson",
  "erni",
  "esq",
  "estate",
  "eurovision",
  "eus",
  "events",
  "exchange",
  "expert",
  "exposed",
  "express",
  "extraspace",
  "fage",
  "fail",
  "fairwinds",
  "faith",
  "family",
  "fan",
  "fans",
  "farm",
  "farmers",
  "fashion",
  "fast",
  "fedex",
  "feedback",
  "ferrari",
  "ferrero",
  "fidelity",
  "fido",
  "film",
  "final",
  "finance",
  "financial",
  "fire",
  "firestone",
  "firmdale",
  "fish",
  "fishing",
  "fit",
  "fitness",
  "flickr",
  "flights",
  "flir",
  "florist",
  "flowers",
  "fly",
  "foo",
  "food",
  "football",
  "ford",
  "forex",
  "forsale",
  "forum",
  "foundation",
  "fox",
  "free",
  "fresenius",
  "frl",
  "frogans",
  "frontier",
  "ftr",
  "fujitsu",
  "fun",
  "fund",
  "furniture",
  "futbol",
  "fyi",
  "gal",
  "gallery",
  "gallo",
  "gallup",
  "game",
  "games",
  "gap",
  "garden",
  "gay",
  "gbiz",
  "gdn",
  "gea",
  "gent",
  "genting",
  "george",
  "ggee",
  "gift",
  "gifts",
  "gives",
  "giving",
  "glass",
  "gle",
  "global",
  "globo",
  "gmail",
  "gmbh",
  "gmo",
  "gmx",
  "godaddy",
  "gold",
  "goldpoint",
  "golf",
  "goo",
  "goodyear",
  "goog",
  "google",
  "gop",
  "got",
  "grainger",
  "graphics",
  "gratis",
  "green",
  "gripe",
  "grocery",
  "group",
  "gucci",
  "guge",
  "guide",
  "guitars",
  "guru",
  "hair",
  "hamburg",
  "hangout",
  "haus",
  "hbo",
  "hdfc",
  "hdfcbank",
  "health",
  "healthcare",
  "help",
  "helsinki",
  "here",
  "hermes",
  "hiphop",
  "hisamitsu",
  "hitachi",
  "hiv",
  "hkt",
  "hockey",
  "holdings",
  "holiday",
  "homedepot",
  "homegoods",
  "homes",
  "homesense",
  "honda",
  "horse",
  "hospital",
  "host",
  "hosting",
  "hot",
  "hotels",
  "hotmail",
  "house",
  "how",
  "hsbc",
  "hughes",
  "hyatt",
  "hyundai",
  "ibm",
  "icbc",
  "ice",
  "icu",
  "ieee",
  "ifm",
  "ikano",
  "imamat",
  "imdb",
  "immo",
  "immobilien",
  "inc",
  "industries",
  "infiniti",
  "ing",
  "ink",
  "institute",
  "insurance",
  "insure",
  "international",
  "intuit",
  "investments",
  "ipiranga",
  "irish",
  "ismaili",
  "ist",
  "istanbul",
  "itau",
  "itv",
  "jaguar",
  "java",
  "jcb",
  "jeep",
  "jetzt",
  "jewelry",
  "jio",
  "jll",
  "jmp",
  "jnj",
  "joburg",
  "jot",
  "joy",
  "jpmorgan",
  "jprs",
  "juegos",
  "juniper",
  "kaufen",
  "kddi",
  "kerryhotels",
  "kerrylogistics",
  "kerryproperties",
  "kfh",
  "kia",
  "kids",
  "kim",
  "kindle",
  "kitchen",
  "kiwi",
  "koeln",
  "komatsu",
  "kosher",
  "kpmg",
  "kpn",
  "krd",
  "kred",
  "kuokgroup",
  "kyoto",
  "lacaixa",
  "lamborghini",
  "lamer",
  "lancaster",
  "land",
  "landrover",
  "lanxess",
  "lasalle",
  "lat",
  "latino",
  "latrobe",
  "law",
  "lawyer",
  "lds",
  "lease",
  "leclerc",
  "lefrak",
  "legal",
  "lego",
  "lexus",
  "lgbt",
  "lidl",
  "life",
  "lifeinsurance",
  "lifestyle",
  "lighting",
  "like",
  "lilly",
  "limited",
  "limo",
  "lincoln",
  "link",
  "lipsy",
  "live",
  "living",
  "llc",
  "llp",
  "loan",
  "loans",
  "locker",
  "locus",
  "lol",
  "london",
  "lotte",
  "lotto",
  "love",
  "lpl",
  "lplfinancial",
  "ltd",
  "ltda",
  "lundbeck",
  "luxe",
  "luxury",
  "madrid",
  "maif",
  "maison",
  "makeup",
  "man",
  "management",
  "mango",
  "map",
  "market",
  "marketing",
  "markets",
  "marriott",
  "marshalls",
  "mattel",
  "mba",
  "mckinsey",
  "med",
  "media",
  "meet",
  "melbourne",
  "meme",
  "memorial",
  "men",
  "menu",
  "merck",
  "merckmsd",
  "miami",
  "microsoft",
  "mini",
  "mint",
  "mit",
  "mitsubishi",
  "mlb",
  "mls",
  "mma",
  "mobile",
  "moda",
  "moe",
  "moi",
  "mom",
  "monash",
  "money",
  "monster",
  "mormon",
  "mortgage",
  "moscow",
  "moto",
  "motorcycles",
  "mov",
  "movie",
  "msd",
  "mtn",
  "mtr",
  "music",
  "nab",
  "nagoya",
  "navy",
  "nba",
  "nec",
  "netbank",
  "netflix",
  "network",
  "neustar",
  "new",
  "news",
  "next",
  "nextdirect",
  "nexus",
  "nfl",
  "ngo",
  "nhk",
  "nico",
  "nike",
  "nikon",
  "ninja",
  "nissan",
  "nissay",
  "nokia",
  "norton",
  "now",
  "nowruz",
  "nowtv",
  "nra",
  "nrw",
  "ntt",
  "nyc",
  "obi",
  "observer",
  "office",
  "okinawa",
  "olayan",
  "olayangroup",
  "ollo",
  "omega",
  "one",
  "ong",
  "onl",
  "online",
  "ooo",
  "open",
  "oracle",
  "orange",
  "organic",
  "origins",
  "osaka",
  "otsuka",
  "ott",
  "ovh",
  "page",
  "panasonic",
  "paris",
  "pars",
  "partners",
  "parts",
  "party",
  "pay",
  "pccw",
  "pet",
  "pfizer",
  "pharmacy",
  "phd",
  "philips",
  "phone",
  "photo",
  "photography",
  "photos",
  "physio",
  "pics",
  "pictet",
  "pictures",
  "pid",
  "pin",
  "ping",
  "pink",
  "pioneer",
  "pizza",
  "place",
  "play",
  "playstation",
  "plumbing",
  "plus",
  "pnc",
  "pohl",
  "poker",
  "politie",
  "porn",
  "pramerica",
  "praxi",
  "press",
  "prime",
  "prod",
  "productions",
  "prof",
  "progressive",
  "promo",
  "properties",
  "property",
  "protection",
  "pru",
  "prudential",
  "pub",
  "pwc",
  "qpon",
  "quebec",
  "quest",
  "racing",
  "radio",
  "read",
  "realestate",
  "realtor",
  "realty",
  "recipes",
  "red",
  "redstone",
  "redumbrella",
  "rehab",
  "reise",
  "reisen",
  "reit",
  "reliance",
  "ren",
  "rent",
  "rentals",
  "repair",
  "report",
  "republican",
  "rest",
  "restaurant",
  "review",
  "reviews",
  "rexroth",
  "rich",
  "richardli",
  "ricoh",
  "ril",
  "rio",
  "rip",
  "rocks",
  "rodeo",
  "rogers",
  "room",
  "rsvp",
  "rugby",
  "ruhr",
  "run",
  "rwe",
  "ryukyu",
  "saarland",
  "safe",
  "safety",
  "sakura",
  "sale",
  "salon",
  "samsclub",
  "samsung",
  "sandvik",
  "sandvikcoromant",
  "sanofi",
  "sap",
  "sarl",
  "sas",
  "save",
  "saxo",
  "sbi",
  "sbs",
  "scb",
  "schaeffler",
  "schmidt",
  "scholarships",
  "school",
  "schule",
  "schwarz",
  "science",
  "scot",
  "search",
  "seat",
  "secure",
  "security",
  "seek",
  "select",
  "sener",
  "services",
  "seven",
  "sew",
  "sex",
  "sexy",
  "sfr",
  "shangrila",
  "sharp",
  "shell",
  "shia",
  "shiksha",
  "shoes",
  "shop",
  "shopping",
  "shouji",
  "show",
  "silk",
  "sina",
  "singles",
  "site",
  "ski",
  "skin",
  "sky",
  "skype",
  "sling",
  "smart",
  "smile",
  "sncf",
  "soccer",
  "social",
  "softbank",
  "software",
  "sohu",
  "solar",
  "solutions",
  "song",
  "sony",
  "soy",
  "spa",
  "space",
  "sport",
  "spot",
  "srl",
  "stada",
  "staples",
  "star",
  "statebank",
  "statefarm",
  "stc",
  "stcgroup",
  "stockholm",
  "storage",
  "store",
  "stream",
  "studio",
  "study",
  "style",
  "sucks",
  "supplies",
  "supply",
  "support",
  "surf",
  "surgery",
  "suzuki",
  "swatch",
  "swiss",
  "sydney",
  "systems",
  "tab",
  "taipei",
  "talk",
  "taobao",
  "target",
  "tatamotors",
  "tatar",
  "tattoo",
  "tax",
  "taxi",
  "tci",
  "tdk",
  "team",
  "tech",
  "technology",
  "temasek",
  "tennis",
  "teva",
  "thd",
  "theater",
  "theatre",
  "tiaa",
  "tickets",
  "tienda",
  "tips",
  "tires",
  "tirol",
  "tjmaxx",
  "tjx",
  "tkmaxx",
  "tmall",
  "today",
  "tokyo",
  "tools",
  "top",
  "toray",
  "toshiba",
  "total",
  "tours",
  "town",
  "toyota",
  "toys",
  "trade",
  "trading",
  "training",
  "travel",
  "travelers",
  "travelersinsurance",
  "trust",
  "trv",
  "tube",
  "tui",
  "tunes",
  "tushu",
  "tvs",
  "ubank",
  "ubs",
  "unicom",
  "university",
  "uno",
  "uol",
  "ups",
  "vacations",
  "vana",
  "vanguard",
  "vegas",
  "ventures",
  "verisign",
  "versicherung",
  "vet",
  "viajes",
  "video",
  "vig",
  "viking",
  "villas",
  "vin",
  "vip",
  "virgin",
  "visa",
  "vision",
  "viva",
  "vivo",
  "vlaanderen",
  "vodka",
  "volvo",
  "vote",
  "voting",
  "voto",
  "voyage",
  "wales",
  "walmart",
  "walter",
  "wang",
  "wanggou",
  "watch",
  "watches",
  "weather",
  "weatherchannel",
  "webcam",
  "weber",
  "website",
  "wed",
  "wedding",
  "weibo",
  "weir",
  "whoswho",
  "wien",
  "wiki",
  "williamhill",
  "win",
  "windows",
  "wine",
  "winners",
  "wme",
  "wolterskluwer",
  "woodside",
  "work",
  "works",
  "world",
  "wow",
  "wtc",
  "wtf",
  "xbox",
  "xerox",
  "xihuan",
  "xin",
  "\u0915\u0949\u092E",
  "\u30BB\u30FC\u30EB",
  "\u4F5B\u5C71",
  "\u6148\u5584",
  "\u96C6\u56E2",
  "\u5728\u7EBF",
  "\u70B9\u770B",
  "\u0E04\u0E2D\u0E21",
  "\u516B\u5366",
  "\u0645\u0648\u0642\u0639",
  "\u516C\u76CA",
  "\u516C\u53F8",
  "\u9999\u683C\u91CC\u62C9",
  "\u7F51\u7AD9",
  "\u79FB\u52A8",
  "\u6211\u7231\u4F60",
  "\u043C\u043E\u0441\u043A\u0432\u0430",
  "\u043A\u0430\u0442\u043E\u043B\u0438\u043A",
  "\u043E\u043D\u043B\u0430\u0439\u043D",
  "\u0441\u0430\u0439\u0442",
  "\u8054\u901A",
  "\u05E7\u05D5\u05DD",
  "\u65F6\u5C1A",
  "\u5FAE\u535A",
  "\u6DE1\u9A6C\u9521",
  "\u30D5\u30A1\u30C3\u30B7\u30E7\u30F3",
  "\u043E\u0440\u0433",
  "\u0928\u0947\u091F",
  "\u30B9\u30C8\u30A2",
  "\u30A2\u30DE\u30BE\u30F3",
  "\uC0BC\uC131",
  "\u5546\u6807",
  "\u5546\u5E97",
  "\u5546\u57CE",
  "\u0434\u0435\u0442\u0438",
  "\u30DD\u30A4\u30F3\u30C8",
  "\u65B0\u95FB",
  "\u5BB6\u96FB",
  "\u0643\u0648\u0645",
  "\u4E2D\u6587\u7F51",
  "\u4E2D\u4FE1",
  "\u5A31\u4E50",
  "\u8C37\u6B4C",
  "\u96FB\u8A0A\u76C8\u79D1",
  "\u8D2D\u7269",
  "\u30AF\u30E9\u30A6\u30C9",
  "\u901A\u8CA9",
  "\u7F51\u5E97",
  "\u0938\u0902\u0917\u0920\u0928",
  "\u9910\u5385",
  "\u7F51\u7EDC",
  "\u043A\u043E\u043C",
  "\u4E9A\u9A6C\u900A",
  "\u98DF\u54C1",
  "\u98DE\u5229\u6D66",
  "\u624B\u673A",
  "\u0627\u0631\u0627\u0645\u0643\u0648",
  "\u0627\u0644\u0639\u0644\u064A\u0627\u0646",
  "\u0628\u0627\u0632\u0627\u0631",
  "\u0627\u0628\u0648\u0638\u0628\u064A",
  "\u0643\u0627\u062B\u0648\u0644\u064A\u0643",
  "\u0647\u0645\u0631\u0627\u0647",
  "\uB2F7\uCEF4",
  "\u653F\u5E9C",
  "\u0634\u0628\u0643\u0629",
  "\u0628\u064A\u062A\u0643",
  "\u0639\u0631\u0628",
  "\u673A\u6784",
  "\u7EC4\u7EC7\u673A\u6784",
  "\u5065\u5EB7",
  "\u62DB\u8058",
  "\u0440\u0443\u0441",
  "\u5927\u62FF",
  "\u307F\u3093\u306A",
  "\u30B0\u30FC\u30B0\u30EB",
  "\u4E16\u754C",
  "\u66F8\u7C4D",
  "\u7F51\u5740",
  "\uB2F7\uB137",
  "\u30B3\u30E0",
  "\u5929\u4E3B\u6559",
  "\u6E38\u620F",
  "verm\xF6gensberater",
  "verm\xF6gensberatung",
  "\u4F01\u4E1A",
  "\u4FE1\u606F",
  "\u5609\u91CC\u5927\u9152\u5E97",
  "\u5609\u91CC",
  "\u5E7F\u4E1C",
  "\u653F\u52A1",
  "xyz",
  "yachts",
  "yahoo",
  "yamaxun",
  "yandex",
  "yodobashi",
  "yoga",
  "yokohama",
  "you",
  "youtube",
  "yun",
  "zappos",
  "zara",
  "zero",
  "zip",
  "zone",
  "zuerich",
  "co.krd",
  "edu.krd",
  "art.pl",
  "gliwice.pl",
  "krakow.pl",
  "poznan.pl",
  "wroc.pl",
  "zakopane.pl",
  "lib.de.us",
  "12chars.dev",
  "12chars.it",
  "12chars.pro",
  "cc.ua",
  "inf.ua",
  "ltd.ua",
  "611.to",
  "a2hosted.com",
  "cpserver.com",
  "aaa.vodka",
  "*.on-acorn.io",
  "activetrail.biz",
  "adaptable.app",
  "adobeaemcloud.com",
  "*.dev.adobeaemcloud.com",
  "aem.live",
  "hlx.live",
  "adobeaemcloud.net",
  "aem.page",
  "hlx.page",
  "hlx3.page",
  "adobeio-static.net",
  "adobeioruntime.net",
  "africa.com",
  "beep.pl",
  "airkitapps.com",
  "airkitapps-au.com",
  "airkitapps.eu",
  "aivencloud.com",
  "akadns.net",
  "akamai.net",
  "akamai-staging.net",
  "akamaiedge.net",
  "akamaiedge-staging.net",
  "akamaihd.net",
  "akamaihd-staging.net",
  "akamaiorigin.net",
  "akamaiorigin-staging.net",
  "akamaized.net",
  "akamaized-staging.net",
  "edgekey.net",
  "edgekey-staging.net",
  "edgesuite.net",
  "edgesuite-staging.net",
  "barsy.ca",
  "*.compute.estate",
  "*.alces.network",
  "kasserver.com",
  "altervista.org",
  "alwaysdata.net",
  "myamaze.net",
  "execute-api.cn-north-1.amazonaws.com.cn",
  "execute-api.cn-northwest-1.amazonaws.com.cn",
  "execute-api.af-south-1.amazonaws.com",
  "execute-api.ap-east-1.amazonaws.com",
  "execute-api.ap-northeast-1.amazonaws.com",
  "execute-api.ap-northeast-2.amazonaws.com",
  "execute-api.ap-northeast-3.amazonaws.com",
  "execute-api.ap-south-1.amazonaws.com",
  "execute-api.ap-south-2.amazonaws.com",
  "execute-api.ap-southeast-1.amazonaws.com",
  "execute-api.ap-southeast-2.amazonaws.com",
  "execute-api.ap-southeast-3.amazonaws.com",
  "execute-api.ap-southeast-4.amazonaws.com",
  "execute-api.ap-southeast-5.amazonaws.com",
  "execute-api.ca-central-1.amazonaws.com",
  "execute-api.ca-west-1.amazonaws.com",
  "execute-api.eu-central-1.amazonaws.com",
  "execute-api.eu-central-2.amazonaws.com",
  "execute-api.eu-north-1.amazonaws.com",
  "execute-api.eu-south-1.amazonaws.com",
  "execute-api.eu-south-2.amazonaws.com",
  "execute-api.eu-west-1.amazonaws.com",
  "execute-api.eu-west-2.amazonaws.com",
  "execute-api.eu-west-3.amazonaws.com",
  "execute-api.il-central-1.amazonaws.com",
  "execute-api.me-central-1.amazonaws.com",
  "execute-api.me-south-1.amazonaws.com",
  "execute-api.sa-east-1.amazonaws.com",
  "execute-api.us-east-1.amazonaws.com",
  "execute-api.us-east-2.amazonaws.com",
  "execute-api.us-gov-east-1.amazonaws.com",
  "execute-api.us-gov-west-1.amazonaws.com",
  "execute-api.us-west-1.amazonaws.com",
  "execute-api.us-west-2.amazonaws.com",
  "cloudfront.net",
  "auth.af-south-1.amazoncognito.com",
  "auth.ap-east-1.amazoncognito.com",
  "auth.ap-northeast-1.amazoncognito.com",
  "auth.ap-northeast-2.amazoncognito.com",
  "auth.ap-northeast-3.amazoncognito.com",
  "auth.ap-south-1.amazoncognito.com",
  "auth.ap-south-2.amazoncognito.com",
  "auth.ap-southeast-1.amazoncognito.com",
  "auth.ap-southeast-2.amazoncognito.com",
  "auth.ap-southeast-3.amazoncognito.com",
  "auth.ap-southeast-4.amazoncognito.com",
  "auth.ca-central-1.amazoncognito.com",
  "auth.ca-west-1.amazoncognito.com",
  "auth.eu-central-1.amazoncognito.com",
  "auth.eu-central-2.amazoncognito.com",
  "auth.eu-north-1.amazoncognito.com",
  "auth.eu-south-1.amazoncognito.com",
  "auth.eu-south-2.amazoncognito.com",
  "auth.eu-west-1.amazoncognito.com",
  "auth.eu-west-2.amazoncognito.com",
  "auth.eu-west-3.amazoncognito.com",
  "auth.il-central-1.amazoncognito.com",
  "auth.me-central-1.amazoncognito.com",
  "auth.me-south-1.amazoncognito.com",
  "auth.sa-east-1.amazoncognito.com",
  "auth.us-east-1.amazoncognito.com",
  "auth-fips.us-east-1.amazoncognito.com",
  "auth.us-east-2.amazoncognito.com",
  "auth-fips.us-east-2.amazoncognito.com",
  "auth-fips.us-gov-west-1.amazoncognito.com",
  "auth.us-west-1.amazoncognito.com",
  "auth-fips.us-west-1.amazoncognito.com",
  "auth.us-west-2.amazoncognito.com",
  "auth-fips.us-west-2.amazoncognito.com",
  "*.compute.amazonaws.com.cn",
  "*.compute.amazonaws.com",
  "*.compute-1.amazonaws.com",
  "us-east-1.amazonaws.com",
  "emrappui-prod.cn-north-1.amazonaws.com.cn",
  "emrnotebooks-prod.cn-north-1.amazonaws.com.cn",
  "emrstudio-prod.cn-north-1.amazonaws.com.cn",
  "emrappui-prod.cn-northwest-1.amazonaws.com.cn",
  "emrnotebooks-prod.cn-northwest-1.amazonaws.com.cn",
  "emrstudio-prod.cn-northwest-1.amazonaws.com.cn",
  "emrappui-prod.af-south-1.amazonaws.com",
  "emrnotebooks-prod.af-south-1.amazonaws.com",
  "emrstudio-prod.af-south-1.amazonaws.com",
  "emrappui-prod.ap-east-1.amazonaws.com",
  "emrnotebooks-prod.ap-east-1.amazonaws.com",
  "emrstudio-prod.ap-east-1.amazonaws.com",
  "emrappui-prod.ap-northeast-1.amazonaws.com",
  "emrnotebooks-prod.ap-northeast-1.amazonaws.com",
  "emrstudio-prod.ap-northeast-1.amazonaws.com",
  "emrappui-prod.ap-northeast-2.amazonaws.com",
  "emrnotebooks-prod.ap-northeast-2.amazonaws.com",
  "emrstudio-prod.ap-northeast-2.amazonaws.com",
  "emrappui-prod.ap-northeast-3.amazonaws.com",
  "emrnotebooks-prod.ap-northeast-3.amazonaws.com",
  "emrstudio-prod.ap-northeast-3.amazonaws.com",
  "emrappui-prod.ap-south-1.amazonaws.com",
  "emrnotebooks-prod.ap-south-1.amazonaws.com",
  "emrstudio-prod.ap-south-1.amazonaws.com",
  "emrappui-prod.ap-south-2.amazonaws.com",
  "emrnotebooks-prod.ap-south-2.amazonaws.com",
  "emrstudio-prod.ap-south-2.amazonaws.com",
  "emrappui-prod.ap-southeast-1.amazonaws.com",
  "emrnotebooks-prod.ap-southeast-1.amazonaws.com",
  "emrstudio-prod.ap-southeast-1.amazonaws.com",
  "emrappui-prod.ap-southeast-2.amazonaws.com",
  "emrnotebooks-prod.ap-southeast-2.amazonaws.com",
  "emrstudio-prod.ap-southeast-2.amazonaws.com",
  "emrappui-prod.ap-southeast-3.amazonaws.com",
  "emrnotebooks-prod.ap-southeast-3.amazonaws.com",
  "emrstudio-prod.ap-southeast-3.amazonaws.com",
  "emrappui-prod.ap-southeast-4.amazonaws.com",
  "emrnotebooks-prod.ap-southeast-4.amazonaws.com",
  "emrstudio-prod.ap-southeast-4.amazonaws.com",
  "emrappui-prod.ca-central-1.amazonaws.com",
  "emrnotebooks-prod.ca-central-1.amazonaws.com",
  "emrstudio-prod.ca-central-1.amazonaws.com",
  "emrappui-prod.ca-west-1.amazonaws.com",
  "emrnotebooks-prod.ca-west-1.amazonaws.com",
  "emrstudio-prod.ca-west-1.amazonaws.com",
  "emrappui-prod.eu-central-1.amazonaws.com",
  "emrnotebooks-prod.eu-central-1.amazonaws.com",
  "emrstudio-prod.eu-central-1.amazonaws.com",
  "emrappui-prod.eu-central-2.amazonaws.com",
  "emrnotebooks-prod.eu-central-2.amazonaws.com",
  "emrstudio-prod.eu-central-2.amazonaws.com",
  "emrappui-prod.eu-north-1.amazonaws.com",
  "emrnotebooks-prod.eu-north-1.amazonaws.com",
  "emrstudio-prod.eu-north-1.amazonaws.com",
  "emrappui-prod.eu-south-1.amazonaws.com",
  "emrnotebooks-prod.eu-south-1.amazonaws.com",
  "emrstudio-prod.eu-south-1.amazonaws.com",
  "emrappui-prod.eu-south-2.amazonaws.com",
  "emrnotebooks-prod.eu-south-2.amazonaws.com",
  "emrstudio-prod.eu-south-2.amazonaws.com",
  "emrappui-prod.eu-west-1.amazonaws.com",
  "emrnotebooks-prod.eu-west-1.amazonaws.com",
  "emrstudio-prod.eu-west-1.amazonaws.com",
  "emrappui-prod.eu-west-2.amazonaws.com",
  "emrnotebooks-prod.eu-west-2.amazonaws.com",
  "emrstudio-prod.eu-west-2.amazonaws.com",
  "emrappui-prod.eu-west-3.amazonaws.com",
  "emrnotebooks-prod.eu-west-3.amazonaws.com",
  "emrstudio-prod.eu-west-3.amazonaws.com",
  "emrappui-prod.il-central-1.amazonaws.com",
  "emrnotebooks-prod.il-central-1.amazonaws.com",
  "emrstudio-prod.il-central-1.amazonaws.com",
  "emrappui-prod.me-central-1.amazonaws.com",
  "emrnotebooks-prod.me-central-1.amazonaws.com",
  "emrstudio-prod.me-central-1.amazonaws.com",
  "emrappui-prod.me-south-1.amazonaws.com",
  "emrnotebooks-prod.me-south-1.amazonaws.com",
  "emrstudio-prod.me-south-1.amazonaws.com",
  "emrappui-prod.sa-east-1.amazonaws.com",
  "emrnotebooks-prod.sa-east-1.amazonaws.com",
  "emrstudio-prod.sa-east-1.amazonaws.com",
  "emrappui-prod.us-east-1.amazonaws.com",
  "emrnotebooks-prod.us-east-1.amazonaws.com",
  "emrstudio-prod.us-east-1.amazonaws.com",
  "emrappui-prod.us-east-2.amazonaws.com",
  "emrnotebooks-prod.us-east-2.amazonaws.com",
  "emrstudio-prod.us-east-2.amazonaws.com",
  "emrappui-prod.us-gov-east-1.amazonaws.com",
  "emrnotebooks-prod.us-gov-east-1.amazonaws.com",
  "emrstudio-prod.us-gov-east-1.amazonaws.com",
  "emrappui-prod.us-gov-west-1.amazonaws.com",
  "emrnotebooks-prod.us-gov-west-1.amazonaws.com",
  "emrstudio-prod.us-gov-west-1.amazonaws.com",
  "emrappui-prod.us-west-1.amazonaws.com",
  "emrnotebooks-prod.us-west-1.amazonaws.com",
  "emrstudio-prod.us-west-1.amazonaws.com",
  "emrappui-prod.us-west-2.amazonaws.com",
  "emrnotebooks-prod.us-west-2.amazonaws.com",
  "emrstudio-prod.us-west-2.amazonaws.com",
  "*.cn-north-1.airflow.amazonaws.com.cn",
  "*.cn-northwest-1.airflow.amazonaws.com.cn",
  "*.af-south-1.airflow.amazonaws.com",
  "*.ap-east-1.airflow.amazonaws.com",
  "*.ap-northeast-1.airflow.amazonaws.com",
  "*.ap-northeast-2.airflow.amazonaws.com",
  "*.ap-northeast-3.airflow.amazonaws.com",
  "*.ap-south-1.airflow.amazonaws.com",
  "*.ap-south-2.airflow.amazonaws.com",
  "*.ap-southeast-1.airflow.amazonaws.com",
  "*.ap-southeast-2.airflow.amazonaws.com",
  "*.ap-southeast-3.airflow.amazonaws.com",
  "*.ap-southeast-4.airflow.amazonaws.com",
  "*.ca-central-1.airflow.amazonaws.com",
  "*.ca-west-1.airflow.amazonaws.com",
  "*.eu-central-1.airflow.amazonaws.com",
  "*.eu-central-2.airflow.amazonaws.com",
  "*.eu-north-1.airflow.amazonaws.com",
  "*.eu-south-1.airflow.amazonaws.com",
  "*.eu-south-2.airflow.amazonaws.com",
  "*.eu-west-1.airflow.amazonaws.com",
  "*.eu-west-2.airflow.amazonaws.com",
  "*.eu-west-3.airflow.amazonaws.com",
  "*.il-central-1.airflow.amazonaws.com",
  "*.me-central-1.airflow.amazonaws.com",
  "*.me-south-1.airflow.amazonaws.com",
  "*.sa-east-1.airflow.amazonaws.com",
  "*.us-east-1.airflow.amazonaws.com",
  "*.us-east-2.airflow.amazonaws.com",
  "*.us-west-1.airflow.amazonaws.com",
  "*.us-west-2.airflow.amazonaws.com",
  "s3.dualstack.cn-north-1.amazonaws.com.cn",
  "s3-accesspoint.dualstack.cn-north-1.amazonaws.com.cn",
  "s3-website.dualstack.cn-north-1.amazonaws.com.cn",
  "s3.cn-north-1.amazonaws.com.cn",
  "s3-accesspoint.cn-north-1.amazonaws.com.cn",
  "s3-deprecated.cn-north-1.amazonaws.com.cn",
  "s3-object-lambda.cn-north-1.amazonaws.com.cn",
  "s3-website.cn-north-1.amazonaws.com.cn",
  "s3.dualstack.cn-northwest-1.amazonaws.com.cn",
  "s3-accesspoint.dualstack.cn-northwest-1.amazonaws.com.cn",
  "s3.cn-northwest-1.amazonaws.com.cn",
  "s3-accesspoint.cn-northwest-1.amazonaws.com.cn",
  "s3-object-lambda.cn-northwest-1.amazonaws.com.cn",
  "s3-website.cn-northwest-1.amazonaws.com.cn",
  "s3.dualstack.af-south-1.amazonaws.com",
  "s3-accesspoint.dualstack.af-south-1.amazonaws.com",
  "s3-website.dualstack.af-south-1.amazonaws.com",
  "s3.af-south-1.amazonaws.com",
  "s3-accesspoint.af-south-1.amazonaws.com",
  "s3-object-lambda.af-south-1.amazonaws.com",
  "s3-website.af-south-1.amazonaws.com",
  "s3.dualstack.ap-east-1.amazonaws.com",
  "s3-accesspoint.dualstack.ap-east-1.amazonaws.com",
  "s3.ap-east-1.amazonaws.com",
  "s3-accesspoint.ap-east-1.amazonaws.com",
  "s3-object-lambda.ap-east-1.amazonaws.com",
  "s3-website.ap-east-1.amazonaws.com",
  "s3.dualstack.ap-northeast-1.amazonaws.com",
  "s3-accesspoint.dualstack.ap-northeast-1.amazonaws.com",
  "s3-website.dualstack.ap-northeast-1.amazonaws.com",
  "s3.ap-northeast-1.amazonaws.com",
  "s3-accesspoint.ap-northeast-1.amazonaws.com",
  "s3-object-lambda.ap-northeast-1.amazonaws.com",
  "s3-website.ap-northeast-1.amazonaws.com",
  "s3.dualstack.ap-northeast-2.amazonaws.com",
  "s3-accesspoint.dualstack.ap-northeast-2.amazonaws.com",
  "s3-website.dualstack.ap-northeast-2.amazonaws.com",
  "s3.ap-northeast-2.amazonaws.com",
  "s3-accesspoint.ap-northeast-2.amazonaws.com",
  "s3-object-lambda.ap-northeast-2.amazonaws.com",
  "s3-website.ap-northeast-2.amazonaws.com",
  "s3.dualstack.ap-northeast-3.amazonaws.com",
  "s3-accesspoint.dualstack.ap-northeast-3.amazonaws.com",
  "s3-website.dualstack.ap-northeast-3.amazonaws.com",
  "s3.ap-northeast-3.amazonaws.com",
  "s3-accesspoint.ap-northeast-3.amazonaws.com",
  "s3-object-lambda.ap-northeast-3.amazonaws.com",
  "s3-website.ap-northeast-3.amazonaws.com",
  "s3.dualstack.ap-south-1.amazonaws.com",
  "s3-accesspoint.dualstack.ap-south-1.amazonaws.com",
  "s3-website.dualstack.ap-south-1.amazonaws.com",
  "s3.ap-south-1.amazonaws.com",
  "s3-accesspoint.ap-south-1.amazonaws.com",
  "s3-object-lambda.ap-south-1.amazonaws.com",
  "s3-website.ap-south-1.amazonaws.com",
  "s3.dualstack.ap-south-2.amazonaws.com",
  "s3-accesspoint.dualstack.ap-south-2.amazonaws.com",
  "s3-website.dualstack.ap-south-2.amazonaws.com",
  "s3.ap-south-2.amazonaws.com",
  "s3-accesspoint.ap-south-2.amazonaws.com",
  "s3-object-lambda.ap-south-2.amazonaws.com",
  "s3-website.ap-south-2.amazonaws.com",
  "s3.dualstack.ap-southeast-1.amazonaws.com",
  "s3-accesspoint.dualstack.ap-southeast-1.amazonaws.com",
  "s3-website.dualstack.ap-southeast-1.amazonaws.com",
  "s3.ap-southeast-1.amazonaws.com",
  "s3-accesspoint.ap-southeast-1.amazonaws.com",
  "s3-object-lambda.ap-southeast-1.amazonaws.com",
  "s3-website.ap-southeast-1.amazonaws.com",
  "s3.dualstack.ap-southeast-2.amazonaws.com",
  "s3-accesspoint.dualstack.ap-southeast-2.amazonaws.com",
  "s3-website.dualstack.ap-southeast-2.amazonaws.com",
  "s3.ap-southeast-2.amazonaws.com",
  "s3-accesspoint.ap-southeast-2.amazonaws.com",
  "s3-object-lambda.ap-southeast-2.amazonaws.com",
  "s3-website.ap-southeast-2.amazonaws.com",
  "s3.dualstack.ap-southeast-3.amazonaws.com",
  "s3-accesspoint.dualstack.ap-southeast-3.amazonaws.com",
  "s3-website.dualstack.ap-southeast-3.amazonaws.com",
  "s3.ap-southeast-3.amazonaws.com",
  "s3-accesspoint.ap-southeast-3.amazonaws.com",
  "s3-object-lambda.ap-southeast-3.amazonaws.com",
  "s3-website.ap-southeast-3.amazonaws.com",
  "s3.dualstack.ap-southeast-4.amazonaws.com",
  "s3-accesspoint.dualstack.ap-southeast-4.amazonaws.com",
  "s3-website.dualstack.ap-southeast-4.amazonaws.com",
  "s3.ap-southeast-4.amazonaws.com",
  "s3-accesspoint.ap-southeast-4.amazonaws.com",
  "s3-object-lambda.ap-southeast-4.amazonaws.com",
  "s3-website.ap-southeast-4.amazonaws.com",
  "s3.dualstack.ap-southeast-5.amazonaws.com",
  "s3-accesspoint.dualstack.ap-southeast-5.amazonaws.com",
  "s3-website.dualstack.ap-southeast-5.amazonaws.com",
  "s3.ap-southeast-5.amazonaws.com",
  "s3-accesspoint.ap-southeast-5.amazonaws.com",
  "s3-deprecated.ap-southeast-5.amazonaws.com",
  "s3-object-lambda.ap-southeast-5.amazonaws.com",
  "s3-website.ap-southeast-5.amazonaws.com",
  "s3.dualstack.ca-central-1.amazonaws.com",
  "s3-accesspoint.dualstack.ca-central-1.amazonaws.com",
  "s3-accesspoint-fips.dualstack.ca-central-1.amazonaws.com",
  "s3-fips.dualstack.ca-central-1.amazonaws.com",
  "s3-website.dualstack.ca-central-1.amazonaws.com",
  "s3.ca-central-1.amazonaws.com",
  "s3-accesspoint.ca-central-1.amazonaws.com",
  "s3-accesspoint-fips.ca-central-1.amazonaws.com",
  "s3-fips.ca-central-1.amazonaws.com",
  "s3-object-lambda.ca-central-1.amazonaws.com",
  "s3-website.ca-central-1.amazonaws.com",
  "s3.dualstack.ca-west-1.amazonaws.com",
  "s3-accesspoint.dualstack.ca-west-1.amazonaws.com",
  "s3-accesspoint-fips.dualstack.ca-west-1.amazonaws.com",
  "s3-fips.dualstack.ca-west-1.amazonaws.com",
  "s3-website.dualstack.ca-west-1.amazonaws.com",
  "s3.ca-west-1.amazonaws.com",
  "s3-accesspoint.ca-west-1.amazonaws.com",
  "s3-accesspoint-fips.ca-west-1.amazonaws.com",
  "s3-fips.ca-west-1.amazonaws.com",
  "s3-object-lambda.ca-west-1.amazonaws.com",
  "s3-website.ca-west-1.amazonaws.com",
  "s3.dualstack.eu-central-1.amazonaws.com",
  "s3-accesspoint.dualstack.eu-central-1.amazonaws.com",
  "s3-website.dualstack.eu-central-1.amazonaws.com",
  "s3.eu-central-1.amazonaws.com",
  "s3-accesspoint.eu-central-1.amazonaws.com",
  "s3-object-lambda.eu-central-1.amazonaws.com",
  "s3-website.eu-central-1.amazonaws.com",
  "s3.dualstack.eu-central-2.amazonaws.com",
  "s3-accesspoint.dualstack.eu-central-2.amazonaws.com",
  "s3-website.dualstack.eu-central-2.amazonaws.com",
  "s3.eu-central-2.amazonaws.com",
  "s3-accesspoint.eu-central-2.amazonaws.com",
  "s3-object-lambda.eu-central-2.amazonaws.com",
  "s3-website.eu-central-2.amazonaws.com",
  "s3.dualstack.eu-north-1.amazonaws.com",
  "s3-accesspoint.dualstack.eu-north-1.amazonaws.com",
  "s3.eu-north-1.amazonaws.com",
  "s3-accesspoint.eu-north-1.amazonaws.com",
  "s3-object-lambda.eu-north-1.amazonaws.com",
  "s3-website.eu-north-1.amazonaws.com",
  "s3.dualstack.eu-south-1.amazonaws.com",
  "s3-accesspoint.dualstack.eu-south-1.amazonaws.com",
  "s3-website.dualstack.eu-south-1.amazonaws.com",
  "s3.eu-south-1.amazonaws.com",
  "s3-accesspoint.eu-south-1.amazonaws.com",
  "s3-object-lambda.eu-south-1.amazonaws.com",
  "s3-website.eu-south-1.amazonaws.com",
  "s3.dualstack.eu-south-2.amazonaws.com",
  "s3-accesspoint.dualstack.eu-south-2.amazonaws.com",
  "s3-website.dualstack.eu-south-2.amazonaws.com",
  "s3.eu-south-2.amazonaws.com",
  "s3-accesspoint.eu-south-2.amazonaws.com",
  "s3-object-lambda.eu-south-2.amazonaws.com",
  "s3-website.eu-south-2.amazonaws.com",
  "s3.dualstack.eu-west-1.amazonaws.com",
  "s3-accesspoint.dualstack.eu-west-1.amazonaws.com",
  "s3-website.dualstack.eu-west-1.amazonaws.com",
  "s3.eu-west-1.amazonaws.com",
  "s3-accesspoint.eu-west-1.amazonaws.com",
  "s3-deprecated.eu-west-1.amazonaws.com",
  "s3-object-lambda.eu-west-1.amazonaws.com",
  "s3-website.eu-west-1.amazonaws.com",
  "s3.dualstack.eu-west-2.amazonaws.com",
  "s3-accesspoint.dualstack.eu-west-2.amazonaws.com",
  "s3.eu-west-2.amazonaws.com",
  "s3-accesspoint.eu-west-2.amazonaws.com",
  "s3-object-lambda.eu-west-2.amazonaws.com",
  "s3-website.eu-west-2.amazonaws.com",
  "s3.dualstack.eu-west-3.amazonaws.com",
  "s3-accesspoint.dualstack.eu-west-3.amazonaws.com",
  "s3-website.dualstack.eu-west-3.amazonaws.com",
  "s3.eu-west-3.amazonaws.com",
  "s3-accesspoint.eu-west-3.amazonaws.com",
  "s3-object-lambda.eu-west-3.amazonaws.com",
  "s3-website.eu-west-3.amazonaws.com",
  "s3.dualstack.il-central-1.amazonaws.com",
  "s3-accesspoint.dualstack.il-central-1.amazonaws.com",
  "s3-website.dualstack.il-central-1.amazonaws.com",
  "s3.il-central-1.amazonaws.com",
  "s3-accesspoint.il-central-1.amazonaws.com",
  "s3-object-lambda.il-central-1.amazonaws.com",
  "s3-website.il-central-1.amazonaws.com",
  "s3.dualstack.me-central-1.amazonaws.com",
  "s3-accesspoint.dualstack.me-central-1.amazonaws.com",
  "s3-website.dualstack.me-central-1.amazonaws.com",
  "s3.me-central-1.amazonaws.com",
  "s3-accesspoint.me-central-1.amazonaws.com",
  "s3-object-lambda.me-central-1.amazonaws.com",
  "s3-website.me-central-1.amazonaws.com",
  "s3.dualstack.me-south-1.amazonaws.com",
  "s3-accesspoint.dualstack.me-south-1.amazonaws.com",
  "s3.me-south-1.amazonaws.com",
  "s3-accesspoint.me-south-1.amazonaws.com",
  "s3-object-lambda.me-south-1.amazonaws.com",
  "s3-website.me-south-1.amazonaws.com",
  "s3.amazonaws.com",
  "s3-1.amazonaws.com",
  "s3-ap-east-1.amazonaws.com",
  "s3-ap-northeast-1.amazonaws.com",
  "s3-ap-northeast-2.amazonaws.com",
  "s3-ap-northeast-3.amazonaws.com",
  "s3-ap-south-1.amazonaws.com",
  "s3-ap-southeast-1.amazonaws.com",
  "s3-ap-southeast-2.amazonaws.com",
  "s3-ca-central-1.amazonaws.com",
  "s3-eu-central-1.amazonaws.com",
  "s3-eu-north-1.amazonaws.com",
  "s3-eu-west-1.amazonaws.com",
  "s3-eu-west-2.amazonaws.com",
  "s3-eu-west-3.amazonaws.com",
  "s3-external-1.amazonaws.com",
  "s3-fips-us-gov-east-1.amazonaws.com",
  "s3-fips-us-gov-west-1.amazonaws.com",
  "mrap.accesspoint.s3-global.amazonaws.com",
  "s3-me-south-1.amazonaws.com",
  "s3-sa-east-1.amazonaws.com",
  "s3-us-east-2.amazonaws.com",
  "s3-us-gov-east-1.amazonaws.com",
  "s3-us-gov-west-1.amazonaws.com",
  "s3-us-west-1.amazonaws.com",
  "s3-us-west-2.amazonaws.com",
  "s3-website-ap-northeast-1.amazonaws.com",
  "s3-website-ap-southeast-1.amazonaws.com",
  "s3-website-ap-southeast-2.amazonaws.com",
  "s3-website-eu-west-1.amazonaws.com",
  "s3-website-sa-east-1.amazonaws.com",
  "s3-website-us-east-1.amazonaws.com",
  "s3-website-us-gov-west-1.amazonaws.com",
  "s3-website-us-west-1.amazonaws.com",
  "s3-website-us-west-2.amazonaws.com",
  "s3.dualstack.sa-east-1.amazonaws.com",
  "s3-accesspoint.dualstack.sa-east-1.amazonaws.com",
  "s3-website.dualstack.sa-east-1.amazonaws.com",
  "s3.sa-east-1.amazonaws.com",
  "s3-accesspoint.sa-east-1.amazonaws.com",
  "s3-object-lambda.sa-east-1.amazonaws.com",
  "s3-website.sa-east-1.amazonaws.com",
  "s3.dualstack.us-east-1.amazonaws.com",
  "s3-accesspoint.dualstack.us-east-1.amazonaws.com",
  "s3-accesspoint-fips.dualstack.us-east-1.amazonaws.com",
  "s3-fips.dualstack.us-east-1.amazonaws.com",
  "s3-website.dualstack.us-east-1.amazonaws.com",
  "s3.us-east-1.amazonaws.com",
  "s3-accesspoint.us-east-1.amazonaws.com",
  "s3-accesspoint-fips.us-east-1.amazonaws.com",
  "s3-deprecated.us-east-1.amazonaws.com",
  "s3-fips.us-east-1.amazonaws.com",
  "s3-object-lambda.us-east-1.amazonaws.com",
  "s3-website.us-east-1.amazonaws.com",
  "s3.dualstack.us-east-2.amazonaws.com",
  "s3-accesspoint.dualstack.us-east-2.amazonaws.com",
  "s3-accesspoint-fips.dualstack.us-east-2.amazonaws.com",
  "s3-fips.dualstack.us-east-2.amazonaws.com",
  "s3-website.dualstack.us-east-2.amazonaws.com",
  "s3.us-east-2.amazonaws.com",
  "s3-accesspoint.us-east-2.amazonaws.com",
  "s3-accesspoint-fips.us-east-2.amazonaws.com",
  "s3-deprecated.us-east-2.amazonaws.com",
  "s3-fips.us-east-2.amazonaws.com",
  "s3-object-lambda.us-east-2.amazonaws.com",
  "s3-website.us-east-2.amazonaws.com",
  "s3.dualstack.us-gov-east-1.amazonaws.com",
  "s3-accesspoint.dualstack.us-gov-east-1.amazonaws.com",
  "s3-accesspoint-fips.dualstack.us-gov-east-1.amazonaws.com",
  "s3-fips.dualstack.us-gov-east-1.amazonaws.com",
  "s3.us-gov-east-1.amazonaws.com",
  "s3-accesspoint.us-gov-east-1.amazonaws.com",
  "s3-accesspoint-fips.us-gov-east-1.amazonaws.com",
  "s3-fips.us-gov-east-1.amazonaws.com",
  "s3-object-lambda.us-gov-east-1.amazonaws.com",
  "s3-website.us-gov-east-1.amazonaws.com",
  "s3.dualstack.us-gov-west-1.amazonaws.com",
  "s3-accesspoint.dualstack.us-gov-west-1.amazonaws.com",
  "s3-accesspoint-fips.dualstack.us-gov-west-1.amazonaws.com",
  "s3-fips.dualstack.us-gov-west-1.amazonaws.com",
  "s3.us-gov-west-1.amazonaws.com",
  "s3-accesspoint.us-gov-west-1.amazonaws.com",
  "s3-accesspoint-fips.us-gov-west-1.amazonaws.com",
  "s3-fips.us-gov-west-1.amazonaws.com",
  "s3-object-lambda.us-gov-west-1.amazonaws.com",
  "s3-website.us-gov-west-1.amazonaws.com",
  "s3.dualstack.us-west-1.amazonaws.com",
  "s3-accesspoint.dualstack.us-west-1.amazonaws.com",
  "s3-accesspoint-fips.dualstack.us-west-1.amazonaws.com",
  "s3-fips.dualstack.us-west-1.amazonaws.com",
  "s3-website.dualstack.us-west-1.amazonaws.com",
  "s3.us-west-1.amazonaws.com",
  "s3-accesspoint.us-west-1.amazonaws.com",
  "s3-accesspoint-fips.us-west-1.amazonaws.com",
  "s3-fips.us-west-1.amazonaws.com",
  "s3-object-lambda.us-west-1.amazonaws.com",
  "s3-website.us-west-1.amazonaws.com",
  "s3.dualstack.us-west-2.amazonaws.com",
  "s3-accesspoint.dualstack.us-west-2.amazonaws.com",
  "s3-accesspoint-fips.dualstack.us-west-2.amazonaws.com",
  "s3-fips.dualstack.us-west-2.amazonaws.com",
  "s3-website.dualstack.us-west-2.amazonaws.com",
  "s3.us-west-2.amazonaws.com",
  "s3-accesspoint.us-west-2.amazonaws.com",
  "s3-accesspoint-fips.us-west-2.amazonaws.com",
  "s3-deprecated.us-west-2.amazonaws.com",
  "s3-fips.us-west-2.amazonaws.com",
  "s3-object-lambda.us-west-2.amazonaws.com",
  "s3-website.us-west-2.amazonaws.com",
  "labeling.ap-northeast-1.sagemaker.aws",
  "labeling.ap-northeast-2.sagemaker.aws",
  "labeling.ap-south-1.sagemaker.aws",
  "labeling.ap-southeast-1.sagemaker.aws",
  "labeling.ap-southeast-2.sagemaker.aws",
  "labeling.ca-central-1.sagemaker.aws",
  "labeling.eu-central-1.sagemaker.aws",
  "labeling.eu-west-1.sagemaker.aws",
  "labeling.eu-west-2.sagemaker.aws",
  "labeling.us-east-1.sagemaker.aws",
  "labeling.us-east-2.sagemaker.aws",
  "labeling.us-west-2.sagemaker.aws",
  "notebook.af-south-1.sagemaker.aws",
  "notebook.ap-east-1.sagemaker.aws",
  "notebook.ap-northeast-1.sagemaker.aws",
  "notebook.ap-northeast-2.sagemaker.aws",
  "notebook.ap-northeast-3.sagemaker.aws",
  "notebook.ap-south-1.sagemaker.aws",
  "notebook.ap-south-2.sagemaker.aws",
  "notebook.ap-southeast-1.sagemaker.aws",
  "notebook.ap-southeast-2.sagemaker.aws",
  "notebook.ap-southeast-3.sagemaker.aws",
  "notebook.ap-southeast-4.sagemaker.aws",
  "notebook.ca-central-1.sagemaker.aws",
  "notebook-fips.ca-central-1.sagemaker.aws",
  "notebook.ca-west-1.sagemaker.aws",
  "notebook-fips.ca-west-1.sagemaker.aws",
  "notebook.eu-central-1.sagemaker.aws",
  "notebook.eu-central-2.sagemaker.aws",
  "notebook.eu-north-1.sagemaker.aws",
  "notebook.eu-south-1.sagemaker.aws",
  "notebook.eu-south-2.sagemaker.aws",
  "notebook.eu-west-1.sagemaker.aws",
  "notebook.eu-west-2.sagemaker.aws",
  "notebook.eu-west-3.sagemaker.aws",
  "notebook.il-central-1.sagemaker.aws",
  "notebook.me-central-1.sagemaker.aws",
  "notebook.me-south-1.sagemaker.aws",
  "notebook.sa-east-1.sagemaker.aws",
  "notebook.us-east-1.sagemaker.aws",
  "notebook-fips.us-east-1.sagemaker.aws",
  "notebook.us-east-2.sagemaker.aws",
  "notebook-fips.us-east-2.sagemaker.aws",
  "notebook.us-gov-east-1.sagemaker.aws",
  "notebook-fips.us-gov-east-1.sagemaker.aws",
  "notebook.us-gov-west-1.sagemaker.aws",
  "notebook-fips.us-gov-west-1.sagemaker.aws",
  "notebook.us-west-1.sagemaker.aws",
  "notebook-fips.us-west-1.sagemaker.aws",
  "notebook.us-west-2.sagemaker.aws",
  "notebook-fips.us-west-2.sagemaker.aws",
  "notebook.cn-north-1.sagemaker.com.cn",
  "notebook.cn-northwest-1.sagemaker.com.cn",
  "studio.af-south-1.sagemaker.aws",
  "studio.ap-east-1.sagemaker.aws",
  "studio.ap-northeast-1.sagemaker.aws",
  "studio.ap-northeast-2.sagemaker.aws",
  "studio.ap-northeast-3.sagemaker.aws",
  "studio.ap-south-1.sagemaker.aws",
  "studio.ap-southeast-1.sagemaker.aws",
  "studio.ap-southeast-2.sagemaker.aws",
  "studio.ap-southeast-3.sagemaker.aws",
  "studio.ca-central-1.sagemaker.aws",
  "studio.eu-central-1.sagemaker.aws",
  "studio.eu-north-1.sagemaker.aws",
  "studio.eu-south-1.sagemaker.aws",
  "studio.eu-south-2.sagemaker.aws",
  "studio.eu-west-1.sagemaker.aws",
  "studio.eu-west-2.sagemaker.aws",
  "studio.eu-west-3.sagemaker.aws",
  "studio.il-central-1.sagemaker.aws",
  "studio.me-central-1.sagemaker.aws",
  "studio.me-south-1.sagemaker.aws",
  "studio.sa-east-1.sagemaker.aws",
  "studio.us-east-1.sagemaker.aws",
  "studio.us-east-2.sagemaker.aws",
  "studio.us-gov-east-1.sagemaker.aws",
  "studio-fips.us-gov-east-1.sagemaker.aws",
  "studio.us-gov-west-1.sagemaker.aws",
  "studio-fips.us-gov-west-1.sagemaker.aws",
  "studio.us-west-1.sagemaker.aws",
  "studio.us-west-2.sagemaker.aws",
  "studio.cn-north-1.sagemaker.com.cn",
  "studio.cn-northwest-1.sagemaker.com.cn",
  "*.experiments.sagemaker.aws",
  "analytics-gateway.ap-northeast-1.amazonaws.com",
  "analytics-gateway.ap-northeast-2.amazonaws.com",
  "analytics-gateway.ap-south-1.amazonaws.com",
  "analytics-gateway.ap-southeast-1.amazonaws.com",
  "analytics-gateway.ap-southeast-2.amazonaws.com",
  "analytics-gateway.eu-central-1.amazonaws.com",
  "analytics-gateway.eu-west-1.amazonaws.com",
  "analytics-gateway.us-east-1.amazonaws.com",
  "analytics-gateway.us-east-2.amazonaws.com",
  "analytics-gateway.us-west-2.amazonaws.com",
  "amplifyapp.com",
  "*.awsapprunner.com",
  "webview-assets.aws-cloud9.af-south-1.amazonaws.com",
  "vfs.cloud9.af-south-1.amazonaws.com",
  "webview-assets.cloud9.af-south-1.amazonaws.com",
  "webview-assets.aws-cloud9.ap-east-1.amazonaws.com",
  "vfs.cloud9.ap-east-1.amazonaws.com",
  "webview-assets.cloud9.ap-east-1.amazonaws.com",
  "webview-assets.aws-cloud9.ap-northeast-1.amazonaws.com",
  "vfs.cloud9.ap-northeast-1.amazonaws.com",
  "webview-assets.cloud9.ap-northeast-1.amazonaws.com",
  "webview-assets.aws-cloud9.ap-northeast-2.amazonaws.com",
  "vfs.cloud9.ap-northeast-2.amazonaws.com",
  "webview-assets.cloud9.ap-northeast-2.amazonaws.com",
  "webview-assets.aws-cloud9.ap-northeast-3.amazonaws.com",
  "vfs.cloud9.ap-northeast-3.amazonaws.com",
  "webview-assets.cloud9.ap-northeast-3.amazonaws.com",
  "webview-assets.aws-cloud9.ap-south-1.amazonaws.com",
  "vfs.cloud9.ap-south-1.amazonaws.com",
  "webview-assets.cloud9.ap-south-1.amazonaws.com",
  "webview-assets.aws-cloud9.ap-southeast-1.amazonaws.com",
  "vfs.cloud9.ap-southeast-1.amazonaws.com",
  "webview-assets.cloud9.ap-southeast-1.amazonaws.com",
  "webview-assets.aws-cloud9.ap-southeast-2.amazonaws.com",
  "vfs.cloud9.ap-southeast-2.amazonaws.com",
  "webview-assets.cloud9.ap-southeast-2.amazonaws.com",
  "webview-assets.aws-cloud9.ca-central-1.amazonaws.com",
  "vfs.cloud9.ca-central-1.amazonaws.com",
  "webview-assets.cloud9.ca-central-1.amazonaws.com",
  "webview-assets.aws-cloud9.eu-central-1.amazonaws.com",
  "vfs.cloud9.eu-central-1.amazonaws.com",
  "webview-assets.cloud9.eu-central-1.amazonaws.com",
  "webview-assets.aws-cloud9.eu-north-1.amazonaws.com",
  "vfs.cloud9.eu-north-1.amazonaws.com",
  "webview-assets.cloud9.eu-north-1.amazonaws.com",
  "webview-assets.aws-cloud9.eu-south-1.amazonaws.com",
  "vfs.cloud9.eu-south-1.amazonaws.com",
  "webview-assets.cloud9.eu-south-1.amazonaws.com",
  "webview-assets.aws-cloud9.eu-west-1.amazonaws.com",
  "vfs.cloud9.eu-west-1.amazonaws.com",
  "webview-assets.cloud9.eu-west-1.amazonaws.com",
  "webview-assets.aws-cloud9.eu-west-2.amazonaws.com",
  "vfs.cloud9.eu-west-2.amazonaws.com",
  "webview-assets.cloud9.eu-west-2.amazonaws.com",
  "webview-assets.aws-cloud9.eu-west-3.amazonaws.com",
  "vfs.cloud9.eu-west-3.amazonaws.com",
  "webview-assets.cloud9.eu-west-3.amazonaws.com",
  "webview-assets.aws-cloud9.il-central-1.amazonaws.com",
  "vfs.cloud9.il-central-1.amazonaws.com",
  "webview-assets.aws-cloud9.me-south-1.amazonaws.com",
  "vfs.cloud9.me-south-1.amazonaws.com",
  "webview-assets.cloud9.me-south-1.amazonaws.com",
  "webview-assets.aws-cloud9.sa-east-1.amazonaws.com",
  "vfs.cloud9.sa-east-1.amazonaws.com",
  "webview-assets.cloud9.sa-east-1.amazonaws.com",
  "webview-assets.aws-cloud9.us-east-1.amazonaws.com",
  "vfs.cloud9.us-east-1.amazonaws.com",
  "webview-assets.cloud9.us-east-1.amazonaws.com",
  "webview-assets.aws-cloud9.us-east-2.amazonaws.com",
  "vfs.cloud9.us-east-2.amazonaws.com",
  "webview-assets.cloud9.us-east-2.amazonaws.com",
  "webview-assets.aws-cloud9.us-west-1.amazonaws.com",
  "vfs.cloud9.us-west-1.amazonaws.com",
  "webview-assets.cloud9.us-west-1.amazonaws.com",
  "webview-assets.aws-cloud9.us-west-2.amazonaws.com",
  "vfs.cloud9.us-west-2.amazonaws.com",
  "webview-assets.cloud9.us-west-2.amazonaws.com",
  "awsapps.com",
  "cn-north-1.eb.amazonaws.com.cn",
  "cn-northwest-1.eb.amazonaws.com.cn",
  "elasticbeanstalk.com",
  "af-south-1.elasticbeanstalk.com",
  "ap-east-1.elasticbeanstalk.com",
  "ap-northeast-1.elasticbeanstalk.com",
  "ap-northeast-2.elasticbeanstalk.com",
  "ap-northeast-3.elasticbeanstalk.com",
  "ap-south-1.elasticbeanstalk.com",
  "ap-southeast-1.elasticbeanstalk.com",
  "ap-southeast-2.elasticbeanstalk.com",
  "ap-southeast-3.elasticbeanstalk.com",
  "ca-central-1.elasticbeanstalk.com",
  "eu-central-1.elasticbeanstalk.com",
  "eu-north-1.elasticbeanstalk.com",
  "eu-south-1.elasticbeanstalk.com",
  "eu-west-1.elasticbeanstalk.com",
  "eu-west-2.elasticbeanstalk.com",
  "eu-west-3.elasticbeanstalk.com",
  "il-central-1.elasticbeanstalk.com",
  "me-south-1.elasticbeanstalk.com",
  "sa-east-1.elasticbeanstalk.com",
  "us-east-1.elasticbeanstalk.com",
  "us-east-2.elasticbeanstalk.com",
  "us-gov-east-1.elasticbeanstalk.com",
  "us-gov-west-1.elasticbeanstalk.com",
  "us-west-1.elasticbeanstalk.com",
  "us-west-2.elasticbeanstalk.com",
  "*.elb.amazonaws.com.cn",
  "*.elb.amazonaws.com",
  "awsglobalaccelerator.com",
  "*.private.repost.aws",
  "eero.online",
  "eero-stage.online",
  "apigee.io",
  "panel.dev",
  "siiites.com",
  "appspacehosted.com",
  "appspaceusercontent.com",
  "appudo.net",
  "on-aptible.com",
  "f5.si",
  "arvanedge.ir",
  "user.aseinet.ne.jp",
  "gv.vc",
  "d.gv.vc",
  "user.party.eus",
  "pimienta.org",
  "poivron.org",
  "potager.org",
  "sweetpepper.org",
  "myasustor.com",
  "cdn.prod.atlassian-dev.net",
  "translated.page",
  "myfritz.link",
  "myfritz.net",
  "onavstack.net",
  "*.awdev.ca",
  "*.advisor.ws",
  "ecommerce-shop.pl",
  "b-data.io",
  "balena-devices.com",
  "base.ec",
  "official.ec",
  "buyshop.jp",
  "fashionstore.jp",
  "handcrafted.jp",
  "kawaiishop.jp",
  "supersale.jp",
  "theshop.jp",
  "shopselect.net",
  "base.shop",
  "beagleboard.io",
  "*.beget.app",
  "pages.gay",
  "bnr.la",
  "bitbucket.io",
  "blackbaudcdn.net",
  "of.je",
  "bluebite.io",
  "boomla.net",
  "boutir.com",
  "boxfuse.io",
  "square7.ch",
  "bplaced.com",
  "bplaced.de",
  "square7.de",
  "bplaced.net",
  "square7.net",
  "*.s.brave.io",
  "shop.brendly.hr",
  "shop.brendly.rs",
  "browsersafetymark.io",
  "radio.am",
  "radio.fm",
  "uk0.bigv.io",
  "dh.bytemark.co.uk",
  "vm.bytemark.co.uk",
  "cafjs.com",
  "canva-apps.cn",
  "*.my.canvasite.cn",
  "canva-apps.com",
  "*.my.canva.site",
  "drr.ac",
  "uwu.ai",
  "carrd.co",
  "crd.co",
  "ju.mp",
  "api.gov.uk",
  "cdn77-storage.com",
  "rsc.contentproxy9.cz",
  "r.cdn77.net",
  "cdn77-ssl.net",
  "c.cdn77.org",
  "rsc.cdn77.org",
  "ssl.origin.cdn77-secure.org",
  "za.bz",
  "br.com",
  "cn.com",
  "de.com",
  "eu.com",
  "jpn.com",
  "mex.com",
  "ru.com",
  "sa.com",
  "uk.com",
  "us.com",
  "za.com",
  "com.de",
  "gb.net",
  "hu.net",
  "jp.net",
  "se.net",
  "uk.net",
  "ae.org",
  "com.se",
  "cx.ua",
  "discourse.group",
  "discourse.team",
  "clerk.app",
  "clerkstage.app",
  "*.lcl.dev",
  "*.lclstage.dev",
  "*.stg.dev",
  "*.stgstage.dev",
  "cleverapps.cc",
  "*.services.clever-cloud.com",
  "cleverapps.io",
  "cleverapps.tech",
  "clickrising.net",
  "cloudns.asia",
  "cloudns.be",
  "cloud-ip.biz",
  "cloudns.biz",
  "cloudns.cc",
  "cloudns.ch",
  "cloudns.cl",
  "cloudns.club",
  "dnsabr.com",
  "ip-ddns.com",
  "cloudns.cx",
  "cloudns.eu",
  "cloudns.in",
  "cloudns.info",
  "ddns-ip.net",
  "dns-cloud.net",
  "dns-dynamic.net",
  "cloudns.nz",
  "cloudns.org",
  "ip-dynamic.org",
  "cloudns.ph",
  "cloudns.pro",
  "cloudns.pw",
  "cloudns.us",
  "c66.me",
  "cloud66.ws",
  "cloud66.zone",
  "jdevcloud.com",
  "wpdevcloud.com",
  "cloudaccess.host",
  "freesite.host",
  "cloudaccess.net",
  "*.cloudera.site",
  "cf-ipfs.com",
  "cloudflare-ipfs.com",
  "trycloudflare.com",
  "pages.dev",
  "r2.dev",
  "workers.dev",
  "cloudflare.net",
  "cdn.cloudflare.net",
  "cdn.cloudflareanycast.net",
  "cdn.cloudflarecn.net",
  "cdn.cloudflareglobal.net",
  "cust.cloudscale.ch",
  "objects.lpg.cloudscale.ch",
  "objects.rma.cloudscale.ch",
  "wnext.app",
  "cnpy.gdn",
  "*.otap.co",
  "co.ca",
  "co.com",
  "codeberg.page",
  "csb.app",
  "preview.csb.app",
  "co.nl",
  "co.no",
  "webhosting.be",
  "hosting-cluster.nl",
  "ctfcloud.net",
  "convex.site",
  "ac.ru",
  "edu.ru",
  "gov.ru",
  "int.ru",
  "mil.ru",
  "test.ru",
  "dyn.cosidns.de",
  "dnsupdater.de",
  "dynamisches-dns.de",
  "internet-dns.de",
  "l-o-g-i-n.de",
  "dynamic-dns.info",
  "feste-ip.net",
  "knx-server.net",
  "static-access.net",
  "craft.me",
  "realm.cz",
  "on.crisp.email",
  "*.cryptonomic.net",
  "curv.dev",
  "cfolks.pl",
  "cyon.link",
  "cyon.site",
  "platform0.app",
  "fnwk.site",
  "folionetwork.site",
  "biz.dk",
  "co.dk",
  "firm.dk",
  "reg.dk",
  "store.dk",
  "dyndns.dappnode.io",
  "builtwithdark.com",
  "darklang.io",
  "demo.datadetect.com",
  "instance.datadetect.com",
  "edgestack.me",
  "dattolocal.com",
  "dattorelay.com",
  "dattoweb.com",
  "mydatto.com",
  "dattolocal.net",
  "mydatto.net",
  "ddnss.de",
  "dyn.ddnss.de",
  "dyndns.ddnss.de",
  "dyn-ip24.de",
  "dyndns1.de",
  "home-webserver.de",
  "dyn.home-webserver.de",
  "myhome-server.de",
  "ddnss.org",
  "debian.net",
  "definima.io",
  "definima.net",
  "deno.dev",
  "deno-staging.dev",
  "dedyn.io",
  "deta.app",
  "deta.dev",
  "dfirma.pl",
  "dkonto.pl",
  "you2.pl",
  "ondigitalocean.app",
  "*.digitaloceanspaces.com",
  "us.kg",
  "rss.my.id",
  "diher.solutions",
  "discordsays.com",
  "discordsez.com",
  "jozi.biz",
  "dnshome.de",
  "online.th",
  "shop.th",
  "drayddns.com",
  "shoparena.pl",
  "dreamhosters.com",
  "durumis.com",
  "mydrobo.com",
  "drud.io",
  "drud.us",
  "duckdns.org",
  "dy.fi",
  "tunk.org",
  "dyndns.biz",
  "for-better.biz",
  "for-more.biz",
  "for-some.biz",
  "for-the.biz",
  "selfip.biz",
  "webhop.biz",
  "ftpaccess.cc",
  "game-server.cc",
  "myphotos.cc",
  "scrapping.cc",
  "blogdns.com",
  "cechire.com",
  "dnsalias.com",
  "dnsdojo.com",
  "doesntexist.com",
  "dontexist.com",
  "doomdns.com",
  "dyn-o-saur.com",
  "dynalias.com",
  "dyndns-at-home.com",
  "dyndns-at-work.com",
  "dyndns-blog.com",
  "dyndns-free.com",
  "dyndns-home.com",
  "dyndns-ip.com",
  "dyndns-mail.com",
  "dyndns-office.com",
  "dyndns-pics.com",
  "dyndns-remote.com",
  "dyndns-server.com",
  "dyndns-web.com",
  "dyndns-wiki.com",
  "dyndns-work.com",
  "est-a-la-maison.com",
  "est-a-la-masion.com",
  "est-le-patron.com",
  "est-mon-blogueur.com",
  "from-ak.com",
  "from-al.com",
  "from-ar.com",
  "from-ca.com",
  "from-ct.com",
  "from-dc.com",
  "from-de.com",
  "from-fl.com",
  "from-ga.com",
  "from-hi.com",
  "from-ia.com",
  "from-id.com",
  "from-il.com",
  "from-in.com",
  "from-ks.com",
  "from-ky.com",
  "from-ma.com",
  "from-md.com",
  "from-mi.com",
  "from-mn.com",
  "from-mo.com",
  "from-ms.com",
  "from-mt.com",
  "from-nc.com",
  "from-nd.com",
  "from-ne.com",
  "from-nh.com",
  "from-nj.com",
  "from-nm.com",
  "from-nv.com",
  "from-oh.com",
  "from-ok.com",
  "from-or.com",
  "from-pa.com",
  "from-pr.com",
  "from-ri.com",
  "from-sc.com",
  "from-sd.com",
  "from-tn.com",
  "from-tx.com",
  "from-ut.com",
  "from-va.com",
  "from-vt.com",
  "from-wa.com",
  "from-wi.com",
  "from-wv.com",
  "from-wy.com",
  "getmyip.com",
  "gotdns.com",
  "hobby-site.com",
  "homelinux.com",
  "homeunix.com",
  "iamallama.com",
  "is-a-anarchist.com",
  "is-a-blogger.com",
  "is-a-bookkeeper.com",
  "is-a-bulls-fan.com",
  "is-a-caterer.com",
  "is-a-chef.com",
  "is-a-conservative.com",
  "is-a-cpa.com",
  "is-a-cubicle-slave.com",
  "is-a-democrat.com",
  "is-a-designer.com",
  "is-a-doctor.com",
  "is-a-financialadvisor.com",
  "is-a-geek.com",
  "is-a-green.com",
  "is-a-guru.com",
  "is-a-hard-worker.com",
  "is-a-hunter.com",
  "is-a-landscaper.com",
  "is-a-lawyer.com",
  "is-a-liberal.com",
  "is-a-libertarian.com",
  "is-a-llama.com",
  "is-a-musician.com",
  "is-a-nascarfan.com",
  "is-a-nurse.com",
  "is-a-painter.com",
  "is-a-personaltrainer.com",
  "is-a-photographer.com",
  "is-a-player.com",
  "is-a-republican.com",
  "is-a-rockstar.com",
  "is-a-socialist.com",
  "is-a-student.com",
  "is-a-teacher.com",
  "is-a-techie.com",
  "is-a-therapist.com",
  "is-an-accountant.com",
  "is-an-actor.com",
  "is-an-actress.com",
  "is-an-anarchist.com",
  "is-an-artist.com",
  "is-an-engineer.com",
  "is-an-entertainer.com",
  "is-certified.com",
  "is-gone.com",
  "is-into-anime.com",
  "is-into-cars.com",
  "is-into-cartoons.com",
  "is-into-games.com",
  "is-leet.com",
  "is-not-certified.com",
  "is-slick.com",
  "is-uberleet.com",
  "is-with-theband.com",
  "isa-geek.com",
  "isa-hockeynut.com",
  "issmarterthanyou.com",
  "likes-pie.com",
  "likescandy.com",
  "neat-url.com",
  "saves-the-whales.com",
  "selfip.com",
  "sells-for-less.com",
  "sells-for-u.com",
  "servebbs.com",
  "simple-url.com",
  "space-to-rent.com",
  "teaches-yoga.com",
  "writesthisblog.com",
  "ath.cx",
  "fuettertdasnetz.de",
  "isteingeek.de",
  "istmein.de",
  "lebtimnetz.de",
  "leitungsen.de",
  "traeumtgerade.de",
  "barrel-of-knowledge.info",
  "barrell-of-knowledge.info",
  "dyndns.info",
  "for-our.info",
  "groks-the.info",
  "groks-this.info",
  "here-for-more.info",
  "knowsitall.info",
  "selfip.info",
  "webhop.info",
  "forgot.her.name",
  "forgot.his.name",
  "at-band-camp.net",
  "blogdns.net",
  "broke-it.net",
  "buyshouses.net",
  "dnsalias.net",
  "dnsdojo.net",
  "does-it.net",
  "dontexist.net",
  "dynalias.net",
  "dynathome.net",
  "endofinternet.net",
  "from-az.net",
  "from-co.net",
  "from-la.net",
  "from-ny.net",
  "gets-it.net",
  "ham-radio-op.net",
  "homeftp.net",
  "homeip.net",
  "homelinux.net",
  "homeunix.net",
  "in-the-band.net",
  "is-a-chef.net",
  "is-a-geek.net",
  "isa-geek.net",
  "kicks-ass.net",
  "office-on-the.net",
  "podzone.net",
  "scrapper-site.net",
  "selfip.net",
  "sells-it.net",
  "servebbs.net",
  "serveftp.net",
  "thruhere.net",
  "webhop.net",
  "merseine.nu",
  "mine.nu",
  "shacknet.nu",
  "blogdns.org",
  "blogsite.org",
  "boldlygoingnowhere.org",
  "dnsalias.org",
  "dnsdojo.org",
  "doesntexist.org",
  "dontexist.org",
  "doomdns.org",
  "dvrdns.org",
  "dynalias.org",
  "dyndns.org",
  "go.dyndns.org",
  "home.dyndns.org",
  "endofinternet.org",
  "endoftheinternet.org",
  "from-me.org",
  "game-host.org",
  "gotdns.org",
  "hobby-site.org",
  "homedns.org",
  "homeftp.org",
  "homelinux.org",
  "homeunix.org",
  "is-a-bruinsfan.org",
  "is-a-candidate.org",
  "is-a-celticsfan.org",
  "is-a-chef.org",
  "is-a-geek.org",
  "is-a-knight.org",
  "is-a-linux-user.org",
  "is-a-patsfan.org",
  "is-a-soxfan.org",
  "is-found.org",
  "is-lost.org",
  "is-saved.org",
  "is-very-bad.org",
  "is-very-evil.org",
  "is-very-good.org",
  "is-very-nice.org",
  "is-very-sweet.org",
  "isa-geek.org",
  "kicks-ass.org",
  "misconfused.org",
  "podzone.org",
  "readmyblog.org",
  "selfip.org",
  "sellsyourhome.org",
  "servebbs.org",
  "serveftp.org",
  "servegame.org",
  "stuff-4-sale.org",
  "webhop.org",
  "better-than.tv",
  "dyndns.tv",
  "on-the-web.tv",
  "worse-than.tv",
  "is-by.us",
  "land-4-sale.us",
  "stuff-4-sale.us",
  "dyndns.ws",
  "mypets.ws",
  "ddnsfree.com",
  "ddnsgeek.com",
  "giize.com",
  "gleeze.com",
  "kozow.com",
  "loseyourip.com",
  "ooguy.com",
  "theworkpc.com",
  "casacam.net",
  "dynu.net",
  "accesscam.org",
  "camdvr.org",
  "freeddns.org",
  "mywire.org",
  "webredirect.org",
  "myddns.rocks",
  "dynv6.net",
  "e4.cz",
  "easypanel.app",
  "easypanel.host",
  "*.ewp.live",
  "twmail.cc",
  "twmail.net",
  "twmail.org",
  "mymailer.com.tw",
  "url.tw",
  "at.emf.camp",
  "rt.ht",
  "elementor.cloud",
  "elementor.cool",
  "en-root.fr",
  "mytuleap.com",
  "tuleap-partners.com",
  "encr.app",
  "encoreapi.com",
  "eu.encoway.cloud",
  "eu.org",
  "al.eu.org",
  "asso.eu.org",
  "at.eu.org",
  "au.eu.org",
  "be.eu.org",
  "bg.eu.org",
  "ca.eu.org",
  "cd.eu.org",
  "ch.eu.org",
  "cn.eu.org",
  "cy.eu.org",
  "cz.eu.org",
  "de.eu.org",
  "dk.eu.org",
  "edu.eu.org",
  "ee.eu.org",
  "es.eu.org",
  "fi.eu.org",
  "fr.eu.org",
  "gr.eu.org",
  "hr.eu.org",
  "hu.eu.org",
  "ie.eu.org",
  "il.eu.org",
  "in.eu.org",
  "int.eu.org",
  "is.eu.org",
  "it.eu.org",
  "jp.eu.org",
  "kr.eu.org",
  "lt.eu.org",
  "lu.eu.org",
  "lv.eu.org",
  "me.eu.org",
  "mk.eu.org",
  "mt.eu.org",
  "my.eu.org",
  "net.eu.org",
  "ng.eu.org",
  "nl.eu.org",
  "no.eu.org",
  "nz.eu.org",
  "pl.eu.org",
  "pt.eu.org",
  "ro.eu.org",
  "ru.eu.org",
  "se.eu.org",
  "si.eu.org",
  "sk.eu.org",
  "tr.eu.org",
  "uk.eu.org",
  "us.eu.org",
  "eurodir.ru",
  "eu-1.evennode.com",
  "eu-2.evennode.com",
  "eu-3.evennode.com",
  "eu-4.evennode.com",
  "us-1.evennode.com",
  "us-2.evennode.com",
  "us-3.evennode.com",
  "us-4.evennode.com",
  "relay.evervault.app",
  "relay.evervault.dev",
  "expo.app",
  "staging.expo.app",
  "onfabrica.com",
  "ru.net",
  "adygeya.ru",
  "bashkiria.ru",
  "bir.ru",
  "cbg.ru",
  "com.ru",
  "dagestan.ru",
  "grozny.ru",
  "kalmykia.ru",
  "kustanai.ru",
  "marine.ru",
  "mordovia.ru",
  "msk.ru",
  "mytis.ru",
  "nalchik.ru",
  "nov.ru",
  "pyatigorsk.ru",
  "spb.ru",
  "vladikavkaz.ru",
  "vladimir.ru",
  "abkhazia.su",
  "adygeya.su",
  "aktyubinsk.su",
  "arkhangelsk.su",
  "armenia.su",
  "ashgabad.su",
  "azerbaijan.su",
  "balashov.su",
  "bashkiria.su",
  "bryansk.su",
  "bukhara.su",
  "chimkent.su",
  "dagestan.su",
  "east-kazakhstan.su",
  "exnet.su",
  "georgia.su",
  "grozny.su",
  "ivanovo.su",
  "jambyl.su",
  "kalmykia.su",
  "kaluga.su",
  "karacol.su",
  "karaganda.su",
  "karelia.su",
  "khakassia.su",
  "krasnodar.su",
  "kurgan.su",
  "kustanai.su",
  "lenug.su",
  "mangyshlak.su",
  "mordovia.su",
  "msk.su",
  "murmansk.su",
  "nalchik.su",
  "navoi.su",
  "north-kazakhstan.su",
  "nov.su",
  "obninsk.su",
  "penza.su",
  "pokrovsk.su",
  "sochi.su",
  "spb.su",
  "tashkent.su",
  "termez.su",
  "togliatti.su",
  "troitsk.su",
  "tselinograd.su",
  "tula.su",
  "tuva.su",
  "vladikavkaz.su",
  "vladimir.su",
  "vologda.su",
  "channelsdvr.net",
  "u.channelsdvr.net",
  "edgecompute.app",
  "fastly-edge.com",
  "fastly-terrarium.com",
  "freetls.fastly.net",
  "map.fastly.net",
  "a.prod.fastly.net",
  "global.prod.fastly.net",
  "a.ssl.fastly.net",
  "b.ssl.fastly.net",
  "global.ssl.fastly.net",
  "fastlylb.net",
  "map.fastlylb.net",
  "*.user.fm",
  "fastvps-server.com",
  "fastvps.host",
  "myfast.host",
  "fastvps.site",
  "myfast.space",
  "conn.uk",
  "copro.uk",
  "hosp.uk",
  "fedorainfracloud.org",
  "fedorapeople.org",
  "cloud.fedoraproject.org",
  "app.os.fedoraproject.org",
  "app.os.stg.fedoraproject.org",
  "mydobiss.com",
  "fh-muenster.io",
  "filegear.me",
  "firebaseapp.com",
  "fldrv.com",
  "flutterflow.app",
  "fly.dev",
  "shw.io",
  "edgeapp.net",
  "forgeblocks.com",
  "id.forgerock.io",
  "framer.ai",
  "framer.app",
  "framercanvas.com",
  "framer.media",
  "framer.photos",
  "framer.website",
  "framer.wiki",
  "0e.vc",
  "freebox-os.com",
  "freeboxos.com",
  "fbx-os.fr",
  "fbxos.fr",
  "freebox-os.fr",
  "freeboxos.fr",
  "freedesktop.org",
  "freemyip.com",
  "*.frusky.de",
  "wien.funkfeuer.at",
  "daemon.asia",
  "dix.asia",
  "mydns.bz",
  "0am.jp",
  "0g0.jp",
  "0j0.jp",
  "0t0.jp",
  "mydns.jp",
  "pgw.jp",
  "wjg.jp",
  "keyword-on.net",
  "live-on.net",
  "server-on.net",
  "mydns.tw",
  "mydns.vc",
  "*.futurecms.at",
  "*.ex.futurecms.at",
  "*.in.futurecms.at",
  "futurehosting.at",
  "futuremailing.at",
  "*.ex.ortsinfo.at",
  "*.kunden.ortsinfo.at",
  "*.statics.cloud",
  "aliases121.com",
  "campaign.gov.uk",
  "service.gov.uk",
  "independent-commission.uk",
  "independent-inquest.uk",
  "independent-inquiry.uk",
  "independent-panel.uk",
  "independent-review.uk",
  "public-inquiry.uk",
  "royal-commission.uk",
  "gehirn.ne.jp",
  "usercontent.jp",
  "gentapps.com",
  "gentlentapis.com",
  "lab.ms",
  "cdn-edges.net",
  "localcert.net",
  "localhostcert.net",
  "gsj.bz",
  "githubusercontent.com",
  "githubpreview.dev",
  "github.io",
  "gitlab.io",
  "gitapp.si",
  "gitpage.si",
  "glitch.me",
  "nog.community",
  "co.ro",
  "shop.ro",
  "lolipop.io",
  "angry.jp",
  "babyblue.jp",
  "babymilk.jp",
  "backdrop.jp",
  "bambina.jp",
  "bitter.jp",
  "blush.jp",
  "boo.jp",
  "boy.jp",
  "boyfriend.jp",
  "but.jp",
  "candypop.jp",
  "capoo.jp",
  "catfood.jp",
  "cheap.jp",
  "chicappa.jp",
  "chillout.jp",
  "chips.jp",
  "chowder.jp",
  "chu.jp",
  "ciao.jp",
  "cocotte.jp",
  "coolblog.jp",
  "cranky.jp",
  "cutegirl.jp",
  "daa.jp",
  "deca.jp",
  "deci.jp",
  "digick.jp",
  "egoism.jp",
  "fakefur.jp",
  "fem.jp",
  "flier.jp",
  "floppy.jp",
  "fool.jp",
  "frenchkiss.jp",
  "girlfriend.jp",
  "girly.jp",
  "gloomy.jp",
  "gonna.jp",
  "greater.jp",
  "hacca.jp",
  "heavy.jp",
  "her.jp",
  "hiho.jp",
  "hippy.jp",
  "holy.jp",
  "hungry.jp",
  "icurus.jp",
  "itigo.jp",
  "jellybean.jp",
  "kikirara.jp",
  "kill.jp",
  "kilo.jp",
  "kuron.jp",
  "littlestar.jp",
  "lolipopmc.jp",
  "lolitapunk.jp",
  "lomo.jp",
  "lovepop.jp",
  "lovesick.jp",
  "main.jp",
  "mods.jp",
  "mond.jp",
  "mongolian.jp",
  "moo.jp",
  "namaste.jp",
  "nikita.jp",
  "nobushi.jp",
  "noor.jp",
  "oops.jp",
  "parallel.jp",
  "parasite.jp",
  "pecori.jp",
  "peewee.jp",
  "penne.jp",
  "pepper.jp",
  "perma.jp",
  "pigboat.jp",
  "pinoko.jp",
  "punyu.jp",
  "pupu.jp",
  "pussycat.jp",
  "pya.jp",
  "raindrop.jp",
  "readymade.jp",
  "sadist.jp",
  "schoolbus.jp",
  "secret.jp",
  "staba.jp",
  "stripper.jp",
  "sub.jp",
  "sunnyday.jp",
  "thick.jp",
  "tonkotsu.jp",
  "under.jp",
  "upper.jp",
  "velvet.jp",
  "verse.jp",
  "versus.jp",
  "vivian.jp",
  "watson.jp",
  "weblike.jp",
  "whitesnow.jp",
  "zombie.jp",
  "heteml.net",
  "graphic.design",
  "goip.de",
  "blogspot.ae",
  "blogspot.al",
  "blogspot.am",
  "*.hosted.app",
  "*.run.app",
  "web.app",
  "blogspot.com.ar",
  "blogspot.co.at",
  "blogspot.com.au",
  "blogspot.ba",
  "blogspot.be",
  "blogspot.bg",
  "blogspot.bj",
  "blogspot.com.br",
  "blogspot.com.by",
  "blogspot.ca",
  "blogspot.cf",
  "blogspot.ch",
  "blogspot.cl",
  "blogspot.com.co",
  "*.0emm.com",
  "appspot.com",
  "*.r.appspot.com",
  "blogspot.com",
  "codespot.com",
  "googleapis.com",
  "googlecode.com",
  "pagespeedmobilizer.com",
  "withgoogle.com",
  "withyoutube.com",
  "blogspot.cv",
  "blogspot.com.cy",
  "blogspot.cz",
  "blogspot.de",
  "*.gateway.dev",
  "blogspot.dk",
  "blogspot.com.ee",
  "blogspot.com.eg",
  "blogspot.com.es",
  "blogspot.fi",
  "blogspot.fr",
  "cloud.goog",
  "translate.goog",
  "*.usercontent.goog",
  "blogspot.gr",
  "blogspot.hk",
  "blogspot.hr",
  "blogspot.hu",
  "blogspot.co.id",
  "blogspot.ie",
  "blogspot.co.il",
  "blogspot.in",
  "blogspot.is",
  "blogspot.it",
  "blogspot.jp",
  "blogspot.co.ke",
  "blogspot.kr",
  "blogspot.li",
  "blogspot.lt",
  "blogspot.lu",
  "blogspot.md",
  "blogspot.mk",
  "blogspot.com.mt",
  "blogspot.mx",
  "blogspot.my",
  "cloudfunctions.net",
  "blogspot.com.ng",
  "blogspot.nl",
  "blogspot.no",
  "blogspot.co.nz",
  "blogspot.pe",
  "blogspot.pt",
  "blogspot.qa",
  "blogspot.re",
  "blogspot.ro",
  "blogspot.rs",
  "blogspot.ru",
  "blogspot.se",
  "blogspot.sg",
  "blogspot.si",
  "blogspot.sk",
  "blogspot.sn",
  "blogspot.td",
  "blogspot.com.tr",
  "blogspot.tw",
  "blogspot.ug",
  "blogspot.co.uk",
  "blogspot.com.uy",
  "blogspot.vn",
  "blogspot.co.za",
  "goupile.fr",
  "pymnt.uk",
  "cloudapps.digital",
  "london.cloudapps.digital",
  "gov.nl",
  "grafana-dev.net",
  "grayjayleagues.com",
  "g\xFCnstigbestellen.de",
  "g\xFCnstigliefern.de",
  "fin.ci",
  "free.hr",
  "caa.li",
  "ua.rs",
  "conf.se",
  "h\xE4kkinen.fi",
  "hrsn.dev",
  "hashbang.sh",
  "hasura.app",
  "hasura-app.io",
  "hatenablog.com",
  "hatenadiary.com",
  "hateblo.jp",
  "hatenablog.jp",
  "hatenadiary.jp",
  "hatenadiary.org",
  "pages.it.hs-heilbronn.de",
  "pages-research.it.hs-heilbronn.de",
  "heiyu.space",
  "helioho.st",
  "heliohost.us",
  "hepforge.org",
  "herokuapp.com",
  "herokussl.com",
  "heyflow.page",
  "heyflow.site",
  "ravendb.cloud",
  "ravendb.community",
  "development.run",
  "ravendb.run",
  "homesklep.pl",
  "*.kin.one",
  "*.id.pub",
  "*.kin.pub",
  "secaas.hk",
  "hoplix.shop",
  "orx.biz",
  "biz.gl",
  "biz.ng",
  "co.biz.ng",
  "dl.biz.ng",
  "go.biz.ng",
  "lg.biz.ng",
  "on.biz.ng",
  "col.ng",
  "firm.ng",
  "gen.ng",
  "ltd.ng",
  "ngo.ng",
  "plc.ng",
  "ie.ua",
  "hostyhosting.io",
  "hf.space",
  "static.hf.space",
  "hypernode.io",
  "iobb.net",
  "co.cz",
  "*.moonscale.io",
  "moonscale.net",
  "gr.com",
  "iki.fi",
  "ibxos.it",
  "iliadboxos.it",
  "smushcdn.com",
  "wphostedmail.com",
  "wpmucdn.com",
  "tempurl.host",
  "wpmudev.host",
  "dyn-berlin.de",
  "in-berlin.de",
  "in-brb.de",
  "in-butter.de",
  "in-dsl.de",
  "in-vpn.de",
  "in-dsl.net",
  "in-vpn.net",
  "in-dsl.org",
  "in-vpn.org",
  "biz.at",
  "info.at",
  "info.cx",
  "ac.leg.br",
  "al.leg.br",
  "am.leg.br",
  "ap.leg.br",
  "ba.leg.br",
  "ce.leg.br",
  "df.leg.br",
  "es.leg.br",
  "go.leg.br",
  "ma.leg.br",
  "mg.leg.br",
  "ms.leg.br",
  "mt.leg.br",
  "pa.leg.br",
  "pb.leg.br",
  "pe.leg.br",
  "pi.leg.br",
  "pr.leg.br",
  "rj.leg.br",
  "rn.leg.br",
  "ro.leg.br",
  "rr.leg.br",
  "rs.leg.br",
  "sc.leg.br",
  "se.leg.br",
  "sp.leg.br",
  "to.leg.br",
  "pixolino.com",
  "na4u.ru",
  "apps-1and1.com",
  "live-website.com",
  "apps-1and1.net",
  "websitebuilder.online",
  "app-ionos.space",
  "iopsys.se",
  "*.dweb.link",
  "ipifony.net",
  "ir.md",
  "is-a-good.dev",
  "is-a.dev",
  "iservschule.de",
  "mein-iserv.de",
  "schulplattform.de",
  "schulserver.de",
  "test-iserv.de",
  "iserv.dev",
  "mel.cloudlets.com.au",
  "cloud.interhostsolutions.be",
  "alp1.ae.flow.ch",
  "appengine.flow.ch",
  "es-1.axarnet.cloud",
  "diadem.cloud",
  "vip.jelastic.cloud",
  "jele.cloud",
  "it1.eur.aruba.jenv-aruba.cloud",
  "it1.jenv-aruba.cloud",
  "keliweb.cloud",
  "cs.keliweb.cloud",
  "oxa.cloud",
  "tn.oxa.cloud",
  "uk.oxa.cloud",
  "primetel.cloud",
  "uk.primetel.cloud",
  "ca.reclaim.cloud",
  "uk.reclaim.cloud",
  "us.reclaim.cloud",
  "ch.trendhosting.cloud",
  "de.trendhosting.cloud",
  "jele.club",
  "dopaas.com",
  "paas.hosted-by-previder.com",
  "rag-cloud.hosteur.com",
  "rag-cloud-ch.hosteur.com",
  "jcloud.ik-server.com",
  "jcloud-ver-jpc.ik-server.com",
  "demo.jelastic.com",
  "paas.massivegrid.com",
  "jed.wafaicloud.com",
  "ryd.wafaicloud.com",
  "j.scaleforce.com.cy",
  "jelastic.dogado.eu",
  "fi.cloudplatform.fi",
  "demo.datacenter.fi",
  "paas.datacenter.fi",
  "jele.host",
  "mircloud.host",
  "paas.beebyte.io",
  "sekd1.beebyteapp.io",
  "jele.io",
  "jc.neen.it",
  "jcloud.kz",
  "cloudjiffy.net",
  "fra1-de.cloudjiffy.net",
  "west1-us.cloudjiffy.net",
  "jls-sto1.elastx.net",
  "jls-sto2.elastx.net",
  "jls-sto3.elastx.net",
  "fr-1.paas.massivegrid.net",
  "lon-1.paas.massivegrid.net",
  "lon-2.paas.massivegrid.net",
  "ny-1.paas.massivegrid.net",
  "ny-2.paas.massivegrid.net",
  "sg-1.paas.massivegrid.net",
  "jelastic.saveincloud.net",
  "nordeste-idc.saveincloud.net",
  "j.scaleforce.net",
  "sdscloud.pl",
  "unicloud.pl",
  "mircloud.ru",
  "enscaled.sg",
  "jele.site",
  "jelastic.team",
  "orangecloud.tn",
  "j.layershift.co.uk",
  "phx.enscaled.us",
  "mircloud.us",
  "myjino.ru",
  "*.hosting.myjino.ru",
  "*.landing.myjino.ru",
  "*.spectrum.myjino.ru",
  "*.vps.myjino.ru",
  "jotelulu.cloud",
  "webadorsite.com",
  "jouwweb.site",
  "*.cns.joyent.com",
  "*.triton.zone",
  "js.org",
  "kaas.gg",
  "khplay.nl",
  "kapsi.fi",
  "ezproxy.kuleuven.be",
  "kuleuven.cloud",
  "keymachine.de",
  "kinghost.net",
  "uni5.net",
  "knightpoint.systems",
  "koobin.events",
  "webthings.io",
  "krellian.net",
  "oya.to",
  "git-repos.de",
  "lcube-server.de",
  "svn-repos.de",
  "leadpages.co",
  "lpages.co",
  "lpusercontent.com",
  "lelux.site",
  "libp2p.direct",
  "runcontainers.dev",
  "co.business",
  "co.education",
  "co.events",
  "co.financial",
  "co.network",
  "co.place",
  "co.technology",
  "linkyard-cloud.ch",
  "linkyard.cloud",
  "members.linode.com",
  "*.nodebalancer.linode.com",
  "*.linodeobjects.com",
  "ip.linodeusercontent.com",
  "we.bs",
  "filegear-sg.me",
  "ggff.net",
  "*.user.localcert.dev",
  "lodz.pl",
  "pabianice.pl",
  "plock.pl",
  "sieradz.pl",
  "skierniewice.pl",
  "zgierz.pl",
  "loginline.app",
  "loginline.dev",
  "loginline.io",
  "loginline.services",
  "loginline.site",
  "lohmus.me",
  "servers.run",
  "krasnik.pl",
  "leczna.pl",
  "lubartow.pl",
  "lublin.pl",
  "poniatowa.pl",
  "swidnik.pl",
  "glug.org.uk",
  "lug.org.uk",
  "lugs.org.uk",
  "barsy.bg",
  "barsy.club",
  "barsycenter.com",
  "barsyonline.com",
  "barsy.de",
  "barsy.dev",
  "barsy.eu",
  "barsy.gr",
  "barsy.in",
  "barsy.info",
  "barsy.io",
  "barsy.me",
  "barsy.menu",
  "barsyonline.menu",
  "barsy.mobi",
  "barsy.net",
  "barsy.online",
  "barsy.org",
  "barsy.pro",
  "barsy.pub",
  "barsy.ro",
  "barsy.rs",
  "barsy.shop",
  "barsyonline.shop",
  "barsy.site",
  "barsy.store",
  "barsy.support",
  "barsy.uk",
  "barsy.co.uk",
  "barsyonline.co.uk",
  "*.magentosite.cloud",
  "hb.cldmail.ru",
  "matlab.cloud",
  "modelscape.com",
  "mwcloudnonprod.com",
  "polyspace.com",
  "mayfirst.info",
  "mayfirst.org",
  "mazeplay.com",
  "mcdir.me",
  "mcdir.ru",
  "vps.mcdir.ru",
  "mcpre.ru",
  "mediatech.by",
  "mediatech.dev",
  "hra.health",
  "medusajs.app",
  "miniserver.com",
  "memset.net",
  "messerli.app",
  "atmeta.com",
  "apps.fbsbx.com",
  "*.cloud.metacentrum.cz",
  "custom.metacentrum.cz",
  "flt.cloud.muni.cz",
  "usr.cloud.muni.cz",
  "meteorapp.com",
  "eu.meteorapp.com",
  "co.pl",
  "*.azurecontainer.io",
  "azure-api.net",
  "azure-mobile.net",
  "azureedge.net",
  "azurefd.net",
  "azurestaticapps.net",
  "1.azurestaticapps.net",
  "2.azurestaticapps.net",
  "3.azurestaticapps.net",
  "4.azurestaticapps.net",
  "5.azurestaticapps.net",
  "6.azurestaticapps.net",
  "7.azurestaticapps.net",
  "centralus.azurestaticapps.net",
  "eastasia.azurestaticapps.net",
  "eastus2.azurestaticapps.net",
  "westeurope.azurestaticapps.net",
  "westus2.azurestaticapps.net",
  "azurewebsites.net",
  "cloudapp.net",
  "trafficmanager.net",
  "blob.core.windows.net",
  "servicebus.windows.net",
  "routingthecloud.com",
  "sn.mynetname.net",
  "routingthecloud.net",
  "routingthecloud.org",
  "csx.cc",
  "mydbserver.com",
  "webspaceconfig.de",
  "mittwald.info",
  "mittwaldserver.info",
  "typo3server.info",
  "project.space",
  "modx.dev",
  "bmoattachments.org",
  "net.ru",
  "org.ru",
  "pp.ru",
  "hostedpi.com",
  "caracal.mythic-beasts.com",
  "customer.mythic-beasts.com",
  "fentiger.mythic-beasts.com",
  "lynx.mythic-beasts.com",
  "ocelot.mythic-beasts.com",
  "oncilla.mythic-beasts.com",
  "onza.mythic-beasts.com",
  "sphinx.mythic-beasts.com",
  "vs.mythic-beasts.com",
  "x.mythic-beasts.com",
  "yali.mythic-beasts.com",
  "cust.retrosnub.co.uk",
  "ui.nabu.casa",
  "cloud.nospamproxy.com",
  "netfy.app",
  "netlify.app",
  "4u.com",
  "nfshost.com",
  "ipfs.nftstorage.link",
  "ngo.us",
  "ngrok.app",
  "ngrok-free.app",
  "ngrok.dev",
  "ngrok-free.dev",
  "ngrok.io",
  "ap.ngrok.io",
  "au.ngrok.io",
  "eu.ngrok.io",
  "in.ngrok.io",
  "jp.ngrok.io",
  "sa.ngrok.io",
  "us.ngrok.io",
  "ngrok.pizza",
  "ngrok.pro",
  "torun.pl",
  "nh-serv.co.uk",
  "nimsite.uk",
  "mmafan.biz",
  "myftp.biz",
  "no-ip.biz",
  "no-ip.ca",
  "fantasyleague.cc",
  "gotdns.ch",
  "3utilities.com",
  "blogsyte.com",
  "ciscofreak.com",
  "damnserver.com",
  "ddnsking.com",
  "ditchyourip.com",
  "dnsiskinky.com",
  "dynns.com",
  "geekgalaxy.com",
  "health-carereform.com",
  "homesecuritymac.com",
  "homesecuritypc.com",
  "myactivedirectory.com",
  "mysecuritycamera.com",
  "myvnc.com",
  "net-freaks.com",
  "onthewifi.com",
  "point2this.com",
  "quicksytes.com",
  "securitytactics.com",
  "servebeer.com",
  "servecounterstrike.com",
  "serveexchange.com",
  "serveftp.com",
  "servegame.com",
  "servehalflife.com",
  "servehttp.com",
  "servehumour.com",
  "serveirc.com",
  "servemp3.com",
  "servep2p.com",
  "servepics.com",
  "servequake.com",
  "servesarcasm.com",
  "stufftoread.com",
  "unusualperson.com",
  "workisboring.com",
  "dvrcam.info",
  "ilovecollege.info",
  "no-ip.info",
  "brasilia.me",
  "ddns.me",
  "dnsfor.me",
  "hopto.me",
  "loginto.me",
  "noip.me",
  "webhop.me",
  "bounceme.net",
  "ddns.net",
  "eating-organic.net",
  "mydissent.net",
  "myeffect.net",
  "mymediapc.net",
  "mypsx.net",
  "mysecuritycamera.net",
  "nhlfan.net",
  "no-ip.net",
  "pgafan.net",
  "privatizehealthinsurance.net",
  "redirectme.net",
  "serveblog.net",
  "serveminecraft.net",
  "sytes.net",
  "cable-modem.org",
  "collegefan.org",
  "couchpotatofries.org",
  "hopto.org",
  "mlbfan.org",
  "myftp.org",
  "mysecuritycamera.org",
  "nflfan.org",
  "no-ip.org",
  "read-books.org",
  "ufcfan.org",
  "zapto.org",
  "no-ip.co.uk",
  "golffan.us",
  "noip.us",
  "pointto.us",
  "stage.nodeart.io",
  "*.developer.app",
  "noop.app",
  "*.northflank.app",
  "*.build.run",
  "*.code.run",
  "*.database.run",
  "*.migration.run",
  "noticeable.news",
  "notion.site",
  "dnsking.ch",
  "mypi.co",
  "n4t.co",
  "001www.com",
  "myiphost.com",
  "forumz.info",
  "soundcast.me",
  "tcp4.me",
  "dnsup.net",
  "hicam.net",
  "now-dns.net",
  "ownip.net",
  "vpndns.net",
  "dynserv.org",
  "now-dns.org",
  "x443.pw",
  "now-dns.top",
  "ntdll.top",
  "freeddns.us",
  "nsupdate.info",
  "nerdpol.ovh",
  "nyc.mn",
  "prvcy.page",
  "obl.ong",
  "observablehq.cloud",
  "static.observableusercontent.com",
  "omg.lol",
  "cloudycluster.net",
  "omniwe.site",
  "123webseite.at",
  "123website.be",
  "simplesite.com.br",
  "123website.ch",
  "simplesite.com",
  "123webseite.de",
  "123hjemmeside.dk",
  "123miweb.es",
  "123kotisivu.fi",
  "123siteweb.fr",
  "simplesite.gr",
  "123homepage.it",
  "123website.lu",
  "123website.nl",
  "123hjemmeside.no",
  "service.one",
  "simplesite.pl",
  "123paginaweb.pt",
  "123minsida.se",
  "is-a-fullstack.dev",
  "is-cool.dev",
  "is-not-a.dev",
  "localplayer.dev",
  "is-local.org",
  "opensocial.site",
  "opencraft.hosting",
  "16-b.it",
  "32-b.it",
  "64-b.it",
  "orsites.com",
  "operaunite.com",
  "*.customer-oci.com",
  "*.oci.customer-oci.com",
  "*.ocp.customer-oci.com",
  "*.ocs.customer-oci.com",
  "*.oraclecloudapps.com",
  "*.oraclegovcloudapps.com",
  "*.oraclegovcloudapps.uk",
  "tech.orange",
  "can.re",
  "authgear-staging.com",
  "authgearapps.com",
  "skygearapp.com",
  "outsystemscloud.com",
  "*.hosting.ovh.net",
  "*.webpaas.ovh.net",
  "ownprovider.com",
  "own.pm",
  "*.owo.codes",
  "ox.rs",
  "oy.lc",
  "pgfog.com",
  "pagexl.com",
  "gotpantheon.com",
  "pantheonsite.io",
  "*.paywhirl.com",
  "*.xmit.co",
  "xmit.dev",
  "madethis.site",
  "srv.us",
  "gh.srv.us",
  "gl.srv.us",
  "lk3.ru",
  "mypep.link",
  "perspecta.cloud",
  "on-web.fr",
  "*.upsun.app",
  "upsunapp.com",
  "ent.platform.sh",
  "eu.platform.sh",
  "us.platform.sh",
  "*.platformsh.site",
  "*.tst.site",
  "platter-app.com",
  "platter-app.dev",
  "platterp.us",
  "pley.games",
  "onporter.run",
  "co.bn",
  "postman-echo.com",
  "pstmn.io",
  "mock.pstmn.io",
  "httpbin.org",
  "prequalifyme.today",
  "xen.prgmr.com",
  "priv.at",
  "protonet.io",
  "chirurgiens-dentistes-en-france.fr",
  "byen.site",
  "pubtls.org",
  "pythonanywhere.com",
  "eu.pythonanywhere.com",
  "qa2.com",
  "qcx.io",
  "*.sys.qcx.io",
  "myqnapcloud.cn",
  "alpha-myqnapcloud.com",
  "dev-myqnapcloud.com",
  "mycloudnas.com",
  "mynascloud.com",
  "myqnapcloud.com",
  "qoto.io",
  "qualifioapp.com",
  "ladesk.com",
  "qbuser.com",
  "*.quipelements.com",
  "vapor.cloud",
  "vaporcloud.io",
  "rackmaze.com",
  "rackmaze.net",
  "cloudsite.builders",
  "myradweb.net",
  "servername.us",
  "web.in",
  "in.net",
  "myrdbx.io",
  "site.rb-hosting.io",
  "*.on-rancher.cloud",
  "*.on-k3s.io",
  "*.on-rio.io",
  "ravpage.co.il",
  "readthedocs-hosted.com",
  "readthedocs.io",
  "rhcloud.com",
  "instances.spawn.cc",
  "onrender.com",
  "app.render.com",
  "replit.app",
  "id.replit.app",
  "firewalledreplit.co",
  "id.firewalledreplit.co",
  "repl.co",
  "id.repl.co",
  "replit.dev",
  "archer.replit.dev",
  "bones.replit.dev",
  "canary.replit.dev",
  "global.replit.dev",
  "hacker.replit.dev",
  "id.replit.dev",
  "janeway.replit.dev",
  "kim.replit.dev",
  "kira.replit.dev",
  "kirk.replit.dev",
  "odo.replit.dev",
  "paris.replit.dev",
  "picard.replit.dev",
  "pike.replit.dev",
  "prerelease.replit.dev",
  "reed.replit.dev",
  "riker.replit.dev",
  "sisko.replit.dev",
  "spock.replit.dev",
  "staging.replit.dev",
  "sulu.replit.dev",
  "tarpit.replit.dev",
  "teams.replit.dev",
  "tucker.replit.dev",
  "wesley.replit.dev",
  "worf.replit.dev",
  "repl.run",
  "resindevice.io",
  "devices.resinstaging.io",
  "hzc.io",
  "adimo.co.uk",
  "itcouldbewor.se",
  "aus.basketball",
  "nz.basketball",
  "git-pages.rit.edu",
  "rocky.page",
  "rub.de",
  "ruhr-uni-bochum.de",
  "io.noc.ruhr-uni-bochum.de",
  "\u0431\u0438\u0437.\u0440\u0443\u0441",
  "\u043A\u043E\u043C.\u0440\u0443\u0441",
  "\u043A\u0440\u044B\u043C.\u0440\u0443\u0441",
  "\u043C\u0438\u0440.\u0440\u0443\u0441",
  "\u043C\u0441\u043A.\u0440\u0443\u0441",
  "\u043E\u0440\u0433.\u0440\u0443\u0441",
  "\u0441\u0430\u043C\u0430\u0440\u0430.\u0440\u0443\u0441",
  "\u0441\u043E\u0447\u0438.\u0440\u0443\u0441",
  "\u0441\u043F\u0431.\u0440\u0443\u0441",
  "\u044F.\u0440\u0443\u0441",
  "ras.ru",
  "nyat.app",
  "180r.com",
  "dojin.com",
  "sakuratan.com",
  "sakuraweb.com",
  "x0.com",
  "2-d.jp",
  "bona.jp",
  "crap.jp",
  "daynight.jp",
  "eek.jp",
  "flop.jp",
  "halfmoon.jp",
  "jeez.jp",
  "matrix.jp",
  "mimoza.jp",
  "ivory.ne.jp",
  "mail-box.ne.jp",
  "mints.ne.jp",
  "mokuren.ne.jp",
  "opal.ne.jp",
  "sakura.ne.jp",
  "sumomo.ne.jp",
  "topaz.ne.jp",
  "netgamers.jp",
  "nyanta.jp",
  "o0o0.jp",
  "rdy.jp",
  "rgr.jp",
  "rulez.jp",
  "s3.isk01.sakurastorage.jp",
  "s3.isk02.sakurastorage.jp",
  "saloon.jp",
  "sblo.jp",
  "skr.jp",
  "tank.jp",
  "uh-oh.jp",
  "undo.jp",
  "rs.webaccel.jp",
  "user.webaccel.jp",
  "websozai.jp",
  "xii.jp",
  "squares.net",
  "jpn.org",
  "kirara.st",
  "x0.to",
  "from.tv",
  "sakura.tv",
  "*.builder.code.com",
  "*.dev-builder.code.com",
  "*.stg-builder.code.com",
  "*.001.test.code-builder-stg.platform.salesforce.com",
  "*.d.crm.dev",
  "*.w.crm.dev",
  "*.wa.crm.dev",
  "*.wb.crm.dev",
  "*.wc.crm.dev",
  "*.wd.crm.dev",
  "*.we.crm.dev",
  "*.wf.crm.dev",
  "sandcats.io",
  "logoip.com",
  "logoip.de",
  "fr-par-1.baremetal.scw.cloud",
  "fr-par-2.baremetal.scw.cloud",
  "nl-ams-1.baremetal.scw.cloud",
  "cockpit.fr-par.scw.cloud",
  "fnc.fr-par.scw.cloud",
  "functions.fnc.fr-par.scw.cloud",
  "k8s.fr-par.scw.cloud",
  "nodes.k8s.fr-par.scw.cloud",
  "s3.fr-par.scw.cloud",
  "s3-website.fr-par.scw.cloud",
  "whm.fr-par.scw.cloud",
  "priv.instances.scw.cloud",
  "pub.instances.scw.cloud",
  "k8s.scw.cloud",
  "cockpit.nl-ams.scw.cloud",
  "k8s.nl-ams.scw.cloud",
  "nodes.k8s.nl-ams.scw.cloud",
  "s3.nl-ams.scw.cloud",
  "s3-website.nl-ams.scw.cloud",
  "whm.nl-ams.scw.cloud",
  "cockpit.pl-waw.scw.cloud",
  "k8s.pl-waw.scw.cloud",
  "nodes.k8s.pl-waw.scw.cloud",
  "s3.pl-waw.scw.cloud",
  "s3-website.pl-waw.scw.cloud",
  "scalebook.scw.cloud",
  "smartlabeling.scw.cloud",
  "dedibox.fr",
  "schokokeks.net",
  "gov.scot",
  "service.gov.scot",
  "scrysec.com",
  "client.scrypted.io",
  "firewall-gateway.com",
  "firewall-gateway.de",
  "my-gateway.de",
  "my-router.de",
  "spdns.de",
  "spdns.eu",
  "firewall-gateway.net",
  "my-firewall.org",
  "myfirewall.org",
  "spdns.org",
  "seidat.net",
  "sellfy.store",
  "minisite.ms",
  "senseering.net",
  "servebolt.cloud",
  "biz.ua",
  "co.ua",
  "pp.ua",
  "as.sh.cn",
  "sheezy.games",
  "shiftedit.io",
  "myshopblocks.com",
  "myshopify.com",
  "shopitsite.com",
  "shopware.shop",
  "shopware.store",
  "mo-siemens.io",
  "1kapp.com",
  "appchizi.com",
  "applinzi.com",
  "sinaapp.com",
  "vipsinaapp.com",
  "siteleaf.net",
  "small-web.org",
  "aeroport.fr",
  "avocat.fr",
  "chambagri.fr",
  "chirurgiens-dentistes.fr",
  "experts-comptables.fr",
  "medecin.fr",
  "notaires.fr",
  "pharmacien.fr",
  "port.fr",
  "veterinaire.fr",
  "vp4.me",
  "*.snowflake.app",
  "*.privatelink.snowflake.app",
  "streamlit.app",
  "streamlitapp.com",
  "try-snowplow.com",
  "mafelo.net",
  "playstation-cloud.com",
  "srht.site",
  "apps.lair.io",
  "*.stolos.io",
  "spacekit.io",
  "ind.mom",
  "customer.speedpartner.de",
  "myspreadshop.at",
  "myspreadshop.com.au",
  "myspreadshop.be",
  "myspreadshop.ca",
  "myspreadshop.ch",
  "myspreadshop.com",
  "myspreadshop.de",
  "myspreadshop.dk",
  "myspreadshop.es",
  "myspreadshop.fi",
  "myspreadshop.fr",
  "myspreadshop.ie",
  "myspreadshop.it",
  "myspreadshop.net",
  "myspreadshop.nl",
  "myspreadshop.no",
  "myspreadshop.pl",
  "myspreadshop.se",
  "myspreadshop.co.uk",
  "w-corp-staticblitz.com",
  "w-credentialless-staticblitz.com",
  "w-staticblitz.com",
  "stackhero-network.com",
  "runs.onstackit.cloud",
  "stackit.gg",
  "stackit.rocks",
  "stackit.run",
  "stackit.zone",
  "musician.io",
  "novecore.site",
  "api.stdlib.com",
  "feedback.ac",
  "forms.ac",
  "assessments.cx",
  "calculators.cx",
  "funnels.cx",
  "paynow.cx",
  "quizzes.cx",
  "researched.cx",
  "tests.cx",
  "surveys.so",
  "storebase.store",
  "storipress.app",
  "storj.farm",
  "strapiapp.com",
  "media.strapiapp.com",
  "vps-host.net",
  "atl.jelastic.vps-host.net",
  "njs.jelastic.vps-host.net",
  "ric.jelastic.vps-host.net",
  "streak-link.com",
  "streaklinks.com",
  "streakusercontent.com",
  "soc.srcf.net",
  "user.srcf.net",
  "utwente.io",
  "temp-dns.com",
  "supabase.co",
  "supabase.in",
  "supabase.net",
  "syncloud.it",
  "dscloud.biz",
  "direct.quickconnect.cn",
  "dsmynas.com",
  "familyds.com",
  "diskstation.me",
  "dscloud.me",
  "i234.me",
  "myds.me",
  "synology.me",
  "dscloud.mobi",
  "dsmynas.net",
  "familyds.net",
  "dsmynas.org",
  "familyds.org",
  "direct.quickconnect.to",
  "vpnplus.to",
  "mytabit.com",
  "mytabit.co.il",
  "tabitorder.co.il",
  "taifun-dns.de",
  "ts.net",
  "*.c.ts.net",
  "gda.pl",
  "gdansk.pl",
  "gdynia.pl",
  "med.pl",
  "sopot.pl",
  "taveusercontent.com",
  "p.tawk.email",
  "p.tawkto.email",
  "site.tb-hosting.com",
  "edugit.io",
  "s3.teckids.org",
  "telebit.app",
  "telebit.io",
  "*.telebit.xyz",
  "*.firenet.ch",
  "*.svc.firenet.ch",
  "reservd.com",
  "thingdustdata.com",
  "cust.dev.thingdust.io",
  "reservd.dev.thingdust.io",
  "cust.disrec.thingdust.io",
  "reservd.disrec.thingdust.io",
  "cust.prod.thingdust.io",
  "cust.testing.thingdust.io",
  "reservd.testing.thingdust.io",
  "tickets.io",
  "arvo.network",
  "azimuth.network",
  "tlon.network",
  "torproject.net",
  "pages.torproject.net",
  "townnews-staging.com",
  "12hp.at",
  "2ix.at",
  "4lima.at",
  "lima-city.at",
  "12hp.ch",
  "2ix.ch",
  "4lima.ch",
  "lima-city.ch",
  "trafficplex.cloud",
  "de.cool",
  "12hp.de",
  "2ix.de",
  "4lima.de",
  "lima-city.de",
  "1337.pictures",
  "clan.rip",
  "lima-city.rocks",
  "webspace.rocks",
  "lima.zone",
  "*.transurl.be",
  "*.transurl.eu",
  "site.transip.me",
  "*.transurl.nl",
  "tuxfamily.org",
  "dd-dns.de",
  "dray-dns.de",
  "draydns.de",
  "dyn-vpn.de",
  "dynvpn.de",
  "mein-vigor.de",
  "my-vigor.de",
  "my-wan.de",
  "syno-ds.de",
  "synology-diskstation.de",
  "synology-ds.de",
  "diskstation.eu",
  "diskstation.org",
  "typedream.app",
  "pro.typeform.com",
  "*.uberspace.de",
  "uber.space",
  "hk.com",
  "inc.hk",
  "ltd.hk",
  "hk.org",
  "it.com",
  "unison-services.cloud",
  "virtual-user.de",
  "virtualuser.de",
  "name.pm",
  "sch.tf",
  "biz.wf",
  "sch.wf",
  "org.yt",
  "rs.ba",
  "bielsko.pl",
  "upli.io",
  "urown.cloud",
  "dnsupdate.info",
  "us.org",
  "v.ua",
  "express.val.run",
  "web.val.run",
  "vercel.app",
  "v0.build",
  "vercel.dev",
  "vusercontent.net",
  "now.sh",
  "2038.io",
  "router.management",
  "v-info.info",
  "voorloper.cloud",
  "*.vultrobjects.com",
  "wafflecell.com",
  "webflow.io",
  "webflowtest.io",
  "*.webhare.dev",
  "bookonline.app",
  "hotelwithflight.com",
  "reserve-online.com",
  "reserve-online.net",
  "cprapid.com",
  "pleskns.com",
  "wp2.host",
  "pdns.page",
  "plesk.page",
  "wpsquared.site",
  "*.wadl.top",
  "remotewd.com",
  "box.ca",
  "pages.wiardweb.com",
  "toolforge.org",
  "wmcloud.org",
  "wmflabs.org",
  "wdh.app",
  "panel.gg",
  "daemon.panel.gg",
  "wixsite.com",
  "wixstudio.com",
  "editorx.io",
  "wixstudio.io",
  "wix.run",
  "messwithdns.com",
  "woltlab-demo.com",
  "myforum.community",
  "community-pro.de",
  "diskussionsbereich.de",
  "community-pro.net",
  "meinforum.net",
  "affinitylottery.org.uk",
  "raffleentry.org.uk",
  "weeklylottery.org.uk",
  "wpenginepowered.com",
  "js.wpenginepowered.com",
  "half.host",
  "xnbay.com",
  "u2.xnbay.com",
  "u2-local.xnbay.com",
  "cistron.nl",
  "demon.nl",
  "xs4all.space",
  "yandexcloud.net",
  "storage.yandexcloud.net",
  "website.yandexcloud.net",
  "official.academy",
  "yolasite.com",
  "yombo.me",
  "ynh.fr",
  "nohost.me",
  "noho.st",
  "za.net",
  "za.org",
  "zap.cloud",
  "zeabur.app",
  "bss.design",
  "basicserver.io",
  "virtualserver.io",
  "enterprisecloud.nu"
];
var Q = K.reduce(
  (e, s) => {
    const c = s.replace(/^(\*\.|\!)/, ""), o = A.toASCII(c), t = s.charAt(0);
    if (e.has(o))
      throw new Error(`Multiple rules found for ${s} (${o})`);
    return e.set(o, {
      rule: s,
      suffix: c,
      punySuffix: o,
      wildcard: t === "*",
      exception: t === "!"
    }), e;
  },
  /* @__PURE__ */ new Map()
);
var X = (e) => {
  const c = A.toASCII(e).split(".");
  for (let o = 0; o < c.length; o++) {
    const t = c.slice(o).join("."), d = Q.get(t);
    if (d)
      return d;
  }
  return null;
};
var Y = {
  DOMAIN_TOO_SHORT: "Domain name too short.",
  DOMAIN_TOO_LONG: "Domain name too long. It should be no more than 255 chars.",
  LABEL_STARTS_WITH_DASH: "Domain name label can not start with a dash.",
  LABEL_ENDS_WITH_DASH: "Domain name label can not end with a dash.",
  LABEL_TOO_LONG: "Domain name label should be at most 63 chars long.",
  LABEL_TOO_SHORT: "Domain name label should be at least 1 character long.",
  LABEL_INVALID_CHARS: "Domain name label can only contain alphanumeric characters or dashes."
};
var Z = (e) => {
  const s = A.toASCII(e);
  if (s.length < 1)
    return "DOMAIN_TOO_SHORT";
  if (s.length > 255)
    return "DOMAIN_TOO_LONG";
  const c = s.split(".");
  let o;
  for (let t = 0; t < c.length; ++t) {
    if (o = c[t], !o.length)
      return "LABEL_TOO_SHORT";
    if (o.length > 63)
      return "LABEL_TOO_LONG";
    if (o.charAt(0) === "-")
      return "LABEL_STARTS_WITH_DASH";
    if (o.charAt(o.length - 1) === "-")
      return "LABEL_ENDS_WITH_DASH";
    if (!/^[a-z0-9\-_]+$/.test(o))
      return "LABEL_INVALID_CHARS";
  }
};
var O = (e) => {
  if (typeof e != "string")
    throw new TypeError("Domain name must be a string.");
  let s = e.slice(0).toLowerCase();
  s.charAt(s.length - 1) === "." && (s = s.slice(0, s.length - 1));
  const c = Z(s);
  if (c)
    return {
      input: e,
      error: {
        message: Y[c],
        code: c
      }
    };
  const o = {
    input: e,
    tld: null,
    sld: null,
    domain: null,
    subdomain: null,
    listed: false
  }, t = s.split(".");
  if (t[t.length - 1] === "local")
    return o;
  const d = () => (/xn--/.test(s) && (o.domain && (o.domain = A.toASCII(o.domain)), o.subdomain && (o.subdomain = A.toASCII(o.subdomain))), o), z = X(s);
  if (!z)
    return t.length < 2 ? o : (o.tld = t.pop(), o.sld = t.pop(), o.domain = [o.sld, o.tld].join("."), t.length && (o.subdomain = t.pop()), d());
  o.listed = true;
  const y = z.suffix.split("."), g2 = t.slice(0, t.length - y.length);
  return z.exception && g2.push(y.shift()), o.tld = y.join("."), !g2.length || (z.wildcard && (y.unshift(g2.pop()), o.tld = y.join(".")), !g2.length) || (o.sld = g2.pop(), o.domain = [o.sld, o.tld].join("."), g2.length && (o.subdomain = g2.join("."))), d();
};
var aa = (e) => e && O(e).domain || null;
var oa = (e) => {
  const s = O(e);
  return !!(s.domain && s.listed);
};
var na = { parse: O, get: aa, isValid: oa };

// node_modules/@bric/rex-core/src/extension.mts
var import_jquery = __toESM(require_jquery(), 1);
var REXExtensionModule = class _REXExtensionModule {
  constructor() {
    __publicField(this, "instantiationTarget");
    if (new.target === _REXExtensionModule) {
      throw new Error("Cannot be instantiated");
    }
    this.instantiationTarget = new.target.toString();
  }
  setup() {
    console.log(`[REXExtensionModule] TODO: Implement in ${this.instantiationTarget}...`);
  }
  async checkRequirement(requirement) {
    return new Promise((resolve) => {
      resolve(false);
    });
  }
  activateInterface(uiDefinition) {
    return false;
  }
  fetchHtmlInterface(identifier) {
    return null;
  }
};
var registeredExtensionModules2 = [];
function registerREXModule2(rexModule) {
  if (!registeredExtensionModules2.includes(rexModule)) {
    registeredExtensionModules2.push(rexModule);
    rexModule.setup();
  }
}
var rexCorePlugin2 = {
  interface: {
    identifier: "",
    title: "",
    depends_on: [""]
  },
  loadInitialConfigation: async function(configPath) {
    return new Promise((resolve, reject) => {
      let configUrl = configPath;
      if (!configPath.toLowerCase().startsWith("http:") && !configPath.toLowerCase().startsWith("https://")) {
        configUrl = globalThis.chrome.runtime.getURL(configPath);
      }
      fetch(configUrl, { signal: AbortSignal.timeout(12e4) }).then((response) => {
        if (response.ok) {
          response.json().then((jsonData) => {
            globalThis.chrome.runtime.sendMessage({
              "messageType": "loadInitialConfiguration",
              "configuration": jsonData
            }).then((response2) => {
              if (response2.toLowerCase().startsWith("error")) {
                reject(`Received error from service worker: ${response2}`);
              } else {
                resolve(response2);
              }
            });
          });
        } else {
          reject(`Received error status: ${response.statusText}`);
        }
      }, (reason) => {
        reject(`${reason}`);
      });
    });
  },
  validateInterface: async function(uiDefinition) {
    return new Promise((resolve, reject) => {
      const requirements = [];
      if (uiDefinition["depends_on"] !== void 0) {
        requirements.push(...uiDefinition["depends_on"]);
      }
      console.log("requirements");
      console.log(requirements);
      console.log(uiDefinition);
      for (const requirement of requirements) {
        for (const extensionModule of registeredExtensionModules2) {
          if (extensionModule.checkRequirement !== void 0) {
            extensionModule.checkRequirement(requirement).then((isFulfilled) => {
              while (isFulfilled && requirements.includes(requirement)) {
                const index = requirements.indexOf(requirement);
                requirements.splice(index, 1);
              }
            });
          }
        }
      }
      window.setTimeout(function() {
        if (requirements.length == 0) {
          console.log("ready!");
          console.log(uiDefinition);
          resolve();
        } else {
          reject(`Unfulfilled requirements: ${requirements}...`);
        }
      }, 500);
    });
  },
  fetchCurrentInterface: async function() {
    return new Promise((resolve) => {
      globalThis.chrome.runtime.sendMessage({
        "messageType": "fetchConfiguration"
      }).then((response) => {
        const configuration = response;
        console.log("configuration");
        console.log(configuration);
        for (const uiDefinition of configuration.ui) {
          rexCorePlugin2.validateInterface(uiDefinition).then(() => {
            resolve(uiDefinition);
          }, (reason) => {
            console.log(`Interface "${uiDefinition.identifier} invalid: ${reason}`);
          });
        }
      });
    });
  },
  refreshInterface: () => {
    rexCorePlugin2.fetchCurrentInterface().then((response) => {
      const uiDefinition = response;
      console.log(`TEST ${rexCorePlugin2.interface.identifier} =? ${uiDefinition.identifier}`);
      if (rexCorePlugin2.interface.identifier !== uiDefinition.identifier) {
        rexCorePlugin2.interface = uiDefinition;
        rexCorePlugin2.loadInterface(rexCorePlugin2.interface);
      }
    });
  },
  loadInterface: (uiDefinition) => {
    document.title = uiDefinition.title;
    const contentElement = document.getElementById("rex-content");
    if (uiDefinition["load_dynamic"]) {
      let htmlText = null;
      for (const extensionModule of registeredExtensionModules2) {
        const content = extensionModule.fetchHtmlInterface(uiDefinition.identifier);
        console.log(`fetchHtmlInterface[${extensionModule}]: ${content}`);
        if (content !== null) {
          htmlText = content;
        }
      }
      if (htmlText !== null) {
        if (contentElement !== null) {
          contentElement.innerHTML = htmlText;
        }
        let activated = false;
        for (const extensionModule of registeredExtensionModules2) {
          if (extensionModule.activateInterface !== void 0) {
            if (extensionModule.activateInterface(uiDefinition)) {
              activated = true;
            }
          }
        }
        if (activated === false && contentElement !== null) {
          contentElement.innerHTML = `Unable to find module to activate ${uiDefinition.identifier}...`;
        }
      }
    } else {
      const templateUrl = globalThis.chrome.runtime.getURL(`interfaces/${uiDefinition.identifier}.html`);
      console.log(`loadInterface: ${templateUrl}`);
      fetch(templateUrl).then((response) => {
        if (response.ok) {
          response.text().then((htmlText) => {
            let activated = false;
            if (contentElement !== null) {
              contentElement.innerHTML = htmlText;
            }
            for (const extensionModule of registeredExtensionModules2) {
              if (extensionModule.activateInterface !== void 0) {
                if (extensionModule.activateInterface(uiDefinition)) {
                  activated = true;
                }
              }
            }
            if (activated === false && contentElement !== null) {
              contentElement.innerHTML = `Unable to find module to activate ${templateUrl}...`;
            }
          });
        } else {
          if (contentElement !== null) {
            contentElement.innerHTML = `Error loading template file at ${templateUrl}...`;
          }
        }
      }, (reason) => {
        if (contentElement !== null) {
          contentElement.innerHTML = `Error loading template file at ${templateUrl}: ${reason}...`;
        }
      });
    }
  },
  setIdentifier: async (identifier) => {
    return new Promise((resolve) => {
      globalThis.chrome.runtime.sendMessage({
        "messageType": "setIdentifier",
        "identifier": identifier
      }).then(() => {
        resolve();
      });
    });
  },
  showError: (title, message) => {
    alert(`${title}

${message}`);
  }
};
var REXCoreIdentifierExtensionModule = class extends REXExtensionModule {
  setup() {
  }
  async validateIdentifier(identifier) {
    return new Promise((resolve, reject) => {
      globalThis.chrome.runtime.sendMessage({
        "messageType": "fetchConfiguration"
      }).then((response) => {
        const configuration = response;
        console.log("configuration");
        console.log(configuration);
        const configUrlStr = configuration["configuration_url"];
        const configUrl = new URL(configUrlStr.replaceAll("<IDENTIFIER>", identifier));
        fetch(configUrl).then((response2) => {
          if (response2.ok) {
            response2.json().then((jsonData) => {
              console.log(`${configUrl}:`);
              console.log(jsonData);
              globalThis.chrome.runtime.sendMessage({
                "messageType": "updateConfiguration",
                "configuration": jsonData
              }).then((response3) => {
                if (response3.toLowerCase().startsWith("error")) {
                  reject(`Received error from service worker: ${response3}`);
                } else {
                  resolve(identifier);
                }
              });
            });
          } else {
            reject(`Received error status: ${response2.statusText}`);
          }
        }, (reason) => {
          reject(`${reason}`);
        });
      });
    });
  }
  activateInterface(uiDefinition) {
    console.log("activateInterface");
    console.log(uiDefinition);
    if (uiDefinition.identifier == "identifier") {
      (0, import_jquery.default)("#coreSaveIdentifier").off("click");
      (0, import_jquery.default)("#coreSaveIdentifier").on("click", () => {
        const identifier = (0, import_jquery.default)('input[type="text"]').val();
        this.validateIdentifier(identifier).then((finalIdentifier) => {
          rexCorePlugin2.setIdentifier(finalIdentifier).then(() => {
            rexCorePlugin2.refreshInterface();
          });
        }, (message) => {
          alert(message);
        });
      });
      globalThis.chrome.runtime.sendMessage({
        "messageType": "getIdentifier"
      }).then((identifier) => {
        (0, import_jquery.default)('input[type="text"]').val(identifier);
      });
      return true;
    }
    return false;
  }
  async checkRequirement(requirement) {
    return new Promise((resolve) => {
      console.log(`REXCoreIdentifierExtensionModule.checkRequirement: ${requirement}`);
      if (requirement === "has_identifier") {
        globalThis.chrome.runtime.sendMessage({ "messageType": "getIdentifier" }).then((identifier) => {
          console.log(`identifier: ${identifier}`);
          console.log(
            identifier
          );
          if ([null, void 0].includes(identifier) || identifier.length == 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(false);
      }
    });
  }
};
registerREXModule2(new REXCoreIdentifierExtensionModule());

// node_modules/@bric/rex-lists/src/list-utilities.mts
function normalizeLeadingWww(host) {
  return host.toLowerCase().replace(/^www\./, "");
}
function isStrictRegisteredDomain(pattern) {
  const candidate = normalizeLeadingWww(pattern.trim());
  if (candidate.includes("://") || candidate.includes("/")) return false;
  const parsed = na.parse(candidate);
  if (parsed.error !== void 0) return false;
  const domain = parsed.domain;
  if (!domain) return false;
  return candidate === domain;
}
var DB_NAME = "webmunk_lists";
var DB_VERSION = 3;
var STORE_NAME = "list_entries";
async function initializeListDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => {
      reject(new Error(`Failed to open database: ${request.error?.message}`));
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true
        });
      }
      const transaction = event.target.transaction;
      if (!transaction) return;
      const objectStore = transaction.objectStore(STORE_NAME);
      if (!objectStore.indexNames.contains("list_name")) {
        objectStore.createIndex("list_name", "list_name", { unique: false });
      }
      if (!objectStore.indexNames.contains("domain")) {
        objectStore.createIndex("domain", "domain", { unique: false });
      }
      if (!objectStore.indexNames.contains("source")) {
        objectStore.createIndex("source", "source", { unique: false });
      }
      if (!objectStore.indexNames.contains("list_name_source")) {
        objectStore.createIndex("list_name_source", ["list_name", "source"], { unique: false });
      }
      if (objectStore.indexNames.contains("list_name_domain")) {
        objectStore.deleteIndex("list_name_domain");
      }
      objectStore.createIndex("list_name_domain", ["list_name", "domain"], { unique: false });
      if (objectStore.indexNames.contains("list_name_pattern_type_domain")) {
        objectStore.deleteIndex("list_name_pattern_type_domain");
      }
      objectStore.createIndex(
        "list_name_pattern_type_domain",
        ["list_name", "pattern_type", "domain"],
        { unique: true }
      );
      console.log("[list-utilities] Ensured object store and indexes");
    };
  });
}
async function getDatabase() {
  return initializeListDatabase();
}
async function getListEntries(listName) {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("list_name");
    const request = index.getAll(listName);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(new Error(`Failed to get list entries: ${request.error?.message}`));
    };
  });
}
async function deleteAllEntriesInList(listName, sourceFilter) {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(new Error(`Failed to delete list entries (tx): ${transaction.error?.message}`));
    };
    if (sourceFilter) {
      const index = store.index("list_name_source");
      const request = index.openCursor(IDBKeyRange.only([listName, sourceFilter]));
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      request.onerror = () => {
        reject(new Error(`Failed to delete list entries: ${request.error?.message}`));
      };
    } else {
      const index = store.index("list_name");
      const request = index.openCursor(IDBKeyRange.only(listName));
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      request.onerror = () => {
        reject(new Error(`Failed to delete list entries: ${request.error?.message}`));
      };
    }
  });
}
async function findListEntryByPattern(listName, patternType, domain) {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("list_name_pattern_type_domain");
    const request = index.get([listName, patternType, domain]);
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    request.onerror = () => {
      reject(new Error(`Failed to find entry: ${request.error?.message}`));
    };
  });
}
async function matchDomainAgainstList(url, listName) {
  const entries = await getListEntries(listName);
  for (const entry of entries) {
    if (matchesPattern(url, entry.domain, entry.pattern_type)) {
      return entry;
    }
  }
  return null;
}
async function bulkCreateListEntries(entries) {
  const db = await getDatabase();
  const uniqueKeys = /* @__PURE__ */ new Set();
  const duplicatesInArray = [];
  entries.forEach((entry, index) => {
    const key = `${entry.list_name}:${entry.pattern_type}:${entry.domain}`;
    if (uniqueKeys.has(key)) {
      duplicatesInArray.push({ index, key });
    }
    uniqueKeys.add(key);
  });
  if (duplicatesInArray.length > 0) {
    console.error("[list-utilities] Duplicate entries detected in bulk insert array:", duplicatesInArray);
    return Promise.reject(new Error(`Duplicate entries in array: ${duplicatesInArray.map((d) => `[${d.index}]${d.key}`).join(", ")}`));
  }
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const ids = [];
    let completed = 0;
    let skipped = 0;
    entries.forEach((entry, index) => {
      const entryWithTimestamps = {
        ...entry,
        metadata: {
          ...entry.metadata,
          created_at: entry.metadata.created_at || Date.now(),
          updated_at: Date.now()
        }
      };
      const request = store.add(entryWithTimestamps);
      request.onsuccess = () => {
        ids.push(request.result);
        completed++;
        if (completed + skipped === entries.length) {
          if (skipped > 0) {
            console.warn(`[list-utilities] Bulk insert completed with ${skipped} skipped duplicates`);
          }
          resolve(ids);
        }
      };
      request.onerror = (event) => {
        if (request.error?.name === "ConstraintError") {
          event.preventDefault();
          skipped++;
          console.warn(
            `[list-utilities] Skipping duplicate entry at index ${index} (${entry.list_name}:${entry.pattern_type}:${entry.domain})`
          );
          if (completed + skipped === entries.length) {
            console.warn(`[list-utilities] Bulk insert completed with ${skipped} skipped duplicates`);
            resolve(ids);
          }
        } else {
          const errorDetails = {
            list_name: entry.list_name,
            pattern_type: entry.pattern_type,
            domain: entry.domain,
            source: entry.source,
            index,
            error: request.error?.message
          };
          console.error("[list-utilities] Bulk insert failed at entry:", errorDetails);
          reject(new Error(`Failed to create bulk entry at index ${index} (${entry.list_name}:${entry.pattern_type}:${entry.domain}): ${request.error?.message}`));
        }
      };
    });
    if (entries.length === 0) {
      resolve([]);
    }
  });
}
async function bulkDeleteListEntries(ids) {
  if (ids.length === 0) {
    return Promise.resolve();
  }
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(new Error(`Failed to delete entries (tx): ${transaction.error?.message}`));
    };
    ids.forEach((id) => {
      const request = store.delete(id);
      request.onerror = () => {
        reject(new Error(`Failed to delete entry ${id}: ${request.error?.message}`));
      };
    });
  });
}
async function parseAndSyncLists(listsConfig) {
  const listNames = Object.keys(listsConfig);
  console.log(`[list-utilities] Syncing ${listNames.length} lists`);
  for (const listName of listNames) {
    const entries = listsConfig[listName];
    if (!Array.isArray(entries)) {
      console.warn(`[list-utilities] Invalid entries for list ${listName}, skipping`);
      continue;
    }
    try {
      await mergeBackendList(listName, entries);
      console.log(`[list-utilities] Synced list: ${listName} (${entries.length} entries)`);
    } catch (error) {
      console.error(`[list-utilities] Failed to sync list ${listName}:`, error);
    }
  }
}
async function mergeBackendList(listName, entries) {
  console.log(`[list-utilities] Merging backend list: ${listName}`);
  try {
    await deleteAllEntriesInList(listName, "backend");
    console.log(`[list-utilities] Cleared existing backend entries for: ${listName}`);
  } catch (error) {
    console.error(`[list-utilities] Failed to clear backend entries for ${listName}:`, error);
    throw error;
  }
  const entriesToDelete = [];
  for (const entry of entries) {
    try {
      const domain = entry?.domain;
      const patternType = entry?.pattern_type;
      if (typeof domain !== "string" || domain.length === 0) continue;
      if (!patternType) continue;
      const existing = await findListEntryByPattern(listName, patternType, domain);
      if (existing?.id !== void 0) {
        entriesToDelete.push(existing.id);
        console.log(
          `[list-utilities] Found conflicting entry for ${listName}:${patternType}:${domain} (source=${existing.source ?? "unknown"}) - will delete`
        );
      }
    } catch (error) {
      console.error(`[list-utilities] Failed checking conflict for list ${listName}:`, error);
    }
  }
  if (entriesToDelete.length > 0) {
    try {
      await bulkDeleteListEntries(entriesToDelete);
      console.log(`[list-utilities] Deleted ${entriesToDelete.length} conflicting entries for ${listName}`);
    } catch (error) {
      console.error(`[list-utilities] Failed to delete conflicting entries:`, error);
      throw new Error(`Failed to clear conflicts before sync: ${error instanceof Error ? error.message : "unknown"}`);
    }
  }
  const newEntries = [];
  for (const entry of entries) {
    const domain = entry?.domain;
    const patternType = entry?.pattern_type;
    if (typeof domain !== "string" || domain.length === 0 || !patternType) {
      console.warn(`[list-utilities] Skipping invalid backend list entry (missing domain/pattern_type) for ${listName}:`, entry);
      continue;
    }
    if (patternType === "domain" && !isStrictRegisteredDomain(domain)) {
      console.error(
        `[list-utilities] Invalid backend 'domain' pattern "${domain}" in list "${listName}". This would be misleading/broad. Use a registered domain like "google.com", or pattern_type "host"/"regex" for subdomains. Skipping entry.`
      );
      continue;
    }
    newEntries.push({
      list_name: listName,
      domain,
      pattern_type: patternType,
      source: "backend",
      metadata: {
        ...entry?.metadata ?? {},
        sync_timestamp: Date.now()
      }
    });
  }
  if (newEntries.length > 0) {
    await bulkCreateListEntries(newEntries);
    console.log(`[list-utilities] Inserted ${newEntries.length} backend entries for: ${listName}`);
  }
}
function matchesPattern(url, pattern, patternType) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    switch (patternType) {
      case "domain": {
        if (!isStrictRegisteredDomain(pattern)) {
          console.warn(
            `[list-utilities] Invalid 'domain' pattern "${pattern}". Use a registered domain like "google.com", or use pattern_type "host"/"regex" for subdomains.`
          );
          return false;
        }
        const urlParsed = na.parse(hostname);
        if (urlParsed.error !== void 0) return false;
        const urlDomain = urlParsed.domain;
        if (!urlDomain) return false;
        return urlDomain === normalizeLeadingWww(pattern.trim());
      }
      case "host": {
        const urlHostNormalized = normalizeLeadingWww(hostname);
        let patternHost = pattern;
        if (pattern.includes("://")) {
          patternHost = new URL(pattern).hostname;
        } else if (pattern.includes("/")) {
          patternHost = pattern.split("/")[0] ?? "";
        }
        const patternHostNormalized = normalizeLeadingWww(patternHost);
        if (!patternHostNormalized) return false;
        return urlHostNormalized === patternHostNormalized;
      }
      case "exact_url": {
        return url === pattern;
      }
      case "host_path_prefix": {
        const urlHostNormalized = normalizeLeadingWww(hostname);
        const urlPath = urlObj.pathname;
        let patternHost = "";
        let patternPath = "";
        if (pattern.includes("://")) {
          const patternUrl = new URL(pattern);
          patternHost = patternUrl.hostname;
          patternPath = patternUrl.pathname;
        } else {
          const firstSlashIdx = pattern.indexOf("/");
          if (firstSlashIdx === -1) {
            return false;
          }
          patternHost = pattern.slice(0, firstSlashIdx);
          patternPath = pattern.slice(firstSlashIdx);
        }
        const patternHostNormalized = normalizeLeadingWww(patternHost);
        if (!patternHostNormalized || urlHostNormalized !== patternHostNormalized) {
          return false;
        }
        if (!patternPath.startsWith("/")) {
          patternPath = "/" + patternPath;
        }
        if (urlPath.startsWith(patternPath)) {
          return true;
        }
        if (patternPath.endsWith("/")) {
          const withoutTrailingSlash = patternPath.slice(0, -1);
          return urlPath === withoutTrailingSlash;
        }
        return false;
      }
      case "regex": {
        try {
          return new RegExp(pattern).test(url);
        } catch (regexError) {
          console.error("[list-utilities] Invalid regex pattern:", pattern, regexError);
          return false;
        }
      }
      default:
        console.warn("[list-utilities] Unknown pattern type:", patternType);
        return false;
    }
  } catch (error) {
    console.error("[list-utilities] Error matching pattern:", error);
    return false;
  }
}

// src/service-worker.mts
var _HistoryServiceWorkerModule = class _HistoryServiceWorkerModule extends REXServiceWorkerModule {
  constructor() {
    super();
    __publicField(this, "config", null);
    __publicField(this, "status", {
      itemsCollected: 0,
      isCollecting: false
    });
  }
  moduleName() {
    return "HistoryServiceWorkerModule";
  }
  /**
   * Check if user identifier has been set.
   * History collection should not start until an identifier exists.
   */
  async hasIdentifier() {
    try {
      const result = await globalThis.chrome.storage.local.get("rexIdentifier");
      const identifier = result.rexIdentifier?.toString().trim();
      return Boolean(identifier);
    } catch (error) {
      console.error("[webmunk-history] Failed to check identifier:", error);
      return false;
    }
  }
  async setup() {
    console.log("[webmunk-history/service-worker] Setting up history collection module");
    try {
      await initializeListDatabase();
      console.log("[webmunk-history] List database initialized");
    } catch (error) {
      console.error("[webmunk-history] Failed to initialize list database:", error);
    }
    globalThis.chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local") return;
      if (changes.REXConfiguration || changes.rexIdentifier) {
        this.loadConfiguration().then(async () => {
          const hasIdentifier2 = await this.hasIdentifier();
          if (this.config && hasIdentifier2) {
            await this.setupAlarm();
            console.log("[webmunk-history] Configuration and identifier available, alarm set up");
          } else if (this.config && !hasIdentifier2) {
            console.log("[webmunk-history] Configuration available but no identifier - waiting for identifier before starting collection");
          }
        }).catch((err) => {
          console.error("[webmunk-history] Failed to react to configuration change:", err);
        });
      }
    });
    await this.loadConfiguration();
    const hasIdentifier = await this.hasIdentifier();
    if (this.config && hasIdentifier) {
      await this.setupAlarm();
      console.log(`[webmunk-history] Alarm set for every ${this.config.collection_interval_minutes} minutes`);
    } else if (this.config && !hasIdentifier) {
      console.log("[webmunk-history] Configuration loaded but no identifier set - collection will start once identifier is provided");
    }
    globalThis.chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === "rex-history-collection") {
        console.log("[webmunk-history] Periodic collection triggered");
        this.collectHistory().catch((error) => {
          console.error("[webmunk-history] Collection error:", error);
        });
      }
    });
    await this.loadStatus();
    await this.loadConfiguration();
  }
  async loadConfiguration() {
    try {
      const configuration = await service_worker_default.fetchConfiguration();
      const configurationRecord = configuration;
      const historyConfig = configurationRecord?.["history"];
      if (historyConfig && historyConfig["enabled"] !== false) {
        this.config = historyConfig;
        this.status.configSource = "server";
        this.status.effectiveConfig = historyConfig;
        await this.saveStatus();
        console.log("[webmunk-history] Configuration loaded from rex-core:", historyConfig);
      } else {
        this.config = null;
        this.status.configSource = "none";
        delete this.status.effectiveConfig;
        await this.saveStatus();
        console.warn("[webmunk-history] No history configuration found in rex-core configuration");
      }
      const listConfig = configurationRecord?.["lists"];
      if (listConfig !== null && listConfig !== void 0 && typeof listConfig === "object" && !Array.isArray(listConfig)) {
        await parseAndSyncLists(listConfig);
        console.log("[webmunk-history] Lists synced.");
      }
    } catch (error) {
      console.error("[webmunk-history] Failed to load configuration:", error);
    }
  }
  async setupAlarm() {
    if (!this.config) return;
    await globalThis.chrome.alarms.clear("rex-history-collection");
    await globalThis.chrome.alarms.create("rex-history-collection", {
      periodInMinutes: this.config.collection_interval_minutes,
      delayInMinutes: this.config.collection_interval_minutes
    });
  }
  async loadStatus() {
    try {
      const result = await globalThis.chrome.storage.local.get("webmunkHistoryStatus");
      if (result.webmunkHistoryStatus) {
        this.status = result.webmunkHistoryStatus;
      }
    } catch (error) {
      console.error("[webmunk-history] Failed to load status:", error);
    }
  }
  async saveStatus() {
    try {
      await globalThis.chrome.storage.local.set({
        webmunkHistoryStatus: this.status
      });
    } catch (error) {
      console.error("[webmunk-history] Failed to save status:", error);
    }
  }
  async getLastFetchTime() {
    try {
      const result = await globalThis.chrome.storage.local.get("webmunkHistoryLastFetch");
      if (result.webmunkHistoryLastFetch) {
        return result.webmunkHistoryLastFetch;
      }
      if (this.config) {
        const lookbackMs = this.config.lookback_days * 24 * 60 * 60 * 1e3;
        return Date.now() - lookbackMs;
      }
      return Date.now() - 30 * 24 * 60 * 60 * 1e3;
    } catch (error) {
      console.error("[webmunk-history] Failed to get last fetch time:", error);
      return Date.now() - 30 * 24 * 60 * 60 * 1e3;
    }
  }
  async setLastFetchTime(timestamp) {
    try {
      await globalThis.chrome.storage.local.set({
        webmunkHistoryLastFetch: timestamp
      });
    } catch (error) {
      console.error("[webmunk-history] Failed to set last fetch time:", error);
    }
  }
  collectHistory() {
    if (this.status.isCollecting) {
      console.log("[webmunk-history] Collection already in progress, skipping");
      return Promise.resolve();
    }
    return this.hasIdentifier().then((hasIdentifier) => {
      if (!hasIdentifier) {
        console.warn("[webmunk-history] No identifier set - collection will not start until identifier is provided");
        return Promise.reject(new Error("NO_IDENTIFIER"));
      }
      return this.loadConfiguration();
    }).then(() => this.waitForConfiguration()).then(() => {
      if (!this.config) {
        console.warn("[webmunk-history] No configuration available, skipping collection");
        return Promise.reject(new Error("NO_CONFIGURATION"));
      }
      console.log("[webmunk-history] Starting history collection");
      this.status.isCollecting = true;
      return this.saveStatus();
    }).then(() => this.runCollectionCycle()).catch((error) => {
      if (error instanceof Error && (error.message === "NO_IDENTIFIER" || error.message === "NO_CONFIGURATION")) {
        return;
      }
      console.error("[webmunk-history] Collection error:", error);
      return this.setLastFetchTime(Date.now());
    }).finally(() => {
      if (!this.status.isCollecting) {
        return;
      }
      this.status.isCollecting = false;
      return this.saveStatus().finally(() => {
        console.log("[webmunk-history] Collection complete");
      });
    });
  }
  waitForConfiguration() {
    if (this.config) {
      return Promise.resolve();
    }
    const deadlineMs = Date.now() + 1500;
    const tryReload = () => {
      if (this.config) {
        return Promise.resolve();
      }
      if (Date.now() >= deadlineMs) {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 250);
      }).then(() => this.loadConfiguration()).then(() => tryReload());
    };
    return tryReload();
  }
  runCollectionCycle() {
    let collectedCount = 0;
    let lastProcessedVisitTime = 0;
    return this.getLastFetchTime().then((initialLastFetch) => {
      lastProcessedVisitTime = initialLastFetch;
      console.log(`[webmunk-history] Fetching history since ${new Date(initialLastFetch).toISOString()}`);
      const fetchHistoryBatch = () => {
        return globalThis.chrome.history.search({
          text: "",
          startTime: lastProcessedVisitTime,
          maxResults: 1e4
        }).then((historyItems) => {
          console.log(`[webmunk-history] Found ${historyItems.length} history items`);
          if (historyItems.length === 0) {
            return;
          }
          return this.processHistoryBatch(historyItems, lastProcessedVisitTime).then((batchResult) => {
            collectedCount += batchResult.collectedCount;
            if (batchResult.maxVisitTime <= lastProcessedVisitTime) {
              return;
            }
            lastProcessedVisitTime = batchResult.maxVisitTime + 1;
            return fetchHistoryBatch();
          });
        });
      };
      return fetchHistoryBatch();
    }).then(() => {
      console.log(`[webmunk-history] Collected ${collectedCount} history visits`);
      if (this.config?.generate_top_domains) {
        return this.generateTopDomainsList();
      }
    }).then(() => {
      this.status.lastCollectionTime = Date.now();
      this.status.itemsCollected += collectedCount;
      return this.setLastFetchTime(lastProcessedVisitTime);
    }).then(() => this.saveStatus());
  }
  async processHistoryBatch(historyItems, lastFetch) {
    let collectedCount = 0;
    let maxVisitTime = lastFetch;
    for (const item of historyItems) {
      if (!item.url) continue;
      const visits = await globalThis.chrome.history.getVisits({ url: item.url });
      for (const visit of visits) {
        if (!visit.visitTime || visit.visitTime <= lastFetch) continue;
        maxVisitTime = Math.max(maxVisitTime, visit.visitTime);
        if (this.shouldSkipUrl(item.url)) {
          continue;
        }
        let registeredDomain = "not available";
        try {
          const urlObj = new URL(item.url);
          const hostname = urlObj.hostname;
          const parsed = na.parse(hostname);
          if (parsed.error === void 0 && "domain" in parsed && parsed.domain) {
            registeredDomain = parsed.domain;
          }
        } catch {
        }
        let recordedUrl = item.url;
        let recordedTitle = item.title || "";
        let filteredByList;
        let filterMatch;
        const domainOnlyResult = await this.applyDomainOnlyLists(item.url, {
          visit_id: visit.visitId,
          visit_time: visit.visitTime,
          history_item_id: item.id
        });
        let allowCheck;
        if (domainOnlyResult.filteredByList) {
          recordedUrl = "DOMAIN ONLY";
          recordedTitle = "DOMAIN ONLY";
          filteredByList = domainOnlyResult.filteredByList;
          filterMatch = domainOnlyResult.filterMatch;
          allowCheck = { allowed: true };
        } else {
          allowCheck = await this.checkAllowLists(item.url);
          if (!allowCheck.allowed) {
            recordedUrl = "CATEGORY:NOT_ON_ALLOWLIST";
            recordedTitle = "";
            registeredDomain = "";
            await this.maybeLogFilteredUrlDebug(
              item.url,
              recordedUrl,
              "NOT_ON_ALLOWLIST",
              void 0,
              {
                visit_id: visit.visitId,
                visit_time: visit.visitTime,
                history_item_id: item.id
              }
            );
          } else {
            const filterResult = await this.applyFilterLists(item.url, {
              visit_id: visit.visitId,
              visit_time: visit.visitTime,
              history_item_id: item.id
            });
            recordedUrl = filterResult.recordedUrl;
            filteredByList = filterResult.filteredByList;
            filterMatch = filterResult.filterMatch;
            if (recordedUrl.startsWith("CATEGORY:")) {
              recordedTitle = "";
              registeredDomain = "";
            }
          }
        }
        const categories = await this.categorizeUrl(item.url);
        console.log("[webmunk-history] Logging event: rex-history-visit");
        dispatchEvent({
          name: "rex-history-visit",
          // IMPORTANT: `url` is the recorded URL (may be replaced by CATEGORY:... for filtered items)
          url: recordedUrl,
          recorded_url: recordedUrl,
          domain: registeredDomain,
          title: recordedTitle,
          visit_time: visit.visitTime,
          transition_type: visit.transition,
          is_local: visit.isLocal,
          categories,
          date: visit.visitTime,
          // Stable per-visit identifiers (useful for dedup + sequence reconstruction)
          visit_id: visit.visitId,
          referring_visit_id: visit.referringVisitId,
          // URL-level history item fields (useful context, low cost)
          history_item_id: item.id,
          last_visit_time: item.lastVisitTime,
          visit_count: item.visitCount,
          typed_count: item.typedCount,
          // Allow-list context (which list allowed this URL)
          allowed_by_list: allowCheck.matchedList,
          allowed_by_list_entry: allowCheck.matchEntry ? {
            list_name: allowCheck.matchedList,
            matched_pattern: allowCheck.matchEntry.domain,
            matched_pattern_type: allowCheck.matchEntry.pattern_type,
            matched_source: allowCheck.matchEntry.source,
            matched_metadata: allowCheck.matchEntry.metadata || {}
          } : void 0,
          // Filter-list context (safe: doesn't include original URL)
          filtered: Boolean(filteredByList),
          filtered_by_list: filteredByList,
          filtered_by_list_entry: filterMatch ? {
            list_name: filteredByList,
            matched_pattern: filterMatch.domain,
            matched_pattern_type: filterMatch.pattern_type,
            matched_source: filterMatch.source,
            matched_metadata: filterMatch.metadata || {}
          } : void 0
        });
        collectedCount++;
      }
    }
    return { collectedCount, maxVisitTime };
  }
  /**
   * Privacy baseline: skip URLs we should never collect/upload at all.
   * (Filter lists are handled separately and do NOT skip; they replace recorded URL.)
   */
  shouldSkipUrl(url) {
    return !(url.startsWith("http://") || url.startsWith("https://"));
  }
  /**
   * Check if URL is allowed by the allow_lists.
   *
   * If allow_lists is configured and non-empty, only URLs matching at least one
   * allow-list entry will be collected. URLs not on an allow-list are skipped entirely.
   *
   * Returns { allowed: true, matchedList, matchEntry } if allowed, or { allowed: false } if not.
   */
  async checkAllowLists(url) {
    if (!this.config) {
      return { allowed: true };
    }
    const allowLists = this.config.allow_lists;
    if (!allowLists || allowLists.length === 0) {
      return { allowed: true };
    }
    for (const listName of allowLists) {
      try {
        const match = await matchDomainAgainstList(url, listName);
        if (match) {
          console.log(`[webmunk-history] URL allowed by list ${listName}: ${url}`);
          return { allowed: true, matchedList: listName, matchEntry: match };
        }
      } catch (error) {
        console.error(`[webmunk-history] Error checking allow list ${listName}:`, error);
      }
    }
    console.log(`[webmunk-history] URL not in allow-lists, skipping: ${url}`);
    return { allowed: false };
  }
  /**
   * Apply configured filter lists to a URL.
   *
   * If a match is found, we replace the recorded URL with `CATEGORY:<category|null>` so the visit
   * can still be uploaded without the full URL. The original URL can still be inspected via the
   * dev-only debug event (guarded by manifest name + storage flag).
   */
  async applyFilterLists(url, ctx) {
    if (!this.config) {
      return { recordedUrl: url };
    }
    for (const listName of this.config.filter_lists) {
      try {
        const match = await matchDomainAgainstList(url, listName);
        if (match) {
          const category = match.metadata?.category ?? null;
          const recordedUrl = `CATEGORY:${category ?? "null"}`;
          console.log(`[webmunk-history] Filtered URL by list ${listName} -> ${recordedUrl}`);
          await this.maybeLogFilteredUrlDebug(url, recordedUrl, listName, match, ctx);
          return { recordedUrl, filteredByList: listName, filterMatch: match };
        }
      } catch (error) {
        console.error(`[webmunk-history] Error checking filter list ${listName}:`, error);
      }
    }
    return { recordedUrl: url };
  }
  /**
   * Apply configured domain_only_lists to a URL.
   *
   * If a match is found, we replace the recorded URL and title with "DOMAIN ONLY" while preserving
   * the registered domain field. This allows researchers to know which domain was visited without
   * exposing the full URL or page title.
   */
  async applyDomainOnlyLists(url, ctx) {
    if (!this.config || !this.config.domain_only_lists) {
      return {};
    }
    for (const listName of this.config.domain_only_lists) {
      try {
        const match = await matchDomainAgainstList(url, listName);
        if (match) {
          console.log(`[webmunk-history] Applied domain-only filter by list ${listName}`);
          await this.maybeLogFilteredUrlDebug(url, "DOMAIN ONLY", listName, match, ctx);
          return { filteredByList: listName, filterMatch: match };
        }
      } catch (error) {
        console.error(`[webmunk-history] Error checking domain-only list ${listName}:`, error);
      }
    }
    return {};
  }
  isDevExtension() {
    try {
      return globalThis.chrome.runtime.getManifest().name === "Webmunk Dev Extension";
    } catch {
      return false;
    }
  }
  async maybeLogFilteredUrlDebug(url, recordedUrl, listName, match, ctx) {
    const { [_HistoryServiceWorkerModule.DEBUG_LOG_FILTERED_URLS_KEY]: enabled } = await globalThis.chrome.storage.local.get(_HistoryServiceWorkerModule.DEBUG_LOG_FILTERED_URLS_KEY);
    if (!this.isDevExtension()) {
      if (enabled === true) {
        console.warn("[webmunk-history] Debug URL logging was enabled, but this is not the dev extension. Disabling.");
        await globalThis.chrome.storage.local.remove(_HistoryServiceWorkerModule.DEBUG_LOG_FILTERED_URLS_KEY);
      }
      return;
    }
    if (enabled !== true) return;
    dispatchEvent({
      name: "webmunk-history-filtered-url-debug",
      url,
      recorded_url: recordedUrl,
      filtered_by_list: listName === "NOT_ON_ALLOWLIST" ? void 0 : listName,
      allowed_by_list: listName === "NOT_ON_ALLOWLIST" ? "NOT_ON_ALLOWLIST" : void 0,
      matched_pattern: match?.domain,
      matched_pattern_type: match?.pattern_type,
      matched_source: match?.source,
      matched_metadata: match?.metadata || {},
      visit_id: ctx.visit_id,
      visit_time: ctx.visit_time,
      history_item_id: ctx.history_item_id,
      date: Date.now()
    });
  }
  async categorizeUrl(url) {
    if (!this.config) return [];
    const matches = [];
    for (const listName of this.config.category_lists) {
      try {
        const match = await matchDomainAgainstList(url, listName);
        if (match && match.metadata?.category) {
          matches.push({
            category: match.metadata.category,
            pattern_type: match.pattern_type
          });
        }
      } catch (error) {
        console.error(`[webmunk-history] Error checking category list ${listName}:`, error);
      }
    }
    if (matches.length === 0) return [];
    const specificity = {
      "exact_url": 5,
      "regex": 4,
      "host_path_prefix": 3,
      "host": 2,
      "domain": 1
    };
    const maxSpecificity = Math.max(...matches.map((m) => specificity[m.pattern_type] || 0));
    const categories = matches.filter((m) => specificity[m.pattern_type] === maxSpecificity).map((m) => m.category);
    return categories;
  }
  async generateTopDomainsList() {
    if (!this.config) return;
    console.log("[webmunk-history] Generating top domains list");
    try {
      const historyItems = await globalThis.chrome.history.search({
        text: "",
        startTime: 0,
        maxResults: 1e4
      });
      const domainCounts = /* @__PURE__ */ new Map();
      for (const item of historyItems) {
        if (!item.url) continue;
        try {
          const url = new URL(item.url);
          const hostname = url.hostname;
          const parsed = na.parse(hostname);
          const domain = parsed.error === void 0 && "domain" in parsed && parsed.domain ? parsed.domain : hostname;
          const currentCount = domainCounts.get(domain) || 0;
          domainCounts.set(domain, currentCount + (item.visitCount || 1));
        } catch {
          continue;
        }
      }
      const sortedDomains = Array.from(domainCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, this.config.top_domains_count);
      await deleteAllEntriesInList(this.config.top_domains_list_name, "generated");
      const entries = sortedDomains.map(([domain, count]) => ({
        list_name: this.config.top_domains_list_name,
        domain,
        pattern_type: "domain",
        source: "generated",
        metadata: {
          visit_count: count,
          generated_at: Date.now()
        }
      }));
      await bulkCreateListEntries(entries);
      console.log(`[webmunk-history] Generated top ${sortedDomains.length} domains`);
    } catch {
      console.error("[webmunk-history] Error generating top domains list");
    }
  }
  handleMessage(message, sender, sendResponse) {
    console.log("[webmunk-history] Received message:", message.messageType);
    if (message.messageType === "triggerHistoryCollection") {
      console.log("[webmunk-history] Triggering manual collection");
      this.collectHistory().then(() => {
        sendResponse({ success: true });
      }).catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
      return true;
    }
    if (message.messageType === "getHistoryStatus") {
      console.log("[webmunk-history] Sending status:", this.status);
      sendResponse(this.status);
      return true;
    }
    if (message.messageType === "getOldestHistoryAge") {
      console.log("[webmunk-history] Searching for oldest history item");
      const lookbackDays = this.config?.lookback_days ?? 30;
      const lookbackMs = lookbackDays * 24 * 60 * 60 * 1e3;
      globalThis.chrome.history.search({ text: "", startTime: 0, maxResults: 1e4 }).then((items) => {
        if (items.length === 0) {
          sendResponse({ ageSeconds: null });
          return;
        }
        const oldestVisitTime = items.reduce(
          (min, item) => Math.min(min, item.lastVisitTime ?? Date.now()),
          Date.now()
        );
        if (items.length === 1e4 && Date.now() - oldestVisitTime < lookbackMs) {
          console.log(`[webmunk-history] First 10k items are all under ${lookbackDays} days old, fetching another page`);
          globalThis.chrome.history.search({ text: "", startTime: 0, endTime: oldestVisitTime - 1, maxResults: 1e4 }).then((olderItems) => {
            const oldest = olderItems.reduce(
              (min, item) => Math.min(min, item.lastVisitTime ?? oldestVisitTime),
              oldestVisitTime
            );
            sendResponse({ ageSeconds: (Date.now() - oldest) / 1e3 });
          }).catch(() => sendResponse({ ageSeconds: (Date.now() - oldestVisitTime) / 1e3 }));
        } else {
          sendResponse({ ageSeconds: (Date.now() - oldestVisitTime) / 1e3 });
        }
      }).catch(() => sendResponse({ ageSeconds: null }));
      return true;
    }
    console.log("[webmunk-history] Unknown message type, not handling");
    return false;
  }
  // Note: This module does NOT respond to events, only sends them
  // The logEvent method is intentionally not implemented to avoid infinite recursion
  // when dispatchEvent() is called
};
/**
 * DEV-ONLY debug flag:
 * When enabled (and running inside Webmunk Dev Extension), we emit a dataset event
 * containing the *full* original URL for filtered items so you can verify list behavior.
 *
 * This is explicitly blocked outside the dev extension to prevent accidental deployment.
 */
__publicField(_HistoryServiceWorkerModule, "DEBUG_LOG_FILTERED_URLS_KEY", "webmunk_debug_log_filtered_urls");
var HistoryServiceWorkerModule = _HistoryServiceWorkerModule;
var plugin = new HistoryServiceWorkerModule();
registerREXModule(plugin);

// tests/extension/sw-entry.mts
globalThis.chrome.runtime.onMessage.addListener(service_worker_default.handleMessage);
var g = globalThis;
g.__testSendMessage = (message) => new Promise((resolve) => {
  service_worker_default.handleMessage(message, {}, resolve);
});
/*! Bundled license information:

jquery/dist/jquery.js:
  (*!
   * jQuery JavaScript Library v3.7.1
   * https://jquery.com/
   *
   * Copyright OpenJS Foundation and other contributors
   * Released under the MIT license
   * https://jquery.org/license
   *
   * Date: 2023-08-28T13:37Z
   *)
*/
//# sourceMappingURL=service-worker.bundle.js.map
