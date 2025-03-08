# Changelog

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