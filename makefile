MAKEFLAGS += -rRs
SHELL := PATH=node_modules/.bin:$(PATH) sh
Q := &> /dev/null
BINARY := src/favicon.png src/touch_icon.png src/rut/a.mp3 src/rut/ci.png

include mk/phony.mk
include mk/precious.mk
include mk/deps.mk
include mk/misc.mk
