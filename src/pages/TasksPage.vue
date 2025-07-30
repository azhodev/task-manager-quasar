<script setup>
import { ref } from 'vue'
import TaskBoard from '../components/TaskBoard.vue'
import TaskTable from '../components/TaskTable.vue'
import TaskDialog from '../components/TaskDialog.vue'
import AddTaskButton from 'src/components/AddTaskButton.vue'
import { useTaskDialog } from '../composables/useTaskDialog'

const {
  showDialog,
  editedTask,
  openDialog,
  newTaskStatus
} = useTaskDialog()

const view = ref('board')

</script>

<template>
  <q-page
    padding
    class="column q-gutter-md"
  >
    <div class="row items-center justify-between">
      <div class="text-h5">Мои задачи</div>

      <div class="row q-gutter-sm items-center">
        <AddTaskButton
          v-if="view !== 'board'"
          @click="openDialog()"
        />

        <q-btn-toggle
          v-model="view"
          spread
          no-caps
          stack
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
      <TaskBoard
        v-if="view === 'board'"
        :onEditTask="openDialog"
        :show-dialog="showDialog"
        :edited-task="editedTask"
        :new-task-status="newTaskStatus"
      />

      <TaskTable
        v-else
        :onEditTask="openDialog"
        :show-dialog="showDialog"
        :edited-task="editedTask"
        :new-task-status="newTaskStatus"
      />
    </div>

    <TaskDialog
      v-model="showDialog"
      :edit-task="editedTask"
      :default-status="newTaskStatus"
    />
  </q-page>
</template>
