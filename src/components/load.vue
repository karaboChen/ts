<script setup lang="ts">
import { onUnmounted, ref } from "vue";

const progress = ref(0);
const showBar = ref(false);
const loading = ref(false);
let timer: number | null = null;

const startLoading = () => {
  if (loading.value) return;
  loading.value = true;
  showBar.value = true;
  progress.value = 0;

  timer = window.setInterval(() => {
    progress.value = Math.min(progress.value + 3, 100);

    if (progress.value >= 100) {
      if (timer) window.clearInterval(timer);
      timer = null;
      setTimeout(() => {
        showBar.value = false;
        loading.value = false;
      }, 400);
    }
  }, 50);
};

const callApi = async () => {
  if (loading.value) return;
  startLoading();
  // 替換成你的實際 API 呼叫
  await new Promise((resolve) => setTimeout(resolve, 800));
};

onUnmounted(() => {
  if (timer) window.clearInterval(timer);
});
</script>

<template>
  <div
    class="min-h-screen bg-[#040720] text-white flex items-center justify-center px-4"
  >
    <div class="flex flex-col items-center gap-8 w-full max-w-4xl">
      <button
        type="button"
        class="px-6 py-3 rounded-full bg-[#34f5e9] text-[#03142d] font-semibold tracking-wide shadow-[0_12px_24px_rgba(52,245,233,0.35)] hover:shadow-[0_16px_32px_rgba(52,245,233,0.45)] transition-all duration-300 active:translate-y-0.5"
        @click="callApi"
      >
        呼叫 API
      </button>

      <div
        v-if="showBar"
        class="w-full max-w-3xl h-16 rounded-full border-4 border-[#66c1ff] bg-[#0b1024] relative overflow-hidden shadow-[0_0_32px_4px_rgba(102,193,255,0.15)]"
      >
        <div
          class="absolute left-2 top-2 bottom-2 rounded-full bg-[#34f5e9] shadow-[0_0_18px_6px_rgba(52,245,233,0.45)] transition-all duration-400 ease-in-out"
          :style="{ width: progress === 0 ? '0%' : `calc(${progress}% - 16px)` }"
        ></div>
      </div>

      <div v-if="showBar" class="text-[#34f5e9] text-4xl font-semibold tracking-wide drop-shadow">
        {{ Math.round(progress) }}%
      </div>
    </div>
  </div>
</template>

<style scoped>
.duration-400 {
  transition-duration: 400ms;
}
</style>
