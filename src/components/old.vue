<template>
  <div class="app-container">
    <el-table :data="pagedData" style="width: 100%" border @sort-change="handleSortChange">
      <el-table-column prop="id" label="ID" width="80" sortable="custom" />
      <el-table-column prop="name" label="姓名" sortable="custom">
        <template #default="{ row }"> {{ row }}/{{ row.name }} </template>
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
    <button @click="aa">++</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// --- 1. 定義型別與狀態 ---
interface UserData {
  id: number
  name: string
  date: string
  amount: number
}

const aa = () => {
  console.log('aa')
  allData.value = [{ id: 1, name: 'User 1', date: '2023-01-01', amount: 1000 }]
}

// 原始的完整資料 (不會被直接修改，除非重新 fetch)
const allData = ref<UserData[]>([])

// 分頁狀態
const currentPage = ref(1)
const pageSize = ref(5) // 一頁顯示 5 筆以便測試

// 排序狀態
const sortState = ref({
  prop: '', // 排序欄位
  order: '', // 'ascending' | 'descending' | null
})

// --- 2. 產生假資料 (模擬從 API 一次拿回所有資料) ---
onMounted(() => {
  const mockList: UserData[] = []
  for (let i = 0; i < 50; i++) {
    mockList.push({
      id: i + 1,
      name: `User ${i + 1}`,
      date: `2023-01-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')}`,
      amount: Math.floor(Math.random() * 10000),
    })
  }
  // 這裡假設是從 API 拿到的，直接存入 allData
  allData.value = mockList
})

// --- 3. 核心邏輯：計算屬性 (Computed) ---

// 第一層 Computed: 處理排序
// 根據 sortState 對 allData 進行排序，回傳一個新陣列
const sortedData = computed(() => {
  console.log('觸發')
  if (allData.value.length === 0) {
    console.log('觸發 (空資料快速跳過)')
    return []
  }
  // 1. 複製陣列
  const data = [...allData.value]
  const { prop, order } = sortState.value

  // 2. 若無排序條件，直接回傳
  if (!prop || !order) {
    return data
  }

  // 3. 開始排序
  data.sort((a, b) => {
    const valA = a[prop as keyof UserData]
    const valB = b[prop as keyof UserData]

    // --- 情況 A: 數字排序 (Number) ---
    // 適用於 ID, Amount, Age 等
    if (typeof valA === 'number' && typeof valB === 'number') {
      return order === 'ascending' ? valA - valB : valB - valA
    }

    // --- 情況 B: 日期排序 (Date) ---
    // 適用於 '2023-01-01', '2023/12/31 12:00' 等
    // 原理：嘗試將值轉為時間戳記 (毫秒數)
    const dateA = new Date(valA as string | number | Date).getTime()
    const dateB = new Date(valB as string | number | Date).getTime()

    // 檢查是否為有效日期 (排除 NaN) 且不是純數字字串(防止把 "123" 當成毫秒)
    // 註: 如果你的日期格式很標準，其實這段邏輯可以簡化，但這樣寫最保險
    if (!isNaN(dateA) && !isNaN(dateB)) {
      return order === 'ascending' ? dateA - dateB : dateB - dateA
    }

    // --- 情況 C: 字串/中文排序 (String) ---
    // 適用於 姓名, 地址, 備註
    const strA = String(valA)
    const strB = String(valB)

    if (order === 'ascending') {
      // 'zh-TW' 確保中文依筆畫/拼音正確排序
      // numeric: true 可以讓 "Item 1", "Item 2", "Item 10" 排序正確，而不是 1, 10, 2
      return strA.localeCompare(strB, 'zh-TW', { numeric: true })
    } else {
      return strB.localeCompare(strA, 'zh-TW', { numeric: true })
    }
  })

  return data
})

// 第二層 Computed: 處理分頁
// 拿 sortedData 切割出當前頁面要顯示的資料
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedData.value.slice(start, end)
})

// 總筆數 (直接回傳 allData 長度)
const total = computed(() => allData.value.length)

// --- 4. 事件處理 ---

// 當使用者點擊 Table 表頭排序時觸發
const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  sortState.value = { prop, order }
  // 建議：排序改變時，通常要把頁碼重置回第 1 頁，不然使用者可能會迷路
  // currentPage.value = 1
}
</script>
