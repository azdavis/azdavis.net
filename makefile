MAKEFLAGS += -rRs
SHELL = PATH=node_modules/.bin:$(PATH) sh
Q = &> /dev/null
BINARY = src/favicon.png src/touch_icon.png src/rut/a.mp3 src/rut/ci.png

include deps.mk

.PHONY: all clean test git-ok surge upload setup deploy

.PRECIOUS: %.css %.js

%.html: %.pug src/base/pug/head.pug %.css
	pug -sb . --doctype html $<
	html-minifier \
		--collapse-whitespace \
		--decode-entities \
		--minify-css \
		--minify-js \
		--minify-urls \
		--remove-attribute-quotes \
		--remove-redundant-attributes \
		-o $@.html $@; mv $@.html $@

%.css: %.styl src/base/styl/var.styl
	stylint -c lint/styl.json $?
	BROWSERSLIST="> 0.1%" stylus -u autoprefixer-stylus $< $(Q)

%.js: %.ts
	tslint -c lint/ts.json $?
	tsc \
		--forceConsistentCasingInFileNames \
		--noEmitOnError \
		--removeComments \
		--strictNullChecks \
		--target ES5 \
		--module ES2015 \
		$<
	rollup -f iife -o $@ $@ $(Q)

src/google827af1fbb442e5a9.html:
	printf "google-site-verification: google827af1fbb442e5a9.html" \
		> src/google827af1fbb442e5a9.html

$(BINARY):
	curl -fsSL "http://azdavis.xyz/$(patsubst src/%,%,$@)" > $@

node_modules:
	npm i

.git/hooks:
	mkdir $@
	echo "make" > $@/pre-commit
	echo "make clean" > $@/post-checkout
	chmod +x $@/*

clean:
	find src \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -delete

test:
	http-server src &> /dev/null & \
	trap "kill $$!; exit" INT; \
	open -g "http://localhost:8080" & \
	while true; do find . \
		-not -path "*.git*" \
		-a -not -path "*node_modules*" \
		| entr -d $(MAKE) || [ $$? == 2 ]; \
	done

git-ok:
	[ -z "$$(git status --porcelain)" ]
	[ "$$(git rev-parse --abbrev-ref @)" = master ]

surge:
	grep -q "surge.sh" ~/.netrc || surge login

upload:
	git push -q origin master
	mv src/404/index.html src/404.html
	surge -d azdavis.xyz -p src 2> /dev/null \
		| grep size \
		| sed -E "s/^$$(printf "\033")\[90m +//g"
	mv src/404.html src/404/index.html

setup: .git/hooks node_modules $(BINARY) surge

deploy: setup git-ok all upload
