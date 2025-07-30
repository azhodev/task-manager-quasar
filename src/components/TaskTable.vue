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

function getStatusLabel(key) {
  return statusStore.statuses.find(s => s.key === key)?.title || key
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
  >
    <!-- Кастомная разметка строки -->
    <template #body="props">
      <q-tr
        :props="props"
        @click="onEdit(props.row)"
        class="cursor-pointer hover:bg-grey-2"
      >
        <q-td
          key="title"
          :props="props"
        >
          {{ props.row.title }}
        </q-td>
        <q-td
          key="description"
          :props="props"
        >
          {{ props.row.description }}
        </q-td>
        <q-td
          key="status"
          :props="props"
        >
          <q-chip
            :color="props.row.status === 'done' ? 'green' : 'primary'"
            text-color="white"
            dense
          >
            {{ getStatusLabel(props.row.status) }}
          </q-chip>
        </q-td>
        <q-td
          key="deadline"
          :props="props"
        >
          {{ props.row.deadline }}
        </q-td>
        <q-td
          key="actions"
          :props="props"
        >
          <q-btn
            dense
            flat
            round
            icon="edit"
            color="primary"
            @click.stop="onEdit(props.row)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>
