<script setup lang="ts">
import { ref, onMounted } from 'vue'

const mode = ref<'normal' | 'dark' | 'eye'>('normal')

function toggleDark() {
  mode.value = mode.value === 'dark' ? 'normal' : 'dark'
  document.documentElement.classList.toggle('dark')
}

function toggleEye() {
  mode.value = mode.value === 'eye' ? 'normal' : 'eye'
  document.documentElement.classList.toggle('eye')
}
</script>

<template>
  <div class="p-4">
    <button class="px-4 py-2 bg-gray-300 mr-2" @click="toggleDark">切換深色模式</button>

    <button class="px-4 py-2 bg-green-300" @click="toggleEye">切換護眼模式</button>

    <div
      class="mt-4 p-4 dark:bg-green-500 bg-red eye:bg-blue-500 text-black dark:text-white eye:text-black"
    >
      這裡會根據模式變色
    </div>
  </div>
</template>
