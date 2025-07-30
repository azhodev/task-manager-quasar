// composables/useTaskDialog.ts
import { ref } from 'vue'

export function useTaskDialog() {
  const showDialog = ref(false)
  const editedTask = ref(null)
  const newTaskStatus = ref(null)

  const openDialog = (task = null, status = null) => {
    showDialog.value = true
    editedTask.value = task
    newTaskStatus.value = status
  }

  const closeDialog = () => {
    showDialog.value = false
    editedTask.value = null
    newTaskStatus.value = null
  }

  return {
    showDialog,
    editedTask,
    newTaskStatus,
    openDialog,
    closeDialog
  }
}
