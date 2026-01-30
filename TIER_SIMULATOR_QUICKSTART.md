# 🎯 TIER SIMULATOR - QUICK START

## ✅ What's Done

1. ✅ Your account (`bharathamaravadi@gmail.com`) is now **ADMIN**
2. ✅ Tier simulator added to Settings panel (admin-only)
3. ✅ Can test all 6 tiers: Guest, Free, Go, Pro, Infi, Admin
4. ✅ Extension built and ready to test

## 🚀 How to Test

### Step 1: Load Extension
```bash
1. Open Chrome
2. Go to chrome://extensions
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select: /Users/bharathamaravadi/Desktop/sauce/prompt-extractor/dist
```

### Step 2: Sign In as Admin
```
1. Click extension icon
2. Click profile avatar (bottom left)
3. Sign in with Google
4. Your account will show "Admin" badge ✅
```

### Step 3: Open Tier Simulator
```
1. Click Settings icon (gear, bottom right)
2. Scroll to "🔧 Debug: Tier Simulator"
3. Select any tier from dropdown
```

### Step 4: Test Each Tier

#### 🔘 Guest
- Gray badge
- No user info
- "Sign in with Google" button

#### 🔵 Free  
- Blue badge
- Shows name & email
- "Upgrade to Go" button
- Quota: 10

#### 🟣 Go
- Purple badge
- Shows name & email
- "Upgrade to Pro" button
- Quota: 25

#### 🟡 Pro
- Gold badge
- Shows name & email
- "Upgrade to Infi" button
- Quota: 100

#### 🌈 Infi
- Rainbow badge
- Shows name & email
- "⚡ Priority Support"
- Quota: 999

#### 🔴 Admin
- Red/orange badge
- Shows name & email
- "🔧 No Limits"
- Quota: 999
- Access to tier simulator

## 📸 What to Check

For each tier, verify:
- ✅ Badge color matches tier
- ✅ Correct upgrade prompt or perk message
- ✅ Profile popup updates instantly
- ✅ Tier name displays correctly

## 🎨 Visual Guide

See the generated images:
1. `tier_simulator_guide.png` - All 6 tier cards
2. `settings_tier_simulator.png` - Settings panel with simulator

## 🐛 Debug Features

When simulating a tier:
```
⚠️ Simulating [tier] tier for testing
```
This warning appears in Settings to remind you it's a simulation.

## 🔄 Reset to Real Tier

Select "Admin (Real)" from the dropdown to return to your actual admin tier.

## 📝 Notes

- Tier simulator is **ONLY visible to admin users**
- Changes are instant - no page reload needed
- Simulation is UI-only (doesn't affect backend quotas)
- Perfect for testing upgrade flows and UI states

---

**Ready to test!** 🎉

Just reload the extension and start cycling through tiers!
