import reactPresetConfig from '../../presets/react'
import { ImportOrderConfig } from '../../types'

describe('react preset', () => {
  it('should have correct configuration', () => {
    // Verify react preset configuration
    expect(reactPresetConfig).toBeDefined()
    expect(reactPresetConfig['newlines-between']).toBe('always')
    expect(reactPresetConfig.alphabetize).toEqual(
      expect.objectContaining({
        order: 'asc',
        caseInsensitive: true
      })
    )

    // Check base group structure (exact structure may change)
    expect(reactPresetConfig.groups).toEqual(
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

    // Check FSD layers (react preset uses default FSD layers)
    expect(reactPresetConfig.pathGroups).toBeDefined()
    expect(reactPresetConfig.pathGroups.length).toBeGreaterThan(0)

    // Check major layer patterns
    const pathPatterns = reactPresetConfig.pathGroups.map(group => group.pattern)
    expect(pathPatterns).toEqual(
      expect.arrayContaining([
        '@/app/**',
        '@/pages/**',
        '@/widgets/**',
        '@/features/**',
        '@/entities/**',
        '@/shared/**'
      ])
    )

    // Check that all pathGroups have internal group and before position
    for (const group of reactPresetConfig.pathGroups) {
      expect(group.group).toBe('internal')
      expect(group.position).toBe('before')
    }

    // Verify correct ordering
    const layerOrder = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']
    const pathGroupsOrder = reactPresetConfig.pathGroups.map(g => {
      const match = g.pattern.match(/@\/([^/]+)\/\*\*/)
      return match ? match[1] : null
    }).filter(Boolean)

    for (let i = 0; i < layerOrder.length; i++) {
      expect(pathGroupsOrder[i]).toBe(layerOrder[i])
    }
  })
})