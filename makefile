PATH := node_modules/.bin:$(PATH)
SHELL := sh -euo pipefail
Q ?= &> /dev/null
MAKEFLAGS += -s

.PHONY: all clean test deploy git-ok upload setup hooks npm binary surge
.PRECIOUS: %.css %.js

include deps.mak

%.html: %.pug src/base/head.pug %.css %.js
	echo $@
	pug -sb . --doctype html $<
	tr "\n" " " < $@ > $@.html
	mv $@.html $@

%.css: %.styl src/base/const.styl
	echo $@
	stylint -c lint/styl.json $?
	stylus -u autoprefixer-stylus -c $< $(Q)

%.js: %.ts
	echo $@
	tslint -c lint/ts.json $?
	tsc --noEmitOnError --removeComments $<
	if grep -q require\( $@; then \
		browserify -o $@.js $@; \
		mv $@.js $@; \
	fi
	uglifyjs --screw-ie8 -cemo $@ $@ $(Q)

clean:
	find src \( -name \*.html -o -name \*.css -o -name \*.js \) -delete

test:
	server=; \
	end() { \
	    kill "$$server"; \
	    printf " server stopped."; \
	    exit; \
	}; \
	trap end INT; \
	http-server src &> /dev/null & \
	server="$$!"; \
	sleep 0.5 && open "http://localhost:8080" & \
	while true; do find . \
	    -not -path "*.git*" \
	    -a -not -path "*node_modules*" \
	    | entr -d make || [[ "$?" == 2 ]]; \
	done

deploy: git-ok all upload

git-ok:
	[[ -z "$$(git status --porcelain)" ]]
	[[ "$$(git rev-parse --abbrev-ref @)" == master ]]

upload:
	git push -q origin master
	surge -d azdavis.xyz -p src 2> /dev/null \
		| grep size \
		| sed -E "s/^$$(printf "\033")\[90m +//g"

setup: hooks npm binary surge

hooks:
	mkdir -p .git/hooks
	rm -f .git/hooks/*.sample
	for f in hooks/*; do \
		[[ -h "$$f" ]] && rm "$$f"; \
		ln -fs "../../$$f" .git/hooks; \
	done

npm:
	npm i

binary:
	for f in \
	base/favicon.png \
	base/touch-icon.png \
	; do \
	    curl -fsSL "http://azdavis.xyz/$$f" > "src/$$f"; \
	done

surge:
	if ! grep -q surge.sh ~/.netrc; then surge login; fi
