<template>
   <div class="container px-3 mb-4">
      <DashboardAdmin v-if="type === 'admin'" />
      <DashboardUser v-else />
   </div>
</template>

<script setup lang="ts">
const { type } = useAuth()
useHead({ title: 'Dashboard' })
</script>