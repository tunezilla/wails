(()=>{var te=Object.defineProperty;var w=(e,t)=>{for(var n in t)te(e,n,{get:t[n],enumerable:!0})};var v={};w(v,{SetText:()=>oe,Text:()=>re});var ne=window.location.origin+"/wails/runtime";function ie(e,t,n){let i=new URL(ne);i.searchParams.append("method",e),n&&i.searchParams.append("args",JSON.stringify(n));let o={headers:{}};return t&&(o.headers["x-wails-window-name"]=t),new Promise((l,f)=>{fetch(i,o).then(a=>{if(a.ok)return a.headers.get("Content-Type")&&a.headers.get("Content-Type").indexOf("application/json")!==-1?a.json():a.text();f(Error(a.statusText))}).then(a=>l(a)).catch(a=>f(a))})}function r(e,t){return function(n,i=null){return ie(e+"."+n,t,i)}}var z=r("clipboard");function oe(e){z("SetText",{text:e})}function re(){return z("Text")}var M={};w(M,{Hide:()=>le,Quit:()=>se,Show:()=>ae});var b=r("application");function le(){b("Hide")}function ae(){b("Show")}function se(){b("Quit")}var S={};w(S,{Log:()=>ce});var ue=r("log");function ce(e){return ue("Log",e)}var W={};w(W,{GetAll:()=>fe,GetCurrent:()=>me,GetPrimary:()=>de});var E=r("screens");function fe(){return E("GetAll")}function de(){return E("GetPrimary")}function me(){return E("GetCurrent")}var pe="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";var g=(e=21)=>{let t="",n=e;for(;n--;)t+=pe[Math.random()*64|0];return t};var we=r("call"),u=new Map;function ge(){let e;do e=g();while(u.has(e));return e}function O(e,t,n){let i=u.get(e);i&&(n?i.resolve(JSON.parse(t)):i.resolve(t),u.delete(e))}function R(e,t){let n=u.get(e);n&&(n.reject(t),u.delete(e))}function D(e,t){return new Promise((n,i)=>{let o=ge();t=t||{},t["call-id"]=o,u.set(o,{resolve:n,reject:i}),we(e,t).catch(l=>{i(l),u.delete(o)})})}function P(e){return D("Call",e)}function T(e,t,...n){return D("Call",{packageName:"wails-plugins",structName:e,methodName:t,args:n})}function A(e){let t=r("window",e);return{Center:()=>void t("Center"),SetTitle:n=>void t("SetTitle",{title:n}),Fullscreen:()=>void t("Fullscreen"),UnFullscreen:()=>void t("UnFullscreen"),SetSize:(n,i)=>t("SetSize",{width:n,height:i}),Size:()=>t("Size"),SetMaxSize:(n,i)=>void t("SetMaxSize",{width:n,height:i}),SetMinSize:(n,i)=>void t("SetMinSize",{width:n,height:i}),SetAlwaysOnTop:n=>void t("SetAlwaysOnTop",{alwaysOnTop:n}),SetPosition:(n,i)=>t("SetPosition",{x:n,y:i}),Position:()=>t("Position"),Screen:()=>t("Screen"),Hide:()=>void t("Hide"),Maximise:()=>void t("Maximise"),Show:()=>void t("Show"),Close:()=>void t("Close"),ToggleMaximise:()=>void t("ToggleMaximise"),UnMaximise:()=>void t("UnMaximise"),Minimise:()=>void t("Minimise"),UnMinimise:()=>void t("UnMinimise"),Restore:()=>void t("Restore"),SetBackgroundColour:(n,i,o,l)=>void t("SetBackgroundColour",{r:n,g:i,b:o,a:l})}}var he=r("events"),k=class{constructor(t,n,i){this.eventName=t,this.maxCallbacks=i||-1,this.Callback=o=>(n(o),this.maxCallbacks===-1?!1:(this.maxCallbacks-=1,this.maxCallbacks===0))}},h=class{constructor(t,n=null){this.name=t,this.data=n}},s=new Map;function x(e,t,n){let i=s.get(e)||[],o=new k(e,t,n);return i.push(o),s.set(e,i),()=>xe(o)}function N(e,t){return x(e,t,-1)}function H(e,t){return x(e,t,1)}function xe(e){let t=e.eventName,n=s.get(t).filter(i=>i!==e);n.length===0?s.delete(t):s.set(t,n)}function F(e){console.log("dispatching event: ",{event:e});let t=s.get(e.name);if(t){let n=[];t.forEach(i=>{i.Callback(e)&&n.push(i)}),n.length>0&&(t=t.filter(i=>!n.includes(i)),t.length===0?s.delete(e.name):s.set(e.name,t))}}function B(e,...t){[e,...t].forEach(i=>{s.delete(i)})}function G(){s.clear()}function C(e){he("Emit",e)}var Ce=r("dialog"),c=new Map;function ve(){let e;do e=g();while(c.has(e));return e}function I(e,t,n){let i=c.get(e);i&&(n?i.resolve(JSON.parse(t)):i.resolve(t),c.delete(e))}function U(e,t){let n=c.get(e);n&&(n.reject(t),c.delete(e))}function d(e,t){return new Promise((n,i)=>{let o=ve();t=t||{},t["dialog-id"]=o,c.set(o,{resolve:n,reject:i}),Ce(e,t).catch(l=>{i(l),c.delete(o)})})}function Y(e){return d("Info",e)}function Q(e){return d("Warning",e)}function X(e){return d("Error",e)}function m(e){return d("Question",e)}function j(e){return d("OpenFile",e)}function V(e){return d("SaveFile",e)}var be=r("contextmenu");function Me(e,t,n,i){be("OpenContextMenu",{id:e,x:t,y:n,data:i})}function J(){window.addEventListener("contextmenu",Se)}function Se(e){let t=e.target,n=window.getComputedStyle(t).getPropertyValue("--custom-contextmenu");if(n=n?n.trim():"",n){e.preventDefault();let i=window.getComputedStyle(t).getPropertyValue("--custom-contextmenu-data");Me(n,e.clientX,e.clientY,i);return}Ee(e)}function Ee(e){let t=e.target,n=window.getComputedStyle(t).getPropertyValue("--default-contextmenu");switch(n=n?n.trim():"",n){case"show":return;case"hide":e.preventDefault();return;default:let i=t.getAttribute("contentEditable");if(i&&i.toLowerCase()==="true")return;let o=window.getSelection();if(o&&o.toString().length>0)return;let l=t.tagName.toLowerCase();if(l==="input"||l==="textarea")return;e.preventDefault()}}function q(e,t=null){let n=new h(e,t);C(n)}function We(){document.querySelectorAll("[data-wml-event]").forEach(function(t){let n=t.getAttribute("data-wml-event"),i=t.getAttribute("data-wml-confirm"),o=t.getAttribute("data-wml-trigger")||"click",l=function(){if(i){m({Title:"Confirm",Message:i,Buttons:[{Label:"Yes"},{Label:"No",IsDefault:!0}]}).then(function(f){f!=="No"&&q(n)});return}q(n)};t.removeEventListener(o,l),t.addEventListener(o,l)})}function _(e){wails.Window[e]===void 0&&console.log("Window method "+e+" not found"),wails.Window[e]()}function ke(){document.querySelectorAll("[data-wml-window]").forEach(function(t){let n=t.getAttribute("data-wml-window"),i=t.getAttribute("data-wml-confirm"),o=t.getAttribute("data-wml-trigger")||"click",l=function(){if(i){m({Title:"Confirm",Message:i,Buttons:[{Label:"Yes"},{Label:"No",IsDefault:!0}]}).then(function(f){f!=="No"&&_(n)});return}_(n)};t.removeEventListener(o,l),t.addEventListener(o,l)})}function y(){We(),ke()}var K=function(e){webkit.messageHandlers.external.postMessage(e)};var ye=new Map;function Z(e){let t=new Map;for(let[n,i]of Object.entries(e))typeof i=="object"&&i!==null?t.set(n,Z(i)):t.set(n,i);return t}fetch("/wails/flags").then(e=>{e.json().then(t=>{ye=Z(t)})});var p=!1;function Le(e){let t=window.getComputedStyle(e.target).getPropertyValue("--webkit-app-region");return t&&(t=t.trim()),t!=="drag"||e.buttons!==1?!1:e.detail===1}function $(){window.addEventListener("mousedown",ze),window.addEventListener("mousemove",Re),window.addEventListener("mouseup",Oe)}function ze(e){if(Le(e)){if(e.offsetX>e.target.clientWidth||e.offsetY>e.target.clientHeight)return;p=!0}else p=!1}function Oe(e){(e.buttons!==void 0?e.buttons:e.which)>0&&L()}function L(){document.body.style.cursor="default",p=!1}function Re(e){if(p){p=!1,(e.buttons!==void 0?e.buttons:e.which)>0&&K("drag");return}}window.wails={...ee(null),Capabilities:{}};fetch("/wails/capabilities").then(e=>{e.json().then(t=>{window.wails.Capabilities=t})});window._wails={dialogCallback:I,dialogErrorCallback:U,dispatchWailsEvent:F,callCallback:O,callErrorCallback:R,endDrag:L};function ee(e){return{Clipboard:{...v},Application:{...M,GetWindowByName(t){return ee(t)}},Log:S,Screens:W,Call:P,Plugin:T,WML:{Reload:y},Dialog:{Info:Y,Warning:Q,Error:X,Question:m,OpenFile:j,SaveFile:V},Events:{Emit:C,On:N,Once:H,OnMultiple:x,Off:B,OffAll:G},Window:A(e)}}console.log("Wails v3.0.0 Debug Mode Enabled");J();$();document.addEventListener("DOMContentLoaded",function(e){y()});})();
