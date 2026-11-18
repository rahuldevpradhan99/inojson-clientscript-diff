/**
 * Main Application Orchestrator for InoJson Script Compare & Diff
 * Features CodeMirror JSON editing on both panels and integration with DiffModal.
 */

import { JsonEngine } from "./json-engine.js";
import { SAMPLE_BASE_JSON, SAMPLE_TARGET_JSON } from "./sample-data.js";
import { DiffModal } from "./diff-modal.js";

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
