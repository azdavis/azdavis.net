build/catan-gen/index.html: build/catan-gen/index.js
build/catan-gen/index.js: $(shell find src/catan-gen -name "*.js")
build/clock/index.html: build/clock/index.js
build/resume/index.html: build/resume/index.js
build/touch-hockey/index.html: build/touch-hockey/index.js
build/touch-hockey/index.js: $(shell find src/touch-hockey -name "*.js")
