import { RuleTester } from '@typescript-eslint/rule-tester'
import importPathRule from '../../rules/import-path'

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
})

ruleTester.run('import-path', importPathRule as any, {
  valid: [
    {
      code: "import { something } from '@/shared/lib'",
      options: [{ enforceAbsolutePaths: true, allowRelativeWithinLayers: true }],
    },
    {
      code: "import { something } from './component'",
      options: [{ enforceAbsolutePaths: true, allowRelativeWithinLayers: true }],
    },
  ],
  invalid: [
    {
      code: "import { something } from './shared/lib'",
      options: [{ enforceAbsolutePaths: true, allowRelativeWithinLayers: true }],
      errors: [
        {
          messageId: 'useAbsoluteImport',
          data: {
            path: './shared/lib',
            absolutePath: '@/shared/lib',
          },
        },
      ],
      output: "import { something } from '@/shared/lib'",
    },
  ],
})