# RouteKeeper Source Structure

This document outlines the barrel export pattern used in the RouteKeeper application for cleaner imports.

## Barrel Exports

All main directories now include `index.ts` files that export their contents, allowing for cleaner imports:

### Components

```typescript
// ✅ Clean import from barrel export
import { Header, HeroSection, FeaturesSection } from '@/components';

// ❌ Old way - multiple file imports
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
```

### Constants

```typescript
// ✅ Clean import from barrel export
import { APP_NAME, VALIDATION_MESSAGES, STOP_CATEGORIES } from '@/constants';

// ❌ Old way - multiple file imports
import { APP_NAME } from '@/constants/app';
import { VALIDATION_MESSAGES } from '@/constants/validation';
import { STOP_CATEGORIES } from '@/constants/stops';
```

### Hooks

```typescript
// ✅ Clean import from barrel export
import { useAuth, useDrive } from '@/hooks';

// ❌ Old way - multiple file imports
import { useAuth } from '@/hooks/useAuth';
import { useDrive } from '@/hooks/useDrive';
```

### Types

```typescript
// ✅ Clean import from barrel export
import { User, Drive, Stop, AuthContextType } from '@/types';

// ❌ Old way - already had barrel export
import { User, Drive, Stop, AuthContextType } from '@/types/index';
```

### Utils

```typescript
// ✅ Clean import from barrel export
import { createBrowserClient, createServerClient } from '@/utils';

// ❌ Old way - multiple file imports
import { createClient as createBrowserClient } from '@/utils/supabase/client';
import { createClient as createServerClient } from '@/utils/supabase/server';
```

### Lib

```typescript
// ✅ Clean import from barrel export
import { supabaseClient, TABLES, POLICIES } from '@/lib';

// ❌ Old way - multiple file imports
import { supabase } from '@/lib/supabase';
import { TABLES, POLICIES } from '@/lib/supabase-config';
```

### Providers

```typescript
// ✅ Clean import from barrel export
import { AppContextProvider, PrimeReactProvider } from '@/providers';

// ❌ Old way - multiple file imports
import { AppContextProvider } from '@/providers/app-context';
import { PrimeReactProvider } from '@/providers/primereact-provider';
```

## Directory Structure

```
src/
├── components/
│   ├── index.ts          # Barrel export for all components
│   ├── common/
│   │   └── index.ts      # Barrel export for common components
│   ├── layout/
│   └── sections/
├── constants/
│   └── index.ts          # Barrel export for all constants
├── hooks/
│   └── index.ts          # Barrel export for all hooks
├── lib/
│   └── index.ts          # Barrel export for lib utilities
├── providers/
│   └── index.ts          # Barrel export for all providers
├── types/
│   └── index.ts          # Barrel export for all types
└── utils/
    └── index.ts          # Barrel export for all utilities
```

## Benefits

1. **Cleaner Imports**: Single import statements instead of multiple
2. **Better Organization**: Clear separation of concerns
3. **Easier Refactoring**: Change internal structure without breaking imports
4. **Consistent Patterns**: Standardized import patterns across the app
5. **Better Developer Experience**: IDE autocomplete works better with barrel exports
