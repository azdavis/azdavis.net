#!/usr/bin/env python3

"""
This makes the example dependency graph in the rjsonnet post. To re-generate, run this script with
python3, copy the output, and paste it into the markdown file.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class Text:
    x: int
    y: int
    s: str
    big: bool = True

    def render(self) -> str:
        font_size = 4 if self.big else 2
        return f'<text x="{self.x}" y="{self.y}" text-anchor="middle" font-size="{font_size}">{self.s}</text>'


class Letters:
    A = Text(30, 5, "A")
    B = Text(25, 15, "B")
    C = Text(35, 15, "C")
    D = Text(20, 25, "D")
    E = Text(30, 25, "E")
    F = Text(40, 25, "F")
    G = Text(25, 35, "G")
    H = Text(35, 35, "H")

    ALL = [A, B, C, D, E, F, G, H]


def arrow(begin: Text, end: Text) -> str:
    if begin.x > end.x:
        dx = -1
    else:
        dx = 1
    return f'<path d="M {begin.x+dx},{begin.y+1} L {end.x-dx},{end.y-5}" stroke="black" stroke-width="0.2" marker-end="url(#head)" />'


levels = sorted({letter.y for letter in Letters.ALL})

result = f"""
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40">
  <defs>
    <marker id="head" orient="auto" markerWidth="8" markerHeight="8" refX="1" refY="4">
      <path d="M 0,0 V 8 L 4,4 Z" fill="black" />
    </marker>
  </defs>
  {"\n  ".join(letter.render() for letter in Letters.ALL)}
  {"\n  ".join(Text(10, y, str(i), big=False).render() for i, y in enumerate(levels))}
  {arrow(Letters.A, Letters.B)}
  {arrow(Letters.A, Letters.C)}
  {arrow(Letters.B, Letters.D)}
  {arrow(Letters.B, Letters.E)}
  {arrow(Letters.C, Letters.E)}
  {arrow(Letters.C, Letters.F)}
  {arrow(Letters.E, Letters.G)}
  {arrow(Letters.E, Letters.H)}
</svg>
"""

print(result.strip())
