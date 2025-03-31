import { TSESLint } from '@typescript-eslint/utils'

type MessageIds = 'useAbsoluteImport'
type Options = [{ enforceAbsolutePaths?: boolean; allowRelativeWithinLayers?: boolean }]

export default {
  defaultOptions: [{
    enforceAbsolutePaths: true,
    allowRelativeWithinLayers: true,
  }],
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce absolute imports for cross-layer dependencies',
      recommended: 'strict',
    },
    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        enforceAbsolutePaths: {
          type: 'boolean',
          default: true,
        },
        allowRelativeWithinLayers: {
          type: 'boolean',
          default: true,
        },
      },
    }],
    messages: {
      useAbsoluteImport: 'Use absolute imports instead of relative imports for cross-layer dependencies.',
    },
  },
  create(context) {
    const [options] = context.options as Options

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value as string

        if (!options?.enforceAbsolutePaths) return

        // Allow relative imports if allowRelativeWithinLayers is true
        if (options?.allowRelativeWithinLayers && importPath.startsWith('./')) {
          const pathParts = importPath.split('/')
          // Allow if importing from the same directory or subdirectory
          if (pathParts.length <= 2) return
        }

        // Check if the import path should be absolute
        if (importPath.startsWith('./')) {
          const absolutePath = importPath.replace('./', '@/')

          context.report({
            node,
            messageId: 'useAbsoluteImport',
            data: {
              path: importPath,
              absolutePath,
            },
            fix(fixer) {
              return fixer.replaceText(node.source, `'${absolutePath}'`)
            },
          })
        }
      },
    }
  },
} as TSESLint.RuleModule<MessageIds, Options>