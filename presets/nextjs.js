// eslint-plugin-fsd/presets/nextjs.js
module.exports = {
  groups: [
    "builtin",
    "external",
    "internal",
    ["parent", "sibling"],
    "index",
    "object",
    "type",
  ],
  pathGroups: [
    {
      pattern: "@/core/**",
      group: "internal",
      position: "before",
    },
    {
      pattern: "@/views/**",
      group: "internal",
      position: "before",
    },
    {
      pattern: "@/widgets/**",
      group: "internal",
      position: "before",
    },
    {
      pattern: "@/features/**",
      group: "internal",
      position: "before",
    },
    {
      pattern: "@/entities/**",
      group: "internal",
      position: "before",
    },
    {
      pattern: "@/shared/**",
      group: "internal",
      position: "before",
    },
  ],
  "newlines-between": "always",
  alphabetize: {
    order: "asc",
    caseInsensitive: true,
  },
};
