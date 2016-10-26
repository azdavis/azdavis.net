.PRECIOUS: %.html %.css %.js

%.html: %.pug src/base/pug/head.pug %.css %.js
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
	stylus -u autoprefixer-stylus $< $(Q)

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
