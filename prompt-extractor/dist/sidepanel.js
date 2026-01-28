import{r as s,j as e,c as De,R as Fe}from"./chunks/index-BHjgo2PY.js";import{s as ke,a as Oe,b as $e,c as qe,g as Ge,d as Ye,e as he,m as ge,f as fe}from"./chunks/firebase-BtGqSOc4.js";const P="promptExtractor_user";let K={guest:3,free:10,pro:100,admin:999};async function Ne(){try{const r=await Ge();K={guest:r.guest,free:r.free,pro:r.pro,admin:999},console.log("[Auth] Loaded quotas from Firebase:",K)}catch{console.log("[Auth] Using default quotas")}}async function _e(){return new Promise(r=>{chrome.storage.local.get([P],o=>{r(o[P]||null)})})}async function Ce(r){return new Promise(o=>{r?chrome.storage.local.set({[P]:r},o):chrome.storage.local.remove([P],o)})}async function Ve(){return new Promise(r=>{chrome.storage.local.get(["usage_count"],o=>{r(o.usage_count||0)})})}async function Se(r){if(!r)return"guest";try{if(await Ye(r.email))return"pro"}catch{console.log("[Auth] Could not check pro status, defaulting to free")}return"free"}function Xe(r){return K[r]}async function Ke(){return new Promise((r,o)=>{chrome.identity.getAuthToken({interactive:!0},async i=>{var u;if(chrome.runtime.lastError||!i){o(new Error(((u=chrome.runtime.lastError)==null?void 0:u.message)||"Failed to get auth token"));return}try{const m=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${i}`}});if(!m.ok)throw new Error("Failed to fetch user info");const v=await m.json(),x={id:v.id,email:v.email,name:v.name||v.email.split("@")[0],picture:v.picture};ke(x.id),await $e(i),await qe(x),await Ce(x),await Ne(),r(x)}catch(m){chrome.identity.removeCachedAuthToken({token:i},()=>{}),o(m)}})})}async function Qe(){return ke(null),await Oe(),new Promise(r=>{chrome.identity.getAuthToken({interactive:!1},o=>{o&&chrome.identity.removeCachedAuthToken({token:o},()=>{fetch(`https://accounts.google.com/o/oauth2/revoke?token=${o}`)}),Ce(null).then(r)})})}function Ze(r){const o=(i,u)=>{u==="local"&&i[P]&&r(i[P].newValue||null)};return chrome.storage.onChanged.addListener(o),()=>{chrome.storage.onChanged.removeListener(o)}}async function Je(){await Ne();const r=await _e(),o=await Se(r),i=await Ve(),u=Xe(o);return{user:r,tier:o,usage:{used:i,limit:u},isLoading:!1}}function ve(r){return r.includes("timeout")||r.includes("Timeout")?"Request took too long. Please try again.":r.includes("network")||r.includes("Network")||r.includes("Failed to fetch")?"Connection issue. Check your internet and try again.":r.includes("temporarily unavailable")||r.includes("Circuit")?"Service is busy. Please wait a moment and try again.":r.includes("quota")||r.includes("limit")||r.includes("429")?"Daily limit reached. Upgrade to Pro for more.":r.includes("401")||r.includes("403")||r.includes("auth")?"Session expired. Please sign in again.":r.includes("empty")?"No content to process. Start a conversation first.":r.length>100?r.slice(0,100)+"...":r}function et(){var me;const[r,o]=s.useState("main"),[i,u]=s.useState("raw"),[m,v]=s.useState("system"),[x,W]=s.useState({supported:!1,platform:null}),[n,S]=s.useState(null),[j,k]=s.useState(!1),[b,D]=s.useState(!1),[c,y]=s.useState([]),[A,Te]=s.useState(!1),[R,z]=s.useState(!1),[I,H]=s.useState(!1),[L,T]=s.useState(!1),[Q,E]=s.useState(!1),[Z,J]=s.useState(null),[ee,q]=s.useState(!1),[te,re]=s.useState(!1),[d,F]=s.useState(null),[Ee,B]=s.useState("guest"),[G,O]=s.useState(null),[ae,C]=s.useState(null),[oe,M]=s.useState(""),[U,se]=s.useState(null),[ie,ne]=s.useState(null),le=s.useRef(0),ce=s.useRef(null),[de,pe]=s.useState({prompts:0,words:0}),[Y,_]=s.useState(!0),Me=t=>{const a=t.currentTarget.scrollTop;a>10&&Y?_(!1):a<=10&&!Y&&_(!0)};s.useEffect(()=>{if(n){const t=n.prompts.length,a=n.prompts.reduce((w,N)=>w+N.content.split(/\s+/).length,0);pe({prompts:0,words:0});const l=600,p=20,h=l/p;let f=0;const g=setInterval(()=>{f++;const w=f/p,N=1-Math.pow(1-w,3);pe({prompts:Math.round(t*N),words:Math.round(a*N)}),f>=p&&clearInterval(g)},h);return()=>clearInterval(g)}},[n]);const ue=s.useCallback(()=>m==="system"?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":m,[m])();s.useEffect(()=>{document.documentElement.setAttribute("data-theme",ue)},[ue]),s.useEffect(()=>{chrome.storage.local.get(["extractionHistory","theme","quotaUsed","quotaLimit"],t=>{t.extractionHistory&&y(t.extractionHistory),t.theme&&v(t.theme),t.quotaUsed!==void 0&&t.quotaLimit!==void 0&&se({used:t.quotaUsed,limit:t.quotaLimit})})},[]),s.useEffect(()=>(Je().then(async a=>{if(F(a.user),B(a.tier),a.user)try{const l=await he(a.user.id);l.length>0&&y(p=>{const h=ge(p,l);return chrome.storage.local.set({extractionHistory:h}),h})}catch(l){console.error("[App] Cloud sync failed:",l)}}),Ze(async a=>{if(F(a),a){const l=await Se(a);B(l);try{const p=await he(a.id);p.length>0&&y(h=>{const f=ge(h,p);return chrome.storage.local.set({extractionHistory:f}),f})}catch(p){console.error("[App] Cloud sync on login failed:",p)}}else B("guest")})),[]),s.useEffect(()=>{const t=chrome.runtime.connect({name:"sidepanel"});return ce.current=t,t.onMessage.addListener(a=>{var l;if(a.action==="EXTRACTION_RESULT"||a.action==="EXTRACTION_FROM_PAGE_RESULT"){C(null);const p=a.mode||i;a.mode&&u(a.mode),Ae(a.result,p),p==="summary"&&a.result.prompts.length>0&&(M("Consolidating prompts..."),t.postMessage({action:"SUMMARIZE_PROMPTS",prompts:a.result.prompts}))}else a.action==="STATUS_RESULT"?W({supported:a.supported,platform:a.platform}):a.action==="SUMMARY_RESULT"?(k(!1),M(""),a.success&&((l=a.result)!=null&&l.summary)?(O(a.result.summary),C(null),xe&&V(xe,"summary",a.result.summary)):a.error&&C(ve(a.error)),a.quotaUsed!==void 0&&(se({used:a.quotaUsed,limit:a.quotaLimit||10}),chrome.storage.local.set({quotaUsed:a.quotaUsed,quotaLimit:a.quotaLimit||10}))):a.action==="ERROR"?(k(!1),M(""),C(ve(a.error))):a.action==="PROGRESS"&&M(a.message||"Processing...")}),t.postMessage({action:"GET_STATUS"}),()=>t.disconnect()},[i]);const[xe,Pe]=s.useState(null),V=s.useCallback((t,a,l)=>{var f;const p=((f=t.prompts[0])==null?void 0:f.content.slice(0,50))||"No prompts",h={id:Date.now().toString(),platform:t.platform,promptCount:t.prompts.length,mode:a,timestamp:Date.now(),prompts:t.prompts,preview:p,summary:l};y(g=>{if(g.length>0&&g[0].preview===h.preview&&g[0].platform===h.platform&&g[0].mode===h.mode)return g;const w=[h,...g].slice(0,50);return chrome.storage.local.set({extractionHistory:w}),w}),d&&fe(d.id,h).catch(g=>console.error("[App] Auto-save cloud failed:",g))},[d]),Ae=s.useCallback((t,a)=>{const l=performance.now();ne((l-le.current)/1e3),S(t),Pe(t),k(!1),M(""),o("main"),O(null),C(null),C(null),_(!0),J(null),a==="raw"&&V(t,"raw")},[V]),$=s.useCallback(()=>{var t;k(!0),C(null),ne(null),le.current=performance.now(),M("Extracting prompts..."),(t=ce.current)==null||t.postMessage({action:"EXTRACT_PROMPTS",mode:i})},[i]),X=s.useCallback(async()=>{if(!n)return;const t=n.prompts.map((l,p)=>`${p+1}. ${l.content}`).join(`

`);await navigator.clipboard.writeText(t),D(!0),setTimeout(()=>D(!1),2e3);const[a]=await chrome.tabs.query({active:!0,currentWindow:!0});a!=null&&a.id&&chrome.tabs.sendMessage(a.id,{action:"CONTENT_COPIED",content:t})},[n]);s.useEffect(()=>{const t=a=>{var l;(a.metaKey||a.ctrlKey)&&a.key==="e"&&(a.preventDefault(),x.supported&&!j&&$()),(a.metaKey||a.ctrlKey)&&a.key==="c"&&n&&!((l=window.getSelection())!=null&&l.toString())&&(a.preventDefault(),X())};return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)},[x.supported,j,n,$,X]),s.useEffect(()=>{const t=a=>{const l=a.target;l.closest(".popup")||l.closest(".bottom-nav")||(R||I||L||Q)&&(z(!1),H(!1),T(!1),E(!1))};return window.addEventListener("mousedown",t),()=>window.removeEventListener("mousedown",t)},[R,I,L]);const Re=s.useCallback(async()=>{var g;if(!n)return;const t=((g=n.prompts[0])==null?void 0:g.content.slice(0,50))||"No prompts",a={id:Date.now().toString(),platform:n.platform,promptCount:n.prompts.length,mode:i,timestamp:Date.now(),prompts:n.prompts,preview:t};if(y(w=>{const N=[a,...w].slice(0,50);return chrome.storage.local.set({extractionHistory:N}),N}),d)try{await fe(d.id,a)}catch(w){console.error("[App] Cloud save failed:",w)}const l=n.prompts.map((w,N)=>`${N+1}. ${w.content}`).join(`

`),p=new Blob([l],{type:"text/plain"}),h=URL.createObjectURL(p),f=document.createElement("a");f.href=h,f.download=`prompts-${n.platform}-${Date.now()}.txt`,f.click(),URL.revokeObjectURL(h),Te(!0)},[n,i,d]),Ie=t=>{S({prompts:t.prompts,platform:t.platform,url:"",title:"",extractedAt:t.timestamp}),O(t.summary||null),u(t.mode),o("main"),z(!1),J(t.timestamp)},He=t=>{v(t),chrome.storage.local.set({theme:t})},Be=s.useCallback(()=>{S(null),O(null),C(null)},[]),Ue=(n==null?void 0:n.prompts.reduce((t,a)=>t+a.content.split(/\s+/).length,0))||0,We=(n==null?void 0:n.prompts.length)||0;return e.jsxs("div",{className:"app",children:[e.jsxs("header",{className:"header",children:[e.jsx("div",{className:"header-left",children:r!=="main"?e.jsxs("button",{onClick:()=>o("main"),className:"icon-btn has-tooltip",children:[e.jsx(ye,{}),e.jsx("div",{className:"tooltip-bottom",children:"Back"})]}):n?e.jsxs("button",{onClick:Be,className:"icon-btn has-tooltip",children:[e.jsx(ye,{}),e.jsx("div",{className:"tooltip-bottom",children:"Back"})]}):null}),e.jsxs("div",{className:"mode-toggle",children:[e.jsxs("button",{onClick:()=>u("raw"),className:`mode-btn ${i==="raw"?"active":""}`,children:[e.jsx(dt,{}),e.jsx("span",{children:"Extract"})]}),e.jsxs("button",{onClick:()=>u("summary"),className:`mode-btn ${i==="summary"?"active":""}`,children:[e.jsx(ze,{}),e.jsx("span",{children:"Summarize"})]})]}),e.jsx("div",{className:"header-right"})]}),e.jsx("main",{className:"main",children:r==="main"&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"content-area",onScroll:Me,children:ae?e.jsx(it,{error:ae,onRetry:$}):j?e.jsx(st,{message:oe}):i==="summary"&&G?e.jsx(at,{summary:G}):n&&n.prompts.length>0?e.jsx(tt,{prompts:n.prompts}):e.jsx(ot,{supported:x.supported,platform:x.platform})}),(n||G)&&e.jsxs("div",{className:`stats-bar ${Y?"":"hidden"}`,children:[e.jsxs("span",{className:"stat-badge count-up",children:[de.prompts," prompts"]},`p-${We}`),e.jsxs("span",{className:"stat-badge count-up",children:[de.words," words"]},`w-${Ue}`),Z?e.jsx("span",{className:"stat-badge count-up",children:new Date(Z).toLocaleDateString(void 0,{month:"short",day:"numeric"})}):ie!==null&&e.jsxs("span",{className:"stat-badge count-up",children:[ie.toFixed(1),"s"]}),U&&e.jsxs("span",{className:`stat-badge ${U.used>=U.limit?"warning":""}`,children:[U.used,"/",U.limit," daily"]})]}),e.jsxs("div",{className:"action-bar",children:[e.jsxs("div",{className:`extract-btn-wrapper ${j?"pulsing":""}`,children:[j&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"pulse-ring pulse-1"}),e.jsx("div",{className:"pulse-ring pulse-2"}),e.jsx("div",{className:"pulse-ring pulse-3"})]}),e.jsx("button",{onClick:$,disabled:!x.supported||j,className:`btn-primary ${j?"loading":""}`,children:j?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"btn-spinner",children:e.jsx("div",{className:"spinner-ring"})}),e.jsx("span",{children:oe||"Processing..."})]}):e.jsx(e.Fragment,{children:e.jsx("span",{children:"Generate"})})})]}),e.jsxs("div",{className:"secondary-actions",children:[e.jsxs("button",{onClick:X,disabled:!n,className:`btn-secondary ${b?"success":""}`,title:"Cmd+C",children:[b?e.jsx(Le,{}):e.jsx(ut,{}),e.jsx("span",{children:b?"Copied!":"Copy"})]}),e.jsxs("button",{onClick:Re,disabled:!n,className:"btn-secondary",children:[e.jsx(xt,{}),e.jsx("span",{children:"Save"})]})]})]})]})}),e.jsxs("nav",{className:"bottom-nav",children:[e.jsxs("button",{className:`nav-profile ${L?"active":""}`,onClick:()=>{T(!L),z(!1),H(!1),E(!1)},children:[e.jsx("div",{className:"nav-profile-avatar",children:d!=null&&d.picture?e.jsx("img",{src:d.picture,alt:""}):e.jsx(we,{})}),e.jsxs("div",{className:"nav-profile-info",children:[e.jsx("span",{className:"nav-profile-name",children:((me=d==null?void 0:d.name)==null?void 0:me.split(" ")[0])||"Guest"}),e.jsx("span",{className:"nav-profile-tier",children:Ee})]}),!L&&e.jsx("div",{className:"nav-tooltip",children:"Profile"})]}),e.jsxs("div",{className:"nav-right",children:[e.jsx(be,{icon:e.jsx(lt,{}),label:"History",active:R,onClick:()=>{z(!R),H(!1),T(!1),E(!1)}}),e.jsx(be,{icon:e.jsx(ct,{}),label:"Settings",active:I,onClick:()=>{H(!I),z(!1),T(!1),E(!1)}})]})]}),L&&e.jsxs("div",{className:"popup popup-left",children:[e.jsx("div",{className:"popup-header",children:e.jsx("span",{className:"popup-title",children:"Profile"})}),e.jsx("div",{className:"popup-body",children:d?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"popup-user",children:[e.jsx("div",{className:"popup-avatar",children:d.picture?e.jsx("img",{src:d.picture,alt:""}):e.jsx(we,{})}),e.jsxs("div",{className:"popup-user-info",children:[e.jsx("span",{className:"popup-user-name",children:d.name}),e.jsx("span",{className:"popup-user-email",children:d.email})]})]}),e.jsx("button",{onClick:()=>{Qe(),F(null),B("guest"),T(!1)},className:"popup-btn danger",children:"Sign out"})]}):e.jsx("button",{onClick:async()=>{re(!0);try{const t=await Ke();F(t),B("free"),T(!1)}catch(t){console.error(t)}finally{re(!1)}},className:"popup-btn primary",disabled:te,children:te?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner"}),"Signing in..."]}):e.jsxs(e.Fragment,{children:[e.jsx(ft,{}),"Sign in with Google"]})})})]}),R&&e.jsxs("div",{className:"popup popup-right popup-history",children:[e.jsxs("div",{className:"popup-header",children:[e.jsxs("div",{className:"popup-title-group",children:[e.jsx("span",{className:"popup-title",children:"History"}),e.jsx("button",{className:"popup-external-link",onClick:()=>chrome.tabs.create({url:"history.html"}),title:"Open full history",children:e.jsx(je,{})})]}),c.length>0&&!ee&&e.jsx("button",{className:"popup-clear",onClick:()=>q(!0),children:"Clear all"}),ee&&e.jsxs("div",{className:"popup-confirm",children:[e.jsx("button",{className:"popup-confirm-btn danger",onClick:()=>{y([]),chrome.storage.local.remove("extractionHistory"),q(!1)},children:"Yes, clear"}),e.jsx("button",{className:"popup-confirm-btn",onClick:()=>q(!1),children:"Cancel"})]})]}),e.jsx("div",{className:"popup-body popup-scroll",children:c.length===0?e.jsx("p",{className:"popup-empty",children:"No extractions yet"}):c.slice(0,20).map(t=>e.jsxs("button",{className:"popup-history-item",onClick:()=>{Ie(t),z(!1)},children:[e.jsx(nt,{platform:t.platform}),e.jsxs("div",{className:"popup-history-info",children:[e.jsx("span",{className:"popup-history-preview",children:t.preview}),e.jsxs("span",{className:"popup-history-meta",children:[t.mode==="summary"?"Summary • ":"",t.promptCount," prompts • ",new Date(t.timestamp).toLocaleDateString()]})]})]},t.id))})]}),I&&e.jsxs("div",{className:"popup popup-right",children:[e.jsx("div",{className:"popup-header",children:e.jsx("span",{className:"popup-title",children:"Settings"})}),e.jsxs("div",{className:"popup-body",children:[e.jsxs("div",{className:"popup-setting",children:[e.jsx("span",{className:"popup-setting-label",children:"Theme"}),e.jsxs("select",{value:m,onChange:t=>He(t.target.value),className:"popup-select",children:[e.jsx("option",{value:"system",children:"System"}),e.jsx("option",{value:"light",children:"Light"}),e.jsx("option",{value:"dark",children:"Dark"})]})]}),e.jsxs("div",{className:"popup-setting",children:[e.jsx("span",{className:"popup-setting-label",children:"Version"}),e.jsx("span",{className:"popup-setting-value",children:"1.0.0"})]}),e.jsxs("button",{onClick:()=>{E(!0),H(!1)},className:"popup-setting-link",children:[e.jsx("span",{className:"popup-setting-label",children:"Pulse Check"}),e.jsx(je,{})]})]})]}),Q&&e.jsx(Nt,{onClose:()=>E(!1),userEmail:d==null?void 0:d.email}),A&&e.jsxs("div",{className:"success-overlay",children:[e.jsxs("div",{className:"sparkles",children:[e.jsx("div",{className:"sparkle s1"}),e.jsx("div",{className:"sparkle s2"}),e.jsx("div",{className:"sparkle s3"}),e.jsx("div",{className:"sparkle s4"}),e.jsx("div",{className:"sparkle s5"}),e.jsx("div",{className:"sparkle s6"})]}),e.jsxs("div",{className:"success-content",children:[e.jsx("div",{className:"success-icon",children:e.jsx(ht,{})}),e.jsx("span",{className:"success-text",children:"Saved & Downloaded"})]})]}),b&&e.jsxs("div",{className:"toast",children:[e.jsx(mt,{}),e.jsx("span",{children:"Copied to clipboard"})]}),e.jsx("style",{children:Ct})]})}function be({icon:r,label:o,active:i,onClick:u}){return e.jsxs("button",{onClick:u,className:`nav-item ${i?"active":""}`,children:[e.jsx("div",{className:"nav-icon",children:r}),e.jsx("span",{className:"nav-label",children:o}),!i&&e.jsx("div",{className:"nav-tooltip",children:o})]})}function tt({prompts:r}){return e.jsx("div",{className:"prompts-list stagger-children",children:r.map((o,i)=>e.jsx(rt,{prompt:o,index:i},i))})}function rt({prompt:r,index:o}){const[i,u]=s.useState(!1),m=r.content.length>200,v=m&&!i?r.content.slice(0,200)+"...":r.content;return e.jsxs("div",{className:"prompt-card",children:[e.jsx("div",{className:"prompt-index",children:o+1}),e.jsxs("div",{className:"prompt-body",children:[e.jsx("p",{className:"prompt-text",children:v}),m&&e.jsx("button",{onClick:()=>u(!i),className:"expand-btn",children:i?"Show less":"Show more"})]})]})}function at({summary:r}){return e.jsxs("div",{className:"summary-card animate-fade-in",children:[e.jsxs("div",{className:"summary-header",children:[e.jsx(ze,{}),e.jsx("span",{children:"Summary"})]}),e.jsx("p",{className:"summary-text",children:r})]})}function ot({supported:r,platform:o}){return e.jsxs("div",{className:"empty-state-container",children:[e.jsxs("div",{className:"prompt-card placeholder",children:[e.jsx("div",{className:"prompt-index",children:"1"}),e.jsx("div",{className:"prompt-body",children:e.jsx("p",{className:"prompt-text placeholder-text",children:r?`I'm ready! Click "Extract" below to capture this entire conversation from ${o||"this page"}.`:"Head over to ChatGPT, Claude, or Gemini to start capturing your conversations."})})]}),e.jsxs("div",{className:"prompt-card placeholder opacity-50",children:[e.jsx("div",{className:"prompt-index",children:"2"}),e.jsx("div",{className:"prompt-body",children:e.jsx("p",{className:"prompt-text placeholder-text",children:"Pro tip: You can also use the floating button on the page itself for faster access!"})})]})]})}function st({message:r}){return e.jsxs("div",{className:"loading-state",children:[e.jsxs("div",{className:"loading-animation",children:[e.jsx("div",{className:"loading-ring"}),e.jsx("div",{className:"loading-ring delay-1"}),e.jsx("div",{className:"loading-ring delay-2"})]}),e.jsx("span",{className:"loading-text",children:r||"Processing..."})]})}function it({error:r,onRetry:o}){return e.jsxs("div",{className:"error-state",children:[e.jsx("div",{className:"error-icon",children:e.jsx(gt,{})}),e.jsx("h3",{className:"error-title",children:"Something went wrong"}),e.jsx("p",{className:"error-desc",children:r}),e.jsxs("button",{onClick:o,className:"error-action",children:[e.jsx(pt,{}),e.jsx("span",{children:"Try again"})]})]})}function nt({platform:r}){const o=r.toLowerCase();return o.includes("chatgpt")||o.includes("openai")?e.jsx(vt,{}):o.includes("claude")||o.includes("anthropic")?e.jsx(bt,{}):o.includes("gemini")||o.includes("google")?e.jsx(yt,{}):o.includes("perplexity")?e.jsx(wt,{}):o.includes("deepseek")?e.jsx(jt,{}):e.jsx(kt,{})}const ye=()=>e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M19 12H5M12 19l-7-7 7-7"})}),lt=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("polyline",{points:"12 6 12 12 16 14"})]}),ct=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"})]}),dt=()=>e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"8",y1:"6",x2:"21",y2:"6"}),e.jsx("line",{x1:"8",y1:"12",x2:"21",y2:"12"}),e.jsx("line",{x1:"8",y1:"18",x2:"21",y2:"18"}),e.jsx("line",{x1:"3",y1:"6",x2:"3.01",y2:"6"}),e.jsx("line",{x1:"3",y1:"12",x2:"3.01",y2:"12"}),e.jsx("line",{x1:"3",y1:"18",x2:"3.01",y2:"18"})]}),ze=()=>e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"}),e.jsx("line",{x1:"16",y1:"13",x2:"8",y2:"13"}),e.jsx("line",{x1:"16",y1:"17",x2:"8",y2:"17"})]}),pt=()=>e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"23 4 23 10 17 10"}),e.jsx("path",{d:"M20.49 15a9 9 0 1 1-2.12-9.36L23 10"})]}),ut=()=>e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),e.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),xt=()=>e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"7 10 12 15 17 10"}),e.jsx("line",{x1:"12",y1:"15",x2:"12",y2:"3"})]}),mt=()=>e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})}),Le=()=>e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"var(--highlight)",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",className:"check-animated",children:e.jsx("polyline",{points:"20 6 9 17 4 12",strokeDasharray:"24",strokeDashoffset:"0",style:{animation:"checkmark 0.3s ease-out"}})}),ht=()=>e.jsxs("svg",{width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("polyline",{points:"22 4 12 14.01 9 11.01"})]}),gt=()=>e.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"15",y1:"9",x2:"9",y2:"15"}),e.jsx("line",{x1:"9",y1:"9",x2:"15",y2:"15"})]}),we=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]}),ft=()=>e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",children:[e.jsx("path",{fill:"#4285F4",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),e.jsx("path",{fill:"#34A853",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),e.jsx("path",{fill:"#FBBC05",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"}),e.jsx("path",{fill:"#EA4335",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"})]}),vt=()=>e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"})}),bt=()=>e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"})}),yt=()=>e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"})}),wt=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M12 6v6l4 2"})]}),jt=()=>e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"})}),kt=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M8 12h8M12 8v8"})]}),je=()=>e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}),e.jsx("polyline",{points:"15 3 21 3 21 9"}),e.jsx("line",{x1:"10",y1:"14",x2:"21",y2:"3"})]});function Nt({onClose:r,userEmail:o}){const[i,u]=s.useState(1),[m,v]=s.useState(null),[x,W]=s.useState({}),[n,S]=s.useState(!1),j="https://script.google.com/macros/s/AKfycbzVYHShkNF4yPbMf5rGnVfLg2oLq9cZxMpa_GQ3jwPEVWl-TQyTSE8WTz7b7P_GuA4NAg/exec",k=c=>{let y="neutral";(c==="Game Changer"||c==="Useful")&&(y="happy"),c==="Not helpful"&&(y="sad"),v(y),W(A=>({...A,rating:c})),u(2)},b=(c,y)=>{W(A=>({...A,[c]:y}))},D=async()=>{S(!0);try{const c={type:"pulse_check",timestamp:new Date().toLocaleString(),email:o||"anonymous",sentiment:m,...x};await fetch(j,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify(c)}),u(3)}catch(c){console.error("Feedback error:",c)}finally{S(!1)}};return e.jsxs("div",{className:"popup popup-center pulse-check-popup",children:[e.jsxs("div",{className:"popup-header",children:[e.jsx("span",{className:"popup-title",children:"Pulse Check"}),e.jsx("button",{onClick:r,className:"popup-close",children:"×"})]}),e.jsxs("div",{className:"popup-body",children:[i===1&&e.jsxs("div",{className:"pulse-step-1",children:[e.jsx("h3",{className:"pulse-question",children:"How is your experience?"}),e.jsxs("div",{className:"sentiment-grid",children:[e.jsxs("button",{onClick:()=>k("Game Changer"),className:"sentiment-btn group",children:[e.jsx("span",{className:"sentiment-emoji",children:"🤩"}),e.jsx("span",{className:"sentiment-label",children:"Game Changer"})]}),e.jsxs("button",{onClick:()=>k("Useful"),className:"sentiment-btn group",children:[e.jsx("span",{className:"sentiment-emoji",children:"🙂"}),e.jsx("span",{className:"sentiment-label",children:"Useful"})]}),e.jsxs("button",{onClick:()=>k("Okay"),className:"sentiment-btn group",children:[e.jsx("span",{className:"sentiment-emoji",children:"😐"}),e.jsx("span",{className:"sentiment-label",children:"Okay"})]}),e.jsxs("button",{onClick:()=>k("Not helpful"),className:"sentiment-btn group",children:[e.jsx("span",{className:"sentiment-emoji",children:"🙁"}),e.jsx("span",{className:"sentiment-label",children:"Not helpful"})]})]})]}),i===2&&e.jsxs("div",{className:"pulse-step-2 animate-fade-in",children:[m==="happy"?e.jsxs("div",{className:"pulse-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Should I invest more time into this?"}),e.jsxs("div",{className:"toggle-group",children:[e.jsx("button",{className:`toggle-btn ${x.investTime===!0?"active":""}`,onClick:()=>b("investTime",!0),children:"Yes"}),e.jsx("button",{className:`toggle-btn ${x.investTime===!1?"active":""}`,onClick:()=>b("investTime",!1),children:"No"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Did you wish for this tool before?"}),e.jsxs("div",{className:"toggle-group",children:[e.jsx("button",{className:`toggle-btn ${x.wishedBefore===!0?"active":""}`,onClick:()=>b("wishedBefore",!0),children:"Yes"}),e.jsx("button",{className:`toggle-btn ${x.wishedBefore===!1?"active":""}`,onClick:()=>b("wishedBefore",!1),children:"No"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Share more thoughts? (Optional)"}),e.jsx("textarea",{placeholder:"What was your impression?",rows:2,onChange:c=>b("feedbackText",c.target.value)})]})]}):e.jsxs("div",{className:"pulse-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"What went wrong?"}),e.jsx("div",{className:"options-list",children:["Buggy","Confusing","Didn't solve problem"].map(c=>e.jsx("button",{className:`option-btn ${x.whatWentWrong===c?"active":""}`,onClick:()=>b("whatWentWrong",c),children:c},c))})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"One thing to fix?"}),e.jsx("textarea",{placeholder:"Tell us what to improve...",rows:2,onChange:c=>b("feedbackText",c.target.value)})]})]}),e.jsx("button",{className:"btn-primary pulse-submit",disabled:n,onClick:D,children:n?"Sending...":"Submit Feedback"})]}),i===3&&e.jsxs("div",{className:"pulse-success animate-fade-in",children:[e.jsx("div",{className:"success-icon-wrapper",children:e.jsx(Le,{})}),e.jsx("h3",{children:"Thank You!"}),e.jsx("p",{children:"Your feedback helps us build better."}),e.jsx("button",{onClick:r,className:"btn-secondary pulse-close",children:"Close"})]})]})]})}const Ct=`
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: var(--font-sans);
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-light);
    background: var(--surface-primary);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .header-left, .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .logo-text {
    font-size: var(--text-lg);
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .logo-text .highlight {
    color: var(--accent);
  }

  .icon-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .icon-btn:hover {
    background: var(--surface-hover);
    color: var(--text-primary);
  }

  /* Avatar & User Menu */
  .user-menu-container {
    position: relative;
  }

  .avatar-btn {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-default);
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    background: var(--surface-secondary);
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-secondary);
  }

  .menu-backdrop {
    position: fixed;
    inset: 0;
    z-index: 40;
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 240px;
    background: var(--surface-primary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    z-index: 50;
    animation: fadeInDown 0.15s var(--ease-out);
  }

  .menu-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
  }

  .menu-avatar {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    background: var(--surface-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-weight: 600;
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .menu-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .menu-user-info {
    display: flex;
    flex-direction: column;
  }

  .menu-name {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
  }

  .menu-email {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
  }

  .menu-divider {
    height: 1px;
    background: var(--border-light);
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    background: transparent;
    border: none;
    font-size: var(--text-sm);
    color: var(--text-primary);
    cursor: pointer;
    text-align: left;
    transition: background var(--duration-fast) var(--ease-out);
  }

  .menu-item:hover {
    background: var(--surface-hover);
  }

  .menu-item svg {
    color: var(--text-tertiary);
  }

  /* Main */
  .main {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  /* Mode Toggle */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-light);
    background: var(--surface-primary);
    position: sticky;
    top: 0;
    z-index: 50;
    min-height: 60px;
  }

  .header-left {
    flex: 1;
    display: flex;
    justify-content: flex-start;
  }

  .header-right {
    flex: 1;
  }

  /* Mode Toggle */
  .mode-toggle {
    display: inline-flex;
    padding: 3px;
    background: var(--surface-tertiary);
    border-radius: var(--radius-lg);
  }

  .mode-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-tertiary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .mode-btn:hover {
    color: var(--text-secondary);
  }

  .mode-btn.active {
    background: var(--surface-primary);
    color: var(--text-primary);
    box-shadow: var(--shadow-sm);
  }

  /* Content Area */
  .content-area {
    flex: 1;
    overflow: auto;
    padding: 16px;
  }

  /* Prompts */
  .prompts-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 16px;
  }

  .prompt-card {
    display: flex;
    gap: 12px;
    padding: 14px;
    background: var(--surface-primary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .prompt-card:hover {
    border-color: var(--border-default);
  }

  .prompt-index {
    width: 22px;
    height: 22px;
    border-radius: var(--radius-full);
    background: var(--grey-900);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    flex-shrink: 0;
  }

  [data-theme="dark"] .prompt-index {
    background: var(--grey-100);
    color: var(--grey-900);
  }

  .prompt-body {
    flex: 1;
    min-width: 0;
  }

  .prompt-text {
    margin: 0;
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    color: var(--text-primary);
    word-break: break-word;
  }

  .prompt-card.placeholder {
    border-style: dashed;
    background: transparent;
    opacity: 0.8;
  }

  .prompt-card.placeholder.opacity-50 {
    opacity: 0.6;
  }

  .placeholder-text {
    color: var(--text-secondary);
    font-style: italic;
  }

  .placeholder-line {
    height: 10px;
    background: var(--surface-tertiary);
    border-radius: var(--radius-sm);
    margin-bottom: 8px;
  }

  .w-3\\/4 { width: 75%; }
  .w-1\\/2 { width: 50%; }

  .empty-state-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .expand-btn {
    margin-top: 8px;
    padding: 0;
    background: transparent;
    border: none;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--highlight);
    cursor: pointer;
  }

  .expand-btn:hover {
    text-decoration: underline;
  }

  /* Summary */
  .summary-card {
    padding: 16px;
    background: var(--surface-secondary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
  }

  .summary-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
  }

  .summary-text {
    margin: 0;
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    color: var(--text-primary);
    white-space: pre-wrap;
  }

  /* Stats Bar */
  .stats-bar {
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--border-light);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: auto;
    opacity: 1;
    overflow: hidden;
  }

  .stats-bar.hidden {
    height: 0;
    padding: 0;
    opacity: 0;
    border-top: none;
  }

  .stat-badge {
    padding: 4px 10px;
    background: var(--surface-tertiary);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--text-secondary);
  }

  .stat-badge.warning {
    background: var(--error-surface);
    color: var(--error);
  }

  /* Action Bar */
  .action-bar {
    padding: 16px;
    border-top: 1px solid var(--border-light);
    background: var(--surface-primary);
  }

  .btn-primary {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
    background: var(--grey-900);
    color: var(--white);
    border: none;
    border-radius: var(--radius-full);
    font-size: var(--text-base);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
  }

  [data-theme="dark"] .btn-primary {
    background: var(--white);
    color: var(--grey-900);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .btn-primary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-primary.loading {
    pointer-events: none;
  }

  .btn-spinner {
    position: relative;
    width: 18px;
    height: 18px;
  }

  .spinner-ring {
    position: absolute;
    inset: 0;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .secondary-actions {
    display: flex;
    gap: 8px;
  }

  .btn-secondary {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 14px;
    background: var(--surface-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-xl);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--surface-hover);
    border-color: var(--border-strong);
  }

  .btn-secondary:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .btn-secondary.success {
    border-color: var(--highlight);
    color: var(--highlight);
    background: var(--highlight-surface);
  }

  /* Bottom Navigation */
  .bottom-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px 8px;
    border-top: 1px solid var(--border-light);
    background: var(--surface-primary);
  }

  .nav-right {
    display: flex;
    gap: 4px;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    padding: 4px 10px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    transition: color var(--duration-fast) var(--ease-out);
    min-width: 0;
  }

  .nav-item:hover {
    color: var(--text-secondary);
  }

  .nav-item:active {
    transform: scale(0.95);
  }

  .nav-item.active {
    color: var(--text-primary);
  }

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }

  .nav-label {
    font-size: 10px;
    font-weight: 500;
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0.02em;
  }

  .nav-profile {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background var(--duration-fast) var(--ease-out);
  }

  .nav-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
    background: #000000;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: var(--radius-md);
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: all 0.2s var(--ease-out);
    z-index: 1000;
    box-shadow: var(--shadow-md);
  }

  .has-tooltip {
    position: relative;
  }

  .tooltip-bottom {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(8px);
    background: #000000;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: var(--radius-md);
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: all 0.2s var(--ease-out);
    z-index: 1000;
    box-shadow: var(--shadow-md);
  }

  [data-theme="dark"] .tooltip-bottom {
    background: #000000;
    color: #ffffff;
    border: 1px solid var(--grey-800);
  }

  .has-tooltip:hover .tooltip-bottom {
    opacity: 1;
    transform: translateX(-50%) translateY(4px);
  }

  [data-theme="dark"] .nav-tooltip {
    background: #000000;
    color: #ffffff;
    border: 1px solid var(--grey-800);
  }

  .nav-item:hover .nav-tooltip,
  .nav-profile:hover .nav-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(-4px);
  }

  .nav-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background var(--duration-fast) var(--ease-out);
  }

  .nav-profile:hover {
    background: var(--surface-hover);
  }

  .nav-profile:active {
    transform: scale(0.97);
  }

  .nav-profile.active {
    background: var(--surface-secondary);
  }

  .nav-profile-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-secondary);
    color: var(--text-muted);
  }

  .nav-profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .nav-profile-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  .nav-profile-name {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-primary);
    line-height: 1.2;
  }

  .nav-profile-tier {
    font-size: 10px;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  /* Floating Popups */

  .popup {
    position: fixed;
    bottom: 80px;
    min-width: 180px;
    max-width: calc(100% - 32px);
    background: var(--surface-primary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 24px rgba(0,0,0,0.15);
    z-index: 100;
    animation: popupIn 0.15s ease-out;
    display: flex;
    flex-direction: column;
  }

  .popup-left {
    left: 16px;
  }

  .popup-right {
    right: 16px;
  }

  .popup-history {
    width: 280px;
  }

  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  @keyframes popupIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-light);
  }

  .popup-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .popup-title-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .popup-external-link {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
  }

  .popup-external-link:hover {
    color: var(--text-primary);
    background: var(--surface-hover);
  }

  .popup-clear {
    font-size: var(--text-xs);
    color: var(--text-muted);
    background: none;
    border: none;
    cursor: pointer;
  }

  .popup-clear:hover {
    color: var(--accent);
  }

  .popup-confirm {
    display: flex;
    gap: 6px;
  }

  .popup-confirm-btn {
    padding: 4px 8px;
    font-size: var(--text-xs);
    border-radius: var(--radius-sm);
    border: none;
    cursor: pointer;
    background: var(--surface-secondary);
    color: var(--text-secondary);
  }

  .popup-confirm-btn.danger {
    background: #ef4444;
    color: white;
  }

  .popup-body {
    padding: 12px 16px;
  }

  .popup-scroll {
    overflow-y: auto;
    max-height: 260px;
  }

  .popup-empty {
    color: var(--text-muted);
    font-size: var(--text-sm);
    text-align: center;
    padding: 20px 0;
  }

  .popup-user {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .popup-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    background: var(--surface-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
  }

  .popup-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .popup-user-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .popup-user-name {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
  }

  .popup-user-email {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .popup-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    min-height: 40px;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .popup-btn.primary {
    background: var(--surface-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-default);
  }

  .popup-btn.primary:hover {
    background: var(--surface-hover);
  }

  .popup-btn.primary:active {
    transform: scale(0.98);
    background: var(--surface-secondary);
  }

  .popup-btn.primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .popup-btn.danger {
    background: transparent;
    color: #ef4444;
  }

  .popup-btn.danger:hover {
    background: #fef2f2;
  }

  [data-theme="dark"] .popup-btn.danger:hover {
    background: #450a0a;
  }

  .popup-history-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 0;
    background: none;
    border: none;
    border-bottom: 1px solid var(--border-light);
    cursor: pointer;
    text-align: left;
  }

  .popup-history-item:last-child {
    border-bottom: none;
  }

  .popup-history-item:hover {
    background: var(--surface-hover);
    margin: 0 -16px;
    padding: 10px 16px;
    width: calc(100% + 32px);
  }

  .popup-history-item:active {
    background: var(--surface-secondary);
    transform: scale(0.98);
  }

  .popup-history-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .popup-history-preview {
    font-size: var(--text-sm);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .popup-history-meta {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .popup-setting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
  }

  .popup-setting-label {
    font-size: var(--text-sm);
    color: var(--text-primary);
  }

  .popup-setting-value {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  .popup-select {
    padding: 6px 10px;
    background: var(--surface-secondary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    color: var(--text-primary);
    cursor: pointer;
  }

  /* Empty State */
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    text-align: center;
  }

  .empty-illustration {
    margin-bottom: 20px;
    color: var(--text-muted);
  }

  .empty-title {
    margin: 0 0 6px;
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .empty-desc {
    margin: 0 0 20px;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    max-width: 240px;
    line-height: var(--leading-relaxed);
  }

  .empty-action {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: var(--grey-900);
    color: var(--white);
    border: none;
    border-radius: var(--radius-xl);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  [data-theme="dark"] .empty-action {
    background: var(--white);
    color: var(--grey-900);
  }

  .empty-action:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  /* Loading State */
  .loading-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .loading-animation {
    position: relative;
    width: 48px;
    height: 48px;
  }

  .loading-ring {
    position: absolute;
    inset: 0;
    border: 2px solid var(--border-default);
    border-radius: 50%;
    animation: ripple 1.5s ease-out infinite;
  }

  .loading-ring.delay-1 {
    animation-delay: 0.3s;
  }

  .loading-ring.delay-2 {
    animation-delay: 0.6s;
  }

  .loading-text {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  /* Error State */
  .error-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    text-align: center;
  }

  .error-icon {
    width: 52px;
    height: 52px;
    border-radius: var(--radius-2xl);
    background: var(--error-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    color: var(--error);
  }

  .error-title {
    margin: 0 0 6px;
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .error-desc {
    margin: 0 0 20px;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    max-width: 240px;
    line-height: var(--leading-relaxed);
  }

  .error-action {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: var(--grey-900);
    color: var(--white);
    border: none;
    border-radius: var(--radius-xl);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
  }

  [data-theme="dark"] .error-action {
    background: var(--white);
    color: var(--grey-900);
  }

  /* History */
  .history-container {
    padding: 16px;
  }

  .history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .history-title {
    margin: 0;
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--text-primary);
  }

  .clear-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--error);
    cursor: pointer;
    transition: background var(--duration-fast) var(--ease-out);
  }

  .clear-btn:hover {
    background: var(--error-surface);
  }

  .history-group {
    margin-bottom: 20px;
  }

  .history-date {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
    padding-left: 2px;
  }

  .history-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px;
    margin-bottom: 6px;
    background: var(--surface-primary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    text-align: left;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .history-item:hover {
    border-color: var(--border-default);
    background: var(--surface-hover);
  }

  .history-badge {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--surface-tertiary);
    color: var(--text-secondary);
  }

  .history-content {
    flex: 1;
    min-width: 0;
  }

  .history-preview {
    display: block;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .history-meta {
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin-top: 2px;
  }

  /* Settings */
  .settings-container {
    padding: 16px;
  }

  .settings-section {
    margin-bottom: 24px;
  }

  .section-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 8px 2px;
  }

  .settings-card {
    background: var(--surface-primary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .account-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
  }

  .account-avatar {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    background: var(--surface-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: var(--text-tertiary);
  }

  .account-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .account-info {
    flex: 1;
    min-width: 0;
  }

  .account-name {
    display: block;
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
  }

  .account-email {
    display: block;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .tier-badge {
    padding: 4px 8px;
    background: var(--grey-900);
    color: var(--white);
    border-radius: var(--radius-sm);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.03em;
  }

  [data-theme="dark"] .tier-badge {
    background: var(--white);
    color: var(--grey-900);
  }

  .setting-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
  }

  .setting-icon {
    width: 20px;
    height: 20px;
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .setting-content {
    flex: 1;
    min-width: 0;
  }

  .setting-title {
    display: block;
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
  }

  .setting-title .highlight {
    color: var(--accent);
  }

  .setting-subtitle {
    display: block;
    font-size: var(--text-sm);
    color: var(--text-tertiary);
  }

  .setting-select {
    padding: 6px 10px;
    background: var(--surface-secondary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    color: var(--text-primary);
    cursor: pointer;
  }

  /* Success Overlay */
  .success-overlay {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--grey-900);
    color: var(--white);
    padding: 8px 16px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 200;
    box-shadow: var(--shadow-lg);
    animation: slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .success-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 32px 48px;
    background: var(--surface-primary);
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-xl);
    animation: successPop 0.4s var(--ease-out);
  }

  .success-icon {
    color: var(--highlight);
  }

  .success-text {
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
  }

  /* Toast */
  .toast {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: var(--grey-900);
    color: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    font-size: var(--text-sm);
    font-weight: 500;
    z-index: 100;
    animation: fadeInUp 0.2s var(--ease-out);
  }

  [data-theme="dark"] .toast {
    background: var(--white);
    color: var(--grey-900);
  }

  /* Animated checkmark */
  .check-animated polyline {
    stroke-dasharray: 24;
    stroke-dashoffset: 0;
    animation: checkmark 0.3s ease-out;
  }

  @keyframes checkmark {
    from { stroke-dashoffset: 24; }
    to { stroke-dashoffset: 0; }
  }

  /* Nav Avatar */
  .nav-avatar {
    width: 20px;
    height: 20px;
    border-radius: var(--radius-full);
    object-fit: cover;
  }

  /* Profile View */
  .profile-container {
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 32px;
  }

  .profile-avatar {
    width: 72px;
    height: 72px;
    border-radius: var(--radius-full);
    background: var(--surface-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-bottom: 16px;
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--text-secondary);
  }

  .profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .profile-name {
    margin: 0 0 4px;
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--text-primary);
  }

  .profile-email {
    margin: 0 0 12px;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .profile-actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .profile-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    background: var(--surface-secondary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .profile-action-btn:hover {
    background: var(--surface-hover);
    border-color: var(--border-strong);
  }

  .profile-action-btn.upgrade {
    background: var(--grey-900);
    border-color: var(--grey-900);
    color: var(--white);
  }

  [data-theme="dark"] .profile-action-btn.upgrade {
    background: var(--white);
    border-color: var(--white);
    color: var(--grey-900);
  }

  .profile-action-btn.signout {
    color: var(--error);
  }

  .profile-action-btn.signout:hover {
    background: var(--error-surface);
  }

  .profile-guest {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 16px;
  }

  .profile-guest-icon {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-full);
    background: var(--surface-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    color: var(--text-muted);
  }

  .profile-guest-title {
    margin: 0 0 8px;
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .profile-guest-desc {
    margin: 0 0 24px;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    max-width: 240px;
    line-height: var(--leading-relaxed);
  }

  .profile-signin-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    background: var(--surface-primary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-xl);
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .profile-signin-btn:hover {
    background: var(--surface-hover);
    border-color: var(--border-strong);
  }

  .profile-signin-btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .profile-signin-btn.loading {
    background: var(--surface-secondary);
  }

  .profile-signin-btn.success {
    background: #10b981;
    border-color: #10b981;
    color: white;
  }

  .profile-signin-btn.error {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border-default);
    border-top-color: var(--accent, var(--highlight));
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .login-error {
    margin-bottom: 12px;
    padding: 10px 14px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: var(--radius-md);
    color: #dc2626;
    font-size: var(--text-sm);
    text-align: center;
  }

  [data-theme="dark"] .login-error {
    background: #450a0a;
    border-color: #7f1d1d;
    color: #fca5a5;
  }

  /* Extract Button Pulse Rings */
  .extract-btn-wrapper {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
  }

  .extract-btn-wrapper .btn-primary {
    margin-bottom: 0;
  }

  .pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border: 2px solid var(--grey-400);
    border-radius: var(--radius-xl);
    transform: translate(-50%, -50%);
    opacity: 0;
    pointer-events: none;
  }

  .extract-btn-wrapper.pulsing .pulse-ring {
    animation: pulseRing 2s ease-out infinite;
  }

  .pulse-ring.pulse-1 { animation-delay: 0s; }
  .pulse-ring.pulse-2 { animation-delay: 0.4s; }
  .pulse-ring.pulse-3 { animation-delay: 0.8s; }

  @keyframes pulseRing {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.15);
      opacity: 0;
    }
  }

  /* Sparkles */
  .sparkles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sparkle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--grey-400);
    border-radius: 50%;
    animation: sparkleAnim 0.8s ease-out forwards;
  }

  .sparkle.s1 { top: 30%; left: 35%; animation-delay: 0s; }
  .sparkle.s2 { top: 25%; left: 55%; animation-delay: 0.1s; }
  .sparkle.s3 { top: 40%; left: 65%; animation-delay: 0.15s; }
  .sparkle.s4 { top: 55%; left: 60%; animation-delay: 0.2s; }
  .sparkle.s5 { top: 60%; left: 40%; animation-delay: 0.1s; }
  .sparkle.s6 { top: 45%; left: 30%; animation-delay: 0.05s; }

  @keyframes sparkleAnim {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: scale(1.5) rotate(180deg);
      opacity: 1;
    }
    100% {
      transform: scale(0) rotate(360deg) translateY(-30px);
      opacity: 0;
    }
  }

  /* Platform Logo in History */
  .history-platform {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    background: var(--surface-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--text-secondary);
  }

  .history-content-top {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .history-mode-tag {
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    flex-shrink: 0;
  }

  .history-mode-tag.raw {
    background: var(--surface-tertiary);
    color: var(--text-secondary);
  }

  .history-mode-tag.summary {
    background: var(--highlight-surface);
    color: var(--highlight);
  }

  /* Pulse Check Styles */
  .pulse-check-popup {
    width: 320px;
  }
  
  .pulse-question {
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
    color: var(--text-primary);
  }
  
  .sentiment-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .sentiment-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    background: var(--surface-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .sentiment-btn:hover {
    background: var(--surface-tertiary);
    border-color: var(--text-primary);
    transform: translateY(-1px);
  }
  
  .sentiment-emoji {
    font-size: 24px;
    margin-bottom: 4px;
    transition: transform 0.2s;
  }
  
  .sentiment-btn:hover .sentiment-emoji {
    transform: scale(1.1);
  }
  
  .sentiment-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-secondary);
  }
  
  .sentiment-btn:hover .sentiment-label {
    color: var(--text-primary);
  }
  
  .pulse-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .form-group label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--text-primary);
  }
  
  .toggle-group {
    display: flex;
    gap: 8px;
  }
  
  .toggle-btn {
    flex: 1;
    padding: 6px;
    font-size: 12px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-sm);
    background: var(--surface-primary);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .toggle-btn:hover {
    background: var(--surface-secondary);
  }
  
  .toggle-btn.active {
    background: var(--text-primary);
    color: var(--surface-primary);
    border-color: var(--text-primary);
  }
  
  .options-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .option-btn {
    text-align: left;
    padding: 8px 12px;
    font-size: 12px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-sm);
    background: var(--surface-primary);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .option-btn:hover {
    background: var(--surface-secondary);
  }
  
  .option-btn.active {
    background: var(--surface-secondary);
    border-color: var(--text-primary);
    color: var(--text-primary);
    font-weight: 500;
  }
  
  .pulse-form textarea {
    width: 100%;
    padding: 8px;
    font-size: 12px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-sm);
    background: var(--surface-secondary);
    color: var(--text-primary);
    resize: none;
    outline: none;
  }
  
  .pulse-form textarea:focus {
    border-color: var(--text-primary);
    background: var(--surface-primary);
  }
  
  .pulse-submit {
    width: 100%;
    margin-top: 8px;
  }
  
  .pulse-success {
    text-align: center;
    padding: 20px 0;
  }
  
  .success-icon-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
    color: var(--success);
  }
  
  .pulse-success h3 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .pulse-success p {
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 20px;
  }
  
  .pulse-close {
    width: 100%;
  }
`;De.createRoot(document.getElementById("root")).render(e.jsx(Fe.StrictMode,{children:e.jsx(et,{})}));
