var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
    if (a == Array.prototype || a == Object.prototype) return a;
    a[b] = c.value;
    return a
};
$jscomp.getGlobal = function(a) {
    a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
    for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        if (c && c.Math == Math) return c
    }
    throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function(a, b) {
    var c = $jscomp.propertyToPolyfillSymbol[b];
    if (null == c) return a[b];
    c = a[c];
    return void 0 !== c ? c : a[b]
};
$jscomp.polyfill = function(a, b, c, e) {
    b && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(a, b, c, e) : $jscomp.polyfillUnisolated(a, b, c, e))
};
$jscomp.polyfillUnisolated = function(a, b, c, e) {
    c = $jscomp.global;
    a = a.split(".");
    for (e = 0; e < a.length - 1; e++) {
        var f = a[e];
        if (!(f in c)) return;
        c = c[f]
    }
    a = a[a.length - 1];
    e = c[a];
    b = b(e);
    b != e && null != b && $jscomp.defineProperty(c, a, {
        configurable: !0,
        writable: !0,
        value: b
    })
};
$jscomp.polyfillIsolated = function(a, b, c, e) {
    var f = a.split(".");
    a = 1 === f.length;
    e = f[0];
    e = !a && e in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
    for (var k = 0; k < f.length - 1; k++) {
        var g = f[k];
        if (!(g in e)) return;
        e = e[g]
    }
    f = f[f.length - 1];
    c = $jscomp.IS_SYMBOL_NATIVE && "es6" === c ? e[f] : null;
    b = b(c);
    null != b && (a ? $jscomp.defineProperty($jscomp.polyfills, f, {
        configurable: !0,
        writable: !0,
        value: b
    }) : b !== c && (void 0 === $jscomp.propertyToPolyfillSymbol[f] && (c = 1E9 * Math.random() >>> 0, $jscomp.propertyToPolyfillSymbol[f] = $jscomp.IS_SYMBOL_NATIVE ?
        $jscomp.global.Symbol(f) : $jscomp.POLYFILL_PREFIX + c + "$" + f), $jscomp.defineProperty(e, $jscomp.propertyToPolyfillSymbol[f], {
        configurable: !0,
        writable: !0,
        value: b
    })))
};
$jscomp.underscoreProtoCanBeSet = function() {
    var a = {
            a: !0
        },
        b = {};
    try {
        return b.__proto__ = a, b.a
    } catch (c) {}
    return !1
};
$jscomp.setPrototypeOf = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(a, b) {
    a.__proto__ = b;
    if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
    return a
} : null;
$jscomp.arrayIteratorImpl = function(a) {
    var b = 0;
    return function() {
        return b < a.length ? {
            done: !1,
            value: a[b++]
        } : {
            done: !0
        }
    }
};
$jscomp.arrayIterator = function(a) {
    return {
        next: $jscomp.arrayIteratorImpl(a)
    }
};
$jscomp.makeIterator = function(a) {
    var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
    return b ? b.call(a) : $jscomp.arrayIterator(a)
};
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function(a) {
    if (!(a instanceof Object)) throw new TypeError("Iterator result " + a + " is not an object");
};
$jscomp.generator.Context = function() {
    this.isRunning_ = !1;
    this.yieldAllIterator_ = null;
    this.yieldResult = void 0;
    this.nextAddress = 1;
    this.finallyAddress_ = this.catchAddress_ = 0;
    this.finallyContexts_ = this.abruptCompletion_ = null
};
$jscomp.generator.Context.prototype.start_ = function() {
    if (this.isRunning_) throw new TypeError("Generator is already running");
    this.isRunning_ = !0
};
$jscomp.generator.Context.prototype.stop_ = function() {
    this.isRunning_ = !1
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function() {
    this.nextAddress = this.catchAddress_ || this.finallyAddress_
};
$jscomp.generator.Context.prototype.next_ = function(a) {
    this.yieldResult = a
};
$jscomp.generator.Context.prototype.throw_ = function(a) {
    this.abruptCompletion_ = {
        exception: a,
        isException: !0
    };
    this.jumpToErrorHandler_()
};
$jscomp.generator.Context.prototype.return = function(a) {
    this.abruptCompletion_ = {
        return: a
    };
    this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function(a) {
    this.abruptCompletion_ = {
        jumpTo: a
    };
    this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.yield = function(a, b) {
    this.nextAddress = b;
    return {
        value: a
    }
};
$jscomp.generator.Context.prototype.yieldAll = function(a, b) {
    a = $jscomp.makeIterator(a);
    var c = a.next();
    $jscomp.generator.ensureIteratorResultIsObject_(c);
    if (c.done) this.yieldResult = c.value, this.nextAddress = b;
    else return this.yieldAllIterator_ = a, this.yield(c.value, b)
};
$jscomp.generator.Context.prototype.jumpTo = function(a) {
    this.nextAddress = a
};
$jscomp.generator.Context.prototype.jumpToEnd = function() {
    this.nextAddress = 0
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function(a, b) {
    this.catchAddress_ = a;
    void 0 != b && (this.finallyAddress_ = b)
};
$jscomp.generator.Context.prototype.setFinallyBlock = function(a) {
    this.catchAddress_ = 0;
    this.finallyAddress_ = a || 0
};
$jscomp.generator.Context.prototype.leaveTryBlock = function(a, b) {
    this.nextAddress = a;
    this.catchAddress_ = b || 0
};
$jscomp.generator.Context.prototype.enterCatchBlock = function(a) {
    this.catchAddress_ = a || 0;
    a = this.abruptCompletion_.exception;
    this.abruptCompletion_ = null;
    return a
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function(a, b, c) {
    c ? this.finallyContexts_[c] = this.abruptCompletion_ : this.finallyContexts_ = [this.abruptCompletion_];
    this.catchAddress_ = a || 0;
    this.finallyAddress_ = b || 0
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function(a, b) {
    b = this.finallyContexts_.splice(b || 0)[0];
    if (b = this.abruptCompletion_ = this.abruptCompletion_ || b) {
        if (b.isException) return this.jumpToErrorHandler_();
        void 0 != b.jumpTo && this.finallyAddress_ < b.jumpTo ? (this.nextAddress = b.jumpTo, this.abruptCompletion_ = null) : this.nextAddress = this.finallyAddress_
    } else this.nextAddress = a
};
$jscomp.generator.Context.prototype.forIn = function(a) {
    return new $jscomp.generator.Context.PropertyIterator(a)
};
$jscomp.generator.Context.PropertyIterator = function(a) {
    this.object_ = a;
    this.properties_ = [];
    for (var b in a) this.properties_.push(b);
    this.properties_.reverse()
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function() {
    for (; 0 < this.properties_.length;) {
        var a = this.properties_.pop();
        if (a in this.object_) return a
    }
    return null
};
$jscomp.generator.Engine_ = function(a) {
    this.context_ = new $jscomp.generator.Context;
    this.program_ = a
};
$jscomp.generator.Engine_.prototype.next_ = function(a) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_.next, a, this.context_.next_);
    this.context_.next_(a);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.return_ = function(a) {
    this.context_.start_();
    var b = this.context_.yieldAllIterator_;
    if (b) return this.yieldAllStep_("return" in b ? b["return"] : function(c) {
        return {
            value: c,
            done: !0
        }
    }, a, this.context_.return);
    this.context_.return(a);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.throw_ = function(a) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], a, this.context_.next_);
    this.context_.throw_(a);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function(a, b, c) {
    try {
        var e = a.call(this.context_.yieldAllIterator_, b);
        $jscomp.generator.ensureIteratorResultIsObject_(e);
        if (!e.done) return this.context_.stop_(), e;
        var f = e.value
    } catch (k) {
        return this.context_.yieldAllIterator_ = null, this.context_.throw_(k), this.nextStep_()
    }
    this.context_.yieldAllIterator_ = null;
    c.call(this.context_, f);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.nextStep_ = function() {
    for (; this.context_.nextAddress;) try {
        var a = this.program_(this.context_);
        if (a) return this.context_.stop_(), {
            value: a.value,
            done: !1
        }
    } catch (b) {
        this.context_.yieldResult = void 0, this.context_.throw_(b)
    }
    this.context_.stop_();
    if (this.context_.abruptCompletion_) {
        a = this.context_.abruptCompletion_;
        this.context_.abruptCompletion_ = null;
        if (a.isException) throw a.exception;
        return {
            value: a.return,
            done: !0
        }
    }
    return {
        value: void 0,
        done: !0
    }
};
$jscomp.generator.Generator_ = function(a) {
    this.next = function(b) {
        return a.next_(b)
    };
    this.throw = function(b) {
        return a.throw_(b)
    };
    this.return = function(b) {
        return a.return_(b)
    };
    this[Symbol.iterator] = function() {
        return this
    }
};
$jscomp.generator.createGenerator = function(a, b) {
    b = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));
    $jscomp.setPrototypeOf && a.prototype && $jscomp.setPrototypeOf(b, a.prototype);
    return b
};
$jscomp.asyncExecutePromiseGenerator = function(a) {
    function b(e) {
        return a.next(e)
    }

    function c(e) {
        return a.throw(e)
    }
    return new Promise(function(e, f) {
        function k(g) {
            g.done ? e(g.value) : Promise.resolve(g.value).then(b, c).then(k, f)
        }
        k(a.next())
    })
};
$jscomp.asyncExecutePromiseGeneratorFunction = function(a) {
    return $jscomp.asyncExecutePromiseGenerator(a())
};
$jscomp.asyncExecutePromiseGeneratorProgram = function(a) {
    return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a)))
};
$jscomp.polyfill("Array.prototype.includes", function(a) {
    return a ? a : function(b, c) {
        var e = this;
        e instanceof String && (e = String(e));
        var f = e.length;
        c = c || 0;
        for (0 > c && (c = Math.max(c + f, 0)); c < f; c++) {
            var k = e[c];
            if (k === b || Object.is(k, b)) return !0
        }
        return !1
    }
}, "es7", "es3");
$jscomp.polyfill("String.prototype.replaceAll", function(a) {
    return a ? a : function(b, c) {
        if (b instanceof RegExp && !b.global) throw new TypeError("String.prototype.replaceAll called with a non-global RegExp argument.");
        return b instanceof RegExp ? this.replace(b, c) : this.replace(new RegExp(String(b).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08"), "g"), c)
    }
}, "es_2021", "es3");
$jscomp.owns = function(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b)
};
$jscomp.polyfill("Object.values", function(a) {
    return a ? a : function(b) {
        var c = [],
            e;
        for (e in b) $jscomp.owns(b, e) && c.push(b[e]);
        return c
    }
}, "es8", "es3");
var toast_visible = !1,
    notification_visible = !1,
    timerInterval;

function success_notification(a, b = "") {
    create_notification(a, "general_notification", b)
}

function error_notification(a, b = "") {
    create_notification(a, "error", b)
}

function show_ribbon(a, b = null, c = null, e = null) {
    "timer" === b && c ? create_timer_ribbon(1E3 * c, a, e) : create_ribbon(a)
}

function create_timer_ribbon(a, b, c) {
    let e = a - (new Date).getTime();
    if (0 > e) b = `${b} <span id="countdown">EXPIRED!</span>`;
    else {
        let f = get_remaining_time(a);
        b = c ? `${b} <span id="countdown">${f}</span><span>. ${c}</span>` : `${b} <span id="countdown">${f}</span><span>. Enroll Now!</span>`
    }
    create_ribbon(b);
    0 <= e && update_timer(a)
}

function update_timer(a, b = null) {
    let c = $("#countdown"),
        e = get_remaining_time(a);
    c.text(e);
    timerInterval = setInterval(function() {
        let f = get_remaining_time(a);
        c.text(f);
        "00h: 00m: 00s" === f && (clearInterval(timerInterval), "function" === typeof b && b())
    }, 1E3)
}

function get_remaining_time(a) {
    a -= (new Date).getTime();
    return 0 > a ? "00h: 00m: 00s" : break_time_difference(a)
}

function break_time_difference(a) {
    let b = Math.floor(a / 864E5),
        c = Math.floor(a % 864E5 / 36E5),
        e = Math.floor(a % 36E5 / 6E4);
    a = Math.floor(a % 6E4 / 1E3);
    10 > c && (c = "0" + c);
    10 > e && (e = "0" + e);
    10 > a && (a = "0" + a);
    days_d = 0 >= b ? "" : b + "d: ";
    return days_d + c + "h: " + e + "m: " + a + "s"
}

function general_toast(a, b = "", c = "") {
    var e = a;
    "" != b && (e = "<span class='toast-message'>" + a + "</span><button id='" + c + "' class='" + c + " btn'>" + b + "</button>");
    create_toast("general_toast", e)
}

function error_toast(a, b = "", c = "") {
    var e = a;
    "" != b && (e = "<span class='toast-message'>" + a + "</span><button id='" + c + "' class='" + c + " btn'>" + b + "</button>");
    create_toast("error_toast", e)
}

function error_modal(a = "Something went wrong!", b = "", c = "Close", e = "", f = !1) {
    create_modal("error-modal", a, e, c, b, f)
}

function success_modal(a, b = "", c = "Close", e = null, f = "", k = !1, g = "") {
    f ? $("#modal_secondary_btn").show().text(f) : $("#modal_secondary_btn").hide();
    f = "success-modal";
    g && (f = `success-modal ${g}`);
    create_modal(f, a, e, c, b, k)
}

function alert_modal(a, b = "", c = "Ok", e = null, f = !1) {
    create_modal("alert-modal", a, e, c, b, f)
}

function confirmation_modal(a, b = "", c = "Yes", e, f = !1, k = null) {
    create_modal("confirmation-modal", a, null, c, b, f, k);
    e ? $("#modal_secondary_btn").show().text(e) : $("#modal_secondary_btn").hide()
}

function create_modal(a, b, c, e, f, k, g = null) {
    let p = $("#modal"),
        v = $("#modal_primary_btn");
    p.removeClass(["success-modal", "error-modal", "alert-modal", "confirmation-modal"]).addClass(a);
    v.text(e);
    $("#modal_text_message").html(b);
    f ? $("#modal_text_heading").show().html(f) : $("#modal_text_heading").hide();
    v.unbind();
    g && v.click(g);
    c ? v.removeClass("close_action").attr("href", c).attr("data-dismiss", "") : v.addClass("close_action").removeAttr("href").attr("data-dismiss", "modal");
    k ? p.removeData("bs.modal").modal({
        show: !0,
        backdrop: "static",
        keyboard: !1
    }) : p.removeData("bs.modal").modal({
        show: !0,
        backdrop: "true",
        keyboard: !0
    })
}

function create_toast(a, b) {
    let c = $("." + a);
    toast_visible && ($(".toast").hide(), clearTimeout(toast_visible));
    $("." + a + " .toast-body").html(b);
    c.css({
        opacity: 0,
        top: "-46px"
    }).show().animate({
        opacity: 1,
        top: "56px"
    }, 400);
    toast_visible = setTimeout(function() {
        hide_toast(c)
    }, 3E3)
}

function create_ribbon(a) {
    $("#notification-ribbon").css("position", "absolute");
    $("#general_ribbon").show();
    $("#general_ribbon_message").html(a)
}

function create_notification(a, b, c) {
    notification_visible && (clearInterval(notification_visible), notification_visible = !1);
    let e = $("#notification-ribbon");
    "none" !== $("#general_ribbon").css("display") && e.css("position", "absolute");
    let f = $("#close_notification_ribbon");
    e.removeClass(["error-notification", "has-cross-button"]);
    $("#notification-message").html(a);
    f.hide();
    "error" === b && e.addClass("error-notification");
    "with_button" === c ? (e.addClass("has-cross-button"), f.show(400).click(function() {
        e.slideUp(500);
        f.hide(500)
    })) : "with_timeout" === c && (notification_visible = setTimeout(function() {
        e.slideUp(500);
        notification_visible = !1
    }, 6E3));
    e.slideDown(500)
}

function hide_toast(a) {
    a.animate({
        opacity: 0,
        top: "-46px"
    }, 400, function() {
        a.hide();
        toast_visible = !1
    })
}
$(document).ready(function() {
    var a = $("#general_ribbon");
    if (a.length) {
        let b = a.data("ribbon-message"),
            c = a.data("ribbon-end_date"),
            e = a.data("ribbon-type");
        a = a.data("ribbon-cta-message");
        b && show_ribbon(b, e, c, a)
    }
});
(function(a, b) {
    b(a.ReactCommon = {})
})(this, a => {
    const b = {
        CSRF: "csrf_cookie_name"
    };
    Object.freeze(b);
    const c = {
        AXIOS_REQUEST_INTERCEPT: 0,
        AXIOS_RESPONSE_INTERCEPT: 0,
        CONSOLE_LOG: 0
    };
    Object.freeze(c);
    const e = g => {
            try {
                if (599 === g.status) {
                    let p = {};
                    p = "undefined" == typeof g.data && "undefined" != typeof g.responseText ? JSON.parse(g.responseText) : g.data;
                    if (599 === p.code && "redirect" === p.message && "undefined" != typeof p.url) {
                        const v = encodeURIComponent(p.url);
                        $.ajax("/ddos/index/ajax_" + v, {
                            data: {},
                            success: function() {},
                            error: function() {},
                            type: "POST"
                        });
                        return !1
                    }
                } else 0 === g.status || g.code && g.code.toLowerCase().includes("abort") ? console.log("xhr cancelled") : error_notification("Please try again after some time!", "with_timeout")
            } catch (p) {
                error_notification("Please try again after some time!", "with_timeout")
            }
        },
        f = NProgress.configure({
            showSpinner: !1
        });
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    const k = axios.create();
    k.defaults.xsrfCookieName = "csrf_cookie_name";
    k.defaults.xsrfHeaderName = "X-CSRF-TOKEN";
    k.interceptors.response.use(g => {
        f.done();
        return g
    }, g => {
        f.done();
        e(g);
        return Promise.reject({
            message: "ERROR"
        })
    });
    k.interceptors.request.use(g => {
        c.AXIOS_REQUEST_INTERCEPT && console.log({
            type: "Request",
            url: g.url,
            method: g.method,
            headers: g.headers,
            data: g.data
        });
        return g
    }, g => Promise.reject(g));
    a.COOKIE_NAMES = b;
    a.getCookie = g => {
        g += "=";
        const p = decodeURIComponent(document.cookie).split(";");
        for (let v = 0; v < p.length; v++) {
            let w = p[v];
            for (;
                " " === w.charAt(0);) w = w.substring(1);
            if (0 === w.indexOf(g)) return w.substring(g.length, w.length)
        }
        return ""
    };
    a.isEmailValid =
        g => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(g.toLowerCase());
    a.isPhoneValid = g => /^[6-9]\d{9}$/.test(g);
    a.isNameValid = g => /^[a-zA-Z ]+$/.test(g.toLowerCase());
    a.isCountryCodeValid = g => /^(\+?\d{1,3}|\d{1,4})$/.test(g);
    a.capitalize = g => "string" !== typeof g ? "" : g.charAt(0).toUpperCase() + g.slice(1);
    a.logger = g => {
        c.CONSOLE_LOG && console.log(g)
    };
    a.globalAxios = k;
    a.progressBar = f
});
let openNav = function() {},
    closeNav = function() {};
const openRecommendedMenu = function() {
    $(".recommended_menu").addClass("expanded");
    $(".recommended_menu_items").show()
};
$(document).ready(function() {
    function a(m) {
        var q = m - (new Date).getTime();
        if (0 > q) m = "00h: 00m: 00s";
        else {
            m = Math.floor(q / 864E5);
            let y = Math.floor(q % 864E5 / 36E5),
                C = Math.floor(q % 36E5 / 6E4);
            q = Math.floor(q % 6E4 / 1E3);
            10 > y && (y = "0" + y);
            10 > C && (C = "0" + C);
            10 > q && (q = "0" + q);
            days_d = 0 >= m ? "" : m + "d: ";
            m = days_d + y + "h: " + C + "m: " + q + "s"
        }
        return m
    }

    function b(m) {
        let q = $("#timer");
        timerInterval = setInterval(function() {
            let y = a(m);
            q.text(y);
            "00h: 00m: 00s" === y && clearInterval(timerInterval)
        }, 1E3)
    }
    const c = $("#mySidenav"),
        e = c.width(),
        f = $(".layer"),
        k = $(".dropdown-backdrop"),
        g = $("#content"),
        p = document.body,
        v = $("#open-nav"),
        w = $("#login-list-item a");
    $(document).ready(function() {
        if ($("#timer1").length) {
            var m = 1E3 * $("#timer1").text();
            let y = m - (new Date).getTime();
            var q = `${a(m)}`;
            $("#timer").html(q);
            0 <= y && b(m)
        }
    });
    k.height($(document).height());
    f.click(function() {
        closeNav()
    });
    v.click(function() {
        openNav()
    });
    w.click(function() {
        closeNav()
    });
    openNav = () => {
        c.css("left", 0);
        p.style.overflow = "hidden";
        f.show()
    };
    closeNav = () => {
        c.css("left", -e);
        p.style.overflow =
            "";
        f.hide();
        g.off("touchmove").off("touchend")
    };
    openRecommendedMenu();
    f.on("touchend", closeNav);
    g.on("touchstart", function(m) {
        20 >= (m.touches[0] || m.changedTouches[0]).pageX && ($(this).on("touchmove", function(q) {
            q = (q.touches[0] || q.changedTouches[0]).pageX - e;
            0 < q && (q = 0);
            c.css("left", q)
        }), $(this).on("touchend", function(q) {
            (q.touches[0] || q.changedTouches[0]).pageX >= e / 4 ? (f.show(), c.css("left", 0)) : closeNav()
        }))
    });
    $(function() {
        var m;
        $(".dropdown-hover").on("mouseenter", function() {
            clearTimeout(m);
            m = setTimeout(function(q) {
                $(".dropdown-menu",
                    q).stop(!0, !0).show();
                $(q).toggleClass("open");
                $(".dropdown-hover").addClass("underlined");
                $(".dropdown-hover .arrow").removeClass("is-icon-arrow-drop-down").addClass("is-icon-arrow-drop-up");
                k.show()
            }, 85, this)
        }).on("mouseleave", function() {
            clearTimeout(m);
            m = setTimeout(function(q) {
                    $(".dropdown-menu", q).stop(!0, !0).hide();
                    $(q).toggleClass("open");
                    $(".dropdown-hover").removeClass("underlined");
                    $(".dropdown-hover .arrow").removeClass("is-icon-arrow-drop-up").addClass("is-icon-arrow-drop-down");
                    k.hide()
                },
                85, this)
        })
    });
    $(function() {
        var m;
        $(".category-selector").on("mouseenter", function() {
            m = setTimeout(function(q) {
                $(".course-list").removeClass("show");
                $(".category-selector").removeClass("active-category");
                $("#courses_" + q).addClass("show");
                $("#" + q).addClass("active-category")
            }, 85, this.id)
        }).on("mouseleave", function() {
            clearTimeout(m)
        })
    });
    $(function() {
        $(".profile-hover").hover(function() {
            $(".profile-dropdown", this).stop(!0, !0).show();
            $(this).toggleClass("open");
            $(".profile-hover").addClass("underlined");
            $(".profile-hover .arrow").removeClass("is-icon-arrow-drop-down").addClass("is-icon-arrow-drop-up")
        }, function() {
            $(".profile-dropdown", this).stop(!0, !0).hide();
            $(this).toggleClass("open");
            $(".profile-hover").removeClass("underlined");
            $(".profile-hover .arrow").removeClass("is-icon-arrow-drop-up").addClass("is-icon-arrow-drop-down")
        })
    });
    $(function() {
        $(".ham_title").click(function() {
            var m = $(this).parent();
            m.toggleClass("expanded");
            m.find(".ham_submenu_items").toggle();
            m = $(this).children(".arrow");
            m.hasClass("is-icon-chevron-down-s") ?
                m.removeClass("is-icon-chevron-down-s").addClass("is-icon-chevron-up-s") : m.removeClass("is-icon-chevron-up-s").addClass("is-icon-chevron-down-s")
        })
    })
});
"use strict";
const SearchModal = a => {
    const b = a.courseList,
        [c, e] = React.useState(""),
        [f, k] = React.useState(""),
        [g, p] = React.useState(a.pinnedCourses),
        [v, w] = React.useState(""),
        [m, q] = React.useState(0),
        [y, C] = React.useState([]),
        [V, R] = React.useState(!1),
        [S, M] = React.useState(0),
        N = React.useRef(!0),
        W = f.toLowerCase().includes("recommended") ? "-recommended" : f.toLowerCase().includes("popular") ? "-most-popular" : "",
        Z = () => {
            const l = T();
            C(b.filter(x => x.name.match(l) && "" != v))
        },
        T = () => {
            const l = D(v);
            return new RegExp(`(\\b${l})`, "gi")
        },
        D = l => l.replace(/\W/g, x => "\\" + x);
    React.useEffect(() => {
        Z()
    }, [v]);
    const X = React.useCallback((l => {
            let x;
            return function(...A) {
                const t = this;
                x && clearTimeout(x);
                x = setTimeout(() => {
                    x = null;
                    l.apply(t, A)
                }, 500)
            }
        })(l => {
            const x = new FormData;
            x.set("typed_keyword", l);
            x.set("csrf_test_name", ReactCommon.getCookie(ReactCommon.COOKIE_NAMES.CSRF));
            ReactCommon.globalAxios({
                method: "post",
                url: "/track/track_user_search_input",
                data: x,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            })
        }), []),
        K = (l = null,
            x = null, A = null) => $jscomp.asyncExecutePromiseGeneratorFunction(function*() {
            if ("A" != $(event.target.activeElement).prop("tagName")) {
                const t = new FormData;
                t.set("enter_key_pressed", S);
                t.set("recommendation_shown", a.searchHeading.toLowerCase().includes("recommended") ? 1 : 0);
                t.set("course_ids_shown_from", 0 != y.length ? "dropdown" : g ? "tags" : 0 == c.length ? "no_search_results" : "search_cards");
                t.set("course_ids_shown", (0 != y.length ? y : 0 != c.length ? c : a.pinnedCourses).map(B => B.id).join(","));
                t.set("csrf_test_name", ReactCommon.getCookie(ReactCommon.COOKIE_NAMES.CSRF));
                t.set("is_modal_closed", x ? 1 : 0);
                A && t.set("clicked_course_id_source", A);
                l && t.set("clicked_course_id", l);
                yield ReactCommon.globalAxios({
                    method: "post",
                    url: "/track/track_search_stats",
                    data: t,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    }
                })
            }
        });
    React.useEffect(() => {
        0 == c.length ? k(a.searchHeading.replaceAll("_", " ") + " (" + a.pinnedCourses.length + ")") : k("SEARCH RESULTS (" + c.length + ")")
    }, [c]);
    React.useEffect(() => {
        window.addEventListener("beforeunload", U);
        return () => {
            window.removeEventListener("beforeunload",
                U)
        }
    }, [c, S, y]);
    const U = l => {
            l.preventDefault();
            K();
            return ""
        },
        E = l => {
            N.current || l.which && 13 != l.which || (N.current = !0, M(1), R(!0), setTimeout(() => {
                R(!1)
            }, 250), e(y), C([]), p(!1))
        };
    React.useEffect(() => {
        lazyLoadingImgs("course-image", "search-lazy-load")
    });
    return React.createElement("div", {
            className: "search-container"
        }, React.createElement("div", {
            className: "header"
        }, React.createElement("div", {
            className: "heading"
        }, "I am looking for online training in"), React.createElement("i", {
            onClick: () => {
                K(null, !0);
                w("");
                M(0);
                e("");
                C([]);
                p(a.pinnedCourses)
            },
            className: "is-icon-cross search-bar-trigger"
        })), React.createElement("div", {
            className: "search-bar-container"
        }, React.createElement("input", {
            onKeyPress: E,
            value: v,
            onChange: () => {
                w(event.target.value);
                N.current = !1;
                q(0);
                X(event.target.value)
            },
            type: "text",
            className: "query-input",
            placeholder: "Search trainings here"
        }), React.createElement("div", {
            onClick: E,
            className: "search-icon"
        }, React.createElement("i", {
            className: "is-icon-search"
        })), 0 != y.length ? React.createElement("div", {
                className: "search-recommendation"
            },
            y.map((l, x) => {
                let A = l.name.split(T());
                return React.createElement("a", {
                    onClick: () => K(l.id, !1, "dropdown"),
                    href: "/" + l.url + "?tracking_source=trainings-search-dropdown",
                    key: x,
                    className: "suggestion" + (m == x ? " selected" : ""),
                    onMouseEnter: () => {
                        q(x)
                    }
                }, React.createElement("span", null, A.map(t => t.toLowerCase().trim() === v.toLowerCase().trim() && "" != v ? React.createElement("span", {
                    className: "highlight"
                }, t) : t)))
            })) : ""), V ? React.createElement("div", {
            className: "loader-container"
        }, React.createElement("i", {
            className: "is-icon-loader loader-spinner"
        })) :
        React.createElement(React.Fragment, null, "string" != typeof c && 0 == c.length ? React.createElement("div", {
            className: "empty-search"
        }, "No results found...") : "", React.createElement("div", {
            className: "search-result-container"
        }, React.createElement("span", {
            className: "heading"
        }, f), React.createElement("div", {
            className: "search-content"
        }, g ? g.map(l => React.createElement("a", {
            onClick: () => K(l.id, !1, "tag"),
            href: "/" + l.url + "?tracking_source=trainings-search-tags" + W,
            className: "chip"
        }, l.name)) : React.createElement("div", {
                className: "search-cards"
            },
            (0 == c.length ? a.pinnedCourses : c).map(l => React.createElement("a", {
                onClick: () => K(l.id, !1, "card"),
                href: "/" + l.url + "?tracking_source=trainings-search" + (0 == c.length ? "-no-results" + (W.includes("recommended") ? "-recommended" : "-most-popular") : "-results"),
                className: "course-card"
            }, React.createElement("div", {
                className: "image-container"
            }, React.createElement("div", {
                "data-src": "/cached_uploads/home/images/" + l.url + ".jpg",
                className: "course-image search-lazy-load",
                "data-alt": l.name
            })), React.createElement("div", {
                    className: "card-content"
                },
                React.createElement("div", {
                    className: "course-name"
                }, l.name), l.name.toLowerCase().includes("specialization") ? React.createElement("div", {
                    className: "title-tagline-jos"
                }, "with guaranteed internship") : "", React.createElement("div", {
                    className: "caption"
                }, l.caption), React.createElement("div", {
                    className: "rating-detail"
                }, l.average_rating ? React.createElement(React.Fragment, null, React.createElement("div", {
                    className: "rating"
                }, React.createElement("i", {
                    className: "is-icon-star-filled-s"
                }), React.createElement("span",
                    null, l.average_rating)), React.createElement("div", {
                    className: "vertical-break"
                })) : "", React.createElement("div", {
                    className: "duration"
                }, React.createElement("i", {
                    className: "is-icon-calendar-2"
                }), React.createElement("span", null, l.name.toLowerCase().includes("specialization") ? Math.round(l.duration / 30) + " months" : Math.round(l.duration / 7) + " weeks")))))))))))
};
"use strict";
const loadSearchModal = () => {
    const a = document.querySelector("#search_modal");
    if (a) {
        let c = JSON.parse(a.getAttribute("data-pinned-courses")),
            e = JSON.parse(a.getAttribute("data-all-courses"));
        const f = Object.keys(c)[0];
        c = Object.values(c)[0];
        var b = new Map;
        const k = ["interview-preparation"],
            g = [];
        for (let p = 0; p < e.length; p++) b.get(e[p].id) || k.includes(e[p].url) || (g.push(e[p]), b.set(e[p].id, !0));
        ReactDOM.render(React.createElement(SearchModal, {
            searchHeading: f,
            pinnedCourses: c,
            courseList: g
        }), a)
    }
};

function lazyLoadingImgs(a = "img-responsive", b = "lazy-load") {
    function c(k, g) {
        let p = new Image;
        p.src = k.getAttribute("data-src");
        p.alt = k.getAttribute("data-alt");
        p.classList.add(a);
        p.addEventListener("load", function(v) {
            k.insertAdjacentElement("beforebegin", v.target);
            k.classList.remove(b);
            k.remove()
        }, {
            once: !0
        });
        g && g.unobserve(k)
    }
    const e = document.querySelectorAll("." + b);
    if ("IntersectionObserver" in window) {
        var f = new IntersectionObserver(function(k, g) {
            k.forEach(function(p) {
                p.isIntersecting && setTimeout(function() {
                    c(p.target,
                        g)
                }, 0)
            })
        }, {
            threshold: 0,
            rootMargin: "1200px"
        });
        e.forEach(function(k) {
            f.observe(k)
        })
    } else e.forEach(function(k) {
        setTimeout(function() {
            c(k)
        }, 0)
    })
}
$(() => {
    function a() {
        let d = window.pageYOffset;
        var h = X ? X.offsetHeight : 0,
            r = D.offsetHeight,
            n = T - d;
        T = d;
        D.classList.remove("smoothscroll");
        0 <= h - d ? D.style.top = h - d + "px" : 0 < n ? (D.classList.add("smoothscroll"), D.style.top = "0px", D.classList.add("navbar-down")) : d <= r + h ? D.style.top = h - d + "px" : (D.classList.add("smoothscroll"), D.style.top = -r + "px")
    }

    function b(d) {
        $("html,body").animate({
            scrollTop: $("#" + d).offset().top
        }, "slow")
    }

    function c() {
        var d = $(this).scrollTop();
        scrollMotion = ha <= d ? "top_to_bottom" : "bottom_to_top";
        ia.each(function(h,
            r) {
            if ($(this).isInViewport()) {
                let n = $(this).children(".custom-carousel").data("category");
                n = n.includes("Recommended") ? "Recommended" : n;
                aa.includes(n) || O[n + "2s"] || (O[n + "2s"] = !0, setTimeout(() => {
                    $(this).isInViewport() ? aa.includes(n) || (aa.push(n), "undefined" !== typeof window.dataLayer && window.dataLayer.push({
                        event: F + "2s",
                        category: n,
                        scrollMotion
                    })) : O[n + "2s"] = !1
                }, 2E3));
                ba.includes(n) || O[n + "4s"] || (O[n + "4s"] = !0, setTimeout(() => {
                    $(this).isInViewport() ? ba.includes(n) || (ba.push(n), "undefined" !== typeof window.dataLayer &&
                        window.dataLayer.push({
                            event: F + "4s",
                            category: n,
                            scrollMotion
                        })) : O[n + "4s"] = !1
                }, 4E3));
                ja.includes(n) || (ja.push(n), "undefined" !== typeof window.dataLayer && window.dataLayer.push({
                    event: F,
                    category: n
                }))
            }
        });
        3 > G.length && ra.each(function(h, r) {
            $(this).isInViewport() && (G.includes("Specialization") || ("undefined" !== typeof window.dataLayer && window.dataLayer.push({
                event: F,
                category: "SpecializationCard",
                scrollMotion
            }), G.push("Specialization")), G.includes("Specialization2s") || setTimeout(() => {
                $(this).isInViewport() &&
                    !G.includes("Specialization2s") && (G.push("Specialization2s"), "undefined" !== typeof window.dataLayer && window.dataLayer.push({
                        event: F + "2s",
                        category: "SpecializationCard",
                        scrollMotion
                    }))
            }, 2E3), G.includes("Specialization4s") || setTimeout(() => {
                $(this).isInViewport() && !G.includes("Specialization4s") && (G.push("Specialization4s"), "undefined" !== typeof window.dataLayer && window.dataLayer.push({
                    event: F + "4s",
                    category: "SpecializationCard",
                    scrollMotion
                }))
            }, 4E3))
        });
        ha = d
    }

    function e() {
        $(sa).isInViewport() && ("undefined" !==
            typeof window.dataLayer && window.dataLayer.push({
                event: ca
            }), ka = !0)
    }

    function f(d) {
        d = d.parent(".custom-carousel").data("category");
        d = d.includes("Recommended") ? "Recommended" : d;
        void 0 == la[d] && (la[d] = !0, window.dataLayer.push({
            event: Y,
            sectionScrolled: d
        }))
    }

    function k(d) {
        let h = $(".carousel");
        d ? h.carousel({
            pause: !1,
            interval: 5E3
        }) : h.carousel("pause")
    }

    function g(d) {
        d ? document.getElementById("vimeo-video").addEventListener("timeupdate", function() {
            ma = ta.currentTime
        }) : p({
            event: (isSysSLabActive ? "sysSlabVideoPlayed" :
                "sysVideoPlayed") + da,
            duration: Math.round(ma)
        })
    }

    function p(d) {
        "undefined" === typeof window.dataLayer || na.includes(d.event) || (na.push(d.event), window.dataLayer.push(d))
    }
    lazyLoadingImgs();
    $(".carousel").carousel({
        interval: 5E3
    });
    let v = 0 !== $("#cross-sell-banner-container").length;
    var w = $("#banner-content").attr("timer-show"),
        m = $("#banner-content").attr("timer-type");
    let q = $("#banner-content").attr("timer-endDate"),
        y = $("#banner-content").attr("timer-cross_sell_offer_end_date"),
        C = 0 !== $("#skill-pass-timer-container").length,
        V = $("#banner-content").attr("timer-skill_pass_end_date");
    if ("1" === w && ("campaign-timer" === m || "extended-campaign-timer-and-ribbon" === m)) var R = !1,
        S = setInterval(function() {
            var d = N();
            "00h: 00m: 00s" === d && (R = !0);
            R ? ($(".timer-container #timer").html("00h: 00m: 00s"), clearInterval(S), setTimeout(function() {
                location.reload()
            }, 2E3)) : ($(".timer-container #timer").html(d), v && (d = W(), $(".timer-container #timer-remaining").html(d)))
        }, 1E3);
    if (V && C) {
        let d = !1,
            h = setInterval(function() {
                "00h: 00m: 00s" === N() && (d = !0);
                if (d) $("#skill-pass-timer-container #skill-pass-timer").html("00h: 00m: 00s"),
                    clearInterval(h), setTimeout(function() {
                        location.reload()
                    }, 2E3);
                else if (C) {
                    let r = Z(V);
                    $("#skill-pass-timer-container #skill-pass-timer").html(r)
                }
            }, 1E3)
    }
    let M = function(d) {
            var h = Math.floor(d / 864E5),
                r = Math.floor(d % 864E5 / 36E5),
                n = Math.floor(d % 36E5 / 6E4);
            d = Math.floor(d % 6E4 / 1E3);
            10 > r && (r = "0" + r);
            10 > n && (n = "0" + n);
            10 > d && (d = "0" + d);
            return (0 >= h ? "" : h + "d: ") + r + "h: " + n + "m: " + d + "s"
        },
        N = function() {
            var d = (new Date).getTime();
            return M(1E3 * q - d)
        },
        W = function() {
            var d = (new Date).getTime();
            return M(1E3 * y - d)
        },
        Z = function(d) {
            var h =
                (new Date).getTime();
            return M(1E3 * d - h)
        },
        T = 0,
        D = document.getElementById("navbar"),
        X = document.getElementById("general_ribbon");
    a();
    $(window).on("scroll", function() {
        a()
    });
    $(window).resize(function() {
        a()
    });
    $(window).on("load", function() {
        if (window.location.search) {
            const d = K(window.location.search);
            d.tracking_source && "employer" === d.tracking_source && (id = "know-more", b(id))
        }
    });
    let K = function() {
        let d = {};
        window.location.search.replace(RegExp("([^?=&]+)(=([^&]*))?", "g"), function(h, r, n, u) {
            d[r] = u
        });
        return d
    };
    $(".facebook-ad-cta").on("click",
        function() {
            $("html,body").animate({
                scrollTop: $("#know-more").offset().top - 16
            }, "slow")
        });
    var U = document.location.hash;
    1 < U.split("/").length && setTimeout(function() {
        b(U.split("/")[1])
    }, 1E3);
    w = $(".custom-carousel");
    var E = "Desktop",
        l = 3;
    991 >= $(window).width() && 640 < $(window).width() ? (E = "Tablet", l = 2) : 640 >= $(window).width() && (E = "Mobile", l = 1);
    w.touch();
    for (m = 0; m < w.length; m++) {
        var x = $(w[m]),
            A = x.find(".slider"),
            t = A.find(".slider-item"),
            B = t.length,
            P = A.outerWidth();
        B = Math.ceil(B / l);
        var Q = t.first().outerWidth(!0),
            ua = parseInt(-t.first().offset().left);
        Q = Math.abs(Math.round(ua / Q));
        x = document.getElementById("indicators-" + x.data("category"));
        parseInt(t.last().offset().left) <= P / 2 && (Q = B - 1);
        for (t = 0; t < B; t++) P = document.createElement("div"), P.className = "indicator", "Mobile" == E ? t == Q && (P.className = "active indicator") : 0 == t && (P.className = "active indicator"), x.appendChild(P);
        "Mobile" !== E && (Q = 0);
        B = A.parent().find(".indicator");
        B = $(B[Q]);
        A = $(A.parent().find(".indicators"));
        B = B.position().left + B.outerWidth(!0) / 2 + A.scrollLeft() -
            A.width() / 2;
        A.animate({
            scrollLeft: B
        })
    }
    $(".slider").on("scroll", function() {
        var d = $(this),
            h = d.find(".slider-item"),
            r = h.length,
            n = d.outerWidth(),
            u = h.first().outerWidth(!0),
            H = parseInt(-h.first().offset().left);
        u = Math.round(H / u);
        r = Math.ceil(r / l);
        H = d.parent().find(".indicator");
        d.parent(".custom-carousel").data("category").includes("Recommended");
        for (var z = 0; z < H.length; z++)
            if ($(H[z]).hasClass("active")) var L = z;
        parseInt(h.last().offset().left) <= n / 2 && (u = r - 1);
        u !== L && ($(H).removeClass("active"), h = $(H[u]), h.addClass("active"),
            d = $(d.parent().find(".indicators")), h = h.position().left + h.outerWidth(!0) / 2 + d.scrollLeft() - d.width() / 2, d.animate({
                scrollLeft: h
            }))
    });
    w.on("swipeRight", function() {
        "Mobile" != E && $(this).find(".control.left").trigger("click")
    });
    w.on("swipeLeft", function() {
        "Mobile" != E && $(this).find(".control.right").trigger("click")
    });
    $(".custom-carousel .control").on("click", function() {
        if (!$(this).hasClass("disabled")) {
            var d = $(this).parents(".custom-carousel").find(".slider"),
                h = $(this).parents(".navigation-container");
            if (!d.hasClass("in-transition") && "none" != h.css("display")) {
                d.addClass("in-transition");
                h = d.find(".slider-item");
                var r = h.length,
                    n = d.outerWidth(),
                    u = h.first().outerWidth(!0),
                    H = parseInt(-h.first().position().left),
                    z = Math.ceil(r / l),
                    L = d.parent().find(".indicator"),
                    I = d.parent(".custom-carousel").data("category");
                I = I.includes("Recommended") ? "Recommended" : I;
                for (I = 0; I < L.length; I++)
                    if ($(L[I]).hasClass("active")) var J = I;
                u = $(this).hasClass("left") ? J == z - 1 ? r * u - (u * l * (z - 2) + n) : u * l : J == z - 2 ? r * u - (u * l * (z - 2) + n) : u * l;
                if ($(this).hasClass("left")) --J,
                    u = H - u;
                else {
                    if (J === z) return;
                    J += 1;
                    u = H + u
                }
                0 < J ? d.parent().find(".control.left").removeClass("disabled") : d.parent().find(".control.left").addClass("disabled");
                J == z - 1 ? d.parent().find(".control.right").addClass("disabled") : d.parent().find(".control.right").removeClass("disabled");
                h.animate({
                    left: -u
                }, 600, function() {
                    d.removeClass("in-transition")
                });
                L = d.parent().find(".indicator");
                $(L).removeClass("active");
                z = $(L[J]);
                z.addClass("active");
                h = $(d.parent().find(".indicators"));
                z = z.position().left + z.outerWidth(!0) /
                    2 + h.scrollLeft() - h.width() / 2;
                h.animate({
                    scrollLeft: z
                })
            }
        }
    });
    0 < $(".lottie-container").length && ((new Date).toISOString().split("T"), lottieContainers = $(".lottie-wrapper"), lottieContainers.each(function() {
        bodymovin.loadAnimation({
            container: this,
            path: this.getAttribute("data-src"),
            renderer: "svg",
            loop: !0,
            autoplay: !0,
            name: this.getAttribute("data-eventName")
        })
    }));
    0 < $(".isrp-lottie-container").length && (lottieContainers = $(".isrp-lottie-wrapper"), lottieContainers.each(function() {
        console.log();
        bodymovin.loadAnimation({
            container: this,
            path: this.getAttribute("data-src"),
            renderer: "svg",
            loop: !0,
            autoplay: !0,
            name: this.getAttribute("data-eventName")
        })
    }));
    w = $(".course-card");
    var ha = 0,
        ja = [],
        aa = [],
        ba = [],
        ra = $(".specialization-card"),
        G = [],
        ia = $(".category-container"),
        F = "";
    m = ia[0].id;
    var ca = "",
        sa = $("#homepage-carousel"),
        ka = !1,
        O = [],
        oa = !1;
    m.includes("Recommended") ? (F = "scrolledToCategoryRecommendations", ca = "bannerViewWithRecommendations") : m.includes("Popular") ? (F = "scrolledToCategoryMostPopular", ca = "bannerViewWithMostPopular") : F = "scrolledToCategory";
    $.fn.isInViewport = function() {
        var d = $(this).offset().top,
            h = d + $(this).height();
        h = $(this).is(".specialization-card") || $(this).is("#homepage-carousel") ? h - $(this).height() / 2 : h - (370 < $(this).height() ? 50 : 18);
        var r = $(window).scrollTop(),
            n = r + $(window).height();
        return d >= r && h <= n
    };
    e();
    $(window).scroll(function() {
        c();
        ka || e();
        !oa && $("#navbar").is(".navbar-down") && (oa = !0, "undefined" !== typeof window.dataLayer && window.dataLayer.push({
            event: "headerVisibility"
        }))
    });
    let pa = [];
    m = document.querySelector(".category-container").id;
    var Y = m.includes("Recommended") ? "Recommendations" : m,
        ea = Y;
    Y = "scrolledSection" + Y;
    ea = "clickedSection" + ea;
    $(".category-selector").mouseover(function() {
        S = setTimeout(function() {
            var d = $(".active-category").attr("id");
            pa.includes(d) || (pa.push(d), d = d.replace("menu_", ""), "undefined" !== typeof window.dataLayer && window.dataLayer.push({
                event: "hoverToTheDropdownCategory",
                hoverCategory: d
            }))
        }, 85)
    });
    w.each(function(d, h) {
        $(h).click(function() {
            var r = $(h);
            let n = r.parents(".custom-carousel"),
                u = n.data("category");
            u = u.includes("Recommended") ?
                "Recommended" : u;
            r = n.find(".slider-item").index(r.parents(".slider-item")) + 1;
            "undefined" !== typeof window.dataLayer && window.dataLayer.push({
                event: ea,
                sectionName: u,
                cardNumber: r
            })
        })
    });
    var la = {};
    $(".slider").on("scroll", function() {
        var d = $(this);
        f(d)
    });
    $(".custom-carousel .control").on("click", function() {
        var d = $(this).parents(".custom-carousel").find(".slider");
        f(d)
    });
    $("#digital-marketing-specialization-know-more").click(function() {
        "undefined" !== typeof window.dataLayer && window.dataLayer.push({
            event: "clickedToSpecializationCard"
        })
    });
    $("#data-science-specialization-know-more").click(function() {
        "undefined" !== typeof window.dataLayer && window.dataLayer.push({
            event: "clickedToSpecializationCard"
        })
    });
    $("#human-resource-management-specialization-know-more").click(function() {
        "undefined" !== typeof window.dataLayer && window.dataLayer.push({
            event: "clickedToSpecializationCard"
        })
    });
    let qa = !0;
    $("#hindi_section").on("click", () => {
        qa && sendPageSpeedData("?track_scroll=hindi_language_banner");
        $("html,body").animate({
                scrollTop: $("#OnlineTrainingsHindi").offset().top
            },
            "slow");
        qa = !1
    });
    $(".search-bar-trigger").one("click", loadSearchModal);
    $(document).on("click", ".search-bar-trigger", function() {
        var d = $("#search_modal");
        d.hasClass("hide") ? ($("body").addClass("modal-open"), d.removeClass("hide"), d.addClass("show")) : ($("body").removeClass("modal-open"), d.removeClass("show"), d.addClass("hide"));
        $(".query-input").focus()
    });
    $.ajax("/home/retargeting_tracking", {
        type: "GET"
    });
    w = 768 >= $(window).width();
    $("#demo-video-modal").on("show.bs.modal", function(d) {
        d = d.target.dataset.demoVideoId;
        $(this).find("#vimeo-video").attr("src", "https://trainings-test.internshala.com/uploads/campaigns/high-visibility-SYS/ad-films/" + d + ".mp4");
        k(!1);
        g(!0)
    });
    w && $("#demo-video-modal").attr("data-backdrop", "static");
    w && $("#sysLeadForm").attr("data-backdrop", "static");
    $("#demo-video-modal").on("hide.bs.modal", function(d) {
        $(this).find("#vimeo-video").attr("src", "");
        k(!0);
        g(!1)
    });
    isSysSLabActive = $(".shuruaat_yahin_se").length;
    let na = [],
        fa = !1;
    $(".high-visibility-cta").on("click", function(d) {
        fa = !0;
        da = "ByCTA";
        p({
            event: isSysSLabActive ? "sysSlabCTAClick" : "sysCTAClick"
        })
    });
    $(".high-visibility-banner").on("click", function() {
        fa || (da = "ByBanner", p({
            event: isSysSLabActive ? "sysSlabBannerClick" : "sysBannerClick"
        }));
        fa = !1
    });
    let ma = 0,
        da = "";
    const ta = document.querySelector("#vimeo-video");
    $("#sys-banner-lead").click(d => {
        var h = $("#sys-banner-form").find('input[name="email"]').val(),
            r = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        "" != h && r.test(h) && (h = {
                email: h
            }, $("#sysLeadForm").modal("hide"), d.preventDefault(),
            d = ReactCommon.getCookie(ReactCommon.COOKIE_NAMES.CSRF), $.post("/home/sys_banner_lead_submit/", Object.assign({}, h, {
                csrf_test_name: d
            }), function(n) {
                n = JSON.parse(n);
                n.success ? setTimeout(() => {
                    success_modal("Enroll in any of your favorite trainings today to avail the discount :)", "Your coupon code is <span style='color: #FF8C00;'>SHURUAAT10!</span>", "Choose training", "/#/know-more")
                }) : n.errorMessage && error_modal(n.errorMessage, "", n.buttonValue, n.errorPage)
            }))
    });
    $("#sysLeadForm").on("hide.bs.modal", function(d) {
        k(!0)
    });
    $(".high-visibility-banner").click(function() {
        $("#high-visibility-banner-leads").length ? $("#demo-video-modal").hasClass("show") || $("#sysLeadForm").modal("show") : $("#demo-video-modal").modal("show")
    });
    $("#sysLeadForm").on("show.bs.modal", function(d) {
        k(!1)
    });
    $("#sys-watch-cta").click(function(d) {
        d.stopPropagation();
        $("#sysLeadForm").hasClass("show") || $("#demo-video-modal").modal("show")
    });
    $("#skill-pass-banner-container").click(() => {
        window.location.href = "/internshala_skill_pass?utm_source=skillpass_hp_banner&payment_source=skillpass_hp_banner&payment_init_source=skillpass_hp_banner"
    })
});
document.addEventListener("DOMContentLoaded", function() {
    var a = document.getElementById("page-tracking-param");
    if (a) {
        var b = a.getAttribute("data-page-tracking-param");
        a = a.getAttribute("data-course-url");
        ["sp", "hp"].includes(b) && $.ajax("/page_landing_tracker/track_user", {
            data: {
                page: b,
                course_url: a
            },
            type: "POST"
        })
    }
});