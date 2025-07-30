<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useTaskStore } from 'stores/task'
import { useUserStore } from 'stores/user'
import { useStatusStore } from 'stores/status'
import { uid } from 'quasar'

const props = defineProps({
  modelValue: Boolean,
  editTask: Object // если передаётся — редактирование
})
const emit = defineEmits(['update:modelValue'])

const $q = useQuasar()
const taskStore = useTaskStore()
const userStore = useUserStore()

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// ✏️ Начальные данные формы
const form = ref({
  title: '',
  description: '',
  deadline: '',
  status: 'todo'
})

const proxyDate = ref('')

function updateProxy() {
  proxyDate.value = form.value.deadline || ''
}

function saveDate() {
  form.value.deadline = proxyDate.value
}


const rules = {
  required: (val) => !!val || 'Обязательное поле'
}

// 🎯 Если редактируем — заполняем форму
watch(() => props.editTask, (task) => {
  if (task) {
    form.value = { ...task }
  } else {
    resetForm()
  }
})

function resetForm() {
  form.value = {
    title: '',
    description: '',
    deadline: '',
    status: 'todo'
  }
}

// ✅ Сохранение задачи
function onSave() {
  const f = form.value

  if (!f.title || !f.description || !f.deadline || !f.status) {
    $q.notify({ type: 'negative', message: 'Пожалуйста, заполните все поля' })
    return
  }

  if (props.editTask) {
    taskStore.updateTask(f.id, { ...f })
    $q.notify({ type: 'positive', message: 'Задача обновлена' })
  } else {
    taskStore.addTask({
      ...f,
      id: uid(),
      ownerId: userStore.user.username
    })
    $q.notify({ type: 'positive', message: 'Задача добавлена' })
  }

  dialog.value = false
  resetForm()
}

const statusStore = useStatusStore()
const statusOptions = computed(() =>
  statusStore.statuses.map(s => ({
    value: s.key,
    label: s.title
  }))
)
</script>

<template>
  <q-dialog
    v-model="dialog"
    persistent
  >
    <q-card style="min-width: 400px; max-width: 90vw;">
      <q-card-section>
        <div class="text-h6">
          {{ props.editTask ? 'Редактировать' : 'Новая задача' }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-gutter-md">
        <q-input
          filled
          label="Название"
          v-model="form.title"
          :rules="[rules.required]"
        />

        <q-input
          filled
          label="Описание"
          type="textarea"
          v-model="form.description"
          :rules="[rules.required]"
        />

        <div>
          <div class="text-caption text-grey q-mb-xs">Срок выполнения</div>
          <q-btn
            outline
            color="primary"
            icon="event"
            :label="form.deadline || 'Выбрать дату'"
            class="full-width"
          >
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
              @before-show="updateProxy"
            >
              <q-date v-model="proxyDate">
                <div class="row items-center justify-end q-gutter-sm q-pa-sm">
                  <q-btn
                    label="Отмена"
                    flat
                    color="primary"
                    v-close-popup
                  />
                  <q-btn
                    label="ОК"
                    flat
                    color="primary"
                    @click="saveDate"
                    v-close-popup
                  />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
        </div>

        <q-select
          filled
          label="Статус"
          v-model="form.status"
          :options="statusOptions"
          emit-value
          map-options
          :rules="[rules.required]"
        />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          flat
          label="Отмена"
          color="grey"
          @click="dialog = false"
        />
        <q-btn
          flat
          label="Сохранить"
          color="primary"
          @click="onSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
