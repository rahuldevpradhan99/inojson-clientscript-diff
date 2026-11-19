# InoJson ClientScripts Compare & Diff Studio

A specialized, developer-focused web application designed to compare, edit, and convert JavaScript code stored inside `"clientscripts"` (`prescript`, `postscript`, `onSaveScript`) within enterprise low-code JSON bundles.

---

## 🎯 The Problem Solved

In enterprise low-code platforms and form configurations, JavaScript business logic is serialized inside JSON as single-line escaped strings with carriage returns (`\r\n`), quotes (`\"`), and backslashes (`\\`), for example:

```json
"clientscripts": {
  "prescript": "debugger;\r\nconsole.info(\"model====>\", model);\r\nconsole.info(\"editor====>\", editor);\r\n...",
  "postscript": "...",
  "onSaveScript": "..."
}
```

When comparing two versions of a JSON bundle (e.g., Production vs. Development, or Git branches):
1. Standard text/git diff tools display unreadable single-line strings hundreds or thousands of characters long with `\r\n`.
2. Reviewing logic changes, bug fixes, or new features is difficult and prone to errors.
3. Editing code and manually escaping newlines and quotes back into valid JSON format for production commit is tedious and fragile.

**InoJson Studio solves this completely**:
- Paste or upload any two JSON bundles.
- Automatically detects and extracts `"clientscripts"` (`prescript`, `postscript`, `onSaveScript`).
- Click **"Open Readable Scripts & Compare Diff"** to open a dialog showing clean, formatted, syntax-highlighted JavaScript.
- Review diffs side-by-side or unified with character/word-level change highlighting.
- Edit code directly in the dialog editor with real-time diff feedback and 1-click beautification.
- Click **"Apply Changes to JSON & Exit"** — the clean JavaScript is automatically converted back into the initial production JSON format with proper `\r\n` line endings and escaping, updating the target JSON ready for production commit and git push!

---

## 🚀 How to Run the Web App

The app is completely self-contained with **zero external runtime dependencies**.

### Option 1: Using Python
```bash
python3 server.py
```
*Automatically opens in your browser at `http://localhost:3000`.*

### Option 2: Using Node.js
```bash
npm start
# or: node server.js
```

### Option 3: Direct Browser File
Open `index.html` directly in any modern browser:
```bash
open index.html
```

---

## 💡 Step-by-Step Workflow

### 1. Input Base & Target JSONs
- **Left Panel (Base / Original JSON)**: Paste or upload your production/main JSON bundle.
- **Right Panel (Target / Modified JSON)**: Paste or upload your development/feature JSON bundle.
- Or click **"Load Sample"** in the top bar to test immediately with real-world low-code scripts!
- The app automatically parses both JSONs, validates syntax, and highlights detected scripts:
  - `prescript`
  - `postscript`
  - `onSaveScript`
  - Any custom script keys present in `clientscripts`.

### 2. Open the Readable Version Dialog Box
- Click the glowing primary button:
  **"🔍 Open Readable Scripts & Compare Diff (Dialog)"**
- A full-screen capable dialog modal opens with:
  - **Script Tabs**: Seamlessly switch between `prescript`, `postscript`, and `onSaveScript` with live `[Diff]`, `[Same]`, or `[Edited]` status badges.
  - **View Modes**:
    - **Side-by-Side Diff**: Left (Base) vs. Right (Target) with synchronized scrolling and line alignment.
    - **Unified Diff**: GitHub-style inline diff with `+` and `-` markers.
    - **Edit & Live Diff**: Full interactive JavaScript code editor with line numbers and real-time diff recalculation.
  - **Word-Level Highlights**: Changed lines display exact tokens that were added (`diff-char-ins`) or deleted (`diff-char-del`).
  - **Hunk Navigation**: Jump between changes using `◀ Prev Change` and `▶ Next Change` (or `Alt+Up` / `Alt+Down`).

### 3. Edit & Format Scripts
- Switch to **Edit & Live Diff** mode (or click `✎ Edit Directly`).
- Make your code changes, paste new functions, or fix bugs.
- Click **"⚡ Format JS"** to automatically clean up indentation (4-space standard, matching braces and switches).
- Click **"📋 Copy Readable JS"** if you want the unescaped code for your local IDE.
- Click **"↺ Revert to Original"** to undo modifications if needed.

### 4. Convert Back to Initial JSON Format & Ready for Prod Commit
- Click **"💾 Apply Changes to JSON & Exit"** (or press `Ctrl+S` / `Cmd+S`).
- **The conversion engine automatically:**
  1. Serializes your clean JavaScript code back into the escaped string format (`\r\n`, escaped `\"`, preserved backslashes).
  2. Updates the `clientscripts[key]` property in the Target JSON bundle at the exact JSON path.
  3. Preserves all other properties, wizard configurations, and low-code schemas.
- In the main screen, click:
  - **"📋 Copy Target JSON"**: Copies the entire valid production JSON to clipboard.
  - **"💾 Download JSON"**: Saves `bundle_updated.json` ready for git commit!

---

## 🛠 Extra Developer Utilities

### Quick Snippet Converter
Switch to the **"Quick Snippet Converter"** tab in the top navigation bar:
- Paste a single escaped string (e.g. `"debugger;\r\nconsole.log(123);\r\n"`) on the left.
- Click **"To Readable JS"** to get clean, unescaped code.
- Paste clean code on the right and click **"To Escaped JSON String"** to get `"..."` ready to paste into raw JSON or API payloads.

---

## 🧪 Automated Test Suite
To run the automated verification test suite:
```bash
npm test
```
Verifies parsing, script extraction, CRLF roundtrips, LCS diffing, word-level alignments, and code beautification.
