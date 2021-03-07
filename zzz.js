// ==UserScript==
// @name         zzz
// @namespace    elective
// @match        https://elective.pku.edu.cn/*
// @grant        none
// ==/UserScript==
"use strict";
if (!window.zzz) window.zzz = {};
zzz.version = 20201114;
if (!zzz.value) zzz.value = {};
if (zzz.inited) throw new Error("zzz re-init!");
zzz.eval = function (string) {
    return Function("'use strict';return " + string)();
};
zzz.isInt = Number.isInteger ? Number.isInteger : function (number) {
    return number - 0 === Math.ceil(number);
};
zzz.equal = function (a, b) {
    return a === b;
};
zzz.equal.num = function (a, b) {
    return a - 0 === b - 0;
};
zzz.equal.type = function (obj, type) {
    type = type.toString().toLowerCase();
    if (type === "array" || type === "arr") {
        return obj instanceof Array;
    } else if (type === "element") {
        return obj instanceof Object && obj instanceof HTMLElement;
    } else if (type === "null") {
        return obj === null;
    } else if (type === "nan") {
        return isNaN(obj) && typeof obj == "number";
    } else if (type === "integer" || type === "int") {
        return typeof obj === "number" && zzz.isInt(obj);
    } else {
        return type === (typeof obj).toLowerCase();
    }
};
zzz.toNum = function (text) {
    var i = 0, j = 0, len = text.length, result = 0, isNegative = 0, isInt = 1;
    //find out if there is a number and if it is a negative.
    for (; i < len; i++) {
        if (text[i] === '-') {
            isNegative = 1;
        } else if (text[i] <= '9' && text[i] >= '0') break;
    }
    //as supposed, i should have been at the number's first position.
    if (i === len || text[i] > '9' || text[i] < '0') return NaN;
    else {
        //find out if it is an integer or not
        for (j = i; i < len; i++) {
            if (text[i] === '.') {
                isInt = 0;
            } else if (text[i] < '0' || text[i] > '9') break;
        }
        if (isInt) result = parseInt(text.substr(j, i - j));
        else result = parseFloat(text.substr(j, i - j));
        if (isNegative) result = 0 - result;
        return result;
    }
};
zzz.random = function () {
    if (arguments.length === 0) return Math.random();
    else if (arguments.length === 1) {
        if (zzz.equal.type(arguments[0], "string")) return arguments[0][zzz.random.int(0, arguments[0].length - 1)];
        else if (zzz.equal.type(arguments[0], "array")) return zzz.random.array(arguments[0]);
        else if (zzz.equal.type(arguments[0], "object")) {
            var items = [];
            for (var i in arguments[0]) items.push(i);
            return zzz.random.array(items);
        }
    } else return zzz.random.array(arguments);
};
zzz.random.int = function (min_included, max_included) {
    if (max_included === min_included) return min_included;
    else if (max_included < min_included) {
        return zzz.random.int(max_included, min_included);
    }
    return Math.floor(min_included + (max_included - min_included + 1) * Math.random());
};
zzz.random.color = function (setting) {
    let r_min = 0, r_max = 255, g_min = 0, g_max = 255, b_min = 0, b_max = 255;
    let a_min = 0, a_max = 100;//100x
    if (setting.r) {
        if (setting.r.min) r_min = setting.r.min;
        if (setting.r.max) r_max = setting.r.max;
    }
    if (setting.g) {
        if (setting.g.min) g_min = setting.g.min;
        if (setting.g.max) g_max = setting.g.max;
    }
    if (setting.b) {
        if (setting.b.min) b_min = setting.b.min;
        if (setting.b.max) b_max = setting.b.max;
    }
    if (setting.a) {
        if (setting.a.min) a_min = setting.a.min * 100;
        if (setting.a.max) a_max = setting.a.max * 100;
    }
    if (!setting.rgba) return "rgb(" + zzz.random.int(r_min, r_max) + ',' + zzz.random.int(g_min, g_max) + ',' + zzz.random.int(b_min, b_max) + ')';
    else return "rgba(" + zzz.random.int(r_min, r_max) + ',' + zzz.random.int(g_min, g_max) + ',' + zzz.random.int(b_min, b_max) + ',' + zzz.random.int(a_min, a_max) / 100 + ')';
};
zzz.random.string = function (len) {
    if (!len) len = 10;
    var str = "";
    for (var i = 0; i < len; i++) {
        str += zzz.value.validCharacter[zzz.random.int(0, zzz.value.validCharacter.length - 1)];
    }
    return str;
};
zzz.random.array = function (arr) {
    if (arr.length) return arr[zzz.random.int(0, arr.length - 1)];
    else return null;
};
zzz.appr = Math.round;
zzz.down = Math.floor;
zzz.up = Math.ceil;
zzz.abs = Math.abs;
zzz.code = {
    b64: {
        decode: function (base64code) {
            return window.atob(base64code);
        },
        encode: function (text) {
            return window.btoa(text);
        },
    },
    head: function (type, isBase64) {
        type = type.toLowerCase();
        var result = "data:", b64 = ";base64";
        if (type === "text" || type === "string") return result + "text/plain,";
        else if (type === "html") return result + "text/html," + isBase64 ? b64 : "";
        else if (type === "css") return result + "text/css," + isBase64 ? b64 : "";
        else if (type === "js" || type === "javascript") return result + "text/javascript" + isBase64 ? b64 : "";
        var image = {png: "png", jpg: "jpeg", jpeg: "jpeg", bmp: "bmp", gif: "gif", ico: "x-icon"};
        if (image[type]) return "data:image/" + image[type] + b64;
    },
    uri: {
        encode: function (text) {
            return window.encodeURI(text);
        },
        decode: function (uri) {
            return window.decodeURI(uri);
        }
    },
    path: {
        encode: function (text) {
            return window.encodeURIComponent(text);
        },
        decode: function (component) {
            return window.decodeURIComponent(component);
        }
    }
};
class ztimeStructure {
    constructor(time) {
        this.year = time.year || 0;
        this.month = time.month || 0;
        this.day = time.day || 0;
        this.hour = time.hour || 0;
        this.minute = time.minute || 0;
        this.second = time.second || 0;
        this.milisecond = time.milisecond || 0;
        this.negative = time.negative || false;
    }
}
zzz.time = {
    convertFromDate: function (date) {
        if (date instanceof Date) {
            var result = new ztimeStructure({
                second: date.getSeconds(),
                minute: date.getMinutes(),
                hour: date.getHours(),
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear()
            });
            //console.log(date.getSeconds(), date.getMinutes(), date.getHours(), date.getDate(), date.getMonth(), date.getFullYear());
            return result;
        } else throw new Error("zzz.time.convertFromDate requires a Date.");
    },
    readDate: function (ztime) {
        if (ztime instanceof ztimeStructure) {
            var result = [0, 0, 0, 0, 0, 0];
            result[0] = ztime.second;
            result[1] = ztime.minute;
            result[2] = ztime.hour;
            result[3] = ztime.day;
            result[4] = ztime.month;
            result[5] = ztime.year;
            return result;
        } else throw new Error("zzz.time.readDate requires a ztimeStructure.");
    },
    convertToDate: function (ztime) {
        if (!(ztime instanceof ztimeStructure)) return;
        var result = new Date();
        result.setFullYear(ztime.year);
        result.setMonth(ztime.month - 1);
        result.setDate(ztime.day);
        result.setHours(ztime.hour);
        result.setMinutes(ztime.minute);
        result.setSeconds(ztime.second);
        return result;
    },
    now: function () {
        return this.convertFromDate(new Date());
    },
    getWeek: function (ztime) {
        if (ztime instanceof Date) {
            return ztime.getDay() || 7;
        } else {
            return this.convertToDate(ztime).getDay();
        }
    },
    getTime: function () {
        var result = zzz.time.now();
        return [result.second, result.minute, result.hour];
    },
    getDate: function () {
        var result = zzz.time.now();
        return [result.day, result.month, result.year];
    },
    test: function (func, loop) {
        if (!loop) loop = 1;
        var name = func.name ? ("anonymous function" + zzz.random.string(5)) : func.name;
        console.log(name + " count start" + (loop > 1 ? " for " + loop + " times" : ""));
        console.time(name);
        for (var i = 0; i < loop; i++) func();
        console.timeEnd(name);
    },
    stringify: function (ztime) {
        var result = "", cn = "chinesenumber";
        result += ztime.year ? (zzz.string.stringify(ztime.year, "chinese") + "年") : "";
        result += ztime.month ? (zzz.string.stringify(ztime.month, cn) + "月") : "";
        result += ztime.day ? (zzz.string.stringify(ztime.day, cn) + "日") : "";
        result += ztime.hour ? (zzz.string.stringify(ztime.hour, cn) + "时") : "";
        result += ztime.minute ? (zzz.string.stringify(ztime.minute, cn) + "分") : "";
        result += ztime.second ? (zzz.string.stringify(ztime.second, cn) + "秒") : "";
        result += ztime.milisecond ? (zzz.string.stringify(ztime.milisecond, cn) + "毫秒") : "";
        if (!result) result = "零秒";
        return result;
    },
    diff: function (ztime1, ztime2) {
        var t1 = zzz.time.convertToDate(ztime1).getTime(), t2 = zzz.time.convertToDate(ztime2).getTime();
        var difftime = t2 - t1;
        var isNegative = difftime < 0;
        var result = zzz.time.convertFromDate(new Date(zzz.abs(difftime)));
        result.negative = isNegative;
        result.year -= 1970;
        if (result.year < 0) {
            //TODO : negative years are meant to be corrected.
        }
        result.month--;
        result.day--;
        result.hour -= 8;
        result.minute--;
        result.second--;
        return result;
    },
    approximate: function (different) {
        if (!(different instanceof ztimeStructure)) return;
        console.log(different);
        var result = "";
        var cn = "chineseoral";
        var isNegative = different.negative;
        var mostDifferent = 5;
        var sequence = ["year", "month", "day", "hour", "minute", "second"];
        var name = ["年", "个月", "天", "小时", "分钟", "秒"];
        for (let i = 0; i < 6; i++) {
            if (different[sequence[i]] > 0) {
                mostDifferent = i;
                break;
            }
        }
        console.log(different, mostDifferent);
        return zzz.string.stringify(different[sequence[mostDifferent]], cn) + name[mostDifferent] + (isNegative ? "前" : "后");
    },
    create: function (year, month, day, hour, minute, second, milisecond) {
        return new ztimeStructure({
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            second: second,
            milisecond: milisecond
        })
    },
    UTC: function (ztime) {
        if (!ztime) ztime = new Date();
        else if (ztime instanceof ztimeStructure) ztime = zzz.time.convertToDate(ztime);
        else if (!(ztime instanceof Date)) return;
        return ztime.toUTCString();
    },
    ms: function (ztime) {
        if (ztime instanceof ztimeStructure) {
            return ztime.milisecond +
                ztime.second * 1000 +
                ztime.minute * 1000 * 60 +
                ztime.hour * 1000 * 60 * 60 +
                ztime.day * 1000 * 60 * 60 * 24 +
                ztime.month * 1000 * 60 * 60 * 24 * 30 +
                ztime.year * 1000 * 60 * 60 * 24 * 30 * 365;
        } else return 0;
    },
    data: {},
    loop: function (func, time, isLoop, isClear, name) {
        var number = -1;
        if (isLoop) {
            if (isClear) {
                number = zzz.time.data[func];
                if (number === undefined) throw new Error("clearInterval unrecorded function");
                number = number[time];
                if (number === undefined) throw new Error("clearInterval unrecorded function time");
                clearInterval(number);
            } else {
                number = setInterval(func, time);
                if (!zzz.time.data[func]) zzz.time.data[func] = [];
                zzz.time.data[func][time] = number;
            }
        } else {
            if (isClear) {
                number = zzz.time.data[func];
                if (number === undefined) throw new Error("clearInterval unrecorded function");
                number = number[time];
                if (number === undefined) throw new Error("clearInterval unrecorded function time");
                clearTimeout(number);
            } else {
                number = setTimeout(func, time);
                if (!zzz.time.data[func]) zzz.time.data[func] = [];
                zzz.time.data[func][time] = number;
            }
        }
        if (name) zzz.time.data[name] = number;
        return number;
    },
    clear: function (numberOrName, isLoop) {
        var number = (typeof numberOrName === "string") ? zzz.time.data[numberOrName] : numberOrName;
        if (zzz.equal.type(number, "integer")) throw new Error("zzz.time.clear receives param not of number or string");
        if (isLoop) clearInterval(number);
        else clearTimeout(number);
    }
};
zzz.storage = {
    init: function () {
        if (window.localStorage) {
            this.db = window.localStorage;
            this.get = function (key) {
                return window.localStorage.getItem(key) || null;
            };
            this.set = function (key, value) {
                return window.localStorage.setItem(key, value);
            };
            this.del = function (key) {
                return window.localStorage.removeItem(key);
            }
        } else if (document.cookie) {
            this.db = document.cookie;
            this.get = function (key) {
                var cookie = document.cookie.split(";");
                var index;
                for (var i of cookie) {
                    index = i.indexOf("=");
                    if (i.slice(0, index) === key) return i.slice(index + 1);
                }
                return null;
            };
            this.readCookie();
        }
    },
    add: function (item, key, value) {
        var obj = JSON.parse(zzz.storage.get(item) || "{}");
        obj[key] = value;
        var result = JSON.stringify(obj);
        zzz.storage.set(item, result);
    },
    json: function (key) {
        return JSON.parse(zzz.storage.get(key));
    },
    readCookie: function () {
        var cookie = document.cookie.split(";");
        var result = zzz.storage.cookie;
        var index = 0;
        for (var i of cookie) {
            index = i.indexOf("=");
            result[i.slice(0, index)] = i.slice(index + 1);
        }
        return zzz.storage.cookie;
    },
    getc: function (key) {
        zzz.storage.readCookie();
        var result = zzz.storage.cookie[key];
        if (result) return result;
        else return null;
    },
    setc: function (key, value, expire) {
        zzz.storage.cookie[key] = value;
        zzz.storage.expire[key] = expire || zzz.storage.setDiffTime();
        zzz.storage.refreshCookie();
    },
    delc: function (key) {
        document.cookie = key + "=" + zzz.storage.cookie[key] + ";expires=" + (new Date()).toGMTString() + ";";
        delete zzz.storage.cookie[key];
    },
    setDiffTime: function (diffztime) {
        if (diffztime === undefined || diffztime === null) diffztime = zzz.value.storage.defaultExpire * 1000;
        else {
            if (diffztime instanceof Date) diffztime = diffztime.getTime();
            else if (diffztime instanceof ztimeStructure) diffztime = zzz.time.ms(diffztime);
            else if (typeof diffztime === "string") diffztime = zzz.toNum(diffztime);
        }
        var currentTime = new Date();
        currentTime.setTime(currentTime.getTime() + diffztime);
        return currentTime.toGMTString();
    },
    setTime: function (time) {
        if (time instanceof ztimeStructure) time = zzz.time.convertToDate(time);
        return time.toGMTString();
    },
    refreshCookie: function () {
        var cookieText = "";
        for (let i in zzz.storage.cookie) {
            cookieText = i + "=" + zzz.storage.cookie[i] + ";";
            if (zzz.storage.expire[i]) cookieText += "expires=" + zzz.storage.expire[i] + ";";
            document.cookie = cookieText;
        }
    },
    c: function () {
        if (arguments.length === 0) return zzz.storage.readCookie();
        else if (arguments.length === 1) return zzz.storage.getc(arguments[0]);
        else if (arguments.length === 2) {
            if (zzz.equal.type(arguments[1], "object")) {
                for (let i in arguments[1]) {
                    zzz.storage.cookie[i] = arguments[1][i];
                }
                zzz.storage.refreshCookie();
            } else {
                zzz.storage.setc(arguments[0], arguments[1]);
            }
        } else if (arguments.length === 3) zzz.storage.setc(arguments[0], arguments[1], arguments[2])
    },
    cookie: {},
    expire: {}
};
zzz.browser = {
    cookie: window.navigator.cookieEnabled,
    online: window.navigator.onLine,
    uri: window.location.href,
    host: window.location.hostname,
    path: window.location.pathname,
    protocol: window.location.protocol,
    ie: !!window.attachEvent,
    title: document.title,
    back: history.back,
    forward: history.forward,
    replace: location.replace,
    open: function (path, name, type) {
        console.log(path, name, type);
        window.open(path, name, type);
    }
};
zzz.browser.open.inner = function (settings) {
    if (settings === undefined) return;
    let src;
    if (zzz.equal.type(settings, "string")) {
        src = settings;
    } else {
        src = settings.src;
        delete settings.src;
    }
    if (!src) return;
    var node = zzz.create("iframe");
    var default_settings = {
        frameborder: 0,
        name: undefined,
        height: undefined,
        scrolling: false,
        width: undefined,
        transparent: false
    };
    //transparent
    if (settings.transparent) {
        zzz.set(node, "allowtransparency", "true");
        zzz.set.style("backgroundColor", "transparent");
    }
    node.src = src;
    zzz.addAttr(node, settings);
    return node;
};
zzz.addAttr = function (obj, key_value_set) {
    for (let i in key_value_set) {
        obj[i] = key_value_set[i];
    }
};
zzz.appendAttr = function (obj, key, value) {
    obj[key] = value;
    var returnObject = {
        func: function (key, value) {
            this.obj[key] = value;
        },
        obj: obj
    };
    return returnObject;
};
zzz.browser.collectData = {
    screen: function () {
        var a = document && document.documentElement && document.documentElement.clientHeight || 0,
            b = window.innerHeight || 0, c = document && document.body && document.body.clientHeight || 0;
        zzz.browser.screenY = Math.max(a, b, c);
        a = document && document.documentElement && document.documentElement.clientWidth;
        b = window.innerWidth;
        c = document && document.body && document.body.clientWidth;
        zzz.browser.screenX = Math.max(a, b, c);
    },
    time: function () {
        zzz.browser.time = zzz.time.now();
    },
    fullscreen: function () {
        zzz.browser.hasFullscreen = document.fullscreenEnabled;
    },
    resizeObserver: function () {
        zzz.browser.hasResizeObserver = !!window.ResizeObserver;
    },
    notification: function () {
        zzz.browser.hasNotification = !!window.Notification;
        zzz.browser.canNotify = window.Notification && window.Notification.permission !== "denied";
    }
};
zzz.browser.init = function () {
    for (var i in zzz.browser.collectData) zzz.browser.collectData[i]();
};
zzz.get = function (name) {
    if (name[0] === '.') return zzz.get.cls(name.substr(1));
    else if (name[0] === '#') return zzz.get.id(name.substr(1));
    else return zzz.get.tag(name);
};
zzz.get.id = function (id) {
    return document.getElementById(id);
};
zzz.get.cls = function (className) {
    return document.getElementsByClassName(className);
};
zzz.get.tag = function (tagName) {
    return document.getElementsByTagName(tagName);
};
zzz.get.attr = function (element, attribute) {
    return element.getAttribute(attribute);
};
zzz.get.style = function (element, style) {
    return getComputedStyle(element)[style];
};
zzz.create = function (tag, attributes, styles, parentNode) {
    var element = document.createElement(tag);
    if (attributes) {
        for (var i of ["innerText", "className", "innerHTML", "id", "name"]) {
            if (attributes[i]) element[i] = attributes[i];
            //delete attributes[i];
        }
        for (var i in attributes) element.setAttribute(i, attributes[i]);
    }
    if (styles) {
        zzz.anim.set(element, styles);
    }
    if (parentNode) parentNode.appendChild(element);
    return element;
};
zzz.set = function (element, attribute, value) {
    element.setAttribute(attribute, value);
};
zzz.set.style = function (element, attr, value) {
    element.style[attr] = value;
};
zzz.incidence = {
    index: 0,
    init: function () {
        //addEvent
        if (document.body.addEventListener) {
            zzz.incidence.specificEventBinder = 0;
        } else if (document.body.attachEvent) {
            zzz.incidence.specificEventBinder = 1;
        } else zzz.incidence.specificEventBinder = 2;
        //start mousemove
        zzz.incidence.bind(document.body, "mousemove", zzz.incidence.mousemove);
    },
    bind: function (element, type, func, isCapture) {
        //fix for Firefox scroll
        if (type === "scroll") {
            if (zzz.browser.type === "firefox") {
                type = "DOMMouseScroll";
            } else {
                type = "mousewheel";
            }
        }
        //resizeObserver API
        if (type === "resize") {
            if (zzz.browser.hasResizeObserver) {
                return zzz.incidence.bindResizeObserver(element, func);
            }
        }
        if (zzz.incidence.specificEventBinder === 0) {
            return element.addEventListener(type, func, isCapture);
        } else if (zzz.incidence.specificEventBinder === 1) {
            return element.attachEvent("on" + type, func);
        } else {
            if (element["on" + type]) {
                var oldFunc = element["on" + type], newFunc = function () {
                    oldFunc();
                    func();
                };
                element["on" + type] = newFunc;
            } else
                element["on" + type] = func;
        }
    },
    erase: function (element, type, func, isCapture) {
        //TODO : rewrite with .apply
        if (zzz.incidence.specificEventBinder === 0) {
            element.removeEventListener(type, func);
        } else if (zzz.incidence.specificEventBinder === 1) {
            element.removeEventListener(type, func);
        } else {
            console.log("unable to unbind the function.")
        }
    },
    interpret: function (event) {
        var interpretation = {
            mouse: 0
            ,
            client: [event.clientX, event.clientY]
            ,
            screen: [event.screenX, event.screenY]
            ,
            page: [event.pageX, event.pageY]
            ,
            alt: event.altKey !== undefined ? event.altKey : (event.getModifierState !== undefined ? event.getModifierState("Alt") : false)
            ,
            ctrl: event.ctrlKey || false
            ,
            shift: event.shiftKey || false
            ,
            capslock: event.getModifierState !== undefined ? event.getModifierState("Capslock") : false
            ,
            type: event.type
            ,
            target: event.target || event.srcElement
            ,
            key: (event.key ? (event.key.length === 1 ? event.key : event.key.toLowerCase()) : zzz.value.convertTokey(event.keyCode)) || undefined
            ,
            code: event.keyCode || event.which || undefined
            ,
            delta: event.detail ? event.detail / 3 : event.wheelDelta / 120//firefox fix not present
        };
        return interpretation;
    },
    edit: {
        enable: function (element) {
            zzz.set(element, "contenteditable", "true");
        },
        disable: function (element) {
            zzz.set(element, "contenteditable", "false");
        }
    },
    waiting: false,
    interval: 100,//ms
    mousemove: function (e) {
        if (zzz.incidence.waiting) return;
        e = zzz.incidence.interpret(e);
        zzz.incidence.data.target = e.target;
        zzz.incidence.waiting = true;
        setTimeout(function () {
            zzz.incidence.waiting = false;
        }, zzz.incidence.interval);
    },
    data: {}
};
zzz.file = {
    help: "blob(buffer,options),create(arr,MIMEtype,ending?native:intact),.close(),.size,.type,.slice()",
    blob: function (buffer, options) {
        try {
            return new Blob(buffer, options);
        } catch (e) {
            var bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
            buffer.forEach(function (buf) {
                bb.append(buf);
            });
            return bb.getBlob(options);
        }
    },
    create: function (arr, type, nativeEnding) {
        var options = {};
        if (!zzz.equal.type(arr, "array")) arr = [arr];
        if (type !== undefined) options.type = type.indexOf("/") === -1 ? zzz.value.file.encode(type) : type;
        if (nativeEnding !== undefined) options.endings = nativeEnding ? "native" : "transparent";
        return new zzz.file.blob(arr, options);
    },
    download: function (url) {
        if (!zzz.equal.type(url, "string")) return false;
        var node = zzz.create("a", {href: url, download: url}, {display: "none"});
        node.innerText = "1";
        if ("download" in node) {
            document.body.appendChild(node);
            node.click();
        }
    },
    getUrl: function (blob) {
        try {
            return URL.createObjectURL(blob);
        } catch (e) {
            return "";
        }
    },
    delUrl: function (url) {
        try {
            return URL.revokeObjectURL(url);
        } catch (e) {

        }
    },
    useURL: function (blob, func) {
        var url = zzz.file.getUrl(blob);
        func(url);
        zzz.file.delUrl(url);
    },
    imageToBlob: function (src, callback) {
        if (!callback) return;
        if (zzz.paint.canvasEnabled) {
            var canvas = zzz.create("canvas");
            /*
            var type=src;
            if(type.lastIndexOf(".")!==-1) type=type.substr(type.lastIndexOf(".")+1);
            else if(type.substr(0,4)==="data") type=type.slice(11,type.search("base64"));
            else type="jpeg";
            */
            var element = zzz.create("img", {crossOrigin: "anonymous", src: src}, {display: "none"}, document.body);
            /*var element=new Image();
            element.crossOrigin="anonymous";
            element.src=src;

             */
            element.onload = function () {
                canvas.width = element.width;
                canvas.height = element.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(element, 0, 0, element.width, element.height);
                canvas.toBlob(callback);
            }
        } else throw new Error("zzz.file.imageToBlob failed.");
    }
};
zzz.fetch = {
    fetchEnabled: false,
    ajaxEnabled: false,
    safe_fetch: {
        method: "GET",
        mode: "same-origin",
        credentials: "same-origin",
        cache: "default",
        redirect: "follow"
    },
    requestStructure: function () {
        return {
            url: undefined,
            data: undefined,
            method: undefined,
            cors: false,
            cache: undefined,
            header: undefined,
            credentials: undefined,
            redirect: undefined,
            referrer: undefined,
            integrity: undefined,
            referrerPolicy: undefined,
            callback: undefined,
            async: true
        };
    },
    headStructure: {
        Date: "",//standard format:Web, 21 Oct 2015 07:28:00 GMT
        Cookie: "",//cookie
    },
    head: {
        create: function (settings) {
            var head = new Headers();
            for (var i in settings) {
                i = i[0].toUpperCase() + i.substr(1);
                head.append(i, settings.i);
            }
            return head;
        }
    },
    send: function () {
        throw new Error("sending fetch");
    },
    create: function (url, settings) {
        var request = zzz.fetch.requestStructure();
        request.url = url;
        zzz.addAttr(request, settings);
        var promise = zzz.fetch.fetchEnabled ? zzz.fetch.fetch(request) : zzz.fetch.ajax(request);
        return promise;
    },
    init: function () {
        try {
            if (window.fetch || WorkerGlobalScope.fetch) zzz.fetch.fetchEnabled = true;
        } catch (e) {
        }
        try {
            if (XMLHttpRequest) zzz.fetch.ajaxEnabled = true;
        } catch (e) {
        }
        if (zzz.fetch.fetchEnabled) {
            zzz.fetch.fetch = function (settings) {
                if (!settings.url) return false;
                if (zzz.equal.type(settings.input, "string")) {
                }
                var init = {
                    method: settings.method || (settings.data ? "POST" : "GET"),
                    mode: settings.cors ? "cors" : "same-origin",
                    body: settings.data || undefined,
                    credentials: settings.credentials || "include",
                    cache: settings.cache || "reload",
                    redirect: settings.redirect || undefined,
                    referrer: settings.referrer || undefined,
                    integrity: settings.integrity || undefined,
                    referrerPolicy: settings.referrerPolicy || undefined
                };
                //callback is json/text/blob which can apply the respective function .x()
                var promise = zzz.fetch.send(settings.url, init);
                if (settings.callback) return promise.then(settings.callback);
                else return promise;
            };
        }
        if (zzz.fetch.ajaxEnabled) {
            zzz.fetch.ajax = function (settings) {
                if (!settings.url) return false;
                var xhr = new XMLHttpRequest();
                xhr.open(settings.method || "GET", settings.url, settings.async === undefined ? true : settings.async);
                if (settings.callback) xhr.onreadystatechange = settings.callback;
                if (settings.timeout) xhr.timeout = settings.timeout;
                if (settings.header) for (let i in settings.header) xhr.setRequestHeader(i, settings.header[i]);
                if (settings.ontimeout) xhr.ontimeout = settings.ontimeout;
                xhr.send(settings.data);
                return xhr;
            }
        }
    },
    judge: function (response) {
        console.log(response);
        if (response.complete) return "success";
        if (response.ok !== undefined) return response.ok ? "success" : "fail";
        return response.readyState === 4 ? (response.status === 200 ? "pending" : "fail") : "success";
    },
    //jsonp without cors callback
    cors: function (src, type, parent, callback) {
        if (!parent) parent = document.body;
        if (!type) type = "script";
        var node = zzz.create(type, {src: src}, {display: "none"});
        if (callback) {
            let wrapper = function () {
                callback({node: node, ok: true});
            };
            let wrapper_fail = function () {
                callback({node: node, ok: false});
            };
            let wrapper_change = function () {
                callback({node: node, readyState: node.readyState});
            };
            zzz.incidence.bind(node, "load", wrapper);
            zzz.incidence.bind(node, "readystatechange", wrapper_change);
            zzz.incidence.bind(node, "error", wrapper_fail);
        }
        parent.appendChild(node);
        return node;
    },
    //jsonp with cors callback
    get: function (src, callback, parent, head) {
        if (!parent) parent = document.body;
        var node = zzz.create("script", {src: src}, {display: "none"});
        var uniqueText = zzz.random.string(30);
        window[uniqueText] = function (response) {
            callback(response);
            delete window[uniqueText];
        };
        zzz.set(node, "src", zzz.path.merge(src, {callback: uniqueText}));
        parent.appendChild(node);
        return node;
    },
    //resource loading
    css: function (src, parent) {
        var node = zzz.create("link", {href: src, rel: "stylesheet", type: "text/css"});
        if (!parent) parent = document.body;
        parent.appendChild(node);
        return node;
    },
    font: function (name, src) {
        var node = zzz.create("style");
        node.innerText = "@font-face{font-family:'" + name + "';src:url('" + src + "')}";
        document.body.appendChild(node);
    },
    js: function (src, parent) {
        if (!parent) parent = document.body;
        var node = zzz.create("script", {src: src});
        parent.appendChild(node);
    }
};
zzz.paint = {
    canvasEnabled: false,
    init: function () {
        var node = zzz.create("canvas");
        if (node.getContext) this.canvasEnabled = true;
    },
    get: function (element) {
        return element.getContext("2d");
    },
    create: function (parent) {
        if (!parent) parent = document.body;
        var canvas = zzz.create("canvas");
        parent.appendChild(canvas);
        return canvas.getContext("2d");
    },
    alias: {
        width: "lineWidth",
        lcolor: "strokeStyle",
        fcolor: "fillStyle",
        align: "textAlign",
        shadowx: "shadowOffsetX",
        shadowy: "shadowOffsetY",
        shadowcolor: "shadowColor",
        shadowblur: "shadowBlur"
    },
    paintMethod: {
        information: {
            width: 1,
            x: 0,
            y: 0,
            align: "center",
            font: "30px"
        },
        beginPath: function (canvas) {
            canvas.beginPath();
        },
        to: function (canvas, x, y) {
            canvas.moveTo(x, y);
        },
        line: function (canvas, x, y) {
            canvas.lineTo(x, y);
        },
        paint: function (canvas) {
            canvas.stroke();
        },
        closePath: function (canvas) {
            canvas.closePath();
        },
        rect: function (canvas, x, y, w, h, isHollow) {
            if (isHollow) canvas.strokeRect(x, y, w, h);
            else canvas.fillRect(x, y, w, h);
        },
        clear: function (canvas, x, y, w, h) {
            canvas.clearRect(x, y, w, h);
        },
        image: function (canvas, src) {
            var img = new Image();
            img.src = src;
            var wrapper = function () {
                canvas.drawImage(img, this.information.x, this.information.y);
            };
            img.onload = wrapper;
        },
        read: function (canvas, x, y, w, h) {

        },
        //no line-break usable.manual.
        text: function (canvas, text, isHollow) {
            if (isHollow) canvas.strokeText(text, this.information.x, this.information.y);
            else canvas.fillText(text, this.information.x, this.information.y);
        },
        set: function (canvas, key, value) {
            this.information[key] = value;
            canvas[zzz.paint.alias[key]] = value;
        },
        fill: function (color) {
            if (!color) color = this.color;
        }
    }
};
zzz.browser.fullscreen = {
    status: false,
    enter: function (element) {
        if (!element) return;
        this.status = true;
        return element.requestFullscreen();
    },
    exit: function () {
        this.status = false;
        return document.exitFullscreen();
    }
};
zzz.incidence.drag = {
    enable: function (element) {
        element.draggable = "true";
    },
    disable: function (element) {
        element.draggable = "false";
    },

};
zzz.incidence.bindResizeObserver = function (element, func) {
    var f = new window.ResizeObserver(func);
    f.observe(element);
    return f;
};
zzz.path = {
    split: function (url) {
        //https://www.a.b.com:443/d?e=f&g=h
        //protocol=https:
        //path=/d
        //domain=com
        //subdomain=www.a
        //host=www.a.b.com
        //port=443
        //judge protocol from ://,and delete it.
        var protocol_index, protocol, component_index, component = [], port_index, port, host, path = "/", host_index,
            domain, subdomain;
        protocol_index = url.match("://");
        protocol = protocol_index ? url.substr(0, protocol_index.index + 1) : "";
        if (protocol_index) url = url.substr(protocol_index.index + 3);
        if (url[0] === "/") url = url.substr(1);
        //judge component from ?,and delete it.
        component_index = url.match(/\?/);
        if (component_index) {
            component = url.substr(component_index.index + 1).split("&");
            url = url.slice(0, component_index.index);
        }
        //judge port from :xxx, and delete it.
        port_index = url.match(/:[0-9]{1,5}/);
        if (port_index) {
            port = port_index[0].substr(1);
            host = url.slice(0, port_index.index);
            path = url.slice(port_index.index + port.length + 1) || "/";
        } else {
            port = "";
            host_index = url.indexOf("/");
            if (host_index !== -1) {
                host = url.slice(0, host_index);
                path = url.slice(host_index);
            } else host = url;
        }
        var domains = host.split(".");
        domain = domains ? domains[domains.length - 1] : "";
        if (!zzz.equal.type(zzz.toNum(domain), "NaN")) domain = host;
        subdomain = host.replace(domain, "");
        if (subdomain[subdomain.length - 1] === ".") subdomain = subdomain.substr(0, subdomain.length - 1);
        var result = {
            protocol: protocol,
            0: protocol,
            path: zzz.code.path.decode(path),
            host: host,
            1: host,
            domain: domain,
            subdomain: subdomain,
            port: port,
            2: port,
            component: {},
            3: {}
        };
        if (result.protocol === "file:") {
            result.domain = "";
            result.subdomain = "";
            result[1] = result[2] = "";
        }
        for (let i of component) {
            if (!i) continue;
            let len = i.length;
            for (var key = 0; i[key] !== "=" && key < i.length; key++) {
            }
            let name = zzz.code.path.decode(i.substr(0, key));
            let value = zzz.code.path.decode(i.substr(key + 1));
            result.component[name] = value;
            result[3][name] = value;
        }
        return result;
    },
    merge: function () {
        var result = "";
        if (arguments.length === 1) {
            var short = arguments[0];
            result += short.protocol ? (short.protocol + "//") : "";
            if (short.protocol === "file:") result += "/";
            result += short.host || "";
            result += short.port ? (":" + short.port) : "";
            if (short.path) result += short.path;
            if ((!short.port) && (!short.path) && result[result.length - 1] !== "/") result += "/";
            result = zzz.code.uri.encode(result);
            if (short.component) {
                result += "?";
                let items = [];
                for (var i in short.component) {
                    if (!i) continue;
                    items.push(zzz.code.path.encode(i) + "=" + zzz.code.path.encode(short.component[i]));
                }
                result += items.join("&");
            }
            if (result[result.length - 1] === "?") result = result.substr(0, result.length - 1);
            return result;
        } else if (arguments.length === 2 && zzz.equal.type(arguments[0], "string") && zzz.equal.type(arguments[1], "object")) {
            let origin = zzz.path.split(arguments[0]);
            for (var i in arguments[1]) {
                origin.component[i] = arguments[1][i];
            }
            return zzz.path.merge(origin);
        } else console.log("invalid input for zzz.path.merge, the arguments are", arguments);
    },
    deleteEnd: function (url) {
        return url.replace(/\/$/, "");
    },
    abs: function (url, base) {
        if (!base) base = "";
        var node = zzz.create("a");
        zzz.set(node, "href", base + url);
        var result = node.href;
        node = null;
        return zzz.path.deleteEnd(result);
    }
};
zzz.anim = {
    translate: {
        read: function (text) {
            //only for 2.33px,46% and such
            text = text.replace(/\s/g, "");
            var i = text.match(/[0-9]/), j;
            if (!i) {
                //pure string
                return text;
            } else {
                i = text.match(/[^0-9\.]/);
                j = i ? i.index : text.length;
                return {value: zzz.toNum(text.slice(0, j)), unit: text.slice(j, text.length)};
            }
        },
        readColor: function (text) {
            text = text.replace(/\s/g, "");
            if (text[0] === "#") {
                if (text.length === 7) {
                    return {
                        r: (zzz.value.hex(text[1]) << 4) + zzz.value.hex(text[2]),
                        g: (zzz.value.hex(text[3]) << 4) + zzz.value.hex(text[4]),
                        b: (zzz.value.hex(text[5]) << 4) + zzz.value.hex(text[6]),
                    };
                } else {
                    throw new Error("unfinished function in readColor");
                }
            } else {
                var splitText = text.split(","), result = {}, name = ["r", "g", "b", "a"];
                splitText.forEach(function (value, index, array) {
                    result[name[index]] = zzz.toNum(value);
                });
                return result;
            }
        },
        //TODO: there are bugs within
        split: function (style, styleString) {
            /*example:
            "2en","rotate(4rad) translateX(3px)","SimSun,'Times New Roman'"
            */
            if (style.indexOf("-") !== -1) style = zzz.string.camel(style);
            var splitString = [], result = {}, i, j, k, l, index = 0;
            if (style === "fontFamily") {
                splitString = styleString.split(",");
                for (i in splitString) {
                    //remove ' "
                    if (splitString[i][0] === "'" || splitString[i][0] === '"') {
                        splitString[i] = splitString[i].slice(1, splitString[i].length - 1);
                    }
                }
                return splitString;
            } else if (style === "backgroundImage") {
                i = styleString.indexOf("(");
                j = styleString.lastIndexOf(")");
                //TODO: BASE64
                return styleString.slice(i + 1, j).replace(/['"]/g, "");
            } else if (style.match(/color/i)) {
                l = "color";
                i = styleString;
                j = i.indexOf("(");
                if (j !== -1) k = zzz.anim.translate.readColor(i.slice(j + 1, i.length - 1));
                else k = "";
                result[l] = k;
                return result;
            } else {
                splitString = styleString.split(" ");
                for (i of splitString) {
                    if (!i) continue;
                    j = i.indexOf("(");
                    l = i.slice(0, j);
                    if (j !== -1) {
                        k = zzz.anim.translate.read(i.slice(j + 1, i.length - 1));
                        result[l] = k;
                    } else {
                        k = zzz.anim.translate.read(i);
                        result[index++] = k;
                    }
                }
                return result;
            }
        },
        batch: function (CSSText) {
            var splitText = CSSText.split(/[;\n]/), i, j, k, l, result = {};
            for (i of splitText) {
                if (!i) continue;
                j = i.indexOf(":");
                l = i.slice(0, j).replace(/\s/g, "");
                k = zzz.anim.translate.split(l, i.slice(j + 1));
                result[zzz.string.camel(l)] = k;
            }
            return result;
        },
        calculate: function (currentValue, previousValue) {
            if (!previousValue) previousValue = 0;
            if (!currentValue) return previousValue;
            //rule: prev stands for previousValue
            var result = 0, calculate = function (prev, string) {
                return zzz.eval(string.replace(/prev/g, prev));
            };
            if (zzz.equal.type(currentValue[0] - 0, "NaN")) {
                if (currentValue[0] === "p") {
                    return calculate(previousValue, currentValue);
                } else return calculate(previousValue, "prev" + currentValue);
            } else {
                if (currentValue.match("prev")) {
                    //calculate
                    return calculate(previousValue, currentValue);
                } else return currentValue;
            }
        },
        merge: function (currentStyle, previousStyle) {
            if (zzz.equal.type(currentStyle, "string")) return currentStyle;
            if (!previousStyle) previousStyle = {};
            var i, result = [];
            for (i in currentStyle) {
                if (zzz.equal.type(currentStyle[i], "string")) result.push(currentStyle[i]);
                if (i === "color") {
                    var core =
                        zzz.anim.translate.calculate(currentStyle[i].r, previousStyle[i] ? previousStyle[i].r : null) +
                        "," +
                        zzz.anim.translate.calculate(currentStyle[i].g, previousStyle[i] ? previousStyle[i].g : null) +
                        "," +
                        zzz.anim.translate.calculate(currentStyle[i].b, previousStyle[i] ? previousStyle[i].b : null);
                    if (currentStyle[i].a !== undefined || (previousStyle[i] && previousStyle[i].a !== undefined)) result.push("rgba(" + core + "," + zzz.anim.translate.calculate(currentStyle[i].a, previousStyle[i] ? previousStyle[i].a : null) + ")");
                    else result.push("rgb(" + core + ")");
                } else if (!!(i - 0 + 1) && currentStyle[i].value) result.push(zzz.anim.translate.calculate(currentStyle[i].value, (previousStyle[i] ? previousStyle[i].value || null : null)) + (currentStyle[i].unit || (previousStyle[i] && previousStyle[i].unit) || ""));
                else {
                    result.push(i + "(" + (currentStyle[i].value || "") + (currentStyle[i].unit || (previousStyle[i] && previousStyle[i].unit) || "") + ")");
                }
            }
            return result.join(" ");
        },
        wrap: function (text) {
            return {0: {value: text}};
        }
    },
    set: function (element, style) {
        for (let i in style) {
            element.style[i] = style[i];
        }
    },
    act: function (element, currentStyle, previousStyle) {
        if (!previousStyle) previousStyle = {};
        if (!zzz.anim.elements[element]) zzz.anim.elements[element] = {};
        var i, previousValue;
        for (i in currentStyle) {
            if (zzz.equal.type(currentStyle[i], "string")) currentStyle[i] = zzz.anim.translate.wrap(currentStyle[i]);
            previousValue = previousStyle[i];
            if (previousValue === undefined || previousValue === null) previousValue = zzz.anim.elements[element][i];
            if (previousValue === undefined || previousValue === null) previousValue = zzz.anim.translate.split(i, zzz.get.style(element, i));
            currentStyle[i] = zzz.anim.translate.merge(currentStyle[i], previousValue);
            //console.log(currentStyle[i]);
            zzz.anim.elements[element][i] = zzz.anim.translate.split(i, currentStyle[i]);
        }
        zzz.anim.set(element, currentStyle);
    },
    elements: {},
    requests: {}
};
zzz.anim.scroll = {
    to: function (element, x, y, isSmooth) {
        if (!element) element = window;
        if (isSmooth === undefined) isSmooth = true;
        element.scrollTo(x, y, isSmooth);
    },
    by: function (element, x, y, isSmooth) {
        if (!element) element = window;
        if (isSmooth === undefined) isSmooth = true;
        element.scrollBy(x, y, isSmooth);
    },
    into: function (element, isSmooth) {
        if (!element) return;
        if (isSmooth === undefined) isSmooth = true;
        element.scrollIntoView(isSmooth);
    }
};
zzz.api = {};
zzz.api.update = {
    url: {},
    resource: {},
    current: {},
    update: {},
    test: function () {
        for (let i in this.url) {
            for (let j of this.url[i])
                zzz.load.js(j);
        }
    },
    check: function () {
        var result = [];
        for (let i in this.current) {
            if (this.current[i] < this.update[i]) {
                result.push(i);
            }
        }
        return result;
    }
};
zzz.string = {
    distance: function (str1, str2) {
        var len1 = str1.length, len2 = str2.length, maxLength = Math.max(len1, len2);
        var save = new Array(len2 + 1);
        var t1, t2;
        for (var i = 0; i <= len2; i++) save[i] = i;
        for (var i = 1; i <= len1; i++) {
            t1 = save[0]++;
            for (var j = 1; j <= len2; j++) {
                t2 = save[j];
                if (str1[i - 1] === str2[j - 1]) save[j] = t1;
                else save[j] = Math.min(t1, save[j - 1], save[j]) + 1;
                t1 = t2;
            }
        }
        return save[len2];
    },
    first_letter_algorithm: function (str1, str2) {
        var dist = zzz.string.distance(str1, str2);
        return dist + str1.length - str2.length;
    },
    stringify: function (obj, type) {
        if (!zzz.equal.type(type, "string")) return "";
        type = type.toLowerCase();
        if (zzz.equal.type(obj, "number")) {
            if (type === "chinesenumber" || type === "chsnum") {
                return zzz.string.chineseNumber(obj);
            } else if (type === "big" || type === "bigchinese") {
                return zzz.string.chineseNumber(obj, true);
            } else if (type === "chineseoral" || type === "oral") {
                var result = zzz.string.chineseNumber(obj);
                if (result === "二") result = "两";
                return result;
            } else if (type === "chinese" || type === "chs") {
                var result = obj.toString().split("");
                result.forEach(function (value, index, array) {
                    if (value === "-") array[index] = "负";
                    else if (value === ".") array[index] = "点";
                    else array[index] = zzz.value.ChineseNumber[value.charCodeAt(0) - zzz.value.zero];
                });
                return result.join("");
            } else return obj.toString();
        } else {
            if (obj.toString) return obj.toString();
            else if (obj.name) return obj.name;
            else return "";
        }
    },
    chineseNumber: function (number, isBig, characterTable) {
        var charset;
        if (!characterTable) charset = zzz.value[isBig ? "ChineseNumberBig" : "ChineseNumber"];
        else charset = characterTable;
        var text = number.toString(), length = text.length, i, isNegative = number < 0;
        var result = "";
        var occupied = [];
        var index = 0;
        number = zzz.abs(number);
        var fraction = text.indexOf(".") + 1;
        number = zzz.down(number);
        //亿
        i = zzz.down(number / 100000000);
        occupied[index] = !!i;
        index++;
        if (i) result += zzz.string.chineseNumber(i, isBig) + charset[14];
        //万
        number = number % 100000000;
        i = zzz.down(number / 10000);
        occupied[index] = !!i;
        if (i && (!occupied[index - 1]) && result) result += charset[0];
        index++;
        if (i) result += zzz.string.chineseNumber(i, isBig) + charset[13];
        //千
        number = number % 10000;
        i = zzz.down(number / 1000);
        occupied[index] = !!i;
        if (i && (!occupied[index - 1]) && result) result += charset[0];
        index++;
        if (i) result += charset[i] + charset[12];
        //百
        number = number % 1000;
        i = zzz.down(number / 100);
        occupied[index] = !!i;
        if (i && (!occupied[index - 1]) && result) result += charset[0];
        index++;
        if (i) result += charset[i] + charset[11];
        //十
        //fix:去除“一十”中的“一”字
        number = number % 100;
        i = zzz.down(number / 10);
        occupied[index] = !!i;
        if (i && (!occupied[index - 1]) && result) result += charset[0];
        index++;
        if (i > 1) result += charset[i];
        if (i) result += charset[10];
        //一
        number = number % 10;
        i = number;
        occupied[index] = !!i;
        if (i && (!occupied[index - 1]) && result) result += charset[0];
        index++;
        if (i) result += charset[i];
        //零
        if (result.length === 0) result += charset[0];
        if (fraction) {
            result += charset[15];
            text = text.slice(fraction);
            for (let i in text) result += charset[text.charCodeAt(i) - "0".charCodeAt(0)];
        }
        return (isNegative ? "负" : "") + result;
    },
    camel: function (CSSText) {
        var i = CSSText.indexOf("-"), letter = "";
        while (i !== -1) {
            letter = CSSText[i + 1].toUpperCase();
            CSSText = CSSText.slice(0, i) + letter + CSSText.slice(i + 2);
            i = CSSText.indexOf("-");
        }
        return CSSText;
    },
    line: function (JSText) {
        var i = JSText.search(/[A-Z]/), length = JSText.length, letter = "";
        while (i !== -1) {
            letter = JSText[i].toLowerCase();
            JSText = JSText.slice(0, i) + "-" + letter + JSText.slice(i + 1);
            i = JSText.search(/[A-Z]/)
        }
        return JSText;
    }
};
zzz.structure = {
    stack: function () {
        return {
            array: [],
            index: 0,
            push: function (obj) {
                this.array[this.index] = obj;
                this.index++;
            },
            pop: function () {
                if (this.index > 0) {
                    this.index--;
                    return this.array[this.index + 1];
                } else return null;
            },
            top: function () {
                return this.index ? this.array[this.index - 1] : null;
            }
        };
    },
    queue: function () {
        return {
            array: [],
            index_left: 0,
            index_right: 0,
            push: function (obj) {
                this.array[this.index_right] = obj;
                this.index_right++;
                if (this.index_left > 100) {
                    for (var i = this.index_left; i < this.index_right; i++) {
                        this.array[i - this.index_left] = this.array[i];
                    }
                    this.index_right -= this.index_left;
                    this.index_left = 0;
                }
            },
            pop: function () {
                if (this.index_right > this.index_left) {
                    this.index_left++;
                    return this.array[this.index_left - 1];
                } else return null;
            },
            top: function () {
                return this.index_left < this.index_right ? this.array[this.index_left] : null;
            }
        }
    }
};
zzz.init = function () {
    zzz.storage.init();
    zzz.incidence.init();
    zzz.browser.init();
    zzz.message.init();
    zzz.paint.init();
    zzz.fetch.init();
    zzz.api.update.url["zzz"] = ["https://ZzzzzzzSkyward.github.io/main/update.js"];
    zzz.api.update.current["zzz"] = zzz.version;
    zzz.inited = true;
    try {
        window.zzzloaded && window.zzzloaded();
        document.zzzloaded && document.zzzloaded();
    } catch (e) {}
};
zzz.value.validCharacter="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
zzz.value.ChineseNumber="零一二三四五六七八九十百千万亿点";
zzz.value.zero="0".charCodeAt(0);
zzz.value.a="a".charCodeAt(0);
zzz.value.A="A".charCodeAt(0);
zzz.value.keyCode= {
    1:"leftbutton",
    2:"rightbutton",
    4:"middlebutton",
    8:"backspace",
    9:"tab",
    13:"enter",
    16:"shift",
    17:"ctrl",
    18:"alt",
    19:"pause",
    20:"capslock",
    27:"esc",
    32:"blank",
    33:"pageup",
    34:"pagedown",
    35:"end",
    36:"home",
    37:"leftarrow",
    38:"uparrow",
    39:"rightarrow",
    40:"downarrow",
    44:"printscreen",
    45:"insert",
    46:"delete",
    91:"winl",
    92:"winr",
    106:"*num",
    107:"+num",
    109:"-num",
    110:".num",
    111:"/num",
    144:"numlock",
    145:"scrolllock",
    160:" ",
    186:";",
    187:"=",
    188:",",
    189:"-",
    190:".",
    191:"/",
    192:"`",
    219:"[",
    220:"\\",
    222:"'"

};
zzz.value.convertTokey=function (code) {
    if(code>=48&&code<=57) return code-48+"";
    else if(code>=65&&code<=90) return String.fromCharCode(code+32);
    else if(code>=96&&code<=105) return code-96+"num";
    else if(code>=112&&code<=123) return "F"+(code-111);
    else if(code in zzz.value.keyCode) return zzz.value.keyCode[code];
    else return String.fromCharCode(code);
};
zzz.value.storage={
    defaultExpire:60*60*24
};
zzz.value.file={
    mime:{
        audio:{
            aac:"aac",
            mp3:"mpeg",
            oga:"ogg",
            wav:"wav",
            weba:"webm",
            mid:"midi"
        },
        video:{
            "3gp":"3gpp",
            "3g2":"3gpp2",
            webm:"webm",
            ogv:"ogg",
            mpeg:"mpeg",
            avi:"x-msvideo"
        },
        image:{
            gif:"gif",
            jpeg:"jpeg",
            jpg:"jpeg",
            svg:"svg+xml",
            tif:"tiff",
            tiff:"tiff",
            webp:"webp",
            ico:"vnd.microsoft.icon"
        },
        application:{
            bin:"octet-stream",
            bz:"x-bzip",
            bz2:"x-bzip2",
            csh:"x-csh",
            doc:"msword",
            docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            epub:"epub+zip",
            jar:"java-archive",
            json:"json",
            jsonld:"ld+json",
            ogx:"ogg",
            pdf:"pdf",
            ppt:"vnd.ms-powerpoint",
            pptx:"application/vnd.openxmlformats-officedocument.presentationml.presentation",
            rar:"x-rar-compressed",
            rtf:"rtf",
            swf:"x-shockwave-flash",
            tar:"x-tar",
            vsd:"vnd.visio",
            xls:"vnd.ms-excel",
            xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            zip:"zip",
            "7z":"x-7z-compressed"
        },
        text:{
            css:"css",
            csv:"csv",
            htm:"html",
            html:"html",
            ics:"calendar",
            js:"javascript",
            mjs:"javascript",
            txt:"plain"
        },
        font:{
            otf:"otf",
            woff:"woff",
            woff2:"woff2",
            ttf:"ttf"
        }
    },
    encode:function (type) {
        var short=zzz.value.file.mime;
        for(let i in short){
            if(short[i][type]) return i+"/"+short[i][type];
        }
        if(type) return "text/"+type;
        else return "text/plain";
    },
    decode:function (mime) {
        var index=mime.indexOf("/")||0;
        var type=mime.slice(0,index),text=mime.slice(index);
        var short=zzz.value.file.mime;
        if(short[type]){
            for(let i in short){
                for(let j in short[i]){
                    if(short[i][j]===text) return j;
                }
            }
        }
        return text;
    }
};
zzz.value.hex=function(character){
    if(!(typeof character==="string")) return;
    if(isNaN(character-0)) return character.charCodeAt(0)-zzz.value.A+10;
    else return character-0;
};
zzz.init();
