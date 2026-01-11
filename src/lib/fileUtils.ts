/**
 * File utility functions for reading and downloading files
 */

import type { FileUploadOptions } from '@/types';

/**
 * Read a file as text
 */
export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text || '');
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  options: FileUploadOptions = {}
): { valid: boolean; error?: string } {
  const { maxSize = 20 * 1024 * 1024, allowedExtensions } = options; // Default 20MB

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  // Check file extension
  if (allowedExtensions && allowedExtensions.length > 0) {
    const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!allowedExtensions.includes(ext)) {
      return {
        valid: false,
        error: `File type not supported. Allowed: ${allowedExtensions.join(', ')}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Download text content as a file
 */
export function downloadTextFile(
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Failed to download file');
  }
}

/**
 * Get current timestamp for filenames
 */
export function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(now.getSeconds())}`;
}

/**
 * Sanitize filename for download
 */
export function sanitizeFilename(filename: string): string {
  // Remove or replace invalid characters
  return filename
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '_')
    .trim();
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get MIME type from file extension
 */
export function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    json: 'application/json',
    yaml: 'text/yaml',
    yml: 'text/yaml',
    xml: 'application/xml',
    csv: 'text/csv',
    txt: 'text/plain',
    html: 'text/html',
    js: 'application/javascript',
    ts: 'application/typescript',
    pdf: 'application/pdf',
  };
  
  return mimeTypes[ext || ''] || 'text/plain';
}
