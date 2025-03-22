// eslint-plugin-fsd/rules/enforce-barrel-imports.js
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce using barrel files for imports within FSD architecture",
      category: "Import",
      recommended: true,
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          pathPrefix: { type: "string" },
          barrelFileNames: {
            type: "array",
            items: { type: "string" },
          },
          ignorePatterns: {
            type: "array",
            items: { type: "string" },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: function (context) {
    const options = context.options[0] || {};
    const pathPrefix = options.pathPrefix || "@/";
    const barrelFileNames = options.barrelFileNames || [
      "index.ts",
      "index.js",
      "index.tsx",
      "index.jsx",
    ];
    const ignorePatterns = options.ignorePatterns || [];

    // FSD 계층 패턴 (기본값)
    const fsdLayers = [
      "app",
      "views",
      "widgets",
      "features",
      "entities",
      "shared",
      "pages",
      "core",
      "components",
      "lib",
      "styles",
      "hooks",
      "utils",
    ];

    // 임포트 경로가 배럴 파일이 아닌 직접 파일을 참조하는지 확인
    function isDirectFileImport(importPath) {
      // 외부 패키지인 경우 (path alias가 포함되지 않은 경우) 무시
      if (!importPath.startsWith(pathPrefix)) {
        return false;
      }

      // 무시할 패턴에 해당하는 경우 무시
      if (ignorePatterns.some((pattern) => importPath.includes(pattern))) {
        return false;
      }

      const pathParts = importPath.substring(pathPrefix.length).split("/");

      // FSD 계층 패턴에 매칭되는지 확인
      const layerName = pathParts[0];
      if (!fsdLayers.includes(layerName)) {
        return false; // 알려진 FSD 계층이 아니면 무시
      }

      // 가장 마지막 세그먼트가 파일이름이고, 배럴 파일이 아닌 경우
      const lastSegment = pathParts[pathParts.length - 1];

      // 확장자가 있는 경우 (파일 직접 참조 가능성)
      if (lastSegment.includes(".")) {
        return !barrelFileNames.includes(lastSegment);
      }

      // 경로의 끝이 배럴 파일명으로 끝나지 않고 추가 세그먼트가 있는 경우
      return pathParts.length > 2;
    }

    // 직접 임포트를 배럴 파일 임포트로 수정
    function getBarrelImportPath(importPath) {
      const pathParts = importPath.substring(pathPrefix.length).split("/");
      const layerName = pathParts[0];

      // 슬라이스/모듈 이름 (두 번째 세그먼트) 까지만 포함
      const sliceName = pathParts[1];

      // 배럴 파일 경로 (예: @/features/auth 형태로 변환)
      return `${pathPrefix}${layerName}/${sliceName}`;
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        if (isDirectFileImport(importPath)) {
          const barrelPath = getBarrelImportPath(importPath);

          context.report({
            node,
            message: `FSD 아키텍처에서는 직접 파일 임포트 대신 배럴 파일을 통한 임포트를 사용해야 합니다. '${importPath}' 대신 '${barrelPath}'를 사용하세요.`,
            fix: function (fixer) {
              return fixer.replaceText(node.source, `'${barrelPath}'`);
            },
          });
        }
      },
    };
  },
};
