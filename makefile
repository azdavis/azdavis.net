SHELL := sh -euo pipefail
MAKEFLAGS += -s

.PHONY: all clean deploy git-ok npm-i-g
.PRECIOUS: %.css %.js

include makefile.dep

%.html: %.pug base/head.pug %.css %.js
	echo $@
	pug -sb . --doctype html $<
	tr "\n" " " < $@ > $@.html
	mv $@.html $@

%.css: %.styl base/constants.styl
	echo $@
	stylus -u autoprefixer-stylus -c $< &> /dev/null

%.js: %.ts
	echo $@
	tsc --removeComments $<
	if grep -qE "require\(" $@; then \
		browserify -o $@.js $@; \
		mv $@.js $@; \
	fi
	uglifyjs --screw-ie8 -cemo $@ $@ &> /dev/null

clean:
	find . \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -delete

deploy: git-ok all
	git push -q origin master
	surge . 2> /dev/null | grep size | sed -E "s/^$$(printf "\033")\[90m +//g"

git-ok:
	[[ -z "$$(git status --porcelain)" ]]
	[[ "$$(git rev-parse --abbrev-ref @)" == master ]]

npm-i-g:
	npm i -g \
		autoprefixer-stylus \
		browserify \
		http-server \
		pug-cli \
		stylus \
		surge \
		tslint \
		typescript \
		uglifyjs
