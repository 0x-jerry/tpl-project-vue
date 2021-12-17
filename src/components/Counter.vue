<script lang="ts" setup>
defineProps<{
  modelValue: number
}>()

defineEmits<{
  (type: 'update:modelValue', val: number): void
}>()
</script>

<template>
  <div>
    count: {{ modelValue }}
    <button @click="$emit('update:modelValue', modelValue + 1)">+</button>
    <button @click="$emit('update:modelValue', modelValue - 1)">-</button>
  </div>
</template>
