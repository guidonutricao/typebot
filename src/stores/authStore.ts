import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error) throw error;

          if (data.user) {
            const user: User = {
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
              createdAt: data.user.created_at,
            };

            set({ 
              user, 
              isAuthenticated: true,
              isLoading: false 
            });
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.message || 'Erro ao fazer login');
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true });
        
        try {
          const { data, error } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
              data: {
                name: credentials.name,
              },
            },
          });

          if (error) throw error;

          if (data.user) {
            const user: User = {
              id: data.user.id,
              email: data.user.email!,
              name: credentials.name,
              createdAt: data.user.created_at,
            };

            set({ 
              user, 
              isAuthenticated: true,
              isLoading: false 
            });
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.message || 'Erro ao registrar');
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },

      initialize: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
            createdAt: session.user.created_at,
          };
          set({ user, isAuthenticated: true });
        }

        supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            const user: User = {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
              createdAt: session.user.created_at,
            };
            set({ user, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);
