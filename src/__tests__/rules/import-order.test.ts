import importOrderRule from '../../rules/import-order'
import fsdDefaultConfig from '../../presets/fsd-default'
import vanillaConfig from '../../presets/vanilla'
import reactConfig from '../../presets/react'
import nextjsConfig from '../../presets/nextjs'

// Mock ESLint rule context
const createContextMock = (options = {}) => {
  const contextMock = {
    options: [options],
    sourceCode: {
      eslint: {
        linter: {
          getRules: jest.fn().mockReturnValue(new Map([
            ['import/order', {
              create: jest.fn().mockReturnValue({ ImportDeclaration: jest.fn() })
            }]
          ]))
        }
      }
    },
    report: jest.fn()
  }
  return contextMock
}

// Create mock node for Program argument
const mockNode = {} as any

describe('import-order rule', () => {
  it('should have correct metadata', () => {
    // Check if metadata is set correctly
    expect(importOrderRule.meta.type).toBe('suggestion')
    expect(importOrderRule.meta.docs).toEqual({
      description: 'Enforce FSD (Feature-Sliced Design) import order',
      recommended: 'recommended',
    })
    expect(importOrderRule.meta.messages).toEqual({
      incorrectOrder: 'Incorrect import order'
    })
  })

  it('should have correct defaultOptions', () => {
    // Check if default options are set correctly
    expect(importOrderRule.defaultOptions).toEqual([{
      preset: 'fsd-default',
      pathPrefix: '@/',
      noAliases: false
    }])
  })

  it('should use the appropriate preset based on options', () => {
    // Check if each preset is selected correctly
    // In this test, we cannot directly call the create function or validate the logic
    // Only test the default preset and option processing

    // Testable part: Check if schema definition is correct
    const schema = importOrderRule.meta.schema[0]
    expect(schema.properties.preset.enum).toEqual(['vanilla', 'react', 'nextjs', 'fsd-default'])
    expect(schema.properties.pathPrefix.type).toBe('string')
    expect(schema.properties.noAliases.type).toBe('boolean')
  })

  // New tests added
  describe('create function', () => {
    it('should use fsd-default preset when no options are provided', () => {
      const context = createContextMock()
      const result = importOrderRule.create(context as any)

      // Execute Program method
      if (result.Program) {
        result.Program(mockNode)
      }

      // Check options set in context
      expect(context.options[0]).toEqual(
        expect.objectContaining(fsdDefaultConfig)
      )
    })

    it('should use vanilla preset when specified', () => {
      const context = createContextMock({ preset: 'vanilla' })
      const result = importOrderRule.create(context as any)

      if (result.Program) {
        result.Program(mockNode)
      }

      // Check options set in context
      expect(context.options[0]).toEqual(
        expect.objectContaining({
          ...vanillaConfig,
          pathGroups: vanillaConfig.pathGroups
        })
      )
    })

    it('should use react preset when specified', () => {
      const context = createContextMock({ preset: 'react' })
      const result = importOrderRule.create(context as any)

      if (result.Program) {
        result.Program(mockNode)
      }

      // Check options set in context
      expect(context.options[0]).toEqual(
        expect.objectContaining({
          ...reactConfig,
          pathGroups: reactConfig.pathGroups
        })
      )
    })

    it('should use nextjs preset when specified', () => {
      const context = createContextMock({ preset: 'nextjs' })
      const result = importOrderRule.create(context as any)

      if (result.Program) {
        result.Program(mockNode)
      }

      // Check options set in context
      expect(context.options[0]).toEqual(
        expect.objectContaining({
          ...nextjsConfig,
          pathGroups: nextjsConfig.pathGroups
        })
      )
    })

    it('should modify pathGroups when custom pathPrefix is provided', () => {
      const customPathPrefix = '~/'
      const context = createContextMock({ pathPrefix: customPathPrefix })
      const result = importOrderRule.create(context as any)

      if (result.Program) {
        result.Program(mockNode)
      }

      // Check pathGroups set in context
      const options = context.options[0] as any
      if (options.pathGroups) {
        options.pathGroups.forEach(group => {
          expect(group.pattern.includes(customPathPrefix)).toBe(true)
          expect(group.pattern.includes('@/')).toBe(false)
        })
      }
    })

    it('should remove pathGroups when noAliases is true', () => {
      const context = createContextMock({ noAliases: true })
      const result = importOrderRule.create(context as any)

      if (result.Program) {
        result.Program(mockNode)
      }

      // Check pathGroups set in context
      expect((context.options[0] as any).pathGroups).toEqual([])
    })

    it('should handle missing import/order rule', () => {
      const context = createContextMock()
      // Mock as if rule doesn't exist
      context.sourceCode.eslint.linter.getRules = jest.fn().mockReturnValue(new Map())

      const result = importOrderRule.create(context as any)

      // Check if Program returns an empty object
      if (result.Program) {
        expect(result.Program(mockNode)).toEqual({})
      } else {
        expect(result).toEqual({})
      }
    })
  })
})