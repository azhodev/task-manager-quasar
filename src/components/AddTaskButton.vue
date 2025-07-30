<!-- AddTaskButton.vue -->
<script setup>
defineProps({
  onClick: Function
})
</script>

<template>
  <q-btn
    label="Задача"
    color="primary"
    icon="add"
    class="full-width"
    @click="onClick"
  />
</template>

<style scoped>
.full-width {
  margin-top: auto;
  flex: 1;
}
</style>
