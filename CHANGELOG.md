# Changelog

## [1.1.0] - 2024-03-20

### feat(state): Improve state management and code quality

This release focuses on improving state management, error handling, and overall code quality
through extensive refactoring and cleanup.

### Key Changes:
- 🔄 Centralize state management in AppStateProvider
- 🧹 Remove duplicate state logic across components
- ✨ Add proper validation for CSV uploads
- 🐛 Fix date comparison and timetable update issues
- 🔍 Improve error handling and logging

### Details:

#### State Management:
- Refactor AppStateProvider to use specific actions instead of setState
- Add dedicated actions for timetable, login, and prayer updates
- Implement proper memoization for performance optimization
- Remove redundant state updates and improve data flow

#### Data Validation:
- Add comprehensive CSV field validation
- Implement proper date format checking
- Add user feedback for invalid CSV formats
- Improve error handling for data processing

#### Code Quality:
- Remove unused imports and variables
- Clean up TypeScript types and interfaces
- Add proper error boundaries and null checks
- Improve code organization and readability

#### Component Updates:
- Update CSVReader with proper validation
- Refactor EditingGrid for better state management
- Clean up Login component
- Optimize Timetable component rendering

#### Technical Implementation:
- Use TypeScript strict mode effectively
- Implement proper error handling patterns
- Add development-only logging
- Improve type safety across components

## [1.0.0] - 2024-03-08

### feat(layout): Improve mobile responsiveness and fix visual issues

This commit introduces several improvements to the mobile layout and fixes
various visual issues to enhance the user experience.

### Key Changes:
- 🎨 Restore background image with proper overlay
- 📱 Implement dynamic text scaling for Hadith section
- 🔧 Fix scrolling issues in mobile view
- 📐 Optimize component spacing and layout

### Details:

#### Layout & Spacing:
- Remove fixed height percentages from Timetable section
- Add 12px gap between Timetable and Hadith sections
- Adjust container heights to prevent overflow
- Fix padding and margin inconsistencies

#### Background:
- Add mosque pattern background with lantern
- Implement dark overlay (0.85 opacity) for better readability
- Configure proper background sizing and positioning

#### Text Scaling:
- Create new useTextFit hook for dynamic text sizing
- Implement binary search algorithm for optimal font size
- Add ResizeObserver for responsive text adjustments
- Set font size bounds (8px - 40px) for readability

#### Performance:
- Add overflow handling to prevent unnecessary scrolling
- Optimize container nesting and flex layout
- Improve render efficiency with proper height calculations

#### Technical Implementation:
- Use CSS Grid and Flexbox for responsive layouts
- Implement dynamic viewport height (dvh) for mobile
- Add proper TypeScript types for new components
- Ensure proper cleanup of resize observers

#### Testing:
- Verified on iPhone 12 Pro
- Tested in both portrait and landscape modes
- Confirmed text scaling works with various content lengths
- Validated scrolling behavior across different sections

## [1.1.1] - 2024-03-21

### feat(transitions): Add smooth page transitions

This patch introduces smooth page transitions between different views to enhance
the user experience and provide better visual feedback during navigation.

### Key Changes:
- ✨ Add smooth page transitions using Framer Motion
- 🔄 Implement spring-based animations for natural feel
- 🎯 Configure transitions to exclude settings pages

### Details:

#### Animation Implementation:
- Add AnimatePresence for coordinated enter/exit animations
- Implement spring physics for smoother motion
- Configure proper animation parameters (stiffness: 260, damping: 20)
- Add subtle vertical slide with fade effect

#### Technical Implementation:
- Update MainLayout with motion.div wrapper
- Configure Routes with location-based transitions
- Add proper cleanup for navigation timeouts
- Maintain original navigation timing logic

## [1.1.2] - 2024-03-21

### feat(countdown): Enhance countdown pages with next prayer info

This patch adds a new component to display upcoming prayer information on the
countdown, Adhaan, and Jamaat pages.

### Key Changes:
- ✨ Add next prayer info component with glass effect
- 🎨 Improve spacing and layout across countdown pages
- 🔄 Show contextual information based on current state

### Details:

#### Component Features:
- Add glass-effect card for next prayer information
- Display dynamic titles based on current context
- Show formatted times with 12-hour clock
- Implement proper spacing and positioning

#### Technical Implementation:
- Add getNextTimeInfo logic for different scenarios
- Handle edge cases (last prayer of the day)
- Maintain consistent styling across pages
- Ensure proper TypeScript typing 