fs = require 'fs'
path = require 'path'
async = require 'async'
properties = require('./properties').getProperties()

exec = (command, callback) ->
	console.log 'Excecuting \'' + command + '\''
	require('child_process').exec command, callback

option '-f', '--file [FILE]', 'Use file in task'

task 'setup', 'Create required directories', (options) ->
	async.map [
		'mkdir -p ' + properties.dataPath,
		'mkdir -p ' + properties.cachePath,
		'mkdir -p ' + properties.logPath,
		'mkdir -p pids',
		'chown -R `whoami` ' + properties.dataPath,
		'chown -R `whoami` ' + properties.cachePath,
		'chown -R `whoami` ' + properties.logPath,
		'chown -R `whoami` pids'
	], (command, callback) ->
		exec command, execOutput
		callback null
	,(error) ->
		if error
			log error
		else
			log 'Setup complete'

task 'delintAll', 'Runs jshint on all js code', (options) ->

	paths = 'lib bundles test'
	if options.file
		paths = options.file

	exec 'jshint ' + paths, execOutput

task 'delint', 'Runs all modified or added files through jshint', (options) ->
	exec 'jshint `git status --porcelain | sed "/^ D/d" | sed -e "s/^...//g"`', execOutput

task 'test', 'Runs all unit tests', (options) ->
	exec 'find test -name "*.test.js"', (error, stout, stderr) ->
		stout.trim().split('\n').map (value) ->
			exec 'expresso ' + value, execOutput

task 'createIndexes', 'Creates mongodb indexes', (options) ->
	log 'Creating mongodb indexes...'
	exec 'mongo ' + (process.env.DATABASE || properties.database.name) + ' support/Database/indexes.js',execOutput

task 'clearBinaryCacheTask', 'Clears out the images cache etc created from the binaries', (options) ->
	exec 'rm -rf ' + properties.cachePath + '/*'

task 'clearTempFiles', 'Removes any .orig etc from', (options) ->
	exec 'find . -name  "*.orig" -delete', execOutput
	exec 'find . -name  "*.swp" -delete', execOutput

execOutput = (error, stout, sterr) ->
	if sterr
		console.warn sterr
	if stout
		console.log stout

log = console.log
