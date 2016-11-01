src/google827af1fbb442e5a9.html:
	printf "google-site-verification: google827af1fbb442e5a9.html" \
		> src/google827af1fbb442e5a9.html

$(BINARY):
	curl -fL "http://azdavis.xyz/$(patsubst src/%,%,$@)" > $@

node_modules:
	npm i

.git/hooks/pre-commit:
	mkdir -p $(dir $@)
	echo "make" > $@
	chmod +x $@
