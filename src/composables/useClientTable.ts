// composables/useClientTable.ts
import { ref, computed, type Ref } from 'vue'

type SortState = {
  prop: string
  order: 'ascending' | 'descending' | null | string
}

type UseClientTableOptions = {
  defaultPageSize?: number
}

/**
 * @template T 資料物件的型別
 * @param allData 原始資料的 Ref (例如從 API 拿回來的完整陣列)
 * @param options 設定參數 (可選)
 */
export function useClientTable<T extends Record<string, any>>(
  allData: Ref<T[]>,
  options: UseClientTableOptions = {},
) {
  // --- 狀態 State ---
  const currentPage = ref(1)
  const pageSize = ref(options.defaultPageSize || 5)
  const sortState = ref<SortState>({
    prop: '',
    order: '',
  })

  // --- 核心邏輯: 排序 (Computed) ---
  const sortedData = computed(() => {
    const data = [...allData.value]
    const { prop, order } = sortState.value

    if (!prop || !order) return data

    data.sort((a, b) => {
      const valA = a[prop]
      const valB = b[prop]

      // 1. 數字排序
      if (typeof valA === 'number' && typeof valB === 'number') {
        return order === 'ascending' ? valA - valB : valB - valA
      }

      // 2. 日期排序 (嘗試轉 Date)
      const dateA = new Date(valA).getTime()
      const dateB = new Date(valB).getTime()
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return order === 'ascending' ? dateA - dateB : dateB - dateA
      }

      // 3. 字串/中文排序
      const strA = String(valA)
      const strB = String(valB)
      if (order === 'ascending') {
        return strA.localeCompare(strB, 'zh-TW', { numeric: true })
      } else {
        return strB.localeCompare(strA, 'zh-TW', { numeric: true })
      }
    })

    return data
  })

  // --- 核心邏輯: 分頁 (Computed) ---
  const pagedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return sortedData.value.slice(start, end)
  })

  // --- 核心邏輯: 總數 (Computed) ---
  const total = computed(() => allData.value.length)

  // --- 事件處理 ---
  const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
    sortState.value = { prop, order }
    // UX 優化: 排序改變時，通常建議跳回第一頁
    currentPage.value = 1
  }

  return {
    // State
    currentPage,
    pageSize,
    sortState,
    // Computed
    pagedData,
    total,
    // Methods
    handleSortChange,
  }
}
