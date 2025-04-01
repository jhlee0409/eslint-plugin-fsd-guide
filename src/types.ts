import { TSESLint } from '@typescript-eslint/utils'

// 공통 타입
export type MessageIds = 'invalidLayerImport' | 'invalidImportPath' | 'nonBarrelImport'

// Layer Boundary 타입
export type LayerBoundaryOptions = [{
  layers?: string[];
  ignorePatterns?: string[];
  enforcement?: 'error' | 'warn' | 'allow';
  pathPrefix?: string;
}]

// Import Path 타입
export type ImportPathOptions = [{
  enforceAbsolutePaths?: boolean;
  allowRelativeWithinLayers?: boolean;
  pathPrefix?: string;
}]

// Barrel Imports 타입
export type BarrelImportsOptions = [{
  pathPrefix?: string;
  barrelFileNames?: string[];
  ignorePatterns?: string[];
}]

// Import Order 타입
export interface ImportOrderConfig {
  groups: (string | string[])[];
  pathGroups: {
    pattern: string;
    group: string;
    position: 'before' | 'after';
  }[];
  'newlines-between': 'always' | 'never' | 'always-and-inside-groups';
  alphabetize: {
    order: 'asc' | 'desc';
    caseInsensitive: boolean;
  };
}

export type ImportOrderOptions = [{
  preset?: 'vanilla' | 'react' | 'nextjs' | 'fsd-default';
  pathPrefix?: string;
  noAliases?: boolean;
}]

// ESLint 플러그인 타입
export type ESLintRule<T extends readonly unknown[], U extends string> = TSESLint.RuleModule<U, T>