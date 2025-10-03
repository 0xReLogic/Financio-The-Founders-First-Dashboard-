# FINANCIO - DESIGN GUIDELINES

## Design Philosophy
Dashboard keuangan visual untuk bootstrapped founders dan UMKM dengan **leaf/nature theme** - clean, visual, dan smart. Frontend-first approach dengan mock data untuk rapid prototyping.

## Color System

**Primary Palette - Nature/Leaf Theme:**
- Primary Green: `#65a30d` (main brand, success, income)
- Primary Yellow: `#facc15` (accents, warnings)
- Secondary Green: `#16a34a` (secondary actions)
- Light Yellow: `#fef08a` (highlights)

**Semantic Colors:**
- Success/Income: Green `#65a30d`
- Danger/Expense: Red `#dc2626`
- Warning/Alerts: Yellow `#facc15`
- Info: Cyan `#0891b2`

**Backgrounds:**
- Primary: White `#ffffff`
- Secondary: Light yellow tint `#fefce8`
- Card: White `#ffffff`
- Accent: Light green tint `#f7fee7`

**Neutrals:** Gray scale from `#fafaf9` to `#1c1917`

## Typography
- **Font Family:** Inter (via Google Fonts)
- **Scale:** 12px (xs) to 36px (4xl)
- **Weights:** Regular (400), Medium (500), Semibold (600), Bold (700)

## Layout System
- **Spacing Units:** 4px, 8px, 12px, 16px, 24px, 32px, 48px
- **Border Radius:** 6px (small), 8px (cards/buttons), 12px (large cards), 16px (modals)
- **Sidebar:** 240px fixed width (desktop), full-screen overlay (mobile)
- **Container:** Max-width with responsive padding

## Component Patterns

### Cards & Containers
- Stats cards with icon, label, value, trend indicator (color-coded)
- White backgrounds with subtle shadows
- Green/yellow accent borders for highlights
- Rounded corners (8-12px)

### Navigation
- Fixed sidebar with active state (green/yellow highlight)
- Header with logo, notifications bell, user profile dropdown, settings cog
- Mobile hamburger menu with full-screen overlay

### Forms & Inputs
- Clear labels above inputs
- Real-time validation with inline errors
- Currency auto-formatting (Rp + comma separators)
- File upload with preview
- Loading states on buttons
- Success/error toasts

### Data Visualization
- **Charts:** Recharts/Chart.js with green/yellow color scheme
- **Line Charts:** Cash flow visualization (30-day trend)
- **Pie Charts:** Expense breakdown by category
- **Bar Charts:** Monthly comparisons
- Animated on load, tooltips on hover

### Transaction Items
- Type indicators: `->` income (green), `<-` expense (red)
- Category badges with color coding
- Date/time stamps
- Action buttons: View receipt, Edit, Delete
- Hover effects for interactivity

### Modals
- Centered overlay with backdrop blur
- Header with title and close button
- Form fields with proper spacing
- Action buttons at bottom (Cancel/Save)
- 16px border radius

## Key Features Design

### Dashboard Overview
- 4 stats cards (Income, Expense, Balance, Trend)
- 2-column chart layout (Cash Flow + Expense Pie)
- AI Advisor CTA banner (green gradient)
- Recent transactions list with quick actions

### Transactions Page
- Search bar + filters (All, Category, Date)
- Grouped by date
- Pagination controls
- Quick add button (floating or header)

### AI Financial Advisor
- Big "Get Analysis" button (green, prominent)
- Health score circle visualization (0-100 scale)
- Color-coded concerns (red) and recommendations (green)
- Usage quota display (3/10 per month)
- Analysis history cards

### Authentication
- Centered layout on colored background (light green/yellow tint)
- Logo at top
- Single-column form
- Show/hide password toggle
- Link to alternate auth page
- Minimal, clean design

## Interactions & Animations
- **Minimal animations:** Smooth transitions (200-300ms)
- **Hover states:** Subtle scale/shadow on cards
- **Loading states:** Skeleton screens or spinners
- **Page transitions:** Fade or slide (mobile)
- **Chart animations:** Entrance animations on load

## Responsive Strategy
- **Desktop:** Full sidebar, 2-column dashboard
- **Tablet:** Collapsible sidebar, adjusted charts
- **Mobile:** Hamburger menu, stacked layouts, swipe gestures for transactions

## Images
No hero images needed - this is a dashboard/SaaS product. Focus on:
- Icons from Heroicons (outline style)
- Chart visualizations (data-driven)
- Empty states with simple illustrations
- User avatars in header