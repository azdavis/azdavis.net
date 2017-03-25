.PHONY: all clean test git-ok surge upload setup deploy

all: \
	src/google827af1fbb442e5a9.html \
	$(patsubst %.pug,%.html,$(shell find src ! -path "*_base*" -name "*.pug"))

clean:
	find src "(" \
		-name "*.html" -o \
		-name "*.css" -o \
		-name "*.c.js" \
	")" -delete

test:
	printf '%s:8888\n' "$$(curl -fsSL ifconfig.co)" ;\
	http-server src -p 8888 -s &\
	trap exit INT ;\
	while true; do find src "(" \
		-not -name "*.html" -a \
		-not -name "*.css" -a \
		-not -name "*.c.js" \
	")" | entr -d $(MAKE) || [ $$? -eq 2 ]; done

git-ok:
	! git status -unormal --porcelain | grep -q .
	[ "$$(git rev-parse --abbrev-ref @)" = master ]

surge:
	if ! grep -q "surge.sh" "$$HOME/.netrc"; then \
		surge login ;\
	fi

upload:
	git push -q origin master
	mv src/404/index.html src/404.html
	surge -d azdavis.xyz -p src \
		2> /dev/null \
		| grep size \
		| sed -E "s/$$(printf '\e\[90m +size: \e\[39m')//g"
	mv src/404.html src/404/index.html

setup: \
	.git/hooks/pre-commit .git/hooks/post-checkout node_modules $(BINARY) surge

deploy: setup git-ok all upload
