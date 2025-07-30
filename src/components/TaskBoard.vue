<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { useTaskStore } from '../stores/task'
import { useStatusStore } from '../stores/status'

const props = defineProps({
  onEditTask: Function
})

const taskStore = useTaskStore()
const statusStore = useStatusStore()

const columns = computed(() => statusStore.statuses)

// groupedTasks — реактивная структура вида { [statusKey]: Task[] }
const groupedTasks = ref({})

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

onMounted(regroupTasks)

// Перегруппировать при изменениях
watch(() => taskStore.userTasks, regroupTasks, { deep: true })
watch(columns, regroupTasks)

const newStatusLabel = ref('')

function addStatus() {
  const key = newStatusLabel.value.trim().toLowerCase().replace(/\s+/g, '_')
  if (!key) return
  statusStore.addStatus({ key: key, title: newStatusLabel.value.trim() })
  newStatusLabel.value = ''
  regroupTasks()
}

function onTaskDrop(event, newStatusKey) {
  const newIndex = event.newIndex
  const movedTask = groupedTasks.value[newStatusKey][newIndex]
  if (!movedTask) return
  if (movedTask.status !== newStatusKey) {
    taskStore.updateTask(movedTask.id, { status: newStatusKey })
  }
}
</script>

<template>
  <div>
    <div class="row q-col-gutter-md wrap">
      <div
        v-for="col in columns"
        :key="col.key"
        class="col-12 col-sm"
      >
        <div class="q-pa-sm bg-grey-2 rounded-borders">
          <div class="text-subtitle1 q-mb-sm text-dark">
            {{ col.title }}
          </div>

          <VueDraggableNext
            :list="groupedTasks[col.key]"
            :group="{ name: 'tasks', pull: true, put: true }"
            item-key="id"
            @end="event => onTaskDrop(event, col.key)"
          >
            <TransitionGroup>
              <q-card
                v-for="task in groupedTasks[col.key]"
                :key="task.id"
                class="q-mb-sm cursor-pointer"
                @click="props.onEditTask?.(task)"
              >
                <q-card-section>
                  <div class="text-body1">{{ task.title }}</div>
                  <div class="text-caption text-grey">{{ task.description }}</div>
                </q-card-section>
              </q-card>
            </TransitionGroup>
          </VueDraggableNext>
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-sm q-mt-md">
      <div class="col">
        <q-input
          v-model="newStatusLabel"
          label="Новый статус"
          @keyup.enter="addStatus"
          dense
        />
      </div>
      <div class="col-auto">
        <q-btn
          label="Добавить"
          @click="addStatus"
          color="primary"
          dense
        />
      </div>
    </div>
  </div>
</template>
