build/favicon.png: src/favicon.png
	echo $@ && mkdir -p $(dir $@)
	cp $< $@

build/touch-icon.png: src/touch-icon.png
	echo $@ && mkdir -p $(dir $@)
	cp $< $@

build/keybase.txt: src/keybase.txt
	echo $@ && mkdir -p $(dir $@)
	cp $< $@

build/google827af1fbb442e5a9.html: src/google827af1fbb442e5a9.html
	echo $@ && mkdir -p $(dir $@)
	cp $< $@

node_modules:
	echo $@
	npm i

.git/hooks/pre-commit:
	echo $@ && mkdir -p $(dir $@)
	echo "make" > $@
	chmod +x $@

.git/hooks/post-checkout:
	echo $@ && mkdir -p $(dir $@)
	echo "make clean" > $@
	chmod +x $@
