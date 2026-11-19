/**
 * Comprehensive Engine verification test suite including Line-by-Line Merging
 */

import { JsonEngine } from "../js/json-engine.js";
import { DiffEngine } from "../js/diff-engine.js";
import { JsBeautifier } from "../js/js-beautifier.js";
import { SAMPLE_BASE_JSON, SAMPLE_TARGET_JSON } from "../js/sample-data.js";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log("=== Running InoJson Engine Tests ===");

// 1. JSON Parsing & Detection
console.log("\n[1] Testing JSON Engine Parsing & Traversal:");
const baseStr = JSON.stringify(SAMPLE_BASE_JSON, null, 2);
const parseRes = JsonEngine.parse(baseStr);
assert(parseRes.ok === true, "Parses valid JSON bundle");

const blocks = JsonEngine.findAllClientScripts(parseRes.data);
assert(blocks.length === 1, `Found 1 clientscripts block (got ${blocks.length})`);
assert(blocks[0].path === "$.clientscripts", `Path is $.clientscripts (got ${blocks[0].path})`);
assert(blocks[0].scripts.prescript.exists === true, "prescript exists");
assert(blocks[0].scripts.postscript.exists === true, "postscript exists");
assert(blocks[0].scripts.onSaveScript.exists === true, "onSaveScript exists");

// 2. Unescaping
console.log("\n[2] Testing Escaped JS to Readable JS Conversion:");
const rawPrescript = SAMPLE_BASE_JSON.clientscripts.prescript;
assert(rawPrescript.includes("\r\n"), "Raw prescript contains literal CRLF \\r\\n");

const readable = JsonEngine.toReadableJs(rawPrescript);
assert(!readable.includes("\r\n"), "Readable version has CRLF normalized to clean LF");
assert(readable.includes("debugger;"), "Contains debugger statement");
assert(readable.includes('editor.showAlert(\'Warning\','), "Contains clean string without escape backslashes");

// 3. Serializing & Updating
console.log("\n[3] Testing Readable JS back to Production JSON Format:");
const editedCleanJs = readable + "\nconsole.log(\"New production feature added!\");\n";
const updateRes = JsonEngine.updateScript(
  SAMPLE_TARGET_JSON,
  "$.clientscripts",
  "prescript",
  editedCleanJs,
  { lineEndingPreference: "crlf", indentation: 2, originalHadCrLf: true }
);

assert(typeof updateRes.updatedJsonString === "string", "Produces updated JSON string");
const reparsed = JSON.parse(updateRes.updatedJsonString);
assert(reparsed.clientscripts.prescript.includes("New production feature added!"), "Updated script present in reparsed JSON");
assert(reparsed.clientscripts.prescript.includes("\r\n"), "Updated script preserved \\r\\n line endings in JSON");
assert(reparsed.clientscripts.postscript.length > 0, "Other scripts untouched");
assert(reparsed.formSettings.title === SAMPLE_TARGET_JSON.formSettings.title, "Other JSON fields preserved intact");

// 4. Diff Engine & Word Alignment
console.log("\n[4] Testing Diff Engine & Word Alignment:");
const scriptA = "editor.showAlert('Warning', 'Task Required', 'warning');";
const scriptB = "editor.askToConfirm(true, 'Task Required', 'info', '#dc3545');";

const diff = DiffEngine.computeDiff(scriptA, scriptB);
assert(diff.alignedRows.length === 1, `Aligned rows count: 1 (got ${diff.alignedRows.length})`);
assert(diff.alignedRows[0].type === "modify", "Detected as modified line");
assert(diff.alignedRows[0].left.spans.length > 1, "Computed word-level spans on left");
assert(diff.alignedRows[0].right.spans.length > 1, "Computed word-level spans on right");

// 5. Line-by-Line Merging
console.log("\n[5] Testing Line-by-Line Single Line Merge:");
const leftText = "function start() {\n    let a = 1;\n    return a;\n}";
const rightText = "function start() {\n    let a = 2;\n    let b = 3;\n    return a + b;\n}";

let curLeft = leftText;
let d = DiffEngine.computeDiff(curLeft, rightText);
const initialChanges = d.stats.totalChanges;
assert(initialChanges === 3, `Initial diff detected ${initialChanges} changes`);

let step = 0;
while (!d.isIdentical && step < 10) {
  step++;
  const nextChange = d.alignedRows.find(r => r.type !== "equal");
  const prevCount = d.stats.totalChanges;
  const res = DiffEngine.mergeLine(curLeft, rightText, nextChange, "to-left");
  curLeft = res.textLeft;
  d = DiffEngine.computeDiff(curLeft, rightText);
  assert(d.stats.totalChanges <= prevCount, `Step ${step}: Merged [${nextChange.type}] line, changes reduced from ${prevCount} to ${d.stats.totalChanges}`);
}

assert(curLeft === rightText, "After sequential line-by-line merges, Old script matches New script exactly!");

// 6. JavaScript Beautifier
console.log("\n[6] Testing JS Beautifier:");
const unformatted = "function test(){if(true){console.log('hi');}}";
const beautified = JsBeautifier.beautify(unformatted, 4);
assert(beautified.includes("    if (true) {") || beautified.includes("    if(true){"), "Beautifier properly indented inner block");

// 7. Comprehensive JSON & JavaScript Validator
console.log("\n[7] Testing JSON & JavaScript Validator:");
import fs from "fs";
import { Validator } from "../js/validator.js";

// Initialize Acorn in Node environment for tests
const acornModule = {};
new Function("exports", "module", fs.readFileSync("./vendor/acorn/acorn.min.js", "utf-8"))(acornModule, { exports: acornModule });
globalThis.acorn = acornModule;

// 7.1 Valid JSON
const v1 = Validator.validateJson("{\n  \"status\": \"success\",\n  \"code\": 200\n}");
assert(v1.valid === true, "Valid JSON returns valid: true");

// 7.2 Trailing Comma in JSON
const v2 = Validator.validateJson("{\n  \"item1\": 10,\n  \"item2\": 20,\n}");
assert(v2.valid === false, "Trailing comma detected as invalid");
assert(v2.errorTitle.includes("Trailing Comma"), `Identified as Trailing Comma (got: ${v2.errorTitle})`);
assert(v2.line === 4, `Pinpointed error at line 4 (got: ${v2.line})`);
assert(v2.canAutoFix === true, "Marked as auto-fixable");
assert(v2.snippet !== null && v2.snippet.lines.length > 0, "Generated code snippet with line numbers");
assert(v2.snippet.pointer.includes("^"), "Generated visual column pointer");
assert(v2.fixSuggestion.includes("comma"), "Provided actionable fix suggestion");

// 7.3 Single Quotes in JSON
const v3 = Validator.validateJson("{\n  'title': 'Low-code Script'\n}");
assert(v3.valid === false, "Single quotes detected as invalid");
assert(v3.errorTitle.includes("Single Quotes"), `Identified single quotes issue (got: ${v3.errorTitle})`);
assert(v3.canAutoFix === true, "Single quotes marked as auto-fixable");
assert(v3.autoFixedText.includes('"title": "Low-code Script"'), "Auto-fixed single quotes to valid double quotes");

// 7.4 Unquoted Key in JSON
const v4 = Validator.validateJson("{\n  prescript: \"console.log(1);\"\n}");
assert(v4.valid === false, "Unquoted key detected as invalid");
assert(v4.errorTitle.includes("Unquoted"), `Identified unquoted key (got: ${v4.errorTitle})`);
assert(v4.canAutoFix === true, "Unquoted key marked as auto-fixable");
assert(v4.autoFixedText.includes('"prescript"'), "Auto-fixed unquoted key with double quotes");

// 7.5 Comments in JSON
const v5 = Validator.validateJson("{\n  // This is a comment\n  \"validKey\": true\n}");
assert(v5.valid === false, "Comments detected as invalid");
assert(v5.errorTitle.includes("Comments"), `Identified comments issue (got: ${v5.errorTitle})`);
assert(v5.canAutoFix === true, "Comments marked as auto-fixable");
assert(!v5.autoFixedText.includes("//"), "Auto-fixed text stripped illegal comments");

// 7.6 Valid JavaScript with Top-level Return (Low-code standard)
const js1 = Validator.validateJs("const flag = true;\nif (flag) {\n  return false;\n}\nreturn true;");
assert(js1.valid === true, "Valid JavaScript with top-level return accepted");

// 7.7 JavaScript Unclosed Bracket
const js2 = Validator.validateJs("function confirmApproval() {\n  if (model.status === 'Approved') {\n    return true;\n}");
assert(js2.valid === false, "Unclosed bracket detected as invalid");
assert(js2.errorTitle.includes("Unclosed Bracket"), `Identified unclosed bracket (got: ${js2.errorTitle})`);
assert(js2.line === 1 || js2.line === 2, `Pinpointed unclosed block line (got: ${js2.line})`);
assert(js2.fixSuggestion.includes("}"), "Suggested adding missing '}' closing brace");

// 7.8 JavaScript Unterminated String
const js3 = Validator.validateJs("const message = \"Investigation complete;");
assert(js3.valid === false, "Unterminated string detected as invalid");
assert(js3.errorTitle.includes("String"), `Identified unterminated string (got: ${js3.errorTitle})`);
assert(js3.line === 1, `Error at line 1 (got: ${js3.line})`);

// 7.9 JavaScript Try Without Catch/Finally
const js4 = Validator.validateJs("try {\n  confirmInvestigationCompletion();\n}");
assert(js4.valid === false, "Try without catch/finally detected as invalid");
assert(js4.errorTitle.includes("catch"), `Identified missing catch clause (got: ${js4.errorTitle})`);

// 7.10 Bundle Validation with Embedded JavaScript
const brokenBundle = JSON.stringify({
  clientscripts: {
    prescript: "function valid() { return true; }",
    postscript: "function broken() {\n  const x = ; // syntax error\n}"
  }
}, null, 2);

const bundleReport = Validator.validateBundle(brokenBundle, JsonEngine);
assert(bundleReport.jsonValid === true, "Bundle JSON structure is syntactically valid");
assert(bundleReport.hasScriptErrors === true, "Detected JavaScript syntax error inside embedded clientscript");
assert(bundleReport.scriptErrors.length === 1, "Exactly 1 broken script identified");
assert(bundleReport.scriptErrors[0].scriptKey === "postscript", "Correctly identified 'postscript' as containing the error");
assert(bundleReport.scriptErrors[0].diagnostic.line === 2, "Pinpointed script error to line 2");

// 7.11 Deep Line 100 JSON Error Localization (User Reported Regression)
console.log("\n[7.11] Testing Deep Line 100 JSON Error Localization:");
const linesJson = [];
for (let i = 1; i <= 99; i++) {
  linesJson.push(`  "key_${i}": ${i},`);
}
linesJson.push(`  "key_100": ,`); // syntax error on line 101 of document
linesJson.push(`  "key_101": 101`);
const deep100Json = "{\n" + linesJson.join("\n") + "\n}";

const deepJsonReport = Validator.validateJson(deep100Json);
assert(deepJsonReport.valid === false, "Detected JSON error in 100+ line document");
assert(deepJsonReport.line === 101, `Pinpointed JSON error accurately at line 101 (got: ${deepJsonReport.line})`);
assert(deepJsonReport.column > 1, `Pinpointed JSON error column accurately (got col: ${deepJsonReport.column})`);
assert(deepJsonReport.snippet !== null, "Generated code snippet around line 101");
assert(deepJsonReport.snippet.errorLine === 101, "Snippet points to line 101");

// 7.12 Deep Line 100 JavaScript Error Localization (User Reported Regression)
console.log("\n[7.12] Testing Deep Line 100 JavaScript Error Localization:");
const linesJs = [];
for (let i = 1; i <= 99; i++) {
  linesJs.push(`const variable_${i} = ${i};`);
}
linesJs.push(`const badLine = ;`); // syntax error on line 100
linesJs.push(`const variable_101 = 101;`);
const deep100Js = linesJs.join("\n");

const deepJsReport = Validator.validateJs(deep100Js);
assert(deepJsReport.valid === false, "Detected JS syntax error in 100+ line script");
assert(deepJsReport.line === 100, `Pinpointed JS syntax error accurately at line 100 (got: ${deepJsReport.line})`);
assert(deepJsReport.column === 17, `Pinpointed JS syntax error column accurately at col 17 (got: ${deepJsReport.column})`);
assert(deepJsReport.snippet !== null, "Generated code snippet around line 100");
assert(deepJsReport.snippet.errorLine === 100, "Snippet points to line 100");

// 7.13 Fallback JS Error Detection when Acorn is absent
console.log("\n[7.13] Testing Fallback JS Error Detection (without Acorn):");
const savedAcorn = globalThis.acorn;
globalThis.acorn = null;
const fallbackReport = Validator.validateJs(deep100Js);
assert(fallbackReport.valid === false, "Fallback detected JS syntax error");
assert(fallbackReport.line === 100, `Fallback accurately identified line 100 without Acorn (got: ${fallbackReport.line})`);
globalThis.acorn = savedAcorn;

console.log("\n====================================");
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log("====================================");

if (failed > 0) process.exit(1);
