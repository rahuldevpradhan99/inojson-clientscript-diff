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

console.log("\n====================================");
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log("====================================");

if (failed > 0) process.exit(1);
