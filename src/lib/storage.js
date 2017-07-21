(function (LKP) {
  "use strict";

  // ==========================================================================
  // The storage manager provide a simple way to store and access rules and
  // results used by the add-on on top of the browser.storage API
  // ==========================================================================


  // MODULE LOGIC
  // --------------------------------------------------------------------------

  class SimpleStorage {
    constructor(name) {
      this.name  = name;
    }

    // Set value into the storage
    //
    // @param  { String  } id    : the id of the value to store
    // @param  { Any     } value : Any value to store (must be JSON stringifiable)
    // @return { Promise }
    async set(id, value) {
      var store = await this.get();

      store[id] = value;

      var obj = { [this.name]: store };

      return browser.storage.local.set(obj);
    }

    // Get value from the storage
    //
    // If no id (or inknown id) is provided, then an object containing all the
    // key/value pair is returned
    //
    // @param  { String } id : The id of the value to retreive
    // @return { Promise => Object | Any } The expected value
    async get(id) {
      var store = await browser.storage.local.get(this.name);
      var items = store[this.name] || {};

      if (id && items[id]) {
        return items[id]
      }

      return items;
    }

    // Clear the value of a given id
    //
    // If no id (or inknown id) is provided, then the whole store is cleared.
    //
    // @param  { String  } id : the id of the value to clear
    // @return { Promise }
    async clear(id) {
      if (!id) {
        return browser.storage.local.remove(this.name);
      }

      var store = await this.get();

      delete store[id];

      return browser.storage.local.set({ [this.name]: store });
    }
  }

  // PUBLIC API
  // --------------------------------------------------------------------------
  LKP.storage = {
    rules  : new SimpleStorage('rules'),
    results: new SimpleStorage('results')
  }

}(window.LKP || (window.LKP = {})));
