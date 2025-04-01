import nextjsPresetConfig from '../../presets/nextjs'
import { ImportOrderConfig } from '../../types'

describe('nextjs preset', () => {
  it('should have correct configuration', () => {
    // Verify nextjs preset configuration
    expect(nextjsPresetConfig).toBeDefined()
    expect(nextjsPresetConfig['newlines-between']).toBe('always')
    expect(nextjsPresetConfig.alphabetize).toEqual(
      expect.objectContaining({
        order: 'asc',
        caseInsensitive: true
      })
    )

    // Check base group structure (exact structure may change)
    expect(nextjsPresetConfig.groups).toEqual(
      expect.arrayContaining([
        'builtin',
        'external',
        'internal',
        // parent and sibling may be grouped in an array
        expect.arrayContaining(['parent', 'sibling']),
        'object',
        'type',
        'index'
      ])
    )

    // Check NextJS preset specific pathGroups
    expect(nextjsPresetConfig.pathGroups).toBeDefined()
    expect(nextjsPresetConfig.pathGroups.length).toBeGreaterThan(0)

    // Check major layer patterns
    const pathPatterns = nextjsPresetConfig.pathGroups.map(group => group.pattern)
    expect(pathPatterns).toEqual(
      expect.arrayContaining([
        '@/core/**',
        '@/views/**',
        '@/widgets/**',
        '@/features/**',
        '@/entities/**',
        '@/shared/**'
      ])
    )

    // Check that all pathGroups have internal group and before position
    for (const group of nextjsPresetConfig.pathGroups) {
      expect(group.group).toBe('internal')
      expect(group.position).toBe('before')
    }

    // Verify correct ordering
    const layerOrder = ['core', 'views', 'widgets', 'features', 'entities', 'shared']
    const pathGroupsOrder = nextjsPresetConfig.pathGroups.map(g => {
      const match = g.pattern.match(/@\/([^/]+)\/\*\*/)
      return match ? match[1] : null
    }).filter(Boolean)

    for (let i = 0; i < layerOrder.length; i++) {
      expect(pathGroupsOrder[i]).toBe(layerOrder[i])
    }
  })
})