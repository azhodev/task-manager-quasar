<script setup>
import { ref, onMounted, nextTick } from 'vue'
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

const newStatusLabel = ref('')
const dragOverKey = ref(null)

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
    task.status = newStatusKey
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

    <div class="board__columns row  wrap">
      <div
        v-for="col in columns"
        :key="col.key"
        class="board__status col-12 col-sm"
        :class="{ 'drag-over': dragOverKey === col.key }"
        @dragenter="() => dragOverKey = col.key"
        @dragleave="(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) dragOverKey = null
        }"
        @drop="() => dragOverKey = null"
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
  gap: 16px;
}

.board__status {
  width: 300px;
  flex: 0 0 auto;
  border: 1px dashed;
  border-radius: 4px;
}

.board__status-title {
  text-align: center;
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

.board__status.drag-over {
  border-color: #027be3;
  /* Quasar primary или другой цвет */
  box-shadow: 0 0 0 2px rgba(2, 123, 227, 0.4);
  background-color: transparent;
  transition: box-shadow 0.2s, border-color 0.2s;
}
</style>
