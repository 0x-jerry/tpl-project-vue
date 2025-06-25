<script lang="ts" setup>
defineProps<{
  modelValue: number
}>()

defineEmits<{
  'update:modelValue': [val: number]
}>()
</script>

<template>
  <div>
    <span> count: {{ modelValue }} </span>
    <button @click="$emit('update:modelValue', modelValue + 1)">+</button>
    <button @click="$emit('update:modelValue', modelValue - 1)">-</button>
  </div>
</template>
