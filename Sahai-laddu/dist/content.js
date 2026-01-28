var A=Object.defineProperty;var q=(o,r,e)=>r in o?A(o,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[r]=e;var p=(o,r,e)=>q(o,typeof r!="symbol"?r+"":r,e);class m{deepQuerySelectorAll(r,e=document){let s=Array.from(e.querySelectorAll(r));const u=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT);let d;for(;d=u.nextNode();){const i=d;i.shadowRoot&&(s=[...s,...this.deepQuerySelectorAll(r,i.shadowRoot)])}return s}cleanText(r){return r.replace(/\s+/g," ").trim()}isUIElement(r){return/^(copy|regenerate|share|edit|delete|save|retry|cancel|submit|send|stop|continue|new chat|clear)$/i.test(r.trim())||r.trim().length<3}getVisibleText(r){const e=r;return e.innerText||e.textContent||""}}class C extends m{constructor(){super(...arguments);p(this,"name","chatgpt")}detect(){return location.hostname.includes("chatgpt.com")||location.hostname.includes("chat.openai.com")}scrapePrompts(){const e=[],s=new Set,u=document.querySelectorAll('[data-message-author-role="user"]');if(u.length>0&&(u.forEach((a,n)=>{const t=this.cleanText(this.getVisibleText(a));t&&!this.isUIElement(t)&&!s.has(t)&&(s.add(t),e.push({content:t,index:n}))}),e.length>0))return e;const d=document.querySelectorAll("article");let i=0;return d.forEach(a=>{const n=a.querySelector(".markdown"),t=a.querySelector(".agent-turn");if(n||t)return;const c=this.cleanText(this.getVisibleText(a));c&&c.length>5&&!s.has(c)&&(s.add(c),e.push({content:c,index:i++}))}),e}}class P extends m{constructor(){super(...arguments);p(this,"name","claude")}detect(){return location.hostname.includes("claude.ai")}scrapePrompts(){const e=[],s=new Set,u=document.querySelectorAll('[data-testid="human-message"], .human-message, [class*="human"]');if(u.length>0&&(u.forEach((a,n)=>{const t=this.cleanText(this.getVisibleText(a));t&&!this.isUIElement(t)&&!s.has(t)&&(s.add(t),e.push({content:t,index:n}))}),e.length>0))return e;const d=document.querySelectorAll('[class*="message"], [class*="Message"]');let i=0;if(d.forEach(a=>{const n=a.className.toLowerCase();if(!(n.includes("assistant")||n.includes("ai")||n.includes("claude"))&&(n.includes("user")||n.includes("human"))){const t=this.cleanText(this.getVisibleText(a));t&&t.length>5&&!s.has(t)&&(s.add(t),e.push({content:t,index:i++}))}}),e.length===0){const a=document.querySelector('[class*="conversation"], [class*="chat"], main');a&&a.querySelectorAll(":scope > div").forEach((t,c)=>{if(!t.querySelector(".prose, .markdown, pre, code")){const l=this.cleanText(this.getVisibleText(t));l&&l.length>10&&!s.has(l)&&(s.add(l),e.push({content:l,index:c}))}})}return e}}class k extends m{constructor(){super(...arguments);p(this,"name","gemini")}detect(){return location.hostname.includes("gemini.google.com")}scrapePrompts(){const e=[],s=new Set,u=this.deepQuerySelectorAll('user-query, [class*="user-query"], [class*="query-text"]');if(u.length>0&&(u.forEach((i,a)=>{const n=this.cleanText(this.getVisibleText(i));n&&!this.isUIElement(n)&&!s.has(n)&&(s.add(n),e.push({content:n,index:a}))}),e.length>0))return e;if(this.deepQuerySelectorAll(".query-content, .user-message, [data-query]").forEach((i,a)=>{const n=this.cleanText(this.getVisibleText(i));n&&n.length>3&&!s.has(n)&&(s.add(n),e.push({content:n,index:a}))}),e.length===0){const i=document.querySelector('main, [role="main"]');if(i){const a=i.querySelectorAll('[class*="turn"], [class*="message"]');let n=0;a.forEach(t=>{const c=t.className.toLowerCase();if(c.includes("model")||c.includes("response")||c.includes("answer"))return;const l=this.cleanText(this.getVisibleText(t));l&&l.length>5&&!s.has(l)&&(s.add(l),e.push({content:l,index:n++}))})}}return e}}class I extends m{constructor(){super(...arguments);p(this,"name","perplexity")}detect(){return location.hostname.includes("perplexity.ai")}scrapePrompts(){const e=[],s=new Set;if(document.querySelectorAll('[class*="query"], [class*="question"], [class*="user"]').forEach((d,i)=>{const a=d.className.toLowerCase();if(a.includes("answer")||a.includes("response")||a.includes("source"))return;const n=this.cleanText(this.getVisibleText(d));n&&n.length>5&&!this.isUIElement(n)&&!s.has(n)&&(s.add(n),e.push({content:n,index:i}))}),e.length===0){const d=document.querySelectorAll('[class*="thread"] > div, [class*="Thread"] > div');let i=0;d.forEach((a,n)=>{if(n%2===0){const t=this.cleanText(this.getVisibleText(a));t&&t.length>5&&!s.has(t)&&(s.add(t),e.push({content:t,index:i++}))}})}return e.length===0&&document.querySelectorAll('h1, h2, [class*="title"]').forEach((i,a)=>{const n=this.cleanText(this.getVisibleText(i));n&&n.length>10&&n.length<500&&!s.has(n)&&(s.add(n),e.push({content:n,index:a}))}),e}}class L extends m{constructor(){super(...arguments);p(this,"name","deepseek")}detect(){return location.hostname.includes("deepseek.com")}scrapePrompts(){const e=[],s=new Set;if(document.querySelectorAll('[class*="user"], [class*="User"], [data-role="user"]').forEach((a,n)=>{const t=this.cleanText(this.getVisibleText(a));t&&!this.isUIElement(t)&&!s.has(t)&&(s.add(t),e.push({content:t,index:n}))}),e.length>0)return e;const d=document.querySelectorAll('[class*="bubble"], [class*="message"]');let i=0;return d.forEach(a=>{const n=a.className.toLowerCase();if(!(n.includes("assistant")||n.includes("bot")||n.includes("ai"))&&(n.includes("user")||n.includes("human"))){const t=this.cleanText(this.getVisibleText(a));t&&t.length>3&&!s.has(t)&&(s.add(t),e.push({content:t,index:i++}))}}),e.length===0&&document.querySelectorAll("main div").forEach((n,t)=>{if(!n.querySelector(".ds-markdown")&&!n.closest(".ds-markdown")){const c=this.cleanText(this.getVisibleText(n));c&&c.length>10&&c.length<2e3&&!s.has(c)&&!c.includes("```")&&!c.startsWith("#")&&(s.add(c),e.push({content:c,index:t}))}}),e}}class z extends m{constructor(){super(...arguments);p(this,"name","lovable")}detect(){return location.hostname.includes("lovable.dev")}scrapePrompts(){const e=[],s=new Set;if(document.querySelectorAll('[class*="user-message"], [class*="UserMessage"], [data-sender="user"]').forEach((i,a)=>{const n=this.cleanText(this.getVisibleText(i));n&&!this.isUIElement(n)&&!s.has(n)&&(s.add(n),e.push({content:n,index:a}))}),e.length>0)return e;if(document.querySelectorAll('[class*="editable"], [class*="edit-button"]').forEach((i,a)=>{const n=i.closest('[class*="message"]');if(n){const t=this.cleanText(this.getVisibleText(n));t&&t.length>5&&!s.has(t)&&(s.add(t),e.push({content:t,index:a}))}}),e.length===0){const i=document.querySelector('[class*="chat"], [class*="conversation"], [class*="messages"]');if(i){const a=i.querySelectorAll(":scope > div");let n=0;a.forEach(t=>{const c=t.className.toLowerCase();if(c.includes("bot")||c.includes("assistant")||c.includes("ai")||c.includes("system"))return;const l=this.cleanText(this.getVisibleText(t));l&&l.length>5&&!s.has(l)&&(s.add(l),e.push({content:l,index:n++}))})}}return e}}class M extends m{constructor(){super(...arguments);p(this,"name","bolt")}detect(){return location.hostname.includes("bolt.new")}scrapePrompts(){const e=[],s=new Set;if(document.querySelectorAll('[class*="user"], [class*="prompt"], [class*="input-message"]').forEach((a,n)=>{const t=a.className.toLowerCase();if(t.includes("assistant")||t.includes("response")||t.includes("output"))return;const c=this.cleanText(this.getVisibleText(a));c&&!this.isUIElement(c)&&!s.has(c)&&(s.add(c),e.push({content:c,index:n}))}),e.length>0)return e;const d=document.querySelectorAll('[class*="message"], [class*="Message"]');let i=0;return d.forEach(a=>{const n=a.className.toLowerCase();if(n.includes("user")||n.includes("human")||n.includes("you")){const t=this.cleanText(this.getVisibleText(a));t&&t.length>3&&!s.has(t)&&(s.add(t),e.push({content:t,index:i++}))}}),e.length===0&&document.querySelectorAll('[class*="workspace"] [class*="prompt"], [class*="project"] [class*="request"]').forEach((n,t)=>{const c=this.cleanText(this.getVisibleText(n));c&&c.length>5&&!s.has(c)&&(s.add(c),e.push({content:c,index:t}))}),e}}class N extends m{constructor(){super(...arguments);p(this,"name","cursor")}detect(){return location.hostname.includes("cursor.sh")||location.hostname.includes("cursor.com")}scrapePrompts(){const e=[],s=new Set;if(document.querySelectorAll('[class*="user-message"], [class*="UserMessage"], [data-role="user"]').forEach((a,n)=>{const t=this.cleanText(this.getVisibleText(a));t&&!this.isUIElement(t)&&!s.has(t)&&(s.add(t),e.push({content:t,index:n}))}),e.length>0)return e;const d=document.querySelectorAll('[class*="chat"] [class*="message"], [class*="conversation"] [class*="turn"]');let i=0;return d.forEach(a=>{const n=a.className.toLowerCase();if(n.includes("assistant")||n.includes("bot")||n.includes("ai")||n.includes("response"))return;const t=this.cleanText(this.getVisibleText(a));t&&t.length>3&&!s.has(t)&&(s.add(t),e.push({content:t,index:i++}))}),e.length===0&&document.querySelectorAll('[class*="command"], [class*="prompt-history"], [class*="input-history"]').forEach((n,t)=>{const c=this.cleanText(this.getVisibleText(n));c&&c.length>5&&!s.has(c)&&(s.add(c),e.push({content:c,index:t}))}),e}}class V extends m{constructor(){super(...arguments);p(this,"name","meta-ai")}detect(){return location.hostname.includes("meta.ai")}scrapePrompts(){const e=[],s=new Set;if(document.querySelectorAll('[class*="user"], [class*="User"], [data-type="user"]').forEach((a,n)=>{const t=a.className.toLowerCase();if(t.includes("assistant")||t.includes("response")||t.includes("meta"))return;const c=this.cleanText(this.getVisibleText(a));c&&!this.isUIElement(c)&&!s.has(c)&&(s.add(c),e.push({content:c,index:n}))}),e.length>0)return e;const d=document.querySelectorAll('[class*="bubble"], [class*="Bubble"]');let i=0;if(d.forEach(a=>{const n=a.className.toLowerCase();if(n.includes("right")||n.includes("user")||n.includes("outgoing")){const t=this.cleanText(this.getVisibleText(a));t&&t.length>3&&!s.has(t)&&(s.add(t),e.push({content:t,index:i++}))}}),e.length===0){const a=document.querySelector('[class*="thread"], [class*="conversation"], [role="log"]');a&&a.querySelectorAll(":scope > div, :scope > li").forEach((t,c)=>{if(t.querySelector('.markdown, pre, code, [class*="response"]'))return;const l=this.cleanText(this.getVisibleText(t));l&&l.length>5&&l.length<2e3&&!s.has(l)&&(s.add(l),e.push({content:l,index:c}))})}return e}}class U extends m{constructor(){super(...arguments);p(this,"name","generic")}detect(){return!0}scrapePrompts(){const e=[],s=new Set,u=['[data-role="user"]','[data-message-author-role="user"]','[class*="user-message"]','[class*="UserMessage"]','[class*="human-message"]','[class*="HumanMessage"]',".user",".human"];for(const i of u){const a=document.querySelectorAll(i);if(a.length>0&&(a.forEach((n,t)=>{const c=this.cleanText(this.getVisibleText(n));c&&c.length>3&&!this.isUIElement(c)&&!s.has(c)&&(s.add(c),e.push({content:c,index:t}))}),e.length>0))return e}return document.querySelectorAll('[class*="chat"], [class*="conversation"], [class*="messages"], [role="log"]').forEach(i=>{const a=i.querySelectorAll(":scope > div, :scope > article");let n=0;a.forEach((t,c)=>{const l=t.className.toLowerCase(),h=this.cleanText(this.getVisibleText(t)),w=l.includes("user")||l.includes("human")||l.includes("outgoing")||l.includes("sent"),v=l.includes("assistant")||l.includes("bot")||l.includes("ai")||l.includes("response")||l.includes("incoming")||t.querySelector(".markdown, .prose, pre:not(.user-code)");(w||!v&&c%2===0)&&h&&h.length>5&&h.length<5e3&&!s.has(h)&&(s.add(h),e.push({content:h,index:n++}))})}),e}}const B=[new C,new P,new k,new I,new L,new z,new M,new N,new V,new U];function T(){return B.find(o=>o.detect())||null}function _(){const o=T();return o?o.name:null}console.log("[PromptExtractor] Content script loaded");const g=T(),x=_();console.log(`[PromptExtractor] Platform detected: ${x||"unknown"}`);let f=null;function E(){if(!g)return console.log("[PromptExtractor] No adapter available"),[];const o=g.scrapePrompts();return console.log(`[PromptExtractor] Extracted ${o.length} prompts`),o}function S(o){return{platform:x||"unknown",url:window.location.href,title:document.title,prompts:o,extractedAt:Date.now()}}const O=`
  /* Add space at top of container for Zone 1 */
  .pe-has-zone1 {
    padding-top: 44px !important;
    position: relative !important;
  }
  
  .pe-zone1 {
    position: absolute;
    top: 8px;
    left: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
    z-index: 10;
  }
  
  .pe-zone1-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 7px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 150ms ease;
    white-space: nowrap;
    line-height: 1;
    letter-spacing: 0.01em;
  }
  
  .pe-zone1-btn.extract {
    background: #ffffff;
    color: #1a1a1a;
    border: 1px solid #e0e0e0;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  
  .pe-zone1-btn.extract:hover {
    background: #f5f5f5;
    border-color: #d0d0d0;
  }
  
  .pe-zone1-btn.summarize {
    background: #1a1a1a;
    color: #ffffff;
    border: 1px solid #1a1a1a;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  }
  
  .pe-zone1-btn.summarize:hover {
    background: #333333;
    border-color: #333333;
  }
  
  .pe-zone1-btn.paste {
    background: #f0f0f0;
    color: #1a1a1a;
    border: 1px solid #d0d0d0;
    animation: pe-fade-in 200ms ease-out;
  }
  
  .pe-zone1-btn.paste:hover {
    background: #e5e5e5;
  }
  
  .pe-zone1-btn:active {
    transform: scale(0.97);
  }
  
  .pe-zone1-btn.loading {
    opacity: 0.6;
    pointer-events: none;
  }
  
  .pe-zone1-btn svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    margin-right: 4px;
  }
  
  .pe-spinner {
    animation: pe-spin 0.8s linear infinite;
  }
  
  @keyframes pe-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pe-fade-in {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }
`,R={chatgpt:['form[class*="stretch"] > div > div','form.w-full > div > div[class*="relative"]','[data-testid="composer-background"]',"main form > div > div","#composer-background"],claude:['[data-testid="composer-container"]',".composer-container",'fieldset[class*="composer"]'],gemini:[".input-area-container","rich-textarea",".text-input-field_textarea-wrapper"],perplexity:['[data-testid="ask-input-container"]',".ask-input-container"],deepseek:[".chat-input-container","#chat-input"],lovable:[".prompt-input-container",'[data-testid="prompt-input"]'],bolt:[".chat-input",'[data-testid="chat-input"]'],cursor:[".input-container",'[data-testid="input"]'],"meta-ai":['[data-testid="composer"]',".composer"]};function D(){const o=R[x||""]||[];for(const e of o){const s=document.querySelector(e);if(s&&s.offsetParent!==null)return console.log("[PromptExtractor] Found input via selector:",e),s}if(x==="chatgpt"){const e=document.querySelector('form[class*="stretch"], form.w-full');if(e){const s=e.querySelector('div[class*="rounded"]');if(s&&s.offsetParent!==null)return console.log("[PromptExtractor] Found ChatGPT inner container"),s;const u=e.querySelector(":scope > div > div");if(u)return console.log("[PromptExtractor] Found ChatGPT first div"),u}}const r=document.querySelectorAll('textarea, [contenteditable="true"]');for(const e of r)if(e.offsetParent!==null){let s=e.parentElement,u=0;for(;s&&u<6;){const d=window.getComputedStyle(s);if(d.borderRadius&&d.borderRadius!=="0px")return console.log("[PromptExtractor] Found container via textarea parent"),s;s=s.parentElement,u++}}return console.log("[PromptExtractor] Could not find input container"),null}function G(){if(document.getElementById("pe-styles"))return;const o=document.createElement("style");o.id="pe-styles",o.textContent=O,document.head.appendChild(o)}function F(){const o=document.createElement("div");o.id="pe-zone1",o.className="pe-zone1";const r=document.createElement("button");r.id="pe-extract-btn",r.className="pe-zone1-btn extract",r.textContent="Extract",r.title="Extract raw prompts",r.onclick=s=>{s.preventDefault(),s.stopPropagation(),b("raw",r)},o.appendChild(r);const e=document.createElement("button");return e.id="pe-summarize-btn",e.className="pe-zone1-btn summarize",e.textContent="Summarise",e.title="AI-powered summary",e.onclick=s=>{s.preventDefault(),s.stopPropagation(),b("summary",e)},o.appendChild(e),o}function Z(){const o=document.getElementById("pe-zone1");if(!o||document.getElementById("pe-paste-btn"))return;const r=document.createElement("button");r.id="pe-paste-btn",r.className="pe-zone1-btn paste",r.textContent="Paste",r.title="Paste copied prompts",r.onclick=e=>{e.preventDefault(),e.stopPropagation(),Q()},o.appendChild(r)}function H(){const o=document.getElementById("pe-paste-btn");o&&o.remove()}function Q(){if(!f)return;const o=document.querySelector("textarea"),r=document.querySelector('[contenteditable="true"]');if(o){const e=o.selectionStart||0,s=o.selectionEnd||0,u=o.value;o.value=u.substring(0,e)+f+u.substring(s),o.selectionStart=o.selectionEnd=e+f.length,o.dispatchEvent(new Event("input",{bubbles:!0})),o.focus()}else r&&(r.focus(),document.execCommand("insertText",!1,f));f=null,H()}function y(){if(document.getElementById("pe-zone1")||!g)return;const o=D();if(!o){console.log("[PromptExtractor] Could not find input container");return}G(),o.classList.add("pe-has-zone1");const r=F();o.appendChild(r),console.log("[PromptExtractor] Zone 1 buttons injected")}async function b(o,r){const e=r.textContent;r.classList.add("loading"),r.innerHTML=`
    <svg class="pe-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
    </svg>
    ${o==="raw"?"Extracting...":"Summarising..."}
  `;try{const s=E(),u=S(s);chrome.runtime.sendMessage({action:"EXTRACTION_FROM_PAGE",result:u,mode:o})}catch(s){console.error("[PromptExtractor] Error:",s)}finally{setTimeout(()=>{r.classList.remove("loading"),r.textContent=e},500)}}function X(){const o=document.getElementById("pe-zone1");o&&o.remove();const r=document.getElementById("pe-styles");r&&r.remove()}function j(){let o=0;const r=30,e=()=>{document.getElementById("pe-zone1")||(y(),!document.getElementById("pe-zone1")&&o<r&&(o++,setTimeout(e,500)))};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):setTimeout(e,500),setInterval(()=>{!document.getElementById("pe-zone1")&&g&&y()},2e3)}chrome.runtime.onMessage.addListener((o,r,e)=>{switch(console.log("[PromptExtractor] Received message:",o.action),o.action){case"EXTRACT_PROMPTS":{const s=E(),u=S(s);chrome.runtime.sendMessage({action:"EXTRACTION_RESULT",result:u}),e({success:!0,promptCount:s.length});break}case"GET_STATUS":{e({action:"STATUS_RESULT",supported:!!g,platform:x});break}case"TOGGLE_BUTTONS":{o.visible?y():X(),e({success:!0});break}case"CONTENT_COPIED":{f=o.content,Z(),e({success:!0});break}default:e({success:!1,error:"Unknown action"})}return!0});chrome.runtime.sendMessage({action:"STATUS_RESULT",supported:!!g,platform:x});j();
