N = $(PWD)/node_modules/.bin/

.SILENT:
.SUFFIXES:
.PHONY: all clean test git-ok netlify upload setup deploy
.PRECIOUS: \
	build/%.html \
	build/%.css \
	build/%.js \
	build/% \
	node_modules \
	.git/hooks/pre-commit
