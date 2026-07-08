# SwipeClean - Developer Manual

**Version:** 1.4.0  
**Last Updated:** 2026  
**Purpose:** Complete guide for developing, maintaining, and extending the SwipeClean app

---

## Table of Contents

1. [App Overview](#app-overview)
2. [Main Features Documentation](#main-features-documentation)
3. [Main UI Editing Guide](#main-ui-editing-guide)
4. [Feature Management](#feature-management)
5. [Version Increment System](#version-increment-system)
6. [Rollback Guide](#rollback-guide)
7. [Developer Maintenance Guide](#developer-maintenance-guide)

---

## App Overview

### App Name and Purpose

**SwipeClean** is a mobile application designed to help users quickly clean up their photo galleries through an intuitive swipe-based interface. Users can review photos one by one and swipe left to trash or swipe right to keep them.

### Main Problem Solved

Managing large photo galleries can be overwhelming. SwipeClean solves this by:
- Providing a Tinder-like card swiping experience for photo review
- Batch deleting unwanted photos to free up storage space
- Tracking cleanup progress with session statistics
- Allowing users to undo trashed photos before permanent deletion

### Target Users

- **Primary:** Smartphone users with large photo galleries (100+ photos)
- **Secondary:** Users who want to declutter their device storage
- **Demographics:** Ages 18-45, both iOS and Android users

### Technology Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React Native | 0.81.5 | Cross-platform mobile development |
| **Platform** | Expo | ~54.0.12 | Development toolchain and build system |
| **Language** | TypeScript | ~5.9.2 | Type-safe development |
| **Navigation** | Expo Router | ~6.0.10 | File-based routing |
| **State Management** | React Context + Hooks | Built-in | Global app state |
| **Animations** | React Native Reanimated | ~4.1.1 | Smooth gesture animations |
| **Gestures** | React Native Gesture Handler | ~2.28.0 | Touch gesture handling |
| **Media** | Expo Media Library | ~18.2.1 | Photo access and deletion |
| **Image Loading** | Expo Image | ~3.0.8 | Optimized image rendering |
| **Storage** | Async Storage | 2.2.0 | Persistent data storage |
| **Icons** | Lucide React Native | ^0.545.0 | Icon library |
| **Blur Effects** | Expo Blur | ~15.0.7 | Visual effects |

### Project Structure Overview

```
cardsSwiping - Copy/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── _layout.tsx          # Tab bar configuration
│   │   ├── index.tsx            # Home/Swipe screen
│   │   ├── trash.tsx            # Trash management screen
│   │   └── stats.tsx            # Statistics screen
│   ├── _layout.tsx              # Root layout
│   ├── +html.tsx                # HTML entry point
│   └── +not-found.tsx           # 404 screen
├── components/                   # Reusable UI components
│   ├── Cards.tsx                 # Card stack container
│   ├── CardItem.tsx              # Individual swipeable card
│   ├── BadgeItem.tsx             # Stats badge component
│   ├── AlbumFilter.tsx           # Album selection dropdown
│   ├── EmptyState.tsx            # Empty state placeholder
│   ├── Footer.tsx                # Bottom footer component
│   ├── PermissionScreen.tsx      # Permission request UI
│   ├── SessionProgress.tsx       # Progress bar component
│   ├── SessionSummary.tsx        # Session summary modal
│   └── tabbar/                   # Custom tab bar
│       └── CustomTabBar.tsx
├── context/                      # React Context providers
│   └── AppStateContext.tsx       # Global app state management
├── hooks/                        # Custom React hooks
│   ├── useAlbums.ts              # Album fetching logic
│   └── useGalleryPhotos.ts       # Photo fetching and permissions
├── storage/                      # Persistence layer
│   ├── appStateStorage.ts        # App state persistence
│   ├── albumStorage.ts           # Album preferences
│   └── onboardingStorage.ts      # Onboarding state
├── types/                        # TypeScript definitions
│   ├── appState.ts               # App state types
│   ├── media.ts                  # Media-related types
│   └── types.ts                  # General types
├── utils/                        # Utility functions
│   ├── formatBytes.ts            # Byte formatting
│   ├── haptics.ts                # Haptic feedback
│   └── imagePrefetch.ts          # Image preloading
├── constants/                    # App-wide constants
│   ├── constants.ts              # UI constants
│   └── Colors.ts                 # Color definitions
├── assets/                       # Static assets
│   ├── fonts/                    # Custom fonts
│   └── images/                   # Images and icons
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript config
```

---

## Main Features Documentation

### Feature 1: Swipe Cards (Photo Review)

#### What It Does
Allows users to review photos one at a time by swiping left (trash) or right (keep). Provides visual feedback with animated overlays and haptic feedback.

#### User Flow
1. User opens app → Permission request screen appears
2. User grants permission → Photos load in card stack
3. User swipes left → Photo moves to trash queue
4. User swipes right → Photo marked as kept
5. User can undo last action before proceeding
6. Progress bar shows completion status

#### Important Files/Components

| File | Component | Purpose |
|------|-----------|---------|
| `app/(tabs)/index.tsx` | `TabOneScreen` | Main screen orchestrator |
| `components/Cards.tsx` | `Cards` | Card stack container with state management |
| `components/CardItem.tsx` | `CardItem` | Individual swipeable card with animations |
| `context/AppStateContext.tsx` | `keepPhoto()`, `trashPhoto()` | State update functions |
| `hooks/useGalleryPhotos.ts` | `useGalleryPhotos` | Photo fetching and pagination |

#### How It Works Internally

1. **Photo Loading:**
   - `useGalleryPhotos` hook fetches photos from MediaLibrary in pages of 50
   - Photos are filtered to exclude already reviewed ones
   - Images are prefetched for smooth scrolling

2. **Swipe Gesture:**
   - Uses `react-native-gesture-handler` for pan gestures
   - Only the top card (index 0) is interactive
   - Tracks translationX and translationY during drag
   - Calculates velocity and position on release

3. **Swipe Decision:**
   - **Trash:** `translationX < -100px` OR `velocityX < -800` and moving left
   - **Keep:** `translationX > 100px` OR `velocityX > 800` and moving right
   - If neither threshold met, card springs back to center

4. **Animation Sequence:**
   - Card fades out (`opacity: 0`) with spring animation
   - Card slides off screen with decay animation
   - Haptic feedback triggers on completion
   - Next card becomes interactive

5. **State Management:**
   - `keepPhoto()` adds photo ID to `keptPhotoIds` array
   - `trashPhoto()` adds photo object to `trashQueue` array
   - State persists to AsyncStorage automatically

#### How to Edit/Customize

**Change Swipe Thresholds:**
```typescript
// constants/constants.ts
export const SWIPE_THRESHOLD = 100; // Pixels to swipe before triggering
export const SWIPE_VELOCITY_THRESHOLD = 800; // Velocity threshold
```

**Change Card Appearance:**
```typescript
// components/CardItem.tsx
const styles = StyleSheet.create({
  container: {
    borderRadius: 28,        // Card corner radius
    borderWidth: 12,         // White border width
    borderColor: "white",    // Border color
  },
  image: { 
    borderRadius: 20,        // Image corner radius
  },
});
```

**Change Overlay Colors:**
```typescript
// components/CardItem.tsx
const DELETE_COLOR = "#f14de1";  // Pink for delete
// In constants/constants.ts
export const GREEN = "#bdf14d";   // Green for keep
```

**Adjust Animation Speed:**
```typescript
// constants/constants.ts
export const SPRING_CONFIG = { 
  damping: 60,    // Higher = less bounce
  stiffness: 1000 // Higher = faster animation
};
```

#### Code Sections Controlling Feature

- **Gesture Logic:** `components/CardItem.tsx` lines 73-98
- **Animation Styles:** `components/CardItem.tsx` lines 100-142
- **Card Stack Management:** `components/Cards.tsx` lines 44-103
- **State Updates:** `context/AppStateContext.tsx` lines 64-98

#### Common Problems and Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| Cards not responding to swipes | Gesture handler not wrapped | Ensure `GestureHandlerRootView` wraps app in `app/(tabs)/index.tsx` |
| Photos loading slowly | No prefetching | Increase `PREFETCH_AHEAD_COUNT` in constants |
| Cards overlapping incorrectly | Wrong zIndex | Check `MAX_VISIBLE_STACK` constant |
| Animations choppy | Heavy computations in worklets | Move logic to worklet context |

---

### Feature 2: Album Filter

#### What It Does
Allows users to select specific photo albums to review instead of their entire gallery.

#### User Flow
1. User taps album filter dropdown (appears if multiple albums exist)
2. List of albums displays with photo counts
3. User selects album → Photos reload for that album
4. "All Photos" option returns to full gallery view

#### Important Files/Components

| File | Component | Purpose |
|------|-----------|---------|
| `components/AlbumFilter.tsx` | `AlbumFilter` | Dropdown UI component |
| `hooks/useAlbums.ts` | `useAlbums` | Album fetching and selection logic |
| `app/(tabs)/index.tsx` | `TabOneScreen` | Album state management |

#### How It Works Internally

1. **Album Fetching:**
   - `MediaLibrary.getAlbumsAsync()` retrieves all albums
   - Smart albums (like "Favorites", "Selfies") included
   - Albums sorted and filtered for duplicates

2. **Selection Persistence:**
   - Selected album ID saved to AsyncStorage
   - Restored on app restart
   - Triggers photo reload with new album filter

3. **Photo Filtering:**
   - `useGalleryPhotos` receives `albumId` parameter
   - Passed to `MediaLibrary.getAssetsAsync({ album: albumId })`
   - Only photos from selected album returned

#### How to Edit/Customize

**Change Filter Options:**
```typescript
// hooks/useAlbums.ts
const options = [
  { id: null, title: "All Photos", count: totalCount },
  { id: "album-id", title: "Custom Album", count: 50 },
];
```

**Modify Dropdown Styling:**
```typescript
// components/AlbumFilter.tsx
const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: "white",
    borderRadius: 12,
    // Add custom styles
  },
});
```

#### Code Sections Controlling Feature

- **Album Fetching:** `hooks/useAlbums.ts` lines 1-100
- **UI Component:** `components/AlbumFilter.tsx`
- **Integration:** `app/(tabs)/index.tsx` lines 54-62

---

### Feature 3: Trash Management

#### What It Does
Temporarily stores trashed photos before permanent deletion, allowing users to undo mistakes.

#### User Flow
1. User swipes photo left → Photo enters trash queue
2. User can tap undo button → Photo returns to review queue
3. User navigates to Trash tab → Sees all trashed photos
4. User taps "Delete All" → Photos permanently deleted from device
5. User can undo individual photos before deleting all

#### Important Files/Components

| File | Component | Purpose |
|------|-----------|---------|
| `app/(tabs)/trash.tsx` | `TrashScreen` | Trash management UI |
| `context/AppStateContext.tsx` | `undoTrash()`, `deleteAllTrash()` | Trash state operations |
| `components/EmptyState.tsx` | `EmptyState` | Empty trash placeholder |

#### How It Works Internally

1. **Trash Queue:**
   - `trashQueue` array stores full `GalleryPhoto` objects
   - Separate from `keptPhotoIds` to preserve photo data
   - Persisted to AsyncStorage with app state

2. **Undo Functionality:**
   - `undoTrash(photoId)` removes photo from `trashQueue`
   - Photo becomes available for review again
   - No MediaLibrary operation needed (just state update)

3. **Permanent Deletion:**
   - `deleteAllTrash()` extracts photo IDs from queue
   - Requests write permissions if not granted
   - Calls `MediaLibrary.deleteAssetsAsync(ids)`
   - Clears trash queue and updates stats on success

4. **Permission Handling:**
   - Checks current permissions before deletion
   - Requests permissions if needed
   - Returns error message if denied

#### How to Edit/Customize

**Change Delete Button Color:**
```typescript
// app/(tabs)/trash.tsx
const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: "#f14de1", // Change to your color
  },
});
```

**Add Confirmation Dialog:**
```typescript
// Already implemented in trash.tsx lines 35-58
// Modify the Alert.alert configuration
```

**Change Grid Layout:**
```typescript
// app/(tabs)/trash.tsx
const GRID_COLUMNS = 3; // Change to 2 or 4
const GRID_GAP = 8; // Adjust spacing
```

#### Code Sections Controlling Feature

- **Trash Screen:** `app/(tabs)/trash.tsx` lines 31-129
- **Delete Logic:** `context/AppStateContext.tsx` lines 100-132
- **Undo Logic:** `context/AppStateContext.tsx` lines 90-98

#### Common Problems and Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| "Invalid token pending" error | No write permissions | Fixed in v1.4.0 - now requests permissions before delete |
| Photos not deleting | Permission denied | Check Android permissions in app.json |
| Undo not working | Photo ID mismatch | Ensure photo.id is consistent across operations |

---

### Feature 4: Session Statistics

#### What It Does
Tracks and displays user progress during photo review sessions, including photos reviewed, kept, trashed, and space freed.

#### User Flow
1. User reviews photos → Stats update in real-time
2. User navigates to Stats tab → Sees detailed breakdown
3. User can reset session → All stats cleared
4. Stats persist across app restarts

#### Important Files/Components

| File | Component | Purpose |
|------|-----------|---------|
| `app/(tabs)/stats.tsx` | `StatsScreen` | Statistics display |
| `components/SessionProgress.tsx` | `SessionProgress` | Progress bar component |
| `context/AppStateContext.tsx` | State variables | Stats calculation and storage |
| `utils/formatBytes.ts` | `formatBytes()` | Byte size formatting |

#### How It Works Internally

1. **Stats Tracking:**
   - `reviewedCount` = kept + trash + deleted
   - `keptCount` = Number of kept photo IDs
   - `trashCount` = Number of photos in trash queue
   - `deletedCount` = Permanently deleted photos
   - `freedBytesTotal` = Cumulative bytes freed
   - `pendingTrashBytes` = Bytes in trash queue

2. **Persistence:**
   - All stats saved to AsyncStorage via `saveAppState()`
   - Loaded on app startup via `loadAppState()`
   - Survives app restarts and updates

3. **Progress Calculation:**
   - `SessionProgress` shows reviewed vs total count
   - Updates in real-time as photos are reviewed
   - Visual progress bar with percentage

#### How to Edit/Customize

**Add New Stat:**
```typescript
// 1. Add to types/appState.ts
export type PersistedAppState = {
  // ... existing fields
  newStat: number;
};

// 2. Update in context/AppStateContext.tsx
const [newStat, setNewStat] = useState(0);

// 3. Display in app/(tabs)/stats.tsx
<StatRow label="New Stat" value={String(newStat)} />
```

**Change Progress Bar Colors:**
```typescript
// components/SessionProgress.tsx
// Modify gradient or color props
```

#### Code Sections Controlling Feature

- **Stats Screen:** `app/(tabs)/stats.tsx` lines 34-105
- **Progress Component:** `components/SessionProgress.tsx`
- **State Management:** `context/AppStateContext.tsx` lines 138-148

---

### Feature 5: Permission Management

#### What It Does
Handles photo library permissions, requests access when needed, and gracefully handles denied permissions.

#### User Flow
1. User opens app → Permission screen displays
2. User taps "Grant Permission" → System dialog appears
3. User grants permission → Photos load
4. If denied → Shows instructions to enable in settings
5. Permissions rechecked when app returns to foreground

#### Important Files/Components

| File | Component | Purpose |
|------|-----------|---------|
| `components/PermissionScreen.tsx` | `PermissionScreen` | Permission request UI |
| `hooks/useGalleryPhotos.ts` | `useGalleryPhotos` | Permission checking logic |
| `app.json` | Plugin config | Permission descriptions |

#### How It Works Internally

1. **Permission Check:**
   - `MediaLibrary.getPermissionsAsync()` checks current status
   - Returns `{ granted, canAskAgain, status }`
   - Stored in component state

2. **Permission Request:**
   - `MediaLibrary.requestPermissionsAsync()` shows system dialog
   - Uses granular permissions (Android 13+)
   - Handles "don't ask again" scenario

3. **Foreground Recheck:**
   - `AppState.addEventListener` listens for app activation
   - Rechecks permissions when app returns from background
   - Updates UI if permissions changed in settings

4. **Granular Permissions (Android 13+):**
   - Requests only `photo` permission
   - Configured in `app.json` plugin settings
   - More privacy-friendly than full media access

#### How to Edit/Customize

**Change Permission Messages:**
```json
// app.json
"plugins": [
  [
    "expo-media-library",
    {
      "photosPermission": "Your custom message here",
      "granularPermissions": ["photo"]
    }
  ]
]
```

**Modify Permission Screen UI:**
```typescript
// components/PermissionScreen.tsx
// Edit the JSX to change layout, colors, or text
```

#### Code Sections Controlling Feature

- **Permission Hook:** `hooks/useGalleryPhotos.ts` lines 80-107
- **Permission UI:** `components/PermissionScreen.tsx`
- **App Config:** `app.json` lines 46-56

---

## Main UI Editing Guide

### Home Screen (Swipe Screen)

**File:** `app/(tabs)/index.tsx`

#### What You Can Change

**App Title:**
```typescript
// Line 136
<Text style={styles.appTitle}>SwipeClean</Text>
// Change to your app name
```

**Header Layout:**
```typescript
// Lines 211-218
const styles = StyleSheet.create({
  header: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between", // Change alignment
    flexDirection: "row",
    paddingHorizontal: 20,  // Adjust horizontal padding
    marginTop: 10,          // Adjust top margin
  },
});
```

**Background Color:**
```typescript
// Line 204
backgroundColor: BG_COLOR,
// Change BG_COLOR in constants/constants.ts
```

### Navigation

**File:** `app/(tabs)/_layout.tsx`

#### Tab Bar Configuration

**Change Tab Order:**
```typescript
// Lines 17-54
<Tabs.Screen name="index" ... />   // First tab
<Tabs.Screen name="trash" ... />   // Second tab
<Tabs.Screen name="stats" ... />   // Third tab
// Reorder or add new tabs here
```

**Change Tab Icons:**
```typescript
// Lines 21-26
tabBarIcon: ({ color, focused }) =>
  !focused ? (
    <Octicons name="home" size={24} color={color} />
  ) : (
    <Octicons name="home-fill" size={24} color="black" />
  ),
// Replace with any icon from @expo/vector-icons or lucide-react-native
```

**Hide Tab Bar on Specific Screens:**
```typescript
// In any screen file
<Tabs.Screen
  name="index"
  options={{
    tabBarStyle: { display: 'none' } // Hide tab bar
  }}
/>
```

### Buttons

**File:** Various component files

#### Delete Button (Trash Screen)
```typescript
// app/(tabs)/trash.tsx lines 189-202
const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: "#f14de1",  // Button color
    paddingVertical: 16,         // Vertical padding
    borderRadius: 14,            // Corner radius
    alignItems: "center",        // Center horizontally
  },
  deleteButtonText: {
    fontFamily: "Goldman-Bold",  // Font family
    fontSize: 18,                // Text size
    color: "white",              // Text color
  },
});
```

**Reset Button (Stats Screen)**
```typescript
// app/(tabs)/stats.tsx lines 150-165
resetButton: {
  backgroundColor: "white",
  borderRadius: 14,
  paddingVertical: 14,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#f14de1",  // Border color
},
```

### Colors and Themes

**File:** `constants/constants.ts` and `constants/Colors.ts`

#### Primary Colors
```typescript
// constants/constants.ts
export const TEXT_COLOR = "#464343ff";  // Main text color
export const BG_COLOR = "#edf2f5";      // Background color
export const GREEN = "#bdf14d";         // Success/keep color

// Additional colors used
const DELETE_COLOR = "#f14de1";  // Delete/trash color (in CardItem.tsx)
```

#### How to Change Theme

**Dark Mode Support:**
```typescript
// Use color scheme detection
import { useColorScheme } from 'react-native';

const colorScheme = useColorScheme();
const bgColor = colorScheme === 'dark' ? '#000000' : BG_COLOR;
```

**Create Color Palette:**
```typescript
// constants/Colors.ts
export const Colors = {
  light: {
    primary: '#bdf14d',
    background: '#edf2f5',
    text: '#464343ff',
  },
  dark: {
    primary: '#bdf14d',
    background: '#1a1a1a',
    text: '#ffffff',
  },
};
```

### Fonts

**File:** Various component files

#### Current Fonts
```typescript
// App uses "Goldman" font family
fontFamily: "Goldman-Bold"    // Bold text
fontFamily: "Goldman-Regular" // Regular text
```

#### How to Change Fonts

**1. Add Font to Project:**
```bash
# Place font files in assets/fonts/
# Supported formats: .ttf, .otf
```

**2. Load Font in app:**
```typescript
// app/_layout.tsx or app/index.tsx
import { useFonts } from 'expo-font';
import { Goldman_400Regular, Goldman_700Bold } from './assets/fonts/Goldman';

const [fontsLoaded] = useFonts({
  'Goldman-Regular': Goldman_400Regular,
  'Goldman-Bold': Goldman_700Bold,
});
```

**3. Use Custom Font:**
```typescript
// Any component
const styles = StyleSheet.create({
  text: {
    fontFamily: "YourFont-Bold",
    fontSize: 16,
  },
});
```

### Animations

**File:** `components/CardItem.tsx` and `constants/constants.ts`

#### Spring Animation Configuration
```typescript
// constants/constants.ts
export const SPRING_CONFIG = { 
  damping: 60,    // Adjust for more/less bounce
  stiffness: 1000 // Adjust for faster/slower animation
};
```

**Change Card Animation Speed:**
```typescript
// Higher damping = less oscillation
// Higher stiffness = faster movement
SPRING_CONFIG = { damping: 80, stiffness: 1200 }; // Snappier
SPRING_CONFIG = { damping: 40, stiffness: 800 };  // More bouncy
```

**Background Color Transition:**
```typescript
// app/(tabs)/index.tsx lines 117-124
const stylesReanimated = useAnimatedStyle(() => {
  return {
    backgroundColor: withTiming(
      stats[activeIndex === 2 ? 0 : activeIndex + 1].color,
      { duration: 250 } // Change transition speed
    ),
  };
});
```

### Cards/Components

**File:** `components/CardItem.tsx`

#### Card Dimensions
```typescript
// constants/constants.ts
export const CARD_WIDTH = width - SPACING * 4;  // Card width
export const CARD_HEIGHT = CARD_WIDTH * 1.2;    // Card height (aspect ratio)
```

**Change Card Aspect Ratio:**
```typescript
// For taller cards:
export const CARD_HEIGHT = CARD_WIDTH * 1.5;

// For wider cards:
export const CARD_HEIGHT = CARD_WIDTH * 1.0;
```

**Card Border and Shadow:**
```typescript
// components/CardItem.tsx lines 184-192
container: {
  borderRadius: 28,      // Corner roundness
  borderWidth: 12,       // White border thickness
  borderColor: "white",  // Border color
  backgroundColor: "white",
  // Add shadow for depth:
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,  // Android shadow
},
```

**Stack Effect:**
```typescript
// components/CardItem.tsx lines 100-112
let scale = 1;
if (index > 0) {
  const baseScale = index === 1 ? 0.96 : 0.92; // Card size reduction
  scale = baseScale + dragProgress * (1 - baseScale) * 0.5;
}
// Adjust baseScale values for more/less dramatic stack effect
```

### Icons

**File:** Various component files

#### Current Icon Libraries
```typescript
// Lucide icons (preferred)
import { Check, Images, Trash2, Undo2, RefreshCw, PartyPopper } from 'lucide-react-native';

// Expo vector icons
import { Octicons } from '@expo/vector-icons';
```

**Change Icon:**
```typescript
// Example: Change home icon
import { Home } from 'lucide-react-native';

<Home color={color} size={24} />
```

**Icon Sizes:**
```typescript
// Standard sizes used
size={16}  // Small icons (undo button)
size={20}  // Medium icons (stats)
size={24}  // Standard icons (tab bar)
size={26}  // Large icons (active tab)
size={32}  // Overlay text icons
```

### Layout Spacing

**File:** `constants/constants.ts`

#### Spacing Constants
```typescript
export const SPACING = 20;  // Base spacing unit (used throughout app)
export const TABBAR_WIDTH = width * 0.75;  // Tab bar width
export const TAB_ITEM_SIZE = 60;  // Tab icon size
```

**Change Global Spacing:**
```typescript
// Increase all spacing
export const SPACING = 24;

// Decrease all spacing
export const SPACING = 16;
```

**Card Grid Spacing (Trash Screen):**
```typescript
// app/(tabs)/trash.tsx
const GRID_GAP = 8;      // Space between cards
const GRID_COLUMNS = 3;  // Number of columns
```

**Screen Padding:**
```typescript
// Most screens use
paddingHorizontal: SPACING,  // Left/right padding
paddingTop: 10,               // Top padding
gap: 20,                      // Element spacing
```

### Localization/Text

**Current State:** App uses hardcoded English strings

**To Add Localization:**

**1. Install i18n library:**
```bash
npm install i18n-js
```

**2. Create translation files:**
```typescript
// locales/en.json
{
  "app.title": "SwipeClean",
  "trash.title": "Trash",
  "stats.title": "Session Stats",
  "delete.confirm": "Delete all photos?"
}

// locales/es.json
{
  "app.title": "SwipeClean",
  "trash.title": "Papelera",
  "stats.title": "Estadísticas"
}
```

**3. Use in components:**
```typescript
import i18n from 'i18n-js';

<Text>{i18n.t('app.title')}</Text>
```

**Quick Text Changes:**
```typescript
// Search for text strings in components
// Example: Change "Review Photos" title
// components/Cards.tsx line 159
<Text style={styles.title}>Review Photos</Text>
// Change to:
<Text style={styles.title}>Review Your Photos</Text>
```

---

## Feature Management

### How to Add a New Feature

#### Step-by-Step Process

**1. Plan the Feature**
```markdown
- Define feature purpose
- Identify user flow
- List required components
- Determine state changes needed
```

**2. Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

**3. Add State (if needed)**
```typescript
// context/AppStateContext.tsx
// Add to PersistedAppState type
export type PersistedAppState = {
  // ... existing fields
  newFeatureData: string;
};

// Add state variable
const [newFeatureData, setNewFeatureData] = useState('');

// Add to context value
const value = {
  // ... existing values
  newFeatureData,
  setNewFeatureData,
};
```

**4. Create Components**
```bash
# Create new component file
components/NewFeature.tsx

# Implement component
export default function NewFeature() {
  return <View>...</View>;
}
```

**5. Add Screen (if needed)**
```bash
# Create new tab
app/(tabs)/newfeature.tsx

# Add to navigation
app/(tabs)/_layout.tsx
<Tabs.Screen
  name="newfeature"
  options={{
    title: "New Feature",
    tabBarIcon: ({ color }) => <Icon name="icon" color={color} />
  }}
/>
```

**6. Test Thoroughly**
```bash
# Run on iOS
npm run ios

# Run on Android
npm run android

# Test all edge cases
```

**7. Update Documentation**
```markdown
# Add to DEVELOPER_MANUAL.md
- Feature description
- Usage instructions
- Code sections
```

**8. Commit and Merge**
```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
# Create pull request
```

### How to Remove a Feature Safely

#### Step-by-Step Process

**1. Identify All Related Files**
```bash
# Search for feature references
grep -r "featureName" --include="*.tsx" --include="*.ts" .
```

**2. Create Backup Branch**
```bash
git checkout -b backup/before-feature-removal
git push origin backup/before-feature-removal
```

**3. Remove in Order:**
```
a. Remove UI components
b. Remove screen files
c. Remove navigation entries
d. Remove state from context
e. Remove hooks
f. Remove utility functions
g. Remove from storage
```

**4. Example: Removing Trash Feature**
```bash
# 1. Remove screen
rm app/(tabs)/trash.tsx

# 2. Remove from navigation
# Edit app/(tabs)/_layout.tsx - remove trash tab

# 3. Remove state
# Edit context/AppStateContext.tsx - remove trashQueue, deleteAllTrash, etc.

# 4. Remove components
rm components/EmptyState.tsx  # If only used by trash

# 5. Update types
# Edit types/appState.ts - remove trash-related fields
```

**5. Test Thoroughly**
```bash
# Ensure app still runs
npm run ios

# Check for console errors
# Verify other features still work
```

**6. Commit**
```bash
git add .
git commit -m "feat: remove trash feature"
```

### How to Temporarily Disable a Feature

#### Method 1: Feature Flag (Recommended)

**1. Add Feature Flag System:**
```typescript
// constants/constants.ts
export const FEATURE_FLAGS = {
  TRASH_FEATURE: true,
  STATS_FEATURE: true,
  ALBUM_FILTER: true,
} as const;
```

**2. Use in Components:**
```typescript
// app/(tabs)/_layout.tsx
import { FEATURE_FLAGS } from '@/constants/constants';

{FEATURE_FLAGS.TRASH_FEATURE && (
  <Tabs.Screen name="trash" ... />
)}
```

**3. Toggle Feature:**
```typescript
// To disable:
export const FEATURE_FLAGS = {
  TRASH_FEATURE: false,  // Disabled
};

// To enable:
export const FEATURE_FLAGS = {
  TRASH_FEATURE: true,   // Enabled
};
```

#### Method 2: Comment Out Code

```typescript
// app/(tabs)/_layout.tsx
{/*
<Tabs.Screen
  name="trash"
  options={{...}}
/>
*/}
```

**Note:** Method 1 is preferred for production apps.

### How to Test Changes Before Releasing

#### Testing Checklist

**1. Unit Tests (if implemented)**
```bash
npm test
```

**2. Manual Testing:**

**iOS Simulator:**
```bash
npm run ios
# Test all features
# Check different screen sizes
# Test gestures
# Verify permissions
```

**Android Emulator:**
```bash
npm run android
# Test all features
# Check back button behavior
# Test permissions flow
```

**3. Test Scenarios:**
```markdown
- [ ] App launches without crashes
- [ ] Permissions requested correctly
- [ ] Photos load and display
- [ ] Swipe gestures work (left/right)
- [ ] Undo functionality works
- [ ] Trash screen displays correctly
- [ ] Delete all works
- [ ] Stats update correctly
- [ ] Reset session works
- [ ] Album filter works (if multiple albums)
- [ ] App survives background/foreground
- [ ] State persists after app restart
```

**4. Create Test Build:**
```bash
# Expo build
eas build --profile development --platform ios
eas build --profile development --platform android

# Install on physical device for testing
```

**5. Beta Testing:**
```bash
# Upload to TestFlight (iOS)
eas submit --platform ios

# Upload to Internal Testing (Android)
eas submit --platform android
```

---

## Version Increment System

### Semantic Versioning

**Format:** `MAJOR.MINOR.PATCH` (e.g., 1.2.3)

#### Version Components

| Component | When to Increment | Example |
|-----------|------------------|---------|
| **MAJOR** | Breaking changes, major rewrites | 1.0.0 → 2.0.0 |
| **MINOR** | New features, backwards compatible | 1.0.0 → 1.1.0 |
| **PATCH** | Bug fixes, small improvements | 1.0.0 → 1.0.1 |

### Version History Example

```markdown
## Version 1.0.0 (Initial Release)
- Core swipe functionality
- Basic trash management
- Session statistics
- Permission handling

## Version 1.1.0 (New Features)
- Album filter added
- Undo functionality
- Improved animations

## Version 1.1.1 (Bug Fixes)
- Fixed "Invalid token pending" error
- Fixed photo loading issues
- Improved error messages

## Version 1.2.0 (Feature Update)
- Batch delete optimization
- New stats dashboard
- Dark mode support

## Version 2.0.0 (Major Update)
- Complete UI redesign
- New navigation system
- Breaking API changes
```

### How to Decide Version Bumps

#### Increment MAJOR (x.0.0) When:
- Complete UI/UX redesign
- Breaking changes to data structure
- Major architecture changes
- Removing core features
- Changing minimum OS requirements

**Example:**
```bash
# Before: 1.5.0
# After: 2.0.0
git tag -a v2.0.0 -m "Major release: Complete redesign"
```

#### Increment MINOR (x.y.0) When:
- Adding new features
- Adding new screens
- Significant feature enhancements
- New permission requirements
- Backwards-compatible API changes

**Example:**
```bash
# Before: 1.5.0
# After: 1.6.0
git tag -a v1.6.0 -m "feat: Add album filter and batch operations"
```

#### Increment PATCH (x.y.z) When:
- Bug fixes
- Performance improvements
- Small UI tweaks
- Documentation updates
- Security patches

**Example:**
```bash
# Before: 1.5.0
# After: 1.5.1
git tag -a v1.5.1 -m "fix: Resolve permission error on delete"
```

### How to Create Checkpoints

#### Using Git Tags

**1. Create Tag:**
```bash
# Before making changes
git tag -a v1.4.0 -m "Release version 1.4.0"
git push origin v1.4.0
```

**2. View Tags:**
```bash
git tag -l
git show v1.4.0
```

**3. Compare Versions:**
```bash
# See changes between versions
git diff v1.3.0 v1.4.0

# See commit history
git log v1.3.0..v1.4.0
```

#### Using Git Branches

**1. Create Release Branch:**
```bash
git checkout -b release/v1.4.0
git push -u origin release/v1.4.0
```

**2. Hotfix Branch:**
```bash
git checkout -b hotfix/v1.4.1
# Make fixes
git commit -m "fix: critical bug fix"
git push origin hotfix/v1.4.1
```

### How to Return to Previous Stable Version

#### Method 1: Git Checkout

```bash
# List all versions
git tag -l

# Checkout specific version
git checkout v1.3.0

# Create branch from old version
git checkout -b restore/v1.3.0
```

#### Method 2: Git Revert

```bash
# Revert last commit
git revert HEAD

# Revert specific commit
git revert abc123

# Revert multiple commits
git revert abc123..def456
```

#### Method 3: Git Reset (Dangerous)

```bash
# Reset to last tag (DESTROYS uncommitted changes)
git reset --hard v1.3.0

# Force push (DANGEROUS - only for local branches)
git push --force origin v1.3.0
```

### How to Use Git Branches and Tags

#### Branch Strategy

```
main (production-ready code)
├── develop (integration branch)
│   ├── feature/album-filter
│   ├── feature/dark-mode
│   └── bugfix/permission-error
├── release/v1.5.0
└── hotfix/v1.4.1
```

**Branch Purposes:**

| Branch | Purpose | Merges To |
|--------|---------|-----------|
| `main` | Production code | - |
| `develop` | Development integration | `main` |
| `feature/*` | New features | `develop` |
| `release/*` | Release preparation | `main` and `develop` |
| `hotfix/*` | Critical production fixes | `main` and `develop` |

#### Workflow Example

```bash
# 1. Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/dark-mode

# 2. Work on feature
git add .
git commit -m "feat: add dark mode toggle"
git push origin feature/dark-mode

# 3. Create pull request
# (Merge via GitHub/GitLab UI)

# 4. After merge, create release
git checkout develop
git pull origin develop
git checkout -b release/v1.5.0

# 5. Tag release
git tag -a v1.5.0 -m "Release v1.5.0"
git push origin v1.5.0

# 6. Merge to main
git checkout main
git merge release/v1.5.0
git push origin main
```

### How to Create Backups Before Major Changes

#### Backup Strategy

**1. Create Backup Branch:**
```bash
# Before major changes
git checkout -b backup/pre-redesign-$(date +%Y%m%d)
git push origin backup/pre-redesign-$(date +%Y%m%d)

# Tag it
git tag -a backup-2026-01-15 -m "Backup before UI redesign"
git push origin backup-2026-01-15
```

**2. Export Code Archive:**
```bash
# Create zip backup
git archive --format=zip --prefix=swipeclean-backup/ -o backup.zip HEAD

# Or use tar
git archive --format=tar --prefix=swipeclean-backup/ | gzip > backup.tar.gz
```

**3. Backup Database/Storage:**
```bash
# Export AsyncStorage data (if using Expo)
# This is app-specific, implement export logic

# Backup app state
cp -r storage/ backup/storage-$(date +%Y%m%d)/
```

**4. Document Current State:**
```markdown
# Create BACKUP_NOTES.md
## Backup Date: 2026-01-15
## Version: 1.4.0
## Purpose: Before major UI redesign

### Working Features:
- [x] Swipe cards
- [x] Trash management
- [x] Session stats

### Known Issues:
- [ ] Permission error on some devices
- [ ] Slow loading on large galleries

### Next Steps:
- Redesign card animations
- Add dark mode
- Optimize photo loading
```

---

## Rollback Guide

### How to Undo a Bad Update

#### Immediate Rollback (Same Day)

**1. Identify the Problem:**
```bash
# Check recent commits
git log --oneline -10

# Check what changed
git diff HEAD~1
```

**2. Revert Last Commit:**
```bash
# Soft revert (keeps changes in staging)
git reset --soft HEAD~1

# Hard revert (removes changes completely)
git reset --hard HEAD~1

# Revert with new commit (safer)
git revert HEAD
```

**3. Push Fix:**
```bash
git push origin main
```

#### Rollback to Specific Version

**1. Find Working Version:**
```bash
# List tags
git tag -l

# Checkout that version
git checkout v1.3.0

# Create hotfix branch
git checkout -b hotfix/rollback-to-v1.3.0
```

**2. Cherry-Pick Fixes:**
```bash
# If you want to keep some changes from bad version
git log v1.3.0..HEAD --oneline
git cherry-pick abc123  # Specific commit to keep
```

**3. Deploy:**
```bash
git push origin hotfix/rollback-to-v1.3.0
# Create PR and merge
```

### How to Restore Previous Working Version

#### Complete Restore

**1. From Tag:**
```bash
# Ensure you're on main
git checkout main
git pull origin main

# Reset to tag
git reset --hard v1.3.0
git push --force origin main

# WARNING: This overwrites remote history
```

**2. From Backup Branch:**
```bash
git checkout backup/pre-redesign-20260115
git checkout -b restore-from-backup
git push -u origin restore-from-backup

# Merge to main
git checkout main
git merge restore-from-backup
git push origin main
```

**3. From Archive:**
```bash
# Extract backup
unzip backup.zip -d restore/

# Copy to project
cp -r restore/swipeclean-backup/* .

# Commit restore
git add .
git commit -m "restore: Rollback to v1.3.0 from backup"
git push origin main
```

### How to Compare Old and New Code

#### Using Git Diff

**1. Compare Versions:**
```bash
# Compare two tags
git diff v1.3.0 v1.4.0

# Compare branches
git diff main feature/new-feature

# Compare specific files
git diff v1.3.0 v1.4.0 -- constants/constants.ts
```

**2. See What Changed:**
```bash
# List changed files
git diff --name-only v1.3.0 v1.4.0

# See stats
git diff --stat v1.3.0 v1.4.0

# Detailed line changes
git diff v1.3.0 v1.4.0 -- context/AppStateContext.tsx
```

**3. Visual Diff Tools:**
```bash
# Use git difftool
git difftool v1.3.0 v1.4.0

# Configure difftool (VS Code)
git config --global diff.tool vscode
git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'
```

#### Using GitHub/GitLab UI

**1. Compare Pull Requests:**
```
GitHub: base: main compare: feature-branch
Shows all changes in web UI
```

**2. View Commit History:**
```
GitHub: /commits/main
Shows all commits with diffs
```

**3. Browse Code at Specific Version:**
```
GitHub: /tree/v1.3.0
Shows code as it was at that version
```

### How to Recover Deleted Features

#### From Git History

**1. Find Deleted File:**
```bash
# Search git history
git log --all --full-history -- "components/OldComponent.tsx"

# Find commit that deleted it
git log --diff-filter=D -- "components/OldComponent.tsx"
```

**2. Restore File:**
```bash
# Restore from specific commit
git checkout abc123 -- components/OldComponent.tsx

# Or restore last deleted version
git checkout HEAD^ -- components/OldComponent.tsx
```

**3. Restore Deleted Code:**
```bash
# If code was removed from file
git checkout abc123^:components/Component.tsx > temp.ts
# Edit temp.ts to extract needed code
# Add back to current file
```

#### From Backup

```bash
# If you have backup branch
git checkout backup/pre-redesign-20260115
cp components/OldComponent.tsx ../restore/
git checkout main
cp ../restore/OldComponent.tsx components/
git add .
git commit -m "restore: Recover OldComponent from backup"
```

---

## Developer Maintenance Guide

### Folder Structure Explanation

```
cardsSwiping - Copy/
│
├── app/                          # Expo Router screens (file-based routing)
│   ├── (tabs)/                   # Tab screens (wrapped in tab navigator)
│   │   ├── _layout.tsx          # Tab bar configuration
│   │   ├── index.tsx            # Home tab (swipe screen)
│   │   ├── trash.tsx            # Trash tab
│   │   └── stats.tsx            # Stats tab
│   ├── _layout.tsx              # Root layout (providers, fonts)
│   ├── +html.tsx                # HTML entry for web
│   └── +not-found.tsx           # 404 page
│
├── components/                   # Reusable UI components
│   ├── Cards.tsx                 # Card stack container
│   ├── CardItem.tsx              # Individual card
│   ├── BadgeItem.tsx             # Stats badge
│   ├── AlbumFilter.tsx           # Album dropdown
│   ├── EmptyState.tsx            # Empty state placeholder
│   ├── Footer.tsx                # Footer component
│   ├── PermissionScreen.tsx      # Permission request UI
│   ├── SessionProgress.tsx       # Progress bar
│   ├── SessionSummary.tsx        # Summary modal
│   └── tabbar/                   # Custom tab bar
│       └── CustomTabBar.tsx
│
├── context/                      # React Context (global state)
│   └── AppStateContext.tsx       # Main app state provider
│
├── hooks/                        # Custom React hooks
│   ├── useAlbums.ts              # Album fetching logic
│   └── useGalleryPhotos.ts       # Photo fetching & permissions
│
├── storage/                      # Persistence layer
│   ├── appStateStorage.ts        # App state (AsyncStorage)
│   ├── albumStorage.ts           # Album preferences
│   └── onboardingStorage.ts      # Onboarding state
│
├── types/                        # TypeScript type definitions
│   ├── appState.ts               # App state types
│   ├── media.ts                  # Media types
│   └── types.ts                  # General types
│
├── utils/                        # Utility functions
│   ├── formatBytes.ts            # Format bytes to human-readable
│   ├── haptics.ts                # Haptic feedback triggers
│   └── imagePrefetch.ts          # Image preloading
│
├── constants/                    # App-wide constants
│   ├── constants.ts              # UI constants
│   └── Colors.ts                 # Color definitions
│
├── assets/                       # Static assets
│   ├── fonts/                    # Custom fonts (Goldman)
│   └── images/                   # App icons, splash, etc.
│
├── app.json                      # Expo configuration
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── eas.json                       # EAS build configuration
└── .gitignore                    # Git ignore rules
```

### Important Configuration Files

#### app.json
**Purpose:** Expo app configuration  
**Key Sections:**
```json
{
  "expo": {
    "name": "SwipeClean",              // App name
    "version": "1.4.0",                // App version
    "slug": "swipe-clean",             // URL slug
    "ios": {
      "bundleIdentifier": "com.swipeclean.app",
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "Permission message"
      }
    },
    "android": {
      "package": "com.swipeclean.app",
      "permissions": [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    },
    "plugins": [
      ["expo-media-library", {
        "photosPermission": "Permission message",
        "granularPermissions": ["photo"]
      }]
    ]
  }
}
```

**When to Edit:**
- Changing app name or version
- Adding/removing permissions
- Configuring plugins
- Updating bundle identifier

#### package.json
**Purpose:** Dependencies and scripts  
**Key Sections:**
```json
{
  "version": "1.4.0",              // Match app.json version
  "scripts": {
    "start": "expo start",         // Start dev server
    "android": "expo run:android", // Run on Android
    "ios": "expo run:ios"          // Run on iOS
  },
  "dependencies": {
    "expo": "~54.0.12",            // Expo SDK version
    "react-native": "0.81.5"       // React Native version
  }
}
```

**When to Edit:**
- Adding new dependencies
- Updating versions
- Adding npm scripts

#### tsconfig.json
**Purpose:** TypeScript configuration  
**Key Settings:**
```json
{
  "compilerOptions": {
    "strict": true,                // Enable strict type checking
    "paths": {
      "@/*": ["./*"]              // Path alias for imports
    }
  }
}
```

**When to Edit:**
- Adding path aliases
- Changing TypeScript strictness
- Updating compiler options

### Environment Variables

**Current Setup:** No environment variables (all config in app.json)

**To Add Environment Variables:**

**1. Install expo-constants:**
```bash
npm install expo-constants
```

**2. Create .env file:**
```bash
# .env
API_URL=https://api.example.com
ANALYTICS_KEY=abc123
```

**3. Configure in app.json:**
```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://api.example.com",
      "analyticsKey": "abc123"
    }
  }
}
```

**4. Use in code:**
```typescript
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;
```

### Dependencies Management

#### Adding New Dependencies

```bash
# Install package
npm install package-name

# Or with specific version
npm install package-name@^1.0.0

# Dev dependency
npm install -D package-name
```

**After Installing:**
```bash
# Update package.json (automatic)
# Commit package.json and package-lock.json
git add package.json package-lock.json
git commit -m "chore: add package-name dependency"
```

#### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update all (use with caution)
npm update

# Update specific package
npm install package-name@latest

# Check for breaking changes
# Read package changelog before updating
```

#### Removing Dependencies

```bash
# Uninstall package
npm uninstall package-name

# Remove from package.json
git add package.json package-lock.json
git commit -m "chore: remove unused package-name"
```

### Build and Release Process

#### Development Build

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

#### Production Build (EAS)

**1. Configure EAS:**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure project
eas build:configure
```

**2. Build for iOS:**
```bash
# Development build
eas build --profile development --platform ios

# Preview build (TestFlight)
eas build --profile preview --platform ios

# Production build (App Store)
eas build --profile production --platform ios
```

**3. Build for Android:**
```bash
# Development build
eas build --profile development --platform android

# Preview build (Internal testing)
eas build --profile preview --platform android

# Production build (Google Play)
eas build --profile production --platform android
```

**4. Submit to Stores:**
```bash
# Submit to iOS App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

#### Build Profiles (eas.json)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "buildConfiguration": "Release"
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### Debugging Workflow

#### 1. Enable Debugging

**React Native Debugger:**
```bash
# Install React Native Debugger
# Open app in debug mode (shake device or Cmd+D)
# Enable "Debug JS Remotely"
```

**Expo DevTools:**
```bash
npm start
# Opens browser with dev tools
```

#### 2. Common Debugging Techniques

**Console Logging:**
```typescript
console.log('Debug info:', variable);
console.warn('Warning message');
console.error('Error message');
```

**React DevTools:**
```bash
npm install -g react-devtools
react-devtools
```

**Flipper (React Native):**
```bash
# Install Flipper app
# Automatically connects in debug mode
```

#### 3. Debug Permissions

```typescript
// Check permission status
const permission = await MediaLibrary.getPermissionsAsync();
console.log('Permission status:', permission);

// Request and log result
const response = await MediaLibrary.requestPermissionsAsync();
console.log('Permission response:', response);
```

#### 4. Debug State Changes

```typescript
// Log state updates
useEffect(() => {
  console.log('State changed:', state);
}, [state]);

// Log specific values
console.log('Trash count:', trashCount);
console.log('Kept photos:', keptPhotoIds);
```

#### 5. Debug Network Requests

```typescript
// Log API calls
console.log('Fetching photos from:', apiUrl);
const response = await fetch(apiUrl);
console.log('Response:', response);
```

#### 6. Performance Debugging

**React DevTools Profiler:**
```bash
# Profile component renders
# Identify unnecessary re-renders
```

**Flipper Performance Plugin:**
```bash
# Monitor FPS
# Check memory usage
# Profile UI thread
```

#### 7. Error Boundaries

```typescript
// components/ErrorBoundary.tsx
import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <Text>Something went wrong.</Text>;
    }
    return this.props.children;
  }
}

// Use in app
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## Quick Reference

### Common Commands

```bash
# Development
npm start                    # Start dev server
npm run ios                  # Run on iOS
npm run android              # Run on Android

# Git
git status                   # Check status
git add .                    # Stage all changes
git commit -m "message"      # Commit changes
git push origin main         # Push to remote
git pull origin main         # Pull from remote

# Building
eas build --platform ios     # Build iOS
eas build --platform android # Build Android
eas submit --platform ios    # Submit to App Store

# Debugging
npm run ios -- -- simulator="iPhone 15"  # Specific simulator
```

### Important Constants

```typescript
// constants/constants.ts
SPACING = 20                  // Base spacing
CARD_WIDTH = width - 80       // Card width
CARD_HEIGHT = CARD_WIDTH * 1.2 // Card height
SWIPE_THRESHOLD = 100         // Swipe distance
SWIPE_VELOCITY_THRESHOLD = 800 // Swipe speed
SPRING_CONFIG = { damping: 60, stiffness: 1000 } // Animation
```

### Key State Variables

```typescript
// context/AppStateContext.tsx
keptPhotoIds: string[]        // Photos user kept
trashQueue: GalleryPhoto[]    // Photos in trash
deletedCount: number          // Permanently deleted count
freedBytesTotal: number       // Total bytes freed
reviewedCount: number         // Total photos reviewed
```

---

## Support and Contribution

### Getting Help

1. Check this documentation first
2. Search existing issues on GitHub
3. Review Expo documentation: https://docs.expo.dev/
4. Review React Native docs: https://reactnative.dev/

### Contributing

1. Create feature branch from `develop`
2. Make changes with clear commit messages
3. Test thoroughly on iOS and Android
4. Update documentation
5. Create pull request with description

### Code Style

- Use TypeScript for all new files
- Follow existing naming conventions
- Add comments for complex logic
- Keep components small and focused
- Use hooks for reusable logic

---

**End of Developer Manual**

*Last Updated: 2026*  
*Version: 1.4.0*  
*Maintainer: Development Team*