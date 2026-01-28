var y=Object.defineProperty;var v=(t,n,e)=>n in t?y(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e;var f=(t,n,e)=>v(t,typeof n!="symbol"?n+"":n,e);import{h as P,i as b}from"./chunks/firebase-BtGqSOc4.js";class x{constructor(n){f(this,"state","CLOSED");f(this,"failures",0);f(this,"lastFailureTime",0);f(this,"successCount",0);f(this,"config");this.config=n}async execute(n){if(this.state==="OPEN")if(Date.now()-this.lastFailureTime>this.config.resetTimeout)this.state="HALF_OPEN",console.log("[CircuitBreaker] Attempting recovery (HALF_OPEN)");else throw new Error("Service temporarily unavailable - please try again");try{const e=await n();return this.onSuccess(),e}catch(e){throw this.onFailure(),e}}onSuccess(){this.failures=0,this.state==="HALF_OPEN"&&(this.successCount++,this.successCount>=2&&(this.state="CLOSED",this.successCount=0,console.log("[CircuitBreaker] Service recovered (CLOSED)")))}onFailure(){this.failures++,this.lastFailureTime=Date.now(),this.successCount=0,this.failures>=this.config.failureThreshold&&(this.state="OPEN",console.error(`[CircuitBreaker] Circuit OPEN after ${this.failures} failures`))}isHealthy(){return this.state==="CLOSED"}}const k={maxRetries:3,initialDelay:1e3,maxDelay:1e4,backoffMultiplier:2},U={failureThreshold:5,resetTimeout:6e4},D=new x(U);async function w(t,n=k,e=1){try{return await t()}catch(r){if(r.status===429||r.status===401||r.status===403)throw r;if(e>=n.maxRetries)throw console.error(`[Retry] All ${n.maxRetries} attempts failed`),r;const s=Math.min(n.initialDelay*Math.pow(n.backoffMultiplier,e-1),n.maxDelay);return console.warn(`[Retry] Attempt ${e}/${n.maxRetries} - waiting ${s}ms`),await new Promise(i=>setTimeout(i,s)),w(t,n,e+1)}}async function M(t,n={},e=3e4){const r=new AbortController,s=setTimeout(()=>r.abort(),e);try{const i=await fetch(t,{...n,signal:r.signal});return clearTimeout(s),i}catch(i){throw clearTimeout(s),i.name==="AbortError"?new Error(`Request timeout after ${e/1e3}s`):i}}async function F(t,n={}){return D.execute(async()=>w(async()=>{const e=await M(t,n);if(!e.ok&&e.status>=500){const r=new Error(`Server error: ${e.status}`);throw r.status=e.status,r}return e}))}const _="https://tai-backend.amaravadhibharath.workers.dev",W=`[INTENT COMPILATION PROTOCOL v4.0 - ENTERPRISE]

CORE DIRECTIVE: Compile user intent into an actionable specification.
PHILOSOPHY: Include everything. Assume nothing. Resolve confusion.

═══════════════════════════════════════════════════════════════════════════════
SECTION A: OUTPUT FORMAT
═══════════════════════════════════════════════════════════════════════════════

A1. FINAL STATE ONLY
- Output the resolved state of all requirements
- No temporal language: "initially", "later", "then", "changed to"
- No conversation narration
✗ "User first wanted blue, then green"
✓ "Color: green"

A2. SPECIFICATION FORMAT
- Output reads as a product specification
- Self-contained: executable by another person/AI
- No conversation references: "as discussed", "user said"

A3. STRUCTURAL COHERENCE
- Reads as if written once, not stitched
- Logical grouping by topic
- Professional, neutral language

═══════════════════════════════════════════════════════════════════════════════
SECTION B: ZERO INFORMATION LOSS (CRITICAL)
═══════════════════════════════════════════════════════════════════════════════

B1. INCLUDE EVERYTHING
- Every noun, constraint, requirement mentioned ONCE must appear
- Single mentions are equally important as repeated ones
- When in doubt: INCLUDE

B2. MULTIPLE OPTIONS = INCLUDE ALL
- "Make it blue" + "also consider green" = BOTH colors
- Never pick one when multiple are mentioned
- Never assume which is preferred
✓ "Colors: blue, green (both mentioned)"

B3. DEDUPLICATION
- Identical statements → merge into ONE complete version
- Keep the most complete/specific version
- Never shorten at cost of meaning

B4. NEGATIVE CONSTRAINTS
- Preserve exactly: "no", "don't", "never", "avoid", "without"
✓ "No gradients", "Avoid localStorage", "Don't use third-party"

B5. PRIORITY INDICATORS
- Preserve: "critical", "important", "must", "essential", "priority"
✓ "Performance is critical"

═══════════════════════════════════════════════════════════════════════════════
SECTION C: CONFLICT RESOLUTION
═══════════════════════════════════════════════════════════════════════════════

C1. TRUE CONFLICTS ONLY
- Same attribute, mutually exclusive values = conflict
- "Make blue" → "Make green" (can't be both) = latest wins
- "Make blue" → "add green accents" (can coexist) = include both

C2. LATEST WINS (FOR TRUE CONFLICTS)
- Latest explicit instruction takes precedence
- Remove earlier conflicting instruction completely

C3. SPECIFICITY OVERRIDE
- Specific overrides generic
- "Make colorful" → "Use blue and white only" = "Blue and white only"

C4. USER OVER AI
- User instructions override AI suggestions

═══════════════════════════════════════════════════════════════════════════════
SECTION D: INTERPRETATION
═══════════════════════════════════════════════════════════════════════════════

D1. IMPLICIT ACCEPTANCE
- Continued work without rejection = acceptance
- "yes", "ok", "do that" = confirmation

D2. INFORMAL TO FORMAL
- Convert casual language to specifications
✗ "The kid is class 5 I think"
✓ "Class level: 5"

D3. FILLER REMOVAL
- Remove: "I think", "maybe", "let's try"
- KEEP the intent within
✗ "I think we need auth" → remove entirely
✓ "I think we need auth" → "Authentication required"

D4. NO INFERENCE
- Never add information not stated
- If not mentioned, do not include

═══════════════════════════════════════════════════════════════════════════════
SECTION E: EDGE CASES
═══════════════════════════════════════════════════════════════════════════════

E1. HYPOTHETICALS → INCLUDE
- "What if we add X?" = Include X as requirement
- User mentioned it = it's relevant
✓ "What if we add dark mode?" → "Dark mode"

E2. RHETORICAL QUESTIONS → EXCLUDE
- "Why would anyone need that?" = NOT a requirement
- Rhetorical = exclude from output

E3. CODE BLOCKS → PRESERVE EXACTLY
- Content in \`\`\` or \` = preserve verbatim
- No summarization of code
- No modification of code
✓ Keep exactly as written

E4. DOUBLE NEGATIVES → RESOLVE
- Resolve to clear positive/negative
- "Don't avoid images" → "Use images"
- "Not without auth" → "Requires authentication"

E5. EXTERNAL REFERENCES → FLAG
- "Like that doc I shared" = reference outside context
- Flag: [EXTERNAL: referenced content not available]
- Do not infer content

E6. INCOMPLETE INFO → INCLUDE AS-IS
- "Add payment" (no provider specified)
✓ "Payment integration"
✗ "Payment via Stripe" (never mentioned)

E7. ENUMERATED LISTS → PRESERVE ALL
- Keep list structure
- Keep ALL items
- Only dedupe within list

═══════════════════════════════════════════════════════════════════════════════
SECTION F: VALIDATION
═══════════════════════════════════════════════════════════════════════════════

□ Every unique requirement preserved?
□ All negative constraints included?
□ Multiple options = all included?
□ Code blocks preserved exactly?
□ No assumptions made?
□ Executable by another person/AI?

═══════════════════════════════════════════════════════════════════════════════

SummarAI compiles intent. It does not summarize conversations.

[END PROTOCOL v4.0]
`,$=[/^(ok|okay|yes|no|sure|thanks|thank you|got it|alright|right|yep|nope|cool|great|perfect|nice|good|fine|understood)\.?$/i,/^(please|pls|plz)$/i,/^(hi|hello|hey|hii)\.?$/i];function g(t){return t.toLowerCase().trim().replace(/\s+/g," ").replace(/[^\w\s]/g,"")}function A(t,n){const e=g(t),r=g(n);if(e===r)return 1;if(e.length===0||r.length===0)return 0;if(e.includes(r)||r.includes(e)){const a=Math.min(e.length,r.length),d=Math.max(e.length,r.length);return a/d}const s=new Set(e.split(" ").filter(a=>a.length>2)),i=new Set(r.split(" ").filter(a=>a.length>2));if(s.size===0||i.size===0)return 0;let l=0;return s.forEach(a=>{i.has(a)&&l++}),l/Math.max(s.size,i.size)}function R(t){const n=t.trim();return n.length>50?!1:$.some(e=>e.test(n))}function N(t){return t.trim().replace(/\n{3,}/g,`

`).replace(/[ \t]+/g," ").replace(/^\s*\n/gm,"")}function z(t){if(t.length===0)return[];if(t.length===1)return[{content:N(t[0].content),originalIndex:0}];const n=[],e=new Set,r=new Set,s=[];for(let o=0;o<t.length;o++){const u=g(t[o].content);!e.has(u)&&t[o].content.trim().length>0&&(e.add(u),s.push({prompt:t[o],index:o}))}const i=[];for(const o of s){let u=!1;for(const m of i)if(A(o.prompt.content,m.prompt.content)>.85){if(o.prompt.content.length>m.prompt.content.length){const h=i.indexOf(m);i[h]=o}u=!0;break}u||i.push(o)}const l=i.filter(o=>!R(o.prompt.content)&&o.prompt.content.length>20).length;for(const o of i)R(o.prompt.content)&&l>3&&o.prompt.content.length<20||r.has(o.index)||(r.add(o.index),n.push({content:N(o.prompt.content),originalIndex:o.index}));const a=[];let d=0;for(;d<n.length;){const o=n[d],u=[o.originalIndex];let m=o.content,h=d+1;for(;h<n.length;){const c=n[h],C=A(o.content,c.content);if(C>.6&&C<.95&&c.content.length>o.content.length*.3){const L=new Set(g(m).split(" "));g(c.content).split(" ").filter(O=>!L.has(O)&&O.length>2).length>0&&(m=m+" [Update: "+c.content+"]",u.push(c.originalIndex)),h++}else break}a.push({content:m,originalIndex:o.originalIndex,merged:u.length>1?u:void 0}),d=h>d+1?h:d+1}return console.log(`[Filter] ${t.length} → ${a.length} prompts (${Math.round((1-a.length/t.length)*100)}% reduction)`),a}class B{async summarize(n,e={}){try{const r=z(n),s=r.map((a,d)=>`${d+1}. ${a.content}`).join(`

`);console.log(`[AISummarizer] Sending ${s.length} chars (from ${n.length} prompts, filtered to ${r.length})`);const i=await F(_,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:s,additionalInfo:W,provider:"auto",options:{format:e.format||"paragraph",tone:e.tone||"normal",includeAI:e.includeAI||!1,mode:"consolidate"}})});if(!i.ok){const a=await i.json();throw new Error(a.error||`Worker Error: ${i.status}`)}const l=await i.json();if(!l.summary||l.summary.trim().length===0)throw new Error("AI returned an empty summary.");return{original:n,summary:l.summary,promptCount:{before:n.length,after:r.length}}}catch(r){throw console.error("[AISummarizer] Error:",r),r}}}const q=new B;async function X(){console.log("[AISummarizer] Using Cloudflare Worker backend with smart filtering")}console.log("[PromptExtractor] Service worker started");X();const T=new Set;let I=null;chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:!0});chrome.runtime.onConnect.addListener(t=>{t.name==="sidepanel"&&(console.log("[PromptExtractor] Side panel connected"),T.add(t),I&&t.postMessage({action:"EXTRACTION_RESULT",result:I}),t.onMessage.addListener(n=>{H(n)}),t.onDisconnect.addListener(()=>{console.log("[PromptExtractor] Side panel disconnected"),T.delete(t)}))});let p=null;chrome.runtime.onMessage.addListener((t,n,e)=>{var r;switch(console.log("[PromptExtractor] Received message:",t.action),t.action){case"EXTRACTION_FROM_PAGE":{const{result:s,mode:i}=t;I=s,p={result:s,mode:i};const l=(r=n.tab)==null?void 0:r.windowId;l&&chrome.sidePanel.open({windowId:l}).then(()=>{console.log("[PromptExtractor] Side panel opened"),setTimeout(()=>{p&&(E({action:"EXTRACTION_FROM_PAGE_RESULT",result:p.result,mode:p.mode}),p=null)},500)}).catch(a=>{console.error("[PromptExtractor] Error opening side panel:",a)}),e({success:!0});break}case"EXTRACTION_RESULT":{const s=t.result;I=s,E({action:"EXTRACTION_RESULT",result:s}),e({success:!0});break}case"STATUS_RESULT":{E(t),e({success:!0});break}case"SAVE_SESSION_PROMPTS":{const{prompts:s,platform:i}=t,l=new Date().toISOString().split("T")[0],a=`keylog_${i}_${l}`;chrome.storage.local.get([a],d=>{const o=d[a]||[],u=[...o],m=new Set(o.map(c=>c.content));for(const c of s)m.has(c.content)||(u.push(c),m.add(c.content));chrome.storage.local.set({[a]:u});const h=b();h&&P(h,i,s.map(c=>({content:c.content,timestamp:c.timestamp,conversationId:c.conversationId||"unknown",platform:i})))}),e({success:!0});break}default:e({success:!1,error:"Unknown action"})}return!0});async function H(t){switch(console.log("[PromptExtractor] Side panel message:",t.action),t.action){case"EXTRACT_PROMPTS":{const n=t.mode,[e]=await chrome.tabs.query({active:!0,currentWindow:!0});e!=null&&e.id&&chrome.tabs.sendMessage(e.id,{action:"EXTRACT_PROMPTS",mode:n});break}case"GET_STATUS":{S();break}case"SUMMARIZE_PROMPTS":{const n=t.prompts;try{const e=await q.summarize(n);E({action:"SUMMARY_RESULT",result:e,success:!0})}catch(e){console.error("[PromptExtractor] Summarization error:",e),E({action:"SUMMARY_RESULT",result:{original:n,summary:n.map(r=>r.content).join(`

---

`),promptCount:{before:n.length,after:n.length}},success:!1,error:e instanceof Error?e.message:"Summarization failed"})}break}}}function E(t){T.forEach(n=>{try{n.postMessage(t)}catch(e){console.error("[PromptExtractor] Error sending to side panel:",e),T.delete(n)}})}chrome.runtime.onInstalled.addListener(async t=>{if(console.log("[PromptExtractor] Extension installed:",t.reason),t.reason==="install"){const{hasSeenWelcome:n}=await chrome.storage.local.get("hasSeenWelcome");n||(chrome.tabs.create({url:"welcome.html"}),chrome.storage.local.set({hasSeenWelcome:!0}))}});chrome.tabs.onActivated.addListener(()=>{S()});chrome.tabs.onUpdated.addListener((t,n,e)=>{n.status==="complete"&&e.active&&S()});async function S(){try{const[t]=await chrome.tabs.query({active:!0,currentWindow:!0});if(!(t!=null&&t.id))return;if(!t.url||t.url.startsWith("chrome://")||t.url.startsWith("edge://")||t.url.startsWith("about:")){E({action:"STATUS_RESULT",supported:!1,platform:null});return}const n=V(t.url);n&&E({action:"STATUS_RESULT",supported:!0,platform:n}),chrome.tabs.sendMessage(t.id,{action:"GET_STATUS"},e=>{chrome.runtime.lastError?n||E({action:"STATUS_RESULT",supported:!1,platform:null}):e&&E(e)})}catch(t){console.error("[PromptExtractor] Error checking tab status:",t)}}function V(t){try{const e=new URL(t).hostname;return e.includes("chatgpt.com")||e.includes("openai.com")?"chatgpt":e.includes("claude.ai")?"claude":e.includes("gemini.google.com")?"gemini":e.includes("perplexity.ai")?"perplexity":e.includes("deepseek.com")?"deepseek":e.includes("lovable.dev")?"lovable":e.includes("bolt.new")?"bolt":e.includes("cursor.sh")||e.includes("cursor.com")?"cursor":e.includes("meta.ai")?"meta-ai":null}catch{return null}}
