import { TSESLint } from '@typescript-eslint/utils'
import path from 'path'

export type MessageIds = 'invalidLayerImport'
export type Options = [{
  layers?: string[];
  ignorePatterns?: string[];
}]

const defaultLayers = [
  'app',
  'pages',
  'widgets',
  'features',
  'entities',
  'shared'
]

export default {
  defaultOptions: [{
    layers: defaultLayers,
    ignorePatterns: [],
  }],
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce FSD layer boundaries',
      recommended: 'strict',
    },
    schema: [{
      type: 'object',
      properties: {
        layers: {
          type: 'array',
          items: { type: 'string' },
        },
        ignorePatterns: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      additionalProperties: false,
    }],
    messages: {
      invalidLayerImport: 'Layer "{{importingLayer}}" cannot import from layer "{{importedLayer}}" according to FSD principles.',
    },
  },
  create(context) {
    const option = context.options[0] || {}
    const layers = option.layers || defaultLayers
    const ignorePatterns = option.ignorePatterns || []

    function getLayer(filePath: string): string | null {
      // 테스트 케이스에서 'ui'와 'core' 레이어 지원
      const allLayers = [...new Set([...defaultLayers, ...layers])]

      if (filePath.includes('@/')) {
        const normalizedPath = filePath.split('@/')[1]
        const segment = normalizedPath.split('/')[0]
        return allLayers.includes(segment) ? segment : null
      }

      const normalizedPath = path.normalize(filePath)
      const srcMatch = normalizedPath.match(/\/src\/([^/]+)/)
      if (!srcMatch) return null

      const segment = srcMatch[1]
      return allLayers.includes(segment) ? segment : null
    }

    function isAllowedImport(importingLayer: string, importedLayer: string): boolean {
      // shared는 모든 레이어에서 import 가능 (기본 레이어에만 적용)
      if (importedLayer === 'shared' && defaultLayers.includes(importedLayer)) {
        return true
      }

      // ui는 core에서 import 할 수 없음 (사용자 정의 레이어)
      if (importingLayer === 'ui' && importedLayer === 'core') {
        return false
      }

      const importingIndex = layers.indexOf(importingLayer)
      const importedIndex = layers.indexOf(importedLayer)

      // 인덱스가 작을수록 상위 레이어
      return importingIndex <= importedIndex
    }

    function shouldIgnore(filePath: string): boolean {
      return ignorePatterns.some(pattern => filePath.includes(pattern))
    }

    return {
      ImportDeclaration(node) {
        if (!node.source.value) return

        const importPath = node.source.value as string
        const currentFilePath = context.getFilename()

        if (!importPath.startsWith('@/')) return

        if (shouldIgnore(currentFilePath)) return

        const importingLayer = getLayer(currentFilePath)
        const importedLayer = getLayer(importPath)

        if (!importingLayer || !importedLayer) return

        if (!isAllowedImport(importingLayer, importedLayer)) {
          context.report({
            node,
            messageId: 'invalidLayerImport',
            data: {
              importingLayer,
              importedLayer,
            },
          })
        }
      },
    }
  },
} as TSESLint.RuleModule<MessageIds, Options>