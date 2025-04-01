import { RuleTester } from '@typescript-eslint/rule-tester'
import layerBoundaryRule, { MessageIds, Options } from '../../rules/layer-boundary'
import { TSESLint } from '@typescript-eslint/utils'

// FSD 기본 레이어 순서
const defaultLayers = [
  'app',
  'pages',
  'widgets',
  'features',
  'entities',
  'shared'
]

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
})

const mockFilename = (layer: string) => `/src/${layer}/index.ts`

ruleTester.run('layer-boundary', layerBoundaryRule as any, {
  valid: [
    // Shared layer can be imported by any layer
    {
      code: "import { something } from '@/shared/ui'",
      filename: mockFilename('features'),
    },
    {
      code: "import { something } from '@/shared/lib'",
      filename: mockFilename('widgets'),
    },
    // Entities can be imported by features and above
    {
      code: "import { something } from '@/entities/user'",
      filename: mockFilename('features'),
    },
    {
      code: "import { something } from '@/entities/user'",
      filename: mockFilename('widgets'),
    },
    // Features can be imported by widgets and above
    {
      code: "import { something } from '@/features/auth'",
      filename: mockFilename('widgets'),
    },
    {
      code: "import { something } from '@/features/auth'",
      filename: mockFilename('pages'),
    },
    // Ignore patterns
    {
      code: "import { something } from '@/entities/user'",
      filename: mockFilename('shared'),
      options: [{ layers: defaultLayers, ignorePatterns: ['shared'] }],
    },
    // Non-layer imports are ignored
    {
      code: "import { something } from './local'",
      filename: mockFilename('features'),
    },
  ],
  invalid: [
    // Shared layer cannot import from other layers
    {
      code: "import { something } from '@/entities/user'",
      filename: mockFilename('shared'),
      errors: [
        {
          messageId: 'invalidLayerImport',
          data: {
            importingLayer: 'shared',
            importedLayer: 'entities',
          },
        },
      ],
    },
    // Entities cannot import from features
    {
      code: "import { something } from '@/features/auth'",
      filename: mockFilename('entities'),
      errors: [
        {
          messageId: 'invalidLayerImport',
          data: {
            importingLayer: 'entities',
            importedLayer: 'features',
          },
        },
      ],
    },
    // Features cannot import from widgets
    {
      code: "import { something } from '@/widgets/header'",
      filename: mockFilename('features'),
      errors: [
        {
          messageId: 'invalidLayerImport',
          data: {
            importingLayer: 'features',
            importedLayer: 'widgets',
          },
        },
      ],
    },
    // Custom layers order
    {
      code: "import { something } from '@/core/utils'",
      filename: mockFilename('ui'),
      options: [{ layers: ['app', 'ui', 'core'], ignorePatterns: [] }],
      errors: [
        {
          messageId: 'invalidLayerImport',
          data: {
            importingLayer: 'ui',
            importedLayer: 'core',
          },
        },
      ],
    },
  ],
})