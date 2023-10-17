<template>
    <div v-if="isLoggedIn">
        <button @click="supabase.logout">Logout</button>
        <p>hello, {{ user?.id }}</p>
        <p>will expire at {{ formatted }}</p>
        <p>token: {{ supabase.token }}</p>
    </div>
    <div v-else>
        <input type="text" v-model="form.email" />
        <input type="password" v-model="form.password" />
        <button @click="login">Login</button>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useSupabaseAuthStore } from '~/composables/supabase';

const form = reactive({
    email: '',
    password: '',
})

const supabase = useSupabaseAuthStore();
const { user, isLoggedIn, session } = storeToRefs(supabase);

const login = async () => {
    return await supabase.login(form.email, form.password);
}

const formatted = computed(() => {
    return new Date(session.value?.expires_at!).toLocaleString();
})
</script>
