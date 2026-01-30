function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$2 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x$1 = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$2 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$2 = Object.assign, D$2 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$2;
  this.updater = e || B$2;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F$1() {
}
F$1.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$2;
  this.updater = e || B$2;
}
var H$1 = G$1.prototype = new F$1();
H$1.constructor = G$1;
C$2(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$2 = { key: true, ref: true, __self: true, __source: true };
function M$2(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$2.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$2(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$2(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$2(c) && (c = N$2(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$2(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$2 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$2, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$1() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$2, forEach: function(a, b, e) {
  S$2(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$2(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$2(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$2(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$1;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$2({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$2.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$2;
react_production_min.createFactory = function(a) {
  var b = M$2.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$2, render: a };
};
react_production_min.isValidElement = O$2;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x$1, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$1;
react_production_min.useCallback = function(a, b) {
  return U$2.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$2.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$2.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$2.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$2.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$2.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$2.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$2.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$2.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$2.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$2.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$2.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$2.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$2.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports$1) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports$1.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports$1.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports$1.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports$1.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports$1.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports$1.unstable_now());
    }, b);
  }
  exports$1.unstable_IdlePriority = 5;
  exports$1.unstable_ImmediatePriority = 1;
  exports$1.unstable_LowPriority = 4;
  exports$1.unstable_NormalPriority = 3;
  exports$1.unstable_Profiling = null;
  exports$1.unstable_UserBlockingPriority = 2;
  exports$1.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports$1.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports$1.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports$1.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports$1.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports$1.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports$1.unstable_pauseExecution = function() {
  };
  exports$1.unstable_requestPaint = function() {
  };
  exports$1.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports$1.unstable_scheduleCallback = function(a, b, c) {
    var d = exports$1.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports$1.unstable_shouldYield = M2;
  exports$1.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v$1(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v$1(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v$1(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v$1(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v$1(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v$1(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v$1(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v$1(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v$1(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v$1(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v$1(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v$1(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v$1(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v$1(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v$1("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v$1(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B$1 = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C$1 = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C$1, f2 = cd.transition;
  cd.transition = null;
  try {
    C$1 = 1, fd(a, b, c, d);
  } finally {
    C$1 = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C$1, f2 = cd.transition;
  cd.transition = null;
  try {
    C$1 = 4, fd(a, b, c, d);
  } finally {
    C$1 = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D$1(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C$1;
    try {
      var c = eg;
      for (C$1 = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C$1 = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L$1 = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M$1 = null, N$1 = null, O$1 = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M$1 = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O$1 = N$1 = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N$1 && null !== N$1.next;
  Hh = 0;
  O$1 = N$1 = M$1 = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O$1 ? M$1.memoizedState = O$1 = a : O$1 = O$1.next = a;
  return O$1;
}
function Uh() {
  if (null === N$1) {
    var a = M$1.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N$1.next;
  var b = null === O$1 ? M$1.memoizedState : O$1.next;
  if (null !== b) O$1 = b, N$1 = a;
  else {
    if (null === a) throw Error(p(310));
    N$1 = a;
    a = { memoizedState: N$1.memoizedState, baseState: N$1.baseState, baseQueue: N$1.baseQueue, queue: N$1.queue, next: null };
    null === O$1 ? M$1.memoizedState = O$1 = a : O$1 = O$1.next = a;
  }
  return O$1;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N$1, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M$1.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M$1.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M$1, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O$1 && O$1.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M$1.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M$1.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M$1, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M$1.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M$1.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M$1.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N$1) {
    var g = N$1.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M$1.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M$1.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C$1;
  C$1 = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C$1 = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M$1 || null !== b && b === M$1;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M$1, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M$1, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N$1.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N$1 ? b.memoizedState = a : ui(b, N$1.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L$1.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L$1, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L$1.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L$1, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L$1, L$1.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L$1, L$1.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L$1, L$1.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L$1, L$1.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D$1("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S$1(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S$1(b), null;
    case 1:
      return Zf(b.type) && $f(), S$1(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S$1(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S$1(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D$1("cancel", d);
              D$1("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D$1("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D$1(lf[e], d);
              break;
            case "source":
              D$1("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D$1(
                "error",
                d
              );
              D$1("load", d);
              break;
            case "details":
              D$1("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D$1("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D$1("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D$1("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D$1("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D$1("cancel", a);
                D$1("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D$1("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D$1(lf[e], a);
                e = d;
                break;
              case "source":
                D$1("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D$1(
                  "error",
                  a
                );
                D$1("load", a);
                e = d;
                break;
              case "details":
                D$1("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D$1("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D$1("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D$1("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D$1("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S$1(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S$1(b);
      return null;
    case 13:
      E(L$1);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S$1(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L$1.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S$1(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S$1(b), null;
    case 10:
      return ah(b.type._context), S$1(b), null;
    case 17:
      return Zf(b.type) && $f(), S$1(b), null;
    case 19:
      E(L$1);
      f2 = b.memoizedState;
      if (null === f2) return S$1(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L$1, L$1.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B$1() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S$1(b), null;
        } else 2 * B$1() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B$1(), b.sibling = null, c = L$1.current, G(L$1, d ? c & 1 | 2 : c & 1), b;
      S$1(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S$1(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S$1(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L$1);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L$1), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U$1 = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U$1 || Lj(c, b);
    case 6:
      var d = X, e = Xj;
      X = null;
      Yj(a, b, c);
      X = d;
      Xj = e;
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
      break;
    case 18:
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
      break;
    case 4:
      d = X;
      e = Xj;
      X = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U$1 && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U$1 && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U$1 = (d = U$1) || null !== c.memoizedState, Yj(a, b, c), U$1 = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X) throw Error(p(160));
      Zj(f2, g, e);
      X = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B$1()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U$1 = (l2 = U$1) || m2, ck(b, a), U$1 = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U$1;
        h = Jj;
        var l2 = U$1;
        Jj = g;
        if ((U$1 = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U$1 = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U$1 || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U$1) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U$1 || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B$1() : -1 !== Ak ? Ak : Ak = B$1();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C$1;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B$1() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B$1() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B$1()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B$1()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B$1(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B$1() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B$1());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B$1()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B$1()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B$1());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B$1() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C$1;
  try {
    if (ok.transition = null, C$1 = 1, a) return a();
  } finally {
    C$1 = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L$1);
        break;
      case 19:
        E(L$1);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M$1.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O$1 = N$1 = M$1 = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C$1, e = ok.transition;
  try {
    ok.transition = null, C$1 = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C$1 = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C$1;
    C$1 = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C$1 = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B$1());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C$1;
    try {
      ok.transition = null;
      C$1 = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C$1 = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B$1() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B$1()), 0 === (K & 6) && (Gj = B$1() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C$1;
};
Ic = function(a, b) {
  var c = C$1;
  try {
    return C$1 = a, b();
  } finally {
    C$1 = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}
const getDefaultsFromPostinstall = () => void 0;
var define_process_env_default = {};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const stringToByteArray$1 = function(str) {
  const out = [];
  let p2 = 0;
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 128) {
      out[p2++] = c;
    } else if (c < 2048) {
      out[p2++] = c >> 6 | 192;
      out[p2++] = c & 63 | 128;
    } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
      c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
      out[p2++] = c >> 18 | 240;
      out[p2++] = c >> 12 & 63 | 128;
      out[p2++] = c >> 6 & 63 | 128;
      out[p2++] = c & 63 | 128;
    } else {
      out[p2++] = c >> 12 | 224;
      out[p2++] = c >> 6 & 63 | 128;
      out[p2++] = c & 63 | 128;
    }
  }
  return out;
};
const byteArrayToString = function(bytes) {
  const out = [];
  let pos = 0, c = 0;
  while (pos < bytes.length) {
    const c1 = bytes[pos++];
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else if (c1 > 191 && c1 < 224) {
      const c2 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
    } else if (c1 > 239 && c1 < 365) {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      const c4 = bytes[pos++];
      const u2 = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
      out[c++] = String.fromCharCode(55296 + (u2 >> 10));
      out[c++] = String.fromCharCode(56320 + (u2 & 1023));
    } else {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
    }
  }
  return out.join("");
};
const base64 = {
  /**
   * Maps bytes to characters.
   */
  byteToCharMap_: null,
  /**
   * Maps characters to bytes.
   */
  charToByteMap_: null,
  /**
   * Maps bytes to websafe characters.
   * @private
   */
  byteToCharMapWebSafe_: null,
  /**
   * Maps websafe characters to bytes.
   * @private
   */
  charToByteMapWebSafe_: null,
  /**
   * Our default alphabet, shared between
   * ENCODED_VALS and ENCODED_VALS_WEBSAFE
   */
  ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  /**
   * Our default alphabet. Value 64 (=) is special; it means "nothing."
   */
  get ENCODED_VALS() {
    return this.ENCODED_VALS_BASE + "+/=";
  },
  /**
   * Our websafe alphabet.
   */
  get ENCODED_VALS_WEBSAFE() {
    return this.ENCODED_VALS_BASE + "-_.";
  },
  /**
   * Whether this browser supports the atob and btoa functions. This extension
   * started at Mozilla but is now implemented by many browsers. We use the
   * ASSUME_* variables to avoid pulling in the full useragent detection library
   * but still allowing the standard per-browser compilations.
   *
   */
  HAS_NATIVE_SUPPORT: typeof atob === "function",
  /**
   * Base64-encode an array of bytes.
   *
   * @param input An array of bytes (numbers with
   *     value in [0, 255]) to encode.
   * @param webSafe Boolean indicating we should use the
   *     alternative alphabet.
   * @return The base64 encoded string.
   */
  encodeByteArray(input, webSafe) {
    if (!Array.isArray(input)) {
      throw Error("encodeByteArray takes an array as a parameter");
    }
    this.init_();
    const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
    const output = [];
    for (let i = 0; i < input.length; i += 3) {
      const byte1 = input[i];
      const haveByte2 = i + 1 < input.length;
      const byte2 = haveByte2 ? input[i + 1] : 0;
      const haveByte3 = i + 2 < input.length;
      const byte3 = haveByte3 ? input[i + 2] : 0;
      const outByte1 = byte1 >> 2;
      const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
      let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
      let outByte4 = byte3 & 63;
      if (!haveByte3) {
        outByte4 = 64;
        if (!haveByte2) {
          outByte3 = 64;
        }
      }
      output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
    }
    return output.join("");
  },
  /**
   * Base64-encode a string.
   *
   * @param input A string to encode.
   * @param webSafe If true, we should use the
   *     alternative alphabet.
   * @return The base64 encoded string.
   */
  encodeString(input, webSafe) {
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return btoa(input);
    }
    return this.encodeByteArray(stringToByteArray$1(input), webSafe);
  },
  /**
   * Base64-decode a string.
   *
   * @param input to decode.
   * @param webSafe True if we should use the
   *     alternative alphabet.
   * @return string representing the decoded value.
   */
  decodeString(input, webSafe) {
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return atob(input);
    }
    return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
  },
  /**
   * Base64-decode a string.
   *
   * In base-64 decoding, groups of four characters are converted into three
   * bytes.  If the encoder did not apply padding, the input length may not
   * be a multiple of 4.
   *
   * In this case, the last group will have fewer than 4 characters, and
   * padding will be inferred.  If the group has one or two characters, it decodes
   * to one byte.  If the group has three characters, it decodes to two bytes.
   *
   * @param input Input to decode.
   * @param webSafe True if we should use the web-safe alphabet.
   * @return bytes representing the decoded value.
   */
  decodeStringToByteArray(input, webSafe) {
    this.init_();
    const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
    const output = [];
    for (let i = 0; i < input.length; ) {
      const byte1 = charToByteMap[input.charAt(i++)];
      const haveByte2 = i < input.length;
      const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
      ++i;
      const haveByte3 = i < input.length;
      const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
      ++i;
      const haveByte4 = i < input.length;
      const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
      ++i;
      if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
        throw new DecodeBase64StringError();
      }
      const outByte1 = byte1 << 2 | byte2 >> 4;
      output.push(outByte1);
      if (byte3 !== 64) {
        const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
        output.push(outByte2);
        if (byte4 !== 64) {
          const outByte3 = byte3 << 6 & 192 | byte4;
          output.push(outByte3);
        }
      }
    }
    return output;
  },
  /**
   * Lazy static initialization function. Called before
   * accessing any of the static map variables.
   * @private
   */
  init_() {
    if (!this.byteToCharMap_) {
      this.byteToCharMap_ = {};
      this.charToByteMap_ = {};
      this.byteToCharMapWebSafe_ = {};
      this.charToByteMapWebSafe_ = {};
      for (let i = 0; i < this.ENCODED_VALS.length; i++) {
        this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
        this.charToByteMap_[this.byteToCharMap_[i]] = i;
        this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
        this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
        if (i >= this.ENCODED_VALS_BASE.length) {
          this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
          this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
        }
      }
    }
  }
};
class DecodeBase64StringError extends Error {
  constructor() {
    super(...arguments);
    this.name = "DecodeBase64StringError";
  }
}
const base64Encode = function(str) {
  const utf8Bytes = stringToByteArray$1(str);
  return base64.encodeByteArray(utf8Bytes, true);
};
const base64urlEncodeWithoutPadding = function(str) {
  return base64Encode(str).replace(/\./g, "");
};
const base64Decode = function(str) {
  try {
    return base64.decodeString(str, true);
  } catch (e) {
    console.error("base64Decode failed: ", e);
  }
  return null;
};
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function getGlobal() {
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("Unable to locate global object.");
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
const getDefaultsFromEnvVariable = () => {
  if (typeof process === "undefined" || typeof define_process_env_default === "undefined") {
    return;
  }
  const defaultsJsonString = define_process_env_default.__FIREBASE_DEFAULTS__;
  if (defaultsJsonString) {
    return JSON.parse(defaultsJsonString);
  }
};
const getDefaultsFromCookie = () => {
  if (typeof document === "undefined") {
    return;
  }
  let match;
  try {
    match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
  } catch (e) {
    return;
  }
  const decoded = match && base64Decode(match[1]);
  return decoded && JSON.parse(decoded);
};
const getDefaults = () => {
  try {
    return getDefaultsFromPostinstall() || getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
  } catch (e) {
    console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
    return;
  }
};
const getDefaultEmulatorHost = (productName) => {
  var _a, _b;
  return (_b = (_a = getDefaults()) == null ? void 0 : _a.emulatorHosts) == null ? void 0 : _b[productName];
};
const getDefaultEmulatorHostnameAndPort = (productName) => {
  const host = getDefaultEmulatorHost(productName);
  if (!host) {
    return void 0;
  }
  const separatorIndex = host.lastIndexOf(":");
  if (separatorIndex <= 0 || separatorIndex + 1 === host.length) {
    throw new Error(`Invalid host ${host} with no separate hostname and port!`);
  }
  const port = parseInt(host.substring(separatorIndex + 1), 10);
  if (host[0] === "[") {
    return [host.substring(1, separatorIndex - 1), port];
  } else {
    return [host.substring(0, separatorIndex), port];
  }
};
const getDefaultAppConfig = () => {
  var _a;
  return (_a = getDefaults()) == null ? void 0 : _a.config;
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Deferred {
  constructor() {
    this.reject = () => {
    };
    this.resolve = () => {
    };
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  /**
   * Our API internals are not promisified and cannot because our callback APIs have subtle expectations around
   * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
   * and returns a node-style callback which will resolve or reject the Deferred's promise.
   */
  wrapCallback(callback) {
    return (error, value) => {
      if (error) {
        this.reject(error);
      } else {
        this.resolve(value);
      }
      if (typeof callback === "function") {
        this.promise.catch(() => {
        });
        if (callback.length === 1) {
          callback(error);
        } else {
          callback(error, value);
        }
      }
    };
  }
}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function isCloudWorkstation(url) {
  try {
    const host = url.startsWith("http://") || url.startsWith("https://") ? new URL(url).hostname : url;
    return host.endsWith(".cloudworkstations.dev");
  } catch {
    return false;
  }
}
async function pingServer(endpoint) {
  const result = await fetch(endpoint, {
    credentials: "include"
  });
  return result.ok;
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function createMockUserToken(token, projectId) {
  if (token.uid) {
    throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
  }
  const header = {
    alg: "none",
    type: "JWT"
  };
  const project = projectId || "demo-project";
  const iat = token.iat || 0;
  const sub = token.sub || token.user_id;
  if (!sub) {
    throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
  }
  const payload = {
    // Set all required fields to decent defaults
    iss: `https://securetoken.google.com/${project}`,
    aud: project,
    iat,
    exp: iat + 3600,
    auth_time: iat,
    sub,
    user_id: sub,
    firebase: {
      sign_in_provider: "custom",
      identities: {}
    },
    // Override with user options
    ...token
  };
  const signature = "";
  return [
    base64urlEncodeWithoutPadding(JSON.stringify(header)),
    base64urlEncodeWithoutPadding(JSON.stringify(payload)),
    signature
  ].join(".");
}
const emulatorStatus = {};
function getEmulatorSummary() {
  const summary = {
    prod: [],
    emulator: []
  };
  for (const key of Object.keys(emulatorStatus)) {
    if (emulatorStatus[key]) {
      summary.emulator.push(key);
    } else {
      summary.prod.push(key);
    }
  }
  return summary;
}
function getOrCreateEl(id2) {
  let parentDiv = document.getElementById(id2);
  let created = false;
  if (!parentDiv) {
    parentDiv = document.createElement("div");
    parentDiv.setAttribute("id", id2);
    created = true;
  }
  return { created, element: parentDiv };
}
let previouslyDismissed = false;
function updateEmulatorBanner(name2, isRunningEmulator) {
  if (typeof window === "undefined" || typeof document === "undefined" || !isCloudWorkstation(window.location.host) || emulatorStatus[name2] === isRunningEmulator || emulatorStatus[name2] || // If already set to use emulator, can't go back to prod.
  previouslyDismissed) {
    return;
  }
  emulatorStatus[name2] = isRunningEmulator;
  function prefixedId(id2) {
    return `__firebase__banner__${id2}`;
  }
  const bannerId = "__firebase__banner";
  const summary = getEmulatorSummary();
  const showError = summary.prod.length > 0;
  function tearDown() {
    const element = document.getElementById(bannerId);
    if (element) {
      element.remove();
    }
  }
  function setupBannerStyles(bannerEl) {
    bannerEl.style.display = "flex";
    bannerEl.style.background = "#7faaf0";
    bannerEl.style.position = "fixed";
    bannerEl.style.bottom = "5px";
    bannerEl.style.left = "5px";
    bannerEl.style.padding = ".5em";
    bannerEl.style.borderRadius = "5px";
    bannerEl.style.alignItems = "center";
  }
  function setupIconStyles(prependIcon, iconId) {
    prependIcon.setAttribute("width", "24");
    prependIcon.setAttribute("id", iconId);
    prependIcon.setAttribute("height", "24");
    prependIcon.setAttribute("viewBox", "0 0 24 24");
    prependIcon.setAttribute("fill", "none");
    prependIcon.style.marginLeft = "-6px";
  }
  function setupCloseBtn() {
    const closeBtn = document.createElement("span");
    closeBtn.style.cursor = "pointer";
    closeBtn.style.marginLeft = "16px";
    closeBtn.style.fontSize = "24px";
    closeBtn.innerHTML = " &times;";
    closeBtn.onclick = () => {
      previouslyDismissed = true;
      tearDown();
    };
    return closeBtn;
  }
  function setupLinkStyles(learnMoreLink, learnMoreId) {
    learnMoreLink.setAttribute("id", learnMoreId);
    learnMoreLink.innerText = "Learn more";
    learnMoreLink.href = "https://firebase.google.com/docs/studio/preview-apps#preview-backend";
    learnMoreLink.setAttribute("target", "__blank");
    learnMoreLink.style.paddingLeft = "5px";
    learnMoreLink.style.textDecoration = "underline";
  }
  function setupDom() {
    const banner = getOrCreateEl(bannerId);
    const firebaseTextId = prefixedId("text");
    const firebaseText = document.getElementById(firebaseTextId) || document.createElement("span");
    const learnMoreId = prefixedId("learnmore");
    const learnMoreLink = document.getElementById(learnMoreId) || document.createElement("a");
    const prependIconId = prefixedId("preprendIcon");
    const prependIcon = document.getElementById(prependIconId) || document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if (banner.created) {
      const bannerEl = banner.element;
      setupBannerStyles(bannerEl);
      setupLinkStyles(learnMoreLink, learnMoreId);
      const closeBtn = setupCloseBtn();
      setupIconStyles(prependIcon, prependIconId);
      bannerEl.append(prependIcon, firebaseText, learnMoreLink, closeBtn);
      document.body.appendChild(bannerEl);
    }
    if (showError) {
      firebaseText.innerText = `Preview backend disconnected.`;
      prependIcon.innerHTML = `<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`;
    } else {
      prependIcon.innerHTML = `<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`;
      firebaseText.innerText = "Preview backend running in this workspace.";
    }
    firebaseText.setAttribute("id", firebaseTextId);
  }
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", setupDom);
  } else {
    setupDom();
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function getUA() {
  if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") {
    return navigator["userAgent"];
  } else {
    return "";
  }
}
function isNode() {
  var _a;
  const forceEnvironment = (_a = getDefaults()) == null ? void 0 : _a.forceEnvironment;
  if (forceEnvironment === "node") {
    return true;
  } else if (forceEnvironment === "browser") {
    return false;
  }
  try {
    return Object.prototype.toString.call(global.process) === "[object process]";
  } catch (e) {
    return false;
  }
}
function isSafari() {
  return !isNode() && !!navigator.userAgent && navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
}
function isIndexedDBAvailable() {
  try {
    return typeof indexedDB === "object";
  } catch (e) {
    return false;
  }
}
function validateIndexedDBOpenable() {
  return new Promise((resolve, reject) => {
    try {
      let preExist = true;
      const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
      const request = self.indexedDB.open(DB_CHECK_NAME);
      request.onsuccess = () => {
        request.result.close();
        if (!preExist) {
          self.indexedDB.deleteDatabase(DB_CHECK_NAME);
        }
        resolve(true);
      };
      request.onupgradeneeded = () => {
        preExist = false;
      };
      request.onerror = () => {
        var _a;
        reject(((_a = request.error) == null ? void 0 : _a.message) || "");
      };
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ERROR_NAME = "FirebaseError";
class FirebaseError extends Error {
  constructor(code, message, customData) {
    super(message);
    this.code = code;
    this.customData = customData;
    this.name = ERROR_NAME;
    Object.setPrototypeOf(this, FirebaseError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorFactory.prototype.create);
    }
  }
}
class ErrorFactory {
  constructor(service, serviceName, errors) {
    this.service = service;
    this.serviceName = serviceName;
    this.errors = errors;
  }
  create(code, ...data) {
    const customData = data[0] || {};
    const fullCode = `${this.service}/${code}`;
    const template = this.errors[code];
    const message = template ? replaceTemplate(template, customData) : "Error";
    const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
    const error = new FirebaseError(fullCode, fullMessage, customData);
    return error;
  }
}
function replaceTemplate(template, data) {
  return template.replace(PATTERN, (_, key) => {
    const value = data[key];
    return value != null ? String(value) : `<${key}?>`;
  });
}
const PATTERN = /\{\$([^}]+)}/g;
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  for (const k2 of aKeys) {
    if (!bKeys.includes(k2)) {
      return false;
    }
    const aProp = a[k2];
    const bProp = b[k2];
    if (isObject(aProp) && isObject(bProp)) {
      if (!deepEqual(aProp, bProp)) {
        return false;
      }
    } else if (aProp !== bProp) {
      return false;
    }
  }
  for (const k2 of bKeys) {
    if (!aKeys.includes(k2)) {
      return false;
    }
  }
  return true;
}
function isObject(thing) {
  return thing !== null && typeof thing === "object";
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function getModularInstance(service) {
  if (service && service._delegate) {
    return service._delegate;
  } else {
    return service;
  }
}
class Component {
  /**
   *
   * @param name The public service name, e.g. app, auth, firestore, database
   * @param instanceFactory Service factory responsible for creating the public interface
   * @param type whether the service provided by the component is public or private
   */
  constructor(name2, instanceFactory, type) {
    this.name = name2;
    this.instanceFactory = instanceFactory;
    this.type = type;
    this.multipleInstances = false;
    this.serviceProps = {};
    this.instantiationMode = "LAZY";
    this.onInstanceCreated = null;
  }
  setInstantiationMode(mode) {
    this.instantiationMode = mode;
    return this;
  }
  setMultipleInstances(multipleInstances) {
    this.multipleInstances = multipleInstances;
    return this;
  }
  setServiceProps(props) {
    this.serviceProps = props;
    return this;
  }
  setInstanceCreatedCallback(callback) {
    this.onInstanceCreated = callback;
    return this;
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DEFAULT_ENTRY_NAME$1 = "[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Provider {
  constructor(name2, container) {
    this.name = name2;
    this.container = container;
    this.component = null;
    this.instances = /* @__PURE__ */ new Map();
    this.instancesDeferred = /* @__PURE__ */ new Map();
    this.instancesOptions = /* @__PURE__ */ new Map();
    this.onInitCallbacks = /* @__PURE__ */ new Map();
  }
  /**
   * @param identifier A provider can provide multiple instances of a service
   * if this.component.multipleInstances is true.
   */
  get(identifier) {
    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
    if (!this.instancesDeferred.has(normalizedIdentifier)) {
      const deferred = new Deferred();
      this.instancesDeferred.set(normalizedIdentifier, deferred);
      if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
        try {
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
          if (instance) {
            deferred.resolve(instance);
          }
        } catch (e) {
        }
      }
    }
    return this.instancesDeferred.get(normalizedIdentifier).promise;
  }
  getImmediate(options) {
    const normalizedIdentifier = this.normalizeInstanceIdentifier(options == null ? void 0 : options.identifier);
    const optional = (options == null ? void 0 : options.optional) ?? false;
    if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
      try {
        return this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier
        });
      } catch (e) {
        if (optional) {
          return null;
        } else {
          throw e;
        }
      }
    } else {
      if (optional) {
        return null;
      } else {
        throw Error(`Service ${this.name} is not available`);
      }
    }
  }
  getComponent() {
    return this.component;
  }
  setComponent(component) {
    if (component.name !== this.name) {
      throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
    }
    if (this.component) {
      throw Error(`Component for ${this.name} has already been provided`);
    }
    this.component = component;
    if (!this.shouldAutoInitialize()) {
      return;
    }
    if (isComponentEager(component)) {
      try {
        this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME$1 });
      } catch (e) {
      }
    }
    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
      const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
      try {
        const instance = this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier
        });
        instanceDeferred.resolve(instance);
      } catch (e) {
      }
    }
  }
  clearInstance(identifier = DEFAULT_ENTRY_NAME$1) {
    this.instancesDeferred.delete(identifier);
    this.instancesOptions.delete(identifier);
    this.instances.delete(identifier);
  }
  // app.delete() will call this method on every provider to delete the services
  // TODO: should we mark the provider as deleted?
  async delete() {
    const services = Array.from(this.instances.values());
    await Promise.all([
      ...services.filter((service) => "INTERNAL" in service).map((service) => service.INTERNAL.delete()),
      ...services.filter((service) => "_delete" in service).map((service) => service._delete())
    ]);
  }
  isComponentSet() {
    return this.component != null;
  }
  isInitialized(identifier = DEFAULT_ENTRY_NAME$1) {
    return this.instances.has(identifier);
  }
  getOptions(identifier = DEFAULT_ENTRY_NAME$1) {
    return this.instancesOptions.get(identifier) || {};
  }
  initialize(opts = {}) {
    const { options = {} } = opts;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
    if (this.isInitialized(normalizedIdentifier)) {
      throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
    }
    if (!this.isComponentSet()) {
      throw Error(`Component ${this.name} has not been registered yet`);
    }
    const instance = this.getOrInitializeService({
      instanceIdentifier: normalizedIdentifier,
      options
    });
    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
      const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
      if (normalizedIdentifier === normalizedDeferredIdentifier) {
        instanceDeferred.resolve(instance);
      }
    }
    return instance;
  }
  /**
   *
   * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
   * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
   *
   * @param identifier An optional instance identifier
   * @returns a function to unregister the callback
   */
  onInit(callback, identifier) {
    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
    const existingCallbacks = this.onInitCallbacks.get(normalizedIdentifier) ?? /* @__PURE__ */ new Set();
    existingCallbacks.add(callback);
    this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
    const existingInstance = this.instances.get(normalizedIdentifier);
    if (existingInstance) {
      callback(existingInstance, normalizedIdentifier);
    }
    return () => {
      existingCallbacks.delete(callback);
    };
  }
  /**
   * Invoke onInit callbacks synchronously
   * @param instance the service instance`
   */
  invokeOnInitCallbacks(instance, identifier) {
    const callbacks = this.onInitCallbacks.get(identifier);
    if (!callbacks) {
      return;
    }
    for (const callback of callbacks) {
      try {
        callback(instance, identifier);
      } catch {
      }
    }
  }
  getOrInitializeService({ instanceIdentifier, options = {} }) {
    let instance = this.instances.get(instanceIdentifier);
    if (!instance && this.component) {
      instance = this.component.instanceFactory(this.container, {
        instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
        options
      });
      this.instances.set(instanceIdentifier, instance);
      this.instancesOptions.set(instanceIdentifier, options);
      this.invokeOnInitCallbacks(instance, instanceIdentifier);
      if (this.component.onInstanceCreated) {
        try {
          this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
        } catch {
        }
      }
    }
    return instance || null;
  }
  normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME$1) {
    if (this.component) {
      return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME$1;
    } else {
      return identifier;
    }
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== "EXPLICIT";
  }
}
function normalizeIdentifierForFactory(identifier) {
  return identifier === DEFAULT_ENTRY_NAME$1 ? void 0 : identifier;
}
function isComponentEager(component) {
  return component.instantiationMode === "EAGER";
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ComponentContainer {
  constructor(name2) {
    this.name = name2;
    this.providers = /* @__PURE__ */ new Map();
  }
  /**
   *
   * @param component Component being added
   * @param overwrite When a component with the same name has already been registered,
   * if overwrite is true: overwrite the existing component with the new component and create a new
   * provider with the new component. It can be useful in tests where you want to use different mocks
   * for different tests.
   * if overwrite is false: throw an exception
   */
  addComponent(component) {
    const provider = this.getProvider(component.name);
    if (provider.isComponentSet()) {
      throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
    }
    provider.setComponent(component);
  }
  addOrOverwriteComponent(component) {
    const provider = this.getProvider(component.name);
    if (provider.isComponentSet()) {
      this.providers.delete(component.name);
    }
    this.addComponent(component);
  }
  /**
   * getProvider provides a type safe interface where it can only be called with a field name
   * present in NameServiceMapping interface.
   *
   * Firebase SDKs providing services should extend NameServiceMapping interface to register
   * themselves.
   */
  getProvider(name2) {
    if (this.providers.has(name2)) {
      return this.providers.get(name2);
    }
    const provider = new Provider(name2, this);
    this.providers.set(name2, provider);
    return provider;
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
  LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
  LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
  LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
  LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
  LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
})(LogLevel || (LogLevel = {}));
const levelStringToEnum = {
  "debug": LogLevel.DEBUG,
  "verbose": LogLevel.VERBOSE,
  "info": LogLevel.INFO,
  "warn": LogLevel.WARN,
  "error": LogLevel.ERROR,
  "silent": LogLevel.SILENT
};
const defaultLogLevel = LogLevel.INFO;
const ConsoleMethod = {
  [LogLevel.DEBUG]: "log",
  [LogLevel.VERBOSE]: "log",
  [LogLevel.INFO]: "info",
  [LogLevel.WARN]: "warn",
  [LogLevel.ERROR]: "error"
};
const defaultLogHandler = (instance, logType, ...args) => {
  if (logType < instance.logLevel) {
    return;
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const method = ConsoleMethod[logType];
  if (method) {
    console[method](`[${now}]  ${instance.name}:`, ...args);
  } else {
    throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
  }
};
class Logger {
  /**
   * Gives you an instance of a Logger to capture messages according to
   * Firebase's logging scheme.
   *
   * @param name The name that the logs will be associated with
   */
  constructor(name2) {
    this.name = name2;
    this._logLevel = defaultLogLevel;
    this._logHandler = defaultLogHandler;
    this._userLogHandler = null;
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(val) {
    if (!(val in LogLevel)) {
      throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
    }
    this._logLevel = val;
  }
  // Workaround for setter/getter having to be the same type.
  setLogLevel(val) {
    this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
  }
  get logHandler() {
    return this._logHandler;
  }
  set logHandler(val) {
    if (typeof val !== "function") {
      throw new TypeError("Value assigned to `logHandler` must be a function");
    }
    this._logHandler = val;
  }
  get userLogHandler() {
    return this._userLogHandler;
  }
  set userLogHandler(val) {
    this._userLogHandler = val;
  }
  /**
   * The functions below are all based on the `console` interface
   */
  debug(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
    this._logHandler(this, LogLevel.DEBUG, ...args);
  }
  log(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
    this._logHandler(this, LogLevel.VERBOSE, ...args);
  }
  info(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
    this._logHandler(this, LogLevel.INFO, ...args);
  }
  warn(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
    this._logHandler(this, LogLevel.WARN, ...args);
  }
  error(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
    this._logHandler(this, LogLevel.ERROR, ...args);
  }
}
const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
let idbProxyableTypes;
let cursorAdvanceMethods;
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const cursorRequestMap = /* @__PURE__ */ new WeakMap();
const transactionDoneMap = /* @__PURE__ */ new WeakMap();
const transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
const transformCache = /* @__PURE__ */ new WeakMap();
const reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  promise.then((value) => {
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
  }).catch(() => {
  });
  reverseTransformCache.set(promise, request);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "objectStoreNames") {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
    return function(storeNames, ...args) {
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
}
function wrap(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);
function openDB(name2, version2, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name2, version2);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      event.oldVersion,
      event.newVersion,
      event
    ));
  }
  openPromise.then((db2) => {
    if (terminated)
      db2.addEventListener("close", () => terminated());
    if (blocking) {
      db2.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
}
const readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
const writeMethods = ["put", "add", "delete", "clear"];
const cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
  ) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
}
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class PlatformLoggerServiceImpl {
  constructor(container) {
    this.container = container;
  }
  // In initial implementation, this will be called by installations on
  // auth token refresh, and installations will send this string.
  getPlatformInfoString() {
    const providers = this.container.getProviders();
    return providers.map((provider) => {
      if (isVersionServiceProvider(provider)) {
        const service = provider.getImmediate();
        return `${service.library}/${service.version}`;
      } else {
        return null;
      }
    }).filter((logString) => logString).join(" ");
  }
}
function isVersionServiceProvider(provider) {
  const component = provider.getComponent();
  return (component == null ? void 0 : component.type) === "VERSION";
}
const name$q = "@firebase/app";
const version$1 = "0.14.7";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const logger = new Logger("@firebase/app");
const name$p = "@firebase/app-compat";
const name$o = "@firebase/analytics-compat";
const name$n = "@firebase/analytics";
const name$m = "@firebase/app-check-compat";
const name$l = "@firebase/app-check";
const name$k = "@firebase/auth";
const name$j = "@firebase/auth-compat";
const name$i = "@firebase/database";
const name$h = "@firebase/data-connect";
const name$g = "@firebase/database-compat";
const name$f = "@firebase/functions";
const name$e = "@firebase/functions-compat";
const name$d = "@firebase/installations";
const name$c = "@firebase/installations-compat";
const name$b = "@firebase/messaging";
const name$a = "@firebase/messaging-compat";
const name$9 = "@firebase/performance";
const name$8 = "@firebase/performance-compat";
const name$7 = "@firebase/remote-config";
const name$6 = "@firebase/remote-config-compat";
const name$5 = "@firebase/storage";
const name$4 = "@firebase/storage-compat";
const name$3 = "@firebase/firestore";
const name$2 = "@firebase/ai";
const name$1 = "@firebase/firestore-compat";
const name$r = "firebase";
const version$2 = "12.8.0";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DEFAULT_ENTRY_NAME = "[DEFAULT]";
const PLATFORM_LOG_STRING = {
  [name$q]: "fire-core",
  [name$p]: "fire-core-compat",
  [name$n]: "fire-analytics",
  [name$o]: "fire-analytics-compat",
  [name$l]: "fire-app-check",
  [name$m]: "fire-app-check-compat",
  [name$k]: "fire-auth",
  [name$j]: "fire-auth-compat",
  [name$i]: "fire-rtdb",
  [name$h]: "fire-data-connect",
  [name$g]: "fire-rtdb-compat",
  [name$f]: "fire-fn",
  [name$e]: "fire-fn-compat",
  [name$d]: "fire-iid",
  [name$c]: "fire-iid-compat",
  [name$b]: "fire-fcm",
  [name$a]: "fire-fcm-compat",
  [name$9]: "fire-perf",
  [name$8]: "fire-perf-compat",
  [name$7]: "fire-rc",
  [name$6]: "fire-rc-compat",
  [name$5]: "fire-gcs",
  [name$4]: "fire-gcs-compat",
  [name$3]: "fire-fst",
  [name$1]: "fire-fst-compat",
  [name$2]: "fire-vertex",
  "fire-js": "fire-js",
  // Platform identifier for JS SDK.
  [name$r]: "fire-js-all"
};
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const _apps = /* @__PURE__ */ new Map();
const _serverApps = /* @__PURE__ */ new Map();
const _components = /* @__PURE__ */ new Map();
function _addComponent(app, component) {
  try {
    app.container.addComponent(component);
  } catch (e) {
    logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app.name}`, e);
  }
}
function _registerComponent(component) {
  const componentName = component.name;
  if (_components.has(componentName)) {
    logger.debug(`There were multiple attempts to register component ${componentName}.`);
    return false;
  }
  _components.set(componentName, component);
  for (const app of _apps.values()) {
    _addComponent(app, component);
  }
  for (const serverApp of _serverApps.values()) {
    _addComponent(serverApp, component);
  }
  return true;
}
function _getProvider(app, name2) {
  const heartbeatController = app.container.getProvider("heartbeat").getImmediate({ optional: true });
  if (heartbeatController) {
    void heartbeatController.triggerHeartbeat();
  }
  return app.container.getProvider(name2);
}
function _isFirebaseServerApp(obj) {
  if (obj === null || obj === void 0) {
    return false;
  }
  return obj.settings !== void 0;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ERRORS = {
  [
    "no-app"
    /* AppError.NO_APP */
  ]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
  [
    "bad-app-name"
    /* AppError.BAD_APP_NAME */
  ]: "Illegal App name: '{$appName}'",
  [
    "duplicate-app"
    /* AppError.DUPLICATE_APP */
  ]: "Firebase App named '{$appName}' already exists with different options or config",
  [
    "app-deleted"
    /* AppError.APP_DELETED */
  ]: "Firebase App named '{$appName}' already deleted",
  [
    "server-app-deleted"
    /* AppError.SERVER_APP_DELETED */
  ]: "Firebase Server App has been deleted",
  [
    "no-options"
    /* AppError.NO_OPTIONS */
  ]: "Need to provide options, when not being deployed to hosting via source.",
  [
    "invalid-app-argument"
    /* AppError.INVALID_APP_ARGUMENT */
  ]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
  [
    "invalid-log-argument"
    /* AppError.INVALID_LOG_ARGUMENT */
  ]: "First argument to `onLog` must be null or a function.",
  [
    "idb-open"
    /* AppError.IDB_OPEN */
  ]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
  [
    "idb-get"
    /* AppError.IDB_GET */
  ]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
  [
    "idb-set"
    /* AppError.IDB_WRITE */
  ]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
  [
    "idb-delete"
    /* AppError.IDB_DELETE */
  ]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
  [
    "finalization-registry-not-supported"
    /* AppError.FINALIZATION_REGISTRY_NOT_SUPPORTED */
  ]: "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
  [
    "invalid-server-app-environment"
    /* AppError.INVALID_SERVER_APP_ENVIRONMENT */
  ]: "FirebaseServerApp is not for use in browser environments."
};
const ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class FirebaseAppImpl {
  constructor(options, config, container) {
    this._isDeleted = false;
    this._options = { ...options };
    this._config = { ...config };
    this._name = config.name;
    this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
    this._container = container;
    this.container.addComponent(new Component(
      "app",
      () => this,
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ));
  }
  get automaticDataCollectionEnabled() {
    this.checkDestroyed();
    return this._automaticDataCollectionEnabled;
  }
  set automaticDataCollectionEnabled(val) {
    this.checkDestroyed();
    this._automaticDataCollectionEnabled = val;
  }
  get name() {
    this.checkDestroyed();
    return this._name;
  }
  get options() {
    this.checkDestroyed();
    return this._options;
  }
  get config() {
    this.checkDestroyed();
    return this._config;
  }
  get container() {
    return this._container;
  }
  get isDeleted() {
    return this._isDeleted;
  }
  set isDeleted(val) {
    this._isDeleted = val;
  }
  /**
   * This function will throw an Error if the App has already been deleted -
   * use before performing API actions on the App.
   */
  checkDestroyed() {
    if (this.isDeleted) {
      throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
    }
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const SDK_VERSION = version$2;
function initializeApp(_options, rawConfig = {}) {
  let options = _options;
  if (typeof rawConfig !== "object") {
    const name3 = rawConfig;
    rawConfig = { name: name3 };
  }
  const config = {
    name: DEFAULT_ENTRY_NAME,
    automaticDataCollectionEnabled: true,
    ...rawConfig
  };
  const name2 = config.name;
  if (typeof name2 !== "string" || !name2) {
    throw ERROR_FACTORY.create("bad-app-name", {
      appName: String(name2)
    });
  }
  options || (options = getDefaultAppConfig());
  if (!options) {
    throw ERROR_FACTORY.create(
      "no-options"
      /* AppError.NO_OPTIONS */
    );
  }
  const existingApp = _apps.get(name2);
  if (existingApp) {
    if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
      return existingApp;
    } else {
      throw ERROR_FACTORY.create("duplicate-app", { appName: name2 });
    }
  }
  const container = new ComponentContainer(name2);
  for (const component of _components.values()) {
    container.addComponent(component);
  }
  const newApp = new FirebaseAppImpl(options, config, container);
  _apps.set(name2, newApp);
  return newApp;
}
function getApp(name2 = DEFAULT_ENTRY_NAME) {
  const app = _apps.get(name2);
  if (!app && name2 === DEFAULT_ENTRY_NAME && getDefaultAppConfig()) {
    return initializeApp();
  }
  if (!app) {
    throw ERROR_FACTORY.create("no-app", { appName: name2 });
  }
  return app;
}
function registerVersion(libraryKeyOrName, version2, variant) {
  let library = PLATFORM_LOG_STRING[libraryKeyOrName] ?? libraryKeyOrName;
  if (variant) {
    library += `-${variant}`;
  }
  const libraryMismatch = library.match(/\s|\//);
  const versionMismatch = version2.match(/\s|\//);
  if (libraryMismatch || versionMismatch) {
    const warning = [
      `Unable to register library "${library}" with version "${version2}":`
    ];
    if (libraryMismatch) {
      warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
    }
    if (libraryMismatch && versionMismatch) {
      warning.push("and");
    }
    if (versionMismatch) {
      warning.push(`version name "${version2}" contains illegal characters (whitespace or "/")`);
    }
    logger.warn(warning.join(" "));
    return;
  }
  _registerComponent(new Component(
    `${library}-version`,
    () => ({ library, version: version2 }),
    "VERSION"
    /* ComponentType.VERSION */
  ));
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DB_NAME = "firebase-heartbeat-database";
const DB_VERSION = 1;
const STORE_NAME = "firebase-heartbeat-store";
let dbPromise = null;
function getDbPromise() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade: (db2, oldVersion) => {
        switch (oldVersion) {
          case 0:
            try {
              db2.createObjectStore(STORE_NAME);
            } catch (e) {
              console.warn(e);
            }
        }
      }
    }).catch((e) => {
      throw ERROR_FACTORY.create("idb-open", {
        originalErrorMessage: e.message
      });
    });
  }
  return dbPromise;
}
async function readHeartbeatsFromIndexedDB(app) {
  try {
    const db2 = await getDbPromise();
    const tx = db2.transaction(STORE_NAME);
    const result = await tx.objectStore(STORE_NAME).get(computeKey(app));
    await tx.done;
    return result;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-get", {
        originalErrorMessage: e == null ? void 0 : e.message
      });
      logger.warn(idbGetError.message);
    }
  }
}
async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
  try {
    const db2 = await getDbPromise();
    const tx = db2.transaction(STORE_NAME, "readwrite");
    const objectStore = tx.objectStore(STORE_NAME);
    await objectStore.put(heartbeatObject, computeKey(app));
    await tx.done;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-set", {
        originalErrorMessage: e == null ? void 0 : e.message
      });
      logger.warn(idbGetError.message);
    }
  }
}
function computeKey(app) {
  return `${app.name}!${app.options.appId}`;
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const MAX_HEADER_BYTES = 1024;
const MAX_NUM_STORED_HEARTBEATS = 30;
class HeartbeatServiceImpl {
  constructor(container) {
    this.container = container;
    this._heartbeatsCache = null;
    const app = this.container.getProvider("app").getImmediate();
    this._storage = new HeartbeatStorageImpl(app);
    this._heartbeatsCachePromise = this._storage.read().then((result) => {
      this._heartbeatsCache = result;
      return result;
    });
  }
  /**
   * Called to report a heartbeat. The function will generate
   * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
   * to IndexedDB.
   * Note that we only store one heartbeat per day. So if a heartbeat for today is
   * already logged, subsequent calls to this function in the same day will be ignored.
   */
  async triggerHeartbeat() {
    var _a, _b;
    try {
      const platformLogger = this.container.getProvider("platform-logger").getImmediate();
      const agent = platformLogger.getPlatformInfoString();
      const date = getUTCDateString();
      if (((_a = this._heartbeatsCache) == null ? void 0 : _a.heartbeats) == null) {
        this._heartbeatsCache = await this._heartbeatsCachePromise;
        if (((_b = this._heartbeatsCache) == null ? void 0 : _b.heartbeats) == null) {
          return;
        }
      }
      if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
        return;
      } else {
        this._heartbeatsCache.heartbeats.push({ date, agent });
        if (this._heartbeatsCache.heartbeats.length > MAX_NUM_STORED_HEARTBEATS) {
          const earliestHeartbeatIdx = getEarliestHeartbeatIdx(this._heartbeatsCache.heartbeats);
          this._heartbeatsCache.heartbeats.splice(earliestHeartbeatIdx, 1);
        }
      }
      return this._storage.overwrite(this._heartbeatsCache);
    } catch (e) {
      logger.warn(e);
    }
  }
  /**
   * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
   * It also clears all heartbeats from memory as well as in IndexedDB.
   *
   * NOTE: Consuming product SDKs should not send the header if this method
   * returns an empty string.
   */
  async getHeartbeatsHeader() {
    var _a;
    try {
      if (this._heartbeatsCache === null) {
        await this._heartbeatsCachePromise;
      }
      if (((_a = this._heartbeatsCache) == null ? void 0 : _a.heartbeats) == null || this._heartbeatsCache.heartbeats.length === 0) {
        return "";
      }
      const date = getUTCDateString();
      const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
      const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
      this._heartbeatsCache.lastSentHeartbeatDate = date;
      if (unsentEntries.length > 0) {
        this._heartbeatsCache.heartbeats = unsentEntries;
        await this._storage.overwrite(this._heartbeatsCache);
      } else {
        this._heartbeatsCache.heartbeats = [];
        void this._storage.overwrite(this._heartbeatsCache);
      }
      return headerString;
    } catch (e) {
      logger.warn(e);
      return "";
    }
  }
}
function getUTCDateString() {
  const today = /* @__PURE__ */ new Date();
  return today.toISOString().substring(0, 10);
}
function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
  const heartbeatsToSend = [];
  let unsentEntries = heartbeatsCache.slice();
  for (const singleDateHeartbeat of heartbeatsCache) {
    const heartbeatEntry = heartbeatsToSend.find((hb2) => hb2.agent === singleDateHeartbeat.agent);
    if (!heartbeatEntry) {
      heartbeatsToSend.push({
        agent: singleDateHeartbeat.agent,
        dates: [singleDateHeartbeat.date]
      });
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatsToSend.pop();
        break;
      }
    } else {
      heartbeatEntry.dates.push(singleDateHeartbeat.date);
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatEntry.dates.pop();
        break;
      }
    }
    unsentEntries = unsentEntries.slice(1);
  }
  return {
    heartbeatsToSend,
    unsentEntries
  };
}
class HeartbeatStorageImpl {
  constructor(app) {
    this.app = app;
    this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
  }
  async runIndexedDBEnvironmentCheck() {
    if (!isIndexedDBAvailable()) {
      return false;
    } else {
      return validateIndexedDBOpenable().then(() => true).catch(() => false);
    }
  }
  /**
   * Read all heartbeats.
   */
  async read() {
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return { heartbeats: [] };
    } else {
      const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
      if (idbHeartbeatObject == null ? void 0 : idbHeartbeatObject.heartbeats) {
        return idbHeartbeatObject;
      } else {
        return { heartbeats: [] };
      }
    }
  }
  // overwrite the storage with the provided heartbeats
  async overwrite(heartbeatsObject) {
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return;
    } else {
      const existingHeartbeatsObject = await this.read();
      return writeHeartbeatsToIndexedDB(this.app, {
        lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
        heartbeats: heartbeatsObject.heartbeats
      });
    }
  }
  // add heartbeats
  async add(heartbeatsObject) {
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return;
    } else {
      const existingHeartbeatsObject = await this.read();
      return writeHeartbeatsToIndexedDB(this.app, {
        lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
        heartbeats: [
          ...existingHeartbeatsObject.heartbeats,
          ...heartbeatsObject.heartbeats
        ]
      });
    }
  }
}
function countBytes(heartbeatsCache) {
  return base64urlEncodeWithoutPadding(
    // heartbeatsCache wrapper properties
    JSON.stringify({ version: 2, heartbeats: heartbeatsCache })
  ).length;
}
function getEarliestHeartbeatIdx(heartbeats) {
  if (heartbeats.length === 0) {
    return -1;
  }
  let earliestHeartbeatIdx = 0;
  let earliestHeartbeatDate = heartbeats[0].date;
  for (let i = 1; i < heartbeats.length; i++) {
    if (heartbeats[i].date < earliestHeartbeatDate) {
      earliestHeartbeatDate = heartbeats[i].date;
      earliestHeartbeatIdx = i;
    }
  }
  return earliestHeartbeatIdx;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function registerCoreComponents(variant) {
  _registerComponent(new Component(
    "platform-logger",
    (container) => new PlatformLoggerServiceImpl(container),
    "PRIVATE"
    /* ComponentType.PRIVATE */
  ));
  _registerComponent(new Component(
    "heartbeat",
    (container) => new HeartbeatServiceImpl(container),
    "PRIVATE"
    /* ComponentType.PRIVATE */
  ));
  registerVersion(name$q, version$1, variant);
  registerVersion(name$q, version$1, "esm2020");
  registerVersion("fire-js", "");
}
registerCoreComponents("");
var name = "firebase";
var version = "12.8.0";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
registerVersion(name, version, "app");
var commonjsGlobal$1 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/
var Integer;
var Md5;
(function() {
  var h;
  /** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */
  function k2(d, a) {
    function c() {
    }
    c.prototype = a.prototype;
    d.F = a.prototype;
    d.prototype = new c();
    d.prototype.constructor = d;
    d.D = function(f2, e, g) {
      for (var b = Array(arguments.length - 2), r2 = 2; r2 < arguments.length; r2++) b[r2 - 2] = arguments[r2];
      return a.prototype[e].apply(f2, b);
    };
  }
  function l2() {
    this.blockSize = -1;
  }
  function m2() {
    this.blockSize = -1;
    this.blockSize = 64;
    this.g = Array(4);
    this.C = Array(this.blockSize);
    this.o = this.h = 0;
    this.u();
  }
  k2(m2, l2);
  m2.prototype.u = function() {
    this.g[0] = 1732584193;
    this.g[1] = 4023233417;
    this.g[2] = 2562383102;
    this.g[3] = 271733878;
    this.o = this.h = 0;
  };
  function n2(d, a, c) {
    c || (c = 0);
    const f2 = Array(16);
    if (typeof a === "string") for (var e = 0; e < 16; ++e) f2[e] = a.charCodeAt(c++) | a.charCodeAt(c++) << 8 | a.charCodeAt(c++) << 16 | a.charCodeAt(c++) << 24;
    else for (e = 0; e < 16; ++e) f2[e] = a[c++] | a[c++] << 8 | a[c++] << 16 | a[c++] << 24;
    a = d.g[0];
    c = d.g[1];
    e = d.g[2];
    let g = d.g[3], b;
    b = a + (g ^ c & (e ^ g)) + f2[0] + 3614090360 & 4294967295;
    a = c + (b << 7 & 4294967295 | b >>> 25);
    b = g + (e ^ a & (c ^ e)) + f2[1] + 3905402710 & 4294967295;
    g = a + (b << 12 & 4294967295 | b >>> 20);
    b = e + (c ^ g & (a ^ c)) + f2[2] + 606105819 & 4294967295;
    e = g + (b << 17 & 4294967295 | b >>> 15);
    b = c + (a ^ e & (g ^ a)) + f2[3] + 3250441966 & 4294967295;
    c = e + (b << 22 & 4294967295 | b >>> 10);
    b = a + (g ^ c & (e ^ g)) + f2[4] + 4118548399 & 4294967295;
    a = c + (b << 7 & 4294967295 | b >>> 25);
    b = g + (e ^ a & (c ^ e)) + f2[5] + 1200080426 & 4294967295;
    g = a + (b << 12 & 4294967295 | b >>> 20);
    b = e + (c ^ g & (a ^ c)) + f2[6] + 2821735955 & 4294967295;
    e = g + (b << 17 & 4294967295 | b >>> 15);
    b = c + (a ^ e & (g ^ a)) + f2[7] + 4249261313 & 4294967295;
    c = e + (b << 22 & 4294967295 | b >>> 10);
    b = a + (g ^ c & (e ^ g)) + f2[8] + 1770035416 & 4294967295;
    a = c + (b << 7 & 4294967295 | b >>> 25);
    b = g + (e ^ a & (c ^ e)) + f2[9] + 2336552879 & 4294967295;
    g = a + (b << 12 & 4294967295 | b >>> 20);
    b = e + (c ^ g & (a ^ c)) + f2[10] + 4294925233 & 4294967295;
    e = g + (b << 17 & 4294967295 | b >>> 15);
    b = c + (a ^ e & (g ^ a)) + f2[11] + 2304563134 & 4294967295;
    c = e + (b << 22 & 4294967295 | b >>> 10);
    b = a + (g ^ c & (e ^ g)) + f2[12] + 1804603682 & 4294967295;
    a = c + (b << 7 & 4294967295 | b >>> 25);
    b = g + (e ^ a & (c ^ e)) + f2[13] + 4254626195 & 4294967295;
    g = a + (b << 12 & 4294967295 | b >>> 20);
    b = e + (c ^ g & (a ^ c)) + f2[14] + 2792965006 & 4294967295;
    e = g + (b << 17 & 4294967295 | b >>> 15);
    b = c + (a ^ e & (g ^ a)) + f2[15] + 1236535329 & 4294967295;
    c = e + (b << 22 & 4294967295 | b >>> 10);
    b = a + (e ^ g & (c ^ e)) + f2[1] + 4129170786 & 4294967295;
    a = c + (b << 5 & 4294967295 | b >>> 27);
    b = g + (c ^ e & (a ^ c)) + f2[6] + 3225465664 & 4294967295;
    g = a + (b << 9 & 4294967295 | b >>> 23);
    b = e + (a ^ c & (g ^ a)) + f2[11] + 643717713 & 4294967295;
    e = g + (b << 14 & 4294967295 | b >>> 18);
    b = c + (g ^ a & (e ^ g)) + f2[0] + 3921069994 & 4294967295;
    c = e + (b << 20 & 4294967295 | b >>> 12);
    b = a + (e ^ g & (c ^ e)) + f2[5] + 3593408605 & 4294967295;
    a = c + (b << 5 & 4294967295 | b >>> 27);
    b = g + (c ^ e & (a ^ c)) + f2[10] + 38016083 & 4294967295;
    g = a + (b << 9 & 4294967295 | b >>> 23);
    b = e + (a ^ c & (g ^ a)) + f2[15] + 3634488961 & 4294967295;
    e = g + (b << 14 & 4294967295 | b >>> 18);
    b = c + (g ^ a & (e ^ g)) + f2[4] + 3889429448 & 4294967295;
    c = e + (b << 20 & 4294967295 | b >>> 12);
    b = a + (e ^ g & (c ^ e)) + f2[9] + 568446438 & 4294967295;
    a = c + (b << 5 & 4294967295 | b >>> 27);
    b = g + (c ^ e & (a ^ c)) + f2[14] + 3275163606 & 4294967295;
    g = a + (b << 9 & 4294967295 | b >>> 23);
    b = e + (a ^ c & (g ^ a)) + f2[3] + 4107603335 & 4294967295;
    e = g + (b << 14 & 4294967295 | b >>> 18);
    b = c + (g ^ a & (e ^ g)) + f2[8] + 1163531501 & 4294967295;
    c = e + (b << 20 & 4294967295 | b >>> 12);
    b = a + (e ^ g & (c ^ e)) + f2[13] + 2850285829 & 4294967295;
    a = c + (b << 5 & 4294967295 | b >>> 27);
    b = g + (c ^ e & (a ^ c)) + f2[2] + 4243563512 & 4294967295;
    g = a + (b << 9 & 4294967295 | b >>> 23);
    b = e + (a ^ c & (g ^ a)) + f2[7] + 1735328473 & 4294967295;
    e = g + (b << 14 & 4294967295 | b >>> 18);
    b = c + (g ^ a & (e ^ g)) + f2[12] + 2368359562 & 4294967295;
    c = e + (b << 20 & 4294967295 | b >>> 12);
    b = a + (c ^ e ^ g) + f2[5] + 4294588738 & 4294967295;
    a = c + (b << 4 & 4294967295 | b >>> 28);
    b = g + (a ^ c ^ e) + f2[8] + 2272392833 & 4294967295;
    g = a + (b << 11 & 4294967295 | b >>> 21);
    b = e + (g ^ a ^ c) + f2[11] + 1839030562 & 4294967295;
    e = g + (b << 16 & 4294967295 | b >>> 16);
    b = c + (e ^ g ^ a) + f2[14] + 4259657740 & 4294967295;
    c = e + (b << 23 & 4294967295 | b >>> 9);
    b = a + (c ^ e ^ g) + f2[1] + 2763975236 & 4294967295;
    a = c + (b << 4 & 4294967295 | b >>> 28);
    b = g + (a ^ c ^ e) + f2[4] + 1272893353 & 4294967295;
    g = a + (b << 11 & 4294967295 | b >>> 21);
    b = e + (g ^ a ^ c) + f2[7] + 4139469664 & 4294967295;
    e = g + (b << 16 & 4294967295 | b >>> 16);
    b = c + (e ^ g ^ a) + f2[10] + 3200236656 & 4294967295;
    c = e + (b << 23 & 4294967295 | b >>> 9);
    b = a + (c ^ e ^ g) + f2[13] + 681279174 & 4294967295;
    a = c + (b << 4 & 4294967295 | b >>> 28);
    b = g + (a ^ c ^ e) + f2[0] + 3936430074 & 4294967295;
    g = a + (b << 11 & 4294967295 | b >>> 21);
    b = e + (g ^ a ^ c) + f2[3] + 3572445317 & 4294967295;
    e = g + (b << 16 & 4294967295 | b >>> 16);
    b = c + (e ^ g ^ a) + f2[6] + 76029189 & 4294967295;
    c = e + (b << 23 & 4294967295 | b >>> 9);
    b = a + (c ^ e ^ g) + f2[9] + 3654602809 & 4294967295;
    a = c + (b << 4 & 4294967295 | b >>> 28);
    b = g + (a ^ c ^ e) + f2[12] + 3873151461 & 4294967295;
    g = a + (b << 11 & 4294967295 | b >>> 21);
    b = e + (g ^ a ^ c) + f2[15] + 530742520 & 4294967295;
    e = g + (b << 16 & 4294967295 | b >>> 16);
    b = c + (e ^ g ^ a) + f2[2] + 3299628645 & 4294967295;
    c = e + (b << 23 & 4294967295 | b >>> 9);
    b = a + (e ^ (c | ~g)) + f2[0] + 4096336452 & 4294967295;
    a = c + (b << 6 & 4294967295 | b >>> 26);
    b = g + (c ^ (a | ~e)) + f2[7] + 1126891415 & 4294967295;
    g = a + (b << 10 & 4294967295 | b >>> 22);
    b = e + (a ^ (g | ~c)) + f2[14] + 2878612391 & 4294967295;
    e = g + (b << 15 & 4294967295 | b >>> 17);
    b = c + (g ^ (e | ~a)) + f2[5] + 4237533241 & 4294967295;
    c = e + (b << 21 & 4294967295 | b >>> 11);
    b = a + (e ^ (c | ~g)) + f2[12] + 1700485571 & 4294967295;
    a = c + (b << 6 & 4294967295 | b >>> 26);
    b = g + (c ^ (a | ~e)) + f2[3] + 2399980690 & 4294967295;
    g = a + (b << 10 & 4294967295 | b >>> 22);
    b = e + (a ^ (g | ~c)) + f2[10] + 4293915773 & 4294967295;
    e = g + (b << 15 & 4294967295 | b >>> 17);
    b = c + (g ^ (e | ~a)) + f2[1] + 2240044497 & 4294967295;
    c = e + (b << 21 & 4294967295 | b >>> 11);
    b = a + (e ^ (c | ~g)) + f2[8] + 1873313359 & 4294967295;
    a = c + (b << 6 & 4294967295 | b >>> 26);
    b = g + (c ^ (a | ~e)) + f2[15] + 4264355552 & 4294967295;
    g = a + (b << 10 & 4294967295 | b >>> 22);
    b = e + (a ^ (g | ~c)) + f2[6] + 2734768916 & 4294967295;
    e = g + (b << 15 & 4294967295 | b >>> 17);
    b = c + (g ^ (e | ~a)) + f2[13] + 1309151649 & 4294967295;
    c = e + (b << 21 & 4294967295 | b >>> 11);
    b = a + (e ^ (c | ~g)) + f2[4] + 4149444226 & 4294967295;
    a = c + (b << 6 & 4294967295 | b >>> 26);
    b = g + (c ^ (a | ~e)) + f2[11] + 3174756917 & 4294967295;
    g = a + (b << 10 & 4294967295 | b >>> 22);
    b = e + (a ^ (g | ~c)) + f2[2] + 718787259 & 4294967295;
    e = g + (b << 15 & 4294967295 | b >>> 17);
    b = c + (g ^ (e | ~a)) + f2[9] + 3951481745 & 4294967295;
    d.g[0] = d.g[0] + a & 4294967295;
    d.g[1] = d.g[1] + (e + (b << 21 & 4294967295 | b >>> 11)) & 4294967295;
    d.g[2] = d.g[2] + e & 4294967295;
    d.g[3] = d.g[3] + g & 4294967295;
  }
  m2.prototype.v = function(d, a) {
    a === void 0 && (a = d.length);
    const c = a - this.blockSize, f2 = this.C;
    let e = this.h, g = 0;
    for (; g < a; ) {
      if (e == 0) for (; g <= c; ) n2(this, d, g), g += this.blockSize;
      if (typeof d === "string") for (; g < a; ) {
        if (f2[e++] = d.charCodeAt(g++), e == this.blockSize) {
          n2(this, f2);
          e = 0;
          break;
        }
      }
      else for (; g < a; ) if (f2[e++] = d[g++], e == this.blockSize) {
        n2(this, f2);
        e = 0;
        break;
      }
    }
    this.h = e;
    this.o += a;
  };
  m2.prototype.A = function() {
    var d = Array((this.h < 56 ? this.blockSize : this.blockSize * 2) - this.h);
    d[0] = 128;
    for (var a = 1; a < d.length - 8; ++a) d[a] = 0;
    a = this.o * 8;
    for (var c = d.length - 8; c < d.length; ++c) d[c] = a & 255, a /= 256;
    this.v(d);
    d = Array(16);
    a = 0;
    for (c = 0; c < 4; ++c) for (let f2 = 0; f2 < 32; f2 += 8) d[a++] = this.g[c] >>> f2 & 255;
    return d;
  };
  function p2(d, a) {
    var c = q2;
    return Object.prototype.hasOwnProperty.call(c, d) ? c[d] : c[d] = a(d);
  }
  function t2(d, a) {
    this.h = a;
    const c = [];
    let f2 = true;
    for (let e = d.length - 1; e >= 0; e--) {
      const g = d[e] | 0;
      f2 && g == a || (c[e] = g, f2 = false);
    }
    this.g = c;
  }
  var q2 = {};
  function u2(d) {
    return -128 <= d && d < 128 ? p2(d, function(a) {
      return new t2([a | 0], a < 0 ? -1 : 0);
    }) : new t2([d | 0], d < 0 ? -1 : 0);
  }
  function v2(d) {
    if (isNaN(d) || !isFinite(d)) return w2;
    if (d < 0) return x2(v2(-d));
    const a = [];
    let c = 1;
    for (let f2 = 0; d >= c; f2++) a[f2] = d / c | 0, c *= 4294967296;
    return new t2(a, 0);
  }
  function y2(d, a) {
    if (d.length == 0) throw Error("number format error: empty string");
    a = a || 10;
    if (a < 2 || 36 < a) throw Error("radix out of range: " + a);
    if (d.charAt(0) == "-") return x2(y2(d.substring(1), a));
    if (d.indexOf("-") >= 0) throw Error('number format error: interior "-" character');
    const c = v2(Math.pow(a, 8));
    let f2 = w2;
    for (let g = 0; g < d.length; g += 8) {
      var e = Math.min(8, d.length - g);
      const b = parseInt(d.substring(g, g + e), a);
      e < 8 ? (e = v2(Math.pow(a, e)), f2 = f2.j(e).add(v2(b))) : (f2 = f2.j(c), f2 = f2.add(v2(b)));
    }
    return f2;
  }
  var w2 = u2(0), z2 = u2(1), A2 = u2(16777216);
  h = t2.prototype;
  h.m = function() {
    if (B2(this)) return -x2(this).m();
    let d = 0, a = 1;
    for (let c = 0; c < this.g.length; c++) {
      const f2 = this.i(c);
      d += (f2 >= 0 ? f2 : 4294967296 + f2) * a;
      a *= 4294967296;
    }
    return d;
  };
  h.toString = function(d) {
    d = d || 10;
    if (d < 2 || 36 < d) throw Error("radix out of range: " + d);
    if (C2(this)) return "0";
    if (B2(this)) return "-" + x2(this).toString(d);
    const a = v2(Math.pow(d, 6));
    var c = this;
    let f2 = "";
    for (; ; ) {
      const e = D2(c, a).g;
      c = F2(c, e.j(a));
      let g = ((c.g.length > 0 ? c.g[0] : c.h) >>> 0).toString(d);
      c = e;
      if (C2(c)) return g + f2;
      for (; g.length < 6; ) g = "0" + g;
      f2 = g + f2;
    }
  };
  h.i = function(d) {
    return d < 0 ? 0 : d < this.g.length ? this.g[d] : this.h;
  };
  function C2(d) {
    if (d.h != 0) return false;
    for (let a = 0; a < d.g.length; a++) if (d.g[a] != 0) return false;
    return true;
  }
  function B2(d) {
    return d.h == -1;
  }
  h.l = function(d) {
    d = F2(this, d);
    return B2(d) ? -1 : C2(d) ? 0 : 1;
  };
  function x2(d) {
    const a = d.g.length, c = [];
    for (let f2 = 0; f2 < a; f2++) c[f2] = ~d.g[f2];
    return new t2(c, ~d.h).add(z2);
  }
  h.abs = function() {
    return B2(this) ? x2(this) : this;
  };
  h.add = function(d) {
    const a = Math.max(this.g.length, d.g.length), c = [];
    let f2 = 0;
    for (let e = 0; e <= a; e++) {
      let g = f2 + (this.i(e) & 65535) + (d.i(e) & 65535), b = (g >>> 16) + (this.i(e) >>> 16) + (d.i(e) >>> 16);
      f2 = b >>> 16;
      g &= 65535;
      b &= 65535;
      c[e] = b << 16 | g;
    }
    return new t2(c, c[c.length - 1] & -2147483648 ? -1 : 0);
  };
  function F2(d, a) {
    return d.add(x2(a));
  }
  h.j = function(d) {
    if (C2(this) || C2(d)) return w2;
    if (B2(this)) return B2(d) ? x2(this).j(x2(d)) : x2(x2(this).j(d));
    if (B2(d)) return x2(this.j(x2(d)));
    if (this.l(A2) < 0 && d.l(A2) < 0) return v2(this.m() * d.m());
    const a = this.g.length + d.g.length, c = [];
    for (var f2 = 0; f2 < 2 * a; f2++) c[f2] = 0;
    for (f2 = 0; f2 < this.g.length; f2++) for (let e = 0; e < d.g.length; e++) {
      const g = this.i(f2) >>> 16, b = this.i(f2) & 65535, r2 = d.i(e) >>> 16, E2 = d.i(e) & 65535;
      c[2 * f2 + 2 * e] += b * E2;
      G2(c, 2 * f2 + 2 * e);
      c[2 * f2 + 2 * e + 1] += g * E2;
      G2(c, 2 * f2 + 2 * e + 1);
      c[2 * f2 + 2 * e + 1] += b * r2;
      G2(c, 2 * f2 + 2 * e + 1);
      c[2 * f2 + 2 * e + 2] += g * r2;
      G2(c, 2 * f2 + 2 * e + 2);
    }
    for (d = 0; d < a; d++) c[d] = c[2 * d + 1] << 16 | c[2 * d];
    for (d = a; d < 2 * a; d++) c[d] = 0;
    return new t2(c, 0);
  };
  function G2(d, a) {
    for (; (d[a] & 65535) != d[a]; ) d[a + 1] += d[a] >>> 16, d[a] &= 65535, a++;
  }
  function H2(d, a) {
    this.g = d;
    this.h = a;
  }
  function D2(d, a) {
    if (C2(a)) throw Error("division by zero");
    if (C2(d)) return new H2(w2, w2);
    if (B2(d)) return a = D2(x2(d), a), new H2(x2(a.g), x2(a.h));
    if (B2(a)) return a = D2(d, x2(a)), new H2(x2(a.g), a.h);
    if (d.g.length > 30) {
      if (B2(d) || B2(a)) throw Error("slowDivide_ only works with positive integers.");
      for (var c = z2, f2 = a; f2.l(d) <= 0; ) c = I2(c), f2 = I2(f2);
      var e = J2(c, 1), g = J2(f2, 1);
      f2 = J2(f2, 2);
      for (c = J2(c, 2); !C2(f2); ) {
        var b = g.add(f2);
        b.l(d) <= 0 && (e = e.add(c), g = b);
        f2 = J2(f2, 1);
        c = J2(c, 1);
      }
      a = F2(d, e.j(a));
      return new H2(e, a);
    }
    for (e = w2; d.l(a) >= 0; ) {
      c = Math.max(1, Math.floor(d.m() / a.m()));
      f2 = Math.ceil(Math.log(c) / Math.LN2);
      f2 = f2 <= 48 ? 1 : Math.pow(2, f2 - 48);
      g = v2(c);
      for (b = g.j(a); B2(b) || b.l(d) > 0; ) c -= f2, g = v2(c), b = g.j(a);
      C2(g) && (g = z2);
      e = e.add(g);
      d = F2(d, b);
    }
    return new H2(e, d);
  }
  h.B = function(d) {
    return D2(this, d).h;
  };
  h.and = function(d) {
    const a = Math.max(this.g.length, d.g.length), c = [];
    for (let f2 = 0; f2 < a; f2++) c[f2] = this.i(f2) & d.i(f2);
    return new t2(c, this.h & d.h);
  };
  h.or = function(d) {
    const a = Math.max(this.g.length, d.g.length), c = [];
    for (let f2 = 0; f2 < a; f2++) c[f2] = this.i(f2) | d.i(f2);
    return new t2(c, this.h | d.h);
  };
  h.xor = function(d) {
    const a = Math.max(this.g.length, d.g.length), c = [];
    for (let f2 = 0; f2 < a; f2++) c[f2] = this.i(f2) ^ d.i(f2);
    return new t2(c, this.h ^ d.h);
  };
  function I2(d) {
    const a = d.g.length + 1, c = [];
    for (let f2 = 0; f2 < a; f2++) c[f2] = d.i(f2) << 1 | d.i(f2 - 1) >>> 31;
    return new t2(c, d.h);
  }
  function J2(d, a) {
    const c = a >> 5;
    a %= 32;
    const f2 = d.g.length - c, e = [];
    for (let g = 0; g < f2; g++) e[g] = a > 0 ? d.i(g + c) >>> a | d.i(g + c + 1) << 32 - a : d.i(g + c);
    return new t2(e, d.h);
  }
  m2.prototype.digest = m2.prototype.A;
  m2.prototype.reset = m2.prototype.u;
  m2.prototype.update = m2.prototype.v;
  Md5 = m2;
  t2.prototype.add = t2.prototype.add;
  t2.prototype.multiply = t2.prototype.j;
  t2.prototype.modulo = t2.prototype.B;
  t2.prototype.compare = t2.prototype.l;
  t2.prototype.toNumber = t2.prototype.m;
  t2.prototype.toString = t2.prototype.toString;
  t2.prototype.getBits = t2.prototype.i;
  t2.fromNumber = v2;
  t2.fromString = y2;
  Integer = t2;
}).apply(typeof commonjsGlobal$1 !== "undefined" ? commonjsGlobal$1 : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/
var XhrIo;
var WebChannel;
var EventType;
var ErrorCode;
var Stat;
var Event;
var getStatEventTarget;
var createWebChannelTransport;
(function() {
  var h, aa2 = Object.defineProperty;
  function ba(a) {
    a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof commonjsGlobal && commonjsGlobal];
    for (var b = 0; b < a.length; ++b) {
      var c = a[b];
      if (c && c.Math == Math) return c;
    }
    throw Error("Cannot find global object");
  }
  var ca2 = ba(this);
  function da2(a, b) {
    if (b) a: {
      var c = ca2;
      a = a.split(".");
      for (var d = 0; d < a.length - 1; d++) {
        var e = a[d];
        if (!(e in c)) break a;
        c = c[e];
      }
      a = a[a.length - 1];
      d = c[a];
      b = b(d);
      b != d && b != null && aa2(c, a, { configurable: true, writable: true, value: b });
    }
  }
  da2("Symbol.dispose", function(a) {
    return a ? a : Symbol("Symbol.dispose");
  });
  da2("Array.prototype.values", function(a) {
    return a ? a : function() {
      return this[Symbol.iterator]();
    };
  });
  da2("Object.entries", function(a) {
    return a ? a : function(b) {
      var c = [], d;
      for (d in b) Object.prototype.hasOwnProperty.call(b, d) && c.push([d, b[d]]);
      return c;
    };
  });
  /** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */
  var ea2 = ea2 || {}, l2 = this || self;
  function n2(a) {
    var b = typeof a;
    return b == "object" && a != null || b == "function";
  }
  function fa2(a, b, c) {
    return a.call.apply(a.bind, arguments);
  }
  function p2(a, b, c) {
    p2 = fa2;
    return p2.apply(null, arguments);
  }
  function ha2(a, b) {
    var c = Array.prototype.slice.call(arguments, 1);
    return function() {
      var d = c.slice();
      d.push.apply(d, arguments);
      return a.apply(this, d);
    };
  }
  function t2(a, b) {
    function c() {
    }
    c.prototype = b.prototype;
    a.Z = b.prototype;
    a.prototype = new c();
    a.prototype.constructor = a;
    a.Ob = function(d, e, f2) {
      for (var g = Array(arguments.length - 2), k2 = 2; k2 < arguments.length; k2++) g[k2 - 2] = arguments[k2];
      return b.prototype[e].apply(d, g);
    };
  }
  var ia2 = typeof AsyncContext !== "undefined" && typeof AsyncContext.Snapshot === "function" ? (a) => a && AsyncContext.Snapshot.wrap(a) : (a) => a;
  function ja2(a) {
    const b = a.length;
    if (b > 0) {
      const c = Array(b);
      for (let d = 0; d < b; d++) c[d] = a[d];
      return c;
    }
    return [];
  }
  function ka2(a, b) {
    for (let d = 1; d < arguments.length; d++) {
      const e = arguments[d];
      var c = typeof e;
      c = c != "object" ? c : e ? Array.isArray(e) ? "array" : c : "null";
      if (c == "array" || c == "object" && typeof e.length == "number") {
        c = a.length || 0;
        const f2 = e.length || 0;
        a.length = c + f2;
        for (let g = 0; g < f2; g++) a[c + g] = e[g];
      } else a.push(e);
    }
  }
  class la2 {
    constructor(a, b) {
      this.i = a;
      this.j = b;
      this.h = 0;
      this.g = null;
    }
    get() {
      let a;
      this.h > 0 ? (this.h--, a = this.g, this.g = a.next, a.next = null) : a = this.i();
      return a;
    }
  }
  function ma2(a) {
    l2.setTimeout(() => {
      throw a;
    }, 0);
  }
  function na() {
    var a = oa2;
    let b = null;
    a.g && (b = a.g, a.g = a.g.next, a.g || (a.h = null), b.next = null);
    return b;
  }
  class pa2 {
    constructor() {
      this.h = this.g = null;
    }
    add(a, b) {
      const c = qa2.get();
      c.set(a, b);
      this.h ? this.h.next = c : this.g = c;
      this.h = c;
    }
  }
  var qa2 = new la2(() => new ra2(), (a) => a.reset());
  class ra2 {
    constructor() {
      this.next = this.g = this.h = null;
    }
    set(a, b) {
      this.h = a;
      this.g = b;
      this.next = null;
    }
    reset() {
      this.next = this.g = this.h = null;
    }
  }
  let u2, v2 = false, oa2 = new pa2(), ta2 = () => {
    const a = Promise.resolve(void 0);
    u2 = () => {
      a.then(sa2);
    };
  };
  function sa2() {
    for (var a; a = na(); ) {
      try {
        a.h.call(a.g);
      } catch (c) {
        ma2(c);
      }
      var b = qa2;
      b.j(a);
      b.h < 100 && (b.h++, a.next = b.g, b.g = a);
    }
    v2 = false;
  }
  function w2() {
    this.u = this.u;
    this.C = this.C;
  }
  w2.prototype.u = false;
  w2.prototype.dispose = function() {
    this.u || (this.u = true, this.N());
  };
  w2.prototype[Symbol.dispose] = function() {
    this.dispose();
  };
  w2.prototype.N = function() {
    if (this.C) for (; this.C.length; ) this.C.shift()();
  };
  function x2(a, b) {
    this.type = a;
    this.g = this.target = b;
    this.defaultPrevented = false;
  }
  x2.prototype.h = function() {
    this.defaultPrevented = true;
  };
  var ua2 = function() {
    if (!l2.addEventListener || !Object.defineProperty) return false;
    var a = false, b = Object.defineProperty({}, "passive", { get: function() {
      a = true;
    } });
    try {
      const c = () => {
      };
      l2.addEventListener("test", c, b);
      l2.removeEventListener("test", c, b);
    } catch (c) {
    }
    return a;
  }();
  function y2(a) {
    return /^[\s\xa0]*$/.test(a);
  }
  function z2(a, b) {
    x2.call(this, a ? a.type : "");
    this.relatedTarget = this.g = this.target = null;
    this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
    this.key = "";
    this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = false;
    this.state = null;
    this.pointerId = 0;
    this.pointerType = "";
    this.i = null;
    a && this.init(a, b);
  }
  t2(z2, x2);
  z2.prototype.init = function(a, b) {
    const c = this.type = a.type, d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
    this.target = a.target || a.srcElement;
    this.g = b;
    b = a.relatedTarget;
    b || (c == "mouseover" ? b = a.fromElement : c == "mouseout" && (b = a.toElement));
    this.relatedTarget = b;
    d ? (this.clientX = d.clientX !== void 0 ? d.clientX : d.pageX, this.clientY = d.clientY !== void 0 ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.clientX = a.clientX !== void 0 ? a.clientX : a.pageX, this.clientY = a.clientY !== void 0 ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
    this.button = a.button;
    this.key = a.key || "";
    this.ctrlKey = a.ctrlKey;
    this.altKey = a.altKey;
    this.shiftKey = a.shiftKey;
    this.metaKey = a.metaKey;
    this.pointerId = a.pointerId || 0;
    this.pointerType = a.pointerType;
    this.state = a.state;
    this.i = a;
    a.defaultPrevented && z2.Z.h.call(this);
  };
  z2.prototype.h = function() {
    z2.Z.h.call(this);
    const a = this.i;
    a.preventDefault ? a.preventDefault() : a.returnValue = false;
  };
  var B2 = "closure_listenable_" + (Math.random() * 1e6 | 0);
  var va2 = 0;
  function wa2(a, b, c, d, e) {
    this.listener = a;
    this.proxy = null;
    this.src = b;
    this.type = c;
    this.capture = !!d;
    this.ha = e;
    this.key = ++va2;
    this.da = this.fa = false;
  }
  function xa(a) {
    a.da = true;
    a.listener = null;
    a.proxy = null;
    a.src = null;
    a.ha = null;
  }
  function ya2(a, b, c) {
    for (const d in a) b.call(c, a[d], d, a);
  }
  function Aa2(a, b) {
    for (const c in a) b.call(void 0, a[c], c, a);
  }
  function Ba2(a) {
    const b = {};
    for (const c in a) b[c] = a[c];
    return b;
  }
  const Ca2 = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
  function Da2(a, b) {
    let c, d;
    for (let e = 1; e < arguments.length; e++) {
      d = arguments[e];
      for (c in d) a[c] = d[c];
      for (let f2 = 0; f2 < Ca2.length; f2++) c = Ca2[f2], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  }
  function Ea2(a) {
    this.src = a;
    this.g = {};
    this.h = 0;
  }
  Ea2.prototype.add = function(a, b, c, d, e) {
    const f2 = a.toString();
    a = this.g[f2];
    a || (a = this.g[f2] = [], this.h++);
    const g = Fa2(a, b, d, e);
    g > -1 ? (b = a[g], c || (b.fa = false)) : (b = new wa2(b, this.src, f2, !!d, e), b.fa = c, a.push(b));
    return b;
  };
  function Ga2(a, b) {
    const c = b.type;
    if (c in a.g) {
      var d = a.g[c], e = Array.prototype.indexOf.call(d, b, void 0), f2;
      (f2 = e >= 0) && Array.prototype.splice.call(d, e, 1);
      f2 && (xa(b), a.g[c].length == 0 && (delete a.g[c], a.h--));
    }
  }
  function Fa2(a, b, c, d) {
    for (let e = 0; e < a.length; ++e) {
      const f2 = a[e];
      if (!f2.da && f2.listener == b && f2.capture == !!c && f2.ha == d) return e;
    }
    return -1;
  }
  var Ha2 = "closure_lm_" + (Math.random() * 1e6 | 0), Ia2 = {};
  function Ka2(a, b, c, d, e) {
    if (Array.isArray(b)) {
      for (let f2 = 0; f2 < b.length; f2++) Ka2(a, b[f2], c, d, e);
      return null;
    }
    c = Ma2(c);
    return a && a[B2] ? a.J(b, c, n2(d) ? !!d.capture : false, e) : Na2(a, b, c, false, d, e);
  }
  function Na2(a, b, c, d, e, f2) {
    if (!b) throw Error("Invalid event type");
    const g = n2(e) ? !!e.capture : !!e;
    let k2 = Oa2(a);
    k2 || (a[Ha2] = k2 = new Ea2(a));
    c = k2.add(b, c, d, g, f2);
    if (c.proxy) return c;
    d = Pa2();
    c.proxy = d;
    d.src = a;
    d.listener = c;
    if (a.addEventListener) ua2 || (e = g), e === void 0 && (e = false), a.addEventListener(b.toString(), d, e);
    else if (a.attachEvent) a.attachEvent(Qa2(b.toString()), d);
    else if (a.addListener && a.removeListener) a.addListener(d);
    else throw Error("addEventListener and attachEvent are unavailable.");
    return c;
  }
  function Pa2() {
    function a(c) {
      return b.call(a.src, a.listener, c);
    }
    const b = Ra2;
    return a;
  }
  function Sa2(a, b, c, d, e) {
    if (Array.isArray(b)) for (var f2 = 0; f2 < b.length; f2++) Sa2(a, b[f2], c, d, e);
    else (d = n2(d) ? !!d.capture : !!d, c = Ma2(c), a && a[B2]) ? (a = a.i, f2 = String(b).toString(), f2 in a.g && (b = a.g[f2], c = Fa2(b, c, d, e), c > -1 && (xa(b[c]), Array.prototype.splice.call(b, c, 1), b.length == 0 && (delete a.g[f2], a.h--)))) : a && (a = Oa2(a)) && (b = a.g[b.toString()], a = -1, b && (a = Fa2(b, c, d, e)), (c = a > -1 ? b[a] : null) && Ta2(c));
  }
  function Ta2(a) {
    if (typeof a !== "number" && a && !a.da) {
      var b = a.src;
      if (b && b[B2]) Ga2(b.i, a);
      else {
        var c = a.type, d = a.proxy;
        b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(Qa2(c), d) : b.addListener && b.removeListener && b.removeListener(d);
        (c = Oa2(b)) ? (Ga2(c, a), c.h == 0 && (c.src = null, b[Ha2] = null)) : xa(a);
      }
    }
  }
  function Qa2(a) {
    return a in Ia2 ? Ia2[a] : Ia2[a] = "on" + a;
  }
  function Ra2(a, b) {
    if (a.da) a = true;
    else {
      b = new z2(b, this);
      const c = a.listener, d = a.ha || a.src;
      a.fa && Ta2(a);
      a = c.call(d, b);
    }
    return a;
  }
  function Oa2(a) {
    a = a[Ha2];
    return a instanceof Ea2 ? a : null;
  }
  var Ua2 = "__closure_events_fn_" + (Math.random() * 1e9 >>> 0);
  function Ma2(a) {
    if (typeof a === "function") return a;
    a[Ua2] || (a[Ua2] = function(b) {
      return a.handleEvent(b);
    });
    return a[Ua2];
  }
  function C2() {
    w2.call(this);
    this.i = new Ea2(this);
    this.M = this;
    this.G = null;
  }
  t2(C2, w2);
  C2.prototype[B2] = true;
  C2.prototype.removeEventListener = function(a, b, c, d) {
    Sa2(this, a, b, c, d);
  };
  function D2(a, b) {
    var c, d = a.G;
    if (d) for (c = []; d; d = d.G) c.push(d);
    a = a.M;
    d = b.type || b;
    if (typeof b === "string") b = new x2(b, a);
    else if (b instanceof x2) b.target = b.target || a;
    else {
      var e = b;
      b = new x2(d, a);
      Da2(b, e);
    }
    e = true;
    let f2, g;
    if (c) for (g = c.length - 1; g >= 0; g--) f2 = b.g = c[g], e = Va2(f2, d, true, b) && e;
    f2 = b.g = a;
    e = Va2(f2, d, true, b) && e;
    e = Va2(f2, d, false, b) && e;
    if (c) for (g = 0; g < c.length; g++) f2 = b.g = c[g], e = Va2(f2, d, false, b) && e;
  }
  C2.prototype.N = function() {
    C2.Z.N.call(this);
    if (this.i) {
      var a = this.i;
      for (const c in a.g) {
        const d = a.g[c];
        for (let e = 0; e < d.length; e++) xa(d[e]);
        delete a.g[c];
        a.h--;
      }
    }
    this.G = null;
  };
  C2.prototype.J = function(a, b, c, d) {
    return this.i.add(String(a), b, false, c, d);
  };
  C2.prototype.K = function(a, b, c, d) {
    return this.i.add(String(a), b, true, c, d);
  };
  function Va2(a, b, c, d) {
    b = a.i.g[String(b)];
    if (!b) return true;
    b = b.concat();
    let e = true;
    for (let f2 = 0; f2 < b.length; ++f2) {
      const g = b[f2];
      if (g && !g.da && g.capture == c) {
        const k2 = g.listener, q2 = g.ha || g.src;
        g.fa && Ga2(a.i, g);
        e = k2.call(q2, d) !== false && e;
      }
    }
    return e && !d.defaultPrevented;
  }
  function Wa2(a, b) {
    if (typeof a !== "function") if (a && typeof a.handleEvent == "function") a = p2(a.handleEvent, a);
    else throw Error("Invalid listener argument");
    return Number(b) > 2147483647 ? -1 : l2.setTimeout(a, b || 0);
  }
  function Xa2(a) {
    a.g = Wa2(() => {
      a.g = null;
      a.i && (a.i = false, Xa2(a));
    }, a.l);
    const b = a.h;
    a.h = null;
    a.m.apply(null, b);
  }
  class Ya2 extends w2 {
    constructor(a, b) {
      super();
      this.m = a;
      this.l = b;
      this.h = null;
      this.i = false;
      this.g = null;
    }
    j(a) {
      this.h = arguments;
      this.g ? this.i = true : Xa2(this);
    }
    N() {
      super.N();
      this.g && (l2.clearTimeout(this.g), this.g = null, this.i = false, this.h = null);
    }
  }
  function E2(a) {
    w2.call(this);
    this.h = a;
    this.g = {};
  }
  t2(E2, w2);
  var Za2 = [];
  function $a(a) {
    ya2(a.g, function(b, c) {
      this.g.hasOwnProperty(c) && Ta2(b);
    }, a);
    a.g = {};
  }
  E2.prototype.N = function() {
    E2.Z.N.call(this);
    $a(this);
  };
  E2.prototype.handleEvent = function() {
    throw Error("EventHandler.handleEvent not implemented");
  };
  var ab2 = l2.JSON.stringify;
  var cb2 = l2.JSON.parse;
  var db2 = class {
    stringify(a) {
      return l2.JSON.stringify(a, void 0);
    }
    parse(a) {
      return l2.JSON.parse(a, void 0);
    }
  };
  function eb2() {
  }
  function fb2() {
  }
  var H2 = { OPEN: "a", hb: "b", ERROR: "c", tb: "d" };
  function gb2() {
    x2.call(this, "d");
  }
  t2(gb2, x2);
  function hb2() {
    x2.call(this, "c");
  }
  t2(hb2, x2);
  var I2 = {}, ib2 = null;
  function jb2() {
    return ib2 = ib2 || new C2();
  }
  I2.Ia = "serverreachability";
  function kb2(a) {
    x2.call(this, I2.Ia, a);
  }
  t2(kb2, x2);
  function lb2(a) {
    const b = jb2();
    D2(b, new kb2(b));
  }
  I2.STAT_EVENT = "statevent";
  function mb2(a, b) {
    x2.call(this, I2.STAT_EVENT, a);
    this.stat = b;
  }
  t2(mb2, x2);
  function J2(a) {
    const b = jb2();
    D2(b, new mb2(b, a));
  }
  I2.Ja = "timingevent";
  function nb2(a, b) {
    x2.call(this, I2.Ja, a);
    this.size = b;
  }
  t2(nb2, x2);
  function ob2(a, b) {
    if (typeof a !== "function") throw Error("Fn must not be null and must be a function");
    return l2.setTimeout(function() {
      a();
    }, b);
  }
  function pb2() {
    this.g = true;
  }
  pb2.prototype.ua = function() {
    this.g = false;
  };
  function qb2(a, b, c, d, e, f2) {
    a.info(function() {
      if (a.g) if (f2) {
        var g = "";
        var k2 = f2.split("&");
        for (let m2 = 0; m2 < k2.length; m2++) {
          var q2 = k2[m2].split("=");
          if (q2.length > 1) {
            const r2 = q2[0];
            q2 = q2[1];
            const A2 = r2.split("_");
            g = A2.length >= 2 && A2[1] == "type" ? g + (r2 + "=" + q2 + "&") : g + (r2 + "=redacted&");
          }
        }
      } else g = null;
      else g = f2;
      return "XMLHTTP REQ (" + d + ") [attempt " + e + "]: " + b + "\n" + c + "\n" + g;
    });
  }
  function rb2(a, b, c, d, e, f2, g) {
    a.info(function() {
      return "XMLHTTP RESP (" + d + ") [ attempt " + e + "]: " + b + "\n" + c + "\n" + f2 + " " + g;
    });
  }
  function K2(a, b, c, d) {
    a.info(function() {
      return "XMLHTTP TEXT (" + b + "): " + sb2(a, c) + (d ? " " + d : "");
    });
  }
  function tb2(a, b) {
    a.info(function() {
      return "TIMEOUT: " + b;
    });
  }
  pb2.prototype.info = function() {
  };
  function sb2(a, b) {
    if (!a.g) return b;
    if (!b) return null;
    try {
      const f2 = JSON.parse(b);
      if (f2) {
        for (a = 0; a < f2.length; a++) if (Array.isArray(f2[a])) {
          var c = f2[a];
          if (!(c.length < 2)) {
            var d = c[1];
            if (Array.isArray(d) && !(d.length < 1)) {
              var e = d[0];
              if (e != "noop" && e != "stop" && e != "close") for (let g = 1; g < d.length; g++) d[g] = "";
            }
          }
        }
      }
      return ab2(f2);
    } catch (f2) {
      return b;
    }
  }
  var ub2 = { NO_ERROR: 0, cb: 1, qb: 2, pb: 3, kb: 4, ob: 5, rb: 6, Ga: 7, TIMEOUT: 8, ub: 9 };
  var vb2 = { ib: "complete", Fb: "success", ERROR: "error", Ga: "abort", xb: "ready", yb: "readystatechange", TIMEOUT: "timeout", sb: "incrementaldata", wb: "progress", lb: "downloadprogress", Nb: "uploadprogress" };
  var wb2;
  function xb2() {
  }
  t2(xb2, eb2);
  xb2.prototype.g = function() {
    return new XMLHttpRequest();
  };
  wb2 = new xb2();
  function L2(a) {
    return encodeURIComponent(String(a));
  }
  function yb2(a) {
    var b = 1;
    a = a.split(":");
    const c = [];
    for (; b > 0 && a.length; ) c.push(a.shift()), b--;
    a.length && c.push(a.join(":"));
    return c;
  }
  function N2(a, b, c, d) {
    this.j = a;
    this.i = b;
    this.l = c;
    this.S = d || 1;
    this.V = new E2(this);
    this.H = 45e3;
    this.J = null;
    this.o = false;
    this.u = this.B = this.A = this.M = this.F = this.T = this.D = null;
    this.G = [];
    this.g = null;
    this.C = 0;
    this.m = this.v = null;
    this.X = -1;
    this.K = false;
    this.P = 0;
    this.O = null;
    this.W = this.L = this.U = this.R = false;
    this.h = new zb2();
  }
  function zb2() {
    this.i = null;
    this.g = "";
    this.h = false;
  }
  var Ab2 = {}, Bb2 = {};
  function Cb2(a, b, c) {
    a.M = 1;
    a.A = Db2(O2(b));
    a.u = c;
    a.R = true;
    Eb2(a, null);
  }
  function Eb2(a, b) {
    a.F = Date.now();
    Fb2(a);
    a.B = O2(a.A);
    var c = a.B, d = a.S;
    Array.isArray(d) || (d = [String(d)]);
    Gb2(c.i, "t", d);
    a.C = 0;
    c = a.j.L;
    a.h = new zb2();
    a.g = Hb2(a.j, c ? b : null, !a.u);
    a.P > 0 && (a.O = new Ya2(p2(a.Y, a, a.g), a.P));
    b = a.V;
    c = a.g;
    d = a.ba;
    var e = "readystatechange";
    Array.isArray(e) || (e && (Za2[0] = e.toString()), e = Za2);
    for (let f2 = 0; f2 < e.length; f2++) {
      const g = Ka2(c, e[f2], d || b.handleEvent, false, b.h || b);
      if (!g) break;
      b.g[g.key] = g;
    }
    b = a.J ? Ba2(a.J) : {};
    a.u ? (a.v || (a.v = "POST"), b["Content-Type"] = "application/x-www-form-urlencoded", a.g.ea(
      a.B,
      a.v,
      a.u,
      b
    )) : (a.v = "GET", a.g.ea(a.B, a.v, null, b));
    lb2();
    qb2(a.i, a.v, a.B, a.l, a.S, a.u);
  }
  N2.prototype.ba = function(a) {
    a = a.target;
    const b = this.O;
    b && P2(a) == 3 ? b.j() : this.Y(a);
  };
  N2.prototype.Y = function(a) {
    try {
      if (a == this.g) a: {
        const k2 = P2(this.g), q2 = this.g.ya(), m2 = this.g.ca();
        if (!(k2 < 3) && (k2 != 3 || this.g && (this.h.h || this.g.la() || Ib2(this.g)))) {
          this.K || k2 != 4 || q2 == 7 || (q2 == 8 || m2 <= 0 ? lb2(3) : lb2(2));
          Jb2(this);
          var b = this.g.ca();
          this.X = b;
          var c = Kb2(this);
          this.o = b == 200;
          rb2(this.i, this.v, this.B, this.l, this.S, k2, b);
          if (this.o) {
            if (this.U && !this.L) {
              b: {
                if (this.g) {
                  var d, e = this.g;
                  if ((d = e.g ? e.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !y2(d)) {
                    var f2 = d;
                    break b;
                  }
                }
                f2 = null;
              }
              if (a = f2) K2(this.i, this.l, a, "Initial handshake response via X-HTTP-Initial-Response"), this.L = true, Lb2(this, a);
              else {
                this.o = false;
                this.m = 3;
                J2(12);
                Q2(this);
                Mb(this);
                break a;
              }
            }
            if (this.R) {
              a = true;
              let r2;
              for (; !this.K && this.C < c.length; ) if (r2 = Nb2(this, c), r2 == Bb2) {
                k2 == 4 && (this.m = 4, J2(14), a = false);
                K2(this.i, this.l, null, "[Incomplete Response]");
                break;
              } else if (r2 == Ab2) {
                this.m = 4;
                J2(15);
                K2(this.i, this.l, c, "[Invalid Chunk]");
                a = false;
                break;
              } else K2(this.i, this.l, r2, null), Lb2(this, r2);
              Ob2(this) && this.C != 0 && (this.h.g = this.h.g.slice(this.C), this.C = 0);
              k2 != 4 || c.length != 0 || this.h.h || (this.m = 1, J2(16), a = false);
              this.o = this.o && a;
              if (!a) K2(
                this.i,
                this.l,
                c,
                "[Invalid Chunked Response]"
              ), Q2(this), Mb(this);
              else if (c.length > 0 && !this.W) {
                this.W = true;
                var g = this.j;
                g.g == this && g.aa && !g.P && (g.j.info("Great, no buffering proxy detected. Bytes received: " + c.length), Pb2(g), g.P = true, J2(11));
              }
            } else K2(this.i, this.l, c, null), Lb2(this, c);
            k2 == 4 && Q2(this);
            this.o && !this.K && (k2 == 4 ? Qb2(this.j, this) : (this.o = false, Fb2(this)));
          } else Rb2(this.g), b == 400 && c.indexOf("Unknown SID") > 0 ? (this.m = 3, J2(12)) : (this.m = 0, J2(13)), Q2(this), Mb(this);
        }
      }
    } catch (k2) {
    } finally {
    }
  };
  function Kb2(a) {
    if (!Ob2(a)) return a.g.la();
    const b = Ib2(a.g);
    if (b === "") return "";
    let c = "";
    const d = b.length, e = P2(a.g) == 4;
    if (!a.h.i) {
      if (typeof TextDecoder === "undefined") return Q2(a), Mb(a), "";
      a.h.i = new l2.TextDecoder();
    }
    for (let f2 = 0; f2 < d; f2++) a.h.h = true, c += a.h.i.decode(b[f2], { stream: !(e && f2 == d - 1) });
    b.length = 0;
    a.h.g += c;
    a.C = 0;
    return a.h.g;
  }
  function Ob2(a) {
    return a.g ? a.v == "GET" && a.M != 2 && a.j.Aa : false;
  }
  function Nb2(a, b) {
    var c = a.C, d = b.indexOf("\n", c);
    if (d == -1) return Bb2;
    c = Number(b.substring(c, d));
    if (isNaN(c)) return Ab2;
    d += 1;
    if (d + c > b.length) return Bb2;
    b = b.slice(d, d + c);
    a.C = d + c;
    return b;
  }
  N2.prototype.cancel = function() {
    this.K = true;
    Q2(this);
  };
  function Fb2(a) {
    a.T = Date.now() + a.H;
    Sb2(a, a.H);
  }
  function Sb2(a, b) {
    if (a.D != null) throw Error("WatchDog timer not null");
    a.D = ob2(p2(a.aa, a), b);
  }
  function Jb2(a) {
    a.D && (l2.clearTimeout(a.D), a.D = null);
  }
  N2.prototype.aa = function() {
    this.D = null;
    const a = Date.now();
    a - this.T >= 0 ? (tb2(this.i, this.B), this.M != 2 && (lb2(), J2(17)), Q2(this), this.m = 2, Mb(this)) : Sb2(this, this.T - a);
  };
  function Mb(a) {
    a.j.I == 0 || a.K || Qb2(a.j, a);
  }
  function Q2(a) {
    Jb2(a);
    var b = a.O;
    b && typeof b.dispose == "function" && b.dispose();
    a.O = null;
    $a(a.V);
    a.g && (b = a.g, a.g = null, b.abort(), b.dispose());
  }
  function Lb2(a, b) {
    try {
      var c = a.j;
      if (c.I != 0 && (c.g == a || Tb2(c.h, a))) {
        if (!a.L && Tb2(c.h, a) && c.I == 3) {
          try {
            var d = c.Ba.g.parse(b);
          } catch (m2) {
            d = null;
          }
          if (Array.isArray(d) && d.length == 3) {
            var e = d;
            if (e[0] == 0) a: {
              if (!c.v) {
                if (c.g) if (c.g.F + 3e3 < a.F) Ub2(c), Vb2(c);
                else break a;
                Wb2(c);
                J2(18);
              }
            }
            else c.xa = e[1], 0 < c.xa - c.K && e[2] < 37500 && c.F && c.A == 0 && !c.C && (c.C = ob2(p2(c.Va, c), 6e3));
            Xb2(c.h) <= 1 && c.ta && (c.ta = void 0);
          } else R2(c, 11);
        } else if ((a.L || c.g == a) && Ub2(c), !y2(b)) for (e = c.Ba.g.parse(b), b = 0; b < e.length; b++) {
          let m2 = e[b];
          const r2 = m2[0];
          if (!(r2 <= c.K)) if (c.K = r2, m2 = m2[1], c.I == 2) if (m2[0] == "c") {
            c.M = m2[1];
            c.ba = m2[2];
            const A2 = m2[3];
            A2 != null && (c.ka = A2, c.j.info("VER=" + c.ka));
            const M2 = m2[4];
            M2 != null && (c.za = M2, c.j.info("SVER=" + c.za));
            const F2 = m2[5];
            F2 != null && typeof F2 === "number" && F2 > 0 && (d = 1.5 * F2, c.O = d, c.j.info("backChannelRequestTimeoutMs_=" + d));
            d = c;
            const G2 = a.g;
            if (G2) {
              const za2 = G2.g ? G2.g.getResponseHeader("X-Client-Wire-Protocol") : null;
              if (za2) {
                var f2 = d.h;
                f2.g || za2.indexOf("spdy") == -1 && za2.indexOf("quic") == -1 && za2.indexOf("h2") == -1 || (f2.j = f2.l, f2.g = /* @__PURE__ */ new Set(), f2.h && (Yb2(f2, f2.h), f2.h = null));
              }
              if (d.G) {
                const bb2 = G2.g ? G2.g.getResponseHeader("X-HTTP-Session-Id") : null;
                bb2 && (d.wa = bb2, S2(d.J, d.G, bb2));
              }
            }
            c.I = 3;
            c.l && c.l.ra();
            c.aa && (c.T = Date.now() - a.F, c.j.info("Handshake RTT: " + c.T + "ms"));
            d = c;
            var g = a;
            d.na = Zb2(d, d.L ? d.ba : null, d.W);
            if (g.L) {
              $b2(d.h, g);
              var k2 = g, q2 = d.O;
              q2 && (k2.H = q2);
              k2.D && (Jb2(k2), Fb2(k2));
              d.g = g;
            } else ac2(d);
            c.i.length > 0 && bc2(c);
          } else m2[0] != "stop" && m2[0] != "close" || R2(c, 7);
          else c.I == 3 && (m2[0] == "stop" || m2[0] == "close" ? m2[0] == "stop" ? R2(c, 7) : cc2(c) : m2[0] != "noop" && c.l && c.l.qa(m2), c.A = 0);
        }
      }
      lb2(4);
    } catch (m2) {
    }
  }
  var dc2 = class {
    constructor(a, b) {
      this.g = a;
      this.map = b;
    }
  };
  function ec2(a) {
    this.l = a || 10;
    l2.PerformanceNavigationTiming ? (a = l2.performance.getEntriesByType("navigation"), a = a.length > 0 && (a[0].nextHopProtocol == "hq" || a[0].nextHopProtocol == "h2")) : a = !!(l2.chrome && l2.chrome.loadTimes && l2.chrome.loadTimes() && l2.chrome.loadTimes().wasFetchedViaSpdy);
    this.j = a ? this.l : 1;
    this.g = null;
    this.j > 1 && (this.g = /* @__PURE__ */ new Set());
    this.h = null;
    this.i = [];
  }
  function fc2(a) {
    return a.h ? true : a.g ? a.g.size >= a.j : false;
  }
  function Xb2(a) {
    return a.h ? 1 : a.g ? a.g.size : 0;
  }
  function Tb2(a, b) {
    return a.h ? a.h == b : a.g ? a.g.has(b) : false;
  }
  function Yb2(a, b) {
    a.g ? a.g.add(b) : a.h = b;
  }
  function $b2(a, b) {
    a.h && a.h == b ? a.h = null : a.g && a.g.has(b) && a.g.delete(b);
  }
  ec2.prototype.cancel = function() {
    this.i = hc2(this);
    if (this.h) this.h.cancel(), this.h = null;
    else if (this.g && this.g.size !== 0) {
      for (const a of this.g.values()) a.cancel();
      this.g.clear();
    }
  };
  function hc2(a) {
    if (a.h != null) return a.i.concat(a.h.G);
    if (a.g != null && a.g.size !== 0) {
      let b = a.i;
      for (const c of a.g.values()) b = b.concat(c.G);
      return b;
    }
    return ja2(a.i);
  }
  var ic2 = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
  function jc2(a, b) {
    if (a) {
      a = a.split("&");
      for (let c = 0; c < a.length; c++) {
        const d = a[c].indexOf("=");
        let e, f2 = null;
        d >= 0 ? (e = a[c].substring(0, d), f2 = a[c].substring(d + 1)) : e = a[c];
        b(e, f2 ? decodeURIComponent(f2.replace(/\+/g, " ")) : "");
      }
    }
  }
  function T2(a) {
    this.g = this.o = this.j = "";
    this.u = null;
    this.m = this.h = "";
    this.l = false;
    let b;
    a instanceof T2 ? (this.l = a.l, kc2(this, a.j), this.o = a.o, this.g = a.g, lc2(this, a.u), this.h = a.h, mc2(this, nc2(a.i)), this.m = a.m) : a && (b = String(a).match(ic2)) ? (this.l = false, kc2(this, b[1] || "", true), this.o = oc2(b[2] || ""), this.g = oc2(b[3] || "", true), lc2(this, b[4]), this.h = oc2(b[5] || "", true), mc2(this, b[6] || "", true), this.m = oc2(b[7] || "")) : (this.l = false, this.i = new pc2(null, this.l));
  }
  T2.prototype.toString = function() {
    const a = [];
    var b = this.j;
    b && a.push(qc2(b, rc2, true), ":");
    var c = this.g;
    if (c || b == "file") a.push("//"), (b = this.o) && a.push(qc2(b, rc2, true), "@"), a.push(L2(c).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.u, c != null && a.push(":", String(c));
    if (c = this.h) this.g && c.charAt(0) != "/" && a.push("/"), a.push(qc2(c, c.charAt(0) == "/" ? sc2 : tc2, true));
    (c = this.i.toString()) && a.push("?", c);
    (c = this.m) && a.push("#", qc2(c, uc2));
    return a.join("");
  };
  T2.prototype.resolve = function(a) {
    const b = O2(this);
    let c = !!a.j;
    c ? kc2(b, a.j) : c = !!a.o;
    c ? b.o = a.o : c = !!a.g;
    c ? b.g = a.g : c = a.u != null;
    var d = a.h;
    if (c) lc2(b, a.u);
    else if (c = !!a.h) {
      if (d.charAt(0) != "/") if (this.g && !this.h) d = "/" + d;
      else {
        var e = b.h.lastIndexOf("/");
        e != -1 && (d = b.h.slice(0, e + 1) + d);
      }
      e = d;
      if (e == ".." || e == ".") d = "";
      else if (e.indexOf("./") != -1 || e.indexOf("/.") != -1) {
        d = e.lastIndexOf("/", 0) == 0;
        e = e.split("/");
        const f2 = [];
        for (let g = 0; g < e.length; ) {
          const k2 = e[g++];
          k2 == "." ? d && g == e.length && f2.push("") : k2 == ".." ? ((f2.length > 1 || f2.length == 1 && f2[0] != "") && f2.pop(), d && g == e.length && f2.push("")) : (f2.push(k2), d = true);
        }
        d = f2.join("/");
      } else d = e;
    }
    c ? b.h = d : c = a.i.toString() !== "";
    c ? mc2(b, nc2(a.i)) : c = !!a.m;
    c && (b.m = a.m);
    return b;
  };
  function O2(a) {
    return new T2(a);
  }
  function kc2(a, b, c) {
    a.j = c ? oc2(b, true) : b;
    a.j && (a.j = a.j.replace(/:$/, ""));
  }
  function lc2(a, b) {
    if (b) {
      b = Number(b);
      if (isNaN(b) || b < 0) throw Error("Bad port number " + b);
      a.u = b;
    } else a.u = null;
  }
  function mc2(a, b, c) {
    b instanceof pc2 ? (a.i = b, vc2(a.i, a.l)) : (c || (b = qc2(b, wc2)), a.i = new pc2(b, a.l));
  }
  function S2(a, b, c) {
    a.i.set(b, c);
  }
  function Db2(a) {
    S2(a, "zx", Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ Date.now()).toString(36));
    return a;
  }
  function oc2(a, b) {
    return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
  }
  function qc2(a, b, c) {
    return typeof a === "string" ? (a = encodeURI(a).replace(b, xc2), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
  }
  function xc2(a) {
    a = a.charCodeAt(0);
    return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
  }
  var rc2 = /[#\/\?@]/g, tc2 = /[#\?:]/g, sc2 = /[#\?]/g, wc2 = /[#\?@]/g, uc2 = /#/g;
  function pc2(a, b) {
    this.h = this.g = null;
    this.i = a || null;
    this.j = !!b;
  }
  function U2(a) {
    a.g || (a.g = /* @__PURE__ */ new Map(), a.h = 0, a.i && jc2(a.i, function(b, c) {
      a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
    }));
  }
  h = pc2.prototype;
  h.add = function(a, b) {
    U2(this);
    this.i = null;
    a = V2(this, a);
    let c = this.g.get(a);
    c || this.g.set(a, c = []);
    c.push(b);
    this.h += 1;
    return this;
  };
  function yc2(a, b) {
    U2(a);
    b = V2(a, b);
    a.g.has(b) && (a.i = null, a.h -= a.g.get(b).length, a.g.delete(b));
  }
  function zc2(a, b) {
    U2(a);
    b = V2(a, b);
    return a.g.has(b);
  }
  h.forEach = function(a, b) {
    U2(this);
    this.g.forEach(function(c, d) {
      c.forEach(function(e) {
        a.call(b, e, d, this);
      }, this);
    }, this);
  };
  function Ac2(a, b) {
    U2(a);
    let c = [];
    if (typeof b === "string") zc2(a, b) && (c = c.concat(a.g.get(V2(a, b))));
    else for (a = Array.from(a.g.values()), b = 0; b < a.length; b++) c = c.concat(a[b]);
    return c;
  }
  h.set = function(a, b) {
    U2(this);
    this.i = null;
    a = V2(this, a);
    zc2(this, a) && (this.h -= this.g.get(a).length);
    this.g.set(a, [b]);
    this.h += 1;
    return this;
  };
  h.get = function(a, b) {
    if (!a) return b;
    a = Ac2(this, a);
    return a.length > 0 ? String(a[0]) : b;
  };
  function Gb2(a, b, c) {
    yc2(a, b);
    c.length > 0 && (a.i = null, a.g.set(V2(a, b), ja2(c)), a.h += c.length);
  }
  h.toString = function() {
    if (this.i) return this.i;
    if (!this.g) return "";
    const a = [], b = Array.from(this.g.keys());
    for (let d = 0; d < b.length; d++) {
      var c = b[d];
      const e = L2(c);
      c = Ac2(this, c);
      for (let f2 = 0; f2 < c.length; f2++) {
        let g = e;
        c[f2] !== "" && (g += "=" + L2(c[f2]));
        a.push(g);
      }
    }
    return this.i = a.join("&");
  };
  function nc2(a) {
    const b = new pc2();
    b.i = a.i;
    a.g && (b.g = new Map(a.g), b.h = a.h);
    return b;
  }
  function V2(a, b) {
    b = String(b);
    a.j && (b = b.toLowerCase());
    return b;
  }
  function vc2(a, b) {
    b && !a.j && (U2(a), a.i = null, a.g.forEach(function(c, d) {
      const e = d.toLowerCase();
      d != e && (yc2(this, d), Gb2(this, e, c));
    }, a));
    a.j = b;
  }
  function Bc2(a, b) {
    const c = new pb2();
    if (l2.Image) {
      const d = new Image();
      d.onload = ha2(W2, c, "TestLoadImage: loaded", true, b, d);
      d.onerror = ha2(W2, c, "TestLoadImage: error", false, b, d);
      d.onabort = ha2(W2, c, "TestLoadImage: abort", false, b, d);
      d.ontimeout = ha2(W2, c, "TestLoadImage: timeout", false, b, d);
      l2.setTimeout(function() {
        if (d.ontimeout) d.ontimeout();
      }, 1e4);
      d.src = a;
    } else b(false);
  }
  function Cc2(a, b) {
    const c = new pb2(), d = new AbortController(), e = setTimeout(() => {
      d.abort();
      W2(c, "TestPingServer: timeout", false, b);
    }, 1e4);
    fetch(a, { signal: d.signal }).then((f2) => {
      clearTimeout(e);
      f2.ok ? W2(c, "TestPingServer: ok", true, b) : W2(c, "TestPingServer: server error", false, b);
    }).catch(() => {
      clearTimeout(e);
      W2(c, "TestPingServer: error", false, b);
    });
  }
  function W2(a, b, c, d, e) {
    try {
      e && (e.onload = null, e.onerror = null, e.onabort = null, e.ontimeout = null), d(c);
    } catch (f2) {
    }
  }
  function Dc2() {
    this.g = new db2();
  }
  function Ec2(a) {
    this.i = a.Sb || null;
    this.h = a.ab || false;
  }
  t2(Ec2, eb2);
  Ec2.prototype.g = function() {
    return new Fc2(this.i, this.h);
  };
  function Fc2(a, b) {
    C2.call(this);
    this.H = a;
    this.o = b;
    this.m = void 0;
    this.status = this.readyState = 0;
    this.responseType = this.responseText = this.response = this.statusText = "";
    this.onreadystatechange = null;
    this.A = new Headers();
    this.h = null;
    this.F = "GET";
    this.D = "";
    this.g = false;
    this.B = this.j = this.l = null;
    this.v = new AbortController();
  }
  t2(Fc2, C2);
  h = Fc2.prototype;
  h.open = function(a, b) {
    if (this.readyState != 0) throw this.abort(), Error("Error reopening a connection");
    this.F = a;
    this.D = b;
    this.readyState = 1;
    Gc2(this);
  };
  h.send = function(a) {
    if (this.readyState != 1) throw this.abort(), Error("need to call open() first. ");
    if (this.v.signal.aborted) throw this.abort(), Error("Request was aborted.");
    this.g = true;
    const b = { headers: this.A, method: this.F, credentials: this.m, cache: void 0, signal: this.v.signal };
    a && (b.body = a);
    (this.H || l2).fetch(new Request(this.D, b)).then(this.Pa.bind(this), this.ga.bind(this));
  };
  h.abort = function() {
    this.response = this.responseText = "";
    this.A = new Headers();
    this.status = 0;
    this.v.abort();
    this.j && this.j.cancel("Request was aborted.").catch(() => {
    });
    this.readyState >= 1 && this.g && this.readyState != 4 && (this.g = false, Hc2(this));
    this.readyState = 0;
  };
  h.Pa = function(a) {
    if (this.g && (this.l = a, this.h || (this.status = this.l.status, this.statusText = this.l.statusText, this.h = a.headers, this.readyState = 2, Gc2(this)), this.g && (this.readyState = 3, Gc2(this), this.g))) if (this.responseType === "arraybuffer") a.arrayBuffer().then(this.Na.bind(this), this.ga.bind(this));
    else if (typeof l2.ReadableStream !== "undefined" && "body" in a) {
      this.j = a.body.getReader();
      if (this.o) {
        if (this.responseType) throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
        this.response = [];
      } else this.response = this.responseText = "", this.B = new TextDecoder();
      Ic2(this);
    } else a.text().then(this.Oa.bind(this), this.ga.bind(this));
  };
  function Ic2(a) {
    a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a));
  }
  h.Ma = function(a) {
    if (this.g) {
      if (this.o && a.value) this.response.push(a.value);
      else if (!this.o) {
        var b = a.value ? a.value : new Uint8Array(0);
        if (b = this.B.decode(b, { stream: !a.done })) this.response = this.responseText += b;
      }
      a.done ? Hc2(this) : Gc2(this);
      this.readyState == 3 && Ic2(this);
    }
  };
  h.Oa = function(a) {
    this.g && (this.response = this.responseText = a, Hc2(this));
  };
  h.Na = function(a) {
    this.g && (this.response = a, Hc2(this));
  };
  h.ga = function() {
    this.g && Hc2(this);
  };
  function Hc2(a) {
    a.readyState = 4;
    a.l = null;
    a.j = null;
    a.B = null;
    Gc2(a);
  }
  h.setRequestHeader = function(a, b) {
    this.A.append(a, b);
  };
  h.getResponseHeader = function(a) {
    return this.h ? this.h.get(a.toLowerCase()) || "" : "";
  };
  h.getAllResponseHeaders = function() {
    if (!this.h) return "";
    const a = [], b = this.h.entries();
    for (var c = b.next(); !c.done; ) c = c.value, a.push(c[0] + ": " + c[1]), c = b.next();
    return a.join("\r\n");
  };
  function Gc2(a) {
    a.onreadystatechange && a.onreadystatechange.call(a);
  }
  Object.defineProperty(Fc2.prototype, "withCredentials", { get: function() {
    return this.m === "include";
  }, set: function(a) {
    this.m = a ? "include" : "same-origin";
  } });
  function Jc2(a) {
    let b = "";
    ya2(a, function(c, d) {
      b += d;
      b += ":";
      b += c;
      b += "\r\n";
    });
    return b;
  }
  function Kc2(a, b, c) {
    a: {
      for (d in c) {
        var d = false;
        break a;
      }
      d = true;
    }
    d || (c = Jc2(c), typeof a === "string" ? c != null && L2(c) : S2(a, b, c));
  }
  function X2(a) {
    C2.call(this);
    this.headers = /* @__PURE__ */ new Map();
    this.L = a || null;
    this.h = false;
    this.g = null;
    this.D = "";
    this.o = 0;
    this.l = "";
    this.j = this.B = this.v = this.A = false;
    this.m = null;
    this.F = "";
    this.H = false;
  }
  t2(X2, C2);
  var Lc2 = /^https?$/i, Mc2 = ["POST", "PUT"];
  h = X2.prototype;
  h.Fa = function(a) {
    this.H = a;
  };
  h.ea = function(a, b, c, d) {
    if (this.g) throw Error("[goog.net.XhrIo] Object is active with another request=" + this.D + "; newUri=" + a);
    b = b ? b.toUpperCase() : "GET";
    this.D = a;
    this.l = "";
    this.o = 0;
    this.A = false;
    this.h = true;
    this.g = this.L ? this.L.g() : wb2.g();
    this.g.onreadystatechange = ia2(p2(this.Ca, this));
    try {
      this.B = true, this.g.open(b, String(a), true), this.B = false;
    } catch (f2) {
      Nc2(this, f2);
      return;
    }
    a = c || "";
    c = new Map(this.headers);
    if (d) if (Object.getPrototypeOf(d) === Object.prototype) for (var e in d) c.set(e, d[e]);
    else if (typeof d.keys === "function" && typeof d.get === "function") for (const f2 of d.keys()) c.set(f2, d.get(f2));
    else throw Error("Unknown input type for opt_headers: " + String(d));
    d = Array.from(c.keys()).find((f2) => "content-type" == f2.toLowerCase());
    e = l2.FormData && a instanceof l2.FormData;
    !(Array.prototype.indexOf.call(Mc2, b, void 0) >= 0) || d || e || c.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    for (const [f2, g] of c) this.g.setRequestHeader(f2, g);
    this.F && (this.g.responseType = this.F);
    "withCredentials" in this.g && this.g.withCredentials !== this.H && (this.g.withCredentials = this.H);
    try {
      this.m && (clearTimeout(this.m), this.m = null), this.v = true, this.g.send(a), this.v = false;
    } catch (f2) {
      Nc2(this, f2);
    }
  };
  function Nc2(a, b) {
    a.h = false;
    a.g && (a.j = true, a.g.abort(), a.j = false);
    a.l = b;
    a.o = 5;
    Oc2(a);
    Pc2(a);
  }
  function Oc2(a) {
    a.A || (a.A = true, D2(a, "complete"), D2(a, "error"));
  }
  h.abort = function(a) {
    this.g && this.h && (this.h = false, this.j = true, this.g.abort(), this.j = false, this.o = a || 7, D2(this, "complete"), D2(this, "abort"), Pc2(this));
  };
  h.N = function() {
    this.g && (this.h && (this.h = false, this.j = true, this.g.abort(), this.j = false), Pc2(this, true));
    X2.Z.N.call(this);
  };
  h.Ca = function() {
    this.u || (this.B || this.v || this.j ? Qc2(this) : this.Xa());
  };
  h.Xa = function() {
    Qc2(this);
  };
  function Qc2(a) {
    if (a.h && typeof ea2 != "undefined") {
      if (a.v && P2(a) == 4) setTimeout(a.Ca.bind(a), 0);
      else if (D2(a, "readystatechange"), P2(a) == 4) {
        a.h = false;
        try {
          const f2 = a.ca();
          a: switch (f2) {
            case 200:
            case 201:
            case 202:
            case 204:
            case 206:
            case 304:
            case 1223:
              var b = true;
              break a;
            default:
              b = false;
          }
          var c;
          if (!(c = b)) {
            var d;
            if (d = f2 === 0) {
              let g = String(a.D).match(ic2)[1] || null;
              !g && l2.self && l2.self.location && (g = l2.self.location.protocol.slice(0, -1));
              d = !Lc2.test(g ? g.toLowerCase() : "");
            }
            c = d;
          }
          if (c) D2(a, "complete"), D2(a, "success");
          else {
            a.o = 6;
            try {
              var e = P2(a) > 2 ? a.g.statusText : "";
            } catch (g) {
              e = "";
            }
            a.l = e + " [" + a.ca() + "]";
            Oc2(a);
          }
        } finally {
          Pc2(a);
        }
      }
    }
  }
  function Pc2(a, b) {
    if (a.g) {
      a.m && (clearTimeout(a.m), a.m = null);
      const c = a.g;
      a.g = null;
      b || D2(a, "ready");
      try {
        c.onreadystatechange = null;
      } catch (d) {
      }
    }
  }
  h.isActive = function() {
    return !!this.g;
  };
  function P2(a) {
    return a.g ? a.g.readyState : 0;
  }
  h.ca = function() {
    try {
      return P2(this) > 2 ? this.g.status : -1;
    } catch (a) {
      return -1;
    }
  };
  h.la = function() {
    try {
      return this.g ? this.g.responseText : "";
    } catch (a) {
      return "";
    }
  };
  h.La = function(a) {
    if (this.g) {
      var b = this.g.responseText;
      a && b.indexOf(a) == 0 && (b = b.substring(a.length));
      return cb2(b);
    }
  };
  function Ib2(a) {
    try {
      if (!a.g) return null;
      if ("response" in a.g) return a.g.response;
      switch (a.F) {
        case "":
        case "text":
          return a.g.responseText;
        case "arraybuffer":
          if ("mozResponseArrayBuffer" in a.g) return a.g.mozResponseArrayBuffer;
      }
      return null;
    } catch (b) {
      return null;
    }
  }
  function Rb2(a) {
    const b = {};
    a = (a.g && P2(a) >= 2 ? a.g.getAllResponseHeaders() || "" : "").split("\r\n");
    for (let d = 0; d < a.length; d++) {
      if (y2(a[d])) continue;
      var c = yb2(a[d]);
      const e = c[0];
      c = c[1];
      if (typeof c !== "string") continue;
      c = c.trim();
      const f2 = b[e] || [];
      b[e] = f2;
      f2.push(c);
    }
    Aa2(b, function(d) {
      return d.join(", ");
    });
  }
  h.ya = function() {
    return this.o;
  };
  h.Ha = function() {
    return typeof this.l === "string" ? this.l : String(this.l);
  };
  function Rc2(a, b, c) {
    return c && c.internalChannelParams ? c.internalChannelParams[a] || b : b;
  }
  function Sc2(a) {
    this.za = 0;
    this.i = [];
    this.j = new pb2();
    this.ba = this.na = this.J = this.W = this.g = this.wa = this.G = this.H = this.u = this.U = this.o = null;
    this.Ya = this.V = 0;
    this.Sa = Rc2("failFast", false, a);
    this.F = this.C = this.v = this.m = this.l = null;
    this.X = true;
    this.xa = this.K = -1;
    this.Y = this.A = this.D = 0;
    this.Qa = Rc2("baseRetryDelayMs", 5e3, a);
    this.Za = Rc2("retryDelaySeedMs", 1e4, a);
    this.Ta = Rc2("forwardChannelMaxRetries", 2, a);
    this.va = Rc2("forwardChannelRequestTimeoutMs", 2e4, a);
    this.ma = a && a.xmlHttpFactory || void 0;
    this.Ua = a && a.Rb || void 0;
    this.Aa = a && a.useFetchStreams || false;
    this.O = void 0;
    this.L = a && a.supportsCrossDomainXhr || false;
    this.M = "";
    this.h = new ec2(a && a.concurrentRequestLimit);
    this.Ba = new Dc2();
    this.S = a && a.fastHandshake || false;
    this.R = a && a.encodeInitMessageHeaders || false;
    this.S && this.R && (this.R = false);
    this.Ra = a && a.Pb || false;
    a && a.ua && this.j.ua();
    a && a.forceLongPolling && (this.X = false);
    this.aa = !this.S && this.X && a && a.detectBufferingProxy || false;
    this.ia = void 0;
    a && a.longPollingTimeout && a.longPollingTimeout > 0 && (this.ia = a.longPollingTimeout);
    this.ta = void 0;
    this.T = 0;
    this.P = false;
    this.ja = this.B = null;
  }
  h = Sc2.prototype;
  h.ka = 8;
  h.I = 1;
  h.connect = function(a, b, c, d) {
    J2(0);
    this.W = a;
    this.H = b || {};
    c && d !== void 0 && (this.H.OSID = c, this.H.OAID = d);
    this.F = this.X;
    this.J = Zb2(this, null, this.W);
    bc2(this);
  };
  function cc2(a) {
    Tc2(a);
    if (a.I == 3) {
      var b = a.V++, c = O2(a.J);
      S2(c, "SID", a.M);
      S2(c, "RID", b);
      S2(c, "TYPE", "terminate");
      Uc2(a, c);
      b = new N2(a, a.j, b);
      b.M = 2;
      b.A = Db2(O2(c));
      c = false;
      if (l2.navigator && l2.navigator.sendBeacon) try {
        c = l2.navigator.sendBeacon(b.A.toString(), "");
      } catch (d) {
      }
      !c && l2.Image && (new Image().src = b.A, c = true);
      c || (b.g = Hb2(b.j, null), b.g.ea(b.A));
      b.F = Date.now();
      Fb2(b);
    }
    Vc2(a);
  }
  function Vb2(a) {
    a.g && (Pb2(a), a.g.cancel(), a.g = null);
  }
  function Tc2(a) {
    Vb2(a);
    a.v && (l2.clearTimeout(a.v), a.v = null);
    Ub2(a);
    a.h.cancel();
    a.m && (typeof a.m === "number" && l2.clearTimeout(a.m), a.m = null);
  }
  function bc2(a) {
    if (!fc2(a.h) && !a.m) {
      a.m = true;
      var b = a.Ea;
      u2 || ta2();
      v2 || (u2(), v2 = true);
      oa2.add(b, a);
      a.D = 0;
    }
  }
  function Wc2(a, b) {
    if (Xb2(a.h) >= a.h.j - (a.m ? 1 : 0)) return false;
    if (a.m) return a.i = b.G.concat(a.i), true;
    if (a.I == 1 || a.I == 2 || a.D >= (a.Sa ? 0 : a.Ta)) return false;
    a.m = ob2(p2(a.Ea, a, b), Xc2(a, a.D));
    a.D++;
    return true;
  }
  h.Ea = function(a) {
    if (this.m) if (this.m = null, this.I == 1) {
      if (!a) {
        this.V = Math.floor(Math.random() * 1e5);
        a = this.V++;
        const e = new N2(this, this.j, a);
        let f2 = this.o;
        this.U && (f2 ? (f2 = Ba2(f2), Da2(f2, this.U)) : f2 = this.U);
        this.u !== null || this.R || (e.J = f2, f2 = null);
        if (this.S) a: {
          var b = 0;
          for (var c = 0; c < this.i.length; c++) {
            b: {
              var d = this.i[c];
              if ("__data__" in d.map && (d = d.map.__data__, typeof d === "string")) {
                d = d.length;
                break b;
              }
              d = void 0;
            }
            if (d === void 0) break;
            b += d;
            if (b > 4096) {
              b = c;
              break a;
            }
            if (b === 4096 || c === this.i.length - 1) {
              b = c + 1;
              break a;
            }
          }
          b = 1e3;
        }
        else b = 1e3;
        b = Yc2(this, e, b);
        c = O2(this.J);
        S2(c, "RID", a);
        S2(c, "CVER", 22);
        this.G && S2(c, "X-HTTP-Session-Id", this.G);
        Uc2(this, c);
        f2 && (this.R ? b = "headers=" + L2(Jc2(f2)) + "&" + b : this.u && Kc2(c, this.u, f2));
        Yb2(this.h, e);
        this.Ra && S2(c, "TYPE", "init");
        this.S ? (S2(c, "$req", b), S2(c, "SID", "null"), e.U = true, Cb2(e, c, null)) : Cb2(e, c, b);
        this.I = 2;
      }
    } else this.I == 3 && (a ? Zc2(this, a) : this.i.length == 0 || fc2(this.h) || Zc2(this));
  };
  function Zc2(a, b) {
    var c;
    b ? c = b.l : c = a.V++;
    const d = O2(a.J);
    S2(d, "SID", a.M);
    S2(d, "RID", c);
    S2(d, "AID", a.K);
    Uc2(a, d);
    a.u && a.o && Kc2(d, a.u, a.o);
    c = new N2(a, a.j, c, a.D + 1);
    a.u === null && (c.J = a.o);
    b && (a.i = b.G.concat(a.i));
    b = Yc2(a, c, 1e3);
    c.H = Math.round(a.va * 0.5) + Math.round(a.va * 0.5 * Math.random());
    Yb2(a.h, c);
    Cb2(c, d, b);
  }
  function Uc2(a, b) {
    a.H && ya2(a.H, function(c, d) {
      S2(b, d, c);
    });
    a.l && ya2({}, function(c, d) {
      S2(b, d, c);
    });
  }
  function Yc2(a, b, c) {
    c = Math.min(a.i.length, c);
    const d = a.l ? p2(a.l.Ka, a.l, a) : null;
    a: {
      var e = a.i;
      let k2 = -1;
      for (; ; ) {
        const q2 = ["count=" + c];
        k2 == -1 ? c > 0 ? (k2 = e[0].g, q2.push("ofs=" + k2)) : k2 = 0 : q2.push("ofs=" + k2);
        let m2 = true;
        for (let r2 = 0; r2 < c; r2++) {
          var f2 = e[r2].g;
          const A2 = e[r2].map;
          f2 -= k2;
          if (f2 < 0) k2 = Math.max(0, e[r2].g - 100), m2 = false;
          else try {
            f2 = "req" + f2 + "_" || "";
            try {
              var g = A2 instanceof Map ? A2 : Object.entries(A2);
              for (const [M2, F2] of g) {
                let G2 = F2;
                n2(F2) && (G2 = ab2(F2));
                q2.push(f2 + M2 + "=" + encodeURIComponent(G2));
              }
            } catch (M2) {
              throw q2.push(f2 + "type=" + encodeURIComponent("_badmap")), M2;
            }
          } catch (M2) {
            d && d(A2);
          }
        }
        if (m2) {
          g = q2.join("&");
          break a;
        }
      }
      g = void 0;
    }
    a = a.i.splice(0, c);
    b.G = a;
    return g;
  }
  function ac2(a) {
    if (!a.g && !a.v) {
      a.Y = 1;
      var b = a.Da;
      u2 || ta2();
      v2 || (u2(), v2 = true);
      oa2.add(b, a);
      a.A = 0;
    }
  }
  function Wb2(a) {
    if (a.g || a.v || a.A >= 3) return false;
    a.Y++;
    a.v = ob2(p2(a.Da, a), Xc2(a, a.A));
    a.A++;
    return true;
  }
  h.Da = function() {
    this.v = null;
    $c2(this);
    if (this.aa && !(this.P || this.g == null || this.T <= 0)) {
      var a = 4 * this.T;
      this.j.info("BP detection timer enabled: " + a);
      this.B = ob2(p2(this.Wa, this), a);
    }
  };
  h.Wa = function() {
    this.B && (this.B = null, this.j.info("BP detection timeout reached."), this.j.info("Buffering proxy detected and switch to long-polling!"), this.F = false, this.P = true, J2(10), Vb2(this), $c2(this));
  };
  function Pb2(a) {
    a.B != null && (l2.clearTimeout(a.B), a.B = null);
  }
  function $c2(a) {
    a.g = new N2(a, a.j, "rpc", a.Y);
    a.u === null && (a.g.J = a.o);
    a.g.P = 0;
    var b = O2(a.na);
    S2(b, "RID", "rpc");
    S2(b, "SID", a.M);
    S2(b, "AID", a.K);
    S2(b, "CI", a.F ? "0" : "1");
    !a.F && a.ia && S2(b, "TO", a.ia);
    S2(b, "TYPE", "xmlhttp");
    Uc2(a, b);
    a.u && a.o && Kc2(b, a.u, a.o);
    a.O && (a.g.H = a.O);
    var c = a.g;
    a = a.ba;
    c.M = 1;
    c.A = Db2(O2(b));
    c.u = null;
    c.R = true;
    Eb2(c, a);
  }
  h.Va = function() {
    this.C != null && (this.C = null, Vb2(this), Wb2(this), J2(19));
  };
  function Ub2(a) {
    a.C != null && (l2.clearTimeout(a.C), a.C = null);
  }
  function Qb2(a, b) {
    var c = null;
    if (a.g == b) {
      Ub2(a);
      Pb2(a);
      a.g = null;
      var d = 2;
    } else if (Tb2(a.h, b)) c = b.G, $b2(a.h, b), d = 1;
    else return;
    if (a.I != 0) {
      if (b.o) if (d == 1) {
        c = b.u ? b.u.length : 0;
        b = Date.now() - b.F;
        var e = a.D;
        d = jb2();
        D2(d, new nb2(d, c));
        bc2(a);
      } else ac2(a);
      else if (e = b.m, e == 3 || e == 0 && b.X > 0 || !(d == 1 && Wc2(a, b) || d == 2 && Wb2(a))) switch (c && c.length > 0 && (b = a.h, b.i = b.i.concat(c)), e) {
        case 1:
          R2(a, 5);
          break;
        case 4:
          R2(a, 10);
          break;
        case 3:
          R2(a, 6);
          break;
        default:
          R2(a, 2);
      }
    }
  }
  function Xc2(a, b) {
    let c = a.Qa + Math.floor(Math.random() * a.Za);
    a.isActive() || (c *= 2);
    return c * b;
  }
  function R2(a, b) {
    a.j.info("Error code " + b);
    if (b == 2) {
      var c = p2(a.bb, a), d = a.Ua;
      const e = !d;
      d = new T2(d || "//www.google.com/images/cleardot.gif");
      l2.location && l2.location.protocol == "http" || kc2(d, "https");
      Db2(d);
      e ? Bc2(d.toString(), c) : Cc2(d.toString(), c);
    } else J2(2);
    a.I = 0;
    a.l && a.l.pa(b);
    Vc2(a);
    Tc2(a);
  }
  h.bb = function(a) {
    a ? (this.j.info("Successfully pinged google.com"), J2(2)) : (this.j.info("Failed to ping google.com"), J2(1));
  };
  function Vc2(a) {
    a.I = 0;
    a.ja = [];
    if (a.l) {
      const b = hc2(a.h);
      if (b.length != 0 || a.i.length != 0) ka2(a.ja, b), ka2(a.ja, a.i), a.h.i.length = 0, ja2(a.i), a.i.length = 0;
      a.l.oa();
    }
  }
  function Zb2(a, b, c) {
    var d = c instanceof T2 ? O2(c) : new T2(c);
    if (d.g != "") b && (d.g = b + "." + d.g), lc2(d, d.u);
    else {
      var e = l2.location;
      d = e.protocol;
      b = b ? b + "." + e.hostname : e.hostname;
      e = +e.port;
      const f2 = new T2(null);
      d && kc2(f2, d);
      b && (f2.g = b);
      e && lc2(f2, e);
      c && (f2.h = c);
      d = f2;
    }
    c = a.G;
    b = a.wa;
    c && b && S2(d, c, b);
    S2(d, "VER", a.ka);
    Uc2(a, d);
    return d;
  }
  function Hb2(a, b, c) {
    if (b && !a.L) throw Error("Can't create secondary domain capable XhrIo object.");
    b = a.Aa && !a.ma ? new X2(new Ec2({ ab: c })) : new X2(a.ma);
    b.Fa(a.L);
    return b;
  }
  h.isActive = function() {
    return !!this.l && this.l.isActive(this);
  };
  function ad2() {
  }
  h = ad2.prototype;
  h.ra = function() {
  };
  h.qa = function() {
  };
  h.pa = function() {
  };
  h.oa = function() {
  };
  h.isActive = function() {
    return true;
  };
  h.Ka = function() {
  };
  function bd2() {
  }
  bd2.prototype.g = function(a, b) {
    return new Y2(a, b);
  };
  function Y2(a, b) {
    C2.call(this);
    this.g = new Sc2(b);
    this.l = a;
    this.h = b && b.messageUrlParams || null;
    a = b && b.messageHeaders || null;
    b && b.clientProtocolHeaderRequired && (a ? a["X-Client-Protocol"] = "webchannel" : a = { "X-Client-Protocol": "webchannel" });
    this.g.o = a;
    a = b && b.initMessageHeaders || null;
    b && b.messageContentType && (a ? a["X-WebChannel-Content-Type"] = b.messageContentType : a = { "X-WebChannel-Content-Type": b.messageContentType });
    b && b.sa && (a ? a["X-WebChannel-Client-Profile"] = b.sa : a = { "X-WebChannel-Client-Profile": b.sa });
    this.g.U = a;
    (a = b && b.Qb) && !y2(a) && (this.g.u = a);
    this.A = b && b.supportsCrossDomainXhr || false;
    this.v = b && b.sendRawJson || false;
    (b = b && b.httpSessionIdParam) && !y2(b) && (this.g.G = b, a = this.h, a !== null && b in a && (a = this.h, b in a && delete a[b]));
    this.j = new Z2(this);
  }
  t2(Y2, C2);
  Y2.prototype.m = function() {
    this.g.l = this.j;
    this.A && (this.g.L = true);
    this.g.connect(this.l, this.h || void 0);
  };
  Y2.prototype.close = function() {
    cc2(this.g);
  };
  Y2.prototype.o = function(a) {
    var b = this.g;
    if (typeof a === "string") {
      var c = {};
      c.__data__ = a;
      a = c;
    } else this.v && (c = {}, c.__data__ = ab2(a), a = c);
    b.i.push(new dc2(b.Ya++, a));
    b.I == 3 && bc2(b);
  };
  Y2.prototype.N = function() {
    this.g.l = null;
    delete this.j;
    cc2(this.g);
    delete this.g;
    Y2.Z.N.call(this);
  };
  function cd2(a) {
    gb2.call(this);
    a.__headers__ && (this.headers = a.__headers__, this.statusCode = a.__status__, delete a.__headers__, delete a.__status__);
    var b = a.__sm__;
    if (b) {
      a: {
        for (const c in b) {
          a = c;
          break a;
        }
        a = void 0;
      }
      if (this.i = a) a = this.i, b = b !== null && a in b ? b[a] : void 0;
      this.data = b;
    } else this.data = a;
  }
  t2(cd2, gb2);
  function dd2() {
    hb2.call(this);
    this.status = 1;
  }
  t2(dd2, hb2);
  function Z2(a) {
    this.g = a;
  }
  t2(Z2, ad2);
  Z2.prototype.ra = function() {
    D2(this.g, "a");
  };
  Z2.prototype.qa = function(a) {
    D2(this.g, new cd2(a));
  };
  Z2.prototype.pa = function(a) {
    D2(this.g, new dd2());
  };
  Z2.prototype.oa = function() {
    D2(this.g, "b");
  };
  bd2.prototype.createWebChannel = bd2.prototype.g;
  Y2.prototype.send = Y2.prototype.o;
  Y2.prototype.open = Y2.prototype.m;
  Y2.prototype.close = Y2.prototype.close;
  createWebChannelTransport = function() {
    return new bd2();
  };
  getStatEventTarget = function() {
    return jb2();
  };
  Event = I2;
  Stat = { jb: 0, mb: 1, nb: 2, Hb: 3, Mb: 4, Jb: 5, Kb: 6, Ib: 7, Gb: 8, Lb: 9, PROXY: 10, NOPROXY: 11, Eb: 12, Ab: 13, Bb: 14, zb: 15, Cb: 16, Db: 17, fb: 18, eb: 19, gb: 20 };
  ub2.NO_ERROR = 0;
  ub2.TIMEOUT = 8;
  ub2.HTTP_ERROR = 6;
  ErrorCode = ub2;
  vb2.COMPLETE = "complete";
  EventType = vb2;
  fb2.EventType = H2;
  H2.OPEN = "a";
  H2.CLOSE = "b";
  H2.ERROR = "c";
  H2.MESSAGE = "d";
  C2.prototype.listen = C2.prototype.J;
  WebChannel = fb2;
  X2.prototype.listenOnce = X2.prototype.K;
  X2.prototype.getLastError = X2.prototype.Ha;
  X2.prototype.getLastErrorCode = X2.prototype.ya;
  X2.prototype.getStatus = X2.prototype.ca;
  X2.prototype.getResponseJson = X2.prototype.La;
  X2.prototype.getResponseText = X2.prototype.la;
  X2.prototype.send = X2.prototype.ea;
  X2.prototype.setWithCredentials = X2.prototype.Fa;
  XhrIo = X2;
}).apply(typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class User {
  constructor(e) {
    this.uid = e;
  }
  isAuthenticated() {
    return null != this.uid;
  }
  /**
   * Returns a key representing this user, suitable for inclusion in a
   * dictionary.
   */
  toKey() {
    return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
  }
  isEqual(e) {
    return e.uid === this.uid;
  }
}
User.UNAUTHENTICATED = new User(null), // TODO(mikelehen): Look into getting a proper uid-equivalent for
// non-FirebaseAuth providers.
User.GOOGLE_CREDENTIALS = new User("google-credentials-uid"), User.FIRST_PARTY = new User("first-party-uid"), User.MOCK_USER = new User("mock-user");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let S = "12.8.0";
function __PRIVATE_setSDKVersion(e) {
  S = e;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const D = new Logger("@firebase/firestore");
function __PRIVATE_getLogLevel() {
  return D.logLevel;
}
function __PRIVATE_logDebug(e, ...t2) {
  if (D.logLevel <= LogLevel.DEBUG) {
    const n2 = t2.map(__PRIVATE_argToString);
    D.debug(`Firestore (${S}): ${e}`, ...n2);
  }
}
function __PRIVATE_logError(e, ...t2) {
  if (D.logLevel <= LogLevel.ERROR) {
    const n2 = t2.map(__PRIVATE_argToString);
    D.error(`Firestore (${S}): ${e}`, ...n2);
  }
}
function __PRIVATE_logWarn(e, ...t2) {
  if (D.logLevel <= LogLevel.WARN) {
    const n2 = t2.map(__PRIVATE_argToString);
    D.warn(`Firestore (${S}): ${e}`, ...n2);
  }
}
function __PRIVATE_argToString(e) {
  if ("string" == typeof e) return e;
  try {
    return function __PRIVATE_formatJSON(e2) {
      return JSON.stringify(e2);
    }(e);
  } catch (t2) {
    return e;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function fail(e, t2, n2) {
  let r2 = "Unexpected state";
  "string" == typeof t2 ? r2 = t2 : n2 = t2, __PRIVATE__fail(e, r2, n2);
}
function __PRIVATE__fail(e, t2, n2) {
  let r2 = `FIRESTORE (${S}) INTERNAL ASSERTION FAILED: ${t2} (ID: ${e.toString(16)})`;
  if (void 0 !== n2) try {
    r2 += " CONTEXT: " + JSON.stringify(n2);
  } catch (e2) {
    r2 += " CONTEXT: " + n2;
  }
  throw __PRIVATE_logError(r2), new Error(r2);
}
function __PRIVATE_hardAssert(e, t2, n2, r2) {
  let i = "Unexpected state";
  "string" == typeof n2 ? i = n2 : r2 = n2, e || __PRIVATE__fail(t2, i, r2);
}
function __PRIVATE_debugCast(e, t2) {
  return e;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const C = {
  // Causes are copied from:
  // https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
  /** Not an error; returned on success. */
  OK: "ok",
  /** The operation was cancelled (typically by the caller). */
  CANCELLED: "cancelled",
  /** Unknown error or an error from a different error domain. */
  UNKNOWN: "unknown",
  /**
   * Client specified an invalid argument. Note that this differs from
   * FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are
   * problematic regardless of the state of the system (e.g., a malformed file
   * name).
   */
  INVALID_ARGUMENT: "invalid-argument",
  /**
   * Deadline expired before operation could complete. For operations that
   * change the state of the system, this error may be returned even if the
   * operation has completed successfully. For example, a successful response
   * from a server could have been delayed long enough for the deadline to
   * expire.
   */
  DEADLINE_EXCEEDED: "deadline-exceeded",
  /** Some requested entity (e.g., file or directory) was not found. */
  NOT_FOUND: "not-found",
  /**
   * Some entity that we attempted to create (e.g., file or directory) already
   * exists.
   */
  ALREADY_EXISTS: "already-exists",
  /**
   * The caller does not have permission to execute the specified operation.
   * PERMISSION_DENIED must not be used for rejections caused by exhausting
   * some resource (use RESOURCE_EXHAUSTED instead for those errors).
   * PERMISSION_DENIED must not be used if the caller cannot be identified
   * (use UNAUTHENTICATED instead for those errors).
   */
  PERMISSION_DENIED: "permission-denied",
  /**
   * The request does not have valid authentication credentials for the
   * operation.
   */
  UNAUTHENTICATED: "unauthenticated",
  /**
   * Some resource has been exhausted, perhaps a per-user quota, or perhaps the
   * entire file system is out of space.
   */
  RESOURCE_EXHAUSTED: "resource-exhausted",
  /**
   * Operation was rejected because the system is not in a state required for
   * the operation's execution. For example, directory to be deleted may be
   * non-empty, an rmdir operation is applied to a non-directory, etc.
   *
   * A litmus test that may help a service implementor in deciding
   * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
   *  (a) Use UNAVAILABLE if the client can retry just the failing call.
   *  (b) Use ABORTED if the client should retry at a higher-level
   *      (e.g., restarting a read-modify-write sequence).
   *  (c) Use FAILED_PRECONDITION if the client should not retry until
   *      the system state has been explicitly fixed. E.g., if an "rmdir"
   *      fails because the directory is non-empty, FAILED_PRECONDITION
   *      should be returned since the client should not retry unless
   *      they have first fixed up the directory by deleting files from it.
   *  (d) Use FAILED_PRECONDITION if the client performs conditional
   *      REST Get/Update/Delete on a resource and the resource on the
   *      server does not match the condition. E.g., conflicting
   *      read-modify-write on the same resource.
   */
  FAILED_PRECONDITION: "failed-precondition",
  /**
   * The operation was aborted, typically due to a concurrency issue like
   * sequencer check failures, transaction aborts, etc.
   *
   * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
   * and UNAVAILABLE.
   */
  ABORTED: "aborted",
  /**
   * Operation was attempted past the valid range. E.g., seeking or reading
   * past end of file.
   *
   * Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed
   * if the system state changes. For example, a 32-bit file system will
   * generate INVALID_ARGUMENT if asked to read at an offset that is not in the
   * range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from
   * an offset past the current file size.
   *
   * There is a fair bit of overlap between FAILED_PRECONDITION and
   * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error)
   * when it applies so that callers who are iterating through a space can
   * easily look for an OUT_OF_RANGE error to detect when they are done.
   */
  OUT_OF_RANGE: "out-of-range",
  /** Operation is not implemented or not supported/enabled in this service. */
  UNIMPLEMENTED: "unimplemented",
  /**
   * Internal errors. Means some invariants expected by underlying System has
   * been broken. If you see one of these errors, Something is very broken.
   */
  INTERNAL: "internal",
  /**
   * The service is currently unavailable. This is a most likely a transient
   * condition and may be corrected by retrying with a backoff.
   *
   * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
   * and UNAVAILABLE.
   */
  UNAVAILABLE: "unavailable",
  /** Unrecoverable data loss or corruption. */
  DATA_LOSS: "data-loss"
};
class FirestoreError extends FirebaseError {
  /** @hideconstructor */
  constructor(e, t2) {
    super(e, t2), this.code = e, this.message = t2, // HACK: We write a toString property directly because Error is not a real
    // class and so inheritance does not work correctly. We could alternatively
    // do the same "back-door inheritance" trick that FirebaseError does.
    this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_Deferred {
  constructor() {
    this.promise = new Promise((e, t2) => {
      this.resolve = e, this.reject = t2;
    });
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_OAuthToken {
  constructor(e, t2) {
    this.user = t2, this.type = "OAuth", this.headers = /* @__PURE__ */ new Map(), this.headers.set("Authorization", `Bearer ${e}`);
  }
}
class __PRIVATE_EmptyAuthCredentialsProvider {
  getToken() {
    return Promise.resolve(null);
  }
  invalidateToken() {
  }
  start(e, t2) {
    e.enqueueRetryable(() => t2(User.UNAUTHENTICATED));
  }
  shutdown() {
  }
}
class __PRIVATE_EmulatorAuthCredentialsProvider {
  constructor(e) {
    this.token = e, /**
     * Stores the listener registered with setChangeListener()
     * This isn't actually necessary since the UID never changes, but we use this
     * to verify the listen contract is adhered to in tests.
     */
    this.changeListener = null;
  }
  getToken() {
    return Promise.resolve(this.token);
  }
  invalidateToken() {
  }
  start(e, t2) {
    this.changeListener = t2, // Fire with initial user.
    e.enqueueRetryable(() => t2(this.token.user));
  }
  shutdown() {
    this.changeListener = null;
  }
}
class __PRIVATE_FirebaseAuthCredentialsProvider {
  constructor(e) {
    this.t = e, /** Tracks the current User. */
    this.currentUser = User.UNAUTHENTICATED, /**
     * Counter used to detect if the token changed while a getToken request was
     * outstanding.
     */
    this.i = 0, this.forceRefresh = false, this.auth = null;
  }
  start(e, t2) {
    __PRIVATE_hardAssert(void 0 === this.o, 42304);
    let n2 = this.i;
    const __PRIVATE_guardedChangeListener = (e2) => this.i !== n2 ? (n2 = this.i, t2(e2)) : Promise.resolve();
    let r2 = new __PRIVATE_Deferred();
    this.o = () => {
      this.i++, this.currentUser = this.u(), r2.resolve(), r2 = new __PRIVATE_Deferred(), e.enqueueRetryable(() => __PRIVATE_guardedChangeListener(this.currentUser));
    };
    const __PRIVATE_awaitNextToken = () => {
      const t3 = r2;
      e.enqueueRetryable(async () => {
        await t3.promise, await __PRIVATE_guardedChangeListener(this.currentUser);
      });
    }, __PRIVATE_registerAuth = (e2) => {
      __PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = e2, this.o && (this.auth.addAuthTokenListener(this.o), __PRIVATE_awaitNextToken());
    };
    this.t.onInit((e2) => __PRIVATE_registerAuth(e2)), // Our users can initialize Auth right after Firestore, so we give it
    // a chance to register itself with the component framework before we
    // determine whether to start up in unauthenticated mode.
    setTimeout(() => {
      if (!this.auth) {
        const e2 = this.t.getImmediate({
          optional: true
        });
        e2 ? __PRIVATE_registerAuth(e2) : (
          // If auth is still not available, proceed with `null` user
          (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth not yet detected"), r2.resolve(), r2 = new __PRIVATE_Deferred())
        );
      }
    }, 0), __PRIVATE_awaitNextToken();
  }
  getToken() {
    const e = this.i, t2 = this.forceRefresh;
    return this.forceRefresh = false, this.auth ? this.auth.getToken(t2).then((t3) => (
      // Cancel the request since the token changed while the request was
      // outstanding so the response is potentially for a previous user (which
      // user, we can't be sure).
      this.i !== e ? (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : t3 ? (__PRIVATE_hardAssert("string" == typeof t3.accessToken, 31837, {
        l: t3
      }), new __PRIVATE_OAuthToken(t3.accessToken, this.currentUser)) : null
    )) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.auth && this.o && this.auth.removeAuthTokenListener(this.o), this.o = void 0;
  }
  // Auth.getUid() can return null even with a user logged in. It is because
  // getUid() is synchronous, but the auth code populating Uid is asynchronous.
  // This method should only be called in the AuthTokenListener callback
  // to guarantee to get the actual user.
  u() {
    const e = this.auth && this.auth.getUid();
    return __PRIVATE_hardAssert(null === e || "string" == typeof e, 2055, {
      h: e
    }), new User(e);
  }
}
class __PRIVATE_FirstPartyToken {
  constructor(e, t2, n2) {
    this.P = e, this.T = t2, this.I = n2, this.type = "FirstParty", this.user = User.FIRST_PARTY, this.R = /* @__PURE__ */ new Map();
  }
  /**
   * Gets an authorization token, using a provided factory function, or return
   * null.
   */
  A() {
    return this.I ? this.I() : null;
  }
  get headers() {
    this.R.set("X-Goog-AuthUser", this.P);
    const e = this.A();
    return e && this.R.set("Authorization", e), this.T && this.R.set("X-Goog-Iam-Authorization-Token", this.T), this.R;
  }
}
class __PRIVATE_FirstPartyAuthCredentialsProvider {
  constructor(e, t2, n2) {
    this.P = e, this.T = t2, this.I = n2;
  }
  getToken() {
    return Promise.resolve(new __PRIVATE_FirstPartyToken(this.P, this.T, this.I));
  }
  start(e, t2) {
    e.enqueueRetryable(() => t2(User.FIRST_PARTY));
  }
  shutdown() {
  }
  invalidateToken() {
  }
}
class AppCheckToken {
  constructor(e) {
    this.value = e, this.type = "AppCheck", this.headers = /* @__PURE__ */ new Map(), e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
  }
}
class __PRIVATE_FirebaseAppCheckTokenProvider {
  constructor(t2, n2) {
    this.V = n2, this.forceRefresh = false, this.appCheck = null, this.m = null, this.p = null, _isFirebaseServerApp(t2) && t2.settings.appCheckToken && (this.p = t2.settings.appCheckToken);
  }
  start(e, t2) {
    __PRIVATE_hardAssert(void 0 === this.o, 3512);
    const onTokenChanged = (e2) => {
      null != e2.error && __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${e2.error.message}`);
      const n2 = e2.token !== this.m;
      return this.m = e2.token, __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Received ${n2 ? "new" : "existing"} token.`), n2 ? t2(e2.token) : Promise.resolve();
    };
    this.o = (t3) => {
      e.enqueueRetryable(() => onTokenChanged(t3));
    };
    const __PRIVATE_registerAppCheck = (e2) => {
      __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = e2, this.o && this.appCheck.addTokenListener(this.o);
    };
    this.V.onInit((e2) => __PRIVATE_registerAppCheck(e2)), // Our users can initialize AppCheck after Firestore, so we give it
    // a chance to register itself with the component framework.
    setTimeout(() => {
      if (!this.appCheck) {
        const e2 = this.V.getImmediate({
          optional: true
        });
        e2 ? __PRIVATE_registerAppCheck(e2) : (
          // If AppCheck is still not available, proceed without it.
          __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck not yet detected")
        );
      }
    }, 0);
  }
  getToken() {
    if (this.p) return Promise.resolve(new AppCheckToken(this.p));
    const e = this.forceRefresh;
    return this.forceRefresh = false, this.appCheck ? this.appCheck.getToken(e).then((e2) => e2 ? (__PRIVATE_hardAssert("string" == typeof e2.token, 44558, {
      tokenResult: e2
    }), this.m = e2.token, new AppCheckToken(e2.token)) : null) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.appCheck && this.o && this.appCheck.removeTokenListener(this.o), this.o = void 0;
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function __PRIVATE_randomBytes(e) {
  const t2 = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "undefined" != typeof self && (self.crypto || self.msCrypto)
  ), n2 = new Uint8Array(e);
  if (t2 && "function" == typeof t2.getRandomValues) t2.getRandomValues(n2);
  else
    for (let t3 = 0; t3 < e; t3++) n2[t3] = Math.floor(256 * Math.random());
  return n2;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_AutoId {
  static newId() {
    const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t2 = 62 * Math.floor(256 / 62);
    let n2 = "";
    for (; n2.length < 20; ) {
      const r2 = __PRIVATE_randomBytes(40);
      for (let i = 0; i < r2.length; ++i)
        n2.length < 20 && r2[i] < t2 && (n2 += e.charAt(r2[i] % 62));
    }
    return n2;
  }
}
function __PRIVATE_primitiveComparator(e, t2) {
  return e < t2 ? -1 : e > t2 ? 1 : 0;
}
function __PRIVATE_compareUtf8Strings(e, t2) {
  const n2 = Math.min(e.length, t2.length);
  for (let r2 = 0; r2 < n2; r2++) {
    const n3 = e.charAt(r2), i = t2.charAt(r2);
    if (n3 !== i) return __PRIVATE_isSurrogate(n3) === __PRIVATE_isSurrogate(i) ? __PRIVATE_primitiveComparator(n3, i) : __PRIVATE_isSurrogate(n3) ? 1 : -1;
  }
  return __PRIVATE_primitiveComparator(e.length, t2.length);
}
const v = 55296, F = 57343;
function __PRIVATE_isSurrogate(e) {
  const t2 = e.charCodeAt(0);
  return t2 >= v && t2 <= F;
}
function __PRIVATE_arrayEquals(e, t2, n2) {
  return e.length === t2.length && e.every((e2, r2) => n2(e2, t2[r2]));
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const M = "__name__";
class BasePath {
  constructor(e, t2, n2) {
    void 0 === t2 ? t2 = 0 : t2 > e.length && fail(637, {
      offset: t2,
      range: e.length
    }), void 0 === n2 ? n2 = e.length - t2 : n2 > e.length - t2 && fail(1746, {
      length: n2,
      range: e.length - t2
    }), this.segments = e, this.offset = t2, this.len = n2;
  }
  get length() {
    return this.len;
  }
  isEqual(e) {
    return 0 === BasePath.comparator(this, e);
  }
  child(e) {
    const t2 = this.segments.slice(this.offset, this.limit());
    return e instanceof BasePath ? e.forEach((e2) => {
      t2.push(e2);
    }) : t2.push(e), this.construct(t2);
  }
  /** The index of one past the last segment of the path. */
  limit() {
    return this.offset + this.length;
  }
  popFirst(e) {
    return e = void 0 === e ? 1 : e, this.construct(this.segments, this.offset + e, this.length - e);
  }
  popLast() {
    return this.construct(this.segments, this.offset, this.length - 1);
  }
  firstSegment() {
    return this.segments[this.offset];
  }
  lastSegment() {
    return this.get(this.length - 1);
  }
  get(e) {
    return this.segments[this.offset + e];
  }
  isEmpty() {
    return 0 === this.length;
  }
  isPrefixOf(e) {
    if (e.length < this.length) return false;
    for (let t2 = 0; t2 < this.length; t2++) if (this.get(t2) !== e.get(t2)) return false;
    return true;
  }
  isImmediateParentOf(e) {
    if (this.length + 1 !== e.length) return false;
    for (let t2 = 0; t2 < this.length; t2++) if (this.get(t2) !== e.get(t2)) return false;
    return true;
  }
  forEach(e) {
    for (let t2 = this.offset, n2 = this.limit(); t2 < n2; t2++) e(this.segments[t2]);
  }
  toArray() {
    return this.segments.slice(this.offset, this.limit());
  }
  /**
   * Compare 2 paths segment by segment, prioritizing numeric IDs
   * (e.g., "__id123__") in numeric ascending order, followed by string
   * segments in lexicographical order.
   */
  static comparator(e, t2) {
    const n2 = Math.min(e.length, t2.length);
    for (let r2 = 0; r2 < n2; r2++) {
      const n3 = BasePath.compareSegments(e.get(r2), t2.get(r2));
      if (0 !== n3) return n3;
    }
    return __PRIVATE_primitiveComparator(e.length, t2.length);
  }
  static compareSegments(e, t2) {
    const n2 = BasePath.isNumericId(e), r2 = BasePath.isNumericId(t2);
    return n2 && !r2 ? -1 : !n2 && r2 ? 1 : n2 && r2 ? BasePath.extractNumericId(e).compare(BasePath.extractNumericId(t2)) : __PRIVATE_compareUtf8Strings(e, t2);
  }
  // Checks if a segment is a numeric ID (starts with "__id" and ends with "__").
  static isNumericId(e) {
    return e.startsWith("__id") && e.endsWith("__");
  }
  static extractNumericId(e) {
    return Integer.fromString(e.substring(4, e.length - 2));
  }
}
class ResourcePath extends BasePath {
  construct(e, t2, n2) {
    return new ResourcePath(e, t2, n2);
  }
  canonicalString() {
    return this.toArray().join("/");
  }
  toString() {
    return this.canonicalString();
  }
  /**
   * Returns a string representation of this path
   * where each path segment has been encoded with
   * `encodeURIComponent`.
   */
  toUriEncodedString() {
    return this.toArray().map(encodeURIComponent).join("/");
  }
  /**
   * Creates a resource path from the given slash-delimited string. If multiple
   * arguments are provided, all components are combined. Leading and trailing
   * slashes from all components are ignored.
   */
  static fromString(...e) {
    const t2 = [];
    for (const n2 of e) {
      if (n2.indexOf("//") >= 0) throw new FirestoreError(C.INVALID_ARGUMENT, `Invalid segment (${n2}). Paths must not contain // in them.`);
      t2.push(...n2.split("/").filter((e2) => e2.length > 0));
    }
    return new ResourcePath(t2);
  }
  static emptyPath() {
    return new ResourcePath([]);
  }
}
const x = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
class FieldPath$1 extends BasePath {
  construct(e, t2, n2) {
    return new FieldPath$1(e, t2, n2);
  }
  /**
   * Returns true if the string could be used as a segment in a field path
   * without escaping.
   */
  static isValidIdentifier(e) {
    return x.test(e);
  }
  canonicalString() {
    return this.toArray().map((e) => (e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), FieldPath$1.isValidIdentifier(e) || (e = "`" + e + "`"), e)).join(".");
  }
  toString() {
    return this.canonicalString();
  }
  /**
   * Returns true if this field references the key of a document.
   */
  isKeyField() {
    return 1 === this.length && this.get(0) === M;
  }
  /**
   * The field designating the key of a document.
   */
  static keyField() {
    return new FieldPath$1([M]);
  }
  /**
   * Parses a field string from the given server-formatted string.
   *
   * - Splitting the empty string is not allowed (for now at least).
   * - Empty segments within the string (e.g. if there are two consecutive
   *   separators) are not allowed.
   *
   * TODO(b/37244157): we should make this more strict. Right now, it allows
   * non-identifier path components, even if they aren't escaped.
   */
  static fromServerFormat(e) {
    const t2 = [];
    let n2 = "", r2 = 0;
    const __PRIVATE_addCurrentSegment = () => {
      if (0 === n2.length) throw new FirestoreError(C.INVALID_ARGUMENT, `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
      t2.push(n2), n2 = "";
    };
    let i = false;
    for (; r2 < e.length; ) {
      const t3 = e[r2];
      if ("\\" === t3) {
        if (r2 + 1 === e.length) throw new FirestoreError(C.INVALID_ARGUMENT, "Path has trailing escape character: " + e);
        const t4 = e[r2 + 1];
        if ("\\" !== t4 && "." !== t4 && "`" !== t4) throw new FirestoreError(C.INVALID_ARGUMENT, "Path has invalid escape sequence: " + e);
        n2 += t4, r2 += 2;
      } else "`" === t3 ? (i = !i, r2++) : "." !== t3 || i ? (n2 += t3, r2++) : (__PRIVATE_addCurrentSegment(), r2++);
    }
    if (__PRIVATE_addCurrentSegment(), i) throw new FirestoreError(C.INVALID_ARGUMENT, "Unterminated ` in path: " + e);
    return new FieldPath$1(t2);
  }
  static emptyPath() {
    return new FieldPath$1([]);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class DocumentKey {
  constructor(e) {
    this.path = e;
  }
  static fromPath(e) {
    return new DocumentKey(ResourcePath.fromString(e));
  }
  static fromName(e) {
    return new DocumentKey(ResourcePath.fromString(e).popFirst(5));
  }
  static empty() {
    return new DocumentKey(ResourcePath.emptyPath());
  }
  get collectionGroup() {
    return this.path.popLast().lastSegment();
  }
  /** Returns true if the document is in the specified collectionId. */
  hasCollectionId(e) {
    return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
  }
  /** Returns the collection group (i.e. the name of the parent collection) for this key. */
  getCollectionGroup() {
    return this.path.get(this.path.length - 2);
  }
  /** Returns the fully qualified path to the parent collection. */
  getCollectionPath() {
    return this.path.popLast();
  }
  isEqual(e) {
    return null !== e && 0 === ResourcePath.comparator(this.path, e.path);
  }
  toString() {
    return this.path.toString();
  }
  static comparator(e, t2) {
    return ResourcePath.comparator(e.path, t2.path);
  }
  static isDocumentKey(e) {
    return e.length % 2 == 0;
  }
  /**
   * Creates and returns a new document key with the given segments.
   *
   * @param segments - The segments of the path to the document
   * @returns A new instance of DocumentKey
   */
  static fromSegments(e) {
    return new DocumentKey(new ResourcePath(e.slice()));
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function __PRIVATE_validateNonEmptyArgument(e, t2, n2) {
  if (!n2) throw new FirestoreError(C.INVALID_ARGUMENT, `Function ${e}() cannot be called with an empty ${t2}.`);
}
function __PRIVATE_validateIsNotUsedTogether(e, t2, n2, r2) {
  if (true === t2 && true === r2) throw new FirestoreError(C.INVALID_ARGUMENT, `${e} and ${n2} cannot be used together.`);
}
function __PRIVATE_validateDocumentPath(e) {
  if (!DocumentKey.isDocumentKey(e)) throw new FirestoreError(C.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`);
}
function __PRIVATE_validateCollectionPath(e) {
  if (DocumentKey.isDocumentKey(e)) throw new FirestoreError(C.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`);
}
function __PRIVATE_isPlainObject(e) {
  return "object" == typeof e && null !== e && (Object.getPrototypeOf(e) === Object.prototype || null === Object.getPrototypeOf(e));
}
function __PRIVATE_valueDescription(e) {
  if (void 0 === e) return "undefined";
  if (null === e) return "null";
  if ("string" == typeof e) return e.length > 20 && (e = `${e.substring(0, 20)}...`), JSON.stringify(e);
  if ("number" == typeof e || "boolean" == typeof e) return "" + e;
  if ("object" == typeof e) {
    if (e instanceof Array) return "an array";
    {
      const t2 = (
        /** try to get the constructor name for an object. */
        function __PRIVATE_tryGetCustomObjectType(e2) {
          if (e2.constructor) return e2.constructor.name;
          return null;
        }(e)
      );
      return t2 ? `a custom ${t2} object` : "an object";
    }
  }
  return "function" == typeof e ? "a function" : fail(12329, {
    type: typeof e
  });
}
function __PRIVATE_cast(e, t2) {
  if ("_delegate" in e && // Unwrap Compat types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e = e._delegate), !(e instanceof t2)) {
    if (t2.name === e.constructor.name) throw new FirestoreError(C.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
    {
      const n2 = __PRIVATE_valueDescription(e);
      throw new FirestoreError(C.INVALID_ARGUMENT, `Expected type '${t2.name}', but it was: ${n2}`);
    }
  }
  return e;
}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function property(e, t2) {
  const n2 = {
    typeString: e
  };
  return t2 && (n2.value = t2), n2;
}
function __PRIVATE_validateJSON(e, t2) {
  if (!__PRIVATE_isPlainObject(e)) throw new FirestoreError(C.INVALID_ARGUMENT, "JSON must be an object");
  let n2;
  for (const r2 in t2) if (t2[r2]) {
    const i = t2[r2].typeString, s = "value" in t2[r2] ? {
      value: t2[r2].value
    } : void 0;
    if (!(r2 in e)) {
      n2 = `JSON missing required field: '${r2}'`;
      break;
    }
    const o = e[r2];
    if (i && typeof o !== i) {
      n2 = `JSON field '${r2}' must be a ${i}.`;
      break;
    }
    if (void 0 !== s && o !== s.value) {
      n2 = `Expected '${r2}' field to equal '${s.value}'`;
      break;
    }
  }
  if (n2) throw new FirestoreError(C.INVALID_ARGUMENT, n2);
  return true;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const O = -62135596800, N = 1e6;
class Timestamp {
  /**
   * Creates a new timestamp with the current date, with millisecond precision.
   *
   * @returns a new timestamp representing the current date.
   */
  static now() {
    return Timestamp.fromMillis(Date.now());
  }
  /**
   * Creates a new timestamp from the given date.
   *
   * @param date - The date to initialize the `Timestamp` from.
   * @returns A new `Timestamp` representing the same point in time as the given
   *     date.
   */
  static fromDate(e) {
    return Timestamp.fromMillis(e.getTime());
  }
  /**
   * Creates a new timestamp from the given number of milliseconds.
   *
   * @param milliseconds - Number of milliseconds since Unix epoch
   *     1970-01-01T00:00:00Z.
   * @returns A new `Timestamp` representing the same point in time as the given
   *     number of milliseconds.
   */
  static fromMillis(e) {
    const t2 = Math.floor(e / 1e3), n2 = Math.floor((e - 1e3 * t2) * N);
    return new Timestamp(t2, n2);
  }
  /**
   * Creates a new timestamp.
   *
   * @param seconds - The number of seconds of UTC time since Unix epoch
   *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
   *     9999-12-31T23:59:59Z inclusive.
   * @param nanoseconds - The non-negative fractions of a second at nanosecond
   *     resolution. Negative second values with fractions must still have
   *     non-negative nanoseconds values that count forward in time. Must be
   *     from 0 to 999,999,999 inclusive.
   */
  constructor(e, t2) {
    if (this.seconds = e, this.nanoseconds = t2, t2 < 0) throw new FirestoreError(C.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t2);
    if (t2 >= 1e9) throw new FirestoreError(C.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t2);
    if (e < O) throw new FirestoreError(C.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
    if (e >= 253402300800) throw new FirestoreError(C.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
  }
  /**
   * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
   * causes a loss of precision since `Date` objects only support millisecond
   * precision.
   *
   * @returns JavaScript `Date` object representing the same point in time as
   *     this `Timestamp`, with millisecond precision.
   */
  toDate() {
    return new Date(this.toMillis());
  }
  /**
   * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
   * epoch). This operation causes a loss of precision.
   *
   * @returns The point in time corresponding to this timestamp, represented as
   *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
   */
  toMillis() {
    return 1e3 * this.seconds + this.nanoseconds / N;
  }
  _compareTo(e) {
    return this.seconds === e.seconds ? __PRIVATE_primitiveComparator(this.nanoseconds, e.nanoseconds) : __PRIVATE_primitiveComparator(this.seconds, e.seconds);
  }
  /**
   * Returns true if this `Timestamp` is equal to the provided one.
   *
   * @param other - The `Timestamp` to compare against.
   * @returns true if this `Timestamp` is equal to the provided one.
   */
  isEqual(e) {
    return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
  }
  /** Returns a textual representation of this `Timestamp`. */
  toString() {
    return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
  }
  /**
   * Returns a JSON-serializable representation of this `Timestamp`.
   */
  toJSON() {
    return {
      type: Timestamp._jsonSchemaVersion,
      seconds: this.seconds,
      nanoseconds: this.nanoseconds
    };
  }
  /**
   * Builds a `Timestamp` instance from a JSON object created by {@link Timestamp.toJSON}.
   */
  static fromJSON(e) {
    if (__PRIVATE_validateJSON(e, Timestamp._jsonSchema)) return new Timestamp(e.seconds, e.nanoseconds);
  }
  /**
   * Converts this object to a primitive string, which allows `Timestamp` objects
   * to be compared using the `>`, `<=`, `>=` and `>` operators.
   */
  valueOf() {
    const e = this.seconds - O;
    return String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
  }
}
Timestamp._jsonSchemaVersion = "firestore/timestamp/1.0", Timestamp._jsonSchema = {
  type: property("string", Timestamp._jsonSchemaVersion),
  seconds: property("number"),
  nanoseconds: property("number")
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class SnapshotVersion {
  static fromTimestamp(e) {
    return new SnapshotVersion(e);
  }
  static min() {
    return new SnapshotVersion(new Timestamp(0, 0));
  }
  static max() {
    return new SnapshotVersion(new Timestamp(253402300799, 999999999));
  }
  constructor(e) {
    this.timestamp = e;
  }
  compareTo(e) {
    return this.timestamp._compareTo(e.timestamp);
  }
  isEqual(e) {
    return this.timestamp.isEqual(e.timestamp);
  }
  /** Returns a number representation of the version for use in spec tests. */
  toMicroseconds() {
    return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
  }
  toString() {
    return "SnapshotVersion(" + this.timestamp.toString() + ")";
  }
  toTimestamp() {
    return this.timestamp;
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const B = -1;
function __PRIVATE_newIndexOffsetSuccessorFromReadTime(e, t2) {
  const n2 = e.toTimestamp().seconds, r2 = e.toTimestamp().nanoseconds + 1, i = SnapshotVersion.fromTimestamp(1e9 === r2 ? new Timestamp(n2 + 1, 0) : new Timestamp(n2, r2));
  return new IndexOffset(i, DocumentKey.empty(), t2);
}
function __PRIVATE_newIndexOffsetFromDocument(e) {
  return new IndexOffset(e.readTime, e.key, B);
}
class IndexOffset {
  constructor(e, t2, n2) {
    this.readTime = e, this.documentKey = t2, this.largestBatchId = n2;
  }
  /** Returns an offset that sorts before all regular offsets. */
  static min() {
    return new IndexOffset(SnapshotVersion.min(), DocumentKey.empty(), B);
  }
  /** Returns an offset that sorts after all regular offsets. */
  static max() {
    return new IndexOffset(SnapshotVersion.max(), DocumentKey.empty(), B);
  }
}
function __PRIVATE_indexOffsetComparator(e, t2) {
  let n2 = e.readTime.compareTo(t2.readTime);
  return 0 !== n2 ? n2 : (n2 = DocumentKey.comparator(e.documentKey, t2.documentKey), 0 !== n2 ? n2 : __PRIVATE_primitiveComparator(e.largestBatchId, t2.largestBatchId));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const L = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
class PersistenceTransaction {
  constructor() {
    this.onCommittedListeners = [];
  }
  addOnCommittedListener(e) {
    this.onCommittedListeners.push(e);
  }
  raiseOnCommittedEvent() {
    this.onCommittedListeners.forEach((e) => e());
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function __PRIVATE_ignoreIfPrimaryLeaseLoss(e) {
  if (e.code !== C.FAILED_PRECONDITION || e.message !== L) throw e;
  __PRIVATE_logDebug("LocalStore", "Unexpectedly lost primary lease");
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class PersistencePromise {
  constructor(e) {
    this.nextCallback = null, this.catchCallback = null, // When the operation resolves, we'll set result or error and mark isDone.
    this.result = void 0, this.error = void 0, this.isDone = false, // Set to true when .then() or .catch() are called and prevents additional
    // chaining.
    this.callbackAttached = false, e((e2) => {
      this.isDone = true, this.result = e2, this.nextCallback && // value should be defined unless T is Void, but we can't express
      // that in the type system.
      this.nextCallback(e2);
    }, (e2) => {
      this.isDone = true, this.error = e2, this.catchCallback && this.catchCallback(e2);
    });
  }
  catch(e) {
    return this.next(void 0, e);
  }
  next(e, t2) {
    return this.callbackAttached && fail(59440), this.callbackAttached = true, this.isDone ? this.error ? this.wrapFailure(t2, this.error) : this.wrapSuccess(e, this.result) : new PersistencePromise((n2, r2) => {
      this.nextCallback = (t3) => {
        this.wrapSuccess(e, t3).next(n2, r2);
      }, this.catchCallback = (e2) => {
        this.wrapFailure(t2, e2).next(n2, r2);
      };
    });
  }
  toPromise() {
    return new Promise((e, t2) => {
      this.next(e, t2);
    });
  }
  wrapUserFunction(e) {
    try {
      const t2 = e();
      return t2 instanceof PersistencePromise ? t2 : PersistencePromise.resolve(t2);
    } catch (e2) {
      return PersistencePromise.reject(e2);
    }
  }
  wrapSuccess(e, t2) {
    return e ? this.wrapUserFunction(() => e(t2)) : PersistencePromise.resolve(t2);
  }
  wrapFailure(e, t2) {
    return e ? this.wrapUserFunction(() => e(t2)) : PersistencePromise.reject(t2);
  }
  static resolve(e) {
    return new PersistencePromise((t2, n2) => {
      t2(e);
    });
  }
  static reject(e) {
    return new PersistencePromise((t2, n2) => {
      n2(e);
    });
  }
  static waitFor(e) {
    return new PersistencePromise((t2, n2) => {
      let r2 = 0, i = 0, s = false;
      e.forEach((e2) => {
        ++r2, e2.next(() => {
          ++i, s && i === r2 && t2();
        }, (e3) => n2(e3));
      }), s = true, i === r2 && t2();
    });
  }
  /**
   * Given an array of predicate functions that asynchronously evaluate to a
   * boolean, implements a short-circuiting `or` between the results. Predicates
   * will be evaluated until one of them returns `true`, then stop. The final
   * result will be whether any of them returned `true`.
   */
  static or(e) {
    let t2 = PersistencePromise.resolve(false);
    for (const n2 of e) t2 = t2.next((e2) => e2 ? PersistencePromise.resolve(e2) : n2());
    return t2;
  }
  static forEach(e, t2) {
    const n2 = [];
    return e.forEach((e2, r2) => {
      n2.push(t2.call(this, e2, r2));
    }), this.waitFor(n2);
  }
  /**
   * Concurrently map all array elements through asynchronous function.
   */
  static mapArray(e, t2) {
    return new PersistencePromise((n2, r2) => {
      const i = e.length, s = new Array(i);
      let o = 0;
      for (let _ = 0; _ < i; _++) {
        const a = _;
        t2(e[a]).next((e2) => {
          s[a] = e2, ++o, o === i && n2(s);
        }, (e2) => r2(e2));
      }
    });
  }
  /**
   * An alternative to recursive PersistencePromise calls, that avoids
   * potential memory problems from unbounded chains of promises.
   *
   * The `action` will be called repeatedly while `condition` is true.
   */
  static doWhile(e, t2) {
    return new PersistencePromise((n2, r2) => {
      const process2 = () => {
        true === e() ? t2().next(() => {
          process2();
        }, r2) : n2();
      };
      process2();
    });
  }
}
function __PRIVATE_getAndroidVersion(e) {
  const t2 = e.match(/Android ([\d.]+)/i), n2 = t2 ? t2[1].split(".").slice(0, 2).join(".") : "-1";
  return Number(n2);
}
function __PRIVATE_isIndexedDbTransactionError(e) {
  return "IndexedDbTransactionError" === e.name;
}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_ListenSequence {
  constructor(e, t2) {
    this.previousValue = e, t2 && (t2.sequenceNumberHandler = (e2) => this.ae(e2), this.ue = (e2) => t2.writeSequenceNumber(e2));
  }
  ae(e) {
    return this.previousValue = Math.max(e, this.previousValue), this.previousValue;
  }
  next() {
    const e = ++this.previousValue;
    return this.ue && this.ue(e), e;
  }
}
__PRIVATE_ListenSequence.ce = -1;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const U = -1;
function __PRIVATE_isNullOrUndefined(e) {
  return null == e;
}
function __PRIVATE_isNegativeZero(e) {
  return 0 === e && 1 / e == -1 / 0;
}
function isSafeInteger(e) {
  return "number" == typeof e && Number.isInteger(e) && !__PRIVATE_isNegativeZero(e) && e <= Number.MAX_SAFE_INTEGER && e >= Number.MIN_SAFE_INTEGER;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const $ = "";
function __PRIVATE_encodeResourcePath(e) {
  let t2 = "";
  for (let n2 = 0; n2 < e.length; n2++) t2.length > 0 && (t2 = __PRIVATE_encodeSeparator(t2)), t2 = __PRIVATE_encodeSegment(e.get(n2), t2);
  return __PRIVATE_encodeSeparator(t2);
}
function __PRIVATE_encodeSegment(e, t2) {
  let n2 = t2;
  const r2 = e.length;
  for (let t3 = 0; t3 < r2; t3++) {
    const r3 = e.charAt(t3);
    switch (r3) {
      case "\0":
        n2 += "";
        break;
      case $:
        n2 += "";
        break;
      default:
        n2 += r3;
    }
  }
  return n2;
}
function __PRIVATE_encodeSeparator(e) {
  return e + $ + "";
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function __PRIVATE_objectSize(e) {
  let t2 = 0;
  for (const n2 in e) Object.prototype.hasOwnProperty.call(e, n2) && t2++;
  return t2;
}
function forEach(e, t2) {
  for (const n2 in e) Object.prototype.hasOwnProperty.call(e, n2) && t2(n2, e[n2]);
}
function isEmpty(e) {
  for (const t2 in e) if (Object.prototype.hasOwnProperty.call(e, t2)) return false;
  return true;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class SortedMap {
  constructor(e, t2) {
    this.comparator = e, this.root = t2 || LLRBNode.EMPTY;
  }
  // Returns a copy of the map, with the specified key/value added or replaced.
  insert(e, t2) {
    return new SortedMap(this.comparator, this.root.insert(e, t2, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
  }
  // Returns a copy of the map, with the specified key removed.
  remove(e) {
    return new SortedMap(this.comparator, this.root.remove(e, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
  }
  // Returns the value of the node with the given key, or null.
  get(e) {
    let t2 = this.root;
    for (; !t2.isEmpty(); ) {
      const n2 = this.comparator(e, t2.key);
      if (0 === n2) return t2.value;
      n2 < 0 ? t2 = t2.left : n2 > 0 && (t2 = t2.right);
    }
    return null;
  }
  // Returns the index of the element in this sorted map, or -1 if it doesn't
  // exist.
  indexOf(e) {
    let t2 = 0, n2 = this.root;
    for (; !n2.isEmpty(); ) {
      const r2 = this.comparator(e, n2.key);
      if (0 === r2) return t2 + n2.left.size;
      r2 < 0 ? n2 = n2.left : (
        // Count all nodes left of the node plus the node itself
        (t2 += n2.left.size + 1, n2 = n2.right)
      );
    }
    return -1;
  }
  isEmpty() {
    return this.root.isEmpty();
  }
  // Returns the total number of nodes in the map.
  get size() {
    return this.root.size;
  }
  // Returns the minimum key in the map.
  minKey() {
    return this.root.minKey();
  }
  // Returns the maximum key in the map.
  maxKey() {
    return this.root.maxKey();
  }
  // Traverses the map in key order and calls the specified action function
  // for each key/value pair. If action returns true, traversal is aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  inorderTraversal(e) {
    return this.root.inorderTraversal(e);
  }
  forEach(e) {
    this.inorderTraversal((t2, n2) => (e(t2, n2), false));
  }
  toString() {
    const e = [];
    return this.inorderTraversal((t2, n2) => (e.push(`${t2}:${n2}`), false)), `{${e.join(", ")}}`;
  }
  // Traverses the map in reverse key order and calls the specified action
  // function for each key/value pair. If action returns true, traversal is
  // aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  reverseTraversal(e) {
    return this.root.reverseTraversal(e);
  }
  // Returns an iterator over the SortedMap.
  getIterator() {
    return new SortedMapIterator(this.root, null, this.comparator, false);
  }
  getIteratorFrom(e) {
    return new SortedMapIterator(this.root, e, this.comparator, false);
  }
  getReverseIterator() {
    return new SortedMapIterator(this.root, null, this.comparator, true);
  }
  getReverseIteratorFrom(e) {
    return new SortedMapIterator(this.root, e, this.comparator, true);
  }
}
class SortedMapIterator {
  constructor(e, t2, n2, r2) {
    this.isReverse = r2, this.nodeStack = [];
    let i = 1;
    for (; !e.isEmpty(); ) if (i = t2 ? n2(e.key, t2) : 1, // flip the comparison if we're going in reverse
    t2 && r2 && (i *= -1), i < 0)
      e = this.isReverse ? e.left : e.right;
    else {
      if (0 === i) {
        this.nodeStack.push(e);
        break;
      }
      this.nodeStack.push(e), e = this.isReverse ? e.right : e.left;
    }
  }
  getNext() {
    let e = this.nodeStack.pop();
    const t2 = {
      key: e.key,
      value: e.value
    };
    if (this.isReverse) for (e = e.left; !e.isEmpty(); ) this.nodeStack.push(e), e = e.right;
    else for (e = e.right; !e.isEmpty(); ) this.nodeStack.push(e), e = e.left;
    return t2;
  }
  hasNext() {
    return this.nodeStack.length > 0;
  }
  peek() {
    if (0 === this.nodeStack.length) return null;
    const e = this.nodeStack[this.nodeStack.length - 1];
    return {
      key: e.key,
      value: e.value
    };
  }
}
class LLRBNode {
  constructor(e, t2, n2, r2, i) {
    this.key = e, this.value = t2, this.color = null != n2 ? n2 : LLRBNode.RED, this.left = null != r2 ? r2 : LLRBNode.EMPTY, this.right = null != i ? i : LLRBNode.EMPTY, this.size = this.left.size + 1 + this.right.size;
  }
  // Returns a copy of the current node, optionally replacing pieces of it.
  copy(e, t2, n2, r2, i) {
    return new LLRBNode(null != e ? e : this.key, null != t2 ? t2 : this.value, null != n2 ? n2 : this.color, null != r2 ? r2 : this.left, null != i ? i : this.right);
  }
  isEmpty() {
    return false;
  }
  // Traverses the tree in key order and calls the specified action function
  // for each node. If action returns true, traversal is aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  inorderTraversal(e) {
    return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e);
  }
  // Traverses the tree in reverse key order and calls the specified action
  // function for each node. If action returns true, traversal is aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  reverseTraversal(e) {
    return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e);
  }
  // Returns the minimum node in the tree.
  min() {
    return this.left.isEmpty() ? this : this.left.min();
  }
  // Returns the maximum key in the tree.
  minKey() {
    return this.min().key;
  }
  // Returns the maximum key in the tree.
  maxKey() {
    return this.right.isEmpty() ? this.key : this.right.maxKey();
  }
  // Returns new tree, with the key/value added.
  insert(e, t2, n2) {
    let r2 = this;
    const i = n2(e, r2.key);
    return r2 = i < 0 ? r2.copy(null, null, null, r2.left.insert(e, t2, n2), null) : 0 === i ? r2.copy(null, t2, null, null, null) : r2.copy(null, null, null, null, r2.right.insert(e, t2, n2)), r2.fixUp();
  }
  removeMin() {
    if (this.left.isEmpty()) return LLRBNode.EMPTY;
    let e = this;
    return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), e = e.copy(null, null, null, e.left.removeMin(), null), e.fixUp();
  }
  // Returns new tree, with the specified item removed.
  remove(e, t2) {
    let n2, r2 = this;
    if (t2(e, r2.key) < 0) r2.left.isEmpty() || r2.left.isRed() || r2.left.left.isRed() || (r2 = r2.moveRedLeft()), r2 = r2.copy(null, null, null, r2.left.remove(e, t2), null);
    else {
      if (r2.left.isRed() && (r2 = r2.rotateRight()), r2.right.isEmpty() || r2.right.isRed() || r2.right.left.isRed() || (r2 = r2.moveRedRight()), 0 === t2(e, r2.key)) {
        if (r2.right.isEmpty()) return LLRBNode.EMPTY;
        n2 = r2.right.min(), r2 = r2.copy(n2.key, n2.value, null, null, r2.right.removeMin());
      }
      r2 = r2.copy(null, null, null, null, r2.right.remove(e, t2));
    }
    return r2.fixUp();
  }
  isRed() {
    return this.color;
  }
  // Returns new tree after performing any needed rotations.
  fixUp() {
    let e = this;
    return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e;
  }
  moveRedLeft() {
    let e = this.colorFlip();
    return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()), e = e.rotateLeft(), e = e.colorFlip()), e;
  }
  moveRedRight() {
    let e = this.colorFlip();
    return e.left.left.isRed() && (e = e.rotateRight(), e = e.colorFlip()), e;
  }
  rotateLeft() {
    const e = this.copy(null, null, LLRBNode.RED, null, this.right.left);
    return this.right.copy(null, null, this.color, e, null);
  }
  rotateRight() {
    const e = this.copy(null, null, LLRBNode.RED, this.left.right, null);
    return this.left.copy(null, null, this.color, null, e);
  }
  colorFlip() {
    const e = this.left.copy(null, null, !this.left.color, null, null), t2 = this.right.copy(null, null, !this.right.color, null, null);
    return this.copy(null, null, !this.color, e, t2);
  }
  // For testing.
  checkMaxDepth() {
    const e = this.check();
    return Math.pow(2, e) <= this.size + 1;
  }
  // In a balanced RB tree, the black-depth (number of black nodes) from root to
  // leaves is equal on both sides.  This function verifies that or asserts.
  check() {
    if (this.isRed() && this.left.isRed()) throw fail(43730, {
      key: this.key,
      value: this.value
    });
    if (this.right.isRed()) throw fail(14113, {
      key: this.key,
      value: this.value
    });
    const e = this.left.check();
    if (e !== this.right.check()) throw fail(27949);
    return e + (this.isRed() ? 0 : 1);
  }
}
LLRBNode.EMPTY = null, LLRBNode.RED = true, LLRBNode.BLACK = false;
LLRBNode.EMPTY = new // Represents an empty node (a leaf node in the Red-Black Tree).
class LLRBEmptyNode {
  constructor() {
    this.size = 0;
  }
  get key() {
    throw fail(57766);
  }
  get value() {
    throw fail(16141);
  }
  get color() {
    throw fail(16727);
  }
  get left() {
    throw fail(29726);
  }
  get right() {
    throw fail(36894);
  }
  // Returns a copy of the current node.
  copy(e, t2, n2, r2, i) {
    return this;
  }
  // Returns a copy of the tree, with the specified key/value added.
  insert(e, t2, n2) {
    return new LLRBNode(e, t2);
  }
  // Returns a copy of the tree, with the specified key removed.
  remove(e, t2) {
    return this;
  }
  isEmpty() {
    return true;
  }
  inorderTraversal(e) {
    return false;
  }
  reverseTraversal(e) {
    return false;
  }
  minKey() {
    return null;
  }
  maxKey() {
    return null;
  }
  isRed() {
    return false;
  }
  // For testing.
  checkMaxDepth() {
    return true;
  }
  check() {
    return 0;
  }
}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class SortedSet {
  constructor(e) {
    this.comparator = e, this.data = new SortedMap(this.comparator);
  }
  has(e) {
    return null !== this.data.get(e);
  }
  first() {
    return this.data.minKey();
  }
  last() {
    return this.data.maxKey();
  }
  get size() {
    return this.data.size;
  }
  indexOf(e) {
    return this.data.indexOf(e);
  }
  /** Iterates elements in order defined by "comparator" */
  forEach(e) {
    this.data.inorderTraversal((t2, n2) => (e(t2), false));
  }
  /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */
  forEachInRange(e, t2) {
    const n2 = this.data.getIteratorFrom(e[0]);
    for (; n2.hasNext(); ) {
      const r2 = n2.getNext();
      if (this.comparator(r2.key, e[1]) >= 0) return;
      t2(r2.key);
    }
  }
  /**
   * Iterates over `elem`s such that: start &lt;= elem until false is returned.
   */
  forEachWhile(e, t2) {
    let n2;
    for (n2 = void 0 !== t2 ? this.data.getIteratorFrom(t2) : this.data.getIterator(); n2.hasNext(); ) {
      if (!e(n2.getNext().key)) return;
    }
  }
  /** Finds the least element greater than or equal to `elem`. */
  firstAfterOrEqual(e) {
    const t2 = this.data.getIteratorFrom(e);
    return t2.hasNext() ? t2.getNext().key : null;
  }
  getIterator() {
    return new SortedSetIterator(this.data.getIterator());
  }
  getIteratorFrom(e) {
    return new SortedSetIterator(this.data.getIteratorFrom(e));
  }
  /** Inserts or updates an element */
  add(e) {
    return this.copy(this.data.remove(e).insert(e, true));
  }
  /** Deletes an element */
  delete(e) {
    return this.has(e) ? this.copy(this.data.remove(e)) : this;
  }
  isEmpty() {
    return this.data.isEmpty();
  }
  unionWith(e) {
    let t2 = this;
    return t2.size < e.size && (t2 = e, e = this), e.forEach((e2) => {
      t2 = t2.add(e2);
    }), t2;
  }
  isEqual(e) {
    if (!(e instanceof SortedSet)) return false;
    if (this.size !== e.size) return false;
    const t2 = this.data.getIterator(), n2 = e.data.getIterator();
    for (; t2.hasNext(); ) {
      const e2 = t2.getNext().key, r2 = n2.getNext().key;
      if (0 !== this.comparator(e2, r2)) return false;
    }
    return true;
  }
  toArray() {
    const e = [];
    return this.forEach((t2) => {
      e.push(t2);
    }), e;
  }
  toString() {
    const e = [];
    return this.forEach((t2) => e.push(t2)), "SortedSet(" + e.toString() + ")";
  }
  copy(e) {
    const t2 = new SortedSet(this.comparator);
    return t2.data = e, t2;
  }
}
class SortedSetIterator {
  constructor(e) {
    this.iter = e;
  }
  getNext() {
    return this.iter.getNext().key;
  }
  hasNext() {
    return this.iter.hasNext();
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class FieldMask {
  constructor(e) {
    this.fields = e, // TODO(dimond): validation of FieldMask
    // Sort the field mask to support `FieldMask.isEqual()` and assert below.
    e.sort(FieldPath$1.comparator);
  }
  static empty() {
    return new FieldMask([]);
  }
  /**
   * Returns a new FieldMask object that is the result of adding all the given
   * fields paths to this field mask.
   */
  unionWith(e) {
    let t2 = new SortedSet(FieldPath$1.comparator);
    for (const e2 of this.fields) t2 = t2.add(e2);
    for (const n2 of e) t2 = t2.add(n2);
    return new FieldMask(t2.toArray());
  }
  /**
   * Verifies that `fieldPath` is included by at least one field in this field
   * mask.
   *
   * This is an O(n) operation, where `n` is the size of the field mask.
   */
  covers(e) {
    for (const t2 of this.fields) if (t2.isPrefixOf(e)) return true;
    return false;
  }
  isEqual(e) {
    return __PRIVATE_arrayEquals(this.fields, e.fields, (e2, t2) => e2.isEqual(t2));
  }
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_Base64DecodeError extends Error {
  constructor() {
    super(...arguments), this.name = "Base64DecodeError";
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ByteString {
  constructor(e) {
    this.binaryString = e;
  }
  static fromBase64String(e) {
    const t2 = function __PRIVATE_decodeBase64(e2) {
      try {
        return atob(e2);
      } catch (e3) {
        throw "undefined" != typeof DOMException && e3 instanceof DOMException ? new __PRIVATE_Base64DecodeError("Invalid base64 string: " + e3) : e3;
      }
    }(e);
    return new ByteString(t2);
  }
  static fromUint8Array(e) {
    const t2 = (
      /**
      * Helper function to convert an Uint8array to a binary string.
      */
      function __PRIVATE_binaryStringFromUint8Array(e2) {
        let t3 = "";
        for (let n2 = 0; n2 < e2.length; ++n2) t3 += String.fromCharCode(e2[n2]);
        return t3;
      }(e)
    );
    return new ByteString(t2);
  }
  [Symbol.iterator]() {
    let e = 0;
    return {
      next: () => e < this.binaryString.length ? {
        value: this.binaryString.charCodeAt(e++),
        done: false
      } : {
        value: void 0,
        done: true
      }
    };
  }
  toBase64() {
    return function __PRIVATE_encodeBase64(e) {
      return btoa(e);
    }(this.binaryString);
  }
  toUint8Array() {
    return function __PRIVATE_uint8ArrayFromBinaryString(e) {
      const t2 = new Uint8Array(e.length);
      for (let n2 = 0; n2 < e.length; n2++) t2[n2] = e.charCodeAt(n2);
      return t2;
    }(this.binaryString);
  }
  approximateByteSize() {
    return 2 * this.binaryString.length;
  }
  compareTo(e) {
    return __PRIVATE_primitiveComparator(this.binaryString, e.binaryString);
  }
  isEqual(e) {
    return this.binaryString === e.binaryString;
  }
}
ByteString.EMPTY_BYTE_STRING = new ByteString("");
const et = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
function __PRIVATE_normalizeTimestamp(e) {
  if (__PRIVATE_hardAssert(!!e, 39018), "string" == typeof e) {
    let t2 = 0;
    const n2 = et.exec(e);
    if (__PRIVATE_hardAssert(!!n2, 46558, {
      timestamp: e
    }), n2[1]) {
      let e2 = n2[1];
      e2 = (e2 + "000000000").substr(0, 9), t2 = Number(e2);
    }
    const r2 = new Date(e);
    return {
      seconds: Math.floor(r2.getTime() / 1e3),
      nanos: t2
    };
  }
  return {
    seconds: __PRIVATE_normalizeNumber(e.seconds),
    nanos: __PRIVATE_normalizeNumber(e.nanos)
  };
}
function __PRIVATE_normalizeNumber(e) {
  return "number" == typeof e ? e : "string" == typeof e ? Number(e) : 0;
}
function __PRIVATE_normalizeByteString(e) {
  return "string" == typeof e ? ByteString.fromBase64String(e) : ByteString.fromUint8Array(e);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const tt = "server_timestamp", nt = "__type__", rt = "__previous_value__", it = "__local_write_time__";
function __PRIVATE_isServerTimestamp(e) {
  var _a, _b;
  const t2 = (_b = (((_a = e == null ? void 0 : e.mapValue) == null ? void 0 : _a.fields) || {})[nt]) == null ? void 0 : _b.stringValue;
  return t2 === tt;
}
function __PRIVATE_getPreviousValue(e) {
  const t2 = e.mapValue.fields[rt];
  return __PRIVATE_isServerTimestamp(t2) ? __PRIVATE_getPreviousValue(t2) : t2;
}
function __PRIVATE_getLocalWriteTime(e) {
  const t2 = __PRIVATE_normalizeTimestamp(e.mapValue.fields[it].timestampValue);
  return new Timestamp(t2.seconds, t2.nanos);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class DatabaseInfo {
  /**
   * Constructs a DatabaseInfo using the provided host, databaseId and
   * persistenceKey.
   *
   * @param databaseId - The database to use.
   * @param appId - The Firebase App Id.
   * @param persistenceKey - A unique identifier for this Firestore's local
   * storage (used in conjunction with the databaseId).
   * @param host - The Firestore backend host to connect to.
   * @param ssl - Whether to use SSL when connecting.
   * @param forceLongPolling - Whether to use the forceLongPolling option
   * when using WebChannel as the network transport.
   * @param autoDetectLongPolling - Whether to use the detectBufferingProxy
   * option when using WebChannel as the network transport.
   * @param longPollingOptions - Options that configure long-polling.
   * @param useFetchStreams - Whether to use the Fetch API instead of
   * XMLHTTPRequest
   */
  constructor(e, t2, n2, r2, i, s, o, _, a, u2, c) {
    this.databaseId = e, this.appId = t2, this.persistenceKey = n2, this.host = r2, this.ssl = i, this.forceLongPolling = s, this.autoDetectLongPolling = o, this.longPollingOptions = _, this.useFetchStreams = a, this.isUsingEmulator = u2, this.apiKey = c;
  }
}
const st = "(default)";
class DatabaseId {
  constructor(e, t2) {
    this.projectId = e, this.database = t2 || st;
  }
  static empty() {
    return new DatabaseId("", "");
  }
  get isDefaultDatabase() {
    return this.database === st;
  }
  isEqual(e) {
    return e instanceof DatabaseId && e.projectId === this.projectId && e.database === this.database;
  }
}
function __PRIVATE_databaseIdFromApp(e, t2) {
  if (!Object.prototype.hasOwnProperty.apply(e.options, ["projectId"])) throw new FirestoreError(C.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
  return new DatabaseId(e.options.projectId, t2);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ot = "__type__", _t = "__max__", at = {
  mapValue: {}
}, ut = "__vector__", ct = "value";
function __PRIVATE_typeOrder(e) {
  return "nullValue" in e ? 0 : "booleanValue" in e ? 1 : "integerValue" in e || "doubleValue" in e ? 2 : "timestampValue" in e ? 3 : "stringValue" in e ? 5 : "bytesValue" in e ? 6 : "referenceValue" in e ? 7 : "geoPointValue" in e ? 8 : "arrayValue" in e ? 9 : "mapValue" in e ? __PRIVATE_isServerTimestamp(e) ? 4 : __PRIVATE_isMaxValue(e) ? 9007199254740991 : __PRIVATE_isVectorValue(e) ? 10 : 11 : fail(28295, {
    value: e
  });
}
function __PRIVATE_valueEquals(e, t2) {
  if (e === t2) return true;
  const n2 = __PRIVATE_typeOrder(e);
  if (n2 !== __PRIVATE_typeOrder(t2)) return false;
  switch (n2) {
    case 0:
    case 9007199254740991:
      return true;
    case 1:
      return e.booleanValue === t2.booleanValue;
    case 4:
      return __PRIVATE_getLocalWriteTime(e).isEqual(__PRIVATE_getLocalWriteTime(t2));
    case 3:
      return function __PRIVATE_timestampEquals(e2, t3) {
        if ("string" == typeof e2.timestampValue && "string" == typeof t3.timestampValue && e2.timestampValue.length === t3.timestampValue.length)
          return e2.timestampValue === t3.timestampValue;
        const n3 = __PRIVATE_normalizeTimestamp(e2.timestampValue), r2 = __PRIVATE_normalizeTimestamp(t3.timestampValue);
        return n3.seconds === r2.seconds && n3.nanos === r2.nanos;
      }(e, t2);
    case 5:
      return e.stringValue === t2.stringValue;
    case 6:
      return function __PRIVATE_blobEquals(e2, t3) {
        return __PRIVATE_normalizeByteString(e2.bytesValue).isEqual(__PRIVATE_normalizeByteString(t3.bytesValue));
      }(e, t2);
    case 7:
      return e.referenceValue === t2.referenceValue;
    case 8:
      return function __PRIVATE_geoPointEquals(e2, t3) {
        return __PRIVATE_normalizeNumber(e2.geoPointValue.latitude) === __PRIVATE_normalizeNumber(t3.geoPointValue.latitude) && __PRIVATE_normalizeNumber(e2.geoPointValue.longitude) === __PRIVATE_normalizeNumber(t3.geoPointValue.longitude);
      }(e, t2);
    case 2:
      return function __PRIVATE_numberEquals(e2, t3) {
        if ("integerValue" in e2 && "integerValue" in t3) return __PRIVATE_normalizeNumber(e2.integerValue) === __PRIVATE_normalizeNumber(t3.integerValue);
        if ("doubleValue" in e2 && "doubleValue" in t3) {
          const n3 = __PRIVATE_normalizeNumber(e2.doubleValue), r2 = __PRIVATE_normalizeNumber(t3.doubleValue);
          return n3 === r2 ? __PRIVATE_isNegativeZero(n3) === __PRIVATE_isNegativeZero(r2) : isNaN(n3) && isNaN(r2);
        }
        return false;
      }(e, t2);
    case 9:
      return __PRIVATE_arrayEquals(e.arrayValue.values || [], t2.arrayValue.values || [], __PRIVATE_valueEquals);
    case 10:
    case 11:
      return function __PRIVATE_objectEquals(e2, t3) {
        const n3 = e2.mapValue.fields || {}, r2 = t3.mapValue.fields || {};
        if (__PRIVATE_objectSize(n3) !== __PRIVATE_objectSize(r2)) return false;
        for (const e3 in n3) if (n3.hasOwnProperty(e3) && (void 0 === r2[e3] || !__PRIVATE_valueEquals(n3[e3], r2[e3]))) return false;
        return true;
      }(e, t2);
    default:
      return fail(52216, {
        left: e
      });
  }
}
function __PRIVATE_arrayValueContains(e, t2) {
  return void 0 !== (e.values || []).find((e2) => __PRIVATE_valueEquals(e2, t2));
}
function __PRIVATE_valueCompare(e, t2) {
  if (e === t2) return 0;
  const n2 = __PRIVATE_typeOrder(e), r2 = __PRIVATE_typeOrder(t2);
  if (n2 !== r2) return __PRIVATE_primitiveComparator(n2, r2);
  switch (n2) {
    case 0:
    case 9007199254740991:
      return 0;
    case 1:
      return __PRIVATE_primitiveComparator(e.booleanValue, t2.booleanValue);
    case 2:
      return function __PRIVATE_compareNumbers(e2, t3) {
        const n3 = __PRIVATE_normalizeNumber(e2.integerValue || e2.doubleValue), r3 = __PRIVATE_normalizeNumber(t3.integerValue || t3.doubleValue);
        return n3 < r3 ? -1 : n3 > r3 ? 1 : n3 === r3 ? 0 : (
          // one or both are NaN.
          isNaN(n3) ? isNaN(r3) ? 0 : -1 : 1
        );
      }(e, t2);
    case 3:
      return __PRIVATE_compareTimestamps(e.timestampValue, t2.timestampValue);
    case 4:
      return __PRIVATE_compareTimestamps(__PRIVATE_getLocalWriteTime(e), __PRIVATE_getLocalWriteTime(t2));
    case 5:
      return __PRIVATE_compareUtf8Strings(e.stringValue, t2.stringValue);
    case 6:
      return function __PRIVATE_compareBlobs(e2, t3) {
        const n3 = __PRIVATE_normalizeByteString(e2), r3 = __PRIVATE_normalizeByteString(t3);
        return n3.compareTo(r3);
      }(e.bytesValue, t2.bytesValue);
    case 7:
      return function __PRIVATE_compareReferences(e2, t3) {
        const n3 = e2.split("/"), r3 = t3.split("/");
        for (let e3 = 0; e3 < n3.length && e3 < r3.length; e3++) {
          const t4 = __PRIVATE_primitiveComparator(n3[e3], r3[e3]);
          if (0 !== t4) return t4;
        }
        return __PRIVATE_primitiveComparator(n3.length, r3.length);
      }(e.referenceValue, t2.referenceValue);
    case 8:
      return function __PRIVATE_compareGeoPoints(e2, t3) {
        const n3 = __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.latitude), __PRIVATE_normalizeNumber(t3.latitude));
        if (0 !== n3) return n3;
        return __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.longitude), __PRIVATE_normalizeNumber(t3.longitude));
      }(e.geoPointValue, t2.geoPointValue);
    case 9:
      return __PRIVATE_compareArrays(e.arrayValue, t2.arrayValue);
    case 10:
      return function __PRIVATE_compareVectors(e2, t3) {
        var _a, _b, _c, _d;
        const n3 = e2.fields || {}, r3 = t3.fields || {}, i = (_a = n3[ct]) == null ? void 0 : _a.arrayValue, s = (_b = r3[ct]) == null ? void 0 : _b.arrayValue, o = __PRIVATE_primitiveComparator(((_c = i == null ? void 0 : i.values) == null ? void 0 : _c.length) || 0, ((_d = s == null ? void 0 : s.values) == null ? void 0 : _d.length) || 0);
        if (0 !== o) return o;
        return __PRIVATE_compareArrays(i, s);
      }(e.mapValue, t2.mapValue);
    case 11:
      return function __PRIVATE_compareMaps(e2, t3) {
        if (e2 === at.mapValue && t3 === at.mapValue) return 0;
        if (e2 === at.mapValue) return 1;
        if (t3 === at.mapValue) return -1;
        const n3 = e2.fields || {}, r3 = Object.keys(n3), i = t3.fields || {}, s = Object.keys(i);
        r3.sort(), s.sort();
        for (let e3 = 0; e3 < r3.length && e3 < s.length; ++e3) {
          const t4 = __PRIVATE_compareUtf8Strings(r3[e3], s[e3]);
          if (0 !== t4) return t4;
          const o = __PRIVATE_valueCompare(n3[r3[e3]], i[s[e3]]);
          if (0 !== o) return o;
        }
        return __PRIVATE_primitiveComparator(r3.length, s.length);
      }(e.mapValue, t2.mapValue);
    default:
      throw fail(23264, {
        he: n2
      });
  }
}
function __PRIVATE_compareTimestamps(e, t2) {
  if ("string" == typeof e && "string" == typeof t2 && e.length === t2.length) return __PRIVATE_primitiveComparator(e, t2);
  const n2 = __PRIVATE_normalizeTimestamp(e), r2 = __PRIVATE_normalizeTimestamp(t2), i = __PRIVATE_primitiveComparator(n2.seconds, r2.seconds);
  return 0 !== i ? i : __PRIVATE_primitiveComparator(n2.nanos, r2.nanos);
}
function __PRIVATE_compareArrays(e, t2) {
  const n2 = e.values || [], r2 = t2.values || [];
  for (let e2 = 0; e2 < n2.length && e2 < r2.length; ++e2) {
    const t3 = __PRIVATE_valueCompare(n2[e2], r2[e2]);
    if (t3) return t3;
  }
  return __PRIVATE_primitiveComparator(n2.length, r2.length);
}
function canonicalId(e) {
  return __PRIVATE_canonifyValue(e);
}
function __PRIVATE_canonifyValue(e) {
  return "nullValue" in e ? "null" : "booleanValue" in e ? "" + e.booleanValue : "integerValue" in e ? "" + e.integerValue : "doubleValue" in e ? "" + e.doubleValue : "timestampValue" in e ? function __PRIVATE_canonifyTimestamp(e2) {
    const t2 = __PRIVATE_normalizeTimestamp(e2);
    return `time(${t2.seconds},${t2.nanos})`;
  }(e.timestampValue) : "stringValue" in e ? e.stringValue : "bytesValue" in e ? function __PRIVATE_canonifyByteString(e2) {
    return __PRIVATE_normalizeByteString(e2).toBase64();
  }(e.bytesValue) : "referenceValue" in e ? function __PRIVATE_canonifyReference(e2) {
    return DocumentKey.fromName(e2).toString();
  }(e.referenceValue) : "geoPointValue" in e ? function __PRIVATE_canonifyGeoPoint(e2) {
    return `geo(${e2.latitude},${e2.longitude})`;
  }(e.geoPointValue) : "arrayValue" in e ? function __PRIVATE_canonifyArray(e2) {
    let t2 = "[", n2 = true;
    for (const r2 of e2.values || []) n2 ? n2 = false : t2 += ",", t2 += __PRIVATE_canonifyValue(r2);
    return t2 + "]";
  }(e.arrayValue) : "mapValue" in e ? function __PRIVATE_canonifyMap(e2) {
    const t2 = Object.keys(e2.fields || {}).sort();
    let n2 = "{", r2 = true;
    for (const i of t2) r2 ? r2 = false : n2 += ",", n2 += `${i}:${__PRIVATE_canonifyValue(e2.fields[i])}`;
    return n2 + "}";
  }(e.mapValue) : fail(61005, {
    value: e
  });
}
function __PRIVATE_estimateByteSize(e) {
  switch (__PRIVATE_typeOrder(e)) {
    case 0:
    case 1:
      return 4;
    case 2:
      return 8;
    case 3:
    case 8:
      return 16;
    case 4:
      const t2 = __PRIVATE_getPreviousValue(e);
      return t2 ? 16 + __PRIVATE_estimateByteSize(t2) : 16;
    case 5:
      return 2 * e.stringValue.length;
    case 6:
      return __PRIVATE_normalizeByteString(e.bytesValue).approximateByteSize();
    case 7:
      return e.referenceValue.length;
    case 9:
      return function __PRIVATE_estimateArrayByteSize(e2) {
        return (e2.values || []).reduce((e3, t3) => e3 + __PRIVATE_estimateByteSize(t3), 0);
      }(e.arrayValue);
    case 10:
    case 11:
      return function __PRIVATE_estimateMapByteSize(e2) {
        let t3 = 0;
        return forEach(e2.fields, (e3, n2) => {
          t3 += e3.length + __PRIVATE_estimateByteSize(n2);
        }), t3;
      }(e.mapValue);
    default:
      throw fail(13486, {
        value: e
      });
  }
}
function __PRIVATE_refValue(e, t2) {
  return {
    referenceValue: `projects/${e.projectId}/databases/${e.database}/documents/${t2.path.canonicalString()}`
  };
}
function isInteger(e) {
  return !!e && "integerValue" in e;
}
function isArray(e) {
  return !!e && "arrayValue" in e;
}
function __PRIVATE_isNullValue(e) {
  return !!e && "nullValue" in e;
}
function __PRIVATE_isNanValue(e) {
  return !!e && "doubleValue" in e && isNaN(Number(e.doubleValue));
}
function __PRIVATE_isMapValue(e) {
  return !!e && "mapValue" in e;
}
function __PRIVATE_isVectorValue(e) {
  var _a, _b;
  const t2 = (_b = (((_a = e == null ? void 0 : e.mapValue) == null ? void 0 : _a.fields) || {})[ot]) == null ? void 0 : _b.stringValue;
  return t2 === ut;
}
function __PRIVATE_deepClone(e) {
  if (e.geoPointValue) return {
    geoPointValue: {
      ...e.geoPointValue
    }
  };
  if (e.timestampValue && "object" == typeof e.timestampValue) return {
    timestampValue: {
      ...e.timestampValue
    }
  };
  if (e.mapValue) {
    const t2 = {
      mapValue: {
        fields: {}
      }
    };
    return forEach(e.mapValue.fields, (e2, n2) => t2.mapValue.fields[e2] = __PRIVATE_deepClone(n2)), t2;
  }
  if (e.arrayValue) {
    const t2 = {
      arrayValue: {
        values: []
      }
    };
    for (let n2 = 0; n2 < (e.arrayValue.values || []).length; ++n2) t2.arrayValue.values[n2] = __PRIVATE_deepClone(e.arrayValue.values[n2]);
    return t2;
  }
  return {
    ...e
  };
}
function __PRIVATE_isMaxValue(e) {
  return (((e.mapValue || {}).fields || {}).__type__ || {}).stringValue === _t;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ObjectValue {
  constructor(e) {
    this.value = e;
  }
  static empty() {
    return new ObjectValue({
      mapValue: {}
    });
  }
  /**
   * Returns the value at the given path or null.
   *
   * @param path - the path to search
   * @returns The value at the path or null if the path is not set.
   */
  field(e) {
    if (e.isEmpty()) return this.value;
    {
      let t2 = this.value;
      for (let n2 = 0; n2 < e.length - 1; ++n2) if (t2 = (t2.mapValue.fields || {})[e.get(n2)], !__PRIVATE_isMapValue(t2)) return null;
      return t2 = (t2.mapValue.fields || {})[e.lastSegment()], t2 || null;
    }
  }
  /**
   * Sets the field to the provided value.
   *
   * @param path - The field path to set.
   * @param value - The value to set.
   */
  set(e, t2) {
    this.getFieldsMap(e.popLast())[e.lastSegment()] = __PRIVATE_deepClone(t2);
  }
  /**
   * Sets the provided fields to the provided values.
   *
   * @param data - A map of fields to values (or null for deletes).
   */
  setAll(e) {
    let t2 = FieldPath$1.emptyPath(), n2 = {}, r2 = [];
    e.forEach((e2, i2) => {
      if (!t2.isImmediateParentOf(i2)) {
        const e3 = this.getFieldsMap(t2);
        this.applyChanges(e3, n2, r2), n2 = {}, r2 = [], t2 = i2.popLast();
      }
      e2 ? n2[i2.lastSegment()] = __PRIVATE_deepClone(e2) : r2.push(i2.lastSegment());
    });
    const i = this.getFieldsMap(t2);
    this.applyChanges(i, n2, r2);
  }
  /**
   * Removes the field at the specified path. If there is no field at the
   * specified path, nothing is changed.
   *
   * @param path - The field path to remove.
   */
  delete(e) {
    const t2 = this.field(e.popLast());
    __PRIVATE_isMapValue(t2) && t2.mapValue.fields && delete t2.mapValue.fields[e.lastSegment()];
  }
  isEqual(e) {
    return __PRIVATE_valueEquals(this.value, e.value);
  }
  /**
   * Returns the map that contains the leaf element of `path`. If the parent
   * entry does not yet exist, or if it is not a map, a new map will be created.
   */
  getFieldsMap(e) {
    let t2 = this.value;
    t2.mapValue.fields || (t2.mapValue = {
      fields: {}
    });
    for (let n2 = 0; n2 < e.length; ++n2) {
      let r2 = t2.mapValue.fields[e.get(n2)];
      __PRIVATE_isMapValue(r2) && r2.mapValue.fields || (r2 = {
        mapValue: {
          fields: {}
        }
      }, t2.mapValue.fields[e.get(n2)] = r2), t2 = r2;
    }
    return t2.mapValue.fields;
  }
  /**
   * Modifies `fieldsMap` by adding, replacing or deleting the specified
   * entries.
   */
  applyChanges(e, t2, n2) {
    forEach(t2, (t3, n3) => e[t3] = n3);
    for (const t3 of n2) delete e[t3];
  }
  clone() {
    return new ObjectValue(__PRIVATE_deepClone(this.value));
  }
}
function __PRIVATE_extractFieldMask(e) {
  const t2 = [];
  return forEach(e.fields, (e2, n2) => {
    const r2 = new FieldPath$1([e2]);
    if (__PRIVATE_isMapValue(n2)) {
      const e3 = __PRIVATE_extractFieldMask(n2.mapValue).fields;
      if (0 === e3.length)
        t2.push(r2);
      else
        for (const n3 of e3) t2.push(r2.child(n3));
    } else
      t2.push(r2);
  }), new FieldMask(t2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class MutableDocument {
  constructor(e, t2, n2, r2, i, s, o) {
    this.key = e, this.documentType = t2, this.version = n2, this.readTime = r2, this.createTime = i, this.data = s, this.documentState = o;
  }
  /**
   * Creates a document with no known version or data, but which can serve as
   * base document for mutations.
   */
  static newInvalidDocument(e) {
    return new MutableDocument(
      e,
      0,
      /* version */
      SnapshotVersion.min(),
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      SnapshotVersion.min(),
      ObjectValue.empty(),
      0
      /* DocumentState.SYNCED */
    );
  }
  /**
   * Creates a new document that is known to exist with the given data at the
   * given version.
   */
  static newFoundDocument(e, t2, n2, r2) {
    return new MutableDocument(
      e,
      1,
      /* version */
      t2,
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      n2,
      r2,
      0
      /* DocumentState.SYNCED */
    );
  }
  /** Creates a new document that is known to not exist at the given version. */
  static newNoDocument(e, t2) {
    return new MutableDocument(
      e,
      2,
      /* version */
      t2,
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      SnapshotVersion.min(),
      ObjectValue.empty(),
      0
      /* DocumentState.SYNCED */
    );
  }
  /**
   * Creates a new document that is known to exist at the given version but
   * whose data is not known (e.g. a document that was updated without a known
   * base document).
   */
  static newUnknownDocument(e, t2) {
    return new MutableDocument(
      e,
      3,
      /* version */
      t2,
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      SnapshotVersion.min(),
      ObjectValue.empty(),
      2
      /* DocumentState.HAS_COMMITTED_MUTATIONS */
    );
  }
  /**
   * Changes the document type to indicate that it exists and that its version
   * and data are known.
   */
  convertToFoundDocument(e, t2) {
    return !this.createTime.isEqual(SnapshotVersion.min()) || 2 !== this.documentType && 0 !== this.documentType || (this.createTime = e), this.version = e, this.documentType = 1, this.data = t2, this.documentState = 0, this;
  }
  /**
   * Changes the document type to indicate that it doesn't exist at the given
   * version.
   */
  convertToNoDocument(e) {
    return this.version = e, this.documentType = 2, this.data = ObjectValue.empty(), this.documentState = 0, this;
  }
  /**
   * Changes the document type to indicate that it exists at a given version but
   * that its data is not known (e.g. a document that was updated without a known
   * base document).
   */
  convertToUnknownDocument(e) {
    return this.version = e, this.documentType = 3, this.data = ObjectValue.empty(), this.documentState = 2, this;
  }
  setHasCommittedMutations() {
    return this.documentState = 2, this;
  }
  setHasLocalMutations() {
    return this.documentState = 1, this.version = SnapshotVersion.min(), this;
  }
  setReadTime(e) {
    return this.readTime = e, this;
  }
  get hasLocalMutations() {
    return 1 === this.documentState;
  }
  get hasCommittedMutations() {
    return 2 === this.documentState;
  }
  get hasPendingWrites() {
    return this.hasLocalMutations || this.hasCommittedMutations;
  }
  isValidDocument() {
    return 0 !== this.documentType;
  }
  isFoundDocument() {
    return 1 === this.documentType;
  }
  isNoDocument() {
    return 2 === this.documentType;
  }
  isUnknownDocument() {
    return 3 === this.documentType;
  }
  isEqual(e) {
    return e instanceof MutableDocument && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data);
  }
  mutableCopy() {
    return new MutableDocument(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
  }
  toString() {
    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
  }
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Bound {
  constructor(e, t2) {
    this.position = e, this.inclusive = t2;
  }
}
function __PRIVATE_boundCompareToDocument(e, t2, n2) {
  let r2 = 0;
  for (let i = 0; i < e.position.length; i++) {
    const s = t2[i], o = e.position[i];
    if (s.field.isKeyField()) r2 = DocumentKey.comparator(DocumentKey.fromName(o.referenceValue), n2.key);
    else {
      r2 = __PRIVATE_valueCompare(o, n2.data.field(s.field));
    }
    if ("desc" === s.dir && (r2 *= -1), 0 !== r2) break;
  }
  return r2;
}
function __PRIVATE_boundEquals(e, t2) {
  if (null === e) return null === t2;
  if (null === t2) return false;
  if (e.inclusive !== t2.inclusive || e.position.length !== t2.position.length) return false;
  for (let n2 = 0; n2 < e.position.length; n2++) {
    if (!__PRIVATE_valueEquals(e.position[n2], t2.position[n2])) return false;
  }
  return true;
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class OrderBy {
  constructor(e, t2 = "asc") {
    this.field = e, this.dir = t2;
  }
}
function __PRIVATE_orderByEquals(e, t2) {
  return e.dir === t2.dir && e.field.isEqual(t2.field);
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Filter {
}
class FieldFilter extends Filter {
  constructor(e, t2, n2) {
    super(), this.field = e, this.op = t2, this.value = n2;
  }
  /**
   * Creates a filter based on the provided arguments.
   */
  static create(e, t2, n2) {
    return e.isKeyField() ? "in" === t2 || "not-in" === t2 ? this.createKeyFieldInFilter(e, t2, n2) : new __PRIVATE_KeyFieldFilter(e, t2, n2) : "array-contains" === t2 ? new __PRIVATE_ArrayContainsFilter(e, n2) : "in" === t2 ? new __PRIVATE_InFilter(e, n2) : "not-in" === t2 ? new __PRIVATE_NotInFilter(e, n2) : "array-contains-any" === t2 ? new __PRIVATE_ArrayContainsAnyFilter(e, n2) : new FieldFilter(e, t2, n2);
  }
  static createKeyFieldInFilter(e, t2, n2) {
    return "in" === t2 ? new __PRIVATE_KeyFieldInFilter(e, n2) : new __PRIVATE_KeyFieldNotInFilter(e, n2);
  }
  matches(e) {
    const t2 = e.data.field(this.field);
    return "!=" === this.op ? null !== t2 && void 0 === t2.nullValue && this.matchesComparison(__PRIVATE_valueCompare(t2, this.value)) : null !== t2 && __PRIVATE_typeOrder(this.value) === __PRIVATE_typeOrder(t2) && this.matchesComparison(__PRIVATE_valueCompare(t2, this.value));
  }
  matchesComparison(e) {
    switch (this.op) {
      case "<":
        return e < 0;
      case "<=":
        return e <= 0;
      case "==":
        return 0 === e;
      case "!=":
        return 0 !== e;
      case ">":
        return e > 0;
      case ">=":
        return e >= 0;
      default:
        return fail(47266, {
          operator: this.op
        });
    }
  }
  isInequality() {
    return [
      "<",
      "<=",
      ">",
      ">=",
      "!=",
      "not-in"
      /* Operator.NOT_IN */
    ].indexOf(this.op) >= 0;
  }
  getFlattenedFilters() {
    return [this];
  }
  getFilters() {
    return [this];
  }
}
class CompositeFilter extends Filter {
  constructor(e, t2) {
    super(), this.filters = e, this.op = t2, this.Pe = null;
  }
  /**
   * Creates a filter based on the provided arguments.
   */
  static create(e, t2) {
    return new CompositeFilter(e, t2);
  }
  matches(e) {
    return __PRIVATE_compositeFilterIsConjunction(this) ? void 0 === this.filters.find((t2) => !t2.matches(e)) : void 0 !== this.filters.find((t2) => t2.matches(e));
  }
  getFlattenedFilters() {
    return null !== this.Pe || (this.Pe = this.filters.reduce((e, t2) => e.concat(t2.getFlattenedFilters()), [])), this.Pe;
  }
  // Returns a mutable copy of `this.filters`
  getFilters() {
    return Object.assign([], this.filters);
  }
}
function __PRIVATE_compositeFilterIsConjunction(e) {
  return "and" === e.op;
}
function __PRIVATE_compositeFilterIsFlatConjunction(e) {
  return __PRIVATE_compositeFilterIsFlat(e) && __PRIVATE_compositeFilterIsConjunction(e);
}
function __PRIVATE_compositeFilterIsFlat(e) {
  for (const t2 of e.filters) if (t2 instanceof CompositeFilter) return false;
  return true;
}
function __PRIVATE_canonifyFilter(e) {
  if (e instanceof FieldFilter)
    return e.field.canonicalString() + e.op.toString() + canonicalId(e.value);
  if (__PRIVATE_compositeFilterIsFlatConjunction(e))
    return e.filters.map((e2) => __PRIVATE_canonifyFilter(e2)).join(",");
  {
    const t2 = e.filters.map((e2) => __PRIVATE_canonifyFilter(e2)).join(",");
    return `${e.op}(${t2})`;
  }
}
function __PRIVATE_filterEquals(e, t2) {
  return e instanceof FieldFilter ? function __PRIVATE_fieldFilterEquals(e2, t3) {
    return t3 instanceof FieldFilter && e2.op === t3.op && e2.field.isEqual(t3.field) && __PRIVATE_valueEquals(e2.value, t3.value);
  }(e, t2) : e instanceof CompositeFilter ? function __PRIVATE_compositeFilterEquals(e2, t3) {
    if (t3 instanceof CompositeFilter && e2.op === t3.op && e2.filters.length === t3.filters.length) {
      return e2.filters.reduce((e3, n2, r2) => e3 && __PRIVATE_filterEquals(n2, t3.filters[r2]), true);
    }
    return false;
  }(e, t2) : void fail(19439);
}
function __PRIVATE_stringifyFilter(e) {
  return e instanceof FieldFilter ? function __PRIVATE_stringifyFieldFilter(e2) {
    return `${e2.field.canonicalString()} ${e2.op} ${canonicalId(e2.value)}`;
  }(e) : e instanceof CompositeFilter ? function __PRIVATE_stringifyCompositeFilter(e2) {
    return e2.op.toString() + " {" + e2.getFilters().map(__PRIVATE_stringifyFilter).join(" ,") + "}";
  }(e) : "Filter";
}
class __PRIVATE_KeyFieldFilter extends FieldFilter {
  constructor(e, t2, n2) {
    super(e, t2, n2), this.key = DocumentKey.fromName(n2.referenceValue);
  }
  matches(e) {
    const t2 = DocumentKey.comparator(e.key, this.key);
    return this.matchesComparison(t2);
  }
}
class __PRIVATE_KeyFieldInFilter extends FieldFilter {
  constructor(e, t2) {
    super(e, "in", t2), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("in", t2);
  }
  matches(e) {
    return this.keys.some((t2) => t2.isEqual(e.key));
  }
}
class __PRIVATE_KeyFieldNotInFilter extends FieldFilter {
  constructor(e, t2) {
    super(e, "not-in", t2), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("not-in", t2);
  }
  matches(e) {
    return !this.keys.some((t2) => t2.isEqual(e.key));
  }
}
function __PRIVATE_extractDocumentKeysFromArrayValue(e, t2) {
  var _a;
  return (((_a = t2.arrayValue) == null ? void 0 : _a.values) || []).map((e2) => DocumentKey.fromName(e2.referenceValue));
}
class __PRIVATE_ArrayContainsFilter extends FieldFilter {
  constructor(e, t2) {
    super(e, "array-contains", t2);
  }
  matches(e) {
    const t2 = e.data.field(this.field);
    return isArray(t2) && __PRIVATE_arrayValueContains(t2.arrayValue, this.value);
  }
}
class __PRIVATE_InFilter extends FieldFilter {
  constructor(e, t2) {
    super(e, "in", t2);
  }
  matches(e) {
    const t2 = e.data.field(this.field);
    return null !== t2 && __PRIVATE_arrayValueContains(this.value.arrayValue, t2);
  }
}
class __PRIVATE_NotInFilter extends FieldFilter {
  constructor(e, t2) {
    super(e, "not-in", t2);
  }
  matches(e) {
    if (__PRIVATE_arrayValueContains(this.value.arrayValue, {
      nullValue: "NULL_VALUE"
    })) return false;
    const t2 = e.data.field(this.field);
    return null !== t2 && void 0 === t2.nullValue && !__PRIVATE_arrayValueContains(this.value.arrayValue, t2);
  }
}
class __PRIVATE_ArrayContainsAnyFilter extends FieldFilter {
  constructor(e, t2) {
    super(e, "array-contains-any", t2);
  }
  matches(e) {
    const t2 = e.data.field(this.field);
    return !(!isArray(t2) || !t2.arrayValue.values) && t2.arrayValue.values.some((e2) => __PRIVATE_arrayValueContains(this.value.arrayValue, e2));
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_TargetImpl {
  constructor(e, t2 = null, n2 = [], r2 = [], i = null, s = null, o = null) {
    this.path = e, this.collectionGroup = t2, this.orderBy = n2, this.filters = r2, this.limit = i, this.startAt = s, this.endAt = o, this.Te = null;
  }
}
function __PRIVATE_newTarget(e, t2 = null, n2 = [], r2 = [], i = null, s = null, o = null) {
  return new __PRIVATE_TargetImpl(e, t2, n2, r2, i, s, o);
}
function __PRIVATE_canonifyTarget(e) {
  const t2 = __PRIVATE_debugCast(e);
  if (null === t2.Te) {
    let e2 = t2.path.canonicalString();
    null !== t2.collectionGroup && (e2 += "|cg:" + t2.collectionGroup), e2 += "|f:", e2 += t2.filters.map((e3) => __PRIVATE_canonifyFilter(e3)).join(","), e2 += "|ob:", e2 += t2.orderBy.map((e3) => function __PRIVATE_canonifyOrderBy(e4) {
      return e4.field.canonicalString() + e4.dir;
    }(e3)).join(","), __PRIVATE_isNullOrUndefined(t2.limit) || (e2 += "|l:", e2 += t2.limit), t2.startAt && (e2 += "|lb:", e2 += t2.startAt.inclusive ? "b:" : "a:", e2 += t2.startAt.position.map((e3) => canonicalId(e3)).join(",")), t2.endAt && (e2 += "|ub:", e2 += t2.endAt.inclusive ? "a:" : "b:", e2 += t2.endAt.position.map((e3) => canonicalId(e3)).join(",")), t2.Te = e2;
  }
  return t2.Te;
}
function __PRIVATE_targetEquals(e, t2) {
  if (e.limit !== t2.limit) return false;
  if (e.orderBy.length !== t2.orderBy.length) return false;
  for (let n2 = 0; n2 < e.orderBy.length; n2++) if (!__PRIVATE_orderByEquals(e.orderBy[n2], t2.orderBy[n2])) return false;
  if (e.filters.length !== t2.filters.length) return false;
  for (let n2 = 0; n2 < e.filters.length; n2++) if (!__PRIVATE_filterEquals(e.filters[n2], t2.filters[n2])) return false;
  return e.collectionGroup === t2.collectionGroup && (!!e.path.isEqual(t2.path) && (!!__PRIVATE_boundEquals(e.startAt, t2.startAt) && __PRIVATE_boundEquals(e.endAt, t2.endAt)));
}
function __PRIVATE_targetIsDocumentTarget(e) {
  return DocumentKey.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_QueryImpl {
  /**
   * Initializes a Query with a path and optional additional query constraints.
   * Path must currently be empty if this is a collection group query.
   */
  constructor(e, t2 = null, n2 = [], r2 = [], i = null, s = "F", o = null, _ = null) {
    this.path = e, this.collectionGroup = t2, this.explicitOrderBy = n2, this.filters = r2, this.limit = i, this.limitType = s, this.startAt = o, this.endAt = _, this.Ie = null, // The corresponding `Target` of this `Query` instance, for use with
    // non-aggregate queries.
    this.Ee = null, // The corresponding `Target` of this `Query` instance, for use with
    // aggregate queries. Unlike targets for non-aggregate queries,
    // aggregate query targets do not contain normalized order-bys, they only
    // contain explicit order-bys.
    this.Re = null, this.startAt, this.endAt;
  }
}
function __PRIVATE_newQuery(e, t2, n2, r2, i, s, o, _) {
  return new __PRIVATE_QueryImpl(e, t2, n2, r2, i, s, o, _);
}
function __PRIVATE_newQueryForPath(e) {
  return new __PRIVATE_QueryImpl(e);
}
function __PRIVATE_queryMatchesAllDocuments(e) {
  return 0 === e.filters.length && null === e.limit && null == e.startAt && null == e.endAt && (0 === e.explicitOrderBy.length || 1 === e.explicitOrderBy.length && e.explicitOrderBy[0].field.isKeyField());
}
function __PRIVATE_isDocumentQuery$1(e) {
  return DocumentKey.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length;
}
function __PRIVATE_isCollectionGroupQuery(e) {
  return null !== e.collectionGroup;
}
function __PRIVATE_queryNormalizedOrderBy(e) {
  const t2 = __PRIVATE_debugCast(e);
  if (null === t2.Ie) {
    t2.Ie = [];
    const e2 = /* @__PURE__ */ new Set();
    for (const n3 of t2.explicitOrderBy) t2.Ie.push(n3), e2.add(n3.field.canonicalString());
    const n2 = t2.explicitOrderBy.length > 0 ? t2.explicitOrderBy[t2.explicitOrderBy.length - 1].dir : "asc", r2 = function __PRIVATE_getInequalityFilterFields(e3) {
      let t3 = new SortedSet(FieldPath$1.comparator);
      return e3.filters.forEach((e4) => {
        e4.getFlattenedFilters().forEach((e5) => {
          e5.isInequality() && (t3 = t3.add(e5.field));
        });
      }), t3;
    }(t2);
    r2.forEach((r3) => {
      e2.has(r3.canonicalString()) || r3.isKeyField() || t2.Ie.push(new OrderBy(r3, n2));
    }), // Add the document key field to the last if it is not explicitly ordered.
    e2.has(FieldPath$1.keyField().canonicalString()) || t2.Ie.push(new OrderBy(FieldPath$1.keyField(), n2));
  }
  return t2.Ie;
}
function __PRIVATE_queryToTarget(e) {
  const t2 = __PRIVATE_debugCast(e);
  return t2.Ee || (t2.Ee = __PRIVATE__queryToTarget(t2, __PRIVATE_queryNormalizedOrderBy(e))), t2.Ee;
}
function __PRIVATE__queryToTarget(e, t2) {
  if ("F" === e.limitType) return __PRIVATE_newTarget(e.path, e.collectionGroup, t2, e.filters, e.limit, e.startAt, e.endAt);
  {
    t2 = t2.map((e2) => {
      const t3 = "desc" === e2.dir ? "asc" : "desc";
      return new OrderBy(e2.field, t3);
    });
    const n2 = e.endAt ? new Bound(e.endAt.position, e.endAt.inclusive) : null, r2 = e.startAt ? new Bound(e.startAt.position, e.startAt.inclusive) : null;
    return __PRIVATE_newTarget(e.path, e.collectionGroup, t2, e.filters, e.limit, n2, r2);
  }
}
function __PRIVATE_queryWithAddedFilter(e, t2) {
  const n2 = e.filters.concat([t2]);
  return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), n2, e.limit, e.limitType, e.startAt, e.endAt);
}
function __PRIVATE_queryWithLimit(e, t2, n2) {
  return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), t2, n2, e.startAt, e.endAt);
}
function __PRIVATE_queryEquals(e, t2) {
  return __PRIVATE_targetEquals(__PRIVATE_queryToTarget(e), __PRIVATE_queryToTarget(t2)) && e.limitType === t2.limitType;
}
function __PRIVATE_canonifyQuery(e) {
  return `${__PRIVATE_canonifyTarget(__PRIVATE_queryToTarget(e))}|lt:${e.limitType}`;
}
function __PRIVATE_stringifyQuery(e) {
  return `Query(target=${function __PRIVATE_stringifyTarget(e2) {
    let t2 = e2.path.canonicalString();
    return null !== e2.collectionGroup && (t2 += " collectionGroup=" + e2.collectionGroup), e2.filters.length > 0 && (t2 += `, filters: [${e2.filters.map((e3) => __PRIVATE_stringifyFilter(e3)).join(", ")}]`), __PRIVATE_isNullOrUndefined(e2.limit) || (t2 += ", limit: " + e2.limit), e2.orderBy.length > 0 && (t2 += `, orderBy: [${e2.orderBy.map((e3) => function __PRIVATE_stringifyOrderBy(e4) {
      return `${e4.field.canonicalString()} (${e4.dir})`;
    }(e3)).join(", ")}]`), e2.startAt && (t2 += ", startAt: ", t2 += e2.startAt.inclusive ? "b:" : "a:", t2 += e2.startAt.position.map((e3) => canonicalId(e3)).join(",")), e2.endAt && (t2 += ", endAt: ", t2 += e2.endAt.inclusive ? "a:" : "b:", t2 += e2.endAt.position.map((e3) => canonicalId(e3)).join(",")), `Target(${t2})`;
  }(__PRIVATE_queryToTarget(e))}; limitType=${e.limitType})`;
}
function __PRIVATE_queryMatches(e, t2) {
  return t2.isFoundDocument() && function __PRIVATE_queryMatchesPathAndCollectionGroup(e2, t3) {
    const n2 = t3.key.path;
    return null !== e2.collectionGroup ? t3.key.hasCollectionId(e2.collectionGroup) && e2.path.isPrefixOf(n2) : DocumentKey.isDocumentKey(e2.path) ? e2.path.isEqual(n2) : e2.path.isImmediateParentOf(n2);
  }(e, t2) && function __PRIVATE_queryMatchesOrderBy(e2, t3) {
    for (const n2 of __PRIVATE_queryNormalizedOrderBy(e2))
      if (!n2.field.isKeyField() && null === t3.data.field(n2.field)) return false;
    return true;
  }(e, t2) && function __PRIVATE_queryMatchesFilters(e2, t3) {
    for (const n2 of e2.filters) if (!n2.matches(t3)) return false;
    return true;
  }(e, t2) && function __PRIVATE_queryMatchesBounds(e2, t3) {
    if (e2.startAt && !/**
    * Returns true if a document sorts before a bound using the provided sort
    * order.
    */
    function __PRIVATE_boundSortsBeforeDocument(e3, t4, n2) {
      const r2 = __PRIVATE_boundCompareToDocument(e3, t4, n2);
      return e3.inclusive ? r2 <= 0 : r2 < 0;
    }(e2.startAt, __PRIVATE_queryNormalizedOrderBy(e2), t3)) return false;
    if (e2.endAt && !function __PRIVATE_boundSortsAfterDocument(e3, t4, n2) {
      const r2 = __PRIVATE_boundCompareToDocument(e3, t4, n2);
      return e3.inclusive ? r2 >= 0 : r2 > 0;
    }(e2.endAt, __PRIVATE_queryNormalizedOrderBy(e2), t3)) return false;
    return true;
  }(e, t2);
}
function __PRIVATE_queryCollectionGroup(e) {
  return e.collectionGroup || (e.path.length % 2 == 1 ? e.path.lastSegment() : e.path.get(e.path.length - 2));
}
function __PRIVATE_newQueryComparator(e) {
  return (t2, n2) => {
    let r2 = false;
    for (const i of __PRIVATE_queryNormalizedOrderBy(e)) {
      const e2 = __PRIVATE_compareDocs(i, t2, n2);
      if (0 !== e2) return e2;
      r2 = r2 || i.field.isKeyField();
    }
    return 0;
  };
}
function __PRIVATE_compareDocs(e, t2, n2) {
  const r2 = e.field.isKeyField() ? DocumentKey.comparator(t2.key, n2.key) : function __PRIVATE_compareDocumentsByField(e2, t3, n3) {
    const r3 = t3.data.field(e2), i = n3.data.field(e2);
    return null !== r3 && null !== i ? __PRIVATE_valueCompare(r3, i) : fail(42886);
  }(e.field, t2, n2);
  switch (e.dir) {
    case "asc":
      return r2;
    case "desc":
      return -1 * r2;
    default:
      return fail(19790, {
        direction: e.dir
      });
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ObjectMap {
  constructor(e, t2) {
    this.mapKeyFn = e, this.equalsFn = t2, /**
     * The inner map for a key/value pair. Due to the possibility of collisions we
     * keep a list of entries that we do a linear search through to find an actual
     * match. Note that collisions should be rare, so we still expect near
     * constant time lookups in practice.
     */
    this.inner = {}, /** The number of entries stored in the map */
    this.innerSize = 0;
  }
  /** Get a value for this key, or undefined if it does not exist. */
  get(e) {
    const t2 = this.mapKeyFn(e), n2 = this.inner[t2];
    if (void 0 !== n2) {
      for (const [t3, r2] of n2) if (this.equalsFn(t3, e)) return r2;
    }
  }
  has(e) {
    return void 0 !== this.get(e);
  }
  /** Put this key and value in the map. */
  set(e, t2) {
    const n2 = this.mapKeyFn(e), r2 = this.inner[n2];
    if (void 0 === r2) return this.inner[n2] = [[e, t2]], void this.innerSize++;
    for (let n3 = 0; n3 < r2.length; n3++) if (this.equalsFn(r2[n3][0], e))
      return void (r2[n3] = [e, t2]);
    r2.push([e, t2]), this.innerSize++;
  }
  /**
   * Remove this key from the map. Returns a boolean if anything was deleted.
   */
  delete(e) {
    const t2 = this.mapKeyFn(e), n2 = this.inner[t2];
    if (void 0 === n2) return false;
    for (let r2 = 0; r2 < n2.length; r2++) if (this.equalsFn(n2[r2][0], e)) return 1 === n2.length ? delete this.inner[t2] : n2.splice(r2, 1), this.innerSize--, true;
    return false;
  }
  forEach(e) {
    forEach(this.inner, (t2, n2) => {
      for (const [t3, r2] of n2) e(t3, r2);
    });
  }
  isEmpty() {
    return isEmpty(this.inner);
  }
  size() {
    return this.innerSize;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Pt = new SortedMap(DocumentKey.comparator);
function __PRIVATE_mutableDocumentMap() {
  return Pt;
}
const Tt = new SortedMap(DocumentKey.comparator);
function documentMap(...e) {
  let t2 = Tt;
  for (const n2 of e) t2 = t2.insert(n2.key, n2);
  return t2;
}
function __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e) {
  let t2 = Tt;
  return e.forEach((e2, n2) => t2 = t2.insert(e2, n2.overlayedDocument)), t2;
}
function __PRIVATE_newOverlayMap() {
  return __PRIVATE_newDocumentKeyMap();
}
function __PRIVATE_newMutationMap() {
  return __PRIVATE_newDocumentKeyMap();
}
function __PRIVATE_newDocumentKeyMap() {
  return new ObjectMap((e) => e.toString(), (e, t2) => e.isEqual(t2));
}
const It = new SortedMap(DocumentKey.comparator);
const Et = new SortedSet(DocumentKey.comparator);
function __PRIVATE_documentKeySet(...e) {
  let t2 = Et;
  for (const n2 of e) t2 = t2.add(n2);
  return t2;
}
const Rt = new SortedSet(__PRIVATE_primitiveComparator);
function __PRIVATE_targetIdSet() {
  return Rt;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function __PRIVATE_toDouble(e, t2) {
  if (e.useProto3Json) {
    if (isNaN(t2)) return {
      doubleValue: "NaN"
    };
    if (t2 === 1 / 0) return {
      doubleValue: "Infinity"
    };
    if (t2 === -1 / 0) return {
      doubleValue: "-Infinity"
    };
  }
  return {
    doubleValue: __PRIVATE_isNegativeZero(t2) ? "-0" : t2
  };
}
function __PRIVATE_toInteger(e) {
  return {
    integerValue: "" + e
  };
}
function toNumber(e, t2) {
  return isSafeInteger(t2) ? __PRIVATE_toInteger(t2) : __PRIVATE_toDouble(e, t2);
}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class TransformOperation {
  constructor() {
    this._ = void 0;
  }
}
function __PRIVATE_applyTransformOperationToLocalView(e, t2, n2) {
  return e instanceof __PRIVATE_ServerTimestampTransform ? function serverTimestamp$1(e2, t3) {
    const n3 = {
      fields: {
        [nt]: {
          stringValue: tt
        },
        [it]: {
          timestampValue: {
            seconds: e2.seconds,
            nanos: e2.nanoseconds
          }
        }
      }
    };
    return t3 && __PRIVATE_isServerTimestamp(t3) && (t3 = __PRIVATE_getPreviousValue(t3)), t3 && (n3.fields[rt] = t3), {
      mapValue: n3
    };
  }(n2, t2) : e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t2) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t2) : function __PRIVATE_applyNumericIncrementTransformOperationToLocalView(e2, t3) {
    const n3 = __PRIVATE_computeTransformOperationBaseValue(e2, t3), r2 = asNumber(n3) + asNumber(e2.Ae);
    return isInteger(n3) && isInteger(e2.Ae) ? __PRIVATE_toInteger(r2) : __PRIVATE_toDouble(e2.serializer, r2);
  }(e, t2);
}
function __PRIVATE_applyTransformOperationToRemoteDocument(e, t2, n2) {
  return e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t2) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t2) : n2;
}
function __PRIVATE_computeTransformOperationBaseValue(e, t2) {
  return e instanceof __PRIVATE_NumericIncrementTransformOperation ? (
    /** Returns true if `value` is either an IntegerValue or a DoubleValue. */
    function __PRIVATE_isNumber(e2) {
      return isInteger(e2) || function __PRIVATE_isDouble(e3) {
        return !!e3 && "doubleValue" in e3;
      }(e2);
    }(t2) ? t2 : {
      integerValue: 0
    }
  ) : null;
}
class __PRIVATE_ServerTimestampTransform extends TransformOperation {
}
class __PRIVATE_ArrayUnionTransformOperation extends TransformOperation {
  constructor(e) {
    super(), this.elements = e;
  }
}
function __PRIVATE_applyArrayUnionTransformOperation(e, t2) {
  const n2 = __PRIVATE_coercedFieldValuesArray(t2);
  for (const t3 of e.elements) n2.some((e2) => __PRIVATE_valueEquals(e2, t3)) || n2.push(t3);
  return {
    arrayValue: {
      values: n2
    }
  };
}
class __PRIVATE_ArrayRemoveTransformOperation extends TransformOperation {
  constructor(e) {
    super(), this.elements = e;
  }
}
function __PRIVATE_applyArrayRemoveTransformOperation(e, t2) {
  let n2 = __PRIVATE_coercedFieldValuesArray(t2);
  for (const t3 of e.elements) n2 = n2.filter((e2) => !__PRIVATE_valueEquals(e2, t3));
  return {
    arrayValue: {
      values: n2
    }
  };
}
class __PRIVATE_NumericIncrementTransformOperation extends TransformOperation {
  constructor(e, t2) {
    super(), this.serializer = e, this.Ae = t2;
  }
}
function asNumber(e) {
  return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
}
function __PRIVATE_coercedFieldValuesArray(e) {
  return isArray(e) && e.arrayValue.values ? e.arrayValue.values.slice() : [];
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class FieldTransform {
  constructor(e, t2) {
    this.field = e, this.transform = t2;
  }
}
function __PRIVATE_fieldTransformEquals(e, t2) {
  return e.field.isEqual(t2.field) && function __PRIVATE_transformOperationEquals(e2, t3) {
    return e2 instanceof __PRIVATE_ArrayUnionTransformOperation && t3 instanceof __PRIVATE_ArrayUnionTransformOperation || e2 instanceof __PRIVATE_ArrayRemoveTransformOperation && t3 instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_arrayEquals(e2.elements, t3.elements, __PRIVATE_valueEquals) : e2 instanceof __PRIVATE_NumericIncrementTransformOperation && t3 instanceof __PRIVATE_NumericIncrementTransformOperation ? __PRIVATE_valueEquals(e2.Ae, t3.Ae) : e2 instanceof __PRIVATE_ServerTimestampTransform && t3 instanceof __PRIVATE_ServerTimestampTransform;
  }(e.transform, t2.transform);
}
class MutationResult {
  constructor(e, t2) {
    this.version = e, this.transformResults = t2;
  }
}
class Precondition {
  constructor(e, t2) {
    this.updateTime = e, this.exists = t2;
  }
  /** Creates a new empty Precondition. */
  static none() {
    return new Precondition();
  }
  /** Creates a new Precondition with an exists flag. */
  static exists(e) {
    return new Precondition(void 0, e);
  }
  /** Creates a new Precondition based on a version a document exists at. */
  static updateTime(e) {
    return new Precondition(e);
  }
  /** Returns whether this Precondition is empty. */
  get isNone() {
    return void 0 === this.updateTime && void 0 === this.exists;
  }
  isEqual(e) {
    return this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime);
  }
}
function __PRIVATE_preconditionIsValidForDocument(e, t2) {
  return void 0 !== e.updateTime ? t2.isFoundDocument() && t2.version.isEqual(e.updateTime) : void 0 === e.exists || e.exists === t2.isFoundDocument();
}
class Mutation {
}
function __PRIVATE_calculateOverlayMutation(e, t2) {
  if (!e.hasLocalMutations || t2 && 0 === t2.fields.length) return null;
  if (null === t2) return e.isNoDocument() ? new __PRIVATE_DeleteMutation(e.key, Precondition.none()) : new __PRIVATE_SetMutation(e.key, e.data, Precondition.none());
  {
    const n2 = e.data, r2 = ObjectValue.empty();
    let i = new SortedSet(FieldPath$1.comparator);
    for (let e2 of t2.fields) if (!i.has(e2)) {
      let t3 = n2.field(e2);
      null === t3 && e2.length > 1 && (e2 = e2.popLast(), t3 = n2.field(e2)), null === t3 ? r2.delete(e2) : r2.set(e2, t3), i = i.add(e2);
    }
    return new __PRIVATE_PatchMutation(e.key, r2, new FieldMask(i.toArray()), Precondition.none());
  }
}
function __PRIVATE_mutationApplyToRemoteDocument(e, t2, n2) {
  e instanceof __PRIVATE_SetMutation ? function __PRIVATE_setMutationApplyToRemoteDocument(e2, t3, n3) {
    const r2 = e2.value.clone(), i = __PRIVATE_serverTransformResults(e2.fieldTransforms, t3, n3.transformResults);
    r2.setAll(i), t3.convertToFoundDocument(n3.version, r2).setHasCommittedMutations();
  }(e, t2, n2) : e instanceof __PRIVATE_PatchMutation ? function __PRIVATE_patchMutationApplyToRemoteDocument(e2, t3, n3) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t3))
      return void t3.convertToUnknownDocument(n3.version);
    const r2 = __PRIVATE_serverTransformResults(e2.fieldTransforms, t3, n3.transformResults), i = t3.data;
    i.setAll(__PRIVATE_getPatch(e2)), i.setAll(r2), t3.convertToFoundDocument(n3.version, i).setHasCommittedMutations();
  }(e, t2, n2) : function __PRIVATE_deleteMutationApplyToRemoteDocument(e2, t3, n3) {
    t3.convertToNoDocument(n3.version).setHasCommittedMutations();
  }(0, t2, n2);
}
function __PRIVATE_mutationApplyToLocalView(e, t2, n2, r2) {
  return e instanceof __PRIVATE_SetMutation ? function __PRIVATE_setMutationApplyToLocalView(e2, t3, n3, r3) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t3))
      return n3;
    const i = e2.value.clone(), s = __PRIVATE_localTransformResults(e2.fieldTransforms, r3, t3);
    return i.setAll(s), t3.convertToFoundDocument(t3.version, i).setHasLocalMutations(), null;
  }(e, t2, n2, r2) : e instanceof __PRIVATE_PatchMutation ? function __PRIVATE_patchMutationApplyToLocalView(e2, t3, n3, r3) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t3)) return n3;
    const i = __PRIVATE_localTransformResults(e2.fieldTransforms, r3, t3), s = t3.data;
    if (s.setAll(__PRIVATE_getPatch(e2)), s.setAll(i), t3.convertToFoundDocument(t3.version, s).setHasLocalMutations(), null === n3) return null;
    return n3.unionWith(e2.fieldMask.fields).unionWith(e2.fieldTransforms.map((e3) => e3.field));
  }(e, t2, n2, r2) : function __PRIVATE_deleteMutationApplyToLocalView(e2, t3, n3) {
    if (__PRIVATE_preconditionIsValidForDocument(e2.precondition, t3)) return t3.convertToNoDocument(t3.version).setHasLocalMutations(), null;
    return n3;
  }(e, t2, n2);
}
function __PRIVATE_mutationExtractBaseValue(e, t2) {
  let n2 = null;
  for (const r2 of e.fieldTransforms) {
    const e2 = t2.data.field(r2.field), i = __PRIVATE_computeTransformOperationBaseValue(r2.transform, e2 || null);
    null != i && (null === n2 && (n2 = ObjectValue.empty()), n2.set(r2.field, i));
  }
  return n2 || null;
}
function __PRIVATE_mutationEquals(e, t2) {
  return e.type === t2.type && (!!e.key.isEqual(t2.key) && (!!e.precondition.isEqual(t2.precondition) && (!!function __PRIVATE_fieldTransformsAreEqual(e2, t3) {
    return void 0 === e2 && void 0 === t3 || !(!e2 || !t3) && __PRIVATE_arrayEquals(e2, t3, (e3, t4) => __PRIVATE_fieldTransformEquals(e3, t4));
  }(e.fieldTransforms, t2.fieldTransforms) && (0 === e.type ? e.value.isEqual(t2.value) : 1 !== e.type || e.data.isEqual(t2.data) && e.fieldMask.isEqual(t2.fieldMask)))));
}
class __PRIVATE_SetMutation extends Mutation {
  constructor(e, t2, n2, r2 = []) {
    super(), this.key = e, this.value = t2, this.precondition = n2, this.fieldTransforms = r2, this.type = 0;
  }
  getFieldMask() {
    return null;
  }
}
class __PRIVATE_PatchMutation extends Mutation {
  constructor(e, t2, n2, r2, i = []) {
    super(), this.key = e, this.data = t2, this.fieldMask = n2, this.precondition = r2, this.fieldTransforms = i, this.type = 1;
  }
  getFieldMask() {
    return this.fieldMask;
  }
}
function __PRIVATE_getPatch(e) {
  const t2 = /* @__PURE__ */ new Map();
  return e.fieldMask.fields.forEach((n2) => {
    if (!n2.isEmpty()) {
      const r2 = e.data.field(n2);
      t2.set(n2, r2);
    }
  }), t2;
}
function __PRIVATE_serverTransformResults(e, t2, n2) {
  const r2 = /* @__PURE__ */ new Map();
  __PRIVATE_hardAssert(e.length === n2.length, 32656, {
    Ve: n2.length,
    de: e.length
  });
  for (let i = 0; i < n2.length; i++) {
    const s = e[i], o = s.transform, _ = t2.data.field(s.field);
    r2.set(s.field, __PRIVATE_applyTransformOperationToRemoteDocument(o, _, n2[i]));
  }
  return r2;
}
function __PRIVATE_localTransformResults(e, t2, n2) {
  const r2 = /* @__PURE__ */ new Map();
  for (const i of e) {
    const e2 = i.transform, s = n2.data.field(i.field);
    r2.set(i.field, __PRIVATE_applyTransformOperationToLocalView(e2, s, t2));
  }
  return r2;
}
class __PRIVATE_DeleteMutation extends Mutation {
  constructor(e, t2) {
    super(), this.key = e, this.precondition = t2, this.type = 2, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
}
class __PRIVATE_VerifyMutation extends Mutation {
  constructor(e, t2) {
    super(), this.key = e, this.precondition = t2, this.type = 3, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class MutationBatch {
  /**
   * @param batchId - The unique ID of this mutation batch.
   * @param localWriteTime - The original write time of this mutation.
   * @param baseMutations - Mutations that are used to populate the base
   * values when this mutation is applied locally. This can be used to locally
   * overwrite values that are persisted in the remote document cache. Base
   * mutations are never sent to the backend.
   * @param mutations - The user-provided mutations in this mutation batch.
   * User-provided mutations are applied both locally and remotely on the
   * backend.
   */
  constructor(e, t2, n2, r2) {
    this.batchId = e, this.localWriteTime = t2, this.baseMutations = n2, this.mutations = r2;
  }
  /**
   * Applies all the mutations in this MutationBatch to the specified document
   * to compute the state of the remote document
   *
   * @param document - The document to apply mutations to.
   * @param batchResult - The result of applying the MutationBatch to the
   * backend.
   */
  applyToRemoteDocument(e, t2) {
    const n2 = t2.mutationResults;
    for (let t3 = 0; t3 < this.mutations.length; t3++) {
      const r2 = this.mutations[t3];
      if (r2.key.isEqual(e.key)) {
        __PRIVATE_mutationApplyToRemoteDocument(r2, e, n2[t3]);
      }
    }
  }
  /**
   * Computes the local view of a document given all the mutations in this
   * batch.
   *
   * @param document - The document to apply mutations to.
   * @param mutatedFields - Fields that have been updated before applying this mutation batch.
   * @returns A `FieldMask` representing all the fields that are mutated.
   */
  applyToLocalView(e, t2) {
    for (const n2 of this.baseMutations) n2.key.isEqual(e.key) && (t2 = __PRIVATE_mutationApplyToLocalView(n2, e, t2, this.localWriteTime));
    for (const n2 of this.mutations) n2.key.isEqual(e.key) && (t2 = __PRIVATE_mutationApplyToLocalView(n2, e, t2, this.localWriteTime));
    return t2;
  }
  /**
   * Computes the local view for all provided documents given the mutations in
   * this batch. Returns a `DocumentKey` to `Mutation` map which can be used to
   * replace all the mutation applications.
   */
  applyToLocalDocumentSet(e, t2) {
    const n2 = __PRIVATE_newMutationMap();
    return this.mutations.forEach((r2) => {
      const i = e.get(r2.key), s = i.overlayedDocument;
      let o = this.applyToLocalView(s, i.mutatedFields);
      o = t2.has(r2.key) ? null : o;
      const _ = __PRIVATE_calculateOverlayMutation(s, o);
      null !== _ && n2.set(r2.key, _), s.isValidDocument() || s.convertToNoDocument(SnapshotVersion.min());
    }), n2;
  }
  keys() {
    return this.mutations.reduce((e, t2) => e.add(t2.key), __PRIVATE_documentKeySet());
  }
  isEqual(e) {
    return this.batchId === e.batchId && __PRIVATE_arrayEquals(this.mutations, e.mutations, (e2, t2) => __PRIVATE_mutationEquals(e2, t2)) && __PRIVATE_arrayEquals(this.baseMutations, e.baseMutations, (e2, t2) => __PRIVATE_mutationEquals(e2, t2));
  }
}
class MutationBatchResult {
  constructor(e, t2, n2, r2) {
    this.batch = e, this.commitVersion = t2, this.mutationResults = n2, this.docVersions = r2;
  }
  /**
   * Creates a new MutationBatchResult for the given batch and results. There
   * must be one result for each mutation in the batch. This static factory
   * caches a document=&gt;version mapping (docVersions).
   */
  static from(e, t2, n2) {
    __PRIVATE_hardAssert(e.mutations.length === n2.length, 58842, {
      me: e.mutations.length,
      fe: n2.length
    });
    let r2 = /* @__PURE__ */ function __PRIVATE_documentVersionMap() {
      return It;
    }();
    const i = e.mutations;
    for (let e2 = 0; e2 < i.length; e2++) r2 = r2.insert(i[e2].key, n2[e2].version);
    return new MutationBatchResult(e, t2, n2, r2);
  }
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Overlay {
  constructor(e, t2) {
    this.largestBatchId = e, this.mutation = t2;
  }
  getKey() {
    return this.mutation.key;
  }
  isEqual(e) {
    return null !== e && this.mutation === e.mutation;
  }
  toString() {
    return `Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ExistenceFilter {
  constructor(e, t2) {
    this.count = e, this.unchangedNames = t2;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var At, Vt;
function __PRIVATE_isPermanentError(e) {
  switch (e) {
    case C.OK:
      return fail(64938);
    case C.CANCELLED:
    case C.UNKNOWN:
    case C.DEADLINE_EXCEEDED:
    case C.RESOURCE_EXHAUSTED:
    case C.INTERNAL:
    case C.UNAVAILABLE:
    case C.UNAUTHENTICATED:
      return false;
    case C.INVALID_ARGUMENT:
    case C.NOT_FOUND:
    case C.ALREADY_EXISTS:
    case C.PERMISSION_DENIED:
    case C.FAILED_PRECONDITION:
    case C.ABORTED:
    case C.OUT_OF_RANGE:
    case C.UNIMPLEMENTED:
    case C.DATA_LOSS:
      return true;
    default:
      return fail(15467, {
        code: e
      });
  }
}
function __PRIVATE_mapCodeFromRpcCode(e) {
  if (void 0 === e)
    return __PRIVATE_logError("GRPC error has no .code"), C.UNKNOWN;
  switch (e) {
    case At.OK:
      return C.OK;
    case At.CANCELLED:
      return C.CANCELLED;
    case At.UNKNOWN:
      return C.UNKNOWN;
    case At.DEADLINE_EXCEEDED:
      return C.DEADLINE_EXCEEDED;
    case At.RESOURCE_EXHAUSTED:
      return C.RESOURCE_EXHAUSTED;
    case At.INTERNAL:
      return C.INTERNAL;
    case At.UNAVAILABLE:
      return C.UNAVAILABLE;
    case At.UNAUTHENTICATED:
      return C.UNAUTHENTICATED;
    case At.INVALID_ARGUMENT:
      return C.INVALID_ARGUMENT;
    case At.NOT_FOUND:
      return C.NOT_FOUND;
    case At.ALREADY_EXISTS:
      return C.ALREADY_EXISTS;
    case At.PERMISSION_DENIED:
      return C.PERMISSION_DENIED;
    case At.FAILED_PRECONDITION:
      return C.FAILED_PRECONDITION;
    case At.ABORTED:
      return C.ABORTED;
    case At.OUT_OF_RANGE:
      return C.OUT_OF_RANGE;
    case At.UNIMPLEMENTED:
      return C.UNIMPLEMENTED;
    case At.DATA_LOSS:
      return C.DATA_LOSS;
    default:
      return fail(39323, {
        code: e
      });
  }
}
(Vt = At || (At = {}))[Vt.OK = 0] = "OK", Vt[Vt.CANCELLED = 1] = "CANCELLED", Vt[Vt.UNKNOWN = 2] = "UNKNOWN", Vt[Vt.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", Vt[Vt.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", Vt[Vt.NOT_FOUND = 5] = "NOT_FOUND", Vt[Vt.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", Vt[Vt.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", Vt[Vt.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", Vt[Vt.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", Vt[Vt.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", Vt[Vt.ABORTED = 10] = "ABORTED", Vt[Vt.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", Vt[Vt.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", Vt[Vt.INTERNAL = 13] = "INTERNAL", Vt[Vt.UNAVAILABLE = 14] = "UNAVAILABLE", Vt[Vt.DATA_LOSS = 15] = "DATA_LOSS";
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function __PRIVATE_newTextEncoder() {
  return new TextEncoder();
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const mt = new Integer([4294967295, 4294967295], 0);
function __PRIVATE_getMd5HashValue(e) {
  const t2 = __PRIVATE_newTextEncoder().encode(e), n2 = new Md5();
  return n2.update(t2), new Uint8Array(n2.digest());
}
function __PRIVATE_get64BitUints(e) {
  const t2 = new DataView(e.buffer), n2 = t2.getUint32(
    0,
    /* littleEndian= */
    true
  ), r2 = t2.getUint32(
    4,
    /* littleEndian= */
    true
  ), i = t2.getUint32(
    8,
    /* littleEndian= */
    true
  ), s = t2.getUint32(
    12,
    /* littleEndian= */
    true
  );
  return [new Integer([n2, r2], 0), new Integer([i, s], 0)];
}
class BloomFilter {
  constructor(e, t2, n2) {
    if (this.bitmap = e, this.padding = t2, this.hashCount = n2, t2 < 0 || t2 >= 8) throw new __PRIVATE_BloomFilterError(`Invalid padding: ${t2}`);
    if (n2 < 0) throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n2}`);
    if (e.length > 0 && 0 === this.hashCount)
      throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n2}`);
    if (0 === e.length && 0 !== t2)
      throw new __PRIVATE_BloomFilterError(`Invalid padding when bitmap length is 0: ${t2}`);
    this.ge = 8 * e.length - t2, // Set the bit count in Integer to avoid repetition in mightContain().
    this.pe = Integer.fromNumber(this.ge);
  }
  // Calculate the ith hash value based on the hashed 64bit integers,
  // and calculate its corresponding bit index in the bitmap to be checked.
  ye(e, t2, n2) {
    let r2 = e.add(t2.multiply(Integer.fromNumber(n2)));
    return 1 === r2.compare(mt) && (r2 = new Integer([r2.getBits(0), r2.getBits(1)], 0)), r2.modulo(this.pe).toNumber();
  }
  // Return whether the bit on the given index in the bitmap is set to 1.
  we(e) {
    return !!(this.bitmap[Math.floor(e / 8)] & 1 << e % 8);
  }
  mightContain(e) {
    if (0 === this.ge) return false;
    const t2 = __PRIVATE_getMd5HashValue(e), [n2, r2] = __PRIVATE_get64BitUints(t2);
    for (let e2 = 0; e2 < this.hashCount; e2++) {
      const t3 = this.ye(n2, r2, e2);
      if (!this.we(t3)) return false;
    }
    return true;
  }
  /** Create bloom filter for testing purposes only. */
  static create(e, t2, n2) {
    const r2 = e % 8 == 0 ? 0 : 8 - e % 8, i = new Uint8Array(Math.ceil(e / 8)), s = new BloomFilter(i, r2, t2);
    return n2.forEach((e2) => s.insert(e2)), s;
  }
  insert(e) {
    if (0 === this.ge) return;
    const t2 = __PRIVATE_getMd5HashValue(e), [n2, r2] = __PRIVATE_get64BitUints(t2);
    for (let e2 = 0; e2 < this.hashCount; e2++) {
      const t3 = this.ye(n2, r2, e2);
      this.be(t3);
    }
  }
  be(e) {
    const t2 = Math.floor(e / 8), n2 = e % 8;
    this.bitmap[t2] |= 1 << n2;
  }
}
class __PRIVATE_BloomFilterError extends Error {
  constructor() {
    super(...arguments), this.name = "BloomFilterError";
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class RemoteEvent {
  constructor(e, t2, n2, r2, i) {
    this.snapshotVersion = e, this.targetChanges = t2, this.targetMismatches = n2, this.documentUpdates = r2, this.resolvedLimboDocuments = i;
  }
  /**
   * HACK: Views require RemoteEvents in order to determine whether the view is
   * CURRENT, but secondary tabs don't receive remote events. So this method is
   * used to create a synthesized RemoteEvent that can be used to apply a
   * CURRENT status change to a View, for queries executed in a different tab.
   */
  // PORTING NOTE: Multi-tab only
  static createSynthesizedRemoteEventForCurrentChange(e, t2, n2) {
    const r2 = /* @__PURE__ */ new Map();
    return r2.set(e, TargetChange.createSynthesizedTargetChangeForCurrentChange(e, t2, n2)), new RemoteEvent(SnapshotVersion.min(), r2, new SortedMap(__PRIVATE_primitiveComparator), __PRIVATE_mutableDocumentMap(), __PRIVATE_documentKeySet());
  }
}
class TargetChange {
  constructor(e, t2, n2, r2, i) {
    this.resumeToken = e, this.current = t2, this.addedDocuments = n2, this.modifiedDocuments = r2, this.removedDocuments = i;
  }
  /**
   * This method is used to create a synthesized TargetChanges that can be used to
   * apply a CURRENT status change to a View (for queries executed in a different
   * tab) or for new queries (to raise snapshots with correct CURRENT status).
   */
  static createSynthesizedTargetChangeForCurrentChange(e, t2, n2) {
    return new TargetChange(n2, t2, __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet());
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_DocumentWatchChange {
  constructor(e, t2, n2, r2) {
    this.Se = e, this.removedTargetIds = t2, this.key = n2, this.De = r2;
  }
}
class __PRIVATE_ExistenceFilterChange {
  constructor(e, t2) {
    this.targetId = e, this.Ce = t2;
  }
}
class __PRIVATE_WatchTargetChange {
  constructor(e, t2, n2 = ByteString.EMPTY_BYTE_STRING, r2 = null) {
    this.state = e, this.targetIds = t2, this.resumeToken = n2, this.cause = r2;
  }
}
class __PRIVATE_TargetState {
  constructor() {
    this.ve = 0, /**
     * Keeps track of the document changes since the last raised snapshot.
     *
     * These changes are continuously updated as we receive document updates and
     * always reflect the current set of changes against the last issued snapshot.
     */
    this.Fe = __PRIVATE_snapshotChangesMap(), /** See public getters for explanations of these fields. */
    this.Me = ByteString.EMPTY_BYTE_STRING, this.xe = false, /**
     * Whether this target state should be included in the next snapshot. We
     * initialize to true so that newly-added targets are included in the next
     * RemoteEvent.
     */
    this.Oe = true;
  }
  /**
   * Whether this target has been marked 'current'.
   *
   * 'Current' has special meaning in the RPC protocol: It implies that the
   * Watch backend has sent us all changes up to the point at which the target
   * was added and that the target is consistent with the rest of the watch
   * stream.
   */
  get current() {
    return this.xe;
  }
  /** The last resume token sent to us for this target. */
  get resumeToken() {
    return this.Me;
  }
  /** Whether this target has pending target adds or target removes. */
  get Ne() {
    return 0 !== this.ve;
  }
  /** Whether we have modified any state that should trigger a snapshot. */
  get Be() {
    return this.Oe;
  }
  /**
   * Applies the resume token to the TargetChange, but only when it has a new
   * value. Empty resumeTokens are discarded.
   */
  Le(e) {
    e.approximateByteSize() > 0 && (this.Oe = true, this.Me = e);
  }
  /**
   * Creates a target change from the current set of changes.
   *
   * To reset the document changes after raising this snapshot, call
   * `clearPendingChanges()`.
   */
  ke() {
    let e = __PRIVATE_documentKeySet(), t2 = __PRIVATE_documentKeySet(), n2 = __PRIVATE_documentKeySet();
    return this.Fe.forEach((r2, i) => {
      switch (i) {
        case 0:
          e = e.add(r2);
          break;
        case 2:
          t2 = t2.add(r2);
          break;
        case 1:
          n2 = n2.add(r2);
          break;
        default:
          fail(38017, {
            changeType: i
          });
      }
    }), new TargetChange(this.Me, this.xe, e, t2, n2);
  }
  /**
   * Resets the document changes and sets `hasPendingChanges` to false.
   */
  Ke() {
    this.Oe = false, this.Fe = __PRIVATE_snapshotChangesMap();
  }
  qe(e, t2) {
    this.Oe = true, this.Fe = this.Fe.insert(e, t2);
  }
  Ue(e) {
    this.Oe = true, this.Fe = this.Fe.remove(e);
  }
  $e() {
    this.ve += 1;
  }
  We() {
    this.ve -= 1, __PRIVATE_hardAssert(this.ve >= 0, 3241, {
      ve: this.ve
    });
  }
  Qe() {
    this.Oe = true, this.xe = true;
  }
}
class __PRIVATE_WatchChangeAggregator {
  constructor(e) {
    this.Ge = e, /** The internal state of all tracked targets. */
    this.ze = /* @__PURE__ */ new Map(), /** Keeps track of the documents to update since the last raised snapshot. */
    this.je = __PRIVATE_mutableDocumentMap(), this.He = __PRIVATE_documentTargetMap(), /** A mapping of document keys to their set of target IDs. */
    this.Je = __PRIVATE_documentTargetMap(), /**
     * A map of targets with existence filter mismatches. These targets are
     * known to be inconsistent and their listens needs to be re-established by
     * RemoteStore.
     */
    this.Ze = new SortedMap(__PRIVATE_primitiveComparator);
  }
  /**
   * Processes and adds the DocumentWatchChange to the current set of changes.
   */
  Xe(e) {
    for (const t2 of e.Se) e.De && e.De.isFoundDocument() ? this.Ye(t2, e.De) : this.et(t2, e.key, e.De);
    for (const t2 of e.removedTargetIds) this.et(t2, e.key, e.De);
  }
  /** Processes and adds the WatchTargetChange to the current set of changes. */
  tt(e) {
    this.forEachTarget(e, (t2) => {
      const n2 = this.nt(t2);
      switch (e.state) {
        case 0:
          this.rt(t2) && n2.Le(e.resumeToken);
          break;
        case 1:
          n2.We(), n2.Ne || // We have a freshly added target, so we need to reset any state
          // that we had previously. This can happen e.g. when remove and add
          // back a target for existence filter mismatches.
          n2.Ke(), n2.Le(e.resumeToken);
          break;
        case 2:
          n2.We(), n2.Ne || this.removeTarget(t2);
          break;
        case 3:
          this.rt(t2) && (n2.Qe(), n2.Le(e.resumeToken));
          break;
        case 4:
          this.rt(t2) && // Reset the target and synthesizes removes for all existing
          // documents. The backend will re-add any documents that still
          // match the target before it sends the next global snapshot.
          (this.it(t2), n2.Le(e.resumeToken));
          break;
        default:
          fail(56790, {
            state: e.state
          });
      }
    });
  }
  /**
   * Iterates over all targetIds that the watch change applies to: either the
   * targetIds explicitly listed in the change or the targetIds of all currently
   * active targets.
   */
  forEachTarget(e, t2) {
    e.targetIds.length > 0 ? e.targetIds.forEach(t2) : this.ze.forEach((e2, n2) => {
      this.rt(n2) && t2(n2);
    });
  }
  /**
   * Handles existence filters and synthesizes deletes for filter mismatches.
   * Targets that are invalidated by filter mismatches are added to
   * `pendingTargetResets`.
   */
  st(e) {
    const t2 = e.targetId, n2 = e.Ce.count, r2 = this.ot(t2);
    if (r2) {
      const i = r2.target;
      if (__PRIVATE_targetIsDocumentTarget(i)) if (0 === n2) {
        const e2 = new DocumentKey(i.path);
        this.et(t2, e2, MutableDocument.newNoDocument(e2, SnapshotVersion.min()));
      } else __PRIVATE_hardAssert(1 === n2, 20013, {
        expectedCount: n2
      });
      else {
        const r3 = this._t(t2);
        if (r3 !== n2) {
          const n3 = this.ut(e), i2 = n3 ? this.ct(n3, e, r3) : 1;
          if (0 !== i2) {
            this.it(t2);
            const e2 = 2 === i2 ? "TargetPurposeExistenceFilterMismatchBloom" : "TargetPurposeExistenceFilterMismatch";
            this.Ze = this.Ze.insert(t2, e2);
          }
        }
      }
    }
  }
  /**
   * Parse the bloom filter from the "unchanged_names" field of an existence
   * filter.
   */
  ut(e) {
    const t2 = e.Ce.unchangedNames;
    if (!t2 || !t2.bits) return null;
    const { bits: { bitmap: n2 = "", padding: r2 = 0 }, hashCount: i = 0 } = t2;
    let s, o;
    try {
      s = __PRIVATE_normalizeByteString(n2).toUint8Array();
    } catch (e2) {
      if (e2 instanceof __PRIVATE_Base64DecodeError) return __PRIVATE_logWarn("Decoding the base64 bloom filter in existence filter failed (" + e2.message + "); ignoring the bloom filter and falling back to full re-query."), null;
      throw e2;
    }
    try {
      o = new BloomFilter(s, r2, i);
    } catch (e2) {
      return __PRIVATE_logWarn(e2 instanceof __PRIVATE_BloomFilterError ? "BloomFilter error: " : "Applying bloom filter failed: ", e2), null;
    }
    return 0 === o.ge ? null : o;
  }
  /**
   * Apply bloom filter to remove the deleted documents, and return the
   * application status.
   */
  ct(e, t2, n2) {
    return t2.Ce.count === n2 - this.Pt(e, t2.targetId) ? 0 : 2;
  }
  /**
   * Filter out removed documents based on bloom filter membership result and
   * return number of documents removed.
   */
  Pt(e, t2) {
    const n2 = this.Ge.getRemoteKeysForTarget(t2);
    let r2 = 0;
    return n2.forEach((n3) => {
      const i = this.Ge.ht(), s = `projects/${i.projectId}/databases/${i.database}/documents/${n3.path.canonicalString()}`;
      e.mightContain(s) || (this.et(
        t2,
        n3,
        /*updatedDocument=*/
        null
      ), r2++);
    }), r2;
  }
  /**
   * Converts the currently accumulated state into a remote event at the
   * provided snapshot version. Resets the accumulated changes before returning.
   */
  Tt(e) {
    const t2 = /* @__PURE__ */ new Map();
    this.ze.forEach((n3, r3) => {
      const i = this.ot(r3);
      if (i) {
        if (n3.current && __PRIVATE_targetIsDocumentTarget(i.target)) {
          const t3 = new DocumentKey(i.target.path);
          this.It(t3).has(r3) || this.Et(r3, t3) || this.et(r3, t3, MutableDocument.newNoDocument(t3, e));
        }
        n3.Be && (t2.set(r3, n3.ke()), n3.Ke());
      }
    });
    let n2 = __PRIVATE_documentKeySet();
    this.Je.forEach((e2, t3) => {
      let r3 = true;
      t3.forEachWhile((e3) => {
        const t4 = this.ot(e3);
        return !t4 || "TargetPurposeLimboResolution" === t4.purpose || (r3 = false, false);
      }), r3 && (n2 = n2.add(e2));
    }), this.je.forEach((t3, n3) => n3.setReadTime(e));
    const r2 = new RemoteEvent(e, t2, this.Ze, this.je, n2);
    return this.je = __PRIVATE_mutableDocumentMap(), this.He = __PRIVATE_documentTargetMap(), this.Je = __PRIVATE_documentTargetMap(), this.Ze = new SortedMap(__PRIVATE_primitiveComparator), r2;
  }
  /**
   * Adds the provided document to the internal list of document updates and
   * its document key to the given target's mapping.
   */
  // Visible for testing.
  Ye(e, t2) {
    if (!this.rt(e)) return;
    const n2 = this.Et(e, t2.key) ? 2 : 0;
    this.nt(e).qe(t2.key, n2), this.je = this.je.insert(t2.key, t2), this.He = this.He.insert(t2.key, this.It(t2.key).add(e)), this.Je = this.Je.insert(t2.key, this.Rt(t2.key).add(e));
  }
  /**
   * Removes the provided document from the target mapping. If the
   * document no longer matches the target, but the document's state is still
   * known (e.g. we know that the document was deleted or we received the change
   * that caused the filter mismatch), the new document can be provided
   * to update the remote document cache.
   */
  // Visible for testing.
  et(e, t2, n2) {
    if (!this.rt(e)) return;
    const r2 = this.nt(e);
    this.Et(e, t2) ? r2.qe(
      t2,
      1
      /* ChangeType.Removed */
    ) : (
      // The document may have entered and left the target before we raised a
      // snapshot, so we can just ignore the change.
      r2.Ue(t2)
    ), this.Je = this.Je.insert(t2, this.Rt(t2).delete(e)), this.Je = this.Je.insert(t2, this.Rt(t2).add(e)), n2 && (this.je = this.je.insert(t2, n2));
  }
  removeTarget(e) {
    this.ze.delete(e);
  }
  /**
   * Returns the current count of documents in the target. This includes both
   * the number of documents that the LocalStore considers to be part of the
   * target as well as any accumulated changes.
   */
  _t(e) {
    const t2 = this.nt(e).ke();
    return this.Ge.getRemoteKeysForTarget(e).size + t2.addedDocuments.size - t2.removedDocuments.size;
  }
  /**
   * Increment the number of acks needed from watch before we can consider the
   * server to be 'in-sync' with the client's active targets.
   */
  $e(e) {
    this.nt(e).$e();
  }
  nt(e) {
    let t2 = this.ze.get(e);
    return t2 || (t2 = new __PRIVATE_TargetState(), this.ze.set(e, t2)), t2;
  }
  Rt(e) {
    let t2 = this.Je.get(e);
    return t2 || (t2 = new SortedSet(__PRIVATE_primitiveComparator), this.Je = this.Je.insert(e, t2)), t2;
  }
  It(e) {
    let t2 = this.He.get(e);
    return t2 || (t2 = new SortedSet(__PRIVATE_primitiveComparator), this.He = this.He.insert(e, t2)), t2;
  }
  /**
   * Verifies that the user is still interested in this target (by calling
   * `getTargetDataForTarget()`) and that we are not waiting for pending ADDs
   * from watch.
   */
  rt(e) {
    const t2 = null !== this.ot(e);
    return t2 || __PRIVATE_logDebug("WatchChangeAggregator", "Detected inactive target", e), t2;
  }
  /**
   * Returns the TargetData for an active target (i.e. a target that the user
   * is still interested in that has no outstanding target change requests).
   */
  ot(e) {
    const t2 = this.ze.get(e);
    return t2 && t2.Ne ? null : this.Ge.At(e);
  }
  /**
   * Resets the state of a Watch target to its initial state (e.g. sets
   * 'current' to false, clears the resume token and removes its target mapping
   * from all documents).
   */
  it(e) {
    this.ze.set(e, new __PRIVATE_TargetState());
    this.Ge.getRemoteKeysForTarget(e).forEach((t2) => {
      this.et(
        e,
        t2,
        /*updatedDocument=*/
        null
      );
    });
  }
  /**
   * Returns whether the LocalStore considers the document to be part of the
   * specified target.
   */
  Et(e, t2) {
    return this.Ge.getRemoteKeysForTarget(e).has(t2);
  }
}
function __PRIVATE_documentTargetMap() {
  return new SortedMap(DocumentKey.comparator);
}
function __PRIVATE_snapshotChangesMap() {
  return new SortedMap(DocumentKey.comparator);
}
const ft = /* @__PURE__ */ (() => {
  const e = {
    asc: "ASCENDING",
    desc: "DESCENDING"
  };
  return e;
})(), gt = /* @__PURE__ */ (() => {
  const e = {
    "<": "LESS_THAN",
    "<=": "LESS_THAN_OR_EQUAL",
    ">": "GREATER_THAN",
    ">=": "GREATER_THAN_OR_EQUAL",
    "==": "EQUAL",
    "!=": "NOT_EQUAL",
    "array-contains": "ARRAY_CONTAINS",
    in: "IN",
    "not-in": "NOT_IN",
    "array-contains-any": "ARRAY_CONTAINS_ANY"
  };
  return e;
})(), pt = /* @__PURE__ */ (() => {
  const e = {
    and: "AND",
    or: "OR"
  };
  return e;
})();
class JsonProtoSerializer {
  constructor(e, t2) {
    this.databaseId = e, this.useProto3Json = t2;
  }
}
function __PRIVATE_toInt32Proto(e, t2) {
  return e.useProto3Json || __PRIVATE_isNullOrUndefined(t2) ? t2 : {
    value: t2
  };
}
function toTimestamp(e, t2) {
  if (e.useProto3Json) {
    return `${new Date(1e3 * t2.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + t2.nanoseconds).slice(-9)}Z`;
  }
  return {
    seconds: "" + t2.seconds,
    nanos: t2.nanoseconds
  };
}
function __PRIVATE_toBytes(e, t2) {
  return e.useProto3Json ? t2.toBase64() : t2.toUint8Array();
}
function __PRIVATE_toVersion(e, t2) {
  return toTimestamp(e, t2.toTimestamp());
}
function __PRIVATE_fromVersion(e) {
  return __PRIVATE_hardAssert(!!e, 49232), SnapshotVersion.fromTimestamp(function fromTimestamp(e2) {
    const t2 = __PRIVATE_normalizeTimestamp(e2);
    return new Timestamp(t2.seconds, t2.nanos);
  }(e));
}
function __PRIVATE_toResourceName(e, t2) {
  return __PRIVATE_toResourcePath(e, t2).canonicalString();
}
function __PRIVATE_toResourcePath(e, t2) {
  const n2 = function __PRIVATE_fullyQualifiedPrefixPath(e2) {
    return new ResourcePath(["projects", e2.projectId, "databases", e2.database]);
  }(e).child("documents");
  return void 0 === t2 ? n2 : n2.child(t2);
}
function __PRIVATE_fromResourceName(e) {
  const t2 = ResourcePath.fromString(e);
  return __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(t2), 10190, {
    key: t2.toString()
  }), t2;
}
function __PRIVATE_toName(e, t2) {
  return __PRIVATE_toResourceName(e.databaseId, t2.path);
}
function fromName(e, t2) {
  const n2 = __PRIVATE_fromResourceName(t2);
  if (n2.get(1) !== e.databaseId.projectId) throw new FirestoreError(C.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n2.get(1) + " vs " + e.databaseId.projectId);
  if (n2.get(3) !== e.databaseId.database) throw new FirestoreError(C.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n2.get(3) + " vs " + e.databaseId.database);
  return new DocumentKey(__PRIVATE_extractLocalPathFromResourceName(n2));
}
function __PRIVATE_toQueryPath(e, t2) {
  return __PRIVATE_toResourceName(e.databaseId, t2);
}
function __PRIVATE_fromQueryPath(e) {
  const t2 = __PRIVATE_fromResourceName(e);
  return 4 === t2.length ? ResourcePath.emptyPath() : __PRIVATE_extractLocalPathFromResourceName(t2);
}
function __PRIVATE_getEncodedDatabaseId(e) {
  return new ResourcePath(["projects", e.databaseId.projectId, "databases", e.databaseId.database]).canonicalString();
}
function __PRIVATE_extractLocalPathFromResourceName(e) {
  return __PRIVATE_hardAssert(e.length > 4 && "documents" === e.get(4), 29091, {
    key: e.toString()
  }), e.popFirst(5);
}
function __PRIVATE_toMutationDocument(e, t2, n2) {
  return {
    name: __PRIVATE_toName(e, t2),
    fields: n2.value.mapValue.fields
  };
}
function __PRIVATE_fromBatchGetDocumentsResponse(e, t2) {
  return "found" in t2 ? function __PRIVATE_fromFound(e2, t3) {
    __PRIVATE_hardAssert(!!t3.found, 43571), t3.found.name, t3.found.updateTime;
    const n2 = fromName(e2, t3.found.name), r2 = __PRIVATE_fromVersion(t3.found.updateTime), i = t3.found.createTime ? __PRIVATE_fromVersion(t3.found.createTime) : SnapshotVersion.min(), s = new ObjectValue({
      mapValue: {
        fields: t3.found.fields
      }
    });
    return MutableDocument.newFoundDocument(n2, r2, i, s);
  }(e, t2) : "missing" in t2 ? function __PRIVATE_fromMissing(e2, t3) {
    __PRIVATE_hardAssert(!!t3.missing, 3894), __PRIVATE_hardAssert(!!t3.readTime, 22933);
    const n2 = fromName(e2, t3.missing), r2 = __PRIVATE_fromVersion(t3.readTime);
    return MutableDocument.newNoDocument(n2, r2);
  }(e, t2) : fail(7234, {
    result: t2
  });
}
function __PRIVATE_fromWatchChange(e, t2) {
  let n2;
  if ("targetChange" in t2) {
    t2.targetChange;
    const r2 = function __PRIVATE_fromWatchTargetChangeState(e2) {
      return "NO_CHANGE" === e2 ? 0 : "ADD" === e2 ? 1 : "REMOVE" === e2 ? 2 : "CURRENT" === e2 ? 3 : "RESET" === e2 ? 4 : fail(39313, {
        state: e2
      });
    }(t2.targetChange.targetChangeType || "NO_CHANGE"), i = t2.targetChange.targetIds || [], s = function __PRIVATE_fromBytes(e2, t3) {
      return e2.useProto3Json ? (__PRIVATE_hardAssert(void 0 === t3 || "string" == typeof t3, 58123), ByteString.fromBase64String(t3 || "")) : (__PRIVATE_hardAssert(void 0 === t3 || // Check if the value is an instance of both Buffer and Uint8Array,
      // despite the fact that Buffer extends Uint8Array. In some
      // environments, such as jsdom, the prototype chain of Buffer
      // does not indicate that it extends Uint8Array.
      t3 instanceof Buffer || t3 instanceof Uint8Array, 16193), ByteString.fromUint8Array(t3 || new Uint8Array()));
    }(e, t2.targetChange.resumeToken), o = t2.targetChange.cause, _ = o && function __PRIVATE_fromRpcStatus(e2) {
      const t3 = void 0 === e2.code ? C.UNKNOWN : __PRIVATE_mapCodeFromRpcCode(e2.code);
      return new FirestoreError(t3, e2.message || "");
    }(o);
    n2 = new __PRIVATE_WatchTargetChange(r2, i, s, _ || null);
  } else if ("documentChange" in t2) {
    t2.documentChange;
    const r2 = t2.documentChange;
    r2.document, r2.document.name, r2.document.updateTime;
    const i = fromName(e, r2.document.name), s = __PRIVATE_fromVersion(r2.document.updateTime), o = r2.document.createTime ? __PRIVATE_fromVersion(r2.document.createTime) : SnapshotVersion.min(), _ = new ObjectValue({
      mapValue: {
        fields: r2.document.fields
      }
    }), a = MutableDocument.newFoundDocument(i, s, o, _), u2 = r2.targetIds || [], c = r2.removedTargetIds || [];
    n2 = new __PRIVATE_DocumentWatchChange(u2, c, a.key, a);
  } else if ("documentDelete" in t2) {
    t2.documentDelete;
    const r2 = t2.documentDelete;
    r2.document;
    const i = fromName(e, r2.document), s = r2.readTime ? __PRIVATE_fromVersion(r2.readTime) : SnapshotVersion.min(), o = MutableDocument.newNoDocument(i, s), _ = r2.removedTargetIds || [];
    n2 = new __PRIVATE_DocumentWatchChange([], _, o.key, o);
  } else if ("documentRemove" in t2) {
    t2.documentRemove;
    const r2 = t2.documentRemove;
    r2.document;
    const i = fromName(e, r2.document), s = r2.removedTargetIds || [];
    n2 = new __PRIVATE_DocumentWatchChange([], s, i, null);
  } else {
    if (!("filter" in t2)) return fail(11601, {
      Vt: t2
    });
    {
      t2.filter;
      const e2 = t2.filter;
      e2.targetId;
      const { count: r2 = 0, unchangedNames: i } = e2, s = new ExistenceFilter(r2, i), o = e2.targetId;
      n2 = new __PRIVATE_ExistenceFilterChange(o, s);
    }
  }
  return n2;
}
function toMutation(e, t2) {
  let n2;
  if (t2 instanceof __PRIVATE_SetMutation) n2 = {
    update: __PRIVATE_toMutationDocument(e, t2.key, t2.value)
  };
  else if (t2 instanceof __PRIVATE_DeleteMutation) n2 = {
    delete: __PRIVATE_toName(e, t2.key)
  };
  else if (t2 instanceof __PRIVATE_PatchMutation) n2 = {
    update: __PRIVATE_toMutationDocument(e, t2.key, t2.data),
    updateMask: __PRIVATE_toDocumentMask(t2.fieldMask)
  };
  else {
    if (!(t2 instanceof __PRIVATE_VerifyMutation)) return fail(16599, {
      dt: t2.type
    });
    n2 = {
      verify: __PRIVATE_toName(e, t2.key)
    };
  }
  return t2.fieldTransforms.length > 0 && (n2.updateTransforms = t2.fieldTransforms.map((e2) => function __PRIVATE_toFieldTransform(e3, t3) {
    const n3 = t3.transform;
    if (n3 instanceof __PRIVATE_ServerTimestampTransform) return {
      fieldPath: t3.field.canonicalString(),
      setToServerValue: "REQUEST_TIME"
    };
    if (n3 instanceof __PRIVATE_ArrayUnionTransformOperation) return {
      fieldPath: t3.field.canonicalString(),
      appendMissingElements: {
        values: n3.elements
      }
    };
    if (n3 instanceof __PRIVATE_ArrayRemoveTransformOperation) return {
      fieldPath: t3.field.canonicalString(),
      removeAllFromArray: {
        values: n3.elements
      }
    };
    if (n3 instanceof __PRIVATE_NumericIncrementTransformOperation) return {
      fieldPath: t3.field.canonicalString(),
      increment: n3.Ae
    };
    throw fail(20930, {
      transform: t3.transform
    });
  }(0, e2))), t2.precondition.isNone || (n2.currentDocument = function __PRIVATE_toPrecondition(e2, t3) {
    return void 0 !== t3.updateTime ? {
      updateTime: __PRIVATE_toVersion(e2, t3.updateTime)
    } : void 0 !== t3.exists ? {
      exists: t3.exists
    } : fail(27497);
  }(e, t2.precondition)), n2;
}
function __PRIVATE_fromWriteResults(e, t2) {
  return e && e.length > 0 ? (__PRIVATE_hardAssert(void 0 !== t2, 14353), e.map((e2) => function __PRIVATE_fromWriteResult(e3, t3) {
    let n2 = e3.updateTime ? __PRIVATE_fromVersion(e3.updateTime) : __PRIVATE_fromVersion(t3);
    return n2.isEqual(SnapshotVersion.min()) && // The Firestore Emulator currently returns an update time of 0 for
    // deletes of non-existing documents (rather than null). This breaks the
    // test "get deleted doc while offline with source=cache" as NoDocuments
    // with version 0 are filtered by IndexedDb's RemoteDocumentCache.
    // TODO(#2149): Remove this when Emulator is fixed
    (n2 = __PRIVATE_fromVersion(t3)), new MutationResult(n2, e3.transformResults || []);
  }(e2, t2))) : [];
}
function __PRIVATE_toDocumentsTarget(e, t2) {
  return {
    documents: [__PRIVATE_toQueryPath(e, t2.path)]
  };
}
function __PRIVATE_toQueryTarget(e, t2) {
  const n2 = {
    structuredQuery: {}
  }, r2 = t2.path;
  let i;
  null !== t2.collectionGroup ? (i = r2, n2.structuredQuery.from = [{
    collectionId: t2.collectionGroup,
    allDescendants: true
  }]) : (i = r2.popLast(), n2.structuredQuery.from = [{
    collectionId: r2.lastSegment()
  }]), n2.parent = __PRIVATE_toQueryPath(e, i);
  const s = function __PRIVATE_toFilters(e2) {
    if (0 === e2.length) return;
    return __PRIVATE_toFilter(CompositeFilter.create(
      e2,
      "and"
      /* CompositeOperator.AND */
    ));
  }(t2.filters);
  s && (n2.structuredQuery.where = s);
  const o = function __PRIVATE_toOrder(e2) {
    if (0 === e2.length) return;
    return e2.map((e3) => (
      // visible for testing
      function __PRIVATE_toPropertyOrder(e4) {
        return {
          field: __PRIVATE_toFieldPathReference(e4.field),
          direction: __PRIVATE_toDirection(e4.dir)
        };
      }(e3)
    ));
  }(t2.orderBy);
  o && (n2.structuredQuery.orderBy = o);
  const _ = __PRIVATE_toInt32Proto(e, t2.limit);
  return null !== _ && (n2.structuredQuery.limit = _), t2.startAt && (n2.structuredQuery.startAt = function __PRIVATE_toStartAtCursor(e2) {
    return {
      before: e2.inclusive,
      values: e2.position
    };
  }(t2.startAt)), t2.endAt && (n2.structuredQuery.endAt = function __PRIVATE_toEndAtCursor(e2) {
    return {
      before: !e2.inclusive,
      values: e2.position
    };
  }(t2.endAt)), {
    ft: n2,
    parent: i
  };
}
function __PRIVATE_convertQueryTargetToQuery(e) {
  let t2 = __PRIVATE_fromQueryPath(e.parent);
  const n2 = e.structuredQuery, r2 = n2.from ? n2.from.length : 0;
  let i = null;
  if (r2 > 0) {
    __PRIVATE_hardAssert(1 === r2, 65062);
    const e2 = n2.from[0];
    e2.allDescendants ? i = e2.collectionId : t2 = t2.child(e2.collectionId);
  }
  let s = [];
  n2.where && (s = function __PRIVATE_fromFilters(e2) {
    const t3 = __PRIVATE_fromFilter(e2);
    if (t3 instanceof CompositeFilter && __PRIVATE_compositeFilterIsFlatConjunction(t3)) return t3.getFilters();
    return [t3];
  }(n2.where));
  let o = [];
  n2.orderBy && (o = function __PRIVATE_fromOrder(e2) {
    return e2.map((e3) => function __PRIVATE_fromPropertyOrder(e4) {
      return new OrderBy(
        __PRIVATE_fromFieldPathReference(e4.field),
        // visible for testing
        function __PRIVATE_fromDirection(e5) {
          switch (e5) {
            case "ASCENDING":
              return "asc";
            case "DESCENDING":
              return "desc";
            default:
              return;
          }
        }(e4.direction)
      );
    }(e3));
  }(n2.orderBy));
  let _ = null;
  n2.limit && (_ = function __PRIVATE_fromInt32Proto(e2) {
    let t3;
    return t3 = "object" == typeof e2 ? e2.value : e2, __PRIVATE_isNullOrUndefined(t3) ? null : t3;
  }(n2.limit));
  let a = null;
  n2.startAt && (a = function __PRIVATE_fromStartAtCursor(e2) {
    const t3 = !!e2.before, n3 = e2.values || [];
    return new Bound(n3, t3);
  }(n2.startAt));
  let u2 = null;
  return n2.endAt && (u2 = function __PRIVATE_fromEndAtCursor(e2) {
    const t3 = !e2.before, n3 = e2.values || [];
    return new Bound(n3, t3);
  }(n2.endAt)), __PRIVATE_newQuery(t2, i, o, s, _, "F", a, u2);
}
function __PRIVATE_toListenRequestLabels(e, t2) {
  const n2 = function __PRIVATE_toLabel(e2) {
    switch (e2) {
      case "TargetPurposeListen":
        return null;
      case "TargetPurposeExistenceFilterMismatch":
        return "existence-filter-mismatch";
      case "TargetPurposeExistenceFilterMismatchBloom":
        return "existence-filter-mismatch-bloom";
      case "TargetPurposeLimboResolution":
        return "limbo-document";
      default:
        return fail(28987, {
          purpose: e2
        });
    }
  }(t2.purpose);
  return null == n2 ? null : {
    "goog-listen-tags": n2
  };
}
function __PRIVATE_fromFilter(e) {
  return void 0 !== e.unaryFilter ? function __PRIVATE_fromUnaryFilter(e2) {
    switch (e2.unaryFilter.op) {
      case "IS_NAN":
        const t2 = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(t2, "==", {
          doubleValue: NaN
        });
      case "IS_NULL":
        const n2 = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(n2, "==", {
          nullValue: "NULL_VALUE"
        });
      case "IS_NOT_NAN":
        const r2 = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(r2, "!=", {
          doubleValue: NaN
        });
      case "IS_NOT_NULL":
        const i = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(i, "!=", {
          nullValue: "NULL_VALUE"
        });
      case "OPERATOR_UNSPECIFIED":
        return fail(61313);
      default:
        return fail(60726);
    }
  }(e) : void 0 !== e.fieldFilter ? function __PRIVATE_fromFieldFilter(e2) {
    return FieldFilter.create(__PRIVATE_fromFieldPathReference(e2.fieldFilter.field), function __PRIVATE_fromOperatorName(e3) {
      switch (e3) {
        case "EQUAL":
          return "==";
        case "NOT_EQUAL":
          return "!=";
        case "GREATER_THAN":
          return ">";
        case "GREATER_THAN_OR_EQUAL":
          return ">=";
        case "LESS_THAN":
          return "<";
        case "LESS_THAN_OR_EQUAL":
          return "<=";
        case "ARRAY_CONTAINS":
          return "array-contains";
        case "IN":
          return "in";
        case "NOT_IN":
          return "not-in";
        case "ARRAY_CONTAINS_ANY":
          return "array-contains-any";
        case "OPERATOR_UNSPECIFIED":
          return fail(58110);
        default:
          return fail(50506);
      }
    }(e2.fieldFilter.op), e2.fieldFilter.value);
  }(e) : void 0 !== e.compositeFilter ? function __PRIVATE_fromCompositeFilter(e2) {
    return CompositeFilter.create(e2.compositeFilter.filters.map((e3) => __PRIVATE_fromFilter(e3)), function __PRIVATE_fromCompositeOperatorName(e3) {
      switch (e3) {
        case "AND":
          return "and";
        case "OR":
          return "or";
        default:
          return fail(1026);
      }
    }(e2.compositeFilter.op));
  }(e) : fail(30097, {
    filter: e
  });
}
function __PRIVATE_toDirection(e) {
  return ft[e];
}
function __PRIVATE_toOperatorName(e) {
  return gt[e];
}
function __PRIVATE_toCompositeOperatorName(e) {
  return pt[e];
}
function __PRIVATE_toFieldPathReference(e) {
  return {
    fieldPath: e.canonicalString()
  };
}
function __PRIVATE_fromFieldPathReference(e) {
  return FieldPath$1.fromServerFormat(e.fieldPath);
}
function __PRIVATE_toFilter(e) {
  return e instanceof FieldFilter ? function __PRIVATE_toUnaryOrFieldFilter(e2) {
    if ("==" === e2.op) {
      if (__PRIVATE_isNanValue(e2.value)) return {
        unaryFilter: {
          field: __PRIVATE_toFieldPathReference(e2.field),
          op: "IS_NAN"
        }
      };
      if (__PRIVATE_isNullValue(e2.value)) return {
        unaryFilter: {
          field: __PRIVATE_toFieldPathReference(e2.field),
          op: "IS_NULL"
        }
      };
    } else if ("!=" === e2.op) {
      if (__PRIVATE_isNanValue(e2.value)) return {
        unaryFilter: {
          field: __PRIVATE_toFieldPathReference(e2.field),
          op: "IS_NOT_NAN"
        }
      };
      if (__PRIVATE_isNullValue(e2.value)) return {
        unaryFilter: {
          field: __PRIVATE_toFieldPathReference(e2.field),
          op: "IS_NOT_NULL"
        }
      };
    }
    return {
      fieldFilter: {
        field: __PRIVATE_toFieldPathReference(e2.field),
        op: __PRIVATE_toOperatorName(e2.op),
        value: e2.value
      }
    };
  }(e) : e instanceof CompositeFilter ? function __PRIVATE_toCompositeFilter(e2) {
    const t2 = e2.getFilters().map((e3) => __PRIVATE_toFilter(e3));
    if (1 === t2.length) return t2[0];
    return {
      compositeFilter: {
        op: __PRIVATE_toCompositeOperatorName(e2.op),
        filters: t2
      }
    };
  }(e) : fail(54877, {
    filter: e
  });
}
function __PRIVATE_toDocumentMask(e) {
  const t2 = [];
  return e.fields.forEach((e2) => t2.push(e2.canonicalString())), {
    fieldPaths: t2
  };
}
function __PRIVATE_isValidResourceName(e) {
  return e.length >= 4 && "projects" === e.get(0) && "databases" === e.get(2);
}
function __PRIVATE_isProtoValueSerializable(e) {
  return !!e && "function" == typeof e._toProto && "ProtoValue" === e._protoValueType;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class TargetData {
  constructor(e, t2, n2, r2, i = SnapshotVersion.min(), s = SnapshotVersion.min(), o = ByteString.EMPTY_BYTE_STRING, _ = null) {
    this.target = e, this.targetId = t2, this.purpose = n2, this.sequenceNumber = r2, this.snapshotVersion = i, this.lastLimboFreeSnapshotVersion = s, this.resumeToken = o, this.expectedCount = _;
  }
  /** Creates a new target data instance with an updated sequence number. */
  withSequenceNumber(e) {
    return new TargetData(this.target, this.targetId, this.purpose, e, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, this.expectedCount);
  }
  /**
   * Creates a new target data instance with an updated resume token and
   * snapshot version.
   */
  withResumeToken(e, t2) {
    return new TargetData(
      this.target,
      this.targetId,
      this.purpose,
      this.sequenceNumber,
      t2,
      this.lastLimboFreeSnapshotVersion,
      e,
      /* expectedCount= */
      null
    );
  }
  /**
   * Creates a new target data instance with an updated expected count.
   */
  withExpectedCount(e) {
    return new TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, e);
  }
  /**
   * Creates a new target data instance with an updated last limbo free
   * snapshot version number.
   */
  withLastLimboFreeSnapshotVersion(e) {
    return new TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, e, this.resumeToken, this.expectedCount);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_LocalSerializer {
  constructor(e) {
    this.yt = e;
  }
}
function __PRIVATE_fromBundledQuery(e) {
  const t2 = __PRIVATE_convertQueryTargetToQuery({
    parent: e.parent,
    structuredQuery: e.structuredQuery
  });
  return "LAST" === e.limitType ? __PRIVATE_queryWithLimit(
    t2,
    t2.limit,
    "L"
    /* LimitType.Last */
  ) : t2;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_MemoryIndexManager {
  constructor() {
    this.Sn = new __PRIVATE_MemoryCollectionParentIndex();
  }
  addToCollectionParentIndex(e, t2) {
    return this.Sn.add(t2), PersistencePromise.resolve();
  }
  getCollectionParents(e, t2) {
    return PersistencePromise.resolve(this.Sn.getEntries(t2));
  }
  addFieldIndex(e, t2) {
    return PersistencePromise.resolve();
  }
  deleteFieldIndex(e, t2) {
    return PersistencePromise.resolve();
  }
  deleteAllFieldIndexes(e) {
    return PersistencePromise.resolve();
  }
  createTargetIndexes(e, t2) {
    return PersistencePromise.resolve();
  }
  getDocumentsMatchingTarget(e, t2) {
    return PersistencePromise.resolve(null);
  }
  getIndexType(e, t2) {
    return PersistencePromise.resolve(
      0
      /* IndexType.NONE */
    );
  }
  getFieldIndexes(e, t2) {
    return PersistencePromise.resolve([]);
  }
  getNextCollectionGroupToUpdate(e) {
    return PersistencePromise.resolve(null);
  }
  getMinOffset(e, t2) {
    return PersistencePromise.resolve(IndexOffset.min());
  }
  getMinOffsetFromCollectionGroup(e, t2) {
    return PersistencePromise.resolve(IndexOffset.min());
  }
  updateCollectionGroup(e, t2, n2) {
    return PersistencePromise.resolve();
  }
  updateIndexEntries(e, t2) {
    return PersistencePromise.resolve();
  }
}
class __PRIVATE_MemoryCollectionParentIndex {
  constructor() {
    this.index = {};
  }
  // Returns false if the entry already existed.
  add(e) {
    const t2 = e.lastSegment(), n2 = e.popLast(), r2 = this.index[t2] || new SortedSet(ResourcePath.comparator), i = !r2.has(n2);
    return this.index[t2] = r2.add(n2), i;
  }
  has(e) {
    const t2 = e.lastSegment(), n2 = e.popLast(), r2 = this.index[t2];
    return r2 && r2.has(n2);
  }
  getEntries(e) {
    return (this.index[e] || new SortedSet(ResourcePath.comparator)).toArray();
  }
}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const St = {
  didRun: false,
  sequenceNumbersCollected: 0,
  targetsRemoved: 0,
  documentsRemoved: 0
}, Dt = 41943040;
class LruParams {
  static withCacheSize(e) {
    return new LruParams(e, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
  }
  constructor(e, t2, n2) {
    this.cacheSizeCollectionThreshold = e, this.percentileToCollect = t2, this.maximumSequenceNumbersToCollect = n2;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
LruParams.DEFAULT_COLLECTION_PERCENTILE = 10, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, LruParams.DEFAULT = new LruParams(Dt, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), LruParams.DISABLED = new LruParams(-1, 0, 0);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_TargetIdGenerator {
  constructor(e) {
    this.sr = e;
  }
  next() {
    return this.sr += 2, this.sr;
  }
  static _r() {
    return new __PRIVATE_TargetIdGenerator(0);
  }
  static ar() {
    return new __PRIVATE_TargetIdGenerator(-1);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ct = "LruGarbageCollector", vt = 1048576;
function __PRIVATE_bufferEntryComparator([e, t2], [n2, r2]) {
  const i = __PRIVATE_primitiveComparator(e, n2);
  return 0 === i ? __PRIVATE_primitiveComparator(t2, r2) : i;
}
class __PRIVATE_RollingSequenceNumberBuffer {
  constructor(e) {
    this.Pr = e, this.buffer = new SortedSet(__PRIVATE_bufferEntryComparator), this.Tr = 0;
  }
  Ir() {
    return ++this.Tr;
  }
  Er(e) {
    const t2 = [e, this.Ir()];
    if (this.buffer.size < this.Pr) this.buffer = this.buffer.add(t2);
    else {
      const e2 = this.buffer.last();
      __PRIVATE_bufferEntryComparator(t2, e2) < 0 && (this.buffer = this.buffer.delete(e2).add(t2));
    }
  }
  get maxValue() {
    return this.buffer.last()[0];
  }
}
class __PRIVATE_LruScheduler {
  constructor(e, t2, n2) {
    this.garbageCollector = e, this.asyncQueue = t2, this.localStore = n2, this.Rr = null;
  }
  start() {
    -1 !== this.garbageCollector.params.cacheSizeCollectionThreshold && this.Ar(6e4);
  }
  stop() {
    this.Rr && (this.Rr.cancel(), this.Rr = null);
  }
  get started() {
    return null !== this.Rr;
  }
  Ar(e) {
    __PRIVATE_logDebug(Ct, `Garbage collection scheduled in ${e}ms`), this.Rr = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection", e, async () => {
      this.Rr = null;
      try {
        await this.localStore.collectGarbage(this.garbageCollector);
      } catch (e2) {
        __PRIVATE_isIndexedDbTransactionError(e2) ? __PRIVATE_logDebug(Ct, "Ignoring IndexedDB error during garbage collection: ", e2) : await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
      }
      await this.Ar(3e5);
    });
  }
}
class __PRIVATE_LruGarbageCollectorImpl {
  constructor(e, t2) {
    this.Vr = e, this.params = t2;
  }
  calculateTargetCount(e, t2) {
    return this.Vr.dr(e).next((e2) => Math.floor(t2 / 100 * e2));
  }
  nthSequenceNumber(e, t2) {
    if (0 === t2) return PersistencePromise.resolve(__PRIVATE_ListenSequence.ce);
    const n2 = new __PRIVATE_RollingSequenceNumberBuffer(t2);
    return this.Vr.forEachTarget(e, (e2) => n2.Er(e2.sequenceNumber)).next(() => this.Vr.mr(e, (e2) => n2.Er(e2))).next(() => n2.maxValue);
  }
  removeTargets(e, t2, n2) {
    return this.Vr.removeTargets(e, t2, n2);
  }
  removeOrphanedDocuments(e, t2) {
    return this.Vr.removeOrphanedDocuments(e, t2);
  }
  collect(e, t2) {
    return -1 === this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", "Garbage collection skipped; disabled"), PersistencePromise.resolve(St)) : this.getCacheSize(e).next((n2) => n2 < this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", `Garbage collection skipped; Cache size ${n2} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), St) : this.gr(e, t2));
  }
  getCacheSize(e) {
    return this.Vr.getCacheSize(e);
  }
  gr(e, t2) {
    let n2, r2, i, s, o, _, a;
    const u2 = Date.now();
    return this.calculateTargetCount(e, this.params.percentileToCollect).next((t3) => (
      // Cap at the configured max
      (t3 > this.params.maximumSequenceNumbersToCollect ? (__PRIVATE_logDebug("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t3}`), r2 = this.params.maximumSequenceNumbersToCollect) : r2 = t3, s = Date.now(), this.nthSequenceNumber(e, r2))
    )).next((r3) => (n2 = r3, o = Date.now(), this.removeTargets(e, n2, t2))).next((t3) => (i = t3, _ = Date.now(), this.removeOrphanedDocuments(e, n2))).next((e2) => {
      if (a = Date.now(), __PRIVATE_getLogLevel() <= LogLevel.DEBUG) {
        __PRIVATE_logDebug("LruGarbageCollector", `LRU Garbage Collection
	Counted targets in ${s - u2}ms
	Determined least recently used ${r2} in ` + (o - s) + `ms
	Removed ${i} targets in ` + (_ - o) + `ms
	Removed ${e2} documents in ` + (a - _) + `ms
Total Duration: ${a - u2}ms`);
      }
      return PersistencePromise.resolve({
        didRun: true,
        sequenceNumbersCollected: r2,
        targetsRemoved: i,
        documentsRemoved: e2
      });
    });
  }
}
function __PRIVATE_newLruGarbageCollector(e, t2) {
  return new __PRIVATE_LruGarbageCollectorImpl(e, t2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class RemoteDocumentChangeBuffer {
  constructor() {
    this.changes = new ObjectMap((e) => e.toString(), (e, t2) => e.isEqual(t2)), this.changesApplied = false;
  }
  /**
   * Buffers a `RemoteDocumentCache.addEntry()` call.
   *
   * You can only modify documents that have already been retrieved via
   * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
   */
  addEntry(e) {
    this.assertNotApplied(), this.changes.set(e.key, e);
  }
  /**
   * Buffers a `RemoteDocumentCache.removeEntry()` call.
   *
   * You can only remove documents that have already been retrieved via
   * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
   */
  removeEntry(e, t2) {
    this.assertNotApplied(), this.changes.set(e, MutableDocument.newInvalidDocument(e).setReadTime(t2));
  }
  /**
   * Looks up an entry in the cache. The buffered changes will first be checked,
   * and if no buffered change applies, this will forward to
   * `RemoteDocumentCache.getEntry()`.
   *
   * @param transaction - The transaction in which to perform any persistence
   *     operations.
   * @param documentKey - The key of the entry to look up.
   * @returns The cached document or an invalid document if we have nothing
   * cached.
   */
  getEntry(e, t2) {
    this.assertNotApplied();
    const n2 = this.changes.get(t2);
    return void 0 !== n2 ? PersistencePromise.resolve(n2) : this.getFromCache(e, t2);
  }
  /**
   * Looks up several entries in the cache, forwarding to
   * `RemoteDocumentCache.getEntry()`.
   *
   * @param transaction - The transaction in which to perform any persistence
   *     operations.
   * @param documentKeys - The keys of the entries to look up.
   * @returns A map of cached documents, indexed by key. If an entry cannot be
   *     found, the corresponding key will be mapped to an invalid document.
   */
  getEntries(e, t2) {
    return this.getAllFromCache(e, t2);
  }
  /**
   * Applies buffered changes to the underlying RemoteDocumentCache, using
   * the provided transaction.
   */
  apply(e) {
    return this.assertNotApplied(), this.changesApplied = true, this.applyChanges(e);
  }
  /** Helper to assert this.changes is not null  */
  assertNotApplied() {
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class OverlayedDocument {
  constructor(e, t2) {
    this.overlayedDocument = e, this.mutatedFields = t2;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class LocalDocumentsView {
  constructor(e, t2, n2, r2) {
    this.remoteDocumentCache = e, this.mutationQueue = t2, this.documentOverlayCache = n2, this.indexManager = r2;
  }
  /**
   * Get the local view of the document identified by `key`.
   *
   * @returns Local view of the document or null if we don't have any cached
   * state for it.
   */
  getDocument(e, t2) {
    let n2 = null;
    return this.documentOverlayCache.getOverlay(e, t2).next((r2) => (n2 = r2, this.remoteDocumentCache.getEntry(e, t2))).next((e2) => (null !== n2 && __PRIVATE_mutationApplyToLocalView(n2.mutation, e2, FieldMask.empty(), Timestamp.now()), e2));
  }
  /**
   * Gets the local view of the documents identified by `keys`.
   *
   * If we don't have cached state for a document in `keys`, a NoDocument will
   * be stored for that key in the resulting set.
   */
  getDocuments(e, t2) {
    return this.remoteDocumentCache.getEntries(e, t2).next((t3) => this.getLocalViewOfDocuments(e, t3, __PRIVATE_documentKeySet()).next(() => t3));
  }
  /**
   * Similar to `getDocuments`, but creates the local view from the given
   * `baseDocs` without retrieving documents from the local store.
   *
   * @param transaction - The transaction this operation is scoped to.
   * @param docs - The documents to apply local mutations to get the local views.
   * @param existenceStateChanged - The set of document keys whose existence state
   *   is changed. This is useful to determine if some documents overlay needs
   *   to be recalculated.
   */
  getLocalViewOfDocuments(e, t2, n2 = __PRIVATE_documentKeySet()) {
    const r2 = __PRIVATE_newOverlayMap();
    return this.populateOverlays(e, r2, t2).next(() => this.computeViews(e, t2, r2, n2).next((e2) => {
      let t3 = documentMap();
      return e2.forEach((e3, n3) => {
        t3 = t3.insert(e3, n3.overlayedDocument);
      }), t3;
    }));
  }
  /**
   * Gets the overlayed documents for the given document map, which will include
   * the local view of those documents and a `FieldMask` indicating which fields
   * are mutated locally, `null` if overlay is a Set or Delete mutation.
   */
  getOverlayedDocuments(e, t2) {
    const n2 = __PRIVATE_newOverlayMap();
    return this.populateOverlays(e, n2, t2).next(() => this.computeViews(e, t2, n2, __PRIVATE_documentKeySet()));
  }
  /**
   * Fetches the overlays for {@code docs} and adds them to provided overlay map
   * if the map does not already contain an entry for the given document key.
   */
  populateOverlays(e, t2, n2) {
    const r2 = [];
    return n2.forEach((e2) => {
      t2.has(e2) || r2.push(e2);
    }), this.documentOverlayCache.getOverlays(e, r2).next((e2) => {
      e2.forEach((e3, n3) => {
        t2.set(e3, n3);
      });
    });
  }
  /**
   * Computes the local view for the given documents.
   *
   * @param docs - The documents to compute views for. It also has the base
   *   version of the documents.
   * @param overlays - The overlays that need to be applied to the given base
   *   version of the documents.
   * @param existenceStateChanged - A set of documents whose existence states
   *   might have changed. This is used to determine if we need to re-calculate
   *   overlays from mutation queues.
   * @returns A map represents the local documents view.
   */
  computeViews(e, t2, n2, r2) {
    let i = __PRIVATE_mutableDocumentMap();
    const s = __PRIVATE_newDocumentKeyMap(), o = function __PRIVATE_newOverlayedDocumentMap() {
      return __PRIVATE_newDocumentKeyMap();
    }();
    return t2.forEach((e2, t3) => {
      const o2 = n2.get(t3.key);
      r2.has(t3.key) && (void 0 === o2 || o2.mutation instanceof __PRIVATE_PatchMutation) ? i = i.insert(t3.key, t3) : void 0 !== o2 ? (s.set(t3.key, o2.mutation.getFieldMask()), __PRIVATE_mutationApplyToLocalView(o2.mutation, t3, o2.mutation.getFieldMask(), Timestamp.now())) : (
        // no overlay exists
        // Using EMPTY to indicate there is no overlay for the document.
        s.set(t3.key, FieldMask.empty())
      );
    }), this.recalculateAndSaveOverlays(e, i).next((e2) => (e2.forEach((e3, t3) => s.set(e3, t3)), t2.forEach((e3, t3) => o.set(e3, new OverlayedDocument(t3, s.get(e3) ?? null))), o));
  }
  recalculateAndSaveOverlays(e, t2) {
    const n2 = __PRIVATE_newDocumentKeyMap();
    let r2 = new SortedMap((e2, t3) => e2 - t3), i = __PRIVATE_documentKeySet();
    return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e, t2).next((e2) => {
      for (const i2 of e2) i2.keys().forEach((e3) => {
        const s = t2.get(e3);
        if (null === s) return;
        let o = n2.get(e3) || FieldMask.empty();
        o = i2.applyToLocalView(s, o), n2.set(e3, o);
        const _ = (r2.get(i2.batchId) || __PRIVATE_documentKeySet()).add(e3);
        r2 = r2.insert(i2.batchId, _);
      });
    }).next(() => {
      const s = [], o = r2.getReverseIterator();
      for (; o.hasNext(); ) {
        const r3 = o.getNext(), _ = r3.key, a = r3.value, u2 = __PRIVATE_newMutationMap();
        a.forEach((e2) => {
          if (!i.has(e2)) {
            const r4 = __PRIVATE_calculateOverlayMutation(t2.get(e2), n2.get(e2));
            null !== r4 && u2.set(e2, r4), i = i.add(e2);
          }
        }), s.push(this.documentOverlayCache.saveOverlays(e, _, u2));
      }
      return PersistencePromise.waitFor(s);
    }).next(() => n2);
  }
  /**
   * Recalculates overlays by reading the documents from remote document cache
   * first, and saves them after they are calculated.
   */
  recalculateAndSaveOverlaysForDocumentKeys(e, t2) {
    return this.remoteDocumentCache.getEntries(e, t2).next((t3) => this.recalculateAndSaveOverlays(e, t3));
  }
  /**
   * Performs a query against the local view of all documents.
   *
   * @param transaction - The persistence transaction.
   * @param query - The query to match documents against.
   * @param offset - Read time and key to start scanning by (exclusive).
   * @param context - A optional tracker to keep a record of important details
   *   during database local query execution.
   */
  getDocumentsMatchingQuery(e, t2, n2, r2) {
    return __PRIVATE_isDocumentQuery$1(t2) ? this.getDocumentsMatchingDocumentQuery(e, t2.path) : __PRIVATE_isCollectionGroupQuery(t2) ? this.getDocumentsMatchingCollectionGroupQuery(e, t2, n2, r2) : this.getDocumentsMatchingCollectionQuery(e, t2, n2, r2);
  }
  /**
   * Given a collection group, returns the next documents that follow the provided offset, along
   * with an updated batch ID.
   *
   * <p>The documents returned by this method are ordered by remote version from the provided
   * offset. If there are no more remote documents after the provided offset, documents with
   * mutations in order of batch id from the offset are returned. Since all documents in a batch are
   * returned together, the total number of documents returned can exceed {@code count}.
   *
   * @param transaction
   * @param collectionGroup - The collection group for the documents.
   * @param offset - The offset to index into.
   * @param count - The number of documents to return
   * @returns A LocalWriteResult with the documents that follow the provided offset and the last processed batch id.
   */
  getNextDocuments(e, t2, n2, r2) {
    return this.remoteDocumentCache.getAllFromCollectionGroup(e, t2, n2, r2).next((i) => {
      const s = r2 - i.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(e, t2, n2.largestBatchId, r2 - i.size) : PersistencePromise.resolve(__PRIVATE_newOverlayMap());
      let o = B, _ = i;
      return s.next((t3) => PersistencePromise.forEach(t3, (t4, n3) => (o < n3.largestBatchId && (o = n3.largestBatchId), i.get(t4) ? PersistencePromise.resolve() : this.remoteDocumentCache.getEntry(e, t4).next((e2) => {
        _ = _.insert(t4, e2);
      }))).next(() => this.populateOverlays(e, t3, i)).next(() => this.computeViews(e, _, t3, __PRIVATE_documentKeySet())).next((e2) => ({
        batchId: o,
        changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e2)
      })));
    });
  }
  getDocumentsMatchingDocumentQuery(e, t2) {
    return this.getDocument(e, new DocumentKey(t2)).next((e2) => {
      let t3 = documentMap();
      return e2.isFoundDocument() && (t3 = t3.insert(e2.key, e2)), t3;
    });
  }
  getDocumentsMatchingCollectionGroupQuery(e, t2, n2, r2) {
    const i = t2.collectionGroup;
    let s = documentMap();
    return this.indexManager.getCollectionParents(e, i).next((o) => PersistencePromise.forEach(o, (o2) => {
      const _ = function __PRIVATE_asCollectionQueryAtPath(e2, t3) {
        return new __PRIVATE_QueryImpl(
          t3,
          /*collectionGroup=*/
          null,
          e2.explicitOrderBy.slice(),
          e2.filters.slice(),
          e2.limit,
          e2.limitType,
          e2.startAt,
          e2.endAt
        );
      }(t2, o2.child(i));
      return this.getDocumentsMatchingCollectionQuery(e, _, n2, r2).next((e2) => {
        e2.forEach((e3, t3) => {
          s = s.insert(e3, t3);
        });
      });
    }).next(() => s));
  }
  getDocumentsMatchingCollectionQuery(e, t2, n2, r2) {
    let i;
    return this.documentOverlayCache.getOverlaysForCollection(e, t2.path, n2.largestBatchId).next((s) => (i = s, this.remoteDocumentCache.getDocumentsMatchingQuery(e, t2, n2, i, r2))).next((e2) => {
      i.forEach((t3, n4) => {
        const r3 = n4.getKey();
        null === e2.get(r3) && (e2 = e2.insert(r3, MutableDocument.newInvalidDocument(r3)));
      });
      let n3 = documentMap();
      return e2.forEach((e3, r3) => {
        const s = i.get(e3);
        void 0 !== s && __PRIVATE_mutationApplyToLocalView(s.mutation, r3, FieldMask.empty(), Timestamp.now()), // Finally, insert the documents that still match the query
        __PRIVATE_queryMatches(t2, r3) && (n3 = n3.insert(e3, r3));
      }), n3;
    });
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_MemoryBundleCache {
  constructor(e) {
    this.serializer = e, this.Nr = /* @__PURE__ */ new Map(), this.Br = /* @__PURE__ */ new Map();
  }
  getBundleMetadata(e, t2) {
    return PersistencePromise.resolve(this.Nr.get(t2));
  }
  saveBundleMetadata(e, t2) {
    return this.Nr.set(
      t2.id,
      /** Decodes a BundleMetadata proto into a BundleMetadata object. */
      function __PRIVATE_fromBundleMetadata(e2) {
        return {
          id: e2.id,
          version: e2.version,
          createTime: __PRIVATE_fromVersion(e2.createTime)
        };
      }(t2)
    ), PersistencePromise.resolve();
  }
  getNamedQuery(e, t2) {
    return PersistencePromise.resolve(this.Br.get(t2));
  }
  saveNamedQuery(e, t2) {
    return this.Br.set(t2.name, function __PRIVATE_fromProtoNamedQuery(e2) {
      return {
        name: e2.name,
        query: __PRIVATE_fromBundledQuery(e2.bundledQuery),
        readTime: __PRIVATE_fromVersion(e2.readTime)
      };
    }(t2)), PersistencePromise.resolve();
  }
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_MemoryDocumentOverlayCache {
  constructor() {
    this.overlays = new SortedMap(DocumentKey.comparator), this.Lr = /* @__PURE__ */ new Map();
  }
  getOverlay(e, t2) {
    return PersistencePromise.resolve(this.overlays.get(t2));
  }
  getOverlays(e, t2) {
    const n2 = __PRIVATE_newOverlayMap();
    return PersistencePromise.forEach(t2, (t3) => this.getOverlay(e, t3).next((e2) => {
      null !== e2 && n2.set(t3, e2);
    })).next(() => n2);
  }
  saveOverlays(e, t2, n2) {
    return n2.forEach((n3, r2) => {
      this.bt(e, t2, r2);
    }), PersistencePromise.resolve();
  }
  removeOverlaysForBatchId(e, t2, n2) {
    const r2 = this.Lr.get(n2);
    return void 0 !== r2 && (r2.forEach((e2) => this.overlays = this.overlays.remove(e2)), this.Lr.delete(n2)), PersistencePromise.resolve();
  }
  getOverlaysForCollection(e, t2, n2) {
    const r2 = __PRIVATE_newOverlayMap(), i = t2.length + 1, s = new DocumentKey(t2.child("")), o = this.overlays.getIteratorFrom(s);
    for (; o.hasNext(); ) {
      const e2 = o.getNext().value, s2 = e2.getKey();
      if (!t2.isPrefixOf(s2.path)) break;
      s2.path.length === i && (e2.largestBatchId > n2 && r2.set(e2.getKey(), e2));
    }
    return PersistencePromise.resolve(r2);
  }
  getOverlaysForCollectionGroup(e, t2, n2, r2) {
    let i = new SortedMap((e2, t3) => e2 - t3);
    const s = this.overlays.getIterator();
    for (; s.hasNext(); ) {
      const e2 = s.getNext().value;
      if (e2.getKey().getCollectionGroup() === t2 && e2.largestBatchId > n2) {
        let t3 = i.get(e2.largestBatchId);
        null === t3 && (t3 = __PRIVATE_newOverlayMap(), i = i.insert(e2.largestBatchId, t3)), t3.set(e2.getKey(), e2);
      }
    }
    const o = __PRIVATE_newOverlayMap(), _ = i.getIterator();
    for (; _.hasNext(); ) {
      if (_.getNext().value.forEach((e2, t3) => o.set(e2, t3)), o.size() >= r2) break;
    }
    return PersistencePromise.resolve(o);
  }
  bt(e, t2, n2) {
    const r2 = this.overlays.get(n2.key);
    if (null !== r2) {
      const e2 = this.Lr.get(r2.largestBatchId).delete(n2.key);
      this.Lr.set(r2.largestBatchId, e2);
    }
    this.overlays = this.overlays.insert(n2.key, new Overlay(t2, n2));
    let i = this.Lr.get(t2);
    void 0 === i && (i = __PRIVATE_documentKeySet(), this.Lr.set(t2, i)), this.Lr.set(t2, i.add(n2.key));
  }
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_MemoryGlobalsCache {
  constructor() {
    this.sessionToken = ByteString.EMPTY_BYTE_STRING;
  }
  getSessionToken(e) {
    return PersistencePromise.resolve(this.sessionToken);
  }
  setSessionToken(e, t2) {
    return this.sessionToken = t2, PersistencePromise.resolve();
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_ReferenceSet {
  constructor() {
    this.kr = new SortedSet(__PRIVATE_DocReference.Kr), // A set of outstanding references to a document sorted by target id.
    this.qr = new SortedSet(__PRIVATE_DocReference.Ur);
  }
  /** Returns true if the reference set contains no references. */
  isEmpty() {
    return this.kr.isEmpty();
  }
  /** Adds a reference to the given document key for the given ID. */
  addReference(e, t2) {
    const n2 = new __PRIVATE_DocReference(e, t2);
    this.kr = this.kr.add(n2), this.qr = this.qr.add(n2);
  }
  /** Add references to the given document keys for the given ID. */
  $r(e, t2) {
    e.forEach((e2) => this.addReference(e2, t2));
  }
  /**
   * Removes a reference to the given document key for the given
   * ID.
   */
  removeReference(e, t2) {
    this.Wr(new __PRIVATE_DocReference(e, t2));
  }
  Qr(e, t2) {
    e.forEach((e2) => this.removeReference(e2, t2));
  }
  /**
   * Clears all references with a given ID. Calls removeRef() for each key
   * removed.
   */
  Gr(e) {
    const t2 = new DocumentKey(new ResourcePath([])), n2 = new __PRIVATE_DocReference(t2, e), r2 = new __PRIVATE_DocReference(t2, e + 1), i = [];
    return this.qr.forEachInRange([n2, r2], (e2) => {
      this.Wr(e2), i.push(e2.key);
    }), i;
  }
  zr() {
    this.kr.forEach((e) => this.Wr(e));
  }
  Wr(e) {
    this.kr = this.kr.delete(e), this.qr = this.qr.delete(e);
  }
  jr(e) {
    const t2 = new DocumentKey(new ResourcePath([])), n2 = new __PRIVATE_DocReference(t2, e), r2 = new __PRIVATE_DocReference(t2, e + 1);
    let i = __PRIVATE_documentKeySet();
    return this.qr.forEachInRange([n2, r2], (e2) => {
      i = i.add(e2.key);
    }), i;
  }
  containsKey(e) {
    const t2 = new __PRIVATE_DocReference(e, 0), n2 = this.kr.firstAfterOrEqual(t2);
    return null !== n2 && e.isEqual(n2.key);
  }
}
class __PRIVATE_DocReference {
  constructor(e, t2) {
    this.key = e, this.Hr = t2;
  }
  /** Compare by key then by ID */
  static Kr(e, t2) {
    return DocumentKey.comparator(e.key, t2.key) || __PRIVATE_primitiveComparator(e.Hr, t2.Hr);
  }
  /** Compare by ID then by key */
  static Ur(e, t2) {
    return __PRIVATE_primitiveComparator(e.Hr, t2.Hr) || DocumentKey.comparator(e.key, t2.key);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_MemoryMutationQueue {
  constructor(e, t2) {
    this.indexManager = e, this.referenceDelegate = t2, /**
     * The set of all mutations that have been sent but not yet been applied to
     * the backend.
     */
    this.mutationQueue = [], /** Next value to use when assigning sequential IDs to each mutation batch. */
    this.Yn = 1, /** An ordered mapping between documents and the mutations batch IDs. */
    this.Jr = new SortedSet(__PRIVATE_DocReference.Kr);
  }
  checkEmpty(e) {
    return PersistencePromise.resolve(0 === this.mutationQueue.length);
  }
  addMutationBatch(e, t2, n2, r2) {
    const i = this.Yn;
    this.Yn++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
    const s = new MutationBatch(i, t2, n2, r2);
    this.mutationQueue.push(s);
    for (const t3 of r2) this.Jr = this.Jr.add(new __PRIVATE_DocReference(t3.key, i)), this.indexManager.addToCollectionParentIndex(e, t3.key.path.popLast());
    return PersistencePromise.resolve(s);
  }
  lookupMutationBatch(e, t2) {
    return PersistencePromise.resolve(this.Zr(t2));
  }
  getNextMutationBatchAfterBatchId(e, t2) {
    const n2 = t2 + 1, r2 = this.Xr(n2), i = r2 < 0 ? 0 : r2;
    return PersistencePromise.resolve(this.mutationQueue.length > i ? this.mutationQueue[i] : null);
  }
  getHighestUnacknowledgedBatchId() {
    return PersistencePromise.resolve(0 === this.mutationQueue.length ? U : this.Yn - 1);
  }
  getAllMutationBatches(e) {
    return PersistencePromise.resolve(this.mutationQueue.slice());
  }
  getAllMutationBatchesAffectingDocumentKey(e, t2) {
    const n2 = new __PRIVATE_DocReference(t2, 0), r2 = new __PRIVATE_DocReference(t2, Number.POSITIVE_INFINITY), i = [];
    return this.Jr.forEachInRange([n2, r2], (e2) => {
      const t3 = this.Zr(e2.Hr);
      i.push(t3);
    }), PersistencePromise.resolve(i);
  }
  getAllMutationBatchesAffectingDocumentKeys(e, t2) {
    let n2 = new SortedSet(__PRIVATE_primitiveComparator);
    return t2.forEach((e2) => {
      const t3 = new __PRIVATE_DocReference(e2, 0), r2 = new __PRIVATE_DocReference(e2, Number.POSITIVE_INFINITY);
      this.Jr.forEachInRange([t3, r2], (e3) => {
        n2 = n2.add(e3.Hr);
      });
    }), PersistencePromise.resolve(this.Yr(n2));
  }
  getAllMutationBatchesAffectingQuery(e, t2) {
    const n2 = t2.path, r2 = n2.length + 1;
    let i = n2;
    DocumentKey.isDocumentKey(i) || (i = i.child(""));
    const s = new __PRIVATE_DocReference(new DocumentKey(i), 0);
    let o = new SortedSet(__PRIVATE_primitiveComparator);
    return this.Jr.forEachWhile((e2) => {
      const t3 = e2.key.path;
      return !!n2.isPrefixOf(t3) && // Rows with document keys more than one segment longer than the query
      // path can't be matches. For example, a query on 'rooms' can't match
      // the document /rooms/abc/messages/xyx.
      // TODO(mcg): we'll need a different scanner when we implement
      // ancestor queries.
      (t3.length === r2 && (o = o.add(e2.Hr)), true);
    }, s), PersistencePromise.resolve(this.Yr(o));
  }
  Yr(e) {
    const t2 = [];
    return e.forEach((e2) => {
      const n2 = this.Zr(e2);
      null !== n2 && t2.push(n2);
    }), t2;
  }
  removeMutationBatch(e, t2) {
    __PRIVATE_hardAssert(0 === this.ei(t2.batchId, "removed"), 55003), this.mutationQueue.shift();
    let n2 = this.Jr;
    return PersistencePromise.forEach(t2.mutations, (r2) => {
      const i = new __PRIVATE_DocReference(r2.key, t2.batchId);
      return n2 = n2.delete(i), this.referenceDelegate.markPotentiallyOrphaned(e, r2.key);
    }).next(() => {
      this.Jr = n2;
    });
  }
  nr(e) {
  }
  containsKey(e, t2) {
    const n2 = new __PRIVATE_DocReference(t2, 0), r2 = this.Jr.firstAfterOrEqual(n2);
    return PersistencePromise.resolve(t2.isEqual(r2 && r2.key));
  }
  performConsistencyCheck(e) {
    return this.mutationQueue.length, PersistencePromise.resolve();
  }
  /**
   * Finds the index of the given batchId in the mutation queue and asserts that
   * the resulting index is within the bounds of the queue.
   *
   * @param batchId - The batchId to search for
   * @param action - A description of what the caller is doing, phrased in passive
   * form (e.g. "acknowledged" in a routine that acknowledges batches).
   */
  ei(e, t2) {
    return this.Xr(e);
  }
  /**
   * Finds the index of the given batchId in the mutation queue. This operation
   * is O(1).
   *
   * @returns The computed index of the batch with the given batchId, based on
   * the state of the queue. Note this index can be negative if the requested
   * batchId has already been removed from the queue or past the end of the
   * queue if the batchId is larger than the last added batch.
   */
  Xr(e) {
    if (0 === this.mutationQueue.length)
      return 0;
    return e - this.mutationQueue[0].batchId;
  }
  /**
   * A version of lookupMutationBatch that doesn't return a promise, this makes
   * other functions that uses this code easier to read and more efficient.
   */
  Zr(e) {
    const t2 = this.Xr(e);
    if (t2 < 0 || t2 >= this.mutationQueue.length) return null;
    return this.mutationQueue[t2];
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_MemoryRemoteDocumentCacheImpl {
  /**
   * @param sizer - Used to assess the size of a document. For eager GC, this is
   * expected to just return 0 to avoid unnecessarily doing the work of
   * calculating the size.
   */
  constructor(e) {
    this.ti = e, /** Underlying cache of documents and their read times. */
    this.docs = function __PRIVATE_documentEntryMap() {
      return new SortedMap(DocumentKey.comparator);
    }(), /** Size of all cached documents. */
    this.size = 0;
  }
  setIndexManager(e) {
    this.indexManager = e;
  }
  /**
   * Adds the supplied entry to the cache and updates the cache size as appropriate.
   *
   * All calls of `addEntry`  are required to go through the RemoteDocumentChangeBuffer
   * returned by `newChangeBuffer()`.
   */
  addEntry(e, t2) {
    const n2 = t2.key, r2 = this.docs.get(n2), i = r2 ? r2.size : 0, s = this.ti(t2);
    return this.docs = this.docs.insert(n2, {
      document: t2.mutableCopy(),
      size: s
    }), this.size += s - i, this.indexManager.addToCollectionParentIndex(e, n2.path.popLast());
  }
  /**
   * Removes the specified entry from the cache and updates the cache size as appropriate.
   *
   * All calls of `removeEntry` are required to go through the RemoteDocumentChangeBuffer
   * returned by `newChangeBuffer()`.
   */
  removeEntry(e) {
    const t2 = this.docs.get(e);
    t2 && (this.docs = this.docs.remove(e), this.size -= t2.size);
  }
  getEntry(e, t2) {
    const n2 = this.docs.get(t2);
    return PersistencePromise.resolve(n2 ? n2.document.mutableCopy() : MutableDocument.newInvalidDocument(t2));
  }
  getEntries(e, t2) {
    let n2 = __PRIVATE_mutableDocumentMap();
    return t2.forEach((e2) => {
      const t3 = this.docs.get(e2);
      n2 = n2.insert(e2, t3 ? t3.document.mutableCopy() : MutableDocument.newInvalidDocument(e2));
    }), PersistencePromise.resolve(n2);
  }
  getDocumentsMatchingQuery(e, t2, n2, r2) {
    let i = __PRIVATE_mutableDocumentMap();
    const s = t2.path, o = new DocumentKey(s.child("__id-9223372036854775808__")), _ = this.docs.getIteratorFrom(o);
    for (; _.hasNext(); ) {
      const { key: e2, value: { document: o2 } } = _.getNext();
      if (!s.isPrefixOf(e2.path)) break;
      e2.path.length > s.length + 1 || (__PRIVATE_indexOffsetComparator(__PRIVATE_newIndexOffsetFromDocument(o2), n2) <= 0 || (r2.has(o2.key) || __PRIVATE_queryMatches(t2, o2)) && (i = i.insert(o2.key, o2.mutableCopy())));
    }
    return PersistencePromise.resolve(i);
  }
  getAllFromCollectionGroup(e, t2, n2, r2) {
    fail(9500);
  }
  ni(e, t2) {
    return PersistencePromise.forEach(this.docs, (e2) => t2(e2));
  }
  newChangeBuffer(e) {
    return new __PRIVATE_MemoryRemoteDocumentChangeBuffer(this);
  }
  getSize(e) {
    return PersistencePromise.resolve(this.size);
  }
}
class __PRIVATE_MemoryRemoteDocumentChangeBuffer extends RemoteDocumentChangeBuffer {
  constructor(e) {
    super(), this.Mr = e;
  }
  applyChanges(e) {
    const t2 = [];
    return this.changes.forEach((n2, r2) => {
      r2.isValidDocument() ? t2.push(this.Mr.addEntry(e, r2)) : this.Mr.removeEntry(n2);
    }), PersistencePromise.waitFor(t2);
  }
  getFromCache(e, t2) {
    return this.Mr.getEntry(e, t2);
  }
  getAllFromCache(e, t2) {
    return this.Mr.getEntries(e, t2);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_MemoryTargetCache {
  constructor(e) {
    this.persistence = e, /**
     * Maps a target to the data about that target
     */
    this.ri = new ObjectMap((e2) => __PRIVATE_canonifyTarget(e2), __PRIVATE_targetEquals), /** The last received snapshot version. */
    this.lastRemoteSnapshotVersion = SnapshotVersion.min(), /** The highest numbered target ID encountered. */
    this.highestTargetId = 0, /** The highest sequence number encountered. */
    this.ii = 0, /**
     * A ordered bidirectional mapping between documents and the remote target
     * IDs.
     */
    this.si = new __PRIVATE_ReferenceSet(), this.targetCount = 0, this.oi = __PRIVATE_TargetIdGenerator._r();
  }
  forEachTarget(e, t2) {
    return this.ri.forEach((e2, n2) => t2(n2)), PersistencePromise.resolve();
  }
  getLastRemoteSnapshotVersion(e) {
    return PersistencePromise.resolve(this.lastRemoteSnapshotVersion);
  }
  getHighestSequenceNumber(e) {
    return PersistencePromise.resolve(this.ii);
  }
  allocateTargetId(e) {
    return this.highestTargetId = this.oi.next(), PersistencePromise.resolve(this.highestTargetId);
  }
  setTargetsMetadata(e, t2, n2) {
    return n2 && (this.lastRemoteSnapshotVersion = n2), t2 > this.ii && (this.ii = t2), PersistencePromise.resolve();
  }
  lr(e) {
    this.ri.set(e.target, e);
    const t2 = e.targetId;
    t2 > this.highestTargetId && (this.oi = new __PRIVATE_TargetIdGenerator(t2), this.highestTargetId = t2), e.sequenceNumber > this.ii && (this.ii = e.sequenceNumber);
  }
  addTargetData(e, t2) {
    return this.lr(t2), this.targetCount += 1, PersistencePromise.resolve();
  }
  updateTargetData(e, t2) {
    return this.lr(t2), PersistencePromise.resolve();
  }
  removeTargetData(e, t2) {
    return this.ri.delete(t2.target), this.si.Gr(t2.targetId), this.targetCount -= 1, PersistencePromise.resolve();
  }
  removeTargets(e, t2, n2) {
    let r2 = 0;
    const i = [];
    return this.ri.forEach((s, o) => {
      o.sequenceNumber <= t2 && null === n2.get(o.targetId) && (this.ri.delete(s), i.push(this.removeMatchingKeysForTargetId(e, o.targetId)), r2++);
    }), PersistencePromise.waitFor(i).next(() => r2);
  }
  getTargetCount(e) {
    return PersistencePromise.resolve(this.targetCount);
  }
  getTargetData(e, t2) {
    const n2 = this.ri.get(t2) || null;
    return PersistencePromise.resolve(n2);
  }
  addMatchingKeys(e, t2, n2) {
    return this.si.$r(t2, n2), PersistencePromise.resolve();
  }
  removeMatchingKeys(e, t2, n2) {
    this.si.Qr(t2, n2);
    const r2 = this.persistence.referenceDelegate, i = [];
    return r2 && t2.forEach((t3) => {
      i.push(r2.markPotentiallyOrphaned(e, t3));
    }), PersistencePromise.waitFor(i);
  }
  removeMatchingKeysForTargetId(e, t2) {
    return this.si.Gr(t2), PersistencePromise.resolve();
  }
  getMatchingKeysForTargetId(e, t2) {
    const n2 = this.si.jr(t2);
    return PersistencePromise.resolve(n2);
  }
  containsKey(e, t2) {
    return PersistencePromise.resolve(this.si.containsKey(t2));
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_MemoryPersistence {
  /**
   * The constructor accepts a factory for creating a reference delegate. This
   * allows both the delegate and this instance to have strong references to
   * each other without having nullable fields that would then need to be
   * checked or asserted on every access.
   */
  constructor(e, t2) {
    this._i = {}, this.overlays = {}, this.ai = new __PRIVATE_ListenSequence(0), this.ui = false, this.ui = true, this.ci = new __PRIVATE_MemoryGlobalsCache(), this.referenceDelegate = e(this), this.li = new __PRIVATE_MemoryTargetCache(this);
    this.indexManager = new __PRIVATE_MemoryIndexManager(), this.remoteDocumentCache = function __PRIVATE_newMemoryRemoteDocumentCache(e2) {
      return new __PRIVATE_MemoryRemoteDocumentCacheImpl(e2);
    }((e2) => this.referenceDelegate.hi(e2)), this.serializer = new __PRIVATE_LocalSerializer(t2), this.Pi = new __PRIVATE_MemoryBundleCache(this.serializer);
  }
  start() {
    return Promise.resolve();
  }
  shutdown() {
    return this.ui = false, Promise.resolve();
  }
  get started() {
    return this.ui;
  }
  setDatabaseDeletedListener() {
  }
  setNetworkEnabled() {
  }
  getIndexManager(e) {
    return this.indexManager;
  }
  getDocumentOverlayCache(e) {
    let t2 = this.overlays[e.toKey()];
    return t2 || (t2 = new __PRIVATE_MemoryDocumentOverlayCache(), this.overlays[e.toKey()] = t2), t2;
  }
  getMutationQueue(e, t2) {
    let n2 = this._i[e.toKey()];
    return n2 || (n2 = new __PRIVATE_MemoryMutationQueue(t2, this.referenceDelegate), this._i[e.toKey()] = n2), n2;
  }
  getGlobalsCache() {
    return this.ci;
  }
  getTargetCache() {
    return this.li;
  }
  getRemoteDocumentCache() {
    return this.remoteDocumentCache;
  }
  getBundleCache() {
    return this.Pi;
  }
  runTransaction(e, t2, n2) {
    __PRIVATE_logDebug("MemoryPersistence", "Starting transaction:", e);
    const r2 = new __PRIVATE_MemoryTransaction(this.ai.next());
    return this.referenceDelegate.Ti(), n2(r2).next((e2) => this.referenceDelegate.Ii(r2).next(() => e2)).toPromise().then((e2) => (r2.raiseOnCommittedEvent(), e2));
  }
  Ei(e, t2) {
    return PersistencePromise.or(Object.values(this._i).map((n2) => () => n2.containsKey(e, t2)));
  }
}
class __PRIVATE_MemoryTransaction extends PersistenceTransaction {
  constructor(e) {
    super(), this.currentSequenceNumber = e;
  }
}
class __PRIVATE_MemoryEagerDelegate {
  constructor(e) {
    this.persistence = e, /** Tracks all documents that are active in Query views. */
    this.Ri = new __PRIVATE_ReferenceSet(), /** The list of documents that are potentially GCed after each transaction. */
    this.Ai = null;
  }
  static Vi(e) {
    return new __PRIVATE_MemoryEagerDelegate(e);
  }
  get di() {
    if (this.Ai) return this.Ai;
    throw fail(60996);
  }
  addReference(e, t2, n2) {
    return this.Ri.addReference(n2, t2), this.di.delete(n2.toString()), PersistencePromise.resolve();
  }
  removeReference(e, t2, n2) {
    return this.Ri.removeReference(n2, t2), this.di.add(n2.toString()), PersistencePromise.resolve();
  }
  markPotentiallyOrphaned(e, t2) {
    return this.di.add(t2.toString()), PersistencePromise.resolve();
  }
  removeTarget(e, t2) {
    this.Ri.Gr(t2.targetId).forEach((e2) => this.di.add(e2.toString()));
    const n2 = this.persistence.getTargetCache();
    return n2.getMatchingKeysForTargetId(e, t2.targetId).next((e2) => {
      e2.forEach((e3) => this.di.add(e3.toString()));
    }).next(() => n2.removeTargetData(e, t2));
  }
  Ti() {
    this.Ai = /* @__PURE__ */ new Set();
  }
  Ii(e) {
    const t2 = this.persistence.getRemoteDocumentCache().newChangeBuffer();
    return PersistencePromise.forEach(this.di, (n2) => {
      const r2 = DocumentKey.fromPath(n2);
      return this.mi(e, r2).next((e2) => {
        e2 || t2.removeEntry(r2, SnapshotVersion.min());
      });
    }).next(() => (this.Ai = null, t2.apply(e)));
  }
  updateLimboDocument(e, t2) {
    return this.mi(e, t2).next((e2) => {
      e2 ? this.di.delete(t2.toString()) : this.di.add(t2.toString());
    });
  }
  hi(e) {
    return 0;
  }
  mi(e, t2) {
    return PersistencePromise.or([() => PersistencePromise.resolve(this.Ri.containsKey(t2)), () => this.persistence.getTargetCache().containsKey(e, t2), () => this.persistence.Ei(e, t2)]);
  }
}
class __PRIVATE_MemoryLruDelegate {
  constructor(e, t2) {
    this.persistence = e, this.fi = new ObjectMap((e2) => __PRIVATE_encodeResourcePath(e2.path), (e2, t3) => e2.isEqual(t3)), this.garbageCollector = __PRIVATE_newLruGarbageCollector(this, t2);
  }
  static Vi(e, t2) {
    return new __PRIVATE_MemoryLruDelegate(e, t2);
  }
  // No-ops, present so memory persistence doesn't have to care which delegate
  // it has.
  Ti() {
  }
  Ii(e) {
    return PersistencePromise.resolve();
  }
  forEachTarget(e, t2) {
    return this.persistence.getTargetCache().forEachTarget(e, t2);
  }
  dr(e) {
    const t2 = this.pr(e);
    return this.persistence.getTargetCache().getTargetCount(e).next((e2) => t2.next((t3) => e2 + t3));
  }
  pr(e) {
    let t2 = 0;
    return this.mr(e, (e2) => {
      t2++;
    }).next(() => t2);
  }
  mr(e, t2) {
    return PersistencePromise.forEach(this.fi, (n2, r2) => this.wr(e, n2, r2).next((e2) => e2 ? PersistencePromise.resolve() : t2(r2)));
  }
  removeTargets(e, t2, n2) {
    return this.persistence.getTargetCache().removeTargets(e, t2, n2);
  }
  removeOrphanedDocuments(e, t2) {
    let n2 = 0;
    const r2 = this.persistence.getRemoteDocumentCache(), i = r2.newChangeBuffer();
    return r2.ni(e, (r3) => this.wr(e, r3, t2).next((e2) => {
      e2 || (n2++, i.removeEntry(r3, SnapshotVersion.min()));
    })).next(() => i.apply(e)).next(() => n2);
  }
  markPotentiallyOrphaned(e, t2) {
    return this.fi.set(t2, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  removeTarget(e, t2) {
    const n2 = t2.withSequenceNumber(e.currentSequenceNumber);
    return this.persistence.getTargetCache().updateTargetData(e, n2);
  }
  addReference(e, t2, n2) {
    return this.fi.set(n2, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  removeReference(e, t2, n2) {
    return this.fi.set(n2, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  updateLimboDocument(e, t2) {
    return this.fi.set(t2, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  hi(e) {
    let t2 = e.key.toString().length;
    return e.isFoundDocument() && (t2 += __PRIVATE_estimateByteSize(e.data.value)), t2;
  }
  wr(e, t2, n2) {
    return PersistencePromise.or([() => this.persistence.Ei(e, t2), () => this.persistence.getTargetCache().containsKey(e, t2), () => {
      const e2 = this.fi.get(t2);
      return PersistencePromise.resolve(void 0 !== e2 && e2 > n2);
    }]);
  }
  getCacheSize(e) {
    return this.persistence.getRemoteDocumentCache().getSize(e);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_LocalViewChanges {
  constructor(e, t2, n2, r2) {
    this.targetId = e, this.fromCache = t2, this.Ts = n2, this.Is = r2;
  }
  static Es(e, t2) {
    let n2 = __PRIVATE_documentKeySet(), r2 = __PRIVATE_documentKeySet();
    for (const e2 of t2.docChanges) switch (e2.type) {
      case 0:
        n2 = n2.add(e2.doc.key);
        break;
      case 1:
        r2 = r2.add(e2.doc.key);
    }
    return new __PRIVATE_LocalViewChanges(e, t2.fromCache, n2, r2);
  }
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class QueryContext {
  constructor() {
    this._documentReadCount = 0;
  }
  get documentReadCount() {
    return this._documentReadCount;
  }
  incrementDocumentReadCount(e) {
    this._documentReadCount += e;
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_QueryEngine {
  constructor() {
    this.Rs = false, this.As = false, /**
     * SDK only decides whether it should create index when collection size is
     * larger than this.
     */
    this.Vs = 100, this.ds = /**
    * This cost represents the evaluation result of
    * (([index, docKey] + [docKey, docContent]) per document in the result set)
    * / ([docKey, docContent] per documents in full collection scan) coming from
    * experiment [enter PR experiment URL here].
    */
    function __PRIVATE_getDefaultRelativeIndexReadCostPerDocument() {
      return isSafari() ? 8 : __PRIVATE_getAndroidVersion(getUA()) > 0 ? 6 : 4;
    }();
  }
  /** Sets the document view to query against. */
  initialize(e, t2) {
    this.fs = e, this.indexManager = t2, this.Rs = true;
  }
  /** Returns all local documents matching the specified query. */
  getDocumentsMatchingQuery(e, t2, n2, r2) {
    const i = {
      result: null
    };
    return this.gs(e, t2).next((e2) => {
      i.result = e2;
    }).next(() => {
      if (!i.result) return this.ps(e, t2, r2, n2).next((e2) => {
        i.result = e2;
      });
    }).next(() => {
      if (i.result) return;
      const n3 = new QueryContext();
      return this.ys(e, t2, n3).next((r3) => {
        if (i.result = r3, this.As) return this.ws(e, t2, n3, r3.size);
      });
    }).next(() => i.result);
  }
  ws(e, t2, n2, r2) {
    return n2.documentReadCount < this.Vs ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "SDK will not create cache indexes for query:", __PRIVATE_stringifyQuery(t2), "since it only creates cache indexes for collection contains", "more than or equal to", this.Vs, "documents"), PersistencePromise.resolve()) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Query:", __PRIVATE_stringifyQuery(t2), "scans", n2.documentReadCount, "local documents and returns", r2, "documents as results."), n2.documentReadCount > this.ds * r2 ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "The SDK decides to create cache indexes for query:", __PRIVATE_stringifyQuery(t2), "as using cache indexes may help improve performance."), this.indexManager.createTargetIndexes(e, __PRIVATE_queryToTarget(t2))) : PersistencePromise.resolve());
  }
  /**
   * Performs an indexed query that evaluates the query based on a collection's
   * persisted index values. Returns `null` if an index is not available.
   */
  gs(e, t2) {
    if (__PRIVATE_queryMatchesAllDocuments(t2))
      return PersistencePromise.resolve(null);
    let n2 = __PRIVATE_queryToTarget(t2);
    return this.indexManager.getIndexType(e, n2).next((r2) => 0 === r2 ? null : (null !== t2.limit && 1 === r2 && // We cannot apply a limit for targets that are served using a partial
    // index. If a partial index will be used to serve the target, the
    // query may return a superset of documents that match the target
    // (e.g. if the index doesn't include all the target's filters), or
    // may return the correct set of documents in the wrong order (e.g. if
    // the index doesn't include a segment for one of the orderBys).
    // Therefore, a limit should not be applied in such cases.
    (t2 = __PRIVATE_queryWithLimit(
      t2,
      null,
      "F"
      /* LimitType.First */
    ), n2 = __PRIVATE_queryToTarget(t2)), this.indexManager.getDocumentsMatchingTarget(e, n2).next((r3) => {
      const i = __PRIVATE_documentKeySet(...r3);
      return this.fs.getDocuments(e, i).next((r4) => this.indexManager.getMinOffset(e, n2).next((n3) => {
        const s = this.bs(t2, r4);
        return this.Ss(t2, s, i, n3.readTime) ? this.gs(e, __PRIVATE_queryWithLimit(
          t2,
          null,
          "F"
          /* LimitType.First */
        )) : this.Ds(e, s, t2, n3);
      }));
    })));
  }
  /**
   * Performs a query based on the target's persisted query mapping. Returns
   * `null` if the mapping is not available or cannot be used.
   */
  ps(e, t2, n2, r2) {
    return __PRIVATE_queryMatchesAllDocuments(t2) || r2.isEqual(SnapshotVersion.min()) ? PersistencePromise.resolve(null) : this.fs.getDocuments(e, n2).next((i) => {
      const s = this.bs(t2, i);
      return this.Ss(t2, s, n2, r2) ? PersistencePromise.resolve(null) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Re-using previous result from %s to execute query: %s", r2.toString(), __PRIVATE_stringifyQuery(t2)), this.Ds(e, s, t2, __PRIVATE_newIndexOffsetSuccessorFromReadTime(r2, B)).next((e2) => e2));
    });
  }
  /** Applies the query filter and sorting to the provided documents.  */
  bs(e, t2) {
    let n2 = new SortedSet(__PRIVATE_newQueryComparator(e));
    return t2.forEach((t3, r2) => {
      __PRIVATE_queryMatches(e, r2) && (n2 = n2.add(r2));
    }), n2;
  }
  /**
   * Determines if a limit query needs to be refilled from cache, making it
   * ineligible for index-free execution.
   *
   * @param query - The query.
   * @param sortedPreviousResults - The documents that matched the query when it
   * was last synchronized, sorted by the query's comparator.
   * @param remoteKeys - The document keys that matched the query at the last
   * snapshot.
   * @param limboFreeSnapshotVersion - The version of the snapshot when the
   * query was last synchronized.
   */
  Ss(e, t2, n2, r2) {
    if (null === e.limit)
      return false;
    if (n2.size !== t2.size)
      return true;
    const i = "F" === e.limitType ? t2.last() : t2.first();
    return !!i && (i.hasPendingWrites || i.version.compareTo(r2) > 0);
  }
  ys(e, t2, n2) {
    return __PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Using full collection scan to execute query:", __PRIVATE_stringifyQuery(t2)), this.fs.getDocumentsMatchingQuery(e, t2, IndexOffset.min(), n2);
  }
  /**
   * Combines the results from an indexed execution with the remaining documents
   * that have not yet been indexed.
   */
  Ds(e, t2, n2, r2) {
    return this.fs.getDocumentsMatchingQuery(e, n2, r2).next((e2) => (
      // Merge with existing results
      (t2.forEach((t3) => {
        e2 = e2.insert(t3.key, t3);
      }), e2)
    ));
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Bt = "LocalStore", Lt = 3e8;
class __PRIVATE_LocalStoreImpl {
  constructor(e, t2, n2, r2) {
    this.persistence = e, this.Cs = t2, this.serializer = r2, /**
     * Maps a targetID to data about its target.
     *
     * PORTING NOTE: We are using an immutable data structure on Web to make re-runs
     * of `applyRemoteEvent()` idempotent.
     */
    this.vs = new SortedMap(__PRIVATE_primitiveComparator), /** Maps a target to its targetID. */
    // TODO(wuandy): Evaluate if TargetId can be part of Target.
    this.Fs = new ObjectMap((e2) => __PRIVATE_canonifyTarget(e2), __PRIVATE_targetEquals), /**
     * A per collection group index of the last read time processed by
     * `getNewDocumentChanges()`.
     *
     * PORTING NOTE: This is only used for multi-tab synchronization.
     */
    this.Ms = /* @__PURE__ */ new Map(), this.xs = e.getRemoteDocumentCache(), this.li = e.getTargetCache(), this.Pi = e.getBundleCache(), this.Os(n2);
  }
  Os(e) {
    this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e), this.indexManager = this.persistence.getIndexManager(e), this.mutationQueue = this.persistence.getMutationQueue(e, this.indexManager), this.localDocuments = new LocalDocumentsView(this.xs, this.mutationQueue, this.documentOverlayCache, this.indexManager), this.xs.setIndexManager(this.indexManager), this.Cs.initialize(this.localDocuments, this.indexManager);
  }
  collectGarbage(e) {
    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (t2) => e.collect(t2, this.vs));
  }
}
function __PRIVATE_newLocalStore(e, t2, n2, r2) {
  return new __PRIVATE_LocalStoreImpl(e, t2, n2, r2);
}
async function __PRIVATE_localStoreHandleUserChange(e, t2) {
  const n2 = __PRIVATE_debugCast(e);
  return await n2.persistence.runTransaction("Handle user change", "readonly", (e2) => {
    let r2;
    return n2.mutationQueue.getAllMutationBatches(e2).next((i) => (r2 = i, n2.Os(t2), n2.mutationQueue.getAllMutationBatches(e2))).next((t3) => {
      const i = [], s = [];
      let o = __PRIVATE_documentKeySet();
      for (const e3 of r2) {
        i.push(e3.batchId);
        for (const t4 of e3.mutations) o = o.add(t4.key);
      }
      for (const e3 of t3) {
        s.push(e3.batchId);
        for (const t4 of e3.mutations) o = o.add(t4.key);
      }
      return n2.localDocuments.getDocuments(e2, o).next((e3) => ({
        Ns: e3,
        removedBatchIds: i,
        addedBatchIds: s
      }));
    });
  });
}
function __PRIVATE_localStoreAcknowledgeBatch(e, t2) {
  const n2 = __PRIVATE_debugCast(e);
  return n2.persistence.runTransaction("Acknowledge batch", "readwrite-primary", (e2) => {
    const r2 = t2.batch.keys(), i = n2.xs.newChangeBuffer({
      trackRemovals: true
    });
    return function __PRIVATE_applyWriteToRemoteDocuments(e3, t3, n3, r3) {
      const i2 = n3.batch, s = i2.keys();
      let o = PersistencePromise.resolve();
      return s.forEach((e4) => {
        o = o.next(() => r3.getEntry(t3, e4)).next((t4) => {
          const s2 = n3.docVersions.get(e4);
          __PRIVATE_hardAssert(null !== s2, 48541), t4.version.compareTo(s2) < 0 && (i2.applyToRemoteDocument(t4, n3), t4.isValidDocument() && // We use the commitVersion as the readTime rather than the
          // document's updateTime since the updateTime is not advanced
          // for updates that do not modify the underlying document.
          (t4.setReadTime(n3.commitVersion), r3.addEntry(t4)));
        });
      }), o.next(() => e3.mutationQueue.removeMutationBatch(t3, i2));
    }(n2, e2, t2, i).next(() => i.apply(e2)).next(() => n2.mutationQueue.performConsistencyCheck(e2)).next(() => n2.documentOverlayCache.removeOverlaysForBatchId(e2, r2, t2.batch.batchId)).next(() => n2.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e2, function __PRIVATE_getKeysWithTransformResults(e3) {
      let t3 = __PRIVATE_documentKeySet();
      for (let n3 = 0; n3 < e3.mutationResults.length; ++n3) {
        e3.mutationResults[n3].transformResults.length > 0 && (t3 = t3.add(e3.batch.mutations[n3].key));
      }
      return t3;
    }(t2))).next(() => n2.localDocuments.getDocuments(e2, r2));
  });
}
function __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e) {
  const t2 = __PRIVATE_debugCast(e);
  return t2.persistence.runTransaction("Get last remote snapshot version", "readonly", (e2) => t2.li.getLastRemoteSnapshotVersion(e2));
}
function __PRIVATE_localStoreApplyRemoteEventToLocalCache(e, t2) {
  const n2 = __PRIVATE_debugCast(e), r2 = t2.snapshotVersion;
  let i = n2.vs;
  return n2.persistence.runTransaction("Apply remote event", "readwrite-primary", (e2) => {
    const s = n2.xs.newChangeBuffer({
      trackRemovals: true
    });
    i = n2.vs;
    const o = [];
    t2.targetChanges.forEach((s2, _2) => {
      const a2 = i.get(_2);
      if (!a2) return;
      o.push(n2.li.removeMatchingKeys(e2, s2.removedDocuments, _2).next(() => n2.li.addMatchingKeys(e2, s2.addedDocuments, _2)));
      let u2 = a2.withSequenceNumber(e2.currentSequenceNumber);
      null !== t2.targetMismatches.get(_2) ? u2 = u2.withResumeToken(ByteString.EMPTY_BYTE_STRING, SnapshotVersion.min()).withLastLimboFreeSnapshotVersion(SnapshotVersion.min()) : s2.resumeToken.approximateByteSize() > 0 && (u2 = u2.withResumeToken(s2.resumeToken, r2)), i = i.insert(_2, u2), // Update the target data if there are target changes (or if
      // sufficient time has passed since the last update).
      /**
      * Returns true if the newTargetData should be persisted during an update of
      * an active target. TargetData should always be persisted when a target is
      * being released and should not call this function.
      *
      * While the target is active, TargetData updates can be omitted when nothing
      * about the target has changed except metadata like the resume token or
      * snapshot version. Occasionally it's worth the extra write to prevent these
      * values from getting too stale after a crash, but this doesn't have to be
      * too frequent.
      */
      function __PRIVATE_shouldPersistTargetData(e3, t3, n3) {
        if (0 === e3.resumeToken.approximateByteSize()) return true;
        const r3 = t3.snapshotVersion.toMicroseconds() - e3.snapshotVersion.toMicroseconds();
        if (r3 >= Lt) return true;
        const i2 = n3.addedDocuments.size + n3.modifiedDocuments.size + n3.removedDocuments.size;
        return i2 > 0;
      }(a2, u2, s2) && o.push(n2.li.updateTargetData(e2, u2));
    });
    let _ = __PRIVATE_mutableDocumentMap(), a = __PRIVATE_documentKeySet();
    if (t2.documentUpdates.forEach((r3) => {
      t2.resolvedLimboDocuments.has(r3) && o.push(n2.persistence.referenceDelegate.updateLimboDocument(e2, r3));
    }), // Each loop iteration only affects its "own" doc, so it's safe to get all
    // the remote documents in advance in a single call.
    o.push(__PRIVATE_populateDocumentChangeBuffer(e2, s, t2.documentUpdates).next((e3) => {
      _ = e3.Bs, a = e3.Ls;
    })), !r2.isEqual(SnapshotVersion.min())) {
      const t3 = n2.li.getLastRemoteSnapshotVersion(e2).next((t4) => n2.li.setTargetsMetadata(e2, e2.currentSequenceNumber, r2));
      o.push(t3);
    }
    return PersistencePromise.waitFor(o).next(() => s.apply(e2)).next(() => n2.localDocuments.getLocalViewOfDocuments(e2, _, a)).next(() => _);
  }).then((e2) => (n2.vs = i, e2));
}
function __PRIVATE_populateDocumentChangeBuffer(e, t2, n2) {
  let r2 = __PRIVATE_documentKeySet(), i = __PRIVATE_documentKeySet();
  return n2.forEach((e2) => r2 = r2.add(e2)), t2.getEntries(e, r2).next((e2) => {
    let r3 = __PRIVATE_mutableDocumentMap();
    return n2.forEach((n3, s) => {
      const o = e2.get(n3);
      s.isFoundDocument() !== o.isFoundDocument() && (i = i.add(n3)), // Note: The order of the steps below is important, since we want
      // to ensure that rejected limbo resolutions (which fabricate
      // NoDocuments with SnapshotVersion.min()) never add documents to
      // cache.
      s.isNoDocument() && s.version.isEqual(SnapshotVersion.min()) ? (
        // NoDocuments with SnapshotVersion.min() are used in manufactured
        // events. We remove these documents from cache since we lost
        // access.
        (t2.removeEntry(n3, s.readTime), r3 = r3.insert(n3, s))
      ) : !o.isValidDocument() || s.version.compareTo(o.version) > 0 || 0 === s.version.compareTo(o.version) && o.hasPendingWrites ? (t2.addEntry(s), r3 = r3.insert(n3, s)) : __PRIVATE_logDebug(Bt, "Ignoring outdated watch update for ", n3, ". Current version:", o.version, " Watch version:", s.version);
    }), {
      Bs: r3,
      Ls: i
    };
  });
}
function __PRIVATE_localStoreGetNextMutationBatch(e, t2) {
  const n2 = __PRIVATE_debugCast(e);
  return n2.persistence.runTransaction("Get next mutation batch", "readonly", (e2) => (void 0 === t2 && (t2 = U), n2.mutationQueue.getNextMutationBatchAfterBatchId(e2, t2)));
}
function __PRIVATE_localStoreAllocateTarget(e, t2) {
  const n2 = __PRIVATE_debugCast(e);
  return n2.persistence.runTransaction("Allocate target", "readwrite", (e2) => {
    let r2;
    return n2.li.getTargetData(e2, t2).next((i) => i ? (
      // This target has been listened to previously, so reuse the
      // previous targetID.
      // TODO(mcg): freshen last accessed date?
      (r2 = i, PersistencePromise.resolve(r2))
    ) : n2.li.allocateTargetId(e2).next((i2) => (r2 = new TargetData(t2, i2, "TargetPurposeListen", e2.currentSequenceNumber), n2.li.addTargetData(e2, r2).next(() => r2))));
  }).then((e2) => {
    const r2 = n2.vs.get(e2.targetId);
    return (null === r2 || e2.snapshotVersion.compareTo(r2.snapshotVersion) > 0) && (n2.vs = n2.vs.insert(e2.targetId, e2), n2.Fs.set(t2, e2.targetId)), e2;
  });
}
async function __PRIVATE_localStoreReleaseTarget(e, t2, n2) {
  const r2 = __PRIVATE_debugCast(e), i = r2.vs.get(t2), s = n2 ? "readwrite" : "readwrite-primary";
  try {
    n2 || await r2.persistence.runTransaction("Release target", s, (e2) => r2.persistence.referenceDelegate.removeTarget(e2, i));
  } catch (e2) {
    if (!__PRIVATE_isIndexedDbTransactionError(e2)) throw e2;
    __PRIVATE_logDebug(Bt, `Failed to update sequence numbers for target ${t2}: ${e2}`);
  }
  r2.vs = r2.vs.remove(t2), r2.Fs.delete(i.target);
}
function __PRIVATE_localStoreExecuteQuery(e, t2, n2) {
  const r2 = __PRIVATE_debugCast(e);
  let i = SnapshotVersion.min(), s = __PRIVATE_documentKeySet();
  return r2.persistence.runTransaction(
    "Execute query",
    "readwrite",
    // Use readwrite instead of readonly so indexes can be created
    // Use readwrite instead of readonly so indexes can be created
    (e2) => function __PRIVATE_localStoreGetTargetData(e3, t3, n3) {
      const r3 = __PRIVATE_debugCast(e3), i2 = r3.Fs.get(n3);
      return void 0 !== i2 ? PersistencePromise.resolve(r3.vs.get(i2)) : r3.li.getTargetData(t3, n3);
    }(r2, e2, __PRIVATE_queryToTarget(t2)).next((t3) => {
      if (t3) return i = t3.lastLimboFreeSnapshotVersion, r2.li.getMatchingKeysForTargetId(e2, t3.targetId).next((e3) => {
        s = e3;
      });
    }).next(() => r2.Cs.getDocumentsMatchingQuery(e2, t2, n2 ? i : SnapshotVersion.min(), n2 ? s : __PRIVATE_documentKeySet())).next((e3) => (__PRIVATE_setMaxReadTime(r2, __PRIVATE_queryCollectionGroup(t2), e3), {
      documents: e3,
      ks: s
    }))
  );
}
function __PRIVATE_setMaxReadTime(e, t2, n2) {
  let r2 = e.Ms.get(t2) || SnapshotVersion.min();
  n2.forEach((e2, t3) => {
    t3.readTime.compareTo(r2) > 0 && (r2 = t3.readTime);
  }), e.Ms.set(t2, r2);
}
class __PRIVATE_LocalClientState {
  constructor() {
    this.activeTargetIds = __PRIVATE_targetIdSet();
  }
  Qs(e) {
    this.activeTargetIds = this.activeTargetIds.add(e);
  }
  Gs(e) {
    this.activeTargetIds = this.activeTargetIds.delete(e);
  }
  /**
   * Converts this entry into a JSON-encoded format we can use for WebStorage.
   * Does not encode `clientId` as it is part of the key in WebStorage.
   */
  Ws() {
    const e = {
      activeTargetIds: this.activeTargetIds.toArray(),
      updateTimeMs: Date.now()
    };
    return JSON.stringify(e);
  }
}
class __PRIVATE_MemorySharedClientState {
  constructor() {
    this.vo = new __PRIVATE_LocalClientState(), this.Fo = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
  }
  addPendingMutation(e) {
  }
  updateMutationState(e, t2, n2) {
  }
  addLocalQueryTarget(e, t2 = true) {
    return t2 && this.vo.Qs(e), this.Fo[e] || "not-current";
  }
  updateQueryState(e, t2, n2) {
    this.Fo[e] = t2;
  }
  removeLocalQueryTarget(e) {
    this.vo.Gs(e);
  }
  isLocalQueryTarget(e) {
    return this.vo.activeTargetIds.has(e);
  }
  clearQueryState(e) {
    delete this.Fo[e];
  }
  getAllActiveQueryTargets() {
    return this.vo.activeTargetIds;
  }
  isActiveQueryTarget(e) {
    return this.vo.activeTargetIds.has(e);
  }
  start() {
    return this.vo = new __PRIVATE_LocalClientState(), Promise.resolve();
  }
  handleUserChange(e, t2, n2) {
  }
  setOnlineState(e) {
  }
  shutdown() {
  }
  writeSequenceNumber(e) {
  }
  notifyBundleLoaded(e) {
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_NoopConnectivityMonitor {
  Mo(e) {
  }
  shutdown() {
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const $t = "ConnectivityMonitor";
class __PRIVATE_BrowserConnectivityMonitor {
  constructor() {
    this.xo = () => this.Oo(), this.No = () => this.Bo(), this.Lo = [], this.ko();
  }
  Mo(e) {
    this.Lo.push(e);
  }
  shutdown() {
    window.removeEventListener("online", this.xo), window.removeEventListener("offline", this.No);
  }
  ko() {
    window.addEventListener("online", this.xo), window.addEventListener("offline", this.No);
  }
  Oo() {
    __PRIVATE_logDebug($t, "Network connectivity changed: AVAILABLE");
    for (const e of this.Lo) e(
      0
      /* NetworkStatus.AVAILABLE */
    );
  }
  Bo() {
    __PRIVATE_logDebug($t, "Network connectivity changed: UNAVAILABLE");
    for (const e of this.Lo) e(
      1
      /* NetworkStatus.UNAVAILABLE */
    );
  }
  // TODO(chenbrian): Consider passing in window either into this component or
  // here for testing via FakeWindow.
  /** Checks that all used attributes of window are available. */
  static v() {
    return "undefined" != typeof window && void 0 !== window.addEventListener && void 0 !== window.removeEventListener;
  }
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let Wt = null;
function __PRIVATE_generateUniqueDebugId() {
  return null === Wt ? Wt = function __PRIVATE_generateInitialUniqueDebugId() {
    return 268435456 + Math.round(2147483648 * Math.random());
  }() : Wt++, "0x" + Wt.toString(16);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Qt = "RestConnection", Gt = {
  BatchGetDocuments: "batchGet",
  Commit: "commit",
  RunQuery: "runQuery",
  RunAggregationQuery: "runAggregationQuery",
  ExecutePipeline: "executePipeline"
};
class __PRIVATE_RestConnection {
  get Ko() {
    return false;
  }
  constructor(e) {
    this.databaseInfo = e, this.databaseId = e.databaseId;
    const t2 = e.ssl ? "https" : "http", n2 = encodeURIComponent(this.databaseId.projectId), r2 = encodeURIComponent(this.databaseId.database);
    this.qo = t2 + "://" + e.host, this.Uo = `projects/${n2}/databases/${r2}`, this.$o = this.databaseId.database === st ? `project_id=${n2}` : `project_id=${n2}&database_id=${r2}`;
  }
  Wo(e, t2, n2, r2, i) {
    const s = __PRIVATE_generateUniqueDebugId(), o = this.Qo(e, t2.toUriEncodedString());
    __PRIVATE_logDebug(Qt, `Sending RPC '${e}' ${s}:`, o, n2);
    const _ = {
      "google-cloud-resource-prefix": this.Uo,
      "x-goog-request-params": this.$o
    };
    this.Go(_, r2, i);
    const { host: a } = new URL(o), c = isCloudWorkstation(a);
    return this.zo(e, o, _, n2, c).then((t3) => (__PRIVATE_logDebug(Qt, `Received RPC '${e}' ${s}: `, t3), t3), (t3) => {
      throw __PRIVATE_logWarn(Qt, `RPC '${e}' ${s} failed with error: `, t3, "url: ", o, "request:", n2), t3;
    });
  }
  jo(e, t2, n2, r2, i, s) {
    return this.Wo(e, t2, n2, r2, i);
  }
  /**
   * Modifies the headers for a request, adding any authorization token if
   * present and any additional headers for the request.
   */
  Go(e, t2, n2) {
    e["X-Goog-Api-Client"] = // SDK_VERSION is updated to different value at runtime depending on the entry point,
    // so we need to get its value when we need it in a function.
    function __PRIVATE_getGoogApiClientValue() {
      return "gl-js/ fire/" + S;
    }(), // Content-Type: text/plain will avoid preflight requests which might
    // mess with CORS and redirects by proxies. If we add custom headers
    // we will need to change this code to potentially use the $httpOverwrite
    // parameter supported by ESF to avoid triggering preflight requests.
    e["Content-Type"] = "text/plain", this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId), t2 && t2.headers.forEach((t3, n3) => e[n3] = t3), n2 && n2.headers.forEach((t3, n3) => e[n3] = t3);
  }
  Qo(e, t2) {
    const n2 = Gt[e];
    let r2 = `${this.qo}/v1/${t2}:${n2}`;
    return this.databaseInfo.apiKey && (r2 = `${r2}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`), r2;
  }
  /**
   * Closes and cleans up any resources associated with the connection. This
   * implementation is a no-op because there are no resources associated
   * with the RestConnection that need to be cleaned up.
   */
  terminate() {
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_StreamBridge {
  constructor(e) {
    this.Ho = e.Ho, this.Jo = e.Jo;
  }
  Zo(e) {
    this.Xo = e;
  }
  Yo(e) {
    this.e_ = e;
  }
  t_(e) {
    this.n_ = e;
  }
  onMessage(e) {
    this.r_ = e;
  }
  close() {
    this.Jo();
  }
  send(e) {
    this.Ho(e);
  }
  i_() {
    this.Xo();
  }
  s_() {
    this.e_();
  }
  o_(e) {
    this.n_(e);
  }
  __(e) {
    this.r_(e);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const zt = "WebChannelConnection", __PRIVATE_unguardedEventListen = (e, t2, n2) => {
  e.listen(t2, (e2) => {
    try {
      n2(e2);
    } catch (e3) {
      setTimeout(() => {
        throw e3;
      }, 0);
    }
  });
};
class __PRIVATE_WebChannelConnection extends __PRIVATE_RestConnection {
  constructor(e) {
    super(e), /** A collection of open WebChannel instances */
    this.a_ = [], this.forceLongPolling = e.forceLongPolling, this.autoDetectLongPolling = e.autoDetectLongPolling, this.useFetchStreams = e.useFetchStreams, this.longPollingOptions = e.longPollingOptions;
  }
  /**
   * Initialize STAT_EVENT listener once. Subsequent calls are a no-op.
   * getStatEventTarget() returns the same target every time.
   */
  static u_() {
    if (!__PRIVATE_WebChannelConnection.c_) {
      const e = getStatEventTarget();
      __PRIVATE_unguardedEventListen(e, Event.STAT_EVENT, (e2) => {
        e2.stat === Stat.PROXY ? __PRIVATE_logDebug(zt, "STAT_EVENT: detected buffering proxy") : e2.stat === Stat.NOPROXY && __PRIVATE_logDebug(zt, "STAT_EVENT: detected no buffering proxy");
      }), __PRIVATE_WebChannelConnection.c_ = true;
    }
  }
  zo(e, t2, n2, r2, i) {
    const s = __PRIVATE_generateUniqueDebugId();
    return new Promise((i2, o) => {
      const _ = new XhrIo();
      _.setWithCredentials(true), _.listenOnce(EventType.COMPLETE, () => {
        try {
          switch (_.getLastErrorCode()) {
            case ErrorCode.NO_ERROR:
              const t3 = _.getResponseJson();
              __PRIVATE_logDebug(zt, `XHR for RPC '${e}' ${s} received:`, JSON.stringify(t3)), i2(t3);
              break;
            case ErrorCode.TIMEOUT:
              __PRIVATE_logDebug(zt, `RPC '${e}' ${s} timed out`), o(new FirestoreError(C.DEADLINE_EXCEEDED, "Request time out"));
              break;
            case ErrorCode.HTTP_ERROR:
              const n3 = _.getStatus();
              if (__PRIVATE_logDebug(zt, `RPC '${e}' ${s} failed with status:`, n3, "response text:", _.getResponseText()), n3 > 0) {
                let e2 = _.getResponseJson();
                Array.isArray(e2) && (e2 = e2[0]);
                const t4 = e2 == null ? void 0 : e2.error;
                if (t4 && t4.status && t4.message) {
                  const e3 = function __PRIVATE_mapCodeFromHttpResponseErrorStatus(e4) {
                    const t5 = e4.toLowerCase().replace(/_/g, "-");
                    return Object.values(C).indexOf(t5) >= 0 ? t5 : C.UNKNOWN;
                  }(t4.status);
                  o(new FirestoreError(e3, t4.message));
                } else o(new FirestoreError(C.UNKNOWN, "Server responded with status " + _.getStatus()));
              } else
                o(new FirestoreError(C.UNAVAILABLE, "Connection failed."));
              break;
            default:
              fail(9055, {
                l_: e,
                streamId: s,
                h_: _.getLastErrorCode(),
                P_: _.getLastError()
              });
          }
        } finally {
          __PRIVATE_logDebug(zt, `RPC '${e}' ${s} completed.`);
        }
      });
      const a = JSON.stringify(r2);
      __PRIVATE_logDebug(zt, `RPC '${e}' ${s} sending request:`, r2), _.send(t2, "POST", a, n2, 15);
    });
  }
  T_(e, t2, n2) {
    const r2 = __PRIVATE_generateUniqueDebugId(), i = [this.qo, "/", "google.firestore.v1.Firestore", "/", e, "/channel"], s = this.createWebChannelTransport(), o = {
      // Required for backend stickiness, routing behavior is based on this
      // parameter.
      httpSessionIdParam: "gsessionid",
      initMessageHeaders: {},
      messageUrlParams: {
        // This param is used to improve routing and project isolation by the
        // backend and must be included in every request.
        database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
      },
      sendRawJson: true,
      supportsCrossDomainXhr: true,
      internalChannelParams: {
        // Override the default timeout (randomized between 10-20 seconds) since
        // a large write batch on a slow internet connection may take a long
        // time to send to the backend. Rather than have WebChannel impose a
        // tight timeout which could lead to infinite timeouts and retries, we
        // set it very large (5-10 minutes) and rely on the browser's builtin
        // timeouts to kick in if the request isn't working.
        forwardChannelRequestTimeoutMs: 6e5
      },
      forceLongPolling: this.forceLongPolling,
      detectBufferingProxy: this.autoDetectLongPolling
    }, _ = this.longPollingOptions.timeoutSeconds;
    void 0 !== _ && (o.longPollingTimeout = Math.round(1e3 * _)), this.useFetchStreams && (o.useFetchStreams = true), this.Go(o.initMessageHeaders, t2, n2), // Sending the custom headers we just added to request.initMessageHeaders
    // (Authorization, etc.) will trigger the browser to make a CORS preflight
    // request because the XHR will no longer meet the criteria for a "simple"
    // CORS request:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests
    // Therefore to avoid the CORS preflight request (an extra network
    // roundtrip), we use the encodeInitMessageHeaders option to specify that
    // the headers should instead be encoded in the request's POST payload,
    // which is recognized by the webchannel backend.
    o.encodeInitMessageHeaders = true;
    const a = i.join("");
    __PRIVATE_logDebug(zt, `Creating RPC '${e}' stream ${r2}: ${a}`, o);
    const u2 = s.createWebChannel(a, o);
    this.I_(u2);
    let c = false, l2 = false;
    const h = new __PRIVATE_StreamBridge({
      Ho: (t3) => {
        l2 ? __PRIVATE_logDebug(zt, `Not sending because RPC '${e}' stream ${r2} is closed:`, t3) : (c || (__PRIVATE_logDebug(zt, `Opening RPC '${e}' stream ${r2} transport.`), u2.open(), c = true), __PRIVATE_logDebug(zt, `RPC '${e}' stream ${r2} sending:`, t3), u2.send(t3));
      },
      Jo: () => u2.close()
    });
    return __PRIVATE_unguardedEventListen(u2, WebChannel.EventType.OPEN, () => {
      l2 || (__PRIVATE_logDebug(zt, `RPC '${e}' stream ${r2} transport opened.`), h.i_());
    }), __PRIVATE_unguardedEventListen(u2, WebChannel.EventType.CLOSE, () => {
      l2 || (l2 = true, __PRIVATE_logDebug(zt, `RPC '${e}' stream ${r2} transport closed`), h.o_(), this.E_(u2));
    }), __PRIVATE_unguardedEventListen(u2, WebChannel.EventType.ERROR, (t3) => {
      l2 || (l2 = true, __PRIVATE_logWarn(zt, `RPC '${e}' stream ${r2} transport errored. Name:`, t3.name, "Message:", t3.message), h.o_(new FirestoreError(C.UNAVAILABLE, "The operation could not be completed")));
    }), __PRIVATE_unguardedEventListen(u2, WebChannel.EventType.MESSAGE, (t3) => {
      var _a;
      if (!l2) {
        const n3 = t3.data[0];
        __PRIVATE_hardAssert(!!n3, 16349);
        const i2 = n3, s2 = (i2 == null ? void 0 : i2.error) || ((_a = i2[0]) == null ? void 0 : _a.error);
        if (s2) {
          __PRIVATE_logDebug(zt, `RPC '${e}' stream ${r2} received error:`, s2);
          const t4 = s2.status;
          let n4 = (
            /**
            * Maps an error Code from a GRPC status identifier like 'NOT_FOUND'.
            *
            * @returns The Code equivalent to the given status string or undefined if
            *     there is no match.
            */
            function __PRIVATE_mapCodeFromRpcStatus(e2) {
              const t5 = At[e2];
              if (void 0 !== t5) return __PRIVATE_mapCodeFromRpcCode(t5);
            }(t4)
          ), i3 = s2.message;
          void 0 === n4 && (n4 = C.INTERNAL, i3 = "Unknown error status: " + t4 + " with message " + s2.message), // Mark closed so no further events are propagated
          l2 = true, h.o_(new FirestoreError(n4, i3)), u2.close();
        } else __PRIVATE_logDebug(zt, `RPC '${e}' stream ${r2} received:`, n3), h.__(n3);
      }
    }), // Ensure that event listeners are configured for STAT_EVENTs.
    __PRIVATE_WebChannelConnection.u_(), setTimeout(() => {
      h.s_();
    }, 0), h;
  }
  /**
   * Closes and cleans up any resources associated with the connection.
   */
  terminate() {
    this.a_.forEach((e) => e.close()), this.a_ = [];
  }
  /**
   * Add a WebChannel instance to the collection of open instances.
   * @param webChannel
   */
  I_(e) {
    this.a_.push(e);
  }
  /**
   * Remove a WebChannel instance from the collection of open instances.
   * @param webChannel
   */
  E_(e) {
    this.a_ = this.a_.filter((t2) => t2 === e);
  }
  /**
   * Modifies the headers for a request, adding the api key if present,
   * and then calling super.modifyHeadersForRequest
   */
  Go(e, t2, n2) {
    super.Go(e, t2, n2), // For web channel streams, we want to send the api key in the headers.
    this.databaseInfo.apiKey && (e["x-goog-api-key"] = this.databaseInfo.apiKey);
  }
  /**
   * Wrapped for mocking.
   * @protected
   */
  createWebChannelTransport() {
    return createWebChannelTransport();
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function __PRIVATE_newConnection(e) {
  return new __PRIVATE_WebChannelConnection(e);
}
function getDocument() {
  return "undefined" != typeof document ? document : null;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function __PRIVATE_newSerializer(e) {
  return new JsonProtoSerializer(
    e,
    /* useProto3Json= */
    true
  );
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
__PRIVATE_WebChannelConnection.c_ = false;
class __PRIVATE_ExponentialBackoff {
  constructor(e, t2, n2 = 1e3, r2 = 1.5, i = 6e4) {
    this.Ci = e, this.timerId = t2, this.R_ = n2, this.A_ = r2, this.V_ = i, this.d_ = 0, this.m_ = null, /** The last backoff attempt, as epoch milliseconds. */
    this.f_ = Date.now(), this.reset();
  }
  /**
   * Resets the backoff delay.
   *
   * The very next backoffAndWait() will have no delay. If it is called again
   * (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
   * subsequent ones will increase according to the backoffFactor.
   */
  reset() {
    this.d_ = 0;
  }
  /**
   * Resets the backoff delay to the maximum delay (e.g. for use after a
   * RESOURCE_EXHAUSTED error).
   */
  g_() {
    this.d_ = this.V_;
  }
  /**
   * Returns a promise that resolves after currentDelayMs, and increases the
   * delay for any subsequent attempts. If there was a pending backoff operation
   * already, it will be canceled.
   */
  p_(e) {
    this.cancel();
    const t2 = Math.floor(this.d_ + this.y_()), n2 = Math.max(0, Date.now() - this.f_), r2 = Math.max(0, t2 - n2);
    r2 > 0 && __PRIVATE_logDebug("ExponentialBackoff", `Backing off for ${r2} ms (base delay: ${this.d_} ms, delay with jitter: ${t2} ms, last attempt: ${n2} ms ago)`), this.m_ = this.Ci.enqueueAfterDelay(this.timerId, r2, () => (this.f_ = Date.now(), e())), // Apply backoff factor to determine next delay and ensure it is within
    // bounds.
    this.d_ *= this.A_, this.d_ < this.R_ && (this.d_ = this.R_), this.d_ > this.V_ && (this.d_ = this.V_);
  }
  w_() {
    null !== this.m_ && (this.m_.skipDelay(), this.m_ = null);
  }
  cancel() {
    null !== this.m_ && (this.m_.cancel(), this.m_ = null);
  }
  /** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */
  y_() {
    return (Math.random() - 0.5) * this.d_;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const jt = "PersistentStream";
class __PRIVATE_PersistentStream {
  constructor(e, t2, n2, r2, i, s, o, _) {
    this.Ci = e, this.b_ = n2, this.S_ = r2, this.connection = i, this.authCredentialsProvider = s, this.appCheckCredentialsProvider = o, this.listener = _, this.state = 0, /**
     * A close count that's incremented every time the stream is closed; used by
     * getCloseGuardedDispatcher() to invalidate callbacks that happen after
     * close.
     */
    this.D_ = 0, this.C_ = null, this.v_ = null, this.stream = null, /**
     * Count of response messages received.
     */
    this.F_ = 0, this.M_ = new __PRIVATE_ExponentialBackoff(e, t2);
  }
  /**
   * Returns true if start() has been called and no error has occurred. True
   * indicates the stream is open or in the process of opening (which
   * encompasses respecting backoff, getting auth tokens, and starting the
   * actual RPC). Use isOpen() to determine if the stream is open and ready for
   * outbound requests.
   */
  x_() {
    return 1 === this.state || 5 === this.state || this.O_();
  }
  /**
   * Returns true if the underlying RPC is open (the onOpen() listener has been
   * called) and the stream is ready for outbound requests.
   */
  O_() {
    return 2 === this.state || 3 === this.state;
  }
  /**
   * Starts the RPC. Only allowed if isStarted() returns false. The stream is
   * not immediately ready for use: onOpen() will be invoked when the RPC is
   * ready for outbound requests, at which point isOpen() will return true.
   *
   * When start returns, isStarted() will return true.
   */
  start() {
    this.F_ = 0, 4 !== this.state ? this.auth() : this.N_();
  }
  /**
   * Stops the RPC. This call is idempotent and allowed regardless of the
   * current isStarted() state.
   *
   * When stop returns, isStarted() and isOpen() will both return false.
   */
  async stop() {
    this.x_() && await this.close(
      0
      /* PersistentStreamState.Initial */
    );
  }
  /**
   * After an error the stream will usually back off on the next attempt to
   * start it. If the error warrants an immediate restart of the stream, the
   * sender can use this to indicate that the receiver should not back off.
   *
   * Each error will call the onClose() listener. That function can decide to
   * inhibit backoff if required.
   */
  B_() {
    this.state = 0, this.M_.reset();
  }
  /**
   * Marks this stream as idle. If no further actions are performed on the
   * stream for one minute, the stream will automatically close itself and
   * notify the stream's onClose() handler with Status.OK. The stream will then
   * be in a !isStarted() state, requiring the caller to start the stream again
   * before further use.
   *
   * Only streams that are in state 'Open' can be marked idle, as all other
   * states imply pending network operations.
   */
  L_() {
    this.O_() && null === this.C_ && (this.C_ = this.Ci.enqueueAfterDelay(this.b_, 6e4, () => this.k_()));
  }
  /** Sends a message to the underlying stream. */
  K_(e) {
    this.q_(), this.stream.send(e);
  }
  /** Called by the idle timer when the stream should close due to inactivity. */
  async k_() {
    if (this.O_())
      return this.close(
        0
        /* PersistentStreamState.Initial */
      );
  }
  /** Marks the stream as active again. */
  q_() {
    this.C_ && (this.C_.cancel(), this.C_ = null);
  }
  /** Cancels the health check delayed operation. */
  U_() {
    this.v_ && (this.v_.cancel(), this.v_ = null);
  }
  /**
   * Closes the stream and cleans up as necessary:
   *
   * * closes the underlying GRPC stream;
   * * calls the onClose handler with the given 'error';
   * * sets internal stream state to 'finalState';
   * * adjusts the backoff timer based on the error
   *
   * A new stream can be opened by calling start().
   *
   * @param finalState - the intended state of the stream after closing.
   * @param error - the error the connection was closed with.
   */
  async close(e, t2) {
    this.q_(), this.U_(), this.M_.cancel(), // Invalidates any stream-related callbacks (e.g. from auth or the
    // underlying stream), guaranteeing they won't execute.
    this.D_++, 4 !== e ? (
      // If this is an intentional close ensure we don't delay our next connection attempt.
      this.M_.reset()
    ) : t2 && t2.code === C.RESOURCE_EXHAUSTED ? (
      // Log the error. (Probably either 'quota exceeded' or 'max queue length reached'.)
      (__PRIVATE_logError(t2.toString()), __PRIVATE_logError("Using maximum backoff delay to prevent overloading the backend."), this.M_.g_())
    ) : t2 && t2.code === C.UNAUTHENTICATED && 3 !== this.state && // "unauthenticated" error means the token was rejected. This should rarely
    // happen since both Auth and AppCheck ensure a sufficient TTL when we
    // request a token. If a user manually resets their system clock this can
    // fail, however. In this case, we should get a Code.UNAUTHENTICATED error
    // before we received the first message and we need to invalidate the token
    // to ensure that we fetch a new token.
    (this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), // Clean up the underlying stream because we are no longer interested in events.
    null !== this.stream && (this.W_(), this.stream.close(), this.stream = null), // This state must be assigned before calling onClose() to allow the callback to
    // inhibit backoff or otherwise manipulate the state in its non-started state.
    this.state = e, // Notify the listener that the stream closed.
    await this.listener.t_(t2);
  }
  /**
   * Can be overridden to perform additional cleanup before the stream is closed.
   * Calling super.tearDown() is not required.
   */
  W_() {
  }
  auth() {
    this.state = 1;
    const e = this.Q_(this.D_), t2 = this.D_;
    Promise.all([this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken()]).then(([e2, n2]) => {
      this.D_ === t2 && // Normally we'd have to schedule the callback on the AsyncQueue.
      // However, the following calls are safe to be called outside the
      // AsyncQueue since they don't chain asynchronous calls
      this.G_(e2, n2);
    }, (t3) => {
      e(() => {
        const e2 = new FirestoreError(C.UNKNOWN, "Fetching auth token failed: " + t3.message);
        return this.z_(e2);
      });
    });
  }
  G_(e, t2) {
    const n2 = this.Q_(this.D_);
    this.stream = this.j_(e, t2), this.stream.Zo(() => {
      n2(() => this.listener.Zo());
    }), this.stream.Yo(() => {
      n2(() => (this.state = 2, this.v_ = this.Ci.enqueueAfterDelay(this.S_, 1e4, () => (this.O_() && (this.state = 3), Promise.resolve())), this.listener.Yo()));
    }), this.stream.t_((e2) => {
      n2(() => this.z_(e2));
    }), this.stream.onMessage((e2) => {
      n2(() => 1 == ++this.F_ ? this.H_(e2) : this.onNext(e2));
    });
  }
  N_() {
    this.state = 5, this.M_.p_(async () => {
      this.state = 0, this.start();
    });
  }
  // Visible for tests
  z_(e) {
    return __PRIVATE_logDebug(jt, `close with error: ${e}`), this.stream = null, this.close(4, e);
  }
  /**
   * Returns a "dispatcher" function that dispatches operations onto the
   * AsyncQueue but only runs them if closeCount remains unchanged. This allows
   * us to turn auth / stream callbacks into no-ops if the stream is closed /
   * re-opened, etc.
   */
  Q_(e) {
    return (t2) => {
      this.Ci.enqueueAndForget(() => this.D_ === e ? t2() : (__PRIVATE_logDebug(jt, "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
    };
  }
}
class __PRIVATE_PersistentListenStream extends __PRIVATE_PersistentStream {
  constructor(e, t2, n2, r2, i, s) {
    super(e, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", t2, n2, r2, s), this.serializer = i;
  }
  j_(e, t2) {
    return this.connection.T_("Listen", e, t2);
  }
  H_(e) {
    return this.onNext(e);
  }
  onNext(e) {
    this.M_.reset();
    const t2 = __PRIVATE_fromWatchChange(this.serializer, e), n2 = function __PRIVATE_versionFromListenResponse(e2) {
      if (!("targetChange" in e2)) return SnapshotVersion.min();
      const t3 = e2.targetChange;
      return t3.targetIds && t3.targetIds.length ? SnapshotVersion.min() : t3.readTime ? __PRIVATE_fromVersion(t3.readTime) : SnapshotVersion.min();
    }(e);
    return this.listener.J_(t2, n2);
  }
  /**
   * Registers interest in the results of the given target. If the target
   * includes a resumeToken it will be included in the request. Results that
   * affect the target will be streamed back as WatchChange messages that
   * reference the targetId.
   */
  Z_(e) {
    const t2 = {};
    t2.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t2.addTarget = function __PRIVATE_toTarget(e2, t3) {
      let n3;
      const r2 = t3.target;
      if (n3 = __PRIVATE_targetIsDocumentTarget(r2) ? {
        documents: __PRIVATE_toDocumentsTarget(e2, r2)
      } : {
        query: __PRIVATE_toQueryTarget(e2, r2).ft
      }, n3.targetId = t3.targetId, t3.resumeToken.approximateByteSize() > 0) {
        n3.resumeToken = __PRIVATE_toBytes(e2, t3.resumeToken);
        const r3 = __PRIVATE_toInt32Proto(e2, t3.expectedCount);
        null !== r3 && (n3.expectedCount = r3);
      } else if (t3.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
        n3.readTime = toTimestamp(e2, t3.snapshotVersion.toTimestamp());
        const r3 = __PRIVATE_toInt32Proto(e2, t3.expectedCount);
        null !== r3 && (n3.expectedCount = r3);
      }
      return n3;
    }(this.serializer, e);
    const n2 = __PRIVATE_toListenRequestLabels(this.serializer, e);
    n2 && (t2.labels = n2), this.K_(t2);
  }
  /**
   * Unregisters interest in the results of the target associated with the
   * given targetId.
   */
  X_(e) {
    const t2 = {};
    t2.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t2.removeTarget = e, this.K_(t2);
  }
}
class __PRIVATE_PersistentWriteStream extends __PRIVATE_PersistentStream {
  constructor(e, t2, n2, r2, i, s) {
    super(e, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", t2, n2, r2, s), this.serializer = i;
  }
  /**
   * Tracks whether or not a handshake has been successfully exchanged and
   * the stream is ready to accept mutations.
   */
  get Y_() {
    return this.F_ > 0;
  }
  // Override of PersistentStream.start
  start() {
    this.lastStreamToken = void 0, super.start();
  }
  W_() {
    this.Y_ && this.ea([]);
  }
  j_(e, t2) {
    return this.connection.T_("Write", e, t2);
  }
  H_(e) {
    return __PRIVATE_hardAssert(!!e.streamToken, 31322), this.lastStreamToken = e.streamToken, // The first response is always the handshake response
    __PRIVATE_hardAssert(!e.writeResults || 0 === e.writeResults.length, 55816), this.listener.ta();
  }
  onNext(e) {
    __PRIVATE_hardAssert(!!e.streamToken, 12678), this.lastStreamToken = e.streamToken, // A successful first write response means the stream is healthy,
    // Note, that we could consider a successful handshake healthy, however,
    // the write itself might be causing an error we want to back off from.
    this.M_.reset();
    const t2 = __PRIVATE_fromWriteResults(e.writeResults, e.commitTime), n2 = __PRIVATE_fromVersion(e.commitTime);
    return this.listener.na(n2, t2);
  }
  /**
   * Sends an initial streamToken to the server, performing the handshake
   * required to make the StreamingWrite RPC work. Subsequent
   * calls should wait until onHandshakeComplete was called.
   */
  ra() {
    const e = {};
    e.database = __PRIVATE_getEncodedDatabaseId(this.serializer), this.K_(e);
  }
  /** Sends a group of mutations to the Firestore backend to apply. */
  ea(e) {
    const t2 = {
      streamToken: this.lastStreamToken,
      writes: e.map((e2) => toMutation(this.serializer, e2))
    };
    this.K_(t2);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Datastore {
}
class __PRIVATE_DatastoreImpl extends Datastore {
  constructor(e, t2, n2, r2) {
    super(), this.authCredentials = e, this.appCheckCredentials = t2, this.connection = n2, this.serializer = r2, this.ia = false;
  }
  sa() {
    if (this.ia) throw new FirestoreError(C.FAILED_PRECONDITION, "The client has already been terminated.");
  }
  /** Invokes the provided RPC with auth and AppCheck tokens. */
  Wo(e, t2, n2, r2) {
    return this.sa(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([i, s]) => this.connection.Wo(e, __PRIVATE_toResourcePath(t2, n2), r2, i, s)).catch((e2) => {
      throw "FirebaseError" === e2.name ? (e2.code === C.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new FirestoreError(C.UNKNOWN, e2.toString());
    });
  }
  /** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */
  jo(e, t2, n2, r2, i) {
    return this.sa(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([s, o]) => this.connection.jo(e, __PRIVATE_toResourcePath(t2, n2), r2, s, o, i)).catch((e2) => {
      throw "FirebaseError" === e2.name ? (e2.code === C.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new FirestoreError(C.UNKNOWN, e2.toString());
    });
  }
  terminate() {
    this.ia = true, this.connection.terminate();
  }
}
function __PRIVATE_newDatastore(e, t2, n2, r2) {
  return new __PRIVATE_DatastoreImpl(e, t2, n2, r2);
}
class __PRIVATE_OnlineStateTracker {
  constructor(e, t2) {
    this.asyncQueue = e, this.onlineStateHandler = t2, /** The current OnlineState. */
    this.state = "Unknown", /**
     * A count of consecutive failures to open the stream. If it reaches the
     * maximum defined by MAX_WATCH_STREAM_FAILURES, we'll set the OnlineState to
     * Offline.
     */
    this.oa = 0, /**
     * A timer that elapses after ONLINE_STATE_TIMEOUT_MS, at which point we
     * transition from OnlineState.Unknown to OnlineState.Offline without waiting
     * for the stream to actually fail (MAX_WATCH_STREAM_FAILURES times).
     */
    this._a = null, /**
     * Whether the client should log a warning message if it fails to connect to
     * the backend (initially true, cleared after a successful stream, or if we've
     * logged the message already).
     */
    this.aa = true;
  }
  /**
   * Called by RemoteStore when a watch stream is started (including on each
   * backoff attempt).
   *
   * If this is the first attempt, it sets the OnlineState to Unknown and starts
   * the onlineStateTimer.
   */
  ua() {
    0 === this.oa && (this.ca(
      "Unknown"
      /* OnlineState.Unknown */
    ), this._a = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, () => (this._a = null, this.la("Backend didn't respond within 10 seconds."), this.ca(
      "Offline"
      /* OnlineState.Offline */
    ), Promise.resolve())));
  }
  /**
   * Updates our OnlineState as appropriate after the watch stream reports a
   * failure. The first failure moves us to the 'Unknown' state. We then may
   * allow multiple failures (based on MAX_WATCH_STREAM_FAILURES) before we
   * actually transition to the 'Offline' state.
   */
  ha(e) {
    "Online" === this.state ? this.ca(
      "Unknown"
      /* OnlineState.Unknown */
    ) : (this.oa++, this.oa >= 1 && (this.Pa(), this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`), this.ca(
      "Offline"
      /* OnlineState.Offline */
    )));
  }
  /**
   * Explicitly sets the OnlineState to the specified state.
   *
   * Note that this resets our timers / failure counters, etc. used by our
   * Offline heuristics, so must not be used in place of
   * handleWatchStreamStart() and handleWatchStreamFailure().
   */
  set(e) {
    this.Pa(), this.oa = 0, "Online" === e && // We've connected to watch at least once. Don't warn the developer
    // about being offline going forward.
    (this.aa = false), this.ca(e);
  }
  ca(e) {
    e !== this.state && (this.state = e, this.onlineStateHandler(e));
  }
  la(e) {
    const t2 = `Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
    this.aa ? (__PRIVATE_logError(t2), this.aa = false) : __PRIVATE_logDebug("OnlineStateTracker", t2);
  }
  Pa() {
    null !== this._a && (this._a.cancel(), this._a = null);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ht$1 = "RemoteStore";
class __PRIVATE_RemoteStoreImpl {
  constructor(e, t2, n2, r2, i) {
    this.localStore = e, this.datastore = t2, this.asyncQueue = n2, this.remoteSyncer = {}, /**
     * A list of up to MAX_PENDING_WRITES writes that we have fetched from the
     * LocalStore via fillWritePipeline() and have or will send to the write
     * stream.
     *
     * Whenever writePipeline.length > 0 the RemoteStore will attempt to start or
     * restart the write stream. When the stream is established the writes in the
     * pipeline will be sent in order.
     *
     * Writes remain in writePipeline until they are acknowledged by the backend
     * and thus will automatically be re-sent if the stream is interrupted /
     * restarted before they're acknowledged.
     *
     * Write responses from the backend are linked to their originating request
     * purely based on order, and so we can just shift() writes from the front of
     * the writePipeline as we receive responses.
     */
    this.Ta = [], /**
     * A mapping of watched targets that the client cares about tracking and the
     * user has explicitly called a 'listen' for this target.
     *
     * These targets may or may not have been sent to or acknowledged by the
     * server. On re-establishing the listen stream, these targets should be sent
     * to the server. The targets removed with unlistens are removed eagerly
     * without waiting for confirmation from the listen stream.
     */
    this.Ia = /* @__PURE__ */ new Map(), /**
     * A set of reasons for why the RemoteStore may be offline. If empty, the
     * RemoteStore may start its network connections.
     */
    this.Ea = /* @__PURE__ */ new Set(), /**
     * Event handlers that get called when the network is disabled or enabled.
     *
     * PORTING NOTE: These functions are used on the Web client to create the
     * underlying streams (to support tree-shakeable streams). On Android and iOS,
     * the streams are created during construction of RemoteStore.
     */
    this.Ra = [], this.Aa = i, this.Aa.Mo((e2) => {
      n2.enqueueAndForget(async () => {
        __PRIVATE_canUseNetwork(this) && (__PRIVATE_logDebug(Ht$1, "Restarting streams for network reachability change."), await async function __PRIVATE_restartNetwork(e3) {
          const t3 = __PRIVATE_debugCast(e3);
          t3.Ea.add(
            4
            /* OfflineCause.ConnectivityChange */
          ), await __PRIVATE_disableNetworkInternal(t3), t3.Va.set(
            "Unknown"
            /* OnlineState.Unknown */
          ), t3.Ea.delete(
            4
            /* OfflineCause.ConnectivityChange */
          ), await __PRIVATE_enableNetworkInternal(t3);
        }(this));
      });
    }), this.Va = new __PRIVATE_OnlineStateTracker(n2, r2);
  }
}
async function __PRIVATE_enableNetworkInternal(e) {
  if (__PRIVATE_canUseNetwork(e)) for (const t2 of e.Ra) await t2(
    /* enabled= */
    true
  );
}
async function __PRIVATE_disableNetworkInternal(e) {
  for (const t2 of e.Ra) await t2(
    /* enabled= */
    false
  );
}
function __PRIVATE_remoteStoreListen(e, t2) {
  const n2 = __PRIVATE_debugCast(e);
  n2.Ia.has(t2.targetId) || // Mark this as something the client is currently listening for.
  (n2.Ia.set(t2.targetId, t2), __PRIVATE_shouldStartWatchStream(n2) ? (
    // The listen will be sent in onWatchStreamOpen
    __PRIVATE_startWatchStream(n2)
  ) : __PRIVATE_ensureWatchStream(n2).O_() && __PRIVATE_sendWatchRequest(n2, t2));
}
function __PRIVATE_remoteStoreUnlisten(e, t2) {
  const n2 = __PRIVATE_debugCast(e), r2 = __PRIVATE_ensureWatchStream(n2);
  n2.Ia.delete(t2), r2.O_() && __PRIVATE_sendUnwatchRequest(n2, t2), 0 === n2.Ia.size && (r2.O_() ? r2.L_() : __PRIVATE_canUseNetwork(n2) && // Revert to OnlineState.Unknown if the watch stream is not open and we
  // have no listeners, since without any listens to send we cannot
  // confirm if the stream is healthy and upgrade to OnlineState.Online.
  n2.Va.set(
    "Unknown"
    /* OnlineState.Unknown */
  ));
}
function __PRIVATE_sendWatchRequest(e, t2) {
  if (e.da.$e(t2.targetId), t2.resumeToken.approximateByteSize() > 0 || t2.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
    const n2 = e.remoteSyncer.getRemoteKeysForTarget(t2.targetId).size;
    t2 = t2.withExpectedCount(n2);
  }
  __PRIVATE_ensureWatchStream(e).Z_(t2);
}
function __PRIVATE_sendUnwatchRequest(e, t2) {
  e.da.$e(t2), __PRIVATE_ensureWatchStream(e).X_(t2);
}
function __PRIVATE_startWatchStream(e) {
  e.da = new __PRIVATE_WatchChangeAggregator({
    getRemoteKeysForTarget: (t2) => e.remoteSyncer.getRemoteKeysForTarget(t2),
    At: (t2) => e.Ia.get(t2) || null,
    ht: () => e.datastore.serializer.databaseId
  }), __PRIVATE_ensureWatchStream(e).start(), e.Va.ua();
}
function __PRIVATE_shouldStartWatchStream(e) {
  return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWatchStream(e).x_() && e.Ia.size > 0;
}
function __PRIVATE_canUseNetwork(e) {
  return 0 === __PRIVATE_debugCast(e).Ea.size;
}
function __PRIVATE_cleanUpWatchStreamState(e) {
  e.da = void 0;
}
async function __PRIVATE_onWatchStreamConnected(e) {
  e.Va.set(
    "Online"
    /* OnlineState.Online */
  );
}
async function __PRIVATE_onWatchStreamOpen(e) {
  e.Ia.forEach((t2, n2) => {
    __PRIVATE_sendWatchRequest(e, t2);
  });
}
async function __PRIVATE_onWatchStreamClose(e, t2) {
  __PRIVATE_cleanUpWatchStreamState(e), // If we still need the watch stream, retry the connection.
  __PRIVATE_shouldStartWatchStream(e) ? (e.Va.ha(t2), __PRIVATE_startWatchStream(e)) : (
    // No need to restart watch stream because there are no active targets.
    // The online state is set to unknown because there is no active attempt
    // at establishing a connection
    e.Va.set(
      "Unknown"
      /* OnlineState.Unknown */
    )
  );
}
async function __PRIVATE_onWatchStreamChange(e, t2, n2) {
  if (
    // Mark the client as online since we got a message from the server
    e.Va.set(
      "Online"
      /* OnlineState.Online */
    ), t2 instanceof __PRIVATE_WatchTargetChange && 2 === t2.state && t2.cause
  )
    try {
      await async function __PRIVATE_handleTargetError(e2, t3) {
        const n3 = t3.cause;
        for (const r2 of t3.targetIds)
          e2.Ia.has(r2) && (await e2.remoteSyncer.rejectListen(r2, n3), e2.Ia.delete(r2), e2.da.removeTarget(r2));
      }(e, t2);
    } catch (n3) {
      __PRIVATE_logDebug(Ht$1, "Failed to remove targets %s: %s ", t2.targetIds.join(","), n3), await __PRIVATE_disableNetworkUntilRecovery(e, n3);
    }
  else if (t2 instanceof __PRIVATE_DocumentWatchChange ? e.da.Xe(t2) : t2 instanceof __PRIVATE_ExistenceFilterChange ? e.da.st(t2) : e.da.tt(t2), !n2.isEqual(SnapshotVersion.min())) try {
    const t3 = await __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore);
    n2.compareTo(t3) >= 0 && // We have received a target change with a global snapshot if the snapshot
    // version is not equal to SnapshotVersion.min().
    /**
    * Takes a batch of changes from the Datastore, repackages them as a
    * RemoteEvent, and passes that on to the listener, which is typically the
    * SyncEngine.
    */
    await function __PRIVATE_raiseWatchSnapshot(e2, t4) {
      const n3 = e2.da.Tt(t4);
      return n3.targetChanges.forEach((n4, r2) => {
        if (n4.resumeToken.approximateByteSize() > 0) {
          const i = e2.Ia.get(r2);
          i && e2.Ia.set(r2, i.withResumeToken(n4.resumeToken, t4));
        }
      }), // Re-establish listens for the targets that have been invalidated by
      // existence filter mismatches.
      n3.targetMismatches.forEach((t5, n4) => {
        const r2 = e2.Ia.get(t5);
        if (!r2)
          return;
        e2.Ia.set(t5, r2.withResumeToken(ByteString.EMPTY_BYTE_STRING, r2.snapshotVersion)), // Cause a hard reset by unwatching and rewatching immediately, but
        // deliberately don't send a resume token so that we get a full update.
        __PRIVATE_sendUnwatchRequest(e2, t5);
        const i = new TargetData(r2.target, t5, n4, r2.sequenceNumber);
        __PRIVATE_sendWatchRequest(e2, i);
      }), e2.remoteSyncer.applyRemoteEvent(n3);
    }(e, n2);
  } catch (t3) {
    __PRIVATE_logDebug(Ht$1, "Failed to raise snapshot:", t3), await __PRIVATE_disableNetworkUntilRecovery(e, t3);
  }
}
async function __PRIVATE_disableNetworkUntilRecovery(e, t2, n2) {
  if (!__PRIVATE_isIndexedDbTransactionError(t2)) throw t2;
  e.Ea.add(
    1
    /* OfflineCause.IndexedDbFailed */
  ), // Disable network and raise offline snapshots
  await __PRIVATE_disableNetworkInternal(e), e.Va.set(
    "Offline"
    /* OnlineState.Offline */
  ), n2 || // Use a simple read operation to determine if IndexedDB recovered.
  // Ideally, we would expose a health check directly on SimpleDb, but
  // RemoteStore only has access to persistence through LocalStore.
  (n2 = () => __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore)), // Probe IndexedDB periodically and re-enable network
  e.asyncQueue.enqueueRetryable(async () => {
    __PRIVATE_logDebug(Ht$1, "Retrying IndexedDB access"), await n2(), e.Ea.delete(
      1
      /* OfflineCause.IndexedDbFailed */
    ), await __PRIVATE_enableNetworkInternal(e);
  });
}
function __PRIVATE_executeWithRecovery(e, t2) {
  return t2().catch((n2) => __PRIVATE_disableNetworkUntilRecovery(e, n2, t2));
}
async function __PRIVATE_fillWritePipeline(e) {
  const t2 = __PRIVATE_debugCast(e), n2 = __PRIVATE_ensureWriteStream(t2);
  let r2 = t2.Ta.length > 0 ? t2.Ta[t2.Ta.length - 1].batchId : U;
  for (; __PRIVATE_canAddToWritePipeline(t2); ) try {
    const e2 = await __PRIVATE_localStoreGetNextMutationBatch(t2.localStore, r2);
    if (null === e2) {
      0 === t2.Ta.length && n2.L_();
      break;
    }
    r2 = e2.batchId, __PRIVATE_addToWritePipeline(t2, e2);
  } catch (e2) {
    await __PRIVATE_disableNetworkUntilRecovery(t2, e2);
  }
  __PRIVATE_shouldStartWriteStream(t2) && __PRIVATE_startWriteStream(t2);
}
function __PRIVATE_canAddToWritePipeline(e) {
  return __PRIVATE_canUseNetwork(e) && e.Ta.length < 10;
}
function __PRIVATE_addToWritePipeline(e, t2) {
  e.Ta.push(t2);
  const n2 = __PRIVATE_ensureWriteStream(e);
  n2.O_() && n2.Y_ && n2.ea(t2.mutations);
}
function __PRIVATE_shouldStartWriteStream(e) {
  return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWriteStream(e).x_() && e.Ta.length > 0;
}
function __PRIVATE_startWriteStream(e) {
  __PRIVATE_ensureWriteStream(e).start();
}
async function __PRIVATE_onWriteStreamOpen(e) {
  __PRIVATE_ensureWriteStream(e).ra();
}
async function __PRIVATE_onWriteHandshakeComplete(e) {
  const t2 = __PRIVATE_ensureWriteStream(e);
  for (const n2 of e.Ta) t2.ea(n2.mutations);
}
async function __PRIVATE_onMutationResult(e, t2, n2) {
  const r2 = e.Ta.shift(), i = MutationBatchResult.from(r2, t2, n2);
  await __PRIVATE_executeWithRecovery(e, () => e.remoteSyncer.applySuccessfulWrite(i)), // It's possible that with the completion of this mutation another
  // slot has freed up.
  await __PRIVATE_fillWritePipeline(e);
}
async function __PRIVATE_onWriteStreamClose(e, t2) {
  t2 && __PRIVATE_ensureWriteStream(e).Y_ && // This error affects the actual write.
  await async function __PRIVATE_handleWriteError(e2, t3) {
    if (function __PRIVATE_isPermanentWriteError(e3) {
      return __PRIVATE_isPermanentError(e3) && e3 !== C.ABORTED;
    }(t3.code)) {
      const n2 = e2.Ta.shift();
      __PRIVATE_ensureWriteStream(e2).B_(), await __PRIVATE_executeWithRecovery(e2, () => e2.remoteSyncer.rejectFailedWrite(n2.batchId, t3)), // It's possible that with the completion of this mutation
      // another slot has freed up.
      await __PRIVATE_fillWritePipeline(e2);
    }
  }(e, t2), // The write stream might have been started by refilling the write
  // pipeline for failed writes
  __PRIVATE_shouldStartWriteStream(e) && __PRIVATE_startWriteStream(e);
}
async function __PRIVATE_remoteStoreHandleCredentialChange(e, t2) {
  const n2 = __PRIVATE_debugCast(e);
  n2.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug(Ht$1, "RemoteStore received new credentials");
  const r2 = __PRIVATE_canUseNetwork(n2);
  n2.Ea.add(
    3
    /* OfflineCause.CredentialChange */
  ), await __PRIVATE_disableNetworkInternal(n2), r2 && // Don't set the network status to Unknown if we are offline.
  n2.Va.set(
    "Unknown"
    /* OnlineState.Unknown */
  ), await n2.remoteSyncer.handleCredentialChange(t2), n2.Ea.delete(
    3
    /* OfflineCause.CredentialChange */
  ), await __PRIVATE_enableNetworkInternal(n2);
}
async function __PRIVATE_remoteStoreApplyPrimaryState(e, t2) {
  const n2 = __PRIVATE_debugCast(e);
  t2 ? (n2.Ea.delete(
    2
    /* OfflineCause.IsSecondary */
  ), await __PRIVATE_enableNetworkInternal(n2)) : t2 || (n2.Ea.add(
    2
    /* OfflineCause.IsSecondary */
  ), await __PRIVATE_disableNetworkInternal(n2), n2.Va.set(
    "Unknown"
    /* OnlineState.Unknown */
  ));
}
function __PRIVATE_ensureWatchStream(e) {
  return e.ma || // Create stream (but note that it is not started yet).
  (e.ma = function __PRIVATE_newPersistentWatchStream(e2, t2, n2) {
    const r2 = __PRIVATE_debugCast(e2);
    return r2.sa(), new __PRIVATE_PersistentListenStream(t2, r2.connection, r2.authCredentials, r2.appCheckCredentials, r2.serializer, n2);
  }(e.datastore, e.asyncQueue, {
    Zo: __PRIVATE_onWatchStreamConnected.bind(null, e),
    Yo: __PRIVATE_onWatchStreamOpen.bind(null, e),
    t_: __PRIVATE_onWatchStreamClose.bind(null, e),
    J_: __PRIVATE_onWatchStreamChange.bind(null, e)
  }), e.Ra.push(async (t2) => {
    t2 ? (e.ma.B_(), __PRIVATE_shouldStartWatchStream(e) ? __PRIVATE_startWatchStream(e) : e.Va.set(
      "Unknown"
      /* OnlineState.Unknown */
    )) : (await e.ma.stop(), __PRIVATE_cleanUpWatchStreamState(e));
  })), e.ma;
}
function __PRIVATE_ensureWriteStream(e) {
  return e.fa || // Create stream (but note that it is not started yet).
  (e.fa = function __PRIVATE_newPersistentWriteStream(e2, t2, n2) {
    const r2 = __PRIVATE_debugCast(e2);
    return r2.sa(), new __PRIVATE_PersistentWriteStream(t2, r2.connection, r2.authCredentials, r2.appCheckCredentials, r2.serializer, n2);
  }(e.datastore, e.asyncQueue, {
    Zo: () => Promise.resolve(),
    Yo: __PRIVATE_onWriteStreamOpen.bind(null, e),
    t_: __PRIVATE_onWriteStreamClose.bind(null, e),
    ta: __PRIVATE_onWriteHandshakeComplete.bind(null, e),
    na: __PRIVATE_onMutationResult.bind(null, e)
  }), e.Ra.push(async (t2) => {
    t2 ? (e.fa.B_(), // This will start the write stream if necessary.
    await __PRIVATE_fillWritePipeline(e)) : (await e.fa.stop(), e.Ta.length > 0 && (__PRIVATE_logDebug(Ht$1, `Stopping write stream with ${e.Ta.length} pending writes`), e.Ta = []));
  })), e.fa;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class DelayedOperation {
  constructor(e, t2, n2, r2, i) {
    this.asyncQueue = e, this.timerId = t2, this.targetTimeMs = n2, this.op = r2, this.removalCallback = i, this.deferred = new __PRIVATE_Deferred(), this.then = this.deferred.promise.then.bind(this.deferred.promise), // It's normal for the deferred promise to be canceled (due to cancellation)
    // and so we attach a dummy catch callback to avoid
    // 'UnhandledPromiseRejectionWarning' log spam.
    this.deferred.promise.catch((e2) => {
    });
  }
  get promise() {
    return this.deferred.promise;
  }
  /**
   * Creates and returns a DelayedOperation that has been scheduled to be
   * executed on the provided asyncQueue after the provided delayMs.
   *
   * @param asyncQueue - The queue to schedule the operation on.
   * @param id - A Timer ID identifying the type of operation this is.
   * @param delayMs - The delay (ms) before the operation should be scheduled.
   * @param op - The operation to run.
   * @param removalCallback - A callback to be called synchronously once the
   *   operation is executed or canceled, notifying the AsyncQueue to remove it
   *   from its delayedOperations list.
   *   PORTING NOTE: This exists to prevent making removeDelayedOperation() and
   *   the DelayedOperation class public.
   */
  static createAndSchedule(e, t2, n2, r2, i) {
    const s = Date.now() + n2, o = new DelayedOperation(e, t2, s, r2, i);
    return o.start(n2), o;
  }
  /**
   * Starts the timer. This is called immediately after construction by
   * createAndSchedule().
   */
  start(e) {
    this.timerHandle = setTimeout(() => this.handleDelayElapsed(), e);
  }
  /**
   * Queues the operation to run immediately (if it hasn't already been run or
   * canceled).
   */
  skipDelay() {
    return this.handleDelayElapsed();
  }
  /**
   * Cancels the operation if it hasn't already been executed or canceled. The
   * promise will be rejected.
   *
   * As long as the operation has not yet been run, calling cancel() provides a
   * guarantee that the operation will not be run.
   */
  cancel(e) {
    null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new FirestoreError(C.CANCELLED, "Operation cancelled" + (e ? ": " + e : ""))));
  }
  handleDelayElapsed() {
    this.asyncQueue.enqueueAndForget(() => null !== this.timerHandle ? (this.clearTimeout(), this.op().then((e) => this.deferred.resolve(e))) : Promise.resolve());
  }
  clearTimeout() {
    null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
  }
}
function __PRIVATE_wrapInUserErrorIfRecoverable(e, t2) {
  if (__PRIVATE_logError("AsyncQueue", `${t2}: ${e}`), __PRIVATE_isIndexedDbTransactionError(e)) return new FirestoreError(C.UNAVAILABLE, `${t2}: ${e}`);
  throw e;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class DocumentSet {
  /**
   * Returns an empty copy of the existing DocumentSet, using the same
   * comparator.
   */
  static emptySet(e) {
    return new DocumentSet(e.comparator);
  }
  /** The default ordering is by key if the comparator is omitted */
  constructor(e) {
    this.comparator = e ? (t2, n2) => e(t2, n2) || DocumentKey.comparator(t2.key, n2.key) : (e2, t2) => DocumentKey.comparator(e2.key, t2.key), this.keyedMap = documentMap(), this.sortedSet = new SortedMap(this.comparator);
  }
  has(e) {
    return null != this.keyedMap.get(e);
  }
  get(e) {
    return this.keyedMap.get(e);
  }
  first() {
    return this.sortedSet.minKey();
  }
  last() {
    return this.sortedSet.maxKey();
  }
  isEmpty() {
    return this.sortedSet.isEmpty();
  }
  /**
   * Returns the index of the provided key in the document set, or -1 if the
   * document key is not present in the set;
   */
  indexOf(e) {
    const t2 = this.keyedMap.get(e);
    return t2 ? this.sortedSet.indexOf(t2) : -1;
  }
  get size() {
    return this.sortedSet.size;
  }
  /** Iterates documents in order defined by "comparator" */
  forEach(e) {
    this.sortedSet.inorderTraversal((t2, n2) => (e(t2), false));
  }
  /** Inserts or updates a document with the same key */
  add(e) {
    const t2 = this.delete(e.key);
    return t2.copy(t2.keyedMap.insert(e.key, e), t2.sortedSet.insert(e, null));
  }
  /** Deletes a document with a given key */
  delete(e) {
    const t2 = this.get(e);
    return t2 ? this.copy(this.keyedMap.remove(e), this.sortedSet.remove(t2)) : this;
  }
  isEqual(e) {
    if (!(e instanceof DocumentSet)) return false;
    if (this.size !== e.size) return false;
    const t2 = this.sortedSet.getIterator(), n2 = e.sortedSet.getIterator();
    for (; t2.hasNext(); ) {
      const e2 = t2.getNext().key, r2 = n2.getNext().key;
      if (!e2.isEqual(r2)) return false;
    }
    return true;
  }
  toString() {
    const e = [];
    return this.forEach((t2) => {
      e.push(t2.toString());
    }), 0 === e.length ? "DocumentSet ()" : "DocumentSet (\n  " + e.join("  \n") + "\n)";
  }
  copy(e, t2) {
    const n2 = new DocumentSet();
    return n2.comparator = this.comparator, n2.keyedMap = e, n2.sortedSet = t2, n2;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_DocumentChangeSet {
  constructor() {
    this.ga = new SortedMap(DocumentKey.comparator);
  }
  track(e) {
    const t2 = e.doc.key, n2 = this.ga.get(t2);
    n2 ? (
      // Merge the new change with the existing change.
      0 !== e.type && 3 === n2.type ? this.ga = this.ga.insert(t2, e) : 3 === e.type && 1 !== n2.type ? this.ga = this.ga.insert(t2, {
        type: n2.type,
        doc: e.doc
      }) : 2 === e.type && 2 === n2.type ? this.ga = this.ga.insert(t2, {
        type: 2,
        doc: e.doc
      }) : 2 === e.type && 0 === n2.type ? this.ga = this.ga.insert(t2, {
        type: 0,
        doc: e.doc
      }) : 1 === e.type && 0 === n2.type ? this.ga = this.ga.remove(t2) : 1 === e.type && 2 === n2.type ? this.ga = this.ga.insert(t2, {
        type: 1,
        doc: n2.doc
      }) : 0 === e.type && 1 === n2.type ? this.ga = this.ga.insert(t2, {
        type: 2,
        doc: e.doc
      }) : (
        // This includes these cases, which don't make sense:
        // Added->Added
        // Removed->Removed
        // Modified->Added
        // Removed->Modified
        // Metadata->Added
        // Removed->Metadata
        fail(63341, {
          Vt: e,
          pa: n2
        })
      )
    ) : this.ga = this.ga.insert(t2, e);
  }
  ya() {
    const e = [];
    return this.ga.inorderTraversal((t2, n2) => {
      e.push(n2);
    }), e;
  }
}
class ViewSnapshot {
  constructor(e, t2, n2, r2, i, s, o, _, a) {
    this.query = e, this.docs = t2, this.oldDocs = n2, this.docChanges = r2, this.mutatedKeys = i, this.fromCache = s, this.syncStateChanged = o, this.excludesMetadataChanges = _, this.hasCachedResults = a;
  }
  /** Returns a view snapshot as if all documents in the snapshot were added. */
  static fromInitialDocuments(e, t2, n2, r2, i) {
    const s = [];
    return t2.forEach((e2) => {
      s.push({
        type: 0,
        doc: e2
      });
    }), new ViewSnapshot(
      e,
      t2,
      DocumentSet.emptySet(t2),
      s,
      n2,
      r2,
      /* syncStateChanged= */
      true,
      /* excludesMetadataChanges= */
      false,
      i
    );
  }
  get hasPendingWrites() {
    return !this.mutatedKeys.isEmpty();
  }
  isEqual(e) {
    if (!(this.fromCache === e.fromCache && this.hasCachedResults === e.hasCachedResults && this.syncStateChanged === e.syncStateChanged && this.mutatedKeys.isEqual(e.mutatedKeys) && __PRIVATE_queryEquals(this.query, e.query) && this.docs.isEqual(e.docs) && this.oldDocs.isEqual(e.oldDocs))) return false;
    const t2 = this.docChanges, n2 = e.docChanges;
    if (t2.length !== n2.length) return false;
    for (let e2 = 0; e2 < t2.length; e2++) if (t2[e2].type !== n2[e2].type || !t2[e2].doc.isEqual(n2[e2].doc)) return false;
    return true;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_QueryListenersInfo {
  constructor() {
    this.wa = void 0, this.ba = [];
  }
  // Helper methods that checks if the query has listeners that listening to remote store
  Sa() {
    return this.ba.some((e) => e.Da());
  }
}
class __PRIVATE_EventManagerImpl {
  constructor() {
    this.queries = __PRIVATE_newQueriesObjectMap(), this.onlineState = "Unknown", this.Ca = /* @__PURE__ */ new Set();
  }
  terminate() {
    !function __PRIVATE_errorAllTargets(e, t2) {
      const n2 = __PRIVATE_debugCast(e), r2 = n2.queries;
      n2.queries = __PRIVATE_newQueriesObjectMap(), r2.forEach((e2, n3) => {
        for (const e3 of n3.ba) e3.onError(t2);
      });
    }(this, new FirestoreError(C.ABORTED, "Firestore shutting down"));
  }
}
function __PRIVATE_newQueriesObjectMap() {
  return new ObjectMap((e) => __PRIVATE_canonifyQuery(e), __PRIVATE_queryEquals);
}
async function __PRIVATE_eventManagerListen(e, t2) {
  const n2 = __PRIVATE_debugCast(e);
  let r2 = 3;
  const i = t2.query;
  let s = n2.queries.get(i);
  s ? !s.Sa() && t2.Da() && // Query has been listening to local cache, and tries to add a new listener sourced from watch.
  (r2 = 2) : (s = new __PRIVATE_QueryListenersInfo(), r2 = t2.Da() ? 0 : 1);
  try {
    switch (r2) {
      case 0:
        s.wa = await n2.onListen(
          i,
          /** enableRemoteListen= */
          true
        );
        break;
      case 1:
        s.wa = await n2.onListen(
          i,
          /** enableRemoteListen= */
          false
        );
        break;
      case 2:
        await n2.onFirstRemoteStoreListen(i);
    }
  } catch (e2) {
    const n3 = __PRIVATE_wrapInUserErrorIfRecoverable(e2, `Initialization of query '${__PRIVATE_stringifyQuery(t2.query)}' failed`);
    return void t2.onError(n3);
  }
  if (n2.queries.set(i, s), s.ba.push(t2), // Run global snapshot listeners if a consistent snapshot has been emitted.
  t2.va(n2.onlineState), s.wa) {
    t2.Fa(s.wa) && __PRIVATE_raiseSnapshotsInSyncEvent(n2);
  }
}
async function __PRIVATE_eventManagerUnlisten(e, t2) {
  const n2 = __PRIVATE_debugCast(e), r2 = t2.query;
  let i = 3;
  const s = n2.queries.get(r2);
  if (s) {
    const e2 = s.ba.indexOf(t2);
    e2 >= 0 && (s.ba.splice(e2, 1), 0 === s.ba.length ? i = t2.Da() ? 0 : 1 : !s.Sa() && t2.Da() && // The removed listener is the last one that sourced from watch.
    (i = 2));
  }
  switch (i) {
    case 0:
      return n2.queries.delete(r2), n2.onUnlisten(
        r2,
        /** disableRemoteListen= */
        true
      );
    case 1:
      return n2.queries.delete(r2), n2.onUnlisten(
        r2,
        /** disableRemoteListen= */
        false
      );
    case 2:
      return n2.onLastRemoteStoreUnlisten(r2);
    default:
      return;
  }
}
function __PRIVATE_eventManagerOnWatchChange(e, t2) {
  const n2 = __PRIVATE_debugCast(e);
  let r2 = false;
  for (const e2 of t2) {
    const t3 = e2.query, i = n2.queries.get(t3);
    if (i) {
      for (const t4 of i.ba) t4.Fa(e2) && (r2 = true);
      i.wa = e2;
    }
  }
  r2 && __PRIVATE_raiseSnapshotsInSyncEvent(n2);
}
function __PRIVATE_eventManagerOnWatchError(e, t2, n2) {
  const r2 = __PRIVATE_debugCast(e), i = r2.queries.get(t2);
  if (i) for (const e2 of i.ba) e2.onError(n2);
  r2.queries.delete(t2);
}
function __PRIVATE_raiseSnapshotsInSyncEvent(e) {
  e.Ca.forEach((e2) => {
    e2.next();
  });
}
var Jt, Zt;
(Zt = Jt || (Jt = {})).Ma = "default", /** Listen to changes in cache only */
Zt.Cache = "cache";
class __PRIVATE_QueryListener {
  constructor(e, t2, n2) {
    this.query = e, this.xa = t2, /**
     * Initial snapshots (e.g. from cache) may not be propagated to the wrapped
     * observer. This flag is set to true once we've actually raised an event.
     */
    this.Oa = false, this.Na = null, this.onlineState = "Unknown", this.options = n2 || {};
  }
  /**
   * Applies the new ViewSnapshot to this listener, raising a user-facing event
   * if applicable (depending on what changed, whether the user has opted into
   * metadata-only changes, etc.). Returns true if a user-facing event was
   * indeed raised.
   */
  Fa(e) {
    if (!this.options.includeMetadataChanges) {
      const t3 = [];
      for (const n2 of e.docChanges) 3 !== n2.type && t3.push(n2);
      e = new ViewSnapshot(
        e.query,
        e.docs,
        e.oldDocs,
        t3,
        e.mutatedKeys,
        e.fromCache,
        e.syncStateChanged,
        /* excludesMetadataChanges= */
        true,
        e.hasCachedResults
      );
    }
    let t2 = false;
    return this.Oa ? this.Ba(e) && (this.xa.next(e), t2 = true) : this.La(e, this.onlineState) && (this.ka(e), t2 = true), this.Na = e, t2;
  }
  onError(e) {
    this.xa.error(e);
  }
  /** Returns whether a snapshot was raised. */
  va(e) {
    this.onlineState = e;
    let t2 = false;
    return this.Na && !this.Oa && this.La(this.Na, e) && (this.ka(this.Na), t2 = true), t2;
  }
  La(e, t2) {
    if (!e.fromCache) return true;
    if (!this.Da()) return true;
    const n2 = "Offline" !== t2;
    return (!this.options.Ka || !n2) && (!e.docs.isEmpty() || e.hasCachedResults || "Offline" === t2);
  }
  Ba(e) {
    if (e.docChanges.length > 0) return true;
    const t2 = this.Na && this.Na.hasPendingWrites !== e.hasPendingWrites;
    return !(!e.syncStateChanged && !t2) && true === this.options.includeMetadataChanges;
  }
  ka(e) {
    e = ViewSnapshot.fromInitialDocuments(e.query, e.docs, e.mutatedKeys, e.fromCache, e.hasCachedResults), this.Oa = true, this.xa.next(e);
  }
  Da() {
    return this.options.source !== Jt.Cache;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_AddedLimboDocument {
  constructor(e) {
    this.key = e;
  }
}
class __PRIVATE_RemovedLimboDocument {
  constructor(e) {
    this.key = e;
  }
}
class __PRIVATE_View {
  constructor(e, t2) {
    this.query = e, this.Za = t2, this.Xa = null, this.hasCachedResults = false, /**
     * A flag whether the view is current with the backend. A view is considered
     * current after it has seen the current flag from the backend and did not
     * lose consistency within the watch stream (e.g. because of an existence
     * filter mismatch).
     */
    this.current = false, /** Documents in the view but not in the remote target */
    this.Ya = __PRIVATE_documentKeySet(), /** Document Keys that have local changes */
    this.mutatedKeys = __PRIVATE_documentKeySet(), this.eu = __PRIVATE_newQueryComparator(e), this.tu = new DocumentSet(this.eu);
  }
  /**
   * The set of remote documents that the server has told us belongs to the target associated with
   * this view.
   */
  get nu() {
    return this.Za;
  }
  /**
   * Iterates over a set of doc changes, applies the query limit, and computes
   * what the new results should be, what the changes were, and whether we may
   * need to go back to the local cache for more results. Does not make any
   * changes to the view.
   * @param docChanges - The doc changes to apply to this view.
   * @param previousChanges - If this is being called with a refill, then start
   *        with this set of docs and changes instead of the current view.
   * @returns a new set of docs, changes, and refill flag.
   */
  ru(e, t2) {
    const n2 = t2 ? t2.iu : new __PRIVATE_DocumentChangeSet(), r2 = t2 ? t2.tu : this.tu;
    let i = t2 ? t2.mutatedKeys : this.mutatedKeys, s = r2, o = false;
    const _ = "F" === this.query.limitType && r2.size === this.query.limit ? r2.last() : null, a = "L" === this.query.limitType && r2.size === this.query.limit ? r2.first() : null;
    if (e.inorderTraversal((e2, t3) => {
      const u2 = r2.get(e2), c = __PRIVATE_queryMatches(this.query, t3) ? t3 : null, l2 = !!u2 && this.mutatedKeys.has(u2.key), h = !!c && (c.hasLocalMutations || // We only consider committed mutations for documents that were
      // mutated during the lifetime of the view.
      this.mutatedKeys.has(c.key) && c.hasCommittedMutations);
      let P2 = false;
      if (u2 && c) {
        u2.data.isEqual(c.data) ? l2 !== h && (n2.track({
          type: 3,
          doc: c
        }), P2 = true) : this.su(u2, c) || (n2.track({
          type: 2,
          doc: c
        }), P2 = true, (_ && this.eu(c, _) > 0 || a && this.eu(c, a) < 0) && // This doc moved from inside the limit to outside the limit.
        // That means there may be some other doc in the local cache
        // that should be included instead.
        (o = true));
      } else !u2 && c ? (n2.track({
        type: 0,
        doc: c
      }), P2 = true) : u2 && !c && (n2.track({
        type: 1,
        doc: u2
      }), P2 = true, (_ || a) && // A doc was removed from a full limit query. We'll need to
      // requery from the local cache to see if we know about some other
      // doc that should be in the results.
      (o = true));
      P2 && (c ? (s = s.add(c), i = h ? i.add(e2) : i.delete(e2)) : (s = s.delete(e2), i = i.delete(e2)));
    }), null !== this.query.limit) for (; s.size > this.query.limit; ) {
      const e2 = "F" === this.query.limitType ? s.last() : s.first();
      s = s.delete(e2.key), i = i.delete(e2.key), n2.track({
        type: 1,
        doc: e2
      });
    }
    return {
      tu: s,
      iu: n2,
      Ss: o,
      mutatedKeys: i
    };
  }
  su(e, t2) {
    return e.hasLocalMutations && t2.hasCommittedMutations && !t2.hasLocalMutations;
  }
  /**
   * Updates the view with the given ViewDocumentChanges and optionally updates
   * limbo docs and sync state from the provided target change.
   * @param docChanges - The set of changes to make to the view's docs.
   * @param limboResolutionEnabled - Whether to update limbo documents based on
   *        this change.
   * @param targetChange - A target change to apply for computing limbo docs and
   *        sync state.
   * @param targetIsPendingReset - Whether the target is pending to reset due to
   *        existence filter mismatch. If not explicitly specified, it is treated
   *        equivalently to `false`.
   * @returns A new ViewChange with the given docs, changes, and sync state.
   */
  // PORTING NOTE: The iOS/Android clients always compute limbo document changes.
  applyChanges(e, t2, n2, r2) {
    const i = this.tu;
    this.tu = e.tu, this.mutatedKeys = e.mutatedKeys;
    const s = e.iu.ya();
    s.sort((e2, t3) => function __PRIVATE_compareChangeType(e3, t4) {
      const order = (e4) => {
        switch (e4) {
          case 0:
            return 1;
          case 2:
          case 3:
            return 2;
          case 1:
            return 0;
          default:
            return fail(20277, {
              Vt: e4
            });
        }
      };
      return order(e3) - order(t4);
    }(e2.type, t3.type) || this.eu(e2.doc, t3.doc)), this.ou(n2), r2 = r2 ?? false;
    const o = t2 && !r2 ? this._u() : [], _ = 0 === this.Ya.size && this.current && !r2 ? 1 : 0, a = _ !== this.Xa;
    if (this.Xa = _, 0 !== s.length || a) {
      return {
        snapshot: new ViewSnapshot(
          this.query,
          e.tu,
          i,
          s,
          e.mutatedKeys,
          0 === _,
          a,
          /* excludesMetadataChanges= */
          false,
          !!n2 && n2.resumeToken.approximateByteSize() > 0
        ),
        au: o
      };
    }
    return {
      au: o
    };
  }
  /**
   * Applies an OnlineState change to the view, potentially generating a
   * ViewChange if the view's syncState changes as a result.
   */
  va(e) {
    return this.current && "Offline" === e ? (
      // If we're offline, set `current` to false and then call applyChanges()
      // to refresh our syncState and generate a ViewChange as appropriate. We
      // are guaranteed to get a new TargetChange that sets `current` back to
      // true once the client is back online.
      (this.current = false, this.applyChanges(
        {
          tu: this.tu,
          iu: new __PRIVATE_DocumentChangeSet(),
          mutatedKeys: this.mutatedKeys,
          Ss: false
        },
        /* limboResolutionEnabled= */
        false
      ))
    ) : {
      au: []
    };
  }
  /**
   * Returns whether the doc for the given key should be in limbo.
   */
  uu(e) {
    return !this.Za.has(e) && // The local store doesn't think it's a result, so it shouldn't be in limbo.
    (!!this.tu.has(e) && !this.tu.get(e).hasLocalMutations);
  }
  /**
   * Updates syncedDocuments, current, and limbo docs based on the given change.
   * Returns the list of changes to which docs are in limbo.
   */
  ou(e) {
    e && (e.addedDocuments.forEach((e2) => this.Za = this.Za.add(e2)), e.modifiedDocuments.forEach((e2) => {
    }), e.removedDocuments.forEach((e2) => this.Za = this.Za.delete(e2)), this.current = e.current);
  }
  _u() {
    if (!this.current) return [];
    const e = this.Ya;
    this.Ya = __PRIVATE_documentKeySet(), this.tu.forEach((e2) => {
      this.uu(e2.key) && (this.Ya = this.Ya.add(e2.key));
    });
    const t2 = [];
    return e.forEach((e2) => {
      this.Ya.has(e2) || t2.push(new __PRIVATE_RemovedLimboDocument(e2));
    }), this.Ya.forEach((n2) => {
      e.has(n2) || t2.push(new __PRIVATE_AddedLimboDocument(n2));
    }), t2;
  }
  /**
   * Update the in-memory state of the current view with the state read from
   * persistence.
   *
   * We update the query view whenever a client's primary status changes:
   * - When a client transitions from primary to secondary, it can miss
   *   LocalStorage updates and its query views may temporarily not be
   *   synchronized with the state on disk.
   * - For secondary to primary transitions, the client needs to update the list
   *   of `syncedDocuments` since secondary clients update their query views
   *   based purely on synthesized RemoteEvents.
   *
   * @param queryResult.documents - The documents that match the query according
   * to the LocalStore.
   * @param queryResult.remoteKeys - The keys of the documents that match the
   * query according to the backend.
   *
   * @returns The ViewChange that resulted from this synchronization.
   */
  // PORTING NOTE: Multi-tab only.
  cu(e) {
    this.Za = e.ks, this.Ya = __PRIVATE_documentKeySet();
    const t2 = this.ru(e.documents);
    return this.applyChanges(
      t2,
      /* limboResolutionEnabled= */
      true
    );
  }
  /**
   * Returns a view snapshot as if this query was just listened to. Contains
   * a document add for every existing document and the `fromCache` and
   * `hasPendingWrites` status of the already established view.
   */
  // PORTING NOTE: Multi-tab only.
  lu() {
    return ViewSnapshot.fromInitialDocuments(this.query, this.tu, this.mutatedKeys, 0 === this.Xa, this.hasCachedResults);
  }
}
const Xt = "SyncEngine";
class __PRIVATE_QueryView {
  constructor(e, t2, n2) {
    this.query = e, this.targetId = t2, this.view = n2;
  }
}
class LimboResolution {
  constructor(e) {
    this.key = e, /**
     * Set to true once we've received a document. This is used in
     * getRemoteKeysForTarget() and ultimately used by WatchChangeAggregator to
     * decide whether it needs to manufacture a delete event for the target once
     * the target is CURRENT.
     */
    this.hu = false;
  }
}
class __PRIVATE_SyncEngineImpl {
  constructor(e, t2, n2, r2, i, s) {
    this.localStore = e, this.remoteStore = t2, this.eventManager = n2, this.sharedClientState = r2, this.currentUser = i, this.maxConcurrentLimboResolutions = s, this.Pu = {}, this.Tu = new ObjectMap((e2) => __PRIVATE_canonifyQuery(e2), __PRIVATE_queryEquals), this.Iu = /* @__PURE__ */ new Map(), /**
     * The keys of documents that are in limbo for which we haven't yet started a
     * limbo resolution query. The strings in this set are the result of calling
     * `key.path.canonicalString()` where `key` is a `DocumentKey` object.
     *
     * The `Set` type was chosen because it provides efficient lookup and removal
     * of arbitrary elements and it also maintains insertion order, providing the
     * desired queue-like FIFO semantics.
     */
    this.Eu = /* @__PURE__ */ new Set(), /**
     * Keeps track of the target ID for each document that is in limbo with an
     * active target.
     */
    this.Ru = new SortedMap(DocumentKey.comparator), /**
     * Keeps track of the information about an active limbo resolution for each
     * active target ID that was started for the purpose of limbo resolution.
     */
    this.Au = /* @__PURE__ */ new Map(), this.Vu = new __PRIVATE_ReferenceSet(), /** Stores user completion handlers, indexed by User and BatchId. */
    this.du = {}, /** Stores user callbacks waiting for all pending writes to be acknowledged. */
    this.mu = /* @__PURE__ */ new Map(), this.fu = __PRIVATE_TargetIdGenerator.ar(), this.onlineState = "Unknown", // The primary state is set to `true` or `false` immediately after Firestore
    // startup. In the interim, a client should only be considered primary if
    // `isPrimary` is true.
    this.gu = void 0;
  }
  get isPrimaryClient() {
    return true === this.gu;
  }
}
async function __PRIVATE_syncEngineListen(e, t2, n2 = true) {
  const r2 = __PRIVATE_ensureWatchCallbacks(e);
  let i;
  const s = r2.Tu.get(t2);
  return s ? (
    // PORTING NOTE: With Multi-Tab Web, it is possible that a query view
    // already exists when EventManager calls us for the first time. This
    // happens when the primary tab is already listening to this query on
    // behalf of another tab and the user of the primary also starts listening
    // to the query. EventManager will not have an assigned target ID in this
    // case and calls `listen` to obtain this ID.
    (r2.sharedClientState.addLocalQueryTarget(s.targetId), i = s.view.lu())
  ) : i = await __PRIVATE_allocateTargetAndMaybeListen(
    r2,
    t2,
    n2,
    /** shouldInitializeView= */
    true
  ), i;
}
async function __PRIVATE_triggerRemoteStoreListen(e, t2) {
  const n2 = __PRIVATE_ensureWatchCallbacks(e);
  await __PRIVATE_allocateTargetAndMaybeListen(
    n2,
    t2,
    /** shouldListenToRemote= */
    true,
    /** shouldInitializeView= */
    false
  );
}
async function __PRIVATE_allocateTargetAndMaybeListen(e, t2, n2, r2) {
  const i = await __PRIVATE_localStoreAllocateTarget(e.localStore, __PRIVATE_queryToTarget(t2)), s = i.targetId, o = e.sharedClientState.addLocalQueryTarget(s, n2);
  let _;
  return r2 && (_ = await __PRIVATE_initializeViewAndComputeSnapshot(e, t2, s, "current" === o, i.resumeToken)), e.isPrimaryClient && n2 && __PRIVATE_remoteStoreListen(e.remoteStore, i), _;
}
async function __PRIVATE_initializeViewAndComputeSnapshot(e, t2, n2, r2, i) {
  e.pu = (t3, n3, r3) => async function __PRIVATE_applyDocChanges(e2, t4, n4, r4) {
    let i2 = t4.view.ru(n4);
    i2.Ss && // The query has a limit and some docs were removed, so we need
    // to re-run the query against the local store to make sure we
    // didn't lose any good docs that had been past the limit.
    (i2 = await __PRIVATE_localStoreExecuteQuery(
      e2.localStore,
      t4.query,
      /* usePreviousResults= */
      false
    ).then(({ documents: e3 }) => t4.view.ru(e3, i2)));
    const s2 = r4 && r4.targetChanges.get(t4.targetId), o2 = r4 && null != r4.targetMismatches.get(t4.targetId), _2 = t4.view.applyChanges(
      i2,
      /* limboResolutionEnabled= */
      e2.isPrimaryClient,
      s2,
      o2
    );
    return __PRIVATE_updateTrackedLimbos(e2, t4.targetId, _2.au), _2.snapshot;
  }(e, t3, n3, r3);
  const s = await __PRIVATE_localStoreExecuteQuery(
    e.localStore,
    t2,
    /* usePreviousResults= */
    true
  ), o = new __PRIVATE_View(t2, s.ks), _ = o.ru(s.documents), a = TargetChange.createSynthesizedTargetChangeForCurrentChange(n2, r2 && "Offline" !== e.onlineState, i), u2 = o.applyChanges(
    _,
    /* limboResolutionEnabled= */
    e.isPrimaryClient,
    a
  );
  __PRIVATE_updateTrackedLimbos(e, n2, u2.au);
  const c = new __PRIVATE_QueryView(t2, n2, o);
  return e.Tu.set(t2, c), e.Iu.has(n2) ? e.Iu.get(n2).push(t2) : e.Iu.set(n2, [t2]), u2.snapshot;
}
async function __PRIVATE_syncEngineUnlisten(e, t2, n2) {
  const r2 = __PRIVATE_debugCast(e), i = r2.Tu.get(t2), s = r2.Iu.get(i.targetId);
  if (s.length > 1) return r2.Iu.set(i.targetId, s.filter((e2) => !__PRIVATE_queryEquals(e2, t2))), void r2.Tu.delete(t2);
  if (r2.isPrimaryClient) {
    r2.sharedClientState.removeLocalQueryTarget(i.targetId);
    r2.sharedClientState.isActiveQueryTarget(i.targetId) || await __PRIVATE_localStoreReleaseTarget(
      r2.localStore,
      i.targetId,
      /*keepPersistedTargetData=*/
      false
    ).then(() => {
      r2.sharedClientState.clearQueryState(i.targetId), n2 && __PRIVATE_remoteStoreUnlisten(r2.remoteStore, i.targetId), __PRIVATE_removeAndCleanupTarget(r2, i.targetId);
    }).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
  } else __PRIVATE_removeAndCleanupTarget(r2, i.targetId), await __PRIVATE_localStoreReleaseTarget(
    r2.localStore,
    i.targetId,
    /*keepPersistedTargetData=*/
    true
  );
}
async function __PRIVATE_triggerRemoteStoreUnlisten(e, t2) {
  const n2 = __PRIVATE_debugCast(e), r2 = n2.Tu.get(t2), i = n2.Iu.get(r2.targetId);
  n2.isPrimaryClient && 1 === i.length && // PORTING NOTE: Unregister the target ID with local Firestore client as
  // watch target.
  (n2.sharedClientState.removeLocalQueryTarget(r2.targetId), __PRIVATE_remoteStoreUnlisten(n2.remoteStore, r2.targetId));
}
async function __PRIVATE_syncEngineWrite(e, t2, n2) {
  const r2 = __PRIVATE_syncEngineEnsureWriteCallbacks(e);
  try {
    const e2 = await function __PRIVATE_localStoreWriteLocally(e3, t3) {
      const n3 = __PRIVATE_debugCast(e3), r3 = Timestamp.now(), i = t3.reduce((e4, t4) => e4.add(t4.key), __PRIVATE_documentKeySet());
      let s, o;
      return n3.persistence.runTransaction("Locally write mutations", "readwrite", (e4) => {
        let _ = __PRIVATE_mutableDocumentMap(), a = __PRIVATE_documentKeySet();
        return n3.xs.getEntries(e4, i).next((e5) => {
          _ = e5, _.forEach((e6, t4) => {
            t4.isValidDocument() || (a = a.add(e6));
          });
        }).next(() => n3.localDocuments.getOverlayedDocuments(e4, _)).next((i2) => {
          s = i2;
          const o2 = [];
          for (const e5 of t3) {
            const t4 = __PRIVATE_mutationExtractBaseValue(e5, s.get(e5.key).overlayedDocument);
            null != t4 && // NOTE: The base state should only be applied if there's some
            // existing document to override, so use a Precondition of
            // exists=true
            o2.push(new __PRIVATE_PatchMutation(e5.key, t4, __PRIVATE_extractFieldMask(t4.value.mapValue), Precondition.exists(true)));
          }
          return n3.mutationQueue.addMutationBatch(e4, r3, o2, t3);
        }).next((t4) => {
          o = t4;
          const r4 = t4.applyToLocalDocumentSet(s, a);
          return n3.documentOverlayCache.saveOverlays(e4, t4.batchId, r4);
        });
      }).then(() => ({
        batchId: o.batchId,
        changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(s)
      }));
    }(r2.localStore, t2);
    r2.sharedClientState.addPendingMutation(e2.batchId), function __PRIVATE_addMutationCallback(e3, t3, n3) {
      let r3 = e3.du[e3.currentUser.toKey()];
      r3 || (r3 = new SortedMap(__PRIVATE_primitiveComparator));
      r3 = r3.insert(t3, n3), e3.du[e3.currentUser.toKey()] = r3;
    }(r2, e2.batchId, n2), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r2, e2.changes), await __PRIVATE_fillWritePipeline(r2.remoteStore);
  } catch (e2) {
    const t3 = __PRIVATE_wrapInUserErrorIfRecoverable(e2, "Failed to persist write");
    n2.reject(t3);
  }
}
async function __PRIVATE_syncEngineApplyRemoteEvent(e, t2) {
  const n2 = __PRIVATE_debugCast(e);
  try {
    const e2 = await __PRIVATE_localStoreApplyRemoteEventToLocalCache(n2.localStore, t2);
    t2.targetChanges.forEach((e3, t3) => {
      const r2 = n2.Au.get(t3);
      r2 && // Since this is a limbo resolution lookup, it's for a single document
      // and it could be added, modified, or removed, but not a combination.
      (__PRIVATE_hardAssert(e3.addedDocuments.size + e3.modifiedDocuments.size + e3.removedDocuments.size <= 1, 22616), e3.addedDocuments.size > 0 ? r2.hu = true : e3.modifiedDocuments.size > 0 ? __PRIVATE_hardAssert(r2.hu, 14607) : e3.removedDocuments.size > 0 && (__PRIVATE_hardAssert(r2.hu, 42227), r2.hu = false));
    }), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n2, e2, t2);
  } catch (e2) {
    await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
  }
}
function __PRIVATE_syncEngineApplyOnlineStateChange(e, t2, n2) {
  const r2 = __PRIVATE_debugCast(e);
  if (r2.isPrimaryClient && 0 === n2 || !r2.isPrimaryClient && 1 === n2) {
    const e2 = [];
    r2.Tu.forEach((n3, r3) => {
      const i = r3.view.va(t2);
      i.snapshot && e2.push(i.snapshot);
    }), function __PRIVATE_eventManagerOnOnlineStateChange(e3, t3) {
      const n3 = __PRIVATE_debugCast(e3);
      n3.onlineState = t3;
      let r3 = false;
      n3.queries.forEach((e4, n4) => {
        for (const e5 of n4.ba)
          e5.va(t3) && (r3 = true);
      }), r3 && __PRIVATE_raiseSnapshotsInSyncEvent(n3);
    }(r2.eventManager, t2), e2.length && r2.Pu.J_(e2), r2.onlineState = t2, r2.isPrimaryClient && r2.sharedClientState.setOnlineState(t2);
  }
}
async function __PRIVATE_syncEngineRejectListen(e, t2, n2) {
  const r2 = __PRIVATE_debugCast(e);
  r2.sharedClientState.updateQueryState(t2, "rejected", n2);
  const i = r2.Au.get(t2), s = i && i.key;
  if (s) {
    let e2 = new SortedMap(DocumentKey.comparator);
    e2 = e2.insert(s, MutableDocument.newNoDocument(s, SnapshotVersion.min()));
    const n3 = __PRIVATE_documentKeySet().add(s), i2 = new RemoteEvent(
      SnapshotVersion.min(),
      /* targetChanges= */
      /* @__PURE__ */ new Map(),
      /* targetMismatches= */
      new SortedMap(__PRIVATE_primitiveComparator),
      e2,
      n3
    );
    await __PRIVATE_syncEngineApplyRemoteEvent(r2, i2), // Since this query failed, we won't want to manually unlisten to it.
    // We only remove it from bookkeeping after we successfully applied the
    // RemoteEvent. If `applyRemoteEvent()` throws, we want to re-listen to
    // this query when the RemoteStore restarts the Watch stream, which should
    // re-trigger the target failure.
    r2.Ru = r2.Ru.remove(s), r2.Au.delete(t2), __PRIVATE_pumpEnqueuedLimboResolutions(r2);
  } else await __PRIVATE_localStoreReleaseTarget(
    r2.localStore,
    t2,
    /* keepPersistedTargetData */
    false
  ).then(() => __PRIVATE_removeAndCleanupTarget(r2, t2, n2)).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
}
async function __PRIVATE_syncEngineApplySuccessfulWrite(e, t2) {
  const n2 = __PRIVATE_debugCast(e), r2 = t2.batch.batchId;
  try {
    const e2 = await __PRIVATE_localStoreAcknowledgeBatch(n2.localStore, t2);
    __PRIVATE_processUserCallback(
      n2,
      r2,
      /*error=*/
      null
    ), __PRIVATE_triggerPendingWritesCallbacks(n2, r2), n2.sharedClientState.updateMutationState(r2, "acknowledged"), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n2, e2);
  } catch (e2) {
    await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
  }
}
async function __PRIVATE_syncEngineRejectFailedWrite(e, t2, n2) {
  const r2 = __PRIVATE_debugCast(e);
  try {
    const e2 = await function __PRIVATE_localStoreRejectBatch(e3, t3) {
      const n3 = __PRIVATE_debugCast(e3);
      return n3.persistence.runTransaction("Reject batch", "readwrite-primary", (e4) => {
        let r3;
        return n3.mutationQueue.lookupMutationBatch(e4, t3).next((t4) => (__PRIVATE_hardAssert(null !== t4, 37113), r3 = t4.keys(), n3.mutationQueue.removeMutationBatch(e4, t4))).next(() => n3.mutationQueue.performConsistencyCheck(e4)).next(() => n3.documentOverlayCache.removeOverlaysForBatchId(e4, r3, t3)).next(() => n3.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e4, r3)).next(() => n3.localDocuments.getDocuments(e4, r3));
      });
    }(r2.localStore, t2);
    __PRIVATE_processUserCallback(r2, t2, n2), __PRIVATE_triggerPendingWritesCallbacks(r2, t2), r2.sharedClientState.updateMutationState(t2, "rejected", n2), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r2, e2);
  } catch (n3) {
    await __PRIVATE_ignoreIfPrimaryLeaseLoss(n3);
  }
}
function __PRIVATE_triggerPendingWritesCallbacks(e, t2) {
  (e.mu.get(t2) || []).forEach((e2) => {
    e2.resolve();
  }), e.mu.delete(t2);
}
function __PRIVATE_processUserCallback(e, t2, n2) {
  const r2 = __PRIVATE_debugCast(e);
  let i = r2.du[r2.currentUser.toKey()];
  if (i) {
    const e2 = i.get(t2);
    e2 && (n2 ? e2.reject(n2) : e2.resolve(), i = i.remove(t2)), r2.du[r2.currentUser.toKey()] = i;
  }
}
function __PRIVATE_removeAndCleanupTarget(e, t2, n2 = null) {
  e.sharedClientState.removeLocalQueryTarget(t2);
  for (const r2 of e.Iu.get(t2)) e.Tu.delete(r2), n2 && e.Pu.yu(r2, n2);
  if (e.Iu.delete(t2), e.isPrimaryClient) {
    e.Vu.Gr(t2).forEach((t3) => {
      e.Vu.containsKey(t3) || // We removed the last reference for this key
      __PRIVATE_removeLimboTarget(e, t3);
    });
  }
}
function __PRIVATE_removeLimboTarget(e, t2) {
  e.Eu.delete(t2.path.canonicalString());
  const n2 = e.Ru.get(t2);
  null !== n2 && (__PRIVATE_remoteStoreUnlisten(e.remoteStore, n2), e.Ru = e.Ru.remove(t2), e.Au.delete(n2), __PRIVATE_pumpEnqueuedLimboResolutions(e));
}
function __PRIVATE_updateTrackedLimbos(e, t2, n2) {
  for (const r2 of n2) if (r2 instanceof __PRIVATE_AddedLimboDocument) e.Vu.addReference(r2.key, t2), __PRIVATE_trackLimboChange(e, r2);
  else if (r2 instanceof __PRIVATE_RemovedLimboDocument) {
    __PRIVATE_logDebug(Xt, "Document no longer in limbo: " + r2.key), e.Vu.removeReference(r2.key, t2);
    e.Vu.containsKey(r2.key) || // We removed the last reference for this key
    __PRIVATE_removeLimboTarget(e, r2.key);
  } else fail(19791, {
    wu: r2
  });
}
function __PRIVATE_trackLimboChange(e, t2) {
  const n2 = t2.key, r2 = n2.path.canonicalString();
  e.Ru.get(n2) || e.Eu.has(r2) || (__PRIVATE_logDebug(Xt, "New document in limbo: " + n2), e.Eu.add(r2), __PRIVATE_pumpEnqueuedLimboResolutions(e));
}
function __PRIVATE_pumpEnqueuedLimboResolutions(e) {
  for (; e.Eu.size > 0 && e.Ru.size < e.maxConcurrentLimboResolutions; ) {
    const t2 = e.Eu.values().next().value;
    e.Eu.delete(t2);
    const n2 = new DocumentKey(ResourcePath.fromString(t2)), r2 = e.fu.next();
    e.Au.set(r2, new LimboResolution(n2)), e.Ru = e.Ru.insert(n2, r2), __PRIVATE_remoteStoreListen(e.remoteStore, new TargetData(__PRIVATE_queryToTarget(__PRIVATE_newQueryForPath(n2.path)), r2, "TargetPurposeLimboResolution", __PRIVATE_ListenSequence.ce));
  }
}
async function __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(e, t2, n2) {
  const r2 = __PRIVATE_debugCast(e), i = [], s = [], o = [];
  r2.Tu.isEmpty() || (r2.Tu.forEach((e2, _) => {
    o.push(r2.pu(_, t2, n2).then((e3) => {
      var _a;
      if ((e3 || n2) && r2.isPrimaryClient) {
        const t3 = e3 ? !e3.fromCache : (_a = n2 == null ? void 0 : n2.targetChanges.get(_.targetId)) == null ? void 0 : _a.current;
        r2.sharedClientState.updateQueryState(_.targetId, t3 ? "current" : "not-current");
      }
      if (e3) {
        i.push(e3);
        const t3 = __PRIVATE_LocalViewChanges.Es(_.targetId, e3);
        s.push(t3);
      }
    }));
  }), await Promise.all(o), r2.Pu.J_(i), await async function __PRIVATE_localStoreNotifyLocalViewChanges(e2, t3) {
    const n3 = __PRIVATE_debugCast(e2);
    try {
      await n3.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (e3) => PersistencePromise.forEach(t3, (t4) => PersistencePromise.forEach(t4.Ts, (r3) => n3.persistence.referenceDelegate.addReference(e3, t4.targetId, r3)).next(() => PersistencePromise.forEach(t4.Is, (r3) => n3.persistence.referenceDelegate.removeReference(e3, t4.targetId, r3)))));
    } catch (e3) {
      if (!__PRIVATE_isIndexedDbTransactionError(e3)) throw e3;
      __PRIVATE_logDebug(Bt, "Failed to update sequence numbers: " + e3);
    }
    for (const e3 of t3) {
      const t4 = e3.targetId;
      if (!e3.fromCache) {
        const e4 = n3.vs.get(t4), r3 = e4.snapshotVersion, i2 = e4.withLastLimboFreeSnapshotVersion(r3);
        n3.vs = n3.vs.insert(t4, i2);
      }
    }
  }(r2.localStore, s));
}
async function __PRIVATE_syncEngineHandleCredentialChange(e, t2) {
  const n2 = __PRIVATE_debugCast(e);
  if (!n2.currentUser.isEqual(t2)) {
    __PRIVATE_logDebug(Xt, "User change. New user:", t2.toKey());
    const e2 = await __PRIVATE_localStoreHandleUserChange(n2.localStore, t2);
    n2.currentUser = t2, // Fails tasks waiting for pending writes requested by previous user.
    function __PRIVATE_rejectOutstandingPendingWritesCallbacks(e3, t3) {
      e3.mu.forEach((e4) => {
        e4.forEach((e5) => {
          e5.reject(new FirestoreError(C.CANCELLED, t3));
        });
      }), e3.mu.clear();
    }(n2, "'waitForPendingWrites' promise is rejected due to a user change."), // TODO(b/114226417): Consider calling this only in the primary tab.
    n2.sharedClientState.handleUserChange(t2, e2.removedBatchIds, e2.addedBatchIds), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n2, e2.Ns);
  }
}
function __PRIVATE_syncEngineGetRemoteKeysForTarget(e, t2) {
  const n2 = __PRIVATE_debugCast(e), r2 = n2.Au.get(t2);
  if (r2 && r2.hu) return __PRIVATE_documentKeySet().add(r2.key);
  {
    let e2 = __PRIVATE_documentKeySet();
    const r3 = n2.Iu.get(t2);
    if (!r3) return e2;
    for (const t3 of r3) {
      const r4 = n2.Tu.get(t3);
      e2 = e2.unionWith(r4.view.nu);
    }
    return e2;
  }
}
function __PRIVATE_ensureWatchCallbacks(e) {
  const t2 = __PRIVATE_debugCast(e);
  return t2.remoteStore.remoteSyncer.applyRemoteEvent = __PRIVATE_syncEngineApplyRemoteEvent.bind(null, t2), t2.remoteStore.remoteSyncer.getRemoteKeysForTarget = __PRIVATE_syncEngineGetRemoteKeysForTarget.bind(null, t2), t2.remoteStore.remoteSyncer.rejectListen = __PRIVATE_syncEngineRejectListen.bind(null, t2), t2.Pu.J_ = __PRIVATE_eventManagerOnWatchChange.bind(null, t2.eventManager), t2.Pu.yu = __PRIVATE_eventManagerOnWatchError.bind(null, t2.eventManager), t2;
}
function __PRIVATE_syncEngineEnsureWriteCallbacks(e) {
  const t2 = __PRIVATE_debugCast(e);
  return t2.remoteStore.remoteSyncer.applySuccessfulWrite = __PRIVATE_syncEngineApplySuccessfulWrite.bind(null, t2), t2.remoteStore.remoteSyncer.rejectFailedWrite = __PRIVATE_syncEngineRejectFailedWrite.bind(null, t2), t2;
}
class __PRIVATE_MemoryOfflineComponentProvider {
  constructor() {
    this.kind = "memory", this.synchronizeTabs = false;
  }
  async initialize(e) {
    this.serializer = __PRIVATE_newSerializer(e.databaseInfo.databaseId), this.sharedClientState = this.Du(e), this.persistence = this.Cu(e), await this.persistence.start(), this.localStore = this.vu(e), this.gcScheduler = this.Fu(e, this.localStore), this.indexBackfillerScheduler = this.Mu(e, this.localStore);
  }
  Fu(e, t2) {
    return null;
  }
  Mu(e, t2) {
    return null;
  }
  vu(e) {
    return __PRIVATE_newLocalStore(this.persistence, new __PRIVATE_QueryEngine(), e.initialUser, this.serializer);
  }
  Cu(e) {
    return new __PRIVATE_MemoryPersistence(__PRIVATE_MemoryEagerDelegate.Vi, this.serializer);
  }
  Du(e) {
    return new __PRIVATE_MemorySharedClientState();
  }
  async terminate() {
    var _a, _b;
    (_a = this.gcScheduler) == null ? void 0 : _a.stop(), (_b = this.indexBackfillerScheduler) == null ? void 0 : _b.stop(), this.sharedClientState.shutdown(), await this.persistence.shutdown();
  }
}
__PRIVATE_MemoryOfflineComponentProvider.provider = {
  build: () => new __PRIVATE_MemoryOfflineComponentProvider()
};
class __PRIVATE_LruGcMemoryOfflineComponentProvider extends __PRIVATE_MemoryOfflineComponentProvider {
  constructor(e) {
    super(), this.cacheSizeBytes = e;
  }
  Fu(e, t2) {
    __PRIVATE_hardAssert(this.persistence.referenceDelegate instanceof __PRIVATE_MemoryLruDelegate, 46915);
    const n2 = this.persistence.referenceDelegate.garbageCollector;
    return new __PRIVATE_LruScheduler(n2, e.asyncQueue, t2);
  }
  Cu(e) {
    const t2 = void 0 !== this.cacheSizeBytes ? LruParams.withCacheSize(this.cacheSizeBytes) : LruParams.DEFAULT;
    return new __PRIVATE_MemoryPersistence((e2) => __PRIVATE_MemoryLruDelegate.Vi(e2, t2), this.serializer);
  }
}
class OnlineComponentProvider {
  async initialize(e, t2) {
    this.localStore || (this.localStore = e.localStore, this.sharedClientState = e.sharedClientState, this.datastore = this.createDatastore(t2), this.remoteStore = this.createRemoteStore(t2), this.eventManager = this.createEventManager(t2), this.syncEngine = this.createSyncEngine(
      t2,
      /* startAsPrimary=*/
      !e.synchronizeTabs
    ), this.sharedClientState.onlineStateHandler = (e2) => __PRIVATE_syncEngineApplyOnlineStateChange(
      this.syncEngine,
      e2,
      1
      /* OnlineStateSource.SharedClientState */
    ), this.remoteStore.remoteSyncer.handleCredentialChange = __PRIVATE_syncEngineHandleCredentialChange.bind(null, this.syncEngine), await __PRIVATE_remoteStoreApplyPrimaryState(this.remoteStore, this.syncEngine.isPrimaryClient));
  }
  createEventManager(e) {
    return function __PRIVATE_newEventManager() {
      return new __PRIVATE_EventManagerImpl();
    }();
  }
  createDatastore(e) {
    const t2 = __PRIVATE_newSerializer(e.databaseInfo.databaseId), n2 = __PRIVATE_newConnection(e.databaseInfo);
    return __PRIVATE_newDatastore(e.authCredentials, e.appCheckCredentials, n2, t2);
  }
  createRemoteStore(e) {
    return function __PRIVATE_newRemoteStore(e2, t2, n2, r2, i) {
      return new __PRIVATE_RemoteStoreImpl(e2, t2, n2, r2, i);
    }(this.localStore, this.datastore, e.asyncQueue, (e2) => __PRIVATE_syncEngineApplyOnlineStateChange(
      this.syncEngine,
      e2,
      0
      /* OnlineStateSource.RemoteStore */
    ), function __PRIVATE_newConnectivityMonitor() {
      return __PRIVATE_BrowserConnectivityMonitor.v() ? new __PRIVATE_BrowserConnectivityMonitor() : new __PRIVATE_NoopConnectivityMonitor();
    }());
  }
  createSyncEngine(e, t2) {
    return function __PRIVATE_newSyncEngine(e2, t3, n2, r2, i, s, o) {
      const _ = new __PRIVATE_SyncEngineImpl(e2, t3, n2, r2, i, s);
      return o && (_.gu = true), _;
    }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, e.initialUser, e.maxConcurrentLimboResolutions, t2);
  }
  async terminate() {
    var _a, _b;
    await async function __PRIVATE_remoteStoreShutdown(e) {
      const t2 = __PRIVATE_debugCast(e);
      __PRIVATE_logDebug(Ht$1, "RemoteStore shutting down."), t2.Ea.add(
        5
        /* OfflineCause.Shutdown */
      ), await __PRIVATE_disableNetworkInternal(t2), t2.Aa.shutdown(), // Set the OnlineState to Unknown (rather than Offline) to avoid potentially
      // triggering spurious listener events with cached data, etc.
      t2.Va.set(
        "Unknown"
        /* OnlineState.Unknown */
      );
    }(this.remoteStore), (_a = this.datastore) == null ? void 0 : _a.terminate(), (_b = this.eventManager) == null ? void 0 : _b.terminate();
  }
}
OnlineComponentProvider.provider = {
  build: () => new OnlineComponentProvider()
};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_AsyncObserver {
  constructor(e) {
    this.observer = e, /**
     * When set to true, will not raise future events. Necessary to deal with
     * async detachment of listener.
     */
    this.muted = false;
  }
  next(e) {
    this.muted || this.observer.next && this.Ou(this.observer.next, e);
  }
  error(e) {
    this.muted || (this.observer.error ? this.Ou(this.observer.error, e) : __PRIVATE_logError("Uncaught Error in snapshot listener:", e.toString()));
  }
  Nu() {
    this.muted = true;
  }
  Ou(e, t2) {
    setTimeout(() => {
      this.muted || e(t2);
    }, 0);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let Transaction$2 = class Transaction {
  constructor(e) {
    this.datastore = e, // The version of each document that was read during this transaction.
    this.readVersions = /* @__PURE__ */ new Map(), this.mutations = [], this.committed = false, /**
     * A deferred usage error that occurred previously in this transaction that
     * will cause the transaction to fail once it actually commits.
     */
    this.lastTransactionError = null, /**
     * Set of documents that have been written in the transaction.
     *
     * When there's more than one write to the same key in a transaction, any
     * writes after the first are handled differently.
     */
    this.writtenDocs = /* @__PURE__ */ new Set();
  }
  async lookup(e) {
    if (this.ensureCommitNotCalled(), this.mutations.length > 0) throw this.lastTransactionError = new FirestoreError(C.INVALID_ARGUMENT, "Firestore transactions require all reads to be executed before all writes."), this.lastTransactionError;
    const t2 = await async function __PRIVATE_invokeBatchGetDocumentsRpc(e2, t3) {
      const n2 = __PRIVATE_debugCast(e2), r2 = {
        documents: t3.map((e3) => __PRIVATE_toName(n2.serializer, e3))
      }, i = await n2.jo("BatchGetDocuments", n2.serializer.databaseId, ResourcePath.emptyPath(), r2, t3.length), s = /* @__PURE__ */ new Map();
      i.forEach((e3) => {
        const t4 = __PRIVATE_fromBatchGetDocumentsResponse(n2.serializer, e3);
        s.set(t4.key.toString(), t4);
      });
      const o = [];
      return t3.forEach((e3) => {
        const t4 = s.get(e3.toString());
        __PRIVATE_hardAssert(!!t4, 55234, {
          key: e3
        }), o.push(t4);
      }), o;
    }(this.datastore, e);
    return t2.forEach((e2) => this.recordVersion(e2)), t2;
  }
  set(e, t2) {
    this.write(t2.toMutation(e, this.precondition(e))), this.writtenDocs.add(e.toString());
  }
  update(e, t2) {
    try {
      this.write(t2.toMutation(e, this.preconditionForUpdate(e)));
    } catch (e2) {
      this.lastTransactionError = e2;
    }
    this.writtenDocs.add(e.toString());
  }
  delete(e) {
    this.write(new __PRIVATE_DeleteMutation(e, this.precondition(e))), this.writtenDocs.add(e.toString());
  }
  async commit() {
    if (this.ensureCommitNotCalled(), this.lastTransactionError) throw this.lastTransactionError;
    const e = this.readVersions;
    this.mutations.forEach((t2) => {
      e.delete(t2.key.toString());
    }), // For each document that was read but not written to, we want to perform
    // a `verify` operation.
    e.forEach((e2, t2) => {
      const n2 = DocumentKey.fromPath(t2);
      this.mutations.push(new __PRIVATE_VerifyMutation(n2, this.precondition(n2)));
    }), await async function __PRIVATE_invokeCommitRpc(e2, t2) {
      const n2 = __PRIVATE_debugCast(e2), r2 = {
        writes: t2.map((e3) => toMutation(n2.serializer, e3))
      };
      await n2.Wo("Commit", n2.serializer.databaseId, ResourcePath.emptyPath(), r2);
    }(this.datastore, this.mutations), this.committed = true;
  }
  recordVersion(e) {
    let t2;
    if (e.isFoundDocument()) t2 = e.version;
    else {
      if (!e.isNoDocument()) throw fail(50498, {
        Gu: e.constructor.name
      });
      t2 = SnapshotVersion.min();
    }
    const n2 = this.readVersions.get(e.key.toString());
    if (n2) {
      if (!t2.isEqual(n2))
        throw new FirestoreError(C.ABORTED, "Document version changed between two reads.");
    } else this.readVersions.set(e.key.toString(), t2);
  }
  /**
   * Returns the version of this document when it was read in this transaction,
   * as a precondition, or no precondition if it was not read.
   */
  precondition(e) {
    const t2 = this.readVersions.get(e.toString());
    return !this.writtenDocs.has(e.toString()) && t2 ? t2.isEqual(SnapshotVersion.min()) ? Precondition.exists(false) : Precondition.updateTime(t2) : Precondition.none();
  }
  /**
   * Returns the precondition for a document if the operation is an update.
   */
  preconditionForUpdate(e) {
    const t2 = this.readVersions.get(e.toString());
    if (!this.writtenDocs.has(e.toString()) && t2) {
      if (t2.isEqual(SnapshotVersion.min()))
        throw new FirestoreError(C.INVALID_ARGUMENT, "Can't update a document that doesn't exist.");
      return Precondition.updateTime(t2);
    }
    return Precondition.exists(true);
  }
  write(e) {
    this.ensureCommitNotCalled(), this.mutations.push(e);
  }
  ensureCommitNotCalled() {
  }
};
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_TransactionRunner {
  constructor(e, t2, n2, r2, i) {
    this.asyncQueue = e, this.datastore = t2, this.options = n2, this.updateFunction = r2, this.deferred = i, this.zu = n2.maxAttempts, this.M_ = new __PRIVATE_ExponentialBackoff(
      this.asyncQueue,
      "transaction_retry"
      /* TimerId.TransactionRetry */
    );
  }
  /** Runs the transaction and sets the result on deferred. */
  ju() {
    this.zu -= 1, this.Hu();
  }
  Hu() {
    this.M_.p_(async () => {
      const e = new Transaction$2(this.datastore), t2 = this.Ju(e);
      t2 && t2.then((t3) => {
        this.asyncQueue.enqueueAndForget(() => e.commit().then(() => {
          this.deferred.resolve(t3);
        }).catch((e2) => {
          this.Zu(e2);
        }));
      }).catch((e2) => {
        this.Zu(e2);
      });
    });
  }
  Ju(e) {
    try {
      const t2 = this.updateFunction(e);
      return !__PRIVATE_isNullOrUndefined(t2) && t2.catch && t2.then ? t2 : (this.deferred.reject(Error("Transaction callback must return a Promise")), null);
    } catch (e2) {
      return this.deferred.reject(e2), null;
    }
  }
  Zu(e) {
    this.zu > 0 && this.Xu(e) ? (this.zu -= 1, this.asyncQueue.enqueueAndForget(() => (this.Hu(), Promise.resolve()))) : this.deferred.reject(e);
  }
  Xu(e) {
    if ("FirebaseError" === (e == null ? void 0 : e.name)) {
      const t2 = e.code;
      return "aborted" === t2 || "failed-precondition" === t2 || "already-exists" === t2 || !__PRIVATE_isPermanentError(t2);
    }
    return false;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Yt$1 = "FirestoreClient";
class FirestoreClient {
  constructor(e, t2, n2, r2, i) {
    this.authCredentials = e, this.appCheckCredentials = t2, this.asyncQueue = n2, this._databaseInfo = r2, this.user = User.UNAUTHENTICATED, this.clientId = __PRIVATE_AutoId.newId(), this.authCredentialListener = () => Promise.resolve(), this.appCheckCredentialListener = () => Promise.resolve(), this._uninitializedComponentsProvider = i, this.authCredentials.start(n2, async (e2) => {
      __PRIVATE_logDebug(Yt$1, "Received user=", e2.uid), await this.authCredentialListener(e2), this.user = e2;
    }), this.appCheckCredentials.start(n2, (e2) => (__PRIVATE_logDebug(Yt$1, "Received new app check token=", e2), this.appCheckCredentialListener(e2, this.user)));
  }
  get configuration() {
    return {
      asyncQueue: this.asyncQueue,
      databaseInfo: this._databaseInfo,
      clientId: this.clientId,
      authCredentials: this.authCredentials,
      appCheckCredentials: this.appCheckCredentials,
      initialUser: this.user,
      maxConcurrentLimboResolutions: 100
    };
  }
  setCredentialChangeListener(e) {
    this.authCredentialListener = e;
  }
  setAppCheckTokenChangeListener(e) {
    this.appCheckCredentialListener = e;
  }
  terminate() {
    this.asyncQueue.enterRestrictedMode();
    const e = new __PRIVATE_Deferred();
    return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async () => {
      try {
        this._onlineComponents && await this._onlineComponents.terminate(), this._offlineComponents && await this._offlineComponents.terminate(), // The credentials provider must be terminated after shutting down the
        // RemoteStore as it will prevent the RemoteStore from retrieving auth
        // tokens.
        this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), e.resolve();
      } catch (t2) {
        const n2 = __PRIVATE_wrapInUserErrorIfRecoverable(t2, "Failed to shutdown persistence");
        e.reject(n2);
      }
    }), e.promise;
  }
}
async function __PRIVATE_setOfflineComponentProvider(e, t2) {
  e.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug(Yt$1, "Initializing OfflineComponentProvider");
  const n2 = e.configuration;
  await t2.initialize(n2);
  let r2 = n2.initialUser;
  e.setCredentialChangeListener(async (e2) => {
    r2.isEqual(e2) || (await __PRIVATE_localStoreHandleUserChange(t2.localStore, e2), r2 = e2);
  }), // When a user calls clearPersistence() in one client, all other clients
  // need to be terminated to allow the delete to succeed.
  t2.persistence.setDatabaseDeletedListener(() => e.terminate()), e._offlineComponents = t2;
}
async function __PRIVATE_setOnlineComponentProvider(e, t2) {
  e.asyncQueue.verifyOperationInProgress();
  const n2 = await __PRIVATE_ensureOfflineComponents(e);
  __PRIVATE_logDebug(Yt$1, "Initializing OnlineComponentProvider"), await t2.initialize(n2, e.configuration), // The CredentialChangeListener of the online component provider takes
  // precedence over the offline component provider.
  e.setCredentialChangeListener((e2) => __PRIVATE_remoteStoreHandleCredentialChange(t2.remoteStore, e2)), e.setAppCheckTokenChangeListener((e2, n3) => __PRIVATE_remoteStoreHandleCredentialChange(t2.remoteStore, n3)), e._onlineComponents = t2;
}
async function __PRIVATE_ensureOfflineComponents(e) {
  if (!e._offlineComponents) if (e._uninitializedComponentsProvider) {
    __PRIVATE_logDebug(Yt$1, "Using user provided OfflineComponentProvider");
    try {
      await __PRIVATE_setOfflineComponentProvider(e, e._uninitializedComponentsProvider._offline);
    } catch (t2) {
      const n2 = t2;
      if (!function __PRIVATE_canFallbackFromIndexedDbError(e2) {
        return "FirebaseError" === e2.name ? e2.code === C.FAILED_PRECONDITION || e2.code === C.UNIMPLEMENTED : !("undefined" != typeof DOMException && e2 instanceof DOMException) || // When the browser is out of quota we could get either quota exceeded
        // or an aborted error depending on whether the error happened during
        // schema migration.
        22 === e2.code || 20 === e2.code || // Firefox Private Browsing mode disables IndexedDb and returns
        // INVALID_STATE for any usage.
        11 === e2.code;
      }(n2)) throw n2;
      __PRIVATE_logWarn("Error using user provided cache. Falling back to memory cache: " + n2), await __PRIVATE_setOfflineComponentProvider(e, new __PRIVATE_MemoryOfflineComponentProvider());
    }
  } else __PRIVATE_logDebug(Yt$1, "Using default OfflineComponentProvider"), await __PRIVATE_setOfflineComponentProvider(e, new __PRIVATE_LruGcMemoryOfflineComponentProvider(void 0));
  return e._offlineComponents;
}
async function __PRIVATE_ensureOnlineComponents(e) {
  return e._onlineComponents || (e._uninitializedComponentsProvider ? (__PRIVATE_logDebug(Yt$1, "Using user provided OnlineComponentProvider"), await __PRIVATE_setOnlineComponentProvider(e, e._uninitializedComponentsProvider._online)) : (__PRIVATE_logDebug(Yt$1, "Using default OnlineComponentProvider"), await __PRIVATE_setOnlineComponentProvider(e, new OnlineComponentProvider()))), e._onlineComponents;
}
function __PRIVATE_getSyncEngine(e) {
  return __PRIVATE_ensureOnlineComponents(e).then((e2) => e2.syncEngine);
}
function __PRIVATE_getDatastore$1(e) {
  return __PRIVATE_ensureOnlineComponents(e).then((e2) => e2.datastore);
}
async function __PRIVATE_getEventManager(e) {
  const t2 = await __PRIVATE_ensureOnlineComponents(e), n2 = t2.eventManager;
  return n2.onListen = __PRIVATE_syncEngineListen.bind(null, t2.syncEngine), n2.onUnlisten = __PRIVATE_syncEngineUnlisten.bind(null, t2.syncEngine), n2.onFirstRemoteStoreListen = __PRIVATE_triggerRemoteStoreListen.bind(null, t2.syncEngine), n2.onLastRemoteStoreUnlisten = __PRIVATE_triggerRemoteStoreUnlisten.bind(null, t2.syncEngine), n2;
}
function __PRIVATE_firestoreClientGetDocumentViaSnapshotListener(e, t2, n2 = {}) {
  const r2 = new __PRIVATE_Deferred();
  return e.asyncQueue.enqueueAndForget(async () => function __PRIVATE_readDocumentViaSnapshotListener(e2, t3, n3, r3, i) {
    const s = new __PRIVATE_AsyncObserver({
      next: (_) => {
        s.Nu(), t3.enqueueAndForget(() => __PRIVATE_eventManagerUnlisten(e2, o));
        const a = _.docs.has(n3);
        !a && _.fromCache ? (
          // TODO(dimond): If we're online and the document doesn't
          // exist then we resolve with a doc.exists set to false. If
          // we're offline however, we reject the Promise in this
          // case. Two options: 1) Cache the negative response from
          // the server so we can deliver that even when you're
          // offline 2) Actually reject the Promise in the online case
          // if the document doesn't exist.
          i.reject(new FirestoreError(C.UNAVAILABLE, "Failed to get document because the client is offline."))
        ) : a && _.fromCache && r3 && "server" === r3.source ? i.reject(new FirestoreError(C.UNAVAILABLE, 'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')) : i.resolve(_);
      },
      error: (e3) => i.reject(e3)
    }), o = new __PRIVATE_QueryListener(__PRIVATE_newQueryForPath(n3.path), s, {
      includeMetadataChanges: true,
      Ka: true
    });
    return __PRIVATE_eventManagerListen(e2, o);
  }(await __PRIVATE_getEventManager(e), e.asyncQueue, t2, n2, r2)), r2.promise;
}
function __PRIVATE_firestoreClientGetDocumentsViaSnapshotListener(e, t2, n2 = {}) {
  const r2 = new __PRIVATE_Deferred();
  return e.asyncQueue.enqueueAndForget(async () => function __PRIVATE_executeQueryViaSnapshotListener(e2, t3, n3, r3, i) {
    const s = new __PRIVATE_AsyncObserver({
      next: (n4) => {
        s.Nu(), t3.enqueueAndForget(() => __PRIVATE_eventManagerUnlisten(e2, o)), n4.fromCache && "server" === r3.source ? i.reject(new FirestoreError(C.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : i.resolve(n4);
      },
      error: (e3) => i.reject(e3)
    }), o = new __PRIVATE_QueryListener(n3, s, {
      includeMetadataChanges: true,
      Ka: true
    });
    return __PRIVATE_eventManagerListen(e2, o);
  }(await __PRIVATE_getEventManager(e), e.asyncQueue, t2, n2, r2)), r2.promise;
}
function __PRIVATE_firestoreClientWrite(e, t2) {
  const n2 = new __PRIVATE_Deferred();
  return e.asyncQueue.enqueueAndForget(async () => __PRIVATE_syncEngineWrite(await __PRIVATE_getSyncEngine(e), t2, n2)), n2.promise;
}
function __PRIVATE_firestoreClientTransaction(e, t2, n2) {
  const r2 = new __PRIVATE_Deferred();
  return e.asyncQueue.enqueueAndForget(async () => {
    const i = await __PRIVATE_getDatastore$1(e);
    new __PRIVATE_TransactionRunner(e.asyncQueue, i, n2, t2, r2).ju();
  }), r2.promise;
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function __PRIVATE_cloneLongPollingOptions(e) {
  const t2 = {};
  return void 0 !== e.timeoutSeconds && (t2.timeoutSeconds = e.timeoutSeconds), t2;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const en = "ComponentProvider", tn = /* @__PURE__ */ new Map();
function __PRIVATE_makeDatabaseInfo(e, t2, n2, r2, i) {
  return new DatabaseInfo(e, t2, n2, i.host, i.ssl, i.experimentalForceLongPolling, i.experimentalAutoDetectLongPolling, __PRIVATE_cloneLongPollingOptions(i.experimentalLongPollingOptions), i.useFetchStreams, i.isUsingEmulator, r2);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const nn = "firestore.googleapis.com", rn = true;
class FirestoreSettingsImpl {
  constructor(e) {
    if (void 0 === e.host) {
      if (void 0 !== e.ssl) throw new FirestoreError(C.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
      this.host = nn, this.ssl = rn;
    } else this.host = e.host, this.ssl = e.ssl ?? rn;
    if (this.isUsingEmulator = void 0 !== e.emulatorOptions, this.credentials = e.credentials, this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties, this.localCache = e.localCache, void 0 === e.cacheSizeBytes) this.cacheSizeBytes = Dt;
    else {
      if (-1 !== e.cacheSizeBytes && e.cacheSizeBytes < vt) throw new FirestoreError(C.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
      this.cacheSizeBytes = e.cacheSizeBytes;
    }
    __PRIVATE_validateIsNotUsedTogether("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling), this.experimentalForceLongPolling = !!e.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = false : void 0 === e.experimentalAutoDetectLongPolling ? this.experimentalAutoDetectLongPolling = true : (
      // For backwards compatibility, coerce the value to boolean even though
      // the TypeScript compiler has narrowed the type to boolean already.
      // noinspection PointlessBooleanExpressionJS
      this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling
    ), this.experimentalLongPollingOptions = __PRIVATE_cloneLongPollingOptions(e.experimentalLongPollingOptions ?? {}), function __PRIVATE_validateLongPollingOptions(e2) {
      if (void 0 !== e2.timeoutSeconds) {
        if (isNaN(e2.timeoutSeconds)) throw new FirestoreError(C.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (must not be NaN)`);
        if (e2.timeoutSeconds < 5) throw new FirestoreError(C.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (minimum allowed value is 5)`);
        if (e2.timeoutSeconds > 30) throw new FirestoreError(C.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (maximum allowed value is 30)`);
      }
    }(this.experimentalLongPollingOptions), this.useFetchStreams = !!e.useFetchStreams;
  }
  isEqual(e) {
    return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && function __PRIVATE_longPollingOptionsEqual(e2, t2) {
      return e2.timeoutSeconds === t2.timeoutSeconds;
    }(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams;
  }
}
class Firestore$1 {
  /** @hideconstructor */
  constructor(e, t2, n2, r2) {
    this._authCredentials = e, this._appCheckCredentials = t2, this._databaseId = n2, this._app = r2, /**
     * Whether it's a Firestore or Firestore Lite instance.
     */
    this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new FirestoreSettingsImpl({}), this._settingsFrozen = false, this._emulatorOptions = {}, // A task that is assigned when the terminate() is invoked and resolved when
    // all components have shut down. Otherwise, Firestore is not terminated,
    // which can mean either the FirestoreClient is in the process of starting,
    // or restarting.
    this._terminateTask = "notTerminated";
  }
  /**
   * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
   * instance.
   */
  get app() {
    if (!this._app) throw new FirestoreError(C.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
    return this._app;
  }
  get _initialized() {
    return this._settingsFrozen;
  }
  get _terminated() {
    return "notTerminated" !== this._terminateTask;
  }
  _setSettings(e) {
    if (this._settingsFrozen) throw new FirestoreError(C.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
    this._settings = new FirestoreSettingsImpl(e), this._emulatorOptions = e.emulatorOptions || {}, void 0 !== e.credentials && (this._authCredentials = function __PRIVATE_makeAuthCredentialsProvider(e2) {
      if (!e2) return new __PRIVATE_EmptyAuthCredentialsProvider();
      switch (e2.type) {
        case "firstParty":
          return new __PRIVATE_FirstPartyAuthCredentialsProvider(e2.sessionIndex || "0", e2.iamToken || null, e2.authTokenFactory || null);
        case "provider":
          return e2.client;
        default:
          throw new FirestoreError(C.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
      }
    }(e.credentials));
  }
  _getSettings() {
    return this._settings;
  }
  _getEmulatorOptions() {
    return this._emulatorOptions;
  }
  _freezeSettings() {
    return this._settingsFrozen = true, this._settings;
  }
  _delete() {
    return "notTerminated" === this._terminateTask && (this._terminateTask = this._terminate()), this._terminateTask;
  }
  async _restart() {
    "notTerminated" === this._terminateTask ? await this._terminate() : this._terminateTask = "notTerminated";
  }
  /** Returns a JSON-serializable representation of this `Firestore` instance. */
  toJSON() {
    return {
      app: this._app,
      databaseId: this._databaseId,
      settings: this._settings
    };
  }
  /**
   * Terminates all components used by this client. Subclasses can override
   * this method to clean up their own dependencies, but must also call this
   * method.
   *
   * Only ever called once.
   */
  _terminate() {
    return function __PRIVATE_removeComponents(e) {
      const t2 = tn.get(e);
      t2 && (__PRIVATE_logDebug(en, "Removing Datastore"), tn.delete(e), t2.terminate());
    }(this), Promise.resolve();
  }
}
function connectFirestoreEmulator(e, t2, n2, r2 = {}) {
  var _a;
  e = __PRIVATE_cast(e, Firestore$1);
  const i = isCloudWorkstation(t2), s = e._getSettings(), o = {
    ...s,
    emulatorOptions: e._getEmulatorOptions()
  }, _ = `${t2}:${n2}`;
  i && (pingServer(`https://${_}`), updateEmulatorBanner("Firestore", true)), s.host !== nn && s.host !== _ && __PRIVATE_logWarn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");
  const a = {
    ...s,
    host: _,
    ssl: i,
    emulatorOptions: r2
  };
  if (!deepEqual(a, o) && (e._setSettings(a), r2.mockUserToken)) {
    let t3, n3;
    if ("string" == typeof r2.mockUserToken) t3 = r2.mockUserToken, n3 = User.MOCK_USER;
    else {
      t3 = createMockUserToken(r2.mockUserToken, (_a = e._app) == null ? void 0 : _a.options.projectId);
      const i2 = r2.mockUserToken.sub || r2.mockUserToken.user_id;
      if (!i2) throw new FirestoreError(C.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
      n3 = new User(i2);
    }
    e._authCredentials = new __PRIVATE_EmulatorAuthCredentialsProvider(new __PRIVATE_OAuthToken(t3, n3));
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Query {
  // This is the lite version of the Query class in the main SDK.
  /** @hideconstructor protected */
  constructor(e, t2, n2) {
    this.converter = t2, this._query = n2, /** The type of this Firestore reference. */
    this.type = "query", this.firestore = e;
  }
  withConverter(e) {
    return new Query(this.firestore, e, this._query);
  }
}
class DocumentReference {
  /** @hideconstructor */
  constructor(e, t2, n2) {
    this.converter = t2, this._key = n2, /** The type of this Firestore reference. */
    this.type = "document", this.firestore = e;
  }
  get _path() {
    return this._key.path;
  }
  /**
   * The document's identifier within its collection.
   */
  get id() {
    return this._key.path.lastSegment();
  }
  /**
   * A string representing the path of the referenced document (relative
   * to the root of the database).
   */
  get path() {
    return this._key.path.canonicalString();
  }
  /**
   * The collection this `DocumentReference` belongs to.
   */
  get parent() {
    return new CollectionReference(this.firestore, this.converter, this._key.path.popLast());
  }
  withConverter(e) {
    return new DocumentReference(this.firestore, e, this._key);
  }
  /**
   * Returns a JSON-serializable representation of this `DocumentReference` instance.
   *
   * @returns a JSON representation of this object.
   */
  toJSON() {
    return {
      type: DocumentReference._jsonSchemaVersion,
      referencePath: this._key.toString()
    };
  }
  static fromJSON(e, t2, n2) {
    if (__PRIVATE_validateJSON(t2, DocumentReference._jsonSchema)) return new DocumentReference(e, n2 || null, new DocumentKey(ResourcePath.fromString(t2.referencePath)));
  }
}
DocumentReference._jsonSchemaVersion = "firestore/documentReference/1.0", DocumentReference._jsonSchema = {
  type: property("string", DocumentReference._jsonSchemaVersion),
  referencePath: property("string")
};
class CollectionReference extends Query {
  /** @hideconstructor */
  constructor(e, t2, n2) {
    super(e, t2, __PRIVATE_newQueryForPath(n2)), this._path = n2, /** The type of this Firestore reference. */
    this.type = "collection";
  }
  /** The collection's identifier. */
  get id() {
    return this._query.path.lastSegment();
  }
  /**
   * A string representing the path of the referenced collection (relative
   * to the root of the database).
   */
  get path() {
    return this._query.path.canonicalString();
  }
  /**
   * A reference to the containing `DocumentReference` if this is a
   * subcollection. If this isn't a subcollection, the reference is null.
   */
  get parent() {
    const e = this._path.popLast();
    return e.isEmpty() ? null : new DocumentReference(
      this.firestore,
      /* converter= */
      null,
      new DocumentKey(e)
    );
  }
  withConverter(e) {
    return new CollectionReference(this.firestore, e, this._path);
  }
}
function collection(e, t2, ...n2) {
  if (e = getModularInstance(e), __PRIVATE_validateNonEmptyArgument("collection", "path", t2), e instanceof Firestore$1) {
    const r2 = ResourcePath.fromString(t2, ...n2);
    return __PRIVATE_validateCollectionPath(r2), new CollectionReference(
      e,
      /* converter= */
      null,
      r2
    );
  }
  {
    if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new FirestoreError(C.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const r2 = e._path.child(ResourcePath.fromString(t2, ...n2));
    return __PRIVATE_validateCollectionPath(r2), new CollectionReference(
      e.firestore,
      /* converter= */
      null,
      r2
    );
  }
}
function doc(e, t2, ...n2) {
  if (e = getModularInstance(e), // We allow omission of 'pathString' but explicitly prohibit passing in both
  // 'undefined' and 'null'.
  1 === arguments.length && (t2 = __PRIVATE_AutoId.newId()), __PRIVATE_validateNonEmptyArgument("doc", "path", t2), e instanceof Firestore$1) {
    const r2 = ResourcePath.fromString(t2, ...n2);
    return __PRIVATE_validateDocumentPath(r2), new DocumentReference(
      e,
      /* converter= */
      null,
      new DocumentKey(r2)
    );
  }
  {
    if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new FirestoreError(C.INVALID_ARGUMENT, "Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const r2 = e._path.child(ResourcePath.fromString(t2, ...n2));
    return __PRIVATE_validateDocumentPath(r2), new DocumentReference(e.firestore, e instanceof CollectionReference ? e.converter : null, new DocumentKey(r2));
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const sn = "AsyncQueue";
class __PRIVATE_AsyncQueueImpl {
  constructor(e = Promise.resolve()) {
    this.Yu = [], // Is this AsyncQueue being shut down? Once it is set to true, it will not
    // be changed again.
    this.ec = false, // Operations scheduled to be queued in the future. Operations are
    // automatically removed after they are run or canceled.
    this.tc = [], // visible for testing
    this.nc = null, // Flag set while there's an outstanding AsyncQueue operation, used for
    // assertion sanity-checks.
    this.rc = false, // Enabled during shutdown on Safari to prevent future access to IndexedDB.
    this.sc = false, // List of TimerIds to fast-forward delays for.
    this.oc = [], // Backoff timer used to schedule retries for retryable operations
    this.M_ = new __PRIVATE_ExponentialBackoff(
      this,
      "async_queue_retry"
      /* TimerId.AsyncQueueRetry */
    ), // Visibility handler that triggers an immediate retry of all retryable
    // operations. Meant to speed up recovery when we regain file system access
    // after page comes into foreground.
    this._c = () => {
      const e2 = getDocument();
      e2 && __PRIVATE_logDebug(sn, "Visibility state changed to " + e2.visibilityState), this.M_.w_();
    }, this.ac = e;
    const t2 = getDocument();
    t2 && "function" == typeof t2.addEventListener && t2.addEventListener("visibilitychange", this._c);
  }
  get isShuttingDown() {
    return this.ec;
  }
  /**
   * Adds a new operation to the queue without waiting for it to complete (i.e.
   * we ignore the Promise result).
   */
  enqueueAndForget(e) {
    this.enqueue(e);
  }
  enqueueAndForgetEvenWhileRestricted(e) {
    this.uc(), // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.cc(e);
  }
  enterRestrictedMode(e) {
    if (!this.ec) {
      this.ec = true, this.sc = e || false;
      const t2 = getDocument();
      t2 && "function" == typeof t2.removeEventListener && t2.removeEventListener("visibilitychange", this._c);
    }
  }
  enqueue(e) {
    if (this.uc(), this.ec)
      return new Promise(() => {
      });
    const t2 = new __PRIVATE_Deferred();
    return this.cc(() => this.ec && this.sc ? Promise.resolve() : (e().then(t2.resolve, t2.reject), t2.promise)).then(() => t2.promise);
  }
  enqueueRetryable(e) {
    this.enqueueAndForget(() => (this.Yu.push(e), this.lc()));
  }
  /**
   * Runs the next operation from the retryable queue. If the operation fails,
   * reschedules with backoff.
   */
  async lc() {
    if (0 !== this.Yu.length) {
      try {
        await this.Yu[0](), this.Yu.shift(), this.M_.reset();
      } catch (e) {
        if (!__PRIVATE_isIndexedDbTransactionError(e)) throw e;
        __PRIVATE_logDebug(sn, "Operation failed with retryable error: " + e);
      }
      this.Yu.length > 0 && // If there are additional operations, we re-schedule `retryNextOp()`.
      // This is necessary to run retryable operations that failed during
      // their initial attempt since we don't know whether they are already
      // enqueued. If, for example, `op1`, `op2`, `op3` are enqueued and `op1`
      // needs to  be re-run, we will run `op1`, `op1`, `op2` using the
      // already enqueued calls to `retryNextOp()`. `op3()` will then run in the
      // call scheduled here.
      // Since `backoffAndRun()` cancels an existing backoff and schedules a
      // new backoff on every call, there is only ever a single additional
      // operation in the queue.
      this.M_.p_(() => this.lc());
    }
  }
  cc(e) {
    const t2 = this.ac.then(() => (this.rc = true, e().catch((e2) => {
      this.nc = e2, this.rc = false;
      throw __PRIVATE_logError("INTERNAL UNHANDLED ERROR: ", __PRIVATE_getMessageOrStack(e2)), e2;
    }).then((e2) => (this.rc = false, e2))));
    return this.ac = t2, t2;
  }
  enqueueAfterDelay(e, t2, n2) {
    this.uc(), // Fast-forward delays for timerIds that have been overridden.
    this.oc.indexOf(e) > -1 && (t2 = 0);
    const r2 = DelayedOperation.createAndSchedule(this, e, t2, n2, (e2) => this.hc(e2));
    return this.tc.push(r2), r2;
  }
  uc() {
    this.nc && fail(47125, {
      Pc: __PRIVATE_getMessageOrStack(this.nc)
    });
  }
  verifyOperationInProgress() {
  }
  /**
   * Waits until all currently queued tasks are finished executing. Delayed
   * operations are not run.
   */
  async Tc() {
    let e;
    do {
      e = this.ac, await e;
    } while (e !== this.ac);
  }
  /**
   * For Tests: Determine if a delayed operation with a particular TimerId
   * exists.
   */
  Ic(e) {
    for (const t2 of this.tc) if (t2.timerId === e) return true;
    return false;
  }
  /**
   * For Tests: Runs some or all delayed operations early.
   *
   * @param lastTimerId - Delayed operations up to and including this TimerId
   * will be drained. Pass TimerId.All to run all delayed operations.
   * @returns a Promise that resolves once all operations have been run.
   */
  Ec(e) {
    return this.Tc().then(() => {
      this.tc.sort((e2, t2) => e2.targetTimeMs - t2.targetTimeMs);
      for (const t2 of this.tc) if (t2.skipDelay(), "all" !== e && t2.timerId === e) break;
      return this.Tc();
    });
  }
  /**
   * For Tests: Skip all subsequent delays for a timer id.
   */
  Rc(e) {
    this.oc.push(e);
  }
  /** Called once a DelayedOperation is run or canceled. */
  hc(e) {
    const t2 = this.tc.indexOf(e);
    this.tc.splice(t2, 1);
  }
}
function __PRIVATE_getMessageOrStack(e) {
  let t2 = e.message || "";
  return e.stack && (t2 = e.stack.includes(e.message) ? e.stack : e.message + "\n" + e.stack), t2;
}
class Firestore extends Firestore$1 {
  /** @hideconstructor */
  constructor(e, t2, n2, r2) {
    super(e, t2, n2, r2), /**
     * Whether it's a {@link Firestore} or Firestore Lite instance.
     */
    this.type = "firestore", this._queue = new __PRIVATE_AsyncQueueImpl(), this._persistenceKey = (r2 == null ? void 0 : r2.name) || "[DEFAULT]";
  }
  async _terminate() {
    if (this._firestoreClient) {
      const e = this._firestoreClient.terminate();
      this._queue = new __PRIVATE_AsyncQueueImpl(e), this._firestoreClient = void 0, await e;
    }
  }
}
function getFirestore(e, n2) {
  const r2 = "object" == typeof e ? e : getApp(), i = "string" == typeof e ? e : st, s = _getProvider(r2, "firestore").getImmediate({
    identifier: i
  });
  if (!s._initialized) {
    const e2 = getDefaultEmulatorHostnameAndPort("firestore");
    e2 && connectFirestoreEmulator(s, ...e2);
  }
  return s;
}
function ensureFirestoreConfigured(e) {
  if (e._terminated) throw new FirestoreError(C.FAILED_PRECONDITION, "The client has already been terminated.");
  return e._firestoreClient || __PRIVATE_configureFirestore(e), e._firestoreClient;
}
function __PRIVATE_configureFirestore(e) {
  var _a, _b, _c, _d;
  const t2 = e._freezeSettings(), n2 = __PRIVATE_makeDatabaseInfo(e._databaseId, ((_a = e._app) == null ? void 0 : _a.options.appId) || "", e._persistenceKey, (_b = e._app) == null ? void 0 : _b.options.apiKey, t2);
  e._componentsProvider || ((_c = t2.localCache) == null ? void 0 : _c._offlineComponentProvider) && ((_d = t2.localCache) == null ? void 0 : _d._onlineComponentProvider) && (e._componentsProvider = {
    _offline: t2.localCache._offlineComponentProvider,
    _online: t2.localCache._onlineComponentProvider
  }), e._firestoreClient = new FirestoreClient(e._authCredentials, e._appCheckCredentials, e._queue, n2, e._componentsProvider && function __PRIVATE_buildComponentProvider(e2) {
    const t3 = e2 == null ? void 0 : e2._online.build();
    return {
      _offline: e2 == null ? void 0 : e2._offline.build(t3),
      _online: t3
    };
  }(e._componentsProvider));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Bytes {
  /** @hideconstructor */
  constructor(e) {
    this._byteString = e;
  }
  /**
   * Creates a new `Bytes` object from the given Base64 string, converting it to
   * bytes.
   *
   * @param base64 - The Base64 string used to create the `Bytes` object.
   */
  static fromBase64String(e) {
    try {
      return new Bytes(ByteString.fromBase64String(e));
    } catch (e2) {
      throw new FirestoreError(C.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + e2);
    }
  }
  /**
   * Creates a new `Bytes` object from the given Uint8Array.
   *
   * @param array - The Uint8Array used to create the `Bytes` object.
   */
  static fromUint8Array(e) {
    return new Bytes(ByteString.fromUint8Array(e));
  }
  /**
   * Returns the underlying bytes as a Base64-encoded string.
   *
   * @returns The Base64-encoded string created from the `Bytes` object.
   */
  toBase64() {
    return this._byteString.toBase64();
  }
  /**
   * Returns the underlying bytes in a new `Uint8Array`.
   *
   * @returns The Uint8Array created from the `Bytes` object.
   */
  toUint8Array() {
    return this._byteString.toUint8Array();
  }
  /**
   * Returns a string representation of the `Bytes` object.
   *
   * @returns A string representation of the `Bytes` object.
   */
  toString() {
    return "Bytes(base64: " + this.toBase64() + ")";
  }
  /**
   * Returns true if this `Bytes` object is equal to the provided one.
   *
   * @param other - The `Bytes` object to compare against.
   * @returns true if this `Bytes` object is equal to the provided one.
   */
  isEqual(e) {
    return this._byteString.isEqual(e._byteString);
  }
  /**
   * Returns a JSON-serializable representation of this `Bytes` instance.
   *
   * @returns a JSON representation of this object.
   */
  toJSON() {
    return {
      type: Bytes._jsonSchemaVersion,
      bytes: this.toBase64()
    };
  }
  /**
   * Builds a `Bytes` instance from a JSON object created by {@link Bytes.toJSON}.
   *
   * @param json - a JSON object represention of a `Bytes` instance
   * @returns an instance of {@link Bytes} if the JSON object could be parsed. Throws a
   * {@link FirestoreError} if an error occurs.
   */
  static fromJSON(e) {
    if (__PRIVATE_validateJSON(e, Bytes._jsonSchema)) return Bytes.fromBase64String(e.bytes);
  }
}
Bytes._jsonSchemaVersion = "firestore/bytes/1.0", Bytes._jsonSchema = {
  type: property("string", Bytes._jsonSchemaVersion),
  bytes: property("string")
};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class FieldPath {
  /**
   * Creates a `FieldPath` from the provided field names. If more than one field
   * name is provided, the path will point to a nested field in a document.
   *
   * @param fieldNames - A list of field names.
   */
  constructor(...e) {
    for (let t2 = 0; t2 < e.length; ++t2) if (0 === e[t2].length) throw new FirestoreError(C.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
    this._internalPath = new FieldPath$1(e);
  }
  /**
   * Returns true if this `FieldPath` is equal to the provided one.
   *
   * @param other - The `FieldPath` to compare against.
   * @returns true if this `FieldPath` is equal to the provided one.
   */
  isEqual(e) {
    return this._internalPath.isEqual(e._internalPath);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class FieldValue {
  /**
   * @param _methodName - The public API endpoint that returns this class.
   * @hideconstructor
   */
  constructor(e) {
    this._methodName = e;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class GeoPoint {
  /**
   * Creates a new immutable `GeoPoint` object with the provided latitude and
   * longitude values.
   * @param latitude - The latitude as number between -90 and 90.
   * @param longitude - The longitude as number between -180 and 180.
   */
  constructor(e, t2) {
    if (!isFinite(e) || e < -90 || e > 90) throw new FirestoreError(C.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + e);
    if (!isFinite(t2) || t2 < -180 || t2 > 180) throw new FirestoreError(C.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + t2);
    this._lat = e, this._long = t2;
  }
  /**
   * The latitude of this `GeoPoint` instance.
   */
  get latitude() {
    return this._lat;
  }
  /**
   * The longitude of this `GeoPoint` instance.
   */
  get longitude() {
    return this._long;
  }
  /**
   * Returns true if this `GeoPoint` is equal to the provided one.
   *
   * @param other - The `GeoPoint` to compare against.
   * @returns true if this `GeoPoint` is equal to the provided one.
   */
  isEqual(e) {
    return this._lat === e._lat && this._long === e._long;
  }
  /**
   * Actually private to JS consumers of our API, so this function is prefixed
   * with an underscore.
   */
  _compareTo(e) {
    return __PRIVATE_primitiveComparator(this._lat, e._lat) || __PRIVATE_primitiveComparator(this._long, e._long);
  }
  /**
   * Returns a JSON-serializable representation of this `GeoPoint` instance.
   *
   * @returns a JSON representation of this object.
   */
  toJSON() {
    return {
      latitude: this._lat,
      longitude: this._long,
      type: GeoPoint._jsonSchemaVersion
    };
  }
  /**
   * Builds a `GeoPoint` instance from a JSON object created by {@link GeoPoint.toJSON}.
   *
   * @param json - a JSON object represention of a `GeoPoint` instance
   * @returns an instance of {@link GeoPoint} if the JSON object could be parsed. Throws a
   * {@link FirestoreError} if an error occurs.
   */
  static fromJSON(e) {
    if (__PRIVATE_validateJSON(e, GeoPoint._jsonSchema)) return new GeoPoint(e.latitude, e.longitude);
  }
}
GeoPoint._jsonSchemaVersion = "firestore/geoPoint/1.0", GeoPoint._jsonSchema = {
  type: property("string", GeoPoint._jsonSchemaVersion),
  latitude: property("number"),
  longitude: property("number")
};
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class VectorValue {
  /**
   * @private
   * @internal
   */
  constructor(e) {
    this._values = (e || []).map((e2) => e2);
  }
  /**
   * Returns a copy of the raw number array form of the vector.
   */
  toArray() {
    return this._values.map((e) => e);
  }
  /**
   * Returns `true` if the two `VectorValue` values have the same raw number arrays, returns `false` otherwise.
   */
  isEqual(e) {
    return function __PRIVATE_isPrimitiveArrayEqual(e2, t2) {
      if (e2.length !== t2.length) return false;
      for (let n2 = 0; n2 < e2.length; ++n2) if (e2[n2] !== t2[n2]) return false;
      return true;
    }(this._values, e._values);
  }
  /**
   * Returns a JSON-serializable representation of this `VectorValue` instance.
   *
   * @returns a JSON representation of this object.
   */
  toJSON() {
    return {
      type: VectorValue._jsonSchemaVersion,
      vectorValues: this._values
    };
  }
  /**
   * Builds a `VectorValue` instance from a JSON object created by {@link VectorValue.toJSON}.
   *
   * @param json - a JSON object represention of a `VectorValue` instance.
   * @returns an instance of {@link VectorValue} if the JSON object could be parsed. Throws a
   * {@link FirestoreError} if an error occurs.
   */
  static fromJSON(e) {
    if (__PRIVATE_validateJSON(e, VectorValue._jsonSchema)) {
      if (Array.isArray(e.vectorValues) && e.vectorValues.every((e2) => "number" == typeof e2)) return new VectorValue(e.vectorValues);
      throw new FirestoreError(C.INVALID_ARGUMENT, "Expected 'vectorValues' field to be a number array");
    }
  }
}
VectorValue._jsonSchemaVersion = "firestore/vectorValue/1.0", VectorValue._jsonSchema = {
  type: property("string", VectorValue._jsonSchemaVersion),
  vectorValues: property("object")
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const _n = /^__.*__$/;
class ParsedSetData {
  constructor(e, t2, n2) {
    this.data = e, this.fieldMask = t2, this.fieldTransforms = n2;
  }
  toMutation(e, t2) {
    return null !== this.fieldMask ? new __PRIVATE_PatchMutation(e, this.data, this.fieldMask, t2, this.fieldTransforms) : new __PRIVATE_SetMutation(e, this.data, t2, this.fieldTransforms);
  }
}
class ParsedUpdateData {
  constructor(e, t2, n2) {
    this.data = e, this.fieldMask = t2, this.fieldTransforms = n2;
  }
  toMutation(e, t2) {
    return new __PRIVATE_PatchMutation(e, this.data, this.fieldMask, t2, this.fieldTransforms);
  }
}
function __PRIVATE_isWrite(e) {
  switch (e) {
    case 0:
    case 2:
    case 1:
      return true;
    case 3:
    case 4:
      return false;
    default:
      throw fail(40011, {
        dataSource: e
      });
  }
}
class ParseContextImpl {
  /**
   * Initializes a ParseContext with the given source and path.
   *
   * @param settings - The settings for the parser.
   * @param databaseId - The database ID of the Firestore instance.
   * @param serializer - The serializer to use to generate the Value proto.
   * @param ignoreUndefinedProperties - Whether to ignore undefined properties
   * rather than throw.
   * @param fieldTransforms - A mutable list of field transforms encountered
   * while parsing the data.
   * @param fieldMask - A mutable list of field paths encountered while parsing
   * the data.
   *
   * TODO(b/34871131): We don't support array paths right now, so path can be
   * null to indicate the context represents any location within an array (in
   * which case certain features will not work and errors will be somewhat
   * compromised).
   */
  constructor(e, t2, n2, r2, i, s) {
    this.settings = e, this.databaseId = t2, this.serializer = n2, this.ignoreUndefinedProperties = r2, // Minor hack: If fieldTransforms is undefined, we assume this is an
    // external call and we need to validate the entire path.
    void 0 === i && this.validatePath(), this.fieldTransforms = i || [], this.fieldMask = s || [];
  }
  get path() {
    return this.settings.path;
  }
  get dataSource() {
    return this.settings.dataSource;
  }
  /** Returns a new context with the specified settings overwritten. */
  contextWith(e) {
    return new ParseContextImpl({
      ...this.settings,
      ...e
    }, this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
  }
  childContextForField(e) {
    var _a;
    const t2 = (_a = this.path) == null ? void 0 : _a.child(e), n2 = this.contextWith({
      path: t2,
      arrayElement: false
    });
    return n2.validatePathSegment(e), n2;
  }
  childContextForFieldPath(e) {
    var _a;
    const t2 = (_a = this.path) == null ? void 0 : _a.child(e), n2 = this.contextWith({
      path: t2,
      arrayElement: false
    });
    return n2.validatePath(), n2;
  }
  childContextForArray(e) {
    return this.contextWith({
      path: void 0,
      arrayElement: true
    });
  }
  createError(e) {
    return createError(e, this.settings.methodName, this.settings.hasConverter || false, this.path, this.settings.targetDoc);
  }
  /** Returns 'true' if 'fieldPath' was traversed when creating this context. */
  contains(e) {
    return void 0 !== this.fieldMask.find((t2) => e.isPrefixOf(t2)) || void 0 !== this.fieldTransforms.find((t2) => e.isPrefixOf(t2.field));
  }
  validatePath() {
    if (this.path) for (let e = 0; e < this.path.length; e++) this.validatePathSegment(this.path.get(e));
  }
  validatePathSegment(e) {
    if (0 === e.length) throw this.createError("Document fields must not be empty");
    if (__PRIVATE_isWrite(this.dataSource) && _n.test(e)) throw this.createError('Document fields cannot begin and end with "__"');
  }
}
class UserDataReader {
  constructor(e, t2, n2) {
    this.databaseId = e, this.ignoreUndefinedProperties = t2, this.serializer = n2 || __PRIVATE_newSerializer(e);
  }
  /** Creates a new top-level parse context. */
  createContext(e, t2, n2, r2 = false) {
    return new ParseContextImpl({
      dataSource: e,
      methodName: t2,
      targetDoc: n2,
      path: FieldPath$1.emptyPath(),
      arrayElement: false,
      hasConverter: r2
    }, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
  }
}
function __PRIVATE_newUserDataReader(e) {
  const t2 = e._freezeSettings(), n2 = __PRIVATE_newSerializer(e._databaseId);
  return new UserDataReader(e._databaseId, !!t2.ignoreUndefinedProperties, n2);
}
function __PRIVATE_parseSetData(e, t2, n2, r2, i, s = {}) {
  const o = e.createContext(s.merge || s.mergeFields ? 2 : 0, t2, n2, i);
  __PRIVATE_validatePlainObject("Data must be an object, but it was:", o, r2);
  const _ = __PRIVATE_parseObject(r2, o);
  let a, u2;
  if (s.merge) a = new FieldMask(o.fieldMask), u2 = o.fieldTransforms;
  else if (s.mergeFields) {
    const e2 = [];
    for (const r3 of s.mergeFields) {
      const i2 = __PRIVATE_fieldPathFromArgument(t2, r3, n2);
      if (!o.contains(i2)) throw new FirestoreError(C.INVALID_ARGUMENT, `Field '${i2}' is specified in your field mask but missing from your input data.`);
      __PRIVATE_fieldMaskContains(e2, i2) || e2.push(i2);
    }
    a = new FieldMask(e2), u2 = o.fieldTransforms.filter((e3) => a.covers(e3.field));
  } else a = null, u2 = o.fieldTransforms;
  return new ParsedSetData(new ObjectValue(_), a, u2);
}
class __PRIVATE_DeleteFieldValueImpl extends FieldValue {
  _toFieldTransform(e) {
    if (2 !== e.dataSource) throw 1 === e.dataSource ? e.createError(`${this._methodName}() can only appear at the top level of your update data`) : e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
    return e.fieldMask.push(e.path), null;
  }
  isEqual(e) {
    return e instanceof __PRIVATE_DeleteFieldValueImpl;
  }
}
class __PRIVATE_NumericIncrementFieldValueImpl extends FieldValue {
  constructor(e, t2) {
    super(e), this.Vc = t2;
  }
  _toFieldTransform(e) {
    const t2 = new __PRIVATE_NumericIncrementTransformOperation(e.serializer, toNumber(e.serializer, this.Vc));
    return new FieldTransform(e.path, t2);
  }
  isEqual(e) {
    return e instanceof __PRIVATE_NumericIncrementFieldValueImpl && this.Vc === e.Vc;
  }
}
function __PRIVATE_parseUpdateData(e, t2, n2, r2) {
  const i = e.createContext(1, t2, n2);
  __PRIVATE_validatePlainObject("Data must be an object, but it was:", i, r2);
  const s = [], o = ObjectValue.empty();
  forEach(r2, (e2, r3) => {
    const _2 = __PRIVATE_fieldPathFromDotSeparatedString(t2, e2, n2);
    r3 = getModularInstance(r3);
    const a = i.childContextForFieldPath(_2);
    if (r3 instanceof __PRIVATE_DeleteFieldValueImpl)
      s.push(_2);
    else {
      const e3 = __PRIVATE_parseData(r3, a);
      null != e3 && (s.push(_2), o.set(_2, e3));
    }
  });
  const _ = new FieldMask(s);
  return new ParsedUpdateData(o, _, i.fieldTransforms);
}
function __PRIVATE_parseUpdateVarargs(e, t2, n2, r2, i, s) {
  const o = e.createContext(1, t2, n2), _ = [__PRIVATE_fieldPathFromArgument(t2, r2, n2)], a = [i];
  if (s.length % 2 != 0) throw new FirestoreError(C.INVALID_ARGUMENT, `Function ${t2}() needs to be called with an even number of arguments that alternate between field names and values.`);
  for (let e2 = 0; e2 < s.length; e2 += 2) _.push(__PRIVATE_fieldPathFromArgument(t2, s[e2])), a.push(s[e2 + 1]);
  const u2 = [], c = ObjectValue.empty();
  for (let e2 = _.length - 1; e2 >= 0; --e2) if (!__PRIVATE_fieldMaskContains(u2, _[e2])) {
    const t3 = _[e2];
    let n3 = a[e2];
    n3 = getModularInstance(n3);
    const r3 = o.childContextForFieldPath(t3);
    if (n3 instanceof __PRIVATE_DeleteFieldValueImpl)
      u2.push(t3);
    else {
      const e3 = __PRIVATE_parseData(n3, r3);
      null != e3 && (u2.push(t3), c.set(t3, e3));
    }
  }
  const l2 = new FieldMask(u2);
  return new ParsedUpdateData(c, l2, o.fieldTransforms);
}
function __PRIVATE_parseQueryValue(e, t2, n2, r2 = false) {
  return __PRIVATE_parseData(n2, e.createContext(r2 ? 4 : 3, t2));
}
function __PRIVATE_parseData(e, t2) {
  if (__PRIVATE_looksLikeJsonObject(
    // Unwrap the API type from the Compat SDK. This will return the API type
    // from firestore-exp.
    e = getModularInstance(e)
  )) return __PRIVATE_validatePlainObject("Unsupported field value:", t2, e), __PRIVATE_parseObject(e, t2);
  if (e instanceof FieldValue)
    return function __PRIVATE_parseSentinelFieldValue(e2, t3) {
      if (!__PRIVATE_isWrite(t3.dataSource)) throw t3.createError(`${e2._methodName}() can only be used with update() and set()`);
      if (!t3.path) throw t3.createError(`${e2._methodName}() is not currently supported inside arrays`);
      const n2 = e2._toFieldTransform(t3);
      n2 && t3.fieldTransforms.push(n2);
    }(e, t2), null;
  if (void 0 === e && t2.ignoreUndefinedProperties)
    return null;
  if (
    // If context.path is null we are inside an array and we don't support
    // field mask paths more granular than the top-level array.
    t2.path && t2.fieldMask.push(t2.path), e instanceof Array
  ) {
    if (t2.settings.arrayElement && 4 !== t2.dataSource) throw t2.createError("Nested arrays are not supported");
    return function __PRIVATE_parseArray(e2, t3) {
      const n2 = [];
      let r2 = 0;
      for (const i of e2) {
        let e3 = __PRIVATE_parseData(i, t3.childContextForArray(r2));
        null == e3 && // Just include nulls in the array for fields being replaced with a
        // sentinel.
        (e3 = {
          nullValue: "NULL_VALUE"
        }), n2.push(e3), r2++;
      }
      return {
        arrayValue: {
          values: n2
        }
      };
    }(e, t2);
  }
  return function __PRIVATE_parseScalarValue(e2, t3) {
    if (null === (e2 = getModularInstance(e2))) return {
      nullValue: "NULL_VALUE"
    };
    if ("number" == typeof e2) return toNumber(t3.serializer, e2);
    if ("boolean" == typeof e2) return {
      booleanValue: e2
    };
    if ("string" == typeof e2) return {
      stringValue: e2
    };
    if (e2 instanceof Date) {
      const n2 = Timestamp.fromDate(e2);
      return {
        timestampValue: toTimestamp(t3.serializer, n2)
      };
    }
    if (e2 instanceof Timestamp) {
      const n2 = new Timestamp(e2.seconds, 1e3 * Math.floor(e2.nanoseconds / 1e3));
      return {
        timestampValue: toTimestamp(t3.serializer, n2)
      };
    }
    if (e2 instanceof GeoPoint) return {
      geoPointValue: {
        latitude: e2.latitude,
        longitude: e2.longitude
      }
    };
    if (e2 instanceof Bytes) return {
      bytesValue: __PRIVATE_toBytes(t3.serializer, e2._byteString)
    };
    if (e2 instanceof DocumentReference) {
      const n2 = t3.databaseId, r2 = e2.firestore._databaseId;
      if (!r2.isEqual(n2)) throw t3.createError(`Document reference is for database ${r2.projectId}/${r2.database} but should be for database ${n2.projectId}/${n2.database}`);
      return {
        referenceValue: __PRIVATE_toResourceName(e2.firestore._databaseId || t3.databaseId, e2._key.path)
      };
    }
    if (e2 instanceof VectorValue)
      return function __PRIVATE_parseVectorValue(e3, t4) {
        const n2 = e3 instanceof VectorValue ? e3.toArray() : e3, r2 = {
          fields: {
            [ot]: {
              stringValue: ut
            },
            [ct]: {
              arrayValue: {
                values: n2.map((e4) => {
                  if ("number" != typeof e4) throw t4.createError("VectorValues must only contain numeric values.");
                  return __PRIVATE_toDouble(t4.serializer, e4);
                })
              }
            }
          }
        };
        return {
          mapValue: r2
        };
      }(e2, t3);
    if (__PRIVATE_isProtoValueSerializable(e2)) return e2._toProto(t3.serializer);
    throw t3.createError(`Unsupported field value: ${__PRIVATE_valueDescription(e2)}`);
  }(e, t2);
}
function __PRIVATE_parseObject(e, t2) {
  const n2 = {};
  return isEmpty(e) ? (
    // If we encounter an empty object, we explicitly add it to the update
    // mask to ensure that the server creates a map entry.
    t2.path && t2.path.length > 0 && t2.fieldMask.push(t2.path)
  ) : forEach(e, (e2, r2) => {
    const i = __PRIVATE_parseData(r2, t2.childContextForField(e2));
    null != i && (n2[e2] = i);
  }), {
    mapValue: {
      fields: n2
    }
  };
}
function __PRIVATE_looksLikeJsonObject(e) {
  return !("object" != typeof e || null === e || e instanceof Array || e instanceof Date || e instanceof Timestamp || e instanceof GeoPoint || e instanceof Bytes || e instanceof DocumentReference || e instanceof FieldValue || e instanceof VectorValue || __PRIVATE_isProtoValueSerializable(e));
}
function __PRIVATE_validatePlainObject(e, t2, n2) {
  if (!__PRIVATE_looksLikeJsonObject(n2) || !__PRIVATE_isPlainObject(n2)) {
    const r2 = __PRIVATE_valueDescription(n2);
    throw "an object" === r2 ? t2.createError(e + " a custom object") : t2.createError(e + " " + r2);
  }
}
function __PRIVATE_fieldPathFromArgument(e, t2, n2) {
  if (
    // If required, replace the FieldPath Compat class with the firestore-exp
    // FieldPath.
    (t2 = getModularInstance(t2)) instanceof FieldPath
  ) return t2._internalPath;
  if ("string" == typeof t2) return __PRIVATE_fieldPathFromDotSeparatedString(e, t2);
  throw createError(
    "Field path arguments must be of type string or ",
    e,
    /* hasConverter= */
    false,
    /* path= */
    void 0,
    n2
  );
}
const an = new RegExp("[~\\*/\\[\\]]");
function __PRIVATE_fieldPathFromDotSeparatedString(e, t2, n2) {
  if (t2.search(an) >= 0) throw createError(
    `Invalid field path (${t2}). Paths must not contain '~', '*', '/', '[', or ']'`,
    e,
    /* hasConverter= */
    false,
    /* path= */
    void 0,
    n2
  );
  try {
    return new FieldPath(...t2.split("."))._internalPath;
  } catch (r2) {
    throw createError(
      `Invalid field path (${t2}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,
      e,
      /* hasConverter= */
      false,
      /* path= */
      void 0,
      n2
    );
  }
}
function createError(e, t2, n2, r2, i) {
  const s = r2 && !r2.isEmpty(), o = void 0 !== i;
  let _ = `Function ${t2}() called with invalid data`;
  n2 && (_ += " (via `toFirestore()`)"), _ += ". ";
  let a = "";
  return (s || o) && (a += " (found", s && (a += ` in field ${r2}`), o && (a += ` in document ${i}`), a += ")"), new FirestoreError(C.INVALID_ARGUMENT, _ + e + a);
}
function __PRIVATE_fieldMaskContains(e, t2) {
  return e.some((e2) => e2.isEqual(t2));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class AbstractUserDataWriter {
  convertValue(e, t2 = "none") {
    switch (__PRIVATE_typeOrder(e)) {
      case 0:
        return null;
      case 1:
        return e.booleanValue;
      case 2:
        return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
      case 3:
        return this.convertTimestamp(e.timestampValue);
      case 4:
        return this.convertServerTimestamp(e, t2);
      case 5:
        return e.stringValue;
      case 6:
        return this.convertBytes(__PRIVATE_normalizeByteString(e.bytesValue));
      case 7:
        return this.convertReference(e.referenceValue);
      case 8:
        return this.convertGeoPoint(e.geoPointValue);
      case 9:
        return this.convertArray(e.arrayValue, t2);
      case 11:
        return this.convertObject(e.mapValue, t2);
      case 10:
        return this.convertVectorValue(e.mapValue);
      default:
        throw fail(62114, {
          value: e
        });
    }
  }
  convertObject(e, t2) {
    return this.convertObjectMap(e.fields, t2);
  }
  /**
   * @internal
   */
  convertObjectMap(e, t2 = "none") {
    const n2 = {};
    return forEach(e, (e2, r2) => {
      n2[e2] = this.convertValue(r2, t2);
    }), n2;
  }
  /**
   * @internal
   */
  convertVectorValue(e) {
    var _a, _b, _c;
    const t2 = (_c = (_b = (_a = e.fields) == null ? void 0 : _a[ct].arrayValue) == null ? void 0 : _b.values) == null ? void 0 : _c.map((e2) => __PRIVATE_normalizeNumber(e2.doubleValue));
    return new VectorValue(t2);
  }
  convertGeoPoint(e) {
    return new GeoPoint(__PRIVATE_normalizeNumber(e.latitude), __PRIVATE_normalizeNumber(e.longitude));
  }
  convertArray(e, t2) {
    return (e.values || []).map((e2) => this.convertValue(e2, t2));
  }
  convertServerTimestamp(e, t2) {
    switch (t2) {
      case "previous":
        const n2 = __PRIVATE_getPreviousValue(e);
        return null == n2 ? null : this.convertValue(n2, t2);
      case "estimate":
        return this.convertTimestamp(__PRIVATE_getLocalWriteTime(e));
      default:
        return null;
    }
  }
  convertTimestamp(e) {
    const t2 = __PRIVATE_normalizeTimestamp(e);
    return new Timestamp(t2.seconds, t2.nanos);
  }
  convertDocumentKey(e, t2) {
    const n2 = ResourcePath.fromString(e);
    __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(n2), 9688, {
      name: e
    });
    const r2 = new DatabaseId(n2.get(1), n2.get(3)), i = new DocumentKey(n2.popFirst(5));
    return r2.isEqual(t2) || // TODO(b/64130202): Somehow support foreign references.
    __PRIVATE_logError(`Document ${i} contains a document reference within a different database (${r2.projectId}/${r2.database}) which is not supported. It will be treated as a reference in the current database (${t2.projectId}/${t2.database}) instead.`), i;
  }
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class __PRIVATE_ExpUserDataWriter extends AbstractUserDataWriter {
  constructor(e) {
    super(), this.firestore = e;
  }
  convertBytes(e) {
    return new Bytes(e);
  }
  convertReference(e) {
    const t2 = this.convertDocumentKey(e, this.firestore._databaseId);
    return new DocumentReference(
      this.firestore,
      /* converter= */
      null,
      t2
    );
  }
}
function increment(e) {
  return new __PRIVATE_NumericIncrementFieldValueImpl("increment", e);
}
const Ut = "@firebase/firestore", Ht = "4.10.0";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class DocumentSnapshot$1 {
  // Note: This class is stripped down version of the DocumentSnapshot in
  // the legacy SDK. The changes are:
  // - No support for SnapshotMetadata.
  // - No support for SnapshotOptions.
  /** @hideconstructor protected */
  constructor(t2, e, n2, r2, s) {
    this._firestore = t2, this._userDataWriter = e, this._key = n2, this._document = r2, this._converter = s;
  }
  /** Property of the `DocumentSnapshot` that provides the document's ID. */
  get id() {
    return this._key.path.lastSegment();
  }
  /**
   * The `DocumentReference` for the document included in the `DocumentSnapshot`.
   */
  get ref() {
    return new DocumentReference(this._firestore, this._converter, this._key);
  }
  /**
   * Signals whether or not the document at the snapshot's location exists.
   *
   * @returns true if the document exists.
   */
  exists() {
    return null !== this._document;
  }
  /**
   * Retrieves all fields in the document as an `Object`. Returns `undefined` if
   * the document doesn't exist.
   *
   * @returns An `Object` containing all fields in the document or `undefined`
   * if the document doesn't exist.
   */
  data() {
    if (this._document) {
      if (this._converter) {
        const t2 = new QueryDocumentSnapshot$1(
          this._firestore,
          this._userDataWriter,
          this._key,
          this._document,
          /* converter= */
          null
        );
        return this._converter.fromFirestore(t2);
      }
      return this._userDataWriter.convertValue(this._document.data.value);
    }
  }
  /**
   * @internal
   * @private
   *
   * Retrieves all fields in the document as a proto Value. Returns `undefined` if
   * the document doesn't exist.
   *
   * @returns An `Object` containing all fields in the document or `undefined`
   * if the document doesn't exist.
   */
  _fieldsProto() {
    var _a;
    return ((_a = this._document) == null ? void 0 : _a.data.clone().value.mapValue.fields) ?? void 0;
  }
  /**
   * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
   * document or field doesn't exist.
   *
   * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
   * field.
   * @returns The data at the specified field location or undefined if no such
   * field exists in the document.
   */
  // We are using `any` here to avoid an explicit cast by our users.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(t2) {
    if (this._document) {
      const e = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", t2));
      if (null !== e) return this._userDataWriter.convertValue(e);
    }
  }
}
class QueryDocumentSnapshot$1 extends DocumentSnapshot$1 {
  /**
   * Retrieves all fields in the document as an `Object`.
   *
   * @override
   * @returns An `Object` containing all fields in the document.
   */
  data() {
    return super.data();
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function __PRIVATE_validateHasExplicitOrderByForLimitToLast(t2) {
  if ("L" === t2.limitType && 0 === t2.explicitOrderBy.length) throw new FirestoreError(C.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
}
class AppliableConstraint {
}
class QueryConstraint extends AppliableConstraint {
}
function query(t2, e, ...n2) {
  let r2 = [];
  e instanceof AppliableConstraint && r2.push(e), r2 = r2.concat(n2), function __PRIVATE_validateQueryConstraintArray(t3) {
    const e2 = t3.filter((t4) => t4 instanceof QueryCompositeFilterConstraint).length, n3 = t3.filter((t4) => t4 instanceof QueryFieldFilterConstraint).length;
    if (e2 > 1 || e2 > 0 && n3 > 0) throw new FirestoreError(C.INVALID_ARGUMENT, "InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.");
  }(r2);
  for (const e2 of r2) t2 = e2._apply(t2);
  return t2;
}
class QueryFieldFilterConstraint extends QueryConstraint {
  /**
   * @internal
   */
  constructor(t2, e, n2) {
    super(), this._field = t2, this._op = e, this._value = n2, /** The type of this query constraint */
    this.type = "where";
  }
  static _create(t2, e, n2) {
    return new QueryFieldFilterConstraint(t2, e, n2);
  }
  _apply(t2) {
    const e = this._parse(t2);
    return __PRIVATE_validateNewFieldFilter(t2._query, e), new Query(t2.firestore, t2.converter, __PRIVATE_queryWithAddedFilter(t2._query, e));
  }
  _parse(t2) {
    const e = __PRIVATE_newUserDataReader(t2.firestore), n2 = function __PRIVATE_newQueryFilter(t3, e2, n3, r2, s, a, o) {
      let i;
      if (s.isKeyField()) {
        if ("array-contains" === a || "array-contains-any" === a) throw new FirestoreError(C.INVALID_ARGUMENT, `Invalid Query. You can't perform '${a}' queries on documentId().`);
        if ("in" === a || "not-in" === a) {
          __PRIVATE_validateDisjunctiveFilterElements(o, a);
          const e3 = [];
          for (const n4 of o) e3.push(__PRIVATE_parseDocumentIdValue(r2, t3, n4));
          i = {
            arrayValue: {
              values: e3
            }
          };
        } else i = __PRIVATE_parseDocumentIdValue(r2, t3, o);
      } else "in" !== a && "not-in" !== a && "array-contains-any" !== a || __PRIVATE_validateDisjunctiveFilterElements(o, a), i = __PRIVATE_parseQueryValue(
        n3,
        e2,
        o,
        /* allowArrays= */
        "in" === a || "not-in" === a
      );
      const u2 = FieldFilter.create(s, a, i);
      return u2;
    }(t2._query, "where", e, t2.firestore._databaseId, this._field, this._op, this._value);
    return n2;
  }
}
function where(t2, e, n2) {
  const r2 = e, s = __PRIVATE_fieldPathFromArgument("where", t2);
  return QueryFieldFilterConstraint._create(s, r2, n2);
}
class QueryCompositeFilterConstraint extends AppliableConstraint {
  /**
   * @internal
   */
  constructor(t2, e) {
    super(), this.type = t2, this._queryConstraints = e;
  }
  static _create(t2, e) {
    return new QueryCompositeFilterConstraint(t2, e);
  }
  _parse(t2) {
    const e = this._queryConstraints.map((e2) => e2._parse(t2)).filter((t3) => t3.getFilters().length > 0);
    return 1 === e.length ? e[0] : CompositeFilter.create(e, this._getOperator());
  }
  _apply(t2) {
    const e = this._parse(t2);
    return 0 === e.getFilters().length ? t2 : (function __PRIVATE_validateNewFilter(t3, e2) {
      let n2 = t3;
      const r2 = e2.getFlattenedFilters();
      for (const t4 of r2) __PRIVATE_validateNewFieldFilter(n2, t4), n2 = __PRIVATE_queryWithAddedFilter(n2, t4);
    }(t2._query, e), new Query(t2.firestore, t2.converter, __PRIVATE_queryWithAddedFilter(t2._query, e)));
  }
  _getQueryConstraints() {
    return this._queryConstraints;
  }
  _getOperator() {
    return "and" === this.type ? "and" : "or";
  }
}
function __PRIVATE_parseDocumentIdValue(t2, e, n2) {
  if ("string" == typeof (n2 = getModularInstance(n2))) {
    if ("" === n2) throw new FirestoreError(C.INVALID_ARGUMENT, "Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");
    if (!__PRIVATE_isCollectionGroupQuery(e) && -1 !== n2.indexOf("/")) throw new FirestoreError(C.INVALID_ARGUMENT, `Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n2}' contains a '/' character.`);
    const r2 = e.path.child(ResourcePath.fromString(n2));
    if (!DocumentKey.isDocumentKey(r2)) throw new FirestoreError(C.INVALID_ARGUMENT, `Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r2}' is not because it has an odd number of segments (${r2.length}).`);
    return __PRIVATE_refValue(t2, new DocumentKey(r2));
  }
  if (n2 instanceof DocumentReference) return __PRIVATE_refValue(t2, n2._key);
  throw new FirestoreError(C.INVALID_ARGUMENT, `Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${__PRIVATE_valueDescription(n2)}.`);
}
function __PRIVATE_validateDisjunctiveFilterElements(t2, e) {
  if (!Array.isArray(t2) || 0 === t2.length) throw new FirestoreError(C.INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${e.toString()}' filters.`);
}
function __PRIVATE_validateNewFieldFilter(t2, e) {
  const n2 = function __PRIVATE_findOpInsideFilters(t3, e2) {
    for (const n3 of t3) for (const t4 of n3.getFlattenedFilters()) if (e2.indexOf(t4.op) >= 0) return t4.op;
    return null;
  }(t2.filters, function __PRIVATE_conflictingOps(t3) {
    switch (t3) {
      case "!=":
        return [
          "!=",
          "not-in"
          /* Operator.NOT_IN */
        ];
      case "array-contains-any":
      case "in":
        return [
          "not-in"
          /* Operator.NOT_IN */
        ];
      case "not-in":
        return [
          "array-contains-any",
          "in",
          "not-in",
          "!="
          /* Operator.NOT_EQUAL */
        ];
      default:
        return [];
    }
  }(e.op));
  if (null !== n2)
    throw n2 === e.op ? new FirestoreError(C.INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${e.op.toString()}' filter.`) : new FirestoreError(C.INVALID_ARGUMENT, `Invalid query. You cannot use '${e.op.toString()}' filters with '${n2.toString()}' filters.`);
}
function __PRIVATE_applyFirestoreDataConverter(t2, e, n2) {
  let r2;
  return r2 = t2 ? n2 && (n2.merge || n2.mergeFields) ? t2.toFirestore(e, n2) : t2.toFirestore(e) : e, r2;
}
class __PRIVATE_LiteUserDataWriter extends AbstractUserDataWriter {
  constructor(t2) {
    super(), this.firestore = t2;
  }
  convertBytes(t2) {
    return new Bytes(t2);
  }
  convertReference(t2) {
    const e = this.convertDocumentKey(t2, this.firestore._databaseId);
    return new DocumentReference(
      this.firestore,
      /* converter= */
      null,
      e
    );
  }
}
class SnapshotMetadata {
  /** @hideconstructor */
  constructor(t2, e) {
    this.hasPendingWrites = t2, this.fromCache = e;
  }
  /**
   * Returns true if this `SnapshotMetadata` is equal to the provided one.
   *
   * @param other - The `SnapshotMetadata` to compare against.
   * @returns true if this `SnapshotMetadata` is equal to the provided one.
   */
  isEqual(t2) {
    return this.hasPendingWrites === t2.hasPendingWrites && this.fromCache === t2.fromCache;
  }
}
class DocumentSnapshot extends DocumentSnapshot$1 {
  /** @hideconstructor protected */
  constructor(t2, e, n2, r2, s, a) {
    super(t2, e, n2, r2, a), this._firestore = t2, this._firestoreImpl = t2, this.metadata = s;
  }
  /**
   * Returns whether or not the data exists. True if the document exists.
   */
  exists() {
    return super.exists();
  }
  /**
   * Retrieves all fields in the document as an `Object`. Returns `undefined` if
   * the document doesn't exist.
   *
   * By default, `serverTimestamp()` values that have not yet been
   * set to their final value will be returned as `null`. You can override
   * this by passing an options object.
   *
   * @param options - An options object to configure how data is retrieved from
   * the snapshot (for example the desired behavior for server timestamps that
   * have not yet been set to their final value).
   * @returns An `Object` containing all fields in the document or `undefined` if
   * the document doesn't exist.
   */
  data(t2 = {}) {
    if (this._document) {
      if (this._converter) {
        const e = new QueryDocumentSnapshot(
          this._firestore,
          this._userDataWriter,
          this._key,
          this._document,
          this.metadata,
          /* converter= */
          null
        );
        return this._converter.fromFirestore(e, t2);
      }
      return this._userDataWriter.convertValue(this._document.data.value, t2.serverTimestamps);
    }
  }
  /**
   * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
   * document or field doesn't exist.
   *
   * By default, a `serverTimestamp()` that has not yet been set to
   * its final value will be returned as `null`. You can override this by
   * passing an options object.
   *
   * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
   * field.
   * @param options - An options object to configure how the field is retrieved
   * from the snapshot (for example the desired behavior for server timestamps
   * that have not yet been set to their final value).
   * @returns The data at the specified field location or undefined if no such
   * field exists in the document.
   */
  // We are using `any` here to avoid an explicit cast by our users.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(t2, e = {}) {
    if (this._document) {
      const n2 = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", t2));
      if (null !== n2) return this._userDataWriter.convertValue(n2, e.serverTimestamps);
    }
  }
  /**
   * Returns a JSON-serializable representation of this `DocumentSnapshot` instance.
   *
   * @returns a JSON representation of this object.  Throws a {@link FirestoreError} if this
   * `DocumentSnapshot` has pending writes.
   */
  toJSON() {
    if (this.metadata.hasPendingWrites) throw new FirestoreError(C.FAILED_PRECONDITION, "DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
    const t2 = this._document, e = {};
    if (e.type = DocumentSnapshot._jsonSchemaVersion, e.bundle = "", e.bundleSource = "DocumentSnapshot", e.bundleName = this._key.toString(), !t2 || !t2.isValidDocument() || !t2.isFoundDocument()) return e;
    this._userDataWriter.convertObjectMap(t2.data.value.mapValue.fields, "previous");
    return e.bundle = (this._firestore, this.ref.path, "NOT SUPPORTED"), e;
  }
}
DocumentSnapshot._jsonSchemaVersion = "firestore/documentSnapshot/1.0", DocumentSnapshot._jsonSchema = {
  type: property("string", DocumentSnapshot._jsonSchemaVersion),
  bundleSource: property("string", "DocumentSnapshot"),
  bundleName: property("string"),
  bundle: property("string")
};
class QueryDocumentSnapshot extends DocumentSnapshot {
  /**
   * Retrieves all fields in the document as an `Object`.
   *
   * By default, `serverTimestamp()` values that have not yet been
   * set to their final value will be returned as `null`. You can override
   * this by passing an options object.
   *
   * @override
   * @param options - An options object to configure how data is retrieved from
   * the snapshot (for example the desired behavior for server timestamps that
   * have not yet been set to their final value).
   * @returns An `Object` containing all fields in the document.
   */
  data(t2 = {}) {
    return super.data(t2);
  }
}
class QuerySnapshot {
  /** @hideconstructor */
  constructor(t2, e, n2, r2) {
    this._firestore = t2, this._userDataWriter = e, this._snapshot = r2, this.metadata = new SnapshotMetadata(r2.hasPendingWrites, r2.fromCache), this.query = n2;
  }
  /** An array of all the documents in the `QuerySnapshot`. */
  get docs() {
    const t2 = [];
    return this.forEach((e) => t2.push(e)), t2;
  }
  /** The number of documents in the `QuerySnapshot`. */
  get size() {
    return this._snapshot.docs.size;
  }
  /** True if there are no documents in the `QuerySnapshot`. */
  get empty() {
    return 0 === this.size;
  }
  /**
   * Enumerates all of the documents in the `QuerySnapshot`.
   *
   * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
   * each document in the snapshot.
   * @param thisArg - The `this` binding for the callback.
   */
  forEach(t2, e) {
    this._snapshot.docs.forEach((n2) => {
      t2.call(e, new QueryDocumentSnapshot(this._firestore, this._userDataWriter, n2.key, n2, new SnapshotMetadata(this._snapshot.mutatedKeys.has(n2.key), this._snapshot.fromCache), this.query.converter));
    });
  }
  /**
   * Returns an array of the documents changes since the last snapshot. If this
   * is the first snapshot, all documents will be in the list as 'added'
   * changes.
   *
   * @param options - `SnapshotListenOptions` that control whether metadata-only
   * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
   * snapshot events.
   */
  docChanges(t2 = {}) {
    const e = !!t2.includeMetadataChanges;
    if (e && this._snapshot.excludesMetadataChanges) throw new FirestoreError(C.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
    return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e || (this._cachedChanges = /** Calculates the array of `DocumentChange`s for a given `ViewSnapshot`. */
    function __PRIVATE_changesFromSnapshot(t3, e2) {
      if (t3._snapshot.oldDocs.isEmpty()) {
        let e3 = 0;
        return t3._snapshot.docChanges.map((n2) => {
          const r2 = new QueryDocumentSnapshot(t3._firestore, t3._userDataWriter, n2.doc.key, n2.doc, new SnapshotMetadata(t3._snapshot.mutatedKeys.has(n2.doc.key), t3._snapshot.fromCache), t3.query.converter);
          return n2.doc, {
            type: "added",
            doc: r2,
            oldIndex: -1,
            newIndex: e3++
          };
        });
      }
      {
        let n2 = t3._snapshot.oldDocs;
        return t3._snapshot.docChanges.filter((t4) => e2 || 3 !== t4.type).map((e3) => {
          const r2 = new QueryDocumentSnapshot(t3._firestore, t3._userDataWriter, e3.doc.key, e3.doc, new SnapshotMetadata(t3._snapshot.mutatedKeys.has(e3.doc.key), t3._snapshot.fromCache), t3.query.converter);
          let s = -1, a = -1;
          return 0 !== e3.type && (s = n2.indexOf(e3.doc.key), n2 = n2.delete(e3.doc.key)), 1 !== e3.type && (n2 = n2.add(e3.doc), a = n2.indexOf(e3.doc.key)), {
            type: __PRIVATE_resultChangeType(e3.type),
            doc: r2,
            oldIndex: s,
            newIndex: a
          };
        });
      }
    }(this, e), this._cachedChangesIncludeMetadataChanges = e), this._cachedChanges;
  }
  /**
   * Returns a JSON-serializable representation of this `QuerySnapshot` instance.
   *
   * @returns a JSON representation of this object. Throws a {@link FirestoreError} if this
   * `QuerySnapshot` has pending writes.
   */
  toJSON() {
    if (this.metadata.hasPendingWrites) throw new FirestoreError(C.FAILED_PRECONDITION, "QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
    const t2 = {};
    t2.type = QuerySnapshot._jsonSchemaVersion, t2.bundleSource = "QuerySnapshot", t2.bundleName = __PRIVATE_AutoId.newId(), this._firestore._databaseId.database, this._firestore._databaseId.projectId;
    const e = [], n2 = [], r2 = [];
    return this.docs.forEach((t3) => {
      null !== t3._document && (e.push(t3._document), n2.push(this._userDataWriter.convertObjectMap(t3._document.data.value.mapValue.fields, "previous")), r2.push(t3.ref.path));
    }), t2.bundle = (this._firestore, this.query._query, t2.bundleName, "NOT SUPPORTED"), t2;
  }
}
function __PRIVATE_resultChangeType(t2) {
  switch (t2) {
    case 0:
      return "added";
    case 2:
    case 3:
      return "modified";
    case 1:
      return "removed";
    default:
      return fail(61501, {
        type: t2
      });
  }
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
QuerySnapshot._jsonSchemaVersion = "firestore/querySnapshot/1.0", QuerySnapshot._jsonSchema = {
  type: property("string", QuerySnapshot._jsonSchemaVersion),
  bundleSource: property("string", "QuerySnapshot"),
  bundleName: property("string"),
  bundle: property("string")
};
const Yt = {
  maxAttempts: 5
};
function __PRIVATE_validateReference(t2, e) {
  if ((t2 = getModularInstance(t2)).firestore !== e) throw new FirestoreError(C.INVALID_ARGUMENT, "Provided document reference is from a different Firestore instance.");
  return t2;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Transaction$1 {
  /** @hideconstructor */
  constructor(t2, e) {
    this._firestore = t2, this._transaction = e, this._dataReader = __PRIVATE_newUserDataReader(t2);
  }
  /**
   * Reads the document referenced by the provided {@link DocumentReference}.
   *
   * @param documentRef - A reference to the document to be read.
   * @returns A `DocumentSnapshot` with the read data.
   */
  get(t2) {
    const e = __PRIVATE_validateReference(t2, this._firestore), n2 = new __PRIVATE_LiteUserDataWriter(this._firestore);
    return this._transaction.lookup([e._key]).then((t3) => {
      if (!t3 || 1 !== t3.length) return fail(24041);
      const r2 = t3[0];
      if (r2.isFoundDocument()) return new DocumentSnapshot$1(this._firestore, n2, r2.key, r2, e.converter);
      if (r2.isNoDocument()) return new DocumentSnapshot$1(this._firestore, n2, e._key, null, e.converter);
      throw fail(18433, {
        doc: r2
      });
    });
  }
  set(t2, e, n2) {
    const r2 = __PRIVATE_validateReference(t2, this._firestore), s = __PRIVATE_applyFirestoreDataConverter(r2.converter, e, n2), a = __PRIVATE_parseSetData(this._dataReader, "Transaction.set", r2._key, s, null !== r2.converter, n2);
    return this._transaction.set(r2._key, a), this;
  }
  update(t2, e, n2, ...r2) {
    const s = __PRIVATE_validateReference(t2, this._firestore);
    let a;
    return a = "string" == typeof (e = getModularInstance(e)) || e instanceof FieldPath ? __PRIVATE_parseUpdateVarargs(this._dataReader, "Transaction.update", s._key, e, n2, r2) : __PRIVATE_parseUpdateData(this._dataReader, "Transaction.update", s._key, e), this._transaction.update(s._key, a), this;
  }
  /**
   * Deletes the document referred to by the provided {@link DocumentReference}.
   *
   * @param documentRef - A reference to the document to be deleted.
   * @returns This `Transaction` instance. Used for chaining method calls.
   */
  delete(t2) {
    const e = __PRIVATE_validateReference(t2, this._firestore);
    return this._transaction.delete(e._key), this;
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Transaction2 extends Transaction$1 {
  // This class implements the same logic as the Transaction API in the Lite SDK
  // but is subclassed in order to return its own DocumentSnapshot types.
  /** @hideconstructor */
  constructor(t2, e) {
    super(t2, e), this._firestore = t2;
  }
  /**
   * Reads the document referenced by the provided {@link DocumentReference}.
   *
   * @param documentRef - A reference to the document to be read.
   * @returns A `DocumentSnapshot` with the read data.
   */
  get(t2) {
    const e = __PRIVATE_validateReference(t2, this._firestore), n2 = new __PRIVATE_ExpUserDataWriter(this._firestore);
    return super.get(t2).then((t3) => new DocumentSnapshot(this._firestore, n2, e._key, t3._document, new SnapshotMetadata(
      /* hasPendingWrites= */
      false,
      /* fromCache= */
      false
    ), e.converter));
  }
}
function runTransaction(t2, e, n2) {
  t2 = __PRIVATE_cast(t2, Firestore);
  const r2 = {
    ...Yt,
    ...n2
  };
  !function __PRIVATE_validateTransactionOptions(t3) {
    if (t3.maxAttempts < 1) throw new FirestoreError(C.INVALID_ARGUMENT, "Max attempts must be at least 1");
  }(r2);
  const s = ensureFirestoreConfigured(t2);
  return __PRIVATE_firestoreClientTransaction(s, (n3) => e(new Transaction2(t2, n3)), r2);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function getDoc(t2) {
  t2 = __PRIVATE_cast(t2, DocumentReference);
  const e = __PRIVATE_cast(t2.firestore, Firestore), n2 = ensureFirestoreConfigured(e);
  return __PRIVATE_firestoreClientGetDocumentViaSnapshotListener(n2, t2._key).then((n3) => __PRIVATE_convertToDocSnapshot(e, t2, n3));
}
function getDocs(t2) {
  t2 = __PRIVATE_cast(t2, Query);
  const e = __PRIVATE_cast(t2.firestore, Firestore), n2 = ensureFirestoreConfigured(e), r2 = new __PRIVATE_ExpUserDataWriter(e);
  return __PRIVATE_validateHasExplicitOrderByForLimitToLast(t2._query), __PRIVATE_firestoreClientGetDocumentsViaSnapshotListener(n2, t2._query).then((n3) => new QuerySnapshot(e, r2, t2, n3));
}
function setDoc(t2, e, n2) {
  t2 = __PRIVATE_cast(t2, DocumentReference);
  const r2 = __PRIVATE_cast(t2.firestore, Firestore), s = __PRIVATE_applyFirestoreDataConverter(t2.converter, e, n2), o = __PRIVATE_newUserDataReader(r2);
  return executeWrite(r2, [__PRIVATE_parseSetData(o, "setDoc", t2._key, s, null !== t2.converter, n2).toMutation(t2._key, Precondition.none())]);
}
function executeWrite(t2, e) {
  const n2 = ensureFirestoreConfigured(t2);
  return __PRIVATE_firestoreClientWrite(n2, e);
}
function __PRIVATE_convertToDocSnapshot(t2, e, n2) {
  const r2 = n2.docs.get(e._key), s = new __PRIVATE_ExpUserDataWriter(t2);
  return new DocumentSnapshot(t2, s, e._key, r2, new SnapshotMetadata(n2.hasPendingWrites, n2.fromCache), e.converter);
}
!function __PRIVATE_registerFirestore(u2, l2 = true) {
  __PRIVATE_setSDKVersion(SDK_VERSION), _registerComponent(new Component("firestore", (t2, { instanceIdentifier: e, options: n2 }) => {
    const r2 = t2.getProvider("app").getImmediate(), s = new Firestore(new __PRIVATE_FirebaseAuthCredentialsProvider(t2.getProvider("auth-internal")), new __PRIVATE_FirebaseAppCheckTokenProvider(r2, t2.getProvider("app-check-internal")), __PRIVATE_databaseIdFromApp(r2, e), r2);
    return n2 = {
      useFetchStreams: l2,
      ...n2
    }, s._setSettings(n2), s;
  }, "PUBLIC").setMultipleInstances(true)), registerVersion(Ut, Ht, u2), // BUILD_TARGET will be replaced by values like esm, cjs, etc during the compilation
  registerVersion(Ut, Ht, "esm2020");
}();
const index_esm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AbstractUserDataWriter,
  Bytes,
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  FieldPath,
  FieldValue,
  Firestore,
  FirestoreError,
  GeoPoint,
  Query,
  QueryCompositeFilterConstraint,
  QueryConstraint,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  QuerySnapshot,
  SnapshotMetadata,
  Timestamp,
  Transaction: Transaction2,
  VectorValue,
  _AutoId: __PRIVATE_AutoId,
  _ByteString: ByteString,
  _DatabaseId: DatabaseId,
  _DocumentKey: DocumentKey,
  _EmptyAuthCredentialsProvider: __PRIVATE_EmptyAuthCredentialsProvider,
  _FieldPath: FieldPath$1,
  _cast: __PRIVATE_cast,
  _logWarn: __PRIVATE_logWarn,
  _validateIsNotUsedTogether: __PRIVATE_validateIsNotUsedTogether,
  collection,
  connectFirestoreEmulator,
  doc,
  ensureFirestoreConfigured,
  executeWrite,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  query,
  runTransaction,
  setDoc,
  where
}, Symbol.toStringTag, { value: "Module" }));
export {
  React as R,
  initializeApp as a,
  getFirestore as b,
  client as c,
  doc as d,
  collection as e,
  getDocs as f,
  getDoc as g,
  index_esm as h,
  increment as i,
  jsxRuntimeExports as j,
  query as q,
  reactExports as r,
  where as w
};
