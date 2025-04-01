import plugin from '../index'

describe('package root', () => {
  it('should export all rules and configs', () => {
    // Check if all rules are exported
    expect(plugin.rules).toBeTruthy()
    expect(Object.keys(plugin.rules).length).toBeGreaterThan(0)

    // Check if preset configs exist
    expect(plugin.configs).toBeTruthy()
    expect(Object.keys(plugin.configs).length).toBeGreaterThan(0)

    // Check if actual configurations exist
    expect(plugin.configs.recommended).toBeTruthy()
    expect(plugin.configs.vanilla).toBeTruthy()
    expect(plugin.configs.react).toBeTruthy()
    expect(plugin.configs.nextjs).toBeTruthy()

    // Check if rules are configured
    expect(plugin.configs.recommended.rules).toBeTruthy()

    // Check if Vanilla preset has correct import-order configuration
    expect(plugin.configs.vanilla.rules).toHaveProperty('fsd-guide/import-order')

    // Check if React preset has correct import-order configuration
    expect(plugin.configs.react.rules).toHaveProperty('fsd-guide/import-order')

    // Check if Next.js preset has correct import-order configuration
    expect(plugin.configs.nextjs.rules).toHaveProperty('fsd-guide/import-order')
  })
})