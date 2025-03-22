// eslint-plugin-fsd/index.js
const vanillaConfig = require("./presets/vanilla");
const reactConfig = require("./presets/react");
const nextjsConfig = require("./presets/nextjs");
const fsdDefaultConfig = require("./presets/fsd-default");
const importPathRule = require("./rules/import-path");
const enforceBarrelImportsRule = require("./rules/enforce-barrel-imports");
const layerBoundaryRule = require("./rules/layer-boundary");

module.exports = {
  configs: {
    recommended: {
      plugins: ["import", "eslint-plugin-fsd"],
      rules: {
        "fsd/import-order": "error",
        "fsd/layer-boundary": "error",
      },
    },
    vanilla: {
      plugins: ["import", "eslint-plugin-fsd"],
      rules: {
        "fsd/import-order": ["error", { preset: "vanilla" }],
        "fsd/layer-boundary": ["error", { preset: "vanilla" }],
      },
    },
    react: {
      plugins: ["import", "eslint-plugin-fsd"],
      rules: {
        "fsd/import-order": ["error", { preset: "react" }],
        "fsd/layer-boundary": ["error", { preset: "react" }],
      },
    },
    nextjs: {
      plugins: ["import", "eslint-plugin-fsd"],
      rules: {
        "fsd/import-order": ["error", { preset: "nextjs" }],
        "fsd/layer-boundary": ["error", { preset: "nextjs" }],
      },
    },
    "strict-absolute": {
      plugins: ["import", "eslint-plugin-fsd"],
      rules: {
        "fsd/import-order": "error",
        "fsd/import-path": ["error", { enforceAbsolutePaths: true }],
        "fsd/layer-boundary": "error",
      },
    },
    "mixed-paths": {
      plugins: ["import", "eslint-plugin-fsd"],
      rules: {
        "fsd/import-order": "error",
        "fsd/import-path": ["error", { allowRelativeWithinLayers: true }],
        "fsd/layer-boundary": "error",
      },
    },
    "barrel-imports": {
      plugins: ["import", "eslint-plugin-fsd"],
      rules: {
        "fsd/import-order": "error",
        "fsd/enforce-barrel-imports": "error",
        "fsd/layer-boundary": "error",
      },
    },
    "full-fsd": {
      plugins: ["import", "eslint-plugin-fsd"],
      rules: {
        "fsd/import-order": "error",
        "fsd/import-path": ["error", { allowRelativeWithinLayers: true }],
        "fsd/enforce-barrel-imports": "error",
        "fsd/layer-boundary": "error",
      },
    },
    "warn-boundaries": {
      plugins: ["import", "eslint-plugin-fsd"],
      rules: {
        "fsd/import-order": "error",
        "fsd/layer-boundary": ["warn", { enforcement: "warn" }],
      },
    },
    "allow-boundaries": {
      plugins: ["import", "eslint-plugin-fsd"],
      rules: {
        "fsd/import-order": "error",
        "fsd/layer-boundary": ["error", { enforcement: "allow" }],
      },
    },
  },
  rules: {
    "import-order": {
      meta: {
        type: "suggestion",
        docs: {
          description: "Enforce FSD (Feature-Sliced Design) import order",
          category: "Stylistic Issues",
          recommended: true,
        },
        fixable: "code",
        schema: [
          {
            type: "object",
            properties: {
              preset: { enum: ["vanilla", "react", "nextjs", "fsd-default"] },
              pathPrefix: { type: "string" },
              noAliases: { type: "boolean" },
              enforceAbsolutePaths: { type: "boolean" },
              allowRelativeWithinLayers: { type: "boolean" },
            },
            additionalProperties: false,
          },
        ],
      },
      create: function (context) {
        const options = context.options[0] || {};
        const preset = options.preset || "fsd-default";
        const pathPrefix =
          options.pathPrefix !== undefined ? options.pathPrefix : "@/";
        const noAliases = options.noAliases === true;

        let config;
        switch (preset) {
          case "vanilla":
            config = vanillaConfig;
            break;
          case "react":
            config = reactConfig;
            break;
          case "nextjs":
            config = nextjsConfig;
            break;
          case "fsd-default":
          default:
            config = fsdDefaultConfig;
            break;
        }

        // path alias를 사용하지 않는 경우
        if (noAliases) {
          config = {
            ...config,
            pathGroups: [],
          };
        }
        // path alias 프리픽스가 다른 경우
        else if (pathPrefix !== "@/") {
          config = {
            ...config,
            pathGroups: config.pathGroups.map((group) => ({
              ...group,
              pattern: group.pattern.replace("@/", pathPrefix),
            })),
          };
        }

        return {
          Program() {
            context.options = [config];

            const importOrderRule = context.sourceCode.eslint.linter
              .getRules()
              .get("import/order");
            if (importOrderRule) {
              return importOrderRule.create(context);
            }
          },
        };
      },
    },
    "import-path": importPathRule,
    "enforce-barrel-imports": enforceBarrelImportsRule,
    "layer-boundary": layerBoundaryRule,
  },
};
