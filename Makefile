%.html: %.pug %.css
	pug $<

%.css: %.styl
	stylus --use 'autoprefixer-stylus' --compress $<

clean:
	find . \( -name '*.html' -o -name '*.css' \) -delete
