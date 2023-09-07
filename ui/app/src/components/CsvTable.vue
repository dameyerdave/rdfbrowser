<script setup lang="ts">
import {computed} from 'vue'
import * as Papa from 'papaparse'

const props = defineProps({
  csv: {
    type: String,
    required: true,
  },
})

const parsed = computed(() => {
  return Papa.parse(props.csv, {
    header: true,
    skipEmptyLines: true,
  })
})
</script>

<template>
  <!-- <pre>{{ parsed }}</pre> -->
  <table>
    <thead>
      <tr>
        <th v-for="(field, key) in parsed.meta.fields" :key="'header-' + key">{{ field }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowKey) in parsed.data" :key="'row-' + rowKey">
        <td v-for="(column, columnKey) in row" :key="'column' + columnKey">{{ column }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="sass">
table
  border-collapse: collapse
td, th
  border: 1px solid #4c4c4c
  padding: 2px 5px 2px 5px
</style>
