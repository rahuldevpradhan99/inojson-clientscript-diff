/**
 * Diff Modal Component with Interactive Line-by-Line Merging & Full IDE Code Editor
 * Features CodeMirror with JavaScript syntax highlighting, indentation, auto-closing brackets,
 * and seamless transitions back to the side-by-side diff & merge view.
 */

import { DiffEngine } from "./diff-engine.js";
import { JsHighlighter } from "./js-highlighter.js";
import { JsBeautifier } from "./js-beautifier.js";
import { JsonEngine } from "./json-engine.js";
import { Validator } from "./validator.js";
import { monacoManager } from "./monaco-manager.js";

export class DiffModal {
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
