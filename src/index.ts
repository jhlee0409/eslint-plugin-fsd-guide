import importPath from './rules/import-path'
import enforceBarrelImports from './rules/enforce-barrel-imports'
import layerBoundary from './rules/layer-boundary'
import importOrder from './rules/import-order'

export = {
  rules: {
    'import-path': importPath,
    'enforce-barrel-imports': enforceBarrelImports,
    'layer-boundary': layerBoundary,
    'import-order': importOrder,
  },
  configs: {
    recommended: {
      plugins: ['fsd-guide', 'import'],
      rules: {
        'fsd-guide/import-order': 'error',
        'fsd-guide/import-path': 'error',
        'fsd-guide/enforce-barrel-imports': 'error',
        'fsd-guide/layer-boundary': 'error',
      },
    },
    vanilla: {
      plugins: ['fsd-guide', 'import'],
      rules: {
        'fsd-guide/import-order': ['error', { preset: 'vanilla' }],
        'fsd-guide/import-path': 'error',
        'fsd-guide/enforce-barrel-imports': 'error',
        'fsd-guide/layer-boundary': 'error',
      },
    },
    react: {
      plugins: ['fsd-guide', 'import'],
      rules: {
        'fsd-guide/import-order': ['error', { preset: 'react' }],
        'fsd-guide/import-path': 'error',
        'fsd-guide/enforce-barrel-imports': 'error',
        'fsd-guide/layer-boundary': 'error',
      },
    },
    nextjs: {
      plugins: ['fsd-guide', 'import'],
      rules: {
        'fsd-guide/import-order': ['error', { preset: 'nextjs' }],
        'fsd-guide/import-path': 'error',
        'fsd-guide/enforce-barrel-imports': 'error',
        'fsd-guide/layer-boundary': 'error',
      },
    },
    'strict-absolute': {
      plugins: ['fsd-guide', 'import'],
      rules: {
        'fsd-guide/import-order': 'error',
        'fsd-guide/import-path': ['error', { enforceAbsolutePaths: true }],
        'fsd-guide/layer-boundary': 'error',
      },
    },
    'mixed-paths': {
      plugins: ['fsd-guide', 'import'],
      rules: {
        'fsd-guide/import-order': 'error',
        'fsd-guide/import-path': ['error', { allowRelativeWithinLayers: true }],
        'fsd-guide/layer-boundary': 'error',
      },
    },
    'barrel-imports': {
      plugins: ['fsd-guide', 'import'],
      rules: {
        'fsd-guide/import-order': 'error',
        'fsd-guide/enforce-barrel-imports': 'error',
        'fsd-guide/layer-boundary': 'error',
      },
    },
    'full-fsd': {
      plugins: ['fsd-guide', 'import'],
      rules: {
        'fsd-guide/import-order': 'error',
        'fsd-guide/import-path': ['error', { allowRelativeWithinLayers: true }],
        'fsd-guide/enforce-barrel-imports': 'error',
        'fsd-guide/layer-boundary': 'error',
      },
    },
    'warn-boundaries': {
      plugins: ['fsd-guide', 'import'],
      rules: {
        'fsd-guide/import-order': 'error',
        'fsd-guide/import-path': 'error',
        'fsd-guide/enforce-barrel-imports': 'error',
        'fsd-guide/layer-boundary': 'warn',
      },
    },
    'allow-boundaries': {
      plugins: ['fsd-guide', 'import'],
      rules: {
        'fsd-guide/import-order': 'error',
        'fsd-guide/import-path': 'error',
        'fsd-guide/enforce-barrel-imports': 'error',
        'fsd-guide/layer-boundary': 'off',
      },
    },
  },
}
