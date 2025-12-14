<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>通用氣體係數管理 (動態轉置 CRUD 版)</span>
        <div class="button-group">
          <el-button type="primary" @click="addNewRow">新增一列</el-button>
          <el-button type="success" @click="handleSave">儲存變更 (看 Console)</el-button>
        </div>
      </div>
    </template>

    <el-table :data="gridData" border style="width: 100%" highlight-current-row>
      <el-table-column label="基本資訊" align="center">
        <el-table-column label="排放源" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.source" placeholder="輸入來源" />
          </template>
        </el-table-column>
        <el-table-column label="燃料" width="120">
          <template #default="scope">
            <el-input v-model="scope.row.fuel" placeholder="輸入燃料" />
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column v-for="gas in gasList" :key="gas" :label="gas.toUpperCase()" align="center">
        <el-table-column label="數值 (Value)" width="110" align="center">
          <template #default="scope">
            <el-input-number
              v-model="scope.row[`${gas}_val`]"
              :precision="4"
              :step="0.01"
              size="small"
              style="width: 100%"
            />
          </template>
        </el-table-column>

        <el-table-column label="GWP" width="100" align="center">
          <template #default="scope">
            <el-input-number
              v-model="scope.row[`${gas}_gwp`]"
              :precision="0"
              size="small"
              style="width: 100%"
            />
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="操作" width="80" align="center" fixed="right">
        <template #default="scope">
          <el-button type="danger" link @click="deleteRow(scope.$index)"> 刪除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 20px; background: #f4f4f5; padding: 10px">
      <strong>模擬後端收到的資料 (Un-pivoted):</strong>
      <pre style="font-size: 12px">{{ previewJson }}</pre>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// ==========================================
// 1. 定義介面
// ==========================================

// 後端給的原始格式 (Flat List)
interface BackendDto {
  id?: number // 模擬 DB ID
  source: string
  fuel: string
  gas: string
  gwp: number
  value: number
}

// 前端表格用的轉置格式 (Row Object)
// 使用索引簽章來允許動態屬性 (如 co2_val, ch4_gwp)
interface GridRow {
  source: string
  fuel: string
  [key: string]: any
}

// ==========================================
// 2. 模擬後端資料 (JSON)
// ==========================================
const mockApiResponse: BackendDto[] = [
  { id: 1, source: '公務機車', fuel: '柴油', gas: 'co2', gwp: 1, value: 0.26 },
  { id: 2, source: '公務機車', fuel: '柴油', gas: 'ch4', gwp: 1, value: 0.5 },
  { id: 3, source: '公務汽車', fuel: '汽油', gas: 'co2', gwp: 1, value: 0.26 },
  { id: 4, source: '公務汽車', fuel: '汽油', gas: 'ch4', gwp: 2, value: 0.5 },
  // 假設突然多了一個 N2O，程式碼完全不用改，表格會自動長出來
  { id: 5, source: '公務汽車', fuel: '汽油', gas: 'n2o', gwp: 265, value: 0.01 },
]

// ==========================================
// 3. 狀態管理
// ==========================================
const gridData = ref<GridRow[]>([]) // 綁定給 el-table 的資料
const allGasTypes = ref<Set<string>>(new Set()) // 儲存所有出現過的氣體名稱
const previewJson = ref<string>('') // 用於顯示結果

// ==========================================
// 4. 核心邏輯：轉置 (Backend -> Frontend)
// ==========================================
const initData = () => {
  // 1. 找出所有可能的氣體 (建立 Header)
  mockApiResponse.forEach((item) => allGasTypes.value.add(item.gas))

  // 2. 進行分組 (Group by Source + Fuel)
  const groupMap = new Map<string, GridRow>()

  mockApiResponse.forEach((item) => {
    const key = `${item.source}_${item.fuel}`

    if (!groupMap.has(key)) {
      groupMap.set(key, {
        source: item.source,
        fuel: item.fuel,
        // 動態屬性會在下面補上
      })
    }

    const row = groupMap.get(key)!
    // 【轉置關鍵】：把直向的值，變成橫向的欄位
    row[`${item.gas}_val`] = item.value
    row[`${item.gas}_gwp`] = item.gwp
  })

  // 3. 轉成陣列給 Table 使用
  gridData.value = Array.from(groupMap.values())
}

// 計算屬性：將 Set 轉為 Array 供 v-for 使用
const gasList = computed(() => Array.from(allGasTypes.value))

// ==========================================
// 5. CRUD 操作
// ==========================================

// 新增一列
const addNewRow = () => {
  // 建立一個空的 Row，預設填入所有氣體欄位為 0 (避免 undefined)
  const newRow: GridRow = {
    source: '',
    fuel: '',
  }

  // 幫每個氣體都先初始化
  gasList.value.forEach((gas) => {
    newRow[`${gas}_val`] = 0
    newRow[`${gas}_gwp`] = 0
  })

  gridData.value.push(newRow)
}

// 刪除一列
const deleteRow = (index: number) => {
  gridData.value.splice(index, 1)
}

// 儲存 (Frontend -> Backend 反轉置)
const handleSave = () => {
  const payload: BackendDto[] = []

  // 遍歷每一列 (Row)
  gridData.value.forEach((row) => {
    // 遍歷每一個氣體 (Gas)，把 columns 還原成 objects
    gasList.value.forEach((gas) => {
      // 只有當數值存在時才產生資料 (可選邏輯)
      // 這裡簡單起見，全部還原
      payload.push({
        source: row.source,
        fuel: row.fuel,
        gas: gas, // 這裡還原氣體名稱
        value: Number(row[`${gas}_val`] || 0), // 讀取動態欄位
        gwp: Number(row[`${gas}_gwp`] || 0), // 讀取動態欄位
      })
    })
  })

  // 模擬送出給後端
  console.log('送給後端的資料:', payload)
  previewJson.value = JSON.stringify(payload, null, 2)
  ElMessage.success('轉換成功！請查看下方 JSON 或 F12 Console')
}

// 初始化
onMounted(() => {
  initData()
})
</script>

<style scoped>
.box-card {
  width: 95%;
  margin: 20px auto;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
