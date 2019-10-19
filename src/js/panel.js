(function (LKP) {
  "use strict";

  // ==========================================================================
  // The panel module handle and bind everyting needed for the add-on panel
  // ==========================================================================

  // /!\ DEPENDANCES /!\
  // --------------------------------------------------------------------------
  // /!\ Make sure the proper modules have been properly imported

  const LIST = LKP.ui.list;


  // EVENT HANDLERS
  // --------------------------------------------------------------------------
  function openSettings(e) {
    if (e.target.matches('button')) {
      browser.runtime.openOptionsPage();
    }
  }

  async function updateResults() {
    var win = await browser.windows.getCurrent();
    var tab = await browser.tabs.query({
      active: true,
      windowId: win.id
    });

    LIST.panel(tab[0].id);
  }

  // DOM Interaction binding
  // --------------------------------------------------------------------------

  // Handle clicking on the button to add a new rule
  document.addEventListener('click', openSettings);

  // Update results list when the document is ready
  document.addEventListener('DOMContentLoaded', updateResults)

}(window.LKP || (window.LKP = {})));
