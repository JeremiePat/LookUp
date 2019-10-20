;(() => {
  'use strict'

  // ==========================================================================
  // The background module is the main orchestrator for the add-on
  // ==========================================================================

  // /!\ DEPENDANCES /!\
  // --------------------------------------------------------------------------
  // /!\ Make sure the necessary modules have been properly imported
  const STORAGE = window._lkp_store

  // MODULE LOGIC
  // --------------------------------------------------------------------------

  /**
   * Change the appearance of the add-on icon
   *
   * @param { Number } error The numbre of failing tests (-1 indicate no tests for that page)
   */
  function setErrorBadge (error) {
    error = Number(error)

    let text = '♥︎'

    if (error > 0) { text = String(error) }
    if (error < 0) { text = '' }

    const color = error === 0 ? 'green' : 'red'

    browser.browserAction.setBadgeText({ text })
    browser.browserAction.setBadgeBackgroundColor({ color })
  }

  /**
   * Retreive the tests for a given URL
   *
   * @param  { String } url The URL used to filter out tests
   * @return { Promise<Object> }
   */
  async function getTestsByURL (url) {
    var rules = await STORAGE.rules.get()

    return Object.keys(rules).reduce((tests, id) => {
      var test = rules[id]
      var rgx = new RegExp(test.target, 'i')

      if (rgx.test(url)) {
        tests[id] = test
      }

      return tests
    }, {})
  }

  /**
   * Retreive the test results for a given tab
   *
   * @param  { Number } tabId The id of the tab for which we want to retreave test results
   * @return { Promise<Array> } An Array with a custom property 'error'
   */
  async function getTabResults (tabId) {
    var result = await STORAGE.results.get(tabId)

    if (Array.isArray(result) && result.length > 0) {
      return result
    }

    var tab = await browser.tabs.get(tabId)
    var tests = await getTestsByURL(tab.url)
    var data = await browser.tabs.sendMessage(tabId, tests)

    if (data.length === 0) {
      data.errors = -1
    } else {
      data.errors = data.reduce((n, obj) => { return n + !obj.pass }, 0)
    }

    await STORAGE.results.set(tabId, data)
    return data
  }

  // Events handler
  // ----------------------------------------------------------------------------

  async function onActivated (info) {
    // Reset badge
    setErrorBadge(-1)

    var id = info.tabId || info

    if (!id) { return }

    var results = await getTabResults(id)

    setErrorBadge(results.errors)
  }

  async function onUpdated (id, info) {
    if (info.status !== 'complete') {
      return
    }

    await STORAGE.results.clear(id)

    return onActivated(id)
  }

  async function onChanged (info) {
    console.log('Trigger onChange')
    if (info.rules) {
      await STORAGE.results.clear()
    }
  }

  // Set up global event listeners
  // ----------------------------------------------------------------------------

  // When the rules are changed, we reset the cached results
  browser.storage.onChanged.addListener(onChanged)

  // When the tabs change we update the results for the active tab
  browser.tabs.onActivated.addListener(onActivated)
  browser.tabs.onUpdated.addListener(onUpdated)
})()
