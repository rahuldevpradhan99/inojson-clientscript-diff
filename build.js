/**
 * Zero-dependency build script: bundles JS modules into a standalone js/bundle.js
 * Enables index.html to run directly from local disk (file:///) without CORS restrictions!
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  "js/sample-data.js",
  "js/js-highlighter.js",
  "js/js-beautifier.js",
  "js/validator.js",
  "js/json-engine.js",
  "js/diff-engine.js",
  "js/diff-modal.js",
  "js/app.js"
];

let bundledContent = "/* Bundled InoJson Script Compare & Diff Studio */\n(() => {\n";

for (const relPath of files) {
  const fullPath = path.join(__dirname, relPath);
  let content = fs.readFileSync(fullPath, "utf-8");

  // Strip import statements
  content = content.replace(/^import\s+.*?;?\s*$/gm, "");

  // Convert "export const Foo =" or "export class Foo" into "const Foo =" / "class Foo"
  content = content.replace(/^export\s+(const|let|var|class|function)\s+/gm, "$1 ");

  // Convert "export default"
  content = content.replace(/^export\s+default\s+/gm, "");

  bundledContent += `\n/* --- ${relPath} --- */\n` + content + "\n";
}

bundledContent += "\n})();\n";

fs.writeFileSync(path.join(__dirname, "js/bundle.js"), bundledContent);
console.log("✓ Successfully created standalone js/bundle.js (Zero-CORS offline ready)!");
