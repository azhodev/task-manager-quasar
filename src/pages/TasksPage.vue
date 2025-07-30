<script setup>
import { h, ref, computed } from 'vue'
import TaskBoard from '../components/TaskBoard.vue'
import TaskTable from '../components/TaskTable.vue'
import TaskDialog from '../components/TaskDialog.vue'
import { useQuasar } from 'quasar'

const view = ref('board')
const showDialog = ref(false)
const editedTask = ref(null)

const $q = useQuasar()

const currentView = computed(() =>
  view.value === 'board'
    ? h(TaskBoard, { onEditTask: openEditDialog })
    : h(TaskTable, { onEditTask: openEditDialog })
)

const activeToggleColor = computed(() =>
  $q.dark.isActive ? 'grey-9' : 'primary'
)

function openEditDialog(task) {
  editedTask.value = { ...task }
  showDialog.value = true
}

function openNewDialog() {
  editedTask.value = null
  showDialog.value = true
}

</script>

<template>
  <q-page
    padding
    class="column q-gutter-md"
  >
    <div class="row items-center justify-between">
      <div class="text-h5">Мои задачи</div>

      <div class="row q-gutter-sm items-center">
        <q-btn
          label="Добавить задачу"
          color="primary"
          icon="add"
          @click="openNewDialog"
        />
        <q-btn-toggle
          v-model="view"
          spread
          no-caps
          stack
          :toggle-color="activeToggleColor"
          color="grey-3"
          text-color="grey-6"
          class="q-pa-xs"
          size="xs"
          :options="[
            { label: 'Доска', value: 'board', icon: 'view_module' },
            { label: 'Таблица', value: 'table', icon: 'table_chart' }
          ]"
        />

      </div>
    </div>

    <div
      class="q-mt-md"
      style="min-height: 60vh;"
    >
      <component :is="currentView" />
    </div>

    <TaskDialog
      v-model="showDialog"
      :edit-task="editedTask"
    />
  </q-page>
</template>
