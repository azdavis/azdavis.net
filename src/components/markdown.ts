import hl from "highlight.js";
import katex from "katex";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import type StateBlock from "markdown-it/lib/rules_block/state_block";
import type StateInline from "markdown-it/lib/rules_inline/state_inline";
import { absurd } from "../util/absurd";

// math stuff adapted from https://github.com/goessner/markdown-it-texmath
// copyright Stefan Goessner, licensed under the MIT License.

const BACKSLASH = 0x5c;
const ZERO = 0x30;
const NINE = 0x39;

function isAsciiDigitCodePoint(num: number): boolean {
  return ZERO <= num && num <= NINE;
}

const inlineRule = {
  name: "math_inline",
  re: /\$((?:[^\s\\])|(?:\S.*?[^\s\\]))\$/g,
  tag: "$",
};

function inlineMath(state: StateInline, silent: boolean): boolean {
  const pos = state.pos;
  inlineRule.re.lastIndex = pos;
  const prev = pos > 0 ? state.src[pos - 1].charCodeAt(0) : null;
  if (
    !state.src.startsWith(inlineRule.tag, pos) ||
    (prev !== null && (prev === BACKSLASH || isAsciiDigitCodePoint(prev)))
  ) {
    return false;
  }
  const match = inlineRule.re.exec(state.src);
  if (match === null) {
    return false;
  }
  const next =
    inlineRule.re.lastIndex < state.src.length
      ? state.src[inlineRule.re.lastIndex].charCodeAt(0)
      : null;
  if (
    pos >= inlineRule.re.lastIndex ||
    (next !== null && isAsciiDigitCodePoint(next))
  ) {
    return false;
  }
  if (!silent) {
    const token = state.push(inlineRule.name, "math", 0);
    token.content = match[1];
    token.markup = inlineRule.tag;
  }
  state.pos = inlineRule.re.lastIndex;
  return true;
}

const blockRule = {
  name: "math_block",
  re: /\${2}([^$]*?[^\\])\${2}/gm,
  tag: "$$",
};

function blockMath(
  state: StateBlock,
  begLine: number,
  endLine: number,
  silent: boolean,
): boolean {
  const pos = state.bMarks[begLine] + state.tShift[begLine];
  blockRule.re.lastIndex = pos;
  if (!state.src.startsWith(blockRule.tag, pos)) {
    return false;
  }
  const match = blockRule.re.exec(state.src);
  if (match === null || pos >= blockRule.re.lastIndex) {
    return false;
  }
  if (silent) {
    return true;
  }
  const endPos = blockRule.re.lastIndex - 1;
  let curLine: number;
  for (curLine = begLine; curLine < endLine; curLine++) {
    if (
      endPos >= state.bMarks[curLine] + state.tShift[curLine] &&
      endPos <= state.eMarks[curLine]
    ) {
      break;
    }
  }
  const lineMax = state.lineMax;
  state.lineMax = curLine;
  const token = state.push(blockRule.name, "math", 0);
  token.block = true;
  token.tag = blockRule.tag;
  token.markup = "";
  token.content = match[1];
  token.map = [begLine, curLine + 1];
  state.lineMax = lineMax;
  state.line = curLine + 1;
  return true;
}

function runHljs(code: string, language: string): string {
  if (!hl.getLanguage(language)) {
    throw new Error(`unknown language: ${language}`);
  }
  return hl.highlight(code, { language }).value;
}

type DiffMarker =
  | { t: "meta"; content: string }
  | { t: "addition" }
  | { t: "deletion" };

const FIRST_CHAR = /^./;

function rmFirstChar(s: string): string {
  return s.replace(FIRST_CHAR, "");
}

function hljsSpan(cls: string, inner: string): string {
  return `<span class="hljs-${cls}">${inner}</span>`;
}

const COMMENT = /^#/;

function highlightWithDiff(code: string): string {
  const diffLines = code.split("\n");
  const firstLine = diffLines.shift();
  if (firstLine === undefined) {
    throw new Error("highlight empty diff block");
  }
  if (!COMMENT.test(firstLine)) {
    throw new Error(
      `first diffLine of diff was not a '#' comment: '${firstLine}'`,
    );
  }
  const lang = firstLine.replace(COMMENT, "").trim();
  const langLines: string[] = [];
  const diffMarkers: (DiffMarker | null)[] = [];
  for (const diffLine of diffLines) {
    if (diffLine.length === 0) {
      langLines.push("");
      diffMarkers.push(null);
      continue;
    }
    const c = diffLine[0];
    switch (c) {
      case "#":
        continue;
      case " ":
        langLines.push(rmFirstChar(diffLine));
        diffMarkers.push(null);
        continue;
      case "@":
        langLines.push("");
        diffMarkers.push({ t: "meta", content: diffLine });
        continue;
      case "+":
        langLines.push(rmFirstChar(diffLine));
        diffMarkers.push({ t: "addition" });
        continue;
      case "-":
        langLines.push(rmFirstChar(diffLine));
        diffMarkers.push({ t: "deletion" });
        continue;
      default:
        throw new Error(`unknown first char of diff diffLine: '${c}'`);
    }
  }
  if (langLines.length !== diffMarkers.length) {
    throw new Error("bug: langLines.length !== diffMarkers.length");
  }
  const hljsLines = runHljs(langLines.join("\n"), lang).split("\n");
  if (langLines.length !== hljsLines.length) {
    throw new Error("bug: langLines.length !== hljsLines.length");
  }
  const retLines: string[] = [];
  for (let i = 0; i < diffMarkers.length; i++) {
    const hljsLine = hljsLines[i];
    const diffMarker = diffMarkers[i];
    if (diffMarker === null) {
      const retLine = hljsLine.length === 0 ? hljsLine : " " + hljsLine;
      retLines.push(retLine);
      continue;
    }
    switch (diffMarker.t) {
      case "meta":
        if (hljsLine.length !== 0) {
          throw new Error("bug: non-empty hljs meta diffLine");
        }
        retLines.push(hljsSpan("meta", diffMarker.content));
        continue;
      case "addition":
        retLines.push(hljsSpan("addition", "+" + hljsLine));
        continue;
      case "deletion":
        retLines.push(hljsSpan("deletion", "-" + hljsLine));
        continue;
      default:
        return absurd(diffMarker);
    }
  }
  return retLines.join("\n");
}

function highlight(code: string, lang: string): string {
  if (lang.length === 0) {
    throw new Error(
      "no lang for code block. to opt out of syntax highlighting, use `text`",
    );
  }
  return lang === "diff" ? highlightWithDiff(code) : runHljs(code, lang);
}

const md = markdownIt({
  highlight,
  typographer: true,
  html: true,
});

markdownItAnchor(md, {
  level: 2,
  tabIndex: false,
  permalink: markdownItAnchor.permalink.headerLink({ safariReaderFix: true }),
});

function renderMath(tex: string, displayMode: boolean): string {
  return katex.renderToString(tex, { throwOnError: true, displayMode });
}

md.inline.ruler.before("escape", inlineRule.name, inlineMath);
md.block.ruler.before("fence", blockRule.name, blockMath);

md.renderer.rules[inlineRule.name] = (tokens, idx) =>
  renderMath(tokens[idx].content, false);

md.renderer.rules[blockRule.name] = (tokens, idx) =>
  renderMath(tokens[idx].content, true);

export function inline(text: string): string {
  return md.renderInline(text);
}

export function block(text: string): string {
  return md.render(text);
}
