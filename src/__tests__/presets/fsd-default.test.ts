import fsdDefaultPresetConfig from '../../presets/fsd-default'
import { ImportOrderConfig } from '../../types'

describe('fsd-default preset', () => {
  it('should have correct configuration', () => {
    // Verify fsd-default preset configuration
    expect(fsdDefaultPresetConfig).toBeDefined()
    expect(fsdDefaultPresetConfig['newlines-between']).toBe('always')
    expect(fsdDefaultPresetConfig.alphabetize).toEqual(
      expect.objectContaining({
        order: 'asc',
        caseInsensitive: true
      })
    )

    // Check base group structure (exact structure may change)
    expect(fsdDefaultPresetConfig.groups).toEqual(
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

    // Check FSD layer pathGroups
    expect(fsdDefaultPresetConfig.pathGroups).toBeDefined()
    expect(fsdDefaultPresetConfig.pathGroups.length).toBeGreaterThan(0)

    // Check major layer patterns
    const pathPatterns = fsdDefaultPresetConfig.pathGroups.map(group => group.pattern)
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
    for (const group of fsdDefaultPresetConfig.pathGroups) {
      expect(group.group).toBe('internal')
      expect(group.position).toBe('before')
    }

    // Verify correct ordering
    const layerOrder = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']
    const pathGroupsOrder = fsdDefaultPresetConfig.pathGroups.map(g => {
      const match = g.pattern.match(/@\/([^/]+)\/\*\*/)
      return match ? match[1] : null
    }).filter(Boolean)

    for (let i = 0; i < layerOrder.length; i++) {
      expect(pathGroupsOrder[i]).toBe(layerOrder[i])
    }
  })
})