<script setup>
import { ref } from 'vue'
import TaskBoard from '../components/TaskBoard.vue'
import TaskTable from '../components/TaskTable.vue'
import TaskDialog from '../components/TaskDialog.vue'
import AddTaskButton from 'src/components/AddTaskButton.vue'
import { useTaskDialog } from '../composables/task-dialog'

const {
  showDialog,
  openDialog,
  closeDialog,
} = useTaskDialog()

const view = ref('board')

</script>

<template>
  <q-page
    padding
    class="column q-gutter-md"
  >
    <div class="container row items-center justify-between">
      <q-btn-toggle
        v-model="view"
        spread
        no-caps
        stack
        size="sm"
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
      class="container q-mt-xl"
      style="min-height: 60vh;"
    >
      <transition
        name="fade"
        mode="out-in"
      >
        <component
          :is="view === 'board' ? TaskBoard : TaskTable"
          :key="view"
        />
      </transition>
    </div>

    <TaskDialog
      v-model="showDialog"
      @close="closeDialog"
    />
  </q-page>
</template>

<style scoped>
.container {
  max-width: 1280px;
  width: 100%;
  margin: 20px auto 0;
  padding: 0 16px;
}

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
