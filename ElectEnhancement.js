// ==UserScript==
// @name         PKU Elective Enhancement
// @namespace    elective
// @description  enhance the page
// @match        https://elective.pku.edu.cn/*
// @match        https://iaaa.pku.edu.cn/*
// @grant        none
// ==/UserScript==
"use strict";
//自动登录
window.pku_user_name = "";
window.pku_user_password = "";
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
    zzz.anim.act(e, {opacity: (add_opacity ? "+" : "-") + "0.3"});
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
window.toptable = zzz.create("div", {id: "toptable"}, {
    position: "fixed",
    display: "flex",
    top: (zzz.storage.get("x") || "0") + "px",
    left: (zzz.storage.get("y") || "0") + "px",
    fontSize: "20px",
    backgroundColor: "hsla(0,0%,100%,0.34)",
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center"
}, document.body);
window.msg = zzz.create("p", {innerText: "这里是信息"}, {color: "red", fontWeight: "bold", transition: "all 0.1s linear"});
window.add_opacity = false;
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
            id: i.firstElementChild.href.match(/BZ[0-9_]+$/)[0]
        };
        let flag = true;
        while (flag && i) {
            let text = i.innerText;
            info.text.push(text);
            //如果是按钮，就把元素存下来，并移动到开头
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
                classLine.insertBefore(i, classLine.firstElementChild);
                flag = false;
            }
            //如果是人数，则拆分开来，但还有考虑2倍bug
            else if (text.match("[0-9]{1,3} / [0-9]{1,3}")) {
                let allocation = zzz.toNum(text.match("[0-9]+")[0]), amount = zzz.toNum(text.match(/[ ][0-9]+/)[0]);
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
            i = nxt(i);
        }
        classInfo[index] = info;
        index++;
        classLine = nxt(classLine);
    }
};
window.queryDesired = function (desired, undesired) {
    if (!undesired) undesired = function () {
    };
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
        window.refreshLimit(xh, stuName, courseName, classNo, onlySupp, index, seqNo, limitedNbr, refreshUrl2);
        return false;
    } else if (onlySupp) {
        sendMessage("退课的话，不可以的呢");
        return false;
    } else return window.validate(xh);
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
    var limitedNum = parseInt(limitedNbr);
    var xhr = zzz.fetch.ajax(
        {
            url: "/elective2008/edu/pku/stu/elective/controller/supplement/refreshLimit.do",
            method: "POST",
            data: "index=" + index + "&seq=" + seqNo + "&xh=" + xh,
            async: false,
            header: headers
        }
    );
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
        color: zzz.random.color({r: {max: 200}, g: {max: 200}, b: {max: 200}, a: {min: 0.5}})
    });
    msg.scrollIntoView(true);
};
window.validate = function (xh) {
    var valid = false;
    var cd = getv(code);
    if (cd.length !== 4) {
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
    let a=new Set(desiredClass);
    let newClass=[];
    for(let i of a) newClass.push(i);
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
//美化页面
window.beautify = function () {
    //增大字号
    var css = `
    th,td,a,span,font{
    font-size:20px!important;
    }
    #toptable p{
    font-size:1em;
    min-width:30px;
    box-shadow:0 0 3px 0;
    transition:all 1s linear;
    padding:5px;
    background-color:rgba(240,250,250,0.8);
    }
    #toptable p:hover{
    background-color:rgba(240,50,50,0.8);
    }
    .datagrid span {
    display: block;
    overflow: hidden;
    width: auto !important;
    max-height: 1em;
    line-height: 1em;
    word-wrap: anywhere;
    word-break: break-all;
    }
    .datagrid-all{
    color:green;
    }
    `;
    zzz.create("style", {innerText: css}, null, document.body);
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
        var e = zzz.create("p", {innerHTML: text}, {}, toptable);
        zzz.incidence.bind(e, "click", func);
        return e;
    };
    window.isHidden = false;
    window.hideButton = addButton("隐藏课程", function (e) {
        if (isHidden)
            queryDesired(function () {
            }, function (cls) {
                showIt(cls.element);
            });
        else queryDesired(function () {
        }, function (cls) {
            hideIt(cls.element);
        });
        isHidden = !isHidden;
        hideButton.innerText = isHidden ? "显示课程" : "隐藏课程";
        zzz.storage.set("willHide", isHidden);
    });
    window.refreshButton = addButton("刷新", fresh);
    //使顶端可移动
    addButton("5秒内移动", function (e) {
        zzz.incidence.bind(document.body, "mousemove", moveIt, false);
        zzz.time.loop(function () {
            zzz.incidence.erase(document.body, "mousemove", moveIt, false);
            zzz.storage.set("x", positionX);
            zzz.storage.set("y", positionY)
        }, 5000);
    });
    toptable.appendChild(msg);
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
            filter: "contrast(2)",
            opacity: 0.8
        });
        //单击图片刷新
        zzz.incidence.bind(validImg, "click", changeValid);
    }
    //去除太极拳提示与通知提示
    var taiChiFlag = true, tongZhiFlag = true;
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
window.init_count = 5;

function init_elect() {
    init_count--;
    if (!init_count) return;
    tables = zzz.get("table");
    if (!tables) {
        zzz.time.loop(init_elect, 1000);
        return;
    }
    console.log("elect enhancement running!");
    code = zzz.get("#validCode");
    validImg = zzz.get.id("imgname");
    getClass();
    beautify();
    beautifyClass();
    refreshClass();
    code.focus();
    if (zzz.storage.get("willHide")) hideButton.click();
}

window.page_url = zzz.path.split(zzz.browser.uri);
console.log(page_url);
//如果是已经补选成功的页面，则回退。
if (page_url.path.match("electSupplement")) history.go(-1);
//如果是补选失败的页面，直接重新登录。
else if (zzz.get.tag("strong").length && zzz.get.tag("strong")[0].innerText === "提示:") location.replace("https://iaaa.pku.edu.cn/iaaa/oauth.jsp?appID=syllabus&appName=%E5%AD%A6%E7%94%9F%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F&redirectUrl=http://elective.pku.edu.cn:80/elective2008/ssoLogin.do");
else if (page_url.path.search("electiveWork|electivePlan|supplement") !== -1) init_elect();
//如果是登录界面，则自动登录
else if (page_url.path === "/iaaa/oauth.jsp" || page_url.path === "/elective2008/logout.do") {
    //等待以载入
    zzz.time.loop(function () {
        if (window.pku_user_name) zzz.get.id("user_name").value = window.pku_user_name;
        if (window.pku_user_password) zzz.get.id("password").value = window.pku_user_password;
        if (getv(zzz.get.id("user_name")) && getv(zzz.get.id("password"))) window.oauthLogon();
    }, 100);
}
//如果不是补选页面，则不执行
else {
    console.log("not usable");
    beautify();
}
