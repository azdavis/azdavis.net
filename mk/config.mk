SHELL = PATH=$(PWD)/node_modules/.bin:$(PATH) sh

.SILENT:
.SUFFIXES:
.PHONY: all clean test git-ok netlify upload setup deploy
.PRECIOUS: build/%.css build/%.js
