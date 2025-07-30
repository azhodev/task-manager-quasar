import { ref, computed, watch } from 'vue'
import { useTaskStore } from 'stores/task'
import { useStatusStore } from 'stores/status'

const groupedTasks = ref({})
let initialized = false

export function useGroupedTasks() {
  const taskStore = useTaskStore()
  const statusStore = useStatusStore()
  const columns = computed(() => statusStore.statuses)

  function regroupTasks() {
    const groups = {}
    for (const col of columns.value) {
      groups[col.key] = []
    }

    for (const task of taskStore.userTasks) {
      const status = task.status || 'todo'
      if (groups[status]) groups[status].push(task)
    }

    groupedTasks.value = groups
  }

  if (!initialized) {
    watch(columns, regroupTasks)
    initialized = true
  }

  return {
    columns,
    groupedTasks,
    regroupTasks
  }
}
