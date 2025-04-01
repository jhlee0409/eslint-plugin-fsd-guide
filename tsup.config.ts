import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'], // ESLint 플러그인은 일반적으로 CommonJS를 사용합니다
  dts: true, // 타입 선언 파일 생성
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['eslint'], // eslint는 외부 의존성으로 처리
})