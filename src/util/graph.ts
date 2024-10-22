interface SvgText {
  x: number;
  y: number;
  s: string;
  big: boolean;
}

function renderText({ x, y, s, big }: SvgText): string {
  const fontSize = big ? 4 : 2;
  return `<text x="${x}" y="${y}" text-anchor="middle" font-size="${fontSize}">${s}</text>`;
}

const letters: { [k: string]: SvgText } = {
  A: { x: 30, y: 5, s: "A", big: true },
  B: { x: 25, y: 15, s: "B", big: true },
  C: { x: 35, y: 15, s: "C", big: true },
  D: { x: 20, y: 25, s: "D", big: true },
  E: { x: 30, y: 25, s: "E", big: true },
  F: { x: 40, y: 25, s: "F", big: true },
  G: { x: 25, y: 35, s: "G", big: true },
  H: { x: 35, y: 35, s: "H", big: true },
};

function arrow(begin: SvgText, end: SvgText): string {
  const dx = begin.x > end.x ? -1 : 1;
  const mx = begin.x + dx;
  const my = begin.y + 1;
  const lx = end.x - dx;
  const ly = end.y - 5;
  return `<path d="M ${mx},${my} L ${lx},${ly}" stroke-width="0.2" marker-end="url(#head)" />`;
}

const lettersStr = Object.values(letters)
  .map((x) => renderText(x))
  .join("\n  ");

let levelsStr = "";
const ls = Array.from(new Set(Object.values(letters).map((x) => x.y)));
ls.sort((a, b) => a - b);
for (let i = 0; i < ls.length; i++) {
  const t = { x: 10, y: ls[i], s: String(i), big: false };
  levelsStr += renderText(t);
  levelsStr += "\n  ";
}

export const g = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40">
  <defs>
    <marker id="head" orient="auto" markerWidth="8" markerHeight="8" refX="1" refY="4">
      <path d="M 0,0 V 8 L 4,4 Z" />
    </marker>
  </defs>
  ${lettersStr}
  ${levelsStr}
  ${arrow(letters.A, letters.B)}
  ${arrow(letters.A, letters.C)}
  ${arrow(letters.B, letters.D)}
  ${arrow(letters.B, letters.E)}
  ${arrow(letters.C, letters.E)}
  ${arrow(letters.C, letters.F)}
  ${arrow(letters.E, letters.G)}
  ${arrow(letters.E, letters.H)}
</svg>
`;
