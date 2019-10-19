(function (LKP) {
  "use strict";

  // ==========================================================================
  // The ui.list toolbox intent to handle HTML lists where needed.
  // ==========================================================================

  // /!\ DEPENDANCES /!\
  // --------------------------------------------------------------------------
  // /!\ Make sure the proper modules have been properly imported

  const STORAGE = LKP.storage;
  const RULES   = LKP.rulesManager;


  // MODULE LOGIC
  // --------------------------------------------------------------------------

  async function panel(tabId) {
    var results = await STORAGE.results.get(tabId);
    var list    = document.querySelector('ul');

    list.innerHTML = '';

    for (let result of results) {
      var rule        = await RULES.get(result.id);
      var cls         = result.pass ? 'success' : 'fail';
      var title       = rule.name;
      var description = rule.description;

      list.insertAdjacentHTML(
        'beforeend',
        `
        <li class="${cls}">
          <p>${title}
            <small>${description}</small>
          </p>
        </li>`)
    }
  }


  // PUBLIC API
  // --------------------------------------------------------------------------
  LKP.ui = LKP.ui || {}
  LKP.ui.list = {
    panel
  }

}(window.LKP || (window.LKP = {})));
