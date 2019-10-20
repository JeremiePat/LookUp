// ==========================================================================
// The io.json module handle import/import of rules in JSON format
// ==========================================================================

// /!\ DEPENDANCES /!\
// --------------------------------------------------------------------------
// /!\ Make sure the proper modules have been properly imported

const STORAGE = window._lkp_store

// Module logic
// --------------------------------------------------------------------------

async function push (str) {
  var data = JSON.parse(str)
  var keys = Object.keys(data)

  for (const id of keys) {
    await STORAGE.rules.set(id, data[id])
  }
}

async function pull () {
  var data = await STORAGE.rules.get()

  return JSON.stringify(data)
}

// DOM Interaction binding
// --------------------------------------------------------------------------
// PUBLIC API
// --------------------------------------------------------------------------
const json = {
  push, pull
}

export { json }
