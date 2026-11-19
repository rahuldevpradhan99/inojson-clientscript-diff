/**
 * Myers & Word-Level Diff Engine with Interactive Line-by-Line Merging
 * High-performance, side-by-side & unified diff calculation with character-level highlights
 * and fine-grained single-line merge operations.
 */

export const DiffEngine = {
  /**
   * Main diff entry point
   * @param {string} textA - Original / Base text
   * @param {string} textB - Modified / Target text
   * @param {Object} options - { ignoreWhitespace: boolean }
   */
  computeDiff(textA = "", textB = "", options = {}) {
    const ignoreWs = !!options.ignoreWhitespace;

    const linesA = (textA || "").split(/\r?\n/);
    const linesB = (textB || "").split(/\r?\n/);

    // Compute Line-level diff using LCS
    const lineDiff = this.diffLines(linesA, linesB, ignoreWs);

    // Build aligned rows for side-by-side view with precise insertion indices
    const alignedRows = this.buildAlignedRows(lineDiff);

    // Detect modified pairs and compute intra-line word diffs
    this.computeIntraLineDiffs(alignedRows);

    // Compute diff hunks / change groups for jumping next/prev
    const hunks = this.buildHunks(alignedRows);

    // Statistics
    const stats = this.computeStats(alignedRows, linesA.length, linesB.length);

    return {
      linesA,
      linesB,
      alignedRows,
      hunks,
      stats,
      isIdentical: stats.addedLines === 0 && stats.deletedLines === 0 && stats.modifiedLines === 0
    };
  },

  /**
   * Line-level LCS (Longest Common Subsequence) diff
   */
  diffLines(linesA, linesB, ignoreWs) {
    const normalize = str => (ignoreWs ? str.trim().replace(/\s+/g, " ") : str);

    const n = linesA.length;
    const m = linesB.length;

    // Fast-path identical check
    if (n === m) {
      let identical = true;
      for (let i = 0; i < n; i++) {
        if (normalize(linesA[i]) !== normalize(linesB[i])) {
          identical = false;
          break;
        }
      }
      if (identical) {
        return linesA.map((line, idx) => ({
          type: "equal",
          valA: line,
          valB: linesB[idx],
          lineA: idx + 1,
          lineB: idx + 1
        }));
      }
    }

    const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));

    for (let i = 0; i < n; i++) {
      const a = normalize(linesA[i]);
      for (let j = 0; j < m; j++) {
        if (a === normalize(linesB[j])) {
          dp[i + 1][j + 1] = dp[i][j] + 1;
        } else {
          dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
      }
    }

    // Backtrack to build operations
    const ops = [];
    let i = n,
      j = m;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && normalize(linesA[i - 1]) === normalize(linesB[j - 1])) {
        ops.push({
          type: "equal",
          valA: linesA[i - 1],
          valB: linesB[j - 1],
          lineA: i,
          lineB: j
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        ops.push({
          type: "add",
          valB: linesB[j - 1],
          lineB: j
        });
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
        ops.push({
          type: "del",
          valA: linesA[i - 1],
          lineA: i
        });
        i--;
      }
    }

    return ops.reverse();
  },

  /**
   * Convert linear operations into aligned Left/Right row pairs with insertion index tracking
   */
  buildAlignedRows(ops) {
    const rows = [];
    let idx = 0;

    let leftCount = 0;
    let rightCount = 0;

    while (idx < ops.length) {
      const op = ops[idx];

      if (op.type === "equal") {
        rows.push({
          type: "equal",
          insertAfterLeftIndex: leftCount,
          insertAfterRightIndex: rightCount,
          left: { lineNum: op.lineA, text: op.valA, isPad: false },
          right: { lineNum: op.lineB, text: op.valB, isPad: false }
        });
        leftCount++;
        rightCount++;
        idx++;
      } else {
        const dels = [];
        const adds = [];

        while (idx < ops.length && (ops[idx].type === "del" || ops[idx].type === "add")) {
          if (ops[idx].type === "del") dels.push(ops[idx]);
          if (ops[idx].type === "add") adds.push(ops[idx]);
          idx++;
        }

        const maxLen = Math.max(dels.length, adds.length);

        for (let k = 0; k < maxLen; k++) {
          const d = dels[k];
          const a = adds[k];

          if (d && a) {
            rows.push({
              type: "modify",
              insertAfterLeftIndex: leftCount,
              insertAfterRightIndex: rightCount,
              left: { lineNum: d.lineA, text: d.valA, isPad: false },
              right: { lineNum: a.lineB, text: a.valB, isPad: false }
            });
            leftCount++;
            rightCount++;
          } else if (d) {
            rows.push({
              type: "delete",
              insertAfterLeftIndex: leftCount,
              insertAfterRightIndex: rightCount,
              left: { lineNum: d.lineA, text: d.valA, isPad: false },
              right: { lineNum: null, text: "", isPad: true }
            });
            leftCount++;
          } else if (a) {
            rows.push({
              type: "insert",
              insertAfterLeftIndex: leftCount,
              insertAfterRightIndex: rightCount,
              left: { lineNum: null, text: "", isPad: true },
              right: { lineNum: a.lineB, text: a.valB, isPad: false }
            });
            rightCount++;
          }
        }
      }
    }

    return rows;
  },

  /**
   * Detect modified rows and calculate character/word level diff
   */
  computeIntraLineDiffs(alignedRows) {
    for (const row of alignedRows) {
      if (row.type === "modify") {
        const wordDiff = this.diffWords(row.left.text, row.right.text);
        row.left.spans = wordDiff.leftSpans;
        row.right.spans = wordDiff.rightSpans;
      }
    }
  },

  /**
   * Word/token-level diffing between two lines
   */
  diffWords(strA, strB) {
    const tokenize = s => s.match(/([a-zA-Z0-9_$]+|[^\s\w]|\s+)/g) || [s];

    const tokensA = tokenize(strA);
    const tokensB = tokenize(strB);

    const n = tokensA.length;
    const m = tokensB.length;

    const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        if (tokensA[i] === tokensB[j]) {
          dp[i + 1][j + 1] = dp[i][j] + 1;
        } else {
          dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
      }
    }

    const leftSpans = [];
    const rightSpans = [];
    let i = n,
      j = m;

    const rawLeft = [];
    const rawRight = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && tokensA[i - 1] === tokensB[j - 1]) {
        rawLeft.push({ text: tokensA[i - 1], type: "equal" });
        rawRight.push({ text: tokensB[j - 1], type: "equal" });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        rawRight.push({ text: tokensB[j - 1], type: "ins" });
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
        rawLeft.push({ text: tokensA[i - 1], type: "del" });
        i--;
      }
    }

    rawLeft.reverse();
    rawRight.reverse();

    const mergeSpans = list => {
      const merged = [];
      for (const item of list) {
        if (merged.length > 0 && merged[merged.length - 1].type === item.type) {
          merged[merged.length - 1].text += item.text;
        } else {
          merged.push({ ...item });
        }
      }
      return merged;
    };

    return {
      leftSpans: mergeSpans(rawLeft),
      rightSpans: mergeSpans(rawRight)
    };
  },

  /**
   * Group contiguous change rows into hunks for quick navigation
   */
  buildHunks(alignedRows) {
    const hunks = [];
    let inHunk = false;
    let currentHunk = null;

    alignedRows.forEach((row, rowIndex) => {
      const isDiff = row.type !== "equal";

      if (isDiff && !inHunk) {
        inHunk = true;
        currentHunk = {
          startRow: rowIndex,
          endRow: rowIndex,
          types: new Set([row.type])
        };
      } else if (isDiff && inHunk) {
        currentHunk.endRow = rowIndex;
        currentHunk.types.add(row.type);
      } else if (!isDiff && inHunk) {
        inHunk = false;
        currentHunk.types = Array.from(currentHunk.types);
        hunks.push(currentHunk);
        currentHunk = null;
      }
    });

    if (inHunk && currentHunk) {
      currentHunk.types = Array.from(currentHunk.types);
      hunks.push(currentHunk);
    }

    return hunks;
  },

  /**
   * Calculate summary statistics
   */
  computeStats(alignedRows, leftTotal, rightTotal) {
    let added = 0;
    let deleted = 0;
    let modified = 0;
    let identical = 0;

    for (const row of alignedRows) {
      if (row.type === "insert") added++;
      else if (row.type === "delete") deleted++;
      else if (row.type === "modify") modified++;
      else if (row.type === "equal") identical++;
    }

    return {
      leftTotal,
      rightTotal,
      addedLines: added,
      deletedLines: deleted,
      modifiedLines: modified,
      identicalLines: identical,
      totalChanges: added + deleted + modified
    };
  },

  /**
   * Merge a single individual changed line between Left (Old) and Right (New)
   * @param {string} textLeft - Left code string
   * @param {string} textRight - Right code string
   * @param {Object} row - The specific aligned row being merged
   * @param {string} direction - 'to-left' (New -> Old) or 'to-right' (Old -> New)
   */
  mergeLine(textLeft, textRight, row, direction = "to-left") {
    const linesLeft = (textLeft || "").split(/\r?\n/);
    const linesRight = (textRight || "").split(/\r?\n/);

    if (direction === "to-left") {
      // Merge line from Right (New) into Left (Old)
      if (row.type === "modify") {
        const leftIdx = row.left.lineNum - 1;
        linesLeft[leftIdx] = row.right.text;
      } else if (row.type === "insert") {
        const insertIdx = row.insertAfterLeftIndex;
        linesLeft.splice(insertIdx, 0, row.right.text);
      } else if (row.type === "delete") {
        const leftIdx = row.left.lineNum - 1;
        linesLeft.splice(leftIdx, 1);
      }
    } else if (direction === "to-right") {
      // Merge line from Left (Old) into Right (New)
      if (row.type === "modify") {
        const rightIdx = row.right.lineNum - 1;
        linesRight[rightIdx] = row.left.text;
      } else if (row.type === "delete") {
        const insertIdx = row.insertAfterRightIndex;
        linesRight.splice(insertIdx, 0, row.left.text);
      } else if (row.type === "insert") {
        const rightIdx = row.right.lineNum - 1;
        linesRight.splice(rightIdx, 1);
      }
    }

    return {
      textLeft: linesLeft.join("\n"),
      textRight: linesRight.join("\n")
    };
  },

  /**
   * Merge all changes in bulk in the chosen direction
   */
  mergeAll(textLeft, textRight, direction = "to-left") {
    if (direction === "to-left") {
      // Make Left identical to Right
      return { textLeft: textRight, textRight: textRight };
    } else {
      // Make Right identical to Left
      return { textLeft: textLeft, textRight: textLeft };
    }
  }
};
