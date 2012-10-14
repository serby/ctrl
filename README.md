# ctrl CMS

A node.js CMS application that is a great starting point for most web-base
projects

More information can be found in the
[wiki](https://github.com/serby/ctrl/wiki/_pages)

## Installation

Create the ctrl app:

     git clone git://github.com/serby/ctrl.git

Install dependencies:

     npm install

## Updating

If you pull a new version, always install any new packages.

    git pull origin master
    npm install

If you switch node versions or you are having problems after pulling try and
rebuild.

    npm rebuild

## Usage

### Starting ctrl

     node app

Then goto [http://localhost:3021/admin](http://localhost:3021/admin) in a
browser and follow the instructions.

## Contributions

All contributions to this project are welcome. Your pull request is much more
likely to be accepted if you follow our
[style-guide](https://github.com/bengourley/js-style-guide).

### Linting

Please run the linter and fix any errors before committing.

    make lint

The [.jslintrc](https://github.com/serby/ctrl/blob/master/.jshintrc) that should
be used can be found in the project root.

## Author

[Paul Serby](https://github.com/serby/) follow me on [twitter](http://twitter.com/serby)

## Licence

Licenced under the [New BSD License](http://opensource.org/licenses/bsd-license.php)