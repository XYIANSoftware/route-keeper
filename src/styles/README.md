# Styles Organization

This directory contains all the CSS styles for the RouteKeeper application, organized by purpose and component.

## Structure

```
src/styles/
├── index.css                    # Main styles index (imports all styles)
├── base.css                     # Base styles and resets
├── components/                  # Component-specific styles
│   └── homepage.css             # Homepage-specific styles
├── layout/                      # Layout component styles
│   └── header.css               # Header component styles
└── utilities/                   # Utility classes
    └── spacing.css              # Spacing and container utilities
```

## PrimeReact Integration

The application uses PrimeReact with the **Lara Dark Teal** theme for a professional, earthy appearance suitable for truck drivers. The theme provides:

- **Dark color scheme** with teal accents
- **Consistent component styling** across the application
- **Built-in responsive design** with PrimeFlex
- **Professional appearance** with proper contrast and readability

### PrimeReact Theme Setup

```typescript
// src/providers/primereact-provider.tsx
import 'primereact/resources/themes/lara-dark-teal/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
```

### Using PrimeReact Components

- **Buttons**: Use `text`, `outlined`, `severity` props instead of CSS classes
- **Layout**: Use PrimeFlex classes like `flex`, `justify-content-center`, `align-items-center`
- **Icons**: Use PrimeIcons with `pi pi-*` classes
- **Theme Variables**: Use CSS custom properties like `var(--primary-color)`, `var(--surface-0)`

## Usage

### Adding New Styles

1. **Component Styles**: Create a new file in `components/` for component-specific styles
2. **Layout Styles**: Create a new file in `layout/` for layout component styles
3. **Utility Styles**: Create a new file in `utilities/` for utility classes
4. **Update Index**: Add the import to `index.css`

### Importing Styles

- **Global Styles**: Import `src/styles/index.css` in your global CSS file
- **Component Styles**: Import specific component styles in the component file if needed

### Best Practices

1. **Mobile First**: Always design for mobile first, then add desktop styles
2. **PrimeReact Theme**: Use theme variables instead of hardcoded colors
3. **Accessibility**: Ensure proper contrast ratios and focus states
4. **Performance**: Use CSS custom properties for theme values
5. **Organization**: Keep related styles together and use descriptive class names

### Color Scheme (Lara Dark Teal Theme)

The application uses PrimeReact's Lara Dark Teal theme with these key colors:

- **Primary**: Teal accent color for buttons and highlights
- **Surface**: Dark backgrounds with proper contrast
- **Text**: Light text on dark backgrounds for readability
- **Accent**: Teal variations for different UI states

### Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### PrimeFlex Layout Classes

Use PrimeFlex for responsive layouts:

```html
<div class="flex flex-column md:flex-row justify-content-center align-items-center">
  <div class="col-12 md:col-6 lg:col-4">
    <!-- Content -->
  </div>
</div>
```
