MAKEFLAGS += -rRs
SHELL = PATH=node_modules/.bin:$(PATH) sh
Q = &> /dev/null
BINARY = src/favicon.png src/touch_icon.png src/rut/a.mp3 src/rut/ci.png

all: \
	src/google827af1fbb442e5a9.html \
	$(patsubst %.pug,%.html,$(shell find src ! -path "*base*" -name "*.pug"))

include mk/deps.mk
include mk/pat.mk
include mk/misc.mk
include mk/phony.mk
