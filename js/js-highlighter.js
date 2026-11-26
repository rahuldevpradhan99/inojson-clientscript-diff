/**
 * Lightweight & fast JavaScript syntax tokenizer for diff rendering
 * Safely handles HTML escaping and highlights tokens while preserving diff spans
 */

export const JsHighlighter = {
  escapeHtml(str = "") {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  /**
   * Highlight a plain JavaScript line
   */
  highlightLine(line = "") {
    if (!line) return "&nbsp;";

    // Check for comment
    const trimmed = line.trim();
    if (trimmed.startsWith("//")) {
      return `<span class="tok-comment">${this.escapeHtml(line)}</span>`;
    }

    // Token regex pattern
    const tokenRegex =
      /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\.|[^`])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b(?:const|let|var|function|return|if|else|switch|case|break|default|try|catch|finally|throw|new|typeof|instanceof|void|delete|in|of|for|while|do|continue|debugger|async|await|class|extends|super|import|export|from|null|undefined|true|false)\b)|(\b(?:console|model|editor|fieldList|appealConfig|window|document|Math|Date|JSON|Array|Object|String|Number|Boolean|RegExp|Promise)\b)|(\b\d+(?:\.\d+)?\b)|([a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\())|([+\-*/%=&|!<>?:^~]+)|(\s+)|([^\s\w])/g;

    let result = "";
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(line)) !== null) {
      const [
        full,
        comment,
        string,
        keyword,
        builtin,
        number,
        fnCall,
        operator,
        whitespace,
        punct
      ] = match;

      if (comment) {
        result += `<span class="tok-comment">${this.escapeHtml(comment)}</span>`;
      } else if (string) {
        result += `<span class="tok-string">${this.escapeHtml(string)}</span>`;
      } else if (keyword) {
        result += `<span class="tok-keyword">${this.escapeHtml(keyword)}</span>`;
      } else if (builtin) {
        result += `<span class="tok-builtin">${this.escapeHtml(builtin)}</span>`;
      } else if (number) {
        result += `<span class="tok-number">${this.escapeHtml(number)}</span>`;
      } else if (fnCall) {
        result += `<span class="tok-fn">${this.escapeHtml(fnCall)}</span>`;
      } else if (operator) {
        result += `<span class="tok-operator">${this.escapeHtml(operator)}</span>`;
      } else if (whitespace) {
        // preserve spaces
        result += this.escapeHtml(whitespace);
      } else if (punct) {
        result += `<span class="tok-punct">${this.escapeHtml(punct)}</span>`;
      } else {
        result += this.escapeHtml(full);
      }
      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      result += this.escapeHtml(line.slice(lastIndex));
    }

    return result || "&nbsp;";
  },

  /**
   * Render intra-line diff spans with character highlights
   */
  renderDiffSpans(spans = [], type = "modify") {
    if (!spans || spans.length === 0) return "&nbsp;";

    let html = "";
    for (const span of spans) {
      const escaped = this.escapeHtml(span.text);
      if (span.type === "del") {
        html += `<span class="diff-char-del" title="Deleted">${escaped}</span>`;
      } else if (span.type === "ins") {
        html += `<span class="diff-char-ins" title="Inserted">${escaped}</span>`;
      } else {
        // Equal part can still be syntax highlighted
        html += this.highlightLine(span.text);
      }
    }
    return html || "&nbsp;";
  }
};
