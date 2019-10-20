// ==========================================================================
// The rule manager is a set of setter/getter on top of the storage API to
// safely access and check the add-on look up rules.
// ==========================================================================

// /!\ DEPENDANCES /!\
// --------------------------------------------------------------------------
// /!\ Make sure the proper modules have been properly imported
import { _ } from './l10n.js'
const STORAGE = window._lkp_store

// USFULL CONSTANTS
// --------------------------------------------------------------------------
// Limit for number ID generator
const MAX_RAND_RANGE = 1000000

// MODULE LOGIC
// --------------------------------------------------------------------------

/**
 * Format and save a testing rule.
 *
 * @param  { String  } name The name of the testing rule.
 * @param  { String  } description The description of the testing rule.
 * @param  { String  } domain The domain name pattern for which the testing rule apply.
 * @param  { String  } target The url pattern for which the testing rule apply.
 * @param  { String  } rule The testing rules details to perform against the page content.
 * @param  { String  } id The id of the rule if it exist already.
 * @return { Promise }
 */
function save (name, description, domain, target, rule, id) {
  if (!id) {
    id = domain + '-' + Math.floor(Math.random() * MAX_RAND_RANGE)
  }

  return STORAGE.rules.set(id, { domain, name, description, target, rule })
}

/**
 * Remove an existing rule
 *
 * @param  { String  } id : the id of the rule to remove
 * @return { Promise }
 */
function clear (id) {
  if (!id) {
    return Promise.reject(new Error(_('ruleErrorClear')))
  }

  return STORAGE.rules.clear(id)
}

/**
 * Retrieve a single rule
 *
 * @param  { String  } id : the id of the rule to remove
 * @return { Promise }
 */
function get (id) {
  if (!id) {
    return Promise.reject(new Error(_('ruleErrorGet')))
  }

  return STORAGE.rules.get(id)
}

/**
 * Retrieve all rules as an Array of Arrays of strings describing each rule
 *
 * The Arrays of strings are structure as follow:
 * [ id, secure, domain, name, description ]
 *
 * @return { Promise<Array> }
 */
async function getAll () {
  var store = await STORAGE.rules.get()
  var rules = Object.keys(store).map((id) => {
    const p = store[id].target.slice(0, 6)
    const target = p === 'https:' ? 1 : p === 'http:/' ? 0 : -1
    return [
      id,
      target,
      store[id].domain,
      store[id].name,
      store[id].description
    ]
  })

  rules.sort((a, b) => {
    var domain = a[2].localeCompare(b[2])

    if (domain === 0) {
      return a[3].localeCompare(b[3])
    }

    return domain
  })

  return rules
}

// PUBLIC API
// --------------------------------------------------------------------------
const rulesManager = {
  save, get, clear, getAll
}

export { rulesManager }
