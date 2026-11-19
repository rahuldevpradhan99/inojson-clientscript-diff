/**
 * Simple, robust JavaScript Formatter & Beautifier
 * Indents code with correct brace matching, switch-case alignment, and blank line preservation.
 */

export const JsBeautifier = {
  beautify(code = "", indentSpaces = 4) {
    if (!code) return "";

    // If input is single-line minified code, split statements on semicolons and braces
    let normalizedCode = code;
    if (!normalizedCode.includes("\n") && normalizedCode.includes(";")) {
      normalizedCode = normalizedCode
        .replace(/\{/g, "{\n")
        .replace(/\}/g, "\n}\n")
        .replace(/;/g, ";\n");
    }

    const indentStr = " ".repeat(indentSpaces);
    const lines = normalizedCode.split(/\r?\n/);
    const formatted = [];
    let indentLevel = 0;

    for (let rawLine of lines) {
      let trimmed = rawLine.trim();

      if (trimmed === "") {
        // Prevent multiple consecutive blank lines
        if (formatted.length > 0 && formatted[formatted.length - 1] !== "") {
          formatted.push("");
        }
        continue;
      }

      // Check if line closes a block before applying indentation
      const startsWithClose = /^(\}|\]|\))/.test(trimmed);
      const isCaseOrDefault = /^(case\b|default\s*:)/.test(trimmed);

      let effectiveIndent = indentLevel;

      if (startsWithClose && effectiveIndent > 0) {
        effectiveIndent--;
      }

      if (isCaseOrDefault && effectiveIndent > 0) {
        effectiveIndent--;
      }

      formatted.push(indentStr.repeat(Math.max(0, effectiveIndent)) + trimmed);

      // Count opened and closed brackets in this line (ignoring strings and comments)
      const sanitized = trimmed
        .replace(/"(?:\\.|[^"\\])*"/g, '""')
        .replace(/'(?:\\.|[^'\\])*'/g, "''")
        .replace(/`[\s\S]*?`/g, "``")
        .replace(/\/\/.*$/g, "");

      const openBraces = (sanitized.match(/\{/g) || []).length;
      const closeBraces = (sanitized.match(/\}/g) || []).length;
      const openBrackets = (sanitized.match(/\[/g) || []).length;
      const closeBrackets = (sanitized.match(/\]/g) || []).length;

      indentLevel += (openBraces - closeBraces) + (openBrackets - closeBrackets);

      if (isCaseOrDefault) {
        indentLevel++;
      }

      if (indentLevel < 0) indentLevel = 0;
    }

    return formatted.join("\n");
  }
};
