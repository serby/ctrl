(function () {

  /*
   * Module store and
   * instance cache
   */
  var modules = {}
    , instances = {};

  /*
   * Define a module
   */
  function module(name, module) {

    if (typeof modules[name] !== 'undefined') {
      throw new Error('Module `' + name + '` is already defined');
    }

    modules[name] = module;
    return;

  }

  /*
   * Require a module
   */
  function require(name) {

    if (typeof modules[name] === 'undefined') {
      throw new Error('Module `' + name + '` is not defined');
    }

    // Run the module function
    // if it's not been run yet
    if (!instances[name]) {

      // Create the exports
      // to pass to the function
      var m = { exports: {} };

      // Execute the module function in
      // the context of an empty object
      // to sandbox local variables
      modules[name].apply({}, [m]);

      // Cache the exports
      instances[name] = m.exports;

    }

    // Return the cached exports
    return instances[name];

  }

  // Expose on the window object
  window.require = require
  window.module = module

}());