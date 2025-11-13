import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  backgroundColor: string;
  buttonStyle: 'rounded' | 'square' | 'pill';
  textColor: string;
  borderRadius: string;
  chatBubbleUser: string;
  chatBubbleBot: string;
  shadowIntensity: 'none' | 'sm' | 'md' | 'lg';
  spacing: 'compact' | 'normal' | 'relaxed';
}

interface ThemeStore {
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
}

const defaultTheme: ThemeConfig = {
  primaryColor: '#f59e0b',
  secondaryColor: '#d97706',
  fontFamily: 'Inter',
  backgroundColor: '#ffffff',
  buttonStyle: 'rounded',
  textColor: '#1f2937',
  borderRadius: '0.5rem',
  chatBubbleUser: '#f59e0b',
  chatBubbleBot: '#f3f4f6',
  shadowIntensity: 'md',
  spacing: 'normal',
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: defaultTheme,
      updateTheme: (updates) => set((state) => ({ 
        theme: { ...state.theme, ...updates } 
      })),
      resetTheme: () => set({ theme: defaultTheme }),
    }),
    {
      name: 'typeflow-theme',
    }
  )
);
