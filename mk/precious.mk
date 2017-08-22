build/%.html: src/%.pug src/_base/head.pug build/%.css build/%.js
	echo $@ && mkdir -p $(dir $@)
	pug -sb . --doctype html $<
	html-minifier \
		--collapse-whitespace \
		--decode-entities \
		--minify-css \
		--minify-js \
		--minify-urls \
		--remove-attribute-quotes \
		--remove-redundant-attributes \
		-o $@.html $@; \
	mv $@.html $@

build/%.css: src/%.styl
	echo $@ && mkdir -p $(dir $@)
	stylus -u autoprefixer-stylus -o $(dir $@) $< > /dev/null

build/%.js: src/%.js src/_base/dark.js
	echo $@ && mkdir -p $(dir $@)
	rollup -c --environment "entry:$<,dest:$@"
