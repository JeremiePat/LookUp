// ==========================================================================
// The ui.form toolbox provide the tools necessary to handle the interaction
// with HTML forms
// ==========================================================================

// /!\ DEPENDANCES /!\
// --------------------------------------------------------------------------
// /!\ Make sure the necessary modules have been properly imported
import { _ } from './l10n.js'
import { utilsForm } from './utils.form.js'
import { rulesManager } from './rules.js'

// MODULE LOGIC
// --------------------------------------------------------------------------

/**
 * Extract values from the settings form and format it in a way it is
 * consumable by LKP.rulesManager.save from the "rule.js" module
 *
 * The return Array has the following structure:
 * [
 *   name        { String }
 *   description { String }
 *   domain      { String }
 *   target      { String }
 *   rule        { Object }
 *      {
 *        operator { String }
 *        number   { Number }
 *        type     { String }
 *        selector { String }
 *      }
 *   id          { String }
 * ]
 *
 * @return { Array }
 */
function extract () {
  var data = utilsForm.get()

  if (!data.name) { throw new Error(_('settingsErrorName')) }
  if (!data.domain) { throw new Error(_('settingsErrorDomain')) }
  if (!data.selector) { throw new Error(_('settingsErrorSelector')) }
  if (!data.description) { throw new Error(_('settingsErrorDescription')) }

  var target = data.protocol + data.domain + '/' + data.pattern
  var rule = {
    type: data.type,
    number: Number(data.number),
    operator: data.operator,
    selector: data.selector
  }

  return [
    data.name,
    data.description,
    data.domain,
    target,
    rule,
    data.id
  ]
}

/**
 * Fill the settings form with the content of a given rule to allow that rule to be updated
 *
 * @param  { String  } ruleId The id of the rule to push into the form
 * @return { Promise }
 */
async function fill (ruleId) {
  var rule = await rulesManager.get(ruleId)

  var protocol = rule.target.substr(0, rule.target.indexOf('://') + 3)
  var pattern = rule.target.substr(rule.target.indexOf('/', protocol.length) + 1)

  utilsForm.set({
    id: ruleId,
    name: rule.name,
    type: rule.rule.type,
    domain: rule.domain,
    number: rule.rule.number,
    operator: rule.rule.operator,
    selector: rule.rule.selector,
    description: rule.description,
    protocol,
    pattern
  })
}

/**
 * Handle error display
 *
 * @param { any } err The error to display. If falsy, the error box is removed
 */
function error (err) {
  var errorBox = document.querySelector('#error')

  if (!err) {
    errorBox.style.display = 'none'
    return
  }

  errorBox.innerText = err.message || String(err)
  errorBox.style.display = 'block'
}

/**
 * Allow to switch the settings form between "add" and "update" style
 *
 * Possible types are:
 * - new : turn the form in new mode (to create a new rule)
 * - update : turn the form in update mode (to update an existing rule)
 *
 * @param { String } type : The type to switch to
 */
function switchType (type) {
  var add = document.querySelector('button.add')
  var title = document.querySelector('#title')
  var reset = document.querySelector('button.reset')

  error(false)

  if (type === 'new') {
    utilsForm.set('id', '')

    add.innerText = _('settingsLabelAdd')
    title.innerText = _('settingsTitleAdd')
    reset.style.display = 'none'
    return
  }

  if (type === 'update') {
    add.innerText = _('settingsLabelUpdate')
    title.innerText = _('settingsTitleUpdate')
    reset.style.display = 'inline-block'
  }
}

// PUBLIC API
// --------------------------------------------------------------------------
const form = {
  extract, fill, switchType, error
}

export { form }
