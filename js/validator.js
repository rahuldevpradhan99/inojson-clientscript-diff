/**
 * Validator and Diagnostics Engine for InoJson Script Compare & Diff Studio
 * Provides comprehensive JSON and JavaScript syntax validation, pinpoint error
 * localization (line, column, code snippet with pointer), actionable fix suggestions,
 * and intelligent auto-fix capabilities.
 */

export const Validator = {
  /**
   * Validate JSON string with deep diagnostics, line/col pinpointing,
   * error explanation, fix recommendations, and auto-fix preview.
   *
   * @param {string} jsonStr - Raw JSON text to validate
   * @returns {Object} Diagnostic report
   */
  validateJson(jsonStr) {
    if (!jsonStr || !jsonStr.trim()) {
      return {
        valid: false,
        isEmpty: true,
        errorTitle: "Empty JSON Document",
        message: "No content provided",
        explanation: "The JSON input is completely empty. Paste or upload a JSON bundle to proceed.",
        fixSuggestion: "Paste a valid JSON bundle or click 'Load Sample' to populate standard low-code data.",
        line: 1,
        column: 1,
        position: 0,
        snippet: null,
        canAutoFix: false,
        autoFixedText: null,
        appliedFixes: []
      };
    }

    try {
      const parsed = JSON.parse(jsonStr);
      return {
        valid: true,
        isEmpty: false,
        errorTitle: null,
        message: null,
        explanation: null,
        fixSuggestion: null,
        line: null,
        column: null,
        position: null,
        snippet: null,
        canAutoFix: false,
        autoFixedText: null,
        appliedFixes: [],
        data: parsed
      };
    } catch (parseErr) {
      const diagnosis = this.diagnoseJsonError(jsonStr, parseErr.message);
      const autoFixResult = this.autoFixJson(jsonStr);

      return {
        valid: false,
        isEmpty: false,
        rawMessage: parseErr.message,
        errorTitle: diagnosis.errorTitle,
        message: diagnosis.message,
        explanation: diagnosis.explanation,
        fixSuggestion: diagnosis.fixSuggestion,
        line: diagnosis.line,
        column: diagnosis.column,
        position: diagnosis.position,
        snippet: diagnosis.snippet,
        canAutoFix: autoFixResult.ok,
        autoFixedText: autoFixResult.ok ? autoFixResult.fixedText : null,
        appliedFixes: autoFixResult.appliedFixes || []
      };
    }
  },

  /**
   * Deeply diagnose a JSON parse error by inspecting the text around the failure position.
   */
  diagnoseJsonError(text, rawMessage) {
    const lines = text.split(/\r?\n/);
    let pos = -1;
    let line = 1;
    let column = 1;

    // 1. Try to extract position from V8 / SpiderMonkey error messages
    const posMatch = rawMessage.match(/position\s+(\d+)/i);
    const lineColMatch = rawMessage.match(/line\s+(\d+)\s+column\s+(\d+)/i);

    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      column = parseInt(lineColMatch[2], 10);
      // Compute pos
      let offset = 0;
      for (let i = 0; i < line - 1 && i < lines.length; i++) {
        offset += lines[i].length + 1; // approximation
      }
      pos = offset + (column - 1);
    } else if (posMatch) {
      pos = parseInt(posMatch[1], 10);
      // Map character offset to line & column
      let counted = 0;
      for (let i = 0; i < lines.length; i++) {
        const lineLen = lines[i].length + 1; // including newline
        if (counted + lineLen > pos) {
          line = i + 1;
          column = pos - counted + 1;
          break;
        }
        counted += lineLen;
      }
      if (line > lines.length) {
        line = lines.length;
        column = (lines[lines.length - 1] || "").length + 1;
      }
    } else {
      // Fallback
      line = 1;
      column = 1;
      pos = 0;
    }

    const currentLineText = lines[line - 1] || "";
    const prevLineText = line > 1 ? lines[line - 2] : "";
    const textAround = text.slice(Math.max(0, pos - 40), Math.min(text.length, pos + 40));

    // Analyze specific error patterns
    let errorTitle = "JSON Syntax Error";
    let message = rawMessage;
    let explanation = "The JSON parser encountered unexpected characters or malformed structure.";
    let fixSuggestion = "Check the syntax at the highlighted line and ensure proper quotes and commas.";

    // Pattern A: Trailing comma before } or ]
    // Check if right before pos or current token is a comma followed by closing brace/bracket
    const beforePos = text.slice(Math.max(0, pos - 20), pos).trim();
    const atPos = text.slice(pos, pos + 20).trim();
    const lineBeforeCol = currentLineText.slice(0, column - 1).trim();

    if (
      (atPos.startsWith("}") || atPos.startsWith("]")) &&
      (beforePos.endsWith(",") || lineBeforeCol.endsWith(",") || /,\s*$/.test(prevLineText))
    ) {
      const bracket = atPos[0];
      errorTitle = `Trailing Comma before '${bracket}'`;
      message = `Illegal trailing comma found before closing '${bracket}'`;
      explanation = `The JSON standard (RFC 8259) strictly forbids trailing commas after the last property in an object or element in an array.`;
      fixSuggestion = `Delete the trailing comma ',' on line ${lineBeforeCol.endsWith(",") ? line : line - 1}, or click '⚡ Auto-Fix JSON'.`;
    }
    // Pattern B: Comments in JSON (// or /*)
    else if (
      textAround.includes("//") ||
      textAround.includes("/*") ||
      currentLineText.trim().startsWith("//") ||
      currentLineText.trim().startsWith("/*")
    ) {
      errorTitle = "Comments Not Allowed in Standard JSON";
      message = "Found comments ('//' or '/* ... */') in JSON document";
      explanation = "Standard JSON does not support comments of any kind. JavaScript allows them, but JSON.parse will fail.";
      fixSuggestion = "Remove all comments from the JSON, or click '⚡ Auto-Fix JSON' to strip them automatically.";
    }
    // Pattern C: Single quotes instead of double quotes
    else if (
      currentLineText.includes("'") ||
      textAround.includes("'") ||
      /[']/.test(currentLineText.slice(Math.max(0, column - 5), column + 5))
    ) {
      errorTitle = "Single Quotes Used (Expected Double Quotes)";
      message = "Single quotes (') found in string or property name";
      explanation = `JSON requires all strings and property names to be enclosed in standard double quotes ("). Single quotes are valid in JS, but invalid in JSON.`;
      fixSuggestion = `Replace single quotes (') with double quotes ("), e.g. "key": "value", or click '⚡ Auto-Fix JSON'.`;
    }
    // Pattern D: Unquoted property key
    else if (
      /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/.test(currentLineText) ||
      rawMessage.toLowerCase().includes("expected property name") ||
      rawMessage.toLowerCase().includes("expected double-quoted property name")
    ) {
      const keyMatch = currentLineText.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/);
      const keyName = keyMatch ? keyMatch[1] : "property";
      errorTitle = `Unquoted Object Key '${keyName}'`;
      message = `Object key '${keyName}' is missing double quotes`;
      explanation = `In JSON, all object property keys must be surrounded by double quotes, e.g. "${keyName}": value. Unquoted keys are allowed in JavaScript object literals, but strictly invalid in JSON.`;
      fixSuggestion = `Wrap the key '${keyName}' in double quotes: "${keyName}": ..., or click '⚡ Auto-Fix JSON'.`;
    }
    // Pattern E: Missing comma between properties
    else if (
      rawMessage.toLowerCase().includes("expected ','") ||
      (prevLineText.trim().length > 0 &&
        !prevLineText.trim().endsWith(",") &&
        !prevLineText.trim().endsWith("{") &&
        !prevLineText.trim().endsWith("[") &&
        (currentLineText.trim().startsWith('"') || currentLineText.trim().startsWith("{")))
    ) {
      errorTitle = "Missing Comma Separator";
      message = `Missing comma between properties or array items`;
      explanation = `Expected a comma ',' separating properties or array elements. In JSON, every entry (except the last one in a block) must end with a comma.`;
      fixSuggestion = `Add a comma ',' at the end of line ${line > 1 ? line - 1 : line}.`;
    }
    // Pattern F: Unescaped raw newline in string literal
    else if (rawMessage.toLowerCase().includes("bad control character") || rawMessage.toLowerCase().includes("unterminated string")) {
      errorTitle = "Unescaped Newline in String Literal";
      message = "String literal contains raw unescaped line breaks";
      explanation = `JSON strings cannot contain unescaped line breaks. Multiline scripts or strings must escape newlines as '\\r\\n' or '\\n'.`;
      fixSuggestion = `Escape the line breaks using '\\r\\n' (for clientscripts) or '\\n', or use the Quick Snippet Converter.`;
    }
    // Pattern G: Unbalanced braces/brackets
    else {
      const openBraces = (text.match(/\{/g) || []).length;
      const closeBraces = (text.match(/\}/g) || []).length;
      const openBrackets = (text.match(/\[/g) || []).length;
      const closeBrackets = (text.match(/\]/g) || []).length;

      if (openBraces > closeBraces) {
        errorTitle = "Unclosed Object (Missing '}')";
        message = `Missing ${openBraces - closeBraces} closing brace(s) '}'`;
        explanation = `The JSON document opened ${openBraces} '{' but only closed ${closeBraces} '}'.`;
        fixSuggestion = `Add the missing '}' closing brace(s) at the end of the object.`;
      } else if (closeBraces > openBraces) {
        errorTitle = "Extra Closing Brace '}'";
        message = `Found ${closeBraces - openBraces} extra closing brace(s) '}'`;
        explanation = `There are more closing braces '}' than opening braces '{'.`;
        fixSuggestion = `Remove the extra closing brace '}' around line ${line}.`;
      } else if (openBrackets > closeBrackets) {
        errorTitle = "Unclosed Array (Missing ']')";
        message = `Missing ${openBrackets - closeBrackets} closing bracket(s) ']'`;
        explanation = `The JSON document opened ${openBrackets} '[' but only closed ${closeBrackets} ']'.`;
        fixSuggestion = `Add the missing ']' closing bracket(s) at the end of the array.`;
      } else if (closeBrackets > openBrackets) {
        errorTitle = "Extra Closing Bracket ']'";
        message = `Found ${closeBrackets - openBrackets} extra closing bracket(s) ']'`;
        explanation = `There are more closing brackets ']' than opening brackets '['.`;
        fixSuggestion = `Remove the extra closing bracket ']' around line ${line}.`;
      }
    }

    const snippet = this.buildCodeSnippet(lines, line, column);

    return {
      errorTitle,
      message,
      explanation,
      fixSuggestion,
      line,
      column,
      position: pos,
      snippet
    };
  },

  /**
   * Intelligently auto-fix common JSON syntax mistakes:
   * - Strips comments (// and /* * /)
   * - Converts single-quoted strings and keys to double-quoted strings
   * - Quotes unquoted keys: { key: 1 } -> { "key": 1 }
   * - Removes trailing commas before } and ]
   * - Strips trailing unneeded semicolons
   */
  autoFixJson(rawText) {
    if (!rawText || !rawText.trim()) return { ok: false, error: "Empty input" };

    const appliedFixes = [];
    let text = rawText;

    // 1. Strip comments (while preserving strings)
    let strippedComments = false;
    // Replace /* ... */
    const noBlock = text.replace(/\/\*[\s\S]*?\*\//g, () => {
      strippedComments = true;
      return "";
    });
    // Replace // ... (at line end or after whitespace)
    const noLine = noBlock.replace(/(^|[^\\:])\/\/.*$/gm, (m, prefix) => {
      strippedComments = true;
      return prefix;
    });
    if (strippedComments) {
      appliedFixes.push("Stripped JSON comments (// and /* */)");
      text = noLine;
    }

    // 2. Fix unquoted keys: e.g. { foo: or , foo:
    let fixedKeys = false;
    const keyFixed = text.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, (match, prefix, key) => {
      fixedKeys = true;
      return `${prefix}"${key}":`;
    });
    if (fixedKeys) {
      appliedFixes.push("Enclosed unquoted object keys in double quotes");
      text = keyFixed;
    }

    // 3. Fix single quotes to double quotes (for simple strings)
    let fixedQuotes = false;
    const quotesFixed = text.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (match, inner) => {
      fixedQuotes = true;
      // Escape any unescaped double quotes inside
      const escapedInner = inner.replace(/(?<!\\)"/g, '\\"');
      return `"${escapedInner}"`;
    });
    if (fixedQuotes) {
      appliedFixes.push("Converted single quotes (') to standard double quotes (\")");
      text = quotesFixed;
    }

    // 4. Remove trailing commas before } or ]
    let fixedCommas = false;
    const commaFixed = text.replace(/,\s*([\}\]])/g, (match, closing) => {
      fixedCommas = true;
      return closing;
    });
    if (fixedCommas) {
      appliedFixes.push("Removed illegal trailing commas before '}' or ']'");
      text = commaFixed;
    }

    // 5. Test if the result parses
    try {
      const parsed = JSON.parse(text);
      // Re-format cleanly
      const fixedFormatted = JSON.stringify(parsed, null, 2);
      return {
        ok: true,
        fixedText: fixedFormatted,
        appliedFixes
      };
    } catch (e) {
      return {
        ok: false,
        error: e.message,
        intermediate: text,
        appliedFixes
      };
    }
  },

  /**
   * Validate JavaScript code with Acorn and Bracket-Stack Scanner.
   * Pinpoints exact line and column, visual snippet with pointer,
   * error diagnosis, and fix instructions.
   *
   * @param {string} jsCode - Clean/readable JavaScript code
   * @param {Object} options - Parser options
   */
  validateJs(jsCode, options = {}) {
    if (!jsCode || !jsCode.trim()) {
      return {
        valid: true,
        isEmpty: true,
        errorTitle: null,
        message: null,
        line: null,
        column: null,
        snippet: null,
        fixSuggestion: null
      };
    }

    const lines = jsCode.split(/\r?\n/);

    // 1. First run Bracket/Brace Stack Analyzer for precise unclosed bracket detection
    const bracketCheck = this.scanBrackets(jsCode);

    // 2. Run Acorn (or fallback new Function) for full AST syntax checking
    const acornInstance = this.getAcornInstance();

    if (acornInstance) {
      try {
        acornInstance.parse(jsCode, {
          ecmaVersion: "latest",
          locations: true,
          allowReturnOutsideFunction: true,
          allowAwaitOutsideFunction: true,
          allowImportExportEverywhere: true,
          ...options
        });

        // Even if Acorn passed (or had no statement after unclosed bracket), verify bracket check
        if (bracketCheck && bracketCheck.error) {
          const snippet = this.buildCodeSnippet(lines, bracketCheck.line, bracketCheck.column);
          return {
            valid: false,
            isEmpty: false,
            errorTitle: bracketCheck.errorTitle,
            message: bracketCheck.message,
            explanation: bracketCheck.explanation,
            fixSuggestion: bracketCheck.fixSuggestion,
            line: bracketCheck.line,
            column: bracketCheck.column,
            snippet,
            canAutoFix: bracketCheck.canAutoFix || false
          };
        }

        return {
          valid: true,
          isEmpty: false,
          errorTitle: null,
          message: null,
          line: null,
          column: null,
          snippet: null,
          fixSuggestion: null
        };
      } catch (acornErr) {
        // If Acorn caught an error, enrich with bracketCheck if relevant (e.g. unexpected EOF due to unclosed brace)
        const enriched = this.diagnoseJsError(jsCode, acornErr, bracketCheck);
        return enriched;
      }
    } else {
      // Fallback if Acorn is not yet loaded: use new Function with bracket analysis
      try {
        // Wrap in function to allow top-level return statements (standard in low-code clientscripts)
        new Function(`return (function(){ ${jsCode} \n});`)();

        if (bracketCheck && bracketCheck.error) {
          const snippet = this.buildCodeSnippet(lines, bracketCheck.line, bracketCheck.column);
          return {
            valid: false,
            isEmpty: false,
            errorTitle: bracketCheck.errorTitle,
            message: bracketCheck.message,
            explanation: bracketCheck.explanation,
            fixSuggestion: bracketCheck.fixSuggestion,
            line: bracketCheck.line,
            column: bracketCheck.column,
            snippet,
            canAutoFix: bracketCheck.canAutoFix || false
          };
        }

        return {
          valid: true,
          isEmpty: false,
          errorTitle: null,
          message: null,
          line: null,
          column: null,
          snippet: null,
          fixSuggestion: null
        };
      } catch (fnErr) {
        return this.diagnoseJsFallbackError(jsCode, fnErr.message, bracketCheck);
      }
    }
  },

  /**
   * Resolve Acorn parser instance from globalThis or window
   */
  getAcornInstance() {
    if (typeof globalThis !== "undefined" && globalThis.acorn) {
      return globalThis.acorn;
    }
    if (typeof window !== "undefined" && window.acorn) {
      return window.acorn;
    }
    return null;
  },

  /**
   * Scans parentheses, braces, and square brackets while skipping strings,
   * template literals, and comments. Traces exact line and column of unclosed bracket.
   */
  scanBrackets(code) {
    const stack = [];
    const lines = code.split(/\r?\n/);
    let inStr = null;
    let inTemplate = false;
    let inBlockComment = false;

    for (let l = 0; l < lines.length; l++) {
      const line = lines[l];
      let inLineComment = false;

      for (let c = 0; c < line.length; c++) {
        const ch = line[c];
        const next = line[c + 1];

        if (inLineComment) continue;

        if (inBlockComment) {
          if (ch === "*" && next === "/") {
            inBlockComment = false;
            c++;
          }
          continue;
        }

        if (inStr) {
          if (ch === "\\") {
            c++; // skip escaped char
            continue;
          }
          if (ch === inStr) {
            inStr = null;
          }
          continue;
        }

        if (inTemplate) {
          if (ch === "\\") {
            c++;
            continue;
          }
          if (ch === "`") {
            inTemplate = false;
            continue;
          }
          // Inside template literal expression ${ ... }
          if (ch === "$" && next === "{") {
            stack.push({ char: "${", line: l + 1, column: c + 1 });
            c++;
            continue;
          }
        }

        // Check comment starts
        if (ch === "/" && next === "/") {
          inLineComment = true;
          c++;
          continue;
        }
        if (ch === "/" && next === "*") {
          inBlockComment = true;
          c++;
          continue;
        }

        // Check string starts
        if (ch === '"' || ch === "'") {
          inStr = ch;
          continue;
        }
        if (ch === "`") {
          inTemplate = true;
          continue;
        }

        // Bracket checking
        if (ch === "(" || ch === "{" || ch === "[") {
          stack.push({ char: ch, line: l + 1, column: c + 1 });
        } else if (ch === ")" || ch === "}" || ch === "]") {
          const top = stack.pop();
          if (!top) {
            return {
              error: true,
              errorTitle: `Unexpected Extra Closing '${ch}'`,
              message: `Found closing bracket '${ch}' with no matching opening bracket`,
              explanation: `There is no opening bracket matching this '${ch}'. It might be a stray bracket or copy-paste error.`,
              fixSuggestion: `Remove the extra closing bracket '${ch}' at line ${l + 1}, column ${c + 1}.`,
              line: l + 1,
              column: c + 1,
              char: ch
            };
          }

          const isMatching =
            (top.char === "(" && ch === ")") ||
            (top.char === "{" && ch === "}") ||
            (top.char === "[" && ch === "]") ||
            (top.char === "${" && ch === "}");

          if (!isMatching) {
            const expected = top.char === "(" ? ")" : top.char === "{" ? "}" : top.char === "[" ? "]" : "}";
            return {
              error: true,
              errorTitle: `Mismatched Bracket '${ch}'`,
              message: `Expected '${expected}' to close '${top.char}' opened at line ${top.line}, but found '${ch}'`,
              explanation: `Brackets must be closed in reverse order of how they were opened. The block opened with '${top.char}' at line ${top.line}, column ${top.column} was closed with the wrong bracket '${ch}'.`,
              fixSuggestion: `Change '${ch}' to '${expected}' at line ${l + 1}, column ${c + 1}, or check for a missing bracket inside that block.`,
              line: l + 1,
              column: c + 1,
              char: ch
            };
          }
        }
      }
    }

    if (stack.length > 0) {
      const unclosed = stack[stack.length - 1];
      const needed = unclosed.char === "(" ? ")" : unclosed.char === "{" ? "}" : unclosed.char === "[" ? "]" : "}";
      return {
        error: true,
        errorTitle: `Unclosed Bracket '${unclosed.char}' (Missing '${needed}')`,
        message: `Block opened with '${unclosed.char}' at line ${unclosed.line}, column ${unclosed.column} was never closed`,
        explanation: `A code block, parameter list, or expression was opened with '${unclosed.char}' but no matching '${needed}' was found before the end of the file.`,
        fixSuggestion: `Add the missing '${needed}' at the end of the block or file to close '${unclosed.char}'.`,
        line: unclosed.line,
        column: unclosed.column,
        char: unclosed.char,
        needed,
        canAutoFix: true
      };
    }

    return null;
  },

  /**
   * Diagnose Acorn error into friendly message and fix suggestion
   */
  diagnoseJsError(code, err, bracketCheck) {
    const lines = code.split(/\r?\n/);
    const line = err.loc?.line || 1;
    const column = (err.loc?.column || 0) + 1; // 1-based column
    const rawMsg = err.message || "";

    let errorTitle = "JavaScript Syntax Error";
    let message = rawMsg;
    let explanation = "The JavaScript parser encountered invalid syntax.";
    let fixSuggestion = "Check the syntax at the highlighted line.";

    // If Acorn complains of unexpected end of input or unexpected token at EOF,
    // and our bracket checker identified an unclosed bracket, use that superior diagnosis!
    if (
      bracketCheck &&
      bracketCheck.error &&
      (rawMsg.includes("Unexpected token") || rawMsg.includes("Unexpected end of input") || line >= lines.length)
    ) {
      return {
        valid: false,
        isEmpty: false,
        errorTitle: bracketCheck.errorTitle,
        message: bracketCheck.message,
        explanation: bracketCheck.explanation,
        fixSuggestion: bracketCheck.fixSuggestion,
        line: bracketCheck.line,
        column: bracketCheck.column,
        snippet: this.buildCodeSnippet(lines, bracketCheck.line, bracketCheck.column),
        canAutoFix: bracketCheck.canAutoFix || false
      };
    }

    if (rawMsg.includes("Unterminated string constant")) {
      errorTitle = "Unclosed String Literal";
      message = "Unterminated string constant (missing closing quote)";
      explanation = "A string literal was opened with ' or \" but was not closed on the same line.";
      fixSuggestion = `Add the matching closing quote (' or ") at the end of the string, or use backticks (\`...\`) for multi-line strings.`;
    } else if (rawMsg.includes("Unterminated template")) {
      errorTitle = "Unclosed Template Literal";
      message = "Unterminated template literal (missing closing backtick `)";
      explanation = "A template string was opened with ` but no closing backtick was found.";
      fixSuggestion = "Add a closing backtick (`) at the end of the template literal.";
    } else if (rawMsg.includes("Missing catch or finally clause")) {
      errorTitle = "Missing 'catch' or 'finally' after 'try'";
      message = "A 'try' block must be followed by 'catch' or 'finally'";
      explanation = "In JavaScript, a try block cannot stand alone without an error handler.";
      fixSuggestion = "Add 'catch (error) { ... }' or 'finally { ... }' immediately after the try block.";
    } else if (rawMsg.includes("Unexpected token")) {
      const tokenMatch = rawMsg.match(/Unexpected token\s*\(?([^)]*)\)?/);
      const token = tokenMatch ? tokenMatch[1] : "";
      errorTitle = `Unexpected Token in JavaScript`;
      message = `Syntax error: unexpected character or token near line ${line}, col ${column}`;
      explanation = `The JavaScript parser encountered an unexpected token. This is often caused by an extra comma, missing semicolon, or typo.`;
      fixSuggestion = `Check line ${line} for misplaced commas, double operators, or unclosed expressions.`;
    }

    const snippet = this.buildCodeSnippet(lines, line, column);

    return {
      valid: false,
      isEmpty: false,
      errorTitle,
      message,
      explanation,
      fixSuggestion,
      line,
      column,
      snippet,
      canAutoFix: false
    };
  },

  /**
   * Fallback diagnosis when Acorn is absent
   */
  diagnoseJsFallbackError(code, rawMsg, bracketCheck) {
    const lines = code.split(/\r?\n/);
    if (bracketCheck && bracketCheck.error) {
      return {
        valid: false,
        isEmpty: false,
        errorTitle: bracketCheck.errorTitle,
        message: bracketCheck.message,
        explanation: bracketCheck.explanation,
        fixSuggestion: bracketCheck.fixSuggestion,
        line: bracketCheck.line,
        column: bracketCheck.column,
        snippet: this.buildCodeSnippet(lines, bracketCheck.line, bracketCheck.column),
        canAutoFix: bracketCheck.canAutoFix || false
      };
    }

    return {
      valid: false,
      isEmpty: false,
      errorTitle: "JavaScript Syntax Error",
      message: rawMsg,
      explanation: "JavaScript syntax evaluation failed.",
      fixSuggestion: "Review the script for unmatched brackets, missing quotes, or typos.",
      line: 1,
      column: 1,
      snippet: this.buildCodeSnippet(lines, 1, 1),
      canAutoFix: false
    };
  },

  /**
   * Build a formatted code snippet showing context lines around the error
   * with line numbers, error highlighting, and an exact column pointer.
   */
  buildCodeSnippet(lines, errorLine, errorCol, contextRadius = 2) {
    const totalLines = lines.length;
    const startLine = Math.max(1, errorLine - contextRadius);
    const endLine = Math.min(totalLines, errorLine + contextRadius);

    const snippetLines = [];
    for (let i = startLine; i <= endLine; i++) {
      const lineText = lines[i - 1] || "";
      const isError = i === errorLine;
      snippetLines.push({
        lineNum: i,
        text: lineText,
        isError
      });
    }

    // Build visual pointer string
    const colOffset = Math.max(0, errorCol - 1);
    const pointer = " ".repeat(colOffset) + "^";

    return {
      startLine,
      endLine,
      errorLine,
      errorCol,
      lines: snippetLines,
      pointer
    };
  },

  /**
   * Validate both the JSON structure and all embedded clientscripts
   * inside the JSON bundle.
   *
   * @param {string} jsonStr - Raw JSON text
   * @param {Object} JsonEngineRef - Reference to JsonEngine
   * @returns {Object} Comprehensive bundle diagnostic
   */
  validateBundle(jsonStr, JsonEngineRef) {
    const jsonDiag = this.validateJson(jsonStr);
    if (!jsonDiag.valid) {
      return {
        jsonValid: false,
        jsonDiag,
        scriptsChecked: 0,
        scriptErrors: []
      };
    }

    // JSON is syntactically valid! Now check embedded client scripts.
    const rootObj = jsonDiag.data;
    const scriptErrors = [];
    let scriptsChecked = 0;

    if (JsonEngineRef && typeof JsonEngineRef.findAllClientScripts === "function") {
      const blocks = JsonEngineRef.findAllClientScripts(rootObj);
      for (const block of blocks) {
        for (const [key, scriptObj] of Object.entries(block.scripts)) {
          if (!scriptObj.exists || !scriptObj.readable.trim()) continue;
          scriptsChecked++;

          const jsDiag = this.validateJs(scriptObj.readable);
          if (!jsDiag.valid) {
            scriptErrors.push({
              path: block.path,
              scriptKey: key,
              crlf: scriptObj.hasCrLf,
              diagnostic: jsDiag
            });
          }
        }
      }
    }

    return {
      jsonValid: true,
      jsonDiag,
      scriptsChecked,
      hasScriptErrors: scriptErrors.length > 0,
      scriptErrors
    };
  }
};
