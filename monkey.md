如果使用油猴插件，那么请新建脚本并复制以下内容保存：
···
// ==UserScript==
// @name     未命名脚本 202118
// @version  1
// @name     autoElect
// @match    file:///F:/%E7%BD%91%E9%A1%B5/PKUElective/%E8%A1%A5%E9%80%89.html
// @match    https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/supplement/SupplyCancel.do
// @grant    none
// @run-at   document-end
// ==/UserScript==
"use strict";
var a=document.createElement("script");
a.setAttribute("src","https://www.zzzzzzzs.xyz/auto.js?q=1");
document.head.appendChild(a);
···
