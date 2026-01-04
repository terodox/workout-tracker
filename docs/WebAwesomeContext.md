# Web Awesome Context

Web Awesome component library reference for the Workout Tracker frontend.

Documentation: https://webawesome.com/docs/components/

## Installation

```bash
npm install @awesome.me/webawesome
```

## Setup for React

Import styles and components in your app entry point:

```tsx
// Import all styles
import '@awesome.me/webawesome/dist/styles/webawesome.css'

// Or import only the default theme
import '@awesome.me/webawesome/dist/styles/themes/default.css'
```

Cherry-pick components as needed:

```tsx
import '@awesome.me/webawesome/dist/components/button/button.js'
import '@awesome.me/webawesome/dist/components/input/input.js'
```

### TypeScript Support

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": [
      "node_modules/@awesome.me/webawesome/dist/custom-elements-jsx.d.ts"
    ]
  }
}
```

Or create a declaration file:

```tsx
import type {
  CustomElements,
  CustomCssProperties,
} from '@awesome.me/webawesome/dist/custom-elements-jsx.d.ts'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends CustomElements {}
  }
  interface CSSProperties extends CustomCssProperties {}
}
```

---

## Components Reference

### Button (`<wa-button>`)

```tsx
import '@awesome.me/webawesome/dist/components/button/button.js'
```

**Variants:** `neutral` | `brand` | `success` | `warning` | `danger`

**Appearance:** `accent` | `filled` | `outlined` | `filled-outlined` | `plain`

**Sizes:** `small` | `medium` | `large`

```tsx
// Basic button
<wa-button variant="brand">Click Me</wa-button>

// With icon
<wa-button variant="brand">
  <wa-icon slot="start" name="plus"></wa-icon>
  Add Item
</wa-button>

// Loading state
<wa-button variant="brand" loading>Saving...</wa-button>

// Disabled
<wa-button variant="brand" disabled>Disabled</wa-button>

// Link button
<wa-button href="/path">Navigate</wa-button>

// Icon-only button
<wa-button variant="neutral" appearance="plain">
  <wa-icon name="trash" label="Delete"></wa-icon>
</wa-button>

// Full width
<wa-button style={{ width: '100%' }}>Full Width</wa-button>
```

---

### Input (`<wa-input>`)

```tsx
import '@awesome.me/webawesome/dist/components/input/input.js'
```

**Types:** `text` | `password` | `email` | `number` | `tel` | `url` | `date` | `time` | `search`

**Appearance:** `filled` | `outlined` | `filled-outlined`

**Sizes:** `small` | `medium` | `large`

```tsx
// Basic input with label
<wa-input label="Name" placeholder="Enter your name"></wa-input>

// With hint text
<wa-input label="Email" hint="We'll never share your email" type="email"></wa-input>

// Password with toggle
<wa-input type="password" label="Password" password-toggle></wa-input>

// Clearable input
<wa-input placeholder="Search..." with-clear></wa-input>

// With icons
<wa-input placeholder="Search">
  <wa-icon name="search" slot="start"></wa-icon>
</wa-input>

// Required field
<wa-input label="Required Field" required></wa-input>

// Number input
<wa-input type="number" label="Reps" min="1" max="100"></wa-input>
```

**Events:**

- `input` - Fires on every keystroke
- `change` - Fires when value is committed
- `wa-clear` - Fires when clear button is clicked

---

### Card (`<wa-card>`)

```tsx
import '@awesome.me/webawesome/dist/components/card/card.js'
```

**Appearance:** `outlined` | `filled` | `filled-outlined` | `plain` | `accent`

**Slots:** `media` | `header` | `header-actions` | `footer` | `footer-actions` | (default)

```tsx
// Basic card
<wa-card>
  <strong>Card Title</strong>
  <p>Card content goes here.</p>
</wa-card>

// Card with header and footer
<wa-card>
  <h3 slot="header">Header Title</h3>
  <p>Card body content.</p>
  <wa-button slot="footer" variant="brand">Action</wa-button>
</wa-card>

// Card with media
<wa-card>
  <img slot="media" src="/image.jpg" alt="Description" />
  <strong>Title</strong>
  <p>Description text.</p>
</wa-card>

// Horizontal card
<wa-card orientation="horizontal">
  <img slot="media" src="/image.jpg" alt="Description" style={{ maxWidth: '150px' }} />
  <p>Content beside the image.</p>
</wa-card>
```

---

### Icon (`<wa-icon>`)

```tsx
import '@awesome.me/webawesome/dist/components/icon/icon.js'
```

Uses Font Awesome icons by default. Find icons at: https://fontawesome.com/search?o=r&m=free

**Families:** `classic` | `brands`

**Variants:** `solid` | `regular` | `light` | `thin`

```tsx
// Basic icon
<wa-icon name="house"></wa-icon>

// With variant
<wa-icon name="star" variant="solid"></wa-icon>
<wa-icon name="star" variant="regular"></wa-icon>

// Sized via font-size
<wa-icon name="dumbbell" style={{ fontSize: '2rem' }}></wa-icon>

// Colored
<wa-icon name="heart" style={{ color: 'red' }}></wa-icon>

// With accessibility label
<wa-icon name="trash" label="Delete item"></wa-icon>

// Brand icons
<wa-icon family="brands" name="github"></wa-icon>
```

**Common icons for this app:**

- `dumbbell` - Exercise/workout
- `list` - List view
- `plus` - Add/create
- `pen` - Edit
- `trash` - Delete
- `arrow-up` / `arrow-down` - Reorder
- `clock` - Duration
- `repeat` - Repetitions
- `image` - Image
- `video` - Video
- `lock` - Password/auth
- `right-from-bracket` - Logout

---

### Dialog (`<wa-dialog>`)

```tsx
import '@awesome.me/webawesome/dist/components/dialog/dialog.js'
```

```tsx
// Basic dialog
<wa-dialog label="Dialog Title" open={isOpen}>
  <p>Dialog content here.</p>
  <wa-button slot="footer" variant="brand" data-dialog="close">
    Close
  </wa-button>
</wa-dialog>

// Open/close programmatically
const dialogRef = useRef<HTMLElement>(null);
dialogRef.current.open = true;  // Open
dialogRef.current.open = false; // Close

// Declarative open/close
<wa-button data-dialog="open my-dialog">Open</wa-button>
<wa-dialog id="my-dialog" label="Title">
  <wa-button slot="footer" data-dialog="close">Close</wa-button>
</wa-dialog>

// Light dismiss (close on overlay click)
<wa-dialog label="Title" light-dismiss>...</wa-dialog>

// Without header
<wa-dialog without-header>...</wa-dialog>

// Custom width
<wa-dialog label="Wide Dialog" style={{ '--width': '80vw' }}>...</wa-dialog>
```

**Events:**

- `wa-show` - Emitted when dialog opens
- `wa-after-show` - Emitted after open animation completes
- `wa-hide` - Emitted when dialog is requested to close (can be prevented)
- `wa-after-hide` - Emitted after close animation completes

---

### Radio Group (`<wa-radio-group>` + `<wa-radio>`)

```tsx
import '@awesome.me/webawesome/dist/components/radio-group/radio-group.js'
import '@awesome.me/webawesome/dist/components/radio/radio.js'
```

```tsx
// Basic radio group
<wa-radio-group label="Select Type" name="type" value="reps">
  <wa-radio value="reps">Repetitions</wa-radio>
  <wa-radio value="duration">Duration</wa-radio>
</wa-radio-group>

// Horizontal orientation
<wa-radio-group label="Options" orientation="horizontal">
  <wa-radio value="1">Option 1</wa-radio>
  <wa-radio value="2">Option 2</wa-radio>
</wa-radio-group>

// Button appearance
<wa-radio-group label="Choose" orientation="horizontal">
  <wa-radio appearance="button" value="a">A</wa-radio>
  <wa-radio appearance="button" value="b">B</wa-radio>
</wa-radio-group>

// With hint
<wa-radio-group label="Type" hint="Choose one option">
  <wa-radio value="1">Option 1</wa-radio>
  <wa-radio value="2">Option 2</wa-radio>
</wa-radio-group>
```

**Events:**

- `change` - Fires when selection changes

---

### Callout (`<wa-callout>`)

```tsx
import '@awesome.me/webawesome/dist/components/callout/callout.js'
```

**Variants:** `brand` | `neutral` | `success` | `warning` | `danger`

**Appearance:** `accent` | `filled` | `outlined` | `plain` | `filled-outlined`

**Sizes:** `small` | `medium` | `large`

```tsx
// Error message
<wa-callout variant="danger">
  <wa-icon slot="icon" name="circle-exclamation"></wa-icon>
  <strong>Error</strong><br />
  Invalid password. Please try again.
</wa-callout>

// Success message
<wa-callout variant="success">
  <wa-icon slot="icon" name="circle-check"></wa-icon>
  Changes saved successfully!
</wa-callout>

// Warning
<wa-callout variant="warning">
  <wa-icon slot="icon" name="triangle-exclamation"></wa-icon>
  Your session will expire soon.
</wa-callout>

// Info
<wa-callout variant="brand">
  <wa-icon slot="icon" name="circle-info"></wa-icon>
  Helpful information here.
</wa-callout>
```

---

### Spinner (`<wa-spinner>`)

```tsx
import '@awesome.me/webawesome/dist/components/spinner/spinner.js'
```

```tsx
// Basic spinner
<wa-spinner></wa-spinner>

// Sized
<wa-spinner style={{ fontSize: '3rem' }}></wa-spinner>

// Colored
<wa-spinner style={{ color: 'var(--wa-color-brand-600)' }}></wa-spinner>
```

---

### Badge (`<wa-badge>`)

```tsx
import '@awesome.me/webawesome/dist/components/badge/badge.js'
```

```tsx
// Basic badge
<wa-badge>New</wa-badge>

// With variant
<wa-badge variant="success">Active</wa-badge>
<wa-badge variant="danger">3</wa-badge>

// Pill shape
<wa-badge pill>Pill Badge</wa-badge>
```

---

### Skeleton (`<wa-skeleton>`)

```tsx
import '@awesome.me/webawesome/dist/components/skeleton/skeleton.js'
```

```tsx
// Loading placeholder
<wa-skeleton></wa-skeleton>
<wa-skeleton style={{ width: '80%' }}></wa-skeleton>
<wa-skeleton style={{ width: '60%' }}></wa-skeleton>

// Circle (for avatars)
<wa-skeleton style={{ width: '50px', height: '50px', borderRadius: '50%' }}></wa-skeleton>
```

---

## Layout Utilities

Web Awesome provides CSS utility classes for layout:

```tsx
// Stack (vertical flex)
<div className="wa-stack">...</div>

// Cluster (horizontal flex with wrap)
<div className="wa-cluster">...</div>

// Grid
<div className="wa-grid">...</div>

// Gap utilities
<div className="wa-gap-s">...</div>
<div className="wa-gap-m">...</div>
<div className="wa-gap-l">...</div>
```

---

## Form Handling in React

Web Awesome components work with standard forms:

```tsx
function MyForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <wa-input name="email" label="Email" type="email" required></wa-input>
      <wa-input
        name="password"
        label="Password"
        type="password"
        required
      ></wa-input>
      <wa-button type="submit" variant="brand">
        Submit
      </wa-button>
    </form>
  )
}
```

For controlled components, use refs and event listeners:

```tsx
function ControlledInput() {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const handleInput = (e: Event) => {
      setValue((e.target as HTMLInputElement).value)
    }

    input.addEventListener('input', handleInput)
    return () => input.removeEventListener('input', handleInput)
  }, [])

  return <wa-input ref={inputRef} value={value} label="Name"></wa-input>
}
```

---

## Design Tokens

Common CSS custom properties:

```css
/* Colors */
--wa-color-brand-600
--wa-color-success-600
--wa-color-warning-600
--wa-color-danger-600
--wa-color-neutral-600

/* Spacing */
--wa-space-2xs
--wa-space-xs
--wa-space-s
--wa-space-m
--wa-space-l
--wa-space-xl
--wa-space-2xl

/* Typography */
--wa-font-size-small
--wa-font-size-medium
--wa-font-size-large

/* Borders */
--wa-border-radius-small
--wa-border-radius-medium
--wa-border-radius-large

/* Shadows */
--wa-shadow-small
--wa-shadow-medium
--wa-shadow-large
```
