Q = > /dev/null
VQ = &$(Q)

all: 404.html index.html
404.html: 404.css
index.html: index.css

%.html: %.pug
	pug -s --doctype 'html' $<

%.css: %.styl
	stylus -u 'autoprefixer-stylus' -c $< $(Q)

%.js: %.ts
	tsc --removeComments $<
	uglifyjs -cm --screw-ie8 --wrap -o $@ $@

clean:
	find . \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -delete

server:
	@open -ga 'Google Chrome' 'http://localhost:8080'
	@ruby -run -e httpd $(VQ)

deploy: clean all
	surge .

.PHONY: all clean server deploy
