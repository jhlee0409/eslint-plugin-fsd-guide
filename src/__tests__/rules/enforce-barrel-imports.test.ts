import { RuleTester } from '@typescript-eslint/rule-tester'
import enforceBarrelImportsRule from '../../rules/enforce-barrel-imports'

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
})

ruleTester.run('enforce-barrel-imports', enforceBarrelImportsRule as any, {
  valid: [
    // Already importing from index
    {
      code: "import { something } from '.'",
      options: [{ enforceBarrelImports: true }],
    },
    {
      code: "import { something } from './index'",
      options: [{ enforceBarrelImports: true }],
    },
    {
      code: "import { something } from './components/index'",
      options: [{ enforceBarrelImports: true }],
    },
    // Ignore absolute path imports
    {
      code: "import { something } from '@/shared/lib'",
      options: [{ enforceBarrelImports: true }],
    },
    {
      code: "import { something } from '@/components/Button'",
      options: [{ enforceBarrelImports: true }],
    },
    // Ignore external package imports
    {
      code: "import { something } from 'react'",
      options: [{ enforceBarrelImports: true }],
    },
    // Allow all imports when enforceBarrelImports is false
    {
      code: "import { something } from './components/Button'",
      options: [{ enforceBarrelImports: false }],
    },
    // Use default value when no options provided
    {
      code: "import { something } from '.'",
    },
  ],
  invalid: [
    // Convert to parent directory
    {
      code: "import { something } from './sibling'",
      options: [{ enforceBarrelImports: true }],
      errors: [
        {
          messageId: 'useBarrelImport',
        },
      ],
      output: "import { something } from '.'",
    },
    // Convert nested path to parent directory
    {
      code: "import { something } from './lib/components/Button'",
      options: [{ enforceBarrelImports: true }],
      errors: [
        {
          messageId: 'useBarrelImport',
        },
      ],
      output: "import { something } from './lib/components'",
    },
  ],
})