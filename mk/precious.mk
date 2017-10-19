build/%.html: src/%.pug src/_base/head.pug build/%.css build/%.js
	echo $@ && mkdir -p $(dir $@)
	$(N)pug -sb . --doctype html -o $(dir $@) $<
	$(N)html-minifier \
		--collapse-whitespace \
		--decode-entities \
		--minify-css \
		--minify-js \
		--minify-urls \
		--remove-attribute-quotes \
		--remove-redundant-attributes \
		-o $@.html $@ && \
	mv $@.html $@

build/%.css: src/%.styl
	echo $@ && mkdir -p $(dir $@)
	$(N)stylus -u autoprefixer-stylus -o $(dir $@) $< > /dev/null

build/%.js: src/%.js
	echo $@ && mkdir -p $(dir $@)
	$(N)rollup -c --environment "entry:$<,dest:$@"
