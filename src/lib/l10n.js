(function (LKP) {
  "use strict";

  // ==========================================================================
  // The l10n manager add some helpers and syntactic sugar to localized strings
  // within JS files and HTML files
  // ==========================================================================

  function get(key, ...params) {
    return browser.i18n.getMessage(key, ...params)
  }

  function updateDom() {
    [...document.querySelectorAll('[data-l10n]')].forEach((node) => {
      node.innerText = get(node.dataset.l10n);
    });

    [...document.querySelectorAll('[data-l10n-placeholder]')].forEach((node) => {
      node.placeholder = get(node.dataset.l10nPlaceholder);
    });
  }

  // DOM Binding
  // --------------------------------------------------------------------------
  window.addEventListener('DOMContentLoaded', updateDom);

  // PUBLIC API
  // --------------------------------------------------------------------------
  LKP.l10n = {
    _: get
  }

}(window.LKP || (window.LKP = {})));
