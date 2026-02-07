/**
 * Sample templates for the JSON Escaper tool
 */

export interface EscaperSample {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const ESCAPER_SAMPLES: EscaperSample[] = [
  {
    id: 'simple-object',
    name: 'Simple Object',
    description: 'Basic JSON object to escape',
    content: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      active: true
    }, null, 2),
  },
  {
    id: 'special-characters',
    name: 'Special Characters',
    description: 'Text with quotes and special chars',
    content: `He said "Hello, World!" and she replied 'Hi there!'
This has a newline above.
	And this has a tab.`,
  },
  {
    id: 'unicode-text',
    name: 'Unicode Text',
    description: 'Text with international characters',
    content: JSON.stringify({
      greeting: 'Café résumé naïve',
      symbols: '© ® ™ € £ ¥ °',
      emoji: '👋 Hello 🌍 World 🚀 Launch ✨ Stars',
      japanese: 'こんにちは',
      arabic: 'مرحبا',
      chinese: '你好世界'
    }, null, 2),
  },
  {
    id: 'html-content',
    name: 'HTML Content',
    description: 'JSON containing HTML that needs escaping',
    content: JSON.stringify({
      title: 'My <strong>Bold</strong> Title',
      content: '<script>alert("XSS")</script>',
      link: '<a href="https://example.com">Click here</a>',
      description: 'Use & instead of &&'
    }, null, 2),
  },
  {
    id: 'multiline-text',
    name: 'Multiline Text',
    description: 'Text with multiple lines and formatting',
    content: `Line 1: Introduction
Line 2: Details here
Line 3: More information

Paragraph break above.

	Indented with tab
    Indented with spaces`,
  },
  {
    id: 'api-payload',
    name: 'API Payload',
    description: 'Complex API request payload',
    content: JSON.stringify({
      action: 'create',
      data: {
        user: {
          name: 'Jane "JD" Doe',
          bio: 'Software engineer & coffee lover.\nLoves coding!',
          website: 'https://example.com/~jane?ref=api&source=test'
        },
        options: {
          notify: true,
          tags: ['developer', 'mentor', 'speaker']
        }
      }
    }, null, 2),
  },
  {
    id: 'config-string',
    name: 'Config String',
    description: 'Configuration with paths and special values',
    content: JSON.stringify({
      path: 'C:\\Users\\Admin\\Documents',
      regex: '^[a-zA-Z0-9]+$',
      template: '${name} has ${count} items',
      command: 'echo "Hello $USER"'
    }, null, 2),
  },
  {
    id: 'error-message',
    name: 'Error Message',
    description: 'Error response with detailed message',
    content: JSON.stringify({
      error: true,
      code: 'VALIDATION_ERROR',
      message: 'Field "email" is invalid.\nExpected format: user@domain.com',
      details: {
        field: 'email',
        value: 'invalid@',
        hint: 'Check for missing domain'
      }
    }, null, 2),
  },
];
