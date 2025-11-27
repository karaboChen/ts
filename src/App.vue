<script setup lang="ts">
import { ref } from 'vue'
import { CaretBottom, CaretTop } from '@element-plus/icons-vue'

const tableData = [
  {
    date: '2016-05-03',
  },
]

// 哪些 row 被展開，用 index 當 key
const expandedRows = ref<number[]>([])

const isExpanded = (index: number) => expandedRows.value.includes(index)

const toggleExpand = (index: number) => {
  console.log(index)
  const i = expandedRows.value.indexOf(index)
  console.log(i)
  if (i === -1) {
    expandedRows.value.push(index) // 展開
  } else {
    expandedRows.value.splice(i, 1) // 收合
  }
}

// ---- 展開/收合動態高度動畫 ----
const beforeEnter = (el: Element) => {
  const elem = el as HTMLElement
  elem.style.maxHeight = '0'
  elem.style.overflow = 'hidden'
}

const enter = (el: Element) => {
  const elem = el as HTMLElement
  const h = elem.scrollHeight

  // 先強制 reflow，再改 max-height，才會觸發 transition
  elem.style.transition = 'max-height 0.5s ease'
  void elem.offsetHeight
  elem.style.maxHeight = h + 'px'
}

const afterEnter = (el: Element) => {
  const elem = el as HTMLElement
  // 動畫結束，清掉 inline style，讓內容正常自適應
  elem.style.maxHeight = ''
  elem.style.overflow = ''
  elem.style.transition = ''
}

const beforeLeave = (el: Element) => {
  const elem = el as HTMLElement
  const h = elem.scrollHeight
  elem.style.maxHeight = h + 'px'
  elem.style.overflow = 'hidden'
  elem.style.transition = 'max-height 0.3s ease'
}

const leave = (el: Element) => {
  const elem = el as HTMLElement
  // 往上收合
  void elem.offsetHeight
  elem.style.maxHeight = '0'
}

const afterLeave = (el: Element) => {
  const elem = el as HTMLElement
  // 收合完清掉 style
  elem.style.maxHeight = ''
  elem.style.overflow = ''
  elem.style.transition = ''
}
</script>

<template>
  <el-table
    class="dark-table"
    :data="tableData"
    border
    style="width: 12%"
    :header-cell-style="{
      backgroundColor: 'black', // 抬頭底色
      color: '#D5D529', // 文字顏色 = 圖片那種亮黃
      fontWeight: '700', // 讓字看起來更有力
    }"
  >
    <el-table-column prop="date" label="Date" width="180">
      <template #default="{ row, $index }">
        <button class="mb-1">上傳圖片</button>

        <!-- 第一列 + V 圖示 同一行 -->
        <div class="first-line">
          <p class="date-text">{{ row.date }}</p>
          <el-icon class="caret-icon" @click="toggleExpand($index)">
            <CaretBottom v-if="!isExpanded($index)" />
            <CaretTop v-else />
          </el-icon>
        </div>

        <!-- 展開內容，使用 JS hook 做 max-height 動畫 -->
        <transition
          @before-enter="beforeEnter"
          @enter="enter"
          @after-enter="afterEnter"
          @before-leave="beforeLeave"
          @leave="leave"
          @after-leave="afterLeave"
        >
          <div v-show="isExpanded($index)">
            <p v-for="i in 13" :key="i">{{ row.date }}</p>
          </div>
        </transition>
      </template>
    </el-table-column>
  </el-table>
</template>

<style>
body {
  background-color: black;
}

.first-line {
  display: flex;
  align-items: center;
  gap: 4px;
}

.date-text {
  margin: 0;
}

.caret-icon {
  cursor: pointer;
}
</style>
