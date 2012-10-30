module.exports = function(config) {

  // Ensure all properties has a format function
  config.groups.forEach(function(group) {
    Object.keys(group.properties).forEach(function(key) {
      if (group.properties[key].format === undefined) {
        group.properties[key].format = function(value) { return value }
      }
    })
  })

  // Ensure that this config has a valid title property to display.
  if ((config.title === undefined) || (config.groups[0].properties[config.title] === undefined)) {
    Object.keys(config.groups[0].properties).forEach(function (key) {
      if (config.title === undefined) {
        var property = config.groups[0].properties[key]
        if (property.type !== 'hidden' && property.type !== 'password' && property.view === true) {
          config.title = key
        }
      }
    })
    if (config.title === undefined) {
      throw new Error(config.groups[0].name + ' view config has no properties which can be used as the object title')
    }
  }
  return config
}