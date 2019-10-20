// ==========================================================================
// The l10n manager add some helpers and syntactic sugar to localize strings
// within JS files and HTML files
// ==========================================================================

function get (key, ...params) {
  return browser.i18n.getMessage(key, ...params)
}

function updateDom () {
  Array
    .from(document.querySelectorAll('[data-l10n]'))
    .forEach(node => {
      node.innerText = get(node.dataset.l10n)
    })

  Array
    .from(document.querySelectorAll('[data-l10n-placeholder]'))
    .forEach(node => {
      node.placeholder = get(node.dataset.l10nPlaceholder)
    })
}

// DOM Update on module load
// --------------------------------------------------------------------------
if (document.readyState === 'interactive' ||
    document.readyState === 'complete') {
  updateDom()
} else {
  window.addEventListener('DOMContentLoaded', updateDom)
}

// PUBLIC API
// --------------------------------------------------------------------------
const _ = get

export { _ }
