/**
 * Main Application Orchestrator for InoJson Script Compare & Diff
 * Features CodeMirror JSON editing on both panels, deep JSON & JavaScript validation,
 * actionable error diagnostics, intelligent auto-fix, and integration with DiffModal.
 */

import { JsonEngine } from "./json-engine.js";
import { SAMPLE_BASE_JSON, SAMPLE_TARGET_JSON } from "./sample-data.js";
import { DiffModal } from "./diff-modal.js";
import { Validator } from "./validator.js";
import { monacoManager } from "./monaco-manager.js";

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

    this.monacoLeft = null;
    this.monacoRight = null;
    this.cmLeft = null;
    this.cmRight = null;
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

    // Load initial realistic sample data
    this.loadSampleData();
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

    // 1. Run deep bundle validation (JSON structure + embedded client scripts)
    this.leftReport = Validator.validateBundle(leftText, JsonEngine);
    this.rightReport = Validator.validateBundle(rightText, JsonEngine);

    // 2. Render dedicated Validation Diagnostics Panels
    this.renderValidationPanel("left", this.leftReport, leftText);
    this.renderValidationPanel("right", this.rightReport, rightText);

    // 3. Update top status tags
    this.updateStatusBadge(this.leftStatusEl, this.leftReport, leftText);
    this.updateStatusBadge(this.rightStatusEl, this.rightReport, rightText);

    this.leftParsed = this.leftReport.jsonValid ? this.leftReport.jsonDiag.data : null;
    this.rightParsed = this.rightReport.jsonValid ? this.rightReport.jsonDiag.data : null;

    // 4. Detect and render client scripts chips
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
              ${
                diag.canAutoFix
                  ? `<button class="btn-val-autofix" data-side="${side}" title="Automatically fix trailing commas, unquoted keys, single quotes, or comments">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      ⚡ Auto-Fix JSON
                    </button>`
                  : ""
              }
              <button class="btn-val-jump" data-side="${side}" data-line="${diag.line || 1}" data-col="${diag.column || 1}" title="Focus and scroll to error line in editor">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                Jump to Line
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
  }

  updateStatusBadge(el, report, rawText) {
    if (!el) return;
    if (report.jsonDiag.isEmpty) {
      el.className = "status-tag tag-empty";
      el.textContent = "Empty";
      el.title = "No content provided";
    } else if (!report.jsonValid) {
      el.className = "status-tag tag-error";
      el.textContent = `✖ ${report.jsonDiag.errorTitle || "JSON Error"}`;
      el.title = report.jsonDiag.message;
    } else if (report.hasScriptErrors) {
      el.className = "status-tag tag-warn";
      el.textContent = "⚠ Valid JSON (JS Script Error)";
      el.title = "JSON syntax is valid, but one or more embedded scripts in clientscripts contain JavaScript syntax errors";
    } else {
      const hasCrLf = rawText.includes("\r\n");
      const engineLabel = this.monacoLeft ? "Monaco IDE" : "IDE";
      el.className = "status-tag tag-valid";
      el.textContent = `✓ Valid JSON • ${engineLabel} • ${hasCrLf ? "CRLF (\\r\\n)" : "LF (\\n)"}`;
      el.title = "JSON bundle and all embedded scripts are 100% syntactically valid";
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
    const convRawVal = document.getElementById("convRawVal");
    const convCleanVal = document.getElementById("convCleanVal");
    const btnToReadable = document.getElementById("btnConvToReadable");
    const btnToEscaped = document.getElementById("btnConvToEscaped");
    const btnCopyRaw = document.getElementById("btnCopyConvRaw");
    const btnCopyClean = document.getElementById("btnCopyConvClean");

    if (!rawInput || !cleanInput) return;

    // Real-time clean JS validation
    const validateCleanInput = () => {
      const code = cleanInput.value;
      if (!convCleanVal) return;
      if (!code.trim()) {
        convCleanVal.textContent = "";
        convCleanVal.className = "conv-val-indicator";
        return;
      }
      const res = Validator.validateJs(code);
      if (res.valid) {
        convCleanVal.className = "conv-val-indicator valid";
        convCleanVal.textContent = "✓ Valid JavaScript syntax (0 errors)";
      } else {
        convCleanVal.className = "conv-val-indicator error";
        convCleanVal.textContent = `✖ Line ${res.line}, Col ${res.column}: ${res.errorTitle} — ${res.fixSuggestion}`;
      }
    };

    cleanInput.addEventListener("input", validateCleanInput);

    btnToReadable?.addEventListener("click", () => {
      const raw = rawInput.value;
      const clean = JsonEngine.toReadableJs(raw);
      cleanInput.value = clean;
      validateCleanInput();
      this.showToast("Converted to readable JavaScript!");
    });

    btnToEscaped?.addEventListener("click", () => {
      const clean = cleanInput.value;
      const escaped = JsonEngine.toRawEscapedString(clean, true);
      rawInput.value = escaped;
      if (convRawVal) {
        convRawVal.className = "conv-val-indicator valid";
        convRawVal.textContent = "✓ Valid escaped JSON string (CRLF \\r\\n)";
      }
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
