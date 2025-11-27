<script setup lang="ts">
export type Peoples = {
  name: string
  age: number
}

const props = defineProps<{
  people: Peoples[]
}>()
</script>

<template>
  <div>{{ props.people }}</div>
</template>

<style scoped></style>
