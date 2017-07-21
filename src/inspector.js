(function () {
  "use strict";

  // ==========================================================================
  // The inspector module is the module running tests within pages
  // ==========================================================================


  // Define methods to evaluate two value
  // ----------------------------------------------------------------------------

  const operator = {
    exactly(a, b)  { return a === b },
    moreThan(a, b) { return a  >  b },
    lessThan(a, b) { return a  <  b }
  }


  // Define methods to evaluate search pattern and return the number of match.
  // ----------------------------------------------------------------------------

  const counter = {
    // Count the number of node matching a CSS selector
    //
    // @param  { String } selector
    // @return { Number }
    node(selector) {
      return document.querySelectorAll(selector).length
    },

    // Count the number of match of a given pattern
    // against the text content of the document
    //
    // @param  { String } pattern
    // @return { Number }
    text(pattern) {
      var rgx = new RegExp(pattern, 'ig');
      return (rgx[Symbol.match](document.body.innerText) || []).length;
    }
  }


  // Main actions for testing
  // ----------------------------------------------------------------------------

  // Check the validity of a test
  //
  // A test object is expected to have the following structure:
  // {
  //   type     : { string } Should match one of the key of the "counter" object
  //   operator : { string } Should match one of the key of the "operator" object
  //   selector : { string }
  //   number   : { number } A numbre greater or equal to 0
  // }
  //
  // @param  { Object  } A test object
  // @return { Boolean }
  function isTestValid(test) {
    return (
         test
      && test.type
      && counter[test.type]
      && test.operator
      && operator[test.operator]
      && typeof test.selector === "string"
      && test.number === +test.number
      && test.number >= 0
    );
  }

  // Evaluate a test against the page
  //
  // @param  { Object  } The test to perform
  // @return { Boolean }
  function checkTest(rule) {
    var count   = counter[rule.type]
    var compare = operator[rule.operator];

    return compare(count(rule.selector), rule.number);
  }

  // Main orchestrator function
  //
  // @param { object   } tests        : An object containing all the test to perform against the page
  // @param { object   } sender       : An object describing the add-on sending the tests object
  // @param { function } sendResponse : A callback function to send back the results of the tests
  function inspector(tests, sender, sendResponse) {
    // TODO: check sender ID ?
    // if (sender.id !== '...') return;
    // console.log(sender)

    var res = Object.keys(tests).reduce((list, id) => {
      var test = tests[id];

      if (isTestValid(test.rule)){
        list.push({id, pass: checkTest(test.rule)})
      }

      return list;
    }, []);

    if (sendResponse) {
      sendResponse(res); // Firefox behavior
    } else {
      return res; // Chrome behavior
    }
  }


  // Register add-on events
  // ----------------------------------------------------------------------------

  if (!browser.runtime.onMessage.hasListener(inspector)) {
    browser.runtime.onMessage.addListener(inspector)
  }

}());
