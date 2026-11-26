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

    // Pattern A: Trailing comma before } or ] (or trailing comma at EOF after copied object)
    const beforePos = text.slice(Math.max(0, pos - 20), pos).trim();
    const atPos = text.slice(pos, pos + 20).trim();
    const lineBeforeCol = currentLineText.slice(0, column - 1).trim();
    const trimmedDoc = text.trim();

    if (/^\s*[\{\[][\s\S]*[\}\]]\s*,\s*$/.test(trimmedDoc)) {
      errorTitle = "Trailing Comma After Copied Root Object";
      message = "Extra comma ',' at the very end after closing brace/bracket";
      explanation = "When copying an object block from inside a file or array, a trailing comma ',' after the final '}' or ']' makes standalone JSON invalid.";
      fixSuggestion = "Remove the trailing comma at the very end, or click '⚡ Auto-Fix JSON'.";
    } else if (/^\s*"[^"\r\n]+"\s*:\s*/.test(trimmedDoc)) {
      errorTitle = "Missing Outer Curly Braces { ... } (Copied Property Snippet)";
      message = "Copied a JSON property ('\"key\": ...') without wrapping outer '{ ... }'";
      explanation = "Top-level JSON documents must be wrapped in outer curly braces { ... }. Copying a single property like '\"clientscripts\": { ... }' omits those outer braces.";
      fixSuggestion = "Wrap the pasted block in { ... }, or click '⚡ Auto-Fix JSON' to wrap it automatically.";
    } else if (
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

    // Fast path for clean IDE-copied snippets (trailing root comma or unwrapped property block)
    // so valid escaped strings (with ';', '//', single quotes inside JS) are never altered unnecessarily.
    const rawTrimmed = rawText.trim();
    if (/^\s*[\{\[][\s\S]*[\}\]]\s*,\s*$/.test(rawTrimmed)) {
      const noRootComma = rawTrimmed.replace(/,\s*$/, "");
      try {
        const parsed = JSON.parse(noRootComma);
        return {
          ok: true,
          fixedText: JSON.stringify(parsed, null, 2),
          appliedFixes: ["Removed trailing comma after copied root object"]
        };
      } catch (e) {}
    } else if (/^\s*"[^"\r\n]+"\s*:\s*/.test(rawTrimmed)) {
      const wrapped = `{\n${rawTrimmed.replace(/,\s*$/, "")}\n}`;
      try {
        const parsed = JSON.parse(wrapped);
        return {
          ok: true,
          fixedText: JSON.stringify(parsed, null, 2),
          appliedFixes: ["Wrapped copied JSON property snippet in outer { ... }"]
        };
      } catch (e) {}
    }

    // Protect existing valid double-quoted strings from accidental mutation during structural fixes
    const protectedStrings = [];
    let text = rawText.replace(/"(?:\\[\s\S]|[^"\\\r\n])*"/g, match => {
      const idx = protectedStrings.length;
      protectedStrings.push(match);
      return `\u0000STR_${idx}\u0000`;
    });

    // 1. Strip comments outside strings (// and /* */)
    let strippedComments = false;
    const noBlock = text.replace(/\/\*[\s\S]*?\*\//g, () => {
      strippedComments = true;
      return "";
    });
    const noLine = noBlock.replace(/\/\/.*$/gm, () => {
      strippedComments = true;
      return "";
    });
    if (strippedComments) {
      appliedFixes.push("Stripped JSON comments (// and /* */)");
      text = noLine;
    }

    // 2. Replace semicolons at line ends or before next element with commas
    let fixedSemicolons = false;
    const semiFixed = text.replace(/;\s*(?=[\r\n]|\s*[\u0000"'a-zA-Z0-9_$\}\]])/g, () => {
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

    // 6. Fix single quotes to double quotes (outside already-valid double-quoted strings)
    let fixedQuotes = false;
    const quotesFixed = text.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (match, inner) => {
      fixedQuotes = true;
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

    // Restore protected double-quoted strings
    text = text.replace(/\u0000STR_(\d+)\u0000/g, (m, i) => protectedStrings[Number(i)]);

    // 8. Handle common IDE copy-paste issues after structural fixes
    const trimmed = text.trim();
    if (/^\s*[\{\[][\s\S]*[\}\]]\s*,\s*$/.test(trimmed)) {
      text = trimmed.replace(/,\s*$/, "");
      appliedFixes.push("Removed trailing comma after copied root object");
    } else if (/^\s*"[^"\r\n]+"\s*:\s*/.test(trimmed)) {
      const unwrapped = trimmed.replace(/,\s*$/, "");
      text = `{\n${unwrapped}\n}`;
      appliedFixes.push("Wrapped copied JSON property snippet in outer { ... }");
    }

    // 9. Test if the result parses
    try {
      const parsed = JSON.parse(text);
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
   * Initializes Monaco AMD loader ONLY after DOM & synchronous vendor scripts (Acorn, CodeMirror)
   * have finished executing, avoiding any UMD `define.amd` conflict.
   */
  init() {
    if (typeof window === "undefined") return;

    const boot = () => {
      if (window.monaco && window.monaco.editor) {
        this.isReady = true;
        this.configureMonacoDefaults();
        return;
      }

      if (typeof window.require !== "undefined" && window.require.config) {
        this.loadMonacoWithAmd();
      } else {
        this.injectMonacoLoader();
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      setTimeout(boot, 0);
    }
  }

  injectMonacoLoader() {
    if (this.isLoading) return;
    this.isLoading = true;

    const existingScript = document.querySelector('script[src*="monaco-editor"]');
    if (existingScript) {
      if (typeof window.require !== "undefined" && window.require.config) {
        this.loadMonacoWithAmd();
      } else {
        existingScript.addEventListener("load", () => this.loadMonacoWithAmd());
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js";
    script.async = true;
    script.onload = () => {
      this.loadMonacoWithAmd();
    };
    script.onerror = () => {
      console.warn("Monaco loader failed to load. Using CodeMirror editor.");
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

      // Blob worker URL is more reliable than data: URI in modern browsers & avoids CORS worker errors
      let workerBlobUrl = null;
      window.MonacoEnvironment = {
        getWorkerUrl: function (workerId, label) {
          const proxyScript = `
            self.MonacoEnvironment = {
              baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/'
            };
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/base/worker/workerMain.js');
          `;
          try {
            if (!workerBlobUrl) {
              const blob = new Blob([proxyScript], { type: "application/javascript" });
              workerBlobUrl = URL.createObjectURL(blob);
            }
            return workerBlobUrl;
          } catch (e) {
            return `data:text/javascript;charset=utf-8,${encodeURIComponent(proxyScript)}`;
          }
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

    // Configure JSON language diagnostics strictly
    if (window.monaco.languages.json?.jsonDefaults) {
      window.monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: false,
        trailingCommas: "error"
      });
    }

    // Register synchronous brace/bracket folding provider so Fold All / Unfold All ALWAYS work
    // immediately for both JSON and JavaScript even without waiting for remote workers
    if (!this._foldingRegistered && window.monaco.languages.registerFoldingRangeProvider) {
      this._foldingRegistered = true;
      const braceRangeProvider = {
        provideFoldingRanges(model) {
          const ranges = [];
          const stack = [];
          const lineCount = model.getLineCount();
          const kind = window.monaco.languages.FoldingRangeKind?.Region;

          for (let lineNum = 1; lineNum <= lineCount; lineNum++) {
            const text = model.getLineContent(lineNum);
            let inStr = null;
            for (let c = 0; c < text.length; c++) {
              const ch = text[c];
              if (inStr) {
                if (ch === "\\") { c++; continue; }
                if (ch === inStr) inStr = null;
                continue;
              }
              if (ch === '"' || ch === "'" || ch === "`") {
                inStr = ch;
                continue;
              }
              if (ch === "/" && text[c + 1] === "/") break;
              if (ch === "{" || ch === "[") {
                stack.push({ line: lineNum, ch });
              } else if (ch === "}" || ch === "]") {
                for (let s = stack.length - 1; s >= 0; s--) {
                  const open = stack[s];
                  const match = (open.ch === "{" && ch === "}") || (open.ch === "[" && ch === "]");
                  if (match) {
                    stack.splice(s, 1);
                    if (lineNum > open.line) {
                      ranges.push({ start: open.line, end: lineNum - 1 > open.line ? lineNum - 1 : lineNum, kind });
                    }
                    break;
                  }
                }
              }
            }
          }
          return ranges;
        }
      };
      window.monaco.languages.registerFoldingRangeProvider("json", braceRangeProvider);
      window.monaco.languages.registerFoldingRangeProvider("javascript", braceRangeProvider);
    }
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
      onChange = null,
      onPaste = null
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
      foldingStrategy: "auto",
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
      find: {
        addExtraSpaceOnTop: true,
        autoFindInSelection: "never",
        seedSearchStringFromSelection: "always"
      },
      scrollBeyondLastLine: false,
      formatOnPaste: false,
      formatOnType: false,
      contextmenu: true,
      wordWrap: "off",
      padding: { top: 8, bottom: 8 }
    });

    if (typeof onChange === "function") {
      editor.onDidChangeModelContent(e => {
        onChange(editor.getValue(), e);
      });
    }

    if (typeof onPaste === "function" && editor.onDidPaste) {
      editor.onDidPaste(e => {
        onPaste(editor.getValue(), e);
      });
    }

    return editor;
  }

  /**
   * Reliably execute an editor action (e.g. 'editor.foldAll', 'editor.unfoldAll', 'actions.find')
   */
  runAction(editor, actionId) {
    if (!editor) return false;
    editor.focus();
    const action = editor.getAction?.(actionId);
    if (action) {
      Promise.resolve(action.run()).catch(() => {});
      return true;
    }
    try {
      editor.trigger("toolbar", actionId, {});
      return true;
    } catch (e) {
      return false;
    }
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
   * High-speed line-level diff using common prefix/suffix trimming + unique anchor divide-and-conquer
   * Handles 5,000+ line JSON bundles in milliseconds without multi-megabyte DP allocation.
   */
  diffLines(linesA, linesB, ignoreWs) {
    const normalize = str => (ignoreWs ? str.trim().replace(/\s+/g, " ") : str);
    const n = linesA.length;
    const m = linesB.length;

    const normA = linesA.map(normalize);
    const normB = linesB.map(normalize);

    const ops = [];

    const diffRange = (aStart, aEnd, bStart, bEnd) => {
      // 1. Trim common prefix
      while (aStart < aEnd && bStart < bEnd && normA[aStart] === normB[bStart]) {
        ops.push({
          type: "equal",
          valA: linesA[aStart],
          valB: linesB[bStart],
          lineA: aStart + 1,
          lineB: bStart + 1
        });
        aStart++;
        bStart++;
      }

      // 2. Trim common suffix
      const suffixOps = [];
      while (aStart < aEnd && bStart < bEnd && normA[aEnd - 1] === normB[bEnd - 1]) {
        suffixOps.push({
          type: "equal",
          valA: linesA[aEnd - 1],
          valB: linesB[bEnd - 1],
          lineA: aEnd,
          lineB: bEnd
        });
        aEnd--;
        bEnd--;
      }

      const lenA = aEnd - aStart;
      const lenB = bEnd - bStart;

      if (lenA === 0 && lenB === 0) {
        // Nothing between prefix and suffix
      } else if (lenA === 0) {
        for (let b = bStart; b < bEnd; b++) {
          ops.push({ type: "add", valB: linesB[b], lineB: b + 1 });
        }
      } else if (lenB === 0) {
        for (let a = aStart; a < aEnd; a++) {
          ops.push({ type: "del", valA: linesA[a], lineA: a + 1 });
        }
      } else if (lenA * lenB <= 250000) {
        // Exact Myers/LCS DP on bounded sub-slice
        const dp = Array.from({ length: lenA + 1 }, () => new Uint32Array(lenB + 1));
        for (let i = 0; i < lenA; i++) {
          const a = normA[aStart + i];
          for (let j = 0; j < lenB; j++) {
            if (a === normB[bStart + j]) {
              dp[i + 1][j + 1] = dp[i][j] + 1;
            } else {
              dp[i + 1][j + 1] = dp[i + 1][j] >= dp[i][j + 1] ? dp[i + 1][j] : dp[i][j + 1];
            }
          }
        }

        const sliceOps = [];
        let i = lenA;
        let j = lenB;
        while (i > 0 || j > 0) {
          if (i > 0 && j > 0 && normA[aStart + i - 1] === normB[bStart + j - 1]) {
            sliceOps.push({
              type: "equal",
              valA: linesA[aStart + i - 1],
              valB: linesB[bStart + j - 1],
              lineA: aStart + i,
              lineB: bStart + j
            });
            i--;
            j--;
          } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            sliceOps.push({
              type: "add",
              valB: linesB[bStart + j - 1],
              lineB: bStart + j
            });
            j--;
          } else {
            sliceOps.push({
              type: "del",
              valA: linesA[aStart + i - 1],
              lineA: aStart + i
            });
            i--;
          }
        }
        for (let k = sliceOps.length - 1; k >= 0; k--) {
          ops.push(sliceOps[k]);
        }
      } else {
        // Large block: find unique matching lines in both ranges (Patience-style anchors)
        const countA = new Map();
        const posA = new Map();
        for (let i = aStart; i < aEnd; i++) {
          const s = normA[i];
          countA.set(s, (countA.get(s) || 0) + 1);
          if (!posA.has(s)) posA.set(s, i);
        }

        const countB = new Map();
        const posB = new Map();
        for (let j = bStart; j < bEnd; j++) {
          const s = normB[j];
          countB.set(s, (countB.get(s) || 0) + 1);
          if (!posB.has(s)) posB.set(s, j);
        }

        // Gather candidates unique on both sides in B's order
        const pairs = [];
        for (let j = bStart; j < bEnd; j++) {
          const s = normB[j];
          if (countB.get(s) === 1 && countA.get(s) === 1) {
            pairs.push([posA.get(s), j]);
          }
        }

        if (pairs.length > 0) {
          // Longest increasing subsequence on pair[0] using O(K log K) patience sorting
          const tails = [];
          const tailIndices = [];
          const prev = new Int32Array(pairs.length).fill(-1);
          for (let idx = 0; idx < pairs.length; idx++) {
            const x = pairs[idx][0];
            let lo = 0, hi = tails.length;
            while (lo < hi) {
              const mid = (lo + hi) >> 1;
              if (tails[mid] < x) lo = mid + 1;
              else hi = mid;
            }
            tails[lo] = x;
            tailIndices[lo] = idx;
            if (lo > 0) prev[idx] = tailIndices[lo - 1];
          }

          const anchors = [];
          for (let cur = tailIndices[tails.length - 1]; cur !== -1; cur = prev[cur]) {
            anchors.push(pairs[cur]);
          }
          anchors.reverse();

          let prevA = aStart;
          let prevB = bStart;
          for (const [ancA, ancB] of anchors) {
            diffRange(prevA, ancA, prevB, ancB);
            ops.push({
              type: "equal",
              valA: linesA[ancA],
              valB: linesB[ancB],
              lineA: ancA + 1,
              lineB: ancB + 1
            });
            prevA = ancA + 1;
            prevB = ancB + 1;
          }
          diffRange(prevA, aEnd, prevB, bEnd);
        } else {
          // Fall back cleanly if two giant files share zero unique lines
          for (let a = aStart; a < aEnd; a++) {
            ops.push({ type: "del", valA: linesA[a], lineA: a + 1 });
          }
          for (let b = bStart; b < bEnd; b++) {
            ops.push({ type: "add", valB: linesB[b], lineB: b + 1 });
          }
        }
      }

      for (let k = suffixOps.length - 1; k >= 0; k--) {
        ops.push(suffixOps[k]);
      }
    };

    diffRange(0, n, 0, m);
    return ops;
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
   * Word/token-level diffing between two lines (safely bounded for giant single-line scripts)
   */
  diffWords(strA, strB) {
    // Fast char-level common prefix/suffix trim before tokenizing huge strings (e.g. 95KB escaped JSON scripts)
    const minLen = Math.min(strA.length, strB.length);
    let prefixLen = 0;
    while (prefixLen < minLen && strA[prefixLen] === strB[prefixLen]) prefixLen++;
    let suffixLen = 0;
    while (
      suffixLen < (minLen - prefixLen) &&
      strA[strA.length - 1 - suffixLen] === strB[strB.length - 1 - suffixLen]
    ) {
      suffixLen++;
    }

    const prefixStr = strA.slice(0, prefixLen);
    const suffixStr = suffixLen > 0 ? strA.slice(strA.length - suffixLen) : "";
    const midA = strA.slice(prefixLen, strA.length - suffixLen);
    const midB = strB.slice(prefixLen, strB.length - suffixLen);

    const tokenize = s => (s ? s.match(/([a-zA-Z0-9_$]+|[^\s\w]|\s+)/g) || [s] : []);

    const tokensA = tokenize(midA);
    const tokensB = tokenize(midB);

    const n = tokensA.length;
    const m = tokensB.length;

    const rawLeft = [];
    const rawRight = [];
    if (prefixStr) {
      rawLeft.push({ text: prefixStr, type: "equal" });
      rawRight.push({ text: prefixStr, type: "equal" });
    }

    // Prevent quadratic OOM if two massive lines differ across thousands of tokens
    if (n * m > 200000) {
      if (midA) rawLeft.push({ text: midA, type: "del" });
      if (midB) rawRight.push({ text: midB, type: "ins" });
    } else {
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

      const midLeft = [];
      const midRight = [];
      let i = n,
        j = m;

      while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && tokensA[i - 1] === tokensB[j - 1]) {
          midLeft.push({ text: tokensA[i - 1], type: "equal" });
          midRight.push({ text: tokensB[j - 1], type: "equal" });
          i--;
          j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
          midRight.push({ text: tokensB[j - 1], type: "ins" });
          j--;
        } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
          midLeft.push({ text: tokensA[i - 1], type: "del" });
          i--;
        }
      }

      for (let k = midLeft.length - 1; k >= 0; k--) rawLeft.push(midLeft[k]);
      for (let k = midRight.length - 1; k >= 0; k--) rawRight.push(midRight[k]);
    }

    if (suffixStr) {
      rawLeft.push({ text: suffixStr, type: "equal" });
      rawRight.push({ text: suffixStr, type: "equal" });
    }

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







const FULL_JSON_KEY = "__FULL_JSON__";

class DiffModal {
  constructor(options = {}) {
    this.container = null;
    this.isOpen = false;
    this.activeScriptKey = FULL_JSON_KEY;
    this.activeBlockIndex = 0;
    this.viewMode = "split"; // 'split', 'unified', 'edit'
    this.editorSubMode = "js"; // 'js' or 'json'
    this.ignoreWhitespace = false;
    this.collapseUnchanged = true;
    this.searchQuery = "";
    this.searchMatches = [];
    this.searchMatchIdx = -1;
    this.expandedRanges = new Set();
    this.currentHunkIndex = 0;

    // Working state for both sides (allows merging into Old or New)
    this.hasLeftInput = false;
    this.hasRightInput = false;
    this.leftTitleLabel = null;
    this.rightTitleLabel = null;
    this.leftFullJsonText = "";
    this.rightFullJsonText = "";
    this.fullJsonModified = false;
    this.leftIndent = 2;
    this.rightIndent = 2;
    this.leftBlocks = [];
    this.rightBlocks = [];
    this.modifiedLeftScripts = new Map();  // scriptKey -> editedReadableText (Old)
    this.modifiedRightScripts = new Map(); // scriptKey -> editedReadableText (New)
    this.mergeHistory = []; // Undo stack
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

              <label class="toggle-label" id="lblCollapseEqual" title="Collapse large identical code sections to focus on changes">
                <input type="checkbox" id="chkCollapseEqual" checked>
                <span>Changes Only Context</span>
              </label>

              <!-- In-Modal Diff Search -->
              <div class="modal-search-box" id="modalSearchBox">
                <input type="text" id="modalSearchInput" class="modal-search-input" placeholder="Find in diff (Cmd/Ctrl+F)..." autocomplete="off">
                <span class="modal-search-count" id="modalSearchCount"></span>
                <button class="btn-nav btn-search-step" id="btnModalSearchPrev" title="Previous match">▲</button>
                <button class="btn-nav btn-search-step" id="btnModalSearchNext" title="Next match">▼</button>
              </div>
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

    // In-modal diff search
    const searchInput = el.querySelector("#modalSearchInput");
    searchInput?.addEventListener("input", e => {
      this.searchQuery = e.target.value;
      this.applyDiffSearch(true);
    });
    searchInput?.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.stepDiffSearch(e.shiftKey ? -1 : 1);
      } else if (e.key === "Escape") {
        e.stopPropagation();
        this.searchQuery = "";
        searchInput.value = "";
        this.applyDiffSearch(false);
      }
    });
    el.querySelector("#btnModalSearchPrev")?.addEventListener("click", () => this.stepDiffSearch(-1));
    el.querySelector("#btnModalSearchNext")?.addEventListener("click", () => this.stepDiffSearch(1));

    // Ignore whitespace
    el.querySelector("#chkIgnoreWs").addEventListener("change", e => {
      this.ignoreWhitespace = e.target.checked;
      this.expandedRanges.clear();
      this.renderCurrentScript();
    });

    // Collapse large unchanged runs
    el.querySelector("#chkCollapseEqual")?.addEventListener("change", e => {
      this.collapseUnchanged = e.target.checked;
      this.expandedRanges.clear();
      this.renderCurrentScript();
    });

    // Bulk Merge All to Old
    el.querySelector("#btnMergeAllToOld").addEventListener("click", () => this.mergeAllLines("to-left"));

    // Undo Merge
    el.querySelector("#btnUndoMerge").addEventListener("click", () => this.undoLastMerge());

    // Hunk navigation
    el.querySelector("#btnPrevHunk").addEventListener("click", () => this.jumpHunk(-1));
    el.querySelector("#btnNextHunk").addEventListener("click", () => this.jumpHunk(1));

    // Format JS / JSON
    el.querySelector("#btnFormatJs").addEventListener("click", () => this.formatCurrentScript());

    // Copy clean JS / JSON
    el.querySelector("#btnCopyCleanJs").addEventListener("click", () => this.copyCleanJs());

    // Reset script
    el.querySelector("#btnResetScript").addEventListener("click", () => this.resetCurrentScript());

    // Apply to Base (Old) JSON
    el.querySelector("#btnApplyOldJson").addEventListener("click", () => {
      if (this.applyMergedChanges("old") !== false) this.close();
    });

    // Apply to Target (New) JSON
    el.querySelector("#btnApplyNewJson").addEventListener("click", () => {
      if (this.applyMergedChanges("new") !== false) this.close();
    });

    // Apply to Both JSONs & Exit
    el.querySelector("#btnApplyBothAndClose").addEventListener("click", () => {
      if (this.applyMergedChanges("both") !== false) this.close();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", e => {
      if (!this.isOpen) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        if (this.viewMode !== "edit") {
          e.preventDefault();
          const input = this.container.querySelector("#modalSearchInput");
          if (input) {
            input.focus();
            input.select();
          }
        }
      } else if (e.key === "Escape") {
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

  disposeActiveEditors() {
    if (this.modalMonacoInstance) {
      try {
        this.modalMonacoInstance.dispose();
      } catch (e) {}
      this.modalMonacoInstance = null;
    }
    if (this.cmModalInstance) {
      this.cmModalInstance = null;
    }
  }

  switchViewMode(mode) {
    this.disposeActiveEditors();
    this.viewMode = mode;
    const modeBtns = this.container.querySelectorAll(".seg-btn");
    modeBtns.forEach(b => b.classList.toggle("active", b.dataset.mode === mode));

    // Toggle toolbar button groups based on mode
    const isEdit = mode === "edit";
    this.container.querySelector("#bulkMergeGroup")?.classList.toggle("hidden", isEdit);
    this.container.querySelector("#hunkNavGroup")?.classList.toggle("hidden", isEdit);
    this.container.querySelector("#lblIgnoreWs")?.classList.toggle("hidden", isEdit);
    this.container.querySelector("#lblCollapseEqual")?.classList.toggle("hidden", isEdit);
    this.container.querySelector("#modalSearchBox")?.classList.toggle("hidden", isEdit);
    this.container.querySelector("#editReturnGroup")?.classList.toggle("hidden", !isEdit);

    if (isEdit) {
      this.editorSubMode = this.activeScriptKey === FULL_JSON_KEY ? "json" : "js";
    }

    this.renderCurrentScript();
  }

  open(leftJsonObj, rightJsonObj, options = {}) {
    this.disposeActiveEditors();

    this.leftJsonObj = leftJsonObj;
    this.rightJsonObj = rightJsonObj;
    this.hasLeftInput = options.hasLeft !== undefined ? options.hasLeft : Boolean(leftJsonObj);
    this.hasRightInput = options.hasRight !== undefined ? options.hasRight : Boolean(rightJsonObj);
    this.singleSideMode =
      options.singleSideMode ||
      (this.hasLeftInput && !this.hasRightInput ? "left" : !this.hasLeftInput && this.hasRightInput ? "right" : null);
    this.leftTitleLabel = options.leftTitle || null;
    this.rightTitleLabel = options.rightTitle || null;
    this.applyTargetOverride = options.applyTargetOverride || null;
    this.lineEndingPreference = options.lineEndingPreference || "preserve";

    this.leftIndent = options.leftRawText ? JsonEngine.detectIndentation(options.leftRawText) : 2;
    this.rightIndent = options.rightRawText ? JsonEngine.detectIndentation(options.rightRawText) : 2;

    this.initialLeftFullJsonText =
      options.leftRawText !== undefined
        ? options.leftRawText
        : leftJsonObj
        ? JSON.stringify(leftJsonObj, null, this.leftIndent || 2)
        : "";
    this.initialRightFullJsonText =
      options.rightRawText !== undefined
        ? options.rightRawText
        : rightJsonObj
        ? JSON.stringify(rightJsonObj, null, this.rightIndent || 2)
        : "";

    this.leftFullJsonText = this.initialLeftFullJsonText;
    this.rightFullJsonText = this.initialRightFullJsonText;
    this.fullJsonModified = false;

    this.leftBlocks = leftJsonObj ? JsonEngine.findAllClientScripts(leftJsonObj) : [];
    this.rightBlocks = rightJsonObj ? JsonEngine.findAllClientScripts(rightJsonObj) : [];

    this.activeBlockIndex = 0;
    const hasScripts = this.leftBlocks.length > 0 || this.rightBlocks.length > 0;
    this.activeScriptKey = options.preferredScript || (hasScripts ? "prescript" : FULL_JSON_KEY);
    if (this.activeScriptKey !== FULL_JSON_KEY && !hasScripts) {
      this.activeScriptKey = FULL_JSON_KEY;
    }

    this.modifiedLeftScripts.clear();
    this.modifiedRightScripts.clear();
    this.mergeHistory = [];
    this.expandedRanges.clear();
    this.searchQuery = "";
    const searchInput = this.container.querySelector("#modalSearchInput");
    if (searchInput) searchInput.value = "";
    const searchCount = this.container.querySelector("#modalSearchCount");
    if (searchCount) searchCount.textContent = "";

    this.updateFooterButtons();
    this.renderBlockSelector();
    this.renderScriptTabs();
    this.switchViewMode(options.viewMode || "split");

    this.container.classList.remove("hidden");
    this.isOpen = true;
    document.body.classList.add("modal-open");
  }

  updateFooterButtons() {
    const btnOld = this.container.querySelector("#btnApplyOldJson");
    const btnNew = this.container.querySelector("#btnApplyNewJson");
    const btnBoth = this.container.querySelector("#btnApplyBothAndClose");
    if (!btnOld || !btnNew || !btnBoth) return;

    if (this.applyTargetOverride === "left") {
      btnOld.textContent = "💾 Apply Changes to Base (Original) JSON";
      btnOld.classList.remove("hidden");
      btnNew.classList.add("hidden");
      btnBoth.classList.add("hidden");
      return;
    }
    if (this.applyTargetOverride === "right") {
      btnNew.textContent = "💾 Apply Changes to Target JSON";
      btnNew.classList.remove("hidden");
      btnOld.classList.add("hidden");
      btnBoth.classList.add("hidden");
      return;
    }

    if (this.singleSideMode === "left") {
      btnOld.textContent = "💾 Apply Changes to Uploaded Base JSON";
      btnOld.classList.remove("hidden");
      btnNew.classList.add("hidden");
      btnBoth.classList.add("hidden");
    } else if (this.singleSideMode === "right") {
      btnOld.classList.add("hidden");
      btnNew.textContent = "💾 Apply Changes to Uploaded Target JSON";
      btnNew.classList.remove("hidden");
      btnBoth.classList.add("hidden");
    } else {
      btnOld.textContent = "Apply to Base (Old) JSON";
      btnNew.textContent = "Apply to Target (New) JSON";
      btnOld.classList.remove("hidden");
      btnNew.classList.remove("hidden");
      btnBoth.classList.remove("hidden");
    }
  }

  close() {
    this.disposeActiveEditors();
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

    const displayKeys = [FULL_JSON_KEY, ...existingKeys];

    if (!displayKeys.includes(this.activeScriptKey)) {
      this.activeScriptKey = FULL_JSON_KEY;
    }

    displayKeys.forEach(scriptKey => {
      const isFull = scriptKey === FULL_JSON_KEY;
      const leftVal = isFull
        ? this.leftFullJsonText
        : this.modifiedLeftScripts.get(scriptKey) ?? (leftBlock?.scripts?.[scriptKey]?.readable || "");
      const rightVal = isFull
        ? this.rightFullJsonText
        : this.modifiedRightScripts.get(scriptKey) ?? (rightBlock?.scripts?.[scriptKey]?.readable || "");

      const isDiff = leftVal !== rightVal;
      const isModified = isFull
        ? this.fullJsonModified
        : this.modifiedLeftScripts.has(scriptKey) || this.modifiedRightScripts.has(scriptKey);

      const tab = document.createElement("button");
      tab.className = `script-tab ${isFull ? "script-tab-fulljson" : ""} ${scriptKey === this.activeScriptKey ? "active" : ""}`;
      tab.dataset.script = scriptKey;

      let badgeHtml = "";
      if (isDiff) {
        badgeHtml = `<span class="tab-badge badge-diff">Diff</span>`;
      } else if (leftVal || rightVal) {
        badgeHtml = isModified
          ? `<span class="tab-badge badge-merged">✓ Merged</span>`
          : `<span class="tab-badge badge-same">Same</span>`;
      } else {
        badgeHtml = `<span class="tab-badge badge-empty">Empty</span>`;
      }

      const labelText = isFull ? "📄 Full JSON" : scriptKey;
      tab.innerHTML = `
        <span class="tab-name">${this.escapeHtml(labelText)}</span>
        ${badgeHtml}
      `;

      tab.addEventListener("click", () => {
        if (this.activeScriptKey === scriptKey) return;
        this.disposeActiveEditors();
        this.activeScriptKey = scriptKey;
        this.expandedRanges.clear();
        if (this.viewMode === "edit") {
          this.editorSubMode = scriptKey === FULL_JSON_KEY ? "json" : "js";
        }
        this.renderScriptTabs();
        this.renderCurrentScript();
      });

      tabsBar.appendChild(tab);
    });
  }

  getCurrentScripts() {
    if (this.activeScriptKey === FULL_JSON_KEY) {
      return {
        isFullJson: true,
        leftText: this.leftFullJsonText || "",
        rightText: this.rightFullJsonText || "",
        hadCrLf: false,
        path: "$ (Full JSON Document)"
      };
    }

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

    return { isFullJson: false, leftText, rightText, hadCrLf, path };
  }

  renderCurrentScript() {
    const body = this.container.querySelector("#modalDiffBody");
    const { isFullJson, leftText, rightText, hadCrLf, path } = this.getCurrentScripts();

    const diff = DiffEngine.computeDiff(leftText, rightText, {
      ignoreWhitespace: this.ignoreWhitespace
    });
    this.currentDiff = diff;
    this.currentHunkIndex = 0;

    this.updateStatusInfo(diff, path, hadCrLf, isFullJson);

    // Update toolbar button labels for Full JSON vs JS script
    const fmtBtn = this.container.querySelector("#btnFormatJs");
    const copyBtn = this.container.querySelector("#btnCopyCleanJs");
    if (fmtBtn) fmtBtn.title = isFullJson ? "Format JSON with 2-space indent" : "Format and indent readable JavaScript";
    if (copyBtn) {
      copyBtn.lastChild && (copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> ${isFullJson ? "Copy JSON" : "Copy Readable JS"}`);
    }

    const btnUndo = this.container.querySelector("#btnUndoMerge");
    if (btnUndo) {
      btnUndo.disabled = this.mergeHistory.length === 0;
    }

    if (this.viewMode === "split") {
      this.renderSplitView(body, diff, leftText, rightText, isFullJson);
    } else if (this.viewMode === "unified") {
      this.renderUnifiedView(body, diff, isFullJson);
    } else if (this.viewMode === "edit") {
      this.renderCodeMirrorEditor(body, leftText, rightText);
    }

    if (this.viewMode !== "edit" && this.searchQuery && this.searchQuery.trim()) {
      this.applyDiffSearch(false);
    }
  }

  updateStatusInfo(diff, path, hadCrLf, isFullJson = false) {
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

    footerPath.textContent = isFullJson ? "Path: $ (Entire JSON Document)" : `Path: ${path}.${this.activeScriptKey}`;
    footerStats.innerHTML = `<span class="diff-add">+${diff.stats.addedLines}</span> <span class="diff-del">-${diff.stats.deletedLines}</span> <span class="diff-mod">~${diff.stats.modifiedLines}</span>`;
  }

  /**
   * Collapses long identical sections (when enabled) so 5,000+ line JSON diffs stay crisp & instant
   */
  buildVisibleItems(alignedRows) {
    if (!this.collapseUnchanged || alignedRows.length <= 80) {
      return alignedRows.map((row, idx) => ({ kind: "row", row, idx }));
    }

    const contextRadius = 4;
    const total = alignedRows.length;
    const visible = new Uint8Array(total);
    let anyDiff = false;

    for (let i = 0; i < total; i++) {
      if (alignedRows[i].type !== "equal") {
        anyDiff = true;
        const start = Math.max(0, i - contextRadius);
        const end = Math.min(total - 1, i + contextRadius);
        for (let j = start; j <= end; j++) visible[j] = 1;
      }
    }

    // If completely identical, show top 40 lines + collapse rest so user sees content cleanly
    if (!anyDiff) {
      for (let i = 0; i < Math.min(40, total); i++) visible[i] = 1;
    }

    const items = [];
    let i = 0;
    while (i < total) {
      if (visible[i]) {
        items.push({ kind: "row", row: alignedRows[i], idx: i });
        i++;
      } else {
        const start = i;
        while (i < total && !visible[i]) i++;
        const end = i - 1;
        const count = end - start + 1;
        const rangeId = `${start}-${end}`;
        if (count < 10 || this.expandedRanges.has(rangeId)) {
          for (let j = start; j <= end; j++) {
            items.push({ kind: "row", row: alignedRows[j], idx: j });
          }
        } else {
          items.push({ kind: "collapsed", start, end, count, rangeId });
        }
      }
    }
    return items;
  }

  formatDiffCodeHtml(text = "", spans = null, spanMode = "modify") {
    if (spans && spans.length > 0 && text.length <= 2000) {
      return JsHighlighter.renderDiffSpans(spans, spanMode);
    }
    if (text.length > 2000) {
      // Avoid regex backtracking / sluggish DOM spans on massive single-line script strings
      return this.escapeHtml(text);
    }
    return JsHighlighter.highlightLine(text);
  }

  /**
   * Side-by-Side Split View with Line-by-Line Merging Controls
   */
  renderSplitView(container, diff, leftText, rightText, isFullJson = false) {
    const leftVal = isFullJson ? Validator.validateJson(leftText) : Validator.validateJs(leftText);
    const rightVal = isFullJson ? Validator.validateJson(rightText) : Validator.validateJs(rightText);
    const valLabel = isFullJson ? "JSON" : "JS";
    const leftPaneTitle = this.leftTitleLabel || (isFullJson ? "Base / Original JSON" : "Old / Base JSON Script");
    const rightPaneTitle = this.rightTitleLabel || (isFullJson ? "Target / Modified JSON" : "New / Updated JSON Script");
    const items = this.buildVisibleItems(diff.alignedRows);

    container.innerHTML = `
      <div class="split-diff-container">
        <!-- Left Pane: Old (Base) -->
        <div class="diff-pane diff-pane-left">
          <div class="pane-header">
            <div class="pane-title-group">
              <span class="pane-title">${this.escapeHtml(leftPaneTitle)}</span>
              <span class="tag-role">Receiving Merged Lines</span>
              <span class="val-pill ${leftVal.valid ? "pill-valid" : "pill-error"}" title="${leftVal.valid ? `Valid ${valLabel} syntax` : this.escapeHtml(leftVal.fixSuggestion || leftVal.message)}">
                ${leftVal.valid ? `✓ Valid ${valLabel}` : `✖ ${valLabel} Error (L${leftVal.line})`}
              </span>
            </div>
            <span class="pane-lines">${diff.stats.leftTotal} lines</span>
          </div>
          <div class="diff-scroll" id="scrollLeft">
            <div class="diff-rows" id="rowsLeft">
              ${items
                .map(item => {
                  if (item.kind === "collapsed") {
                    return `<div class="diff-collapsed-row" data-range="${item.rangeId}" title="Click to expand hidden unchanged lines">
                      <button class="btn-expand-collapsed" data-range="${item.rangeId}">⋯ Show ${item.count} unchanged lines (L${item.start + 1}–L${item.end + 1})</button>
                    </div>`;
                  }
                  const { row, idx } = item;
                  const left = row.left;
                  if (left.isPad) {
                    return `<div class="diff-row row-pad" data-row="${idx}">
                      <div class="line-num pad"></div>
                      <div class="line-code pad">&nbsp;</div>
                    </div>`;
                  }
                  const rowClass = row.type === "delete" ? "row-del" : row.type === "modify" ? "row-mod" : "row-eq";
                  const codeHtml = this.formatDiffCodeHtml(left.text, row.type === "modify" ? left.spans : null, "modify");

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
              ${items
                .map(item => {
                  if (item.kind === "collapsed") {
                    return `<div class="gutter-collapsed-row" data-range="${item.rangeId}">⋯</div>`;
                  }
                  const { row, idx } = item;
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
              <span class="pane-title">${this.escapeHtml(rightPaneTitle)}</span>
              <span class="tag-role">Source of Changes</span>
              <span class="val-pill ${rightVal.valid ? "pill-valid" : "pill-error"}" title="${rightVal.valid ? `Valid ${valLabel} syntax` : this.escapeHtml(rightVal.fixSuggestion || rightVal.message)}">
                ${rightVal.valid ? `✓ Valid ${valLabel}` : `✖ ${valLabel} Error (L${rightVal.line})`}
              </span>
            </div>
            <div class="pane-actions">
              <span class="pane-lines">${diff.stats.rightTotal} lines</span>
              <button class="btn-micro" id="btnSwitchToEdit" title="Open in Full IDE Code Editor">✎ Open Code Editor</button>
            </div>
          </div>
          <div class="diff-scroll" id="scrollRight">
            <div class="diff-rows" id="rowsRight">
              ${items
                .map(item => {
                  if (item.kind === "collapsed") {
                    return `<div class="diff-collapsed-row" data-range="${item.rangeId}" title="Click to expand hidden unchanged lines">
                      <button class="btn-expand-collapsed" data-range="${item.rangeId}">⋯ Show ${item.count} unchanged lines</button>
                    </div>`;
                  }
                  const { row, idx } = item;
                  const right = row.right;
                  if (right.isPad) {
                    return `<div class="diff-row row-pad" data-row="${idx}">
                      <div class="line-num pad"></div>
                      <div class="line-code pad">&nbsp;</div>
                    </div>`;
                  }
                  const rowClass = row.type === "insert" ? "row-add" : row.type === "modify" ? "row-mod" : "row-eq";
                  const codeHtml = this.formatDiffCodeHtml(right.text, row.type === "modify" ? right.spans : null, "modify");

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

    container.querySelectorAll(".btn-expand-collapsed").forEach(btn => {
      btn.addEventListener("click", () => {
        const rangeId = btn.dataset.range;
        this.expandedRanges.add(rangeId);
        const scrollTop = container.querySelector("#scrollLeft")?.scrollTop || 0;
        this.renderCurrentScript();
        const scL = container.querySelector("#scrollLeft");
        const scG = container.querySelector("#scrollGutter");
        const scR = container.querySelector("#scrollRight");
        if (scL) scL.scrollTop = scrollTop;
        if (scG) scG.scrollTop = scrollTop;
        if (scR) scR.scrollTop = scrollTop;
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

    const { isFullJson, leftText, rightText } = this.getCurrentScripts();

    this.mergeHistory.push({
      scriptKey: this.activeScriptKey,
      leftText,
      rightText
    });

    const merged = DiffEngine.mergeLine(leftText, rightText, row, direction);

    if (isFullJson) {
      this.leftFullJsonText = merged.textLeft;
      this.rightFullJsonText = merged.textRight;
      this.fullJsonModified = true;
      this.syncParsedObjectsFromFullJson();
    } else {
      this.modifiedLeftScripts.set(this.activeScriptKey, merged.textLeft);
      this.modifiedRightScripts.set(this.activeScriptKey, merged.textRight);
    }

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
    const { isFullJson, leftText, rightText } = this.getCurrentScripts();
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

    if (isFullJson) {
      this.leftFullJsonText = merged.textLeft;
      this.rightFullJsonText = merged.textRight;
      this.fullJsonModified = true;
      this.syncParsedObjectsFromFullJson();
    } else {
      this.modifiedLeftScripts.set(this.activeScriptKey, merged.textLeft);
      this.modifiedRightScripts.set(this.activeScriptKey, merged.textRight);
    }

    this.renderScriptTabs();
    this.renderCurrentScript();

    this.showToast("🎉 Merged ALL changed lines into Old version!");
  }

  undoLastMerge() {
    if (this.mergeHistory.length === 0) return;

    const lastState = this.mergeHistory.pop();
    if (lastState.scriptKey === FULL_JSON_KEY) {
      this.leftFullJsonText = lastState.leftText;
      this.rightFullJsonText = lastState.rightText;
      this.syncParsedObjectsFromFullJson();
    } else {
      this.modifiedLeftScripts.set(lastState.scriptKey, lastState.leftText);
      this.modifiedRightScripts.set(lastState.scriptKey, lastState.rightText);
    }

    this.renderScriptTabs();
    this.renderCurrentScript();

    this.showToast("↺ Undid last merge step");
  }

  resetCurrentScript() {
    if (this.activeScriptKey === FULL_JSON_KEY) {
      this.leftFullJsonText = this.initialLeftFullJsonText;
      this.rightFullJsonText = this.initialRightFullJsonText;
      this.fullJsonModified = false;
      this.syncParsedObjectsFromFullJson();
    } else {
      this.modifiedLeftScripts.delete(this.activeScriptKey);
      this.modifiedRightScripts.delete(this.activeScriptKey);
    }
    this.mergeHistory = [];
    this.expandedRanges.clear();

    this.renderScriptTabs();
    this.renderCurrentScript();

    const label = this.activeScriptKey === FULL_JSON_KEY ? "Full JSON" : this.activeScriptKey;
    this.showToast(`↺ Reset ${label} to initial JSON state`);
  }

  syncParsedObjectsFromFullJson() {
    try {
      this.leftJsonObj = JSON.parse(this.leftFullJsonText);
      this.leftBlocks = JsonEngine.findAllClientScripts(this.leftJsonObj);
    } catch (e) {}
    try {
      this.rightJsonObj = JSON.parse(this.rightFullJsonText);
      this.rightBlocks = JsonEngine.findAllClientScripts(this.rightJsonObj);
    } catch (e) {}
  }

  renderUnifiedView(container, diff, isFullJson = false) {
    const items = this.buildVisibleItems(diff.alignedRows);
    container.innerHTML = `
      <div class="unified-diff-container">
        <div class="diff-scroll" id="scrollUnified">
          <div class="diff-rows unified-rows">
            ${items
              .map(item => {
                if (item.kind === "collapsed") {
                  return `<div class="diff-collapsed-row" data-range="${item.rangeId}">
                    <button class="btn-expand-collapsed" data-range="${item.rangeId}">⋯ Show ${item.count} unchanged lines (L${item.start + 1}–L${item.end + 1})</button>
                  </div>`;
                }
                const { row, idx } = item;
                if (row.type === "equal") {
                  return `<div class="diff-row row-eq" data-row="${idx}">
                    <div class="line-num">${row.left.lineNum}</div>
                    <div class="line-num">${row.right.lineNum}</div>
                    <div class="diff-sign"> </div>
                    <div class="line-code"><pre><code>${this.formatDiffCodeHtml(row.left.text)}</code></pre></div>
                  </div>`;
                }

                let html = "";
                if (row.type === "delete" || row.type === "modify") {
                  const leftCode = this.formatDiffCodeHtml(row.left.text, row.type === "modify" ? row.left.spans : null, "del");

                  html += `<div class="diff-row row-del" data-row="${idx}">
                    <div class="line-num">${row.left.lineNum}</div>
                    <div class="line-num"></div>
                    <div class="diff-sign">-</div>
                    <div class="line-code"><pre><code>${leftCode}</code></pre></div>
                  </div>`;
                }

                if (row.type === "insert" || row.type === "modify") {
                  const rightCode = this.formatDiffCodeHtml(row.right.text, row.type === "modify" ? row.right.spans : null, "ins");

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

    container.querySelectorAll(".btn-expand-collapsed").forEach(btn => {
      btn.addEventListener("click", () => {
        this.expandedRanges.add(btn.dataset.range);
        const scrollTop = container.querySelector("#scrollUnified")?.scrollTop || 0;
        this.renderCurrentScript();
        const sc = container.querySelector("#scrollUnified");
        if (sc) sc.scrollTop = scrollTop;
      });
    });
  }

  applyDiffSearch(scrollToFirst = true) {
    const countEl = this.container.querySelector("#modalSearchCount");
    const q = (this.searchQuery || "").trim().toLowerCase();
    this.container.querySelectorAll(".diff-row.row-search-hit").forEach(el => el.classList.remove("row-search-hit"));
    this.searchMatches = [];
    this.searchMatchIdx = -1;

    if (!q || !this.currentDiff) {
      if (countEl) countEl.textContent = "";
      return;
    }

    // Find all matching row indices in the full diff
    for (let i = 0; i < this.currentDiff.alignedRows.length; i++) {
      const r = this.currentDiff.alignedRows[i];
      const hayL = (r.left?.text || "").toLowerCase();
      const hayR = (r.right?.text || "").toLowerCase();
      if (hayL.includes(q) || hayR.includes(q)) {
        this.searchMatches.push(i);
      }
    }

    if (this.searchMatches.length === 0) {
      if (countEl) countEl.textContent = "0 found";
      return;
    }

    this.searchMatchIdx = 0;
    if (countEl) countEl.textContent = `1/${this.searchMatches.length}`;
    if (scrollToFirst) {
      this.revealSearchMatchRow(this.searchMatches[0]);
    } else {
      this.highlightVisibleSearchMatches();
    }
  }

  stepDiffSearch(dir = 1) {
    if (!this.searchMatches.length) {
      this.applyDiffSearch(true);
      return;
    }
    this.searchMatchIdx = (this.searchMatchIdx + dir + this.searchMatches.length) % this.searchMatches.length;
    const countEl = this.container.querySelector("#modalSearchCount");
    if (countEl) countEl.textContent = `${this.searchMatchIdx + 1}/${this.searchMatches.length}`;
    this.revealSearchMatchRow(this.searchMatches[this.searchMatchIdx]);
  }

  revealSearchMatchRow(rowIdx) {
    // Expand collapsed range containing rowIdx if needed
    let targetEl = this.container.querySelector(`.diff-row[data-row="${rowIdx}"]`);
    if (!targetEl && this.collapseUnchanged) {
      this.container.querySelectorAll(".diff-collapsed-row").forEach(ph => {
        const parts = (ph.dataset.range || "").split("-").map(Number);
        if (parts.length === 2 && rowIdx >= parts[0] && rowIdx <= parts[1]) {
          this.expandedRanges.add(ph.dataset.range);
        }
      });
      this.renderCurrentScript();
    }
    this.highlightVisibleSearchMatches();
    const els = this.container.querySelectorAll(`.diff-row[data-row="${rowIdx}"]`);
    if (els.length > 0) {
      els[0].scrollIntoView({ behavior: "smooth", block: "center" });
      els.forEach(el => el.classList.add("row-search-active"));
    }
  }

  highlightVisibleSearchMatches() {
    this.container.querySelectorAll(".diff-row.row-search-hit, .diff-row.row-search-active").forEach(el => {
      el.classList.remove("row-search-hit", "row-search-active");
    });
    for (const idx of this.searchMatches) {
      this.container.querySelectorAll(`.diff-row[data-row="${idx}"]`).forEach(el => {
        el.classList.add("row-search-hit");
      });
    }
  }

  /**
   * Real IDE CodeMirror/Monaco Editor View with Fold All, Unfold All, Search & Real-Time Diagnostics
   */
  renderCodeMirrorEditor(container, leftText, rightText) {
    this.disposeActiveEditors();

    const isFullTab = this.activeScriptKey === FULL_JSON_KEY;
    const hasAnyScripts = this.leftBlocks.length > 0 || this.rightBlocks.length > 0;
    if (isFullTab && this.editorSubMode === "js") {
      this.editorSubMode = "json";
    }
    const isJsMode = this.editorSubMode === "js" && !isFullTab;
    const editingLeftSide = this.singleSideMode === "left" || this.applyTargetOverride === "left";
    const initialCode = isJsMode
      ? editingLeftSide ? leftText : rightText
      : editingLeftSide ? this.leftFullJsonText : this.rightFullJsonText;

    const scriptTabLabel = isFullTab ? (hasAnyScripts ? "JavaScript Script Editor" : "No Clientscripts") : `JavaScript (${this.activeScriptKey})`;

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
              ${hasAnyScripts ? `
              <button class="editor-type-btn ${isJsMode ? "active" : ""}" id="btnEditJsMode">
                ${this.escapeHtml(scriptTabLabel)}
              </button>` : ""}
              <button class="editor-type-btn ${!isJsMode ? "active" : ""}" id="btnEditJsonMode">
                Full JSON Bundle Editor
              </button>
            </div>
            <div class="editor-val-badge val-ok" id="editorValBadge" title="Click to view syntax diagnostics">
              ✓ Valid ${isJsMode ? "JavaScript" : "JSON"}
            </div>
          </div>
          <div class="subnav-right">
            <span class="editor-cursor-pos" id="editorCursorPos">Ln 1, Col 1</span>
            <button class="btn-tool" id="btnModalIdeFoldAll" title="Fold all code blocks">Fold All</button>
            <button class="btn-tool" id="btnModalIdeUnfoldAll" title="Unfold all code blocks">Unfold All</button>
            <button class="btn-tool" id="btnModalIdeSearch" title="Find in editor (Cmd/Ctrl+F)">Search</button>
            <button class="btn-tool" id="btnFormatEditorCode" title="Auto-indent and format code">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
              Auto-Format
            </button>
          </div>
        </div>

        <!-- Real-time Diagnostics Drawer -->
        <div class="editor-diagnostics-drawer hidden" id="editorDiagDrawer"></div>

        <!-- Editor Mount Area -->
        <div class="codemirror-mount" id="modalCodeMirrorMount"></div>

        <!-- Editor Bottom Status Bar -->
        <div class="editor-bottom-bar">
          <div class="editor-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span><strong>IDE Editor</strong>: Syntax Checking, Code Folding, Search (<strong>Cmd/Ctrl+F</strong>), Rainbow Brackets &amp; Auto-Format.</span>
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

      if (this.editorSubMode === "js" && !isFullTab) {
        if (editingLeftSide) {
          this.modifiedLeftScripts.set(this.activeScriptKey, val);
        } else {
          this.modifiedRightScripts.set(this.activeScriptKey, val);
        }
        const diag = Validator.validateJs(val);
        this.updateEditorDiagnostics(diag);
      } else {
        this.fullJsonModified = true;
        if (editingLeftSide) {
          this.leftFullJsonText = val;
        } else {
          this.rightFullJsonText = val;
        }
        try {
          const parsed = JSON.parse(val);
          if (editingLeftSide) {
            this.leftJsonObj = parsed;
            this.leftBlocks = JsonEngine.findAllClientScripts(parsed);
          } else {
            this.rightJsonObj = parsed;
            this.rightBlocks = JsonEngine.findAllClientScripts(parsed);
          }
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
        minimap: true,
        onPaste: () => setTimeout(() => runValidation(), 20)
      });

      this.modalMonacoInstance.onDidChangeCursorPosition(e => {
        const posEl = container.querySelector("#editorCursorPos");
        if (posEl) posEl.textContent = `Ln ${e.position.lineNumber}, Col ${e.position.column}`;
      });

      let debounceTimer = null;
      this.modalMonacoInstance.onDidChangeModelContent(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => runValidation(), 120);
      });

      setTimeout(() => {
        this.modalMonacoInstance?.layout();
        runValidation();
      }, 60);
    }
    // 2. Fallback: Initialize CodeMirror if Monaco is not available
    else if (typeof CodeMirror !== "undefined") {
      this.modalMonacoInstance = null;
      const braceFold = CodeMirror.fold?.brace;
      this.cmModalInstance = CodeMirror(mountEl, {
        value: initialCode,
        mode: isJsMode ? "javascript" : { name: "javascript", json: true },
        theme: "material-darker",
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        foldOptions: braceFold && !isJsMode ? { rangeFinder: braceFold } : undefined,
        extraKeys: {
          "Ctrl-Q": cm => cm.foldCode && cm.foldCode(cm.getCursor()),
          "Ctrl-F": "findPersistent",
          "Cmd-F": "findPersistent",
          "Ctrl-G": "jumpToLine",
          "Cmd-G": "jumpToLine"
        },
        indentUnit: isJsMode ? 4 : 2,
        tabSize: isJsMode ? 4 : 2,
        indentWithTabs: false,
        lineWrapping: false
      });

      this.cmModalInstance.on("cursorActivity", () => {
        const pos = this.cmModalInstance.getCursor();
        const posEl = container.querySelector("#editorCursorPos");
        if (posEl) posEl.textContent = `Ln ${pos.line + 1}, Col ${pos.ch + 1}`;
      });

      let debounceTimer = null;
      this.cmModalInstance.on("change", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => runValidation(), 120);
      });

      setTimeout(() => {
        this.cmModalInstance?.refresh();
        runValidation();
      }, 60);
    } else {
      mountEl.innerHTML = `<textarea class="code-textarea" id="scriptTextarea" style="width:100%;height:100%;">${this.escapeHtml(initialCode)}</textarea>`;
      const ta = mountEl.querySelector("#scriptTextarea");
      ta.addEventListener("input", () => {
        runValidation(ta.value);
      });
    }

    // Modal IDE Fold All / Unfold All / Search buttons
    container.querySelector("#btnModalIdeFoldAll")?.addEventListener("click", () => {
      if (this.modalMonacoInstance) {
        monacoManager.runAction(this.modalMonacoInstance, "editor.foldAll");
      } else if (this.cmModalInstance && typeof CodeMirror !== "undefined" && CodeMirror.commands.foldAll) {
        CodeMirror.commands.foldAll(this.cmModalInstance);
      }
    });

    container.querySelector("#btnModalIdeUnfoldAll")?.addEventListener("click", () => {
      if (this.modalMonacoInstance) {
        monacoManager.runAction(this.modalMonacoInstance, "editor.unfoldAll");
      } else if (this.cmModalInstance && typeof CodeMirror !== "undefined" && CodeMirror.commands.unfoldAll) {
        CodeMirror.commands.unfoldAll(this.cmModalInstance);
      }
    });

    container.querySelector("#btnModalIdeSearch")?.addEventListener("click", () => {
      if (this.modalMonacoInstance) {
        monacoManager.runAction(this.modalMonacoInstance, "actions.find");
      } else if (this.cmModalInstance && typeof CodeMirror !== "undefined" && CodeMirror.commands.findPersistent) {
        // Note: do NOT call cm.focus() after findPersistent because dialog closes on blur!
        CodeMirror.commands.findPersistent(this.cmModalInstance);
      }
    });

    // Return to Diff actions with syntax check warning
    const returnToDiffHandler = () => {
      if (this.currentEditorDiag && !this.currentEditorDiag.valid) {
        const proceed = window.confirm(
          `⚠️ ${isJsMode ? "JavaScript" : "JSON"} Syntax Warning:\n` +
          `Your edited code contains a syntax error at Line ${this.currentEditorDiag.line || 1}, Col ${this.currentEditorDiag.column || 1}:\n` +
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
      if (this.activeScriptKey === FULL_JSON_KEY) {
        const block = this.rightBlocks[0] || this.leftBlocks[0];
        const firstKey = block ? Object.keys(block.scripts).find(k => block.scripts[k].exists) : null;
        if (firstKey) this.activeScriptKey = firstKey;
      }
      this.editorSubMode = "js";
      this.renderScriptTabs();
      this.renderCurrentScript();
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
        if (this.editorSubMode === "json") {
          try {
            const formatted = JSON.stringify(JSON.parse(this.modalMonacoInstance.getValue()), null, 2);
            this.modalMonacoInstance.setValue(formatted);
            runValidation(formatted);
            this.showToast("⚡ Formatted JSON!");
            return;
          } catch (e) {}
        } else {
          const formatted = JsBeautifier.beautify(this.modalMonacoInstance.getValue(), 4);
          this.modalMonacoInstance.setValue(formatted);
          runValidation(formatted);
          this.showToast("⚡ Formatted JavaScript!");
          return;
        }
      }
      if (!this.cmModalInstance) return;
      const val = this.cmModalInstance.getValue();
      let formatted = val;
      if (this.editorSubMode === "js") {
        formatted = JsBeautifier.beautify(val, 4);
      } else {
        try {
          formatted = JSON.stringify(JSON.parse(val), null, 2);
        } catch (e) {}
      }
      this.cmModalInstance.setValue(formatted);
      runValidation(formatted);
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
    let targetRow = this.container.querySelector(`.diff-row[data-row="${hunk.startRow}"]`);
    if (!targetRow && this.collapseUnchanged) {
      this.container.querySelectorAll(".diff-collapsed-row").forEach(ph => {
        const parts = (ph.dataset.range || "").split("-").map(Number);
        if (parts.length === 2 && hunk.startRow >= parts[0] && hunk.startRow <= parts[1]) {
          this.expandedRanges.add(ph.dataset.range);
        }
      });
      this.renderCurrentScript();
      targetRow = this.container.querySelector(`.diff-row[data-row="${hunk.startRow}"]`);
    }

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
    const { isFullJson, leftText, rightText } = this.getCurrentScripts();
    if (isFullJson) {
      let formattedLeft = leftText;
      let formattedRight = rightText;
      try { formattedLeft = JSON.stringify(JSON.parse(leftText), null, 2); } catch (e) {}
      try { formattedRight = JSON.stringify(JSON.parse(rightText), null, 2); } catch (e) {}
      this.leftFullJsonText = formattedLeft;
      this.rightFullJsonText = formattedRight;
      this.renderScriptTabs();
      this.renderCurrentScript();
      this.showToast("✨ Formatted both JSON bundles cleanly!");
      return;
    }

    const formattedLeft = JsBeautifier.beautify(leftText, 4);
    const formattedRight = JsBeautifier.beautify(rightText, 4);

    this.modifiedLeftScripts.set(this.activeScriptKey, formattedLeft);
    this.modifiedRightScripts.set(this.activeScriptKey, formattedRight);

    this.renderScriptTabs();
    this.renderCurrentScript();

    this.showToast(`✨ Formatted ${this.activeScriptKey} on both sides with clean 4-space indentation!`);
  }

  copyCleanJs() {
    const { isFullJson, leftText, rightText } = this.getCurrentScripts();
    const toCopy = this.singleSideMode === "right" ? rightText : leftText;
    navigator.clipboard.writeText(toCopy).then(() => {
      this.showToast(
        isFullJson ? "📋 Copied JSON document to clipboard!" : `📋 Copied merged readable ${this.activeScriptKey} to clipboard!`
      );
    });
  }

  applyMergedChanges(target = "both") {
    let baseObj = this.leftJsonObj;
    let targetObj = this.rightJsonObj;
    let baseRawText = null;
    let targetRawText = null;

    // 1. Handle Full JSON edits/merges first if Full JSON was directly modified
    if (this.fullJsonModified || this.activeScriptKey === FULL_JSON_KEY) {
      const leftSrc =
        (this.singleSideMode === "left" || this.applyTargetOverride === "left") &&
        this.leftFullJsonText === this.initialLeftFullJsonText &&
        this.rightFullJsonText !== this.initialRightFullJsonText
          ? this.rightFullJsonText
          : this.leftFullJsonText;

      if (target === "old" || target === "both") {
        const diagL = Validator.validateJson(leftSrc);
        if (!diagL.valid) {
          const proceed = window.confirm(
            `⚠️ Base JSON has a syntax error at Line ${diagL.line || 1}: "${diagL.message}". Apply raw text anyway?`
          );
          if (!proceed) return false;
          baseRawText = leftSrc;
        } else {
          baseObj = diagL.data;
          baseRawText = leftSrc;
        }
      }
      if (target === "new" || target === "both") {
        const diagR = Validator.validateJson(this.rightFullJsonText);
        if (!diagR.valid) {
          const proceed = window.confirm(
            `⚠️ Target JSON has a syntax error at Line ${diagR.line || 1}: "${diagR.message}". Apply raw text anyway?`
          );
          if (!proceed) return false;
          targetRawText = this.rightFullJsonText;
        } else {
          targetObj = diagR.data;
          targetRawText = this.rightFullJsonText;
        }
      }
    }

    // 2. Also apply any per-script edits made in JS script tabs
    const modifiedScriptKeys = new Set([
      ...this.modifiedLeftScripts.keys(),
      ...this.modifiedRightScripts.keys()
    ]);

    if (modifiedScriptKeys.size > 0) {
      const leftBlock = this.leftBlocks[this.activeBlockIndex] || this.leftBlocks[0];
      const rightBlock = this.rightBlocks[this.activeBlockIndex] || this.rightBlocks[0];

      for (const scriptKey of modifiedScriptKeys) {
        const mergedCleanJs =
          this.modifiedLeftScripts.get(scriptKey) ??
          this.modifiedRightScripts.get(scriptKey) ??
          (leftBlock?.scripts?.[scriptKey]?.readable || "");

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
            if (!proceed) return false;
          }
        }

        if ((target === "old" || target === "both") && baseObj && leftBlock) {
          const originalHadCrLf = leftBlock.scripts[scriptKey]?.hasCrLf ?? true;
          const res = JsonEngine.updateScript(baseObj, leftBlock.path, scriptKey, mergedCleanJs, {
            lineEndingPreference: this.lineEndingPreference,
            indentation: this.leftIndent || 2,
            originalHadCrLf
          });
          baseObj = res.updatedObj;
          baseRawText = res.updatedJsonString;
        }

        if ((target === "new" || target === "both") && targetObj && rightBlock) {
          const originalHadCrLf = rightBlock.scripts[scriptKey]?.hasCrLf ?? true;
          const res = JsonEngine.updateScript(targetObj, rightBlock.path, scriptKey, mergedCleanJs, {
            lineEndingPreference: this.lineEndingPreference,
            indentation: this.rightIndent || 2,
            originalHadCrLf
          });
          targetObj = res.updatedObj;
          targetRawText = res.updatedJsonString;
        }
      }
    }

    this.onApplyCallback({
      baseObj: (target === "old" || target === "both") ? baseObj : null,
      targetObj: (target === "new" || target === "both") ? targetObj : null,
      baseRawText: (target === "old" || target === "both") ? baseRawText : null,
      targetRawText: (target === "new" || target === "both") ? targetRawText : null
    });

    const targetLabel = target === "both" ? "both Base & Target JSONs" : target === "old" ? "Base (Old) JSON" : "Target (New) JSON";
    this.showToast(`💾 Applied changes to ${targetLabel}!`);
    return true;
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

DiffModal.FULL_JSON_KEY = FULL_JSON_KEY;


/* --- js/app.js --- */
/**
 * Main Application Orchestrator for InoJson Script Compare & Diff Studio
 * Features CodeMirror + VS Code Monaco JSON/JS editing on both panels, deep JSON & JavaScript
 * validation, uploaded file modification tracking with active save-to-original-file sync,
 * Full JSON diffing & merging, and unescaped clientscripts DiffModal integration.
 */








class InoJsonApp {
  constructor() {
    this.panelLeft = document.getElementById("panelLeft");
    this.panelRight = document.getElementById("panelRight");
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
    this.btnCompareFullJson = document.getElementById("btnCompareFullJson");

    // Quick Converter elements
    this.cmCleanJsMount = document.getElementById("cmCleanJsMount");
    this.convCleanValPanel = document.getElementById("convCleanValPanel");
    this.cleanTextarea = document.getElementById("converterCleanInput");

    this.monacoLeft = null;
    this.monacoRight = null;
    this.monacoCleanJs = null;
    this.monacoLeftDecorations = [];
    this.monacoRightDecorations = [];
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
    this._suppressDirtyCheck = false;
    this._autoSaveTimers = { left: null, right: null };

    // Track uploaded/active file handles & baseline content for obvious change detection & disk sync
    this.fileState = {
      left: {
        fileName: null,
        fileHandle: null,
        originalText: null,
        lastSavedText: null,
        isDirtyFromUpload: false,
        isDirtyDisk: false,
        autoSync: false,
        lastSavedAt: null
      },
      right: {
        fileName: null,
        fileHandle: null,
        originalText: null,
        lastSavedText: null,
        isDirtyFromUpload: false,
        isDirtyDisk: false,
        autoSync: false,
        lastSavedAt: null
      }
    };

    // Initialize Diff Modal with two-way merge support, Full JSON diffing & full IDE editor
    this.diffModal = new DiffModal({
      monacoManager,
      onApply: ({ baseObj, targetObj, baseRawText, targetRawText }) => {
        if (baseRawText !== null && baseRawText !== undefined) {
          this.setLeftJson(baseRawText);
        } else if (baseObj) {
          const indent = JsonEngine.detectIndentation(this.getLeftText() || "") || 2;
          this.setLeftJson(JSON.stringify(baseObj, null, indent));
        }

        if (targetRawText !== null && targetRawText !== undefined) {
          this.setRightJson(targetRawText);
        } else if (targetObj) {
          const indent = JsonEngine.detectIndentation(this.getRightText() || "") || 2;
          this.setRightJson(JSON.stringify(targetObj, null, indent));
        }

        this.analyzeInputs();

        // Actively persist to original uploaded file if handle is writable/autoSync active
        if ((baseRawText != null || baseObj) && this.fileState.left.fileHandle) {
          this.syncChangeToOriginalFile("left", { onlyIfGranted: !this.fileState.left.autoSync });
        }
        if ((targetRawText != null || targetObj) && this.fileState.right.fileHandle) {
          this.syncChangeToOriginalFile("right", { onlyIfGranted: !this.fileState.right.autoSync });
        }

        this.showToast("💾 Updated JSON bundle(s) cleanly!");
      }
    });

    this.init();
  }

  init() {
    this.initCodeMirrorPanels();
    this.initMonacoPanels();
    this.bindEvents();
    this.bindFileUploads();
    this.bindFileSyncActions();
    this.bindValidationActions();
    this.bindQuickConverter();

    // Start with clean inputs — analyze initial state without injecting sample data
    this.analyzeInputs();
  }

  initMonacoPanels() {
    monacoManager.onReady(() => {
      const leftVal = this.getLeftText();
      const rightVal = this.getRightText();
      const cleanJsVal = this.getCleanJsText();

      // Ensure mounts are visible and fallback textareas are hidden even if fallback ran earlier
      if (this.cmLeftMount) this.cmLeftMount.style.display = "";
      if (this.cmRightMount) this.cmRightMount.style.display = "";
      if (this.cmCleanJsMount) this.cmCleanJsMount.style.display = "";
      if (this.leftTextarea) this.leftTextarea.classList.add("hidden");
      if (this.rightTextarea) this.rightTextarea.classList.add("hidden");
      if (this.cleanTextarea) this.cleanTextarea.classList.add("hidden");

      // Clear CodeMirror mounts cleanly before mounting Monaco
      if (this.cmLeftMount) this.cmLeftMount.innerHTML = "";
      if (this.cmRightMount) this.cmRightMount.innerHTML = "";
      if (this.cmCleanJsMount) this.cmCleanJsMount.innerHTML = "";
      this.cmLeft = null;
      this.cmRight = null;
      this.cmCleanJs = null;
      this.activeLeftErrorLine = null;
      this.activeRightErrorLine = null;
      this.activeCleanJsErrorLine = null;

      let debounceTimerLeft = null;
      const scheduleLeftAnalyze = (delay = 150) => {
        clearTimeout(debounceTimerLeft);
        debounceTimerLeft = setTimeout(() => {
          if (this.leftTextarea) this.leftTextarea.value = this.getLeftText();
          this.analyzeInputs();
          this.handleSideEdited("left");
        }, delay);
      };

      let debounceTimerRight = null;
      const scheduleRightAnalyze = (delay = 150) => {
        clearTimeout(debounceTimerRight);
        debounceTimerRight = setTimeout(() => {
          if (this.rightTextarea) this.rightTextarea.value = this.getRightText();
          this.analyzeInputs();
          this.handleSideEdited("right");
        }, delay);
      };

      this.monacoLeft = monacoManager.create(this.cmLeftMount, {
        value: leftVal,
        language: "json",
        tabSize: 2,
        minimap: true,
        onChange: () => scheduleLeftAnalyze(150),
        onPaste: () => scheduleLeftAnalyze(15)
      });

      this.monacoRight = monacoManager.create(this.cmRightMount, {
        value: rightVal,
        language: "json",
        tabSize: 2,
        minimap: true,
        onChange: () => scheduleRightAnalyze(150),
        onPaste: () => scheduleRightAnalyze(15)
      });

      if (this.cmCleanJsMount) {
        let debounceClean = null;
        const scheduleCleanValidate = (delay = 150) => {
          clearTimeout(debounceClean);
          debounceClean = setTimeout(() => {
            if (this.cleanTextarea) this.cleanTextarea.value = this.getCleanJsText();
            this.validateCleanJs();
          }, delay);
        };
        this.monacoCleanJs = monacoManager.create(this.cmCleanJsMount, {
          value: cleanJsVal,
          language: "javascript",
          tabSize: 4,
          minimap: false,
          onChange: () => scheduleCleanValidate(150),
          onPaste: () => scheduleCleanValidate(15)
        });
      }

      this.analyzeInputs();
      this.validateCleanJs();
      this.showToast("⚡ Activated VS Code Monaco Editor (Folding, Search & Diagnostics ready)!");
    });
  }

  initCodeMirrorPanels() {
    if (typeof CodeMirror !== "undefined" && this.cmLeftMount && this.cmRightMount) {
      const braceFold = CodeMirror.fold && CodeMirror.fold.brace ? CodeMirror.fold.brace : undefined;

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
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        foldOptions: braceFold ? { rangeFinder: braceFold } : undefined,
        extraKeys: {
          "Ctrl-Q": cm => cm.foldCode && cm.foldCode(cm.getCursor()),
          "Ctrl-F": "findPersistent",
          "Cmd-F": "findPersistent",
          "Ctrl-G": "jumpToLine",
          "Cmd-G": "jumpToLine"
        }
      };

      this.cmLeft = CodeMirror(this.cmLeftMount, { ...cmJsonOpts });
      this.cmRight = CodeMirror(this.cmRightMount, { ...cmJsonOpts });

      let timerL = null;
      const scheduleL = (delay = 220) => {
        clearTimeout(timerL);
        timerL = setTimeout(() => {
          if (this.cmLeft && this.leftTextarea) this.leftTextarea.value = this.cmLeft.getValue();
          this.analyzeInputs();
          this.handleSideEdited("left");
        }, delay);
      };

      let timerR = null;
      const scheduleR = (delay = 220) => {
        clearTimeout(timerR);
        timerR = setTimeout(() => {
          if (this.cmRight && this.rightTextarea) this.rightTextarea.value = this.cmRight.getValue();
          this.analyzeInputs();
          this.handleSideEdited("right");
        }, delay);
      };

      this.cmLeft.on("change", () => scheduleL(220));
      this.cmRight.on("change", () => scheduleR(220));

      // Instant validation on paste via both inputRead and native DOM paste
      this.cmLeft.on("inputRead", (cm, change) => {
        if (change.origin === "paste") scheduleL(20);
      });
      this.cmRight.on("inputRead", (cm, change) => {
        if (change.origin === "paste") scheduleR(20);
      });
      this.cmLeft.getWrapperElement().addEventListener("paste", () => scheduleL(30));
      this.cmRight.getWrapperElement().addEventListener("paste", () => scheduleR(30));

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
          foldOptions: braceFold ? { rangeFinder: braceFold } : undefined,
          extraKeys: {
            "Ctrl-Q": cm => cm.foldCode && cm.foldCode(cm.getCursor()),
            "Ctrl-F": "findPersistent",
            "Cmd-F": "findPersistent",
            "Ctrl-G": "jumpToLine",
            "Cmd-G": "jumpToLine"
          }
        });
      }
    } else {
      // Fallback: show raw textareas cleanly if CodeMirror is unavailable
      if (this.leftTextarea) this.leftTextarea.classList.remove("hidden");
      if (this.rightTextarea) this.rightTextarea.classList.remove("hidden");
      if (this.cleanTextarea) this.cleanTextarea.classList.remove("hidden");
      if (this.cmLeftMount) this.cmLeftMount.style.display = "none";
      if (this.cmRightMount) this.cmRightMount.style.display = "none";
      if (this.cmCleanJsMount) this.cmCleanJsMount.style.display = "none";
    }
  }

  getLeftText() {
    if (this.monacoLeft) return this.monacoLeft.getValue();
    return this.cmLeft ? this.cmLeft.getValue() : this.leftTextarea ? this.leftTextarea.value : "";
  }

  getRightText() {
    if (this.monacoRight) return this.monacoRight.getValue();
    return this.cmRight ? this.cmRight.getValue() : this.rightTextarea ? this.rightTextarea.value : "";
  }

  getCleanJsText() {
    if (this.monacoCleanJs) return this.monacoCleanJs.getValue();
    return this.cmCleanJs ? this.cmCleanJs.getValue() : this.cleanTextarea ? this.cleanTextarea.value : "";
  }

  setLeftJson(text) {
    this._suppressDirtyCheck = true;
    try {
      if (this.monacoLeft) {
        this.monacoLeft.setValue(text);
      }
      if (this.cmLeft) {
        this.cmLeft.setValue(text);
      }
      if (this.leftTextarea) {
        this.leftTextarea.value = text;
      }
    } finally {
      this._suppressDirtyCheck = false;
    }
  }

  setRightJson(text) {
    this._suppressDirtyCheck = true;
    try {
      if (this.monacoRight) {
        this.monacoRight.setValue(text);
      }
      if (this.cmRight) {
        this.cmRight.setValue(text);
      }
      if (this.rightTextarea) {
        this.rightTextarea.value = text;
      }
    } finally {
      this._suppressDirtyCheck = false;
    }
  }

  setCleanJsText(text) {
    if (this.monacoCleanJs) {
      this.monacoCleanJs.setValue(text);
    }
    if (this.cmCleanJs) {
      this.cmCleanJs.setValue(text);
    }
    if (this.cleanTextarea) {
      this.cleanTextarea.value = text;
    }
  }

  bindEvents() {
    // Textarea input/paste handlers (if fallback active)
    let debounceTimer = null;
    const onInput = (side, delay = 200) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.analyzeInputs();
        this.handleSideEdited(side);
      }, delay);
    };

    this.leftTextarea?.addEventListener("input", () => onInput("left", 200));
    this.rightTextarea?.addEventListener("input", () => onInput("right", 200));
    this.leftTextarea?.addEventListener("paste", () => onInput("left", 20));
    this.rightTextarea?.addEventListener("paste", () => onInput("right", 20));

    // Open ClientScripts Diff Dialog CTA button
    this.btnOpenDiffModal?.addEventListener("click", () => {
      this.openDiffDialog();
    });

    // Open Full JSON Compare CTA button
    this.btnCompareFullJson?.addEventListener("click", () => {
      this.openFullJsonDiff();
    });

    // Sample data button
    document.getElementById("btnLoadSample")?.addEventListener("click", () => {
      this.loadSampleData();
      this.showToast("🚀 Loaded realistic sample low-code bundles!");
    });

    // Clear all button
    document.getElementById("btnClearAll")?.addEventListener("click", () => {
      this.clearFileState("left");
      this.clearFileState("right");
      this.setLeftJson("");
      this.setRightJson("");
      this.analyzeInputs();
      this.showToast("Cleared both JSON inputs");
    });

    // Swap Left & Right button
    document.getElementById("btnSwap")?.addEventListener("click", () => {
      const tempText = this.getLeftText();
      const tempState = { ...this.fileState.left };
      this.fileState.left = { ...this.fileState.right };
      this.fileState.right = tempState;

      this.setLeftJson(this.getRightText());
      this.setRightJson(tempText);
      this.analyzeInputs();
      this.updateFileSyncUI("left");
      this.updateFileSyncUI("right");
      this.showToast("🔄 Swapped Left and Right JSONs");
    });

    // Format Left / Right JSON buttons
    document.getElementById("btnFormatLeftJson")?.addEventListener("click", () => {
      this.formatPanelJson("left");
    });
    document.getElementById("btnFormatRightJson")?.addEventListener("click", () => {
      this.formatPanelJson("right");
    });

    // Copy & Download Left (Base) JSON
    document.getElementById("btnCopyLeftJson")?.addEventListener("click", () => {
      navigator.clipboard.writeText(this.getLeftText()).then(() => {
        this.showToast("📋 Copied Base JSON to clipboard!");
      });
    });

    document.getElementById("btnDownloadLeftJson")?.addEventListener("click", () => {
      const name = this.fileState.left.fileName || "bundle_base_merged.json";
      this.downloadJsonFile(this.getLeftText(), name);
    });

    // Copy & Download Right (Target) JSON
    document.getElementById("btnCopyRightJson")?.addEventListener("click", () => {
      navigator.clipboard.writeText(this.getRightText()).then(() => {
        this.showToast("📋 Copied Target JSON to clipboard!");
      });
    });

    document.getElementById("btnDownloadRightJson")?.addEventListener("click", () => {
      const name = this.fileState.right.fileName || "bundle_target_updated.json";
      this.downloadJsonFile(this.getRightText(), name);
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
          monacoManager.runAction(m, "editor.foldAll");
        } else if (cm) {
          if (typeof CodeMirror !== "undefined" && CodeMirror.commands.foldAll) {
            CodeMirror.commands.foldAll(cm);
          } else if (cm.foldCode) {
            cm.operation(() => {
              for (let i = 0; i < cm.lineCount(); i++) {
                try { cm.foldCode({ line: i, ch: 0 }, null, "fold"); } catch (e) {}
              }
            });
          }
        }
      });

      document.getElementById(unfoldId)?.addEventListener("click", () => {
        const m = getMonaco();
        const cm = getCm();
        if (m) {
          monacoManager.runAction(m, "editor.unfoldAll");
        } else if (cm) {
          if (typeof CodeMirror !== "undefined" && CodeMirror.commands.unfoldAll) {
            CodeMirror.commands.unfoldAll(cm);
          } else {
            cm.operation(() => {
              cm.getAllMarks().filter(mk => mk.__isFold).forEach(mk => mk.clear());
            });
          }
        }
      });

      document.getElementById(searchId)?.addEventListener("click", () => {
        const m = getMonaco();
        const cm = getCm();
        if (m) {
          monacoManager.runAction(m, "actions.find");
        } else if (cm) {
          // NOTE: Do NOT call cm.focus() after findPersistent because dialog closes on focusout!
          if (typeof CodeMirror !== "undefined" && CodeMirror.commands.findPersistent) {
            CodeMirror.commands.findPersistent(cm);
          } else if (typeof CodeMirror !== "undefined" && CodeMirror.commands.find) {
            CodeMirror.commands.find(cm);
          }
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
    bindEditorToolbar(
      "btnFoldAllCleanJs", "btnUnfoldAllCleanJs", "btnSearchCleanJs",
      () => this.monacoCleanJs, () => this.cmCleanJs
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

        if (targetView === "viewBundleComparator") {
          setTimeout(() => {
            this.monacoLeft?.layout();
            this.monacoRight?.layout();
            this.cmLeft?.refresh();
            this.cmRight?.refresh();
          }, 50);
        } else if (targetView === "viewQuickConverter") {
          setTimeout(() => {
            this.monacoCleanJs?.layout();
            this.cmCleanJs?.refresh();
          }, 50);
        }
      });
    });
  }

  formatPanelJson(side) {
    const text = side === "left" ? this.getLeftText() : this.getRightText();
    if (!text.trim()) return;
    try {
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);
      if (side === "left") {
        this.setLeftJson(formatted);
      } else {
        this.setRightJson(formatted);
      }
      this.analyzeInputs();
      this.handleSideEdited(side);
      this.showToast(`⚡ Formatted ${side === "left" ? "Base" : "Target"} JSON cleanly!`);
    } catch (e) {
      this.showToast("⚠️ Fix JSON syntax error first (or click Auto-Fix JSON)");
    }
  }

  // ── Uploaded File Handling, Modification Detection & Original File Sync ──

  bindFileUploads() {
    this.setupFileUploader("left", "panelLeft", "dropZoneLeft", "fileInputLeft");
    this.setupFileUploader("right", "panelRight", "dropZoneRight", "fileInputRight");
  }

  setupFileUploader(side, panelId, dropZoneId, fileInputId) {
    const panel = document.getElementById(panelId);
    const dropZone = document.getElementById(dropZoneId);
    const fileInput = document.getElementById(fileInputId);
    if (!dropZone || !fileInput) return;

    const handleLoadedFile = (text, fileName, fileHandle = null) => {
      this.fileState[side] = {
        fileName,
        fileHandle,
        originalText: text,
        lastSavedText: text,
        isDirtyFromUpload: false,
        isDirtyDisk: false,
        autoSync: false,
        lastSavedAt: null
      };

      const chkAuto = document.getElementById(side === "left" ? "chkAutoSyncLeft" : "chkAutoSyncRight");
      if (chkAuto) chkAuto.checked = false;

      if (side === "left") {
        this.setLeftJson(text);
      } else {
        this.setRightJson(text);
      }
      this.analyzeInputs();
      this.updateFileSyncUI(side);
      this.showToast(`📄 Loaded ${fileName}${fileHandle ? " (Direct save to original file supported)" : ""}`);
    };

    dropZone.addEventListener("click", async () => {
      if (typeof window.showOpenFilePicker === "function") {
        try {
          const [handle] = await window.showOpenFilePicker({
            types: [{ description: "JSON Files", accept: { "application/json": [".json"] } }],
            multiple: false
          });
          if (!handle) return;
          const file = await handle.getFile();
          const text = await file.text();
          handleLoadedFile(text, file.name, handle);
          return;
        } catch (err) {
          if (err && err.name === "AbortError") return; // User closed picker
          // Fall through to standard <input type="file"> on non-abort error
        }
      }
      fileInput.click();
    });

    fileInput.addEventListener("change", e => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        handleLoadedFile(ev.target.result, file.name, null);
        fileInput.value = "";
      };
      reader.readAsText(file);
    });

    // Enable drag & drop anywhere on the panel (with FileSystemFileHandle acquisition if available)
    const dropTarget = panel || dropZone;
    dropTarget.addEventListener("dragover", e => {
      if (e.dataTransfer?.types?.includes("Files")) {
        e.preventDefault();
        dropTarget.classList.add("drag-hover");
      }
    });

    dropTarget.addEventListener("dragleave", e => {
      if (!dropTarget.contains(e.relatedTarget)) {
        dropTarget.classList.remove("drag-hover");
      }
    });

    dropTarget.addEventListener("drop", async e => {
      if (!e.dataTransfer?.files?.length) return;
      e.preventDefault();
      dropTarget.classList.remove("drag-hover");

      const item = e.dataTransfer.items?.[0];
      const fallbackFile = e.dataTransfer.files[0];

      if (item && typeof item.getAsFileSystemHandle === "function") {
        try {
          const handle = await item.getAsFileSystemHandle();
          if (handle && handle.kind === "file") {
            const file = await handle.getFile();
            const text = await file.text();
            handleLoadedFile(text, file.name, handle);
            return;
          }
        } catch (err) {
          // Fall back to standard FileReader below
        }
      }

      if (fallbackFile) {
        const reader = new FileReader();
        reader.onload = ev => handleLoadedFile(ev.target.result, fallbackFile.name, null);
        reader.readAsText(fallbackFile);
      }
    });
  }

  bindFileSyncActions() {
    const wireSide = side => {
      const cap = side === "left" ? "Left" : "Right";
      document.getElementById(`btnSaveFile${cap}`)?.addEventListener("click", () => {
        this.syncChangeToOriginalFile(side, { onlyIfGranted: false });
      });

      document.getElementById(`chkAutoSync${cap}`)?.addEventListener("change", async e => {
        const enabled = e.target.checked;
        const fs = this.fileState[side];
        if (!fs.fileHandle) {
          e.target.checked = false;
          this.showToast("Auto-Save requires opening or dropping a file via Chrome/Edge File Access");
          return;
        }
        if (enabled) {
          try {
            const perm = await fs.fileHandle.requestPermission({ mode: "readwrite" });
            if (perm !== "granted") {
              e.target.checked = false;
              fs.autoSync = false;
              this.showToast("⚠️ Write permission was not granted for original file");
              return;
            }
            fs.autoSync = true;
            await this.syncChangeToOriginalFile(side, { onlyIfGranted: true });
            this.showToast(`⚡ Auto-Save enabled: changes actively apply to ${fs.fileName}`);
          } catch (err) {
            e.target.checked = false;
            fs.autoSync = false;
          }
        } else {
          fs.autoSync = false;
          this.updateFileSyncUI(side);
        }
      });

      document.getElementById(`btnViewEdits${cap}`)?.addEventListener("click", () => {
        this.openFileChangesDiff(side);
      });

      document.getElementById(`btnRevert${cap}`)?.addEventListener("click", () => {
        const fs = this.fileState[side];
        if (fs.originalText === null) return;
        if (side === "left") {
          this.setLeftJson(fs.originalText);
        } else {
          this.setRightJson(fs.originalText);
        }
        this.analyzeInputs();
        this.updateFileSyncUI(side);
        this.showToast(`↺ Reverted ${fs.fileName || side} back to uploaded original`);
      });
    };

    wireSide("left");
    wireSide("right");
  }

  clearFileState(side) {
    this.fileState[side] = {
      fileName: null,
      fileHandle: null,
      originalText: null,
      lastSavedText: null,
      isDirtyFromUpload: false,
      isDirtyDisk: false,
      autoSync: false,
      lastSavedAt: null
    };
    const chk = document.getElementById(side === "left" ? "chkAutoSyncLeft" : "chkAutoSyncRight");
    if (chk) chk.checked = false;
    this.updateFileSyncUI(side);
  }

  handleSideEdited(side) {
    if (this._suppressDirtyCheck) return;
    const fs = this.fileState[side];
    if (fs.originalText === null) {
      // Even without an uploaded file, check if panel changed compared to initial analyze snapshot? No, keep file-bar focused
      return;
    }

    this.updateFileSyncUI(side);

    if (fs.autoSync && fs.fileHandle) {
      clearTimeout(this._autoSaveTimers[side]);
      this._autoSaveTimers[side] = setTimeout(() => {
        this.syncChangeToOriginalFile(side, { onlyIfGranted: true, silent: false });
      }, 350);
    }
  }

  updateFileSyncUI(side) {
    const cap = side === "left" ? "Left" : "Right";
    const fs = this.fileState[side];
    const bar = document.getElementById(`${side}FileBar`);
    const panel = document.getElementById(`panel${cap}`);
    const nameEl = document.getElementById(`${side}FileName`);
    const dirtyEl = document.getElementById(`${side}DirtyBadge`);
    const autoWrap = document.getElementById(`${side}AutoSyncWrap`);
    const btnSave = document.getElementById(`btnSaveFile${cap}`);
    const btnView = document.getElementById(`btnViewEdits${cap}`);
    const btnRevert = document.getElementById(`btnRevert${cap}`);
    const footerTip = document.getElementById(`${side}FooterTip`);

    if (!bar) return;

    const currentText = side === "left" ? this.getLeftText() : this.getRightText();
    if (fs.originalText === null && !fs.fileName) {
      bar.classList.add("hidden");
      panel?.classList.remove("panel-modified");
      this.clearEditorChangeDecorations(side);
      return;
    }

    bar.classList.remove("hidden");
    const isChangedFromUpload = fs.originalText !== null && currentText !== fs.originalText;
    const isDirtyDisk = fs.lastSavedText !== null && currentText !== fs.lastSavedText;
    fs.isDirtyFromUpload = isChangedFromUpload;
    fs.isDirtyDisk = isDirtyDisk;

    panel?.classList.toggle("panel-modified", isChangedFromUpload || isDirtyDisk);

    if (nameEl) {
      nameEl.textContent = `📄 ${fs.fileName || "Uploaded JSON"}`;
    }

    let diffStats = null;
    if (isChangedFromUpload && currentText.length < 600000 && fs.originalText.length < 600000) {
      diffStats = DiffEngine.computeDiff(fs.originalText, currentText);
      this.updateEditorChangeDecorations(side, diffStats);
    } else {
      this.clearEditorChangeDecorations(side);
    }

    if (dirtyEl) {
      if (isDirtyDisk) {
        const detail = diffStats ? ` (+${diffStats.stats.addedLines} / -${diffStats.stats.deletedLines} / ~${diffStats.stats.modifiedLines} lines)` : "";
        dirtyEl.className = "file-dirty-badge dirty";
        dirtyEl.textContent = fs.fileHandle ? `● Modified — unsaved to file${detail}` : `● Modified vs uploaded${detail}`;
      } else if (isChangedFromUpload) {
        dirtyEl.className = "file-dirty-badge saved-changed";
        dirtyEl.textContent = `✓ Saved edits to ${fs.fileName}${fs.lastSavedAt ? ` (${fs.lastSavedAt})` : ""}`;
      } else {
        dirtyEl.className = "file-dirty-badge clean";
        dirtyEl.textContent = fs.lastSavedAt ? `✓ Synced at ${fs.lastSavedAt}` : "✓ Unchanged";
      }
    }

    if (autoWrap) {
      autoWrap.classList.toggle("hidden", !fs.fileHandle);
    }
    if (btnSave) {
      btnSave.classList.toggle("hidden", !(isDirtyDisk || isChangedFromUpload));
      btnSave.textContent = fs.fileHandle ? `💾 Save to ${fs.fileName}` : `💾 Download ${fs.fileName}`;
    }
    if (btnView) {
      btnView.classList.toggle("hidden", !isChangedFromUpload);
    }
    if (btnRevert) {
      btnRevert.classList.toggle("hidden", !isChangedFromUpload);
    }

    if (footerTip) {
      if (isDirtyDisk && fs.fileHandle) {
        footerTip.innerHTML = `<strong style="color:#e3b341;">● Unsaved changes</strong> — click "Save to ${this.escapeHtml(fs.fileName)}" or enable Auto-Save`;
      } else if (isChangedFromUpload) {
        footerTip.innerHTML = `<strong style="color:#56d364;">✓ Active edits applied</strong> to ${this.escapeHtml(fs.fileName)}`;
      } else {
        footerTip.textContent = side === "left" ? "Receives merged lines from updated script" : "Ready for Prod commit when changes are applied";
      }
    }
  }

  updateEditorChangeDecorations(side, diff) {
    const m = side === "left" ? this.monacoLeft : this.monacoRight;
    if (m && typeof monaco !== "undefined" && m.deltaDecorations) {
      const decos = [];
      for (const row of diff.alignedRows) {
        if (row.type === "equal") continue;
        const ln = row.right?.lineNum;
        if (!ln) continue;
        const cls = row.type === "insert" ? "ino-gutter-added" : "ino-gutter-modified";
        decos.push({
          range: new monaco.Range(ln, 1, ln, 1),
          options: {
            isWholeLine: true,
            linesDecorationsClassName: cls,
            className: row.type === "insert" ? "ino-line-added-tint" : "ino-line-modified-tint"
          }
        });
      }
      const key = side === "left" ? "monacoLeftDecorations" : "monacoRightDecorations";
      this[key] = m.deltaDecorations(this[key], decos);
    }

    const cm = side === "left" ? this.cmLeft : this.cmRight;
    if (cm) {
      cm.operation(() => {
        for (let i = 0; i < cm.lineCount(); i++) {
          cm.removeLineClass(i, "wrap", "cm-dirty-line");
        }
        for (const row of diff.alignedRows) {
          if (row.type !== "equal" && row.right?.lineNum) {
            cm.addLineClass(row.right.lineNum - 1, "wrap", "cm-dirty-line");
          }
        }
      });
    }
  }

  clearEditorChangeDecorations(side) {
    const m = side === "left" ? this.monacoLeft : this.monacoRight;
    const key = side === "left" ? "monacoLeftDecorations" : "monacoRightDecorations";
    if (m && this[key]?.length) {
      this[key] = m.deltaDecorations(this[key], []);
    }
    const cm = side === "left" ? this.cmLeft : this.cmRight;
    if (cm) {
      cm.operation(() => {
        for (let i = 0; i < cm.lineCount(); i++) {
          cm.removeLineClass(i, "wrap", "cm-dirty-line");
        }
      });
    }
  }

  async syncChangeToOriginalFile(side, { onlyIfGranted = false, silent = false } = {}) {
    const fs = this.fileState[side];
    const currentText = side === "left" ? this.getLeftText() : this.getRightText();

    if (!fs.fileHandle) {
      // Fallback: download under original uploaded filename
      if (!onlyIfGranted) {
        this.downloadJsonFile(currentText, fs.fileName || `bundle_${side}_updated.json`);
        fs.lastSavedText = currentText;
        fs.lastSavedAt = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        this.updateFileSyncUI(side);
      }
      return;
    }

    try {
      let perm = await fs.fileHandle.queryPermission({ mode: "readwrite" });
      if (perm !== "granted") {
        if (onlyIfGranted) return;
        perm = await fs.fileHandle.requestPermission({ mode: "readwrite" });
      }
      if (perm !== "granted") {
        if (!silent) this.showToast("⚠️ Permission needed to overwrite original file — use Download JSON instead.");
        return;
      }

      const writable = await fs.fileHandle.createWritable();
      await writable.write(currentText);
      await writable.close();

      fs.lastSavedText = currentText;
      fs.lastSavedAt = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      this.updateFileSyncUI(side);
      if (!silent) {
        this.showToast(`💾 Saved changes directly to original file: ${fs.fileName}`);
      }
    } catch (err) {
      if (!silent) {
        this.showToast(`⚠️ Could not write directly to ${fs.fileName} (${err.message}). Downloaded copy instead.`);
        this.downloadJsonFile(currentText, fs.fileName || `bundle_${side}_updated.json`);
      }
    }
  }

  openFileChangesDiff(side) {
    const fs = this.fileState[side];
    if (fs.originalText === null) return;
    const currentText = side === "left" ? this.getLeftText() : this.getRightText();

    let origObj = null;
    let curObj = null;
    try { origObj = JSON.parse(fs.originalText); } catch (e) {}
    try { curObj = JSON.parse(currentText); } catch (e) {}

    this.diffModal.open(origObj, curObj, {
      preferredScript: DiffModal.FULL_JSON_KEY,
      leftRawText: fs.originalText,
      rightRawText: currentText,
      hasLeft: true,
      hasRight: true,
      leftTitle: `Uploaded Original (${fs.fileName || side})`,
      rightTitle: `Your Current Edits (${fs.fileName || side})`,
      applyTargetOverride: side,
      lineEndingPreference: this.lineEndingPreference
    });
  }

  loadSampleData() {
    this.clearFileState("left");
    this.clearFileState("right");
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

    // 4. Detect and render client scripts / JSON structure chips
    let leftBlocks = [];
    let rightBlocks = [];

    if (this.leftParsed) {
      leftBlocks = JsonEngine.findAllClientScripts(this.leftParsed);
      this.renderScriptsList(this.leftScriptsListEl, leftBlocks, this.leftParsed);
    } else if (!leftText) {
      this.leftScriptsListEl.innerHTML = `<span class="empty-hint">No JSON entered (optional for comparison)</span>`;
    } else {
      this.leftScriptsListEl.innerHTML = `<span class="empty-hint hint-error">✖ Invalid JSON syntax (see diagnostics panel below)</span>`;
    }

    if (this.rightParsed) {
      rightBlocks = JsonEngine.findAllClientScripts(this.rightParsed);
      this.renderScriptsList(this.rightScriptsListEl, rightBlocks, this.rightParsed);
    } else if (!rightText) {
      this.rightScriptsListEl.innerHTML = `<span class="empty-hint">No JSON entered (optional for comparison)</span>`;
    } else {
      this.rightScriptsListEl.innerHTML = `<span class="empty-hint hint-error">✖ Invalid JSON syntax (see diagnostics panel below)</span>`;
    }

    this.updateFileSyncUI("left");
    this.updateFileSyncUI("right");
    this.updateComparisonSummary(leftBlocks, rightBlocks, leftText, rightText);
  }

  renderValidationPanel(side, report, rawText) {
    const container = side === "left" ? this.leftValidationPanel : this.rightValidationPanel;
    if (!container) return;

    // Synchronize VS Code Monaco error markers on main bundle editor
    const monacoInstance = side === "left" ? this.monacoLeft : this.monacoRight;
    if (monacoInstance && typeof monaco !== "undefined" && monaco.editor) {
      const model = monacoInstance.getModel();
      if (model) {
        if (report.jsonValid || report.jsonDiag.isEmpty) {
          monaco.editor.setModelMarkers(model, "json-validator", []);
        } else {
          const diag = report.jsonDiag;
          const errLine = Math.min(model.getLineCount(), Math.max(1, diag.line || 1));
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

    if (!report.jsonValid && cm && report.jsonDiag && report.jsonDiag.line && !report.jsonDiag.isEmpty) {
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
          <span>Paste JSON from your IDE or upload/drop a .json file below to validate &amp; compare</span>
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
          ? `<button class="btn-val-autofix" data-side="${side}" title="Automatically fix trailing commas, copied property blocks, unquoted keys, single quotes, or comments">
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
    const scriptLabel =
      report.scriptsChecked > 0
        ? `✓ ${report.scriptsChecked} embedded script(s) valid JS`
        : "✓ Valid JSON (Ready for Full JSON Compare)";
    container.innerHTML = `
      <div class="val-bar-valid">
        <div class="val-bar-left">
          <svg class="val-icon-success" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="val-status-text">Valid JSON Structure (${lineCount} lines)</span>
          <span class="val-badge-clean">0 syntax errors</span>
        </div>
        <div class="val-bar-right">
          <span class="val-script-status">${scriptLabel}</span>
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
          this.handleSideEdited(side);
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
      }
    };

    this.leftValidationPanel?.addEventListener("click", e => handlePanelClick(e, "left"));
    this.rightValidationPanel?.addEventListener("click", e => handlePanelClick(e, "right"));

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
    const m = side === "left" ? this.monacoLeft : this.monacoRight;
    const cm = side === "left" ? this.cmLeft : this.cmRight;

    if (m && !isNaN(line)) {
      m.revealLineInCenter(line);
      m.setPosition({ lineNumber: line, column: col });
      m.focus();
    } else if (cm && !isNaN(line)) {
      cm.setCursor({ line: Math.max(0, line - 1), ch: Math.max(0, col - 1) });
      cm.scrollIntoView({ line: Math.max(0, line - 1), ch: Math.max(0, col - 1) }, 100);
      cm.focus();

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

  renderScriptsList(container, blocks, parsedObj) {
    if (!container) return;
    if (blocks.length === 0) {
      const keyCount =
        parsedObj && typeof parsedObj === "object"
          ? Array.isArray(parsedObj)
            ? `${parsedObj.length} array items`
            : `${Object.keys(parsedObj).length} top-level keys`
          : "valid value";
      container.innerHTML = `<span class="tag-valid-info">✓ Valid JSON detected (${keyCount} • no clientscripts block — use <strong>Compare Full JSON</strong>)</span>`;
      return;
    }

    let html = "";
    blocks.forEach(block => {
      const scriptKeys = Object.keys(block.scripts);

      html += `<div class="block-chip">
        <span class="block-path">${this.escapeHtml(block.path)}</span>
        <div class="block-scripts">
          ${scriptKeys
          .map(k => {
            const sc = block.scripts[k];
            if (!sc.exists) return "";
            const crlfNotice = sc.hasCrLf ? "\\r\\n" : "\\n";
            return `<span class="script-pill" title="Click to open ${k} in IDE editor (${crlfNotice} line breaks)" data-script="${this.escapeHtml(k)}" role="button" style="cursor: pointer;">
                <span class="pill-dot"></span>${this.escapeHtml(k)}
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

  updateComparisonSummary(leftBlocks, rightBlocks, leftText = "", rightText = "") {
    if (!this.compareSummaryEl) return;

    const hasLeft = Boolean(this.leftParsed);
    const hasRight = Boolean(this.rightParsed);
    const hasAnyRaw = Boolean(leftText || rightText);

    // Enable Full JSON Compare whenever there is valid JSON or two non-empty inputs
    if (this.btnCompareFullJson) {
      this.btnCompareFullJson.disabled = !hasLeft && !hasRight && !(leftText && rightText);
    }

    // Case 1: Both empty
    if (!hasLeft && !hasRight && !hasAnyRaw) {
      this.btnOpenDiffModal.disabled = true;
      this.compareSummaryEl.innerHTML = `
        <div class="summary-status waiting">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Paste or upload JSON above to validate, inspect scripts, or compare Full JSON</span>
        </div>
      `;
      return;
    }

    // Case 1b: Text entered but invalid JSON syntax
    if (!hasLeft && !hasRight) {
      this.btnOpenDiffModal.disabled = true;
      this.compareSummaryEl.innerHTML = `
        <div class="summary-status warning">
          <span>⚠️ Fix JSON syntax error above (or click "Compare Full JSON" to diff raw text).</span>
        </div>
      `;
      return;
    }

    // Build Full JSON chip info
    let fullJsonChipHtml = "";
    if (hasLeft && hasRight) {
      const rawL = this.getLeftText();
      const rawR = this.getRightText();
      if (rawL === rawR) {
        fullJsonChipHtml = `
          <div class="script-status-chip chip-same chip-fulljson" data-script="${DiffModal.FULL_JSON_KEY}" role="button" title="Click to view Full JSON comparison" style="cursor: pointer;">
            <span class="chip-name">📄 Full JSON</span>
            <span class="chip-state">Identical</span>
          </div>`;
      } else {
        const jsonDiff = DiffEngine.computeDiff(rawL, rawR);
        fullJsonChipHtml = `
          <div class="script-status-chip chip-diff chip-fulljson" data-script="${DiffModal.FULL_JSON_KEY}" role="button" title="Click to compare &amp; merge the entire JSON" style="cursor: pointer;">
            <span class="chip-name">📄 Full JSON</span>
            <span class="chip-state">+${jsonDiff.stats.addedLines} / -${jsonDiff.stats.deletedLines} / ~${jsonDiff.stats.modifiedLines}</span>
          </div>`;
      }
    } else {
      fullJsonChipHtml = `
        <div class="script-status-chip chip-same chip-fulljson" data-script="${DiffModal.FULL_JSON_KEY}" role="button" title="Click to inspect/edit Full JSON in IDE dialog" style="cursor: pointer;">
          <span class="chip-name">📄 Full JSON</span>
          <span class="chip-state">Loaded</span>
        </div>`;
    }

    // Case 2 / 3: Only ONE valid JSON provided
    if ((hasLeft && !hasRight) || (!hasLeft && hasRight)) {
      const sideLabel = hasLeft ? "Base" : "Target";
      const blocks = hasLeft ? leftBlocks : rightBlocks;
      const block = blocks[0];
      const scriptKeys = Object.keys(block?.scripts || {}).filter(k => block.scripts[k].exists);

      this.btnOpenDiffModal.disabled = scriptKeys.length === 0;

      const scriptChips = scriptKeys
        .map(k => `
          <div class="script-status-chip chip-same" data-script="${this.escapeHtml(k)}" role="button" title="Click to open ${k} in IDE editor" style="cursor: pointer;">
            <span class="chip-name">${this.escapeHtml(k)}</span>
            <span class="chip-state">Ready</span>
          </div>
        `)
        .join("");

      const hint =
        scriptKeys.length > 0
          ? `✓ ${sideLabel} JSON loaded (${scriptKeys.length} clientscript${scriptKeys.length > 1 ? "s" : ""}). Open scripts or Compare Full JSON (paste 2nd JSON on the other side to diff).`
          : `✓ ${sideLabel} JSON loaded (no clientscripts block). Click "Compare Full JSON" to inspect/edit in IDE mode, or paste a 2nd JSON to diff.`;

      this.compareSummaryEl.innerHTML = `
        <div class="summary-active-row">
          <div class="chips-group">
            ${fullJsonChipHtml}
            ${scriptChips}
          </div>
          <div class="hint-text">${hint}</div>
        </div>
      `;
      this.bindSummaryChipClicks();
      return;
    }

    // Case 4: Both Left and Right valid JSON
    const hasScripts = leftBlocks.length > 0 || rightBlocks.length > 0;
    this.btnOpenDiffModal.disabled = !hasScripts;

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
        <div class="script-status-chip ${statusClass}" data-script="${this.escapeHtml(k)}" role="button" title="Click to open ${k} in Diff Modal" style="cursor: pointer;">
          <span class="chip-name">${this.escapeHtml(k)}</span>
          <span class="chip-state">${statusText}</span>
        </div>`;
      })
      .join("");

    this.compareSummaryEl.innerHTML = `
      <div class="summary-active-row">
        <div class="chips-group">
          ${fullJsonChipHtml}
          ${chipsHtml}
        </div>
        <div class="hint-text">
          Choose <strong>Compare Full JSON</strong> for entire JSON comparison, or open unescaped <strong>Readable Scripts</strong> to merge JS line-by-line.
        </div>
      </div>
    `;
    this.bindSummaryChipClicks();
  }

  bindSummaryChipClicks() {
    this.compareSummaryEl.querySelectorAll(".script-status-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const scriptKey = chip.dataset.script;
        if (scriptKey === DiffModal.FULL_JSON_KEY) {
          this.openFullJsonDiff();
        } else {
          this.openDiffDialog(scriptKey);
        }
      });
    });
  }

  openFullJsonDiff() {
    this.analyzeInputs();

    const leftRaw = this.getLeftText();
    const rightRaw = this.getRightText();
    const hasLeft = Boolean(leftRaw.trim());
    const hasRight = Boolean(rightRaw.trim());

    if (!hasLeft && !hasRight) {
      this.showToast("⚠️ Please paste or upload a JSON document first!");
      return;
    }

    const baseObj = this.leftParsed || this.rightParsed || null;
    const targetObj = this.rightParsed || this.leftParsed || null;

    this.diffModal.open(baseObj, targetObj, {
      preferredScript: DiffModal.FULL_JSON_KEY,
      leftRawText: hasLeft ? leftRaw : rightRaw,
      rightRawText: hasRight ? rightRaw : leftRaw,
      hasLeft,
      hasRight,
      lineEndingPreference: this.lineEndingPreference
    });
  }

  openDiffDialog(preferredScript = null) {
    // 1. Force fresh synchronous analysis of whatever is currently in the editors
    this.analyzeInputs();

    const hasLeft = Boolean(this.leftParsed);
    const hasRight = Boolean(this.rightParsed);

    if (!hasLeft && !hasRight) {
      this.showToast("⚠️ Please paste or upload a valid JSON bundle first!");
      return;
    }

    const leftRaw = this.getLeftText();
    const rightRaw = this.getRightText();
    const baseObj = this.leftParsed || this.rightParsed;
    const targetObj = this.rightParsed || this.leftParsed;

    // Pick a smart default script to open
    let scriptToOpen = preferredScript;
    if (!scriptToOpen) {
      const leftBlocks = JsonEngine.findAllClientScripts(baseObj);
      const rightBlocks = JsonEngine.findAllClientScripts(targetObj);
      const bL = leftBlocks[0];
      const bR = rightBlocks[0];

      const allKeys = ["postscript", "prescript", "onSaveScript"];
      for (const k of allKeys) {
        const sL = bL?.scripts?.[k]?.readable || "";
        const sR = bR?.scripts?.[k]?.readable || "";
        if (sL && sR && sL !== sR) {
          scriptToOpen = k;
          break;
        }
      }

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
      preferredScript: scriptToOpen || DiffModal.FULL_JSON_KEY,
      leftRawText: hasLeft ? leftRaw : rightRaw,
      rightRawText: hasRight ? rightRaw : leftRaw,
      hasLeft,
      hasRight,
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
    this.showToast(`💾 Downloaded ${filename}!`);
  }

  validateCleanJs() {
    const code = this.getCleanJsText();
    if (!this.convCleanValPanel) return;

    // Clear Monaco markers on Clean JS editor
    if (this.monacoCleanJs && typeof monaco !== "undefined" && monaco.editor) {
      const model = this.monacoCleanJs.getModel();
      if (model) {
        if (!code.trim()) {
          monaco.editor.setModelMarkers(model, "js-validator", []);
        } else {
          const res = Validator.validateJs(code);
          if (res.valid) {
            monaco.editor.setModelMarkers(model, "js-validator", []);
          } else {
            const errLine = Math.min(model.getLineCount(), Math.max(1, res.line || 1));
            const errCol = Math.max(1, res.column || 1);
            const lineContent = model.getLineContent(errLine) || "";
            monaco.editor.setModelMarkers(model, "js-validator", [
              {
                startLineNumber: errLine,
                startColumn: errCol,
                endLineNumber: errLine,
                endColumn: Math.max(errCol + 1, lineContent.length + 1),
                message: `${res.errorTitle || "JavaScript Error"}: ${res.message}`,
                severity: monaco.MarkerSeverity.Error
              }
            ]);
          }
        }
      }
    }

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
        if (!res.line) return;
        const col = res.column || 1;
        if (this.monacoCleanJs) {
          this.monacoCleanJs.revealLineInCenter(res.line);
          this.monacoCleanJs.setPosition({ lineNumber: res.line, column: col });
          this.monacoCleanJs.focus();
        } else if (this.cmCleanJs) {
          this.cmCleanJs.setCursor({ line: res.line - 1, ch: col - 1 });
          this.cmCleanJs.scrollIntoView({ line: res.line - 1, ch: col - 1 }, 100);
          this.cmCleanJs.focus();
          this.cmCleanJs.addLineClass(res.line - 1, "background", "cm-val-flash");
          setTimeout(() => this.cmCleanJs?.removeLineClass(res.line - 1, "background", "cm-val-flash"), 1500);
        }
      });
    }
  }

  bindQuickConverter() {
    const rawInput = document.getElementById("converterRawInput");
    const cleanInput = this.cleanTextarea;
    const btnToReadable = document.getElementById("btnConvToReadable");
    const btnToEscaped = document.getElementById("btnConvToEscaped");
    const btnCopyRaw = document.getElementById("btnCopyConvRaw");
    const btnCopyClean = document.getElementById("btnCopyConvClean");
    const btnFormatClean = document.getElementById("btnFormatConvClean");

    if (!rawInput) return;

    let debounceTimer = null;
    const triggerValidation = (delay = 180) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => this.validateCleanJs(), delay);
    };

    if (this.cmCleanJs) {
      this.cmCleanJs.on("change", () => triggerValidation(180));
      this.cmCleanJs.on("inputRead", (cm, change) => {
        if (change.origin === "paste") triggerValidation(20);
      });
      this.cmCleanJs.getWrapperElement().addEventListener("paste", () => triggerValidation(30));
    }
    cleanInput?.addEventListener("input", () => triggerValidation(180));
    cleanInput?.addEventListener("paste", () => triggerValidation(20));

    // Format JS button
    btnFormatClean?.addEventListener("click", () => {
      const code = this.getCleanJsText();
      if (!code.trim()) return;
      const formatted = JsBeautifier.beautify(code, 4);
      this.setCleanJsText(formatted);
      this.validateCleanJs();
      this.showToast("⚡ Formatted JavaScript with clean 4-space indentation!");
    });

    btnToReadable?.addEventListener("click", () => {
      const raw = rawInput.value;
      const clean = JsonEngine.toReadableJs(raw);
      const beautified = JsBeautifier.beautify(clean, 4);
      this.setCleanJsText(beautified);
      this.validateCleanJs();
      this.showToast("Converted to readable JavaScript in Editor!");
    });

    btnToEscaped?.addEventListener("click", () => {
      const clean = this.getCleanJsText();
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
      navigator.clipboard.writeText(this.getCleanJsText()).then(() => {
        this.showToast("Copied clean JS!");
      });
    });

    // Initial validation
    setTimeout(() => this.validateCleanJs(), 100);
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
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => toast.classList.remove("visible"), 3200);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.inoApp = new InoJsonApp();
});


})();
