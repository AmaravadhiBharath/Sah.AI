import type { ScrapedPrompt, SummaryResult } from '../types';
import { resilientFetch } from './resilient-api';

// Cloudflare Worker URL - API keys stored server-side
const BACKEND_URL = 'https://tai-backend.amaravadhibharath.workers.dev';

export interface SummaryOptions {
  format?: 'paragraph' | 'points' | 'JSON' | 'XML';
  tone?: 'normal' | 'professional' | 'creative';
  includeAI?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTERPRISE CONSOLIDATION ENGINE - Intent Compilation Protocol v4.0
// ═══════════════════════════════════════════════════════════════════════════════
const CONSOLIDATION_RULES = `[INTENT COMPILATION PROTOCOL v4.0 - ENTERPRISE]

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
`;

// ═══════════════════════════════════════════════════════════════════
// SMART PRE-FILTERING - Reduce API payload without losing context
// ═══════════════════════════════════════════════════════════════════

// Common filler phrases that don't add unique info
const FILLER_PATTERNS = [
  /^(ok|okay|yes|no|sure|thanks|thank you|got it|alright|right|yep|nope|cool|great|perfect|nice|good|fine|understood)\.?$/i,
  /^(please|pls|plz)$/i,
  /^(hi|hello|hey|hii)\.?$/i,
];

// Normalize text for comparison (lowercase, trim, collapse whitespace)
function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, ''); // Remove punctuation for comparison
}

// Calculate simple similarity ratio between two strings
function similarity(a: string, b: string): number {
  const normA = normalize(a);
  const normB = normalize(b);

  if (normA === normB) return 1;
  if (normA.length === 0 || normB.length === 0) return 0;

  // Check if one contains the other
  if (normA.includes(normB) || normB.includes(normA)) {
    const shorter = Math.min(normA.length, normB.length);
    const longer = Math.max(normA.length, normB.length);
    return shorter / longer;
  }

  // Simple word overlap
  const wordsA = new Set(normA.split(' ').filter(w => w.length > 2));
  const wordsB = new Set(normB.split(' ').filter(w => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let overlap = 0;
  wordsA.forEach(w => { if (wordsB.has(w)) overlap++; });

  return overlap / Math.max(wordsA.size, wordsB.size);
}

// Check if prompt is just filler/acknowledgment
function isFillerOnly(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length > 50) return false; // Long text is not filler
  return FILLER_PATTERNS.some(pattern => pattern.test(trimmed));
}

// Clean and normalize prompt text
function cleanText(text: string): string {
  return text
    .trim()
    .replace(/\n{3,}/g, '\n\n')  // Max 2 newlines
    .replace(/[ \t]+/g, ' ')     // Collapse spaces
    .replace(/^\s*\n/gm, '');    // Remove empty lines
}

interface FilteredPrompt {
  content: string;
  originalIndex: number;
  merged?: number[];  // Indices of prompts merged into this one
}

// Main filtering function
function filterPrompts(prompts: ScrapedPrompt[]): FilteredPrompt[] {
  if (prompts.length === 0) return [];
  if (prompts.length === 1) {
    return [{ content: cleanText(prompts[0].content), originalIndex: 0 }];
  }

  const result: FilteredPrompt[] = [];
  const seen = new Set<string>();
  const usedIndices = new Set<number>();

  // Pass 1: Remove exact duplicates (keep first occurrence)
  const dedupedWithIndex: { prompt: ScrapedPrompt; index: number }[] = [];

  for (let i = 0; i < prompts.length; i++) {
    const normalized = normalize(prompts[i].content);
    if (!seen.has(normalized) && prompts[i].content.trim().length > 0) {
      seen.add(normalized);
      dedupedWithIndex.push({ prompt: prompts[i], index: i });
    }
  }

  // Pass 2: Remove near-duplicates (>85% similar)
  const uniquePrompts: { prompt: ScrapedPrompt; index: number }[] = [];

  for (const item of dedupedWithIndex) {
    let isDuplicate = false;

    for (const existing of uniquePrompts) {
      if (similarity(item.prompt.content, existing.prompt.content) > 0.85) {
        // Keep the longer one (more info)
        if (item.prompt.content.length > existing.prompt.content.length) {
          const existingIdx = uniquePrompts.indexOf(existing);
          uniquePrompts[existingIdx] = item;
        }
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      uniquePrompts.push(item);
    }
  }

  // Pass 3: Handle fillers - only remove if we have substantial content
  const substantialCount = uniquePrompts.filter(
    p => !isFillerOnly(p.prompt.content) && p.prompt.content.length > 20
  ).length;

  for (const item of uniquePrompts) {
    const isFiller = isFillerOnly(item.prompt.content);

    // Keep fillers only if: very few prompts OR filler has context (like "yes, do that")
    if (isFiller && substantialCount > 3 && item.prompt.content.length < 20) {
      continue; // Skip pure fillers when we have enough content
    }

    if (!usedIndices.has(item.index)) {
      usedIndices.add(item.index);
      result.push({
        content: cleanText(item.prompt.content),
        originalIndex: item.index,
      });
    }
  }

  // Pass 4: Merge consecutive very similar prompts (iterations/refinements)
  const merged: FilteredPrompt[] = [];
  let i = 0;

  while (i < result.length) {
    const current = result[i];
    const mergedIndices = [current.originalIndex];
    let mergedContent = current.content;

    // Look ahead for similar consecutive prompts
    let j = i + 1;
    while (j < result.length) {
      const next = result[j];
      const sim = similarity(current.content, next.content);

      // If very similar but next adds info, merge them
      if (sim > 0.6 && sim < 0.95 && next.content.length > current.content.length * 0.3) {
        // Find the unique parts of next
        const currentWords = new Set(normalize(mergedContent).split(' '));
        const nextWords = normalize(next.content).split(' ');
        const uniqueWords = nextWords.filter(w => !currentWords.has(w) && w.length > 2);

        if (uniqueWords.length > 0) {
          mergedContent = mergedContent + ' [Update: ' + next.content + ']';
          mergedIndices.push(next.originalIndex);
        }
        j++;
      } else {
        break;
      }
    }

    merged.push({
      content: mergedContent,
      originalIndex: current.originalIndex,
      merged: mergedIndices.length > 1 ? mergedIndices : undefined,
    });

    i = j > i + 1 ? j : i + 1;
  }

  console.log(`[Filter] ${prompts.length} → ${merged.length} prompts (${Math.round((1 - merged.length / prompts.length) * 100)}% reduction)`);

  return merged;
}

export class AISummarizer {
  async summarize(prompts: ScrapedPrompt[], options: SummaryOptions = {}): Promise<SummaryResult> {
    try {
      // Apply smart filtering
      const filtered = filterPrompts(prompts);

      const content = filtered
        .map((p, i) => `${i + 1}. ${p.content}`)
        .join('\n\n');

      console.log(`[AISummarizer] Sending ${content.length} chars (from ${prompts.length} prompts, filtered to ${filtered.length})`);

      const response = await resilientFetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          additionalInfo: CONSOLIDATION_RULES,
          provider: 'auto',
          options: {
            format: options.format || 'paragraph',
            tone: options.tone || 'normal',
            includeAI: options.includeAI || false,
            mode: 'consolidate',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Worker Error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.summary || data.summary.trim().length === 0) {
        throw new Error('AI returned an empty summary.');
      }

      return {
        original: prompts,  // Keep original for user display
        summary: data.summary,
        promptCount: {
          before: prompts.length,
          after: filtered.length,
        },
      };
    } catch (error) {
      console.error('[AISummarizer] Error:', error);
      throw error;
    }
  }
}

// Singleton instance
export const aiSummarizer = new AISummarizer();

// Initialize (no-op now, kept for compatibility)
export async function initializeAISummarizer(): Promise<void> {
  console.log('[AISummarizer] Using Cloudflare Worker backend with smart filtering');
}
