// eslint-plugin-fsd/rules/layer-boundary.js
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce FSD layer boundaries by preventing lower layers from importing higher layers",
      category: "Import",
      recommended: true,
    },
    fixable: null, // 자동 수정은 불가능
    schema: [
      {
        type: "object",
        properties: {
          preset: { enum: ["vanilla", "react", "nextjs", "fsd-default"] },
          pathPrefix: { type: "string" },
          enforcement: { enum: ["error", "warn", "allow"] },
        },
        additionalProperties: false,
      },
    ],
  },
  create: function (context) {
    const options = context.options[0] || {};
    const pathPrefix = options.pathPrefix || "@/";
    const enforcement = options.enforcement || "error"; // 기본값은 강제(error)

    // 프리셋에 따른 FSD 계층 순서 정의 (상위 레이어가 먼저 옴)
    let layerOrder;
    switch (options.preset) {
      case "nextjs":
        layerOrder = [
          "core",
          "views",
          "widgets",
          "features",
          "entities",
          "shared",
        ];
        break;
      case "react":
        layerOrder = [
          "app",
          "pages",
          "widgets",
          "features",
          "entities",
          "shared",
        ];
        break;
      case "vanilla":
        layerOrder = [
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
        layerOrder = [
          "app",
          "views",
          "widgets",
          "features",
          "entities",
          "shared",
        ];
        break;
    }

    // 계층 인덱스 반환 (낮을수록 상위 계층)
    function getLayerIndex(layerName) {
      return layerOrder.indexOf(layerName);
    }

    // 현재 파일의 계층 확인
    function getCurrentLayer(filePath) {
      for (const layer of layerOrder) {
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
        if (layerOrder.includes(firstSegment)) {
          return firstSegment;
        }
      }
      return null;
    }

    return {
      ImportDeclaration(node) {
        // enforce가 allow면 검사하지 않음
        if (enforcement === "allow") {
          return;
        }

        const importPath = node.source.value;
        const currentFilePath = context.getFilename();

        // 현재 파일과 임포트의 계층 확인
        const currentLayer = getCurrentLayer(currentFilePath);
        const importLayer = getImportLayer(importPath);

        // 두 계층이 모두 유효하면 비교
        if (currentLayer && importLayer) {
          const currentLayerIndex = getLayerIndex(currentLayer);
          const importLayerIndex = getLayerIndex(importLayer);

          // 현재 계층 인덱스가 임포트하는 계층 인덱스보다 크면
          // (즉, 하위 계층이 상위 계층을 참조하면)
          if (currentLayerIndex > importLayerIndex) {
            const message = `FSD 아키텍처 위반: '${currentLayer}' 계층은 '${importLayer}' 계층을 참조할 수 없습니다. 하위 계층은 상위 계층을 참조할 수 없습니다.`;

            if (enforcement === "error") {
              context.report({
                node,
                message,
              });
            } else if (enforcement === "warn") {
              context.report({
                node,
                message,
                severity: 1, // warning 레벨
              });
            }
          }
        }
      },
    };
  },
};
