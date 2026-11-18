/**
 * JSON Engine for InoJson Script Compare & Diff
 * Handles JSON parsing, deep traversal to find clientscripts blocks,
 * accurate unescaping to readable JS, and re-serializing to production JSON.
 */

export const JsonEngine = {
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
