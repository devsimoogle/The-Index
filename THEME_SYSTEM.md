# The Index - Advanced Theme System

## Overview
The Index now features a powerful, WordPress-like theme customization system that allows complete control over the visual appearance and layout of your blog.

## Features

### 🎨 **4 Pre-built Theme Presets**

1. **The Index (Classic)**
   - Layout: Classic (featured + grid)
   - Style: Clean, editorial, serif-focused
   - Perfect for: Traditional blog aesthetics

2. **Midnight Archive**
   - Layout: Grid (3-column card layout)
   - Style: Dark mode with blue accents
   - Perfect for: Modern, tech-focused content

3. **Sepia Manuscript**
   - Layout: Classic
   - Style: Warm, paper-like reading experience
   - Perfect for: Literary and academic content

4. **Cyber Librarian**
   - Layout: Minimal (terminal-inspired)
   - Style: High-contrast green-on-black
   - Perfect for: Tech/developer blogs

### 🎯 **Customization Options**

#### **Layout Templates**
- **Classic**: Featured post + alternating grid (original design)
- **Grid**: 3-column card-based layout
- **Magazine**: Hero post + grid (editorial style)
- **Minimal**: Simple list view (terminal-inspired)

#### **Typography Control**
- **Serif Fonts** (Headings): Cormorant Garamond, Merriweather, Lora, Playfair Display
- **Sans Fonts** (Body): Inter, Roboto, Open Sans, Space Mono
- **Mono Fonts** (UI): JetBrains Mono, Fira Code, Space Mono

#### **Scale (Base Font Size)**
- 90%, 95%, 100%, 105%, 110%
- Adjusts all text proportionally

#### **Border Radius**
- None, Small, Medium, Large, Full
- Controls roundness of UI elements

#### **Color Palette**
- Accent Color (highlights, links)
- Ink Color (primary text)
- Live color picker with hex values

## How to Use

### Accessing the Theme Editor
1. Navigate to Admin Panel (footer → Admin Login)
2. Enter password: `lis_secure_2025` or `admin`
3. Click the **"Appearance"** tab

### Applying a Preset Theme
1. In the Appearance tab, browse the 4 preset themes
2. Click on any theme card to apply it instantly
3. The entire site updates in real-time

### Customizing Your Theme
1. **Change Layout**: Select from Classic, Grid, Magazine, or Minimal
2. **Adjust Typography**: Choose fonts for headings, body, and UI
3. **Set Scale**: Increase/decrease overall text size
4. **Modify Radius**: Control button and card roundness
5. **Pick Colors**: Use color pickers for accent and ink colors

### Saving Custom Themes
- All customizations are automatically saved to localStorage
- Your custom theme persists across sessions
- Switching to a preset clears custom overrides

## Technical Details

### Theme Structure
```typescript
interface Theme {
  id: string;
  name: string;
  layout: 'classic' | 'grid' | 'magazine' | 'minimal';
  colors: {
    paper: string;    // Background
    ink: string;      // Primary text
    graphite: string; // Secondary text
    mist: string;     // Subtle backgrounds
    accent: string;   // Highlights
  };
  fonts: {
    serif: string;    // Headings
    sans: string;     // Body text
    mono: string;     // UI elements
  };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  scale: 0.9 | 0.95 | 1 | 1.05 | 1.1;
}
```

### CSS Variables
The theme system uses CSS custom properties for instant updates:
- `--color-paper`, `--color-ink`, `--color-graphite`, `--color-mist`, `--color-accent`
- `--font-serif`, `--font-sans`, `--font-mono`
- `--radius` (border-radius)
- `font-size` on `:root` (for scale)

### Storage
- **Active Theme ID**: `localStorage.getItem('lis_journal_theme_id')`
- **Custom Theme**: `localStorage.getItem('lis_journal_custom_theme')`

## Design Philosophy

This theme system was built to be:
- **Intuitive**: Visual previews and instant feedback
- **Powerful**: Deep customization without code
- **Beautiful**: Every preset is production-ready
- **Fast**: CSS variables enable instant theme switching
- **Persistent**: Themes survive page reloads

## Future Enhancements

Potential additions:
- Import/Export theme JSON
- More color controls (background, borders)
- Custom font uploads
- Theme marketplace/sharing
- Dark mode toggle
- Animation speed controls

---

**Created for The Index** - An open-source WordPress alternative for library science blogs.
