src/google827af1fbb442e5a9.html:
	printf "google-site-verification: google827af1fbb442e5a9.html" \
		> src/google827af1fbb442e5a9.html

$(BINARY):
	curl -fsSL "http://azdavis.xyz/$(patsubst src/%,%,$@)" > $@

node_modules:
	npm i

.git/hooks:
	mkdir $@
	echo "make" > $@/pre-commit
	echo "make clean" > $@/post-checkout
	chmod +x $@/*
