SHELL = PATH=$(PWD)/node_modules/.bin:$(PATH) sh
BINARY = build/favicon.png build/touch-icon.png build/keybase.txt

.SILENT:
.SUFFIXES:
.PHONY: all clean test git-ok netlify upload setup deploy
.PRECIOUS: build/%.css build/%.js
