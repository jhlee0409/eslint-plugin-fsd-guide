import plugin from '../index'

describe('eslint-plugin-fsd', () => {
  it('should export all rules', () => {
    // 모든 규칙이 내보내졌는지 확인
    expect(plugin.rules).toEqual({
      'layer-boundary': expect.any(Object),
      'import-path': expect.any(Object),
      'enforce-barrel-imports': expect.any(Object),
      'import-order': expect.any(Object),
    })
  })

  it('should export config presets', () => {
    // 설정 프리셋이 있는지 확인
    expect(plugin.configs).toBeDefined()
    expect(plugin.configs.recommended).toBeDefined()

    // 실제 구성이 있는지 확인
    const recommendedConfig = plugin.configs.recommended
    expect(recommendedConfig.plugins).toContain('fsd-guide')
    expect(recommendedConfig.plugins).toContain('import')

    // 규칙이 설정되어 있는지 확인
    expect(recommendedConfig.rules).toBeDefined()
    expect(Object.keys(recommendedConfig.rules)).toEqual(
      expect.arrayContaining([
        'fsd-guide/layer-boundary',
        'fsd-guide/import-path',
        'fsd-guide/enforce-barrel-imports',
        'fsd-guide/import-order'
      ])
    )
  })

  it('should have vanilla preset', () => {
    expect(plugin.configs.vanilla).toBeDefined()
    const vanillaConfig = plugin.configs.vanilla

    // Vanilla 프리셋에 올바른 import-order 설정이 있는지 확인
    expect(vanillaConfig.rules['fsd-guide/import-order']).toBeDefined()
    expect(Array.isArray(vanillaConfig.rules['fsd-guide/import-order'])).toBe(true)
    expect(vanillaConfig.rules['fsd-guide/import-order'][0]).toBe('error')
    expect(vanillaConfig.rules['fsd-guide/import-order'][1]).toEqual(
      expect.objectContaining({
        preset: 'vanilla'
      })
    )
  })

  it('should have react preset', () => {
    expect(plugin.configs.react).toBeDefined()
    const reactConfig = plugin.configs.react

    // React 프리셋에 올바른 import-order 설정이 있는지 확인
    expect(reactConfig.rules['fsd-guide/import-order']).toBeDefined()
    expect(Array.isArray(reactConfig.rules['fsd-guide/import-order'])).toBe(true)
    expect(reactConfig.rules['fsd-guide/import-order'][0]).toBe('error')
    expect(reactConfig.rules['fsd-guide/import-order'][1]).toEqual(
      expect.objectContaining({
        preset: 'react'
      })
    )
  })

  it('should have nextjs preset', () => {
    expect(plugin.configs.nextjs).toBeDefined()
    const nextjsConfig = plugin.configs.nextjs

    // Next.js 프리셋에 올바른 import-order 설정이 있는지 확인
    expect(nextjsConfig.rules['fsd-guide/import-order']).toBeDefined()
    expect(Array.isArray(nextjsConfig.rules['fsd-guide/import-order'])).toBe(true)
    expect(nextjsConfig.rules['fsd-guide/import-order'][0]).toBe('error')
    expect(nextjsConfig.rules['fsd-guide/import-order'][1]).toEqual(
      expect.objectContaining({
        preset: 'nextjs'
      })
    )
  })
})