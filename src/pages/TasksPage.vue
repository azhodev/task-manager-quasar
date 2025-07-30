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
      <div class="text-h5 q-mr-lg">Мои задачи</div>
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

      <div class="q-ml-auto">
        <AddTaskButton
          v-if="view !== 'board'"
          @click="openDialog()"
        />
      </div>
    </div>

    <div
      class="q-mt-md"
      style="min-height: 60vh;"
    >
      <transition
        name="fade"
        mode="out-in"
      >
        <component
          :is="view === 'board' ? TaskBoard : TaskTable"
          :key="view"
          :onEditTask="openDialog"
          :show-dialog="showDialog"
          :edited-task="editedTask"
          :new-task-status="newTaskStatus"
        />
      </transition>
    </div>

    <TaskDialog
      v-model="showDialog"
      :edit-task="editedTask"
      :default-status="newTaskStatus"
    />
  </q-page>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease, filter .1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: .5;
  filter: blur(10px);
}
</style>
