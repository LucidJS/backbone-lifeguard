// Author.js (c) 2012 LucidJS and other contributors
// backbone-lifeguard may be freely distributed under the MIT license.
// For further details and documentation:
// http://lucidjs.github.com/backbone-lifeguard

(function(root) {

  // Module loading
  var Backbone = root.Backbone || require('backbone'),
      _ = root._ || require('underscore');

  /**
  * Author of a Book
  *
  * @class Author
  * @extends Backbone.Model
  * @constructor
  * @param model - Initial data model.  Can be a JS object or another Book.
  *     @param model.id - Unique author ID
  *     @param model.firstName {String} Author first name
  *     @param model.lastName {String} Author last name
  *     @param model.titles {Book.List} List of books written by this author
  */
  
  root.Author = Backbone.Model.extend({

    defaults: {
      id: null,
      firstName: null,
      lastName: null,
      titles: null
    },

  });

  /**
  * Constructor for a list of Author objects
  *
  *     var myList = new Author.List(initialElements);
  *
  * @static
  * @method List
  * @param [items] {Array} Initial list items.  These can be raw JS objects or Author data model objects.
  * @return {Backbone.Collection} Collection of Author data model objects
  */
  root.Author.List = Backbone.Collection.extend({model: root.Author});


  
}(this));