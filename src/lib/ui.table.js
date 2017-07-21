(function (LKP) {
  "use strict";

  // ==========================================================================
  // The ui.table toolbox intent to handle HTML tables where needed.
  // ==========================================================================

  // /!\ DEPENDANCES /!\
  // --------------------------------------------------------------------------
  // /!\ Make sure the necessary modules have been properly imported

  const RULES = LKP.rulesManager;
  const _     = LKP.l10n._;


  // MODULE LOGIC
  // --------------------------------------------------------------------------

  async function settings() {
    var rules = await RULES.getAll();
    var tbody = document.querySelector('#rules')

    tbody.innerHTML = '';

    rules.forEach((rule) => {
      var [id, secure, domain, name, description] = rule;
      var edit   = _('panelLabelEdit');
      var remove = _('panelLabelRemove');
      secure = secure === 1 ? 'https' :
               secure === 0 ? 'http'  : 'both';

      tbody.insertAdjacentHTML(
        'beforeend',
        `
        <section>
          <header id="${id}">
            <div>
              <h2>${name}</h2>
              <code class="${secure}">${domain}</code>
            </div>
            <button class="edit"   title="${edit}"  ></button>
            <button class="remove" title="${remove}"></button>
          </header>
          <p>${description}</p>
        </section>`)
    });
  }


  // PUBLIC API
  // --------------------------------------------------------------------------
  LKP.ui = LKP.ui || {}
  LKP.ui.table = {
    settings
  }

}(window.LKP || (window.LKP = {})));
