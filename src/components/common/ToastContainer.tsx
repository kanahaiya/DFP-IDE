'use client';

import { Toast } from './Toast';
import { useToastStore } from '@/store/toast';

/**
 * Global toast container - add once to root layout
 * Manages multiple toasts with queue system
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={toast.position}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
