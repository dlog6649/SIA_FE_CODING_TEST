import { presetIcons, presetUno, transformerCompileClass } from "unocss"
import { VitePluginConfig } from "unocss/vite"

import { getCollections } from "./src/assets/icons/node-loaders"

export default {
  rules: [
    [
      "ellipsis",
      {
        display: "block",
        overflow: "hidden",
        "text-overflow": "ellipsis",
        "white-space": "nowrap",
      },
    ],
    [
      /^m-ellipsis-(\d+)$/,
      ([, c]) => ({
        display: "-webkit-box",
        overflow: "hidden",
        "text-overflow": "ellipsis",
        "word-wrap": "break-word",
        "-webkit-line-clamp": c,
        "-webkit-box-orient": "vertical",
      }),
    ],
  ],
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        color: "var(--icon-default)",
        "vertical-align": "middle",
      },
      collections: getCollections("outline"),
    }),
  ],
  transformers: [transformerCompileClass()],
} satisfies VitePluginConfig
