(function (LKP) {
  "use strict";

  // ==========================================================================
  // The ui.form toolbox provide the tools necessary to handle the interaction
  // with HTML forms
  // ==========================================================================

  // /!\ DEPENDANCES /!\
  // --------------------------------------------------------------------------
  // /!\ Make sure the necessary modules have been properly imported

  const RULES = LKP.rulesManager
  const FORM  = LKP.utils.form;
  const _     = LKP.l10n._;


  // MODULE LOGIC
  // --------------------------------------------------------------------------

  // Extract values from the settings form and format it in a way it is
  // consumable by LKP.rulesManager.save from the "rule.js" module
  //
  // The return Array has the following structure:
  // [
  //   name        { String }
  //   description { String }
  //   domain      { String }
  //   target      { String }
  //   rule        { Object }
  //      {
  //        operator { String }
  //        number   { Number }
  //        type     { String }
  //        selector { String }
  //      }
  //   id          { String }
  // ]
  //
  // @return { Array }
  function extract() {
    var data = FORM.get()

    if (!data.name)        { throw new Error(_('settingsErrorName'       )) }
    if (!data.description) { throw new Error(_('settingsErrorDescription')) }
    if (!data.domain)      { throw new Error(_('settingsErrorDomain'     )) }
    if (!data.selector)    { throw new Error(_('settingsErrorSelector'   )) }

    var target = data.protocol + data.domain + '/' + data.pattern
    var rule   = {
      operator: data.operator,
      number:   Number(data.number),
      type:     data.type,
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

  // Fill the settings form with the content of a given rule
  // to allow that rule to be updated
  //
  // @param { String } ruleId
  async function fill(ruleId) {
    var rule = await RULES.get(ruleId);

    var protocol = rule.target.substr(0, rule.target.indexOf('://') + 3);
    var pattern  = rule.target.substr(rule.target.indexOf('/', protocol.length) + 1)

    FORM.set({
      id:          ruleId,
      domain:      rule.domain,
      name:        rule.name,
      description: rule.description,
      operator:    rule.rule.operator,
      number:      rule.rule.number,
      type:        rule.rule.type,
      selector:    rule.rule.selector,
      protocol, pattern
    })
  }

  // Handle error display
  //
  // @param { Any } err: The error to display. If falsy, the error box is removed
  function error(err) {
    var errorBox = document.querySelector('#error');

    if (!err) {
      errorBox.style.display = 'none';
      return
    }

    errorBox.innerText = err.message || String(err);
    errorBox.style.display = 'block';
  }

  // Allow to switch the settings form between "add" and "update" style
  //
  // Possible types are:
  // - new : turn the form in new mode (to create a new rule)
  // - update : turn the form in update mode (to update an existing rule)
  //
  // @param { String } type : The type to switch to
  function switchType(type) {
    var title = document.querySelector('#title')
    var add   = document.querySelector('button.add')
    var reset = document.querySelector('button.reset')

    error(false);

    if (type === 'new') {
      FORM.set('id', '');

      title.innerHTML     = _('settingsTitleAdd');
      add.innerHTML       = _('settingsLabelAdd');
      reset.style.display = 'none'
      return
    }

    if (type === 'update') {
      title.innerHTML     = _('settingsTitleUpdate');
      add.innerHTML       = _('settingsLabelUpdate');
      reset.style.display = 'inline-block'
      return
    }
  }


  // PUBLIC API
  // --------------------------------------------------------------------------
  LKP.ui = LKP.ui || {};
  LKP.ui.form = {
    extract, fill, switchType, error
  }

}(window.LKP || (window.LKP = {})));
