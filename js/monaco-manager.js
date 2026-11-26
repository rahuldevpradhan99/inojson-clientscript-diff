/**
 * Monaco Editor Manager for InoJson Studio
 * Provides seamless VS Code Monaco editor integration with IntelliSense,
 * Code Folding, Minimap, Multi-cursor, JSON schema validation, and low-code script typing.
 * Falls back gracefully to CodeMirror if Monaco CDN is unreachable or offline.
 */

export class MonacoManager {
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

export const monacoManager = new MonacoManager();
