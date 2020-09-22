"use strict";
if(location.search&&(location.pathname.search("electSupplement")!==-1)){
    history.go(-1);
    throw new Error("");
}
if(
    location.pathname!=="/elective2008/edu/pku/stu/elective/controller/supplement/SupplyCancel.do"&&
    location.pathname!=="/elective2008/edu/pku/stu/elective/controller/supplement/supplement.jsp"
) throw new Error("not usable");
if(!window.localStorage["desired"]) localStorage["desired"]="[]";
window.desiredClass=JSON.parse(window.localStorage["desired"]);
window.zzz={};
zzz.get=function (name) {
    if(name[0]==='.') return zzz.get.cls(name.substr(1));
    else if(name[0]==='#') return zzz.get.id(name.substr(1));
    else return  zzz.get.tag(name);
};
zzz.get.id=function (id) {
    return document.getElementById(id);
};
zzz.get.cls=function (className) {
    var a=null;
    try {
        a=document.getElementsByClassName(className)[0];
    }catch(e){}
    return  a;
};
zzz.fetch={
    fetchEnabled:false,
    ajaxEnabled:false,
    safe_fetch:{
        method: "GET",
        mode:"same-origin",
        credentials: "same-origin",
        cache:"default",
        redirect:"follow"
    },
    requestStructure:function() {
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
    headStructure:{
    },
    head:{
        create:function(settings){
            var head=new Headers();
            for(var i in settings){
                head.append(i,settings.i);
            }
            return head;
        }
    },
    send:function(){throw new Error("sending fetch");},
    init:function () {
        try {
            if (window.fetch || WorkerGlobalScope.fetch) zzz.fetch.fetchEnabled=true;
        }catch (e) {}
        try{
            if(XMLHttpRequest) zzz.fetch.ajaxEnabled=true;
        }catch (e) {}
        if(zzz.fetch.fetchEnabled) {
            zzz.fetch.fetch = function (settings) {
                if (!settings.url) return false;
                if (typeof settings.input === "string") {
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
                var promise = zzz.fetch.send(settings.url, init);
                if (settings.callback) return promise.then(settings.callback);
                else return promise;
            };
        }
        if(zzz.fetch.ajaxEnabled){
            zzz.fetch.ajax=function (settings) {
                if(!settings.url) return false;
                var xhr=new XMLHttpRequest();
                if(settings.callback) xhr.onreadystatechange=settings.callback;
                if(settings.timeout) xhr.timeout=settings.timeout;
                if(settings.ontimeout) xhr.ontimeout=settings.ontimeout;
                xhr.open(settings.method||"GET",settings.url,settings.async===undefined?true:settings.async);
                xhr.send(settings.data);
                return xhr;
            }
        }
    },
    judge:function (response) {
        console.log(response);
        if(response.complete) return "success";
        if(response.ok!==undefined) return response.ok?"success":"fail";
        return response.readyState===4?(response.status===200?"pending":"fail"):"success";
    },
    //jsonp without cors callback
    cors:function(src,type,parent,callback) {
        if(!parent) parent=document.body;
        if(!type) type="script";
        var node=zzz.create(type,{src:src},{display:"none"});
        if(callback) {
            let wrapper = function () {
                callback({node:node,ok:true});
            };
            let wrapper_fail = function () {
                callback({node:node,ok:false});
            };
            let wrapper_change=function(){
                callback({node:node,readyState:node.readyState});
            };
        }
        parent.appendChild(node);
        return node;
    }
};
zzz.set=function (element,attribute,value) {
    element.setAttribute(attribute,value);
};
zzz.fetch.init();
window.code=null;
window.table=null;
window.validImg=null;
window.info=[];
window.elements=[];
window.getTBody=function () {
    if(table&&table.firstChild){
        var b=table.childNodes[1];
        var i=b.firstElementChild,index=0,idx=1;
        while(i.nextElementSibling){
            i=i.nextElementSibling;
            i.value=index;
            let j=i.firstElementChild;
            if(!j) break;
            info[index]=[];
            info[index][idx] = j.getElementsByTagName("span")[0].innerText;
            if(info[index][idx]==="补选"||info[index][idx]==="刷新"){
                info[index][0]=j.getElementsByTagName("a")[0].href;
            }
            else idx++;
            while(j.nextElementSibling) {
                j=j.nextElementSibling;
                info[index][idx] = j.getElementsByTagName("span")[0].innerText;
                if(info[index][idx]==="补选"||info[index][idx]==="刷新"){
                    info[index][0]=j.getElementsByTagName("a")[0].href;
                }
                else idx++;
            }
            info[index][idx]=parseInt(info[index][idx-1].replace(/^\d* \/ /,""));
            info[index][idx-1]=parseInt(info[index][idx-1].replace(/\/ \d*$/,""));
            index++;
            idx=1;
            elements.push(i);
        }
    }
    else setTimeout(getTBody,1000);
};
window.getAll=function () {
    code=zzz.get("#validCode");
    table=zzz.get(".datagrid");
    validImg=zzz.get.id("imgname");
    getTBody();
    console.log(info);
};
getAll();
window.choose=function (func,isreverse) {
    if(isreverse===undefined) isreverse=false;
    for(let j in info){
        let flbg=true;
        for(let i of desiredClass){
            let flag=false;
            for(let n=1;n<i.length&&(n<(info[j].length-2))&&(!flag);n++){
                if(i[n]!==info[j][n]) flag=true;
            }
            if(!flag){
                if(!isreverse) func(j);
                flbg=false;
                break;
            }
        }
        if(flbg&&isreverse){
            func(j);
        }
    }
};
window.chooseFull=function(func,isreverse){
    if(isreverse===undefined) isreverse=false;
    for(let j in info){
        let flag=info[j][info[j].length-1]>=info[j][info[j].length-2];
        if(flag){
            if(!isreverse) {
                func(j);
            }
        }
        else if(isreverse) func(j);
    }
};
window.elect=function (arr) {
    if(arr[arr.length-1]<arr[arr.length-2]) send(j[0]);
};
window.fresh=function () {
    location.reload(true);
};
window.send=function (url) {
    /*var callback=function (response) {
        console.log(response);
        if(zzz.fetch.judge(response)==="success"){
            var status=response.valid;
            alert("success");
        }
        else alert("fail");
    };*/
    zzz.fetch.create(url,{cors:true});
};
window.addClass=function(arr){
    desiredClass[desiredClass.length]=arr;
    window.localStorage["desired"]=JSON.stringify(desiredClass);
};
window.select=function (e) {
    var ele=e.target||e.srcElement;
    var par=ele.parentElement;
    if(par.tagName.toLowerCase()!=="tr"){
        ele=par;
        par=ele.parentElement;
    }
    if(par.firstElementChild===ele) {
        var v = par.value;
        if(v===undefined) return;
        var check=confirm("'" + info[v].join("','") + "'");
        if(check){
            addClass(info[v]);
        }
    }
};
window.confirmSelect=function(stuName,courseName,classNo,onlySupp,index,seqNo,freshFlag,limitedNbr) {
    if(freshFlag){
        var refreshUrl2 = "return confirmSelect('"+stuName+"','"+courseName+"','"+classNo+"',"+onlySupp+",'"+index+"','"+seqNo+"',false,'"+limitedNbr+"');";
        window.refreshLimit(stuName,courseName,classNo,onlySupp,index,seqNo,limitedNbr,refreshUrl2);
        return false;
    }else{
        if(window.validate()===false) return false;
        return true;
    }
};
window.validate=function() {
    var valid=false;
    $.ajax({
        url: "/elective2008/edu/pku/stu/elective/controller/supplement/validate.do",
        type: "post",
        data: "validCode=" + code.value||code.innerText,
        dataType: "json",
        async: false,
        success:function (data) {
            valid=data.valid==2;
            if(!valid){
                code.previousElementSibling.innerText="错了";
            }
        },
        fail:function (data) {
            code.previousElementSibling.innerText="断网了";
        }
    });
    return valid;
};
window.hideall=function(hid){
    var hide=function (e) {elements[e].style.display="none";};
    var show=function (e) {elements[e].style.display="table-row";};
    if(hid){
        choose(hide,true);
        chooseFull(hide);
    }
    else{
        choose(show,true);
        chooseFull(show);
    }
    status_hide=hid;
};
window.transparent=function(tp){
    var trans=function (e) {elements[e].style.opacity=parseFloat(getComputedStyle(elements[e])["opacity"])-0.3;};
    var show=function (e) {elements[e].style.opacity=parseFloat(getComputedStyle(elements[e])["opacity"])+0.3;};
    if(tp) choose(trans,true);
    else choose(show,true);
};
table.onclick=select;
var status_hide=false;
var transparent_count=0;
zzz.get.cls("subTitle").innerText="显示/隐藏满的与不要的";
zzz.get.cls("pkuportal-remark").innerHTML="       增减透明度                              ";
zzz.get.cls("subTitle").onclick=function (){hideall(!status_hide)};
zzz.get.cls("pkuportal-remark").onclick=function () {
    transparent((transparent_count%6)<3);
    transparent_count++;
};
var append=function(e,s){
    for(let i in s) e[i]=s[i];
};
window.toptable=code.parentElement.parentElement.parentElement.parentElement
append(toptable.style,{
    position:"fixed",
    backgroundColor:"rgba(255,255,255,0.6)",
    top:0,
    left:0
});
append(zzz.get.id("validCodeImg").previousElementSibling.style,{
   position:"fixed",
   left:"0",
    top:"30px",
    backgroundColor:"rgba(255,255,255,0.9)"
});
append(validImg.style,{
    position: "fixed",
    left:"10px",
    top:"50px",
    opacity:"0.9",
    width:"100px"
});
append(document.getElementsByClassName("errmsg")[1],{
   innerHTML:"&nbsp;&nbsp;&nbsp;&nbsp;刷新",
   onclick:function () {
        location.replace("https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/supplement/electSupplement.do");
   }
});
try {
    var b=toptable.firstElementChild.firstElementChild.firstElementChild;
    append(b.nextElementSibling.style,{
        textAlign: "left"
    });
}catch(e){}

hideall(!status_hide);
