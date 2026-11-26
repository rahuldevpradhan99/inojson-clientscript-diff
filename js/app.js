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
