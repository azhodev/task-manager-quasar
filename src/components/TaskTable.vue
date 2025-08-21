<script setup>
import { ref, computed } from 'vue'

import TaskDialog from '../components/TaskDialog.vue'

import { useTaskStore } from '../stores/task'
import { useStatusStore } from '../stores/status'
import { useTaskDialog } from '../composables/task-dialog'

const { showDialog, editedTask, openDialog, closeDialog } = useTaskDialog()

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

const getStatusColor = (status) => {
  if (status === 'done') return 'green'
  if (status === 'todo') return 'grey'
  return 'primary'
}

function onEdit(task) {
  openDialog(task)
}

function getStatusLabel(key) {
  return statusStore.statuses.find(s => s.key === key)?.title || key
}
</script>

<template>
  <div class="task-table">
    <div class="task-table__filter q-mb-md q-ml-auto row items-center">
      <div class="task-table__filter-label text-subtitle2 q-mr-md">Фильтр по статусу:</div>
      <q-select
        class="task-table__filter-select"
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
      class="my-sticky-column-table"
      flat
      bordered
      :rows="rows"
      :columns="columns"
      row-key="id"
      dense
      separator="horizontal"
      no-data-label="Нет задач"
    >
      <!-- Кастомная разметка строки -->
      <template #body="props">
        <q-tr
          @click="onEdit(props.row)"
          class="cursor-pointer hover:bg-grey-2"
        >
          <q-td
            key="title"
            style="width: 300px; max-width: 300px;"
            class="text-truncate"
          >
            {{ props.row.title }}
          </q-td>
          <q-td
            key="description"
            style="width: 600px; max-width: 600px;"
            class="text-truncate"
          >
            {{ props.row.description }}
          </q-td>
          <q-td key="status">
            <q-chip
              :color="getStatusColor(props.row.status)"
              text-color="white"
              dense
            >
              {{ getStatusLabel(props.row.status) }}
            </q-chip>
          </q-td>
          <q-td key="deadline">
            {{ props.row.deadline }}
          </q-td>
          <q-td key="actions">
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

    <TaskDialog
      v-model="showDialog"
      :task-to-edit="editedTask"
      @close="closeDialog"
    />
  </div>
</template>

<style scoped>
.task-table {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.text-truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
