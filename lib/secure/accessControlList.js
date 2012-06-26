var _ = require('underscore');

module.exports.createAccessControlList = function(logger) {
  var
    acl = {
      '*': {
        actions: {
          '*': []
        }
      }
    };

  function clearGrants() {
    Object.keys(acl).forEach(function(resource) {
      Object.keys(acl[resource].actions).forEach(function(action) {
        acl[resource][action] = [];
      });
    });
  }

  /**
   *
   */
  function addResource(resource, resourceOptions) {

    if (acl[resource] === undefined) {

      var options = {
        actionList: ['create', 'read', 'update', 'delete', '*']
      };

      _.extend(options, resourceOptions);

      if (!Array.isArray(options.actionList)) {
        throw new TypeError('actionList is excepted to be an array of action ' +
        'names that can be performed on the resource \'' + resource + '\'');
      }


      var actions = {};

      options.actionList.forEach(function (action) {
        actions[action] = [];
      });

      logger.verbose('Adding resource \'' + resource + '\' to access control list');
      acl[resource] =
        { description: options.description
        , actions: actions
        };

    } else {
      logger.verbose('Resource \'' + resource + '\' already added');
    }
  }

  /**
   * Grant a given target permission to perform the given action a resource
   *
   * @param {String} target
   * @param {String} resource
   * @param {String} action
   */
  function grant(target, resource, action) {
    // Ensure the resource has been added
    if (acl[resource] === undefined) {
      return logger.warn('Unknown resource: ' + resource);
      //throw new RangeError('Unknown resource: ' + resource);
    }
    if (acl[resource].actions[action] === undefined) {
      acl[resource].actions[action] = [target];
    } else if (acl[resource].actions[action].indexOf(target) === -1) {
      acl[resource].actions[action].push(target);
    }
  }

  function revoke(target, resource, action) {

  }

  function targetAllowed(target, resource, action) {
    return acl[resource] && acl[resource].actions[action] &&
      ((acl[resource].actions[action].indexOf(target) !== -1) ||
        (acl[resource].actions['*'] && acl[resource].actions['*'].indexOf(target) !== -1));
  }

  function allowed(targets, resource, action, callback) {

    var target;

    if (!Array.isArray(targets)) {
      targets = [targets];
    }

    for (var i = 0; i < targets.length; i++) {

      target = targets[i];

      // Allow wildcard resource. This allows you to create a target with
      //    grant('root', '*', '*')
      // Who will always have access
      if (acl['*'].actions['*'].indexOf(target) !== -1) {
        if (callback) {
          callback(null, true);
        }
        return true;
      }

      if (targetAllowed(target, resource, action)) {
        if (callback) {
          callback(null, true);
        }
        return true;
      }
    }

    if (callback) {
      callback(null, false);
    }

    return false;
  }

  /**
   * Returns a readonly copy of the
   */
  function getAcl() {
    // var copyOfAcl = {};

    // Object.keys(acl).forEach(function(resource) {
    // copyOfAcl[resource].actions = acl.actions;
    // });
    return acl;
  }

  return (
    { get acl() { return acl; }
    , addResource: addResource
    , clearGrants: clearGrants
    , grant: grant
    , revoke: revoke
    , allowed: allowed
    });
};