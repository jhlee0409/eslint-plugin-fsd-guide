# eslint-plugin-fsd-guide

[![npm version](https://img.shields.io/npm/v/eslint-plugin-fsd-guide.svg)](https://www.npmjs.com/package/eslint-plugin-fsd-guide)
[![Downloads](https://img.shields.io/npm/dm/eslint-plugin-fsd-guide.svg)](https://www.npmjs.com/package/eslint-plugin-fsd-guide)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> ESLint plugin for enforcing Feature-Sliced Design architecture principles

## Introduction

`eslint-plugin-fsd-guide` helps you follow the [Feature-Sliced Design](https://feature-sliced.design/) architecture methodology by enforcing its core principles through ESLint rules. This plugin ensures proper layer boundaries, import order, and module access patterns.

Features:

- 🏗️ **Layer boundary enforcement**: Prevents lower layers from importing higher layers
- 🔄 **Import order sorting**: Organizes imports according to FSD layer hierarchy
- 🚪 **Public API enforcement**: Ensures module access through barrel files (index.js/ts)
- 🧩 **Framework adaptability**: Supports vanilla JS/TS, React, and Next.js projects
- 🔧 **Flexible configuration**: Customize rules to match your project's specific needs

## Installation

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

## Usage

Add `fsd-guide` to the plugins section of your `.eslintrc` configuration file:

```json
{
  "plugins": ["fsd-guide"],
  "extends": ["plugin:fsd-guide/recommended"]
}
```

### Available Configurations

Choose the configuration that best fits your project:

- **`recommended`**: Basic FSD rules with import ordering and layer boundaries
- **`vanilla`**: Configuration for vanilla JS/TS projects
- **`react`**: Optimized for React applications
- **`nextjs`**: Tailored for Next.js applications
- **`strict-absolute`**: Forces the use of absolute paths for all imports
- **`mixed-paths`**: Allows relative paths within the same layer
- **`barrel-imports`**: Enforces imports through barrel files
- **`full-fsd`**: Complete FSD enforcement (recommended for strict adherence)
- **`warn-boundaries`**: Same as recommended but with warning instead of errors for boundary violations
- **`allow-boundaries`**: Disables layer boundary checks

Example for a React project with strict FSD adherence:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:fsd-guide/full-fsd"
  ],
  "plugins": ["react", "fsd-guide"]
}
```

## Rules

This plugin provides the following rules:

### fsd-guide/import-order

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

- `preset`: Framework preset (`"fsd-default"`, `"vanilla"`, `"react"`, `"nextjs"`)
- `pathPrefix`: Path alias prefix (default: `"@/"`)
- `noAliases`: Disable path alias-based grouping (default: `false`)

### fsd-guide/import-path

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

- `enforceAbsolutePaths`: Force absolute paths for all imports (default: `false`)
- `allowRelativeWithinLayers`: Allow relative paths within the same layer (default: `true`)
- `pathPrefix`: Path alias prefix (default: `"@/"`)

### fsd-guide/enforce-barrel-imports

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

- `pathPrefix`: Path alias prefix (default: `"@/"`)
- `barrelFileNames`: Names of barrel files (default: `["index.ts", "index.js", "index.tsx", "index.jsx"]`)
- `ignorePatterns`: Patterns to ignore (default: `[]`)

### fsd-guide/layer-boundary

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

- `preset`: Framework preset (default: `"fsd-default"`)
- `enforcement`: Enforcement level (`"error"`, `"warn"`, `"allow"`) (default: `"error"`)
- `pathPrefix`: Path alias prefix (default: `"@/"`)

## Examples

### FSD Layer Hierarchy

The plugin enforces the following layer hierarchy (from top to bottom):

1. `app/core` (highest)
2. `views/pages`
3. `widgets`
4. `features`
5. `entities`
6. `shared` (lowest)

### Import Order Example

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

### Layer Boundary Example

```javascript
// entities/user/model/user.ts

// ❌ Error: Lower layer accessing higher layer
import { AuthService } from "@/features/auth";
// This violates FSD because entities (lower layer) shouldn't import from features (higher layer)

// ✅ Correct: Same layer or lower layer import
import { Post } from "@/entities/post";
import { Button } from "@/shared/ui";
```

### Barrel Import Example

```javascript
// ❌ Error: Importing directly from a module implementation
import { User } from "@/entities/user/model/user";

// ✅ Correct: Importing through barrel file (public API)
import { User } from "@/entities/user";
```

## Project Structure Example

Here's how a typical FSD project structure might look:

```
src/
├── app/          # Application layer: initialization, providers, global styles
├── pages/        # Pages/routes layer: page components, routing
├── widgets/      # Widget layer: composite components for page sections
├── features/     # Feature layer: user interactions, business logic
├── entities/     # Entity layer: business entities
└── shared/       # Shared layer: UI libraries, utilities, types
```

## Troubleshooting

### Path Alias Configuration

This plugin assumes `@/` as the default path alias. If your project uses a different alias, specify it in the rules:

```json
{
  "rules": {
    "fsd-guide/import-order": ["error", { "pathPrefix": "~/" }],
    "fsd-guide/import-path": ["error", { "pathPrefix": "~/" }],
    "fsd-guide/enforce-barrel-imports": ["error", { "pathPrefix": "~/" }],
    "fsd-guide/layer-boundary": ["error", { "pathPrefix": "~/" }]
  }
}
```

### No Path Aliases

If your project doesn't use path aliases:

```json
{
  "rules": {
    "fsd-guide/import-order": ["error", { "noAliases": true }]
  }
}
```

### Too Many Errors

If you're adding this to an existing project, consider using the warning mode first:

```json
{
  "extends": ["plugin:fsd-guide/warn-boundaries"]
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT - see the [LICENSE](LICENSE) file for details.

## Credits

Inspired by the [Feature-Sliced Design](https://feature-sliced.design/) methodology.
