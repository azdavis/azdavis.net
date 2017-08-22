build/%: src/%
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
