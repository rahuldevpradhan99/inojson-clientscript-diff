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
   * High-speed line-level diff using common prefix/suffix trimming + unique anchor divide-and-conquer
   * Handles 5,000+ line JSON bundles in milliseconds without multi-megabyte DP allocation.
   */
  diffLines(linesA, linesB, ignoreWs) {
    const normalize = str => (ignoreWs ? str.trim().replace(/\s+/g, " ") : str);
    const n = linesA.length;
    const m = linesB.length;

    const normA = linesA.map(normalize);
    const normB = linesB.map(normalize);

    const ops = [];

    const diffRange = (aStart, aEnd, bStart, bEnd) => {
      // 1. Trim common prefix
      while (aStart < aEnd && bStart < bEnd && normA[aStart] === normB[bStart]) {
        ops.push({
          type: "equal",
          valA: linesA[aStart],
          valB: linesB[bStart],
          lineA: aStart + 1,
          lineB: bStart + 1
        });
        aStart++;
        bStart++;
      }

      // 2. Trim common suffix
      const suffixOps = [];
      while (aStart < aEnd && bStart < bEnd && normA[aEnd - 1] === normB[bEnd - 1]) {
        suffixOps.push({
          type: "equal",
          valA: linesA[aEnd - 1],
          valB: linesB[bEnd - 1],
          lineA: aEnd,
          lineB: bEnd
        });
        aEnd--;
        bEnd--;
      }

      const lenA = aEnd - aStart;
      const lenB = bEnd - bStart;

      if (lenA === 0 && lenB === 0) {
        // Nothing between prefix and suffix
      } else if (lenA === 0) {
        for (let b = bStart; b < bEnd; b++) {
          ops.push({ type: "add", valB: linesB[b], lineB: b + 1 });
        }
      } else if (lenB === 0) {
        for (let a = aStart; a < aEnd; a++) {
          ops.push({ type: "del", valA: linesA[a], lineA: a + 1 });
        }
      } else if (lenA * lenB <= 250000) {
        // Exact Myers/LCS DP on bounded sub-slice
        const dp = Array.from({ length: lenA + 1 }, () => new Uint32Array(lenB + 1));
        for (let i = 0; i < lenA; i++) {
          const a = normA[aStart + i];
          for (let j = 0; j < lenB; j++) {
            if (a === normB[bStart + j]) {
              dp[i + 1][j + 1] = dp[i][j] + 1;
            } else {
              dp[i + 1][j + 1] = dp[i + 1][j] >= dp[i][j + 1] ? dp[i + 1][j] : dp[i][j + 1];
            }
          }
        }

        const sliceOps = [];
        let i = lenA;
        let j = lenB;
        while (i > 0 || j > 0) {
          if (i > 0 && j > 0 && normA[aStart + i - 1] === normB[bStart + j - 1]) {
            sliceOps.push({
              type: "equal",
              valA: linesA[aStart + i - 1],
              valB: linesB[bStart + j - 1],
              lineA: aStart + i,
              lineB: bStart + j
            });
            i--;
            j--;
          } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            sliceOps.push({
              type: "add",
              valB: linesB[bStart + j - 1],
              lineB: bStart + j
            });
            j--;
          } else {
            sliceOps.push({
              type: "del",
              valA: linesA[aStart + i - 1],
              lineA: aStart + i
            });
            i--;
          }
        }
        for (let k = sliceOps.length - 1; k >= 0; k--) {
          ops.push(sliceOps[k]);
        }
      } else {
        // Large block: find unique matching lines in both ranges (Patience-style anchors)
        const countA = new Map();
        const posA = new Map();
        for (let i = aStart; i < aEnd; i++) {
          const s = normA[i];
          countA.set(s, (countA.get(s) || 0) + 1);
          if (!posA.has(s)) posA.set(s, i);
        }

        const countB = new Map();
        const posB = new Map();
        for (let j = bStart; j < bEnd; j++) {
          const s = normB[j];
          countB.set(s, (countB.get(s) || 0) + 1);
          if (!posB.has(s)) posB.set(s, j);
        }

        // Gather candidates unique on both sides in B's order
        const pairs = [];
        for (let j = bStart; j < bEnd; j++) {
          const s = normB[j];
          if (countB.get(s) === 1 && countA.get(s) === 1) {
            pairs.push([posA.get(s), j]);
          }
        }

        if (pairs.length > 0) {
          // Longest increasing subsequence on pair[0] using O(K log K) patience sorting
          const tails = [];
          const tailIndices = [];
          const prev = new Int32Array(pairs.length).fill(-1);
          for (let idx = 0; idx < pairs.length; idx++) {
            const x = pairs[idx][0];
            let lo = 0, hi = tails.length;
            while (lo < hi) {
              const mid = (lo + hi) >> 1;
              if (tails[mid] < x) lo = mid + 1;
              else hi = mid;
            }
            tails[lo] = x;
            tailIndices[lo] = idx;
            if (lo > 0) prev[idx] = tailIndices[lo - 1];
          }

          const anchors = [];
          for (let cur = tailIndices[tails.length - 1]; cur !== -1; cur = prev[cur]) {
            anchors.push(pairs[cur]);
          }
          anchors.reverse();

          let prevA = aStart;
          let prevB = bStart;
          for (const [ancA, ancB] of anchors) {
            diffRange(prevA, ancA, prevB, ancB);
            ops.push({
              type: "equal",
              valA: linesA[ancA],
              valB: linesB[ancB],
              lineA: ancA + 1,
              lineB: ancB + 1
            });
            prevA = ancA + 1;
            prevB = ancB + 1;
          }
          diffRange(prevA, aEnd, prevB, bEnd);
        } else {
          // Fall back cleanly if two giant files share zero unique lines
          for (let a = aStart; a < aEnd; a++) {
            ops.push({ type: "del", valA: linesA[a], lineA: a + 1 });
          }
          for (let b = bStart; b < bEnd; b++) {
            ops.push({ type: "add", valB: linesB[b], lineB: b + 1 });
          }
        }
      }

      for (let k = suffixOps.length - 1; k >= 0; k--) {
        ops.push(suffixOps[k]);
      }
    };

    diffRange(0, n, 0, m);
    return ops;
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
   * Word/token-level diffing between two lines (safely bounded for giant single-line scripts)
   */
  diffWords(strA, strB) {
    // Fast char-level common prefix/suffix trim before tokenizing huge strings (e.g. 95KB escaped JSON scripts)
    const minLen = Math.min(strA.length, strB.length);
    let prefixLen = 0;
    while (prefixLen < minLen && strA[prefixLen] === strB[prefixLen]) prefixLen++;
    let suffixLen = 0;
    while (
      suffixLen < (minLen - prefixLen) &&
      strA[strA.length - 1 - suffixLen] === strB[strB.length - 1 - suffixLen]
    ) {
      suffixLen++;
    }

    const prefixStr = strA.slice(0, prefixLen);
    const suffixStr = suffixLen > 0 ? strA.slice(strA.length - suffixLen) : "";
    const midA = strA.slice(prefixLen, strA.length - suffixLen);
    const midB = strB.slice(prefixLen, strB.length - suffixLen);

    const tokenize = s => (s ? s.match(/([a-zA-Z0-9_$]+|[^\s\w]|\s+)/g) || [s] : []);

    const tokensA = tokenize(midA);
    const tokensB = tokenize(midB);

    const n = tokensA.length;
    const m = tokensB.length;

    const rawLeft = [];
    const rawRight = [];
    if (prefixStr) {
      rawLeft.push({ text: prefixStr, type: "equal" });
      rawRight.push({ text: prefixStr, type: "equal" });
    }

    // Prevent quadratic OOM if two massive lines differ across thousands of tokens
    if (n * m > 200000) {
      if (midA) rawLeft.push({ text: midA, type: "del" });
      if (midB) rawRight.push({ text: midB, type: "ins" });
    } else {
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

      const midLeft = [];
      const midRight = [];
      let i = n,
        j = m;

      while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && tokensA[i - 1] === tokensB[j - 1]) {
          midLeft.push({ text: tokensA[i - 1], type: "equal" });
          midRight.push({ text: tokensB[j - 1], type: "equal" });
          i--;
          j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
          midRight.push({ text: tokensB[j - 1], type: "ins" });
          j--;
        } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
          midLeft.push({ text: tokensA[i - 1], type: "del" });
          i--;
        }
      }

      for (let k = midLeft.length - 1; k >= 0; k--) rawLeft.push(midLeft[k]);
      for (let k = midRight.length - 1; k >= 0; k--) rawRight.push(midRight[k]);
    }

    if (suffixStr) {
      rawLeft.push({ text: suffixStr, type: "equal" });
      rawRight.push({ text: suffixStr, type: "equal" });
    }

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
