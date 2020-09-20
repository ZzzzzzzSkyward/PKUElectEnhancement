如果使用油猴插件，那么请新建脚本并复制以下内容保存：
```javascript
// ==UserScript==
// @version  1
// @name     autoElect
// @match    https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/supplement/SupplyCancel.do
// @grant    none
// @run-at   document-end
// ==/UserScript==
"use strict";
var a=document.createElement("script");
a.setAttribute("src","https://zzzzzzzskyward.github.io/auto.js");
document.head.appendChild(a);
```
