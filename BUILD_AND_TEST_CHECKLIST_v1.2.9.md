# v1.2.9 Build and Testing Checklist

**Status**: Code Implementation Complete ✅
**Next Phase**: Build & Testing
**Date**: January 29, 2026

---

## Pre-Build Verification

- [x] Code changes implemented in `src/content/adapters/lovable.ts`
- [x] New method `isUserPrompt()` added (33 lines)
- [x] Updated method `scrapePrompts()` with filtering (44 lines)
- [x] TypeScript syntax verified
- [x] Logic flow verified
- [x] Documentation created
- [x] Version incremented to v1.2.9

---

## Build Phase

### Step 1: Network Access
```bash
# Check npm registry access
npm ping

# If blocked: Try alternative registry
npm config set registry https://registry.yarnpkg.com/
```

**Status**: ⏳ Blocked (network restriction)

### Step 2: Build Command
```bash
cd /sessions/focused-gifted-volta/mnt/prompt-extractor
npm run build
```

**Expected Output**:
```
$ vite build
✓ built in XXs

$ vite build --config vite.content.config.ts
✓ built in XXs

Build completed successfully
```

**Status**: 🔴 Pending (awaiting network access)

### Step 3: Verify Build Artifacts
```bash
ls -la dist/
# Should contain:
# - manifest.json
# - popup.js
# - sidepanel.js
# - content.js
# - background.js
```

**Status**: 🔴 Pending

---

## Testing Phase

### Test 1: Load Extension in Chrome

**Steps**:
1. Open Chrome
2. Navigate to `chrome://extensions`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select `/sessions/focused-gifted-volta/mnt/prompt-extractor/dist/` folder
6. Wait for "Extension installed successfully"

**Expected**: ✅ Extension appears in list with blue icon

**Status**: 🔴 Pending

### Test 2: Lovable Extraction Test (Primary)

**Setup**:
1. Go to https://lovable.dev
2. Open the OrnAI conversation (conversation with 20+ messages)
3. Open browser DevTools (F12)
4. Go to Console tab

**Test Steps**:
1. Click "Extract" button in SahAI extension
2. Wait for extraction to complete
3. Check extension results panel
4. Review browser console logs

**Expected Results**:

**Console Output**:
```
[SahAI] Lovable Extraction Engine starting (v1.2.9 - DOM-filtered)...
[SahAI] Found 40 total prose elements
[SahAI] Skipped (AI response): "Yes, the generated image is free from..."
[SahAI] Skipped (AI response): "Great! Let me create a jewelry photo..."
[SahAI] User prompt extracted: "is the generated person free from copyrights?..."
[SahAI] User prompt extracted: "make the person facing right side..."
[SahAI] User prompt extracted: "remove the ring from the wrist..."
... (more user prompts)
[SahAI] Total user prompts extracted: 21
```

**Results Panel**:
- Total items: 21
- All items should be user questions
- No AI responses in the list
- Text should be clean (no "Great!", "Done!", etc.)

**Acceptance Criteria**:
- [ ] Exactly 21 items extracted (or close, allowing ±1 variation)
- [ ] 0 AI responses in output (no "Yes, the", "Great!", "Done!", etc.)
- [ ] All items are user prompts
- [ ] Console shows filtering logs
- [ ] No errors in console

**Status**: 🔴 Pending

### Test 3: Chat Platform Regression Tests

#### Test 3A: ChatGPT Extraction
**Steps**:
1. Go to https://chat.openai.com
2. Open any conversation
3. Click Extract button
4. Verify extraction works (8+ items expected)
5. Check for errors

**Expected**: ✅ ChatGPT extraction still works

**Status**: 🔴 Pending

#### Test 3B: Google Gemini Extraction
**Steps**:
1. Go to https://gemini.google.com
2. Open any conversation
3. Click Extract button
4. Verify extraction works (8+ items expected)
5. Check for errors

**Expected**: ✅ Gemini extraction still works

**Status**: 🔴 Pending

#### Test 3C: Claude Extraction
**Steps**:
1. Go to https://claude.ai
2. Open any conversation
3. Click Extract button
4. Verify extraction works (8+ items expected)
5. Check for errors

**Expected**: ✅ Claude extraction still works

**Status**: 🔴 Pending

### Test 4: UI Display Verification (Lovable-Specific)

**Steps**:
1. Extract from Lovable conversation
2. Check results display in extension panel
3. Verify formatting

**Expected Formatting**:
- Prompts right-aligned with blue background (Lovable style)
- Blue index numbers on left
- Proper text wrapping
- Readable formatting

**Status**: 🔴 Pending

### Test 5: Edge Cases

#### Edge Case 1: Very Long Prompts
**Test**: Extract conversation with prompts >500 characters

**Expected**: ✅ Extracted correctly, not truncated

**Status**: 🔴 Pending

#### Edge Case 2: Prompts with Special Characters
**Test**: Prompts with emoji, unicode, HTML entities

**Expected**: ✅ Text preserved correctly

**Status**: 🔴 Pending

#### Edge Case 3: Multiple Conversations
**Test**: Extract from different Lovable conversations

**Expected**: ✅ Same accuracy, no cross-contamination

**Status**: 🔴 Pending

---

## Performance Testing

### Metrics to Check

**Extraction Speed**:
- [ ] 40 elements extracted in <2 seconds
- [ ] No console warnings/errors
- [ ] Extension responsive during extraction

**Memory Usage**:
- [ ] No memory leaks detected
- [ ] Extension memory footprint <50MB
- [ ] Chrome DevTools shows normal memory graph

**Status**: 🔴 Pending

---

## Documentation Verification

- [x] LOVABLE_v1.2.9_FILTERED_EXTRACTION.md created
- [x] IMPLEMENTATION_SUMMARY_v1.2.9.md created
- [x] VERSION_COMPARISON_v1.2.7_v1.2.8_v1.2.9.md created
- [x] LOVABLE_v1.2.9_IMPLEMENTATION.ts saved
- [x] Code comments updated

**Status**: ✅ Complete

---

## Success Criteria Checklist

### Must Have (Required for v1.2.9 Release)
- [ ] Build succeeds without errors
- [ ] Lovable extraction shows 21 items (user prompts only)
- [ ] 0 AI responses in output (no "Great!", "Done!", etc.)
- [ ] Console shows filtering logs
- [ ] ChatGPT extraction still works
- [ ] Gemini extraction still works
- [ ] Claude extraction still works

### Should Have (Highly Desirable)
- [ ] Extraction completes in <2 seconds
- [ ] No JavaScript errors in console
- [ ] UI displays correctly (right-aligned)
- [ ] Edge cases handled properly
- [ ] Memory footprint normal

### Nice to Have (Optional Improvements)
- [ ] Add metrics to console (items found vs extracted)
- [ ] Add timing information
- [ ] Add status bar showing progress

---

## Rollback Plan

If v1.2.9 has issues:

**Option A: Revert to v1.2.8**
```bash
git checkout HEAD~1  # Revert one commit
npm run build
```

**Option B: Revert to v1.2.7**
```bash
git checkout HEAD~2  # Revert two commits
npm run build
```

**Option C: Disable Lovable adapter**
```typescript
// In src/sidepanel/PromptsList.tsx
// Comment out LovableAdapter import
// Users will see: "Platform not supported"
```

---

## Deployment Timeline

### Phase 1: Build (Estimated 5 mins)
```
npm run build → Creates /dist folder with compiled files
```

### Phase 2: Local Testing (Estimated 30 mins)
```
Load in Chrome → Test on Lovable → Verify console output
```

### Phase 3: Regression Testing (Estimated 20 mins)
```
ChatGPT + Gemini + Claude → Verify no breakage
```

### Phase 4: Edge Case Testing (Estimated 20 mins)
```
Long prompts, special chars, multiple conversations
```

### Phase 5: Documentation Update (Estimated 10 mins)
```
Update README, changelog, version numbers
```

### Phase 6: Production Deployment (Estimated 5 mins)
```
Submit to Chrome Web Store
```

**Total Estimated Time**: ~90 minutes

---

## Issues and Resolutions

### Known Issues
None at this time

### Potential Issues and Solutions

#### Issue 1: npm build fails with "rollup" error
**Solution**:
```bash
npm ci  # Clean install
npm run build
```

#### Issue 2: Extension doesn't load in Chrome
**Solution**:
1. Check manifest.json is valid JSON
2. Check file permissions: `chmod -R 755 dist/`
3. Refresh extension in chrome://extensions

#### Issue 3: Lovable extraction shows 0 items
**Solution**:
1. Verify `deepQuerySelectorAll()` exists in base.ts
2. Check console for errors (F12)
3. Verify prose elements exist in DOM (Inspect element)

#### Issue 4: Lovable extraction shows all 40 items (mixed)
**Solution**:
1. Verify `isUserPrompt()` method exists
2. Check console logs for filtering
3. Verify `whitespace-normal` class detection working

#### Issue 5: ChatGPT/Gemini/Claude extraction broken
**Solution**:
1. Changes only affect Lovable adapter
2. Other adapters unchanged
3. If broken: revert from git

---

## Sign-Off

### Developer Verification
- [x] Code implemented and verified
- [x] No TypeScript errors
- [x] Logic flow correct
- [x] Documentation complete
- [ ] Build successful (pending)
- [ ] Testing complete (pending)

### QA Verification
- [ ] All tests passed
- [ ] Edge cases handled
- [ ] Performance acceptable
- [ ] No regressions detected
- [ ] Ready for production

### Deployment Approval
- [ ] Technical review passed
- [ ] Security review passed
- [ ] User acceptance verified
- [ ] Ready for Chrome Web Store

---

## Post-Deployment

### Monitoring
- Monitor Chrome Web Store reviews for issues
- Check error logs for v1.2.9 problems
- Track user feedback

### Metrics
- Measure extraction accuracy
- Track performance metrics
- Monitor error rates

### Future Improvements
- [ ] Add unit tests for isUserPrompt()
- [ ] Add integration tests for Lovable extraction
- [ ] Performance optimization if needed
- [ ] Support for other AI platforms

---

## Summary

✅ **v1.2.9 Code Implementation Complete**

🔴 **Build Phase**: Blocked (network access needed)
🔴 **Testing Phase**: Pending build completion
🔴 **Deployment Phase**: After successful testing

**Expected Outcome**:
- 21 user prompts extracted from Lovable
- 0 AI responses mixed in
- 99%+ accuracy
- Zero regressions on other platforms

**Status**: Ready for build when network access available
