<template>
  <VueDraggable
    class="container"
    v-model="boxes"
    group="boxes"
    handle=".box-title"
    :customUpdate="swapBoxes"
  >
    <div v-for="box in boxes" :key="box.id" class="box" :class="box.id">
      <div class="box-title">{{ box.title }}（整塊可拖曳）</div>

      <VueDraggable v-model="box.list" group="shared" class="inner-list">
        <div v-for="item in box.list" :key="item.id" class="drag-item">
          <h1>{{ item.name }}</h1>
        </div>
      </VueDraggable>
    </div>
  </VueDraggable>
</template>

<script setup>
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

const boxes = ref([
  {
    id: 'redBox',
    title: '紅區塊',
    list: [
      { id: 1, name: 'Aoooooo' },
      { id: 2, name: 'Boooooo' },
    ],
  },
  {
    id: 'greenBox',
    title: '綠區塊',
    list: [
      { id: 3, name: 'Coooooo' },
      { id: 4, name: 'Doooooo' },
    ],
  },
  {
    id: 'yellowBox',
    title: '黃區塊',
    list: [
      { id: 5, name: 'Eoooooo' },
      { id: 6, name: 'Foooooo' },
    ],
  },
  {
    id: 'purpleBox',
    title: '紫區塊',
    list: [
      { id: 7, name: 'Goooooo' },
      { id: 8, name: 'Hoooooo' },
    ],
  },
])

// ⭐ 核心：只做「兩個格子交換」，不做整體 shift
const swapBoxes = (event) => {
  const { oldIndex, newIndex } = event

  if (oldIndex === newIndex) return

  const tmp = boxes.value[oldIndex]
  boxes.value[oldIndex] = boxes.value[newIndex]
  boxes.value[newIndex] = tmp
}
</script>

<style>
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 800px;
}

.box {
  width: 250px;
  min-height: 300px;
  padding: 15px;
  border-radius: 10px;
}

/* 4 個不同顏色的背景 */
.redBox {
  background: #ff4d4d; /* 紅 */
}
.greenBox {
  background: #4caf50; /* 綠 */
}
.yellowBox {
  background: #ffeb3b; /* 黃 */
}
.purpleBox {
  background: #9c27b0; /* 紫 */
}

.box-title {
  font-weight: bold;
  margin-bottom: 10px;
  cursor: grab;
  padding: 5px;
  background: #ddd;
  border-radius: 5px;
}

.inner-list {
  min-height: 200px;
}

.drag-item {
  margin-bottom: 10px;
  cursor: grab;
}
</style>
