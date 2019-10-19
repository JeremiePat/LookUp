(function (LKP) {
  "use strict";

  // ==========================================================================
  // The settings module handle user interraction with the settings page
  // ==========================================================================

  // /!\ DEPENDANCES /!\
  // --------------------------------------------------------------------------
  // /!\ Make sure the proper modules have been properly imported

  const FORM  = LKP.ui.form;
  const TABLE = LKP.ui.table;
  const RULES = LKP.rulesManager;
  const JSON  = LKP.io.json;


  // UTILS
  // --------------------------------------------------------------------------

  // Simplified DOM event delegation
  document.on = function(event, selector, callback) {
    this.addEventListener(event, (e) => {
      if (e.target.matches(selector)) {
        callback.call(this, e);
      }
    })

    return this;
  }

  // Events Handler
  // --------------------------------------------------------------------------

  // Add button handler
  async function onAdd() {
    try {
      await RULES.save(...FORM.extract());
      document.querySelector('button.reset').click()
    } catch (e) {
      FORM.error(e);
    }
  }

  // Edit button handler
  async function onEdit(e) {
    var id = e.target.parentElement.attributes.id.value;

    FORM.switchType('update');
    await FORM.fill(id);
  }

  // Remove button handler
  async function onRemove(e) {
    var id = e.target.parentElement.attributes.id.value;

    await RULES.clear(id);
  }

  // Import button handler
  function onImport() {
    var INPUT = document.getElementById('importer');

    INPUT.addEventListener('change', () => {
      var file = INPUT.files[0];
      var reader = new FileReader();

      reader.addEventListener('loadend', async () => {
        await JSON.push(reader.result)
      })

      reader.readAsText(file);
    })

    INPUT.click()
  }

  // Export button handler
  async function onExport() {
    var filename = 'lookup-rules.json';
    var content  = await JSON.pull()
    var file     = new File([content], filename, {type: 'application/json'})

    browser.downloads.download({
      url      : URL.createObjectURL(file), // Should we take care of revoking that object URL?
      filename : filename,
      saveAs   : true
    })
  }


  // DOM Interaction set up
  // --------------------------------------------------------------------------

  // Each time the storage change, we update the the list of available rules
  browser.storage.onChanged.addListener(TABLE.settings);

  // Once to settings page is ready we update the list of existing rules
  window.addEventListener('DOMContentLoaded', TABLE.settings);

  // Listening some DOM events
  document
    // Recording a testing rule
    .on('click', '.add', onAdd)
    // Editing an existing testing rule
    .on('click', '.edit', onEdit)
    // Removing an existing rule
    .on('click', '.remove', onRemove)
    // Reseting the form
    .on('click', '.reset', () => {
      FORM.switchType('new');
    })
    // Handle import rules
    .on('click', '.import', onImport)
    // Handle export
    .on('click', '.export', onExport)

}(window.LKP || (window.LKP = {})));
