<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import User from '@/components/User.vue'

/* --- Tabs 型別定義 --- */
type TabKey = 'user' 

interface TabItem {
  name: string
  key: TabKey
}

/* --- Tab List --- */
const tabs: TabItem[] = [{ name: 'User', key: 'user' }]

/* --- 當前 Tab --- */
const currentTab = ref<TabKey>('user')

/* --- Component Map（安全型別）--- */
const tabMap: Record<TabKey, Component> = {
  user: User,
}
</script>

<template>
  <div class="flex items-center gap-4 border-b pb-2">
    <!-- Tabs -->
    <div class="flex">
      <div
        v-for="t in tabs"
        :key="t.key"
        class="px-6 py-3 cursor-pointer border border-gray-300 rounded-t hover:bg-gray-100 transition text-gray-700"
        :class="currentTab === t.key ? 'border-b-white bg-white font-bold' : 'bg-gray-50'"
        @click="currentTab = t.key"
      >
        {{ t.name }}
      </div>
    </div>

    <!-- Right link -->
    <div>
      <button class="text-blue-500 hover:underline">Task</button>
    </div>
  </div>

  <!-- 動態 Component -->
  <div class="p-4">
    <component :is="tabMap[currentTab]" />
  </div>
</template>
