# Styles Organization

This directory contains all the CSS styles for the RouteKeeper application, organized by purpose and component.

## Structure

```
src/styles/
├── index.css                    # Main styles index (imports all styles)
├── base.css                     # Base styles and resets
├── components/                  # Component-specific styles
│   ├── primereact-overrides.css # PrimeReact component overrides
│   └── homepage.css             # Homepage-specific styles
├── layout/                      # Layout component styles
│   └── header.css               # Header component styles
└── utilities/                   # Utility classes
    └── spacing.css              # Spacing and container utilities
```

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
2. **Dark Mode**: Include dark mode styles using `@media (prefers-color-scheme: dark)`
3. **Accessibility**: Ensure proper contrast ratios and focus states
4. **Performance**: Use CSS custom properties for theme values
5. **Organization**: Keep related styles together and use descriptive class names

### PrimeReact Integration

The `primereact-overrides.css` file contains custom styles that override PrimeReact's default styling to ensure consistency with our design system. These styles use `!important` declarations to override PrimeReact's default styles.

### Color Scheme

The application uses a consistent color scheme:

- **Primary**: #3b82f6 (Blue)
- **Surface**: #f8fafc (Light) / #1e293b (Dark)
- **Text**: #1e293b (Light) / #f1f5f9 (Dark)
- **Muted**: #64748b (Light) / #94a3b8 (Dark)

### Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
