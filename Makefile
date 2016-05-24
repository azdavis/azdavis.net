Q = &> /dev/null
LCL = 'http://localhost:8080'

all: 404.html index.html
404.html: 404.css
index.html: index.css

%.html: %.pug
	pug --doctype 'html' $<

%.css: %.styl
	stylus --use 'autoprefixer-stylus' --compress $<

%.js: %.ts
	tsc --removeComments $<
	uglifyjs --mangle --compress --output $@ $@

clean:
	find . \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -delete

local-testing:
	@open -ga 'FirefoxDeveloperEdition' $(LCL)
	@open -ga 'Google Chrome' $(LCL)
	@open -ga 'Safari' $(LCL)
	@ruby -run -e httpd $(Q)

deploy: all
	surge .

.PHONY: all clean local-testing deploy
