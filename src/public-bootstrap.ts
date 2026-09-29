// SPDX-License-Identifier: MIT

import { PURGE_RULES } from "./cookie-purge.js";
import { COOKIE_NAME, jsonForHtmlScript, type EmprivacyPublicRuntimeConfig } from "./config.js";
import {
	EMBED_IFRAME_ALLOW,
	EMBED_IFRAME_SANDBOX,
	hostnameBlockScript,
	PRESET_SCRIPT_HOSTS,
	VIMEO_IFRAME,
	YT_IFRAME,
} from "./security.js";

/**
 * Public-site bootstrap. Banner copy is applied with textContent / createTextNode only.
 * Embed/script URLs are re-validated in the browser (never trust DOM data-src alone).
 */
export function buildBodyBootstrap(pr: EmprivacyPublicRuntimeConfig): string {
	const jsonLiteral = jsonForHtmlScript(pr);
	const purgeLiteral = jsonForHtmlScript(PURGE_RULES);
	return `(function(){
var C=${jsonLiteral};
var CN="${COOKIE_NAME}";
var PURGE=${purgeLiteral};
var listeners=[];
var PRESET_HOSTS=${jsonForHtmlScript(Object.fromEntries([...PRESET_SCRIPT_HOSTS].map((host) => [host, 1])))};
var YT_IFRAME=${YT_IFRAME.toString()};
var VIMEO_IFRAME=${VIMEO_IFRAME.toString()};
${hostnameBlockScript()}
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
function gpcOn(){
try{return navigator.globalPrivacyControl===true;}catch(e){return false;}
}
function effective(st){
if(!st)return null;
var g=gpcOn();
return {v:st.v,essential:true,functional:!!st.functional,analytics:!!st.analytics,marketing:g?false:!!st.marketing,gpc:g};
}
function currentState(){return effective(parseState(readCookie()));}
function cookieNameOk(name){return /^[A-Za-z0-9_]{1,64}$/.test(name);}
function expireCookie(name){
if(!cookieNameOk(name)||name===CN)return;
var secure=document.location.protocol==="https:"?"; Secure":"";
var base=name+"=; Max-Age=0; Path=/; SameSite=Lax"+secure;
document.cookie=base;
var host=String(document.location.hostname||"");
if(!/^[A-Za-z0-9.-]{1,253}$/.test(host)||host.indexOf("..")>=0)return;
var hosts=[host];
var labels=host.split(".");
if(labels.length>=3)hosts.push(labels.slice(1).join("."));
for(var i=0;i<hosts.length;i++){
var h=hosts[i];
if(!/^[A-Za-z0-9.-]{1,253}$/.test(h))continue;
document.cookie=base+"; Domain="+h;
document.cookie=base+"; Domain=."+h;
}
}
function purgeSet(exact,prefixes){
var raw="";
try{raw=document.cookie;}catch(e){return;}
if(!raw)return;
if(raw.length>8192)raw=raw.slice(0,8192);
raw.split(";").forEach(function(part){
var name=(part.split("=")[0]||"").replace(/^\\s+/,"");
if(!cookieNameOk(name)||name===CN)return;
var hit=exact.indexOf(name)>=0;
if(!hit){
for(var i=0;i<prefixes.length;i++){
if(prefixes[i]&&name.indexOf(prefixes[i])===0){hit=true;break;}
}
}
if(hit)expireCookie(name);
});
}
function purgeDenied(st){
var rules=PURGE||{};
if(!st.analytics){
var a=rules.analytics||{};
purgeSet(a.exact||[],a.prefix||[]);
}
if(!st.marketing){
var m=rules.marketing||{};
purgeSet(m.exact||[],m.prefix||[]);
}
}
function deniedState(){
return {v:"",essential:true,functional:false,analytics:false,marketing:false,gpc:gpcOn()};
}
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
if(hostBlocked(u.hostname))return null;
return u;
}catch(e){return null;}
}
function hostAllowed(u,allowPresets){
var h=u.hostname.toLowerCase();
if(allowPresets&&PRESET_HOSTS[h])return true;
var list=C.scriptHostAllowlist||[];
return list.indexOf(h)>=0;
}
function safeScriptUrl(raw,allowPresets){
var u=parseHttps(raw);
if(!u||u.hash)return null;
if(!hostAllowed(u,!!allowPresets))return null;
return u.href;
}
function allowedIframe(src){return YT_IFRAME.test(src)||VIMEO_IFRAME.test(src);}
function allowedLink(src){
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
var list=C.embedHostAllowlist||[];
return list.indexOf(h)>=0;
}
function alreadyScriptSrc(u){
try{
return Array.prototype.some.call(document.getElementsByTagName("script"),function(s){return s.src===u;});
}catch(e){return false;}
}
function loadScript(src, attrs, integrity, allowPresets, requireIntegrity){
var safe=safeScriptUrl(src,allowPresets);
if(!safe||alreadyScriptSrc(safe))return;
var sriOk=integrity&&/^sha(?:256|384|512)-[A-Za-z0-9+/=]+$/.test(integrity);
if(requireIntegrity&&!sriOk)return;
var e=document.createElement("script");
e.src=safe;e.async=true;e.referrerPolicy="no-referrer-when-downgrade";
if(sriOk){
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
function applyAnalytics(st){
var L=C.loader||{type:"none"};
if(L.type==="cloudflare") loadCloudflareBeacon(L.token);
else if(L.type==="custom") (L.scripts||[]).forEach(function(s){loadScript(s.src,null,s.integrity,false,true);});
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
else if(L.type==="clarity"){
var id=String(L.projectId||"");
if(!/^[a-z0-9]{7,20}$/i.test(id))return;
window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments);};
window.clarity("consentv2",{ad_Storage:st.marketing?"granted":"denied",analytics_Storage:"granted"});
loadScript("https://www.clarity.ms/tag/"+encodeURIComponent(id),null,null,true);
}
}
function applyMarketing(){
var urls=C.marketingScripts||[];
urls.forEach(function(s){loadScript(s.src,null,s.integrity,false,true);});
var L=C.loader||{type:"none"};
if(L.type==="gtm"){
window.dataLayer=window.dataLayer||[];
window.dataLayer.push({"gtm.start":Date.now(),event:"gtm.js"});
loadScript("https://www.googletagmanager.com/gtm.js?id="+encodeURIComponent(L.containerId),null,null,true);
}
else if(L.type==="uet"){
var id=String(L.tagId||"");
if(!/^[0-9]{6,12}$/.test(id))return;
window.uetq=window.uetq||[];
window.uetq.push("consent","update",{"ad_storage":"granted"});
var src="https://bat.bing.com/bat.js";
if(alreadyScriptSrc(src))return;
var n=document.createElement("script");
n.src=src;
n.async=true;
n.onload=function(){
try{
var q=window.uetq;
window.uetq=new window.UET({ti:id,enableAutoSpaTracking:false,q:q});
window.uetq.push("pageLoad");
}catch(e){}
};
document.head.appendChild(n);
}
}
function applyScripts(st){
var eff=effective(st)||st;
purgeDenied(eff);
if(eff.analytics) applyAnalytics(eff);
if(eff.marketing) applyMarketing();
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
body:JSON.stringify({policyVersion:C.policyVersion,functional:!!st.functional,analytics:!!st.analytics,marketing:!!st.marketing,gpc:!!st.gpc})
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
f.setAttribute("allow",${JSON.stringify(EMBED_IFRAME_ALLOW)});
f.setAttribute("allowfullscreen","");
f.setAttribute("sandbox",${JSON.stringify(EMBED_IFRAME_SANDBOX)});
f.setAttribute("title",box.getAttribute("data-label")||"Embed");
f.style.width="100%";
f.style.aspectRatio="16/9";
f.style.border="0";
box.replaceWith(f);
}
function mountLink(box,src,label){
if(!allowedLink(src))return;
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
if(mode==="iframe") mountIframe(box,src);
else mountLink(box,src,box.getAttribute("data-label")||"");
});
}
function persist(a,m,f,opts){
if(gpcOn())m=false;
var st={v:C.policyVersion,essential:true,functional:!!f,analytics:!!a,marketing:!!m,gpc:gpcOn()};
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
function focusables(bar){
return Array.prototype.filter.call(bar.querySelectorAll("a[href],button:not([disabled]),input:not([disabled]),summary"),function(el){
return !el.closest("[hidden]");
});
}
function bindDialog(bar,isReopen){
bar.tabIndex=-1;
function closeReopen(){
if(bar.parentNode)bar.parentNode.removeChild(bar);
showTrigger();
try{trigger.focus();}catch(e){}
}
bar.addEventListener("keydown",function(ev){
if(ev.key==="Escape"){
if(!isReopen)return;
ev.preventDefault();
closeReopen();
return;
}
if(ev.key!=="Tab")return;
var nodes=focusables(bar);
if(!nodes.length){ev.preventDefault();return;}
var first=nodes[0],last=nodes[nodes.length-1],active=document.activeElement;
if(ev.shiftKey){
if(active===first||active===bar){ev.preventDefault();last.focus();}
}else if(active===last){
ev.preventDefault();first.focus();
}
});
if(isReopen) bar.__emprivacyClose=closeReopen;
try{bar.focus();}catch(e){}
}
function buildPanel(isReopen,hint){
var st=parseState(readCookie());
var aOn=st?!!st.analytics:(C.strictDefaults?false:true);
var mOn=gpcOn()?false:(st?!!st.marketing:(C.strictDefaults?false:true));
var fOn=st?!!st.functional:(C.strictDefaults?false:true);
if(isReopen) hideTrigger();
var bar=document.createElement("div");
bar.className="emprivacy-bar"+(C.bannerPosition==="top"?" emprivacy-bar--top":"")+(isReopen?" emprivacy-bar--reopen":"");
bar.setAttribute("role","dialog");
bar.setAttribute("aria-modal",isReopen?"true":"false");
var title=document.createElement("h2");
title.id=isReopen?"emprivacy-reopen-title":"emprivacy-banner-title";
title.className="emprivacy-title";
bar.setAttribute("aria-labelledby",title.id);
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
if(gpcOn()){mr.box.checked=false;mr.box.disabled=true;}
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
if(typeof bar.__emprivacyClose==="function")bar.__emprivacyClose();
});
actions.appendChild(btnClose);
}
actions.appendChild(btnSave);
bar.appendChild(title);
bar.appendChild(msg);
if(gpcOn()){
var gpcEl=document.createElement("p");
gpcEl.className="emprivacy-note";
gpcEl.id=isReopen?"emprivacy-gpc-reopen":"emprivacy-gpc-note";
gpcEl.appendChild(document.createTextNode(C.ui.gpcNote||""));
bar.appendChild(gpcEl);
bar.setAttribute("aria-describedby",gpcEl.id);
}
bar.appendChild(links);
bar.appendChild(opts);
bar.appendChild(actions);
return bar;
}
function openReopenPanel(hint){
if(root.querySelector(".emprivacy-bar--reopen"))return;
var st=parseState(readCookie());
if(!st)return;
var panel=buildPanel(true,hint||"");
root.appendChild(panel);
bindDialog(panel,true);
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
try{existing.scrollIntoView({block:C.bannerPosition==="top"?"start":"end"});}catch(e){}
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
var st=currentState();
if(st){
applyScripts(st);
gtagUpdate(st);
hydrateEmbeds(st);
}else purgeDenied(deniedState());
showTrigger();
trigger.addEventListener("click",function(){openReopenPanel();});
installApi();
return;
}
purgeDenied(deniedState());
var first=buildPanel(false,"");
root.appendChild(first);
bindDialog(first,false);
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

/** Denied-by-default Microsoft signals. The tag itself loads only after the matching category is allowed. */
export function buildMicrosoftConsentHeadScript(kind: "clarity" | "uet"): string {
	if (kind === "clarity") {
		return `(function(){window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments);};window.clarity("consentv2",{"ad_Storage":"denied","analytics_Storage":"denied"});})();`;
	}
	return `(function(){window.uetq=window.uetq||[];window.uetq.push("consent","default",{"ad_storage":"denied"});})();`;
}
