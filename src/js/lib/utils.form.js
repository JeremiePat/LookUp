// ==========================================================================
// The utils.form toolbox provide generics tools to interact with HTML forms
// ==========================================================================

// MODULE LOGIC
// --------------------------------------------------------------------------

function getFormValues (name) {
  if (name) {
    return document.querySelector('form [name=' + name + ']').value
  }

  return Array
    .from(document.querySelectorAll('form [name]'))
    .reduce((values, node) => {
      values[node.name] = node.value.trim()

      return values
    }, {})
}

function setFormValues (names, value) {
  if (typeof names === 'string') {
    document.querySelector('[name=' + names + ']').value = String(value)
    return
  }

  Object.keys(names).forEach((name) => {
    var value = names[name]

    document.querySelector('[name=' + name + ']').value = String(value)
  })
}

// PUBLIC API
// --------------------------------------------------------------------------
const utilsForm = {
  get: getFormValues,
  set: setFormValues
}

export { utilsForm }
