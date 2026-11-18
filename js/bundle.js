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
    if (!rootObj || typeof rootObj !== "object") return results;

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
      "prescript",
      "postscript",
      "onSaveScript",
      ...Object.keys(leftBlock?.scripts || {}),
      ...Object.keys(rightBlock?.scripts || {})
    ]);

    if (!allKeys.has(this.activeScriptKey)) {
      this.activeScriptKey = "prescript";
    }

    allKeys.forEach(scriptKey => {
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
    container.innerHTML = `
      <div class="split-diff-container">
        <!-- Left Pane: Old (Base) -->
        <div class="diff-pane diff-pane-left">
          <div class="pane-header">
            <div class="pane-title-group">
              <span class="pane-title">Old / Base JSON Script</span>
              <span class="tag-role">Receiving Merged Lines</span>
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
          </div>
          <div class="subnav-right">
            <span class="editor-cursor-pos" id="editorCursorPos">Ln 1, Col 1</span>
            <button class="btn-tool" id="btnFormatEditorCode" title="Auto-indent and format code">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
              Auto-Format
            </button>
          </div>
        </div>

        <!-- CodeMirror Mount Area -->
        <div class="codemirror-mount" id="modalCodeMirrorMount"></div>

        <!-- Editor Bottom Status Bar -->
        <div class="editor-bottom-bar">
          <div class="editor-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>Full IDE Mode: auto-closing brackets, matching pairs, 4-space indent, syntax coloring. Click <strong>"Back to Diff State"</strong> to review changes &amp; merge line-by-line.</span>
          </div>
          <button class="btn-done-review" id="btnBottomDoneReview">
            <span>✓ Done Editing ➔ Return to Diff</span>
          </button>
        </div>
      </div>
    `;

    const mountEl = container.querySelector("#modalCodeMirrorMount");

    // Initialize CodeMirror
    if (typeof CodeMirror !== "undefined") {
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

      // Live change sync
      this.cmModalInstance.on("change", () => {
        const val = this.cmModalInstance.getValue();
        if (this.editorSubMode === "js") {
          this.modifiedRightScripts.set(this.activeScriptKey, val);
        } else {
          try {
            this.rightJsonObj = JSON.parse(val);
            this.rightBlocks = JsonEngine.findAllClientScripts(this.rightJsonObj);
          } catch (e) {}
        }
      });

      setTimeout(() => this.cmModalInstance.refresh(), 50);
    } else {
      // Fallback textarea if CodeMirror script isn't loaded
      mountEl.innerHTML = `<textarea class="code-textarea" id="scriptTextarea" style="width:100%;height:100%;">${initialCode}</textarea>`;
      const ta = mountEl.querySelector("#scriptTextarea");
      ta.addEventListener("input", () => {
        this.modifiedRightScripts.set(this.activeScriptKey, ta.value);
      });
    }

    // Return to Diff actions
    const returnToDiffHandler = () => {
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
 * Features CodeMirror JSON editing on both panels and integration with DiffModal.
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
    this.compareSummaryEl = document.getElementById("compareSummary");
    this.btnOpenDiffModal = document.getElementById("btnOpenDiffModal");

    this.cmLeft = null;
    this.cmRight = null;
    this.leftParsed = null;
    this.rightParsed = null;
    this.lineEndingPreference = "crlf";

    // Initialize Diff Modal with two-way merge support and full code editor
    this.diffModal = new DiffModal({
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
    this.bindEvents();
    this.bindFileUploads();
    this.bindQuickConverter();

    // Load initial realistic sample data
    this.loadSampleData();
  }

  initCodeMirrorPanels() {
    if (typeof CodeMirror !== "undefined" && this.cmLeftMount && this.cmRightMount) {
      this.cmLeft = CodeMirror(this.cmLeftMount, {
        value: "",
        mode: { name: "javascript", json: true },
        theme: "material-darker",
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        tabSize: 2,
        indentUnit: 2,
        lineWrapping: false
      });

      this.cmRight = CodeMirror(this.cmRightMount, {
        value: "",
        mode: { name: "javascript", json: true },
        theme: "material-darker",
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        tabSize: 2,
        indentUnit: 2,
        lineWrapping: false
      });

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
    } else {
      // Fallback: show raw textareas
      if (this.leftTextarea) this.leftTextarea.classList.remove("hidden");
      if (this.rightTextarea) this.rightTextarea.classList.remove("hidden");
      if (this.cmLeftMount) this.cmLeftMount.style.display = "none";
      if (this.cmRightMount) this.cmRightMount.style.display = "none";
    }
  }

  getLeftText() {
    return this.cmLeft ? this.cmLeft.getValue() : this.leftTextarea.value;
  }

  getRightText() {
    return this.cmRight ? this.cmRight.getValue() : this.rightTextarea.value;
  }

  setLeftJson(text) {
    if (this.cmLeft) {
      this.cmLeft.setValue(text);
    }
    this.leftTextarea.value = text;
  }

  setRightJson(text) {
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

    // Parse Left
    const leftRes = JsonEngine.parse(leftText);
    this.updateStatusBadge(this.leftStatusEl, leftRes, "Original");
    this.leftParsed = leftRes.ok ? leftRes.data : null;

    // Parse Right
    const rightRes = JsonEngine.parse(rightText);
    this.updateStatusBadge(this.rightStatusEl, rightRes, "Modified");
    this.rightParsed = rightRes.ok ? rightRes.data : null;

    // Detect client scripts
    let leftBlocks = [];
    let rightBlocks = [];

    if (this.leftParsed) {
      leftBlocks = JsonEngine.findAllClientScripts(this.leftParsed);
      this.renderScriptsList(this.leftScriptsListEl, leftBlocks);
    } else {
      this.leftScriptsListEl.innerHTML = `<span class="empty-hint">Waiting for valid JSON...</span>`;
    }

    if (this.rightParsed) {
      rightBlocks = JsonEngine.findAllClientScripts(this.rightParsed);
      this.renderScriptsList(this.rightScriptsListEl, rightBlocks);
    } else {
      this.rightScriptsListEl.innerHTML = `<span class="empty-hint">Waiting for valid JSON...</span>`;
    }

    this.updateComparisonSummary(leftBlocks, rightBlocks);
  }

  updateStatusBadge(el, parseRes, label) {
    if (!el) return;
    if (!parseRes.ok && parseRes.error === "Input is empty") {
      el.className = "status-tag tag-empty";
      el.textContent = "Empty";
    } else if (parseRes.ok) {
      el.className = "status-tag tag-valid";
      el.textContent = `Valid JSON • ${parseRes.lineEnding === "\r\n" ? "CRLF (\\r\\n)" : "LF (\\n)"}`;
    } else {
      el.className = "status-tag tag-error";
      el.textContent = "Invalid JSON Syntax";
      el.title = parseRes.error;
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
              return `<span class="script-pill" title="${k}: has ${crlfNotice} line breaks">
                <span class="pill-dot"></span>${k}
              </span>`;
            })
            .join("")}
        </div>
      </div>`;
    });

    container.innerHTML = html;
  }

  updateComparisonSummary(leftBlocks, rightBlocks) {
    if (!this.compareSummaryEl) return;

    if (!this.leftParsed || !this.rightParsed) {
      this.btnOpenDiffModal.disabled = true;
      this.compareSummaryEl.innerHTML = `
        <div class="summary-status waiting">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Paste or upload two JSON bundles above to extract &amp; compare scripts</span>
        </div>
      `;
      return;
    }

    if (leftBlocks.length === 0 && rightBlocks.length === 0) {
      this.btnOpenDiffModal.disabled = true;
      this.compareSummaryEl.innerHTML = `
        <div class="summary-status warning">
          <span>⚠️ Could not find "clientscripts" with prescript/postscript/onSaveScript</span>
        </div>
      `;
      return;
    }

    this.btnOpenDiffModal.disabled = false;

    const blockL = leftBlocks[0];
    const blockR = rightBlocks[0];

    const keys = ["prescript", "postscript", "onSaveScript"];
    const chipsHtml = keys
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
        <div class="script-status-chip ${statusClass}">
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
  }

  openDiffDialog(preferredScript = "prescript") {
    if (!this.leftParsed || !this.rightParsed) {
      alert("Please ensure both Left and Right contain valid JSON before comparing.");
      return;
    }

    this.diffModal.open(this.leftParsed, this.rightParsed, {
      preferredScript,
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

    if (!rawInput || !cleanInput) return;

    btnToReadable?.addEventListener("click", () => {
      const raw = rawInput.value;
      const clean = JsonEngine.toReadableJs(raw);
      cleanInput.value = clean;
      this.showToast("Converted to readable JavaScript!");
    });

    btnToEscaped?.addEventListener("click", () => {
      const clean = cleanInput.value;
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
      navigator.clipboard.writeText(cleanInput.value).then(() => {
        this.showToast("Copied clean JS!");
      });
    });
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
