.PHONY: clean install build test all

NPM ?= npm

clean:
	rm -rf dist node_modules/.cache

install:
	$(NPM) install

build: install
	$(NPM) run build

test: install
	$(NPM) run lint

all: build
