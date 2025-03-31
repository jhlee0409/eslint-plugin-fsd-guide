import { TSESLint } from '@typescript-eslint/utils'

type MessageIds = 'useBarrelImport'
type Options = [{ enforceBarrelImports?: boolean }]

export default {
  defaultOptions: [{
    enforceBarrelImports: true,
  }],
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce using barrel imports (index files) for modules',
      recommended: 'strict',
    },
    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        enforceBarrelImports: {
          type: 'boolean',
          default: true,
        },
      },
    }],
    messages: {
      useBarrelImport: 'Use barrel import (index file) instead of direct file import.',
    },
  },
  create(context) {
    const [options] = context.options as Options

    return {
      ImportDeclaration(node) {
        if (!options?.enforceBarrelImports) return

        const importPath = node.source.value as string

        // Skip if already importing from index or not a relative import
        if (!importPath.startsWith('./') || importPath.endsWith('/index') || importPath === '.') return

        // Convert path to use barrel import
        const pathParts = importPath.split('/')
        const barrelPath = pathParts.slice(0, -1).join('/') || '.'

        context.report({
          node,
          messageId: 'useBarrelImport',
          fix(fixer) {
            return fixer.replaceText(node.source, `'${barrelPath}'`)
          },
        })
      },
    }
  },
} as TSESLint.RuleModule<MessageIds, Options>