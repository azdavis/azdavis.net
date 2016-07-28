all: \
	$(patsubst %.pug, %.html, \
	$(shell find src -not -path "*base*" -name "*.pug"))
src/cbg/index.js: $(wildcard src/cbg/*.ts)
src/lgw/index.js: $(wildcard src/lgw/*.ts)
src/rut/index.js: $(wildcard src/rut/*.ts)
