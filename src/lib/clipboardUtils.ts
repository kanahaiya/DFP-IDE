/**
 * Clipboard utility functions
 */

/**
 * Copy text to clipboard using modern Clipboard API or fallback
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (!text) {
    throw new Error('No text to copy');
  }
  
  // Try modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      console.warn('Clipboard API failed, trying fallback:', error);
    }
  }
  
  // Fallback method using execCommand
  return copyToClipboardFallback(text);
}

/**
 * Fallback clipboard copy using execCommand (for older browsers)
 */
function copyToClipboardFallback(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    
    document.body.appendChild(textarea);
    
    try {
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (successful) {
        resolve();
      } else {
        reject(new Error('Copy command failed'));
      }
    } catch (error) {
      document.body.removeChild(textarea);
      reject(error);
    }
  });
}

/**
 * Read text from clipboard
 */
export async function readFromClipboard(): Promise<string> {
  if (!navigator.clipboard || !navigator.clipboard.readText) {
    throw new Error('Clipboard API not supported');
  }
  
  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (error) {
    console.error('Failed to read from clipboard:', error);
    throw new Error('Clipboard access denied');
  }
}

/**
 * Check if clipboard API is available
 */
export function isClipboardAvailable(): boolean {
  return !!(navigator.clipboard && navigator.clipboard.writeText);
}

/**
 * Check if clipboard read is available
 */
export function isClipboardReadAvailable(): boolean {
  return !!(navigator.clipboard && navigator.clipboard.readText);
}
