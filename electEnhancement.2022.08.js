// ==UserScript==
// @name         PKU Elective Enhancement
// @namespace    elective
// @version      2022.08
// @description  enhance the page
// @match        https://elective.pku.edu.cn/*
// @match        https://iaaa.pku.edu.cn/*
// @grant        none
// ==/UserScript==
"use strict";
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
                    var id = "";
                    var name = "???";
                    var element = zzz.query("a",goToClass(e.target),function(x){if(id==""&&x.href){id=x.href.match(/BZ[0-9_]+$/)[0];name=x.innerText;}});
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
            filter: "brightness(.6) contrast(1)",
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
