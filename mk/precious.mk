.PRECIOUS: %.html %.css %.c.js

%.html: %.pug src/_base/head.pug %.css %.c.js
	echo $@
	pug -s --doctype html $<
	html-minifier \
		--collapse-whitespace \
		--decode-entities \
		--minify-css \
		--minify-js \
		--minify-urls \
		--remove-attribute-quotes \
		--remove-redundant-attributes \
		-o $@.html $@ ;\
	mv $@.html $@

%.css: %.styl
	echo $@
	stylus -u autoprefixer-stylus $< > /dev/null

%.c.js: %.js src/_base/dark.js
	echo $@
	here="$$PWD" ;\
	cd $(dir $@) ;\
	rollup -c "$$here/rollup.config.js"
