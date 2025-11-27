// uno.config.ts
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],

  variants: [
    // eye: variant (用 regex 實現)
    (matcher) => {
      if (!matcher.startsWith('eye:')) return matcher

      return {
        // 原本的 class 去掉 eye:
        matcher: matcher.slice(4),

        // 把 selector 外面包上 .eye
        selector: (s) => `.eye ${s}`,
      }
    },
  ],
})
