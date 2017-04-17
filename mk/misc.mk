src/google827af1fbb442e5a9.html:
	echo $@
	printf "google-site-verification: google827af1fbb442e5a9.html" \
		> src/google827af1fbb442e5a9.html

$(BINARY):
	echo $@
	curl -fLo $@ "https://azdavis.xyz/$(patsubst src/%,%,$@)"

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
