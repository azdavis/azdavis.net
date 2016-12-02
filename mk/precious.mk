.PRECIOUS: %.html %.css %.js

%.html: %.pug src/base/head.pug %.css %.js
	echo $@
	pug -b . --doctype html $<
	html-minifier \
		--collapse-whitespace \
		--decode-entities \
		--minify-css \
		--minify-js \
		--minify-urls \
		--remove-attribute-quotes \
		--remove-redundant-attributes \
		-o $@.html $@; mv $@.html $@

%.css: %.styl src/base/box_sizing.styl
	echo $@
	stylus -u autoprefixer-stylus $<

%.js: %.ts src/base/dark.ts
	echo $@
	tsc \
		--forceConsistentCasingInFileNames \
		--noEmitOnError \
		--removeComments \
		--strictNullChecks \
		--target ES5 \
		--module ES2015 \
		$<
	rollup -f iife -o $@ $@
