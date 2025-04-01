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
    {
      code: "import { something } from '@/shared/lib'",
    },
    {
      code: "import { something } from './shared/lib'",
      options: [{ enforceAbsolutePaths: false, allowRelativeWithinLayers: true }],
    },
    {
      code: "import { something } from 'react'",
      options: [{ enforceAbsolutePaths: true, allowRelativeWithinLayers: true }],
    },
    {
      code: "import { something } from '@/components/button'",
      options: [{ enforceAbsolutePaths: true, allowRelativeWithinLayers: false }],
    },
    {
      code: "import { something } from './sibling'",
      options: [{ enforceAbsolutePaths: true, allowRelativeWithinLayers: true }],
    },
    {
      code: "import { something } from './nested'",
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
    {
      code: "import { something } from './shared/lib'",
      options: [{ enforceAbsolutePaths: true, allowRelativeWithinLayers: false }],
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
    {
      code: "import { something } from './very/deep/nested/path'",
      options: [{ enforceAbsolutePaths: true, allowRelativeWithinLayers: true }],
      errors: [
        {
          messageId: 'useAbsoluteImport',
          data: {
            path: './very/deep/nested/path',
            absolutePath: '@/very/deep/nested/path',
          },
        },
      ],
      output: "import { something } from '@/very/deep/nested/path'",
    },
    {
      code: "import { something } from './component'",
      options: [{ enforceAbsolutePaths: true, allowRelativeWithinLayers: false }],
      errors: [
        {
          messageId: 'useAbsoluteImport',
          data: {
            path: './component',
            absolutePath: '@/component',
          },
        },
      ],
      output: "import { something } from '@/component'",
    },
  ],
})