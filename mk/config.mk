MAKEFLAGS += -rRs
SHELL := PATH=$(PWD)/node_modules/.bin:$(PATH) sh
BINARY := src/favicon.png src/touch-icon.png src/touch-hockey/index.manifest
