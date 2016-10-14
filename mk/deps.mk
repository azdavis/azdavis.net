src/index.css src/fast/index.css src/resume/index.css: \
	src/base/styl/a.styl
src/index.css src/fast/index.css: \
	src/base/styl/code.styl
src/cbg/index.js src/fast/index.js src/lgw/index.js src/rut/index.js: \
	src/base/ts/dom.ts
src/404/index.css src/fast/index.css src/lgw/index.css src/resume/index.css: \
	src/base/styl/h1_h2_h3.styl
src/fast/index.css: \
	src/base/styl/hr.styl
src/cbg/index.js src/lgw/index.js src/rut/index.js: \
	src/base/ts/is_mobile.ts
src/index.css src/404/index.css src/fast/index.css src/resume/index.css: \
	src/base/styl/main_text.styl
src/fast/index.css: \
	src/base/styl/pre.styl

src/fast/index.html: src/fast/index.md src/fast/index.js
src/fast/index.js: $(wildcard src/fast/*.ts)

src/cbg/index.html: src/cbg/index.js
src/cbg/index.js: $(wildcard src/cbg/*.ts)

src/lgw/index.html: src/lgw/index.js
src/lgw/index.js: $(wildcard src/lgw/*.ts)

src/rut/index.html: src/rut/index.js
src/rut/index.js: $(wildcard src/rut/*.ts)
