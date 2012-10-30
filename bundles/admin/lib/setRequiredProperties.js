/**
 * Iterates through an entity schema object and an admin view schema object.
 *
 * Properties that are required in the entitySchema are set to be required in the viewSchema.
 * This can be overridden in the view schema by setting required to false.
 */
module.exports = function(schema, viewSchema) {
  Object.keys(schema).forEach(function(value) {
    Object.keys(viewSchema.groups).forEach(function(groupValue) {
      Object.keys(viewSchema.groups[groupValue].properties).forEach(function(propertyValue){
        if (value === propertyValue && schema[value].required) {
          if (typeof viewSchema.groups[groupValue].properties[propertyValue].required === 'undefined') {
            viewSchema.groups[groupValue].properties[propertyValue].required = true
          }
        }
      })
    })
  })

  return viewSchema
}
