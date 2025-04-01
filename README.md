# 🧩 eslint-plugin-fsd-guide

[![npm version](https://img.shields.io/npm/v/eslint-plugin-fsd-guide.svg)](https://www.npmjs.com/package/eslint-plugin-fsd-guide)
[![Downloads](https://img.shields.io/npm/dm/eslint-plugin-fsd-guide.svg)](https://www.npmjs.com/package/eslint-plugin-fsd-guide)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> ESLint plugin for enforcing Feature-Sliced Design architecture principles

## 📚 Introduction

`eslint-plugin-fsd-guide` helps you follow the [Feature-Sliced Design](https://feature-sliced.design/) architecture methodology by enforcing its core principles through ESLint rules. This plugin ensures proper layer boundaries, import order, and module access patterns.

Features:

- 🏗️ **Layer boundary enforcement**: Prevents lower layers from importing higher layers
- 🔄 **Import order sorting**: Organizes imports according to FSD layer hierarchy
- 🚪 **Public API enforcement**: Ensures module access through barrel files (index.js/ts)
- 🧩 **Framework adaptability**: Supports vanilla JS/TS, React, and Next.js projects
- 🔧 **Flexible configuration**: Customize rules to match your project's specific needs

## 📦 Installation

You'll need [ESLint](https://eslint.org/) and [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import) as peer dependencies:

```bash
npm install --save-dev eslint eslint-plugin-import eslint-plugin-fsd-guide
```

or with yarn:

```bash
yarn add -D eslint eslint-plugin-import eslint-plugin-fsd-guide
```

or with pnpm:

```bash
pnpm add -D eslint eslint-plugin-import eslint-plugin-fsd-guide
```

## 🚀 Usage

Add `fsd-guide` to the plugins section of your `.eslintrc` configuration file:

```json
{
  "plugins": ["fsd-guide"],
  "extends": ["plugin:fsd-guide/recommended"]
}
```

### 🛠️ Available Configurations

Choose the configuration that best fits your project:

- ✅ **`recommended`**: Basic FSD rules with import ordering and layer boundaries
- 🍦 **`vanilla`**: Configuration for vanilla JS/TS projects
- ⚛️ **`react`**: Optimized for React applications
- 🔄 **`nextjs`**: Tailored for Next.js applications
- 📏 **`strict-absolute`**: Forces the use of absolute paths for all imports
- 🔀 **`mixed-paths`**: Allows relative paths within the same layer
- 📦 **`barrel-imports`**: Enforces imports through barrel files
- 🔒 **`full-fsd`**: Complete FSD enforcement (recommended for strict adherence)
- ⚠️ **`warn-boundaries`**: Same as recommended but with warning instead of errors for boundary violations
- 🚫 **`allow-boundaries`**: Disables layer boundary checks

Example for a React project with strict FSD adherence:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:fsd-guide/react"
  ],
  "plugins": ["react", "fsd-guide"]
}
```

## 📋 Rules

This plugin provides the following rules:

### 🔄 fsd-guide/import-order

Enforces FSD layer-based import order.

```json
{
  "rules": {
    "fsd-guide/import-order": [
      "error",
      {
        "preset": "nextjs",
        "pathPrefix": "@/"
      }
    ]
  }
}
```

Options:

- 🧩 `preset`: Framework preset (`"fsd-default"`, `"vanilla"`, `"react"`, `"nextjs"`)
- 🔗 `pathPrefix`: Path alias prefix (default: `"@/"`)
- 🚫 `noAliases`: Disable path alias-based grouping (default: `false`)

### 🛣️ fsd-guide/import-path

Controls the use of absolute vs. relative paths.

```json
{
  "rules": {
    "fsd-guide/import-path": [
      "error",
      {
        "enforceAbsolutePaths": false,
        "allowRelativeWithinLayers": true
      }
    ]
  }
}
```

Options:

- 📏 `enforceAbsolutePaths`: Force absolute paths for all imports (default: `false`)
- 🔄 `allowRelativeWithinLayers`: Allow relative paths within the same layer (default: `true`)
- 🔗 `pathPrefix`: Path alias prefix (default: `"@/"`)

### 📦 fsd-guide/enforce-barrel-imports

Enforces importing modules through barrel files (index.js/ts).

```json
{
  "rules": {
    "fsd-guide/enforce-barrel-imports": [
      "error",
      {
        "pathPrefix": "@/",
        "ignorePatterns": ["styles", "types"]
      }
    ]
  }
}
```

Options:

- 🔗 `pathPrefix`: Path alias prefix (default: `"@/"`)
- 📄 `barrelFileNames`: Names of barrel files (default: `["index.ts", "index.js", "index.tsx", "index.jsx"]`)
- 🚫 `ignorePatterns`: Patterns to ignore (default: `[]`)

### 🏗️ fsd-guide/layer-boundary

Prevents lower layers from importing higher layers.

```json
{
  "rules": {
    "fsd-guide/layer-boundary": [
      "error",
      {
        "preset": "nextjs",
        "enforcement": "error"
      }
    ]
  }
}
```

Options:

- 🧩 `preset`: Framework preset (default: `"fsd-default"`)
- 🚦 `enforcement`: Enforcement level (`"error"`, `"warn"`, `"allow"`) (default: `"error"`)
- 🔗 `pathPrefix`: Path alias prefix (default: `"@/"`)

## 🔧 Auto-Fixing Capabilities

This plugin supports auto-fixing for several rules:

| Rule | Auto-Fix Support | Description |
|------|-----------------|-------------|
| `fsd-guide/enforce-barrel-imports` | ✅ | Automatically converts direct module imports to barrel imports |
| `fsd-guide/import-path` | ✅ | Automatically converts relative paths to absolute paths |
| `fsd-guide/import-order` | ✅ | Automatically sorts imports according to FSD layer hierarchy |
| `fsd-guide/layer-boundary` | ❌ | Manual fix required (layer violations require architectural decisions) |

### 🛠️ Using Auto-Fix

You can apply auto-fixes in several ways:

1. **🖥️ Command line**:

   ```bash
   npx eslint --fix src/
   ```

2. **📝 In your editor**: Most editors with ESLint integration support auto-fixing. For VSCode, the configuration is provided in the IDE Integration section.

3. **🔄 Git pre-commit hooks**: You can set up lint-staged with Husky to automatically fix issues before committing:

   ```bash
   npx husky add .husky/pre-commit "npx lint-staged"
   ```

   And in your package.json:

   ```json
   "lint-staged": {
     "*.{js,jsx,ts,tsx}": [
       "eslint --fix"
     ]
   }
   ```

## 📝 Examples

### 🏗️ FSD Layer Hierarchy

The plugin enforces the following layer hierarchy (from top to bottom):

1. 🏛️ `app/core` (highest)
2. 📄 `views/pages`
3. 🧩 `widgets`
4. ⚙️ `features`
5. 📊 `entities`
6. 🧰 `shared` (lowest)

### 🔄 Import Order Example

```javascript
// Correct order for imports
import fs from "fs"; // Node.js builtin
import React from "react"; // External dependencies

import { AppConfig } from "@/app/config"; // App layer
import { MainPage } from "@/pages/main"; // Pages layer
import { Header } from "@/widgets/header"; // Widgets layer
import { loginForm } from "@/features/auth"; // Features layer
import { User } from "@/entities/user"; // Entities layer
import { Button } from "@/shared/ui"; // Shared layer

import styles from "./styles.css"; // Related/local imports
```

### 🏗️ Layer Boundary Example

```javascript
// entities/user/model/user.ts

// ❌ Error: Lower layer accessing higher layer
import { AuthService } from "@/features/auth";
// This violates FSD because entities (lower layer) shouldn't import from features (higher layer)

// ✅ Correct: Same layer or lower layer import
import { Post } from "@/entities/post";
import { Button } from "@/shared/ui";
```

### 📦 Barrel Import Example

```javascript
// ❌ Error: Importing directly from a module implementation
import { User } from "@/entities/user/model/user";

// ✅ Correct: Importing through barrel file (public API)
import { User } from "@/entities/user";
```

## 🗂️ Project Structure Example

Here's how a typical FSD project structure might look:

```text
src/
├── app/          # Application layer: initialization, providers, global styles
├── pages/        # Pages/routes layer: page components, routing
├── widgets/      # Widget layer: composite components for page sections
├── features/     # Feature layer: user interactions, business logic
├── entities/     # Entity layer: business entities
└── shared/       # Shared layer: UI libraries, utilities, types
```

## 🛠️ Applying to Existing Projects

Introducing `eslint-plugin-fsd-guide` to an existing project may initially result in numerous errors. Here's a step-by-step approach to integrate the plugin smoothly:

1. **Gradual Approach**: Start with warning mode:
```json
{
  "extends": ["plugin:fsd-guide/warn-boundaries"]
}
```

2. **Progressive Migration**: Enable each rule individually:
```json
{
  "plugins": ["fsd-guide"],
  "rules": {
    // Start with import order only
    "fsd-guide/import-order": "error",
    // Keep other rules as warnings initially
    "fsd-guide/layer-boundary": "warn",
    "fsd-guide/import-path": "warn",
    "fsd-guide/enforce-barrel-imports": "warn"
  }
}
```

3. **Leverage Auto-fixing**: Use auto-fix feature during initial integration:
```bash
npx eslint --fix "src/**/*.{ts,tsx}" --rule "fsd-guide/import-order: error"
```

## 🔧 Troubleshooting

### Common Issues and Solutions

| Issue | Cause | Solution |
|------|------|----------|
| `Cannot find module '@/entities/user'` | TypeScript path aliases not properly configured | Check `paths` in `tsconfig.json` and add `eslint-import-resolver-typescript` plugin |
| Rules not being applied | Plugin not properly registered in project config | Verify `fsd-guide` is included in the `plugins` array in your `.eslintrc` file |
| Hundreds of errors on first run | First-time application to existing project | Run without `--max-warnings=0` option or apply rules gradually |
| Issues in Next.js projects | Conflicts with Next.js specific folder structure | Use the `nextjs` preset for compatibility with `next.config.js` and `eslint-config-next` |

### Framework-Specific Compatibility

#### 🔄 Monorepo Environment

Configuration for monorepo projects:

```json
{
  "plugins": ["fsd-guide"],
  "rules": {
    "fsd-guide/layer-boundary": ["error", {
      "ignorePatterns": ["packages/shared/"]
    }]
  }
}
```

#### ⚛️ React Project Optimization

For React projects, the following configuration is recommended:

```json
{
  "extends": [
    "plugin:react/recommended",
    "plugin:fsd-guide/react"
  ],
  "settings": {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true
      }
    }
  }
}
```

## 📊 Performance Considerations

Methods to optimize performance in large projects:

- `eslint-plugin-fsd-guide` is a static analysis tool that may take longer to process in large codebases.
- Enable file caching for large projects:
  ```json
  // package.json
  "scripts": {
    "lint": "eslint --cache --ext .js,.jsx,.ts,.tsx src/"
  }
  ```
- Ignore specific folders or files when necessary:
  ```json
  // .eslintrc
  {
    "rules": {
      "fsd-guide/layer-boundary": ["error", {
        "ignorePatterns": ["legacy/", "vendor/", "*.test.ts"]
      }]
    }
  }
  ```

## 🔄 Compatibility with Other ESLint Plugins

| Plugin | Compatibility | Solution |
|---------|-------|----------|
| eslint-plugin-import | Required dependency | Must be installed alongside this plugin |
| eslint-plugin-react | Compatible | Use with the `fsd-guide/react` preset |
| eslint-config-airbnb | Some conflicts | Add `{"import/order": "off"}` to resolve import order rule conflicts |
| eslint-plugin-prettier | Compatible | Can be used together without conflicts |
| eslint-plugin-unused-imports | Compatible | Configure `fsd-guide/import-order` rule to run first for proper ordering |
| @typescript-eslint/eslint-plugin | Compatible | Recommended for TypeScript projects |

## 📌 Supported Versions

| Dependency | Minimum Version | Recommended Version |
|-------|----------|----------|
| Node.js | 14.x | 16.x or higher |
| ESLint | 7.x | 8.x |
| TypeScript | 4.x | 4.7 or higher |
| eslint-plugin-import | 2.25.0 | 2.26.0 or higher |

## 🎯 Usage Examples

### Next.js Project Configuration

```js
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:fsd-guide/nextjs'
  ],
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        paths: ['src']
      }
    }
  },
  rules: {
    // Exception for Next.js page routes
    'fsd-guide/layer-boundary': ['error', {
      ignorePatterns: ['pages/api/', 'pages/_']
    }]
  }
}
```

### Vue.js Project Configuration

```js
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:fsd-guide/vanilla'
  ],
  rules: {
    'fsd-guide/import-order': ['error', {
      pathGroups: [
        // Add Vue components to higher layers
        {
          pattern: '@/components/**',
          group: 'internal',
          position: 'before'
        }
      ]
    }]
  }
}
```

## 🔍 Diagnostics and Debugging

Enable ESLint debug output to diagnose plugin issues:

```bash
DEBUG=eslint:* eslint src/path/to/file.ts
```

To get detailed information about specific rules:

```bash
npx eslint-find-rules -u .eslintrc.js | grep fsd-guide
```

## 📄 License

MIT - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

Inspired by the [Feature-Sliced Design](https://feature-sliced.design/) methodology.
