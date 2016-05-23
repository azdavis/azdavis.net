Q = &> /dev/null
LCL = 'http://localhost:8080'

all: index.html 404.html

%.html: %.pug %.css
	pug $<

%.css: %.styl
	stylus --use 'autoprefixer-stylus' --compress $<

clean:
	find . \( -name '*.html' -o -name '*.css' \) -delete

test:
	@open -ga 'FirefoxDeveloperEdition' $(LCL)
	@open -ga 'Google Chrome' $(LCL)
	@open -ga 'Safari' $(LCL)
	@ruby -run -e httpd $(Q)

deploy: all
	surge .

.PHONY: all clean test deploy
