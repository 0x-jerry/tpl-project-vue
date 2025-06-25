<script lang="ts" setup>
import { pageStore } from '../store'

const { store, actions } = pageStore.inject()
</script>

<template>
  <div>Counter title</div>
  <button @click="actions.plus(0)"> {{ store.counts }}</button>
</template>
