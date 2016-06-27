SHELL = zsh -euo pipefail
Q = &>/dev/null

.PHONY: all clean deploy npm-i-g
.PRECIOUS: %.css %.js

all: \
	404.html \
	index.html \
	lgw/index.html
lgw/index.js: \
	lgw/sprite.ts \
	lgw/enemy.ts \
	lgw/player.ts \
	lgw/bullet.ts \
	lgw/canvas.ts \
	lgw/game.ts

%.html: %.pug base/head.pug %.css %.js
	pug -sb . --doctype html $<
	@tr "\n" " " < $@ > $@.html
	@mv $@.html $@

%.css: %.styl base/variables.styl
	stylus -u autoprefixer-stylus -c $< $(Q)

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
	[[ -z "$$(git status --porcelain)" ]]
	[[ "$$(git rev-parse --abbrev-ref @)" == master ]]
	@$(MAKE)
	git push -q origin master
	surge . $(Q)

npm-i-g:
	npm i -g \
		autoprefixer-stylus \
		browserify \
		node-static \
		pug-cli \
		stylus \
		surge \
		tslint \
		typescript \
		uglifyjs
