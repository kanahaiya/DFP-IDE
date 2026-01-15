'use client';

import { useEffect } from 'react';
import { Toast } from './Toast';
import { useToastStore } from '@/store/toast';

/**
 * Global toast container - add once to root layout
 * Manages multiple toasts with queue system
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  // Guard against unhelpful `[object Event]` runtime overlays by handling
  // unhandled rejections/errors that accidentally throw DOM Events (common with
  // script/image loading failures or worker bootstrap issues).
  useEffect(() => {
    const isEventLike = (value: unknown): value is Event =>
      typeof value === 'object' &&
      value !== null &&
      typeof (value as { type?: unknown }).type === 'string';

    const describeEventTarget = (evt: Event) => {
      const t = (evt as unknown as { target?: unknown }).target;
      if (!t || typeof t !== 'object') return undefined;
      const anyTarget = t as Record<string, unknown>;
      const src = typeof anyTarget.src === 'string' ? anyTarget.src : undefined;
      const href = typeof anyTarget.href === 'string' ? anyTarget.href : undefined;
      const tagName = typeof anyTarget.tagName === 'string' ? anyTarget.tagName : undefined;
      return { tagName, src, href };
    };

    const onUnhandledRejection = (ev: PromiseRejectionEvent) => {
      if (!isEventLike(ev.reason)) return;
      // Prevent Next/React dev overlay from rendering `[object Event]`
      ev.preventDefault();
      console.error('Unhandled promise rejection (Event):', {
        type: ev.reason.type,
        target: describeEventTarget(ev.reason),
      });
    };

    const onError = (ev: ErrorEvent) => {
      if (!isEventLike(ev.error)) return;
      ev.preventDefault();
      console.error('Window error (Event):', {
        type: ev.error.type,
        target: describeEventTarget(ev.error),
      });
    };

    window.addEventListener('unhandledrejection', onUnhandledRejection);
    window.addEventListener('error', onError);
    return () => {
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
      window.removeEventListener('error', onError);
    };
  }, []);

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
