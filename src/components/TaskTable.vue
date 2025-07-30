<script setup>
import { useTaskStore } from '../stores/task'
import { useQuasar } from 'quasar'
import { computed } from 'vue'

const props = defineProps({
  onEditTask: Function
})

const $q = useQuasar()
const taskStore = useTaskStore()

const columns = [
  { name: 'title', label: 'Задача', field: 'title', align: 'left' },
  { name: 'description', label: 'Описание', field: 'description', align: 'left' },
  { name: 'status', label: 'Статус', field: 'status', align: 'center' },
  { name: 'deadline', label: 'Срок', field: 'deadline', align: 'left', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' }
]

const rows = computed(() => taskStore.userTasks)

function onEdit(task) {
  props.onEditTask?.(task)
}

function onDelete(task) {
  $q.dialog({
    title: 'Удаление',
    message: `Удалить задачу "${task.title}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    taskStore.tasks = taskStore.tasks.filter(t => t.id !== task.id)
    $q.notify({ type: 'positive', message: 'Задача удалена' })
  })
}
</script>

<template>
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
        <q-btn
          dense
          flat
          round
          icon="delete"
          color="negative"
          @click="onDelete(props.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>
