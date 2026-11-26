/**
 * Main Application Orchestrator for InoJson Script Compare & Diff Studio
 * Features CodeMirror + VS Code Monaco JSON/JS editing on both panels, deep JSON & JavaScript
 * validation, uploaded file modification tracking with active save-to-original-file sync,
 * Full JSON diffing & merging, and unescaped clientscripts DiffModal integration.
 */

import { JsonEngine } from "./json-engine.js";
import { SAMPLE_BASE_JSON, SAMPLE_TARGET_JSON } from "./sample-data.js";
import { DiffModal } from "./diff-modal.js";
import { Validator } from "./validator.js";
import { DiffEngine } from "./diff-engine.js";
import { JsBeautifier } from "./js-beautifier.js";
import { monacoManager } from "./monaco-manager.js";

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
