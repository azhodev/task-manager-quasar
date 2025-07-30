<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import draggable from 'vuedraggable'
import { useTaskStore } from '../stores/task'
import { useStatusStore } from '../stores/status'
import { useGroupedTasks } from '../composables/useGroupedTasks'

const props = defineProps({
  onEditTask: Function
})

const taskStore = useTaskStore()
const statusStore = useStatusStore()

const { columns, groupedTasks, regroupTasks } = useGroupedTasks()

onMounted(regroupTasks)

watch(columns, regroupTasks)

const newStatusLabel = ref('')

function addStatus() {
  const key = newStatusLabel.value.trim().toLowerCase().replace(/\s+/g, '_')
  if (!key) return
  statusStore.addStatus({ key: key, title: newStatusLabel.value.trim() })
  newStatusLabel.value = ''
  regroupTasks()
}

function onDragChange(evt, newStatusKey) {
  let task = evt?.added?.element

  if (!task || !task.id) return

  if (task.status !== newStatusKey) {
    taskStore.updateTask(task.id, { status: newStatusKey })
    nextTick(() => regroupTasks())
  }
}

</script>

<template>
  <div class="board">
    <div class="board__new-status row q-col-gutter-sm q-mt-md">
      <div class="board__new-status-input col">
        <q-input
          v-model="newStatusLabel"
          label="Новый статус"
          @keyup.enter="addStatus"
          dense
        />
      </div>
      <div class="board__new-status-button col-auto">
        <q-btn
          icon="add"
          @click="addStatus"
          color="primary"
          dense
        />
      </div>
    </div>

    <div class="board__columns row q-col-gutter-md wrap">
      <div
        v-for="col in columns"
        :key="col.key"
        class="board__status col-12 col-sm"
      >
        <div class="board__status-inner q-pa-sm rounded-borders">
          <div class="board__status-title text-subtitle1 q-mb-sm text-body">
            {{ col.title }}
          </div>
          <draggable
            v-model="groupedTasks[col.key]"
            :group="{ name: 'task', pull: true, put: true }"
            item-key="id"
            @change="onDragChange($event, col.key)"
          >
            <template #item="{ element }">
              <q-card
                class="board__task q-mb-sm cursor-pointer"
                @click="props.onEditTask?.(element)"
              >
                <q-card-section>
                  <div class="board__task-title text-body1">{{ element.title }}</div>
                  <div class="board__task-description text-caption text-grey">
                    {{ element.description }}
                  </div>
                </q-card-section>
              </q-card>
            </template>
            <template #placeholder>
              <div class="board__placeholder" />
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.board__new-status {
  max-width: 300px;
  margin-left: auto;
}

.board__columns {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  /* grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); */
  gap: 16px;
  min-height: 100vh;
}

.board__status {
  width: 300px;
  flex: 0 0 auto;
}

.board__task {
  transition: box-shadow 0.2s;
  margin-bottom: 15px;
}

.board__task:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* DnD */
.board__placeholder {
  height: 80px;
  border: 2px dashed #999;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  margin-bottom: 15px;
  transition: background-color 0.2s;
}

.sortable-ghost {
  opacity: 0.4;
}

.sortable-chosen {
  box-shadow: 0 0 10px rgba(0, 150, 250, 0.5);
}
</style>
