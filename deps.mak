all: \
	src/google827af1fbb442e5a9.html \
	$(patsubst %.pug, %.html, \
	$(shell find src -not -path "*base*" -name "*.pug"))

src/index.css: src/base/a.styl src/base/code.styl

src/10k/index.css: src/base/a.styl src/base/code.styl
src/10k/index.html: src/10k/index.md

src/cbg/index.html: src/cbg/index.js
src/cbg/index.js: $(wildcard src/cbg/*.ts)

src/lgw/index.html: src/lgw/index.js
src/lgw/index.js: $(wildcard src/lgw/*.ts)

src/rut/index.html: src/rut/index.js
src/rut/index.js: $(wildcard src/rut/*.ts)
