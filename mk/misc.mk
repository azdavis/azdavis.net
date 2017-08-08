build/google827af1fbb442e5a9.html:
	echo $@
	mkdir -p $(dir $@)
	printf "google-site-verification: google827af1fbb442e5a9.html" > $@

$(BINARY):
	echo $@
	mkdir -p $(dir $@)
	curl -fLo $@ "https://azdavis.xyz/$(patsubst build/%,%,$@)"

node_modules:
	echo $@
	npm i

.git/hooks/pre-commit:
	echo $@
	mkdir -p $(dir $@)
	echo "make" > $@
	chmod +x $@

.git/hooks/post-checkout:
	echo $@
	mkdir -p $(dir $@)
	echo "make clean" > $@
	chmod +x $@
