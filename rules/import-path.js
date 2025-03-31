// eslint-plugin-fsd/rules/import-path.js
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce absolute or relative paths based on FSD layer",
      category: "Import",
      recommended: true,
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          preset: { enum: ["vanilla", "react", "nextjs", "fsd-default"] },
          pathPrefix: { type: "string" },
          enforceAbsolutePaths: { type: "boolean" },
          allowRelativeWithinLayers: { type: "boolean" },
        },
        additionalProperties: false,
      },
    ],
  },
  create: function (context) {
    const options = context.options[0] || {};
    const pathPrefix = options.pathPrefix || "@/";
    const enforceAbsolutePaths = options.enforceAbsolutePaths === true;
    const allowRelativeWithinLayers =
      options.allowRelativeWithinLayers !== false;

    // FSD 계층 패턴 정의 (프리셋에 따라 다를 수 있음)
    let layerPatterns;
    switch (options.preset) {
      case "nextjs":
        layerPatterns = [
          "core",
          "views",
          "widgets",
          "features",
          "entities",
          "shared",
        ];
        break;
      case "react":
        layerPatterns = [
          "app",
          "pages",
          "widgets",
          "features",
          "entities",
          "shared",
        ];
        break;
      case "vanilla":
        layerPatterns = [
          "app",
          "pages",
          "widgets",
          "features",
          "entities",
          "shared",
        ];
        break;
      case "fsd-default":
      default:
        layerPatterns = [
          "app",
          "pages",
          "widgets",
          "features",
          "entities",
          "shared",
        ];
        break;
    }

    // 현재 파일의 계층 확인 (파일 경로에서 FSD 계층 추출)
    function getCurrentLayer(filePath) {
      for (const layer of layerPatterns) {
        if (filePath.includes(`/${layer}/`)) {
          return layer;
        }
      }
      return null;
    }

    // 임포트 경로의 계층 확인
    function getImportLayer(importPath) {
      if (importPath.startsWith(pathPrefix)) {
        const pathWithoutPrefix = importPath.substring(pathPrefix.length);
        const firstSegment = pathWithoutPrefix.split("/")[0];
        if (layerPatterns.includes(firstSegment)) {
          return firstSegment;
        }
      }
      return null;
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFilePath = context.getFilename();

        // 현재 파일과 임포트의 계층 확인
        const currentLayer = getCurrentLayer(currentFilePath);
        const importLayer = getImportLayer(importPath);

        // 다른 계층의 모듈을 임포트할 때는 절대경로 강제
        if (currentLayer && importLayer && currentLayer !== importLayer) {
          if (!importPath.startsWith(pathPrefix)) {
            context.report({
              node,
              message: `다른 FSD 계층(${importLayer})의 모듈은 절대 경로(${pathPrefix})로 임포트해야 합니다.`,
              fix: function (fixer) {
                // 상대 경로를 절대 경로로 변환 (간단한 예시, 실제로는 더 복잡할 수 있음)
                const absolutePath = `${pathPrefix}${importLayer}/${importPath
                  .split("/")
                  .pop()}`;
                return fixer.replaceText(node.source, `'${absolutePath}'`);
              },
            });
          }
        }

        // 같은 계층 내에서 상대 경로 허용 또는 절대 경로 강제
        else if (currentLayer && importLayer && currentLayer === importLayer) {
          if (enforceAbsolutePaths && !importPath.startsWith(pathPrefix)) {
            context.report({
              node,
              message: `모든 임포트는 절대 경로(${pathPrefix})를 사용해야 합니다.`,
              fix: function (fixer) {
                // 상대 경로를 절대 경로로 변환 (간단한 예시)
                const absolutePath = `${pathPrefix}${importLayer}/${importPath
                  .split("/")
                  .pop()}`;
                return fixer.replaceText(node.source, `'${absolutePath}'`);
              },
            });
          } else if (!allowRelativeWithinLayers && importPath.startsWith(".")) {
            context.report({
              node,
              message: `같은 계층(${currentLayer}) 내에서도 절대 경로를 사용해야 합니다.`,
              fix: function (fixer) {
                // 상대 경로를 절대 경로로 변환 (간단한 예시)
                const absolutePath = `${pathPrefix}${importLayer}/${importPath
                  .split("/")
                  .pop()}`;
                return fixer.replaceText(node.source, `'${absolutePath}'`);
              },
            });
          }
        }

        // 일반적인 임포트에 대해 절대 경로 강제 (옵션 활성화 시)
        else if (
          enforceAbsolutePaths &&
          !importPath.startsWith(pathPrefix) &&
          !importPath.startsWith(".") &&
          !importPath.startsWith("/")
        ) {
          // 외부 패키지가 아닌 내부 모듈에 대해서만 적용
          if (!importPath.includes("/") && !importPath.includes("\\")) {
            return; // 외부 패키지는 건너뜀
          }

          context.report({
            node,
            message: `모든 내부 모듈 임포트는 절대 경로(${pathPrefix})를 사용해야 합니다.`,
          });
        }
      },
    };
  },
};
