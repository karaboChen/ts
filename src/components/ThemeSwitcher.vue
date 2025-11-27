<script setup lang="ts">
import { ref } from 'vue'

const isDark = ref(false)

function switchTheme(event: MouseEvent) {
  const x = event.clientX
  const y = event.clientY

  const circle = document.createElement('div')
  circle.className = 'theme-circle'
  circle.style.left = `${x}px`
  circle.style.top = `${y}px`

  document.body.appendChild(circle)

  // 🔥 判斷擴張 / 收縮
  if (!isDark.value) {
    // Normal → Dark （擴張）
    circle.classList.add('expand')
    document.documentElement.classList.add('dark')
  } else {
    // Dark → Normal （收縮）
    circle.classList.add('shrink')
    document.documentElement.classList.remove('dark')
  }

  // 切換狀態
  isDark.value = !isDark.value

  // 動畫完移除
  setTimeout(() => circle.remove(), 700)
}
</script>

<template>

    <button class="theme-btn ml-auto inline-block" @click="switchTheme">
      {{ isDark ? 'Dark 🌙' : 'Normal ☀' }}
    </button>
</template>

<style scoped>
.theme-btn {
  padding: 8px 16px;
  background: #409eff;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
}
.theme-btn:hover {
  opacity: 0.85;
}
</style>

<!-- 全域 CSS，不能 scoped -->
<style>
/* 圓形基底 */
.theme-circle {
  position: fixed;
  width: 20px;
  height: 20px;
  background: var(--theme-switch-color, #409eff);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  pointer-events: none;
  z-index: 99999;
  opacity: 0.5;
}

/* 擴張動畫 Normal → Dark */
.theme-circle.expand {
  animation: ripple-expand 0.7s ease-out forwards;
}

/* 收縮動畫 Dark → Normal */
.theme-circle.shrink {
  animation: ripple-shrink 0.7s ease-in forwards;
}

/* 擴張 Keyframes */
@keyframes ripple-expand {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(200);
    opacity: 0;
  }
}

/* 收縮 Keyframes */
@keyframes ripple-shrink {
  0% {
    transform: translate(-50%, -50%) scale(200);
    opacity: 0.25;
  }
  100% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
}

/* Dark 模式背景 + 字體 */
html.dark {
  background: #1e1e1e;
  color: white;
  --theme-switch-color: #4a7dff;
}

/* Normal 模式背景 + 字體 */
html {
  background: #ffffff;
  color: #333;
  --theme-switch-color: #409eff;
}

/* 平滑過渡一般 UI */
html,
body,
* {
  transition:
    background-color 0.35s ease,
    color 0.35s ease,
    border-color 0.35s ease;
}
</style>
