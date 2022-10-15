import hl from "highlight.js";
import katex from "katex";
import markdownIt from "markdown-it";
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

const md = markdownIt({
  highlight(code: string, language: string): string {
    if (!hl.getLanguage(language)) {
      throw new Error(`unknown language: ${language}`);
    }
    return hl.highlight(code, { language }).value;
  },
  typographer: true,
  html: true,
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

export type Display = "block" | "inline";
export function markdown(text: string, display: Display): string {
  switch (display) {
    case "block":
      return md.render(text);
    case "inline":
      return md.renderInline(text);
    default:
      return absurd(display);
  }
}
