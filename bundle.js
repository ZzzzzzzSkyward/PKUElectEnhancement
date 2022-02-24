// ==UserScript==
// @name         PKU Elective Enhancement
// @namespace    elective
// @version      2022.02
// @description  enhance the page
// @match        https://elective.pku.edu.cn/*
// @match        https://iaaa.pku.edu.cn/*
// @grant        none
// ==/UserScript==
"use strict";
/*
version:1.3
time:2021.09.28
author:zzs
*/
try {
    var v = zzz.version;
} catch (e) {
    window.zzz = {};
}
zzz.version = 20210928;
if (!zzz.value) zzz.value = {};
if (zzz.inited) throw new Error("zzz re-init!");
//eval
zzz.eval = function (string) {
    return Function("'use strict';return " + string)();
};
//math
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
    var i = 0,
        j = 0,
        len = text.length,
        result = 0,
        isNegative = 0,
        isInt = 1;
    //find out if there is a number and if it is a negative.
    for (; i < len; i++) {
        if (text[i] === '-' && i < len - 1 && text[i + 1] <= '9' && text[i + 1] >= '0') {
            //suppose there is no whitespace between - and numbers
            isNegative = 1;
            i++;
            break;
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
//random
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
    if (!setting) {
        console.log("zzz.random.color:no setting given.");
        setting = {};
    }
    let rgb = [0, 255, 0, 255, 0, 255];
    let isRGB = false,
        isHSL = false,
        isA = false;
    let hsl = [0, 255, 0, 255, 0, 255];
    let a = [0, 100]; //100x
    let index = 0;
    let i;
    for (i of ['r', 'g', 'b']) {
        let n = setting[i];
        if (n) {
            if (n[0]) rgb[index] = n[0];
            if (n.length > 1) rgb[index + 1] = n[1];
            isRGB = true;
        }
        index += 2;
    }
    index = 0;
    for (i of ['h', 's', 'l']) {
        let n = setting[i];
        if (n) {
            if (n[0]) hsl[index] = n[0];
            if (n.length > 1) hsl[index + 1] = n[1];
            isHSL = true;
        }
        index += 2;
    }
    i = 'a';
    let n = setting[i];
    if (n) {
        if (n[0]) a[0] = n[0];
        if (n.length > 1) a[1] = n[1];
        isA = true;
    }
    let sets;
    let rnd = "";
    let color = ""
    if (isRGB) {
        sets = rgb;
        rnd = "rgb";
    } else if (isHSL) {
        sets = hsl;
        rnd = "hsl";
    } else console.log("zzz.random.color:invalid param:{r,g,b,h,s,l,a[2]}", setting);
    for (i = 0; i < 6; i += 2) {
        color += zzz.random.int(sets[i], sets[i + 1]) + ','
    }
    if (isA) {
        rnd += "a";
        color += zzz.random.int(a[0], a[1]);
    } else color = color.substr(0, color.length - 1);
    return rnd + '(' + color + ')';
};
zzz.random.array = function (arr) {
    if (arr.length) return arr[zzz.random.int(0, arr.length - 1)];
    else return null;
};
zzz.random.string = function (len, dictionary) {
    if (!len) len = 10;
    var str = "";
    if (!dictionary) dictionary = zzz.value.validCharacter;
    for (var i = 0; i < len; i++) {
        str += zzz.random.array(dictionary);
    }
    return str;
};
zzz.appr = Math.round;
zzz.down = Math.floor;
zzz.up = Math.ceil;
zzz.abs = Math.abs;

//code
//TODO : add UTF-8 to BASE64 encoding and decoding method. However, as JS saves string with coding UTF-16, it is very lengthy to convert UTF-8 to UTF-16 to base 64, vice versa. Therefore this function will be delayed.
//TODO : add SHA1 calculating method for UTF-8.
//current method:text(UTF-8)->uri(encoded)->BASE64
//difference between uri and path:uri doesn't change ":/" into "%XX" because he thinks it belongs to a uri.
zzz.en = function (data, type, setting) {
    if (!type) return data;
    type = type.toLowerCase();
    if (type == "base64") type = "b64";
    if (!zzz.code[type]) {
        this.console.log("no encoding method", type, "in zzz.code");
        return "";
    }
    return zzz.code[type].encode(data, setting);
}
zzz.de = function (data, type) {
    if (!type) return data;
    type = type.toLowerCase();
    if (type == "base64") type = "b64";
    else return zzz.code[type].decode(data);
}
zzz.code = {
    b64: {
        decode: function (base64code) {
            return window.atob(base64code);
        },
        encode: function (text) {
            return window.btoa(text);
        },
    },
    header: {
        encode: function (type, isBase64) {
            type = type.toLowerCase();
            const data = zzz.value.file;
            let mime = "";
            switch (type) {
                case "binary":
                    mime = data.encode("bin", "application")
                default:
                    mime = data.encode(type);
            }
            if (isBase64) mime += "data/base64;";
            return mime;
        }
    },
    url: {
        encode: function (text) {
            return window.encodeURI(text);
        },
        decode: function (url) {
            return window.decodeURI(url);
        }
    },
    path: {
        encode: function (text) {
            return window.encodeURIComponent(text);
        },
        decode: function (component) {
            return window.decodeURIComponent(component);
        }
    },

};
//time
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
//TODO: seperate ztime from Date, especially rewrite subtract method.
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
    stringify: function (ztime, format) {
        var result = "",
            cn = format === undefined ? "chinesenumber" : format;
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
        var t1 = zzz.time.convertToDate(ztime1).getTime(),
            t2 = zzz.time.convertToDate(ztime2).getTime();
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
    loop: function (func, time, isClear, name) {
        let number = -1;
        let funcID = zzz.code.sha256.encode(func.toString());
        if (isClear) {
            number = zzz.time.data[funcID];
            if (number === undefined) throw new Error("clearInterval unrecorded function");
            number = number[time];
            if (number === undefined) throw new Error("clearInterval unrecorded function time");
            clearInterval(number);
        } else {
            number = setInterval(func, time);
            if (!zzz.time.data[funcID]) zzz.time.data[funcID] = {};
            zzz.time.data[funcID][time] = number;
        }
        if (name) zzz.time.data[name] = [number, true];
        return number;
    },
    tick: function (func, time, isClear, name) {
        let number;
        let funcID = zzz.code.sha256.encode(func.toString());
        if (isClear) {
            number = zzz.time.data[funcID];
            if (number === undefined) throw new Error("clearTimeout unrecorded function");
            number = number[time];
            if (number === undefined) throw new Error("clearTimeout unrecorded function time");
            clearTimeout(number);
        } else {
            number = setTimeout(func, time);
            if (!zzz.time.data[funcID]) zzz.time.data[funcID] = {};
            zzz.time.data[funcID][time] = number;
        }
        if (name) zzz.time.data[name] = [number, false];
        return number;
    },
    clear: function (numberOrName) {
        var number = (typeof numberOrName === "string") ? zzz.time.data[numberOrName] : numberOrName;
        if (zzz.equal.type(number, "integer")) throw new Error("zzz.time.clear receives param not of number or string");
        isLoop = zzz.time.data[numberOrName][1];
        if (isLoop) clearInterval(number);
        else clearTimeout(number);
    },
    sleep: function (time) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, time);
        })
    }
};
//storage
//TODO : cookie and sessionStorage
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
        var obj = zzz.storage.get(item);
        if (obj) obj = JSON.parse(obj);
        else obj = {};
        obj[key] = value;
        var result = JSON.stringify(obj);
        zzz.storage.set(item, result);
    },
    json: function (key, value) {
        if (value) {
            return this.set(key, JSON.stringify(value));
        } else return JSON.parse(zzz.storage.get(key));
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
//browser check
//TODO : complementary.
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
        console.log(path, name || "", type || "");
        window.open(path, name, type);
    },
    init: function () {
        for (var i in zzz.browser.collect) {
            try {
                zzz.browser.collect[i]();
            } catch (e) {}
        }
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
//attribute
//set type
zzz.addAttr = function (obj, key_value_set) {
    for (let i in key_value_set) {
        obj[i] = key_value_set[i];
    }
};
//chain type
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

//collect information about the browser
zzz.browser.collect = {
    screen: function () {
        var a = document && document.documentElement && document.documentElement.clientHeight || 0,
            b = window.innerHeight || 0,
            c = document && document.body && document.body.clientHeight || 0;
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
//BOM
//TODO : specify
zzz.get = function (name, parent) {
    if (name[0] === '.') return zzz.get.cls(name.substr(1), parent);
    else if (name[0] === '#') return zzz.get.id(name.substr(1), parent);
    else return zzz.get.tag(name, parent);
};
zzz.query = function (name, parent, func) {
    let result = (parent || document).querySelectorAll(name);
    if (typeof func === "function") {
        for (let i in result) func(result[i], i);
    }
    return result;
};
zzz.queryAttr = function (name, parent, func) {
    let result = [];
    let elements = (parent || document).querySelectorAll(name);
    if (typeof func === "function") {
        for (let i in elements) {
            let res = func(elements[i], i);
            if (res !== undefined) result.push(res);
        }
    }
    return result;
};
//mode:function,key-value.
//it can also be used as mapping
zzz.filter = function (arr, criteria, value) {
    let type = typeof criteria;
    let result = [];
    //mode:function
    if (type === "function") {
        for (i of arr) {
            if (criteria(i)) {
                result.push(i);
            }
        }
    }
    //mode:key-value
    else if (criteria !== undefined && value) {
        for (i of arr) {
            if (i[criteria] === value) {
                result.push(i);
            }
        }
    }
    return result;
};
zzz.map = zzz.filter;
zzz.get.id = function (id, parent) {
    return (parent || document).getElementById(id);
};
zzz.get.cls = function (className, parent) {
    return (parent || document).getElementsByClassName(className);
};
zzz.get.tag = function (tagName, parent) {
    return (parent || document).getElementsByTagName(tagName);
};
zzz.get.attr = function (element, attribute) {
    return element.getAttribute(attribute);
};
zzz.get.style = function (element, style) {
    return getComputedStyle(element)[style];
};
zzz.create = function (tag, attributes, styles, parent) {
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
    if (parent) parent.appendChild(element);
    return element;
};
zzz.set = function (element, attribute, value) {
    element.setAttribute(attribute, value);
};
zzz.set.style = function (element, attr, value) {
    element.style[attr] = value;
};

//incidence
//alias:event
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
                var oldFunc = element["on" + type],
                    newFunc = function () {
                        oldFunc();
                        func();
                    };
                element["on" + type] = newFunc;
            } else
                element["on" + type] = func;
        }
    },
    //batch mode
    binds: function (element, setting) {
        for (let i in setting) {
            this.bind(element, i, setting[i]);
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
            mouse: event.button === 2 ? "right" : (event.button === 0 ? "left" : undefined),
            client: [event.clientX, event.clientY],
            screen: [event.screenX, event.screenY],
            page: [event.pageX, event.pageY],
            alt: event.altKey !== undefined ? event.altKey : (event.getModifierState !== undefined ? event.getModifierState("Alt") : false),
            ctrl: event.ctrlKey || false,
            shift: event.shiftKey || false,
            capslock: event.getModifierState !== undefined ? event.getModifierState("Capslock") : false,
            type: event.type,
            target: event.target || event.srcElement,
            key: (event.key ? event.key.toLowerCase() : (zzz.value.convertTokey && zzz.value.convertTokey(event.keyCode))) || undefined,
            code: event.keyCode || event.which || undefined,
            delta: event.detail ? event.detail / 3 : event.wheelDelta / 120 //firefox fix not present
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
    interval: 100, //ms
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
zzz.event = zzz.incidence;

//fetch API
//simple fetch=get
//simple use:zzz.get.url(url,settings{type[form,html,js,css,text,json,etc],method[get,post,option],callback:function(){},success:f(){},fail(){}})
zzz.fetch = {
    fetchEnabled: false,
    ajaxEnabled: false,
    headers: {
        form: {
            'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
        },
        forbidden: ['Accept-Charset', 'Accept-Encoding', 'Access-Control-Request-Headers', 'Access-Control-Request-Method', 'Connection', 'Content-Length', 'Cookie', 'Cookie2', 'Date', 'DNT', 'Expect', 'Host', 'Keep-Alive', 'Origin', 'Referer', 'TE', 'Trailer', 'Transfer-Encoding', 'Upgrade', 'Via']
    },
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
        Date: "", //standard format:Web, 21 Oct 2015 07:28:00 GMT
        Cookie: "", //cookie
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
        } catch (e) {}
        try {
            if (new XMLHttpRequest()) zzz.fetch.ajaxEnabled = true;
        } catch (e) {}
        if (zzz.fetch.fetchEnabled) {
            zzz.fetch.fetch = async function (settings) {
                if (!settings.url) return false;
                if (zzz.equal.type(settings.input, "string")) {}
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
                var promise = fetch(settings.url, init);
                if (settings.callback) return promise.then(settings.callback);
                else {
                    return promise;
                }
            };
        }
        if (zzz.fetch.ajaxEnabled) {
            zzz.fetch.ajax = function (settings) {
                if (!settings.url) return false;
                var xhr = new XMLHttpRequest();
                //document
                /*
                onreadystatechange
                ontimeout
                readyState:enumerate{unsent,opened,headers_received,loading,done},therefore 4 means ready.
                response[Array,Blob,Document,DOMString]
                responseType
                responseText:null
                responseURL:""
                status:401...
                statusText:"200 OK"...
                timeout:ms
                withCredentials:?
                upload:the object
                --non-standard
                --onload
                --onloadstart
                --onloadend
                --onerror
                --onabort
                --onprogress
                abort():stop
                open("GET"method,url,async=true,username=null,password=null):initialize
                setRequestHeader(header,value):add value instead of overriding the previous one if permitted
                overrideMimeType(type):override response header
                getAllResponseHeaders:"...CRLF...",null
                getResponseHeader(header):null

                */
                xhr.open(settings.method || "GET", settings.url, settings.async === undefined ? true : settings.async);
                if (settings.callback) xhr.onreadystatechange = settings.callback;
                if (settings.timeout) xhr.timeout = settings.timeout;
                if (settings.form)
                    for (let i in this.headers.form) xhr.setRequestHeader(i, this.headers.form[i]);
                if (settings.header)
                    for (let i in settings.header) xhr.setRequestHeader(i, settings.header[i]);
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
        var node = zzz.create(type, {
            src: src
        }, {
            display: "none"
        });
        if (callback) {
            let wrapper = function () {
                callback({
                    node: node,
                    ok: true
                });
            };
            let wrapper_fail = function () {
                callback({
                    node: node,
                    ok: false
                });
            };
            let wrapper_change = function () {
                callback({
                    node: node,
                    readyState: node.readyState
                });
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
        var node = zzz.create("script", {
            src: src
        }, {
            display: "none"
        });
        var uniqueText = zzz.random.string(30);
        window[uniqueText] = function (response) {
            callback(response);
            delete window[uniqueText];
        };
        zzz.set(node, "src", zzz.path.merge(src, {
            callback: uniqueText
        }));
        parent.appendChild(node);
        return node;
    },
    //resource loading
    css: function (src, parent) {
        var node = zzz.create("link", {
            href: src,
            rel: "stylesheet",
            type: "text/css"
        });
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
        var node = zzz.create("script", {
            src: src
        });
        parent.appendChild(node);
    }
};

//absolute path API
//convert a relative path into an absolute API
//for example, ../images/1.jpg + https://blog.cn/css = https://blog.cn/images/1.jpg
//do not add / to the end.
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
        var protocol_index, protocol, component_index, component = [],
            port_index, port, host, path = "/",
            host_index, domain, subdomain;
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
            for (var key = 0; i[key] !== "=" && key < i.length; key++) {}
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
            result = zzz.code.url.encode(result);
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
            var i = text.match(/[0-9]/),
                j;
            if (!i) {
                //pure string
                return text;
            } else {
                i = text.match(/[^0-9\.]/);
                j = i ? i.index : text.length;
                return {
                    value: zzz.toNum(text.slice(0, j)),
                    unit: text.slice(j, text.length)
                };
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
                var splitText = text.split(","),
                    result = {},
                    name = ["r", "g", "b", "a"];
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
            var splitString = [],
                result = {},
                i, j, k, l, index = 0;
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
            var splitText = CSSText.split(/[;\n]/),
                i, j, k, l, result = {};
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
            var result = 0,
                calculate = function (prev, string) {
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
            return {
                0: {
                    value: text
                }
            };
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
//scroll API
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
zzz.value.keyCode = {
    1: "leftbutton",
    2: "rightbutton",
    4: "middlebutton",
    8: "backspace",
    9: "tab",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    19: "pause",
    20: "capslock",
    27: "esc",
    32: "blank",
    33: "pageup",
    34: "pagedown",
    35: "end",
    36: "home",
    37: "leftarrow",
    38: "uparrow",
    39: "rightarrow",
    40: "downarrow",
    44: "printscreen",
    45: "insert",
    46: "delete",
    91: "winl",
    92: "winr",
    106: "*num",
    107: "+num",
    109: "-num",
    110: ".num",
    111: "/num",
    144: "numlock",
    145: "scrolllock",
    160: " ",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    222: "'"

};
zzz.value.convertTokey = function (code) {
    if (code >= 48 && code <= 57) return code - 48 + "";
    else if (code >= 65 && code <= 90) return String.fromCharCode(code + 32);
    else if (code >= 96 && code <= 105) return code - 96 + "num";
    else if (code >= 112 && code <= 123) return "F" + (code - 111);
    else if (code in zzz.value.keyCode) return zzz.value.keyCode[code];
    else return String.fromCharCode(code);
};
//overall initialize
zzz.init = function () {
    let funcs = [zzz.storage, zzz.incidence, zzz.browser, zzz.fetch];
    for (let i of funcs) i.init();
    zzz.inited = true;
    try {
        window.zzzloaded && window.zzzloaded();
        document.zzzloaded && document.zzzloaded();
    } catch (e) {

    }
};
zzz.init();
//自动登录
window.pku_user_name = "";
window.pku_user_password = "";
//页面url
window.page_url = zzz.path.split(zzz.browser.uri);
//刷新时间
window.lastRefreshed = new Date();
//头
window.headers = {
    accept: "application/json, text/javascript, */*; q=0.01",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    origin: "https://elective.pku.edu.cn",
    "X-Requested-With": "XMLHttpRequest"
};
//建立存储
if (!zzz.storage.json("desired")) zzz.storage.set("desired", "[]");
//读取想要的课程列表
window.desiredClass = zzz.storage.json("desired");
//简便写法
window.hideIt = function (e) {
    zzz.set.style(e, "display", "none");
    return hideIt;
};
window.showIt = function (e) {
    zzz.set.style(e, "display", "table-row");
    return showIt;
};
window.opacityIt = function (e) {
    zzz.anim.act(e, {
        opacity: (add_opacity ? "+" : "-") + "0.3"
    });
    return opacityIt;
};
window.nxt = function (e) {
    return e.nextElementSibling;
};
window.code = null;
window.tables = null;
window.validImg = null;
//格式：{元素，课程名，类别，学分，学时，教师，班号，年级，信息，人数，意愿，选择按钮元素}
window.classInfo = [];
window.tableTitle = [];
window.toptable = zzz.create("div", {
    id: "toptable"
}, {
    top: (zzz.storage.get("y") || "0") + "px",
    left: (zzz.storage.get("x") || "0") + "px"
}, document.body);
window.msg = zzz.create("p", {
    innerText: "这里是信息"
}, {
    color: "red",
    fontWeight: "bold",
    transition: "all 0.1s linear"
});
window.add_opacity = false;
//数据
window.abbr = function (name) {
    var origin = "信息科学 地球 国际 环境 生命 城市 中国语言 新闻".split(" ");
    var abbriv = "信科 地空 国关 环科 生科 城环 汉语 新传".split(" ");
    var origin2 = "化学 物理 马克思 心理 艺术 经济 外国 法学".split(" ");
    for (var i in origin) {
        if (name.search(origin[i]) == 0) return abbriv[i];
    }
    for (var i in origin2) {
        if (name.search(origin2[i]) == 0) return name[0] + "院";
    }
    return name.substr(0, 2);
}
window.goToClass = function (e) {
    while (e.tagName.toLowerCase() !== "tr") e = e.parentElement;
    return e;
};
window.getClass = function () {
    //找到第一个表格
    var table;
    for (table of tables) {
        if (table.firstElementChild && table.firstElementChild.firstElementChild && (table.firstElementChild.firstElementChild.className === "datagrid-header")) break;
    }
    if (!table) return;
    //记录表头
    let classLine = table.firstElementChild.firstElementChild;
    //把表头最后一个按钮移动到最前
    //用shouldMove控制
    if (window.shouldMove)
        classLine.insertBefore(classLine.lastElementChild, classLine.firstElementChild);
    for (let i of classLine.children) {
        let text = i.innerText;
        tableTitle.push(text);
    }
    //定位到第一条课程
    classLine = nxt(classLine);
    let index = 0;
    while (classLine) {
        if (classLine.className === "datagrid-footer") break;
        //定位到第一个格子
        let i = classLine.firstElementChild;
        //从第一个格子开始遍历该课程
        let info = {
            element: classLine,
            text: [],
            //记录独一无二的id
            //在showResults.do里没有id，于是跳过
            id: i.firstElementChild.href ? i.firstElementChild.href.match(/BZ[0-9_]+$/)[0] : 0
        };
        let flag = true;
        while (flag && i) {
            let text = i.innerText;
            info.text.push(text);
            //如果是按钮，就把元素存下来，并移动到开头
            //用shouldMove控制
            if (text.search("补选|刷新|预选|取消|删除") !== -1) {
                info.button = i.firstElementChild;
                //高亮可以补选的
                if (text === "补选") {
                    //找到了可以补选的
                    desiredClass.find(function (id, n) {
                        if (id === info.id) {
                            sendMessage(info.text[0] + "可以冲");
                            i.style.backgroundColor = "red";
                            return true;
                        } else return false;
                    });
                }
                if (window.shouldMove)
                    classLine.insertBefore(i, classLine.firstElementChild);
                flag = false;
            }
            //如果是人数，则拆分开来，但还有考虑2倍bug
            else if (text.match("[0-9]{1,3} / [0-9]{1,3}")) {
                let allocation = zzz.toNum(text.match("[0-9]+")[0]),
                    amount = zzz.toNum(text.match(/[ ][0-9]+/)[0]);
                if (amount === 2 * allocation) amount = allocation;
                info.limit = allocation;
                info.current = amount;
                //并且设置宽度大一点，一共15个字符，预计7em够用了
                i.style.width = "7em";
                i.style.boxShadow = "currentColor 0 0 3px 0";
                //且添加记录函数
                zzz.incidence.bind(i, "click", function (e) {
                    e = zzz.incidence.interpret(e);
                    var element = goToClass(e.target).children[1].firstElementChild;
                    var id = element.href.match(/BZ[0-9_]+$/)[0];
                    var name = element.innerText;
                    console.log(id);
                    let included = desiredClass.find(function (x) {
                        return x === id;
                    });
                    if (confirm((included ? "不要" : "想要") + name + "么")) included ? delClass(id) : addClass(id);
                });
            }
            //如果是教师，则删除头衔
            else if (text.match(/教授|研究员|讲师|助理/)) {
                let t = text.replace(/[(][^)]+[)]/g, "");
                i.innerText = t;
            }
            //如果是学院，则缩写
            else if (text.match(/(学院|系|部)$/)) {
                i.innerText = window.abbr(text);
            }
            i = nxt(i);
        }
        classInfo[index] = info;
        index++;
        classLine = nxt(classLine);
    }
};
window.queryDesired = function (desired, undesired) {
    if (!undesired) undesired = function () {};
    for (let cls of classInfo) {
        let flag = true;
        for (let i of desiredClass) {
            if (cls.id === i) {
                flag = false;
                break;
            }
        }
        if (!flag) desired(cls);
        else undesired(cls);
    }
};
//原有的函数
window.elect = function (arr) {
    if (arr[arr.length - 1] < arr[arr.length - 2]) send(j[0]);
};
window.fresh = function () {
    location.reload(true);
};
window.confirmSelect = function (xh, stuName, courseName, classNo, onlySupp, index, seqNo, freshFlag, limitedNbr) {
    if (freshFlag) {
        var refreshUrl2 = "return confirmSelect('" + xh + "','" + stuName + "','" + courseName + "','" + classNo + "'," + onlySupp + ",'" + index + "','" + seqNo + "',false,'" + limitedNbr + "');";
        refreshLimit(xh, stuName, courseName, classNo, onlySupp, index, seqNo, limitedNbr, refreshUrl2);
        return false;
    } else if (onlySupp) {
        sendMessage("现在不可以退课的说");
        return true;
    }
    if (!window.validate(xh)) return false;
    //2021.09从supplement.js摘录
    //2022.02又被注释掉了，但在我这里没有做改动
    var no = "";
    if (classNo != "")
        no = "班号:" + classNo + "。";
    //昌平区特别提示
    var spmsg = "";
    if ((seqNo == 'yjkc20140500014647' && classNo == '03') || (seqNo == 'yjkc20140500014647' && classNo == '04') ||
        (seqNo == 'yjkc20210500039424' && classNo == '04') || (seqNo == 'yjkc20210800040364') || (seqNo == 'yjkc20210800040366')) {
        spmsg = '该课程上课地点在昌平吉利校区。'
    }
    var msg = stuName + "同学,您确定要选《" + courseName + "》这门课程吗？" + no + spmsg + "\n";
    return window.confirm(msg);
};
window.confirmSelectUnder = function (xh, stuName, courseName, classNo, onlySupp, index, seqNo, freshFlag, limitedNbr) {
    if (freshFlag) {
        var refreshUrl2 = "return confirmSelectUnder('" + xh + "','" + stuName + "','" + courseName + "','" + classNo + "'," + onlySupp + ",'" + index + "','" + seqNo + "',false,'" + limitedNbr + "');";
        window.refreshLimit(xh, stuName, courseName, classNo, onlySupp, index, seqNo, limitedNbr, refreshUrl2);
        return false;
    } else return window.validate(xh);
};
window.refreshLimit = function (xh, stuName, courseName, classNo, onlySupp, index, seqNo, limitedNbr, refreshUrl2) {
    clearMsg(); // 清除提示信息
    var currentTime = new Date();
    var diff = (new Date() - lastRefreshed) / 1000;
    if (diff < 2) {
        sendMessage("操作太快了");
        return;
    }
    var limitedNum = parseInt(limitedNbr);
    var xhr = zzz.fetch.ajax({
        url: "/elective2008/edu/pku/stu/elective/controller/supplement/refreshLimit.do",
        method: "POST",
        data: "index=" + index + "&seq=" + seqNo + "&xh=" + xh,
        async: false,
        header: headers
    });
    try {
        var data = JSON.parse(xhr.responseText);
        var newNum = data.electedNum;
        if (newNum == 'NA') {
            sendMessage("刷新频繁！");
        } else if (newNum == 'NB') {
            sendMessage("刷新异常！");
        } else {
            zzz.get.id("electedNum" + index + index).innerHTML = limitedNum + " / " + newNum;
            //万一有剩余名额了
            if (parseInt(newNum) < limitedNum) {
                var aTag = zzz.get.id("#refreshLimit" + index + index);
                aTag.innerText = "补选";
                zzz.set(aTag, "onclick", refreshUrl2);
            } else {
                //否则就没有
                sendMessage("没有空余名额！");
            }
        }
    } catch (e) {
        sendMessage("网络不行的样子");
    }
};
window.getv = function (element) {
    if (element.value) return element.value;
    else if (element.innerText) return element.innerText;
    else return element.innerHTML;
};
window.sendMessage = function (text) {
    msg.innerHTML = text;
    zzz.anim.set(msg, {
        color: zzz.random.color({
            r: {
                max: 200
            },
            g: {
                max: 200
            },
            b: {
                max: 200
            },
            a: {
                min: 0.5
            }
        })
    });
    msg.scrollIntoView(true);
};
window.validate = function (xh) {
    var valid = false;
    var cd = getv(code);
    if (cd.length <= 0) {
        sendMessage("验证码???");
        return false;
    }
    var xhr = zzz.fetch.ajax({
        url: "/elective2008/edu/pku/stu/elective/controller/supplement/validate.do",
        method: "POST",
        data: "xh=" + xh + "&validCode=" + cd,
        header: headers,
        async: false
    });
    try {
        var response = JSON.parse(xhr.responseText);
        //success
        valid = response.valid == 2;
        if (!valid) sendMessage("错了");
    } catch (e) {
        //fail
        sendMessage("断网了");
    }
    return valid;
};
window.changeValid = function () {
    validImg.src = '/elective2008/DrawServlet?Rand=' + Math.random() * 10000;
};
//存储相关
window.addClass = function (id) {
    desiredClass.push(id);
    refreshStorage();
    refreshClass();
};
window.delClass = function (id) {
    let newClass = [];
    for (let i of desiredClass) {
        if (id !== i) newClass.push(i);
    }
    desiredClass = newClass;
    refreshStorage();
    refreshClass();
};
window.refreshStorage = function () {
    //去除重复
    let a = new Set(desiredClass);
    desiredClass = [];
    for (let i of a) desiredClass.push(i);
    zzz.storage.set("desired", JSON.stringify(desiredClass));
};
window.refreshClass = function () {
    queryDesired(function (cls) {
        zzz.set.style(cls.element, "backgroundColor", "#ffb14c");
    });
};
window.moveIt = function (e, element) {
    if (!element) element = toptable;
    e = zzz.incidence.interpret(e);
    window.positionX = e.client[0];
    window.positionY = e.client[1];
    zzz.anim.set(element, {
        left: positionX + "px",
        top: positionY + "px"
    });
};
//自动补选首个课程
window.autoSelect = function () {
    zzz.incidence.bind(code, "change", function () {
        classInfo.find(function (cls) {
            if ((cls.limit > cls.current) && desiredClass.find(function (id) {
                    return id === cls.id;
                })) {
                cls.button.click();
                return true;
            }
        })
    });
};
//重新登录，该函数已重写
window.relogin = function () {
    var original_url = "https://iaaa.pku.edu.cn/iaaa/oauth.jsp?appID=syllabus&appName=%E5%AD%A6%E7%94%9F%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F&redirectUrl=http://elective.pku.edu.cn:80/elective2008/ssoLogin.do";
    if (!(window.pku_user_name && window.pku_user_password)) {
        location.replace(original_url);
        return;
    }
    var token_url = "https://iaaa.pku.edu.cn/iaaa/oauthlogin.do";
    var elect_login_url = "http://elective.pku.edu.cn:80/elective2008/ssoLogin.do";
    var res = zzz.fetch.ajax({
        url: token_url,
        method: "POST",
        data: "appid=syllabus&userName=" + window.pku_user_name + "&password=" + window.pku_user_password + "&randCode=&smsCode=&otpCode=&redirUrl=" + zzz.code.path.encode(elect_login_url),
        header: {
            "Host": "iaaa.pku.edu.cn",
            "Origin": "https://iaaa.pku.edu.cn",
            "Referer": "https://iaaa.pku.edu.cn/iaaa/oauth.jsp?appID=syllabus&appName=%E5%AD%A6%E7%94%9F%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F&redirectUrl=http://elective.pku.edu.cn:80/elective2008/ssoLogin.do",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        async: false
    }).responseText;
    var js = JSON.parse(res);
    console.log("fetch=", js);
    if (!js.token) return;
    var jump_url = elect_login_url + "?_rand=" + zzz.random() + "&token=" + js.token;
    location.replace(jump_url);
}
//美化页面
window.beautify = function () {
    //增大字号
    var css = `
    th,td,a,span,font{
    font-size:20px!important;
    }
    #toptable{
        position: fixed;
        display: flex;
        font-size: 20px;
        background-color: hsla(0,0%,100%,0.34);
        z-index: 9999;
        justify-content: center;
        align-items: first baseline;
        flex-direction: column;
        width:6em;
        overflow:visible;
    }
    #toptable p{
    font-size:1em;
    min-width:20px;
    max-width:6em;
    box-shadow:0 0 3px 0;
    transition:all 1s linear;
    padding:5px;
    background-color:rgba(240,250,250,0.8);
    width:100%;
    text-align:center;
    margin:0;
    }
    #toptable p:hover{
    background-color:rgba(240,50,50,0.8);
    }
    .datagrid{
        padding:0 !important;
        white-space:pre-line;
    }
    .datagrid span {
    display: block;
    overflow: hidden;
    width: auto !important;
    max-height: 10em;
    line-height: 1em;
    word-wrap: anywhere;
    word-break: break-all;
    }
    .datagrid-all{
    color:green;
    }
    `;
    zzz.create("style", {
        innerText: css
    }, null, document.body);
    //去除图标
    for (let j of document.images) {
        if (j.src === "/elective2008/resources/images/attention.jpg") {
            j.src = "";
            hideIt(j.parentElement);
            break;
        }
    }
    //去除背景
    zzz.set(zzz.get("td")[0], "background", "");
    //为顶端增加按钮
    var addButton = function (text, func) {
        var e = zzz.create("p", {
            innerHTML: text
        }, {}, toptable);
        zzz.incidence.bind(e, "click", func);
        return e;
    };
    window.isHidden = false;
    var hide = function (e) {
        if (isHidden)
            queryDesired(function () {}, function (cls) {
                showIt(cls.element);
            });
        else queryDesired(function () {}, function (cls) {
            hideIt(cls.element);
        });
        isHidden = !isHidden;
        hideButton.innerText = isHidden ? "显示课程" : "隐藏课程";
        zzz.storage.set("willHide", isHidden);
    };
    window.hideButton = addButton("隐藏课程", hide);
    var impact = function (e) {
        var b = !zzz.storage.json("impact");
        for (var i of document.querySelectorAll(".datagrid span")) {
            zzz.set.style(i, "maxHeight", b ? "1em" : "10em");
        }
        zzz.storage.set("impact", b);
        window.impactButton.innerText = b ? "紧凑" : "展开";
    };
    window.impactButton = addButton("紧凑模式", impact);
    window.refreshButton = addButton("刷新", fresh);
    //使顶端可移动
    addButton("移动", function (e) {
        zzz.incidence.bind(document.body, "mousemove", moveIt, false);
        zzz.time.loop(function () {
            zzz.incidence.erase(document.body, "mousemove", moveIt, false);
            zzz.storage.set("x", positionX);
            zzz.storage.set("y", positionY)
        }, 5000);
    });
    addButton("重登", function (e) {
        relogin();
    });
    toptable.appendChild(msg);
    //从存储中读取数据
    if (zzz.storage.json("impact")) impact();
    if (zzz.storage.json("willHide")) hide();
};
window.beautifyClass = function () {
    //创建固定顶端
    //把图片移到顶部，方便查看
    if (validImg) {
        toptable.appendChild(validImg);
        toptable.appendChild(code);
        //放大图片与文本框
        zzz.anim.set(code, {
            fontSize: "2em",
            width: "6em",
            height: "auto",
            backgroundColor: "rgba(255,255,255,0.5)"
        });
        zzz.anim.set(validImg, {
            width: "400px",
            filter: "brightness(.6) contrast(4)",
            opacity: 0.8
        });
        //单击图片刷新
        zzz.incidence.bind(validImg, "click", changeValid);
    }
    //去除太极拳提示与通知提示
    var taiChiFlag = true,
        tongZhiFlag = true;
    for (let i of zzz.get.tag("td")) {
        if (taiChiFlag && i.innerText.search("您还未修太极拳") !== -1) {
            hideIt(i.parentElement);
            taiChiFlag = false;
        } else if (tongZhiFlag && i.innerText.search("通知：") !== -1) {
            hideIt(i.parentElement);
            tongZhiFlag = false;
        }
    }
};
window.lazy = {
    funcs: {},
    time: 2000,
    register: function (name, func) {
        if (!this.funcs[name]) {
            this.funcs[name] = {};
            var t = this.funcs[name];
            t.func = func;
            t.name = name;
        }
        t.time = new Date();
        this.tick(name);
    },
    tick: function (name) {
        setTimeout(function () {
            lazy.run(name);
        }, 2 * 1000);
    },
    run: function (name) {
        if (this.funcs[name]) {
            var diff = new Date() - this.funcs[name].time;
            if (diff < lazy.time) return;
            this.funcs[name].func();
            this.funcs[name].time = new Date();
        }
    }
}
window.autoSubmit = function () {
    beautify();
    var form = zzz.get.id("qyForm");
    if (!form) return;
    for (let i of form.getElementsByTagName("input")) {
        if (i.type == "radio")
            zzz.incidence.bind(i, "click", function () {
                lazy.register(i.id, function () {
                    zzz.get.id("b_query").click();
                });
            });
        else if (i.type == "text")
            zzz.incidence.bind(i, "change", function () {
                lazy.register(i.id, function () {
                    zzz.get.id("b_query").click();
                });
            });
    }
}

function init_elect() {
    tables = zzz.get("table");
    if (!tables) {
        zzz.time.tick(init_elect, 1000);
        return;
    }
    console.log("elect enhancement running!");
    code = zzz.get("#validCode");
    validImg = zzz.get.id("imgname");
    getClass();
    beautify();
    beautifyClass();
    refreshClass();
    try {
        code.focus();
        autoSelect();
    } catch (e) {}
    if (!classInfo.find(function (cls) {
            if ((cls.limit > cls.current) && desiredClass.find(function (id) {
                    return id === cls.id;
                })) {
                return true;
            }
        })) {
        //zzz.time.loop(fresh, zzz.random.int(60000, 600000))
    };
}

function queryPath(regstr) {
    return page_url.path.search(regstr) !== -1;
}
//如果是已经补选成功的页面，则回退。
//经测试，该条件不可用，因为会影响到时间冲突返回页面
//if (page_url.path.match("electSupplement")) history.go(-1);
//如果是补选失败的页面，直接重新登录。
if (zzz.get.tag("strong").length && zzz.get.tag("strong")[0].innerText === "提示:") relogin();
if (queryPath("supplement")) window.shouldMove = true;
if (queryPath("electiveWork|electivePlan|supplement")) init_elect();
//如果是添加界面，则注册事件
else if (queryPath("CourseQueryController|getCurriculmByForm")) autoSubmit();
//如果是登录界面，则自动登录
else if (page_url.path === "/iaaa/oauth.jsp" || page_url.path === "/elective2008/logout.do") {
    //等待以载入
    zzz.time.loop(function () {
        if (window.pku_user_name) zzz.get.id("user_name").value = window.pku_user_name;
        if (window.pku_user_password) zzz.get.id("password").value = window.pku_user_password;
        if (getv(zzz.get.id("user_name")) && getv(zzz.get.id("password"))) window.oauthLogon();
    }, 1000);
}
//自动进入补退选界面
//else if(page_url.path === "/elective2008/edu/pku/stu/elective/controller/help/HelpController.jpf") location.replace("/elective2008/edu/pku/stu/elective/controller/supplement/SupplyCancel.do");
//如果不是补选页面，则不执行
else {
    console.log("not usable");
    beautify();
}