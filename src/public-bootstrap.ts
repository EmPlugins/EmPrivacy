// SPDX-License-Identifier: MIT

import { COOKIE_NAME, jsonForHtmlScript, type EmprivacyPublicRuntimeConfig } from "./config.js";

/**
 * Public-site bootstrap. Banner copy is applied with textContent / createTextNode only.
 * Embed/script URLs are re-validated in the browser (never trust DOM data-src alone).
 */
export function buildBodyBootstrap(pr: EmprivacyPublicRuntimeConfig): string {
	const jsonLiteral = jsonForHtmlScript(pr);
	return `(function(){
var C=${jsonLiteral};
var CN="${COOKIE_NAME}";
var listeners=[];
var PRESET_HOSTS={"static.cloudflareinsights.com":1,"plausible.io":1,"cdn.usefathom.com":1,"scripts.simpleanalyticscdn.com":1,"www.googletagmanager.com":1,"googletagmanager.com":1};
var YT_IFRAME=/^https:\\/\\/(?:www\\.)?youtube-nocookie\\.com\\/embed\\/[A-Za-z0-9_-]{11}\\/?$/;
var VIMEO_IFRAME=/^https:\\/\\/player\\.vimeo\\.com\\/video\\/\\d{6,12}\\/?$/;
function readCookie(){
try{
var m=document.cookie.match(new RegExp("(?:^|;\\\\s*)"+CN+"=([^;]*)"));
var v=m?decodeURIComponent(m[1]):"";
if(!v||v.length>1024)return"";
return v;
}catch(e){return"";}
}
function writeCookie(val){
var secure=document.location.protocol==="https:"?"; Secure":"";
var maxAge=typeof C.cookieMaxAge==="number"&&C.cookieMaxAge>0?C.cookieMaxAge:15552000;
document.cookie=CN+"="+encodeURIComponent(val)+"; Path=/; SameSite=Lax"+secure+"; Max-Age="+maxAge;
}
function flagOk(x){return x===0||x===1||x===true||x===false;}
function parseState(s){
try{
var o=JSON.parse(s);
if(!o||typeof o!=="object")return null;
if(typeof o.v!=="string")return null;
if(o.v!==C.policyVersion)return null;
if(!flagOk(o.a)||!flagOk(o.m)||!flagOk(o.f))return null;
return {v:o.v,essential:true,functional:!!o.f,analytics:!!o.a,marketing:!!o.m};
}catch(e){return null;}
}
function currentState(){return parseState(readCookie());}
function emit(st){
listeners.slice().forEach(function(fn){try{fn(st);}catch(e){}});
try{document.dispatchEvent(new CustomEvent("emprivacy:change",{detail:st}));}catch(e){}
}
function needBanner(){
if(C.hideBanner)return false;
return !parseState(readCookie());
}
function parseHttps(raw){
try{
if(!raw||typeof raw!=="string"||raw.length>2048)return null;
if(/[\\u0000-\\u001F\\u007F\\s]/.test(raw))return null;
if(/%0d|%0a|%09|%0b|%0c|%20/i.test(raw))return null;
var u=new URL(raw);
if(u.protocol!=="https:")return null;
if(u.username||u.password)return null;
var h=u.hostname.toLowerCase();
if(h==="localhost"||h.endsWith(".localhost")||h==="127.0.0.1"||h==="::1")return null;
return u;
}catch(e){return null;}
}
function hostAllowed(u,allowPresets){
var h=u.hostname.toLowerCase();
if(allowPresets&&PRESET_HOSTS[h])return true;
var list=C.scriptHostAllowlist||[];
if(!list.length)return true;
return list.indexOf(h)>=0;
}
function safeScriptUrl(raw,allowPresets){
var u=parseHttps(raw);
if(!u||u.hash)return null;
if(!hostAllowed(u,!!allowPresets))return null;
return u.href;
}
function allowedIframe(src){return YT_IFRAME.test(src)||VIMEO_IFRAME.test(src);}
function allowedLink(src,kind){
var u=parseHttps(src);
if(!u)return false;
var h=u.hostname.toLowerCase();
if(h==="x.com"||h==="www.x.com"||h==="twitter.com"||h==="www.twitter.com"||h==="mobile.twitter.com"){
return /\\/(?:i\\/web\\/)?status(?:es)?\\/\\d{5,20}\\/?$/i.test(u.pathname);
}
if(h==="bsky.app"||h==="www.bsky.app"){
return /^\\/profile\\/[^/]+\\/post\\/[^/]+\\/?$/.test(u.pathname);
}
if(h==="gist.github.com"){
return /^\\/[A-Za-z0-9-]{1,39}\\/[a-f0-9]{8,64}\\/?$/i.test(u.pathname);
}
if(/^\\/@[^/]+\\/\\d+\\/?$/.test(u.pathname)||/^\\/users\\/[^/]+\\/statuses\\/\\d+\\/?$/.test(u.pathname))return true;
return kind==="linkPreview";
}
function alreadyScriptSrc(u){
try{
return Array.prototype.some.call(document.getElementsByTagName("script"),function(s){return s.src===u;});
}catch(e){return false;}
}
function loadScript(src, attrs, integrity, allowPresets){
var safe=safeScriptUrl(src,allowPresets);
if(!safe||alreadyScriptSrc(safe))return;
var e=document.createElement("script");
e.src=safe;e.async=true;e.referrerPolicy="no-referrer-when-downgrade";
if(integrity&&/^sha(?:256|384|512)-[A-Za-z0-9+/=]+$/.test(integrity)){
e.integrity=integrity;
e.crossOrigin="anonymous";
}
if(attrs){
Object.keys(attrs).forEach(function(k){
if(/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(k)) e.setAttribute(k,String(attrs[k]));
});
}
document.head.appendChild(e);
}
function loadCloudflareBeacon(token){
var u="https://static.cloudflareinsights.com/beacon.min.js";
if(!token||typeof token!=="string"||token.length>256||/[\\s<>'"&]/.test(token))return;
if(alreadyScriptSrc(u))return;
var e=document.createElement("script");
e.src=u;
e.defer=true;
e.setAttribute("data-cf-beacon",JSON.stringify({token:token}));
e.referrerPolicy="no-referrer-when-downgrade";
document.head.appendChild(e);
}
function applyAnalytics(){
var L=C.loader||{type:"none"};
if(L.type==="cloudflare") loadCloudflareBeacon(L.token);
else if(L.type==="custom") (L.scripts||[]).forEach(function(s){loadScript(s.src,null,s.integrity,false);});
else if(L.type==="plausible") loadScript(L.src,{"data-domain":L.domain},null,true);
else if(L.type==="fathom") loadScript(L.src,{"data-site":L.siteId},null,true);
else if(L.type==="umami") loadScript(L.src,{"data-website-id":L.websiteId},null,false);
else if(L.type==="simpleanalytics") loadScript(L.src,null,null,true);
else if(L.type==="ga4"){
window.dataLayer=window.dataLayer||[];
if(typeof window.gtag!=="function"){window.gtag=function(){window.dataLayer.push(arguments);};}
loadScript("https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(L.measurementId),null,null,true);
window.gtag("js",new Date());
window.gtag("config",L.measurementId);
}
}
function applyMarketing(){
var urls=C.marketingScripts||[];
urls.forEach(function(s){loadScript(s.src,null,s.integrity,false);});
var L=C.loader||{type:"none"};
if(L.type==="gtm"){
window.dataLayer=window.dataLayer||[];
window.dataLayer.push({"gtm.start":Date.now(),event:"gtm.js"});
loadScript("https://www.googletagmanager.com/gtm.js?id="+encodeURIComponent(L.containerId),null,null,true);
}
}
function applyScripts(st){
if(st.analytics) applyAnalytics();
if(st.marketing) applyMarketing();
}
function gtagUpdate(st){
if(!C.googleConsentMode||!window.gtag)return;
window.gtag("consent","update",{
analytics_storage:st.analytics?"granted":"denied",
ad_storage:st.marketing?"granted":"denied",
ad_user_data:st.marketing?"granted":"denied",
ad_personalization:st.marketing?"granted":"denied",
personalization_storage:st.marketing?"granted":"denied",
functionality_storage:st.functional?"granted":"denied",
security_storage:"granted"
});
}
function logServer(st){
if(!C.logConsent)return;
fetch(C.recordPath,{
method:"POST",
credentials:"same-origin",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({policyVersion:C.policyVersion,functional:!!st.functional,analytics:!!st.analytics,marketing:!!st.marketing})
}).catch(function(){});
}
function hide(el){if(el)el.setAttribute("hidden","");el&&(el.style.display="none");}
function show(el){if(el)el.removeAttribute("hidden");el&&(el.style.display="");}
function embedAllowed(st){
if(!C.gateEmbeds)return false;
return C.embedCategory==="functional"?!!st.functional:!!st.marketing;
}
function mountIframe(box,src){
if(!allowedIframe(src))return;
var f=document.createElement("iframe");
f.src=src;
f.setAttribute("loading","lazy");
f.setAttribute("referrerpolicy","strict-origin-when-cross-origin");
f.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
f.setAttribute("allowfullscreen","");
f.setAttribute("sandbox","allow-scripts allow-same-origin allow-presentation");
f.setAttribute("title",box.getAttribute("data-label")||"Embed");
f.style.width="100%";
f.style.aspectRatio="16/9";
f.style.border="0";
box.replaceWith(f);
}
function mountLink(box,src,label,kind){
if(!allowedLink(src,kind))return;
var a=document.createElement("a");
a.href=src;
a.rel="noopener noreferrer nofollow";
a.target="_blank";
a.appendChild(document.createTextNode(label||src));
box.replaceWith(a);
}
function hydrateEmbeds(st){
if(!C.gateEmbeds)return;
var nodes=document.querySelectorAll("[data-emprivacy-embed]");
Array.prototype.forEach.call(nodes,function(box){
var copy=box.querySelector(".emprivacy-embed-copy");
var loadBtn=box.querySelector("[data-emprivacy-embed-load]");
if(copy) copy.textContent=C.ui.embedBlocked;
if(loadBtn) loadBtn.textContent=C.ui.loadEmbed;
if(!embedAllowed(st))return;
var src=box.getAttribute("data-src")||"";
var mode=box.getAttribute("data-mode")||"";
var kind=box.getAttribute("data-emprivacy-embed")||"";
if(mode==="iframe") mountIframe(box,src);
else mountLink(box,src,box.getAttribute("data-label")||"",kind);
});
}
function persist(a,m,f,opts){
var st={v:C.policyVersion,essential:true,functional:!!f,analytics:!!a,marketing:!!m};
writeCookie(JSON.stringify({v:st.v,a:st.analytics?1:0,m:st.marketing?1:0,f:st.functional?1:0}));
logServer(st);
gtagUpdate(st);
emit(st);
hydrateEmbeds(st);
if(!opts||!opts.skipReload){
location.reload();
return st;
}
applyScripts(st);
return st;
}
function addPolicyLinks(links){
function addOne(href,text){
if(!href)return;
if(!parseHttps(href))return;
var a=document.createElement("a");
a.href=href;
a.rel="nofollow noopener";
a.target="_blank";
a.appendChild(document.createTextNode(text));
links.appendChild(a);
}
addOne(C.privacyPolicyUrl,C.ui.privacyPolicy);
if(C.cookiePolicyUrl)addOne(C.cookiePolicyUrl,C.ui.cookiePolicy);
}
function addVendorDisclosure(parent){
if(!C.vendors||!C.vendors.length)return;
var det=document.createElement("details");
det.className="emprivacy-vendors";
var sum=document.createElement("summary");
sum.appendChild(document.createTextNode(C.ui.vendorsHeading));
det.appendChild(sum);
var ul=document.createElement("ul");
C.vendors.forEach(function(v){
var li=document.createElement("li");
var strong=document.createElement("strong");
strong.appendChild(document.createTextNode(v.name));
li.appendChild(strong);
li.appendChild(document.createTextNode(" ("+v.category+") — "+v.purpose));
if(v.policyUrl&&parseHttps(v.policyUrl)){
li.appendChild(document.createTextNode(" "));
var a=document.createElement("a");
a.href=v.policyUrl;
a.rel="nofollow noopener";
a.target="_blank";
a.appendChild(document.createTextNode(C.ui.whatWeUse));
li.appendChild(a);
}
ul.appendChild(li);
});
det.appendChild(ul);
parent.appendChild(det);
}
function mkRow(label,id,on,locked){
var w=document.createElement("label");
w.className="emprivacy-switch";
var cb=document.createElement("input");
cb.type="checkbox";
cb.id=id;
cb.checked=on;
if(locked){cb.checked=true;cb.disabled=true;}
w.appendChild(cb);
w.appendChild(document.createTextNode(" "+label));
return {wrap:w,box:cb};
}
var openPanel=function(){};
function installApi(){
var api=Object.freeze({
get:function(){return currentState();},
has:function(cat){
if(cat==="essential")return true;
var st=currentState();
if(!st)return false;
if(cat==="functional")return !!st.functional;
if(cat==="analytics")return !!st.analytics;
if(cat==="marketing")return !!st.marketing;
return false;
},
onChange:function(cb){
if(typeof cb!=="function")return function(){};
listeners.push(cb);
return function(){listeners=listeners.filter(function(x){return x!==cb;});};
},
open:function(){openPanel();}
});
try{Object.defineProperty(window,"emprivacy",{value:api,writable:false,configurable:false});}catch(e){window.emprivacy=api;}
}
function applyTheme(root){
try{
root.style.setProperty("--emprivacy-bg",C.theme.bg);
root.style.setProperty("--emprivacy-text",C.theme.text);
root.style.setProperty("--emprivacy-accent",C.theme.accent);
root.style.setProperty("--emprivacy-radius",String(C.theme.radiusPx)+"px");
}catch(e){}
}
function mount(){
var root=document.getElementById("emprivacy-root");
if(!root)return;
applyTheme(root);
var initial=currentState();
if(initial) hydrateEmbeds(initial);
var trigger=document.createElement("button");
trigger.type="button";
trigger.className="emprivacy-cookie-trigger";
trigger.setAttribute("aria-label",C.ui.cookieSettings);
var ic=document.createElement("span");
ic.setAttribute("aria-hidden","true");
ic.className="emprivacy-cookie-trigger-icon";
ic.appendChild(document.createTextNode("🍪"));
trigger.appendChild(ic);
function showTrigger(){trigger.removeAttribute("hidden");}
function hideTrigger(){trigger.setAttribute("hidden","");}
function buildPanel(isReopen,hint){
var st=parseState(readCookie());
var aOn=st?!!st.analytics:(C.strictDefaults?false:true);
var mOn=st?!!st.marketing:(C.strictDefaults?false:true);
var fOn=st?!!st.functional:(C.strictDefaults?false:true);
if(isReopen) hideTrigger();
var bar=document.createElement("div");
bar.className="emprivacy-bar"+(isReopen?" emprivacy-bar--reopen":"");
bar.setAttribute("role","dialog");
bar.setAttribute("aria-modal",isReopen?"true":"false");
var title=document.createElement("h2");
title.className="emprivacy-title";
title.appendChild(document.createTextNode(C.bannerTitle));
var msg=document.createElement("p");
msg.className="emprivacy-msg";
msg.appendChild(document.createTextNode(C.bannerMessage));
var links=document.createElement("div");
links.className="emprivacy-links";
addPolicyLinks(links);
var opts=document.createElement("div");
opts.className="emprivacy-opts";
if(!isReopen) opts.setAttribute("hidden","");
if(hint){
var hintEl=document.createElement("p");
hintEl.className="emprivacy-note";
hintEl.appendChild(document.createTextNode(hint));
opts.appendChild(hintEl);
show(opts);
}
var ess=mkRow(C.ui.essential,isReopen?"emprivacy-re":"emprivacy-e",true,true);
var note=document.createElement("p");
note.className="emprivacy-note";
note.appendChild(document.createTextNode(C.ui.essentialNote));
var fr=mkRow(C.ui.functional,isReopen?"emprivacy-rf":"emprivacy-f",fOn,false);
var er=mkRow(C.ui.analytics,isReopen?"emprivacy-ra":"emprivacy-a",aOn,false);
var mr=mkRow(C.ui.marketing,isReopen?"emprivacy-rm":"emprivacy-m",mOn,false);
opts.appendChild(ess.wrap);
opts.appendChild(note);
opts.appendChild(fr.wrap);
opts.appendChild(er.wrap);
opts.appendChild(mr.wrap);
addVendorDisclosure(opts);
var actions=document.createElement("div");
actions.className="emprivacy-actions";
var btnAll=document.createElement("button");
btnAll.type="button";
btnAll.className="emprivacy-btn emprivacy-btn-primary";
btnAll.appendChild(document.createTextNode(C.ui.acceptAll));
btnAll.addEventListener("click",function(){persist(true,true,true);});
var btnRej=document.createElement("button");
btnRej.type="button";
btnRej.className="emprivacy-btn";
btnRej.appendChild(document.createTextNode(C.ui.rejectNonEssential));
btnRej.addEventListener("click",function(){persist(false,false,false);});
var btnSave=document.createElement("button");
btnSave.type="button";
btnSave.className="emprivacy-btn emprivacy-btn-primary";
if(!isReopen&&!hint) btnSave.setAttribute("hidden","");
btnSave.appendChild(document.createTextNode(C.ui.saveChoices));
btnSave.addEventListener("click",function(){persist(!!er.box.checked,!!mr.box.checked,!!fr.box.checked);});
actions.appendChild(btnAll);
actions.appendChild(btnRej);
if(!isReopen){
var btnCust=document.createElement("button");
btnCust.type="button";
btnCust.className="emprivacy-btn";
btnCust.appendChild(document.createTextNode(C.ui.customize));
btnCust.addEventListener("click",function(){show(opts);btnSave.removeAttribute("hidden");});
actions.appendChild(btnCust);
}else{
var btnClose=document.createElement("button");
btnClose.type="button";
btnClose.className="emprivacy-btn";
btnClose.appendChild(document.createTextNode(C.ui.close));
btnClose.addEventListener("click",function(){
if(bar.parentNode)bar.parentNode.removeChild(bar);
showTrigger();
});
actions.appendChild(btnClose);
}
actions.appendChild(btnSave);
bar.appendChild(title);
bar.appendChild(msg);
bar.appendChild(links);
bar.appendChild(opts);
bar.appendChild(actions);
return bar;
}
function openReopenPanel(hint){
if(root.querySelector(".emprivacy-bar--reopen"))return;
var st=parseState(readCookie());
if(!st)return;
root.appendChild(buildPanel(true,hint||""));
}
openPanel=function(hint){
var st=parseState(readCookie());
if(st) openReopenPanel(hint);
else{
var existing=root.querySelector(".emprivacy-bar");
if(existing){
if(hint){
var note=document.createElement("p");
note.className="emprivacy-note";
note.appendChild(document.createTextNode(hint));
var opts=existing.querySelector(".emprivacy-opts");
if(opts){opts.insertBefore(note,opts.firstChild);show(opts);}
}
try{existing.scrollIntoView({block:"end"});}catch(e){}
}
}
};
root.appendChild(trigger);
hideTrigger();
function wireEmbedButtons(){
document.addEventListener("click",function(ev){
var t=ev.target;
if(!t||!t.closest)return;
var btn=t.closest("[data-emprivacy-embed-load]");
if(!btn)return;
ev.preventDefault();
if(!C.gateEmbeds)return;
var st=currentState();
if(st&&embedAllowed(st)){
hydrateEmbeds(st);
return;
}
openPanel(C.ui.embedNeedConsent);
});
}
wireEmbedButtons();
if(!needBanner()){
var st=parseState(readCookie());
if(st){
applyScripts(st);
gtagUpdate(st);
hydrateEmbeds(st);
}
showTrigger();
trigger.addEventListener("click",function(){openReopenPanel();});
installApi();
return;
}
root.appendChild(buildPanel(false,""));
trigger.addEventListener("click",function(){openReopenPanel();});
installApi();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);
else mount();
})();`;
}

export function buildGoogleConsentHeadScript(): string {
	return `(function(){window.dataLayer=window.dataLayer||[];function g(){window.dataLayer.push(arguments);}window.gtag=g;g("consent","default",{"analytics_storage":"denied","ad_storage":"denied","ad_user_data":"denied","ad_personalization":"denied","functionality_storage":"denied","security_storage":"granted","personalization_storage":"denied"});})();`;
}
