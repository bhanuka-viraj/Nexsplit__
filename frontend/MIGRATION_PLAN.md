# API Structure Migration Plan

## ✅ Current New Structure (Recommended)

```
src/lib/api/
├── client.ts              # Axios client setup
├── index.ts               # Central exports
│
├── mutations/             # React Query mutations
│   ├── auth.ts           # Auth mutations (login, register, logout, etc.)
│   ├── nex.ts            # Nex mutations (create, invite, remove, etc.)
│   ├── user.ts           # User mutations (updateProfile, changePassword, etc.)
│   └── index.ts          # Export all mutations
│
├── queries/              # React Query queries
│   ├── nex.ts           # Nex queries (getGroups, getDetails, etc.)
│   ├── user.ts          # User queries (search, validate, analytics, etc.)
│   └── index.ts         # Export all queries
│
└── core/                # Pure API functions (recommended)
    ├── auth.ts          # Pure auth API calls
    ├── nex.ts           # Pure nex API calls
    └── user.ts          # Pure user API calls
```

## 🔄 Migration Steps

### Step 1: Move current API files to core/ (Recommended)

- Move `auth.ts` → `core/auth.ts`
- Move `nex.ts` → `core/nex.ts`
- Move `user.ts` → `core/user.ts`

### Step 2: Update imports in mutations/queries

- Update all imports from `../auth` to `../core/auth`
- Update all imports from `../nex` to `../core/nex`
- Update all imports from `../user` to `../core/user`

### Step 3: Update main index.ts

- Export core API functions
- Export all mutations and queries

## 🎯 Benefits of This Structure

1. **Clear Separation**: Core API functions vs React Query hooks
2. **Reusability**: Pure API functions can be used outside React
3. **Maintainability**: Each file has a single responsibility
4. **Type Safety**: Full TypeScript support throughout
5. **Consistency**: All mutations and queries follow same patterns

## 📦 Usage Examples

```typescript
// For mutations
import { useLoginMutation, useCreateNexMutation } from "@/lib/api/mutations";

// For queries
import {
  useUserProfileQuery,
  useNexGroupDetailsQuery,
} from "@/lib/api/queries";

// For pure API calls (when needed)
import { authApi, nexApi, userApi } from "@/lib/api/core";

// Or import everything from main index
import { useLoginMutation, useUserProfileQuery, authApi } from "@/lib/api";
```
