<script setup lang="ts">
const model = defineModel('model', { type: String })
</script>

<template>
  <input type="text" v-model="model" />
</template>
