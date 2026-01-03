# Tailwind to Standard CSS Conversion

## 1. Remove Tailwind Dependencies
- [x] Remove `tailwindcss` from `package.json`
- [x] Remove `@tailwindcss/vite` from `package.json`
- [x] Run `npm install` to update `package-lock.json`

## 2. Update Build Configuration
- [x] Remove `tailwindcss` import from `vite.config.ts`
- [x] Remove `tailwindcss()` plugin from Vite plugins array

## 3. Replace `src/styles.css`
- [x] Remove `@import "tailwindcss"` directive
- [x] Remove `@apply` usage
- [x] Convert to standard CSS with proper selectors

## 4. Convert Component Files

**High-impact files:**
- [ ] `src/components/Header.tsx` (30 className usages)
- [ ] `src/routes/index.tsx` (27 usages)
- [ ] `src/components/storybook/dialog.stories.tsx` (13 usages)

**Storybook components:**
- [ ] `src/components/storybook/button.tsx`
- [ ] `src/components/storybook/input.tsx`
- [ ] `src/components/storybook/slider.tsx`
- [ ] `src/components/storybook/radio-group.tsx`
- [ ] `src/components/storybook/dialog.tsx`

**Demo route pages:**
- [ ] `src/routes/demo/tanstack-query.tsx`
- [ ] `src/routes/demo/start.ssr.index.tsx`
- [ ] `src/routes/demo/start.ssr.data-only.tsx`
- [ ] `src/routes/demo/start.server-funcs.tsx`
- [ ] `src/routes/demo/start.ssr.full-ssr.tsx`
- [ ] `src/routes/demo/start.ssr.spa-mode.tsx`
- [ ] `src/routes/demo/start.api-request.tsx`
- [ ] `src/routes/demo/storybook.tsx`

## 5. Create CSS Architecture
- [ ] Create `src/styles/` directory for organized CSS
- [ ] Create component-specific CSS files or use CSS modules
- [ ] Define CSS custom properties for colors, spacing, etc.

## 6. Update Storybook
- [ ] Verify `.storybook/preview.ts` imports updated CSS
- [ ] Test all stories render properly

## 7. Verify & Test
- [ ] Run `npm run build` to ensure no build errors
- [ ] Run `npm run dev` and visually verify all pages
- [ ] Run `npm run storybook` and verify component stories
