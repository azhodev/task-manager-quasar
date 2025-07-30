<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
import { useTaskStore } from '../stores/task'
import { useStatusStore } from '../stores/status'

const props = defineProps({
  onEditTask: Function
})

const taskStore = useTaskStore()
const statusStore = useStatusStore()
const columns = computed(() => statusStore.statuses)

const groupedTasks = computed(() => {
  const groups = {}
  for (const col of columns.value) {
    groups[col.key] = []
  }

  for (const task of taskStore.userTasks) {
    const status = task.status || 'todo'
    if (groups[status]) groups[status].push(task)
  }

  return groups
})

const newStatusLabel = ref('')

function addStatus() {
  const key = newStatusLabel.value.trim().toLowerCase().replace(/\s+/g, '_')
  if (!key) return
  statusStore.addStatus({ key: key, title: newStatusLabel.value.trim() })
  newStatusLabel.value = ''
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
          <div class="text-subtitle1 q-mb-sm">{{ col.title }}</div>

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
        </div>
      </div>
    </div>

    <q-input
      v-model="newStatusLabel"
      label="Новый статус"
      @keyup.enter="addStatus"
    />

    <q-btn
      label="Добавить"
      @click="addStatus"
    />
  </div>
</template>
