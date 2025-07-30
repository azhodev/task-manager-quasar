<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/task'
import { useStatusStore } from '../stores/status'

const props = defineProps({
  onEditTask: Function
})

const taskStore = useTaskStore()
const statusStore = useStatusStore()

const selectedStatus = ref('all') // 'all' — по умолчанию

const columns = [
  { name: 'title', label: 'Задача', field: 'title', align: 'left' },
  { name: 'description', label: 'Описание', field: 'description', align: 'left' },
  { name: 'status', label: 'Статус', field: 'status', align: 'center' },
  { name: 'deadline', label: 'Срок', field: 'deadline', align: 'left', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' }
]

const rows = computed(() => {
  const tasks = taskStore.userTasks
  if (selectedStatus.value === 'all') return tasks
  return tasks.filter(t => t.status === selectedStatus.value)
})

function onEdit(task) {
  props.onEditTask?.(task)
}
</script>

<template>
  <div class="q-mb-md row items-center q-gutter-sm">
    <div class="text-subtitle2">Фильтр по статусу:</div>
    <q-select
      v-model="selectedStatus"
      :options="[
        { label: 'Все', value: 'all' },
        ...statusStore.statuses.map(s => ({ label: s.title, value: s.key }))
      ]"
      dense
      outlined
      emit-value
      map-options
      style="min-width: 200px"
    />
  </div>

  <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
    flat
    bordered
    dense
    separator="horizontal"
    no-data-label="Нет задач"
    class="bg-white"
    table-style="color: black"
  >
    <template #body-cell-status="props">
      <q-td :props="props">
        <q-chip
          :color="props.row.status === 'done' ? 'green' : 'primary'"
          text-color="white"
          dense
        >
          {{ props.row.status }}
        </q-chip>
      </q-td>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          dense
          flat
          round
          icon="edit"
          color="primary"
          @click="onEdit(props.row)"
        />
      </q-td>
    </template>
    <template #no-data>
      <div class="text-black q-pa-md">Нет задач</div>
    </template>
  </q-table>
</template>

<style scoped>
.q-table__bottom-nodata {
  color: black !important;
}
</style>
