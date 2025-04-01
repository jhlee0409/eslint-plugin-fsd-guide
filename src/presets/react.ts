// eslint-plugin-fsd/presets/react.ts
import { ImportOrderConfig } from '../types'

const reactConfig: ImportOrderConfig = {
  groups: [
    'builtin',
    'external',
    'internal',
    ['parent', 'sibling'],
    'index',
    'object',
    'type',
  ],
  pathGroups: [
    {
      pattern: '@/app/**',
      group: 'internal',
      position: 'before',
    },
    {
      pattern: '@/pages/**',
      group: 'internal',
      position: 'before',
    },
    {
      pattern: '@/widgets/**',
      group: 'internal',
      position: 'before',
    },
    {
      pattern: '@/features/**',
      group: 'internal',
      position: 'before',
    },
    {
      pattern: '@/entities/**',
      group: 'internal',
      position: 'before',
    },
    {
      pattern: '@/shared/**',
      group: 'internal',
      position: 'before',
    },
  ],
  'newlines-between': 'always',
  alphabetize: {
    order: 'asc',
    caseInsensitive: true,
  },
}

export default reactConfig