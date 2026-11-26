/* Bundled InoJson Script Compare & Diff Studio */
(() => {

/* --- js/sample-data.js --- */
/**
 * Sample JSON bundles for InoJson Script Compare & Diff
 * Featuring realistic enterprise low-code form configurations with escaped clientscripts
 */

const SAMPLE_BASE_JSON = {
  "bundleId": "bundle_appeal_intake_v1",
  "bundleName": "Appeal Intake & Investigation Form",
  "version": "1.4.2",
  "environment": "production",
  "formSettings": {
    "title": "Provider Dispute & Appeal Workflow",
    "theme": "indigo",
    "stepper": true,
    "sections": [
      { "key": "case_intake_summary", "title": "Intake Summary" },
      { "key": "case_good_cause", "title": "Good Cause Review" },
      { "key": "case_wol", "title": "WOL Verification" },
      { "key": "case_validation", "title": "Case Validation & Classification" },
      { "key": "case_investigation", "title": "Investigation" },
      { "key": "case_closing", "title": "Closing" },
      { "key": "reopen", "title": "Reopen Case" }
    ]
  },
  "clientscripts": {
    "prescript": "debugger;\r\nconsole.info(\"model====>\", model);\r\nconsole.info(\"editor====>\", editor);\r\nconst currentStep = editor.appService.stepperViewRef?.currentSectionKey;\r\nconst submitFlag = editor.isSaveAndSubmit;\r\nconst appealConfig = editor.getBPCRecordValue(model);\r\n\r\n// =============== Utility =============== //\r\n\r\nfunction confirmInvestigationCompletion() {\r\n    const effectuationFields = [\r\n        \"date_of_effectuation\",\r\n        \"effectuation_proof\",\r\n        \"new_claim_number\",\r\n        \"check_number\",\r\n        \"effectuated_paid_date\",\r\n        \"check_mailed_date\"\r\n    ];\r\n    const rationaleFields = [\r\n        \"decision\",\r\n        \"review_decision_rationale\",\r\n        \"final_rationale_decision\"\r\n    ];\r\n\r\n    try {\r\n        const twoStepClinicalTaskRequired = appealConfig?.two_step_clinical_review_decision_required === \"Yes\" || false;\r\n        function checkDecision(decision, taskName) {\r\n            switch (decision) {\r\n                case \"Approve\":\r\n                    editor.showAlert('Warning', 'Please complete Effectuation Task to complete Investigation!', 'warning');\r\n                    return false;\r\n                case \"Deny\":\r\n                    editor.showAlert('Warning', 'Please complete Rationale Review Task to complete Investigation!', 'warning');\r\n                    return false;\r\n                default:\r\n                    editor.showAlert('Warning', `Please complete ${taskName} first!`, 'warning');\r\n                    return false;\r\n            }\r\n        }\r\n        return true;\r\n    } catch (error) {\r\n        console.error(\"Error in confirmInvestigationCompletion():\", error);\r\n        return false;\r\n    }\r\n}\r\n\r\nif (model.case_intake_summary_step_status === \"Open\") {\r\n    model.case_intake_summary_step_status = \"Inprogress\";\r\n    model.caseStatus = \"Ready For Case Intake Summary\";\r\n}\r\n",
    "postscript": "debugger;\r\nconsole.info(\"model====>\", model);\r\nconsole.info(\"editor====>\", editor);\r\nconst loggedin_user_id = editor?.appService?.appPermissions?.userProfileInfo?.idStr || \"\";\r\nconst assigned_user_id = model?.pzeon_assignee_to?.[0] || \"\";\r\n\r\nif (model?.case_closing_step_status === \"Completed\" && (model?.is_reopen_confirmed ?? \"No\") !== \"Yes\") {\r\n    editor.hideSaveBtn();\r\n    editor.hideSubmitBtn();\r\n} else {\r\n    editor.showSaveBtn();\r\n    editor.showSubmitBtn();\r\n}\r\n\r\nfunction setHidden(fields, value) {\r\n    fields.forEach(field => {\r\n        if (fieldList[field]) fieldList[field][\"hidden\"] = value;\r\n    });\r\n}\r\n\r\nconsole.log(\"FieldList - End of Postscript\", fieldList);\r\n",
    "onSaveScript": "console.info(\"this is an post save/update script ====>\");\r\nconsole.info(\"model====>\", model);\r\n",
    "preScriptEnabled": true,
    "postScriptEnabled": true,
    "isPreScriptSync": false,
    "onSaveScriptEnabled": true
  },
  "validationRules": [
    { "field": "case_id", "rule": "required" },
    { "field": "received_date", "rule": "valid_date" }
  ]
};

const SAMPLE_TARGET_JSON = {
  "bundleId": "bundle_appeal_intake_v2",
  "bundleName": "Appeal Intake & Investigation Form",
  "version": "1.5.0-RC1",
  "environment": "staging",
  "formSettings": {
    "title": "Provider Dispute & Appeal Workflow",
    "theme": "indigo",
    "stepper": true,
    "sections": [
      { "key": "case_intake_summary", "title": "Intake Summary" },
      { "key": "case_good_cause", "title": "Good Cause Review" },
      { "key": "case_wol", "title": "WOL Verification" },
      { "key": "case_validation", "title": "Case Validation & Classification" },
      { "key": "case_investigation", "title": "Investigation" },
      { "key": "case_closing", "title": "Closing" },
      { "key": "reopen", "title": "Reopen Case" }
    ]
  },
  "clientscripts": {
    "prescript": "debugger;\r\nconsole.info(\"model====>\", model);\r\nconsole.info(\"editor====>\", editor);\r\nconst currentStep = editor.appService.stepperViewRef?.currentSectionKey;\r\nconst submitFlag = editor.isSaveAndSubmit;\r\nconst appealConfig = editor.getBPCRecordValue(model);\r\n\r\n// =============== Utility =============== //\r\n\r\nfunction confirmInvestigationCompletion() {\r\n    const effectuationFields = [\r\n        \"date_of_effectuation\",\r\n        \"effectuation_proof\",\r\n        \"new_claim_number\",\r\n        \"check_number\",\r\n        \"effectuated_paid_date\",\r\n        \"check_mailed_date\"\r\n    ];\r\n    const rationaleFields = [\r\n        \"decision\",\r\n        \"review_decision_rationale\",\r\n        \"final_rationale_decision\"\r\n    ];\r\n\r\n    try {\r\n        const twoStepClinicalTaskRequired = appealConfig?.two_step_clinical_review_decision_required === \"Yes\" || false;\r\n        function checkDecision(decision, taskName) {\r\n            const rationaleTaskCompleted = model?.final_rationale_decision && model.final_rationale_decision.trim() !== \"\";\r\n            const effectuationTaskCompleted = model?.date_of_effectuation && model.date_of_effectuation !== \"\";\r\n\r\n            switch (decision) {\r\n                case \"Approve\":\r\n                    if (effectuationFields.some(field => !model?.[field]) && !effectuationTaskCompleted) {\r\n                        editor.askToConfirm(true, 'Please complete Effectuation Task to complete Investigation!', 'info', false, '', '', true, 'Ok', '#dc3545');\r\n                        return false;\r\n                    } else return true;\r\n                    break;\r\n                case \"Deny\":\r\n                    if (rationaleFields.some(field => !model?.[field]) && !rationaleTaskCompleted) {\r\n                        editor.askToConfirm(true, 'Please complete Rationale Review Task to complete Investigation!', 'info', false, '', '', true, 'Ok', '#dc3545');\r\n                        return false;\r\n                    } else return true;\r\n                    break;\r\n                case \"Partially Deny\":\r\n                    if (rationaleFields.some(field => !model?.[field]) && effectuationFields.some(field => !model?.[field]) && !rationaleTaskCompleted && !effectuationTaskCompleted) {\r\n                        editor.askToConfirm(true, 'Please complete Rationale Review and Effectuation Task to complete Investigation!', 'info', false, '', '', true, 'Ok', '#dc3545');\r\n                        return false;\r\n                    } else return true;\r\n                    break;\r\n                default:\r\n                    editor.askToConfirm(true, `Please complete ${taskName} first!`, 'info', false, '', '', true, 'Ok', '#dc3545');\r\n                    return false;\r\n            }\r\n        }\r\n\r\n        if (model.whoMadeTheRequest === \"NCP\") {\r\n            fieldList.valid_wol_received.disabled = true;\r\n        }\r\n\r\n        if (model?.review_type === \"Clinical\") {\r\n            return checkDecision(twoStepClinicalTaskRequired ? model?.clinicalDecision : model?.mdDecision, \"Clinical Task\");\r\n        }\r\n        return true;\r\n    } catch (error) {\r\n        console.error(\"Error in confirmInvestigationCompletion():\", error);\r\n        return false;\r\n    }\r\n}\r\n\r\nif (model.case_intake_summary_step_status === \"Open\") {\r\n    model.case_intake_summary_step_status = \"Inprogress\";\r\n    model.caseStatus = \"Ready For Case Intake Summary\";\r\n}\r\n",
    "postscript": "debugger;\r\nconsole.info(\"model====>\", model);\r\nconsole.info(\"editor====>\", editor);\r\nconst loggedin_user_id = editor?.appService?.appPermissions?.userProfileInfo?.idStr || \"\";\r\nconst assigned_user_id = model?.pzeon_assignee_to?.[0] || \"\";\r\n\r\n// Enhanced quality review status gate\r\nif (model?.case_closing_step_status === \"Completed\" && (model?.is_reopen_confirmed ?? \"No\") !== \"Yes\") {\r\n    editor.hideSaveBtn();\r\n    editor.hideSubmitBtn();\r\n} else if (model.caseStatus === \"Ready For Quality Review\") {\r\n    if (loggedin_user_id === assigned_user_id) {\r\n        editor.showSaveBtn();\r\n        editor.hideSubmitBtn();\r\n    } else {\r\n        editor.hideSaveBtn();\r\n        editor.hideSubmitBtn();\r\n    }\r\n} else {\r\n    editor.showSaveBtn();\r\n    editor.showSubmitBtn();\r\n}\r\n\r\nfunction setHidden(fields, value) {\r\n    fields.forEach(field => {\r\n        if (fieldList[field]) fieldList[field][\"hidden\"] = value;\r\n    });\r\n}\r\n\r\nfunction setMandatory(fields, value) {\r\n    fields.forEach(field => {\r\n        if (fieldList[field]) fieldList[field][\"mandatory\"] = value;\r\n    });\r\n}\r\n\r\nconsole.log(\"FieldList - End of Postscript (v2 with Quality Review)\", fieldList);\r\n",
    "onSaveScript": "console.info(\"this is an post save/update script ====>\");\r\nconsole.info(\"model====>\", model);\r\n",
    "preScriptEnabled": true,
    "postScriptEnabled": true,
    "isPreScriptSync": false,
    "onSaveScriptEnabled": true
  },
  "validationRules": [
    { "field": "case_id", "rule": "required" },
    { "field": "received_date", "rule": "valid_date" }
  ]
};


/* --- js/js-highlighter.js --- */
/**
 * Lightweight & fast JavaScript syntax tokenizer for diff rendering
 * Safely handles HTML escaping and highlights tokens while preserving diff spans
 */

const JsHighlighter = {
  escapeHtml(str = "") {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  /**
   * Highlight a plain JavaScript line
   */
  highlightLine(line = "") {
    if (!line) return "&nbsp;";

    // Check for comment
    const trimmed = line.trim();
    if (trimmed.startsWith("//")) {
      return `<span class="tok-comment">${this.escapeHtml(line)}</span>`;
    }

    // Token regex pattern
    const tokenRegex =
      /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\.|[^`])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b(?:const|let|var|function|return|if|else|switch|case|break|default|try|catch|finally|throw|new|typeof|instanceof|void|delete|in|of|for|while|do|continue|debugger|async|await|class|extends|super|import|export|from|null|undefined|true|false)\b)|(\b(?:console|model|editor|fieldList|appealConfig|window|document|Math|Date|JSON|Array|Object|String|Number|Boolean|RegExp|Promise)\b)|(\b\d+(?:\.\d+)?\b)|([a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\())|([+\-*/%=&|!<>?:^~]+)|(\s+)|([^\s\w])/g;

    let result = "";
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(line)) !== null) {
      const [
        full,
        comment,
        string,
        keyword,
        builtin,
        number,
        fnCall,
        operator,
        whitespace,
        punct
      ] = match;

      if (comment) {
        result += `<span class="tok-comment">${this.escapeHtml(comment)}</span>`;
      } else if (string) {
        result += `<span class="tok-string">${this.escapeHtml(string)}</span>`;
      } else if (keyword) {
        result += `<span class="tok-keyword">${this.escapeHtml(keyword)}</span>`;
      } else if (builtin) {
        result += `<span class="tok-builtin">${this.escapeHtml(builtin)}</span>`;
      } else if (number) {
        result += `<span class="tok-number">${this.escapeHtml(number)}</span>`;
      } else if (fnCall) {
        result += `<span class="tok-fn">${this.escapeHtml(fnCall)}</span>`;
      } else if (operator) {
        result += `<span class="tok-operator">${this.escapeHtml(operator)}</span>`;
      } else if (whitespace) {
        // preserve spaces
        result += this.escapeHtml(whitespace);
      } else if (punct) {
        result += `<span class="tok-punct">${this.escapeHtml(punct)}</span>`;
      } else {
        result += this.escapeHtml(full);
      }
      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      result += this.escapeHtml(line.slice(lastIndex));
    }

    return result || "&nbsp;";
  },

  /**
   * Render intra-line diff spans with character highlights
   */
  renderDiffSpans(spans = [], type = "modify") {
    if (!spans || spans.length === 0) return "&nbsp;";

    let html = "";
    for (const span of spans) {
      const escaped = this.escapeHtml(span.text);
      if (span.type === "del") {
        html += `<span class="diff-char-del" title="Deleted">${escaped}</span>`;
      } else if (span.type === "ins") {
        html += `<span class="diff-char-ins" title="Inserted">${escaped}</span>`;
      } else {
        // Equal part can still be syntax highlighted
        html += this.highlightLine(span.text);
      }
    }
    return html || "&nbsp;";
  }
};


/* --- js/js-beautifier.js --- */
/**
 * Simple, robust JavaScript Formatter & Beautifier
 * Indents code with correct brace matching, switch-case alignment, and blank line preservation.
 */

const JsBeautifier = {
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


/* --- js/validator.js --- */
/**
 * Validator and Diagnostics Engine for InoJson Script Compare & Diff Studio
 * Provides comprehensive JSON and JavaScript syntax validation, pinpoint error
 * localization (line, column, code snippet with pointer), actionable fix suggestions,
 * and intelligent auto-fix capabilities.
 */

const Validator = {
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
   * Scans JSON token structure character by character to accurately locate
   * syntax breakage points (missing commas, trailing commas, unquoted keys,
   * single quotes, unclosed objects/arrays/strings, invalid tokens).
   *
   * @param {string} text - Raw JSON string
   * @returns {Object|null} { line, col, pos, reason }
   */
  scanJsonStructure(text) {
    if (!text) return null;
    let line = 1, col = 0;
    let i = 0;
    const len = text.length;

    const stack = []; // "OBJ", "ARR"
    let expect = "VALUE"; // "VALUE", "KEY_OR_CLOSE", "KEY", "COLON", "COMMA_OR_CLOSE", "VALUE_OR_CLOSE"

    while (i < len) {
      const ch = text[i];
      if (ch === " " || ch === "\t" || ch === "\r") {
        i++; col++; continue;
      }
      if (ch === "\n") {
        i++; line++; col = 0; continue;
      }

      const curLine = line;
      const curCol = col + 1; // 1-based column
      const curPos = i;

      // Comment detection
      if (ch === "/" && (text[i + 1] === "/" || text[i + 1] === "*")) {
        return { line: curLine, col: curCol, pos: curPos, reason: "Comment in JSON" };
      }

      // String literal
      if (ch === '"') {
        i++; col++;
        let closed = false;
        while (i < len) {
          const sc = text[i];
          if (sc === "\n") {
            return { line: curLine, col: curCol, pos: curPos, reason: "Unescaped newline in string literal" };
          }
          if (sc === "\\") {
            i += 2; col += 2; continue;
          }
          if (sc === '"') {
            i++; col++; closed = true; break;
          }
          i++; col++;
        }
        if (!closed) {
          return { line: curLine, col: curCol, pos: curPos, reason: "Unclosed string literal" };
        }

        if (expect === "KEY" || expect === "KEY_OR_CLOSE") {
          expect = "COLON";
        } else if (expect === "VALUE" || expect === "VALUE_OR_CLOSE") {
          expect = "COMMA_OR_CLOSE";
        } else {
          return { line: curLine, col: curCol, pos: curPos, reason: "Unexpected string literal" };
        }
        continue;
      }

      // Single quotes error
      if (ch === "'") {
        return { line: curLine, col: curCol, pos: curPos, reason: "Single quotes used instead of double quotes" };
      }

      // Object start '{'
      if (ch === "{") {
        i++; col++;
        if (expect !== "VALUE" && expect !== "VALUE_OR_CLOSE") {
          return { line: curLine, col: curCol, pos: curPos, reason: "Unexpected '{'" };
        }
        stack.push("OBJ");
        expect = "KEY_OR_CLOSE";
        continue;
      }

      // Object end '}'
      if (ch === "}") {
        i++; col++;
        const top = stack.pop();
        if (top !== "OBJ") {
          return { line: curLine, col: curCol, pos: curPos, reason: "Unexpected '}'" };
        }
        if (expect === "COLON" || expect === "KEY") {
          return { line: curLine, col: curCol, pos: curPos, reason: "Trailing comma before '}' or missing property" };
        }
        expect = "COMMA_OR_CLOSE";
        continue;
      }

      // Array start '['
      if (ch === "[") {
        i++; col++;
        if (expect !== "VALUE" && expect !== "VALUE_OR_CLOSE") {
          return { line: curLine, col: curCol, pos: curPos, reason: "Unexpected '['" };
        }
        stack.push("ARR");
        expect = "VALUE_OR_CLOSE";
        continue;
      }

      // Array end ']'
      if (ch === "]") {
        i++; col++;
        const top = stack.pop();
        if (top !== "ARR") {
          return { line: curLine, col: curCol, pos: curPos, reason: "Unexpected ']'" };
        }
        if (expect === "VALUE") {
          return { line: curLine, col: curCol, pos: curPos, reason: "Trailing comma before ']'" };
        }
        expect = "COMMA_OR_CLOSE";
        continue;
      }

      // Colon ':'
      if (ch === ":") {
        i++; col++;
        if (expect !== "COLON") {
          return { line: curLine, col: curCol, pos: curPos, reason: "Unexpected ':'" };
        }
        expect = "VALUE";
        continue;
      }

      // Comma ','
      if (ch === ",") {
        i++; col++;
        if (expect !== "COMMA_OR_CLOSE") {
          return { line: curLine, col: curCol, pos: curPos, reason: "Unexpected ',' (missing value or illegal comma)" };
        }
        const top = stack[stack.length - 1];
        if (top === "OBJ") {
          expect = "KEY";
        } else if (top === "ARR") {
          expect = "VALUE";
        } else {
          return { line: curLine, col: curCol, pos: curPos, reason: "Unexpected comma outside container" };
        }
        continue;
      }

      // Numbers, booleans, null, or unquoted identifiers
      if (/^[0-9\-a-zA-Z_$]/.test(ch)) {
        const startI = i;
        while (i < len && /[0-9a-zA-Z_$.+\-]/.test(text[i])) {
          i++; col++;
        }
        const word = text.slice(startI, i);
        const isValidJsonLiteral =
          word === "true" ||
          word === "false" ||
          word === "null" ||
          /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(word);

        if (isValidJsonLiteral) {
          if (expect === "KEY" || expect === "KEY_OR_CLOSE") {
            return { line: curLine, col: curCol, pos: curPos, reason: `Unquoted key '${word}'` };
          }
          if (expect !== "VALUE" && expect !== "VALUE_OR_CLOSE") {
            return { line: curLine, col: curCol, pos: curPos, reason: `Unexpected token '${word}'` };
          }
          expect = "COMMA_OR_CLOSE";
        } else {
          if (expect === "KEY" || expect === "KEY_OR_CLOSE") {
            return { line: curLine, col: curCol, pos: curPos, reason: `Unquoted key '${word}'` };
          }
          return { line: curLine, col: curCol, pos: curPos, reason: `Invalid token '${word}'` };
        }
        continue;
      }

      // Any other unexpected character
      return { line: curLine, col: curCol, pos: curPos, reason: `Unexpected character '${ch}'` };
    }

    if (stack.length > 0) {
      const needed = stack[stack.length - 1] === "OBJ" ? "}" : "]";
      return { line, col: Math.max(1, col), pos: len, reason: `Unclosed container (missing '${needed}')` };
    }

    return null;
  },

  /**
   * Deeply diagnose a JSON parse error by inspecting the text around the failure position.
   */
  diagnoseJsonError(text, rawMessage) {
    const lines = text.split(/\r?\n/);
    let pos = -1;
    let line = null;
    let column = null;

    // 1. Check explicit "(line X column Y)" or "line X column Y"
    const lineColMatch =
      rawMessage.match(/\(line\s+(\d+)\s+column\s+(\d+)\)/i) ||
      rawMessage.match(/line\s+(\d+)\s+column\s+(\d+)/i);

    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      column = parseInt(lineColMatch[2], 10);
      let offset = 0;
      for (let i = 0; i < line - 1 && i < lines.length; i++) {
        offset += lines[i].length + 1;
      }
      pos = offset + (column - 1);
    }

    // 2. Check "position <digits>"
    const posMatch = rawMessage.match(/position\s+(\d+)/i);
    if (posMatch) {
      pos = parseInt(posMatch[1], 10);
    }

    // 3. Modern Chrome/V8 excerpt pattern:
    // e.g. Unexpected token ',', ..."key_100": ,\n  "key_1"... is not valid JSON
    // or ..."": [1, 2, , 4]}" is not valid JSON
    if (pos === -1 && !line) {
      const excerptMatch = rawMessage.match(/\.\.\.([\s\S]+?)(?:\.\.\.|\"\s+is not valid JSON|\s+is not valid JSON|$)/);
      if (excerptMatch) {
        let excerpt = excerptMatch[1];
        if (excerpt.startsWith('"')) excerpt = excerpt.slice(1);
        if (excerpt.endsWith('"')) excerpt = excerpt.slice(0, -1);

        let found = text.indexOf(excerpt);
        if (found === -1 && excerpt.length > 10) {
          found = text.indexOf(excerpt.slice(0, 15));
        }
        if (found !== -1) {
          const tokMatch = rawMessage.match(/Unexpected token\s*(?:'([^']+)'|(\S+))/);
          const token = tokMatch ? (tokMatch[1] || tokMatch[2]) : null;
          let offsetInExcerpt = 0;
          if (token) {
            const tokIdx = excerpt.indexOf(token);
            if (tokIdx !== -1) offsetInExcerpt = tokIdx;
          }
          pos = found + offsetInExcerpt;
        }
      }
    }

    // 4. Fallback Token/Syntax Scanner
    // If line is not found yet, or pos is <= 0 while text has multiple lines:
    if (!line && (pos === -1 || (pos === 0 && lines.length > 1))) {
      const scanResult = this.scanJsonStructure(text);
      if (scanResult) {
        line = scanResult.line;
        column = scanResult.col;
        pos = scanResult.pos;
      }
    }

    // Map character offset to line & column if line wasn't set yet
    if (!line && pos >= 0) {
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
    }

    // Absolute boundary fallbacks
    if (!line || line < 1) line = 1;
    if (line > lines.length) line = lines.length;
    if (!column || column < 1) column = 1;
    if (pos < 0) {
      let offset = 0;
      for (let i = 0; i < line - 1 && i < lines.length; i++) {
        offset += lines[i].length + 1;
      }
      pos = offset + (column - 1);
    }

    const currentLineText = lines[line - 1] || "";
    const prevLineText = line > 1 ? lines[line - 2] : "";
    const textAround = text.slice(Math.max(0, pos - 40), Math.min(text.length, pos + 40));

    // Analyze specific error patterns
    let errorTitle = "JSON Syntax Error";
    let message = rawMessage;
    let explanation = "The JSON parser encountered unexpected characters or malformed structure.";
    let fixSuggestion = `Check the syntax at line ${line} and ensure proper quotes and commas.`;

    // Pattern A: Trailing comma before } or ]
    const beforePos = text.slice(Math.max(0, pos - 20), pos).trim();
    const atPos = text.slice(pos, pos + 20).trim();
    const lineBeforeCol = currentLineText.slice(0, column - 1).trim();

    if (
      (atPos.startsWith("}") || atPos.startsWith("]") || currentLineText.trim().startsWith("}") || currentLineText.trim().startsWith("]")) &&
      (beforePos.endsWith(",") || lineBeforeCol.endsWith(",") || /,\s*$/.test(prevLineText) || currentLineText.includes(","))
    ) {
      const bracket = atPos.startsWith("]") || currentLineText.trim().startsWith("]") ? "]" : "}";
      errorTitle = `Trailing Comma before '${bracket}'`;
      message = `Illegal trailing comma found before closing '${bracket}'`;
      explanation = `The JSON standard (RFC 8259) strictly forbids trailing commas after the last property in an object or element in an array.`;
      fixSuggestion = `Delete the trailing comma ',' on line ${lineBeforeCol.endsWith(",") ? line : line > 1 && /,\s*$/.test(prevLineText) ? line - 1 : line}, or click '⚡ Auto-Fix JSON'.`;
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
    // Pattern D: Missing value (e.g. "key": ,)
    else if (
      /:\s*,/.test(currentLineText) ||
      (currentLineText.trim().endsWith(":") && atPos.startsWith(",")) ||
      rawMessage.toLowerCase().includes("unexpected token ','")
    ) {
      errorTitle = "Missing Property Value";
      message = `Found a colon ':' followed immediately by a comma ',' without a value`;
      explanation = `A property key was followed by a colon ':', but the value was left empty before the comma. In JSON, every property must have a valid value.`;
      fixSuggestion = `Provide a valid value for the property on line ${line} (e.g. "value", 0, null, false, or {}), or remove the key.`;
    }
    // Pattern E: Unquoted property key
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
    // Pattern F: Semicolon used instead of comma
    else if (currentLineText.includes(";") || prevLineText.includes(";")) {
      errorTitle = "Semicolon Used Instead of Comma";
      message = "Semicolon (';') found at end of property instead of comma (',')";
      explanation = "In JSON, properties are separated by commas (','). Semicolons are standard in JavaScript statements, but strictly forbidden in JSON.";
      fixSuggestion = `Replace the semicolon ';' with a comma ',' on line ${line}, or click '⚡ Auto-Fix JSON'.`;
    }
    // Pattern G: Missing comma between properties
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
    // Pattern H: Missing colon separator ':'
    else if (
      rawMessage.toLowerCase().includes("expected ':'") ||
      (currentLineText.trim().startsWith('"') && /"[^"\\]*"\s+[^:,}\]]/.test(currentLineText))
    ) {
      errorTitle = "Missing Colon Separator ':'";
      message = "Missing colon ':' after object property name";
      explanation = "In JSON, every property name must be separated from its value by a colon (':'), e.g. \"key\": \"value\".";
      fixSuggestion = `Insert a colon ':' after the property name on line ${line}.`;
    }
    // Pattern I: Double comma or unexpected comma
    else if (
      /,\s*,/.test(currentLineText) ||
      /{\s*,/.test(currentLineText) ||
      /\[\s*,/.test(currentLineText)
    ) {
      errorTitle = "Double Comma / Extra Comma";
      message = "Found consecutive commas (',,') or unexpected leading comma";
      explanation = "JSON does not allow empty elements between consecutive commas or commas immediately following an opening brace '{' or bracket '['.";
      fixSuggestion = `Remove the duplicate or misplaced comma on line ${line}, or click '⚡ Auto-Fix JSON'.`;
    }
    // Pattern J: Invalid literals (undefined, NaN, Python None/True/False)
    else if (
      /:\s*(undefined|NaN|None|True|False)\b/i.test(currentLineText) ||
      rawMessage.toLowerCase().includes("unexpected token 'u'") ||
      rawMessage.toLowerCase().includes("unexpected token 'n'")
    ) {
      const litMatch = currentLineText.match(/:\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/);
      const litName = litMatch ? litMatch[1] : "literal";
      errorTitle = `Invalid Literal '${litName}' in JSON`;
      message = `'${litName}' is not a valid JSON literal`;
      explanation = `Standard JSON (RFC 8259) only accepts 'null', 'true', 'false', numbers, strings, arrays, and objects. Values like 'undefined', 'NaN', and Python-style 'None' are invalid.`;
      fixSuggestion = `Replace '${litName}' with null (or \"${litName}\" string) on line ${line}, or click '⚡ Auto-Fix JSON'.`;
    }
    // Pattern K: Unescaped raw newline in string literal
    else if (rawMessage.toLowerCase().includes("bad control character") || rawMessage.toLowerCase().includes("unterminated string")) {
      errorTitle = "Unescaped Newline in String Literal";
      message = "String literal contains raw unescaped line breaks";
      explanation = `JSON strings cannot contain unescaped line breaks. Multiline scripts or strings must escape newlines as '\\r\\n' or '\\n'.`;
      fixSuggestion = `Escape the line breaks using '\\r\\n' (for clientscripts) or '\\n', or use the Quick Snippet Converter.`;
    }
    // Pattern H: Unbalanced braces/brackets
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

    // 2. Replace semicolons at line ends or before next element with commas
    let fixedSemicolons = false;
    const semiFixed = text.replace(/;\s*(?=[\r\n]|\s*["'a-zA-Z0-9_$\}\]])/g, () => {
      fixedSemicolons = true;
      return ",";
    });
    if (fixedSemicolons) {
      appliedFixes.push("Replaced semicolons (;) with commas (,)");
      text = semiFixed;
    }

    // 3. Fix consecutive duplicate commas: ,, -> ,
    let fixedDoubleCommas = false;
    const doubleCommaFixed = text.replace(/,\s*,+/g, () => {
      fixedDoubleCommas = true;
      return ",";
    });
    if (fixedDoubleCommas) {
      appliedFixes.push("Removed duplicate consecutive commas (,,)");
      text = doubleCommaFixed;
    }

    // 4. Fix invalid literals: undefined, NaN, None -> null; True -> true; False -> false
    let fixedLiterals = false;
    const litFixed = text
      .replace(/:\s*(undefined|NaN|None)\b/g, () => {
        fixedLiterals = true;
        return ": null";
      })
      .replace(/:\s*True\b/g, () => {
        fixedLiterals = true;
        return ": true";
      })
      .replace(/:\s*False\b/g, () => {
        fixedLiterals = true;
        return ": false";
      });
    if (fixedLiterals) {
      appliedFixes.push("Converted invalid literals (undefined/None/True/False) to valid JSON");
      text = litFixed;
    }

    // 5. Fix unquoted keys: e.g. { foo: or , foo: or newline foo:
    let fixedKeys = false;
    const keyFixed = text.replace(/(^|[{,\r\n]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, (match, prefix, key) => {
      fixedKeys = true;
      return `${prefix}"${key}":`;
    });
    if (fixedKeys) {
      appliedFixes.push("Enclosed unquoted object keys in double quotes");
      text = keyFixed;
    }

    // 6. Fix single quotes to double quotes (for simple strings)
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

    // 7. Remove trailing commas before } or ]
    let fixedCommas = false;
    const commaFixed = text.replace(/,\s*([\}\]])/g, (match, closing) => {
      fixedCommas = true;
      return closing;
    });
    if (fixedCommas) {
      appliedFixes.push("Removed illegal trailing commas before '}' or ']'");
      text = commaFixed;
    }

    // 8. Test if the result parses
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
    if (typeof globalThis !== "undefined" && globalThis.acorn && typeof globalThis.acorn.parse === "function") {
      return globalThis.acorn;
    }
    if (typeof window !== "undefined" && window.acorn && typeof window.acorn.parse === "function") {
      return window.acorn;
    }
    // If Acorn was loaded via AMD into Monaco / RequireJS loader
    if (typeof window !== "undefined" && typeof window.require === "function") {
      try {
        let instance = null;
        window.require(["acorn"], mod => {
          if (mod) {
            instance = mod;
            window.acorn = mod;
          }
        });
        if (instance && typeof instance.parse === "function") return instance;
      } catch (e) {}
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
   * Fallback diagnosis when Acorn is absent.
   * Employs safe statement analysis to locate the exact offending line
   * instead of falling back to Line 1.
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

    // Incremental search for offending statement to avoid defaulting to line 1
    let detectedLine = 1;
    let detectedCol = 1;
    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i].trim();
      if (!lineText || lineText.startsWith("//") || lineText.startsWith("/*") || lineText.startsWith("*")) continue;
      try {
        new Function(`function _test() { switch(0) { case 0: default: ; } ${lineText} \n}`);
      } catch (e2) {
        detectedLine = i + 1;
        break;
      }
    }

    return {
      valid: false,
      isEmpty: false,
      errorTitle: "JavaScript Syntax Error",
      message: rawMsg,
      explanation: "JavaScript syntax evaluation failed.",
      fixSuggestion: `Review line ${detectedLine} for misplaced tokens, unclosed expressions, or syntax errors.`,
      line: detectedLine,
      column: detectedCol,
      snippet: this.buildCodeSnippet(lines, detectedLine, detectedCol),
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


/* --- js/monaco-manager.js --- */
/**
 * Monaco Editor Manager for InoJson Studio
 * Provides seamless VS Code Monaco editor integration with IntelliSense,
 * Code Folding, Minimap, Multi-cursor, JSON schema validation, and low-code script typing.
 * Falls back gracefully to CodeMirror if Monaco CDN is unreachable or offline.
 */

class MonacoManager {
  constructor() {
    this.isReady = false;
    this.isLoading = false;
    this.readyCallbacks = [];
    this.instances = new Map(); // id -> editorInstance
    this.init();
  }

  /**
   * Initializes Monaco AMD loader from CDN with safe cross-origin blob workers
   */
  init() {
    if (typeof window === "undefined") return;

    if (window.monaco && window.monaco.editor) {
      this.isReady = true;
      this.configureMonacoDefaults();
      return;
    }

    if (typeof window.require !== "undefined" && window.require.config) {
      this.loadMonacoWithAmd();
    } else {
      // Dynamically inject loader if not yet present in HTML
      this.injectMonacoLoader();
    }
  }

  injectMonacoLoader() {
    if (this.isLoading) return;
    this.isLoading = true;

    const existingScript = document.querySelector('script[src*="monaco-editor"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => this.loadMonacoWithAmd());
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js";
    script.async = true;
    script.onload = () => {
      this.loadMonacoWithAmd();
    };
    script.onerror = () => {
      console.warn("Monaco loader failed to load. Falling back to CodeMirror.");
      this.isLoading = false;
    };
    document.head.appendChild(script);
  }

  loadMonacoWithAmd() {
    try {
      window.require.config({
        paths: {
          vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs"
        }
      });

      // Inline blob workers enable Monaco workers to run on GitHub Pages & localhost without CORS errors
      window.MonacoEnvironment = {
        getWorkerUrl: function (workerId, label) {
          const proxyScript = `
            self.MonacoEnvironment = {
              baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/'
            };
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/base/worker/workerMain.js');
          `;
          return `data:text/javascript;charset=utf-8,${encodeURIComponent(proxyScript)}`;
        }
      };

      window.require(["vs/editor/editor.main"], () => {
        this.isReady = true;
        this.isLoading = false;
        this.configureMonacoDefaults();
        this.readyCallbacks.forEach(cb => {
          try {
            cb(window.monaco);
          } catch (e) {
            console.error("Monaco onReady callback error:", e);
          }
        });
        this.readyCallbacks = [];
      });
    } catch (err) {
      console.warn("Error configuring Monaco AMD loader:", err);
      this.isLoading = false;
    }
  }

  /**
   * Registers custom TypeScript/JavaScript definitions for low-code scripts
   * giving developers real IntelliSense for editor.showAlert, editor.askToConfirm,
   * model properties, and low-code utilities.
   */
  configureMonacoDefaults() {
    if (!window.monaco || !window.monaco.languages || !window.monaco.languages.typescript) {
      return;
    }

    const ts = window.monaco.languages.typescript;

    // JavaScript compiler options
    ts.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    });

    ts.javascriptDefaults.setCompilerOptions({
      target: ts.ScriptTarget.ES2022,
      allowNonTextFiles: false,
      allowJs: true,
      checkJs: false
    });

    // Low-code SDK Type Definitions for autocomplete
    const lowCodeDts = `
      interface StepperViewRef {
        currentSectionKey?: string;
        currentStepIndex?: number;
      }

      interface AppService {
        stepperViewRef?: StepperViewRef;
        [key: string]: any;
      }

      interface LowCodeEditor {
        /**
         * Display a notification banner to the user
         */
        showAlert(title: string, message: string, type?: 'info' | 'warning' | 'error' | 'success'): void;

        /**
         * Prompt user for modal confirmation before executing an action
         */
        askToConfirm(
          show: boolean,
          message: string,
          type?: string,
          flag?: boolean,
          opt1?: string,
          opt2?: string,
          opt3?: boolean,
          btnText?: string,
          color?: string
        ): boolean;

        /**
         * Extract business process configuration record value
         */
        getBPCRecordValue(model: any): any;

        /**
         * Whether current execution is Save & Submit
         */
        isSaveAndSubmit?: boolean;

        /**
         * Low-code application services
         */
        appService?: AppService;

        [key: string]: any;
      }

      /**
       * Low-code Editor Runtime Instance
       */
      declare const editor: LowCodeEditor;

      /**
       * Active Form Data Model containing submitted fields and step statuses
       */
      declare const model: Record<string, any>;

      /**
       * Active Form Field Definitions and controls
       */
      declare const fieldList: Record<string, any>;

      /**
       * Business Process Configuration
       */
      declare const appealConfig: Record<string, any>;
    `;

    ts.javascriptDefaults.addExtraLib(lowCodeDts, "ts:filename/inojson-lowcode.d.ts");
  }

  /**
   * Register a callback to be called when Monaco is ready
   */
  onReady(cb) {
    if (this.isReady && window.monaco) {
      cb(window.monaco);
    } else {
      this.readyCallbacks.push(cb);
    }
  }

  /**
   * Create a full-featured VS Code Monaco editor instance
   */
  create(mountEl, options = {}) {
    if (!this.isReady || !window.monaco) return null;

    const {
      value = "",
      language = "json",
      readOnly = false,
      tabSize = language === "json" ? 2 : 4,
      minimap = true,
      onChange = null
    } = options;

    const editor = window.monaco.editor.create(mountEl, {
      value,
      language,
      theme: "vs-dark",
      automaticLayout: true,
      readOnly,
      tabSize,
      insertSpaces: true,
      fontSize: 13,
      fontFamily: "'Fira Code', 'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontLigatures: true,
      lineNumbers: "on",
      minimap: { enabled: minimap },
      glyphMargin: true,
      folding: true,
      foldingHighlight: true,
      showFoldingControls: "always",
      renderLineHighlight: "all",
      matchBrackets: "always",
      autoClosingBrackets: "always",
      autoClosingQuotes: "always",
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true
      },
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showFunctions: true
      },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: true
      },
      scrollBeyondLastLine: false,
      formatOnPaste: true,
      formatOnType: true,
      contextmenu: true,
      wordWrap: "off",
      padding: { top: 8, bottom: 8 }
    });

    if (typeof onChange === "function") {
      editor.onDidChangeModelContent(() => {
        onChange(editor.getValue());
      });
    }

    return editor;
  }
}

const monacoManager = new MonacoManager();


/* --- js/json-engine.js --- */
/**
 * JSON Engine for InoJson Script Compare & Diff
 * Handles JSON parsing, deep traversal to find clientscripts blocks,
 * accurate unescaping to readable JS, and re-serializing to production JSON.
 */

const JsonEngine = {
  /**
   * Parse JSON string safely with precise error reporting
   */
  parse(jsonStr) {
    if (!jsonStr || !jsonStr.trim()) {
      return { ok: false, error: "Input is empty", data: null };
    }

    try {
      const data = JSON.parse(jsonStr);
      const indent = this.detectIndentation(jsonStr);
      const lineEnding = jsonStr.includes("\r\n") ? "\r\n" : "\n";
      return { ok: true, data, indent, lineEnding, error: null };
    } catch (err) {
      return {
        ok: false,
        error: this.formatParseError(err.message, jsonStr),
        data: null
      };
    }
  },

  /**
   * Detect JSON indentation (spaces count or tab)
   */
  detectIndentation(jsonStr) {
    const lines = jsonStr.split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^(\s+)\S/);
      if (match) {
        const indentStr = match[1];
        if (indentStr.startsWith("\t")) return "\t";
        return indentStr.length; // e.g. 2 or 4
      }
    }
    return 2; // default
  },

  /**
   * Formats a JSON parse error with approximate line & column
   */
  formatParseError(rawMessage, text) {
    const posMatch = rawMessage.match(/position\s+(\d+)/i);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = text.slice(0, pos).split(/\r?\n/);
      const lineNum = lines.length;
      const colNum = lines[lines.length - 1].length + 1;
      return `Syntax Error at line ${lineNum}, column ${colNum}: ${rawMessage}`;
    }
    return rawMessage;
  },

  /**
   * Find all `clientscripts` blocks across the JSON hierarchy
   * Handles root, nested sections, steps, forms, or direct script objects
   */
  findAllClientScripts(rootObj, path = "$") {
    const results = [];
    if (!rootObj) return results;

    // If user pasted a single raw script string: e.g. "debugger;\r\nconsole.info..."
    if (typeof rootObj === "string" && (rootObj.includes("\n") || rootObj.includes(";") || rootObj.includes("function") || rootObj.includes("editor"))) {
      results.push(this.buildClientScriptEntry({ prescript: rootObj }, null, null, "$ (Single Script)"));
      return results;
    }

    if (typeof rootObj !== "object") return results;

    // Check if the current object IS a clientscripts object (e.g. if user pasted just the clientscripts block)
    const isDirectClientScripts =
      ("prescript" in rootObj || "postscript" in rootObj || "onSaveScript" in rootObj) &&
      !("clientscripts" in rootObj);

    if (isDirectClientScripts) {
      results.push(this.buildClientScriptEntry(rootObj, null, null, path));
      return results;
    }

    // Traverse recursively
    const search = (current, currentPath, parent, parentKey) => {
      if (!current || typeof current !== "object") return;

      if (current.clientscripts && typeof current.clientscripts === "object") {
        const csPath = currentPath === "$" ? "$.clientscripts" : `${currentPath}.clientscripts`;
        results.push(this.buildClientScriptEntry(current.clientscripts, current, "clientscripts", csPath));
      }

      if (Array.isArray(current)) {
        current.forEach((item, index) => {
          search(item, `${currentPath}[${index}]`, current, index);
        });
      } else {
        for (const [key, val] of Object.entries(current)) {
          if (key === "clientscripts") continue; // already processed above
          if (val && typeof val === "object") {
            search(val, `${currentPath}.${key}`, current, key);
          }
        }
      }
    };

    search(rootObj, path, null, null);
    return results;
  },

  /**
   * Helper to build a normalized clientscript descriptor
   */
  buildClientScriptEntry(csObj, parent, key, path) {
    const knownKeys = ["prescript", "postscript", "onSaveScript"];
    const scripts = {};

    // Standard low-code scripts
    knownKeys.forEach(k => {
      if (typeof csObj[k] === "string") {
        scripts[k] = {
          name: k,
          exists: true,
          raw: csObj[k],
          hasCrLf: csObj[k].includes("\r\n"),
          readable: this.toReadableJs(csObj[k])
        };
      } else {
        scripts[k] = {
          name: k,
          exists: false,
          raw: "",
          hasCrLf: false,
          readable: ""
        };
      }
    });

    // Check for any extra custom script strings inside clientscripts
    Object.keys(csObj).forEach(k => {
      if (!knownKeys.includes(k) && typeof csObj[k] === "string" && (k.toLowerCase().includes("script") || csObj[k].includes("\n") || csObj[k].includes(";"))) {
        scripts[k] = {
          name: k,
          exists: true,
          raw: csObj[k],
          hasCrLf: csObj[k].includes("\r\n"),
          readable: this.toReadableJs(csObj[k]),
          isCustom: true
        };
      }
    });

    return {
      path,
      targetObj: csObj,
      parentObj: parent,
      parentKey: key,
      scripts
    };
  },

  /**
   * Convert an escaped JavaScript string from JSON into clean, readable JS
   * Normalizes line breaks to '\n' for consistent editor handling
   */
  toReadableJs(raw) {
    if (typeof raw !== "string") return "";

    let processed = raw;

    // Check if the input is a raw JSON-escaped string with literal backslash-r and backslash-n
    // (e.g. if the user pasted a raw string literal like "debugger;\r\nconsole.log...")
    if (processed.startsWith('"') && processed.endsWith('"')) {
      try {
        processed = JSON.parse(processed);
      } catch (e) {
        // Fallback manual unescape
      }
    }

    if (processed.includes("\\r\\n") || processed.includes("\\n")) {
      processed = processed
        .replace(/\\r\\n/g, "\n")
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
    }

    // Normalize CRLF to LF for editing
    return processed.replace(/\r\n/g, "\n");
  },

  /**
   * Convert clean readable JS back to production JSON format with specified line endings
   * @param {string} cleanJs - The readable JS code
   * @param {string} lineEndingPreference - 'crlf', 'lf', or 'preserve'
   * @param {boolean} originalHadCrLf - Whether original script had \r\n
   */
  toSerializedJs(cleanJs, lineEndingPreference = "preserve", originalHadCrLf = true) {
    if (typeof cleanJs !== "string") return "";

    // Normalize first to LF
    let normalized = cleanJs.replace(/\r\n/g, "\n");

    const useCrLf =
      lineEndingPreference === "crlf" ||
      (lineEndingPreference === "preserve" && originalHadCrLf);

    if (useCrLf) {
      // Convert LF to CRLF (\r\n)
      normalized = normalized.replace(/\n/g, "\r\n");
    }

    return normalized;
  },

  /**
   * Generates the raw JSON-escaped string representation:
   * e.g. "debugger;\r\nconsole.info(\"model====>\", model);\r\n..."
   */
  toRawEscapedString(cleanJs, useCrLf = true) {
    const serialized = this.toSerializedJs(cleanJs, useCrLf ? "crlf" : "lf", useCrLf);
    return JSON.stringify(serialized);
  },

  /**
   * Updates a specific script in the JSON bundle and produces the updated JSON string
   */
  updateScript(rootObj, csPath, scriptKey, newCleanJs, options = {}) {
    const {
      lineEndingPreference = "preserve",
      indentation = 2,
      originalHadCrLf = true
    } = options;

    const normalizedScript = this.toSerializedJs(
      newCleanJs,
      lineEndingPreference,
      originalHadCrLf
    );

    // Deep clone to not mutate base unpredictably
    const cloned = JSON.parse(JSON.stringify(rootObj));

    // Find the target block in the cloned tree
    const foundBlocks = this.findAllClientScripts(cloned);
    const targetBlock = foundBlocks.find(b => b.path === csPath) || foundBlocks[0];

    if (!targetBlock) {
      throw new Error(`Could not locate clientscripts at path ${csPath}`);
    }

    // Set updated script
    targetBlock.targetObj[scriptKey] = normalizedScript;

    // Serialize with matching indentation
    const indent = typeof indentation === "string" ? indentation : (indentation || 2);
    const updatedJsonString = JSON.stringify(cloned, null, indent);

    return {
      updatedObj: cloned,
      updatedJsonString
    };
  }
};


/* --- js/diff-engine.js --- */
/**
 * Myers & Word-Level Diff Engine with Interactive Line-by-Line Merging
 * High-performance, side-by-side & unified diff calculation with character-level highlights
 * and fine-grained single-line merge operations.
 */

const DiffEngine = {
  /**
   * Main diff entry point
   * @param {string} textA - Original / Base text
   * @param {string} textB - Modified / Target text
   * @param {Object} options - { ignoreWhitespace: boolean }
   */
  computeDiff(textA = "", textB = "", options = {}) {
    const ignoreWs = !!options.ignoreWhitespace;

    const linesA = (textA || "").split(/\r?\n/);
    const linesB = (textB || "").split(/\r?\n/);

    // Compute Line-level diff using LCS
    const lineDiff = this.diffLines(linesA, linesB, ignoreWs);

    // Build aligned rows for side-by-side view with precise insertion indices
    const alignedRows = this.buildAlignedRows(lineDiff);

    // Detect modified pairs and compute intra-line word diffs
    this.computeIntraLineDiffs(alignedRows);

    // Compute diff hunks / change groups for jumping next/prev
    const hunks = this.buildHunks(alignedRows);

    // Statistics
    const stats = this.computeStats(alignedRows, linesA.length, linesB.length);

    return {
      linesA,
      linesB,
      alignedRows,
      hunks,
      stats,
      isIdentical: stats.addedLines === 0 && stats.deletedLines === 0 && stats.modifiedLines === 0
    };
  },

  /**
   * Line-level LCS (Longest Common Subsequence) diff
   */
  diffLines(linesA, linesB, ignoreWs) {
    const normalize = str => (ignoreWs ? str.trim().replace(/\s+/g, " ") : str);

    const n = linesA.length;
    const m = linesB.length;

    // Fast-path identical check
    if (n === m) {
      let identical = true;
      for (let i = 0; i < n; i++) {
        if (normalize(linesA[i]) !== normalize(linesB[i])) {
          identical = false;
          break;
        }
      }
      if (identical) {
        return linesA.map((line, idx) => ({
          type: "equal",
          valA: line,
          valB: linesB[idx],
          lineA: idx + 1,
          lineB: idx + 1
        }));
      }
    }

    const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));

    for (let i = 0; i < n; i++) {
      const a = normalize(linesA[i]);
      for (let j = 0; j < m; j++) {
        if (a === normalize(linesB[j])) {
          dp[i + 1][j + 1] = dp[i][j] + 1;
        } else {
          dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
      }
    }

    // Backtrack to build operations
    const ops = [];
    let i = n,
      j = m;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && normalize(linesA[i - 1]) === normalize(linesB[j - 1])) {
        ops.push({
          type: "equal",
          valA: linesA[i - 1],
          valB: linesB[j - 1],
          lineA: i,
          lineB: j
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        ops.push({
          type: "add",
          valB: linesB[j - 1],
          lineB: j
        });
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
        ops.push({
          type: "del",
          valA: linesA[i - 1],
          lineA: i
        });
        i--;
      }
    }

    return ops.reverse();
  },

  /**
   * Convert linear operations into aligned Left/Right row pairs with insertion index tracking
   */
  buildAlignedRows(ops) {
    const rows = [];
    let idx = 0;

    let leftCount = 0;
    let rightCount = 0;

    while (idx < ops.length) {
      const op = ops[idx];

      if (op.type === "equal") {
        rows.push({
          type: "equal",
          insertAfterLeftIndex: leftCount,
          insertAfterRightIndex: rightCount,
          left: { lineNum: op.lineA, text: op.valA, isPad: false },
          right: { lineNum: op.lineB, text: op.valB, isPad: false }
        });
        leftCount++;
        rightCount++;
        idx++;
      } else {
        const dels = [];
        const adds = [];

        while (idx < ops.length && (ops[idx].type === "del" || ops[idx].type === "add")) {
          if (ops[idx].type === "del") dels.push(ops[idx]);
          if (ops[idx].type === "add") adds.push(ops[idx]);
          idx++;
        }

        const maxLen = Math.max(dels.length, adds.length);

        for (let k = 0; k < maxLen; k++) {
          const d = dels[k];
          const a = adds[k];

          if (d && a) {
            rows.push({
              type: "modify",
              insertAfterLeftIndex: leftCount,
              insertAfterRightIndex: rightCount,
              left: { lineNum: d.lineA, text: d.valA, isPad: false },
              right: { lineNum: a.lineB, text: a.valB, isPad: false }
            });
            leftCount++;
            rightCount++;
          } else if (d) {
            rows.push({
              type: "delete",
              insertAfterLeftIndex: leftCount,
              insertAfterRightIndex: rightCount,
              left: { lineNum: d.lineA, text: d.valA, isPad: false },
              right: { lineNum: null, text: "", isPad: true }
            });
            leftCount++;
          } else if (a) {
            rows.push({
              type: "insert",
              insertAfterLeftIndex: leftCount,
              insertAfterRightIndex: rightCount,
              left: { lineNum: null, text: "", isPad: true },
              right: { lineNum: a.lineB, text: a.valB, isPad: false }
            });
            rightCount++;
          }
        }
      }
    }

    return rows;
  },

  /**
   * Detect modified rows and calculate character/word level diff
   */
  computeIntraLineDiffs(alignedRows) {
    for (const row of alignedRows) {
      if (row.type === "modify") {
        const wordDiff = this.diffWords(row.left.text, row.right.text);
        row.left.spans = wordDiff.leftSpans;
        row.right.spans = wordDiff.rightSpans;
      }
    }
  },

  /**
   * Word/token-level diffing between two lines
   */
  diffWords(strA, strB) {
    const tokenize = s => s.match(/([a-zA-Z0-9_$]+|[^\s\w]|\s+)/g) || [s];

    const tokensA = tokenize(strA);
    const tokensB = tokenize(strB);

    const n = tokensA.length;
    const m = tokensB.length;

    const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        if (tokensA[i] === tokensB[j]) {
          dp[i + 1][j + 1] = dp[i][j] + 1;
        } else {
          dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
      }
    }

    const leftSpans = [];
    const rightSpans = [];
    let i = n,
      j = m;

    const rawLeft = [];
    const rawRight = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && tokensA[i - 1] === tokensB[j - 1]) {
        rawLeft.push({ text: tokensA[i - 1], type: "equal" });
        rawRight.push({ text: tokensB[j - 1], type: "equal" });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        rawRight.push({ text: tokensB[j - 1], type: "ins" });
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
        rawLeft.push({ text: tokensA[i - 1], type: "del" });
        i--;
      }
    }

    rawLeft.reverse();
    rawRight.reverse();

    const mergeSpans = list => {
      const merged = [];
      for (const item of list) {
        if (merged.length > 0 && merged[merged.length - 1].type === item.type) {
          merged[merged.length - 1].text += item.text;
        } else {
          merged.push({ ...item });
        }
      }
      return merged;
    };

    return {
      leftSpans: mergeSpans(rawLeft),
      rightSpans: mergeSpans(rawRight)
    };
  },

  /**
   * Group contiguous change rows into hunks for quick navigation
   */
  buildHunks(alignedRows) {
    const hunks = [];
    let inHunk = false;
    let currentHunk = null;

    alignedRows.forEach((row, rowIndex) => {
      const isDiff = row.type !== "equal";

      if (isDiff && !inHunk) {
        inHunk = true;
        currentHunk = {
          startRow: rowIndex,
          endRow: rowIndex,
          types: new Set([row.type])
        };
      } else if (isDiff && inHunk) {
        currentHunk.endRow = rowIndex;
        currentHunk.types.add(row.type);
      } else if (!isDiff && inHunk) {
        inHunk = false;
        currentHunk.types = Array.from(currentHunk.types);
        hunks.push(currentHunk);
        currentHunk = null;
      }
    });

    if (inHunk && currentHunk) {
      currentHunk.types = Array.from(currentHunk.types);
      hunks.push(currentHunk);
    }

    return hunks;
  },

  /**
   * Calculate summary statistics
   */
  computeStats(alignedRows, leftTotal, rightTotal) {
    let added = 0;
    let deleted = 0;
    let modified = 0;
    let identical = 0;

    for (const row of alignedRows) {
      if (row.type === "insert") added++;
      else if (row.type === "delete") deleted++;
      else if (row.type === "modify") modified++;
      else if (row.type === "equal") identical++;
    }

    return {
      leftTotal,
      rightTotal,
      addedLines: added,
      deletedLines: deleted,
      modifiedLines: modified,
      identicalLines: identical,
      totalChanges: added + deleted + modified
    };
  },

  /**
   * Merge a single individual changed line between Left (Old) and Right (New)
   * @param {string} textLeft - Left code string
   * @param {string} textRight - Right code string
   * @param {Object} row - The specific aligned row being merged
   * @param {string} direction - 'to-left' (New -> Old) or 'to-right' (Old -> New)
   */
  mergeLine(textLeft, textRight, row, direction = "to-left") {
    const linesLeft = (textLeft || "").split(/\r?\n/);
    const linesRight = (textRight || "").split(/\r?\n/);

    if (direction === "to-left") {
      // Merge line from Right (New) into Left (Old)
      if (row.type === "modify") {
        const leftIdx = row.left.lineNum - 1;
        linesLeft[leftIdx] = row.right.text;
      } else if (row.type === "insert") {
        const insertIdx = row.insertAfterLeftIndex;
        linesLeft.splice(insertIdx, 0, row.right.text);
      } else if (row.type === "delete") {
        const leftIdx = row.left.lineNum - 1;
        linesLeft.splice(leftIdx, 1);
      }
    } else if (direction === "to-right") {
      // Merge line from Left (Old) into Right (New)
      if (row.type === "modify") {
        const rightIdx = row.right.lineNum - 1;
        linesRight[rightIdx] = row.left.text;
      } else if (row.type === "delete") {
        const insertIdx = row.insertAfterRightIndex;
        linesRight.splice(insertIdx, 0, row.left.text);
      } else if (row.type === "insert") {
        const rightIdx = row.right.lineNum - 1;
        linesRight.splice(rightIdx, 1);
      }
    }

    return {
      textLeft: linesLeft.join("\n"),
      textRight: linesRight.join("\n")
    };
  },

  /**
   * Merge all changes in bulk in the chosen direction
   */
  mergeAll(textLeft, textRight, direction = "to-left") {
    if (direction === "to-left") {
      // Make Left identical to Right
      return { textLeft: textRight, textRight: textRight };
    } else {
      // Make Right identical to Left
      return { textLeft: textLeft, textRight: textLeft };
    }
  }
};


/* --- js/diff-modal.js --- */
/**
 * Diff Modal Component with Interactive Line-by-Line Merging & Full IDE Code Editor
 * Features CodeMirror with JavaScript syntax highlighting, indentation, auto-closing brackets,
 * and seamless transitions back to the side-by-side diff & merge view.
 */







class DiffModal {
  constructor(options = {}) {
    this.container = null;
    this.isOpen = false;
    this.activeScriptKey = "prescript";
    this.activeBlockIndex = 0;
    this.viewMode = "split"; // 'split', 'unified', 'edit'
    this.editorSubMode = "js"; // 'js' or 'json'
    this.ignoreWhitespace = false;
    this.currentHunkIndex = 0;

    // Working state for both sides (allows merging into Old or New)
    this.leftBlocks = [];
    this.rightBlocks = [];
    this.modifiedLeftScripts = new Map();  // scriptKey -> editedReadableText (Old)
    this.modifiedRightScripts = new Map(); // scriptKey -> editedReadableText (New)
    this.mergeHistory = []; // Undo stack: [{ scriptKey, leftText, rightText }]
    this.cmModalInstance = null;
    this.modalMonacoInstance = null;
    this.currentEditorDiag = null;
    this.activeCmErrorLine = null;

    this.onApplyCallback = options.onApply || (() => {});
    this.onCloseCallback = options.onClose || (() => {});

    this.initDom();
  }

  initDom() {
    let modalEl = document.getElementById("diffModal");
    if (!modalEl) {
      modalEl = document.createElement("div");
      modalEl.id = "diffModal";
      modalEl.className = "modal-overlay hidden";
      modalEl.innerHTML = `
        <div class="modal-dialog">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="header-left">
              <div class="modal-title-group">
                <span class="modal-badge">Interactive Line-by-Line Merge</span>
                <h2 class="modal-title" id="modalTitle">Script Diff &amp; Merge Studio</h2>
              </div>
              <div class="block-selector-wrap" id="blockSelectorWrap">
                <label for="blockSelect">Location:</label>
                <select id="blockSelect" class="styled-select"></select>
              </div>
            </div>

            <!-- Script Tabs -->
            <div class="script-tabs-bar" id="scriptTabsBar">
              <!-- Dynamically populated: prescript, postscript, onSaveScript -->
            </div>

            <div class="header-right">
              <button class="btn-icon" id="btnToggleFullscreen" title="Toggle Fullscreen">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
              </button>
              <button class="btn-icon btn-close" id="btnCloseModal" title="Close Dialog (Esc)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          <!-- Toolbar -->
          <div class="modal-toolbar">
            <div class="toolbar-left">
              <!-- View Mode Toggle -->
              <div class="segmented-control">
                <button class="seg-btn active" data-mode="split" id="btnModeSplit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
                  Side-by-Side Merge
                </button>
                <button class="seg-btn" data-mode="unified" id="btnModeUnified">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
                  Unified Diff
                </button>
                <button class="seg-btn" data-mode="edit" id="btnModeEdit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  Live IDE Editor
                </button>
              </div>

              <!-- Line Merge Bulk Controls (Hidden in edit mode) -->
              <div class="bulk-merge-group" id="bulkMergeGroup">
                <button class="btn-merge-all" id="btnMergeAllToOld" title="Merge ALL remaining lines from New to Old version">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
                  Merge All (New ➔ Old)
                </button>
                <button class="btn-tool" id="btnUndoMerge" title="Undo last line merge (Ctrl+Z)" disabled>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
                  Undo
                </button>
              </div>

              <!-- Return to Diff Button (Visible only in edit mode) -->
              <div class="edit-return-group hidden" id="editReturnGroup">
                <button class="btn-return-diff-glow" id="btnToolbarReturnDiff">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  <span>◀ Back to Diff &amp; Merge State</span>
                </button>
              </div>

              <!-- Hunk Navigation (Split/Unified mode) -->
              <div class="hunk-nav" id="hunkNavGroup">
                <button class="btn-nav" id="btnPrevHunk" title="Previous Change (Alt+Up)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
                </button>
                <span class="hunk-status" id="hunkStatus">0 changes</span>
                <button class="btn-nav" id="btnNextHunk" title="Next Change (Alt+Down)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
              </div>

              <label class="toggle-label" id="lblIgnoreWs" title="Ignore differences in whitespace">
                <input type="checkbox" id="chkIgnoreWs">
                <span>Ignore Whitespace</span>
              </label>
            </div>

            <div class="toolbar-right">
              <button class="btn-tool" id="btnFormatJs" title="Format and indent readable JavaScript">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
                Format JS
              </button>
              <button class="btn-tool" id="btnCopyCleanJs" title="Copy clean readable JS to clipboard">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy Readable JS
              </button>
              <button class="btn-tool" id="btnResetScript" title="Reset both sides back to original JSON state">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Reset Script
              </button>
            </div>
          </div>

          <!-- Diff Body / Editor Container -->
          <div class="modal-body" id="modalDiffBody">
            <!-- Dynamically populated -->
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <div class="footer-left">
              <span class="status-indicator" id="footerScriptPath">Path: $.clientscripts.prescript</span>
              <span class="footer-divider">•</span>
              <span class="status-stats" id="footerDiffStats">0 additions, 0 deletions</span>
              <span class="footer-divider">•</span>
              <span class="merge-completion-badge" id="mergeCompletionBadge">Pending</span>
            </div>
            <div class="footer-right">
              <button class="btn-secondary" id="btnCancelModal">Close</button>
              <button class="btn-action-apply" id="btnApplyOldJson" title="Save merged changes into Base (Old) JSON">
                Apply to Base (Old) JSON
              </button>
              <button class="btn-action-apply" id="btnApplyNewJson" title="Save merged changes into Target (New) JSON">
                Apply to Target (New) JSON
              </button>
              <button class="btn-primary" id="btnApplyBothAndClose" title="Save merged script to BOTH JSONs and exit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                <span>Apply to Both JSONs &amp; Exit</span>
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modalEl);
    }
    this.container = modalEl;
    this.bindEvents();
  }

  bindEvents() {
    const el = this.container;

    // Close buttons
    el.querySelector("#btnCloseModal").addEventListener("click", () => this.close());
    el.querySelector("#btnCancelModal").addEventListener("click", () => this.close());

    // Fullscreen toggle
    el.querySelector("#btnToggleFullscreen").addEventListener("click", () => {
      el.querySelector(".modal-dialog").classList.toggle("fullscreen");
      if (this.cmModalInstance) {
        setTimeout(() => this.cmModalInstance.refresh(), 100);
      }
    });

    // View mode toggle
    const modeBtns = el.querySelectorAll(".seg-btn");
    modeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.switchViewMode(btn.dataset.mode);
      });
    });

    // Toolbar return to diff button
    el.querySelector("#btnToolbarReturnDiff")?.addEventListener("click", () => {
      this.switchViewMode("split");
    });

    // Ignore whitespace
    el.querySelector("#chkIgnoreWs").addEventListener("change", e => {
      this.ignoreWhitespace = e.target.checked;
      this.renderCurrentScript();
    });

    // Bulk Merge All to Old
    el.querySelector("#btnMergeAllToOld").addEventListener("click", () => this.mergeAllLines("to-left"));

    // Undo Merge
    el.querySelector("#btnUndoMerge").addEventListener("click", () => this.undoLastMerge());

    // Hunk navigation
    el.querySelector("#btnPrevHunk").addEventListener("click", () => this.jumpHunk(-1));
    el.querySelector("#btnNextHunk").addEventListener("click", () => this.jumpHunk(1));

    // Format JS
    el.querySelector("#btnFormatJs").addEventListener("click", () => this.formatCurrentScript());

    // Copy clean JS
    el.querySelector("#btnCopyCleanJs").addEventListener("click", () => this.copyCleanJs());

    // Reset script
    el.querySelector("#btnResetScript").addEventListener("click", () => this.resetCurrentScript());

    // Apply to Base (Old) JSON
    el.querySelector("#btnApplyOldJson").addEventListener("click", () => {
      this.applyMergedChanges("old");
      this.close();
    });

    // Apply to Target (New) JSON
    el.querySelector("#btnApplyNewJson").addEventListener("click", () => {
      this.applyMergedChanges("new");
      this.close();
    });

    // Apply to Both JSONs & Exit
    el.querySelector("#btnApplyBothAndClose").addEventListener("click", () => {
      this.applyMergedChanges("both");
      this.close();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", e => {
      if (!this.isOpen) return;

      if (e.key === "Escape") {
        this.close();
      } else if (e.altKey && e.key === "ArrowDown") {
        e.preventDefault();
        this.jumpHunk(1);
      } else if (e.altKey && e.key === "ArrowUp") {
        e.preventDefault();
        this.jumpHunk(-1);
      } else if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        if (this.viewMode !== "edit" && this.mergeHistory.length > 0) {
          e.preventDefault();
          this.undoLastMerge();
        }
      }
    });
  }

  switchViewMode(mode) {
    this.viewMode = mode;
    const modeBtns = this.container.querySelectorAll(".seg-btn");
    modeBtns.forEach(b => b.classList.toggle("active", b.dataset.mode === mode));

    // Toggle toolbar button groups based on mode
    const isEdit = mode === "edit";
    this.container.querySelector("#bulkMergeGroup")?.classList.toggle("hidden", isEdit);
    this.container.querySelector("#hunkNavGroup")?.classList.toggle("hidden", isEdit);
    this.container.querySelector("#lblIgnoreWs")?.classList.toggle("hidden", isEdit);
    this.container.querySelector("#editReturnGroup")?.classList.toggle("hidden", !isEdit);

    this.renderCurrentScript();
  }

  open(leftJsonObj, rightJsonObj, options = {}) {
    this.leftJsonObj = leftJsonObj;
    this.rightJsonObj = rightJsonObj;
    this.lineEndingPreference = options.lineEndingPreference || "preserve";

    this.leftBlocks = JsonEngine.findAllClientScripts(leftJsonObj);
    this.rightBlocks = JsonEngine.findAllClientScripts(rightJsonObj);

    if (this.leftBlocks.length === 0 && this.rightBlocks.length === 0) {
      alert("No 'clientscripts' blocks or scripts found in the provided JSONs!");
      return;
    }

    this.activeBlockIndex = 0;
    this.activeScriptKey = options.preferredScript || "prescript";
    this.modifiedLeftScripts.clear();
    this.modifiedRightScripts.clear();
    this.mergeHistory = [];

    this.renderBlockSelector();
    this.renderScriptTabs();
    this.switchViewMode(this.viewMode);

    this.container.classList.remove("hidden");
    this.isOpen = true;
    document.body.classList.add("modal-open");
  }

  close() {
    this.container.classList.add("hidden");
    this.isOpen = false;
    document.body.classList.remove("modal-open");
    this.onCloseCallback();
  }

  renderBlockSelector() {
    const wrap = this.container.querySelector("#blockSelectorWrap");
    const select = this.container.querySelector("#blockSelect");
    select.innerHTML = "";

    const maxBlocks = Math.max(this.leftBlocks.length, this.rightBlocks.length);

    if (maxBlocks <= 1) {
      wrap.style.display = "none";
      return;
    }

    wrap.style.display = "flex";
    for (let i = 0; i < maxBlocks; i++) {
      const pathLeft = this.leftBlocks[i]?.path || "";
      const pathRight = this.rightBlocks[i]?.path || "";
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${i + 1}: ${pathRight || pathLeft}`;
      select.appendChild(opt);
    }

    select.value = this.activeBlockIndex;
    select.onchange = e => {
      this.activeBlockIndex = parseInt(e.target.value, 10);
      this.renderScriptTabs();
      this.renderCurrentScript();
    };
  }

  renderScriptTabs() {
    const tabsBar = this.container.querySelector("#scriptTabsBar");
    tabsBar.innerHTML = "";

    const leftBlock = this.leftBlocks[this.activeBlockIndex] || this.leftBlocks[0];
    const rightBlock = this.rightBlocks[this.activeBlockIndex] || this.rightBlocks[0];

    const allKeys = new Set([
      ...Object.keys(leftBlock?.scripts || {}),
      ...Object.keys(rightBlock?.scripts || {})
    ]);

    // Only display tabs for scripts that actually exist in at least one block
    const existingKeys = Array.from(allKeys).filter(k => {
      const sL = leftBlock?.scripts?.[k];
      const sR = rightBlock?.scripts?.[k];
      return (sL && sL.exists) || (sR && sR.exists);
    });

    const displayKeys = existingKeys.length > 0 ? existingKeys : ["prescript", "postscript", "onSaveScript"];

    if (!displayKeys.includes(this.activeScriptKey)) {
      // Pick the first key that has content or diff
      const keyWithContent = displayKeys.find(k => {
        const leftScript = leftBlock?.scripts?.[k]?.readable || "";
        const rightScript = rightBlock?.scripts?.[k]?.readable || "";
        return leftScript || rightScript;
      });
      this.activeScriptKey = keyWithContent || displayKeys[0] || "prescript";
    }

    displayKeys.forEach(scriptKey => {
      const leftScript =
        this.modifiedLeftScripts.get(scriptKey) ??
        (leftBlock?.scripts?.[scriptKey]?.readable || "");

      const rightScript =
        this.modifiedRightScripts.get(scriptKey) ??
        (rightBlock?.scripts?.[scriptKey]?.readable || "");

      const isDiff = leftScript !== rightScript;
      const isModified = this.modifiedLeftScripts.has(scriptKey) || this.modifiedRightScripts.has(scriptKey);

      const tab = document.createElement("button");
      tab.className = `script-tab ${scriptKey === this.activeScriptKey ? "active" : ""}`;
      tab.dataset.script = scriptKey;

      let badgeHtml = "";
      if (isDiff) {
        badgeHtml = `<span class="tab-badge badge-diff">Diff</span>`;
      } else if (leftScript || rightScript) {
        badgeHtml = isModified
          ? `<span class="tab-badge badge-merged">✓ Merged</span>`
          : `<span class="tab-badge badge-same">Same</span>`;
      } else {
        badgeHtml = `<span class="tab-badge badge-empty">Empty</span>`;
      }

      tab.innerHTML = `
        <span class="tab-name">${scriptKey}</span>
        ${badgeHtml}
      `;

      tab.addEventListener("click", () => {
        this.activeScriptKey = scriptKey;
        this.renderScriptTabs();
        this.renderCurrentScript();
      });

      tabsBar.appendChild(tab);
    });
  }

  getCurrentScripts() {
    const leftBlock = this.leftBlocks[this.activeBlockIndex] || this.leftBlocks[0];
    const rightBlock = this.rightBlocks[this.activeBlockIndex] || this.rightBlocks[0];

    const leftText =
      this.modifiedLeftScripts.get(this.activeScriptKey) ??
      (leftBlock?.scripts?.[this.activeScriptKey]?.readable || "");

    const rightText =
      this.modifiedRightScripts.get(this.activeScriptKey) ??
      (rightBlock?.scripts?.[this.activeScriptKey]?.readable || "");

    const hadCrLf =
      rightBlock?.scripts?.[this.activeScriptKey]?.hasCrLf ??
      leftBlock?.scripts?.[this.activeScriptKey]?.hasCrLf ??
      true;

    const path = rightBlock?.path || leftBlock?.path || "$.clientscripts";

    return { leftText, rightText, hadCrLf, path };
  }

  renderCurrentScript() {
    const body = this.container.querySelector("#modalDiffBody");
    const { leftText, rightText, hadCrLf, path } = this.getCurrentScripts();

    const diff = DiffEngine.computeDiff(leftText, rightText, {
      ignoreWhitespace: this.ignoreWhitespace
    });
    this.currentDiff = diff;
    this.currentHunkIndex = 0;

    this.updateStatusInfo(diff, path, hadCrLf);

    const btnUndo = this.container.querySelector("#btnUndoMerge");
    if (btnUndo) {
      btnUndo.disabled = this.mergeHistory.length === 0;
    }

    if (this.viewMode === "split") {
      this.renderSplitView(body, diff, leftText, rightText);
    } else if (this.viewMode === "unified") {
      this.renderUnifiedView(body, diff);
    } else if (this.viewMode === "edit") {
      this.renderCodeMirrorEditor(body, leftText, rightText);
    }
  }

  updateStatusInfo(diff, path, hadCrLf) {
    const hunkStatus = this.container.querySelector("#hunkStatus");
    const footerPath = this.container.querySelector("#footerScriptPath");
    const footerStats = this.container.querySelector("#footerDiffStats");
    const completionBadge = this.container.querySelector("#mergeCompletionBadge");

    const changes = diff.stats.totalChanges;
    if (changes === 0) {
      hunkStatus.textContent = "100% Identical";
      completionBadge.className = "merge-completion-badge badge-complete";
      completionBadge.textContent = "✓ Fully Merged (Both sides match)";
    } else {
      hunkStatus.textContent = `${changes} changed line${changes === 1 ? "" : "s"} left`;
      completionBadge.className = "merge-completion-badge badge-pending";
      completionBadge.textContent = `${changes} differences to merge`;
    }

    footerPath.textContent = `Path: ${path}.${this.activeScriptKey}`;
    footerStats.innerHTML = `<span class="diff-add">+${diff.stats.addedLines}</span> <span class="diff-del">-${diff.stats.deletedLines}</span> <span class="diff-mod">~${diff.stats.modifiedLines}</span>`;
  }

  /**
   * Side-by-Side Split View with Line-by-Line Merging Controls
   */
  renderSplitView(container, diff, leftText, rightText) {
    const leftVal = Validator.validateJs(leftText);
    const rightVal = Validator.validateJs(rightText);

    container.innerHTML = `
      <div class="split-diff-container">
        <!-- Left Pane: Old (Base) -->
        <div class="diff-pane diff-pane-left">
          <div class="pane-header">
            <div class="pane-title-group">
              <span class="pane-title">Old / Base JSON Script</span>
              <span class="tag-role">Receiving Merged Lines</span>
              <span class="val-pill ${leftVal.valid ? "pill-valid" : "pill-error"}" title="${leftVal.valid ? "Valid JavaScript syntax" : this.escapeHtml(leftVal.fixSuggestion || leftVal.message)}">
                ${leftVal.valid ? "✓ Valid JS" : `✖ JS Error (L${leftVal.line})`}
              </span>
            </div>
            <span class="pane-lines">${diff.stats.leftTotal} lines</span>
          </div>
          <div class="diff-scroll" id="scrollLeft">
            <div class="diff-rows" id="rowsLeft">
              ${diff.alignedRows
                .map((row, idx) => {
                  const left = row.left;
                  if (left.isPad) {
                    return `<div class="diff-row row-pad" data-row="${idx}">
                      <div class="line-num pad"></div>
                      <div class="line-code pad">&nbsp;</div>
                    </div>`;
                  }
                  const rowClass = row.type === "delete" ? "row-del" : row.type === "modify" ? "row-mod" : "row-eq";
                  const codeHtml =
                    row.type === "modify" && left.spans
                      ? JsHighlighter.renderDiffSpans(left.spans, "modify")
                      : JsHighlighter.highlightLine(left.text);

                  return `<div class="diff-row ${rowClass}" data-row="${idx}">
                    <div class="line-num">${left.lineNum}</div>
                    <div class="line-code"><pre><code>${codeHtml}</code></pre></div>
                  </div>`;
                })
                .join("")}
            </div>
          </div>
        </div>

        <!-- Central Merge Gutter Column -->
        <div class="diff-merge-gutter">
          <div class="gutter-header">
            <span title="Click individual arrow on each changed line to merge it from New into Old">Merge Action</span>
          </div>
          <div class="diff-scroll gutter-scroll" id="scrollGutter">
            <div class="gutter-rows">
              ${diff.alignedRows
                .map((row, idx) => {
                  if (row.type === "equal") {
                    return `<div class="gutter-row gutter-eq" data-row="${idx}"></div>`;
                  }

                  let actionBtn = "";
                  if (row.type === "insert") {
                    actionBtn = `
                      <button class="btn-line-merge merge-add" data-row-idx="${idx}" title="Add this line into Old version">
                        <span class="merge-arrow">◀</span> Add line
                      </button>
                    `;
                  } else if (row.type === "modify") {
                    actionBtn = `
                      <button class="btn-line-merge merge-replace" data-row-idx="${idx}" title="Replace Old line with New line">
                        <span class="merge-arrow">◀</span> Use New
                      </button>
                    `;
                  } else if (row.type === "delete") {
                    actionBtn = `
                      <button class="btn-line-merge merge-del" data-row-idx="${idx}" title="Delete this line from Old version to match New">
                        <span class="merge-del-icon">✕</span> Remove
                      </button>
                    `;
                  }

                  return `<div class="gutter-row gutter-diff" data-row="${idx}">${actionBtn}</div>`;
                })
                .join("")}
            </div>
          </div>
        </div>

        <!-- Right Pane: New (Updated) -->
        <div class="diff-pane diff-pane-right">
          <div class="pane-header">
            <div class="pane-title-group">
              <span class="pane-title">New / Updated JSON Script</span>
              <span class="tag-role">Source of Changes</span>
              <span class="val-pill ${rightVal.valid ? "pill-valid" : "pill-error"}" title="${rightVal.valid ? "Valid JavaScript syntax" : this.escapeHtml(rightVal.fixSuggestion || rightVal.message)}">
                ${rightVal.valid ? "✓ Valid JS" : `✖ JS Error (L${rightVal.line})`}
              </span>
            </div>
            <div class="pane-actions">
              <span class="pane-lines">${diff.stats.rightTotal} lines</span>
              <button class="btn-micro" id="btnSwitchToEdit" title="Open in Full IDE Code Editor">✎ Open Code Editor</button>
            </div>
          </div>
          <div class="diff-scroll" id="scrollRight">
            <div class="diff-rows" id="rowsRight">
              ${diff.alignedRows
                .map((row, idx) => {
                  const right = row.right;
                  if (right.isPad) {
                    return `<div class="diff-row row-pad" data-row="${idx}">
                      <div class="line-num pad"></div>
                      <div class="line-code pad">&nbsp;</div>
                    </div>`;
                  }
                  const rowClass = row.type === "insert" ? "row-add" : row.type === "modify" ? "row-mod" : "row-eq";
                  const codeHtml =
                    row.type === "modify" && right.spans
                      ? JsHighlighter.renderDiffSpans(right.spans, "modify")
                      : JsHighlighter.highlightLine(right.text);

                  return `<div class="diff-row ${rowClass}" data-row="${idx}">
                    <div class="line-num">${right.lineNum}</div>
                    <div class="line-code"><pre><code>${codeHtml}</code></pre></div>
                  </div>`;
                })
                .join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    this.syncScrollThreeWay("scrollLeft", "scrollGutter", "scrollRight");

    container.querySelectorAll(".btn-line-merge").forEach(btn => {
      btn.addEventListener("click", () => {
        const rowIdx = parseInt(btn.dataset.rowIdx, 10);
        this.mergeSingleLine(rowIdx, "to-left");
      });
    });

    container.querySelector("#btnSwitchToEdit")?.addEventListener("click", () => {
      this.switchViewMode("edit");
    });
  }

  mergeSingleLine(rowIdx, direction = "to-left") {
    if (!this.currentDiff || !this.currentDiff.alignedRows[rowIdx]) return;

    const row = this.currentDiff.alignedRows[rowIdx];
    if (row.type === "equal") return;

    const { leftText, rightText } = this.getCurrentScripts();

    this.mergeHistory.push({
      scriptKey: this.activeScriptKey,
      leftText,
      rightText
    });

    const merged = DiffEngine.mergeLine(leftText, rightText, row, direction);

    this.modifiedLeftScripts.set(this.activeScriptKey, merged.textLeft);
    this.modifiedRightScripts.set(this.activeScriptKey, merged.textRight);

    this.renderScriptTabs();
    this.renderCurrentScript();

    const desc =
      row.type === "insert"
        ? `Added line "${this.truncate(row.right.text, 35)}"`
        : row.type === "modify"
        ? `Updated line with "${this.truncate(row.right.text, 35)}"`
        : `Removed deleted line`;

    this.showToast(`✓ Merged: ${desc}`);
  }

  mergeAllLines(direction = "to-left") {
    const { leftText, rightText } = this.getCurrentScripts();
    if (leftText === rightText) {
      this.showToast("Both sides are already 100% identical!");
      return;
    }

    this.mergeHistory.push({
      scriptKey: this.activeScriptKey,
      leftText,
      rightText
    });

    const merged = DiffEngine.mergeAll(leftText, rightText, direction);

    this.modifiedLeftScripts.set(this.activeScriptKey, merged.textLeft);
    this.modifiedRightScripts.set(this.activeScriptKey, merged.textRight);

    this.renderScriptTabs();
    this.renderCurrentScript();

    this.showToast("🎉 Merged ALL changed lines into Old version!");
  }

  undoLastMerge() {
    if (this.mergeHistory.length === 0) return;

    const lastState = this.mergeHistory.pop();
    this.modifiedLeftScripts.set(lastState.scriptKey, lastState.leftText);
    this.modifiedRightScripts.set(lastState.scriptKey, lastState.rightText);

    this.renderScriptTabs();
    this.renderCurrentScript();

    this.showToast("↺ Undid last merge step");
  }

  resetCurrentScript() {
    this.modifiedLeftScripts.delete(this.activeScriptKey);
    this.modifiedRightScripts.delete(this.activeScriptKey);
    this.mergeHistory = [];

    this.renderScriptTabs();
    this.renderCurrentScript();

    this.showToast(`↺ Reset ${this.activeScriptKey} to initial JSON state`);
  }

  renderUnifiedView(container, diff) {
    container.innerHTML = `
      <div class="unified-diff-container">
        <div class="diff-scroll" id="scrollUnified">
          <div class="diff-rows unified-rows">
            ${diff.alignedRows
              .map((row, idx) => {
                if (row.type === "equal") {
                  return `<div class="diff-row row-eq" data-row="${idx}">
                    <div class="line-num">${row.left.lineNum}</div>
                    <div class="line-num">${row.right.lineNum}</div>
                    <div class="diff-sign"> </div>
                    <div class="line-code"><pre><code>${JsHighlighter.highlightLine(row.left.text)}</code></pre></div>
                  </div>`;
                }

                let html = "";
                if (row.type === "delete" || row.type === "modify") {
                  const leftCode =
                    row.type === "modify" && row.left.spans
                      ? JsHighlighter.renderDiffSpans(row.left.spans, "del")
                      : JsHighlighter.highlightLine(row.left.text);

                  html += `<div class="diff-row row-del" data-row="${idx}">
                    <div class="line-num">${row.left.lineNum}</div>
                    <div class="line-num"></div>
                    <div class="diff-sign">-</div>
                    <div class="line-code"><pre><code>${leftCode}</code></pre></div>
                  </div>`;
                }

                if (row.type === "insert" || row.type === "modify") {
                  const rightCode =
                    row.type === "modify" && row.right.spans
                      ? JsHighlighter.renderDiffSpans(row.right.spans, "ins")
                      : JsHighlighter.highlightLine(row.right.text);

                  html += `<div class="diff-row row-add" data-row="${idx}">
                    <div class="line-num"></div>
                    <div class="line-num">${row.right.lineNum}</div>
                    <div class="diff-sign">+</div>
                    <div class="line-code"><pre><code>${rightCode}</code></pre></div>
                  </div>`;
                }

                return html;
              })
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Real IDE CodeMirror Editor View with Full JS Syntax, Indentation & Colors
   */
  renderCodeMirrorEditor(container, leftText, rightText) {
    const isJsMode = this.editorSubMode === "js";
    const initialCode = isJsMode ? rightText : JSON.stringify(this.rightJsonObj, null, 2);

    container.innerHTML = `
      <div class="live-ide-container">
        <!-- Editor Subnav with 'Back to Diff' and Mode Toggles -->
        <div class="editor-subnav">
          <div class="subnav-left">
            <button class="btn-return-diff" id="btnReturnToDiff">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              <span>◀ Done Editing &bull; Back to Diff State</span>
            </button>
            <div class="editor-type-pills">
              <button class="editor-type-btn ${isJsMode ? "active" : ""}" id="btnEditJsMode">
                JavaScript Script Editor (${this.activeScriptKey})
              </button>
              <button class="editor-type-btn ${!isJsMode ? "active" : ""}" id="btnEditJsonMode">
                Full JSON Bundle Editor
              </button>
            </div>
            <div class="editor-val-badge val-ok" id="editorValBadge" title="Click to view syntax diagnostics">
              ✓ Valid JavaScript
            </div>
          </div>
          <div class="subnav-right">
            <span class="editor-cursor-pos" id="editorCursorPos">Ln 1, Col 1</span>
            <button class="btn-tool" id="btnFormatEditorCode" title="Auto-indent and format code">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
              Auto-Format
            </button>
          </div>
        </div>

        <!-- Real-time Diagnostics Drawer -->
        <div class="editor-diagnostics-drawer hidden" id="editorDiagDrawer"></div>

        <!-- CodeMirror Mount Area -->
        <div class="codemirror-mount" id="modalCodeMirrorMount"></div>

        <!-- Editor Bottom Status Bar -->
        <div class="editor-bottom-bar">
          <div class="editor-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span><strong>VS Code Monaco IDE</strong>: Real IntelliSense, Code Folding, Minimap, Rainbow Brackets &amp; Command Palette (<strong>F1</strong> / <strong>Cmd+Shift+P</strong>).</span>
          </div>
          <button class="btn-done-review" id="btnBottomDoneReview">
            <span>✓ Done Editing ➔ Return to Diff</span>
          </button>
        </div>
      </div>
    `;

    const mountEl = container.querySelector("#modalCodeMirrorMount");

    // Live change sync & validation runner
    const runValidation = codeValue => {
      const val =
        codeValue !== undefined
          ? codeValue
          : this.modalMonacoInstance
          ? this.modalMonacoInstance.getValue()
          : this.cmModalInstance
          ? this.cmModalInstance.getValue()
          : "";

      if (this.editorSubMode === "js") {
        this.modifiedRightScripts.set(this.activeScriptKey, val);
        const diag = Validator.validateJs(val);
        this.updateEditorDiagnostics(diag);
      } else {
        try {
          this.rightJsonObj = JSON.parse(val);
          this.rightBlocks = JsonEngine.findAllClientScripts(this.rightJsonObj);
        } catch (e) {}
        const diag = Validator.validateJson(val);
        this.updateEditorDiagnostics(diag);
      }
    };

    // 1. Primary: Initialize VS Code Monaco Editor if loaded
    if (monacoManager && monacoManager.isReady) {
      mountEl.innerHTML = "";
      this.cmModalInstance = null;

      this.modalMonacoInstance = monacoManager.create(mountEl, {
        value: initialCode,
        language: isJsMode ? "javascript" : "json",
        tabSize: isJsMode ? 4 : 2,
        minimap: true
      });

      // Cursor position tracking
      this.modalMonacoInstance.onDidChangeCursorPosition(e => {
        const posEl = container.querySelector("#editorCursorPos");
        if (posEl) posEl.textContent = `Ln ${e.position.lineNumber}, Col ${e.position.column}`;
      });

      let debounceTimer = null;
      this.modalMonacoInstance.onDidChangeModelContent(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => runValidation(), 150);
      });

      setTimeout(() => {
        this.modalMonacoInstance.layout();
        runValidation();
      }, 60);
    }
    // 2. Fallback: Initialize CodeMirror if Monaco is not available
    else if (typeof CodeMirror !== "undefined") {
      this.modalMonacoInstance = null;
      this.cmModalInstance = CodeMirror(mountEl, {
        value: initialCode,
        mode: isJsMode ? "javascript" : { name: "javascript", json: true },
        theme: "material-darker",
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        lineWrapping: false
      });

      // Cursor position tracking
      this.cmModalInstance.on("cursorActivity", () => {
        const pos = this.cmModalInstance.getCursor();
        const posEl = container.querySelector("#editorCursorPos");
        if (posEl) posEl.textContent = `Ln ${pos.line + 1}, Col ${pos.ch + 1}`;
      });

      let debounceTimer = null;
      this.cmModalInstance.on("change", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => runValidation(), 150);
      });

      setTimeout(() => {
        this.cmModalInstance.refresh();
        runValidation();
      }, 60);
    } else {
      // Fallback textarea if no editor scripts are loaded
      mountEl.innerHTML = `<textarea class="code-textarea" id="scriptTextarea" style="width:100%;height:100%;">${initialCode}</textarea>`;
      const ta = mountEl.querySelector("#scriptTextarea");
      ta.addEventListener("input", () => {
        this.modifiedRightScripts.set(this.activeScriptKey, ta.value);
      });
    }

    // Return to Diff actions with syntax check warning
    const returnToDiffHandler = () => {
      if (this.currentEditorDiag && !this.currentEditorDiag.valid) {
        const proceed = window.confirm(
          `⚠️ JavaScript Syntax Warning:\n` +
          `Your edited script contains a syntax error at Line ${this.currentEditorDiag.line || 1}, Col ${this.currentEditorDiag.column || 1}:\n` +
          `"${this.currentEditorDiag.message}"\n\n` +
          `Fix suggestion: ${this.currentEditorDiag.fixSuggestion || "Please fix syntax before committing."}\n\n` +
          `Do you want to proceed back to Diff state anyway?`
        );
        if (!proceed) {
          this.jumpToErrorInEditor(this.currentEditorDiag.line, this.currentEditorDiag.column);
          return;
        }
      }
      this.switchViewMode("split");
      this.showToast("Returned to Diff & Merge state with your edits!");
    };

    container.querySelector("#btnReturnToDiff")?.addEventListener("click", returnToDiffHandler);
    container.querySelector("#btnBottomDoneReview")?.addEventListener("click", returnToDiffHandler);

    // Switch between JS mode and JSON mode
    container.querySelector("#btnEditJsMode")?.addEventListener("click", () => {
      if (this.editorSubMode !== "js") {
        this.editorSubMode = "js";
        this.renderCurrentScript();
      }
    });

    container.querySelector("#btnEditJsonMode")?.addEventListener("click", () => {
      if (this.editorSubMode !== "json") {
        this.editorSubMode = "json";
        this.renderCurrentScript();
      }
    });

    // Auto-Format within editor
    container.querySelector("#btnFormatEditorCode")?.addEventListener("click", () => {
      if (this.modalMonacoInstance) {
        this.modalMonacoInstance.getAction("editor.action.formatDocument")?.run();
        this.showToast("⚡ Formatted code with VS Code Monaco engine!");
        return;
      }
      if (!this.cmModalInstance) return;
      const val = this.cmModalInstance.getValue();
      let formatted = "";
      if (this.editorSubMode === "js") {
        formatted = JsBeautifier.beautify(val, 4);
      } else {
        try {
          formatted = JSON.stringify(JSON.parse(val), null, 2);
        } catch (e) {
          formatted = val;
        }
      }
      this.cmModalInstance.setValue(formatted);
      this.showToast("⚡ Formatted code in editor!");
    });
  }

  syncScrollThreeWay(idA, idB, idC) {
    const elA = this.container.querySelector(`#${idA}`);
    const elB = this.container.querySelector(`#${idB}`);
    const elC = this.container.querySelector(`#${idC}`);
    if (!elA || !elB || !elC) return;

    let isSyncing = false;
    const sync = source => {
      if (!isSyncing) {
        isSyncing = true;
        const top = source.scrollTop;
        if (source !== elA) elA.scrollTop = top;
        if (source !== elB) elB.scrollTop = top;
        if (source !== elC) elC.scrollTop = top;
        requestAnimationFrame(() => (isSyncing = false));
      }
    };

    elA.addEventListener("scroll", () => sync(elA));
    elB.addEventListener("scroll", () => sync(elB));
    elC.addEventListener("scroll", () => sync(elC));
  }

  jumpHunk(direction = 1) {
    if (!this.currentDiff || !this.currentDiff.hunks.length) return;

    this.currentHunkIndex += direction;
    if (this.currentHunkIndex >= this.currentDiff.hunks.length) {
      this.currentHunkIndex = 0;
    } else if (this.currentHunkIndex < 0) {
      this.currentHunkIndex = this.currentDiff.hunks.length - 1;
    }

    const hunk = this.currentDiff.hunks[this.currentHunkIndex];
    const targetRow = this.container.querySelector(`.diff-row[data-row="${hunk.startRow}"]`);
    if (targetRow) {
      targetRow.scrollIntoView({ behavior: "smooth", block: "center" });
      targetRow.classList.add("row-highlight-flash");
      setTimeout(() => targetRow.classList.remove("row-highlight-flash"), 1200);
    }

    const statusEl = this.container.querySelector("#hunkStatus");
    if (statusEl) {
      statusEl.textContent = `Hunk ${this.currentHunkIndex + 1} of ${this.currentDiff.hunks.length}`;
    }
  }

  formatCurrentScript() {
    const { leftText, rightText } = this.getCurrentScripts();
    const formattedLeft = JsBeautifier.beautify(leftText, 4);
    const formattedRight = JsBeautifier.beautify(rightText, 4);

    this.modifiedLeftScripts.set(this.activeScriptKey, formattedLeft);
    this.modifiedRightScripts.set(this.activeScriptKey, formattedRight);

    this.renderScriptTabs();
    this.renderCurrentScript();

    this.showToast(`✨ Formatted ${this.activeScriptKey} on both sides with clean 4-space indentation!`);
  }

  copyCleanJs() {
    const { leftText } = this.getCurrentScripts();
    navigator.clipboard.writeText(leftText).then(() => {
      this.showToast(`📋 Copied merged readable ${this.activeScriptKey} to clipboard!`);
    });
  }

  applyMergedChanges(target = "both") {
    let baseObj = this.leftJsonObj;
    let targetObj = this.rightJsonObj;

    const leftBlock = this.leftBlocks[this.activeBlockIndex] || this.leftBlocks[0];
    const rightBlock = this.rightBlocks[this.activeBlockIndex] || this.rightBlocks[0];

    const allKeys = new Set([
      ...this.modifiedLeftScripts.keys(),
      ...this.modifiedRightScripts.keys()
    ]);

    if (allKeys.size === 0) {
      allKeys.add(this.activeScriptKey);
    }

    for (const scriptKey of allKeys) {
      const mergedCleanJs =
        this.modifiedLeftScripts.get(scriptKey) ??
        this.modifiedRightScripts.get(scriptKey) ??
        (leftBlock?.scripts?.[scriptKey]?.readable || "");

      // Pre-apply JavaScript syntax safety check
      if (mergedCleanJs && mergedCleanJs.trim()) {
        const diag = Validator.validateJs(mergedCleanJs);
        if (!diag.valid) {
          const proceed = window.confirm(
            `⚠️ JavaScript Syntax Alert:\n` +
            `Script '${scriptKey}' contains a syntax error at Line ${diag.line || 1}, Col ${diag.column || 1} (${diag.errorTitle || "Syntax Error"}):\n` +
            `"${diag.message}"\n\n` +
            `How to fix: ${diag.fixSuggestion || "Correct the syntax at the highlighted line."}\n\n` +
            `Saving broken code may cause runtime failures in production. Do you want to apply anyway?`
          );
          if (!proceed) return;
        }
      }

      if (target === "old" || target === "both") {
        if (leftBlock) {
          const originalHadCrLf = leftBlock.scripts[scriptKey]?.hasCrLf ?? true;
          const res = JsonEngine.updateScript(baseObj, leftBlock.path, scriptKey, mergedCleanJs, {
            lineEndingPreference: this.lineEndingPreference,
            indentation: 2,
            originalHadCrLf
          });
          baseObj = res.updatedObj;
        }
      }

      if (target === "new" || target === "both") {
        if (rightBlock) {
          const originalHadCrLf = rightBlock.scripts[scriptKey]?.hasCrLf ?? true;
          const res = JsonEngine.updateScript(targetObj, rightBlock.path, scriptKey, mergedCleanJs, {
            lineEndingPreference: this.lineEndingPreference,
            indentation: 2,
            originalHadCrLf
          });
          targetObj = res.updatedObj;
        }
      }
    }

    this.onApplyCallback({
      baseObj: (target === "old" || target === "both") ? baseObj : null,
      targetObj: (target === "new" || target === "both") ? targetObj : null
    });

    const targetLabel = target === "both" ? "both Base & Target JSONs" : target === "old" ? "Base (Old) JSON" : "Target (New) JSON";
    this.showToast(`💾 Applied merged changes to ${targetLabel} ready for prod commit!`);
  }

  updateEditorDiagnostics(diag) {
    this.currentEditorDiag = diag;
    const badge = this.container.querySelector("#editorValBadge");
    const drawer = this.container.querySelector("#editorDiagDrawer");

    if (this.activeCmErrorLine !== null && this.cmModalInstance) {
      this.cmModalInstance.removeLineClass(this.activeCmErrorLine, "background", "cm-val-error-line");
      this.activeCmErrorLine = null;
    }

    // Synchronize VS Code Monaco error markers and minimap decorations
    if (this.modalMonacoInstance && typeof monaco !== "undefined" && monaco.editor) {
      const model = this.modalMonacoInstance.getModel();
      if (model) {
        if (diag.valid) {
          monaco.editor.setModelMarkers(model, "syntax-validator", []);
        } else {
          const errLine = Math.max(1, diag.line || 1);
          const errCol = Math.max(1, diag.column || 1);
          const lineContent = model.getLineContent(errLine) || "";
          monaco.editor.setModelMarkers(model, "syntax-validator", [
            {
              startLineNumber: errLine,
              startColumn: errCol,
              endLineNumber: errLine,
              endColumn: Math.max(errCol + 1, lineContent.length + 1),
              message: `${diag.errorTitle || "Syntax Error"}: ${diag.message}`,
              severity: monaco.MarkerSeverity.Error
            }
          ]);
        }
      }
    }

    if (!badge || !drawer) return;

    if (diag.valid) {
      badge.className = "editor-val-badge val-ok";
      badge.innerHTML = `✓ Valid ${this.editorSubMode === "js" ? "JavaScript" : "JSON"} (0 errors)`;
      drawer.classList.add("hidden");
      drawer.innerHTML = "";
    } else {
      badge.className = "editor-val-badge val-err";
      badge.innerHTML = `✖ Line ${diag.line || 1}, Col ${diag.column || 1}: ${this.escapeHtml(diag.errorTitle || "Syntax Error")}`;

      const snippetHtml = diag.snippet
        ? `
        <div class="diag-drawer-snippet">
          ${diag.snippet.lines
            .map(
              l => `
            <div class="val-snippet-line ${l.isError ? "val-error-line" : ""}">
              <span class="val-line-no">${l.lineNum}</span>
              <span class="val-line-code">${this.escapeHtml(l.text)}</span>
            </div>
          `
            )
            .join("")}
          <div class="val-pointer-line">
            <span class="val-line-no"></span>
            <span class="val-pointer">${this.escapeHtml(diag.snippet.pointer)}--- Error here</span>
          </div>
        </div>
      `
        : "";

      drawer.innerHTML = `
        <div class="diag-drawer-header">
          <div class="diag-drawer-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <span>${this.escapeHtml(diag.errorTitle || "Syntax Error")} (Line ${diag.line || 1}, Column ${diag.column || 1})</span>
          </div>
          <div class="diag-drawer-actions">
            <button class="btn-diag-jump" id="btnModalJumpError">
              Jump to Line ${diag.line || 1}
            </button>
          </div>
        </div>
        <div class="diag-drawer-content">
          ${snippetHtml}
          <div class="diag-drawer-advice">
            <div class="diag-advice-why">
              <strong>Why:</strong> ${this.escapeHtml(diag.explanation || diag.message)}
            </div>
            <div class="diag-advice-fix">
              <strong>How to fix:</strong> ${this.escapeHtml(diag.fixSuggestion || "Fix the syntax at the highlighted line.")}
            </div>
          </div>
        </div>
      `;

      drawer.classList.remove("hidden");

      // Highlight error line in CodeMirror
      if (this.cmModalInstance && diag.line) {
        this.activeCmErrorLine = diag.line - 1;
        this.cmModalInstance.addLineClass(this.activeCmErrorLine, "background", "cm-val-error-line");
      }

      // Jump button in drawer & badge click
      drawer.querySelector("#btnModalJumpError")?.addEventListener("click", () => {
        this.jumpToErrorInEditor(diag.line, diag.column);
      });
      badge.onclick = () => {
        this.jumpToErrorInEditor(diag.line, diag.column);
      };
    }
  }

  jumpToErrorInEditor(line = 1, col = 1) {
    if (this.modalMonacoInstance) {
      this.modalMonacoInstance.revealLineInCenter(line);
      this.modalMonacoInstance.setPosition({ lineNumber: line, column: col });
      this.modalMonacoInstance.focus();
      return;
    }
    if (this.cmModalInstance) {
      this.cmModalInstance.setCursor({ line: Math.max(0, line - 1), ch: Math.max(0, col - 1) });
      this.cmModalInstance.scrollIntoView({ line: Math.max(0, line - 1), ch: Math.max(0, col - 1) }, 100);
      this.cmModalInstance.focus();
    }
  }

  escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  truncate(str = "", maxLen = 35) {
    const trimmed = (str || "").trim();
    return trimmed.length > maxLen ? trimmed.slice(0, maxLen) + "…" : trimmed;
  }

  showToast(message) {
    let toast = document.getElementById("diffToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "diffToast";
      toast.className = "toast-message";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("visible");
    setTimeout(() => toast.classList.remove("visible"), 3200);
  }
}


/* --- js/app.js --- */
/**
 * Main Application Orchestrator for InoJson Script Compare & Diff
 * Features CodeMirror JSON editing on both panels, deep JSON & JavaScript validation,
 * actionable error diagnostics, intelligent auto-fix, and integration with DiffModal.
 */






class InoJsonApp {
  constructor() {
    this.leftTextarea = document.getElementById("leftJsonInput");
    this.rightTextarea = document.getElementById("rightJsonInput");
    this.cmLeftMount = document.getElementById("cmLeftMount");
    this.cmRightMount = document.getElementById("cmRightMount");
    this.leftStatusEl = document.getElementById("leftStatus");
    this.rightStatusEl = document.getElementById("rightStatus");
    this.leftScriptsListEl = document.getElementById("leftScriptsList");
    this.rightScriptsListEl = document.getElementById("rightScriptsList");
    this.leftValidationPanel = document.getElementById("leftValidationPanel");
    this.rightValidationPanel = document.getElementById("rightValidationPanel");
    this.compareSummaryEl = document.getElementById("compareSummary");
    this.btnOpenDiffModal = document.getElementById("btnOpenDiffModal");

    // Quick Converter elements
    this.cmCleanJsMount = document.getElementById("cmCleanJsMount");
    this.convCleanValPanel = document.getElementById("convCleanValPanel");

    this.monacoLeft = null;
    this.monacoRight = null;
    this.monacoCleanJs = null;
    this.cmLeft = null;
    this.cmRight = null;
    this.cmCleanJs = null;
    this.activeLeftErrorLine = null;
    this.activeRightErrorLine = null;
    this.activeCleanJsErrorLine = null;
    this.leftParsed = null;
    this.rightParsed = null;
    this.leftReport = null;
    this.rightReport = null;
    this.lineEndingPreference = "crlf";

    // Initialize Diff Modal with two-way merge support and full code editor
    this.diffModal = new DiffModal({
      monacoManager,
      onApply: ({ baseObj, targetObj }) => {
        if (baseObj) {
          const str = JSON.stringify(baseObj, null, 2);
          this.setLeftJson(str);
        }
        if (targetObj) {
          const str = JSON.stringify(targetObj, null, 2);
          this.setRightJson(str);
        }
        this.analyzeInputs();
        this.showToast("💾 Updated JSON bundle(s) with merged production script!");
      }
    });

    this.init();
  }

  init() {
    this.initCodeMirrorPanels();
    this.initMonacoPanels();
    this.bindEvents();
    this.bindFileUploads();
    this.bindValidationActions();
    this.bindQuickConverter();

    // Start with clean inputs — analyze initial state without injecting sample data
    this.analyzeInputs();
  }

  initMonacoPanels() {
    monacoManager.onReady(() => {
      const leftVal = this.getLeftText();
      const rightVal = this.getRightText();

      // Clear CodeMirror mount elements for Monaco replacement
      this.cmLeftMount.innerHTML = "";
      this.cmRightMount.innerHTML = "";
      this.cmLeft = null;
      this.cmRight = null;

      let debounceTimer = null;
      const onChange = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.leftTextarea.value = this.getLeftText();
          this.rightTextarea.value = this.getRightText();
          this.analyzeInputs();
        }, 200);
      };

      this.monacoLeft = monacoManager.create(this.cmLeftMount, {
        value: leftVal,
        language: "json",
        tabSize: 2,
        minimap: true,
        onChange
      });

      this.monacoRight = monacoManager.create(this.cmRightMount, {
        value: rightVal,
        language: "json",
        tabSize: 2,
        minimap: true,
        onChange
      });

      this.analyzeInputs();
      this.showToast("⚡ Activated VS Code Monaco Editor (IntelliSense, Minimap & Folding enabled)!");
    });
  }

  initCodeMirrorPanels() {
    if (typeof CodeMirror !== "undefined" && this.cmLeftMount && this.cmRightMount) {
      const cmJsonOpts = {
        value: "",
        mode: { name: "javascript", json: true },
        theme: "material-darker",
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        tabSize: 2,
        indentUnit: 2,
        lineWrapping: false,
        // Fold support
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys: {
          "Ctrl-Q": cm => cm.foldCode(cm.getCursor()),
          "Ctrl-F": "findPersistent",
          "Ctrl-G": "jumpToLine"
        }
      };

      this.cmLeft = CodeMirror(this.cmLeftMount, { ...cmJsonOpts });
      this.cmRight = CodeMirror(this.cmRightMount, { ...cmJsonOpts });

      let debounceTimer = null;
      const onChange = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.leftTextarea.value = this.cmLeft.getValue();
          this.rightTextarea.value = this.cmRight.getValue();
          this.analyzeInputs();
        }, 300);
      };

      this.cmLeft.on("change", onChange);
      this.cmRight.on("change", onChange);

      // Instant validation on paste (fires after content is inserted)
      this.cmLeft.on("inputRead", (cm, change) => {
        if (change.origin === "paste") {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            this.leftTextarea.value = this.cmLeft.getValue();
            this.rightTextarea.value = this.cmRight.getValue();
            this.analyzeInputs();
          }, 50);
        }
      });
      this.cmRight.on("inputRead", (cm, change) => {
        if (change.origin === "paste") {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            this.leftTextarea.value = this.cmLeft.getValue();
            this.rightTextarea.value = this.cmRight.getValue();
            this.analyzeInputs();
          }, 50);
        }
      });

      // Dedicated JavaScript Code Editor for Quick Snippet Converter
      if (this.cmCleanJsMount) {
        this.cmCleanJs = CodeMirror(this.cmCleanJsMount, {
          value: "",
          mode: "javascript",
          theme: "material-darker",
          lineNumbers: true,
          matchBrackets: true,
          autoCloseBrackets: true,
          styleActiveLine: true,
          tabSize: 4,
          indentUnit: 4,
          lineWrapping: false,
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          extraKeys: {
            "Ctrl-Q": cm => cm.foldCode(cm.getCursor()),
            "Ctrl-F": "findPersistent",
            "Ctrl-G": "jumpToLine"
          }
        });
      }
    } else {
      // Fallback: show raw textareas
      if (this.leftTextarea) this.leftTextarea.classList.remove("hidden");
      if (this.rightTextarea) this.rightTextarea.classList.remove("hidden");
      if (this.cmLeftMount) this.cmLeftMount.style.display = "none";
      if (this.cmRightMount) this.cmRightMount.style.display = "none";
    }
  }

  getLeftText() {
    if (this.monacoLeft) return this.monacoLeft.getValue();
    return this.cmLeft ? this.cmLeft.getValue() : this.leftTextarea.value;
  }

  getRightText() {
    if (this.monacoRight) return this.monacoRight.getValue();
    return this.cmRight ? this.cmRight.getValue() : this.rightTextarea.value;
  }

  setLeftJson(text) {
    if (this.monacoLeft) {
      this.monacoLeft.setValue(text);
    }
    if (this.cmLeft) {
      this.cmLeft.setValue(text);
    }
    this.leftTextarea.value = text;
  }

  setRightJson(text) {
    if (this.monacoRight) {
      this.monacoRight.setValue(text);
    }
    if (this.cmRight) {
      this.cmRight.setValue(text);
    }
    this.rightTextarea.value = text;
  }

  bindEvents() {
    // Textarea input handlers (if fallback active)
    let debounceTimer = null;
    const onInput = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => this.analyzeInputs(), 300);
    };

    this.leftTextarea.addEventListener("input", onInput);
    this.rightTextarea.addEventListener("input", onInput);

    // Open Diff Dialog CTA button
    this.btnOpenDiffModal.addEventListener("click", () => {
      this.openDiffDialog();
    });

    // Sample data button
    document.getElementById("btnLoadSample")?.addEventListener("click", () => {
      this.loadSampleData();
      this.showToast("🚀 Loaded realistic sample low-code bundles!");
    });

    // Clear all button
    document.getElementById("btnClearAll")?.addEventListener("click", () => {
      this.setLeftJson("");
      this.setRightJson("");
      this.analyzeInputs();
      this.showToast("Cleared both JSON inputs");
    });

    // Swap Left & Right button
    document.getElementById("btnSwap")?.addEventListener("click", () => {
      const temp = this.getLeftText();
      this.setLeftJson(this.getRightText());
      this.setRightJson(temp);
      this.analyzeInputs();
      this.showToast("🔄 Swapped Left and Right JSONs");
    });

    // Copy Left (Base) JSON
    document.getElementById("btnCopyLeftJson")?.addEventListener("click", () => {
      navigator.clipboard.writeText(this.getLeftText()).then(() => {
        this.showToast("📋 Copied Base (Old) JSON to clipboard!");
      });
    });

    // Download Left (Base) JSON
    document.getElementById("btnDownloadLeftJson")?.addEventListener("click", () => {
      this.downloadJsonFile(this.getLeftText(), "bundle_base_merged.json");
    });

    // Copy Right (Target) JSON
    document.getElementById("btnCopyRightJson")?.addEventListener("click", () => {
      navigator.clipboard.writeText(this.getRightText()).then(() => {
        this.showToast("📋 Copied Target (New) JSON to clipboard!");
      });
    });

    // Download Right (Target) JSON
    document.getElementById("btnDownloadRightJson")?.addEventListener("click", () => {
      this.downloadJsonFile(this.getRightText(), "bundle_target_updated.json");
    });

    // Line ending preference change
    const lineEndingSelect = document.getElementById("selLineEnding");
    if (lineEndingSelect) {
      lineEndingSelect.addEventListener("change", e => {
        this.lineEndingPreference = e.target.value;
      });
    }

    // ── Fold All / Unfold All / Search buttons ──────────────────────────
    const bindEditorToolbar = (foldId, unfoldId, searchId, getMonaco, getCm) => {
      document.getElementById(foldId)?.addEventListener("click", () => {
        const m = getMonaco();
        const cm = getCm();
        if (m) {
          m.trigger("fold", "editor.foldAll", null);
        } else if (cm && cm.execCommand) {
          // CodeMirror foldAll command (requires foldcode + brace-fold addon)
          if (CodeMirror.commands.foldAll) {
            cm.execCommand("foldAll");
          } else {
            // Manual fallback: fold every line that has a fold region
            for (let i = 0; i < cm.lineCount(); i++) {
              cm.foldCode({ line: i, ch: 0 });
            }
          }
        }
      });
      document.getElementById(unfoldId)?.addEventListener("click", () => {
        const m = getMonaco();
        const cm = getCm();
        if (m) {
          m.trigger("unfold", "editor.unfoldAll", null);
        } else if (cm && cm.execCommand) {
          if (CodeMirror.commands.unfoldAll) {
            cm.execCommand("unfoldAll");
          } else {
            // Manual fallback: unfold every line
            for (let i = 0; i < cm.lineCount(); i++) {
              const mark = cm.findMarksAt({ line: i, ch: 0 }).find(m => m.__isFold);
              if (mark) mark.clear();
            }
            cm.operation(() => {
              cm.getAllMarks().filter(m => m.__isFold).forEach(m => m.clear());
            });
          }
        }
      });
      document.getElementById(searchId)?.addEventListener("click", () => {
        const m = getMonaco();
        const cm = getCm();
        if (m) {
          m.trigger("find", "actions.find", null);
        } else if (cm) {
          if (CodeMirror.commands.findPersistent) {
            CodeMirror.commands.findPersistent(cm);
          } else if (CodeMirror.commands.find) {
            CodeMirror.commands.find(cm);
          }
          cm.focus();
        }
      });
    };

    bindEditorToolbar(
      "btnFoldAllLeft", "btnUnfoldAllLeft", "btnSearchLeft",
      () => this.monacoLeft, () => this.cmLeft
    );
    bindEditorToolbar(
      "btnFoldAllRight", "btnUnfoldAllRight", "btnSearchRight",
      () => this.monacoRight, () => this.cmRight
    );

    // App Navigation tabs
    const navTabs = document.querySelectorAll(".nav-tab");
    navTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        navTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const targetView = tab.dataset.view;
        document.querySelectorAll(".view-section").forEach(sec => {
          sec.classList.toggle("hidden", sec.id !== targetView);
        });

        if (targetView === "viewBundleComparator" && this.cmLeft && this.cmRight) {
          setTimeout(() => {
            this.cmLeft.refresh();
            this.cmRight.refresh();
          }, 50);
        } else if (targetView === "viewQuickConverter" && this.cmCleanJs) {
          setTimeout(() => {
            this.cmCleanJs.refresh();
          }, 50);
        }
      });
    });
  }

  bindFileUploads() {
    this.setupDropZone("dropZoneLeft", "fileInputLeft", text => {
      this.setLeftJson(text);
      this.analyzeInputs();
      this.showToast("Uploaded Base JSON");
    });

    this.setupDropZone("dropZoneRight", "fileInputRight", text => {
      this.setRightJson(text);
      this.analyzeInputs();
      this.showToast("Uploaded Target JSON");
    });
  }

  setupDropZone(dropZoneId, fileInputId, onContentRead) {
    const dropZone = document.getElementById(dropZoneId);
    const fileInput = document.getElementById(fileInputId);
    if (!dropZone || !fileInput) return;

    dropZone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => onContentRead(ev.target.result);
      reader.readAsText(file);
    });

    dropZone.addEventListener("dragover", e => {
      e.preventDefault();
      dropZone.classList.add("drag-hover");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("drag-hover");
    });

    dropZone.addEventListener("drop", e => {
      e.preventDefault();
      dropZone.classList.remove("drag-hover");
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => onContentRead(ev.target.result);
      reader.readAsText(file);
    });
  }

  loadSampleData() {
    const baseStr = JSON.stringify(SAMPLE_BASE_JSON, null, 2);
    const targetStr = JSON.stringify(SAMPLE_TARGET_JSON, null, 2);
    this.setLeftJson(baseStr);
    this.setRightJson(targetStr);
    this.analyzeInputs();
  }

  analyzeInputs() {
    const leftText = this.getLeftText().trim();
    const rightText = this.getRightText().trim();

    // 1. Run deep bundle validation (JSON structure + embedded client scripts)
    this.leftReport = Validator.validateBundle(leftText, JsonEngine);
    this.rightReport = Validator.validateBundle(rightText, JsonEngine);

    // 2. Render dedicated Validation Diagnostics Panels
    this.renderValidationPanel("left", this.leftReport, leftText);
    this.renderValidationPanel("right", this.rightReport, rightText);

    // 3. Update top status tags
    this.updateStatusBadge(this.leftStatusEl, this.leftReport, leftText, "left");
    this.updateStatusBadge(this.rightStatusEl, this.rightReport, rightText, "right");

    this.leftParsed = this.leftReport.jsonValid ? this.leftReport.jsonDiag.data : null;
    this.rightParsed = this.rightReport.jsonValid ? this.rightReport.jsonDiag.data : null;

    // 4. Detect and render client scripts chips
    let leftBlocks = [];
    let rightBlocks = [];

    if (this.leftParsed) {
      leftBlocks = JsonEngine.findAllClientScripts(this.leftParsed);
      this.renderScriptsList(this.leftScriptsListEl, leftBlocks);
    } else if (!leftText) {
      this.leftScriptsListEl.innerHTML = `<span class="empty-hint">No JSON entered (optional for comparison)</span>`;
    } else {
      this.leftScriptsListEl.innerHTML = `<span class="empty-hint hint-error">✖ Invalid JSON syntax (see details above)</span>`;
    }

    if (this.rightParsed) {
      rightBlocks = JsonEngine.findAllClientScripts(this.rightParsed);
      this.renderScriptsList(this.rightScriptsListEl, rightBlocks);
    } else if (!rightText) {
      this.rightScriptsListEl.innerHTML = `<span class="empty-hint">No JSON entered (optional for comparison)</span>`;
    } else {
      this.rightScriptsListEl.innerHTML = `<span class="empty-hint hint-error">✖ Invalid JSON syntax (see details above)</span>`;
    }

    this.updateComparisonSummary(leftBlocks, rightBlocks);
  }

  renderValidationPanel(side, report, rawText) {
    const container = side === "left" ? this.leftValidationPanel : this.rightValidationPanel;
    if (!container) return;

    // Synchronize VS Code Monaco error markers on main bundle editor
    const monacoInstance = side === "left" ? this.monacoLeft : this.monacoRight;
    if (monacoInstance && typeof monaco !== "undefined" && monaco.editor) {
      const model = monacoInstance.getModel();
      if (model) {
        if (report.jsonValid) {
          monaco.editor.setModelMarkers(model, "json-validator", []);
        } else {
          const diag = report.jsonDiag;
          const errLine = Math.max(1, diag.line || 1);
          const errCol = Math.max(1, diag.column || 1);
          const lineContent = model.getLineContent(errLine) || "";
          monaco.editor.setModelMarkers(model, "json-validator", [
            {
              startLineNumber: errLine,
              startColumn: errCol,
              endLineNumber: errLine,
              endColumn: Math.max(errCol + 1, lineContent.length + 1),
              message: `${diag.errorTitle || "JSON Error"}: ${diag.message}`,
              severity: monaco.MarkerSeverity.Error
            }
          ]);
        }
      }
    }

    // Synchronize CodeMirror error line highlighting and gutter markers
    const cm = side === "left" ? this.cmLeft : this.cmRight;
    const activeKey = side === "left" ? "activeLeftErrorLine" : "activeRightErrorLine";
    if (this[activeKey] !== null && cm) {
      cm.removeLineClass(this[activeKey], "background", "cm-val-error-line");
      cm.setGutterMarker(this[activeKey], "CodeMirror-linenumbers", null);
      this[activeKey] = null;
    }

    if (!report.jsonValid && cm && report.jsonDiag && report.jsonDiag.line) {
      const errLineIdx = Math.max(0, report.jsonDiag.line - 1);
      this[activeKey] = errLineIdx;
      cm.addLineClass(errLineIdx, "background", "cm-val-error-line");
      const marker = document.createElement("span");
      marker.className = "cm-val-gutter-error";
      marker.textContent = "✖";
      marker.title = `${report.jsonDiag.errorTitle}: ${report.jsonDiag.message}`;
      cm.setGutterMarker(errLineIdx, "CodeMirror-linenumbers", marker);
    }

    // Case 1: Empty input
    if (report.jsonDiag.isEmpty) {
      container.innerHTML = `
        <div class="val-bar-empty">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Paste or upload a JSON bundle above to begin syntax validation</span>
        </div>
      `;
      return;
    }

    // Case 2: JSON Syntax Error
    if (!report.jsonValid) {
      const diag = report.jsonDiag;
      const snippetHtml = diag.snippet
        ? `
          <div class="val-snippet-box">
            ${diag.snippet.lines
          .map(
            l => `
              <div class="val-snippet-line ${l.isError ? "val-error-line" : ""}">
                <span class="val-line-no">${l.lineNum}</span>
                <span class="val-line-code">${this.escapeHtml(l.text)}</span>
              </div>
            `
          )
          .join("")}
            <div class="val-pointer-line">
              <span class="val-line-no"></span>
              <span class="val-pointer">${this.escapeHtml(diag.snippet.pointer)}--- Error detected here</span>
            </div>
          </div>
        `
        : "";

      container.innerHTML = `
        <div class="val-card-error">
          <div class="val-card-header">
            <div class="val-header-left">
              <svg class="val-icon-error" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <span class="val-title">${this.escapeHtml(diag.errorTitle || "JSON Syntax Error")}</span>
              <span class="val-loc-pill">Line ${diag.line || 1}, Col ${diag.column || 1}</span>
            </div>
            <div class="val-header-actions">
              ${diag.canAutoFix
          ? `<button class="btn-val-autofix" data-side="${side}" title="Automatically fix trailing commas, unquoted keys, single quotes, or comments">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      ⚡ Auto-Fix JSON
                    </button>`
          : ""
        }
              <button class="btn-val-jump" data-side="${side}" data-line="${diag.line || 1}" data-col="${diag.column || 1}" title="Focus and scroll to error line in editor">
                🎯 Jump to Line ${diag.line || 1}
              </button>
            </div>
          </div>

          ${snippetHtml}

          <div class="val-details">
            <div class="val-reason">
              <span class="val-label">Problem:</span>
              <span class="val-text">${this.escapeHtml(diag.explanation)}</span>
            </div>
            <div class="val-fix">
              <span class="val-label">How to fix:</span>
              <span class="val-text">${this.escapeHtml(diag.fixSuggestion)}</span>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Case 3: JSON is valid, BUT embedded JavaScript has a syntax error!
    if (report.hasScriptErrors && report.scriptErrors.length > 0) {
      const firstErr = report.scriptErrors[0];
      const jsDiag = firstErr.diagnostic;
      const snippetHtml = jsDiag.snippet
        ? `
          <div class="val-snippet-box">
            ${jsDiag.snippet.lines
          .map(
            l => `
              <div class="val-snippet-line ${l.isError ? "val-error-line" : ""}">
                <span class="val-line-no">${l.lineNum}</span>
                <span class="val-line-code">${this.escapeHtml(l.text)}</span>
              </div>
            `
          )
          .join("")}
            <div class="val-pointer-line">
              <span class="val-line-no"></span>
              <span class="val-pointer">${this.escapeHtml(jsDiag.snippet.pointer)}--- JS syntax error</span>
            </div>
          </div>
        `
        : "";

      container.innerHTML = `
        <div class="val-card-warn">
          <div class="val-card-header">
            <div class="val-header-left">
              <svg class="val-icon-warn" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span class="val-title">JavaScript Error in ${this.escapeHtml(firstErr.scriptKey)}</span>
              <span class="val-loc-pill">Line ${jsDiag.line || 1}, Col ${jsDiag.column || 1}</span>
            </div>
            <div class="val-header-actions">
              <button class="btn-val-fix-diff" data-script="${this.escapeHtml(firstErr.scriptKey)}" title="Launch Diff & Edit Studio directly to this script">
                🛠️ Fix in Diff Studio
              </button>
            </div>
          </div>

          ${snippetHtml}

          <div class="val-details">
            <div class="val-reason">
              <span class="val-label">Problem:</span>
              <span class="val-text">${this.escapeHtml(jsDiag.explanation || jsDiag.message)}</span>
            </div>
            <div class="val-fix">
              <span class="val-label">How to fix:</span>
              <span class="val-text">${this.escapeHtml(jsDiag.fixSuggestion)}</span>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Case 4: Everything is valid!
    const lineCount = rawText ? rawText.split(/\r?\n/).length : 0;
    container.innerHTML = `
      <div class="val-bar-valid">
        <div class="val-bar-left">
          <svg class="val-icon-success" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="val-status-text">Valid JSON Structure (${lineCount} lines)</span>
          <span class="val-badge-clean">0 syntax errors</span>
        </div>
        <div class="val-bar-right">
          <span class="val-script-status">✓ ${report.scriptsChecked} embedded script(s) valid JS</span>
        </div>
      </div>
    `;
  }

  bindValidationActions() {
    const handlePanelClick = (e, side) => {
      // 1. Auto-Fix JSON button
      const btnAutoFix = e.target.closest(".btn-val-autofix");
      if (btnAutoFix) {
        const rawText = side === "left" ? this.getLeftText() : this.getRightText();
        const fixResult = Validator.autoFixJson(rawText);
        if (fixResult.ok) {
          if (side === "left") {
            this.setLeftJson(fixResult.fixedText);
          } else {
            this.setRightJson(fixResult.fixedText);
          }
          this.analyzeInputs();
          const fixList = fixResult.appliedFixes.length ? fixResult.appliedFixes.join(", ") : "Formatted JSON";
          this.showToast(`⚡ Auto-fixed JSON: ${fixList}!`);
        } else {
          this.showToast("Could not auto-fix all syntax errors. Please inspect the highlighted line.");
        }
        return;
      }

      // 2. Jump to line button
      const btnJump = e.target.closest(".btn-val-jump");
      if (btnJump) {
        const line = parseInt(btnJump.dataset.line, 10);
        const col = parseInt(btnJump.dataset.col, 10) || 1;
        this.jumpToLine(side, line, col);
        return;
      }

      // 3. Fix script in Diff Studio button
      const btnFixDiff = e.target.closest(".btn-val-fix-diff");
      if (btnFixDiff) {
        const scriptKey = btnFixDiff.dataset.script || "prescript";
        this.openDiffDialog(scriptKey);
        return;
      }
    };

    this.leftValidationPanel?.addEventListener("click", e => handlePanelClick(e, "left"));
    this.rightValidationPanel?.addEventListener("click", e => handlePanelClick(e, "right"));

    // Click header status pill to jump to error
    this.leftStatusEl?.addEventListener("click", () => {
      if (this.leftReport && !this.leftReport.jsonValid) {
        this.jumpToLine("left", this.leftReport.jsonDiag.line, this.leftReport.jsonDiag.column);
      }
    });
    this.rightStatusEl?.addEventListener("click", () => {
      if (this.rightReport && !this.rightReport.jsonValid) {
        this.jumpToLine("right", this.rightReport.jsonDiag.line, this.rightReport.jsonDiag.column);
      }
    });
  }

  jumpToLine(side, line, col = 1) {
    const monaco = side === "left" ? this.monacoLeft : this.monacoRight;
    const cm = side === "left" ? this.cmLeft : this.cmRight;

    if (monaco && !isNaN(line)) {
      monaco.revealLineInCenter(line);
      monaco.setPosition({ lineNumber: line, column: col });
      monaco.focus();
    } else if (cm && !isNaN(line)) {
      cm.setCursor({ line: Math.max(0, line - 1), ch: Math.max(0, col - 1) });
      cm.scrollIntoView({ line: Math.max(0, line - 1), ch: Math.max(0, col - 1) }, 100);
      cm.focus();

      // Visual flash
      cm.addLineClass(line - 1, "background", "cm-val-flash");
      setTimeout(() => cm.removeLineClass(line - 1, "background", "cm-val-flash"), 1500);
    }
  }

  updateStatusBadge(el, report, rawText, side) {
    if (!el) return;
    el.classList.add("tag-status-pill");
    if (side) el.dataset.side = side;

    if (report.jsonDiag.isEmpty) {
      el.className = "status-tag tag-status-pill tag-empty";
      el.textContent = "Empty JSON";
      el.title = "No content provided";
    } else if (!report.jsonValid) {
      el.className = "status-tag tag-status-pill tag-error";
      el.innerHTML = `✖ Line ${report.jsonDiag.line || 1}, Col ${report.jsonDiag.column || 1}: ${this.escapeHtml(report.jsonDiag.errorTitle || "JSON Error")}`;
      el.title = `Click to jump to Line ${report.jsonDiag.line || 1}: ${report.jsonDiag.message}`;
    } else if (report.hasScriptErrors) {
      const firstErr = report.scriptErrors[0];
      el.className = "status-tag tag-status-pill tag-warn";
      el.innerHTML = `⚠ JS Error in ${firstErr.scriptKey} (Line ${firstErr.diagnostic.line || 1})`;
      el.title = "JSON syntax is valid, but embedded clientscript has JavaScript syntax errors. Click to inspect.";
    } else {
      const hasCrLf = rawText.includes("\r\n");
      const lineCount = rawText ? rawText.split(/\r?\n/).length : 0;
      el.className = "status-tag tag-status-pill tag-valid";
      el.innerHTML = `✓ Valid JSON (${lineCount} lines • 0 errors)`;
      el.title = `JSON bundle and all ${report.scriptsChecked} embedded scripts are 100% syntactically valid (${hasCrLf ? "CRLF" : "LF"})`;
    }
  }

  renderScriptsList(container, blocks) {
    if (!container) return;
    if (blocks.length === 0) {
      container.innerHTML = `<span class="tag-warn">No "clientscripts" detected</span>`;
      return;
    }

    let html = "";
    blocks.forEach((block, bIdx) => {
      const scriptKeys = Object.keys(block.scripts);

      html += `<div class="block-chip">
        <span class="block-path">${block.path}</span>
        <div class="block-scripts">
          ${scriptKeys
          .map(k => {
            const sc = block.scripts[k];
            if (!sc.exists) return "";
            const crlfNotice = sc.hasCrLf ? "\\r\\n" : "\\n";
            return `<span class="script-pill" title="Click to open ${k} in IDE editor (${crlfNotice} line breaks)" data-script="${k}" role="button" style="cursor: pointer;">
                <span class="pill-dot"></span>${k}
              </span>`;
          })
          .join("")}
        </div>
      </div>`;
    });

    container.innerHTML = html;
    container.querySelectorAll(".script-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const scriptKey = pill.dataset.script;
        this.openDiffDialog(scriptKey);
      });
    });
  }

  updateComparisonSummary(leftBlocks, rightBlocks) {
    if (!this.compareSummaryEl) return;

    const hasLeft = Boolean(this.leftParsed);
    const hasRight = Boolean(this.rightParsed);

    // Case 1: Both panels are empty
    if (!hasLeft && !hasRight) {
      this.btnOpenDiffModal.disabled = true;
      this.compareSummaryEl.innerHTML = `
        <div class="summary-status waiting">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Paste or upload a JSON bundle above to inspect &amp; edit readable scripts</span>
        </div>
      `;
      return;
    }

    // Case 2: Only Left (Base) is provided
    if (hasLeft && !hasRight) {
      const blockL = leftBlocks[0];
      const scriptKeys = Object.keys(blockL?.scripts || {}).filter(k => blockL.scripts[k].exists);
      if (scriptKeys.length === 0) {
        this.btnOpenDiffModal.disabled = true;
        this.compareSummaryEl.innerHTML = `
          <div class="summary-status warning">
            <span>⚠️ Base JSON loaded, but no "clientscripts" block was detected.</span>
          </div>
        `;
        return;
      }

      this.btnOpenDiffModal.disabled = false;
      const chipsHtml = scriptKeys
        .map(k => `
          <div class="script-status-chip chip-same" data-script="${k}" role="button" title="Click to open ${k} in IDE editor" style="cursor: pointer;">
            <span class="chip-name">${k}</span>
            <span class="chip-state">Ready</span>
          </div>
        `)
        .join("");

      this.compareSummaryEl.innerHTML = `
        <div class="summary-active-row">
          <div class="chips-group">
            ${chipsHtml}
          </div>
          <div class="hint-text">
            ✓ Base JSON loaded (${scriptKeys.length} script${scriptKeys.length > 1 ? "s" : ""}). Click below to open &amp; edit readable scripts (or paste Target JSON on the right to compare diffs).
          </div>
        </div>
      `;
      this.bindSummaryChipClicks();
      return;
    }

    // Case 3: Only Right (Target) is provided
    if (!hasLeft && hasRight) {
      const blockR = rightBlocks[0];
      const scriptKeys = Object.keys(blockR?.scripts || {}).filter(k => blockR.scripts[k].exists);
      if (scriptKeys.length === 0) {
        this.btnOpenDiffModal.disabled = true;
        this.compareSummaryEl.innerHTML = `
          <div class="summary-status warning">
            <span>⚠️ Target JSON loaded, but no "clientscripts" block was detected.</span>
          </div>
        `;
        return;
      }

      this.btnOpenDiffModal.disabled = false;
      const chipsHtml = scriptKeys
        .map(k => `
          <div class="script-status-chip chip-same" data-script="${k}" role="button" title="Click to open ${k} in IDE editor" style="cursor: pointer;">
            <span class="chip-name">${k}</span>
            <span class="chip-state">Ready</span>
          </div>
        `)
        .join("");

      this.compareSummaryEl.innerHTML = `
        <div class="summary-active-row">
          <div class="chips-group">
            ${chipsHtml}
          </div>
          <div class="hint-text">
            ✓ Target JSON loaded (${scriptKeys.length} script${scriptKeys.length > 1 ? "s" : ""}). Click below to open &amp; edit readable scripts (or paste Base JSON on the left to compare diffs).
          </div>
        </div>
      `;
      this.bindSummaryChipClicks();
      return;
    }

    // Case 4: Both Left and Right are provided
    if (leftBlocks.length === 0 && rightBlocks.length === 0) {
      this.btnOpenDiffModal.disabled = true;
      this.compareSummaryEl.innerHTML = `
        <div class="summary-status warning">
          <span>⚠️ Could not find "clientscripts" block in the provided JSON bundles.</span>
        </div>
      `;
      return;
    }

    this.btnOpenDiffModal.disabled = false;

    const blockL = leftBlocks[0];
    const blockR = rightBlocks[0];

    const allKeys = new Set([
      "prescript",
      "postscript",
      "onSaveScript",
      ...Object.keys(blockL?.scripts || {}),
      ...Object.keys(blockR?.scripts || {})
    ]);

    const chipsHtml = Array.from(allKeys)
      .filter(k => blockL?.scripts?.[k]?.exists || blockR?.scripts?.[k]?.exists)
      .map(k => {
        const leftScript = blockL?.scripts?.[k]?.readable || "";
        const rightScript = blockR?.scripts?.[k]?.readable || "";

        let statusClass = "chip-same";
        let statusText = "Identical";

        if (!leftScript && !rightScript) {
          statusClass = "chip-empty";
          statusText = "Not present";
        } else if (leftScript !== rightScript) {
          statusClass = "chip-diff";
          statusText = "Diff Detected";
        }

        return `
        <div class="script-status-chip ${statusClass}" data-script="${k}" role="button" title="Click to open ${k} in Diff Modal" style="cursor: pointer;">
          <span class="chip-name">${k}</span>
          <span class="chip-state">${statusText}</span>
        </div>
      `;
      })
      .join("");

    this.compareSummaryEl.innerHTML = `
      <div class="summary-active-row">
        <div class="chips-group">
          ${chipsHtml}
        </div>
        <div class="hint-text">
          Click below to open the dialog, edit in full IDE mode, merge line-by-line, and export to JSON!
        </div>
      </div>
    `;
    this.bindSummaryChipClicks();
  }

  bindSummaryChipClicks() {
    this.compareSummaryEl.querySelectorAll(".script-status-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const scriptKey = chip.dataset.script;
        this.openDiffDialog(scriptKey);
      });
    });
  }

  openDiffDialog(preferredScript = null) {
    // 1. Force fresh synchronous analysis of whatever is currently in the editors
    this.analyzeInputs();

    const hasLeft = Boolean(this.leftParsed);
    const hasRight = Boolean(this.rightParsed);

    if (!hasLeft && !hasRight) {
      this.showToast("⚠️ Please paste or upload your JSON bundle first!");
      return;
    }

    const baseObj = this.leftParsed || this.rightParsed;
    const targetObj = this.rightParsed || this.leftParsed;

    // Pick a smart default script to open
    let scriptToOpen = preferredScript;
    if (!scriptToOpen) {
      const leftBlocks = JsonEngine.findAllClientScripts(baseObj);
      const rightBlocks = JsonEngine.findAllClientScripts(targetObj);
      const bL = leftBlocks[0];
      const bR = rightBlocks[0];

      // Prefer a script with diff first
      const allKeys = ["postscript", "prescript", "onSaveScript"];
      for (const k of allKeys) {
        const sL = bL?.scripts?.[k]?.readable || "";
        const sR = bR?.scripts?.[k]?.readable || "";
        if (sL && sR && sL !== sR) {
          scriptToOpen = k;
          break;
        }
      }

      // If no diff, pick the first script that has content
      if (!scriptToOpen) {
        for (const k of ["prescript", "postscript", "onSaveScript"]) {
          const sL = bL?.scripts?.[k]?.readable || "";
          const sR = bR?.scripts?.[k]?.readable || "";
          if (sL || sR) {
            scriptToOpen = k;
            break;
          }
        }
      }
    }

    this.diffModal.open(baseObj, targetObj, {
      preferredScript: scriptToOpen || "prescript",
      lineEndingPreference: this.lineEndingPreference
    });
  }

  downloadJsonFile(content, filename) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast(`💾 Downloaded ${filename} ready for commit!`);
  }

  bindQuickConverter() {
    const rawInput = document.getElementById("converterRawInput");
    const cleanInput = document.getElementById("converterCleanInput");
    const btnToReadable = document.getElementById("btnConvToReadable");
    const btnToEscaped = document.getElementById("btnConvToEscaped");
    const btnCopyRaw = document.getElementById("btnCopyConvRaw");
    const btnCopyClean = document.getElementById("btnCopyConvClean");
    const btnFormatClean = document.getElementById("btnFormatConvClean");

    if (!rawInput) return;

    // Real-time clean JS validation runner
    const validateCleanJs = () => {
      const code = this.cmCleanJs ? this.cmCleanJs.getValue() : cleanInput ? cleanInput.value : "";
      if (!this.convCleanValPanel) return;

      // Clear previous error line in cmCleanJs
      if (this.activeCleanJsErrorLine !== null && this.cmCleanJs) {
        this.cmCleanJs.removeLineClass(this.activeCleanJsErrorLine, "background", "cm-val-error-line");
        this.cmCleanJs.setGutterMarker(this.activeCleanJsErrorLine, "CodeMirror-linenumbers", null);
        this.activeCleanJsErrorLine = null;
      }

      if (!code.trim()) {
        this.convCleanValPanel.innerHTML = `
          <div class="val-bar-empty">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>Type or paste clean JavaScript above to run real-time syntax diagnostics</span>
          </div>
        `;
        return;
      }

      const res = Validator.validateJs(code);
      const lines = code.split(/\r?\n/);

      if (res.valid) {
        this.convCleanValPanel.innerHTML = `
          <div class="val-bar-valid">
            <div class="val-bar-left">
              <svg class="val-icon-success" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span class="val-status-text">Valid JavaScript Syntax (${lines.length} lines)</span>
              <span class="val-badge-clean">0 syntax errors</span>
            </div>
          </div>
        `;
      } else {
        const errLineIdx = Math.max(0, (res.line || 1) - 1);
        if (this.cmCleanJs) {
          this.activeCleanJsErrorLine = errLineIdx;
          this.cmCleanJs.addLineClass(errLineIdx, "background", "cm-val-error-line");
          const marker = document.createElement("span");
          marker.className = "cm-val-gutter-error";
          marker.textContent = "✖";
          marker.title = `${res.errorTitle}: ${res.message}`;
          this.cmCleanJs.setGutterMarker(errLineIdx, "CodeMirror-linenumbers", marker);
        }

        const snippetHtml = res.snippet
          ? `
            <div class="val-snippet-box">
              ${res.snippet.lines
            .map(
              l => `
                <div class="val-snippet-line ${l.isError ? "val-error-line" : ""}">
                  <span class="val-line-no">${l.lineNum}</span>
                  <span class="val-line-code">${this.escapeHtml(l.text)}</span>
                </div>
              `
            )
            .join("")}
              <div class="val-pointer-line">
                <span class="val-line-no"></span>
                <span class="val-pointer">${this.escapeHtml(res.snippet.pointer)}--- JS syntax error</span>
              </div>
            </div>
          `
          : "";

        this.convCleanValPanel.innerHTML = `
          <div class="val-card-error">
            <div class="val-card-header">
              <div class="val-header-left">
                <svg class="val-icon-error" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <span class="val-title">${this.escapeHtml(res.errorTitle || "JavaScript Syntax Error")}</span>
                <span class="val-loc-pill">Line ${res.line || 1}, Col ${res.column || 1}</span>
              </div>
              <div class="val-header-actions">
                <button class="btn-val-jump" id="btnConvJumpLine" data-line="${res.line || 1}" data-col="${res.column || 1}" title="Focus error line in editor">
                  🎯 Jump to Line ${res.line || 1}
                </button>
              </div>
            </div>

            ${snippetHtml}

            <div class="val-details">
              <div class="val-reason">
                <span class="val-label">Problem:</span>
                <span class="val-text">${this.escapeHtml(res.explanation || res.message)}</span>
              </div>
              <div class="val-fix">
                <span class="val-label">How to fix:</span>
                <span class="val-text">${this.escapeHtml(res.fixSuggestion || "Fix syntax error.")}</span>
              </div>
            </div>
          </div>
        `;

        this.convCleanValPanel.querySelector("#btnConvJumpLine")?.addEventListener("click", () => {
          if (this.cmCleanJs && res.line) {
            this.cmCleanJs.setCursor({ line: res.line - 1, ch: (res.column || 1) - 1 });
            this.cmCleanJs.scrollIntoView({ line: res.line - 1, ch: (res.column || 1) - 1 }, 100);
            this.cmCleanJs.focus();
            this.cmCleanJs.addLineClass(res.line - 1, "background", "cm-val-flash");
            setTimeout(() => this.cmCleanJs?.removeLineClass(res.line - 1, "background", "cm-val-flash"), 1500);
          }
        });
      }
    };

    let debounceTimer = null;
    const triggerValidation = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => validateCleanJs(), 200);
    };

    if (this.cmCleanJs) {
      this.cmCleanJs.on("change", triggerValidation);
      // Instant validation on paste
      this.cmCleanJs.on("inputRead", (cm, change) => {
        if (change.origin === "paste") {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => validateCleanJs(), 50);
        }
      });
    }
    cleanInput?.addEventListener("input", triggerValidation);

    // Format JS button
    btnFormatClean?.addEventListener("click", () => {
      const code = this.cmCleanJs ? this.cmCleanJs.getValue() : cleanInput.value;
      if (!code.trim()) return;
      const formatted = JsBeautifier.beautify(code, 4);
      if (this.cmCleanJs) {
        this.cmCleanJs.setValue(formatted);
      }
      if (cleanInput) cleanInput.value = formatted;
      validateCleanJs();
      this.showToast("⚡ Formatted JavaScript with clean 4-space indentation!");
    });

    btnToReadable?.addEventListener("click", () => {
      const raw = rawInput.value;
      const clean = JsonEngine.toReadableJs(raw);
      const beautified = JsBeautifier.beautify(clean, 4);
      if (this.cmCleanJs) {
        this.cmCleanJs.setValue(beautified);
      }
      if (cleanInput) cleanInput.value = beautified;
      validateCleanJs();
      this.showToast("Converted to readable JavaScript in Editor!");
    });

    btnToEscaped?.addEventListener("click", () => {
      const clean = this.cmCleanJs ? this.cmCleanJs.getValue() : cleanInput.value;
      const escaped = JsonEngine.toRawEscapedString(clean, true);
      rawInput.value = escaped;
      this.showToast("Converted to escaped JSON string format (\\r\\n)!");
    });

    btnCopyRaw?.addEventListener("click", () => {
      navigator.clipboard.writeText(rawInput.value).then(() => {
        this.showToast("Copied escaped string!");
      });
    });

    btnCopyClean?.addEventListener("click", () => {
      const code = this.cmCleanJs ? this.cmCleanJs.getValue() : cleanInput.value;
      navigator.clipboard.writeText(code).then(() => {
        this.showToast("Copied clean JS!");
      });
    });

    // Initial validation
    setTimeout(() => validateCleanJs(), 100);
  }

  escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  showToast(message) {
    let toast = document.getElementById("appToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "appToast";
      toast.className = "toast-message";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("visible");
    setTimeout(() => toast.classList.remove("visible"), 3200);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.inoApp = new InoJsonApp();
});


})();
