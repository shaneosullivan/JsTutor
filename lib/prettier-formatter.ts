// Prettier configuration matching the project's .prettierrc
const prettierConfig = {
  trailingComma: 'none' as const,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  useTabs: false,
  printWidth: 80
};

/**
 * Format JavaScript code using Prettier with the project's configuration
 * Uses dynamic import to load Prettier in browser environment
 */
export async function formatCode(code: string): Promise<string> {
  try {
    // Dynamic import for browser compatibility
    const prettier = await import('prettier/standalone');
    const parserBabel = await import('prettier/plugins/babel');
    const parserEstree = await import('prettier/plugins/estree');
    
    const formatted = prettier.format(code, {
      parser: 'babel',
      plugins: [parserBabel.default, parserEstree.default],
      ...prettierConfig
    });
    return formatted;
  } catch (error) {
    console.warn('Failed to format code with Prettier:', error);
    // Return original code if formatting fails
    return code;
  }
}

/**
 * Check if code can be formatted (basic syntax check)
 */
export function canFormatCode(code: string): boolean {
  try {
    // Basic check - code should not be empty and should contain some JavaScript-like content
    const trimmed = code.trim();
    if (!trimmed) return false;
    
    // Don't format if it looks like HTML
    if (trimmed.startsWith('<') && trimmed.includes('>')) return false;
    
    return true;
  } catch {
    return false;
  }
}