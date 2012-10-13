test:
	@./node_modules/.bin/mocha \
		-r should \
		-R spec

lint:
	@find . -name '*.js' -and -not -regex '.*/public/.*' -and -not -regex '.*/node_modules/.*' -exec jshint {} \;

lint-changed:
	@jshint `git status --porcelain | sed -e "s/^...//g"`

clean:
	@find . -name '*.orig' -delete

.PHONY: test lint lint-changed clean