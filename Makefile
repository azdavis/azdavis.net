Q = > /dev/null
VQ = &$(Q)

all: 404.html index.html game/index.html
404.html: 404.css
index.html: index.css
game/index.html: game/index.css game/index.js
game/index.js: \
	game/sprite.ts \
	game/enemy.ts \
	game/player.ts \
	game/bullet.ts \
	game/canvas.ts \
	game/game.ts

%.html: %.pug head.pug
	pug -s -b . --doctype 'html' $<

%.css: %.styl
	stylus -u 'autoprefixer-stylus' -c $< $(Q)

%.js: %.ts
	tsc --removeComments $<
	browserify -o $@.tmp $@
	mv $@.tmp $@
	uglifyjs -cm --screw-ie8 --wrap -o $@ $@

clean:
	find . \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -delete

test:
	@open -g 'http://localhost:8080'
	@ruby -run -e httpd $(VQ)

deploy:
	git checkout -q master
	git pull -q --rebase origin master
	git push -q origin master
	@$(MAKE) clean all
	surge . $(VQ)

.PHONY: all clean test deploy
