// ==========================================================================
// The ui.list toolbox intent to handle HTML lists where needed.
// ==========================================================================

// /!\ DEPENDANCES /!\
// --------------------------------------------------------------------------
// /!\ Make sure the proper modules have been properly imported
import { rulesManager } from './rules.js'
const STORAGE = window._lkp_store

// MODULE LOGIC
// --------------------------------------------------------------------------

async function listPanel (tabId) {
  const results = await STORAGE.results.get(tabId)
  if (!Array.isArray(results)) { return }

  const list = document.querySelector('ul')

  list.innerHTML = ''

  for (const result of results) {
    const rule = await rulesManager.get(result.id)
    const cls = result.pass ? 'success' : 'fail'
    const title = rule.name
    const description = rule.description

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

export { listPanel }
