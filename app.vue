<template>
  <NuxtPage />
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useSetupSupabase } from "~/composables/supabase";

onMounted(() => {
  useSetupSupabase();
});
</script>
