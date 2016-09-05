all: \
	src/google827af1fbb442e5a9.html \
	$(patsubst %.pug, %.html, \
	$(shell find src -not -path "*base*" -name "*.pug"))

src/index.css src/10k/index.css: \
	src/base/a.styl
src/index.css src/10k/index.css: \
	src/base/code.styl
src/cbg/index.js src/lgw/index.js src/rut/index.js: \
	src/base/dom.ts
src/10k/index.css src/404/index.css src/lgw/index.css src/resume/index.css: \
	src/base/h1-h2-h3.styl
src/10k/index.css: \
	src/base/hr.styl
src/cbg/index.js src/lgw/index.js src/rut/index.js: \
	src/base/isMobile.ts
src/index.css src/10k/index.css src/404/index.css: \
	src/base/main-text.styl
src/10k/index.css: \
	src/base/pre.styl

src/10k/index.html: src/10k/index.md src/10k/index.js

src/cbg/index.html: src/cbg/index.js
src/cbg/index.js: $(wildcard src/cbg/*.ts)

src/lgw/index.html: src/lgw/index.js
src/lgw/index.js: $(wildcard src/lgw/*.ts)

src/rut/index.html: src/rut/index.js
src/rut/index.js: $(wildcard src/rut/*.ts)
