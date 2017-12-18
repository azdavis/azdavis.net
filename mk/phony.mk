all: \
	setup \
	build/favicon.png \
	build/touch-icon.png \
	build/keybase.txt \
	build/google827af1fbb442e5a9.html \
	$(patsubst src/%.pug,build/%.html,$(shell find src ! -path "*_base*" -name "*.pug"))

clean:
	rm -rf build

test:
	serve -s build & \
	trap exit INT && \
	find src | entr $(MAKE)

git-ok:
	! git status -unormal --porcelain | grep -q .
	[ "$$(git rev-parse --abbrev-ref @)" = master ]

netlify:
	if ! [ -e "$$HOME/.netlify/config" ]; then \
		$(N)netlify open; \
	fi

upload:
	git push origin master
	mv build/404/index.html build/404.html
	$(N)netlify deploy
	mv build/404.html build/404/index.html

setup: \
	.git/hooks/pre-commit \
	node_modules \
	netlify

deploy: git-ok all upload
