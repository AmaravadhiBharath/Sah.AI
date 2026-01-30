# 🔍 Lovable DOM Debug - Instructions

**Goal**: Get detailed DOM structure information to fix the extraction

---

## Step 1: Build the Extension with Debug Code

```bash
npm run build
```

---

## Step 2: Open Lovable Conversation

1. Go to https://lovable.dev
2. Open ANY conversation (preferably one with 10+ messages)
3. Make sure you can see both user prompts (right side) and AI responses (left side)

---

## Step 3: Open DevTools Console

1. Press **F12** (or right-click → Inspect → Console tab)
2. Make sure you're in the **Console** tab

---

## Step 4: Inject Debug Script

Copy-paste this into the console and press Enter:

```javascript
// Run the debug function
debugLovableDOM();
```

---

## Step 5: Capture Output

**IMPORTANT**: The console will output detailed DOM analysis.

**Please screenshot or copy-paste the entire console output** and send it to me.

The output will look like:

```
=== LOVABLE DOM DEBUG ===

1. ALL PROSE ELEMENTS:
Found 12 prose elements

[0] "is the generated person free from copyrights?..."
    Element classes: prose prose-zinc prose-markdown-mobile max-w-full...
    Parent classes: mt-1 flex w-full gap-1 justify-end
    HTML structure:
    <div class="prose prose-zinc...">
...
```

---

## What to Look For

When the debug output runs, look for:

1. **`PromptBox_customProse` class**: Does it appear?
2. **`justify-end` class**: Does it appear in parent containers?
3. **Text content**: Is user text there?
4. **Class names**: What exact classes are used?
5. **Data attributes**: Any `data-*` attributes?
6. **ARIA roles**: Any `role="..."` attributes?

---

## Why We Need This

The current code looks for:
- `PromptBox_customProse` class ← Not found = problem
- `justify-end` container ← Not found = problem

The debug script will tell us:
- What classes ARE actually used?
- How ARE messages structured?
- What distinguishes user vs AI?

---

## Next Steps After Debug

Once I see the debug output, I'll:
1. ✅ Identify the actual DOM structure
2. ✅ Find the real user/AI distinguishing features
3. ✅ Rewrite the adapter with correct selectors
4. ✅ Test to ensure 100% extraction

---

## Example Output Format

Please send the output like this:

```
[Paste entire console output here]
```

Or take a screenshot of the console showing the debug output.

---

## Troubleshooting

**Q: "debugLovableDOM is not defined"**
A: The extension needs to be rebuilt. Run `npm run build` and reload the page.

**Q: Console is empty**
A: Make sure you're in the Console tab (not Elements, Network, etc.)

**Q: Still no output**
A: Try opening the conversation again and running the command.

---

## What NOT to Do

❌ Don't modify the code
❌ Don't send just the class names - send the FULL console output
❌ Don't assume the structure from the screenshot
✅ Send the actual DOM debug output

---

Once you send the debug output, I'll have all the information needed to fix the extraction properly! 🎯

