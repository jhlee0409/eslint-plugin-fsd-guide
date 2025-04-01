import fsdDefaultConfig from '../../presets/fsd-default'
import { ImportOrderConfig } from '../../types'

describe('fsd-default preset', () => {
  it('should have correct import order configuration', () => {
    // fsd-default 프리셋 구성 확인
    const config: ImportOrderConfig = fsdDefaultConfig

    // 그룹 기본 구조 확인 (정확한 구조는 바뀔 수 있음)
    expect(config.groups).toContain('builtin')
    expect(config.groups).toContain('external')
    expect(config.groups).toContain('internal')
    // parent와 sibling은 배열로 묶여 있을 수 있음
    const hasParentSibling = config.groups.some(group =>
      Array.isArray(group) && group.includes('parent') && group.includes('sibling')
    )
    expect(hasParentSibling).toBe(true)
    expect(config.groups).toContain('index')
    expect(config.groups).toContain('object')
    expect(config.groups).toContain('type')

    // FSD 레이어 pathGroups 확인
    expect(config.pathGroups.length).toBeGreaterThan(0)

    // 주요 레이어 패턴 확인
    const patterns = config.pathGroups.map(g => g.pattern)
    expect(patterns).toContain('@/app/**')
    expect(patterns).toContain('@/pages/**')
    expect(patterns).toContain('@/widgets/**')
    expect(patterns).toContain('@/features/**')
    expect(patterns).toContain('@/entities/**')
    expect(patterns).toContain('@/shared/**')

    // 모든 pathGroup에 대해 internal 그룹과 before 위치 확인
    config.pathGroups.forEach(group => {
      expect(group.group).toBe('internal')
      expect(group.position).toBe('before')
    })

    // 올바른 순서로 정렬되어 있는지 확인
    expect(config['newlines-between']).toBe('always')
    expect(config.alphabetize?.order).toBe('asc')
    expect(config.alphabetize?.caseInsensitive).toBe(true)
  })
})