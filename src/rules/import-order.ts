import { TSESLint } from '@typescript-eslint/utils'
import fsdDefaultConfig from '../presets/fsd-default'
import vanillaConfig from '../presets/vanilla'
import reactConfig from '../presets/react'
import nextjsConfig from '../presets/nextjs'
import { ImportOrderOptions, ImportOrderConfig, ESLintRule } from '../types'

type Context = Readonly<TSESLint.RuleContext<string, ImportOrderOptions>>

const importOrderRule: ESLintRule<ImportOrderOptions, string> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce FSD (Feature-Sliced Design) import order',
      recommended: 'recommended',
    },
    messages: {
      incorrectOrder: 'Incorrect import order'
    },
    schema: [
      {
        type: 'object',
        properties: {
          preset: {
            type: 'string',
            enum: ['vanilla', 'react', 'nextjs', 'fsd-default']
          },
          pathPrefix: { type: 'string' },
          noAliases: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{
    preset: 'fsd-default',
    pathPrefix: '@/',
    noAliases: false
  }],
  create(context: Context) {
    const options = context.options[0] || {}
    const preset = options.preset || 'fsd-default'
    const pathPrefix = options.pathPrefix !== undefined ? options.pathPrefix : '@/'
    const noAliases = options.noAliases === true

    let config: ImportOrderConfig
    switch (preset) {
      case 'vanilla':
        config = vanillaConfig
        break
      case 'react':
        config = reactConfig
        break
      case 'nextjs':
        config = nextjsConfig
        break
      case 'fsd-default':
      default:
        config = fsdDefaultConfig
        break
    }

    // path alias를 사용하지 않는 경우
    if (noAliases) {
      config = {
        ...config,
        pathGroups: [],
      }
    }
    // path alias 프리픽스가 다른 경우
    else if (pathPrefix !== '@/') {
      config = {
        ...config,
        pathGroups: config.pathGroups.map((group) => ({
          ...group,
          pattern: group.pattern.replace('@/', pathPrefix),
        })),
      }
    }

    return {
      Program() {
        const contextAny = context as any
        contextAny.options = [config]

        const importOrderRule = contextAny.sourceCode.eslint.linter
          .getRules()
          .get('import/order')

        if (importOrderRule) {
          return importOrderRule.create(context)
        }

        return {}
      },
    }
  },
}

export default importOrderRule