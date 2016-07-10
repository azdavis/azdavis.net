PATH := node_modules/.bin:$(PATH)
SHELL := sh -euo pipefail
MAKEFLAGS += -s

.PHONY: all clean deploy git-ok hooks npm-i setup surge
.PRECIOUS: %.css %.js

include makefile.dep

%.html: %.pug base/head.pug %.css %.js
	echo $@
	pug -sb . --doctype html $<
	tr "\n" " " < $@ > $@.html
	mv $@.html $@

%.css: %.styl base/constants.styl
	echo $@
	stylint -c .lint/styl.json $?
	stylus -u autoprefixer-stylus -c $< &> /dev/null

%.js: %.ts
	echo $@
	tslint -c .lint/ts.json $<
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
	surge -d azdavis.xyz -p . 2> /dev/null \
		| grep size \
		| sed -E "s/^$$(printf "\033")\[90m +//g"

git-ok:
	[[ -z "$$(git status --porcelain)" ]]
	[[ "$$(git rev-parse --abbrev-ref @)" == master ]]

hooks:
	mkdir -p .git/hooks
	rm -f .git/hooks/*.sample
	for f in .hooks/*; do ln -s "../../$$f" .git/hooks; done

npm-i:
	npm i

setup: hooks npm-i surge

surge:
	if ! grep -q surge.sh ~/.netrc; then surge login; fi
