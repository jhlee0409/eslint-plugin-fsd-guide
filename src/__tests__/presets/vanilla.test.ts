import vanillaPresetConfig from '../../presets/vanilla'
import { ImportOrderConfig } from '../../types'

describe('vanilla preset', () => {
  it('should have correct configuration', () => {
    // Verify vanilla preset configuration
    expect(vanillaPresetConfig).toBeDefined()
    expect(vanillaPresetConfig['newlines-between']).toBe('always')
    expect(vanillaPresetConfig.alphabetize).toEqual(
      expect.objectContaining({
        order: 'asc',
        caseInsensitive: true
      })
    )

    // Check base group structure (exact structure may change)
    expect(vanillaPresetConfig.groups).toEqual(
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

    // Check FSD layers (vanilla preset uses the same layers)
    expect(vanillaPresetConfig.pathGroups).toBeDefined()
    expect(vanillaPresetConfig.pathGroups.length).toBeGreaterThan(0)

    // Check major layer patterns
    const pathPatterns = vanillaPresetConfig.pathGroups.map(group => group.pattern)
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
    for (const group of vanillaPresetConfig.pathGroups) {
      expect(group.group).toBe('internal')
      expect(group.position).toBe('before')
    }

    // Verify correct ordering
    const layerOrder = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']
    const pathGroupsOrder = vanillaPresetConfig.pathGroups.map(g => {
      const match = g.pattern.match(/@\/([^/]+)\/\*\*/)
      return match ? match[1] : null
    }).filter(Boolean)

    for (let i = 0; i < layerOrder.length; i++) {
      expect(pathGroupsOrder[i]).toBe(layerOrder[i])
    }
  })
})