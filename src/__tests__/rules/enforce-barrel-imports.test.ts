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
    {
      code: "import { something } from '.'",
      options: [{ enforceBarrelImports: true }],
    },
    {
      code: "import { something } from './index'",
      options: [{ enforceBarrelImports: true }],
    },
    {
      code: "import { something } from '@/shared/lib'",
      options: [{ enforceBarrelImports: true }],
    },
    {
      code: "import { something } from './components/Button'",
      options: [{ enforceBarrelImports: false }],
    },
  ],
  invalid: [
    {
      code: "import { something } from './components/Button'",
      options: [{ enforceBarrelImports: true }],
      errors: [
        {
          messageId: 'useBarrelImport',
        },
      ],
      output: "import { something } from './components'",
    },
    {
      code: "import { something } from './shared/lib/utils'",
      options: [{ enforceBarrelImports: true }],
      errors: [
        {
          messageId: 'useBarrelImport',
        },
      ],
      output: "import { something } from './shared/lib'",
    },
  ],
})