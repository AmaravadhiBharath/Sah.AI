# 🔧 Tier Simulator - Debug Feature

## Overview
A debug feature that allows admin users to simulate different tier levels for UI testing purposes.

## What Was Added

### 1. **Admin Override in Firebase** (`src/services/firebase.ts`)
```typescript
// Hardcoded admin override for developer account
const adminEmails = [
  'bharathamaravadi@gmail.com',
  'bharath.amaravadi@gmail.com'
];

if (adminEmails.includes(email.toLowerCase().trim())) {
  console.log('[Firebase] Admin access granted for:', email);
  return 'admin';
}
```

### 2. **Tier Simulator State** (`src/sidepanel/App.tsx`)
```typescript
// Debug: Tier simulator (only for admin users)
const [debugTierOverride, setDebugTierOverride] = useState<UserTier | null>(null);
const displayTier = debugTierOverride || tier;
```

### 3. **Settings Panel Controls**
Added a new section in the Settings modal that only appears for admin users:

```
🔧 Debug: Tier Simulator
[Dropdown: Guest | Free | Go | Pro | Infi | Admin (Real)]

⚠️ Simulating [selected tier] tier for testing
```

## How to Use

### Step 1: Sign In
1. Open the extension
2. Click on your profile avatar (bottom left)
3. Sign in with Google using `bharathamaravadi@gmail.com`
4. Your account will automatically show as **Admin** tier

### Step 2: Access Tier Simulator
1. Click the **Settings** icon (gear icon, bottom right)
2. You'll see a new section: **🔧 Debug: Tier Simulator**
3. This section ONLY appears for admin users

### Step 3: Simulate Different Tiers
Select from the dropdown to test each tier:

#### **Guest Tier**
- Shows "Guest" badge
- No user info displayed
- "Sign in with Google" button shown

#### **Free Tier**
- Shows "Free" badge
- User name and email displayed
- "Upgrade to Go" button shown
- Limited quota (10 extractions)

#### **Go Tier**
- Shows "Go" badge  
- User name and email displayed
- "Upgrade to Pro" button shown
- Medium quota (25 extractions)

#### **Pro Tier**
- Shows "Pro" badge
- User name and email displayed
- "Upgrade to Infi" button shown
- High quota (100 extractions)

#### **Infi Tier**
- Shows "Infi" badge
- User name and email displayed
- "⚡ Priority Support" message
- Very high quota (999 extractions)

#### **Admin (Real)**
- Shows "Admin" badge
- User name and email displayed
- "🔧 No Limits" message
- Unlimited quota (999 extractions)
- Access to tier simulator

## Visual Changes

### Profile Popup
The profile popup will update in real-time to show:
- The simulated tier badge with appropriate styling
- Tier-specific upgrade prompts or perks
- Correct tier colors (each tier has its own color scheme)

### Warning Indicator
When simulating a tier different from your real tier, you'll see:
```
⚠️ Simulating [tier name] tier for testing
```

## Testing Scenarios

### Test 1: Guest Experience
1. Set simulator to "Guest"
2. Check profile shows guest badge
3. Verify sign-in prompt appears

### Test 2: Free User Journey
1. Set simulator to "Free"
2. Check "Upgrade to Go" button appears
3. Verify quota limits are displayed correctly

### Test 3: Tier Progression
1. Cycle through: Free → Go → Pro → Infi
2. Verify upgrade prompts change appropriately
3. Check tier badge colors update

### Test 4: Premium Features
1. Set to "Infi"
2. Verify "Priority Support" message shows
3. Check quota is set to 999

### Test 5: Admin Features
1. Set back to "Admin (Real)"
2. Verify "No Limits" message shows
3. Confirm tier simulator is still accessible

## Technical Details

### Files Modified
1. `src/services/firebase.ts` - Added admin email override
2. `src/services/auth.ts` - Removed unused import
3. `src/sidepanel/App.tsx` - Added tier simulator UI and logic

### State Management
- `debugTierOverride`: Stores the simulated tier (null = use real tier)
- `displayTier`: Computed value used throughout UI (override || real tier)
- Changes to simulator immediately update all UI elements

### Styling
- Tier simulator uses accent color (`--accent-color`) for visibility
- Warning message uses orange background for attention
- Dividers separate debug section from normal settings

## Benefits

✅ **No Firebase Changes Needed** - Test all tiers without database updates  
✅ **Instant Switching** - Change tiers in real-time  
✅ **Admin Only** - Feature hidden from regular users  
✅ **Visual Feedback** - Clear indication when simulating  
✅ **Complete Coverage** - Test all 6 tier levels  

## Next Steps

After testing all tiers, you can:
1. Take screenshots of each tier for documentation
2. Verify all upgrade prompts work correctly
3. Test quota limits for each tier
4. Ensure tier badges display with correct colors
5. Validate the entire user journey from guest to admin

---

**Built with ❤️ for debugging and testing**
