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

export const monacoManager = new MonacoManager();
