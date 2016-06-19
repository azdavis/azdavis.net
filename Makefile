SHELL = zsh -euo pipefail
Q = &>/dev/null

all: \
	404.html \
	index.html \
	lgw/index.html
404.html: \
	404.css \
	404.js
index.html: \
	index.css \
	index.js
lgw/index.html: \
	lgw/index.css \
	lgw/index.js
lgw/index.js: \
	lgw/sprite.ts \
	lgw/enemy.ts \
	lgw/player.ts \
	lgw/bullet.ts \
	lgw/canvas.ts \
	lgw/game.ts

%.html: %.pug base/head.pug
	pug -sb . --doctype "html" $<

%.css: %.styl base/variables.styl
	stylus -u "autoprefixer-stylus" -c $< $(Q)

%.js: %.ts
	tsc --removeComments $<
	@if grep -qE "require\(" $@; then \
		echo "browserify -o $@ $@"; \
		browserify -o $@.js $@; \
		mv $@.js $@; \
	fi
	uglifyjs --screw-ie8 -cemo $@ $@ $(Q)

clean:
	find . \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -delete

deploy:
	test -z "$$(git status --porcelain)"
	git checkout -q master
	@$(MAKE)
	git push -q origin master
	surge . $(Q)

npm-i-g:
	npm i -g \
		autoprefixer-stylus \
		browserify \
		npm \
		pug-cli \
		stylus \
		surge \
		tslint \
		typescript \
		uglifyjs

.PHONY: all clean deploy npm-i-g
