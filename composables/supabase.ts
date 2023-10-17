import { createClient, User, Session, SupabaseClient } from "@supabase/supabase-js";
import { defineStore } from "pinia";

// So ugly, but it works
// How can I access my process.env outside of setup()?
let client: SupabaseClient

// must be called
export const useSetupSupabase = () => {
  const runtimeConfig = useRuntimeConfig();
  client = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseKey
  )
  client.auth.onAuthStateChange((event, session) => {
    console.log("supabase.auth.onAuthStateChange", event);
    const store = useSupabaseAuthStore();
    if (session) store.session = session;
    if (session?.user) store.user = session.user;
    // You can switch event types to handle different scenarios.
  });
}

export const useSupabaseClient = () => {
  if (client) return client
  throw new Error("Supabase client not initialized")
}

export const useSupabaseAuthStore = defineStore("supabase", {
  state() {
    return {
      user: null as User | null,
      session: null as Session | null,
    };
  },
  actions: {
    async login(email: string, password: string) {
      const supabase = useSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      this.user = data?.user ?? null;
      this.session = data?.session ?? null;
      return data;
    },
    async logout() {
      const supabase = useSupabaseClient();
      this.user = null;
      this.session = null;
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.user !== null;
    },
    token(state) {
      return state.session?.access_token;
    }
  },
});
