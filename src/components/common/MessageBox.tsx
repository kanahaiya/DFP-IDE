'use client';

import { useEffect, useState, useCallback } from 'react';
import type { MessageType } from '@/types';

interface MessageBoxProps {
  message: string;
  type: MessageType;
  duration?: number;
  onClose?: () => void;
}

/**
 * Message box for success/error/info/warning notifications
 */
export function MessageBox({ message, type, duration = 3000, onClose }: MessageBoxProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message && type !== 'error') {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) {
          setTimeout(onClose, 300); // Wait for animation
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, type, duration, onClose]);

  if (!visible || !message) {
    return null;
  }

  return (
    <div
      className={`message ${type}`}
      role="status"
      aria-live="polite"
    >
      {type === 'success' && <i className="fas fa-check-circle"></i>}
      {type === 'error' && <i className="fas fa-exclamation-circle"></i>}
      {type === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
      {type === 'info' && <i className="fas fa-info-circle"></i>}
      <span>{message}</span>
    </div>
  );
}

/**
 * Hook to manage message state
 */
export function useMessage() {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<MessageType>('success');

  const showMessage = useCallback((text: string, messageType: MessageType = 'success') => {
    setMessage(text);
    setType(messageType);
  }, []);

  const clearMessage = useCallback(() => {
    setMessage('');
  }, []);

  return { message, type, showMessage, clearMessage };
}
