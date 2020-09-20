"use strict";
window.desiredClass=[];
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
        else if(zzz.fetch.ajaxEnabled){
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
window.info=[];
window.getTBody=function () {
    if(table&&table.firstChild){
        var b=table.childNodes[1];
        var i=b.firstElementChild,index=0,idx=1;
        while(i.nextElementSibling){
            i=i.nextElementSibling;
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
            info[index][idx]=parseInt(info[index][idx-1].replace(/^\d*\//,""));
            info[index][idx-1]=parseInt(info[index][idx-1].replace(/\/\d*$/,""));
            index++;
            idx=1;
        }
    }
    else setTimeout(getTBody,1000);
};
window.getAll=function () {
    code=zzz.get("#validCode");
    table=zzz.get(".datagrid");
    getTBody();
    console.log(info);
};
getAll();
window.autoElect=function () {
    for(let i of desiredClass){
        for(let j of info){
            let flag=true;
            for(let n=1;n<i.length&&n<j.length-2&&flag;n++){
                if(i[n]!==j[n]) flag=false;
            }
            if(flag) elect(j);
        }
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