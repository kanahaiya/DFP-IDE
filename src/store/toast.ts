'use client';

import { create } from 'zustand';
import type { MessageType } from '@/types';

export interface Toast {
  id: string;
  message: string;
  type: MessageType;
  duration?: number;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

/**
 * Global toast notification store
 * Use this from anywhere in the app to show notifications
 */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  
  clearAll: () => {
    set({ toasts: [] });
  },
}));

/**
 * Convenience hook for showing toasts
 */
export function useToast() {
  const { addToast } = useToastStore();
  
  return {
    success: (message: string, duration?: number) => 
      addToast({ message, type: 'success', duration }),
    
    error: (message: string, duration?: number) => 
      addToast({ message, type: 'error', duration: duration || 0 }), // Errors don't auto-dismiss
    
    warning: (message: string, duration?: number) => 
      addToast({ message, type: 'warning', duration }),
    
    info: (message: string, duration?: number) => 
      addToast({ message, type: 'info', duration }),
  };
}
