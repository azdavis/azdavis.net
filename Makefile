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
	@grep -qE "require\(" $@ && \
		echo "browserify -o $@ $@" && \
		browserify -o $@.js $@ && \
		mv $@.js $@;:
	uglifyjs --screw-ie8 -cemo $@ $@ $(Q)

clean:
	find . \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -delete

test:
	@open -g "http://localhost:8080"
	@ruby -run -e httpd $(Q)

deploy:
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

.PHONY: all clean test deploy npm-i-g
