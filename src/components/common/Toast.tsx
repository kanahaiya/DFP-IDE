'use client';

import { useEffect } from 'react';
import type { MessageType } from '@/types';

interface ToastProps {
  message: string;
  type: MessageType;
  duration?: number;
  onClose: () => void;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

/**
 * Toast notification component - appears in a fixed position
 * Works consistently across all tools
 */
export function Toast({ 
  message, 
  type, 
  duration = 4000, 
  onClose,
  // Position prop reserved for future use
  position: _position = 'top-right' 
}: ToastProps) {
  // Suppress unused variable warning - position will be used for flexible positioning
  void _position;
  
  useEffect(() => {
    if (message && type !== 'error') {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, type, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-times-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle',
  };

  return (
    <div
      className={`toast toast-${type}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="toast-icon">
        <i className={icons[type]}></i>
      </div>
      <div className="toast-content">
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        className="toast-close"
        aria-label="Close notification"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
}
