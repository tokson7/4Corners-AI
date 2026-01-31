export interface Article {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  featured: boolean
  content: string
}

export const categories = [
  'All',
  'Color Theory',
  'Typography',
  'Design Systems',
  'Workflow',
  'Accessibility',
]

export const articles: Article[] = [
  // Article 1: Color Palette Mistakes
  {
    slug: "10-color-palette-mistakes",
    title: "10 Color Palette Mistakes to Avoid in 2025",
    excerpt: "Learn the most common color theory mistakes designers make and how to fix them for better, more accessible designs.",
    category: "Color Theory",
    author: "4Corners AI Team",
    date: "2025-01-15",
    readTime: "8 min read",
    featured: true,
    content: `
# 10 Color Palette Mistakes to Avoid in 2025

Color is one of the most powerful tools in a designer's arsenal. Yet, it's also one of the most commonly misused. Whether you're building a brand identity or designing a user interface, avoiding these mistakes will elevate your work from amateur to professional.

## 1. Using Too Many Colors

**The Mistake:** Adding 6, 7, or even 10 different colors to your palette.

**Why It's Wrong:** Too many colors create visual chaos and dilute your brand identity. Users won't know where to look, and your design will feel unprofessional.

**The Fix:** Stick to a primary color, a secondary color, and neutral grays. That's it. You can add accent colors sparingly, but 3-5 colors maximum is the sweet spot.

**Example:** Stripe uses primarily purple, with blue as secondary and grays for everything else. Simple, effective, memorable.

## 2. Ignoring Accessibility

**The Mistake:** Choosing colors that look beautiful but fail accessibility standards.

**Why It's Wrong:** 1 in 12 men and 1 in 200 women have color vision deficiency. If your text-background contrast is poor, millions of users can't read your content.

**The Fix:** Always check contrast ratios. Aim for WCAG AA (4.5:1) minimum, AAA (7:1) for body text. Use tools like WebAIM's contrast checker or built-in browser DevTools.

**Pro Tip:** 4Corners AI automatically generates accessible color palettes with proper contrast ratios built in.

## 3. Not Testing in Context

**The Mistake:** Choosing colors in isolation without seeing them in actual designs.

**Why It's Wrong:** A color that looks perfect on a white artboard might look terrible on your website's dark background.

**The Fix:** Always test colors in multiple contexts:
- Light mode and dark mode
- Different screen sizes
- Various background colors
- Alongside your typography

## 4. Copying Trends Blindly

**The Mistake:** "Everyone's using neon gradients, so we should too!"

**Why It's Wrong:** Trends come and go. What's hot today looks dated tomorrow. Your brand needs longevity.

**The Fix:** Start with timeless color theory principles. Add contemporary touches, but don't let trends dictate your entire palette.

**Classic Example:** IBM's blue has remained consistent for decades. It's recognizable, professional, and timeless.

## 5. Forgetting About Color Psychology

**The Mistake:** Picking colors you personally like without considering what they communicate.

**Why It's Wrong:** Colors have psychological associations. Blue = trust. Red = urgency. Green = growth. Wrong color = wrong message.

**The Fix:** Research color psychology for your industry:
- Finance: Blue, green (trust, growth)
- Healthcare: Blue, white (calm, clean)
- Food: Red, yellow (appetite, energy)
- Tech: Blue, purple (innovation, intelligence)

## 6. Poor Color Naming

**The Mistake:** Naming colors "blue-1", "blue-2", "dark-blue".

**Why It's Wrong:** Inconsistent naming creates confusion. Developers won't know which blue to use.

**The Fix:** Use systematic naming:
- Semantic: primary, secondary, accent
- Numeric: blue-50 to blue-950 (Tailwind style)
- Functional: text-primary, bg-surface, border-subtle

## 7. Not Building Shades

**The Mistake:** Having one blue, one green, one purple—no variations.

**Why It's Wrong:** You need lighter and darker versions for hover states, borders, backgrounds, and depth.

**The Fix:** Generate 11 shades for each color:
- 50 (lightest)
- 100, 200, 300, 400, 500 (base)
- 600, 700, 800, 900, 950 (darkest)

**4Corners AI Tip:** Our AI automatically generates perfect shade scales with proper brightness progression.

## 8. Clashing Undertones

**The Mistake:** Mixing warm and cool versions of the same color family.

**Why It's Wrong:** A warm purple and a cool purple look jarring together. It feels "off" even if you can't articulate why.

**The Fix:** Pick a temperature and stick with it. If your primary is warm, keep your secondary and accents warm too.

**Test:** Place colors next to each other. If they clash, check undertones.

## 9. Forgetting Semantic Colors

**The Mistake:** Only defining brand colors, ignoring UI needs.

**Why It's Wrong:** You need success (green), error (red), warning (yellow), and info (blue) for proper UI communication.

**The Fix:** Include semantic colors in your palette:
- Success: Green (light and dark shades)
- Error: Red (light and dark shades)
- Warning: Yellow/Orange (light and dark shades)
- Info: Blue (light and dark shades)

## 10. Not Documenting Your Palette

**The Mistake:** Creating a palette but never writing down the rules for using it.

**Why It's Wrong:** Inconsistent usage across designers and developers. Your brand looks unprofessional.

**The Fix:** Document:
- When to use each color
- Minimum contrast requirements
- Hover state variations
- Dark mode alternatives
- Do's and don'ts with examples

---

## Conclusion

Avoiding these mistakes will instantly improve your color game. Remember: good color palettes are simple, accessible, consistent, and purposeful.

**Ready to create a perfect palette?** Try 4Corners AI—our AI automatically avoids all these mistakes and generates production-ready color systems in seconds.

[Try 3 Free Generations →](/generate)
`
  },
  
  // Article 2: Typography Hierarchy
  {
    slug: "typography-hierarchy-explained",
    title: "Typography Hierarchy Explained: A Complete Guide",
    excerpt: "Master the art of typography hierarchy to create clear, scannable, and beautiful designs that guide users effortlessly.",
    category: "Typography",
    author: "4Corners AI Team",
    date: "2025-01-20",
    readTime: "10 min read",
    featured: false,
    content: `
# Typography Hierarchy Explained: A Complete Guide

Typography hierarchy is the backbone of great design. It's how you guide users' eyes through content, communicate importance, and create visual rhythm. Get it wrong, and your design feels chaotic. Get it right, and everything just works.

## What Is Typography Hierarchy?

Typography hierarchy is the system of organizing text to show what's most important. It uses size, weight, color, and spacing to create visual levels that help readers understand structure at a glance.

**Think of it like a newspaper:**
- Headline (largest, boldest)
- Subheading (medium, semi-bold)
- Body text (readable size, regular weight)
- Captions (smallest, sometimes italic)

## Why Hierarchy Matters

Without clear hierarchy, all text looks the same. Users don't know:
- Where to start reading
- What's important
- How information is organized
- What action to take

**Result:** Confusion, frustration, and users leaving your site.

**With hierarchy:** Users scan effortlessly, find what they need, and take action.

## The Typography Scale

Professional designers use a modular scale—a mathematical ratio that creates harmonious size relationships.

### Common Scales:

**1. Minor Third (1.2)**
- Subtle, elegant
- Good for body-heavy content
- Example: 16px → 19px → 23px → 28px

**2. Major Third (1.25)**
- Balanced, versatile
- Most common choice
- Example: 16px → 20px → 25px → 31px

**3. Perfect Fourth (1.333)**
- Strong hierarchy
- Good for headings
- Example: 16px → 21px → 28px → 37px

**4. Golden Ratio (1.618)**
- Maximum contrast
- Best for marketing sites
- Example: 16px → 26px → 42px → 68px

**4Corners AI generates typography scales automatically using proven ratios for perfect hierarchy.**

## The 5 Levels of Hierarchy

### Level 1: Display/Hero Text
- **Size:** 48-96px (desktop)
- **Weight:** Bold (700) or Black (800-900)
- **Usage:** Landing page heroes, major statements
- **Line Height:** 1.1-1.2 (tight)

### Level 2: Headings (H1)
- **Size:** 32-48px
- **Weight:** Bold (700)
- **Usage:** Page titles, section headers
- **Line Height:** 1.2-1.3

### Level 3: Subheadings (H2-H3)
- **Size:** 24-32px (H2), 20-24px (H3)
- **Weight:** Semibold (600) or Bold (700)
- **Usage:** Section dividers, content organization
- **Line Height:** 1.3-1.4

### Level 4: Body Text
- **Size:** 16-18px (desktop), 14-16px (mobile)
- **Weight:** Regular (400)
- **Usage:** Paragraphs, main content
- **Line Height:** 1.5-1.7 (comfortable reading)

### Level 5: Small Text
- **Size:** 12-14px
- **Weight:** Regular (400) or Medium (500)
- **Usage:** Captions, labels, footnotes
- **Line Height:** 1.4-1.5

## Font Pairing Rules

### Rule 1: Contrast Is Key
Pair fonts that are different enough to create clear hierarchy.

**Good Pairing:**
- Heading: Inter (geometric sans-serif)
- Body: Merriweather (serif)

**Bad Pairing:**
- Heading: Helvetica (sans-serif)
- Body: Arial (sans-serif)
- Problem: Too similar, no contrast

### Rule 2: Limit to 2-3 Fonts
- **Heading font:** One
- **Body font:** One
- **Accent/mono font:** Optional (for code, etc.)

More than 3 fonts = visual chaos.

### Rule 3: Match Personality
Your fonts should match your brand:
- **Professional:** Inter + Open Sans
- **Creative:** Playfair Display + Raleway
- **Technical:** JetBrains Mono + IBM Plex Sans
- **Friendly:** Nunito + Lato

**4Corners AI automatically pairs fonts that work together based on your brand personality.**

## Weight & Color for Hierarchy

Size isn't the only tool. Use weight and color strategically.

### Font Weight Hierarchy:
1. **Black (900):** Reserved for display text
2. **Bold (700):** Headings, emphasis
3. **Semibold (600):** Subheadings, strong labels
4. **Medium (500):** Buttons, important UI text
5. **Regular (400):** Body text
6. **Light (300):** Deemphasized text

### Color Hierarchy:
- **Primary text:** Full opacity black/white (high contrast)
- **Secondary text:** 70-80% opacity (subheadings, labels)
- **Tertiary text:** 50-60% opacity (captions, metadata)

**Never:** Go below 50% opacity or you'll break accessibility.

## Spacing & Rhythm

Hierarchy isn't just about the text—it's about the space around it.

### Vertical Rhythm:
- **Large heading:** 1.5-2x spacing below
- **Subheading:** 1.25-1.5x spacing below
- **Paragraph:** 1x spacing below
- **List items:** 0.5x spacing between

**Formula:** Spacing should match your scale ratio.

### Line Length:
- **Optimal:** 50-75 characters per line
- **Too short:** <40 characters (choppy reading)
- **Too long:** >80 characters (loses reader on line breaks)

**Pro Tip:** Use max-width: 65ch for perfect line length.

## Common Mistakes

### Mistake 1: Not Enough Contrast
**Problem:** H1 is 24px, H2 is 22px—barely noticeable difference.

**Fix:** Use your scale. H1 should be at least 1.5x larger than H2.

### Mistake 2: Too Many Weights
**Problem:** Using light, regular, medium, semibold, bold, and black all at once.

**Fix:** Pick 2-3 weights maximum and stick to them.

### Mistake 3: Inconsistent Line Height
**Problem:** Headlines at 1.1 line-height, body at 1.8.

**Fix:** Use a consistent scale: 1.2 (tight) for headings, 1.5-1.7 (comfortable) for body.

### Mistake 4: Center-Aligning Body Text
**Problem:** Centered paragraphs are hard to read.

**Fix:** Left-align body text always. Center is only for headings and short text.

## Responsive Typography

Your hierarchy should adapt to screen size.

### Desktop:
- Display: 72px
- H1: 48px
- H2: 32px
- Body: 18px

### Mobile:
- Display: 48px
- H1: 32px
- H2: 24px
- Body: 16px

**Use clamp() for fluid typography:**
\`\`\`css
h1 {
  font-size: clamp(32px, 5vw, 48px);
}
\`\`\`

## Tools & Resources

1. **Type Scale:** typescale.com
2. **Font Pairing:** fontpair.co
3. **Google Fonts:** fonts.google.com
4. **4Corners AI:** Automatic typography systems

---

## Conclusion

Typography hierarchy isn't about making text pretty—it's about making content clear, scannable, and accessible. Follow these principles, and your designs will instantly feel more professional.

**Need perfect typography fast?** Try 4Corners AI—we generate complete typography systems with proven hierarchies and font pairings in seconds.

[Get 3 Free Generations →](/generate)
`
  },
  
  // Article 3: Design Tokens
  {
    slug: "design-tokens-explained",
    title: "Design Tokens: What They Are and Why You Need Them",
    excerpt: "Design tokens are revolutionizing how teams build consistent products. Learn what they are and how to implement them effectively.",
    category: "Design Systems",
    author: "4Corners AI Team",
    date: "2025-01-25",
    readTime: "7 min read",
    featured: false,
    content: `
# Design Tokens: What They Are and Why You Need Them

If you've ever struggled to keep colors consistent across web, iOS, and Android—or spent hours updating every instance of a font size—design tokens are your solution.

## What Are Design Tokens?

Design tokens are the **visual design atoms** of your design system. They're named variables that store design decisions like colors, spacing, typography, and more.

**Instead of:**
\`\`\`css
.button {
  background-color: #8B5CF6;
  padding: 12px 24px;
  font-size: 16px;
}
\`\`\`

**You use:**
\`\`\`css
.button {
  background-color: var(--color-primary-500);
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--text-base);
}
\`\`\`

**Why this matters:** Change \`--color-primary-500\` once, and it updates everywhere. No more find-and-replace nightmares.

## The Problem Tokens Solve

### Before Tokens:
- Designer updates brand color in Figma
- Developer manually changes 47 CSS files
- iOS developer changes 23 Swift files
- Android developer changes 19 XML files
- Result: Inconsistencies, errors, wasted time

### With Tokens:
- Designer updates token value
- Export to JSON
- All platforms auto-update
- Result: Consistency, speed, accuracy

## Types of Design Tokens

### 1. Color Tokens
\`\`\`json
{
  "color": {
    "primary": {
      "50": "#f5f3ff",
      "500": "#8b5cf6",
      "900": "#4c1d95"
    },
    "semantic": {
      "success": "#22c55e",
      "error": "#ef4444",
      "warning": "#f59e0b"
    }
  }
}
\`\`\`

### 2. Spacing Tokens
\`\`\`json
{
  "spacing": {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "6": "24px",
    "8": "32px"
  }
}
\`\`\`

### 3. Typography Tokens
\`\`\`json
{
  "font": {
    "family": {
      "heading": "Inter, sans-serif",
      "body": "Open Sans, sans-serif"
    },
    "size": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px"
    },
    "weight": {
      "regular": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700"
    }
  }
}
\`\`\`

### 4. Other Common Tokens
- Border radius (sm, md, lg, full)
- Shadows (sm, md, lg, xl)
- Breakpoints (mobile, tablet, desktop)
- Z-index (dropdown, modal, tooltip)
- Transitions (fast, base, slow)

## Token Naming Conventions

### Bad Naming:
- \`blue-1\`, \`blue-2\`, \`darkBlue\`
- Problem: Not scalable, unclear usage

### Good Naming (Semantic):
- \`color-primary-500\`
- \`color-text-primary\`
- \`color-bg-surface\`
- Clear: What it's for, not what it looks like

### Best Practice: Two-Tier System

**Tier 1: Core Tokens** (raw values)
\`\`\`json
{
  "purple-500": "#8b5cf6",
  "gray-900": "#111827"
}
\`\`\`

**Tier 2: Semantic Tokens** (usage-based)
\`\`\`json
{
  "color-primary": "var(--purple-500)",
  "color-text": "var(--gray-900)"
}
\`\`\`

**Why:** Change purple to blue? Update tier 1, tier 2 inherits automatically.

## Implementing Design Tokens

### Step 1: Define in JSON
\`\`\`json
{
  "color": {
    "primary": {
      "500": "#8b5cf6"
    }
  }
}
\`\`\`

### Step 2: Transform to CSS Variables
\`\`\`css
:root {
  --color-primary-500: #8b5cf6;
}
\`\`\`

### Step 3: Use in Components
\`\`\`css
.button {
  background: var(--color-primary-500);
}
\`\`\`

### Step 4: Transform to Other Platforms
- **iOS:** Swift constants
- **Android:** XML resources
- **React Native:** JavaScript objects

## Tools for Design Tokens

1. **Style Dictionary** (by Amazon)
   - Transforms tokens to any format
   - Industry standard
   - Free and open-source

2. **Figma Tokens Plugin**
   - Sync tokens between Figma and code
   - Two-way sync
   - Popular in enterprises

3. **Theo** (by Salesforce)
   - Another token transformer
   - Great documentation

4. **4Corners AI**
   - Generates complete token sets automatically
   - Exports to CSS, Tailwind, React
   - Perfect for quick starts

## Real-World Example: Stripe

Stripe uses design tokens for consistency across:
- Marketing site (Next.js)
- Dashboard (React)
- iOS app (Swift)
- Android app (Kotlin)
- Email templates (HTML)

**One token change updates all platforms.** This is how they ship so fast.

## Benefits of Design Tokens

### For Designers:
- Single source of truth
- Easy updates across files
- Faster iterations
- Less miscommunication

### For Developers:
- No hardcoded values
- Easy theming (light/dark mode)
- Platform consistency
- Faster implementation

### For Teams:
- Designers and developers speak same language
- Fewer bugs from inconsistency
- Faster shipping
- Better handoff process

### For Users:
- Consistent experience
- Accessible designs (tokens enforce standards)
- Faster load times (fewer CSS rules)

## Common Mistakes

### Mistake 1: Too Granular
**Problem:** Creating tokens for every single value.

**Example:**
- \`spacing-13\`: 13px
- \`spacing-14\`: 14px
- \`spacing-15\`: 15px

**Fix:** Use a scale (4, 8, 12, 16, 24, 32). Skip arbitrary values.

### Mistake 2: Not Semantic Enough
**Problem:** \`color-purple-500\` used everywhere.

**Fix:** Use \`color-primary\` which references \`purple-500\`. When rebrand happens, change once.

### Mistake 3: Inconsistent Naming
**Problem:** \`primary-color\`, \`ColorPrimary\`, \`primaryColor\` all in same codebase.

**Fix:** Pick a convention (kebab-case recommended) and stick to it.

## Getting Started Today

### 1. Start Small
Don't tokenize everything at once. Start with:
- Colors (most impact)
- Spacing (common pain point)
- Typography (foundation)

### 2. Use Existing Standards
Don't reinvent. Use Tailwind's scale or Material Design's system as a starting point.

### 3. Document Usage
For each token, document:
- What it's for
- Where to use it
- Where NOT to use it

### 4. Automate Export
Use tools like Style Dictionary to automatically generate platform-specific code from your tokens.

---

## Conclusion

Design tokens aren't just a trend—they're the foundation of modern design systems. They save time, ensure consistency, and make cross-platform design actually manageable.

**Want perfect tokens without the setup?** 4Corners AI generates complete, production-ready design token systems automatically. No configuration needed.

[Try 3 Free Generations →](/generate)
`
  },
  
  // Article 4: Figma to Code
  {
    slug: "figma-to-code-guide",
    title: "From Figma to Code: Complete Developer Handoff Guide",
    excerpt: "Bridge the gap between design and development with this comprehensive guide to smooth Figma-to-code workflows.",
    category: "Workflow",
    author: "4Corners AI Team",
    date: "2025-01-28",
    readTime: "12 min read",
    featured: false,
    content: `
# From Figma to Code: Complete Developer Handoff Guide

The designer-developer handoff is where projects often derail. Designers create beautiful Figma files, developers struggle to interpret them, and the final product looks nothing like the design. This guide fixes that.

## The Problem with Traditional Handoff

**Designer's Perspective:**
"I made it pixel-perfect in Figma. Why doesn't the website look the same?"

**Developer's Perspective:**
"These designs are beautiful, but half the styles aren't specified and nothing's responsive."

**Result:** Frustration, back-and-forth, missed deadlines.

## The Modern Handoff Process

### Phase 1: Design with Development in Mind

#### 1. Use Design Systems
Don't design from scratch. Use components:
- Buttons (defined states)
- Input fields (all variations)
- Cards (reusable styles)
- Typography (consistent scale)

**4Corners AI generates design systems perfect for this.**

#### 2. Name Layers Properly
\`\`\`
❌ Rectangle 1, Rectangle 2, Group 5
✅ header-nav, hero-title, cta-button
\`\`\`

Developers appreciate semantic names.

#### 3. Use Auto Layout
Every component should use Auto Layout:
- Padding defined
- Spacing consistent
- Responsive behavior clear

#### 4. Define Interactive States
For every interactive element, design:
- Default
- Hover
- Active/pressed
- Disabled
- Loading (if applicable)
- Error (for forms)

#### 5. Create Responsive Breakpoints
Show designs at:
- Mobile (375px)
- Tablet (768px)
- Desktop (1440px)

Don't assume developers will "figure it out."

### Phase 2: Prepare for Handoff

#### 1. Organize Figma File
Structure your file:
\`\`\`
📁 Design System
  └─ Colors
  └─ Typography
  └─ Components

📁 Pages
  └─ Homepage
  └─ Dashboard
  └─ Settings

📁 Specs
  └─ Spacing guide
  └─ Breakpoints
  └─ Interaction notes
\`\`\`

#### 2. Add Developer Notes
Use Figma comments:
- "This nav should be sticky"
- "Cards have max-width: 400px"
- "Use CSS Grid here, not flexbox"

#### 3. Export Assets
Prepare assets developers need:
- Icons (SVG)
- Images (WebP + fallback)
- Logos (multiple formats)

Name files properly:
\`\`\`
icon-close.svg
img-hero-2x.webp
logo-dark.svg
\`\`\`

#### 4. Document Design Tokens
Export color, spacing, typography values:

\`\`\`json
{
  "colors": {
    "primary": "#8B5CF6",
    "text": "#1F2937"
  },
  "spacing": {
    "card-padding": "24px",
    "section-margin": "64px"
  },
  "typography": {
    "heading": "Inter",
    "body": "Open Sans"
  }
}
\`\`\`

**4Corners AI exports this automatically.**

### Phase 3: Developer Implementation

#### 1. Set Up Design Tokens
Before writing components, set up CSS variables:

\`\`\`css
:root {
  /* Colors */
  --color-primary: #8b5cf6;
  --color-text: #1f2937;
  
  /* Spacing */
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  
  /* Typography */
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Open Sans', sans-serif;
  --text-base: 16px;
  --text-lg: 18px;
}
\`\`\`

#### 2. Build Component Library First
Don't start with pages. Build components:

1. **Button:**
\`\`\`jsx
<Button variant="primary" size="lg">
  Click me
</Button>
\`\`\`

2. **Card:**
\`\`\`jsx
<Card padding="lg" shadow="md">
  {children}
</Card>
\`\`\`

3. **Input:**
\`\`\`jsx
<Input 
  type="email" 
  error={errors.email}
  placeholder="your@email.com"
/>
\`\`\`

#### 3. Match Figma Spacing Exactly
Use browser DevTools overlay on Figma:
- Measure padding
- Measure margins
- Measure gaps

**Pro Tip:** Install Figma Dev Mode for automatic spacing measurements.

#### 4. Implement Responsive Behavior
Use the breakpoints from design:

\`\`\`css
/* Mobile first */
.hero {
  padding: var(--spacing-md);
}

/* Tablet */
@media (min-width: 768px) {
  .hero {
    padding: var(--spacing-lg);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .hero {
    padding: var(--spacing-xl);
  }
}
\`\`\`

#### 5. Test Across Browsers
What looks perfect in Chrome might break in Safari:
- Test in Chrome, Firefox, Safari
- Check iOS Safari (different rendering)
- Verify Edge (different font rendering)

### Phase 4: Collaboration Tools

#### 1. Figma Dev Mode
Enables:
- Inspect spacing automatically
- Copy CSS directly
- See responsive behavior
- Export assets easily

**Worth the upgrade.**

#### 2. Zeplin (Alternative)
- Automatic specs generation
- Asset export
- Style guide generation

#### 3. Storybook
Build components in isolation:
- Test all states
- Document usage
- Share with designers for approval

#### 4. Percy / Chromatic
Visual regression testing:
- Catch unintended changes
- Compare screenshots
- Prevent design drift

### Phase 5: Quality Assurance

#### Designer Review Checklist:
- [ ] Spacing matches design
- [ ] Colors exact (use hex codes)
- [ ] Typography correct (font, size, weight)
- [ ] Hover states work
- [ ] Responsive behavior correct
- [ ] Animations smooth (if any)
- [ ] Accessibility maintained

#### Developer Test Checklist:
- [ ] Works on mobile
- [ ] Works on tablet
- [ ] Works on desktop
- [ ] Works in all browsers
- [ ] Loads fast
- [ ] Accessible (keyboard nav, screen readers)
- [ ] No console errors

## Common Handoff Mistakes

### Mistake 1: "Just Eyeball It"
**Problem:** Developer guesses spacing and colors.

**Result:** Inconsistent design, constant revisions.

**Fix:** Use exact values from Figma. No guessing.

### Mistake 2: Desktop-Only Designs
**Problem:** Only desktop designs provided.

**Result:** Developer makes up mobile behavior. Designer unhappy with result.

**Fix:** Always design mobile, tablet, and desktop.

### Mistake 3: Missing Interactive States
**Problem:** Only default button state designed.

**Result:** Developer creates hover state that doesn't match brand.

**Fix:** Design all states. Hover, active, disabled, loading.

### Mistake 4: Unrealistic Designs
**Problem:** Designer creates effects impossible to code (or very slow).

**Result:** Developer compromises, designer disappointed.

**Fix:** Designers learn CSS limitations. Developers suggest alternatives early.

### Mistake 5: No Design System
**Problem:** Every page designed from scratch with new styles.

**Result:** Inconsistent UI, wasted time, maintenance nightmare.

**Fix:** Create a design system first. Use components everywhere.

## Tools That Make Handoff Easier

### For Designers:
1. **Figma Dev Mode:** Built-in specs
2. **Stark:** Accessibility checker
3. **Auto Layout:** Responsive components
4. **Component Library:** Consistency

### For Developers:
1. **Figma API:** Programmatic access
2. **Tailwind CSS:** Design tokens built-in
3. **Storybook:** Component development
4. **CSS Grid / Flexbox:** Layout systems

### For Both:
1. **Design Tokens:** Single source of truth
2. **Slack/Discord:** Quick communication
3. **Loom:** Screen recordings for complex interactions
4. **4Corners AI:** Generates design systems from descriptions

## Real-World Example: Airbnb

Airbnb's design-development process:
1. **Design System First:** Created comprehensive component library
2. **Code Components Match Figma:** Pixel-perfect implementation
3. **Automated Testing:** Percy catches visual regressions
4. **Documentation:** Every component documented in Storybook

**Result:** Consistent UI across web, iOS, Android, and email.

## The Future: AI-Assisted Handoff

**Current State:**
- Designer creates in Figma
- Developer manually recreates in code

**Future (happening now):**
- Designer describes intent
- AI generates design system (4Corners AI)
- Export to code automatically
- Developer refines and integrates

**Time saved:** 60-80%

---

## Conclusion

A smooth Figma-to-code handoff isn't magic—it's process. Design systems, clear communication, and the right tools make it effortless.

**Want to skip the setup?** 4Corners AI generates complete, code-ready design systems from your brand description. Designers and developers both get exactly what they need.

[Try 3 Free Generations →](/generate)
`
  },
  
  // Article 5: Accessibility
  {
    slug: "accessibility-design-guide-2025",
    title: "Accessibility in Design: The 2025 Complete Guide",
    excerpt: "Build inclusive products that everyone can use. Learn WCAG standards, best practices, and common accessibility mistakes to avoid.",
    category: "Accessibility",
    author: "4Corners AI Team",
    date: "2025-01-30",
    readTime: "11 min read",
    featured: false,
    content: `
# Accessibility in Design: The 2025 Complete Guide

Accessibility isn't optional—it's essential. 15% of the world's population has some form of disability. If your product isn't accessible, you're excluding millions of potential users.

## Why Accessibility Matters

### 1. It's the Right Thing to Do
Everyone deserves equal access to information and services.

### 2. It's the Law
- **ADA (US):** Websites must be accessible
- **WCAG:** International standard
- **Section 508:** US government sites
- **EAA (EU):** European Accessibility Act

**Legal risk:** Companies are sued for inaccessible websites. Don't be one of them.

### 3. It's Good Business
- Larger market (disability = $13 trillion purchasing power)
- Better SEO (accessible sites rank higher)
- Improved UX for everyone
- Corporate responsibility

### 4. Accessibility Benefits Everyone
- Captions help people in noisy environments
- Keyboard navigation helps power users
- High contrast helps people in bright sunlight
- Clear hierarchy helps everyone scan faster

## WCAG Standards Explained

**WCAG** = Web Content Accessibility Guidelines

### Three Levels:
1. **Level A:** Minimum (basic)
2. **Level AA:** Mid-range (target this)
3. **Level AAA:** Highest (very strict)

**Aim for AA.** AAA is often impractical.

### Four Principles (POUR):

#### 1. Perceivable
Users must be able to perceive information.

**Examples:**
- Text alternatives for images
- Captions for videos
- Sufficient color contrast

#### 2. Operable
Users must be able to operate the interface.

**Examples:**
- Keyboard accessible
- Enough time to read/use content
- No seizure-inducing flashing

#### 3. Understandable
Users must understand the information and interface.

**Examples:**
- Readable text
- Predictable navigation
- Input assistance (error messages)

#### 4. Robust
Content must work with current and future technologies.

**Examples:**
- Valid HTML
- Compatible with assistive technologies
- Progressive enhancement

## Color Contrast Requirements

### WCAG AA Standards:
- **Normal text:** 4.5:1 contrast ratio
- **Large text (18px+ or 14px bold+):** 3:1 contrast ratio
- **UI components:** 3:1 contrast ratio

### WCAG AAA Standards:
- **Normal text:** 7:1 contrast ratio
- **Large text:** 4.5:1 contrast ratio

### Tools to Check Contrast:
1. **WebAIM Contrast Checker** (online)
2. **Browser DevTools** (built-in)
3. **Stark plugin** (Figma)
4. **4Corners AI** (auto-generates accessible colors)

### Common Contrast Mistakes:

**Mistake 1: Light Gray on White**
\`\`\`
Background: #FFFFFF
Text: #C7C7C7
Contrast: 1.9:1 ❌ (needs 4.5:1)
\`\`\`

**Fix:**
\`\`\`
Background: #FFFFFF
Text: #6B7280
Contrast: 5.2:1 ✅
\`\`\`

**Mistake 2: Colored Text on Colored Backgrounds**
\`\`\`
Background: #8B5CF6 (purple)
Text: #06B6D4 (cyan)
Contrast: 2.1:1 ❌
\`\`\`

**Fix:**
\`\`\`
Background: #8B5CF6 (purple)
Text: #FFFFFF (white)
Contrast: 7.8:1 ✅
\`\`\`

## Keyboard Navigation

### Requirements:
- Every interactive element must be keyboard accessible
- Tab order must be logical
- Focus indicators must be visible
- No keyboard traps

### Implementation:

**1. Tab Order:**
Use semantic HTML for automatic tab order:
\`\`\`html
<button>Click me</button>  <!-- Focusable -->
<a href="/page">Link</a>   <!-- Focusable -->
<input type="text">        <!-- Focusable -->
\`\`\`

**2. Skip Links:**
Add "skip to content" for screen reader users:
\`\`\`html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
\`\`\`

**3. Focus Indicators:**
Never remove focus outlines without replacement:
\`\`\`css
/* ❌ BAD */
button:focus {
  outline: none;
}

/* ✅ GOOD */
button:focus {
  outline: 2px solid #8B5CF6;
  outline-offset: 2px;
}
\`\`\`

**4. Keyboard Shortcuts:**
Document all shortcuts:
- \`Tab\`: Next element
- \`Shift + Tab\`: Previous element
- \`Enter\`/\`Space\`: Activate button
- \`Esc\`: Close modal

## Screen Reader Support

### Semantic HTML:
Use the right elements:

\`\`\`html
<!-- ❌ BAD -->
<div onclick="submit()">Submit</div>

<!-- ✅ GOOD -->
<button type="submit">Submit</button>
\`\`\`

### ARIA Labels:
Add context where needed:

\`\`\`html
<!-- Icon-only button -->
<button aria-label="Close dialog">
  <XIcon />
</button>

<!-- Image -->
<img 
  src="product.jpg" 
  alt="Blue running shoes on white background"
/>

<!-- Empty state (decorative) -->
<img 
  src="pattern.svg" 
  alt=""
  role="presentation"
/>
\`\`\`

### Landmarks:
Structure your page:

\`\`\`html
<header role="banner">
  <nav role="navigation">...</nav>
</header>

<main role="main">
  <article>...</article>
  <aside role="complementary">...</aside>
</main>

<footer role="contentinfo">...</footer>
\`\`\`

### Live Regions:
Announce dynamic changes:

\`\`\`html
<div role="alert" aria-live="assertive">
  Form submitted successfully!
</div>

<div role="status" aria-live="polite">
  Loading more items...
</div>
\`\`\`

## Form Accessibility

### 1. Label Everything:
\`\`\`html
<!-- ❌ BAD -->
<input type="email" placeholder="Email">

<!-- ✅ GOOD -->
<label for="email">Email address</label>
<input type="email" id="email" placeholder="you@example.com">
\`\`\`

### 2. Error Messages:
\`\`\`html
<label for="email">Email</label>
<input 
  type="email" 
  id="email"
  aria-describedby="email-error"
  aria-invalid="true"
/>
<span id="email-error" role="alert">
  Please enter a valid email address
</span>
\`\`\`

### 3. Required Fields:
\`\`\`html
<label for="name">
  Name <span aria-label="required">*</span>
</label>
<input 
  type="text" 
  id="name" 
  required
  aria-required="true"
/>
\`\`\`

### 4. Autocomplete:
\`\`\`html
<input 
  type="email" 
  autocomplete="email"
  name="email"
/>
\`\`\`

## Typography Accessibility

### Font Size:
- **Minimum:** 16px for body text
- **Recommended:** 18px for readability
- **Never:** Below 14px

### Line Height:
- **Body text:** 1.5-1.7
- **Headings:** 1.2-1.3
- **Tight:** Only for display text

### Line Length:
- **Optimal:** 50-75 characters
- **Maximum:** 80 characters
- Use \`max-width: 65ch\` for paragraphs

### Font Choices:
- **Readable:** Inter, Open Sans, Roboto
- **Avoid:** Script fonts for body text
- **Dyslexia-friendly:** OpenDyslexic, Lexie Readable

## Motion & Animation

### Respect User Preferences:
\`\`\`css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
\`\`\`

### Safe Animation:
- **Avoid:** Flashing (no more than 3 flashes per second)
- **Avoid:** Parallax (can cause nausea)
- **Use:** Subtle fades and slides

### Auto-Playing Content:
- **Don't:** Auto-play videos with sound
- **Do:** Provide play/pause controls
- **Do:** Allow users to stop motion

## Mobile Accessibility

### Touch Targets:
- **Minimum:** 44×44px (iOS guideline)
- **Recommended:** 48×48px
- **Spacing:** 8px between targets

### Zoom:
- **Don't:** Disable pinch-to-zoom
- **Do:** Support up to 200% zoom
- **Test:** Content must remain usable when zoomed

### Orientation:
- **Support both:** Portrait and landscape
- **Don't:** Force orientation locks

## Testing for Accessibility

### Automated Tools:
1. **axe DevTools** (browser extension)
2. **WAVE** (web accessibility evaluator)
3. **Lighthouse** (in Chrome DevTools)
4. **Pa11y** (command-line tool)

**Note:** Automated tools catch only 30-40% of issues.

### Manual Testing:

**1. Keyboard Only:**
- Unplug your mouse
- Navigate entire site with keyboard
- Can you access everything?

**2. Screen Reader:**
- **Mac:** VoiceOver (Cmd + F5)
- **Windows:** NVDA (free) or JAWS
- **Test:** Does it make sense without seeing?

**3. Color Blindness:**
- Use browser extensions (Colorblind simulator)
- Check if information conveyed by color alone

**4. Zoom to 200%:**
- Everything should still work
- No horizontal scrolling
- Content doesn't overlap

### Real User Testing:
- Test with actual users who have disabilities
- Listen to their feedback
- Iterate based on real experiences

## Common Accessibility Mistakes

### 1. Icon-Only Buttons
\`\`\`html
<!-- ❌ BAD -->
<button><XIcon /></button>

<!-- ✅ GOOD -->
<button aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>
\`\`\`

### 2. Placeholder as Label
\`\`\`html
<!-- ❌ BAD -->
<input placeholder="Email">

<!-- ✅ GOOD -->
<label for="email">Email</label>
<input id="email" placeholder="you@example.com">
\`\`\`

### 3. Low Contrast
Always check contrast ratios. No excuses.

### 4. Missing Alt Text
\`\`\`html
<!-- ❌ BAD -->
<img src="logo.svg">

<!-- ✅ GOOD -->
<img src="logo.svg" alt="Company logo">
\`\`\`

### 5. Non-Semantic HTML
\`\`\`html
<!-- ❌ BAD -->
<div onclick="navigate()">Go</div>

<!-- ✅ GOOD -->
<button onclick="navigate()">Go</button>
\`\`\`

---

## Conclusion

Accessibility isn't a checklist—it's a mindset. Build with inclusion from day one, not as an afterthought.

**Want accessible designs automatically?** 4Corners AI generates color palettes with proper contrast ratios built-in. Every design system we create meets WCAG AA standards out of the box.

[Try 3 Free Generations →](/generate)
`
  },
]
