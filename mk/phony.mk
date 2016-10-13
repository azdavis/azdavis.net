clean:
	find src \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -delete

test:
	http-server src $(Q) & \
	trap "kill $$!; exit" INT; \
	open -g "http://localhost:8080" & \
	while true; do find . \
		-not -path "*.git*" \
		-a -not -path "*node_modules*" \
		| entr -d $(MAKE) || [ $$? == 2 ]; \
	done

git-ok:
	[ -z "$$(git status --porcelain)" ]
	[ "$$(git rev-parse --abbrev-ref @)" = master ]

surge:
	grep -q "surge.sh" ~/.netrc || surge login

upload:
	git push -q origin master
	mv src/404/index.html src/404.html
	surge -d azdavis.xyz -p src $(Q)
	mv src/404.html src/404/index.html

setup: .git/hooks/pre-commit node_modules $(BINARY) surge

deploy: setup git-ok all upload
