var _ = require('lodash')

// Apply a list of processors against submitted form. See test for more info.
function process(form, formMeta) {
  Object.keys(formMeta).forEach(function(key) {
    formMeta[key](key, form)
  })
}

// Add all the built in processor to the function. If you need something that
// isn't here, create it as a standalone module. This may well be refactored out
// in the future.
_.extend(process, {
  // Turns a string with a comma separated list of values into an array.
  split: function(key, form) {
    if ((form[key] !== undefined) && (typeof form[key] === 'string')) {
      form[key] = form[key].replace(/^(,|\s)*/,'').replace(/(,|\s)*$/,'').split(',').map(function(item) {
        return item.trim()
      })
      return form[key]
    }
  },
  // If a value is undefined then set make is a default value.
  defaultValue: function(value) {
    return function(key, form) {
      if (form[key] === undefined) {
        form[key] = value
      }
    }
  },
  // Anything other that undefined is considered true
  boolean: function(key, form) {
    form[key] = ((form[key] === undefined) || form[key] === false ||
      form[key] === null || form[key] === '') ? false : true
  },
  // If a value is given try and make it a date object
  date: function(key, form) {
    if (form[key] !== undefined) {
      form[key] = new Date(form[key])
    } else {
      form[key] = undefined
    }
  },
  // Sometimes you need a value to be null when no value is give.
  //TODO: Is there an example of when this is needed?
  //ALSO: Maybe there should be another processor to handle this.
  nullOrDate: function(key, form) {
    if (form[key] === undefined) {
      form[key] = new Date()
    } else {
      form[key] = null
    }
  },
  // Simple file upload forms have a file and a hidden. This combines them ready
  // for the file upload delegate.
  file: function(key, form) {
    var hiddenFile = 'current-' + key
    if (typeof form[hiddenFile] === 'string' && typeof form[key] === 'undefined') {
      form[key] = JSON.parse(form[hiddenFile])
    } else if (typeof form[hiddenFile] === 'string' && Array.isArray(form[key])) {
      form[key] = form[key].concat(JSON.parse(form[hiddenFile]))
    }
  },
  // If a remove image checkbox is checked this ensures the file is removed.
  removeImage: function(imageFields) {
    return function(key, form) {
      if (typeof form[key] !== 'undefined') {
        imageFields.forEach(function(imageField) {
          if (typeof form[imageField] !== 'undefined') {
            form[imageField].forEach(function(image) {
              form[key].forEach(function(imageHash) {
                if (imageHash === image.path) {
                  delete form[imageField][form[imageField].indexOf(image)]
                }
              })
            })
          }
        })
      }
      imageFields.forEach(function(imageField) {
        if (typeof form[imageField] !== 'undefined') {
          var strippedArray = []
          form[imageField].forEach(function(image) {
            if (image) {
              strippedArray.push(image)
            }
          })
          form[imageField] = strippedArray
        }
      })
    }
  }
})

module.exports = process;