// Book.js (c) 2012 LucidJS and other contributors
// backbone-lifeguard may be freely distributed under the MIT license.
// For further details and documentation:
// http://lucidjs.github.com/backbone-lifeguard

(function(root) {

  // Module loading
  var Backbone = root.Backbone || require('backbone'),
      _ = root._ || require('underscore'),
      Author = root.Author || require('./Author');
      //lifeguard = root.lifeguard || require('lifeguard');

  /**
  * A book in the Bookstore
  *
  * @class Book
  * @extends Backbone.Model
  * @constructor
  * @param model - Initial data model.  Can be a JS object or another Book.
  *     @param model.id - Bookstore ID
  *     @param model.ISBN {String} ISBN Code
  *     @param model.author {Author} Book author
  *     @param model.title {String} Book title
  *     @param model.pages {Integer} Number of pages in the book
  *     @param model.otherTitles {Book.List} Other titles from this author
  */
  
  root.Book = Backbone.Model.extend({

    fields: {
      id: {
        type: 'Integer',
        defaultValue: null
      },
      ISBN: {
        type: String,
        validate: function(isbn) {
          if (!isbn || isbn.length < 10) {
            return ("ISBN code not valid");
          }
        }
      },
      author: {
        type: Author
        // validate: lifeguard.notNull
      },
      title: {
        type: String
        // validate: lifeguard.notNull
      },
      pages: {
        type: 'Integer'
        // validate: lifeguard.notNull
      },
      similarAuthors: {type: Author.List}
    }
  });

  /**
  * Constructor for a list of Book objects
  *
  *     var myList = new Book.List(initialElements);
  *
  * @static
  * @method List
  * @param [items] {Array} Initial list items.  These can be raw JS objects or Book data model objects.
  * @return {Backbone.Collection} Collection of Book data model objects
  */
  root.Book.List = Backbone.Collection.extend({model: root.Book});


}(this));