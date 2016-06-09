Q = &> /dev/null

all: 404.html index.html game/index.html
404.html: 404.css
index.html: index.css index.js
game/index.html: game/index.css game/index.js
game/index.js: \
	game/sprite.ts \
	game/enemy.ts \
	game/player.ts \
	game/bullet.ts \
	game/canvas.ts \
	game/game.ts

%.html: %.pug head.pug
	pug -sb . --doctype 'html' $<

%.css: %.styl
	stylus -u 'autoprefixer-stylus' -c $< $(Q)

%.js: %.ts
	tsc --removeComments $<
	browserify -o $@.js $@
	mv $@.js $@
	uglifyjs --screw-ie8 --wrap -cmo $@ $@

clean:
	find . \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -delete

test:
	@open -g 'http://localhost:8080'
	@ruby -run -e httpd $(Q)

deploy:
	git checkout -q master
	git push -q origin master
	@$(MAKE) all
	surge . $(Q)

.PHONY: all clean test deploy
