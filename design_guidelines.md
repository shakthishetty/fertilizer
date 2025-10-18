# Fertilizer Supply-Chain Dashboard - Design Guidelines

## Design Approach

**Selected Framework:** Modern Data Dashboard System  
**Primary Inspirations:** Linear (clean aesthetics), Notion (data tables), Vercel Analytics (graphs)  
**Rationale:** Utility-focused application requiring clarity, efficiency, and data readability over visual flourishes

---

## Core Design Principles

1. **Data First:** Maximize information density without cluttering
2. **Hierarchical Clarity:** Clear visual separation between different data views
3. **Scannable Information:** Easy-to-digest metrics and trends at a glance
4. **Professional Aesthetic:** Clean, modern, trustworthy appearance

---

## Color Palette

### Light Mode
- **Background:** 0 0% 98% (soft white)
- **Surface:** 0 0% 100% (pure white cards/panels)
- **Border:** 240 6% 90% (subtle gray)
- **Primary:** 145 65% 45% (agricultural green - represents growth/fertilizer)
- **Secondary:** 215 20% 65% (slate blue for data visualization)
- **Success:** 145 70% 45% (green for positive metrics)
- **Warning:** 45 93% 47% (amber for low availability alerts)
- **Danger:** 0 72% 51% (red for critical shortages)
- **Text Primary:** 222 47% 11% (dark slate)
- **Text Secondary:** 215 16% 47% (medium gray)

### Dark Mode
- **Background:** 222 47% 11% (dark slate)
- **Surface:** 217 33% 17% (elevated dark)
- **Border:** 217 20% 25% (subtle border)
- **Primary:** 145 60% 55% (brighter green)
- **All other colors:** Adjusted for dark mode contrast

---

## Typography

**Font Stack:** Inter (primary), system-ui (fallback)  
**Hierarchy:**
- **Page Headers:** 2.5rem (40px), font-weight 700, tracking tight
- **Section Headers:** 1.5rem (24px), font-weight 600
- **Card Titles:** 1.125rem (18px), font-weight 600
- **Body Text:** 0.875rem (14px), font-weight 400
- **Table Headers:** 0.75rem (12px), font-weight 600, uppercase, tracking wide
- **Data/Numbers:** 1rem (16px), font-weight 600, tabular-nums

---

## Layout System

**Spacing Units:** Tailwind scale using 2, 4, 6, 8, 12, 16, 20, 24  
**Common Patterns:**
- Card padding: p-6
- Section spacing: gap-8 between major sections
- Component spacing: gap-4 within components
- Dashboard margins: max-w-7xl mx-auto px-6

**Grid Structure:**
- Main content: Single column on mobile, flexible 2-3 column on desktop
- Metrics cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Data sections: Full-width with internal flex/grid

---

## Component Library

### 1. Top Metrics Dashboard
- **Layout:** 4 metric cards in a row (responsive to 2 or 1 column)
- **Card Style:** White surface, subtle shadow, rounded corners (rounded-lg)
- **Content:** Icon, metric title, large number, percentage change indicator
- **Visual Hierarchy:** Icon (muted color) → Title (secondary text) → Number (primary text, large) → Change (colored with up/down arrow)

### 2. Data Table Component
- **Structure:** Full-width card with header toolbar
- **Header Toolbar:** Title on left, search/filter controls on right
- **Table Style:**
  - Alternating row colors (zebra striping)
  - Hover states on rows
  - Sortable column headers with arrow indicators
  - Compact row height for density
  - Sticky header on scroll
- **Actions:** Inline action buttons, filter dropdowns, search input with icon

### 3. Graph/Chart Cards
- **Container:** White card with title, subtitle, and optional date range selector
- **Chart Types:** Line charts for trends, bar charts for comparisons
- **Color Usage:** Use primary green as main data color, secondary blue for comparison data
- **Axes:** Light grid lines, clear labels, responsive font sizes
- **Tooltips:** Dark overlay with white text, showing precise data on hover

### 4. Top/Bottom Lists (Top 5 Requirements/Availability)
- **Layout:** Two cards side-by-side (responsive to stack)
- **List Style:** Ranked list with position number, fertilizer name, metric value, and visual bar indicator
- **Visual Indicator:** Horizontal bar showing relative value (green for high, amber/red for low)
- **Typography:** Bold numbers, medium weight names

### 5. Navigation/Header
- **Style:** Fixed header with company branding on left
- **Elements:** Logo, dashboard title, theme toggle, user profile
- **Height:** 64px with subtle bottom border
- **Background:** Matches surface color with slight transparency/blur effect

### 6. Filters & Controls Panel
- **Position:** Top of data sections or sidebar
- **Components:** Dropdown selects for state/region, date range picker, fertilizer type multi-select
- **Style:** Grouped controls with labels, clean borders, consistent height
- **Layout:** Flex row wrapping to column on mobile

---

## Specific Dashboard Sections

### Section 1: Overview Metrics (Top of Page)
- 4 key metrics: Total States Covered, Total Fertilizer Types, Critical Shortages, Average Availability
- Large numbers with trend indicators

### Section 2: Interactive Data Table
- Full-featured table with all fertilizer data
- Sortable by all columns
- Filterable by state, fertilizer type, availability level
- Pagination or infinite scroll

### Section 3: Yearly Trend Visualization
- Line graph showing selected fertilizer(s) availability/requirement across 12 months
- Dropdown to select fertilizer type(s)
- Legend with toggleable data series

### Section 4: Top Insights (Side-by-Side Cards)
- Left: Top 5 Most Required Fertilizers (descending bars, green)
- Right: Top 5 Least Available Fertilizers (descending bars, red/amber)

---

## Visual Treatment

**Shadows:**
- Cards: shadow-sm (subtle elevation)
- Hover states: shadow-md
- Modals/dropdowns: shadow-lg

**Borders:**
- Consistent 1px borders using border color
- Rounded corners: rounded-lg for cards, rounded-md for inputs

**Animations:**
- Minimal and purposeful only
- Smooth transitions on hover states (150ms ease)
- Loading skeletons for data fetching

**Icons:**
- Use Heroicons throughout for consistency
- 20px for inline icons, 24px for standalone

---

## Responsive Behavior

**Mobile (< 768px):**
- Stack all cards vertically
- Tables convert to card views or horizontal scroll
- Reduce padding to p-4
- Collapse filters into expandable panel

**Tablet (768px - 1024px):**
- 2-column layouts
- Maintain table structure with horizontal scroll

**Desktop (> 1024px):**
- Full multi-column layouts
- Expanded tables with all columns visible
- Side-by-side comparisons

---

## Data Visualization Guidelines

**Chart Colors:**
- Primary data: Use green from palette
- Comparison data: Use secondary blue
- Negative/shortage data: Use warning/danger colors
- Multiple series: Use varied hues with good contrast

**Graph Styling:**
- Clean, minimal grid lines
- Clear axis labels
- Interactive tooltips on hover
- Responsive sizing

---

This design creates a professional, data-focused dashboard that prioritizes clarity and usability while maintaining a modern, polished aesthetic appropriate for enterprise software.