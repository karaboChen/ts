<template>
  <div class="app-container">
    <el-table :data="pagedData" style="width: 100%" border @sort-change="handleSortChange">
      <el-table-column prop="id" label="ID" width="80" sortable="custom" />

      <el-table-column prop="name" label="姓名" sortable="custom">
        <template #default="{ row }"> {{ row.id }} / {{ row.name }} </template>
      </el-table-column>

      <el-table-column prop="date" label="日期" sortable="custom" />
      <el-table-column prop="amount" label="金額" sortable="custom" />
    </el-table>

    <div style="margin-top: 20px; display: flex; justify-content: flex-end">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20]"
        :total="total"
        layout="total, sizes, prev, pager, next"
      />
    </div>

    <button @click="resetData">重置測試資料</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useClientTable } from '@/composables/useClientTable' // 引入剛寫好的 hook

// 1. 定義資料型別
interface UserData {
  id: number
  name: string
  date: string
  amount: number
}

// 2. 原始資料
const allData = ref<UserData[]>([])

// 3. 使用 Composable！只需這一行
// 解構出 table 需要的所有屬性
const { pagedData, currentPage, pageSize, total, handleSortChange } = useClientTable(allData, {
  defaultPageSize: 5,
})

// --- 以下皆為模擬資料邏輯，與分頁邏輯無關 ---

const resetData = () => {
  allData.value = [{ id: 1, name: 'User 1', date: '2023-01-01', amount: 1000 }]
}

onMounted(() => {
  // 模擬 API 請求
  const mockList: UserData[] = []
  for (let i = 0; i < 50; i++) {
    mockList.push({
      id: i + 1,
      name: `User ${i + 1}`,
      date: `2023-01-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')}`,
      amount: Math.floor(Math.random() * 10000),
    })
  }
  allData.value = mockList
})
</script>
