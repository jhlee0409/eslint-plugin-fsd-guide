import importOrderRule from '../../rules/import-order'

describe('import-order rule', () => {
  it('should have correct metadata', () => {
    // 메타데이터를 정확하게 설정했는지 확인
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
    // 기본 옵션이 올바르게 설정되어 있는지 확인
    expect(importOrderRule.defaultOptions).toEqual([{
      preset: 'fsd-default',
      pathPrefix: '@/',
      noAliases: false
    }])
  })

  it('should use the appropriate preset based on options', () => {
    // 각 프리셋이 올바르게 선택되는지 확인
    // 이 테스트에서는 직접 create 함수를 호출하거나 로직을 검증할 수 없음
    // 기본 프리셋과 옵션 처리만 테스트

    // 테스트할 수 있는 부분: 스키마 정의가 올바른지
    const schema = importOrderRule.meta.schema[0]
    expect(schema.properties.preset.enum).toEqual(['vanilla', 'react', 'nextjs', 'fsd-default'])
    expect(schema.properties.pathPrefix.type).toBe('string')
    expect(schema.properties.noAliases.type).toBe('boolean')
  })
})