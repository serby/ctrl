test:
	@./node_modules/.bin/mocha \
		-r should \
		-R spec

lint:
	@jshint lib test

lint-changed:
	@jshint `git status --porcelain | sed -e "s/^...//g"`

clean:
	@find . -name '*.orig' -delete

.PHONY: test lint lint-changed clean