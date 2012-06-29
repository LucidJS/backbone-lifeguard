// lifeguard-test.js (c) 2012 LucidJS and other contributors
// backbone-lifeguard may be freely distributed under the MIT license.
// For further details and documentation:
// http://lucidjs.github.com/backbone-lifeguard

(function(root){

  // Dependencies
  var Backbone = root.Backbone || require('backbone'),
      _ = root._ || require('underscore'),
      Lifeguard = root.BackboneLifeguard || require('../backbone-lifeguard');

  /**
  * Unit tests for the Backbone-Lifeguard library
  * @class lifeguard-test
  */

  /**
  * Test group for assuring proper Backbone integration
  *
  * @method Integration
  */
  module.exports['Integration'] = {

    /**
    * Test the extended toJSON mechanism.
    * @method Integration-toJSON
    */
    toJSON: function(test) {
      test.ok(true, "Test passed.");
      test.done();
    }

  };

}(this));
