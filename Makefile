REPORTER = spec
BASE = .
JSHINT = ./node_modules/.bin/jshint

all: lint test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
				--reporter $(REPORTER)

lint:
	$(JSHINT) ./lib --config $(BASE)/.jshintrc && \
	$(JSHINT) ./test --config $(BASE)/.jshintrc

.PHONY: test